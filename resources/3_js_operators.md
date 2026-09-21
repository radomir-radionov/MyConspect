# JS Core — Operators & Loops

Expressions, operators, comparisons, optional chaining, and control flow (`if` / loops / `switch` / `try`/`catch`). Language runtime and data types / variables live in sibling Core topics.

[← Back to JS hub](./3_js.md)

### Related docs

- [JS Language](./3_js_core.md) · [JS Data Types & Variables](./3_js_variables.md) · [JS Arrays](./3_js_array.md) · [JS Functions](./3_js_functions.md) · [JS OOP](./3_js_oop.md) · [JS Document](./3_js_browser.md) · [JS Events](./3_js_events.md) · [JS Async](./3_js_async.md) · [JS Interview](./3_js_interview.md)
- [Computer science](./7_special_cs.md)

### Main concepts

| Area              | Topics                                                          |
| ----------------- | --------------------------------------------------------------- |
| **Expressions**   | Statement vs expression, ASI, expression kinds                       |
| **Operators**     | Arithmetic, comparison, `Object.is`, logical, bitwise, `?.` / `??` |
| **Control flow**  | `if` / ternary, loops, `for...in` vs `for...of`, `switch`, `try`/`catch`/`finally` |
| **Iterators**     | Iterables, generators                                           |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [Expressions](#expressions)
- [Operators](#operators)
- [Control flow](#control-flow)
- [Iterators](#iterators)
- [Interview](./3_js_interview.md)

Sibling Core topics: [Language](./3_js_core.md) · [Data Types & Variables](./3_js_variables.md) · [Array](./3_js_array.md) · [Functions](./3_js_functions.md) · [Classes & Objects](./3_js_oop.md).


<a name="expressions"></a>
## Expressions

<details>
  <summary>Statement vs expression</summary>

### Statement vs expression

**Definition:**

A **statement** performs an action (assign, loop, declare). An **expression** evaluates to a value (`42`, `a + b`, `fn()`).

| | Statement | Expression |
|---|-----------|------------|
| Returns value | No | Yes |
| Examples | `if`, `for`, `const x = 1` | `1 + 2`, ternary, arrow fn body without braces |

**When to use:** Prefer expressions in functional pipelines; statements for control flow and side effects at boundaries.

**Examples:**

```js
const doubled = items.map(x => x * 2); // expression-bodied callback
if (items.length === 0) return [];     // statement
```

**Thoughts:**

`const x = (y = 1)` — assignment inside expression is valid but hurts readability.

---

</details>

<details>
  <summary>ASI (automatic semicolon insertion)</summary>

### ASI (automatic semicolon insertion)

**Definition:** When a line break separates statements, the engine often inserts an implicit `;`. It does **not** always do so — some line starts continue the previous expression.

**How it works:**

- Most newlines act like a statement end: `alert('Hello')\nalert('World')` is fine.
- A newline after an incomplete expression does **not** insert `;` (e.g. ending with `+`).
- A newline before `[...]` does **not** insert `;` — the next line can be parsed as property access on the previous expression.
- Same class of footgun: bare `return` then a newline returns `undefined` (ASI inserts `;` after `return`).

**When to use:** Put an explicit `;` after every statement (community default). Extra `;` after blocks/`for` is harmless; missing ones before `[`, `(`, `` ` ``, `/` are the dangerous cases.

**Examples:**

```js
alert("Hello");
[1, 2].forEach(alert); // Hello, then 1, then 2

alert("Hello")
[1, 2].forEach(alert); // treated as alert("Hello")[1, 2].forEach(alert) — broken
```

**Thoughts:** ASI is why style guides prefer semicolons — the bugs are rare but hard to spot.

**Sources:** [javascript.info/structure](https://javascript.info/structure) · [MDN ASI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#automatic_semicolon_insertion)

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

<a name="operators"></a>
## Operators

<details>
  <summary>Operators</summary>

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
  <summary>Math operators</summary>

### Math operators

**Definition:** Arithmetic and unary operators on numbers; `+` also concatenates strings when either operand is a string.

**How it works:**

- `+` with string → string concat; otherwise numeric add (with coercion).
- `-`, `*`, `/`, `%`, `**` convert operands to numbers.
- Unary `+x` coerces to number; unary `-x` negates.
- `++`/`--` prefix returns new value; postfix returns old value then updates.
- `%` is remainder, not mathematical modulo for negatives.
- Assignment `=` is an operator: it writes then **returns** the assigned value — so `a = b = c = 2` chains right-to-left. Prefer separate lines for readability.
- Comma `,` evaluates left-to-right and returns the **last** value (`(1 + 2, 3 + 4)` → `7`). Rare outside `for` init; know it when reading library code.

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

let a, b, c;
a = b = c = 2 + 2; // all 4
let x = (1 + 2, 3 + 4); // 7 — comma returns last
```

**Sources:** [javascript.info/operators](https://javascript.info/operators)

</details>

<details>
  <summary>Comparisons</summary>

### Comparison operators

**Definition:** Comparison operators return booleans (or drive `sort` comparators). `===` avoids coercion; `==` coerces first.

**How it works:**

- `===` / `!==` — no type conversion; different types are always unequal.
- `==` / `!=` — apply abstract equality rules (surprising with `''`, `0`, `false`).
- Relational `>`, `<`, `>=`, `<=` — usually convert to numbers; strings compare lexicographically when both are strings.
- `Object.is` for edge cases (`NaN`, signed zero) — see [Object.is & equality](#object-is-and-equality).
- **`null` / `undefined` quirks:** `null == undefined` is `true`, but neither equals any other value with `==`. Relational ops convert `null` → `0` and `undefined` → `NaN`, so `null >= 0` is `true` while `null > 0` and `null == 0` are both `false`.

**When to use:** Default `===`; `value == null` for null/undefined; numeric sort comparators return negative/zero/positive. Do **not** use `>`, `<`, `>=`, `<=` on a value that may be `null`/`undefined` — check those separately.

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

null > 0;   // false
null == 0;  // false — == has a special null/undefined rule
null >= 0;  // true  — >= converts null → 0
undefined > 0;  // false (NaN)
undefined == 0; // false
```

**Sources:** [javascript.info/comparison](https://javascript.info/comparison)

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
  <summary>Logical operators</summary>

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

**Sources:** [javascript.info/logical-operators](https://javascript.info/logical-operators) · [javascript.info/nullish-coalescing-operator](https://javascript.info/nullish-coalescing-operator)

</details>

<details>
  <summary>Bitwise operators</summary>

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

**Sources:** [javascript.info/bitwise-operators](https://javascript.info/bitwise-operators)

</details>

<details>
  <summary>Optional chaining and nullish</summary>

### Optional chaining (`?.`) & nullish coalescing (`??`)

**Definition:** `?.` short-circuits on `null`/`undefined` instead of throwing. `??` returns the right side only when the left is `null` or `undefined`.

**How it works:**

- `obj?.prop`, `obj?.[expr]`, `fn?.()` — stops at first nullish step.
- `??` differs from `||`: `0 ?? 1` is `0`; `0 || 1` is `1`.
- Combine with care: `a ?? b || c` needs parentheses per language rules.
- Short-circuits: `user?.sayHi(x++)` does **not** evaluate `x++` if `user` is nullish.
- Variable before `?.` must be **declared** — undeclared `user?.x` is still a `ReferenceError`.
- **Read/delete only** — `user?.name = "John"` is invalid (assigns to `undefined`).
- Don’t overuse: if `user` must exist, write `user.address?.street` so a missing `user` still throws.

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
userAdmin.admin?.(); // call only if method exists
user?.[key];

0 || "default";  // 'default'
0 ?? "default";  // 0

const port = config.port ?? 3000;
```

**Sources:** [javascript.info/optional-chaining](https://javascript.info/optional-chaining) · [javascript.info/nullish-coalescing-operator](https://javascript.info/nullish-coalescing-operator)

</details>

<a name="control-flow"></a>
## Control flow

<details>
  <summary>if, else, and ternary</summary>

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

**Sources:** [javascript.info/ifelse](https://javascript.info/ifelse)

</details>

<details>
  <summary>Loops and switch</summary>

### Loops, break, continue & switch

**Definition:** Loops repeat code; `break` exits a loop/switch; `continue` skips to next iteration. `switch` matches `case` with `===`.

**How it works:**

- `while` — test before body; may run zero times.
- `do...while` — body at least once.
- `for (init; cond; step)` — classic counter; use `let` for per-iteration binding.
- `for...of` — iterates **values** of iterables.
- `for...in` — iterates **keys** (including inherited); filter with `Object.hasOwn`.
- `switch` — **always `===`**; fall-through without `break`.
- Labels: `outer: for (...) { ... break outer; }` exits the labeled loop (needed for nested loops). `continue outer` jumps to the next iteration of that loop.

| Construct | Use |
| --------- | --- |
| `while` | Unknown iterations, condition-first |
| `do...while` | At least one run |
| `for` | Index counters |
| `for...of` | Arrays, strings, Map, Set |
| `for...in` | Object keys (with `hasOwn`) |
| `switch` | Many discrete equal values |

**When to use:** Arrays → `for...of` or `map`; objects → `Object.entries` + `for...of`; enums → `switch`; custom/`function*` sequences → [Iterators](#iterators); async loops → see [3_js_async.md](./3_js_async.md).

**Pluses and minuses:**

| + | − |
|------|------|
| `for...of` clean on iterables | `for...in` on arrays is buggy |
| `switch` readable for enums | Fall-through footguns; `===` vs `prompt` strings |
| `break`/`continue` control flow | Labels rarely needed |

**Examples:**

```js
for (let i = 0; i < 3; i++) console.log(i);

for (const v of ["a", "b"]) console.log(v);

for (const key in obj) {
  if (!Object.hasOwn(obj, key)) continue;
  console.log(key, obj[key]);
}

outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (!input) break outer; // leave both loops
  }
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

**Sources:** [javascript.info/while-for](https://javascript.info/while-for) · [javascript.info/switch](https://javascript.info/switch)

</details>

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

**Sources:** [javascript.info/array#loops](https://javascript.info/array#loops)

</details>


<details>
  <summary>Error handling</summary>

### Error handling

**Definition:** Use `try/catch/finally` for synchronous errors; subclass `Error` for domain errors; wrap low-level failures into higher-level types at API boundaries.

**How it works:**

- `try` runs code; `catch` receives thrown value (any type, usually `Error`).
- `finally` runs always — cleanup, close resources.
- Uncaught errors propagate up the call stack until caught or crash.
- `throw new Error('msg')` — prefer `Error` objects over strings.
- **Custom hierarchy:** `class ValidationError extends Error` then `PropertyRequiredError extends ValidationError` — check with `instanceof` (works for subclasses).
- Set `this.name = this.constructor.name` (or a shared `MyError` base) so `err.name` matches the class.
- **Wrapping:** catch `SyntaxError` / `ValidationError` inside `readUser`, throw `ReadError` with `cause` — callers handle one type.
- Rethrow unknown errors in `catch` — do not swallow programming bugs.
- `try/catch` does **not** catch async errors scheduled later (`setTimeout` throw) — use promise `.catch` / `async` `try`.

**When to use:** JSON parse, user input validation, API boundary wrappers. Log + re-throw at top level; handle expected errors locally.

**Pluses and minuses:**

| + | − |
|------|------|
| Local recovery without crashing | Easy to swallow errors silently |
| `finally` guarantees cleanup | try/catch has minor perf cost in hot paths |
| Hierarchy + `instanceof` scales | Must remember `super(message)` in subclasses |

**Examples:**

```js
try {
  JSON.parse("{ invalid");
} catch (err) {
  console.error(err.message);
} finally {
  // cleanup always runs
}

class MyError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ValidationError extends MyError {}
class PropertyRequiredError extends ValidationError {
  constructor(property) {
    super("No property: " + property);
    this.property = property;
  }
}

class ReadError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "ReadError";
  }
}
```

**Sources:** [javascript.info/try-catch](https://javascript.info/try-catch) · [javascript.info/custom-errors](https://javascript.info/custom-errors)

</details>


<a name="iterators"></a>
## Iterators

<details>
  <summary>Iterators and generators</summary>

### Iterators & generators

**Definition:** The **iterable protocol** lets objects work with `for...of`, spread, and destructuring. An **iterator** exposes `.next()` → `{ value, done }`. **Generators** (`function*`) are syntactic sugar for iterators.

**How it works:**

- Iterable: object with `[Symbol.iterator]()` returning an iterator.
- Iterator: object with `next()` returning `{ value, done }`.
- `for...of` calls `Symbol.iterator` then loops `.next()` until `done: true`.
- Generator: `function*` auto-implements iterator; `yield` emits values; `yield* otherGen` delegates (composition).
- `generator.throw(err)` / `.return(value)` inject error or finish early; `yield` is two-way — `next(arg)` becomes the result of the paused `yield`.
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

**Sources:** [javascript.info/iterable](https://javascript.info/iterable) · [javascript.info/generators](https://javascript.info/generators) · [javascript.info/array](https://javascript.info/array) · [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)

</details>

<details>
  <summary>switch — extended notes</summary>

### switch — fall-through & types

**Definition:** Without `break`, execution falls through to the next `case`. Use `break` unless fall-through is intentional. Matching is always **strict** (`===`) — types must match.

**How it works:**

- Grouping cases (`case 2: case 3: ...`) shares one body via intentional fall-through.
- `prompt` / form values are **strings**. `case 3:` never matches `"3"` from `prompt` — use `case '3':` or coerce (`+prompt(...)`) first.

**Examples:**

```js
switch (x) {
  case 1:
    console.log("one");
    break;
  case 2:
  case 3:
    console.log("two or three"); // grouped
    break;
  default:
    console.log("other");
}

const arg = prompt("Enter a value?"); // string | null
switch (arg) {
  case "0":
  case "1":
    console.log("one or zero");
    break;
  case 3:
    console.log("never runs for prompt — types differ");
    break;
  default:
    console.log("unknown");
}
```

**Sources:** [javascript.info/switch](https://javascript.info/switch)

</details>
