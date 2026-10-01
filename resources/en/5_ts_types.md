# TypeScript — Types

Basic value types from the [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) — `string`, `number`, `boolean`, arrays, `any`, and absence types.

[← Back to hub](./5_ts.md)

### Related docs

[TypeScript — hub](./5_ts.md) · [Narrowing](./5_ts_narrowing.md) · [Functions](./5_ts_functions.md) · [Object Types](./5_ts_objects.md) · [Type Manipulation](./5_ts_type_manipulation.md) · [Interview](./5_ts_interview.md)

### Main concepts

| Type         | Examples                      |
| ------------ | ----------------------------- |
| Primitives   | `string`, `number`, `boolean` |
| Collections  | `number[]`, `Array<string>`   |
| Escape hatch | `any`                         |
| Absence      | `null`, `undefined`           |

### Sections

- [Primitives](#primitives)
- [Arrays](#arrays)
- [any](#any)
- [Type annotations](#type-annotations)
- [null and undefined](#null-and-undefined)

---

## Primitives

<details>
  <summary>Primitives</summary>

**Definition:**

The most common JavaScript value types — `string`, `number`, and `boolean` — with matching lowercase TypeScript types (same names as `typeof`).

**How it works:**

- `string` — text like `"Hello, world"`.
- `number` — all numeric values; JavaScript has no separate `int` / `float`.
- `boolean` — `true` or `false`.
- `String`, `Number`, and `Boolean` (capitalized) are rare wrapper types; almost always use lowercase primitives.

**When to use:**

Annotate when inference is wrong; otherwise let TypeScript infer (`let city = "Berlin"` → `string`).

**Examples:**

```typescript
let name: string = "Alice";
let age: number = 42;
let active: boolean = true;

const hex: number = 0xf00d;
const binary: number = 0b1010;

let city = "Berlin"; // inferred: string
```

**Sources:** [TypeScript handbook — Everyday Types: primitives](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean)

</details>

---

## Arrays

<details>
  <summary>Arrays</summary>

**Definition:**

An ordered list where every element shares one type — written `number[]` or `Array<number>`.

**How it works:**

`T[]` and `Array<T>` mean the same thing. `[number]` is a **tuple** (fixed length), not a growable array.

**When to use:**

`const ids: number[] = [1, 2, 3]` for homogeneous lists.

**Examples:**

```typescript
const scores: number[] = [95, 87, 72];
const tags: Array<string> = ["typescript", "javascript"];
```

**Sources:** [TypeScript handbook — Everyday Types: arrays](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)

</details>

---

## any

<details>
  <summary>any</summary>

**Definition:**

A special type that disables type-checking for a value — TypeScript assumes you know better than the compiler.

**How it works:**

With `any`, you can call anything, assign to/from any type, and access any property (all become `any`). When TypeScript cannot infer a type and `noImplicitAny` is off, it may default to `any`.

**When to use:**

Rare escape hatch for gradual migration or untyped third-party code. Prefer `unknown` at boundaries — see [Narrowing](./5_ts_narrowing.md). Enable `noImplicitAny` to flag implicit `any`.

**Examples:**

```typescript
let obj: any = { x: 0 };
obj.foo();
obj = "hello";
const n: number = obj; // allowed — dangerous
```

**Sources:** [TypeScript handbook — Everyday Types: any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

</details>

---

## Type annotations

<details>
  <summary>Type annotations</summary>

**Definition:**

An explicit type label after a variable name: `let myName: string = "Alice"`.

**How it works:**

TypeScript puts annotations **after** the name (`let x: number`), not C-style `int x`. Inference usually makes annotations unnecessary — TS reads the initializer.

**When to use:**

Add when inference is too narrow or too wide. Omit when the value makes the type obvious.

**Examples:**

```typescript
let myName: string = "Alice";
let myNameInferred = "Alice"; // string
let count: number = 0;
```

**Sources:** [TypeScript handbook — Everyday Types: type annotations on variables](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-annotations-on-variables)

</details>

---

## null and undefined

<details>
  <summary>null and undefined</summary>

**Definition:**

Types for JavaScript's absent values — `null` (intentional empty) and `undefined` (unset).

**How it works:**

With **`strictNullChecks` on**, `null` and `undefined` are not assignable to `string`, `number`, etc. unless you include them in the type. Narrow before use (`=== null`, `?.`, `??`).

With **`strictNullChecks` off**, `null`/`undefined` flow everywhere — a common source of bugs.

**When to use:**

Keep `strictNullChecks` enabled. Annotate when a value may be missing: `string | null`.

**Examples:**

```typescript
let title: string | null = null;
let config: string | undefined;

function greet(name: string | null) {
  if (name === null) return;
  console.log(name.toUpperCase());
}
```

**Sources:** [TypeScript handbook — Everyday Types: null and undefined](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined)

</details>
