# TypeScript — Utility Types

Built-in utility types: Partial, Required, Pick, Omit, Record, ReturnType, and more.

[← Back to hub](./5_ts.md)

### Related docs

- [TypeScript — hub](./5_ts.md) · [Type Manipulation](./5_ts_type_manipulation.md) · [Interview](./5_ts_interview.md)

### Sections

- [Utility types](#utility-types)

---

## Utility types

<details>
  <summary>Built-in utilities</summary>

### Quick list — all utility types

1. **`Awaited<T>`** — unwrap `Promise` (recursive)
2. **`Partial<T>`** — all properties optional
3. **`Required<T>`** — all properties required
4. **`Readonly<T>`** — all properties readonly
5. **`Record<Keys, Type>`** — object type with fixed keys and uniform values
6. **`Pick<T, Keys>`** — subset of properties
7. **`Omit<T, Keys>`** — all properties except listed keys
8. **`Exclude<Union, Excluded>`** — remove union members assignable to `Excluded`
9. **`Extract<Type, Union>`** — keep union members assignable to `Union`
10. **`NonNullable<T>`** — remove `null` and `undefined`
11. **`Parameters<F>`** — tuple of function parameter types
12. **`ConstructorParameters<C>`** — tuple of constructor parameter types
13. **`ReturnType<F>`** — function return type
14. **`InstanceType<C>`** — instance type of a constructor
15. **`NoInfer<T>`** — block inference to this type position
16. **`ThisParameterType<F>`** — type of explicit `this` parameter
17. **`OmitThisParameter<F>`** — function type without `this`
18. **`ThisType<T>`** — contextual `this` marker (not a transform)
19. **`Uppercase` / `Lowercase` / `Capitalize` / `Uncapitalize`** — string literal transforms

### One-line definitions (interview flash cards)

**Definition:**

One-line definitions (interview flash cards) — TypeScript language or compiler feature.

| Aspect  | Detail                                                                                  |
| ------- | --------------------------------------------------------------------------------------- |
| Summary | One-line definitions (interview flash cards) — TypeScript language or compiler feature. |

- `Partial<T>` — all properties |

- `Partial<T>` — all properties optional
- `Required<T>` — all properties required (opposite of Partial)
- `Readonly<T>` — properties cannot be reassigned
- `Record<Keys, T>` — object with fixed keys and uniform value type
- `Pick<T, Keys>` — subset of properties
- `Omit<T, Keys>` — all properties except listed keys
- `Exclude<Union, E>` — remove union members assignable to `E`
- `Extract<T, U>` — keep union members assignable to `U`
- `InstanceType<C>` — instance type from constructor
- `ThisType<T>` — contextual `this` in object literals

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### Interview examples — all utilities in one place

**Definition:**

Interview examples — all utilities in one place — TypeScript language or compiler feature.

| Aspect  | Detail                                                                                     |
| ------- | ------------------------------------------------------------------------------------------ |
| Summary | Interview examples — all utilities in one place — TypeScript language or compiler feature. |

**Examples:**

```typescript
interface Person {
  name: string;
  age: number;
  email: string;
}

const partial: Partial<Person> = { name: "John" };

const required: Required<Partial<Person>> = {
  name: "John",
  age: 25,
  email: "j@x.com",
};

const frozen: Readonly<Person> = { name: "John", age: 25, email: "j@x.com" };
// frozen.name = "Jane"; // Error

const fruits: Record<string, number> = { apple: 5, banana: 3 };

const picked: Pick<Person, "name" | "email"> = {
  name: "John",
  email: "j@x.com",
};

const omitted: Omit<Person, "email"> = { name: "John", age: 30 };

type Primitive = string | number | boolean;
type NoBool = Exclude<Primitive, boolean>; // string | number
type OnlyBool = Extract<Primitive, boolean>; // boolean

type MaybeUser = string | null | undefined;
type User = NonNullable<MaybeUser>; // string

type GetUser = (id: number, active: boolean) => string;
type Params = Parameters<GetUser>; // [number, boolean]
type Ret = ReturnType<() => { name: string }>; // { name: string }

class UserClass {
  name = "John";
  age = 30;
}
type Inst = InstanceType<typeof UserClass>; // UserClass

type Helper = { getName(): string } & ThisType<{ name: string }>;
const helper: Helper = {
  getName() {
    return this.name;
  },
};
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Awaited<Type>`

**Definition:**

Unwraps `Promise` types recursively — models what `await` returns.

| When to use                                                                                            | Notes                                                                                                       |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `type R = Awaited<Promise<Promise<string>>>` → `string`. Works on unions with non-Promise members too. | Works on unions too — `Awaited<boolean \| Promise<number>>` becomes `number \| boolean`, not just `number`. |

**Examples:**

```typescript
type A = Awaited<Promise<string>>; // string
type B = Awaited<Promise<Promise<number>>>; // number
type C = Awaited<boolean | Promise<number>>; // number | boolean
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Partial<Type>`

**Definition:**

Makes every property of `Type` optional.

| When to use                                                                | Notes                                                                                                                                                                        |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Partial<User>` for PATCH/update payloads where only some fields are sent. | Returns a type representing **all subsets** of `Type`, not “same shape but optional” in a shallow sense only — nested objects stay as declared unless you map them yourself. |

**Examples:**

```typescript
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fields: Partial<Todo>) {
  return { ...todo, ...fields };
}

