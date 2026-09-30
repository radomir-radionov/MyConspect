"use client";

import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { TrackId } from "@/lib/catalog";
import type { NavGroup } from "@/lib/nav";
import { hashIdFrom } from "./hash";
import { locationForPath, type NavLocation } from "./location";

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

  let topicHref: string | null = previous?.topicHref ?? null;
  if (!clearingHash) {
    topicHref = location.topicHref;
  }

  return {
    subjectHref: location.subjectHref,
    clusterKey,
    topicHref,
  };
}

export function foldRevision(
  folds: ReadonlyMap<TrackId, NavLocation>,
  openTracks: ReadonlySet<TrackId>,
): string {
  return [...openTracks]
    .sort()
    .map((id) => {
      const fold = folds.get(id) ?? EMPTY_FOLD;
      return `${id}:${fold.subjectHref ?? ""}:${fold.clusterKey ?? ""}:${fold.topicHref ?? ""}`;
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

  const toggleTrackId = useCallback((trackId: TrackId) => {
    setOpenTrackIds((previous) => {
      const next = new Set(previous);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  }, []);

  const ensureTrackOpen = useCallback((trackId: TrackId) => {
    setOpenTrackIds((previous) => {
      if (previous.has(trackId)) {
        return previous;
      }
      const next = new Set(previous);
      next.add(trackId);
      return next;
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
  if (
    leftSearch ||
    activeTrackId !== snapshot.activeTrackId ||
    pathname !== snapshot.pathname
  ) {
    if (activeTrackId) {
      setOpenTrackIds((previous) => {
        if (previous.has(activeTrackId)) {
          return previous;
        }
        const next = new Set(previous);
        next.add(activeTrackId);
        return next;
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
