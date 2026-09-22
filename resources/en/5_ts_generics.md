# TypeScript — Generics

Generics, type operators, and utility types.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — Basics](./5_ts_core.md) · [TypeScript — Narrowing](./5_ts_narrowing.md) · [TypeScript — Functions](./5_ts_functions.md) · [TypeScript — Objects](./5_ts_objects.md) · [TypeScript — Generics](./5_ts_generics.md) · [TypeScript — Reference](./5_ts_reference.md) · [TypeScript — Interview](./5_ts_interview.md)

### Sections

- [Generics & type operators](#generics-type-operators)
- [Utility types](#utility-types)

---

## Generics & type operators

<details>
  <summary>Generics & type operators</summary>

### Generics

**Definition:**

Type parameters that let one function/class/interface work with many types while keeping type safety: `<T>`.

| When to use | Notes |
|-------------|-------|
| Declare `function id<T>(x: T): T` or `class Box<T> { value: T }`. TS infers `T` from arguments; pass explicitly when needed: `id<string>("a")`. Constrain with `T extends SomeType`. | Type params stand in for *any* type until constrained — you can't call `.length` on `T` unless you constrain `T extends { length: number }`. Inference usually fills in `<T>` for you; pass explicitly w |

**Examples:**

```typescript
// Too narrow
function identity(arg: number): number { return arg; }

// Loses type info
function identity(arg: any): any { return arg; }

// Generic — preserves type
function identity<T>(arg: T): T { return arg; }

let a = identity("myString");        // inferred: string
let b = identity<string>("myString"); // explicit type arg
```

```typescript
const getter = <T>(data: T): T => data;

getter("test").length;     // 4 — inferred string
// getter(10).length;      // Error — number has no length

// Explicit type argument when inference fails
getter<number>(10);
getter<string>("test").length; // 4
```

```typescript
function getFirstElement<T>(arr: T[]): T {
  return arr[0];
}

const first = getFirstElement([1, 2, 3]);     // number
const word = getFirstElement(["a", "b"]);   // string
// getFirstElement([1, "two"]);            // Error — mixed array unless T is string | number
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Interview example — API wrapper + React `useState`

**Definition:**

// Generic API response shape

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

| Aspect | Detail |
|--------|--------|
| Summary | // Generic API response shape
type ApiResponse<T> =
  \| { success: true; data: T }
  \| { success: false; error: string |

**Examples:**

```typescript
// React — generic state
const [ids, setIds] = useState<number[]>([]);

// Generic API response shape
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function fetchJson<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  if (!res.ok) return { success: false, error: res.statusText };
  const data = (await res.json()) as T;
  return { success: true, data };
}

type User = { id: number; name: string };

const result = await fetchJson<User[]>("/api/users");
if (result.success) {
  result.data.forEach((u) => u.name); // User[] — full autocomplete
}
```

```typescript
interface Box<T> {
  contents: T;
}

interface GenericIdentityFn<T> {
  (arg: T): T;
}

class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

// Single type param — both fields same type
class User<T> {
  constructor(public name: T, public age: T) {}
  getPass() {
    return `${this.name}${this.age}`;
  }
}
new User("Yauhen", "31").getPass(); // "Yauhen31"
new User(123, 321).getPass();       // "123321"

// Multiple type params — different field types
class User2<T, K> {
  constructor(public name: T, public age: K) {}
  getPass() {
    return `${this.name}${this.age}`;
  }
}
new User2("Leo", 22).getPass(); // "Leo22"

// Constrained type param
class User3<T, K extends number> {
  constructor(public name: T, public age: K) {}
  getSecret() {
    return this.age ** 2;
  }
}
new User3("Yauhen", 31).getSecret(); // 961
// new User3("Max", "20"); // Error — age must be number

// Multiple type params + constraints (Pair pattern)
class Pair<T, K extends number> {
  constructor(public key: T, public value: K) {}
  square() {
    return this.value ** 2;
  }
}

const p = new Pair("age", 31);
p.square(); // 961

// Generic classes: type param applies to instance side, not static members
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### `keyof` Type Operator

**Definition:**

Produces a union of an object's keys: `keyof { a: 1; b: 2 }` → `"a" | "b"`.

| When to use | Notes |
|-------------|-------|
| Use with generics for safe property access: `function get<T, K extends keyof T>(obj: T, key: K): T[K]`. Foundation for mapped types. | With index signatures, `keyof` returns the index type — `keyof { [k: string]: boolean }` → `string \| number` (because `obj[0]` === `obj["0"]` in JS). Pairs powerfully with mapped types and `getProper |

**How it works:** `keyof` + `extends` builds **type-safe APIs** without magic strings — `getProperty(user, "phone")` fails at compile time if `"phone"` is not a key of `user`. Combine with `typeof`, `in`, and utility types for flexible contracts.

**Examples:**

```typescript
type Point = { x: number; y: number };
type P = keyof Point; // "x" | "y"

type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish; // number

type Mapish = { [k: string]: boolean };
type M = keyof Mapish; // string | number
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### `typeof` Type Operator

**Definition:**

In **type position**, gets the type of a value or variable — not the runtime `typeof` string.

| When to use | Notes |
|-------------|-------|
| Write `type A = typeof myVar` or `typeof obj["prop"]`. Common pattern: `ReturnType<typeof fn>` needs `typeof fn` first. | Values and types live in separate namespaces. `ReturnType<f>` is wrong — use `ReturnType<typeof f>`. Only works on identifiers and their properties, not arbitrary expressions (prevents `typeof msgbox( |

**Examples:**

```typescript
let s = "hello";
let n: typeof s; // string

function f() {
  return { x: 10, y: 3 };
}

type P = ReturnType<typeof f>; // { x: number; y: number }

// type P = ReturnType<f>; // Error — f is a value, not a type
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Indexed Access Types

**Definition:**

Look up a property's type from another type: `Person["age"]` → `number`.

| When to use | Notes |
|-------------|-------|
| Use `T["key"]` or `T[K]` where `K extends keyof T`. Extract nested types without duplicating shapes. | The index must be a **type**, not a runtime variable. `const key = "age"` won't work as `Person[key]` — use `type key = "age"` or `Person[typeof key]` with `as const`. |

**Examples:**

```typescript
type Person = { age: number; name: string; alive: boolean };

type Age = Person["age"];                    // number
type I1 = Person["age" | "name"];          // string | number
// type Bad = Person["alve"];              // Error — typo: property doesn't exist
type I2 = Person[keyof Person];             // string | number | boolean

const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
];
type Person = typeof MyArray[number];        // element type
type Age = typeof MyArray[number]["age"];   // number

// const key = "age";
// type Bad = Person[key]; // Error — key is a value

type key = "age";
type Good = Person[key]; // number
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Conditional Types

**Definition:**

Type-level if/else: `T extends U ? X : Y` — picks `X` or `Y` based on whether `T` is assignable to `U`.

| When to use | Notes |
|-------------|-------|
| Build dependent types, unwrap arrays (`Flatten<T>`), extract return types with `infer`. Wrap in `[T]` to disable distribution over unions. | **Distributive** over unions: `ToArray<string \| number>` → `string[] \| number[]`, not `(string \| number)[]`. Wrap in `[T]` to disable: `[Type] extends [any] ? Type[] : never`. |

**Examples:**

```typescript
type Example1 = Dog extends Animal ? number : string; // number
type Example2 = RegExp extends Animal ? number : string; // string

type NameOrId<T extends number | string> =
  T extends number ? IdLabel : NameLabel;

function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}
```

```typescript
type MessageOf<T> = T extends { message: unknown }
  ? T["message"]
  : never;

type Flatten<T> = T extends any[] ? T[number] : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number>;   // number
```

```typescript
type Flatten<T> = T extends Array<infer Item> ? Item : T;

type GetReturnType<T> = T extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>; // number
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Mapped Types

**Definition:**

Transform every property of a type by iterating keys: `{ [K in keyof T]: NewType }`.

| When to use | Notes |
|-------------|-------|
| Create flags objects, make all props optional/readonly, rename keys with `as`. Base for many utility types (`Partial`, `Record`). | Mapping modifiers: `readonly`, `?`, and their removers `-readonly`, `-?`. Key remapping with `as` (TS 4.1+): `[K in keyof T as NewKey]: T[K]`. Filter keys by mapping to `never`. |

**Examples:**

```typescript
type OptionsFlags<T> = {
  [Property in keyof T]: boolean;
};

type Features = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<Features>;
// { darkMode: boolean; newUserProfile: boolean }
```

```typescript
// Mapped type + conditional — transform property types per key
type Person = { name: string; age: number };

type UpdatedPerson = {
  [P in keyof Person]: P extends "name" ? string : number;
};

const person: UpdatedPerson = { name: "John", age: 25 };
```

```typescript
// Remove readonly
type CreateMutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// Remove optional
type Concrete<T> = {
  [P in keyof T]-?: T[P];
};
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Template Literal Types

**Definition:**

String types built from string literals and unions: `` `get${Capitalize<Keys>}` ``.

| When to use | Notes |
|-------------|-------|
| Generate event names, CSS keys, or API paths from a union of strings. Combine with mapped types for getter/setter names. | `` `${A \| B}_id` `` → every combination. Cross-multiply multiple unions for i18n keys etc. Built-in intrinsics: `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize` — not locale-aware. |

**Examples:**

```typescript
type World = "world";
type Greeting = `hello ${World}`; // "hello world"

type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"

type Lang = "en" | "ja";
type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
// 2 × 4 = 8 string literal combinations
```

```typescript
type PropEventSource<T> = {
  on<K extends string & keyof T>(
    eventName: `${K}Changed`,
    callback: (newValue: T[K]) => void
  ): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  age: 26,
});

