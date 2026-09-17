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
    return new Date(max).toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

export function siteLastUpdatedIso(): string {
  return (
    gitIsoDate(["resources"]) ??
    gitIsoDate([]) ??
    resourcesMtimeIso() ??
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
