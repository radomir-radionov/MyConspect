"use client";

import { memo, useEffect, useSyncExternalStore } from "react";
import { HighlightedText } from "@/components/HighlightedText";
import { useSearchQuery } from "@/components/SearchQueryContext";
import { matchesQuery } from "@/lib/content/nav";
import type { Concept } from "@/lib/content/parse";

function subscribeHash(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

function getHash() {
  return window.location.hash;
}

function setHash(id: string) {
  const next = `#${id}`;
  if (window.location.hash === next) {
    return;
  }
  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${window.location.search}${next}`,
  );
  window.dispatchEvent(new Event("hashchange"));
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

function scrollConceptToTop(element: HTMLElement) {
  const scroller = document.getElementById("handbook-main");
  if (!(scroller instanceof HTMLElement)) {
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
  const hash = useSyncExternalStore(subscribeHash, getHash, () => "");
  const activeId = decodeURIComponent(hash.replace(/^#/, ""));

  useEffect(() => {
    function focusFromHash() {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!id) {
        return;
      }
      const element = document.getElementById(id);
      if (!(element instanceof HTMLDetailsElement)) {
        return;
      }
      if (!element.open) {
        element.open = true;
      }
      closeSiblingAccordions(element);
      window.requestAnimationFrame(() => {
        scrollConceptToTop(element);
      });
    }

    const needle = query.trim().toLowerCase();
    if (needle.length > 0) {
      const hashId = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      const hashConcept = concepts.find((concept) => concept.id === hashId);
      if (!hashConcept || !matchesQuery(hashConcept.title, needle)) {
        const match = concepts.find((concept) => matchesQuery(concept.title, needle));
        if (match) {
          setHash(match.id);
        }
      }
    }

    focusFromHash();
    window.addEventListener("hashchange", focusFromHash);
    return () => window.removeEventListener("hashchange", focusFromHash);
  }, [concepts, query]);

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
            name="topic-concepts"
            className={
              isActive
                ? "group scroll-mt-20 bg-yellow-50 px-4"
                : "group scroll-mt-20 px-4"
            }
            onToggle={(event) => {
              if (event.currentTarget.open) {
                closeSiblingAccordions(event.currentTarget);
                setHash(event.currentTarget.id);
              }
            }}
          >
            <summary className="cursor-pointer py-3 text-left text-base font-medium text-zinc-900">
              <HighlightedText text={concept.title} query={query} />
            </summary>
            <ConceptBody html={concept.html} />
          </details>
        );
      })}
    </div>
  );
}

const ConceptBody = memo(function ConceptBody({ html }: { html: string }) {
  return (
    <div
      className="concept-body pb-5 pt-1"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});
