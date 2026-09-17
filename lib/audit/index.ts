import { TOPICS, type Topic, type TrackId } from "@/lib/catalog";
import { collectConceptBlocks } from "@/lib/parse";

export const AUDIT_STATUSES = ["unverified", "url-ok", "url-warn", "url-dead"] as const;

export type AuditStatus = (typeof AUDIT_STATUSES)[number];

export type UrlCheckStatus = "ok" | "warn" | "dead";

export type UrlCheck = {
  readonly url: string;
  readonly status: UrlCheckStatus;
  readonly httpStatus?: number;
  readonly error?: string;
};

export type ConceptAudit = {
  readonly file: string;
  readonly track: TrackId;
  readonly topicSlug: string;
  readonly topicTitle: string;
  readonly conceptTitle: string;
  readonly sources: readonly string[];
  readonly checkedAt?: string;
  readonly status: AuditStatus;
  readonly urlChecks: readonly UrlCheck[];
};

export type AuditSummary = {
  readonly generatedAt: string;
  readonly trackFilter: TrackId | "all";
  readonly concepts: number;
  readonly unverified: number;
  readonly urlOk: number;
  readonly urlWarn: number;
  readonly urlDead: number;
  readonly uniqueUrls: number;
};

export type AuditReport = {
  readonly summary: AuditSummary;
  readonly concepts: readonly ConceptAudit[];
};

const SOURCE_LINE = /^\s*\*\*Source:\*\*\s*(.+)$/i;
const MARKDOWN_LINK = /\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/gi;
const BARE_URL = /https?:\/\/[^\s)<>"']+/gi;
const CHECKED_AT = /\bChecked:\s*(\d{4}-\d{2}-\d{2})\b/i;

export function topicsForAudit(track?: TrackId): readonly Topic[] {
  if (!track) {
    return TOPICS;
  }
  return TOPICS.filter((topic) => topic.track === track);
}

export function extractSourceLine(body: string): string | undefined {
  for (const line of body.split("\n")) {
    const match = line.match(SOURCE_LINE);
    if (match) {
      return match[1].trim();
    }
  }
  return undefined;
}

export function extractSourceUrls(body: string): string[] {
  const line = extractSourceLine(body);
  if (!line) {
    return [];
  }
  const urls: string[] = [];
  const seen = new Set<string>();
  const push = (raw: string) => {
    const url = normalizeUrl(raw);
    if (!url || seen.has(url)) {
      return;
    }
    seen.add(url);
    urls.push(url);
  };

  for (const match of line.matchAll(MARKDOWN_LINK)) {
    push(match[1]);
  }
  for (const match of line.matchAll(BARE_URL)) {
    if (line.includes(`](${match[0]}`)) {
      continue;
    }
    push(match[0]);
  }
  return urls;
}

export function extractCheckedAt(body: string): string | undefined {
  const line = extractSourceLine(body);
  const fromSource = line?.match(CHECKED_AT)?.[1];
  if (fromSource) {
    return fromSource;
  }
  return body.match(CHECKED_AT)?.[1];
}

export function classifyConcept(
  sources: readonly string[],
  urlChecks: readonly UrlCheck[],
): AuditStatus {
  if (sources.length === 0) {
    return "unverified";
  }
  if (urlChecks.some((check) => check.status === "dead")) {
    return "url-dead";
  }
  if (urlChecks.some((check) => check.status === "warn")) {
    return "url-warn";
  }
  return "url-ok";
}

export function collectConceptAudits(
  topics: readonly Topic[],
  readFile: (file: string) => string,
): Omit<ConceptAudit, "status" | "urlChecks">[] {
  const rows: Omit<ConceptAudit, "status" | "urlChecks">[] = [];
  for (const topic of topics) {
    const markdown = readFile(topic.file);
    for (const block of collectConceptBlocks(markdown)) {
      rows.push({
        file: topic.file,
        track: topic.track,
        topicSlug: topic.slug,
        topicTitle: topic.title,
        conceptTitle: block.title,
        sources: extractSourceUrls(block.body),
        checkedAt: extractCheckedAt(block.body),
      });
    }
  }
  return rows;
}

