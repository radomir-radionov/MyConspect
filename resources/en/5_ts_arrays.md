# TypeScript — Arrays

Typed arrays: `number[]` and `Array<T>`.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

### Sections

- [Arrays](#arrays)

---

## Arrays

<details>
  <summary>Arrays</summary>

### Arrays

**Definition:**

An ordered list where every element has the same type — `number[]` or `Array<number>`.

| When to use | Notes |
|-------------|-------|
| Declare `const ids: number[] = [1, 2, 3]`. Use with `map`, `filter`, `push`, etc. For mixed fixed positions, use a **tuple** instead. | `[number]` is **not** an array of numbers — that's a **tuple** (fixed-length array with specific positions). `number[]` is what you want for a normal array. |

**Examples:**

```typescript
const scores: number[] = [95, 87, 72];
const tags: Array<string> = ["typescript", "javascript"];

// Both are equivalent:
type A = string[];
type B = Array<string>;
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>


