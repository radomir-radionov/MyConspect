# TypeScript — Type System

Type compatibility, inference, and variable declarations.

[← Назад к хабу](./5_ts.md)

### Related docs

* [TypeScript — hub](./5_ts.md) · [Интервью](./5_ts_interview.md)

### Sections

- [Type Compatibility](#type-compatibility)
- [Type Inference](#type-inference)
- [Variable Declaration](#variable-declaration)
- [Advanced topics](#advanced-topics)

---

## Type Compatibility

<details>
  <summary>Type Compatibility</summary>

### Type Compatibility

**Definition:**

Правила присвоения типа А типу Б — структурные, а не номинальные.

| Когда использовать | Заметки |
|-------------|-------|
| Дополнительные свойства разрешены для переменных, передаваемых в функции; лишние проверки новых литералов. См. таблицу назначаемости. | TS намеренно **неправильно** местами — дополнительные свойства переменных допустимы при передаче в функцию, но **нет** в объектных литералах, назначенных типизированной переменной. |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Core rules

**Definition:**

// let bad: Pet = { name: "Лесси", владелец: "Радд" }; // Ошибка — проверка лишнего свойства

|

**How it works:**

параметры по умолчанию проверяются **двувариантно** (необоснованно) — вы можете назначить `(a: number) => void` to `(b: number, s: string) => void`. Давать возможность `strictFunctionTypes` исправить сигнатуры, не являющиеся методами.

исходный возврат должен быть **подтипом** целевого возврата.

сравниваются только элементы **экземпляра**; статический/конструктор игнорируется. Для совместимости **частные/защищенные** члены должны происходить из **того же** класса.

`Empty<number>` и `Empty<string>` совместимо, если `T` неиспользованный в конструкции; `NotEmpty<number>` vs `NotEmpty<string>` - ошибка.

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // let bad: Pet = { name: "Lassie", owner: "Rudd" }; // Error — excess property check
```

```typescript
interface Pet { name: string; }
let dog = { name: "Lassie", owner: "Rudd" };
let pet: Pet = dog; // OK — extra 'owner' is fine

// let bad: Pet = { name: "Lassie", owner: "Rudd" }; // Error — excess property check
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Assignability table (summary)

**Definition:**

Таблица назначаемости (сводка) — язык TypeScript или функция компилятора.

|        | любой | неизвестный | объект | пустота | неопределенный | ноль | никогда |
|--------|-----|---------|--------|------|-----------|------|-------|
| → любой | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* | ✕ |
| → неизвестно | ✓ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ || никогда → | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

*`strictNullChecks` выключить изменения `null`/`undefined` поведение значительно.

**неизвестно** ≈ противоположность **никогда**: все, что можно назначить `unknown`; `unknown` присваивается только `any` (и себя).
---

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)



</details>

## Type Inference

<details>
  <summary>Type Inference</summary>

### Type Inference

**Definition:**

Как TS выводит типы, когда вы опускаете аннотации.

| Когда использовать | Заметки |
|-------------|-------|
| Пусть сначала сработает умозаключение; аннотировать на границах API. Контекстная типизация заполняет типы параметров обратного вызова. | Вывод выбирает **наилучший общий тип** из кандидатов — если ни одного супертипа не существует, вы получаете **объединение** (`Rhino \| Elephant \| Snake`) вместо `Animal[]` если вы не комментируете или не предоставляете контекст. |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Best common type

**Definition:**

Лучший распространенный тип — язык TypeScript или функция компилятора.

| Аспект | Деталь |
|--------|--------|
| Резюме | Лучший распространенный тип — язык TypeScript или функция компилятора. |

**Examples:**

```typescript
let x = 3;                    // number
let arr = [0, 1, null];       // (number | null)[]

let zoo = [new Rhino(), new Elephant(), new Snake()];
// (Rhino | Elephant | Snake)[] — not Animal[]

let zoo2: Animal[] = [new Rhino(), new Elephant(), new Snake()]; // OK
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Contextual typing

**Definition:**

// Без контекста параметр `any` (если только noImplicitAny)

константный обработчик = функция (uiEvent) {
  console.log(uiEvent.button); // ОК — нет ошибок без контекста
};

| Аспект | Деталь |
|--------|--------|
| Резюме | // Без контекста параметр `any` (если только noImplicitAny)
константный обработчик = функция (uiEvent) {
  console.log(uiEvent |

---

**Examples:**

```typescript
window.onmousedown = function (mouseEvent) {
  console.log(mouseEvent.button);    // OK — MouseEvent
  // console.log(mouseEvent.kangaroo); // Error
};

// Without context, parameter is `any` (unless noImplicitAny)
const handler = function (uiEvent) {
  console.log(uiEvent.button); // OK — no error without context
};

// Context applies to: call arguments, assignment RHS, assertions,
// object/array literals, return statements
function createZoo(): Animal[] {
  return [new Rhino(), new Elephant(), new Snake()]; // Animal[] inferred from return type
}
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)



</details>

## Variable Declaration

<details>
  <summary>Variable Declaration</summary>

### Variable Declaration

**Definition:**

`var` (функционально, поднято), `let` (блочная область видимости), `const` (блочная область, без переназначения).

| Когда использовать                                                                                           | Заметки                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Предпочитать `const` > `let` > `var`. ТС проверяет все три; `const` не делает объекты глубоко неизменяемыми. | `const` предотвращает только **перепривязку** переменной — внутренности объекта остаются изменяемыми, если только `readonly` or `Object.freeze`. |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### var problems

**Definition:**

// Одна и та же переменная во вложенных циклах — классическая ошибка

для (вар я = 0; я <3; я++) {
setTimeout(() => console.log(i), 100); // 3, 3, 3
}

| Аспект | Деталь                                                               |
| ------ | -------------------------------------------------------------------- |
| Резюме | // Одна и та же переменная во вложенных циклах — классическая ошибка |

для (вар я = 0; я <3; я++) {
setTimeout(() => console.log(i), 100); // 3, 3 |

**Examples:**

```typescript
// Function-scoped — leaks out of blocks
if (true) {
  var x = 10;
}
console.log(x); // 10

// Same var in nested loops — classic bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// Redeclaration allowed
var x = 1;
var x = 2; // OK
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### let — block-scoped

**Definition:**

// Временная мертвая зона — нельзя использовать до объявления

// а++; пусть а; // Ошибка

| Аспект                     | Деталь                                                        |
| -------------------------- | ------------------------------------------------------------- |
| Резюме                     | // Временная мертвая зона — нельзя использовать до объявления |
| // а++; пусть а; // Ошибка |

**Examples:**

```typescript
if (true) {
  let b = 1;
}
// console.log(b); // Error — not in scope

// Temporal dead zone — can't use before declaration
// a++; let a; // Error

// Per-iteration binding in loops
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}

// No redeclaration in same scope
let x = 10;
// let x = 20; // Error
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### const & destructuring

**Definition:**

// Предпочитаем const, если вы не переназначаете (минимальные привилегии)

| Аспект | Деталь                                                                   |
| ------ | ------------------------------------------------------------------------ |
| Резюме | // Предпочитаем const, если не переназначаем (минимальные привилегии) ​​ |

**Examples:**

```typescript
const kitty = { name: "Aurora", numLives: 9 };
// kitty = { ... };     // Error — rebind
kitty.name = "Rory"; // OK — mutate property

// Prefer const unless you will reassign (least privilege)

// Array destructuring
let [first, second] = [1, 2];
let [head, ...rest] = [1, 2, 3, 4]; // rest: [2,3,4]

// Object destructuring
let { a, b } = { a: 1, b: 2 };
let { a: renamed } = { a: 1 }; // property rename

// Tuple destructuring preserves element types
let tuple: [number, string] = [7, "hello"];
let [n, s] = tuple; // n: number, s: string
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Quick list — checklist

1. **`const` параметры типа** — буквальный вывод в дженериках (TS 5.0+)
2. **`using` / `Disposable`** — очистка ресурсов по заданной области (TS 5.2+)
3. **`override` ключевое слово** — явные, проверенные переопределения метода
4. **Более строгие флаги компилятора** — `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
5. **ESM/ЗАП** — `moduleResolution: node16` / `nodenext`, `verbatimModuleSyntax`
6. **Ссылки на проекты** — разделение монорепозиториев, инкрементальное `tsc --build`
7. **Публикация типизированных пакетов** — `declaration`, `types` поле, связка `.d.ts`
8. **Рекурсивные типы** — `Json`, деревья, глубоко `Partial`
9. **Дисперсия** — ковариантная доходность, контравариантные параметры, подводные камни бивариантности.
10. **Проверка времени выполнения** — типы TS ≠ время выполнения; используйте Zod/io-ts для внешних данных

</details>

## Advanced topics

</details>

## Advanced topics

<details>
  <summary>Modern TypeScript</summary>

Универсальный модификатор параметра, сохраняющий литеральные типы при выводе.

| Когда использовать                                                                                      | Заметки                                                                                                        |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `function routes<const T extends readonly string[]>(paths: T)` — keeps tuple of literals, not `нить[]`. | recursion must have a **base case** (`T расширяет защиту объекта), иначе компилятор достигает предела глубины. |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Variance (functions and assignability)

**Definition:**

Как подтипирование работает для параметров функции (контравариантно) и возвращаемых значений (ковариантно).

| Аспект | Деталь                                                                                                      |
| ------ | ----------------------------------------------------------------------------------------------------------- |
| Резюме | Как подтипирование работает для параметров функции (контравариантно) и возвращаемых значений (ковариантно). |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>

<a name="interview-practice"></a>

</details>

