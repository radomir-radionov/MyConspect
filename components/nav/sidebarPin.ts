import { HANDBOOK_NAV_ASIDE_ID, HANDBOOK_SIDEBAR_ID, SIDEBAR_PIN_HOLD_MS } from "@/constants";

type SidebarPin = {
  element: HTMLElement;
  nav: string;
  id: string;
  top: number;
};

let sidebarPin: SidebarPin | null = null;
let pinCleanup: (() => void) | null = null;
let restoringPin = false;

export function navAside() {
  const scroller = document.getElementById(HANDBOOK_NAV_ASIDE_ID);
  return scroller instanceof HTMLElement ? scroller : null;
}

export function scrollSidebarHit(hit: HTMLElement) {
  const scroller = navAside();
  if (!scroller) {
    return;
  }
  const scrollerBox = scroller.getBoundingClientRect();
  const hitBox = hit.getBoundingClientRect();
  if (hitBox.top < scrollerBox.top || hitBox.bottom > scrollerBox.bottom) {
    hit.scrollIntoView({ block: "nearest" });
  }
}

function pinTarget(pin: SidebarPin) {
  if (pin.element.isConnected) {
    return pin.element;
  }
  const element = document.querySelector(
    `#${HANDBOOK_SIDEBAR_ID} [data-nav="${pin.nav}"][data-nav-id="${pin.id}"]`,
  );
  return element instanceof HTMLElement ? element : null;
}

export function restoreSidebarPin() {
  const pin = sidebarPin;
  const scroller = navAside();
  if (!pin || !scroller || restoringPin) {
    return;
  }
  const element = pinTarget(pin);
  if (!element) {
    return;
  }
  const delta = element.getBoundingClientRect().top - pin.top;
  if (Math.abs(delta) < 1) {
    return;
  }
  restoringPin = true;
  scroller.scrollTop += delta;
  restoringPin = false;
}

export function pinNavElement(element: HTMLElement) {
  const nav = element.getAttribute("data-nav");
  const id = element.getAttribute("data-nav-id");
  const scroller = navAside() ?? element.closest(`#${HANDBOOK_NAV_ASIDE_ID}`);
  if (!nav || !id || !(scroller instanceof HTMLElement)) {
    return;
  }
  pinCleanup?.();
  sidebarPin = {
    element,
    nav,
    id,
    top: element.getBoundingClientRect().top,
  };
  const timeout = window.setTimeout(() => {
    pinCleanup?.();
  }, SIDEBAR_PIN_HOLD_MS);
  pinCleanup = () => {
    window.clearTimeout(timeout);
    sidebarPin = null;
    pinCleanup = null;
  };
}
