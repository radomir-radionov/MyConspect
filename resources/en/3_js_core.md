# JS Core — Language

Covers ECMAScript runtime fundamentals: engines and modules. Types, memory (stack/heap), bindings, scope, and `globalThis` live in [Data Types & Variables](./3_js_variables.md). Operators, control flow (including `try`/`catch`), and loops live in [Operators & Loops](./3_js_operators.md). Arrays and function APIs live in sibling Core topics.

[← Back to JS hub](./3_js.md)

### Related docs

- [JS Data Types & Variables](./3_js_variables.md) · [Stack & heap](./3_js_variables.md#memory-stack-heap) · [globalThis](./3_js_variables.md#globalthis) · [JS Operators & Loops](./3_js_operators.md) · [Error handling](./3_js_operators.md#error-handling) · [Iterators](./3_js_operators.md#iterators) · [JS Arrays](./3_js_array.md) · [JS Additional](./3_js_extra.md) · [JS Functions](./3_js_functions.md) · [JS OOP](./3_js_oop.md) · [JS Document](./3_js_browser.md) · [JS Events](./3_js_events.md) · [JS Browser APIs](./3_js_browser_extra.md) · [CORS / same-origin](./3_js_browser_extra.md#cors-same-origin) · [JS Async](./3_js_async.md) · [JS Interview](./3_js_interview.md) · [Call stack](./3_js_async.md#call-stack)
- [TypeScript](./5_ts.md) · [Web API](./6_web_api.md) · [YAML](./10_build_ci.md#yaml) · [Node.js](./8_nodejs.md) · [Process & threads](./8_nodejs_process.md#process--threads) · [React](./4_react.md) · [OOP & SOLID](./7_special_engineering.md#object-oriented-programming-oop) · [Computer science](./7_special_cs.md) · [SDLC](./7_special_sdlc.md#software-design-methodology)

### Main concepts

| Area        | Topics                                                  |
| ----------- | ------------------------------------------------------- |
| **Runtime** | JS vs ECMAScript, JIT, strict mode, console, code style |
| **Modern**  | ESM                                                     |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [Core](#core)
- [Modules](#modules)
- [Design principles](#design-principles)
- [Interview](./3_js_interview.md)

Stack & heap → [Data Types & Variables](./3_js_variables.md#memory-stack-heap). Error handling → [Operators & Loops](./3_js_operators.md#error-handling). Iterators & generators → [Operators & Loops](./3_js_operators.md#iterators).

Sibling Core topics: [Data Types & Variables](./3_js_variables.md) · [Operators & Loops](./3_js_operators.md) · [Array](./3_js_array.md) · [Functions](./3_js_functions.md) · [Classes & Objects](./3_js_oop.md).

Topics also covered: **JIT**, **strict mode**, **ESM**. Types / stack-heap / variables / scope / `globalThis` / closures → [3_js_variables.md](./3_js_variables.md); Operators / loops / errors → [3_js_operators.md](./3_js_operators.md); Arrays → [3_js_array.md](./3_js_array.md); Intl / RegExp / Signals → [3_js_extra.md](./3_js_extra.md); event loop → [3_js_async.md](./3_js_async.md); GC / Proxy / deep copy → [3_js_oop.md](./3_js_oop.md); paradigms → [7_special_cs.md](./7_special_cs.md).

<a name="core"></a>

## Core

<details>
  <summary>JavaScript and ECMAScript</summary>

### JavaScript & ECMAScript

**Definition:** JavaScript is a high-level scripting language created to make web pages interactive. Programs are plain-text **scripts** (often embedded in HTML) that run without a separate compile step. **ECMAScript** (ECMA-262) is the language standard; “JavaScript” is the everyday name for that language plus **host APIs** (DOM in browsers, `fs` / network in Node, etc.). It has no technical relation to Java — the name came from marketing when it was briefly called LiveScript.

| Trait     | Detail                                                                                             |
| --------- | -------------------------------------------------------------------------------------------------- |
| Paradigms | Event-driven, functional, OOP, imperative                                                          |
| Typing    | Dynamic — types checked at runtime                                                                 |
| Execution | Engine parses → compiles → runs (JIT optimizations); see [Engine and runtime](#engine-and-runtime) |
| Modules   | `.mjs` or `type="module"` for ESM                                                                  |
| Hosts     | Browser, Node/Deno/Bun, embedded engines on other devices                                          |

**How it works:**

- **Engine (VM):** each host embeds an engine. Common codenames: **V8** (Chrome, Opera, Edge, Node), **SpiderMonkey** (Firefox), **JavaScriptCore** / Nitro / SquirrelFish (Safari). Legacy: **Chakra** (IE / early Edge). Feature support is often discussed by engine name (“supported in V8”).
- **Pipeline (basics):** parse script → compile to machine code → run; engines keep optimizing hot paths. Deeper JIT/AOT distinction → [Engine and runtime](#engine-and-runtime).
- **In-browser capabilities:** manipulate HTML/CSS; react to user input; network requests (XHR/`fetch`, historically AJAX/COMET); cookies / dialogs; client storage (`localStorage`, etc.). What the language _can_ do depends on the **host**, not on ECMAScript alone.
- **In-browser limits (safety):** no arbitrary disk / OS access; file/camera/mic need explicit user gestures or permission; cross-tab/window DOM access blocked across different origins (**Same-Origin Policy** — scheme + host + port); cross-origin network reads need the remote side’s agreement (CORS headers). Outside the browser (Node, extensions with granted permissions) those sandbox rules do not apply the same way. SOP/CORS detail → [CORS and same-origin policy](./3_js_browser_extra.md#cors-same-origin).
- **Why JS won the browser:** full HTML/CSS integration, simple tasks stay simple, shipping enabled by default in every major browser — unique combination among browser technologies. Also used for servers, mobile (RN/Hermes), desktop (Electron), etc.
- **Languages “over” JS:** many languages **transpile** to JavaScript (TypeScript, CoffeeScript, Flow, Dart→JS, Brython, Kotlin/JS, …). You still need JS to debug what the browser/Node actually runs. Typing layer today → [TypeScript](./5_ts.md).

**When to use:** Browser UI and any host that embeds a JS engine. Prefer TypeScript (or similar) for large typed codebases, but learn JS first. Skip assuming browser APIs exist on the server (and vice versa).

**Pluses and minuses:**

| +                                                               | −                                                                           |
| --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Only ubiquitous browser language with HTML/CSS built in.        | Name confuses people with Java; dynamic typing can hide bugs until runtime. |
| Same language on client and many servers (Node, Deno, Bun).     | Capability set is host-dependent — security sandboxes differ.               |
| Huge ecosystem; engines converge on ECMAScript yearly editions. | Transpile-to-JS stack adds tools; must still reason about emitted JS.       |

**Examples:**

```html
<!-- Script in the page — runs as the document loads -->
<script>
  document.body.textContent = "Hello from a script";
</script>
```

```js
// ECMAScript module — strict by default; host APIs come from the environment
export function greet(name) {
  return `Hello, ${name}`;
}
```

**Thoughts:** Interview framing: ECMAScript = language spec; JavaScript = that language + host APIs. “What can JS do?” always means “in which environment?” Browser sandbox (SOP, no arbitrary FS) is a feature, not a bug. Brendan Eich’s first engine was SpiderMonkey (1995); modern engines implement the same ECMA-262 with minor edge-case differences.

**Sources:** [javascript.info — Intro](https://javascript.info/intro) · [MDN — What is JavaScript?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_is_JavaScript) · [MDN — JavaScript technologies overview](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/JavaScript_technologies_overview) · [ECMA-262](https://tc39.es/ecma262/)

</details>

<details>
  <summary>Strict mode</summary>

### Strict mode

**Definition:**

`"use strict"` opts into stricter parsing and runtime behavior: no accidental globals, duplicate params forbidden, `delete` on non-configurable properties throws.

| Restricted            | Effect                                  |
| --------------------- | --------------------------------------- |
| Undeclared assignment | `ReferenceError` instead of global leak |
| Duplicate param names | SyntaxError                             |
| Octal literals        | SyntaxError                             |
| `this` in plain calls | `undefined` (not `globalThis`)          |

**How it works:**

- Place `"use strict";` (or `'use strict';`) at the **top** of a script or as the first statement in a function. Only comments may appear above it — otherwise it is ignored.
- There is **no** `"no use strict"` — once enabled, you cannot cancel it for that scope.
- **Modules** (`import`/`export`, `type="module"`) and **class** bodies enable strict mode automatically — no directive needed.
- The browser **console** is not strict by default; wrap snippets in an IIFE with `'use strict'` when testing strict-only behavior.

**When to use:** All new code. Prefer modules/classes so strict mode is implicit; otherwise put the directive at the top of classic scripts.

**Examples:**

```js
"use strict";
function demo() {
  // this === undefined in strict mode
}

// Modules / classes are already strict:
export function f() {
  /* strict */
}
class C {
  method() {
    /* strict */
  }
}
```

**Sources:** [javascript.info/strict-mode](https://javascript.info/strict-mode) · [MDN Strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)

</details>

<details>
  <summary>Engine and runtime</summary>

### JavaScript engine pipeline

**Definition:** A JS engine parses source into an AST, interprets to bytecode, profiles hot paths, and JIT-compiles optimized machine code. That mix is why “is JavaScript interpreted?” has no yes/no answer.

**How it works:**

- **AOT compiled** (C, Go): translate the whole program to machine code _before_ run. Catches many errors early; slower to start iterating.
- **Interpreted** (classic scripts): translate and run line by line. Fast to start; a typo can appear only when that line runs.
- **JS in practice:** parse + compile happen _at runtime_ (MDN still calls JS “interpreted” for that reason). Syntax is checked for the **whole** script first — a `SyntaxError` on line 2 prevents line 1 from running. A `ReferenceError` from a misspelled identifier is a **runtime** error: earlier lines already ran.
- Function **declarations** are hoisted, so a call can appear above the `function` in source — not line-by-line interpretation.
- **JIT:** interpreter for cold code; if a function runs often with stable types, an optimizing compiler emits machine code (and may deoptimize if types change). Babel/TypeScript emit older JS _before_ the engine — not the same as JIT.

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

| +                                  | −                                         |
| ---------------------------------- | ----------------------------------------- |
| Fast startup + later peak speed    | Type speculation can deoptimize           |
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

**Sources:** [javascript.info/intro](https://javascript.info/intro) · [MDN — interpreted vs compiled](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_is_JavaScript) · [MDN JIT](https://developer.mozilla.org/en-US/docs/Glossary/Just_in_time_compilation) · [V8 blog](https://v8.dev/blog)

</details>

<details>
  <summary>Console</summary>

### Console API

**Definition:** Browser/Node debugging API for logging, timing, and inspecting objects. Pair with the Sources debugger when you need to pause — see [Debugging JS (Sources)](./11_vsc_browser.md#browser-devtools).

**How it works:**

- `console.log` / `table` / `dir` / `time` / `timeEnd` for output without stopping execution.
- Prefer a **breakpoint** or `debugger` when you need live locals and the call stack.

**Examples:**

```js
console.log("info", { a: 1 });
console.table([{ id: 1 }, { id: 2 }]);
console.time("fetch");
// await fetch(...)
console.timeEnd("fetch");
console.dir(document.body, { depth: 1 });
```

**Sources:** [MDN console](https://developer.mozilla.org/en-US/docs/Web/API/console) · [javascript.info/debugging-chrome](https://javascript.info/debugging-chrome)

</details>

<details>
  <summary>Code style and comments</summary>

### Code style & comments

**Definition:** Style rules exist to make code readable and to avoid footguns (ASI, missing braces). Comments should explain **why** and architecture — not narrate **what** the next line does.

**How it works:**

- Prefer Egyptian braces (`if (cond) {`), spaces around operators, and a team line-length (often 80–120). Always put `;` after statements — see [ASI](./3_js_operators.md).
- Reduce nesting with early `return` / `continue` instead of deep `else` trees.
- Function placement: often **call site first**, helpers below — readers learn _what happens_ before _how_.
- **Good comments:** architecture overview, non-obvious decisions, JSDoc for public APIs. **Bad comments:** restating `i++` or naming what a well-named function already says — factor into a function instead.
- Anti-patterns (“ninja code”): one-letter names, vague `data`/`obj`, inconsistent synonyms (`show` vs `display` for the same thing), silent side effects in `is*`/`check*` functions, reusing variables for unrelated values mid-function.

**When to use:** Agree on a style guide (Airbnb, Standard, Google, or Prettier + ESLint) and enforce with a linter — see [ESLint](./10_build_bundlers.md).

**Examples:**

```js
// Prefer early return over nested else
function pow(x, n) {
  if (n < 0) return NaN;
  let result = 1;
  for (let i = 0; i < n; i++) result *= x;
  return result;
}

/**
 * Returns x raised to the n-th power.
 * @param {number} x
 * @param {number} n Natural number
 * @return {number}
 */
function documentedPow(x, n) {
  /* ... */
}
```

**Thoughts:** Readable names beat clever one-liners. If you need a comment to explain _what_, rewrite the code.

**Sources:** [javascript.info/coding-style](https://javascript.info/coding-style) · [javascript.info/comments](https://javascript.info/comments) · [javascript.info/ninja-code](https://javascript.info/ninja-code)

</details>

<details>
  <summary>Glossary</summary>

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

<a name="modules"></a>

## Modules

<details>
  <summary>ES Modules (ESM)</summary>

### ES Modules (ESM)

**Definition:** Native module system with `import` / `export`. Each file is its own module scope (strict mode by default). Static `import` statements are resolved at parse time; `import()` is dynamic.

**How it works:**

- **Named exports:** `export const x = 1;` → `import { x } from './mod.js'`
- **Default export:** one per file → `import name from './mod.js'` (no curly braces)
- **Re-export:** `export { x } from './mod.js'` / `export { default as User } from './user.js'`
- **Live bindings:** imported `let`/`const` bindings update when the exporter mutates (read-only on import side).
- **Dynamic `import(path)`:** returns a Promise of the module namespace; works anywhere (including classic scripts); path may be computed. Default export is `.default`.
- **Top-level `await`:** allowed in ES modules.
- Module code runs once on first import; further imports share the same exports.
- Browser: `<script type="module">` (deferred, CORS for cross-origin); no bare specifiers without a resolver/bundler.

**When to use:**

| ESM                                | CommonJS (`require`)          |
| ---------------------------------- | ----------------------------- |
| New browser and Node apps          | Legacy Node-only codebases    |
| Bundled front-end                  | Some tooling still CJS-only   |
| Dynamic `import()` for lazy routes | Sync config loads in old Node |

#### Common pitfalls

```js
// import must be at top level (not inside if) — use import() for conditional
// import { x } from './mod.js'; // x is live binding, not a copy
```

**Pluses and minuses:**

| +                                    | −                                             |
| ------------------------------------ | --------------------------------------------- |
| Tree-shaking (dead code elimination) | Needs bundler or `type="module"` in browser   |
| Clear static dependency graph        | CORS on cross-origin scripts                  |
| No accidental globals                | No synchronous `require` in browser           |
| `import()` for code splitting        | Slightly different semantics than CJS in Node |

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

**Sources:** [javascript.info/modules-intro](https://javascript.info/modules-intro) · [javascript.info/import-export](https://javascript.info/import-export) · [javascript.info/modules-dynamic-imports](https://javascript.info/modules-dynamic-imports)

</details>

<a name="design-principles"></a>

## Design principles

<details>
  <summary>SOLID in Classes</summary>

### SOLID in Classes

**Definition:** **SOLID** is five design principles from Robert C. Martin ("Uncle Bob") for code that stays easy to **change, test, and extend**. On **`class` hierarchies**, each letter maps to prototypes, `extends`, and constructor injection. In JS, `class` is **syntax sugar over prototypes** — methods sit on the prototype, `extends` wires the chain — so **Liskov** and **composition** matter whenever you subclass. Module/function mapping: [SOLID in Functions](#solid-in-functions). Runtime has no `interface` keyword (TypeScript adds one at compile time) — contracts are **duck typing**, JSDoc `@typedef`, or TS `implements`.

| Letter | Principle             | What problem it targets (classes)                         |
| ------ | --------------------- | --------------------------------------------------------- |
| **S**  | Single Responsibility | God classes that mix unrelated jobs                       |
| **O**  | Open/Closed           | Endless `if/else` edits inside `Car.start()`              |
| **L**  | Liskov Substitution   | Subclasses that break callers of the parent type          |
| **I**  | Interface Segregation | Fat class APIs that force unused methods on consumers     |
| **D**  | Dependency Inversion  | Classes that `new GasEngine()` or call `fetch` internally |

| Principle                     | Meaning                                                                                                                                                                                                                                     | JS `class` example                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **S** — Single Responsibility | A class should do **one job** and have **one reason to change**. Engine start/stop rules live in `CarEngine`; speed/fuel display rules live in `CarDashboard`. Mixing both in `Car` means a UI tweak can break engine logic and vice versa. | `CarEngine` starts the motor; `CarDashboard` renders speed — not one `Car` class doing both |
| **O** — Open/Closed           | Open for **extension**, closed for **modification**. Add a new engine type by creating a new class (`ElectricMotor`), not by editing `Car.start()` with another `if/else` branch. Existing `Car` callers keep working.                      | Add `ElectricMotor` without editing `Car` — plug a new engine class into `constructor`      |
| **L** — Liskov Substitution   | If code accepts `RoadCar`, **every subclass must work there** without extra checks. If one subtype makes `drive()` throw, callers need `try/catch` — you cannot swap it in safely.                                                          | `goToWork(new OutOfFuelCar())` crashes, but `goToWork(new RoadCar())` works — LSP broken    |
| **I** — Interface Segregation | Clients should not depend on methods they **never use**. A showroom that only lists cars should not implement `repair()`, `paint()`, or `tow()` just because a bigger `Garage` class exposes all of them.                                   | `CarLot` lists stock — don't force `repair()` on a read-only showroom class                 |
| **D** — Dependency Inversion  | High-level modules (`Car`) depend on **abstractions** (anything with `start()`), not concrete `GasEngine` details. Pass the engine in via `constructor` so production, tests, and future motor types swap without rewriting `Car`.          | `Car` takes `engine` in `constructor` — inject `GasEngine` or `ElectricMotor` in tests      |

**How it works:**

Each letter matches the **Examples** below — look for `// good` and `// bad`:

1. **S** — one class, one job (`CarEngine` vs `CarDashboard`).
2. **O** — new engine = new class (`ElectricMotor`), not a new `if` inside `Car.start()`.
3. **L** — `goToWork(car)` must work for every car; empty tank → return `{ status: "no fuel" }`, not a subclass that throws.
4. **I** — `CarLot` lists only; `CarWorkshop` repairs — don't inherit unused methods.
5. **D** — pass `engine` into `constructor` (`new Car(engine)`); don't `new GasEngine()` inside `Car`.

**When to use:** Refactoring god classes; plugin-style providers; interview answers; code review when `extends` chains grow.

**Examples:**

```js
// S — good: one job per class
class CarEngine {
  start() {
    return "engine on";
  }
  stop() {
    return "engine off";
  }
}

class CarDashboard {
  render({ speed, fuel }) {
    return `${speed} km/h · ${fuel}% fuel`;
  }
}

// S — bad: god class mixes engine logic and UI
// class Car {
//   start() {
//     return "engine on";
//   }
//   renderDashboard() {
//     return `${this.speed} km/h · ${this.fuel}% fuel`;
//   }
// }

// O + D — good: new engine type = new class + inject (no edit to Car)
class GasEngine {
  start() {
    return "gas engine started";
  }
}

class ElectricMotor {
  start() {
    return "motor started silently";
  }
}

class Car {
  #engine;
  constructor(engine) {
    this.#engine = engine; // DIP — inject engine abstraction
  }
  start() {
    return this.#engine.start();
  }
}

const sedan = new Car(new GasEngine());
const ev = new Car(new ElectricMotor());

// O + D — bad: edit Car every time a new engine appears
// class Car {
//   start() {
//     if (this.type === "gas") return "gas engine started";
//     if (this.type === "electric") return "motor started silently";
//   }
// }

// I — good: showroom lists; workshop repairs — separate APIs
class CarLot {
  listAvailable() {
    return ["sedan", "suv"];
  }
}

class CarWorkshop {
  repair(carId) {
    return `repaired ${carId}`;
  }
}

// I — bad: read-only lot forced to stub methods it never uses
// class Garage {
//   listAvailable() {
//     return ["sedan", "suv"];
//   }
//   repair() {
//     throw new Error("We don't repair here");
//   }
// }
// class CarLot extends Garage {}

// L — one caller; every "car" must work here
function goToWork(car) {
  return car.drive(10); // expects { km, status } — not a crash
}

// L — good: drive() always returns a result
class RoadCar {
  drive(km) {
    return { km, status: "ok" };
  }
}
goToWork(new RoadCar()); // { km: 10, status: "ok" }

// L — bad: still a RoadCar, but drive() throws — goToWork breaks
class OutOfFuelCar extends RoadCar {
  drive(km) {
    throw new Error("No fuel");
  }
}
// goToWork(new OutOfFuelCar()); // crash — caller needs try/catch

// L — good fix: no broken subclass — return status for empty tank
class Car {
  constructor(hasFuel) {
    this.hasFuel = hasFuel;
  }
  drive(km) {
    if (!this.hasFuel) return { km, status: "no fuel" };
    return { km, status: "ok" };
  }
}
goToWork(new Car(false)); // { km: 10, status: "no fuel" } — same goToWork, no crash
```

**Thoughts:** SOLID is a **guide**, not a law — a 10-line script does not need five classes. Apply when change pain appears. Plain functions and modules: [SOLID in Functions](#solid-in-functions). Class syntax details: [Classes & Objects](./3_js_oop.md#classes-full). Framework mapping: [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express) · [SOLID in TypeScript](./5_ts_objects.md#solid-in-typescript). Full OOP reference: [OOP & SOLID](./7_special_engineering.md#solid-overview).

**Sources:** [freecodecamp — SOLID](https://www.freecodecamp.org/news/solid-principles-single-responsibility-principle-explained/) · [SOLID (overview)](./7_special_engineering.md#solid-overview) · [SOLID in Functions](#solid-in-functions) · [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express) · [SOLID in TypeScript](./5_ts_objects.md#solid-in-typescript)

</details>

<details>
  <summary>SOLID in Functions</summary>

### SOLID in Functions

**Definition:** The same five **SOLID** principles apply to **plain functions**, **closures**, and **ESM modules** — the style most JavaScript uses day to day. A module boundary or exported function can be a unit with one job, open for extension via new functions, and testable when dependencies are passed in. Class/prototype mapping: [SOLID in Classes](#solid-in-classes).

| Letter | Principle             | What problem it targets (functions / modules)                 |
| ------ | --------------------- | ------------------------------------------------------------- |
| **S**  | Single Responsibility | God modules mixing parse, format, and I/O                     |
| **O**  | Open/Closed           | Growing one function with another `if (paymentType)` branch   |
| **L**  | Liskov Substitution   | Callbacks that throw or return inconsistent shapes            |
| **I**  | Interface Segregation | Barrel files that export dozens of helpers you never import   |
| **D**  | Dependency Inversion  | Domain functions that call `fetch` or `localStorage` directly |

| Principle                     | Meaning                                                                                                                                                                                                                                | JS function example                                                                 |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **S** — Single Responsibility | One function, **one reason to change**. Parsing raw JSON belongs in `parseUser()`; display formatting belongs in `formatUserLabel()` — not one function doing both.                                                                    | `parseUser()` vs `formatUserLabel()` — not one `handleUser()` for everything        |
| **O** — Open/Closed           | Open for **extension**, closed for **modification**. Add a new payment path by passing a new strategy function, not by editing `processOrder()` with another branch.                                                                   | `processOrder(order, payWithCard)` — add `payWithWallet` without editing core logic |
| **L** — Liskov Substitution   | Any callback passed where a contract is expected must **behave like the others**. If `normalizeUser()` usually returns `{ id, name }`, a branch that throws or returns a string breaks every caller — same LSP idea without `extends`. | Broken `normalize` callback breaks `mapUsers()` callers                             |
| **I** — Interface Segregation | Export **small, focused surfaces**. Consumers that only list users should not import a module that also exports delete, audit, and email helpers they never call.                                                                      | `listUsers.js` + `updateUser.js` — not one `userUtils.js` with 20 exports           |
| **D** — Dependency Inversion  | High-level functions depend on **injected collaborators** (HTTP client, storage, clock), not globals. Pass `http` as an argument or via a factory so tests swap fakes without rewriting business logic.                                | `loadProfile(userId, http)` — inject fake `http` in tests                           |

**How it works:**

Each letter matches the **Examples** below — look for `// good` and `// bad`:

1. **S** — `parseUser()` and `formatUserLabel()` stay separate; not one `handleUser()`.
2. **O** — new payment = new function (`payWithWallet`), not a new `if` in `processOrder()`.
3. **L** — callbacks passed to `mapUsers()` always return the same shape; not sometimes a string.
4. **I** — small module exports (`listUsers.js`), not one `userUtils.js` with everything.
5. **D** — pass `http` into `loadProfile()`; don't call `fetch` inside the function body.

**When to use:** Utility modules, Node services, data layers, refactoring god files; most day-to-day JS is functions-first.

**Examples:**

```js
// S — good: parse and format are separate functions
function parseUser(raw) {
  return JSON.parse(raw);
}

function formatUserLabel(user) {
  return `${user.name} <${user.email}>`;
}

// S — bad: one function parses and formats (two reasons to change)
// function handleUser(raw) {
//   const user = JSON.parse(raw);
//   return `${user.name} <${user.email}>`;
// }

// O + D — good: new payment = new function, processOrder stays closed
function processOrder(order, pay) {
  return pay(order.total);
}

function payWithCard(amount) {
  return { ok: true, method: "card", amount };
}

function payWithWallet(amount) {
  return { ok: true, method: "wallet", amount };
}

// O + D — bad: edit processOrder for every new payment type
// function processOrder(order) {
//   if (order.payment === "card") return { ok: true, method: "card" };
//   if (order.payment === "wallet") return { ok: true, method: "wallet" };
// }

// L — good: normalize always returns the same shape
function mapUsers(users, normalize = (u) => ({ id: u.id, name: u.name })) {
  return users.map(normalize);
}

// L — bad: callback sometimes returns a string — breaks mapUsers callers
// mapUsers(users, (u) => (u.active ? { id: u.id, name: u.name } : "skipped"));

// D — good: inject http — swap fake in tests
async function loadProfile(userId, http) {
  return http.get(`/api/users/${userId}`);
}
// loadProfile("1", { get: async () => ({ id: "1", name: "Ada" }) });

// D — bad: hardcoded fetch — hard to test, tied to browser/Node global
// async function loadProfile(userId) {
//   const res = await fetch(`/api/users/${userId}`);
//   return res.json();
// }
```

**Thoughts:** Most JS is functions and modules, not classes — start here for everyday code. `class` / `extends`: [SOLID in Classes](#solid-in-classes). Framework mapping: [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express) · [SOLID in TypeScript](./5_ts_objects.md#solid-in-typescript). Full reference: [OOP & SOLID](./7_special_engineering.md#solid-overview).

**Sources:** [freecodecamp — SOLID](https://www.freecodecamp.org/news/solid-principles-single-responsibility-principle-explained/) · [SOLID (overview)](./7_special_engineering.md#solid-overview) · [SOLID in Classes](#solid-in-classes) · [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express) · [SOLID in TypeScript](./5_ts_objects.md#solid-in-typescript)

</details>
