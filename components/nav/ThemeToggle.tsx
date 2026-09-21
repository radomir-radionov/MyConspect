"use client";

import { useSyncExternalStore } from "react";
import {
  resolveTheme,
  subscribeUi,
  writeTheme,
  type ThemePreference,
} from "./uiStorage";

function useResolvedTheme(): ThemePreference {
  return useSyncExternalStore(subscribeUi, resolveTheme, () => "light");
}

export function ThemeToggle() {
  const theme = useResolvedTheme();
  const next: ThemePreference = theme === "dark" ? "light" : "dark";
  const label = next === "dark" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => writeTheme(next)}
      className="inline-flex size-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        fill="currentColor"
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none">
      <circle cx="12" cy="12" r="3.25" fill="currentColor" />
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M12 3.5v2.25M12 18.25V20.5M20.5 12h-2.25M5.75 12H3.5M17.95 6.05l-1.6 1.6M7.65 16.35l-1.6 1.6M17.95 17.95l-1.6-1.6M7.65 7.65l-1.6-1.6"
      />
    </svg>
  );
}

