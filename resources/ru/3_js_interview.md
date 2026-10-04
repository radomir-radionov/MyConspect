# JS — Interview

Вопросы для собеседования по JavaScript. Ответы заполнены для опубликованной части, остальные пустые.

[← Назад в JS-хаб](./3_js.md)

### Related docs

- [Язык](./3_js_core.md) · [Операторы и циклы](./3_js_operators.md) · [Массивы](./3_js_array.md) · [Функции](./3_js_functions.md) · [Классы и объекты](./3_js_oop.md)
- [Документ](./3_js_browser.md) · [События](./3_js_events.md) · [API браузера](./3_js_browser_extra.md) · [Async](./3_js_async.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Вопросы из [Devinterview.io — JavaScript](https://devinterview.io/questions/web-and-mobile-development/javascript-interview-questions/).

### JavaScript Fundamentals

<details>
<summary>What are the data types present in JavaScript?</summary>

### What are the data types present in JavaScript?

**Definition:**

Значения JavaScript — это примитивы или объекты. У примитива нет собственных свойств; объект — набор свойств, а функции — объекты, которые можно вызвать.

**How it works:**

- Примитивы: `undefined`, `null`, boolean, number, bigint, string и symbol.
- `typeof null` даёт `"object"`. Это давняя ошибка оператора, а не повод считать `null` объектом.
- Number — число двойной точности IEEE-754. Целые за `Number.MAX_SAFE_INTEGER` уже не точны; bigint покрывает целые произвольного размера и не смешивается с number без явного преобразования.
- Значения symbol уникальны. Два вызова `Symbol("id")` никогда не равны.
- Обычные объекты, массивы и даты — все объекты. Массив — объект с индексными свойствами и `length`.
- Функции — вызываемые объекты. `typeof function () {}` равен `"function"`.
- Язык динамически типизирован. В одной привязке сейчас может лежать число, а потом строка.
- Операторы приводят типы. `"5" - 1` становится числом; `"5" + 1` — строкой.

**Examples:**

```js
typeof 1n;          // "bigint"
typeof Symbol("id"); // "symbol"
typeof null;        // "object"
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures

</details>

<details>
<summary>What is the difference between null and undefined?</summary>

### What is the difference between null and undefined?

**Definition:**

`undefined` значит, что значение не передали. `null` значит, что значение передали и оно намеренно пустое. При `==` они равны, при `===` — нет.

**How it works:**

- Привязка `let` или `var` без инициализатора равна `undefined`. Пропущенный аргумент — `undefined`. Чтение отсутствующего свойства — `undefined`.
- `null` записывают, когда нужно сказать «здесь ничего нет» намеренно, например «у этого поиска ещё нет совпадения».
- `typeof undefined` равен `"undefined"`. `typeof null` равен `"object"`.
- `null == undefined` истинно. `null === undefined` ложно. Берите `===`, если не имели в виду оба пустых значения.
- Запись свойства в `null` сохраняет ключ. `delete` ключ удаляет. После любого из этих шагов чтение отсутствующего ключа даёт `undefined`.
- Параметры по умолчанию срабатывают на `undefined`, не на `null`. `f(null)` не подставит умолчание вида `function f(x = 1)`.
- В JSON есть `null` и нет `undefined`. `JSON.stringify` пропускает `undefined` в объектах и превращает его в `null` в массивах.

**Examples:**

```js
let pending;
const match = null;
pending == match;   // true
pending === match;  // false
({ a: undefined }).hasOwnProperty("a"); // true, key exists
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined

</details>

<details>
<summary>How does JavaScript handle type coercion?</summary>

### How does JavaScript handle type coercion?

**Definition:**

Приведение — это перевод значения в другой тип. Явное приведение — функция, которую вызываете вы. Неявное — то, что делает оператор, потому что ему нужно число, строка или boolean.

**How it works:**

- Явно: `Number("5")`, `String(5)`, `Boolean(1)`, `parseInt("10px", 10)`.
- `+` со строкой склеивает, поэтому `1 + "2"` равен `"12"`. Остальная арифметика приводит к числу, поэтому `"5" - 1` равен `4`.
- `==` приводит типы, когда они различаются. `"4" == 4` истинно. `===` не приводит.
- `if`, `while` и условие `?:` используют ToBoolean. Ложные значения: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` и `NaN`.
- `&&` и `||` возвращают операнд, не обязательно boolean. `"pier" && 0` равен `0`. `"" || "tide"` равен `"tide"`.
- `Object.is` и `===` по-прежнему не считают `NaN` равным самому себе. Приведение нечисловой строки к числу даёт `NaN`.
- На границе лучше явное преобразование и `===` в сравнениях, чтобы приведение было видно.

**Examples:**

```js
Number("5");   // 5
"5" - 1;       // 4
1 + "2";       // "12"
"4" == 4;      // true
"4" === 4;     // false
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality
- https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion

</details>

<details>
<summary>Explain the concept of hoisting in JavaScript.</summary>

### Explain the concept of hoisting in JavaScript.

**Definition:**

Поднятие — это правило, по которому объявление создаётся на всю область видимости до её выполнения. В этом смысле переносится только объявление. Инициализатор остаётся на своей строке.

**How it works:**

- Объявление `function` создаётся и инициализируется в начале своей области, поэтому вызов выше объявления работает.
- `var` создаётся в начале функции (или скрипта) и инициализируется значением `undefined`. Присваивание выполняется там, где написано. Чтение до этой строки видит `undefined`, а не `ReferenceError`.
- `let` и `const` тоже поднимаются, но остаются неинициализированными до своей строки. Этот промежуток — временная мёртвая зона. Чтение там бросает `ReferenceError`.
- `const` нужно инициализировать в строке объявления. `let` можно объявить и присвоить позже.
- Функциональное выражение, записанное через `var`, следует правилам `var`: имя есть рано, функции нет, пока не выполнится присваивание.
- Объявления классов тоже во временной мёртвой зоне. Выше объявления они недоступны, в отличие от объявления `function`.
- Объявляйте привязки до использования. Поднятие объясняет старый код; на него не опираются как на стиль.

**Examples:**

```js
sayPier(); // "Pier 4"
function sayPier() { return "Pier 4"; }

console.log(label); // undefined
var label = "north";

// console.log(code); ReferenceError
let code = "NB";
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let

</details>

<details>
<summary>What is the scope in JavaScript?</summary>

### What is the scope in JavaScript?

**Definition:**

Область видимости — это участок кода, где можно использовать привязку. В JavaScript есть глобальная область, область функции, область модуля и область блока.

**How it works:**

- Привязка вне всякой функции и блока в обычном скрипте глобальна. В браузере для `var` и `function` это свойство глобального объекта. `let` и `const` на верхнем уровне скрипта — глобальные привязки, но свойствами `window` не становятся.
- У модуля (`type="module"`) своя область. Привязки верхнего уровня не глобальны, пока вы сами не положите их в `globalThis`.
- `var` имеет область функции. `var` внутри `if` или `for` виден всей функции.
- `let`, `const` и `class` имеют область блока. Привязка внутри `{ }` не видна снаружи этого блока и не видна до своей строки.
- Внутренняя область может читать внешнюю привязку. Внешняя не может читать внутреннюю. Поиск лексический: он идёт по месту, где функция написана, а не по месту вызова.
- Параметр принадлежит области функции.

**Examples:**

```js
const pier = "4";
function shift() {
  const tide = "flood";
  if (tide) {
    let note = "gate open";
    var flag = true;
  }
  return flag; // true, var ignores the block
  // note is not visible here
}
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/Scope
- https://javascript.info/closure

</details>

<details>
<summary>What is the difference between == and ===?</summary>

### What is the difference between == and ===?

**Definition:**

`===` — строгое равенство: то же значение и без приведения типа. `==` — абстрактное равенство: если типы различаются, оно приводит, затем сравнивает.

**How it works:**

- `5 === "5"` ложно. `5 == "5"` истинно, потому что строка становится числом.
- `null == undefined` истинно. `null === undefined` ложно. Ни то ни другое не равно `0` или `false` при `==`.
- `0 == false` истинно. `0 === false` ложно.
- `NaN === NaN` ложно. Когда вопрос в NaN, берите `Number.isNaN` или `Object.is`.
- `===` пропускает шаги приведения, поэтому это выбор по умолчанию в коде приложения. Сравнение ещё и проще читать.
- `==` — сознательный инструмент, когда имеют в виду «null или undefined»: `value == null`. В остальных местах таблицу приведения слишком легко перепутать.
- Равенство объектов у обоих операторов — по ссылке, когда оба значения уже объекты. Два разных объекта `{ a: 1 }` не равны.

**Examples:**

```js
0 == false;          // true
0 === false;         // false
null == undefined;   // true
null === undefined;  // false
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality

</details>

<details>
<summary>Describe closure in JavaScript. Can you give an example?</summary>

### Describe closure in JavaScript. Can you give an example?

**Definition:**

Замыкание — это функция вместе с привязками области, где она создана. Эти привязки остаются доступны после того, как внешняя функция вернулась.

**How it works:**

- Внешняя функция создаёт локальные привязки. Внутренняя их читает или пишет. Возврат внутренней функции (или регистрация её как обработчика) удерживает это окружение живым.
- Каждый вызов внешней функции создаёт новое окружение. Два счётчика из двух вызовов не делят `count`.
- Замыканиями в JavaScript прячут состояние: привязка не является свойством возвращённого объекта, поэтому снаружи её не прочитать по имени.
- Таймеры и обработчики событий замыкают переменные, которые используют. Переменная цикла — классическая ловушка: `var` — одна привязка на все итерации; `let` в `for` — своя привязка на итерацию.
- Замыкание может удерживать большой объект. Ссылку на внутреннюю функцию отпускают, когда состояние пора собрать.
- Если замкнутую привязку позже переприсвоят, внутренняя функция увидит новое значение. Она захватила привязку, а не замороженную копию, если только вы не скопировали значение в `const`.

**Examples:**

```js
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const next = makeCounter();
next(); // 1
next(); // 2
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
- https://javascript.info/closure

</details>

<details>
<summary>What is the 'this' keyword and how does its context change?</summary>

### What is the 'this' keyword and how does its context change?

**Definition:**

`this` задаётся тем, как функцию вызвали, а не тем, где обычная функция написана. У стрелочной функции своего `this` нет; она берёт `this` окружающей области.

**How it works:**

- Вызов метода `obj.shift()` ставит `this` равным `obj`.
- Обычный вызов `shift()` в строгом режиме и в модулях ставит `this` в `undefined`. В старом нестрогом скрипте это глобальный объект.
- `new Shift()` ставит `this` на новый объект.
- `fn.call(obj, arg)`, `fn.apply(obj, args)` и `fn.bind(obj)` задают `this` явно. `bind` возвращает новую функцию с зафиксированным `this`.
- Стрелочная функция игнорирует `call`, `apply` и `bind` в части `this`. Она сохраняет `this` того места, где стрелка создана.
- Слушатель, зарегистрированный ссылкой на метод (`el.addEventListener("click", obj.save)`), — обычный вызов, поэтому `this` не равен `obj`. Передавайте `obj.save.bind(obj)` или стрелку, которая вызывает `obj.save()`.
- Классы и модули строгие. Не рассчитывайте, что `this` — это `window`.

**Examples:**

```js
const berth = {
  name: "Pier 4",
  label() { return this.name; },
};
const loose = berth.label;
berth.label(); // "Pier 4"
loose();       // undefined in strict mode
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
- https://javascript.info/object-methods

</details>

<details>
<summary>What are arrow functions and how do they differ from regular functions?</summary>

### What are arrow functions and how do they differ from regular functions?

**Definition:**

Стрелочная функция — это функциональное выражение, записанное через `=>`. У неё короче форма, и она не получает собственные `this`, `arguments` и `new.target`.

**How it works:**

- Один параметр и одно выражение не требуют скобок и фигурных скобок: `n => n + 1`. Значение выражения и есть возвращаемое значение.
- Тело-блок пишут в фигурных скобках и с явным `return`.
- `this` лексический. Стрелка внутри метода видит `this` метода, поэтому стрелки удобны там как колбэки.
- Стрелка в роли обработчика события не получает элемент как `this`. Элемент — это `event.currentTarget`.
- Стрелки не бывают конструкторами. `new` на стрелке бросает ошибку.
- У них нет `prototype` и своего объекта `arguments`. Список аргументов закрывают rest-параметры.
- Они подходят для `map`, `filter` и коротких колбэков. Метод, которому нужен `this` места вызова, по-прежнему обычный метод, а не стрелочное свойство, если лексический `this` не нужен намеренно.

**Examples:**

```js
const twice = (n) => n * 2;
const berth = {
  name: "Pier 4",
  titles() {
    return ["a", "b"].map((item) => `${this.name}:${item}`);
  },
};
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

</details>

<details>
<summary>What are template literals in JavaScript?</summary>

### What are template literals in JavaScript?

**Definition:**

Шаблонная строка — это строка в обратных кавычках. Она может занимать несколько строк, а `${expression}` вставляет значение выражения.

**How it works:**

- `` `Pier ${id}` `` приводит выражение обычными правилами ToString и собирает одну строку.
- Переводы строк в литерале входят в строку. Для переноса, который вы реально набрали, `\n` не нужен.
- Внутри `${}` допустимо любое выражение, включая вызов или условие. Держите его маленьким: большой блок в скобках трудно читать.
- Тегированный шаблон вызывает функцию с частями строки и подставленными значениями. Так библиотеки экранируют HTML или собирают запросы. Обычный литерал HTML не экранирует.
- После вычисления это обычные строки. Отдельного типа во время выполнения нет.
- Старым движкам без поддержки шаблонов нужен шаг транспиляции. Современные браузеры их реализуют.

**Examples:**

```js
const pier = 4;
const line = `Berth at pier ${pier}`;
const board = `North
South`;
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals

</details>

### JavaScript Functions and Higher-Order Functions

<details>
<summary>What is a higher-order function in JavaScript?</summary>

### What is a higher-order function in JavaScript?

**Definition:**

Функция высшего порядка принимает функцию аргументом, возвращает функцию или делает и то и другое. Это возможно, потому что функции — значения.

**How it works:**

- `map`, `filter` и `reduce` принимают функцию и возвращают новый массив (или свёрнутое значение). В месте вызова рукописный цикл не нужен.
- `setTimeout`, `addEventListener` и `Promise.prototype.then` принимают колбэки. Вызывающий сам решает, что произойдёт позже.
- Функция может вернуть функцию, которая замыкает аргумент: так специализируют поведение, `const twice = multiplyBy(2)`.
- Возвращённая функция хранит лексическое окружение фабрики. Это замыкание, а не отдельная возможность `map`.
- Функции высшего порядка — обычный способ разделить повторяющийся шаг (повтор, журнал, проверка доступа), не копируя его в каждый вызов.
- Это по-прежнему обычные вызовы. Отдельного типа времени выполнения «higher-order» нет.

**Examples:**

```js
const multiplyBy = (factor) => (n) => n * factor;
const twice = multiplyBy(2);
[1, 2, 3].map(twice); // [2, 4, 6]
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/First-class_function
- https://javascript.info/array-methods

</details>

<details>
<summary>Can functions be assigned as values to variables in JavaScript?</summary>

### Can functions be assigned as values to variables in JavaScript?

**Definition:**

Да. Функции — значения, поэтому функцию можно хранить в привязке, передать аргументом, вернуть или положить в массив или объект.

**How it works:**

- Объявление функции создаёт привязку в своей области. Функциональное выражение или стрелка дают значение, которое вы присваиваете: `const greet = function () {}`.
- Присваивание функции копирует ссылку. `const say = greet` не клонирует функцию. Вызов `say()` вызывает ту же функцию.
- Переприсваивание привязки направляет её на другую функцию. Другие привязки, которые всё ещё держат старую ссылку, не меняются.
- Колбэки, слушатели событий и экспорты модулей — этот же механизм. Вы передаёте функцию; другая сторона её вызывает.
- Метод — функция, лежащая в свойстве. Если снять её с объекта (`const fn = obj.save`), вызов перестаёт быть вызовом метода, и `this` меняется.
- Имена функциональных выражений помогают в стеке. Анонимные стрелки себя не называют.

**Examples:**

```js
function greet() { return "hello"; }
const say = greet;
say(); // "hello"
const later = () => "ahoy";
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/First-class_function
- https://javascript.info/function-expressions

</details>

<details>
<summary>How do functional programming concepts apply in JavaScript?</summary>

### How do functional programming concepts apply in JavaScript?

**Definition:**

На JavaScript можно писать в функциональном стиле, потому что функции — значения. Чистота, неизменяемые обновления и функции высшего порядка — договорённости поверх этого, а не отдельная среда выполнения.

**How it works:**

- Функции первого класса позволяют передать в `map` преобразователь вместо рукописного цикла.
- Результат чистой функции зависит только от аргументов, и она не меняет внешнее состояние. `n => n * 2` чистая. Функция, которая пишет в `document.title`, — нет.
- Новые массивы и объекты (`map`, spread, `filter`) предпочтительнее изменения общего списка, когда его держат многие читатели.
- Декларативные методы массива говорят, каким будет результат. Цикл `for` говорит, как его собрать. Оба варианта законны; методы хороши, когда шаг — «оставить, отбросить или перестроить каждый элемент».
- JavaScript не принуждает к неизменяемости. `const` замораживает привязку, не объект. Чистый стиль вы держите сами или берёте библиотеку, которая помогает.
- Побочные эффекты живут по краям: чтение ввода, запись в DOM, сетевой вызов. Расчёт в середине остаётся функцией от данных.

**Examples:**

```js
const open = [{ id: 1, free: true }, { id: 2, free: false }];
const freeIds = open.filter((b) => b.free).map((b) => b.id);
```

**Sources:**

- https://javascript.info/array-methods
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map

</details>

<details>
<summary>What are IIFEs (Immediately Invoked Function Expressions)?</summary>

### What are IIFEs (Immediately Invoked Function Expressions)?

**Definition:**

IIFE — это функциональное выражение, которое выполняется сразу. Скобки делают функцию выражением, а хвостовые `()` её вызывают.

**How it works:**

- `(function () { const secret = 1; })();` создаёт область, выполняет её, и `secret` снаружи недоступен.
- Так обычно избегали глобальных переменных до модулей и `let`.
- Именованная IIFE может вызвать сама себя для небольшой рекурсии, и имя видно в стеке.
- `!function () {}()` и `void function () {}()` — другие способы сделать выражение. Форму со скобками узнают чаще.
- Стрелка тоже подходит: `(() => { /* setup */ })();`
- Сегодня модуль или обычный блок с `let` и `const` даёт область без церемонии. IIFE всё ещё уместна для разовой области внутри старого скрипта.
- Возвращаемое значение можно сохранить: `const api = (function () { return { open() {} }; })();`. Это старый модульный шаблон.
- Минификаторы переименовывают локальные имена внутри IIFE. Наружу они не утекают, если код сам не записал их в глобальный объект.

**Examples:**

```js
const pierId = (function () {
  const seed = 4;
  return `pier-${seed}`;
})();
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/IIFE
- https://javascript.info/function-expressions

</details>

<details>
<summary>How do you create private variables in JavaScript?</summary>

### How do you create private variables in JavaScript?

**Definition:**

Привязка приватна, когда её видят только функции, которые её замыкают. У современных классов есть ещё поля `#`: они приватны у экземпляра во время выполнения.

**How it works:**

- Фабрика замыкает привязки `let` и возвращает только те функции, которые должны быть публичными. Вызывающий саму привязку не получает.
- Конструктор может то же самое: локальные переменные конструктора видны методам, объявленным в этом конструкторе, и не лежат данными на прототипе.
- Методы, созданные внутри конструктора, свои у каждого экземпляра. Метод прототипа эти локальные переменные не видит. Поля `#` это закрывают: каждый метод в теле класса может читать `#secret`, а код снаружи — нет.
- Доступ к `#` снаружи класса — синтаксическая ошибка. `private` в TypeScript — другое: модификатор стирается, и свойство во время выполнения всё ещё есть.
- Модуль-IIFE возвращает публичный объект и держит остальное в замыкании. ES-модули заменяют этот шаблон: привязка, которую не экспортировали, уже скрыта внутри модуля.
- WeakMap с ключом-экземпляром — старый способ повесить приватные данные на объекты, которыми вы не владеете. В новом коде класса лучше поля `#`.
- Здесь приватность — это видимость, не защита от изменённой среды. Не считайте это местом, где секрет спрятан от скриптов самой страницы.

**Examples:**

```js
function makeLocker(secret) {
  return {
    check(guess) { return guess === secret; },
  };
}

class Locker {
  #secret;
  constructor(secret) { this.#secret = secret; }
  check(guess) { return guess === this.#secret; }
}
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures

</details>

### JavaScript Objects and Prototypes

<details>
<summary>How do you create an object in JavaScript?</summary>

### How do you create an object in JavaScript?

**Definition:**

</details>

<details>
<summary>What are prototypes in JavaScript?</summary>

### What are prototypes in JavaScript?

**Definition:**

</details>

<details>
<summary>Explain prototypal inheritance.</summary>

### Explain prototypal inheritance.

**Definition:**

</details>

<details>
<summary>What is the difference between object literals and constructor functions?</summary>

### What is the difference between object literals and constructor functions?

**Definition:**

</details>

<details>
<summary>How do you add or remove properties from an object?</summary>

### How do you add or remove properties from an object?

**Definition:**

</details>

### Asynchronous JavaScript

<details>
<summary>What is the event loop in JavaScript?</summary>

### What is the event loop in JavaScript?

**Definition:**

</details>

<details>
<summary>Explain how callbacks work in JavaScript.</summary>

### Explain how callbacks work in JavaScript.

**Definition:**

</details>

<details>
<summary>What are promises and how do they manage asynchronous code?</summary>

### What are promises and how do they manage asynchronous code?

**Definition:**

</details>

<details>
<summary>Explain async/await in JavaScript and how it differs from Promises.</summary>

### Explain async/await in JavaScript and how it differs from Promises.

**Definition:**

</details>

<details>
<summary>What is the Job Queue (or Microtask Queue)?</summary>

### What is the Job Queue (or Microtask Queue)?

**Definition:**

</details>

### DOM Manipulation and Browser APIs

<details>
<summary>How do you select DOM elements using JavaScript?</summary>

### How do you select DOM elements using JavaScript?

**Definition:**

</details>

<details>
<summary>Explain event propagation in the DOM.</summary>

### Explain event propagation in the DOM.

**Definition:**

</details>

<details>
<summary>How do you prevent a form from submitting using JavaScript?</summary>

### How do you prevent a form from submitting using JavaScript?

**Definition:**

</details>

<details>
<summary>What are Web APIs in the context of JavaScript?</summary>

### What are Web APIs in the context of JavaScript?

**Definition:**

</details>

<details>
<summary>How can you manipulate the browser history using JavaScript?</summary>

### How can you manipulate the browser history using JavaScript?

**Definition:**

</details>

### ES2015+ and Modern JavaScript Features

<details>
<summary>What are the new features introduced in ES6?</summary>

### What are the new features introduced in ES6?

**Definition:**

</details>

<details>
<summary>How do you use destructuring assignments in ES6?</summary>

### How do you use destructuring assignments in ES6?

**Definition:**

</details>

<details>
<summary>Explain the use of const and let keywords.</summary>

### Explain the use of const and let keywords.

**Definition:**

</details>

<details>
<summary>What are default parameters in JavaScript functions?</summary>

### What are default parameters in JavaScript functions?

**Definition:**

</details>

<details>
<summary>Explain the concept of modules in ES6.</summary>

### Explain the concept of modules in ES6.

**Definition:**

</details>

### Event Handling

<details>
<summary>How do you handle events in JavaScript?</summary>

### How do you handle events in JavaScript?

**Definition:**

</details>

<details>
<summary>What is event delegation and why is it useful?</summary>

### What is event delegation and why is it useful?

**Definition:**

</details>

<details>
<summary>How do you add and remove an event listener from an element?</summary>

### How do you add and remove an event listener from an element?

**Definition:**

</details>

<details>
<summary>Can you explain how "this" works in event handlers?</summary>

### Can you explain how "this" works in event handlers?

**Definition:**

</details>

<details>
<summary>What is the difference between event.preventDefault() and event.stopPropagation()?</summary>

### What is the difference between event.preventDefault() and event.stopPropagation()?

**Definition:**

</details>

### Web Storage and Security

<details>
<summary>What is the difference between localStorage, sessionStorage, and cookies?</summary>

### What is the difference between localStorage, sessionStorage, and cookies?

**Definition:**

</details>

<details>
<summary>Can you explain Cross-Site Scripting (XSS) and how to prevent it?</summary>

### Can you explain Cross-Site Scripting (XSS) and how to prevent it?

**Definition:**

</details>

<details>
<summary>What is Cross-Origin Resource Sharing (CORS) and how does it work?</summary>

### What is Cross-Origin Resource Sharing (CORS) and how does it work?

**Definition:**

</details>

<details>
<summary>How does content security policy (CSP) help in preventing security attacks?</summary>

### How does content security policy (CSP) help in preventing security attacks?

**Definition:**

</details>

### JavaScript Debugging

<details>
<summary>What tools and techniques do you use for debugging JavaScript code?</summary>

### What tools and techniques do you use for debugging JavaScript code?

**Definition:**

</details>

<details>
<summary>How do you debug a JavaScript application in the browser?</summary>

### How do you debug a JavaScript application in the browser?

**Definition:**

</details>

<details>
<summary>Explain the concept and use of breakpoints.</summary>

### Explain the concept and use of breakpoints.

**Definition:**

</details>

<details>
<summary>How do you handle exceptions in JavaScript?</summary>

### How do you handle exceptions in JavaScript?

**Definition:**

</details>

### Performance and Optimization

<details>
<summary>What techniques can be used to improve JavaScript performance?</summary>

### What techniques can be used to improve JavaScript performance?

**Definition:**

</details>

<details>
<summary>How does JavaScript minification and bundling contribute to performance?</summary>

### How does JavaScript minification and bundling contribute to performance?

**Definition:**

</details>

<details>
<summary>Discuss the importance of web page loading time and performance.</summary>

### Discuss the importance of web page loading time and performance.

**Definition:**

</details>

<details>
<summary>Explain how lazy loading works in JavaScript.</summary>

### Explain how lazy loading works in JavaScript.

**Definition:**

</details>

### JavaScript Testing

<details>
<summary>What are some JavaScript testing frameworks you know?</summary>

### What are some JavaScript testing frameworks you know?

**Definition:**

</details>

<details>
<summary>How can you write unit tests for JavaScript code?</summary>

### How can you write unit tests for JavaScript code?

**Definition:**

</details>

<details>
<summary>What is Test-Driven Development (TDD) in JavaScript?</summary>

### What is Test-Driven Development (TDD) in JavaScript?

**Definition:**

</details>

<details>
<summary>Can you explain the difference between unit and integration testing?</summary>

### Can you explain the difference between unit and integration testing?

**Definition:**

</details>

### Networking with JavaScript

<details>
<summary>How do you make HTTP requests in JavaScript?</summary>

### How do you make HTTP requests in JavaScript?

**Definition:**

</details>

<details>
<summary>What is the difference between XMLHttpRequest and Fetch API?</summary>

### What is the difference between XMLHttpRequest and Fetch API?

**Definition:**

</details>

<details>
<summary>What is AJAX, and how does it work?</summary>

### What is AJAX, and how does it work?

**Definition:**

</details>

<details>
<summary>How do you use WebSockets in a web application?</summary>

### How do you use WebSockets in a web application?

**Definition:**

</details>

### JavaScript Patterns and Best Practices

<details>
<summary>What is a design pattern in JavaScript?</summary>

### What is a design pattern in JavaScript?

**Definition:**

</details>

<details>
<summary>Can you explain the module pattern?</summary>

### Can you explain the module pattern?

**Definition:**

</details>

<details>
<summary>What is the Singleton pattern in JavaScript?</summary>

### What is the Singleton pattern in JavaScript?

**Definition:**

</details>

<details>
<summary>Explain the Revealing Module pattern.</summary>

### Explain the Revealing Module pattern.

**Definition:**

</details>

<details>
<summary>What are some best practices for coding in JavaScript?</summary>

### What are some best practices for coding in JavaScript?

**Definition:**

</details>

### JavaScript Algorithms and Data Structures

<details>
<summary>How do you implement a stack and a queue in JavaScript?</summary>

### How do you implement a stack and a queue in JavaScript?

**Definition:**

</details>

<details>
<summary>Explain how to sort an array in JavaScript.</summary>

### Explain how to sort an array in JavaScript.

**Definition:**

</details>

<details>
<summary>How do you check if a string is a palindrome?</summary>

### How do you check if a string is a palindrome?

**Definition:**

</details>

<details>
<summary>Describe a recursive function and provide an example.</summary>

### Describe a recursive function and provide an example.

**Definition:**

</details>

<details>
<summary>What is the time complexity of JavaScript operations?</summary>

### What is the time complexity of JavaScript operations?

**Definition:**

</details>

### JavaScript Libraries and Frameworks

<details>
<summary>What is the difference between a library and a framework in JavaScript?</summary>

### What is the difference between a library and a framework in JavaScript?

**Definition:**

</details>

<details>
<summary>Explain the Virtual DOM in React.</summary>

### Explain the Virtual DOM in React.

**Definition:**

</details>

<details>
<summary>How does data binding work in Angular?</summary>

### How does data binding work in Angular?

**Definition:**

</details>

<details>
<summary>What is Vue.js and what sets it apart from other frameworks?</summary>

### What is Vue.js and what sets it apart from other frameworks?

**Definition:**

</details>

<details>
<summary>Can you describe the jQuery library and its applications?</summary>

### Can you describe the jQuery library and its applications?

**Definition:**

</details>

### JavaScript ES2017+ and Beyond

<details>
<summary>What are async iterators and generators?</summary>

### What are async iterators and generators?

**Definition:**

</details>

<details>
<summary>What is the purpose of the async keyword?</summary>

### What is the purpose of the async keyword?

**Definition:**

</details>

<details>
<summary>Can you explain the use of Object.entries() and Object.values()?</summary>

### Can you explain the use of Object.entries() and Object.values()?

**Definition:**

</details>

<details>
<summary>How does JavaScript handle big integers (BigInt)?</summary>

### How does JavaScript handle big integers (BigInt)?

**Definition:**

</details>

<details>
<summary>What are dynamic imports in JavaScript?</summary>

### What are dynamic imports in JavaScript?

**Definition:**

</details>

### Browser Compatibility and Transpilation

<details>
<summary>How do you ensure your JavaScript code is cross-browser compatible?</summary>

### How do you ensure your JavaScript code is cross-browser compatible?

**Definition:**

</details>

<details>
<summary>What is Babel and how is it used in JavaScript development?</summary>

### What is Babel and how is it used in JavaScript development?

**Definition:**

</details>

<details>
<summary>What are polyfills, and when would you use them?</summary>

### What are polyfills, and when would you use them?

**Definition:**

</details>

### JavaScript and the DOM

<details>
<summary>What is the Document Object Model (DOM)?</summary>

### What is the Document Object Model (DOM)?

**Definition:**

</details>

<details>
<summary>How do you create, append, or remove an element from the DOM?</summary>

### How do you create, append, or remove an element from the DOM?

**Definition:**

</details>

<details>
<summary>Describe different ways to find or access HTML elements in the DOM.</summary>

### Describe different ways to find or access HTML elements in the DOM.

**Definition:**

</details>

<details>
<summary>Explain the difference between innerHTML and textContent.</summary>

### Explain the difference between innerHTML and textContent.

**Definition:**

</details>

<details>
<summary>How do you handle DOM events in a memory-efficient way?</summary>

### How do you handle DOM events in a memory-efficient way?

**Definition:**

</details>

### Tooling and Build Systems

<details>
<summary>What is npm, and how do you use it?</summary>

### What is npm, and how do you use it?

**Definition:**

</details>

<details>
<summary>Discuss the role of Webpack in modern JavaScript development.</summary>

### Discuss the role of Webpack in modern JavaScript development.

**Definition:**

</details>

<details>
<summary>What is a source map?</summary>

### What is a source map?

**Definition:**

</details>

<details>
<summary>How do you use ESLint for maintaining JavaScript code quality?</summary>

### How do you use ESLint for maintaining JavaScript code quality?

**Definition:**

</details>

<details>
<summary>What is continuous integration/continuous deployment (CI/CD) in the context of JS development?</summary>

### What is continuous integration/continuous deployment (CI/CD) in the context of JS development?

**Definition:**

</details>

### JavaScript and the Web Platform

<details>
<summary>What is the Window object and its significance?</summary>

### What is the Window object and its significance?

**Definition:**

</details>

<details>
<summary>Explain the Document object.</summary>

### Explain the Document object.

**Definition:**

</details>

<details>
<summary>What new features does HTML5 bring to JavaScript development?</summary>

### What new features does HTML5 bring to JavaScript development?

**Definition:**

</details>

<details>
<summary>Discuss the role of JavaScript in Progressive Web Apps (PWAs).</summary>

### Discuss the role of JavaScript in Progressive Web Apps (PWAs).

**Definition:**

</details>

### JavaScript and Mobile Development

<details>
<summary>Explain how to use JavaScript for mobile development.</summary>

### Explain how to use JavaScript for mobile development.

**Definition:**

</details>

<details>
<summary>What is React Native and how does it differ from traditional web apps?</summary>

### What is React Native and how does it differ from traditional web apps?

**Definition:**

</details>

<details>
<summary>How does JavaScript interact with native mobile components?</summary>

### How does JavaScript interact with native mobile components?

**Definition:**

</details>
