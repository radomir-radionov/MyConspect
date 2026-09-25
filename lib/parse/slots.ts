import { escapeHtml, slotLabelHtml } from "./slot-icons";
import { transformProsConsTables } from "./pros-cons";

export type SlotKind =
  | "definition"
  | "how"
  | "cases"
  | "tradeoffs"
  | "example"
  | "thoughts"
  | "sources"
  | "pitfalls"
  | "intro"
  | "extra";

type MarkerMatch = {
  readonly index: number;
  readonly length: number;
  readonly rawLabel: string;
  readonly inline: string;
  readonly kind: SlotKind;
};

const SLOT_DISPLAY: Record<
  Exclude<SlotKind, "intro" | "extra" | "pitfalls">,
  string
> = {
  definition: "Definition",
  how: "How it works",
  cases: "When to use",
  tradeoffs: "Pluses and minuses",
  example: "Examples",
  thoughts: "Thoughts",
  sources: "Sources",
};

const SLOT_ORDER: Record<SlotKind, number> = {
  intro: 0,
  definition: 10,
  how: 20,
  cases: 30,
  pitfalls: 35,
  tradeoffs: 40,
  example: 50,
  thoughts: 60,
  extra: 65,
  sources: 70,
};

// Notes use `**Label:**` (colon before closing bold), not `**Label**:`
const MARKER_LINE_RE = /^\*\*([^*\n]+):\*\*\s*(.*)$/;

function normalizeLabel(raw: string): string {
  return raw
    .replace(/\s+—.*$/u, "")
    .trim()
    .toLowerCase();
}

function isSkippedSlot(rawLabel: string): boolean {
  const label = normalizeLabel(rawLabel);
  return label === "see also" || label === "related";
}

function classifyMarker(rawLabel: string): SlotKind {
  const label = normalizeLabel(rawLabel);
  if (label === "definition") {
    return "definition";
  }
  if (label === "how it works") {
    return "how";
  }
  if (
    label === "cases" ||
    label === "when to use" ||
    label.startsWith("when not to use")
  ) {
    return "cases";
  }
  if (
    label === "example" ||
    label === "examples" ||
    label.startsWith("example")
  ) {
    return "example";
  }
  if (label.includes("pitfall")) {
    return "pitfalls";
  }
  if (label === "thoughts" || label === "key idea") {
    return "thoughts";
  }
  if (label === "source" || label === "sources") {
    return "sources";
  }
  if (
    label === "pros" ||
    label === "cons" ||
    label.startsWith("pros ") ||
    label.startsWith("cons ") ||
    label.includes("pros & cons") ||
    label.includes("pros and cons") ||
    label.includes("pluses and minuses") ||
    label.includes("pluses & minuses")
  ) {
    return "tradeoffs";
  }
  return "extra";
}

function displayLabel(kind: SlotKind, rawLabel: string): string {
  if (kind === "intro" || kind === "extra" || kind === "pitfalls") {
    return stripMdLabel(rawLabel);
  }
  if (
    kind === "cases" &&
    normalizeLabel(rawLabel).startsWith("when not to use")
  ) {
    return "When not to use";
  }
  return (
    SLOT_DISPLAY[kind as keyof typeof SLOT_DISPLAY] ?? stripMdLabel(rawLabel)
  );
}

function stripMdLabel(raw: string): string {
  return raw.replace(/\s+—.*$/u, "").trim();
}

function findMarkers(markdown: string): MarkerMatch[] {
  const markers: MarkerMatch[] = [];
  let lineStart = 0;

  while (lineStart < markdown.length) {
    const lineEnd = markdown.indexOf("\n", lineStart);
    const end = lineEnd === -1 ? markdown.length : lineEnd;
    const line = markdown.slice(lineStart, end);
    const match = line.match(MARKER_LINE_RE);
    if (match) {
      markers.push({
        index: lineStart,
        length: end - lineStart + (lineEnd === -1 ? 0 : 1),
        rawLabel: match[1],
        inline: match[2].trim(),
        kind: classifyMarker(match[1]),
      });
    }
    lineStart = lineEnd === -1 ? markdown.length : lineEnd + 1;
  }

  return markers;
}

function splitByMarkers(
  markdown: string,
): { kind: SlotKind; rawLabel: string; body: string }[] {
  const markers = findMarkers(markdown);
  if (markers.length === 0) {
    const trimmed = markdown.trim();
    return trimmed ? [{ kind: "intro", rawLabel: "", body: trimmed }] : [];
  }

  const sections: { kind: SlotKind; rawLabel: string; body: string }[] = [];
  const preamble = markdown.slice(0, markers[0].index).trim();
  if (preamble) {
    sections.push({ kind: "intro", rawLabel: "", body: preamble });
  }

  for (let i = 0; i < markers.length; i += 1) {
    const marker = markers[i];
    const nextIndex =
      i + 1 < markers.length ? markers[i + 1].index : markdown.length;
    const chunk = markdown
      .slice(marker.index + marker.length, nextIndex)
      .trim();
    const body = marker.inline
      ? chunk
        ? `${marker.inline}\n\n${chunk}`
        : marker.inline
      : chunk;
    if (body.trim()) {
      sections.push({ kind: marker.kind, rawLabel: marker.rawLabel, body });
    }
  }

  return sections;
}

type ConceptSection = { kind: SlotKind; rawLabel: string; body: string };

function pitfallsMarkdown(section: ConceptSection): string {
  const title = stripMdLabel(section.rawLabel);
  const body = section.body.trim();
  return body ? `#### ${title}\n\n${body}` : `#### ${title}`;
}