person.on("firstNameChanged", (name) => {
  console.log(name.toUpperCase()); // name: string
});

person.on("ageChanged", (age) => {
  if (age < 0) console.warn("negative age"); // age: number
});

// person.on("firstName", () => {}); // Error — wrong event name
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Intrinsic string manipulation types

**Definition:**

Intrinsic string manipulation types — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | Intrinsic string manipulation types — TypeScript language or compiler feature. |

**Examples:**

```typescript
type Shouty = Uppercase<"hello">;           // "HELLO"
type Quiet = Lowercase<"HELLO">;            // "hello"
type Cap = Capitalize<"hello world">;       // "Hello world"
type Uncap = Uncapitalize<"HELLO WORLD">;   // "hELLO WORLD"

type CacheKey<S extends string> = `ID-${Uppercase<S>}`;
type MainID = CacheKey<"my_app">; // "ID-MY_APP"
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### How the tools combine

**Definition:**

// typeof + indexed access + infer (like built-in ReturnType)

type MyReturn<T> = T extends (...args: never[]) => infer R ? R : never;

| Aspect | Detail |
|--------|--------|
| Summary | // typeof + indexed access + infer (like built-in ReturnType)
type MyReturn<T> = T extends (...args: never[]) => infer R |

**Examples:**

```typescript
// keyof + indexed access + mapped + template literal + conditional
type EventMap<T> = {
  [K in keyof T as `${string & K}Changed`]: T[K];
};

