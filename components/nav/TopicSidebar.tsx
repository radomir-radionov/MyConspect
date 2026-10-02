"use client";

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HighlightedText, useSearchMode } from "@/components/search";
import {
  HANDBOOK_NAV_ASIDE_ID,
  HANDBOOK_SIDEBAR_ID,
  NAV_FOLD_OPEN_MS,
} from "@/constants";
import {
  collectGroupSearchHits,
  matchesQuery,
  searchNav,
  splitHref,
  type ChromeCopy,
  type NavEntry,
  type NavGroup,
  type SearchMode,
} from "@/lib/nav";
import {
  bookmarkLookupKey,
  bookmarkStorageKey,
  getServerBookmarks,
  readBookmarks,
  subscribeBookmarks,
} from "@/lib/nav/bookmarks";
import type { TrackId } from "@/lib/catalog";
import { NavChevron, NavFold } from "./NavFold";
import { NavGuide } from "./NavGuide";
import { applySameDocumentHref, queueHandbookHref } from "./hash";
import { useHandbookLocation } from "./useHandbookLocation";
import { isActiveHref, isActiveTrack } from "./location";
import { BookmarksPanel } from "./BookmarksPanel";
import { SearchHitList } from "./SearchHitList";
import {
  pinNavElement,
  restoreSidebarPin,
  scrollSidebarHit,
} from "./sidebarPin";
import {
  measureStickyCover,
  measureStickyPathVars,
  writeStickyVars,
  type StickyVars,
} from "./sidebarSticky";
import {
  SidebarNavProvider,
  trackHeaderClass,
  useSidebarChrome,
  useSidebarHighlight,
} from "./sidebarContext";
import { ClusterRow, SubjectRow, TopicRow } from "./sidebarRows";
import { foldRevision, useSidebarOpen } from "./useSidebarOpen";

export const TopicSidebar = memo(function TopicSidebar({
  groups,
  query,
  chrome,
  onNavigate,
}: {
  groups: readonly NavGroup[];
  query: string;
  chrome: ChromeCopy;
  onNavigate?: () => void;
}) {
  const { pathname, highlightPathname, hash } = useHandbookLocation();
  const mode = useSearchMode();
  const { groups: filtered, firstHref } = useMemo(
    () => searchNav(groups, query, mode, pathname),
    [groups, query, mode, pathname],
  );
  const first = useMemo(
    () => (firstHref ? splitHref(firstHref) : null),
    [firstHref],
  );
  const activeTrackId =
    groups.find((group) => isActiveTrack(highlightPathname, group.href))?.id ??
    null;
  const searching = query.trim().length > 0;
  const {
    activeConceptId,
    openTrackIds,
    toggleTrackId,
    ensureTrackOpen,
    trackFolds,
    getTrackFold,
    patchTrackFold,
  } = useSidebarOpen({
    groups,
    pathname,
    hash,
    searching,
    activeTrackId,
  });
  const router = useRouter();
  const pinNav = useCallback((element: HTMLElement) => {
    pinNavElement(element);
  }, []);
  const goToPath = useCallback(
    (path: string) => {
      router.push(path, { scroll: false });
    },
    [router],
  );
  const stickyRevision = `${foldRevision(trackFolds, openTrackIds)}|${pathname}|${hash}|${searching}|${query}`;

  useLayoutEffect(() => {
    restoreSidebarPin();
  }, [stickyRevision, pathname, hash, searching, query]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      restoreSidebarPin();
    });
    const later = window.setTimeout(() => {
      restoreSidebarPin();
    }, NAV_FOLD_OPEN_MS + 20);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(later);
    };
  }, [stickyRevision, pathname, hash]);

  useEffect(() => {
    if (!firstHref) {
      return;
    }
    const nav = document.getElementById(HANDBOOK_SIDEBAR_ID);
    const hit = nav?.querySelector("[data-search-hit='true']");
    if (hit instanceof HTMLElement) {
      scrollSidebarHit(hit);
    }
  }, [firstHref]);

  useEffect(() => {
    if (!activeConceptId) {
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      const nav = document.getElementById(HANDBOOK_SIDEBAR_ID);
      const hits = nav?.querySelectorAll(
        `[data-concept-id="${CSS.escape(activeConceptId)}"]`,
      );
      if (!hits) {
        return;
      }
      for (const hit of hits) {
        if (!(hit instanceof HTMLElement)) {
          continue;
        }
        const href = hit.getAttribute("href");
        if (!href || splitHref(href).pathname !== highlightPathname) {
          continue;
        }
        scrollSidebarHit(hit);
        break;
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeConceptId, highlightPathname, stickyRevision, searching]);

  const bookmarks = useSyncExternalStore(
    subscribeBookmarks,
    readBookmarks,
    getServerBookmarks,
  );
  const bookmarkKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const bookmark of bookmarks) {
      keys.add(bookmarkStorageKey(bookmark));
    }
    return keys;
  }, [bookmarks]);
  const bookmarksValue = useMemo(
    () => ({
      isBookmarked: (bookmarkPath: string, conceptId?: string) =>
        bookmarkKeys.has(bookmarkLookupKey(bookmarkPath, conceptId)),
    }),
    [bookmarkKeys],
  );
  const highlightValue = useMemo(
    () => ({ highlightPathname }),
    [highlightPathname],
  );
  const chromeValue = useMemo(
    () => ({
      query,
      mode,
      pathname,
      searching,
      first,
      pinNav,
      goToPath,
      onNavigate,
    }),
    [query, mode, pathname, searching, first, pinNav, goToPath, onNavigate],
  );
  const foldValue = useMemo(
    () => ({
      getTrackFold,
      patchTrackFold,
    }),
    [getTrackFold, patchTrackFold],
  );
  const activeValue = useMemo(() => ({ activeConceptId }), [activeConceptId]);

  return (
    <SidebarNavProvider
      chrome={chromeValue}
      highlight={highlightValue}
      bookmarks={bookmarksValue}
      fold={foldValue}
      active={activeValue}
    >
      <nav
        id={HANDBOOK_SIDEBAR_ID}
        aria-label={chrome.topicsNav}
        className="relative isolate px-2 py-3"
      >
        <div data-nav-sticky-cover="" aria-hidden="true" />
        {!searching ? (
          <BookmarksPanel chrome={chrome} onNavigate={onNavigate} />
        ) : null}
        {filtered.length === 0 ? (
          <p className="px-2 text-sm text-zinc-500 dark:text-zinc-400">
            {mode === "notes" ? chrome.searchNotesEmpty : chrome.searchEmpty}
          </p>
        ) : (
          <ul className="space-y-0.5">
            {filtered.map((group) => (
              <TrackGroup
                key={group.id}
                group={group}
                query={query}
                mode={mode}
                pathname={pathname}
                searching={searching}
                first={first}
                isTrackOpen={openTrackIds.has(group.id)}
                toggleTrackId={toggleTrackId}
                ensureTrackOpen={ensureTrackOpen}
              />
            ))}
          </ul>
        )}
      </nav>
      <StickyPathStyles revision={stickyRevision} />
    </SidebarNavProvider>
  );
});

