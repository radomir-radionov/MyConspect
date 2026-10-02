"use client";

import { memo, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  HighlightedText,
  useSearchMode,
  useSearchQuery,
} from "@/components/search";
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
import { chromeFor } from "@/lib/i18n/chrome";
import { localeFromPathname } from "@/lib/i18n/paths";
import { conceptMatchesQuery } from "@/lib/nav";
import type { ChromeCopy } from "@/lib/nav";
import type { Concept, InterviewSection } from "@/lib/parse";
import { BookmarkButton } from "@/components/nav/BookmarkButton";
import { CopyConceptLinkButton } from "./CopyConceptLinkButton";
import { useCodeCopyButtons } from "./useCodeCopyButtons";
import { useConceptKeyboardNav } from "./useConceptKeyboardNav";

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

function conceptTargetById(id: string) {
  const scroller = handbookMain();
  const element = scroller?.querySelector(`[id="${CSS.escape(id)}"]`);
  return element instanceof HTMLElement ? element : null;
}

function closeOpenConceptAccordions() {
  const scroller = handbookMain();
  if (!scroller) {
    return;
  }
  for (const node of scroller.querySelectorAll(
    ".concept-list > details[open]",
  )) {
    if (node instanceof HTMLDetailsElement) {
      node.open = false;
    }
  }
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
  const pathname = usePathname() ?? "/en";
  const chrome = useMemo(
    () => chromeFor(localeFromPathname(pathname)),
    [pathname],
  );
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const activeId = hashIdFrom(hash);
  const conceptIds = useMemo(
    () => concepts.map((concept) => concept.id),
    [concepts],
  );
  useConceptKeyboardNav(conceptIds);
  const groups = useMemo(
    () => groupConcepts(concepts, groupInterviewSections),
    [concepts, groupInterviewSections],
  );

  useEffect(() => {
    let frame = 0;
    function focusFromHash(event?: Event) {
      const id = hashIdFrom(window.location.hash);
      if (!id) {
        if (event) {
          closeOpenConceptAccordions();
        }
        return;
      }
      const element = conceptTargetById(id);
      if (!element) {
        return;
      }
      const shouldScroll = shouldScrollFromHashEvent(event);
      const viewportTop = element.getBoundingClientRect().top;
      if (element instanceof HTMLDetailsElement) {
        if (!element.open) {
          element.open = true;
        }
        closeSiblingAccordions(element);
      }
      if (!shouldScroll) {
        restoreElementViewportTop(element, viewportTop);
        return;
      }
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        scrollConceptToTop(element);
      });
    }

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

    focusFromHash();
    window.addEventListener("hashchange", focusFromHash);
    return () => {
      window.removeEventListener("hashchange", focusFromHash);
      window.cancelAnimationFrame(frame);
    };
  }, [concepts, mode, query]);

  if (concepts.length === 0) {
    return <p className="text-zinc-600 dark:text-zinc-400">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.section ?? "default"}>
          {group.section ? (
            <h2 className="mb-3 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {SECTION_LABELS[group.section]}
            </h2>
          ) : null}
          <ConceptAccordionList
            concepts={group.concepts}
            activeId={activeId}
            query={query}
            notesQuery={mode === "notes" ? query : ""}
            flat={concepts.length === 1}
            chrome={chrome}
            pathname={pathname}
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
  flat,
  chrome,
  pathname,
}: {
  concepts: readonly Concept[];
  activeId: string;
  query: string;
  notesQuery: string;
  flat: boolean;
  chrome: ChromeCopy;
  pathname: string;
}) {
  if (flat) {
    const concept = concepts[0];
    if (!concept) {
      return null;
    }
    return (
      <article
        id={concept.id}
        className="concept-list group relative scroll-mt-20 rounded-xl border border-zinc-200 bg-white px-4 pt-3 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-flex items-center">
            <CopyConceptLinkButton conceptId={concept.id} chrome={chrome} />
            <BookmarkButton
              pathname={pathname}
              title={concept.title}
              conceptId={concept.id}
              chrome={chrome}
              revealOnHover
            />
          </span>
        </div>
        <ConceptBody
          html={concept.html}
          query={notesQuery}
          chrome={chrome}
          compactTop
        />
      </article>
    );
  }

  return (
    <div className="concept-list divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
      {concepts.map((concept) => {
        const isActive = concept.id === activeId;
        return (
          <details
            key={concept.id}
            id={concept.id}
            className={
              isActive
                ? "group scroll-mt-20 bg-yellow-50 px-4 dark:bg-yellow-950"
                : "group scroll-mt-20 px-4"
            }
            onToggle={(event) => {
              if (event.currentTarget.open) {
                keepOpenedConceptInPlace(event.currentTarget);
                setHashIfChanged(event.currentTarget.id, false);
              }
            }}
          >
            <summary className="flex cursor-pointer items-center gap-2 py-3 text-left text-base font-medium text-zinc-900 dark:text-zinc-50">
              <span className="min-w-0 flex-1">
                <HighlightedText text={concept.title} query={query} />
              </span>
              <span className="inline-flex shrink-0 items-center">
                <CopyConceptLinkButton conceptId={concept.id} chrome={chrome} />
                <BookmarkButton
                  pathname={pathname}
                  title={concept.title}
                  conceptId={concept.id}
                  chrome={chrome}
                  revealOnHover
                />
              </span>
            </summary>
            <ConceptBody
              html={concept.html}
              query={notesQuery}
              chrome={chrome}
            />
          </details>
        );
      })}
    </div>
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
        compactTop ? "concept-body pb-5 pr-14" : "concept-body pb-5 pt-1"
      }
      dangerouslySetInnerHTML={{ __html: highlightQueryInHtml(html, query) }}
    />
  );
});
