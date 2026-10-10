"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isDevResourcesRefreshEnabled } from "@/lib/dev/shared";
import { subscribeResourcesRefresh } from "../utils/resourcesRefresh";

/** Soft-refreshes RSC when `resources/*.md` changes (fs reads are outside Turbopack HMR). */
export function useResourcesAutoRefresh(): void {
  const router = useRouter();

  useEffect(() => {
    if (!isDevResourcesRefreshEnabled()) {
      return;
    }
    return subscribeResourcesRefresh(() => {
      router.refresh();
    });
  }, [router]);
}
