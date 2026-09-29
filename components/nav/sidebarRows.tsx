"use client";

import { memo, useMemo, useState } from "react";
import Link from "next/link";
import { HighlightedText } from "@/components/search";
import { isInterviewTopic } from "@/lib/catalog";
import {
  CHROME,
  conceptBodySnippet,
  conceptHref,
  conceptMatchesQuery,
  type InterviewSection,
  type NavCluster,
  type NavConcept,
  type NavSubject,
  type NavTopic,
  type SearchMode,
} from "@/lib/nav";
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
import { clusterKey, isActiveHref } from "./location";
import { NavCautionBadge } from "./NavCautionBadge";
import {
  closeNavSoon,
  NAV_ROW_GAP,
  rowClass,
  useSidebarActive,
  useSidebarChrome,
  useSidebarFold,
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

function sameTitle(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
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
  const snippet = conceptBodySnippet(concept, query, mode);
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
          setHashOnPath(pathname, concept.id);
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
      className={
        conceptActive
          ? `block w-full cursor-pointer rounded-md bg-yellow-50 px-2 py-1.5 text-sm font-medium text-zinc-900 ring-1 ring-yellow-200 dark:bg-yellow-950 dark:text-zinc-50 dark:ring-yellow-800 ${indentClass}${rowGapClass ? ` ${rowGapClass}` : ""}${onPath ? " sticky" : ""}`
          : `block w-full cursor-pointer rounded-md px-2 py-1.5 text-sm text-zinc-700 hover:bg-yellow-50 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-yellow-950/60 dark:hover:text-zinc-50 ${indentClass}${rowGapClass ? ` ${rowGapClass}` : ""}`
      }
    >
      <span className="flex items-baseline justify-between gap-2">
        <HighlightedText text={concept.title} query={query} />
        {snippet ? (
          <span className="shrink-0 text-[10px] font-medium tracking-wide text-zinc-400 uppercase dark:text-zinc-500">
            {CHROME.inNotes}
          </span>
        ) : null}
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
  const { activeConceptId } = useSidebarActive();
  return (
    <>
      {concepts.map((concept, index) => {
        const conceptActive = concept.id === activeConceptId;
        const isFirstConcept =
          first?.pathname === topic.href && first.hash === `#${concept.id}`;
        const onPath = conceptActive && !searching;
        return (
          <li key={concept.id} className="contents">
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

const INTERVIEW_SECTION_LABELS: Record<InterviewSection, string> = {
  questions: "Questions",
  tasks: "Tasks",
};

function interviewSectionGroups(concepts: readonly NavConcept[]) {
  const questions = concepts.filter(
    (concept) => concept.interviewSection === "questions",
  );
  const tasks = concepts.filter(
    (concept) => concept.interviewSection === "tasks",
  );
  const groups: Array<{ section: InterviewSection; concepts: NavConcept[] }> =
    [];
  if (questions.length > 0) {
    groups.push({ section: "questions", concepts: [...questions] });
  }
  if (tasks.length > 0) {
    groups.push({ section: "tasks", concepts: [...tasks] });
  }
  return groups;
}

function InterviewSectionNav({
  topic,
  concepts,
}: {
  topic: NavTopic;
  concepts: readonly NavConcept[];
}) {
  const { pathname, searching, query } = useSidebarChrome();
  const { activeConceptId } = useSidebarActive();
  const groups = useMemo(() => interviewSectionGroups(concepts), [concepts]);
  const activeSection = concepts.find(
    (concept) => concept.id === activeConceptId,
  )?.interviewSection;
  const onTopic = !searching && isActiveHref(pathname, topic.href);
  const [openSections, setOpenSections] = useState<
    ReadonlySet<InterviewSection>
  >(() => new Set(["questions"]));
  const [trackedActiveSection, setTrackedActiveSection] = useState<
    InterviewSection | undefined
  >();

  if (activeSection && activeSection !== trackedActiveSection) {
    setTrackedActiveSection(activeSection);
    if (!openSections.has(activeSection)) {
      setOpenSections((current) => {
        const next = new Set(current);
        next.add(activeSection);
        return next;
      });
    }
  }

  return (
    <>
      {groups.map((group) => {
        const sectionOpen = searching || openSections.has(group.section);
        const sectionActive = activeSection === group.section;
        const onPath = onTopic && sectionOpen;
        return (
          <li key={group.section} className="contents">
            <button
              type="button"
              data-nav="interview-section"
              data-nav-id={group.section}
              aria-expanded={sectionOpen}
              data-nav-path={onPath ? "true" : undefined}
              onClick={() => {
                if (searching) {
                  return;
                }
                setOpenSections((current) => {
                  const next = new Set(current);
                  if (next.has(group.section)) {
                    next.delete(group.section);
                  } else {
                    next.add(group.section);
                  }
                  return next;
                });
              }}
              className={
                sectionActive || sectionOpen
                  ? `flex w-full ${NAV_ROW_GAP} cursor-pointer items-center rounded-md bg-yellow-50 px-2 py-1.5 pl-4 text-left text-sm font-medium text-zinc-900 ring-1 ring-yellow-200 dark:bg-yellow-950 dark:text-zinc-50 dark:ring-yellow-800${onPath ? " sticky" : ""}`
                  : `flex w-full ${NAV_ROW_GAP} cursor-pointer items-center rounded-md px-2 py-1.5 pl-4 text-left text-sm text-zinc-700 hover:bg-yellow-50 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-yellow-950/60 dark:hover:text-zinc-50`
              }
            >
              <RowTitle
                text={INTERVIEW_SECTION_LABELS[group.section]}
                query={query}
                marker
                open={sectionOpen}
              />
            </button>
            <NavFold
              open={sectionOpen}
              instant={searching || !sectionOpen}
              unbox
            >
              <ul className="contents">
                <ConceptItems
                  topic={topic}
                  concepts={group.concepts}
                  indentClass="pl-8"
                />
              </ul>
            </NavFold>
          </li>
        );
      })}
    </>
  );
}

function TopicConceptNav({
  topic,
  concepts,
  indentClass = "pl-4",
}: {
  topic: NavTopic;
  concepts: readonly NavConcept[];
  indentClass?: string;
}) {
  if (!isInterviewTopic(topic)) {
    return (
      <ConceptItems
        topic={topic}
        concepts={concepts}
        indentClass={indentClass}
      />
    );
  }
  const regular = concepts.filter((concept) => !concept.interviewSection);
  const grouped = concepts.filter((concept) => concept.interviewSection);
  if (grouped.length === 0) {
    return (
      <ConceptItems
        topic={topic}
        concepts={concepts}
        indentClass={indentClass}
      />
    );
  }
  return (
    <>
      {regular.length > 0 ? (
        <ConceptItems
          topic={topic}
          concepts={regular}
          indentClass={indentClass}
        />
      ) : null}
      <InterviewSectionNav topic={topic} concepts={grouped} />
    </>
  );
}

export function TopicRow({
  topic,
  compact = false,
  hideTitle = false,
  navKind = "topic",
  navId,
}: {
  topic: NavTopic;
  compact?: boolean;
  hideTitle?: boolean;
  navKind?: "cluster" | "topic";
  navId?: string;
}) {
  const { query, mode, pathname, searching, first, pinNav, onNavigate } =
    useSidebarChrome();
  const { openTopicHref, setOpenTopicHref } = useSidebarFold();
  const active = isActiveHref(pathname, topic.href);
  const isHitTopic = first?.pathname === topic.href;
  const isFirstTopic = isHitTopic && first.hash === "";
  const concepts = visibleConcepts(topic, query, mode);
  const hasConcepts = concepts.length > 0;
  const topicOpen = hideTitle
    ? true
    : searching
      ? hasConcepts
      : hasConcepts && openTopicHref === topic.href;
  const onPath = !searching && active;
  // Flatten sticky headers into the track list so nested containing blocks cannot
  // drag Core/Structure above Frontend/HTML while siblings scroll.
  const indent = compact ? (navKind === "cluster" ? "pl-4" : "pl-6") : "";
  const conceptIndent = compact ? "pl-8" : "pl-4";

  if (hideTitle) {
    if (concepts.length === 0) {
      return null;
    }
    return (
      <TopicConceptNav
        topic={topic}
        concepts={concepts}
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
              if (!searching && hasConcepts) {
                setOpenTopicHref(topic.href);
              }
              return;
            }
            if (!searching && hasConcepts) {
              setOpenTopicHref((current) =>
                current === topic.href ? null : topic.href,
              );
            }
            if (!hasConcepts) {
              closeNavSoon(onNavigate);
            }
            return;
          }
          setOpenTopicHref(hasConcepts ? topic.href : null);
          if (!hasConcepts) {
            closeNavSoon(onNavigate);
          }
        }}
        data-search-hit={isFirstTopic ? "true" : undefined}
        aria-current={active ? "page" : undefined}
        aria-expanded={hasConcepts ? topicOpen : undefined}
        className={`${rowClass(isHitTopic || active || topicOpen, onPath, indent)} ${NAV_ROW_GAP}`}
      >
        <RowTitle
          text={topic.title}
          query={query}
          marker={compact && hasConcepts}
          open={topicOpen}
        />
        {hasConcepts ? (
          compact ? (
            topicOpen ? (
              <NavChevron open />
            ) : null
          ) : (
            <NavChevron open={topicOpen} large />
          )
        ) : null}
      </Link>
      <NavFold
        open={topicOpen && hasConcepts}
        instant={searching || !topicOpen}
        unbox
      >
        <ul className="contents">
          <TopicConceptNav
            topic={topic}
            concepts={concepts}
            indentClass={conceptIndent}
          />
        </ul>
      </NavFold>
    </li>
  );
}

export function ClusterRow({
  subjectHref: subjectPath,
  cluster,
}: {
  subjectHref: string;
  cluster: NavCluster;
}) {
  const { query, pathname, searching, first, pinNav } = useSidebarChrome();
  const { openClusterKey, setOpenClusterKey } = useSidebarFold();
  const { activeConceptId } = useSidebarActive();
  const onlyTopic = cluster.topics.length === 1 ? cluster.topics[0] : null;

  if (onlyTopic && sameTitle(cluster.title, onlyTopic.title)) {
    return (
      <TopicRow
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
    (active || cluster.topics.some((topic) => topic.href === pathname));
  const pinInParent = onPath && !clusterOpen;
  const stickHeader = onPath && !pinInParent;

  return (
    <li className="contents">
      <Link
        href={cluster.href}
        prefetch={false}
        scroll={false}
        data-nav="cluster"
        data-nav-id={cluster.id}
        data-nav-path={stickHeader ? "true" : undefined}
        data-nav-pin={pinInParent ? "cluster" : undefined}
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
              replacePathHash(pathname, next);
            }
            return;
          }
          setOpenClusterKey(key);
          queueHandbookHref(cluster.href);
        }}
        data-search-hit={isHitCluster ? "true" : undefined}
        aria-current={active ? "location" : undefined}
        aria-expanded={clusterOpen}
        className={`${rowClass(isHitCluster || active || clusterOpen, stickHeader, "pl-4")}${
          pinInParent ? " sticky bg-white dark:bg-[var(--chrome-surface)]" : ""
        } ${NAV_ROW_GAP}`}
      >
        <RowTitle
          text={cluster.title}
          query={query}
          marker
          open={clusterOpen}
        />
        {clusterOpen ? <NavChevron open /> : null}
      </Link>
      <NavFold open={clusterOpen} instant={searching || !clusterOpen} unbox>
        <ul className="contents">
          {cluster.topics.map((topic) => (
            <TopicRow
              key={topic.slug}
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

export function SubjectRow({ subject }: { subject: NavSubject }) {
  const { query, pathname, searching, first } = useSidebarChrome();
  const { openSubjectHref, setOpenSubjectHref } = useSidebarFold();
  const active = isActiveHref(pathname, subject.href);
  const subjectOpen = searching || openSubjectHref === subject.href;
  const isHitSubject = first?.pathname === subject.href && first.hash === "";
  const onPath = !searching && openSubjectHref === subject.href;
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
          if (pathname === subject.href) {
            event.preventDefault();
            if (!searching) {
              setOpenSubjectHref((current) =>
                current === subject.href ? null : subject.href,
              );
            }
            return;
          }
          setOpenSubjectHref(subject.href);
        }}
        data-search-hit={isHitSubject ? "true" : undefined}
        aria-current={active ? "page" : undefined}
        aria-expanded={subjectOpen}
        className={`${rowClass(isHitSubject || active || subjectOpen, onPath)} ${NAV_ROW_GAP}`}
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
      <NavFold open={subjectOpen} instant={searching || !subjectOpen} unbox>
        <ul className="contents">
          <NavGuide level="subject" />
          {subject.sections?.length
            ? subject.sections.map((section) => (
                <li key={section.id} className="contents">
                  <div
                    className={`px-2 pt-2 pb-0.5 text-[10px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400 ${NAV_ROW_GAP}`}
                  >
                    <HighlightedText text={section.title} query={query} />
                  </div>
                  <ul className="contents">
                    {section.clusters.map((cluster) => (
                      <ClusterRow
                        key={cluster.id}
                        subjectHref={subject.href}
                        cluster={cluster}
                      />
                    ))}
                  </ul>
                </li>
              ))
            : subject.clusters.map((cluster) => (
                <ClusterRow
                  key={cluster.id}
                  subjectHref={subject.href}
                  cluster={cluster}
                />
              ))}
        </ul>
      </NavFold>
    </li>
  );
}
