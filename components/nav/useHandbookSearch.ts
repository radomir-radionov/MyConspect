"use client";

import { useDeferredValue, useEffect, useRef, useState, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { firstSearchHref, splitHref, type NavGroup, type SearchMode } from "@/lib/nav";

const SEARCH_NAV_DELAY_MS = 280;

export function useHandbookSearch(
  groups: readonly NavGroup[],
  onSearchActive?: () => void,
) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const onSearchActiveRef = useRef(onSearchActive);
  onSearchActiveRef.current = onSearchActive;
  const pathnameRef = useRef(pathname);
  const groupsRef = useRef(groups);
  const restoreHrefRef = useRef<string | null>(null);
  const searchTimerRef = useRef<number | null>(null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [mode, setMode] = useState<SearchMode>("titles");
  const modeRef = useRef(mode);

  pathnameRef.current = pathname;
  groupsRef.current = groups;
  modeRef.current = mode;

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
    const currentPath = pathnameRef.current;
    const currentHash = window.location.hash;

    if (nextPath === currentPath && nextHash === currentHash) {
      window.dispatchEvent(new Event("hashchange"));
      return;
    }

    if (nextPath === currentPath) {
      window.history.replaceState(window.history.state, "", `${nextPath}${nextHash}`);
      window.dispatchEvent(new Event("hashchange"));
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
    setQuery(value);
    if (value.trim().length > 0) {
      onSearchActiveRef.current?.();
    }
    scheduleSearch(value);
  }

  function changeMode(nextMode: SearchMode) {
    setMode(nextMode);
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
