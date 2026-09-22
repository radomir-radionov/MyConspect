# TypeScript — Basics

Статическая типизация, tsconfig и повседневные типы.

[ ← Вернуться в хаб](./5_ts.md)

### Related docs

* [TypeScript — Основы](./5_ts_core.md) · [TypeScript — Сужение](./5_ts_narrowing.md) · [TypeScript — Функции](./5_ts_functions.md) · [TypeScript — Объекты](./5_ts_objects.md) · [TypeScript — Generics](./5_ts_generics.md) · [TypeScript — Ссылка](./5_ts_reference.md) · [TypeScript — Интервью](./5_ts_interview.md)

### Sections

- [Static typing & basics](#static-typing-basics)
- [Compiler & tsconfig](#compiler-tsconfig)
- [Everyday types](#everyday-types)

---

## Static typing & basics

<details>
  <summary>Compiler fundamentals</summary>

### Static Type-Checking

**Definition:**

Анализ кода во время компиляции без его запуска — TS проверяет типы и сообщает об ошибках перед развертыванием.

| Когда использовать | Заметки |
|-------------|-------|
| Бегать `tsc` или полагаться на диагностику IDE. Исправьте ошибки перед отправкой; использовать `--noEmit` в CI только для проверки типов. | TypeScript по умолчанию не останавливает работу вашего JS. Он сообщает об ошибках, но по-прежнему генерирует JavaScript, если вы не выберете более строгие правила генерации. Думайте об этом как о линтере со сверхспособностями, а не о среде выполнения e |

**Examples:**

```typescript
const message = "hello!";
message(); // Error: Type 'string' has no call signatures
// Caught before you ever run the code
```

**Sources:** [Справочник по TypeScript — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### Non-Exception Failures

**Definition:**

Ошибки типа, которые не вызывают исключений — TS сообщает о них во время компиляции.

| Когда использовать | Заметки |
|-------------|-------|
| Прочтите закорючки IDE и `tsc` выход. Исправить перед слиянием; они не появятся в журналах выполнения. | TS иногда отклоняет *действительный* JavaScript, который не приводит к немедленному сбою (например, доступ к `user.location` когда это не по типу). Это сделано намеренно — цель — выявить настоящие ошибки, а не зеркалировать e |

**Examples:**

```typescript
const user = { name: "Daniel", age: 26 };
user.location; // Error in TS — undefined in plain JS
```

```typescript
const announcement = "Hello World!";
announcement.toLocaleLowercase(); // Error — typo caught
announcement.toLocalLowerCase();  // Error — typo caught
announcement.toLocaleLowerCase(); // OK
```

```typescript
function flipCoin() {
  return Math.random < 0.5; // Error — forgot () on Math.random
  // return Math.random() < 0.5; // OK
}
```

**Sources:** [Справочник по TypeScript — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### Types for Tooling

**Definition:**

Типы существуют в первую очередь для обеспечения функций редактора — автозаполнения, рефакторинга, перехода к определению.

| Когда использовать | Заметки |
|-------------|-------|
| Наведите указатель мыши на типы, используйте символ переименования и найдите ссылки; хорошие типы = лучший DX. | Вы получаете преимущества инструментов еще до того, как ваш код будет полностью напечатан. Частичный ввод по-прежнему помогает автозаполнению и навигации. Чем больше вы печатаете, тем умнее становится редактор. |

**Examples:**

```typescript
import express from "express";

const app = express();

app.get("/", function (req, res) {
  res.send; // editor suggests: send, sendDate, sendFile, sendStatus...
});

app.listen(3000);
```

**Sources:** [Справочник по TypeScript — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### `tsc` — The TypeScript Compiler

**Definition:**

CLI, который проверяет тип TypeScript и генерирует JavaScript (`typescript` упаковка).

| Когда использовать | Заметки |
|-------------|-------|
| Бегать `tsc` с `tsconfig.json`, or `tsc --noEmit` только проверить. Бандлеры (Vite, esbuild) часто транспилируются; `tsc` все еще проверяет типы. | `tsc` выполняет две работы одновременно: проверку типов И компиляцию TS → JS. Многие современные установки используют `tsc --noEmit` только для проверки и позвольте Vite/esbuild/SWC обрабатывать фактическое объединение. Узнайте, какой инструмент что делает |

**Examples:**

```typescript
// hello.ts
console.log("Hello world!");
```

```bash
tsc hello.ts
# No console output = no type errors
# Creates hello.js alongside hello.ts
```

```typescript
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}!`);
}

greet("Brendan"); // Error: Expected 2 arguments, but got 1
```

**Sources:** [Справочник по TypeScript — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### Emitting with Errors

**Definition:**

По умолчанию `tsc` выдает JS даже при наличии ошибок типа.

| Когда использовать | Заметки |
|-------------|-------|
| Набор `"noEmitOnError": true` в CI/производственных сборках сломанные типы блокируют вывод. | У тебя может быть сломанный `.ts` файл и недавно обновленный `.js` файл рядом. Использовать `--noEmitOnError` or `"noEmitOnError": true` in `tsconfig.json` когда вы хотите, чтобы компилятор отказывался от вывода до тех пор, пока er |

**Examples:**

```bash
# Default: emits JS despite errors
tsc hello.ts

# Strict emit: no JS file if errors exist
tsc --noEmitOnError hello.ts
```

**Sources:** [Справочник по TypeScript — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### Explicit Types

**Definition:**

Введите аннотации, которые вы пишете сами, вместо того, чтобы полагаться на логические выводы.

| Когда использовать | Заметки |
|-------------|-------|
| Аннотировать параметры функции на границах общедоступного API; пусть вывод обрабатывает локальных жителей. | `Date()` (без `new`) возвращает **строку** в JavaScript, а не `Date` объект. TypeScript ловит `greet("Maddison", Date())` как ошибка. Вам нужно `new Date()`. |

**Examples:**

```typescript
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date()); // OK

// greet("Maddison", Date());     // Error: string not assignable to Date
// greet("Maddison");             // Error: expected 2 arguments
```

```typescript
let msg = "hello there!";
// TS infers: string — same as writing `let msg: string`
```

**Sources:** [Справочник по TypeScript — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### Erased Types

**Definition:**

Вся информация о типах удаляется при компиляции TS в JS — нулевой след во время выполнения.

| Когда использовать | Заметки |
|-------------|-------|
| Не ожидайте `typeof` или время выполнения `instanceof` по интерфейсам; используйте библиотеки проверки для внешних данных. | Аннотации типов никогда не меняют поведение во время выполнения. Если TS говорит, что все в порядке, но ваши типы неверны (например, неверное утверждение), вы все равно получите сбой во время выполнения. Типы используются только во время компиляции. |

**Examples:**

```typescript
// TypeScript source
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
greet("Maddison", new Date());
```

```javascript
// Emitted JavaScript — types gone
"use strict";
function greet(person, date) {
  console.log("Hello ".concat(person, ", today is ").concat(date.toDateString(), "!"));
}
greet("Maddison", new Date());
```

**Sources:** [Справочник по TypeScript — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### Downleveling

**Definition:**

Переписывание нового синтаксиса JS для старых целей (например, ES2020 → ES5).

| Когда использовать | Заметки |
|-------------|-------|
| Набор `"target"` in `tsconfig`. Пусть TS перепишет async/await, необязательную цепочку и т. д. для старых браузеров. | Цель по умолчанию — **ES5** (очень старая). Большинство браузеров сегодня поддерживают ES2015+. Набор `"target": "ES2015"` (или выше) в `tsconfig.json` если вам не нужна поддержка древних браузеров. Неправильная цель = раздутый или тр |

**Examples:**

```typescript
// Source (ES2015+ syntax)
`Hello ${person}, today is ${date.toDateString()}!`
```

```javascript
// Emitted with target ES5
"Hello ".concat(person, ", today is ").concat(date.toDateString(), "!");
```

```javascript
// Emitted with target ES2015 — template literal preserved
`Hello ${person}, today is ${date.toDateString()}!`;
```

**Sources:** [Справочник по TypeScript — typescript-from-scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

</details>

<a name="compiler-config"></a>

### Type system

**Definition:** Структурные типы, построенные на основе примитивов, объединений, пересечений, обобщений и сопоставленных/условных типов.

**When to use:** Границы API, общие модели, типизация библиотек.

**Pluses and minuses:**

| + | − |
|------|------|
| Выразительные контракты без затрат времени выполнения | Продвинутым типам нужно учиться |
| Типы утилит уменьшают дублирование | Слишком сложные типы ухудшают читабельность |

**Examples:**

```typescript
type Result<T> = { ok: true; data: T } | { ok: false; error: string };
type UserPreview = Pick<User, "id" | "name">;
```

**Sources:** [Повседневные типы](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Compiler & config

**Definition:** `tsc` проверяет тип и транспилирует через `tsconfig.json` — `target`, `module`, `strict`, пути и ссылки на проекты.

**When to use:** Каждый проект ТС; затягивать `strict` флаги с течением времени.

**Pluses and minuses:**

| + | − |
|------|------|
| Одна конфигурация для всего репо | `moduleResolution` может сбить с толку новичков |
| Инкрементные сборки в монорепозиториях | Неправильно настроенные пути незаметно нарушают импорт |

**Examples:**

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true
  }
}
```

**Sources:**

[tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

---

### TypeScript vs JavaScript
**Definition:** JavaScript является динамически типизированным; TypeScript — это **надмножество**, которое добавляет дополнительные статические типы, проверяемые во время компиляции, а затем удаляемые.

**When to use:** Долгоживущие кодовые базы, команды, библиотеки с общедоступными API.

**Pluses and minuses:**

| + | − |
|------|------|
| Меньше производственных ошибок | Дополнительный шаг компиляции |
| Более безопасный рефакторинг модулей | Дисциплина необходима, чтобы избежать `any` |

**Examples:**

```typescript
const user = { name: "Ada" };
// user.age; // Error: Property 'age' does not exist
```

**Sources:** [TypeScript с нуля](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

</details>

<details>
  <summary>Compiler pipeline</summary>

## Compiler & tsconfig

<details>
  <summary>Strictness & tsconfig</summary>

### Strictness

**Definition:**

Семейство флагов компилятора, повышающих безопасность типов (`strict`, `noImplicitAny`, и т. д.).

| Когда использовать | Заметки |
|-------------|-------|
| Давать возможность `"strict": true` о новых проектах; постепенно ужесточайте устаревший код. | `"strict": true` in `tsconfig.json` включает все строгие флаги одновременно. Вы также можете включить их по отдельности. Два самых больших: `noImplicitAny` и `strictNullChecks`. |

**Sources:** [Справочник по TypeScript — tsconfig-json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### `noImplicitAny`

**Definition:**

Флаг компилятора, который выдает ошибку, когда в противном случае TS сделал бы вывод `any` для переменной или параметра.

| Когда использовать | Заметки |
|-------------|-------|
| Включить через `strict` or `"noImplicitAny": true`. Форсирует явные типы или лучший вывод — ловит молчание `any` утечки. | Без этого флага нетипизированные параметры функции автоматически становятся `any` и вы потеряете всю проверку внутри функции. Один только этот флаг значительно улучшает качество кода. |

**Examples:**

```typescript
// With noImplicitAny: OFF — no error, person is any
function greet(person) {
  console.log(person.toUpperCase());
}

// With noImplicitAny: ON — must annotate
function greet(person: string) {
  console.log(person.toUpperCase());
}
```

**Sources:** [Справочник по TypeScript — tsconfig-json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### `strictNullChecks`

**Definition:**

Изготовление флага `null` и `undefined` отдельные типы, которые должны обрабатываться явно.

| Когда использовать | Заметки |
|-------------|-------|
| Включить в `tsconfig`. Используйте необязательную цепочку `?.`, нулевое слияние `??`и защищает перед доступом к возможно нулевым значениям. | Включение этого в существующую кодовую базу может привести к сотням ошибок за одну ночь. Стоит того для нового кода; запланируйте постепенный переход на устаревшие проекты. Сопряжение с дополнительной цепочкой (`?.`) и нулевое сотрудничество |

**Examples:**

```typescript
// strictNullChecks: OFF — no error
function getLength(s: string) {
  return s.length;
}
getLength(null); // runs, crashes at runtime

// strictNullChecks: ON
function getLength(s: string | null) {
  if (s === null) return 0;
  return s.length; // s narrowed to string
}
```

**Sources:** [Справочник по TypeScript — tsconfig-json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### Recommended tsconfig for new projects

**Definition:**

Рекомендуемый tsconfig для новых проектов — язык TypeScript или функция компилятора.

| Флаг | Цель |
|------|---------|
| `strict` | Включает `noImplicitAny`, `strictNullChecks`и т. д. |
| `moduleResolution` | Как разрешается импорт(`node`, `bundler`, `node16`) |
| `paths` | Импортировать псевдонимы (`@/components` → `src/components`) |
| `isolatedModules` | Каждый файл должен быть транспилируемым отдельно (требуется для Vite/esbuild) |
| `skipLibCheck` | Пропустить проверку типа `.d.ts` файлы — более быстрая сборка |
| `noEmitOnError` | Блокировать вывод JS при сбое типов |

`strict: true` позволяет `noImplicitAny`, `strictNullChecks`и другие строгие флаги вместе.

**Examples:**

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2015",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmitOnError": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**Sources:** [Справочник по TypeScript — tsconfig-json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### Advanced `tsconfig` flags — stricter and modern

**Definition:**

Включить более строгие флаги **поэтапно** — `noUncheckedIndexedAccess` сам по себе может добавить сотни ошибок в существующие базы кода.

| Флаг | Цель |
|------|---------|
| `noUncheckedIndexedAccess` | `arr[i]` и `obj[k]` становиться `T \| undefined` — безопаснее, шумнее |
| `exactOptionalPropertyTypes` | `prop?: T` ≠ `prop: T \| undefined` — более строгий дополнительный реквизит |
| `strictFunctionTypes` | Параметры контравариантной функции (исправляет необоснованную бивариантность) |
| `verbatimModuleSyntax` | Принудить `import type` / `export type`; более четкие границы ESM/CJS |
| `moduleResolution: "node16"` / `"nodenext"` | Правильное разрешение для Node ESM+ `package.json` `"type"` |
| `declaration` + `declarationMap` | излучать `.d.ts` (+исходные карты) для пользователей библиотек |
| `composite` + `incremental` | Ссылки на проекты и более быстрые инкрементальные сборки |
| `noImplicitOverride` | Требовать `override` при переопределении метода базового класса |
| `erasableSyntaxOnly` | Запретить синтаксис, который генерирует JS во время выполнения (свойства параметров, перечисления, пространства имен), поэтому `tsc` можно выполнять проверку типа без преобразования — стиль Node/ts-blank-space |

Включить более строгие флаги **поэтапно** — `noUncheckedIndexedAccess` сам по себе может добавить сотни ошибок в существующие базы кода.

**Examples:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "declarationMap": true,
    "composite": true
  }
}
```

**Sources:** [Справочник по TypeScript — tsconfig-json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### `@ts-ignore` vs `@ts-expect-error`

**Definition:**

Escape-штрихи, если компилятор неправильный или типы отсутствуют. Отдавайте предпочтение типам крепления; используйте экономно.

| Аспект | Деталь |
|--------|--------|
| Резюме | Escape-штрихи, если компилятор неправильный или типы отсутствуют. Отдавайте предпочтение типам крепления; используйте экономно.

Спасательные люки, когда |

Escape-штрихи, если компилятор неправильный или типы отсутствуют. Отдавайте предпочтение типам крепления; используйте экономно.

**How it works:** `@ts-expect-error` предпочтителен — он терпит неудачу, когда основная проблема устранена, поэтому подавления не портятся.

**Examples:**

```typescript
// @ts-ignore — suppresses next line always (no error if line is fine)
// @ts-expect-error — errors if the NEXT line has NO type error (safer — catches stale suppressions)

// @ts-expect-error — legacy API not typed yet
legacyApi.doSomething();
```

**Sources:** [Справочник по TypeScript — tsconfig-json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

</details>

<a name="everyday-types"></a>

## Everyday types

<details>
  <summary>Core types</summary>

### Primitives: `string`, `number`, `boolean`

**Definition:**

Основные типы значений в JavaScript — текст, числа и true/false. TypeScript использует те же строчные имена, что и `typeof`.

| Когда использовать | Заметки |
|-------------|-------|
| Аннотировать переменные (`let age: number = 42`) или позвольте выводу заполнить их (`let city = "Berlin"` → `string`). Используйте для параметров функции, типов возвращаемых значений и полей объекта. | В JavaScript нет `int` or `float` — все числовое просто `number`. Также, `String`, `Number`, и `Boolean` (с заглавной буквы) существуют как редкие типы оберток. Почти всегда используйте строчные буквы `string`, `онемевший |

**Examples:**

```typescript
let name: string = "Alice";
let age: number = 42;        // not int, not float — just number
let active: boolean = true;

// Number literals — all typed as number
const decimal: number = 6;
const hex: number = 0xf00d;
const binary: number = 0b1010;
const octal: number = 0o744;

// null and undefined are their own types
const u: undefined = undefined;
const n: null = null;

// Inference works too — often you don't need the annotation
let city = "Berlin";         // inferred as string
```

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Arrays

**Definition:**

Упорядоченный список, в котором каждый элемент имеет один и тот же тип — `number[]` or `Array64`.

| Когда использовать | Заметки |
|-------------|-------|
| Объявить `const ids: number[] = [1, 2, 3]`. Используйте с `map`, `filter`, `push`и т. д. Для смешанных фиксированных позиций вместо этого используйте **кортеж**. | `[number]` **не** массив чисел — это **кортеж** (массив фиксированной длины с определенными позициями). `number[]` это то, что вам нужно для обычного массива. |

**Examples:**

```typescript
const scores: number[] = [95, 87, 72];
const tags: Array<string> = ["typescript", "javascript"];

// Both are equivalent:
type A = string[];
type B = Array<string>;
```

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### `any`

**Definition:**

Тип, который отключает статическую проверку значения — TypeScript обрабатывает его как обычный JavaScript.

| Тип | Безопасность |
|------|--------|
| `any` | Проверка отключена |
| `unknown` | Сначала необходимо сузить |
| `never` | Нет допустимых значений |

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### `any` vs `unknown` vs `never` — interview comparison

**Definition:** `any` отключает проверку. `unknown` является типобезопасным верхним типом — перед использованием его необходимо сузить. `never` это нижний тип — никаких значений, используемых для полноты и функций, которые не возвращают значения.

**How it works:**

Назначьте что-нибудь на `any` or `unknown`. Только `unknown` силы `typeof` / предикаты перед доступом к свойству. `never` присваивается *любому* типу, но не принимает никаких значений (кроме других `never`). `useUnknownInCatchVariables` типы `catch (e)` as `unknown`.

| | `any` | `unknown` | `never` |
|---|-------|-----------|---------|
| Принимает любое значение | да | да | нет (необитаемый) |
| Использовать без сужения | да | **нет** | н/д |
| Назначается всему | да | только `unknown`/`any` | да |
| Типичное использование | аварийный люк (избегать) | внешние данные/JSON | `throw`, бесконечный цикл, полнота |

1. Динамические данные из API → `unknown` + сужение, или Zod/io-ts
2. Нетипизированные сторонние библиотеки → `@types/*` or `declare module`
3. По-настоящему динамичные формы → дженерики или индексные подписи.
4. Прототипирование → штраф в краткосрочной перспективе; затяните перед отправкой

**When to use:**

`JSON.parse` → `unknown`. Ошибка в `catch` → `unknown`. Дискриминированный профсоюз `default` → `const _x: never = x`.

#### Common pitfalls

`any` заразительно — производные значения становятся `any`. Скрытый `any` когда `noImplicitAny` выключен.

**Pluses and minuses:**

| + | − |
|------|------|
| `unknown` + честное сужение границ API | Больше шаблона, чем `any` |
| `never` приводит к сбою компиляции коммутатора | Легко «исправить» `as any` и потеряю чек |

**Examples:**

```typescript
// any — no checks
let a: any = 10;
a.foo(); // OK (crashes at runtime)

// unknown — must narrow first
function processValue(value: unknown): string {
  if (typeof value === "string") return value.toUpperCase();
  return "Unknown";
}

// never — does not return
function fail(msg: string): never {
  throw new Error(msg);
}
```

```typescript
let obj: any = { x: 0 };

obj.foo();           // no error — but might crash at runtime
obj = "hello";       // also fine, apparently
const n: number = obj; // sure, why not

// any in tuples and arrays — all type safety gone
let y: [any, any] = ["hello", 42];
let z: Array<any> = [10, "hello"];

let notSure: any = false;
notSure = true;      // boolean — no error
notSure = 42;        // number — no error
notSure = "hello";   // string — no error
```

```typescript
// Without a type annotation and no inference context, TS defaults to any:
function log(value) {  // implicit any if noImplicitAny is off
  console.log(value);
}
```

**Thoughts:**

Предпочитать `unknown` на границе; `any` это аварийный люк, а не тип.

`any` является заразным. Как только значение `any`, все, что происходит из него, имеет тенденцию становиться `any` слишком. Это запасной выход, а не образ жизни. Давать возможность `noImplicitAny` in `tsconfig` чтобы уловить места, куда TypeScript молча возвращается `any`.

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Type Annotations on Variables

**Definition:**

Явная метка типа переменной: `let name: string`.

| Когда использовать | Заметки |
|-------------|-------|
| Добавляйте, когда вывод неверен или слишком широк; опустить, если это очевидно (`const n = 5` → `number`). Тип идет **после** имени: `let x: number`. | В отличие от C/Java (`int x = 0`), TypeScript помещает тип **после** имени, а не перед ним. И в большинстве случаев вам это не нужно — TypeScript делает выводы на основе присвоенного вами значения. Эмпирическое правило: аннотируйте, когда |

**Examples:**

```typescript
// Explicit
let myName: string = "Alice";

// Inferred — usually prefer this
let myName = "Alice";  // TypeScript knows: string

// Annotation useful when you need a wider type than inference gives:
let id: string | number = Math.random() > 0.5 ? "abc" : 42;
```

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Functions

**Definition:**

Вызываемые значения с типизированными параметрами и типом возвращаемого значения.

| Когда использовать | Заметки |
|-------------|-------|
| Аннотируйте параметры и возвращайте их при необходимости: `function f(a: string): number`. Использовать `?`, значения по умолчанию, отдых `...args`. Обратные вызовы часто получают **контекстную типизацию** от вызывающей стороны. | Типы возвращаемых значений обычно выводятся — вам часто не нужно их писать. Но анонимные обратные вызовы получают **контекстную типизацию**: если вы передаете функцию `array.forEach`, TypeScript определяет параметр |

**Examples:**

```typescript
function greet(name: string) {
  console.log("Hello, " + name.toUpperCase());
}

greet(42); // Error: number is not assignable to string

function getFavoriteNumber(): number {
  return 26;
}

async function fetchCount(): Promise<number> {
  return 42;
}
```

```typescript
const names = ["Alice", "Bob", "Eve"];

// 's' is inferred as string — no annotation needed
names.forEach((s) => {
  console.log(s.toUpperCase());
});
```

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Object Types

Каждая тема: **Определение** → **Как использовать** → **Причуда** → примеры.

**Definition:**

Описание формы объекта — какие имена свойств существуют и какие типы имеют их значения.

| Когда использовать | Заметки |
|-------------|-------|
| В соответствии `{ name: string; age: number }`или извлечь в `interface` / `type`. Переход к функциям, переменным и полям класса. | Если вы опустите тип свойства, по умолчанию будет установлено значение `any`. Сепараторы могут быть `,` or `;` — оба работают. Объект правильной формы действителен, даже если у него есть дополнительные свойства (проверка лишних свойств только ap |

**Examples:**

```typescript
function printCoord(pt: { x: number; y: number }) {
  console.log(`x: ${pt.x}, y: ${pt.y}`);
}

printCoord({ x: 3, y: 7 });
```

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Optional Properties

**Definition:**

Поля объекта, которые могут отсутствовать, отмечены значком `?`: `last?: string`.

| Когда использовать | Заметки |
|-------------|-------|
| Добавлять `?` в полях интерфейса/типа. Доступ дает `T \| undefined` под `strictNullChecks` - использовать `?.` или чеки. | В JavaScript возвращаются недостающие свойства `undefined`, это не ошибка. TypeScript заставляет вас справиться с этим — доступ `obj.last` когда `last` не является обязательным, дает `'obj.last' is possibly undefined'`. Используйте ` |

**Examples:**

```typescript
function printName(obj: { first: string; last?: string }) {
  // Error: 'obj.last' is possibly 'undefined'
  // console.log(obj.last.toUpperCase());

  if (obj.last !== undefined) {
    console.log(obj.last.toUpperCase()); // OK
  }

  console.log(obj.last?.toUpperCase()); // OK — optional chaining
}

printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Union Types

**Definition:**

Значение, которое может быть **одним из** нескольких типов, записанных с помощью `|`: `string | number`.

| Когда использовать | Заметки |
|-------------|-------|
| Модель данных «или/или» (идентификатор в виде строки или числа, варианты статуса). **Уточняйте** перед использованием методов, специфичных для типа (`typeof`, `in`, дискриминант). | Объединение позволяет использовать только свойства/методы, **общие для всех участников**. `string \| number` не могу позвонить `.toUpperCase()` пока вы не сузите его. Как ни странно, *разрешёнными операциями* объединения являются |

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

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Type Aliases

**Definition:**

Многоразовое имя для любого типа: `type Point = { x: number; y: number }` or `type ID = string | number`.

| Когда использовать | Заметки |
|-------------|-------|
| Определите один раз, используйте везде. Лучше всего подходит для объединений, кортежей, примитивов, отображаемых/условных типов и сложных композиций. | Псевдоним типа — это просто псевдоним. `type ID = number \| string` везде одинаково с письмом `number \| string`. Вы не можете создать две «разные» версии одного и того же базового типа. Также введите |

**Examples:**

```typescript
type Point = {
  x: number;
  y: number;
};

type ID = number | string;

// Alias for a primitive — same as writing string everywhere
type Name = string;
let id: Name;
id = "42";  // OK
// id = 10; // Error

function printCoord(pt: Point) {
  console.log(pt.x, pt.y);
}

// Aliases work for any type, not just objects:
type Result = "success" | "error" | "pending";
```

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Interfaces

**Definition:**

Именованный контракт для формы объекта — сигнатуры свойств и методов без реализации.

| Когда использовать | Заметки |
|-------------|-------|
| `interface User { name: string; getPass(): string }`. Расширить с помощью `extends`, объявления слияния или `implements` на занятиях. | Интерфейсы могут быть **расширены** (`interface Bear extends Animal`) и **объединены** (объявить `interface Window` дважды и поля объединяются). Псевдонимы типов тоже не подходят. Эвристика: используйте `interface` для объекта |

**Examples:**

```typescript
interface Point {
  x: number;
  y: number;
}

interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}

// Declaration merging — both blocks combine into one Window:
interface Window {
  title: string;
}
interface Window {
  ts: TypeScriptAPI;
}

// Same name merges fields — common for augmenting library types
interface User {
  id: number;
  name: string;
}
interface User {
  age: number; // merged into User
}

const u: User = { id: 1, name: "Alice", age: 25 };
```

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Interface vs type alias — when to use which

**Definition:** Использовать `interface` для фигур объектов вы можете расширить или **объявление-объединить**. Использовать `type` для объединений, кортежей, примитивов, отображаемых/условных типов и конвейеров служебных типов.

**How it works:**

Оба описывают формы объектов. `interface` можно открыть заново(`interface Window { … }` дважды сливается). `type` не могу — ни секунды `type WindowType = …` является повторяющимся идентификатором. `interface` простирается с `extends`; `type` сочиняет с `&`. Союзы (`string | number`) и отображаемые типы существуют только на `type`.

| | `interface` | `type` |
|---|-------------|---------|
| Продлить | `extends` | пересечение `&` |
| Открыть заново/объединить | да (слияние объявлений) | нет — повторяющееся имя является ошибкой |
| Союзы/примитивы | нет | да (`string \| number`, `type ID = string`) |
| Кортежи | неловкий | естественный (`[string, number]`) |
| Сопоставленные/условные типы | ограниченный | да — основной инструмент |
| Формы объектов | да | да |
| `implements` на занятиях | да | да |

[Справочник — различия](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)

**When to use:** Договоры на объекты публичной библиотеки → `interface` (потребители могут объединиться). Дискриминированные профсоюзы / `Result65` → `type`. Эмпирическое правило команды — это хорошо; **неправильный** ответ: «Они идентичны».

**Pluses and minuses:**

| + | − |
|------|------|
| `interface` соответствует тому, как расширяются объекты JS (`.d.ts`) | Слияние может вас удивить |
| `type` выражает союзы и отображаемые типы | Большие условные типы ухудшают читаемость |

**Examples:**

```typescript
// type — intersection
type UserProps = { name: string; age: number };
type AdminProps = UserProps & { role: string };

// interface — extends
interface IUserProps { name: string; age: number }
interface IAdminProps extends IUserProps { role: string }
```

```typescript
const project = {
  title: "Project",
  specification: { areaSize: 100, rooms: 3 },
};
type Specification = typeof project["specification"]; // { areaSize: number; rooms: number }
```

**Thoughts:** Слияние и `extends` → интерфейс. Объединения, кортежи, отображаемые типы → тип.

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Type Assertions

**Definition:**

Приведение во время компиляции, сообщающее TS обрабатывать значение как определенный тип: `value as Type`.

| Когда использовать | Заметки |
|-------------|-------|
| Используйте, когда вы знаете больше, чем компилятор (элементы DOM, сужаются после проверки). Предпочитайте сужение слепому `as`. Нет проверки времени выполнения. | Утверждения работают только тогда, когда типы достаточно перекрываются (`string as number` отклонено). Для диких приведения пройдите `unknown` or `any` первый: `expr as any as TargetType`. А также: **нет проверки во время выполнения** — if |

**Examples:**

```typescript
const canvas = document.getElementById("main_canvas") as HTMLCanvasElement;

// Angle-bracket syntax (not in .tsx files):
const canvas2 = <HTMLCanvasElement>document.getElementById("main_canvas");

// Rejected — types don't overlap:
// const x = "hello" as number;

// Double assertion when you're really sure:
const wild = someValue as unknown as MyType;
```

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### The `satisfies` Operator (TS 4.9+)

**Definition:**

Оператор, проверяющий соответствие значения типу **без расширения** выведенных литералов (TS 4.9+).

| Когда использовать | Заметки |
|-------------|-------|
| Писать `const x = { ... } satisfies SomeType`. Проверяет форму и сохраняет узкие типы для автозаполнения — безопаснее, чем `as` для объектов конфигурации. | `as Type` отбрасывает умозаключение; `satisfies Type` держит это. Используйте, когда объекты конфигурации должны соответствовать схеме, но вам все равно нужны литеральные типы для автозаполнения. |

**Examples:**

```typescript
type Colors = Record<string, string | number[]>;

// satisfies — validates AND keeps narrow types
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
} satisfies Colors;
palette.red; // [number, number, number] — tuple preserved

// as — widens red to string | number[]
const palette2 = {
  red: [255, 0, 0],
  green: "#00ff00",
} as Colors;
palette2.red; // string | number[]

// Explicit annotation — same widening problem as `as`
const palette3: Colors = {
  red: [255, 0, 0],
  green: "#00ff00",
};
```

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Literal Types

**Definition:**

Типы, которые являются точными значениями: `"left"`, `42`, `true` - не просто `string` or `number`.

| Когда использовать | Заметки |
|-------------|-------|
| Создавать профсоюзы: `type Dir = "up" \| "down"`. Использовать `as const` на объектах/массивах, чтобы сохранить литералы вместо расширения до `string`. | Переменная, типизированная как `"hello"` может быть только когда-либо `"hello"` — бесполезно в одиночку. Сила исходит от **союзов литералов**. Также посмотрите **буквальный вывод**: `const obj = { method: "GET" }` дает `метод: stri |

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

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### `null` and `undefined`

**Definition:**

Типы отсутствия значения в JavaScript: `null` (намеренно пусто) и `undefined` (не установлено).

| Когда использовать | Заметки |
|-------------|-------|
| С `strictNullChecks`, они не могут быть назначены другим типам, если они не объявлены. Узкий с `=== null`, `??`или необязательная цепочка. | Поведение полностью зависит от `strictNullChecks`. **Выключенный:** `null`/`undefined` бесшумно перемещаться повсюду — как Java без нулевой безопасности. **Вкл.** необходимо сузить поле перед использованием возможного нулевого значения. ` |

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

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Enums

**Definition:**

Набор именованных числовых или строковых констант, которые **существуют во время выполнения** как объект JS.

| Когда использовать | Заметки |
|-------------|-------|
| Объявить `enum Status { Active, Inactive }`, использовать `Status.Active`. Предпочитать `as const` объекты или литеральные объединения в современном коде, чтобы избежать дополнительного размера пакета. | Перечисления — одна из немногих функций TS, которые добавляют код времени выполнения. Многие команды предпочитают `as const` вместо этого объекты или литеральные объединения — та же безопасность типов, без дополнительного вывода JS. Знайте, что они существуют; не тянись к ним |

**Examples:**

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

Direction.Up;    // 0
Direction.Down;  // 1

enum Color { Red, Green, Blue }
Color.Green;           // 1 (auto-increment from 0)
Color.Green === 1;     // true — numeric enums are numbers at runtime

// Custom start values — auto-increment continues
enum Dir2 {
  Up = 2,
  Down = 4,
  Left = 6,
  Right,         // 7
}

// Reverse mapping (numeric enums only)
enum Dir3 { Up }
Dir3[0];         // "Up"

// String enums — no reverse mapping, better for serialization
enum Links {
  Youtube = "https://youtube.com/",
  Vk = "https://vk.com/",
}

// Literal union alternative (no runtime enum object):
type Direction2 = "Up" | "Down" | "Left" | "Right";
```

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### React bundle size — prefer `as const` over enum

**Definition:**

Обычные перечисления создают объект времени выполнения. Для кода внешнего интерфейса `as const` объекты избегают дополнительного JS:

| Аспект | Деталь |
|--------|--------|
| Резюме | Обычные перечисления создают объект времени выполнения. Для кода внешнего интерфейса `as const` объекты избегают дополнительного JS:

Обычные перечисления выдают среду выполнения |

Обычные перечисления создают объект времени выполнения. Для кода внешнего интерфейса `as const` объекты избегают дополнительного JS:

**Examples:**

```typescript
// enum — emits runtime object + lookup function
enum Status { Pending = "Pending" }

// Preferred in React/modern code — zero runtime overhead
const Status2 = { Pending: "Pending" } as const;
type Status2 = typeof Status2[keyof typeof Status2];

import { useState } from "react";
const [status, setStatus] = useState(Status2.Pending);
```

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### `const enum` — inlined at compile time

**Definition:**

// Неиспользуемое константное перечисление — скомпилированный вывод может быть почти пустым:

// "используйте строгое";
// (объект перечисления не создается)

| Аспект | Деталь |
|--------|--------|
| Резюме | // Неиспользуемое константное перечисление — скомпилированный вывод может быть почти пустым:
// "используйте строгое";
// (объект перечисления не создается) |

**Examples:**

```typescript
const enum Links {
  Vk = "https://vk.com/",
}

const arr = [Links.Vk]; // Links.Vk replaced with literal at compile time

// Unused const enum — compiled output may be nearly empty:
// "use strict";
// (no enum object emitted)

// Used in .d.ts with isolatedModules → can break consumers — prefer regular enum or as const
```

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Less Common Primitives: `bigint` and `symbol`

**Definition:**

`bigint` для целых чисел за пределами `Number.MAX_SAFE_INTEGER`; `symbol` для уникальных ключей свойств.

| Когда использовать | Заметки |
|-------------|-------|
| Писать `100n` or `BigInt(100)` для биинта. `Symbol("id")` создает уникальный ключ — каждый вызов возвращает новый символ. | Каждый `Symbol("name")` вызов создает **уникальное** значение — два символа с одинаковым описанием никогда не равны (`===` всегда ложно). В этом вся суть: гарантированные уникальные ключи, особенно для o |

**Examples:**

```typescript
const big: bigint = 100n;
const alsoBig: bigint = BigInt(100);

const id = Symbol("id");
const alsoId = Symbol("id");

if (id === alsoId) {
  // Never runs — always false, even with same description
}

const user = {
  [id]: "secret-metadata",
  name: "Alice",
};
```

**Sources:** [Справочник по TypeScript — повседневные типы] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>

<a name="type-narrowing"></a>
