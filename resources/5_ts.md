# TypeScript — Static typing & compiler

Covers static typing, the type system, generics, classes, compiler configuration, and interview practice.

### Related docs

* [JS Core](./3_js_core.md) · [JS OOP](./3_js_oop.md) · [JS Async](./3_js_async.md)
* [React](./4_react.md) · [Node.js](./8_nodejs.md) · [Web API](./6_web_api.md) · [Special — OOP & SOLID](./7_special.md#2-oop--fp)

### Main concepts

| Area | Topics |
|------|--------|
| **Static typing** | `tsc`, inference, strictness, erased types |
| **Type system** | Unions, narrowing, generics, utility types |
| **Structure** | `interface`, `type`, classes, modules, `.d.ts` |
| **Compiler** | `tsconfig.json`, project references, emit |
| **Practice** | Type challenges, interview Q&A |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [Static typing & basics](#static-typing)
- [Compiler & tsconfig](#compiler-config)
- [Everyday types](#everyday-types)
- [Type narrowing](#type-narrowing)
- [Functions](#functions)
- [Object types](#object-types)
- [Classes & OOP](#classes)
- [Generics & type operators](#generics)
- [Utility types](#utility-types)
- [Language reference](#reference)
- [Advanced topics](#advanced)
- [Interview Practice](#interview-practice)

### Static typing

**Definition:** TypeScript adds optional static types to JavaScript; the compiler checks code before runtime and emits plain JS.

**When to use:**

Apps you ship, share, and maintain — especially on teams.

Throwaway scripts where compile overhead outweighs benefit.

**Pluses and minuses:**

| + | − |
|------|------|
| Catch bugs before deploy | Build step required |
| Rich IDE autocomplete | No runtime type enforcement |

**Examples:**

```typescript
function greet(name: string): string {
  return `Hello, ${name}`;
}
greet(42); // Error: number not assignable to string
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Type system

**Definition:** Structural types built from primitives, unions, intersections, generics, and mapped/conditional types.

**When to use:** API boundaries, shared models, library typings.

**Pluses and minuses:**

| + | − |
|------|------|
| Expressive contracts without runtime cost | Advanced types have a learning curve |
| Utility types reduce duplication | Over-engineered types hurt readability |

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

| + | − |
|------|------|
| One config for whole repo | `moduleResolution` can confuse newcomers |
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

## Resources & links

<details>
  <summary>External references</summary>

* [TypeScript cheatsheets](https://www.typescriptlang.org/cheatsheets)
* [Type challenges (practice)](https://github.com/type-challenges/type-challenges)
* [Advanced TypeScript guide](https://fettblog.eu/advanced-typescript-guide/)
* [Mastering advanced TS](https://jsdev.space/mastering-adv-ts/)
* [TS 5.2+ release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html)
* [Map pattern — avoid union abuse](https://dev.to/perisicnikola37/dont-use--types-like-this-use-map-pattern-instead-ki3)
* [SVG / image asset module declarations](https://duncanleung.com/typescript-module-declearation-svg-img-assets/)
* [TypeScript `Map`](https://howtodoinjava.com/typescript/maps/)
* [Interview questions roundup](https://www.simplilearn.com/tutorials/typescript-tutorial/typescript-interview-questions)
* [Project references](https://www.typescriptlang.org/docs/handbook/project-references.html)
* [TS 5.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html) (`const` type params, decorators)

</details>

---

<details>
  <summary>Why TypeScript instead of JavaScript?</summary>

### Why TypeScript instead of JavaScript?

**Definition:** JavaScript is dynamically typed; TypeScript is a **superset** that adds optional static types checked at compile time, then erased.

**When to use:** Long-lived codebases, teams, libraries with public APIs.

**Pluses and minuses:**

| + | − |
|------|------|
| Fewer production bugs | Extra compile step |
| Safer refactors across modules | Discipline needed to avoid `any` |

**Examples:**

```typescript
const user = { name: "Ada" };
// user.age; // Error: Property 'age' does not exist
```

**Sources:** [TypeScript from scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

</details>

<details>
  <summary>Pipeline — how `tsc` fits in</summary>

### Pipeline — how `tsc` fits in

**Definition:**

TS source passes through `tsc` (or bundler + type-check) → JavaScript → browser/Node runtime.

| Step | Tool |
|------|------|
| Type-check | `tsc --noEmit` |
| Emit JS | `tsc` or bundler (Vite, esbuild) |
| Runtime | Browser / Node (JS only) |

**Examples:**

```bash
tsc --noEmit    # CI type-check
tsc             # emit JS alongside .ts
```

**Sources:** [TypeScript from scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

</details>

<a name="static-typing"></a>

## Static typing & basics

<details>
  <summary>Compiler fundamentals</summary>

### Static Type-Checking

**Definition:**

Analysis of code at compile time without running it — TS checks types and reports errors before deploy.

| When to use | Notes |
|-------------|-------|
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

| When to use | Notes |
|-------------|-------|
| Read IDE squiggles and `tsc` output. Fix before merge; they won't appear in runtime logs. | TS sometimes rejects *valid* JavaScript that wouldn't crash immediately (e.g. accessing `user.location` when it's not on the type). That's intentional — the goal is catching real bugs, not mirroring e |

**Examples:**

```typescript
const user = { name: "Daniel", age: 26 };
user.location; // Error in TS — undefined in plain JS
```

```typescript
const announcement = "Hello World!";
announcement.toLocaleLowercase(); // Error — typo caught
announcement.toLocalLowerCase();  // Error — typo caught
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

| When to use | Notes |
|-------------|-------|
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

| When to use | Notes |
|-------------|-------|
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

| When to use | Notes |
|-------------|-------|
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

| When to use | Notes |
|-------------|-------|
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

| When to use | Notes |
|-------------|-------|
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
  console.log("Hello ".concat(person, ", today is ").concat(date.toDateString(), "!"));
}
greet("Maddison", new Date());
```

**Sources:** [TypeScript handbook — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### Downleveling

**Definition:**

Rewriting newer JS syntax to older targets (e.g. ES2020 → ES5).

| When to use | Notes |
|-------------|-------|
| Set `"target"` in `tsconfig`. Let TS rewrite async/await, optional chaining, etc. for older browsers. | Default target is **ES5** (very old). Most browsers today support ES2015+. Set `"target": "ES2015"` (or higher) in `tsconfig.json` unless you need ancient browser support. Wrong target = bloated or tr |

**Examples:**

```typescript
// Source (ES2015+ syntax)
`Hello ${person}, today is ${date.toDateString()}!`
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

## Compiler & tsconfig

<details>
  <summary>Strictness & tsconfig</summary>

### Strictness

**Definition:**

Family of compiler flags that increase type safety (`strict`, `noImplicitAny`, etc.).

| When to use | Notes |
|-------------|-------|
| Enable `"strict": true` on new projects; tighten legacy code incrementally. | `"strict": true` in `tsconfig.json` flips on all strict flags at once. You can also enable them individually. The two biggest: `noImplicitAny` and `strictNullChecks`. |

**Sources:** [TypeScript handbook — tsconfig-json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### `noImplicitAny`

**Definition:**

A compiler flag that errors when TS would otherwise infer `any` for a variable or parameter.

| When to use | Notes |
|-------------|-------|
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

| When to use | Notes |
|-------------|-------|
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

| Flag | Purpose |
|------|---------|
| `strict` | Enables `noImplicitAny`, `strictNullChecks`, etc. |
| `moduleResolution` | How imports resolve (`node`, `bundler`, `node16`) |
| `paths` | Import aliases (`@/components` → `src/components`) |
| `isolatedModules` | Each file must be transpilable alone (required for Vite/esbuild) |
| `skipLibCheck` | Skip type-checking `.d.ts` files — faster builds |
| `noEmitOnError` | Block JS output when types fail |

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

| Flag | Purpose |
|------|---------|
| `noUncheckedIndexedAccess` | `arr[i]` and `obj[k]` become `T \| undefined` — safer, noisier |
| `exactOptionalPropertyTypes` | `prop?: T` ≠ `prop: T \| undefined` — stricter optional props |
| `strictFunctionTypes` | Contravariant function params (fixes unsound bivariance) |
| `verbatimModuleSyntax` | Enforce `import type` / `export type`; cleaner ESM/CJS boundaries |
| `moduleResolution: "node16"` / `"nodenext"` | Correct resolution for Node ESM + `package.json` `"type"` |
| `declaration` + `declarationMap` | Emit `.d.ts` (+ source maps) for library consumers |
| `composite` + `incremental` | Project references and faster incremental builds |
| `noImplicitOverride` | Require `override` when overriding a base class method |
| `erasableSyntaxOnly` | Ban syntax that emits runtime JS (parameter properties, enums, namespaces) so `tsc` can type-check without a transform — Node/ts-blank-space style |

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

| Aspect | Detail |
|--------|--------|
| Summary | Escape hatches when the compiler is wrong or types are missing. Prefer fixing types; use sparingly.

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

<a name="everyday-types"></a>

## Everyday types

<details>
  <summary>Core types</summary>

### Primitives: `string`, `number`, `boolean`

**Definition:**

The basic value types in JavaScript — text, numbers, and true/false. TypeScript uses the same lowercase names as `typeof`.

| When to use | Notes |
|-------------|-------|
| Annotate variables (`let age: number = 42`) or let inference fill them in (`let city = "Berlin"` → `string`). Use for function params, return types, and object fields. | JavaScript has no `int` or `float` — everything numeric is just `number`. Also, `String`, `Number`, and `Boolean` (capitalized) exist as rare wrapper types. Almost always use lowercase `string`, `numb |

**Examples:**

```typescript
let name: string = "Alice";
let age: number = 42;        // not int, not float — just number
let active: boolean = true;

// Number literals — all typed as number
const decimal: number = 6;
const hex: number = 0xf00d;
const binary: number = 0b1010;
const octal: number = 0o744;

// null and undefined are their own types
const u: undefined = undefined;
const n: null = null;

// Inference works too — often you don't need the annotation
let city = "Berlin";         // inferred as string
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Arrays

**Definition:**

An ordered list where every element has the same type — `number[]` or `Array<number>`.

| When to use | Notes |
|-------------|-------|
| Declare `const ids: number[] = [1, 2, 3]`. Use with `map`, `filter`, `push`, etc. For mixed fixed positions, use a **tuple** instead. | `[number]` is **not** an array of numbers — that's a **tuple** (fixed-length array with specific positions). `number[]` is what you want for a normal array. |

**Examples:**

```typescript
const scores: number[] = [95, 87, 72];
const tags: Array<string> = ["typescript", "javascript"];

// Both are equivalent:
type A = string[];
type B = Array<string>;
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### `any`

**Definition:**

A type that turns off static checking for a value — TypeScript treats it like plain JavaScript.

| Type | Safety |
|------|--------|
| `any` | Checking disabled |
| `unknown` | Must narrow first |
| `never` | No valid values |

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### `any` vs `unknown` vs `never` — interview comparison

**Definition:** `any` disables checking. `unknown` is the type-safe top type — you must narrow before use. `never` is the bottom type — no values, used for exhaustiveness and functions that do not return.

**How it works:**

Assign anything to `any` or `unknown`. Only `unknown` forces `typeof` / predicates before property access. `never` is assignable *to* every type but accepts no value (except other `never`). `useUnknownInCatchVariables` types `catch (e)` as `unknown`.

| | `any` | `unknown` | `never` |
|---|-------|-----------|---------|
| Accepts any value | yes | yes | no (uninhabitable) |
| Use without narrowing | yes | **no** | n/a |
| Assignable to everything | yes | only `unknown`/`any` | yes |
| Typical use | escape hatch (avoid) | external/JSON data | `throw`, infinite loop, exhaustiveness |

1. Dynamic data from APIs → `unknown` + narrowing, or Zod/io-ts
2. Untyped third-party libs → `@types/*` or `declare module`
3. Truly dynamic shapes → generics or index signatures
4. Prototyping → fine short-term; tighten before shipping

**When to use:**

`JSON.parse` → `unknown`. Error in `catch` → `unknown`. Discriminated-union `default` → `const _x: never = x`.

#### Common pitfalls

`any` is contagious — derived values become `any`. Implicit `any` when `noImplicitAny` is off.

**Pluses and minuses:**

| + | − |
|------|------|
| `unknown` + narrowing is honest at API boundaries | More boilerplate than `any` |
| `never` makes switch exhaustiveness fail to compile | Easy to “fix” with `as any` and lose the check |

**Examples:**

```typescript
// any — no checks
let a: any = 10;
a.foo(); // OK (crashes at runtime)

// unknown — must narrow first
function processValue(value: unknown): string {
  if (typeof value === "string") return value.toUpperCase();
  return "Unknown";
}

// never — does not return
function fail(msg: string): never {
  throw new Error(msg);
}
```

```typescript
let obj: any = { x: 0 };

obj.foo();           // no error — but might crash at runtime
obj = "hello";       // also fine, apparently
const n: number = obj; // sure, why not

// any in tuples and arrays — all type safety gone
let y: [any, any] = ["hello", 42];
let z: Array<any> = [10, "hello"];

let notSure: any = false;
notSure = true;      // boolean — no error
notSure = 42;        // number — no error
notSure = "hello";   // string — no error
```

```typescript
// Without a type annotation and no inference context, TS defaults to any:
function log(value) {  // implicit any if noImplicitAny is off
  console.log(value);
}
```

**Thoughts:**

Prefer `unknown` at the boundary; `any` is an escape hatch, not a type.

`any` is contagious. Once a value is `any`, anything derived from it tends to become `any` too. It's an escape hatch, not a lifestyle. Enable `noImplicitAny` in `tsconfig` to catch places where TypeScript silently falls back to `any`.

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Type Annotations on Variables

**Definition:**

An explicit type label on a variable: `let name: string`.

| When to use | Notes |
|-------------|-------|
| Add when inference is wrong or too wide; omit when obvious (`const n = 5` → `number`). Type goes **after** the name: `let x: number`. | Unlike C/Java (`int x = 0`), TypeScript puts the type **after** the name, not before it. And in most cases you don't need it — TypeScript infers from the value you assign. Rule of thumb: annotate when |

**Examples:**

```typescript
// Explicit
let myName: string = "Alice";

// Inferred — usually prefer this
let myName = "Alice";  // TypeScript knows: string

// Annotation useful when you need a wider type than inference gives:
let id: string | number = Math.random() > 0.5 ? "abc" : 42;
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Functions

**Definition:**

Callable values with typed parameters and return type.

| When to use | Notes |
|-------------|-------|
| Annotate params and return when needed: `function f(a: string): number`. Use `?`, defaults, rest `...args`. Callbacks often get **contextual typing** from the caller. | Return types are usually inferred — you often don't need to write them. But anonymous callbacks get **contextual typing**: if you pass a function to `array.forEach`, TypeScript figures out the paramet |

**Examples:**

```typescript
function greet(name: string) {
  console.log("Hello, " + name.toUpperCase());
}

greet(42); // Error: number is not assignable to string

function getFavoriteNumber(): number {
  return 26;
}

async function fetchCount(): Promise<number> {
  return 42;
}
```

```typescript
const names = ["Alice", "Bob", "Eve"];

// 's' is inferred as string — no annotation needed
names.forEach((s) => {
  console.log(s.toUpperCase());
});
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Object Types

Each topic: **Definition** → **How to use** → **The quirk** → examples.

**Definition:**

A description of an object's shape — which property names exist and what types their values have.

| When to use | Notes |
|-------------|-------|
| Inline `{ name: string; age: number }`, or extract to `interface` / `type`. Pass to functions, variables, and class fields. | If you omit a property's type, it defaults to `any`. Separators can be `,` or `;` — both work. An object with the right shape is valid even if it has extra properties (excess property checking only ap |

**Examples:**

```typescript
function printCoord(pt: { x: number; y: number }) {
  console.log(`x: ${pt.x}, y: ${pt.y}`);
}

printCoord({ x: 3, y: 7 });
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Optional Properties

**Definition:**

Object fields that may be absent, marked with `?`: `last?: string`.

| When to use | Notes |
|-------------|-------|
| Add `?` on interface/type fields. Access gives `T \| undefined` under `strictNullChecks` — use `?.` or checks. | In JavaScript, missing properties return `undefined`, not an error. TypeScript forces you to handle that — accessing `obj.last` when `last` is optional gives `'obj.last' is possibly undefined'`. Use ` |

**Examples:**

```typescript
function printName(obj: { first: string; last?: string }) {
  // Error: 'obj.last' is possibly 'undefined'
  // console.log(obj.last.toUpperCase());

  if (obj.last !== undefined) {
    console.log(obj.last.toUpperCase()); // OK
  }

  console.log(obj.last?.toUpperCase()); // OK — optional chaining
}

printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Union Types

**Definition:**

A value that can be **one of** several types, written with `|`: `string | number`.

| When to use | Notes |
|-------------|-------|
| Model “either/or” data (ID as string or number, status variants). **Narrow** before using type-specific methods (`typeof`, `in`, discriminant). | A union only lets you use properties/methods **shared by all members**. `string \| number` can't call `.toUpperCase()` until you narrow it. Counter-intuitively, a union's *allowed operations* are the  |

**Examples:**

```typescript
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}

printId(101);    // OK
printId("202");  // OK
printId({ myID: 1 }); // Error
```

```typescript
function printId(id: number | string) {
  // console.log(id.toUpperCase()); // Error — number has no toUpperCase

  if (typeof id === "string") {
    console.log(id.toUpperCase()); // OK — narrowed to string
  } else {
    console.log(id); // OK — narrowed to number
  }
}

function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    console.log("Hello, " + x.join(" and "));
  } else {
    console.log("Welcome lone traveler " + x);
  }
}

// Shared method — no narrowing needed
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3); // both arrays and strings have .slice()
}
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Type Aliases

**Definition:**

A reusable name for any type: `type Point = { x: number; y: number }` or `type ID = string | number`.

| When to use | Notes |
|-------------|-------|
| Define once, use everywhere. Best for unions, tuples, primitives, mapped/conditional types, and complex compositions. | A type alias is just a nickname — `type ID = number \| string` is identical everywhere to writing `number \| string`. You can't create two "different" versions of the same underlying type. Also, type  |

**Examples:**

```typescript
type Point = {
  x: number;
  y: number;
};

type ID = number | string;

// Alias for a primitive — same as writing string everywhere
type Name = string;
let id: Name;
id = "42";  // OK
// id = 10; // Error

function printCoord(pt: Point) {
  console.log(pt.x, pt.y);
}

// Aliases work for any type, not just objects:
type Result = "success" | "error" | "pending";
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Interfaces

**Definition:**

A named contract for an object's shape — property and method signatures without implementation.

| When to use | Notes |
|-------------|-------|
| `interface User { name: string; getPass(): string }`. Extend with `extends`, merge declarations, or `implements` on classes. | Interfaces can be **extended** (`interface Bear extends Animal`) and **merged** (declare `interface Window` twice and fields combine). Type aliases can't do either. Heuristic: use `interface` for obje |

**Examples:**

```typescript
interface Point {
  x: number;
  y: number;
}

interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}

// Declaration merging — both blocks combine into one Window:
interface Window {
  title: string;
}
interface Window {
  ts: TypeScriptAPI;
}

// Same name merges fields — common for augmenting library types
interface User {
  id: number;
  name: string;
}
interface User {
  age: number; // merged into User
}

const u: User = { id: 1, name: "Alice", age: 25 };
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Interface vs type alias — when to use which

**Definition:** Use `interface` for object shapes you may extend or **declaration-merge**. Use `type` for unions, tuples, primitives, mapped/conditional types, and utility-type pipelines.

**How it works:**

Both describe object shapes. `interface` can be re-opened (`interface Window { … }` twice merges). `type` cannot — a second `type WindowType = …` is a duplicate identifier. `interface` extends with `extends`; `type` composes with `&`. Unions (`string | number`) and mapped types exist only on `type`.

| | `interface` | `type` |
|---|-------------|---------|
| Extend | `extends` | intersection `&` |
| Reopen / merge | yes (declaration merging) | no — duplicate name is an error |
| Unions / primitives | no | yes (`string \| number`, `type ID = string`) |
| Tuples | awkward | natural (`[string, number]`) |
| Mapped / conditional types | limited | yes — primary tool |
| Object shapes | yes | yes |
| `implements` on classes | yes | yes |

[Handbook — differences](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)

**When to use:** Public library object contracts → `interface` (consumers can merge). Discriminated unions / `Result<T>` → `type`. Team rule of thumb is fine; **wrong** answer is “they are identical.”

**Pluses and minuses:**

| + | − |
|------|------|
| `interface` matches how JS objects get augmented (`.d.ts`) | Merging can surprise you |
| `type` expresses unions and mapped types | Large conditional types hurt readability |

**Examples:**

```typescript
// type — intersection
type UserProps = { name: string; age: number };
type AdminProps = UserProps & { role: string };

// interface — extends
interface IUserProps { name: string; age: number }
interface IAdminProps extends IUserProps { role: string }
```

```typescript
const project = {
  title: "Project",
  specification: { areaSize: 100, rooms: 3 },
};
type Specification = typeof project["specification"]; // { areaSize: number; rooms: number }
```

**Thoughts:** Merging and `extends` → interface. Unions, tuples, mapped types → type.

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Type Assertions

**Definition:**

A compile-time cast telling TS to treat a value as a specific type: `value as Type`.

| When to use | Notes |
|-------------|-------|
| Use when you know more than the compiler (DOM elements, narrow after a check). Prefer narrowing over blind `as`. No runtime validation. | Assertions only work when types overlap enough (`string as number` is rejected). For wild casts, go through `unknown` or `any` first: `expr as any as TargetType`. Also: **no runtime validation** — if  |

**Examples:**

```typescript
const canvas = document.getElementById("main_canvas") as HTMLCanvasElement;

// Angle-bracket syntax (not in .tsx files):
const canvas2 = <HTMLCanvasElement>document.getElementById("main_canvas");

// Rejected — types don't overlap:
// const x = "hello" as number;

// Double assertion when you're really sure:
const wild = someValue as unknown as MyType;
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### The `satisfies` Operator (TS 4.9+)

**Definition:**

An operator that checks a value matches a type **without widening** inferred literals (TS 4.9+).

| When to use | Notes |
|-------------|-------|
| Write `const x = { ... } satisfies SomeType`. Validates shape and keeps narrow types for autocomplete — safer than `as` for config objects. | `as Type` throws away inference; `satisfies Type` keeps it. Use when config objects must match a schema but you still want literal types for autocomplete. |

**Examples:**

```typescript
type Colors = Record<string, string | number[]>;

// satisfies — validates AND keeps narrow types
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
} satisfies Colors;
palette.red; // [number, number, number] — tuple preserved

// as — widens red to string | number[]
const palette2 = {
  red: [255, 0, 0],
  green: "#00ff00",
} as Colors;
palette2.red; // string | number[]

// Explicit annotation — same widening problem as `as`
const palette3: Colors = {
  red: [255, 0, 0],
  green: "#00ff00",
};
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Literal Types

**Definition:**

Types that are exact values: `"left"`, `42`, `true` — not just `string` or `number`.

| When to use | Notes |
|-------------|-------|
| Build unions: `type Dir = "up" \| "down"`. Use `as const` on objects/arrays to preserve literals instead of widening to `string`. | A variable typed as `"hello"` can only ever be `"hello"` — useless alone. Power comes from **unions of literals**. Also watch **literal inference**: `const obj = { method: "GET" }` gives `method: stri |

**Examples:**

```typescript
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}

printText("Hello", "left");    // OK
printText("Hello", "centre");  // Error — typo caught at compile time

function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

```typescript
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" };
// handleRequest(req.url, req.method); // Error — method inferred as string

const req2 = { url: "https://example.com", method: "GET" } as const;
handleRequest(req2.url, req2.method); // OK — method is "GET"
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### `null` and `undefined`

**Definition:**

Types for JavaScript's absence-of-value: `null` (intentional empty) and `undefined` (unset).

| When to use | Notes |
|-------------|-------|
| With `strictNullChecks`, they are not assignable to other types unless declared. Narrow with `=== null`, `??`, or optional chaining. | Behavior depends entirely on `strictNullChecks`. **Off:** `null`/`undefined` flow everywhere silently — like Java without null safety. **On:** you must narrow before using a possibly-null value. The ` |

**Examples:**

```typescript
function doSomething(x: string | null) {
  if (x === null) {
    return;
  }
  console.log(x.toUpperCase()); // OK — x narrowed to string
}

function liveDangerously(x?: number | null) {
  console.log(x!.toFixed()); // ! asserts x is not null/undefined — no runtime check
}
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Enums

**Definition:**

A set of named numeric or string constants that **exist at runtime** as a JS object.

| When to use | Notes |
|-------------|-------|
| Declare `enum Status { Active, Inactive }`, use `Status.Active`. Prefer `as const` objects or literal unions in modern code to avoid extra bundle size. | Enums are one of the few TS features that add runtime code. Many teams prefer `as const` objects or literal unions instead — same type safety, no extra JS output. Know they exist; don't reach for them |

**Examples:**

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

Direction.Up;    // 0
Direction.Down;  // 1

enum Color { Red, Green, Blue }
Color.Green;           // 1 (auto-increment from 0)
Color.Green === 1;     // true — numeric enums are numbers at runtime

// Custom start values — auto-increment continues
enum Dir2 {
  Up = 2,
  Down = 4,
  Left = 6,
  Right,         // 7
}

// Reverse mapping (numeric enums only)
enum Dir3 { Up }
Dir3[0];         // "Up"

// String enums — no reverse mapping, better for serialization
enum Links {
  Youtube = "https://youtube.com/",
  Vk = "https://vk.com/",
}

// Literal union alternative (no runtime enum object):
type Direction2 = "Up" | "Down" | "Left" | "Right";
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### React bundle size — prefer `as const` over enum

**Definition:**

Regular enums emit a runtime object. For frontend code, `as const` objects avoid extra JS:

| Aspect | Detail |
|--------|--------|
| Summary | Regular enums emit a runtime object. For frontend code, `as const` objects avoid extra JS:

Regular enums emit a runtime |

Regular enums emit a runtime object. For frontend code, `as const` objects avoid extra JS:

**Examples:**

```typescript
// enum — emits runtime object + lookup function
enum Status { Pending = "Pending" }

// Preferred in React/modern code — zero runtime overhead
const Status2 = { Pending: "Pending" } as const;
type Status2 = typeof Status2[keyof typeof Status2];

import { useState } from "react";
const [status, setStatus] = useState(Status2.Pending);
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### `const enum` — inlined at compile time

**Definition:**

// Unused const enum — compiled output may be nearly empty:

// "use strict";
// (no enum object emitted)

| Aspect | Detail |
|--------|--------|
| Summary | // Unused const enum — compiled output may be nearly empty:
// "use strict";
// (no enum object emitted) |

**Examples:**

```typescript
const enum Links {
  Vk = "https://vk.com/",
}

const arr = [Links.Vk]; // Links.Vk replaced with literal at compile time

// Unused const enum — compiled output may be nearly empty:
// "use strict";
// (no enum object emitted)

// Used in .d.ts with isolatedModules → can break consumers — prefer regular enum or as const
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Less Common Primitives: `bigint` and `symbol`

**Definition:**

`bigint` for integers beyond `Number.MAX_SAFE_INTEGER`; `symbol` for unique property keys.

| When to use | Notes |
|-------------|-------|
| Write `100n` or `BigInt(100)` for bigint. `Symbol("id")` creates a unique key — every call returns a new symbol. | Every `Symbol("name")` call creates a **unique** value — two symbols with the same description are never equal (`===` is always false). That's the whole point: guaranteed unique keys, especially for o |

**Examples:**

```typescript
const big: bigint = 100n;
const alsoBig: bigint = BigInt(100);

const id = Symbol("id");
const alsoId = Symbol("id");

if (id === alsoId) {
  // Never runs — always false, even with same description
}

const user = {
  [id]: "secret-metadata",
  name: "Alice",
};
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>

<a name="type-narrowing"></a>

## Type narrowing

<details>
  <summary>Narrowing techniques</summary>

### Why use it

**Definition:**

TypeScript analyzes runtime checks (`typeof`, `in`, etc.) to refine union types so you can safely call type-specific methods.

| When to use | Notes |
|-------------|-------|
| Any variable typed as a union | Required before accessing members not shared by all variants |

**Examples:**

```typescript
function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Common ways to narrow

**Definition:**

Runtime checks that TypeScript understands to refine union types.

| Technique | Checks |
|-----------|--------|
| `typeof` | Primitives (`string`, `number`, `boolean`, `bigint`, `symbol`, `undefined`) |
| `in` | Property existence on object unions |
| `instanceof` | Class constructor |
| Type predicates | User-defined `x is Type` |
| Discriminated unions | Shared literal field (`kind`, `type`) |

**Examples:**

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) animal.swim();
  else animal.fly();
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### `typeof` Type Guards

**Definition:**

Narrow unions using JavaScript's `typeof` operator at runtime.

| Aspect | Detail |
|--------|--------|
| Summary | Narrow unions using JavaScript's `typeof` operator at runtime. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Supported types

**Definition:**

TypeScript recognizes the following `typeof` return values:

| Aspect | Detail |
|--------|--------|
| Summary | TypeScript recognizes the following `typeof` return values:

TypeScript recognizes the following `typeof` return values: |

TypeScript recognizes the following `typeof` return values:

* `"string"`
* `"number"`
* `"boolean"`
* `"symbol"`
* `"undefined"`
* `"object"`
* `"function"`

> ⚠️ **Note:** `typeof null` returns `"object"`. Use explicit null checks (`value === null`) instead of `typeof` to filter out null values.

**Examples:**

```typescript
function formatPrice(value: string | number | boolean) {
  if (typeof value === "string") {
    // 'value' is narrowed to string
    return `$${parseFloat(value).toFixed(2)}`;
  }

  if (typeof value === "number") {
    // 'value' is narrowed to number
    return `$${value.toFixed(2)}`;
  }

  // 'value' is automatically narrowed to boolean here
  return value ? "Paid" : "Free";
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Truthiness Narrowing

**Definition:**

Narrowing based on whether a value is truthy/falsy in `if (value)`.

| Aspect | Detail |
|--------|--------|
| Summary | Narrowing based on whether a value is truthy/falsy in `if (value)`. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Falsy values in JavaScript

**Definition:**

When evaluating truthiness, TypeScript looks for these specific values that coercion turns to `false`:

| Aspect | Detail |
|--------|--------|
| Summary | When evaluating truthiness, TypeScript looks for these specific values that coercion turns to `false`:

When evaluating  |

When evaluating truthiness, TypeScript looks for these specific values that coercion turns to `false`:

* `false`
* `0` and `0n` (BigInt zero)
* `""` (empty string)
* `null`
* `undefined`
* `NaN`

Anything else is considered truthy.

**Examples:**

```typescript
function printLength(str: string | null | undefined) {
  // 'str' can be string, null, or undefined here

  if (str) {
    // Both 'null' and 'undefined' are filtered out
    // TypeScript knows 'str' is strictly a string here
    console.log(`Length: ${str.length}`);
  } else {
    // 'str' is either null, undefined, or an empty string ""
    console.log("No valid string provided");
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Common pitfall: empty strings and zero

**Definition:**

Truthiness narrowing treats empty strings (`""`) and the number `0` as falsy. If those are valid inputs in your logic, truthiness narrowing alone might cause bugs.

| Aspect | Detail |
|--------|--------|
| Summary | Truthiness narrowing treats empty strings (`""`) and the number `0` as falsy. If those are valid inputs in your logic, t |

Truthiness narrowing treats empty strings (`""`) and the number `0` as falsy. If those are valid inputs in your logic, truthiness narrowing alone might cause bugs.

**Examples:**

```typescript
function checkCount(count: number | undefined) {
  if (count) {
    // Danger: If count is 0, this block is skipped!
    console.log(`Count is ${count}`);
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Equality Narrowing

**Definition:**

Narrowing when comparing with `===`, `!==`, `==`, `!=`.

| Aspect | Detail |
|--------|--------|
| Summary | Narrowing when comparing with `===`, `!==`, `==`, `!=`. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Strict vs loose equality

**Definition:**

`===` checks type and value; `==` coerces — `== null` filters both `null` and `undefined`.

| Aspect | Detail |
|--------|--------|
| Summary | `===` checks type and value; `==` coerces — `== null` filters both `null` and `undefined`.

* **Strict Equality (`===` / |

* **Strict Equality (`===` / `!==`):** Checks both value and type. It is the safest way to narrow specific literal values or types.
* **Loose Equality (`==` / `!=`):** Checks value only. In TypeScript, it is mostly used as a shortcut to check for both `null` and `undefined` at the same time.

**Examples:**

```typescript
function processInput(x: string | number, y: string | boolean) {
  if (x === y) {
    // TypeScript knows x and y must have the same type.
    // The only shared type between them is 'string'.
    console.log(x.toUpperCase());
    console.log(y.toUpperCase());
  } else {
    // x can be string | number, y can be string | boolean
    console.log("Types do not match");
  }
}
```

```typescript
function printValue(value: string | null | undefined) {
  if (value != null) {
    // 'value' is narrowed strictly to 'string'
    console.log(`The value is: ${value.trim()}`);
  } else {
    // 'value' is either null or undefined
    console.log("Value is missing");
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### `in` Operator Narrowing

**Definition:**

Narrow object unions by checking if a property exists: `"swim" in pet`.

| Aspect | Detail |
|--------|--------|
| Summary | Narrow object unions by checking if a property exists: `"swim" in pet`. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Handling optional properties

**Definition:**

If a property is marked as optional (`?`) in one of the types, the `in` operator will not completely filter out that type in the `else` branch. Both types will still be possible.

| Aspect | Detail |
|--------|--------|
| Summary | If a property is marked as optional (`?`) in one of the types, the `in` operator will not completely filter out that typ |

If a property is marked as optional (`?`) in one of the types, the `in` operator will not completely filter out that type in the `else` branch. Both types will still be possible.

**Examples:**

```typescript
type Car = { drive: () => void; sunroof?: boolean };
type Truck = { drive: () => void };

function serviceVehicle(vehicle: Car | Truck) {
  if ("sunroof" in vehicle) {
    // 'vehicle' is narrowed to Car
    console.log("Checking sunroof motor");
  } else {
    // 'vehicle' could still be a Truck OR a Car without a sunroof!
    // TypeScript does not narrow completely here.
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### `instanceof` Narrowing

**Definition:**

Narrow to a class type when value is an instance: `if (x instanceof Date)`.

| Aspect | Detail |
|--------|--------|
| Summary | Narrow to a class type when value is an instance: `if (x instanceof Date)`. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Important limitation

**Definition:**

The `instanceof` operator only works with values instantiated from classes or constructor functions. It **cannot** be used with plain TypeScript types or interfaces because interfaces do not exist at JavaScript runtime.

| Aspect | Detail |
|--------|--------|
| Summary | The `instanceof` operator only works with values instantiated from classes or constructor functions. It **cannot** be us |

The `instanceof` operator only works with values instantiated from classes or constructor functions. It **cannot** be used with plain TypeScript types or interfaces because interfaces do not exist at JavaScript runtime.

**Examples:**

```typescript
interface User { name: string }
// Error: 'User' only refers to a type, but is being used as a value here.
// if (obj instanceof User) { ... }
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Type Predicates

**Definition:**

Custom functions that return `arg is SomeType` to narrow types in the caller.

| Aspect | Detail |
|--------|--------|
| Summary | Custom functions that return `arg is SomeType` to narrow types in the caller. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Assertion Functions

**Definition:**

Functions that throw if a condition fails, narrowing types for the rest of the scope: `asserts condition`.

| Aspect | Detail |
|--------|--------|
| Summary | Functions that throw if a condition fails, narrowing types for the rest of the scope: `asserts condition`. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Type 1: condition assertions (`asserts condition`)

**Definition:**

This signature tells TypeScript that whatever boolean expression is passed into the function must evaluate to `true` if the function successfully returns.

| Aspect | Detail |
|--------|--------|
| Summary | This signature tells TypeScript that whatever boolean expression is passed into the function must evaluate to `true` if  |

This signature tells TypeScript that whatever boolean expression is passed into the function must evaluate to `true` if the function successfully returns.

**Examples:**

```typescript
function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg || "Assertion Failed");
  }
}

function processInput(val: string | number) {
  // val can be string | number
  assert(typeof val === "string");

  // TypeScript narrows 'val' to string for the rest of this scope
  console.log(val.toUpperCase());
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Type 2: type predicate assertions (`asserts val is Type`)

**Definition:**

This signature explicitly informs TypeScript that a specific argument will belong to a target type after the function runs. It behaves like a standard type guard but operates via runtime errors instead of `if` blocks.

| Aspect | Detail |
|--------|--------|
| Summary | This signature explicitly informs TypeScript that a specific argument will belong to a target type after the function ru |

This signature explicitly informs TypeScript that a specific argument will belong to a target type after the function runs. It behaves like a standard type guard but operates via runtime errors instead of `if` blocks.

**Examples:**

```typescript
function assertIsNumber(val: any): asserts val is number {
  if (typeof val !== "number") {
    throw new Error("Not a number!");
  }
}

function calculateTax(amount: any) {
  assertIsNumber(amount);

  // TypeScript confidently treats 'amount' as a number here
  return amount * 0.15;
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Advanced use case: generics

**Definition:**

Assertion signatures work seamlessly with generics to create reusable utility functions, like stripping away `null` and `undefined` types.

| Aspect | Detail |
|--------|--------|
| Summary | Assertion signatures work seamlessly with generics to create reusable utility functions, like stripping away `null` and  |

Assertion signatures work seamlessly with generics to create reusable utility functions, like stripping away `null` and `undefined` types.

**Examples:**

```typescript
function assertNonNull<T>(val: T): asserts val is NonNullable<T> {
  if (val === null || val === undefined) {
    throw new Error("Value cannot be null or undefined");
  }
}

function handleData(input: string | null) {
  assertNonNull(input);
  // 'input' is safely narrowed from 'string | null' to just 'string'
  console.log(input.trim());
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Assignment Narrowing

**Definition:**

TS narrows a variable when you assign a more specific value to it.

| Aspect | Detail |
|--------|--------|
| Summary | TS narrows a variable when you assign a more specific value to it. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Declared type vs observed type

**Definition:**

Declared type vs observed type — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | Declared type vs observed type — TypeScript language or compiler feature.

* **Declared Type:** The original union type  |

* **Declared Type:** The original union type the variable starts with (e.g. `string | number`). This dictates what values you are *allowed* to assign to it later.
* **Observed Type:** The specific, narrowed type TypeScript tracks at any given line based on the most recent assignment.

**Examples:**

```typescript
// Declared type is: string | number
let data: string | number = Math.random() < 0.5 ? 42 : "hello";

data = 100;
// Observed type is now: number
console.log(data.toFixed(2)); // Valid, number method works

data = "goodbye";
// Observed type is now: string
console.log(data.toUpperCase()); // Valid, string method works

data = true;
// ERROR: Type 'boolean' is not assignable to the declared type 'string | number'.
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Control Flow Analysis

**Definition:**

TS tracks how `if`, `return`, `throw`, and loops affect types in each code path.

| Aspect | Detail |
|--------|--------|
| Summary | TS tracks how `if`, `return`, `throw`, and loops affect types in each code path. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Early returns and unreachable code

**Definition:**

If a branch contains a `return`, `throw`, or `break`, TypeScript knows the code below it can only execute if that branch was skipped. It automatically narrows the remaining type for the rest of the block.

| Aspect | Detail |
|--------|--------|
| Summary | If a branch contains a `return`, `throw`, or `break`, TypeScript knows the code below it can only execute if that branch |

If a branch contains a `return`, `throw`, or `break`, TypeScript knows the code below it can only execute if that branch was skipped. It automatically narrows the remaining type for the rest of the block.

**Examples:**

```typescript
function process(input: string | number) {
  if (typeof input === "number") {
    return input * 2; // Exits early if true
  }

  // No 'else' needed!
  // TypeScript knows 'number' is impossible here.
  return input.toUpperCase(); // 'input' is strictly 'string'
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Splitting and merging types

**Definition:**

As your program runs through conditional branches, types split apart based on assignments and then re-merge when the paths come back together.

| Aspect | Detail |
|--------|--------|
| Summary | As your program runs through conditional branches, types split apart based on assignments and then re-merge when the pat |

As your program runs through conditional branches, types split apart based on assignments and then re-merge when the paths come back together.

**Examples:**

```typescript
function getStatus() {
  let result: string | number | boolean;

  result = true;
  // Type is currently: boolean

  if (Math.random() < 0.5) {
    result = "Success";
    // Inside this branch, type is: string
  } else {
    result = 500;
    // Inside this branch, type is: number
  }

  // The code paths merge back together here.
  // Type is now either string or number, but NO LONGER boolean!
  return result; // Type is: string | number
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Discriminated Unions

**Definition:**

A union of object types sharing a literal discriminant field (`kind`, `type`) for safe narrowing.

| Operator | Meaning |
|----------|----------|
| `A \| B` | One of A or B |
| `A & B` | Must satisfy both |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Why optional fields fail

**Definition:**

Grouping distinct properties into a single interface with optional fields (`?`) confuses the compiler. TypeScript cannot guarantee that `radius` is present just because you checked a `kind` field.

| Aspect | Detail |
|--------|--------|
| Summary | Grouping distinct properties into a single interface with optional fields (`?`) confuses the compiler. TypeScript cannot |

Grouping distinct properties into a single interface with optional fields (`?`) confuses the compiler. TypeScript cannot guarantee that `radius` is present just because you checked a `kind` field.

Splitting structures into explicit types makes fields mandatory exactly where they belong, preventing accidental runtime bugs.

**Examples:**

```typescript
interface Circle {
  kind: "circle";     // The discriminant
  radius: number;
}

interface Square {
  kind: "square";     // The discriminant
  sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    // 'shape' is automatically narrowed to Circle
    return Math.PI * shape.radius ** 2;
  } else {
    // 'shape' is automatically narrowed to Square
    return shape.sideLength ** 2;
  }
}
```

```typescript
function getAreaWithSwitch(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      // 'shape' is safely narrowed to Circle
      return Math.PI * shape.radius ** 2;

    case "square":
      // 'shape' is safely narrowed to Square
      return shape.sideLength ** 2;
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### The `never` Type and Exhaustiveness Checking

**Definition:**

`never` represents values that never occur — functions that throw, infinite loops, or impossible branches.

| Aspect | Detail |
|--------|--------|
| Summary | `never` represents values that never occur — functions that throw, infinite loops, or impossible branches. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### How exhaustiveness checking works

**Definition:**

No type can be assigned to `never` except `never` itself. You can exploit this rule in the `default` case of a `switch` statement. If you successfully handle every member of a union, the code path inside `default` is unreachable, meaning the variable safely resolves to `never`.

| Aspect | Detail |
|--------|--------|
| Summary | No type can be assigned to `never` except `never` itself. You can exploit this rule in the `default` case of a `switch`  |

No type can be assigned to `never` except `never` itself. You can exploit this rule in the `default` case of a `switch` statement. If you successfully handle every member of a union, the code path inside `default` is unreachable, meaning the variable safely resolves to `never`.

If a new type is added to the union later, the `default` branch becomes reachable for that new type. Because that new type cannot be assigned to `never`, TypeScript will throw a compile-time error, warning you to update your logic.

**Examples:**

```typescript
interface Circle { kind: "circle"; radius: number; }
interface Square { kind: "square"; sideLength: number; }

type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      // Valid: 'shape' is 'never' here because all options are handled
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

```typescript
interface Triangle { kind: "triangle"; sideLength: number; }

// Added Triangle to the union
type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      // ERROR: Type 'Triangle' is not assignable to type 'never'.
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

</details>

<a name="functions"></a>

## Functions

<details>
  <summary>Function types</summary>

### Function Type Expressions

**Definition:**

Inline function types: `(a: string, b: number) => boolean`.

| When to use | Notes |
|-------------|-------|
| Use for callbacks and variables holding functions. Includes param names (optional but documented). | The parameter name is **required** in the syntax. `(string) => void` does NOT mean "takes a string" — it means "takes a parameter literally named `string` of type `any`". Always write the name: `(s: s |

**Examples:**

```typescript
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);

// Named alias
type GreetFunction = (a: string) => void;
function greeter2(fn: GreetFunction) { /* ... */ }
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Call Signatures

**Definition:**

Describe callable objects that also have properties — functions with extra fields.

| When to use | Notes |
|-------------|-------|
| `` type Desc = { (x: number): boolean; description: string } `` — callable + metadata. | Call signatures use `:` before the return type, not `=>`. `(arg: number): boolean` inside `{ }`, not `(arg: number) => boolean`. |

**Examples:**

```typescript
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}

function myFunc(someArg: number) {
  return someArg > 3;
}
myFunc.description = "default description";
doSomething(myFunc);
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Construct Signatures

**Definition:**

Describe something callable with `new`: `new (x: number) => SomeClass`.

| When to use | Notes |
|-------------|-------|
| Type factory patterns and constructor interfaces for DI. | Some values work both ways (`Date` can be called with or without `new`). You can combine call and construct signatures on the same type. |

**Examples:**

```typescript
type SomeConstructor = {
  new (s: string): SomeObject;
};

function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}

// Callable AND constructable
interface CallOrConstruct {
  (n?: number): string;
  new (s: string): Date;
}

fn(Date); // Date works both ways
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Generic Functions

**Definition:**

Functions with type parameters linking input and output types.

| When to use | Notes |
|-------------|-------|
| `` function first<T>(arr: T[]): T `` — preserves element type. Add constraints: `` T extends { length: number } ``. | TypeScript infers type parameters automatically in most calls. Don't over-genericize — extra type params hurt inference and readability. |

**Examples:**

```typescript
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}

const s = firstElement(["a", "b", "c"]); // string
const n = firstElement([1, 2, 3]);       // number
const u = firstElement([]);              // undefined
```

```typescript
function map<Input, Output>(
  arr: Input[],
  func: (arg: Input) => Output
): Output[] {
  return arr.map(func);
}

const parsed = map(["1", "2", "3"], (n) => parseInt(n));
// Input: string, Output: number → number[]
```

```typescript
function longest<Type extends { length: number }>(a: Type, b: Type) {
  return a.length >= b.length ? a : b;
}

longest([1, 2], [1, 2, 3]);     // number[]
longest("alice", "bob");        // string
// longest(10, 100);            // Error — number has no .length
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Guidelines for good generics

**Definition:**

Guidelines for good generics — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | Guidelines for good generics — TypeScript language or compiler feature.

* **Push type params down** — prefer `arr: Type |

* **Push type params down** — prefer `arr: Type[]` over `arr: Type extends any[]` (better inference on return type)
* **Use fewer type parameters** — each param should relate two or more values
* **Type param should appear twice** — if it only appears once, you probably don't need it (`greet<Str extends string>(s: Str)` → just use `string`)

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Pitfall: constrained return type

**Definition:**

A function promising to return `Type` can't return a generic `{ length: number }` — callers expect the same subtype they passed in.

| Aspect | Detail |
|--------|--------|
| Summary | A function promising to return `Type` can't return a generic `{ length: number }` — callers expect the same subtype they |

A function promising to return `Type` can't return a generic `{ length: number }` — callers expect the same subtype they passed in.

**Examples:**

```typescript
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) return obj;
  return { length: minimum }; // Error — not assignable to Type
}
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Optional Parameters

**Definition:**

Function params that may be omitted, marked with `?` or given defaults.

| When to use | Notes |
|-------------|-------|
| `` function f(a: string, b?: number) `` or `` b = 0 ``. Optional params must come after required ones. | Callers can always pass `undefined` explicitly — it simulates a missing argument. `f()`, `f(10)`, and `f(undefined)` are all valid. |

**Examples:**

```typescript
function f(x?: number) {
  // x is number | undefined
}
f();      // OK
f(10);    // OK
f(undefined); // OK

function g(x = 10) {
  // x is number — undefined replaced with 10
}
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Pitfall: optional params in callbacks

**Definition:**

myForEach([1, 2, 3], (a, i) => {

console.log(i.toFixed()); // Error: i possibly undefined
});

`callback: (arg: an |

`callback: (arg: any, index?: number) => void` means the **caller** might invoke with one arg — so `index` is `number | undefined` in your callback. For "callback may omit index," use a rest union or overload instead.

**How it works:** Never mark a callback param optional unless you intend to call without that argument.

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed()); // Error: i possibly undefined
});
```

```typescript
// Wrong mental model — index? means caller might skip it
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i]); // legal — index might be undefined in callback
  }
}

myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed()); // Error: i possibly undefined
});
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Practical examples — defaults, optional, rest, return types

**Definition:**

// Optional parameter

const greet = (name: string, age?: number) => `${name}${age ?? ""}`;
// createPassword('Jack'); // Error without optional age

| Aspect | Detail |
|--------|--------|
| Summary | // Optional parameter
const greet = (name: string, age?: number) => `${name}${age ?? ""}`;
// createPassword('Jack'); // |

**Examples:**

```typescript
// Default parameters
const createPassword = (name = "Max", age: number | string = 20) =>
  `${name}${age}`;

// Optional parameter
const greet = (name: string, age?: number) => `${name}${age ?? ""}`;
// createPassword('Jack'); // Error without optional age

// Rest parameters
const createSkills = (name: string, ...skills: string[]) =>
  `${name}, my skills are ${skills.join()}`;
createSkills("Jack", "JS", "TS", "React");

// Explicit return types
const sum = (a: number, b: number): number => a + b;
const createEmptyObject = (): object => ({});

// void — no return value (don't annotate the variable as void)
const greetUser = (): void => {
  alert("Hello!");
};

// never — throws or runs forever
const fail = (msg: string): never => {
  throw new Error(msg);
};
const infiniteLoop = (): never => {
  while (true) {}
};
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Function Overloads

**Definition:**

Multiple call signatures for one function name with different param/return types.

| When to use | Notes |
|-------------|-------|
| Write overload signatures above, then one broad implementation. TS picks the matching overload at the call site. | The implementation signature is **invisible** to callers — you can't call it directly. It must be compatible with all overloads. Prefer **union parameter types** over overloads when arg count and retu |

**Examples:**

```typescript
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  }
  return new Date(mOrTimestamp);
}

const d1 = makeDate(12345678);  // OK — 1 arg
const d2 = makeDate(5, 5, 5);   // OK — 3 args
// const d3 = makeDate(1, 3);   // Error — no overload for 2 args
```

```typescript
// Different parameter types → different return types
function combine(a: string, b: string): string;
function combine(a: number, b: number): number;
function combine(a: string | number, b: string | number): string | number {
  return a + b;
}

const r1 = combine("Hello", "World"); // string
const r2 = combine(5, 10);            // number

// Class method overloads — same pattern
class Logger {
  log(message: string): void;
  log(code: number): void;
  log(value: string | number): void {
    console.log(value);
  }
}

new Logger().log("Hello");
new Logger().log(404);
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Prefer unions over overloads when possible

**Definition:**

len("");  // OK

len([0]); // OK
// len(Math.random() > 0.5 ? "hello" : [0]); // Error — no matching overload

| Operator | Meaning |
|----------|----------|
| `A \| B` | One of A or B |
| `A & B` | Must satisfy both |

**Examples:**

```typescript
// Overloads — fails on union input
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) { return x.length; }

len("");  // OK
len([0]); // OK
// len(Math.random() > 0.5 ? "hello" : [0]); // Error — no matching overload

// Union — works with union input
function len2(x: string | any[]) {
  return x.length;
}
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Declaring `this` in a Function

**Definition:**

Explicit `this` parameter type on functions that use `this` in a specific way.

| When to use | Notes |
|-------------|-------|
| `` function fn(this: HTMLElement, e: Event) `` — first param is `this`; not passed at call site. | Arrow functions **cannot** declare `this` — they lexically capture outer `this`. Use `function` syntax when `this` typing matters. |

**Examples:**

```typescript
interface User {
  admin: boolean;
}

interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(function (this: User) {
  return this.admin; // OK — this is User
});

// Arrow function — captures outer/global this, not User
// db.filterUsers(() => this.admin); // Error
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `void`, `object`, `unknown`, `never`, and `Function`

**Definition:**

Common types for functions and values: no return, non-primitive, safe top, impossible, and avoid `Function`.

| When to use | Notes |
|-------------|-------|
| `void` for no return; `unknown` for inputs; `never` for throws; `object` for non-primitives; never use `Function` type. | `void` ≠ `undefined`. `void` means "return value ignored." `unknown` is safe `any` — must narrow before use. Never use global `Function` type — it returns `any`. |

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `void` — no meaningful return

**Definition:**

// void ≠ undefined at the type level

// A function returning undefined is not the same as void in all contexts
 |

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // void ≠ undefined at the type level
// A function returning undefined is not the same as void in all contexts
```

```typescript
function noop(): void {
  return; // OK
}

// void ≠ undefined at the type level
// A function returning undefined is not the same as void in all contexts
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `object` — any non-primitive

**Definition:**

// object | null — rejects primitives

const create = (o: object | null): void => {};
// create(1);      // Error
// create("42");   // Error
create({ obj: 1 }); // OK

| Aspect | Detail |
|--------|--------|
| Summary | // object \| null — rejects primitives
const create = (o: object \| null): void => {};
// create(1);      // Error
// cr |

**Examples:**

```typescript
function logObj(val: object) { /* ... */ }

// object | null — rejects primitives
const create = (o: object | null): void => {};
// create(1);      // Error
// create("42");   // Error
create({ obj: 1 }); // OK

// Functions are objects in JS — function types count as object
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `unknown` — safe any

**Definition:**

processValue("hello"); // "HELLO"

processValue(10);      // "Unknown value"
 |

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | processValue("hello"); // "HELLO"
processValue(10);      // "Unknown value"
```

```typescript
function f1(a: any) {
  a.b(); // OK — no checking
}

function f2(a: unknown) {
  // a.b(); // Error — must narrow first
  if (typeof a === "object" && a !== null && "b" in a) {
    (a as { b: () => void }).b();
  }
}

function safeParse(s: string): unknown {
  return JSON.parse(s);
}

function processValue(value: unknown): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return "Unknown value";
}

processValue("hello"); // "HELLO"
processValue(10);      // "Unknown value"
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `never` — never returns

**Definition:**

Type for values that never occur — functions that throw, infinite loops, or exhaustiveness checks.

| Aspect | Detail |
|--------|--------|
| Summary | Type for values that never occur — functions that throw, infinite loops, or exhaustiveness checks. |

**Examples:**

```typescript
function fail(msg: string): never {
  throw new Error(msg);
}

const infiniteLoop = (): never => {
  while (true) {}
};

function fn(x: string | number) {
  if (typeof x === "string") { /* ... */ }
  else if (typeof x === "number") { /* ... */ }
  else {
    const _exhaustive: never = x; // x is never here
  }
}
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `Function` — avoid it

**Definition:**

// Prefer:

type VoidFunc = () => void; // when you won't call it
type SpecificFunc = (a: number, b: string) => boolean;
typescript
function doSomething(f: Function) {
  return f(1, 2, 3); // returns any — unsafe
}

// Prefer:
type VoidFunc = () => void; // when you won't call it
type SpecificFunc = (a: number, b: string) => boolean;
```

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // Prefer:
type VoidFunc = () => void; // when you won't call it
type SpecificFunc = (a: number, b: string) => boolean;
 |

```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Rest Parameters and Arguments

**Definition:**

Collect remaining args into a tuple/array: `...rest: number[]`.

| When to use | Notes |
|-------------|-------|
| `` function sum(...nums: number[]) ``. Tuple rest: `...args: [string, number, ...boolean[]]`. | `const args = [8, 5]` infers `number[]`, not a 2-tuple — spread into `Math.atan2` fails. Fix with `as const` for a fixed-length tuple. |

**Examples:**

```typescript
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}

const a = multiply(10, 1, 2, 3, 4); // [10, 20, 30, 40]
```

```typescript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2);

// Pitfall — inferred as number[], not tuple
const args = [8, 5];
// Math.atan2(...args); // Error

// Fix
const args2 = [8, 5] as const;
Math.atan2(...args2); // OK
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Parameter Destructuring

**Definition:**

Typing unpacked object/ array parameters in the function signature.

| When to use | Notes |
|-------------|-------|
| `` function f({ x, y }: { x: number; y: number }) `` — inline or named type for the destructured shape. | Inline `{ a, b, c }: { a: number; b: number; c: number }` gets verbose fast — extract a named type or interface for reuse. |

**Examples:**

```typescript
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}

sum({ a: 10, b: 3, c: 9 });

type ABC = { a: number; b: number; c: number };
function sum2({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Function Assignability

**Definition:**

Rules for when one function type can be assigned to another (params contravariant, returns covariant with strict).

| When to use | Notes |
|-------------|-------|
| `() => void` accepts functions that return anything (return discarded). Enable `strictFunctionTypes` for sounder param checking. | `() => void` accepts implementations that return *anything* — the return value is discarded. This is why `forEach` callbacks can return values even though the type says `void`. But a **literal** `func |

**Examples:**

```typescript
type VoidFunc = () => void;

const f1: VoidFunc = () => { return true; };  // OK — return ignored
const f2: VoidFunc = () => true;               // OK
const f3: VoidFunc = function () { return true; }; // OK

const v1 = f1(); // v1 is void

// Why this matters:
const src = [1, 2, 3];
const dst = [0];
src.forEach((el) => dst.push(el)); // push returns number, forEach expects void — OK
```

```typescript
function f2(): void {
  return true; // Error in explicit void function body
}

const f3 = function (): void {
  return true; // Error
};
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

</details>

<a name="object-types"></a>

## Object types

<details>
  <summary>Object shapes</summary>

### Defining Object Types

**Definition:**

Three ways to describe object shapes: inline `{ }`, `interface`, or `type` alias.

| When to use | Notes |
|-------------|-------|
| Pick one style per codebase. Inline for one-offs; `interface`/`type` for reuse across files. | TypeScript uses **structural typing** — only the shape matters, not the name. A variable typed as `Person` is valid anywhere a `{ name: string; age: number }` is expected. |

**Examples:**

```typescript
// 1. Anonymous inline type
function greet(person: { name: string; age: number }) {
  return "Hello " + person.name;
}

// 2. Interface
interface Person {
  name: string;
  age: number;
}

// 3. Type alias
type Person = {
  name: string;
  age: number;
};
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Reusing object shapes — avoid repetition

**Definition:**

Inline types work but repeat structure. Extract once with `type` or `interface`:

| Aspect | Detail |
|--------|--------|
| Summary | Inline types work but repeat structure. Extract once with `type` or `interface`:

Inline types work but repeat structure |

Inline types work but repeat structure. Extract once with `type` or `interface`:

**Examples:**

```typescript
type Person = { name: string; age: number; nickName: string };

let user: Person = { name: "Yauhen", age: 30, nickName: "webDev" };
let admin: Person = { name: "Max", age: 20, nickName: "Mad" };

// Optional fields for variants of the same shape
type PersonWithExtras = {
  name: string;
  age: number;
  nickName?: string;
  getPass?: () => string;
};

let admin2: PersonWithExtras = {
  name: "Max",
  age: 20,
  getPass() {
    return `${this.name}${this.age}`;
  },
};
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Optional Properties

**Definition:**

Object fields that may be absent, marked with `?`.

| When to use | Notes |
|-------------|-------|
| On interfaces/types in Object Types chapter — same as Everyday Types: optional keys may be missing. | Optional ≠ "might not exist at runtime" only — under `strictNullChecks`, reading an optional property gives `T \| undefined`. Use defaults in destructuring (`{ xPos = 0 }`) to narrow inside the functi |

**Examples:**

```typescript
interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}

paintShape({ shape });
paintShape({ shape, xPos: 100 });

function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos; // number | undefined

  let xPos2 = opts.xPos === undefined ? 0 : opts.xPos; // number

  // Defaults via destructuring
  function paint({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
    console.log(xPos, yPos); // both number
  }
}
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Pitfall: no types inside destructuring rename syntax

**Definition:**

In JS destructuring, `{ shape: Shape }` renames `shape` to variable `Shape` — it does NOT add a type annotation.

| Aspect | Detail |
|--------|--------|
| Summary | In JS destructuring, `{ shape: Shape }` renames `shape` to variable `Shape` — it does NOT add a type annotation.

In JS  |

In JS destructuring, `{ shape: Shape }` renames `shape` to variable `Shape` — it does NOT add a type annotation.

**Examples:**

```typescript
// Wrong — Shape and number become variable names, not types
// function draw({ shape: Shape, xPos: number = 100 }) { ... }

// Correct — type after the whole pattern
function draw({ shape, xPos = 100 }: { shape: Shape; xPos?: number }) { }
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### `readonly` Properties

**Definition:**

Object properties that cannot be reassigned after initialization.

| When to use | Notes |
|-------------|-------|
| Mark with `readonly` on interface fields or `readonly` arrays/tuples. Compile-time only — shallow immutability. | `readonly` is shallow — nested object contents can still mutate. Also, `readonly` is ignored when checking type compatibility via aliasing — a `readonly` view can still change if you hold a mutable al |

**Examples:**

```typescript
interface SomeType {
  readonly prop: string;
}

function doSomething(obj: SomeType) {
  console.log(obj.prop); // OK
  // obj.prop = "hello"; // Error
}

interface Home {
  readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
  home.resident.age++; // OK — mutating nested object
  // home.resident = { ... }; // Error — can't reassign readonly property
}

let writable: Person = { name: "Alice", age: 42 };
let readonly: ReadonlyPerson = writable;
writable.age++; // mutates shared object — readonly view sees 43
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Index Signatures

**Definition:**

Describe objects with dynamic string/number keys: `{ [key: string]: number }`.

| When to use | Notes |
|-------------|-------|
| Use when keys aren't known upfront. Combine with known fields; value type must include all property types. | All named properties must match the index signature type. `number` index values must be a subtype of `string` index values (because `obj[100]` === `obj["100"]` in JS). Use union index types when prope |

**Examples:**

```typescript
interface StringArray {
  [index: number]: string;
}

const arr: StringArray = getStringArray();
const item = arr[1]; // string

// All properties must fit the index type
interface NumberDictionary {
  [index: string]: number;
  length: number; // OK
  // name: string; // Error — string not assignable to number index
}

interface FlexibleDict {
  [index: string]: number | string;
  length: number;
  name: string;
}

interface ReadonlyStringArray {
  readonly [index: number]: string;
}
// arr[2] = "x"; // Error — readonly index
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Excess Property Checks

**Definition:**

TS rejects object literals with properties not declared in the target type.

| When to use | Notes |
|-------------|-------|
| Catches typos in fresh literals `{ name: "a", nmae: "b" }`. Does not apply when assigning via a variable first. | Excess checks apply to **fresh object literals** only. Assign to a variable first, use `as Type`, or add a string index signature to bypass — but most excess property errors are real bugs. |

**Examples:**

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig) { /* ... */ }

// Error — 'colour' is not in SquareConfig
// createSquare({ colour: "red", width: 100 });

// Workarounds (use sparingly):
createSquare({ width: 100, opacity: 0.5 } as SquareConfig);

interface LooseConfig {
  color?: string;
  width?: number;
  [prop: string]: unknown; // allows extra keys
}

let options = { colour: "red", width: 100 };
createSquare(options); // OK — not a fresh literal check
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Extending Types

**Definition:**

Adding fields to an existing type via `interface Child extends Parent`.

| When to use | Notes |
|-------------|-------|
| Stack interfaces: `interface Admin extends User { role: string }`. For types, use intersection `&` instead. | `extends` signals intent and avoids repeating fields. Prefer it over copy-paste when building specialized versions of a base shape. |

**Examples:**

```typescript
interface BasicAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
  unit: string;
}

interface Colorful { color: string; }
interface Circle { radius: number; }
interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = { color: "red", radius: 42 };
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Intersection Types

**Definition:**

Combine types with `&` — value must satisfy **all** members: `A & B`.

| When to use | Notes |
|-------------|-------|
| Merge object shapes: `type Employee = Person & Worker`. Conflicting property types become `never`. | Intersection merges conflicting property types into `never` instead of erroring at declaration time. `Person1 & Person2` where both have `name: string` vs `name: number` → `name: never`. |

**Examples:**

```typescript
interface Colorful { color: string; }
interface Circle { radius: number; }

type ColorfulCircle = Colorful & Circle;

function draw(circle: ColorfulCircle) {
  console.log(circle.color, circle.radius);
}

draw({ color: "blue", radius: 42 });
// draw({ color: "red", raidus: 42 }); // Error — typo caught
```

```typescript
type Person = { name: string; age: number };
type Employee = { company: string; position: string };
type EmployeePerson = Person & Employee;

const employee: EmployeePerson = {
  name: "John",
  age: 30,
  company: "ABC Corp",
  position: "Manager",
};
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Interface Extension vs Intersection

**Definition:**

Two ways to combine types — they handle property conflicts differently.

| When to use | Notes |
|-------------|-------|
| Prefer `extends` for interfaces (errors on conflict). Use `&` for types; conflicting props become `never`. | Duplicate `interface` names **merge** if compatible; incompatible props → error. Intersection of types with conflicting props → `never` on that property, compiles silently until you use it. |

**Examples:**

```typescript
// Interface merge — error on conflict
interface Person { name: string; }
// interface Person { name: number; } // Error — incompatible merge

// Intersection — compiles, property becomes never
interface Person1 { name: string; }
interface Person2 { name: number; }
type Staff = Person1 & Person2;
declare const staffer: Staff;
// staffer.name is type `never`
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Generic Object Types

**Definition:**

Object types parameterized by other types: `Box<T>`, `Array<T>`.

| When to use | Notes |
|-------------|-------|
| `` interface ApiResponse<T> { data: T; error?: string } `` — reuse one shape for many payloads. | `Box<string>` is identical to `{ contents: string }` after substitution. Generics on interfaces AND type aliases work; aliases can also build helper types like `type OrNull<T> = T \| null`. |

**Examples:**

```typescript
interface Box<Type> {
  contents: Type;
}

let box: Box<string> = { contents: "hello" };
// same as StringBox { contents: string }

type AppleBox = Box<Apple>;

function setContents<Type>(box: Box<Type>, newContents: Type) {
  box.contents = newContents;
}

// Generic type aliases
type OrNull<Type> = Type | null;
type OneOrMany<Type> = Type | Type[];
type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### `Array` and `ReadonlyArray`

**Definition:**

`Array<T>` / `T[]` for mutable lists; `ReadonlyArray<T>` / `readonly T[]` for immutable views.

| When to use | Notes |
|-------------|-------|
| Assign mutable array to readonly OK; not the reverse. Readonly arrays disallow `push`/`pop`/`splice`. | `ReadonlyArray<T>` / `readonly T[]` has no constructor — assign from a regular array. Readonly → mutable assignment works; mutable ← readonly does not. |

**How it works:** `ReadonlyArray<T>` and `readonly T[]` are **equivalent** — same behavior (no `push`/`pop`/`splice`). `readonly T[]` is syntactic sugar; `ReadonlyArray<T>` is more explicit in generic code.

**Examples:**

```typescript
function process(values: Array<string>) { /* ... */ }
function process2(values: string[]) { /* ... */ } // same

function readOnly(values: readonly string[]) {
  values.slice(); // OK
  // values.push("x"); // Error
}

// No constructor:
// new ReadonlyArray("a", "b"); // Error

let x: readonly string[] = [];
let y: string[] = [];
x = y; // OK — readonly accepts mutable
// y = x; // Error — can't assign readonly to mutable
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Tuple Types

**Definition:**

A fixed-length array with a specific type at each index: `[string, number]`.

| When to use | Notes |
|-------------|-------|
| Declare `type Pair = [string, number]` or `let t: [string, number] = ["a", 1]`. Order matters. Use for coords, `[value, error]` pairs, or mirroring function args. | **Order matters** — `[string, number]` is not assignable from `[number, string]`. Tuples are ideal for convention-based APIs (`[x, y]` coords) but objects with named fields are often clearer. |

**Examples:**

```typescript
type StringNumberPair = [string, number];

let x: StringNumberPair = ["hello", 42]; // OK
// let bad: StringNumberPair = [42, "hello"]; // Error — order matters

function doSomething(pair: [string, number]) {
  const a = pair[0]; // string
  const b = pair[1]; // number
  // const c = pair[2]; // Error — no index 2
}

doSomething(["hello", 42]);

const [input, hash] = pair; // destructuring
```

```typescript
type Either2dOr3d = [number, number, number?];

function setCoordinate(coord: Either2dOr3d) {
  const [x, y, z] = coord; // z: number | undefined
  console.log(coord.length); // 2 | 3
}

type StringNumberBooleans = [string, number, ...boolean[]];

const a: StringNumberBooleans = ["hello", 1];
const b: StringNumberBooleans = ["world", 2, true, false];
```

```typescript
function readButtonInput(...args: [string, number, ...boolean[]]) {
  const [name, version, ...input] = args;
}

// Equivalent to:
function readButtonInput(name: string, version: number, ...input: boolean[]) { }
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### `readonly` Tuple Types

**Definition:**

Tuples whose elements cannot be reassigned: `readonly [string, number]`.

| When to use | Notes |
|-------------|-------|
| Mark params `readonly` when callers pass `as const` tuples. Prevents accidental mutation inside the function. | `readonly [3, 4]` is NOT assignable to `[number, number]` because the callee might mutate elements. Prefer `readonly` tuple params when you won't mutate — matches `as const` call sites. |

**Examples:**

```typescript
function doSomething(pair: readonly [string, number]) {
  // pair[0] = "hello"; // Error
}

let point = [3, 4] as const; // readonly [3, 4]

function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

// distanceFromOrigin(point); // Error — readonly not assignable to mutable tuple

function distanceFromOrigin2([x, y]: readonly [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}
distanceFromOrigin2(point); // OK
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

</details>

<a name="classes"></a>

## Classes & OOP

<details>
  <summary>Design-first OOP with interfaces</summary>

### Design-first OOP with interfaces

**Definition:** Describe entity contracts (`interface`, `type`) before implementations. TypeScript checks relations at compile time; emitted JS has no types left.

**How it works:**

- An **interface** is a behavior contract — any object that matches the shape is usable (structural typing).
- Sketch `Ledger` / `LedgerEntry` first; implement classes later. Broken wiring fails in `tsc`, not in production.
- Prefer `type` aliases for branded scalars (`MoneyAmount`) and unions (`RecordKind`). Do **not** name a type `Record` — it clashes with the built-in `Record<K, V>`.
- `enum` works but adds runtime JS and quirks; string unions are usually enough.

**When to use:** Domain models, DI graphs, public module APIs. Skip for throwaway scripts.

**Pluses and minuses:**

| + | − |
|------|------|
| Catch bad entity graphs before run | Types erased — runtime still JS |
| Autocomplete on domain fields | Over-modeling small scripts |
| `implements` documents composition | TS `private` is not runtime privacy |

**Examples:**

```ts
type MoneyAmount = number;
type TimeStamp = number;
type RecordKind = 'spending' | 'income';

type LedgerEntry = {
  kind: RecordKind;
  amount: MoneyAmount;
  dateTime: TimeStamp;
};

interface Ledger {
  addRecord(record: LedgerEntry): void;
}

class History implements Ledger {
  private records: LedgerEntry[] = []; // compile-time only — use #records for runtime privacy
  addRecord(record: LedgerEntry): void {
    this.records.push(record);
  }
}
```

**Thoughts:** Why TS if runtime is JS? Same as engine diagnostics before you drive — you learn about a broken contract before traffic. Full OOP design: [7_special.md](./7_special.md#2-oop--fp).

**Sources:** [Doka — OOP](https://doka.guide/tools/oop/) · [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) · [Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>

<details>
  <summary>TS `private` vs `#` fields</summary>

### TS `private` vs `#` fields

**Definition:** `private` / `protected` are **compile-time** only (erased in emit). `#field` is an ECMAScript private slot — inaccessible outside the class **at runtime**.

**How it works:**

- `private foo` → still `instance.foo` in the compiled JS; `instance["foo"]` also works. `tsc` errors; JS consumers do not.
- `#foo` → `SyntaxError` outside the class; `instance["#foo"]` is `undefined`, not the value.
- Chrome DevTools may read `#` fields in the console for debugging — not a language hole.

| | `private` (TS) | `#field` (ES) |
|---|----------------|---------------|
| Enforced by | compiler | runtime |
| Survives emit | no — public property | yes — private slot |
| Subclass access | `protected` yes | no (unless getter) |
| Old targets | works (it's a normal field) | needs downlevel or modern runtimes |

**When to use:** Library shipped as JS → `#` if you need real hiding. App-only TS → `private` is often enough plus team discipline.

**Examples:**

```ts
class C {
  private foo = 10;
  #bar = 20;
}
console.log(new C().foo); // tsc error; prints 10 in JS
console.log(new C()["foo"]); // 10
// new C().#bar; // SyntaxError at compile *and* runtime
```

**Thoughts:** TS privacy is a seatbelt in the type-checker; `#` is a lock on the object.

**Sources:** [TypeScript 3.8 — private fields](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html) · [MDN — private elements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements)

</details>

<details>
  <summary>Classes & OOP</summary>

### Verbose constructor vs parameter properties

**Definition:**

constructor(name: string, age: number, nickName: string) {

this.name = name;
    this.age = age;
    this.nickName = nickName;
  }
}

| Aspect | Detail |
|--------|--------|
| Summary | constructor(name: string, age: number, nickName: string) {
    this.name = name;
    this.age = age;
    this.nickName = |

**Examples:**

```typescript
class User {
  name: string;
  age: number;
  nickName: string;

  constructor(name: string, age: number, nickName: string) {
    this.name = name;
    this.age = age;
    this.nickName = nickName;
  }
}

const dev = new User("RR", 999, "018");
```

```typescript
class User {
  constructor(
    public name: string,
    public age: number,
    public nickName: string,
    public pass: number,
  ) {}
}
```

```typescript
class User {
  name: string;
  age = 20;
  nickName = "webDev";

  constructor(name: string) {
    this.name = name;
  }

  getPass() {
    return `${this.nickName}${this.age}`; // "webDev20"
  }
}
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Access Modifiers

**Definition:**

Keywords controlling visibility of class members: `public`, `private`, `protected`, `readonly`.

| When to use | Notes |
|-------------|-------|
| Default is `public`. `private` — class only; `protected` — class + subclasses. TS modifiers are compile-time unless you use `#` fields. | `private`/`protected` in TS are **compile-time only** unless you use ECMAScript `#private` fields. Two structurally identical classes with different `private` members are **not** assignable to each ot |

**Examples:**

```typescript
class User {
  public name: string;
  private nickName: string;
  protected age: number;
  readonly pass: number;

  constructor(name: string, age: number, nickName: string, pass: number) {
    this.name = name;
    this.age = age;
    this.nickName = nickName;
    this.pass = pass;
  }
}

const dev = new User("RR", 30, "webDev", 123);
dev.name;        // OK
// dev.nickName; // Error — private
// dev.age;      // Error — protected (outside subclass)
// dev.pass = 1; // Error — readonly
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Parameter Properties

**Definition:**

Constructor shorthand: `constructor(public name: string)` declares and assigns in one line.

| Aspect | Detail |
|--------|--------|
| Summary | Constructor shorthand: `constructor(public name: string)` declares and assigns in one line. |

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Compiled output — static on the constructor

**Definition:**

After compilation, `static` lives on the class function, not instances:

| Aspect | Detail |
|--------|--------|
| Summary | After compilation, `static` lives on the class function, not instances:

After compilation, `static` lives on the class  |

After compilation, `static` lives on the class function, not instances:

**Examples:**

```javascript
"use strict";
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  getPass() {
    return this.name + User.secret;
  }
}
User.secret = 12345;
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Method override in subclass

**Definition:**

Method override in subclass — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | Method override in subclass — TypeScript language or compiler feature. |

**Examples:**

```typescript
class Child extends User {
  constructor(age: number) {
    super("Yauhen", age);
  }
  getPass() {
    return `${this.age}${this.name}${User.secret}`; // "31Yauhen12345"
  }
}
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Abstract Classes vs Interfaces

**Definition:**

Two ways to define contracts — abstract classes can have implementation; interfaces are signatures only.

| Aspect | Detail |
|--------|--------|
| Summary | Two ways to define contracts — abstract classes can have implementation; interfaces are signatures only. |

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Abstract class example

**Definition:**

Abstract class example — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | Abstract class example — TypeScript language or compiler feature. |

**Examples:**

```typescript
abstract class User {
  constructor(public name: string, public age: number) {}
  greet() {
    console.log(this.name);
  }
  abstract getPass(): string; // must implement in subclass
}

class Child extends User {
  constructor(age: number) {
    super("Yauhen", age);
  }
  getPass() {
    return `${this.age}${this.name}`;
  }
}

const y = new Child(31);
y.greet();    // "Yauhen"
y.getPass();  // "31Yauhen"
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Interfaces with classes

**Definition:**

Using interfaces to describe class instance shapes and contracts.

| Aspect | Detail |
|--------|--------|
| Summary | Using interfaces to describe class instance shapes and contracts. |

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Optional, readonly, and index signatures

**Definition:**

// Excess property check — extra keys error unless index signature allows them

interface FlexibleUser {
  name: string;
  age: number;
  [propName: string]: unknown;
}

| Aspect | Detail |
|--------|--------|
| Summary | // Excess property check — extra keys error unless index signature allows them
interface FlexibleUser {
  name: string;
 |

**Examples:**

```typescript
interface User {
  readonly name: string;
  age?: number;
}

// Excess property check — extra keys error unless index signature allows them
interface FlexibleUser {
  name: string;
  age: number;
  [propName: string]: unknown;
}

const u: FlexibleUser = {
  name: "Yauhen",
  age: 31,
  nickName: "webDev",
};
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### `implements` one or many interfaces

**Definition:**

getPass() {

return `${this.name}${this.age}`;
  }
}

| Aspect | Detail |
|--------|--------|
| Summary | getPass() {
    return `${this.name}${this.age}`;
  }
} |

**Examples:**

```typescript
interface User { name: string; age: number }
interface Pass { getPass(): string }

class Employee implements User, Pass {
  name = "Yauhen";
  age = 31;
  nickName = "webDev"; // extra members OK

  getPass() {
    return `${this.name}${this.age}`;
  }
}

interface Admin extends User {
  getPass(): string;
}

class Manager implements Admin {
  name = "Max";
  age = 20;
  getPass() {
    return `${this.name}${this.age}`;
  }
}
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### `implements`

**Definition:**

Promise that a class satisfies an interface contract — all required members must exist.

| Aspect | Detail |
|--------|--------|
| Summary | Promise that a class satisfies an interface contract — all required members must exist. |

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<a name="generics"></a>

## Generics & type operators

<details>
  <summary>Generics & type operators</summary>

### Generics

**Definition:**

Type parameters that let one function/class/interface work with many types while keeping type safety: `<T>`.

| When to use | Notes |
|-------------|-------|
| Declare `function id<T>(x: T): T` or `class Box<T> { value: T }`. TS infers `T` from arguments; pass explicitly when needed: `id<string>("a")`. Constrain with `T extends SomeType`. | Type params stand in for *any* type until constrained — you can't call `.length` on `T` unless you constrain `T extends { length: number }`. Inference usually fills in `<T>` for you; pass explicitly w |

**Examples:**

```typescript
// Too narrow
function identity(arg: number): number { return arg; }

// Loses type info
function identity(arg: any): any { return arg; }

// Generic — preserves type
function identity<T>(arg: T): T { return arg; }

let a = identity("myString");        // inferred: string
let b = identity<string>("myString"); // explicit type arg
```

```typescript
const getter = <T>(data: T): T => data;

getter("test").length;     // 4 — inferred string
// getter(10).length;      // Error — number has no length

// Explicit type argument when inference fails
getter<number>(10);
getter<string>("test").length; // 4
```

```typescript
function getFirstElement<T>(arr: T[]): T {
  return arr[0];
}

const first = getFirstElement([1, 2, 3]);     // number
const word = getFirstElement(["a", "b"]);   // string
// getFirstElement([1, "two"]);            // Error — mixed array unless T is string | number
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Interview example — API wrapper + React `useState`

**Definition:**

// Generic API response shape

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

| Aspect | Detail |
|--------|--------|
| Summary | // Generic API response shape
type ApiResponse<T> =
  \| { success: true; data: T }
  \| { success: false; error: string |

**Examples:**

```typescript
// React — generic state
const [ids, setIds] = useState<number[]>([]);

// Generic API response shape
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function fetchJson<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  if (!res.ok) return { success: false, error: res.statusText };
  const data = (await res.json()) as T;
  return { success: true, data };
}

type User = { id: number; name: string };

const result = await fetchJson<User[]>("/api/users");
if (result.success) {
  result.data.forEach((u) => u.name); // User[] — full autocomplete
}
```

```typescript
interface Box<T> {
  contents: T;
}

interface GenericIdentityFn<T> {
  (arg: T): T;
}

class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

// Single type param — both fields same type
class User<T> {
  constructor(public name: T, public age: T) {}
  getPass() {
    return `${this.name}${this.age}`;
  }
}
new User("Yauhen", "31").getPass(); // "Yauhen31"
new User(123, 321).getPass();       // "123321"

// Multiple type params — different field types
class User2<T, K> {
  constructor(public name: T, public age: K) {}
  getPass() {
    return `${this.name}${this.age}`;
  }
}
new User2("Leo", 22).getPass(); // "Leo22"

// Constrained type param
class User3<T, K extends number> {
  constructor(public name: T, public age: K) {}
  getSecret() {
    return this.age ** 2;
  }
}
new User3("Yauhen", 31).getSecret(); // 961
// new User3("Max", "20"); // Error — age must be number

// Multiple type params + constraints (Pair pattern)
class Pair<T, K extends number> {
  constructor(public key: T, public value: K) {}
  square() {
    return this.value ** 2;
  }
}

const p = new Pair("age", 31);
p.square(); // 961

// Generic classes: type param applies to instance side, not static members
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### `keyof` Type Operator

**Definition:**

Produces a union of an object's keys: `keyof { a: 1; b: 2 }` → `"a" | "b"`.

| When to use | Notes |
|-------------|-------|
| Use with generics for safe property access: `function get<T, K extends keyof T>(obj: T, key: K): T[K]`. Foundation for mapped types. | With index signatures, `keyof` returns the index type — `keyof { [k: string]: boolean }` → `string \| number` (because `obj[0]` === `obj["0"]` in JS). Pairs powerfully with mapped types and `getProper |

**How it works:** `keyof` + `extends` builds **type-safe APIs** without magic strings — `getProperty(user, "phone")` fails at compile time if `"phone"` is not a key of `user`. Combine with `typeof`, `in`, and utility types for flexible contracts.

**Examples:**

```typescript
type Point = { x: number; y: number };
type P = keyof Point; // "x" | "y"

type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish; // number

type Mapish = { [k: string]: boolean };
type M = keyof Mapish; // string | number
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### `typeof` Type Operator

**Definition:**

In **type position**, gets the type of a value or variable — not the runtime `typeof` string.

| When to use | Notes |
|-------------|-------|
| Write `type A = typeof myVar` or `typeof obj["prop"]`. Common pattern: `ReturnType<typeof fn>` needs `typeof fn` first. | Values and types live in separate namespaces. `ReturnType<f>` is wrong — use `ReturnType<typeof f>`. Only works on identifiers and their properties, not arbitrary expressions (prevents `typeof msgbox( |

**Examples:**

```typescript
let s = "hello";
let n: typeof s; // string

function f() {
  return { x: 10, y: 3 };
}

type P = ReturnType<typeof f>; // { x: number; y: number }

// type P = ReturnType<f>; // Error — f is a value, not a type
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Indexed Access Types

**Definition:**

Look up a property's type from another type: `Person["age"]` → `number`.

| When to use | Notes |
|-------------|-------|
| Use `T["key"]` or `T[K]` where `K extends keyof T`. Extract nested types without duplicating shapes. | The index must be a **type**, not a runtime variable. `const key = "age"` won't work as `Person[key]` — use `type key = "age"` or `Person[typeof key]` with `as const`. |

**Examples:**

```typescript
type Person = { age: number; name: string; alive: boolean };

type Age = Person["age"];                    // number
type I1 = Person["age" | "name"];          // string | number
// type Bad = Person["alve"];              // Error — typo: property doesn't exist
type I2 = Person[keyof Person];             // string | number | boolean

const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
];
type Person = typeof MyArray[number];        // element type
type Age = typeof MyArray[number]["age"];   // number

// const key = "age";
// type Bad = Person[key]; // Error — key is a value

type key = "age";
type Good = Person[key]; // number
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Conditional Types

**Definition:**

Type-level if/else: `T extends U ? X : Y` — picks `X` or `Y` based on whether `T` is assignable to `U`.

| When to use | Notes |
|-------------|-------|
| Build dependent types, unwrap arrays (`Flatten<T>`), extract return types with `infer`. Wrap in `[T]` to disable distribution over unions. | **Distributive** over unions: `ToArray<string \| number>` → `string[] \| number[]`, not `(string \| number)[]`. Wrap in `[T]` to disable: `[Type] extends [any] ? Type[] : never`. |

**Examples:**

```typescript
type Example1 = Dog extends Animal ? number : string; // number
type Example2 = RegExp extends Animal ? number : string; // string

type NameOrId<T extends number | string> =
  T extends number ? IdLabel : NameLabel;

function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}
```

```typescript
type MessageOf<T> = T extends { message: unknown }
  ? T["message"]
  : never;

type Flatten<T> = T extends any[] ? T[number] : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number>;   // number
```

```typescript
type Flatten<T> = T extends Array<infer Item> ? Item : T;

type GetReturnType<T> = T extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>; // number
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Mapped Types

**Definition:**

Transform every property of a type by iterating keys: `{ [K in keyof T]: NewType }`.

| When to use | Notes |
|-------------|-------|
| Create flags objects, make all props optional/readonly, rename keys with `as`. Base for many utility types (`Partial`, `Record`). | Mapping modifiers: `readonly`, `?`, and their removers `-readonly`, `-?`. Key remapping with `as` (TS 4.1+): `[K in keyof T as NewKey]: T[K]`. Filter keys by mapping to `never`. |

**Examples:**

```typescript
type OptionsFlags<T> = {
  [Property in keyof T]: boolean;
};

type Features = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<Features>;
// { darkMode: boolean; newUserProfile: boolean }
```

```typescript
// Mapped type + conditional — transform property types per key
type Person = { name: string; age: number };

type UpdatedPerson = {
  [P in keyof Person]: P extends "name" ? string : number;
};

const person: UpdatedPerson = { name: "John", age: 25 };
```

```typescript
// Remove readonly
type CreateMutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// Remove optional
type Concrete<T> = {
  [P in keyof T]-?: T[P];
};
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Template Literal Types

**Definition:**

String types built from string literals and unions: `` `get${Capitalize<Keys>}` ``.

| When to use | Notes |
|-------------|-------|
| Generate event names, CSS keys, or API paths from a union of strings. Combine with mapped types for getter/setter names. | `` `${A \| B}_id` `` → every combination. Cross-multiply multiple unions for i18n keys etc. Built-in intrinsics: `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize` — not locale-aware. |

**Examples:**

```typescript
type World = "world";
type Greeting = `hello ${World}`; // "hello world"

type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"

type Lang = "en" | "ja";
type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
// 2 × 4 = 8 string literal combinations
```

```typescript
type PropEventSource<T> = {
  on<K extends string & keyof T>(
    eventName: `${K}Changed`,
    callback: (newValue: T[K]) => void
  ): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  age: 26,
});

person.on("firstNameChanged", (name) => {
  console.log(name.toUpperCase()); // name: string
});

person.on("ageChanged", (age) => {
  if (age < 0) console.warn("negative age"); // age: number
});

// person.on("firstName", () => {}); // Error — wrong event name
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Intrinsic string manipulation types

**Definition:**

Intrinsic string manipulation types — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | Intrinsic string manipulation types — TypeScript language or compiler feature. |

**Examples:**

```typescript
type Shouty = Uppercase<"hello">;           // "HELLO"
type Quiet = Lowercase<"HELLO">;            // "hello"
type Cap = Capitalize<"hello world">;       // "Hello world"
type Uncap = Uncapitalize<"HELLO WORLD">;   // "hELLO WORLD"

type CacheKey<S extends string> = `ID-${Uppercase<S>}`;
type MainID = CacheKey<"my_app">; // "ID-MY_APP"
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### How the tools combine

**Definition:**

// typeof + indexed access + infer (like built-in ReturnType)

type MyReturn<T> = T extends (...args: never[]) => infer R ? R : never;

| Aspect | Detail |
|--------|--------|
| Summary | // typeof + indexed access + infer (like built-in ReturnType)
type MyReturn<T> = T extends (...args: never[]) => infer R |

**Examples:**

```typescript
// keyof + indexed access + mapped + template literal + conditional
type EventMap<T> = {
  [K in keyof T as `${string & K}Changed`]: T[K];
};

// typeof + indexed access + infer (like built-in ReturnType)
type MyReturn<T> = T extends (...args: never[]) => infer R ? R : never;

// Generic + keyof + extends (typed getProperty)
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Map Pattern (union → object lookup)

**Definition:**

Replace a large union of incompatible shapes with an object keyed by a discriminant.

| When to use | Notes |
|-------------|-------|
| Define `{ [K in Status]: HandlerFor<K> }` and index by status — type-safe lookup without impossible intersections. | `type Status = "idle" \| "loading" \| "error"` works until you need metadata per status. A `Record` or const object scales better. |

**Examples:**

```typescript
// ❌ Union grows unwieldy — easy to miss a case
type Status = "idle" | "loading" | "success" | "error";

// ✅ Map pattern — keys are the union, values hold per-status data
const STATUS_CONFIG = {
  idle: { label: "Idle", retry: false },
  loading: { label: "Loading…", retry: false },
  success: { label: "Done", retry: false },
  error: { label: "Failed", retry: true },
} as const;

type Status = keyof typeof STATUS_CONFIG;

function getConfig(s: Status) {
  return STATUS_CONFIG[s]; // autocomplete for all keys
}
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Branded / Nominal Types (interview pattern)

**Definition:**

A technique to make structurally identical types incompatible by adding a phantom brand field.

| Aspect | Detail |
|--------|--------|
| Summary | A technique to make structurally identical types incompatible by adding a phantom brand field. |

**Examples:**

```typescript
type UserId = string & { readonly __brand: unique symbol };
type OrderId = string & { readonly __brand: unique symbol };

function userId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId) { /* ... */ }

const uid = userId("u-123");
const oid = userId("o-456") as OrderId;
// getUser(oid); // Error — OrderId is not UserId despite both being strings
getUser(uid);    // OK
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

</details>

<a name="utility-types"></a>

## Utility types

<details>
  <summary>Built-in utilities</summary>

### Quick list — all utility types

1. **`Awaited<T>`** — unwrap `Promise` (recursive)
2. **`Partial<T>`** — all properties optional
3. **`Required<T>`** — all properties required
4. **`Readonly<T>`** — all properties readonly
5. **`Record<Keys, Type>`** — object type with fixed keys and uniform values
6. **`Pick<T, Keys>`** — subset of properties
7. **`Omit<T, Keys>`** — all properties except listed keys
8. **`Exclude<Union, Excluded>`** — remove union members assignable to `Excluded`
9. **`Extract<Type, Union>`** — keep union members assignable to `Union`
10. **`NonNullable<T>`** — remove `null` and `undefined`
11. **`Parameters<F>`** — tuple of function parameter types
12. **`ConstructorParameters<C>`** — tuple of constructor parameter types
13. **`ReturnType<F>`** — function return type
14. **`InstanceType<C>`** — instance type of a constructor
15. **`NoInfer<T>`** — block inference to this type position
16. **`ThisParameterType<F>`** — type of explicit `this` parameter
17. **`OmitThisParameter<F>`** — function type without `this`
18. **`ThisType<T>`** — contextual `this` marker (not a transform)
19. **`Uppercase` / `Lowercase` / `Capitalize` / `Uncapitalize`** — string literal transforms

### One-line definitions (interview flash cards)

**Definition:**

One-line definitions (interview flash cards) — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | One-line definitions (interview flash cards) — TypeScript language or compiler feature.

* `Partial<T>` — all properties |

* `Partial<T>` — all properties optional
* `Required<T>` — all properties required (opposite of Partial)
* `Readonly<T>` — properties cannot be reassigned
* `Record<Keys, T>` — object with fixed keys and uniform value type
* `Pick<T, Keys>` — subset of properties
* `Omit<T, Keys>` — all properties except listed keys
* `Exclude<Union, E>` — remove union members assignable to `E`
* `Extract<T, U>` — keep union members assignable to `U`
* `InstanceType<C>` — instance type from constructor
* `ThisType<T>` — contextual `this` in object literals

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### Interview examples — all utilities in one place

**Definition:**

Interview examples — all utilities in one place — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | Interview examples — all utilities in one place — TypeScript language or compiler feature. |

**Examples:**

```typescript
interface Person { name: string; age: number; email: string }

const partial: Partial<Person> = { name: "John" };

const required: Required<Partial<Person>> = { name: "John", age: 25, email: "j@x.com" };

const frozen: Readonly<Person> = { name: "John", age: 25, email: "j@x.com" };
// frozen.name = "Jane"; // Error

const fruits: Record<string, number> = { apple: 5, banana: 3 };

const picked: Pick<Person, "name" | "email"> = { name: "John", email: "j@x.com" };

const omitted: Omit<Person, "email"> = { name: "John", age: 30 };

type Primitive = string | number | boolean;
type NoBool = Exclude<Primitive, boolean>;        // string | number
type OnlyBool = Extract<Primitive, boolean>;      // boolean

type MaybeUser = string | null | undefined;
type User = NonNullable<MaybeUser>;               // string

type GetUser = (id: number, active: boolean) => string;
type Params = Parameters<GetUser>;                // [number, boolean]
type Ret = ReturnType<() => { name: string }>;    // { name: string }

class UserClass { name = "John"; age = 30 }
type Inst = InstanceType<typeof UserClass>;       // UserClass

type Helper = { getName(): string } & ThisType<{ name: string }>;
const helper: Helper = { getName() { return this.name } };
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Awaited<Type>`

**Definition:**

Unwraps `Promise` types recursively — models what `await` returns.

| When to use | Notes |
|-------------|-------|
| `type R = Awaited<Promise<Promise<string>>>` → `string`. Works on unions with non-Promise members too. | Works on unions too — `Awaited<boolean \| Promise<number>>` becomes `number \| boolean`, not just `number`. |

**Examples:**

```typescript
type A = Awaited<Promise<string>>;           // string
type B = Awaited<Promise<Promise<number>>>;  // number
type C = Awaited<boolean | Promise<number>>; // number | boolean
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Partial<Type>`

**Definition:**

Makes every property of `Type` optional.

| When to use | Notes |
|-------------|-------|
| `Partial<User>` for PATCH/update payloads where only some fields are sent. | Returns a type representing **all subsets** of `Type`, not “same shape but optional” in a shallow sense only — nested objects stay as declared unless you map them yourself. |

**Examples:**

```typescript
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fields: Partial<Todo>) {
  return { ...todo, ...fields };
}

updateTodo(
  { title: "organize desk", description: "clear clutter" },
  { description: "throw out trash" }
);
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Required<Type>`

**Definition:**

Makes every property required — opposite of `Partial`.

| When to use | Notes |
|-------------|-------|
| `Required<Partial<User>>` or ensure config objects have all keys after optional input. | Only affects top-level optional modifiers; it does not magically fill in missing nested optional chains. |

**Examples:**

```typescript
interface Props {
  a?: number;
  b?: string;
}

const ok: Props = { a: 5 };
// const bad: Required<Props> = { a: 5 }; // Error: 'b' is missing
const good: Required<Props> = { a: 5, b: "hi" };
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Readonly<Type>`

**Definition:**

Makes every top-level property readonly — cannot reassign.

| When to use | Notes |
|-------------|-------|
| `Readonly<User>` for frozen config. Shallow only — nested objects can still mutate. | Shallow only — nested object properties can still be mutated unless you also mark them readonly or use `Readonly` recursively. |

**Examples:**

```typescript
interface Todo { title: string; }

const todo: Readonly<Todo> = { title: "Delete inactive users" };
// todo.title = "Hello"; // Error: read-only property

// Pairs with Object.freeze at runtime
function freeze<T>(obj: T): Readonly<T> {
  return Object.freeze(obj) as Readonly<T>;
}
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Record<Keys, Type>`

**Definition:**

An object type with keys from `Keys` and uniform value type `Type`.

| When to use | Notes |
|-------------|-------|
| `Record<"a" \| "b", number>` or `Record<string, boolean>` for dictionaries and lookup tables. | `Keys` must be `string \| number \| symbol` — often a string-literal union. Handy for dictionaries/maps with a fixed key set. |

**Examples:**

```typescript
type CatName = "miffy" | "boris" | "mordred";

interface CatInfo {
  age: number;
  breed: string;
}

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Pick<Type, Keys>`

**Definition:**

A new type with only the selected keys from `Type`.

| When to use | Notes |
|-------------|-------|
| `Pick<User, "id" \| "name">` for DTOs, previews, or public API subsets. | `Keys` must be assignable to `keyof Type` — you can't pick keys that don't exist. |

**Examples:**

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = { title: "Clean room", completed: false };
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Omit<Type, Keys>`

**Definition:**

A new type with listed keys removed from `Type`.

| When to use | Notes |
|-------------|-------|
| `Omit<User, "password">` before sending to client. Fix intersection conflicts: `Omit<T, "key"> & { key: NewType }`. | Added in TS 3.5 — before that people used `Pick` + `Exclude<keyof T, K>` manually. |

**Examples:**

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "description" | "createdAt">;
// { title: string; completed: boolean; }
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Exclude<UnionType, ExcludedMembers>`

**Definition:**

Removes union members assignable to `ExcludedMembers`.

| When to use | Notes |
|-------------|-------|
| `Exclude<"a" \| "b" \| "c", "c">` → `"a" \| "b"`. Operates on **unions**, not object keys. | Uses assignability, not equality — `Exclude<string \| number, Function>` yields `string \| number` because neither is assignable to `Function`. |

**Examples:**

```typescript
type T0 = Exclude<"a" | "b" | "c", "a">;        // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;  // "c"

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number };

type NoCircle = Exclude<Shape, { kind: "circle" }>;
// { kind: "square"; x: number }
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Extract<Type, Union>`

**Definition:**

Keeps only union members assignable to `Union`.

| When to use | Notes |
|-------------|-------|
| `Extract<Primitive, boolean>` → `boolean`. Mirror of `Exclude`. | Mirror of `Exclude` — `Extract<T, U>` ≡ `T extends U ? T : never` (distributive over unions). |

**Examples:**

```typescript
type T0 = Extract<"a" | "b" | "c", "a" | "f">;  // "a"
type T1 = Extract<string | number | (() => void), Function>;  // () => void

type Circle = Extract<Shape, { kind: "circle" }>;
// { kind: "circle"; radius: number }
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `NonNullable<Type>`

**Definition:**

Removes `null` and `undefined` from `Type`.

| When to use | Notes |
|-------------|-------|
| `NonNullable<string \| null>` → `string`. After a null check, or to type guaranteed-present values. | Only removes those two — `void` and other falsy types stay. |

**Examples:**

```typescript
type T0 = NonNullable<string | number | undefined>;  // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Parameters<Type>`

**Definition:**

Extracts function parameter types as a tuple.

| When to use | Notes |
|-------------|-------|
| `Parameters<typeof fn>` → `[string, number]` for wrappers and higher-order functions. | For overloaded functions, uses the **last** overload's parameters. `Parameters<any>` → `unknown[]`; `Parameters<never>` → `never`. |

**Examples:**

```typescript
declare function f1(arg: { a: number; b: string }): void;

type T0 = Parameters<() => string>;           // []
type T1 = Parameters<(s: string) => void>;    // [s: string]
type T2 = Parameters<typeof f1>;              // [arg: { a: number; b: string }]
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ConstructorParameters<Type>`

**Definition:**

Extracts constructor parameter types as a tuple.

| When to use | Notes |
|-------------|-------|
| `ConstructorParameters<typeof Date>` for wrapping native or custom constructors. | `ConstructorParameters<Function>` is `never` — `Function` is too loose to match `abstract new (...args: any) => any`. |

**Examples:**

```typescript
type T0 = ConstructorParameters<ErrorConstructor>;  // [message?: string]

class C {
  constructor(a: number, b: string) {}
}
type T1 = ConstructorParameters<typeof C>;  // [a: number, b: string]
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ReturnType<Type>`

**Definition:**

Extracts the return type of a function type.

| When to use | Notes |
|-------------|-------|
| `ReturnType<typeof fetchUser>` — infer API result type without duplicating. | Overloads → last signature wins. `ReturnType<string>` errors (not a function); `ReturnType<Function>` degrades to `any`. |

**Examples:**

```typescript
declare function f1(): { a: number; b: string };

type T0 = ReturnType<() => string>;     // string
type T1 = ReturnType<typeof f1>;         // { a: number; b: string }
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `InstanceType<Type>`

**Definition:**

Gets the instance type from a constructor type.

| When to use | Notes |
|-------------|-------|
| `InstanceType<typeof MyClass>` → `MyClass`. For factory patterns and DI containers. | `InstanceType<typeof MyClass>` gives you `MyClass` instances — useful for factory patterns and DI. |

**Examples:**

```typescript
class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>;  // C
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `NoInfer<Type>`

**Definition:**

Blocks TS from inferring type arguments from this position (TS 5.4+).

| When to use | Notes |
|-------------|-------|
| Use on default/generic params that should not drive inference: `defaultColor?: NoInfer<C>`. | Added in TS 5.4 — fixes cases where a default/generic parameter gets inferred from an argument you didn't want to drive inference (e.g. a `defaultColor` that widens `C`). |

**Examples:**

```typescript
function createStreetLight<C extends string>(
  colors: C[],
  defaultColor?: NoInfer<C>,
) {
  // ...
}

createStreetLight(["red", "yellow", "green"], "red");   // OK
// createStreetLight(["red", "yellow", "green"], "blue"); // Error
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ThisParameterType<Type>`

**Definition:**

Extracts the type of an explicit `this` parameter from a function type.

| When to use | Notes |
|-------------|-------|
| Advanced — for typing `bind` wrappers and preserving `this` context. | Only applies when the function declares `this:` explicitly — ordinary methods use contextual `this`. |

**Examples:**

```typescript
function toHex(this: Number) {
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `OmitThisParameter<Type>`

**Definition:**

Removes `this` from a function type — result of `.bind()`.

| When to use | Notes |
|-------------|-------|
| Type the output of binding when `this` is fixed. | Generics are erased; only the **last** overload is kept in the output type. |

**Examples:**

```typescript
function toHex(this: Number) {
  return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);
console.log(fiveToHex()); // "5"
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ThisType<Type>`

**Definition:**

Marker for contextual `this` inside object literals with methods — not a transforming utility.

| When to use | Notes |
|-------------|-------|
| Use in object descriptors where methods need typed `this` without explicit `this` param. | Empty interface in `lib.d.ts`; only meaningful when the compiler applies contextual typing to `methods` in an object descriptor. |

**Examples:**

```typescript
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>;
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  return { ...(desc.data ?? {}), ...(desc.methods ?? {}) } as D & M;
}

const obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // 'this' is { x: number; y: number } & methods
      this.y += dy;
    },
  },
});
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### Intrinsic string manipulation types

**Definition:**

Built-in type operators for string literals: `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`.

| When to use | Notes |
|-------------|-------|
| Apply to string literal unions in mapped/template types — `` Uppercase<"hello"> `` → `"HELLO"`. | Only work on string literal types (or unions of them) — `Uppercase<string>` stays `string`, not a specific result. |

**Examples:**

```typescript
type EventName<T extends string> = `${T}Changed`;
type T0 = Uppercase<"hello">;       // "HELLO"
type T1 = Capitalize<"hello">;      // "Hello"
type T2 = Uncapitalize<"Hello">;    // "hello"

type GetterName<T extends string> = `get${Capitalize<T>}`;
type SetterName<T extends string> = `set${Capitalize<T>}`;
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

</details>

<a name="reference"></a>

## Language reference

<details>
  <summary>Language reference</summary>

### Why TypeScript instead of JavaScript?

**Definition:**

JavaScript is dynamically typed — you only discover type mistakes at **runtime** (or never, if the bug path isn't hit). TypeScript is a **superset of JavaScript**: all valid JS is valid TS. It adds optional static types that are checked at **compile time**, then erased — the output is still plain JavaScript.

| Aspect | Detail |
|--------|--------|
| Summary | JavaScript is dynamically typed — you only discover type mistakes at **runtime** (or never, if the bug path isn't hit).  |

JavaScript is dynamically typed — you only discover type mistakes at **runtime** (or never, if the bug path isn't hit). TypeScript is a **superset of JavaScript**: all valid JS is valid TS. It adds optional static types that are checked at **compile time**, then erased — the output is still plain JavaScript.

**Use TypeScript when** you want fewer production bugs, safer refactors, better editor support, and clearer contracts between modules — especially on teams and in long-lived codebases.

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Quick list — core concepts

1. **Static type-checking** — catch errors before the code runs
2. **Non-exception failures** — TS flags bugs JS would silently allow
3. **Types for tooling** — autocomplete, quick fixes, refactorings, go-to-definition
4. **`tsc`** — the TypeScript compiler (type-check + emit JS)
5. **Emitting with errors** — JS still outputs by default; use `--noEmitOnError` to block it
6. **Explicit types** — annotate parameters and variables when inference isn't enough
7. **Erased types** — annotations vanish at compile time; zero runtime effect
8. **Downleveling** — TS rewrites modern JS to older targets (e.g. ES2015 → ES5)
9. **Strictness** — dial up checking with `strict`, `noImplicitAny`, `strictNullChecks`

### Error handling — static vs runtime

**Definition:**

1. **Static type checking** — mismatches, missing properties, unreachable code (`tsc` / IDE)

2. **Runtime `try/catch`** — network failures, parsing, unexpected runtime behavior
3. **Custom error classes** — structured errors with extra context
4. **Guard clauses & assertions** — narrow types (`if (!user) return`) or `as` (no runtime check)
5. **Strict mode** — `strict` in `tsconfig.json`

| Aspect | Detail |
|--------|--------|
| Summary | 1. **Static type checking** — mismatches, missing properties, unreachable code (`tsc` / IDE)
2. **Runtime `try/catch`**  |

1. **Static type checking** — mismatches, missing properties, unreachable code (`tsc` / IDE)
2. **Runtime `try/catch`** — network failures, parsing, unexpected runtime behavior
3. **Custom error classes** — structured errors with extra context
4. **Guard clauses & assertions** — narrow types (`if (!user) return`) or `as` (no runtime check)
5. **Strict mode** — `strict` in `tsconfig.json`

**Examples:**

```typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

function parseAge(input: string): number {
  const n = Number(input);
  if (Number.isNaN(n)) {
    throw new ValidationError("Invalid age", "age");
  }
  return n;
}
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Union (`|`) vs intersection (`&`) — quick ref

**Definition:**

Union (`|`) vs intersection (`&`) — quick ref — TypeScript language or compiler feature.

| Operator | Meaning |
|----------|----------|
| `A \| B` | One of A or B |
| `A & B` | Must satisfy both |

* **Union** — value is **one of** several types: `string | number` (either/or)
* **Intersection** — value must satisfy **all** types at once: `A & B` (combine shapes)
* `string & number` is impossible (no value is both)
* Extending interfaces ≈ intersection; `interface Admin extends User` vs `type Admin = User & { role: string }`

**Examples:**

```typescript
let id: number | string;
id = 10;    // OK
id = "42";  // OK
// id = true; // Error

type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged; // must have both name and age
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Quick list — all everyday types

1. **Primitives** — `string`, `number`, `boolean`
2. **Arrays** — `number[]`, `string[]`, `Array<T>`
3. **`any`** — the “I give up” type
4. **`unknown`** — safe top type; must narrow before use (see More on Functions)
5. **Type annotations** — explicit labels on variables
5. **Functions** — parameter types, return types, contextual typing
6. **Object types** — shapes with named properties
7. **Optional properties** — `?` on fields that might be missing
8. **Union types** — `A | B` — “could be this OR that”
9. **Type aliases** — `type Name = ...` — give a type a nickname
10. **Interfaces** — `interface Name { ... }` — object blueprints you can extend
11. **Type assertions** — `as SomeType` — “trust me, compiler”
12. **`satisfies`** — validate shape without widening inference (TS 4.9+)
13. **Literal types** — exact values like `"left"` or `42`
14. **`null` and `undefined`** — the absence types
15. **Enums** — named constant sets (runtime feature)
16. **Less common primitives** — `bigint`, `symbol`

### Quick list — function concepts

1. **Function type expressions** — `(a: string) => void`
2. **Call signatures** — callable objects with properties
3. **Construct signatures** — `new (...)` for constructors
4. **Generic functions** — type parameters linking input and output
5. **Optional parameters** — `?` and defaults
6. **Function overloads** — multiple call signatures, one implementation
7. **`this` types** — declare what `this` is inside a function
8. **`void`, `object`, `unknown`, `never`** — common function-related types
9. **Rest parameters** — `...args` for unbounded arguments
10. **Parameter destructuring** — unpack object args inline
11. **Assignability** — why `() => boolean` fits `() => void`

### Object Types

**Definition:**

In JavaScript, data is grouped and passed around as objects. TypeScript describes those shapes with **object types** — anonymous inline types, `interface`, or `type` alias.

| Aspect | Detail |
|--------|--------|
| Summary | In JavaScript, data is grouped and passed around as objects. TypeScript describes those shapes with **object types** — a |

In JavaScript, data is grouped and passed around as objects. TypeScript describes those shapes with **object types** — anonymous inline types, `interface`, or `type` alias.

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Quick list — object type concepts

1. **Defining object types** — inline `{ }`, `interface`, or `type`
2. **Optional properties** — `prop?: Type`
3. **`readonly` properties** — compile-time immutability on the property
4. **Index signatures** — `[key: string]: Type` for dynamic keys
5. **Excess property checks** — extra keys flagged on object literals
6. **Extending types** — `interface Child extends Parent`
7. **Intersection types** — `A & B` to combine object types
8. **Extension vs intersection** — conflict handling differs
9. **Generic object types** — `Box<Type>`, `Array<Type>`
10. **`ReadonlyArray`** — `readonly T[]` / `ReadonlyArray<T>`
11. **Tuple types** — fixed-length, typed positions `[string, number]`

### Quick list — OOP interview topics

1. **Access modifiers** — `public` (default), `private`, `protected`, `readonly`
2. **Parameter properties** — `constructor(public name: string)` auto-assigns `this.name`
3. **Inheritance** — `extends` + `super()`; override methods with compatible signatures
4. **`static`** — belongs to the constructor, not instances
5. **`abstract class`** — cannot instantiate; may have concrete + abstract methods
6. **`interface` + `implements`** — contract for class shape (no runtime emit)
7. **Abstract class vs interface** — see comparison below
8. **Structural typing** — TS checks shape, not nominal class names (except `private`/`protected` compatibility)

**OOP building blocks:** classes + interfaces, inheritance/polymorphism, access modifiers, abstract classes, generics on classes, decorators.

### Quick list — type manipulation tools

1. **Generics** — `Type<T>` — types that take type parameters
2. **`keyof`** — union of an object's keys
3. **`typeof`** — type of a value/variable (in type position)
4. **Indexed access** — `T["prop"]` — pick a property's type
5. **Conditional types** — `T extends U ? X : Y` — if/else for types
6. **`infer`** — extract types inside conditionals
7. **Mapped types** — `{ [K in keyof T]: ... }` — transform all properties
8. **Template literal types** — `` `prefix${T}` `` — string types from strings
9. **Intrinsic helpers** — `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`

### Quick list — reference topics

1. **Cheat Sheets** — printable quick-reference cards
2. **Decorators** — annotate/modify classes and members
3. **Declaration Merging** — same name → single merged definition
4. **Enums** — named numeric/string constants (TS-specific runtime feature)
5. **Iterators and Generators** — `Symbol.iterator`, `for..of`, generators
6. **JSX** — embed XML-like syntax in `.tsx` files
7. **Mixins** — compose classes from partial building blocks
8. **Namespaces** — organize code in global scope (legacy)
9. **Namespaces and Modules** — when to use which
10. **Symbols** — unique primitive keys and `unique symbol`
11. **Triple-Slash Directives** — compiler directives in comments
12. **Type Compatibility** — structural subtyping rules
13. **Type Inference** — how TS infers without annotations
14. **Variable Declaration** — `var` vs `let` vs `const`

### Cheat Sheets

**Definition:**

Printable condensed reference cards (types, syntax, config) from the official TypeScript docs.

| When to use | Notes |
|-------------|-------|
| Bookmark for interviews and desk reference — not a substitute for understanding; use alongside this handbook. | Not a language feature — a documentation artifact. The canonical index lives under Reference in the handbook; content may be PDF/image cards rather than prose pages. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### What to memorize

**Definition:**

What to memorize — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | What to memorize — TypeScript language or compiler feature.

* Primitive vs object types, union/intersection syntax
* `k |

* Primitive vs object types, union/intersection syntax
* `keyof`, `typeof`, `infer`, mapped/conditional types
* Common utility types (`Partial`, `Pick`, `Omit`, `Record`, `ReturnType`)
* Strict flags: `strict`, `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`
* Module resolution basics: `module`, `moduleResolution`, `paths`
* Classes: access modifiers, `abstract` vs `interface`, `implements`, `static`
* Type narrowing: `typeof`, `in`, `instanceof`, type predicates, discriminated unions
* `interface` vs `type` — when to use which
* `satisfies` vs `as` vs type annotation
* Map pattern for union → lookup tables
* Branded types for nominal-style IDs
* Advanced: `const` type params, `using`/`Disposable`, `override`, project references, publishing `.d.ts`
* Stricter flags: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`
---

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Decorators

**Definition:** Functions attached with `@` to classes, methods, properties, accessors, or parameters.

**How it works:**

| Framework | Examples |
|-----------|----------|
| **Angular** | `@Component`, `@Injectable` |
| **NestJS** | `@Controller`, `@Get`, `@Post` |
| **TypeORM** | `@Entity`, `@Column` |

Decorators wrap classes/members to add logging, validation, DI, or caching **without changing business logic**.

**When to use:** Enable per project (stage 2 `experimentalDecorators` or TS 5+ stage 3). Used heavily in NestJS, Angular, TypeORM.

**Thoughts:** The handbook documents **stage 2 (experimental)** decorators (`experimentalDecorators: true`). **TypeScript 5.0+** added **stage 3** decorators — different syntax and semantics; check which your project uses.

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Key concepts

**Definition:**

// Composition: factories evaluated top-to-bottom,

// decorator functions called bottom-to-top
@first()
@second()
method() {}
// Output: first(): factory → second(): factory → second(): called → first(): called

**How it works:**

class, method, property, accessor, parameter decorators.

| Decorator | Receives | Notes |
|-----------|----------|-------|
| **Class** | `constructor` | If it returns a value, replaces the class declaration |
| **Property** | `target` (prototype), `propertyKey` | Cannot use in `.d.ts` / ambient context |
| **Method** | `target`, `propertyKey`, `descriptor` | Can observe, modify, or replace method |
| **Accessor** | same as method | Applied to get/set `PropertyDescriptor` |
| **Parameter** | constructor or method params | Metadata only — limited runtime use |

See [Decorators in TypeScript 5.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#decorators) — no `experimentalDecorators` needed; aligns with ECMAScript standard.

[Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)

`instanceof` is a **type guard** for class instances (see Type Narrowing) — not a decorator. It narrows `unknown`/`union` to a specific class inside `if (x instanceof Foo)`.

**Examples:**

```typescript
// Decorator factory — returns the actual decorator
function color(value: string) {
  return function (target: object) {
    // use target and value
  };
}

// Composition: factories evaluated top-to-bottom,
// decorator functions called bottom-to-top
@first()
@second()
method() {}
// Output: first(): factory → second(): factory → second(): called → first(): called

// Evaluation order inside a class:
// 1. Instance member decorators (per member)
// 2. Static member decorators
// 3. Constructor parameter decorators
// 4. Class decorator
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Decorator examples — all four kinds

**Definition:**

// Property decorator — target is prototype, propertyKey is field name

const logProperty = (target: object, propertyKey: string | symbol) => {
  console.log(propertyKey); // "secret"
};

| Aspect | Detail |
|--------|--------|
| Summary | // Property decorator — target is prototype, propertyKey is field name
const logProperty = (target: object, propertyKey: |

**Examples:**

```typescript
// Class decorator — logs constructor; return value would replace class
const logClass = (constructor: Function) => {
  console.log(constructor); // class User {}
};

// Property decorator — target is prototype, propertyKey is field name
const logProperty = (target: object, propertyKey: string | symbol) => {
  console.log(propertyKey); // "secret"
};

// Method decorator — receives PropertyDescriptor
const logMethod = (
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  console.log(propertyKey); // "getPass"
};

// Accessor decorator — on get/set
const logSet = (
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  console.log(propertyKey); // "myAge"
};

@logClass
class User {
  @logProperty
  secret: number;

  constructor(public name: string, public age: number, secret: number) {
    this.secret = secret;
  }

  @logMethod
  getPass() {
    return `${this.name}${this.age}`;
  }

  @logSet
  set myAge(age: number) {
    this.age = age;
  }
}
```

```typescript
// Parameter decorator — metadata on constructor/method params (NestJS DI uses this pattern)
function logParameter(
  _target: object,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  console.log(`Param ${parameterIndex} of ${String(propertyKey)}`);
}

class Account {
  constructor(
    public name: string,
    @logParameter public balance: number,
  ) {}
}

// Class decorator that returns a constructor REPLACES the class declaration
function Timestamped<T extends new (...args: any[]) => object>(Base: T) {
  return class extends Base {
    createdAt = Date.now();
  };
}

@Timestamped
class User {
  constructor(public name: string) {}
}

const u = new User("Alice");
// u.name + u.createdAt — subclass instance, not plain User
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Decorator examples — interview patterns

**Definition:**

// Method decorator — receives PropertyDescriptor

const logMethod = (
  _target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  const original = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    console.log(`Calling ${String(propertyKey)}`);
    return original.apply(this, args);
  };
};

| Aspect | Detail |
|--------|--------|
| Summary | // Method decorator — receives PropertyDescriptor
const logMethod = (
  _target: object,
  propertyKey: string \| symbol |

**Examples:**

```typescript
// Class decorator — receives constructor
const logClass = (constructor: Function) => {
  console.log(constructor.name);
};

// Method decorator — receives PropertyDescriptor
const logMethod = (
  _target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  const original = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    console.log(`Calling ${String(propertyKey)}`);
    return original.apply(this, args);
  };
};

// Decorator factory — factory runs first (top-to-bottom), decorators bottom-to-top
const enumerable = (value: boolean) => (
  _target: object,
  _key: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  descriptor.enumerable = value;
};

@logClass
class User {
  constructor(public name: string) {}

  @logMethod
  @enumerable(false)
  getPass() {
    return this.name;
  }
}
// Factory order: logMethod factory → enumerable factory → enumerable called → logMethod called
```

```typescript
// AOP logging decorator — frameworks like NestJS use similar patterns
function Log(
  _target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const original = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    console.log(`Call: ${propertyKey}(${args.join(", ")})`);
    return original.apply(this, args);
  };
}

