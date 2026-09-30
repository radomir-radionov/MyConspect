#!/usr/bin/env node
/**
 * RU locale split — mirrors split-ts-restructure.mjs using resources/ru sources.
 */
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { join } from "node:path";

const RU = join("resources", "ru");
const EN = join("resources", "en");

const RELATED =
  "* [TypeScript — hub](./5_ts.md) · [Интервью](./5_ts_interview.md)";

function lines(path) {
  return readFileSync(join(RU, path), "utf8").split("\n");
}

function slice(path, start, end) {
  return lines(path)
    .slice(start - 1, end)
    .join("\n");
}

function header(titleRu, blurbRu, sections) {
  const sectionLines = sections.map((s) => `- ${s}`).join("\n");
  return `# ${titleRu}

${blurbRu}

[← Назад к хабу](./5_ts.md)

### Related docs

${RELATED}

### Sections

${sectionLines}

---

`;
}

function writeRu(name, content) {
  writeFileSync(join(RU, name), content, "utf8");
  console.log("wrote ru/", name);
}

// Copy EN modules (new content) — translate headers only
const modulesEn = readFileSync(join(EN, "5_ts_modules.md"), "utf8");
writeRu(
  "5_ts_modules.md",
  modulesEn
    .replace("# TypeScript — Modules", "# TypeScript — Модули")
    .replace(
      "ES modules: `import`/`export`, type-only imports, and module resolution in tsconfig.",
      "ES-модули: `import`/`export`, импорты только типов и разрешение модулей в tsconfig.",
    )
    .replace("[← Back to hub]", "[← Назад к хабу]")
    .replace(
      "* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)",
      RELATED,
    ),
);

// Basics + everyday from ru core (same line numbers as EN)
writeRu(
  "5_ts_basics.md",
  header(
    "TypeScript — Основы",
    "Статическая проверка типов, компилятор, tsconfig и краткое введение для JavaScript-разработчиков.",
    [
      "[Static typing & basics](#static-typing-basics)",
      "[Compiler & tsconfig](#compiler-tsconfig)",
    ],
  ) + slice("5_ts_core.md", 19, 516),
);

writeRu(
  "5_ts_everyday.md",
  header(
    "TypeScript — Повседневные типы",
    "Примитивы, массивы, объекты, объединения, интерфейсы и литеральные типы.",
    ["[Everyday types](#everyday-types)"],
  ) +
    slice("5_ts_core.md", 517, 1110) +
    "\n\n### Enums\n\nСм. [Enums](./5_ts_enums.md).\n\n" +
    slice("5_ts_core.md", 1225, 1258),
);

const classesRuBody = slice("5_ts_objects.md", 557, 1285);

writeRu(
  "5_ts_objects.md",
  header(
    "TypeScript — Типы объектов",
    "Формы объектов, интерфейсы, необязательные и readonly-свойства, кортежи.",
    ["[Object types](#object-types)"],
  ) +
    slice("5_ts_objects.md", 19, 556) +
    "\n\n## Classes & OOP\n\nПеренесено в [Classes](./5_ts_classes.md).\n",
);

writeRu(
  "5_ts_classes.md",
  header(
    "TypeScript — Классы",
    "Классы, модификаторы доступа, наследование, абстрактные классы и `implements`.",
    [
      "[Classes & OOP](#classes-oop)",
      "[Design principles](#design-principles)",
    ],
  ) + classesRuBody,
);

writeRu(
  "5_ts_type_manipulation.md",
  header(
    "TypeScript — Манипуляции с типами",
    "Generics, keyof, typeof, индексный доступ, условные и отображаемые типы.",
    ["[Generics & type operators](#generics-type-operators)"],
  ) + slice("5_ts_generics.md", 18, 538),
);

writeRu(
  "5_ts_utility_types.md",
  header(
    "TypeScript — Utility Types",
    "Встроенные utility types: Partial, Pick, Omit, Record, ReturnType и др.",
    ["[Utility types](#utility-types)"],
  ) + slice("5_ts_generics.md", 539, 1111),
);

// Reference splits — same line numbers as EN reference
const refBody = slice("5_ts_reference.md", 20, 1561);

function extractRef(titleRu, blurbRu, sectionAnchor, startMarker, endMarker) {
  const startIdx = refBody.indexOf(startMarker);
  const endIdx = endMarker ? refBody.indexOf(endMarker) : refBody.length;
  const body = refBody.slice(startIdx, endIdx === -1 ? undefined : endIdx);
  const anchor = sectionAnchor
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/`/g, "");
  return (
    header(titleRu, blurbRu, [`[${sectionAnchor}](#${anchor})`]) +
    `\n## ${sectionAnchor}\n\n<details>\n  <summary>${sectionAnchor}</summary>\n\n` +
    body +
    "\n\n</details>\n"
  );
}

writeRu(
  "5_ts_cheat_sheets.md",
  extractRef(
    "TypeScript — Cheat Sheets",
    "Краткие справочные карточки и чеклист для собеседований.",
    "Cheat Sheets",
    "### Cheat Sheets",
    "### Decorators",
  ),
);
writeRu(
  "5_ts_decorators.md",
  extractRef(
    "TypeScript — Decorators",
    "Декораторы stage 2 и stage 3 для классов и членов.",
    "Decorators",
    "### Decorators",
    "### Declaration Merging",
  ),
);
writeRu(
  "5_ts_declaration_merging.md",
  extractRef(
    "TypeScript — Declaration Merging",
    "Слияние interface, namespace, class и enum.",
    "Declaration Merging",
    "### Declaration Merging",
    "### Enums",
  ),
);

