import { slugify, parseTopicOutline, collectConceptBlocks } from "@/lib/parse/parse";
import type { Topic } from "@/lib/catalog";

export type SectionLink = {
  readonly title: string;
  readonly anchor: string;
};

export type OrderIssueKind =
  | "missing-sections"
  | "unknown-section"
  | "section-order"
  | "leading-stub"
  | "duplicate-stub"
  | "cross-topic";

export type OrderIssue = {
  readonly kind: OrderIssueKind;
  readonly file: string;
  readonly message: string;
};

export type OrderAuditRow = {
  readonly file: string;
  readonly topicSlug: string;
  readonly sectionTitles: readonly string[];
  readonly conceptTitles: readonly string[];
  readonly issues: readonly OrderIssue[];
};

const INTERVIEW_HEADING =
  /^##\s+(?:Interview (?:Practice|questions)|Questions?\s*(?:&|and)\s*Answers?|Q&A)\s*$/im;

const CROSS_TOPIC_PATTERNS: Readonly<Record<string, readonly RegExp[]>> = {
  "1_html_structure.md": [/browser rendering pipeline/i],
};

export function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function extractSectionLinks(markdown: string): SectionLink[] {
  const match = markdown.match(/^###\s+Sections\s*\n([\s\S]*?)(?:\n---|\n##\s|\n###\s[^\n]*\n\*\*Definition)/m);
  if (!match) {
    return [];
  }
  const links: SectionLink[] = [];
  for (const line of match[1].split("\n")) {
    const hit = line.match(/^\s*-\s*\[([^\]]+)\]\(#([^)]+)\)/);
    if (hit) {
      links.push({ title: hit[1].trim(), anchor: hit[2].trim() });
    }
  }
  return links;
}

export function extractDetailsTitles(markdown: string): string[] {
  const titles: string[] = [];
  const summaryRe = /<summary>\s*([\s\S]*?)\s*<\/summary>/gi;
  for (const match of markdown.matchAll(summaryRe)) {
    titles.push(match[1].replace(/<[^>]+>/g, "").trim());
  }
  return titles;
}

type MarkdownSection = {
  readonly title: string;
  readonly content: string;
};

function splitStubBlocks(stubs: string): { title: string; content: string }[] {
  const blocks: { title: string; content: string }[] = [];
  const lines = stubs.split("\n");
  let current: { title: string; lines: string[] } | undefined;

  for (const line of lines) {
    const heading = line.match(/^###\s+(.+)$/);
    if (heading) {
      if (current) {
        blocks.push({
          title: current.title,
          content: current.lines.join("\n").trimEnd(),
        });
      }
      current = { title: heading[1].trim(), lines: [line] };
      continue;
    }
    if (current) {
      current.lines.push(line);
    }
  }
  if (current) {
    blocks.push({
      title: current.title,
      content: current.lines.join("\n").trimEnd(),
    });
  }
  return blocks.filter((block) => block.content.length > 0);
}

function isInsideDetails(markdown: string, index: number): boolean {
  const before = markdown.slice(0, index).toLowerCase();
  const openCount = (before.match(/<details\b/g) ?? []).length;
  const closeCount = (before.match(/<\/details>/g) ?? []).length;
  return openCount > closeCount;
}

function topLevelH2Indices(body: string): { title: string; start: number }[] {
  const hits: { title: string; start: number }[] = [];
  const re = /^##\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = re.exec(body)) !== null) {
    if (!isInsideDetails(body, match.index)) {
      hits.push({ title: match[1].trim(), start: match.index });
    }
  }
  return hits;
}

function splitH2Sections(body: string): MarkdownSection[] {
  const hits = topLevelH2Indices(body);
  const sections: MarkdownSection[] = [];
  for (let i = 0; i < hits.length; i += 1) {
    const start = hits[i].start;
    const end = i + 1 < hits.length ? hits[i + 1].start : body.length;
    sections.push({
      title: hits[i].title,
      content: body.slice(start, end).trimEnd(),
    });
  }
  return sections;
}

function isInterviewSection(title: string): boolean {
  return INTERVIEW_HEADING.test(`## ${title}`);
}

function sectionRank(title: string, toc: readonly SectionLink[]): number {
  const norm = normalizeTitle(title);
  const idx = toc.findIndex((link) => normalizeTitle(link.title) === norm);
  if (idx >= 0) {
    return idx;
  }
  const anchor = slugify(title);
  const byAnchor = toc.findIndex((link) => link.anchor === anchor);
  if (byAnchor >= 0) {
    return byAnchor;
  }
  return toc.length + 1;
}

function titlesOverlap(left: string, right: string): boolean {
  const a = normalizeTitle(left);
  const b = normalizeTitle(right);
  if (!a || !b) {
    return false;
  }
  if (a === b || a.includes(b) || b.includes(a)) {
    return true;
  }
  const aWords = a.split(" ").filter((word) => word.length > 3);
  const bWords = new Set(b.split(" ").filter((word) => word.length > 3));
  const overlap = aWords.filter((word) => bWords.has(word));
  return overlap.length >= 2;
}

function isUmbrellaStub(stubTitle: string, sectionTitles: readonly string[]): boolean {
  return sectionTitles.some((section) => titlesOverlap(stubTitle, section));
}

function isDuplicateStub(stubTitle: string, detailsTitles: readonly string[]): boolean {
  const norm = normalizeTitle(stubTitle);
  return detailsTitles.some((title) => normalizeTitle(title) === norm);
}

function firstBodyStart(markdown: string): number {
  const hits = [
    markdown.search(/^\s*<details\b/m),
    markdown.search(/^##\s+/m),
  ].filter((index) => index >= 0);
  const sectionsAt = markdown.search(/^###\s+Sections\b/m);
  if (sectionsAt !== -1) {
    const afterSections = markdown.slice(sectionsAt);
    const stubAt = afterSections.search(/^###\s+(?!Sections\b|Related docs\b|Main concepts\b)/m);
    if (stubAt >= 0) {
      hits.push(sectionsAt + stubAt);
    }
  }
  if (hits.length === 0) {
    return -1;
  }
  return Math.min(...hits);
}

function splitPreamble(markdown: string): { preamble: string; body: string } {
  const separator = markdown.indexOf("\n---\n");
  const bodyStart = firstBodyStart(markdown);
  if (separator !== -1 && (bodyStart === -1 || separator < bodyStart)) {
    const end = separator + 5;
    return {
      preamble: markdown.slice(0, end),
      body: markdown.slice(end).replace(/^\n+/, ""),
    };
  }
  if (bodyStart !== -1) {
    return {
      preamble: markdown.slice(0, bodyStart).trimEnd(),
      body: markdown.slice(bodyStart).replace(/^\n+/, ""),
    };
  }
  return { preamble: markdown, body: "" };
}

function matchSection(
  section: MarkdownSection,
  toc: readonly SectionLink[],
): SectionLink | undefined {
  const norm = normalizeTitle(section.title);
  return toc.find(
    (link) =>
      normalizeTitle(link.title) === norm ||
      link.anchor === slugify(section.title) ||
      titlesOverlap(link.title, section.title),
  );
}

export function auditTopicOrder(topic: Topic, markdown: string): OrderAuditRow {
  const issues: OrderIssue[] = [];
  const toc = extractSectionLinks(markdown);
  const conceptTitles = parseTopicOutline(markdown).map((concept) => concept.title);
  const detailsTitles = extractDetailsTitles(markdown);
  const { body } = splitPreamble(markdown);

  const interviewAt = body.search(INTERVIEW_HEADING);
  const main = interviewAt === -1 ? body : body.slice(0, interviewAt);
  const sections = splitH2Sections(main).filter((section) => !isInterviewSection(section.title));
  const firstSectionAt = sections[0] ? main.indexOf(sections[0].content) : -1;
  const stubs = firstSectionAt === -1 ? "" : main.slice(0, firstSectionAt);

  if (toc.length === 0 && sections.length > 0) {
    issues.push({
      kind: "missing-sections",
      file: topic.file,
      message: "Has ## sections but no ### Sections TOC",
    });
  }

  for (const stub of splitStubBlocks(stubs)) {
    const crossPatterns = CROSS_TOPIC_PATTERNS[topic.file] ?? [];
    if (crossPatterns.some((pattern) => pattern.test(stub.title))) {
      issues.push({
        kind: "cross-topic",
        file: topic.file,
        message: `Cross-topic stub before sections: "${stub.title}"`,
      });
      continue;
    }
    if (isDuplicateStub(stub.title, detailsTitles)) {
      issues.push({
        kind: "duplicate-stub",
        file: topic.file,
        message: `Duplicate stub before sections: "${stub.title}"`,
      });
      continue;
    }
    if (isUmbrellaStub(stub.title, sections.map((section) => section.title))) {
      issues.push({
        kind: "leading-stub",
        file: topic.file,
        message: `Umbrella stub before sections: "${stub.title}"`,
      });
    }
  }

  const tocTitles = toc.map((link) => link.title);
  for (const section of sections) {
    if (toc.length > 0 && !matchSection(section, toc)) {
      issues.push({
        kind: "unknown-section",
        file: topic.file,
        message: `Section not listed in TOC: "${section.title}"`,
      });
    }
  }

  if (toc.length > 0 && sections.length > 1) {
    const ranks = sections.map((section) => sectionRank(section.title, toc));
    for (let i = 1; i < ranks.length; i += 1) {
      if (ranks[i] < ranks[i - 1]) {
        issues.push({
          kind: "section-order",
          file: topic.file,
          message: `Sections out of TOC order near "${sections[i].title}"`,
        });
        break;
      }
    }
  }

  const firstConcept = conceptTitles[0];
  if (firstConcept && tocTitles.length > 0) {
    const firstStub = splitStubBlocks(stubs)[0];
    if (firstStub && !issues.some((issue) => issue.message.includes(firstStub.title))) {
      const overlapsSection = isUmbrellaStub(firstStub.title, tocTitles);
      if (overlapsSection) {
        issues.push({
          kind: "leading-stub",
          file: topic.file,
          message: `First parsed concept is umbrella stub: "${firstStub.title}"`,
        });
      }
    }
  }

  return {
    file: topic.file,
    topicSlug: topic.slug,
    sectionTitles: sections.map((section) => section.title),
    conceptTitles,
    issues,
  };
}

export type ReorderResult = {
  readonly markdown: string;
  readonly changes: readonly string[];
  readonly changed: boolean;
};

function pointerForCrossTopic(stubTitle: string, topicFile: string): string | undefined {
  if (topicFile === "1_html_structure.md" && /browser rendering pipeline/i.test(stubTitle)) {
    return (
      "Browser rendering (parse → layout → paint → composite) lives in " +
      "[HTML — Rendering](./1_html_rendering.md)."
    );
  }
  return undefined;
}

function keepStub(
  stub: { title: string; content: string },
  sectionTitles: readonly string[],
  detailsTitles: readonly string[],
  topicFile: string,
): boolean {
  const crossPatterns = CROSS_TOPIC_PATTERNS[topicFile] ?? [];
  if (crossPatterns.some((pattern) => pattern.test(stub.title))) {
    return false;
  }
  if (isDuplicateStub(stub.title, detailsTitles)) {
    return false;
  }
  if (isUmbrellaStub(stub.title, sectionTitles)) {
    return false;
  }
  return true;
}

export function reorderTopicMarkdown(topic: Topic, markdown: string): ReorderResult {
  const changes: string[] = [];
  const toc = extractSectionLinks(markdown);
  const detailsTitles = extractDetailsTitles(markdown);
  const { preamble, body } = splitPreamble(markdown);

  const interviewAt = body.search(INTERVIEW_HEADING);
  const interview = interviewAt === -1 ? "" : body.slice(interviewAt).trimStart();
  const main = interviewAt === -1 ? body : body.slice(0, interviewAt);
  const sections = splitH2Sections(main).filter((section) => !isInterviewSection(section.title));
  const firstSectionAt = sections[0] ? main.indexOf(sections[0].content) : -1;
  const stubsRegion = firstSectionAt === -1 ? "" : main.slice(0, firstSectionAt);

  const stubBlocks = splitStubBlocks(stubsRegion);
  const sectionTitles = sections.map((section) => section.title);

  const keptStubs: string[] = [];
  const pointers: string[] = [];
  for (const stub of stubBlocks) {
    const pointer = pointerForCrossTopic(stub.title, topic.file);
    if (pointer) {
      pointers.push(pointer);
      changes.push(`Removed cross-topic stub "${stub.title}"`);
      continue;
    }
    if (!keepStub(stub, sectionTitles, detailsTitles, topic.file)) {
      changes.push(`Removed stub "${stub.title}"`);
      continue;
    }
    keptStubs.push(stub.content);
  }

  let orderedSections = sections;
  if (toc.length > 0 && sections.length > 1) {
    orderedSections = [...sections].sort(
      (left, right) => sectionRank(left.title, toc) - sectionRank(right.title, toc),
    );
    const before = sections.map((section) => section.title).join(" → ");
    const after = orderedSections.map((section) => section.title).join(" → ");
    if (before !== after) {
      changes.push(`Reordered sections: ${after}`);
    }
  }

  const movableStubs = keptStubs.join("\n\n").trim();
  let sectionChunks = orderedSections.map((section) => section.content);
  if (movableStubs && sectionChunks.length > 0) {
    sectionChunks[0] = `${sectionChunks[0]}\n\n${movableStubs}`.trimEnd();
    changes.push("Moved remaining overview stubs into the first section");
  } else if (movableStubs) {
    sectionChunks = [movableStubs];
  } else if (sectionChunks.length === 0 && main.trim()) {
    sectionChunks = [main.trim()];
    changes.push("Preserved concept body without ## sections");
  }

  const pointerBlock = pointers.length > 0 ? `\n\n${pointers.join("\n\n")}\n` : "";
  const parts: string[] = [preamble.trimEnd()];
  if (pointerBlock) {
    parts.push(pointerBlock.trim());
  }
  if (sectionChunks.length > 0) {
    parts.push(sectionChunks.join("\n\n"));
  }
  if (interview) {
    parts.push(interview);
  }

  const next = `${parts.join("\n\n")}\n`;
  const changed = next !== markdown;
  if (!changed && changes.length === 0) {
    return { markdown, changes: [], changed: false };
  }
  return { markdown: next, changes, changed };
}

export function formatOrderAuditMarkdown(rows: readonly OrderAuditRow[]): string {
  const withIssues = rows.filter((row) => row.issues.length > 0);
  const lines = [
    "# Concept order audit",
    "",
    `- Topics checked: ${rows.length}`,
    `- Topics with issues: ${withIssues.length}`,
    "",
  ];

  if (withIssues.length === 0) {
    lines.push("All topics pass concept-order checks.");
    lines.push("");
    return lines.join("\n");
  }

  for (const row of withIssues) {
    lines.push(`## ${row.file} (\`${row.topicSlug}\`)`);
    lines.push("");
    lines.push(`Sections: ${row.sectionTitles.join(" → ") || "(none)"}`);
    lines.push("");
    lines.push(`Concepts: ${row.conceptTitles.join(" → ")}`);
    lines.push("");
    for (const issue of row.issues) {
      lines.push(`- **${issue.kind}**: ${issue.message}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

export function countOrderIssues(rows: readonly OrderAuditRow[]): number {
  return rows.reduce((total, row) => total + row.issues.length, 0);
}

export function collectConceptTitles(markdown: string): string[] {
  return collectConceptBlocks(markdown).map((block) => block.title);
}
