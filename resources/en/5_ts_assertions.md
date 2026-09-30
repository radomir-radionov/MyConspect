# TypeScript — Assertions & satisfies

Type assertions (`as`) and the `satisfies` operator.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

### Sections

- [Assertions and satisfies](#assertions-and-satisfies)

---

## Assertions and satisfies

<details>
  <summary>Assertions and satisfies</summary>

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

</details>


