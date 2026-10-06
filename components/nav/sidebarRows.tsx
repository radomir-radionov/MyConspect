"use client";

import { memo } from "react";
import Link from "next/link";
import { HighlightedText } from "@/components/search";
import type { TrackId } from "@/lib/catalog";
import {
  CHROME,
  conceptBodySnippet,
  conceptHref,
  conceptMatchesQuery,
  type NavCluster,
  type NavConcept,
  type NavSection,
  type NavSubject,
  type NavTopic,
  type SearchMode,
} from "@/lib/nav";
import { filterInterviewConcepts, sameTitle } from "@/lib/nav/navUtils";
import { BookmarkStar } from "./BookmarkButton";
import { NavChevron, NavFold } from "./NavFold";
import { NavGuide } from "./NavGuide";
import {
  applySameDocumentHref,
  followHandbookHref,
  queueHandbookHref,
  replacePathHash,
  setHashOnPath,
} from "./hash";
import { localeFromPathname } from "@/lib/i18n/paths";
import {
  subjectCautionLabel,
  subjectCautionTooltip,
} from "@/lib/nav/subjectCaution";
import {
  closedSectionKey,
  clusterKey,
  isNavSectionCollapsible,
  isNavSectionOpen,
  sectionKey,
  isActiveHref,
  isConceptActiveOnPage,
  isOnSubjectPath,
} from "./location";
import { NavCautionBadge } from "./NavCautionBadge";
import { clusterNavigateHref } from "@/lib/nav/sections";
import {
  closeNavSoon,
  NAV_ROW_GAP,
  rowClass,
  useScopedSidebarFold,
  useSidebarActive,
  useSidebarBookmarks,
  useSidebarChrome,
  useSidebarFoldScope,
  useSidebarHighlight,
} from "./sidebarContext";

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
        <span
          aria-hidden="true"
          className="mr-1.5 w-3 shrink-0 text-center text-zinc-500 dark:text-zinc-400"
        >
          {open ? "−" : "+"}
        </span>
      ) : null}
      <HighlightedText text={text} query={query} className="min-w-0" />
    </span>
  );
}

function isDuplicateConceptTitle(
  topicTitle: string,
  conceptTitle: string,
): boolean {
  const topic = topicTitle.trim().toLowerCase();
  const concept = conceptTitle.trim().toLowerCase();
  return (
    topic === concept ||
    concept.startsWith(`${topic} `) ||
    topic.startsWith(`${concept} `)
  );
}

function visibleConcepts(topic: NavTopic, query: string, mode: SearchMode) {
  const needle = query.trim().toLowerCase();
  const matched =
    needle.length === 0
      ? topic.concepts
      : topic.concepts.filter((concept) =>
          conceptMatchesQuery(concept, needle, mode),
        );
  const only = matched.length === 1 ? matched[0] : undefined;
  if (only && isDuplicateConceptTitle(topic.title, only.title)) {
    if (
      mode === "notes" &&
      needle.length > 0 &&
      conceptBodySnippet(only, query, mode)
    ) {
      return matched;
    }
    return [];
  }
  return matched;
}

function conceptRowClass(
  active: boolean,
  indentClass: string,
  rowGapClass: string,
  onPath: boolean,
): string {
  const highlight = active
    ? "block w-full cursor-pointer rounded-md bg-yellow-50 px-2 py-1.5 text-sm font-medium text-zinc-900 ring-1 ring-yellow-200 dark:bg-yellow-950 dark:text-zinc-50 dark:ring-yellow-800"
    : "block w-full cursor-pointer rounded-md px-2 py-1.5 text-sm text-zinc-700 hover:bg-yellow-50 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-yellow-950/60 dark:hover:text-zinc-50";
  return `${highlight} ${indentClass}${rowGapClass ? ` ${rowGapClass}` : ""}${onPath ? " sticky" : ""}`;
}

