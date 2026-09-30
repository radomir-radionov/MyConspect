#!/usr/bin/env node
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const locales = ["en", "ru"];

const RELATED_EN =
  "* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)";
const RELATED_RU =
  "* [TypeScript — hub](./5_ts.md) · [Интервью](./5_ts_interview.md)";

function lines(locale, file) {
  return readFileSync(join("resources", locale, file), "utf8").split("\n");
}

function slice(locale, file, start, end) {
  return lines(locale, file)
    .slice(start - 1, end)
    .join("\n");
}

function header(locale, title, blurb, sectionTitle, related) {
  const back =
    locale === "ru"
      ? "[← Назад к хабу](./5_ts.md)"
      : "[← Back to hub](./5_ts.md)";
  const anchor = sectionTitle
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/`/g, "");
  return `# ${title}

${blurb}

${back}

### Related docs

${related}

### Sections

- [${sectionTitle}](#${anchor})

---

## ${sectionTitle}

<details>
  <summary>${sectionTitle}</summary>

`;
}

const topics = [
  {
    file: "5_ts_primitives.md",
    slug: "ts-primitives",
    titleEn: "TypeScript — Primitives",
    titleRu: "TypeScript — Примитивы",
    blurbEn: "`string`, `number`, `boolean`, `bigint`, and `symbol`.",
    blurbRu: "`string`, `number`, `boolean`, `bigint` и `symbol`.",
    section: "Primitives",
    ranges: [
      [22, 53],
      [616, 649],
    ],
  },
  {
    file: "5_ts_arrays.md",
    slug: "ts-arrays",
    titleEn: "TypeScript — Arrays",
    titleRu: "TypeScript — Массивы",
    blurbEn: "Typed arrays: `number[]` and `Array<T>`.",
    blurbRu: "Типизированные массивы: `number[]` и `Array<T>`.",
    section: "Arrays",
    ranges: [[55, 76]],
  },
  {
    file: "5_ts_top_types.md",
    slug: "ts-top-types",
    titleEn: "TypeScript — any, unknown, never",
    titleRu: "TypeScript — any, unknown, never",
    blurbEn: "Top and bottom types — when to use each.",
    blurbRu: "Верхние и нижние типы — когда что использовать.",
    section: "Top types",
    ranges: [[78, 176]],
  },
  {
    file: "5_ts_type_annotations.md",
    slug: "ts-type-annotations",
    titleEn: "TypeScript — Type Annotations",
    titleRu: "TypeScript — Аннотации типов",
    blurbEn: "Explicit type labels on variables and when to omit them.",
    blurbRu: "Явные аннотации типов на переменных и когда их не нужно писать.",
    section: "Type annotations",
    ranges: [[178, 201]],
  },
  {
    file: "5_ts_unions_literals.md",
    slug: "ts-unions-literals",
    titleEn: "TypeScript — Unions & Literals",
    titleRu: "TypeScript — Объединения и литералы",
    blurbEn: "Union types (`A | B`) and string/number literal types.",
    blurbRu: "Объединения (`A | B`) и литеральные типы.",
    section: "Unions and literals",
    ranges: [
      [296, 343],
      [547, 582],
    ],
  },
  {
    file: "5_ts_aliases_interfaces.md",
    slug: "ts-aliases-interfaces",
    titleEn: "TypeScript — Aliases & Interfaces",
    titleRu: "TypeScript — Псевдонимы и интерфейсы",
    blurbEn: "`type` aliases, `interface`, and when to use which.",
    blurbRu: "Псевдонимы `type`, `interface` и когда что выбирать.",
    section: "Aliases and interfaces",
    ranges: [[345, 480]],
  },
  {
    file: "5_ts_assertions.md",
    slug: "ts-assertions",
    titleEn: "TypeScript — Assertions & satisfies",
    titleRu: "TypeScript — Утверждения и satisfies",
    blurbEn: "Type assertions (`as`) and the `satisfies` operator.",
    blurbRu: "Утверждения типов (`as`) и оператор `satisfies`.",
    section: "Assertions and satisfies",
    ranges: [[482, 545]],
  },
  {
    file: "5_ts_null_undefined.md",
    slug: "ts-null-undefined",
    titleEn: "TypeScript — null & undefined",
    titleRu: "TypeScript — null и undefined",
    blurbEn: "Absence types and `strictNullChecks` behavior.",
    blurbRu: "Типы отсутствия значения и `strictNullChecks`.",
    section: "null and undefined",
    ranges: [[584, 609]],
  },
];

for (const locale of locales) {
  const related = locale === "ru" ? RELATED_RU : RELATED_EN;
  const source = "5_ts_everyday.md";
  for (const t of topics) {
    const title = locale === "ru" ? t.titleRu : t.titleEn;
    const blurb = locale === "ru" ? t.blurbRu : t.blurbEn;
    const body = t.ranges
      .map(([s, e]) => slice(locale, source, s, e))
      .join("\n\n");
    const content =
      header(locale, title, blurb, t.section, related) +
      body +
      "\n\n</details>\n";
    writeFileSync(join("resources", locale, t.file), content, "utf8");
    console.log(`wrote ${locale}/${t.file}`);
  }
  try {
    unlinkSync(join("resources", locale, source));
    console.log(`deleted ${locale}/${source}`);
  } catch {
    /* already gone */
  }
}

console.log("Done.");
