import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import {
  TOPICS,
  getTopic,
  hubFileForTrack,
  topicForFile,
  type Topic,
  type TrackId,
} from "@/lib/catalog";
import {
  parseTopicMarkdown,
  parseTopicOutline,
  type ConceptOutline,
  type ParsedTopic,
} from "./parse";

const RESOURCES_ROOT = path.join(process.cwd(), "resources");

type StoredRead = {
  readonly stamp: string;
  readonly result: ReadTopicResult;
};

type OutlineEntry = {
  readonly stamp: string;
  readonly value: readonly ConceptOutline[];
};

type ParsedEntry = {
  readonly stamp: string;
  readonly promise: Promise<ParsedTopic>;
};

const PARSE_LOGIC_REVISION = 3;

type ParseCache = {
  markdown: Map<string, StoredRead>;
  outlines: Map<string, OutlineEntry>;
  parsed: Map<string, ParsedEntry>;
};

const globalForParse = globalThis as typeof globalThis & {
  __topicParseCache?: ParseCache;
};

function parseCache(): ParseCache {
  globalForParse.__topicParseCache ??= {
    markdown: new Map(),
    outlines: new Map(),
    parsed: new Map(),
  };
  return globalForParse.__topicParseCache;
}

export function resourcesDir(locale: Locale = DEFAULT_LOCALE): string {
  return path.join(RESOURCES_ROOT, locale);
}

export type ReadTopicResult = {
  readonly markdown: string;
  readonly locale: Locale;
  readonly usedFallback: boolean;
};

function resolveInside(locale: Locale, file: string): string {
  const dir = resourcesDir(locale);
  const resolved = path.resolve(dir, file);
  if (!resolved.startsWith(path.resolve(dir))) {
    throw new Error(`Refusing to read outside resources/${locale}/: ${file}`);
  }
  return resolved;
}

function cacheKey(locale: Locale, file: string): string {
  return `${locale}\0${file}`;
}

function fileStamp(absPath: string): string | undefined {
  try {
    const stat = fs.statSync(absPath);
    return `${stat.mtimeMs}:${stat.size}`;
  } catch {
    return undefined;
  }
}

function loadDetailed(file: string, locale: Locale): StoredRead {
  const primary = resolveInside(locale, file);
  const primaryStamp = fileStamp(primary);
  const key = cacheKey(locale, file);
  const store = parseCache().markdown;

  if (primaryStamp) {
    const stamp = `own:${primaryStamp}`;
    const hit = store.get(key);
    if (hit?.stamp === stamp) {
      return hit;
    }
    const stored: StoredRead = {
      stamp,
      result: {
        markdown: fs.readFileSync(primary, "utf8"),
        locale,
        usedFallback: false,
      },
    };
    store.set(key, stored);
    return stored;
  }

  if (locale !== DEFAULT_LOCALE) {
    const fallback = resolveInside(DEFAULT_LOCALE, file);
    const fallbackStamp = fileStamp(fallback);
    if (fallbackStamp) {
      const stamp = `fallback:${fallbackStamp}`;
      const hit = store.get(key);
      if (hit?.stamp === stamp) {
        return hit;
      }
      const stored: StoredRead = {
        stamp,
        result: {
          markdown: fs.readFileSync(fallback, "utf8"),
          locale: DEFAULT_LOCALE,
          usedFallback: true,
        },
      };
      store.set(key, stored);
      return stored;
    }
  }

  throw new Error(
    `Missing topic file in resources/${locale}/: ${file} (cwd=${process.cwd()})`,
  );
}

export function readTopicFile(
  file: string,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return readTopicFileDetailed(file, locale).markdown;
}

export function readTopicFileDetailed(
  file: string,
  locale: Locale = DEFAULT_LOCALE,
): ReadTopicResult {
  return loadDetailed(file, locale).result;
}

export function topicFileExists(file: string, locale: Locale): boolean {
  return fs.existsSync(resolveInside(locale, file));
}

