import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { hrefForFile } from "@/lib/catalog";
import { highlightMarkdownFences } from "./highlight";
import { structureConceptBody } from "./slots";

export type Concept = {
  readonly id: string;
  readonly title: string;
  readonly html: string;
  readonly searchText?: string;
  readonly titleSearchText?: string;
};

export type ConceptBlock = {
  readonly title: string;
  readonly body: string;
};

export type ParsedTopic = {
  readonly title: string;
  readonly description: string;
  readonly concepts: readonly Concept[];
};

const SKIP_TITLES = new Set([
  "code",
  "primary references",
  "tools & utilities",
  "figma templates & design references",
  "website examples & student tutorials",
  "related docs",
  "related docs in this repo",
  "related notes",
  "main concepts",
  "sections",
  "resources & links",
  "resources",
  "core advanced",
]);

const CONCEPT_MARKERS = [
  "**Definition:**",
  "**How it works:**",
  "**When to use:**",
  "**Thoughts:**",
  "**Key idea:**",
];

marked.setOptions({ gfm: true, breaks: false });

const SANITIZE: sanitizeHtml.IOptions = {
  allowedTags: [
    ...(sanitizeHtml.defaults.allowedTags ?? []),
    "details",
    "summary",
    "img",
    "h1",
    "h2",
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "pre",
    "code",
    "span",
    "div",
    "hr",
    "caption",
    "colgroup",
    "col",
    "section",
    "aside",
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ["href", "name", "id", "target", "rel", "title"],
    details: ["open", "id"],
    summary: ["id"],
    img: ["src", "alt", "title", "width", "height"],
    td: ["colspan", "rowspan", "align"],
    th: ["colspan", "rowspan", "align"],
    code: ["class", "style"],
    pre: ["class", "style", "tabindex"],
    span: ["class", "style"],
    "*": ["id", "class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  parseStyleAttributes: false,
};

export type ConceptOutline = {
  readonly id: string;
  readonly title: string;
  readonly searchText?: string;
  readonly titleSearchText?: string;
};

const INTERVIEW_GROUP_TITLE = "Interview questions";
const CONCEPT_SEARCH_TEXT_MAX = 1600;
const INTERVIEW_SEARCH_TEXT_MAX = 12000;

export function parseTopicOutline(markdown: string): readonly ConceptOutline[] {
  const rewritten = rewriteNoteLinks(markdown);
  const { regular, interview } = partitionInterviewBlocks(rewritten);
  const usedIds = new Set<string>();
  const outline: ConceptOutline[] = regular.map((block) => ({
    id: uniqueId(slugify(block.title), usedIds),
    title: block.title,
    searchText: conceptSearchText(block.body),
  }));
  if (interview.length > 0) {
    outline.push({
      id: uniqueId(slugify(INTERVIEW_GROUP_TITLE), usedIds),
      title: INTERVIEW_GROUP_TITLE,
      titleSearchText: interviewTitleSearchText(interview),
      searchText: interviewBodySearchText(interview),
    });
  }
  return outline;
}

export async function parseTopicMarkdown(markdown: string): Promise<ParsedTopic> {
  const rewritten = rewriteNoteLinks(markdown);
  const title = extractH1(rewritten) ?? "Topic";
  const description = extractDescription(rewritten);
  const concepts = await collectConcepts(rewritten);
  return { title, description, concepts };
}

export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
  return slug || "section";
}

function rewriteNoteLinks(markdown: string): string {
  const mdLinks = /\]\((?:\.\.\/)?(?:\.\/)?(\d+_[a-z0-9_]+\.md)(#[^)\s]*)?\)/gi;
  const hrefs = /href="(?:\.\.\/)?(?:\.\/)?(\d+_[a-z0-9_]+\.md)(#[^"]*)?"/gi;

  const replaceFile = (file: string, hash: string | undefined): string | undefined => {
    const href = hrefForFile(file);
    if (!href) {
      return undefined;
    }
    return `${href}${hash ?? ""}`;
  };

  return markdown
    .replace(mdLinks, (full, file: string, hash?: string) => {
      const next = replaceFile(file, hash);
      return next ? `](${next})` : full;
    })
    .replace(hrefs, (full, file: string, hash?: string) => {
      const next = replaceFile(file, hash);
      return next ? `href="${next}"` : full;
    });
}

