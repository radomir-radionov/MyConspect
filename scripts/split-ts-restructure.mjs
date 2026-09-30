#!/usr/bin/env node
/**
 * One-time script: split TypeScript notes into Handbook + Reference structure.
 * Run from repo root: node scripts/split-ts-restructure.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const EN = join("resources", "en");

const RELATED =
  "* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)";

function lines(path) {
  return readFileSync(join(EN, path), "utf8").split("\n");
}

function slice(path, start, end) {
  const ls = lines(path);
  return ls.slice(start - 1, end).join("\n");
}

function header(title, blurb, sections) {
  const sectionLines = sections.map((s) => `- ${s}`).join("\n");
  return `# ${title}

${blurb}

[← Back to hub](./5_ts.md)

### Related docs

${RELATED}

### Sections

${sectionLines}

---

`;
}

function writeFile(name, content) {
  writeFileSync(join(EN, name), content, "utf8");
  console.log("wrote", name);
}

// --- 5_ts_basics.md (core lines 19-516 + 5-min intro) ---
const intro5min = `
## TypeScript for JavaScript programmers

<details>
  <summary>Types by inference</summary>

### Types by inference

**Definition:**

TypeScript infers types from values — you often do not need explicit annotations.

| When to use | Notes |
|-------------|-------|
| Let inference work for locals and simple assignments; add annotations when inference is too wide or unclear. | VS Code uses TypeScript for JavaScript IntelliSense — same inference model. |

**Examples:**

\`\`\`typescript
let helloWorld = "Hello World";
// inferred: string
helloWorld(); // Error: Type 'string' has no call signatures
\`\`\`

**Sources:** [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

</details>

<details>
  <summary>Defining types</summary>

### Defining types with interfaces

**Definition:**

Describe object shapes with \`interface\` or annotate variables with \`: TypeName\`.

**Examples:**

\`\`\`typescript
interface User {
  name: string;
  id: number;
}

const user: User = { name: "Hayes", id: 0 };
\`\`\`

**Sources:** [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

</details>

<details>
  <summary>Composing types</summary>

### Unions and generics (overview)

**Definition:**

Combine types with unions (\`A | B\`) and generic parameters (\`<T>\`) — see [Everyday Types](./5_ts_everyday.md) and [Type Manipulation](./5_ts_type_manipulation.md) for full coverage.

**Examples:**

\`\`\`typescript
type WindowStates = "open" | "closed" | "minimized";

function getLength(obj: string | string[]) {
  return obj.length;
}

interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}
\`\`\`

**Sources:** [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

</details>

<details>
  <summary>Structural type system</summary>

### Structural typing

**Definition:**

TypeScript compares **shape**, not declaration name — if two values have compatible fields, they match.

**Examples:**

\`\`\`typescript
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(\`\${p.x}, \${p.y}\`);
}

const point = { x: 12, y: 26 };
logPoint(point); // OK — same shape
\`\`\`

**Sources:** [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

</details>

`;

writeFile(
  "5_ts_basics.md",
  header(
    "TypeScript — The Basics",
    "Static type-checking, compiler fundamentals, tsconfig, and a short intro for JavaScript programmers.",
    [
      "[Static typing & basics](#static-typing-basics)",
      "[Compiler & tsconfig](#compiler-tsconfig)",
      "[TypeScript for JavaScript programmers](#typescript-for-javascript-programmers)",
    ],
  ) +
    slice("5_ts_core.md", 19, 516) +
    intro5min,
);

// --- 5_ts_everyday.md (core 517-1110, 1225-1256 — skip enums) ---
writeFile(
  "5_ts_everyday.md",
  header(
    "TypeScript — Everyday Types",
    "Primitives, arrays, objects, unions, interfaces, literals, and common everyday types.",
    ["[Everyday types](#everyday-types)"],
  ) +
    slice("5_ts_core.md", 517, 1110) +
    "\n\n### Enums\n\nSee canonical coverage in [Enums](./5_ts_enums.md) — prefer `as const` objects in modern code.\n\n" +
    slice("5_ts_core.md", 1225, 1258),
);

// --- 5_ts_objects.md (trimmed) ---
writeFile(
  "5_ts_objects.md",
  header(
    "TypeScript — Object Types",
    "Object shapes, interfaces, optional and readonly properties, index signatures, and tuples.",
    ["[Object types](#object-types)"],
  ) +
    slice("5_ts_objects.md", 19, 556) +
    "\n\n## Classes & OOP\n\nMoved to [Classes](./5_ts_classes.md).\n\n## Design principles\n\nSee [OOP & SOLID](./7_special_engineering.md#object-oriented-programming-oop).\n",
);

// --- 5_ts_classes.md ---
writeFile(
  "5_ts_classes.md",
  header(
    "TypeScript — Classes",
    "Classes, access modifiers, inheritance, abstract classes, and interfaces with `implements`.",
    [
      "[Classes & OOP](#classes-oop)",
      "[Design principles](#design-principles)",
    ],
  ) + slice("5_ts_objects.md", 557, 1285),
);

// --- 5_ts_type_manipulation.md ---
writeFile(
  "5_ts_type_manipulation.md",
  header(
    "TypeScript — Type Manipulation",
    "Generics, keyof, typeof, indexed access, conditional and mapped types, template literals.",
    ["[Generics & type operators](#generics-type-operators)"],
  ) + slice("5_ts_generics.md", 18, 538),
);

// --- 5_ts_utility_types.md ---
writeFile(
  "5_ts_utility_types.md",
  header(
    "TypeScript — Utility Types",
    "Built-in utility types: Partial, Required, Pick, Omit, Record, ReturnType, and more.",
    ["[Utility types](#utility-types)"],
  ) + slice("5_ts_generics.md", 539, 1111),
);

// --- Reference splits from 5_ts_reference.md (inside Language reference details) ---
const refBody = slice("5_ts_reference.md", 20, 1561);

function extractRef(title, blurb, sectionAnchor, startMarker, endMarker) {
  const startIdx = refBody.indexOf(startMarker);
  const endIdx = endMarker ? refBody.indexOf(endMarker) : refBody.length;
  if (startIdx === -1) throw new Error(`marker not found: ${startMarker}`);
  const body = refBody.slice(startIdx, endIdx === -1 ? undefined : endIdx);
  return (
    header(title, blurb, [
      `[${sectionAnchor}](#${sectionAnchor.toLowerCase().replace(/\s+/g, "-").replace(/`/g, "")})`,
    ]) +
    `\n## ${sectionAnchor}\n\n<details>\n  <summary>${sectionAnchor}</summary>\n\n` +
    body +
    "\n\n</details>\n"
  );
}

writeFile(
  "5_ts_cheat_sheets.md",
  extractRef(
    "TypeScript — Cheat Sheets",
    "Printable quick-reference cards and interview memorization checklist.",
    "Cheat Sheets",
    "### Cheat Sheets",
    "### Decorators",
  ),
);

writeFile(
  "5_ts_decorators.md",
  extractRef(
    "TypeScript — Decorators",
    "Stage 2 and stage 3 decorators for classes, methods, properties, and parameters.",
    "Decorators",
    "### Decorators",
    "### Declaration Merging",
  ),
);

writeFile(
  "5_ts_declaration_merging.md",
  extractRef(
    "TypeScript — Declaration Merging",
    "Interface, namespace, class, function, and enum merging rules.",
    "Declaration Merging",
    "### Declaration Merging",
    "### Enums",
  ),
);

// Enums: reference 706-816 + core 1111-1223
const enumsRef = refBody.slice(
  refBody.indexOf("### Enums"),
  refBody.indexOf("### Iterators and Generators"),
);
const enumsCore = slice("5_ts_core.md", 1111, 1224);
writeFile(
  "5_ts_enums.md",
  header(
    "TypeScript — Enums",
    "Numeric and string enums, const enums, and `as const` alternatives.",
    ["[Enums](#enums)"],
  ) +
    `\n## Enums\n\n<details>\n  <summary>Enums</summary>\n\n` +
    enumsCore +
    "\n\n" +
    enumsRef +
    "\n\n</details>\n",
);

writeFile(
  "5_ts_iterators.md",
  extractRef(
    "TypeScript — Iterators and Generators",
    "`Symbol.iterator`, iterables, generators, and `for..of` typing.",
    "Iterators and Generators",
    "### Iterators and Generators",
    "### JSX",
  ),
);

writeFile(
  "5_ts_jsx.md",
  extractRef(
    "TypeScript — JSX",
    "JSX in `.tsx`, intrinsic elements, and component typing.",
    "JSX",
    "### JSX",
    "### Mixins",
  ),
);

writeFile(
  "5_ts_mixins.md",
  extractRef(
    "TypeScript — Mixins",
    "Compose classes from partial building blocks with intersection types.",
    "Mixins",
    "### Mixins",
    "### Namespaces",
  ),
);

writeFile(
  "5_ts_namespaces.md",
  extractRef(
    "TypeScript — Namespaces",
    "Legacy `namespace` organization and ambient declarations.",
    "Namespaces",
    "### Namespaces",
    "### Namespaces and Modules",
  ),
);

writeFile(
  "5_ts_namespaces_modules.md",
  extractRef(
    "TypeScript — Namespaces and Modules",
    "When to use ES modules vs legacy namespaces.",
    "Namespaces and Modules",
    "### Namespaces and Modules",
    "### Symbols",
  ),
);

writeFile(
  "5_ts_symbols.md",
  extractRef(
    "TypeScript — Symbols",
    "Unique primitive keys and `unique symbol` types.",
    "Symbols",
    "### Symbols",
    "### Triple-Slash Directives",
  ),
);

writeFile(
  "5_ts_triple_slash.md",
  extractRef(
    "TypeScript — Triple-Slash Directives",
    "Compiler directives, ambient declarations, and `declare`.",
    "Triple-Slash Directives",
    "### Triple-Slash Directives",
    "### Type Compatibility",
  ),
);

writeFile(
  "5_ts_type_compatibility.md",
  extractRef(
    "TypeScript — Type Compatibility",
    "Structural subtyping, assignability, and function parameter variance.",
    "Type Compatibility",
    "### Type Compatibility",
    "### Type Inference",
  ),
);

writeFile(
  "5_ts_type_inference.md",
  extractRef(
    "TypeScript — Type Inference",
    "Best common type, contextual typing, and inference without annotations.",
    "Type Inference",
    "### Type Inference",
    "### Variable Declaration",
  ),
);

writeFile(
  "5_ts_variable_declaration.md",
  extractRef(
    "TypeScript — Variable Declaration",
    "`var` vs `let` vs `const` and destructuring with types.",
    "Variable Declaration",
    "### Variable Declaration",
    null,
  ) +
    "\n\n## Advanced topics\n\n<details>\n  <summary>Modern TypeScript</summary>\n\n" +
    slice("5_ts_reference.md", 1570, 1594) +
    "\n\n</details>\n",
);

// --- 5_ts_modules.md (handbook) ---
writeFile(
  "5_ts_modules.md",
  header(
    "TypeScript — Modules",
    "ES modules: `import`/`export`, type-only imports, and module resolution in tsconfig.",
    ["[ES modules](#es-modules)"],
  ) +
    `
## ES modules

<details>
  <summary>ES modules</summary>

### ES module syntax

**Definition:**

Each file is a module. Use \`import\` and \`export\` for values and types across files.

| When to use | Notes |
|-------------|-------|
| Prefer ES modules in all modern code. Use \`import type\` / \`export type\` for type-only symbols. | \`verbatimModuleSyntax\` enforces explicit type-only imports. See [Compiler & tsconfig](./5_ts_basics.md#compiler-tsconfig). |

**Examples:**

\`\`\`typescript
// named export
export function add(a: number, b: number) {
  return a + b;
}

// default export
export default class User {}

// import
import User, { add } from "./user.js";
import type { User as UserType } from "./types.js";
\`\`\`

**Sources:** [Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)

### Module resolution

**Definition:**

\`module\` and \`moduleResolution\` in \`tsconfig.json\` control how import paths resolve.

| Option | Typical use |
|--------|-------------|
| \`"module": "ESNext"\` + \`"moduleResolution": "bundler"\` | Vite, webpack, Next.js |
| \`"moduleResolution": "NodeNext"\` | Node.js ESM with \`package.json\` \`"type"\` |

**Sources:** [Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html) · [TSConfig Reference](https://www.typescriptlang.org/tsconfig)

### ES modules vs namespaces

**Definition:**

Prefer file-based ES modules. Legacy \`namespace\` is for global augmentation and older \`.d.ts\` — see [Namespaces and Modules](./5_ts_namespaces_modules.md).

**Examples:**

\`\`\`typescript
// GOOD
export class Triangle {}

// BAD — needless namespace wrapper in a module
export namespace Shapes {
  export class Triangle {}
}
\`\`\`

**Sources:** [Namespaces and Modules](https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html)

</details>
`,
);

console.log("Done splitting TypeScript files.");
