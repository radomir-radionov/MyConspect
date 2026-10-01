"use client";

import { useEffect } from "react";
import { HANDBOOK_SEARCH_INPUT_ID } from "@/constants";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  if (target.isContentEditable) {
    return true;
  }
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function focusSearchInput() {
  const input = document.getElementById(HANDBOOK_SEARCH_INPUT_ID);
  if (input instanceof HTMLInputElement) {
    input.focus();
    input.select();
  }
}

export function useHandbookShortcuts({
  query,
  clearQuery,
  searchSheetOpen,
  dismissNav,
}: {
  query: string;
  clearQuery: () => void;
  searchSheetOpen: boolean;
  dismissNav: () => void;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (query.trim().length > 0) {
          event.preventDefault();
          clearQuery();
          return;
        }
        if (searchSheetOpen) {
          event.preventDefault();
          dismissNav();
        }
        return;
      }

      if (isEditableTarget(event.target)) {
        return;
      }

      if (event.key === "/") {
        event.preventDefault();
        focusSearchInput();
        return;
      }

      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        focusSearchInput();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [clearQuery, dismissNav, query, searchSheetOpen]);
}