function StickyPathStyles({ revision }: { revision: string }) {
  const previousRef = useRef<StickyVars>({});

  const applyVars = useCallback(() => {
    const scroller = document.getElementById(HANDBOOK_NAV_ASIDE_ID);
    if (!scroller) {
      return;
    }
    previousRef.current = writeStickyVars(
      scroller.style,
      measureStickyPathVars(),
      previousRef.current,
    );
  }, []);

  const syncPath = useCallback(() => {
    applyVars();
  }, [applyVars]);

  useLayoutEffect(() => {
    syncPath();
  }, [syncPath, revision]);

  useEffect(() => {
    const scroller = document.getElementById(HANDBOOK_NAV_ASIDE_ID);
    let frame = 0;
    const onScroll = () => {
      if (frame !== 0) {
        return;
      }
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (!scroller) {
          return;
        }
        const current = previousRef.current;
        const cover = `${measureStickyCover(undefined, current)}px`;
        if (current["--nav-sticky-cover"] === cover) {
          return;
        }
        previousRef.current = writeStickyVars(
          scroller.style,
          { ...current, "--nav-sticky-cover": cover },
          current,
        );
      });
    };
    scroller?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncPath);
    return () => {
      scroller?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", syncPath);
      window.cancelAnimationFrame(frame);
    };
  }, [applyVars, syncPath]);

  useEffect(() => {
    const later = window.setTimeout(syncPath, NAV_FOLD_OPEN_MS + 20);
    return () => window.clearTimeout(later);
  }, [syncPath, revision]);

  return null;
}

