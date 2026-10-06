"use client";

import { HANDBOOK_NAV_ASIDE_ID, HANDBOOK_SIDEBAR_ID } from "@/constants";

const PATH_ATTR = "data-nav-path";
const TOP_VARS = {
  "root-section": "--nav-sticky-top-root-section",
  track: "--nav-sticky-top-track",
  subject: "--nav-sticky-top-subject",
  section: "--nav-sticky-top-section",
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
  const scroller =
    nav.closest(`#${HANDBOOK_NAV_ASIDE_ID}`) ??
    document.getElementById(HANDBOOK_NAV_ASIDE_ID);
  const styles = scroller ? getComputedStyle(scroller) : null;
  return {
    inset:
      Number.parseFloat(styles?.getPropertyValue("--nav-sticky-inset") ?? "") ||
      8,
    gap:
      Number.parseFloat(styles?.getPropertyValue("--nav-sticky-gap") ?? "") ||
      6,
  };
}

function topVarName(element: HTMLElement) {
  const kind =
    element.getAttribute("data-nav") ??
    element.getAttribute("data-nav-pin") ??
    element
      .querySelector<HTMLElement>(":scope > [data-nav]")
      ?.getAttribute("data-nav");
  switch (kind) {
    case "root-section":
    case "track":
    case "subject":
    case "section":
    case "cluster":
    case "topic":
    case "interview-section":
      return TOP_VARS[kind];
    default:
      return TOP_VARS.concept;
  }
}

function pathElements(nav: Element) {
  return nav.querySelectorAll<HTMLElement>(
    `[${PATH_ATTR}="true"], [data-nav-pin]`,
  );
}

export type StickyVars = Readonly<Record<string, string>>;

export function stickyVarsEqual(left: StickyVars, right: StickyVars): boolean {
  const keys = Object.keys(left);
  if (keys.length !== Object.keys(right).length) {
    return false;
  }
  for (const key of keys) {
    if (left[key] !== right[key]) {
      return false;
    }
  }
  return true;
}

type StickyStyleRead = {
  getPropertyValue(name: string): string;
};

type StickyStyle = StickyStyleRead & {
  setProperty(name: string, value: string): void;
  removeProperty(name: string): string;
};

/** Write CSS vars without React state so scroll/measure does not rerender the tree. */
export function writeStickyVars(
  style: StickyStyle,
  next: StickyVars,
  previous: StickyVars,
): StickyVars {
  for (const key of Object.keys(previous)) {
    if (next[key] === undefined) {
      style.removeProperty(key);
    }
  }
  for (const [key, value] of Object.entries(next)) {
    if (style.getPropertyValue(key) !== value) {
      style.setProperty(key, value);
    }
  }
  return next;
}

export function measureStickyPathVars(
  navElement?: HTMLElement | null,
): StickyVars {
  const nav = navElement ?? document.getElementById(HANDBOOK_SIDEBAR_ID);
  if (!nav) {
    return {};
  }
  const { inset, gap } = stickySpacing(nav);
  const vars: Record<string, string> = {};
  let top = inset;
  for (const element of pathElements(nav)) {
    vars[topVarName(element)] = `${top}px`;
    top += element.offsetHeight + gap;
    const guideVar =
      GUIDE_VARS[
        element.getAttribute("data-nav") ??
          element.getAttribute("data-nav-pin") ??
          ""
      ];
    if (guideVar) {
      vars[guideVar] = `${top}px`;
    }
  }
  vars["--nav-sticky-cover"] = `${measureStickyCover(nav, vars)}px`;
  return vars;
}

/**
 * The cover masks rows scrolling under the pinned path. It may only be as tall
 * as the rows that are pinned right now, otherwise it blanks out rows that are
 * still sitting in normal flow. It ends one gap below the lowest pinned row so
 * scrolling rows never touch it.
 */
export function resolveStickyTopPx(
  varName: string,
  vars: StickyVars | undefined,
  scrollerStyle: StickyStyleRead,
): number {
  return (
    Number.parseFloat(vars?.[varName] ?? "") ||
    Number.parseFloat(scrollerStyle.getPropertyValue(varName)) ||
    0
  );
}

function stickyTopPx(
  element: HTMLElement,
  scrollerStyle: StickyStyleRead,
  vars?: StickyVars,
): number {
  return resolveStickyTopPx(topVarName(element), vars, scrollerStyle);
}

export function measureStickyCover(
  navElement?: HTMLElement,
  vars?: StickyVars,
): number {
  const nav = navElement ?? document.getElementById(HANDBOOK_SIDEBAR_ID);
  const scroller = document.getElementById(HANDBOOK_NAV_ASIDE_ID);
  if (!nav || !scroller) {
    return 0;
  }
  const scrollerStyle = getComputedStyle(scroller);
  const { gap } = stickySpacing(nav);
  const scrollerTop = scroller.getBoundingClientRect().top;
  let cover = 0;
  for (const element of pathElements(nav)) {
    const rect = element.getBoundingClientRect();
    const relativeTop = rect.top - scrollerTop;
    const pinned =
      relativeTop <= stickyTopPx(element, scrollerStyle, vars) + 0.5;
    if (pinned) {
      cover = Math.max(cover, relativeTop + rect.height + gap);
    }
  }
  return Math.max(0, Math.round(cover));
}
