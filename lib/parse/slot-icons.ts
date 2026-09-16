import type { SlotKind } from "./slots";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function tradeoffLabelHtml(label: string): string {
  return `<h4 class="concept-slot__heading concept-slot__heading--tradeoffs"><span class="concept-slot__badge concept-slot__badge--pro" aria-hidden="true">+</span><span class="concept-slot__title">${escapeHtml(label)}</span><span class="concept-slot__badge concept-slot__badge--con" aria-hidden="true">−</span></h4>`;
}

export function slotLabelHtml(kind: SlotKind, label: string): string {
  if (kind === "intro") {
    return "";
  }
  if (kind === "tradeoffs") {
    return tradeoffLabelHtml(label);
  }
  return `<h4 class="concept-slot__heading"><span class="concept-slot__title">${escapeHtml(label)}</span></h4>`;
}
