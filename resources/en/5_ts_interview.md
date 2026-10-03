# TypeScript — Interview

Interview Q&A, oral questions, and type-level coding tasks.

[← Back to hub](./5_ts.md)

### Related docs

[TypeScript — hub](./5_ts.md) · [Types](./5_ts_types.md) · [Narrowing](./5_ts_narrowing.md) · [Functions](./5_ts_functions.md) · [Type Manipulation](./5_ts_type_manipulation.md)

### Main concepts

| Section                                                     | Covers                                          |
| ----------------------------------------------------------- | ----------------------------------------------- |
| [Overview](#overview)                                       | Must-know areas and topic map                   |
| [Questions & Answers](#questions-answers)                   | Core interview Q&A, basics to advanced          |
| [Coding tasks](#coding-tasks)                               | Type puzzles — `Pick`, `Exclude`, `infer`, cart |
| [Quick oral questions](#quick-oral-questions-self-check)    | Fifteen self-check prompts                      |
| [Oral questions (ITVDN)](#oral-questions-itvdn--typescript) | Course-style oral questions                     |
| [Oral questions (extra)](#oral-questions-extra)             | Compiler flags and modules                      |

### Sections

- [Overview](#overview)
- [Questions & Answers](#questions-answers)
- [Coding tasks](#coding-tasks)
- [Quick oral questions (self-check)](#quick-oral-questions-self-check)
- [Oral questions (ITVDN — TypeScript)](#oral-questions-itvdn--typescript)
- [Oral questions (extra)](#oral-questions-extra)

---

## Overview

<details>
<summary>Interview checklist</summary>

**Definition:** Type-level puzzles and common live-coding prompts for TypeScript interviews.

| Area          | Must know                                                            |
| ------------- | -------------------------------------------------------------------- |
| **Basics**    | `any` vs `unknown` vs `never`, narrowing, unions                     |
| **Structure** | `interface` vs `type`, generics, utility types                       |
| **Safety**    | `strict`, discriminated unions, exhaustiveness, `erasableSyntaxOnly` |
| **Advanced**  | `infer`, conditional/mapped types, `keyof`                           |
| **Runtime**   | Types erased — validate external data (Zod)                          |

**Sources:** [Type challenges](https://github.com/type-challenges/type-challenges)

</details>

---

## Questions & Answers

Ordered from language basics through classes, tooling, advanced types, then React and Node. Repeated questions from the source list are merged into one block. Answers describe current TypeScript behavior; the pasted source is not copied.

### Basics

<details>
  <summary>What is TypeScript?</summary>

### What is TypeScript?

**Definition:** Typed superset of JavaScript — types are checked at compile time and **erased** in emitted JS. Adds interfaces, generics, enums, and strict null checks without changing runtime semantics.

| Pros                                | Cons                           |
| ----------------------------------- | ------------------------------ |
| Safer refactors, better IDE support | Extra compile step             |
| Gradual adoption (`allowJs`)        | `any` / `as` can bypass safety |
| Catches bugs before deploy          | Types don't exist at runtime   |

**How it works:** `tsc` (or esbuild/swc with `noEmit` check) analyzes code → reports errors → emits JS. External data (API, `JSON.parse`) still needs runtime validation (Zod, io-ts) because TS cannot verify network payloads.

**When to use:** Any maintained app, shared libraries, teams, NestJS/Angular codebases.

**Examples:**

```typescript
function greet(name: string): string {
  return `Hello, ${name}`;
}
greet(42); // compile error: number not assignable to string
```

**Interview one-liner:** _"TypeScript is JavaScript with optional static types — compile-time safety, runtime is still JS."_

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

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

**Thoughts:** _Types are documentation that the compiler enforces._

**See also:** [What is TypeScript?](#what-is-typescript) · intro section

</details>

<details>
  <summary>When can TypeScript hinder development?</summary>

### When can TypeScript hinder development?

**Definition:** TS helps most maintained apps, but it has costs — especially early in a project or when misused.

| Hindrance                                 | Mitigation                                               |
| ----------------------------------------- | -------------------------------------------------------- |
| Learning curve                            | Start with `strict` gradually; use `allowJs`             |
| Slower CI if whole monolith type-checks   | Project references, incremental builds                   |
| Fighting the compiler on complex generics | Simplify; don't over-engineer types                      |
| `any` / `as` escape hatches bypass safety | Enable `noImplicitAny`, code review                      |
| Third-party libs without types            | `@types/*`, local `.d.ts`, `unknown` + Zod at boundaries |
| Prototyping speed                         | `// @ts-nocheck` on spike files only — not production    |

**Thoughts:** _TS hurts when you treat types as bureaucracy instead of guardrails — or when the team disables strict checks._

</details>

<details>
  <summary>Is TypeScript strictly statically typed?</summary>

### Is TypeScript strictly statically typed?

**Definition:** TypeScript is **gradually** typed. The checker is static, but types are optional: `any`, assertions, and missing annotations can turn checking off for a value.

**How it works:** With `strict`, unannotated values become an error (`noImplicitAny`) instead of silently becoming `any`. The type system is also not fully sound: method parameters stay bivariant by default, and types are erased, so a value can still be the wrong shape at runtime.

**Examples:**

```typescript
function len(x: any) {
  return x.length; // allowed, even if x is a number at runtime
}
```

**Sources:** [Handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html) · [Everyday types — `any`](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

</details>

<details>
  <summary>Is TypeScript a functional programming language?</summary>

### Is TypeScript a functional programming language?

**Definition:** TypeScript is multi-paradigm, like JavaScript. It types first-class functions, immutability (`readonly`, `as const`), and unions, and it also types classes.

**How it works:** Nothing in the language forces pure functions, immutable data, or algebraic effects. You can write a functional style; the compiler does not require it.

**See also:** [Functions](./5_ts_functions.md) · [Why TypeScript for OOP if it emits JS?](#why-typescript-for-oop-if-it-emits-js)

**Sources:** [Handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>

<details>
  <summary>Which OOP principles does TypeScript support?</summary>

### Which OOP principles does TypeScript support?

**Definition:** Classes cover encapsulation, inheritance, and subtype polymorphism. Abstraction is expressed with `interface` and `abstract class`. Typing is **structural**, not nominal like Java or C#.

**How it works:** A class may `extend` one base class and `implements` many interfaces. There is no multiple class inheritance. `private` and `protected` are compile-time only; `#` fields are the runtime-private form.

**See also:** [Classes](./5_ts_classes.md) · [Why TypeScript for OOP if it emits JS?](#why-typescript-for-oop-if-it-emits-js)

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<details>
  <summary>Why TypeScript for OOP if it emits JS?</summary>

### Why TypeScript for OOP if it emits JS?

**Short answer:** JS has classes but **no interfaces**. TS lets you design entity relations on abstractions and fail at compile time. Runtime is still JS, so `private` is erased — use `#` for real hiding.

**How it works:** Write `interface Ledger { addRecord(r: LedgerEntry): void }` first. Implementations `implements Ledger`. Wrong wiring (missing field, wrong `kind`) is a `tsc` error. Same reason as car diagnostics before you drive.

**When to use:** Domain-heavy apps, DI, teams. Not needed for a 20-line script.

**See also:** [Classes](./5_ts_classes.md) · [OOP in JavaScript](./3_js_oop.md#oop-in-javascript) · [Doka — OOP](https://doka.guide/tools/oop/)

</details>

<details>
  <summary>Which TypeScript features help a full-stack codebase?</summary>

### Which TypeScript features help a full-stack codebase?

**Definition:** Shared types, generics, and `strict` checks let one contract describe data on both sides of an HTTP or RPC boundary.

**How it works:** Publish request and response types from one package (or inferred router types). The UI and the server import those types. Types are still erased, so the server must validate input at runtime.

**See also:** [How to typify API response, object, array, and function?](#how-to-typify-api-response-object-array-and-function)

**Sources:** [Handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>

<details>
  <summary>Compiler vs transpiler?</summary>

### Compiler vs transpiler?

**Definition:** `tsc` **type-checks** (compiler) and **emits JS** from TS (transpilation between high-level languages).

| Role       | `tsc`           |
| ---------- | --------------- |
| Compiler   | Static analysis |
| Transpiler | TS → JS emit    |

**Examples:**

```bash
tsc --noEmit
tsc
```

**Sources:** [TypeScript from scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

</details>

<details>
  <summary>What happens on build with type errors?</summary>

### What happens on build with type errors?

**Definition:** By default `tsc` **reports errors but may still emit JS** — types do not block output unless configured.

**How it works:**

| Setting / flag        | Behavior                                                    |
| --------------------- | ----------------------------------------------------------- |
| Default `tsc`         | Errors logged; JS may still be emitted                      |
| `noEmitOnError: true` | No JS output until types pass                               |
| `tsc --noEmit`        | Type-check only — no emit (common in CI)                    |
| Vite/esbuild/SWC      | Transpile without type-check; run `tsc --noEmit` separately |

**Interview answer:** _In strict CI we run `tsc --noEmit` and fail the build on errors. Bundlers alone don't guarantee type safety._

**Thoughts:** _Type-checking and transpilation are separate steps in modern pipelines._

**Sources:** [tsconfig — noEmitOnError](https://www.typescriptlang.org/tsconfig#noEmitOnError)

</details>

<details>
  <summary>How do you install and compile TypeScript?</summary>

### How do you install and compile TypeScript?

**Definition:** Install the `typescript` package and run `tsc`. `tsc --watch` recompiles when files change.

**How it works:**

```bash
npm install --save-dev typescript
npx tsc --init
npx tsc --noEmit
npx tsc --watch
```

`tsc --noEmit` type-checks without writing JavaScript. A project file is `tsconfig.json`. Global installs work, but a dev dependency pins the version for the repo.

**See also:** [The Basics](./5_ts_basics.md)

**Sources:** [TypeScript from scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

</details>

<details>
  <summary>What is `tsconfig.json`?</summary>

### What is `tsconfig.json`?

**Definition:** The project file that marks a directory as a TypeScript project and sets compiler options, `include`, and `exclude`.

**How it works:** `compilerOptions.strict` turns on the strict family (`strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, and others). `target` and `module` control emit. `extends` reuses a base config. Paths in the file are resolved from that file.

**Examples:**

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "NodeNext",
    "noEmit": true
  },
  "include": ["src"]
}
```

**See also:** [Important strict compiler flags?](#important-strict-compiler-flags)

**Sources:** [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

</details>

<details>
  <summary>What is the difference between `.ts` and `.tsx`?</summary>

### What is the difference between `.ts` and `.tsx`?

**Definition:** `.ts` is TypeScript. `.tsx` is TypeScript that may contain JSX. The angle-bracket assertion `value as Type` is used in `.tsx` because `<Type>value` looks like a tag.

**How it works:** Set `"jsx"` in `tsconfig` (`react-jsx` for the modern automatic runtime). A `.tsx` file is type-checked as JSX; renaming it to `.ts` makes JSX a syntax error.

**See also:** [JSX](./5_ts_jsx.md#jsx)

**Sources:** [Handbook — JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)

</details>

<details>
  <summary>Explicit vs implicit type assignment?</summary>

### Explicit vs implicit type assignment?

**Definition:** An explicit annotation is written by you (`let n: number = 1`). An implicit type is inferred from the initializer (`let n = 1`).

**How it works:** Inference uses the initializer. `let` widens literals (`1` becomes `number`). `const` keeps the literal type (`1`). Annotate when the initializer is missing, when you want a wider type than the literal, or when a function return should be checked against a declared contract.

**Examples:**

```typescript
let count = 1; // number
const mode = "compact"; // "compact"
let id: string | number = "a1";
```

**See also:** [Type inference](./5_ts_type_inference.md) · [Type annotations](./5_ts_type_annotations.md)

**Sources:** [Type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)

</details>

<details>
  <summary>Type inference vs contextual typing?</summary>

### Type inference vs contextual typing?

**Definition:** Inference flows from a value to its type. Contextual typing flows from the expected type into an unannotated expression, usually a callback.

**How it works:** `const xs = [1, 2]` infers `number[]`. In `xs.forEach(n => n.toFixed())`, `n` is contextually `number` because `forEach` expects `(value: number) => void`. Event handlers and overloaded functions use the same mechanism.

**Examples:**

```typescript
window.addEventListener("click", (event) => {
  event.clientX; // MouseEvent from the listener overload
});
```

**Sources:** [Type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)

</details>

<details>
  <summary>What are the built-in types in TypeScript?</summary>

### What are the built-in types in TypeScript?

**Definition:** JavaScript values plus a few TypeScript-only types.

| Group          | Types                                                                  |
| -------------- | ---------------------------------------------------------------------- |
| Primitives     | `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined` |
| Objects        | object shapes, arrays, tuples, functions, classes                      |
| Top and bottom | `any`, `unknown`, `never`, `void`                                      |
| Special        | literal types, unions, intersections, `enum`                           |

**How it works:** Names like `String` (the object wrapper) are not the same as `string`. Prefer the lowercase primitive names.

**See also:** [Types](./5_ts_types.md) · [Primitives](./5_ts_primitives.md)

**Sources:** [Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>

<details>
  <summary>`any` vs `unknown` vs `never`?</summary>

### `any` vs `unknown` vs `never`

**Definition:** `any` disables checking; `unknown` requires narrowing; `never` is the empty type (unreachable).

| Type      | Behavior                |
| --------- | ----------------------- |
| `any`     | No checks               |
| `unknown` | Narrow before use       |
| `never`   | Exhaustiveness / throws |

**Examples:**

```typescript
function parse(input: unknown) {
  if (typeof input === "string") return input.trim();
}
```

**Sources:** [Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

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

**Thoughts:** _`any` is a scalpel for migration boundaries — not a lifestyle._

**See also:** [`any` vs `unknown` vs `never`](#any-vs-unknown-vs-never)

</details>

<details>
  <summary>`void` vs `never`?</summary>

### `void` vs `never`?

**Definition:** `void` means a function's return value is ignored (it returns `undefined` or nothing useful). `never` means the function never returns a value: it throws or loops forever.

**How it works:** A function with no `return` is inferred as `void` when its result is unused. `never` is also the result of an exhaustive `switch` default and of impossible intersections such as `string & number`.

**Examples:**

```typescript
function log(message: string): void {
  console.log(message);
}

function fail(message: string): never {
  throw new Error(message);
}
```

**See also:** [`any` vs `unknown` vs `never`](#any-vs-unknown-vs-never)

**Sources:** [Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#void) · [`never`](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking)

</details>

<details>
  <summary>`null` vs `undefined`?</summary>

### `null` vs `undefined`?

**Definition:** `undefined` means a value was not provided. `null` is an explicit empty value. With `strictNullChecks`, neither is assignable to `string` or other ordinary types.

**How it works:** A missing initializer is `undefined`. Optional properties (`email?: string`) may be absent or `undefined`. JSON often uses `null`. `??` and `?.` treat both as nullish; `||` also treats `0` and `""` as empty.

**See also:** [How to handle optional and `undefined` fields?](#how-to-handle-optional-and-undefined-fields) · [`null` and `undefined`](./5_ts_null_undefined.md)

**Sources:** [Everyday types — null and undefined](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined)

</details>

<details>
  <summary>How to handle optional and `undefined` fields?</summary>

### How to handle optional and `undefined` fields?

**Definition:** With `strictNullChecks`, missing and `undefined` must be handled explicitly.

| Syntax                      | Meaning                                              |
| --------------------------- | ---------------------------------------------------- |
| `prop?: string`             | May be absent or `undefined`                         |
| `prop: string \| undefined` | Must be present; value may be `undefined`            |
| `obj.prop?.trim()`          | Optional chaining — short-circuits on null/undefined |
| `value ?? 'default'`        | Nullish coalescing — only for `null`/`undefined`     |

```typescript
type User = { name: string; email?: string };

function greet(user: User) {
  const domain = user.email?.split("@")[1] ?? "unknown";
  return `${user.name}@${domain}`;
}
```

**Thoughts:** _`?` on props + `?.` and `??` at access sites — never assume a field exists._

**See also:** [Optional properties](./5_ts_objects.md#optional-properties) · [`null` and `undefined`](./5_ts_null_undefined.md#null-and-undefined)

</details>

<details>
  <summary>What is the difference between `var`, `let`, and `const`?</summary>

### What is the difference between `var`, `let`, and `const`?

**Definition:** These are JavaScript bindings. TypeScript type-checks them and does not change their scope rules.

| Keyword | Scope                       | Reassign                                         |
| ------- | --------------------------- | ------------------------------------------------ |
| `var`   | function or global; hoisted | yes                                              |
| `let`   | block; temporal dead zone   | yes                                              |
| `const` | block                       | no (the binding). Object fields can still change |

**How it works:** Prefer `const`, then `let`. `const` also preserves literal types (`const role = "admin"` is `"admin"`, not `string`).

**See also:** [Variables, scope, and hoisting](./3_js_variables.md#variables-scope-and-hoisting) · [Variable declaration](./5_ts_variable_declaration.md)

**Sources:** [Variable declarations](https://www.typescriptlang.org/docs/handbook/variable-declarations.html)

</details>

<details>
  <summary>How do you type an array in TypeScript?</summary>

### How do you type an array in TypeScript?

**Definition:** `T[]` and `Array<T>` are the same type. `ReadonlyArray<T>` (or `readonly T[]`) disallows mutating methods.

**Examples:**

```typescript
const ids: number[] = [1, 2];
const names: Array<string> = ["ada"];
const frozen: readonly string[] = ["a"];
// frozen.push("b"); // error
```

**See also:** [Arrays](./5_ts_arrays.md)

**Sources:** [Everyday types — arrays](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)

</details>

<details>
  <summary>What is the difference between a tuple and an array?</summary>

### What is the difference between a tuple and an array?

**Definition:** An array is a list of one element type and an open length. A tuple fixes each position's type and, unless you add a rest element, the length.

**Examples:**

```typescript
const row: [string, number] = ["ada", 36];
const point = [10, 20] as const; // readonly [10, 20]
```

A readonly tuple (`readonly [string, number]` or `as const`) cannot be pushed to or indexed for a write. Extra elements are an error unless the tuple ends with `...T[]`.

**See also:** [Object types](./5_ts_objects.md)

**Sources:** [Everyday types — tuples](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#tuple-types)

</details>

<details>
  <summary>How do you type an object and optional properties?</summary>

### How do you type an object and optional properties?

**Definition:** Describe a shape with `type` or `interface`. `prop?: T` means the property may be missing or `undefined` under `strictNullChecks`.

**Examples:**

```typescript
type User = {
  name: string;
  email?: string;
};

const user: User = { name: "Ada" };
```

**See also:** [Object types](./5_ts_objects.md) · [`interface` vs `type`](#interface-vs-type)

**Sources:** [Object types](https://www.typescriptlang.org/docs/handbook/2/objects.html)

</details>

<details>
  <summary>What is the difference between `readonly` and `const`?</summary>

### What is the difference between `readonly` and `const`?

**Definition:** `const` freezes the **binding**. `readonly` freezes a **property** or array/tuple position at compile time.

**How it works:** `const user = { name: "Ada" }` still allows `user.name = "Grace"`. `readonly name: string` rejects that assignment in the type system. Neither is a deep runtime freeze; use `Object.freeze` when you need one.

**Examples:**

```typescript
const user = { name: "Ada" };
user.name = "Grace"; // allowed

type Account = { readonly id: string };
```

**Sources:** [Object types — `readonly`](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties)

</details>

<details>
  <summary>How do enums work in TypeScript?</summary>

### How do enums work in TypeScript?

**Definition:** An `enum` is a set of named constants. Unlike a type alias, it emits a runtime object.

**How it works:** A numeric enum auto-increments from 0 and emits a reverse mapping. A string enum stores the string values and has no reverse mapping. `const enum` is inlined and does not emit an object, but it is harder for isolated tooling to see.

**Examples:**

```typescript
enum Direction {
  Up,
  Down,
}
enum Role {
  Admin = "admin",
  Guest = "guest",
}
```

**See also:** [Enums](./5_ts_enums.md) · [Why avoid `enum`?](#why-avoid-enum)

**Sources:** [Enums](https://www.typescriptlang.org/docs/handbook/enums.html)

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
  <summary>How do optional chaining and nullish coalescing work?</summary>

### How do optional chaining and nullish coalescing work?

**Definition:** `?.` stops and returns `undefined` when the base is `null` or `undefined`. `??` returns the right side only for `null` or `undefined`, not for `0` or `""`.

**How it works:** Both are JavaScript operators (optional chaining since ES2020). TypeScript narrows after a check and types the result of `?.` as including `undefined`.

**Examples:**

```typescript
const city = user.address?.city ?? "unknown";
user.greet?.();
```

**See also:** [How to handle optional and `undefined` fields?](#how-to-handle-optional-and-undefined-fields)

**Sources:** [TypeScript 3.7 — optional chaining](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining)

</details>

<details>
  <summary>What are arrow functions in TypeScript?</summary>

### What are arrow functions in TypeScript?

**Definition:** Arrow functions are JavaScript function expressions with a lexical `this`. TypeScript adds parameter and return annotations.

**How it works:** They have no own `this`, `arguments`, or `prototype`, so they are a poor `method` or `constructor`. They cannot be named for recursion unless you bind a `const` and call that name. Type annotations go before `=>`.

**Examples:**

```typescript
const add = (x: number, y: number): number => x + y;
```

**See also:** [Functions](./3_js_functions.md) · [Functions](./5_ts_functions.md)

**Sources:** [More on functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

</details>

<details>
  <summary>What are anonymous functions in TypeScript?</summary>

### What are anonymous functions in TypeScript?

**Definition:** A function expression or arrow with no name. TypeScript contextually types the parameters when the function is passed to a typed callback slot.

**Examples:**

```typescript
const labels = [1, 2].map((n) => `n=${n}`);
```

Name the function when a stack trace or recursion matters: `function parseRow(row: string) { ... }`.

**Sources:** [More on functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

</details>

<details>
  <summary>How do `for` loops work in TypeScript?</summary>

### How do `for` loops work in TypeScript?

**Definition:** The same loops as JavaScript: `for`, `for...of`, `for...in`, and array methods. TypeScript types the loop variable.

**How it works:** `for...of` yields element types. `for...in` yields **keys** (`string` on arrays), which is a common bug. With `noUncheckedIndexedAccess`, `arr[i]` is `T | undefined`.

**Examples:**

```typescript
for (const item of items) {
  item.name;
}
```

**See also:** [Control flow](./3_js_operators.md)

**Sources:** [Iterators and generators](https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html)

</details>

### Functions

<details>
  <summary>How do you type functions, parameters, and return values?</summary>

### How do you type functions, parameters, and return values?

**Definition:** Annotate parameters and, when you want a checked contract, the return type. A function type is `(args) => result`.

**Examples:**

```typescript
type Greeter = (name: string) => string;

function greet(name: string): string {
  return `Hello, ${name}`;
}
```

**How it works:** If you omit the return annotation, TypeScript infers it from `return` statements. Annotating it catches an accidental `undefined` return. `void` means callers should ignore the result.

**See also:** [Functions](./5_ts_functions.md)

**Sources:** [More on functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

</details>

<details>
  <summary>Optional, default, rest parameters, and destructuring?</summary>

### Optional, default, rest parameters, and destructuring?

**Definition:** `?` marks a parameter that may be omitted. A default fills that omission. A rest parameter collects the tail into an array. Destructuring types the source object, not each local name separately.

**Examples:**

```typescript
function page(path: string, size = 20, cursor?: string) {
  return { path, size, cursor };
}

function sum(...nums: number[]) {
  return nums.reduce((a, b) => a + b, 0);
}

function area({ w, h }: { w: number; h: number }) {
  return w * h;
}
```

**How it works:** Optional parameters belong after required ones. A default makes the parameter optional at the call site. The rest type is an array, or a tuple if you write one.

**See also:** [Rest, spread, and destructuring](./3_js_variables.md#rest-spread-and-destructuring)

**Sources:** [More on functions](https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters)

</details>

<details>
  <summary>How do function overloads work?</summary>

### How do function overloads work?

**Definition:** Write one or more call signatures, then a single implementation that is compatible with all of them. Callers see only the overload list.

**Examples:**

```typescript
function len(value: string): number;
function len(value: unknown[]): number;
function len(value: string | unknown[]): number {
  return value.length;
}
```

**How it works:** The implementation signature is hidden. Order matters: TypeScript picks the first matching overload. Prefer a union parameter when the bodies are the same.

**See also:** [Functions](./5_ts_functions.md)

**Sources:** [More on functions — overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads)

</details>

<details>
  <summary>What are `this` types?</summary>

### What are `this` types?

**Definition:** A `this` parameter types the receiver of a function. A `this` return type means "the type of the instance you called this on", which keeps subclass chains fluent.

**Examples:**

```typescript
class Box {
  value = 0;
  set(value: number): this {
    this.value = value;
    return this;
  }
}

function onClick(this: HTMLElement) {
  this.id;
}
```

**How it works:** Arrow functions ignore a `this` parameter because they do not have their own `this`.

**Sources:** [More on functions — `this`](https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function) · [Polymorphic `this`](https://www.typescriptlang.org/docs/handbook/2/classes.html#this-types)

</details>

### Narrowing and operators

<details>
  <summary>What are type assertions?</summary>

### What are type assertions?

**Definition:** `value as Type` tells the checker to treat a value as a type you claim is true. It is a compile-time cast, not a runtime check.

**How it works:** Use it when you know more than the checker (a DOM node, a just-validated payload). It cannot turn unrelated types into each other without `unknown` in between. In `.tsx`, prefer `as` over `<Type>value`.

**Examples:**

```typescript
const input = document.querySelector("#name") as HTMLInputElement;
const data = JSON.parse(text) as User; // still unchecked at runtime
```

**See also:** [Assertions](./5_ts_assertions.md) · [How to typify API response, object, array, and function?](#how-to-typify-api-response-object-array-and-function)

**Sources:** [Everyday types — assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)

</details>

<details>
  <summary>What is type narrowing and a type predicate?</summary>

### What is type narrowing and a type predicate?

**Definition:** Narrowing is control-flow analysis: after `typeof`, `instanceof`, `in`, or equality, the type gets smaller in that branch. A type predicate is a function that returns `value is Type`.

**Examples:**

```typescript
function isUser(value: unknown): value is { name: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string"
  );
}
```

**See also:** [Narrowing](./5_ts_narrowing.md)

**Sources:** [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

</details>

<details>
  <summary>Union vs intersection?</summary>

### Union vs intersection

**Definition:** `A | B` — one of; `A & B` — must satisfy all. `string & number` is impossible.

| Operator | Meaning        |
| -------- | -------------- |
| `\|`     | either type    |
| `&`      | combine shapes |

**Examples:**

```typescript
let id: number | string;
type Person = { name: string } & { age: number };
```

**Sources:** [Unions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

</details>

<details>
  <summary>Union and literal types — where are they used?</summary>

### Union and literal types — where are they used?

**Definition:** Unions (`A | B`) model "one of"; literal types (`'pending' | 'done'`) restrict to specific values.

**Where used:**

| Use case                | Example                                                          |
| ----------------------- | ---------------------------------------------------------------- |
| API status              | `type Status = 'idle' \| 'loading' \| 'error'`                   |
| Discriminated unions    | `{ kind: 'success'; data: T } \| { kind: 'error'; msg: string }` |
| Config keys             | `type Theme = 'light' \| 'dark'`                                 |
| Function overload input | `string \| number` ID                                            |
| `as const` objects      | Preserve literals instead of widening to `string`                |

**Thoughts:** _Literal unions + discriminant field = safe `switch` with exhaustiveness checking._

**See also:** [Union Types](./5_ts_unions_literals.md#union-types) · [Literal Types](./5_ts_unions_literals.md#literal-types) · [Discriminated Unions](./5_ts_narrowing.md#discriminated-unions)

</details>

<details>
  <summary>What is a discriminated union?</summary>

### What is a discriminated union?

**Definition:** A union of objects that share a literal field (`kind`, `type`, `status`). Checking that field narrows the rest of the object.

**How it works:** In a `switch`, assign the leftover to `never` so a new variant becomes a compile error.

**Examples:**

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}
```

**See also:** [Narrowing](./5_ts_narrowing.md) · [Union and literal types](#union-and-literal-types--where-are-they-used)

**Sources:** [Narrowing — discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)

</details>

<details>
  <summary>What do `keyof`, `typeof`, and `in` do?</summary>

### What do `keyof`, `typeof`, and `in` do?

**Definition:** These three names do different jobs. Two of them exist both as types and as JavaScript operators.

| Form                            | Role                                      |
| ------------------------------- | ----------------------------------------- |
| `keyof User`                    | union of that type's keys                 |
| `typeof value` in a type        | the type of a value                       |
| `typeof value` in an expression | JavaScript's runtime type string          |
| `"name" in value`               | JavaScript check; also a type guard       |
| `K in keyof T`                  | mapped-type iteration, not a runtime loop |

**Examples:**

```typescript
type User = { name: string; age: number };
type Key = keyof User; // "name" | "age"

const user = { name: "Ada" };
type UserValue = typeof user;

function hasName(value: object): value is { name: string } {
  return "name" in value;
}
```

**See also:** [Type manipulation](./5_ts_type_manipulation.md)

**Sources:** [`keyof`](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html) · [`typeof` type operator](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)

</details>

<details>
  <summary>What are indexed access types and index signatures?</summary>

### What are indexed access types and index signatures?

**Definition:** An indexed access type reads a property's type: `User["name"]`. An index signature describes an open set of keys: `{ [key: string]: number }`.

**Examples:**

```typescript
type User = { name: string; age: number };
type Name = User["name"];

type Scores = { [subject: string]: number };
```

**How it works:** `User[keyof User]` is `string | number`. Index signatures force every named property to be assignable to that value type. Prefer a `Record` or a specific shape when the keys are known.

**Sources:** [Indexed access types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html) · [Object types — index signatures](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures)

</details>

<details>
  <summary>What is structural typing?</summary>

### What is structural typing?

**Definition:** TypeScript compares types by members, not by the name you declared. If a value has the required fields, it is assignable. Java and C# are nominal: the declared name matters.

**How it works:** Extra fields are allowed when the value is already stored in a variable. A fresh object literal is checked for excess properties. Brands (`type Id = string & { readonly brand: unique symbol }`) simulate nominal IDs.

**Examples:**

```typescript
type Point = { x: number; y: number };
const p: Point = { x: 1, y: 2, z: 3 }; // excess property check
const extra = { x: 1, y: 2, z: 3 };
const ok: Point = extra; // allowed
```

**See also:** [Type compatibility](./5_ts_type_compatibility.md)

**Sources:** [Type compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)

</details>

<details>
  <summary>`interface` vs `type`?</summary>

### `interface` vs `type`

**Definition:** Both describe object shapes and work with classes (`implements`). Structural typing means compatible shapes assign to each other regardless of keyword.

**How it works:**

| Feature                             | `interface`                        | `type`                       |
| ----------------------------------- | ---------------------------------- | ---------------------------- |
| Object shape                        | yes                                | yes                          |
| Extend                              | `extends`                          | intersection `&`             |
| Declaration merging                 | yes — duplicate name merges fields | no — duplicate = error       |
| Union `A \| B`                      | no                                 | yes                          |
| Tuple `[string, number]`            | awkward                            | natural                      |
| Mapped / conditional types          | limited                            | primary tool                 |
| Primitives alias `type ID = string` | no                                 | yes                          |
| `implements` in class               | yes                                | yes (often via intersection) |

**When to use:**

- **`interface`** — public object contracts (DTOs, plugin APIs) you may augment later (`declare module 'express-serve-static-core'`).
- **`type`** — unions, discriminated unions, utility-type pipelines (`Pick`, `Omit`, `ReturnType`).

**Examples:**

```typescript
// interface — merging (common for augmenting library types)
interface User {
  id: string;
}
interface User {
  email: string;
} // merged

// type — union (impossible with interface alone)
type Result<T> = { ok: true; data: T } | { ok: false; error: string };

// equivalent extension
interface Admin extends User {
  role: "admin";
}
type AdminUser = User & { role: "admin" };
```

**Interview pitfall:** "Which is faster?" — negligible difference; choose by expressiveness. Don't use `interface` for union types; don't use `type` when you need module augmentation.

**Thoughts:** For 90% of object shapes either works — consistency in the codebase matters more than the keyword.

**Sources:** [Handbook — Differences between type aliases and interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)

</details>

<details>
  <summary>Can you extend an `interface`?</summary>

### Can you extend an `interface`?

**Definition:** Yes — `interface` supports `extends` for inheritance and **declaration merging** for augmenting.

**How it works:**

```typescript
interface User {
  id: string;
}
interface User {
  email: string;
} // merges — User has id + email

interface Admin extends User {
  role: "admin";
}
```

- `extends` — inherit fields from another interface or class.
- Declaration merging — duplicate `interface` names combine (useful for module augmentation).
- `type` uses intersection (`&`) instead; no merging.

**Thoughts:** _Use `interface` when you may extend or augment; use `type` for unions._

**See also:** [`interface` vs `type`](#interface-vs-type)

</details>

<details>
  <summary>What is declaration merging?</summary>

### What is declaration merging?

**Definition:** Two declarations with the same name combine into one. Interfaces, namespaces, and some other forms merge. A duplicate `type` alias is an error.

**How it works:** Adding another `interface User` adds fields to `User`. This is how libraries let you augment `Window` or a module's exported interface.

**Examples:**

```typescript
interface User {
  id: string;
}
interface User {
  email: string;
}
```

**See also:** [Declaration merging](./5_ts_declaration_merging.md) · [Can you extend an `interface`?](#can-you-extend-an-interface)

**Sources:** [Declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)

</details>

### Classes

<details>
  <summary>How do TypeScript classes differ from JavaScript classes?</summary>

### How do TypeScript classes differ from JavaScript classes?

**Definition:** The `class` syntax emits a JavaScript constructor and prototype. TypeScript adds parameter types, visibility modifiers, `abstract`, `override`, parameter properties, and `implements`.

**How it works:** Those additions are erased or rewritten. `constructor(public name: string)` both declares a property and assigns `this.name = name`. That parameter property is TypeScript syntax, not JavaScript, and `erasableSyntaxOnly` rejects it.

**Examples:**

```typescript
class Person {
  constructor(public name: string) {}
  greet() {
    return `Hello, ${this.name}`;
  }
}
```

**See also:** [Classes](./5_ts_classes.md) · [OOP in JavaScript](./3_js_oop.md)

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<details>
  <summary>What access modifiers does TypeScript support?</summary>

### What access modifiers does TypeScript support?

**Definition:** `public`, `protected`, and `private`. The default is `public`. They are checked only by the compiler.

**How it works:** `public` is visible everywhere. `protected` is visible in the class and subclasses. `private` is visible only in that class body, but the emitted JavaScript still has a normal property. `#name` is the ECMAScript private field and exists at runtime. A TypeScript `private` member can still be read with a cast or from plain JavaScript.

**See also:** [Classes](./5_ts_classes.md)

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility)

</details>

<details>
  <summary>Getters, setters, and calling the base constructor?</summary>

### Getters, setters, and calling the base constructor?

**Definition:** `get` and `set` are JavaScript accessors. `super(...)` calls the base constructor and must run before you use `this` in a derived constructor.

**Examples:**

```typescript
class Account {
  constructor(protected balance: number) {}
  get amount() {
    return this.balance;
  }
}

class Savings extends Account {
  constructor(balance: number) {
    super(balance);
  }
}
```

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) · [Classes in JavaScript](./3_js_oop.md)

</details>

<details>
  <summary>What is an abstract class, and how does it differ from an interface?</summary>

### What is an abstract class, and how does it differ from an interface?

**Definition:** An `abstract class` can hold implemented methods and fields, and it cannot be constructed with `new`. An `interface` is only a compile-time shape: no implementation, no emit, and a class may implement many of them.

**How it works:** Use an abstract class when subclasses share real code. Use an interface when you only need a contract. A class can `extend` one abstract class and `implements` additional interfaces.

**See also:** [`extends` vs `implements`](#extends-vs-implements) · [Classes](./5_ts_classes.md)

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members)

</details>

<details>
  <summary>`extends` vs `implements`?</summary>

### `extends` vs `implements`

**Definition:** `extends` inherits one class; `implements` satisfies interface contract(s) without inherited code.

|                | `extends` | `implements`         |
| -------------- | --------- | -------------------- |
| Target         | class     | interface(s)         |
| Implementation | inherited | must provide members |

**Sources:** [Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<details>
  <summary>`readonly` fields and the `override` keyword?</summary>

### `readonly` fields and the `override` keyword?

**Definition:** `readonly` on a class field allows assignment only in the constructor (or the declaration). `override` marks a method that replaces a base method; a typo in the name is then an error.

**Examples:**

```typescript
class User {
  constructor(readonly id: string) {}
  label() {
    return this.id;
  }
}

class Admin extends User {
  override label() {
    return `admin:${this.id}`;
  }
}
```

**How it works:** `noImplicitOverride` requires `override` on every overriding member. `readonly` is erased; it does not call `Object.freeze`.

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) · [`override`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#override-and-the---noimplicitoverride-flag)

</details>

<details>
  <summary>Can you create a static class in TypeScript?</summary>

### Can you create a static class in TypeScript?

**Definition:** There is no `static class` keyword. You can put `static` members on a class, or use a module of functions.

**How it works:** A class with only static methods can still be constructed unless you make the constructor `private`. A module (`export function`) is the usual replacement. An abstract class still needs `new` on a subclass if you want instances.

**Examples:**

```typescript
class MathUtil {
  private constructor() {}
  static clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
  }
}
```

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html#static-members)

</details>

<details>
  <summary>What is a singleton class in TypeScript?</summary>

### What is a singleton class in TypeScript?

**Definition:** A pattern that allows one instance. It is not a language feature. Hide the constructor and expose `getInstance()`.

**Examples:**

```typescript
class Config {
  private static instance: Config | undefined;
  private constructor(readonly env: string) {}
  static getInstance() {
    Config.instance ??= new Config("dev");
    return Config.instance;
  }
}
```

**How it works:** Modules already evaluate once, so a module-level `const config = ...` is usually simpler than a singleton class.

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html#static-members)

</details>

<details>
  <summary>How does inheritance work, and when do you use a class vs an interface?</summary>

### How does inheritance work, and when do you use a class vs an interface?

**Definition:** `extends` copies implementation onto the prototype chain, one base class only. An interface describes a shape and disappears from the emit.

**When to use:** Use a class when you construct values and share methods. Use an interface (or a `type`) when callers only need a shape, especially for test doubles and data from JSON. Prefer composition, or mixins, when one base class is not enough.

**See also:** [`extends` vs `implements`](#extends-vs-implements) · [`interface` vs `type`](#interface-vs-type)

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<details>
  <summary>What is a class created inside a function and returned?</summary>

### What is a class created inside a function and returned?

**Definition:** A function can declare a class and return it (or return `new` of it). The class closes over the function's parameters. This is the usual mixin and class-factory shape.

**Examples:**

```typescript
function createIdModel(prefix: string) {
  return class Model {
    id = `${prefix}-${crypto.randomUUID()}`;
  };
}

const User = createIdModel("user");
const user = new User();
```

**See also:** [What are mixins?](#what-are-mixins)

**Sources:** [Mixins](https://www.typescriptlang.org/docs/handbook/mixins.html)

</details>

<details>
  <summary>What are mixins?</summary>

### What are mixins?

**Definition:** A function that takes a class and returns a subclass with extra members. TypeScript and JavaScript have single class inheritance, so mixins are how you stack behaviors.

**Examples:**

```typescript
type Constructor<T = object> = new (...args: any[]) => T;

function WithTimestamp<T extends Constructor>(Base: T) {
  return class extends Base {
    createdAt = new Date();
  };
}

class Entity {
  id = 1;
}
class Stamped extends WithTimestamp(Entity) {}
```

**See also:** [Mixins](./5_ts_mixins.md)

**Sources:** [Mixins](https://www.typescriptlang.org/docs/handbook/mixins.html)

</details>

### Modules and tooling

<details>
  <summary>What are modules, and how do import and export work?</summary>

### What are modules, and how do import and export work?

**Definition:** A file with a top-level `import` or `export` is a module. Its scope is the file, not the global script scope.

**Examples:**

```typescript
export function add(a: number, b: number) {
  return a + b;
}
export type { User } from "./user";

import { add } from "./math";
import type { User } from "./user";
```

**How it works:** `import type` is erased and does not create a runtime import. `verbatimModuleSyntax` forces that split. The `module` compiler option (`nodenext`, `esnext`, `commonjs`) decides the emit shape.

**See also:** [Modules](./5_ts_modules.md)

**Sources:** [Modules](https://www.typescriptlang.org/docs/handbook/modules.html)

</details>

<details>
  <summary>What is the difference between namespaces and modules?</summary>

### What is the difference between namespaces and modules?

**Definition:** A namespace (`namespace App { ... }`) is a global or nested object used to group names. A module is a file with imports and exports.

**How it works:** New code should use modules. Namespaces remain for older codebases and some declaration merging (global `namespace Express`). `erasableSyntaxOnly` rejects `namespace` because it emits a runtime object.

**See also:** [Namespaces](./5_ts_namespaces.md) · [Namespaces and modules](./5_ts_namespaces_modules.md)

**Sources:** [Namespaces](https://www.typescriptlang.org/docs/handbook/namespaces.html) · [Namespaces and modules](https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html)

</details>

<details>
  <summary>What is the difference between internal and external modules?</summary>

### What is the difference between internal and external modules?

**Definition:** Old TypeScript names. An internal module is today's `namespace`. An external module is today's file module (`import` / `export`).

**How it works:** The `module` keyword used to declare namespaces. Current docs say `namespace` for that form and "module" for ES or CommonJS files. Do not start a project on the old split.

**See also:** [What is the difference between namespaces and modules?](#what-is-the-difference-between-namespaces-and-modules)

**Sources:** [Namespaces and modules](https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html)

</details>

<details>
  <summary>What are declaration files, `declare`, and `@types`?</summary>

### What are declaration files, `declare`, and `@types`?

**Definition:** A `.d.ts` file describes types for JavaScript that has no types of its own. `declare` introduces a value or module that exists at runtime but is not implemented in this file.

**How it works:** `npm install --save-dev @types/node` pulls community declarations from DefinitelyTyped. If no package exists, write a local ambient module:

```typescript
declare module "legacy-widget" {
  export function init(): void;
}

declare const BUILD_ID: string;
```

**See also:** [Modules](./5_ts_modules.md)

**Sources:** [Declaration files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)

</details>

<details>
  <summary>How do you generate `.d.ts` files, source maps, and debug TypeScript?</summary>

### How do you generate `.d.ts` files, source maps, and debug TypeScript?

**Definition:** `declaration` writes `.d.ts` next to the emit. `sourceMap` writes `.js.map` so a debugger maps generated JavaScript back to TypeScript.

**How it works:**

```bash
npx tsc --declaration --emitDeclarationOnly --outDir dist
npx tsc --sourceMap
```

`declaration: true` needs emit (or `emitDeclarationOnly`). Debug in the editor with those maps, or run Node's type stripping / `tsx` so you execute TypeScript without a separate compile. `.map` files are not loaded by the program unless the runtime is told to use them.

**Sources:** [tsconfig — `declaration`](https://www.typescriptlang.org/tsconfig/#declaration) · [`sourceMap`](https://www.typescriptlang.org/tsconfig/#sourceMap)

</details>

<details>
  <summary>Important strict compiler flags?</summary>

### Important strict compiler flags

**Definition:** `strict` enables `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, and related checks.

| Flag                       | Effect                                       |
| -------------------------- | -------------------------------------------- |
| `strictNullChecks`         | `null`/`undefined` not assignable everywhere |
| `noUncheckedIndexedAccess` | Index access may be `undefined`              |

**Sources:** [tsconfig](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

</details>

<details>
  <summary>What is `noImplicitAny`?</summary>

### What is `noImplicitAny`?

**Definition:** Report an error when TypeScript would otherwise infer `any` because it has no better type.

**How it works:** It is included in `strict`. A parameter with no type, or a value from an untyped JavaScript import, must be annotated or given a better inference. This is the flag that stops `any` from spreading through a migrated codebase.

**Examples:**

```typescript
function greet(name) {
  // error under noImplicitAny: Parameter 'name' implicitly has an 'any' type
  return name;
}
```

**See also:** [Important strict compiler flags?](#important-strict-compiler-flags) · [When is `any` acceptable?](#when-is-any-acceptable)

**Sources:** [`noImplicitAny`](https://www.typescriptlang.org/tsconfig/#noImplicitAny)

</details>

<details>
  <summary>What is `outFile`, and how do you bundle TypeScript files?</summary>

### What is `outFile`, and how do you bundle TypeScript files?

**Definition:** `outFile` concatenates emit into one JavaScript file. It only works for `module` settings that support that concatenation (`amd`, `system`, or non-module scripts). It does not bundle `nodenext` or `esnext` projects.

**How it works:** Modern apps bundle with Vite, webpack, esbuild, or another bundler, and type-check with `tsc --noEmit`. Do not use `outFile` for a new ES module codebase.

**Sources:** [`outFile`](https://www.typescriptlang.org/tsconfig/#outFile)

</details>

<details>
  <summary>What is the TypeScript language service?</summary>

### What is the TypeScript language service?

**Definition:** The editor API behind completions, quick info, rename, go-to-definition, and diagnostics. `tsc` is the batch compiler; the language service answers IDE questions about the same program.

**How it works:** VS Code and other editors load it from the workspace's `typescript` version. It uses `tsconfig.json` to know which files belong to the project. A wrong `include` looks like "the IDE does not understand this file".

**Sources:** [TypeScript from scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

</details>

<details>
  <summary>Is JSDoc an alternative to TypeScript?</summary>

### Is JSDoc an alternative to TypeScript?

**Definition:** JSDoc comments can type-check `.js` files when `allowJs` and `checkJs` are on (or a file starts with `// @ts-check`). It is a way to type JavaScript, not a second language.

**How it works:** The same checker reads `@param`, `@returns`, and `/** @type {User} */`. Use it for a gradual migration or a small package that must stay `.js`. Switch to `.ts` when the annotations get larger than the code.

**Sources:** [JSDoc reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)

</details>

<details>
  <summary>How do you migrate a JavaScript project to TypeScript?</summary>

### How do you migrate a JavaScript project to TypeScript?

**Definition:** Turn the checker on beside existing JavaScript, then rename files as you type them.

**How it works:**

1. Add `typescript` and a `tsconfig.json` with `allowJs: true`.
2. Enable `checkJs` or `// @ts-check` on a few files.
3. Turn on `strict` when the noise is manageable, or use `strict` from the start on new files.
4. Rename hot files from `.js` to `.ts` and replace `any` with real types.
5. Add `@types/*` or a local `.d.ts` for untyped dependencies.
6. Keep `tsc --noEmit` in CI even if the bundler transpiles on its own.

**Sources:** [Migrating from JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)

</details>

<details>
  <summary>How do you use TypeScript with Webpack, Vite, or Babel?</summary>

### How do you use TypeScript with Webpack, Vite, or Babel?

**Definition:** Bundlers usually **transpile** TypeScript and strip types. They do not replace `tsc` for type-checking.

**How it works:** Vite transforms `.ts` and `.tsx` itself; you do not add a separate TypeScript plugin just to load those files. Babel uses `@babel/preset-typescript`, which also strips types and does not type-check. Webpack often uses `ts-loader` or `babel-loader`. Run `tsc --noEmit` (or `vue-tsc` / a project reference build) in CI so type errors fail the build.

**See also:** [What happens on build with type errors?](#what-happens-on-build-with-type-errors)

**Sources:** [TypeScript from scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

</details>

<details>
  <summary>How do you configure ESLint with TypeScript?</summary>

### How do you configure ESLint with TypeScript?

**Definition:** Point ESLint at `@typescript-eslint/parser` so it parses TypeScript syntax, and use the typed plugin for rules the core ESLint rules cannot see.

**How it works:** Install `typescript`, `eslint`, `@typescript-eslint/parser`, and `typescript-eslint` (the flat-config package). Prefer type-aware rules only on the files in your `tsconfig`, because they run the checker. Do not disable `no-explicit-any` globally if `strict` is the project policy; narrow the override.

**Sources:** [typescript-eslint — getting started](https://typescript-eslint.io/getting-started/)

</details>

### Advanced types

<details>
  <summary>What are generics, and how do you write a generic function?</summary>

### What are generics, and how do you write a generic function?

**Definition:** A generic introduces a type parameter so one implementation stays precise for many types. The caller sets the parameter, or TypeScript infers it.

**Examples:**

```typescript
function identity<T>(value: T): T {
  return value;
}

const name = identity("Ada"); // string
const n = identity(1); // number

class Box<T> {
  constructor(public value: T) {}
}
```

**How it works:** Without `<T>`, `identity` would return `any` or a wide union. Arrays, `Promise`, and `Map` are generic types.

**See also:** [Type manipulation](./5_ts_type_manipulation.md)

**Sources:** [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

</details>

<details>
  <summary>What are generic constraints?</summary>

### What are generic constraints?

**Definition:** `T extends SomeType` limits what callers may pass and what you may do with `T` inside the function.

**Examples:**

```typescript
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

pluck({ name: "Ada" }, "name");
// pluck({ name: "Ada" }, "age"); // error
```

**How it works:** The constraint is a type, often `keyof T` or an object shape. It is not a runtime check.

**Sources:** [Generics — constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)

</details>

<details>
  <summary>What are utility types?</summary>

### What are utility types?

**Definition:** Built-in generic types that transform another type: `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Exclude`, `Extract`, `Record`, `ReturnType`, `Parameters`, and others.

**How it works:** They are written with mapped and conditional types. You can reimplement them; the built-ins are the ones interviews expect you to recognize.

**See also:** [Utility types](./5_ts_utility_types.md)

**Sources:** [Utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

</details>

<details>
  <summary>What is `Partial`?</summary>

### What is `Partial`?

**Definition:** `Partial<T>` makes every property of `T` optional. That is how you type a patch, a form draft, or "make every field optional".

**Examples:**

```typescript
type User = { name: string; email: string };
type UserPatch = Partial<User>;
// { name?: string; email?: string }
```

**How it works:** It is `{ [K in keyof T]?: T[K] }`. It is one level deep. Nested objects stay required unless you write a deep variant.

**Sources:** [Utility types — `Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)

</details>

<details>
  <summary>What is `Required`?</summary>

### What is `Required`?

**Definition:** `Required<T>` removes `?` from every property, the opposite of `Partial`.

**Examples:**

```typescript
type Draft = { title?: string };
type Saved = Required<Draft>; // { title: string }
```

**Sources:** [Utility types — `Required`](https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype)

</details>

<details>
  <summary>What is `Readonly`?</summary>

### What is `Readonly`?

**Definition:** `Readonly<T>` marks every property `readonly`. It is the type-level version of a shallow freeze.

**How it works:** Distinct from the `readonly` modifier you write on one field, and from `const`, which only protects a binding. `Readonly` does not recurse into nested objects.

**Sources:** [Utility types — `Readonly`](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)

</details>

<details>
  <summary>What is `Record`?</summary>

### What is `Record`?

**Definition:** `Record<K, V>` is an object type whose keys are `K` and whose values are `V`.

**Examples:**

```typescript
type Page = "home" | "about";
type Titles = Record<Page, string>;
// { home: string; about: string }
```

**How it works:** `K` must be a key type (`string`, `number`, `symbol`, or a union of literals). For a map that may omit keys, use `Partial<Record<K, V>>`.

**Sources:** [Utility types — `Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)

</details>

<details>
  <summary>What is the difference between `Pick` and `Omit`?</summary>

### What is the difference between `Pick` and `Omit`?

**Definition:** Both build a new object type from an existing one. `Pick<T, K>` keeps the keys in `K`. `Omit<T, K>` removes them.

**Examples:**

```typescript
type User = { name: string; email: string; age: number };
type Preview = Pick<User, "name" | "age">;
type PublicUser = Omit<User, "email">;
```

**How it works:** `K` must be `keyof T` for `Pick`. `Omit` is the usual way to take a subset by dropping fields. `Exclude` is the union equivalent, not the object equivalent.

**See also:** [What is `Exclude`?](#what-is-exclude) · [Utility types](./5_ts_utility_types.md)

**Sources:** [Utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

</details>

<details>
  <summary>What is `Exclude`?</summary>

### What is `Exclude`?

**Definition:** `Exclude<T, U>` removes from the union `T` every member assignable to `U`.

**Examples:**

```typescript
type Letters = "a" | "b" | "c";
type WithoutC = Exclude<Letters, "c">; // "a" | "b"
```

**How it works:** It operates on unions. `Omit` operates on object keys. `Extract<T, U>` keeps the members that do match.

**Sources:** [Utility types — `Exclude`](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludetype-excludedunion)

</details>

<details>
  <summary>What are conditional types?</summary>

### What are conditional types?

**Definition:** `T extends U ? X : Y` chooses a type based on assignability. If `T` is a naked type parameter, the check distributes over a union.

**Examples:**

```typescript
type IsString<T> = T extends string ? true : false;
type A = IsString<"hi">; // true
type B = IsString<number>; // false
```

**See also:** [Type manipulation](./5_ts_type_manipulation.md)

**Sources:** [Conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

</details>

<details>
  <summary>What are mapped types?</summary>

### What are mapped types?

**Definition:** A mapped type walks keys and builds a new object type: `{ [K in keyof T]: ... }`.

**Examples:**

```typescript
type Flags<T> = { [K in keyof T]: boolean };
type UserFlags = Flags<{ name: string; admin: boolean }>;
// { name: boolean; admin: boolean }
```

**How it works:** Modifiers `readonly` and `?` can be added or removed (`-?`). `Partial`, `Required`, and `Readonly` are mapped types.

**Sources:** [Mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)

</details>

<details>
  <summary>What is `infer`?</summary>

### What is `infer`?

**Definition:** Inside a conditional type, `infer Name` captures a type from a matching position. That is how `ReturnType` and `Parameters` are written.

**Examples:**

```typescript
type GetReturn<T> = T extends (...args: never[]) => infer R ? R : never;

type R = GetReturn<(a: string) => number>; // number
```

**How it works:** `infer` is only legal in the `extends` clause of a conditional type. You can constrain it (`infer R extends string`).

**See also:** [Type manipulation](./5_ts_type_manipulation.md)

**Sources:** [Conditional types — `infer`](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)

</details>

<details>
  <summary>What are template literal types?</summary>

### What are template literal types?

**Definition:** The same syntax as template strings, in type position. They build string unions and parse string patterns.

**Examples:**

```typescript
type EventName<T extends string> = `${T}Changed`;
type UserEvent = EventName<"name" | "age">;
// "nameChanged" | "ageChanged"
```

**How it works:** They distribute over unions. Combined with `infer`, they can split a string type such as `` `${string}-${string}` ``.

**Sources:** [Template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)

</details>

<details>
  <summary>What do `satisfies` and `as const` do?</summary>

### What do `satisfies` and `as const` do?

**Definition:** `as const` asks for the narrowest literal and readonly type. `satisfies Type` checks that a value matches `Type` and **keeps** the inferred narrow type.

**How it works:** `as Type` forces the type and can hide mistakes. `satisfies` fails the compile if the value does not match, while each property keeps its literal type.

**Examples:**

```typescript
const routes = {
  home: "/",
  about: "/about",
} as const;

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
} satisfies Record<string, string | number[]>;
```

**See also:** [Assertions](./5_ts_assertions.md)

**Sources:** [`satisfies`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator) · [`const` assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)

</details>

<details>
  <summary>What is function type variance?</summary>

### What is function type variance?

**Definition:** When a function type is assignable to another, return types are covariant and, under `strictFunctionTypes`, parameter types are contravariant.

**How it works:** A function that returns a more specific type can be used where a wider return is expected. A function that accepts a **wider** parameter can be used where a narrower parameter is expected, because it can handle every value the caller will pass. Method syntax (`method(x: Dog)`) stays bivariant so common class patterns keep compiling; that is less safe.

**See also:** [Type compatibility](./5_ts_type_compatibility.md)

**Sources:** [`strictFunctionTypes`](https://www.typescriptlang.org/tsconfig/#strictFunctionTypes)

</details>

<details>
  <summary>What is module augmentation?</summary>

### What is module augmentation?

**Definition:** Adding declarations to an existing module from another file, using `declare module "name" { ... }`. It relies on declaration merging.

**Examples:**

```typescript
import "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}
```

**How it works:** You can add to interfaces in that module. You cannot replace a `type` alias this way. The augmented module must be a module (it has an import or export).

**See also:** [What is declaration merging?](#what-is-declaration-merging)

**Sources:** [Declaration merging — module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)

</details>

<details>
  <summary>What are decorators?</summary>

### What are decorators?

**Definition:** A decorator is a function applied with `@` to a class, method, accessor, property, or parameter. TypeScript 5.0 follows the standard stage-3 decorators. The older experimental form is still available with `experimentalDecorators`.

**How it works:** Standard decorators receive the value being decorated (and context) and may replace it. They run when the class is defined, not on each call, unless the replacement wraps the method. Legacy decorators used a different signature (`target`, `propertyKey`, `descriptor`). Do not mix the two modes in one project.

**Examples:**

```typescript
function logged<This, Args extends unknown[], R>(
  original: (this: This, ...args: Args) => R,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => R>,
) {
  return function (this: This, ...args: Args): R {
    console.log(String(context.name));
    return original.apply(this, args);
  };
}

class Greeter {
  @logged
  greet() {
    return "hi";
  }
}
```

**See also:** [Decorators](./5_ts_decorators.md)

**Sources:** [Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)

</details>

<details>
  <summary>Which collections can you type in TypeScript?</summary>

### Which collections can you type in TypeScript?

**Definition:** TypeScript does not add its own collection kinds. It types JavaScript collections.

| Value           | Type                                           |
| --------------- | ---------------------------------------------- |
| list            | `T[]`, `Array<T>`, `ReadonlyArray<T>`          |
| fixed positions | tuple `[string, number]`                       |
| key-value       | `Map<K, V>`, `Record<K, V>`                    |
| unique values   | `Set<T>`                                       |
| weak refs       | `WeakMap<object, V>`, `WeakSet<object>`        |
| named constants | string union, or `enum` if you accept the emit |

**See also:** [Map & Set](./3_js_variables.md#map--set--weakmap--weakset) · [Arrays](./5_ts_arrays.md)

**Sources:** [Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>

### React and Node

<details>
  <summary>How do you type React props and state?</summary>

### How do you type React props and state?

**Definition:** Props are an object type on the function parameter. State is the type argument of `useState`, or it is inferred from the initial value.

**Examples:**

```tsx
type Props = { title: string; count?: number };

function Header({ title, count = 0 }: Props) {
  return (
    <h1>
      {title} ({count})
    </h1>
  );
}
```

**How it works:** `type` and `interface` both work for props. Use `interface` when you expect declaration merging; use `type` for unions. Avoid `React.FC` as the default: it wraps the return type, used to imply `children`, and makes generics harder. Children, when needed, are an explicit prop (`children: React.ReactNode`).

**See also:** [JSX](./5_ts_jsx.md#jsx) · [React hooks](./4_react_hooks.md)

**Sources:** [React — using TypeScript](https://react.dev/learn/typescript)

</details>

<details>
  <summary>How do you type React hooks?</summary>

### How do you type React hooks?

**Definition:** Pass a type argument when the initial value does not carry the full type, especially `null`.

**Examples:**

```tsx
const [user, setUser] = useState<User | null>(null);

function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((value) => !value);
  return [on, toggle] as const;
}
```

**How it works:** `useRef<HTMLInputElement>(null)` types the DOM node. `useReducer` infers from the reducer if the action is a discriminated union. Custom hooks are ordinary functions: annotate the arguments and return a tuple with `as const` so callers do not get a widened array.

**See also:** [React hooks](./4_react_hooks.md)

**Sources:** [React — using TypeScript](https://react.dev/learn/typescript)

</details>

<details>
  <summary>What is the difference between `JSX.Element` and `React.ReactNode`?</summary>

### What is the difference between `JSX.Element` and `React.ReactNode`?

**Definition:** `JSX.Element` (and `React.ReactElement`) is the object `React.createElement` returns. `React.ReactNode` is anything React can render: elements, strings, numbers, fragments, portals, `null`, `undefined`, and arrays of those.

**How it works:** A component's return type is usually inferred; you rarely annotate it. A `children` prop should be `React.ReactNode`, because callers pass text and fragments, not only elements. `JSX.Element` rejects a string child type.

**See also:** [JSX](./5_ts_jsx.md#jsx)

**Sources:** [React — using TypeScript](https://react.dev/learn/typescript)

</details>

<details>
  <summary>How do you type reusable components?</summary>

### How do you type reusable components?

**Definition:** Make the component generic when it must preserve the caller's item type, the same way `Array<T>` preserves the element type.

**Examples:**

```tsx
type ListProps<T> = {
  items: readonly T[];
  getKey: (item: T) => string;
  render: (item: T) => React.ReactNode;
};

function List<T>({ items, getKey, render }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{render(item)}</li>
      ))}
    </ul>
  );
}
```

**How it works:** Put `<T>` on the function, not on `React.FC`. Constrain `T` when the component reads a field (`T extends { id: string }`).

**See also:** [What are generics, and how do you write a generic function?](#what-are-generics-and-how-do-you-write-a-generic-function)

**Sources:** [React — using TypeScript](https://react.dev/learn/typescript) · [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

</details>

<details>
  <summary>How do you use TypeScript with Node.js and Express?</summary>

### How do you use TypeScript with Node.js and Express?

**Definition:** Type the process the same way as any other TypeScript program, and type Express with `@types/express` (Express 5 may ship its own types; use the types that match the installed major).

**Examples:**

```typescript
import express, { type Request, type Response } from "express";

const app = express();

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});
```

**How it works:** Install `@types/node` for `process`, `Buffer`, and globals. `req.body` is `any` until you parse JSON and validate it. Do not assert `req.body as User` and stop there.

**See also:** [Express overview](./8_nodejs_http.md#express-overview) · [How to typify API response, object, array, and function?](#how-to-typify-api-response-object-array-and-function)

**Sources:** [Handbook — modules](https://www.typescriptlang.org/docs/handbook/modules.html)

</details>

<details>
  <summary>Error handling — static vs runtime?</summary>

### Error handling — static vs runtime

**Definition:** TypeScript catches shape errors at compile time; runtime still needs `try/catch` and schema validation for external data.

| Layer        | Tooling                |
| ------------ | ---------------------- |
| Compile time | `tsc`, IDE             |
| Runtime      | `try/catch`, Zod/io-ts |

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
type Product = {
  id: string;
  name: string;
  price: number;
  category: "food" | "electronics";
};
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

**Thoughts:** _Types describe intent; Zod/io-ts validates reality at the network boundary._

</details>

---

## Coding tasks

<details>
<summary>Task 1 — Fix AddressWithIdType intersection</summary>

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

</details>

---

<details>
<summary>Task 2 — Exclude a union member</summary>

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

</details>

---

<details>
<summary>Task 3 — Implement MyPick</summary>

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

</details>

---

<details>
<summary>Task 4 — Implement GetReturnType</summary>

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

</details>

---

<details>
<summary>Task 5 — Implement DeepReadonly</summary>

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

</details>

---

<details>
<summary>Task 6 — Implement Flatten</summary>

Unwrap one level of array: `Flatten<string[][]>` → `string[]`.

```typescript
type Flatten<T> = unknown; // your implementation

type A = Flatten<string[]>; // string
type B = Flatten<number[][]>; // number[]
type C = Flatten<boolean>; // boolean
```

<details>
  <summary>Solution</summary>

```typescript
type Flatten<T> = T extends (infer U)[] ? U : T;
```

</details>

</details>

---

<details>
<summary>Task 7 — Implement Parameters</summary>

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

</details>

---

<details>
<summary>Task 8 — Cart aggregation (typed)</summary>

Fully typed cart calculator — mirrors [3_js_array.md Task 16](./3_js_array.md#interview-practice).

```typescript
type ProductCategory = "food" | "electronics" | "clothing";

type Product = {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
};

type CartItem = { product: Product; qty: number };

type CartSummary = { subtotal: number; discount: number; total: number };

type Discounts = Partial<Record<ProductCategory, number>>;

function calculateCart(
  items: CartItem[],
  discounts: Discounts = {},
): CartSummary {
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

**Thoughts:**

- `ProductCategory` literal union — discount lookup is type-safe.
- `Partial<Record<...>>` — not every category needs a discount.
- `CartSummary` return type documents the API contract.
- Discriminated variants (e.g. `DigitalProduct | PhysicalProduct`) can extend this with `kind` field + narrowing.

<details>
  <summary>Variant with discriminated product types</summary>

```typescript
type BaseProduct = { id: string; name: string; price: number };

type FoodProduct = BaseProduct & { kind: "food"; expiryDays: number };
type ElectronicsProduct = BaseProduct & {
  kind: "electronics";
  warrantyMonths: number;
};
type ClothingProduct = BaseProduct & { kind: "clothing"; size: string };

type Product = FoodProduct | ElectronicsProduct | ClothingProduct;

// Narrow in reduce:
function getDiscountRate(product: Product, discounts: Discounts): number {
  return discounts[product.kind] ?? 0;
}
```

</details>

</details>

---

## Quick oral questions (self-check)

<details>
<summary>Quick oral questions (self-check)</summary>

**Definition:** Fifteen self-check questions covering core TypeScript interview topics; answers in the collapsible block below.

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

</details>

---

## Oral questions (ITVDN — TypeScript)

<details>
<summary>Oral questions (ITVDN — TypeScript)</summary>

**Definition:** Self-check oral questions from ITVDN TypeScript course.

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

79. What are the advantages of typing in TypeScript?

80. What TypeScript features can you use for typing (interfaces, types, enum, etc.)?

81. What is the difference between an interface and a class?

82. What is the difference between an interface and an abstract class?

83. What is the difference between an interface and a type?

</details>

---

## Oral questions (extra)

<details>
<summary>Oral questions (extra)</summary>

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

</details>
