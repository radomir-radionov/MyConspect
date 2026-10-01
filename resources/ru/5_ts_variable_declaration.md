# TypeScript — Variable Declaration

`var` vs `let` vs `const` and destructuring with types.

[← Назад к хабу](./5_ts.md)

### Related docs

- [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

### Sections

- [Variable Declaration](#variable-declaration)
- [Advanced topics](#advanced-topics)

---

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
