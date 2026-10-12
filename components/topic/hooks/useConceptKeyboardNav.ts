"use client";

import { useEffect } from "react";
import { hashIdFrom, setHashIfChanged } from "@/components/nav/utils/hash";

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

export function useConceptKeyboardNav(conceptIds: readonly string[]) {
  useEffect(() => {
    if (conceptIds.length <= 1) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      let delta = 0;
      if (event.key === "j") {
        delta = 1;
      } else if (event.key === "k") {
        delta = -1;
      } else {
        return;
      }

      event.preventDefault();

      const currentId = hashIdFrom(window.location.hash);
      let index = conceptIds.indexOf(currentId);
      if (index < 0) {
        index = delta > 0 ? -1 : conceptIds.length;
      }

      const nextIndex = Math.min(
        conceptIds.length - 1,
        Math.max(0, index + delta),
      );
      const nextId = conceptIds[nextIndex];
      if (!nextId || nextId === currentId) {
        return;
      }
      setHashIfChanged(nextId);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [conceptIds]);
}
