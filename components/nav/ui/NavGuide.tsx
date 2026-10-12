/**
 * Redraws a nested list's left guide line across the band covered by the
 * pinned path, so the line stays continuous while the sidebar scrolls.
 */
export function NavGuide({ level }: { level: "track" | "subject" }) {
  return <li aria-hidden="true" data-nav-guide={level} />;
}
