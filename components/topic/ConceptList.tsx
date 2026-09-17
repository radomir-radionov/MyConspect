"use client";

import { memo, useEffect, useMemo, useSyncExternalStore } from "react";
import { HighlightedText, useSearchMode, useSearchQuery } from "@/components/search";
import { highlightQueryInHtml } from "@/components/search/highlightQueryInHtml";
import { HANDBOOK_MAIN_ID } from "@/constants";
import {
  getHash,
  getServerHash,
  hashIdFrom,
  setHashIfChanged,
  shouldScrollFromHashEvent,
  subscribeHash,
} from "@/components/nav/hash";
import { conceptMatchesQuery } from "@/lib/nav";
import type { Concept, InterviewSection } from "@/lib/parse";

function closeSiblingAccordions(opened: HTMLDetailsElement) {
  const parent = opened.parentElement;
  if (!parent) {
    return;
  }
  for (const node of parent.children) {
    if (node instanceof HTMLDetailsElement && node !== opened) {
      node.open = false;
    }
  }
}

function handbookMain() {
  const scroller = document.getElementById(HANDBOOK_MAIN_ID);
  return scroller instanceof HTMLElement ? scroller : null;
}

function conceptDetailsById(id: string) {
  const scroller = handbookMain();
  const element = scroller?.querySelector(`details[id="${CSS.escape(id)}"]`);
  return element instanceof HTMLDetailsElement ? element : null;
}

function restoreElementViewportTop(element: HTMLElement, viewportTop: number) {
  const scroller = handbookMain();
  if (!scroller) {
    return;
  }
  const delta = element.getBoundingClientRect().top - viewportTop;
  if (delta !== 0) {
    scroller.scrollTop += delta;
  }
}

function keepOpenedConceptInPlace(opened: HTMLDetailsElement) {
  const viewportTop = opened.getBoundingClientRect().top;
  closeSiblingAccordions(opened);
  restoreElementViewportTop(opened, viewportTop);
}

function scrollConceptToTop(element: HTMLElement) {
  const scroller = handbookMain();
  if (!scroller) {
    return;
  }
  const offset =
    element.getBoundingClientRect().top -
    scroller.getBoundingClientRect().top +
    scroller.scrollTop;
  scroller.scrollTo({ top: Math.max(0, offset) });
}

const SECTION_LABELS: Record<InterviewSection, string> = {
  questions: "Questions",
  tasks: "Tasks",
};

type ConceptGroup = {
  readonly section: InterviewSection | null;
  readonly concepts: Concept[];
};

function groupConcepts(
  concepts: readonly Concept[],
  groupInterviewSections: boolean,
): ConceptGroup[] {
  if (!groupInterviewSections) {
    return [{ section: null, concepts: [...concepts] }];
  }

  const groups: ConceptGroup[] = [];
  let current: ConceptGroup | null = null;

  for (const concept of concepts) {
    const section = concept.interviewSection ?? null;
    if (!current || current.section !== section) {
      current = { section, concepts: [] };
      groups.push(current);
    }
    current.concepts.push(concept);
  }

  return groups;
}

export function ConceptList({
  concepts,
  emptyMessage,
  groupInterviewSections = false,
}: {
  concepts: readonly Concept[];
  emptyMessage: string;
  groupInterviewSections?: boolean;
}) {
  const query = useSearchQuery();
  const mode = useSearchMode();
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const activeId = hashIdFrom(hash);
  const groups = useMemo(
    () => groupConcepts(concepts, groupInterviewSections),
    [concepts, groupInterviewSections],
  );

  useEffect(() => {
    function focusFromHash(event?: Event) {
      const id = hashIdFrom(window.location.hash);
      if (!id) {
        return;
      }
      const element = conceptDetailsById(id);
      if (!element) {
        return;
      }
      const shouldScroll = shouldScrollFromHashEvent(event);
      const viewportTop = element.getBoundingClientRect().top;
      const wasOpen = element.open;
      if (!wasOpen) {
        element.open = true;
      }
      closeSiblingAccordions(element);
      if (!shouldScroll) {
        restoreElementViewportTop(element, viewportTop);
        return;
      }
      window.requestAnimationFrame(() => {
        scrollConceptToTop(element);
      });
    }

    const needle = query.trim().toLowerCase();
    if (needle.length > 0) {
      const hashId = hashIdFrom(window.location.hash);
      const hashConcept = concepts.find((concept) => concept.id === hashId);
      if (!hashConcept || !conceptMatchesQuery(hashConcept, needle, mode)) {
        const match = concepts.find((concept) => conceptMatchesQuery(concept, needle, mode));
        if (match) {
          setHashIfChanged(match.id);
        }
      }
    }

    focusFromHash();
    window.addEventListener("hashchange", focusFromHash);
    return () => window.removeEventListener("hashchange", focusFromHash);
  }, [concepts, mode, query]);

  if (concepts.length === 0) {
    return <p className="text-zinc-600">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.section ?? "default"}>
          {group.section ? (
            <h2 className="mb-3 text-xl font-semibold tracking-tight text-zinc-900">
              {SECTION_LABELS[group.section]}
            </h2>
          ) : null}
          <ConceptAccordionList
            concepts={group.concepts}
            activeId={activeId}
            query={query}
            notesQuery={mode === "notes" ? query : ""}
          />
        </section>
      ))}
    </div>
  );
}

function ConceptAccordionList({
  concepts,
  activeId,
  query,
  notesQuery,
}: {
  concepts: readonly Concept[];
  activeId: string;
  query: string;
  notesQuery: string;
}) {
  return (
    <div className="concept-list divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
      {concepts.map((concept) => {
        const isActive = concept.id === activeId;
        return (
          <details
            key={concept.id}
            id={concept.id}
            className={
              isActive
                ? "group scroll-mt-20 bg-yellow-50 px-4"
                : "group scroll-mt-20 px-4"
            }
            onToggle={(event) => {
              if (event.currentTarget.open) {
                keepOpenedConceptInPlace(event.currentTarget);
                setHashIfChanged(event.currentTarget.id, false);
              }
            }}
          >
            <summary className="cursor-pointer py-3 text-left text-base font-medium text-zinc-900">
              <HighlightedText text={concept.title} query={query} />
            </summary>
            <ConceptBody html={concept.html} query={notesQuery} />
          </details>
        );
      })}
    </div>
  );
}

const ConceptBody = memo(function ConceptBody({
  html,
  query,
}: {
  html: string;
  query: string;
}) {
  return (
    <div
      className="concept-body pb-5 pt-1"
      dangerouslySetInnerHTML={{ __html: highlightQueryInHtml(html, query) }}
    />
  );
});
