# TypeScript — Objects

Interfaces, object types, classes, and OOP.

[← Back to hub](./5_ts.md)

### Related docs

- [TypeScript — Basics](./5_ts_core.md) · [TypeScript — Narrowing](./5_ts_narrowing.md) · [TypeScript — Functions](./5_ts_functions.md) · [TypeScript — Objects](./5_ts_objects.md) · [TypeScript — Generics](./5_ts_generics.md) · [TypeScript — Reference](./5_ts_reference.md) · [TypeScript — Interview](./5_ts_interview.md)

### Sections

- [Object types](#object-types)
- [Classes & OOP](#classes-oop)
- [Design principles](#design-principles)

---

## Object types

<details>
  <summary>Object shapes</summary>

### Defining Object Types

**Definition:**

Three ways to describe object shapes: inline `{ }`, `interface`, or `type` alias.

| When to use                                                                                  | Notes                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pick one style per codebase. Inline for one-offs; `interface`/`type` for reuse across files. | TypeScript uses **structural typing** — only the shape matters, not the name. A variable typed as `Person` is valid anywhere a `{ name: string; age: number }` is expected. |

**Examples:**

```typescript
// 1. Anonymous inline type
function greet(person: { name: string; age: number }) {
  return "Hello " + person.name;
}

// 2. Interface
interface Person {
  name: string;
  age: number;
}

// 3. Type alias
type Person = {
  name: string;
  age: number;
};
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Reusing object shapes — avoid repetition

**Definition:**

Inline types work but repeat structure. Extract once with `type` or `interface`:

| Aspect  | Detail                                                                           |
| ------- | -------------------------------------------------------------------------------- |
| Summary | Inline types work but repeat structure. Extract once with `type` or `interface`: |

Inline types work but repeat structure |

Inline types work but repeat structure. Extract once with `type` or `interface`:

**Examples:**

```typescript
type Person = { name: string; age: number; nickName: string };

let user: Person = { name: "Yauhen", age: 30, nickName: "webDev" };
let admin: Person = { name: "Max", age: 20, nickName: "Mad" };

// Optional fields for variants of the same shape
type PersonWithExtras = {
  name: string;
  age: number;
  nickName?: string;
  getPass?: () => string;
};

let admin2: PersonWithExtras = {
  name: "Max",
  age: 20,
  getPass() {
    return `${this.name}${this.age}`;
  },
};
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Optional Properties

**Definition:**

Object fields that may be absent, marked with `?`.

| When to use                                                                                         | Notes                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| On interfaces/types in Object Types chapter — same as Everyday Types: optional keys may be missing. | Optional ≠ "might not exist at runtime" only — under `strictNullChecks`, reading an optional property gives `T \| undefined`. Use defaults in destructuring (`{ xPos = 0 }`) to narrow inside the functi |

**Examples:**

```typescript
interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}

paintShape({ shape });
paintShape({ shape, xPos: 100 });

function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos; // number | undefined

  let xPos2 = opts.xPos === undefined ? 0 : opts.xPos; // number

  // Defaults via destructuring
  function paint({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
    console.log(xPos, yPos); // both number
  }
}
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Pitfall: no types inside destructuring rename syntax

**Definition:**

In JS destructuring, `{ shape: Shape }` renames `shape` to variable `Shape` — it does NOT add a type annotation.

| Aspect  | Detail                                                                                                           |
| ------- | ---------------------------------------------------------------------------------------------------------------- |
| Summary | In JS destructuring, `{ shape: Shape }` renames `shape` to variable `Shape` — it does NOT add a type annotation. |

In JS |

In JS destructuring, `{ shape: Shape }` renames `shape` to variable `Shape` — it does NOT add a type annotation.

**Examples:**

```typescript
// Wrong — Shape and number become variable names, not types
// function draw({ shape: Shape, xPos: number = 100 }) { ... }

// Correct — type after the whole pattern
function draw({ shape, xPos = 100 }: { shape: Shape; xPos?: number }) {}
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### `readonly` Properties

**Definition:**

Object properties that cannot be reassigned after initialization.

| When to use                                                                                                     | Notes                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mark with `readonly` on interface fields or `readonly` arrays/tuples. Compile-time only — shallow immutability. | `readonly` is shallow — nested object contents can still mutate. Also, `readonly` is ignored when checking type compatibility via aliasing — a `readonly` view can still change if you hold a mutable al |

**Examples:**

```typescript
interface SomeType {
  readonly prop: string;
}

function doSomething(obj: SomeType) {
  console.log(obj.prop); // OK
  // obj.prop = "hello"; // Error
}

interface Home {
  readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
  home.resident.age++; // OK — mutating nested object
  // home.resident = { ... }; // Error — can't reassign readonly property
}

let writable: Person = { name: "Alice", age: 42 };
let readonly: ReadonlyPerson = writable;
writable.age++; // mutates shared object — readonly view sees 43
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Index Signatures

**Definition:**

Describe objects with dynamic string/number keys: `{ [key: string]: number }`.

| When to use                                                                                                | Notes                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Use when keys aren't known upfront. Combine with known fields; value type must include all property types. | All named properties must match the index signature type. `number` index values must be a subtype of `string` index values (because `obj[100]` === `obj["100"]` in JS). Use union index types when prope |

**Examples:**

```typescript
interface StringArray {
  [index: number]: string;
}

const arr: StringArray = getStringArray();
const item = arr[1]; // string

// All properties must fit the index type
interface NumberDictionary {
  [index: string]: number;
  length: number; // OK
  // name: string; // Error — string not assignable to number index
}

interface FlexibleDict {
  [index: string]: number | string;
  length: number;
  name: string;
}

interface ReadonlyStringArray {
  readonly [index: number]: string;
}
// arr[2] = "x"; // Error — readonly index
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Excess Property Checks

**Definition:**

TS rejects object literals with properties not declared in the target type.

| When to use                                                                                                     | Notes                                                                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Catches typos in fresh literals `{ name: "a", nmae: "b" }`. Does not apply when assigning via a variable first. | Excess checks apply to **fresh object literals** only. Assign to a variable first, use `as Type`, or add a string index signature to bypass — but most excess property errors are real bugs. |

**Examples:**

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig) {
  /* ... */
}

// Error — 'colour' is not in SquareConfig
// createSquare({ colour: "red", width: 100 });

// Workarounds (use sparingly):
createSquare({ width: 100, opacity: 0.5 } as SquareConfig);

interface LooseConfig {
  color?: string;
  width?: number;
  [prop: string]: unknown; // allows extra keys
}

let options = { colour: "red", width: 100 };
createSquare(options); // OK — not a fresh literal check
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Extending Types

**Definition:**

Adding fields to an existing type via `interface Child extends Parent`.

| When to use                                                                                                 | Notes                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Stack interfaces: `interface Admin extends User { role: string }`. For types, use intersection `&` instead. | `extends` signals intent and avoids repeating fields. Prefer it over copy-paste when building specialized versions of a base shape. |

**Examples:**

```typescript
interface BasicAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
  unit: string;
}

interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}
interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = { color: "red", radius: 42 };
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Intersection Types

**Definition:**

Combine types with `&` — value must satisfy **all** members: `A & B`.

| When to use                                                                                        | Notes                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Merge object shapes: `type Employee = Person & Worker`. Conflicting property types become `never`. | Intersection merges conflicting property types into `never` instead of erroring at declaration time. `Person1 & Person2` where both have `name: string` vs `name: number` → `name: never`. |

**Examples:**

```typescript
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;

function draw(circle: ColorfulCircle) {
  console.log(circle.color, circle.radius);
}

draw({ color: "blue", radius: 42 });
// draw({ color: "red", raidus: 42 }); // Error — typo caught
```

```typescript
type Person = { name: string; age: number };
type Employee = { company: string; position: string };
type EmployeePerson = Person & Employee;

const employee: EmployeePerson = {
  name: "John",
  age: 30,
  company: "ABC Corp",
  position: "Manager",
};
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Interface Extension vs Intersection

**Definition:**

Two ways to combine types — they handle property conflicts differently.

| When to use                                                                                                | Notes                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prefer `extends` for interfaces (errors on conflict). Use `&` for types; conflicting props become `never`. | Duplicate `interface` names **merge** if compatible; incompatible props → error. Intersection of types with conflicting props → `never` on that property, compiles silently until you use it. |

**Examples:**

```typescript
// Interface merge — error on conflict
interface Person {
  name: string;
}
// interface Person { name: number; } // Error — incompatible merge

// Intersection — compiles, property becomes never
interface Person1 {
  name: string;
}
interface Person2 {
  name: number;
}
type Staff = Person1 & Person2;
declare const staffer: Staff;
// staffer.name is type `never`
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Generic Object Types

**Definition:**

Object types parameterized by other types: `Box<T>`, `Array<T>`.

| When to use                                                                                 | Notes                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `interface ApiResponse<T> { data: T; error?: string }` — reuse one shape for many payloads. | `Box<string>` is identical to `{ contents: string }` after substitution. Generics on interfaces AND type aliases work; aliases can also build helper types like `type OrNull<T> = T \| null`. |

**Examples:**

```typescript
interface Box<Type> {
  contents: Type;
}

let box: Box<string> = { contents: "hello" };
// same as StringBox { contents: string }

type AppleBox = Box<Apple>;

function setContents<Type>(box: Box<Type>, newContents: Type) {
  box.contents = newContents;
}

// Generic type aliases
type OrNull<Type> = Type | null;
type OneOrMany<Type> = Type | Type[];
type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### `Array` and `ReadonlyArray`

**Definition:**

`Array<T>` / `T[]` for mutable lists; `ReadonlyArray<T>` / `readonly T[]` for immutable views.

| When to use                                                                                           | Notes                                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Assign mutable array to readonly OK; not the reverse. Readonly arrays disallow `push`/`pop`/`splice`. | `ReadonlyArray<T>` / `readonly T[]` has no constructor — assign from a regular array. Readonly → mutable assignment works; mutable ← readonly does not. |

**How it works:** `ReadonlyArray<T>` and `readonly T[]` are **equivalent** — same behavior (no `push`/`pop`/`splice`). `readonly T[]` is syntactic sugar; `ReadonlyArray<T>` is more explicit in generic code.

**Examples:**

```typescript
function process(values: Array<string>) {
  /* ... */
}
function process2(values: string[]) {
  /* ... */
} // same

function readOnly(values: readonly string[]) {
  values.slice(); // OK
  // values.push("x"); // Error
}

// No constructor:
// new ReadonlyArray("a", "b"); // Error

let x: readonly string[] = [];
let y: string[] = [];
x = y; // OK — readonly accepts mutable
// y = x; // Error — can't assign readonly to mutable
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Tuple Types

**Definition:**

A fixed-length array with a specific type at each index: `[string, number]`.

| When to use                                                                                                                                                        | Notes                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Declare `type Pair = [string, number]` or `let t: [string, number] = ["a", 1]`. Order matters. Use for coords, `[value, error]` pairs, or mirroring function args. | **Order matters** — `[string, number]` is not assignable from `[number, string]`. Tuples are ideal for convention-based APIs (`[x, y]` coords) but objects with named fields are often clearer. |

**Examples:**

```typescript
type StringNumberPair = [string, number];

let x: StringNumberPair = ["hello", 42]; // OK
// let bad: StringNumberPair = [42, "hello"]; // Error — order matters

function doSomething(pair: [string, number]) {
  const a = pair[0]; // string
  const b = pair[1]; // number
  // const c = pair[2]; // Error — no index 2
}

doSomething(["hello", 42]);

const [input, hash] = pair; // destructuring
```

```typescript
type Either2dOr3d = [number, number, number?];

function setCoordinate(coord: Either2dOr3d) {
  const [x, y, z] = coord; // z: number | undefined
  console.log(coord.length); // 2 | 3
}

type StringNumberBooleans = [string, number, ...boolean[]];

const a: StringNumberBooleans = ["hello", 1];
const b: StringNumberBooleans = ["world", 2, true, false];
```

```typescript
function readButtonInput(...args: [string, number, ...boolean[]]) {
  const [name, version, ...input] = args;
}

// Equivalent to:
function readButtonInput(name: string, version: number, ...input: boolean[]) {}
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### `readonly` Tuple Types

**Definition:**

Tuples whose elements cannot be reassigned: `readonly [string, number]`.

| When to use                                                                                                   | Notes                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mark params `readonly` when callers pass `as const` tuples. Prevents accidental mutation inside the function. | `readonly [3, 4]` is NOT assignable to `[number, number]` because the callee might mutate elements. Prefer `readonly` tuple params when you won't mutate — matches `as const` call sites. |

**Examples:**

```typescript
function doSomething(pair: readonly [string, number]) {
  // pair[0] = "hello"; // Error
}

let point = [3, 4] as const; // readonly [3, 4]

function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

// distanceFromOrigin(point); // Error — readonly not assignable to mutable tuple

function distanceFromOrigin2([x, y]: readonly [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}
distanceFromOrigin2(point); // OK
```

**Sources:** [TypeScript handbook — objects](https://www.typescriptlang.org/docs/handbook/2/objects.html)

</details>

<a name="classes"></a>

## Classes & OOP

<details>
  <summary>Design-first OOP with interfaces</summary>

### Design-first OOP with interfaces

**Definition:** Describe entity contracts (`interface`, `type`) before implementations. TypeScript checks relations at compile time; emitted JS has no types left.

**How it works:**

- An **interface** is a behavior contract — any object that matches the shape is usable (structural typing).
- Sketch `Ledger` / `LedgerEntry` first; implement classes later. Broken wiring fails in `tsc`, not in production.
- Prefer `type` aliases for branded scalars (`MoneyAmount`) and unions (`RecordKind`). Do **not** name a type `Record` — it clashes with the built-in `Record<K, V>`.
- `enum` works but adds runtime JS and quirks; string unions are usually enough.

**When to use:** Domain models, DI graphs, public module APIs. Skip for throwaway scripts.

**Pluses and minuses:**

| +                                  | −                                   |
| ---------------------------------- | ----------------------------------- |
| Catch bad entity graphs before run | Types erased — runtime still JS     |
| Autocomplete on domain fields      | Over-modeling small scripts         |
| `implements` documents composition | TS `private` is not runtime privacy |

**Examples:**

```ts
type MoneyAmount = number;
type TimeStamp = number;
type RecordKind = "spending" | "income";

type LedgerEntry = {
  kind: RecordKind;
  amount: MoneyAmount;
  dateTime: TimeStamp;
};

interface Ledger {
  addRecord(record: LedgerEntry): void;
}

class History implements Ledger {
  private records: LedgerEntry[] = []; // compile-time only — use #records for runtime privacy
  addRecord(record: LedgerEntry): void {
    this.records.push(record);
  }
}
```

**Thoughts:** Why TS if runtime is JS? Same as engine diagnostics before you drive — you learn about a broken contract before traffic. Full OOP design: [7_special.md](./7_special_engineering.md#object-oriented-programming-oop).

**Sources:** [Doka — OOP](https://doka.guide/tools/oop/) · [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) · [Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>

<details>
  <summary>OOP in TypeScript</summary>

### OOP in TypeScript

**Definition:** TypeScript adds **static types** on top of JavaScript's prototype-based runtime. The four OOP pillars still apply, but TS adds **interfaces**, **abstract classes**, **access modifiers**, and **structural typing** — checked at compile time and **erased** in emitted JS.

**How it works:**

| Pillar            | TypeScript mechanism                                                                |
| ----------------- | ----------------------------------------------------------------------------------- |
| **Encapsulation** | `private` / `protected` / `readonly` (compile-time); `#field` (runtime, same as JS) |
| **Abstraction**   | `interface`, `abstract class`, small public class API                               |
| **Inheritance**   | `extends` one class; methods live on the prototype chain in emit                    |
| **Polymorphism**  | Method overrides + `implements` contracts; structural typing by shape               |

- **Structural typing:** compatible shapes assign — a plain object can satisfy an `interface` without `implements`.
- **`implements`:** class explicitly promises an interface shape; `tsc` errors on mismatch.
- **`extends`:** single base class only (JS limitation); stack multiple contracts with `implements A, B`.
- **`private` / `protected`:** erased in emit — not enforced at runtime. Use `#` when you need real hiding.
- **`abstract class`:** cannot instantiate; may mix concrete and abstract methods.

**When to use:** Domain models, DI graphs, public SDKs, teams that need contracts. Overkill for throwaway scripts.

**Pluses and minuses:**

| +                                                           | −                                                                      |
| ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| `interface` + `implements` document and enforce contracts   | Types erase — runtime is still untyped JS                              |
| Structural typing is flexible for adapters and tests        | Two types with the same shape are interchangeable even if names differ |
| `abstract class` shares implementation + enforces overrides | Over-modeling small scripts adds noise                                 |

**Examples:**

**Encapsulation** — state changes only through methods; `#` enforces privacy at runtime:

```ts
class BankAccount {
  #balance = 0;
  deposit(amount: number) {
    if (amount <= 0) throw new Error("amount must be positive");
    this.#balance += amount;
  }
  withdraw(amount: number) {
    if (amount > this.#balance) throw new Error("insufficient funds");
    this.#balance -= amount;
  }
  getBalance(): number {
    return this.#balance;
  }
}
// account.#balance → SyntaxError
```

**Abstraction** — `interface` hides transport; checkout depends on _what_, not _how_:

```ts
interface PaymentGateway {
  charge(amount: number): Promise<{ ok: boolean }>;
}

class StripeGateway implements PaymentGateway {
  async charge(amount: number) {
    const res = await fetch("/api/charge", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
    return { ok: res.ok };
  }
}

async function checkout(total: number, gateway: PaymentGateway) {
  return gateway.charge(total); // no Stripe URL or auth headers here
}
```

**Inheritance** — parent holds shared code; child overrides only what differs:

```ts
class Employee {
  constructor(public name: string) {}
  getRole(): string {
    return "employee";
  }
}

class Manager extends Employee {
  getRole(): string {
    return "manager";
  }
}

const staff: Employee[] = [new Employee("Ann"), new Manager("Bob")];
staff.map((e) => e.getRole()); // ['employee', 'manager']
```

**Polymorphism** — one `send()` call; swap `EmailAlert` / `SmsAlert` without changing the caller:

```ts
interface Notifier {
  send(message: string): void;
}

class EmailAlert implements Notifier {
  send(message: string) {
    console.log("email:", message);
  }
}

class SmsAlert implements Notifier {
  send(message: string) {
    console.log("sms:", message);
  }
}

function notifyAll(alerts: Notifier[], text: string) {
  alerts.forEach((a) => a.send(text));
}

notifyAll([new EmailAlert(), new SmsAlert()], "Order shipped");
```

**Thoughts:** TS OOP = JS runtime + compile-time contracts. Privacy: [TS `private` vs `#` fields](#ts-private-vs-fields). Design-first workflow: [Design-first OOP with interfaces](#design-first-oop-with-interfaces). Pillars theory: [OOP & SOLID](./7_special_engineering.md#object-oriented-programming-oop). JS mechanisms: [OOP in JavaScript](./3_js_oop.md#oop-in-javascript).

**Sources:** [TypeScript handbook — Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) · [TypeScript handbook — Object types](https://www.typescriptlang.org/docs/handbook/2/objects.html) · [MDN — Private elements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements) · [Doka — OOP](https://doka.guide/tools/oop/) · [OOP & SOLID](./7_special_engineering.md#object-oriented-programming-oop) · [OOP in JavaScript](./3_js_oop.md#oop-in-javascript)

</details>

<details>
  <summary>TS `private` vs `#` fields</summary>

### TS `private` vs `#` fields

**Definition:** `private` / `protected` are **compile-time** only (erased in emit). `#field` is an ECMAScript private slot — inaccessible outside the class **at runtime**.

**How it works:**

- `private foo` → still `instance.foo` in the compiled JS; `instance["foo"]` also works. `tsc` errors; JS consumers do not.
- `#foo` → `SyntaxError` outside the class; `instance["#foo"]` is `undefined`, not the value.
- Chrome DevTools may read `#` fields in the console for debugging — not a language hole.

|                 | `private` (TS)              | `#field` (ES)                      |
| --------------- | --------------------------- | ---------------------------------- |
| Enforced by     | compiler                    | runtime                            |
| Survives emit   | no — public property        | yes — private slot                 |
| Subclass access | `protected` yes             | no (unless getter)                 |
| Old targets     | works (it's a normal field) | needs downlevel or modern runtimes |

**When to use:** Library shipped as JS → `#` if you need real hiding. App-only TS → `private` is often enough plus team discipline.

**Examples:**

```ts
class C {
  private foo = 10;
  #bar = 20;
}
console.log(new C().foo); // tsc error; prints 10 in JS
console.log(new C()["foo"]); // 10
// new C().#bar; // SyntaxError at compile *and* runtime
```

**Thoughts:** TS privacy is a seatbelt in the type-checker; `#` is a lock on the object.

**Sources:** [TypeScript 3.8 — private fields](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html) · [MDN — private elements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements)

</details>

<details>
  <summary>Classes & OOP</summary>

### Verbose constructor vs parameter properties

**Definition:**

constructor(name: string, age: number, nickName: string) {

this.name = name;
this.age = age;
this.nickName = nickName;
}
}

| Aspect  | Detail                                                     |
| ------- | ---------------------------------------------------------- |
| Summary | constructor(name: string, age: number, nickName: string) { |

    this.name = name;
    this.age = age;
    this.nickName = |

**Examples:**

```typescript
class User {
  name: string;
  age: number;
  nickName: string;

  constructor(name: string, age: number, nickName: string) {
    this.name = name;
    this.age = age;
    this.nickName = nickName;
  }
}

const dev = new User("RR", 999, "018");
```

```typescript
class User {
  constructor(
    public name: string,
    public age: number,
    public nickName: string,
    public pass: number,
  ) {}
}
```

```typescript
class User {
  name: string;
  age = 20;
  nickName = "webDev";

  constructor(name: string) {
    this.name = name;
  }

  getPass() {
    return `${this.nickName}${this.age}`; // "webDev20"
  }
}
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Access Modifiers

**Definition:**

Keywords controlling visibility of class members: `public`, `private`, `protected`, `readonly`.

| When to use                                                                                                                             | Notes                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Default is `public`. `private` — class only; `protected` — class + subclasses. TS modifiers are compile-time unless you use `#` fields. | `private`/`protected` in TS are **compile-time only** unless you use ECMAScript `#private` fields. Two structurally identical classes with different `private` members are **not** assignable to each ot |

**Examples:**

```typescript
class User {
  public name: string;
  private nickName: string;
  protected age: number;
  readonly pass: number;

  constructor(name: string, age: number, nickName: string, pass: number) {
    this.name = name;
    this.age = age;
    this.nickName = nickName;
    this.pass = pass;
  }
}

const dev = new User("RR", 30, "webDev", 123);
dev.name; // OK
// dev.nickName; // Error — private
// dev.age;      // Error — protected (outside subclass)
// dev.pass = 1; // Error — readonly
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Parameter Properties

**Definition:**

Constructor shorthand: `constructor(public name: string)` declares and assigns in one line.

| Aspect  | Detail                                                                                      |
| ------- | ------------------------------------------------------------------------------------------- |
| Summary | Constructor shorthand: `constructor(public name: string)` declares and assigns in one line. |

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Compiled output — static on the constructor

**Definition:**

After compilation, `static` lives on the class function, not instances:

| Aspect  | Detail                                                                  |
| ------- | ----------------------------------------------------------------------- |
| Summary | After compilation, `static` lives on the class function, not instances: |

After compilation, `static` lives on the class |

After compilation, `static` lives on the class function, not instances:

**Examples:**

```javascript
"use strict";
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  getPass() {
    return this.name + User.secret;
  }
}
User.secret = 12345;
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Method override in subclass

**Definition:**

Method override in subclass — TypeScript language or compiler feature.

| Aspect  | Detail                                                                 |
| ------- | ---------------------------------------------------------------------- |
| Summary | Method override in subclass — TypeScript language or compiler feature. |

**Examples:**

```typescript
class Child extends User {
  constructor(age: number) {
    super("Yauhen", age);
  }
  getPass() {
    return `${this.age}${this.name}${User.secret}`; // "31Yauhen12345"
  }
}
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Abstract Classes vs Interfaces

**Definition:**

Two ways to define contracts — abstract classes can have implementation; interfaces are signatures only.

| Aspect  | Detail                                                                                                   |
| ------- | -------------------------------------------------------------------------------------------------------- |
| Summary | Two ways to define contracts — abstract classes can have implementation; interfaces are signatures only. |

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Abstract class example

**Definition:**

Abstract class example — TypeScript language or compiler feature.

| Aspect  | Detail                                                            |
| ------- | ----------------------------------------------------------------- |
| Summary | Abstract class example — TypeScript language or compiler feature. |

**Examples:**

```typescript
abstract class User {
  constructor(
    public name: string,
    public age: number,
  ) {}
  greet() {
    console.log(this.name);
  }
  abstract getPass(): string; // must implement in subclass
}

class Child extends User {
  constructor(age: number) {
    super("Yauhen", age);
  }
  getPass() {
    return `${this.age}${this.name}`;
  }
}

const y = new Child(31);
y.greet(); // "Yauhen"
y.getPass(); // "31Yauhen"
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Interfaces with classes

**Definition:**

Using interfaces to describe class instance shapes and contracts.

| Aspect  | Detail                                                            |
| ------- | ----------------------------------------------------------------- |
| Summary | Using interfaces to describe class instance shapes and contracts. |

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Optional, readonly, and index signatures

**Definition:**

// Excess property check — extra keys error unless index signature allows them

interface FlexibleUser {
name: string;
age: number;
[propName: string]: unknown;
}

| Aspect  | Detail                                                                         |
| ------- | ------------------------------------------------------------------------------ |
| Summary | // Excess property check — extra keys error unless index signature allows them |

interface FlexibleUser {
name: string;
|

**Examples:**

```typescript
interface User {
  readonly name: string;
  age?: number;
}

// Excess property check — extra keys error unless index signature allows them
interface FlexibleUser {
  name: string;
  age: number;
  [propName: string]: unknown;
}

const u: FlexibleUser = {
  name: "Yauhen",
  age: 31,
  nickName: "webDev",
};
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### `implements` one or many interfaces

**Definition:**

getPass() {

return `${this.name}${this.age}`;
}
}

| Aspect  | Detail      |
| ------- | ----------- |
| Summary | getPass() { |

    return `${this.name}${this.age}`;

}
} |

**Examples:**

```typescript
interface User {
  name: string;
  age: number;
}
interface Pass {
  getPass(): string;
}

class Employee implements User, Pass {
  name = "Yauhen";
  age = 31;
  nickName = "webDev"; // extra members OK

  getPass() {
    return `${this.name}${this.age}`;
  }
}

interface Admin extends User {
  getPass(): string;
}

class Manager implements Admin {
  name = "Max";
  age = 20;
  getPass() {
    return `${this.name}${this.age}`;
  }
}
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### `implements`

**Definition:**

Promise that a class satisfies an interface contract — all required members must exist.

| Aspect  | Detail                                                                                  |
| ------- | --------------------------------------------------------------------------------------- |
| Summary | Promise that a class satisfies an interface contract — all required members must exist. |

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<a name="design-principles"></a>

## Design principles

<details>
  <summary>SOLID in TypeScript</summary>

### SOLID in TypeScript

**Definition:** The five **SOLID** principles applied to **TypeScript interfaces, classes, and modules** — compile-time contracts via `interface`, `implements`, and constructor injection.

| Principle                     | Meaning                         | TypeScript example                                                                    |
| ----------------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| **S** — Single Responsibility | One reason to change per module | `UserRepository` reads data · `UserFormatter` shapes labels — not one god class       |
| **O** — Open/Closed           | Extend via new code, not edits  | New `StripeProcessor implements PaymentProcessor` — don't edit `CheckoutService`      |
| **L** — Liskov Substitution   | Subtypes honor parent contract  | Every `UserStore` passed to `loadProfile()` must return the same `{ id, name }` shape |
| **I** — Interface Segregation | Small focused interfaces        | `ReadableLedger` for reports — not a fat `Ledger` with `write()` / `delete()`         |
| **D** — Dependency Inversion  | Depend on abstractions          | `placeOrder(id, logger: Logger)` — inject `Logger`, not a concrete console adapter    |

**How it works:**

Each letter matches the **Examples** below — look for `// good` and `// bad`:

1. **S** — split repository vs formatter with separate `interface`s — not one service class.
2. **O** — new provider = new class implementing the interface — not a growing `if/else` in one class.
3. **L** — `implements UserStore` must satisfy the return type — `tsc` catches broken substitutes.
4. **I** — pass `ReadableLedger` where reads are enough — don't require unused write APIs.
5. **D** — domain functions take `Logger` / `DbClient` types — wiring layer picks concrete implementations.

**When to use:** Domain models, services, DI graphs, public module APIs. Skip heavy interfaces on a one-off script.

**Examples:**

```typescript
type DbClient = { query(id: string): Promise<{ id: string; name: string }> };

// S — good: repository vs formatter — separate interfaces
interface UserRepository {
  findById(id: string): Promise<{ id: string; name: string }>;
}

interface UserFormatter {
  label(user: { name: string; email: string }): string;
}

class DbUserRepository implements UserRepository {
  constructor(private db: DbClient) {}
  findById(id: string) {
    return this.db.query(id);
  }
}

// S — bad: one class loads users and formats UI labels
// class UserService {
//   findById(id: string) {
//     return this.db.query(id);
//   }
//   label(user: { name: string; email: string }) {
//     return `${user.name} <${user.email}>`;
//   }
// }

// O — good: new processor = new class implementing PaymentProcessor
interface PaymentProcessor {
  charge(amount: number): Promise<{ ok: true }>;
}

class StripeProcessor implements PaymentProcessor {
  charge(amount: number) {
    return Promise.resolve({ ok: true as const });
  }
}

class CheckoutService {
  constructor(private payments: PaymentProcessor) {}
  checkout(amount: number) {
    return this.payments.charge(amount);
  }
}

// O — bad: edit CheckoutService for every provider
// class CheckoutService {
//   checkout(provider: "stripe" | "paypal", amount: number) {
//     if (provider === "stripe") return payStripe(amount);
//     if (provider === "paypal") return payPaypal(amount);
//   }
// }

// L — good: any UserStore works in loadProfile
interface UserStore {
  get(id: string): Promise<{ id: string; name: string }>;
}

async function loadProfile(id: string, store: UserStore) {
  return store.get(id);
}

class CachedUserStore implements UserStore {
  get(id: string) {
    return Promise.resolve({ id, name: "Ada" });
  }
}

// L — bad: returns string instead of contract — tsc error + broken callers
// class BrokenUserStore implements UserStore {
//   get(id: string) {
//     return Promise.resolve("missing");
//   }
// }

// I — good: report needs only ReadableLedger
interface ReadableLedger {
  read(id: string): Promise<{ id: string; total: number }>;
}

function buildReport(ledger: ReadableLedger) {
  return ledger.read("summary");
}

// I — bad: read-only code forced to depend on write/delete APIs
// interface Ledger {
//   read(id: string): Promise<{ id: string; total: number }>;
//   write(entry: { id: string; total: number }): Promise<void>;
//   delete(id: string): Promise<void>;
// }
// function buildReport(ledger: Ledger) {
//   return ledger.read("summary");
// }

// D — good: inject Logger abstraction
interface Logger {
  info(message: string): void;
}

function placeOrder(orderId: string, logger: Logger) {
  logger.info(`Processing ${orderId}`);
}

// D — bad: domain imports concrete infra
// import { consoleLogger } from "./infra/logger";
// function placeOrder(orderId: string) {
//   consoleLogger.info(`Processing ${orderId}`);
// }
```

**Thoughts:** TypeScript makes **I**, **L**, and **D** visible at compile time — but types erase at runtime; behavior contracts still matter. JS fundamentals: [SOLID in Classes](./3_js_core.md#solid-in-classes) · [SOLID in Functions](./3_js_core.md#solid-in-functions). Framework mapping: [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express). Vue SFC typing (`defineProps`, `vue-tsc`): [TypeScript with Vue](./4_vue_composition.md#typescript-with-vue). Full reference: [OOP & SOLID](./7_special_engineering.md#solid-overview).

**Sources:** [TypeScript handbook — Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) · [TypeScript handbook — Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) · [SOLID (overview)](./7_special_engineering.md#solid-overview) · [JS — SOLID in Classes](./3_js_core.md#solid-in-classes) · [JS — SOLID in Functions](./3_js_core.md#solid-in-functions) · [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express) · [TypeScript with Vue](./4_vue_composition.md#typescript-with-vue)

</details>

<a name="generics"></a>
