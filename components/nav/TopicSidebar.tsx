"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useSyncExternalStore, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HighlightedText, useSearchMode } from "@/components/search";
import { HANDBOOK_SIDEBAR_ID, NAV_FOLD_MS } from "@/constants";
import { searchNav, splitHref, type ChromeCopy, type NavEntry, type NavGroup } from "@/lib/nav";
import type { TrackId } from "@/lib/catalog";
import { NavChevron, NavFold } from "./NavFold";
import { getHash, getServerHash, subscribeHash } from "./hash";
import { isActiveHref, isActiveTrack } from "./location";
import { pinNavElement, restoreSidebarPin, scrollSidebarHit } from "./sidebarPin";
import { SidebarNavProvider, closeNavSoon, trackHeaderClass } from "./sidebarContext";
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
  const first = useMemo(() => (firstHref ? splitHref(firstHref) : null), [firstHref]);
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
  const pinNav = useCallback((element: HTMLElement) => {
    pinNavElement(element);
  }, []);

  useLayoutEffect(() => {
    restoreSidebarPin();
  }, [openTopicHref, openClusterKey, pathname, hash]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => restoreSidebarPin());
    const later = window.setTimeout(restoreSidebarPin, NAV_FOLD_MS + 20);
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
      const hit = nav?.querySelector(`[data-concept-id="${CSS.escape(activeConceptId)}"]`);
      if (hit instanceof HTMLElement) {
        scrollSidebarHit(hit);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeConceptId, openTopicHref, searching]);

  const navValue = useMemo(
    () => ({
      query,
      mode,
      pathname,
      searching,
      first,
      activeConceptId,
      openSubjectHref,
      setOpenSubjectHref,
      openClusterKey,
      setOpenClusterKey,
      openTopicHref,
      setOpenTopicHref,
      pinNav,
      onNavigate,
    }),
    [
      query,
      mode,
      pathname,
      searching,
      first,
      activeConceptId,
      openSubjectHref,
      setOpenSubjectHref,
      openClusterKey,
      setOpenClusterKey,
      openTopicHref,
      setOpenTopicHref,
      pinNav,
      onNavigate,
    ],
  );

  return (
    <SidebarNavProvider value={navValue}>
      <nav id={HANDBOOK_SIDEBAR_ID} aria-label={chrome.topicsNav} className="px-2 py-3">
        {filtered.length === 0 ? (
          <p className="px-2 text-sm text-zinc-500">
            {mode === "notes" ? chrome.searchNotesEmpty : chrome.searchEmpty}
          </p>
        ) : (
          <ul className="space-y-0.5">
            {filtered.map((group) => (
              <TrackGroup
                key={group.id}
                group={group}
                query={query}
                pathname={pathname}
                searching={searching}
                first={first}
                openTrackId={openTrackId}
                setOpenTrackId={setOpenTrackId}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        )}
      </nav>
    </SidebarNavProvider>
  );
});

function TrackGroup({
  group,
  query,
  pathname,
  searching,
  first,
  openTrackId,
  setOpenTrackId,
  onNavigate,
}: {
  group: NavGroup;
  query: string;
  pathname: string;
  searching: boolean;
  first: { pathname: string; hash: string } | null;
  openTrackId: TrackId | null;
  setOpenTrackId: Dispatch<SetStateAction<TrackId | null>>;
  onNavigate?: () => void;
}) {
  const isLeafTrack = Boolean(group.leafTopic) && group.entries.length === 0;
  const trackActive = isActiveHref(pathname, group.href);
  const onThisTrack = isActiveTrack(pathname, group.href);
  const trackOpen = searching || openTrackId === group.id;
  const headerClass = trackHeaderClass(onThisTrack || trackOpen);
  const title = (
    <HighlightedText text={group.title} query={query} className="min-w-0 flex-1" />
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
          onClick={() => {
            if (!searching) {
              setOpenTrackId((current) => (current === group.id ? null : group.id));
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
          data-nav="track"
          data-nav-id={group.id}
          onClick={() => {
            setOpenTrackId(group.id);
            closeNavSoon(onNavigate);
          }}
          data-search-hit={
            isLeafTrack && first?.pathname === group.href && first.hash === "" ? "true" : undefined
          }
          aria-expanded={isLeafTrack ? undefined : trackOpen}
          className={headerClass}
        >
          {title}
          {chevron}
        </Link>
      )}
      <NavFold open={trackOpen} instant={searching}>
        <ul className="mt-1 ml-1.5 space-y-0.5 border-l-2 border-yellow-200 pl-2">
          {isLeafTrack && group.leafTopic ? (
            <TopicRow topic={group.leafTopic} hideTitle />
          ) : (
            group.entries.map((entry) => <TrackEntry key={entryKey(entry)} entry={entry} />)
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
      return <ClusterRow subjectHref={entry.subjectHref} cluster={entry.cluster} />;
    default: {
      const _never: never = entry;
      return _never;
    }
  }
}
