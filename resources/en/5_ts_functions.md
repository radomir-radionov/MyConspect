# TypeScript — Functions

Function types, parameters, generics, and overloads — from the [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html).

[← Back to hub](./5_ts.md)

### Related docs

[TypeScript — hub](./5_ts.md) · [Types](./5_ts_types.md) · [Narrowing](./5_ts_narrowing.md) · [Object Types](./5_ts_objects.md) · [Interview](./5_ts_interview.md)

### Main concepts

| Topic                                                           | Covers                                           |
| --------------------------------------------------------------- | ------------------------------------------------ |
| [Function Type Expressions](#function-type-expressions)         | `(a: string) => void` and type aliases           |
| [Call Signatures](#call-signatures)                             | Callable objects with extra properties           |
| [Construct Signatures](#construct-signatures)                   | `new (...)` constructor types                    |
| [Generic Functions](#generic-functions)                         | Type parameters linking inputs and outputs       |
| [Optional Parameters](#optional-parameters)                     | `?`, defaults, callback pitfalls                 |
| [Function Overloads](#function-overloads)                       | Multiple call signatures, one implementation     |
| [Declaring `this` in a Function](#declaring-this-in-a-function) | Explicit `this` parameter type                   |
| [Other types to know about](#other-types-to-know-about)         | `void`, `object`, `unknown`, `never`, `Function` |
| [Rest Parameters and Arguments](#rest-parameters-and-arguments) | `...rest` and spread                             |
| [Parameter Destructuring](#parameter-destructuring)             | Typed object parameters                          |

### Sections

- [Function Type Expressions](#function-type-expressions)
- [Call Signatures](#call-signatures)
- [Construct Signatures](#construct-signatures)
- [Generic Functions](#generic-functions)
- [Optional Parameters](#optional-parameters)
- [Function Overloads](#function-overloads)
- [Declaring `this` in a Function](#declaring-this-in-a-function)
- [Other types to know about](#other-types-to-know-about)
- [Rest Parameters and Arguments](#rest-parameters-and-arguments)
- [Parameter Destructuring](#parameter-destructuring)

---

## Function Type Expressions

<details>
<summary>Function Type Expressions</summary>

**Definition:** The simplest way to describe a function type — syntax like an arrow function: `(param: Type) => ReturnType`.

**How it works:**

- `(a: string) => void` — one `string` param, no meaningful return.
- Omitted parameter types default to `any` (avoid).
- The **parameter name is required**: `(string) => void` means a parameter literally named `string` of type `any`, not “takes a string”.
- Name the type with a type alias when reused: `type Greet = (name: string) => void`.

**Examples:**

```typescript
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);

type GreetFunction = (a: string) => void;
```

**Sources:** [TypeScript handbook — Function Type Expressions](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions)

</details>

---

## Call Signatures

<details>
<summary>Call Signatures</summary>

**Definition:** An object type that describes something **callable** and may also have properties — used when a function has metadata attached.

**How it works:**

- Use `:` before the return type inside `{ }`, not `=>`.
- Properties sit alongside the call signature in the same object type.

**Examples:**

```typescript
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}

function myFunc(someArg: number) {
  return someArg > 3;
}
myFunc.description = "default description";
doSomething(myFunc);
```

**Sources:** [TypeScript handbook — Call Signatures](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures)

</details>

---

## Construct Signatures

<details>
<summary>Construct Signatures</summary>

**Definition:** Describes a value callable with `new` — a constructor that returns an instance type.

**How it works:**

- Prefix the call signature with `new`: `new (s: string) => SomeObject`.
- Some values support both call and construct (`Date`) — combine both signatures on one type.

**Examples:**

```typescript
type SomeConstructor = {
  new (s: string): SomeObject;
};

function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}

interface CallOrConstruct {
  (n?: number): string;
  new (s: string): Date;
}

fn(Date); // Date works both ways
```

**Sources:** [TypeScript handbook — Construct Signatures](https://www.typescriptlang.org/docs/handbook/2/functions.html#construct-signatures)

</details>

---

## Generic Functions

<details>
<summary>Generic Functions</summary>

**Definition:** Functions with **type parameters** that relate input types to output types — e.g. `firstElement<Type>(arr: Type[]): Type | undefined`.

**How it works:**

- TypeScript usually **infers** type arguments at the call site — you rarely write them explicitly.
- **Constraints** (`Type extends { length: number }`) limit what type args are allowed.
- A function returning `Type` cannot return a different subtype of the constraint — callers expect the same shape they passed in.
- **Guidelines:** prefer `arr: Type[]` over `arr: Type extends any[]` for inference; use few type parameters; a type param should relate two or more values (appear twice).

**When to use:** When the return type should follow the argument type (`map`, `first`, `identity`). Do not add generics that only appear once.

**Examples:**

```typescript
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}

const s = firstElement(["a", "b", "c"]); // string
const n = firstElement([1, 2, 3]); // number

function map<Input, Output>(
  arr: Input[],
  func: (arg: Input) => Output,
): Output[] {
  return arr.map(func);
}

function longest<Type extends { length: number }>(a: Type, b: Type) {
  return a.length >= b.length ? a : b;
}

// Error — cannot return a fresh object as Type
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number,
): Type {
  if (obj.length >= minimum) return obj;
  return { length: minimum }; // Error
}
```

**See also:** [Generics](./5_ts_type_manipulation.md#generics) — generic interfaces, classes, constraints, and defaults.

**Sources:** [TypeScript handbook — Generic Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html#generic-functions)

</details>

---

## Optional Parameters

<details>
<summary>Optional Parameters</summary>

**Definition:** Parameters that may be omitted — marked with `?` or a **default value**.

**How it works:**

- `x?: number` → type is `number | undefined` inside the function.
- `x = 10` → type is `number`; `undefined` is replaced by the default.
- Optional params must follow required ones.
- Callers may pass `undefined` explicitly — it simulates a missing argument.

**Pluses and minuses:**

| Approach                  | Note                                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| `?`                       | Param type includes `undefined`                                                                      |
| Default `= value`         | Param type is the default's type, not `undefined`                                                    |
| Optional in **callbacks** | `index?: number` means the **caller** might omit that arg — your callback sees `number \| undefined` |

**Examples:**

```typescript
function f(x?: number) {
  // x: number | undefined
}
f();
f(10);
f(undefined);

function g(x = 10) {
  // x: number
}

// Pitfall — optional callback param
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i]); // legal — index may be undefined in callback
  }
}

myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed()); // Error: i possibly undefined
});
```

**Sources:** [TypeScript handbook — Optional Parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters)

</details>

---

## Function Overloads

<details>
<summary>Function Overloads</summary>

**Definition:** Multiple **overload signatures** (call shapes) above a single **implementation** body — for functions callable with different argument counts or types.

**How it works:**

- Overload signatures are what callers see; the implementation signature is **not** callable directly.
- The implementation must be compatible with every overload.
- Prefer a **union parameter** when overloads share the same arity and return type — unions accept union inputs; overloads do not.

**When to use:** Distinct call patterns like `makeDate(timestamp)` vs `makeDate(m, d, y)`. Avoid overloads that differ only in trailing optional params — use optionals instead.

**Examples:**

```typescript
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  }
  return new Date(mOrTimestamp);
}

const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
// makeDate(1, 3); // Error — no overload for 2 args

// Prefer union when possible
function len(x: string | any[]) {
  return x.length;
}
// len(Math.random() > 0.5 ? "hello" : [0]); // OK with union
```

**Sources:** [TypeScript handbook — Function Overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads)

</details>

---

## Declaring `this` in a Function

<details>
<summary>Declaring `this` in a Function</summary>

**Definition:** A fake first parameter `this: SomeType` declares what `this` means inside a **function** body — it is not passed at the call site.

**How it works:**

- TypeScript infers `this` for methods on objects, but callback APIs often need an explicit `this` type.
- **Arrow functions cannot declare `this`** — they capture lexical `this` from the enclosing scope.

**Examples:**

```typescript
interface User {
  admin: boolean;
}

interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(function (this: User) {
  return this.admin;
});

// db.filterUsers(() => this.admin); // Error — arrow captures outer this
```

**Sources:** [TypeScript handbook — Declaring this in a Function](https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function)

</details>

---

## Other types to know about

<details>
<summary>Other types to know about</summary>

**Definition:** Return and value types that appear often when typing functions.

**How it works:**

| Type       | Role                                                                                                                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `void`     | No meaningful return — inferred when a function has no `return` value. **Not the same as `undefined`.** Contextual `() => void` accepts implementations that return anything (return is discarded). Literal `function f(): void { return true }` is an error. |
| `object`   | Any non-primitive value. Not `Object` (capital O). Function values are objects in JS.                                                                                                                                                                         |
| `unknown`  | Any value, but you must narrow before use — safer than `any` for inputs.                                                                                                                                                                                      |
| `never`    | No value — throws, infinite loop, or exhaustiveness branch.                                                                                                                                                                                                   |
| `Function` | Untyped callable returning `any` — **avoid**. Prefer `() => void` if you won't call it, or a specific signature.                                                                                                                                              |

**Examples:**

```typescript
type VoidFunc = () => void;
const f1: VoidFunc = () => true; // OK — return ignored

function processValue(value: unknown): string {
  if (typeof value === "string") return value.toUpperCase();
  return "Unknown";
}

function fail(msg: string): never {
  throw new Error(msg);
}

// Avoid
function doSomething(f: Function) {
  return f(1, 2, 3); // returns any
}
```

**Sources:** [TypeScript handbook — Other Types to Know About](https://www.typescriptlang.org/docs/handbook/2/functions.html#other-types-to-know-about)

</details>

---

## Rest Parameters and Arguments

<details>
<summary>Rest Parameters and Arguments</summary>

**Definition:** **Rest parameters** (`...nums: number[]`) collect unbounded trailing arguments; **spread** passes an iterable as individual arguments.

**How it works:**

- Rest param must be last; annotation is `T[]` or a tuple type.
- Spreading a plain `number[]` into a fixed-arity function may fail — use `as const` for a fixed-length tuple.

**Examples:**

```typescript
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
multiply(10, 1, 2, 3, 4); // [10, 20, 30, 40]

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2);

const args = [8, 5];
// Math.atan2(...args); // Error — number[], not a 2-tuple

const args2 = [8, 5] as const;
Math.atan2(...args2); // OK
```

**Sources:** [TypeScript handbook — Rest Parameters and Arguments](https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-parameters-and-arguments)

</details>

---

## Parameter Destructuring

<details>
<summary>Parameter Destructuring</summary>

**Definition:** Unpack object (or array) properties directly in the parameter list, with a type on the whole pattern.

**How it works:**

- Inline: `function sum({ a, b, c }: { a: number; b: number; c: number })`.
- Extract a named type or interface when the shape is reused.
- Works the same as JavaScript destructuring — only the outer value is the parameter.

**Examples:**

```typescript
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}

sum({ a: 10, b: 3, c: 9 });

type ABC = { a: number; b: number; c: number };
function sum2({ a, b, c }: ABC) {
  console.log(a + b + c);
}

// Explicit return type
const add = (a: number, b: number): number => a + b;
```

**Sources:** [TypeScript handbook — Parameter Destructuring](https://www.typescriptlang.org/docs/handbook/2/functions.html#parameter-destructuring)

</details>
