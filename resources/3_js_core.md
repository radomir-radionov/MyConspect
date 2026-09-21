# JS Core — Language

Covers ECMAScript runtime fundamentals: engines and modules. Types, memory (stack/heap), bindings, scope, and `globalThis` live in [Data Types & Variables](./3_js_variables.md). Operators, control flow (including `try`/`catch`), and loops live in [Operators & Loops](./3_js_operators.md). Arrays and function APIs live in sibling Core topics.

[← Back to JS hub](./3_js.md)

### Related docs

- [JS Data Types & Variables](./3_js_variables.md) · [Stack & heap](./3_js_variables.md#memory-stack-heap) · [globalThis](./3_js_variables.md#globalthis) · [JS Operators & Loops](./3_js_operators.md) · [Error handling](./3_js_operators.md#error-handling) · [Iterators](./3_js_operators.md#iterators) · [JS Arrays](./3_js_array.md) · [JS Additional](./3_js_extra.md) · [JS Functions](./3_js_functions.md) · [JS OOP](./3_js_oop.md) · [JS Document](./3_js_browser.md) · [JS Events](./3_js_events.md) · [JS Browser APIs](./3_js_browser_extra.md) · [CORS / same-origin](./3_js_browser_extra.md#cors-same-origin) · [JS Async](./3_js_async.md) · [JS Interview](./3_js_interview.md) · [Call stack](./3_js_async.md#call-stack)
- [TypeScript](./5_ts.md) · [Web API](./6_web_api.md) · [YAML](./10_build_ci.md#yaml) · [Node.js](./8_nodejs.md) · [Process & threads](./8_nodejs_process.md#process--threads) · [React](./4_react.md) · [OOP & SOLID](./7_special_engineering.md#object-oriented-programming-oop) · [Computer science](./7_special_cs.md) · [SDLC](./7_special_sdlc.md#software-design-methodology)

### Main concepts

| Area            | Topics                                                                  |
| --------------- | ----------------------------------------------------------------------- |
| **Runtime**     | JS vs ECMAScript, JIT, strict mode, console |
| **Modern**      | ESM                                                                   |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [Core](#core)
- [Modules](#modules)
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

| Trait     | Detail |
| --------- | ------ |
| Paradigms | Event-driven, functional, OOP, imperative |
| Typing    | Dynamic — types checked at runtime |
| Execution | Engine parses → compiles → runs (JIT optimizations); see [Engine and runtime](#engine-and-runtime) |
| Modules   | `.mjs` or `type="module"` for ESM |
| Hosts     | Browser, Node/Deno/Bun, embedded engines on other devices |

**How it works:**

- **Engine (VM):** each host embeds an engine. Common codenames: **V8** (Chrome, Opera, Edge, Node), **SpiderMonkey** (Firefox), **JavaScriptCore** / Nitro / SquirrelFish (Safari). Legacy: **Chakra** (IE / early Edge). Feature support is often discussed by engine name (“supported in V8”).
- **Pipeline (basics):** parse script → compile to machine code → run; engines keep optimizing hot paths. Deeper JIT/AOT distinction → [Engine and runtime](#engine-and-runtime).
- **In-browser capabilities:** manipulate HTML/CSS; react to user input; network requests (XHR/`fetch`, historically AJAX/COMET); cookies / dialogs; client storage (`localStorage`, etc.). What the language *can* do depends on the **host**, not on ECMAScript alone.
- **In-browser limits (safety):** no arbitrary disk / OS access; file/camera/mic need explicit user gestures or permission; cross-tab/window DOM access blocked across different origins (**Same-Origin Policy** — scheme + host + port); cross-origin network reads need the remote side’s agreement (CORS headers). Outside the browser (Node, extensions with granted permissions) those sandbox rules do not apply the same way. SOP/CORS detail → [CORS and same-origin policy](./3_js_browser_extra.md#cors-same-origin).
- **Why JS won the browser:** full HTML/CSS integration, simple tasks stay simple, shipping enabled by default in every major browser — unique combination among browser technologies. Also used for servers, mobile (RN/Hermes), desktop (Electron), etc.
- **Languages “over” JS:** many languages **transpile** to JavaScript (TypeScript, CoffeeScript, Flow, Dart→JS, Brython, Kotlin/JS, …). You still need JS to debug what the browser/Node actually runs. Typing layer today → [TypeScript](./5_ts.md).

**When to use:** Browser UI and any host that embeds a JS engine. Prefer TypeScript (or similar) for large typed codebases, but learn JS first. Skip assuming browser APIs exist on the server (and vice versa).

**Pluses and minuses:**

| + | − |
| --- | --- |
| Only ubiquitous browser language with HTML/CSS built in. | Name confuses people with Java; dynamic typing can hide bugs until runtime. |
| Same language on client and many servers (Node, Deno, Bun). | Capability set is host-dependent — security sandboxes differ. |
| Huge ecosystem; engines converge on ECMAScript yearly editions. | Transpile-to-JS stack adds tools; must still reason about emitted JS. |

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
  <summary>Engine and runtime</summary>

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
  <summary>Console</summary>

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
