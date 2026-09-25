"use client";

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HighlightedText, useSearchMode } from "@/components/search";
import {
  HANDBOOK_NAV_ASIDE_ID,
  HANDBOOK_SIDEBAR_ID,
  NAV_FOLD_MS,
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
import type { TrackId } from "@/lib/catalog";
import { NavChevron, NavFold } from "./NavFold";
import { NavGuide } from "./NavGuide";
import { getHash, getServerHash, subscribeHash } from "./hash";
import { isActiveHref, isActiveTrack } from "./location";
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
import { SidebarNavProvider, trackHeaderClass } from "./sidebarContext";
import { ClusterRow, SubjectRow, TopicRow } from "./sidebarRows";
import { useSidebarOpen } from "./useSidebarOpen";

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
  const pathname = usePathname() ?? "/";
  const mode = useSearchMode();
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const { groups: filtered, firstHref } = useMemo(
    () => searchNav(groups, query, mode, pathname),
    [groups, query, mode, pathname],
  );
  const first = useMemo(
    () => (firstHref ? splitHref(firstHref) : null),
    [firstHref],
  );
  const activeTrackId =
    groups.find((group) => isActiveTrack(pathname, group.href))?.id ?? null;
  const searching = query.trim().length > 0;
  const {
    activeConceptId,
    openTrackId,
    setOpenTrackId,
    openSubjectHref,
    setOpenSubjectHref,
    openClusterKey,
    setOpenClusterKey,
    openTopicHref,
    setOpenTopicHref,
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
  const stickyRevision = `${openTopicHref}|${openClusterKey}|${openSubjectHref}|${pathname}|${hash}|${searching}|${query}`;

  useLayoutEffect(() => {
    restoreSidebarPin();
  }, [
    openTopicHref,
    openClusterKey,
    openSubjectHref,
    pathname,
    hash,
    searching,
    query,
  ]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      restoreSidebarPin();
    });
    const later = window.setTimeout(() => {
      restoreSidebarPin();
    }, NAV_FOLD_MS + 20);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(later);
    };
  }, [openTopicHref, openClusterKey, pathname, hash]);

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
      const hit = nav?.querySelector(
        `[data-concept-id="${CSS.escape(activeConceptId)}"]`,
      );
      if (hit instanceof HTMLElement) {
        scrollSidebarHit(hit);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeConceptId, openTopicHref, searching]);

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
      openSubjectHref,
      setOpenSubjectHref,
      openClusterKey,
      setOpenClusterKey,
      openTopicHref,
      setOpenTopicHref,
    }),
    [
      openSubjectHref,
      setOpenSubjectHref,
      openClusterKey,
      setOpenClusterKey,
      openTopicHref,
      setOpenTopicHref,
    ],
  );
  const activeValue = useMemo(() => ({ activeConceptId }), [activeConceptId]);

  return (
    <SidebarNavProvider
      chrome={chromeValue}
      fold={foldValue}
      active={activeValue}
    >
      <nav
        id={HANDBOOK_SIDEBAR_ID}
        aria-label={chrome.topicsNav}
        className="relative isolate px-2 py-3"
      >
        <div data-nav-sticky-cover="" aria-hidden="true" />
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
                openTrackId={openTrackId}
                setOpenTrackId={setOpenTrackId}
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

  useLayoutEffect(() => {
    applyVars();
  }, [applyVars, revision]);

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
    window.addEventListener("resize", applyVars);
    return () => {
      scroller?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", applyVars);
      window.cancelAnimationFrame(frame);
    };
  }, [applyVars]);

  useEffect(() => {
    const later = window.setTimeout(applyVars, NAV_FOLD_MS + 20);
    return () => window.clearTimeout(later);
  }, [applyVars, revision]);

  return null;
}

function TrackGroup({
  group,
  query,
  mode,
  pathname,
  searching,
  first,
  openTrackId,
  setOpenTrackId,
}: {
  group: NavGroup;
  query: string;
  mode: SearchMode;
  pathname: string;
  searching: boolean;
  first: { pathname: string; hash: string } | null;
  openTrackId: TrackId | null;
  setOpenTrackId: Dispatch<SetStateAction<TrackId | null>>;
}) {
  const isLeafTrack = Boolean(group.leafTopic) && group.entries.length === 0;
  const trackActive = isActiveHref(pathname, group.href);
  const onThisTrack = isActiveTrack(pathname, group.href);
  const trackOpen = searching || openTrackId === group.id;
  const onPath = !searching && onThisTrack;
  const needle = query.trim().toLowerCase();
  const trackHighlighted = searching
    ? needle.length > 0 && matchesQuery(group.title, needle)
    : onThisTrack || trackOpen;
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
  const chevron = <NavChevron open={trackOpen} />;
  const asButton = isLeafTrack ? trackActive : onThisTrack;

  return (
    <li>
      {asButton ? (
        <button
          type="button"
          aria-expanded={trackOpen}
          data-nav="track"
          data-nav-id={group.id}
          data-nav-path={onPath ? "true" : undefined}
          onClick={() => {
            if (!searching) {
              setOpenTrackId((current) =>
                current === group.id ? null : group.id,
              );
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
          onClick={() => {
            setOpenTrackId(group.id);
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
      <NavFold open={trackOpen} instant={searching || !trackOpen} unbox>
        <ul className="mt-1.5 ml-1.5 space-y-0.5 border-l-2 border-yellow-200 pl-2 dark:border-yellow-800">
          {searching ? (
            <SearchHitList hits={searchHits} />
          ) : (
            <>
              <NavGuide level="track" />
              {isLeafTrack && group.leafTopic ? (
                <TopicRow topic={group.leafTopic} hideTitle />
              ) : (
                group.entries.map((entry) => (
                  <TrackEntry key={entryKey(entry)} entry={entry} />
                ))
              )}
            </>
          )}
        </ul>
      </NavFold>
    </li>
  );
}

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

function TrackEntry({ entry }: { entry: NavEntry }) {
  switch (entry.kind) {
    case "topic":
      return <TopicRow topic={entry.topic} />;
    case "subject":
      return <SubjectRow subject={entry.subject} />;
    case "cluster":
      return (
        <ClusterRow subjectHref={entry.subjectHref} cluster={entry.cluster} />
      );
    default: {
      const _never: never = entry;
      return _never;
    }
  }
}