export const ConceptLink = memo(function ConceptLink({
  topicHref,
  concept,
  isFirstConcept,
  conceptActive,
  onPath = false,
  indentClass = "pl-4",
  rowGapClass = "",
}: {
  topicHref: string;
  concept: NavConcept;
  isFirstConcept: boolean;
  conceptActive: boolean;
  onPath?: boolean;
  indentClass?: string;
  rowGapClass?: string;
}) {
  const { query, mode, pathname, onNavigate, goToPath } = useSidebarChrome();
  const { isBookmarked } = useSidebarBookmarks();
  const snippet = conceptBodySnippet(concept, query, mode);
  const bookmarked = isBookmarked(topicHref, concept.id);
  return (
    <a
      href={conceptHref(topicHref, concept.id)}
      data-concept-id={concept.id}
      data-nav-path={onPath ? "true" : undefined}
      data-search-hit={isFirstConcept ? "true" : undefined}
      data-search-in={snippet ? "notes" : undefined}
      onClick={(event) => {
        event.preventDefault();
        if (pathname === topicHref) {
          setHashOnPath(pathname, concept.id, false);
          closeNavSoon(onNavigate);
          return;
        }
        closeNavSoon(onNavigate);
        followHandbookHref(
          conceptHref(topicHref, concept.id),
          pathname,
          goToPath,
        );
      }}
      className={conceptRowClass(
        conceptActive,
        indentClass,
        rowGapClass,
        onPath,
      )}
    >
      <span className="flex items-baseline justify-between gap-2">
        <span className="min-w-0">
          <HighlightedText text={concept.title} query={query} />
        </span>
        <span className="flex shrink-0 items-baseline gap-1.5">
          {snippet ? (
            <span className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase dark:text-zinc-500">
              {CHROME.inNotes}
            </span>
          ) : null}
          {bookmarked ? <BookmarkStar /> : null}
        </span>
      </span>
      {snippet ? (
        <span className="mt-0.5 block text-xs font-normal leading-snug text-zinc-500 dark:text-zinc-400">
          <HighlightedText text={snippet} query={query} />
        </span>
      ) : null}
    </a>
  );
});

function ConceptItems({
  topic,
  concepts,
  indentClass = "pl-4",
}: {
  topic: NavTopic;
  concepts: readonly NavConcept[];
  indentClass?: string;
}) {
  const { first, searching } = useSidebarChrome();
  const { highlightPathname } = useSidebarHighlight();
  const { activeConceptId } = useSidebarActive();
  return (
    <>
      {concepts.map((concept, index) => {
        const conceptActive = isConceptActiveOnPage(
          highlightPathname,
          topic.href,
          concept.id,
          activeConceptId,
        );
        const isFirstConcept =
          first?.pathname === topic.href && first.hash === `#${concept.id}`;
        const onPath = conceptActive && !searching;
        const showGroup =
          Boolean(concept.group) &&
          concept.group !== concepts[index - 1]?.group;
        return (
          <li key={concept.id} className="contents">
            {showGroup ? (
              <p
                className={`${indentClass} pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400`}
              >
                {concept.group}
              </p>
            ) : null}
            <ConceptLink
              topicHref={topic.href}
              concept={concept}
              isFirstConcept={isFirstConcept}
              conceptActive={conceptActive}
              onPath={onPath}
              indentClass={indentClass}
              rowGapClass={index === 0 ? NAV_ROW_GAP : "mt-0.5"}
            />
          </li>
        );
      })}
    </>
  );
}

const SECTION_TOPIC_INDENT = "pl-8";

