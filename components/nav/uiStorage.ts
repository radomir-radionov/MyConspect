import { SEARCH_QUERY_MAX_LENGTH, UI_STORAGE_KEY } from "@/constants";
import type { SearchMode } from "@/lib/nav";

export type StoredUi = {
  readonly query: string;
  readonly mode: SearchMode;
  readonly href: string;
  readonly sidebarCollapsed: boolean;
};

const EMPTY: StoredUi = {
  query: "",
  mode: "titles",
  href: "/",
  sidebarCollapsed: false,
};
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
      sidebarCollapsed: record.sidebarCollapsed === true,
    };
    return cache;
  } catch {
    cache = EMPTY;
    return cache;
  }
}

export function readSidebarCollapsed() {
  return readUi().sidebarCollapsed;
}

export function getServerSidebarCollapsed() {
  return EMPTY.sidebarCollapsed;
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
