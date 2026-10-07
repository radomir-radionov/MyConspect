"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { isTrackId, type TrackId } from "@/lib/catalog";
import { isLocale } from "@/lib/i18n/locales";
import { enrichNavSections } from "@/lib/nav/enrichNav";
import type { NavGroup, NavRootSection } from "@/lib/nav";
import { loadTrackSearchIndex, localeFromPath } from "./searchCorpus";

function trackIdFromPathname(pathname: string): TrackId | null {
  const segments = pathname.split("/").filter(Boolean);
  const offset = segments[0] && isLocale(segments[0]) ? 1 : 0;
  const trackSlug = segments[offset];
  return trackSlug && isTrackId(trackSlug) ? trackSlug : null;
}

function rememberTrack(
  loadedByTrack: ReadonlyMap<string, readonly NavGroup[]>,
  trackId: TrackId,
  groups: readonly NavGroup[],
): ReadonlyMap<string, readonly NavGroup[]> {
  if (loadedByTrack.has(trackId)) {
    return loadedByTrack;
  }
  const next = new Map(loadedByTrack);
  next.set(trackId, groups);
  return next;
}

export function useEnrichedNavSections(
  structure: readonly NavRootSection[],
): readonly NavRootSection[] {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPath(pathname);
  const activeTrackId = trackIdFromPathname(pathname);
  const [loadedByTrack, setLoadedByTrack] = useState<
    ReadonlyMap<string, readonly NavGroup[]>
  >(() => new Map());

  useEffect(() => {
    if (!activeTrackId || loadedByTrack.has(activeTrackId)) {
      return;
    }
    let cancelled = false;
    void loadTrackSearchIndex(locale, activeTrackId)
      .then((groups) => {
        if (cancelled) {
          return;
        }
        setLoadedByTrack((current) =>
          rememberTrack(current, activeTrackId, groups),
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [activeTrackId, locale, loadedByTrack]);

  useEffect(() => {
    const preload = () => {
      const seen = loadedByTrack;
      for (const section of structure) {
        for (const group of section.groups) {
          const trackId = group.id;
          if (seen.has(trackId)) {
            continue;
          }
          void loadTrackSearchIndex(locale, trackId)
            .then((groups) => {
              setLoadedByTrack((current) =>
                rememberTrack(current, trackId, groups),
              );
            })
            .catch(() => undefined);
        }
      }
    };

    const idle = window.requestIdleCallback?.bind(window);
    if (!idle) {
      preload();
      return;
    }
    const handle = idle(preload);
    return () => {
      window.cancelIdleCallback?.(handle);
    };
  }, [structure, locale, loadedByTrack]);

  return useMemo(
    () => enrichNavSections(structure, loadedByTrack),
    [structure, loadedByTrack],
  );
}
