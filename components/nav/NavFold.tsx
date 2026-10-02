"use client";

import {
  useEffect,
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
  const [settled, setSettled] = useState(() => open || skipMotion);

  if (open) {
    if (skipMotion) {
      if (!expanded) {
        setExpanded(true);
      }
      if (!settled) {
        setSettled(true);
      }
    } else if (settled && !expanded) {
      setSettled(false);
    }
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
    const node = gridRef.current;
    if (!open || !node || skipMotion || !expanded) {
      return;
    }
    const finish = (event: TransitionEvent) => {
      if (
        event.target !== node ||
        event.propertyName !== "grid-template-rows"
      ) {
        return;
      }
      setSettled(true);
    };
    node.addEventListener("transitionend", finish);
    const timeout = window.setTimeout(
      () => setSettled(true),
      NAV_FOLD_OPEN_MS + 40,
    );
    return () => {
      node.removeEventListener("transitionend", finish);
      window.clearTimeout(timeout);
    };
  }, [open, skipMotion, expanded]);

  if (!open) {
    return null;
  }

  if (unbox && expanded && settled) {
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
