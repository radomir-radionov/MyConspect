# JS Core — Array

Ordered collections, array methods, and interview patterns around `map` / `filter` / `reduce`.

[← Back to JS hub](./3_js.md)

### Related docs

- [JS Language](./3_js_core.md) · [JS Functions](./3_js_functions.md) · [JS OOP](./3_js_oop.md) · [JS Async](./3_js_async.md) · [JS Document](./3_js_browser.md)
- [TypeScript cart task](./5_ts_interview.md#interview-practice)

### Main concepts

| Area | Topics |
| ---- | ------ |
| **Shape** | Indices, `length`, sparse holes, `Array.isArray` |
| **Copy** | Spread, `slice`, `Array.from`, shallow vs deep |
| **API** | Mutating vs non-mutating, search, sort, flat |
| **HOF** | `map`, `filter`, `reduce`, `forEach` |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [Arrays & array methods](#arrays-and-array-methods)
- [Interview Practice](#interview-practice)

<details>
  <summary>Array methods</summary>

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

<a name="interview-practice"></a>

<details>
  <summary>Interview Practice</summary>

### Interview Practice

**Definition:** Q&A and coding tasks for arrays, `map`/`filter`/`reduce`, and cart aggregation.

Questions from [0_interview.md](0_interview.md). Try answering before opening solutions.

### Question index

| Topic | Answer |
| ----- | ------ |
| `map` / `forEach` / `reduce` | Q&A below |
| Accumulator, discounts | Q&A below |
| Flatten, polyfill `map`, unique | Tasks 7, 8, 11 |
| Cart aggregation | Task 16 |

## Questions & Answers

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

**See also:** [Transformation & search](#transformation-and-search) (full theory)

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


### Tasks

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
- Typed version → [5_ts.md — Cart task](./5_ts_interview.md#interview-practice).

</details>


<details>
  <summary>Practice tasks</summary>

### Practice tasks

**Definition:**

Recursive implementations of standard library patterns.

44. Implement `reduce` using recursion.

</details>


</details>
