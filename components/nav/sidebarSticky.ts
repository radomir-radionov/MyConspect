"use client";

import { HANDBOOK_NAV_ASIDE_ID, HANDBOOK_SIDEBAR_ID } from "@/constants";

const PATH_ATTR = "data-nav-path";
const TOP_VARS = {
  track: "--nav-sticky-top-track",
  subject: "--nav-sticky-top-subject",
  cluster: "--nav-sticky-top-cluster",
  topic: "--nav-sticky-top-topic",
  "interview-section": "--nav-sticky-top-interview",
  concept: "--nav-sticky-top-concept",
} as const;

/** Guide lines hang under the pinned row of their level, so they start where its child rows do. */
const GUIDE_VARS: Record<string, string | undefined> = {
  track: "--nav-guide-track",
  subject: "--nav-guide-subject",
};

function stickySpacing(nav: Element) {
  const scroller = nav.closest(`#${HANDBOOK_NAV_ASIDE_ID}`) ?? document.getElementById(HANDBOOK_NAV_ASIDE_ID);
  const styles = scroller ? getComputedStyle(scroller) : null;
  return {
    inset: Number.parseFloat(styles?.getPropertyValue("--nav-sticky-inset") ?? "") || 8,
    gap: Number.parseFloat(styles?.getPropertyValue("--nav-sticky-gap") ?? "") || 6,
  };
}

function topVarName(element: HTMLElement) {
  const kind = element.getAttribute("data-nav") ?? element.getAttribute("data-nav-pin");
  switch (kind) {
    case "track":
    case "subject":
    case "cluster":
    case "topic":
    case "interview-section":
      return TOP_VARS[kind];
    default:
      return TOP_VARS.concept;
  }
}

function pathElements(nav: Element) {
  return nav.querySelectorAll<HTMLElement>(`[${PATH_ATTR}="true"], [data-nav-pin]`);
}

export type StickyVars = Readonly<Record<string, string>>;

export function measureStickyPathVars(): StickyVars {
  const nav = document.getElementById(HANDBOOK_SIDEBAR_ID);
  if (!nav) {
    return {};
  }
  const { inset, gap } = stickySpacing(nav);
  const vars: Record<string, string> = {};
  let top = inset;
  for (const element of pathElements(nav)) {
    vars[topVarName(element)] = `${top}px`;
    top += element.offsetHeight + gap;
    const guideVar = GUIDE_VARS[element.getAttribute("data-nav") ?? element.getAttribute("data-nav-pin") ?? ""];
    if (guideVar) {
      vars[guideVar] = `${top}px`;
    }
  }
  vars["--nav-sticky-cover"] = `${measureStickyCover(nav)}px`;
  return vars;
}

/**
 * The cover masks rows scrolling under the pinned path. It may only be as tall
 * as the rows that are pinned right now, otherwise it blanks out rows that are
 * still sitting in normal flow. It ends one gap below the lowest pinned row so
 * scrolling rows never touch it.
 */
export function measureStickyCover(navElement?: HTMLElement): number {
  const nav = navElement ?? document.getElementById(HANDBOOK_SIDEBAR_ID);
  const scroller = document.getElementById(HANDBOOK_NAV_ASIDE_ID);
  if (!nav || !scroller) {
    return 0;
  }
  const { gap } = stickySpacing(nav);
  const scrollerTop = scroller.getBoundingClientRect().top;
  let cover = 0;
  for (const element of pathElements(nav)) {
    const rect = element.getBoundingClientRect();
    const relativeTop = rect.top - scrollerTop;
    const stickyTop = Number.parseFloat(getComputedStyle(element).top) || 0;
    const pinned = relativeTop <= stickyTop + 0.5;
    if (pinned) {
      cover = Math.max(cover, relativeTop + rect.height + gap);
    }
  }
  return Math.max(0, Math.round(cover));
}
