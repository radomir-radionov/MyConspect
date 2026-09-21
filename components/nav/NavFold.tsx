"use client";

import { useEffect, useLayoutEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { NAV_FOLD_MS } from "@/constants";

let reducedMotionQuery: MediaQueryList | null = null;

function media() {
  reducedMotionQuery ??= window.matchMedia("(prefers-reduced-motion: reduce)");
  return reducedMotionQuery;
}

function subscribeReducedMotion(onStoreChange: () => void) {
  const query = media();
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function getReducedMotion() {
  return media().matches;
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
}

const FOLD_GRID =
  "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none";
const FOLD_INNER =
  "min-h-0 transition-opacity duration-200 ease-out motion-reduce:transition-none";

export function NavFold({
  open,
  instant = false,
  unbox = false,
  children,
}: {
  open: boolean;
  instant?: boolean;
  /** When fully open, render children without a box so nested sticky can span siblings. */
  unbox?: boolean;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const skipMotion = instant || reducedMotion;
  const [mounted, setMounted] = useState(open);
  const [expanded, setExpanded] = useState(open);

  if (open && !mounted) {
    setMounted(true);
  }
  if (open && skipMotion && !expanded) {
    setExpanded(true);
  }
  if (!open && expanded) {
    setExpanded(false);
  }
  if (!open && skipMotion && mounted) {
    setMounted(false);
  }

  useLayoutEffect(() => {
    if (!open || skipMotion || expanded) {
      return;
    }
    let inner = 0;
    const frame = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setExpanded(true));
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(inner);
    };
  }, [open, skipMotion, expanded]);

  useEffect(() => {
    if (open || skipMotion) {
      return;
    }
    const timeout = window.setTimeout(() => setMounted(false), NAV_FOLD_MS);
    return () => window.clearTimeout(timeout);
  }, [open, skipMotion]);

  if (!mounted) {
    return null;
  }

  if (unbox && expanded) {
    return <>{children}</>;
  }

  return (
    <div className={`${FOLD_GRID} ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
      <div
        className={`${FOLD_INNER} ${expanded ? "overflow-visible opacity-100" : "overflow-hidden opacity-0"}`}
        inert={!expanded}
      >
        {children}
      </div>
    </div>
  );
}

export function NavChevron({ open, large = false }: { open: boolean; large?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 origin-center leading-none text-zinc-500 transition-transform duration-200 ease-out motion-reduce:transition-none ${open ? "rotate-90" : "rotate-0"} ${large ? "text-lg" : "text-base"}`}
    >
      ▸
    </span>
  );
}
