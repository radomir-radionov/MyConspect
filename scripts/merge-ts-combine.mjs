#!/usr/bin/env node
import { readFileSync, writeFileSync, unlinkSync, readdirSync } from "node:fs";
import { join } from "node:path";

function extractDetails(content) {
  const start = content.indexOf("<details>");
  const end = content.lastIndexOf("</details>");
  if (start === -1) return "";
  return content.slice(start, end + "</details>".length);
}

function mergeFiles(locale, outFile, inputs, title, blurb, sections) {
  const related =
    locale === "ru"
      ? "* [TypeScript — hub](./5_ts.md) · [Интервью](./5_ts_interview.md)"
      : "* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)";
  const back =
    locale === "ru"
      ? "[← Назад к хабу](./5_ts.md)"
      : "[← Back to hub](./5_ts.md)";
  const sectionLines = sections.map((s) => `- ${s}`).join("\n");
  const bodies = inputs
    .map((f) => {
      const c = readFileSync(join("resources", locale, f), "utf8");
      const details = extractDetails(c);
      const h2 = c.match(/^## (.+)$/m);
      return h2 ? `\n## ${h2[1]}\n\n${details}\n` : details;
    })
    .join("\n");

  writeFileSync(
    join("resources", locale, outFile),
    `# ${title}

${blurb}

${back}

### Related docs

${related}

### Sections

${sectionLines}

---
${bodies}`,
    "utf8",
  );
  console.log(`merged ${locale}/${outFile}`);
}

const commonInputs = [
  "5_ts_primitives.md",
  "5_ts_arrays.md",
  "5_ts_top_types.md",
  "5_ts_type_annotations.md",
  "5_ts_unions_literals.md",
  "5_ts_aliases_interfaces.md",
  "5_ts_assertions.md",
  "5_ts_null_undefined.md",
];

const commonSections = [
  "[Primitives](#primitives)",
  "[Arrays](#arrays)",
  "[Top types](#top-types)",
  "[Type annotations](#type-annotations)",
  "[Unions and literals](#unions-and-literals)",
  "[Aliases and interfaces](#aliases-and-interfaces)",
  "[Assertions and satisfies](#assertions-and-satisfies)",
  "[null and undefined](#null-and-undefined)",
];

for (const locale of ["en", "ru"]) {
  mergeFiles(
    locale,
    "5_ts_everyday.md",
    commonInputs,
    locale === "ru"
      ? "TypeScript — Everyday Types"
      : "TypeScript — Everyday Types",
    locale === "ru"
      ? "Примитивы, массивы, объединения, интерфейсы, литералы и повседневные типы."
      : "Primitives, arrays, unions, interfaces, literals, and everyday types.",
    commonSections,
  );
  for (const f of commonInputs) {
    unlinkSync(join("resources", locale, f));
  }

  // Reference: namespaces + namespaces_modules + triple_slash
  const ns1 = readFileSync(
    join("resources", locale, "5_ts_namespaces.md"),
    "utf8",
  );
  const ns2 = readFileSync(
    join("resources", locale, "5_ts_namespaces_modules.md"),
    "utf8",
  );
  const ns3 = readFileSync(
    join("resources", locale, "5_ts_triple_slash.md"),
    "utf8",
  );
  const related =
    locale === "ru"
      ? "* [TypeScript — hub](./5_ts.md) · [Интервью](./5_ts_interview.md)"
      : "* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)";
  writeFileSync(
    join("resources", locale, "5_ts_namespaces.md"),
    `# TypeScript — Namespaces & Modules

Legacy namespaces, ES modules comparison, and triple-slash directives.

${locale === "ru" ? "[← Назад к хабу](./5_ts.md)" : "[← Back to hub](./5_ts.md)"}

### Related docs

${related}

### Sections

- [Namespaces](#namespaces)
- [Namespaces and Modules](#namespaces-and-modules)
- [Triple-Slash Directives](#triple-slash-directives)

---

${extractDetails(ns1).replace(/<summary>Namespaces<\/summary>/, "<summary>Namespaces</summary>")}

## Namespaces and Modules

${extractDetails(ns2)}

## Triple-Slash Directives

${extractDetails(ns3)}
`,
    "utf8",
  );
  unlinkSync(join("resources", locale, "5_ts_namespaces_modules.md"));
  unlinkSync(join("resources", locale, "5_ts_triple_slash.md"));

  // Reference: type compatibility + inference + variable declaration
  const tc = readFileSync(
    join("resources", locale, "5_ts_type_compatibility.md"),
    "utf8",
  );
  const ti = readFileSync(
    join("resources", locale, "5_ts_type_inference.md"),
    "utf8",
  );
  const vd = readFileSync(
    join("resources", locale, "5_ts_variable_declaration.md"),
    "utf8",
  );
  const adv = vd.includes("## Advanced topics")
    ? vd.slice(vd.indexOf("## Advanced topics"))
    : "";
  writeFileSync(
    join("resources", locale, "5_ts_type_system.md"),
    `# TypeScript — Type System

Type compatibility, inference, and variable declarations.

${locale === "ru" ? "[← Назад к хабу](./5_ts.md)" : "[← Back to hub](./5_ts.md)"}

### Related docs

${related}

### Sections

- [Type Compatibility](#type-compatibility)
- [Type Inference](#type-inference)
- [Variable Declaration](#variable-declaration)
- [Advanced topics](#advanced-topics)

---

## Type Compatibility

${extractDetails(tc)}

## Type Inference

${extractDetails(ti)}

## Variable Declaration

${extractDetails(vd.split("## Advanced topics")[0])}

${adv}
`,
    "utf8",
  );
  unlinkSync(join("resources", locale, "5_ts_type_compatibility.md"));
  unlinkSync(join("resources", locale, "5_ts_type_inference.md"));
  unlinkSync(join("resources", locale, "5_ts_variable_declaration.md"));
}

console.log("Done merge.");