// typeof + indexed access + infer (like built-in ReturnType)
type MyReturn<T> = T extends (...args: never[]) => infer R ? R : never;

// Generic + keyof + extends (typed getProperty)
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Map Pattern (union → object lookup)

**Definition:**

Replace a large union of incompatible shapes with an object keyed by a discriminant.

| When to use | Notes |
|-------------|-------|
| Define `{ [K in Status]: HandlerFor<K> }` and index by status — type-safe lookup without impossible intersections. | `type Status = "idle" \| "loading" \| "error"` works until you need metadata per status. A `Record` or const object scales better. |

**Examples:**

```typescript
// ❌ Union grows unwieldy — easy to miss a case
type Status = "idle" | "loading" | "success" | "error";

// ✅ Map pattern — keys are the union, values hold per-status data
const STATUS_CONFIG = {
  idle: { label: "Idle", retry: false },
  loading: { label: "Loading…", retry: false },
  success: { label: "Done", retry: false },
  error: { label: "Failed", retry: true },
} as const;

type Status = keyof typeof STATUS_CONFIG;

function getConfig(s: Status) {
  return STATUS_CONFIG[s]; // autocomplete for all keys
}
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Branded / Nominal Types (interview pattern)

**Definition:**

A technique to make structurally identical types incompatible by adding a phantom brand field.

| Aspect | Detail |
|--------|--------|
| Summary | A technique to make structurally identical types incompatible by adding a phantom brand field. |

**Examples:**

```typescript
type UserId = string & { readonly __brand: unique symbol };
type OrderId = string & { readonly __brand: unique symbol };

function userId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId) { /* ... */ }

