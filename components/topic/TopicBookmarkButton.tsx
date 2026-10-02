"use client";

import { usePathname } from "next/navigation";
import { BookmarkButton } from "@/components/nav/BookmarkButton";
import type { ChromeCopy } from "@/lib/nav";

export function TopicBookmarkButton({
  title,
  chrome,
}: {
  title: string;
  chrome: ChromeCopy;
}) {
  const pathname = usePathname() ?? "/";

  return (
    <BookmarkButton
      pathname={pathname}
      title={title}
      chrome={chrome}
      size="lg"
    />
  );
}
