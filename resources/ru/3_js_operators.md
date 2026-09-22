# JS Core — Operators & Loops

Выражения, операторы, сравнения, необязательное связывание и поток управления (`if` /петли/ `switch` / `try`/`catch`). Среда выполнения языка и типы данных/переменные находятся в родственных основных темах.

[ ← Назад в JS-хаб](./3_js.md)

### Related docs

- [Язык JS](./3_js_core.md) · [Типы данных и переменные JS](./3_js_variables.md) · [Массивы JS](./3_js_array.md) · [Функции JS](./3_js_functions.md) · [JS OOP](./3_js_oop.md) · [JS Документ](./3_js_browser.md) · [JS Events](./3_js_events.md) · [JS Async](./3_js_async.md) · [JS Interview](./3_js_interview.md)
- [Информатика](./7_special_cs.md)

### Main concepts

| Площадь | Темы |
| ----------------- | ----------------------------------------------- |
| **Выражения** | Оператор против выражения, ASI, виды выражений |
| **Операторы** | Арифметика, сравнение, `Object.is`, логический, побитовый, `?.` / `??` |
| **Поток управления** | `if` / троичный, петли, `for...in` vs `for...of`, `switch`, `try`/`catch`/`finally` |
| **Итераторы** | Итерации, генераторы |

### Sections

> Теория `<details>` блоки следуют: **Определение** · **Как это работает** · **Когда использовать** · **Плюсы и минусы** · **Примеры** · **Мысли** · **Источники**. **Определение** обязательно; другие разделы являются необязательными.

