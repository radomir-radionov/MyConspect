# TypeScript — Narrowing

Control-flow analysis and type guards.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — Basics](./5_ts_core.md) · [TypeScript — Narrowing](./5_ts_narrowing.md) · [TypeScript — Functions](./5_ts_functions.md) · [TypeScript — Objects](./5_ts_objects.md) · [TypeScript — Generics](./5_ts_generics.md) · [TypeScript — Reference](./5_ts_reference.md) · [TypeScript — Interview](./5_ts_interview.md)

### Sections

- [Type narrowing](#type-narrowing)

---

## Type narrowing

<details>
  <summary>Narrowing techniques</summary>

### Why use it

**Definition:**

TypeScript analyzes runtime checks (`typeof`, `in`, etc.) to refine union types so you can safely call type-specific methods.

| When to use | Notes |
|-------------|-------|
| Any variable typed as a union | Required before accessing members not shared by all variants |

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

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Common ways to narrow

**Definition:**

Runtime checks that TypeScript understands to refine union types.

| Technique | Checks |
|-----------|--------|
| `typeof` | Primitives (`string`, `number`, `boolean`, `bigint`, `symbol`, `undefined`) |
| `in` | Property existence on object unions |
| `instanceof` | Class constructor |
| Type predicates | User-defined `x is Type` |
| Discriminated unions | Shared literal field (`kind`, `type`) |

**Examples:**

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) animal.swim();
  else animal.fly();
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### `typeof` Type Guards

**Definition:**

Narrow unions using JavaScript's `typeof` operator at runtime.

| Aspect | Detail |
|--------|--------|
| Summary | Narrow unions using JavaScript's `typeof` operator at runtime. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Supported types

**Definition:**

TypeScript recognizes the following `typeof` return values:

| Aspect | Detail |
|--------|--------|
| Summary | TypeScript recognizes the following `typeof` return values:

TypeScript recognizes the following `typeof` return values: |

TypeScript recognizes the following `typeof` return values:

* `"string"`
* `"number"`
* `"boolean"`
* `"symbol"`
* `"undefined"`
* `"object"`
* `"function"`

> ⚠️ **Note:** `typeof null` returns `"object"`. Use explicit null checks (`value === null`) instead of `typeof` to filter out null values.

**Examples:**

