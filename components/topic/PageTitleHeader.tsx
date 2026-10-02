"use client";

import { ConceptTitleHeader } from "./ConceptTitleHeader";
import { useHandbookTopicNav } from "./useHandbookTopicNav";
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
  const { showBack, goBack } = useHandbookTopicNav();

  return (
    <ConceptTitleHeader
      title={title}
      chrome={chrome}
      showBack={showBack}
      onBack={goBack}
      showBookmark
      showShare
    />
  );
}
