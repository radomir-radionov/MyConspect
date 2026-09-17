# TypeScript — Basics

Static typing, tsconfig, and everyday types.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — Basics](./5_ts_core.md) · [TypeScript — Narrowing](./5_ts_narrowing.md) · [TypeScript — Functions](./5_ts_functions.md) · [TypeScript — Objects](./5_ts_objects.md) · [TypeScript — Generics](./5_ts_generics.md) · [TypeScript — Reference](./5_ts_reference.md) · [TypeScript — Interview](./5_ts_interview.md)

### Sections

- [Static typing & basics](#static-typing-basics)
- [Compiler & tsconfig](#compiler-tsconfig)
- [Everyday types](#everyday-types)

---

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

### TypeScript vs JavaScript
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
  <summary>Compiler pipeline</summary>

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
