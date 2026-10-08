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
  const { showBack, showNext, goBack, goNext } = useHandbookTopicNav({
    conceptOpen: false,
  });

  return (
    <ConceptTitleHeader
      title={title}
      chrome={chrome}
      showBookmark
      showShare
      showBack={showBack}
      showNext={showNext}
      onBack={goBack}
      onNext={goNext}
    />
  );
}
