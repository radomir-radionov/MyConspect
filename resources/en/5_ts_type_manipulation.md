# TypeScript — Type Manipulation

Generics, keyof, typeof, indexed access, conditional and mapped types, template literals.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

### Sections

- [Generics & type operators](#generics-type-operators)

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
