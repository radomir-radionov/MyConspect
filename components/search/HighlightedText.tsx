"use client";

export function HighlightedText({
  text,
  query,
  className,
}: {
  text: string;
  query: string;
  className?: string;
}) {
  const needle = query.trim();
  if (needle.length === 0) {
    return <span className={className}>{text}</span>;
  }

  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === needle.toLowerCase() ? (
          <mark key={`${part}-${index}`} className="rounded-sm bg-amber-100 text-zinc-900 dark:bg-amber-900/50 dark:text-amber-50">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </span>
  );
}
