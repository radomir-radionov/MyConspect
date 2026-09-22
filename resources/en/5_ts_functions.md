# TypeScript — Functions

Call signatures, overloads, and this typing.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — Basics](./5_ts_core.md) · [TypeScript — Narrowing](./5_ts_narrowing.md) · [TypeScript — Functions](./5_ts_functions.md) · [TypeScript — Objects](./5_ts_objects.md) · [TypeScript — Generics](./5_ts_generics.md) · [TypeScript — Reference](./5_ts_reference.md) · [TypeScript — Interview](./5_ts_interview.md)

### Sections

- [Functions](#functions)

---

## Functions

<details>
  <summary>Function types</summary>

### Function Type Expressions

**Definition:**

Inline function types: `(a: string, b: number) => boolean`.

| When to use | Notes |
|-------------|-------|
| Use for callbacks and variables holding functions. Includes param names (optional but documented). | The parameter name is **required** in the syntax. `(string) => void` does NOT mean "takes a string" — it means "takes a parameter literally named `string` of type `any`". Always write the name: `(s: s |

**Examples:**

```typescript
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);

// Named alias
type GreetFunction = (a: string) => void;
function greeter2(fn: GreetFunction) { /* ... */ }
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Call Signatures

**Definition:**

Describe callable objects that also have properties — functions with extra fields.

| When to use | Notes |
|-------------|-------|
| `` type Desc = { (x: number): boolean; description: string } `` — callable + metadata. | Call signatures use `:` before the return type, not `=>`. `(arg: number): boolean` inside `{ }`, not `(arg: number) => boolean`. |

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

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Construct Signatures

**Definition:**

Describe something callable with `new`: `new (x: number) => SomeClass`.

| When to use | Notes |
|-------------|-------|
| Type factory patterns and constructor interfaces for DI. | Some values work both ways (`Date` can be called with or without `new`). You can combine call and construct signatures on the same type. |

**Examples:**

```typescript
type SomeConstructor = {
  new (s: string): SomeObject;
};

function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}

// Callable AND constructable
interface CallOrConstruct {
  (n?: number): string;
  new (s: string): Date;
}

fn(Date); // Date works both ways
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Generic Functions

**Definition:**

Functions with type parameters linking input and output types.

| When to use | Notes |
|-------------|-------|
| `` function first<T>(arr: T[]): T `` — preserves element type. Add constraints: `` T extends { length: number } ``. | TypeScript infers type parameters automatically in most calls. Don't over-genericize — extra type params hurt inference and readability. |

**Examples:**

```typescript
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}

const s = firstElement(["a", "b", "c"]); // string
const n = firstElement([1, 2, 3]);       // number
const u = firstElement([]);              // undefined
```

```typescript
function map<Input, Output>(
  arr: Input[],
  func: (arg: Input) => Output
): Output[] {
  return arr.map(func);
}

const parsed = map(["1", "2", "3"], (n) => parseInt(n));
// Input: string, Output: number → number[]
```

```typescript
function longest<Type extends { length: number }>(a: Type, b: Type) {
  return a.length >= b.length ? a : b;
}

longest([1, 2], [1, 2, 3]);     // number[]
longest("alice", "bob");        // string
// longest(10, 100);            // Error — number has no .length
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Guidelines for good generics

**Definition:**

Guidelines for good generics — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | Guidelines for good generics — TypeScript language or compiler feature.

* **Push type params down** — prefer `arr: Type |

* **Push type params down** — prefer `arr: Type[]` over `arr: Type extends any[]` (better inference on return type)
* **Use fewer type parameters** — each param should relate two or more values
* **Type param should appear twice** — if it only appears once, you probably don't need it (`greet<Str extends string>(s: Str)` → just use `string`)

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Pitfall: constrained return type

**Definition:**

A function promising to return `Type` can't return a generic `{ length: number }` — callers expect the same subtype they passed in.

| Aspect | Detail |
|--------|--------|
| Summary | A function promising to return `Type` can't return a generic `{ length: number }` — callers expect the same subtype they |

A function promising to return `Type` can't return a generic `{ length: number }` — callers expect the same subtype they passed in.

**Examples:**

```typescript
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) return obj;
  return { length: minimum }; // Error — not assignable to Type
}
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Optional Parameters

**Definition:**

Function params that may be omitted, marked with `?` or given defaults.

| When to use | Notes |
|-------------|-------|
| `` function f(a: string, b?: number) `` or `` b = 0 ``. Optional params must come after required ones. | Callers can always pass `undefined` explicitly — it simulates a missing argument. `f()`, `f(10)`, and `f(undefined)` are all valid. |

**Examples:**

