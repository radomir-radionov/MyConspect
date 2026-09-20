"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Soft-refreshes RSC when `resources/*.md` changes (fs reads are outside Turbopack HMR). */
export function ResourcesAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const source = new EventSource("/api/dev/resources-refresh");
    source.onmessage = (event) => {
      if (event.data === "refresh") {
        router.refresh();
      }
    };

    return () => {
      source.close();
    };
  }, [router]);

  return null;
}
