"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { dispatchHashChange, takePendingHashForPath } from "./hash";

export function useApplyPendingHash() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    const hash = takePendingHashForPath(pathname);
    if (hash === null) {
      return;
    }
    const next = `${pathname}${hash}`;
    if (`${window.location.pathname}${window.location.hash}` !== next) {
      window.history.replaceState(window.history.state, "", next);
    }
    dispatchHashChange();
  }, [pathname]);
}