const enumsRef = refBody.slice(
  refBody.indexOf("### Enums"),
  refBody.indexOf("### Iterators and Generators"),
);
const enumsCore = slice("5_ts_core.md", 1111, 1224);
writeRu(
  "5_ts_enums.md",
  header(
    "TypeScript — Enums",
    "Числовые и строковые enum, const enum и `as const`.",
    ["[Enums](#enums)"],
  ) +
    `\n## Enums\n\n<details>\n  <summary>Enums</summary>\n\n` +
    enumsCore +
    "\n\n" +
    enumsRef +
    "\n\n</details>\n",
);

writeRu(
  "5_ts_iterators.md",
  extractRef(
    "TypeScript — Iterators and Generators",
    "Итераторы, генераторы и `for..of`.",
    "Iterators and Generators",
    "### Iterators and Generators",
    "### JSX",
  ),
);
writeRu(
  "5_ts_jsx.md",
  extractRef(
    "TypeScript — JSX",
    "JSX в `.tsx` и типизация компонентов.",
    "JSX",
    "### JSX",
    "### Mixins",
  ),
);
writeRu(
  "5_ts_mixins.md",
  extractRef(
    "TypeScript — Mixins",
    "Композиция классов из частичных блоков.",
    "Mixins",
    "### Mixins",
    "### Namespaces",
  ),
);
writeRu(
  "5_ts_namespaces.md",
  extractRef(
    "TypeScript — Namespaces",
    "Legacy `namespace` и ambient-декларации.",
    "Namespaces",
    "### Namespaces",
    "### Namespaces and Modules",
  ),
);
writeRu(
  "5_ts_namespaces_modules.md",
  extractRef(
    "TypeScript — Namespaces and Modules",
    "ES-модули против legacy namespaces.",
    "Namespaces and Modules",
    "### Namespaces and Modules",
    "### Symbols",
  ),
);
writeRu(
  "5_ts_symbols.md",
  extractRef(
    "TypeScript — Symbols",
    "Уникальные ключи и `unique symbol`.",
    "Symbols",
    "### Symbols",
    "### Triple-Slash Directives",
  ),
);
writeRu(
  "5_ts_triple_slash.md",
  extractRef(
    "TypeScript — Triple-Slash Directives",
    "Директивы компилятора и `declare`.",
    "Triple-Slash Directives",
    "### Triple-Slash Directives",
    "### Type Compatibility",
  ),
);
writeRu(
  "5_ts_type_compatibility.md",
  extractRef(
    "TypeScript — Type Compatibility",
    "Структурная совместимость типов.",
    "Type Compatibility",
    "### Type Compatibility",
    "### Type Inference",
  ),
);
writeRu(
  "5_ts_type_inference.md",
  extractRef(
    "TypeScript — Type Inference",
    "Вывод типов и контекстная типизация.",
    "Type Inference",
    "### Type Inference",
    "### Variable Declaration",
  ),
);
writeRu(
  "5_ts_variable_declaration.md",
  extractRef(
    "TypeScript — Variable Declaration",
    "`var` vs `let` vs `const` и деструктуризация.",
    "Variable Declaration",
    "### Variable Declaration",
    null,
  ) +
    "\n\n## Advanced topics\n\n<details>\n  <summary>Modern TypeScript</summary>\n\n" +
    slice("5_ts_reference.md", 1570, 1594) +
    "\n\n</details>\n",
);

// Update kept files
for (const f of [
  "5_ts_narrowing.md",
  "5_ts_functions.md",
  "5_ts_interview.md",
]) {
  let c = readFileSync(join(RU, f), "utf8");
  c = c.replace(/[*-] \[TypeScript[^\n]+\n/m, `${RELATED}\n`);
  if (f === "5_ts_functions.md") {
    c = c.replace("# TypeScript — Функции", "# TypeScript — More on Functions");
  }
  c = c.replaceAll("./5_ts_core.md", "./5_ts_everyday.md");
  c = c.replaceAll("./5_ts_generics.md", "./5_ts_type_manipulation.md");
  c = c.replaceAll("./5_ts_reference.md", "./5_ts.md");
  writeFileSync(join(RU, f), c, "utf8");
}

// Hub
const hubEn = readFileSync(join(EN, "5_ts.md"), "utf8");
writeRu(
  "5_ts.md",
  hubEn
    .replace("# TypeScript — hub", "# TypeScript — хаб")
    .replace(
      "Handbook, language reference, compiler, and interview practice.",
      "Справочник, языковая документация, компилятор и практика для собеседований.",
    )
    .replace("[← Back to hub]", "[← Назад к хабу]")
    .replace(
      "### Navigation — Handbook",
      "### Navigation — Справочник (Handbook)",
    )
    .replace(
      "### Navigation — Reference",
      "### Navigation — Reference (справочник)",
    )
    .replace("### Interview practice", "### Interview practice")
    .replace(
      "Q&A lives in the [Interview](./5_ts_interview.md) topic.",
      "Вопросы и ответы — в теме [Интервью](./5_ts_interview.md).",
    ),
);

// Delete old RU files
import { unlinkSync } from "node:fs";
for (const old of ["5_ts_core.md", "5_ts_generics.md", "5_ts_reference.md"]) {
  try {
    unlinkSync(join(RU, old));
    console.log("deleted ru/", old);
  } catch {
    /* ignore */
  }
}

console.log("Done RU split.");