```typescript
function formatPrice(value: string | number | boolean) {
  if (typeof value === "string") {
    // 'value' is narrowed to string
    return `$${parseFloat(value).toFixed(2)}`;
  }

  if (typeof value === "number") {
    // 'value' is narrowed to number
    return `$${value.toFixed(2)}`;
  }

  // 'value' is automatically narrowed to boolean here
  return value ? "Paid" : "Free";
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Truthiness Narrowing

**Definition:**

Narrowing based on whether a value is truthy/falsy in `if (value)`.

| Aspect | Detail |
|--------|--------|
| Summary | Narrowing based on whether a value is truthy/falsy in `if (value)`. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Falsy values in JavaScript

**Definition:**

When evaluating truthiness, TypeScript looks for these specific values that coercion turns to `false`:

| Aspect | Detail |
|--------|--------|
| Summary | When evaluating truthiness, TypeScript looks for these specific values that coercion turns to `false`:

When evaluating  |

When evaluating truthiness, TypeScript looks for these specific values that coercion turns to `false`:

* `false`
* `0` and `0n` (BigInt zero)
* `""` (empty string)
* `null`
* `undefined`
* `NaN`

Anything else is considered truthy.

**Examples:**

```typescript
function printLength(str: string | null | undefined) {
  // 'str' can be string, null, or undefined here

  if (str) {
    // Both 'null' and 'undefined' are filtered out
    // TypeScript knows 'str' is strictly a string here
    console.log(`Length: ${str.length}`);
  } else {
    // 'str' is either null, undefined, or an empty string ""
    console.log("No valid string provided");
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Common pitfall: empty strings and zero

**Definition:**

Truthiness narrowing treats empty strings (`""`) and the number `0` as falsy. If those are valid inputs in your logic, truthiness narrowing alone might cause bugs.

| Aspect | Detail |
|--------|--------|
| Summary | Truthiness narrowing treats empty strings (`""`) and the number `0` as falsy. If those are valid inputs in your logic, t |

Truthiness narrowing treats empty strings (`""`) and the number `0` as falsy. If those are valid inputs in your logic, truthiness narrowing alone might cause bugs.

**Examples:**

```typescript
function checkCount(count: number | undefined) {
  if (count) {
    // Danger: If count is 0, this block is skipped!
    console.log(`Count is ${count}`);
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Equality Narrowing

**Definition:**

Narrowing when comparing with `===`, `!==`, `==`, `!=`.

| Aspect | Detail |
|--------|--------|
| Summary | Narrowing when comparing with `===`, `!==`, `==`, `!=`. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Strict vs loose equality

**Definition:**

`===` checks type and value; `==` coerces — `== null` filters both `null` and `undefined`.

| Aspect | Detail |
|--------|--------|
| Summary | `===` checks type and value; `==` coerces — `== null` filters both `null` and `undefined`.

* **Strict Equality (`===` / |

* **Strict Equality (`===` / `!==`):** Checks both value and type. It is the safest way to narrow specific literal values or types.
* **Loose Equality (`==` / `!=`):** Checks value only. In TypeScript, it is mostly used as a shortcut to check for both `null` and `undefined` at the same time.

**Examples:**

```typescript
function processInput(x: string | number, y: string | boolean) {
  if (x === y) {
    // TypeScript knows x and y must have the same type.
    // The only shared type between them is 'string'.
    console.log(x.toUpperCase());
    console.log(y.toUpperCase());
  } else {
    // x can be string | number, y can be string | boolean
    console.log("Types do not match");
  }
}
```

```typescript
function printValue(value: string | null | undefined) {
  if (value != null) {
    // 'value' is narrowed strictly to 'string'
    console.log(`The value is: ${value.trim()}`);
  } else {
    // 'value' is either null or undefined
    console.log("Value is missing");
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### `in` Operator Narrowing

**Definition:**

Narrow object unions by checking if a property exists: `"swim" in pet`.

| Aspect | Detail |
|--------|--------|
| Summary | Narrow object unions by checking if a property exists: `"swim" in pet`. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Handling optional properties

**Definition:**

If a property is marked as optional (`?`) in one of the types, the `in` operator will not completely filter out that type in the `else` branch. Both types will still be possible.

| Aspect | Detail |
|--------|--------|
| Summary | If a property is marked as optional (`?`) in one of the types, the `in` operator will not completely filter out that typ |

If a property is marked as optional (`?`) in one of the types, the `in` operator will not completely filter out that type in the `else` branch. Both types will still be possible.

**Examples:**

```typescript
type Car = { drive: () => void; sunroof?: boolean };
type Truck = { drive: () => void };

function serviceVehicle(vehicle: Car | Truck) {
  if ("sunroof" in vehicle) {
    // 'vehicle' is narrowed to Car
    console.log("Checking sunroof motor");
  } else {
    // 'vehicle' could still be a Truck OR a Car without a sunroof!
    // TypeScript does not narrow completely here.
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### `instanceof` Narrowing

**Definition:**

Narrow to a class type when value is an instance: `if (x instanceof Date)`.

| Aspect | Detail |
|--------|--------|
| Summary | Narrow to a class type when value is an instance: `if (x instanceof Date)`. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Important limitation

**Definition:**

The `instanceof` operator only works with values instantiated from classes or constructor functions. It **cannot** be used with plain TypeScript types or interfaces because interfaces do not exist at JavaScript runtime.

| Aspect | Detail |
|--------|--------|
| Summary | The `instanceof` operator only works with values instantiated from classes or constructor functions. It **cannot** be us |

The `instanceof` operator only works with values instantiated from classes or constructor functions. It **cannot** be used with plain TypeScript types or interfaces because interfaces do not exist at JavaScript runtime.

**Examples:**

```typescript
interface User { name: string }
// Error: 'User' only refers to a type, but is being used as a value here.
// if (obj instanceof User) { ... }
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Type Predicates

**Definition:**

Custom functions that return `arg is SomeType` to narrow types in the caller.

| Aspect | Detail |
|--------|--------|
| Summary | Custom functions that return `arg is SomeType` to narrow types in the caller. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Assertion Functions

**Definition:**

Functions that throw if a condition fails, narrowing types for the rest of the scope: `asserts condition`.

| Aspect | Detail |
|--------|--------|
| Summary | Functions that throw if a condition fails, narrowing types for the rest of the scope: `asserts condition`. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Type 1: condition assertions (`asserts condition`)

**Definition:**

This signature tells TypeScript that whatever boolean expression is passed into the function must evaluate to `true` if the function successfully returns.

| Aspect | Detail |
|--------|--------|
| Summary | This signature tells TypeScript that whatever boolean expression is passed into the function must evaluate to `true` if  |

This signature tells TypeScript that whatever boolean expression is passed into the function must evaluate to `true` if the function successfully returns.

**Examples:**

```typescript
function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg || "Assertion Failed");
  }
}

function processInput(val: string | number) {
  // val can be string | number
  assert(typeof val === "string");

  // TypeScript narrows 'val' to string for the rest of this scope
  console.log(val.toUpperCase());
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Type 2: type predicate assertions (`asserts val is Type`)

**Definition:**

This signature explicitly informs TypeScript that a specific argument will belong to a target type after the function runs. It behaves like a standard type guard but operates via runtime errors instead of `if` blocks.

| Aspect | Detail |
|--------|--------|
| Summary | This signature explicitly informs TypeScript that a specific argument will belong to a target type after the function ru |

This signature explicitly informs TypeScript that a specific argument will belong to a target type after the function runs. It behaves like a standard type guard but operates via runtime errors instead of `if` blocks.

**Examples:**

```typescript
function assertIsNumber(val: any): asserts val is number {
  if (typeof val !== "number") {
    throw new Error("Not a number!");
  }
}

function calculateTax(amount: any) {
  assertIsNumber(amount);

  // TypeScript confidently treats 'amount' as a number here
  return amount * 0.15;
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Advanced use case: generics

**Definition:**

Assertion signatures work seamlessly with generics to create reusable utility functions, like stripping away `null` and `undefined` types.

| Aspect | Detail |
|--------|--------|
| Summary | Assertion signatures work seamlessly with generics to create reusable utility functions, like stripping away `null` and  |

Assertion signatures work seamlessly with generics to create reusable utility functions, like stripping away `null` and `undefined` types.

**Examples:**

```typescript
function assertNonNull<T>(val: T): asserts val is NonNullable<T> {
  if (val === null || val === undefined) {
    throw new Error("Value cannot be null or undefined");
  }
}

function handleData(input: string | null) {
  assertNonNull(input);
  // 'input' is safely narrowed from 'string | null' to just 'string'
  console.log(input.trim());
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Assignment Narrowing

**Definition:**

TS narrows a variable when you assign a more specific value to it.

| Aspect | Detail |
|--------|--------|
| Summary | TS narrows a variable when you assign a more specific value to it. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Declared type vs observed type

**Definition:**

Declared type vs observed type — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | Declared type vs observed type — TypeScript language or compiler feature.

* **Declared Type:** The original union type  |

* **Declared Type:** The original union type the variable starts with (e.g. `string | number`). This dictates what values you are *allowed* to assign to it later.
* **Observed Type:** The specific, narrowed type TypeScript tracks at any given line based on the most recent assignment.

**Examples:**

```typescript
// Declared type is: string | number
let data: string | number = Math.random() < 0.5 ? 42 : "hello";

data = 100;
// Observed type is now: number
console.log(data.toFixed(2)); // Valid, number method works

data = "goodbye";
// Observed type is now: string
console.log(data.toUpperCase()); // Valid, string method works

data = true;
// ERROR: Type 'boolean' is not assignable to the declared type 'string | number'.
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Control Flow Analysis

**Definition:**

TS tracks how `if`, `return`, `throw`, and loops affect types in each code path.

| Aspect | Detail |
|--------|--------|
| Summary | TS tracks how `if`, `return`, `throw`, and loops affect types in each code path. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Early returns and unreachable code

**Definition:**

If a branch contains a `return`, `throw`, or `break`, TypeScript knows the code below it can only execute if that branch was skipped. It automatically narrows the remaining type for the rest of the block.

| Aspect | Detail |
|--------|--------|
| Summary | If a branch contains a `return`, `throw`, or `break`, TypeScript knows the code below it can only execute if that branch |

If a branch contains a `return`, `throw`, or `break`, TypeScript knows the code below it can only execute if that branch was skipped. It automatically narrows the remaining type for the rest of the block.

**Examples:**

```typescript
function process(input: string | number) {
  if (typeof input === "number") {
    return input * 2; // Exits early if true
  }

  // No 'else' needed!
  // TypeScript knows 'number' is impossible here.
  return input.toUpperCase(); // 'input' is strictly 'string'
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Splitting and merging types

**Definition:**

As your program runs through conditional branches, types split apart based on assignments and then re-merge when the paths come back together.

| Aspect | Detail |
|--------|--------|
| Summary | As your program runs through conditional branches, types split apart based on assignments and then re-merge when the pat |

As your program runs through conditional branches, types split apart based on assignments and then re-merge when the paths come back together.

**Examples:**

```typescript
function getStatus() {
  let result: string | number | boolean;

  result = true;
  // Type is currently: boolean

  if (Math.random() < 0.5) {
    result = "Success";
    // Inside this branch, type is: string
  } else {
    result = 500;
    // Inside this branch, type is: number
  }

  // The code paths merge back together here.
  // Type is now either string or number, but NO LONGER boolean!
  return result; // Type is: string | number
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Discriminated Unions

**Definition:**

A union of object types sharing a literal discriminant field (`kind`, `type`) for safe narrowing.

| Operator | Meaning |
|----------|----------|
| `A \| B` | One of A or B |
| `A & B` | Must satisfy both |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Why optional fields fail

**Definition:**

Grouping distinct properties into a single interface with optional fields (`?`) confuses the compiler. TypeScript cannot guarantee that `radius` is present just because you checked a `kind` field.

| Aspect | Detail |
|--------|--------|
| Summary | Grouping distinct properties into a single interface with optional fields (`?`) confuses the compiler. TypeScript cannot |

Grouping distinct properties into a single interface with optional fields (`?`) confuses the compiler. TypeScript cannot guarantee that `radius` is present just because you checked a `kind` field.

Splitting structures into explicit types makes fields mandatory exactly where they belong, preventing accidental runtime bugs.

**Examples:**

```typescript
interface Circle {
  kind: "circle";     // The discriminant
  radius: number;
}

interface Square {
  kind: "square";     // The discriminant
  sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    // 'shape' is automatically narrowed to Circle
    return Math.PI * shape.radius ** 2;
  } else {
    // 'shape' is automatically narrowed to Square
    return shape.sideLength ** 2;
  }
}
```

```typescript
function getAreaWithSwitch(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      // 'shape' is safely narrowed to Circle
      return Math.PI * shape.radius ** 2;

    case "square":
      // 'shape' is safely narrowed to Square
      return shape.sideLength ** 2;
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### The `never` Type and Exhaustiveness Checking

**Definition:**

`never` represents values that never occur — functions that throw, infinite loops, or impossible branches.

| Aspect | Detail |
|--------|--------|
| Summary | `never` represents values that never occur — functions that throw, infinite loops, or impossible branches. |

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### How exhaustiveness checking works

**Definition:**

No type can be assigned to `never` except `never` itself. You can exploit this rule in the `default` case of a `switch` statement. If you successfully handle every member of a union, the code path inside `default` is unreachable, meaning the variable safely resolves to `never`.

| Aspect | Detail |
|--------|--------|
| Summary | No type can be assigned to `never` except `never` itself. You can exploit this rule in the `default` case of a `switch`  |

No type can be assigned to `never` except `never` itself. You can exploit this rule in the `default` case of a `switch` statement. If you successfully handle every member of a union, the code path inside `default` is unreachable, meaning the variable safely resolves to `never`.

If a new type is added to the union later, the `default` branch becomes reachable for that new type. Because that new type cannot be assigned to `never`, TypeScript will throw a compile-time error, warning you to update your logic.

**Examples:**

```typescript
interface Circle { kind: "circle"; radius: number; }
interface Square { kind: "square"; sideLength: number; }

type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      // Valid: 'shape' is 'never' here because all options are handled
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

```typescript
interface Triangle { kind: "triangle"; sideLength: number; }

// Added Triangle to the union
type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      // ERROR: Type 'Triangle' is not assignable to type 'never'.
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

**Sources:** [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

</details>

<a name="functions"></a>
