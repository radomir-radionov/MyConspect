"use client";

import { useSyncExternalStore } from "react";

const MD_UP_QUERY = "(min-width: 768px)";

function mediaQuery() {
  return window.matchMedia(MD_UP_QUERY);
}

function subscribe(onStoreChange: () => void) {
  const query = mediaQuery();
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

export function useMdUp() {
  return useSyncExternalStore(
    subscribe,
    () => mediaQuery().matches,
    () => false,
  );
}
