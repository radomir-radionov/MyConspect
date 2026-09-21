"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { SearchQueryContext } from "@/components/search";
import { HANDBOOK_MAIN_ID, HANDBOOK_NAV_ASIDE_ID } from "@/constants";
import { ContentBreadcrumbs } from "./ContentBreadcrumbs";
import { DrawerFooter, SiteHeader } from "./SiteHeader";
import { SidebarDockButton } from "./SidebarDockButton";
import { TopicSidebar } from "./TopicSidebar";
import { useApplyPendingHash } from "./useApplyPendingHash";
import { useHandbookSearch } from "./useHandbookSearch";
import { useMobileNav } from "./useMobileNav";
import { useRememberLocation } from "./useRememberLocation";
import { ScrollToTopButton } from "./ScrollToTopButton";
import { useResetMainScroll } from "./useResetMainScroll";
import { useSidebarCollapsed } from "./useSidebarCollapsed";
import type { ChromeCopy, NavGroup } from "@/lib/nav";

const SIDEBAR_MOTION =
  "transition-[width,transform,box-shadow] duration-200 ease-out motion-reduce:transition-none";
const SIDEBAR_MOBILE_FRAME =
  "fixed inset-x-0 top-14 z-30 flex h-[calc(100dvh-3.5rem)] w-full flex-col";
const SIDEBAR_DESKTOP =
  "md:pointer-events-auto md:z-20 md:cursor-pointer md:shrink-0 md:translate-x-0 md:overflow-visible md:border-r md:border-zinc-200 dark:md:border-zinc-800";
const SIDEBAR_DESKTOP_OPEN = `${SIDEBAR_DESKTOP} md:relative md:inset-auto md:top-auto md:right-auto md:bottom-auto md:left-auto md:h-auto md:w-80 md:shadow-none`;
const SIDEBAR_DESKTOP_COLLAPSED = `${SIDEBAR_DESKTOP} md:absolute md:inset-y-0 md:left-0 md:top-0 md:bottom-0 md:h-auto md:w-10 md:shadow-none`;
const SIDEBAR_DESKTOP_PEEK = `${SIDEBAR_DESKTOP} md:absolute md:inset-y-0 md:left-0 md:top-0 md:bottom-0 md:z-30 md:h-auto md:w-80 md:shadow-lg`;
const SIDEBAR_PANEL_MOTION =
  "flex min-h-0 flex-1 flex-col overflow-hidden transition-opacity duration-200 ease-out motion-reduce:transition-none";
