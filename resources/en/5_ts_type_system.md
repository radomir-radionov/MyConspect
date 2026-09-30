# TypeScript — Type System

Type compatibility, inference, and variable declarations.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

### Sections

- [Type Compatibility](#type-compatibility)
- [Type Inference](#type-inference)
- [Variable Declaration](#variable-declaration)
- [Advanced topics](#advanced-topics)

---

## Type Compatibility

<details>
  <summary>Type Compatibility</summary>

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



</details>

## Type Inference

<details>
  <summary>Type Inference</summary>

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



</details>

## Variable Declaration

<details>
  <summary>Variable Declaration</summary>

### Variable Declaration

**Definition:**

`var` (function-scoped, hoisted), `let` (block-scoped), `const` (block-scoped, no reassignment).

| When to use                                                                                          | Notes                                                                                                                  |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Prefer `const` > `let` > `var`. TS checks all three; `const` does not make objects deeply immutable. | `const` only prevents **rebinding** the variable — object innards remain mutable unless `readonly` or `Object.freeze`. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### var problems

**Definition:**

// Same var in nested loops — classic bug

for (var i = 0; i < 3; i++) {
setTimeout(() => console.log(i), 100); // 3, 3, 3
}

| Aspect  | Detail                                    |
| ------- | ----------------------------------------- |
| Summary | // Same var in nested loops — classic bug |

for (var i = 0; i < 3; i++) {
setTimeout(() => console.log(i), 100); // 3, 3 |

**Examples:**

```typescript
// Function-scoped — leaks out of blocks
if (true) {
  var x = 10;
}
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

| Aspect                  | Detail                                               |
| ----------------------- | ---------------------------------------------------- |
| Summary                 | // Temporal dead zone — can't use before declaration |
| // a++; let a; // Error |

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

| Aspect  | Detail                                                     |
| ------- | ---------------------------------------------------------- |
| Summary | // Prefer const unless you will reassign (least privilege) |

**Examples:**

```typescript
const kitty = { name: "Aurora", numLives: 9 };
// kitty = { ... };     // Error — rebind
kitty.name = "Rory"; // OK — mutate property

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

</details>

## Advanced topics

<details>
  <summary>Modern TypeScript</summary>

### `const` Type Parameters (TS 5.0+)

**Definition:**

Generic parameter modifier that preserves literal types in inference.

| When to use                                                                                               | Notes                                                                                             |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `function routes<const T extends readonly string[]>(paths: T)` — keeps tuple of literals, not `string[]`. | recursion must have a **base case** (`T extends object` guard) or the compiler hits depth limits. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Variance (functions and assignability)

**Definition:**

How subtyping works for function params (contravariant) and returns (covariant).

| Aspect  | Detail                                                                           |
| ------- | -------------------------------------------------------------------------------- |
| Summary | How subtyping works for function params (contravariant) and returns (covariant). |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>

</details>

