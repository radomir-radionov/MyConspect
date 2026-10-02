"use client";

import { usePathname } from "next/navigation";
import { BookmarkButton } from "@/components/nav/BookmarkButton";
import type { ChromeCopy } from "@/lib/nav";

export function TopicBookmarkButton({
  title,
  chrome,
  conceptId,
}: {
  title: string;
  chrome: ChromeCopy;
  conceptId?: string;
}) {
  const pathname = usePathname() ?? "/";

  return (
    <BookmarkButton
      pathname={pathname}
      title={title}
      conceptId={conceptId}
      chrome={chrome}
      size="lg"
    />
  );
}