```typescript
function f(x?: number) {
  // x is number | undefined
}
f();      // OK
f(10);    // OK
f(undefined); // OK

function g(x = 10) {
  // x is number — undefined replaced with 10
}
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Pitfall: optional params in callbacks

**Definition:**

myForEach([1, 2, 3], (a, i) => {

console.log(i.toFixed()); // Error: i possibly undefined
});

`callback: (arg: an |

`callback: (arg: any, index?: number) => void` means the **caller** might invoke with one arg — so `index` is `number | undefined` in your callback. For "callback may omit index," use a rest union or overload instead.

**How it works:** Never mark a callback param optional unless you intend to call without that argument.

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed()); // Error: i possibly undefined
});
```

```typescript
// Wrong mental model — index? means caller might skip it
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i]); // legal — index might be undefined in callback
  }
}

myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed()); // Error: i possibly undefined
});
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Practical examples — defaults, optional, rest, return types

**Definition:**

// Optional parameter

const greet = (name: string, age?: number) => `${name}${age ?? ""}`;
// createPassword('Jack'); // Error without optional age

| Aspect | Detail |
|--------|--------|
| Summary | // Optional parameter
const greet = (name: string, age?: number) => `${name}${age ?? ""}`;
// createPassword('Jack'); // |

**Examples:**

```typescript
// Default parameters
const createPassword = (name = "Max", age: number | string = 20) =>
  `${name}${age}`;

// Optional parameter
const greet = (name: string, age?: number) => `${name}${age ?? ""}`;
// createPassword('Jack'); // Error without optional age

// Rest parameters
const createSkills = (name: string, ...skills: string[]) =>
  `${name}, my skills are ${skills.join()}`;
createSkills("Jack", "JS", "TS", "React");

// Explicit return types
const sum = (a: number, b: number): number => a + b;
const createEmptyObject = (): object => ({});

// void — no return value (don't annotate the variable as void)
const greetUser = (): void => {
  alert("Hello!");
};

// never — throws or runs forever
const fail = (msg: string): never => {
  throw new Error(msg);
};
const infiniteLoop = (): never => {
  while (true) {}
};
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Function Overloads

**Definition:**

Multiple call signatures for one function name with different param/return types.

| When to use | Notes |
|-------------|-------|
| Write overload signatures above, then one broad implementation. TS picks the matching overload at the call site. | The implementation signature is **invisible** to callers — you can't call it directly. It must be compatible with all overloads. Prefer **union parameter types** over overloads when arg count and retu |

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

const d1 = makeDate(12345678);  // OK — 1 arg
const d2 = makeDate(5, 5, 5);   // OK — 3 args
// const d3 = makeDate(1, 3);   // Error — no overload for 2 args
```

```typescript
// Different parameter types → different return types
function combine(a: string, b: string): string;
function combine(a: number, b: number): number;
function combine(a: string | number, b: string | number): string | number {
  return a + b;
}

const r1 = combine("Hello", "World"); // string
const r2 = combine(5, 10);            // number

// Class method overloads — same pattern
class Logger {
  log(message: string): void;
  log(code: number): void;
  log(value: string | number): void {
    console.log(value);
  }
}

new Logger().log("Hello");
new Logger().log(404);
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Prefer unions over overloads when possible

**Definition:**

len("");  // OK

len([0]); // OK
// len(Math.random() > 0.5 ? "hello" : [0]); // Error — no matching overload

| Operator | Meaning |
|----------|----------|
| `A \| B` | One of A or B |
| `A & B` | Must satisfy both |

**Examples:**

```typescript
// Overloads — fails on union input
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) { return x.length; }

len("");  // OK
len([0]); // OK
// len(Math.random() > 0.5 ? "hello" : [0]); // Error — no matching overload

// Union — works with union input
function len2(x: string | any[]) {
  return x.length;
}
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Declaring `this` in a Function

**Definition:**

Explicit `this` parameter type on functions that use `this` in a specific way.

| When to use | Notes |
|-------------|-------|
| `` function fn(this: HTMLElement, e: Event) `` — first param is `this`; not passed at call site. | Arrow functions **cannot** declare `this` — they lexically capture outer `this`. Use `function` syntax when `this` typing matters. |

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
  return this.admin; // OK — this is User
});

// Arrow function — captures outer/global this, not User
// db.filterUsers(() => this.admin); // Error
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `void`, `object`, `unknown`, `never`, and `Function`

**Definition:**

Common types for functions and values: no return, non-primitive, safe top, impossible, and avoid `Function`.

| When to use | Notes |
|-------------|-------|
| `void` for no return; `unknown` for inputs; `never` for throws; `object` for non-primitives; never use `Function` type. | `void` ≠ `undefined`. `void` means "return value ignored." `unknown` is safe `any` — must narrow before use. Never use global `Function` type — it returns `any`. |

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `void` — no meaningful return

**Definition:**

// void ≠ undefined at the type level

// A function returning undefined is not the same as void in all contexts
 |

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // void ≠ undefined at the type level
// A function returning undefined is not the same as void in all contexts
```

```typescript
function noop(): void {
  return; // OK
}