const uid = userId("u-123");
const oid = userId("o-456") as OrderId;
// getUser(oid); // Error — OrderId is not UserId despite both being strings
getUser(uid);    // OK
```

**Sources:** [TypeScript handbook — types-from-types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

</details>

<a name="utility-types"></a>

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

| Aspect | Detail |
|--------|--------|
| Summary | One-line definitions (interview flash cards) — TypeScript language or compiler feature.

* `Partial<T>` — all properties |

* `Partial<T>` — all properties optional
* `Required<T>` — all properties required (opposite of Partial)
* `Readonly<T>` — properties cannot be reassigned
* `Record<Keys, T>` — object with fixed keys and uniform value type
* `Pick<T, Keys>` — subset of properties
* `Omit<T, Keys>` — all properties except listed keys
* `Exclude<Union, E>` — remove union members assignable to `E`
* `Extract<T, U>` — keep union members assignable to `U`
* `InstanceType<C>` — instance type from constructor
* `ThisType<T>` — contextual `this` in object literals

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### Interview examples — all utilities in one place

**Definition:**

Interview examples — all utilities in one place — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | Interview examples — all utilities in one place — TypeScript language or compiler feature. |

**Examples:**

```typescript
interface Person { name: string; age: number; email: string }

const partial: Partial<Person> = { name: "John" };

const required: Required<Partial<Person>> = { name: "John", age: 25, email: "j@x.com" };

const frozen: Readonly<Person> = { name: "John", age: 25, email: "j@x.com" };
// frozen.name = "Jane"; // Error

const fruits: Record<string, number> = { apple: 5, banana: 3 };

const picked: Pick<Person, "name" | "email"> = { name: "John", email: "j@x.com" };

const omitted: Omit<Person, "email"> = { name: "John", age: 30 };

type Primitive = string | number | boolean;
type NoBool = Exclude<Primitive, boolean>;        // string | number
type OnlyBool = Extract<Primitive, boolean>;      // boolean

type MaybeUser = string | null | undefined;
type User = NonNullable<MaybeUser>;               // string

type GetUser = (id: number, active: boolean) => string;
type Params = Parameters<GetUser>;                // [number, boolean]
type Ret = ReturnType<() => { name: string }>;    // { name: string }

class UserClass { name = "John"; age = 30 }
type Inst = InstanceType<typeof UserClass>;       // UserClass

type Helper = { getName(): string } & ThisType<{ name: string }>;
const helper: Helper = { getName() { return this.name } };
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Awaited<Type>`

**Definition:**

Unwraps `Promise` types recursively — models what `await` returns.

| When to use | Notes |
|-------------|-------|
| `type R = Awaited<Promise<Promise<string>>>` → `string`. Works on unions with non-Promise members too. | Works on unions too — `Awaited<boolean \| Promise<number>>` becomes `number \| boolean`, not just `number`. |

**Examples:**

```typescript
type A = Awaited<Promise<string>>;           // string
type B = Awaited<Promise<Promise<number>>>;  // number
type C = Awaited<boolean | Promise<number>>; // number | boolean
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Partial<Type>`

**Definition:**

Makes every property of `Type` optional.

| When to use | Notes |
|-------------|-------|
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
  { description: "throw out trash" }
);
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Required<Type>`

**Definition:**

Makes every property required — opposite of `Partial`.

| When to use | Notes |
|-------------|-------|
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

| When to use | Notes |
|-------------|-------|
| `Readonly<User>` for frozen config. Shallow only — nested objects can still mutate. | Shallow only — nested object properties can still be mutated unless you also mark them readonly or use `Readonly` recursively. |

**Examples:**

```typescript
interface Todo { title: string; }

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

| When to use | Notes |
|-------------|-------|
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

| When to use | Notes |
|-------------|-------|
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

| When to use | Notes |
|-------------|-------|
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

| When to use | Notes |
|-------------|-------|
| `Exclude<"a" \| "b" \| "c", "c">` → `"a" \| "b"`. Operates on **unions**, not object keys. | Uses assignability, not equality — `Exclude<string \| number, Function>` yields `string \| number` because neither is assignable to `Function`. |

**Examples:**

```typescript
type T0 = Exclude<"a" | "b" | "c", "a">;        // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;  // "c"

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number };

type NoCircle = Exclude<Shape, { kind: "circle" }>;
// { kind: "square"; x: number }
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Extract<Type, Union>`

**Definition:**

Keeps only union members assignable to `Union`.

| When to use | Notes |
|-------------|-------|
| `Extract<Primitive, boolean>` → `boolean`. Mirror of `Exclude`. | Mirror of `Exclude` — `Extract<T, U>` ≡ `T extends U ? T : never` (distributive over unions). |

**Examples:**

```typescript
type T0 = Extract<"a" | "b" | "c", "a" | "f">;  // "a"
type T1 = Extract<string | number | (() => void), Function>;  // () => void