const SectionTopicLink = memo(function SectionTopicLink({
  topic,
  title,
  navId,
  rowGapClass = "",
}: {
  topic: NavTopic;
  title: string;
  navId: string;
  rowGapClass?: string;
}) {
  const { query, pathname, searching, first, onNavigate, goToPath } =
    useSidebarChrome();
  const { highlightPathname } = useSidebarHighlight();
  const { isBookmarked } = useSidebarBookmarks();
  const active = isActiveHref(highlightPathname, topic.href);
  const isFirstTopic = first?.pathname === topic.href && first.hash === "";
  const onPath = !searching && active;
  const bookmarked = isBookmarked(topic.href);

  return (
    <Link
      href={topic.href}
      prefetch={false}
      data-nav="topic"
      data-nav-id={navId}
      data-nav-path={onPath ? "true" : undefined}
      data-search-hit={isFirstTopic ? "true" : undefined}
      onClick={(event) => {
        if (pathname === topic.href) {
          event.preventDefault();
          if (window.location.hash) {
            applySameDocumentHref(pathname, "", pathname);
          }
          closeNavSoon(onNavigate);
          return;
        }
        closeNavSoon(onNavigate);
        followHandbookHref(topic.href, pathname, goToPath);
      }}
      className={conceptRowClass(
        active,
        SECTION_TOPIC_INDENT,
        rowGapClass,
        onPath,
      )}
    >
      <span className="flex items-baseline justify-between gap-2">
        <span className="min-w-0">
          <HighlightedText text={title} query={query} />
        </span>
        {bookmarked ? (
          <span className="shrink-0">
            <BookmarkStar />
          </span>
        ) : null}
      </span>
    </Link>
  );
});

function SectionClusterNav({
  flatNav = false,
  trackId,
  subjectHref,
  cluster,
  rowGapClass = "",
}: {
  flatNav?: boolean;
  trackId: TrackId;
  subjectHref: string;
  cluster: NavCluster;
  rowGapClass?: string;
}) {
  if (flatNav) {
    return (
      <>
        {cluster.topics.map((topic, index) => (
          <li key={topic.slug} className="contents">
            <SectionTopicLink
              topic={topic}
              title={cluster.topics.length === 1 ? cluster.title : topic.title}
              navId={cluster.topics.length === 1 ? cluster.id : topic.slug}
              rowGapClass={index === 0 ? rowGapClass : "mt-0.5"}
            />
          </li>
        ))}
      </>
    );
  }

  return (
    <ClusterRow trackId={trackId} subjectHref={subjectHref} cluster={cluster} />
  );
}

function SectionClusterList({
  flatNav = false,
  trackId,
  subjectHref,
  clusters,
}: {
  flatNav?: boolean;
  trackId: TrackId;
  subjectHref: string;
  clusters: readonly NavCluster[];
}) {
  return (
    <>
      {clusters.map((cluster, index) => (
        <SectionClusterNav
          key={cluster.id}
          flatNav={flatNav}
          trackId={trackId}
          subjectHref={subjectHref}
          cluster={cluster}
          rowGapClass={index === 0 ? NAV_ROW_GAP : "mt-0.5"}
        />
      ))}
    </>
  );
}

function TopicConceptNav({
  topic,
  concepts,
  searching = false,
  indentClass = "pl-4",
}: {
  topic: NavTopic;
  concepts: readonly NavConcept[];
  searching?: boolean;
  indentClass?: string;
}) {
  return (
    <ConceptItems topic={topic} concepts={concepts} indentClass={indentClass} />
  );
}

