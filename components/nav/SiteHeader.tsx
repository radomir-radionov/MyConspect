"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { INSTRUCTIONS_HREF, type ChromeCopy, type SearchMode } from "@/lib/nav";
import { SITE_NAME } from "@/lib/site";
import { SiteMark } from "./SiteMark";

export function SiteHeader({
  query,
  onQueryChange,
  mode,
  onModeChange,
  chrome,
  navOpen,
  onToggleNav,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  chrome: ChromeCopy;
  navOpen: boolean;
  onToggleNav: () => void;
}) {
  const pathname = usePathname() ?? "/";
  const onInstructions = pathname === INSTRUCTIONS_HREF;

  return (
    <header id="handbook-header" className="shrink-0 border-b border-zinc-200 bg-white">
      <div className="grid h-14 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-[var(--chrome-inline)] lg:grid-cols-[minmax(0,1fr)_minmax(12rem,28rem)_minmax(0,1fr)]">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-zinc-700 hover:bg-zinc-100 lg:hidden"
            aria-expanded={navOpen}
            aria-controls="handbook-sidebar"
            onClick={onToggleNav}
          >
            <span className="sr-only">{navOpen ? chrome.closeMenu : chrome.openMenu}</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
              {navOpen ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight text-zinc-900"
          >
            <SiteMark />
            <span className="hidden sm:inline">{SITE_NAME}</span>
          </Link>
        </div>
        <div className="relative min-w-0 max-w-xl justify-self-stretch lg:max-w-none lg:justify-self-center lg:w-full">
          <label className="block min-w-0">
            <span className="sr-only">
              {mode === "notes" ? chrome.searchNotesPlaceholder : chrome.searchPlaceholder}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
            >
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
              <path
                d="M16 16l4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder={
                mode === "notes" ? chrome.searchNotesPlaceholder : chrome.searchPlaceholder
              }
              className={
                query.length > 0
                  ? "h-9 w-full appearance-none rounded-md border border-zinc-200 bg-zinc-50 py-1.5 pr-[9.75rem] pl-9 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-cancel-button]:appearance-none"
                  : "h-9 w-full appearance-none rounded-md border border-zinc-200 bg-zinc-50 py-1.5 pr-[7.75rem] pl-9 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-cancel-button]:appearance-none"
              }
            />
          </label>
          <div className="absolute inset-y-0 right-1 flex items-center gap-0.5">
            {query.length > 0 ? (
              <button
                type="button"
                aria-label={chrome.clearSearch}
                title={chrome.clearSearch}
                onClick={() => onQueryChange("")}
                className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            ) : null}
            <div
              role="radiogroup"
              aria-label={chrome.searchMode}
              className="flex h-7 shrink-0 rounded-md bg-zinc-100 p-0.5"
            >
              <SearchModeButton
                checked={mode === "titles"}
                label={chrome.searchModeTitles}
                value="titles"
                onSelect={onModeChange}
              />
              <SearchModeButton
                checked={mode === "notes"}
                label={chrome.searchModeNotes}
                value="notes"
                onSelect={onModeChange}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Link
            href={INSTRUCTIONS_HREF}
            aria-current={onInstructions ? "page" : undefined}
            className={
              onInstructions
                ? "rounded-md px-2 py-1 text-sm font-medium text-zinc-900"
                : "rounded-md px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }
          >
            {chrome.instructions}
          </Link>
        </div>
      </div>
    </header>
  );
}

function SearchModeButton({
  checked,
  label,
  value,
  onSelect,
}: {
  checked: boolean;
  label: string;
  value: SearchMode;
  onSelect: (mode: SearchMode) => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      data-search-mode={value}
      onClick={() => onSelect(value)}
      className={
        checked
          ? "cursor-pointer rounded px-1.5 text-xs font-medium text-zinc-900 bg-white shadow-sm"
          : "cursor-pointer rounded px-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800"
      }
    >
      {label}
    </button>
  );
}
