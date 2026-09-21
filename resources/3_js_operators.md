# JS Core — Operators & Loops

Expressions, operators, comparisons, optional chaining, and control flow (`if` / loops / `switch` / `try`/`catch`). Language runtime and data types / variables live in sibling Core topics.

[← Back to JS hub](./3_js.md)

### Related docs

- [JS Language](./3_js_core.md) · [JS Data Types & Variables](./3_js_variables.md) · [JS Arrays](./3_js_array.md) · [JS Functions](./3_js_functions.md) · [JS OOP](./3_js_oop.md) · [JS Document](./3_js_browser.md) · [JS Events](./3_js_events.md) · [JS Async](./3_js_async.md) · [JS Interview](./3_js_interview.md)
- [Computer science](./7_special_cs.md)

### Main concepts

| Area              | Topics                                                          |
| ----------------- | --------------------------------------------------------------- |
| **Expressions**   | Statement vs expression, expression kinds                       |
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
  <summary>Comparisons</summary>

### Comparison operators

**Definition:** Comparison operators return booleans (or drive `sort` comparators). `===` avoids coercion; `==` coerces first.

**How it works:**

- `===` / `!==` — no type conversion; different types are always unequal.
- `==` / `!=` — apply abstract equality rules (surprising with `''`, `0`, `false`).
- Relational `>`, `<`, `>=`, `<=` — usually convert to numbers; strings compare lexicographically when both are strings.
- `Object.is` for edge cases (`NaN`, signed zero) — see [Object.is & equality](#object-is-and-equality).

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

**Sources:** [javascript.info/logical-operators](https://learn.javascript.ru/logical-operators) · [nullish-coalescing](https://learn.javascript.ru/nullish-coalescing-operator)

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

**Sources:** [javascript.info/bitwise-operators](https://learn.javascript.ru/bitwise-operators)

</details>

<details>
  <summary>Optional chaining and nullish</summary>

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

**Sources:** [javascript.info/ifelse](https://learn.javascript.ru/ifelse)

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
- `switch` — strict match; fall-through without `break`.

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

**Sources:** [javascript.info/array#loops](https://learn.javascript.ru/array#loops)

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

**Sources:** [javascript.info/iterable](https://learn.javascript.ru/iterable) · [generators](https://learn.javascript.ru/generators) · [array](https://learn.javascript.ru/array) · [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)

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
