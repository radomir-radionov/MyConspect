"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { followHandbookHref, clearConceptHash } from "@/components/nav/hash";
import { useHandbookLocation } from "@/components/nav/useHandbookLocation";
import {
  getBookmarkNavMode,
  getServerBookmarkNavMode,
  setBookmarkNavMode,
  subscribeBookmarkNavMode,
} from "@/components/nav/bookmarkNavMode";
import {
  adjacentConceptId,
  navChainForPath,
  navChainIndex,
  parentHrefForPath,
  siblingNavHrefForPath,
} from "@/components/nav/location";
import { useTopicNavConcepts } from "@/components/topic/TopicNavConceptsContext";
import { hashIdFrom } from "@/lib/nav/navUtils";
import { useHandbookNavGroups } from "@/components/nav/handbookNavContext";
import { useSearchCorpus } from "@/components/nav/searchCorpus";
import {
  activeBookmarkIndex,
  getServerBookmarks,
  readBookmarks,
  siblingBookmarkHref,
  subscribeBookmarks,
} from "@/lib/nav/bookmarks";
import { chromeFor } from "@/lib/i18n/chrome";
import { localeFromPathname } from "@/lib/i18n/paths";
import { splitHref } from "@/lib/nav";

function siblingHrefFromConceptIds(
  concepts: readonly { readonly id: string }[],
  pathname: string,
  hash: string,
  delta: -1 | 1,
): string | null {
  const conceptId = hashIdFrom(hash);
  if (!conceptId || concepts.length <= 1) {
    return null;
  }
  const ids = concepts.map((concept) => concept.id);
  const adjacentId = adjacentConceptId(ids, conceptId, delta);
  if (adjacentId) {
    return `${pathname}#${adjacentId}`;
  }
  if (delta < 0) {
    return ids.indexOf(conceptId) === 0 ? pathname : null;
  }
  const lastId = ids[ids.length - 1];
  return conceptId === lastId ? pathname : null;
}

export function useHandbookTopicNav(options?: { conceptOpen?: boolean }) {
  const { pathname, location, activeConceptId } = useHandbookLocation();
  const conceptOpen = options?.conceptOpen ?? activeConceptId.length > 0;
  const router = useRouter();
  const bookmarks = useSyncExternalStore(
    subscribeBookmarks,
    readBookmarks,
    getServerBookmarks,
  );
  const shellNavGroups = useHandbookNavGroups();
  const searchNavGroups = useSearchCorpus(shellNavGroups === null);
  const navGroups = shellNavGroups ?? searchNavGroups;
  const topicNavConcepts = useTopicNavConcepts();
  const locale = localeFromPathname(pathname);
  const chrome = useMemo(() => chromeFor(locale), [locale]);

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

  const topicScopedSibling = useMemo(() => {
    if (!conceptOpen || !activeConceptId || !topicNavConcepts) {
      return null;
    }
    return {
      prev: siblingHrefFromConceptIds(
        topicNavConcepts,
        location.pathname,
        location.hash,
        -1,
      ),
      next: siblingHrefFromConceptIds(
        topicNavConcepts,
        location.pathname,
        location.hash,
        1,
      ),
    };
  }, [
    activeConceptId,
    conceptOpen,
    location.hash,
    location.pathname,
    topicNavConcepts,
  ]);

  const prevHref = useMemo(() => {
    if (inBookmarks) {
      return siblingBookmarkHref(
        bookmarks,
        location.pathname,
        activeConceptId,
        -1,
      );
    }
    if (topicScopedSibling) {
      return topicScopedSibling.prev;
    }
    if (!navGroups) {
      return null;
    }
    return siblingNavHrefForPath(
      navGroups,
      location.pathname,
      location.hash,
      -1,
    );
  }, [
    inBookmarks,
    bookmarks,
    location.pathname,
    location.hash,
    activeConceptId,
    navGroups,
    topicScopedSibling,
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
    if (topicScopedSibling) {
      return topicScopedSibling.next;
    }
    if (!navGroups) {
      return null;
    }
    return siblingNavHrefForPath(
      navGroups,
      location.pathname,
      location.hash,
      1,
    );
  }, [
    inBookmarks,
    bookmarks,
    location.pathname,
    location.hash,
    activeConceptId,
    navGroups,
    topicScopedSibling,
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
      const { pathname: targetPath, hash: targetHash } = splitHref(href);
      if (targetPath === pathname && !targetHash && activeConceptId) {
        if (!bookmarkNavMode) {
          setBookmarkNavMode(false);
        }
        clearConceptHash(false);
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
    [pathname, router, bookmarkNavMode, activeConceptId],
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

  const onTopicIndex = !hashIdFrom(location.hash);

  return {
    inChain: inBookmarks || inChain,
    showBack: inBookmarks
      ? prevHref !== null
      : prevHref !== null && (conceptOpen || onTopicIndex),
    showNext: inBookmarks
      ? nextHref !== null
      : nextHref !== null && (conceptOpen || onTopicIndex),
    goBack,
    goNext,
    goToParent,
    parentHref,
    prevHref,
    nextHref,
  };
}
