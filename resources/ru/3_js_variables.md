# JS Core — Data Types & Variables

Примитивы, приведение, память стека/кучи, коллекции, JSON, привязки, область видимости, `globalThis`и замыкания. Среда выполнения и модули находятся в [Language](./3_js_core.md); операторы и поток управления в [Операторы и циклы](./3_js_operators.md).

[ ← Назад в JS-хаб](./3_js.md)

### Related docs

- [Язык JS](./3_js_core.md) · [Операторы и циклы JS](./3_js_operators.md) · [Массивы JS](./3_js_array.md) · [Функции JS](./3_js_functions.md) · [JS OOP](./3_js_oop.md) · [JS Документ](./3_js_browser.md) · [JS Events](./3_js_events.md) · [JS Async](./3_js_async.md) · [JS Interview](./3_js_interview.md)
- [Итераторы](./3_js_operators.md#iterators) · [Информатика](./7_special_cs.md)

### Main concepts

| Площадь | Темы |
| ----------------- | ----------------------------------------------- |
| **Память** | Кадры стека и объекты кучи, значение и ссылка |
| **Типы** | Примитивы, принуждение, числа, `Date`, струны, `Symbol`, объекты, `Map`/`Set`, JSON |
| **Привязки** | `let` / `const` / `var`, именование, переназначение |
| **Объем** | Глобальный, функция, блок; `globalThis`; ТДЗ; подъем |
| **Узоры** | Отдых/распространение/деструктуризация, замыкание |

### Sections

> Теория `<details>` блоки следуют: **Определение** · **Как это работает** · **Когда использовать** · **Плюсы и минусы** · **Примеры** · **Мысли** · **Источники**. **Определение** обязательно; другие разделы являются необязательными.

- [Data types](#data-types) · [Memory: stack and heap](#memory-stack-heap) · [Numbers](#numbers) · [Date](#date)
- [Scope & closures](#scope-closures)
- [Интервью](./3_js_interview.md)

Родственные основные темы: [Язык](./3_js_core.md) · [Операторы и циклы](./3_js_operators.md) · [Массив](./3_js_array.md) · [Функции](./3_js_functions.md) · [Классы и объекты](./3_js_oop.md).


<a name="data-types"></a>
## Data types

<details>
  <summary>Stack and heap</summary>

<a name="memory-stack-heap"></a>

### Memory: stack and heap

**Definition:** Процесс получает изолированное **виртуальное** адресное пространство. Быстрая **стековая** память хранит кадры вызовов (LIFO); **куча** содержит значения, размер которых неизвестен или должен пережить функцию. JS-движки GC — куча; вы не `malloc`/`free`. Знание этой модели упрощает DevTools (трассировки стека, снимки кучи) и вопросы на собеседованиях о назначениях/вызовах.

**How it works:**

- **Ментальная модель ЦП:** фон Неймана — инструкции и данные совместно используют одно хранилище (одну шину). Гарвард их разделяет. Реальные чипы представляют собой гибрид (например, отдельный I-кэш L1/D-кэш). Память пронумерована **ячейками**; число представляет собой **адрес** фиксированной ширины (произвольный доступ, а не только последовательный). Значения, превышающие одну ячейку, охватывают несколько. 64-битная ширина → 2⁶⁴ адреса (≈ 16 ЭБ *адресного пространства*, а не «у вас 18 ЭБ ОЗУ»).- **Виртуальный или физический:** ЦП сопоставляет виртуальные адреса с оперативной памятью. ОС передает процессу **страницы** (часто 4–8 КБ), многие из них.
- **Процесс или поток:** ОС изолирует процессы (нет доступа к другому процессу, если он этого не разрешает). Процесс может иметь несколько потоков, каждый из которых имеет свой стек. Потоки POSIX — это один настоящий API — хосты различаются (вкладка браузера и узел).Планировщик, переключение контекста, сигналы: [Процессы, многозадачность и прерывания](./0_system_design_core.md#processes-multitasking). Уровень узла: [Процесс и потоки](./8_nodejs_process.md#process--threads).
- **Образ процесса:** в это пространство запустите программу **код**, **глобальные значения**, затем **стек** и **кучу**.
- **Стек:** увеличение/уменьшение путем перемещения **указателя стека** (регистра процессора) — дешево. Вы можете **читать** данные стека;вы **пишите** только вверху (нажимаете). Вы не можете освободить дыру посередине; перемотайте указатель назад, чтобы удалить все, что находится над ним. Истощение → **переполнение стека**. Схема обучения: куча растет «вверх», стопка «вниз», они встречаются в свободном зазоре.
– **Кадр стека:** аргументы одного вызова, локальные значения и «что запускать после возврата». **Указатель кадра** отмечает активный кадр. Вложенные вызовы: `logDogs` рамка → `countDogs(20)` → поп → `countDogs(9)` → поп → поп `logDogs`.
- **Расслабься:** `throw` выталкивает кадры до тех пор, пока `catch` (или программа умирает). **Трассировка стека** — это кадры в обратном порядке вызова.
- **Куча:** требуется, когда размер неизвестен во время построения кадра (массивы, которые `.push`, объекты, замыкания) или данные должны пережить функцию. В слоте стека хранится **ссылка фиксированного размера** (адрес); полезная нагрузка находится в куче. Измените массив по этому адресу. Позже сборщик мусора восстанавливает недоступные объекты кучи — [Сборка мусора](./3_js_oop.md#garbage-collection). MDN: JS выделяет место при создании и освобождает неиспользуемые объекты; в отличие от C нет `malloc`/`free`.
- **Предупреждение JS:** динамические типы означают, что движок *угадывает*, сколько стека нужно зарезервировать; догадки могут быть ошибочными (деопт). «Примитивы в стеке, объекты в куче» — это обучающая модель, а не гарантированный макет V8 (маленькие целые числа могут быть помеченными указателями; большие строки — это куча).

**When to use:**

Почему `Maximum call stack size exceeded`; почему объекты/массивы доступны по ссылке; почему местные жители исчезают после возвращения; чтение трассировки стека.

| | Стек | Куча |
| --- | --- | --- |
| ***+** | Tiny alloc/free (переместить указатель); фреймы, удобные для кэширования | Произвольный размер; данные могут пережить звонящего |
| **-** | Фиксированный размер; только ЛИФО; переполнение | Медленное выделение; ГК; утечки через оставшиеся ссылки |

#### Common pitfalls

Рассматривать диаграмму как структуру физической оперативной памяти; предполагая, что JS всегда знает размеры слотов стека; размещение огромных или растущих данных «в стеке» у себя в голове — это объект-куча плюс ссылка; запутанное переполнение стека вызовов с кучей OOM (`JavaScript heap out of memory` в узле).

**Examples:**

```js
function countDogs(happyDogs) {
  const sadCoefficient = 0.1;
  if (happyDogs < 10) {
    throw new Error("too few happy dogs");
  }
  return happyDogs + sadCoefficient * happyDogs;
}

function logDogs() {
  console.log(countDogs(20), countDogs(9));
}

logDogs();
// frames: logDogs → countDogs(20) → pop → countDogs(9) → throw → unwind
```

```js
function createDogArray() {
  const dogs = ["🐶", "🐶", "🐶"]; // payload on heap; `dogs` on the frame is a ref
  if (Math.random() > 0.5) dogs.push("🐶"); // size unknown at compile time
}
```

**Thoughts:** *Рамки дешевые LIFO; все, что имеет неизвестный или постоянный размер, является объектом-кучей за указателем — GC, а не `free()`.*

**Sources:** [Doka — как работает память](https://doka.guide/js/how-the-memory-works/) · [Управление памятью MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management) · [javascript.info/garbage-collection](https://javascript.info/garbage-collection)

</details>

<details>
  <summary>Data types</summary>

### Data types

**Definition:** ECMAScript имеет 8 типов: 7 **примитивов** (неизменяемые, копируемые по значению) и **`object`** (изменяемый, копируется по ссылке). Функции являются объектами, но `typeof` отчеты `'function'`.

**How it works:**

- **Примитивы** сохраняются по значению — присвоение копирует значение. Сравнение с `===` сравнивает значения.
- **Объекты** (включая массивы, функции, даты) хранятся по ссылке — присваивание копирует указатель. `===` сравнивает эталонную идентичность.
- **Боксирование:** примитивы временно помещаются в обертки объектов при вызове методов (`'hi'.toUpperCase()`).
- **Проверка типа:** `typeof` для примитивов (с `null` ошибка); `Array.isArray`, `Number.isNaN`, `Object.prototype.toString.call` для конкретики.
- Ключи свойств объекта (кроме `Symbol`) преобразовать в строку — `{[obj]: 1}` использует `obj.toString()`.

| Ситуация | Использование |
|-----------|-----|
| Это `null`? | `value === null` (нет `typeof`) |
| Это массив? | `Array.isArray(value)` |
| Это `NaN`? | `Number.isNaN(value)` |
| Это простой объект? | `Object.prototype.toString.call(v) === '[object Object]'` |
| Ключ объекта против карты | `Map` для нестроковых ключей; `{}` для JSON DTO |

| Тип | `typeof`      | Заметки |
| ----------- | ------------- | --------------------------------------------- |
| `undefined` | `'undefined'` | Неназначенная переменная |
| `null`      | `'object'` ⚠️ | Преднамеренное пустое значение — наследие `typeof` ошибка |
| `boolean`   | `'boolean'`   | `true` / `false`                              |
| `number`    | `'number'`    | IEEE-754 двойной; `NaN`, `±Infinity`           |
| `bigint`    | `'bigint'`    | Произвольные целые числа (`123n`)                   |
| `string`    | `'string'`    | Неизменяемая последовательность UTF-16 |
| `symbol`    | `'symbol'`    | Уникальный идентификатор |
| `object`    | `'object'`    | Массивы, даты, простые объекты и т. д. |
| `function`  | `'function'`  | Вызываемый объект — только `typeof` отличает |

Модель обучения — слоты кадров содержат примитивы или **ссылки**; объекты/массивы живут в куче. Не гарантированная компоновка двигателя. Полная модель: [Память: стек и куча](#memory-stack-heap).

Примитивы временно помещаются в обертки объектов при доступе к ним. `.method()` — e.g. `'hi'.toUpperCase()`. Избегать `new String()` / `new Number()` — создает оболочки объектов, которые ломаются `===` чеки.

```js
value === null;                    // null only (not undefined)
value == null;                     // null OR undefined
Array.isArray(value);              // arrays (typeof is 'object')
Number.isNaN(value);               // NaN only (typeof NaN is 'number')
Number.isFinite(value);            // finite number (excludes NaN, ±Infinity)
Object.prototype.toString.call(v); // '[object Array]', '[object Date]', …
```

**Pluses and minuses:**

| + (примитивы) | − (примитивы) |
|-------------------|-------------------|
| Предсказуемая семантика копирования | Нет методов без бокса |
| Потокобезопасность в однопоточном JS | `number` имеет ограничения IEEE-754 |

| + (объекты) | − (объекты) |
|--------------|----------------|
| Изменяемый, расширяемый | Общие ссылки вызывают ошибки |
| Богатые API (массивы, даты) | `typeof` слишком грубо для подтипов |

**Examples:**

```js
const a = { x: 1 };
const b = a;
b.x = 2;
console.log(a.x); // 2 (shared reference)

const s1 = "hi";
const s2 = s1;
// s1 and s2 are independent — strings are immutable primitives
```

### Interesting cases

**`typeof` traps:**

```js
typeof null;              // 'object' — use value === null
typeof [];                // 'object' — use Array.isArray([])
typeof (() => {});        // 'function' — not 'object'
typeof undeclared;        // ReferenceError (not 'undefined')
let x; typeof x;          // 'undefined'
```

**`NaN` and equality:**

```js
typeof NaN;               // 'number'
NaN === NaN;              // false
Object.is(NaN, NaN);      // true
Number.isNaN(NaN);        // true — prefer over global isNaN()
isNaN("hello");           // true — coerces first (footgun)
Number.isNaN("hello");    // false — no coercion
+0 === -0;                // true
Object.is(+0, -0);        // false
```

**Object keys stringify:**

```js
const obj = {};
const key = { id: 1 };
obj[key] = "value";
Object.keys(obj);         // ['[object Object]'] — key coerced to string
```

**Удивительное приведение** (см. также **Основные → Операторы сравнения**):

```js
[] + [];                  // '' (arrays → strings via toString)
[] + {};                  // '[object Object]'
{} + [];                  // 0 ({} parsed as empty block, then numeric +)
"5" - 1;                  // 4
true + true;              // 2
null + 1;                 // 1
undefined + 1;            // NaN
```

**Ложные значения** (все остальное правдиво, включая `[]`, `{}`, `'0'`):

`false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`

**`bigint` vs `number`:**

```js
1n + 2n;                  // 3n
1n + 1;                   // TypeError — cannot mix bigint and number
Number(1n);               // 1 — explicit conversion required
```

**Symbol keys are hidden from `Object.keys`:**

```js
const id = Symbol('id');
const user = { name: 'Ann', [id]: 42 };
Object.keys(user);         // ['name'] — symbol key omitted
Object.getOwnPropertySymbols(user); // [Symbol(id)]
```

**Wrapper objects break `===`:**

```js
const s = new String('hi');
typeof s;                  // 'object'
s === 'hi';               // false — object wrapper vs primitive
```

**`Map` vs plain `Object`:**

| Использовать `Map`           | Используйте простой `Object`          |
| ------------------- | --------------------------- |
| Ключи любого типа | Требуется сериализация JSON |
| Частое добавление/удаление | Литеральная конфигурация/формы DTO |
| `.size` нужен | Цепочка прототипов/методы |

**Sources:** [javascript.info/types](https://javascript.info/types) · [javascript.info/map-set](https://javascript.info/map-set)

</details>

<details>
  <summary>Type conversions</summary>

### Type conversions

**Definition:** Значения преобразуются между типами **явно** (`String()`, `Number()`, `Boolean()`) или **неявно** во время операций (`+`, `==`логические контексты). Предпочитать `===` и явные преобразования в коде приложения.

**How it works:**

- **В строку:** `String(x)`, литералы шаблона, `+` со строковым операндом.
- **На номер:** `Number(x)`, унарный `+x`, арифметические операторы (кроме `+` со строкой).
- **Для логического значения:** `Boolean(x)`, `!!x`, или любой логический/`if` контекст — использует ложный список.
- **`==`** принуждает обе стороны перед сравнением; **`===`** нет.
- `null` и `undefined` равны друг другу только с `==`.

| Использование | Избегайте |
|-----|-------|
| `Number(value)` для пользовательского ввода | `parseInt` без системы счисления |
| `value == null` для нулевой/неопределённой проверки | `==` за всеобщее равенство |
| `Boolean(x)` or `!!x` когда вам нужно логическое значение | Опираясь на неявное приведение в API |
| `String(x)` перед конкатенацией | `x + ''` в критических путях кода |

| Преобразование | Результат/правило |
| ------------------- | ------------------------------------------ |
| `Number(undefined)` | `NaN`                                                      |
| `Number(null)`      | `0`                                                        |
| `Number('')`        | `0`                                                        |
| `Number(' 42 ')`    | `42` (обрезает пробелы) |
| `Number(true)`      | `1`                                                        |
| `Boolean(0)`        | `false` — см. ложный список в **Типы данных → Интересные случаи** |
| `String(123)`       | `'123'`                                                    |
| `parseInt('08', 10)`| `8` — всегда передавать систему счисления |

**When to use:**

#### Common pitfalls

```js
[] + [];                  // '' 
[] + {};                  // '[object Object]'
"5" + 1;                  // '51' — string concat wins
"5" - 1;                  // 4 — numeric coercion
isNaN("hello");           // true — coerces first (footgun)
Number.isNaN("hello");    // false — no coercion
```

**Pluses and minuses:**

| Подход | + | − |
|----------|------|------|
| `===` + явный `Number()` | Предсказуемый | Более подробный |
| `==` | Более короткие проверки на ноль | Удивительное принуждение |
| `??` | Только нулевой запасной вариант | Необходимо заключить в скобки с `\|\|` |

**Examples:**

```js
String(true);             // 'true'
Number("123");            // 123
Number("");               // 0
Boolean([]);              // true — only 8 values are falsy
Boolean("0");             // true
null == undefined;        // true
null === undefined;       // false
'' == 0;                  // true
'' === 0;                 // false
```

**Sources:** [javascript.info/type-conversions](https://javascript.info/type-conversions) · [javascript.info/comparison](https://javascript.info/comparison)

</details>

<details>
  <summary>Numbers</summary>

<a name="numbers"></a>

### Numbers

**Definition:** Обычные числа JS представляют собой двойные числа IEEE-754 **float64** (безопасные целые числа ±`2^53−1`). `BigInt` охватывает большие целые числа. Пишите большие/маленькие литералы с помощью `_` сепараторы, `e` обозначение, или `0x` / `0b` / `0o` префиксы.

**How it works:**

- Литералы: `1_000_000_000`, `1e9`, `1e-6`, `0xff`, `0b11111111`, `0o377`.
- `num.toString(base)` - база `2`…`36` (шестнадцатеричные цвета, короткие идентификаторы). Вызов литерала с двумя точками: `255..toString(16)` or `(255).toString(16)`.
- Округление: `Math.floor` / `ceil` / `round` / `trunc`; точность посредством умножения-разделения или `toFixed(n)` (**возвращает строку**).
- Поплавок: `0.1 + 0.2 !== 0.3` — сравните с эпсилоном или круглыми деньгами (`toFixed` / целое число центов).
- Проверки: предпочитают `Number.isNaN` / `Number.isFinite` / `Number.isInteger` / `Number.isSafeInteger` над глобальным `isNaN` / `isFinite` (эти принуждения).
- Разбор: `parseInt(str, radix)` / `parseFloat(str)` остановиться на первом недопустимом символе; `Number(str)` / `+str` требовать, чтобы вся строка была числовой (после обрезки).
- **`BigInt`:** суффикс `n` or `BigInt(...)`. Все операции остаются BigInt (`5n / 2n === 2n`). **Невозможно смешать** с номером (`1n + 2` throws) — конвертировать явно. `==` можно заставить(`1 == 1n`), `===` нет. Унарный `+bigint` является недействительным.

**When to use:** Арифметика, идентификаторы, измерения. Деньги → округляйте осторожно или используйте целые младшие единицы / `BigInt` / десятичная библиотека. Никогда не используйте `new Number()`.

#### Common pitfalls

```js
0.1 + 0.2;                 // 0.30000000000000004
(12.34).toFixed(1);        // "12.3" — string, not number
parseInt("100px", 10);     // 100
Number("100px");           // NaN
isNaN("hello");            // true — coerces
Number.isNaN("hello");     // false
123456..toString(36);      // "2n9c"
```

**Pluses and minuses:**

| + | − |
|------|------|
| Один тип числа для большинства математических операций | Двоичная погрешность с плавающей запятой |
| Богатый `Math.*` + преобразование системы счисления | `toFixed` возвращает строку |
| Безопасные целочисленные помощники | Целые числа за пределами `MAX_SAFE_INTEGER` потерять точность |

**Examples:**

```js
Math.round(1.23456 * 100) / 100; // 1.23
+(1.005).toFixed(2);             // often 1 — float trap; prefer cents

Number.isFinite(Infinity);       // false
Number.isSafeInteger(2 ** 53);   // false
Number.MAX_SAFE_INTEGER;         // 9007199254740991

1n + 2n;           // 3n
// 1n + 2;         // TypeError — mix banned
Number(1n) + 2;    // 3
1 == 1n;           // true
1 === 1n;          // false
```

**Thoughts:** *Считать равенство с плавающей запятой приблизительным; обращаться `parseInt` vs `Number` как «префикс против целой строки».*

**Sources:** [javascript.info/number](https://javascript.info/number) · [javascript.info/bigint](https://javascript.info/bigint) · [Номер MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) · [MDN Математика] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)

</details>

<details>
  <summary>Strings and templates</summary>

### Strings & template literals

**Definition:** `string` — это неизменяемый примитив UTF-16. **Литералы шаблонов** (обратные кавычки) поддерживают интерполяцию и многострочный текст.

**How it works:**

— Строки неизменяемы — методы возвращают новые строки.
- Литералы шаблона: `` `Здравствуйте, ${name}` `` embed expressions; multiline without `\n`.
- Escape-последовательности: `\n`, `\t`, `\u{1F600}` (Юникод).
- Общие методы: `slice`, `includes`, `startsWith`, `trim`, `split`, `replace`, `replaceAll`.
- Строки **итерируемы** (`for...of` / `Array.from`) и правильно обрабатывать суррогатные пары — index/`length` по-прежнему считают единицы кода UTF-16.
- Суррогатные пары (эмодзи, много CJK): `'😂'.length === 2`; использовать `codePointAt` / `fromCodePoint` / `for...of`, нет `charAt` / `charCodeAt` один.
— Визуально идентичные строки могут отличаться порядком маркировки — `str.normalize()` (NFC) перед сравнением/сохранением.

**When to use:** Текст, обращенный к пользователю, построение URL-адресов, `split`/`join` синтаксический анализ, регулярное выражение для строк. Использовать `trim()` при вводе формы; `includes` для простого поиска перед RegExp.

**Pluses and minuses:**

| + | − |
|------|------|
| Неизменяемый — безопасно делиться | Конкат в циклах может быть медленным (используйте `join` или массив + объединение) |
| API расширенной строки | UTF-16 — влияют суррогатные пары `.length` |
| Шаблоны, читаемые для HTML/SQL | Расширенные шаблоны с тегами (см. MDN) |

**Examples:**

```js
const name = "Ann";
const greeting = `Hello, ${name}!`;
const multiline = `line 1
line 2`;

"  hi  ".trim();           // 'hi'
"a-b-c".split("-");       // ['a','b','c']
["a", "b"].join("-");     // 'a-b'
"hello".includes("ell");  // true
"hello".replaceAll("l", "L"); // 'heLLo'
[..."𝒳😂"];               // ['𝒳', '😂'] — for..of / spread use code points
"S\u0307\u0323".normalize() === "S\u0323\u0307".normalize(); // true
'𝒳'.codePointAt(0).toString(16); // '1d4b3' — full code point
```

**Sources:** [javascript.info/string](https://javascript.info/string) · [javascript.info/unicode](https://javascript.info/unicode) · [javascript.info/primitives-methods](https://javascript.info/primitives-methods)

</details>

<details>
  <summary>Symbol</summary>

### Symbol

**Definition:** `symbol` является примитивом для **уникальных идентификаторов** — каждый `Symbol()` отличается даже при одном и том же описании.

**How it works:**

- Создано с `Symbol('description')` or `Symbol.for('globalKey')` (глобальный реестр).
- `Symbol.keyFor(sym)` возвращает ключ реестра только для **глобальных** символов (`undefined` для местных); использовать `sym.description` для метки любого символа.
— Используется как ключи объекта, которые не конфликтуют со строковыми ключами или другими библиотеками.
- Символьные клавиши **опущены** `Object.keys`, `JSON.stringify`, и `for...in`.
- Использовать `Object.getOwnPropertySymbols(obj)` or `Reflect.ownKeys` перечислить их.
- `Object.assign` **копирует** свойства символа (в отличие от `for...in` / `Object.keys`).
- Известные символы: `Symbol.iterator`, `Symbol.toPrimitive`, `Symbol.toStringTag`, `Symbol.hasInstance`.

**When to use:** Метаданные частных объектов, точки расширения библиотеки, определение пользовательских итераций. Предпочитать `class` частные поля `#x` для истинной конфиденциальности класса в современном коде.

**Pluses and minuses:**

| + | − |
|------|------|
| Гарантированные уникальные ключи | Не подлежит сериализации в формате JSON |
| Скрывает внутренние свойства | Сложнее отлаживать/проверять |
| Протокол итерации Powers | Легко злоупотреблять |

**Examples:**

```js
const id = Symbol("id");
const user = { name: "Ann", [id]: 42 };

Object.keys(user);                    // ['name']
user[id];                             // 42
Symbol.for("app") === Symbol.for("app"); // true — global registry
Symbol.keyFor(Symbol.for("app"));     // "app"
Symbol.keyFor(Symbol("app"));         // undefined — not global

Object.assign({}, user)[id];          // 42 — symbols are copied
```

**Sources:** [javascript.info/symbol](https://javascript.info/symbol)

</details>

<details>
  <summary>Objects and Object utilities</summary>

### Plain objects & Object utilities

**Definition:** **Простой объект** – это `{}` or `new Object()` — коллекция свойств «ключ-значение». `Object.*` статические методы работают с объектами без необходимости использования экземпляра.

**How it works:**

- Ключи представляют собой строки или `Symbol`; другие типы преобразуют в строку (`{[obj]: 1}` → `"[object Object]"`).
- Доступ к собственности: точка `obj.key` или кронштейн `obj['key']` / `obj[expr]`.
- Сокращение: `{ name, age }` равно `{ name: name, age: age }`; вычисленные ключи `{ [dynamic]: 1 }`.
- `in` проверяет цепочку прототипов; `Object.hasOwn(obj, key)` проверяет только свои свойства.
- Распространение / `Object.assign` мелкое слияние объектов.

| Метод | Возврат |
|--------|---------|
| `Object.keys(obj)` | Собственные перечислимые строковые ключи |
| `Object.values(obj)` | Собственные перечислимые значения |
| `Object.entries(obj)` | `[key, value]` пары |
| `Object.assign(target, ...src)` | Цель после неглубокого слияния |
| `Object.hasOwn(obj, prop)` | Логическое значение (собственная опора) |
| `Object.freeze(obj)` | Замороженный объект (неглубокий) |

| | `key in obj` | `Object.hasOwn(obj, key)` |
|---|--------------|---------------------------|
| Собственная недвижимость | да | да |
| Унаследованное имущество | да | нет |
| Используйте, когда | Необходимо знать, существует ли где-нибудь недвижимость | Нужны только собственные ключи (сейф `for...in` фильтр) |

**When to use:** Объекты конфигурации, полезные данные API, карты со строковыми ключами. Использовать `Map` для нестроковых ключей; см. [3_js_oop.md](./3_js_oop.md) для прототипов, дескрипторов и глубоких шаблонов объектов.

**Pluses and minuses:**

| + | − |
|------|------|
| JSON-дружественные DTO | Ключи всегда преобразуются в строку/Символ |
| Буквальный синтаксис краток | Общие ссылки на неглубокий текст |
| `Object.entries` + `fromEntries` для преобразований | До ES2015 не было гарантированного порядка итераций (теперь порядок вставки для строковых ключей) |

**Examples:**

```js
const user = { name: "Ann", age: 30 };
const { name, ...rest } = user;

"age" in user;              // true
Object.hasOwn(user, "age"); // true
Object.hasOwn(user, "toString"); // false — inherited

const merged = { ...defaults, ...user };
const pairs = Object.fromEntries(
  Object.entries(user).map(([k, v]) => [k, String(v)])
);
```

**Sources:** [javascript.info/object](https://javascript.info/object) · [javascript.info/keys-values-entries](https://javascript.info/keys-values-entries)

</details>

<details>
  <summary>Map & Set & WeakMap & WeakSet</summary>

### Map, Set, WeakMap, WeakSet

**Definition:**

Четыре встроенных типа коллекций помимо простых объектов и массивов. `Map` является хранилищем ключей→значений; `Set` это мешок уникальных ценностей. `WeakMap` и `WeakSet` подобны своим сильным аналогам, но содержат **слабые** ссылки на ключи/значения объектов, поэтому сборщик мусора может их вернуть, когда ничто другое не ссылается на эти объекты.

|                       | `Map`                          | `Set`               | `WeakMap`               | `WeakSet`               |
| --------------------- | ------------------------------ | ------------------- | ----------------------- | ----------------------- |
| Магазины | Пары ключ → значение | Уникальные значения | Ключ (объект) → значение | Уникальные объекты |
| Типы ключей/значений | Любой тип | Любой тип | **Только объекты** (ключи) | **Только объекты** || Повторяющиеся ключи/значения | Ключи уникальные; `set` перезаписывает | Уникальные ценности | Ключи уникальные | Уникальные ценности |
| Итерируемый | Да (`for...of`) | Да | Нет | Нет |
| `.size`               | Да | Да | Нет | Нет |
| ГК | Сильные ссылки — сохраняют ключи живыми | Сильные ссылки | Слабые ссылки на **ключи** | Слабые ссылки на **значения** |
| Сериализация | Нет `JSON.stringify`            | No `JSON.stringify` | Нет | Нет |

**Thoughts:**

Использовать `Map`/`Set` когда вам нужна семантика коллекции (любой тип ключа, уникальность, `.size`, итерация). Использовать `WeakMap`/`WeakSet` для **сторонних метаданных**, прикрепленных к объектам, без предотвращения сбора этих объектов.

---

### Map

**Definition:** Заказанный сбор `[key, value]` записи. Ключи могут быть любого типа — примитивы, объекты, функции, символы — а не только строки/символы, такие как простые объекты.

**How it works:**

- Создано с `new Map()` or `new Map(iterable)` где итерация дает `[key, value]` пары.
- При поиске ключей используется равенство **SameValueZero** (`NaN` равно `NaN`; `+0` равно `-0`).
- Порядок вставки сохранен; `for...of` повторяет записи в этом порядке.
- API: `set`, `get`, `has`, `delete`, `clear`, `size`, `keys`, `values`, `entries`, `forEach`.
- Ключи объекта хранятся **по ссылке**, а не в строковой форме — это две разные `{id:1}` объекты - это два разных ключа.

**When to use:**

| Использовать `Map`                                                             | Используйте простой `Object`                             |
| --------------------------------------------------------------------- | --------------------------------------------- |
| Ключи — это объекты, узлы DOM или нестроки | Сериализация JSON/REST DTO |
| Частое добавление/удаление записей | Конфигурационные литералы фиксированной формы |
| Нуждаться `.size` или итерация в порядке размещения | Нуждаться `Object.keys` / эргономика распространения |
| Ключи не должны конфликтовать из-за `toString()` (`{}` → `"[object Object]"`) | Методы прототипа или `hasOwnProperty` узоры |

**Pluses and minuses:**

| + | − |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| Любой тип ключа (объекты, функции) | Нет сериализации JSON || Предсказуемый порядок итераций | Немного больше памяти, чем у обычного объекта, для случаев, когда используются только строковые ключи |
| `.size` за O(1) | Нет цепочки прототипов/нет наследуемых ключей |
| Частый `set`/`delete` без накладных расходов на преобразование ключей | Менее знакомо читателям, ожидающим `{}`                          |

**Examples:**

```js
const user = { id: 1 };
const meta = new Map([
  ["name", "Ann"],
  [user, { lastLogin: Date.now() }], // object as key
]);

meta.set(42, "answer");
meta.get(user); // { lastLogin: ... }
meta.has("name"); // true
meta.size; // 3

for (const [key, value] of meta) {
  console.log(key, value);
}

// SameValueZero
const m = new Map();
m.set(NaN, "not a number");
m.get(NaN); // 'not a number'
```

---

### Set

**Definition:** Упорядоченная коллекция **уникальных** значений. Добавление дубликата не требуется (то же значение для SameValueZero).

**How it works:**

- Создано с `new Set()` or `new Set(iterable)`.
- `add`, `has`, `delete`, `clear`, `size`, итерация через `for...of` / `values()` (то же, что и записи для набора).
— Уникальность примитивов определяется по значению (SameValueZero), а не по идентификатору ссылки.
- Две разные ссылки на объекты всегда являются отдельными записями.

**When to use:**

| Использовать `Set`                                  | Использовать `Array`                                  |
| ----------------------------------------- | -------------------------------------------- |
| Уникальность (`[...new Set(arr)]`) | Заказ + дубликаты имеют значение |
| Быстрая циклическая проверка членства | Нуждаться `map`/`filter`/`reduce` по индексированным данным |
| Списки тегов, посещенные узлы, флаги разрешений | Список сериализуемых JSON |

**Pluses and minuses:**

| + | − |
| ------------------------------------- | ---------------------------------- |
| O(1) среднее `has` / `add` / `delete` | Нет доступа к индексу (`set[0]` недействителен) |
| Дедупликация в одну строку | Нет сопоставления ключей → значений |
| Итерируемый, удобный для распространения | Объекты сравниваются только по ссылке |

**Examples:**

```js
const tags = new Set(["js", "react", "js"]); // {'js', 'react'}
tags.add("ts");
tags.has("js"); // true
tags.delete("react");

// Deduplicate array
const unique = [...new Set([1, 2, 2, 3])]; // [1, 2, 3]

// Set operations
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
const intersection = [...a].filter((x) => b.has(x)); // [2, 3]

// Objects: reference identity
const s = new Set();
s.add({ id: 1 });
s.add({ id: 1 });
s.size; // 2 — two different object references
```

---

### WeakMap

**Definition:** Структура, подобная карте, чьи **ключи должны быть объектами** (или зарегистрированными символами в некоторых движках). Ключи удерживаются **слабо**: если ключевой объект не имеет других сильных ссылок, он и его запись могут быть подвергнуты сборке мусора. Ценности твердо придерживаются.

**How it works:**

- Только методы: `get`, `set`, `has`, `delete` — no `size`, `clear`или итерация.
— Вы не можете перечислять ключи — API намеренно минимален, чтобы сборщик мусора мог работать без раскрытия неработающих ключей.
- Типичный шаблон: частные/сторонние данные об объектах, которыми вы не владеете (узлы DOM, экземпляры классов).
- Если ключ собран, `get(key)` в любом случае нельзя было бы вызвать; запись бесшумно исчезает.

**When to use:**

| Использовать `WeakMap`                                           | Использовать `Map` вместо этого |
| ------------------------------------------------------- | -------------------------------- |
| Кэш или метаданные, идентифицированные по идентификатору объекта | Необходимо перебрать записи |
| Узел DOM → состояние обработчика (браузер) | Ключи включают примитивы |
| Шаблон частных полей раньше `#` or `Symbol`           | Нуждаться `.size` or `clear()`        |
| Экземпляр → вычисляемый кеш, который должен умереть вместе с экземпляром | Долговечный реестр всех элементов |

**Pluses and minuses:**

| + | − |
| ----------------------------------------------------------- | -------------------------------------------- |
| Отсутствие утечек памяти из кэшированных метаданных на недолговечных объектах | Невозможно выполнить итерацию или получить `.size`                |
| Подходит для библиотек, прикрепляющих данные к посторонним объектам | Ключи должны быть объектами |
| Скрывает данные от `Object.keys` / сериализация | Невозможно легко проверить содержимое для отладки |

**Examples:**

```js
const privateData = new WeakMap();

class User {
  constructor(name) {
    privateData.set(this, { name, visits: 0 });
  }
  getName() {
    return privateData.get(this).name;
  }
  visit() {
    privateData.get(this).visits++;
  }
}

const u = new User("Ann");
u.visit();
// When `u` is no longer referenced, the WeakMap entry is GC-eligible.

// DOM metadata (browser)
const listeners = new WeakMap();
function track(el, handler) {
  listeners.set(el, handler);
  // When `el` is removed from DOM and unreferenced, entry can be collected.
}
```

---

### WeakSet

**Definition:** Структура, подобная множеству, которая принимает только **объекты**. Членство является слабой ссылкой: если у объекта нет других сильных ссылок, он автоматически выпадает из набора.

**How it works:**

- Методы: `add`, `has`, `delete` — нет итерации, нет `size`, no `clear`.
- `add` возвращает набор (например, `Set`).
- Полезно в качестве **набора тегов**: «мы уже обработали этот объект?»

**When to use:**

| Использовать `WeakSet`                              | Использовать `Set` вместо этого |
| ----------------------------------------- | ---------------------------------- |
| Отметить объекты как посещенные/обработанные | Сохранение примитивов |
| Отказ от участия или черный список экземпляров объектов | Необходимо перебрать или подсчитать участников |
| Предотвратить двойную регистрацию одного и того же объекта | Сохранение членства между сеансами |

**Pluses and minuses:**

| + | − |
| --------------------------------------------- | ---------------------------- |
| Автоматическая очистка при удалении объектов | Нет возможности перечислить участников |
| Дешево «видели этот объект?» чеки | Только объекты |
| Предотвращает утечку памяти в долгоживущих реестрах | Невозможно сериализовать или сделать снимок |

**Examples:**

```js
const processed = new WeakSet();

function handleOnce(obj) {
  if (processed.has(obj)) return;
  processed.add(obj);
  // ... expensive work
}

const node = document.createElement("div");
handleOnce(node);
handleOnce(node); // skipped

// Circular structures — WeakSet detects revisiting same object
function deepWalk(obj, seen = new WeakSet()) {
  if (obj && typeof obj === "object") {
    if (seen.has(obj)) return;
    seen.add(obj);
    for (const v of Object.values(obj)) deepWalk(v, seen);
  }
}
```

---

### Map/Set vs WeakMap/WeakSet — decision guide

```text
Need primitives as keys/values?     → Map / Set
Need to loop or know .size?          → Map / Set
Attach hidden data to objects?       → WeakMap
Tag "already seen" object refs?      → WeakSet
Prevent GC of keys/values?           → Map / Set (strong refs)
Let GC reclaim when object unused?   → WeakMap / WeakSet
```

**Common pitfalls:**

```js
// Pitfall 1: object keys in Map — must keep same reference
const key = { id: 1 };
const map = new Map([[key, "a"]]);
map.get({ id: 1 }); // undefined — different object
map.get(key); // 'a'

// Pitfall 2: WeakMap key collected → entry gone (by design)
let obj = {};
const wm = new WeakMap();
wm.set(obj, "data");
obj = null; // eventually GC removes the entry

// Pitfall 3: Set dedupe uses SameValueZero, not deep equality
new Set([{ a: 1 }, { a: 1 }]).size; // 2
```

**Sources:** [javascript.info/map-set](https://javascript.info/map-set) · [javascript.info/weakmap-weakset](https://javascript.info/weakmap-weakset) · [Карта MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

</details>

<details>
  <summary>Date</summary>

<a name="date"></a>

### Date

**Definition:** `Date` хранит одну временную метку — миллисекунды с **1 января 1970 года по всемирному координированному времени** (эпоха Unix). Локальные геттеры/сеттеры используют часовой пояс времени выполнения; `getUTC*` / `setUTC*` используйте UTC.

**How it works:**

- Создавать: `new Date()` (сейчас), `new Date(ms)`, `new Date(dateString)` (тот же алгоритм, что и `Date.parse`), `new Date(y, monthIndex, …)` — **месяц — 0–11**.
- Читать: `getFullYear`, `getMonth` (0–11), `getDate` (день месяца 1–31), `getDay` (день недели 0=Вс…6=Сб), `getHours`…, `getTime()`, `getTimezoneOffset()`.
- Писать: `setFullYear` / `setMonth` / `setDate` / `setHours`… / `setTime(ms)` — значения, выходящие за пределы допустимого диапазона **автокоррекция** (например, 32 января → 1 февраля).
- Разница: `date1 - date2` or `getTime()` разница → миллисекунды. `Date.now()` текущая временная метка без выделения `Date`.
- Предпочитать `getFullYear()` — никогда не используйте устаревшие `getYear()`.

**When to use:** Временные метки, прошедшее время, простая календарная математика с помощью автокоррекции. Дисплей → `Intl.DateTimeFormat` ([Intl](./3_js_extra.md#intl)). Сложные календари/часовые пояса → рассмотрите Temporal (если доступно) или специальную библиотеку.

#### Common pitfalls

```js
new Date(2011, 0, 1);     // 1 Jan 2011 local — month 0 = January
new Date("2017-01-26");   // date-only → UTC midnight, then shown in local TZ
date.getDate();           // day of month — not getDay (weekday)
date.setDate(0);          // last day of previous month
```

**Pluses and minuses:**

| + | − |
|------|------|
| Встроенная, точность мс | На основе месяца 0; особенности анализа строки даты |
| Автокоррекция смещений | Изменчивый; изменение общих дат является источником ошибки |
| Легкие различия по прошедшему времени | Никакой первоклассной арифметики TZ |

**Examples:**

```js
const start = Date.now();
// …work…
const elapsedMs = Date.now() - start;

const d = new Date(2016, 1, 28);
d.setDate(d.getDate() + 2); // 1 Mar 2016 (leap year)

Date.parse("2017-01-26");   // ms or NaN
```

**Thoughts:** *Эпоха мс — переносимое значение; `Date` — это представление с методами доступа local/UTC — индекс месяца и изменяемые API — это ловушки для собеседований.*

**Sources:** [javascript.info/date](https://javascript.info/date) · [Дата MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) · [MDN Date.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)

</details>

<details>
  <summary>JSON</summary>

### JSON

**Definition:** **JSON** (нотация объектов JavaScript) — это наиболее распространенный текстовый формат для обмена данными между приложениями. Он выглядит как объект JS, но это независимая от языка спецификация ([ECMA-404](https://www.ecma-international.org/publications-and-standards/standards/ecma-404/)); то, как JS использует его, описано в ECMAScript. Файлы используют `.json` расширение (`package.json` самый известный пример).

**How it works:**

JSON — это пары ключ-значение, разделенные `,`. Ключ всегда представляет собой **строку, заключенную в двойные кавычки**; `:` разделяет ключ и значение. Ценности могут быть:

| Тип | Пример |
|------|---------|
| Строка | `"I love JSON!"` |
| Номер | `21` |
| Логическое | `true` / `false` |
| Массив | `[18, true, "lost"]` |
| Объект | `{"isValid": true}` |
| `null` | `null` |

Типичный сетевой поток: запрос → ожидание → получение текста JSON → `JSON.parse` → используйте значения JS. `fetch` помощники: `await res.json()`.

**`JSON.stringify(value[, replacer, space])`** — значение JS → JSON **строка**. Тип результата `'string'` (or `undefined` для одинокой функции/`undefined`/`Symbol`).

Опущено (свойства объекта): `undefined`, функции/методы, `Symbol` значения, **Символические клавиши** (даже с `replacer`). Посещаются только **перечисляемые** свойства (`Object.keys` заказ).

Становиться `null`: `Infinity`, `NaN`; `undefined` **внутри массивов**. `Map` / `Set` преобразовать в строку `{}` (нет перечисляемых собственных ключей данных).

Броски **`TypeError`:** циклические ссылки, `BigInt` (если вы не добавите `toJSON`). `Date` / `Temporal` использовать `toJSON()` (строка ISO); синтаксический анализ **не** восстанавливает их как даты.

`replacer` — массив ключей (только эти свойства) или `(key, value) =>` трансформировать; возвращаться `undefined` пропустить. `space` — количество пробелов (ограничено до 10) или отступ строки для удобства чтения (`JSON.stringify(obj, null, 2)`). Обычай `toJSON()` на объекте переопределяет сериализацию.

**`JSON.parse(text[, reviver])`** — строка JSON → значение JS. Неверный JSON → **`SyntaxError`**. Обернуть ненадежный ввод в `try/catch`. `reviver(key, value)` работает в глубину; возвращаться `undefined` удалить свойство. Используйте его, чтобы оживить `Date` из строк ISO.

**When to use:**

Полезная нагрузка REST/API, `localStorage` строки, нпм `package.json` и другая конфигурация, состояние приложения отправляется на серверную часть. Альтернативы: **XML**, **YAML** (комментарии), Protobuf/MessagePack (размер). Глубокое клонирование JSON-безопасных данных в обе стороны; использовать `structuredClone` для циклов/`Date`/`Map`. JSON5 существует как более свободный диалект, а не как языковой стандарт.

#### Common pitfalls

- Ключи/строки должны содержать **двойные кавычки**; конечные запятые и комментарии JS недействительны.
- `undefined` в объект упал; в массиве это становится `null`.
- `JSON.parse(JSON.stringify(obj))` теряет функции, `undefined`, символы, повороты `Date` в строку, выдает циклически.
- `JSON.parse` не запускает JS — нет `new Date(...)` внутри текста.
- Сетевые API (например, OpenWeather) возвращают JSON; все еще анализировать/проверять на границе.

**Pluses and minuses:**

| + | − |
|------|------|
| Универсальный формат API/конфигурации | Не полный клон (типы, функции, `undefined` потерял) |
| Встроенный, быстрый, человекочитаемый | Циркулярные ссылки / `BigInt` бросить |
| Красивый принт с `space` | Никаких комментариев в стандартном JSON (`//` недействителен) |
| У большинства языков есть библиотеки | Нет встроенной проверки схемы |

**Examples:**

```js
const hero = {
  nickname: "BestHealerEver",
  level: 7,
  things: ["sword", "helmet"],
  money: { gold: 6387, diamonds: 2 },
};

typeof hero;                 // 'object'
typeof JSON.stringify(hero); // 'string'
JSON.stringify(hero, ['nickname', 'level'], 2);
// pretty JSON with only those keys

const json =
  '{"name":"Luke Skywalker","gender":"male","birth_year":"19BBY"}';
const jedi = JSON.parse(json);
jedi.name; // 'Luke Skywalker'

JSON.stringify({ fn() {}, n: NaN, u: undefined }); // '{"n":null}'
JSON.stringify([undefined]); // '[null]'
JSON.parse("{ invalid");     // SyntaxError
```

**Thoughts:** *JSON — это строгое подмножество данных синтаксиса объектов JS: преобразуйте его в строку для отправки, анализируйте для использования и никогда не рассматривайте его как полный клон объекта.*

**Sources:** [Doka — JSON](https://doka.guide/js/json/) · [javascript.info/json](https://javascript.info/json) · [MDN stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) · [MDN синтаксический анализ] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)

</details>

<a name="scope-closures"></a>
## Scope & closures

<details>
  <summary>globalThis</summary>

### globalThis

**Definition:** Стандартный способ доступа к глобальному объекту в любой среде (браузер `window`, Узел `global`, рабочие `self`).

**How it works:**

- `globalThis` — это один и тот же объект в разных областях данной среды JS.
- В браузерах глобальное также `window`; в узле `global`. Предпочитать `globalThis` для переносимого кода.
- `var` объявления глобалов и функций в классических скриптах становятся свойствами глобального объекта; `let`/`const` не**.
- В строгом режиме/модули голые `this` на верхнем уровне есть `undefined` - использовать `globalThis` когда вам действительно нужен глобальный.
- Предпочитайте область действия модуля или явный экспорт, а не загрязняющий глобальный контент; прикрепляйте только настоящие полифилы (`if (!globalThis.Promise) ...`).

**When to use:** Комплекты библиотеки UMD, тестовая установка, редкие полифилы. Не прикрепляйте состояние приложения к `globalThis`.

**Pluses and minuses:**

| + | − |
|------|------|
| Межсредовый API | Анти-паттерн глобального загрязнения |
| Совместимость с Polyfill | |

**Examples:**

```js
globalThis.setTimeout(fn, 0); // works in browser and Node

// classic script only — modules don't put let on global:
// var gVar = 5; → window.gVar === 5
// let gLet = 5; → window.gLet === undefined
```

**Sources:** [MDN globalThis](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) · [javascript.info/global-object](https://javascript.info/global-object)

</details>

<details>
  <summary>Variables, scope, and hoisting</summary>

### Variables, scope & hoisting

**Definition:** Переменные — это именованные привязки, хранящиеся в **лексической среде**. **Область** определяет, где видна привязка. **Подъем** регистрирует объявления до запуска строки, но `let`/`const` оставайтесь в **временной мертвой зоне (TDZ)** до инициализации.

**How it works:**

- Каждая область (глобальная, функция, блок) имеет привязки к записи среды.
- Внутренние области связаны с внешними переходами. `[[OuterEnv]]` — эта цепочка позволяет **замыкания**.
- `var` поднимается до функциональной области как `undefined`; Вы можете прочитать его перед заданием.
- `let`/`const` подняты, но недоступны до линии объявления (ТДЗ).
- Функции **объявления** поднимаются всем телом; **выражения** — нет.
- `const` предотвращает повторное связывание переменной; Содержимое объекта/массива остается изменчивым.

|          | `var`       | `let` | `const`      |
| -------- | ----------- | ----- | ------------ |
| Область применения | функция | блокировать | блокировать |
| Подъем | `undefined` | ТДЗ | ТДЗ |
| Переобъявить в той же области | да | нет | нет |
| Переназначить | да | да | нет (обязательность) |

**When to use:**

| Использование | Избегайте |
|-----|-------|
| `const` по умолчанию | `var` в новом коде |
| `let` при перепривязке(`for` счетчик, аккумуляторы) | `const` для значений, которые вы переназначите |
| Заблокировать область действия в `if`/`for` для временных креплений | Полагаясь на подъем для логического потока |

**Naming:**

- Предпочитаю CamelCase (`userName`, `shoppingCart`); буквы, цифры, `$`, `_` только; не начинается с цифры.
- Объявить привязку **один раз** — повторно`let` / re-`const` одно и то же имя в одной области действия является `SyntaxError`.
- **Прописные буквы `CONST_NAME`:** только для жестко запрограммированных псевдонимов, известных до запуска (`COLOR_RED = "#F00"`). Константы, вычисляемые во время выполнения, остаются в CamelCase (`const age = someCode(birthday)`).

```js
const COLOR_ORANGE = "#FF7F00"; // hard-coded → UPPER_SNAKE
const pageLoadTime = performance.now(); // computed once → camelCase
```

---

**Pluses and minuses:**

| + (`const`/`let`) | − (`var`) |
|------|--------------|
| Область действия блока ограничивает утечки | Область действия игнорирует `{}` блоки |
| TDZ обнаруживает ошибки, связанные с использованием перед объявлением | Поднятый `undefined` скрывает ошибки |
| Никакого случайного повторного объявления | Ошибки замыкания цикла с `var` + асинхронный |

### Scope types

**Definition:** Три уровня видимости — глобальный, функциональный и блочный.

**How it works:**

- **Global** — верхний уровень модуля/скрипта; в браузерах, `var` также прикрепляется к `window`.
- **Функция** — параметры и `var`/`let`/`const` внутри тела функции.
- **Блокировать** - `let`/`const` внутри `{}`, `if`, `for`, `while`.

**When to use:**

Используйте область блока для временных объектов; область действия только через `var` (наследие).

| Область применения | Создано | Пример |
| -------- | --------------------------------- | ------- |
| Глобальный | Верхний уровень скрипта/модуля | `const API_URL = '...'` |
| Функция | `function` декларация/выражение | `function f() { const x = 1; }` |
| Блокировать | `{ }` с `let`/`const`          | `if (ok) { const tmp = 1; }` |

```js
const global = 1;

function outer() {
  const local = 2;
  if (true) {
    const block = 3;
    // block visible here only
  }
  // console.log(block); // ReferenceError
}
```

---

**Pluses and minuses:**

| + (объем блока) | − |
|----|----------------------|
| Ограничивает время жизни переменной | Необходимо выбрать правильное ключевое слово |
| Предотвращает утечку из `if`/`for` | |

### Hoisting & TDZ

**Definition:** Механизм регистрирует объявления перед выполнением операторов; `let`/`const` оставайтесь в ТЗ до своей линии.

**How it works:**

- фаза разбора привязок записей; Фаза выполнения присваивает значения.
- `var` привязки существуют как `undefined` от начала области действия.
- Доступ `let`/`const` до объявления → `ReferenceError` (ТДЗ).
- `typeof undeclaredVar` безопасно; `typeof letBeforeDeclare` в ТДЗ кидает.

Каждый вызов функции получает контекст (переменную среду, `this`, кадр стека вызовов). **Лексическая среда** — это место, откуда замыкания получают свои внешние привязки. Это определяется **где пишется код**, а не тем, где он выполняется.

---

**When to use:**

Никогда не используйте переменные перед объявлением; используйте объявления функций, если вам нужны поднятые помощники.

| Декларация | Поднят как |
| ---------------------- | ------------------- |
| `var`                  | `undefined`         |
| `function` декларация | Полная функция |
| `let`/`const`          | TDZ до тех пор, пока линия не пройдет |

```js
sayHi(); // works — declaration hoisted
function sayHi() {
  console.log("Hi");
}

console.log(a); // undefined — var hoisted
var a = 1;

// console.log(b); // ReferenceError — TDZ
let b = 2;
```

**Pluses and minuses:**

| + (ТДЗ) | − |
|------------|------|
| Раннее обнаружение ошибок | Удивляет разработчиков других языков |

### `var` loop pitfall vs `let`

**Definition:** `var` in `for` создает одну привязку для всего цикла; `let` создает новую привязку на каждую итерацию.

**How it works:**

- `var i` является функциональной областью — все замыкания имеют одно и то же `i` после завершения цикла.
- `let i` имеет блочную область действия на итерацию — каждый асинхронный обратный вызов захватывает свой собственный `i`.

**When to use:** Всегда `let` in `for` петли с застежками; использовать `for...of` когда вам не нужен index.

**Pluses and minuses:**

| + (`let` в петлях) | - (`var` в петлях) |
|-------|------------------------|
| Исправление асинхронных обратных вызовов | — |
| Захват за итерацию | `var` вызывает классическую ошибку собеседования |

**Examples:**

```js
// var — one shared binding
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3, 3, 3
}

// let — new binding per iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0, 1, 2
}
```

**Sources:** [javascript.info/variables](https://javascript.info/variables) · [javascript.info/let-const](https://javascript.info/let-const) · [javascript.info/closure](https://javascript.info/closure)

</details>

<details>
  <summary>Rest, spread, and destructuring</summary>

### Rest, spread & destructuring

**Definition:** **Деструктуризация** распаковывает массивы/объекты в переменные. **Отдых** (`...rest`) собирает оставшиеся элементы в новый массив/объект. **Распространение** (`...iterable`) расширяет итерации до элементов или свойств объекта.

**How it works:**

- Матчи деструктуризации массива по позициям; деструктуризация объекта по имени свойства.
- Отдых должен быть последним в схеме; создает **мелкую** копию остальных свойств.
— Распространение литералов создает неглубокие копии — вложенные объекты по-прежнему являются общими ссылками.
- Заменены остальные параметры функции `arguments` объект в современном коде.
- **Умные параметры:** `function show({ title = "Menu", width = 100 } = {})` — деструктурировать объект опций; по умолчанию `= {}` так что простой вызов работает.
- Задание без `let`/`const`: заключить в круглые скобки — `({ title, width } = options)` - в противном случае `{` анализируется как блок.

**When to use:**

| Особенность | Используйте, когда |
|---------|----------|
| Деструктуризация массива | Поменять значения, вернуть результат синтаксического анализа |
| Деструктуризация объекта | Реквизиты, ответы API, объекты параметров |
| Отдых в деструктуризации | Опустить поля (`const { password, ...safe } = user`) |
| Распространение слияния | Обновления неизменяемых объектов/массивов |
| Остальные параметры | Вариадические функции (`sum(...nums)`) |
| Параметр объекта Параметры | Множество необязательных аргументов со значениями по умолчанию |

#### Common pitfalls

```js
// Pitfall: nested destructuring — undefined parent throws
const { address: { city } } = {}; // TypeError

// Pitfall: bare `{...} =` looks like a block
let title, width;
({ title, width } = { title: "Menu", width: 200 }); // needs parens

// Pitfall: spread is shallow
const inner = { x: 1 };
const nested = { data: inner };
const clone = { ...nested };
clone.data.x = 99;
inner.x; // 99 — shared nested reference
```

**Pluses and minuses:**

| + | − |
|------|------|
| Краткая распаковка | Легко скрыть имена внешних переменных |
| Обновления в неизменном стиле с распространением | Только мелкий — общие вложенные ссылки |
| Заменяет `arguments` | Остальное должно быть последней позицией |

**Examples:**

```js
// Array
const [first, second, ...rest] = [1, 2, 3, 4];
// first=1, second=2, rest=[3,4]

let a = 1, b = 2;
[a, b] = [b, a]; // swap

// Object — rename + default
const { years: age, isAdmin = false } = { name: "John", years: 30 };

// Function rest + options object
function showMenu({ title = "Untitled", width = 200, height = 100 } = {}) {
  return `${title} ${width}x${height}`;
}
showMenu(); // Untitled 200x100
showMenu({ title: "File" });

function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}

// Spread — shallow copy / merge
const merged = { ...defaults, ...userOverrides };
const copy = [...arr, newItem];
```

**Sources:** [javascript.info/destructuring-assignment](https://javascript.info/destructuring-assignment) · [javascript.info/rest-parameters-spread](https://javascript.info/rest-parameters-spread)

</details>

<details>
  <summary>Closures</summary>

### Closures

**Definition:** **Замыкание** — это функция плюс ее лексическое окружение — функция сохраняет доступ к внешним привязкам даже после завершения работы внешней функции. В JS **каждая функция** является замыканием (кроме `new Function()` тела, которые используют глобальную область видимости).

**How it works:**

- Когда функция создается, она фиксирует ссылку на свое внешнее лексическое окружение (`[[Environment]]`).
- Внешние переменные остаются активными, пока **любая** внутренняя функция, ссылающаяся на них, доступна.
- Замыкания позволяют использовать шаблоны фабрик, частного состояния, частичного приложения и модуля.
- `let` в циклах создаются привязки для каждой итерации; `var` разделяет одну привязку (классическая ошибка асинхронного цикла).

**When to use:**

| Используйте затворы | Избегайте |
|--------------|-------|
| Шаблон модуля, счетчики, запоминание | Хранение крупных предметов «на всякий случай» |
| Обработчики событий, которым требуется внешнее состояние | Создание замыканий в горячих циклах без необходимости |
| `makeFilter(min)` фабрики стиля | Замена простых данных функциями |

#### Common pitfalls

```js
// Pitfall: stale closure over mutable outer let
let count = 0;
const fns = [];
for (let i = 0; i < 3; i++) {
  fns.push(() => count); // all see same count
}
count = 99;
fns[0](); // 99

// Pitfall: accidental memory — closure holds entire outer scope
function big() {
  const huge = new Array(1e6);
  return () => huge.length; // keeps huge alive
}
```

**Pluses and minuses:**

| + | − |
|------|------|
| Конфиденциальность данных без классов | Память — внешние переменные сохраняются за счет закрытия |
| Заводы и конфигураторы | Случайный захват цикла `var` |
| Частичная аппликация, декораторы | Усложнение отладки при чрезмерной вложенности |

**Examples:**

```js
function createCounter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    get: () => count,
  };
}
const c = createCounter(10);
c.increment(); // 11
```

```js
function makeFilter(min) {
  return (arr) => arr.filter((n) => n >= min);
}
const over5 = makeFilter(5);
over5([1, 6, 3, 8]); // [6, 8]
```

```js
function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}
```

**Sources:** [javascript.info/closure](https://javascript.info/closure) · [javascript.info/garbage-collection](https://javascript.info/garbage-collection)

</details>
