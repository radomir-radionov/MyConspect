"use client";

import { SearchQueryContext } from "@/components/search";
import { HANDBOOK_MAIN_ID, HANDBOOK_NAV_ASIDE_ID } from "@/constants";
import { ContactLinks } from "./ContactLinks";
import { SiteHeader } from "./SiteHeader";
import { TopicSidebar } from "./TopicSidebar";
import { useHandbookSearch } from "./useHandbookSearch";
import { useMobileNav } from "./useMobileNav";
import { useRememberLocation } from "./useRememberLocation";
import { ScrollToTopButton } from "./ScrollToTopButton";
import { useResetMainScroll } from "./useResetMainScroll";
import type { ChromeCopy, NavGroup } from "@/lib/nav";

export function HandbookShell({
  groups,
  chrome,
  lastUpdatedIso,
  lastUpdatedLabel,
  children,
}: {
  groups: readonly NavGroup[];
  chrome: ChromeCopy;
  lastUpdatedIso: string;
  lastUpdatedLabel: string;
  children: React.ReactNode;
}) {
  const { navOpen, openNav, closeNav, toggleNav } = useMobileNav();
  const { query, deferredQuery, mode, changeQuery, changeMode } =
    useHandbookSearch(groups, openNav);
  useRememberLocation(groups);
  useResetMainScroll();

  return (
    <SearchQueryContext.Provider value={{ query: deferredQuery, mode }}>
      <div
        className="flex flex-col"
        style={{ height: "100%", maxHeight: "100%", overflow: "hidden" }}
      >
        <SiteHeader
          query={query}
          onQueryChange={changeQuery}
          mode={mode}
          onModeChange={changeMode}
          chrome={chrome}
          navOpen={navOpen}
          onToggleNav={toggleNav}
        />
        <div className="flex min-h-0 flex-1" style={{ overflow: "hidden" }}>
          <button
            type="button"
            className={
              navOpen
                ? "fixed inset-0 top-14 z-20 bg-zinc-900/30 opacity-100 transition-opacity duration-200 ease-out motion-reduce:transition-none lg:hidden"
                : "pointer-events-none fixed inset-0 top-14 z-20 bg-zinc-900/30 opacity-0 transition-opacity duration-200 ease-out motion-reduce:transition-none lg:hidden"
            }
            tabIndex={navOpen ? 0 : -1}
            aria-hidden={!navOpen}
            aria-label={chrome.closeMenu}
            onClick={closeNav}
          />
          <aside
            className={
              navOpen
                ? "fixed top-14 bottom-0 left-0 z-30 flex w-80 translate-x-0 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 ease-out motion-reduce:transition-none lg:static lg:z-0 lg:w-72 lg:shrink-0 lg:translate-x-0"
                : "pointer-events-none fixed top-14 bottom-0 left-0 z-30 flex w-80 -translate-x-full flex-col border-r border-zinc-200 bg-white transition-transform duration-200 ease-out motion-reduce:transition-none lg:pointer-events-auto lg:static lg:z-0 lg:w-72 lg:shrink-0 lg:translate-x-0"
            }
            style={{ minHeight: 0 }}
          >
            <div
              id={HANDBOOK_NAV_ASIDE_ID}
              className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
              style={{ overscrollBehavior: "contain" }}
            >
              <TopicSidebar
                groups={groups}
                query={deferredQuery}
                chrome={chrome}
                onNavigate={closeNav}
              />
            </div>
            <div className="flex shrink-0 items-center justify-between gap-2 border-t border-zinc-200 px-2 py-1.5">
              <ContactLinks />
              <time
                dateTime={lastUpdatedIso}
                className="pr-1 text-right text-[11px] leading-tight text-zinc-500"
              >
                <span className="block">{chrome.lastUpdated}</span>
                <span className="tabular-nums text-zinc-600">
                  {lastUpdatedLabel}
                </span>
              </time>
            </div>
          </aside>
          <div
            id={HANDBOOK_MAIN_ID}
            className="relative min-w-0 flex-1"
            style={{ minHeight: 0, overflow: "auto", overscrollBehavior: "contain" }}
          >
            {children}
            <ScrollToTopButton label={chrome.scrollToTop} />
          </div>
        </div>
      </div>
    </SearchQueryContext.Provider>
  );
}