updateTodo(
  { title: "organize desk", description: "clear clutter" },
  { description: "throw out trash" },
);
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Required<Type>`

**Definition:**

Makes every property required — opposite of `Partial`.

| When to use                                                                            | Notes                                                                                                    |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `Required<Partial<User>>` or ensure config objects have all keys after optional input. | Only affects top-level optional modifiers; it does not magically fill in missing nested optional chains. |

**Examples:**

```typescript
interface Props {
  a?: number;
  b?: string;
}

const ok: Props = { a: 5 };
// const bad: Required<Props> = { a: 5 }; // Error: 'b' is missing
const good: Required<Props> = { a: 5, b: "hi" };
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Readonly<Type>`

**Definition:**

Makes every top-level property readonly — cannot reassign.

| When to use                                                                         | Notes                                                                                                                          |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `Readonly<User>` for frozen config. Shallow only — nested objects can still mutate. | Shallow only — nested object properties can still be mutated unless you also mark them readonly or use `Readonly` recursively. |

**Examples:**

```typescript
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = { title: "Delete inactive users" };
// todo.title = "Hello"; // Error: read-only property

// Pairs with Object.freeze at runtime
function freeze<T>(obj: T): Readonly<T> {
  return Object.freeze(obj) as Readonly<T>;
}
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Record<Keys, Type>`

**Definition:**

An object type with keys from `Keys` and uniform value type `Type`.

| When to use                                                                                   | Notes                                                                                                                         |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `Record<"a" \| "b", number>` or `Record<string, boolean>` for dictionaries and lookup tables. | `Keys` must be `string \| number \| symbol` — often a string-literal union. Handy for dictionaries/maps with a fixed key set. |

**Examples:**

```typescript
type CatName = "miffy" | "boris" | "mordred";

interface CatInfo {
  age: number;
  breed: string;
}

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Pick<Type, Keys>`

**Definition:**

A new type with only the selected keys from `Type`.

| When to use                                                             | Notes                                                                             |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Pick<User, "id" \| "name">` for DTOs, previews, or public API subsets. | `Keys` must be assignable to `keyof Type` — you can't pick keys that don't exist. |

**Examples:**

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = { title: "Clean room", completed: false };
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Omit<Type, Keys>`

**Definition:**

A new type with listed keys removed from `Type`.

| When to use                                                                                                         | Notes                                                                              |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `Omit<User, "password">` before sending to client. Fix intersection conflicts: `Omit<T, "key"> & { key: NewType }`. | Added in TS 3.5 — before that people used `Pick` + `Exclude<keyof T, K>` manually. |

**Examples:**

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "description" | "createdAt">;
// { title: string; completed: boolean; }
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Exclude<UnionType, ExcludedMembers>`

**Definition:**

Removes union members assignable to `ExcludedMembers`.

| When to use                                                                                | Notes                                                                                                                                           |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `Exclude<"a" \| "b" \| "c", "c">` → `"a" \| "b"`. Operates on **unions**, not object keys. | Uses assignability, not equality — `Exclude<string \| number, Function>` yields `string \| number` because neither is assignable to `Function`. |

**Examples:**

```typescript
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"

type Shape = { kind: "circle"; radius: number } | { kind: "square"; x: number };

type NoCircle = Exclude<Shape, { kind: "circle" }>;
// { kind: "square"; x: number }
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Extract<Type, Union>`

**Definition:**

Keeps only union members assignable to `Union`.

| When to use                                                     | Notes                                                                                         |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `Extract<Primitive, boolean>` → `boolean`. Mirror of `Exclude`. | Mirror of `Exclude` — `Extract<T, U>` ≡ `T extends U ? T : never` (distributive over unions). |

**Examples:**

```typescript
type T0 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type T1 = Extract<string | number | (() => void), Function>; // () => void

type Circle = Extract<Shape, { kind: "circle" }>;
// { kind: "circle"; radius: number }
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `NonNullable<Type>`

**Definition:**

Removes `null` and `undefined` from `Type`.

| When to use                                                                                         | Notes                                                       |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `NonNullable<string \| null>` → `string`. After a null check, or to type guaranteed-present values. | Only removes those two — `void` and other falsy types stay. |

**Examples:**

```typescript
type T0 = NonNullable<string | number | undefined>; // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Parameters<Type>`

**Definition:**

Extracts function parameter types as a tuple.

