"use client";

import { useEffect, type RefObject } from "react";
import { copyText } from "@/lib/clipboard";
import type { ChromeCopy } from "@/lib/nav";
import { preTextContent } from "../utils/codeText";

const COPIED_MS = 2000;

function createCopyButton(
  chrome: ChromeCopy,
  getText: () => string,
  className: string,
): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.setAttribute("aria-label", chrome.copyCode);
  button.title = chrome.copyCode;
  button.textContent = chrome.copyCode;

  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const ok = await copyText(getText());
    if (!ok) {
      return;
    }
    button.textContent = chrome.copiedLink;
    button.setAttribute("aria-label", chrome.copiedLink);
    button.title = chrome.copiedLink;
    window.setTimeout(() => {
      button.textContent = chrome.copyCode;
      button.setAttribute("aria-label", chrome.copyCode);
      button.title = chrome.copyCode;
    }, COPIED_MS);
  });

  return button;
}

function enhanceMdCodeBlocks(root: HTMLElement, chrome: ChromeCopy) {
  for (const block of root.querySelectorAll(
    ".md-code:not([data-copy-ready])",
  )) {
    if (!(block instanceof HTMLElement)) {
      continue;
    }
    const meta = block.querySelector(".md-code__meta");
    const pre = block.querySelector("pre");
    if (!(meta instanceof HTMLElement) || !(pre instanceof HTMLElement)) {
      continue;
    }
    const button = createCopyButton(
      chrome,
      () => preTextContent(pre),
      "md-code__copy",
    );
    meta.appendChild(button);
    block.setAttribute("data-copy-ready", "");
  }
}

function enhanceStandalonePreBlocks(root: HTMLElement, chrome: ChromeCopy) {
  for (const pre of root.querySelectorAll("pre:not([data-copy-ready])")) {
    if (!(pre instanceof HTMLElement)) {
      continue;
    }
    if (pre.closest(".md-code")) {
      continue;
    }
    const button = createCopyButton(
      chrome,
      () => preTextContent(pre),
      "concept-pre__copy",
    );
    pre.insertAdjacentElement("beforebegin", button);
    pre.setAttribute("data-copy-ready", "");
  }
}

export function useCodeCopyButtons(
  containerRef: RefObject<HTMLElement | null>,
  chrome: ChromeCopy,
  html: string,
) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) {
      return;
    }
    enhanceMdCodeBlocks(root, chrome);
    enhanceStandalonePreBlocks(root, chrome);
  }, [chrome, containerRef, html]);
}
