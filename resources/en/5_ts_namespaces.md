# TypeScript — Namespaces & Modules

Legacy namespaces, ES modules comparison, and triple-slash directives.

[← Back to hub](./5_ts.md)

### Related docs

- [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

### Sections

- [Namespaces](#namespaces)
- [Namespaces and Modules](#namespaces-and-modules)
- [Triple-Slash Directives](#triple-slash-directives)

---

## Namespaces

<details>
  <summary>Namespaces</summary>

### Namespaces

**Definition:**

Legacy way to group code in global scope: `namespace Utils { export function f() {} }`.

| When to use                                                                                           | Notes                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prefer ES modules (`import`/`export`) in modern code. Namespaces still appear in older `.d.ts` files. | `module X` is legacy alias for `namespace X`. Prefer **ES modules** (`import`/`export`) in modern code — namespaces pollute the global scope and complicate dependency tracking. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Patterns

**Definition:**

Utils.getPass("Yauhen", 31); // "Yauhen31"

Utils.isEmpty(Utils.SECRET); // false

| Aspect                                | Detail                                     |
| ------------------------------------- | ------------------------------------------ |
| Summary                               | Utils.getPass("Yauhen", 31); // "Yauhen31" |
| Utils.isEmpty(Utils.SECRET); // false |

## **Ambient namespaces** (`declare namespace D3 { ... }`) describe global libraries loaded via `<script>`.

**Examples:**

```typescript
// Legacy namespace — encapsulates globals; must export to expose
namespace Utils {
  export const SECRET = "123321";
  const PI = 3.14; // private to namespace — not accessible outside
  export const getPass = (name: string, age: number) => `${name}${age}`;
  export const isEmpty = <T>(data: T) => !data;
}

Utils.getPass("Yauhen", 31); // "Yauhen31"
Utils.isEmpty(Utils.SECRET); // false

// Modern equivalent — ES modules (no namespace wrapper needed)
// export const SECRET = "123321";
// export const getPass = ...
// import { getPass, SECRET } from "./Utils";

namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && /^\d+$/.test(s);
    }
  }
}

// Alias — import q = x.y.z (not the same as import from "module")
import polygons = Shapes.Polygons;
let sq = new polygons.Square();

// Multi-file: same namespace name merges across files
// Use /// <reference path="..." /> to order compilation
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>

## Namespaces and Modules

<details>
  <summary>Namespaces and Modules</summary>

### Namespaces and Modules

**Definition:**

How TS organizes code — ES modules (files) vs legacy namespaces (global).

| When to use                                                                                | Notes                                                                                                                             |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Use `import`/`export` per file. Namespaces only for global augmentation or legacy interop. | Don't `/// <reference path="foo.ts">` when you mean `import` — references add files to compilation; imports are the module graph. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Common pitfalls

**Definition:**

// GOOD

export class Triangle {}

| Aspect                   | Detail  |
| ------------------------ | ------- |
| Summary                  | // GOOD |
| export class Triangle {} |

**How it works:** ---

**Examples:**

```typescript
// BAD — needless namespace wrapper in a module
export namespace Shapes {
  export class Triangle {}
}
// Consumer: new shapes.Shapes.Triangle() 😬

// GOOD
export class Triangle {}

// Modules can't use outFile with commonjs/umd — only amd/system
```

```typescript
// myModules.d.ts (not a module)
declare module "SomeModule" {
  export function fn(): string;
}

// myOtherModule.ts
/// <reference path="myModules.d.ts" />
import * as m from "SomeModule";
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>

## Triple-Slash Directives

<details>
  <summary>Triple-Slash Directives</summary>

### Triple-Slash Directives

**Definition:**

Single-line `///` comments at file top that instruct the compiler.

| When to use                                                                                          | Notes                                                                                                                |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `/// <reference path="./types.d.ts" />` — legacy; prefer `import` and `tsconfig` `references` today. | As of TS 5.5, the compiler does **not** emit handwritten triple-slash directives to output unless `preserve="true"`. |

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Common directives

**Definition:**

/// <amd-module name="NamedModule"/> // Name AMD module in output

|

- **`reference path`** — relative file dependency; depth-first resolution
- **`reference types`** — like `import` for declaration packages (`@types/node`); prefer `"types"` in `tsconfig.json` for `.ts` files
- **`reference lib`** — pull in DOM/ES lib slices
- **`--noResolve`** — ignores all reference directives

**How it works:**

`/// <amd-dependency path="..." />` — use `import "moduleName"` instead.

---

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | /// <amd-module name="NamedModule"/>    // Name AMD module in output
```

```typescript
/// <reference path="./utils.ts" />     // Add file to compilation (ordering)
/// <reference types="node" />          // Include @types package
/// <reference lib="es2017.string" />   // Include built-in lib (like --lib)
/// <reference no-default-lib="true"/>  // Skip default lib.d.ts

/// <amd-module name="NamedModule"/>    // Name AMD module in output
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Ambient Declarations and `declare`

**Definition:**

Type-only descriptions of code that exists elsewhere (JS libs, globals, `.d.ts` shims).

| When to use                                                                | Notes                                                                                                                      |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `declare const $: JQueryStatic` or `declare module "legacy"`. Emits no JS. | `declare` does not create a value at runtime. Pair with `@types/*` packages or hand-written `.d.ts` for untyped libraries. |

**Examples:**

```typescript
// Global variable loaded via <script>
declare const jQuery: (selector: string) => unknown;

// Ambient module — shape of an untyped npm package
declare module "legacy-lib" {
  export function doSomething(x: number): string;
}

// Ambient namespace — global library
declare namespace D3 {
  export function select(selector: string): unknown;
}

// declare class/function/var — types only, no JS emit
declare function greet(name: string): void;
declare class LegacyWidget {
  constructor(el: string);
  render(): void;
}

// Asset imports — tell TS non-TS files exist (Vite/Webpack)
declare module "*.svg" {
  const content: string;
  export default content;
}
declare module "*.png" {
  const src: string;
  export default src;
}
```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### `noImplicitAny` and `strictNullChecks` — interview definitions

**Definition:**

Both are enabled by `"strict": true` in `tsconfig.json`.

---

| Aspect  | Detail                                                   |
| ------- | -------------------------------------------------------- |
| Summary | Both are enabled by `"strict": true` in `tsconfig.json`. |
| ---     |

**`noImplicitAny`** — when TS cannot infer a type, it would default to `any`. This flag makes that an **error**, forcing explicit annotations. Prevents silent loss of type safety in function parameters and untyped variables.

**`strictNullChecks`** — by default `null` and `undefined` assign to any type. This flag makes them distinct — you must handle nullability explicitly. Catches the most common production bug class.

## Both are enabled by `"strict": true` in `tsconfig.json`.

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>
