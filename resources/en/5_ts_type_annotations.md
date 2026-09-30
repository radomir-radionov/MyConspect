# TypeScript — Type Annotations

Explicit type labels on variables and when to omit them.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

### Sections

- [Type annotations](#type-annotations)

---

## Type annotations

<details>
  <summary>Type annotations</summary>

### Type Annotations on Variables

**Definition:**

An explicit type label on a variable: `let name: string`.

| When to use | Notes |
|-------------|-------|
| Add when inference is wrong or too wide; omit when obvious (`const n = 5` → `number`). Type goes **after** the name: `let x: number`. | Unlike C/Java (`int x = 0`), TypeScript puts the type **after** the name, not before it. And in most cases you don't need it — TypeScript infers from the value you assign. Rule of thumb: annotate when |

**Examples:**

```typescript
// Explicit
let myName: string = "Alice";

// Inferred — usually prefer this
let myName = "Alice";  // TypeScript knows: string

// Annotation useful when you need a wider type than inference gives:
let id: string | number = Math.random() > 0.5 ? "abc" : 42;
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>


