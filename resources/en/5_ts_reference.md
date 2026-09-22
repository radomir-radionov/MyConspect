# TypeScript — Reference

Language reference and advanced topics.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — Basics](./5_ts_core.md) · [TypeScript — Narrowing](./5_ts_narrowing.md) · [TypeScript — Functions](./5_ts_functions.md) · [TypeScript — Objects](./5_ts_objects.md) · [TypeScript — Generics](./5_ts_generics.md) · [TypeScript — Reference](./5_ts_reference.md) · [TypeScript — Interview](./5_ts_interview.md)

### Sections

- [Language reference](#language-reference)
- [Advanced topics](#advanced-topics)

---

## Language reference

<details>
  <summary>Language reference</summary>

### Why TypeScript instead of JavaScript?

**Definition:**

JavaScript is dynamically typed — you only discover type mistakes at **runtime** (or never, if the bug path isn't hit). TypeScript is a **superset of JavaScript**: all valid JS is valid TS. It adds optional static types that are checked at **compile time**, then erased — the output is still plain JavaScript.

| Aspect | Detail |
|--------|--------|
| Summary | JavaScript is dynamically typed — you only discover type mistakes at **runtime** (or never, if the bug path isn't hit).  |

JavaScript is dynamically typed — you only discover type mistakes at **runtime** (or never, if the bug path isn't hit). TypeScript is a **superset of JavaScript**: all valid JS is valid TS. It adds optional static types that are checked at **compile time**, then erased — the output is still plain JavaScript.

**Use TypeScript when** you want fewer production bugs, safer refactors, better editor support, and clearer contracts between modules — especially on teams and in long-lived codebases.

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Quick list — core concepts

1. **Static type-checking** — catch errors before the code runs
2. **Non-exception failures** — TS flags bugs JS would silently allow
3. **Types for tooling** — autocomplete, quick fixes, refactorings, go-to-definition
4. **`tsc`** — the TypeScript compiler (type-check + emit JS)
5. **Emitting with errors** — JS still outputs by default; use `--noEmitOnError` to block it
6. **Explicit types** — annotate parameters and variables when inference isn't enough
7. **Erased types** — annotations vanish at compile time; zero runtime effect
8. **Downleveling** — TS rewrites modern JS to older targets (e.g. ES2015 → ES5)
9. **Strictness** — dial up checking with `strict`, `noImplicitAny`, `strictNullChecks`

### Error handling — static vs runtime

**Definition:**

1. **Static type checking** — mismatches, missing properties, unreachable code (`tsc` / IDE)

2. **Runtime `try/catch`** — network failures, parsing, unexpected runtime behavior
3. **Custom error classes** — structured errors with extra context
4. **Guard clauses & assertions** — narrow types (`if (!user) return`) or `as` (no runtime check)
5. **Strict mode** — `strict` in `tsconfig.json`

| Aspect | Detail |
|--------|--------|
| Summary | 1. **Static type checking** — mismatches, missing properties, unreachable code (`tsc` / IDE)
2. **Runtime `try/catch`**  |

1. **Static type checking** — mismatches, missing properties, unreachable code (`tsc` / IDE)
2. **Runtime `try/catch`** — network failures, parsing, unexpected runtime behavior
3. **Custom error classes** — structured errors with extra context
4. **Guard clauses & assertions** — narrow types (`if (!user) return`) or `as` (no runtime check)
5. **Strict mode** — `strict` in `tsconfig.json`

**Examples:**

```typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

function parseAge(input: string): number {
  const n = Number(input);
  if (Number.isNaN(n)) {
    throw new ValidationError("Invalid age", "age");
  }
  return n;
}
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Union (`|`) vs intersection (`&`) — quick ref

**Definition:**

Union (`|`) vs intersection (`&`) — quick ref — TypeScript language or compiler feature.

| Operator | Meaning |
|----------|----------|
| `A \| B` | One of A or B |
| `A & B` | Must satisfy both |

* **Union** — value is **one of** several types: `string | number` (either/or)
* **Intersection** — value must satisfy **all** types at once: `A & B` (combine shapes)
* `string & number` is impossible (no value is both)
* Extending interfaces ≈ intersection; `interface Admin extends User` vs `type Admin = User & { role: string }`

**Examples:**

```typescript
let id: number | string;
id = 10;    // OK
id = "42";  // OK
// id = true; // Error

type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged; // must have both name and age
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Quick list — all everyday types

1. **Primitives** — `string`, `number`, `boolean`
2. **Arrays** — `number[]`, `string[]`, `Array<T>`
3. **`any`** — the “I give up” type
4. **`unknown`** — safe top type; must narrow before use (see More on Functions)
5. **Type annotations** — explicit labels on variables
5. **Functions** — parameter types, return types, contextual typing
6. **Object types** — shapes with named properties
7. **Optional properties** — `?` on fields that might be missing
8. **Union types** — `A | B` — “could be this OR that”
9. **Type aliases** — `type Name = ...` — give a type a nickname
10. **Interfaces** — `interface Name { ... }` — object blueprints you can extend
11. **Type assertions** — `as SomeType` — “trust me, compiler”
12. **`satisfies`** — validate shape without widening inference (TS 4.9+)
13. **Literal types** — exact values like `"left"` or `42`
14. **`null` and `undefined`** — the absence types
15. **Enums** — named constant sets (runtime feature)
16. **Less common primitives** — `bigint`, `symbol`

### Quick list — function concepts

1. **Function type expressions** — `(a: string) => void`
2. **Call signatures** — callable objects with properties
3. **Construct signatures** — `new (...)` for constructors
4. **Generic functions** — type parameters linking input and output
5. **Optional parameters** — `?` and defaults
6. **Function overloads** — multiple call signatures, one implementation
7. **`this` types** — declare what `this` is inside a function
8. **`void`, `object`, `unknown`, `never`** — common function-related types
9. **Rest parameters** — `...args` for unbounded arguments
10. **Parameter destructuring** — unpack object args inline
11. **Assignability** — why `() => boolean` fits `() => void`

### Object Types

**Definition:**

In JavaScript, data is grouped and passed around as objects. TypeScript describes those shapes with **object types** — anonymous inline types, `interface`, or `type` alias.

| Aspect | Detail |
|--------|--------|
| Summary | In JavaScript, data is grouped and passed around as objects. TypeScript describes those shapes with **object types** — a |

In JavaScript, data is grouped and passed around as objects. TypeScript describes those shapes with **object types** — anonymous inline types, `interface`, or `type` alias.

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Quick list — object type concepts

1. **Defining object types** — inline `{ }`, `interface`, or `type`
2. **Optional properties** — `prop?: Type`
3. **`readonly` properties** — compile-time immutability on the property
4. **Index signatures** — `[key: string]: Type` for dynamic keys
5. **Excess property checks** — extra keys flagged on object literals
6. **Extending types** — `interface Child extends Parent`
7. **Intersection types** — `A & B` to combine object types
8. **Extension vs intersection** — conflict handling differs
9. **Generic object types** — `Box<Type>`, `Array<Type>`
10. **`ReadonlyArray`** — `readonly T[]` / `ReadonlyArray<T>`
11. **Tuple types** — fixed-length, typed positions `[string, number]`

### Quick list — OOP interview topics

1. **Access modifiers** — `public` (default), `private`, `protected`, `readonly`
2. **Parameter properties** — `constructor(public name: string)` auto-assigns `this.name`
3. **Inheritance** — `extends` + `super()`; override methods with compatible signatures
4. **`static`** — belongs to the constructor, not instances
5. **`abstract class`** — cannot instantiate; may have concrete + abstract methods
6. **`interface` + `implements`** — contract for class shape (no runtime emit)
7. **Abstract class vs interface** — see comparison below
8. **Structural typing** — TS checks shape, not nominal class names (except `private`/`protected` compatibility)

**OOP building blocks:** classes + interfaces, inheritance/polymorphism, access modifiers, abstract classes, generics on classes, decorators.

### Quick list — type manipulation tools

1. **Generics** — `Type<T>` — types that take type parameters
2. **`keyof`** — union of an object's keys
3. **`typeof`** — type of a value/variable (in type position)
4. **Indexed access** — `T["prop"]` — pick a property's type
5. **Conditional types** — `T extends U ? X : Y` — if/else for types
6. **`infer`** — extract types inside conditionals
7. **Mapped types** — `{ [K in keyof T]: ... }` — transform all properties
8. **Template literal types** — `` `prefix${T}` `` — string types from strings
9. **Intrinsic helpers** — `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`

### Quick list — reference topics

1. **Cheat Sheets** — printable quick-reference cards
2. **Decorators** — annotate/modify classes and members
3. **Declaration Merging** — same name → single merged definition
4. **Enums** — named numeric/string constants (TS-specific runtime feature)
5. **Iterators and Generators** — `Symbol.iterator`, `for..of`, generators
6. **JSX** — embed XML-like syntax in `.tsx` files
7. **Mixins** — compose classes from partial building blocks
8. **Namespaces** — organize code in global scope (legacy)
9. **Namespaces and Modules** — when to use which
10. **Symbols** — unique primitive keys and `unique symbol`
11. **Triple-Slash Directives** — compiler directives in comments
12. **Type Compatibility** — structural subtyping rules
13. **Type Inference** — how TS infers without annotations
14. **Variable Declaration** — `var` vs `let` vs `const`

### Cheat Sheets

**Definition:**

Printable condensed reference cards (types, syntax, config) from the official TypeScript docs.

| When to use | Notes |
|-------------|-------|
| Bookmark for interviews and desk reference — not a substitute for understanding; use alongside this handbook. | Not a language feature — a documentation artifact. The canonical index lives under Reference in the handbook; content may be PDF/image cards rather than prose pages. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### What to memorize

**Definition:**

What to memorize — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | What to memorize — TypeScript language or compiler feature.

* Primitive vs object types, union/intersection syntax
* `k |

* Primitive vs object types, union/intersection syntax
* `keyof`, `typeof`, `infer`, mapped/conditional types
* Common utility types (`Partial`, `Pick`, `Omit`, `Record`, `ReturnType`)
* Strict flags: `strict`, `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`
* Module resolution basics: `module`, `moduleResolution`, `paths`
* Classes: access modifiers, `abstract` vs `interface`, `implements`, `static`
* Type narrowing: `typeof`, `in`, `instanceof`, type predicates, discriminated unions
* `interface` vs `type` — when to use which
* `satisfies` vs `as` vs type annotation
* Map pattern for union → lookup tables
* Branded types for nominal-style IDs
* Advanced: `const` type params, `using`/`Disposable`, `override`, project references, publishing `.d.ts`
* Stricter flags: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`
---

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Decorators

**Definition:** Functions attached with `@` to classes, methods, properties, accessors, or parameters.

**How it works:**

| Framework | Examples |
|-----------|----------|
| **Angular** | `@Component`, `@Injectable` |
| **NestJS** | `@Controller`, `@Get`, `@Post` |
| **TypeORM** | `@Entity`, `@Column` |

Decorators wrap classes/members to add logging, validation, DI, or caching **without changing business logic**.

**When to use:** Enable per project (stage 2 `experimentalDecorators` or TS 5+ stage 3). Used heavily in NestJS, Angular, TypeORM.

**Thoughts:** The handbook documents **stage 2 (experimental)** decorators (`experimentalDecorators: true`). **TypeScript 5.0+** added **stage 3** decorators — different syntax and semantics; check which your project uses.

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Key concepts

**Definition:**

// Composition: factories evaluated top-to-bottom,

// decorator functions called bottom-to-top
@first()
@second()
method() {}
// Output: first(): factory → second(): factory → second(): called → first(): called

**How it works:**

class, method, property, accessor, parameter decorators.

| Decorator | Receives | Notes |
|-----------|----------|-------|
| **Class** | `constructor` | If it returns a value, replaces the class declaration |
| **Property** | `target` (prototype), `propertyKey` | Cannot use in `.d.ts` / ambient context |
| **Method** | `target`, `propertyKey`, `descriptor` | Can observe, modify, or replace method |
| **Accessor** | same as method | Applied to get/set `PropertyDescriptor` |
| **Parameter** | constructor or method params | Metadata only — limited runtime use |

See [Decorators in TypeScript 5.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#decorators) — no `experimentalDecorators` needed; aligns with ECMAScript standard.

[Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)

`instanceof` is a **type guard** for class instances (see Type Narrowing) — not a decorator. It narrows `unknown`/`union` to a specific class inside `if (x instanceof Foo)`.

**Examples:**

```typescript
// Decorator factory — returns the actual decorator
function color(value: string) {
  return function (target: object) {
    // use target and value
  };
}

// Composition: factories evaluated top-to-bottom,
// decorator functions called bottom-to-top
@first()
@second()
method() {}
// Output: first(): factory → second(): factory → second(): called → first(): called

// Evaluation order inside a class:
// 1. Instance member decorators (per member)
// 2. Static member decorators
// 3. Constructor parameter decorators
// 4. Class decorator
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Decorator examples — all four kinds

**Definition:**

// Property decorator — target is prototype, propertyKey is field name

const logProperty = (target: object, propertyKey: string | symbol) => {
  console.log(propertyKey); // "secret"
};

| Aspect | Detail |
|--------|--------|
| Summary | // Property decorator — target is prototype, propertyKey is field name
const logProperty = (target: object, propertyKey: |

**Examples:**

```typescript
// Class decorator — logs constructor; return value would replace class
const logClass = (constructor: Function) => {
  console.log(constructor); // class User {}
};

// Property decorator — target is prototype, propertyKey is field name
const logProperty = (target: object, propertyKey: string | symbol) => {
  console.log(propertyKey); // "secret"
};

// Method decorator — receives PropertyDescriptor
const logMethod = (
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  console.log(propertyKey); // "getPass"
};

// Accessor decorator — on get/set
const logSet = (
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  console.log(propertyKey); // "myAge"
};

@logClass
class User {
  @logProperty
  secret: number;

  constructor(public name: string, public age: number, secret: number) {
    this.secret = secret;
  }

  @logMethod
  getPass() {
    return `${this.name}${this.age}`;
  }

  @logSet
  set myAge(age: number) {
    this.age = age;
  }
}
```

```typescript
// Parameter decorator — metadata on constructor/method params (NestJS DI uses this pattern)
function logParameter(
  _target: object,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  console.log(`Param ${parameterIndex} of ${String(propertyKey)}`);
}

class Account {
  constructor(
    public name: string,
    @logParameter public balance: number,
  ) {}
}

// Class decorator that returns a constructor REPLACES the class declaration
function Timestamped<T extends new (...args: any[]) => object>(Base: T) {
  return class extends Base {
    createdAt = Date.now();
  };
}

@Timestamped
class User {
  constructor(public name: string) {}
}

const u = new User("Alice");
// u.name + u.createdAt — subclass instance, not plain User
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Decorator examples — interview patterns

**Definition:**

// Method decorator — receives PropertyDescriptor

const logMethod = (
  _target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  const original = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    console.log(`Calling ${String(propertyKey)}`);
    return original.apply(this, args);
  };
};

| Aspect | Detail |
|--------|--------|
| Summary | // Method decorator — receives PropertyDescriptor
const logMethod = (
  _target: object,
  propertyKey: string \| symbol |

**Examples:**

```typescript
// Class decorator — receives constructor
const logClass = (constructor: Function) => {
  console.log(constructor.name);
};

// Method decorator — receives PropertyDescriptor
const logMethod = (
  _target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  const original = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    console.log(`Calling ${String(propertyKey)}`);
    return original.apply(this, args);
  };
};

// Decorator factory — factory runs first (top-to-bottom), decorators bottom-to-top
const enumerable = (value: boolean) => (
  _target: object,
  _key: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  descriptor.enumerable = value;
};

@logClass
class User {
  constructor(public name: string) {}

  @logMethod
  @enumerable(false)
  getPass() {
    return this.name;
  }
}
// Factory order: logMethod factory → enumerable factory → enumerable called → logMethod called
```

```typescript
// AOP logging decorator — frameworks like NestJS use similar patterns
function Log(
  _target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const original = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    console.log(`Call: ${propertyKey}(${args.join(", ")})`);
    return original.apply(this, args);
  };
}

class Service {
  @Log
  getData(id: number) {
    return { id, name: "Test" };
  }
}

new Service().getData(42); // Console: Call: getData(42)
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Decorator composition — exact execution order

**Definition:**

Decorator composition — exact execution order — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | Decorator composition — exact execution order — TypeScript language or compiler feature. |

---

**Examples:**

```typescript
const first = () => {
  console.log("first() completing");
  return () => console.log("first() called");
};
const second = () => {
  console.log("second() completing");
  return () => console.log("second() called");
};

class User {
  @first()
  @second()
  getPass() {
    return "pass";
  }
}
// Console output:
// "first() completing"   ← factory 1 evaluated (top to bottom)
// "second() completing"  ← factory 2 evaluated
// "second() called"      ← decorator 2 applied (bottom to top)
// "first() called"       ← decorator 1 applied
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Declaration Merging

**Definition:** Multiple declarations with the same `interface` name merge into one type.

**When to use:** Augment globals (`interface Window { myApp: App }`) or library types. Only works with `interface`, not `type`.

**Thoughts:**

Declarations create entities in three groups — **namespace**, **type**, and **value**. What merges depends on declaration kind:

| Declaration | Namespace | Type | Value |
|-------------|-----------|------|-------|
| Namespace   | ✓         | ✓    | ✓     |
| Class       | ✓         | ✓    | ✓     |
| Enum        | ✓         | ✓    | ✓     |
| Interface   |           | ✓    |       |
| Type Alias  |           | ✓    |       |
| Function    |           |      | ✓     |
| Variable    |           |      | ✓     |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Interface merging

**Definition:**

// Function members → overloads (later interfaces win ordering for overload sets)

interface Cloner { clone(animal: Animal): Animal; }
interface Cloner { clone(animal: Sheep): Sheep; }
typescript
interface Box { height: number; width: number; }
interface Box { scale: number; }

let box: Box = { height: 5, width: 6, scale: 10 };

// Function members → overloads (later interfaces win ordering for overload sets)
interface Cloner { clone(animal: Animal): Animal; }
interface Cloner { clone(animal: Sheep): Sheep; }
```

Non-function members with the same name must have the **same type** or the compiler errors.

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // Function members → overloads (later interfaces win ordering for overload sets)
interface Cloner { clone(animal: Anima |

```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Namespace + class/function/enum merging

**Definition:**

// Function with static properties

function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}
namespace buildLabel {
  export let suffix = "";
  export let prefix = "Hello, ";
}
typescript
// Inner class pattern
class Album {
  label: Album.AlbumLabel;
}
namespace Album {
  export class AlbumLabel {}
}

// Function with static properties
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}
namespace buildLabel {
  export let suffix = "";
  export let prefix = "Hello, ";
}
typescript
// map.ts
import { Observable } from "./observable";
declare module "./observable" {
  interface Observable<T> {
    map<U>(f: (x: T) => U): Observable<U>;
  }
}
Observable.prototype.map = function (f) { /* ... */ };
```

Limitations: can't add new top-level declarations; can't augment default exports.
---

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // Function with static properties
function buildLabel(name: string): string {
  return buildLabel.prefix + name + build |

```

```

**Module augmentation** — patch existing modules (not merge JS modules natively):

```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Enums

**Definition:**

Named constants that compile to a real JavaScript object (numeric or string members).

| When to use | Notes |
|-------------|-------|
| `enum Color { Red, Green }` then `Color.Red`. Numeric enums support reverse lookup; string enums don't. See Everyday Types → Enums for React/`as const` alternatives. | Modern code often prefers `as const` objects over enums to stay closer to plain JS. Numeric enums get **reverse mappings** (`Enum[0] === "A"`); string enums do not. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Numeric enums

**Definition:**

// Without initializer: Up = 0, Down = 1, ...

enum Dir { Up, Down, Left, Right }
 |

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // Without initializer: Up = 0, Down = 1, ...
enum Dir { Up, Down, Left, Right }
```

```typescript
enum Direction {
  Up = 1,
  Down,   // 2 — auto-increment
  Left,   // 3
  Right,  // 4
}

// Without initializer: Up = 0, Down = 1, ...
enum Dir { Up, Down, Left, Right }
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### String enums

**Definition:**

Serialize/debug better than opaque numeric values. No auto-increment.

| Aspect | Detail |
|--------|--------|
| Summary | Serialize/debug better than opaque numeric values. No auto-increment. |

Serialize/debug better than opaque numeric values. No auto-increment.

**Examples:**

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Union enums & const enums

**Definition:**

// const enum — inlined at compile time, no runtime object

const enum Direction { Up, Down, Left, Right }
let dirs = [Direction.Up, Direction.Down]; // → [0, 1] in JS

| Operator | Meaning |
|----------|----------|
| `A \| B` | One of A or B |
| `A & B` | Must satisfy both |

**How it works:**

use `keyof typeof MyEnum`, not `keyof MyEnum`.

---

**Examples:**

```typescript
// Literal enum members → enum members become types too
enum ShapeKind { Circle, Square }
interface Circle { kind: ShapeKind.Circle; radius: number; }

// const enum — inlined at compile time, no runtime object
const enum Direction { Up, Down, Left, Right }
let dirs = [Direction.Up, Direction.Down]; // → [0, 1] in JS

// Pitfall: ambient const enums in .d.ts break isolatedModules consumers
```

```typescript
const ODirection = { Up: 0, Down: 1, Left: 2, Right: 3 } as const;
type Direction = typeof ODirection[keyof typeof ODirection];
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Iterators and Generators

**Definition:**

`Symbol.iterator` enables `for..of`; `function*` yields lazy sequences.

| When to use | Notes |
|-------------|-------|
| Type generator return as `Generator<Yield, Return, Next>`. Iterable types work with `for..of` and spread. | `for..in` iterates **keys** (often array indices as strings); `for..of` iterates **values** via the iterator protocol. On `Set`, `for..in` only sees non-iterator properties like `"species"`, not eleme |

**Examples:**

```typescript
let list = [4, 5, 6];
for (let i in list)  console.log(i); // "0", "1", "2" — keys
for (let v of list)  console.log(v); // 4, 5, 6 — values

function toArray<X>(xs: Iterable<X>): X[] {
  return [...xs];
}

// Generators — function* yields values
function* gen() {
  yield 1;
  yield 2;
}
for (const n of gen()) console.log(n);
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### JSX

**Definition:**

XML-like syntax in `.tsx` files for UI frameworks (React, etc.).

| When to use | Notes |
|-------------|-------|
| Set `"jsx": "react-jsx"` in `tsconfig`. TS types props via `JSX.IntrinsicElements` and component types. | Angle-bracket type assertions (`<Foo>bar`) are **disallowed** in `.tsx` — use `bar as Foo` instead (parser ambiguity with JSX tags). |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Setup & jsx modes

**Definition:**

1. Use `.tsx` extension

2. Set `"jsx"` in `tsconfig.json`

1. Use `.tsx` extension
2. Set `"jsx"` in `tsconfig.json`

| Mode | Output |
|------|--------|
| `preserve` | Keep JSX → `.jsx` |
| `react` | `React.createElement(...)` |
| `react-jsx` | Automatic runtime `_jsx(...)` |
| `react-native` | Keep JSX → `.js` |

**How it works:**

* Lowercase (`<div>`) → intrinsic DOM/host element → `JSX.IntrinsicElements`
* Uppercase (`<MyComponent>`) → your component → resolved from scope

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Type checking highlights

**Definition:**

// FC must return JSX.Element (or customize JSX.ElementType in TS 5.1+)

interface Props { name: string }
function Greet(props: Props) {
  return <span>{props.name}</span>;
}

| Aspect | Detail |
|--------|--------|
| Summary | // FC must return JSX.Element (or customize JSX.ElementType in TS 5.1+)
interface Props { name: string }
function Greet( |

Configure via `jsxFactory`, `jsxFragmentFactory`, `jsxImportSource`.
---

**Examples:**

```typescript
// Intrinsic elements
declare namespace JSX {
  interface IntrinsicElements {
    foo: { bar?: boolean };
  }
}

// FC must return JSX.Element (or customize JSX.ElementType in TS 5.1+)
interface Props { name: string }
function Greet(props: Props) {
  return <span>{props.name}</span>;
}

// Children — JSX.ElementChildrenAttribute (default: children)
// Attributes — JSX.ElementAttributesProperty (default: props)
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Mixins

**Definition:**

Functions that take a class and return an extended class — compose behavior without multiple inheritance.

| When to use | Notes |
|-------------|-------|
| `` class User extends WithId(WithTimestamp(Entity)) `` — stack mixin factories. | Best supported via **class expression** return from a generic factory — not via decorators (decorator mixins don't merge types onto the class). |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Class expression pattern

**Definition:**

Class expression pattern — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | Class expression pattern — TypeScript language or compiler feature. |

**Constrained mixins** — generic base constraint ensures required methods exist:

---

**Examples:**

```typescript
type Constructor = new (...args: any[]) => {};

function Scale<TBase extends Constructor>(Base: TBase) {
  return class Scaling extends Base {
    _scale = 1;
    setScale(scale: number) { this._scale = scale; }
    get scale() { return this._scale; }
  };
}

class Sprite {
  name = "";
  constructor(name: string) { this.name = name; }
}

const EightBitSprite = Scale(Sprite);
const bird = new EightBitSprite("Bird");
bird.setScale(0.8);
```

```typescript
type GConstructor<T = {}> = new (...args: any[]) => T;
type Positionable = GConstructor<{ setPos(x: number, y: number): void }>;

function Jumpable<TBase extends Positionable>(Base: TBase) {
  return class extends Base {
    jump() { this.setPos(0, 20); }
  };
}
```

```typescript
// Stacking mixins — WithId + WithTimestamp
type Constructor<T = object> = new (...args: any[]) => T;

function WithId<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    id = Math.random().toString(36).slice(2);
  };
}

function WithTimestamp<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

class Entity {}

class User extends WithId(WithTimestamp(Entity)) {
  name = "Alice";
}

const u = new User();
// u.id, u.timestamp, u.name — all present
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Namespaces

**Definition:**

Legacy way to group code in global scope: `namespace Utils { export function f() {} }`.

| When to use | Notes |
|-------------|-------|
| Prefer ES modules (`import`/`export`) in modern code. Namespaces still appear in older `.d.ts` files. | `module X` is legacy alias for `namespace X`. Prefer **ES modules** (`import`/`export`) in modern code — namespaces pollute the global scope and complicate dependency tracking. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Patterns

**Definition:**

Utils.getPass("Yauhen", 31);           // "Yauhen31"

Utils.isEmpty(Utils.SECRET);         // false

| Aspect | Detail |
|--------|--------|
| Summary | Utils.getPass("Yauhen", 31);           // "Yauhen31"
Utils.isEmpty(Utils.SECRET);         // false |

**Ambient namespaces** (`declare namespace D3 { ... }`) describe global libraries loaded via `<script>`.
---

**Examples:**

```typescript
// Legacy namespace — encapsulates globals; must export to expose
namespace Utils {
  export const SECRET = "123321";
  const PI = 3.14; // private to namespace — not accessible outside
  export const getPass = (name: string, age: number) => `${name}${age}`;
  export const isEmpty = <T>(data: T) => !data;
}

Utils.getPass("Yauhen", 31);           // "Yauhen31"
Utils.isEmpty(Utils.SECRET);         // false

// Modern equivalent — ES modules (no namespace wrapper needed)
// export const SECRET = "123321";
// export const getPass = ...
// import { getPass, SECRET } from "./Utils";

namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) { return s.length === 5 && /^\d+$/.test(s); }
  }
}

// Alias — import q = x.y.z (not the same as import from "module")
import polygons = Shapes.Polygons;
let sq = new polygons.Square();

// Multi-file: same namespace name merges across files
// Use /// <reference path="..." /> to order compilation
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Namespaces and Modules

**Definition:**

How TS organizes code — ES modules (files) vs legacy namespaces (global).

| When to use | Notes |
|-------------|-------|
| Use `import`/`export` per file. Namespaces only for global augmentation or legacy interop. | Don't `/// <reference path="foo.ts">` when you mean `import` — references add files to compilation; imports are the module graph. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Common pitfalls

**Definition:**

// GOOD

export class Triangle {}

| Aspect | Detail |
|--------|--------|
| Summary | // GOOD
export class Triangle {} |

**How it works:** ---

**Examples:**

```typescript
// BAD — needless namespace wrapper in a module
export namespace Shapes {
  export class Triangle {}
}
// Consumer: new shapes.Shapes.Triangle() 😬

// GOOD
export class Triangle {}

// Modules can't use outFile with commonjs/umd — only amd/system
```

```typescript
// myModules.d.ts (not a module)
declare module "SomeModule" {
  export function fn(): string;
}

// myOtherModule.ts
/// <reference path="myModules.d.ts" />
import * as m from "SomeModule";
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Symbols

**Definition:**

ES6 primitive for unique keys — `Symbol("desc")` always creates a new value.

| When to use | Notes |
|-------------|-------|
| Use for hidden object keys, `Symbol.iterator` for iterables, `unique symbol` for branded types. | `sym2 === sym3` is always `false` even with the same description. TypeScript's `unique symbol` type ties identity to a **specific declaration** — only on `const` or `readonly static`.  --- |

**Examples:**

```typescript
const sym = Symbol();
let obj = { [sym]: "value" };
console.log(obj[sym]); // "value"

// unique symbol — must be const
declare const sym1: unique symbol;
let sym3: typeof sym1 = sym1; // OK — same declaration

const sym2 = Symbol();
const sym3b = Symbol();
// if (sym2 === sym3b) {} // Error: types have no overlap

class C {
  static readonly StaticSymbol: unique symbol = Symbol();
}
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Triple-Slash Directives

**Definition:**

Single-line `///` comments at file top that instruct the compiler.

| When to use | Notes |
|-------------|-------|
| `` /// <reference path="./types.d.ts" /> `` — legacy; prefer `import` and `tsconfig` `references` today. | As of TS 5.5, the compiler does **not** emit handwritten triple-slash directives to output unless `preserve="true"`. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Common directives

**Definition:**

/// <amd-module name="NamedModule"/>    // Name AMD module in output

|

* **`reference path`** — relative file dependency; depth-first resolution
* **`reference types`** — like `import` for declaration packages (`@types/node`); prefer `"types"` in `tsconfig.json` for `.ts` files
* **`reference lib`** — pull in DOM/ES lib slices
* **`--noResolve`** — ignores all reference directives

**How it works:**

`/// <amd-dependency path="..." />` — use `import "moduleName"` instead.

---

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | /// <amd-module name="NamedModule"/>    // Name AMD module in output
```

```typescript
/// <reference path="./utils.ts" />     // Add file to compilation (ordering)
/// <reference types="node" />          // Include @types package
/// <reference lib="es2017.string" />   // Include built-in lib (like --lib)
/// <reference no-default-lib="true"/>  // Skip default lib.d.ts

/// <amd-module name="NamedModule"/>    // Name AMD module in output
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Ambient Declarations and `declare`

**Definition:**

Type-only descriptions of code that exists elsewhere (JS libs, globals, `.d.ts` shims).

| When to use | Notes |
|-------------|-------|
| `` declare const $: JQueryStatic `` or `declare module "legacy"`. Emits no JS. | `declare` does not create a value at runtime. Pair with `@types/*` packages or hand-written `.d.ts` for untyped libraries. |

**Examples:**

```typescript
// Global variable loaded via <script>
declare const jQuery: (selector: string) => unknown;

// Ambient module — shape of an untyped npm package
declare module "legacy-lib" {
  export function doSomething(x: number): string;
}

// Ambient namespace — global library
declare namespace D3 {
  export function select(selector: string): unknown;
}

// declare class/function/var — types only, no JS emit
declare function greet(name: string): void;
declare class LegacyWidget {
  constructor(el: string);
  render(): void;
}

// Asset imports — tell TS non-TS files exist (Vite/Webpack)
declare module "*.svg" {
  const content: string;
  export default content;
}
declare module "*.png" {
  const src: string;
  export default src;
}
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### `noImplicitAny` and `strictNullChecks` — interview definitions

**Definition:**

Both are enabled by `"strict": true` in `tsconfig.json`.

---

| Aspect | Detail |
|--------|--------|
| Summary | Both are enabled by `"strict": true` in `tsconfig.json`.
--- |

**`noImplicitAny`** — when TS cannot infer a type, it would default to `any`. This flag makes that an **error**, forcing explicit annotations. Prevents silent loss of type safety in function parameters and untyped variables.

**`strictNullChecks`** — by default `null` and `undefined` assign to any type. This flag makes them distinct — you must handle nullability explicitly. Catches the most common production bug class.

Both are enabled by `"strict": true` in `tsconfig.json`.
---

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Type Compatibility

**Definition:**

Rules for when type A is assignable to type B — structural, not nominal.

| When to use | Notes |
|-------------|-------|
| Extra properties OK on variables passed to functions; excess checks on fresh literals. See assignability table. | TS is intentionally **unsound** in places — extra properties on variables are OK when passing to a function, but **not** in object literals assigned to a typed variable. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Core rules

**Definition:**

// let bad: Pet = { name: "Lassie", owner: "Rudd" }; // Error — excess property check

|

**How it works:**

parameters are checked **bivariantly** by default (unsound) — you can assign `(a: number) => void` to `(b: number, s: string) => void`. Enable `strictFunctionTypes` to fix for non-method signatures.

source return must be a **subtype** of target return.

only **instance** members compared; static/constructor ignored. **Private/protected** members must originate from the **same** class for compatibility.

`Empty<number>` and `Empty<string>` compatible if `T` unused in structure; `NotEmpty<number>` vs `NotEmpty<string>` — error.

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // let bad: Pet = { name: "Lassie", owner: "Rudd" }; // Error — excess property check
```

```typescript
interface Pet { name: string; }
let dog = { name: "Lassie", owner: "Rudd" };
let pet: Pet = dog; // OK — extra 'owner' is fine

// let bad: Pet = { name: "Lassie", owner: "Rudd" }; // Error — excess property check
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Assignability table (summary)

**Definition:**

Assignability table (summary) — TypeScript language or compiler feature.

|        | any | unknown | object | void | undefined | null | never |
|--------|-----|---------|--------|------|-----------|------|-------|
| → any  | ✓   | ✓       | ✓      | ✓    | ✓         | ✓*   | ✕     |
| → unknown | ✓ | ✕       | ✕      | ✕    | ✕         | ✕    | ✕     |
| never → | ✓  | ✓       | ✓      | ✓    | ✓         | ✓    | ✓     |

*`strictNullChecks` off changes `null`/`undefined` behavior significantly.

**unknown** ≈ inverse of **never**: everything assignable to `unknown`; `unknown` assignable only to `any` (and itself).
---

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Type Inference

**Definition:**

How TS deduces types when you omit annotations.

| When to use | Notes |
|-------------|-------|
| Let inference work first; annotate at API boundaries. Contextual typing fills callback param types. | Inference picks a **best common type** from candidates — if no single supertype exists, you get a **union** (`Rhino \| Elephant \| Snake`) instead of `Animal[]` unless you annotate or provide context. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Best common type

**Definition:**

Best common type — TypeScript language or compiler feature.

| Aspect | Detail |
|--------|--------|
| Summary | Best common type — TypeScript language or compiler feature. |

**Examples:**

```typescript
let x = 3;                    // number
let arr = [0, 1, null];       // (number | null)[]

let zoo = [new Rhino(), new Elephant(), new Snake()];
// (Rhino | Elephant | Snake)[] — not Animal[]

let zoo2: Animal[] = [new Rhino(), new Elephant(), new Snake()]; // OK
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Contextual typing

**Definition:**

// Without context, parameter is `any` (unless noImplicitAny)

const handler = function (uiEvent) {
  console.log(uiEvent.button); // OK — no error without context
};

| Aspect | Detail |
|--------|--------|
| Summary | // Without context, parameter is `any` (unless noImplicitAny)
const handler = function (uiEvent) {
  console.log(uiEvent |

---

**Examples:**

```typescript
window.onmousedown = function (mouseEvent) {
  console.log(mouseEvent.button);    // OK — MouseEvent
  // console.log(mouseEvent.kangaroo); // Error
};

// Without context, parameter is `any` (unless noImplicitAny)
const handler = function (uiEvent) {
  console.log(uiEvent.button); // OK — no error without context
};

// Context applies to: call arguments, assignment RHS, assertions,
// object/array literals, return statements
function createZoo(): Animal[] {
  return [new Rhino(), new Elephant(), new Snake()]; // Animal[] inferred from return type
}
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Variable Declaration

**Definition:**

`var` (function-scoped, hoisted), `let` (block-scoped), `const` (block-scoped, no reassignment).

| When to use | Notes |
|-------------|-------|
| Prefer `const` > `let` > `var`. TS checks all three; `const` does not make objects deeply immutable. | `const` only prevents **rebinding** the variable — object innards remain mutable unless `readonly` or `Object.freeze`. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### var problems

**Definition:**

// Same var in nested loops — classic bug

for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

| Aspect | Detail |
|--------|--------|
| Summary | // Same var in nested loops — classic bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3 |

**Examples:**

```typescript
// Function-scoped — leaks out of blocks
if (true) { var x = 10; }
console.log(x); // 10

// Same var in nested loops — classic bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// Redeclaration allowed
var x = 1;
var x = 2; // OK
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### let — block-scoped

**Definition:**

// Temporal dead zone — can't use before declaration

// a++; let a; // Error

| Aspect | Detail |
|--------|--------|
| Summary | // Temporal dead zone — can't use before declaration
// a++; let a; // Error |

**Examples:**

```typescript
if (true) {
  let b = 1;
}
// console.log(b); // Error — not in scope

// Temporal dead zone — can't use before declaration
// a++; let a; // Error

// Per-iteration binding in loops
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}

// No redeclaration in same scope
let x = 10;
// let x = 20; // Error
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### const & destructuring

**Definition:**

// Prefer const unless you will reassign (least privilege)

| Aspect | Detail |
|--------|--------|
| Summary | // Prefer const unless you will reassign (least privilege) |

**Examples:**

```typescript
const kitty = { name: "Aurora", numLives: 9 };
// kitty = { ... };     // Error — rebind
kitty.name = "Rory";    // OK — mutate property

// Prefer const unless you will reassign (least privilege)

// Array destructuring
let [first, second] = [1, 2];
let [head, ...rest] = [1, 2, 3, 4]; // rest: [2,3,4]

// Object destructuring
let { a, b } = { a: 1, b: 2 };
let { a: renamed } = { a: 1 }; // property rename

// Tuple destructuring preserves element types
let tuple: [number, string] = [7, "hello"];
let [n, s] = tuple; // n: number, s: string
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Quick list — checklist

1. **`const` type parameters** — literal inference in generics (TS 5.0+)
2. **`using` / `Disposable`** — scoped resource cleanup (TS 5.2+)
3. **`override` keyword** — explicit, checked method overrides
4. **Stricter compiler flags** — `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
5. **ESM/CJS** — `moduleResolution: node16` / `nodenext`, `verbatimModuleSyntax`
6. **Project references** — split monorepos, incremental `tsc --build`
7. **Publishing typed packages** — `declaration`, `types` field, bundling `.d.ts`
8. **Recursive types** — `Json`, trees, deep `Partial`
9. **Variance** — covariant returns, contravariant params, bivariance pitfalls
10. **Runtime validation** — TS types ≠ runtime; use Zod/io-ts for external data

</details>

<a name="advanced"></a>

## Advanced topics

<details>
  <summary>Modern TypeScript</summary>

### `const` Type Parameters (TS 5.0+)

**Definition:**

Generic parameter modifier that preserves literal types in inference.

| When to use | Notes |
|-------------|-------|
| `` function routes<const T extends readonly string[]>(paths: T) `` — keeps tuple of literals, not `string[]`. | recursion must have a **base case** (`T extends object` guard) or the compiler hits depth limits. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Variance (functions and assignability)

**Definition:**

How subtyping works for function params (contravariant) and returns (covariant).

| Aspect | Detail |
|--------|--------|
| Summary | How subtyping works for function params (contravariant) and returns (covariant). |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>

<a name="interview-practice"></a>
