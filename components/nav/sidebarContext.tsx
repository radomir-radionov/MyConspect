"use client";

import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { SearchMode } from "@/lib/nav";

export type SearchHit = {
  pathname: string;
  hash: string;
};

export type SidebarNavValue = {
  query: string;
  mode: SearchMode;
  pathname: string;
  searching: boolean;
  first: SearchHit | null;
  activeConceptId: string;
  openSubjectHref: string | null;
  setOpenSubjectHref: Dispatch<SetStateAction<string | null>>;
  openClusterKey: string | null;
  setOpenClusterKey: Dispatch<SetStateAction<string | null>>;
  openTopicHref: string | null;
  setOpenTopicHref: Dispatch<SetStateAction<string | null>>;
  pinNav: (element: HTMLElement) => void;
  onNavigate?: () => void;
};

const SidebarNavContext = createContext<SidebarNavValue | null>(null);

export const SidebarNavProvider = SidebarNavContext.Provider;

export function useSidebarNav() {
  const value = useContext(SidebarNavContext);
  if (!value) {
    throw new Error("useSidebarNav must be used within TopicSidebar");
  }
  return value;
}

export function closeNavSoon(onNavigate?: () => void) {
  queueMicrotask(() => onNavigate?.());
}

export function rowClass(active: boolean, sticky = false) {
  const highlight = active
    ? "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md bg-yellow-50 px-2 py-2 text-left text-base font-medium text-zinc-900 ring-1 ring-yellow-200"
    : "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-base text-zinc-800 hover:bg-yellow-50 hover:text-zinc-900";
  return sticky ? `${highlight} sticky` : highlight;
}

export function trackHeaderClass(highlighted: boolean, sticky = false) {
  const highlight = highlighted
    ? "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md bg-yellow-50 px-2 py-1 text-left text-sm font-semibold uppercase tracking-wide text-zinc-900 ring-1 ring-yellow-200"
    : "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1 text-left text-sm font-semibold uppercase tracking-wide text-zinc-500 hover:bg-yellow-50 hover:text-zinc-800";
  return sticky ? `${highlight} sticky` : highlight;
}
