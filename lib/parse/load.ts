import fs from "node:fs";
import path from "node:path";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { TOPICS, getTopic, type Topic } from "@/lib/catalog";
import {
  parseTopicMarkdown,
  parseTopicOutline,
  type ConceptOutline,
  type ParsedTopic,
} from "./parse";

const RESOURCES_ROOT = path.join(process.cwd(), "resources");

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

export function readTopicFile(file: string, locale: Locale = DEFAULT_LOCALE): string {
  return readTopicFileDetailed(file, locale).markdown;
}

export function readTopicFileDetailed(file: string, locale: Locale = DEFAULT_LOCALE): ReadTopicResult {
  const primary = resolveInside(locale, file);
  if (fs.existsSync(primary)) {
    return {
      markdown: fs.readFileSync(primary, "utf8"),
      locale,
      usedFallback: false,
    };
  }
  if (locale !== DEFAULT_LOCALE) {
    const fallback = resolveInside(DEFAULT_LOCALE, file);
    if (fs.existsSync(fallback)) {
      return {
        markdown: fs.readFileSync(fallback, "utf8"),
        locale: DEFAULT_LOCALE,
        usedFallback: true,
      };
    }
  }
  throw new Error(
    `Missing topic file in resources/${locale}/: ${file} (cwd=${process.cwd()})`,
  );
}

export function topicFileExists(file: string, locale: Locale): boolean {
  return fs.existsSync(resolveInside(locale, file));
}

export function loadTopicOutline(
  topic: Topic,
  locale: Locale = DEFAULT_LOCALE,
): readonly ConceptOutline[] {
  return parseTopicOutline(readTopicFile(topic.file, locale), locale);
}

export async function loadParsedTopic(
  topic: Topic,
  locale: Locale = DEFAULT_LOCALE,
): Promise<ParsedTopic> {
  return parseTopicMarkdown(readTopicFile(topic.file, locale), locale);
}

export async function loadTopicPage(
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
> {
  const topic = getTopic(track, slug);
  if (!topic) {
    return undefined;
  }
  const detailed = readTopicFileDetailed(topic.file, locale);
  return {
    topic,
    parsed: await parseTopicMarkdown(detailed.markdown, locale),
    usedFallback: detailed.usedFallback,
  };
}

export function assertCatalogFilesExist(locale: Locale = DEFAULT_LOCALE): void {
  for (const topic of TOPICS) {
    readTopicFile(topic.file, locale);
  }
}
