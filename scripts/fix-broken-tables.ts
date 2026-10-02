import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const RESOURCES_RU = join(process.cwd(), "resources/ru");

function countColumns(line: string): number {
  return line
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim())
    .filter((cell) => cell.length > 0).length;
}

function isSeparatorRow(line: string): boolean {
  const cells = line
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function ensureTableRow(line: string): string {
  let fixed = line.trimEnd();
  if (fixed.startsWith("|") && !fixed.endsWith("|")) {
    fixed = `${fixed} |`;
  }
  return fixed;
}

function truncateRowToColumns(line: string, columnCount: number): string {
  const cells = line.split("|").slice(1, -1);
  if (cells.length <= columnCount) return line;
  const trimmed = cells.slice(0, columnCount);
  return `|${trimmed.join("|")}|`;
}

function splitOnMergedRowBoundary(line: string): string[] {
  const parts: string[] = [];
  let current = "";
  let inBackticks = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === "`") {
      inBackticks = !inBackticks;
      current += char;
      continue;
    }

    if (!inBackticks && char === "|" && line[i + 1] === "|") {
      parts.push(current);
      current = "";
      i += 1;
      if (line[i + 1] !== "|") {
        current = "|";
      }
      continue;
    }

    current += char;
  }

  if (current.length > 0) {
    parts.push(current);
  }

  return parts.length > 0 ? parts : [line];
}

function splitMergedTableRows(line: string): string[] {
  if (!line.startsWith("|")) return [line];

  const boundaryParts = splitOnMergedRowBoundary(line);
  const rows: string[] = [];

  for (const part of boundaryParts) {
    if (part.includes(" || ")) {
      const spacedParts = part.split(" || ");
      for (let i = 0; i < spacedParts.length; i++) {
        let chunk = spacedParts[i];
        if (i > 0 && !chunk.startsWith("|")) {
          chunk = `|${chunk}`;
        }
        rows.push(...splitMergedTableRows(chunk));
      }
      continue;
    }

    const mergedEmptyCell = /\|(?:\s+)\|(?=\s*(?:\*\*|[-А-ЯA-Za-z0-9`]))/;
    if (mergedEmptyCell.test(part)) {
      const splitAt = part.search(mergedEmptyCell);
      const first = ensureTableRow(part.slice(0, splitAt).trimEnd());
      const second = part.slice(splitAt).replace(/^\|(?:\s+)\|/, "|");
      rows.push(first, ...splitMergedTableRows(second));
      continue;
    }

    rows.push(ensureTableRow(part));
  }

  return rows;
}

function fixTableLines(content: string): { content: string; changes: number } {
  const lines = content.split("\n");
  const result: string[] = [];
  let changes = 0;
  let expectedColumns = 0;

  for (const line of lines) {
    if (!line.startsWith("|")) {
      result.push(line);
      expectedColumns = 0;
      continue;
    }

    const splitLines = splitMergedTableRows(line);
    if (splitLines.length > 1) {
      changes += splitLines.length - 1;
    }

    for (const splitLine of splitLines) {
      let fixed = splitLine;

      if (!isSeparatorRow(fixed) && countColumns(fixed) >= 2) {
        expectedColumns = countColumns(fixed);
      }

      if (isSeparatorRow(fixed) && expectedColumns > 0) {
        const cols = countColumns(fixed);
        if (cols > expectedColumns) {
          fixed = truncateRowToColumns(fixed, expectedColumns);
          changes += 1;
        }
      }

      const normalized = ensureTableRow(fixed);
      if (normalized !== splitLine) {
        changes += 1;
      }

      result.push(normalized);
    }
  }

  return { content: result.join("\n"), changes };
}

function walkMdFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...walkMdFiles(fullPath));
    } else if (entry.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = walkMdFiles(RESOURCES_RU);
let totalChanges = 0;
const changedFiles: string[] = [];

for (const file of files) {
  const original = readFileSync(file, "utf8");
  const { content, changes } = fixTableLines(original);
  if (content !== original) {
    writeFileSync(file, content, "utf8");
    changedFiles.push(`${file} (${changes})`);
    totalChanges += changes;
  }
}

console.log(
  `Fixed ${totalChanges} table issue(s) in ${changedFiles.length} file(s):`,
);
for (const entry of changedFiles) {
  console.log(`  ${entry}`);
}