- [Expressions](#expressions)
- [Operators](#operators)
- [Control flow](#control-flow)
- [Iterators](#iterators)
- [Интервью](./3_js_interview.md)

Родственные основные темы: [Язык](./3_js_core.md) · [Типы данных и переменные](./3_js_variables.md) · [Массив](./3_js_array.md) · [Функции](./3_js_functions.md) · [Классы и объекты](./3_js_oop.md).


<a name="expressions"></a>
## Expressions

<details>
  <summary>Statement vs expression</summary>

### Statement vs expression

**Definition:**

**оператор** выполняет действие (назначить, зациклить, объявить). **выражение** принимает значение (`42`, `a + b`, `fn()`).

| | Заявление | Выражение |
|---|-----------|------------|
| Возвращаемое значение | Нет | Да |
| Примеры | `if`, `for`, `const x = 1` | `1 + 2`, тройная, стрелка fn тело без фигурных скобок |

**When to use:** Предпочитайте выражения в функциональных конвейерах; заявления о потоке управления и побочных эффектах на границах.

**Examples:**

```js
const doubled = items.map(x => x * 2); // expression-bodied callback
if (items.length === 0) return [];     // statement
```

**Thoughts:**

`const x = (y = 1)` — присваивание внутри выражения допустимо, но ухудшает читабельность.

---

</details>

<details>
  <summary>ASI (automatic semicolon insertion)</summary>

### ASI (automatic semicolon insertion)

**Definition:** Когда операторы разделяются переносом строки, движок часто вставляет неявный оператор. `;`. Так происходит **не** всегда — начало некоторых строк продолжает предыдущее выражение.

**How it works:**

- Большинство новых строк действуют как конец оператора: `alert('Hello')\nalert('World')` все в порядке.
- Новая строка после неполного выражения **не** вставляется. `;` (например, заканчивая на `+`).
- Новая строка перед `[...]` **не** вставляет `;` — следующая строка может быть проанализирована как доступ к свойству предыдущего выражения.
- Тот же класс огнестрельного оружия: голый `return` затем возвращается новая строка `undefined` (вставки ASI `;` после `return`).

**When to use:** Поставьте явное `;` после каждого заявления (по умолчанию сообщества). Дополнительный `;` после блоков/`for` безвреден; пропавших без вести раньше `[`, `(`, `` ` ``, `/` — опасные случаи.

**Examples:**

```js
alert("Hello");
[1, 2].forEach(alert); // Hello, then 1, then 2

alert("Hello")
[1, 2].forEach(alert); // treated as alert("Hello")[1, 2].forEach(alert) — broken
```

**Thoughts:** ASI — вот почему руководства по стилю предпочитают точки с запятой — ошибки редки, но их трудно обнаружить.

**Sources:** [javascript.info/structure](https://javascript.info/structure) · [MDN ASI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#automatic_colon_insertion)

</details>

<details>
  <summary>Expressions</summary>

### Expressions

**Definition:**

Выражение принимает значение; операторы выполняют действия и могут содержать выражения.

| Тип выражения | Пример |
| --------------- | ------------------------- |
| Арифметика | `3 + 4` → `7`             |
| Строка | `'Hello ' + 'World'`      |
| Логический | `true && false` → `false` |
| Назначение | `x = 10` → `10`           |

**Thoughts:** Каждое выражение создает значение (кроме выброшенных ошибок).

</details>

<a name="operators"></a>
## Operators

<details>
  <summary>Operators</summary>

### Operators

**Definition:**

Операторы выполняют действия с операндами — арифметические, присваивания, сравнения, логические и т. д.

| Тип | Операторы |
| ---------- | --------- |
| Арифметика | `+`, `-`, `*`, `/`, `%`, `**` |
| Назначение | `=`, `+=`, `-=`, `??=` |
| Сравнение | `==`, `===`, `>`, `<`, `!==`, `!=` |
| Логический | `&&`, `\|\|`, `!`, `??` |
| Побитовый | `&`, `\|`, `^`, `~`, `<<`, `>>`, `>>>` |
| Тройная | `cond ? a : b` |

**Sources:** [Операторы MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators)

</details>

<details>
  <summary>Math operators</summary>

### Math operators

**Definition:** Арифметические и унарные операторы над числами; `+` также объединяет строки, если любой из операндов является строкой.

**How it works:**

- `+` со строкой → объединение строк; в противном случае числовое добавление (с принуждением).
- `-`, `*`, `/`, `%`, `**` преобразовать операнды в числа.
- Унарный `+x` принуждает к номеру; унарный `-x` отрицает.
- `++`/`--` префикс возвращает новое значение; postfix возвращает старое значение, а затем обновляет.
- `%` это остаток, а не математический модуль для отрицаний.
- Назначение `=` является оператором: он записывает, а затем **возвращает** присвоенное значение, поэтому `a = b = c = 2` цепи справа налево. Предпочитайте отдельные строки для удобства чтения.
- Запятая `,` вычисляет слева направо и возвращает **последнее** значение (`(1 + 2, 3 + 4)` → `7`). Редкий снаружи `for` инициализировать; знайте это при чтении кода библиотеки.

**When to use:** Использовать `Number(x)` or `+x` за явное принуждение; всегда передавайте систему счисления в `parseInt(s, 10)`.

**Pluses and minuses:**

| + | − |
|------|------|
| `**` для возведения в степень | `+` двойная роль вызывает ошибки |
| Унарный `+` быстрое принуждение | Округление с плавающей запятой (IEEE-754) |

**Examples:**

```js
"5" + 1;  // '51' (string concat)
"5" - 1;  // 4 (numeric coercion)
+"42";    // 42
parseInt("08", 10); // 8
Number.isFinite(42); // true
1n + 2n;  // 3n — bigint, cannot mix with number without conversion

let a, b, c;
a = b = c = 2 + 2; // all 4
let x = (1 + 2, 3 + 4); // 7 — comma returns last
```

**Sources:** [javascript.info/operators](https://javascript.info/operators)

</details>

<details>
  <summary>Comparisons</summary>

### Comparison operators

**Definition:** Операторы сравнения возвращают логические значения (или управляют `sort` компараторы). `===` избегает принуждения; `==` сначала принуждает.

**How it works:**

- `===` / `!==` — без преобразования типов; разные типы всегда неравны.
- `==` / `!=` — применять абстрактные правила равенства (удивительно, `''`, `0`, `false`).
- Реляционный `>`, `<`, `>=`, `<=` — обычно конвертируют в числа; строки сравниваются лексикографически, если обе строки являются строками.
- `Object.is` для крайних случаев (`NaN`, знак нуля) — см. [Object.is и равенство](#object-is-and-equality).
- **`null` / `undefined` причуды:** `null == undefined` is `true`, но ни одно из них не равно никакому другому значению с `==`. Реляционные операции преобразования `null` → `0` и `undefined` → `NaN`, so `null >= 0` is `true` пока `null > 0` и `null == 0` оба `false`.

**When to use:** По умолчанию `===`; `value == null` для нулевого/неопределенного; Компараторы числовой сортировки возвращают отрицательный/ноль/положительный результат. **не** используйте `>`, `<`, `>=`, `<=` по значению, которое может быть `null`/`undefined` — проверьте их отдельно.

**Pluses and minuses:**

| Подход | + | − |
|----------|------|------|
| `===` | Предсказуемый | Подробные проверки на ноль |
| `==` | `null == undefined` | Пулеметы (`'' == 0`) |
| `Object.is` | Правильный `NaN` | Ниша |

**Examples:**

```js
null === undefined; // false
null == undefined;  // true
"2" > "12";         // true — string compare
"2" > 12;           // false — number compare

null > 0;   // false
null == 0;  // false — == has a special null/undefined rule
null >= 0;  // true  — >= converts null → 0
undefined > 0;  // false (NaN)
undefined == 0; // false
```

**Sources:** [javascript.info/comparison](https://javascript.info/comparison)

</details>

<details>
  <summary>Object.is & equality</summary>

### Object.is & equality

**Definition:** Множественные механизмы равенства: `==` (принуждение), `===` (строгий), `Object.is` (то же значение) и `SameValueZero` (используется `Map`/`Set`).

**How it works:**

- `===` — того же типа и значения; `NaN !== NaN`, `+0 === -0`.
- `Object.is` - нравиться `===` но `Object.is(NaN, NaN)` is `true`, `Object.is(+0, -0)` is `false`.
- `SameValueZero` — `Map`/`Set` поиск ключей; `NaN` равно `NaN`.
- `==` — приводит операнды (избегайте, кроме `value == null`).

| Сравнение | `NaN === NaN` | `+0 === -0` | Принуждение |
|------------|---------------|-------------|----------|
| `===` | ложный | правда | нет |
| `Object.is` | правда | ложный | нет |
| `==` | ложный | правда | да |

**When to use:** `Object.is` для `NaN` чеки; `===` повсюду; `Number.isNaN(x)` для одного значения `NaN` тест без принуждения.

**Pluses and minuses:**

| + (`Object.is`) | − |
|----|----------------------|
| Правильный `NaN` чеки | Редко требуется против `===` |
| Отличает `+0`/`-0` | Не используется `Map`/`Set` (SameValueZero) |

**Examples:**

```js
NaN === NaN;              // false
Object.is(NaN, NaN);      // true
Object.is(+0, -0);        // false
+0 === -0;                // true

const m = new Map();
m.set(NaN, "val");
m.get(NaN);               // 'val' — SameValueZero
```

**Sources:** [MDN Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

</details>

<details>
  <summary>Logical operators</summary>

### Logical operators

**Definition:** `&&`, `||`, `!`, и `??` используйте **короткую** оценку — они возвращают решающий операнд, не всегда логическое значение.

**How it works:**

- `a || b` — if `a` это правда, вернись `a`; еще `b`.
- `a && b` — if `a` неверно, верните `a`; еще `b`.
- `!a` — логическое отрицание после приведения.
- `a ?? b` — if `a` is `null`/`undefined`, возвращаться `b`; еще `a`.
- Общий шаблон: `user && greet(user)`; `name || 'Guest'`.

| Оператор | Возврат |
| -------- | ------- |
| `\|\|` | Первая правдивая (или последняя, ​​если все ложь) |
| `&&` | Первая ложь (или последняя, ​​если все правдиво) |
| `??` | Вправо, только если значение левого равно нулю |
| `!` | Логическое |

**When to use:** `??` для настроек по умолчанию; `||` когда любая ложь должна отступить; `&&` для условного исполнения.

**Pluses and minuses:**

| + | − |
|------|------|
| Краткие значения по умолчанию и защита | `||` лечит `0`/`''` как пропавший |
| Короткое замыкание позволяет избежать дополнительной работы | `??`/`||` для смешивания нужны скобки |

**Examples:**

```js
0 || "default";  // 'default'
0 ?? "default";  // 0
name && greet(name);
config.debug ?? false;
```

**Sources:** [javascript.info/ological-operators](https://javascript.info/ological-operators) · [javascript.info/nullish-coalescing-operator](https://javascript.info/nullish-coalescing-operator)

</details>

<details>
  <summary>Bitwise operators</summary>

### Bitwise operators (basics)

**Definition:** Операторы, обрабатывающие числа как 32-битные целые числа: `&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`.

**How it works:**

- Операнды перед операцией преобразуются в 32-битные целые числа со знаком.
- `&` И, `|` OR, `^` исключающее ИЛИ, `~` НЕ, сдвиги перемещают биты влево/вправо.
- `>>>` беззнаковый сдвиг вправо заполняется нулем.

**When to use:** Флаги разрешений, хеш-трюки, библиотеки, критичные к производительности. Большинству кода приложения никогда не требуются побитовые операции.

**Pluses and minuses:**

| + | − |
|------|------|
| Быстрые флаги и маски | Редко в типичном коде приложения |
| Низкоуровневые битовые трюки | 32-битное ограничение на побитовые операции |

**Examples:**

```js
5 & 1;   // 1 — odd check
1 << 3;  // 8 — multiply by 8 via shift
```

**Sources:** [javascript.info/bitwise-operators](https://javascript.info/bitwise-operators)

</details>

<details>
  <summary>Optional chaining and nullish</summary>

### Optional chaining (`?.`) & nullish coalescing (`??`)

**Definition:** `?.` короткое замыкание на `null`/`undefined` вместо того, чтобы бросать. `??` возвращает правую часть только тогда, когда левая `null` or `undefined`.

**How it works:**

- `obj?.prop`, `obj?.[expr]`, `fn?.()` — останавливается на первом нулевом шаге.
- `??` отличается от `||`: `0 ?? 1` is `0`; `0 || 1` is `1`.
- С осторожностью сочетайте: `a ?? b || c` нужны круглые скобки в соответствии с правилами языка.
- Короткие замыкания: `user?.sayHi(x++)` **не** оценивает `x++` if `user` является нулевым.
- Переменная раньше `?.` должно быть **объявлено** — необъявлено `user?.x` все еще является `ReferenceError`.
- **Только чтение/удаление** — `user?.name = "John"` недействителен (присваивается `undefined`).
- Не злоупотребляйте: если `user` должно быть, напишите `user.address?.street` так что пропал `user` все равно бросает.

**When to use:** Дополнительные поля API, связанная конфигурация, по умолчанию только для нулевых значений (`??`), не все ложно (`||`).

**Pluses and minuses:**

| + | − |
|------|------|
| Безопасный глубокий доступ без вложенных `if` | Может скрывать ошибки данных (тихий `undefined`) |
| `??` сохраняет `0` и `''` | Смешивание `??` и `||` нужны скобки |

**Examples:**

```js
const user = null;
user?.profile?.name; // undefined — no throw
userAdmin.admin?.(); // call only if method exists
user?.[key];

0 || "default";  // 'default'
0 ?? "default";  // 0

const port = config.port ?? 3000;
```

**Sources:** [javascript.info/optional-chaining](https://javascript.info/optional-chaining) · [javascript.info/nullish-coalescing-operator](https://javascript.info/nullish-coalescing-operator)

</details>

<a name="control-flow"></a>
## Control flow

<details>
  <summary>if, else, and ternary</summary>

### Conditional branching

**Definition:** `if`/`else` запускать утверждения на основе истинных/ложных значений; тройной `cond ? a : b` — это **выражение**, возвращающее значение.

**How it works:**

- Условие приводит к логическому значению (falsy: `false`, `0`, `''`, `null`, `undefined`, `NaN`, `0n`).
- `else if` объединяет несколько условий; победа в первом матче.
- Тройные гнезда, но предпочитают `if` для удобочитаемости, когда он сложный.
- `switch` использует `===` против каждого `case` (см. раздел циклов).

**When to use:** `if` для многолинейных филиалов; троичный для простого назначения/рендеринга; рано `return` чтобы сгладить логику.

**Pluses and minuses:**

| + | − |
|------|------|
| Очистить поток управления | Глубокая вложенность, трудно читать |
| Тернарный код удобен в JSX/заданиях | Легко опустить скобки и внести ошибки |

**Examples:**

```js
const age = 20;
const label = age < 18 ? "minor" : "adult";

if (age >= 18) {
  console.log("adult");
} else if (age >= 13) {
  console.log("teen");
} else {
  console.log("child");
}
```

**Sources:** [javascript.info/ifelse](https://javascript.info/ifelse)

</details>

<details>
  <summary>Loops and switch</summary>

### Loops, break, continue & switch

**Definition:** Циклы повторяют код; `break` выходит из цикла/переключателя; `continue` переходит к следующей итерации. `switch` спички `case` с `===`.

**How it works:**

- `while` — тест перед кузовом; может выполняться ноль раз.
- `do...while` — тело хотя бы один раз.
- `for (init; cond; step)` — классический счетчик; использовать `let` для привязки для каждой итерации.
- `for...of` — перебирает **значения** итерируемых объектов.
- `for...in` — перебирает **ключи** (включая наследуемые); фильтр с `Object.hasOwn`.
- `switch` - **всегда `===`**; провал без `break`.
- Этикетки: `outer: for (...) { ... break outer; }` выходит из помеченного цикла (необходим для вложенных циклов). `continue outer` переходит к следующей итерации этого цикла.

| Построить | Использование |
| --------- | --- |
| `while` | Неизвестные итерации, сначала условие |
| `do...while` | Хотя бы один запуск |
| `for` | Индексные счетчики |
| `for...of` | Массивы, строки, Карта, Набор |
| `for...in` | Ключи объекта (с `hasOwn`) |
| `switch` | Многие дискретные равные значения |

**When to use:** Массивы → `for...of` or `map`; объекты → `Object.entries` + `for...of`; перечисления → `switch`; обычай/`function*` последовательности → [Итераторы](#итераторы); асинхронные циклы → см. [3_js_async.md](./3_js_async.md).

**Pluses and minuses:**

| + | − |
|------|------|
| `for...of` очистить итерации | `for...in` на массивах глючит |
| `switch` читаемый для перечислений | Проходные пистолеты; `===` vs `prompt` струны |
| `break`/`continue` поток управления | Этикетки нужны редко |

**Examples:**

```js
for (let i = 0; i < 3; i++) console.log(i);

for (const v of ["a", "b"]) console.log(v);

for (const key in obj) {
  if (!Object.hasOwn(obj, key)) continue;
  console.log(key, obj[key]);
}

outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (!input) break outer; // leave both loops
  }
}

switch (status) {
  case "active":
    handleActive();
    break;
  case "draft":
  case "pending":
    handleDraft();
    break;
  default:
    handleUnknown();
}
```

**Sources:** [javascript.info/ while-for](https://javascript.info/ while-for) · [javascript.info/switch](https://javascript.info/switch)

</details>

<details>
  <summary>for...in vs for...of — extended</summary>

### for...in vs for...of

**Definition:** `for...in` ходит по перечисляемым ключам (в том числе наследуемым); `for...of` потребляет повторяемые значения.

**Examples:**

```js
for (const key in obj) {
  if (Object.hasOwn(obj, key)) console.log(key, obj[key]);
}
for (const ch of "hi") console.log(ch);
```

**Sources:** [javascript.info/array#loops](https://javascript.info/array#loops)

</details>


<details>
  <summary>Error handling</summary>

### Error handling

**Definition:** Использовать `try/catch/finally` для синхронных ошибок; подкласс `Error` за ошибки домена; оберните сбои низкого уровня в типы более высокого уровня на границах API.

**How it works:**

- `try` запускает код; `catch` получает выброшенное значение (любого типа, обычно `Error`).
- `finally` запускается всегда — очистка, закрытие ресурсов.
- Необнаруженные ошибки распространяются вверх по стеку вызовов, пока не будут обнаружены или произойдет сбой.
- `throw new Error('msg')` - предпочитать `Error` объекты поверх строк.
- **Пользовательская иерархия:** `class ValidationError extends Error` затем `PropertyRequiredError extends ValidationError` — сверьтесь с `instanceof` (работает для подклассов).
- Набор `this.name = this.constructor.name` (или общий `MyError` база) так что `err.name` соответствует классу.
- **Упаковка:** улов `SyntaxError` / `ValidationError` внутри `readUser`, бросать `ReadError` с `cause` — вызывающие объекты обрабатывают один тип.
- Восстановить неизвестные ошибки в `catch` — не проглатывайте ошибки программирования.
- `try/catch` **не** перехватывает асинхронные ошибки, запланированные позже (`setTimeout` бросить) — использовать обещание `.catch` / `async` `try`.

**When to use:** Анализ JSON, проверка пользовательского ввода, оболочки границ API. Лог + повторный бросок на верхнем уровне; обрабатывать ожидаемые ошибки локально.

**Pluses and minuses:**

| + | − |
|------|------|
| Локальное восстановление без сбоев | Легко проглатывать ошибки молча |
| `finally` гарантирует очистку | try/catch имеет незначительные затраты на производительность в горячих путях |
| Иерархия + `instanceof` весы | Должен помнить `super(message)` в подклассах |

**Examples:**

```js
try {
  JSON.parse("{ invalid");
} catch (err) {
  console.error(err.message);
} finally {
  // cleanup always runs
}

class MyError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ValidationError extends MyError {}
class PropertyRequiredError extends ValidationError {
  constructor(property) {
    super("No property: " + property);
    this.property = property;
  }
}

class ReadError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "ReadError";
  }
}
```

**Sources:** [javascript.info/try-catch](https://javascript.info/try-catch) · [javascript.info/custom-errors](https://javascript.info/custom-errors)

</details>


<a name="iterators"></a>
## Iterators

<details>
  <summary>Iterators and generators</summary>

### Iterators & generators

**Definition:** **Итерируемый протокол** позволяет объектам работать с `for...of`, распространение и деструктуризация. **Итератор** раскрывает `.next()` → `{ value, done }`. **Генераторы** (`function*`) являются синтаксическим сахаром для итераторов.

**How it works:**

- Итерируемый: объект с `[Symbol.iterator]()` возвращение итератора.
- Итератор: объект с `next()` возвращение `{ value, done }`.
- `for...of` звонки `Symbol.iterator` затем циклы `.next()` до `done: true`.
- Генератор: `function*` автоматически реализует итератор; `yield` излучает значения; `yield* otherGen` делегаты (состав).
- `generator.throw(err)` / `.return(value)` внести ошибку или завершить работу раньше времени; `yield` является двусторонним — `next(arg)` становится результатом приостановленного `yield`.
- **Массивы** имеют `length` + индексированные реквизиты, но могут отсутствовать `Symbol.iterator` - использовать `Array.from`.

| Встроенные итерации | Заметки |
| ------------------ | ----- |
| `Array`, `String` | `for...of`, распространение |
| `Map`, `Set` | `Map` повторяет записи как `[key, value]` |
| `arguments`, коллекции ДОМ | Похожий на массив; использовать `Array.from` |

**When to use:**

| Нужна | Подход |
|------|----------|
| Циклический массив/строка | `for...of` |
| Преобразование в виде массива | `Array.from(nodeList)` |
| Ленивая последовательность | `function*` генератор |
| API пользовательской коллекции | Осуществлять `Symbol.iterator` |

**Pluses and minuses:**

| + | − |
|------|------|
| Унифицированный синтаксис цикла | Пользовательские итерации нужны редко |
| Ленивые генераторы экономят память | Отладка генератора сложнее |
| Составной с разворотом | Подобными массивами легко злоупотребить |

**Examples:**

```js
const iterable = {
  [Symbol.iterator]() {
    let step = 0;
    return {
      next() {
        step++;
        return step <= 3 ? { value: step, done: false } : { done: true };
      },
    };
  },
};

