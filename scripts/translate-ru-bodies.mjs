/**
 * Translate RU twins. Preserves markers, headings, summaries, code, HTML.
 * Primary: Google gtx. Fallback: MyMemory (when not quota-blocked).
 * node scripts/translate-ru-bodies.mjs [--file name.md] [--force] [--limit N]
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const EN_DIR = path.join(ROOT, "resources/en");
const RU_DIR = path.join(ROOT, "resources/ru");
const SKIP = new Set(["0_me.md", "0_books.md", "0_developer.md", "0_intro.md"]);

let myMemoryBlocked = false;

function parseArgs(argv) {
  let limit = Infinity;
  let file;
  let force = false;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--limit") limit = Number(argv[++i]);
    else if (argv[i] === "--file") file = argv[++i];
    else if (argv[i] === "--force") force = true;
  }
  return { limit, file, force };
}

function protect(text) {
  const blocks = [];
  const push = (m) => {
    // ASCII tokens survive Google/MyMemory better than PUA code points.
    const key = `@@MC${blocks.length}@@`;
    blocks.push(m);
    return key;
  };
  // Fences and inline code first so HTML inside them is not tokenized.
  let out = text.replace(/```[\s\S]*?```/g, push);
  out = out.replace(/`[^`\n]+`/g, push);
  out = out.replace(/<summary\b[^>]*>[\s\S]*?<\/summary>/gi, push);
  out = out.replace(/<\/?[a-zA-Z][^>]*>/g, push);
  out = out.replace(/^#{1,6}\s+.+$/gm, push);
  out = out.replace(/^\*\*[^*]+:\*\*/gm, push);
  out = out.replace(/^\s*[-*]\s*\[[^\]]+\]\(#.+\)\s*$/gm, push);
  out = out.replace(/^\s*<!--[\s\S]*?-->\s*$/gm, push);
  return { out, blocks };
}

function restore(text, blocks) {
  let out = text;
  for (let pass = 0; pass < 8; pass += 1) {
    let hits = 0;
    out = out.replace(/@@MC(\d+)@@/g, (_, i) => {
      const block = blocks[Number(i)];
      if (block === undefined) {
        throw new Error(`missing protect block ${i}`);
      }
      hits += 1;
      return block;
    });
    if (hits === 0) break;
  }
  return out;
}

function stripFenced(text) {
  return text.replace(/```[\s\S]*?```/g, "");
}

