# TypeScript — The Basics

Static type-checking, compiler fundamentals, tsconfig, and a short intro for JavaScript programmers.

[← Back to hub](./5_ts.md)

### Related docs

- [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

### Sections

- [Static typing & basics](#static-typing-basics)
- [Compiler & tsconfig](#compiler-tsconfig)
- [tsconfig.json](#tsconfig-json)
- [Declaration files (.d.ts)](#declaration-files-dts)
- [TypeScript for JavaScript programmers](#typescript-for-javascript-programmers)

---

## Static typing & basics

<details>
  <summary>Compiler fundamentals</summary>

### Static Type-Checking

**Definition:**

Analysis of code at compile time without running it — TS checks types and reports errors before deploy.

| When to use                                                                                                 | Notes                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Run `tsc` or rely on IDE diagnostics. Fix errors before shipping; use `--noEmit` in CI for type-check only. | TypeScript doesn't stop your JS from running by default. It reports errors but still emits JavaScript unless you opt into stricter emit rules. Think of it as a linter with superpowers, not a runtime e |

**Examples:**

```typescript
const message = "hello!";
message(); // Error: Type 'string' has no call signatures
// Caught before you ever run the code
```

**Sources:** [TypeScript handbook — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### Non-Exception Failures

**Definition:**

Type errors that are not thrown exceptions — TS reports them at compile time.

| When to use                                                                               | Notes                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Read IDE squiggles and `tsc` output. Fix before merge; they won't appear in runtime logs. | TS sometimes rejects _valid_ JavaScript that wouldn't crash immediately (e.g. accessing `user.location` when it's not on the type). That's intentional — the goal is catching real bugs, not mirroring e |

**Examples:**

```typescript
const user = { name: "Daniel", age: 26 };
user.location; // Error in TS — undefined in plain JS
```

```typescript
const announcement = "Hello World!";
announcement.toLocaleLowercase(); // Error — typo caught
announcement.toLocalLowerCase(); // Error — typo caught
announcement.toLocaleLowerCase(); // OK
```

```typescript
function flipCoin() {
  return Math.random < 0.5; // Error — forgot () on Math.random
  // return Math.random() < 0.5; // OK
}
```

**Sources:** [TypeScript handbook — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### Types for Tooling

**Definition:**

Types exist primarily to power editor features — autocomplete, refactor, go-to-def.

| When to use                                                                     | Notes                                                                                                                                                                  |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hover for types, use rename-symbol and find references; good types = better DX. | You get tooling benefits even before your code is fully typed. Partial typing still helps autocomplete and navigation. The more you type, the smarter the editor gets. |

**Examples:**

```typescript
import express from "express";

const app = express();

app.get("/", function (req, res) {
  res.send; // editor suggests: send, sendDate, sendFile, sendStatus...
});

app.listen(3000);
```

**Sources:** [TypeScript handbook — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### `tsc` — The TypeScript Compiler

**Definition:**

The CLI that type-checks TypeScript and emits JavaScript (`typescript` package).

| When to use                                                                                                                             | Notes                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Run `tsc` with `tsconfig.json`, or `tsc --noEmit` to check only. Bundlers (Vite, esbuild) often transpile; `tsc` still validates types. | `tsc` does two jobs at once: type-checking AND compiling TS → JS. Many modern setups use `tsc --noEmit` for checking only and let Vite/esbuild/SWC handle the actual bundling. Know which tool does what |

**Examples:**

```typescript
// hello.ts
console.log("Hello world!");
```

```bash
tsc hello.ts
# No console output = no type errors
# Creates hello.js alongside hello.ts
```

```typescript
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}!`);
}

greet("Brendan"); // Error: Expected 2 arguments, but got 1
```

**Sources:** [TypeScript handbook — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### Emitting with Errors

**Definition:**

By default `tsc` emits JS even when type errors exist.

| When to use                                                                       | Notes                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Set `"noEmitOnError": true` in CI/production builds so broken types block output. | You can have a broken `.ts` file and a freshly updated `.js` file side by side. Use `--noEmitOnError` or `"noEmitOnError": true` in `tsconfig.json` when you want the compiler to refuse output until er |

**Examples:**

```bash
# Default: emits JS despite errors
tsc hello.ts

# Strict emit: no JS file if errors exist
tsc --noEmitOnError hello.ts
```

**Sources:** [TypeScript handbook — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### Explicit Types

**Definition:**

Type annotations you write yourself instead of relying on inference.

| When to use                                                                     | Notes                                                                                                                                                                |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Annotate function params at public API boundaries; let inference handle locals. | `Date()` (without `new`) returns a **string** in JavaScript, not a `Date` object. TypeScript catches `greet("Maddison", Date())` as an error. You need `new Date()`. |

**Examples:**

```typescript
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date()); // OK

// greet("Maddison", Date());     // Error: string not assignable to Date
// greet("Maddison");             // Error: expected 2 arguments
```

```typescript
let msg = "hello there!";
// TS infers: string — same as writing `let msg: string`
```

**Sources:** [TypeScript handbook — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### Erased Types

**Definition:**

All type information is removed when TS compiles to JS — zero runtime footprint.

| When to use                                                                                              | Notes                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Don't expect `typeof` or runtime `instanceof` on interfaces; use validation libraries for external data. | Type annotations never change runtime behavior. If TS says it's fine but your types are wrong (e.g. bad assertion), you get a runtime crash anyway. Types are compile-time only. |

**Examples:**

```typescript
// TypeScript source
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
greet("Maddison", new Date());
```

```javascript
// Emitted JavaScript — types gone
"use strict";
function greet(person, date) {
  console.log(
    "Hello ".concat(person, ", today is ").concat(date.toDateString(), "!"),
  );
}
greet("Maddison", new Date());
```

**Sources:** [TypeScript handbook — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### Downleveling

**Definition:**

Rewriting newer JS syntax to older targets (e.g. ES2020 → ES5).

| When to use                                                                                           | Notes                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Set `"target"` in `tsconfig`. Let TS rewrite async/await, optional chaining, etc. for older browsers. | Default target is **ES5** (very old). Most browsers today support ES2015+. Set `"target": "ES2015"` (or higher) in `tsconfig.json` unless you need ancient browser support. Wrong target = bloated or tr |

**Examples:**

```typescript
// Source (ES2015+ syntax)
`Hello ${person}, today is ${date.toDateString()}!`;
```

```javascript
// Emitted with target ES5
"Hello ".concat(person, ", today is ").concat(date.toDateString(), "!");
```

```javascript
// Emitted with target ES2015 — template literal preserved
`Hello ${person}, today is ${date.toDateString()}!`;
```

**Sources:** [TypeScript handbook — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

</details>

<a name="compiler-config"></a>

### Type system

**Definition:** Structural types built from primitives, unions, intersections, generics, and mapped/conditional types.

**When to use:** API boundaries, shared models, library typings.

**Pluses and minuses:**

| +                                         | −                                      |
| ----------------------------------------- | -------------------------------------- |
| Expressive contracts without runtime cost | Advanced types have a learning curve   |
| Utility types reduce duplication          | Over-engineered types hurt readability |

**Examples:**

```typescript
type Result<T> = { ok: true; data: T } | { ok: false; error: string };
type UserPreview = Pick<User, "id" | "name">;
```

**Sources:** [Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Compiler & config

**Definition:** `tsc` type-checks and transpiles via `tsconfig.json` — `target`, `module`, `strict`, paths, and project references.

**When to use:** Every TS project; tighten `strict` flags over time.

**Pluses and minuses:**

| +                               | −                                          |
| ------------------------------- | ------------------------------------------ |
| One config for whole repo       | `moduleResolution` can confuse newcomers   |
| Incremental builds in monorepos | Misconfigured paths break imports silently |

**Examples:**

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true
  }
}
```

**Sources:**

[tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

---

### TypeScript vs JavaScript

**Definition:** JavaScript is dynamically typed; TypeScript is a **superset** that adds optional static types checked at compile time, then erased.

**When to use:** Long-lived codebases, teams, libraries with public APIs.

**Pluses and minuses:**

| +                              | −                                |
| ------------------------------ | -------------------------------- |
| Fewer production bugs          | Extra compile step               |
| Safer refactors across modules | Discipline needed to avoid `any` |

**Examples:**

```typescript
const user = { name: "Ada" };
// user.age; // Error: Property 'age' does not exist
```

**Sources:** [TypeScript from scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

</details>

<details>
  <summary>Compiler pipeline</summary>

## Compiler & tsconfig

<details>
  <summary>Strictness & tsconfig</summary>

### Strictness

**Definition:**

Family of compiler flags that increase type safety (`strict`, `noImplicitAny`, etc.).

| When to use                                                                 | Notes                                                                                                                                                                  |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enable `"strict": true` on new projects; tighten legacy code incrementally. | `"strict": true` in `tsconfig.json` flips on all strict flags at once. You can also enable them individually. The two biggest: `noImplicitAny` and `strictNullChecks`. |

**Sources:** [TypeScript handbook — tsconfig-json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### `noImplicitAny`

**Definition:**

A compiler flag that errors when TS would otherwise infer `any` for a variable or parameter.

| When to use                                                                                                             | Notes                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enable via `strict` or `"noImplicitAny": true`. Forces explicit types or better inference — catches silent `any` leaks. | Without this flag, untyped function parameters silently become `any` and you lose all checking inside the function. This one flag alone dramatically improves code quality. |

**Examples:**

```typescript
// With noImplicitAny: OFF — no error, person is any
function greet(person) {
  console.log(person.toUpperCase());
}

// With noImplicitAny: ON — must annotate
function greet(person: string) {
  console.log(person.toUpperCase());
}
```

**Sources:** [TypeScript handbook — tsconfig-json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### `strictNullChecks`

**Definition:**

A flag making `null` and `undefined` distinct types that must be handled explicitly.

| When to use                                                                                                                  | Notes                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enable in `tsconfig`. Use optional chaining `?.`, nullish coalescing `??`, and guards before accessing possibly-null values. | Turning this on in an existing codebase can produce hundreds of errors overnight. Worth it for new code; plan a gradual migration for legacy projects. Pair with optional chaining (`?.`) and nullish co |

**Examples:**

```typescript
// strictNullChecks: OFF — no error
function getLength(s: string) {
  return s.length;
}
getLength(null); // runs, crashes at runtime

// strictNullChecks: ON
function getLength(s: string | null) {
  if (s === null) return 0;
  return s.length; // s narrowed to string
}
```

**Sources:** [TypeScript handbook — tsconfig-json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### Recommended tsconfig for new projects

**Definition:**

Recommended tsconfig for new projects — TypeScript language or compiler feature.

| Flag               | Purpose                                                          |
| ------------------ | ---------------------------------------------------------------- |
| `strict`           | Enables `noImplicitAny`, `strictNullChecks`, etc.                |
| `moduleResolution` | How imports resolve (`node`, `bundler`, `node16`)                |
| `paths`            | Import aliases (`@/components` → `src/components`)               |
| `isolatedModules`  | Each file must be transpilable alone (required for Vite/esbuild) |
| `skipLibCheck`     | Skip type-checking `.d.ts` files — faster builds                 |
| `noEmitOnError`    | Block JS output when types fail                                  |

`strict: true` enables `noImplicitAny`, `strictNullChecks`, and other strict flags together.

**Examples:**

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2015",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmitOnError": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**Sources:** [TypeScript handbook — tsconfig-json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### Advanced `tsconfig` flags — stricter and modern

**Definition:**

Enable stricter flags **incrementally** — `noUncheckedIndexedAccess` alone can add hundreds of errors on existing codebases.

| Flag                                        | Purpose                                                                                                                                            |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `noUncheckedIndexedAccess`                  | `arr[i]` and `obj[k]` become `T \| undefined` — safer, noisier                                                                                     |
| `exactOptionalPropertyTypes`                | `prop?: T` ≠ `prop: T \| undefined` — stricter optional props                                                                                      |
| `strictFunctionTypes`                       | Contravariant function params (fixes unsound bivariance)                                                                                           |
| `verbatimModuleSyntax`                      | Enforce `import type` / `export type`; cleaner ESM/CJS boundaries                                                                                  |
| `moduleResolution: "node16"` / `"nodenext"` | Correct resolution for Node ESM + `package.json` `"type"`                                                                                          |
| `declaration` + `declarationMap`            | Emit `.d.ts` (+ source maps) for library consumers                                                                                                 |
| `composite` + `incremental`                 | Project references and faster incremental builds                                                                                                   |
| `noImplicitOverride`                        | Require `override` when overriding a base class method                                                                                             |
| `erasableSyntaxOnly`                        | Ban syntax that emits runtime JS (parameter properties, enums, namespaces) so `tsc` can type-check without a transform — Node/ts-blank-space style |

Enable stricter flags **incrementally** — `noUncheckedIndexedAccess` alone can add hundreds of errors on existing codebases.

**Examples:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "declarationMap": true,
    "composite": true
  }
}
```

**Sources:** [TypeScript handbook — tsconfig-json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### `@ts-ignore` vs `@ts-expect-error`

**Definition:**

Escape hatches when the compiler is wrong or types are missing. Prefer fixing types; use sparingly.

| Aspect  | Detail                                                                                              |
| ------- | --------------------------------------------------------------------------------------------------- |
| Summary | Escape hatches when the compiler is wrong or types are missing. Prefer fixing types; use sparingly. |

Escape hatches when |

Escape hatches when the compiler is wrong or types are missing. Prefer fixing types; use sparingly.

**How it works:** `@ts-expect-error` is preferred — it fails when the underlying issue is fixed, so suppressions don't rot.

**Examples:**

```typescript
// @ts-ignore — suppresses next line always (no error if line is fine)
// @ts-expect-error — errors if the NEXT line has NO type error (safer — catches stale suppressions)

// @ts-expect-error — legacy API not typed yet
legacyApi.doSomething();
```

**Sources:** [TypeScript handbook — tsconfig-json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

</details>

<details>
  <summary>tsconfig.json</summary>

### tsconfig.json

**Definition:**

A JSON project file that tells the TypeScript compiler **which files belong to the project** and **how to type-check and emit** them.

| When to use                                                                                         | Notes                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Every TypeScript project. Run `tsc --init` to scaffold a starter file, then tune `compilerOptions`. | `tsc` looks for `tsconfig.json` in the current folder (or use `tsc -p path/to/tsconfig.json`). Without it, only the files you pass on the CLI are checked. |

**How it works:**

- **`compilerOptions`** — flags such as `strict`, `target`, `module`, `moduleResolution`, `paths`, `noEmit`.
- **`include` / `exclude`** — glob patterns for source files (for example `"src/**/*"`; exclude `node_modules` and tests).
- **`files`** — explicit file list when you do not want globs.
- **`extends`** — inherit a shared base config; child `compilerOptions` merge, but `files` / `include` / `exclude` in the child **replace** the base lists.

**Examples:**

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

**Sources:** [TypeScript handbook — tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) · [TSConfig Reference](https://www.typescriptlang.org/tsconfig/)

</details>

<details>
  <summary>Declaration files (.d.ts)</summary>

### Declaration files (.d.ts)

**Definition:**

Type-only files that describe the **shape** of JavaScript code — they emit **no runtime JavaScript** when written by hand, but give TypeScript (and your editor) types for JS libraries and globals.

| When to use                                                                                                        | Notes                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Consuming untyped npm packages (`@types/node`, `@types/react`), publishing a typed library, or augmenting globals. | During module resolution, TypeScript prefers `.ts` / `.d.ts` over plain `.js` so imports get checking without reading implementation source. |

**How it works:**

- **Hand-written `.d.ts`** — describe third-party or legacy JS (`declare module "lodash"`, ambient globals).
- **Emitted `.d.ts`** — turn on `"declaration": true` in `tsconfig.json` when publishing a TS library so consumers import your public API types.
- **`@types/*` packages** — community or DefinitelyTyped declarations installed beside JavaScript packages.
- **`skipLibCheck`** — skips deep checking of declaration files for faster builds; does not remove the types themselves.

**Examples:**

```typescript
// types/legacy-lib.d.ts — shape of an untyped package
declare module "legacy-lib" {
  export function parse(input: string): Record<string, unknown>;
}
```

```typescript
// global.d.ts — value loaded outside modules (e.g. script tag)
declare const APP_CONFIG: {
  apiUrl: string;
};
```

```typescript
// Consuming installed declarations
import _ from "lodash";
_.padStart("Hello TypeScript!", 20, " ");
```

**Sources:** [Declaration files — introduction](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) · [Consuming declarations](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html) · [The role of declaration files](https://www.typescriptlang.org/docs/handbook/modules/theory.html#the-role-of-declaration-files)

</details>

<a name="everyday-types"></a>

## TypeScript for JavaScript programmers

<details>
  <summary>Types by inference</summary>

### Types by inference

**Definition:**

TypeScript infers types from values — you often do not need explicit annotations.

| When to use                                                                                                  | Notes                                                                       |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Let inference work for locals and simple assignments; add annotations when inference is too wide or unclear. | VS Code uses TypeScript for JavaScript IntelliSense — same inference model. |

**Examples:**

```typescript
let helloWorld = "Hello World";
// inferred: string
helloWorld(); // Error: Type 'string' has no call signatures
```

**Sources:** [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

</details>

<details>
  <summary>Defining types</summary>

### Defining types with interfaces

**Definition:**

Describe object shapes with `interface` or annotate variables with `: TypeName`.

**Examples:**

```typescript
interface User {
  name: string;
  id: number;
}

const user: User = { name: "Hayes", id: 0 };
```

**Sources:** [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

</details>

<details>
  <summary>Composing types</summary>

### Unions and generics (overview)

**Definition:**

Combine types with unions (`A | B`) and generic parameters (`<T>`) — see [Unions & Literals](./5_ts_unions_literals.md) and [Type Manipulation](./5_ts_type_manipulation.md) for full coverage.

**Examples:**

```typescript
type WindowStates = "open" | "closed" | "minimized";

function getLength(obj: string | string[]) {
  return obj.length;
}

interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}
```

**Sources:** [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

</details>

<details>
  <summary>Structural type system</summary>

### Structural typing

**Definition:**

TypeScript compares **shape**, not declaration name — if two values have compatible fields, they match.

**Examples:**

```typescript
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

const point = { x: 12, y: 26 };
logPoint(point); // OK — same shape
```

**Sources:** [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

</details>
