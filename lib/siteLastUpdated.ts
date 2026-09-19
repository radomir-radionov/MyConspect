import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function gitIsoDate(paths: readonly string[]): string | null {
  try {
    const iso = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", ...paths],
      {
        encoding: "utf8",
        cwd: process.cwd(),
        stdio: ["ignore", "pipe", "ignore"],
      },
    ).trim();
    return ISO_DATE.test(iso) ? iso : null;
  } catch {
    return null;
  }
}

function resourcesHaveLocalChanges(): boolean {
  try {
    const out = execFileSync(
      "git",
      ["status", "--porcelain", "--untracked-files=normal", "--", "resources"],
      {
        encoding: "utf8",
        cwd: process.cwd(),
        stdio: ["ignore", "pipe", "ignore"],
      },
    ).trim();
    return out.length > 0;
  } catch {
    return false;
  }
}

function resourcesMtimeIso(): string | null {
  try {
    const dir = join(process.cwd(), "resources");
    let max = 0;
    for (const name of readdirSync(dir)) {
      if (!name.endsWith(".md")) continue;
      const mtime = statSync(join(dir, name)).mtimeMs;
      if (mtime > max) max = mtime;
    }
    if (!max) return null;
    const date = new Date(max);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return null;
  }
}

export function maxIsoDate(dates: readonly (string | null | undefined)[]): string | null {
  let max: string | null = null;
  for (const date of dates) {
    if (!date || !ISO_DATE.test(date)) continue;
    if (!max || date > max) max = date;
  }
  return max;
}

export function siteLastUpdatedIso(): string {
  const notesCommit = gitIsoDate(["resources"]);
  const repoCommit = gitIsoDate([]);
  const localNotes = resourcesHaveLocalChanges() ? resourcesMtimeIso() : null;
  return (
    maxIsoDate([notesCommit, repoCommit, localNotes]) ??
    new Date().toISOString().slice(0, 10)
  );
}

export function formatSiteLastUpdated(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
