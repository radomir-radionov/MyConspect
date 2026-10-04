# JavaScript — hub

ECMAScript language, object model, browser runtime (DOM/BOM/events), and asynchronous programming. Theory lives in the Core, Browser, and Async topics. Interview questions live in [Interview](./3_js_interview.md).

## Resources & links

<details>
  <summary>Primary references</summary>

- [Modern JavaScript Tutorial (javascript.info)](https://learn.javascript.ru/)
- [MDN — JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [ECMA-262 specification](https://tc39.es/ecma262/)
- [V8 engine blog](https://v8.dev/)
- [Modern JS Cheatsheet](https://github.com/mbeaudru/modern-js-cheatsheet)
- [33 JavaScript concepts](https://github.com/leonardomso/33-js-concepts)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [WTFJS](https://github.com/denysdovhan/wtfjs)
- [JavaScript design patterns](https://refactoring.guru/design-patterns/catalog)
- [Doka — OOP](https://doka.guide/tools/oop/)
- [Doka — how memory works](https://doka.guide/js/how-the-memory-works/)
- [How does JavaScript work (ByteByteGo)](https://blog.bytebytego.com/p/ep106-how-does-javascript-work)

</details>

<details>
  <summary>Tools & practice</summary>

### Tools & practice

- [JSV9000 — Event loop visualizer](https://www.jsv9000.app/)
- [Loupe — Event loop](http://latentflip.com/loupe/)
- [AST Explorer](https://astexplorer.net/)
- [Codewars](https://www.codewars.com/dashboard)
- [Best of JS projects](https://bestofjs.org/projects?sort=total&page=2)

</details>

<details>
  <summary>Related docs in this repo</summary>

### Related docs in this repo

- [HTML — browser & rendering](1_html.md)
- [CSS](2_css.md)
- [React](4_react.md)
- [TypeScript](5_ts.md)
- [Web API — HTTP, storage, security](6_web_api.md)
- [Node.js](8_nodejs.md)
- [DB](9_database.md)
- [Interview hub](0_interview.md) · [JS — Interview](./3_js_interview.md)

</details>

---

## JavaScript — overview

Covers the ECMAScript language, object model, browser runtime (DOM/BOM/events), and asynchronous programming.

### Main concepts

| Area                       | Topics                                                                                                                                                                                                                                                |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Language**               | [JIT](./3_js_core.md), modules → [core](./3_js_core.md)                                                                                                                                                                                               |
| **Data Types & Variables** | Primitives, coercion, [stack/heap](./3_js_variables.md#memory-stack-heap), [JSON](./3_js_variables.md#json), `let`/`const`/`var`, scope, [`globalThis`](./3_js_variables.md#globalthis), closures → [variables](./3_js_variables.md)                  |
| **Operators & Loops**      | Expressions, operators, comparisons, `Object.is`, `if` / loops / `switch`, [error handling](./3_js_operators.md#error-handling) → [operators](./3_js_operators.md)                                                                                    |
| **Array**                  | Indexed collections, mutating vs non-mutating methods, `map`/`filter`/`reduce` → [array](./3_js_array.md)                                                                                                                                             |
| **Functions**              | Declarations, arrows, `this`, HOF, `call`/`apply`/`bind` → [functions](./3_js_functions.md)                                                                                                                                                           |
| **OOP**                    | Prototypes, classes, descriptors, GC, `this` → [oop](./3_js_oop.md); design & SOLID → [OOP & SOLID](./7_special_engineering.md#object-oriented-programming-oop)                                                                                       |
| **Browser**                | [Document](./3_js_browser.md), [Events](./3_js_events.md), storage / CORS / [`URL` / `URLSearchParams`](./3_js_browser_extra.md#url--urlsearchparams) → [additional](./3_js_browser_extra.md) · anatomy → [Web API](./6_web_api_core.md#uri-url--urn) |
| **Async**                  | Event loop, promises, `async/await` → [async](./3_js_async.md)                                                                                                                                                                                        |
| **Additional**             | `Intl`, RegExp, Signals (TC39), `eval` → [additional](./3_js_extra.md)                                                                                                                                                                                |

### Navigation

| Part 1                                          | Part 2                                               |
| ----------------------------------------------- | ---------------------------------------------------- |
| [Core — language](./3_js_core.md)               | [Core — data types & variables](./3_js_variables.md) |
| [Core — operators & loops](./3_js_operators.md) | [Core — array](./3_js_array.md)                      |
| [Core — functions](./3_js_functions.md)         | [Core — classes & objects](./3_js_oop.md)            |
| [Browser — Document](./3_js_browser.md)         | [Browser — Events](./3_js_events.md)                 |
| [Browser — Additional](./3_js_browser_extra.md) | [Async — promises & fetch](./3_js_async.md)          |
| [Additional](./3_js_extra.md)                   | [Interview — questions](./3_js_interview.md)         |
| [Interview hub](./0_interview.md)               |                                                      |

### Topic template

Every major topic in the sub-files follows:

**Definition** → **Pros / Cons** → **When to use** → **Example** → **Notes** → **Source** (javascript.info).
