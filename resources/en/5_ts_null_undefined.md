# TypeScript — null & undefined

Absence types and `strictNullChecks` behavior.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

### Sections

- [null and undefined](#null-and-undefined)

---

## null and undefined

<details>
  <summary>null and undefined</summary>

### `null` and `undefined`

**Definition:**

Types for JavaScript's absence-of-value: `null` (intentional empty) and `undefined` (unset).

| When to use | Notes |
|-------------|-------|
| With `strictNullChecks`, they are not assignable to other types unless declared. Narrow with `=== null`, `??`, or optional chaining. | Behavior depends entirely on `strictNullChecks`. **Off:** `null`/`undefined` flow everywhere silently — like Java without null safety. **On:** you must narrow before using a possibly-null value. The ` |

**Examples:**

```typescript
function doSomething(x: string | null) {
  if (x === null) {
    return;
  }
  console.log(x.toUpperCase()); // OK — x narrowed to string
}

function liveDangerously(x?: number | null) {
  console.log(x!.toFixed()); // ! asserts x is not null/undefined — no runtime check
}
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>

