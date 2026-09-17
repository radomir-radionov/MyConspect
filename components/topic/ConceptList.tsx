"use client";

import { memo, useEffect, useSyncExternalStore } from "react";
import { HighlightedText, useSearchMode, useSearchQuery } from "@/components/search";
import { highlightQueryInHtml } from "@/components/search/highlightQueryInHtml";
import { HANDBOOK_MAIN_ID } from "@/constants";
import { conceptMatchesQuery } from "@/lib/nav";
import type { Concept } from "@/lib/parse";

function subscribeHash(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

function getHash() {
  return window.location.hash;
}

function setHash(id: string, scroll = true) {
  const next = `#${id}`;
  if (window.location.hash === next) {
    return;
  }
  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${window.location.search}${next}`,
  );
  window.dispatchEvent(new CustomEvent("hashchange", { detail: { scroll } }));
}

function shouldScrollFromHashEvent(event?: Event): boolean {
  if (event == null) {
    return true;
  }
  if (event instanceof CustomEvent) {
    const detail = event.detail as { scroll?: boolean } | undefined;
    return detail?.scroll !== false;
  }
  return true;
}

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

export function ConceptList({
  concepts,
  emptyMessage,
}: {
  concepts: readonly Concept[];
  emptyMessage: string;
}) {
  const query = useSearchQuery();
  const mode = useSearchMode();
  const hash = useSyncExternalStore(subscribeHash, getHash, () => "");
  const activeId = decodeURIComponent(hash.replace(/^#/, ""));

  useEffect(() => {
    function focusFromHash(event?: Event) {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
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
      const hashId = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      const hashConcept = concepts.find((concept) => concept.id === hashId);
      if (!hashConcept || !conceptMatchesQuery(hashConcept, needle, mode)) {
        const match = concepts.find((concept) => conceptMatchesQuery(concept, needle, mode));
        if (match) {
          setHash(match.id);
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
                setHash(event.currentTarget.id, false);
              }
            }}
          >
            <summary className="cursor-pointer py-3 text-left text-base font-medium text-zinc-900">
              <HighlightedText text={concept.title} query={query} />
            </summary>
            <ConceptBody html={concept.html} query={mode === "notes" ? query : ""} />
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
