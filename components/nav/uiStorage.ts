import { INSTRUCTIONS_HREF, splitHref, type NavGroup, type SearchMode } from "@/lib/nav";

const STORAGE_KEY = "myconspect.ui";
const QUERY_MAX = 200;

export type StoredUi = {
  readonly query: string;
  readonly mode: SearchMode;
  readonly href: string;
};

const EMPTY: StoredUi = { query: "", mode: "titles", href: "/" };

let cache: StoredUi | null = null;

function asSearchMode(value: unknown): SearchMode {
  switch (value) {
    case "notes":
      return "notes";
    case "titles":
      return "titles";
    default:
      return "titles";
  }
}

function asQuery(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.slice(0, QUERY_MAX);
}

function asHref(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}

export function readUi(): StoredUi {
  if (cache) {
    return cache;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cache = EMPTY;
      return cache;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      cache = EMPTY;
      return cache;
    }
    const record = parsed as Record<string, unknown>;
    cache = {
      query: asQuery(record.query),
      mode: asSearchMode(record.mode),
      href: asHref(record.href),
    };
    return cache;
  } catch {
    cache = EMPTY;
    return cache;
  }
}

export function writeUi(patch: Partial<StoredUi>) {
  cache = { ...readUi(), ...patch };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Private mode or a full quota should not break browsing.
  }
}

export function hrefInHandbook(groups: readonly NavGroup[], href: string): boolean {
  const { pathname } = splitHref(href);
  if (pathname === "/" || pathname === INSTRUCTIONS_HREF) {
    return true;
  }
  for (const group of groups) {
    if (group.href === pathname || group.leafTopic?.href === pathname) {
      return true;
    }
    for (const entry of group.entries) {
      switch (entry.kind) {
        case "topic":
          if (entry.topic.href === pathname) {
            return true;
          }
          break;
        case "subject":
          if (entry.subject.href === pathname) {
            return true;
          }
          if (entry.subject.clusters.some((cluster) =>
            cluster.topics.some((topic) => topic.href === pathname),
          )) {
            return true;
          }
          break;
        case "cluster":
          if (entry.subjectHref === pathname) {
            return true;
          }
          if (entry.cluster.topics.some((topic) => topic.href === pathname)) {
            return true;
          }
          break;
        default: {
          const _never: never = entry;
          return _never;
        }
      }
    }
  }
  return false;
}

