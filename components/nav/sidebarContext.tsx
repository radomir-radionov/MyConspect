"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { TrackId } from "@/lib/catalog";
import type { SearchMode } from "@/lib/nav";
import type { NavLocation } from "./location";

export type SearchHit = {
  pathname: string;
  hash: string;
};

export type SidebarChromeValue = {
  query: string;
  mode: SearchMode;
  pathname: string;
  searching: boolean;
  first: SearchHit | null;
  pinNav: (element: HTMLElement) => void;
  goToPath: (path: string) => void;
  onNavigate?: () => void;
};

export type SidebarHighlightValue = {
  /** Path used for sidebar active highlights; includes optimistic nav targets. */
  highlightPathname: string;
};

export type SidebarBookmarksValue = {
  isBookmarked: (pathname: string, conceptId?: string) => boolean;
};

export type SidebarFoldValue = {
  getTrackFold: (trackId: TrackId) => NavLocation;
  patchTrackFold: (trackId: TrackId, patch: Partial<NavLocation>) => void;
};

export type SidebarActiveValue = {
  activeConceptId: string;
};

const SidebarChromeContext = createContext<SidebarChromeValue | null>(null);
const SidebarHighlightContext = createContext<SidebarHighlightValue | null>(
  null,
);
const SidebarBookmarksContext = createContext<SidebarBookmarksValue | null>(
  null,
);
const SidebarFoldContext = createContext<SidebarFoldValue | null>(null);
const SidebarActiveContext = createContext<SidebarActiveValue | null>(null);

export function SidebarNavProvider({
  chrome,
  highlight,
  bookmarks,
  fold,
  active,
  children,
}: {
  chrome: SidebarChromeValue;
  highlight: SidebarHighlightValue;
  bookmarks: SidebarBookmarksValue;
  fold: SidebarFoldValue;
  active: SidebarActiveValue;
  children: ReactNode;
}) {
  return (
    <SidebarChromeContext.Provider value={chrome}>
      <SidebarHighlightContext.Provider value={highlight}>
        <SidebarBookmarksContext.Provider value={bookmarks}>
          <SidebarFoldContext.Provider value={fold}>
            <SidebarActiveContext.Provider value={active}>
              {children}
            </SidebarActiveContext.Provider>
          </SidebarFoldContext.Provider>
        </SidebarBookmarksContext.Provider>
      </SidebarHighlightContext.Provider>
    </SidebarChromeContext.Provider>
  );
}

export function useSidebarChrome() {
  const value = useContext(SidebarChromeContext);
  if (!value) {
    throw new Error("useSidebarChrome must be used within TopicSidebar");
  }
  return value;
}

export function useSidebarHighlight() {
  const value = useContext(SidebarHighlightContext);
  if (!value) {
    throw new Error("useSidebarHighlight must be used within TopicSidebar");
  }
  return value;
}

export function useSidebarBookmarks() {
  const value = useContext(SidebarBookmarksContext);
  if (!value) {
    throw new Error("useSidebarBookmarks must be used within TopicSidebar");
  }
  return value;
}

export function useSidebarFold() {
  const value = useContext(SidebarFoldContext);
  if (!value) {
    throw new Error("useSidebarFold must be used within TopicSidebar");
  }
  return value;
}

export function useSidebarActive() {
  const value = useContext(SidebarActiveContext);
  if (!value) {
    throw new Error("useSidebarActive must be used within TopicSidebar");
  }
  return value;
}

export function closeNavSoon(onNavigate?: () => void) {
  queueMicrotask(() => onNavigate?.());
}

/** Shared vertical gap between nested sidebar path rows. */
export const NAV_ROW_GAP = "mt-1.5";

export function rowClass(active: boolean, sticky = false, indentClass = "") {
  // Indent with padding (not margin) so `w-full` rows keep one shared right edge.
  const highlight = active
    ? "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md bg-yellow-50 px-2 py-2 text-left text-base font-medium text-zinc-900 ring-1 ring-yellow-200 dark:bg-yellow-950 dark:text-zinc-50 dark:ring-yellow-800"
    : "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-base text-zinc-800 hover:bg-yellow-50 hover:text-zinc-900 dark:text-zinc-200 dark:hover:bg-yellow-950/60 dark:hover:text-zinc-50";
  const stickyClass = sticky ? " sticky" : "";
  const indent = indentClass ? ` ${indentClass}` : "";
  return `${highlight}${stickyClass}${indent}`;
}

export function trackHeaderClass(highlighted: boolean, sticky = false) {
  const highlight = highlighted
    ? "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md bg-yellow-50 px-2 py-1 text-left text-sm font-semibold uppercase tracking-wide text-zinc-900 ring-1 ring-yellow-200 dark:bg-yellow-950 dark:text-zinc-50 dark:ring-yellow-800"
    : "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1 text-left text-sm font-semibold uppercase tracking-wide text-zinc-500 hover:bg-yellow-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-yellow-950/60 dark:hover:text-zinc-100";
  return sticky ? `${highlight} sticky` : highlight;
}
