"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SEARCH_INDEX_HREF } from "@/constants";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/locales";
import type { NavGroup } from "@/lib/nav";

const cached = new Map<string, readonly NavGroup[]>();
const inflight = new Map<string, Promise<readonly NavGroup[]>>();

export function localeFromPath(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}

export function searchIndexHref(locale: string): string {
  return `/${locale}${SEARCH_INDEX_HREF}`;
}

export function loadSearchCorpus(locale: string): Promise<readonly NavGroup[]> {
  const hit = cached.get(locale);
  if (hit) {
    return Promise.resolve(hit);
  }
  const pending = inflight.get(locale);
  if (pending) {
    return pending;
  }
  const request = fetch(searchIndexHref(locale))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Search index ${response.status}`);
      }
      return response.json() as Promise<NavGroup[]>;
    })
    .then((groups) => {
      cached.set(locale, groups);
      inflight.delete(locale);
      return groups;
    })
    .catch((error: unknown) => {
      inflight.delete(locale);
      throw error;
    });
  inflight.set(locale, request);
  return request;
}

export function useSearchCorpus(enabled: boolean): readonly NavGroup[] | null {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPath(pathname);
  const [groups, setGroups] = useState<readonly NavGroup[] | null>(
    () => cached.get(locale) ?? null,
  );
  const [loadedLocale, setLoadedLocale] = useState(locale);

  if (loadedLocale !== locale) {
    setLoadedLocale(locale);
    setGroups(cached.get(locale) ?? null);
  }

  useEffect(() => {
    if (!enabled || groups) {
      return;
    }
    let cancelled = false;
    void loadSearchCorpus(locale)
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
  }, [enabled, groups, locale]);

  return groups;
}
