"use client";

import { memo, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { replacePathHash, setHashOnPath } from "./hash";
import { clusterKey, isActiveHref } from "./location";
import { closeNavSoon, rowClass, useSidebarNav } from "./sidebarContext";

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

function sameTitle(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function visibleConcepts(topic: NavTopic, query: string, mode: SearchMode) {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) {
    return topic.concepts;
  }
  return topic.concepts.filter((concept) => conceptMatchesQuery(concept, needle, mode));
}

export const ConceptLink = memo(function ConceptLink({
  topicHref,
  concept,
  isFirstConcept,
  conceptActive,
}: {
  topicHref: string;
  concept: NavConcept;
  isFirstConcept: boolean;
  conceptActive: boolean;
}) {
  const { query, mode, pathname, onNavigate } = useSidebarNav();
  const router = useRouter();
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
          setHashOnPath(pathname, concept.id);
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
});

function ConceptItems({
  topic,
  concepts,
}: {
  topic: NavTopic;
  concepts: readonly NavConcept[];
}) {
  const { first, activeConceptId } = useSidebarNav();
  return (
    <>
      {concepts.map((concept) => {
        const conceptActive = concept.id === activeConceptId;
        const isFirstConcept = first?.pathname === topic.href && first.hash === `#${concept.id}`;
        return (
          <li key={concept.id}>
            <ConceptLink
              topicHref={topic.href}
              concept={concept}
              isFirstConcept={isFirstConcept}
              conceptActive={conceptActive}
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
  const questions = concepts.filter((concept) => concept.interviewSection === "questions");
  const tasks = concepts.filter((concept) => concept.interviewSection === "tasks");
  const groups: Array<{ section: InterviewSection; concepts: NavConcept[] }> = [];
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
  const { activeConceptId, searching, query } = useSidebarNav();
  const groups = useMemo(() => interviewSectionGroups(concepts), [concepts]);
  const activeSection = concepts.find((concept) => concept.id === activeConceptId)?.interviewSection;
  const [openSections, setOpenSections] = useState<ReadonlySet<InterviewSection>>(
    () => new Set(activeSection ? [activeSection] : ["questions"]),
  );

  useEffect(() => {
    if (searching) {
      setOpenSections(new Set(groups.map((group) => group.section)));
      return;
    }
    if (activeSection) {
      setOpenSections((current) => {
        if (current.has(activeSection)) {
          return current;
        }
        return new Set([...current, activeSection]);
      });
    }
  }, [activeSection, groups, searching]);

  return (
    <>
      {groups.map((group) => {
        const sectionOpen = searching || openSections.has(group.section);
        const sectionActive = activeSection === group.section;
        return (
          <li key={group.section}>
            <button
              type="button"
              data-nav="interview-section"
              data-nav-id={group.section}
              aria-expanded={sectionOpen}
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
                  ? "flex w-full cursor-pointer items-center rounded-md bg-yellow-50/70 px-2 py-1.5 text-left text-sm font-medium text-zinc-900 ring-1 ring-inset ring-yellow-200"
                  : "flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-left text-sm text-zinc-700 hover:bg-yellow-50 hover:text-zinc-800"
              }
            >
              <RowTitle
                text={INTERVIEW_SECTION_LABELS[group.section]}
                query={query}
                marker
                open={sectionOpen}
              />
            </button>
            <NavFold open={sectionOpen} instant={searching}>
              <ul className="mt-0.5 space-y-0.5 pl-2">
                <ConceptItems topic={topic} concepts={group.concepts} />
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
}: {
  topic: NavTopic;
  concepts: readonly NavConcept[];
}) {
  if (!isInterviewTopic(topic)) {
    return <ConceptItems topic={topic} concepts={concepts} />;
  }
  const regular = concepts.filter((concept) => !concept.interviewSection);
  const grouped = concepts.filter((concept) => concept.interviewSection);
  if (grouped.length === 0) {
    return <ConceptItems topic={topic} concepts={concepts} />;
  }
  return (
    <>
      {regular.length > 0 ? <ConceptItems topic={topic} concepts={regular} /> : null}
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
  const {
    query,
    mode,
    pathname,
    searching,
    first,
    openTopicHref,
    setOpenTopicHref,
    pinNav,
    onNavigate,
  } = useSidebarNav();
  const active = isActiveHref(pathname, topic.href);
  const isHitTopic = first?.pathname === topic.href;
  const isFirstTopic = isHitTopic && first.hash === "";
  const concepts = visibleConcepts(topic, query, mode);
  const topicOpen = hideTitle
    ? true
    : searching
      ? concepts.length > 0
      : openTopicHref === topic.href;

  if (hideTitle) {
    if (concepts.length === 0) {
      return null;
    }
    return <TopicConceptNav topic={topic} concepts={concepts} />;
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
        {compact ? null : <NavChevron open={topicOpen} large />}
      </Link>
      <NavFold open={topicOpen && concepts.length > 0} instant={searching}>
        <ul className={compact ? "mt-0.5 mb-1 space-y-0.5 pl-2" : "mt-0.5 mb-1 space-y-0.5 pl-3"}>
          <TopicConceptNav topic={topic} concepts={concepts} />
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
  const {
    query,
    pathname,
    searching,
    first,
    activeConceptId,
    openClusterKey,
    setOpenClusterKey,
    pinNav,
    onNavigate,
  } = useSidebarNav();
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
              replacePathHash(pathname, next);
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
      <NavFold open={clusterOpen} instant={searching}>
        <ul className="mt-0.5 space-y-0.5 pl-2">
          {cluster.topics.map((topic) => (
            <TopicRow key={topic.slug} topic={topic} compact navKind="topic" navId={topic.slug} />
          ))}
        </ul>
      </NavFold>
    </li>
  );
}

export function SubjectRow({ subject }: { subject: NavSubject }) {
  const { query, pathname, searching, first, openSubjectHref, setOpenSubjectHref, onNavigate } =
    useSidebarNav();
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
        <NavChevron open={subjectOpen} large />
      </Link>
      <NavFold open={subjectOpen} instant={searching}>
        <ul className="mt-0.5 mb-1 ml-2 space-y-0.5 border-l border-yellow-200 pl-2">
          {subject.clusters.map((cluster) => (
            <ClusterRow key={cluster.id} subjectHref={subject.href} cluster={cluster} />
          ))}
        </ul>
      </NavFold>
    </li>
  );
}
