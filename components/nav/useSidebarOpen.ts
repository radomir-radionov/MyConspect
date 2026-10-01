"use client";

import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { SIDEBAR_COLLAPSE_ALL_EVENT } from "@/constants";
import type { TrackId } from "@/lib/catalog";
import type { NavGroup } from "@/lib/nav";
import { hashIdFrom } from "./hash";
import { isHomePath, locationForPath, type NavLocation } from "./location";

type NavSnapshot = {
  searching: boolean;
  activeTrackId: TrackId | null;
  pathname: string;
  hash: string;
  activeConceptId: string;
};

const EMPTY_FOLD: NavLocation = {
  topicHref: null,
  subjectHref: null,
  clusterKey: null,
  sectionKey: null,
};

function foldFromSync(
  location: NavLocation,
  previous: NavLocation | undefined,
  clearingHash: boolean,
): NavLocation {
  let clusterKey: string | null = previous?.clusterKey ?? null;
  if (location.clusterKey) {
    clusterKey = location.clusterKey;
  } else if (!location.subjectHref) {
    clusterKey = null;
  }

  let sectionKey: string | null = previous?.sectionKey ?? null;
  if (location.sectionKey) {
    sectionKey = location.sectionKey;
  } else if (!location.subjectHref) {
    sectionKey = null;
  }

  let topicHref: string | null = previous?.topicHref ?? null;
  if (!clearingHash) {
    topicHref = location.topicHref;
  }

  return {
    subjectHref: location.subjectHref,
    clusterKey,
    sectionKey,
    topicHref,
  };
}

export function collapseAllSidebarTracks(
  setOpenTrackIds: Dispatch<SetStateAction<Set<TrackId>>>,
  setTrackFolds: Dispatch<SetStateAction<Map<TrackId, NavLocation>>>,
) {
  setOpenTrackIds(new Set());
  setTrackFolds(new Map());
}

export function dispatchSidebarCollapseAll() {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(SIDEBAR_COLLAPSE_ALL_EVENT));
}

export function foldRevision(
  folds: ReadonlyMap<TrackId, NavLocation>,
  openTracks: ReadonlySet<TrackId>,
): string {
  return [...openTracks]
    .sort()
    .map((id) => {
      const fold = folds.get(id) ?? EMPTY_FOLD;
      return `${id}:${fold.subjectHref ?? ""}:${fold.clusterKey ?? ""}:${fold.sectionKey ?? ""}:${fold.topicHref ?? ""}`;
    })
    .join("|");
}

export function useSidebarOpen({
  groups,
  pathname,
  hash,
  searching,
  activeTrackId,
}: {
  groups: readonly NavGroup[];
  pathname: string;
  hash: string;
  searching: boolean;
  activeTrackId: TrackId | null;
}) {
  const activeConceptId = hashIdFrom(hash);
  const location = locationForPath(groups, pathname, hash);
  const [openTrackIds, setOpenTrackIds] = useState<Set<TrackId>>(() =>
    activeTrackId ? new Set([activeTrackId]) : new Set(),
  );
  const [trackFolds, setTrackFolds] = useState<Map<TrackId, NavLocation>>(
    () => {
      if (!activeTrackId) {
        return new Map();
      }
      return new Map([[activeTrackId, location]]);
    },
  );
  const [navSnapshot, setNavSnapshot] = useState<NavSnapshot>({
    searching,
    activeTrackId,
    pathname,
    hash,
    activeConceptId,
  });

  if (
    searching !== navSnapshot.searching ||
    activeTrackId !== navSnapshot.activeTrackId ||
    pathname !== navSnapshot.pathname ||
    hash !== navSnapshot.hash ||
    activeConceptId !== navSnapshot.activeConceptId
  ) {
    setNavSnapshot({
      searching,
      activeTrackId,
      pathname,
      hash,
      activeConceptId,
    });
    if (!searching) {
      syncOpenState({
        snapshot: navSnapshot,
        activeTrackId,
        pathname,
        hash,
        activeConceptId,
        location,
        setOpenTrackIds,
        setTrackFolds,
      });
    }
  }

  const getTrackFold = useCallback(
    (trackId: TrackId): NavLocation => trackFolds.get(trackId) ?? EMPTY_FOLD,
    [trackFolds],
  );

  const patchTrackFold = useCallback(
    (trackId: TrackId, patch: Partial<NavLocation>) => {
      setTrackFolds((previous) => {
        const next = new Map(previous);
        const current = next.get(trackId) ?? EMPTY_FOLD;
        next.set(trackId, { ...current, ...patch });
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    function onCollapseAll() {
      collapseAllSidebarTracks(setOpenTrackIds, setTrackFolds);
    }
    window.addEventListener(SIDEBAR_COLLAPSE_ALL_EVENT, onCollapseAll);
    return () =>
      window.removeEventListener(SIDEBAR_COLLAPSE_ALL_EVENT, onCollapseAll);
  }, []);

  const toggleTrackId = useCallback((trackId: TrackId) => {
    setOpenTrackIds((previous) => {
      if (previous.has(trackId)) {
        return new Set();
      }
      return new Set([trackId]);
    });
  }, []);

  const ensureTrackOpen = useCallback((trackId: TrackId) => {
    setOpenTrackIds((previous) => {
      if (previous.size === 1 && previous.has(trackId)) {
        return previous;
      }
      return new Set([trackId]);
    });
  }, []);

  return {
    activeConceptId,
    openTrackIds,
    toggleTrackId,
    ensureTrackOpen,
    trackFolds,
    getTrackFold,
    patchTrackFold,
  };
}

function syncOpenState({
  snapshot,
  activeTrackId,
  pathname,
  hash,
  activeConceptId,
  location,
  setOpenTrackIds,
  setTrackFolds,
}: {
  snapshot: NavSnapshot;
  activeTrackId: TrackId | null;
  pathname: string;
  hash: string;
  activeConceptId: string;
  location: NavLocation;
  setOpenTrackIds: Dispatch<SetStateAction<Set<TrackId>>>;
  setTrackFolds: Dispatch<SetStateAction<Map<TrackId, NavLocation>>>;
}) {
  const leftSearch = snapshot.searching;
  if (!leftSearch && pathname !== snapshot.pathname && isHomePath(pathname)) {
    collapseAllSidebarTracks(setOpenTrackIds, setTrackFolds);
    return;
  }
  if (
    leftSearch ||
    activeTrackId !== snapshot.activeTrackId ||
    pathname !== snapshot.pathname
  ) {
    if (activeTrackId) {
      setOpenTrackIds((previous) => {
        if (previous.size === 1 && previous.has(activeTrackId)) {
          return previous;
        }
        return new Set([activeTrackId]);
      });
    }
  }
  if (leftSearch || pathname !== snapshot.pathname || hash !== snapshot.hash) {
    if (activeTrackId) {
      const clearingHash =
        !leftSearch &&
        pathname === snapshot.pathname &&
        snapshot.hash !== "" &&
        hash === "";
      setTrackFolds((previous) => {
        const next = new Map(previous);
        next.set(
          activeTrackId,
          foldFromSync(location, previous.get(activeTrackId), clearingHash),
        );
        return next;
      });
    }
  } else if (activeConceptId && activeConceptId !== snapshot.activeConceptId) {
    if (activeTrackId && location.topicHref) {
      setTrackFolds((previous) => {
        const next = new Map(previous);
        const current = next.get(activeTrackId) ?? EMPTY_FOLD;
        next.set(activeTrackId, { ...current, topicHref: location.topicHref });
        return next;
      });
    }
  }
}
