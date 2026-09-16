# JS Core — Functions

Function forms, `this`, higher-order functions, `call`/`apply`/`bind`, debounce, and related interview tasks.

[← Back to JS hub](./3_js.md)

### Related docs

- [JS Language](./3_js_core.md) · [Scope & closures](./3_js_core.md#scope-closures) · [JS Array](./3_js_array.md) · [JS OOP](./3_js_oop.md)
- [JS Async](./3_js_async.md) · [JS Events](./3_js_events.md) · [Special — FP](./7_special_paradigms.md#2-oop--fp)

### Main concepts

| Area | Topics |
| ---- | ------ |
| **Forms** | Declaration vs expression, arrows, IIFE, NFE |
| **Call site** | `this`, `call`/`apply`/`bind`, constructors |
| **HOF** | Callbacks, memoize, curry, composition, decorators |
| **Timing** | Debounce and throttle |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [Functions](#functions)
- [Function decorators](#function-decorators)
- [Interview Practice](#interview-practice)

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

**See also:** [7_special.md — Pure functions & side effects](./7_special.md) · [Functional core, imperative shell](./7_special_paradigms.md#functional-core-imperative-shell)

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
  <summary>Advanced functions</summary>

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

<a name="interview-practice"></a>

<details>
  <summary>Interview Practice</summary>

### Interview Practice

**Definition:** Q&A and tasks for function forms, `this`, bind, debounce, curry, and purity.

Lexical scope and closures stay in [JS Language — Scope & closures](./3_js_core.md#scope-closures).

### Question index

| Topic | Answer |
| ----- | ------ |
| `this`, bind/call/apply | Q&A below |
| Pure functions | Q&A below |
| Junior / Middle function lists | Q&A below |
| Debounce, bind, curry, memoize | Tasks 4, 6, 10, 12, 14 |

## Questions & Answers

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
  <summary>Middle — Functions</summary>

### Middle — Functions

**Definition:**

Advanced function techniques: currying, memoization, composition, and arrow tracing.

40. Explain currying with a practical example.
41. Memoization — when to apply?
42. Function chaining — example?
43. `function` vs arrow — trace nested arrow `pluckDeep`?

</details>


### Tasks

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


</details>