type Circle = Extract<Shape, { kind: "circle" }>;
// { kind: "circle"; radius: number }
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `NonNullable<Type>`

**Definition:**

Removes `null` and `undefined` from `Type`.

| When to use | Notes |
|-------------|-------|
| `NonNullable<string \| null>` → `string`. After a null check, or to type guaranteed-present values. | Only removes those two — `void` and other falsy types stay. |

**Examples:**

```typescript
type T0 = NonNullable<string | number | undefined>;  // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Parameters<Type>`

**Definition:**

Extracts function parameter types as a tuple.

| When to use | Notes |
|-------------|-------|
| `Parameters<typeof fn>` → `[string, number]` for wrappers and higher-order functions. | For overloaded functions, uses the **last** overload's parameters. `Parameters<any>` → `unknown[]`; `Parameters<never>` → `never`. |

**Examples:**

```typescript
declare function f1(arg: { a: number; b: string }): void;

type T0 = Parameters<() => string>;           // []
type T1 = Parameters<(s: string) => void>;    // [s: string]
type T2 = Parameters<typeof f1>;              // [arg: { a: number; b: string }]
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ConstructorParameters<Type>`

**Definition:**

Extracts constructor parameter types as a tuple.

| When to use | Notes |
|-------------|-------|
| `ConstructorParameters<typeof Date>` for wrapping native or custom constructors. | `ConstructorParameters<Function>` is `never` — `Function` is too loose to match `abstract new (...args: any) => any`. |

**Examples:**

```typescript
type T0 = ConstructorParameters<ErrorConstructor>;  // [message?: string]

class C {
  constructor(a: number, b: string) {}
}
type T1 = ConstructorParameters<typeof C>;  // [a: number, b: string]
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ReturnType<Type>`

**Definition:**

Extracts the return type of a function type.

| When to use | Notes |
|-------------|-------|
| `ReturnType<typeof fetchUser>` — infer API result type without duplicating. | Overloads → last signature wins. `ReturnType<string>` errors (not a function); `ReturnType<Function>` degrades to `any`. |

**Examples:**

```typescript
declare function f1(): { a: number; b: string };

type T0 = ReturnType<() => string>;     // string
type T1 = ReturnType<typeof f1>;         // { a: number; b: string }
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `InstanceType<Type>`

**Definition:**

Gets the instance type from a constructor type.

| When to use | Notes |
|-------------|-------|
| `InstanceType<typeof MyClass>` → `MyClass`. For factory patterns and DI containers. | `InstanceType<typeof MyClass>` gives you `MyClass` instances — useful for factory patterns and DI. |

**Examples:**

```typescript
class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>;  // C
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `NoInfer<Type>`

**Definition:**

Blocks TS from inferring type arguments from this position (TS 5.4+).

| When to use | Notes |
|-------------|-------|
| Use on default/generic params that should not drive inference: `defaultColor?: NoInfer<C>`. | Added in TS 5.4 — fixes cases where a default/generic parameter gets inferred from an argument you didn't want to drive inference (e.g. a `defaultColor` that widens `C`). |

**Examples:**

```typescript
function createStreetLight<C extends string>(
  colors: C[],
  defaultColor?: NoInfer<C>,
) {
  // ...
}

createStreetLight(["red", "yellow", "green"], "red");   // OK
// createStreetLight(["red", "yellow", "green"], "blue"); // Error
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ThisParameterType<Type>`

**Definition:**

Extracts the type of an explicit `this` parameter from a function type.

| When to use | Notes |
|-------------|-------|
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

| When to use | Notes |
|-------------|-------|
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

| When to use | Notes |
|-------------|-------|
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

| When to use | Notes |
|-------------|-------|
| Apply to string literal unions in mapped/template types — `` Uppercase<"hello"> `` → `"HELLO"`. | Only work on string literal types (or unions of them) — `Uppercase<string>` stays `string`, not a specific result. |

**Examples:**

```typescript
type EventName<T extends string> = `${T}Changed`;
type T0 = Uppercase<"hello">;       // "HELLO"
type T1 = Capitalize<"hello">;      // "Hello"
type T2 = Uncapitalize<"Hello">;    // "hello"

type GetterName<T extends string> = `get${Capitalize<T>}`;
type SetterName<T extends string> = `set${Capitalize<T>}`;
```

**Sources:** [TypeScript handbook — utility-types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

</details>

<a name="reference"></a>