function structureFingerprint(text) {
  const body = stripFenced(text);
  return {
    details: (body.match(/<details\b/gi) || []).length,
    summaries: (body.match(/<summary\b/gi) || []).length,
  };
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function unwrapGoogle(data) {
  if (Array.isArray(data) && typeof data[0] === "string") return data[0];
  if (Array.isArray(data?.[0]) && typeof data[0][0] === "string") {
    return data.map((row) => (Array.isArray(row) ? row[0] : "")).join("");
  }
  if (Array.isArray(data?.[0]) && Array.isArray(data[0][0])) {
    return data[0].map((row) => row?.[0] ?? "").join("");
  }
  throw new Error("Google unexpected shape");
}

async function translateGoogle(text) {
  const url = new URL("https://clients5.google.com/translate_a/t");
  url.searchParams.set("client", "dict-chrome-ex");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", "ru");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": UA,
    },
    body: new URLSearchParams({ q: text }),
    signal: AbortSignal.timeout(20000),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`Google HTTP ${res.status}`);
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Google bad JSON ${raw.slice(0, 80)}`);
  }
  const out = unwrapGoogle(data);
  if (!out) throw new Error("Google empty text");
  return out;
}

async function translateMyMemory(text) {
  if (myMemoryBlocked) throw new Error("MyMemory quota");
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", "en|ru");
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
  const data = await res.json();
  const out = data?.responseData?.translatedText;
  if (/MYMEMORY WARNING|YOU USED ALL AVAILABLE/i.test(String(out || ""))) {
    myMemoryBlocked = true;
    throw new Error("MyMemory quota");
  }
  if (!out || Number(data.responseStatus) !== 200) {
    throw new Error(String(data?.responseDetails || "MyMemory empty"));
  }
  return out;
}

async function translateChunk(text) {
  try {
    return await translateGoogle(text);
  } catch (googleErr) {
    try {
      return await translateMyMemory(text);
    } catch {
      throw googleErr;
    }
  }
}

function splitForApi(text, max = 420) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    let end = Math.min(i + max, text.length);
    if (end < text.length) {
      const slice = text.slice(i, end);
      const breakAt = Math.max(
        slice.lastIndexOf("\n\n"),
        slice.lastIndexOf("\n"),
        slice.lastIndexOf(". "),
        slice.lastIndexOf("; "),
      );
      if (breakAt > 40) end = i + breakAt + (slice[breakAt] === "." ? 2 : 1);
    }
    chunks.push(text.slice(i, end));
    i = end;
  }
  return chunks;
}

async function translateText(text) {
  const trimmed = text.trim();
  if (trimmed.length < 3) return text;
  const letters = trimmed.replace(/[^A-Za-z]/g, "");
  if (letters.length < 3) return text;
  const leading = text.match(/^\s*/)?.[0] ?? "";
  const trailing = text.match(/\s*$/)?.[0] ?? "";
  const parts = [];
  for (const chunk of splitForApi(trimmed)) {
    if (chunk.replace(/[^A-Za-z]/g, "").length < 3) {
      parts.push(chunk);
      continue;
    }
    let attempt = 0;
    for (;;) {
      try {
        parts.push(await translateChunk(chunk));
        break;
      } catch (error) {
        attempt += 1;
        if (attempt > 4) {
          process.stderr.write(`  keep EN chunk (${error})\n`);
          parts.push(chunk);
          break;
        }
        await new Promise((r) => setTimeout(r, 1200 * attempt));
      }
    }
    await new Promise((r) => setTimeout(r, 350));
  }
  return `${leading}${parts.join("")}${trailing}`;
}

async function translateFile(name) {
  const raw = fs.readFileSync(path.join(EN_DIR, name), "utf8");
  const { out, blocks } = protect(raw);
  const tokens = out.split(/(@@MC\d+@@)/);
  const merged = [];
  let buf = "";
  const flush = async () => {
    if (!buf) return;
    merged.push(await translateText(buf));
    buf = "";
  };
  for (const token of tokens) {
    if (/^@@MC\d+@@$/.test(token)) {
      await flush();
      merged.push(token);
    } else {
      buf += token;
      if (buf.length > 1800) await flush();
    }
  }
  await flush();
  let translated = merged.join("");
  // Google occasionally inserts spaces inside tokens
  translated = translated.replace(/@@\s*MC\s*(\d+)\s*@@/gi, "@@MC$1@@");
  translated = restore(translated, blocks);
  if (/<(подробности|сводка)/i.test(translated)) {
    throw new Error(`${name}: HTML corrupted`);
  }
  if (/@@MC\d+@@/.test(translated) || /\uE000\d+\uE001/.test(translated)) {
    throw new Error(`${name}: protect tokens leaked`);
  }
  const enFp = structureFingerprint(raw);
  const ruFp = structureFingerprint(translated);
  if (enFp.details !== ruFp.details || enFp.summaries !== ruFp.summaries) {
    throw new Error(
      `${name}: structure drift details ${enFp.details}->${ruFp.details} summaries ${enFp.summaries}->${ruFp.summaries}`,
    );
  }
  fs.writeFileSync(path.join(RU_DIR, name), translated, "utf8");
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
  const enFp = structureFingerprint(fs.readFileSync(enPath, "utf8"));
  const ruFp = structureFingerprint(ru);
  return enFp.details === ruFp.details && enFp.summaries === ruFp.summaries;
}

async function main() {
  const { limit, file, force } = parseArgs(process.argv.slice(2));
  let names = file
    ? [file]
    : fs.readdirSync(EN_DIR).filter((n) => n.endsWith(".md") && !SKIP.has(n));
  names.sort(
    (a, b) =>
      fs.statSync(path.join(EN_DIR, a)).size - fs.statSync(path.join(EN_DIR, b)).size,
  );
  let done = 0;
  for (const name of names) {
    if (done >= limit) break;
    if (!force && looksOk(name)) {
      process.stderr.write(`skip ok ${name}\n`);
      continue;
    }
    const size = fs.statSync(path.join(EN_DIR, name)).size;
    process.stderr.write(`translating ${name} (${size}b)...\n`);
    const t0 = Date.now();
    await translateFile(name);
    process.stderr.write(`done ${name} in ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
    done += 1;
  }
  process.stdout.write(`Translated ${done} files\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
