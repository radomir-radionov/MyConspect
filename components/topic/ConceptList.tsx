"use client";

import { memo, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { useHandbookLocation } from "@/components/nav/hooks/useHandbookLocation";
import {
  HighlightedText,
  useSearchMode,
  useSearchQuery,
} from "@/components/search";
import {
  BookmarkButton,
  useIsBookmarked,
} from "@/components/nav/ui/BookmarkButton";
import { highlightQueryInHtml } from "@/components/search/utils/highlightQueryInHtml";
import { setHashIfChanged } from "@/components/nav/utils/hash";
import { hashIdFrom } from "@/lib/nav/navUtils";
import { CopyConceptLinkButton } from "./CopyConceptLinkButton";
import { handbookMain } from "@/components/topic/utils/conceptScroll";
import { chromeFor } from "@/lib/i18n/chrome";
import { localeFromPathname } from "@/lib/i18n/paths";
import { conceptMatchesQuery } from "@/lib/nav";
import type { ChromeCopy } from "@/lib/nav";
import type { Concept } from "@/lib/parse";
import { ConceptTitleHeader } from "./ConceptTitleHeader";
import { PageTitleHeader } from "./PageTitleHeader";
import { useCodeCopyButtons } from "./hooks/useCodeCopyButtons";
import { useConceptKeyboardNav } from "./hooks/useConceptKeyboardNav";
import { useHandbookTopicNav } from "./hooks/useHandbookTopicNav";

type ConceptGroup = {
  readonly key: string;
  readonly label: string | null;
  readonly concepts: Concept[];
};

function groupLabel(concept: Concept, chrome: ChromeCopy): string | null {
  if (concept.group) {
    return concept.group;
  }
  if (concept.interviewSection === "tasks") {
    return chrome.interviewTasks;
  }
  if (concept.interviewSection === "questions") {
    return chrome.interviewQuestions;
  }
  return null;
}

function groupConcepts(
  concepts: readonly Concept[],
  groupInterviewSections: boolean,
  chrome: ChromeCopy,
): ConceptGroup[] {
  if (!groupInterviewSections) {
    return [{ key: "default", label: null, concepts: [...concepts] }];
  }

  const groups: ConceptGroup[] = [];
  let current: ConceptGroup | null = null;
  let currentSectionKey: string | null = null;

  for (const concept of concepts) {
    const label = groupLabel(concept, chrome);
    const sectionKey = concept.group
      ? `topic:${concept.group}`
      : `section:${concept.interviewSection ?? "default"}`;
    if (!current || currentSectionKey !== sectionKey) {
      currentSectionKey = sectionKey;
      current = {
        key: `${sectionKey}:${groups.length}`,
        label,
        concepts: [],
      };
      groups.push(current);
    }
    current.concepts.push(concept);
  }

  return groups;
}

function scrollMainToTop() {
  const main = handbookMain();
  if (main) {
    main.scrollTop = 0;
  }
}

export function ConceptList({
  concepts,
  emptyMessage,
  groupInterviewSections = false,
  topicTitle,
}: {
  concepts: readonly Concept[];
  emptyMessage: string;
  groupInterviewSections?: boolean;
  topicTitle?: string;
}) {
  const query = useSearchQuery();
  const mode = useSearchMode();
  const pathname = usePathname() ?? "/en";
  const chrome = useMemo(
    () => chromeFor(localeFromPathname(pathname)),
    [pathname],
  );
  const { activeConceptId: activeId } = useHandbookLocation();
  const flat = concepts.length === 1;
  const activeConcept = useMemo(
    () => concepts.find((concept) => concept.id === activeId) ?? null,
    [activeId, concepts],
  );
  const conceptIds = useMemo(
    () => concepts.map((concept) => concept.id),
    [concepts],
  );
  useConceptKeyboardNav(conceptIds);
  const groups = useMemo(
    () => groupConcepts(concepts, groupInterviewSections, chrome),
    [chrome, concepts, groupInterviewSections],
  );
  const notesQuery = mode === "notes" ? query : "";

  useEffect(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length > 0) {
      const hashId = hashIdFrom(window.location.hash);
      const hashConcept = concepts.find((concept) => concept.id === hashId);
      if (!hashConcept || !conceptMatchesQuery(hashConcept, needle, mode)) {
        const match = concepts.find((concept) =>
          conceptMatchesQuery(concept, needle, mode),
        );
        if (match) {
          setHashIfChanged(match.id);
        }
      }
    }
  }, [concepts, mode, query]);

  useEffect(() => {
    scrollMainToTop();
  }, [pathname, activeId]);

  if (concepts.length === 0) {
    return <p className="text-zinc-600 dark:text-zinc-400">{emptyMessage}</p>;
  }

  if (flat) {
    const concept = concepts[0];
    if (!concept) {
      return null;
    }
    return (
      <ConceptDetail
        concept={concept}
        notesQuery={notesQuery}
        chrome={chrome}
        asPageTitle
      />
    );
  }

  if (activeConcept) {
    return (
      <ConceptDetail
        concept={activeConcept}
        notesQuery={notesQuery}
        chrome={chrome}
      />
    );
  }

  const firstUngroupedIndex = groups.findIndex((group) => group.label === null);

  return (
    <div className="space-y-8">
      {groups.map((group, index) => (
        <section key={group.key}>
          {group.label ? (
            <h2 className="mb-3 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {group.label}
            </h2>
          ) : null}
          <ConceptIndexList
            concepts={group.concepts}
            query={query}
            chrome={chrome}
            pathname={pathname}
            topicTitle={
              group.label === null && index === firstUngroupedIndex
                ? topicTitle
                : undefined
            }
          />
        </section>
      ))}
    </div>
  );
}

