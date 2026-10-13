"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HANDBOOK_MAIN_ID } from "@/constants";

const SCROLL_THRESHOLD = 240;

export function ScrollToTopButton({ label }: { label: string }) {
  const pathname = usePathname() ?? "/";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const main = document.getElementById(HANDBOOK_MAIN_ID);
    if (!(main instanceof HTMLElement)) {
      return;
    }

    const onScroll = () => {
      setVisible(main.scrollTop > SCROLL_THRESHOLD);
    };

    onScroll();
    main.addEventListener("scroll", onScroll, { passive: true });
    return () => main.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const scrollToTop = useCallback(() => {
    const main = document.getElementById(HANDBOOK_MAIN_ID);
    if (main instanceof HTMLElement) {
      main.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={scrollToTop}
      className={
        visible
          ? "handbook-scroll-top fixed right-3 z-40 inline-flex size-10 translate-y-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-[opacity,transform] duration-200 ease-out hover:bg-zinc-50 hover:text-zinc-900 motion-reduce:transition-none max-sm:bottom-[calc(var(--handbook-concept-dock-h,0px)+0.5rem)] sm:bottom-4 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          : "handbook-scroll-top pointer-events-none fixed right-3 z-40 inline-flex size-10 translate-y-2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 opacity-0 shadow-sm transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none max-sm:bottom-[calc(var(--handbook-concept-dock-h,0px)+0.5rem)] sm:bottom-4 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
      }
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="size-5"
      >
        <path
          d="M10 4v9M10 4 6.5 7.5M10 4l3.5 3.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
