"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { dispatchHashChange, takePendingHashForPath } from "../utils/hash";

export function useApplyPendingHash() {
  const pathname = usePathname() ?? "/";

  useLayoutEffect(() => {
    const hash = takePendingHashForPath(pathname);
    if (hash === null) {
      return;
    }
    if (hash === "") {
      if (window.location.pathname !== pathname || !window.location.hash) {
        return;
      }
      window.history.replaceState(
        window.history.state,
        "",
        `${pathname}${window.location.search}`,
      );
      dispatchHashChange();
      return;
    }
    const next = `${pathname}${hash}`;
    if (`${window.location.pathname}${window.location.hash}` !== next) {
      window.history.replaceState(window.history.state, "", next);
    }
    dispatchHashChange();
  }, [pathname]);
}
