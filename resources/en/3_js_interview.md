# JS — Interview

Interview Q&A and coding tasks for JavaScript.

[← Back to JS hub](./3_js.md)

### Related docs

- [Language](./3_js_core.md) · [Operators & Loops](./3_js_operators.md) · [Arrays](./3_js_array.md) · [Functions](./3_js_functions.md) · [Classes & Objects](./3_js_oop.md)
- [Document](./3_js_browser.md) · [Events](./3_js_events.md) · [Browser APIs](./3_js_browser_extra.md) · [Async](./3_js_async.md)

### Sections

- [Questions & Answers](#questions-answers)
- [Coding tasks](#coding-tasks)

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

Full pipeline: [JavaScript engine pipeline](#javascript-engine-pipeline). Memory model for frames vs objects: [Memory: stack and heap](./3_js_variables.md#memory-stack-heap).

**Sources:** [MDN — What is JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_is_JavaScript) · [Doka — memory](https://doka.guide/js/how-the-memory-works/)

</details>

<details>
  <summary>Stack vs heap — what lives where?</summary>

### Stack vs heap — what lives where?

**Stack:** call frames (args, locals, return address), push/pop via stack pointer. **Heap:** dynamic / unknown-size data (objects, growing arrays); the frame stores a reference. `throw` unwinds frames (stack trace). Overflow ≠ heap OOM. Model + examples: [Memory: stack and heap](./3_js_variables.md#memory-stack-heap).

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

See [Data Types & Variables — Closures](./3_js_variables.md#closures) for loop/`var` pitfalls and GC.

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

See [Signals (TC39)](./3_js_extra.md#signals) for dynamic deps, diamond, Watcher `effect`, `equals`, `untrack`.

**Sources:** [proposal-signals](https://github.com/proposal-signals/proposal-signals)

</details>

<details>
  <summary>typeof null, coercion, == vs ===?</summary>

### typeof null, coercion, == vs ===?

**Definition:** `typeof null === "object"` is a language bug from the first JS implementation (null tagged as object). `===` compares without coercion; `==` applies Abstract Equality (ToNumber, ToPrimitive).

**How it works:**

Prefer `===` / `!==`. The useful `==` exception: `value == null` is true for both `null` and `undefined` only. `Number.isNaN` does not coerce; global `isNaN` does.

| Pitfall          | Result     | Prefer           |
| ---------------- | ---------- | ---------------- |
| `typeof null`    | `"object"` | `value === null` |
| `[] == false`    | `true`     | `===`            |
| `isNaN("hello")` | `true`     | `Number.isNaN`   |

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

|                 | `Map` / `Set`                  | `WeakMap` / `WeakSet`                   |
| --------------- | ------------------------------ | --------------------------------------- |
| Key/value types | Any (`Map` keys, `Set` values) | Objects only                            |
| Iterable        | Yes                            | No                                      |
| `.size`         | Yes                            | No                                      |
| GC              | Keeps keys/values alive        | Lets object keys/values be collected    |
| Typical use     | Caches, indexes, dedupe        | Private metadata, DOM tags, "seen" sets |

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

| Expression               | Result                | Why                            |
| ------------------------ | --------------------- | ------------------------------ |
| `typeof null`            | `"object"`            | Legacy bug                     |
| `typeof []`              | `"object"`            | Arrays are objects             |
| `fn instanceof Function` | `true`                | Functions are callable objects |
| `1 == '1'`               | `true`                | Coercion                       |
| `{a:1} === {a:1}`        | `false`               | Reference compare              |
| `Object.keys(a)`         | `['[object Object]']` | Object keys stringify          |

**Sources:** [javascript.info/types](https://learn.javascript.ru/types)

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

Fundamental language questions: types, arrays, operators, scope, and collections. Array method answers: [JS Arrays](./3_js_array.md#interview-practice).

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

**Definition:** Recursive `reduce` lives in [JS Arrays — Interview Practice](./3_js_array.md#interview-practice).

</details>

<details>
  <summary>`map`, `forEach`, `reduce` — how do they work?</summary>

### `map`, `forEach`, `reduce` — how do they work?

**Definition:**

Array higher-order methods that iterate with a callback `(element, index, array)`.

| Method              | Returns                  | Use                                                 |
| ------------------- | ------------------------ | --------------------------------------------------- |
| `map(fn)`           | New array, same length   | Transform each element                              |
| `forEach(fn)`       | `undefined`              | Side effects only — no return value, cannot `break` |
| `reduce(fn, init?)` | Single accumulated value | Fold array into one result                          |

**How it works:**

- `map` — callback return becomes new element; original unchanged.
- `forEach` — like `map` but discards return; use `for...of` if you need `break`.
- `reduce` — callback `(acc, item) => nextAcc`; provide `init` on possibly empty arrays.

**Examples:**

```js
[1, 2, 3].map((n) => n * 2); // [2, 4, 6]
[1, 2, 3].forEach((n) => console.log(n)); // logs 1, 2, 3
[1, 2, 3].reduce((sum, n) => sum + n, 0); // 6
```

**Thoughts:** _`map` transforms, `forEach` acts, `reduce` aggregates._

**See also:** [Transformation & search](#transformation-and-search) (full theory)

</details>

<details>
  <summary>`reduce` vs `map` — when to use which?</summary>

### `reduce` vs `map` — when to use which?

**Definition:**

`map` always returns an array of the same length; `reduce` returns any type — number, object, Map, etc.

|           | `map`                  | `reduce`                       |
| --------- | ---------------------- | ------------------------------ |
| Output    | Array (same length)    | Any type                       |
| Best for  | Transform each item    | Aggregate, group, build object |
| Chainable | Yes (`map().filter()`) | Usually terminal               |

**How it works:**

Sum, count, group-by, flatten, build `{ subtotal, tax, total }` object from cart items.

Rename fields, format display values, extract IDs.

**Thoughts:** _If you need one value or object from an array, reach for `reduce`._

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

**Thoughts:** _Always pass an initial value when the array might be empty._

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
  { price: 100, category: "food" },
  { price: 200, category: "electronics" },
];
const discounts = { food: 0.1, electronics: 0.2 };

const total = items.reduce((sum, item) => {
  const rate = discounts[item.category] ?? 0;
  return sum + item.price * (1 - rate);
}, 0);
// 100*0.9 + 200*0.8 = 250
```

**Thoughts:** _Keep aggregation logic pure — same input always gives same output._

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
  <summary>Why avoid mutations? What is a pure function?</summary>

### Why avoid mutations? What is a pure function?

**Definition:** A **pure function** returns the same output for the same input and has no side effects (no mutating external state, no I/O).

**How it works:**

- React compares state by reference — mutating `state.push(x)` does not trigger re-render.
- Shared references cause bugs when one consumer mutates data another relies on.
- Easier to debug, test, and reason about immutable snapshots.

| Pure                             | Impure                               |
| -------------------------------- | ------------------------------------ |
| `(arr) => [...arr, x]`           | `arr.push(x); return arr`            |
| `reduce` with no external writes | `fetch`, `console.log`, `Date.now()` |

**Thoughts:** _Prefer `map`/`filter`/`reduce` and spread over `push`/`splice` on shared data._

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

<details>
  <summary>What are classes?</summary>

### What are classes?

**Definition:** A class is a **schema** for creating and using objects — fields (data) + methods (actions) + `constructor` (init on `new`).

**How it works:** `class History { ... }` creates a constructor function and puts methods on `History.prototype`. Each `new History()` is an instance; methods use `this` so they mutate _that_ instance. Factories (`createSpending`) are enough for small same-shaped objects; classes win when behavior and several instances matter.

**When to use:** Interview opener for OOP. Follow with prototype sugar, `this` rules, and why JS still lacks interfaces.

**Examples:**

```js
class Record {
  constructor(amount) {
    this.amount = amount;
    this.dateTime = Date.now();
  }
}

const spending = new Record(100);
console.log(spending.amount); // 100 — instance is a normal object
```

**Thoughts:** Class = blueprint; instance = house. In JS the blueprint is still a prototype chain.

**Sources:** [Doka — OOP](https://doka.guide/tools/oop/) · [MDN Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

</details>

<details>
  <summary>How does prototype inheritance work?</summary>

### How does prototype inheritance work?

**Definition:** Objects link to a prototype object; property lookup walks the chain until found or `null`.

**How it works:**

1. Every object has `[[Prototype]]` (`Object.getPrototypeOf(obj)`).
2. Read `obj.prop`: check own properties → walk prototype chain.
3. `new Fn()` sets instance `[[Prototype]]` to `Fn.prototype` and runs constructor.
4. Methods on `Fn.prototype` are shared by all instances.

**When to use:**

ES5 `Animal.prototype.method`; ES6 `class` desugars to same model; `Object.create(proto)` without constructor.

#### Common pitfalls

Setting `Child.prototype = Parent.prototype` (no `Child` in chain); confusing `__proto__` with `prototype` on functions.

**Examples:**

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return this.name;
};

const a = new Animal("Cat");
console.log(a.speak()); // 'Cat' — from Animal.prototype
console.log(Object.getPrototypeOf(a) === Animal.prototype); // true
```

`new` steps: create object → link prototype → call constructor with `this` → return object (unless constructor returns object).

**Sources:** [javascript.info/prototypes](https://learn.javascript.ru/prototypes)

</details>

<details>
  <summary>Class vs constructor function?</summary>

### Class vs constructor function?

**Definition:**

Both create objects with shared prototype methods; `class` is syntactic sugar with stricter rules.

|                        | Constructor function     | ES6 class             |
| ---------------------- | ------------------------ | --------------------- |
| Call without `new`     | Often breaks silently    | `TypeError`           |
| Strict mode            | Optional                 | Always                |
| Methods                | On `.prototype` manually | Inside class body     |
| Inheritance            | Manual prototype linking | `extends` / `super`   |
| Hoisting               | Function hoisted         | TDZ until declaration |
| `arguments` in methods | Available                | Not in class methods  |

**How it works:** `class User {}` creates function `User` and puts methods on `User.prototype` — same as writing constructor + `User.prototype.method`.

**When to use:**

Legacy codebases use constructors; new code prefers `class` for clarity and `extends`; factory functions when `new` is undesirable.

#### Common pitfalls

Calling class without `new`; expecting class hoisting like `function`; `typeof MyClass === 'function'` surprises newcomers.

**Examples:**

```js
// ES5
function UserES5(name) {
  this.name = name;
}
UserES5.prototype.greet = function () {
  return this.name;
};

// ES6 — equivalent intent
class UserES6 {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return this.name;
  }
}
```

**Sources:** [javascript.info/class](https://learn.javascript.ru/class)

</details>

<details>
  <summary>Composition vs inheritance?</summary>

### Composition vs inheritance?

**Definition:**

**Inheritance** — `is-a` (subtype shares prototype chain). **Composition** — `has-a` (object embeds or receives behavior from other objects/functions).

|              | Inheritance              | Composition                   |
| ------------ | ------------------------ | ----------------------------- |
| Relationship | `Dog extends Animal`     | `car.engine = createEngine()` |
| Flexibility  | Rigid tree               | Mix behaviors at runtime      |
| JS fit       | Single inheritance limit | Idiomatic in modern JS        |

**How it works:** Composition favors injecting dependencies or merging capability objects; inheritance sets fixed prototype chain at class definition time.

**When to use:**

Inheritance when subtype truly substitutes parent; composition for feature mixing, testing (mock dependencies), avoiding deep hierarchies.

#### Common pitfalls

Deep inheritance trees in JS; "god object" composing too many unrelated traits; using `extends` for code reuse only (prefer composition).

**Examples:**

```js
// Composition
const canFly = {
  fly() {
    return "flying";
  },
};
const bird = { name: "Eagle", ...canFly };

// Inheritance
class Animal {
  speak() {
    return "sound";
  }
}
class Dog extends Animal {
  speak() {
    return "woof";
  }
}
```

**Sources:** [javascript.info/mixins](https://learn.javascript.ru/mixins)

</details>

<details>
  <summary>Immutable object techniques?</summary>

### Immutable object techniques?

**Definition:** Prevent mutation at binding, property, or object-shape level — JS has no built-in deep immutability.

**How it works:**

- `const x = obj` — prevents rebinding `x`, not mutating `obj`.
- `Object.preventExtensions` / `seal` / `freeze` — escalating shallow locks (see **Property descriptors**).
- `Object.defineProperty` — `writable: false` per property.
- Copy-then-replace: `structuredClone` + new object instead of mutate (React/Redux style).
- Libraries: Immer produces immutable updates from draft mutations.

| Technique                   | Depth                | Reversible         |
| --------------------------- | -------------------- | ------------------ |
| `const`                     | binding only         | reassign variable  |
| `freeze`                    | shallow              | no                 |
| `defineProperty`            | one property         | if `configurable`  |
| `structuredClone` + replace | deep copy new tree   | old tree unchanged |
| Immer                       | logical immutability | produces new state |

**When to use:**

Redux state; frozen config; read-only API response exposure; defensive copies before passing to untrusted code.

#### Common pitfalls

`freeze` does not freeze nested objects; `const` ≠ immutable object; thinking `JSON.parse(JSON.stringify(o))` preserves all types.

**Examples:**

```js
const config = Object.freeze({ api: "https://api.example.com" });
// config.api = 'x'; // fails in strict

const next = structuredClone(state);
next.user.name = "Bob"; // new tree, state unchanged
```

Deep freeze requires recursive `Object.freeze` on nested objects or use Immer.

**Sources:** [javascript.info/property-descriptors](https://learn.javascript.ru/property-descriptors)

</details>

<details>
  <summary>What is Proxy for?</summary>

### What is Proxy for?

**Definition:** `Proxy` intercepts operations on a target object — validation, logging, virtual properties, reactivity.

**How it works:** Handler traps (`get`, `set`, `has`, …) run before default behavior; use `Reflect` inside traps for correct forwarding.

**When to use:** Validate assignments; implement `negativeIndex` array wrapper; Vue 3 reactivity; test mocks.

**Examples:**

```js
const arr = new Proxy([], {
  get(target, prop) {
    if (typeof prop === "string" && prop.startsWith("-")) {
      return target[target.length + Number(prop)];
    }
    return Reflect.get(target, prop);
  },
});
arr.push(10, 20, 30);
console.log(arr[-1]); // 30
```

Full trap list and pitfalls: [Proxy and Reflect](./3_js_oop.md#proxy-and-reflect).

**Sources:** [javascript.info/proxy](https://learn.javascript.ru/proxy)

</details>

<details>
  <summary>Coding tasks (legacy)</summary>

### Coding tasks (legacy)

// 4 Object.create — Create vehicle/car with inheritance and describe method

/// 8 **proto**, prototype, [[Prototype]]

/// 9 What is this? Solve the task

</details>

<details>
  <summary>Middle — JS Core (OOP)</summary>

### Middle — JS Core (OOP)

14. Describe how JS implements encapsulation, polymorphism, and abstraction.

15. What is a prototype? How does prototype inheritance work in JS? Explain with code.

16. What is the difference between composition and inheritance?

17. What behavioral differences exist between ES5 constructor functions and ES2015 classes?

18. What are property descriptors? Describe practical use cases.

19. Name several ways to create an immutable object in JavaScript.

20. How do you create a property that cannot be changed?

21. What is the Proxy constructor for? Give an example.

</details>

<details>
  <summary>JS Core (OOP)</summary>

### JS Core (OOP)

8. Implement the Class Free OOP pattern (https://observablehq.com/@bratter/class-free-oop).

</details>

<details>
  <summary>DOM vs BOM?</summary>

### DOM vs BOM?

**Definition:**

**DOM** models document content (nodes, elements); **BOM** models browser chrome/environment around the page (`window`, `location`, `history`, `navigator`).

|          | DOM                              | BOM                               |
| -------- | -------------------------------- | --------------------------------- |
| Scope    | HTML document tree               | Browser window & APIs             |
| Entry    | `document`                       | `window`                          |
| Examples | `querySelector`, `createElement` | `location`, `alert`, `setTimeout` |
| Spec     | DOM standard                     | HTML / browser specs              |

**How it works:** `window` is the global object; `document` is a property of `window`. DOM operations mutate/read page structure; BOM controls navigation, dialogs, viewport, timers.

**When to use:**

DOM for UI updates; BOM for redirects, opening windows, reading URL, history navigation.

See full table in [DOM vs BOM](#dom-vs-bom) under **DOM, BOM & events**.

**Sources:** [javascript.info/browser-environment](https://learn.javascript.ru/browser-environment)

</details>

<details>
  <summary>Junior — Front-end</summary>

### Junior — Front-end

42. What is the DOM? → [DOM](#dom-bom-events)

43. How do you get an element's height and position relative to the document? → [Browser additional — dimensions](./3_js_browser_extra.md)

44. What is webpack?

45. How does a dev build differ from a production build?

</details>

<details>
  <summary>Front-end</summary>

### Front-end

17. Compare `nextElementSibling` and `nextSibling`.

</details>

<details>
  <summary>Middle — Practical tasks (DOM)</summary>

### Middle — Practical tasks (DOM)

143. Implement a function that runs a callback for all elements in a given DOM subtree.

</details>

<details>
  <summary>Event bubbling and delegation?</summary>

### Event bubbling and delegation?

**Definition:** **Bubbling** — event propagates from target up to `window`. **Delegation** — one listener on ancestor handles events from descendants via `event.target`.

**How it works:**

1. Capture phase (optional): window → target.
2. Target phase: handlers on target.
3. Bubble phase (default): target → window.
4. Delegation: parent listens on bubble; checks `e.target.matches(selector)`.

**When to use:**

Dynamic list items — one `ul` listener; stopping propagation when overlay handles click; capture for early intercept.

#### Common pitfalls

`target` may be child inside `li` (use `closest`); `stopPropagation` breaks delegation above; assuming delegate on capture without `{ capture: true }`.

**Examples:**

```js
list.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li || !list.contains(li)) return;
  console.log(li.textContent);
});
```

See [Event phases](#event-phases) and [Event delegation](#event-delegation).

**Sources:** [javascript.info/event-delegation](https://learn.javascript.ru/event-delegation)

</details>

<details>
  <summary>Middle — Front-end</summary>

### Middle — Front-end

44. What is the key difference between `mouseleave` and `mouseout`?

45. In what order are DOM events processed (click, mouseover, etc.)? FIFO or LIFO?

46. What are event bubbling and event capturing?

47. Compare `stopPropagation` and `stopImmediatePropagation`.

</details>

<details>
  <summary>localStorage vs sessionStorage vs cookies?</summary>

### localStorage vs sessionStorage vs cookies?

**Definition:**

Three client storage mechanisms with different lifetime, scope, and server visibility.

|                         | localStorage             | sessionStorage          | Cookies                    |
| ----------------------- | ------------------------ | ----------------------- | -------------------------- |
| Lifetime                | until explicit clear     | until tab/window closed | `Expires` / session cookie |
| Shared across tabs      | yes (same origin)        | no (per tab)            | yes (domain-scoped)        |
| Sent with HTTP requests | no                       | no                      | yes (unless HttpOnly)      |
| Typical capacity        | ~5MB                     | ~5MB                    | ~4KB per cookie            |
| API                     | `getItem`/`setItem` sync | same                    | `document.cookie` string   |

**How it works:** Web Storage stores **strings** (`JSON.stringify` / `JSON.parse` — [JSON](./3_js_variables.md#json)). Cookies travel on HTTP; IndexedDB is async + objects. Full comparison, Safari 7-day ITP, quotas, localForage: [Browser storage](#browser-storage). HTTP flags: [HTTP cookies](./6_web_api_http.md#http-cookies).

**When to use:**

Theme → localStorage; tab draft → sessionStorage; auth id → HttpOnly cookie; large/offline → IndexedDB.

#### Common pitfalls

JWT in localStorage; cookie size; sessionStorage not cross-tab; Safari script-storage eviction after 7 days without interaction.

**Examples:**

```js
localStorage.setItem("theme", "dark");
sessionStorage.setItem("step", "2");
// cookie set by server preferred: Set-Cookie: sid=...; HttpOnly; Secure; SameSite=Lax
```

**Sources:** [javascript.info/localstorage](https://learn.javascript.ru/localstorage)

</details>

<details>
  <summary>What is CORS?</summary>

### What is CORS?

**Definition:** Cross-Origin Resource Sharing — browser mechanism allowing cross-origin HTTP responses to be read by JavaScript when the server sends appropriate `Access-Control-*` headers.

**How it works:**

- Same-origin policy blocks reading cross-origin response by default.
- Server adds `Access-Control-Allow-Origin` (specific origin or `*` for public APIs).
- Non-simple requests trigger **preflight** `OPTIONS`; server must allow method and headers.
- Credentialed requests need `credentials: 'include'` and cannot use `Allow-Origin: *`.

**When to use:**

API on `api.example.com` consumed by `app.example.com`; public CDN with `*`; cookie auth requires explicit origin.

See [CORS and same-origin policy](#cors-same-origin) and [Web API — CORS](./6_web_api_security.md#cors).

#### Common pitfalls

CORS is browser-only — not server-side security boundary; misconfigured preflight; confusing with same-origin policy for iframes/DOM.

**Sources:** [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

</details>

<details>
  <summary>How do tabs communicate? Same-origin rules?</summary>

### How do tabs communicate? Same-origin rules?

**Definition:** Tabs communicate via `postMessage`, `BroadcastChannel`, `localStorage` + `storage` event, `SharedWorker`, or Service Worker — gated by same-origin policy for most APIs.

**How it works:**

- **Same origin** = protocol + host + port match.
- Direct access (`otherWindow.document`) — same origin only.
- `postMessage` — cross-origin allowed; must validate `event.origin`.
- `BroadcastChannel` / `storage` / `SharedWorker` — same origin only.
- `sessionStorage` — not shared between tabs.

**When to use:**

Logout broadcast → BroadcastChannel; theme sync → localStorage + storage; OAuth popup → postMessage.

See [Cross-tab & cross-window communication](#cross-tab-communication).

#### Common pitfalls

Skipping origin check on `message`; expecting sessionStorage cross-tab; race on concurrent localStorage writes.

**Sources:** [javascript.info/cross-window-communication](https://learn.javascript.ru/cross-window-communication)

</details>

<details>
  <summary>requestAnimationFrame?</summary>

### requestAnimationFrame?

**Definition:** `requestAnimationFrame(callback)` schedules a function to run before the next browser repaint, typically ~60fps.

**How it works:**

- Browser batches visual updates; callback receives `DOMHighResTimeStamp`.
- Chain `requestAnimationFrame` inside callback for animation loop.
- Paused when tab hidden — saves CPU/battery.
- `cancelAnimationFrame(id)` stops scheduled frame.

**When to use:** JS animations; measure-then-mutate layout; scroll-linked effects.

**Pluses and minuses:**

| +                                     | −                            |
| ------------------------------------- | ---------------------------- |
| Synced to display refresh             | Still runs on main thread    |
| Better than setInterval for animation | Not for arbitrary delays     |
| Auto-pauses in background             | Heavy work still causes jank |

**Examples:**

```js
let x = 0;
function tick(ts) {
  x += 2;
  box.style.transform = `translateX(${x}px)`;
  if (x < 300) requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
```

See [requestAnimationFrame](#request-animation-frame) in **Browser APIs & UI patterns**.

**Sources:** [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

</details>

<details>
  <summary>requestIdleCallback?</summary>

### requestIdleCallback?

**Definition:** `requestIdleCallback(cb, { timeout })` runs `cb` when the browser is idle (or when `timeout` elapses). `IdleDeadline.timeRemaining()` estimates leftover milliseconds.

**How it works:** Not a microtask. rAF is for frames; idle is for leftover time. A microtask storm delays both paint and idle work.

**Thoughts:**

_Use idle for non-urgent work; never for animations._

See [requestIdleCallback](#request-idle-callback) in theory (after rAF).

**Sources:** [MDN requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)

</details>

<details>
  <summary>Local storage</summary>

### Local storage

```js
class MyStorage {
  get(key) {}

  set(key, value) {}
}

const main = () => {
  const st = new MyStorage();

  st.set("userA", { name: "a" });
  st.get("userA"); // {name: "a"}

  st.set("userB", null);
  st.get("userB"); // null

  st.get("userC"); // throw error
};

// solution

class MyStorage {
  get(key) {
    if (!localStorage.hasOwnProperty(key)) {
      throw new Error(`Key "${key}" not found`);
    }

    const value = localStorage.getItem(key);
    return value === "null" ? null : JSON.parse(value);
  }

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

const main = () => {
  const st = new MyStorage();

  st.set("userA", { name: "a" });
  console.log(st.get("userA")); // { name: "a" }

  st.set("userB", null);
  console.log(st.get("userB")); // null

  try {
    console.log(st.get("userC")); // throws error
  } catch (error) {
    console.error(error.message); // "Key 'userC' not found"
  }
};

main();
```

External test: https://chm.org.ua/ru/testy-po-programmirovaniiu/test-dom-bom-v-javascript/

</details>

<details>
  <summary>Output tasks</summary>

### Output tasks

```js
console.log([] + null + 1); // 'null1'
```

<details>
  <summary>details</summary>

`[]` coerces to `""`. `"" + null` → `"null"`. `"null" + 1` → `"null1"`.

</details>

```js
"foo" + +"bar"; // 'fooNaN'
```

<details>
  <summary>details</summary>

Unary `+` on `"bar"` → `NaN`. `"foo" + NaN` → `"fooNaN"`.

</details>

```
!!"false" == !!"true" // true
```

<details>
  <summary>details</summary>

Both `!!"false"` and `!!"true"` are `true` (non-empty strings are truthy).

</details>

```
"a" && "" && "c" // ""
```

<details>
  <summary>details</summary>

`&&` returns the first falsy operand — `""`.

</details>

```
"a" && "" || "c" // "c"
```

<details>
  <summary>details</summary>

`"a" && ""` → `""` (falsy). `"" || "c"` → `"c"`.

</details>

```
"" ?? "a" // ""
```

<details>
  <summary>details</summary>

`??` returns the right side only for `null` or `undefined`. `""` is neither.

</details>

```js
var employeeId = "1234abe";
(function () {
  console.log(employeeId);
  var employeeId = "122345";
})();
// undefined (hoisting — TDZ until assignment in IIFE)
```

```js
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
Promise.resolve().then(() => setTimeout(() => console.log(4)));
Promise.resolve().then(() => console.log(5));
setTimeout(() => console.log(6));
console.log(7);
// 1, 7, 3, 5, 2, 6, 4
```

```js
setTimeout(() => console.log(1), 500);
console.log(2);
setTimeout(() => console.log(3));
Promise.resolve(6).then((response) => console.log(response));
Promise.resolve(new Promise(() => console.log(7)));
console.log(4);
setTimeout(() => console.log(5), 200);
// 2, 7, 4, 6, 5, 3, 1
```

```js
const square = {
  side: 10,
  area() {
    return this.side * this.side;
  },
  perimeter: () => 2 * this.side,
};

console.log(square.area()); // 100
console.log(square.perimeter()); // NaN (arrow — no own this)
```

```js
var foo = function bar() {
  return 1;
};
console.log(typeof bar());
// ReferenceError: bar is not defined (bar is not in outer scope)
```

</details>

<details>
  <summary>Map callback example</summary>

### Map callback example

```js
function each(array, callback) {
  const newArray = array.map(callback);
  return newArray;
}

const eachToTitle = (value) => value.toUpperCase();
const eachToReverse = (value) => value.split("").reverse().join("");
const eachToFactor2 = (value) => value * 2;

const arrayOfNumbers = [1, 2, 3];
const arrayOfStrings = ["roman", "getsman"];

console.log(each(arrayOfNumbers, eachToFactor2)); // [2, 4, 6]
console.log(each(arrayOfStrings, eachToReverse)); // ['namor', 'namsteg']
console.log(each(arrayOfStrings, eachToTitle)); // ['ROMAN', 'GETSMAN']
```

</details>

<details>
  <summary>Date formatting</summary>

### date

```js
export const dateFormat = (ms, options, locale) => {
  const _options = options || {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return new Intl.DateTimeFormat(locale || "ru-RU", _options).format(ms);
};

dateFormat(Date.now(), {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});
```

</details>

<details>
  <summary>Promise coding exercises</summary>

### Promises

```js
function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function main() {
  console.log(1);
  await delay(1000);
  console.log(2);
}

main();
```

```js
console.log(Promise.resolve(1));
// Promise { <fulfilled>: 1 }

Promise.resolve()
  .then(() => 1)
  .then(console.log);
// 1

Promise.resolve()
  .then(() => console.log(2))
  .then(() => console.log(3))
  .then(() => {
    setTimeout(() => console.log(4));
  })
  .then(() => console.log(5));

new Promise((resolve, reject) => {
  console.log(6);
  setTimeout(() => console.log(7), 0);
  resolve();
});

setTimeout(() => console.log(8), 0);

console.log(9);
// 6, 9, 2, 3, 5, 7, 8, 4
```

```js
const delay = (t) => new Promise((r) => setTimeout(r, t));

const runner = async (task) => {
  await task();
};

const main = () => {
  const t1 = async () => {
    await delay(10);
    console.log("t1");
  };
  const t2 = async () => {
    await delay(5);
    console.log("t2");
  };
  const t3 = async () => {
    await delay(15);
    console.log("t3");
  };

  runner(t1);
  runner(t2);
  runner(t3);
};

main();
// t2, t1, t3 (parallel start, finish by delay)
```

Logger exercise: [jsfiddle](https://jsfiddle.net/hlieb/fryuvapb/1/)

</details>

<details>
  <summary>Junior — JS Core (async topics)</summary>

### Junior — JS Core

23. What are `setTimeout` and `setInterval` for?
24. Compare callbacks vs promises vs async/await.
25. What is recursion?
26. What is a Promise? Order of `then` and `catch` in a chain.
27. Sequential vs parallel async execution. Difference between `Promise.all()` and `Promise.allSettled()`.

</details>

<details>
  <summary>Middle — JS Core (async topics)</summary>

### Middle — JS Core

18. Describe the Event loop.
19. What is an Observable vs a Promise?
20. What is a Promise? Order of `then` and `catch` in a chain.
21. Sequential vs parallel async. `Promise.all()` vs `Promise.allSettled()`.
22. Generators and iterators.
23. Async disposer pattern.

</details>

<details>
  <summary>Practical tasks (async)</summary>

### Practical tasks (async)

43. Implement an async `Array.prototype.filter` (must support `await` in predicate).

44. Write `Sleep(ms)` that pauses an async function for a given duration.

45. Implement one array method (e.g. `splice`).

</details>

<details>
  <summary>Explain the event loop order</summary>

### Explain the event loop order

**Definition:** The event loop schedules work in a fixed priority: synchronous call stack first, then all microtasks, then one macrotask, then (browser) possibly a render frame.

**How it works:**

1. Run synchronous code until the call stack is empty.
2. Drain **all microtasks** (`Promise.then`, `queueMicrotask`, `MutationObserver`, `async/await` continuations).
3. Run **one macrotask** (`setTimeout`, I/O, UI events).
4. Browser: optionally run render steps (style, layout, paint).
5. Repeat.

Node: `process.nextTick` runs before other microtasks.

| Pros                                      | Cons                                |
| ----------------------------------------- | ----------------------------------- |
| Predictable promise-before-timer ordering | Easy to get wrong in nested puzzles |
| Microtasks batch related async work       | Long microtask queues delay UI      |
| One macro per turn allows paint           | Node phases add complexity          |

**When to use:** Interview output questions; debugging "why did this run first?"; avoiding UI jank.

**Examples:**

```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// 1, 4, 3, 2
```

**Common pitfalls:**

- `new Promise(executor)` — executor is sync; only `.then` is microtask.
- `setTimeout` inside microtask still waits for next macrotask turn.

**Thoughts:** _Sync → drain all microtasks → one macrotask → (browser may paint) → micros spawned by that macrotask → … Infinite micros starve paint and idle callbacks._

**Sources:** [javascript.info/event-loop](https://learn.javascript.ru/event-loop)

</details>

<details>
  <summary>Log order: sync, Promise, then setTimeout that queues another Promise</summary>

### Log order: sync, Promise, then setTimeout that queues another Promise

**Definition:** Nested scheduling: a macrotask can enqueue microtasks that run **before** the next macrotask.

**How it works:**

```js
console.log("A");
setTimeout(() => {
  console.log("B");
  Promise.resolve().then(() => console.log("C"));
}, 0);
Promise.resolve().then(() => {
  console.log("D");
  setTimeout(() => console.log("E"), 0);
});
console.log("F");
// A, F, D, B, C, E
```

1. Sync: `A`, register timer, register micro `D`, `F`.
2. Drain micros: `D` (schedules timer `E`).
3. One macro: `B` (schedules micro `C`).
4. Drain micros: `C`.
5. Next macro: `E`.

**When to use:** Interview output puzzles. Comment each line: sync / micro / macro.

**Thoughts:** _After each macrotask, empty the microtask queue again before the next timer._

**See also:** [Explain the event loop order](#interview-practice)

**Sources:** [javascript.info/event-loop](https://learn.javascript.ru/event-loop)

</details>

<details>
  <summary>Promise vs callback?</summary>

### Promise vs callback?

**Definition:** Callbacks invoke a function when async work completes; Promises are objects representing a future value with chainable `.then`/`.catch`.

**How it works:**

- Callbacks: inversion of control — callee decides when to call.
- Promises: single settlement, composable chains, errors propagate to `.catch`.
- Promises wrap callbacks via promisification; `async/await` is promise syntax sugar.

|                | Callback                               | Promise                             |
| -------------- | -------------------------------------- | ----------------------------------- |
| Composition    | Manual nesting                         | `.then` chains, `Promise.all`       |
| Errors         | Error-first convention or easy to miss | `.catch` / `try/catch` with `await` |
| Multiple calls | Possible (events)                      | Settles once                        |

| Pros                           | Cons                                   |
| ------------------------------ | -------------------------------------- |
| Promises unify async style     | Promises don't cancel natively         |
| Callbacks universal for events | Callback hell for sequential steps     |
| Promises work with `await`     | Promisifying loses multi-callback APIs |

**When to use:** Events → callbacks; app logic → promises/`async`; legacy Node → promisify.

**Examples:**

```js
// Callback
readFile("a.txt", (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});

// Promise
readFilePromise("a.txt")
  .then((data) => console.log(data))
  .catch(console.error);
```

**Sources:** [javascript.info/promise-basics](https://learn.javascript.ru/promise-basics) · [javascript.info/callbacks](https://learn.javascript.ru/callbacks)

</details>

<details>
  <summary>Promise.all vs allSettled vs race vs any?</summary>

### Promise.all vs allSettled vs race vs any?

**Definition:** Static methods combining multiple promises with different settlement rules.

**How it works:**

- `all` — all fulfill or first reject; results in input order.
- `allSettled` — wait for all; never rejects; `{ status, value|reason }`.
- `race` — first settle wins (fulfill or reject).
- `any` — first fulfill wins; `AggregateError` if all reject.

| Method               | Resolves when | Rejects when |
| -------------------- | ------------- | ------------ |
| `Promise.all`        | all fulfill   | first reject |
| `Promise.allSettled` | all settle    | never        |
| `Promise.race`       | first settle  | first reject |
| `Promise.any`        | first fulfill | all reject   |

| Pros                                      | Cons                            |
| ----------------------------------------- | ------------------------------- |
| `all` — fast fail, parallel required data | One failure loses everything    |
| `allSettled` — full status report         | Verbose to map results          |
| `race` — timeouts                         | Loser requests may still run    |
| `any` — redundant sources                 | Rare; `AggregateError` handling |

**When to use:**

| Method       | Use when                           |
| ------------ | ---------------------------------- |
| `all`        | User + permissions both required   |
| `allSettled` | Bulk upload — show per-file status |
| `race`       | 5s timeout on `fetch`              |
| `any`        | Try CDN mirrors until one succeeds |

**Examples:**

```js
const results = await Promise.allSettled([fetch("/a"), fetch("/b")]);
results.forEach((r) => {
  if (r.status === "fulfilled") console.log(r.value);
  else console.error(r.reason);
});
```

**Common pitfalls:**

- `all` when partial success is OK — use `allSettled`.
- `race` for timeout without `AbortController` — request continues in background.

**Sources:** [javascript.info/promise-api](https://learn.javascript.ru/promise-api)

</details>

<details>
  <summary>async/await — parallel vs sequential?</summary>

### async/await — parallel vs sequential?

**Definition:** Sequential `await` waits for each task before starting the next; parallel execution starts all tasks, then awaits together (usually `Promise.all`).

**How it works:**

- Sequential: total time ≈ sum of latencies.
- Parallel: total time ≈ max latency (for independent I/O).
- Start promises before `await` — `const p = fetchA(); await fetchB(); await p` overlaps A and B.
- `for` loop with `await` — sequential by default.

| Pattern            | Latency (independent 100ms × 2) |
| ------------------ | ------------------------------- |
| Sequential `await` | ~200ms                          |
| `Promise.all`      | ~100ms                          |

| Pros                             | Cons                                  |
| -------------------------------- | ------------------------------------- |
| Sequential: clear dependencies   | Sequential: unnecessarily slow        |
| Parallel: minimal wait           | `all`: one failure fails batch        |
| `allSettled` for partial success | Harder to read than sync-looking code |

**When to use:** Sequential when step 2 needs step 1 output; parallel for independent API calls.

**Examples:**

```js
// Sequential — B waits for A
const a = await fetchA();
const b = await fetchB();

// Parallel — start both, await together
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

**Common pitfalls:**

- Sequential `await` in `for` loop over 100 items — 100 round trips.
- Forgetting that `fetchA()` without await still starts the request — good for parallel if you collect promises first.

**Sources:** [javascript.info/async-await](https://learn.javascript.ru/async-await)

</details>

<details>
  <summary>What does async function return?</summary>

### What does async function return?

**Definition:** An `async` function **always** returns a `Promise`, regardless of what you `return`.

**How it works:**

- `return value` → `Promise.resolve(value)`.
- `throw err` → `Promise.reject(err)`.
- Bare `return` → `Promise.resolve(undefined)`.
- Caller must `await fn()` or `fn().then(...)` to get value or catch errors.
- `await` inside only works in `async` functions (or top-level modules).

| Pros                         | Cons                                    |
| ---------------------------- | --------------------------------------- |
| Uniform promise interface    | Easy to forget `await` at call site     |
| Interops with `.then` chains | Stack traces cross async boundaries     |
| `try/catch` inside async fn  | Returned promise needs its own `.catch` |

**When to use:** Always treat call result as Promise unless you `await` immediately.

**Examples:**

```js
async function getValue() {
  return 42;
}
getValue(); // Promise { 42 }
await getValue(); // 42

async function fail() {
  throw new Error("oops");
}
fail().catch(console.error); // required or unhandled rejection
```

**Common pitfalls:**

- `const x = asyncFn()` — `x` is Promise, not resolved value.
- `async` arrow in `map` without `Promise.all` — concurrent but unhandled rejections.

**Sources:** [javascript.info/async-await](https://learn.javascript.ru/async-await)

</details>

<details>
  <summary>Unhandled promise rejection?</summary>

### Unhandled promise rejection?

**Definition:** A rejected Promise with no attached `.catch` and no `await` in `try/catch` triggers runtime warnings or process exit.

**How it works:**

- Browser: `unhandledrejection` on `window`.
- Node: `process.on('unhandledRejection', ...)`.
- Fix: `.catch`, `try/catch` + `await`, or `.catch` on async IIFE.
- Global handler for logging — not a substitute for local handling.

| Pros                         | Cons                                  |
| ---------------------------- | ------------------------------------- |
| Surfaces missing error paths | Can crash Node in production          |
| Monitor with global listener | Fire-and-forget promises easy to miss |

**When to use:** Every `fetch`, `async` route handler, and fire-and-forget task needs a handler.

**Examples:**

```js
// Bad
async function load() {
  throw new Error("fail");
}
load();

// Good
load().catch(console.error);
```

**Sources:** [MDN unhandledrejection](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event)

</details>

<details>
  <summary>AbortController?</summary>

### AbortController?

**Definition:** API to cancel `fetch` and other operations via an `AbortSignal`.

**How it works:**

- Create controller; pass `signal` to `fetch`.
- Call `abort()` to cancel; promise rejects with `AbortError`.
- Use in React `useEffect` cleanup to cancel on unmount.
- `AbortSignal.timeout(ms)` for built-in timeout (modern runtimes).

| Pros                           | Cons                                           |
| ------------------------------ | ---------------------------------------------- |
| Stops stale requests           | Not all APIs support signals                   |
| Prevents race conditions in UI | Must distinguish `AbortError` from real errors |
| Standard across fetch          | One-shot — new controller per request          |

**When to use:** Search autocomplete, route change, request timeout, `Promise.race` cleanup.

**Examples:**

```js
const ac = new AbortController();
fetch("/api", { signal: ac.signal });
ac.abort(); // AbortError
```

**Sources:** [javascript.info/fetch-abort](https://learn.javascript.ru/fetch-abort)

</details>

---

## Coding tasks

<details>
  <summary>Task 1 — typeof output</summary>

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

</details>

<details>
  <summary>Task 2 — == vs ===</summary>

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

</details>

<details>
  <summary>Task 3 — Closure loop</summary>

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

</details>

<details>
  <summary>Task 5 — Prototype reference</summary>

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

</details>

<details>
  <summary>Task 9 — Deep clone (JSON limitations)</summary>

### Task 9 — Deep clone (JSON limitations)

When is `JSON.parse(JSON.stringify(obj))` unsafe?

<details><summary>Answer</summary>

Loses `undefined`, functions, symbols; `Date` becomes an ISO string; `Map`/`Set` become `{}`; `NaN`/`Infinity` become `null`; circular refs and `BigInt` throw. Use `structuredClone` when available.

</details>

</details>

<details>
  <summary>Task 13 — Object.is vs ===</summary>

### Task 13 — Object.is vs ===

When does `Object.is(NaN, NaN)` differ from `NaN === NaN`?

<details><summary>Answer</summary>

`NaN === NaN` is `false`; `Object.is(NaN, NaN)` is `true`. `Object.is(+0, -0)` is `false`; `+0 === -0` is `true`.

</details>

</details>

<details>
  <summary>Task 15 — Query string to object</summary>

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

</details>

<details>
  <summary>Task 16 — Cart aggregation with category discounts</summary>

### Task 16 — Cart aggregation with category discounts

See [JS Arrays](./3_js_array.md#interview-practice)

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

| Expression               | Result                | Why                            |
| ------------------------ | --------------------- | ------------------------------ |
| `typeof null`            | `"object"`            | Legacy bug                     |
| `typeof []`              | `"object"`            | Arrays are objects             |
| `fn instanceof Function` | `true`                | Functions are callable objects |
| `1 == '1'`               | `true`                | Coercion                       |
| `{a:1} === {a:1}`        | `false`               | Reference compare              |
| `Object.keys(a)`         | `['[object Object]']` | Object keys stringify          |

**Sources:** [javascript.info/types](https://learn.javascript.ru/types)

</details>

<details>
  <summary>call / apply / bind (practice)</summary>

### call / apply / bind

**Definition:** Moved to [JS Functions](./3_js_functions.md#call-apply-bind)

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

Fundamental language questions: types, arrays, operators, scope, and collections. Array method answers: [JS Arrays](./3_js_array.md#interview-practice).

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

**Definition:** Moved to [JS Functions](./3_js_functions.md#junior-functions)

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

**Definition:** Moved to [JS Functions](./3_js_functions.md#middle-functions)

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

**Definition:** Recursive `reduce` lives in [JS Arrays — Interview Practice](./3_js_array.md#interview-practice).

</details>

</details>

<details>
  <summary>Task 7 — Flatten array (one level)</summary>

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

</details>

<details>
  <summary>Task 8 — Polyfill Array.map</summary>

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

</details>

<details>
  <summary>Task 11 — Unique array values</summary>

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

</details>

<details>
  <summary>Task 4 — this context</summary>

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

</details>

<details>
  <summary>Task 6 — Implement debounce</summary>

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

</details>

<details>
  <summary>Task 10 — Implement bind</summary>

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

</details>

<details>
  <summary>Task 12 — Curry add</summary>

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

</details>

<details>
  <summary>Task 14 — Memoize</summary>

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

<details>
  <summary>Task 1 — Object.create inheritance</summary>

### Task 1 — Object.create inheritance

Create `vehicle` with `describe`, `car` inherits and adds `wheels`.

<details><summary>Solution</summary>

```js
const vehicle = {
  describe() {
    return `${this.brand}`;
  },
};
const car = Object.create(vehicle);
car.brand = "Toyota";
car.wheels = 4;
```

</details>

</details>

<details>
  <summary>Task 2 — instanceof without built-in</summary>

### Task 2 — instanceof without built-in

How does `obj instanceof Constructor` work?

<details><summary>Answer</summary>

Walks `obj.__proto__` chain checking if any equals `Constructor.prototype`.

</details>

</details>

<details>
  <summary>Task 3 — Define read-only property</summary>

### Task 3 — Define read-only property

```js
const obj = {};
// add `id` that cannot be changed
```

<details><summary>Solution</summary>

```js
Object.defineProperty(obj, "id", {
  value: 1,
  writable: false,
  enumerable: true,
});
```

</details>

</details>

<details>
  <summary>Task 4 — Proxy validation</summary>

### Task 4 — Proxy validation

Proxy that rejects negative `age` assignments.

<details><summary>Solution</summary>

```js
const user = new Proxy(
  {},
  {
    set(target, prop, value) {
      if (prop === "age" && value < 0) throw new RangeError("age");
      target[prop] = value;
      return true;
    },
  },
);
```

</details>

---

<details>
  <summary>Coding tasks (legacy)</summary>

### Coding tasks (legacy)

// 4 Object.create — Create vehicle/car with inheritance and describe method

/// 8 **proto**, prototype, [[Prototype]]

/// 9 What is this? Solve the task

</details>

<details>
  <summary>Middle — JS Core (OOP)</summary>

### Middle — JS Core (OOP)

14. Describe how JS implements encapsulation, polymorphism, and abstraction.

15. What is a prototype? How does prototype inheritance work in JS? Explain with code.

16. What is the difference between composition and inheritance?

17. What behavioral differences exist between ES5 constructor functions and ES2015 classes?

18. What are property descriptors? Describe practical use cases.

19. Name several ways to create an immutable object in JavaScript.

20. How do you create a property that cannot be changed?

21. What is the Proxy constructor for? Give an example.

</details>

<details>
  <summary>JS Core (OOP)</summary>

### JS Core (OOP)

8. Implement the Class Free OOP pattern (https://observablehq.com/@bratter/class-free-oop).

</details>

</details>

<details>
  <summary>Task 1 — Event delegation</summary>

### Task 1 — Event delegation

List of `<li>` items — one click handler on `<ul>`, alert clicked item text.

<details>
  <summary>DOM</summary>

### DOM

https://jsfiddle.net/softnetix/r3u1cy0n/

```js
// DOM list exercise — page markup: [1_html.md](1_html.md)

const users = [
  {
    id: "njscmmaks",
    name: "Petya",
  },
  {
    id: "mnfdmnfdm",
    name: "Vasya",
  },
  {
    id: "lswlqdwa",
    name: "Dima",
  },
  {
    id: "jncvmdasd",
    name: "Olga",
  },
];

const list = document.getElementById("list");

users.forEach(({ name }) => {
  const li = document.createElement("li");

  li.innerText = name;

  list.appendChild(li);
});

const handler = () => {
  //solution
};

list.addEventListener("click", handler);

// solution

const handler = (event) => {
  if (event.target.tagName === "LI") {
    alert(`You clicked on: ${event.target.dataset.id}`);
  }
};

// Add `id` as a `data-id` attribute when creating list items
users.forEach(({ id, name }) => {
  const li = document.createElement("li");

  li.innerText = name;
  li.dataset.id = id; // Store the user ID in a data attribute

  list.appendChild(li);
});

list.addEventListener("click", handler);
```

</details>

<details>
  <summary>Junior — Front-end</summary>

### Junior — Front-end

45. Describe the event bubbling process in the DOM.

46. How do you stop event bubbling?

47. How do you prevent the default event action?

48. What is `this` in an event handler?

</details>

<details>
  <summary>Middle — Front-end</summary>

### Middle — Front-end

44. What is the key difference between `mouseleave` and `mouseout`?

45. In what order are DOM events processed (click, mouseover, etc.)? FIFO or LIFO?

46. What are event bubbling and event capturing?

47. Compare `stopPropagation` and `stopImmediatePropagation`.

</details>

</details>

</details>

<details>
  <summary>Task 2 — Debounced scroll</summary>

### Task 2 — Debounced scroll

Attach a scroll listener that logs only after the user **stops** scrolling for 200ms — that is [debounce](./3_js_browser_extra.md#debounce), not throttle.

<details><summary>Solution</summary>

```js
let timer;
window.addEventListener("scroll", () => {
  clearTimeout(timer);
  timer = setTimeout(() => console.log("scroll ended"), 200);
});
```

</details>

</details>

<details>
  <summary>Task 3 — Storage wrapper</summary>

### Task 3 — Storage wrapper

→ See [Local storage](#local-storage) exercise below.

<a name="local-storage"></a>

<details>
  <summary>Local storage</summary>

### Local storage

```js
class MyStorage {
  get(key) {}

  set(key, value) {}
}

const main = () => {
  const st = new MyStorage();

  st.set("userA", { name: "a" });
  st.get("userA"); // {name: "a"}

  st.set("userB", null);
  st.get("userB"); // null

  st.get("userC"); // throw error
};

// solution

class MyStorage {
  get(key) {
    if (!localStorage.hasOwnProperty(key)) {
      throw new Error(`Key "${key}" not found`);
    }

    const value = localStorage.getItem(key);
    return value === "null" ? null : JSON.parse(value);
  }

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

const main = () => {
  const st = new MyStorage();

  st.set("userA", { name: "a" });
  console.log(st.get("userA")); // { name: "a" }

  st.set("userB", null);
  console.log(st.get("userB")); // null

  try {
    console.log(st.get("userC")); // throws error
  } catch (error) {
    console.error(error.message); // "Key 'userC' not found"
  }
};

main();
```

External test: https://chm.org.ua/ru/testy-po-programmirovaniiu/test-dom-bom-v-javascript/

</details>

<details>
  <summary>Junior — Front-end</summary>

### Junior — Front-end

49. What are localStorage and sessionStorage? What is the max localStorage size?

</details>

<details>
  <summary>Middle — Front-end</summary>

### Middle — Front-end

48. What approaches optimize web page performance?

49. How does the same-origin policy work? Which browser APIs does it affect?

50. Name browser storage mechanisms and compare them.

51. Web Workers — how is data passed between workers and the main thread, and between shared workers?

52. What are Transferable objects?

53. How do you optimize heavy JS work to improve page rendering performance?

54. Why does ResizeObserver fire before the element is painted, not after?

55. Describe how to read a `.txt` file dropped from the file system into the browser window.

56. What is the Virtual DOM?

</details>

<details>
  <summary>Front-end</summary>

### Front-end

11. How does the browser determine if tabs can communicate with each other? → [#cross-tab-communication](#cross-tab-communication)

12. How do you avoid loading cached script and style files? → [2_css.md — cache busting](2_css_interview.md#interview-practice)

13. What is `requestAnimationFrame`? → [#request-animation-frame](#request-animation-frame)

14b. What is `requestIdleCallback`? → [#request-idle-callback](#request-idle-callback)

15. Describe micro-frontend architecture.

16. What web performance metrics do you know?

</details>

</details>

<details>
  <summary>Task 1 — Event loop output</summary>

### Task 1 — Event loop output

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

<details><summary>Answer</summary> A, D, C, B </details>

</details>

<details>
  <summary>Task 2 — Promise chain</summary>

### Task 2 — Promise chain

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then((x) => {
    throw new Error("fail");
  })
  .catch(() => 42)
  .then(console.log);
```

<details><summary>Answer</summary> `42` </details>

</details>

<details>
  <summary>Task 3 — Implement delay</summary>

### Task 3 — Implement delay

```js
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

</details>

<details>
  <summary>Task 4 — promiseAll polyfill</summary>

### Task 4 — promiseAll polyfill

```js
function promiseAll(iterable) {
  /* ... */
}
```

<details><summary>Solution</summary>

```js
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(iterable);
    if (arr.length === 0) return resolve([]);
    const results = [];
    let done = 0;
    arr.forEach((p, i) => {
      Promise.resolve(p).then((val) => {
        results[i] = val;
        if (++done === arr.length) resolve(results);
      }, reject);
    });
  });
}
```

</details>

</details>

<details>
  <summary>Task 5 — Retry with backoff</summary>

### Task 5 — Retry with backoff

```js
async function retry(fn, retries = 3, delay = 100) {
  /* ... */
}
```

<details><summary>Solution</summary>

```js
async function retry(fn, retries = 3, delay = 100) {
  try {
    return await fn();
  } catch (e) {
    if (retries <= 0) throw e;
    await new Promise((r) => setTimeout(r, delay));
    return retry(fn, retries - 1, delay * 2);
  }
}
```

</details>

---

<details>
  <summary>Coding tasks (legacy)</summary>

### Coding tasks (legacy)

10. What is the Event Loop? Callback queue.
11. What are promises? Solve the delay task.

</details>

</details>
