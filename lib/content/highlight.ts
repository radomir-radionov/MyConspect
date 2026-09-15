import { bundledLanguages, codeToHtml, type BundledLanguage } from "shiki";

const THEME = "light-plus";

const LANG_ALIASES: Record<string, BundledLanguage> = {
  js: "javascript",
  ts: "typescript",
  puthon: "python",
  dockerfile: "docker",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
};

const FENCE_RE = /^```([a-zA-Z0-9_+-]*)[^\n]*\r?\n([\s\S]*?)^```[ \t]*$/gm;

export async function highlightMarkdownFences(markdown: string): Promise<string> {
  const matches = [...markdown.matchAll(FENCE_RE)];
  if (matches.length === 0) {
    return markdown;
  }

  let result = "";
  let lastIndex = 0;

  for (const match of matches) {
    const index = match.index ?? 0;
    result += markdown.slice(lastIndex, index);
    const langLabel = match[1] || "text";
    const code = (match[2] ?? "").replace(/\n$/, "");
    result += `\n\n${await renderCodeBlock(code, langLabel)}\n\n`;
    lastIndex = index + match[0].length;
  }

  result += markdown.slice(lastIndex);
  return result;
}

async function renderCodeBlock(code: string, langLabel: string): Promise<string> {
  const lang = resolveLang(langLabel);
  const label = langLabel.trim() || "text";
  let highlighted: string;

  if (lang) {
    try {
      highlighted = await codeToHtml(code, { lang, theme: THEME });
    } catch {
      highlighted = plainCodeHtml(code);
    }
  } else {
    highlighted = plainCodeHtml(code);
  }

  return `<div class="md-code"><div class="md-code__meta">${escapeHtml(label)}</div>${highlighted}</div>`;
}

function plainCodeHtml(code: string): string {
  return `<pre><code>${escapeHtml(code)}</code></pre>`;
}

function resolveLang(lang: string): BundledLanguage | null {
  const key = lang.trim().toLowerCase();
  if (!key) {
    return null;
  }
  if (key in LANG_ALIASES) {
    return LANG_ALIASES[key];
  }
  if (key in bundledLanguages) {
    return key as BundledLanguage;
  }
  return null;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
