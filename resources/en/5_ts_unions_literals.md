# TypeScript — Unions & Literals

Union types (`A | B`) and string/number literal types.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

### Sections

- [Unions and literals](#unions-and-literals)

---

## Unions and literals

<details>
  <summary>Unions and literals</summary>

### Union Types

**Definition:**

A value that can be **one of** several types, written with `|`: `string | number`.

| When to use | Notes |
|-------------|-------|
| Model “either/or” data (ID as string or number, status variants). **Narrow** before using type-specific methods (`typeof`, `in`, discriminant). | A union only lets you use properties/methods **shared by all members**. `string \| number` can't call `.toUpperCase()` until you narrow it. Counter-intuitively, a union's *allowed operations* are the  |

**Examples:**

```typescript
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}

printId(101);    // OK
printId("202");  // OK
printId({ myID: 1 }); // Error
```

```typescript
function printId(id: number | string) {
  // console.log(id.toUpperCase()); // Error — number has no toUpperCase

  if (typeof id === "string") {
    console.log(id.toUpperCase()); // OK — narrowed to string
  } else {
    console.log(id); // OK — narrowed to number
  }
}

function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    console.log("Hello, " + x.join(" and "));
  } else {
    console.log("Welcome lone traveler " + x);
  }
}

// Shared method — no narrowing needed
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3); // both arrays and strings have .slice()
}
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Literal Types

**Definition:**

Types that are exact values: `"left"`, `42`, `true` — not just `string` or `number`.

| When to use | Notes |
|-------------|-------|
| Build unions: `type Dir = "up" \| "down"`. Use `as const` on objects/arrays to preserve literals instead of widening to `string`. | A variable typed as `"hello"` can only ever be `"hello"` — useless alone. Power comes from **unions of literals**. Also watch **literal inference**: `const obj = { method: "GET" }` gives `method: stri |

**Examples:**

```typescript
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}

printText("Hello", "left");    // OK
printText("Hello", "centre");  // Error — typo caught at compile time

function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

```typescript
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" };
// handleRequest(req.url, req.method); // Error — method inferred as string

const req2 = { url: "https://example.com", method: "GET" } as const;
handleRequest(req2.url, req2.method); // OK — method is "GET"
```

**Sources:** [TypeScript handbook — everyday-types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>


