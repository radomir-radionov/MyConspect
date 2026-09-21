"use client";

import type { PointerEvent } from "react";
import { HANDBOOK_SIDEBAR_ID } from "@/constants";

export function SidebarDockButton({
  collapsed,
  rail,
  collapseLabel,
  expandLabel,
  onToggle,
  onPointerEnter,
  onPointerLeave,
}: {
  collapsed: boolean;
  rail: boolean;
  collapseLabel: string;
  expandLabel: string;
  onToggle: () => void;
  onPointerEnter: (event: PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
}) {
  const label = collapsed ? expandLabel : collapseLabel;

  return (
    <button
      type="button"
      data-sidebar-dock=""
      className={
        rail
          ? "group absolute top-full left-0 z-50 hidden h-10 w-10 cursor-pointer items-center justify-center md:flex"
          : "group absolute bottom-0 left-40 z-50 hidden size-9 -translate-x-1/2 translate-y-1/2 cursor-pointer items-center justify-center md:inline-flex"
      }
      aria-expanded={!collapsed}
      aria-controls={HANDBOOK_SIDEBAR_ID}
      aria-label={label}
      title={label}
      onClick={onToggle}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <span
        className={
          rail
            ? "inline-flex h-full w-full items-center justify-center rounded-none border-r border-zinc-200 bg-white text-zinc-600 transition-colors duration-200 ease-out group-hover:bg-zinc-50 group-hover:text-zinc-900 motion-reduce:transition-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:group-hover:bg-zinc-900 dark:group-hover:text-zinc-100"
            : "inline-flex size-7 items-center justify-center rounded-md border border-transparent bg-white text-zinc-600 shadow-sm transition-colors duration-200 ease-out group-hover:border-zinc-400 group-hover:bg-zinc-50 group-hover:text-zinc-900 motion-reduce:transition-none dark:bg-zinc-950 dark:text-zinc-400 dark:group-hover:border-zinc-500 dark:group-hover:bg-zinc-900 dark:group-hover:text-zinc-100"
        }
      >
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
      <path d="M9 5.5v13" fill="none" stroke="currentColor" strokeWidth="1.75" />
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
