#!/usr/bin/env node
/**
 * Translate remaining RU files one-by-one with a hard per-file timeout.
 * node scripts/translate-ru-remaining.mjs
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const EN_DIR = path.join(ROOT, "resources/en");
const RU_DIR = path.join(ROOT, "resources/ru");
const SKIP = new Set(["0_me.md", "0_books.md", "0_developer.md", "0_intro.md"]);
const PROGRESS = path.join("/tmp", "translate-ru-remaining.log");

function fileTimeoutMs(name) {
  const size = fs.statSync(path.join(EN_DIR, name)).size;
  // ~10s per 2.5KB observed + headroom; min 3m, max 20m
  return Math.min(1_200_000, Math.max(180_000, Math.ceil(size / 2500) * 12_000 + 60_000));
}

function log(line) {
  const s = typeof line === "string" ? line : String(line);
  process.stderr.write(s);
  fs.appendFileSync(PROGRESS, s);
}

function looksOk(name) {
  const p = path.join(RU_DIR, name);
  if (!fs.existsSync(p)) return false;
  const ru = fs.readFileSync(p, "utf8");
  if (/<(подробности|сводка)/i.test(ru)) return false;
  if (/@@MC\d+@@/.test(ru) || /\uE000\d+\uE001/.test(ru)) return false;
  const cyr = (ru.match(/[\u0400-\u04FF]/g) || []).length;
  if (cyr <= 80) return false;
  const enPath = path.join(EN_DIR, name);
  if (!fs.existsSync(enPath)) return false;
  const strip = (t) => t.replace(/```[\s\S]*?```/g, "");
  const en = strip(fs.readFileSync(enPath, "utf8"));
  const body = strip(ru);
  const enD = (en.match(/<details\b/gi) || []).length;
  const ruD = (body.match(/<details\b/gi) || []).length;
  const enS = (en.match(/<summary\b/gi) || []).length;
  const ruS = (body.match(/<summary\b/gi) || []).length;
  return enD === ruD && enS === ruS;
}

function runFile(name) {
  return new Promise((resolve) => {
    const timeoutMs = fileTimeoutMs(name);
    const child = spawn(
      process.execPath,
      ["scripts/translate-ru-bodies.mjs", "--file", name, "--force"],
      {
        cwd: ROOT,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    child.stdout.on("data", (d) => log(d));
    child.stderr.on("data", (d) => log(d));
    const timer = setTimeout(() => {
      log(`TIMEOUT ${name} after ${Math.round(timeoutMs / 1000)}s — killing\n`);
      child.kill("SIGKILL");
    }, timeoutMs);
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ name, code, ok: looksOk(name) });
    });
  });
}

async function main() {
  fs.writeFileSync(PROGRESS, `start ${new Date().toISOString()}\n`);
  const names = fs
    .readdirSync(EN_DIR)
    .filter((n) => n.endsWith(".md") && !SKIP.has(n))
    .sort(
      (a, b) =>
        fs.statSync(path.join(EN_DIR, a)).size -
        fs.statSync(path.join(EN_DIR, b)).size,
    );

  let done = 0;
  let skipped = 0;
  let failed = 0;
  for (const name of names) {
    if (looksOk(name)) {
      skipped += 1;
      continue;
    }
    log(`\n=== ${name} ===\n`);
    const result = await runFile(name);
    if (result.ok) done += 1;
    else {
      failed += 1;
      log(`FAILED ${name} (exit ${result.code})\n`);
    }
  }
  const summary = `\nSummary: newly=${done} skipped=${skipped} failed=${failed} total=${names.length}\n`;
  log(summary);
  process.stdout.write(summary);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
