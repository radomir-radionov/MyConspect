# JS Core — Functions

Function forms, `this`, higher-order functions, `call`/`apply`/`bind`, debounce, and related interview tasks.

[← Back to JS hub](./3_js.md)

### Related docs

- [JS Language](./3_js_core.md) · [Scope & closures](./3_js_core.md#scope-closures) · [JS Array](./3_js_array.md) · [JS OOP](./3_js_oop.md)
- [JS Async](./3_js_async.md) · [JS Events](./3_js_events.md) · [Browser APIs](./3_js_browser_extra.md) · [JS Interview](./3_js_interview.md) · [Computer science](./7_special_cs.md#programming-paradigm) · [Architecture — functional core](./7_special_architecture.md#functional-core-imperative-shell)

### Main concepts

| Area | Topics |
| ---- | ------ |
| **Forms** | Declaration vs expression, arrows, IIFE, NFE |
| **Call site** | `this`, `call`/`apply`/`bind`, constructors |
| **HOF / FP** | Callbacks, memoize, curry, composition, purity, immutability |
| **Advanced** | Generators, recursion, `new Function` |
| **Timing** | [Debounce](./3_js_browser_extra.md#debounce) · [Throttle](./3_js_browser_extra.md#throttle) |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [Functions](#functions)
- [Functional Programming (FP)](#functional-programming-fp)
- [Function composition](#function-composition)
- [Pure functions & side effects](#pure-functions--side-effects)
- [Immutability](#immutability)
- [Higher-order functions (HOF)](#higher-order-functions-hof)
- [Memoization](#memoization)
- [Currying, partial application & composition](#currying-partial-application-and-composition)
- [Constructor & `new`](#constructor-and-new)
- [Named Function Expression (NFE)](#named-function-expression-nfe)
- [IIFE](#iife)
- [Generators](#generators)
- [Recursion](#recursion)
- [Recursion & declarative iteration](#recursion--declarative-iteration)
- [`new Function`](#new-function-avoid)
- [call, apply & bind](#call-apply-and-bind)
- [Result containers](#result-containers-box-ok--error)
- [Pattern matching](#pattern-matching)
- [FP — math foundations](#fp--math-foundations-pros--cons)
- [Interview](./3_js_interview.md)

<a name="functions"></a>

## Functions

<details>
  <summary>Functions</summary>

### Functions — core

**Definition:** Functions are **first-class** callable objects: assignable to variables, passed as arguments, returned from other functions, and stored in data structures. They are the primary unit of behavior in JS.

**How it works:**

- Invoked with `()`; optional `return` (defaults to `undefined`).
- Parameters are local bindings; default values apply when argument is `undefined`.
- **Higher-order functions (HOF)** take and/or return other functions (`map`, `filter`, decorators).
- **Callbacks** are functions passed to run later (sync in `sort`, async in `setTimeout`).
- `this` is set by **call site** for regular functions; **lexical** for arrows (see below).

---

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

**See also:** [Pure functions & side effects](#pure-functions--side-effects) · [Functional core, imperative shell](./7_special_architecture.md#functional-core-imperative-shell)

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
  <summary>Functional Programming (FP)</summary>

### Functional Programming (FP)

**Definition:** A **declarative** paradigm where a **function** is the unit of composition — a math-like transform of inputs to outputs. Core rules: **pure functions** and **immutable data**.

**How it works:**

- Code should mirror business rules as accurately as a map mirrors territory — FP helps keep that map stable when requirements change.
- **Composition unit** = function. Chaining calls passes data step by step: `multiply(add(10, 5), 42)`.
- Good boundaries: single responsibility, communicate via data (Law of Demeter), separate config from logic (Twelve-Factor).
- No shared mutable memory → parallel-safe calls, easy unit tests (args only).
- Real apps need I/O — isolate effects at the edges; see [Functional core, imperative shell](./7_special_architecture.md#functional-core-imperative-shell).

| Concept | Definition |
|---------|------------|
| **Pure function** | Same input → same output; no side effects |
| **Immutability** | Don't mutate; return new copies |
| **Higher-order function** | Takes or returns functions |
| **Composition** | Output of one function → input of next |
| **Referential transparency** | Replace `f(x)` with its value without changing behavior |

ФП: функция = элемент композиции; чистые функции + иммутабельность. Плюс — тесты и параллельность. Минус — копии в памяти. I/O — на краю.

**When to use:** Data transforms, reducers, selectors, event streams, workers, React immutable updates. Keep `fetch`, DOM, logging in adapters.

**Pluses and minuses:**

| + | − |
|------|------|
| Predictable, testable transforms | Immutability → extra copies, memory pressure |
| Referential transparency → compiler/runtime optimizations | Pure FP alone cannot do DB/network/DOM |
| Parallel / thread-safe by default | Steep jargon (monads, functors) in strict FP |
| Composable pipelines (`map` / `filter` / `reduce`) | Awkward for some stateful algorithms |

**Examples:**

```js
function add(a, b) { return a + b; }
function multiply(a, b) { return a * b; }

const additionResult = add(10, 5);
const finalResult = multiply(additionResult, 42); // 735
```

**Thoughts:** Functions transform data; effects live at the shell — the universe is a side effect.

**Sources:**

[Doka — programming paradigms](https://doka.guide/tools/programming-paradigms/) · [javascript.info/functional-programming](https://javascript.info/functional-programming)

---

</details>

<details>
  <summary>Function composition</summary>

### Function composition

**Definition:** Building a program by passing the **output of one function as input to the next** — the core composition pattern in FP.

**How it works:**

- Sequential: `const y = f(x); const z = g(y);` — same as `g(f(x))`.
- **`compose(f, g, ...)(x)`** = `f(g(...(x)))` — applies **right to left**.
- **`pipe(f, g, ...)(x)`** = `g(f(...(x)))` — applies **left to right** (not built into JS; common in Ramda/lodash/fp-ts).
- Mathematical basis: function composition `(f ∘ g)(x) = f(g(x))`.

**When to use:**

`parse → validate → normalize → save` pipelines; middleware chains; transform utilities.

#### Common pitfalls

Confusing `compose` (RTL) with `pipe` (LTR). Forgetting that each function in the chain should ideally be pure.

**Pluses and minuses:**

| + | − |
|------|------|
| Reusable pipelines without duplicating control flow | Order of `compose` vs `pipe` is easy to confuse |
| Clear data flow | Deep nesting hurts readability without naming |

**Examples:**

```js
const compose = (...fns) => (x) =>
  fns.reduceRight((acc, fn) => fn(acc), x);

const add1 = (x) => x + 1;
const double = (x) => x * 2;

compose(add1, double)(3); // add1(double(3)) = 7
// compose(f, g)(x) === f(g(x))
```

**Thoughts:** *Small pure steps composed into one behavior — interview: `compose(...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x)`.*

**Sources:**

[javascript.info/currying-partials](https://javascript.info/currying-partials)

---

</details>

<details>
  <summary>Pure functions & side effects</summary>

### Pure functions & side effects

**Definition:** A **pure** function always returns the same result for the same arguments and causes **no side effects**. A **side effect** is any observable interaction with the outside world — including **reading** unstable external state.

**How it works:**

- Pure ≈ mathematical function: input → output by fixed rules.
- **Impure reads count too:** `Date.now()`, `Math.random()`, globals — you cannot guarantee the external method doesn't mutate hidden state.
- **Impure writes:** mutating outer variables, DOM, network, DB, `console.log`, throwing based on global state.
- **Referential transparency:** `double(2)` can be replaced with `4` anywhere without changing program meaning.
- Purity is a spectrum — `console.log` at boundaries may be acceptable; core logic stays pure.

| Pure | Impure |
|------|--------|
| `(a, b) => ((a + b) * a) / b` | Uses `Math.random()` in calculation |
| `(x) => x * 2` | `Date.now()`, reads/mutates outer `counter` |
| Predictable, memoizable | I/O, DOM, logging |

**When to use:**

Reducers, selectors, pricing rules, parsers — anything TDD-friendly. Wrap I/O in thin impure shells.

#### Common pitfalls

Testing `expect(expected).toEqual(expected)` — always passes. Assuming `Date.now()` is "read-only safe" — external code may mutate state on access.

**Pluses and minuses:**

| + (pure) | − (pure) |
|-------------|-------------|
| Trivial unit tests — no mocks for world state | Cannot perform I/O inside pure core |
| Safe parallel execution | Strict purity feels verbose in UI code |
| Compiler can evaluate at compile time (referential transparency) | |

**Examples:**

```js
function pureFn(a, b) {
  return ((a + b) * a) / b; // always same for same a, b
}

function impureFn(a, b) {
  return ((a + b) * a) / Math.random(); // different every call
}

let counter = 0;
const FakeDate = {
  now() { counter++; return 42; }, // hidden mutation on read
};
function alsoImpure() { return FakeDate.now(); }
```

**Thoughts:** *Same args → same result; the outside world is untouched (including hidden reads).*

**See also:** [Interview — What is a pure function?](./7_special_interview.md#interview-practice) · [JS Functions — Pure vs impure](./3_js_functions.md)

**Sources:**

[javascript.info/functional-programming](https://javascript.info/functional-programming)

---

</details>

<details>
  <summary>Immutability</summary>

### Immutability

**Definition:** Treat every value as **unchangeable** — to "update", return a **new** value with the desired changes instead of mutating in place.

**How it works:**

- Impure style: `let a = 1; a = a * 2` — same binding, new value overwrites.
- FP style: `const changedA = update(a, 2)` — old `a` unchanged; new reference returned.
- In JS: spread (`{ ...obj, key: val }`), `map`/`filter`/`toSorted()`, `structuredClone` for deep copies when needed.
- Snapshots of immutable state enable time-travel debugging (Redux DevTools) — replay history by swapping references.

**When to use:** React state updates, Redux reducers, config objects, concurrent pipelines.

**Pluses and minuses:**

| + | − |
|------|------|
| Easy to reason about — no hidden mutations | Full copies use more memory |
| Safe sharing across threads/workers | Deep nested updates need care (immer, lenses) |
| Change detection by reference (`===`) | Shallow copy — nested objects still mutable unless handled |

**Examples:**

```js
// impure
let a = 1;
const update = (value) => { a = 2 * value; };

// immutable
const a = 1;
const update = (original, value) => original * value;
const changedA = update(a, 2); // a still 1
```

**Thoughts:**

React `setState(s => ({ ...s, count: s.count + 1 }))` is immutability in practice.

*Don't change data — produce new data.*

**Sources:**

[javascript.info/array-methods](https://javascript.info/array-methods)

---

</details>

<details>
  <summary>Higher-order functions (HOF)</summary>

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

```js
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

**Sources:** [javascript.info/call-apply-decorators](https://learn.javascript.ru/call-apply-decorators)

</details>

<details>
  <summary>Memoization</summary>

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

```js
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

**Sources:** [javascript.info/call-apply-decorators](https://learn.javascript.ru/call-apply-decorators)

</details>

<details>
  <summary>Currying, partial application & composition</summary>

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

```js
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

**See also:** [Currying, partial application & composition](#currying-partial-application--composition) · [Function composition](#function-composition)

**Sources:** [javascript.info/currying-partials](https://learn.javascript.ru/currying-partials)

</details>

<details>
  <summary>Constructor & `new`</summary>

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

```js
function User(name) {
  this.name = name;
}
User.prototype.greet = function () {
  return `Hi, ${this.name}`;
};
const u = new User("Ann");
```

**Sources:** [javascript.info/constructor-new](https://learn.javascript.ru/constructor-new)

</details>

<details>
  <summary>Named Function Expression (NFE)</summary>

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

```js
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};
```

**Sources:** [javascript.info/function-expressions](https://learn.javascript.ru/function-expressions)

</details>

<details>
  <summary>IIFE</summary>

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

```js
(function () {
  const secret = 42;
  // secret not visible outside
})();
```

**Sources:** [javascript.info/closures](https://learn.javascript.ru/closures)

</details>

<details>
  <summary>Generators</summary>

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

```js
function* range(n) {
  for (let i = 0; i < n; i++) yield i;
}
const gen = range(3);
gen.next(); // { value: 0, done: false }
[...range(3)]; // [0, 1, 2]
```

**Sources:** [javascript.info/generators](https://learn.javascript.ru/generators)

</details>

<details>
  <summary>Recursion</summary>

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

```js
function pow(x, n) {
  if (n === 1) return x;
  return x * pow(x, n - 1);
}
```

**Sources:** [javascript.info/recursion](https://learn.javascript.ru/recursion)

</details>

<details>
  <summary>Recursion & declarative iteration</summary>

### Recursion & declarative iteration

**Definition:** Strict FP avoids mutable loops; iteration is expressed via **recursion**, **`map`**, or **`reduce`** — declarative over collections.

**How it works:**

- **Recursion:** base case + recursive step — mirrors math definitions (factorial, tree walk).
- **`map` / `filter` / `reduce`:** encode loops as transforms — no manual index mutation.
- Tail-call optimization (TCO) is not guaranteed in all JS engines — deep recursion can overflow stack; use iteration or trampolining for huge depths.

**When to use:** Tree/graph traversal, nested structures, functional pipelines. Prefer `map`/`filter` for flat lists.

**Pluses and minuses:**

| + | − |
|------|------|
| Matches mathematical problem statements | Stack overflow on unbounded depth without TCO |
| Declarative, composable | Some devs find recursion harder to debug |
| `reduce` can express any loop | Performance-sensitive hot paths may need imperative loops |

**Examples:**

```js
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

const sum = nums.reduce((acc, n) => acc + n, 0); // declarative fold
```

**Thoughts:** *Repeat via recursion or higher-order array methods — not via mutating loop counters.*

**Sources:**

[javascript.info/recursion](https://javascript.info/recursion)

---

</details>

<details>
  <summary>`new Function` (avoid)</summary>

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

**Sources:** [javascript.info/eval](https://learn.javascript.ru/eval)

</details>

<details>
  <summary>call, apply & bind</summary>

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

<details>
  <summary>Result containers (Box, Ok / Error)</summary>

### Result containers (Box, Ok / Error)

**Definition:** Wrap values in **containers** so transformations compose via `.map()` without nested `try/catch` at every step — errors short-circuit the chain.

**How it works:**

- **Box:** generic wrapper — `Box(x).map(f).map(g)` threads value through transforms.
- **Ok / Error:** railway-oriented programming — `Ok(x).map(f)` runs `f`; `Error(e).map(f)` **skips** `f` and stays Error.
- Similar to `Maybe`/`Either` in Haskell, `Result` in Rust, or `fp-ts` `Either`.
- Extract final value with `.fold()`, `.getOrElse()`, or pattern match — depends on library.

**When to use:**

Chained validation, parsing pipelines, avoiding `undefined.toUpperCase()` on missing lookup.

#### Common pitfalls

Using arrays as containers (`[str].map(...)[0]`) works for demos but loses error semantics. For production, prefer typed `Result<T, E>` (TS) or `neverthrow` / `fp-ts`.

**Pluses and minuses:**

| + | − |
|------|------|
| Linear pipelines vs nested conditionals | Custom containers add abstraction overhead |
| Errors propagate without boilerplate | JS has no native `Result` — use libs or TS unions |
| Composable with `map` / `flatMap` | |

**Examples:**

```js
const Ok = (x) => ({
  map: (f) => Ok(f(x)),
  fold: (_, onOk) => onOk(x),
});

const Error = (e) => ({
  map: (_f) => Error(e),
  fold: (onErr, _onOk) => onErr(e),
});

const fromNullable = (x) => (x != null ? Ok(x) : Error('missing'));

function findName(alias) {
  return { nagibator3000: 'Mike', superUfaStar: 'Alice' }[alias];
}

// safe chain — no throw if alias missing
fromNullable(findName('missing-alias'))
  .map((v) => v.toUpperCase())
  .map((v) => `@${v}`);
// Error('missing') — subsequent maps skipped
```

**Thoughts:** *Container carries success or failure; `map` on Error is a no-op — errors flow down the track.*

**Sources:**

[Fantasy Land spec](https://github.com/fantasyland/fantasy-land) · Professor Frisby — Composable Functional JavaScript (Egghead)

---

</details>

<details>
  <summary>Pattern matching</summary>

### Pattern matching

**Definition:** Match a value against **patterns** (literals, types, predicates) and execute the corresponding branch — richer than basic `switch`.

**How it works:**

- Conceptually like `switch`, but patterns can include types, guards, destructuring (in ML, Haskell, Rust, TS 5.0+).
- JS native: limited — `switch (value)` on primitives; hack `switch (true)` with predicate cases.
- TS 5.0 **`switch (x) { case { kind: 'ok' }: ... }`** — structural pattern matching (experimental/stable per TS version).
- Libraries: `ts-pattern`, `zod` `.safeParse` + exhaustive checks.

**When to use:** Discriminated unions in TS, parsing ADTs, routing on event types.

**Pluses and minuses:**

| + | − |
|------|------|
| Exhaustiveness checking (with TS) | Verbose in plain JS without libs |
| Replaces nested if/else for unions | `switch (true)` hacks are fragile |

**Examples:**

```js
function stringifyAmount(amount) {
  switch (true) {
    case amount === 0:
      return 'Empty!';
    case amount > 0 && amount < 10:
      return 'A few';
    default:
      return 'Many';
  }
}
```

**Thoughts:** *One value, many shapes — pick the branch that matches.*

**Sources:**

[TypeScript — switch/statements](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)

---

</details>

<details>
  <summary>FP — math foundations, pros & cons</summary>

### FP — math foundations, pros & cons

**Definition:** FP interprets functions as **mathematical mappings** — foundations in **lambda calculus** (computation) and **category theory** (composition of structures).

**How it works:**

- Math functions: one input → one output, no side effects — FP mirrors this ideal.
- **Referential transparency** → compiler can pre-evaluate pure subexpressions (constant folding, memoization at compile time).
- **No shared mutable state** → safe parallelism (workers, concurrent pipelines).
- Category theory terms in JS ecosystem: **functors** (`map`), **monads** (`flatMap` / chain), **semigroups** (`concat`) — [Fantasy Land](https://github.com/fantasyland/fantasy-land) spec.

Мат. основа — лямбда-исчисление, теория категорий. Плюсы: тесты, параллелизм, оптимизация. Минусы: память, интеграция с I/O.

**When to use:** Data-heavy backends (Clojure, Elixir), frontend transforms (React + Redux), concurrent systems. Less ideal for rapid UI prototyping where mutation is faster.

**Pluses and minuses:**

| + | − |
|------|------|
| **Reliability & testing** — pure fns need minimal test infra; static types catch more | **Memory** — immutable updates copy state |
| **Compile-time optimization** — referential transparency | **Impure reality** — DB, API, UI are all effects |
| **Parallelism / thread safety** — no races on shared vars | **Learning curve** — monad tutorials, jargon |
| **Living docs** — composed pure functions read as specs | Some algorithms unnatural without mutation |

**Thoughts:**

"Functional core, imperative shell" is the pragmatic compromise in JS/TS. React blends OOP-like components with FP state updates.

*Math-like functions at the core; effects quarantined; trade memory for predictability.*

**Sources:**

[Fantasy Land](https://github.com/fantasyland/fantasy-land) · [Doka — FP](https://doka.guide/tools/programming-paradigms/)

---

</details>

---

Interview Q&A and coding tasks live in [JS — Interview](./3_js_interview.md).