const PEEK_LEAVE_MS = 80;

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
  const { navOpen, closeNav, toggleNav, openNav } = useMobileNav();
  const { collapsed, expandSidebar, toggleSidebar } = useSidebarCollapsed();
  const [searchSheetDismissed, setSearchSheetDismissed] = useState(false);
  const revealSearchNav = useCallback(() => {
    expandSidebar();
    setSearchSheetDismissed(false);
    openNav();
  }, [expandSidebar, openNav]);
  const dismissNav = useCallback(() => {
    closeNav();
    setSearchSheetDismissed(true);
  }, [closeNav]);
  const {
    query,
    deferredQuery,
    mode,
    searchGroups,
    changeQuery,
    changeMode,
    commitSearchLocation,
  } = useHandbookSearch(groups, revealSearchNav);
  const selectNavResult = useCallback(() => {
    dismissNav();
    commitSearchLocation();
  }, [commitSearchLocation, dismissNav]);
  const onQueryChange = useCallback(
    (value: string) => {
      if (value.trim().length === 0) {
        setSearchSheetDismissed(false);
      }
      changeQuery(value);
    },
    [changeQuery],
  );
  const searchValue = useMemo(
    () => ({ query: deferredQuery, mode }),
    [deferredQuery, mode],
  );
  const searching = query.trim().length > 0;
  const sidebarQuery =
    searching && deferredQuery.trim().length === 0 ? query : deferredQuery;
  const searchSheet = searching && !searchSheetDismissed;
  const menuOpen = navOpen || searchSheet;
  const onToggleNav = useCallback(() => {
    if (searchSheet) {
      dismissNav();
      return;
    }
    toggleNav();
  }, [dismissNav, searchSheet, toggleNav]);
  useEffect(() => {
    if (!searchSheet) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        dismissNav();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dismissNav, searchSheet]);
  const desktopCollapsed = collapsed && !searching;
  const { peeking, onPointerEnter, onPointerLeave, suppressPeek } =
    useDesktopSidebarPeek(desktopCollapsed);
  const railCollapsed = desktopCollapsed && !peeking;
  const onToggleSidebar = useCallback(() => {
    if (desktopCollapsed && peeking) {
      suppressPeek();
      return;
    }
    if (!desktopCollapsed) {
      suppressPeek();
    }
    toggleSidebar();
  }, [desktopCollapsed, peeking, suppressPeek, toggleSidebar]);
  const desktopClass = desktopCollapsed
    ? peeking
      ? SIDEBAR_DESKTOP_PEEK
      : SIDEBAR_DESKTOP_COLLAPSED
    : SIDEBAR_DESKTOP_OPEN;
  useRememberLocation(groups);
  useApplyPendingHash();
  useResetMainScroll();

  return (
    <SearchQueryContext.Provider value={searchValue}>
      <div className="flex h-dvh max-h-dvh flex-col overflow-hidden">
        <div className="relative z-50 shrink-0">
          <SiteHeader
            query={query}
            onQueryChange={onQueryChange}
            mode={mode}
            onModeChange={changeMode}
            chrome={chrome}
            navOpen={menuOpen}
            onToggleNav={onToggleNav}
          />
          <SidebarDockButton
            collapsed={desktopCollapsed}
            rail={railCollapsed}
            collapseLabel={chrome.collapseSidebar}
            expandLabel={chrome.expandSidebar}
            onToggle={onToggleSidebar}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
          />
        </div>
        <div className="relative flex min-h-0 flex-1" style={{ overflow: "hidden" }}>
          <button
            type="button"
            className={
              navOpen && !searching
                ? "fixed inset-x-0 top-14 z-20 h-[calc(100dvh-3.5rem)] bg-zinc-900/30 opacity-100 transition-opacity duration-200 ease-out motion-reduce:transition-none md:hidden"
                : "pointer-events-none fixed inset-x-0 top-14 z-20 h-[calc(100dvh-3.5rem)] bg-zinc-900/30 opacity-0 transition-opacity duration-200 ease-out motion-reduce:transition-none md:hidden"
            }
            tabIndex={navOpen && !searching ? 0 : -1}
            aria-hidden={!navOpen || searching}
            aria-label={chrome.closeMenu}
            onClick={closeNav}
          />
          {desktopCollapsed ? (
            <div className="hidden w-10 shrink-0 md:block" aria-hidden="true" />
          ) : null}
          <aside
            className={
              searchSheet
                ? `${SIDEBAR_MOBILE_FRAME} translate-x-0 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 ${SIDEBAR_MOTION} ${SIDEBAR_DESKTOP_OPEN}`
                : navOpen
                  ? `${SIDEBAR_MOBILE_FRAME} translate-x-0 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 ${SIDEBAR_MOTION} ${desktopClass}`
                  : `pointer-events-none ${SIDEBAR_MOBILE_FRAME} -translate-x-full border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 ${SIDEBAR_MOTION} ${desktopClass}`
            }
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
          >
            <div
              className={
                railCollapsed
                  ? `${SIDEBAR_PANEL_MOTION} opacity-100 md:pointer-events-none md:opacity-0`
                  : `${SIDEBAR_PANEL_MOTION} min-w-0 opacity-100`
              }
            >
              <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col md:w-80">
                <div
                  id={HANDBOOK_NAV_ASIDE_ID}
                  className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
                  style={{ overscrollBehavior: "contain" }}
                >
                  <TopicSidebar
                    groups={searchGroups}
                    query={sidebarQuery}
                    chrome={chrome}
                    onNavigate={selectNavResult}
                  />
                </div>
                <DrawerFooter
                  chrome={chrome}
                  lastUpdatedIso={lastUpdatedIso}
                  lastUpdatedLabel={lastUpdatedLabel}
                  onNavigate={selectNavResult}
                />
              </div>
            </div>
          </aside>
          <div
            id={HANDBOOK_MAIN_ID}
            className="relative min-w-0 flex-1"
            style={{ minHeight: 0, overflow: "auto", overscrollBehavior: "contain" }}
          >
            <ContentBreadcrumbs groups={groups} chrome={chrome} />
            {children}
            <ScrollToTopButton label={chrome.scrollToTop} />
          </div>
        </div>
      </div>
    </SearchQueryContext.Provider>
  );
}

function useDesktopSidebarPeek(collapsed: boolean) {
  const [peeking, setPeeking] = useState(false);
  const leaveTimer = useRef(0);
  const peekLocked = useRef(false);

  useEffect(() => {
    return () => window.clearTimeout(leaveTimer.current);
  }, []);

  const onPointerEnter = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") {
      return;
    }
    if (peekLocked.current || isSidebarDockControl(event.target)) {
      return;
    }
    window.clearTimeout(leaveTimer.current);
    setPeeking(true);
  }, []);

  const onPointerLeave = useCallback(() => {
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => {
      peekLocked.current = false;
      setPeeking(false);
    }, PEEK_LEAVE_MS);
  }, []);

  const suppressPeek = useCallback(() => {
    peekLocked.current = true;
    window.clearTimeout(leaveTimer.current);
    setPeeking(false);
    leaveTimer.current = window.setTimeout(() => {
      peekLocked.current = false;
    }, PEEK_LEAVE_MS);
  }, []);

  return { peeking: collapsed && peeking, onPointerEnter, onPointerLeave, suppressPeek };
}

function isSidebarDockControl(target: EventTarget | null) {
  return target instanceof Element && target.closest("[data-sidebar-dock]") !== null;
}
