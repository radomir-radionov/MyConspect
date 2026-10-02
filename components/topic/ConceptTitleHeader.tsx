import type { ChromeCopy } from "@/lib/nav";
import { CopyConceptLinkButton } from "./CopyConceptLinkButton";
import { TopicBookmarkButton } from "./TopicBookmarkButton";

const DETAIL_HEADER =
  "concept-detail-toolbar sticky top-[var(--handbook-sticky-inset,0px)] z-10 flex items-start gap-3 rounded-t-[calc(0.75rem-1px)] border-b border-yellow-200 bg-yellow-50 px-4 py-2.5 dark:border-yellow-800 dark:bg-yellow-950";

const INDEX_HEADER =
  "flex items-start gap-3 border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-800";

const NAV_GROUP_DETAIL =
  "inline-flex shrink-0 overflow-hidden rounded-lg border border-amber-200/80 bg-white/95 shadow-sm ring-1 ring-amber-100/50 dark:border-amber-900/50 dark:bg-zinc-950/95 dark:ring-amber-950/40";

const NAV_GROUP_INDEX =
  "inline-flex shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900";

const NAV_BTN_DETAIL =
  "inline-flex h-8 cursor-pointer items-center gap-1 px-2.5 text-[13px] font-medium text-zinc-700 transition-colors hover:bg-amber-50/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400/60 dark:text-zinc-200 dark:hover:bg-amber-950/50 dark:focus-visible:ring-amber-500/40";

const NAV_BTN_INDEX =
  "inline-flex h-8 cursor-pointer items-center gap-1 px-2.5 text-[13px] font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-400/60 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-500/40";

const NAV_DIVIDER_DETAIL =
  "w-px shrink-0 self-stretch bg-amber-200/80 dark:bg-amber-900/60";

const NAV_DIVIDER_INDEX =
  "w-px shrink-0 self-stretch bg-zinc-200 dark:bg-zinc-700";

const NAV_ICON = "size-3.5 shrink-0 text-zinc-400 dark:text-zinc-500";

const ACTION_DIVIDER_DETAIL =
  "mx-0.5 h-6 w-px shrink-0 bg-amber-200/70 dark:bg-amber-900/50";

const ACTION_DIVIDER_INDEX =
  "mx-0.5 h-6 w-px shrink-0 bg-zinc-200 dark:bg-zinc-700";

function ConceptNavGroup({
  showBack,
  onBack,
  showNext,
  onNext,
  chrome,
  variant,
}: {
  showBack: boolean;
  onBack?: () => void;
  showNext: boolean;
  onNext?: () => void;
  chrome: ChromeCopy;
  variant: "index" | "detail";
}) {
  if (!showBack && !showNext) {
    return null;
  }

  const groupClass = variant === "detail" ? NAV_GROUP_DETAIL : NAV_GROUP_INDEX;
  const btnClass = variant === "detail" ? NAV_BTN_DETAIL : NAV_BTN_INDEX;
  const dividerClass =
    variant === "detail" ? NAV_DIVIDER_DETAIL : NAV_DIVIDER_INDEX;
  const soloRadius = "rounded-[calc(0.5rem-1px)]";
  const startRadius = "rounded-l-[calc(0.5rem-1px)]";
  const endRadius = "rounded-r-[calc(0.5rem-1px)]";

  return (
    <div
      className={groupClass}
      role="group"
      aria-label={`${chrome.back} / ${chrome.next}`}
    >
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className={`${btnClass} ${showNext ? startRadius : soloRadius}`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className={NAV_ICON}>
            <path
              d="M15 18l-6-6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{chrome.back}</span>
        </button>
      ) : null}
      {showBack && showNext ? (
        <span className={dividerClass} aria-hidden="true" />
      ) : null}
      {showNext ? (
        <button
          type="button"
          onClick={onNext}
          className={`${btnClass} ${showBack ? endRadius : soloRadius}`}
        >
          <span>{chrome.next}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className={NAV_ICON}>
            <path
              d="M9 18l6-6-6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

export function ConceptTitleHeader({
  title,
  chrome,
  variant = "index",
  showBack = false,
  onBack,
  showNext = false,
  onNext,
  showBookmark = false,
  showShare = false,
  conceptId,
}: {
  title: string;
  chrome: ChromeCopy;
  variant?: "index" | "detail";
  showBack?: boolean;
  onBack?: () => void;
  showNext?: boolean;
  onNext?: () => void;
  showBookmark?: boolean;
  showShare?: boolean;
  conceptId?: string;
}) {
  const hasActions = showBack || showNext || showBookmark || showShare;

  return (
    <div className={variant === "detail" ? DETAIL_HEADER : INDEX_HEADER}>
      <h2 className="min-w-0 flex-1 text-2xl font-semibold leading-8 tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      {hasActions ? (
        <span className="inline-flex shrink-0 items-center gap-1.5">
          <ConceptNavGroup
            showBack={showBack}
            onBack={onBack}
            showNext={showNext}
            onNext={onNext}
            chrome={chrome}
            variant={variant}
          />
          {showBack || showNext ? (
            showShare || showBookmark ? (
              <span
                className={
                  variant === "detail"
                    ? ACTION_DIVIDER_DETAIL
                    : ACTION_DIVIDER_INDEX
                }
                aria-hidden="true"
              />
            ) : null
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
