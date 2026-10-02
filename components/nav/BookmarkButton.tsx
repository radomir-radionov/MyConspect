"use client";

import { useCallback, useSyncExternalStore, type MouseEvent } from "react";
import {
  bookmarkHref,
  getServerBookmarks,
  readBookmarks,
  subscribeBookmarks,
  toggleBookmark,
} from "@/lib/nav/bookmarks";
import type { ChromeCopy } from "@/lib/nav";
const BUTTON_BASE_CLASS =
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-500";

export function useIsBookmarked(pathname: string, conceptId?: string) {
  const bookmarks = useSyncExternalStore(
    subscribeBookmarks,
    readBookmarks,
    getServerBookmarks,
  );
  const key = conceptId ? bookmarkHref(pathname, conceptId) : pathname;
  return bookmarks.some((bookmark) => {
    const bookmarkKey = bookmark.conceptId
      ? bookmarkHref(
          bookmark.href.split("#")[0] ?? bookmark.href,
          bookmark.conceptId,
        )
      : (bookmark.href.split("#")[0] ?? bookmark.href);
    return bookmarkKey === key;
  });
}

export function BookmarkStar({ className = "size-3" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`shrink-0 text-amber-500 ${className}`}
    >
      <path
        d="M12 17.3 6.2 21l1.6-6.7L2 9.8l6.9-.6L12 3l3.1 6.2 6.9.6-5.8 4.5 1.6 6.7z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BookmarkButton({
  pathname,
  title,
  conceptId,
  chrome,
  revealOnHover = false,
  size = "md",
  className,
}: {
  pathname: string;
  title: string;
  conceptId?: string;
  chrome: ChromeCopy;
  revealOnHover?: boolean;
  size?: "md" | "lg";
  className?: string;
}) {
  const saved = useIsBookmarked(pathname, conceptId);
  const label = saved ? chrome.unbookmark : chrome.bookmark;
  const sizeClass = size === "lg" ? "size-9" : "size-7";
  const concealed = revealOnHover && !saved;
  const mergedClassName =
    className ??
    `${BUTTON_BASE_CLASS} ${sizeClass} ${concealed ? "opacity-0 group-hover:opacity-100 group-open:opacity-100 group-focus-within:opacity-100" : "opacity-100"}`;

  const onToggle = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      toggleBookmark({
        href: bookmarkHref(pathname, conceptId),
        title,
        conceptId,
      });
    },
    [conceptId, pathname, title],
  );

  return (
    <button
      type="button"
      className={mergedClassName}
      aria-label={label}
      title={label}
      aria-pressed={saved}
      data-bookmarked={saved ? "true" : "false"}
      onClick={onToggle}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <BookmarkIcon filled={saved} />
    </button>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-4 text-amber-500"
      >
        <path
          d="M12 17.3 6.2 21l1.6-6.7L2 9.8l6.9-.6L12 3l3.1 6.2 6.9.6-5.8 4.5 1.6 6.7z"
          fill="currentColor"
        />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        d="M12 17.3 6.2 21l1.6-6.7L2 9.8l6.9-.6L12 3l3.1 6.2 6.9.6-5.8 4.5 1.6 6.7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}