| When to use                                                                           | Notes                                                                                                                              |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Parameters<typeof fn>` → `[string, number]` for wrappers and higher-order functions. | For overloaded functions, uses the **last** overload's parameters. `Parameters<any>` → `unknown[]`; `Parameters<never>` → `never`. |

**Examples:**

```typescript
declare function f1(arg: { a: number; b: string }): void;

type T0 = Parameters<() => string>; // []
type T1 = Parameters<(s: string) => void>; // [s: string]
type T2 = Parameters<typeof f1>; // [arg: { a: number; b: string }]
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ConstructorParameters<Type>`

**Definition:**

Extracts constructor parameter types as a tuple.

| When to use                                                                      | Notes                                                                                                                 |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `ConstructorParameters<typeof Date>` for wrapping native or custom constructors. | `ConstructorParameters<Function>` is `never` — `Function` is too loose to match `abstract new (...args: any) => any`. |

**Examples:**

```typescript
type T0 = ConstructorParameters<ErrorConstructor>; // [message?: string]

class C {
  constructor(a: number, b: string) {}
}
type T1 = ConstructorParameters<typeof C>; // [a: number, b: string]
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ReturnType<Type>`

**Definition:**

Extracts the return type of a function type.

| When to use                                                                 | Notes                                                                                                                    |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `ReturnType<typeof fetchUser>` — infer API result type without duplicating. | Overloads → last signature wins. `ReturnType<string>` errors (not a function); `ReturnType<Function>` degrades to `any`. |

**Examples:**

```typescript
declare function f1(): { a: number; b: string };

type T0 = ReturnType<() => string>; // string
type T1 = ReturnType<typeof f1>; // { a: number; b: string }
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `InstanceType<Type>`

**Definition:**

Gets the instance type from a constructor type.

| When to use                                                                         | Notes                                                                                              |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `InstanceType<typeof MyClass>` → `MyClass`. For factory patterns and DI containers. | `InstanceType<typeof MyClass>` gives you `MyClass` instances — useful for factory patterns and DI. |

**Examples:**

```typescript
class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>; // C
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `NoInfer<Type>`

**Definition:**

Blocks TS from inferring type arguments from this position (TS 5.4+).

| When to use                                                                                 | Notes                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Use on default/generic params that should not drive inference: `defaultColor?: NoInfer<C>`. | Added in TS 5.4 — fixes cases where a default/generic parameter gets inferred from an argument you didn't want to drive inference (e.g. a `defaultColor` that widens `C`). |

**Examples:**

```typescript
function createStreetLight<C extends string>(
  colors: C[],
  defaultColor?: NoInfer<C>,
) {
  // ...
}

createStreetLight(["red", "yellow", "green"], "red"); // OK
// createStreetLight(["red", "yellow", "green"], "blue"); // Error
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ThisParameterType<Type>`

**Definition:**

Extracts the type of an explicit `this` parameter from a function type.

| When to use                                                          | Notes                                                                                                |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Advanced — for typing `bind` wrappers and preserving `this` context. | Only applies when the function declares `this:` explicitly — ordinary methods use contextual `this`. |

**Examples:**

```typescript
function toHex(this: Number) {
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `OmitThisParameter<Type>`

**Definition:**

Removes `this` from a function type — result of `.bind()`.

| When to use                                      | Notes                                                                       |
| ------------------------------------------------ | --------------------------------------------------------------------------- |
| Type the output of binding when `this` is fixed. | Generics are erased; only the **last** overload is kept in the output type. |

**Examples:**

```typescript
function toHex(this: Number) {
  return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);
console.log(fiveToHex()); // "5"
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ThisType<Type>`

**Definition:**

Marker for contextual `this` inside object literals with methods — not a transforming utility.

| When to use                                                                              | Notes                                                                                                                            |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Use in object descriptors where methods need typed `this` without explicit `this` param. | Empty interface in `lib.d.ts`; only meaningful when the compiler applies contextual typing to `methods` in an object descriptor. |

**Examples:**

```typescript
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>;
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  return { ...(desc.data ?? {}), ...(desc.methods ?? {}) } as D & M;
}

const obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // 'this' is { x: number; y: number } & methods
      this.y += dy;
    },
  },
});
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### Intrinsic string manipulation types

**Definition:**

Built-in type operators for string literals: `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`.

| When to use                                                                                 | Notes                                                                                                              |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Apply to string literal unions in mapped/template types — `Uppercase<"hello">` → `"HELLO"`. | Only work on string literal types (or unions of them) — `Uppercase<string>` stays `string`, not a specific result. |

**Examples:**

```typescript
type EventName<T extends string> = `${T}Changed`;
type T0 = Uppercase<"hello">; // "HELLO"
type T1 = Capitalize<"hello">; // "Hello"
type T2 = Uncapitalize<"Hello">; // "hello"

type GetterName<T extends string> = `get${Capitalize<T>}`;
type SetterName<T extends string> = `set${Capitalize<T>}`;
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

</details>

<a name="reference"></a>
