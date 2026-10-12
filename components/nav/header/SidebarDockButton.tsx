"use client";

import type { PointerEvent } from "react";
import { HANDBOOK_SIDEBAR_ID } from "@/constants";

const RAIL_EDGE = "2.5rem";
const OPEN_CENTER = "9.375rem";

export function SidebarDockButton({
  collapsed,
  peeking,
  collapseLabel,
  expandLabel,
  onToggle,
  onPointerLeave,
  className = "",
}: {
  collapsed: boolean;
  peeking: boolean;
  collapseLabel: string;
  expandLabel: string;
  onToggle: () => void;
  onPointerLeave?: (event: PointerEvent<HTMLElement>) => void;
  className?: string;
}) {
  const label = collapsed ? expandLabel : collapseLabel;
  const centered = !collapsed || peeking;

  return (
    <button
      type="button"
      data-sidebar-dock=""
      className={`group absolute bottom-0 z-[100] hidden size-9 -translate-x-1/2 translate-y-1/2 cursor-pointer items-center justify-center transition-[left] duration-200 ease-out motion-reduce:transition-none md:inline-flex ${className}`}
      style={{ left: centered ? OPEN_CENTER : RAIL_EDGE }}
      aria-expanded={!collapsed}
      aria-controls={HANDBOOK_SIDEBAR_ID}
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      onPointerLeave={onPointerLeave}
    >
      <span className="pointer-events-none inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-transparent bg-white text-zinc-600 shadow-sm transition-colors duration-200 ease-out group-hover:border-zinc-400 group-hover:bg-zinc-50 group-hover:text-zinc-900 motion-reduce:transition-none dark:bg-zinc-950 dark:text-zinc-400 dark:group-hover:border-zinc-500 dark:group-hover:bg-zinc-900 dark:group-hover:text-zinc-100">
        <SidebarDockGlyph collapsed={collapsed} />
      </span>
    </button>
  );
}

function SidebarDockGlyph({ collapsed }: { collapsed: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0">
      <path
        d="M5.5 5.5h13A1.5 1.5 0 0 1 20 7v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17V7A1.5 1.5 0 0 1 5.5 5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M9 5.5v13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <g
        className={`transition-transform duration-200 ease-out motion-reduce:transition-none ${
          collapsed ? "rotate-180" : "rotate-0"
        }`}
        style={{ transformOrigin: "14.75px 12px" }}
      >
        <path
          d="M16.5 9.5L13 12l3.5 2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
