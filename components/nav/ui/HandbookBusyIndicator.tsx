"use client";

type HandbookBusyIndicatorProps = {
  busy: boolean;
  label: string;
};

export function HandbookBusyIndicator({
  busy,
  label,
}: HandbookBusyIndicatorProps) {
  if (!busy) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[60] h-0.5 overflow-hidden bg-zinc-200 dark:bg-zinc-800"
    >
      <div className="handbook-busy-bar h-full w-1/3 bg-amber-500 dark:bg-amber-400" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
