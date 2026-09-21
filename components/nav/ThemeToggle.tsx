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
        d="M12.1 2.1a.75.75 0 0 1 .64.9 8.25 8.25 0 1 0 8.26 8.26.75.75 0 0 1 .9.64A9.75 9.75 0 1 1 12.1 2.1Z"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        fill="currentColor"
        d="M12 4.25a.75.75 0 0 1 .75.75v1.25a.75.75 0 0 1-1.5 0V5a.75.75 0 0 1 .75-.75Zm0 12a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Zm7-3.25a.75.75 0 0 1-.75.75h-1.25a.75.75 0 0 1 0-1.5H18a.75.75 0 0 1 .75.75ZM6.75 12a.75.75 0 0 1-.75.75H4.75a.75.75 0 0 1 0-1.5H6a.75.75 0 0 1 .75.75Zm10.72-5.47a.75.75 0 0 1 0 1.06l-.88.88a.75.75 0 1 1-1.06-1.06l.88-.88a.75.75 0 0 1 1.06 0ZM8.47 15.53a.75.75 0 0 1 0 1.06l-.88.88a.75.75 0 1 1-1.06-1.06l.88-.88a.75.75 0 0 1 1.06 0Zm9.78 1.94a.75.75 0 0 1-1.06 0l-.88-.88a.75.75 0 1 1 1.06-1.06l.88.88a.75.75 0 0 1 0 1.06ZM7.41 7.59a.75.75 0 0 1-1.06 0l-.88-.88a.75.75 0 0 1 1.06-1.06l.88.88a.75.75 0 0 1 0 1.06Z"
      />
    </svg>
  );
}
