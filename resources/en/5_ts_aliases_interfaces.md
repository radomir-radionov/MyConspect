# TypeScript — Aliases & Interfaces

`type` aliases, `interface`, and when to use which.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

### Sections

- [Aliases and interfaces](#aliases-and-interfaces)

---

## Aliases and interfaces

<details>
  <summary>Aliases and interfaces</summary>

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

</details>


