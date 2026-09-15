# JS Browser — DOM, BOM & Events

Covers the browser environment, DOM manipulation, events, storage, CORS, observers, History API, and UI performance patterns.

### Related docs

* [JS Core](./3_js_core.md) · [JSON](./3_js_core.md#json) · [JS OOP](./3_js_oop.md) · [JS Async](./3_js_async.md)
* [HTML browser & rendering](./1_html.md) · [Web API](./6_web_api.md) · [HTTP cookies](./6_web_api.md#http-cookies) · [URI / URL anatomy](./6_web_api.md#uri-url--urn) · [CORS](./6_web_api.md#cors) · [PWA](./6_web_api.md#pwa-progressive-web-app) · [OS files & file systems](./8_nodejs.md#files--file-systems)
* [Jest DOM tests (`jsdom`)](./7_special.md#jest--first-tests-node-vs-jsdom)

[← Back to JS hub](./3_js.md)

### Main concepts

| Area | Topics |
|------|--------|
| **Environment** | `window`, specs, script loading |
| **DOM** | Tree, querying, attributes vs properties, modification |
| **Events** | Bubbling, capturing, delegation, default actions |
| **UI** | Dimensions, scroll, coordinates, `rAF`, idle callbacks |
| **APIs** | Storage, CORS, observers, History API, `URL` / `URLSearchParams`, Web Components |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **Cases** · **Pros | Cons** · **Example** · pitfalls where relevant.

- [Script loading](#script-loading)
- [DOM, BOM & events](#dom-bom-events)
- [Browser APIs & UI patterns](#browser-apis--ui-patterns)
- [Browser storage & security](#browser-storage) · [CORS](#cors-same-origin) · [Observers](#intersection-resize-observer) · [History API](#history-api) · [URL / URLSearchParams](#url--urlsearchparams)
- [Interview Practice](#interview-practice)

Topics also covered: **cookies / Web Storage / IndexedDB / localForage**, **CORS**, **IntersectionObserver**, **ResizeObserver**, **History API**.

---

<a name="script-loading"></a>

## Script loading

<details>
  <summary>add script(async & defer & working thread)</summary>

### Script tags & loading

**Definition:** `<script>` loads and runs JavaScript. By default it **blocks HTML parsing** until the script finishes.

**How it works:**

- Parser hits `<script>` without `async`/`defer` → stops HTML parse, fetches (if `src`), executes, then resumes parse.
- `defer`: download parallel, execute in order after HTML parsed, before `DOMContentLoaded`.
- `async`: download parallel, execute when ready (order not guaranteed), may block parse at execution.
- `type="module"`: deferred by default, strict mode, `import`/`export`.

| Pros | Cons |
|------|------|
| `defer` preserves order, non-blocking | Still executes on main thread |
| `async` for independent scripts | Order unpredictable |
| Modules tree-shake, strict | Older browsers need nomodule fallback |

**Cases:** App bundle → `defer`; analytics/ads → `async`; ES app → `type="module"`.

**Common pitfalls:** Two `async` scripts depending on each other; inline script before deferred external assuming it ran; module CORS requirements for cross-origin `src`.

**Key idea:** Place non-critical scripts at the end of `<body>` or use `async` / `defer` to avoid blocking render.

**Example:**

<details>
  <summary>Code</summary>

```html
<script src="app.js" defer></script>
<script src="analytics.js" async></script>
```

</details>

### async & defer

| Attribute | Download | Execution order | Best for |
|-----------|----------|-----------------|----------|
| *(none)* | blocks parsing | document order | legacy inline scripts |
| `defer` | parallel | document order, before `DOMContentLoaded` | app bundles needing full DOM |
| `async` | parallel | first-ready-first-run | ads, analytics, independent scripts |
| `type="module"` | parallel | defer-like, strict mode by default | ES modules |

**Example:**

<details>
  <summary>Code</summary>

```html
<script src="a.js" defer></script>
<script src="b.js" defer></script>
<script src="tracker.js" async></script>
```

</details>

**Source:** [javascript.info/script-async-defer](https://learn.javascript.ru/script-async-defer)

</details>

<a name="dom-bom-events"></a>

## DOM, BOM & events

<details>
  <summary>DOM</summary>

### DOM

**Definition:** The DOM is a live **node tree** the browser builds from HTML/XML. JS reads and mutates it through `document` — it is not the source file.

**Sequence** (parse → mutate):

```
1. Parse    HTML → node tree (`document` root)
2. Access   documentElement / head / body → getElementById / querySelector
3. Read     nodeType; children vs childNodes; attributes vs properties
4. Mutate   createElement / append / property write → later layout/paint
```

`window` → `document` → `<html>` (`document.documentElement`). Tags, text, and comments are all nodes.

| Node | `nodeType` | Example |
|------|------------|---------|
| Document | `DOCUMENT_NODE` (9) | `document` |
| Element | `ELEMENT_NODE` (1) | `<div>` |
| Text | `TEXT_NODE` (3) | `"Hello"` |
| Comment | `COMMENT_NODE` (8) | `<!-- note -->` |

| API | Returns |
|-----|---------|
| `children` / `nextElementSibling` | elements only |
| `childNodes` / `nextSibling` | all nodes (often whitespace text) |
| `getElementById` / `querySelector` / `querySelectorAll` | id / first CSS match / all matches |

**Attributes vs properties:** HTML string vs live JS field. Form state (`checked`, `value`, `disabled`) → **property**. `getAttribute` stays the original markup. `href` attribute is the raw string; `.href` is the resolved URL. `data-*` → `elem.dataset`.

**How it works:** Writes update the live tree immediately; mixed read/write loops can layout-thrash. Live collections change as the tree changes.

**Cases:** Mount UI; read/update attrs and properties; build lists.

| + | − |
| --- | --- |
| Standard live tree, CSS selectors | Verbose vs VDOM; live lists surprise |

**Example:**

<details>
  <summary>Code</summary>

```js
document.title = 'My App';
const app = document.getElementById('app');
app.children[0].tagName; // "P"
app.firstChild;          // often a whitespace text node

const box = document.querySelector('input[type=checkbox]');
box.checked = false;
box.getAttribute('checked'); // still "checked" if it was in HTML
```

</details>

**Common pitfalls:** `innerHTML` + user input (XSS); `checked`/`value` attribute vs property; assuming `firstChild` is an element.

**Key idea:** Mutate the **runtime tree**, not the HTML file.

**See also:** [DOM navigation](#dom-navigation) · [DOM methods & props](#dom-methods--props) · [HTMLCollection vs NodeList](#htmlcollection-vs-nodelist) · [innerHTML vs outerHTML](#innerhtml-vs-outerhtml)

**Source:** [MDN DOM](https://developer.mozilla.org/en-US/docs/Glossary/DOM) · [Node.nodeType](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType)

### shadow dom

**Definition:** A private, isolated DOM subtree attached to a host element — separate from the page's normal (light) DOM.

**Why we need it:** Without it, all components share one global DOM and CSS scope — styles leak, selectors clash, and internals are exposed. Shadow DOM gives **encapsulation**: scoped styles, hidden markup, and safe reuse across pages.

**When to use:** Web Components, embeddable widgets, third-party UI on unknown pages.

**When NOT to use:** React/Vue apps (they handle encapsulation differently); when you want global page styles to affect the component.

**Source:** [learn.javascript.ru/shadow-dom](https://learn.javascript.ru/shadow-dom)

**Light tree vs shadow tree:**

- **Light tree** — normal DOM subtree from HTML children
- **Shadow tree** — hidden subtree, not reflected in HTML source

```js
const shadowRoot = elem.attachShadow({ mode: 'open' | 'closed' });
// mode: 'open' → accessible via elem.shadowRoot
```

Shadow DOM elements:

- Have their own ID scope
- Invisible to `querySelector` from the main document
- Styled only by styles inside the shadow tree

### Page lifecycle events

**Definition:** Browser fires events as the page loads and unloads. Use them to initialize UI or warn users about unsaved data.

| Event | Fires when | Target |
|-------|-----------|--------|
| `DOMContentLoaded` | HTML parsed, DOM ready (images may still load) | `document` |
| `load` | All resources loaded (images, styles, scripts) | `window` |
| `beforeunload` | User is leaving the page | `window` |
| `unload` | Page is being unloaded | `window` |

**Key difference:** `DOMContentLoaded` — init UI early; `load` — wait for all assets.

**Example:**

<details>
  <summary>Code</summary>

```js
document.addEventListener('DOMContentLoaded', () => {
  initApp(); // DOM is ready
});

window.addEventListener('load', () => {
  hideLoader(); // images loaded too
});
```

</details>

**Source:** [javascript.info/onload-ondomcontentloaded](https://learn.javascript.ru/onload-ondomcontentloaded)

### Creating & appending elements

**Example:**

<details>
  <summary>Code</summary>

```js
const li = document.createElement('li');
li.textContent = 'New item';
li.classList.add('active');
document.querySelector('ul').append(li);
```

</details>

### HTMLCollection vs NodeList

| | HTMLCollection | NodeList |
|---|----------------|----------|
| **Live?** | yes (auto-updates) | usually static (`querySelectorAll`) |
| **Contains** | elements only | any node type |
| **Access** | index, name, id | index only |
| **From** | `getElementsBy*` | `querySelectorAll`, `childNodes` |

**Example:**

<details>
  <summary>Code</summary>

```js
const live = document.getElementsByClassName('item');   // live
const snap = document.querySelectorAll('.item');      // static snapshot

document.querySelector('.item').remove();
live.length;  // decreased
snap.length;  // unchanged
```

</details>

**Note:** Neither is a real array — use `Array.from()` or spread to iterate with array methods.

### innerHTML vs outerHTML

| Property | Returns / sets |
|----------|----------------|
| `innerHTML` | HTML **inside** the element (children only) |
| `outerHTML` | HTML **including** the element itself |

**Example:**

<details>
  <summary>Code</summary>

```html
<div id="box"><span>Hi</span></div>
```

```js
box.innerHTML;  // '<span>Hi</span>'
box.outerHTML;  // '<div id="box"><span>Hi</span></div>'
```

</details>

**Warning:** `innerHTML` parses HTML strings — sanitize user input to prevent XSS. Types and encoding: [Special — XSS](./7_special.md#xss-cross-site-scripting).

### window vs document

| | `window` | `document` |
|---|----------|------------|
| **Role** | Browser global object | DOM entry point (child of `window`) |
| **Access** | implicit global | `document` or `window.document` |
| **APIs** | `alert()`, `location`, `setTimeout` | `getElementById`, `createElement`, `querySelector` |

**Example:**

<details>
  <summary>Code</summary>

```js
window.innerWidth;              // viewport size
document.querySelector('h1');   // DOM query
```

</details>

</details>

<details>
  <summary>DOM navigation</summary>

### DOM navigation

**Definition:** Traverse the DOM tree using parent/child/sibling properties and query methods.

**How it works:**

- Tree links: `parentNode`, `childNodes`, `nextSibling`, etc.; element-only variants skip text nodes.
- `querySelector(All)` runs selector engine on subtree; `getElementsBy*` returns live HTMLCollection.

| Pros | Cons |
|------|------|
| Direct traversal fast for known structure | `childNodes` includes text nodes |
| `querySelector` flexible | Live collections update during iteration |
| `closest()` for delegation targets | Deep walks manual and brittle |

**Cases:** Walk to parent form; find next sibling element; scoped `el.querySelector('.title')`.

**Common pitfalls:** `firstChild` vs `firstElementChild`; modifying live collection while looping; assuming `children[0]` exists.

**Traversal properties:**

| Direction | All nodes | Elements only |
|-----------|-----------|---------------|
| Parent | `parentNode` | `parentElement` |
| Children | `childNodes` | `children` |
| First child | `firstChild` | `firstElementChild` |
| Last child | `lastChild` | `lastElementChild` |
| Previous | `previousSibling` | `previousElementSibling` |
| Next | `nextSibling` | `nextElementSibling` |

**Query methods:**

| Method | Scope | Returns | Live? |
|--------|-------|---------|-------|
| `getElementById(id)` | document | element or `null` | — |
| `getElementsByClassName(cls)` | element | HTMLCollection | yes |
| `getElementsByTagName(tag)` | element | HTMLCollection | yes |
| `querySelector(sel)` | element | first match or `null` | — |
| `querySelectorAll(sel)` | element | NodeList | static |

**Key idea:** `getElementsBy*` returns **live** collections; `querySelectorAll` returns a **snapshot**.

**Example:**

<details>
  <summary>Code</summary>

```js
const list = document.querySelector('.list');
list.children;                        // element children only
list.querySelectorAll('li.active');   // static NodeList
list.getElementsByTagName('li');      // live HTMLCollection
```

</details>

</details>

<details>
  <summary>DOM methods & props</summary>

### DOM methods & props

**Definition:** Common APIs for finding elements, working with forms, and reading custom data.

**How it works:**

- `document` methods search from document or element root.
- `dataset` maps `data-*` attributes to camelCase JS properties.
- `forms` collection indexes `<form>` elements; `requestSubmit()` fires submit event + validation.

| Pros | Cons |
|------|------|
| `dataset` clean custom data API | All `data-*` values are strings |
| `requestSubmit()` respects constraints | `submit()` bypasses handlers |
| Scoped query on elements | `getElementsBy*` live collections confuse |

**Cases:** Read `data-id` for delegation; programmatic form submit with validation; find first matching child.

**Common pitfalls:** `dataset` sets string only; `getAttribute('value')` vs `input.value` differ; multiple forms — `document.forms[name]`.

**Finding elements:**

**Example:**

<details>
  <summary>Code</summary>

```js
document.getElementById('app');
document.getElementsByClassName('card');
document.querySelector('.card.active');
document.querySelectorAll('li');
```

</details>

**`querySelector` vs `getElementsBy*`:** `querySelector(All)` works on any element and accepts full CSS selectors; `getElementsBy*` only searches descendants and returns live collections.

**Traversal:** `parentNode`, `childNodes`, `firstChild`, `lastChild`, `previousSibling`, `nextSibling`.

#### `.forms` property

Returns an `HTMLCollection` of all `<form>` elements in the document.

```js
document.forms[0].submit();
```

#### `.submit()` vs `.requestSubmit()`

| Method | Fires `submit` event | Runs validation |
|--------|---------------------|-----------------|
| `.submit()` | no | no |
| `.requestSubmit()` | yes | yes |

```js
form.requestSubmit(); // preferred — triggers validation & handlers
```

#### `.dataset` property

Reads `data-*` attributes as a camelCase object.

```html
<div data-user-id="42" data-role="admin"></div>
```

```js
el.dataset.userId;  // "42"
el.dataset.role;    // "admin"
el.dataset.score = '100'; // sets data-score="100"
```

</details>
	

<details>
  <summary>BOM</summary>

### BOM

**Definition:** Browser Object Model — browser-provided objects **outside** the document: `window`, `location`, `navigator`, `history`, `screen`, timers.

**How it works:**

- `window` is global object in browsers; `document`, `location`, `history`, `navigator` are properties.
- BOM APIs are browser-specific (not in ECMAScript spec); DOM is separate but accessed via `window.document`.

| Pros | Cons |
|------|------|
| Unified `window` entry point | Not available in Node (different globals) |
| `location` for navigation | Direct `location` assignment full page reload |
| `history` for SPA routing | History state size limits |

**Cases:** Redirect via `location.href`; read `navigator.userAgent` (feature detect better); `history.pushState` for SPA.

**Common pitfalls:** Treating BOM as part of ECMAScript; `window.open` blocked by pop-up blockers; `navigator` fields spoofable.

**Key objects:**

| Object | Purpose |
|--------|---------|
| `window` | Global scope, dialogs, viewport size |
| `location` | Current URL, redirect |
| `navigator` | Browser/OS info (`userAgent`) |
| `history` | Back/forward navigation |
| `screen` | Screen dimensions |

**Example:**

<details>
  <summary>Code</summary>

```js
location.href = 'https://example.com';
navigator.userAgent;
history.back();
```

</details>

**Source:** [learn.javascript.ru/browser-environment](https://learn.javascript.ru/browser-environment)

<a name="dom-vs-bom"></a>

### DOM vs BOM

| | DOM | BOM |
|---|-----|-----|
| **Scope** | Document content (page) | Browser environment |
| **Entry point** | `document` | `window` |
| **Examples** | `querySelector`, `createElement` | `location`, `navigator`, `alert()` |
| **Spec** | DOM spec (works outside browsers too) | HTML spec (browser-only) |

</details>

<details>
  <summary>event</summary>

### Events

**Definition:** An event is a browser signal that something happened (click, keypress, scroll, load). A **handler** is a function that runs in response.

**How it works:**

- User action or browser signal creates event object; dispatches through capture → target → bubble phases.
- `addEventListener(type, handler, options)` registers; multiple handlers per event allowed.
- Handler receives event as first argument; `this` is `currentTarget` for non-arrow functions.

| Pros | Cons |
|------|------|
| Declarative UI reactions | Forgetting `removeEventListener` leaks memory |
| `addEventListener` flexible options | Inline handlers mix concerns |
| Event object rich metadata | Too many listeners hurt performance |

**Cases:** Click/key handlers; form `submit`; `DOMContentLoaded` init; custom events for decoupling.

**Common pitfalls:** Arrow vs function `this` difference; assuming `target` === `currentTarget`; duplicate listeners on re-render without cleanup.

**Event categories:** Mouse, Keyboard, Form, Document/Window, Touch.

**Common events:**

| Event | Trigger |
|-------|---------|
| `click` / `dblclick` | Mouse click / double-click |
| `contextmenu` | Right-click |
| `mouseover` / `mouseout` | Hover enter / leave |
| `keydown` / `keyup` | Key press / release |
| `focus` / `blur` | Element focused / unfocused |
| `input` / `change` | Value changing / committed |
| `submit` | Form submitted |
| `DOMContentLoaded` | DOM fully parsed |

**3 ways to assign handlers:**

| Method | Example | Notes |
|--------|---------|-------|
| HTML attribute | `onclick="..."` | Avoid — mixes HTML & JS |
| DOM property | `elem.onclick = fn` | Only one handler per event |
| `addEventListener` | `elem.addEventListener('click', fn)` | Preferred — multiple handlers, options |

**Example:**

<details>
  <summary>Code</summary>

```js
button.addEventListener('click', (e) => {
  console.log(e.type, e.target);
});
```

</details>

### Event object

**Definition:** The browser passes an `event` object as the first argument to every handler.

**Common properties:** `type`, `target`, `currentTarget`, `clientX`/`clientY` (mouse), `key` (keyboard).

```js
link.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(e.target.href);
});
```

### Object handlers (`handleEvent`)

```js
const handler = {
  handleEvent(e) {
    console.log(e.type, e.currentTarget);
  },
};
elem.addEventListener('click', handler);
```

**Source:** [javascript.info/events](https://learn.javascript.ru/events) · [default-browser-action](https://learn.javascript.ru/default-browser-action)

</details>

<a name="event-phases"></a>

<details>
  <summary>event phases</summary>

### Event phases

**Definition:** Every event travels through 3 phases: **capturing** (top → target), **target**, **bubbling** (target → top). Default handlers run on the **bubble** phase.

<img width="688" alt="image" src="https://github.com/Way-to-Front-end-Developer/Core/assets/66359081/cae585f8-2239-4d66-a49c-53c34560312d">

**How it works:**

- Capture: window → … → parent of target (handlers with `capture: true`).
- Target: handlers on target element (both capture-flag and bubble-flag run in registration order on target).
- Bubble: target → … → window (default `capture: false`).

| Pros | Cons |
|------|------|
| Capture for early interception | Easy to forget which phase handler uses |
| Bubble enables delegation | Stopping propagation affects other listeners |
| `eventPhase` introspection | Three phases mental overhead |

**Cases:** Delegation on bubble (default); focus trap on capture; analytics on capture before `stopPropagation`.

**Common pitfalls:** Parent capture handler stopping before child runs; confusing `target` (clicked node) with `currentTarget` (node with listener).

| Phase | Direction | Default? |
|-------|-----------|----------|
| Capturing | `window` → target | no |
| Target | on the element itself | — |
| Bubbling | target → `window` | **yes** |

**Key properties:**

| Property | Meaning |
|----------|---------|
| `event.target` | Element that triggered the event (doesn't change) |
| `event.currentTarget` | Element whose handler is running now (`this`) |
| `event.eventPhase` | `1` capturing, `2` target, `3` bubbling |

**Capturing handlers:** pass `{ capture: true }` as third argument to `addEventListener`.

**Example:**

<details>
  <summary>Code</summary>

```js
parent.addEventListener('click', handler, { capture: true }); // runs on way down
child.addEventListener('click', handler);                     // runs on way up (bubble)
```

</details>

</details>

<details>
  <summary>event handlers</summary>

<a name="event-delegation"></a>

### Event handlers

**Definition:** Functions that run when an event fires. Prefer `addEventListener` over inline handlers.

**How it works:**

- `preventDefault()` blocks default browser action (navigation, submit).
- `stopPropagation()` stops further propagation; `stopImmediatePropagation()` also blocks other handlers on same element.
- `passive: true` tells browser listener won't `preventDefault` — scroll performance.

| Pros | Cons |
|------|------|
| Delegation — one listener for many children | Wrong `target` if nested elements inside `li` |
| `once: true` auto cleanup | `removeEventListener` needs same function reference |
| Passive listeners smoother scroll | Cannot preventDefault in passive listener |

**Cases:** List click delegation; prevent form full page submit; stop modal click bubbling to overlay.

**Common pitfalls:** `stopPropagation` on child blocks parent delegation; rebinding new arrow fn each render prevents removal; passive + `preventDefault` ignored.

**addEventListener signature:**

**Example:**

<details>
  <summary>Code</summary>

```js
elem.addEventListener(event, handler, options);
// options: { capture, once, passive }
```

</details>

| Option | Effect |
|--------|--------|
| `capture: true` | Run during capturing phase |
| `once: true` | Auto-remove after first call |
| `passive: true` | Won't call `preventDefault()` (better scroll perf) |

**Removing handlers:** `removeEventListener(event, sameFn, capture)` — must pass the **same function reference**.

**`this` in handlers:** regular functions → `this` is `currentTarget`; arrow functions → inherit outer `this`.

<img width="642" alt="image" src="https://github.com/Way-to-Front-end-Developer/Core/assets/66359081/0d37f5f7-4c42-49d6-9100-6520df837439">

### Event object methods

| Method | Effect |
|--------|--------|
| `preventDefault()` | Cancel default browser action (link navigation, form submit) |
| `stopPropagation()` | Stop event from reaching other elements |
| `stopImmediatePropagation()` | Stop propagation + block other handlers on same element |

```js
form.addEventListener('submit', (e) => {
  e.preventDefault(); // don't reload page
  submitViaFetch();
});

// prevent link navigation
link.addEventListener('click', (e) => {
  e.preventDefault();
  openModal();
});

// stop click from reaching parent overlay
button.addEventListener('click', (e) => {
  e.stopPropagation();
});
```

### Default actions & passive listeners

- `event.defaultPrevented` — `true` after `preventDefault()`
- `passive: true` — browser won't wait for `preventDefault()` (used for touch/scroll)
- Returning `false` from inline `on*` handlers also cancels default (legacy)

### Event delegation

Attach **one** listener on a parent; use `event.target` to identify which child was clicked.

| Pros | Cons |
|------|------|
| Fewer listeners, works for dynamic children | `event.target` may not be the intended element |
| Better memory on long lists | Must filter targets carefully |

```js
list.addEventListener('click', (e) => {
  if (!e.target.matches('li.cell')) return;
  handleCell(e.target);
});
```

**Source:** [javascript.info/event-delegation](https://learn.javascript.ru/event-delegation)

</details>

<details>
  <summary>Changing the DOM</summary>

### Changing the DOM

**Definition:** Create, insert, modify, and remove nodes to update the page dynamically.

**How it works:**

- `createElement` / `createTextNode` build nodes; insert via `append`, `before`, `after`, `replaceWith`.
- Moving existing node removes it from old parent — single parent rule.
- `innerHTML` parses HTML string; `textContent` escapes and is safe for text.

| Pros | Cons |
|------|------|
| Modern insert methods readable | Many reflows if inserting one-by-one |
| `replaceWith` atomic swap | `innerHTML` XSS if untrusted |
| `cloneNode(true)` deep copy | Moved nodes leave old references stale |

**Cases:** Build list items; replace banner; sanitize then `textContent` for user text.

**Common pitfalls:** `innerHTML` with user strings; appending in loop causes N reflows (use `DocumentFragment`); `appendChild` same as move not copy.

#### Creating nodes

**Example:**

<details>
  <summary>Code</summary>

```js
const div = document.createElement('div');
const text = document.createTextNode('Hello');
const comment = document.createComment('note');
```

</details>

#### Inserting nodes

| Method | Inserts |
|--------|---------|
| `append(...nodes)` | after last child |
| `prepend(...nodes)` | before first child |
| `before(...nodes)` | before the element |
| `after(...nodes)` | after the element |
| `replaceWith(...nodes)` | replaces the element |

```js
parent.append(newLi);
parent.prepend(header);
item.before(divider);
item.after(footer);
```

#### Inserting HTML

| Method | Parses HTML? | XSS risk |
|--------|-------------|----------|
| `textContent` | no (safe text) | low |
| `innerHTML` | yes | high — sanitize user input |
| `insertAdjacentHTML(where, html)` | yes | high |

```js
el.textContent = 'Safe text';
el.innerHTML = '<strong>Bold</strong>'; // only trusted HTML
el.insertAdjacentHTML('beforeend', '<li>Item</li>');
```

#### Removing & cloning

```js
node.remove();              // remove from DOM
node.cloneNode(true);       // deep clone (with children)
```

**Moving nodes:** appending an existing node **moves** it (doesn't copy).

#### Legacy methods (old code)

`appendChild`, `removeChild`, `insertBefore`, `replaceChild` — still work but prefer modern methods above.

#### Changing appearance

Prefer **CSS classes** over inline styles. Use JS only when CSS isn't enough.

```js
el.classList.add('active');
el.classList.toggle('hidden');
el.setAttribute('disabled', '');
el.style.color = 'red'; // last resort
```

**Attribute methods:** `hasAttribute`, `getAttribute`, `setAttribute`, `removeAttribute`.

</details>

<details>
  <summary>innerText vs textContent, forms, dialogs</summary>

### innerText vs textContent

**Definition:** `textContent` and `innerText` read element text differently; forms expose live `.value`; `alert`/`confirm`/`prompt` are blocking modal dialogs.

**How it works:**

- `textContent` returns all text nodes including hidden; `innerText` layout-aware (visible text only, triggers reflow).
- Form controls use `.value` property (live state), not `innerHTML`.
- `requestSubmit()` fires submit event and runs validation; `submit()` does not.

| | `textContent` | `innerText` |
|---|---------------|-------------|
| **Returns** | All text (incl. hidden) | Visible text only |
| **Layout-aware** | no | yes (respects CSS) |
| **Performance** | faster | slower (triggers reflow) |
| **Use for** | reading/writing text | display text to user |

| Pros | Cons |
|------|------|
| `textContent` fast and predictable | `innerText` slower |
| `.value` correct for inputs | Blocking dialogs freeze UI |
| `requestSubmit()` proper validation | `alert` not stylable |

**Cases:** Set label text → `textContent`; read displayed text → `innerText`; read input → `.value`; confirm delete → `confirm` or custom modal.

**Example:**

<details>
  <summary>Code</summary>

```js
el.textContent = 'Hello'; // preferred for setting text
```

</details>

### Forms

Use `.value` for inputs — **not** `innerHTML` (especially `<textarea>`).

```js
input.value;       // current value
textarea.value;    // not textarea.innerHTML
form.requestSubmit(); // triggers validation
```

### Dialog popups

| Method | Returns |
|--------|---------|
| `alert(msg)` | `undefined` |
| `confirm(msg)` | `true` / `false` |
| `prompt(msg, default)` | string or `null` |

**Common pitfalls:** `textarea.innerHTML` vs `textarea.value`; using `innerText` in hot loops; `confirm` in async code blocks main thread.

**Source:** [javascript.info/forms-controls](https://learn.javascript.ru/forms-controls)

</details>

<details>
  <summary>MutationObserver</summary>

### MutationObserver

**Definition:** Built-in API to watch DOM changes and react via callback.

**How it works:**

- Observer callback receives batch of `MutationRecord`s after DOM changes in microtask.
- `observe(target, { childList, attributes, subtree, characterData })` filters what to watch.
- `disconnect()` stops observation; `takeRecords()` flushes pending.

| Pros | Cons |
|------|------|
| React to third-party DOM changes | Can fire very frequently |
| Async batched — not synchronous | Narrow options or performance suffers |
| No polling needed | Not for size changes — use ResizeObserver |

**Cases:** Widget injected by ad script; contenteditable sync; attribute changes on custom element.

**Common pitfalls:** Observing entire `document.body` with `subtree: true`; infinite loop if callback mutates observed subtree; forgetting `disconnect`.

**Watches:** child nodes added/removed, attribute changes, text content changes.

**Example:**

<details>
  <summary>Code</summary>

```js
const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    console.log(m.type, m.target);
  }
});

observer.observe(document.querySelector('#app'), {
  childList: true,
  attributes: true,
  subtree: true,
});

observer.disconnect(); // cleanup when done
```

</details>

**When to use:** third-party scripts modifying DOM, lazy-loaded content, Web Components.

#### MutationObserver vs ResizeObserver

| | MutationObserver | ResizeObserver |
|---|------------------|----------------|
| **Watches** | DOM tree changes (nodes, attrs, text) | Element size changes |
| **When to use** | Dynamic content injection, third-party widgets | Responsive components, charts |
| **Performance** | Can fire often — narrow `subtree`/`attributes` | Fires on layout changes only |

See also [IntersectionObserver and ResizeObserver](#intersection-resize-observer).

**Source:** [javascript.info/mutation-observer](https://learn.javascript.ru/mutation-observer)

</details>

<details>
  <summary>form vs modal</summary>

### Form vs modal

**Definition:** Forms collect and submit structured data; modals interrupt the user flow for focused actions or confirmations.

**How it works:**

- Forms use native controls + validation API; submit navigates or is intercepted with `preventDefault` + fetch.
- Modals trap focus, block background interaction; native `<dialog>.showModal()` or custom overlay pattern.

| | Form | Modal |
|---|------|-------|
| **Purpose** | Collect & submit data | Interrupt workflow for action/info |
| **Use for** | Registration, checkout, search | Confirmations, errors, quick input |
| **UX** | Part of page flow | Blocks page until dismissed |

| Pros | Cons |
|------|------|
| Semantic HTML, accessible | Modals overused hurt UX |
| Native validation | Custom modals need a11y work |
| Fits multi-field workflows | Forms heavy for single yes/no |

**Cases:** Checkout → form; delete confirm → modal or `confirm`; search bar → inline form.

**Example:**

<details>
  <summary>Code</summary>

```js
// Form submit via fetch
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await fetch('/api/signup', { method: 'POST', body: new FormData(form) });
});

// Native dialog
const dlg = document.querySelector('dialog');
dlg.showModal();
dlg.close('confirmed');
```

</details>

**Common pitfalls:** Modal without focus trap; nested `<form>` invalid; form in modal without proper `aria-modal`.

**Source:** [form vs modal](https://thecontentauthority.com/blog/form-vs-modal)

</details>

	

<details>
  <summary>Media queries in JavaScript</summary>

### Media queries in JavaScript

**Definition:** Use `window.matchMedia()` to check CSS media queries in JS and react when viewport or user preferences change.

**How it works:**

- `matchMedia('(max-width: 768px)')` returns `MediaQueryList` with `matches` boolean.
- `change` event fires when query result flips (resize, orientation, `prefers-color-scheme`).

| Pros | Cons |
|------|------|
| Same queries as CSS | JS listeners add overhead vs pure CSS |
| `prefers-reduced-motion` etc. | Duplicate logic CSS + JS if not careful |
| No polling window size | `matchMedia` not supported in very old IE |

**Cases:** Toggle mobile nav in JS; respect `prefers-reduced-motion` for animations; dark mode sync.

**Example:**

<details>
  <summary>Code</summary>

```js
const mq = window.matchMedia('(max-width: 768px)');

if (mq.matches) {
  enableMobileLayout();
}

mq.addEventListener('change', (e) => {
  console.log('Viewport changed:', e.matches);
});
```

</details>

**Common pitfalls:** Listening `resize` instead of `matchMedia.change`; hardcoding breakpoints different from CSS; not removing listener.

**When to use:** conditional logic based on viewport, dark mode, reduced motion.

</details>

---

<a name="browser-apis--ui-patterns"></a>

## Browser APIs & UI patterns

<details>
  <summary>FormData, File API, FileReader Api</summary>

### FormData, File API, FileReader

**Definition:** APIs for reading user files and sending form data to a server. Disk paths, attributes, and OS file APIs live in [Files & file systems](./8_nodejs.md#files--file-systems) — the browser only sees a `File` the user picked, not the host tree.

**How it works:**

- `FormData` wraps form fields or manual append; multipart body for `fetch`.
- File input `files` is `FileList`; drag-drop `dataTransfer.files`.
- `FileReader` async reads file as text, data URL, or ArrayBuffer via events.

| Pros | Cons |
|------|------|
| `FormData` easy uploads | Large files block if read fully to memory |
| `FileReader` flexible formats | Event-based API verbose |
| Works with fetch/XHR | No built-in progress on fetch (XHR has progress) |

**Cases:** Avatar upload; CSV import; drag-drop text file preview.

**Common pitfalls:** Forgetting `enctype` not needed with fetch FormData; reading huge file with `readAsDataURL`; not revoking object URLs.

#### FormData

Collects key/value pairs from a form (including files) for `fetch` or `XHR`.

**Example:**

<details>
  <summary>Code</summary>

```js
const form = document.querySelector('form');
const data = new FormData(form);
// or manually:
data.append('avatar', fileInput.files[0]);

await fetch('/upload', { method: 'POST', body: data });
```

</details>

#### File input

```js
input.addEventListener('change', (e) => {
  const file = e.target.files[0];
  console.log(file.name, file.size, file.type);
});
```

#### FileReader

Reads file contents asynchronously. Events: `load`, `error`, `progress`.

```js
const reader = new FileReader();
reader.onload = (e) => console.log(e.target.result);
reader.readAsText(file);       // text
reader.readAsDataURL(file);    // base64
reader.readAsArrayBuffer(file); // binary
```

**Source:** [javascripttutorial FormData](https://www.javascripttutorial.net/web-apis/javascript-formdata/) · [MDN FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)

</details>

<details>
  <summary>URL: createObjectURL()</summary>

### URL.createObjectURL()

**Definition:** Creates a temporary blob URL for a `File` or `Blob` — useful for previewing uploads. Parsing `https://` URLs: [URL / URLSearchParams](#url--urlsearchparams).

**Example:**

<details>
  <summary>Code</summary>

```js
const file = input.files[0];
const url = URL.createObjectURL(file);
img.src = url;

// cleanup when done
URL.revokeObjectURL(url);
```

</details>

**How it works:**

- `URL.createObjectURL(blob)` creates `blob:` URL referencing in-memory blob until revoked.
- Document owns URLs — revoke when done to free memory.

| Pros | Cons |
|------|------|
| Instant preview of uploads | Memory leak if not revoked |
| No base64 overhead | URL invalid after revoke |
| Works with video/audio src | Blob URLs not persistent across sessions |

**Cases:** Image preview before upload; download link for generated PDF blob.

**Common pitfalls:** Never calling `revokeObjectURL`; storing blob URL in localStorage; using after blob garbage collected without revoke semantics understood.

**Note:** URL lifetime is tied to the document — revoke when no longer needed.

**Source:** [MDN createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)

</details>

<details>
  <summary>Web components</summary>

### Web Components

**Definition:** Browser-native APIs for creating reusable, encapsulated custom HTML elements.

**How it works:**

- `customElements.define('my-el', Class)` registers custom tag; `connectedCallback` when inserted.
- `attachShadow({ mode: 'open' })` creates encapsulated DOM; styles scoped inside shadow root.
- `<template>` holds inert markup cloned into shadow root.

| Pros | Cons |
|------|------|
| Native encapsulation | Framework ecosystem still dominant |
| Reusable across stacks | SSR/styling tooling more complex |
| Standard in modern browsers | Closed shadow harder to debug |

**Cases:** Design system primitives; embeddable widget; cross-framework component.

**Common pitfalls:** Expecting global CSS to pierce shadow (need `::part` or CSS variables); forgetting `customElements.define` once guard; form association with shadow inputs.

**Building blocks:**

| API | Purpose |
|-----|---------|
| Custom Elements | Define new tags (`<my-button>`) |
| Shadow DOM | Encapsulated DOM & styles |
| HTML Templates | `<template>` for inert markup |
| ES Modules | `import` in `<script type="module">` |

**Example:**

<details>
  <summary>Code</summary>

```js
class MyButton extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<button><slot></slot></button>`;
  }
}
customElements.define('my-button', MyButton);
```

</details>

**When to use:** design systems, embeddable widgets, framework-agnostic components.

**Source:** [MDN Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)

</details>

<details>
  <summary>Debouncing  throttling</summary>

### Debounce vs throttle

**Definition:** **Debounce** delays execution until events pause; **throttle** limits execution to at most once per time window.

**How it works:**

- Debounce: reset timer on each event; run fn once after quiet period.
- Throttle: run at most once per window; ignore or queue intermediate calls.
- Both wrap original function and return new function.

| | Debounce | Throttle |
|---|----------|----------|
| **Runs** | After pause in events | At most once per interval |
| **Use for** | Search input, resize end | Scroll, mousemove, rAF alternatives |
| **Risk** | Feels sluggish if delay too long | May miss final state |

| Pros | Cons |
|------|------|
| Debounce reduces API calls | Debounce feels laggy if delay too high |
| Throttle smooth scroll handlers | Throttle may skip final position |
| Essential for resize/scroll | Wrong choice for use case |

**Cases:** Search input → debounce; scroll position → throttle; resize layout → debounce end.

**Example:**

<details>
  <summary>Code</summary>

```js
function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function throttle(fn, ms) {
  let blocked = false;
  return (...args) => {
    if (blocked) return;
    fn(...args);
    blocked = true;
    setTimeout(() => { blocked = false; }, ms);
  };
}

window.addEventListener('resize', debounce(onResize, 300));
window.addEventListener('scroll', throttle(onScroll, 100));
```

</details>

**Common pitfalls:** Debounce on button click (may never fire if continuous); not cancelling debounce on unmount; throttle leading vs trailing edge confusion.

**Source:** [yeahub debounce/throttle](https://yeahub.ru/questions/382?page=5&status=all&specialization=11&skills=6)

</details>

<a name="request-animation-frame"></a>

<details>
  <summary>requestAnimationFrame</summary>

### requestAnimationFrame

**Definition:** Schedules a callback before the next browser repaint (~60fps). Paused when tab is hidden.

**How it works:**

- Browser calls callback before next repaint (~60Hz); chained calls create animation loop.
- Paused when tab hidden; synced with display refresh unlike `setTimeout`/`setInterval`.
- Receives timestamp argument for delta time calculations.
- `setInterval(fn, 1000/60)` is not tied to paint: jank between frames, and after a hidden tab the timer may **catch up** (many callbacks at once).
- Pipeline / dirty layout → [1_html.md](./1_html.md#browser--rendering).

| Pros | Cons |
|------|------|
| Smooth animations | Still main-thread — heavy work janks |
| Auto-pauses in background | Not for non-visual delays |
| Better than `setInterval` for visuals | One frame budget ~16ms |

**Cases:** JS animations; measure layout before paint; game loop; scroll-linked effects.

**Common pitfalls:** Doing heavy logic inside rAF callback; using rAF for one-shot delay (use `queueMicrotask` or `setTimeout`); not cancelling loop on unmount.

**When to use:** Visual animations — always prefer over `setInterval`/`setTimeout`.

**Example:**

<details>
  <summary>Code</summary>

```js
function animate() {
  element.style.transform = `translateX(${position}px)`;
  position += 2;
  if (position < 500) requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

</details>

| | rAF | setTimeout |
|---|-----|------------|
| Sync with display | yes | no |
| Paused in background tab | yes | no |
| Use for | animations | delayed one-off tasks |

**Source:** [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

</details>

<a name="request-idle-callback"></a>

<details>
  <summary>requestIdleCallback</summary>

### requestIdleCallback

**Definition:** Schedules a callback for a browser **idle** period — leftover time in a frame after input, layout, and paint. Distinct from `requestAnimationFrame` (must run before paint) and from microtasks (run before the next macrotask and can delay paint).

**How it works:**

- Callback gets `IdleDeadline`: `timeRemaining()`, `didTimeout`.
- Optional `{ timeout }` forces a run if idle never comes.
- Cooperative: do a slice of work, return, schedule again.

| | rAF | requestIdleCallback | Microtasks |
|---|-----|---------------------|------------|
| When | Before paint | When idle (or timeout) | After sync, before next macro |
| Use | Animations | Analytics, prefetch | Promise reactions |

**Cases:** Non-urgent work. Do **not** use for drag/scroll animation.

**Key idea:** *rAF = this frame’s pixels; idle = leftover time; microtask storms never leave leftover time.*

**Source:** [MDN requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)

</details>

---

<details>
  <summary>Element and window dimensions & scroll</summary>

### Element and window dimensions & scroll

**Definition:** DOM elements expose `offsetWidth`, `clientWidth`, `scrollWidth`, etc.; the window has `innerHeight`, `scrollY`.

**How it works:**

- `offset*` includes border; `client*` content + padding, no border/scrollbar; `scroll*` full scrollable size.
- `getBoundingClientRect()` viewport-relative box; add `scrollY` for document coords.
- `scrollIntoView()` scrolls ancestors to reveal element.

| Pros | Cons |
|------|------|
| `getBoundingClientRect` precise | Forces layout if called in loop |
| Many properties for different needs | Easy to confuse offset vs client |
| `scrollIntoView` built-in | Smooth scroll not instant for tests |

**Cases:** Sticky header offset; infinite scroll near bottom; tooltip positioning.

**Common pitfalls:** Reading layout in write loop (thrashing); `offsetHeight` includes border, `clientHeight` not; rect changes on scroll without re-read.

| Property family | Includes border | Includes scrollbar | Content only |
|-----------------|-----------------|--------------------|--------------|
| `offset*` | yes | no | no |
| `client*` | no | no | no |
| `scroll*` | — | — | full scrollable area |

**When to use:** Layout calculations, infinite scroll, sticky headers, scroll-to-element.

**Example:**

<details>
  <summary>Code</summary>

```js
const el = document.querySelector('.panel');
const rect = el.getBoundingClientRect();
const belowFold = rect.top > window.innerHeight;

el.scrollIntoView({ behavior: 'smooth', block: 'start' });
```

</details>

#### scrollIntoView()

Scrolls the element into the visible area of the browser window.

```js
document.querySelector('#section-3').scrollIntoView({
  behavior: 'smooth',
  block: 'start',   // 'start' | 'center' | 'end' | 'nearest'
  inline: 'nearest',
});
```

**When to use:** anchor navigation, "scroll to error", highlighting search results.

**Notes:** `getBoundingClientRect()` is relative to viewport; add `scrollY` for document coordinates.

**Source:** [javascript.info/size-and-scroll](https://learn.javascript.ru/size-and-scroll)

---

</details>

<details>
  <summary>Coordinates</summary>

### Coordinates

**Definition:** Element position can be read via `getBoundingClientRect()` (viewport-relative) or computed from `offsetTop` chain (document-relative).

**How it works:**

- Mouse events: `clientX/Y` viewport; `pageX/Y` = client + scroll offset.
- `getBoundingClientRect()` gives element box vs viewport.
- Drag math often converts between coordinate systems.

| Pros | Cons |
|------|------|
| Standard event coordinates | Touch has multiple touches |
| `getBoundingClientRect` for element hits | Zoom/transform affect rect |
| `pageX` includes scroll | Legacy IE differences mostly gone |

**Cases:** Drag-drop; canvas hit testing; tooltip at cursor.

**Common pitfalls:** Using client coords for document-positioned elements without scroll; ignoring `transform` on parent; touch `touches[0]` vs `changedTouches`.

| Method | Coordinate system |
|--------|-------------------|
| `getBoundingClientRect()` | Viewport (changes on scroll) |
| `clientX` / `clientY` (events) | Viewport |
| `pageX` / `pageY` | Document (includes scroll) |

**When to use:** Drag-and-drop, tooltips, click targets on canvas/SVG.

**Example:**

<details>
  <summary>Code</summary>

```js
document.addEventListener('click', (e) => {
  console.log('viewport:', e.clientX, e.clientY);
  console.log('document:', e.pageX, e.pageY);
});
```

</details>

**Source:** [javascript.info/coordinates](https://learn.javascript.ru/coordinates)

---

</details>

<details>
  <summary>Selection and Range API</summary>

### Selection and Range API

**Definition:** `Selection` represents user text selection; `Range` is a DOM fragment between two boundary points.

**How it works:**

- `window.getSelection()` returns user selection; `Range` defines start/end containers and offsets.
- `range.selectNodeContents(el)` selects all children; `addRange` applies to selection.

| Pros | Cons |
|------|------|
| Rich text editor building block | Cross-browser quirks in edge cases |
| Programmatic copy/highlight | Complex nested text nodes |
| Inspect user selection | Mobile selection API limited |

**Cases:** Editor toolbar bold; copy custom format; highlight search matches.

**Common pitfalls:** Selection cleared on DOM mutation; conflating selection with input `selectionStart`; not collapsing range after use.

| Pros | Cons |
|------|------|
| Rich text editor support | Browser inconsistencies in edge cases |
| Programmatic selection | Complex API surface |

**When to use:** WYSIWYG editors, copy/custom highlight, find-in-page.

**Example:**

<details>
  <summary>Code</summary>

```js
const selection = window.getSelection();
const range = document.createRange();
range.selectNodeContents(document.querySelector('article'));
selection.removeAllRanges();
selection.addRange(range);
```

</details>

**Source:** [javascript.info/selection-range](https://learn.javascript.ru/selection-range)

---

</details>

<a name="cross-tab-communication"></a>

<details>
  <summary>Cross-tab & cross-window communication</summary>

### Cross-tab & cross-window communication

**Definition:** Tabs/windows exchange data through several APIs. Pick by **origin**, **1:1 vs broadcast**, and **message vs shared state**.

**Sequence** (decide → send → receive):

```
1. Origin    same-origin? BroadcastChannel / storage / opener
             cross-origin? postMessage only — never otherWindow.document
2. Send      postMessage / channel.postMessage / localStorage.setItem
3. Receive   message | storage — check event.origin; storage skips the writer
```

Same-origin = protocol + host + port. `sessionStorage` is **per tab** (shared with same-origin iframes), not a cross-tab bus.

| Method | Same-origin only | Cross-origin | Pattern | Best for |
|--------|------------------|--------------|---------|----------|
| `window.postMessage` | no | yes | point-to-point | iframes, OAuth popups, micro-frontends |
| `BroadcastChannel` | yes | no | pub/sub (all tabs) | same-app tab sync, logout broadcast |
| `localStorage` + `storage` event | yes | no | write in one tab, notify others | simple shared flags / last-write-wins state |
| `window.opener` / `window.open` ref | yes | no* | parent ↔ popup | same-origin popup workflows |
| `SharedWorker` | yes | no | shared background thread | shared socket, shared cache logic |
| Service Worker + `clients` | yes | no | SW → all controlled tabs | PWA push, background sync |

\*Cross-origin popups still use `postMessage`; direct `opener` property access is blocked.

**How it works:** SOP blocks direct JS across origins. `postMessage` delivers a `MessageEvent`; the receiver **must** check `event.origin`. The `storage` event fires on **other** documents that share that storage area — not on the writer.

**Cases:** Logout all tabs; OAuth popup; theme sync; iframe widgets.

| + | − |
| --- | --- |
| Right API per constraint | Easy to treat `localStorage` as a bus |
| `postMessage` is the cross-origin path | Must validate `event.origin` |

**Example — `postMessage`:**

```js
parent.postMessage({ type: 'READY' }, 'https://parent.example.com');

window.addEventListener('message', (e) => {
  if (e.origin !== 'https://child.example.com') return;
  console.log(e.data);
});
```

**Example — `BroadcastChannel`:**

```js
const channel = new BroadcastChannel('app-events');
channel.postMessage({ type: 'LOGOUT' });
channel.onmessage = (e) => { if (e.data.type === 'LOGOUT') redirectToLogin(); };
channel.close();
```

**Other APIs:**

- **`localStorage` + `storage`:** `setItem` in A; `storage` in B/C (`e.key`, `e.newValue`). Strings only; races — not a message bus.
- **`window.open` / `opener`:** same origin may call `opener.fn()`; otherwise `opener.postMessage`.
- **`SharedWorker`:** each tab `new SharedWorker(url)` + `port`; worker `onconnect` fans out. Same origin; weaker support than `BroadcastChannel`.
- **Service Worker:** `clients.matchAll({ type: 'window' })` then `client.postMessage`. PWA fan-out.

```
Cross-origin?                         → postMessage
Same origin, fire-and-forget?         → BroadcastChannel
Persist + notify?                     → localStorage + storage
Popup result?                         → opener or postMessage (safer default)
Shared background work?               → SharedWorker
PWA fan-out?                          → Service Worker clients
```

**Common pitfalls:** Skipping `event.origin`; expecting `storage` in the writing tab; using `sessionStorage` for cross-tab sync.

**Key idea:** Cross-origin → `postMessage` + origin check. Same-origin broadcast → `BroadcastChannel`.

**Source:** [MDN postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) · [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) · [storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)

### Clickjacking

**Definition:** Attacker embeds your site in a hidden iframe and tricks the user into clicking your UI under a deceptive overlay.

**Defense:** `X-Frame-Options: DENY` or CSP `frame-ancestors 'none'` (or allowlist trusted parents only).

**Source:** [javascript.info/cross-window-communication](https://learn.javascript.ru/cross-window-communication) · [MDN BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) · [MDN storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)

---

</details>

<details>
  <summary>Custom events</summary>

### Custom events

**Definition:** `CustomEvent` lets you dispatch application-specific events through the DOM event system with optional `detail` payload.

**How it works:**

- `new CustomEvent('name', { detail, bubbles, cancelable })` then `dispatchEvent` on element.
- Listeners same as native events; `detail` carries payload.

| Pros | Cons |
|------|------|
| Decoupled pub/sub on DOM tree | Hard to trace vs explicit callbacks |
| Bubbles like native events | Overuse creates spaghetti |
| Works with Web Components | Not a state management solution |

**Cases:** Widget signals parent; micro-frontend integration; legacy plugin hooks.

**Common pitfalls:** Typo in event name; forgetting `bubbles: true` for parent listeners; huge objects in `detail` causing retention.

| Pros | Cons |
|------|------|
| Decoupled components | Overuse creates hard-to-trace flows |
| Same bubbling/capture as native events | Not a replacement for state management |

**When to use:** Micro-frontends, Web Components communication, legacy widget integration.

**Example:**

<details>
  <summary>Code</summary>

```js
const el = document.querySelector('#app');

el.addEventListener('user:login', (e) => {
  console.log('User logged in:', e.detail.userId);
});

el.dispatchEvent(
  new CustomEvent('user:login', {
    bubbles: true,
    detail: { userId: 42 },
  })
);
```

</details>

**Source:** [MDN CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)

</details>

<a name="browser-storage"></a>

<details>
  <summary>Browser storage (cookies, Web Storage, IndexedDB, localForage)</summary>

### Browser storage

**Definition:** Client-side persistence APIs with different size, lifetime, sync vs async, and whether data is sent to the server — pick the smallest tool that fits.

**How it works:**

- **Cookies** — HTTP, not a general store. Server sets `Set-Cookie`; browser sends a `Cookie` header on later requests. Default is a **session cookie** (no `Max-Age`/`Expires` → gone when the browser session ends). ~4 KB per cookie; values must be encoded so they do not break the request. Awkward `document.cookie` string → libraries are common. Tracking cookies vs privacy: browsers restrict this; prefer Web Storage / IndexedDB for client-only data.
- **Web Storage** — `localStorage` and `sessionStorage`: same sync string KV API, different lifetime. `sessionStorage` is per tab and dies when the tab closes. `localStorage` is origin-scoped and *intended* to last until cleared, but browsers still evict. MDN: **5 MiB local + 5 MiB session** per origin; over quota → `QuotaExceededError` (`try/catch`). Writes block the main thread — avoid frequent/large writes. Any same-origin script (including a malicious extension) can read it — **not for tokens**. Private/incognito: `localStorage` behaves like session storage and is wiped when the private session ends. Third-party iframes may be denied storage if third-party cookies are off.
- **IndexedDB** — async transactional object DB (also in workers). Stores structured-cloneable values (objects, blobs), indexes, much larger quotas (disk-based, browser-specific). Same-origin. Overkill for a theme flag; right for offline caches, drafts, large datasets. Raw API is event/`IDBRequest`-heavy — wrappers are common.
- **localForage** — `localStorage`-like API that is **async**. Default driver: IndexedDB (WebSQL as a legacy option); falls back to `localStorage`. Can store JS objects/blobs; JSON stringify/parse is automatic on the localStorage backend.

| | Cookies | sessionStorage | localStorage | IndexedDB |
|---|---------|----------------|--------------|-----------|
| Lifetime | `Expires` / `Max-Age` / session | tab | until clear / eviction | until clear / eviction |
| Scope | domain + path | origin + tab | origin (all tabs) | origin |
| Sent to server | yes (every matching request) | no | no | no |
| Capacity | ~4 KB / cookie | ~5 MiB | ~5 MiB | large (quota) |
| API | HTTP + `document.cookie` | sync string KV | sync string KV | async transactions |

Safari / WebKit ITP (when tracking prevention is on): **script-writable** data (JS cookies, Web Storage, IndexedDB, SW cache, …) can be deleted if the origin had **no user interaction** (click/tap) in the last **7 days of browser use**. Server-set cookies are exempt from that proactive eviction. Home-screen web apps skip the 7-day cap.

**Cases:** Auth session the **server** must see → `HttpOnly` + `Secure` + `SameSite` cookie. Theme / locale / small UI prefs → `localStorage`. Wizard / tab-only draft → `sessionStorage`. Offline notes, files, queryable lists → IndexedDB (or localForage). Client-only data → never cookies (they bloat every request).

| Pros | Cons |
|------|------|
| Cookies: server round-trip, `HttpOnly` for XSS | Size; sent every request; clumsy JS API |
| Web Storage: tiny API | Sync; strings; XSS-readable; ~5 MiB |
| IndexedDB: async, structured, large | Verbose API |
| localForage: one API, driver fallback | Extra dependency |

**Example:**

<details>
  <summary>Code</summary>

```js
try {
  localStorage.setItem('user', JSON.stringify({ id: 1 }));
  const user = JSON.parse(localStorage.getItem('user') ?? 'null');
  sessionStorage.setItem('draft', formText);
} catch (e) {
  // QuotaExceededError, disabled storage, or private-mode quirks
}

document.cookie = 'pref=dark; Path=/; Max-Age=31536000; SameSite=Lax';

const req = indexedDB.open('notes', 1);
req.onupgradeneeded = (e) => {
  e.target.result.createObjectStore('notes', { autoIncrement: true });
};
req.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction('notes', 'readwrite');
  tx.objectStore('notes').add({ text: 'read storage notes', ts: Date.now() });
};

await localforage.setItem('user', { id: 1 });
const fromForage = await localforage.getItem('user');
```

</details>

**Common pitfalls:** JWT / tokens in Web Storage (XSS, extensions). Assuming overflow *wipes* Web Storage — it **throws**, it does not auto-clear. Cookie table “sent unless HttpOnly” is wrong: HttpOnly is still sent to the server, just not readable from JS. `storage` event does not fire in the writing tab. Safari 7-day rule is **no interaction**, not “did not call `getItem`”. Do not treat localStorage as durable forever.

**Key idea:** Cookies for what the **server** needs on the next request; Web Storage for small client prefs; IndexedDB (or localForage) for large/async data.

**Source:** [MDN — Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) · [MDN — quotas & eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) · [MDN — cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies) · [MDN — IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) · [localForage](https://github.com/localForage/localForage)

</details>

<a name="cors-same-origin"></a>

<details>
  <summary>CORS and same-origin policy</summary>

### CORS and same-origin policy

**Definition:** **Same-origin policy** stops a document from reading another origin’s DOM, storage, and (by default) HTTP responses. **CORS** is the HTTP opt-in so `fetch`/`XHR` can read a cross-origin response.

**How it works:** SOP also covers iframes and `document` access — not only APIs. Headers, preflight, credentials, `*`, and `Vary: Origin` live in [Web API — CORS](./6_web_api.md#cors).

**Cases:** Cross-origin `fetch` from a page; module scripts / fonts that need CORS; same-origin calls need no CORS headers.

| Pros | Cons |
|------|------|
| Isolates tabs/iframes by origin | Easy to confuse SOP (DOM) with CORS (HTTP read) |

**Example:** see [Web API — CORS](./6_web_api.md#cors).

**Key idea:** SOP is the default isolate; CORS is server headers that let **page JS** read a response — not a server firewall.

**Source:** [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

</details>

<a name="intersection-resize-observer"></a>

<details>
  <summary>IntersectionObserver and ResizeObserver</summary>

### IntersectionObserver and ResizeObserver

**Definition:** `IntersectionObserver` detects when an element enters/leaves viewport (or root); `ResizeObserver` reports element content-box size changes.

**How it works:**

- **IntersectionObserver** — callback when target visibility vs root (viewport or ancestor) crosses thresholds; async, batched, off main polling loop.
- **ResizeObserver** — callback when observed element's size changes; fires before paint (layout already computed).
- Both use `observe(el)` / `unobserve(el)` / `disconnect()`.

| | IntersectionObserver | ResizeObserver |
|---|---------------------|----------------|
| Watches | visibility / intersection ratio | width / height changes |
| Use for | lazy load, infinite scroll, ads viewability | responsive components, charts |
| Root | viewport or custom element | element itself |

| Pros | Cons |
|------|------|
| Better perf than scroll listeners | Callback timing async — not synchronous with DOM |
| Lazy loading standard pattern | ResizeObserver loop limit errors if callback mutates layout |
| Fine-grained thresholds | Older browsers need polyfill for IO |

**Cases:** Lazy-load images (`data-src` when intersecting); sticky analytics "50% visible"; textarea auto-grow; canvas resize.

**Example:**

<details>
  <summary>Code</summary>

```js
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.src = e.target.dataset.src;
      io.unobserve(e.target);
    }
  }
}, { rootMargin: '100px' });
document.querySelectorAll('img[data-src]').forEach((img) => io.observe(img));

const ro = new ResizeObserver((entries) => {
  for (const { contentRect, target } of entries) {
    target.style.setProperty('--w', `${contentRect.width}px`);
  }
});
ro.observe(document.querySelector('.panel'));
```

</details>

**Common pitfalls:** Not `unobserve` after lazy load; ResizeObserver callback changing size infinitely; expecting IO during `display:none` (no intersection).

**Source:** [MDN IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) · [MDN ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)

</details>

<a name="history-api"></a>

<details>
  <summary>History API and navigation</summary>

### History API and navigation

**Definition:** `history` object manages session history stack for SPA routing without full page reloads via `pushState` / `replaceState` and `popstate` event.

**How it works:**

- `history.pushState(state, '', url)` — adds entry; URL bar updates; no navigation request.
- `history.replaceState(state, '', url)` — replaces current entry.
- `popstate` fires on back/forward (and `history.back()`); `event.state` is the state object (or null).
- `history.length`, `back()`, `forward()`, `go(n)` navigate the stack.
- Full navigation: `location.assign(href)`, `location.href = url`, or `<a>` click — loads new document.

| Pros | Cons |
|------|------|
| SPA URLs without reload | Must sync app state with history manually |
| State object for restore | `state` structured-clone limits (no DOM nodes) |
| Works with router libs (React Router) | User expects back button to undo app state |

**Cases:** SPA route change; wizard steps; modal deep-link; replaceState to strip temp query params.

**Example:**

<details>
  <summary>Code</summary>

```js
function navigate(path) {
  history.pushState({ route: path }, '', path);
  renderRoute(path);
}

window.addEventListener('popstate', (e) => {
  renderRoute(e.state?.route ?? location.pathname);
});

// initial load
renderRoute(location.pathname);
```

</details>

**Common pitfalls:** Forgetting `popstate` listener — back button breaks; pushing same URL duplicates stack; state too large; confusing `hashchange` (`#/page`) with History API.

**Source:** [javascript.info/modifying-document](https://learn.javascript.ru/modifying-document) · [MDN History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)

</details>

<a name="url--urlsearchparams"></a>

<details>
  <summary>URL and URLSearchParams</summary>

### URL and URLSearchParams

**Definition:** `URL` parses/builds a full address; `URLSearchParams` reads and writes the query string (`application/x-www-form-urlencoded`: space → `+`). URL *shape* (scheme, host, fragment): [URI, URL & URN](./6_web_api.md#uri-url--urn). Blob URLs: [createObjectURL](#url-createobjecturl).

**How it works:**

- `new URL(url, base)` — `base` resolves relative `url` (MDN).
- Useful fields: `protocol`, `hostname`, `port` (empty if default), `pathname`, `search`, `searchParams`, `hash`, `href`, `origin` (scheme + host + non-default port).
- `searchParams.get` / `getAll` / `set` / `append` / `delete` / `toString()` (no leading `?`). Duplicate keys are allowed; `append` adds, `set` replaces.
- Do not split `?`/`&` by hand — encoding breaks (`привет`, `+` vs space).

**Cases:** Build search links; read `location.search`; Node/Next `new URL(request.url)`.

**Example:**

<details>
  <summary>Code</summary>

```js
const url = new URL('/search', 'https://doka.guide');
url.searchParams.set('query', 'привет');
url.searchParams.append('category', 'html');
url.searchParams.append('category', 'js');
url.hash = 'results';
url.href;
// https://doka.guide/search?query=%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82&category=html&category=js#results

url.searchParams.getAll('category'); // ['html', 'js']
```

</details>

**Common pitfalls:** `toString()` omits `?`; constructing `URLSearchParams` from a raw interpolated string can mishandle `+`; `username`/`password` exist on `URL` but putting credentials in a href is deprecated.

**Key idea:** Parse with `URL`; mutate query with `searchParams`, never with string concat.

**Source:** [MDN — URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) · [MDN — URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

</details>

<details>
  <summary>Related</summary>

### Related

* HTTP, Fetch, storage → [6_web_api.md](./6_web_api.md)
* HTML rendering pipeline → [1_html.md](./1_html.md)

---

</details>

</details>

<a name="interview-practice"></a>

<details>
  <summary>Interview Practice</summary>

### Interview Practice

Questions from [0_interview.md](0_interview.md). Try answering before opening solutions.

### Question index

| Topic | Answer |
|-------|--------|
| DOM vs BOM | Q&A |
| Event bubbling/capturing | Q&A |
| localStorage vs sessionStorage vs cookies | Q&A |
| CORS / same-origin | Q&A |
| `requestAnimationFrame` | Q&A |
| `requestIdleCallback` | Q&A |
| Cross-tab communication | Q&A |
| IntersectionObserver / ResizeObserver | theory |
| History API | theory |

---

## Questions & Answers

<details>
  <summary>DOM vs BOM?</summary>

### DOM vs BOM?

**Definition:** **DOM** models document content (nodes, elements); **BOM** models browser chrome/environment around the page (`window`, `location`, `history`, `navigator`).

| | DOM | BOM |
|---|-----|-----|
| Scope | HTML document tree | Browser window & APIs |
| Entry | `document` | `window` |
| Examples | `querySelector`, `createElement` | `location`, `alert`, `setTimeout` |
| Spec | DOM standard | HTML / browser specs |

**How it works:** `window` is the global object; `document` is a property of `window`. DOM operations mutate/read page structure; BOM controls navigation, dialogs, viewport, timers.

**Cases:** DOM for UI updates; BOM for redirects, opening windows, reading URL, history navigation.

See full table in [DOM vs BOM](#dom-vs-bom) under **DOM, BOM & events**.

**Source:** [javascript.info/browser-environment](https://learn.javascript.ru/browser-environment)

</details>

<details>
  <summary>Event bubbling and delegation?</summary>

### Event bubbling and delegation?

**Definition:** **Bubbling** — event propagates from target up to `window`. **Delegation** — one listener on ancestor handles events from descendants via `event.target`.

**How it works:**

1. Capture phase (optional): window → target.
2. Target phase: handlers on target.
3. Bubble phase (default): target → window.
4. Delegation: parent listens on bubble; checks `e.target.matches(selector)`.

**Cases:** Dynamic list items — one `ul` listener; stopping propagation when overlay handles click; capture for early intercept.

**Example:**

<details>
  <summary>Code</summary>

```js
list.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li || !list.contains(li)) return;
  console.log(li.textContent);
});
```

</details>

See [Event phases](#event-phases) and [Event delegation](#event-delegation).

**Common pitfalls:** `target` may be child inside `li` (use `closest`); `stopPropagation` breaks delegation above; assuming delegate on capture without `{ capture: true }`.

**Source:** [javascript.info/event-delegation](https://learn.javascript.ru/event-delegation)

</details>

<details>
  <summary>localStorage vs sessionStorage vs cookies?</summary>

### localStorage vs sessionStorage vs cookies?

**Definition:** Three client storage mechanisms with different lifetime, scope, and server visibility.

| | localStorage | sessionStorage | Cookies |
|---|--------------|----------------|---------|
| Lifetime | until explicit clear | until tab/window closed | `Expires` / session cookie |
| Shared across tabs | yes (same origin) | no (per tab) | yes (domain-scoped) |
| Sent with HTTP requests | no | no | yes (unless HttpOnly) |
| Typical capacity | ~5MB | ~5MB | ~4KB per cookie |
| API | `getItem`/`setItem` sync | same | `document.cookie` string |

**How it works:** Web Storage stores **strings** (`JSON.stringify` / `JSON.parse` — [JS Core — JSON](./3_js_core.md#json)). Cookies travel on HTTP; IndexedDB is async + objects. Full comparison, Safari 7-day ITP, quotas, localForage: [Browser storage](#browser-storage). HTTP flags: [HTTP cookies](./6_web_api.md#http-cookies).

**Cases:** Theme → localStorage; tab draft → sessionStorage; auth id → HttpOnly cookie; large/offline → IndexedDB.

**Example:**

<details>
  <summary>Code</summary>

```js
localStorage.setItem('theme', 'dark');
sessionStorage.setItem('step', '2');
// cookie set by server preferred: Set-Cookie: sid=...; HttpOnly; Secure; SameSite=Lax
```

</details>

**Common pitfalls:** JWT in localStorage; cookie size; sessionStorage not cross-tab; Safari script-storage eviction after 7 days without interaction.

**Source:** [javascript.info/localstorage](https://learn.javascript.ru/localstorage)

</details>

<details>
  <summary>What is CORS?</summary>

### What is CORS?

**Definition:** Cross-Origin Resource Sharing — browser mechanism allowing cross-origin HTTP responses to be read by JavaScript when the server sends appropriate `Access-Control-*` headers.

**How it works:**

- Same-origin policy blocks reading cross-origin response by default.
- Server adds `Access-Control-Allow-Origin` (specific origin or `*` for public APIs).
- Non-simple requests trigger **preflight** `OPTIONS`; server must allow method and headers.
- Credentialed requests need `credentials: 'include'` and cannot use `Allow-Origin: *`.

**Cases:** API on `api.example.com` consumed by `app.example.com`; public CDN with `*`; cookie auth requires explicit origin.

See [CORS and same-origin policy](#cors-same-origin) and [Web API — CORS](./6_web_api.md#cors).

**Common pitfalls:** CORS is browser-only — not server-side security boundary; misconfigured preflight; confusing with same-origin policy for iframes/DOM.

**Source:** [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

</details>

<details>
  <summary>How do tabs communicate? Same-origin rules?</summary>

### How do tabs communicate? Same-origin rules?

**Definition:** Tabs communicate via `postMessage`, `BroadcastChannel`, `localStorage` + `storage` event, `SharedWorker`, or Service Worker — gated by same-origin policy for most APIs.

**How it works:**

- **Same origin** = protocol + host + port match.
- Direct access (`otherWindow.document`) — same origin only.
- `postMessage` — cross-origin allowed; must validate `event.origin`.
- `BroadcastChannel` / `storage` / `SharedWorker` — same origin only.
- `sessionStorage` — not shared between tabs.

**Cases:** Logout broadcast → BroadcastChannel; theme sync → localStorage + storage; OAuth popup → postMessage.

See [Cross-tab & cross-window communication](#cross-tab-communication).

**Common pitfalls:** Skipping origin check on `message`; expecting sessionStorage cross-tab; race on concurrent localStorage writes.

**Source:** [javascript.info/cross-window-communication](https://learn.javascript.ru/cross-window-communication)

</details>

<details>
  <summary>requestAnimationFrame?</summary>

### requestAnimationFrame?

**Definition:** `requestAnimationFrame(callback)` schedules a function to run before the next browser repaint, typically ~60fps.

**How it works:**

- Browser batches visual updates; callback receives `DOMHighResTimeStamp`.
- Chain `requestAnimationFrame` inside callback for animation loop.
- Paused when tab hidden — saves CPU/battery.
- `cancelAnimationFrame(id)` stops scheduled frame.

| Pros | Cons |
|------|------|
| Synced to display refresh | Still runs on main thread |
| Better than setInterval for animation | Not for arbitrary delays |
| Auto-pauses in background | Heavy work still causes jank |

**Cases:** JS animations; measure-then-mutate layout; scroll-linked effects.

**Example:**

<details>
  <summary>Code</summary>

```js
let x = 0;
function tick(ts) {
  x += 2;
  box.style.transform = `translateX(${x}px)`;
  if (x < 300) requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
```

</details>

See [requestAnimationFrame](#request-animation-frame) in **Browser APIs & UI patterns**.

**Source:** [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

</details>

<details>
  <summary>requestIdleCallback?</summary>

### requestIdleCallback?

**Definition:** `requestIdleCallback(cb, { timeout })` runs `cb` when the browser is idle (or when `timeout` elapses). `IdleDeadline.timeRemaining()` estimates leftover milliseconds.

**How it works:** Not a microtask. rAF is for frames; idle is for leftover time. A microtask storm delays both paint and idle work.

**Key idea:** *Use idle for non-urgent work; never for animations.*

See [requestIdleCallback](#request-idle-callback) in theory (after rAF).

**Source:** [MDN requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)

</details>

---

### Tasks

### Task 1 — Event delegation

List of `<li>` items — one click handler on `<ul>`, alert clicked item text. See DOM exercise in this file.

### Task 2 — Debounced scroll

Attach scroll listener that logs only after user stops scrolling 200ms.

<details><summary>Solution</summary>

```js
let timer;
window.addEventListener('scroll', () => {
  clearTimeout(timer);
  timer = setTimeout(() => console.log('scroll ended'), 200);
});
```

</details>

### Task 3 — Storage wrapper

→ See [Local storage](#local-storage) exercise below.

---

<details>
  <summary>DOM</summary>

### DOM

https://jsfiddle.net/softnetix/r3u1cy0n/

```js
// DOM list exercise — page markup: [1_html.md](1_html.md)

const users = [
{
  id: 'njscmmaks',
  name: 'Petya',
},
{
  id: 'mnfdmnfdm',
  name: 'Vasya',
},
{
  id: 'lswlqdwa',
  name: 'Dima',
},
{
  id: 'jncvmdasd',
  name: 'Olga',
},
];

const list = document.getElementById('list');

users.forEach(({ name }) => {
const li = document.createElement('li');

li.innerText = name;

list.appendChild(li);
});

const handler = () => {
//solution
};

list.addEventListener('click', handler);

// solution

const handler = (event) => {
if (event.target.tagName === 'LI') {
  alert(`You clicked on: ${event.target.dataset.id}`);
}
};

// Add `id` as a `data-id` attribute when creating list items
users.forEach(({ id, name }) => {
const li = document.createElement('li');

li.innerText = name;
li.dataset.id = id; // Store the user ID in a data attribute

list.appendChild(li);
});

list.addEventListener('click', handler);

```

</details>

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

External test: https://chm.org.ua/ru/testy-po-programmirovaniiu/test-dom-bom-v-javascript/

</details>

<details>
  <summary>Junior — Front-end</summary>

### Junior — Front-end

42. What is the DOM? → [3_js_browser.md — DOM](3_js_browser.md#dom-bom-events)

45. Describe the event bubbling process in the DOM.

46. How do you stop event bubbling?

47. How do you prevent the default event action?

48. What is `this` in an event handler?

49. What are localStorage and sessionStorage? What is the max localStorage size?

50. How do you get an element's height and position relative to the document?

51. What is webpack?

52. How does a dev build differ from a production build?

</details>

<details>
  <summary>Middle — Front-end</summary>

### Middle — Front-end

44. What is the key difference between `mouseleave` and `mouseout`?

45. In what order are DOM events processed (click, mouseover, etc.)? FIFO or LIFO?

46. What are event bubbling and event capturing?

47. Compare `stopPropagation` and `stopImmediatePropagation`.

48. What approaches optimize web page performance?

49. How does the same-origin policy work? Which browser APIs does it affect?

50. Name browser storage mechanisms and compare them.

51. Web Workers — how is data passed between workers and the main thread, and between shared workers?

52. What are Transferable objects?

53. How do you optimize heavy JS work to improve page rendering performance?

54. Why does ResizeObserver fire before the element is painted, not after?

56. Describe how to read a `.txt` file dropped from the file system into the browser window.

57. What is the Virtual DOM?

</details>

<details>
  <summary>Front-end</summary>

### Front-end

11. How does the browser determine if tabs can communicate with each other? → [#cross-tab-communication](#cross-tab-communication)

13. How do you avoid loading cached script and style files? → [2_css.md — cache busting](2_css.md#interview-practice)

14. What is `requestAnimationFrame`? → [#request-animation-frame](#request-animation-frame)

14b. What is `requestIdleCallback`? → [#request-idle-callback](#request-idle-callback)

15. Describe micro-frontend architecture.

17. Compare `nextElementSibling` and `nextSibling`.

18. What web performance metrics do you know?

</details>

<details>
  <summary>Middle — Practical tasks (DOM)</summary>

### Middle — Practical tasks (DOM)

143. Implement a function that runs a callback for all elements in a given DOM subtree.

</details>

</details>
