"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  followHandbookHref,
  getHash,
  getPendingPathname,
  getServerHash,
  getServerPendingPathname,
  handbookLocation,
  hashIdFrom,
  subscribeHash,
  subscribePendingPath,
} from "@/components/nav/hash";
import {
  getBookmarkNavMode,
  getServerBookmarkNavMode,
  subscribeBookmarkNavMode,
} from "@/components/nav/bookmarkNavMode";
import {
  navChainForPath,
  navChainIndex,
  parentHrefForPath,
  siblingNavHrefForPath,
} from "@/components/nav/location";
import { useSearchCorpus } from "@/components/nav/searchCorpus";
import {
  activeBookmarkIndex,
  getServerBookmarks,
  readBookmarks,
  siblingBookmarkHref,
  subscribeBookmarks,
} from "@/lib/nav/bookmarks";
import { chromeFor } from "@/lib/i18n/chrome";
import { homeHref, localeFromPathname } from "@/lib/i18n/paths";

export function useHandbookTopicNav() {
  const pathname = usePathname() ?? "/en";
  const router = useRouter();
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const pendingPathname = useSyncExternalStore(
    subscribePendingPath,
    getPendingPathname,
    getServerPendingPathname,
  );
  const location = useMemo(
    () => handbookLocation(pathname, hash),
    [pathname, hash, pendingPathname],
  );
  const activeConceptId = hashIdFrom(location.hash);
  const bookmarks = useSyncExternalStore(
    subscribeBookmarks,
    readBookmarks,
    getServerBookmarks,
  );
  const navGroups = useSearchCorpus(true);
  const locale = localeFromPathname(pathname);
  const chrome = useMemo(() => chromeFor(locale), [locale]);
  const home = useMemo(() => homeHref(locale), [locale]);

  const bookmarkNavMode = useSyncExternalStore(
    subscribeBookmarkNavMode,
    getBookmarkNavMode,
    getServerBookmarkNavMode,
  );
  const bookmarkIndex = useMemo(
    () => activeBookmarkIndex(bookmarks, location.pathname, activeConceptId),
    [bookmarks, location.pathname, activeConceptId],
  );
  const inBookmarks =
    bookmarkNavMode && bookmarkIndex >= 0 && bookmarks.length > 1;

  const chain = useMemo(() => {
    if (!navGroups) {
      return null;
    }
    return navChainForPath(navGroups, location.pathname, location.hash);
  }, [navGroups, location.pathname, location.hash]);

  const chainIndex = useMemo(() => {
    if (!chain) {
      return -1;
    }
    return navChainIndex(chain, location.pathname, location.hash);
  }, [chain, location.pathname, location.hash]);

  const inChain = chainIndex >= 0;

  const prevHref = useMemo(() => {
    if (inBookmarks) {
      return siblingBookmarkHref(
        bookmarks,
        location.pathname,
        activeConceptId,
        -1,
      );
    }
    if (!navGroups || !inChain) {
      return null;
    }
    return siblingNavHrefForPath(
      navGroups,
      location.pathname,
      location.hash,
      -1,
      home,
    );
  }, [
    inBookmarks,
    bookmarks,
    location.pathname,
    location.hash,
    activeConceptId,
    navGroups,
    inChain,
    home,
  ]);

  const nextHref = useMemo(() => {
    if (inBookmarks) {
      return siblingBookmarkHref(
        bookmarks,
        location.pathname,
        activeConceptId,
        1,
      );
    }
    if (!navGroups || !inChain) {
      return null;
    }
    return siblingNavHrefForPath(
      navGroups,
      location.pathname,
      location.hash,
      1,
      home,
    );
  }, [
    inBookmarks,
    bookmarks,
    location.pathname,
    location.hash,
    activeConceptId,
    navGroups,
    inChain,
    home,
  ]);

  const parentHref = useMemo(() => {
    if (!navGroups) {
      return null;
    }
    return parentHrefForPath(navGroups, location.pathname, location.hash, {
      home: chrome.home,
      instructions: chrome.instructions,
    });
  }, [
    navGroups,
    location.pathname,
    location.hash,
    chrome.home,
    chrome.instructions,
  ]);

  const navigate = useCallback(
    (href: string | null) => {
      if (!href) {
        return;
      }
      followHandbookHref(
        href,
        pathname,
        (path) => {
          router.push(path, { scroll: false });
        },
        { bookmarkNav: bookmarkNavMode },
      );
    },
    [pathname, router, bookmarkNavMode],
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
    inChain: inBookmarks || inChain,
    showBack: inBookmarks ? prevHref !== null : inChain && prevHref !== null,
    showNext: inBookmarks ? nextHref !== null : inChain && nextHref !== null,
    goBack,
    goNext,
    goToParent,
    parentHref,
    prevHref,
    nextHref,
  };
}
