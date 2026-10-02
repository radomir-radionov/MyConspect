"use client";

import { usePathname } from "next/navigation";
import { useMemo, useSyncExternalStore } from "react";
import { hashIdFrom } from "@/lib/nav/navUtils";
import {
  getHash,
  getPendingPathname,
  getServerHash,
  getServerPendingPathname,
  handbookLocation,
  subscribeHash,
  subscribePendingPath,
} from "./hash";

export function useHandbookLocation() {
  const pathname = usePathname() ?? "/";
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const pendingPathname = useSyncExternalStore(
    subscribePendingPath,
    getPendingPathname,
    getServerPendingPathname,
  );
  const highlightPathname = pendingPathname || pathname;
  const location = useMemo(
    () => handbookLocation(pathname, hash),
    [pathname, hash, pendingPathname],
  );
  const activeConceptId = hashIdFrom(location.hash);

  return {
    pathname,
    highlightPathname,
    hash,
    location,
    activeConceptId,
  };
}
