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

export function measureNavChromeInset(navElement?: HTMLElement | null): number {
  if (navElement === null) {
    return 0;
  }
  const nav = navElement ?? document.getElementById(HANDBOOK_SIDEBAR_ID);
  if (!nav) {
    return 0;
  }
  const chrome = nav.querySelector<HTMLElement>("[data-nav-chrome]");
  if (!chrome) {
    return 0;
  }
  return Math.max(0, Math.round(chrome.offsetHeight));
}

export function measureStickyPathVars(
  navElement?: HTMLElement | null,
): StickyVars {
  const nav = navElement ?? document.getElementById(HANDBOOK_SIDEBAR_ID);
  if (!nav) {
    return {};
  }
  const inset = measureNavChromeInset(nav);
  const { gap } = stickySpacing(nav);
  const vars: Record<string, string> = { "--nav-sticky-inset": `${inset}px` };
  // Same gap as between pinned rows, so the first item does not sit on the chrome.
  let top = inset + gap;
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
 * still sitting in normal flow. It ends one gap below the lowest pinned row.
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

/**
 * Viewport Y where the pinned path ends: last path row's sticky top, its height,
 * and the same gap used between pinned rows.
 */
export function stickyStackBottomPx(
  nav: HTMLElement,
  scroller: HTMLElement,
): number {
  const paths = pathElements(nav);
  const last = paths[paths.length - 1];
  if (!last) {
    return scroller.getBoundingClientRect().top;
  }
  const top = resolveStickyTopPx(
    topVarName(last),
    undefined,
    getComputedStyle(scroller),
  );
  const { gap } = stickySpacing(nav);
  return scroller.getBoundingClientRect().top + top + last.offsetHeight + gap;
}

/** True when the next track would scroll into the pinned path stack. */
export function shouldReleaseStickyScope(
  nextTrackTop: number,
  stickyBottom: number,
): boolean {
  return nextTrackTop <= stickyBottom + 2;
}

/**
 * Slide the pinned path up with the scroll once the next first-tier track
 * reaches it, so Frontend/HTML/Core leave with their track instead of vanishing
 * or staying on top of Backend.
 */
export function syncStickyScopeRelease(
  navElement?: HTMLElement | null,
): number {
  const nav = navElement ?? document.getElementById(HANDBOOK_SIDEBAR_ID);
  const scroller = document.getElementById(HANDBOOK_NAV_ASIDE_ID);
  if (!nav || !scroller) {
    return 0;
  }
  const scope = nav.querySelector<HTMLElement>("[data-nav-sticky-scope]");
  const nextHeader = scope?.nextElementSibling?.querySelector<HTMLElement>(
    '[data-nav="track"], [data-nav="root-section"]',
  );
  const overflow =
    scope && nextHeader
      ? Math.max(
          0,
          stickyStackBottomPx(nav, scroller) -
            nextHeader.getBoundingClientRect().top,
        )
      : 0;
  const shift = overflow > 0 ? `translateY(-${overflow}px)` : "";
  for (const element of pathElements(nav)) {
    if (element.style.transform !== shift) {
      element.style.transform = shift;
    }
  }
  for (const guide of nav.querySelectorAll<HTMLElement>("[data-nav-guide]")) {
    if (guide.style.transform !== shift) {
      guide.style.transform = shift;
    }
  }
  if (overflow > 0) {
    scroller.setAttribute("data-nav-sticky-sliding", "");
  } else {
    scroller.removeAttribute("data-nav-sticky-sliding");
  }
  return overflow;
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
  const scrollerTop = scroller.getBoundingClientRect().top;
  const { gap } = stickySpacing(nav);
  let cover = 0;
  for (const element of pathElements(nav)) {
    const rect = element.getBoundingClientRect();
    const relativeTop = rect.top - scrollerTop;
    const stickyTop = stickyTopPx(element, scrollerStyle, vars);
    const pinned = relativeTop <= stickyTop + 0.5;
    if (pinned) {
      const shifted = element.style.transform.includes("translateY");
      const bottom = shifted
        ? relativeTop + rect.height
        : Math.max(relativeTop + rect.height, stickyTop + rect.height);
      cover = Math.max(cover, bottom);
    }
  }
  if (cover > 0) {
    cover += gap;
  }
  return Math.max(0, Math.round(cover));
}
