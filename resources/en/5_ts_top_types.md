# TypeScript — any, unknown, never

Top and bottom types — when to use each.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

### Sections

- [Top types](#top-types)

---

## Top types

<details>
  <summary>Top types</summary>

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

</details>