export function TopicRow({
  trackId,
  topic,
  compact = false,
  hideTitle = false,
  navKind = "topic",
  navId,
}: {
  trackId: TrackId;
  topic: NavTopic;
  compact?: boolean;
  hideTitle?: boolean;
  navKind?: "cluster" | "topic";
  navId?: string;
}) {
  const { query, mode, pathname, searching, first, pinNav, onNavigate } =
    useSidebarChrome();
  const { highlightPathname } = useSidebarHighlight();
  const { fold, patchFold } = useScopedSidebarFold();
  const { topicHref: openTopicHref } = fold(trackId);
  const active = isActiveHref(highlightPathname, topic.href);
  const isHitTopic = first?.pathname === topic.href;
  const isFirstTopic = isHitTopic && first.hash === "";
  const concepts = visibleConcepts(topic, query, mode);
  const hasConcepts = concepts.length > 0;
  const sidebarConcepts = searching
    ? concepts
    : filterInterviewConcepts(topic, concepts);
  const showConceptNav =
    !topic.hideSidebarConcepts && sidebarConcepts.length > 0;
  const topicOpen = hideTitle
    ? showConceptNav
    : searching
      ? !topic.hideSidebarConcepts && hasConcepts
      : showConceptNav && openTopicHref === topic.href;
  const onPath = !searching && active;
  const { isBookmarked } = useSidebarBookmarks();
  const topicBookmarked = isBookmarked(topic.href);
  // Flatten sticky headers into the track list so nested containing blocks cannot
  // drag Core/Structure above Frontend/HTML while siblings scroll.
  const indent = compact ? (navKind === "cluster" ? "pl-4" : "pl-6") : "";
  const conceptIndent = compact ? "pl-8" : "pl-4";

  if (hideTitle) {
    if (!showConceptNav) {
      return null;
    }
    return (
      <TopicConceptNav
        topic={topic}
        concepts={sidebarConcepts}
        searching={searching}
        indentClass={conceptIndent}
      />
    );
  }

  return (
    <li className="contents">
      <Link
        href={topic.href}
        prefetch={false}
        scroll={false}
        data-nav={navKind}
        data-nav-id={navId ?? topic.slug}
        data-nav-path={onPath ? "true" : undefined}
        onClick={(event) => {
          pinNav(event.currentTarget);
          if (pathname === topic.href) {
            event.preventDefault();
            if (window.location.hash) {
              applySameDocumentHref(pathname, "", pathname);
            }
            if (!searching && showConceptNav) {
              patchFold(trackId, {
                topicHref: openTopicHref === topic.href ? null : topic.href,
              });
            }
            if (!showConceptNav) {
              closeNavSoon(onNavigate);
            }
            return;
          }
          queueHandbookHref(topic.href);
          patchFold(trackId, {
            topicHref: showConceptNav ? topic.href : null,
          });
          if (!showConceptNav) {
            closeNavSoon(onNavigate);
          }
        }}
        data-search-hit={isFirstTopic ? "true" : undefined}
        aria-current={active ? "page" : undefined}
        aria-expanded={showConceptNav ? topicOpen : undefined}
        className={`${rowClass(isHitTopic || active, onPath, indent)} ${NAV_ROW_GAP}`}
      >
        <span className="flex min-w-0 flex-1 items-center gap-1.5">
          <RowTitle
            text={topic.title}
            query={query}
            marker={compact && showConceptNav}
            open={topicOpen}
          />
        </span>
        {topicBookmarked ? <BookmarkStar /> : null}
        {showConceptNav ? (
          compact ? (
            topicOpen ? (
              <NavChevron open />
            ) : null
          ) : (
            <NavChevron open={topicOpen} large />
          )
        ) : null}
      </Link>
      <NavFold open={topicOpen && showConceptNav} instant={searching} unbox>
        <ul className="contents">
          <TopicConceptNav
            topic={topic}
            concepts={sidebarConcepts}
            searching={searching}
            indentClass={conceptIndent}
          />
        </ul>
      </NavFold>
    </li>
  );
}

