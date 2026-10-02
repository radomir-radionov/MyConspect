"use client";

import { CopyConceptLinkButton } from "./CopyConceptLinkButton";
import type { ChromeCopy } from "@/lib/nav";

export function TopicShareButton({ chrome }: { chrome: ChromeCopy }) {
  return <CopyConceptLinkButton chrome={chrome} size="lg" concealed={false} />;
}
