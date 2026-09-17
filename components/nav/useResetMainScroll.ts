"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { HANDBOOK_MAIN_ID } from "@/constants";

export function useResetMainScroll() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    if (window.location.hash) {
      return;
    }
    const main = document.getElementById(HANDBOOK_MAIN_ID);
    if (main instanceof HTMLElement) {
      main.scrollTop = 0;
    }
  }, [pathname]);
}
