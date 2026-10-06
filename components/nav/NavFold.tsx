"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { NAV_FOLD_OPEN_MS } from "@/constants";

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
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
}

const FOLD_GRID =
  "grid transition-[grid-template-rows] ease-out motion-reduce:transition-none";
const FOLD_INNER = "min-h-0 overflow-hidden";
/** Contain `display: contents` nav lists during the open animation. */
const FOLD_BODY = "block min-h-0";

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
  const gridRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(() => open || skipMotion);
  const [prevOpen, setPrevOpen] = useState(open);

  // NavFold stays mounted while closed (`return null`), so expanded can stay false
  // across open/close cycles. Sync on the transition so the first open does not
  // flash an empty 0fr grid before children paint.
  if (open !== prevOpen) {
    setPrevOpen(open);
    setExpanded(open || skipMotion);
  }

  useLayoutEffect(() => {
    if (!open || unbox || skipMotion || expanded) {
      return;
    }
    setExpanded(true);
  }, [open, unbox, skipMotion, expanded]);

  if (!open) {
    return null;
  }

  if (unbox || skipMotion) {
    return <>{children}</>;
  }

  const foldStyle: CSSProperties = {
    transitionDuration: expanded ? `${NAV_FOLD_OPEN_MS}ms` : "0ms",
    transitionTimingFunction: "ease-out",
  };

  return (
    <div
      ref={gridRef}
      style={foldStyle}
      className={`${FOLD_GRID} ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
    >
      <div className={FOLD_INNER} inert={!expanded}>
        <div className={FOLD_BODY}>{children}</div>
      </div>
    </div>
  );
}

export function NavChevron({
  open,
  large = false,
}: {
  open: boolean;
  large?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        transitionDuration: open ? `${NAV_FOLD_OPEN_MS}ms` : "0ms",
      }}
      className={`inline-block shrink-0 origin-center leading-none text-zinc-500 transition-transform ease-out motion-reduce:transition-none dark:text-zinc-400 ${open ? "rotate-90" : "rotate-0"} ${large ? "text-lg" : "text-base"}`}
    >
      ▸
    </span>
  );
}
