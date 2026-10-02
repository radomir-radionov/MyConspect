"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { followHandbookHref } from "@/components/nav/hash";
import { parentHrefForPath } from "@/components/nav/location";
import { useSearchCorpus } from "@/components/nav/searchCorpus";
import { chromeFor } from "@/lib/i18n/chrome";
import { localeFromPathname } from "@/lib/i18n/paths";
import { ConceptTitleHeader } from "./ConceptTitleHeader";

export function PageTitleHeader({ title }: { title: string }) {
  const pathname = usePathname() ?? "/en";
  const router = useRouter();
  const chrome = useMemo(
    () => chromeFor(localeFromPathname(pathname)),
    [pathname],
  );
  const navGroups = useSearchCorpus(true);
  const parentHref = useMemo(() => {
    if (!navGroups) {
      return null;
    }
    return parentHrefForPath(navGroups, pathname, "", {
      home: chrome.home,
      instructions: chrome.instructions,
    });
  }, [navGroups, pathname, chrome.home, chrome.instructions]);
  const goToParent = useCallback(() => {
    if (!parentHref) {
      return;
    }
    followHandbookHref(parentHref, pathname, (path) => {
      router.push(path);
    });
  }, [parentHref, pathname, router]);

  return (
    <ConceptTitleHeader
      title={title}
      chrome={chrome}
      showBack={parentHref !== null}
      onBack={goToParent}
      showBookmark
      showShare
    />
  );
}
