# TypeScript — Interview

Вопросы и ответы для собеседования, устные вопросы и задачи на типы.

[← Назад к хабу](./5_ts.md)

### Related docs

[TypeScript — хаб](./5_ts.md) · [Типы](./5_ts_types.md) · [Сужение](./5_ts_narrowing.md) · [Функции](./5_ts_functions.md) · [Манипуляции типами](./5_ts_type_manipulation.md)

### Main concepts

| Section                                                     | Covers                                               |
| ----------------------------------------------------------- | ---------------------------------------------------- |
| [Overview](#overview)                                       | Обязательные темы и карта                            |
| [Questions & Answers](#questions-answers)                   | Вопросы и ответы, от основ к продвинутым             |
| [Coding tasks](#coding-tasks)                               | Задачи на типы — `Pick`, `Exclude`, `infer`, корзина |
| [Quick oral questions](#quick-oral-questions-self-check)    | Пятнадцать вопросов для самопроверки                 |
| [Oral questions (ITVDN)](#oral-questions-itvdn--typescript) | Устные вопросы в стиле курса                         |
| [Oral questions (extra)](#oral-questions-extra)             | Флаги компилятора и модули                           |

### Sections

- [Overview](#overview)
- [Questions & Answers](#questions-answers)
- [Coding tasks](#coding-tasks)
- [Quick oral questions (self-check)](#quick-oral-questions-self-check)
- [Oral questions (ITVDN — TypeScript)](#oral-questions-itvdn--typescript)
- [Oral questions (extra)](#oral-questions-extra)

---

## Overview

<details>
<summary>Interview checklist</summary>

**Definition:** Задачи на уровне типов и типичные вопросы с живым кодом на собеседовании по TypeScript.

| Область       | Нужно знать                                                              |
| ------------- | ------------------------------------------------------------------------ |
| **Basics**    | `any` и `unknown` и `never`, сужение, объединения                        |
| **Structure** | `interface` и `type`, дженерики, служебные типы                          |
| **Safety**    | `strict`, размеченные объединения, исчерпываемость, `erasableSyntaxOnly` |
| **Advanced**  | `infer`, условные и сопоставленные типы, `keyof`                         |
| **Runtime**   | Типы стираются — внешние данные надо проверять (Zod)                     |

**Sources:** [Type challenges](https://github.com/type-challenges/type-challenges)

</details>

---

## Questions & Answers

Вопросы идут от основ языка к классам, инструментам, продвинутым типам, затем React и Node. Повторы из исходного списка сведены в один блок. Ответы описывают текущее поведение TypeScript; текст вставки не копируется.

### Basics

<details>
  <summary>What is TypeScript?</summary>

### What is TypeScript?

**Definition:** Типизированное расширение JavaScript — типы проверяются во время компиляции и **стираются** в создаваемом JS. Добавляет интерфейсы, дженерики, перечисления и строгие проверки на нулевое значение без изменения семантики времени выполнения.

| Плюсы                                              | Минусы                                 |
| -------------------------------------------------- | -------------------------------------- |
| Более безопасный рефакторинг, лучшая поддержка IDE | Дополнительный шаг компиляции          |
| Постепенное принятие (`allowJs`)                   | `any` / `as` может обойти безопасность |
| Обнаруживает ошибки перед развертыванием           | Типы не существуют во время выполнения |

**How it works:** `tsc` (или esbuild/swc с `noEmit` check) анализирует код → сообщает об ошибках → выдает JS. Внешние данные (API, `JSON.parse`) по-прежнему требует проверки во время выполнения (Zod, io-ts), поскольку TS не может проверять полезную нагрузку сети.

**When to use:** Любое поддерживаемое приложение, общие библиотеки, команды, кодовые базы NestJS/Angular.

**Examples:**

```typescript
function greet(name: string): string {
  return `Hello, ${name}`;
}
greet(42); // compile error: number not assignable to string
```

**Interview one-liner:** _"TypeScript — это JavaScript с дополнительными статическими типами — безопасность во время компиляции, среда выполнения по-прежнему JS."_

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>

<details>
  <summary>What problems does TypeScript solve? Why in large projects?</summary>

### What problems does TypeScript solve? Why in large projects?

**Definition:** TypeScript добавляет в JavaScript дополнительные статические типы — перехватывая ошибки формы во время компиляции, прежде чем они попадут в рабочую среду.

**Problems it solves:**

- Опечатки и неверный доступ к свойствам (`user.nmae`)
- Безопасность рефакторинга — переименуйте поле, компилятор найдет все варианты использования.
- Самодокументируемые API — сигнатуры функций показывают намерение.
- Улучшено автозаполнение и навигация в IDE.
- Общие контракты между модулями внешнего и внутреннего интерфейса.

**Why large projects:** Больше файлов, больше разработчиков, больше точек интеграции — типы масштабируют общение лучше, чем комментарии. `strict` Режим окупается, когда кодовая база переживет память любого отдельного разработчика.

**Thoughts:** _Типы — это документация, которую обеспечивает компилятор._

**See also:** [Что такое TypeScript?](#what-is-typescript) · вводный раздел

</details>

<details>
  <summary>When can TypeScript hinder development?</summary>

### When can TypeScript hinder development?

**Definition:** TS помогает большинству поддерживаемых приложений, но требует затрат — особенно на ранних этапах проекта или при неправильном использовании.

| Помеха                                          | смягчение последствий                                             |
| ----------------------------------------------- | ----------------------------------------------------------------- |
| Кривая обучения                                 | Начните с `strict` постепенно; использовать `allowJs`             |
| Медленный CI при проверке типов всего монолита  | Ссылки на проекты, инкрементные сборки                            |
| Борьба с компилятором в сложных дженериках      | Упрощать; не переусердствуйте с типами                            |
| `any` / `as` аварийные люки обхода безопасности | Давать возможность `noImplicitAny`, проверка кода                 |
| Сторонние библиотеки без типов                  | `@types/*`, местный `.d.ts`, `unknown` + Зод на границах          |
| Скорость прототипирования                       | `// @ts-nocheck` только для файлов спайков, а не для производства |

**Thoughts:** _TS причиняет боль, когда вы относитесь к типам как к бюрократии, а не как к ограждению, или когда команда отключает строгие проверки._

</details>

<details>
  <summary>Is TypeScript strictly statically typed?</summary>

### Is TypeScript strictly statically typed?

**Definition:** TypeScript типизирован **постепенно**. Проверка статическая, но типы необязательны: `any`, утверждения и пропущенные аннотации отключают проверку значения.

**How it works:** С `strict` значение без аннотации — ошибка (`noImplicitAny`), а не тихий `any`. Система типов не полностью надёжна: параметры методов по умолчанию бивариантны, а типы стираются, поэтому в рантайме значение всё ещё может иметь другую форму.

**Examples:**

```typescript
function len(x: any) {
  return x.length; // allowed, even if x is a number at runtime
}
```

**Sources:** [Handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html) · [Everyday types — `any`](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

</details>

<details>
  <summary>Is TypeScript a functional programming language?</summary>

### Is TypeScript a functional programming language?

**Definition:** TypeScript многопарадигменный, как JavaScript. Он типизирует функции первого класса, неизменяемость (`readonly`, `as const`) и объединения, а также классы.

**How it works:** Язык не требует чистых функций, неизменяемых данных или алгебраических эффектов. Функциональный стиль можно писать; компилятор его не навязывает.

**See also:** [Functions](./5_ts_functions.md) · [Why TypeScript for OOP if it emits JS?](#why-typescript-for-oop-if-it-emits-js)

**Sources:** [Handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>

<details>
  <summary>Which OOP principles does TypeScript support?</summary>

### Which OOP principles does TypeScript support?

**Definition:** Классы покрывают инкапсуляцию, наследование и подтиповый полиморфизм. Абстракцию выражают `interface` и `abstract class`. Типизация **структурная**, а не номинальная, как в Java или C#.

**How it works:** Класс может `extend` один базовый класс и `implements` много интерфейсов. Множественного наследования классов нет. `private` и `protected` существуют только при компиляции; поля `#` — приватность в рантайме.

**See also:** [Classes](./5_ts_classes.md) · [Why TypeScript for OOP if it emits JS?](#why-typescript-for-oop-if-it-emits-js)

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<details>
  <summary>Why TypeScript for OOP if it emits JS?</summary>

### Why TypeScript for OOP if it emits JS?

**Short answer:** В JS есть классы, но **нет интерфейсов**. TS позволяет проектировать отношения сущностей на основе абстракций и давать сбой во время компиляции. Среда выполнения по-прежнему JS, поэтому `private` стерто — используйте `#` для настоящего сокрытия.

**How it works:** Писать `interface Ledger { addRecord(r: LedgerEntry): void }` первый. Реализации `implements Ledger`. Неправильная проводка (отсутствует поле, неправильный `kind`) представляет собой `tsc` ошибка. По той же причине, что и диагностика автомобиля перед поездкой.

**When to use:** Приложения с интенсивным использованием предметной области, DI, команды. Не требуется для сценария из 20 строк.

**See also:** [Classes](./5_ts_classes.md) · [OOP in JavaScript](./3_js_oop.md#oop-in-javascript) · [Doka — OOP](https://doka.guide/tools/oop/)

</details>

<details>
  <summary>Which TypeScript features help a full-stack codebase?</summary>

### Which TypeScript features help a full-stack codebase?

**Definition:** Общие типы, дженерики и проверки `strict` позволяют одному контракту описывать данные по обе стороны HTTP или RPC.

**How it works:** Публикуйте типы запроса и ответа из одного пакета (или выводите их из роутера). UI и сервер импортируют эти типы. Типы всё равно стираются, поэтому сервер должен проверять вход в рантайме.

**See also:** [How to typify API response, object, array, and function?](#how-to-typify-api-response-object-array-and-function)

**Sources:** [Handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>

<details>
  <summary>Compiler vs transpiler?</summary>

### Compiler vs transpiler?

**Definition:** `tsc` **проверка типов** (компилятор) и **генерация JS** из TS (транспиляция между языками высокого уровня).

| Роль       | `tsc`              |
| ---------- | ------------------ |
| Компилятор | Статический анализ |
| Транспилер | TS → JS излучает   |

**Examples:**

```bash
tsc --noEmit
tsc
```

**Sources:** [TypeScript с нуля](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

</details>

<details>
  <summary>What happens on build with type errors?</summary>

### What happens on build with type errors?

**Definition:** По умолчанию `tsc` **сообщает об ошибках, но может по-прежнему выдавать JS** — типы не блокируют вывод, если они не настроены.

**How it works:**

| Настройка/флаг        | Поведение                                                         |
| --------------------- | ----------------------------------------------------------------- |
| По умолчанию `tsc`    | Зарегистрированы ошибки; JS все еще может быть выпущен            |
| `noEmitOnError: true` | Нет вывода JS, пока типы не пройдут                               |
| `tsc --noEmit`        | Только проверка типа — никаких выбросов (обычно в CI)             |
| Вите/esbuild/SWC      | Транспилировать без проверки типа; бегать `tsc --noEmit` отдельно |

**Interview answer:** _В строгом режиме CI мы выполняем `tsc --noEmit` и провалить сборку из-за ошибок. Сами по себе бандлеры не гарантируют типобезопасность._

**Thoughts:** _Проверка типов и транспиляция — это отдельные этапы в современных конвейерах._

**Sources:** [tsconfig — noEmitOnError](https://www.typescriptlang.org/tsconfig#noEmitOnError)

</details>

<details>
  <summary>How do you install and compile TypeScript?</summary>

### How do you install and compile TypeScript?

**Definition:** Установите пакет `typescript` и запускайте `tsc`. `tsc --watch` перекомпилирует файлы при изменении.

**How it works:**

```bash
npm install --save-dev typescript
npx tsc --init
npx tsc --noEmit
npx tsc --watch
```

`tsc --noEmit` type-checks without writing JavaScript. A project file is `tsconfig.json`. Global installs work, but a dev dependency pins the version for the repo.

**See also:** [The Basics](./5_ts_basics.md)

**Sources:** [TypeScript from scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

</details>

<details>
  <summary>What is `tsconfig.json`?</summary>

### What is `tsconfig.json`?

**Definition:** Файл проекта: помечает каталог как проект TypeScript и задаёт опции компилятора, `include` и `exclude`.

**How it works:** `compilerOptions.strict` включает семейство strict (`strictNullChecks`, `noImplicitAny`, `strictFunctionTypes` и другие). `target` и `module` управляют генерацией. `extends` переиспользует базовый конфиг. Пути в файле разрешаются от этого файла.

**Examples:**

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "NodeNext",
    "noEmit": true
  },
  "include": ["src"]
}
```

**See also:** [Important strict compiler flags?](#important-strict-compiler-flags)

**Sources:** [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

</details>

<details>
  <summary>What is the difference between `.ts` and `.tsx`?</summary>

### What is the difference between `.ts` and `.tsx`?

**Definition:** `.ts` — TypeScript. `.tsx` — TypeScript, в котором может быть JSX. В `.tsx` утверждение пишут как `value as Type`, потому что `<Type>value` похоже на тег.

**How it works:** Задайте `"jsx"` в `tsconfig` (`react-jsx` для современного автоматического рантайма). Файл `.tsx` проверяется как JSX; переименование в `.ts` делает JSX синтаксической ошибкой.

**See also:** [JSX](./5_ts_jsx.md#jsx)

**Sources:** [Handbook — JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)

</details>

<details>
  <summary>Explicit vs implicit type assignment?</summary>

### Explicit vs implicit type assignment?

**Definition:** Явная аннотация написана вами (`let n: number = 1`). Неявный тип выводится из инициализатора (`let n = 1`).

**How it works:** Вывод смотрит на инициализатор. `let` расширяет литералы (`1` становится `number`). `const` сохраняет литеральный тип (`1`). Аннотируйте, если инициализатора нет, если нужен тип шире литерала или если возвращаемое значение функции надо сверить с контрактом.

**Examples:**

```typescript
let count = 1; // number
const mode = "compact"; // "compact"
let id: string | number = "a1";
```

**See also:** [Type inference](./5_ts_type_inference.md) · [Type annotations](./5_ts_type_annotations.md)

**Sources:** [Type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)

</details>

<details>
  <summary>Type inference vs contextual typing?</summary>

### Type inference vs contextual typing?

**Definition:** Вывод идёт от значения к его типу. Контекстная типизация идёт от ожидаемого типа внутрь выражения без аннотации, обычно колбэка.

**How it works:** `const xs = [1, 2]` выводится как `number[]`. В `xs.forEach(n => n.toFixed())` параметр `n` контекстно имеет тип `number`, потому что `forEach` ожидает `(value: number) => void`. Обработчики событий и перегрузки работают так же.

**Examples:**

```typescript
window.addEventListener("click", (event) => {
  event.clientX; // MouseEvent from the listener overload
});
```

**Sources:** [Type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)

</details>

<details>
  <summary>What are the built-in types in TypeScript?</summary>

### What are the built-in types in TypeScript?

**Definition:** Значения JavaScript плюс несколько типов, которые есть только в TypeScript.

| Группа     | Типы                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| Примитивы  | `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined` |
| Объекты    | формы объектов, массивы, кортежи, функции, классы                      |
| Верх и низ | `any`, `unknown`, `never`, `void`                                      |
| Особые     | литеральные типы, объединения, пересечения, `enum`                     |

**How it works:** Имена вроде `String` (объект-обёртка) — не то же самое, что `string`. Предпочитайте строчные имена примитивов.

**See also:** [Types](./5_ts_types.md) · [Primitives](./5_ts_primitives.md)

**Sources:** [Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>

<details>
  <summary>`any` vs `unknown` vs `never`?</summary>

### `any` vs `unknown` vs `never`

**Definition:** `any` отключает проверку; `unknown` требует сужения; `never` — пустой тип (недоступный).

| Тип       | Поведение                   |
| --------- | --------------------------- |
| `any`     | Никаких проверок            |
| `unknown` | Сузить перед использованием |
| `never`   | Исчерпывание/броски         |

**Examples:**

```typescript
function parse(input: unknown) {
  if (typeof input === "string") return input.trim();
}
```

**Sources:** [Повседневные типы](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

</details>

<details>
  <summary>When is `any` acceptable?</summary>

### When is `any` acceptable?

**Definition:** `any` отключает проверку типов — используйте умеренно на границах, а не по умолчанию.

**Acceptable cases:**

- Постепенный переход с JS (`allowJs` кодовая база)
- Код спайка прототипа (временный, с билетом для ввода позже)
- Действительно динамические данные с немедленным сужением до `unknown`
- Устаревший сторонний код без типов и времени на перенос

**Prefer instead:** `unknown` + сужение, обобщения или тонкая типизированная оболочка вокруг нетипизированной библиотеки.

**Thoughts:** _`any` это скальпель для границ миграции, а не образ жизни._

**See also:** [`any` vs `unknown` vs `never`](#любой-против-неизвестного-против-никогда)

</details>

<details>
  <summary>`void` vs `never`?</summary>

### `void` vs `never`?

**Definition:** `void` значит, что возвращаемое значение функции игнорируют (она возвращает `undefined` или ничего полезного). `never` значит, что функция не возвращает значение: она бросает ошибку или крутится вечно.

**How it works:** Функция без `return` выводится как `void`, если результат не используют. `never` также получается в ветке `default` исчерпывающего `switch` и в невозможных пересечениях вроде `string & number`.

**Examples:**

```typescript
function log(message: string): void {
  console.log(message);
}

function fail(message: string): never {
  throw new Error(message);
}
```

**See also:** [`any` vs `unknown` vs `never`](#any-vs-unknown-vs-never)

**Sources:** [Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#void) · [`never`](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking)

</details>

<details>
  <summary>`null` vs `undefined`?</summary>

### `null` vs `undefined`?

**Definition:** `undefined` значит, что значение не передали. `null` — явное пустое значение. С `strictNullChecks` ни то ни другое нельзя присвоить `string` и другим обычным типам.

**How it works:** Отсутствующий инициализатор — это `undefined`. Необязательные свойства (`email?: string`) могут отсутствовать или быть `undefined`. В JSON часто встречается `null`. `??` и `?.` считают оба nullish; `||` также считает пустыми `0` и `""`.

**See also:** [How to handle optional and `undefined` fields?](#how-to-handle-optional-and-undefined-fields) · [`null` and `undefined`](./5_ts_null_undefined.md)

**Sources:** [Everyday types — null and undefined](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined)

</details>

<details>
  <summary>How to handle optional and `undefined` fields?</summary>

### How to handle optional and `undefined` fields?

**Definition:** С `strictNullChecks`, пропал и `undefined` должны обрабатываться явно.

| Синтаксис                   | Значение                                                           |
| --------------------------- | ------------------------------------------------------------------ |
| `prop?: string`             | Может отсутствовать или `undefined`                                |
| `prop: string \| undefined` | Должен присутствовать; значение может быть `undefined`             |
| `obj.prop?.trim()`          | Необязательная цепочка — короткое замыкание на нуль/неопределенное |
| `value ?? 'default'`        | Нулевое слияние — только для `null`/`undefined`                    |

```typescript
type User = { name: string; email?: string };

function greet(user: User) {
  const domain = user.email?.split("@")[1] ?? "unknown";
  return `${user.name}@${domain}`;
}
```

**Thoughts:** _`?` по реквизиту + `?.` и `??` на сайтах доступа — никогда не предполагайте, что поле существует._

**See also:** [Необязательные свойства](./5_ts_objects.md#optional-properties) · [`null` и `undefined`](./5_ts_null_undefined.md#null-and-undefined)

</details>

<details>
  <summary>What is the difference between `var`, `let`, and `const`?</summary>

### What is the difference between `var`, `let`, and `const`?

**Definition:** Это привязки JavaScript. TypeScript проверяет их типы и не меняет правила области видимости.

| Ключевое слово | Область                                     | Переприсваивание                                       |
| -------------- | ------------------------------------------- | ------------------------------------------------------ |
| `var`          | функция или глобальная область; поднимается | да                                                     |
| `let`          | блок; временная мёртвая зона                | да                                                     |
| `const`        | блок                                        | нет (сама привязка). Поля объекта всё ещё можно менять |

**How it works:** Предпочитайте `const`, затем `let`. `const` также сохраняет литеральные типы (`const role = "admin"` — это `"admin"`, а не `string`).

**See also:** [Variables, scope, and hoisting](./3_js_variables.md#variables-scope-and-hoisting) · [Variable declaration](./5_ts_variable_declaration.md)

**Sources:** [Variable declarations](https://www.typescriptlang.org/docs/handbook/variable-declarations.html)

</details>

<details>
  <summary>How do you type an array in TypeScript?</summary>

### How do you type an array in TypeScript?

**Definition:** `T[]` и `Array<T>` — один и тот же тип. `ReadonlyArray<T>` (или `readonly T[]`) запрещает мутирующие методы.

**Examples:**

```typescript
const ids: number[] = [1, 2];
const names: Array<string> = ["ada"];
const frozen: readonly string[] = ["a"];
// frozen.push("b"); // error
```

**See also:** [Arrays](./5_ts_arrays.md)

**Sources:** [Everyday types — arrays](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)

</details>

<details>
  <summary>What is the difference between a tuple and an array?</summary>

### What is the difference between a tuple and an array?

**Definition:** Массив — список одного типа элементов и открытой длины. Кортеж фиксирует тип каждой позиции и, если нет rest-элемента, длину.

**Examples:**

```typescript
const row: [string, number] = ["ada", 36];
const point = [10, 20] as const; // readonly [10, 20]
```

Readonly-кортеж (`readonly [string, number]` или `as const`) нельзя дополнять и нельзя писать по индексу. Лишние элементы — ошибка, если кортеж не заканчивается на `...T[]`.

**See also:** [Object types](./5_ts_objects.md)

**Sources:** [Everyday types — tuples](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#tuple-types)

</details>

<details>
  <summary>How do you type an object and optional properties?</summary>

### How do you type an object and optional properties?

**Definition:** Форму описывают через `type` или `interface`. `prop?: T` значит, что при `strictNullChecks` свойство может отсутствовать или быть `undefined`.

**Examples:**

```typescript
type User = {
  name: string;
  email?: string;
};

const user: User = { name: "Ada" };
```

**See also:** [Object types](./5_ts_objects.md) · [`interface` vs `type`](#interface-vs-type)

**Sources:** [Object types](https://www.typescriptlang.org/docs/handbook/2/objects.html)

</details>

<details>
  <summary>What is the difference between `readonly` and `const`?</summary>

### What is the difference between `readonly` and `const`?

**Definition:** `const` замораживает **привязку**. `readonly` замораживает **свойство** или позицию массива/кортежа на этапе компиляции.

**How it works:** `const user = { name: "Ada" }` всё ещё позволяет `user.name = "Grace"`. `readonly name: string` отвергает такое присваивание в системе типов. Ни то ни другое не глубокая заморозка в рантайме; для неё нужен `Object.freeze`.

**Examples:**

```typescript
const user = { name: "Ada" };
user.name = "Grace"; // allowed

type Account = { readonly id: string };
```

**Sources:** [Object types — `readonly`](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties)

</details>

<details>
  <summary>How do enums work in TypeScript?</summary>

### How do enums work in TypeScript?

**Definition:** `enum` — набор именованных констант. В отличие от псевдонима типа, он порождает объект в рантайме.

**How it works:** Числовой enum автоматически растёт от 0 и порождает обратное отображение. Строковый enum хранит строки и обратного отображения не имеет. `const enum` подставляется на месте и не порождает объект, но изолированным инструментам его труднее увидеть.

**Examples:**

```typescript
enum Direction {
  Up,
  Down,
}
enum Role {
  Admin = "admin",
  Guest = "guest",
}
```

**See also:** [Enums](./5_ts_enums.md) · [Why avoid `enum`?](#why-avoid-enum)

**Sources:** [Enums](https://www.typescriptlang.org/docs/handbook/enums.html)

</details>

<details>
  <summary>Why avoid `enum`?</summary>

### Why avoid `enum`?

**Definition:** Числовые перечисления добавляют объекты времени выполнения; `as const` + Union легче и не боится дрожания деревьев.

**Examples:**

```typescript
const Status = { Active: "active", Removed: "removed" } as const;
type Status = (typeof Status)[keyof typeof Status];
```

**Sources:** [Перечисления](https://www.typescriptlang.org/docs/handbook/enums.html)

</details>

<details>
  <summary>How do optional chaining and nullish coalescing work?</summary>

### How do optional chaining and nullish coalescing work?

**Definition:** `?.` останавливается и возвращает `undefined`, если база — `null` или `undefined`. `??` берёт правую часть только для `null` или `undefined`, но не для `0` или `""`.

**How it works:** Оба оператора — это JavaScript (необязательная цепочка с ES2020). TypeScript сужает тип после проверки и включает `undefined` в тип результата `?.`.

**Examples:**

```typescript
const city = user.address?.city ?? "unknown";
user.greet?.();
```

**See also:** [How to handle optional and `undefined` fields?](#how-to-handle-optional-and-undefined-fields)

**Sources:** [TypeScript 3.7 — optional chaining](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining)

</details>

<details>
  <summary>What are arrow functions in TypeScript?</summary>

### What are arrow functions in TypeScript?

**Definition:** Стрелочные функции — выражения функций JavaScript с лексическим `this`. TypeScript добавляет аннотации параметров и возвращаемого типа.

**How it works:** У них нет собственного `this`, `arguments` и `prototype`, поэтому они плохо подходят как метод или конструктор. Для рекурсии их нельзя назвать, пока имя не привязано к `const` и вызов идёт по этому имени. Аннотации типов стоят перед `=>`.

**Examples:**

```typescript
const add = (x: number, y: number): number => x + y;
```

**See also:** [Functions](./3_js_functions.md) · [Functions](./5_ts_functions.md)

**Sources:** [More on functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

</details>

<details>
  <summary>What are anonymous functions in TypeScript?</summary>

### What are anonymous functions in TypeScript?

**Definition:** Выражение функции или стрелка без имени. TypeScript контекстно типизирует параметры, когда функцию передают в типизированный слот колбэка.

**Examples:**

```typescript
const labels = [1, 2].map((n) => `n=${n}`);
```

Назовите функцию, если важны стек или рекурсия: `function parseRow(row: string) { ... }`.

**Sources:** [More on functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

</details>

<details>
  <summary>How do `for` loops work in TypeScript?</summary>

### How do `for` loops work in TypeScript?

**Definition:** Те же циклы, что в JavaScript: `for`, `for...of`, `for...in` и методы массива. TypeScript типизирует переменную цикла.

**How it works:** `for...of` даёт типы элементов. `for...in` даёт **ключи** (`string` у массивов) — частая ошибка. С `noUncheckedIndexedAccess` тип `arr[i]` — это `T | undefined`.

**Examples:**

```typescript
for (const item of items) {
  item.name;
}
```

**See also:** [Control flow](./3_js_operators.md)

**Sources:** [Iterators and generators](https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html)

</details>

### Functions

<details>
  <summary>How do you type functions, parameters, and return values?</summary>

### How do you type functions, parameters, and return values?

**Definition:** Аннотируйте параметры и, если нужен проверяемый контракт, возвращаемый тип. Тип функции — это `(args) => result`.

**Examples:**

```typescript
type Greeter = (name: string) => string;

function greet(name: string): string {
  return `Hello, ${name}`;
}
```

**How it works:** Если не аннотировать возврат, TypeScript выводит его из операторов `return`. Аннотация ловит случайный возврат `undefined`. `void` значит, что вызывающий должен игнорировать результат.

**See also:** [Functions](./5_ts_functions.md)

**Sources:** [More on functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

</details>

<details>
  <summary>Optional, default, rest parameters, and destructuring?</summary>

### Optional, default, rest parameters, and destructuring?

**Definition:** `?` помечает параметр, который можно не передать. Значение по умолчанию заполняет этот пропуск. Rest-параметр собирает хвост в массив. Деструктуризация типизирует исходный объект, а не каждое локальное имя отдельно.

**Examples:**

```typescript
function page(path: string, size = 20, cursor?: string) {
  return { path, size, cursor };
}

function sum(...nums: number[]) {
  return nums.reduce((a, b) => a + b, 0);
}

function area({ w, h }: { w: number; h: number }) {
  return w * h;
}
```

**How it works:** Необязательные параметры идут после обязательных. Значение по умолчанию делает параметр необязательным на месте вызова. Тип rest — массив или кортеж, если вы его так записали.

**See also:** [Rest, spread, and destructuring](./3_js_variables.md#rest-spread-and-destructuring)

**Sources:** [More on functions](https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters)

</details>

<details>
  <summary>How do function overloads work?</summary>

### How do function overloads work?

**Definition:** Напишите одну или несколько сигнатур вызова, затем одну реализацию, совместимую со всеми. Вызывающие видят только список перегрузок.

**Examples:**

```typescript
function len(value: string): number;
function len(value: unknown[]): number;
function len(value: string | unknown[]): number {
  return value.length;
}
```

**How it works:** Сигнатура реализации скрыта. Порядок важен: TypeScript берёт первую подходящую перегрузку. Если тела одинаковые, лучше параметр-объединение.

**See also:** [Functions](./5_ts_functions.md)

**Sources:** [More on functions — overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads)

</details>

<details>
  <summary>What are `this` types?</summary>

### What are `this` types?

**Definition:** Параметр `this` задаёт тип получателя функции. Возвращаемый тип `this` значит «тип того экземпляра, на котором вызвали метод», и сохраняет цепочку подклассов.

**Examples:**

```typescript
class Box {
  value = 0;
  set(value: number): this {
    this.value = value;
    return this;
  }
}

function onClick(this: HTMLElement) {
  this.id;
}
```

**How it works:** Стрелочные функции игнорируют параметр `this`, потому что своего `this` у них нет.

**Sources:** [More on functions — `this`](https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function) · [Polymorphic `this`](https://www.typescriptlang.org/docs/handbook/2/classes.html#this-types)

</details>

### Narrowing and operators

<details>
  <summary>What are type assertions?</summary>

### What are type assertions?

**Definition:** `value as Type` говорит проверщику считать значение тем типом, который вы утверждаете. Это приведение на этапе компиляции, а не проверка в рантайме.

**How it works:** Используйте, когда вы знаете больше, чем проверщик (узел DOM, только что проверенные данные). Несвязанные типы нельзя превратить друг в друга без `unknown` посередине. В `.tsx` предпочитайте `as`, а не `<Type>value`.

**Examples:**

```typescript
const input = document.querySelector("#name") as HTMLInputElement;
const data = JSON.parse(text) as User; // still unchecked at runtime
```

**See also:** [Assertions](./5_ts_assertions.md) · [How to typify API response, object, array, and function?](#how-to-typify-api-response-object-array-and-function)

**Sources:** [Everyday types — assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)

</details>

<details>
  <summary>What is type narrowing and a type predicate?</summary>

### What is type narrowing and a type predicate?

**Definition:** Сужение — это анализ потока управления: после `typeof`, `instanceof`, `in` или сравнения тип в ветке становится уже. Предикат типа — функция, которая возвращает `value is Type`.

**Examples:**

```typescript
function isUser(value: unknown): value is { name: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string"
  );
}
```

**See also:** [Narrowing](./5_ts_narrowing.md)

**Sources:** [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

</details>

<details>
  <summary>Union vs intersection?</summary>

### Union vs intersection

**Definition:** `A | B` — один из; `A & B` — должен удовлетворить всех. `string & number` невозможно.

| Оператор | Значение          |
| -------- | ----------------- |
| `\|`     | любой тип         |
| `&`      | объединить фигуры |

**Examples:**

```typescript
let id: number | string;
type Person = { name: string } & { age: number };
```

**Sources:** [Союзы](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

</details>

<details>
  <summary>Union and literal types — where are they used?</summary>

### Union and literal types — where are they used?

**Definition:** Союзы (`A | B`) модель «один из»; литеральные типы (`'pending' | 'done'`) ограничиться определенными значениями.

**Where used:**

| Вариант использования        | Пример                                                           |
| ---------------------------- | ---------------------------------------------------------------- |
| Статус API                   | `type Status = 'idle' \| 'loading' \| 'error'`                   |
| Дискриминированные профсоюзы | `{ kind: 'success'; data: T } \| { kind: 'error'; msg: string }` |
| Ключи конфигурации           | `type Theme = 'light' \| 'dark'`                                 |
| Функция ввода перегрузки     | `string \| number` ID                                            |
| `as const` объекты           | Сохраняйте литералы вместо расширения до `string`                |

**Thoughts:** _Лутеральные объединения + дискриминантное поле = безопасно. `switch` с проверкой полноты._

**See also:** [Типы объединений](./5_ts_unions_literals.md#union-types) · [Литеральные типы](./5_ts_unions_literals.md#literal-types) · [Дискриминированные объединения](./5_ts_narrowing.md#discrimination-unions)

</details>

<details>
  <summary>What is a discriminated union?</summary>

### What is a discriminated union?

**Definition:** Объединение объектов с общим литеральным полем (`kind`, `type`, `status`). Проверка этого поля сужает остальной объект.

**How it works:** В `switch` присвойте остаток типу `never`, чтобы новый вариант стал ошибкой компиляции.

**Examples:**

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}
```

**See also:** [Narrowing](./5_ts_narrowing.md) · [Union and literal types](#union-and-literal-types--where-are-they-used)

**Sources:** [Narrowing — discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)

</details>

<details>
  <summary>What do `keyof`, `typeof`, and `in` do?</summary>

### What do `keyof`, `typeof`, and `in` do?

**Definition:** У этих трёх имён разные роли. Два из них существуют и как типы, и как операторы JavaScript.

| Форма                      | Роль                                            |
| -------------------------- | ----------------------------------------------- |
| `keyof User`               | объединение ключей этого типа                   |
| `typeof value` в типе      | тип значения                                    |
| `typeof value` в выражении | строка рантайм-типа JavaScript                  |
| `"name" in value`          | проверка JavaScript; также страж типа           |
| `K in keyof T`             | обход в сопоставленном типе, не цикл в рантайме |

**Examples:**

```typescript
type User = { name: string; age: number };
type Key = keyof User; // "name" | "age"

const user = { name: "Ada" };
type UserValue = typeof user;

function hasName(value: object): value is { name: string } {
  return "name" in value;
}
```

**See also:** [Type manipulation](./5_ts_type_manipulation.md)

**Sources:** [`keyof`](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html) · [`typeof` type operator](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)

</details>

<details>
  <summary>What are indexed access types and index signatures?</summary>

### What are indexed access types and index signatures?

**Definition:** Индексный доступ читает тип свойства: `User["name"]`. Сигнатура индекса описывает открытый набор ключей: `{ [key: string]: number }`.

**Examples:**

```typescript
type User = { name: string; age: number };
type Name = User["name"];

type Scores = { [subject: string]: number };
```

**How it works:** `User[keyof User]` — это `string | number`. Сигнатура индекса требует, чтобы каждое именованное свойство было совместимо с типом значения. Если ключи известны, лучше `Record` или конкретная форма.

**Sources:** [Indexed access types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html) · [Object types — index signatures](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures)

</details>

<details>
  <summary>What is structural typing?</summary>

### What is structural typing?

**Definition:** TypeScript сравнивает типы по членам, а не по объявленному имени. Если у значения есть нужные поля, оно совместимо. В Java и C# номинальная типизация: важно объявленное имя.

**How it works:** Лишние поля допустимы, если значение уже лежит в переменной. Свежий объектный литерал проверяют на лишние свойства. Бренды (`type Id = string & { readonly brand: unique symbol }`) имитируют номинальные идентификаторы.

**Examples:**

```typescript
type Point = { x: number; y: number };
const p: Point = { x: 1, y: 2, z: 3 }; // excess property check
const extra = { x: 1, y: 2, z: 3 };
const ok: Point = extra; // allowed
```

**See also:** [Type compatibility](./5_ts_type_compatibility.md)

**Sources:** [Type compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)

</details>

<details>
  <summary>`interface` vs `type`?</summary>

### `interface` vs `type`

**Definition:** Оба описывают формы объектов и работают с классами (`implements`). Структурная типизация означает, что совместимые фигуры назначаются друг другу независимо от ключевого слова.

**How it works:**

| Особенность                             | `interface`                              | `type`                       |
| --------------------------------------- | ---------------------------------------- | ---------------------------- |
| Форма объекта                           | да                                       | да                           |
| Продлить                                | `extends`                                | пересечение `&`              |
| Декларация о слиянии                    | да — повторяющиеся имена объединяют поля | нет — дубликат = ошибка      |
| Союз `A \| B`                           | нет                                      | да                           |
| Кортеж `[string, number]`               | неловкий                                 | натуральный                  |
| Сопоставленные/условные типы            | ограниченный                             | основной инструмент          |
| Псевдоним примитивов `type ID = string` | нет                                      | да                           |
| `implements` в классе                   | да                                       | да (часто через перекресток) |

**When to use:**

- **`interface`** — контракты общедоступных объектов (DTO, API плагинов), которые вы можете расширить позже (`declare module 'express-serve-static-core'`).
- **`type`** — объединения, распознанные объединения, трубопроводы коммунального типа (`Pick`, `Omit`, `ReturnType`).

**Examples:**

```typescript
// interface — merging (common for augmenting library types)
interface User {
  id: string;
}
interface User {
  email: string;
} // merged

// type — union (impossible with interface alone)
type Result<T> = { ok: true; data: T } | { ok: false; error: string };

// equivalent extension
interface Admin extends User {
  role: "admin";
}
type AdminUser = User & { role: "admin" };
```

**Interview pitfall:** «Что быстрее?» — незначительная разница; выбирайте по выразительности. Не используйте `interface` для типов объединения; не используй `type` когда вам нужно расширение модуля.

**Thoughts:** Для 90% форм объектов подойдет любой вариант — согласованность в кодовой базе важнее, чем ключевое слово.

**Sources:** [Справочник — Различия между псевдонимами типов и интерфейсами] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)

</details>

<details>
  <summary>Can you extend an `interface`?</summary>

### Can you extend an `interface`?

**Definition:** Да - `interface` поддерживает `extends` для наследования и **объединения объявлений** для расширения.

**How it works:**

```typescript
interface User {
  id: string;
}
interface User {
  email: string;
} // merges — User has id + email

interface Admin extends User {
  role: "admin";
}
```

- `extends` — наследовать поля от другого интерфейса или класса.
- Объединение деклараций — дубликат `interface` объединение имен (полезно для расширения модулей).
- `type` использует пересечение (`&`) вместо; никакого слияния.

**Thoughts:** _Использовать `interface` когда вы можете продлить или увеличить; использовать `type` для профсоюзов._

**See also:** [`interface` vs `type`](#интерфейс-против-типа)

</details>

<details>
  <summary>What is declaration merging?</summary>

### What is declaration merging?

**Definition:** Два объявления с одним именем сливаются в одно. Интерфейсы, пространства имён и некоторые другие формы сливаются. Повторный псевдоним `type` — ошибка.

**How it works:** Ещё один `interface User` добавляет поля к `User`. Так библиотеки позволяют дополнять `Window` или экспортированный интерфейс модуля.

**Examples:**

```typescript
interface User {
  id: string;
}
interface User {
  email: string;
}
```

**See also:** [Declaration merging](./5_ts_declaration_merging.md) · [Can you extend an `interface`?](#can-you-extend-an-interface)

**Sources:** [Declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)

</details>

### Classes

<details>
  <summary>How do TypeScript classes differ from JavaScript classes?</summary>

### How do TypeScript classes differ from JavaScript classes?

**Definition:** Синтаксис `class` порождает конструктор и прототип JavaScript. TypeScript добавляет типы параметров, модификаторы видимости, `abstract`, `override`, свойства параметров и `implements`.

**How it works:** Эти добавления стираются или переписываются. `constructor(public name: string)` и объявляет свойство, и присваивает `this.name = name`. Свойство параметра — синтаксис TypeScript, не JavaScript, и `erasableSyntaxOnly` его отвергает.

**Examples:**

```typescript
class Person {
  constructor(public name: string) {}
  greet() {
    return `Hello, ${this.name}`;
  }
}
```

**See also:** [Classes](./5_ts_classes.md) · [OOP in JavaScript](./3_js_oop.md)

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<details>
  <summary>What access modifiers does TypeScript support?</summary>

### What access modifiers does TypeScript support?

**Definition:** `public`, `protected` и `private`. По умолчанию — `public`. Их проверяет только компилятор.

**How it works:** `public` виден везде. `protected` виден в классе и подклассах. `private` виден только в теле этого класса, но в сгенерированном JavaScript это обычное свойство. `#name` — приватное поле ECMAScript, оно есть в рантайме. Член TypeScript `private` всё ещё можно прочитать через приведение или из обычного JavaScript.

**See also:** [Classes](./5_ts_classes.md)

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility)

</details>

<details>
  <summary>Getters, setters, and calling the base constructor?</summary>

### Getters, setters, and calling the base constructor?

**Definition:** `get` и `set` — аксессоры JavaScript. `super(...)` вызывает конструктор базы и должен выполниться до использования `this` в конструкторе наследника.

**Examples:**

```typescript
class Account {
  constructor(protected balance: number) {}
  get amount() {
    return this.balance;
  }
}

class Savings extends Account {
  constructor(balance: number) {
    super(balance);
  }
}
```

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) · [Classes in JavaScript](./3_js_oop.md)

</details>

<details>
  <summary>What is an abstract class, and how does it differ from an interface?</summary>

### What is an abstract class, and how does it differ from an interface?

**Definition:** `abstract class` может содержать реализованные методы и поля, и его нельзя создать через `new`. `interface` — только форма на этапе компиляции: без реализации, без генерации, и класс может реализовать много интерфейсов.

**How it works:** Абстрактный класс — когда подклассы делят настоящий код. Интерфейс — когда нужен только контракт. Класс может `extend` один абстрактный класс и `implements` дополнительные интерфейсы.

**See also:** [`extends` vs `implements`](#extends-vs-implements) · [Classes](./5_ts_classes.md)

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members)

</details>

<details>
  <summary>`extends` vs `implements`?</summary>

### `extends` vs `implements`

**Definition:** `extends` наследует один класс; `implements` удовлетворяет контрактам интерфейса без наследуемого кода.

| `extends`  | `implements`   |
| ---------- | -------------- | ------------------------------ |
| Цель       | класс          | интерфейс(ы)                   |
| Реализация | унаследованный | должны предоставить участникам |

**Sources:** [Классы](https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<details>
  <summary>`readonly` fields and the `override` keyword?</summary>

### `readonly` fields and the `override` keyword?

**Definition:** `readonly` у поля класса разрешает присваивание только в конструкторе (или в объявлении). `override` помечает метод, который заменяет метод базы; опечатка в имени тогда становится ошибкой.

**Examples:**

```typescript
class User {
  constructor(readonly id: string) {}
  label() {
    return this.id;
  }
}

class Admin extends User {
  override label() {
    return `admin:${this.id}`;
  }
}
```

**How it works:** `noImplicitOverride` требует `override` у каждого переопределяемого члена. `readonly` стирается; `Object.freeze` он не вызывает.

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) · [`override`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#override-and-the---noimplicitoverride-flag)

</details>

<details>
  <summary>Can you create a static class in TypeScript?</summary>

### Can you create a static class in TypeScript?

**Definition:** Ключевого слова `static class` нет. Можно повесить `static`-члены на класс или вынести функции в модуль.

**How it works:** Класс только со статическими методами всё ещё можно сконструировать, если конструктор не `private`. Обычная замена — модуль (`export function`). Абстрактному классу всё ещё нужен `new` у подкласса, если нужны экземпляры.

**Examples:**

```typescript
class MathUtil {
  private constructor() {}
  static clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
  }
}
```

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html#static-members)

</details>

<details>
  <summary>What is a singleton class in TypeScript?</summary>

### What is a singleton class in TypeScript?

**Definition:** Приём, который допускает один экземпляр. Это не возможность языка. Спрячьте конструктор и откройте `getInstance()`.

**Examples:**

```typescript
class Config {
  private static instance: Config | undefined;
  private constructor(readonly env: string) {}
  static getInstance() {
    Config.instance ??= new Config("dev");
    return Config.instance;
  }
}
```

**How it works:** Модуль и так выполняется один раз, поэтому `const config = ...` на уровне модуля обычно проще класса-одиночки.

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html#static-members)

</details>

<details>
  <summary>How does inheritance work, and when do you use a class vs an interface?</summary>

### How does inheritance work, and when do you use a class vs an interface?

**Definition:** `extends` копирует реализацию в цепочку прототипов, только один базовый класс. Интерфейс описывает форму и исчезает из генерации.

**When to use:** Класс — когда вы создаёте значения и делите методы. Интерфейс (или `type`) — когда вызывающим нужна только форма, особенно для тестовых двойников и данных из JSON. Когда одного базового класса мало, предпочитайте композицию или примеси.

**See also:** [`extends` vs `implements`](#extends-vs-implements) · [`interface` vs `type`](#interface-vs-type)

**Sources:** [Handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<details>
  <summary>What is a class created inside a function and returned?</summary>

### What is a class created inside a function and returned?

**Definition:** Функция может объявить класс и вернуть его (или вернуть `new`). Класс замыкает параметры функции. Так обычно устроены примеси и фабрики классов.

**Examples:**

```typescript
function createIdModel(prefix: string) {
  return class Model {
    id = `${prefix}-${crypto.randomUUID()}`;
  };
}

const User = createIdModel("user");
const user = new User();
```

**See also:** [What are mixins?](#what-are-mixins)

**Sources:** [Mixins](https://www.typescriptlang.org/docs/handbook/mixins.html)

</details>

<details>
  <summary>What are mixins?</summary>

### What are mixins?

**Definition:** Функция, которая принимает класс и возвращает подкласс с дополнительными членами. В TypeScript и JavaScript один базовый класс, поэтому примеси складывают поведение.

**Examples:**

```typescript
type Constructor<T = object> = new (...args: any[]) => T;

function WithTimestamp<T extends Constructor>(Base: T) {
  return class extends Base {
    createdAt = new Date();
  };
}

class Entity {
  id = 1;
}
class Stamped extends WithTimestamp(Entity) {}
```

**See also:** [Mixins](./5_ts_mixins.md)

**Sources:** [Mixins](https://www.typescriptlang.org/docs/handbook/mixins.html)

</details>

### Modules and tooling

<details>
  <summary>What are modules, and how do import and export work?</summary>

### What are modules, and how do import and export work?

**Definition:** Файл с `import` или `export` верхнего уровня — модуль. Его область видимости — файл, а не глобальная область скрипта.

**Examples:**

```typescript
export function add(a: number, b: number) {
  return a + b;
}
export type { User } from "./user";

import { add } from "./math";
import type { User } from "./user";
```

**How it works:** `import type` стирается и не создаёт рантайм-импорт. `verbatimModuleSyntax` заставляет это разделение. Опция `module` (`nodenext`, `esnext`, `commonjs`) задаёт форму генерации.

**See also:** [Modules](./5_ts_modules.md)

**Sources:** [Modules](https://www.typescriptlang.org/docs/handbook/modules.html)

</details>

<details>
  <summary>What is the difference between namespaces and modules?</summary>

### What is the difference between namespaces and modules?

**Definition:** Пространство имён (`namespace App { ... }`) — глобальный или вложенный объект для группировки имён. Модуль — файл с импортами и экспортами.

**How it works:** Новый код должен использовать модули. Пространства имён остаются для старых кодовых баз и части слияния объявлений (глобальный `namespace Express`). `erasableSyntaxOnly` отвергает `namespace`, потому что он порождает объект в рантайме.

**See also:** [Namespaces](./5_ts_namespaces.md) · [Namespaces and modules](./5_ts_namespaces_modules.md)

**Sources:** [Namespaces](https://www.typescriptlang.org/docs/handbook/namespaces.html) · [Namespaces and modules](https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html)

</details>

<details>
  <summary>What is the difference between internal and external modules?</summary>

### What is the difference between internal and external modules?

**Definition:** Старые имена TypeScript. Внутренний модуль — сегодняшний `namespace`. Внешний модуль — сегодняшний файловый модуль (`import` / `export`).

**How it works:** Раньше ключевое слово `module` объявляло пространства имён. Сейчас для этой формы в документации `namespace`, а «module» — файлы ES или CommonJS. Не начинайте проект на старом разделении.

**See also:** [What is the difference between namespaces and modules?](#what-is-the-difference-between-namespaces-and-modules)

**Sources:** [Namespaces and modules](https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html)

</details>

<details>
  <summary>What are declaration files, `declare`, and `@types`?</summary>

### What are declaration files, `declare`, and `@types`?

**Definition:** Файл `.d.ts` описывает типы для JavaScript, у которого своих типов нет. `declare` вводит значение или модуль, который есть в рантайме, но не реализован в этом файле.

**How it works:** `npm install --save-dev @types/node` берёт декларации сообщества из DefinitelyTyped. Если пакета нет, напишите локальный окружающий модуль:

```typescript
declare module "legacy-widget" {
  export function init(): void;
}

declare const BUILD_ID: string;
```

**See also:** [Modules](./5_ts_modules.md)

**Sources:** [Declaration files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)

</details>

<details>
  <summary>How do you generate `.d.ts` files, source maps, and debug TypeScript?</summary>

### How do you generate `.d.ts` files, source maps, and debug TypeScript?

**Definition:** `declaration` пишет `.d.ts` рядом с генерацией. `sourceMap` пишет `.js.map`, чтобы отладчик сопоставил сгенерированный JavaScript с TypeScript.

**How it works:**

```bash
npx tsc --declaration --emitDeclarationOnly --outDir dist
npx tsc --sourceMap
```

`declaration: true` needs emit (or `emitDeclarationOnly`). Debug in the editor with those maps, or run Node's type stripping / `tsx` so you execute TypeScript without a separate compile. `.map` files are not loaded by the program unless the runtime is told to use them.

**Sources:** [tsconfig — `declaration`](https://www.typescriptlang.org/tsconfig/#declaration) · [`sourceMap`](https://www.typescriptlang.org/tsconfig/#sourceMap)

</details>

<details>
  <summary>Important strict compiler flags?</summary>

### Important strict compiler flags

**Definition:** `strict` позволяет `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`и соответствующие проверки.

| Флаг                       | Эффект                                  |
| -------------------------- | --------------------------------------- |
| `strictNullChecks`         | `null`/`undefined` не везде назначается |
| `noUncheckedIndexedAccess` | Доступ к индексу может быть `undefined` |

**Sources:** [tsconfig](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

</details>

<details>
  <summary>What is `noImplicitAny`?</summary>

### What is `noImplicitAny`?

**Definition:** Сообщать об ошибке, когда TypeScript иначе вывел бы `any`, потому что лучшего типа нет.

**How it works:** Входит в `strict`. Параметр без типа или значение из нетипизированного импорта JavaScript надо аннотировать или дать лучший вывод. Этот флаг не даёт `any` расползтись по мигрирующей кодовой базе.

**Examples:**

```typescript
function greet(name) {
  // error under noImplicitAny: Parameter 'name' implicitly has an 'any' type
  return name;
}
```

**See also:** [Important strict compiler flags?](#important-strict-compiler-flags) · [When is `any` acceptable?](#when-is-any-acceptable)

**Sources:** [`noImplicitAny`](https://www.typescriptlang.org/tsconfig/#noImplicitAny)

</details>

<details>
  <summary>What is `outFile`, and how do you bundle TypeScript files?</summary>

### What is `outFile`, and how do you bundle TypeScript files?

**Definition:** `outFile` склеивает генерацию в один файл JavaScript. Это работает только для значений `module`, которые поддерживают такую склейку (`amd`, `system` или скрипты без модулей). Проекты `nodenext` и `esnext` он не бандлит.

**How it works:** Современные приложения бандлят Vite, webpack, esbuild или другим сборщиком, а типы проверяют через `tsc --noEmit`. Не используйте `outFile` для новой кодовой базы на ES-модулях.

**Sources:** [`outFile`](https://www.typescriptlang.org/tsconfig/#outFile)

</details>

<details>
  <summary>What is the TypeScript language service?</summary>

### What is the TypeScript language service?

**Definition:** API редактора для дополнений, краткой справки, переименования, перехода к определению и диагностик. `tsc` — пакетный компилятор; языковой сервис отвечает на вопросы IDE о той же программе.

**How it works:** VS Code и другие редакторы берут его из версии `typescript` в рабочей области. Он смотрит `tsconfig.json`, чтобы знать, какие файлы входят в проект. Неверный `include` выглядит как «IDE не понимает этот файл».

**Sources:** [TypeScript from scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

</details>

<details>
  <summary>Is JSDoc an alternative to TypeScript?</summary>

### Is JSDoc an alternative to TypeScript?

**Definition:** Комментарии JSDoc могут проверять типы в `.js`, если включены `allowJs` и `checkJs` (или файл начинается с `// @ts-check`). Это способ типизировать JavaScript, а не второй язык.

**How it works:** Тот же проверщик читает `@param`, `@returns` и `/** @type {User} */`. Используйте для постепенной миграции или маленького пакета, который должен остаться `.js`. Переходите на `.ts`, когда аннотаций становится больше, чем кода.

**Sources:** [JSDoc reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)

</details>

<details>
  <summary>How do you migrate a JavaScript project to TypeScript?</summary>

### How do you migrate a JavaScript project to TypeScript?

**Definition:** Включите проверщик рядом с существующим JavaScript, затем переименовывайте файлы по мере типизации.

**How it works:**

1. Добавьте `typescript` и `tsconfig.json` с `allowJs: true`.
2. Включите `checkJs` или `// @ts-check` на нескольких файлах.
3. Включайте `strict`, когда шум станет приемлемым, или сразу ставьте `strict` на новых файлах.
4. Переименовывайте горячие файлы из `.js` в `.ts` и заменяйте `any` настоящими типами.
5. Добавьте `@types/*` или локальный `.d.ts` для зависимостей без типов.
6. Держите `tsc --noEmit` в CI, даже если сборщик транспилирует сам.

**Sources:** [Migrating from JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)

</details>

<details>
  <summary>How do you use TypeScript with Webpack, Vite, or Babel?</summary>

### How do you use TypeScript with Webpack, Vite, or Babel?

**Definition:** Сборщики обычно **транспилируют** TypeScript и снимают типы. Они не заменяют `tsc` для проверки типов.

**How it works:** Vite сам преобразует `.ts` и `.tsx`; отдельный плагин TypeScript только чтобы загрузить эти файлы не нужен. Babel использует `@babel/preset-typescript`: он тоже снимает типы и не проверяет их. Webpack часто использует `ts-loader` или `babel-loader`. Запускайте `tsc --noEmit` (или `vue-tsc` / сборку ссылок проекта) в CI, чтобы ошибки типов ломали сборку.

**See also:** [What happens on build with type errors?](#what-happens-on-build-with-type-errors)

**Sources:** [TypeScript from scratch](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

</details>

<details>
  <summary>How do you configure ESLint with TypeScript?</summary>

### How do you configure ESLint with TypeScript?

**Definition:** Направьте ESLint на `@typescript-eslint/parser`, чтобы он разбирал синтаксис TypeScript, и используйте типизированный плагин для правил, которые базовый ESLint не видит.

**How it works:** Установите `typescript`, `eslint`, `@typescript-eslint/parser` и `typescript-eslint` (пакет плоского конфига). Правила с типами включайте только для файлов из `tsconfig`, потому что они запускают проверщик. Не отключайте `no-explicit-any` глобально, если политика проекта — `strict`; сузьте исключение.

**Sources:** [typescript-eslint — getting started](https://typescript-eslint.io/getting-started/)

</details>

### Advanced types

<details>
  <summary>What are generics, and how do you write a generic function?</summary>

### What are generics, and how do you write a generic function?

**Definition:** Дженерик вводит параметр типа, чтобы одна реализация оставалась точной для многих типов. Вызывающий задаёт параметр, или TypeScript выводит его.

**Examples:**

```typescript
function identity<T>(value: T): T {
  return value;
}

const name = identity("Ada"); // string
const n = identity(1); // number

class Box<T> {
  constructor(public value: T) {}
}
```

**How it works:** Без `<T>` функция `identity` вернула бы `any` или широкое объединение. Массивы, `Promise` и `Map` — обобщённые типы.

**See also:** [Type manipulation](./5_ts_type_manipulation.md)

**Sources:** [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

</details>

<details>
  <summary>What are generic constraints?</summary>

### What are generic constraints?

**Definition:** `T extends SomeType` ограничивает, что можно передать, и что можно делать с `T` внутри функции.

**Examples:**

```typescript
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

pluck({ name: "Ada" }, "name");
// pluck({ name: "Ada" }, "age"); // error
```

**How it works:** Ограничение — это тип, часто `keyof T` или форма объекта. Это не проверка в рантайме.

**Sources:** [Generics — constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)

</details>

<details>
  <summary>What are utility types?</summary>

### What are utility types?

**Definition:** Встроенные обобщённые типы, которые преобразуют другой тип: `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Exclude`, `Extract`, `Record`, `ReturnType`, `Parameters` и другие.

**How it works:** Они написаны сопоставленными и условными типами. Их можно реализовать заново; на собеседовании ждут, что вы узнаете встроенные.

**See also:** [Utility types](./5_ts_utility_types.md)

**Sources:** [Utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

</details>

<details>
  <summary>What is `Partial`?</summary>

### What is `Partial`?

**Definition:** `Partial<T>` делает каждое свойство `T` необязательным. Так типизируют патч, черновик формы или «сделать все поля необязательными».

**Examples:**

```typescript
type User = { name: string; email: string };
type UserPatch = Partial<User>;
// { name?: string; email?: string }
```

**How it works:** Это `{ [K in keyof T]?: T[K] }`. Глубина — один уровень. Вложенные объекты остаются обязательными, пока не написать глубокий вариант.

**Sources:** [Utility types — `Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)

</details>

<details>
  <summary>What is `Required`?</summary>

### What is `Required`?

**Definition:** `Required<T>` снимает `?` с каждого свойства, противоположность `Partial`.

**Examples:**

```typescript
type Draft = { title?: string };
type Saved = Required<Draft>; // { title: string }
```

**Sources:** [Utility types — `Required`](https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype)

</details>

<details>
  <summary>What is `Readonly`?</summary>

### What is `Readonly`?

**Definition:** `Readonly<T>` помечает каждое свойство `readonly`. Это типовой аналог неглубокой заморозки.

**How it works:** Это не модификатор `readonly` на одном поле и не `const`, который защищает только привязку. `Readonly` не спускается во вложенные объекты.

**Sources:** [Utility types — `Readonly`](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)

</details>

<details>
  <summary>What is `Record`?</summary>

### What is `Record`?

**Definition:** `Record<K, V>` — тип объекта, у которого ключи — `K`, а значения — `V`.

**Examples:**

```typescript
type Page = "home" | "about";
type Titles = Record<Page, string>;
// { home: string; about: string }
```

**How it works:** `K` должен быть типом ключа (`string`, `number`, `symbol` или объединение литералов). Для карты, где ключи можно опустить, используйте `Partial<Record<K, V>>`.

**Sources:** [Utility types — `Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)

</details>

<details>
  <summary>What is the difference between `Pick` and `Omit`?</summary>

### What is the difference between `Pick` and `Omit`?

**Definition:** Оба строят новый тип объекта из существующего. `Pick<T, K>` оставляет ключи из `K`. `Omit<T, K>` их удаляет.

**Examples:**

```typescript
type User = { name: string; email: string; age: number };
type Preview = Pick<User, "name" | "age">;
type PublicUser = Omit<User, "email">;
```

**How it works:** Для `Pick` тип `K` должен быть `keyof T`. `Omit` — обычный способ взять подмножество, отбросив поля. `Exclude` — аналог для объединений, не для объектов.

**See also:** [What is `Exclude`?](#what-is-exclude) · [Utility types](./5_ts_utility_types.md)

**Sources:** [Utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

</details>

<details>
  <summary>What is `Exclude`?</summary>

### What is `Exclude`?

**Definition:** `Exclude<T, U>` удаляет из объединения `T` каждый член, совместимый с `U`.

**Examples:**

```typescript
type Letters = "a" | "b" | "c";
type WithoutC = Exclude<Letters, "c">; // "a" | "b"
```

**How it works:** Работает с объединениями. `Omit` работает с ключами объекта. `Extract<T, U>` оставляет члены, которые совпали.

**Sources:** [Utility types — `Exclude`](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludetype-excludedunion)

</details>

<details>
  <summary>What are conditional types?</summary>

### What are conditional types?

**Definition:** `T extends U ? X : Y` выбирает тип по совместимости. Если `T` — голый параметр типа, проверка распределяется по объединению.

**Examples:**

```typescript
type IsString<T> = T extends string ? true : false;
type A = IsString<"hi">; // true
type B = IsString<number>; // false
```

**See also:** [Type manipulation](./5_ts_type_manipulation.md)

**Sources:** [Conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

</details>

<details>
  <summary>What are mapped types?</summary>

### What are mapped types?

**Definition:** Сопоставленный тип обходит ключи и строит новый тип объекта: `{ [K in keyof T]: ... }`.

**Examples:**

```typescript
type Flags<T> = { [K in keyof T]: boolean };
type UserFlags = Flags<{ name: string; admin: boolean }>;
// { name: boolean; admin: boolean }
```

**How it works:** Модификаторы `readonly` и `?` можно добавить или снять (`-?`). `Partial`, `Required` и `Readonly` — сопоставленные типы.

**Sources:** [Mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)

</details>

<details>
  <summary>What is `infer`?</summary>

### What is `infer`?

**Definition:** Внутри условного типа `infer Name` захватывает тип из подходящей позиции. Так написаны `ReturnType` и `Parameters`.

**Examples:**

```typescript
type GetReturn<T> = T extends (...args: never[]) => infer R ? R : never;

type R = GetReturn<(a: string) => number>; // number
```

**How it works:** `infer` допустим только в ветке `extends` условного типа. Его можно ограничить (`infer R extends string`).

**See also:** [Type manipulation](./5_ts_type_manipulation.md)

**Sources:** [Conditional types — `infer`](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)

</details>

<details>
  <summary>What are template literal types?</summary>

### What are template literal types?

**Definition:** Тот же синтаксис, что у шаблонных строк, но в позиции типа. Они строят объединения строк и разбирают шаблоны строк.

**Examples:**

```typescript
type EventName<T extends string> = `${T}Changed`;
type UserEvent = EventName<"name" | "age">;
// "nameChanged" | "ageChanged"
```

**How it works:** Они распределяются по объединениям. Вместе с `infer` могут разрезать строковый тип, например `` `${string}-${string}` ``.

**Sources:** [Template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)

</details>

<details>
  <summary>What do `satisfies` and `as const` do?</summary>

### What do `satisfies` and `as const` do?

**Definition:** `as const` просит самый узкий литеральный и readonly-тип. `satisfies Type` проверяет, что значение подходит под `Type`, и **сохраняет** выведенный узкий тип.

**How it works:** `as Type` навязывает тип и может спрятать ошибку. `satisfies` ломает компиляцию, если значение не подходит, а у каждого свойства остаётся литеральный тип.

**Examples:**

```typescript
const routes = {
  home: "/",
  about: "/about",
} as const;

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
} satisfies Record<string, string | number[]>;
```

**See also:** [Assertions](./5_ts_assertions.md)

**Sources:** [`satisfies`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator) · [`const` assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)

</details>

<details>
  <summary>What is function type variance?</summary>

### What is function type variance?

**Definition:** Когда один тип функции совместим с другим, возвращаемые типы ковариантны, а при `strictFunctionTypes` типы параметров контравариантны.

**How it works:** Функцию с более конкретным возвратом можно использовать там, где ждут более широкий возврат. Функцию с **более широким** параметром можно использовать там, где ждут более узкий параметр: она справится с каждым значением, которое передаст вызывающий. Синтаксис метода (`method(x: Dog)`) остаётся бивариантным, чтобы обычные классовые приёмы компилировались; это менее безопасно.

**See also:** [Type compatibility](./5_ts_type_compatibility.md)

**Sources:** [`strictFunctionTypes`](https://www.typescriptlang.org/tsconfig/#strictFunctionTypes)

</details>

<details>
  <summary>What is module augmentation?</summary>

### What is module augmentation?

**Definition:** Добавление объявлений к существующему модулю из другого файла через `declare module "name" { ... }`. Опирается на слияние объявлений.

**Examples:**

```typescript
import "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}
```

**How it works:** В интерфейсы этого модуля можно добавлять члены. Псевдоним `type` так заменить нельзя. Дополняемый модуль должен быть модулем (в нём есть import или export).

**See also:** [What is declaration merging?](#what-is-declaration-merging)

**Sources:** [Declaration merging — module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)

</details>

<details>
  <summary>What are decorators?</summary>

### What are decorators?

**Definition:** Декоратор — функция, которую применяют через `@` к классу, методу, аксессору, свойству или параметру. TypeScript 5.0 следует стандартным декораторам стадии 3. Старая экспериментальная форма всё ещё доступна с `experimentalDecorators`.

**How it works:** Стандартные декораторы получают декорируемое значение (и контекст) и могут заменить его. Они выполняются при определении класса, а не при каждом вызове, если только замена не оборачивает метод. У старых декораторов другая сигнатура (`target`, `propertyKey`, `descriptor`). Не смешивайте два режима в одном проекте.

**Examples:**

```typescript
function logged<This, Args extends unknown[], R>(
  original: (this: This, ...args: Args) => R,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => R>,
) {
  return function (this: This, ...args: Args): R {
    console.log(String(context.name));
    return original.apply(this, args);
  };
}

class Greeter {
  @logged
  greet() {
    return "hi";
  }
}
```

**See also:** [Decorators](./5_ts_decorators.md)

**Sources:** [Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)

</details>

<details>
  <summary>Which collections can you type in TypeScript?</summary>

### Which collections can you type in TypeScript?

**Definition:** TypeScript не добавляет свои виды коллекций. Он типизирует коллекции JavaScript.

| Значение              | Тип                                                         |
| --------------------- | ----------------------------------------------------------- |
| список                | `T[]`, `Array<T>`, `ReadonlyArray<T>`                       |
| фиксированные позиции | кортеж `[string, number]`                                   |
| ключ-значение         | `Map<K, V>`, `Record<K, V>`                                 |
| уникальные значения   | `Set<T>`                                                    |
| слабые ссылки         | `WeakMap<object, V>`, `WeakSet<object>`                     |
| именованные константы | объединение строк или `enum`, если вас устраивает генерация |

**See also:** [Map & Set](./3_js_variables.md#map--set--weakmap--weakset) · [Arrays](./5_ts_arrays.md)

**Sources:** [Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>

### React and Node

<details>
  <summary>How do you type React props and state?</summary>

### How do you type React props and state?

**Definition:** Пропсы — тип объекта у параметра функции. Состояние — аргумент типа `useState` либо выводится из начального значения.

**Examples:**

```tsx
type Props = { title: string; count?: number };

function Header({ title, count = 0 }: Props) {
  return (
    <h1>
      {title} ({count})
    </h1>
  );
}
```

**How it works:** Для пропсов подходят и `type`, и `interface`. `interface` — если ждёте слияние объявлений; `type` — для объединений. Не берите `React.FC` по умолчанию: он оборачивает тип возврата, раньше подразумевал `children` и усложняет дженерики. `children`, если нужны, — явное свойство (`children: React.ReactNode`).

**See also:** [JSX](./5_ts_jsx.md#jsx) · [React hooks](./4_react_hooks.md)

**Sources:** [React — using TypeScript](https://react.dev/learn/typescript)

</details>

<details>
  <summary>How do you type React hooks?</summary>

### How do you type React hooks?

**Definition:** Передавайте аргумент типа, когда начальное значение не несёт полный тип, особенно `null`.

**Examples:**

```tsx
const [user, setUser] = useState<User | null>(null);

function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((value) => !value);
  return [on, toggle] as const;
}
```

**How it works:** `useRef<HTMLInputElement>(null)` типизирует узел DOM. `useReducer` выводит тип из редюсера, если действие — размеченное объединение. Свои хуки — обычные функции: аннотируйте аргументы и возвращайте кортеж с `as const`, чтобы вызывающие не получили расширенный массив.

**See also:** [React hooks](./4_react_hooks.md)

**Sources:** [React — using TypeScript](https://react.dev/learn/typescript)

</details>

<details>
  <summary>What is the difference between `JSX.Element` and `React.ReactNode`?</summary>

### What is the difference between `JSX.Element` and `React.ReactNode`?

**Definition:** `JSX.Element` (и `React.ReactElement`) — объект, который возвращает `React.createElement`. `React.ReactNode` — всё, что React умеет отрисовать: элементы, строки, числа, фрагменты, порталы, `null`, `undefined` и массивы из этого.

**How it works:** Тип возврата компонента обычно выводится; его редко аннотируют. Свойство `children` должно быть `React.ReactNode`, потому что вызывающие передают текст и фрагменты, а не только элементы. `JSX.Element` отвергает тип строкового потомка.

**See also:** [JSX](./5_ts_jsx.md#jsx)

**Sources:** [React — using TypeScript](https://react.dev/learn/typescript)

</details>

<details>
  <summary>How do you type reusable components?</summary>

### How do you type reusable components?

**Definition:** Сделайте компонент обобщённым, если он должен сохранить тип элемента вызывающего, так же как `Array<T>` сохраняет тип элемента.

**Examples:**

```tsx
type ListProps<T> = {
  items: readonly T[];
  getKey: (item: T) => string;
  render: (item: T) => React.ReactNode;
};

function List<T>({ items, getKey, render }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{render(item)}</li>
      ))}
    </ul>
  );
}
```

**How it works:** Ставьте `<T>` на функцию, а не на `React.FC`. Ограничивайте `T`, когда компонент читает поле (`T extends { id: string }`).

**See also:** [What are generics, and how do you write a generic function?](#what-are-generics-and-how-do-you-write-a-generic-function)

**Sources:** [React — using TypeScript](https://react.dev/learn/typescript) · [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

</details>

<details>
  <summary>How do you use TypeScript with Node.js and Express?</summary>

### How do you use TypeScript with Node.js and Express?

**Definition:** Типизируйте процесс так же, как любую другую программу на TypeScript, а Express — через `@types/express` (у Express 5 могут быть свои типы; берите типы под установленный мажор).

**Examples:**

```typescript
import express, { type Request, type Response } from "express";

const app = express();

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});
```

**How it works:** Установите `@types/node` для `process`, `Buffer` и глобалов. `req.body` остаётся `any`, пока вы не разберёте JSON и не проверите его. Не останавливайтесь на `req.body as User`.

**See also:** [Express overview](./8_nodejs_http.md#express-overview) · [How to typify API response, object, array, and function?](#how-to-typify-api-response-object-array-and-function)

**Sources:** [Handbook — modules](https://www.typescriptlang.org/docs/handbook/modules.html)

</details>

<details>
  <summary>Error handling — static vs runtime?</summary>

### Error handling — static vs runtime

**Definition:** TypeScript обнаруживает ошибки формы во время компиляции; время выполнения все еще нужно `try/catch` и проверка схемы для внешних данных.

| Слой             | Оснастка              |
| ---------------- | --------------------- |
| Время компиляции | `tsc`, IDE            |
| Время выполнения | `try/catch`, Зод/ио-ц |

**Examples:**

```typescript
function parseAge(input: string): number {
  const n = Number(input);
  if (Number.isNaN(n)) throw new Error("Invalid age");
  return n;
}
```

**Sources:** [Повседневные типы](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>

<details>
  <summary>How to typify API response, object, array, and function?</summary>

### How to typify API response, object, array, and function?

**Definition:** Формы модели на границах; проверять внешние данные во время выполнения, поскольку типы TS удаляются.

**API response:**

```typescript
type User = { id: string; name: string };
type ApiResponse<T> = { data: T; meta: { page: number } };

async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  const json: unknown = await res.json();
  // validate with Zod in production
  return json as User;
}
```

**Object (product):**

```typescript
type Product = {
  id: string;
  name: string;
  price: number;
  category: "food" | "electronics";
};
```

**Array of objects:**

```typescript
const products: Product[] = await res.json();
// or ReadonlyArray<Product> for immutability
```

**Function with return object:**

```typescript
type CartSummary = { subtotal: number; discount: number; total: number };

function calculateCart(items: CartItem[]): CartSummary {
  return items.reduce(/* ... */, { subtotal: 0, discount: 0, total: 0 });
}
```

**Thoughts:** _Типы описывают намерение; Zod/io-ts проверяет реальность на границе сети._

</details>

---

## Coding tasks

<details>
<summary>Task 1 — Fix AddressWithIdType intersection</summary>

`AddressType` задаёт `city: string`. Пересечение с `{ city: { id: string } }` даёт невозможный тип (`string & { id: string }`). `AddressType` и `address` не меняйте; исправьте только `AddressWithIdType`.

```typescript
type AddressType = {
  country: string;
  city: string;
};

type AddressWithIdType = AddressType & {
  city: {
    id: string;
    value?: string;
  };
};

const address: AddressWithIdType = {
  country: "Australia",
  city: {
    id: "bd2917ff-08ac-4e0a-a4d6-6185cd6e69c4",
  },
};
```

<details>
  <summary>Solution hint</summary>

### Solution hint

Используйте `Omit`, чтобы убрать конфликтующий ключ перед пересечением:

```typescript
type AddressWithIdType = Omit<AddressType, "city"> & {
  city: {
    id: string;
    value?: string;
  };
};
```

</details>

</details>

---

<details>
<summary>Task 2 — Exclude a union member</summary>

Реализуйте `RemoveC<T>`, чтобы `RemoveC<"a" | "b" | "c">` стал `"a" | "b"`.

```typescript
type Letters = "a" | "b" | "c";

type RemoveC<T> = unknown; // your implementation

type LettersWithoutC = RemoveC<Letters>;

declare function testFunction(option: "a" | "b");

const validConst1: LettersWithoutC = "a";
const validConst2: LettersWithoutC = "b";
const invalidConst1: LettersWithoutC = "c"; // should error
```

<details>
  <summary>Solution</summary>

```typescript
type RemoveC<T> = Exclude<T, "c">;
// or: T extends "c" ? never : T
```

</details>

</details>

---

<details>
<summary>Task 3 — Implement MyPick</summary>

Реализуйте `MyPick<T, K>` как встроенный `Pick`.

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyPick<Todo, "title" | "completed">;
// { title: string; completed: boolean }

const preview: TodoPreview = { title: "Learn TS", completed: false };
```

<details>
  <summary>Solution</summary>

```typescript
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

</details>

</details>

---

<details>
<summary>Task 4 — Implement GetReturnType</summary>

Без встроенной утилиты:

```typescript
type MyReturn<T> = unknown; // your implementation

declare const fn: (a: number, b: string) => boolean;
type R = MyReturn<typeof fn>; // should be boolean
```

<details>
  <summary>Solution</summary>

```typescript
type MyReturn<T> = T extends (...args: never[]) => infer R ? R : never;
```

</details>

</details>

---

<details>
<summary>Task 5 — Implement DeepReadonly</summary>

Сделайте каждое свойство (включая вложенные объекты) доступным только для чтения.

```typescript
interface X {
  a: number;
  b: { c: string };
}

type RX = DeepReadonly<X>;
// { readonly a: number; readonly b: { readonly c: string } }

declare const x: RX;
// x.b.c = "no"; // should error
```

<details>
  <summary>Solution</summary>

```typescript
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
```

</details>

</details>

---

<details>
<summary>Task 6 — Implement Flatten</summary>

Снимите один уровень массива: `Flatten<string[][]>` → `string[]`.

```typescript
type Flatten<T> = unknown; // your implementation

type A = Flatten<string[]>; // string
type B = Flatten<number[][]>; // number[]
type C = Flatten<boolean>; // boolean
```

<details>
  <summary>Solution</summary>

```typescript
type Flatten<T> = T extends (infer U)[] ? U : T;
```

</details>

</details>

---

<details>
<summary>Task 7 — Implement Parameters</summary>

Извлеките типы параметров функции как кортеж.

```typescript
type MyParameters<T> = unknown;

declare function join(a: string, b: number): boolean;
type P = MyParameters<typeof join>; // [string, number]
```

<details>
  <summary>Solution</summary>

```typescript
type MyParameters<T> = T extends (...args: infer P) => unknown ? P : never;
```

</details>

</details>

---

<details>
<summary>Task 8 — Cart aggregation (typed)</summary>

Полностью типизированный расчёт корзины — зеркало [задачи 16 в 3_js_array.md](./3_js_array.md#interview-practice).

```typescript
type ProductCategory = "food" | "electronics" | "clothing";

type Product = {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
};

type CartItem = { product: Product; qty: number };

type CartSummary = { subtotal: number; discount: number; total: number };

type Discounts = Partial<Record<ProductCategory, number>>;

function calculateCart(
  items: CartItem[],
  discounts: Discounts = {},
): CartSummary {
  return items.reduce<CartSummary>(
    (acc, { product, qty }) => {
      const lineSubtotal = product.price * qty;
      const rate = discounts[product.category] ?? 0;
      const lineDiscount = lineSubtotal * rate;
      acc.subtotal += lineSubtotal;
      acc.discount += lineDiscount;
      acc.total += lineSubtotal - lineDiscount;
      return acc;
    },
    { subtotal: 0, discount: 0, total: 0 },
  );
}
```

**Thoughts:**

- Литеральное объединение `ProductCategory` — поиск скидки типобезопасен.
- `Partial<Record<...>>` — скидка нужна не каждой категории.
- Возвращаемый тип `CartSummary` документирует контракт.
- Размеченные варианты (например `DigitalProduct | PhysicalProduct`) расширяют это полем `kind` и сужением.

<details>
  <summary>Variant with discriminated product types</summary>

```typescript
type BaseProduct = { id: string; name: string; price: number };

type FoodProduct = BaseProduct & { kind: "food"; expiryDays: number };
type ElectronicsProduct = BaseProduct & {
  kind: "electronics";
  warrantyMonths: number;
};
type ClothingProduct = BaseProduct & { kind: "clothing"; size: string };

type Product = FoodProduct | ElectronicsProduct | ClothingProduct;

// Narrow in reduce:
function getDiscountRate(product: Product, discounts: Discounts): number {
  return discounts[product.kind] ?? 0;
}
```

</details>

</details>

---

## Quick oral questions (self-check)

<details>
<summary>Quick oral questions (self-check)</summary>

**Definition:** Пятнадцать вопросов для самопроверки по основным темам собеседования TypeScript; ответы в блоке ниже.

**Sources:** [Справочник TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

1. В чём разница между `any` и `unknown`?
2. Когда выбрать `interface`, а не `type`?
3. Что меняет `strictNullChecks`?
4. Чем структурная типизация отличается от номинальной?
5. Что такое размеченное объединение и зачем с ним `never`?
6. Что стирается при компиляции — есть ли модификаторы доступа в рантайме?
7. `Exclude` и `Omit` — с чем работает каждый?
8. Когда нужен `as const`?
9. Что делает `satisfies` такого, чего не делает `as`?
10. Когда выбрать карту вместо объединения?
11. Чем компилятор отличается от транспилятора в контексте `tsc`?
12. Что такое слияние объявлений у интерфейсов?
13. Когда использовать `extends`, а когда `implements`?
14. Что такое примеси и зачем они вместо множественного наследования?
15. Что запрещает `erasableSyntaxOnly` и зачем его включать?

<details>
  <summary>Answers</summary>

### Answers

1. **`any` и `unknown`** — Оба принимают любое значение. `any` отключает проверку: можно вызывать методы и присваивать куда угодно без сужения. `unknown` — безопасный верхний тип: перед использованием нужно сузить (`typeof`, `in` и т.д.) или утвердить тип. Для внешних данных предпочитайте `unknown`.

2. **`interface` вместо `type`** — Формы объектов, которые можно расширять или дополнять; слияние объявлений (например, глобалы). `type` — для объединений, кортежей, примитивов, сопоставленных и условных типов. Они **не** одинаковы.

3. **`strictNullChecks`** — `null` и `undefined` больше нельзя присвоить любому типу. Нужны необязательная цепочка и явные проверки. Ловит ошибки «забыли обработать null». Без флага null тихо проходит везде.

4. **Структурная и номинальная** — В TS типизация **структурная**: совместимость по форме, не по имени. Два типа с теми же полями взаимозаменяемы. В Java/C# типизация **номинальная**: важно имя класса. Бренды имитируют номинальные идентификаторы в TS.

5. **Размеченное объединение и `never`** — Объекты делят литеральное поле (`kind`, `type`), и TS сужает тип в `switch`. Присваивание объединения типу `never` в `default` требует исчерпываемости: новый вариант без ветки — ошибка компиляции.

6. **Стирается при компиляции** — Аннотации, интерфейсы, дженерики и `private`/`protected` (только TS) стираются. **Нет** информации о типах в рантайме. Поля `#private` ECMAScript **есть** в рантайме. `public`/`private` в классах TS — только компиляция, если не использовать `#`.

7. **`Exclude` и `Omit`** — `Exclude<T, U>` работает с **объединениями** (убирает члены, совместимые с `U`). `Omit<T, K>` работает с **типами объектов** (убирает ключи `K` из `T`). Разный вход, разная задача.

8. **`as const`** — Когда нужны **литеральные типы**, а не расширенные примитивы (`"GET"`, а не `string`, readonly-кортеж, замороженный конфиг). Чинит вывод у литералов объектов и массивов. Замена ручному объединению литералов.

9. **`satisfies` и `as`** — `satisfies Type` **проверяет**, что значение подходит под тип, и **сохраняет** узкий вывод (кортеж остаётся кортежем). `as Type` **навязывает** тип и **расширяет** вывод — это доверие, а не проверка.

10. **Карта вместо объединения** — Карта нужна, когда у каждого варианта свои поля или поведение по дискриминанту. Так не раздувается объединение несовместимых форм. Приём: `{ [K in Status]: Handler }[status]` вместо `A | B | C` с несвязанными полями.

11. **Компилятор и транспилятор (`tsc`)** — **Компилятор**: проверка типов. **Транспилятор**: TS → JS (с высокого уровня на высокий). `tsc` делает оба шага. В рантайме не работает ни тот ни другой — на выходе обычный JS.

12. **Слияние объявлений** — Несколько блоков `interface Foo { ... }` с **одним именем** сливаются в один интерфейс (поля складываются). Работает с `interface`, не с `type`. Часто дополняют `Window` и типы модулей.

13. **`extends` и `implements`** — `extends`: класс наследует **один** базовый класс (реализация и цепочка прототипов). `implements`: класс обещает выполнить **один или несколько** контрактов интерфейса (только сигнатуры, без унаследованного кода).

14. **Примеси** — Функции, которые принимают класс и возвращают расширенный класс. Складывают поведение без множественного наследования (его нет в TS/JS). Стек: `class User extends WithId(WithTimestamp(Entity))`.

15. **`erasableSyntaxOnly`** — Флаг TS 5.8+: ошибка на синтаксис, который порождает рантайм-JS, придуманный TypeScript (свойства параметров конструктора, `enum`, `namespace`). Рантаймы и съёмщики типов (`tsc --noEmit`, съём типов в Node) тогда видят только стираемые типы. Пишите `this.x = x`, а не `constructor(public x: number)`.

</details>

</details>

---

## Oral questions (ITVDN — TypeScript)

<details>
<summary>Oral questions (ITVDN — TypeScript)</summary>

**Definition:** Устные вопросы для самопроверки из курса TypeScript на ITVDN.

**Sources:** [Справочник TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

79. Какие преимущества даёт типизация в TypeScript?

80. Какие средства TypeScript можно использовать для типизации (интерфейсы, типы, enum и т.д.)?

81. Чем интерфейс отличается от класса?

82. Чем интерфейс отличается от абстрактного класса?

83. Чем интерфейс отличается от типа?

</details>

---

## Oral questions (extra)

<details>
<summary>Oral questions (extra)</summary>

**Definition:** Дополнительные устные вопросы про флаги компилятора и модули.

1. Что `noUncheckedIndexedAccess` меняет у `arr[i]`?
2. Когда использовать `import type`, а когда `import`?
3. Как ссылки проектов ускоряют сборку монорепозитория?
4. Почему `as User` на `res.json()` небезопасно в проде?
5. Чем ковариантные параметры функции отличаются от контравариантных?
6. Когда полезен `const` у параметра типа?
7. Что включает `composite: true` в `tsconfig`?

<details>
  <summary>Answers</summary>

### Answers

1. **`noUncheckedIndexedAccess`** — Доступ по индексу возвращает `T | undefined`, а не `T`. `arr[i]` и `obj[key]` могут быть за границей или отсутствовать — перед использованием нужно сузить или поставить `??`. Безопаснее, но шумнее на старом коде.

2. **`import type` и `import`** — `import type` / `export type` **стираются** при генерации — рантайм-импорта нет. Для символов, которые только типы. Импорт значения (`import { fn }`) остаётся в рантайме. `verbatimModuleSyntax` требует это разделение и не даёт сборщику затащить модуль только ради типов.

3. **Ссылки проектов** — Делят монорепозиторий на **composite**-проекты с `references`. `tsc --build` проверяет типы и генерирует **инкрементально** — пересобираются только изменившиеся проекты. Зависимости собираются по порядку. CI быстрее, чем один огромный `tsc`.

4. **`as User` на `res.json()`** — Утверждение **только на этапе компиляции**, проверки в рантайме нет. API может вернуть любую форму JSON; неверные данные падают в рантайме. На границе используйте `unknown` и проверку схемой (Zod и т.п.).

5. **Ковариантность и контравариантность** — **Возвращаемые типы** ковариантны: более узкий возврат можно подставить. **Типы параметров** контравариантны (с `strictFunctionTypes`): функцию с **более широким** входом можно поставить туда, где ждут **более узкий** вход. Методы по умолчанию бивариантны (нестрого, но удобно).

6. **`const` у параметра типа** — Сохраняет **литеральный** вывод в дженериках: `routes<const T>(["/a", "/b"])` — кортеж литералов, а не `string[]`. Полезно для конфигов, маршрутов и API, где расширение теряет точность.

7. **`composite: true`** — Помечает проект как часть графа **ссылок проектов**. Требует `declaration: true`. Включает инкрементальную сборку и позволяет другим проектам ссылаться на этот. Нужен для `tsc --build` в монорепозитории.

</details>

</details>
