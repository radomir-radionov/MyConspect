"use client";

import { BODY_QUERY_MIN_LENGTH } from "@/lib/nav";

const MARK_CLASS = "rounded-sm bg-amber-100 text-zinc-900";

export function highlightQueryInHtml(html: string, query: string): string {
  const needle = query.trim();
  if (needle.length < BODY_QUERY_MIN_LENGTH) {
    return html;
  }

  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(escaped, "gi");
  let skipDepth = 0;

  return html.replace(
    /<\/?(pre|code|mark|script|style)\b[^>]*>|[^<]+|<[^>]+>/gi,
    (chunk) => {
      const skipTag = chunk.match(/^<\/?(pre|code|mark|script|style)\b/i);
      if (skipTag) {
        skipDepth += chunk.startsWith("</") ? -1 : 1;
        if (skipDepth < 0) {
          skipDepth = 0;
        }
        return chunk;
      }
      if (skipDepth > 0 || chunk.startsWith("<")) {
        return chunk;
      }
      return chunk.replace(re, (match) => `<mark class="${MARK_CLASS}">${match}</mark>`);
    },
  );
}
