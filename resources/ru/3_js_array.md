# JS Core — Array

Упорядоченные коллекции, методы массивов и шаблоны интервью `map` / `filter` / `reduce`.

[ ← Назад в JS-хаб](./3_js.md)

### Related docs

- [Язык JS](./3_js_core.md) · [Типы данных и переменные JS](./3_js_variables.md) · [Операторы и циклы JS](./3_js_operators.md) · [Функции JS](./3_js_functions.md) · [JS OOP](./3_js_operators.md) · [JS Async](./3_js_async.md) · [JS-документ](./3_js_browser.md)
- [JS-интервью](./3_js_interview.md) · [Задание корзины TypeScript](./5_ts_interview.md#interview-practice)

### Main concepts

| Площадь | Темы |
| ---- | ------ |
| **Форма** | Индексы, `length`, редкие отверстия, `Array.isArray` |
| **Копировать** | Распространение, `slice`, `Array.from`, мелкий против глубокого |
| **API** | Мутирующие и немутирующие, поиск, сортировка, выравнивание |
| **ХОФ** | `map`, `filter`, `reduce`, `forEach` |

### Sections

> Теория `<details>` блоки следуют: **Определение** · **Как это работает** · **Когда использовать** · **Плюсы и минусы** · **Примеры** · **Мысли** · **Источники**. **Определение** обязательно; другие разделы являются необязательными.

- [Arrays & array methods](#arrays-and-array-methods)
- [Transformation & search](#transformation-and-search)
- [Интервью](./3_js_interview.md)

<a name="arrays-and-array-methods"></a>

## Arrays & array methods

<details>
  <summary>Arrays & array methods</summary>

### Arrays & array methods

**Definition:** An `Array` — это объект для упорядоченного списка значений с неотрицательными целочисленными индексами плюс `length` это на один больше, чем самый высокий индекс. Это не ассоциативная карта — строковые ключи — это обычные свойства, а не элементы.

**How it works:**

- Отсчет от нуля: последний индекс `length - 1`. `arr[2]` и `arr["2"]` ударить по тому же элементу; `arr["02"]` это другое свойство.
- `length` растет, когда вы назначаете после конца (`arr[5] = x`) и сжимается за счет **удаления** элементов при его опускании.
- Дырки (`arr[1] = empty`) не то же самое, что `undefined`. Старые методы (`forEach`, `map`, `filter`) пропускать отверстия; более новые(`keys`, `find`, `includes`) обращаться с дырками как `undefined`.
- Копии **неглубокие**: `[...arr]`, `slice`, `concat`, `map` копировать ссылки на объекты, а не вложенные объекты.
- `typeof [] === "object"` - использовать `Array.isArray(value)` (or `Object.prototype.toString.call(value) === "[object Array]"`).

| Мутация | Немутирующая альтернатива |
| -------- | ------------------------ |
| `push` / `pop` / `shift` / `unshift` | `concat`, `slice`, `toSpliced` |
| `splice`, `sort`, `reverse` | `toSpliced`, `toSorted`, `toReversed` |
| `fill`, `copyWithin` | построить новый массив с помощью `map` / `slice` |

**When to use:** Последовательности, в которых важен порядок и доступ к индексу. Использовать `Set` только для уникальности, `Map` для нестроковых ключей. Отдавайте предпочтение неизменяемым методам в состоянии React и общим данным.

**Common pitfalls:**

```js
Array.isArray([]);                 // true
Array.isArray({ length: 2 });      // false — array-like is not an Array

const sparse = ["a"];
sparse[2] = "c";
sparse.length;                     // 3
sparse.map((x) => x);              // ['a', empty, 'c'] — hole preserved

fruits.length = 10;                // extends with holes, not undefined elements
fruits.length = 2;                 // deletes indexes >= 2
```

**Pluses and minuses:**

| + | − |
| --- | --- |
| Богатый встроенный API, повторяемый, поддерживающий JSON | Разреженные массивы и `sort` мутация удивляет людей |
| Литеральный синтаксис и отдых/распространение | Не настоящий кортеж — допускаются смешанные типы и дырки |
| Универсальные методы работают с массивами (`Array.from`, `.call`) | Мелкую копию легко принять за глубокий клон |

**Examples:**

```js
const arr = ["banana", "apple", "peach"];
arr.push("kiwi");                  // mutates; length 4
const copy = arr.slice();          // shallow copy
const next = [...arr, "mango"];    // new array

Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]
Array.from("hi");                  // ['h', 'i']
```

**Thoughts:** Интервьюеры хотят `Array.isArray`, мутация против копирования и это `length` жив, а не «массивы — это особый примитив».

**Sources:** [MDN Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) · [javascript.info/array](https://javascript.info/array)

</details>

<a name="transformation-and-search"></a>

## Transformation & search

<details>
  <summary>Transformation & search</summary>

### Transformation & search

**Definition:** Итерационные методы принимают `(element, index, array)` и либо создайте новый массив, сверните его до одного значения, либо выполните поиск. `map` / `filter` / `flatMap` копировать; `forEach` возвращает `undefined`; `reduce` возвращает все, что вы накопите.

**How it works:**

- `map(fn)` — новый массив **той же длины**; пропущенные дырки остаются дырками. Не используйте `map` только из-за побочных эффектов.
- `filter(fn)` — новый массив достоверных результатов обратного вызова; отверстия пропускаются (не сохраняются как `undefined`).
- `reduce(fn, init)` - складывать. Всегда проходите `init` если массив может быть пустым (`TypeError` в противном случае).
- `forEach(fn)` — посещение назначенных индексов; не могу `break` (использовать `for...of` / `some`).
- Поиск: `find` / `findIndex` / `includes` / `indexOf`. `includes` использует SameValueZero (`NaN` спички); `indexOf` использует `===` (`NaN` промахивается).
- `["1","2","3"].map(parseInt)` is `[1, NaN, NaN]` — `map` проходит `(element, index)` и `parseInt` рассматривает индекс как систему счисления.

| Метод | Возврат | Мутирует? |
| ------ | ------- | -------- |
| `map` | новый массив той же длины | нет |
| `filter` | новый массив, может быть короче | нет |
| `reduce` | аккумулятор (любого типа) | нет |
| `forEach` | `undefined` | нет (возможен обратный вызов) |
| `find` / `findIndex` | элемент/индекс или `-1` | no |
| `sort` | тот же **тот же** массив | **да** — используйте `toSorted` |

**When to use:** `map` трансформировать; `filter` уронить; `reduce` агрегировать или группировать; `forEach` / `for...of` для эффектов. Цепь `filter` затем `map` вместо того, чтобы совать оба в один `reduce` если вы не создаете массив, не являющийся массивом.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Декларативный, цепной, стандартный для интервью | `reduce` легко запутаться в нечитаемые складки |
| Методы копирования сохраняют оригиналы нетронутыми | Редкий + `map` сохраняет дырки; `map(parseInt)` радиксная ловушка |
| `toSorted` / `toSpliced` избежать мутации | `sort` без сравнения является лексикографическим (`[10, 2]` → `[10, 2]`) |

**Examples:**

```js
[1, 2, 3].map((n) => n * 2);                 // [2, 4, 6]
[1, 2, 3].filter((n) => n > 1);              // [2, 3]
[1, 2, 3].reduce((sum, n) => sum + n, 0);    // 6
[1, 2, 3].forEach((n) => console.log(n));    // undefined

["1", "2", "3"].map(Number);                 // [1, 2, 3]
["1", "2", "3"].map((s) => parseInt(s, 10)); // [1, 2, 3]

[10, 2, 1].toSorted((a, b) => a - b);        // [1, 2, 10]
```

**Thoughts:** *`map` трансформирует, `filter` выбирает, `reduce` агрегаты, `forEach` работает только.* Если вам нужен один объект или номер из списка, `reduce`; если тебе все еще нужен список, оставайся `map`/`filter`.

**Sources:** [MDN Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) · [Итеративные методы MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods) · [javascript.info/array-methods](https://javascript.info/array-methods)

</details>