for (const n of iterable) console.log(n); // 1, 2, 3
```

```js
function* idGenerator() {
  let id = 1;
  while (true) yield id++;
}
const gen = idGenerator();
gen.next().value; // 1
[...idGenerator()].slice(0, 3); // [1, 2, 3] — careful with infinite!
```

```js
Array.from("hi"); // ['h', 'i']
Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]
```

**Sources:** [javascript.info/iterable](https://javascript.info/iterable) · [javascript.info/generators](https://javascript.info/generators) · [javascript.info/array](https://javascript.info/array) · [MDN: Итерация протоколы] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)

</details>

<details>
  <summary>switch — extended notes</summary>

### switch — fall-through & types

**Definition:** Без `break`, выполнение переходит к следующему `case`. Использовать `break` если провал не является преднамеренным. Соответствие всегда **строгое** (`===`) — типы должны совпадать.

**How it works:**

- Группировка дел (`case 2: case 3: ...`) разделяет одно тело посредством намеренного провала.
- `prompt` / значения формы — **строки**. `case 3:` никогда не совпадает `"3"` от `prompt` - использовать `case '3':` или принудить(`+prompt(...)`) первый.

**Examples:**

```js
switch (x) {
  case 1:
    console.log("one");
    break;
  case 2:
  case 3:
    console.log("two or three"); // grouped
    break;
  default:
    console.log("other");
}

const arg = prompt("Enter a value?"); // string | null
switch (arg) {
  case "0":
  case "1":
    console.log("one or zero");
    break;
  case 3:
    console.log("never runs for prompt — types differ");
    break;
  default:
    console.log("unknown");
}
```

**Sources:** [javascript.info/switch](https://javascript.info/switch)

</details>