const TrackGroup = memo(function TrackGroup({
  group,
  query,
  mode,
  pathname,
  searching,
  first,
  isTrackOpen,
  toggleTrackId,
  ensureTrackOpen,
}: {
  group: NavGroup;
  query: string;
  mode: SearchMode;
  pathname: string;
  searching: boolean;
  first: { pathname: string; hash: string } | null;
  isTrackOpen: boolean;
  toggleTrackId: (trackId: TrackId) => void;
  ensureTrackOpen: (trackId: TrackId) => void;
}) {
  const isLeafTrack = Boolean(group.leafTopic) && group.entries.length === 0;
  const showLeafConcepts = isLeafTrack && !group.leafTopic?.hideSidebarConcepts;
  const hasSidebarChildren =
    group.entries.length > 0 || Boolean(group.hubTopic) || showLeafConcepts;
  const { onNavigate } = useSidebarChrome();
  const { highlightPathname } = useSidebarHighlight();
  const trackActive = isActiveHref(highlightPathname, group.href);
  const onThisTrack = isActiveTrack(highlightPathname, group.href);
  const trackOpen = searching || (hasSidebarChildren && isTrackOpen);
  const onPath = !searching && onThisTrack;
  const needle = query.trim().toLowerCase();
  const trackHighlighted = searching
    ? needle.length > 0 && matchesQuery(group.title, needle)
    : onThisTrack;
  const headerClass = trackHeaderClass(trackHighlighted, onPath);
  const searchHits = useMemo(
    () => (searching ? collectGroupSearchHits(group, query, mode) : []),
    [group, mode, query, searching],
  );

  if (searching && searchHits.length === 0) {
    return null;
  }

  const title = (
    <HighlightedText
      text={group.title}
      query={query}
      className="min-w-0 flex-1"
    />
  );
  const chevron = hasSidebarChildren ? <NavChevron open={trackOpen} /> : null;
  const asButton =
    hasSidebarChildren && (showLeafConcepts ? trackActive : onThisTrack);

  return (
    <li>
      {asButton ? (
        <button
          type="button"
          aria-expanded={trackOpen}
          data-nav="track"
          data-nav-id={group.id}
          data-nav-path={onPath ? "true" : undefined}
          onClick={(event) => {
            pinNavElement(event.currentTarget);
            if (!searching) {
              toggleTrackId(group.id);
            }
          }}
          aria-current={isLeafTrack ? undefined : "true"}
          className={headerClass}
        >
          {title}
          {chevron}
        </button>
      ) : (
        <Link
          href={group.href}
          prefetch={false}
          data-nav="track"
          data-nav-id={group.id}
          data-nav-path={onPath ? "true" : undefined}
          onClick={(event) => {
            pinNavElement(event.currentTarget);
            if (!hasSidebarChildren) {
              onNavigate?.();
            }
            if (pathname === group.href && window.location.hash) {
              event.preventDefault();
              applySameDocumentHref(pathname, "", pathname);
              queueHandbookHref(group.href);
              return;
            }
            queueHandbookHref(group.href);
            if (hasSidebarChildren) {
              ensureTrackOpen(group.id);
            }
          }}
          data-search-hit={
            isLeafTrack && first?.pathname === group.href && first.hash === ""
              ? "true"
              : undefined
          }
          aria-expanded={isLeafTrack ? undefined : trackOpen}
          className={headerClass}
        >
          {title}
          {chevron}
        </Link>
      )}
      <NavFold open={hasSidebarChildren && trackOpen} instant={searching} unbox>
        <ul className="mt-1.5 ml-1.5 space-y-0.5 border-l-2 border-yellow-200 pl-2 dark:border-yellow-800">
          {searching ? (
            <SearchHitList hits={searchHits} />
          ) : (
            <>
              <NavGuide level="track" />
              {group.hubTopic ? (
                <TopicRow trackId={group.id} topic={group.hubTopic} hideTitle />
              ) : null}
              {showLeafConcepts && group.leafTopic ? (
                <TopicRow
                  trackId={group.id}
                  topic={group.leafTopic}
                  hideTitle
                />
              ) : (
                group.entries.map((entry) => (
                  <TrackEntry
                    key={entryKey(entry)}
                    entry={entry}
                    trackId={group.id}
                  />
                ))
              )}
            </>
          )}
        </ul>
      </NavFold>
    </li>
  );
});

function entryKey(entry: NavEntry) {
  switch (entry.kind) {
    case "topic":
      return entry.topic.slug;
    case "subject":
      return entry.subject.slug;
    case "cluster":
      return entry.cluster.id;
    default: {
      const _never: never = entry;
      return _never;
    }
  }
}

function TrackEntry({ entry, trackId }: { entry: NavEntry; trackId: TrackId }) {
  switch (entry.kind) {
    case "topic":
      return <TopicRow trackId={trackId} topic={entry.topic} />;
    case "subject":
      return <SubjectRow trackId={trackId} subject={entry.subject} />;
    case "cluster":
      return (
        <ClusterRow
          trackId={trackId}
          subjectHref={entry.subjectHref}
          cluster={entry.cluster}
        />
      );
    default: {
      const _never: never = entry;
      return _never;
    }
  }
}
