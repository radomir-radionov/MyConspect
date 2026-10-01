export function preTextContent(pre: HTMLElement): string {
  return pre.textContent?.trim() ?? "";
}
