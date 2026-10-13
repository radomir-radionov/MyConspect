"use client";

import type { ChromeCopy, NavRootSection } from "@/lib/nav";
import { BookmarksPanel } from "./BookmarksPanel";
import { SectionSwitcher } from "./SectionSwitcher";

export function SidebarNavChrome({
  sections,
  chrome,
  onNavigate,
  className = "",
}: {
  sections: readonly NavRootSection[];
  chrome: ChromeCopy;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <div
      data-nav-chrome=""
      className={`bg-(--chrome-surface) px-2 pt-3 ${className}`}
    >
      <div className="mb-3 px-2">
        <SectionSwitcher sections={sections} chrome={chrome} />
      </div>
      <BookmarksPanel chrome={chrome} onNavigate={onNavigate} />
    </div>
  );
}