function extractH1(markdown: string): string | undefined {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? stripMd(match[1]) : undefined;
}

function extractDescription(markdown: string): string {
  const withoutTitle = markdown.replace(/^#\s+.+$/m, "");
  const lines = withoutTitle.split(/\n/);
  const chunks: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (chunks.length > 0) {
        break;
      }
      continue;
    }
    if (
      trimmed.startsWith("#") ||
      trimmed.startsWith("<") ||
      trimmed.startsWith("|") ||
      trimmed.startsWith("[←") ||
      trimmed.startsWith("### ")
    ) {
      if (chunks.length > 0) {
        break;
      }
      continue;
    }
    chunks.push(trimmed);
    if (chunks.join(" ").length > 40) {
      break;
    }
  }
  const text = stripMd(chunks.join(" "));
  return text.slice(0, 280) || "Study notes.";
}

type LocatedBlock = {
  readonly title: string;
  readonly body: string;
  readonly start: number;
};

export function collectConceptBlocks(markdown: string): ConceptBlock[] {
  return collectLocatedBlocks(markdown).map(({ title, body }) => ({ title, body }));
}

async function collectConcepts(markdown: string): Promise<Concept[]> {
  const { regular, interview } = partitionInterviewBlocks(markdown);
  const usedIds = new Set<string>();
  const concepts: Concept[] = [];
  for (const block of regular) {
    concepts.push({
      id: uniqueId(slugify(block.title), usedIds),
      title: block.title,
      html: await renderHtml(block.body),
      searchText: conceptSearchText(block.body),
    });
  }
  if (interview.length > 0) {
    concepts.push({
      id: uniqueId(slugify(INTERVIEW_GROUP_TITLE), usedIds),
      title: INTERVIEW_GROUP_TITLE,
      html: await renderInterviewGroup(interview),
      titleSearchText: interviewTitleSearchText(interview),
      searchText: interviewBodySearchText(interview),
    });
  }
  return concepts;
}

function partitionInterviewBlocks(markdown: string): {
  regular: ConceptBlock[];
  interview: ConceptBlock[];
} {
  const regionStart = interviewRegionStart(markdown);
  const regular: ConceptBlock[] = [];
  const interview: ConceptBlock[] = [];
  for (const block of collectLocatedBlocks(markdown)) {
    const item = { title: block.title, body: block.body };
    if (isInterviewNavItem(block.title) || (regionStart !== -1 && block.start >= regionStart)) {
      interview.push(item);
    } else {
      regular.push(item);
    }
  }
  return { regular, interview };
}

function interviewRegionStart(markdown: string): number {
  const heading = markdown.search(
    /^#{2,3}\s+(?:Interview (?:Practice|questions)|Questions?\s*(?:&|and)\s*Answers?|Q&A)\s*$/im,
  );
  const summary = markdown.search(
    /<summary>\s*(?:Interview (?:Practice|questions)|Questions?\s*(?:&|and)\s*Answers?)\s*<\/summary>/i,
  );
  const hits = [heading, summary].filter((index) => index >= 0);
  return hits.length === 0 ? -1 : Math.min(...hits);
}

function isInterviewNavItem(title: string): boolean {
  return isInterviewSectionTitle(title) || isInterviewQuestionTitle(title);
}

function isInterviewSectionTitle(title: string): boolean {
  const t = normalizeTitle(title);
  return (
    t === "interview practice" ||
    t === "interview questions" ||
    t.startsWith("question index") ||
    t === "theory questions" ||
    t === "questions & answers" ||
    t === "questions and answers" ||
    t === "browser pipeline q&a" ||
    t === "browser pipeline q and a" ||
    t === "original questions" ||
    t.startsWith("original questions") ||
    t === "tasks"
  );
}

function isInterviewQuestionTitle(title: string): boolean {
  return /^(Q\d+[a-z]?|Q-[A-Za-z0-9]+)\b/.test(title) || /^Task(?:\s+\d+)?\b/i.test(title);
}

async function renderInterviewGroup(blocks: readonly ConceptBlock[]): Promise<string> {
  const parts = await Promise.all(blocks.map((block) => renderInterviewItem(block)));
  return parts.filter(Boolean).join("\n");
}

