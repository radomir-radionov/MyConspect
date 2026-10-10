"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { chromeFor } from "@/lib/i18n/chrome";
import { localeFromPathname } from "@/lib/i18n/paths";
import { ConceptTitleHeader } from "./ConceptTitleHeader";

export function PageTitleHeader({ title }: { title: string }) {
  const pathname = usePathname() ?? "/en";
  const chrome = useMemo(
    () => chromeFor(localeFromPathname(pathname)),
    [pathname],
  );

  return (
    <ConceptTitleHeader title={title} chrome={chrome} showBookmark showShare />
  );
}
