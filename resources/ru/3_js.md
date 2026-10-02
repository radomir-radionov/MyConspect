
# JavaScript — hub

Язык ECMAScript, объектная модель, среда выполнения браузера (DOM/BOM/события) и асинхронное программирование. Теория живет в темах Core, Browser и Async. Задачи вопросов и ответов и написания кода находятся в [Интервью](./3_js_interview.md).

## Resources & links

<details>
  <summary>Primary references</summary>

* [Учебник по современному JavaScript (javascript.info)](https://learn.javascript.ru/)
* [MDN — JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [Спецификация ECMA-262](https://tc39.es/ecma262/)
* [Блог о движке V8](https://v8.dev/)
* [Шпаргалка по современному JS](https://github.com/mbeaudru/modern-js-cheatsheet)
* [33 концепции JavaScript](https://github.com/leonardomso/33-js-concepts)* [Чистый код JavaScript] (https://github.com/ryanmcdermott/clean-code-javascript)
* [WTFJS](https://github.com/denysdovhan/wtfjs)
* [Шаблоны проектирования JavaScript](https://refactoring.guru/design-patterns/catalog)
* [Дока — ООП](https://doka.guide/tools/oop/)
* [Дока — как работает память](https://doka.guide/js/how-the-memory-works/)* [Как работает JavaScript (ByteByteGo)](https://blog.bytebytego.com/p/ep106-how-does-javascript-work)

</details>

<details>
  <summary>Tools & practice</summary>

### Tools & practice

* [JSV9000 — Визуализатор цикла событий] (https://www.jsv9000.app/)
* [Лупа — цикл событий](http://latentflip.com/loupe/)
* [AST Explorer](https://astexplorer.net/)
* [Codewars](https://www.codewars.com/dashboard)
* [Лучший из JS-проектов](https://bestofjs.org/projects?sort=total&page=2)

</details>

<details>
  <summary>Related docs in this repo</summary>

### Related docs in this repo

* [HTML — браузер и рендеринг](1_html.md)
* [CSS](2_css.md)
* [Реакция](4_react.md)
* [TypeScript](5_ts.md)
* [Веб-API — HTTP, хранилище, безопасность](6_web_api.md)
* [Node.js](8_nodejs.md)
* [БД](9_database.md)
* [Центр интервью](0_interview.md) · [JS — Интервью](./3_js_interview.md)

</details>

---

## JavaScript — overview

Охватывает язык ECMAScript, объектную модель, среду выполнения браузера (DOM/BOM/события) и асинхронное программирование.

### Main concepts

| Площадь | Темы |
|------|--------|
| **Язык** | [JIT](./3_js_core.md), модули → [core](./3_js_core.md) |
| **Типы данных и переменные** | Примитивы, приведение, [stack/heap](./3_js_variables.md#memory-stack-heap), [JSON](./3_js_variables.md#json), `let`/`const`/`var`, объем, [`globalThis`](./3_js_variables.md#globalthis), замыкания → [переменные](./3_js_variables.md) |
| **Операторы и циклы** | Выражения, операторы, сравнения, `Object.is`, `if` /петли/ `switch`, [обработка ошибок](./3_js_operators.md#error-handling) → [operators](./3_js_operators.md) |
| **Массив** | Индексированные коллекции, мутирующие и немутирующие методы, `map`/`filter`/`reduce` → [массив](./3_js_array.md) |
| **Функции** | Декларации, стрелы, `this`, ХОФ, `call`/`apply`/`bind` → [функции](./3_js_functions.md) |
| **ООП** | Прототипы, классы, дескрипторы, GC, `this` → [oop](./3_js_oop.md); дизайн и SOLID → [ООП и SOLID](./7_special_engineering.md#объектно-ориентированное-программирование-oop) |
| **Браузер** | [Документ](./3_js_browser.md), [События](./3_js_events.md), хранилище /CORS/[`URL` / `URLSearchParams`](./3_js_browser_extra.md#url--urlsearchparams) → [дополнительно](./3_js_browser_extra.md) · анатомия → [Веб-API](./6_web_api_core.md#uri-url--urn) |
| **Асинхронный** | Цикл событий, обещания, `async/await` → [async](./3_js_async.md) |
| **Дополнительно** | `Intl`, RegExp, Сигналы (TC39), `eval` → [дополнительно](./3_js_extra.md) |

### Navigation

| Часть 1 | Часть 2 |
|--------|--------|
| [Ядро — язык](./3_js_core.md) | [Ядро — типы данных и переменные](./3_js_variables.md) |
| [Ядро — операторы и циклы](./3_js_operators.md) | [Ядро — массив](./3_js_array.md) |
| [Ядро — функции](./3_js_functions.md) | [Ядро — классы и объекты](./3_js_oop.md) |
| [Браузер — Документ](./3_js_browser.md) | [Браузер — События](./3_js_events.md) |
|[Браузер — Дополнительно](./3_js_browser_extra.md) | [Async — обещания и выборка](./3_js_async.md) |
| [Дополнительно](./3_js_extra.md) | [Интервью — вопросы и задания](./3_js_interview.md) |
| [Центр интервью](./0_interview.md) | |

### Topic template

Каждая основная тема в подфайлах следующая:

**Определение** → **Плюсы/минусы** → **Когда использовать** → **Пример** → **Примечания** → **Источник** (javascript.info).