async function renderInterviewItem(block: ConceptBlock): Promise<string> {
  if (block.body.includes("<details")) {
    return renderFragment(block.body);
  }
  if (isInterviewSectionTitle(block.title) && !isInterviewQuestionTitle(block.title)) {
    return structureConceptBody(block.body, renderFragment);
  }
  const inner = await structureConceptBody(block.body, renderFragment);
  if (!inner.trim()) {
    return "";
  }
  return `<details><summary>${escapeHtml(block.title)}</summary>\n${inner}\n</details>`;
}

function normalizeConceptTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function detailsSummaryTitles(markdown: string): Set<string> {
  const titles = new Set<string>();
  for (const match of markdown.matchAll(/<summary>\s*([\s\S]*?)\s*<\/summary>/gi)) {
    const title = stripMd(match[1].replace(/<[^>]+>/g, ""));
    if (title) {
      titles.add(normalizeConceptTitle(title));
    }
  }
  return titles;
}

function isDetailsBlockStart(markdown: string, start: number): boolean {
  return /^<details\b/i.test(markdown.slice(start).trimStart());
}

function dropDuplicateHeadingStubs(
  markdown: string,
  blocks: readonly LocatedBlock[],
): LocatedBlock[] {
  const detailsTitles = detailsSummaryTitles(markdown);
  if (detailsTitles.size === 0) {
    return [...blocks];
  }
  return blocks.filter((block) => {
    if (isDetailsBlockStart(markdown, block.start)) {
      return true;
    }
    return !detailsTitles.has(normalizeConceptTitle(block.title));
  });
}

