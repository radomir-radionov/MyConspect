"use client";

import { ConceptTitleHeader } from "./ConceptTitleHeader";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { chromeFor } from "@/lib/i18n/chrome";
import { localeFromPathname } from "@/lib/i18n/paths";

export function PageTitleHeader({ title }: { title: string }) {
  const pathname = usePathname() ?? "/en";
  const chrome = useMemo(
    () => chromeFor(localeFromPathname(pathname)),
    [pathname],
  );
  return (
    <ConceptTitleHeader
      title={title}
      chrome={chrome}
      showBookmark
      showShare
    />
  );
}
