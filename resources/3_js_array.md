# JS Core — Array

Ordered collections, array methods, and interview patterns around `map` / `filter` / `reduce`.

[← Back to JS hub](./3_js.md)

### Related docs

- [JS Language](./3_js_core.md) · [JS Functions](./3_js_functions.md) · [JS OOP](./3_js_oop.md) · [JS Async](./3_js_async.md) · [JS Document](./3_js_browser.md)
- [JS Interview](./3_js_interview.md) · [TypeScript cart task](./5_ts_interview.md#interview-practice)

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
- [Transformation & search](#transformation-and-search)
- [Interview](./3_js_interview.md)

<a name="arrays-and-array-methods"></a>

## Arrays & array methods

<details>
  <summary>Arrays & array methods</summary>

### Arrays & array methods

**Definition:** An `Array` is an object for an ordered list of values at nonnegative integer indices, plus a `length` that is one greater than the highest index. It is not an associative map — string keys are ordinary properties, not elements.

**How it works:**

- Zero-based: last index is `length - 1`. `arr[2]` and `arr["2"]` hit the same element; `arr["02"]` is a different property.
- `length` grows when you assign past the end (`arr[5] = x`) and shrinks by **deleting** elements when you lower it.
- Holes (`arr[1] = empty`) are not the same as `undefined`. Older methods (`forEach`, `map`, `filter`) skip holes; newer ones (`keys`, `find`, `includes`) treat holes like `undefined`.
- Copies are **shallow**: `[...arr]`, `slice`, `concat`, `map` copy object references, not nested objects.
- `typeof [] === "object"` — use `Array.isArray(value)` (or `Object.prototype.toString.call(value) === "[object Array]"`).

| Mutating | Non-mutating alternative |
| -------- | ------------------------ |
| `push` / `pop` / `shift` / `unshift` | `concat`, `slice`, `toSpliced` |
| `splice`, `sort`, `reverse` | `toSpliced`, `toSorted`, `toReversed` |
| `fill`, `copyWithin` | build a new array with `map` / `slice` |

**When to use:** Sequences where order and index access matter. Use `Set` for uniqueness-only, `Map` for non-string keys. Prefer non-mutating methods in React state and shared data.

**Common pitfalls:**

```js
Array.isArray([]);                 // true
Array.isArray({ length: 2 });      // false — array-like is not an Array

const sparse = ["a"];
sparse[2] = "c";
sparse.length;                     // 3
sparse.map((x) => x);              // ['a', empty, 'c'] — hole preserved

fruits.length = 10;                // extends with holes, not undefined elements
fruits.length = 2;                 // deletes indexes >= 2
```

**Pluses and minuses:**

| + | − |
| --- | --- |
| Rich built-in API, iterable, JSON-friendly | Sparse arrays and `sort` mutation surprise people |
| Literal syntax and rest/spread | Not a real tuple — mixed types and holes are allowed |
| Generic methods work on array-likes (`Array.from`, `.call`) | Shallow copy is easy to mistake for deep clone |

**Examples:**

```js
const arr = ["banana", "apple", "peach"];
arr.push("kiwi");                  // mutates; length 4
const copy = arr.slice();          // shallow copy
const next = [...arr, "mango"];    // new array

Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]
Array.from("hi");                  // ['h', 'i']
```

**Thoughts:** Interviewers want `Array.isArray`, mutating vs copying, and that `length` is live — not “arrays are a special primitive.”

**Sources:** [MDN Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) · [javascript.info/array](https://javascript.info/array)

</details>

<a name="transformation-and-search"></a>

## Transformation & search

<details>
  <summary>Transformation & search</summary>

### Transformation & search

**Definition:** Iterative methods take `(element, index, array)` and either build a new array, fold to one value, or search. `map` / `filter` / `flatMap` copy; `forEach` returns `undefined`; `reduce` returns whatever you accumulate.

**How it works:**

- `map(fn)` — new array, **same length**; skipped holes stay holes. Do not use `map` only for side effects.
- `filter(fn)` — new array of truthy callback results; holes are skipped (not kept as `undefined`).
- `reduce(fn, init)` — fold. Always pass `init` if the array may be empty (`TypeError` otherwise).
- `forEach(fn)` — visit assigned indexes; cannot `break` (use `for...of` / `some`).
- Search: `find` / `findIndex` / `includes` / `indexOf`. `includes` uses SameValueZero (`NaN` matches); `indexOf` uses `===` (`NaN` misses).
- `["1","2","3"].map(parseInt)` is `[1, NaN, NaN]` — `map` passes `(element, index)` and `parseInt` treats index as radix.

| Method | Returns | Mutates? |
| ------ | ------- | -------- |
| `map` | new array, same length | no |
| `filter` | new array, maybe shorter | no |
| `reduce` | accumulator (any type) | no |
| `forEach` | `undefined` | no (callback might) |
| `find` / `findIndex` | element / index or `-1` | no |
| `sort` | the **same** array | **yes** — use `toSorted` |

**When to use:** `map` to transform; `filter` to drop; `reduce` to aggregate or group; `forEach` / `for...of` for effects. Chain `filter` then `map` rather than stuffing both into one `reduce` unless you are building a non-array.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Declarative, chainable, interview-standard | `reduce` is easy to overuse into unreadable folds |
| Copying methods keep originals intact | Sparse + `map` keeps holes; `map(parseInt)` radix trap |
| `toSorted` / `toSpliced` avoid mutation | `sort` without compare is lexicographic (`[10, 2]` → `[10, 2]`) |

**Examples:**

```js
[1, 2, 3].map((n) => n * 2);                 // [2, 4, 6]
[1, 2, 3].filter((n) => n > 1);              // [2, 3]
[1, 2, 3].reduce((sum, n) => sum + n, 0);    // 6
[1, 2, 3].forEach((n) => console.log(n));    // undefined

["1", "2", "3"].map(Number);                 // [1, 2, 3]
["1", "2", "3"].map((s) => parseInt(s, 10)); // [1, 2, 3]

[10, 2, 1].toSorted((a, b) => a - b);        // [1, 2, 10]
```

**Thoughts:** *`map` transforms, `filter` selects, `reduce` aggregates, `forEach` only does work.* If you need one object or number from a list, `reduce`; if you still want a list, stay on `map`/`filter`.

**Sources:** [MDN Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) · [MDN iterative methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods) · [javascript.info/array-methods](https://javascript.info/array-methods)

</details>
