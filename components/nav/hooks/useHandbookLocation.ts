"use client";

import { usePathname } from "next/navigation";
import { useMemo, useSyncExternalStore } from "react";
import { hashIdFrom } from "@/lib/nav/navUtils";
import {
  getHash,
  getPendingHash,
  getPendingPathname,
  getServerHash,
  getServerPendingHash,
  getServerPendingPathname,
  handbookLocation,
  subscribeHash,
  subscribePendingPath,
} from "../utils/hash";

export function useHandbookLocation() {
  const pathname = usePathname() ?? "/";
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const pendingPathname = useSyncExternalStore(
    subscribePendingPath,
    getPendingPathname,
    getServerPendingPathname,
  );
  const pendingHash = useSyncExternalStore(
    subscribePendingPath,
    getPendingHash,
    getServerPendingHash,
  );
  const highlightPathname = pendingPathname || pathname;
  const location = useMemo(() => {
    if (pendingPathname) {
      return { pathname: pendingPathname, hash: pendingHash };
    }
    return handbookLocation(pathname, hash);
  }, [pathname, hash, pendingPathname, pendingHash]);
  const activeConceptId = hashIdFrom(location.hash);

  return {
    pathname,
    highlightPathname,
    hash,
    location,
    activeConceptId,
  };
}
