"use client";

import { SearchQueryContext } from "@/components/search";
import { ContactLinks } from "./ContactLinks";
import { SiteHeader } from "./SiteHeader";
import { TopicSidebar } from "./TopicSidebar";
import { useHandbookSearch } from "./useHandbookSearch";
import { useMobileNav } from "./useMobileNav";
import { useRememberLocation } from "./useRememberLocation";
import { useResetMainScroll } from "./useResetMainScroll";
import type { ChromeCopy, NavGroup } from "@/lib/nav";

export function HandbookShell({
  groups,
  chrome,
  children,
}: {
  groups: readonly NavGroup[];
  chrome: ChromeCopy;
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
          {navOpen ? (
            <button
              type="button"
              className="fixed inset-0 top-14 z-20 bg-zinc-900/30 lg:hidden"
              aria-label={chrome.closeMenu}
              onClick={closeNav}
            />
          ) : null}
          <aside
            className={
              navOpen
                ? "fixed top-14 bottom-0 left-0 z-30 flex w-80 flex-col border-r border-zinc-200 bg-white lg:static lg:z-0 lg:w-72 lg:shrink-0"
                : "hidden border-r border-zinc-200 bg-white lg:flex lg:w-72 lg:shrink-0 lg:flex-col"
            }
            style={{ minHeight: 0 }}
          >
            <div
              id="handbook-nav-aside"
              className="min-h-0 flex-1 overflow-y-auto"
              style={{ overscrollBehavior: "contain" }}
            >
              <TopicSidebar
                groups={groups}
                query={deferredQuery}
                chrome={chrome}
                onNavigate={closeNav}
              />
            </div>
            <div className="shrink-0 border-t border-zinc-200 px-2 py-1.5">
              <ContactLinks />
            </div>
          </aside>
          <div
            id="handbook-main"
            className="min-w-0 flex-1"
            style={{ minHeight: 0, overflow: "auto", overscrollBehavior: "contain" }}
          >
            {children}
          </div>
        </div>
      </div>
    </SearchQueryContext.Provider>
  );
}
