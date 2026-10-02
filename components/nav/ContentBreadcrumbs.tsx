"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { HANDBOOK_STICKY_INSET_VAR } from "@/components/topic/conceptScroll";
import { HANDBOOK_MAIN_ID } from "@/constants";
import type { ChromeCopy, NavGroup } from "@/lib/nav";
import { getHash, getServerHash, subscribeHash } from "./hash";
import { crumbsForPath } from "./location";

export function ContentBreadcrumbs({
  groups,
  chrome,
}: {
  groups: readonly NavGroup[];
  chrome: ChromeCopy;
}) {
  const pathname = usePathname() ?? "/";
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const crumbs = crumbsForPath(groups, pathname, hash, {
    home: chrome.home,
    instructions: chrome.instructions,
  });
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const main = document.getElementById(HANDBOOK_MAIN_ID);
    const bar = barRef.current;
    if (!(main instanceof HTMLElement)) {
      return;
    }
    if (!bar) {
      main.style.removeProperty(HANDBOOK_STICKY_INSET_VAR);
      return;
    }
    const sync = () => {
      main.style.setProperty(
        HANDBOOK_STICKY_INSET_VAR,
        `${bar.offsetHeight}px`,
      );
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      main.style.removeProperty(HANDBOOK_STICKY_INSET_VAR);
    };
  }, [pathname, hash]);

  if (crumbs.length < 2) {
    return null;
  }

  return (
    <div
      ref={barRef}
      className="sticky top-0 z-[1] border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex min-w-0 items-center overflow-x-auto overscroll-x-contain py-2 pr-4 pl-4 md:pl-10 sm:pr-6">
        <Breadcrumbs items={crumbs} compact />
      </div>
    </div>
  );
}
