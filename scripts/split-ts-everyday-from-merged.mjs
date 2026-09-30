#!/usr/bin/env node
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const locales = ["en", "ru"];
const RELATED_EN =
  "* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)";
const RELATED_RU =
  "* [TypeScript — hub](./5_ts.md) · [Интервью](./5_ts_interview.md)";

function slice(locale, start, end) {
  const lines = readFileSync(
    join("resources", locale, "5_ts_everyday.md"),
    "utf8",
  ).split("\n");
  return lines.slice(start - 1, end).join("\n");
}

function header(locale, title, blurb, section, related) {
  const back =
    locale === "ru"
      ? "[← Назад к хабу](./5_ts.md)"
      : "[← Back to hub](./5_ts.md)";
  const anchor = section.toLowerCase().replace(/\s+/g, "-").replace(/`/g, "");
  return `# ${title}

${blurb}

${back}

### Related docs

${related}

### Sections

- [${section}](#${anchor})

---

`;
}

const topics = [
  {
    file: "5_ts_primitives.md",
    titleEn: "TypeScript — Primitives",
    titleRu: "TypeScript — Primitives",
    blurbEn: "`string`, `number`, `boolean`, `bigint`, and `symbol`.",
    blurbRu: "`string`, `number`, `boolean`, `bigint` и `symbol`.",
    section: "Primitives",
    start: 24,
    end: 99,
  },
  {
    file: "5_ts_arrays.md",
    titleEn: "TypeScript — Arrays",
    titleRu: "TypeScript — Arrays",
    blurbEn: "Typed arrays: `number[]` and `Array<T>`.",
    blurbRu: "Типизированные массивы: `number[]` и `Array<T>`.",
    section: "Arrays",
    start: 100,
    end: 130,
  },
  {
    file: "5_ts_top_types.md",
    titleEn: "TypeScript — any, unknown, never",
    titleRu: "TypeScript — any, unknown, never",
    blurbEn: "Top and bottom types — when to use each.",
    blurbRu: "Верхние и нижние типы — когда что использовать.",
    section: "Top types",
    start: 131,
    end: 238,
  },
  {
    file: "5_ts_type_annotations.md",
    titleEn: "TypeScript — Type Annotations",
    titleRu: "TypeScript — Type Annotations",
    blurbEn: "Explicit type labels on variables and when to omit them.",
    blurbRu: "Явные аннотации типов на переменных и когда их не нужно писать.",
    section: "Type annotations",
    start: 239,
    end: 271,
  },
  {
    file: "5_ts_unions_literals.md",
    titleEn: "TypeScript — Unions & Literals",
    titleRu: "TypeScript — Unions & Literals",
    blurbEn: "Union types (`A | B`) and string/number literal types.",
    blurbRu: "Объединения (`A | B`) и литеральные типы.",
    section: "Unions and literals",
    start: 272,
    end: 365,
  },
  {
    file: "5_ts_aliases_interfaces.md",
    titleEn: "TypeScript — Aliases & Interfaces",
    titleRu: "TypeScript — Aliases & Interfaces",
    blurbEn: "`type` aliases, `interface`, and when to use which.",
    blurbRu: "Псевдонимы `type`, `interface` и когда что выбирать.",
    section: "Aliases and interfaces",
    start: 366,
    end: 510,
  },
  {
    file: "5_ts_assertions.md",
    titleEn: "TypeScript — Assertions & satisfies",
    titleRu: "TypeScript — Assertions & satisfies",
    blurbEn: "Type assertions (`as`) and the `satisfies` operator.",
    blurbRu: "Утверждения типов (`as`) и оператор `satisfies`.",
    section: "Assertions and satisfies",
    start: 511,
    end: 583,
  },
  {
    file: "5_ts_null_undefined.md",
    titleEn: "TypeScript — null & undefined",
    titleRu: "TypeScript — null & undefined",
    blurbEn: "Absence types and `strictNullChecks` behavior.",
    blurbRu: "Типы отсутствия значения и `strictNullChecks`.",
    section: "null and undefined",
    start: 584,
    end: 9999,
  },
];

for (const locale of locales) {
  const related = locale === "ru" ? RELATED_RU : RELATED_EN;
  for (const t of topics) {
    const title = locale === "ru" ? t.titleRu : t.titleEn;
    const blurb = locale === "ru" ? t.blurbRu : t.blurbEn;
    writeFileSync(
      join("resources", locale, t.file),
      header(locale, title, blurb, t.section, related) +
        slice(locale, t.start, t.end) +
        "\n",
      "utf8",
    );
    console.log(`wrote ${locale}/${t.file}`);
  }
  unlinkSync(join("resources", locale, "5_ts_everyday.md"));
  console.log(`deleted ${locale}/5_ts_everyday.md`);
}

console.log("Done.");
