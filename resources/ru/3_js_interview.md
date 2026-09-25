# JS — Interview

Интервью с вопросами и ответами и задания по кодированию для JavaScript.

[ ← Назад в JS-хаб](./3_js.md)

### Related docs

- [Язык](./3_js_core.md) · [Операторы и циклы](./3_js_operators.md) · [Массивы](./3_js_array.md) · [Функции](./3_js_functions.md) · [Классы и объекты](./3_js_oop.md)
- [Документ](./3_js_browser.md) · [События](./3_js_events.md) · [API браузера](./3_js_browser_extra.md) · [Async](./3_js_async.md)

### Sections

- [Questions & Answers](#questions-answers)
- [Coding tasks](#coding-tasks)

---

## Questions & Answers

<details>
  <summary>Is JavaScript an interpreted language?</summary>

### Is JavaScript an interpreted language?

**Нет единой метки.** Языки AOT (C, Go) компилируют всю программу перед запуском. Классические интерпретаторы переводят построчно (скрипты в стиле Perl/PHP). JS не является ни полноценным.

- `SyntaxError` в строке 2 → **ничего** не запускается (анализ всего скрипта).
- Идентификатор с ошибкой → `ReferenceError` **после** предыдущих строк.
- `function` объявления **подъем** (`praise()` может появиться над телом) — не построчная интерпретация.
- Движки **JIT**: интерпретатор холодного кода; горячие пути со стабильными типами компилируются (могут деактивироваться). MDN по-прежнему называет JS «интерпретируемым», потому что компиляция происходит **во время выполнения**, а не AOT.

Полный конвейер: [Конвейер движка JavaScript](#javascript-engine-pipeline).Модель памяти для фреймов и объектов: [Память: стек и куча](./3_js_variables.md#memory-stack-heap).

**Sources:** [MDN — Что такое JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_is_JavaScript) · [Doka — память](https://doka.guide/js/how-the-memory-works/)

</details>

<details>
  <summary>Stack vs heap — what lives where?</summary>

### Stack vs heap — what lives where?

**Stack:** кадры вызова (аргументы, локальные значения, адрес возврата), push/pop через указатель стека. **Куча:** динамические данные/данные неизвестного размера (объекты, растущие массивы); фрейм хранит ссылку. `throw` разматывает кадры (трассировка стека). Переполнение ≠ кучи ООМ. Модель + примеры: [Память: стек и куча](./3_js_variables.md#memory-stack-heap).

</details>

<details>
  <summary>What are JavaScript data types?</summary>

### What are JavaScript data types?

Полную таблицу типов см. в разделе **Типы данных**. `typeof` особенности, шаблоны проверки типов и интересные крайние случаи (NaN, ключи объекта, приведение).

**Sources:** [javascript.info/types](https://learn.javascript.ru/types)

</details>

<details>
  <summary>var vs let vs const?</summary>

### var vs let vs const?

**Definition:**

`var` является функциональной областью действия; `let`/`const` имеют блочную область действия с TDZ; `const` предотвращает повторное связывание.

|                    | `var`                        | `let`             | `const`                                         |
| ------------------ | ---------------------------- | ----------------- | ----------------------------------------------- |
| Область применения | функция                      | блокировать       | блокировать                                     |
| Подъем             | да (не определено до строки) | ТДЗ до декларации | ТДЗ                                             |
| Переназначить      | да                           | да                | нет (обязательно);содержимое объекта изменяемое |

Предпочитать `const` по умолчанию; `let` при перепривязке; избегать `var` в новом коде.

**Sources:** [javascript.info/let-const](https://learn.javascript.ru/let-const)

</details>

<details>
  <summary>What is hoisting and TDZ?</summary>

### What is hoisting and TDZ?

**Definition:** Поднятие регистров объявлений перед выполнением; ТДЗ блокирует доступ к `let`/`const` до их строки декларации.

**Examples:**

```js
console.log(a); // undefined (var)
var a = 1;
console.log(b); // ReferenceError — TDZ
let b = 2;
```

**Sources:** [javascript.info/var](https://learn.javascript.ru/var)

</details>

<details>
  <summary>What is a closure?</summary>

### What is a closure?

**Definition:**

Функция, которая сохраняет доступ к внешним лексическим привязкам после завершения работы внешней функции.

См. [Типы данных и переменные — замыкания](./3_js_variables.md#closures) для цикла/`var` подводные камни и GC.

**Examples:**

```js
function makeAdder(x) {
  return (y) => x + y;
}
const add5 = makeAdder(5);
add5(3); // 8
```

**Sources:** [javascript.info/closure](https://learn.javascript.ru/closure)

</details>

<details>
  <summary>What are Signals? Why no effect() in the proposal?</summary>

### What are Signals? Why no effect() in the proposal?

**Definition:** записываемый `Signal.State` + ленивый `Signal.Computed`. Читает во время автоматической регистрации источников вычисляемого обратного вызова. `set()` рисует график(`dirty` / `checked`); `get()` лениво пересчитывает. Сравнение по умолчанию `Object.is`.

**How it works:** `Watcher.notify` синхронен внутри `set()`. React, Angular и Solid расходятся во мнениях относительно того, **когда** должны проявляться побочные эффекты. Стандарт предоставляет замороженный крючок для уведомлений; расписание фреймворков (микрозадача, фаза рендеринга, компакт-диск без зоны). `AbortSignal` это другой API.

**Examples:**

```js
const n = new Signal.State(0);
const doubled = new Signal.Computed(() => n.get() * 2);
n.set(0); // Object.is same → no paint
n.set(1);
doubled.get(); // 2 — lazy recompute on pull
```

См. [Сигналы (TC39)](./3_js_extra.md#signals) для динамических депс, ромба, Watcher. `effect`, `equals`, `untrack`.

**Sources:** [предложение-сигналы](https://github.com/proposal-signals/proposal-signals)

</details>

<details>
  <summary>typeof null, coercion, == vs ===?</summary>

### typeof null, coercion, == vs ===?

**Definition:** `typeof null === "object"` — это языковая ошибка из первой реализации JS (нулевой тег как объект). `===` сравнивает без принуждения; `==` применяет абстрактное равенство (ToNumber, ToPrimitive).

**How it works:**

Предпочитать `===` / `!==`. Полезное `==` исключение: `value == null` верно для обоих `null` и `undefined` только. `Number.isNaN` не принуждает; глобальный `isNaN` делает.

| ловушка          | Результат  | Предпочитаю      |
| ---------------- | ---------- | ---------------- |
| `typeof null`    | `"object"` | `value === null` |
| `[] == false`    | `true`     | `===`            |
| `isNaN("hello")` | `true`     | `Number.isNaN`   |

**Thoughts:**

`===` по умолчанию; `== null` только для нулевых; никогда не доверяй `typeof` для нуля.

См. **Типы данных → Интересные случаи** и **Типы данных → Преобразования типов**.

**Sources:** [javascript.info/comparison](https://learn.javascript.ru/comparison) · [MDN Равенство](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)

</details>

<details>
  <summary>Map/Set vs WeakMap/WeakSet?</summary>

### Map/Set vs WeakMap/WeakSet?

**Definition:**

`Map`/`Set` содержат **сильные** ссылки, являются повторяемыми и предоставляют доступ `.size`. `WeakMap`/`WeakSet` хранить **слабые** ссылки на объекты, чтобы записи исчезали, когда объект больше не доступен где-либо еще.

|                        | `Map` / `Set`                       | `WeakMap` / `WeakSet`                                |
| ---------------------- | ----------------------------------- | ---------------------------------------------------- |
| Типы ключ/значение     | Любой (`Map` ключи, `Set` ценности) | Только объекты                                       |
| Итерируемый            | Да                                  | Нет                                                  |
| `.size`                | Да                                  | Нет                                                  |
| ГК                     | Сохраняет ключи/значения            | Позволяет собирать ключи/значения объектов           |
| Типичное использование | Кэши, индексы, дедупликация         | Частные метаданные, теги DOM, «просмотренные» наборы |

**When to use:**

`Map` когда ключи не являются строками или вам нужна итерация/размер; `Set` за уникальность. `WeakMap` для данных на стороне объекта без утечек памяти; `WeakSet` для обозначения ссылок на обработанные объекты.

См. **Типы данных → Map & Set & WeakMap & WeakSet** для получения полных примечаний по API, подводных камней и примеров.

**Sources:** [javascript.info/weakmap-weakset](https://learn.javascript.ru/weakmap-weakset)

</details>

<details>
  <summary>Deep vs shallow copy?</summary>

### Deep vs shallow copy?

**Definition:** Неглубокое копирование разделяет вложенные ссылки; глубокая копия клонирует все дерево.

**How it works:**

`Object.assign`, распространение, `arr.slice()`.

`structuredClone()` (современный), `JSON` туда и обратно (ограниченный) или рекурсивный обход.

**Sources:** [MDN StructuredClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)

</details>

<details>
  <summary>Type checks & comparison (practice)</summary>

### Type checks & comparison (practice)

Спрогнозируйте результат, а затем проверьте **Типы данных → Интересные случаи** и **Задачи 1–2** ниже.

```js
console.log(typeof null);
console.log(typeof []);
const fn = () => {};
console.log(fn instanceof Function);
console.log(1 == "1");
console.log({ a: 1 } === { a: 1 });
const a = {};
const b = {};
a[b] = "1";
console.log(Object.keys(a));
```

| Выражение                | Результат             | Почему                                 |
| ------------------------ | --------------------- | -------------------------------------- |
| `typeof null`            | `"object"`            | Устаревшая ошибка                      |
| `typeof []`              | `"object"`            | Массивы являются объектами             |
| `fn instanceof Function` | `true`                | Функции являются вызываемыми объектами |
| `1 == '1'`               | `true`                | Принуждение                            |
| `{a:1} === {a:1}`        | `false`               | Ссылка сравнить                        |
| `Object.keys(a)`         | `['[object Object]']` | Ключи объекта преобразуются в строку   |

**Sources:** [javascript.info/types](https://learn.javascript.ru/types)

</details>

<details>
  <summary>Junior — General (core subset)</summary>

### Junior — General (core subset)

**Definition:**

Вопросы для собеседования начального уровня о строгом режиме, наборе текста, изменчивости и отладке.

7. Что означает `use strict` директива значит?
8. Чем JS отличается от внешнего интерфейса от внутреннего?
9. Что такое статическая и динамическая типизация?
10. Объясните изменчивость и неизменность — какие типы являются изменяемыми?
11. Как вы отлаживаете код? Используете ли вы отладчик?
12. Известные люди в экосистеме JS?

</details>

<details>
  <summary>Junior — JS Core</summary>

### Junior — JS Core

**Definition:**

Фундаментальные вопросы языка: типы, массивы, операторы, область видимости и коллекции. Ответы метода массива: [JS Arrays](./3_js_array.md#interview-practice).

15. Какие типы данных существуют в JS?
16. Как проверить, является ли значение массивом?
17. Как проверить, конечно ли число?
18. Как проверить наличие `NaN`?
19. `isNaN()` vs `Number.isNaN()`?
20. Сравните `var`, `let`, `const`.
21. Что такое объем?
22. Что такое деструктуризация?
23. Что такое `setTimeout` / `setInterval` для?
24. Обратные вызовы против обещаний против `async/await`?
25. Можете ли вы расширить встроенные прототипы (`Array`, `Object`)? Риски?
26. Назовите методы массива и их назначение.
27. Методы итерации по массивам — отличия?
28. Операторы присваивания, сравнения, логические, поразрядные?
29. `Map` и `Set` — назначение и использование?
30. Глубокий и поверхностный текст — как сделать каждый?

</details>

<details>
  <summary>Middle — JS Core</summary>

### Middle — JS Core

**Definition:**

Промежуточные темы: прототипы, приведение, GC, промисы, дескрипторы, типизированные массивы, символы.

10. JS-типы — какие логи при переназначении ссылки на объект?
11. Что такое временная мертвая зона?
12. Бокс/распаковка в JS?
13. `in` vs `hasOwnProperty`?
14. Инкапсуляция, полиморфизм, абстракция в JS?
15. Прототипы — что и когда логи `Main.prototype` заменяется после `new`?
16. Композиция против наследования?
17. Почему следует избегать `new String()`?
18. Основы цикла событий?
19. Записи и кортежи против простых объектов?
20. Конструктор ES5 или класс ES2015?
21. Реализация шаблона модуля?
22. Почему `typeof null === 'object'`?
    23–24. Введите упражнения по принуждению.
    25–26. Принципы сбора мусора?
23. `WeakMap` / `WeakSet` vs `Map` / `Set`?
24. Наблюдаемое или обещанное?
25. Упражнение по упорядочению цепочки обещаний?
26. `Promise.all` vs `Promise.allSettled`?
27. Дескрипторы свойств?
    32–33. Неизменяемые/недоступные для записи объекты?
28. `Proxy` варианты использования?
29. `ArrayBuffer`, типизированные массивы?
30. `encodeURI` vs `encodeURIComponent`?
    37–38. Генераторы/итераторы — трассировка `function*` пример?
31. `Symbol` и преобразование системы счисления?

</details>

<details>
  <summary>JS Core</summary>

### JS Core (patterns)

**Definition:**

Архитектурные шаблоны, выходящие за рамки синтаксиса: ООП без классов, асинхронный диспоузер, дисциплина RegExp.

8. Бесклассовый шаблон ООП.
9. Шаблон асинхронного избавителя.
10. Регулярные выражения — если это приемлемо, советы по читабельности.

</details>

<details>
  <summary>Junior — Practice tasks</summary>

### Junior — Practice tasks

**Definition:**

Практические упражнения: копирование объектов, клонирование, замена переменных и небольшой CRUD-проект.

135. Способы копирования простого объекта `{ a: 1, b: 2, c: 3 }`?
136. Реализуйте глубокое клонирование.
137. Поменять местами две переменные — разные техники?
138. Заменить магические номера статуса именованными константами?
139. Мини-пользовательский CRUD-проект (Firebase + Bootstrap).

</details>

<details>
  <summary>Middle — Practice tasks (core)</summary>

### Middle — Practice tasks (core)

**Definition:**

Реализации утилит: анализ запросов и операции над массивами.

145. Строка URL-запроса в JSON (`queryObjectify`).
146. Пересечение двух массивов.

</details>

<details>
  <summary>Practice tasks</summary>

### Practice tasks

**Definition:** Рекурсивный `reduce` живет в [JS Arrays — Interview Practice](./3_js_array.md#interview-practice).

</details>

<details>
  <summary>`map`, `forEach`, `reduce` — how do they work?</summary>

### `map`, `forEach`, `reduce` — how do they work?

**Definition:**

Массив методов высшего порядка, которые выполняют итерацию с обратным вызовом `(element, index, array)`.

| Метод               | Возврат                     | Использование                                                            |
| ------------------- | --------------------------- | ------------------------------------------------------------------------ |
| `map(fn)`           | Новый массив той же длины   | Преобразуйте каждый элемент                                              |
| `forEach(fn)`       | `undefined`                 | Только побочные эффекты — нет возвращаемого значения, невозможно `break` |
| `reduce(fn, init?)` | Единое накопленное значение | Сложить массив в один результат                                          |

**How it works:**

- `map` — возврат обратного вызова становится новым элементом; оригинал без изменений.
- `forEach` - нравиться `map` но отбрасывает возврат; использовать `for...of` если тебе нужно `break`.
- `reduce` - перезвонить `(acc, item) => nextAcc`; предоставлять `init` на возможно пустых массивах.

**Examples:**

```js
[1, 2, 3].map((n) => n * 2); // [2, 4, 6]
[1, 2, 3].forEach((n) => console.log(n)); // logs 1, 2, 3
[1, 2, 3].reduce((sum, n) => sum + n, 0); // 6
```

**Thoughts:** _`map` трансформирует, `forEach` действия, `reduce` агрегаты._

**See also:** [Трансформация и поиск](#трансформация-и-поиск) (полная теория)

</details>

<details>
  <summary>`reduce` vs `map` — when to use which?</summary>

### `reduce` vs `map` — when to use which?

**Definition:**

`map` всегда возвращает массив одинаковой длины; `reduce` возвращает любой тип — число, объект, карту и т. д.

|            | `map`                       | `reduce`                                   |
| ---------- | --------------------------- | ------------------------------------------ |
| Выход      | Массив (той же длины)       | Любой тип                                  |
| Лучшее для | Преобразуйте каждый предмет | Агрегировать, группировать, строить объект |
| Цепной     | Да (`map().filter()`)       | Обычно терминал                            |

**How it works:**

Суммирование, подсчет, группировка, выравнивание, построение `{ subtotal, tax, total }` объект из корзины.

Переименовывайте поля, форматируйте отображаемые значения, извлекайте идентификаторы.

**Thoughts:** _Если вам нужно одно значение или объект из массива, обратитесь к `reduce`._

</details>

<details>
  <summary>What is the accumulator in `reduce`?</summary>

### What is the accumulator in `reduce`?

**Definition:** Аккумулятор (`acc`) — это значение, передаваемое от одной итерации к следующей — «текущий результат».

**How it works:**

```js
[10, 20, 30].reduce((acc, price) => acc + price, 0);
// acc: 0 → 10 → 30 → 60
```

- Первый аргумент обратного вызова: `acc`; возвращаемое значение становится `acc` для следующего шага.
- Без `init` в непустом массиве первый элемент используется как начальный `acc` (рискованно на пустых массивах → `TypeError`).

**When to use:** Сумма · максимальное значение · `{ count, total }` объект · `Map` сгруппированных предметов.

**Thoughts:** _Всегда передавайте начальное значение, если массив может быть пустым._

</details>

<details>
  <summary>How to sum an array? Sum with conditional discounts?</summary>

### How to sum an array? Sum with conditional discounts?

**Definition:** Использовать `reduce` складывать значения; применять бизнес-правила внутри обратного вызова.

**How it works:**

```js
const total = prices.reduce((sum, p) => sum + p, 0);
```

```js
const items = [
  { price: 100, category: "food" },
  { price: 200, category: "electronics" },
];
const discounts = { food: 0.1, electronics: 0.2 };

const total = items.reduce((sum, item) => {
  const rate = discounts[item.category] ?? 0;
  return sum + item.price * (1 - rate);
}, 0);
// 100*0.9 + 200*0.8 = 250
```

**Thoughts:** _Сохраняйте чистоту логики агрегирования — одни и те же входные данные всегда дают одинаковый результат._

</details>

<details>
  <summary>How does this work? Context loss?</summary>

### How does this work? Context loss?

**Definition:** `this` определяется местом вызова (кроме стрелок). При извлечении метода теряется его получатель.

**How it works:**

`const fn = obj.method; fn()` — `this` не `obj`.

`fn.bind(obj)`, `obj.method()`, оболочка стрелки или `call`/`apply`.

**Sources:** [javascript.info/object-methods](https://learn.javascript.ru/object-methods)

</details>

<details>
  <summary>bind vs call vs apply?</summary>

### bind vs call vs apply?

**Definition:** Все готово `this`. `call`/`apply` вызвать немедленно; `bind` возвращает новую функцию с фиксированным `this`.

**Examples:**

```js
fn.call(ctx, 1, 2);
fn.apply(ctx, [1, 2]);
const bound = fn.bind(ctx, 1);
bound(2); // same as fn.call(ctx, 1, 2)
```

**Sources:** [javascript.info/call-apply-decorators](https://learn.javascript.ru/call-apply-decorators)

</details>

<details>
  <summary>Why avoid mutations? What is a pure function?</summary>

### Why avoid mutations? What is a pure function?

**Definition:** **Чистая функция** возвращает тот же результат для одного и того же ввода и не имеет побочных эффектов (нет изменения внешнего состояния, нет ввода-вывода).

**How it works:**

- React сравнивает состояние по ссылке — мутирует `state.push(x)` не вызывает повторный рендеринг.
- Общие ссылки вызывают ошибки, когда один потребитель изменяет данные, на которые опирается другой.
- Легче отлаживать, тестировать и анализировать неизменяемые снимки.

| Чистый                      | Нечистый                             |
| --------------------------- | ------------------------------------ |
| `(arr) => [...arr, x]`      | `arr.push(x); return arr`            |
| `reduce` без внешней записи | `fetch`, `console.log`, `Date.now()` |

**Thoughts:** _Предпочитать `map`/`filter`/`reduce` и распространился по `push`/`splice` по общим данным._

**See also:** [Чистые и нечистые функции](#чистые-против-нечистых-функций)

</details>

<details>
  <summary>call / apply / bind (practice)</summary>

### call / apply / bind

**Definition:**

Набор `this` и, возможно, аргументы частичного применения.

Подробные примечания (определение, принцип работы, случаи, плюсы и минусы) см. в разделе **Функции → вызов, применение и привязка**.

**Examples:**

```js
const f = (a, b, c) => a + b + c;
const f1 = f.bind(null, 1, 2);
f1(3); // 6 — bind does not invoke
f.call(null, 1, 2, 3); // 6
f.apply(null, [1, 2, 3]); // 6
```

**Sources:** [javascript.info/call-apply-decorators](https://learn.javascript.ru/call-apply-decorators)

</details>

<details>
  <summary>Junior — Functions</summary>

### Junior — Functions

**Definition:**

Функциональные формы, подъемы, замыкания, `this`и привязка метода.

31. Объявление функции или выражение функции?
32. Что такое анонимная функция?
33. Стрелочные функции — отличия от обычных функций?
34. Что такое IIFE и зачем его использовать?
35. Что такое подъем переменных и функций?
36. Что такое замыкание? Варианты использования?
37. Что регистрируется, когда `execute(f)` бежит за `f` переназначается?
38. Что такое рекурсия?
39. Что означает `this` иметь в виду?
40. Потеря контекста — когда и как предотвратить?
41. `bind` / `call` / `apply` — различия?

</details>

<details>
  <summary>Middle — Functions</summary>

### Middle — Functions

**Definition:**

Расширенные функциональные методы: каррирование, мемоизация, композиция и трассировка стрелок.

40. Объясните каррирование на практическом примере.
41. Мемоизация — когда применять?
42. Цепочка функций — пример?
43. `function` vs стрелка — трассировка вложенной стрелки `pluckDeep`?

</details>

<details>
  <summary>What are classes?</summary>

### What are classes?

**Definition:** Класс — это **схема** создания и использования объектов — полей (данных) + методов (действий) + `constructor` (инициализировать `new`).

**How it works:** `class History { ... }` создает функцию-конструктор и помещает методы `History.prototype`. Каждый `new History()` является экземпляром; методы использования `this` поэтому они мутируют _этот_ экземпляр. Заводы (`createSpending`) достаточно для небольших предметов одинаковой формы; классы выигрывают, когда имеют значение поведение и несколько экземпляров.

**When to use:** Начало интервью для ООП. Затем добавьте сахар-прототип, `this` правила и почему в JS до сих пор не хватает интерфейсов.

**Examples:**

```js
class Record {
  constructor(amount) {
    this.amount = amount;
    this.dateTime = Date.now();
  }
}

const spending = new Record(100);
console.log(spending.amount); // 100 — instance is a normal object
```

**Thoughts:** Класс = чертеж; экземпляр = дом. В JS проект по-прежнему представляет собой цепочку прототипов.

**Sources:** [Doka — ООП](https://doka.guide/tools/oop/) · [Классы MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

</details>

<details>
  <summary>How does prototype inheritance work?</summary>

### How does prototype inheritance work?

**Definition:** Объекты ссылаются на объект-прототип; поиск свойства проходит по цепочке, пока не будет найден или `null`.

**How it works:**

1. Каждый предмет имеет `[[Prototype]]` (`Object.getPrototypeOf(obj)`).
2. Читать `obj.prop`: проверить собственные свойства → пройти цепочку прототипов.
3. `new Fn()` устанавливает экземпляр `[[Prototype]]` to `Fn.prototype` и запускает конструктор.
4. Методы `Fn.prototype` являются общими для всех экземпляров.

**When to use:**

ES5 `Animal.prototype.method`; ES6 `class` десахары той же модели; `Object.create(proto)` без конструктора.

#### Common pitfalls

Параметр `Child.prototype = Parent.prototype` (no `Child` в цепочке); сбивающий с толку `__proto__` с `prototype` по функциям.

**Examples:**

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return this.name;
};

const a = new Animal("Cat");
console.log(a.speak()); // 'Cat' — from Animal.prototype
console.log(Object.getPrototypeOf(a) === Animal.prototype); // true
```

`new` шаги: создать объект → связать прототип → вызвать конструктор с помощью `this` → вернуть объект (если конструктор не возвращает объект).

**Sources:** [javascript.info/prototypes](https://learn.javascript.ru/prototypes)

</details>

<details>
  <summary>Class vs constructor function?</summary>

### Class vs constructor function?

**Definition:**

Оба создают объекты с общими методами прототипа; `class` это синтаксический сахар с более строгими правилами.

|                       | Функция конструктора         | класс ES6           |
| --------------------- | ---------------------------- | ------------------- |
| Звонок без `new`      | Часто ломается молча         | `TypeError`         |
| Строгий режим         | Необязательно                | Всегда              |
| Методы                | На `.prototype` вручную      | Внутри тела класса  |
| Наследование          | Ручное связывание прототипов | `extends` / `super` |
| Подъем                | Функция поднята              | ТДЗ до декларации   |
| `arguments` в методах | Доступно                     | Не в методах класса |

**How it works:** `class User {}` создает функцию `User` и помещает методы `User.prototype` — то же, что и запись конструктора + `User.prototype.method`.

**When to use:**

Устаревшие кодовые базы используют конструкторы; новый код предпочитает `class` для ясности и `extends`; заводские функции, когда `new` нежелательно.

#### Common pitfalls

Вызов класса без `new`; ожидая повышения класса, например `function`; `typeof MyClass === 'function'` удивляет новичков.

**Examples:**

```js
// ES5
function UserES5(name) {
  this.name = name;
}
UserES5.prototype.greet = function () {
  return this.name;
};

// ES6 — equivalent intent
class UserES6 {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return this.name;
  }
}
```

**Sources:** [javascript.info/class](https://learn.javascript.ru/class)

</details>

<details>
  <summary>Composition vs inheritance?</summary>

### Composition vs inheritance?

**Definition:**

**Наследование** - `is-a` (подтип разделяет цепочку прототипов). **Состав** — `has-a` (объект внедряет или получает поведение от других объектов/функций).

|             | Наследование               | Состав                                   |
| ----------- | -------------------------- | ---------------------------------------- |
| Отношения   | `Dog extends Animal`       | `car.engine = createEngine()`            |
| Гибкость    | Жесткое дерево             | Смешивайте поведение во время выполнения |
| JS подходит | Лимит единого наследования | Идиоматика в современном JS              |

**How it works:** Композиция предпочитает внедрение зависимостей или объединение объектов возможностей; Наследование устанавливает фиксированную цепочку прототипов во время определения класса.

**When to use:**

Наследование, когда подтип действительно заменяет родительский; композиция для смешивания функций, тестирования (макет зависимостей), избегая глубоких иерархий.

#### Common pitfalls

Глубокие деревья наследования в JS; «объект бога», содержащий слишком много несвязанных черт; с использованием `extends` только для повторного использования кода (предпочитайте композицию).

**Examples:**

```js
// Composition
const canFly = {
  fly() {
    return "flying";
  },
};
const bird = { name: "Eagle", ...canFly };

// Inheritance
class Animal {
  speak() {
    return "sound";
  }
}
class Dog extends Animal {
  speak() {
    return "woof";
  }
}
```

**Sources:** [javascript.info/mixins](https://learn.javascript.ru/mixins)

</details>

<details>
  <summary>Immutable object techniques?</summary>

### Immutable object techniques?

**Definition:** Предотвращайте мутации на уровне привязки, свойства или формы объекта — в JS нет встроенной глубокой неизменяемости.

**How it works:**

- `const x = obj` — предотвращает повторное связывание `x`, не мутируя `obj`.
- `Object.preventExtensions` / `seal` / `freeze` — возрастающие мелкие блокировки (см. **Дескрипторы свойств**).
- `Object.defineProperty` — `writable: false` за недвижимость.
- Скопировать, затем заменить: `structuredClone` + новый объект вместо мутации (стиль React/Redux).
- Библиотеки: Immer создает неизменяемые обновления на основе черновых мутаций.

| Техника                      | Глубина                      | Двусторонний                 |
| ---------------------------- | ---------------------------- | ---------------------------- |
| `const`                      | только обязательное          | переназначить переменную     |
| `freeze`                     | мелкий                       | нет                          |
| `defineProperty`             | один объект недвижимости     | если `configurable`          |
| `structuredClone` + заменить | глубокая копия нового дерева | старое дерево без изменений  |
| погружение                   | логическая неизменность      | производит новое государство |

**When to use:**

Редукс-состояние; замороженный конфиг; доступ к ответам API только для чтения; защитные копии перед передачей ненадежному коду.

#### Common pitfalls

`freeze` не замораживает вложенные объекты; `const` ≠ неизменяемый объект; мышление `JSON.parse(JSON.stringify(o))` сохраняет все виды.

**Examples:**

```js
const config = Object.freeze({ api: "https://api.example.com" });
// config.api = 'x'; // fails in strict

const next = structuredClone(state);
next.user.name = "Bob"; // new tree, state unchanged
```

Глубокая заморозка требует рекурсии `Object.freeze` на вложенных объектах или используйте Immer.

**Sources:** [javascript.info/property-descriptors](https://learn.javascript.ru/property-descriptors)

</details>

<details>
  <summary>What is Proxy for?</summary>

### What is Proxy for?

**Definition:** `Proxy` перехватывает операции с целевым объектом — проверка, ведение журнала, виртуальные свойства, реактивность.

**How it works:** Обработчик ловушек (`get`, `set`, `has`, …) запускать до поведения по умолчанию; использовать `Reflect` внутренние ловушки для корректной пересылки.

**When to use:** Подтверждать задания; осуществлять `negativeIndex` оболочка массива; Реактивность Vue 3; тестовые издевательства.

**Examples:**

```js
const arr = new Proxy([], {
  get(target, prop) {
    if (typeof prop === "string" && prop.startsWith("-")) {
      return target[target.length + Number(prop)];
    }
    return Reflect.get(target, prop);
  },
});
arr.push(10, 20, 30);
console.log(arr[-1]); // 30
```

Полный список ловушек и подводных камней: [Прокси и отражение](./3_js_oop.md#proxy-and-reflect).

**Sources:** [javascript.info/proxy](https://learn.javascript.ru/proxy)

</details>

<details>
  <summary>Coding tasks (legacy)</summary>

### Coding tasks (legacy)

// 4 Object.create — Создать транспортное средство/автомобиль с наследованием и описать метод

/// 8 **прото**, прототип, [[Прототип]]

/// 9 Что это? Решить задачу

</details>

<details>
  <summary>Middle — JS Core (OOP)</summary>

### Middle — JS Core (OOP)

14. Опишите, как JS реализует инкапсуляцию, полиморфизм и абстракцию.

15. Что такое прототип? Как работает наследование прототипов в JS? Объясните кодом.

16. В чем разница между композицией и наследованием?

17. Какие поведенческие различия существуют между функциями-конструкторами ES5 и классами ES2015?

18. Что такое дескрипторы свойств? Опишите практические примеры использования.

32.Назовите несколько способов создания неизменяемого объекта в JavaScript.

33. Как создать свойство, которое нельзя изменить?

34. Для чего нужен конструктор прокси? Приведите пример.

</details>

<details>
  <summary>JS Core (OOP)</summary>

### JS Core (OOP)

8. Внедрите шаблон ООП без классов (https://observablehq.com/@bratter/class-free-oop).

</details>

<details>
  <summary>DOM vs BOM?</summary>

### DOM vs BOM?

**Definition:**

**DOM** моделирует содержимое документа (узлы, элементы); **BOM** моделирует хром браузера/окружение страницы (`window`, `location`, `history`, `navigator`).

|                    | ДОМ                              | спецификация                      |
| ------------------ | -------------------------------- | --------------------------------- |
| Область применения | Дерево HTML-документа            | Окно браузера и API               |
| Вступление         | `document`                       | `window`                          |
| Примеры            | `querySelector`, `createElement` | `location`, `alert`, `setTimeout` |
| Спецификация       | стандарт ДОМ                     | HTML/спецификации браузера        |

**How it works:** `window` — глобальный объект; `document` является собственностью `window`. Операции DOM изменяют/читают структуру страницы; Спецификация управляет навигацией, диалоговыми окнами, областью просмотра, таймерами.

**When to use:**

DOM для обновлений пользовательского интерфейса; Спецификация для перенаправлений, открытия окон, чтения URL-адресов, навигации по истории.

Полную таблицу см. в разделе [DOM vs BOM](#dom-vs-bom) в разделе **DOM, BOM и события**.

**Sources:** [javascript.info/browser-environment](https://learn.javascript.ru/browser-environment)

</details>

<details>
  <summary>Junior — Front-end</summary>

### Junior — Front-end

42. Что такое ДОМ? → [DOM](#dom-bom-events)

43. Как получить высоту и положение элемента относительно документа? → [Дополнительные параметры браузера](./3_js_browser_extra.md)

44. Что такое веб-пакет?

45. Чем девелоперская сборка отличается от производственной?

</details>

<details>
  <summary>Front-end</summary>

### Front-end

17. Сравните `nextElementSibling` и `nextSibling`.

</details>

<details>
  <summary>Middle — Practical tasks (DOM)</summary>

### Middle — Practical tasks (DOM)

143. Реализуйте функцию, которая выполняет обратный вызов для всех элементов в данном поддереве DOM.

</details>

<details>
  <summary>Event bubbling and delegation?</summary>

### Event bubbling and delegation?

**Definition:** **Всплеск** — событие распространяется от цели до `window`. **Делегирование** — один прослушиватель у предка обрабатывает события от потомков через `event.target`.

**How it works:**

1. Фаза захвата (необязательно): окно → цель.
2. Целевая фаза: хендлеры достигают цели.
3. Фаза пузырька (по умолчанию): цель → окно.
4. Делегирование: родитель слушает пузырь; чеки `e.target.matches(selector)`.

**When to use:**

Элементы динамического списка — один `ul` слушатель; остановка распространения при щелчке маркеров наложения; захват для раннего перехвата.

#### Common pitfalls

`target` может быть ребенок внутри `li` (использовать `closest`); `stopPropagation` прерывает делегирование выше; предполагая делегирование при захвате без `{ capture: true }`.

**Examples:**

```js
list.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li || !list.contains(li)) return;
  console.log(li.textContent);
});
```

См. разделы [Фазы события](#event-phases) и [Делегирование события](#event-delegation).

**Sources:** [javascript.info/event-delegation](https://learn.javascript.ru/event-delegation)

</details>

<details>
  <summary>Middle — Front-end</summary>

### Middle — Front-end

44. В чем ключевое различие между `mouseleave` и `mouseout`?

45. В каком порядке обрабатываются события DOM (щелчок, наведение курсора мыши и т.п.)? ФИФО или ЛИФО?

46. ​​Что такое «всплывание событий» и «фиксация событий»?

47. Сравните `stopPropagation` и `stopImmediatePropagation`.

</details>

<details>
  <summary>localStorage vs sessionStorage vs cookies?</summary>

### localStorage vs sessionStorage vs cookies?

**Definition:**

Три клиентских механизма хранения с разным сроком службы, областью действия и видимостью сервера.

|                                      | локальное хранилище                  | хранилище сеансов              | Файлы cookie                      |
| ------------------------------------ | ------------------------------------ | ------------------------------ | --------------------------------- |
| Пожизненная                          | пока явно не ясно                    | пока вкладка/окно не закроется | `Expires` / сеансовый файл cookie |
| Доступно по вкладкам                 | да (того же происхождения)           | нет (на вкладке)               | да (в пределах домена)            |
| Отправляется с помощью HTTP-запросов | нет                                  | нет                            | да (если только HttpOnly)         |
| Типичная мощность                    | ~5 МБ                                | ~5 МБ                          | ~4 КБ на файл cookie              |
| API                                  | `getItem`/`setItem` синхронизировать | то же самое                    | `document.cookie` строка          |

**How it works:** Веб-хранилище хранит **строки** (`JSON.stringify` / `JSON.parse` — [JSON](./3_js_variables.md#json)). Файлы cookie передаются по HTTP; IndexedDB — это асинхронный + объекты. Полное сравнение, 7-дневное ITP Safari, квоты, localForage: [Хранилище браузера](#browser-storage). Флаги HTTP: [файлы cookie HTTP](./6_web_api_http.md#http-cookies).

**When to use:**

Тема → локальное хранилище; черновик вкладки → sessionStorage; идентификатор аутентификации → файл cookie HttpOnly; большой/оффлайн → IndexedDB.

#### Common pitfalls

JWT в локальном хранилище; размер печенья; sessionStorage не является перекрестной таблицей; Удаление хранилища скриптов Safari через 7 дней без взаимодействия.

**Examples:**

```js
localStorage.setItem("theme", "dark");
sessionStorage.setItem("step", "2");
// cookie set by server preferred: Set-Cookie: sid=...; HttpOnly; Secure; SameSite=Lax
```

**Sources:** [javascript.info/localstorage](https://learn.javascript.ru/localstorage)

</details>

<details>
  <summary>What is CORS?</summary>

### What is CORS?

**Definition:** Совместное использование ресурсов между источниками — механизм браузера, позволяющий читать HTTP-ответы из разных источников с помощью JavaScript, когда сервер отправляет соответствующие `Access-Control-*` заголовки.

**How it works:**

- Политика одинакового происхождения по умолчанию блокирует чтение ответов из разных источников.
- Сервер добавляет `Access-Control-Allow-Origin` (конкретное происхождение или `*` для общедоступных API).
- Непростые запросы вызывают **предварительный запуск**. `OPTIONS`; сервер должен разрешить метод и заголовки.
- Требуются подтвержденные запросы `credentials: 'include'` и не могу использовать `Allow-Origin: *`.

**When to use:**

API включен `api.example.com` потребляется `app.example.com`; публичный CDN с `*`; проверка подлинности cookie требует явного происхождения.

См. [CORS и политика одного и того же происхождения](#cors-same-origin) и [Веб-API — CORS](./6_web_api_security.md#cors).

#### Common pitfalls

CORS предназначен только для браузера, а не для границы безопасности на стороне сервера; неправильно настроенная предполетная подготовка; сбивает с толку политика одного и того же происхождения для iframes/DOM.

**Sources:** [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

</details>

<details>
  <summary>How do tabs communicate? Same-origin rules?</summary>

### How do tabs communicate? Same-origin rules?

**Definition:** Вкладки взаимодействуют через `postMessage`, `BroadcastChannel`, `localStorage` + `storage` событие, `SharedWorker`или Service Worker — для большинства API применяется политика одного и того же происхождения.

**How it works:**

- **Тот же источник** = протокол + хост + совпадение портов.
- Прямой доступ (`otherWindow.document`) — только того же происхождения.
- `postMessage` — разрешено перекрестное происхождение; должен подтвердить `event.origin`.
- `BroadcastChannel` / `storage` / `SharedWorker` — только того же происхождения.
- `sessionStorage` — не передается между вкладками.

**When to use:**

Выход из трансляции → BroadcastChannel; синхронизация тем → localStorage + хранилище; Всплывающее окно OAuth → postMessage.

См. [Кросс-таблицы и межоконные коммуникации](#cross-tab-communication).

#### Common pitfalls

Пропуск проверки происхождения `message`; ожидание перекрестной таблицы sessionStorage; гонка при одновременной записи в localStorage.

**Sources:** [javascript.info/cross-window-communication](https://learn.javascript.ru/cross-window-communication)

</details>

<details>
  <summary>requestAnimationFrame?</summary>

### requestAnimationFrame?

**Definition:** `requestAnimationFrame(callback)` планирует запуск функции перед следующей перерисовкой браузера, обычно ~60 кадров в секунду.

**How it works:**

- Браузер пакетно обновляет визуальные файлы; обратный вызов получает `DOMHighResTimeStamp`.
- Цепь `requestAnimationFrame` внутренний обратный вызов для цикла анимации.
- Пауза при скрытой вкладке — экономит ресурсы процессора и батареи.
- `cancelAnimationFrame(id)` останавливает запланированный кадр.

**When to use:** JS-анимация; макет «измерь, затем измени»; эффекты, связанные с прокруткой.

**Pluses and minuses:**

| +                                       | −                                               |
| --------------------------------------- | ----------------------------------------------- |
| Синхронизировано для обновления дисплея | Все еще работает в основном потоке              |
| Лучше, чем setInterval для анимации     | Не для произвольных задержек                    |
| Автопауза в фоновом режиме              | Тяжелая работа по-прежнему приводит к задержкам |

**Examples:**

```js
let x = 0;
function tick(ts) {
  x += 2;
  box.style.transform = `translateX(${x}px)`;
  if (x < 300) requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
```

См. [requestAnimationFrame](#request-animation-frame) в разделе **API браузера и шаблоны пользовательского интерфейса**.

**Sources:** [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

</details>

<details>
  <summary>requestIdleCallback?</summary>

### requestIdleCallback?

**Definition:** `requestIdleCallback(cb, { timeout })` бежит `cb` когда браузер простаивает (или когда `timeout` истекает). `IdleDeadline.timeRemaining()` оценивает оставшиеся миллисекунды.

**How it works:** Это не микрозадача. rAF — для кадров; холостой ход предназначен для оставшегося времени. Шторм микрозадач задерживает как покрасочные работы, так и праздные работы.

**Thoughts:**

_Используйте режим ожидания для несрочной работы; никогда для анимации._

Теоретически см. [requestIdleCallback](#request-idle-callback) (после rAF).

**Sources:** [MDN requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)

</details>

<details>
  <summary>Local storage</summary>

### Local storage

```js
class MyStorage {
  get(key) {}

  set(key, value) {}
}

const main = () => {
  const st = new MyStorage();

  st.set("userA", { name: "a" });
  st.get("userA"); // {name: "a"}

  st.set("userB", null);
  st.get("userB"); // null

  st.get("userC"); // throw error
};

// solution

class MyStorage {
  get(key) {
    if (!localStorage.hasOwnProperty(key)) {
      throw new Error(`Key "${key}" not found`);
    }

    const value = localStorage.getItem(key);
    return value === "null" ? null : JSON.parse(value);
  }

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

const main = () => {
  const st = new MyStorage();

  st.set("userA", { name: "a" });
  console.log(st.get("userA")); // { name: "a" }

  st.set("userB", null);
  console.log(st.get("userB")); // null

  try {
    console.log(st.get("userC")); // throws error
  } catch (error) {
    console.error(error.message); // "Key 'userC' not found"
  }
};

main();
```

Внешний тест: https://chm.org.ua/ru/testy-po-programmrovaniiu/test-dom-bom-v-javascript/

</details>

<details>
  <summary>Output tasks</summary>

### Output tasks

```js
console.log([] + null + 1); // 'null1'
```

<details>
  <summary>details</summary>

`[]` принуждает к `""`. `"" + null` → `"null"`. `"null" + 1` → `"null1"`.

</details>

```js
"foo" + +"bar"; // 'fooNaN'
```

<details>
  <summary>details</summary>

Унарный `+` on `"bar"` → `NaN`. `"foo" + NaN` → `"fooNaN"`.

</details>

```
!!"false" == !!"true" // true
```

<details>
  <summary>details</summary>

Оба `!!"false"` и `!!"true"` являются `true` (непустые строки правдивы).

</details>

```
"a" && "" && "c" // ""
```

<details>
  <summary>details</summary>

`&&` возвращает первый ложный операнд — `""`.

</details>

```
"a" && "" || "c" // "c"
```

<details>
  <summary>details</summary>

`"a" && ""` → `""` (ложь). `"" || "c"` → `"c"`.

</details>

```
"" ?? "a" // ""
```

<details>
  <summary>details</summary>

`??` возвращает правую часть только для `null` or `undefined`. `""` ни то, ни другое.

</details>

```js
var employeeId = "1234abe";
(function () {
  console.log(employeeId);
  var employeeId = "122345";
})();
// undefined (hoisting — TDZ until assignment in IIFE)
```

```js
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
Promise.resolve().then(() => setTimeout(() => console.log(4)));
Promise.resolve().then(() => console.log(5));
setTimeout(() => console.log(6));
console.log(7);
// 1, 7, 3, 5, 2, 6, 4
```

```js
setTimeout(() => console.log(1), 500);
console.log(2);
setTimeout(() => console.log(3));
Promise.resolve(6).then((response) => console.log(response));
Promise.resolve(new Promise(() => console.log(7)));
console.log(4);
setTimeout(() => console.log(5), 200);
// 2, 7, 4, 6, 5, 3, 1
```

```js
const square = {
  side: 10,
  area() {
    return this.side * this.side;
  },
  perimeter: () => 2 * this.side,
};

console.log(square.area()); // 100
console.log(square.perimeter()); // NaN (arrow — no own this)
```

```js
var foo = function bar() {
  return 1;
};
console.log(typeof bar());
// ReferenceError: bar is not defined (bar is not in outer scope)
```

</details>

<details>
  <summary>Map callback example</summary>

### Map callback example

```js
function each(array, callback) {
  const newArray = array.map(callback);
  return newArray;
}

const eachToTitle = (value) => value.toUpperCase();
const eachToReverse = (value) => value.split("").reverse().join("");
const eachToFactor2 = (value) => value * 2;

const arrayOfNumbers = [1, 2, 3];
const arrayOfStrings = ["roman", "getsman"];

console.log(each(arrayOfNumbers, eachToFactor2)); // [2, 4, 6]
console.log(each(arrayOfStrings, eachToReverse)); // ['namor', 'namsteg']
console.log(each(arrayOfStrings, eachToTitle)); // ['ROMAN', 'GETSMAN']
```

</details>

<details>
  <summary>Date formatting</summary>

### date

```js
export const dateFormat = (ms, options, locale) => {
  const _options = options || {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return new Intl.DateTimeFormat(locale || "ru-RU", _options).format(ms);
};

dateFormat(Date.now(), {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});
```

</details>

<details>
  <summary>Promise coding exercises</summary>

### Promises

```js
function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function main() {
  console.log(1);
  await delay(1000);
  console.log(2);
}

main();
```

```js
console.log(Promise.resolve(1));
// Promise { <fulfilled>: 1 }

Promise.resolve()
  .then(() => 1)
  .then(console.log);
// 1

Promise.resolve()
  .then(() => console.log(2))
  .then(() => console.log(3))
  .then(() => {
    setTimeout(() => console.log(4));
  })
  .then(() => console.log(5));

new Promise((resolve, reject) => {
  console.log(6);
  setTimeout(() => console.log(7), 0);
  resolve();
});

setTimeout(() => console.log(8), 0);

console.log(9);
// 6, 9, 2, 3, 5, 7, 8, 4
```

```js
const delay = (t) => new Promise((r) => setTimeout(r, t));

const runner = async (task) => {
  await task();
};

const main = () => {
  const t1 = async () => {
    await delay(10);
    console.log("t1");
  };
  const t2 = async () => {
    await delay(5);
    console.log("t2");
  };
  const t3 = async () => {
    await delay(15);
    console.log("t3");
  };

  runner(t1);
  runner(t2);
  runner(t3);
};

main();
// t2, t1, t3 (parallel start, finish by delay)
```

Упражнение с регистратором: [jsfiddle](https://jsfiddle.net/hlieb/fryuvapb/1/)

</details>

<details>
  <summary>Junior — JS Core (async topics)</summary>

### Junior — JS Core

23. Что такое `setTimeout` и `setInterval` для?
24. Сравните обратные вызовы, обещания и async/await.
25. Что такое рекурсия?
26. Что такое обещание? Орден `then` и `catch` в цепочке.
27. Последовательное и параллельное асинхронное выполнение. Разница между `Promise.all()` и `Promise.allSettled()`.

</details>

<details>
  <summary>Middle — JS Core (async topics)</summary>

### Middle — JS Core

18. Опишите цикл событий.
19. Что такое Observable и Promise?
20. Что такое обещание? Орден `then` и `catch` в цепочке.
21. Последовательный и параллельный асинхронный режим. `Promise.all()` vs `Promise.allSettled()`.
22. Генераторы и итераторы.
23. Шаблон асинхронного утилизатора.

</details>

<details>
  <summary>Practical tasks (async)</summary>

### Practical tasks (async)

43. Реализация асинхронности `Array.prototype.filter` (должен поддерживать `await` в предикате).

44. Написать `Sleep(ms)` который приостанавливает асинхронную функцию на заданный период времени.

45. Реализуйте один метод массива (например. `splice`).

</details>

<details>
  <summary>Explain the event loop order</summary>

### Explain the event loop order

**Definition:** Расписания цикла событий работают с фиксированным приоритетом: сначала стек синхронных вызовов, затем все микрозадачи, затем одна макрозадача, затем (браузер), возможно, кадр рендеринга.

**How it works:**

1. Запускайте синхронный код, пока стек вызовов не станет пустым.
2. Слейте **все микрозадачи** (`Promise.then`, `queueMicrotask`, `MutationObserver`, `async/await` продолжения).
3. Запустите **одну макрозадачу** (`setTimeout`, ввод-вывод, события пользовательского интерфейса).
4. Браузер: опционально запускайте этапы рендеринга (стиль, макет, рисование).
5. Повторите.

Узел: `process.nextTick` выполняется перед другими микрозадачами.

| Плюсы                                               | Минусы                                                            |
| --------------------------------------------------- | ----------------------------------------------------------------- |
| Предсказуемый заказ по принципу обещания до таймера | Легко ошибиться в вложенных головоломках                          |
| Пакетная асинхронная работа с микрозадачами         | Длинные очереди микрозадач задерживают пользовательский интерфейс |
| Один макрос за ход позволяет рисовать               | Фазы узла усложняют                                               |

**When to use:** Выходные вопросы интервью; отладка «почему это запустилось первым?»; избегая проблем с пользовательским интерфейсом.

**Examples:**

```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// 1, 4, 3, 2
```

**Common pitfalls:**

- `new Promise(executor)` — исполнитель синхронизирован; только `.then` это микрозадача.
- `setTimeout` внутри микрозадачи все еще ждет следующего хода макрозадачи.

**Thoughts:** _Синхронизировать → удалить все микрозадачи → одна макрозадача → (браузер может рисовать) → микрозадачи, порожденные этой макрозадачой →… Бесконечные микрозадачи приводят к голоданию отрисовки и холостым обратным вызовам._

**Sources:** [javascript.info/event-loop](https://learn.javascript.ru/event-loop)

</details>

<details>
  <summary>Log order: sync, Promise, then setTimeout that queues another Promise</summary>

### Log order: sync, Promise, then setTimeout that queues another Promise

**Definition:** Вложенное планирование: макрозадача может ставить в очередь микрозадачи, которые выполняются **перед** следующей макрозадачой.

**How it works:**

```js
console.log("A");
setTimeout(() => {
  console.log("B");
  Promise.resolve().then(() => console.log("C"));
}, 0);
Promise.resolve().then(() => {
  console.log("D");
  setTimeout(() => console.log("E"), 0);
});
console.log("F");
// A, F, D, B, C, E
```

1. Синхронизация: `A`, зарегистрировать таймер, зарегистрировать микро `D`, `F`.
2. Слив микросхем: `D` (расписание таймера `E`).
3. Один макрос: `B` (расписание микро `C`).
4. Слив микросхем: `C`.
5. Следующий макрос: `E`.

**When to use:** Загадки для вывода интервью. Прокомментируйте каждую строку: sync/micro/macro.

**Thoughts:** _После каждой макрозадачи снова очищайте очередь микрозадач до следующего таймера._

**See also:** [Объясните порядок цикла событий](#interview-practice)

**Sources:** [javascript.info/event-loop](https://learn.javascript.ru/event-loop)

</details>

<details>
  <summary>Promise vs callback?</summary>

### Promise vs callback?

**Definition:** Обратные вызовы вызывают функцию после завершения асинхронной работы; Обещания — это объекты, представляющие будущую ценность с возможностью цепочки `.then`/`.catch`.

**How it works:**

- Обратные вызовы: инверсия управления — вызываемый решает, когда звонить.
- Обещания: единый расчет, составные цепочки, ошибки распространяются на `.catch`.
- Обещания оборачивают обратные вызовы посредством промисификации; `async/await` это сахар синтаксиса обещаний.

|                   | Обратный звонок                               | Обещание                         |
| ----------------- | --------------------------------------------- | -------------------------------- |
| Состав            | Ручной раскрой                                | `.then` цепи, `Promise.all`      |
| Ошибки            | Соглашение об ошибке или его легко пропустить | `.catch` / `try/catch` с `await` |
| Несколько звонков | Возможно (события)                            | Оседает один раз                 |

| Плюсы                                         | Минусы                                               |
| --------------------------------------------- | ---------------------------------------------------- |
| Обещания унифицируют асинхронный стиль        | Обещания не отменяются изначально                    |
| Обратные вызовы универсальные для мероприятий | Ад обратного вызова для последовательных шагов       |
| Обещания работают с `await`                   | Обещание теряет API с множественным обратным вызовом |

**When to use:** События → обратные вызовы; логика приложения → обещания/`async`; устаревший узел → обещать.

**Examples:**

```js
// Callback
readFile("a.txt", (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});

// Promise
readFilePromise("a.txt")
  .then((data) => console.log(data))
  .catch(console.error);
```

**Sources:** [javascript.info/promise-basics](https://learn.javascript.ru/promise-basics) · [javascript.info/callbacks](https://learn.javascript.ru/callbacks)

</details>

<details>
  <summary>Promise.all vs allSettled vs race vs any?</summary>

### Promise.all vs allSettled vs race vs any?

**Definition:** Статические методы, сочетающие несколько обещаний с разными правилами расчета.

**How it works:**

- `all` — все выполнить или сначала отклонить; результаты в порядке ввода.
- `allSettled` — жди всех; никогда не отвергает; `{ status, value|reason }`.
- `race` — сначала определите выигрыш (выполните или отклоните).
- `any` — первым выполнить выигрыш; `AggregateError` если все отвергнут.

| Метод                | Решается, когда    | Отклоняет, когда  |
| -------------------- | ------------------ | ----------------- |
| `Promise.all`        | все выполнить      | сначала отклонить |
| `Promise.allSettled` | все улажено        | никогда           |
| `Promise.race`       | сначала поселиться | сначала отклонить |
| `Promise.any`        | сначала выполнить  | все отвергают     |

| Плюсы                                                 | Минусы                                           |
| ----------------------------------------------------- | ------------------------------------------------ |
| `all` — быстрый сбой, параллельные необходимые данные | Одна неудача теряет все                          |
| `allSettled` — полный отчет о состоянии               | Подробное отображение результатов                |
| `race` — таймауты                                     | Проигравшие запросы все еще могут быть выполнены |
| `any` — избыточные источники                          | Редкий; `AggregateError` обработка               |

**When to use:**

| Метод        | Используйте, когда                                    |
| ------------ | ----------------------------------------------------- |
| `all`        | Требуются права пользователя и разрешения             |
| `allSettled` | Массовая загрузка — отображение статуса каждого файла |
| `race`       | тайм-аут 5 секунд включен `fetch`                     |
| `any`        | Пробуйте зеркала CDN, пока не добьетесь успеха        |

**Examples:**

```js
const results = await Promise.allSettled([fetch("/a"), fetch("/b")]);
results.forEach((r) => {
  if (r.status === "fulfilled") console.log(r.value);
  else console.error(r.reason);
});
```

**Common pitfalls:**

- `all` когда частичный успех в порядке — используйте `allSettled`.
- `race` для тайм-аута без `AbortController` — запрос продолжается в фоновом режиме.

**Sources:** [javascript.info/promise-api](https://learn.javascript.ru/promise-api)

</details>

<details>
  <summary>async/await — parallel vs sequential?</summary>

### async/await — parallel vs sequential?

**Definition:** Последовательный `await` ожидает выполнения каждой задачи перед запуском следующей; параллельное выполнение запускает все задачи, затем ожидает вместе (обычно `Promise.all`).

**How it works:**

- Последовательный: общее время — сумма задержек.
- Параллельный: общее время ≈ максимальная задержка (для независимого ввода-вывода).
- Начните обещать раньше `await` — `const p = fetchA(); await fetchB(); await p` перекрывает А и Б.
- `for` петля с `await` — по умолчанию последовательный.

| Узор                     | Задержка (независимая 100 мс × 2) |
| ------------------------ | --------------------------------- |
| Последовательный `await` | ~200ms                            |
| `Promise.all`            | ~100 мс                           |

| Плюсы                                | Минусы                                     |
| ------------------------------------ | ------------------------------------------ |
| Последовательный: четкие зависимости | Последовательный: излишне медленно         |
| Параллельно: минимальное ожидание    | `all`: один сбой в партии                  |
| `allSettled` для частичного успеха   | Читать труднее, чем синхронизированный код |

**When to use:** Последовательный, когда шаг 2 требует вывода шага 1; параллельно для независимых вызовов API.

**Examples:**

```js
// Sequential — B waits for A
const a = await fetchA();
const b = await fetchB();

// Parallel — start both, await together
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

**Common pitfalls:**

- Последовательный `await` in `for` цикл более 100 элементов — 100 циклов туда и обратно.
- Забыв об этом `fetchA()` без await все равно запускает запрос — хорошо для параллельного выполнения, если вы сначала собираете промисы.

**Sources:** [javascript.info/async-await](https://learn.javascript.ru/async-await)

</details>

<details>
  <summary>What does async function return?</summary>

### What does async function return?

**Definition:** An `async` функция **всегда** возвращает `Promise`, независимо от того, что ты `return`.

**How it works:**

- `return value` → `Promise.resolve(value)`.
- `throw err` → `Promise.reject(err)`.
- Голый `return` → `Promise.resolve(undefined)`.
- Звонящий должен `await fn()` or `fn().then(...)` чтобы получить значение или поймать ошибки.
- `await` внутри работает только в `async` функции (или модули верхнего уровня).

| Плюсы                             | Минусы                                                       |
| --------------------------------- | ------------------------------------------------------------ |
| Единый интерфейс обещания         | Легко забыть `await` на месте вызова                         |
| Взаимодействует с `.then` цепи    | Трассировки стека пересекают границы асинхронности           |
| `try/catch` внутри асинхронной fn | Возвращенное обещание нуждается в своем собственном `.catch` |

**When to use:** Всегда рассматривайте результат вызова как обещание, если только вы не `await` немедленно.

**Examples:**

```js
async function getValue() {
  return 42;
}
getValue(); // Promise { 42 }
await getValue(); // 42

async function fail() {
  throw new Error("oops");
}
fail().catch(console.error); // required or unhandled rejection
```

**Common pitfalls:**

- `const x = asyncFn()` — `x` это обещание, а не решенное значение.
- `async` стрелка внутрь `map` без `Promise.all` — одновременные, но необработанные отказы.

**Sources:** [javascript.info/async-await](https://learn.javascript.ru/async-await)

</details>

<details>
  <summary>Unhandled promise rejection?</summary>

### Unhandled promise rejection?

**Definition:** Отклоненное обещание без вложений `.catch` и нет `await` in `try/catch` вызывает предупреждения во время выполнения или выход из процесса.

**How it works:**

- Браузер: `unhandledrejection` on `window`.
- Узел: `process.on('unhandledRejection', ...)`.
- Исправить: `.catch`, `try/catch` + `await`, or `.catch` на асинхронном IIFE.
- Глобальный обработчик журналирования — не заменяет локальный обработчик.

| Плюсы                                | Минусы                                                 |
| ------------------------------------ | ------------------------------------------------------ |
| Поверхности отсутствуют пути ошибок  | Может привести к сбою Node в производстве              |
| Монитор с глобальным прослушивателем | Обещания «выстрелил и забыл», которые легко пропустить |

**When to use:** Каждый `fetch`, `async` обработчик маршрута, а для задачи «выстрелил и забыл» нужен обработчик.

**Examples:**

```js
// Bad
async function load() {
  throw new Error("fail");
}
load();

// Good
load().catch(console.error);
```

**Sources:** [MDN unhandledrejection](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event)

</details>

<details>
  <summary>AbortController?</summary>

### AbortController?

**Definition:** API для отмены `fetch` и другие операции через `AbortSignal`.

**How it works:**

- Создать контроллер; проходить `signal` to `fetch`.
- Вызов `abort()` отменить; обещание отклоняется с `AbortError`.
- Использование в Реакте `useEffect` очистка для отмены при размонтировании.
- `AbortSignal.timeout(ms)` для встроенного тайм-аута (современные среды выполнения).

| Плюсы                                                       | Минусы                                           |
| ----------------------------------------------------------- | ------------------------------------------------ |
| Останавливает устаревшие запросы                            | Не все API поддерживают сигналы                  |
| Предотвращает состояние гонки в пользовательском интерфейсе | Должен различать `AbortError` от реальных ошибок |
| Стандарт по выборке                                         | One-shot — новый контроллер по запросу           |

**When to use:** Автозаполнение поиска, изменение маршрута, тайм-аут запроса, `Promise.race` уборка.

**Examples:**

```js
const ac = new AbortController();
fetch("/api", { signal: ac.signal });
ac.abort(); // AbortError
```

**Sources:** [javascript.info/fetch-abort](https://learn.javascript.ru/fetch-abort)

</details>

---

## Coding tasks

<details>
  <summary>Task 1 — typeof output</summary>

### Task 1 — typeof output

Какие логи?

```js
console.log(typeof null);
console.log(typeof []);
console.log(typeof (() => {}));
```

<details><summary>Answer</summary>

`"object"`, `"object"`, `"function"`

</details>

</details>

<details>
  <summary>Task 2 — == vs ===</summary>

### Task 2 — == vs ===

```js
console.log(0 == false);
console.log(0 === false);
console.log("" == false);
console.log(null == undefined);
console.log(null === undefined);
```

<details><summary>Answer</summary>

`true`, `false`, `true`, `true`, `false`

</details>

</details>

<details>
  <summary>Task 3 — Closure loop</summary>

### Task 3 — Closure loop

С какими логами `var`? С `let`?

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

<details><summary>Answer</summary>

`var`: журналы `3, 3, 3` — одна общая привязка.  
`let`: журналы `0, 1, 2` — новая привязка на итерацию.

</details>

</details>

<details>
  <summary>Task 5 — Prototype reference</summary>

### Task 5 — Prototype reference

```js
function Main() {}
Main.prototype = { a: 1 };
const o = new Main();
Main.prototype = { a: 2 };
console.log(o.a);
```

<details><summary>Answer</summary>

`1` — экземпляр ссылается на объект-прототип во время создания, а не в текущий момент конструктора. `.prototype` свойство.

</details>

</details>

<details>
  <summary>Task 9 — Deep clone (JSON limitations)</summary>

### Task 9 — Deep clone (JSON limitations)

Когда `JSON.parse(JSON.stringify(obj))` небезопасно?

<details><summary>Answer</summary>

Проигрывает `undefined`, функции, символы; `Date` становится строкой ISO; `Map`/`Set` становиться `{}`; `NaN`/`Infinity` становиться `null`; круговые ссылки и `BigInt` бросать. Использовать `structuredClone` когда доступно.

</details>

</details>

<details>
  <summary>Task 13 — Object.is vs ===</summary>

### Task 13 — Object.is vs ===

Когда `Object.is(NaN, NaN)` отличаться от `NaN === NaN`?

<details><summary>Answer</summary>

`NaN === NaN` is `false`; `Object.is(NaN, NaN)` is `true`. `Object.is(+0, -0)` is `false`; `+0 === -0` is `true`.

</details>

</details>

<details>
  <summary>Task 15 — Query string to object</summary>

### Task 15 — Query string to object

```js
queryObjectify("a=1&b=2&c=hello"); // { a: '1', b: '2', c: 'hello' }
```

<details><summary>Solution</summary>

```js
function queryObjectify(str) {
  return Object.fromEntries(
    str.split("&").map((pair) => pair.split("=").map(decodeURIComponent)),
  );
}
```

</details>

</details>

<details>
  <summary>Task 16 — Cart aggregation with category discounts</summary>

### Task 16 — Cart aggregation with category discounts

См. [JS-массивы](./3_js_array.md#interview-practice).

---

<details>
  <summary>Type checks & comparison (practice)</summary>

### Type checks & comparison (practice)

Спрогнозируйте результат, а затем проверьте **Типы данных → Интересные случаи** и **Задачи 1–2** ниже.

```js
console.log(typeof null);
console.log(typeof []);
const fn = () => {};
console.log(fn instanceof Function);
console.log(1 == "1");
console.log({ a: 1 } === { a: 1 });
const a = {};
const b = {};
a[b] = "1";
console.log(Object.keys(a));
```

| Выражение                | Результат             | Почему                                 |
| ------------------------ | --------------------- | -------------------------------------- |
| `typeof null`            | `"object"`            | Устаревшая ошибка                      |
| `typeof []`              | `"object"`            | Массивы являются объектами             |
| `fn instanceof Function` | `true`                | Функции являются вызываемыми объектами |
| `1 == '1'`               | `true`                | Принуждение                            |
| `{a:1} === {a:1}`        | `false`               | Ссылка сравнить                        |
| `Object.keys(a)`         | `['[object Object]']` | Ключи объекта преобразуются в строку   |

**Sources:** [javascript.info/types](https://learn.javascript.ru/types)

</details>

<details>
  <summary>call / apply / bind (practice)</summary>

### call / apply / bind

**Definition:** Перемещено в [Функции JS](./3_js_functions.md#call-apply-bind).

</details>

<details>
  <summary>Junior — General (core subset)</summary>

### Junior — General (core subset)

**Definition:**

Вопросы для собеседования начального уровня о строгом режиме, наборе текста, изменчивости и отладке.

7. Что означает `use strict` директива значит?
8. Чем JS отличается от внешнего интерфейса от внутреннего?
9. Что такое статическая и динамическая типизация?
10. Объясните изменчивость и неизменность — какие типы являются изменяемыми?
11. Как вы отлаживаете код? Используете ли вы отладчик?
12. Известные люди в экосистеме JS?

</details>

<details>
  <summary>Junior — JS Core</summary>

### Junior — JS Core

**Definition:**

Фундаментальные вопросы языка: типы, массивы, операторы, область видимости и коллекции. Ответы метода массива: [JS Arrays](./3_js_array.md#interview-practice).

15. Какие типы данных существуют в JS?
16. Как проверить, является ли значение массивом?
17. Как проверить, конечно ли число?
18. Как проверить наличие `NaN`?
19. `isNaN()` vs `Number.isNaN()`?
20. Сравните `var`, `let`, `const`.
21. Что такое объем?
22. Что такое деструктуризация?
23. Что такое `setTimeout` / `setInterval` для?
24. Обратные вызовы против обещаний против `async/await`?
25. Можете ли вы расширить встроенные прототипы (`Array`, `Object`)? Риски?
26. Назовите методы массива и их назначение.
27. Методы итерации по массивам — отличия?
28. Операторы присваивания, сравнения, логические, поразрядные?
29. `Map` и `Set` — назначение и использование?
30. Глубокий и поверхностный текст — как сделать каждый?

</details>

<details>
  <summary>Junior — Functions</summary>

### Junior — Functions

**Definition:** Перемещено в [JS-функции](./3_js_functions.md#junior-functions).

</details>

<details>
  <summary>Middle — JS Core</summary>

### Middle — JS Core

**Definition:**

Промежуточные темы: прототипы, приведение, GC, промисы, дескрипторы, типизированные массивы, символы.

10. JS-типы — какие логи при переназначении ссылки на объект?
11. Что такое временная мертвая зона?
12. Бокс/распаковка в JS?
13. `in` vs `hasOwnProperty`?
14. Инкапсуляция, полиморфизм, абстракция в JS?
15. Прототипы — что и когда логи `Main.prototype` заменяется после `new`?
16. Композиция против наследования?
17. Почему следует избегать `new String()`?
18. Основы цикла событий?
19. Записи и кортежи против простых объектов?
20. Конструктор ES5 или класс ES2015?
21. Реализация шаблона модуля?
22. Почему `typeof null === 'object'`?
    23–24. Введите упражнения по принуждению.
    25–26. Принципы сбора мусора?
23. `WeakMap` / `WeakSet` vs `Map` / `Set`?
24. Наблюдаемое или обещанное?
25. Упражнение по упорядочению цепочки обещаний?
26. `Promise.all` vs `Promise.allSettled`?
27. Дескрипторы свойств?
    32–33. Неизменяемые/недоступные для записи объекты?
28. `Proxy` варианты использования?
29. `ArrayBuffer`, типизированные массивы?
30. `encodeURI` vs `encodeURIComponent`?
    37–38. Генераторы/итераторы — трассировка `function*` пример?
31. `Symbol` и преобразование системы счисления?

</details>

<details>
  <summary>JS Core</summary>

### JS Core (patterns)

**Definition:**

Архитектурные шаблоны, выходящие за рамки синтаксиса: ООП без классов, асинхронный диспоузер, дисциплина RegExp.

8. Бесклассовый шаблон ООП.
9. Шаблон асинхронного избавителя.
10. Регулярные выражения — если это приемлемо, советы по читабельности.

</details>

<details>
  <summary>Middle — Functions</summary>

### Middle — Functions

**Definition:** Перемещено в [Функции JS](./3_js_functions.md#middle-functions).

</details>

<details>
  <summary>Junior — Practice tasks</summary>

### Junior — Practice tasks

**Definition:**

Практические упражнения: копирование объектов, клонирование, замена переменных и небольшой CRUD-проект.

135. Способы копирования простого объекта `{ a: 1, b: 2, c: 3 }`?
136. Реализуйте глубокое клонирование.
137. Поменять местами две переменные — разные техники?
138. Заменить магические номера статуса именованными константами?
139. Мини-пользовательский CRUD-проект (Firebase + Bootstrap).

</details>

<details>
  <summary>Middle — Practice tasks (core)</summary>

### Middle — Practice tasks (core)

**Definition:**

Реализации утилит: анализ запросов и операции над массивами.

145. Строка URL-запроса в JSON (`queryObjectify`).
146. Пересечение двух массивов.

</details>

<details>
  <summary>Practice tasks</summary>

### Practice tasks

**Definition:** Рекурсивный `reduce` живет в [JS Arrays — Interview Practice](./3_js_array.md#interview-practice).

</details>

</details>

<details>
  <summary>Task 7 — Flatten array (one level)</summary>

### Task 7 — Flatten array (one level)

```js
function flatten(arr) {
  /* [1,[2,3],[4]] → [1,2,3,4] */
}
```

<details><summary>Solution</summary>

```js
function flatten(arr) {
  return arr.reduce(
    (acc, item) => acc.concat(Array.isArray(item) ? item : item),
    [],
  );
}
// or arr.flat(1)
```

</details>

</details>

<details>
  <summary>Task 8 — Polyfill Array.map</summary>

### Task 8 — Polyfill Array.map

```js
function map(arr, fn) {
  /* without Array.prototype.map */
}
```

<details><summary>Solution</summary>

```js
function map(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i], i, arr));
  }
  return result;
}
```

</details>

</details>

<details>
  <summary>Task 11 — Unique array values</summary>

### Task 11 — Unique array values

```js
function unique(arr) {
  /* [1,2,2,3] → [1,2,3] */
}
```

<details><summary>Solution</summary>

```js
function unique(arr) {
  return [...new Set(arr)];
}
```

</details>

</details>

<details>
  <summary>Task 4 — this context</summary>

### Task 4 — this context

```js
const obj = {
  x: 10,
  getX() {
    return this.x;
  },
};
const getX = obj.getX;
console.log(getX());
console.log(getX.call(obj));
```

<details><summary>Answer</summary>

`undefined` (строгий) тогда `10`

</details>

</details>

<details>
  <summary>Task 6 — Implement debounce</summary>

### Task 6 — Implement debounce

```js
function debounce(fn, delay) {
  /* ... */
}
```

<details><summary>Solution</summary>

```js
function debounce(fn, delay) {
  let id;
  return function (...args) {
    clearTimeout(id);
    id = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

</details>

</details>

<details>
  <summary>Task 10 — Implement bind</summary>

### Task 10 — Implement bind

```js
function myBind(fn, ctx, ...args) {
  /* ... */
}
```

<details><summary>Solution</summary>

```js
function myBind(fn, ctx, ...args) {
  return function (...rest) {
    return fn.apply(ctx, args.concat(rest));
  };
}
```

</details>

</details>

<details>
  <summary>Task 12 — Curry add</summary>

### Task 12 — Curry add

```js
const curriedAdd = curry((a, b, c) => a + b + c);
curriedAdd(1)(2)(3); // 6
```

<details><summary>Solution</summary>

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}
```

</details>

</details>

<details>
  <summary>Task 14 — Memoize</summary>

### Task 14 — Memoize

```js
function memoize(fn) {
  /* cache by args */
}
```

<details><summary>Solution</summary>

```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

</details>

</details>

<details>
  <summary>Task 1 — Object.create inheritance</summary>

### Task 1 — Object.create inheritance

Создавать `vehicle` с `describe`, `car` наследует и добавляет `wheels`.

<details><summary>Solution</summary>

```js
const vehicle = {
  describe() {
    return `${this.brand}`;
  },
};
const car = Object.create(vehicle);
car.brand = "Toyota";
car.wheels = 4;
```

</details>

</details>

<details>
  <summary>Task 2 — instanceof without built-in</summary>

### Task 2 — instanceof without built-in

Как `obj instanceof Constructor` работа?

<details><summary>Answer</summary>

Прогулки `obj.__proto__` проверка цепочки, если какое-либо из них равно `Constructor.prototype`.

</details>

</details>

<details>
  <summary>Task 3 — Define read-only property</summary>

### Task 3 — Define read-only property

```js
const obj = {};
// add `id` that cannot be changed
```

<details><summary>Solution</summary>

```js
Object.defineProperty(obj, "id", {
  value: 1,
  writable: false,
  enumerable: true,
});
```

</details>

</details>

<details>
  <summary>Task 4 — Proxy validation</summary>

### Task 4 — Proxy validation

Прокси, который отвергает негатив `age` задания.

<details><summary>Solution</summary>

```js
const user = new Proxy(
  {},
  {
    set(target, prop, value) {
      if (prop === "age" && value < 0) throw new RangeError("age");
      target[prop] = value;
      return true;
    },
  },
);
```

</details>

---

<details>
  <summary>Coding tasks (legacy)</summary>

### Coding tasks (legacy)

// 4 Object.create — Создать транспортное средство/автомобиль с наследованием и описать метод

/// 8 **прото**, прототип, [[Прототип]]

/// 9 Что это? Решить задачу

</details>

<details>
  <summary>Middle — JS Core (OOP)</summary>

### Middle — JS Core (OOP)

14. Опишите, как JS реализует инкапсуляцию, полиморфизм и абстракцию.

15. Что такое прототип? Как работает наследование прототипов в JS? Объясните кодом.

16. В чем разница между композицией и наследованием?

17. Какие поведенческие различия существуют между функциями-конструкторами ES5 и классами ES2015?

18. Что такое дескрипторы свойств? Опишите практические примеры использования.

32.Назовите несколько способов создания неизменяемого объекта в JavaScript.

33. Как создать свойство, которое нельзя изменить?

34. Для чего нужен конструктор прокси? Приведите пример.

</details>

<details>
  <summary>JS Core (OOP)</summary>

### JS Core (OOP)

8. Внедрите шаблон ООП без классов (https://observablehq.com/@bratter/class-free-oop).

</details>

</details>

<details>
  <summary>Task 1 — Event delegation</summary>

### Task 1 — Event delegation

Список `<li>` элементы — обработчик одного клика `<ul>`, текст элемента с предупреждением о щелчке.

<details>
  <summary>DOM</summary>

### DOM

https://jsfiddle.net/softnetix/r3u1cy0n/

```js
// DOM list exercise — page markup: [1_html.md](1_html.md)

const users = [
  {
    id: "njscmmaks",
    name: "Petya",
  },
  {
    id: "mnfdmnfdm",
    name: "Vasya",
  },
  {
    id: "lswlqdwa",
    name: "Dima",
  },
  {
    id: "jncvmdasd",
    name: "Olga",
  },
];

const list = document.getElementById("list");

users.forEach(({ name }) => {
  const li = document.createElement("li");

  li.innerText = name;

  list.appendChild(li);
});

const handler = () => {
  //solution
};

list.addEventListener("click", handler);

// solution

const handler = (event) => {
  if (event.target.tagName === "LI") {
    alert(`You clicked on: ${event.target.dataset.id}`);
  }
};

// Add `id` as a `data-id` attribute when creating list items
users.forEach(({ id, name }) => {
  const li = document.createElement("li");

  li.innerText = name;
  li.dataset.id = id; // Store the user ID in a data attribute

  list.appendChild(li);
});

list.addEventListener("click", handler);
```

</details>

<details>
  <summary>Junior — Front-end</summary>

### Junior — Front-end

45. Опишите процесс всплывания событий в DOM.

46. ​​Как остановить всплеск событий?

47. Как предотвратить действие события по умолчанию?

48. Что такое `this` в обработчике событий?

</details>

<details>
  <summary>Middle — Front-end</summary>

### Middle — Front-end

44. В чем ключевое различие между `mouseleave` и `mouseout`?

45. В каком порядке обрабатываются события DOM (щелчок, наведение курсора мыши и т.п.)? ФИФО или ЛИФО?

46. ​​Что такое «всплывание событий» и «фиксация событий»?

47. Сравните `stopPropagation` и `stopImmediatePropagation`.

</details>

</details>

</details>

<details>
  <summary>Task 2 — Debounced scroll</summary>

### Task 2 — Debounced scroll

Подключите прослушиватель прокрутки, который регистрируется только после того, как пользователь **останавливает** прокрутку на 200 мс — это [debounce](./3_js_browser_extra.md#debounce), а не дросселирование.

<details><summary>Solution</summary>

```js
let timer;
window.addEventListener("scroll", () => {
  clearTimeout(timer);
  timer = setTimeout(() => console.log("scroll ended"), 200);
});
```

</details>

</details>

<details>
  <summary>Task 3 — Storage wrapper</summary>

### Task 3 — Storage wrapper

→ См. упражнение [Локальное хранилище](#local-storage) ниже.

<a name="local-storage"></a>

<details>
  <summary>Local storage</summary>

### Local storage

```js
class MyStorage {
  get(key) {}

  set(key, value) {}
}

const main = () => {
  const st = new MyStorage();

  st.set("userA", { name: "a" });
  st.get("userA"); // {name: "a"}

  st.set("userB", null);
  st.get("userB"); // null

  st.get("userC"); // throw error
};

// solution

class MyStorage {
  get(key) {
    if (!localStorage.hasOwnProperty(key)) {
      throw new Error(`Key "${key}" not found`);
    }

    const value = localStorage.getItem(key);
    return value === "null" ? null : JSON.parse(value);
  }

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

const main = () => {
  const st = new MyStorage();

  st.set("userA", { name: "a" });
  console.log(st.get("userA")); // { name: "a" }

  st.set("userB", null);
  console.log(st.get("userB")); // null

  try {
    console.log(st.get("userC")); // throws error
  } catch (error) {
    console.error(error.message); // "Key 'userC' not found"
  }
};

main();
```

Внешний тест: https://chm.org.ua/ru/testy-po-programmrovaniiu/test-dom-bom-v-javascript/

</details>

<details>
  <summary>Junior — Front-end</summary>

### Junior — Front-end

49. Что такое localStorage и sessionStorage? Каков максимальный размер localStorage?

</details>

<details>
  <summary>Middle — Front-end</summary>

### Middle — Front-end

48. Какие подходы оптимизируют производительность веб-страницы?

49. Как работает политика одного и того же происхождения? На какие API браузера это влияет?

50. Назовите механизмы хранения данных браузера и сравните их.

51. Веб-воркеры — как данные передаются между воркёрами и основным потоком, а также между общими воркёрами?

52. Что такое передаваемые объекты?

53. Как оптимизировать тяжелую работу с JS, чтобы улучшить производительность рендеринга страниц?

54.Почему ResizeObserver срабатывает до того, как элемент будет нарисован, а не после?

56. Опишите, как читать `.txt` файл переброшен из файловой системы в окно браузера.

57. Что такое виртуальный DOM?

</details>

<details>
  <summary>Front-end</summary>

### Front-end

11. Как браузер определяет, могут ли вкладки взаимодействовать друг с другом? → [#кросс-таб-коммуникация](#кросс-таб-коммуникация)

12. Как избежать загрузки кэшированных файлов сценариев и стилей? → [2_css.md — очистка кеша](2_css_interview.md#interview-practice)

13. Что такое `requestAnimationFrame`? → [#request-animation-frame](#request-animation-frame)

14б. Что такое `requestIdleCallback`? → [#request-idle-callback](#request-idle-callback)

15. Опишите архитектуру микроинтерфейса.

16. Какие показатели веб-производительности вы знаете?

</details>

</details>

<details>
  <summary>Task 1 — Event loop output</summary>

### Task 1 — Event loop output

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

<details><summary>Answer</summary> А, Д, В, Б </details>

</details>

<details>
  <summary>Task 2 — Promise chain</summary>

### Task 2 — Promise chain

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then((x) => {
    throw new Error("fail");
  })
  .catch(() => 42)
  .then(console.log);
```

<details><summary>Answer</summary> `42` </details>

</details>

<details>
  <summary>Task 3 — Implement delay</summary>

### Task 3 — Implement delay

```js
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

</details>

<details>
  <summary>Task 4 — promiseAll polyfill</summary>

### Task 4 — promiseAll polyfill

```js
function promiseAll(iterable) {
  /* ... */
}
```

<details><summary>Solution</summary>

```js
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(iterable);
    if (arr.length === 0) return resolve([]);
    const results = [];
    let done = 0;
    arr.forEach((p, i) => {
      Promise.resolve(p).then((val) => {
        results[i] = val;
        if (++done === arr.length) resolve(results);
      }, reject);
    });
  });
}
```

</details>

</details>

<details>
  <summary>Task 5 — Retry with backoff</summary>

### Task 5 — Retry with backoff

```js
async function retry(fn, retries = 3, delay = 100) {
  /* ... */
}
```

<details><summary>Solution</summary>

```js
async function retry(fn, retries = 3, delay = 100) {
  try {
    return await fn();
  } catch (e) {
    if (retries <= 0) throw e;
    await new Promise((r) => setTimeout(r, delay));
    return retry(fn, retries - 1, delay * 2);
  }
}
```

</details>

---

<details>
  <summary>Coding tasks (legacy)</summary>

### Coding tasks (legacy)

10. Что такое цикл событий? Очередь обратного звонка.
11. Что такое обещания? Решите задачу о задержке.

</details>

</details>
