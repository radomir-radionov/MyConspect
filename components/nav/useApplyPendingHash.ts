"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { HANDBOOK_MAIN_ID } from "@/constants";
import { dispatchHashChange, hashIdFrom, takePendingHashForPath } from "./hash";

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
    const id = hashIdFrom(hash);
    if (!id) {
      return;
    }
    const main = document.getElementById(HANDBOOK_MAIN_ID);
    const target = main?.querySelector(`#${CSS.escape(id)}`);
    if (!(main instanceof HTMLElement) || !(target instanceof HTMLElement)) {
      return;
    }
    const offset =
      target.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop;
    main.scrollTo({ top: Math.max(0, offset) });
  }, [pathname]);
}
