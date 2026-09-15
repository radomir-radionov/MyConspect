import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { hrefForFile } from "./catalog";

export type Concept = {
  readonly id: string;
  readonly title: string;
  readonly html: string;
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
  "main concepts",
  "sections",
  "resources & links",
  "resources",
]);

const CONCEPT_MARKERS = [
  "**Definition:**",
  "**How it works:**",
  "**Key idea:**",
  "**When to use:**",
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
    code: ["class"],
    pre: ["class"],
    "*": ["id", "class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
};

export function parseTopicMarkdown(markdown: string): ParsedTopic {
  const rewritten = rewriteNoteLinks(markdown);
  const title = extractH1(rewritten) ?? "Topic";
  const description = extractDescription(rewritten);
  const concepts = collectConcepts(rewritten);
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

function collectConcepts(markdown: string): Concept[] {
  const usedIds = new Set<string>();
  const concepts: Concept[] = [];

  for (const block of extractTopLevelDetails(markdown)) {
    const title = stripMd(block.title);
    if (shouldSkipTitle(title) || !looksLikeConcept(block.body, title)) {
      continue;
    }
    concepts.push(toConcept(title, block.body, usedIds));
  }

  const leftover = maskTopLevelDetails(markdown);
  for (const heading of extractHeadingConcepts(leftover)) {
    if (shouldSkipTitle(heading.title) || !looksLikeConcept(heading.body, heading.title)) {
      continue;
    }
    concepts.push(toConcept(heading.title, heading.body, usedIds));
  }

  return concepts;
}

function toConcept(title: string, body: string, usedIds: Set<string>): Concept {
  return {
    id: uniqueId(slugify(title), usedIds),
    title,
    html: renderHtml(body),
  };
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

type DetailsBlock = { title: string; body: string };

function extractTopLevelDetails(source: string): DetailsBlock[] {
  const lower = source.toLowerCase();
  const blocks: DetailsBlock[] = [];
  let i = 0;

  while (i < source.length) {
    const open = findTag(lower, "<details", i);
    if (open === -1) {
      break;
    }
    const openEnd = source.indexOf(">", open);
    if (openEnd === -1) {
      break;
    }

    let depth = 1;
    let pos = openEnd + 1;
    let closeAt = -1;

    while (pos < source.length && depth > 0) {
      const nextOpen = findTag(lower, "<details", pos);
      const nextClose = lower.indexOf("</details>", pos);
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
      break;
    }

    const inner = source.slice(openEnd + 1, closeAt);
    const title = extractSummary(inner) ?? "Untitled";
    const body = stripFirstSummary(inner);
    blocks.push({ title, body });
    i = closeAt + 10;
  }

  return blocks;
}

function maskTopLevelDetails(source: string): string {
  const lower = source.toLowerCase();
  let result = "";
  let i = 0;

  while (i < source.length) {
    const open = findTag(lower, "<details", i);
    if (open === -1) {
      result += source.slice(i);
      break;
    }
    result += source.slice(i, open);
    const openEnd = source.indexOf(">", open);
    if (openEnd === -1) {
      result += source.slice(open);
      break;
    }
    let depth = 1;
    let pos = openEnd + 1;
    let closeAt = -1;
    while (pos < source.length && depth > 0) {
      const nextOpen = findTag(lower, "<details", pos);
      const nextClose = lower.indexOf("</details>", pos);
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
      result += source.slice(open);
      break;
    }
    result += "\n";
    i = closeAt + 10;
  }

  return result;
}

function extractHeadingConcepts(markdown: string): DetailsBlock[] {
  const lines = markdown.split(/\n/);
  const blocks: DetailsBlock[] = [];
  let current: { title: string; body: string[] } | undefined;

  const flush = () => {
    if (!current) {
      return;
    }
    const body = current.body.join("\n").trim();
    if (body) {
      blocks.push({ title: current.title, body });
    }
    current = undefined;
  };

  for (const line of lines) {
    const heading = line.match(/^#{2,3}\s+(.+)$/);
    if (heading) {
      flush();
      current = { title: stripMd(heading[1]), body: [] };
      continue;
    }
    if (current) {
      current.body.push(line);
    }
  }
  flush();
  return blocks;
}

function findTag(lowerSource: string, tag: string, from: number): number {
  let idx = from;
  while (idx < lowerSource.length) {
    const found = lowerSource.indexOf(tag, idx);
    if (found === -1) {
      return -1;
    }
    const after = lowerSource[found + tag.length];
    if (after === ">" || after === " " || after === "\n" || after === "\t") {
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

function renderHtml(markdown: string): string {
  const parsed = marked.parse(markdown, { async: false });
  return sanitizeHtml(parsed, SANITIZE);
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
