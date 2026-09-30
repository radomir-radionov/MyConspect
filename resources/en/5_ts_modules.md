# TypeScript — Modules

ES modules: `import`/`export`, type-only imports, and module resolution in tsconfig.

[← Back to hub](./5_ts.md)

### Related docs

- [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

### Sections

- [ES modules](#es-modules)

---

## ES modules

<details>
  <summary>ES modules</summary>

### ES module syntax

**Definition:**

Each file is a module. Use `import` and `export` for values and types across files.

| When to use                                                                                    | Notes                                                                                                                      |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Prefer ES modules in all modern code. Use `import type` / `export type` for type-only symbols. | `verbatimModuleSyntax` enforces explicit type-only imports. See [Compiler & tsconfig](./5_ts_basics.md#compiler-tsconfig). |

**Examples:**

```typescript
// named export
export function add(a: number, b: number) {
  return a + b;
}

// default export
export default class User {}

// import
import User, { add } from "./user.js";
import type { User as UserType } from "./types.js";
```

**Sources:** [Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)

### Module resolution

**Definition:**

`module` and `moduleResolution` in `tsconfig.json` control how import paths resolve.

| Option                                                 | Typical use                              |
| ------------------------------------------------------ | ---------------------------------------- |
| `"module": "ESNext"` + `"moduleResolution": "bundler"` | Vite, webpack, Next.js                   |
| `"moduleResolution": "NodeNext"`                       | Node.js ESM with `package.json` `"type"` |

**Sources:** [Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html) · [TSConfig Reference](https://www.typescriptlang.org/tsconfig)

### ES modules vs namespaces

**Definition:**

Prefer file-based ES modules. Legacy `namespace` is for global augmentation and older `.d.ts` — see [Namespaces & Modules](./5_ts_namespaces.md).

**Examples:**

```typescript
// GOOD
export class Triangle {}

// BAD — needless namespace wrapper in a module
export namespace Shapes {
  export class Triangle {}
}
```

**Sources:** [Namespaces and Modules](https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html)

</details>
