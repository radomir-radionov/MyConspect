import { SEARCH_QUERY_MAX_LENGTH, UI_STORAGE_KEY } from "@/constants";
import { INSTRUCTIONS_HREF, splitHref, type NavGroup, type SearchMode } from "@/lib/nav";

export type StoredUi = {
  readonly query: string;
  readonly mode: SearchMode;
  readonly href: string;
};

const EMPTY: StoredUi = { query: "", mode: "titles", href: "/" };
const EMPTY_SEARCH = { query: EMPTY.query, mode: EMPTY.mode };

let cache: StoredUi | null = null;
let searchCache: { query: string; mode: SearchMode } = EMPTY_SEARCH;
const listeners = new Set<() => void>();

function emitUi() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeUi(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function searchSnapshot(ui: StoredUi) {
  if (ui.query === EMPTY_SEARCH.query && ui.mode === EMPTY_SEARCH.mode) {
    searchCache = EMPTY_SEARCH;
    return searchCache;
  }
  if (searchCache.query !== ui.query || searchCache.mode !== ui.mode) {
    searchCache = { query: ui.query, mode: ui.mode };
  }
  return searchCache;
}

export function readSearchUi() {
  return searchSnapshot(readUi());
}

export function getServerSearchUi() {
  return EMPTY_SEARCH;
}

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
  return value.slice(0, SEARCH_QUERY_MAX_LENGTH);
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
    const raw = window.localStorage.getItem(UI_STORAGE_KEY);
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
  searchSnapshot(cache);
  try {
    window.localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Private mode or a full quota should not break browsing.
  }
  emitUi();
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

