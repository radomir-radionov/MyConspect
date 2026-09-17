"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getHash, getServerHash, hashIdFrom, subscribeHash } from "@/components/nav/hash";
import { CHROME, crumbsWithActive, type Crumb, type HashCrumb } from "@/lib/nav";

export function Breadcrumbs({
  items,
  pageHref,
  hashCrumbs = [],
}: {
  items: readonly Crumb[];
  pageHref?: string;
  hashCrumbs?: readonly HashCrumb[];
}) {
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const trail =
    pageHref && hashCrumbs.length > 0
      ? crumbsWithActive(items, pageHref, hashCrumbs, hashIdFrom(hash))
      : items;

  if (trail.length < 2) {
    return null;
  }

  return (
    <nav aria-label={CHROME.breadcrumbs} className="mb-6">
      <ol className="-ml-2 flex flex-wrap items-center gap-x-0.5 gap-y-1 text-sm">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={`${item.label}-${item.href ?? index}`} className="flex items-center gap-x-0.5">
              {index === 0 ? null : (
                <span aria-hidden="true" className="text-zinc-300">
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded-md px-2 py-0.5 font-medium text-zinc-500 transition-colors hover:bg-yellow-50 hover:text-zinc-900"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="rounded-md bg-yellow-50 px-2 py-0.5 font-medium text-zinc-900 ring-1 ring-inset ring-yellow-200"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
