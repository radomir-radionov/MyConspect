# TypeScript — Interview

Interview Q&A and type challenges.

[← Back to hub](./5_ts.md)

### Related docs

- [TypeScript — Basics](./5_ts_core.md) · [TypeScript — Narrowing](./5_ts_narrowing.md) · [TypeScript — Functions](./5_ts_functions.md) · [TypeScript — Objects](./5_ts_objects.md) · [TypeScript — Generics](./5_ts_generics.md) · [TypeScript — Reference](./5_ts_reference.md) · [TypeScript — Interview](./5_ts_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

<details>
  <summary>Interview Practice</summary>

### Interview Practice

**Definition:** Type-level puzzles and common live-coding prompts for TypeScript interviews.

| Area          | Must know                                                            |
| ------------- | -------------------------------------------------------------------- |
| **Basics**    | `any` vs `unknown` vs `never`, narrowing, unions                     |
| **Structure** | `interface` vs `type`, generics, utility types                       |
| **Safety**    | `strict`, discriminated unions, exhaustiveness, `erasableSyntaxOnly` |
| **Advanced**  | `infer`, conditional/mapped types, `keyof`                           |
| **Runtime**   | Types erased — validate external data (Zod)                          |

**Sources:** [Type challenges](https://github.com/type-challenges/type-challenges)

| Topic                                      | Answer      |
| ------------------------------------------ | ----------- |
| Why TS / large projects / when it hurts    | Q&A         |
| Design-first interfaces / `private` vs `#` | Q&A         |
| `any` acceptable cases, extend `interface` | Q&A         |
| Unions, literals, build with type errors   | Q&A         |
| Typify API/object/array/function           | Q&A         |
| Optional / `undefined` fields              | Q&A         |
| Cart aggregation (typed)                   | Task — Cart |

---

### Questions & Answers

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
  <summary>Why TypeScript for OOP if it emits JS?</summary>

### Why TypeScript for OOP if it emits JS?

**Short answer:** JS has classes but **no interfaces**. TS lets you design entity relations on abstractions and fail at compile time. Runtime is still JS, so `private` is erased — use `#` for real hiding.

**How it works:** Write `interface Ledger { addRecord(r: LedgerEntry): void }` first. Implementations `implements Ledger`. Wrong wiring (missing field, wrong `kind`) is a `tsc` error. Same reason as car diagnostics before you drive.

**When to use:** Domain-heavy apps, DI, teams. Not needed for a 20-line script.

**See also:** [OOP in TypeScript](./5_ts_objects.md#oop-in-typescript) · [Design-first OOP with interfaces](./5_ts_objects.md#design-first-oop-with-interfaces) · [Doka — OOP](https://doka.guide/tools/oop/)

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

| Flag                       | Effect                                       |
| -------------------------- | -------------------------------------------- |
| `strictNullChecks`         | `null`/`undefined` not assignable everywhere |
| `noUncheckedIndexedAccess` | Index access may be `undefined`              |

**Sources:** [tsconfig](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

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

**See also:** [Union Types](./5_ts_core.md#union-types) · [Literal Types](./5_ts_core.md#literal-types) · [Discriminated Unions](./5_ts_narrowing.md#discriminated-unions)

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

**See also:** [Optional properties](./5_ts_objects.md#optional-properties) · [`null` and `undefined`](./5_ts_core.md#null-and-undefined)

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

**Interview talking points:**

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

---

</details>
