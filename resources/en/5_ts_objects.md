# TypeScript — Object Types

Object shapes, interfaces, optional and readonly properties, index signatures, and tuples.

[← Back to hub](./5_ts.md)

### Related docs

- [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

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

Moved to [Classes](./5_ts_classes.md).

## Design principles

See [OOP & SOLID](./7_special_engineering.md#object-oriented-programming-oop).
