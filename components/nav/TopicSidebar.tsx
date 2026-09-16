"use client";

import { memo, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HighlightedText } from "@/components/search";
import {
  conceptHref,
  filterNavGroups,
  firstSearchHref,
  matchesQuery,
  splitHref,
  type ChromeCopy,
  type NavGroup,
  type NavTopic,
} from "@/lib/nav";
import type { TrackId } from "@/lib/catalog";

function isActiveHref(pathname: string, href: string): boolean {
  return pathname === href;
}

function isActiveTrack(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function subscribeHash(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

function getHash() {
  return window.location.hash;
}

function scrollSidebarHit(hit: HTMLElement) {
  const scroller = document.getElementById("handbook-nav-aside");
  if (!(scroller instanceof HTMLElement)) {
    return;
  }
  const scrollerBox = scroller.getBoundingClientRect();
  const hitBox = hit.getBoundingClientRect();
  if (hitBox.top < scrollerBox.top || hitBox.bottom > scrollerBox.bottom) {
    hit.scrollIntoView({ block: "nearest" });
  }
}

function visibleConcepts(topic: NavTopic, query: string) {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) {
    return topic.concepts;
  }
  return topic.concepts.filter((concept) =>
    matchesQuery(concept.title, needle) || matchesQuery(concept.searchText ?? "", needle),
  );
}

function topicHrefForPath(groups: readonly NavGroup[], pathname: string): string | null {
  return groups.some((group) => group.topics.some((topic) => topic.href === pathname))
    ? pathname
    : null;
}

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
  const hash = useSyncExternalStore(subscribeHash, getHash, () => "");
  const activeConceptId = decodeURIComponent(hash.replace(/^#/, ""));
  const filtered = filterNavGroups(groups, query);
  const firstHref = firstSearchHref(groups, query, pathname);
  const first = firstHref ? splitHref(firstHref) : null;
  const activeTrackId =
    groups.find((group) => isActiveTrack(pathname, group.href))?.id ?? null;
  const searching = query.trim().length > 0;
  const [openTrackId, setOpenTrackId] = useState<TrackId | null>(activeTrackId);
  const [openTopicHref, setOpenTopicHref] = useState<string | null>(
    topicHrefForPath(groups, pathname),
  );
  const [navSnapshot, setNavSnapshot] = useState({
    searching,
    activeTrackId,
    pathname,
    activeConceptId,
  });

  if (
    searching !== navSnapshot.searching ||
    activeTrackId !== navSnapshot.activeTrackId ||
    pathname !== navSnapshot.pathname ||
    activeConceptId !== navSnapshot.activeConceptId
  ) {
    setNavSnapshot({ searching, activeTrackId, pathname, activeConceptId });
    if (!searching) {
      const leftSearch = navSnapshot.searching;
      if (leftSearch || activeTrackId !== navSnapshot.activeTrackId) {
        setOpenTrackId(activeTrackId);
      }
      if (leftSearch || pathname !== navSnapshot.pathname) {
        setOpenTopicHref(topicHrefForPath(groups, pathname));
      } else if (activeConceptId && activeConceptId !== navSnapshot.activeConceptId) {
        const topicHref = topicHrefForPath(groups, pathname);
        if (topicHref) {
          setOpenTopicHref(topicHref);
        }
      }
    }
  }

  useEffect(() => {
    if (!firstHref) {
      return;
    }
    const nav = document.getElementById("handbook-sidebar");
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
      const nav = document.getElementById("handbook-sidebar");
      const hit = nav?.querySelector(
        `[data-concept-id="${CSS.escape(activeConceptId)}"]`,
      );
      if (hit instanceof HTMLElement) {
        scrollSidebarHit(hit);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeConceptId, openTopicHref, searching]);

  return (
    <nav
      id="handbook-sidebar"
      aria-label={chrome.topicsNav}
      className="px-[var(--chrome-inline)] py-4"
    >
      {filtered.length === 0 ? (
        <p className="px-2 text-sm text-zinc-500">{chrome.searchEmpty}</p>
      ) : (
        <ul className="space-y-0.5">
          {filtered.map((group) => {
            const trackOpen = searching || openTrackId === group.id;
            return (
              <li key={group.id}>
                <button
                  type="button"
                  aria-expanded={trackOpen}
                  onClick={() =>
                    setOpenTrackId((current) => (current === group.id ? null : group.id))
                  }
                  className={
                    trackOpen
                      ? "flex w-full cursor-pointer items-center justify-between rounded-md bg-yellow-50 px-2 py-1 text-left text-sm font-semibold uppercase tracking-wide text-zinc-900 ring-1 ring-inset ring-yellow-200"
                      : "flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1 text-left text-sm font-semibold uppercase tracking-wide text-zinc-500 hover:bg-yellow-50 hover:text-zinc-800"
                  }
                >
                  <HighlightedText
                    text={group.title}
                    query={query}
                    className="min-w-0 flex-1"
                  />
                  <span aria-hidden="true" className="shrink-0 text-base leading-none text-zinc-500">
                    {trackOpen ? "▾" : "▸"}
                  </span>
                </button>
                {trackOpen ? (
                  <ul className="mt-1 ml-3 space-y-0.5 border-l-2 border-yellow-200 pl-2.5">
                    {group.topics.map((topic) => {
                      const active = isActiveHref(pathname, topic.href);
                      const isHitTopic = first?.pathname === topic.href;
                      const isFirstTopic = isHitTopic && first.hash === "";
                      const matchingConcepts = visibleConcepts(topic, query);
                      const topicOpen = searching
                        ? matchingConcepts.length > 0
                        : openTopicHref === topic.href;
                      const concepts = topicOpen ? matchingConcepts : [];
                      return (
                        <li key={topic.slug}>
                          <Link
                            href={topic.href}
                            onClick={(event) => {
                              if (pathname === topic.href) {
                                event.preventDefault();
                                if (!searching) {
                                  setOpenTopicHref((current) =>
                                    current === topic.href ? null : topic.href,
                                  );
                                }
                                return;
                              }
                              setOpenTopicHref(topic.href);
                              onNavigate?.();
                            }}
                            data-search-hit={isFirstTopic ? "true" : undefined}
                            aria-current={active ? "page" : undefined}
                            aria-expanded={topicOpen}
                            className={
                              isHitTopic || active || topicOpen
                                ? "flex cursor-pointer items-center justify-between rounded-md bg-yellow-50 px-2 py-2 text-base font-medium text-zinc-900 ring-1 ring-inset ring-yellow-200"
                                : "flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-base text-zinc-800 hover:bg-yellow-50 hover:text-zinc-900"
                            }
                          >
                            <HighlightedText
                              text={topic.title}
                              query={query}
                              className="min-w-0 flex-1"
                            />
                            <span aria-hidden="true" className="shrink-0 text-lg leading-none text-zinc-500">
                              {topicOpen ? "▾" : "▸"}
                            </span>
                          </Link>
                          {concepts.length > 0 ? (
                            <ul className="mt-0.5 mb-1 space-y-0.5 pl-3">
                              {concepts.map((concept) => {
                                const conceptActive = concept.id === activeConceptId;
                                const isFirstConcept =
                                  first?.pathname === topic.href && first.hash === `#${concept.id}`;
                                return (
                                  <li key={concept.id}>
                                    <Link
                                      href={conceptHref(topic.href, concept.id)}
                                      data-concept-id={concept.id}
                                      data-search-hit={isFirstConcept ? "true" : undefined}
                                      onClick={(event) => {
                                        if (pathname === topic.href) {
                                          event.preventDefault();
                                          const next = `#${concept.id}`;
                                          if (window.location.hash !== next) {
                                            window.history.replaceState(
                                              window.history.state,
                                              "",
                                              `${pathname}${next}`,
                                            );
                                          }
                                          window.dispatchEvent(new Event("hashchange"));
                                        }
                                        onNavigate?.();
                                      }}
                                      className={
                                        conceptActive
                                          ? "block cursor-pointer rounded-md bg-yellow-50 px-2 py-1.5 text-sm font-medium text-zinc-900 ring-1 ring-inset ring-yellow-200"
                                          : "block cursor-pointer rounded-md px-2 py-1.5 text-sm text-zinc-700 hover:bg-yellow-50 hover:text-zinc-800"
                                      }
                                    >
                                      <HighlightedText text={concept.title} query={query} />
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
});
