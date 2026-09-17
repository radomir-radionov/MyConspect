"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
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
  const [openTrackId, setOpenTrackId] = useState<TrackId | null>(activeTrackId);
  const [openSubjectHref, setOpenSubjectHref] = useState<string | null>(location.subjectHref);
  const [openClusterKey, setOpenClusterKey] = useState<string | null>(location.clusterKey);
  const [openTopicHref, setOpenTopicHref] = useState<string | null>(location.topicHref);
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
    setNavSnapshot({ searching, activeTrackId, pathname, hash, activeConceptId });
    if (!searching) {
      syncOpenState({
        snapshot: navSnapshot,
        activeTrackId,
        pathname,
        hash,
        activeConceptId,
        location,
        setOpenTrackId,
        setOpenSubjectHref,
        setOpenClusterKey,
        setOpenTopicHref,
      });
    }
  }

  return {
    activeConceptId,
    openTrackId,
    setOpenTrackId,
    openSubjectHref,
    setOpenSubjectHref,
    openClusterKey,
    setOpenClusterKey,
    openTopicHref,
    setOpenTopicHref,
  };
}

function syncOpenState({
  snapshot,
  activeTrackId,
  pathname,
  hash,
  activeConceptId,
  location,
  setOpenTrackId,
  setOpenSubjectHref,
  setOpenClusterKey,
  setOpenTopicHref,
}: {
  snapshot: NavSnapshot;
  activeTrackId: TrackId | null;
  pathname: string;
  hash: string;
  activeConceptId: string;
  location: NavLocation;
  setOpenTrackId: Dispatch<SetStateAction<TrackId | null>>;
  setOpenSubjectHref: Dispatch<SetStateAction<string | null>>;
  setOpenClusterKey: Dispatch<SetStateAction<string | null>>;
  setOpenTopicHref: Dispatch<SetStateAction<string | null>>;
}) {
  const leftSearch = snapshot.searching;
  if (leftSearch || activeTrackId !== snapshot.activeTrackId || pathname !== snapshot.pathname) {
    setOpenTrackId(activeTrackId);
  }
  if (leftSearch || pathname !== snapshot.pathname || hash !== snapshot.hash) {
    setOpenSubjectHref(location.subjectHref);
    if (location.clusterKey) {
      setOpenClusterKey(location.clusterKey);
    } else if (!location.subjectHref) {
      setOpenClusterKey(null);
    }
    setOpenTopicHref(location.topicHref);
  } else if (activeConceptId && activeConceptId !== snapshot.activeConceptId) {
    if (location.topicHref) {
      setOpenTopicHref(location.topicHref);
    }
  }
}
