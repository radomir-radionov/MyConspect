"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HANDBOOK_HEADER_ID, HANDBOOK_SIDEBAR_ID } from "@/constants";
import { type ChromeCopy, type SearchMode } from "@/lib/nav";
import { homeHref, instructionsHref, localeFromPathname } from "@/lib/i18n/paths";
import { SITE_NAME } from "@/lib/site";
import { ContactLinks } from "./ContactLinks";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SiteMark } from "./SiteMark";
import { ThemeToggle } from "./ThemeToggle";

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
  const pathname = usePathname() ?? "/en";
  const locale = localeFromPathname(pathname);

  return (
    <div id={HANDBOOK_HEADER_ID} className="relative z-40 shrink-0">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex h-14 min-w-0 items-stretch overflow-hidden">
          <div className="sticky left-0 z-10 flex shrink-0 items-center bg-white pl-(--chrome-inline) pr-1 sm:pr-2 dark:bg-zinc-950">
            <Link
              href={homeHref(locale)}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-1.5 text-zinc-900 hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              <SiteMark />
              <span className="hidden text-sm font-semibold tracking-tight sm:inline">
                {SITE_NAME}
              </span>
              <span className="sr-only sm:hidden">{SITE_NAME}</span>
            </Link>
            <span
              aria-hidden="true"
              className="ml-1 hidden h-6 w-px shrink-0 bg-zinc-200 sm:ml-2 sm:block dark:bg-zinc-800"
            />
          </div>
          <div className="flex min-w-0 flex-1 items-center px-1.5 sm:px-3">
            <div className="relative w-full min-w-0 max-w-2xl">
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
                    ? "h-9 w-full appearance-none rounded-md border border-zinc-200 bg-zinc-50 py-1.5 pr-[6.25rem] pl-9 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white sm:pr-[9.75rem] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:bg-zinc-900 [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-cancel-button]:appearance-none"
                    : "h-9 w-full appearance-none rounded-md border border-zinc-200 bg-zinc-50 py-1.5 pr-[4.25rem] pl-9 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white sm:pr-[7.75rem] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:bg-zinc-900 [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-cancel-button]:appearance-none"
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
                  className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
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
                className="flex h-7 shrink-0 rounded-md bg-zinc-100 p-0.5 dark:bg-zinc-800"
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
          <div className="sticky right-0 z-10 hidden shrink-0 items-center gap-0.5 bg-white pr-(--chrome-inline) pl-2 md:flex dark:bg-zinc-950">
            <span aria-hidden="true" className="mr-1 h-6 w-px shrink-0 bg-zinc-200 dark:bg-zinc-800" />
            <LanguageSwitcher locale={locale} />
            <ThemeToggle />
          </div>
          <div className="sticky right-0 z-10 flex shrink-0 items-center bg-white pr-(--chrome-inline) pl-1 sm:pl-2 md:hidden dark:bg-zinc-950">
            <button
              type="button"
              className={
                navOpen
                  ? "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-zinc-300 bg-zinc-50 text-zinc-800 hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
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
  const pathname = usePathname() ?? "/en";
  const locale = localeFromPathname(pathname);
  const instructionsPath = instructionsHref(locale);
  const onInstructions = pathname === instructionsPath;

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-t border-zinc-200 px-2 py-1.5 dark:border-zinc-800">
      <div className="flex min-w-0 items-center gap-1">
        <ContactLinks />
        <Link
          href={instructionsPath}
          onClick={onNavigate}
          aria-label={chrome.instructions}
          title={chrome.instructions}
          aria-current={onInstructions ? "page" : undefined}
          className={
            onInstructions
              ? "inline-flex size-9 items-center justify-center rounded-md text-zinc-900 dark:text-zinc-50"
              : "inline-flex size-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          }
        >
          <InstructionsIcon />
        </Link>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher locale={locale} variant="select" />
          <ThemeToggle />
        </div>
        <time
          dateTime={lastUpdatedIso}
          className="pr-1 text-right text-[11px] leading-tight text-zinc-500 dark:text-zinc-400"
        >
          <span className="block">{chrome.lastUpdated}</span>
          <span className="tabular-nums text-zinc-600 dark:text-zinc-300">{lastUpdatedLabel}</span>
        </time>
      </div>
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
      aria-label={label}
      title={label}
      data-search-mode={value}
      onClick={() => onSelect(value)}
      className={
        checked
          ? "inline-flex size-6 cursor-pointer items-center justify-center rounded bg-white text-zinc-900 shadow-sm sm:h-auto sm:w-auto sm:px-1.5 dark:bg-zinc-700 dark:text-zinc-50"
          : "inline-flex size-6 cursor-pointer items-center justify-center rounded text-zinc-500 hover:text-zinc-800 sm:h-auto sm:w-auto sm:px-1.5 dark:text-zinc-400 dark:hover:text-zinc-100"
      }
    >
      <SearchModeIcon mode={value} />
      <span className="hidden text-xs font-medium sm:inline">{label}</span>
    </button>
  );
}

function SearchModeIcon({ mode }: { mode: SearchMode }) {
  switch (mode) {
    case "titles":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5 sm:hidden">
          <path
            d="M5 7h14M5 12h14M5 17h9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
    case "notes":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5 sm:hidden">
          <path
            d="M7 4.5h7.5L18 8v11.5H7z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 4.5V8H18M9.5 12h5M9.5 15.5h5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default: {
      const exhaustive: never = mode;
      return exhaustive;
    }
  }
}