// void ≠ undefined at the type level
// A function returning undefined is not the same as void in all contexts
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `object` — any non-primitive

**Definition:**

// object | null — rejects primitives

const create = (o: object | null): void => {};
// create(1);      // Error
// create("42");   // Error
create({ obj: 1 }); // OK

| Aspect | Detail |
|--------|--------|
| Summary | // object \| null — rejects primitives
const create = (o: object \| null): void => {};
// create(1);      // Error
// cr |

**Examples:**

```typescript
function logObj(val: object) { /* ... */ }

// object | null — rejects primitives
const create = (o: object | null): void => {};
// create(1);      // Error
// create("42");   // Error
create({ obj: 1 }); // OK

// Functions are objects in JS — function types count as object
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `unknown` — safe any

**Definition:**

processValue("hello"); // "HELLO"

processValue(10);      // "Unknown value"
 |

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | processValue("hello"); // "HELLO"
processValue(10);      // "Unknown value"
```

```typescript
function f1(a: any) {
  a.b(); // OK — no checking
}

function f2(a: unknown) {
  // a.b(); // Error — must narrow first
  if (typeof a === "object" && a !== null && "b" in a) {
    (a as { b: () => void }).b();
  }
}

function safeParse(s: string): unknown {
  return JSON.parse(s);
}

function processValue(value: unknown): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return "Unknown value";
}

processValue("hello"); // "HELLO"
processValue(10);      // "Unknown value"
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `never` — never returns

**Definition:**

Type for values that never occur — functions that throw, infinite loops, or exhaustiveness checks.

| Aspect | Detail |
|--------|--------|
| Summary | Type for values that never occur — functions that throw, infinite loops, or exhaustiveness checks. |

**Examples:**

```typescript
function fail(msg: string): never {
  throw new Error(msg);
}

const infiniteLoop = (): never => {
  while (true) {}
};

function fn(x: string | number) {
  if (typeof x === "string") { /* ... */ }
  else if (typeof x === "number") { /* ... */ }
  else {
    const _exhaustive: never = x; // x is never here
  }
}
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `Function` — avoid it

**Definition:**

// Prefer:

type VoidFunc = () => void; // when you won't call it
type SpecificFunc = (a: number, b: string) => boolean;
typescript
function doSomething(f: Function) {
  return f(1, 2, 3); // returns any — unsafe
}

// Prefer:
type VoidFunc = () => void; // when you won't call it
type SpecificFunc = (a: number, b: string) => boolean;
```

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // Prefer:
type VoidFunc = () => void; // when you won't call it
type SpecificFunc = (a: number, b: string) => boolean;
 |

```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Rest Parameters and Arguments

**Definition:**

Collect remaining args into a tuple/array: `...rest: number[]`.

| When to use | Notes |
|-------------|-------|
| `` function sum(...nums: number[]) ``. Tuple rest: `...args: [string, number, ...boolean[]]`. | `const args = [8, 5]` infers `number[]`, not a 2-tuple — spread into `Math.atan2` fails. Fix with `as const` for a fixed-length tuple. |

**Examples:**

```typescript
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}

const a = multiply(10, 1, 2, 3, 4); // [10, 20, 30, 40]
```

```typescript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2);

// Pitfall — inferred as number[], not tuple
const args = [8, 5];
// Math.atan2(...args); // Error

// Fix
const args2 = [8, 5] as const;
Math.atan2(...args2); // OK
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Parameter Destructuring

**Definition:**

Typing unpacked object/ array parameters in the function signature.

| When to use | Notes |
|-------------|-------|
| `` function f({ x, y }: { x: number; y: number }) `` — inline or named type for the destructured shape. | Inline `{ a, b, c }: { a: number; b: number; c: number }` gets verbose fast — extract a named type or interface for reuse. |

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
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Function Assignability

**Definition:**

Rules for when one function type can be assigned to another (params contravariant, returns covariant with strict).

| When to use | Notes |
|-------------|-------|
| `() => void` accepts functions that return anything (return discarded). Enable `strictFunctionTypes` for sounder param checking. | `() => void` accepts implementations that return *anything* — the return value is discarded. This is why `forEach` callbacks can return values even though the type says `void`. But a **literal** `func |

**Examples:**

```typescript
type VoidFunc = () => void;

const f1: VoidFunc = () => { return true; };  // OK — return ignored
const f2: VoidFunc = () => true;               // OK
const f3: VoidFunc = function () { return true; }; // OK

const v1 = f1(); // v1 is void

// Why this matters:
const src = [1, 2, 3];
const dst = [0];
src.forEach((el) => dst.push(el)); // push returns number, forEach expects void — OK
```

```typescript
function f2(): void {
  return true; // Error in explicit void function body
}

const f3 = function (): void {
  return true; // Error
};
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

</details>

<a name="object-types"></a>
