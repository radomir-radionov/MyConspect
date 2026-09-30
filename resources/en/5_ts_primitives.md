# TypeScript — Primitives

`string`, `number`, `boolean`, `bigint`, and `symbol`.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

### Sections

- [Primitives](#primitives)

---

## Primitives

<details>
  <summary>Primitives</summary>

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

</details>


