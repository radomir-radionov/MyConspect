# TypeScript — Namespaces & Modules

Legacy namespaces, ES modules comparison, and triple-slash directives.

[← Назад к хабу](./5_ts.md)

### Related docs

- [TypeScript — hub](./5_ts.md) · [Интервью](./5_ts_interview.md)

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

Устаревший способ группировки кода в глобальной области видимости: `namespace Utils { export function f() {} }`.

| Когда использовать                                                                                                           | Заметки                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Предпочитайте модули ES (`import`/`export`) в современном коде. Пространства имен все еще появляются в старых `.d.ts` файлы. | `module X` это устаревший псевдоним для `namespace X`. Предпочитайте **модули ES** (`import`/`export`) в современном коде — пространства имен загрязняют глобальную область видимости и усложняют отслеживание зависимостей. |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Patterns

**Definition:**

Utils.getPass("Евгений", 31); // "Яухень31"

Utils.isEmpty(Utils.SECRET); // ложь

| Аспект                               | Деталь                                      |
| ------------------------------------ | ------------------------------------------- |
| Резюме                               | Utils.getPass("Евгений", 31); // "Яухень31" |
| Utils.isEmpty(Utils.SECRET); // ложь |

## **Окружающие пространства имен** (`declare namespace D3 { ... }`) описывают глобальные библиотеки, загруженные через `<script>`.

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

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>

## Namespaces and Modules

<details>
  <summary>Namespaces and Modules</summary>

### Namespaces and Modules

**Definition:**

Как TS организует код — модули ES (файлы) и устаревшие пространства имен (глобальные).

| Когда использовать                                                                                                                     | Заметки                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Использовать `import`/`export` за файл. Пространства имен только для глобального расширения или взаимодействия с устаревшими версиями. | Не `/// <reference path="foo.ts">` когда ты имеешь в виду `import` — ссылки добавляют файлы в компиляцию; импорт — это граф модуля. |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Common pitfalls

**Definition:**

// ХОРОШО

класс экспорта Треугольник {}

| Аспект                        | Деталь    |
| ----------------------------- | --------- |
| Резюме                        | // ХОРОШО |
| класс экспорта Треугольник {} |

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

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>

## Triple-Slash Directives

<details>
  <summary>Triple-Slash Directives</summary>

### Triple-Slash Directives

**Definition:**

Однострочный `///` комментарии в верхней части файла, которые дают указания компилятору.

| Когда использовать                                                                                           | Заметки                                                                                                            |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `/// <reference path="./types.d.ts" />` — legacy; prefer `импортировать` and `цконфигурация` `ссылки` today. | As of TS 5.5, the compiler does **not** emit handwritten triple-slash directives to output unless `save="истина"`. |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Common directives

**Definition:**

/// <amd-module name="NamedModule"/> // Имя модуля AMD в выводе

|

- **`reference path`** — относительная зависимость файлов; разрешение в глубину
- **`reference types`** - нравиться `import` для пакетов деклараций (`@types/node`); предпочитать `"types"` in `tsconfig.json` для `.ts` файлы
- **`reference lib`** — извлечь фрагменты библиотеки DOM/ES.
- **`--noResolve`** — игнорирует все ссылочные директивы

**How it works:**

`/// <amd-dependency path="..." />` - использовать `import "moduleName"` вместо.

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

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Ambient Declarations and `declare`

**Definition:**

Типовые описания кода, который существует где-либо еще (библиотеки JS, глобальные переменные, `.d.ts` прокладки).

| Когда использовать                                                              | Заметки                                                                                                                             |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `declare const $: JQueryStatic` or `объявить модуль «устаревшим»`. Emits no JS. | `объявить` does not create a value at runtime. Pair with `@типы/*` packages or hand-written `.d.ts` для нетипизированных библиотек. |

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

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### `noImplicitAny` and `strictNullChecks` — interview definitions

**Definition:**

Оба включены `"strict": true` in `tsconfig.json`.

---

| Аспект | Деталь                                            |
| ------ | ------------------------------------------------- |
| Резюме | Оба включены `"strict": true` in `tsconfig.json`. |
| ---    |

**`noImplicitAny`** — если TS не может определить тип, по умолчанию будет `any`. Этот флаг превращает это в **ошибку**, требующую явных аннотаций. Предотвращает тихую потерю безопасности типов в параметрах функции и нетипизированных переменных.

**`strictNullChecks`** - по умолчанию `null` и `undefined` присвоить любому типу. Этот флаг делает их разными — вы должны явно обрабатывать возможность обнуления. Отлавливает наиболее распространенный класс производственных ошибок.

## Оба включены `"strict": true` in `tsconfig.json`.

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>
