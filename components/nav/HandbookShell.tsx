"use client";

import { SearchQueryContext } from "@/components/search";
import { SiteHeader } from "./SiteHeader";
import { TopicSidebar } from "./TopicSidebar";
import { useHandbookSearch } from "./useHandbookSearch";
import { useMobileNav } from "./useMobileNav";
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
            id="handbook-nav-aside"
            className={
              navOpen
                ? "fixed top-14 bottom-0 left-0 z-30 w-80 overflow-y-auto border-r border-zinc-200 bg-white lg:static lg:z-0 lg:w-72 lg:shrink-0"
                : "hidden overflow-y-auto border-r border-zinc-200 bg-white lg:block lg:w-72 lg:shrink-0"
            }
            style={{ minHeight: 0, overscrollBehavior: "contain" }}
          >
            <TopicSidebar
              groups={groups}
              query={deferredQuery}
              chrome={chrome}
              onNavigate={closeNav}
            />
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
