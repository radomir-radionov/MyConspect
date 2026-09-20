"use client";

import { useDeferredValue, useEffect, useRef, useSyncExternalStore, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SEARCH_NAV_DELAY_MS } from "@/constants";
import { firstSearchHref, splitHref, type NavGroup, type SearchMode } from "@/lib/nav";
import { applySameDocumentHref, followHandbookHref } from "./hash";
import { useSearchCorpus } from "./searchCorpus";
import { getServerSearchUi, readSearchUi, subscribeUi, writeUi } from "./uiStorage";

export function useHandbookSearch(
  groups: readonly NavGroup[],
  onSearchActive?: () => void,
) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const onSearchActiveRef = useRef(onSearchActive);
  const pathnameRef = useRef(pathname);
  const restoreHrefRef = useRef<string | null>(null);
  const searchTimerRef = useRef<number | null>(null);
  const stored = useSyncExternalStore(subscribeUi, readSearchUi, getServerSearchUi);
  const query = stored.query;
  const mode = stored.mode;
  const notesCorpus = useSearchCorpus(mode === "notes");
  const searchGroups = notesCorpus ?? groups;
  const groupsRef = useRef(searchGroups);
  const deferredQuery = useDeferredValue(query);
  const modeRef = useRef(mode);

  useEffect(() => {
    onSearchActiveRef.current = onSearchActive;
    pathnameRef.current = pathname;
    groupsRef.current = searchGroups;
    modeRef.current = mode;
  }, [onSearchActive, pathname, searchGroups, mode]);

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
    followHandbookHref(target, pathnameRef.current, (path) => {
      startTransition(() => {
        router.replace(path, { scroll: false });
      });
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
      const { pathname, hash } = splitHref(target);
      applySameDocumentHref(pathname, hash, pathnameRef.current);
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

  function clearQuery() {
    if (searchTimerRef.current !== null) {
      window.clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
    restoreHrefRef.current = null;
    writeUi({ query: "" });
  }

  function changeMode(nextMode: SearchMode) {
    writeUi({ mode: nextMode });
    modeRef.current = nextMode;
    if (query.trim().length > 0) {
      onSearchActiveRef.current?.();
      scheduleSearch(query);
    }
  }

  const notesCorpusReady = useRef(false);
  useEffect(() => {
    if (!notesCorpus) {
      return;
    }
    const firstLoad = !notesCorpusReady.current;
    notesCorpusReady.current = true;
    if (!firstLoad || mode !== "notes" || query.trim().length === 0) {
      return;
    }
    applySearch(query);
  }, [notesCorpus, mode, query]);

  return {
    query,
    deferredQuery,
    mode,
    searchGroups,
    changeQuery,
    clearQuery,
    changeMode,
  };
}
