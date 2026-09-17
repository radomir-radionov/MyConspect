# TypeScript — Narrowing

Control-flow analysis and type guards.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — Basics](./5_ts_core.md) · [TypeScript — Narrowing](./5_ts_narrowing.md) · [TypeScript — Functions](./5_ts_functions.md) · [TypeScript — Objects](./5_ts_objects.md) · [TypeScript — Generics](./5_ts_generics.md) · [TypeScript — Reference](./5_ts_reference.md) · [TypeScript — Interview](./5_ts_interview.md)

### Main concepts

| Area | Topics |
|------|--------|
| Guards | `typeof`, truthiness, equality, `in`, `instanceof` |
| Custom | Type predicates, assertion functions |
| Flow | Assignment narrowing, control-flow analysis |
| Unions | Discriminated unions, `never` and exhaustiveness |

### Sections

- [Type guards](#type-guards)
- [Custom guards](#custom-guards)
- [Control flow](#control-flow)
- [Unions](#unions)

---

## Type guards

<details>
<summary>Type narrowing</summary>

**Definition:** TypeScript refines a declared union to a more specific type by analyzing runtime checks and control flow.

**How it works:**
- The compiler overlays type analysis on JavaScript constructs (`if`/`else`, ternaries, loops, truthiness, equality).
- A *type guard* is a check TypeScript understands (`typeof`, `in`, `instanceof`, predicates).
- After a guard, you can safely use members that exist only on that variant.

**When to use:** Any value typed as a union before you access members that are not shared by every variant. Skip when the type is already a single concrete type.

**Examples:**

```typescript
function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}
```

**Thoughts:** Interview framing: narrowing is control-flow analysis, not a runtime cast. `as` does not check anything.

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

</details>

<details>
<summary>`typeof` type guards</summary>

**Definition:** Checking `typeof value === "..."` is a type guard because TypeScript encodes JavaScript's `typeof` results.

**How it works:**
- Recognized strings: `"string"`, `"number"`, `"bigint"`, `"boolean"`, `"symbol"`, `"undefined"`, `"object"`, `"function"`.
- `typeof null` is `"object"` — a `typeof x === "object"` branch still includes `null`.
- Arrays are objects; `typeof arr === "object"` does not prove `T[]` by itself.

**When to use:** Primitive unions (`string | number`, `string | undefined`). Do not use `typeof` to filter `null` — use `=== null`.

**Examples:**

```typescript
function padLeft(padding: number | string, input: string): string {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}

function printAll(strs: string | string[] | null) {
  if (typeof strs === "object") {
    // still `string[] | null` — arrays and null are both objects
  } else if (typeof strs === "string") {
    console.log(strs);
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

</details>

<details>
<summary>Truthiness narrowing</summary>

**Definition:** Conditions that coerce to boolean (`if (value)`, `!value`, `&&` / `||`) narrow away falsy variants.

**How it works:**
- Falsy: `false`, `0`, `0n`, `""`, `null`, `undefined`, `NaN`. Everything else is truthy.
- `if (x)` drops `null`/`undefined` (and other falsy primitives) from the true branch.
- `Boolean(x)` infers `boolean`; `!!x` infers the literal `true` when `x` is always truthy.

**When to use:** Guarding against `null`/`undefined` on objects and arrays. Skip when `0` or `""` are valid values — those are also falsy.

**Examples:**

```typescript
function printLength(str: string | null | undefined) {
  if (str) {
    console.log(`Length: ${str.length}`);
  } else {
    // null, undefined, or ""
    console.log("No valid string provided");
  }
}

function checkCount(count: number | undefined) {
  if (count) {
    // skipped when count is 0
    console.log(`Count is ${count}`);
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

</details>

<details>
<summary>Equality narrowing</summary>

**Definition:** `===`, `!==`, `==`, `!=`, and `switch` narrow when TypeScript can prove which union members remain.

**How it works:**
- Strict equality (`===` / `!==`) compares type and value.
- Loose equality: `== null` / `!= null` is the usual shortcut for both `null` and `undefined`.
- Comparing two unions keeps only the overlapping type in the true branch.

**When to use:** Literal tags, `null`/`undefined` checks, and matching two variables that share a type. Prefer `===` except for the `== null` idiom.

**Examples:**

```typescript
function processInput(x: string | number, y: string | boolean) {
  if (x === y) {
    // only shared type: string
    console.log(x.toUpperCase());
    console.log(y.toUpperCase());
  }
}

function printValue(value: string | null | undefined) {
  if (value != null) {
    console.log(value.trim());
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

</details>

<details>
<summary>`in` operator narrowing</summary>

**Definition:** `"key" in obj` narrows an object union to members that declare that property.

**How it works:**
- True branch: types that have the key (required or optional).
- False branch: types that do **not** have the key as a required property.
- If the key is optional (`?`) on one variant, that variant can remain in the `else` branch.

**When to use:** Structurally different objects (`Fish | Bird`) when you do not share a discriminant field. Prefer a literal `kind` field when you control both types.

**Examples:**

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) animal.swim();
  else animal.fly();
}

type Car = { drive: () => void; sunroof?: boolean };
type Truck = { drive: () => void };

function serviceVehicle(vehicle: Car | Truck) {
  if ("sunroof" in vehicle) {
    // Car
  } else {
    // Truck | Car (Car may omit sunroof)
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

</details>

<details>
<summary>`instanceof` narrowing</summary>

**Definition:** `value instanceof Ctor` narrows to that constructor's instance type using the prototype chain at runtime.

**How it works:**
- Works with classes and constructor functions (`Date`, `Error`, custom classes).
- Interfaces and type aliases are erased — `instanceof User` is a compile error if `User` is only a type.
- `Symbol.hasInstance` with a type predicate can customize what `instanceof` narrows to.

**When to use:** Values you constructed with `new`, or built-ins with constructors. Use `in` / predicates / discriminants for plain objects.

**Examples:**

```typescript
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString());
  } else {
    console.log(x.toUpperCase());
  }
}

interface User { name: string }
// Error: 'User' only refers to a type, but is being used as a value.
// if (obj instanceof User) { ... }
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

</details>

---

## Custom guards

<details>
<summary>Type predicates</summary>

**Definition:** A user-defined type guard is a function whose return type is `arg is SomeType`.

**How it works:**
- On `true`, the argument is narrowed to `SomeType` at the call site.
- On `false`, that type is excluded from the remaining union.
- The body is *not* checked against the predicate — a wrong `return true` will lie to the type checker.

**When to use:** When built-in guards are not enough (`Array.isArray` style helpers, validating API payloads). Keep the runtime check honest.

**Examples:**

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) pet.swim();
  else pet.fly();
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

</details>

<details>
<summary>Assertion functions</summary>

**Definition:** A function with return type `asserts condition` or `asserts val is Type` narrows by throwing if the check fails.

**How it works:**
- `asserts condition` — if the function returns, `condition` is `true` for the rest of the scope.
- `asserts val is Type` — after return, `val` has that type (error-throwing type guard).
- Works with generics, e.g. `asserts val is NonNullable<T>`.

**When to use:** Preconditions at function entry when failure should abort. Prefer `if` + predicates when both branches need to continue.

**Examples:**

```typescript
function assert(condition: unknown, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg ?? "Assertion Failed");
  }
}

function assertIsNumber(val: unknown): asserts val is number {
  if (typeof val !== "number") {
    throw new Error("Not a number!");
  }
}

function assertNonNull<T>(val: T): asserts val is NonNullable<T> {
  if (val == null) {
    throw new Error("Value cannot be null or undefined");
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

</details>

---

## Control flow

<details>
<summary>Assignment narrowing</summary>

**Definition:** Assigning a more specific value narrows a variable's *observed* type until the next assignment.

**How it works:**
- *Declared type* is the annotation (what you may assign later).
- *Observed type* is the narrowed type after the latest assignment.
- You still cannot assign a value outside the declared type.

**When to use:** `let` variables that start as a union and get a concrete value. `const` is already the assigned literal/type.

**Examples:**

```typescript
let data: string | number = Math.random() < 0.5 ? 42 : "hello";

data = 100;
console.log(data.toFixed(2));

data = "goodbye";
console.log(data.toUpperCase());

// Error: boolean is not assignable to string | number
// data = true;
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

</details>

<details>
<summary>Control flow analysis</summary>

**Definition:** TypeScript tracks how `if`, `return`, `throw`, `break`, and loops change types on each path, then re-merges them when paths join.

**How it works:**
- An early `return`/`throw` removes that variant from the rest of the function — no `else` required.
- Assignments inside branches split the type; after the `if`/`else`, remaining possibilities are unioned.
- Reachability matters: code after a never-returning call is unreachable.

**When to use:** Guard clauses and multi-branch functions. Do not assume a type stays narrowed after a callback that might assign later (closures can reset analysis).

**Examples:**

```typescript
function process(input: string | number) {
  if (typeof input === "number") {
    return input * 2;
  }
  return input.toUpperCase();
}

function getStatus() {
  let result: string | number | boolean = true;

  if (Math.random() < 0.5) {
    result = "Success";
  } else {
    result = 500;
  }

  return result; // string | number — boolean is gone
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

</details>

---

## Unions

<details>
<summary>Discriminated unions</summary>

**Definition:** A union of object types that share a literal discriminant field (`kind`, `type`) so checks on that field narrow the whole object.

**How it works:**
- Each variant has the same key with a different string/number/boolean literal.
- `if (shape.kind === "circle")` makes other fields (`radius`) available.
- Optional fields on one shared interface do **not** work the same way — TypeScript will not prove `radius` exists from `kind`.

**When to use:** Closed sets of variants you own (events, AST nodes, results). Prefer this over a bag of optional properties.

**Examples:**

```typescript
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

</details>

<details>
<summary>`never` and exhaustiveness</summary>

**Definition:** `never` is the type of values that never occur — remaining union members after every variant is handled, or a function that always throws / loops.

**How it works:**
- Only `never` is assignable to `never`.
- In a `switch` `default`, assign the value to `const _exhaustive: never = shape`.
- Adding a new union member makes that assignment fail until you add a `case`.

**When to use:** Discriminated unions you expect to stay exhaustive. Pair with `default` in `switch` so new variants are a compile error.

**Examples:**

```typescript
interface Circle { kind: "circle"; radius: number }
interface Square { kind: "square"; sideLength: number }

type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default: {
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
    }
  }
}
```

**Thoughts:** Same idea as an exhaustive `switch` over a TypeScript union in application code: unhandled variants should fail at compile time, not silently at runtime.

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

</details>
