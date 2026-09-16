"use client";

import { useCallback, useDeferredValue, useEffect, useRef, useState, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SearchQueryContext } from "@/components/search";
import { SiteHeader } from "./SiteHeader";
import { TopicSidebar } from "./TopicSidebar";
import {
  firstSearchHref,
  splitHref,
  type ChromeCopy,
  type NavGroup,
} from "@/lib/nav";

const SEARCH_NAV_DELAY_MS = 280;

export function HandbookShell({
  groups,
  chrome,
  children,
}: {
  groups: readonly NavGroup[];
  chrome: ChromeCopy;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  const restoreHrefRef = useRef<string | null>(null);
  const searchTimerRef = useRef<number | null>(null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [navOpen, setNavOpen] = useState(false);
  const groupsRef = useRef(groups);
  groupsRef.current = groups;

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current !== null) {
        window.clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!navOpen) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNavOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navOpen]);

  function currentHref() {
    return `${pathnameRef.current}${window.location.hash}`;
  }

  function goTo(target: string) {
    const { pathname: nextPath, hash: nextHash } = splitHref(target);
    const currentPath = pathnameRef.current;
    const currentHash = window.location.hash;

    if (nextPath === currentPath && nextHash === currentHash) {
      window.dispatchEvent(new Event("hashchange"));
      return;
    }

    if (nextPath === currentPath) {
      window.history.replaceState(window.history.state, "", `${nextPath}${nextHash}`);
      window.dispatchEvent(new Event("hashchange"));
      return;
    }

    startTransition(() => {
      router.replace(target, { scroll: false });
    });
  }

  function applySearch(nextQuery: string) {
    const trimmed = nextQuery.trim();
    if (trimmed.length === 0) {
      const restore = restoreHrefRef.current;
      restoreHrefRef.current = null;
      if (restore && restore !== currentHref()) {
        goTo(restore);
      }
      return;
    }

    if (restoreHrefRef.current === null) {
      restoreHrefRef.current = currentHref();
    }

    const target = firstSearchHref(groupsRef.current, nextQuery, pathnameRef.current);
    if (target) {
      goTo(target);
    }
  }

  const closeNav = useCallback(() => setNavOpen(false), []);

  function scheduleSearch(nextQuery: string) {
    if (searchTimerRef.current !== null) {
      window.clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }

    if (nextQuery.trim().length === 0) {
      applySearch(nextQuery);
      return;
    }

    searchTimerRef.current = window.setTimeout(() => {
      searchTimerRef.current = null;
      applySearch(nextQuery);
    }, SEARCH_NAV_DELAY_MS);
  }

  return (
    <SearchQueryContext.Provider value={deferredQuery}>
      <div
        className="flex flex-col"
        style={{ height: "100%", maxHeight: "100%", overflow: "hidden" }}
      >
        <SiteHeader
          query={query}
          onQueryChange={(value) => {
            setQuery(value);
            if (value.trim().length > 0) {
              setNavOpen(true);
            }
            scheduleSearch(value);
          }}
          chrome={chrome}
          navOpen={navOpen}
          onToggleNav={() => setNavOpen((open) => !open)}
        />
        <div className="flex min-h-0 flex-1" style={{ overflow: "hidden" }}>
          {navOpen ? (
            <button
              type="button"
              className="fixed inset-0 top-14 z-20 bg-zinc-900/30 lg:hidden"
              aria-label={chrome.closeMenu}
              onClick={() => setNavOpen(false)}
            />
          ) : null}
          <aside
            id="handbook-nav-aside"
            className={
              navOpen
                ? "fixed top-14 bottom-0 left-0 z-30 w-72 overflow-y-auto border-r border-zinc-200 bg-white lg:static lg:z-0 lg:w-64 lg:shrink-0"
                : "hidden overflow-y-auto border-r border-zinc-200 bg-white lg:block lg:w-64 lg:shrink-0"
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
