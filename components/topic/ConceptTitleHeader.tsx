import type { ChromeCopy } from "@/lib/nav";
import { CopyConceptLinkButton } from "./CopyConceptLinkButton";
import { TopicBookmarkButton } from "./TopicBookmarkButton";

const DETAIL_HEADER =
  "concept-detail-toolbar sticky top-[var(--handbook-sticky-inset,0px)] z-10 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-2 rounded-t-[calc(0.75rem-1px)] border-b border-yellow-200 bg-yellow-50 px-4 py-2.5 sm:gap-x-3 dark:border-yellow-800 dark:bg-yellow-950";

const INDEX_HEADER =
  "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-2 border-b border-zinc-200 px-4 py-2.5 sm:gap-x-3 dark:border-zinc-800";

const NAV_GROUP = "inline-flex shrink-0 items-center gap-1";

const NAV_BTN_DETAIL =
  "inline-flex size-11 touch-manipulation cursor-pointer items-center justify-center gap-1 rounded-full border border-amber-200/80 bg-white/95 px-0 text-[13px] font-medium text-zinc-700 shadow-sm ring-1 ring-amber-100/50 transition-colors hover:bg-amber-50/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 sm:h-8 sm:min-h-8 sm:w-auto sm:min-w-0 sm:rounded-md sm:px-2.5 dark:border-amber-900/50 dark:bg-zinc-950/95 dark:text-zinc-200 dark:ring-amber-950/40 dark:hover:bg-amber-950/50 dark:focus-visible:ring-amber-500/40";

const NAV_BTN_INDEX =
  "inline-flex size-11 touch-manipulation cursor-pointer items-center justify-center gap-1 rounded-full border border-zinc-200 bg-white px-0 text-[13px] font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 sm:h-8 sm:min-h-8 sm:w-auto sm:min-w-0 sm:rounded-md sm:px-2.5 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-500/40";

const NAV_ICON =
  "size-4 shrink-0 text-zinc-500 sm:size-3.5 sm:text-zinc-400 dark:text-zinc-400 sm:dark:text-zinc-500";

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

  const btnClass = variant === "detail" ? NAV_BTN_DETAIL : NAV_BTN_INDEX;

  return (
    <div
      className={NAV_GROUP}
      role="group"
      aria-label={`${chrome.back} / ${chrome.next}`}
    >
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label={chrome.back}
          className={btnClass}
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
          <span className="hidden sm:inline">{chrome.back}</span>
        </button>
      ) : null}
      {showNext ? (
        <button
          type="button"
          onClick={onNext}
          aria-label={chrome.next}
          className={btnClass}
        >
          <span className="hidden sm:inline">{chrome.next}</span>
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
      {variant === "detail" ? (
        <h2 className="col-start-1 row-start-1 min-w-0 break-words text-2xl font-semibold leading-8 tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
      ) : (
        <h1 className="col-start-1 row-start-1 min-w-0 break-words text-2xl font-semibold leading-8 tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
      )}
      {hasActions ? (
        <span className="col-start-2 row-start-1 inline-flex shrink-0 items-center justify-end justify-self-end gap-1.5">
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
