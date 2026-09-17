"use client";

import { useDeferredValue, useEffect, useRef, useSyncExternalStore, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SEARCH_NAV_DELAY_MS } from "@/constants";
import { firstSearchHref, splitHref, type NavGroup, type SearchMode } from "@/lib/nav";
import { applySameDocumentHref } from "./hash";
import { getServerSearchUi, readSearchUi, subscribeUi, writeUi } from "./uiStorage";

export function useHandbookSearch(
  groups: readonly NavGroup[],
  onSearchActive?: () => void,
) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const onSearchActiveRef = useRef(onSearchActive);
  const pathnameRef = useRef(pathname);
  const groupsRef = useRef(groups);
  const restoreHrefRef = useRef<string | null>(null);
  const searchTimerRef = useRef<number | null>(null);
  const stored = useSyncExternalStore(subscribeUi, readSearchUi, getServerSearchUi);
  const query = stored.query;
  const mode = stored.mode;
  const deferredQuery = useDeferredValue(query);
  const modeRef = useRef(mode);

  useEffect(() => {
    onSearchActiveRef.current = onSearchActive;
    pathnameRef.current = pathname;
    groupsRef.current = groups;
    modeRef.current = mode;
  }, [onSearchActive, pathname, groups, mode]);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current !== null) {
        window.clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  function currentHref() {
    return `${pathnameRef.current}${window.location.hash}`;
  }

  function goTo(target: string) {
    const { pathname: nextPath, hash: nextHash } = splitHref(target);
    if (applySameDocumentHref(nextPath, nextHash, pathnameRef.current)) {
      return;
    }
    startTransition(() => {
      router.replace(target, { scroll: false });
    });
  }

  function applySearch(nextQuery: string) {
    const trimmed = nextQuery.trim();
    if (trimmed.length === 0) {
      const restore = restoreHrefRef.current;
      restoreHrefRef.current = null;
      if (restore && restore !== currentHref()) {
        goTo(restore);
      }
      return;
    }

    if (restoreHrefRef.current === null) {
      restoreHrefRef.current = currentHref();
    }

    const target = firstSearchHref(
      groupsRef.current,
      nextQuery,
      pathnameRef.current,
      modeRef.current,
    );
    if (target) {
      goTo(target);
    }
  }

  function scheduleSearch(nextQuery: string) {
    if (searchTimerRef.current !== null) {
      window.clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }

    if (nextQuery.trim().length === 0) {
      applySearch(nextQuery);
      return;
    }

    searchTimerRef.current = window.setTimeout(() => {
      searchTimerRef.current = null;
      applySearch(nextQuery);
    }, SEARCH_NAV_DELAY_MS);
  }

  function changeQuery(value: string) {
    writeUi({ query: value });
    if (value.trim().length > 0) {
      onSearchActiveRef.current?.();
    }
    scheduleSearch(value);
  }

  function changeMode(nextMode: SearchMode) {
    writeUi({ mode: nextMode });
    modeRef.current = nextMode;
    if (query.trim().length > 0) {
      onSearchActiveRef.current?.();
      scheduleSearch(query);
    }
  }

  return {
    query,
    deferredQuery,
    mode,
    changeQuery,
    changeMode,
  };
}