function collectLocatedBlocks(markdown: string): LocatedBlock[] {
  const lower = markdown.toLowerCase();
  const blocks: LocatedBlock[] = [];
  let i = 0;
  let heading: { title: string; start: number; body: string[] } | undefined;

  const flushHeading = () => {
    if (!heading) {
      return;
    }
    const title = heading.title;
    const body = stripDuplicateTitleHeading(title, heading.body.join("\n").trim());
    if (body && !shouldSkipTitle(title) && looksLikeConcept(body, title)) {
      blocks.push({ title, body, start: heading.start });
    }
    heading = undefined;
  };

  while (i < markdown.length) {
    const detailsAt = detailsOpenAt(markdown, lower, i);
    if (detailsAt !== -1) {
      flushHeading();
      const extracted = readDetailsBlock(markdown, lower, detailsAt);
      if (!extracted) {
        i = detailsAt + 8;
        continue;
      }
      const title = stripMd(extracted.title);
      const body = stripDuplicateTitleHeading(title, extracted.body);
      if (body && !shouldSkipTitle(title) && looksLikeConcept(body, title)) {
        blocks.push({ title, body, start: detailsAt });
      }
      i = extracted.end;
      continue;
    }

    const lineEnd = markdown.indexOf("\n", i);
    const end = lineEnd === -1 ? markdown.length : lineEnd;
    const line = markdown.slice(i, end);
    const headingMatch = line.match(/^#{2,3}\s+(.+)$/);
    if (headingMatch) {
      flushHeading();
      heading = { title: stripMd(headingMatch[1]), start: i, body: [] };
      i = lineEnd === -1 ? markdown.length : lineEnd + 1;
      continue;
    }
    if (heading) {
      heading.body.push(line);
    }
    if (lineEnd === -1) {
      break;
    }
    i = lineEnd + 1;
  }

  flushHeading();
  return dropDuplicateHeadingStubs(markdown, blocks);
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base;
  let n = 2;
  while (used.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  used.add(id);
  return id;
}

function shouldSkipTitle(title: string): boolean {
  return SKIP_TITLES.has(title.toLowerCase());
}

function looksLikeConcept(body: string, title: string): boolean {
  if (title.toLowerCase() === "code") {
    return false;
  }
  return CONCEPT_MARKERS.some((marker) => body.includes(marker)) || body.length > 400;
}

function detailsOpenAt(source: string, lower: string, from: number): number {
  let pos = from;
  while (pos < source.length && (source[pos] === " " || source[pos] === "\t")) {
    pos += 1;
  }
  if (!lower.startsWith("<details", pos)) {
    return -1;
  }
  const after = lower[pos + 8];
  if (after === ">" || after === " " || after === "\n" || after === "\t") {
    return pos;
  }
  return -1;
}

function readDetailsBlock(
  source: string,
  lower: string,
  open: number,
): { title: string; body: string; end: number } | undefined {
  const openEnd = source.indexOf(">", open);
  if (openEnd === -1) {
    return undefined;
  }

  let depth = 1;
  let pos = openEnd + 1;
  let closeAt = -1;

  while (pos < source.length && depth > 0) {
    const nextOpen = findTag(lower, "<details", pos);
    const nextClose = findCloseDetails(lower, pos);
    if (nextClose === -1) {
      break;
    }
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      pos = nextOpen + 8;
    } else {
      depth -= 1;
      if (depth === 0) {
        closeAt = nextClose;
      }
      pos = nextClose + 10;
    }
  }

  if (closeAt === -1) {
    return undefined;
  }

  const inner = source.slice(openEnd + 1, closeAt);
  return {
    title: extractSummary(inner) ?? "Untitled",
    body: stripFirstSummary(inner),
    end: closeAt + 10,
  };
}

function findCloseDetails(lowerSource: string, from: number): number {
  let idx = from;
  while (idx < lowerSource.length) {
    const found = lowerSource.indexOf("</details>", idx);
    if (found === -1) {
      return -1;
    }
    if (found > 0 && lowerSource[found - 1] === "`") {
      idx = found + 10;
      continue;
    }
    return found;
  }
  return -1;
}

function findTag(lowerSource: string, tag: string, from: number): number {
  let idx = from;
  while (idx < lowerSource.length) {
    const found = lowerSource.indexOf(tag, idx);
    if (found === -1) {
      return -1;
    }
    const prev = found === 0 ? "" : lowerSource[found - 1];
    const after = lowerSource[found + tag.length];
    if (
      prev !== "`" &&
      (after === ">" || after === " " || after === "\n" || after === "\t")
    ) {
      return found;
    }
    idx = found + tag.length;
  }
  return -1;
}

function extractSummary(inner: string): string | undefined {
  const match = inner.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i);
  if (!match) {
    return undefined;
  }
  return stripMd(match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function stripFirstSummary(inner: string): string {
  return inner.replace(/<summary\b[^>]*>[\s\S]*?<\/summary>/i, "").trim();
}

function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[–—−]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function stripDuplicateTitleHeading(title: string, body: string): string {
  const match = body.match(/^(?:\s*\n)*#{2,3}\s+(.+?)(?:\n+|$)/);
  if (!match) {
    return body;
  }
  if (normalizeTitle(stripMd(match[1])) !== normalizeTitle(title)) {
    return body;
  }
  return body.slice(match[0].length);
}

async function renderFragment(markdown: string): Promise<string> {
  const withCode = await highlightMarkdownFences(markdown);
  const parsed = marked.parse(withCode, { async: false });
  return sanitizeHtml(parsed, SANITIZE);
}

async function renderHtml(markdown: string): Promise<string> {
  return structureConceptBody(markdown, renderFragment);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripMd(value: string): string {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function conceptSearchText(body: string): string {
  const withoutFences = body.replace(/```[\s\S]*?```/g, "\n");
  const withoutTags = withoutFences.replace(/<[^>]+>/g, " ");
  const withoutHeavySlots = withoutTags.replace(
    /\*\*(?:Examples?|Sources?):\*\*[\s\S]*?(?=\n\*\*[^*]+?:\*\*|$)/gi,
    "\n",
  );
  return stripMd(withoutHeavySlots).slice(0, CONCEPT_SEARCH_TEXT_MAX);
}

function interviewTitleSearchText(blocks: readonly ConceptBlock[]): string {
  return blocks.map((block) => block.title).filter(Boolean).join("\n");
}

function interviewBodySearchText(blocks: readonly ConceptBlock[]): string {
  return blocks
    .map((block) => conceptSearchText(block.body))
    .filter(Boolean)
    .join("\n")
    .slice(0, INTERVIEW_SEARCH_TEXT_MAX);
}