export function ClusterRow({
  trackId,
  subjectHref: subjectPath,
  cluster,
}: {
  trackId: TrackId;
  subjectHref: string;
  cluster: NavCluster;
}) {
  const { query, pathname, searching, first, pinNav, goToPath, onNavigate } =
    useSidebarChrome();
  const { highlightPathname } = useSidebarHighlight();
  const { fold, patchFold } = useScopedSidebarFold();
  const sectionId = useSidebarFoldScope();
  const { clusterKey: openClusterKey } = fold(trackId);
  const { activeConceptId } = useSidebarActive();
  const onlyTopic = cluster.topics.length === 1 ? cluster.topics[0] : null;
  const navigateHref = clusterNavigateHref(cluster, sectionId, subjectPath);

  if (onlyTopic && sameTitle(cluster.title, onlyTopic.title)) {
    return (
      <TopicRow
        trackId={trackId}
        topic={{ ...onlyTopic, title: cluster.title }}
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
  const isHitCluster =
    first?.pathname === subjectPath && first.hash === `#${cluster.id}`;
  const onPath =
    !searching &&
    (active ||
      cluster.topics.some((topic) => topic.href === highlightPathname));

  return (
    <li className="contents">
      <Link
        href={navigateHref}
        prefetch={false}
        scroll={false}
        data-nav="cluster"
        data-nav-id={cluster.id}
        data-nav-pin={onPath ? "cluster" : undefined}
        onClick={(event) => {
          pinNav(event.currentTarget);
          if (onHub) {
            event.preventDefault();
            if (sectionId === "interviews" && cluster.topics[0]) {
              patchFold(trackId, { clusterKey: key });
              queueHandbookHref(cluster.topics[0].href);
              goToPath(cluster.topics[0].href);
              closeNavSoon(onNavigate);
              return;
            }
            if (onlyTopic) {
              patchFold(trackId, { clusterKey: key });
              queueHandbookHref(onlyTopic.href);
              goToPath(onlyTopic.href);
              closeNavSoon(onNavigate);
              return;
            }
            const next = `#${cluster.id}`;
            const sameHash = window.location.hash === next;
            if (!searching) {
              if (sameHash) {
                patchFold(trackId, {
                  clusterKey: openClusterKey === key ? null : key,
                });
              } else {
                patchFold(trackId, { clusterKey: key });
              }
            }
            if (!sameHash) {
              replacePathHash(pathname, next);
            }
            return;
          }
          patchFold(trackId, { clusterKey: key });
          queueHandbookHref(navigateHref);
        }}
        data-search-hit={isHitCluster ? "true" : undefined}
        aria-current={active ? "location" : undefined}
        aria-expanded={clusterOpen}
        className={`${rowClass(isHitCluster || active || onPath, onPath, "pl-4")} ${NAV_ROW_GAP}`}
      >
        <RowTitle
          text={cluster.title}
          query={query}
          marker
          open={clusterOpen}
        />
        {clusterOpen ? <NavChevron open /> : null}
      </Link>
      <NavFold open={clusterOpen} instant={searching} unbox>
        <ul className="contents">
          {cluster.topics.map((topic) => (
            <TopicRow
              key={topic.slug}
              trackId={trackId}
              topic={topic}
              compact
              navKind="topic"
              navId={topic.slug}
            />
          ))}
        </ul>
      </NavFold>
    </li>
  );
}

export function SectionRow({
  trackId,
  subjectHref: subjectPath,
  section,
}: {
  trackId: TrackId;
  subjectHref: string;
  section: NavSection;
}) {
  const { query, pathname, searching, first, pinNav } = useSidebarChrome();
  const { highlightPathname } = useSidebarHighlight();
  const { fold, patchFold } = useScopedSidebarFold();
  const { activeConceptId } = useSidebarActive();
  const collapsible = isNavSectionCollapsible(section);

  if (!collapsible) {
    return (
      <li className="contents">
        <div
          className={`px-2 pt-2 pb-0.5 text-[10px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400 ${NAV_ROW_GAP}`}
        >
          <HighlightedText text={section.title} query={query} />
        </div>
        <ul className="contents">
          <SectionClusterList
            flatNav={section.flatNav}
            trackId={trackId}
            subjectHref={subjectPath}
            clusters={section.clusters}
          />
        </ul>
      </li>
    );
  }

  const key = sectionKey(subjectPath, section.id);
  const { sectionKey: openSectionKey } = fold(trackId);
  const onHub = pathname === subjectPath;
  const hashMatchesSection = activeConceptId === section.id;
  const hasActiveChild = section.clusters.some(
    (cluster) =>
      activeConceptId === cluster.id ||
      cluster.topics.some((topic) => topic.href === highlightPathname),
  );
  const sectionOpen = isNavSectionOpen(
    section,
    subjectPath,
    openSectionKey,
    searching || hasActiveChild,
  );
  const isHitSection =
    first?.pathname === subjectPath && first.hash === `#${section.id}`;
  const onPath = !searching && (hashMatchesSection || hasActiveChild);

  return (
    <li className="contents">
      <Link
        href={`${subjectPath}#${section.id}`}
        prefetch={false}
        scroll={false}
        data-nav="section"
        data-nav-id={section.id}
        data-nav-pin={onPath ? "section" : undefined}
        onClick={(event) => {
          pinNav(event.currentTarget);
          if (onHub) {
            event.preventDefault();
            const next = `#${section.id}`;
            const sameHash = window.location.hash === next;
            if (!searching) {
              const closed = closedSectionKey(subjectPath, section.id);
              if (sameHash) {
                patchFold(trackId, {
                  sectionKey: sectionOpen ? closed : key,
                });
              } else {
                patchFold(trackId, { sectionKey: key });
              }
            }
            if (!sameHash) {
              replacePathHash(pathname, next);
            }
            return;
          }
          patchFold(trackId, { sectionKey: key });
          queueHandbookHref(`${subjectPath}#${section.id}`);
        }}
        data-search-hit={isHitSection ? "true" : undefined}
        aria-expanded={sectionOpen}
        className={`${rowClass(isHitSection || onPath, onPath, "pl-4")} ${NAV_ROW_GAP}`}
      >
        <RowTitle
          text={section.title}
          query={query}
          marker
          open={sectionOpen}
        />
        {sectionOpen ? <NavChevron open /> : null}
      </Link>
      <NavFold open={sectionOpen} instant={searching} unbox>
        <ul className="contents">
          <SectionClusterList
            flatNav={section.flatNav}
            trackId={trackId}
            subjectHref={subjectPath}
            clusters={section.clusters}
          />
        </ul>
      </NavFold>
    </li>
  );
}

export function SubjectRow({
  trackId,
  subject,
}: {
  trackId: TrackId;
  subject: NavSubject;
}) {
  const { query, pathname, searching, first, pinNav } = useSidebarChrome();
  const { highlightPathname } = useSidebarHighlight();
  const { fold, patchFold } = useScopedSidebarFold();
  const { subjectHref: openSubjectHref } = fold(trackId);
  const active = isActiveHref(highlightPathname, subject.href);
  const subjectOpen = searching || openSubjectHref === subject.href;
  const isHitSubject = first?.pathname === subject.href && first.hash === "";
  const onPath = !searching && isOnSubjectPath(highlightPathname, subject);
  const locale = localeFromPathname(pathname);
  const cautionTip = subjectCautionTooltip(locale, subject.slug);

  return (
    <li className="contents">
      <Link
        href={subject.href}
        prefetch={false}
        data-nav="subject"
        data-nav-id={subject.slug}
        data-nav-path={onPath ? "true" : undefined}
        onClick={(event) => {
          pinNav(event.currentTarget);
          if (pathname === subject.href) {
            event.preventDefault();
            if (!searching) {
              patchFold(trackId, {
                subjectHref:
                  openSubjectHref === subject.href ? null : subject.href,
              });
            }
            return;
          }
          queueHandbookHref(subject.href);
          patchFold(trackId, { subjectHref: subject.href });
        }}
        data-search-hit={isHitSubject ? "true" : undefined}
        aria-current={active ? "page" : undefined}
        aria-expanded={subjectOpen}
        className={`${rowClass(isHitSubject || onPath, onPath)} ${NAV_ROW_GAP}`}
      >
        <RowTitle text={subject.title} query={query} />
        {cautionTip ? (
          <NavCautionBadge
            label={subjectCautionLabel(locale)}
            tip={cautionTip}
          />
        ) : null}
        <NavChevron open={subjectOpen} large />
      </Link>
      <NavFold open={subjectOpen} instant={searching} unbox>
        <ul className="contents">
          <NavGuide level="subject" />
          {subject.sections?.length ? (
            <>
              {subject.clusters.map((cluster) => (
                <ClusterRow
                  key={cluster.id}
                  trackId={trackId}
                  subjectHref={subject.href}
                  cluster={cluster}
                />
              ))}
              {subject.sections.map((section) => (
                <SectionRow
                  key={section.id}
                  trackId={trackId}
                  subjectHref={subject.href}
                  section={section}
                />
              ))}
              {subject.clustersAfterSections?.map((cluster) => (
                <ClusterRow
                  key={cluster.id}
                  trackId={trackId}
                  subjectHref={subject.href}
                  cluster={cluster}
                />
              ))}
            </>
          ) : (
            subject.clusters.map((cluster) => (
              <ClusterRow
                key={cluster.id}
                trackId={trackId}
                subjectHref={subject.href}
                cluster={cluster}
              />
            ))
          )}
        </ul>
      </NavFold>
    </li>
  );
}
