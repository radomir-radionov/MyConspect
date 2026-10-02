"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  followHandbookHref,
  getHash,
  getServerHash,
  subscribeHash,
} from "@/components/nav/hash";
import {
  navChainForPath,
  navChainIndex,
  parentHrefForPath,
  siblingNavHrefForPath,
} from "@/components/nav/location";
import { useSearchCorpus } from "@/components/nav/searchCorpus";
import { chromeFor } from "@/lib/i18n/chrome";
import { homeHref, localeFromPathname } from "@/lib/i18n/paths";

export function useHandbookTopicNav() {
  const pathname = usePathname() ?? "/en";
  const router = useRouter();
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const navGroups = useSearchCorpus(true);
  const locale = localeFromPathname(pathname);
  const chrome = useMemo(() => chromeFor(locale), [locale]);
  const home = useMemo(() => homeHref(locale), [locale]);

  const chain = useMemo(() => {
    if (!navGroups) {
      return null;
    }
    return navChainForPath(navGroups, pathname, hash);
  }, [navGroups, pathname, hash]);

  const chainIndex = useMemo(() => {
    if (!chain) {
      return -1;
    }
    return navChainIndex(chain, pathname, hash);
  }, [chain, pathname, hash]);

  const inChain = chainIndex >= 0;

  const prevHref = useMemo(() => {
    if (!navGroups || !inChain) {
      return null;
    }
    return siblingNavHrefForPath(navGroups, pathname, hash, -1, home);
  }, [navGroups, pathname, hash, inChain, home]);

  const nextHref = useMemo(() => {
    if (!navGroups || !inChain) {
      return null;
    }
    return siblingNavHrefForPath(navGroups, pathname, hash, 1, home);
  }, [navGroups, pathname, hash, inChain, home]);

  const parentHref = useMemo(() => {
    if (!navGroups) {
      return null;
    }
    return parentHrefForPath(navGroups, pathname, hash, {
      home: chrome.home,
      instructions: chrome.instructions,
    });
  }, [navGroups, pathname, hash, chrome.home, chrome.instructions]);

  const navigate = useCallback(
    (href: string | null) => {
      if (!href) {
        return;
      }
      followHandbookHref(href, pathname, (path) => {
        router.push(path);
      });
    },
    [pathname, router],
  );

  const goBack = useCallback(() => {
    navigate(prevHref);
  }, [navigate, prevHref]);

  const goNext = useCallback(() => {
    navigate(nextHref);
  }, [navigate, nextHref]);

  const goToParent = useCallback(() => {
    navigate(parentHref);
  }, [navigate, parentHref]);

  return {
    inChain,
    showBack: inChain && prevHref !== null,
    showNext: inChain && nextHref !== null,
    goBack,
    goNext,
    goToParent,
    parentHref,
    prevHref,
    nextHref,
  };
}
