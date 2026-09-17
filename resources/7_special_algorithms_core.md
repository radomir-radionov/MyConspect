# Algorithms — Big O

Algorithm basics and complexity analysis.

[← Back to hub](./7_special_algorithms.md)

### Related docs

* [Algorithms — Big O](./7_special_algorithms_core.md) · [Algorithms — Common](./7_special_algorithms_common.md) · [Algorithms — Patterns](./7_special_algorithms_patterns.md) · [Algorithms — Data structures](./7_special_algorithms_data.md) · [Paradigms](./7_special_paradigms.md) · [Engineering](./7_special_engineering.md)

### Sections

- [Algorithms & Big O](#algorithms--big-o)

---

## 5. Algorithms & Big O

<details>
  <summary>Algorithm</summary>

### Algorithm

**Definition:** An algorithm is a finite sequence of well-defined steps to solve a problem or perform a task. A **good algorithm** pairs with the right **data structure** — e.g. binary search requires sorted data; hash tables enable O(1) average lookup.

**When to use:** Whenever input size can grow — always consider time and space complexity.

**Pluses and minuses:**

| + (formal algorithms) | − |
|--------------------------|------|
| Predictable performance | Over-engineering simple problems |
| Interview and system design currency | Wrong algorithm for data shape wastes effort |

**Thoughts:** Instruction = one step; procedure = composed instructions. Know the difference between algorithm and implementation.

**Sources:**

[javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)

---

</details>

<details>
  <summary>Big O notation</summary>

### Big O notation

**Definition:**

Big O describes how **time** or **space** grows relative to input size `n` — worst-case upper bound for asymptotic comparison. Not wall-clock time; ignores constants.

| Notation | Name | Example |
|----------|------|---------|
| O(1) | Constant | Array index access, Map.get |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Single pass, linear search |
| O(n log n) | Linearithmic | Merge sort, quick sort (avg) |
| O(n²) | Quadratic | Nested loops, bubble sort |
| O(2ⁿ) | Exponential | Naive recursive Fibonacci |
| O(n!) | Factorial | Brute-force permutations |

**When to use:** Choosing sort/search strategy; reviewing PRs with nested loops on large collections; system design capacity estimates.

**Pluses and minuses:**

| + | − |
|------|------|
| Compare algorithms independent of hardware | Hides constants — O(n) with huge constant may beat O(log n) on small n |
| Standard interview language | Worst-case may not match real data |

**Examples:**

```js
// O(n) — one pass
function sum(arr) {
  let total = 0;
  for (const x of arr) total += x;
  return total;
}

// O(n²) — nested loops
function pairs(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      result.push([arr[i], arr[j]]);
  return result;
}
```

**Thoughts:** Also know **best** and **average** case. Quick sort: avg O(n log n), worst O(n²). Space complexity matters for recursion depth and auxiliary arrays.

**Sources:**

[ByteByteGo Big O](https://blog.bytebytego.com/p/ep132-big-o-notation-101-the-secret)

---

</details>

<details>
  <summary>Time vs space complexity</summary>

### Time vs space complexity

**Definition:**

**Time** = operations vs `n`. **Space** = extra memory vs `n` (excluding input).

| Trade-off | Example |
|-----------|---------|
| More space for less time | Hash table for O(1) lookup |
| Less space for more time | In-place sorting |

**Thoughts:**

Memoization trades space for time. Tail recursion may be optimized in some languages — not guaranteed in JS.

---

</details>
