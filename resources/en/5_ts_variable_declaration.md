# TypeScript — Variable Declaration

`var` vs `let` vs `const` and destructuring with types.

[← Back to hub](./5_ts.md)

### Related docs

- [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

### Sections

- [Variable Declaration](#variable-declaration)
- [Advanced topics](#advanced-topics)

---

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
