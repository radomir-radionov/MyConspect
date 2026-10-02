import type { ChromeCopy } from "@/lib/nav";
import { CopyConceptLinkButton } from "./CopyConceptLinkButton";
import { TopicBookmarkButton } from "./TopicBookmarkButton";

const DETAIL_HEADER =
  "concept-detail-toolbar sticky top-[var(--handbook-sticky-inset,0px)] z-10 flex items-center gap-3 rounded-t-[calc(0.75rem-1px)] border-b border-yellow-200 bg-yellow-50 px-4 py-2.5 dark:border-yellow-800 dark:bg-yellow-950";

const INDEX_HEADER =
  "flex items-center gap-3 border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-800";

const BACK_BUTTON =
  "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-500";

export function ConceptTitleHeader({
  title,
  chrome,
  variant = "index",
  showBack = false,
  onBack,
  showBookmark = false,
  showShare = false,
  conceptId,
}: {
  title: string;
  chrome: ChromeCopy;
  variant?: "index" | "detail";
  showBack?: boolean;
  onBack?: () => void;
  showBookmark?: boolean;
  showShare?: boolean;
  conceptId?: string;
}) {
  const hasActions = showBack || showBookmark || showShare;

  return (
    <div className={variant === "detail" ? DETAIL_HEADER : INDEX_HEADER}>
      <h2 className="min-w-0 flex-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      {hasActions ? (
        <span className="inline-flex shrink-0 items-center gap-1">
          {showBack ? (
            <button type="button" onClick={onBack} className={BACK_BUTTON}>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4 shrink-0"
              >
                <path
                  d="M15 18l-6-6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {chrome.back}
            </button>
          ) : null}
          {showShare ? (
            <CopyConceptLinkButton
              conceptId={conceptId}
              chrome={chrome}
              size="lg"
              concealed={false}
            />
          ) : null}
          {showBookmark ? (
            <TopicBookmarkButton
              title={title}
              chrome={chrome}
              conceptId={conceptId}
            />
          ) : null}
        </span>
      ) : null}
    </div>
  );
}
