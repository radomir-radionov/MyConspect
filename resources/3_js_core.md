# JS Core — Language

Covers ECMAScript fundamentals: types, scope, operators, control flow, functions, closures, modules, and errors.

[← Back to JS hub](./3_js.md)

### Related docs

- [JS OOP](./3_js_oop.md) · [JS Browser](./3_js_browser.md) · [JS Async](./3_js_async.md) · [Call stack](./3_js_async.md#call-stack)
- [Web API](./6_web_api.md) · [YAML](./10_build.md#yaml) · [Node.js](./8_nodejs.md) · [Process & threads](./8_nodejs.md#process--threads) · [React](./4_react.md) · [Special — OOP](./7_special.md#2-oop--fp)

### Main concepts

| Area          | Topics                                                          |
| ------------- | --------------------------------------------------------------- |
| **Runtime**   | JS vs ECMAScript, JIT, stack/heap, strict mode, engine pipeline |
| **Types**     | Primitives, objects, coercion, `Map`/`Set`, strings, `Symbol`, JSON |
| **Scope**     | `let`/`const`/`var`, TDZ, hoisting, execution context           |
| **Functions** | Declarations, arrows, closures, currying, `call`/`apply`/`bind`, debounce/throttle |
| **Modern**    | ESM, optional chaining, `Proxy`, `Intl`, RegExp, `Object.is`, Signals (TC39) |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [Core](#core) · [Memory: stack and heap](#memory-stack-heap)
- [Data types](#data-types)
- [Scope & closures](#scope-closures)
- [Functions](#functions)
- [Modules](#modules)
- [Iterators](#iterators)
- [Advanced](#advanced) · [Signals](#signals)
- [Interview Practice](#interview-practice)

Topics also covered: **plain objects**, **strings**, **Symbol**, **JSON**, **stack/heap**, **JIT**, **`call`/`apply`/`bind`**, **debounce/throttle**, **GC**, **Object.is**, **Signals**.

### Types & coercion

**Definition:** JavaScript is dynamically typed; values have runtime types and may coerce implicitly. See **Data types** for the full type table, interesting cases, and coercion traps.

**When to use:** `===` by default; `value == null` only when you mean null or undefined; `Map` when keys are non-strings.

**Pluses and minuses:**

| Approach                        | +                       | −                                           |
| ------------------------------- | -------------------------- | ---------------------------------------------- |
| `===` / `!==`                   | Predictable comparisons    | Verbose when null-checking both null/undefined |
| `==` / `!=`                     | Shorter legacy null checks | Surprising coercion (`'' == 0`)                |
| Explicit `Number()`, `String()` | Clear intent               | Extra boilerplate                              |

**Sources:** [javascript.info/types](https://learn.javascript.ru/types) · [comparison](https://learn.javascript.ru/comparison)

### Functions & scope

**Definition:**

Functions are first-class values with lexical scope; closures retain outer bindings. `this` is set by call site (except arrow functions).

| Concept       | Key rule                                           |
| ------------- | -------------------------------------------------- |
| Closure       | Inner function keeps access to outer variables     |
| `var`         | Function-scoped, hoisted as `undefined`            |
| `let`/`const` | Block-scoped, temporal dead zone until declaration |
| Arrow `this`  | Lexical — inherits from enclosing scope            |

**When to use:** Closures for factories and encapsulation; `const` by default; arrow functions for callbacks that need outer `this`.

**Examples:**

```js
function makeAdder(n) {
  return (x) => x + n;
}
const add5 = makeAdder(5);
add5(3); // 8
```

**Sources:** [javascript.info/closure](https://learn.javascript.ru/closure) · [arrow-functions](https://learn.javascript.ru/arrow-functions-basics)

### Modules & iterators

**Definition:**

ESM (`import`/`export`) provides static modules; iterables expose `Symbol.iterator` for `for...of`, spread, and destructuring.

| Feature     | Use when                                          |
| ----------- | ------------------------------------------------- |
| ESM         | Modern apps, tree-shaking, clear dependency graph |
| `for...of`  | Arrays, strings, Map, Set, custom iterables       |
| Generators  | Lazy sequences, custom iteration protocol         |
| `Map`/`Set` | Non-string keys, uniqueness, frequent add/delete  |

**Examples:**

```js
// math.js
export const PI = 3.14;

// app.js
import { PI } from "./math.js";

function* range(n) {
  for (let i = 0; i < n; i++) yield i;
}
for (const x of range(3)) console.log(x); // 0, 1, 2
```

**Sources:** [javascript.info/modules-intro](https://learn.javascript.ru/modules-intro) · [iterable](https://learn.javascript.ru/iterable)

### JavaScript vs ECMAScript

**Definition:** ECMAScript is the language specification (ECMA-262); JavaScript is an implementation that conforms to it (V8, SpiderMonkey, JavaScriptCore).

**When to use:** Default language for web UI, SSR, tooling, and full-stack JS teams.

**Pluses and minuses:**

| + (JS ecosystem)                   | −                                 |
| ------------------------------------- | ------------------------------------ |
| Runs everywhere (browser, Node, Deno) | Implementation quirks across engines |
| Massive ecosystem                     | Dynamic typing footguns              |

**Examples:**

```js
// .mjs = ES module file (strict mode by default)
export const version = "ES2024";
```

**Thoughts:** Engines parse the whole script (syntax errors abort before any line runs) then JIT: interpreter first, optimizing compiler for hot paths. “JS is interpreted” is oversimplified — see [JavaScript engine pipeline](#javascript-engine-pipeline).

**Sources:** [javascript.info/intro](https://learn.javascript.ru/intro)

### Strict mode

**Definition:** `"use strict"` enables a restricted variant that catches silent errors and disables unsafe features.

**When to use:** All new modules (ESM is strict by default); enable in legacy IIFE wrappers.

**Pluses and minuses:**

| +                        | −                     |
| --------------------------- | ------------------------ |
| Prevents accidental globals | May break legacy scripts |
| Safer `this` in functions   | Slightly stricter syntax |

**Examples:**

```js
"use strict";
// mistypedVar = 1; // ReferenceError
```

**Sources:**

[javascript.info/strict-mode](https://learn.javascript.ru/strict-mode)

---

<a name="core"></a>

## Core

<details>
  <summary>what is js & es</summary>

### JavaScript & ECMAScript

**Definition:**

ECMAScript is the standardized language spec; JavaScript is a conforming implementation with host APIs (DOM in browsers, `fs` in Node).

| Trait     | Detail                                    |
| --------- | ----------------------------------------- |
| Paradigms | Event-driven, functional, OOP, imperative |
| Typing    | Dynamic — types checked at runtime        |
| Execution | JIT compilation in modern engines         |
| Modules   | `.mjs` or `type="module"` for ESM         |

**Examples:**

```js
// ECMAScript module — strict by default
export function greet(name) {
  return `Hello, ${name}`;
}
```

**Thoughts:**

Host environments add APIs; the language itself is defined by ECMA-262.

Brendan Eich created the first engine (SpiderMonkey) in 1995. Today V8, SpiderMonkey, and JavaScriptCore all implement the same spec with minor edge-case differences.

**Sources:** [javascript.info/intro](https://learn.javascript.ru/intro)

</details>

<details>
  <summary>strict mode</summary>

### Strict mode

**Definition:**

`"use strict"` opts into stricter parsing and runtime behavior: no accidental globals, duplicate params forbidden, `delete` on non-configurable properties throws.

| Restricted            | Effect                                  |
| --------------------- | --------------------------------------- |
| Undeclared assignment | `ReferenceError` instead of global leak |
| Duplicate param names | SyntaxError                             |
| Octal literals        | SyntaxError                             |
| `this` in plain calls | `undefined` (not `globalThis`)          |

**When to use:** All new code. Place at top of script or first line of function for local strict mode.

**Examples:**

```js
"use strict";
function demo() {
  // this === undefined in strict mode
}
```

**Sources:** [javascript.info/strict-mode](https://learn.javascript.ru/strict-mode)

</details>

<details>
  <summary>js under the hood</summary>

### JavaScript engine pipeline

**Definition:** A JS engine parses source into an AST, interprets to bytecode, profiles hot paths, and JIT-compiles optimized machine code. That mix is why “is JavaScript interpreted?” has no yes/no answer.

**How it works:**

- **AOT compiled** (C, Go): translate the whole program to machine code *before* run. Catches many errors early; slower to start iterating.
- **Interpreted** (classic scripts): translate and run line by line. Fast to start; a typo can appear only when that line runs.
- **JS in practice:** parse + compile happen *at runtime* (MDN still calls JS “interpreted” for that reason). Syntax is checked for the **whole** script first — a `SyntaxError` on line 2 prevents line 1 from running. A `ReferenceError` from a misspelled identifier is a **runtime** error: earlier lines already ran.
- Function **declarations** are hoisted, so a call can appear above the `function` in source — not line-by-line interpretation.
- **JIT:** interpreter for cold code; if a function runs often with stable types, an optimizing compiler emits machine code (and may deoptimize if types change). Babel/TypeScript emit older JS *before* the engine — not the same as JIT.

| Stage               | Role                      |
| ------------------- | ------------------------- |
| Parser              | Tokenizes and builds AST  |
| Interpreter         | Runs bytecode quickly     |
| Profiler            | Finds hot functions       |
| Optimizing compiler | Emits faster machine code |

**When to use:**

Interview “interpreted vs compiled”; explain why syntax errors vs `ReferenceError` differ; why hot loops get faster after warmup.

#### Common pitfalls

Calling JS “just interpreted” or “just compiled”; mixing engine JIT with Babel transpile.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Fast startup + later peak speed | Type speculation can deoptimize |
| Syntax errors fail the whole parse | “Interpreted” / “compiled” labels confuse |

**Examples:**

```text
Source → Parser → AST → Interpreter (bytecode) → Profiler → Compiler (optimized code)
```

```js
console.log("this never runs");
console.log("oops" "); // SyntaxError — parse fails first

const a = 0;
console.log("ran");
console.log(a2); // ReferenceError after "ran"

praise("Pushkin"); // works — function declaration is hoisted
function praise(name) {
  console.log(`Ай да, ${name}!`);
}
```

**Thoughts:**

JIT combines fast startup (interpreter) with peak performance (compiler). Babel transpiles modern syntax to older ECMAScript for older runtimes — it is not the same as the engine JIT.

| Engine         | Host               |
| -------------- | ------------------ |
| V8             | Chrome, Node, Deno |
| SpiderMonkey   | Firefox            |
| JavaScriptCore | Safari             |

**Sources:** [javascript.info/intro](https://learn.javascript.ru/intro) · [MDN — interpreted vs compiled](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_is_JavaScript) · [MDN JIT](https://developer.mozilla.org/en-US/docs/Glossary/Just_in_time_compilation) · [V8 blog](https://v8.dev/blog)

</details>

<details>
  <summary>memory: stack & heap</summary>

<a name="memory-stack-heap"></a>

### Memory: stack and heap

**Definition:** A process gets an isolated **virtual** address space. Fast **stack** memory holds call frames (LIFO); the **heap** holds values whose size is unknown or must outlive a function. JS engines GC the heap; you do not `malloc`/`free`. Knowing this model makes DevTools (stack traces, heap snapshots) and interview questions about assignment / calls easier.

**How it works:**

- **Mental CPU model:** von Neumann — instructions and data share one store (one bus). Harvard splits them. Real chips are a hybrid (e.g. separate L1 I-cache / D-cache). Memory is numbered **cells**; the number is a fixed-width **address** (random access, not only sequential). Values larger than one cell span several. 64-bit width → 2⁶⁴ addresses (≈ 16 EiB of *address space*, not “you have 18 EB of RAM”).
- **Virtual vs physical:** the CPU maps virtual addresses to RAM. The OS hands the process **pages** (often 4–8 KB), many of them.
- **Process vs thread:** the OS isolates processes (no access to another process unless it allows it). A process may have several threads, each with its own stack. POSIX threads are one real API — hosts differ (browser tab vs Node). Scheduler, context switch, signals: [Processes, multitasking & interrupts](./0_system_design.md#processes-multitasking). Node layer: [Process & threads](./8_nodejs.md#process--threads).
- **Process image:** into that space go program **code**, **globals**, then **stack** and **heap**.
- **Stack:** grow/shrink by moving the **stack pointer** (CPU register) — cheap. You can **read** stack data; you **write** only at the top (push). You cannot free a hole in the middle; rewind the pointer to drop everything above it. Exhaustion → **stack overflow**. Teaching diagram: heap grows “up”, stack “down”, they meet in the free gap.
- **Stack frame:** one call’s args, locals, and “what to run after return”. A **frame pointer** marks the active frame. Nested calls: `logDogs` frame → `countDogs(20)` → pop → `countDogs(9)` → pop → pop `logDogs`.
- **Unwind:** `throw` pops frames until a `catch` (or the program dies). The **stack trace** is those frames in reverse call order.
- **Heap:** needed when size is not known at frame-build time (arrays that `.push`, objects, closures) or data must outlive the function. The stack slot stores a **fixed-size reference** (address); the payload lives on the heap. Modify the array via that address. GC later reclaims unreachable heap objects — [Garbage collection](#garbage-collection-overview). MDN: JS allocates on create and frees unused objects; unlike C there is no `malloc`/`free`.
- **JS caveat:** dynamic types mean the engine *guesses* how much stack to reserve; guesses can be wrong (deopt). “Primitives on stack, objects on heap” is a teaching model, not a guaranteed V8 layout (small ints may be tagged pointers; large strings are heap).

**When to use:**

Why `Maximum call stack size exceeded`; why objects/arrays are shared by reference; why locals vanish after return; reading a stack trace.

| | Stack | Heap |
| --- | --- | --- |
| **+** | Tiny alloc/free (move a pointer); cache-friendly frames | Arbitrary size; data can outlive the caller |
| **−** | Fixed-ish size; LIFO only; overflow | Slower alloc; GC; leaks via leftover refs |

#### Common pitfalls

Treating the diagram as physical RAM layout; assuming JS always knows stack slot sizes; putting huge or growing data “on the stack” in your head — it is a heap object plus a reference; confusing call-stack overflow with heap OOM (`JavaScript heap out of memory` in Node).

**Examples:**

```js
function countDogs(happyDogs) {
  const sadCoefficient = 0.1;
  if (happyDogs < 10) {
    throw new Error("too few happy dogs");
  }
  return happyDogs + sadCoefficient * happyDogs;
}

function logDogs() {
  console.log(countDogs(20), countDogs(9));
}

logDogs();
// frames: logDogs → countDogs(20) → pop → countDogs(9) → throw → unwind
```

```js
function createDogArray() {
  const dogs = ["🐶", "🐶", "🐶"]; // payload on heap; `dogs` on the frame is a ref
  if (Math.random() > 0.5) dogs.push("🐶"); // size unknown at compile time
}
```

**Thoughts:** *Frames are cheap LIFO; anything with unknown or lasting size is a heap object behind a pointer — GC, not `free()`.*

**Sources:** [Doka — how memory works](https://doka.guide/js/how-the-memory-works/) · [MDN Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) · [javascript.info/garbage-collection](https://learn.javascript.ru/garbage-collection)

</details>

### Core advanced

**Definition:**

Extended language topics beyond syntax: paradigms, team methodologies, glossary, and debugging APIs.

<details>
  <summary>js paradigms</summary>

### Programming paradigms

**Definition:**

Paradigms describe how you structure logic: imperative (how), declarative (what), functional (pure transforms), OOP (objects), event-driven (handlers).

| Paradigm     | JS example                         |
| ------------ | ---------------------------------- |
| Imperative   | `for` loops, step-by-step mutation |
| Declarative  | `array.filter` / `map`, React JSX  |
| Functional   | Pure functions, immutability, composition, HOF, curry |
| OOP          | Classes, prototypes                |
| Procedural   | Subroutines + shared memory        |
| Event-driven | DOM listeners, Node `EventEmitter` |
| Reactive     | RxJS streams, React/MobX state sync |
| Async        | Promises, `async/await`            |

**How it works:** Императив = *как* (цикл). Декларатив = *что* (`filter`, JSX). ФП — чистые функции. ООП — объекты. JS — всё сразу.

**Examples:**

```js
const odds = [1, 2, 3, 4].filter((n) => n % 2 !== 0); // declarative
```

**Thoughts:** Full map (procedural, logic, reactive, composition vs inheritance): [Special — paradigms](./7_special.md#1-programming-fundamentals) · [Reactive programming](./7_special.md#reactive-programming--reactivity).

**Sources:** [Doka — programming paradigms](https://doka.guide/tools/programming-paradigms/)

</details>

<details>
  <summary>js methodologies</summary>

### Development methodologies

**Definition:**

Methodologies are structured practices for organizing code and teams — distinct from language paradigms.

| Category         | Examples                                                |
| ---------------- | ------------------------------------------------------- |
| CSS architecture | BEM, SMACSS, OOCSS, Atomic Design                       |
| App structure    | MVC, MVVM, Flux, Redux                                  |
| Process          | TDD, BDD, DDD                                           |
| Principles       | DRY, KISS, SOLID, YAGNI                                 |
| Frontend         | Component-driven, mobile-first, progressive enhancement |

**Sources:** [MDN JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

</details>

<details>
  <summary>paradigms vs methodologies</summary>

### Paradigms vs methodologies

**Definition:**

Paradigms shape how you think about problems; methodologies shape how you organize projects and collaborate.

|          | Paradigm               | Methodology                        |
| -------- | ---------------------- | ---------------------------------- |
| Answers  | _How_ to express logic | _How_ to structure a codebase/team |
| Examples | FP vs OOP              | MVC, TDD, BEM                      |

Both work together: choose paradigms for problem-solving style, methodologies for maintainability at scale.

</details>

<details>
  <summary>terms</summary>

### Glossary

**Definition:**

Common terms used throughout JS core documentation.

| Term          | Meaning                                          |
| ------------- | ------------------------------------------------ |
| Allocate      | Reserve memory for a value                       |
| Decomposition | Break a problem into smaller parts               |
| Memoization   | Cache function results to avoid recomputation    |
| Identifier    | Name of a variable, function, or label           |
| Linter        | Tool that enforces code style and catches issues |
| Normalizer    | Function that standardizes data shape            |
| Minification  | Remove whitespace/comments to shrink bundle size |

**Sources:** [MDN Glossary](https://developer.mozilla.org/en-US/docs/Glossary)

</details>

<details>
  <summary>console</summary>

### Console API

**Definition:** Browser/Node debugging API for logging, timing, and inspecting objects.

**Examples:**

```js
console.log("info", { a: 1 });
console.table([{ id: 1 }, { id: 2 }]);
console.time("fetch");
// await fetch(...)
console.timeEnd("fetch");
console.dir(document.body, { depth: 1 });
```

**Sources:** [MDN console](https://developer.mozilla.org/en-US/docs/Web/API/console)

</details>

<details>
  <summary>operators</summary>

### Operators

**Definition:**

Operators perform actions on operands — arithmetic, assignment, comparison, logical, and more.

| Type       | Operators |
| ---------- | --------- |
| Arithmetic | `+`, `-`, `*`, `/`, `%`, `**` |
| Assignment | `=`, `+=`, `-=`, `??=` |
| Comparison | `==`, `===`, `>`, `<`, `!==`, `!=` |
| Logical    | `&&`, `\|\|`, `!`, `??` |
| Bitwise    | `&`, `\|`, `^`, `~`, `<<`, `>>`, `>>>` |
| Ternary    | `cond ? a : b` |

**Sources:** [MDN Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators)

</details>

<details>
  <summary>Expressions</summary>

### Expressions

**Definition:**

An expression evaluates to a value; statements perform actions and may contain expressions.

| Expression type | Example                   |
| --------------- | ------------------------- |
| Arithmetic      | `3 + 4` → `7`             |
| String          | `'Hello ' + 'World'`      |
| Logical         | `true && false` → `false` |
| Assignment      | `x = 10` → `10`           |

**Thoughts:** Every expression produces a value (except thrown errors).

</details>

<details>
  <summary>math oper</summary>

### Math operators

**Definition:** Arithmetic and unary operators on numbers; `+` also concatenates strings when either operand is a string.

**How it works:**

- `+` with string → string concat; otherwise numeric add (with coercion).
- `-`, `*`, `/`, `%`, `**` convert operands to numbers.
- Unary `+x` coerces to number; unary `-x` negates.
- `++`/`--` prefix returns new value; postfix returns old value then updates.
- `%` is remainder, not mathematical modulo for negatives.

**When to use:** Use `Number(x)` or `+x` for explicit coerce; always pass radix to `parseInt(s, 10)`.

**Pluses and minuses:**

| + | − |
|------|------|
| `**` for exponentiation | `+` dual role causes bugs |
| Unary `+` quick coerce | Floating-point rounding (IEEE-754) |

**Examples:**

```js
"5" + 1;  // '51' (string concat)
"5" - 1;  // 4 (numeric coercion)
+"42";    // 42
parseInt("08", 10); // 8
Number.isFinite(42); // true
1n + 2n;  // 3n — bigint, cannot mix with number without conversion
```

**Sources:** [javascript.info/operators](https://learn.javascript.ru/operators) · [number](https://learn.javascript.ru/number)

</details>

<details>
  <summary>bitwise operators (basics)</summary>

### Bitwise operators (basics)

**Definition:** Operators that treat numbers as 32-bit integers: `&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`.

**How it works:**

- Operands convert to 32-bit signed integers before the operation.
- `&` AND, `|` OR, `^` XOR, `~` NOT, shifts move bits left/right.
- `>>>` unsigned right shift fills with zero.

**When to use:** Permission flags, hash tricks, performance-critical libs. Most app code never needs bitwise ops.

**Pluses and minuses:**

| + | − |
|------|------|
| Fast flags and masks | Rare in typical app code |
| Low-level bit tricks | 32-bit limit on bitwise ops |

**Examples:**

```js
5 & 1;   // 1 — odd check
1 << 3;  // 8 — multiply by 8 via shift
```

**Sources:** [javascript.info/bitwise-operators](https://learn.javascript.ru/bitwise-operators)

</details>

<details>
  <summary>comparisons</summary>

### Comparison operators

**Definition:** Comparison operators return booleans (or drive `sort` comparators). `===` avoids coercion; `==` coerces first.

**How it works:**

- `===` / `!==` — no type conversion; different types are always unequal.
- `==` / `!=` — apply abstract equality rules (surprising with `''`, `0`, `false`).
- Relational `>`, `<`, `>=`, `<=` — usually convert to numbers; strings compare lexicographically when both are strings.
- `Object.is` for edge cases (`NaN`, signed zero) — see **Advanced → Object.is**.

**When to use:** Default `===`; `value == null` for null/undefined; numeric sort comparators return negative/zero/positive.

**Pluses and minuses:**

| Approach | + | − |
|----------|------|------|
| `===` | Predictable | Verbose null checks |
| `==` | `null == undefined` | Footguns (`'' == 0`) |
| `Object.is` | Correct `NaN` | Niche |

**Examples:**

```js
null === undefined; // false
null == undefined;  // true
"2" > "12";         // true — string compare
"2" > 12;           // false — number compare
```

**Sources:** [javascript.info/comparison](https://learn.javascript.ru/comparison)

</details>

<details>
  <summary>conditional branching: if, else if, else, '?'</summary>

### Conditional branching

**Definition:** `if`/`else` run statements based on truthy/falsy values; ternary `cond ? a : b` is an **expression** that returns a value.

**How it works:**

- Condition coerces to boolean (falsy: `false`, `0`, `''`, `null`, `undefined`, `NaN`, `0n`).
- `else if` chains multiple conditions; first match wins.
- Ternary nests but prefer `if` for readability when complex.
- `switch` uses `===` against each `case` (see loops section).

**When to use:** `if` for multi-line branches; ternary for simple assign/render; early `return` to flatten logic.

**Pluses and minuses:**

| + | − |
|------|------|
| Clear control flow | Deep nesting hard to read |
| Ternary handy in JSX/assignments | Easy to omit braces and introduce bugs |

**Examples:**

```js
const age = 20;
const label = age < 18 ? "minor" : "adult";

if (age >= 18) {
  console.log("adult");
} else if (age >= 13) {
  console.log("teen");
} else {
  console.log("child");
}
```

**Sources:** [javascript.info/ifelse](https://learn.javascript.ru/ifelse)

</details>

<details>
  <summary>!, ?., ??, optional chaining & nullish</summary>

### Optional chaining (`?.`) & nullish coalescing (`??`)

**Definition:** `?.` short-circuits on `null`/`undefined` instead of throwing. `??` returns the right side only when the left is `null` or `undefined`.

**How it works:**

- `obj?.prop`, `obj?.[expr]`, `fn?.()` — stops at first nullish step.
- `??` differs from `||`: `0 ?? 1` is `0`; `0 || 1` is `1`.
- Combine with care: `a ?? b || c` needs parentheses per language rules.
- `!.` is logical NOT; `!!x` coerces to boolean.

**When to use:** API optional fields, chained config, default only for nullish (`??`), not all falsy (`||`).

**Pluses and minuses:**

| + | − |
|------|------|
| Safe deep access without nested `if` | Can hide data bugs (silent `undefined`) |
| `??` preserves `0` and `''` | Mixing `??` and `||` needs parens |

**Examples:**

```js
const user = null;
user?.profile?.name; // undefined — no throw

0 || "default";  // 'default'
0 ?? "default";  // 0

const port = config.port ?? 3000;
```

**Sources:** [javascript.info/optional-chaining](https://learn.javascript.ru/optional-chaining) · [nullish-coalescing](https://learn.javascript.ru/nullish-coalescing-operator)

</details>

<details>
  <summary>logical operators (|| (OR), && (AND), ! (NOT), !!(double NOT), ?? (Nullish Coalescing))</summary>

### Logical operators

**Definition:** `&&`, `||`, `!`, and `??` use **short-circuit** evaluation — they return the deciding operand, not always a boolean.

**How it works:**

- `a || b` — if `a` is truthy, return `a`; else `b`.
- `a && b` — if `a` is falsy, return `a`; else `b`.
- `!a` — boolean negation after coercion.
- `a ?? b` — if `a` is `null`/`undefined`, return `b`; else `a`.
- Common pattern: `user && greet(user)`; `name || 'Guest'`.

| Operator | Returns |
| -------- | ------- |
| `\|\|` | First truthy (or last if all falsy) |
| `&&` | First falsy (or last if all truthy) |
| `??` | Right only if left is nullish |
| `!` | Boolean |

**When to use:** `??` for config defaults; `||` when any falsy should fallback; `&&` for conditional execution.

**Pluses and minuses:**

| + | − |
|------|------|
| Concise defaults and guards | `||` treats `0`/`''` as missing |
| Short-circuit avoids extra work | `??`/`||` mixing needs parentheses |

**Examples:**

```js
0 || "default";  // 'default'
0 ?? "default";  // 0
name && greet(name);
config.debug ?? false;
```

**Sources:** [javascript.info/logical-operators](https://learn.javascript.ru/logical-operators) · [nullish-coalescing](https://learn.javascript.ru/nullish-coalescing-operator)

</details>

<details>
  <summary>loops, break, continue & switch</summary>

### Loops, break, continue & switch

**Definition:** Loops repeat code; `break` exits a loop/switch; `continue` skips to next iteration. `switch` matches `case` with `===`.

**How it works:**

- `while` — test before body; may run zero times.
- `do...while` — body at least once.
- `for (init; cond; step)` — classic counter; use `let` for per-iteration binding.
- `for...of` — iterates **values** of iterables.
- `for...in` — iterates **keys** (including inherited); filter with `Object.hasOwn`.
- `switch` — strict match; fall-through without `break`.

| Construct | Use |
| --------- | --- |
| `while` | Unknown iterations, condition-first |
| `do...while` | At least one run |
| `for` | Index counters |
| `for...of` | Arrays, strings, Map, Set |
| `for...in` | Object keys (with `hasOwn`) |
| `switch` | Many discrete equal values |

**When to use:** Arrays → `for...of` or `map`; objects → `Object.entries` + `for...of`; enums → `switch`; async loops → see [3_js_async.md](./3_js_async.md).

**Pluses and minuses:**

| + | − |
|------|------|
| `for...of` clean on iterables | `for...in` on arrays is buggy |
| `switch` readable for enums | Fall-through footguns |
| `break`/`continue` control flow | Labels rarely needed |

**Examples:**

```js
for (let i = 0; i < 3; i++) console.log(i);

for (const v of ["a", "b"]) console.log(v);

for (const key in obj) {
  if (!Object.hasOwn(obj, key)) continue;
  console.log(key, obj[key]);
}

switch (status) {
  case "active":
    handleActive();
    break;
  case "draft":
  case "pending":
    handleDraft();
    break;
  default:
    handleUnknown();
}
```

**Sources:**

[javascript.info/while-for](https://learn.javascript.ru/while-for) · [switch](https://learn.javascript.ru/switch)

<details>
  <summary>for...in vs for...of — extended</summary>

### for...in vs for...of

**Definition:** `for...in` walks enumerable keys (including inherited); `for...of` consumes iterable values.

**Examples:**

```js
for (const key in obj) {
  if (Object.hasOwn(obj, key)) console.log(key, obj[key]);
}
for (const ch of "hi") console.log(ch);
```

**Sources:** [javascript.info/array#loops](https://learn.javascript.ru/array#loops)

</details>

<details>
  <summary>switch — extended notes</summary>

### switch — fall-through

**Definition:** Without `break`, execution falls through to the next `case`. Use `break` unless fall-through is intentional.

**Examples:**

```js
switch (x) {
  case 1:
    console.log("one");
    break;
  case 2:
    console.log("two");
    break;
  default:
    console.log("other");
}
```

**Sources:** [javascript.info/switch](https://learn.javascript.ru/switch)

</details>

</details>

<a name="data-types"></a>

## Data types

<details>
  <summary>Data types</summary>

### Data types

**Definition:** ECMAScript has 8 types: 7 **primitives** (immutable, copied by value) and **`object`** (mutable, copied by reference). Functions are objects but `typeof` reports `'function'`.

**How it works:**

- **Primitives** are stored by value — assigning copies the value. Comparison with `===` compares values.
- **Objects** (including arrays, functions, dates) are stored by reference — assigning copies the pointer. `===` compares reference identity.
- **Boxing:** Primitives temporarily wrap in object wrappers when you call methods (`'hi'.toUpperCase()`).
- **Type checks:** `typeof` for primitives (with `null` bug); `Array.isArray`, `Number.isNaN`, `Object.prototype.toString.call` for specifics.
- Object property keys (except `Symbol`) stringify — `{[obj]: 1}` uses `obj.toString()`.

| Situation | Use |
|-----------|-----|
| Is it `null`? | `value === null` (not `typeof`) |
| Is it an array? | `Array.isArray(value)` |
| Is it `NaN`? | `Number.isNaN(value)` |
| Is it a plain object? | `Object.prototype.toString.call(v) === '[object Object]'` |
| Object vs Map key | `Map` for non-string keys; `{}` for JSON DTOs |

| Type        | `typeof`      | Notes                                         |
| ----------- | ------------- | --------------------------------------------- |
| `undefined` | `'undefined'` | Unassigned variable                           |
| `null`      | `'object'` ⚠️ | Intentional empty value — legacy `typeof` bug |
| `boolean`   | `'boolean'`   | `true` / `false`                              |
| `number`    | `'number'`    | IEEE-754 double; `NaN`, `±Infinity`           |
| `bigint`    | `'bigint'`    | Arbitrary integers (`123n`)                   |
| `string`    | `'string'`    | Immutable UTF-16 sequence                     |
| `symbol`    | `'symbol'`    | Unique identifier                             |
| `object`    | `'object'`    | Arrays, dates, plain objects, etc.            |
| `function`  | `'function'`  | Callable object — only `typeof` distinguishes |

Teaching model — frame slots hold primitives or **references**; objects/arrays live on the heap. Not a guaranteed engine layout. Full model: [Memory: stack and heap](#memory-stack-heap).

Primitives temporarily wrap in object wrappers when you access `.method()` — e.g. `'hi'.toUpperCase()`. Avoid `new String()` / `new Number()` — creates object wrappers that break `===` checks.

```js
value === null;                    // null only (not undefined)
value == null;                     // null OR undefined
Array.isArray(value);              // arrays (typeof is 'object')
Number.isNaN(value);               // NaN only (typeof NaN is 'number')
Number.isFinite(value);            // finite number (excludes NaN, ±Infinity)
Object.prototype.toString.call(v); // '[object Array]', '[object Date]', …
```

**Pluses and minuses:**

| + (primitives) | − (primitives) |
|-------------------|-------------------|
| Predictable copy semantics | No methods without boxing |
| Thread-safe in single-threaded JS | `number` has IEEE-754 limits |

| + (objects) | − (objects) |
|--------------|----------------|
| Mutable, extensible | Shared references cause bugs |
| Rich APIs (arrays, dates) | `typeof` too coarse for subtypes |

**Examples:**

```js
const a = { x: 1 };
const b = a;
b.x = 2;
console.log(a.x); // 2 (shared reference)

const s1 = "hi";
const s2 = s1;
// s1 and s2 are independent — strings are immutable primitives
```

### Interesting cases

**`typeof` traps:**

```js
typeof null;              // 'object' — use value === null
typeof [];                // 'object' — use Array.isArray([])
typeof (() => {});        // 'function' — not 'object'
typeof undeclared;        // ReferenceError (not 'undefined')
let x; typeof x;          // 'undefined'
```

**`NaN` and equality:**

```js
typeof NaN;               // 'number'
NaN === NaN;              // false
Object.is(NaN, NaN);      // true
Number.isNaN(NaN);        // true — prefer over global isNaN()
isNaN("hello");           // true — coerces first (footgun)
Number.isNaN("hello");    // false — no coercion
+0 === -0;                // true
Object.is(+0, -0);        // false
```

**Object keys stringify:**

```js
const obj = {};
const key = { id: 1 };
obj[key] = "value";
Object.keys(obj);         // ['[object Object]'] — key coerced to string
```

**Surprising coercion** (see also **Core → Comparison operators**):

```js
[] + [];                  // '' (arrays → strings via toString)
[] + {};                  // '[object Object]'
{} + [];                  // 0 ({} parsed as empty block, then numeric +)
"5" - 1;                  // 4
true + true;              // 2
null + 1;                 // 1
undefined + 1;            // NaN
```

**Falsy values** (everything else is truthy, including `[]`, `{}`, `'0'`):

`false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`

**`bigint` vs `number`:**

```js
1n + 2n;                  // 3n
1n + 1;                   // TypeError — cannot mix bigint and number
Number(1n);               // 1 — explicit conversion required
```

**Symbol keys are hidden from `Object.keys`:**

```js
const id = Symbol('id');
const user = { name: 'Ann', [id]: 42 };
Object.keys(user);         // ['name'] — symbol key omitted
Object.getOwnPropertySymbols(user); // [Symbol(id)]
```

**Wrapper objects break `===`:**

```js
const s = new String('hi');
typeof s;                  // 'object'
s === 'hi';               // false — object wrapper vs primitive
```

**`Map` vs plain `Object`:**

| Use `Map`           | Use plain `Object`          |
| ------------------- | --------------------------- |
| Keys of any type    | JSON serialization needed   |
| Frequent add/delete | Literal config / DTO shapes |
| `.size` needed      | Prototype chain / methods   |

**Sources:** [javascript.info/types](https://learn.javascript.ru/types) · [map-set](https://learn.javascript.ru/map-set)

</details>

<details>
  <summary>type conversions</summary>

### Type conversions

**Definition:** Values convert between types **explicitly** (`String()`, `Number()`, `Boolean()`) or **implicitly** during operations (`+`, `==`, logical contexts). Prefer `===` and explicit conversions in application code.

**How it works:**

- **To string:** `String(x)`, template literals, `+` with a string operand.
- **To number:** `Number(x)`, unary `+x`, arithmetic operators (except `+` with string).
- **To boolean:** `Boolean(x)`, `!!x`, or any logical/`if` context — uses falsy list.
- **`==`** coerces both sides before compare; **`===`** does not.
- `null` and `undefined` are only equal to each other with `==`.

| Use | Avoid |
|-----|-------|
| `Number(value)` for user input | `parseInt` without radix |
| `value == null` for null/undefined check | `==` for general equality |
| `Boolean(x)` or `!!x` when you need a boolean | Relying on implicit coercion in APIs |
| `String(x)` before concatenation | `x + ''` in critical code paths |

| Conversion          | Result / rule                                              |
| ------------------- | ---------------------------------------------------------- |
| `Number(undefined)` | `NaN`                                                      |
| `Number(null)`      | `0`                                                        |
| `Number('')`        | `0`                                                        |
| `Number(' 42 ')`    | `42` (trims whitespace)                                    |
| `Number(true)`      | `1`                                                        |
| `Boolean(0)`        | `false` — see falsy list in **Data types → Interesting cases** |
| `String(123)`       | `'123'`                                                    |
| `parseInt('08', 10)`| `8` — always pass radix                                    |

**When to use:**

#### Common pitfalls

```js
[] + [];                  // '' 
[] + {};                  // '[object Object]'
"5" + 1;                  // '51' — string concat wins
"5" - 1;                  // 4 — numeric coercion
isNaN("hello");           // true — coerces first (footgun)
Number.isNaN("hello");    // false — no coercion
```

**Pluses and minuses:**

| Approach | + | − |
|----------|------|------|
| `===` + explicit `Number()` | Predictable | More verbose |
| `==` | Shorter null checks | Surprising coercion |
| `??` | Only nullish fallback | Must parenthesize with `\|\|` |

**Examples:**

```js
String(true);             // 'true'
Number("123");            // 123
Number("");               // 0
Boolean([]);              // true — only 8 values are falsy
Boolean("0");             // true
null == undefined;        // true
null === undefined;       // false
'' == 0;                  // true
'' === 0;                 // false
```

**Sources:** [javascript.info/type-conversions](https://learn.javascript.ru/type-conversions) · [comparison](https://learn.javascript.ru/comparison)

</details>

<details>
  <summary>array & array methods</summary>

### Arrays & array methods

**Definition:** An array is an ordered, iterable object with numeric indices (`0`, `1`, …) and a `length` property. Elements can be any type, including mixed types. Arrays are **mutable** — methods either mutate in place or return new arrays.

**How it works:**

- Created with `[]`, `new Array(n)`, `Array.from()`, or `Array.of()`.
- Indices are strings internally (`arr[0]` → key `"0"`); `length` auto-updates on indexed assignment.
- Sparse arrays are allowed (`arr[5] = 1` leaves holes); some methods skip holes (`forEach`, `map`).
- Iterable via `Symbol.iterator` — works with `for...of`, spread, destructuring.
- `Array.isArray()` is the reliable type check (`typeof []` is `'object'`).

**When to use:**

| Use `Array` | Use `Set` instead |
|-------------|-------------------|
| Order matters, duplicates OK | Only uniqueness needed |
| Index access (`arr[i]`) | Fast membership checks only |
| `map`/`filter`/`reduce` pipelines | No indexed iteration needed |

| Use mutating methods | Use non-mutating |
|----------------------|------------------|
| Local scratch buffers | Shared state / React state |
| Performance-critical in-place updates | Functional pipelines, immutability |

---

**Pluses and minuses:**

| + | − |
|------|------|
| Rich built-in API | Mutating methods can surprise callers |
| Ordered, indexable | No built-in immutability |
| JSON-serializable | `sort()` default is lexicographic, not numeric |
| Works with HOFs (`map`, `filter`, `reduce`) | Large arrays + frequent `shift`/`unshift` are O(n) |

### Creating & copying arrays

**Definition:** Ways to instantiate arrays and duplicate them without mutating the original.

**How it works:**

- `[]` / `Array.of(1,2)` — literal or explicit elements.
- `new Array(n)` — creates sparse array of length `n` (avoid for `[1,2,3]`).
- `Array.from(iterable, mapFn?)` — copies iterables or array-likes.
- `[...arr]`, `arr.slice()`, `arr.concat()` — **shallow** copies (nested objects still shared).

**When to use:**

| Need | Method |
|------|--------|
| Copy before mutate | `[...arr]` or `arr.slice()` |
| String → char array | `Array.from('hi')` or `[...'hi']` |
| Generate sequence | `Array.from({ length: n }, (_, i) => i)` |
| Merge arrays | `[...a, ...b]` or `a.concat(b)` |

**Pluses and minuses:**

| + | − |
|------|------|
| Spread is concise | Shallow copy only |
| `Array.from` handles array-likes | `new Array(3)` creates holes, not `[0,0,0]` |
| `slice`/`concat` non-mutating | Deep clone needs `structuredClone` or manual walk |

**Examples:**

```js
const a = [1, 2, 3];
const b = Array.from("hi");           // ['h', 'i']
const c = Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]
const copy = [...a];                  // shallow copy
const slice = a.slice(0, 2);          // [1, 2] — non-mutating
const merged = a.concat([4, 5]);      // [1, 2, 3, 4, 5]
```

---

### Mutating vs non-mutating methods

**Definition:** Array methods either change the array **in place** or return a **new** array/value without touching the original.

**How it works:**

- Mutating methods update `length` and indices on the same object — all other references see the change.
- Non-mutating methods allocate new arrays; safe for immutable/React patterns.
- ES2023 added `toSorted`, `toReversed`, `toSpliced`, `with` as non-mutating alternatives.

In React/Redux or when passing arrays around, prefer non-mutating methods or copy first (`[...arr]` then mutate the copy).

---

**When to use:**

| Mutating (changes original) | Non-mutating (returns new) |
|-----------------------------|----------------------------|
| `push`, `pop`, `shift`, `unshift` | `map`, `filter`, `slice`, `concat` |
| `splice`, `sort`, `reverse`, `fill` | `flat`, `flatMap`, `toSorted`, `toReversed` |
| `copyWithin` | `reduce`, `find`, `some`, `every` |

**Pluses and minuses:**

| + (mutating) | − (mutating) |
|-----------------|-----------------|
| No extra allocation | Surprises callers holding same reference |
| Faster for large in-place edits | Breaks time-travel / Redux expectations |

| + (non-mutating) | − (non-mutating) |
|---------------------|---------------------|
| Predictable, debuggable | Extra memory for new arrays |
| Works with React state | Slightly more verbose |

### Transformation & search

**Definition:** Methods to map, filter, fold, and query arrays without manual `for` loops.

**How it works:**

- Callback receives `(element, index, array)` for most methods.
- `map`/`filter` always return new arrays; `reduce` returns any type.
- `find`/`some`/`every` short-circuit — stop when result is determined.
- `forEach` is like `map` but returns `undefined` and cannot be chained.

| Method | Returns | Notes |
|--------|---------|-------|
| `map(fn)` | New array, same length | Transform each element |
| `filter(fn)` | New array, ≤ length | Keep elements where `fn` is truthy |
| `reduce(fn, init?)` | Single accumulated value | `init` required on possibly empty arrays |
| `find(fn)` | First match or `undefined` | Stops early |
| `findIndex(fn)` | Index or `-1` | |
| `some` / `every` | Boolean | Short-circuit |
| `forEach(fn)` | `undefined` | Cannot `break`; use `for...of` if needed |
| `includes(val)` | Boolean | SameValueZero (`NaN` matches `NaN`) |
| `indexOf` / `lastIndexOf` | Index or `-1` | Strict equality, no `NaN` match |

**When to use:** Use `map`+`filter` for pipelines; `reduce` for aggregation; `find` for first match; `some`/`every` for predicates; avoid `forEach` when you need `break` or a return value.

**Pluses and minuses:**

| + | − |
|------|------|
| Declarative, chainable | Callback overhead vs raw `for` |
| Built-in edge cases handled | Easy to nest too deeply |

**Examples:**

```js
const users = [
  { name: "Ann", age: 30 },
  { name: "Bob", age: 17 },
  { name: "Cal", age: 25 },
];

const adultNames = users
  .filter((u) => u.age >= 18)
  .map((u) => u.name);
// ['Ann', 'Cal']
```

```js
[1, 2, 3].reduce((sum, n) => sum + n, 0); // 6
[].reduce((a, b) => a + b);               // TypeError — no initial on empty
[1].reduce((a, b) => a + b);              // 1 — first element used as init
```

---

### Add / remove elements

**Definition:** Methods that change array length and shift elements at ends or middle.

**How it works:**

- `push`/`pop` operate on the end — O(1) amortized.
- `shift`/`unshift` operate on the start — O(n) because indices shift.
- `splice(start, deleteCount, ...items)` removes and/or inserts at any index.

| Method | Effect | Returns |
|--------|--------|---------|
| `push(...items)` | Add to end | New `length` |
| `pop()` | Remove last | Removed item |
| `shift()` | Remove first | Removed item (O(n)) |
| `unshift(...items)` | Add to start | New `length` (O(n)) |
| `splice(start, deleteCount, ...items)` | Remove/insert at index | Array of removed items |

**When to use:** Queue → `push`+`shift` (or use deque pattern); stack → `push`+`pop`; middle edit → `splice` or `toSpliced` (immutable).

**Pluses and minuses:**

| + | − |
|------|------|
| `push`/`pop` are fast | `shift`/`unshift` slow on large arrays |
| `splice` is versatile | Easy to misuse and confuse callers |

**Examples:**

```js
const arr = [1, 2, 3];
arr.splice(1, 1, 99); // removes 2, inserts 99 → [1, 99, 3]
```

---

### `sort`, `flat`, iteration

**Definition:** Ordering, flattening nested arrays, and looping over elements.

**How it works:**

- `sort(compareFn?)` **mutates**; default compares as strings (`10` before `2`).
- `flat(depth?)` shallow-flattens one level by default; `Infinity` for full flatten.
- `for...of` iterates values; `for...in` iterates keys (avoid on arrays).

**When to use:** Numeric sort → `sort((a,b) => a - b)`; nested API data → `flatMap`; iteration → `for...of` or `map`.

**Pluses and minuses:**

| + | − |
|------|------|
| `sort` in-place saves memory | Default string sort surprises |
| `flat`/`flatMap` clean nested data | `flat` allocates new array |

**Examples:**

```js
[10, 1, 2].sort();                    // [1, 10, 2] — string sort!
[10, 1, 2].sort((a, b) => a - b);     // [1, 2, 10] — numeric

[1, [2, [3]]].flat();                 // [1, 2, [3]]
[1, [2, [3]]].flat(Infinity);         // [1, 2, 3]

for (const n of [1, 2, 3]) { }        // prefer over for...in on arrays
for (const [i, v] of arr.entries()) { }
```

---

### Common pitfalls

```js
// Pitfall 1: sort mutates + default string comparison
const nums = [10, 2, 1];
nums.sort(); // mutates to [1, 10, 2]

// Pitfall 2: sparse array holes
const sparse = [1, , 3];
sparse.map((x) => x * 2); // [2, , 6] — hole stays

// Pitfall 3: reference elements — shallow copy
const row = [{ id: 1 }];
const grid = [row];
grid[0][0].id = 99; // mutates shared inner object

// Pitfall 4: for...in includes inherited keys on arrays
for (const k in [1, 2]) { } // may iterate non-index keys
```

**Sources:** [javascript.info/array](https://learn.javascript.ru/array) · [array-methods](https://learn.javascript.ru/array-methods)

</details>

<details>
  <summary>Map & Set & WeakMap & WeakSet</summary>

### Map, Set, WeakMap, WeakSet

**Definition:**

Four built-in collection types beyond plain objects and arrays. `Map` is a key→value store; `Set` is a bag of unique values. `WeakMap` and `WeakSet` are like their strong counterparts but hold **weak** references to object keys/values so garbage collection can reclaim them when nothing else references those objects.

|                       | `Map`                          | `Set`               | `WeakMap`               | `WeakSet`               |
| --------------------- | ------------------------------ | ------------------- | ----------------------- | ----------------------- |
| Stores                | Key → value pairs              | Unique values       | Key (object) → value    | Unique objects          |
| Key / value types     | Any type                       | Any type            | **Objects only** (keys) | **Objects only**        |
| Duplicate keys/values | Keys unique; `set` overwrites  | Values unique       | Keys unique             | Values unique           |
| Iterable              | Yes (`for...of`)               | Yes                 | No                      | No                      |
| `.size`               | Yes                            | Yes                 | No                      | No                      |
| GC                    | Strong refs — keeps keys alive | Strong refs         | Weak refs on **keys**   | Weak refs on **values** |
| Serialization         | No `JSON.stringify`            | No `JSON.stringify` | No                      | No                      |

**Thoughts:**

Use `Map`/`Set` when you need collection semantics (any key type, uniqueness, `.size`, iteration). Use `WeakMap`/`WeakSet` for **side metadata** attached to objects without preventing those objects from being collected.

---

### Map

**Definition:** Ordered collection of `[key, value]` entries. Keys can be any type — primitives, objects, functions, symbols — not just strings/symbols like plain objects.

**How it works:**

- Created with `new Map()` or `new Map(iterable)` where iterable yields `[key, value]` pairs.
- Key lookup uses **SameValueZero** equality (`NaN` equals `NaN`; `+0` equals `-0`).
- Insertion order is preserved; `for...of` iterates entries in that order.
- API: `set`, `get`, `has`, `delete`, `clear`, `size`, `keys`, `values`, `entries`, `forEach`.
- Object keys are stored **by reference**, not by stringified form — two different `{id:1}` objects are two different keys.

**When to use:**

| Use `Map`                                                             | Use plain `Object`                             |
| --------------------------------------------------------------------- | ---------------------------------------------- |
| Keys are objects, DOM nodes, or non-strings                           | JSON serialization / REST DTO                  |
| Frequent add/delete of entries                                        | Fixed shape config literals                    |
| Need `.size` or insertion-order iteration                             | Need `Object.keys` / spread ergonomics         |
| Keys should not collide via `toString()` (`{}` → `"[object Object]"`) | Prototype methods or `hasOwnProperty` patterns |

**Pluses and minuses:**

| +                                                   | −                                                             |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| Any key type (objects, functions)                      | No JSON serialization                                            |
| Predictable iteration order                            | Slightly more memory than plain object for string-key-only cases |
| `.size` in O(1)                                        | No prototype chain / no inherited keys                           |
| Frequent `set`/`delete` without key-stringify overhead | Less familiar to readers expecting `{}`                          |

**Examples:**

```js
const user = { id: 1 };
const meta = new Map([
  ["name", "Ann"],
  [user, { lastLogin: Date.now() }], // object as key
]);

meta.set(42, "answer");
meta.get(user); // { lastLogin: ... }
meta.has("name"); // true
meta.size; // 3

for (const [key, value] of meta) {
  console.log(key, value);
}

// SameValueZero
const m = new Map();
m.set(NaN, "not a number");
m.get(NaN); // 'not a number'
```

---

### Set

**Definition:** Ordered collection of **unique** values. Adding a duplicate is a no-op (same value per SameValueZero).

**How it works:**

- Created with `new Set()` or `new Set(iterable)`.
- `add`, `has`, `delete`, `clear`, `size`, iteration via `for...of` / `values()` (same as entries for a set).
- Uniqueness is by value (SameValueZero), not by reference identity for primitives.
- Two different object references are always distinct entries.

**When to use:**

| Use `Set`                                  | Use `Array`                                  |
| ------------------------------------------ | -------------------------------------------- |
| Uniqueness (`[...new Set(arr)]`)           | Order + duplicates matter                    |
| Fast membership checks in a loop           | Need `map`/`filter`/`reduce` on indexed data |
| Tag lists, visited nodes, permission flags | JSON-serializable list                       |

**Pluses and minuses:**

| +                                  | −                               |
| ------------------------------------- | ---------------------------------- |
| O(1) average `has` / `add` / `delete` | No index access (`set[0]` invalid) |
| Deduplication in one line             | No key→value mapping               |
| Iterable, spread-friendly             | Objects compared by reference only |

**Examples:**

```js
const tags = new Set(["js", "react", "js"]); // {'js', 'react'}
tags.add("ts");
tags.has("js"); // true
tags.delete("react");

// Deduplicate array
const unique = [...new Set([1, 2, 2, 3])]; // [1, 2, 3]

// Set operations
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
const intersection = [...a].filter((x) => b.has(x)); // [2, 3]

// Objects: reference identity
const s = new Set();
s.add({ id: 1 });
s.add({ id: 1 });
s.size; // 2 — two different object references
```

---

### WeakMap

**Definition:** Map-like structure whose **keys must be objects** (or registered symbols in some engines). Keys are held **weakly**: if the key object has no other strong references, it and its entry can be garbage-collected. Values are held strongly.

**How it works:**

- Only methods: `get`, `set`, `has`, `delete` — no `size`, `clear`, or iteration.
- You cannot list keys — the API is intentionally minimal so GC can run without exposing dead keys.
- Typical pattern: private/side data on objects you do not own (DOM nodes, class instances).
- If the key is collected, `get(key)` would not be callable anyway; the entry disappears silently.

**When to use:**

| Use `WeakMap`                                           | Use `Map` instead                |
| ------------------------------------------------------- | -------------------------------- |
| Cache or metadata keyed by object identity              | Need to iterate entries          |
| DOM node → handler state (browser)                      | Keys include primitives          |
| Private fields pattern before `#` or `Symbol`           | Need `.size` or `clear()`        |
| Instance → computed cache that should die with instance | Long-lived registry of all items |

**Pluses and minuses:**

| +                                                        | −                                         |
| ----------------------------------------------------------- | -------------------------------------------- |
| No memory leaks from cached metadata on short-lived objects | Cannot iterate or get `.size`                |
| Good for libraries attaching data to foreign objects        | Keys must be objects                         |
| Hides data from `Object.keys` / serialization               | Cannot inspect contents for debugging easily |

**Examples:**

```js
const privateData = new WeakMap();

class User {
  constructor(name) {
    privateData.set(this, { name, visits: 0 });
  }
  getName() {
    return privateData.get(this).name;
  }
  visit() {
    privateData.get(this).visits++;
  }
}

const u = new User("Ann");
u.visit();
// When `u` is no longer referenced, the WeakMap entry is GC-eligible.

// DOM metadata (browser)
const listeners = new WeakMap();
function track(el, handler) {
  listeners.set(el, handler);
  // When `el` is removed from DOM and unreferenced, entry can be collected.
}
```

---

### WeakSet

**Definition:** Set-like structure that only accepts **objects**. Membership is a weak reference — if an object has no other strong refs, it drops out of the set automatically.

**How it works:**

- Methods: `add`, `has`, `delete` — no iteration, no `size`, no `clear`.
- `add` returns the set (like `Set`).
- Useful as a **tag set**: "have we already processed this object?"

**When to use:**

| Use `WeakSet`                              | Use `Set` instead                  |
| ------------------------------------------ | ---------------------------------- |
| Mark objects as visited/processed          | Store primitives                   |
| Opt-out / blocklist of object instances    | Need to iterate or count members   |
| Prevent double-registration of same object | Persist membership across sessions |

**Pluses and minuses:**

| +                                           | −                         |
| ---------------------------------------------- | ---------------------------- |
| Automatic cleanup when objects go away         | No way to list members       |
| Cheap "seen this object?" checks               | Objects only                 |
| Avoids leaking memory in long-lived registries | Cannot serialize or snapshot |

**Examples:**

```js
const processed = new WeakSet();

function handleOnce(obj) {
  if (processed.has(obj)) return;
  processed.add(obj);
  // ... expensive work
}

const node = document.createElement("div");
handleOnce(node);
handleOnce(node); // skipped

// Circular structures — WeakSet detects revisiting same object
function deepWalk(obj, seen = new WeakSet()) {
  if (obj && typeof obj === "object") {
    if (seen.has(obj)) return;
    seen.add(obj);
    for (const v of Object.values(obj)) deepWalk(v, seen);
  }
}
```

---

### Map/Set vs WeakMap/WeakSet — decision guide

```text
Need primitives as keys/values?     → Map / Set
Need to loop or know .size?          → Map / Set
Attach hidden data to objects?       → WeakMap
Tag "already seen" object refs?      → WeakSet
Prevent GC of keys/values?           → Map / Set (strong refs)
Let GC reclaim when object unused?   → WeakMap / WeakSet
```

**Common pitfalls:**

```js
// Pitfall 1: object keys in Map — must keep same reference
const key = { id: 1 };
const map = new Map([[key, "a"]]);
map.get({ id: 1 }); // undefined — different object
map.get(key); // 'a'

// Pitfall 2: WeakMap key collected → entry gone (by design)
let obj = {};
const wm = new WeakMap();
wm.set(obj, "data");
obj = null; // eventually GC removes the entry

// Pitfall 3: Set dedupe uses SameValueZero, not deep equality
new Set([{ a: 1 }, { a: 1 }]).size; // 2
```

**Sources:** [javascript.info/map-set](https://learn.javascript.ru/map-set) · [weakmap-weakset](https://learn.javascript.ru/weakmap-weakset) · [MDN Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

</details>

<details>
  <summary>plain objects & Object utilities</summary>

### Plain objects & Object utilities

**Definition:** A **plain object** is `{}` or `new Object()` — a collection of key–value properties. `Object.*` static methods operate on objects without needing an instance.

**How it works:**

- Keys are strings or `Symbol`; other types stringify (`{[obj]: 1}` → `"[object Object]"`).
- Property access: dot `obj.key` or bracket `obj['key']` / `obj[expr]`.
- Shorthand: `{ name, age }` equals `{ name: name, age: age }`; computed keys `{ [dynamic]: 1 }`.
- `in` checks the prototype chain; `Object.hasOwn(obj, key)` checks own properties only.
- Spread / `Object.assign` shallow-merge objects.

| Method | Returns |
|--------|---------|
| `Object.keys(obj)` | Own enumerable string keys |
| `Object.values(obj)` | Own enumerable values |
| `Object.entries(obj)` | `[key, value]` pairs |
| `Object.assign(target, ...src)` | Target after shallow merge |
| `Object.hasOwn(obj, prop)` | Boolean (own prop) |
| `Object.freeze(obj)` | Frozen object (shallow) |

| | `key in obj` | `Object.hasOwn(obj, key)` |
|---|--------------|---------------------------|
| Own property | yes | yes |
| Inherited property | yes | no |
| Use when | Need to know if property exists anywhere | Need own keys only (safe `for...in` filter) |

**When to use:** Config objects, API payloads, maps with string keys. Use `Map` for non-string keys; see [3_js_oop.md](./3_js_oop.md) for prototypes, descriptors, and deep object patterns.

**Pluses and minuses:**

| + | − |
|------|------|
| JSON-friendly DTOs | Keys always stringify to string/Symbol |
| Literal syntax is concise | Shared references on shallow copy |
| `Object.entries` + `fromEntries` for transforms | No guaranteed iteration order before ES2015 (now insertion order for string keys) |

**Examples:**

```js
const user = { name: "Ann", age: 30 };
const { name, ...rest } = user;

"age" in user;              // true
Object.hasOwn(user, "age"); // true
Object.hasOwn(user, "toString"); // false — inherited

const merged = { ...defaults, ...user };
const pairs = Object.fromEntries(
  Object.entries(user).map(([k, v]) => [k, String(v)])
);
```

**Sources:** [javascript.info/object](https://learn.javascript.ru/object) · [object-keys](https://learn.javascript.ru/keys-values-entries)

</details>

<details>
  <summary>strings & template literals</summary>

### Strings & template literals

**Definition:** `string` is an immutable UTF-16 primitive. **Template literals** (backticks) support interpolation and multiline text.

**How it works:**

- Strings are immutable — methods return new strings.
- Template literals: `` `Hello ${name}` `` embed expressions; multiline without `\n`.
- Escape sequences: `\n`, `\t`, `\u{1F600}` (unicode).
- Common methods: `slice`, `includes`, `startsWith`, `trim`, `split`, `replace`, `replaceAll`.

**When to use:** User-facing text, URL building, `split`/`join` parsing, regex on strings. Use `trim()` on form input; `includes` for simple search before RegExp.

**Pluses and minuses:**

| + | − |
|------|------|
| Immutable — safe to share | Concat in loops can be slow (use `join` or array + join) |
| Rich string API | UTF-16 — surrogate pairs affect `.length` |
| Templates readable for HTML/SQL | Tagged templates advanced (see MDN) |

**Examples:**

```js
const name = "Ann";
const greeting = `Hello, ${name}!`;
const multiline = `line 1
line 2`;

"  hi  ".trim();           // 'hi'
"a-b-c".split("-");       // ['a','b','c']
["a", "b"].join("-");     // 'a-b'
"hello".includes("ell");  // true
"hello".replaceAll("l", "L"); // 'heLLo'
```

**Sources:** [javascript.info/string](https://learn.javascript.ru/string) · [template-strings](https://learn.javascript.ru/template-strings)

</details>

<details>
  <summary>Symbol</summary>

### Symbol

**Definition:** `symbol` is a primitive for **unique identifiers** — every `Symbol()` is distinct even with the same description.

**How it works:**

- Created with `Symbol('description')` or `Symbol.for('globalKey')` (global registry).
- Used as object keys that won't collide with string keys or other libraries.
- Symbol keys are **omitted** from `Object.keys`, `JSON.stringify`, and `for...in`.
- Use `Object.getOwnPropertySymbols(obj)` or `Reflect.ownKeys` to list them.
- Well-known symbols: `Symbol.iterator`, `Symbol.toStringTag`, `Symbol.hasInstance`.

**When to use:** Private-ish object metadata, library extension points, defining custom iterables. Prefer `class` private fields `#x` for true class privacy in modern code.

**Pluses and minuses:**

| + | − |
|------|------|
| Guaranteed unique keys | Not JSON-serializable |
| Hides internal properties | Harder to debug/inspect |
| Powers iteration protocol | Easy to overuse |

**Examples:**

```js
const id = Symbol("id");
const user = { name: "Ann", [id]: 42 };

Object.keys(user);                    // ['name']
user[id];                             // 42
Symbol.for("app") === Symbol.for("app"); // true — global registry
```

**Sources:** [javascript.info/symbol](https://learn.javascript.ru/symbol)

</details>

<details>
  <summary>JSON</summary>

### JSON

**Definition:** **JSON** (JavaScript Object Notation) is the most common text format for exchanging data between apps. It looks like a JS object, but it is a language-independent spec ([ECMA-404](https://www.ecma-international.org/publications-and-standards/standards/ecma-404/)); how JS uses it is in ECMAScript. Files use the `.json` extension (`package.json` is the best-known example).

**How it works:**

JSON is key–value pairs separated by `,`. A key is always a **double-quoted string**; `:` separates key and value. Values may be:

| Type | Example |
|------|---------|
| String | `"I love JSON!"` |
| Number | `21` |
| Boolean | `true` / `false` |
| Array | `[18, true, "lost"]` |
| Object | `{"isValid": true}` |
| `null` | `null` |

Typical network flow: request → wait → receive JSON text → `JSON.parse` → use JS values. `fetch` helpers: `await res.json()`.

**`JSON.stringify(value[, replacer, space])`** — JS value → JSON **string**. Result type is `'string'` (or `undefined` for a lone function/`undefined`/`Symbol`).

Omitted (object properties): `undefined`, functions/methods, `Symbol` values, **Symbol keys** (even with `replacer`). Only **enumerable own** properties are visited (`Object.keys` order).

Become `null`: `Infinity`, `NaN`; `undefined` **inside arrays**. `Map` / `Set` stringify to `{}` (no enumerable own data keys).

Throws **`TypeError`:** circular references, `BigInt` (unless you add `toJSON`). `Date` / `Temporal` use `toJSON()` (ISO string); parse does **not** revive them as dates.

`replacer` — array of keys (only those properties) or `(key, value) =>` transform; return `undefined` to skip. `space` — number of spaces (clamped to 10) or a string indent for readability (`JSON.stringify(obj, null, 2)`). Custom `toJSON()` on an object overrides serialization.

**`JSON.parse(text[, reviver])`** — JSON string → JS value. Invalid JSON → **`SyntaxError`**. Wrap untrusted input in `try/catch`. `reviver(key, value)` runs depth-first; return `undefined` to delete a property. Use it to revive `Date` from ISO strings.

**When to use:**

REST/API payloads, `localStorage` strings, npm `package.json` and other config, app state sent to a backend. Alternatives: **XML**, **YAML** (comments), Protobuf/MessagePack (size). Deep-clone JSON-safe data with a round-trip; use `structuredClone` for cycles/`Date`/`Map`. JSON5 exists as a looser dialect — not the language standard.

#### Common pitfalls

- Keys/strings must use **double quotes**; trailing commas and JS comments are invalid.
- `undefined` in an object is dropped; in an array it becomes `null`.
- `JSON.parse(JSON.stringify(obj))` loses functions, `undefined`, symbols, turns `Date` into a string, throws on cycles.
- `JSON.parse` does not run JS — no `new Date(...)` inside the text.
- Network APIs (e.g. OpenWeather) return JSON; still parse/validate at the boundary.

**Pluses and minuses:**

| + | − |
|------|------|
| Universal API / config format | Not a full clone (types, functions, `undefined` lost) |
| Built-in, fast, human-readable | Circular refs / `BigInt` throw |
| Pretty-print with `space` | No comments in standard JSON (`//` is invalid) |
| Most languages have libraries | No schema validation built-in |

**Examples:**

```js
const hero = {
  nickname: "BestHealerEver",
  level: 7,
  things: ["sword", "helmet"],
  money: { gold: 6387, diamonds: 2 },
};

typeof hero;                 // 'object'
typeof JSON.stringify(hero); // 'string'
JSON.stringify(hero, ['nickname', 'level'], 2);
// pretty JSON with only those keys

const json =
  '{"name":"Luke Skywalker","gender":"male","birth_year":"19BBY"}';
const jedi = JSON.parse(json);
jedi.name; // 'Luke Skywalker'

JSON.stringify({ fn() {}, n: NaN, u: undefined }); // '{"n":null}'
JSON.stringify([undefined]); // '[null]'
JSON.parse("{ invalid");     // SyntaxError
```

**Thoughts:** *JSON is a strict data subset of JS object syntax — stringify to send, parse to use, and never treat it as a full object clone.*

**Sources:** [Doka — JSON](https://doka.guide/js/json/) · [javascript.info/json](https://javascript.info/json) · [MDN stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) · [MDN parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

</details>

<details>
  <summary>globalThis</summary>

### globalThis

**Definition:** Standard way to access the global object in any environment (browser `window`, Node `global`, workers `self`).

**How it works:**

- `globalThis` is the same object across realms in a given JS environment.
- In strict mode, bare `this` at top level is `undefined`, not global — use `globalThis` when you truly need global.
- Prefer module scope or explicit exports over polluting global.

**When to use:** Library UMD bundles, test setup, rare polyfills. Avoid attaching app state to `globalThis`.

**Pluses and minuses:**

| + | − |
|------|------|
| Cross-environment API | Global pollution anti-pattern |
| Polyfill-friendly | |

**Examples:**

```js
globalThis.setTimeout(fn, 0); // works in browser and Node
```

**Sources:** [MDN globalThis](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis)

</details>

<a name="scope-closures"></a>

## Scope & closures

<details>
  <summary>variables, scope & hoisting</summary>

### Variables, scope & hoisting

**Definition:** Variables are named bindings stored in a **lexical environment**. **Scope** determines where a binding is visible. **Hoisting** registers declarations before the line runs — but `let`/`const` stay in the **temporal dead zone (TDZ)** until initialized.

**How it works:**

- Each scope (global, function, block) has an Environment Record holding bindings.
- Inner scopes link to outer via `[[OuterEnv]]` — this chain enables **closures**.
- `var` is hoisted to function scope as `undefined`; you can read it before assignment.
- `let`/`const` are hoisted but inaccessible until their declaration line (TDZ).
- Function **declarations** are hoisted with their full body; **expressions** are not.
- `const` prevents rebinding the variable; object/array contents remain mutable.

|          | `var`       | `let` | `const`      |
| -------- | ----------- | ----- | ------------ |
| Scope    | function    | block | block        |
| Hoisting | `undefined` | TDZ   | TDZ          |
| Redeclare in same scope | yes | no | no |
| Reassign | yes         | yes   | no (binding) |

**When to use:**

| Use | Avoid |
|-----|-------|
| `const` by default | `var` in new code |
| `let` when rebinding (`for` counter, accumulators) | `const` for values you will reassign |
| Block scope in `if`/`for` for temporary bindings | Relying on hoisting for logic flow |

---

**Pluses and minuses:**

| + (`const`/`let`) | − (`var`) |
|----------------------|--------------|
| Block scope limits leaks | Function scope ignores `{}` blocks |
| TDZ catches use-before-declare bugs | Hoisted `undefined` hides mistakes |
| No accidental redeclaration | Loop closure bugs with `var` + async |

### Scope types

**Definition:** Three visibility levels — global, function, and block.

**How it works:**

- **Global** — module/script top level; in browsers, `var` also attaches to `window`.
- **Function** — parameters and `var`/`let`/`const` inside function body.
- **Block** — `let`/`const` inside `{}`, `if`, `for`, `while`.

**When to use:**

Use block scope for temporaries; function scope only via `var` (legacy).

| Scope    | Created by                        | Example |
| -------- | --------------------------------- | ------- |
| Global   | Script/module top level           | `const API_URL = '...'` |
| Function | `function` declaration/expression | `function f() { const x = 1; }` |
| Block    | `{ }` with `let`/`const`          | `if (ok) { const tmp = 1; }` |

```js
const global = 1;

function outer() {
  const local = 2;
  if (true) {
    const block = 3;
    // block visible here only
  }
  // console.log(block); // ReferenceError
}
```

---

**Pluses and minuses:**

| + (block scope) | − |
|--------------------|------|
| Limits variable lifetime | Must choose correct keyword |
| Prevents leak from `if`/`for` | |

### Hoisting & TDZ

**Definition:** Engine registers declarations before executing statements; `let`/`const` stay in TDZ until their line.

**How it works:**

- Parsing phase records bindings; execution phase assigns values.
- `var` bindings exist as `undefined` from start of scope.
- Accessing `let`/`const` before declaration → `ReferenceError` (TDZ).
- `typeof undeclaredVar` is safe; `typeof letBeforeDeclare` in TDZ throws.

Each function call gets a context (variable environment, `this`, call stack frame). The **lexical environment** is where closures get their outer bindings from — determined by **where code is written**, not where it runs.

---

**When to use:**

Never use variables before declaration; use function declarations if you need hoisted helpers.

| Declaration            | Hoisted as          |
| ---------------------- | ------------------- |
| `var`                  | `undefined`         |
| `function` declaration | Full function       |
| `let`/`const`          | TDZ until line runs |

```js
sayHi(); // works — declaration hoisted
function sayHi() {
  console.log("Hi");
}

console.log(a); // undefined — var hoisted
var a = 1;

// console.log(b); // ReferenceError — TDZ
let b = 2;
```

**Pluses and minuses:**

| + (TDZ) | − |
|------------|------|
| Catches bugs early | Surprises developers from other languages |

### `var` loop pitfall vs `let`

**Definition:** `var` in `for` creates one binding for the whole loop; `let` creates a new binding per iteration.

**How it works:**

- `var i` is function-scoped — all closures share the same `i` after loop ends.
- `let i` is block-scoped per iteration — each async callback captures its own `i`.

camelCase; letters, digits, `$`, `_`; cannot start with digit; avoid reserved words.

**When to use:** Always `let` in `for` loops with closures; use `for...of` when you don't need index.

**Pluses and minuses:**

| + (`let` in loops) | − (`var` in loops) |
|-----------------------|------------------------|
| Correct async callbacks | — |
| Per-iteration capture | `var` causes classic interview bug |

**Examples:**

```js
// var — one shared binding
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3, 3, 3
}

// let — new binding per iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0, 1, 2
}
```

**Sources:** [javascript.info/variables](https://learn.javascript.ru/variables) · [let-const](https://learn.javascript.ru/let-const) · [closure](https://learn.javascript.ru/closure)

</details>

<details>
  <summary>rest, spread & destructuring</summary>

### Rest, spread & destructuring

**Definition:** **Destructuring** unpacks arrays/objects into variables. **Rest** (`...rest`) collects remaining items into a new array/object. **Spread** (`...iterable`) expands iterables into elements or object properties.

**How it works:**

- Array destructuring matches by position; object destructuring by property name.
- Rest must be last in a pattern; creates a **shallow** copy of remaining properties.
- Spread in literals creates shallow copies — nested objects are still shared references.
- Function rest parameters replace `arguments` object in modern code.

**When to use:**

| Feature | Use when |
|---------|----------|
| Array destructuring | Swap values, parse tuple returns |
| Object destructuring | Props, API responses, options objects |
| Rest in destructuring | Omit fields (`const { password, ...safe } = user`) |
| Spread merge | Immutable object/array updates |
| Rest parameters | Variadic functions (`sum(...nums)`) |

#### Common pitfalls

```js
// Pitfall: nested destructuring — undefined parent throws
const { address: { city } } = {}; // TypeError

// Pitfall: spread is shallow
const inner = { x: 1 };
const outer = { ...inner };
outer.x = 2;
inner.x; // still 1 — but:
const nested = { data: inner };
const clone = { ...nested };
clone.data.x = 99;
inner.x; // 99 — shared nested reference
```

**Pluses and minuses:**

| + | − |
|------|------|
| Concise unpacking | Easy to shadow outer variable names |
| Immutable-style updates with spread | Shallow only — nested refs shared |
| Replaces `arguments` | Rest must be last position |

**Examples:**

```js
// Array
const [first, second, ...rest] = [1, 2, 3, 4];
// first=1, second=2, rest=[3,4]

const [a, b] = [b, a]; // swap (with let/var)

// Object
const { name, age = 18 } = { name: "Ann" };
const { id, ...withoutId } = { id: 1, name: "Ann" };

// Function rest
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}

// Spread — shallow copy / merge
const merged = { ...defaults, ...userOverrides };
const copy = [...arr, newItem];
```

**Sources:** [javascript.info/destructuring-assignment](https://learn.javascript.ru/destructuring-assignment) · [rest-parameters-spread](https://learn.javascript.ru/rest-parameters-spread)

</details>

<details>
  <summary>closures</summary>

### Closures

**Definition:** A **closure** is a function plus its lexical environment — the function retains access to outer bindings even after the outer function returns. In JS, **every function** is a closure (except `new Function()` bodies, which use global scope).

**How it works:**

- When a function is created, it captures a reference to its outer lexical environment (`[[Environment]]`).
- Outer variables stay alive while **any** inner function referencing them is reachable.
- Closures enable factories, private state, partial application, and module patterns.
- `let` in loops creates per-iteration bindings; `var` shares one binding (classic async loop bug).

**When to use:**

| Use closures | Avoid |
|--------------|-------|
| Module pattern, counters, memoization | Storing large objects "just in case" |
| Event handlers needing outer state | Creating closures in hot loops without need |
| `makeFilter(min)` style factories | Replacing simple data with functions |

#### Common pitfalls

```js
// Pitfall: stale closure over mutable outer let
let count = 0;
const fns = [];
for (let i = 0; i < 3; i++) {
  fns.push(() => count); // all see same count
}
count = 99;
fns[0](); // 99

// Pitfall: accidental memory — closure holds entire outer scope
function big() {
  const huge = new Array(1e6);
  return () => huge.length; // keeps huge alive
}
```

**Pluses and minuses:**

| + | − |
|------|------|
| Data privacy without classes | Memory — outer vars kept alive by closure |
| Factories and configurators | Accidental capture of loop `var` |
| Partial application, decorators | Harder debugging if over-nested |

**Examples:**

```js
function createCounter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    get: () => count,
  };
}
const c = createCounter(10);
c.increment(); // 11
```

```js
function makeFilter(min) {
  return (arr) => arr.filter((n) => n >= min);
}
const over5 = makeFilter(5);
over5([1, 6, 3, 8]); // [6, 8]
```

```js
function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}
```

**Sources:** [javascript.info/closure](https://learn.javascript.ru/closure) · [garbage-collection](https://learn.javascript.ru/garbage-collection)

</details>

<a name="functions"></a>

## Functions

<details>
  <summary>functions — core</summary>

### Functions — core

**Definition:** Functions are **first-class** callable objects: assignable to variables, passed as arguments, returned from other functions, and stored in data structures. They are the primary unit of behavior in JS.

**How it works:**

- Invoked with `()`; optional `return` (defaults to `undefined`).
- Parameters are local bindings; default values apply when argument is `undefined`.
- **Higher-order functions (HOF)** take and/or return other functions (`map`, `filter`, decorators).
- **Callbacks** are functions passed to run later (sync in `sort`, async in `setTimeout`).
- `this` is set by **call site** for regular functions; **lexical** for arrows (see below).

---

**Pluses and minuses:**

| + | − |
|------|------|
| First-class — flexible composition | `this` binding confuses beginners |
| Closures for encapsulation | Callback nesting without promises |
| Arrow syntax for short callbacks | Arrows unsuitable as methods/constructors |

### Function declaration vs expression

**Definition:** Declarations are hoisted with full body; expressions are created when execution reaches them.

**How it works:**

- **Declaration** `function f() {}` — registered at parse time in scope; callable before the line.
- **Expression** `const f = function() {}` — function object created at runtime when assignment runs.
- **NFE** (Named Function Expression) — internal name visible inside for recursion; outer scope still uses `const` name.
- Both create functions with dynamic `this` (unless arrow).

|          | Declaration              | Expression                |
| -------- | ------------------------ | ------------------------- |
| Syntax   | `function f() {}`        | `const f = function() {}` |
| Hoisting | Yes — callable before line | No |
| Name     | Required                 | Optional (NFE for recursion) |
| `this`   | Dynamic                  | Dynamic (unless arrow) |

**When to use:**

| Declaration | Expression / arrow |
|-------------|-------------------|
| Top-level helpers, hoisting needed | Callbacks, assignments, conditional creation |
| Named stack traces | IIFE, module exports |

**Pluses and minuses:**

| + (declaration) | − (declaration) |
|--------------------|--------------------|
| Hoisting simplifies top-down scripts | Cannot conditionally declare in block (legacy quirks) |
| Clear named entry points | Less flexible than expressions |

| + (expression) | − (expression) |
|-------------------|-------------------|
| Assign to `const`, pass inline | Not hoisted — order matters |
| Conditional creation | Anonymous stacks harder to read |

**Examples:**

```js
// Declaration — hoisted
log("a");
function log(x) {
  console.log(x);
}

// Named Function Expression — safe recursion
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};

// Anonymous expression — assigned to const
const double = function (n) {
  return n * 2;
};
```

---

### Arrow functions

**Definition:** Shorthand `() => {}` with **lexical** `this`, `arguments`, and no `new`.

**How it works:**

- No own `this` — inherits from enclosing lexical scope at **definition** time.
- No `arguments` object — use rest `...args`.
- Cannot be used as constructor (`new` throws).
- Concise body: `(x) => x * 2` implicit return; `() => { return x; }` for block body.
- Always anonymous in syntax (name inferred from variable in assignments).

|             | Arrow   | Regular          |
| ----------- | ------- | ---------------- |
| `this`      | Lexical (from outer scope) | Dynamic (call site) |
| `arguments` | No — use rest `...args` | Yes |
| `new`       | No      | Yes              |
| Hoisting    | No      | Declaration: yes |
| Methods     | Poor choice for object methods | Use for `obj.method()` |

**When to use:**

| Use arrows | Use regular `function` |
|------------|----------------------|
| Callbacks (`map`, `forEach`, promises) | Object methods needing dynamic `this` |
| Lexical `this` in class field handlers | Constructors, generators |
| Short one-liners | When you need `arguments` |

**Pluses and minuses:**

| + | − |
|------|------|
| Short syntax for callbacks | Wrong `this` as object method |
| Fixes `this` in class handlers | No `arguments`, no `new` |
| Implicit return for one-liners | Debugging anonymous stacks |

**Examples:**

const add = (a, b) => a + b;

const obj = {
  items: [1, 2, 3],
  // arrow — lexical this (likely wrong for methods)
  logItems: () => this.items, // undefined in strict module

  // regular — dynamic this
  sum() {
    return this.items.reduce((a, b) => a + b, 0);
  },
};
```

---

### Callbacks

**Definition:** A function passed into another function to invoke at the right time.

**How it works:**

- Caller controls **when** the callback runs (sync immediately, async later, on event).
- Sync: `array.map(cb)` calls `cb` per element before returning.
- Async: `setTimeout(cb, 0)` queues `cb` on macrotask queue.
- Error-first (Node): `cb(err, result)` — first arg signals failure.

| Pattern        | Use                            |
| -------------- | ------------------------------ |
| Sync callback  | `array.map`, `sort` comparator |
| Async callback | `setTimeout`, event handlers   |
| Error-first    | Node-style `(err, data)`       |

**When to use:** Array methods, event APIs, legacy Node APIs. Prefer `async/await` for new async chains (see [3_js_async.md](./3_js_async.md)).

**Pluses and minuses:**

| + | − |
|------|------|
| Simple async before Promises | Deep nesting ("callback hell") |
| Flexible control flow | Inversion of control — harder to trace |
| Works everywhere (DOM, Node) | Error handling scattered |

**Examples:**

[1, 2, 3].map((n) => n * 2);

function load(done) {
  setTimeout(() => done(null, "data"), 100);
}
load((err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
```

---

### Pure vs impure functions

**Definition:** A **pure** function returns the same output for the same inputs and causes no observable side effects.

**How it works:**

- **Pure:** depends only on arguments; no reads/writes to outer state, DOM, network, `console`.
- **Impure:** mutates external variables, I/O, random time, throws based on global state.
- Purity is a spectrum — `console.log` inside makes a function impure but may be acceptable at boundaries.

| Pure                      | Impure                    |
| ------------------------- | ------------------------- |
| `(a, b) => a + b`         | Mutates external state    |
| Predictable, testable     | `console.log`, DOM, I/O   |
| Referentially transparent | `Date.now()`, `Math.random()` |

**When to use:** Use pure functions for reducers, selectors, utilities, anything you memoize. Keep impure I/O in thin wrappers at app boundaries. Even **reading** `Date.now()` / `Math.random()` is impure — external code may mutate hidden state.

**Pluses and minuses:**

| + (pure) | − (pure) |
|-------------|-------------|
| Easy to test and memoize | I/O must live at edges |
| Safe to parallelize/reorder | Can feel verbose for UI |

| + (impure) | − (impure) |
|---------------|---------------|
| Natural for I/O and UI | Harder to reason about order |
| Direct state updates | Breaks caching assumptions |

**Examples:**

const add = (a, b) => a + b; // pure

let total = 0;
const addToTotal = (n) => {
  total += n;
}; // impure — mutates outer state

const greet = (name) => {
  console.log(`Hi ${name}`);
}; // impure — side effect
```

---

### `this` binding rules

**See also:** [7_special.md — Pure functions & side effects](./7_special.md) · [Functional core, imperative shell](./7_special.md#functional-core-imperative-shell)

**Definition:** For regular functions, `this` is determined by **how** the function is called, not where it is defined. Arrow functions inherit `this` lexically.

**How it works:**

- `obj.method()` — `this` is `obj`.
- Bare `fn()` — `this` is `undefined` (strict) or `globalThis` (sloppy).
- `new Fn()` — `this` is the new instance.
- `fn.call(ctx, ...)` / `apply` / `bind` — `this` is explicit.
- Arrow — `this` frozen from outer scope at creation; **cannot** be rebound with `call`/`bind`.

| Call pattern          | `this`       |
| --------------------- | ------------ |
| `obj.method()`        | `obj`        |
| `func()` strict       | `undefined`  |
| `func()` sloppy       | `globalThis` |
| `new Func()`          | new instance |
| `call`/`apply`/`bind` | explicit     |
| Arrow                 | lexical (outer `this`) |

**When to use:** Object methods → regular `function` or method shorthand; React class handlers → `bind` or arrows; utilities with no `this` → arrows or strict bare calls.

**Pluses and minuses:**

| + (dynamic `this`) | − |
|-----------------------|------|
| Flexible method reuse | Context loss when extracting methods |
| OOP patterns | Confusing in callbacks without arrows/bind |

**Examples:**

const obj = { x: 10, getX() { return this.x; } };
const getX = obj.getX;
getX(); // undefined (strict)
getX.call(obj); // 10
const bound = obj.getX.bind(obj);
```

**Default parameters & rest:**

```js
function greet(name = "Guest", ...tags) {
  return `Hello, ${name}`;
}
```

**Sources:** [javascript.info/function-basics](https://learn.javascript.ru/function-basics) · [function-expressions](https://learn.javascript.ru/function-expressions) · [arrow-functions-basics](https://learn.javascript.ru/arrow-functions-basics) · [callbacks](https://learn.javascript.ru/callbacks) · [object-methods](https://learn.javascript.ru/object-methods)

</details>

<details>
  <summary>functions — advanced</summary>

### Functions — advanced

Topics beyond declarations and arrows: HOFs, memoization, currying, `new`, IIFE, generators, recursion.

---

### Higher-order functions (HOF)

**Definition:** Functions that take functions as arguments and/or return functions.

**How it works:**

- **Accepts callback:** `arr.map(fn)` — HOF calls `fn` per element.
- **Returns function:** decorators wrap behavior (`timed(fn)`, `memoize(fn)`).
- Enables composition without duplicating control-flow logic.

**When to use:** Array methods, middleware, decorators, event wiring, `once`/`debounce` wrappers.

**Pluses and minuses:**

| + | − |
|------|------|
| Reusable patterns (`map`, decorators) | Can obscure flow if over-nested |
| Declarative pipelines | Harder stack traces |

**Examples:**

const evens = [1, 2, 3, 4].filter((n) => n % 2 === 0).map((n) => n * 2);

function timed(fn) {
  return function (...args) {
    const t0 = performance.now();
    const result = fn.apply(this, args);
    console.log(`${performance.now() - t0}ms`);
    return result;
  };
}
```

---

### Memoization

**Definition:** Cache results keyed by arguments to skip redundant work.

**How it works:**

- Wrapper stores a `Map` (or object) from serialized args → result.
- On call: if key exists, return cached value; else compute, store, return.
- Only correct for **pure** functions — impure caches return stale/wrong data.
- Key strategy matters: `JSON.stringify(args)` fails for functions, circular refs.

**When to use:** Fibonacci, API response transforms, React `useMemo`-style logic. Avoid for unbounded inputs or functions with side effects.

**Pluses and minuses:**

| + | − |
|------|------|
| Big speedup on expensive pure calls | Memory grows with unique keys |
| Transparent to callers | Wrong if function is impure |

**Examples:**

function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

---

### Currying, partial application & composition

**Definition:** **Partial application** pre-fills some arguments (`const double = (x) => multiply(2, x)` or `multiply.bind(null, 2)`). **Currying** transforms `f(a, b, c)` → `f(a)(b)(c)`. **Composition** pipes values: `compose(f, g)(x) === f(g(x))` (right-to-left); `pipe` is left-to-right.

**How it works:**

- Curry checks `args.length` vs `fn.length` — partial apply until enough args.
- `bind(null, arg)` is partial application — practical in JS, less idiomatic in strict FP.
- `compose` applies right-to-left; `pipe` (not built-in) applies left-to-right.
- Useful for building configured functions without many parameters.

**When to use:** Currying — optional params, FP libs; Composition — transform pipelines (`parse → validate → format`).

**Pluses and minuses:**

| + | − |
|------|------|
| Partial application, reusable config | Extra function layers |
| Clean pipelines | Steeper learning curve |

**Examples:**

const curry = (f) =>
  function curried(...args) {
    return args.length >= f.length
      ? f(...args)
      : (...more) => curried(...args, ...more);
  };

const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((v, fn) => fn(v), x);

const double = (n) => n * 2;
const inc = (n) => n + 1;
compose(double, inc)(3); // 8
```

**See also:** [7_special.md — Partial application & currying](./7_special.md) · [Function composition](./7_special.md)

---

### Constructor & `new`

**Definition:** `new` creates an object, sets `[[Prototype]]` from `Constructor.prototype`, runs the function with `this` bound to that object, returns it (unless constructor returns another object).

**How it works:**

1. Create empty object.
2. Link `[[Prototype]]` to `Fn.prototype`.
3. Call `Fn` with `this` = new object.
4. If `Fn` returns an object, use that; else return the new object.

**When to use:** Legacy constructors, interviews. Prefer `class` syntax for new code.

**Pluses and minuses:**

| + | − |
|------|------|
| Familiar OOP pattern | Easy to forget `new` |
| Prototype methods shared | `this` binding pitfalls |

**Examples:**

function User(name) {
  this.name = name;
}
User.prototype.greet = function () {
  return `Hi, ${this.name}`;
};
const u = new User("Ann");
```

---

### Named Function Expression (NFE)

**Definition:** Function expression with an internal name — safe recursion and clearer stack traces.

**How it works:**

- Name `fact` visible **inside** the function body for self-calls.
- Outer scope uses the `const` variable name, not `fact` (in strict mode).

**When to use:** Recursive helpers assigned to `const`.

**Pluses and minuses:**

| + | − |
|------|------|
| Recursion without polluting outer scope | Slightly more syntax |
| Better stack traces than anonymous | IE legacy quirks (historical) |

**Examples:**

const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};
```

---

### IIFE

**Definition:** Immediately Invoked Function Expression — runs once to create a private scope.

**How it works:**

- Function expression wrapped in `()` then called with `()`.
- Creates local bindings that disappear after the IIFE returns (unless closed over).

**When to use:** Legacy module pattern, one-time setup. Prefer `const`/`let` blocks and ESM today.

**Pluses and minuses:**

| + | − |
|------|------|
| Private scope before block scope | Extra syntax noise |
| One-off initialization | Less needed with ESM |

**Examples:**

(function () {
  const secret = 42;
  // secret not visible outside
})();
```

---

### Generators

**Definition:** `function*` returns an iterator; `yield` pauses and `.next()` resumes.

**How it works:**

- Calling `function*` returns a generator object (iterator).
- `yield` produces `{ value, done: false }`; function end yields `{ done: true }`.
- `yield*` delegates to another iterable.
- Generators are pausable — state preserved between `.next()` calls.

**When to use:** Infinite IDs, paginated fetch loops, custom iterables. Use arrays/`async` iterators for most app code.

**Pluses and minuses:**

| + | − |
|------|------|
| Lazy infinite sequences | Harder mental model |
| Custom iteration | Not for simple list transforms |

**Examples:**

function* range(n) {
  for (let i = 0; i < n; i++) yield i;
}
const gen = range(3);
gen.next(); // { value: 0, done: false }
[...range(3)]; // [0, 1, 2]
```

---

### Recursion

**Definition:** Function calls itself until a base case stops.

**How it works:**

- Each call adds a stack frame — base case prevents infinite recursion.
- Without tail-call optimization (limited in JS engines), deep recursion overflows stack.
- Often rewriteable as `while` loop with explicit stack for trees.

**When to use:** Tree walk, factorial (toy), nested JSON transform. Prefer iteration for very deep or hot paths.

**Pluses and minuses:**

| + | − |
|------|------|
| Natural for trees, nested structures | Stack overflow on deep recursion |
| Elegant divide-and-conquer | Often slower than iteration |

**Examples:**

function pow(x, n) {
  if (n === 1) return x;
  return x * pow(x, n - 1);
}
```

---

### `new Function` (avoid)

**Definition:** Builds a function from strings at runtime; `[[Environment]]` is global — no closure over outer vars. Same risks as `eval`.

**How it works:**

- `new Function('a', 'b', 'return a + b')` compiles body at runtime.
- Cannot see lexical variables from the calling scope — only globals.
- JIT cannot optimize as well as static functions.

**When to use:** Almost never in app code. Prefer static functions, parsers, or sandboxed VMs.

**Pluses and minuses:**

| + | − |
|------|------|
| Dynamic code from templates (rare) | Security hole with user input |
| | No closure access |
| | Same as `eval` risks |

**Examples:**

```js
const sum = new Function("a", "b", "return a + b");
sum(1, 2); // 3
```

**Sources:** [javascript.info/call-apply-decorators](https://learn.javascript.ru/call-apply-decorators) · [currying-partials](https://learn.javascript.ru/currying-partials) · [constructor-new](https://learn.javascript.ru/constructor-new) · [generators](https://learn.javascript.ru/generators) · [recursion](https://learn.javascript.ru/recursion)

</details>

<details>
  <summary>call, apply & bind</summary>

### call, apply & bind

**Definition:** Methods on `Function.prototype` to set **`this`** explicitly and optionally **partial-apply** arguments. `call`/`apply` invoke immediately; `bind` returns a new function.

**How it works:**

- `fn.call(thisArg, arg1, arg2, ...)` — args listed individually.
- `fn.apply(thisArg, [args])` — args as array (useful for spread-like calls).
- `fn.bind(thisArg, arg1, ...)` — returns new function with fixed `this` and optional preset args; does **not** invoke.
- Bound functions cannot be re-bound with a different `this` (arrow functions also ignore `call`/`bind`).
- Passing `null`/`undefined` as `thisArg` uses default binding (`undefined` in strict, `globalThis` in sloppy).

| | `call` | `apply` | `bind` |
|---|--------|---------|--------|
| Invokes now | yes | yes | no |
| Args format | comma-separated | array | preset + later args |
| Returns | function result | function result | new function |

**When to use:** `obj.method.bind(obj)` for callbacks; `func.apply(ctx, argsArray)`; borrow array methods on array-likes; polyfills.

**Pluses and minuses:**

| + | − |
|------|------|
| Fix context loss on extracted methods | Easy to over-bind |
| Borrow methods (`Array.prototype.slice.call(arguments)`) | Bound fn has no `prototype` for `new` |
| Partial application without curry lib | `this` mental overhead |

**Examples:**

```js
function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}
const user = { name: "Ann" };

greet.call(user, "Hi", "!");       // 'Hi, Ann!'
greet.apply(user, ["Hello", "."]); // 'Hello, Ann.'

const sayHi = greet.bind(user, "Hi");
sayHi("?"); // 'Hi, Ann?'

// Context loss fix
const getX = obj.getX.bind(obj);
```

**Sources:** [javascript.info/call-apply-decorators](https://learn.javascript.ru/call-apply-decorators) · see also [3_js_oop.md](./3_js_oop.md#call-apply-bind)

</details>

<details>
  <summary>debounce & throttle</summary>

### debounce & throttle

**Definition:** **Debounce** delays execution until calls stop for `delay` ms. **Throttle** runs at most once per `delay` ms window.

**How it works:**

- **Debounce:** each call resets timer; only the last call in a burst runs (search input, resize end).
- **Throttle:** first call runs, ignores others until window expires (scroll, mousemove).
- Both are closures over a timer id; use `clearTimeout` in debounce.

| | Debounce | Throttle |
|---|----------|----------|
| Fires | After pause in events | On interval during stream |
| Use for | Search, resize layout | Scroll, pointer move |
| Risk | Feels laggy if delay too high | May skip final state |

**When to use:** Debounce — API search on keystroke; throttle — infinite scroll position updates.

**Pluses and minuses:**

| + | − |
|------|------|
| Cuts expensive handler calls | Timing tuning needed |
| Standard interview pattern | `this` must be forwarded in wrappers |

**Examples:**

```js
function debounce(fn, delay) {
  let id;
  return function (...args) {
    clearTimeout(id);
    id = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

**Sources:** [javascript.info/task/debounce](https://learn.javascript.ru/task/debounce) · [task/throttle](https://learn.javascript.ru/task/throttle)

</details>

<a name="modules"></a>

## Modules

<details>
  <summary>ES Modules (ESM)</summary>

### ES Modules (ESM)

**Definition:** Native module system with `import` / `export`. Each file is its own module scope (strict mode by default). Static `import` statements are resolved at parse time; `import()` is dynamic.

**How it works:**

- **Named exports:** `export const x = 1;` → `import { x } from './mod.js'`
- **Default export:** one per file → `import name from './mod.js'`
- **Live bindings:** imported `let`/`const` bindings update when the exporter mutates (read-only on import side).
- **Top-level `await`:** allowed in ES modules.
- Browser: `<script type="module">` or `.mjs`; bundlers resolve for production.

**When to use:**

| ESM | CommonJS (`require`) |
|-----|---------------------|
| New browser and Node apps | Legacy Node-only codebases |
| Bundled front-end | Some tooling still CJS-only |
| Dynamic `import()` for lazy routes | Sync config loads in old Node |

#### Common pitfalls

```js
// import must be at top level (not inside if) — use import() for conditional
// import { x } from './mod.js'; // x is live binding, not a copy
```

**Pluses and minuses:**

| + | − |
|------|------|
| Tree-shaking (dead code elimination) | Needs bundler or `type="module"` in browser |
| Clear static dependency graph | CORS on cross-origin scripts |
| No accidental globals | No synchronous `require` in browser |
| `import()` for code splitting | Slightly different semantics than CJS in Node |

**Examples:**

```js
// math.js
export const PI = 3.14;
export function add(a, b) {
  return a + b;
}
export default function multiply(a, b) {
  return a * b;
}

// app.js
import multiply, { PI, add } from "./math.js";
const heavy = await import("./heavy.js"); // dynamic — returns Promise
```

**Sources:** [javascript.info/modules-intro](https://learn.javascript.ru/modules-intro)

</details>

<a name="iterators"></a>

## Iterators

<details>
  <summary>iterators & generators</summary>

### Iterators & generators

**Definition:** The **iterable protocol** lets objects work with `for...of`, spread, and destructuring. An **iterator** exposes `.next()` → `{ value, done }`. **Generators** (`function*`) are syntactic sugar for iterators.

**How it works:**

- Iterable: object with `[Symbol.iterator]()` returning an iterator.
- Iterator: object with `next()` returning `{ value, done }`.
- `for...of` calls `Symbol.iterator` then loops `.next()` until `done: true`.
- Generator: `function*` auto-implements iterator; `yield` emits values.
- **Array-likes** have `length` + indexed props but may lack `Symbol.iterator` — use `Array.from`.

| Built-in iterables | Notes |
| ------------------ | ----- |
| `Array`, `String` | `for...of`, spread |
| `Map`, `Set` | `Map` iterates entries as `[key, value]` |
| `arguments`, DOM collections | Array-like; use `Array.from` |

**When to use:**

| Need | Approach |
|------|----------|
| Loop array/string | `for...of` |
| Convert array-like | `Array.from(nodeList)` |
| Lazy sequence | `function*` generator |
| Custom collection API | Implement `Symbol.iterator` |

**Pluses and minuses:**

| + | − |
|------|------|
| Uniform loop syntax | Custom iterables rarely needed |
| Lazy generators save memory | Generator debugging is harder |
| Composable with spread | Array-likes easy to misuse |

**Examples:**

```js
const iterable = {
  [Symbol.iterator]() {
    let step = 0;
    return {
      next() {
        step++;
        return step <= 3 ? { value: step, done: false } : { done: true };
      },
    };
  },
};

for (const n of iterable) console.log(n); // 1, 2, 3
```

```js
function* idGenerator() {
  let id = 1;
  while (true) yield id++;
}
const gen = idGenerator();
gen.next().value; // 1
[...idGenerator()].slice(0, 3); // [1, 2, 3] — careful with infinite!
```

```js
Array.from("hi"); // ['h', 'i']
Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]
```

**Sources:** [javascript.info/iterable](https://learn.javascript.ru/iterable) · [generators](https://learn.javascript.ru/generators) · [array](https://learn.javascript.ru/array)

</details>

<a name="advanced"></a>

## Advanced

<details>
  <summary>Garbage collection (overview)</summary>

### Garbage collection (overview)

**Definition:** JS automatically frees memory when objects are **unreachable** from roots (global, call stack, closures). Developers do not `free()` manually.

**How it works:**

- **Mark-and-sweep:** GC marks reachable objects from roots, sweeps the rest.
- **Strong references** (`Map`, variables, closures) keep objects alive.
- **Weak references** (`WeakMap`/`WeakSet` keys) do not prevent collection.
- **Closures** keep outer variables alive while inner functions exist.
- Common leak patterns: forgotten timers, DOM refs in closures, global caches without eviction.

**When to use:** Use `WeakMap` for DOM metadata; clear `setInterval`/listeners on teardown; avoid holding huge arrays in module-level closures.

**Pluses and minuses:**

| + | − |
|------|------|
| No manual memory management | Pauses (GC stops-the-world in some engines) |
| WeakMap for side metadata | Leaks still possible via strong refs |

**Examples:**

```js
function leak() {
  const huge = new Array(1e6);
  const el = document.getElementById("btn");
  el.onclick = () => console.log(huge.length); // huge + el kept alive
}
// Fix: remove listener, null refs, or use WeakMap for element metadata
```

See [Memory: stack and heap](#memory-stack-heap) for where objects live; [3_js_oop.md](./3_js_oop.md) for GC + closures in depth.

**Sources:** [javascript.info/garbage-collection](https://learn.javascript.ru/garbage-collection)

</details>

<details>
  <summary>Object.is & equality</summary>

### Object.is & equality

**Definition:** Multiple equality mechanisms: `==` (coercing), `===` (strict), `Object.is` (SameValue), and `SameValueZero` (used by `Map`/`Set`).

**How it works:**

- `===` — same type and value; `NaN !== NaN`, `+0 === -0`.
- `Object.is` — like `===` but `Object.is(NaN, NaN)` is `true`, `Object.is(+0, -0)` is `false`.
- `SameValueZero` — `Map`/`Set` key lookup; `NaN` equals `NaN`.
- `==` — coerces operands (avoid except `value == null`).

| Comparison | `NaN === NaN` | `+0 === -0` | Coercion |
|------------|---------------|-------------|----------|
| `===` | false | true | no |
| `Object.is` | true | false | no |
| `==` | false | true | yes |

**When to use:** `Object.is` for `NaN` checks; `===` everywhere else; `Number.isNaN(x)` for single-value `NaN` test without coercion.

**Pluses and minuses:**

| + (`Object.is`) | − |
|--------------------|------|
| Correct `NaN` checks | Rarely needed vs `===` |
| Distinguishes `+0`/`-0` | Not used by `Map`/`Set` (SameValueZero) |

**Examples:**

```js
NaN === NaN;              // false
Object.is(NaN, NaN);      // true
Object.is(+0, -0);        // false
+0 === -0;                // true

const m = new Map();
m.set(NaN, "val");
m.get(NaN);               // 'val' — SameValueZero
```

**Sources:** [MDN Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

</details>

<details>
  <summary>Event loop (overview)</summary>

### Event loop (overview)

**Definition:** JavaScript runs on a **single thread**. The **event loop** picks tasks from queues and runs them when the call stack is empty.

**How it works:**

1. Sync code runs on the **call stack** to completion.
2. Async callbacks go to **macrotask** queue (`setTimeout`, I/O) or **microtask** queue (Promises, `queueMicrotask`).
3. When stack is empty, all microtasks run, then one macrotask, repeat.

**When to use:** Understand why `Promise.then` runs before `setTimeout(0)`; offload heavy work to Web Workers (browser) or worker threads (Node).

**Pluses and minuses:**

| + | − |
|------|------|
| Simple concurrency model | CPU-heavy work blocks UI |
| No locks/mutexes in app code | Microtask starvation if chaining infinitely |

**Examples:**

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// 1, 4, 3, 2 — microtasks before next macrotask
```

**Thoughts:** Full treatment in [3_js_async.md](./3_js_async.md#event-loop).

**Sources:** [javascript.info/event-loop](https://learn.javascript.ru/event-loop)

</details>

<details>
  <summary>Error handling</summary>

### Error handling

**Definition:** Use `try/catch/finally` for synchronous errors; subclass `Error` for domain errors; re-throw after logging at boundaries.

**How it works:**

- `try` runs code; `catch` receives thrown value (any type, usually `Error`).
- `finally` runs always — cleanup, close resources.
- Uncaught errors propagate up the call stack until caught or crash.
- `throw new Error('msg')` — prefer `Error` objects over strings.

**When to use:** JSON parse, user input validation, API boundary wrappers. Log + re-throw at top level; handle expected errors locally.

**Pluses and minuses:**

| + | − |
|------|------|
| Local recovery without crashing | Easy to swallow errors silently |
| `finally` guarantees cleanup | try/catch has minor perf cost in hot paths |

**Examples:**

```js
try {
  JSON.parse("{ invalid");
} catch (err) {
  console.error(err.message);
} finally {
  // cleanup always runs
}

class ValidationError extends Error {
  constructor(field) {
    super(`Invalid: ${field}`);
    this.name = "ValidationError";
  }
}
```

**Sources:** [javascript.info/try-catch](https://learn.javascript.ru/try-catch)

</details>

<details>
  <summary>Proxy and Reflect</summary>

<a name="proxy-and-reflect"></a>

### Proxy and Reflect

**Definition:** `Proxy` wraps an object and intercepts operations via **traps** (`get`, `set`, `has`, …). `Reflect` provides the default behavior for those traps.

**How it works:**

- `new Proxy(target, handler)` — calls go through handler methods first.
- `Reflect.get(obj, prop)` matches default `obj[prop]` behavior — use inside traps.
- Common traps: `get`, `set`, `has`, `deleteProperty`, `apply` (for functions).

**When to use:** ORM-like accessors, immutable wrappers, test mocks. Vue-style **Proxy reactivity** answers “how do I notice a field write?”. **Signals** (below) answer “how do I propagate a change that was already noticed?” — different layers, not rivals.

**Pluses and minuses:**

| + | − |
|------|------|
| Validation, logging, reactivity (Vue 3) | Performance overhead |
| Virtual properties | Harder debugging |
| Revocable proxies | Overkill for simple objects |

**Examples:**

```js
const target = { message1: "hello", message2: "world" };
const proxy = new Proxy(target, {
  get(target, property, receiver) {
    console.log(`Getting "${String(property)}"`);
    return Reflect.get(target, property, receiver);
  },
});
proxy.message1; // logs, then "hello"
```

**Thoughts:** Language `Proxy` vs GoF **Proxy pattern** (same interface, control access) — [7_special.md](./7_special.md#proxy). Traps must respect invariants (e.g. non-writable own data properties).

**Sources:** [MDN `Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) · [javascript.info/proxy](https://learn.javascript.ru/proxy)

</details>

<details>
  <summary>Signals (TC39)</summary>

<a name="signals"></a>

### Signals (TC39)

**Definition:** A **signal** is a first-class cell of state that notifies dependents of changes. You read with `.get()`, write with `.set()`, and the engine builds a DAG of who depends on whom. The TC39 proposal standardizes that **graph + auto-tracking**, not an app-facing `effect()` API. Stage 1 since April 2024.

**How it works:**

1. **`Signal.State`** — writable cell. **`Signal.Computed`** — lazy formula. **`effect`** is *not* in the proposal; frameworks build it on `Signal.subtle.Watcher`.
2. **Auto-tracking:** thread-local `computing`. While a Computed callback runs, every `.get()` registers that node as a source. Nested Computed B that reads `light` owns the edge; parent A depends only on B. Source lists rebuild each evaluation (**dynamic dependencies**).
3. **Four colors:** `clean` (cached, fresh), `checked` (an ancestor *might* have changed), `dirty` (definitely stale or never read), `computing` (callback running).
4. **Push (`set`):** if `equals` (default `Object.is`) says unchanged, stop. Else mark direct sinks `dirty`, farther sinks `checked` (never downgrade `dirty`), put Watchers `pending`, call `notify` **synchronously**. No recompute yet.
5. **Pull (`get`):** if `clean`, return cache. Else walk deepest-leftmost `dirty` source, recompute, compare. Unchanged → `checked` descendants go `clean` (wave dies). Changed → paint them `dirty` and continue. That is **glitch-free**.
6. Errors cache like values (rethrow until a source changes). Recursive self-read is an error. During `notify` the engine is **frozen** — no read/write; `untrack` does not lift that.
7. **`Signal.subtle`:** `Watcher`, `untrack`, `watched`/`unwatched` (lazy subscribe to `resize` etc.), introspection for DevTools. Watchers keep sources alive — missing `unwatch()` leaks.

```
light (State) → canGo (Computed) → message (Computed) → effect (framework)
set() paints left → right.  get() recomputes right ← left, only if asked.
```

| Color | Meaning | Next `.get()` |
|-------|---------|----------------|
| `clean` | cache is truth | return cache |
| `checked` | maybe stale (indirect) | walk sources; may stay clean |
| `dirty` | must recompute | run callback, then `equals` |
| `computing` | callback running | reading self → error |

Imperative `let light = "red"` plus a manual `render()` couples state to the DOM and recomputes even when the visible result did not change. Pub/sub fixes “who to tell” but you still subscribe by hand, and `render` must know it depends on `light` even if it only cares about `message`. Signals make the graph automatic.

**When to use:**

Fine-grained UI state (Angular `signal()`, Vue `ref()`, Solid `createSignal()`, Svelte 5 `$state()`, Preact, Qwik, MobX). Shared reactive *models* across frameworks if the primitive ships. Not for one-shot events (click, socket) — use events. Not RxJS: a signal is one **current** value, not a stream over time. **`AbortSignal` is unrelated.**

#### Common pitfalls

Treating `.get`/`.set` as Vue `.value` “compat” — authors avoided that on purpose. Scheduling work inside `notify`. Forgetting `unwatch()`. Reading a real dependency inside `untrack` (graph goes stale). Assuming one global effect scheduler.

**Pluses and minuses:**

| + | − |
|------|------|
| Auto subscriptions, no manual pub/sub | Not in the language yet (Stage 1) |
| Lazy + memoized; `equals` stops wasted work | Scheduling (when to run effects) is framework-specific |
| Glitch-free DAG vs naive notify storms | `untrack` / frozen `notify` are easy to misuse |

**Examples:**

```js
const light = new Signal.State("red");
const canGo = new Signal.Computed(() => light.get() === "green");
const message = new Signal.Computed(() =>
  canGo.get() ? "go" : "stop",
);

light.get();       // "red"
canGo.get();       // false  — first pull: callback runs, sources = [light]
message.get();     // "stop"

light.set("yellow");
// push: light changed → canGo dirty, message checked. No callbacks yet.
message.get();
// pull: canGo is dirty → recompute false (same as cache) → equals true
// → message stays "stop", DOM would not need a write
```

```js
const showDetails = new Signal.State(false);
const name = new Signal.State("Pumpkin");
const details = new Signal.State("Halloween classic");

const label = new Signal.Computed(() => {
  if (!showDetails.get()) return name.get();
  return `${name.get()}: ${details.get()}`;
});

label.get();          // "Pumpkin" — sources: showDetails, name
details.set("new");   // label does not recompute: details is not a source
showDetails.set(true);
label.get();          // "Pumpkin: new" — now sources include details
```

```js
const light = new Signal.State("red");
const cars = new Signal.Computed(() => light.get() === "green");
const pedestrians = new Signal.Computed(() => light.get() !== "green");
const board = new Signal.Computed(() =>
  `cars:${cars.get()} walk:${pedestrians.get()}`,
);

light.set("green");
board.get();
// Naive pub/sub: board runs twice (cars then pedestrians).
// Signals: both parents dirty; board pulled once after they settle.
```

```js
const list = new Signal.State([1, 2, 3], {
  equals: (prev, next) => prev.length === next.length,
});
list.set([9, 8, 7]); // length 3 === 3 → no dirty paint
list.set([1]);       // length changed → sinks dirty
```

```js
let pending = false;
const watcher = new Signal.subtle.Watcher(() => {
  if (pending) return;
  pending = true;
  queueMicrotask(() => {
    pending = false;
    for (const s of watcher.getPending()) s.get();
    watcher.watch(); // re-arm; otherwise next set() is missed
  });
});

function effect(callback) {
  let cleanup;
  const computed = new Signal.Computed(() => {
    cleanup?.();
    cleanup = callback();
  });
  watcher.watch(computed);
  computed.get();
  return () => {
    cleanup?.();
    watcher.unwatch(computed);
  };
}

effect(() => {
  element.innerText = message.get();
});
```

`notify` runs **inside** `set()` — only schedule, never recompute there. After the microtask, `getPending()` is the live dirty list.

```js
const debugMode = new Signal.State(false);
const items = new Signal.State([1, 2]);
const total = new Signal.Computed(() => {
  const n = items.get();
  if (Signal.subtle.untrack(() => debugMode.get())) {
    console.log("recompute total");
  }
  return n.length;
});
// debugMode flips do not dirty total — by design
```

**Thoughts:** `set()` only colors the graph; `get()` is the only place work happens; effects stay in frameworks because **when** to rerun is not one size.

**Sources:** [proposal-signals README](https://github.com/proposal-signals/proposal-signals) · [signal-polyfill](https://github.com/proposal-signals/signal-polyfill) · Doka — Signals (Rusakov, 31 Aug 2026)

</details>

<details>
  <summary>Intl API</summary>

### Intl API

**Definition:** Locale-aware formatting for dates, numbers, collation, and plural rules — built into JS engines.

**How it works:**

- Create formatter once: `new Intl.NumberFormat(locale, options)`.
- Call `.format(value)` per value — caches locale data internally.
- `Intl.Collator` for locale-aware string sort; `Intl.DateTimeFormat` for dates.

**When to use:** Currency display, date in user's locale, sorting names per language rules.

**Pluses and minuses:**

| + | − |
|------|------|
| Correct locale rules | Bundle size N/A (built-in) |
| Better than manual formatting | Options API verbose |
| Timezone/locale aware | Must pass correct locale string |

**Examples:**

```js
new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(99.9);
// "99,90 €"

new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date());
```

**Sources:** [javascript.info/intl](https://learn.javascript.ru/intl)

</details>

<details>
  <summary>structuredClone and copying</summary>

### structuredClone and copying

**Definition:** Copying duplicates data; **shallow** copies share nested references; **deep** copies clone nested structure.

**How it works:**

- Spread / `Object.assign` / `arr.slice()` — one level deep only.
- `structuredClone(value)` — deep clone for structured-cloneable types (no functions, symbols, DOM nodes).
- `JSON.parse(JSON.stringify(obj))` — deep but loses `undefined`, functions, `Date` types, throws on cycles.

| Method                   | Depth                   |
| ------------------------ | ----------------------- |
| Spread / `Object.assign` | Shallow                 |
| `structuredClone`        | Deep (no functions/DOM) |
| `JSON` round-trip        | Deep with data loss     |

**When to use:** Shallow — React state patch; Deep — clone config trees; JSON — quick DTO copy when types are simple.

**Pluses and minuses:**

| + (`structuredClone`) | − |
|----------------------------|------|
| Native, handles cycles | No functions/symbols |
| Safer than JSON hack | Not in very old browsers |

**Examples:**

```js
const original = { a: { b: 1 } };
const shallow = { ...original };
const deep = structuredClone(original);
shallow.a.b = 99;
original.a.b; // 99 — nested shared in shallow
deep.a.b;     // 1 — independent
```

**Sources:** [MDN structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)

</details>

<details>
  <summary>RegExp (advanced basics)</summary>

### RegExp (advanced basics)

**Definition:** Regular expressions match patterns in strings via `/pattern/flags` or `new RegExp(pattern, flags)`.

**How it works:**

- Flags: `g` global, `i` case-insensitive, `m` multiline, `s` dotAll, `u` unicode.
- Methods: `.test(str)`, `.exec(str)` (with capture groups), `str.match`, `str.replace`, `str.split`.
- Capturing groups `(...)` and non-capturing `(?:...)`.

**When to use:** Input validation (email-ish), extract tokens, replace patterns. Prefer dedicated parsers for complex formats (HTML, JSON).

**Pluses and minuses:**

| + | − |
|------|------|
| Powerful text parsing | Hard to read/maintain |
| Built-in, fast | Catastrophic backtracking risk |
| | Unicode edge cases |

**Examples:**

```js
/^\w+@\w+\.\w+$/.test("a@b.co"); // basic email shape
"a1b2".replace(/\d/g, "#");       // "a#b#"
const m = /(\d+)-(\d+)/.exec("2024-07"); // groups
```

**Sources:** [javascript.info/regular-expressions](https://learn.javascript.ru/regular-expressions)

</details>

<details>
  <summary>eval (anti-pattern)</summary>

### eval (anti-pattern)

**Definition:** `eval(string)` executes a string as code in the current lexical scope.

**How it works:**

- Parses and runs string as JS in current scope — can access local variables.
- Prevents JIT optimization; same security risks as `new Function` with user input.

**When to use:** Do not use with user input. Prefer `JSON.parse`, template engines, or proper parsers.

**Pluses and minuses:**

| + | − |
|------|------|
| Rare dynamic DSL cases | Security vulnerability |
| | Breaks optimization |
| | Hard to debug |

**Sources:** [javascript.info/eval](https://learn.javascript.ru/eval)

</details>

<details>
  <summary>Function decorators (call/apply pattern)</summary>

### Function decorators

**Definition:** Wrap a function to add cross-cutting behavior (timing, logging, caching) without changing every call site.

**How it works:**

- HOF returns new function that calls original with `fn.apply(this, args)`.
- Preserves `this` when wrapper is used as method if you forward `this`.
- Combine with `call`/`bind` for partial application.

**When to use:** `timed`, `once`, `debounce`, `memoize`, API auth guards.

**Pluses and minuses:**

| + | − |
|------|------|
| DRY for logging, timing, auth | Stack depth increases |
| Composable wrappers | Order of decorators matters |

**Examples:**

```js
function timed(fn) {
  return function (...args) {
    const t0 = performance.now();
    const result = fn.apply(this, args);
    console.log(`${fn.name}: ${performance.now() - t0}ms`);
    return result;
  };
}
```

**Sources:** [javascript.info/call-apply-decorators](https://learn.javascript.ru/call-apply-decorators)

</details>

---

<a name="interview-practice"></a>

<details>
  <summary>Interview Practice</summary>

### Interview Practice

**Definition:**

Curated Q&A and coding tasks covering types, scope, functions, and common interview traps.

Questions from [0_interview.md](0_interview.md). Try answering before opening solutions.

### Question index

| #     | Topic                                 | Answer     |
| ----- | ------------------------------------- | ---------- |
| 15–20 | Data types, NaN, `var`/`let`/`const`  | Q&A below  |
| 21–22 | Scope, destructuring                  | Q&A below  |
| 31–36 | Functions, hoisting, closure          | Q&A below  |
| 39–41 | `this`, context loss, bind/call/apply | Q&A below  |
| 10–12 | TDZ, boxing, `in` vs `hasOwnProperty` | Q&A below  |
| 22–24 | `typeof null`, coercion               | Q&A below  |
| 25–27 | GC, WeakMap/WeakSet                   | Q&A below  |
| 29–30 | Map/Set, deep vs shallow copy         | Q&A below  |
| —     | Signals (TC39)                      | Q&A below  |
| —     | JIT / interpreted? Stack vs heap    | Q&A below  |
| —     | `map` / `forEach` / `reduce`          | Q&A below  |
| —     | Pure functions, immutability          | Q&A below  |
| —     | Output prediction                     | Tasks 1–5  |
| —     | Implement utilities                   | Tasks 6–15 |
| —     | Cart aggregation (reduce + discounts) | Task 16    |

---

## Questions & Answers

<details>
  <summary>Is JavaScript an interpreted language?</summary>

### Is JavaScript an interpreted language?

**No single label.** AOT languages (C, Go) compile the whole program before run. Classic interpreters translate line by line (Perl/PHP-style scripts). JS is neither fully.

- `SyntaxError` on line 2 → **nothing** runs (whole-script parse).
- Misspelled identifier → `ReferenceError` **after** earlier lines ran.
- `function` declarations **hoist** (`praise()` can appear above the body) — not line-by-line interpretation.
- Engines **JIT**: interpreter for cold code; hot paths with stable types get compiled (may deopt). MDN still calls JS “interpreted” because that compile happens **at run time**, not AOT.

Full pipeline: [JavaScript engine pipeline](#javascript-engine-pipeline). Memory model for frames vs objects: [Memory: stack and heap](#memory-stack-heap).

**Sources:** [MDN — What is JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_is_JavaScript) · [Doka — memory](https://doka.guide/js/how-the-memory-works/)

</details>

<details>
  <summary>Stack vs heap — what lives where?</summary>

### Stack vs heap — what lives where?

**Stack:** call frames (args, locals, return address), push/pop via stack pointer. **Heap:** dynamic / unknown-size data (objects, growing arrays); the frame stores a reference. `throw` unwinds frames (stack trace). Overflow ≠ heap OOM. Model + examples: [Memory: stack and heap](#memory-stack-heap).

</details>

<details>
  <summary>What are JavaScript data types?</summary>

### What are JavaScript data types?

See **Data types** for the full type table, `typeof` quirks, type-check patterns, and interesting edge cases (NaN, object keys, coercion).

**Sources:** [javascript.info/types](https://learn.javascript.ru/types)

</details>

<details>
  <summary>var vs let vs const?</summary>

### var vs let vs const?

**Definition:**

`var` is function-scoped; `let`/`const` are block-scoped with TDZ; `const` prevents rebinding.

|          | `var`                      | `let`                 | `const`                               |
| -------- | -------------------------- | --------------------- | ------------------------------------- |
| Scope    | function                   | block                 | block                                 |
| Hoisting | yes (undefined until line) | TDZ until declaration | TDZ                                   |
| Reassign | yes                        | yes                   | no (binding); object contents mutable |

Prefer `const` by default; `let` when rebinding; avoid `var` in new code.

**Sources:** [javascript.info/let-const](https://learn.javascript.ru/let-const)

</details>

<details>
  <summary>What is hoisting and TDZ?</summary>

### What is hoisting and TDZ?

**Definition:** Hoisting registers declarations before execution; TDZ blocks access to `let`/`const` until their declaration line.

**Examples:**

```js
console.log(a); // undefined (var)
var a = 1;
console.log(b); // ReferenceError — TDZ
let b = 2;
```

**Sources:** [javascript.info/var](https://learn.javascript.ru/var)

</details>

<details>
  <summary>What is a closure?</summary>

### What is a closure?

**Definition:**

A function that retains access to outer lexical bindings after the outer function returns.

See **Scope & closures → closures** for loop/`var` pitfalls and GC.

**Examples:**

```js
function makeAdder(x) {
  return (y) => x + y;
}
const add5 = makeAdder(5);
add5(3); // 8
```

**Sources:** [javascript.info/closure](https://learn.javascript.ru/closure)

</details>

<details>
  <summary>How does this work? Context loss?</summary>

### How does this work? Context loss?

**Definition:** `this` is determined by call site (except arrows). Extracting a method loses its receiver.

**How it works:**

`const fn = obj.method; fn()` — `this` is not `obj`.

`fn.bind(obj)`, `obj.method()`, arrow wrapper, or `call`/`apply`.

**Sources:** [javascript.info/object-methods](https://learn.javascript.ru/object-methods)

</details>

<details>
  <summary>bind vs call vs apply?</summary>

### bind vs call vs apply?

**Definition:** All set `this`. `call`/`apply` invoke immediately; `bind` returns a new function with fixed `this`.

**Examples:**

```js
fn.call(ctx, 1, 2);
fn.apply(ctx, [1, 2]);
const bound = fn.bind(ctx, 1);
bound(2); // same as fn.call(ctx, 1, 2)
```

**Sources:** [javascript.info/call-apply-decorators](https://learn.javascript.ru/call-apply-decorators)

</details>

<details>
  <summary>What are Signals? Why no effect() in the proposal?</summary>

### What are Signals? Why no effect() in the proposal?

**Definition:** Writable `Signal.State` + lazy `Signal.Computed`. Reads during a Computed callback auto-register sources. `set()` paints the graph (`dirty` / `checked`); `get()` lazily recomputes. Default compare is `Object.is`.

**How it works:** `Watcher.notify` is synchronous inside `set()`. React, Angular, and Solid disagree on **when** side effects should run. The standard gives a frozen notify hook; frameworks schedule (microtask, render phase, zone-less CD). `AbortSignal` is a different API.

**Examples:**

```js
const n = new Signal.State(0);
const doubled = new Signal.Computed(() => n.get() * 2);
n.set(0); // Object.is same → no paint
n.set(1);
doubled.get(); // 2 — lazy recompute on pull
```

See **Advanced → Signals (TC39)** for dynamic deps, diamond, Watcher `effect`, `equals`, `untrack`.

**Sources:** [proposal-signals](https://github.com/proposal-signals/proposal-signals)

</details>

<details>
  <summary>typeof null, coercion, == vs ===?</summary>

### typeof null, coercion, == vs ===?

**Definition:** `typeof null === "object"` is a language bug from the first JS implementation (null tagged as object). `===` compares without coercion; `==` applies Abstract Equality (ToNumber, ToPrimitive).

**How it works:**

Prefer `===` / `!==`. The useful `==` exception: `value == null` is true for both `null` and `undefined` only. `Number.isNaN` does not coerce; global `isNaN` does.

| Pitfall | Result | Prefer |
|---------|--------|--------|
| `typeof null` | `"object"` | `value === null` |
| `[] == false` | `true` | `===` |
| `isNaN("hello")` | `true` | `Number.isNaN` |

**Thoughts:**

`===` by default; `== null` only for nullish; never trust `typeof` for null.

See **Data types → Interesting cases** and **Data types → Type conversions**.

**Sources:** [javascript.info/comparison](https://learn.javascript.ru/comparison) · [MDN Equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)

</details>

<details>
  <summary>Map/Set vs WeakMap/WeakSet?</summary>

### Map/Set vs WeakMap/WeakSet?

**Definition:**

`Map`/`Set` hold **strong** references, are iterable, and expose `.size`. `WeakMap`/`WeakSet` hold **weak** references to objects so entries disappear when the object is no longer reachable elsewhere.

| | `Map` / `Set` | `WeakMap` / `WeakSet` |
|---|---------------|------------------------|
| Key/value types | Any (`Map` keys, `Set` values) | Objects only |
| Iterable | Yes | No |
| `.size` | Yes | No |
| GC | Keeps keys/values alive | Lets object keys/values be collected |
| Typical use | Caches, indexes, dedupe | Private metadata, DOM tags, "seen" sets |

**When to use:**

`Map` when keys are non-strings or you need iteration/size; `Set` for uniqueness. `WeakMap` for per-object side data without memory leaks; `WeakSet` to mark processed object references.

See **Data types → Map & Set & WeakMap & WeakSet** for full API notes, pitfalls, and examples.

**Sources:** [javascript.info/weakmap-weakset](https://learn.javascript.ru/weakmap-weakset)

</details>

<details>
  <summary>Deep vs shallow copy?</summary>

### Deep vs shallow copy?

**Definition:** Shallow copy shares nested references; deep copy clones the full tree.

**How it works:**

`Object.assign`, spread, `arr.slice()`.

`structuredClone()` (modern), `JSON` round-trip (limited), or recursive walk.

**Sources:** [MDN structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)

</details>

<details>
  <summary>`map`, `forEach`, `reduce` — how do they work?</summary>

### `map`, `forEach`, `reduce` — how do they work?

**Definition:**

Array higher-order methods that iterate with a callback `(element, index, array)`.

| Method | Returns | Use |
|--------|---------|-----|
| `map(fn)` | New array, same length | Transform each element |
| `forEach(fn)` | `undefined` | Side effects only — no return value, cannot `break` |
| `reduce(fn, init?)` | Single accumulated value | Fold array into one result |

**How it works:**

- `map` — callback return becomes new element; original unchanged.
- `forEach` — like `map` but discards return; use `for...of` if you need `break`.
- `reduce` — callback `(acc, item) => nextAcc`; provide `init` on possibly empty arrays.

**Examples:**

```js
[1, 2, 3].map((n) => n * 2);           // [2, 4, 6]
[1, 2, 3].forEach((n) => console.log(n)); // logs 1, 2, 3
[1, 2, 3].reduce((sum, n) => sum + n, 0); // 6
```

**Thoughts:** *`map` transforms, `forEach` acts, `reduce` aggregates.*

**See also:** [Transformation & search](#transformation--search) (full theory)

</details>

<details>
  <summary>`reduce` vs `map` — when to use which?</summary>

### `reduce` vs `map` — when to use which?

**Definition:**

`map` always returns an array of the same length; `reduce` returns any type — number, object, Map, etc.

| | `map` | `reduce` |
|---|-------|----------|
| Output | Array (same length) | Any type |
| Best for | Transform each item | Aggregate, group, build object |
| Chainable | Yes (`map().filter()`) | Usually terminal |

**How it works:**

Sum, count, group-by, flatten, build `{ subtotal, tax, total }` object from cart items.

Rename fields, format display values, extract IDs.

**Thoughts:** *If you need one value or object from an array, reach for `reduce`.*

</details>

<details>
  <summary>What is the accumulator in `reduce`?</summary>

### What is the accumulator in `reduce`?

**Definition:** The accumulator (`acc`) is the value carried from one iteration to the next — the "running result."

**How it works:**

```js
[10, 20, 30].reduce((acc, price) => acc + price, 0);
// acc: 0 → 10 → 30 → 60
```

- First argument to callback is `acc`; return value becomes `acc` for next step.
- Without `init` on non-empty array, first element is used as initial `acc` (risky on empty arrays → `TypeError`).

**When to use:** Sum · max value · `{ count, total }` object · `Map` of grouped items.

**Thoughts:** *Always pass an initial value when the array might be empty.*

</details>

<details>
  <summary>How to sum an array? Sum with conditional discounts?</summary>

### How to sum an array? Sum with conditional discounts?

**Definition:** Use `reduce` to fold values; apply business rules inside the callback.

**How it works:**

```js
const total = prices.reduce((sum, p) => sum + p, 0);
```

```js
const items = [
  { price: 100, category: 'food' },
  { price: 200, category: 'electronics' },
];
const discounts = { food: 0.1, electronics: 0.2 };

const total = items.reduce((sum, item) => {
  const rate = discounts[item.category] ?? 0;
  return sum + item.price * (1 - rate);
}, 0);
// 100*0.9 + 200*0.8 = 250
```

**Thoughts:** *Keep aggregation logic pure — same input always gives same output.*

</details>

<details>
  <summary>Why avoid mutations? What is a pure function?</summary>

### Why avoid mutations? What is a pure function?

**Definition:** A **pure function** returns the same output for the same input and has no side effects (no mutating external state, no I/O).

**How it works:**

- React compares state by reference — mutating `state.push(x)` does not trigger re-render.
- Shared references cause bugs when one consumer mutates data another relies on.
- Easier to debug, test, and reason about immutable snapshots.

| Pure | Impure |
|------|--------|
| `(arr) => [...arr, x]` | `arr.push(x); return arr` |
| `reduce` with no external writes | `fetch`, `console.log`, `Date.now()` |

**Thoughts:** *Prefer `map`/`filter`/`reduce` and spread over `push`/`splice` on shared data.*

**See also:** [Pure vs impure functions](#pure-vs-impure-functions)

</details>

---

### Tasks

### Task 1 — typeof output

What logs?

```js
console.log(typeof null);
console.log(typeof []);
console.log(typeof (() => {}));
```

<details><summary>Answer</summary>

`"object"`, `"object"`, `"function"`

</details>

### Task 2 — == vs ===

```js
console.log(0 == false);
console.log(0 === false);
console.log("" == false);
console.log(null == undefined);
console.log(null === undefined);
```

<details><summary>Answer</summary>

`true`, `false`, `true`, `true`, `false`

</details>

### Task 3 — Closure loop

What logs with `var`? With `let`?

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

<details><summary>Answer</summary>

`var`: logs `3, 3, 3` — one shared binding.  
`let`: logs `0, 1, 2` — new binding per iteration.

</details>

### Task 4 — this context

```js
const obj = {
  x: 10,
  getX() {
    return this.x;
  },
};
const getX = obj.getX;
console.log(getX());
console.log(getX.call(obj));
```

<details><summary>Answer</summary>

`undefined` (strict) then `10`

</details>

### Task 5 — Prototype reference

```js
function Main() {}
Main.prototype = { a: 1 };
const o = new Main();
Main.prototype = { a: 2 };
console.log(o.a);
```

<details><summary>Answer</summary>

`1` — instance links to prototype object at creation time, not the constructor's current `.prototype` property.

</details>

### Task 6 — Implement debounce

```js
function debounce(fn, delay) {
  /* ... */
}
```

<details><summary>Solution</summary>

```js
function debounce(fn, delay) {
  let id;
  return function (...args) {
    clearTimeout(id);
    id = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

</details>

### Task 7 — Flatten array (one level)

```js
function flatten(arr) {
  /* [1,[2,3],[4]] → [1,2,3,4] */
}
```

<details><summary>Solution</summary>

```js
function flatten(arr) {
  return arr.reduce(
    (acc, item) => acc.concat(Array.isArray(item) ? item : item),
    [],
  );
}
// or arr.flat(1)
```

</details>

### Task 8 — Polyfill Array.map

```js
function map(arr, fn) {
  /* without Array.prototype.map */
}
```

<details><summary>Solution</summary>

```js
function map(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i], i, arr));
  }
  return result;
}
```

</details>

### Task 9 — Deep clone (JSON limitations)

When is `JSON.parse(JSON.stringify(obj))` unsafe?

<details><summary>Answer</summary>

Loses `undefined`, functions, symbols; `Date` becomes an ISO string; `Map`/`Set` become `{}`; `NaN`/`Infinity` become `null`; circular refs and `BigInt` throw. Use `structuredClone` when available.

</details>

### Task 10 — Implement bind

```js
function myBind(fn, ctx, ...args) {
  /* ... */
}
```

<details><summary>Solution</summary>

```js
function myBind(fn, ctx, ...args) {
  return function (...rest) {
    return fn.apply(ctx, args.concat(rest));
  };
}
```

</details>

### Task 11 — Unique array values

```js
function unique(arr) {
  /* [1,2,2,3] → [1,2,3] */
}
```

<details><summary>Solution</summary>

```js
function unique(arr) {
  return [...new Set(arr)];
}
```

</details>

### Task 12 — Curry add

```js
const curriedAdd = curry((a, b, c) => a + b + c);
curriedAdd(1)(2)(3); // 6
```

<details><summary>Solution</summary>

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}
```

</details>

### Task 13 — Object.is vs ===

When does `Object.is(NaN, NaN)` differ from `NaN === NaN`?

<details><summary>Answer</summary>

`NaN === NaN` is `false`; `Object.is(NaN, NaN)` is `true`. `Object.is(+0, -0)` is `false`; `+0 === -0` is `true`.

</details>

### Task 14 — Memoize

```js
function memoize(fn) {
  /* cache by args */
}
```

<details><summary>Solution</summary>

```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

</details>

### Task 15 — Query string to object

```js
queryObjectify("a=1&b=2&c=hello"); // { a: '1', b: '2', c: 'hello' }
```

<details><summary>Solution</summary>

```js
function queryObjectify(str) {
  return Object.fromEntries(
    str.split("&").map((pair) => pair.split("=").map(decodeURIComponent)),
  );
}
```

</details>

### Task 16 — Cart aggregation with category discounts

Calculate cart totals using `reduce`. Return an object with `subtotal`, `discount`, and `total`.

```js
const items = [
  { product: { id: '1', name: 'Bread', price: 5, category: 'food' }, qty: 2 },
  { product: { id: '2', name: 'Phone', price: 500, category: 'electronics' }, qty: 1 },
  { product: { id: '3', name: 'Shirt', price: 30, category: 'clothing' }, qty: 3 },
];
const discounts = { food: 0.1, electronics: 0.15 }; // 10% food, 15% electronics

function calculateCart(items, discounts) {
  /* return { subtotal, discount, total } */
}
```

<details><summary>Solution</summary>

```js
function calculateCart(items, discounts = {}) {
  return items.reduce(
    (acc, { product, qty }) => {
      const lineSubtotal = product.price * qty;
      const rate = discounts[product.category] ?? 0;
      const lineDiscount = lineSubtotal * rate;
      acc.subtotal += lineSubtotal;
      acc.discount += lineDiscount;
      acc.total += lineSubtotal - lineDiscount;
      return acc;
    },
    { subtotal: 0, discount: 0, total: 0 },
  );
}

// subtotal: 600, discount: 86, total: 514
// Bread: 10, Phone: 500, Shirt: 90 → discount: 1 + 75 + 0
```

**Interview talking points:**

- `reduce` returns any shape — here a summary object.
- Category discounts via lookup `discounts[product.category] ?? 0`.
- Different product types share one `Product` shape; category drives discount rules.
- Typed version → [5_ts.md — Cart task](./5_ts.md#interview-practice).

</details>

---

<details>
  <summary>Type checks & comparison (practice)</summary>

### Type checks & comparison (practice)

Predict the output, then check **Data types → Interesting cases** and **Tasks 1–2** below.

```js
console.log(typeof null);
console.log(typeof []);
const fn = () => {};
console.log(fn instanceof Function);
console.log(1 == "1");
console.log({ a: 1 } === { a: 1 });
const a = {};
const b = {};
a[b] = "1";
console.log(Object.keys(a));
```

| Expression               | Result                  | Why                            |
| ------------------------ | ----------------------- | ------------------------------ |
| `typeof null`            | `"object"`              | Legacy bug                     |
| `typeof []`              | `"object"`              | Arrays are objects             |
| `fn instanceof Function` | `true`                  | Functions are callable objects |
| `1 == '1'`               | `true`                  | Coercion                       |
| `{a:1} === {a:1}`        | `false`                 | Reference compare              |
| `Object.keys(a)`         | `['[object Object]']`   | Object keys stringify          |

**Sources:** [javascript.info/types](https://learn.javascript.ru/types)

</details>

<details>
  <summary>call / apply / bind (practice)</summary>

### call / apply / bind

**Definition:**

Set `this` and optionally partial-apply arguments.

See **Functions → call, apply & bind** for full notes (definition, how it works, cases, pros/cons).

**Examples:**

```js
const f = (a, b, c) => a + b + c;
const f1 = f.bind(null, 1, 2);
f1(3); // 6 — bind does not invoke
f.call(null, 1, 2, 3); // 6
f.apply(null, [1, 2, 3]); // 6
```

**Sources:** [javascript.info/call-apply-decorators](https://learn.javascript.ru/call-apply-decorators)

</details>

<details>
  <summary>Junior — General (core subset)</summary>

### Junior — General (core subset)

**Definition:**

Entry-level interview questions on strict mode, typing, mutability, and debugging.

7. What does the `use strict` directive mean?
8. How does JS differ on front-end vs back-end?
9. What is static vs dynamic typing?
10. Explain mutability vs immutability — which types are mutable?
11. How do you debug code? Do you use a debugger?
12. Notable people in the JS ecosystem?

</details>

<details>
  <summary>Junior — JS Core</summary>

### Junior — JS Core

**Definition:**

Fundamental language questions: types, arrays, operators, scope, and collections.

15. What data types exist in JS?
16. How to check if a value is an array?
17. How to check if a number is finite?
18. How to check for `NaN`?
19. `isNaN()` vs `Number.isNaN()`?
20. Compare `var`, `let`, `const`.
21. What is scope?
22. What is destructuring?
23. What are `setTimeout` / `setInterval` for?
24. Callbacks vs promises vs `async/await`?
25. Can you extend built-in prototypes (`Array`, `Object`)? Risks?
26. Name array methods and their purpose.
27. Iteration methods on arrays — differences?
28. Assignment, comparison, logical, bitwise operators?
29. `Map` and `Set` — purpose and usage?
30. Deep vs shallow copy — how to make each?

</details>

<details>
  <summary>Junior — Functions</summary>

### Junior — Functions

**Definition:**

Function forms, hoisting, closures, `this`, and method binding.

31. Function declaration vs function expression?
32. What is an anonymous function?
33. Arrow functions — differences from regular functions?
34. What is IIFE and why use it?
35. What is hoisting for variables and functions?
36. What is a closure? Use cases?
37. What logs when `execute(f)` runs after `f` is reassigned?
38. What is recursion?
39. What does `this` mean?
40. Context loss — when and how to prevent?
41. `bind` / `call` / `apply` — differences?

</details>

<details>
  <summary>Middle — JS Core</summary>

### Middle — JS Core

**Definition:**

Intermediate topics: prototypes, coercion, GC, promises, descriptors, typed arrays, symbols.

10. JS types — what logs when reassigning object reference?
11. What is the temporal dead zone?
12. Boxing / unboxing in JS?
13. `in` vs `hasOwnProperty`?
14. Encapsulation, polymorphism, abstraction in JS?
15. Prototypes — what logs when `Main.prototype` is replaced after `new`?
16. Composition vs inheritance?
17. Why avoid `new String()`?
18. Event loop basics?
19. Records and tuples vs plain objects?
20. ES5 constructor vs ES2015 class?
21. Module pattern implementation?
22. Why `typeof null === 'object'`?
    23–24. Type coercion exercises.
    25–26. Garbage collection principles?
23. `WeakMap` / `WeakSet` vs `Map` / `Set`?
24. Observable vs Promise?
25. Promise chain ordering exercise?
26. `Promise.all` vs `Promise.allSettled`?
27. Property descriptors?
    32–33. Immutable / non-writable objects?
28. `Proxy` use cases?
29. `ArrayBuffer`, typed arrays?
30. `encodeURI` vs `encodeURIComponent`?
    37–38. Generators / iterators — trace `function*` example?
31. `Symbol` and number base conversion?

</details>

<details>
  <summary>JS Core</summary>

### JS Core (patterns)

**Definition:**

Architecture patterns beyond syntax: class-free OOP, async disposer, RegExp discipline.

8. Class-free OOP pattern.
9. Async disposer pattern.
10. Regular expressions — when acceptable, readability tips.

</details>

<details>
  <summary>Middle — Functions</summary>

### Middle — Functions

**Definition:**

Advanced function techniques: currying, memoization, composition, and arrow tracing.

40. Explain currying with a practical example.
41. Memoization — when to apply?
42. Function chaining — example?
43. `function` vs arrow — trace nested arrow `pluckDeep`?

</details>

<details>
  <summary>Junior — Practice tasks</summary>

### Junior — Practice tasks

**Definition:**

Hands-on exercises: object copy, clone, variable swap, and a small CRUD project.

135. Ways to copy a simple object `{ a: 1, b: 2, c: 3 }`?
136. Implement deep clone.
137. Swap two variables — different techniques?
138. Replace magic status numbers with named constants?
139. Mini user CRUD project (Firebase + Bootstrap).

</details>

<details>
  <summary>Middle — Practice tasks (core)</summary>

### Middle — Practice tasks (core)

**Definition:**

Utility implementations: query parsing and set operations on arrays.

145. URL query string to JSON (`queryObjectify`).
146. Intersection of two arrays.

</details>

<details>
  <summary>Practice tasks</summary>

### Practice tasks

**Definition:**

Recursive implementations of standard library patterns.

44. Implement `reduce` using recursion.

</details>

</details>