const CONCEPT_LIST_CARD =
  "concept-list overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900";

const CONCEPT_DETAIL_CARD =
  "concept-list group relative rounded-xl border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950";

function ConceptIndexList({
  concepts,
  query,
  chrome,
  pathname,
  topicTitle,
}: {
  concepts: readonly Concept[];
  query: string;
  chrome: ChromeCopy;
  pathname: string;
  topicTitle?: string;
}) {
  return (
    <nav aria-label={chrome.topicsNav} className={CONCEPT_LIST_CARD}>
      {topicTitle ? <PageTitleHeader title={topicTitle} /> : null}
      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {concepts.map((concept) => (
          <ConceptIndexRow
            key={concept.id}
            concept={concept}
            query={query}
            chrome={chrome}
            pathname={pathname}
          />
        ))}
      </ul>
    </nav>
  );
}

function ConceptIndexRow({
  concept,
  query,
  chrome,
  pathname,
}: {
  concept: Concept;
  query: string;
  chrome: ChromeCopy;
  pathname: string;
}) {
  const saved = useIsBookmarked(pathname, concept.id);

  return (
    <li className="group relative transition-colors hover:bg-yellow-50 dark:hover:bg-yellow-950/60">
      <button
        type="button"
        onClick={() => setHashIfChanged(concept.id, false)}
        className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-base font-medium text-zinc-900 dark:text-zinc-50"
      >
        <HighlightedText text={concept.title} query={query} />
      </button>
      <div
        className={
          saved
            ? "absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-0.5"
            : "pointer-events-none absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-0.5 group-hover:pointer-events-auto group-focus-within:pointer-events-auto"
        }
      >
        <CopyConceptLinkButton conceptId={concept.id} chrome={chrome} />
        <BookmarkButton
          pathname={pathname}
          title={concept.title}
          conceptId={concept.id}
          chrome={chrome}
          revealOnHover
        />
      </div>
    </li>
  );
}

function ConceptDetail({
  concept,
  notesQuery,
  chrome,
  asPageTitle = false,
}: {
  concept: Concept;
  notesQuery: string;
  chrome: ChromeCopy;
  asPageTitle?: boolean;
}) {
  const { showBack, showNext, goBack, goNext } = useHandbookTopicNav({
    conceptOpen: true,
  });

  return (
    <article id={concept.id} className={CONCEPT_DETAIL_CARD}>
      <ConceptTitleHeader
        title={concept.title}
        chrome={chrome}
        variant={asPageTitle ? "index" : "detail"}
        showBack={showBack}
        onBack={goBack}
        showNext={showNext}
        onNext={goNext}
        showBookmark
        showShare
        conceptId={concept.id}
      />
      <ConceptBody
        html={concept.html}
        query={notesQuery}
        chrome={chrome}
        compactTop
      />
    </article>
  );
}

const ConceptBody = memo(function ConceptBody({
  html,
  query,
  chrome,
  compactTop = false,
}: {
  html: string;
  query: string;
  chrome: ChromeCopy;
  compactTop?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useCodeCopyButtons(ref, chrome, html);

  return (
    <div
      ref={ref}
      className={
        compactTop ? "concept-body px-4 pb-5" : "concept-body px-4 pb-5 pt-1"
      }
      dangerouslySetInnerHTML={{ __html: highlightQueryInHtml(html, query) }}
    />
  );
});
