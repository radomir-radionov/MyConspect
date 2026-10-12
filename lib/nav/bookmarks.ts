import { BOOKMARKS_MAX, BOOKMARKS_STORAGE_KEY } from "@/constants";
import { hashIdFrom } from "./navUtils";
import { splitHref } from "./search";

export type Bookmark = {
  readonly href: string;
  readonly title: string;
  readonly conceptId?: string;
  readonly savedAt: number;
};

export type BookmarkInput = {
  readonly href: string;
  readonly title: string;
  readonly conceptId?: string;
};

const EMPTY_BOOKMARKS: readonly Bookmark[] = [];

let cache: readonly Bookmark[] | null = null;
const listeners = new Set<() => void>();

function emitBookmarks() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeBookmarks(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function asHref(value: unknown): string | null {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return null;
  }
  const hashIndex = value.indexOf("#");
  if (hashIndex === -1) {
    return value;
  }
  const path = value.slice(0, hashIndex);
  const hash = value.slice(hashIndex + 1);
  if (!path || hash.includes("#")) {
    return null;
  }
  return hash ? `${path}#${hash}` : path;
}

function asTitle(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const title = value.trim();
  return title.length > 0 ? title : null;
}

function asConceptId(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const id = value.trim();
  return id.length > 0 ? id : undefined;
}

function parseBookmark(value: unknown): Bookmark | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const record = value as Record<string, unknown>;
  const href = asHref(record.href);
  const title = asTitle(record.title);
  if (!href || !title) {
    return null;
  }
  const savedAt =
    typeof record.savedAt === "number" && Number.isFinite(record.savedAt)
      ? record.savedAt
      : 0;
  const conceptId = asConceptId(record.conceptId);
  if (conceptId && !href.includes("#")) {
    return null;
  }
  return { href, title, conceptId, savedAt };
}

function bookmarkKey(href: string, conceptId?: string): string {
  if (conceptId) {
    const path = href.split("#")[0] ?? href;
    return `${path}#${conceptId}`;
  }
  return href.split("#")[0] ?? href;
}

export function bookmarkHref(pathname: string, conceptId?: string): string {
  if (conceptId) {
    return `${pathname}#${conceptId}`;
  }
  return pathname;
}

export function bookmarkLookupKey(pathname: string, conceptId?: string): string {
  return conceptId ? bookmarkHref(pathname, conceptId) : pathname;
}

export function bookmarkStorageKey(bookmark: Bookmark): string {
  const path = bookmark.href.split("#")[0] ?? bookmark.href;
  return bookmark.conceptId ? bookmarkHref(path, bookmark.conceptId) : path;
}

export function bookmarkMatchesPage(
  pathname: string,
  activeConceptId: string,
  href: string,
  conceptId?: string,
): boolean {
  const { pathname: targetPath, hash } = splitHref(href);
  if (pathname !== targetPath) {
    return false;
  }
  const bookmarkConceptId = conceptId ?? hashIdFrom(hash);
  if (bookmarkConceptId.length > 0) {
    return activeConceptId === bookmarkConceptId;
  }
  return true;
}

export function activeBookmarkIndex(
  bookmarks: readonly Bookmark[],
  pathname: string,
  activeConceptId: string,
): number {
  return bookmarks.findIndex((bookmark) =>
    bookmarkMatchesPage(
      pathname,
      activeConceptId,
      bookmark.href,
      bookmark.conceptId,
    ),
  );
}

export function siblingBookmarkHref(
  bookmarks: readonly Bookmark[],
  pathname: string,
  activeConceptId: string,
  delta: -1 | 1,
): string | null {
  if (bookmarks.length <= 1) {
    return null;
  }
  const index = activeBookmarkIndex(bookmarks, pathname, activeConceptId);
  if (index < 0) {
    return null;
  }
  const nextIndex = index + delta;
  if (nextIndex < 0) {
    return bookmarks[bookmarks.length - 1]?.href ?? null;
  }
  if (nextIndex >= bookmarks.length) {
    return bookmarks[0]?.href ?? null;
  }
  return bookmarks[nextIndex]?.href ?? null;
}

export function readBookmarks(): readonly Bookmark[] {
  if (cache) {
    return cache;
  }
  if (typeof window === "undefined") {
    return EMPTY_BOOKMARKS;
  }
  try {
    const raw = window.localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) {
      cache = EMPTY_BOOKMARKS;
      return cache;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      cache = EMPTY_BOOKMARKS;
      return cache;
    }
    const items: Bookmark[] = [];
    const seen = new Set<string>();
    for (const entry of parsed) {
      const bookmark = parseBookmark(entry);
      if (!bookmark) {
        continue;
      }
      const key = bookmarkKey(bookmark.href, bookmark.conceptId);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      items.push(bookmark);
      if (items.length >= BOOKMARKS_MAX) {
        break;
      }
    }
    items.sort((left, right) => right.savedAt - left.savedAt);
    cache = items;
    return cache;
  } catch {
    cache = EMPTY_BOOKMARKS;
    return cache;
  }
}

export function getServerBookmarks(): readonly Bookmark[] {
  return EMPTY_BOOKMARKS;
}

function writeBookmarks(items: readonly Bookmark[]) {
  cache = items.length === 0 ? EMPTY_BOOKMARKS : items;
  try {
    window.localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Private mode or a full quota should not break browsing.
  }
  emitBookmarks();
}

export function isBookmarked(href: string, conceptId?: string): boolean {
  const key = bookmarkKey(href, conceptId);
  return readBookmarks().some(
    (bookmark) => bookmarkKey(bookmark.href, bookmark.conceptId) === key,
  );
}

export function toggleBookmark(input: BookmarkInput): boolean {
  const href = asHref(input.href);
  const title = asTitle(input.title);
  if (!href || !title) {
    return false;
  }
  const conceptId = asConceptId(input.conceptId);
  const key = bookmarkKey(href, conceptId);
  const current = readBookmarks();
  const existing = current.find(
    (bookmark) => bookmarkKey(bookmark.href, bookmark.conceptId) === key,
  );
  if (existing) {
    writeBookmarks(
      current.filter(
        (bookmark) => bookmarkKey(bookmark.href, bookmark.conceptId) !== key,
      ),
    );
    return false;
  }
  const next: Bookmark = {
    href: conceptId
      ? bookmarkHref(href.split("#")[0] ?? href, conceptId)
      : href,
    title,
    ...(conceptId ? { conceptId } : {}),
    savedAt: Date.now(),
  };
  const merged = [
    next,
    ...current.filter(
      (bookmark) => bookmarkKey(bookmark.href, bookmark.conceptId) !== key,
    ),
  ];
  writeBookmarks(merged.slice(0, BOOKMARKS_MAX));
  return true;
}

export function resetBookmarksCache(): void {
  cache = null;
}

export function removeBookmark(href: string, conceptId?: string): void {
  const key = bookmarkKey(href, conceptId);
  const current = readBookmarks();
  writeBookmarks(
    current.filter(
      (bookmark) => bookmarkKey(bookmark.href, bookmark.conceptId) !== key,
    ),
  );
}

export function clearAllBookmarks(): void {
  writeBookmarks([]);
}
