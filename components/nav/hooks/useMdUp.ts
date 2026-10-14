import { useSyncExternalStore } from "react";

const MD_UP_QUERY = "(min-width: 768px)";

function mediaQuery() {
  return window.matchMedia(MD_UP_QUERY);
}

function subscribeMdUp(onStoreChange: () => void) {
  const mq = mediaQuery();
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

export function isMdUp() {
  return mediaQuery().matches;
}

export function useMdUp() {
  return useSyncExternalStore(
    subscribeMdUp,
    () => mediaQuery().matches,
    () => false,
  );
}
