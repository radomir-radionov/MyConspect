"use client";

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HighlightedText, useSearchMode } from "@/components/search";
import {
  CHROME,
  conceptBodySnippet,
  conceptHref,
  conceptMatchesQuery,
  searchNav,
  splitHref,
  type ChromeCopy,
  type NavCluster,
  type NavConcept,
  type NavGroup,
  type NavSubject,
  type NavTopic,
  type SearchMode,
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

function notifyConceptHash(pathname: string, conceptId: string) {
  const next = `#${conceptId}`;
  if (window.location.hash !== next) {
    window.history.replaceState(window.history.state, "", `${pathname}${next}`);
  }
  window.dispatchEvent(new CustomEvent("hashchange", { detail: { scroll: true } }));
}

function ConceptLink({
  topicHref,
  pathname,
  concept,
  isFirstConcept,
  conceptActive,
  query,
  onNavigate,
}: {
  topicHref: string;
  pathname: string;
  concept: NavConcept;
  isFirstConcept: boolean;
  conceptActive: boolean;
  query: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const mode = useSearchMode();
  const snippet = conceptBodySnippet(concept, query, mode);
  return (
    <a
      href={conceptHref(topicHref, concept.id)}
      data-concept-id={concept.id}
      data-search-hit={isFirstConcept ? "true" : undefined}
      data-search-in={snippet ? "notes" : undefined}
      onClick={(event) => {
        event.preventDefault();
        if (pathname === topicHref) {
          notifyConceptHash(pathname, concept.id);
          onNavigate?.();
          return;
        }
        closeNavSoon(onNavigate);
        router.push(conceptHref(topicHref, concept.id));
      }}
      className={
        conceptActive
          ? "block cursor-pointer rounded-md bg-yellow-50 px-2 py-1.5 text-sm font-medium text-zinc-900 ring-1 ring-inset ring-yellow-200"
          : "block cursor-pointer rounded-md px-2 py-1.5 text-sm text-zinc-700 hover:bg-yellow-50 hover:text-zinc-800"
      }
    >
      <span className="flex items-baseline justify-between gap-2">
        <HighlightedText text={concept.title} query={query} />
        {snippet ? (
          <span className="shrink-0 text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
            {CHROME.inNotes}
          </span>
        ) : null}
      </span>
      {snippet ? (
        <span className="mt-0.5 block text-xs font-normal leading-snug text-zinc-500">
          <HighlightedText text={snippet} query={query} />
        </span>
      ) : null}
    </a>
  );
}

function navAside() {
  const scroller = document.getElementById("handbook-nav-aside");
  return scroller instanceof HTMLElement ? scroller : null;
}

function scrollSidebarHit(hit: HTMLElement) {
  const scroller = navAside();
  if (!scroller) {
    return;
  }
  const scrollerBox = scroller.getBoundingClientRect();
  const hitBox = hit.getBoundingClientRect();
  if (hitBox.top < scrollerBox.top || hitBox.bottom > scrollerBox.bottom) {
    hit.scrollIntoView({ block: "nearest" });
  }
}

type SidebarPin = {
  element: HTMLElement;
  nav: string;
  id: string;
  top: number;
};

let sidebarPin: SidebarPin | null = null;
let pinCleanup: (() => void) | null = null;
let restoringPin = false;

function pinTarget(pin: SidebarPin) {
  if (pin.element.isConnected) {
    return pin.element;
  }
  const element = document.querySelector(
    `#handbook-sidebar [data-nav="${pin.nav}"][data-nav-id="${pin.id}"]`,
  );
  return element instanceof HTMLElement ? element : null;
}

function restoreSidebarPin() {
  const pin = sidebarPin;
  const scroller = navAside();
  if (!pin || !scroller || restoringPin) {
    return;
  }
  const element = pinTarget(pin);
  if (!element) {
    return;
  }
  const delta = element.getBoundingClientRect().top - pin.top;
  if (Math.abs(delta) < 1) {
    return;
  }
  restoringPin = true;
  scroller.scrollTop += delta;
  restoringPin = false;
}

function pinNavElement(element: HTMLElement) {
  const nav = element.getAttribute("data-nav");
  const id = element.getAttribute("data-nav-id");
  const scroller = navAside() ?? element.closest("#handbook-nav-aside");
  if (!nav || !id || !(scroller instanceof HTMLElement)) {
    return;
  }
  pinCleanup?.();
  sidebarPin = {
    element,
    nav,
    id,
    top: element.getBoundingClientRect().top,
  };
  const timeout = window.setTimeout(() => {
    pinCleanup?.();
  }, 2000);
  pinCleanup = () => {
    window.clearTimeout(timeout);
    sidebarPin = null;
    pinCleanup = null;
  };
}

function visibleConcepts(topic: NavTopic, query: string, mode: SearchMode) {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) {
    return topic.concepts;
  }
  return topic.concepts.filter((concept) => conceptMatchesQuery(concept, needle, mode));
}

function clusterKey(subjectHref: string, clusterId: string) {
  return `${subjectHref}#${clusterId}`;
}

function closeNavSoon(onNavigate?: () => void) {
  queueMicrotask(() => onNavigate?.());
}

function locationForPath(groups: readonly NavGroup[], pathname: string, hash: string) {
  const clusterId = decodeURIComponent(hash.replace(/^#/, ""));
  let hubSubjectHref: string | null = null;
  for (const group of groups) {
    if (group.leafTopic && (pathname === group.href || pathname === group.leafTopic.href)) {
      return {
        topicHref: group.leafTopic.href,
        subjectHref: null as string | null,
        clusterKey: null as string | null,
      };
    }
    for (const entry of group.entries) {
      switch (entry.kind) {
        case "topic":
          if (entry.topic.href === pathname) {
            return {
              topicHref: pathname,
              subjectHref: null as string | null,
              clusterKey: null as string | null,
            };
          }
          break;
        case "cluster":
          if (clusterId === entry.cluster.id) {
            const onSubject =
              pathname === entry.subjectHref ||
              pathname.startsWith(`${entry.subjectHref}/`);
            if (onSubject) {
              const onThisTopic = entry.cluster.topics.some((topic) => topic.href === pathname);
              return {
                topicHref: onThisTopic ? pathname : null,
                subjectHref: entry.subjectHref,
                clusterKey: clusterKey(entry.subjectHref, entry.cluster.id),
              };
            }
          }
          if (pathname === entry.subjectHref) {
            hubSubjectHref = entry.subjectHref;
          }
          if (entry.cluster.topics.some((topic) => topic.href === pathname)) {
            return {
              topicHref: pathname,
              subjectHref: entry.subjectHref,
              clusterKey: clusterKey(entry.subjectHref, entry.cluster.id),
            };
          }
          break;
        case "subject":
          if (entry.subject.href === pathname) {
            const cluster = entry.subject.clusters.find((item) => item.id === clusterId);
            return {
              topicHref: null as string | null,
              subjectHref: entry.subject.href,
              clusterKey: cluster ? clusterKey(entry.subject.href, cluster.id) : null,
            };
          }
          for (const cluster of entry.subject.clusters) {
            if (cluster.topics.some((topic) => topic.href === pathname)) {
              return {
                topicHref: pathname,
                subjectHref: entry.subject.href,
                clusterKey: clusterKey(entry.subject.href, cluster.id),
              };
            }
          }
          break;
        default: {
          const _never: never = entry;
          return _never;
        }
      }
    }
  }
  if (hubSubjectHref) {
    return {
      topicHref: null as string | null,
      subjectHref: hubSubjectHref,
      clusterKey: null as string | null,
    };
  }
  return { topicHref: null as string | null, subjectHref: null as string | null, clusterKey: null as string | null };
}

function rowClass(active: boolean) {
  return active
    ? "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md bg-yellow-50 px-2 py-2 text-left text-base font-medium text-zinc-900 ring-1 ring-inset ring-yellow-200"
    : "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-base text-zinc-800 hover:bg-yellow-50 hover:text-zinc-900";
}

function trackHeaderClass(highlighted: boolean) {
  return highlighted
    ? "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md bg-yellow-50 px-2 py-1 text-left text-sm font-semibold uppercase tracking-wide text-zinc-900 ring-1 ring-inset ring-yellow-200"
    : "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1 text-left text-sm font-semibold uppercase tracking-wide text-zinc-500 hover:bg-yellow-50 hover:text-zinc-800";
}

function RowTitle({
  text,
  query,
  marker = false,
  open = false,
}: {
  text: string;
  query: string;
  marker?: boolean;
  open?: boolean;
}) {
  return (
    <span className="flex min-w-0 flex-1 items-center">
      {marker ? (
        <span aria-hidden="true" className="mr-1.5 w-3 shrink-0 text-center text-zinc-500">
          {open ? "−" : "+"}
        </span>
      ) : null}
      <HighlightedText text={text} query={query} className="min-w-0" />
    </span>
  );
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
  const mode = useSearchMode();
  const hash = useSyncExternalStore(subscribeHash, getHash, () => "");
  const activeConceptId = decodeURIComponent(hash.replace(/^#/, ""));
  const { groups: filtered, firstHref } = useMemo(
    () => searchNav(groups, query, mode, pathname),
    [groups, query, mode, pathname],
  );
  const first = firstHref ? splitHref(firstHref) : null;
  const activeTrackId =
    groups.find((group) => isActiveTrack(pathname, group.href))?.id ?? null;
  const searching = query.trim().length > 0;
  const location = locationForPath(groups, pathname, hash);
  const [openTrackId, setOpenTrackId] = useState<TrackId | null>(activeTrackId);
  const [openSubjectHref, setOpenSubjectHref] = useState<string | null>(location.subjectHref);
  const [openClusterKey, setOpenClusterKey] = useState<string | null>(location.clusterKey);
  const [openTopicHref, setOpenTopicHref] = useState<string | null>(location.topicHref);
  const pinNav = useCallback((element: HTMLElement) => {
    pinNavElement(element);
  }, []);
  const [navSnapshot, setNavSnapshot] = useState({
    searching,
    activeTrackId,
    pathname,
    hash,
    activeConceptId,
  });

  if (
    searching !== navSnapshot.searching ||
    activeTrackId !== navSnapshot.activeTrackId ||
    pathname !== navSnapshot.pathname ||
    hash !== navSnapshot.hash ||
    activeConceptId !== navSnapshot.activeConceptId
  ) {
    setNavSnapshot({ searching, activeTrackId, pathname, hash, activeConceptId });
    if (!searching) {
      const leftSearch = navSnapshot.searching;
      if (
        leftSearch ||
        activeTrackId !== navSnapshot.activeTrackId ||
        pathname !== navSnapshot.pathname
      ) {
        setOpenTrackId(activeTrackId);
      }
      if (leftSearch || pathname !== navSnapshot.pathname || hash !== navSnapshot.hash) {
        setOpenSubjectHref(location.subjectHref);
        if (location.clusterKey) {
          setOpenClusterKey(location.clusterKey);
        } else if (!location.subjectHref) {
          setOpenClusterKey(null);
        }
        setOpenTopicHref(location.topicHref);
      } else if (activeConceptId && activeConceptId !== navSnapshot.activeConceptId) {
        if (location.topicHref) {
          setOpenTopicHref(location.topicHref);
        }
      }
    }
  }

  useLayoutEffect(() => {
    restoreSidebarPin();
  }, [openTopicHref, openClusterKey, pathname, hash]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => restoreSidebarPin());
    const later = window.setTimeout(restoreSidebarPin, 50);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(later);
    };
  }, [openTopicHref, openClusterKey, pathname, hash]);

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
      className="px-2 py-3"
    >
      {filtered.length === 0 ? (
        <p className="px-2 text-sm text-zinc-500">
          {mode === "notes" ? chrome.searchNotesEmpty : chrome.searchEmpty}
        </p>
      ) : (
        <ul className="space-y-0.5">
          {filtered.map((group) => {
            const isLeafTrack = Boolean(group.leafTopic) && group.entries.length === 0;
            const trackActive = isActiveHref(pathname, group.href);
            const onThisTrack = isActiveTrack(pathname, group.href);
            const trackOpen = searching || openTrackId === group.id;
            const trackHighlighted = onThisTrack || trackOpen;
            if (isLeafTrack && group.leafTopic) {
              const leaf = group.leafTopic;
              const leafOpen = trackOpen;
              const leafHeaderClass = trackHeaderClass(trackHighlighted);
              const leafChevron = (
                <span aria-hidden="true" className="shrink-0 text-base leading-none text-zinc-500">
                  {leafOpen ? "▾" : "▸"}
                </span>
              );
              return (
                <li key={group.id}>
                  {trackActive ? (
                    <button
                      type="button"
                      aria-expanded={leafOpen}
                      data-nav="track"
                      data-nav-id={group.id}
                      onClick={() => {
                        if (!searching) {
                          setOpenTrackId((current) => (current === group.id ? null : group.id));
                        }
                      }}
                      className={leafHeaderClass}
                    >
                      <HighlightedText text={group.title} query={query} className="min-w-0 flex-1" />
                      {leafChevron}
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
                      data-search-hit={first?.pathname === group.href && first.hash === "" ? "true" : undefined}
                      className={leafHeaderClass}
                    >
                      <HighlightedText text={group.title} query={query} className="min-w-0 flex-1" />
                      {leafChevron}
                    </Link>
                  )}
                  {leafOpen ? (
                    <ul className="mt-1 ml-1.5 space-y-0.5 border-l-2 border-yellow-200 pl-2">
                      <TopicRow
                        topic={leaf}
                        query={query}
                        pathname={pathname}
                        searching={searching}
                        first={first}
                        activeConceptId={activeConceptId}
                        openTopicHref={openTopicHref}
                        setOpenTopicHref={setOpenTopicHref}
                        pinNav={pinNav}
                        onNavigate={onNavigate}
                        hideTitle
                      />
                    </ul>
                  ) : null}
                </li>
              );
            }
            const trackChevron = (
              <span aria-hidden="true" className="shrink-0 text-base leading-none text-zinc-500">
                {trackOpen ? "▾" : "▸"}
              </span>
            );
            return (
              <li key={group.id}>
                {onThisTrack ? (
                  <button
                    type="button"
                    aria-expanded={trackOpen}
                    data-nav="track"
                    data-nav-id={group.id}
                    onClick={() =>
                      setOpenTrackId((current) => (current === group.id ? null : group.id))
                    }
                    aria-current="true"
                    className={trackHeaderClass(trackHighlighted)}
                  >
                    <HighlightedText text={group.title} query={query} className="min-w-0 flex-1" />
                    {trackChevron}
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
                    aria-expanded={trackOpen}
                    className={trackHeaderClass(trackHighlighted)}
                  >
                    <HighlightedText text={group.title} query={query} className="min-w-0 flex-1" />
                    {trackChevron}
                  </Link>
                )}
                {trackOpen ? (
                  <ul className="mt-1 ml-1.5 space-y-0.5 border-l-2 border-yellow-200 pl-2">
                    {group.entries.map((entry) => {
                      switch (entry.kind) {
                        case "topic":
                          return (
                            <TopicRow
                              key={entry.topic.slug}
                              topic={entry.topic}
                              query={query}
                              pathname={pathname}
                              searching={searching}
                              first={first}
                              activeConceptId={activeConceptId}
                              openTopicHref={openTopicHref}
                              setOpenTopicHref={setOpenTopicHref}
                              pinNav={pinNav}
                              onNavigate={onNavigate}
                            />
                          );
                        case "subject":
                          return (
                            <SubjectRow
                              key={entry.subject.slug}
                              subject={entry.subject}
                              query={query}
                              pathname={pathname}
                              searching={searching}
                              first={first}
                              activeConceptId={activeConceptId}
                              openSubjectHref={openSubjectHref}
                              setOpenSubjectHref={setOpenSubjectHref}
                              openClusterKey={openClusterKey}
                              setOpenClusterKey={setOpenClusterKey}
                              openTopicHref={openTopicHref}
                              setOpenTopicHref={setOpenTopicHref}
                              pinNav={pinNav}
                              onNavigate={onNavigate}
                            />
                          );
                        case "cluster":
                          return (
                            <ClusterRow
                              key={entry.cluster.id}
                              subjectHref={entry.subjectHref}
                              cluster={entry.cluster}
                              query={query}
                              pathname={pathname}
                              searching={searching}
                              first={first}
                              activeConceptId={activeConceptId}
                              openClusterKey={openClusterKey}
                              setOpenClusterKey={setOpenClusterKey}
                              openTopicHref={openTopicHref}
                              setOpenTopicHref={setOpenTopicHref}
                              pinNav={pinNav}
                              onNavigate={onNavigate}
                            />
                          );
                        default: {
                          const _never: never = entry;
                          return _never;
                        }
                      }
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

function SubjectRow({
  subject,
  query,
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
}: {
  subject: NavSubject;
  query: string;
  pathname: string;
  searching: boolean;
  first: { pathname: string; hash: string } | null;
  activeConceptId: string;
  openSubjectHref: string | null;
  setOpenSubjectHref: Dispatch<SetStateAction<string | null>>;
  openClusterKey: string | null;
  setOpenClusterKey: Dispatch<SetStateAction<string | null>>;
  openTopicHref: string | null;
  setOpenTopicHref: Dispatch<SetStateAction<string | null>>;
  pinNav: (element: HTMLElement) => void;
  onNavigate?: () => void;
}) {
  const active = isActiveHref(pathname, subject.href);
  const subjectOpen = searching || openSubjectHref === subject.href;
  const isHitSubject = first?.pathname === subject.href && first.hash === "";

  return (
    <li>
      <Link
        href={subject.href}
        data-nav="subject"
        data-nav-id={subject.slug}
        onClick={(event) => {
          if (pathname === subject.href) {
            event.preventDefault();
            if (!searching) {
              setOpenSubjectHref((current) => (current === subject.href ? null : subject.href));
            }
            return;
          }
          setOpenSubjectHref(subject.href);
          closeNavSoon(onNavigate);
        }}
        data-search-hit={isHitSubject ? "true" : undefined}
        aria-current={active ? "page" : undefined}
        aria-expanded={subjectOpen}
        className={rowClass(isHitSubject || active || subjectOpen)}
      >
        <RowTitle text={subject.title} query={query} />
        <span aria-hidden="true" className="shrink-0 text-lg leading-none text-zinc-500">
          {subjectOpen ? "▾" : "▸"}
        </span>
      </Link>
      {subjectOpen ? (
        <ul className="mt-0.5 mb-1 ml-2 space-y-0.5 border-l border-yellow-200 pl-2">
          {subject.clusters.map((cluster) => (
            <ClusterRow
              key={cluster.id}
              subjectHref={subject.href}
              cluster={cluster}
              query={query}
              pathname={pathname}
              searching={searching}
              first={first}
              activeConceptId={activeConceptId}
              openClusterKey={openClusterKey}
              setOpenClusterKey={setOpenClusterKey}
              openTopicHref={openTopicHref}
              setOpenTopicHref={setOpenTopicHref}
              pinNav={pinNav}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function ClusterRow({
  subjectHref: subjectPath,
  cluster,
  query,
  pathname,
  searching,
  first,
  activeConceptId,
  openClusterKey,
  setOpenClusterKey,
  openTopicHref,
  setOpenTopicHref,
  pinNav,
  onNavigate,
}: {
  subjectHref: string;
  cluster: NavCluster;
  query: string;
  pathname: string;
  searching: boolean;
  first: { pathname: string; hash: string } | null;
  activeConceptId: string;
  openClusterKey: string | null;
  setOpenClusterKey: Dispatch<SetStateAction<string | null>>;
  openTopicHref: string | null;
  setOpenTopicHref: Dispatch<SetStateAction<string | null>>;
  pinNav: (element: HTMLElement) => void;
  onNavigate?: () => void;
}) {
  const onlyTopic = cluster.topics.length === 1 ? cluster.topics[0] : null;

  if (onlyTopic) {
    return (
      <TopicRow
        topic={{ ...onlyTopic, title: cluster.title }}
        query={query}
        pathname={pathname}
        searching={searching}
        first={first}
        activeConceptId={activeConceptId}
        openTopicHref={openTopicHref}
        setOpenTopicHref={setOpenTopicHref}
        pinNav={pinNav}
        onNavigate={onNavigate}
        compact
        navKind="cluster"
        navId={cluster.id}
      />
    );
  }
  const key = clusterKey(subjectPath, cluster.id);
  const clusterOpen = searching || openClusterKey === key;
  const onHub = pathname === subjectPath;
  const active = onHub && activeConceptId === cluster.id;
  const isHitCluster = first?.pathname === subjectPath && first.hash === `#${cluster.id}`;

  return (
    <li>
      <Link
        href={cluster.href}
        scroll={false}
        data-nav="cluster"
        data-nav-id={cluster.id}
        onClick={(event) => {
          pinNav(event.currentTarget);
          if (onHub) {
            event.preventDefault();
            const next = `#${cluster.id}`;
            const sameHash = window.location.hash === next;
            if (!searching) {
              if (sameHash) {
                setOpenClusterKey((current) => (current === key ? null : key));
              } else {
                setOpenClusterKey(key);
              }
            }
            if (!sameHash) {
              window.history.replaceState(window.history.state, "", `${pathname}${next}`);
              window.dispatchEvent(new Event("hashchange"));
            }
            return;
          }
          setOpenClusterKey(key);
          closeNavSoon(onNavigate);
        }}
        data-search-hit={isHitCluster ? "true" : undefined}
        aria-current={active ? "location" : undefined}
        aria-expanded={clusterOpen}
        className={rowClass(isHitCluster || active || clusterOpen)}
      >
        <RowTitle text={cluster.title} query={query} marker open={clusterOpen} />
      </Link>
      {clusterOpen ? (
        <ul className="mt-0.5 space-y-0.5 pl-2">
          {cluster.topics.map((topic) => (
            <TopicRow
              key={topic.slug}
              topic={topic}
              query={query}
              pathname={pathname}
              searching={searching}
              first={first}
              activeConceptId={activeConceptId}
              openTopicHref={openTopicHref}
              setOpenTopicHref={setOpenTopicHref}
              pinNav={pinNav}
              onNavigate={onNavigate}
              compact
              navKind="topic"
              navId={topic.slug}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function TopicRow({
  topic,
  query,
  pathname,
  searching,
  first,
  activeConceptId,
  openTopicHref,
  setOpenTopicHref,
  pinNav,
  onNavigate,
  compact = false,
  hideTitle = false,
  navKind = "topic",
  navId,
}: {
  topic: NavTopic;
  query: string;
  pathname: string;
  searching: boolean;
  first: { pathname: string; hash: string } | null;
  activeConceptId: string;
  openTopicHref: string | null;
  setOpenTopicHref: Dispatch<SetStateAction<string | null>>;
  pinNav: (element: HTMLElement) => void;
  onNavigate?: () => void;
  compact?: boolean;
  hideTitle?: boolean;
  navKind?: "cluster" | "topic";
  navId?: string;
}) {
  const mode = useSearchMode();
  const active = isActiveHref(pathname, topic.href);
  const isHitTopic = first?.pathname === topic.href;
  const isFirstTopic = isHitTopic && first.hash === "";
  const matchingConcepts = visibleConcepts(topic, query, mode);
  const topicOpen = hideTitle
    ? true
    : searching
      ? matchingConcepts.length > 0
      : openTopicHref === topic.href;
  const concepts = topicOpen ? matchingConcepts : [];

  if (hideTitle) {
    if (concepts.length === 0) {
      return null;
    }
    return (
      <>
        {concepts.map((concept) => {
          const conceptActive = concept.id === activeConceptId;
          const isFirstConcept =
            first?.pathname === topic.href && first.hash === `#${concept.id}`;
          return (
            <li key={concept.id}>
              <ConceptLink
                topicHref={topic.href}
                pathname={pathname}
                concept={concept}
                isFirstConcept={isFirstConcept}
                conceptActive={conceptActive}
                query={query}
                onNavigate={onNavigate}
              />
            </li>
          );
        })}
      </>
    );
  }

  return (
    <li>
      <Link
        href={topic.href}
        scroll={false}
        data-nav={navKind}
        data-nav-id={navId ?? topic.slug}
        onClick={(event) => {
          pinNav(event.currentTarget);
          if (pathname === topic.href) {
            event.preventDefault();
            if (!searching) {
              setOpenTopicHref((current) => (current === topic.href ? null : topic.href));
            }
            return;
          }
          setOpenTopicHref(topic.href);
          closeNavSoon(onNavigate);
        }}
        data-search-hit={isFirstTopic ? "true" : undefined}
        aria-current={active ? "page" : undefined}
        aria-expanded={topicOpen}
        className={rowClass(isHitTopic || active || topicOpen)}
      >
        <RowTitle text={topic.title} query={query} marker={compact} open={topicOpen} />
        {compact ? null : (
          <span aria-hidden="true" className="shrink-0 text-lg leading-none text-zinc-500">
            {topicOpen ? "▾" : "▸"}
          </span>
        )}
      </Link>
      {concepts.length > 0 ? (
        <ul className={compact ? "mt-0.5 mb-1 space-y-0.5 pl-2" : "mt-0.5 mb-1 space-y-0.5 pl-3"}>
          {concepts.map((concept) => {
            const conceptActive = concept.id === activeConceptId;
            const isFirstConcept =
              first?.pathname === topic.href && first.hash === `#${concept.id}`;
            return (
              <li key={concept.id}>
                <ConceptLink
                  topicHref={topic.href}
                  pathname={pathname}
                  concept={concept}
                  isFirstConcept={isFirstConcept}
                  conceptActive={conceptActive}
                  query={query}
                  onNavigate={onNavigate}
                />
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
}