class Service {
  @Log
  getData(id: number) {
    return { id, name: "Test" };
  }
}

new Service().getData(42); // Console: Call: getData(42)
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Decorator composition — exact execution order

**Definition:**

Decorator composition — exact execution order — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | Decorator composition — exact execution order — TypeScript language or compiler feature. |

---

**Examples:**

```typescript
const first = () => {
  console.log("first() completing");
  return () => console.log("first() called");
};
const second = () => {
  console.log("second() completing");
  return () => console.log("second() called");
};

class User {
  @first()
  @second()
  getPass() {
    return "pass";
  }
}
// Console output:
// "first() completing"   ← factory 1 evaluated (top to bottom)
// "second() completing"  ← factory 2 evaluated
// "second() called"      ← decorator 2 applied (bottom to top)
// "first() called"       ← decorator 1 applied
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Declaration Merging

**Definition:** Multiple declarations with the same `interface` name merge into one type.

**When to use:** Augment globals (`interface Window { myApp: App }`) or library types. Only works with `interface`, not `type`.

**Thoughts:**

Declarations create entities in three groups — **namespace**, **type**, and **value**. What merges depends on declaration kind:

| Declaration | Namespace | Type | Value |
|-------------|-----------|------|-------|
| Namespace   | ✓         | ✓    | ✓     |
| Class       | ✓         | ✓    | ✓     |
| Enum        | ✓         | ✓    | ✓     |
| Interface   |           | ✓    |       |
| Type Alias  |           | ✓    |       |
| Function    |           |      | ✓     |
| Variable    |           |      | ✓     |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Interface merging

**Definition:**

// Function members → overloads (later interfaces win ordering for overload sets)

interface Cloner { clone(animal: Animal): Animal; }
interface Cloner { clone(animal: Sheep): Sheep; }
typescript
interface Box { height: number; width: number; }
interface Box { scale: number; }

let box: Box = { height: 5, width: 6, scale: 10 };

// Function members → overloads (later interfaces win ordering for overload sets)
interface Cloner { clone(animal: Animal): Animal; }
interface Cloner { clone(animal: Sheep): Sheep; }
```