export function loadTopicOutline(
  topic: Topic,
  locale: Locale = DEFAULT_LOCALE,
): readonly ConceptOutline[] {
  const { stamp, result } = loadDetailed(topic.file, locale);
  const key = cacheKey(locale, topic.file);
  const store = parseCache().outlines;
  const hit = store.get(key);
  if (hit?.stamp === stamp) {
    return hit.value;
  }
  const value = parseTopicOutline(result.markdown, locale);
  store.set(key, { stamp, value });
  return value;
}

export function loadFileOutline(
  file: string,
  locale: Locale = DEFAULT_LOCALE,
): readonly ConceptOutline[] {
  const { stamp, result } = loadDetailed(file, locale);
  const key = cacheKey(locale, file);
  const store = parseCache().outlines;
  const hit = store.get(key);
  if (hit?.stamp === stamp) {
    return hit.value;
  }
  const value = parseTopicOutline(result.markdown, locale);
  store.set(key, { stamp, value });
  return value;
}

export async function loadHubPage(
  trackId: TrackId,
  locale: Locale = DEFAULT_LOCALE,
): Promise<
  | {
      file: string;
      parsed: ParsedTopic;
      usedFallback: boolean;
    }
  | undefined
> {
  const file = hubFileForTrack(trackId);
  if (!file) {
    return undefined;
  }
  const loaded = await loadParsedFromFile(file, locale);
  if (loaded.parsed.concepts.length === 0) {
    return undefined;
  }
  return { file, ...loaded };
}

function loadParsedFromFile(
  file: string,
  locale: Locale,
): Promise<{ parsed: ParsedTopic; usedFallback: boolean }> {
  const { stamp, result } = loadDetailed(file, locale);
  const key = cacheKey(locale, file);
  const store = parseCache().parsed;
  const parsedStamp = parsedCacheStamp(stamp, file);
  const hit = store.get(key);
  const pending =
    hit?.stamp === parsedStamp
      ? hit.promise
      : startParsed(store, key, parsedStamp, result.markdown, locale, file);
  return pending.then((parsed) => ({
    parsed,
    usedFallback: result.usedFallback,
  }));
}

function parseOptionsForFile(file: string, locale: Locale) {
  const topic = topicForFile(file);
  return {
    ...(topic?.hideAnswers ? { hideAnswers: true as const } : {}),
    locale,
  };
}

function parsedCacheStamp(fileStamp: string, file: string): string {
  const hideAnswers = topicForFile(file)?.hideAnswers ? "1" : "0";
  return `${fileStamp}|ha:${hideAnswers}|rev:${PARSE_LOGIC_REVISION}`;
}

export function clearTopicParseCache(): void {
  const store = globalForParse.__topicParseCache;
  if (!store) {
    return;
  }
  store.parsed.clear();
  store.outlines.clear();
  store.markdown.clear();
}

function startParsed(
  store: Map<string, ParsedEntry>,
  key: string,
  stamp: string,
  markdown: string,
  locale: Locale,
  file: string,
): Promise<ParsedTopic> {
  const promise = parseTopicMarkdown(
    markdown,
    locale,
    parseOptionsForFile(file, locale),
  );
  store.set(key, { stamp, promise });
  promise.catch(() => {
    const current = store.get(key);
    if (current?.promise === promise) {
      store.delete(key);
    }
  });
  return promise;
}

export const loadParsedTopic = cache(
  async (
    topic: Topic,
    locale: Locale = DEFAULT_LOCALE,
  ): Promise<ParsedTopic> => {
    const loaded = await loadParsedFromFile(topic.file, locale);
    return loaded.parsed;
  },
);

export const loadTopicPage = cache(
  async (
    track: string,
    slug: string,
    locale: Locale = DEFAULT_LOCALE,
  ): Promise<
    | {
        topic: Topic;
        parsed: ParsedTopic;
        usedFallback: boolean;
      }
    | undefined
  > => {
    const topic = getTopic(track, slug);
    if (!topic) {
      return undefined;
    }
    const loaded = await loadParsedFromFile(topic.file, locale);
    return {
      topic,
      parsed: loaded.parsed,
      usedFallback: loaded.usedFallback,
    };
  },
);

export function assertCatalogFilesExist(locale: Locale = DEFAULT_LOCALE): void {
  for (const topic of TOPICS) {
    readTopicFile(topic.file, locale);
  }
}