function mergeDuplicateKinds(sections: ConceptSection[]): ConceptSection[] {
  const merged: ConceptSection[] = [];
  const indexByKey = new Map<string, number>();

  for (const section of sections) {
    const key =
      section.kind === "extra" || section.kind === "cases"
        ? `${section.kind}:${normalizeLabel(section.rawLabel)}`
        : section.kind;
    const existingIndex = indexByKey.get(key);
    if (existingIndex === undefined) {
      indexByKey.set(key, merged.length);
      merged.push(section);
      continue;
    }
    const existing = merged[existingIndex];
    merged[existingIndex] = {
      ...existing,
      body: `${existing.body}\n\n${section.body}`.trim(),
    };
  }

  return merged;
}

function stripHeadingText(value: string): string {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

type ConceptPart = {
  readonly heading: string;
  readonly markdown: string;
};

function splitBySubheadings(markdown: string): ConceptPart[] {
  const parts: { heading: string; lines: string[] }[] = [];
  let current = { heading: "", lines: [] as string[] };
  let inFence = false;

  for (const line of markdown.split("\n")) {
    const fence = line.trimStart().startsWith("```");
    if (fence) {
      inFence = !inFence;
      current.lines.push(line);
      continue;
    }

    const headingMatch = !inFence ? line.match(/^#{2,3}\s+(.+)$/) : undefined;
    if (headingMatch) {
      if (current.heading || current.lines.some((entry) => entry.trim())) {
        parts.push(current);
      }
      current = { heading: stripHeadingText(headingMatch[1]), lines: [] };
      continue;
    }

    current.lines.push(line);
  }

  if (current.heading || current.lines.some((entry) => entry.trim())) {
    parts.push(current);
  }

  return parts.map((part) => ({
    heading: part.heading,
    markdown: part.lines.join("\n").trim(),
  }));
}

function sectionsForMarkdown(markdown: string): ConceptSection[] {
  const sections = mergeDuplicateKinds(
    mergePitfallsIntoCases(splitByMarkers(markdown)),
  ).filter((section) => !isSkippedSlot(section.rawLabel));
  return orderSectionsForRender(sections);
}

function wrapPart(heading: string, slotsHtml: string): string {
  if (!slotsHtml.trim() && !heading) {
    return "";
  }
  const title = heading
    ? `<h3 class="concept-part__title">${escapeHtml(heading)}</h3>`
    : "";
  return `<section class="concept-part">${title}${slotsHtml}</section>`;
}

function mergePitfallsIntoCases(sections: ConceptSection[]): ConceptSection[] {
  const merged: ConceptSection[] = [];
  let pendingPitfalls: ConceptSection[] = [];

  function flushPitfallsIntoCases(casesIndex: number) {
    if (pendingPitfalls.length === 0) {
      return;
    }
    const cases = merged[casesIndex];
    const blocks = pendingPitfalls.map(pitfallsMarkdown).join("\n\n");
    merged[casesIndex] = {
      ...cases,
      body: `${cases.body}\n\n${blocks}`.trim(),
    };
    pendingPitfalls = [];
  }

  for (const section of sections) {
    if (section.kind === "pitfalls") {
      pendingPitfalls.push(section);
      continue;
    }

    merged.push(section);

    if (section.kind === "cases") {
      flushPitfallsIntoCases(merged.length - 1);
    }
  }

  if (pendingPitfalls.length > 0) {
    const lastCasesIndex = merged.findLastIndex(
      (item) => item.kind === "cases",
    );
    if (lastCasesIndex >= 0) {
      flushPitfallsIntoCases(lastCasesIndex);
    } else {
      merged.push({
        kind: "cases",
        rawLabel: "When to use",
        body: pendingPitfalls.map(pitfallsMarkdown).join("\n\n"),
      });
    }
  }

  return merged;
}

function orderSectionsForRender(sections: ConceptSection[]): ConceptSection[] {
  return [...sections].sort((a, b) => SLOT_ORDER[a.kind] - SLOT_ORDER[b.kind]);
}

function wrapSlot(kind: SlotKind, rawLabel: string, bodyHtml: string): string {
  if (!bodyHtml.trim()) {
    return "";
  }
  const labelHtml =
    kind === "intro" ? "" : slotLabelHtml(kind, displayLabel(kind, rawLabel));
  return `<section class="concept-slot slot-${kind}">${labelHtml}<div class="concept-slot__body">${bodyHtml}</div></section>`;
}

async function renderSections(
  sections: readonly ConceptSection[],
  renderFragment: (fragment: string) => Promise<string>,
): Promise<string> {
  const rendered = await Promise.all(
    sections.map(async (section) => {
      const bodyHtml = transformProsConsTables(
        await renderFragment(section.body),
      );
      return wrapSlot(section.kind, section.rawLabel, bodyHtml);
    }),
  );
  return rendered.filter(Boolean).join("\n");
}

export async function structureConceptBody(
  markdown: string,
  renderFragment: (fragment: string) => Promise<string>,
): Promise<string> {
  const parts = splitBySubheadings(markdown);
  if (parts.length === 0) {
    return "";
  }

  const renderedParts = await Promise.all(
    parts.map(async (part) => {
      const slotsHtml = await renderSections(
        sectionsForMarkdown(part.markdown),
        renderFragment,
      );
      return wrapPart(part.heading, slotsHtml);
    }),
  );

  return renderedParts.filter(Boolean).join("\n");
}
