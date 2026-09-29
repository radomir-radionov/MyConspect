import {
  bundledLanguages,
  getSingletonHighlighter,
  type BundledLanguage,
  type Highlighter,
} from "shiki";

const THEMES = {
  light: "light-plus",
  dark: "dark-plus",
} as const;

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

let highlighterPromise: Promise<Highlighter> | undefined;

function sharedHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= getSingletonHighlighter({
    themes: [THEMES.light, THEMES.dark],
    langs: [],
  });
  return highlighterPromise;
}

export async function highlightMarkdownFences(
  markdown: string,
): Promise<string> {
  const matches = [...markdown.matchAll(FENCE_RE)];
  if (matches.length === 0) {
    return markdown;
  }

  const jobs = matches.map((match) => {
    const langLabel = match[1] || "text";
    const code = (match[2] ?? "").replace(/\n$/, "");
    return { langLabel, code, lang: resolveLang(langLabel) };
  });

  const langs = [
    ...new Set(jobs.flatMap((job) => (job.lang ? [job.lang] : []))),
  ];
  const highlighter = langs.length > 0 ? await sharedHighlighter() : undefined;
  if (highlighter && langs.length > 0) {
    await highlighter.loadLanguage(...langs);
  }

  const rendered = await Promise.all(
    jobs.map((job) =>
      renderCodeBlock(job.code, job.langLabel, job.lang, highlighter),
    ),
  );

  let result = "";
  let lastIndex = 0;
  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const index = match.index ?? 0;
    result += markdown.slice(lastIndex, index);
    result += `\n\n${rendered[i]}\n\n`;
    lastIndex = index + match[0].length;
  }

  result += markdown.slice(lastIndex);
  return result;
}

async function renderCodeBlock(
  code: string,
  langLabel: string,
  lang: BundledLanguage | null,
  highlighter: Highlighter | undefined,
): Promise<string> {
  const label = langLabel.trim() || "text";
  let highlighted: string;

  if (lang && highlighter) {
    try {
      highlighted = highlighter.codeToHtml(code, {
        lang,
        themes: THEMES,
        defaultColor: false,
      });
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
