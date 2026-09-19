"use client";

import { useEffect, useState } from "react";
import { SEARCH_INDEX_HREF } from "@/constants";
import type { NavGroup } from "@/lib/nav";

let cached: readonly NavGroup[] | null = null;
let inflight: Promise<readonly NavGroup[]> | null = null;

export function loadSearchCorpus(): Promise<readonly NavGroup[]> {
  if (cached) {
    return Promise.resolve(cached);
  }
  inflight ??= fetch(SEARCH_INDEX_HREF)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Search index ${response.status}`);
      }
      return response.json() as Promise<NavGroup[]>;
    })
    .then((groups) => {
      cached = groups;
      return groups;
    })
    .catch((error: unknown) => {
      inflight = null;
      throw error;
    });
  return inflight;
}

export function useSearchCorpus(enabled: boolean): readonly NavGroup[] | null {
  const [groups, setGroups] = useState<readonly NavGroup[] | null>(cached);

  useEffect(() => {
    if (!enabled || groups) {
      return;
    }
    let cancelled = false;
    void loadSearchCorpus()
      .then((next) => {
        if (!cancelled) {
          setGroups(next);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGroups(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, groups]);

  return groups;
}
