# JS Core — Data Types & Variables

Primitives, coercion, stack/heap memory, collections, JSON, bindings, scope, `globalThis`, and closures. Runtime and modules live in [Language](./3_js_core.md); operators and control flow in [Operators & Loops](./3_js_operators.md).

[← Back to JS hub](./3_js.md)

### Related docs

- [JS Language](./3_js_core.md) · [JS Operators & Loops](./3_js_operators.md) · [JS Arrays](./3_js_array.md) · [JS Functions](./3_js_functions.md) · [JS OOP](./3_js_oop.md) · [JS Document](./3_js_browser.md) · [JS Events](./3_js_events.md) · [JS Async](./3_js_async.md) · [JS Interview](./3_js_interview.md)
- [Iterables](./3_js_operators.md#iterators) · [Computer science](./7_special_cs.md)

### Main concepts

| Area              | Topics                                                          |
| ----------------- | --------------------------------------------------------------- |
| **Memory**        | Stack frames vs heap objects, value vs reference                |
| **Types**         | Primitives, coercion, numbers, `Date`, strings, `Symbol`, objects, `Map`/`Set`, JSON |
| **Bindings**      | `let` / `const` / `var`, naming, reassignment                   |
| **Scope**         | Global, function, block; `globalThis`; TDZ; hoisting            |
| **Patterns**      | Rest / spread / destructuring, closures                         |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [Data types](#data-types) · [Memory: stack and heap](#memory-stack-heap) · [Numbers](#numbers) · [Date](#date)
- [Scope & closures](#scope-closures)
- [Interview](./3_js_interview.md)

Sibling Core topics: [Language](./3_js_core.md) · [Operators & Loops](./3_js_operators.md) · [Array](./3_js_array.md) · [Functions](./3_js_functions.md) · [Classes & Objects](./3_js_oop.md).


<a name="data-types"></a>
## Data types

<details>
  <summary>Stack and heap</summary>

<a name="memory-stack-heap"></a>

### Memory: stack and heap

**Definition:** A process gets an isolated **virtual** address space. Fast **stack** memory holds call frames (LIFO); the **heap** holds values whose size is unknown or must outlive a function. JS engines GC the heap; you do not `malloc`/`free`. Knowing this model makes DevTools (stack traces, heap snapshots) and interview questions about assignment / calls easier.

**How it works:**

- **Mental CPU model:** von Neumann — instructions and data share one store (one bus). Harvard splits them. Real chips are a hybrid (e.g. separate L1 I-cache / D-cache). Memory is numbered **cells**; the number is a fixed-width **address** (random access, not only sequential). Values larger than one cell span several. 64-bit width → 2⁶⁴ addresses (≈ 16 EiB of *address space*, not “you have 18 EB of RAM”).
- **Virtual vs physical:** the CPU maps virtual addresses to RAM. The OS hands the process **pages** (often 4–8 KB), many of them.
- **Process vs thread:** the OS isolates processes (no access to another process unless it allows it). A process may have several threads, each with its own stack. POSIX threads are one real API — hosts differ (browser tab vs Node). Scheduler, context switch, signals: [Processes, multitasking & interrupts](./0_system_design_core.md#processes-multitasking). Node layer: [Process & threads](./8_nodejs_process.md#process--threads).
- **Process image:** into that space go program **code**, **globals**, then **stack** and **heap**.
- **Stack:** grow/shrink by moving the **stack pointer** (CPU register) — cheap. You can **read** stack data; you **write** only at the top (push). You cannot free a hole in the middle; rewind the pointer to drop everything above it. Exhaustion → **stack overflow**. Teaching diagram: heap grows “up”, stack “down”, they meet in the free gap.
- **Stack frame:** one call’s args, locals, and “what to run after return”. A **frame pointer** marks the active frame. Nested calls: `logDogs` frame → `countDogs(20)` → pop → `countDogs(9)` → pop → pop `logDogs`.
- **Unwind:** `throw` pops frames until a `catch` (or the program dies). The **stack trace** is those frames in reverse call order.
- **Heap:** needed when size is not known at frame-build time (arrays that `.push`, objects, closures) or data must outlive the function. The stack slot stores a **fixed-size reference** (address); the payload lives on the heap. Modify the array via that address. GC later reclaims unreachable heap objects — [Garbage collection](./3_js_oop.md#garbage-collection). MDN: JS allocates on create and frees unused objects; unlike C there is no `malloc`/`free`.
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

**Sources:** [Doka — how memory works](https://doka.guide/js/how-the-memory-works/) · [MDN Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) · [javascript.info/garbage-collection](https://javascript.info/garbage-collection)

</details>

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

**Sources:** [javascript.info/types](https://javascript.info/types) · [javascript.info/map-set](https://javascript.info/map-set)

</details>

<details>
  <summary>Type conversions</summary>

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

**Sources:** [javascript.info/type-conversions](https://javascript.info/type-conversions) · [javascript.info/comparison](https://javascript.info/comparison)

</details>

<details>
  <summary>Numbers</summary>

<a name="numbers"></a>

### Numbers

**Definition:** Regular JS numbers are IEEE-754 **float64** doubles (safe integers ±`2^53−1`). `BigInt` covers larger integers. Write large/small literals with `_` separators, `e` notation, or `0x` / `0b` / `0o` prefixes.

**How it works:**

- Literals: `1_000_000_000`, `1e9`, `1e-6`, `0xff`, `0b11111111`, `0o377`.
- `num.toString(base)` — base `2`…`36` (hex colors, short IDs). Call on a literal with two dots: `255..toString(16)` or `(255).toString(16)`.
- Rounding: `Math.floor` / `ceil` / `round` / `trunc`; precision via multiply-divide or `toFixed(n)` (**returns a string**).
- Float gotcha: `0.1 + 0.2 !== 0.3` — compare with epsilon or round money (`toFixed` / integer cents).
- Checks: prefer `Number.isNaN` / `Number.isFinite` / `Number.isInteger` / `Number.isSafeInteger` over global `isNaN` / `isFinite` (those coerce).
- Parsing: `parseInt(str, radix)` / `parseFloat(str)` stop at first invalid char; `Number(str)` / `+str` require the whole string to be numeric (after trim).
- **`BigInt`:** suffix `n` or `BigInt(...)`. All ops stay BigInt (`5n / 2n === 2n`). **Cannot mix** with Number (`1n + 2` throws) — convert explicitly. `==` can coerce (`1 == 1n`), `===` does not. Unary `+bigint` is invalid.

**When to use:** Arithmetic, IDs, measurements. Money → round carefully or use integer minor units / `BigInt` / a decimal library. Never use `new Number()`.

#### Common pitfalls

```js
0.1 + 0.2;                 // 0.30000000000000004
(12.34).toFixed(1);        // "12.3" — string, not number
parseInt("100px", 10);     // 100
Number("100px");           // NaN
isNaN("hello");            // true — coerces
Number.isNaN("hello");     // false
123456..toString(36);      // "2n9c"
```

**Pluses and minuses:**

| + | − |
|------|------|
| One number type for most math | Binary float imprecision |
| Rich `Math.*` + radix convert | `toFixed` returns string |
| Safe integer helpers | Integers beyond `MAX_SAFE_INTEGER` lose precision |

**Examples:**

```js
Math.round(1.23456 * 100) / 100; // 1.23
+(1.005).toFixed(2);             // often 1 — float trap; prefer cents

Number.isFinite(Infinity);       // false
Number.isSafeInteger(2 ** 53);   // false
Number.MAX_SAFE_INTEGER;         // 9007199254740991

1n + 2n;           // 3n
// 1n + 2;         // TypeError — mix banned
Number(1n) + 2;    // 3
1 == 1n;           // true
1 === 1n;          // false
```

**Thoughts:** *Treat float equality as approximate; treat `parseInt` vs `Number` as “prefix vs whole-string.”*

**Sources:** [javascript.info/number](https://javascript.info/number) · [javascript.info/bigint](https://javascript.info/bigint) · [MDN Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) · [MDN Math](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)

</details>

<details>
  <summary>Strings and templates</summary>

### Strings & template literals

**Definition:** `string` is an immutable UTF-16 primitive. **Template literals** (backticks) support interpolation and multiline text.

**How it works:**

- Strings are immutable — methods return new strings.
- Template literals: `` `Hello ${name}` `` embed expressions; multiline without `\n`.
- Escape sequences: `\n`, `\t`, `\u{1F600}` (unicode).
- Common methods: `slice`, `includes`, `startsWith`, `trim`, `split`, `replace`, `replaceAll`.
- Strings are **iterable** (`for...of` / `Array.from`) and handle surrogate pairs correctly — index/`length` still count UTF-16 code units.
- Surrogate pairs (emoji, many CJK): `'😂'.length === 2`; use `codePointAt` / `fromCodePoint` / `for...of`, not `charAt` / `charCodeAt` alone.
- Visually identical strings may differ by mark order — `str.normalize()` (NFC) before compare/store.

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
[..."𝒳😂"];               // ['𝒳', '😂'] — for..of / spread use code points
"S\u0307\u0323".normalize() === "S\u0323\u0307".normalize(); // true
'𝒳'.codePointAt(0).toString(16); // '1d4b3' — full code point
```

**Sources:** [javascript.info/string](https://javascript.info/string) · [javascript.info/unicode](https://javascript.info/unicode) · [javascript.info/primitives-methods](https://javascript.info/primitives-methods)

</details>

<details>
  <summary>Symbol</summary>

### Symbol

**Definition:** `symbol` is a primitive for **unique identifiers** — every `Symbol()` is distinct even with the same description.

**How it works:**

- Created with `Symbol('description')` or `Symbol.for('globalKey')` (global registry).
- `Symbol.keyFor(sym)` returns the registry key for **global** symbols only (`undefined` for local ones); use `sym.description` for any symbol’s label.
- Used as object keys that won't collide with string keys or other libraries.
- Symbol keys are **omitted** from `Object.keys`, `JSON.stringify`, and `for...in`.
- Use `Object.getOwnPropertySymbols(obj)` or `Reflect.ownKeys` to list them.
- `Object.assign` **does** copy symbol properties (unlike `for...in` / `Object.keys`).
- Well-known symbols: `Symbol.iterator`, `Symbol.toPrimitive`, `Symbol.toStringTag`, `Symbol.hasInstance`.

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
Symbol.keyFor(Symbol.for("app"));     // "app"
Symbol.keyFor(Symbol("app"));         // undefined — not global

Object.assign({}, user)[id];          // 42 — symbols are copied
```

**Sources:** [javascript.info/symbol](https://javascript.info/symbol)

</details>

<details>
  <summary>Objects and Object utilities</summary>

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

**Sources:** [javascript.info/object](https://javascript.info/object) · [javascript.info/keys-values-entries](https://javascript.info/keys-values-entries)

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

**Sources:** [javascript.info/map-set](https://javascript.info/map-set) · [javascript.info/weakmap-weakset](https://javascript.info/weakmap-weakset) · [MDN Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

</details>

<details>
  <summary>Date</summary>

<a name="date"></a>

### Date

**Definition:** `Date` stores a single timestamp — milliseconds since **1 Jan 1970 UTC** (Unix epoch). Local getters/setters use the runtime timezone; `getUTC*` / `setUTC*` use UTC.

**How it works:**

- Create: `new Date()` (now), `new Date(ms)`, `new Date(dateString)` (same algorithm as `Date.parse`), `new Date(y, monthIndex, …)` — **month is 0–11**.
- Read: `getFullYear`, `getMonth` (0–11), `getDate` (day of month 1–31), `getDay` (weekday 0=Sun…6=Sat), `getHours`…, `getTime()`, `getTimezoneOffset()`.
- Write: `setFullYear` / `setMonth` / `setDate` / `setHours`… / `setTime(ms)` — out-of-range values **autocorrect** (e.g. Jan 32 → Feb 1).
- Diff: `date1 - date2` or `getTime()` difference → milliseconds. `Date.now()` is current timestamp without allocating a `Date`.
- Prefer `getFullYear()` — never use deprecated `getYear()`.

**When to use:** Timestamps, elapsed time, simple calendar math via autocorrection. Display → `Intl.DateTimeFormat` ([Intl](./3_js_extra.md#intl)). Complex calendars / time zones → consider Temporal (when available) or a dedicated library.

#### Common pitfalls

```js
new Date(2011, 0, 1);     // 1 Jan 2011 local — month 0 = January
new Date("2017-01-26");   // date-only → UTC midnight, then shown in local TZ
date.getDate();           // day of month — not getDay (weekday)
date.setDate(0);          // last day of previous month
```

**Pluses and minuses:**

| + | − |
|------|------|
| Built-in, ms precision | Month 0-based; date-string parsing quirks |
| Autocorrection for offsets | Mutable; mutating shared dates is a bug source |
| Easy elapsed-time diffs | No first-class TZ arithmetic |

**Examples:**

```js
const start = Date.now();
// …work…
const elapsedMs = Date.now() - start;

const d = new Date(2016, 1, 28);
d.setDate(d.getDate() + 2); // 1 Mar 2016 (leap year)

Date.parse("2017-01-26");   // ms or NaN
```

**Thoughts:** *Epoch ms is the portable value; `Date` is a view with local/UTC accessors — month index and mutable APIs are the interview traps.*

**Sources:** [javascript.info/date](https://javascript.info/date) · [MDN Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) · [MDN Date.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)

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

<a name="scope-closures"></a>
## Scope & closures

<details>
  <summary>globalThis</summary>

### globalThis

**Definition:** Standard way to access the global object in any environment (browser `window`, Node `global`, workers `self`).

**How it works:**

- `globalThis` is the same object across realms in a given JS environment.
- In browsers the global is also `window`; in Node `global`. Prefer `globalThis` for portable code.
- `var` globals and function declarations in classic scripts become properties of the global object; `let`/`const` do **not**.
- In strict mode / modules, bare `this` at top level is `undefined` — use `globalThis` when you truly need global.
- Prefer module scope or explicit exports over polluting global; attach only true polyfills (`if (!globalThis.Promise) ...`).

**When to use:** Library UMD bundles, test setup, rare polyfills. Avoid attaching app state to `globalThis`.

**Pluses and minuses:**

| + | − |
|------|------|
| Cross-environment API | Global pollution anti-pattern |
| Polyfill-friendly | |

**Examples:**

```js
globalThis.setTimeout(fn, 0); // works in browser and Node

// classic script only — modules don't put let on global:
// var gVar = 5; → window.gVar === 5
// let gLet = 5; → window.gLet === undefined
```

**Sources:** [MDN globalThis](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) · [javascript.info/global-object](https://javascript.info/global-object)

</details>

<details>
  <summary>Variables, scope, and hoisting</summary>

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

**Naming:**

- Prefer camelCase (`userName`, `shoppingCart`); letters, digits, `$`, `_` only; not starting with a digit.
- Declare a binding **once** — re-`let` / re-`const` the same name in one scope is a `SyntaxError`.
- **Uppercase `CONST_NAME`:** only for hard-coded aliases known before run (`COLOR_RED = "#F00"`). Runtime-calculated constants stay camelCase (`const age = someCode(birthday)`).

```js
const COLOR_ORANGE = "#FF7F00"; // hard-coded → UPPER_SNAKE
const pageLoadTime = performance.now(); // computed once → camelCase
```

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

**Sources:** [javascript.info/variables](https://javascript.info/variables) · [javascript.info/let-const](https://javascript.info/let-const) · [javascript.info/closure](https://javascript.info/closure)

</details>

<details>
  <summary>Rest, spread, and destructuring</summary>

### Rest, spread & destructuring

**Definition:** **Destructuring** unpacks arrays/objects into variables. **Rest** (`...rest`) collects remaining items into a new array/object. **Spread** (`...iterable`) expands iterables into elements or object properties.

**How it works:**

- Array destructuring matches by position; object destructuring by property name.
- Rest must be last in a pattern; creates a **shallow** copy of remaining properties.
- Spread in literals creates shallow copies — nested objects are still shared references.
- Function rest parameters replace `arguments` object in modern code.
- **Smart parameters:** `function show({ title = "Menu", width = 100 } = {})` — destructure an options object; default `= {}` so a bare call works.
- Assignment without `let`/`const`: wrap in parens — `({ title, width } = options)` — otherwise `{` is parsed as a block.

**When to use:**

| Feature | Use when |
|---------|----------|
| Array destructuring | Swap values, parse tuple returns |
| Object destructuring | Props, API responses, options objects |
| Rest in destructuring | Omit fields (`const { password, ...safe } = user`) |
| Spread merge | Immutable object/array updates |
| Rest parameters | Variadic functions (`sum(...nums)`) |
| Options object param | Many optional args with defaults |

#### Common pitfalls

```js
// Pitfall: nested destructuring — undefined parent throws
const { address: { city } } = {}; // TypeError

// Pitfall: bare `{...} =` looks like a block
let title, width;
({ title, width } = { title: "Menu", width: 200 }); // needs parens

// Pitfall: spread is shallow
const inner = { x: 1 };
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

let a = 1, b = 2;
[a, b] = [b, a]; // swap

// Object — rename + default
const { years: age, isAdmin = false } = { name: "John", years: 30 };

// Function rest + options object
function showMenu({ title = "Untitled", width = 200, height = 100 } = {}) {
  return `${title} ${width}x${height}`;
}
showMenu(); // Untitled 200x100
showMenu({ title: "File" });

function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}

// Spread — shallow copy / merge
const merged = { ...defaults, ...userOverrides };
const copy = [...arr, newItem];
```

**Sources:** [javascript.info/destructuring-assignment](https://javascript.info/destructuring-assignment) · [javascript.info/rest-parameters-spread](https://javascript.info/rest-parameters-spread)

</details>

<details>
  <summary>Closures</summary>

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

**Sources:** [javascript.info/closure](https://javascript.info/closure) · [javascript.info/garbage-collection](https://javascript.info/garbage-collection)

</details>