export function uniqueSourceUrls(
  rows: readonly Pick<ConceptAudit, "sources">[],
): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const row of rows) {
    for (const url of row.sources) {
      if (seen.has(url)) {
        continue;
      }
      seen.add(url);
      urls.push(url);
    }
  }
  return urls;
}

export function buildAuditReport(input: {
  readonly generatedAt: string;
  readonly trackFilter: TrackId | "all";
  readonly rows: readonly Omit<ConceptAudit, "status" | "urlChecks">[];
  readonly urlResults: ReadonlyMap<string, UrlCheck>;
}): AuditReport {
  const concepts: ConceptAudit[] = input.rows.map((row) => {
    const urlChecks = row.sources.map(
      (url) =>
        input.urlResults.get(url) ?? {
          url,
          status: "dead" as const,
          error: "missing check",
        },
    );
    return {
      ...row,
      urlChecks,
      status: classifyConcept(row.sources, urlChecks),
    };
  });

  const summary: AuditSummary = {
    generatedAt: input.generatedAt,
    trackFilter: input.trackFilter,
    concepts: concepts.length,
    unverified: countStatus(concepts, "unverified"),
    urlOk: countStatus(concepts, "url-ok"),
    urlWarn: countStatus(concepts, "url-warn"),
    urlDead: countStatus(concepts, "url-dead"),
    uniqueUrls: input.urlResults.size,
  };

  return { summary, concepts };
}

export function formatAuditMarkdown(report: AuditReport): string {
  const { summary, concepts } = report;
  const lines = [
    `# Conspect source audit`,
    ``,
    `- Generated: ${summary.generatedAt}`,
    `- Track: ${summary.trackFilter}`,
    `- Concepts: ${summary.concepts}`,
    `- Unique source URLs: ${summary.uniqueUrls}`,
    `- url-ok: ${summary.urlOk}`,
    `- url-warn: ${summary.urlWarn}`,
    `- url-dead: ${summary.urlDead}`,
    `- unverified (no **Source:**): ${summary.unverified}`,
    ``,
    `This report does **not** rewrite notes. Patch flagged blocks with \`update-conspect\`.`,
    ``,
  ];

  appendSection(lines, "url-dead", concepts);
  appendSection(lines, "url-warn", concepts);

  const unverified = concepts.filter((row) => row.status === "unverified");
  lines.push(`## unverified (${unverified.length})`);
  lines.push(``);
  if (unverified.length === 0) {
    lines.push(`None.`);
    lines.push(``);
  } else {
    const byFile = groupByFile(unverified);
    for (const [file, rows] of byFile) {
      lines.push(`### ${file}`);
      lines.push(``);
      for (const row of rows) {
        lines.push(`- ${row.conceptTitle}`);
      }
      lines.push(``);
    }
  }

  return lines.join("\n");
}

function appendSection(
  lines: string[],
  status: Extract<AuditStatus, "url-dead" | "url-warn">,
  concepts: readonly ConceptAudit[],
): void {
  const rows = concepts.filter((row) => row.status === status);
  lines.push(`## ${status} (${rows.length})`);
  lines.push(``);
  if (rows.length === 0) {
    lines.push(`None.`);
    lines.push(``);
    return;
  }
  for (const row of rows) {
    lines.push(`- **${row.conceptTitle}** (${row.file})`);
    for (const check of row.urlChecks) {
      if (check.status === "ok") {
        continue;
      }
      const detail = check.httpStatus
        ? `${check.status} ${check.httpStatus}`
        : `${check.status}${check.error ? ` ${check.error}` : ""}`;
      lines.push(`  - ${check.url} — ${detail}`);
    }
  }
  lines.push(``);
}

function groupByFile(rows: readonly ConceptAudit[]): Map<string, ConceptAudit[]> {
  const grouped = new Map<string, ConceptAudit[]>();
  for (const row of rows) {
    const list = grouped.get(row.file) ?? [];
    list.push(row);
    grouped.set(row.file, list);
  }
  return grouped;
}

function countStatus(concepts: readonly ConceptAudit[], status: AuditStatus): number {
  return concepts.filter((row) => row.status === status).length;
}

function normalizeUrl(raw: string): string | undefined {
  const trimmed = raw.replace(/[.,;:]+$/, "");
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return undefined;
    }
    return url.toString();
  } catch {
    return undefined;
  }
}
