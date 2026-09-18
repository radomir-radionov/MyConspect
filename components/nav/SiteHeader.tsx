"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HANDBOOK_HEADER_ID, HANDBOOK_SIDEBAR_ID } from "@/constants";
import { INSTRUCTIONS_HREF, type ChromeCopy, type SearchMode } from "@/lib/nav";
import { SITE_NAME } from "@/lib/site";
import { ContactLinks } from "./ContactLinks";
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
  return (
    <div id={HANDBOOK_HEADER_ID} className="relative z-40 shrink-0">
      <header className="border-b border-zinc-200 bg-white">
        <div className="flex h-14 min-w-0 items-stretch overflow-x-auto overscroll-x-contain">
          <div className="sticky left-0 z-10 flex shrink-0 items-center bg-white pl-(--chrome-inline) pr-2">
            <Link
              href="/"
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-1.5 text-zinc-900 hover:bg-zinc-100"
            >
              <SiteMark />
              <span className="hidden text-sm font-semibold tracking-tight sm:inline">
                {SITE_NAME}
              </span>
              <span className="sr-only sm:hidden">{SITE_NAME}</span>
            </Link>
            <span aria-hidden="true" className="ml-2 h-6 w-px shrink-0 bg-zinc-200" />
          </div>
          <div className="flex min-w-0 flex-1 items-center px-3">
            <div className="relative w-full min-w-80 max-w-2xl">
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
          </div>
          <div className="sticky right-0 z-10 flex shrink-0 items-center bg-white pr-(--chrome-inline) pl-2 md:hidden">
            <span aria-hidden="true" className="mr-2 h-6 w-px shrink-0 bg-zinc-200" />
            <button
              type="button"
              className={
                navOpen
                  ? "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-zinc-900 bg-zinc-900 text-white"
                  : "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-zinc-300 bg-zinc-50 text-zinc-800 hover:border-zinc-400 hover:bg-zinc-100"
              }
              aria-expanded={navOpen}
              aria-controls={HANDBOOK_SIDEBAR_ID}
              onClick={onToggleNav}
            >
              <span className="sr-only">{navOpen ? chrome.closeMenu : chrome.openMenu}</span>
              <MenuGlyph open={navOpen} />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export function DrawerFooter({
  chrome,
  lastUpdatedIso,
  lastUpdatedLabel,
  onNavigate,
}: {
  chrome: ChromeCopy;
  lastUpdatedIso: string;
  lastUpdatedLabel: string;
  onNavigate: () => void;
}) {
  const pathname = usePathname() ?? "/";
  const onInstructions = pathname === INSTRUCTIONS_HREF;

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-t border-zinc-200 px-2 py-1.5">
      <div className="flex min-w-0 items-center gap-1">
        <ContactLinks />
        <Link
          href={INSTRUCTIONS_HREF}
          onClick={onNavigate}
          aria-label={chrome.instructions}
          title={chrome.instructions}
          aria-current={onInstructions ? "page" : undefined}
          className={
            onInstructions
              ? "inline-flex size-9 items-center justify-center rounded-md text-zinc-900"
              : "inline-flex size-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }
        >
          <InstructionsIcon />
        </Link>
      </div>
      <time
        dateTime={lastUpdatedIso}
        className="pr-1 text-right text-[11px] leading-tight text-zinc-500"
      >
        <span className="block">{chrome.lastUpdated}</span>
        <span className="tabular-nums text-zinc-600">{lastUpdatedLabel}</span>
      </time>
    </div>
  );
}

function InstructionsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm.75 14.25a.75.75 0 0 1-1.5 0v-5.5a.75.75 0 0 1 1.5 0v5.5ZM12 8.4a1.05 1.05 0 1 1 0-2.1 1.05 1.05 0 0 1 0 2.1Z"
      />
    </svg>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0">
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M5 7h14M5 12h14M5 17h14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      )}
    </svg>
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
