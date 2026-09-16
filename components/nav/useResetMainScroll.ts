"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useResetMainScroll() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    if (window.location.hash) {
      return;
    }
    const main = document.getElementById("handbook-main");
    if (main instanceof HTMLElement) {
      main.scrollTop = 0;
    }
  }, [pathname]);
}
