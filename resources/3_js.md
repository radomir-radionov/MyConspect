
# JavaScript — hub

ECMAScript language, object model, browser runtime (DOM/BOM/events), and asynchronous programming. Theory and Interview Practice live in the four sub-files.

## Resources & links

<details>
  <summary>Primary references</summary>

* [Modern JavaScript Tutorial (javascript.info)](https://learn.javascript.ru/)
* [MDN — JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [ECMA-262 specification](https://tc39.es/ecma262/)
* [V8 engine blog](https://v8.dev/)
* [Modern JS Cheatsheet](https://github.com/mbeaudru/modern-js-cheatsheet)
* [33 JavaScript concepts](https://github.com/leonardomso/33-js-concepts)
* [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
* [WTFJS](https://github.com/denysdovhan/wtfjs)
* [JavaScript design patterns](https://refactoring.guru/design-patterns/catalog)
* [Doka — OOP](https://doka.guide/tools/oop/)
* [Doka — how memory works](https://doka.guide/js/how-the-memory-works/)
* [How does JavaScript work (ByteByteGo)](https://blog.bytebytego.com/p/ep106-how-does-javascript-work)

</details>

<details>
  <summary>Tools & practice</summary>

### Tools & practice

* [JSV9000 — Event loop visualizer](https://www.jsv9000.app/)
* [Loupe — Event loop](http://latentflip.com/loupe/)
* [AST Explorer](https://astexplorer.net/)
* [Codewars](https://www.codewars.com/dashboard)
* [Best of JS projects](https://bestofjs.org/projects?sort=total&page=2)

</details>

<details>
  <summary>Related docs in this repo</summary>

### Related docs in this repo

* [HTML — browser & rendering](1_html.md)
* [CSS](2_css.md)
* [React](4_react.md)
* [TypeScript](5_ts.md)
* [Web API — HTTP, storage, security](6_web_api.md)
* [Node.js](8_nodejs.md)
* [Databases](9_database.md)
* [Interview hub](0_interview.md) · [Core](./3_js_core.md#interview-practice) · [OOP](./3_js_oop.md#interview-practice) · [Async](./3_js_async.md#interview-practice) · [Browser](./3_js_browser.md#interview-practice)

</details>

---

## JavaScript — overview

Covers the ECMAScript language, object model, browser runtime (DOM/BOM/events), and asynchronous programming.

### Main concepts

| Area | Topics |
|------|--------|
| **Language** | Types, coercion, [JSON](./3_js_core.md#json), [stack/heap](./3_js_core.md#memory-stack-heap), JIT, scope, closures, functions, modules, errors, Signals (TC39) → [core](./3_js_core.md#signals) |
| **OOP** | Prototypes, classes, descriptors, GC, `this` → [oop](./3_js_oop.md); design & SOLID → [7_special](./7_special.md#2-oop--fp) |
| **Browser** | DOM, events, storage, CORS, [`URL` / `URLSearchParams`](./3_js_browser.md#url--urlsearchparams) → [browser](./3_js_browser.md) · anatomy → [Web API](./6_web_api.md#uri-url--urn) |
| **Async** | Event loop, promises, `async/await` → [async](./3_js_async.md) |

### Interview coverage checklist

| File | Theory | Q&A | Tasks | Status |
|------|--------|-----|-------|--------|
| [3_js_core.md](./3_js_core.md#interview-practice) | Yes | Yes | 15 | Complete |
| [3_js_async.md](./3_js_async.md#interview-practice) | Yes | Yes | 5+ | Complete |
| [3_js_oop.md](./3_js_oop.md#interview-practice) | Yes | Yes | 4+ | Complete |
| [3_js_browser.md](./3_js_browser.md#interview-practice) | Yes | Yes | 3+ | Complete |

### Navigation

| Part 1 | Part 2 |
|--------|--------|
| [Core — language](./3_js_core.md) | [Browser — DOM & events](./3_js_browser.md) |
| [OOP — objects & classes](./3_js_oop.md) | [Async — promises & practice](./3_js_async.md) |

### Interview practice

Output-prediction tasks, Q&A, and real-world cases live in:

* [3_js_core.md — Interview Practice](./3_js_core.md#interview-practice)
* [3_js_oop.md — Interview Practice](./3_js_oop.md#interview-practice)
* [3_js_async.md — Interview Practice](./3_js_async.md#interview-practice) (also [Practice](./3_js_async.md#practice))
* [3_js_browser.md — Interview Practice](./3_js_browser.md#interview-practice)
* [Interview hub](./0_interview.md)

### Topic template

Every major topic in the sub-files follows:

**Definition** → **Pros / Cons** → **When to use** → **Example** → **Notes** → **Source** (javascript.info).
