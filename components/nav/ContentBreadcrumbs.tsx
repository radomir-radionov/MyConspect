"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
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

  if (crumbs.length < 2) {
    return null;
  }

  return (
    <div className="sticky top-0 z-[1] border-b border-zinc-200 bg-zinc-50/95 backdrop-blur-sm">
      <div className="flex min-w-0 items-center overflow-x-auto overscroll-x-contain py-2 pr-4 pl-4 md:pl-10 sm:pr-6">
        <Breadcrumbs items={crumbs} compact />
      </div>
    </div>
  );
}