Non-function members with the same name must have the **same type** or the compiler errors.

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // Function members → overloads (later interfaces win ordering for overload sets)
interface Cloner { clone(animal: Anima |

```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Namespace + class/function/enum merging

**Definition:**

// Function with static properties

function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}
namespace buildLabel {
  export let suffix = "";
  export let prefix = "Hello, ";
}
typescript
// Inner class pattern
class Album {
  label: Album.AlbumLabel;
}
namespace Album {
  export class AlbumLabel {}
}

// Function with static properties
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}
namespace buildLabel {
  export let suffix = "";
  export let prefix = "Hello, ";
}
typescript
// map.ts
import { Observable } from "./observable";
declare module "./observable" {
  interface Observable<T> {
    map<U>(f: (x: T) => U): Observable<U>;
  }
}
Observable.prototype.map = function (f) { /* ... */ };
```

Limitations: can't add new top-level declarations; can't augment default exports.
---

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // Function with static properties
function buildLabel(name: string): string {
  return buildLabel.prefix + name + build |

```

```

**Module augmentation** — patch existing modules (not merge JS modules natively):

```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Enums

**Definition:**

Named constants that compile to a real JavaScript object (numeric or string members).

| When to use | Notes |
|-------------|-------|
| `enum Color { Red, Green }` then `Color.Red`. Numeric enums support reverse lookup; string enums don't. See Everyday Types → Enums for React/`as const` alternatives. | Modern code often prefers `as const` objects over enums to stay closer to plain JS. Numeric enums get **reverse mappings** (`Enum[0] === "A"`); string enums do not. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Numeric enums

**Definition:**

// Without initializer: Up = 0, Down = 1, ...

enum Dir { Up, Down, Left, Right }
 |

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // Without initializer: Up = 0, Down = 1, ...
enum Dir { Up, Down, Left, Right }
```

```typescript
enum Direction {
  Up = 1,
  Down,   // 2 — auto-increment
  Left,   // 3
  Right,  // 4
}

// Without initializer: Up = 0, Down = 1, ...
enum Dir { Up, Down, Left, Right }
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### String enums

**Definition:**

Serialize/debug better than opaque numeric values. No auto-increment.

| Aspect | Detail |
|--------|--------|
| Summary | Serialize/debug better than opaque numeric values. No auto-increment. |

Serialize/debug better than opaque numeric values. No auto-increment.

**Examples:**

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Union enums & const enums

**Definition:**

// const enum — inlined at compile time, no runtime object

const enum Direction { Up, Down, Left, Right }
let dirs = [Direction.Up, Direction.Down]; // → [0, 1] in JS

| Operator | Meaning |
|----------|----------|
| `A \| B` | One of A or B |
| `A & B` | Must satisfy both |

**How it works:**

use `keyof typeof MyEnum`, not `keyof MyEnum`.

---

**Examples:**

```typescript
// Literal enum members → enum members become types too
enum ShapeKind { Circle, Square }
interface Circle { kind: ShapeKind.Circle; radius: number; }

// const enum — inlined at compile time, no runtime object
const enum Direction { Up, Down, Left, Right }
let dirs = [Direction.Up, Direction.Down]; // → [0, 1] in JS

// Pitfall: ambient const enums in .d.ts break isolatedModules consumers
```

```typescript
const ODirection = { Up: 0, Down: 1, Left: 2, Right: 3 } as const;
type Direction = typeof ODirection[keyof typeof ODirection];
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Iterators and Generators

**Definition:**

`Symbol.iterator` enables `for..of`; `function*` yields lazy sequences.

| When to use | Notes |
|-------------|-------|
| Type generator return as `Generator<Yield, Return, Next>`. Iterable types work with `for..of` and spread. | `for..in` iterates **keys** (often array indices as strings); `for..of` iterates **values** via the iterator protocol. On `Set`, `for..in` only sees non-iterator properties like `"species"`, not eleme |

**Examples:**

```typescript
let list = [4, 5, 6];
for (let i in list)  console.log(i); // "0", "1", "2" — keys
for (let v of list)  console.log(v); // 4, 5, 6 — values

function toArray<X>(xs: Iterable<X>): X[] {
  return [...xs];
}

// Generators — function* yields values
function* gen() {
  yield 1;
  yield 2;
}
for (const n of gen()) console.log(n);
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### JSX

**Definition:**

XML-like syntax in `.tsx` files for UI frameworks (React, etc.).

| When to use | Notes |
|-------------|-------|
| Set `"jsx": "react-jsx"` in `tsconfig`. TS types props via `JSX.IntrinsicElements` and component types. | Angle-bracket type assertions (`<Foo>bar`) are **disallowed** in `.tsx` — use `bar as Foo` instead (parser ambiguity with JSX tags). |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Setup & jsx modes

**Definition:**

1. Use `.tsx` extension

2. Set `"jsx"` in `tsconfig.json`

1. Use `.tsx` extension
2. Set `"jsx"` in `tsconfig.json`

| Mode | Output |
|------|--------|
| `preserve` | Keep JSX → `.jsx` |
| `react` | `React.createElement(...)` |
| `react-jsx` | Automatic runtime `_jsx(...)` |
| `react-native` | Keep JSX → `.js` |

**How it works:**

* Lowercase (`<div>`) → intrinsic DOM/host element → `JSX.IntrinsicElements`
* Uppercase (`<MyComponent>`) → your component → resolved from scope

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Type checking highlights

**Definition:**

// FC must return JSX.Element (or customize JSX.ElementType in TS 5.1+)

interface Props { name: string }
function Greet(props: Props) {
  return <span>{props.name}</span>;
}

| Aspect | Detail |
|--------|--------|
| Summary | // FC must return JSX.Element (or customize JSX.ElementType in TS 5.1+)
interface Props { name: string }
function Greet( |

Configure via `jsxFactory`, `jsxFragmentFactory`, `jsxImportSource`.
---

**Examples:**

```typescript
// Intrinsic elements
declare namespace JSX {
  interface IntrinsicElements {
    foo: { bar?: boolean };
  }
}

// FC must return JSX.Element (or customize JSX.ElementType in TS 5.1+)
interface Props { name: string }
function Greet(props: Props) {
  return <span>{props.name}</span>;
}

// Children — JSX.ElementChildrenAttribute (default: children)
// Attributes — JSX.ElementAttributesProperty (default: props)
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Mixins

**Definition:**

Functions that take a class and return an extended class — compose behavior without multiple inheritance.

| When to use | Notes |
|-------------|-------|
| `` class User extends WithId(WithTimestamp(Entity)) `` — stack mixin factories. | Best supported via **class expression** return from a generic factory — not via decorators (decorator mixins don't merge types onto the class). |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Class expression pattern

**Definition:**

Class expression pattern — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | Class expression pattern — TypeScript language or compiler feature. |

**Constrained mixins** — generic base constraint ensures required methods exist:

---

**Examples:**

```typescript
type Constructor = new (...args: any[]) => {};

function Scale<TBase extends Constructor>(Base: TBase) {
  return class Scaling extends Base {
    _scale = 1;
    setScale(scale: number) { this._scale = scale; }
    get scale() { return this._scale; }
  };
}

class Sprite {
  name = "";
  constructor(name: string) { this.name = name; }
}

const EightBitSprite = Scale(Sprite);
const bird = new EightBitSprite("Bird");
bird.setScale(0.8);
```

```typescript
type GConstructor<T = {}> = new (...args: any[]) => T;
type Positionable = GConstructor<{ setPos(x: number, y: number): void }>;

function Jumpable<TBase extends Positionable>(Base: TBase) {
  return class extends Base {
    jump() { this.setPos(0, 20); }
  };
}
```

```typescript
// Stacking mixins — WithId + WithTimestamp
type Constructor<T = object> = new (...args: any[]) => T;

function WithId<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    id = Math.random().toString(36).slice(2);
  };
}

function WithTimestamp<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

class Entity {}

class User extends WithId(WithTimestamp(Entity)) {
  name = "Alice";
}

const u = new User();
// u.id, u.timestamp, u.name — all present
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Namespaces

**Definition:**

Legacy way to group code in global scope: `namespace Utils { export function f() {} }`.

| When to use | Notes |
|-------------|-------|
| Prefer ES modules (`import`/`export`) in modern code. Namespaces still appear in older `.d.ts` files. | `module X` is legacy alias for `namespace X`. Prefer **ES modules** (`import`/`export`) in modern code — namespaces pollute the global scope and complicate dependency tracking. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Patterns

**Definition:**

Utils.getPass("Yauhen", 31);           // "Yauhen31"

Utils.isEmpty(Utils.SECRET);         // false

| Aspect | Detail |
|--------|--------|
| Summary | Utils.getPass("Yauhen", 31);           // "Yauhen31"
Utils.isEmpty(Utils.SECRET);         // false |

**Ambient namespaces** (`declare namespace D3 { ... }`) describe global libraries loaded via `<script>`.
---

**Examples:**

```typescript
// Legacy namespace — encapsulates globals; must export to expose
namespace Utils {
  export const SECRET = "123321";
  const PI = 3.14; // private to namespace — not accessible outside
  export const getPass = (name: string, age: number) => `${name}${age}`;
  export const isEmpty = <T>(data: T) => !data;
}

Utils.getPass("Yauhen", 31);           // "Yauhen31"
Utils.isEmpty(Utils.SECRET);         // false

// Modern equivalent — ES modules (no namespace wrapper needed)
// export const SECRET = "123321";
// export const getPass = ...
// import { getPass, SECRET } from "./Utils";

namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) { return s.length === 5 && /^\d+$/.test(s); }
  }
}

// Alias — import q = x.y.z (not the same as import from "module")
import polygons = Shapes.Polygons;
let sq = new polygons.Square();

// Multi-file: same namespace name merges across files
// Use /// <reference path="..." /> to order compilation
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Namespaces and Modules

**Definition:**

How TS organizes code — ES modules (files) vs legacy namespaces (global).

| When to use | Notes |
|-------------|-------|
| Use `import`/`export` per file. Namespaces only for global augmentation or legacy interop. | Don't `/// <reference path="foo.ts">` when you mean `import` — references add files to compilation; imports are the module graph. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Common pitfalls

**Definition:**

// GOOD

export class Triangle {}

| Aspect | Detail |
|--------|--------|
| Summary | // GOOD
export class Triangle {} |

**How it works:** ---

**Examples:**

```typescript
// BAD — needless namespace wrapper in a module
export namespace Shapes {
  export class Triangle {}
}
// Consumer: new shapes.Shapes.Triangle() 😬

// GOOD
export class Triangle {}

// Modules can't use outFile with commonjs/umd — only amd/system
```

```typescript
// myModules.d.ts (not a module)
declare module "SomeModule" {
  export function fn(): string;
}

// myOtherModule.ts
/// <reference path="myModules.d.ts" />
import * as m from "SomeModule";
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Symbols

**Definition:**

ES6 primitive for unique keys — `Symbol("desc")` always creates a new value.

| When to use | Notes |
|-------------|-------|
| Use for hidden object keys, `Symbol.iterator` for iterables, `unique symbol` for branded types. | `sym2 === sym3` is always `false` even with the same description. TypeScript's `unique symbol` type ties identity to a **specific declaration** — only on `const` or `readonly static`.  --- |

**Examples:**

```typescript
const sym = Symbol();
let obj = { [sym]: "value" };
console.log(obj[sym]); // "value"

// unique symbol — must be const
declare const sym1: unique symbol;
let sym3: typeof sym1 = sym1; // OK — same declaration

const sym2 = Symbol();
const sym3b = Symbol();
// if (sym2 === sym3b) {} // Error: types have no overlap

class C {
  static readonly StaticSymbol: unique symbol = Symbol();
}
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Triple-Slash Directives

**Definition:**

Single-line `///` comments at file top that instruct the compiler.

| When to use | Notes |
|-------------|-------|
| `` /// <reference path="./types.d.ts" /> `` — legacy; prefer `import` and `tsconfig` `references` today. | As of TS 5.5, the compiler does **not** emit handwritten triple-slash directives to output unless `preserve="true"`. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Common directives

**Definition:**

/// <amd-module name="NamedModule"/>    // Name AMD module in output

|

* **`reference path`** — relative file dependency; depth-first resolution
* **`reference types`** — like `import` for declaration packages (`@types/node`); prefer `"types"` in `tsconfig.json` for `.ts` files
* **`reference lib`** — pull in DOM/ES lib slices
* **`--noResolve`** — ignores all reference directives

**How it works:**

`/// <amd-dependency path="..." />` — use `import "moduleName"` instead.

---

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | /// <amd-module name="NamedModule"/>    // Name AMD module in output
```

```typescript
/// <reference path="./utils.ts" />     // Add file to compilation (ordering)
/// <reference types="node" />          // Include @types package
/// <reference lib="es2017.string" />   // Include built-in lib (like --lib)
/// <reference no-default-lib="true"/>  // Skip default lib.d.ts

/// <amd-module name="NamedModule"/>    // Name AMD module in output
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Ambient Declarations and `declare`

**Definition:**

Type-only descriptions of code that exists elsewhere (JS libs, globals, `.d.ts` shims).

| When to use | Notes |
|-------------|-------|
| `` declare const $: JQueryStatic `` or `declare module "legacy"`. Emits no JS. | `declare` does not create a value at runtime. Pair with `@types/*` packages or hand-written `.d.ts` for untyped libraries. |

**Examples:**

```typescript
// Global variable loaded via <script>
declare const jQuery: (selector: string) => unknown;

// Ambient module — shape of an untyped npm package
declare module "legacy-lib" {
  export function doSomething(x: number): string;
}

// Ambient namespace — global library
declare namespace D3 {
  export function select(selector: string): unknown;
}

// declare class/function/var — types only, no JS emit
declare function greet(name: string): void;
declare class LegacyWidget {
  constructor(el: string);
  render(): void;
}

// Asset imports — tell TS non-TS files exist (Vite/Webpack)
declare module "*.svg" {
  const content: string;
  export default content;
}
declare module "*.png" {
  const src: string;
  export default src;
}
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### `noImplicitAny` and `strictNullChecks` — interview definitions

**Definition:**

Both are enabled by `"strict": true` in `tsconfig.json`.

---

| Aspect | Detail |
|--------|--------|
| Summary | Both are enabled by `"strict": true` in `tsconfig.json`.
--- |

**`noImplicitAny`** — when TS cannot infer a type, it would default to `any`. This flag makes that an **error**, forcing explicit annotations. Prevents silent loss of type safety in function parameters and untyped variables.

**`strictNullChecks`** — by default `null` and `undefined` assign to any type. This flag makes them distinct — you must handle nullability explicitly. Catches the most common production bug class.

Both are enabled by `"strict": true` in `tsconfig.json`.
---

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Type Compatibility

**Definition:**

Rules for when type A is assignable to type B — structural, not nominal.

| When to use | Notes |
|-------------|-------|
| Extra properties OK on variables passed to functions; excess checks on fresh literals. See assignability table. | TS is intentionally **unsound** in places — extra properties on variables are OK when passing to a function, but **not** in object literals assigned to a typed variable. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Core rules

**Definition:**

// let bad: Pet = { name: "Lassie", owner: "Rudd" }; // Error — excess property check

|

**How it works:**

parameters are checked **bivariantly** by default (unsound) — you can assign `(a: number) => void` to `(b: number, s: string) => void`. Enable `strictFunctionTypes` to fix for non-method signatures.

source return must be a **subtype** of target return.

only **instance** members compared; static/constructor ignored. **Private/protected** members must originate from the **same** class for compatibility.

`Empty<number>` and `Empty<string>` compatible if `T` unused in structure; `NotEmpty<number>` vs `NotEmpty<string>` — error.

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // let bad: Pet = { name: "Lassie", owner: "Rudd" }; // Error — excess property check
```

```typescript
interface Pet { name: string; }
let dog = { name: "Lassie", owner: "Rudd" };
let pet: Pet = dog; // OK — extra 'owner' is fine

// let bad: Pet = { name: "Lassie", owner: "Rudd" }; // Error — excess property check
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Assignability table (summary)

**Definition:**

Assignability table (summary) — TypeScript language or compiler feature.

|        | any | unknown | object | void | undefined | null | never |
|--------|-----|---------|--------|------|-----------|------|-------|
| → any  | ✓   | ✓       | ✓      | ✓    | ✓         | ✓*   | ✕     |
| → unknown | ✓ | ✕       | ✕      | ✕    | ✕         | ✕    | ✕     |
| never → | ✓  | ✓       | ✓      | ✓    | ✓         | ✓    | ✓     |

*`strictNullChecks` off changes `null`/`undefined` behavior significantly.

**unknown** ≈ inverse of **never**: everything assignable to `unknown`; `unknown` assignable only to `any` (and itself).
---

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Type Inference

**Definition:**

How TS deduces types when you omit annotations.

| When to use | Notes |
|-------------|-------|
| Let inference work first; annotate at API boundaries. Contextual typing fills callback param types. | Inference picks a **best common type** from candidates — if no single supertype exists, you get a **union** (`Rhino \| Elephant \| Snake`) instead of `Animal[]` unless you annotate or provide context. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Best common type

**Definition:**

Best common type — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | Best common type — TypeScript language or compiler feature. |

**Examples:**

```typescript
let x = 3;                    // number
let arr = [0, 1, null];       // (number | null)[]

let zoo = [new Rhino(), new Elephant(), new Snake()];
// (Rhino | Elephant | Snake)[] — not Animal[]

let zoo2: Animal[] = [new Rhino(), new Elephant(), new Snake()]; // OK
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Contextual typing

**Definition:**

// Without context, parameter is `any` (unless noImplicitAny)

const handler = function (uiEvent) {
  console.log(uiEvent.button); // OK — no error without context
};

| Aspect | Detail |
|--------|--------|
| Summary | // Without context, parameter is `any` (unless noImplicitAny)
const handler = function (uiEvent) {
  console.log(uiEvent |

---

**Examples:**

```typescript
window.onmousedown = function (mouseEvent) {
  console.log(mouseEvent.button);    // OK — MouseEvent
  // console.log(mouseEvent.kangaroo); // Error
};

// Without context, parameter is `any` (unless noImplicitAny)
const handler = function (uiEvent) {
  console.log(uiEvent.button); // OK — no error without context
};

// Context applies to: call arguments, assignment RHS, assertions,
// object/array literals, return statements
function createZoo(): Animal[] {
  return [new Rhino(), new Elephant(), new Snake()]; // Animal[] inferred from return type
}
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Variable Declaration

**Definition:**

`var` (function-scoped, hoisted), `let` (block-scoped), `const` (block-scoped, no reassignment).

| When to use | Notes |
|-------------|-------|
| Prefer `const` > `let` > `var`. TS checks all three; `const` does not make objects deeply immutable. | `const` only prevents **rebinding** the variable — object innards remain mutable unless `readonly` or `Object.freeze`. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### var problems

**Definition:**

// Same var in nested loops — classic bug

for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

| Aspect | Detail |
|--------|--------|
| Summary | // Same var in nested loops — classic bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3 |

**Examples:**

```typescript
// Function-scoped — leaks out of blocks
if (true) { var x = 10; }
console.log(x); // 10

// Same var in nested loops — classic bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// Redeclaration allowed
var x = 1;
var x = 2; // OK
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### let — block-scoped

**Definition:**

// Temporal dead zone — can't use before declaration

// a++; let a; // Error

| Aspect | Detail |
|--------|--------|
| Summary | // Temporal dead zone — can't use before declaration
// a++; let a; // Error |

**Examples:**

```typescript
if (true) {
  let b = 1;
}
// console.log(b); // Error — not in scope

// Temporal dead zone — can't use before declaration
// a++; let a; // Error

// Per-iteration binding in loops
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}

// No redeclaration in same scope
let x = 10;
// let x = 20; // Error
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### const & destructuring

**Definition:**

// Prefer const unless you will reassign (least privilege)

| Aspect | Detail |
|--------|--------|
| Summary | // Prefer const unless you will reassign (least privilege) |

**Examples:**

```typescript
const kitty = { name: "Aurora", numLives: 9 };
// kitty = { ... };     // Error — rebind
kitty.name = "Rory";    // OK — mutate property

// Prefer const unless you will reassign (least privilege)

// Array destructuring
let [first, second] = [1, 2];
let [head, ...rest] = [1, 2, 3, 4]; // rest: [2,3,4]

// Object destructuring
let { a, b } = { a: 1, b: 2 };
let { a: renamed } = { a: 1 }; // property rename

// Tuple destructuring preserves element types
let tuple: [number, string] = [7, "hello"];
let [n, s] = tuple; // n: number, s: string
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Quick list — checklist

1. **`const` type parameters** — literal inference in generics (TS 5.0+)
2. **`using` / `Disposable`** — scoped resource cleanup (TS 5.2+)
3. **`override` keyword** — explicit, checked method overrides
4. **Stricter compiler flags** — `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
5. **ESM/CJS** — `moduleResolution: node16` / `nodenext`, `verbatimModuleSyntax`
6. **Project references** — split monorepos, incremental `tsc --build`
7. **Publishing typed packages** — `declaration`, `types` field, bundling `.d.ts`
8. **Recursive types** — `Json`, trees, deep `Partial`
9. **Variance** — covariant returns, contravariant params, bivariance pitfalls
10. **Runtime validation** — TS types ≠ runtime; use Zod/io-ts for external data

</details>

<a name="advanced"></a>

## Advanced topics

<details>
  <summary>Modern TypeScript</summary>

### `const` Type Parameters (TS 5.0+)

**Definition:**

Generic parameter modifier that preserves literal types in inference.

| When to use | Notes |
|-------------|-------|
| `` function routes<const T extends readonly string[]>(paths: T) `` — keeps tuple of literals, not `string[]`. | recursion must have a **base case** (`T extends object` guard) or the compiler hits depth limits. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Variance (functions and assignability)

**Definition:**

How subtyping works for function params (contravariant) and returns (covariant).

| Aspect | Detail |
|--------|--------|
| Summary | How subtyping works for function params (contravariant) and returns (covariant). |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>

<a name="interview-practice"></a>

## Interview Practice

<details>
  <summary>Interview Practice</summary>

### Interview Practice

**Definition:** Type-level puzzles and common live-coding prompts for TypeScript interviews.

| Area | Must know |
|------|-----------|
| **Basics** | `any` vs `unknown` vs `never`, narrowing, unions |
| **Structure** | `interface` vs `type`, generics, utility types |
| **Safety** | `strict`, discriminated unions, exhaustiveness, `erasableSyntaxOnly` |
| **Advanced** | `infer`, conditional/mapped types, `keyof` |
| **Runtime** | Types erased — validate external data (Zod) |

**Sources:** [Type challenges](https://github.com/type-challenges/type-challenges)

| Topic | Answer |
|-------|--------|
| Why TS / large projects / when it hurts | Q&A |
| Design-first interfaces / `private` vs `#` | Q&A |
| `any` acceptable cases, extend `interface` | Q&A |
| Unions, literals, build with type errors | Q&A |
| Typify API/object/array/function | Q&A |
| Optional / `undefined` fields | Q&A |
| Cart aggregation (typed) | Task — Cart |

---

### Questions & Answers

<details>
  <summary>What is TypeScript?</summary>

### What is TypeScript?

**Definition:** Typed superset of JavaScript — types are checked at compile time and **erased** in emitted JS. Adds interfaces, generics, enums, and strict null checks without changing runtime semantics.

| Pros | Cons |
|------|------|
| Safer refactors, better IDE support | Extra compile step |
| Gradual adoption (`allowJs`) | `any` / `as` can bypass safety |
| Catches bugs before deploy | Types don't exist at runtime |

**How it works:** `tsc` (or esbuild/swc with `noEmit` check) analyzes code → reports errors → emits JS. External data (API, `JSON.parse`) still needs runtime validation (Zod, io-ts) because TS cannot verify network payloads.

**When to use:** Any maintained app, shared libraries, teams, NestJS/Angular codebases.

**Examples:**

```typescript
function greet(name: string): string {
  return `Hello, ${name}`;
}
greet(42); // compile error: number not assignable to string
```

**Interview one-liner:** *"TypeScript is JavaScript with optional static types — compile-time safety, runtime is still JS."*

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>

<details>
  <summary>Why TypeScript for OOP if it emits JS?</summary>

### Why TypeScript for OOP if it emits JS?

**Short answer:** JS has classes but **no interfaces**. TS lets you design entity relations on abstractions and fail at compile time. Runtime is still JS, so `private` is erased — use `#` for real hiding.

**How it works:** Write `interface Ledger { addRecord(r: LedgerEntry): void }` first. Implementations `implements Ledger`. Wrong wiring (missing field, wrong `kind`) is a `tsc` error. Same reason as car diagnostics before you drive.

**When to use:** Domain-heavy apps, DI, teams. Not needed for a 20-line script.

**See also:** [Design-first OOP with interfaces](#classes) · [Doka — OOP](https://doka.guide/tools/oop/)

</details>

<details>
  <summary>Compiler vs transpiler?</summary>

### Compiler vs transpiler?

**Definition:** `tsc` **type-checks** (compiler) and **emits JS** from TS (transpilation between high-level languages).

| Role | `tsc` |
|------|-------|
| Compiler | Static analysis |
| Transpiler | TS → JS emit |

**Examples:**

```bash
tsc --noEmit
tsc
```

**Sources:** [TypeScript from scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

</details>

<details>
  <summary>Error handling — static vs runtime?</summary>

### Error handling — static vs runtime

**Definition:** TypeScript catches shape errors at compile time; runtime still needs `try/catch` and schema validation for external data.

| Layer | Tooling |
|-------|---------|
| Compile time | `tsc`, IDE |
| Runtime | `try/catch`, Zod/io-ts |

**Examples:**

```typescript
function parseAge(input: string): number {
  const n = Number(input);
  if (Number.isNaN(n)) throw new Error("Invalid age");
  return n;
}
```

**Sources:** [Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>

<details>
  <summary>Union vs intersection?</summary>

### Union vs intersection

**Definition:** `A | B` — one of; `A & B` — must satisfy all. `string & number` is impossible.

| Operator | Meaning |
|----------|---------|
| `\|` | either type |
| `&` | combine shapes |

**Examples:**

```typescript
let id: number | string;
type Person = { name: string } & { age: number };
```

**Sources:** [Unions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

</details>

<details>
  <summary>`any` vs `unknown` vs `never`?</summary>

### `any` vs `unknown` vs `never`

**Definition:** `any` disables checking; `unknown` requires narrowing; `never` is the empty type (unreachable).

| Type | Behavior |
|------|----------|
| `any` | No checks |
| `unknown` | Narrow before use |
| `never` | Exhaustiveness / throws |

**Examples:**

```typescript
function parse(input: unknown) {
  if (typeof input === "string") return input.trim();
}
```

**Sources:** [Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

</details>

<details>
  <summary>`interface` vs `type`?</summary>

### `interface` vs `type`

**Definition:** Both describe object shapes and work with classes (`implements`). Structural typing means compatible shapes assign to each other regardless of keyword.

**How it works:**

| Feature | `interface` | `type` |
|---------|-------------|--------|
| Object shape | yes | yes |
| Extend | `extends` | intersection `&` |
| Declaration merging | yes — duplicate name merges fields | no — duplicate = error |
| Union `A \| B` | no | yes |
| Tuple `[string, number]` | awkward | natural |
| Mapped / conditional types | limited | primary tool |
| Primitives alias `type ID = string` | no | yes |
| `implements` in class | yes | yes (often via intersection) |

**When to use:**

- **`interface`** — public object contracts (DTOs, plugin APIs) you may augment later (`declare module 'express-serve-static-core'`).
- **`type`** — unions, discriminated unions, utility-type pipelines (`Pick`, `Omit`, `ReturnType`).

**Examples:**

```typescript
// interface — merging (common for augmenting library types)
interface User { id: string }
interface User { email: string } // merged

// type — union (impossible with interface alone)
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// equivalent extension
interface Admin extends User { role: 'admin' }
type AdminUser = User & { role: 'admin' };
```

**Interview pitfall:** "Which is faster?" — negligible difference; choose by expressiveness. Don't use `interface` for union types; don't use `type` when you need module augmentation.

**Thoughts:** For 90% of object shapes either works — consistency in the codebase matters more than the keyword.

**Sources:** [Handbook — Differences between type aliases and interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)

</details>

<details>
  <summary>Why avoid `enum`?</summary>

### Why avoid `enum`?

**Definition:** Numeric enums add runtime objects; `as const` + union is lighter and tree-shake friendly.

**Examples:**

```typescript
const Status = { Active: "active", Removed: "removed" } as const;
type Status = (typeof Status)[keyof typeof Status];
```

**Sources:** [Enums](https://www.typescriptlang.org/docs/handbook/enums.html)

</details>

<details>
  <summary>Important strict compiler flags?</summary>

### Important strict compiler flags

**Definition:** `strict` enables `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, and related checks.

| Flag | Effect |
|------|--------|
| `strictNullChecks` | `null`/`undefined` not assignable everywhere |
| `noUncheckedIndexedAccess` | Index access may be `undefined` |

**Sources:** [tsconfig](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

</details>

<details>
  <summary>OOP principles in TypeScript?</summary>

### OOP principles in TypeScript

**Definition:** Encapsulation, inheritance (`extends`), polymorphism (overrides), abstraction (`abstract`/`interface`).

| Principle | TS mechanism |
|-----------|--------------|
| Encapsulation | `private`, `protected`, `readonly` |
| Inheritance | `extends` (single base) |
| Abstraction | `abstract class`, `interface` |

**Examples:**

```typescript
abstract class Animal {
  constructor(public name: string) {}
  abstract makeSound(): void;
}
class Dog extends Animal {
  makeSound() { console.log("Woof"); }
}
```

**Sources:** [Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<details>
  <summary>`extends` vs `implements`?</summary>

### `extends` vs `implements`

**Definition:** `extends` inherits one class; `implements` satisfies interface contract(s) without inherited code.

| | `extends` | `implements` |
|---|-----------|----------------|
| Target | class | interface(s) |
| Implementation | inherited | must provide members |

**Sources:** [Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<details>
  <summary>What problems does TypeScript solve? Why in large projects?</summary>

### What problems does TypeScript solve? Why in large projects?

**Definition:** TypeScript adds optional static types to JavaScript — catching shape errors at compile time before they reach production.

**Problems it solves:**

- Typos and wrong property access (`user.nmae`)
- Refactoring safety — rename a field, compiler finds all usages
- Self-documenting APIs — function signatures show intent
- Better IDE autocomplete and navigation
- Shared contracts between frontend/backend modules

**Why large projects:** More files, more developers, more integration points — types scale communication better than comments. `strict` mode pays off when the codebase outlives any single developer's memory.

**Thoughts:** *Types are documentation that the compiler enforces.*

**See also:** [What is TypeScript?](#what-is-typescript) · intro section

</details>

<details>
  <summary>When can TypeScript hinder development?</summary>

### When can TypeScript hinder development?

**Definition:** TS helps most maintained apps, but it has costs — especially early in a project or when misused.

| Hindrance | Mitigation |
|-----------|------------|
| Learning curve | Start with `strict` gradually; use `allowJs` |
| Slower CI if whole monolith type-checks | Project references, incremental builds |
| Fighting the compiler on complex generics | Simplify; don't over-engineer types |
| `any` / `as` escape hatches bypass safety | Enable `noImplicitAny`, code review |
| Third-party libs without types | `@types/*`, local `.d.ts`, `unknown` + Zod at boundaries |
| Prototyping speed | `// @ts-nocheck` on spike files only — not production |

**Thoughts:** *TS hurts when you treat types as bureaucracy instead of guardrails — or when the team disables strict checks.*

</details>

<details>
  <summary>When is `any` acceptable?</summary>

### When is `any` acceptable?

**Definition:** `any` disables type checking — use sparingly at boundaries, not as a default.

**Acceptable cases:**

- Gradual migration from JS (`allowJs` codebase)
- Prototyping spike code (temporary, with ticket to type later)
- Truly dynamic data with immediate narrowing to `unknown`
- Legacy third-party code with no types and no time to wrap

**Prefer instead:** `unknown` + narrowing, generics, or a thin typed wrapper around untyped lib.

**Thoughts:** *`any` is a scalpel for migration boundaries — not a lifestyle.*

**See also:** [`any` vs `unknown` vs `never`](#any-vs-unknown-vs-never)

</details>

<details>
  <summary>Can you extend an `interface`?</summary>

### Can you extend an `interface`?

**Definition:** Yes — `interface` supports `extends` for inheritance and **declaration merging** for augmenting.

**How it works:**

```typescript
interface User { id: string }
interface User { email: string } // merges — User has id + email

interface Admin extends User { role: 'admin' }
```

- `extends` — inherit fields from another interface or class.
- Declaration merging — duplicate `interface` names combine (useful for module augmentation).
- `type` uses intersection (`&`) instead; no merging.

**Thoughts:** *Use `interface` when you may extend or augment; use `type` for unions.*

**See also:** [`interface` vs `type`](#interface-vs-type)

</details>

<details>
  <summary>Union and literal types — where are they used?</summary>

### Union and literal types — where are they used?

**Definition:** Unions (`A | B`) model "one of"; literal types (`'pending' | 'done'`) restrict to specific values.

**Where used:**

| Use case | Example |
|----------|---------|
| API status | `type Status = 'idle' \| 'loading' \| 'error'` |
| Discriminated unions | `{ kind: 'success'; data: T } \| { kind: 'error'; msg: string }` |
| Config keys | `type Theme = 'light' \| 'dark'` |
| Function overload input | `string \| number` ID |
| `as const` objects | Preserve literals instead of widening to `string` |

**Thoughts:** *Literal unions + discriminant field = safe `switch` with exhaustiveness checking.*

**See also:** [Union Types](#union-types) · [Literal Types](#literal-types) · [Discriminated Unions](#discriminated-unions)

</details>

<details>
  <summary>What happens on build with type errors?</summary>

### What happens on build with type errors?

**Definition:** By default `tsc` **reports errors but may still emit JS** — types do not block output unless configured.

**How it works:**

| Setting / flag | Behavior |
|----------------|----------|
| Default `tsc` | Errors logged; JS may still be emitted |
| `noEmitOnError: true` | No JS output until types pass |
| `tsc --noEmit` | Type-check only — no emit (common in CI) |
| Vite/esbuild/SWC | Transpile without type-check; run `tsc --noEmit` separately |

**Interview answer:** *In strict CI we run `tsc --noEmit` and fail the build on errors. Bundlers alone don't guarantee type safety.*

**Thoughts:** *Type-checking and transpilation are separate steps in modern pipelines.*

**Sources:** [tsconfig — noEmitOnError](https://www.typescriptlang.org/tsconfig#noEmitOnError)

</details>

<details>
  <summary>How to typify API response, object, array, and function?</summary>

### How to typify API response, object, array, and function?

**Definition:** Model shapes at boundaries; validate external data at runtime because TS types are erased.

**API response:**

```typescript
type User = { id: string; name: string };
type ApiResponse<T> = { data: T; meta: { page: number } };

async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  const json: unknown = await res.json();
  // validate with Zod in production
  return json as User;
}
```

**Object (product):**

```typescript
type Product = { id: string; name: string; price: number; category: 'food' | 'electronics' };
```

**Array of objects:**

```typescript
const products: Product[] = await res.json();
// or ReadonlyArray<Product> for immutability
```

**Function with return object:**

```typescript
type CartSummary = { subtotal: number; discount: number; total: number };

function calculateCart(items: CartItem[]): CartSummary {
  return items.reduce(/* ... */, { subtotal: 0, discount: 0, total: 0 });
}
```

**Thoughts:** *Types describe intent; Zod/io-ts validates reality at the network boundary.*

</details>

<details>
  <summary>How to handle optional and `undefined` fields?</summary>

### How to handle optional and `undefined` fields?

**Definition:** With `strictNullChecks`, missing and `undefined` must be handled explicitly.

| Syntax | Meaning |
|--------|---------|
| `prop?: string` | May be absent or `undefined` |
| `prop: string \| undefined` | Must be present; value may be `undefined` |
| `obj.prop?.trim()` | Optional chaining — short-circuits on null/undefined |
| `value ?? 'default'` | Nullish coalescing — only for `null`/`undefined` |

```typescript
type User = { name: string; email?: string };

function greet(user: User) {
  const domain = user.email?.split('@')[1] ?? 'unknown';
  return `${user.name}@${domain}`;
}
```

**Thoughts:** *`?` on props + `?.` and `??` at access sites — never assume a field exists.*

**See also:** [Optional properties](#optional-properties) · [`null` and `undefined`](#null-and-undefined)

</details>

---

`AddressType` defines `city: string`. Intersecting with `{ city: { id: string } }` creates an impossible type (`string & { id: string }`). Keep `AddressType` and `address` unchanged; fix only `AddressWithIdType`.

```typescript
type AddressType = {
  country: string;
  city: string;
};

type AddressWithIdType = AddressType & {
  city: {
    id: string;
    value?: string;
  };
};

const address: AddressWithIdType = {
  country: "Australia",
  city: {
    id: "bd2917ff-08ac-4e0a-a4d6-6185cd6e69c4",
  },
};
```

<details>
  <summary>Solution hint</summary>

### Solution hint

Use `Omit` to drop the conflicting key before intersecting:

```typescript
type AddressWithIdType = Omit<AddressType, "city"> & {
  city: {
    id: string;
    value?: string;
  };
};
```
</details>

---

### Task 2 — Exclude a union member

Implement `RemoveC<T>` so `RemoveC<"a" | "b" | "c">` becomes `"a" | "b"`.

```typescript
type Letters = "a" | "b" | "c";

type RemoveC<T> = unknown; // your implementation

type LettersWithoutC = RemoveC<Letters>;

declare function testFunction(option: "a" | "b");

const validConst1: LettersWithoutC = "a";
const validConst2: LettersWithoutC = "b";
const invalidConst1: LettersWithoutC = "c"; // should error
```

<details>
  <summary>Solution</summary>

```typescript
type RemoveC<T> = Exclude<T, "c">;
// or: T extends "c" ? never : T
```
</details>

---

### Quick oral questions (self-check)

**Definition:** Fourteen self-check questions covering core TypeScript interview topics; answers in the collapsible block below.

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

1. What is the difference between `any` and `unknown`?
2. When would you pick `interface` over `type`?
3. What does `strictNullChecks` change?
4. How does structural typing differ from nominal typing?
5. What is a discriminated union and why is `never` useful with it?
6. What gets erased at compile time — do access modifiers exist at runtime?
7. `Exclude` vs `Omit` — what does each operate on?
8. When is `as const` needed?
9. What does `satisfies` do that `as` does not?
10. When would you use the map pattern instead of a union?
11. What is the difference between a compiler and a transpiler in the context of `tsc`?
12. What is declaration merging on interfaces?
13. When would you use `extends` vs `implements`?
14. What are mixins and why use them over multiple inheritance?
15. What does `erasableSyntaxOnly` ban, and why would you enable it?

<details>
  <summary>Answers</summary>

### Answers

1. **`any` vs `unknown`** — Both accept any value. `any` disables checking: you can call methods, assign anywhere, no narrowing required. `unknown` is the safe top type: you must narrow (`typeof`, `in`, etc.) or assert before use. Prefer `unknown` for external/untrusted data.

2. **`interface` over `type`** — Object shapes you may extend or augment; declaration merging (e.g. patching globals). Use `type` for unions, tuples, primitives, mapped/conditional types. They are **not** identical.

3. **`strictNullChecks`** — `null` and `undefined` are no longer assignable to every type. Optional chaining and explicit checks become required. Catches “forgot to handle null” bugs. Without it, null flows silently everywhere.

4. **Structural vs nominal** — TS uses **structural** typing: compatibility is by shape, not declared name. Two types with the same fields are interchangeable. Java/C# use **nominal** typing: class names matter. Branding simulates nominal IDs in TS.

5. **Discriminated union + `never`** — Objects share a literal field (`kind`, `type`) so TS narrows in `switch`. Assigning the union to `never` in `default` forces exhaustiveness — if you add a variant and forget a branch, compile error.

6. **Erased at compile time** — All type annotations, interfaces, generics, and `private`/`protected` (TS-only) are erased. **No** runtime type info. ECMAScript `#private` fields **do** exist at runtime. `public`/`private` in TS classes are compile-time only unless you use `#`.

7. **`Exclude` vs `Omit`** — `Exclude<T, U>` operates on **union types** (removes members assignable to `U`). `Omit<T, K>` operates on **object types** (removes keys `K` from `T`). Different inputs, different jobs.

8. **`as const`** — When you need **literal types** instead of widened primitives (`"GET"` not `string`, `readonly` tuple, frozen config). Fixes inference on object literals and arrays. Alternative to manual literal unions.

9. **`satisfies` vs `as`** — `satisfies Type` **validates** the value matches the type **and keeps** narrow inferred types (e.g. tuple stays tuple). `as Type` **forces** the type and **widens** inference — no real validation, just trust.

10. **Map pattern vs union** — Use a **map/object** when each variant needs different fields or behavior keyed by a discriminant — avoids huge unions of incompatible shapes. Pattern: `{ [K in Status]: Handler }[status]` instead of `A | B | C` with unrelated fields.

11. **Compiler vs transpiler (`tsc`)** — **Compiler**: type-checking (static analysis). **Transpiler**: TS → JS (high-level to high-level). `tsc` does both. Neither runs at runtime — output is plain JS.

12. **Declaration merging** — Multiple `interface Foo { ... }` blocks with the **same name** merge into one interface (fields combine). Only works with `interface`, not `type`. Common for augmenting `Window`, module types.

13. **`extends` vs `implements`** — `extends`: class inherits **one** base class (implementation + prototype chain). `implements`: class promises to satisfy **one or more** interface contracts (signatures only, no inherited code).

14. **Mixins** — Functions that take a class and return an extended class. Compose behavior without multiple inheritance (which TS/JS don't support). Stack mixins: `class User extends WithId(WithTimestamp(Entity))`.

15. **`erasableSyntaxOnly`** — TS 5.8+ flag: error on syntax that emits runtime JS TypeScript invented (constructor parameter properties, `enum`, `namespace`). Lets runtimes/type-strippers (`tsc --noEmit`, Node type stripping) treat TS as erasable types only. Use `this.x = x` instead of `constructor(public x: number)`.

</details>

---

### Task 3 — Implement `MyPick`

Implement `MyPick<T, K>` like the built-in `Pick`.

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyPick<Todo, "title" | "completed">;
// { title: string; completed: boolean }

const preview: TodoPreview = { title: "Learn TS", completed: false };
```

<details>
  <summary>Solution</summary>

```typescript
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```
</details>

---

### Task 4 — Implement `GetReturnType`

Without using the built-in utility:

```typescript
type MyReturn<T> = unknown; // your implementation

declare const fn: (a: number, b: string) => boolean;
type R = MyReturn<typeof fn>; // should be boolean
```

<details>
  <summary>Solution</summary>

```typescript
type MyReturn<T> = T extends (...args: never[]) => infer R ? R : never;
```
</details>

---

### Task 5 — Implement `DeepReadonly`

Make every property (including nested objects) readonly.

```typescript
interface X {
  a: number;
  b: { c: string };
}

type RX = DeepReadonly<X>;
// { readonly a: number; readonly b: { readonly c: string } }

declare const x: RX;
// x.b.c = "no"; // should error
```

<details>
  <summary>Solution</summary>

```typescript
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
```
</details>

---

### Task 6 — Implement `Flatten`

Unwrap one level of array: `Flatten<string[][]>` → `string[]`.

```typescript
type Flatten<T> = unknown; // your implementation

type A = Flatten<string[]>;       // string
type B = Flatten<number[][]>;     // number[]
type C = Flatten<boolean>;        // boolean
```

<details>
  <summary>Solution</summary>

```typescript
type Flatten<T> = T extends (infer U)[] ? U : T;
```
</details>

---

### Task 7 — Implement `Parameters`

Extract function parameter types as a tuple.

```typescript
type MyParameters<T> = unknown;

declare function join(a: string, b: number): boolean;
type P = MyParameters<typeof join>; // [string, number]
```

<details>
  <summary>Solution</summary>

```typescript
type MyParameters<T> = T extends (...args: infer P) => unknown ? P : never;
```
</details>

---

---

### Oral questions (ITVDN — TypeScript)

**Definition:** Self-check oral questions from ITVDN TypeScript course.

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

79. What are the advantages of typing in TypeScript?

80. What TypeScript features can you use for typing (interfaces, types, enum, etc.)?

81. What is the difference between an interface and a class?

82. What is the difference between an interface and an abstract class?

83. What is the difference between an interface and a type?

---

### Oral questions (extra)

**Definition:** Additional interview oral questions on compiler flags and module patterns.

1. What does `noUncheckedIndexedAccess` change about `arr[i]`?
2. When would you use `import type` vs `import`?
3. How do project references speed up monorepo builds?
4. Why is `as User` on `res.json()` unsafe in production?
5. What is the difference between covariant and contravariant function parameters?
6. When is `const` on a generic type parameter useful?
7. What does `composite: true` enable in `tsconfig`?

<details>
  <summary>Answers</summary>

### Answers

1. **`noUncheckedIndexedAccess`** — Index access returns `T | undefined` instead of `T`. `arr[i]` and `obj[key]` may be out of bounds / missing — you must narrow or use `??` before use. Safer, but noisier on legacy code.

2. **`import type` vs `import`** — `import type` / `export type` are **erased** at emit — no runtime import. Use for types-only symbols. Value imports (`import { fn }`) stay at runtime. `verbatimModuleSyntax` enforces this split. Prevents bundlers from pulling type-only modules into the bundle.

3. **Project references** — Split the monorepo into **composite** projects with `references`. `tsc --build` type-checks and emits **incrementally** — only changed projects rebuild. Dependencies build in order. Faster CI than one giant `tsc` on everything.

4. **`as User` on `res.json()`** — Assertion is **compile-time only**; no runtime check. API can return any JSON shape; wrong data causes runtime crashes (undefined access, wrong types). Use `unknown` + schema validation (Zod, etc.) at the boundary.

5. **Covariant vs contravariant params** — **Return types** are covariant: subtype return is OK when assigning functions. **Parameter types** are contravariant (with `strictFunctionTypes`): function that accepts **wider** input can be assigned where **narrower** input is expected. Methods stay bivariant by default (unsound but ergonomic).

6. **`const` on generic type parameter** — Preserves **literal** inference in generics: `routes<const T>(["/a", "/b"])` → tuple of literals, not `string[]`. Useful for config objects, route defs, and APIs where widening loses precision.

7. **`composite: true`** — Marks a project as part of a **project references** graph. Requires `declaration: true`. Enables incremental builds and lets other projects `reference` this one. Required for `tsc --build` monorepo workflows.

</details>

---

### Task — Cart aggregation (typed)

Fully typed cart calculator — mirrors [3_js_core.md Task 16](./3_js_core.md#interview-practice).

```typescript
type ProductCategory = 'food' | 'electronics' | 'clothing';

type Product = {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
};

type CartItem = { product: Product; qty: number };

type CartSummary = { subtotal: number; discount: number; total: number };

type Discounts = Partial<Record<ProductCategory, number>>;

function calculateCart(items: CartItem[], discounts: Discounts = {}): CartSummary {
  return items.reduce<CartSummary>(
    (acc, { product, qty }) => {
      const lineSubtotal = product.price * qty;
      const rate = discounts[product.category] ?? 0;
      const lineDiscount = lineSubtotal * rate;
      acc.subtotal += lineSubtotal;
      acc.discount += lineDiscount;
      acc.total += lineSubtotal - lineDiscount;
      return acc;
    },
    { subtotal: 0, discount: 0, total: 0 },
  );
}
```

**Interview talking points:**

- `ProductCategory` literal union — discount lookup is type-safe.
- `Partial<Record<...>>` — not every category needs a discount.
- `CartSummary` return type documents the API contract.
- Discriminated variants (e.g. `DigitalProduct | PhysicalProduct`) can extend this with `kind` field + narrowing.

<details>
  <summary>Variant with discriminated product types</summary>

```typescript
type BaseProduct = { id: string; name: string; price: number };

type FoodProduct = BaseProduct & { kind: 'food'; expiryDays: number };
type ElectronicsProduct = BaseProduct & { kind: 'electronics'; warrantyMonths: number };
type ClothingProduct = BaseProduct & { kind: 'clothing'; size: string };

type Product = FoodProduct | ElectronicsProduct | ClothingProduct;

// Narrow in reduce:
function getDiscountRate(product: Product, discounts: Discounts): number {
  return discounts[product.kind] ?? 0;
}
```

</details>

---

</details>
