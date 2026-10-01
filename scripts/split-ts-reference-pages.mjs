#!/usr/bin/env node
/**
 * Split merged TypeScript reference files into official handbook pages.
 * - 5_ts_type_system.md → compatibility, inference (+ keeps variable_declaration)
 * - 5_ts_namespaces.md → namespaces, namespaces_modules, triple_slash
 */
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

function extractSection(content, startHeading, endHeading) {
  const start = content.indexOf(startHeading);
  if (start === -1) {
    throw new Error(`Missing section: ${startHeading}`);
  }
  const end =
    endHeading === null
      ? content.length
      : content.indexOf(endHeading, start + 1);
  if (end === -1) {
    throw new Error(`Missing end section after ${startHeading}: ${endHeading}`);
  }
  return content.slice(start, end).trimEnd();
}

function writeTopic(locale, filename, title, blurb, sections, body) {
  const back =
    locale === "ru"
      ? "[← Назад к хабу](./5_ts.md)"
      : "[← Back to hub](./5_ts.md)";
  const related =
    locale === "ru"
      ? "- [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)"
      : "- [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)";
  const sectionLines = sections.map((s) => `- ${s}`).join("\n");

  writeFileSync(
    join(ROOT, "resources", locale, filename),
    `# ${title}

${blurb}

${back}

### Related docs

${related}

### Sections

${sectionLines}

---

${body}
`,
    "utf8",
  );
  console.log(`wrote ${locale}/${filename}`);
}

for (const locale of ["en", "ru"]) {
  const typeSystem = readFileSync(
    join(ROOT, "resources", locale, "5_ts_type_system.md"),
    "utf8",
  );

  writeTopic(
    locale,
    "5_ts_type_compatibility.md",
    locale === "ru"
      ? "TypeScript — Type Compatibility"
      : "TypeScript — Type Compatibility",
    locale === "ru"
      ? "Structural subtyping, assignability, and function parameter variance."
      : "Structural subtyping, assignability, and function parameter variance.",
    ["[Type Compatibility](#type-compatibility)"],
    extractSection(typeSystem, "## Type Compatibility", "## Type Inference"),
  );

  writeTopic(
    locale,
    "5_ts_type_inference.md",
    locale === "ru"
      ? "TypeScript — Type Inference"
      : "TypeScript — Type Inference",
    locale === "ru"
      ? "Best common type, contextual typing, and inference without annotations."
      : "Best common type, contextual typing, and inference without annotations.",
    ["[Type Inference](#type-inference)"],
    extractSection(typeSystem, "## Type Inference", "## Variable Declaration"),
  );

  const variableBody = extractSection(
    typeSystem,
    "## Variable Declaration",
    null,
  );
  writeTopic(
    locale,
    "5_ts_variable_declaration.md",
    locale === "ru"
      ? "TypeScript — Variable Declaration"
      : "TypeScript — Variable Declaration",
    locale === "ru"
      ? "`var` vs `let` vs `const` and destructuring with types."
      : "`var` vs `let` vs `const` and destructuring with types.",
    [
      "[Variable Declaration](#variable-declaration)",
      "[Advanced topics](#advanced-topics)",
    ],
    variableBody,
  );

  unlinkSync(join(ROOT, "resources", locale, "5_ts_type_system.md"));
  console.log(`removed ${locale}/5_ts_type_system.md`);

  const namespaces = readFileSync(
    join(ROOT, "resources", locale, "5_ts_namespaces.md"),
    "utf8",
  );

  writeTopic(
    locale,
    "5_ts_namespaces.md",
    locale === "ru" ? "TypeScript — Namespaces" : "TypeScript — Namespaces",
    locale === "ru"
      ? "Legacy `namespace` organization and ambient declarations."
      : "Legacy `namespace` organization and ambient declarations.",
    ["[Namespaces](#namespaces)"],
    extractSection(namespaces, "## Namespaces", "## Namespaces and Modules"),
  );

  writeTopic(
    locale,
    "5_ts_namespaces_modules.md",
    locale === "ru"
      ? "TypeScript — Namespaces and Modules"
      : "TypeScript — Namespaces and Modules",
    locale === "ru"
      ? "When to use ES modules vs legacy namespaces."
      : "When to use ES modules vs legacy namespaces.",
    ["[Namespaces and Modules](#namespaces-and-modules)"],
    extractSection(
      namespaces,
      "## Namespaces and Modules",
      "## Triple-Slash Directives",
    ),
  );

  writeTopic(
    locale,
    "5_ts_triple_slash.md",
    locale === "ru"
      ? "TypeScript — Triple-Slash Directives"
      : "TypeScript — Triple-Slash Directives",
    locale === "ru"
      ? "Compiler directives, ambient declarations, and `declare`."
      : "Compiler directives, ambient declarations, and `declare`.",
    ["[Triple-Slash Directives](#triple-slash-directives)"],
    extractSection(namespaces, "## Triple-Slash Directives", null),
  );
}

console.log("Done split-ts-reference-pages.");
