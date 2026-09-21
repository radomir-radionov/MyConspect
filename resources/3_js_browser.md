# JS Browser — Document

DOM tree, querying, mutation, BOM, and script loading.

[← Back to JS hub](./3_js.md)

### Related docs

* [JS Core](./3_js_core.md) · [JS Array](./3_js_array.md) · [JS Functions](./3_js_functions.md) · [JS OOP](./3_js_oop.md) · [JS Async](./3_js_async.md)
* [Events](./3_js_events.md) · [Browser additional](./3_js_browser_extra.md) · [JS Interview](./3_js_interview.md)
* [HTML browser & rendering](./1_html.md) · [Web API](./6_web_api.md) · [OS files & file systems](./8_nodejs_modules.md#files--file-systems)
* [Jest DOM tests (`jsdom`)](./7_special_testing.md#jest--first-tests-node-vs-jsdom)

### Main concepts

| Area | Topics |
|------|--------|
| **Environment** | `window`, specs, script loading |
| **DOM** | Tree, querying, attributes vs properties, modification |
| **BOM** | `location`, `navigator`, `history` |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [Script loading](#script-loading)
- [DOM & BOM](#dom-bom-events)
- [Events](./3_js_events.md)
- [Interview](./3_js_interview.md)

---

## Script loading

<details>
  <summary>Script loading</summary>

### Script tags & loading

**Definition:** `<script>` loads and runs JavaScript. By default it **blocks HTML parsing** until the script finishes.

**How it works:**

- Parser hits `<script>` without `async`/`defer` → stops HTML parse, fetches (if `src`), executes, then resumes parse.
- `defer`: download parallel, execute in order after HTML parsed, before `DOMContentLoaded`.
- `async`: download parallel, execute when ready (order not guaranteed), may block parse at execution.
- Dynamically created `<script>` defaults to **async** behavior; set `script.async = false` to keep insertion order (like `defer`).
- `type="module"`: deferred by default, strict mode, `import`/`export`.
- A tag with **`src` ignores any inline body** — use a second `<script>` for inline code. Do not mix `src` and content in one tag.
- Old markup: `language` is obsolete; `type="text/javascript"` is unnecessary for classic scripts. Modern `type` is for modules / import maps / data blocks.

**When to use:**

App bundle → `defer`; analytics/ads → `async`; ES app → `type="module"`.

#### Common pitfalls

Two `async` scripts depending on each other; inline script before deferred external assuming it ran; module CORS requirements for cross-origin `src`; expecting inline code inside `<script src="…">` to run (it is ignored).

**Pluses and minuses:**

| + | − |
|------|------|
| `defer` preserves order, non-blocking | Still executes on main thread |
| `async` for independent scripts | Order unpredictable |
| Modules tree-shake, strict | Older browsers need nomodule fallback |

**Examples:**

```html
<script src="app.js" defer></script>
<script src="analytics.js" async></script>

<!-- WRONG: alert never runs -->
<script src="file.js">
  alert(1);
</script>

<!-- OK: external + separate inline -->
<script src="file.js"></script>
<script>
  alert(1);
</script>
```

**Thoughts:** Place non-critical scripts at the end of `<body>` or use `async` / `defer` to avoid blocking render.

### async & defer

| Attribute | Download | Execution order | Best for |
|-----------|----------|-----------------|----------|
| *(none)* | blocks parsing | document order | legacy inline scripts |
| `defer` | parallel | document order, before `DOMContentLoaded` | app bundles needing full DOM |
| `async` | parallel | first-ready-first-run | ads, analytics, independent scripts |
| `type="module"` | parallel | defer-like, strict mode by default | ES modules |

**Examples:**

```html
<script src="a.js" defer></script>
<script src="b.js" defer></script>
<script src="tracker.js" async></script>
```

**Sources:** [javascript.info/hello-world](https://javascript.info/hello-world) · [javascript.info/script-async-defer](https://javascript.info/script-async-defer) · [MDN `<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script)

</details>

<a name="dom-bom-events"></a>

## DOM & BOM

<details>
  <summary>DOM</summary>

### DOM

**Definition:**

The DOM is a live **node tree** the browser builds from HTML/XML. JS reads and mutates it through `document` — it is not the source file.

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
| `matches(sel)` / `closest(sel)` / `contains(node)` | boolean match / nearest ancestor / descendant check |

**How it works:**

Writes update the live tree immediately; mixed read/write loops can layout-thrash. Live collections change as the tree changes.

**Node identity:** `nodeType` (number), `nodeName` (always uppercase for HTML elements, e.g. `"DIV"`), `tagName` (elements only, same as `nodeName` for HTML). Prefer `tagName`/`nodeName` over stringifying the node.

**Attributes vs properties:** Standard HTML attrs become JS properties, but mapping is not 1:1.

| | Attribute (`getAttribute`) | Property (e.g. `el.id`) |
|--|----------------------------|-------------------------|
| Type | always string | typed (`checked` → boolean, `style` → object) |
| Name | case-insensitive | case-sensitive |
| Sync | most standard attrs ↔ props | exceptions: `input.value` updates property from attr, not attr from property |

- Non-standard attrs → no property; use `getAttribute` / `setAttribute`, or safer `data-*` → `elem.dataset`.
- `href` attribute = as written; `.href` = absolute URL.
- Prefer DOM properties for normal work; attributes when you need the HTML-as-written value or `data-*`.

**When to use:**

Mount UI; read/update attrs and properties; build lists.

#### Common pitfalls

`innerHTML` + user input (XSS); `checked`/`value` attribute vs property; assuming `firstChild` is an element.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Standard live tree, CSS selectors | Verbose vs VDOM; live lists surprise |

**Examples:**

```js
document.title = 'My App';
const app = document.getElementById('app');
app.children[0].tagName; // "P"
app.firstChild;          // often a whitespace text node

const box = document.querySelector('input[type=checkbox]');
box.checked = false;
box.getAttribute('checked'); // still "checked" if it was in HTML
```

**Thoughts:** Mutate the **runtime tree**, not the HTML file.

**See also:** [DOM navigation](#dom-navigation) · [DOM methods & props](#dom-methods--props) · [HTMLCollection vs NodeList](#htmlcollection-vs-nodelist) · [innerHTML vs outerHTML](#innerhtml-vs-outerhtml)

**Sources:** [javascript.info/dom-nodes](https://javascript.info/dom-nodes) · [javascript.info/basic-dom-node-properties](https://javascript.info/basic-dom-node-properties) · [javascript.info/dom-attributes-and-properties](https://javascript.info/dom-attributes-and-properties) · [MDN DOM](https://developer.mozilla.org/en-US/docs/Glossary/DOM)

### shadow dom

**Definition:** A private, isolated DOM subtree attached to a host element — separate from the page's normal (light) DOM.

**How it works:**

Without it, all components share one global DOM and CSS scope — styles leak, selectors clash, and internals are exposed. Shadow DOM gives **encapsulation**: scoped styles, hidden markup, and safe reuse across pages.

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

**When to use:**

Web Components, embeddable widgets, third-party UI on unknown pages.

React/Vue apps (they handle encapsulation differently); when you want global page styles to affect the component.

**Sources:** [javascript.info/shadow-dom](https://javascript.info/shadow-dom)

### Page lifecycle events

**Definition:**

Browser fires events as the page loads and unloads. Use them to initialize UI or warn users about unsaved data.

| Event | Fires when | Target |
|-------|-----------|--------|
| `DOMContentLoaded` | HTML parsed, DOM ready (images may still load) | `document` |
| `load` | All resources loaded (images, styles, scripts) | `window` |
| `beforeunload` | User is leaving the page | `window` |
| `unload` | Page is being unloaded | `window` |

**How it works:**

- `DOMContentLoaded` waits for classic/deferred scripts; `async` scripts and dynamically inserted scripts do not block it. Stylesheets before a script can delay that script (and thus `DOMContentLoaded`).
- `document.readyState`: `"loading"` → `"interactive"` (≈ before `DOMContentLoaded`) → `"complete"` (≈ `window.load`).
- `beforeunload`: set `event.returnValue = ""` (or return a string from `onbeforeunload`) to show the leave confirm — browsers ignore custom message text.
- `unload`: only fire-and-forget work (`navigator.sendBeacon`); do not expect async responses.
- Resource `load` / `error` on `<img>`, `<script>`, etc. track that asset only — not parse errors inside a successfully loaded script (`window.onerror` for those). Cross-origin script errors stay opaque unless `crossorigin` + CORS headers.

**Examples:**

```js
document.addEventListener('DOMContentLoaded', () => {
  initApp(); // DOM is ready
});

window.addEventListener('load', () => {
  hideLoader(); // images loaded too
});

window.addEventListener('beforeunload', (e) => {
  if (formDirty) e.returnValue = '';
});

const img = new Image();
img.onload = () => console.log(img.width);
img.onerror = () => console.log('failed');
img.src = '/hero.png';
```

**Sources:** [javascript.info/onload-ondomcontentloaded](https://javascript.info/onload-ondomcontentloaded) · [javascript.info/onload-onerror](https://javascript.info/onload-onerror)

### Creating & appending elements

**Examples:**

```js
const li = document.createElement('li');
li.textContent = 'New item';
li.classList.add('active');
document.querySelector('ul').append(li);
```

### HTMLCollection vs NodeList

| | HTMLCollection | NodeList |
|---|----------------|----------|
| **Live?** | yes (auto-updates) | usually static (`querySelectorAll`) |
| **Contains** | elements only | any node type |
| **Access** | index, name, id | index only |
| **From** | `getElementsBy*` | `querySelectorAll`, `childNodes` |

**Examples:**

```js
const live = document.getElementsByClassName('item');   // live
const snap = document.querySelectorAll('.item');      // static snapshot

document.querySelector('.item').remove();
live.length;  // decreased
snap.length;  // unchanged
```

**Note:** Neither is a real array — use `Array.from()` or spread to iterate with array methods.

### innerHTML vs outerHTML

| Property | Returns / sets |
|----------|----------------|
| `innerHTML` | HTML **inside** the element (children only) |
| `outerHTML` | HTML **including** the element itself |

**Examples:**

```html
<div id="box"><span>Hi</span></div>
```

```js
box.innerHTML;  // '<span>Hi</span>'
box.outerHTML;  // '<div id="box"><span>Hi</span></div>'
```

**Warning:** `innerHTML` parses HTML strings — sanitize user input to prevent XSS. Types and encoding: [Special — XSS](./7_special_security.md#xss-cross-site-scripting).

### window vs document

| | `window` | `document` |
|---|----------|------------|
| **Role** | Browser global object | DOM entry point (child of `window`) |
| **Access** | implicit global | `document` or `window.document` |
| **APIs** | `alert()`, `location`, `setTimeout` | `getElementById`, `createElement`, `querySelector` |

**Examples:**

```js
window.innerWidth;              // viewport size
document.querySelector('h1');   // DOM query
```

</details>

<details>
  <summary>DOM navigation</summary>

### DOM navigation

**Definition:** Traverse the DOM tree using parent/child/sibling properties and query methods.

**How it works:**

- Tree links: `parentNode`, `childNodes`, `nextSibling`, etc.; element-only variants skip text nodes.
- `querySelector(All)` runs selector engine on subtree; `getElementsBy*` returns live HTMLCollection.

| Direction | All nodes | Elements only |
|-----------|-----------|---------------|
| Parent | `parentNode` | `parentElement` |
| Children | `childNodes` | `children` |
| First child | `firstChild` | `firstElementChild` |
| Last child | `lastChild` | `lastElementChild` |
| Previous | `previousSibling` | `previousElementSibling` |
| Next | `nextSibling` | `nextElementSibling` |

| Method | Scope | Returns | Live? |
|--------|-------|---------|-------|
| `getElementById(id)` | document | element or `null` | — |
| `getElementsByClassName(cls)` | element | HTMLCollection | yes |
| `getElementsByTagName(tag)` | element | HTMLCollection | yes |
| `querySelector(sel)` | element | first match or `null` | — |
| `querySelectorAll(sel)` | element | NodeList | static |

**When to use:**

Walk to parent form; find next sibling element; scoped `el.querySelector('.title')`.

#### Common pitfalls

`firstChild` vs `firstElementChild`; modifying live collection while looping; assuming `children[0]` exists.

**Pluses and minuses:**

| + | − |
|------|------|
| Direct traversal fast for known structure | `childNodes` includes text nodes |
| `querySelector` flexible | Live collections update during iteration |
| `closest()` for delegation targets | Deep walks manual and brittle |

**Examples:**

```js
const list = document.querySelector('.list');
list.children;                        // element children only
list.querySelectorAll('li.active');   // static NodeList
list.getElementsByTagName('li');      // live HTMLCollection
```

**Thoughts:** `getElementsBy*` returns **live** collections; `querySelectorAll` returns a **snapshot**.

**Also:** `elem.matches(css)` — does this element match? `elem.closest(css)` — nearest ancestor (incl. self). `elemA.contains(elemB)` — is `elemB` inside `elemA`?

**Sources:** [javascript.info/dom-navigation](https://javascript.info/dom-navigation) · [javascript.info/searching-elements-dom](https://javascript.info/searching-elements-dom)

</details>

<details>
  <summary>DOM methods</summary>

### DOM methods
**Definition:** Common APIs for finding elements, working with forms, and reading custom data.

**How it works:**

- `document` methods search from document or element root.
- `dataset` maps `data-*` attributes to camelCase JS properties.
- `forms` collection indexes `<form>` elements; `requestSubmit()` fires submit event + validation.

`parentNode`, `childNodes`, `firstChild`, `lastChild`, `previousSibling`, `nextSibling`.

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

**When to use:**

Read `data-id` for delegation; programmatic form submit with validation; find first matching child.

#### Common pitfalls

`dataset` sets string only; `getAttribute('value')` vs `input.value` differ; multiple forms — `document.forms[name]`.

**Pluses and minuses:**

| + | − |
|------|------|
| `dataset` clean custom data API | All `data-*` values are strings |
| `requestSubmit()` respects constraints | `submit()` bypasses handlers |
| Scoped query on elements | `getElementsBy*` live collections confuse |

**Examples:**

```js
document.getElementById('app');
document.getElementsByClassName('card');
document.querySelector('.card.active');
document.querySelectorAll('li');
```

**`querySelector` vs `getElementsBy*`:** `querySelector(All)` works on any element and accepts full CSS selectors; `getElementsBy*` only searches descendants and returns live collections.

</details>
	

<details>
  <summary>BOM</summary>

### BOM

**Definition:** Browser Object Model — browser-provided objects **outside** the document: `window`, `location`, `navigator`, `history`, `screen`, timers.

**How it works:**

- `window` is global object in browsers; `document`, `location`, `history`, `navigator` are properties.
- BOM APIs are browser-specific (not in ECMAScript spec); DOM is separate but accessed via `window.document`.

| Object | Purpose |
|--------|---------|
| `window` | Global scope, dialogs, viewport size |
| `location` | Current URL, redirect |
| `navigator` | Browser/OS info (`userAgent`) |
| `history` | Back/forward navigation |
| `screen` | Screen dimensions |

**When to use:**

Redirect via `location.href`; read `navigator.userAgent` (feature detect better); `history.pushState` for SPA.

#### Common pitfalls

Treating BOM as part of ECMAScript; `window.open` blocked by pop-up blockers; `navigator` fields spoofable.

**Pluses and minuses:**

| + | − |
|------|------|
| Unified `window` entry point | Not available in Node (different globals) |
| `location` for navigation | Direct `location` assignment full page reload |
| `history` for SPA routing | History state size limits |

**Examples:**

```js
location.href = 'https://example.com';
navigator.userAgent;
history.back();
```

**Sources:** [javascript.info/browser-environment](https://javascript.info/browser-environment)

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
  <summary>Changing the DOM</summary>

### Changing the DOM

**Definition:** Create, insert, modify, and remove nodes to update the page dynamically.

**How it works:**

- `createElement` / `createTextNode` build nodes; insert via `append`, `before`, `after`, `replaceWith`.
- Moving existing node removes it from old parent — single parent rule.
- `innerHTML` parses HTML string; `textContent` escapes and is safe for text.

appending an existing node **moves** it (doesn't copy).

#### Legacy methods (old code)

`appendChild`, `removeChild`, `insertBefore`, `replaceChild` — still work but prefer modern methods above.

#### Changing appearance (styles & classes)

Prefer **CSS classes** over inline styles. Use `style` only for values computed at runtime (e.g. coordinates).

| API | Role |
|-----|------|
| `className` | whole `class` string (replaces all) |
| `classList.add/remove/toggle/contains` | one class at a time |
| `elem.style.prop` | inline style only (camelCase: `backgroundColor`) |
| `elem.style.cssText` | rewrite entire inline style string |
| `getComputedStyle(elem)` | resolved styles after cascade (read-only; geometry usually in `px`) |

```js
el.classList.add('active');
el.classList.toggle('hidden');
el.style.left = `${x}px`;          // need units
el.style.display = '';             // clear inline → CSS classes apply again
getComputedStyle(el).marginTop;    // not available via el.style if set in CSS
```

`hasAttribute`, `getAttribute`, `setAttribute`, `removeAttribute`.

**When to use:**

Build list items; replace banner; sanitize then `textContent` for user text.

#### Common pitfalls

`innerHTML` with user strings; appending in loop causes N reflows (use `DocumentFragment`); `appendChild` same as move not copy.

#### Creating nodes

**Pluses and minuses:**

| + | − |
|------|------|
| Modern insert methods readable | Many reflows if inserting one-by-one |
| `replaceWith` atomic swap | `innerHTML` XSS if untrusted |
| `cloneNode(true)` deep copy | Moved nodes leave old references stale |

**Examples:**

```js
const div = document.createElement('div');
const text = document.createTextNode('Hello');
const comment = document.createComment('note');
```

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

**Sources:** [javascript.info/modifying-document](https://javascript.info/modifying-document) · [javascript.info/styles-and-classes](https://javascript.info/styles-and-classes)

</details>

<details>
  <summary>Text, forms, and dialogs</summary>

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

**When to use:** Set label text → `textContent`; read displayed text → `innerText`; read input → `.value`; confirm delete → `confirm` or custom modal.

**Pluses and minuses:**

| + | − |
|------|------|
| `textContent` fast and predictable | `innerText` slower |
| `.value` correct for inputs | Blocking dialogs freeze UI |
| `requestSubmit()` proper validation | `alert` not stylable |

**Examples:**

```js
el.textContent = 'Hello'; // preferred for setting text
```

### Forms

Use `.value` for inputs — **not** `innerHTML` (especially `<textarea>`). Navigate via `document.forms[name]` and `form.elements[name]`; each control has `.form` back to the form.

```js
const form = document.forms.my;     // or document.forms[0]
form.elements.login.value;
input.value;       // current value (property)
textarea.value;    // not textarea.innerHTML
form.requestSubmit(); // triggers validation + submit event
form.submit();        // sends without submit event / validation
```

`<select>`: `select.value`, `select.selectedIndex`, or `option.selected`. Create options with `new Option(text, value, defaultSelected, selected)`.

**Focus:** `focus` / `blur` do not bubble — use capture or bubbling `focusin` / `focusout`. Most elements need `tabindex` to be focusable (`0` = natural tab order, `-1` = programmatic only). Current focus: `document.activeElement`.

**Value events:** `input` fires on every change (typing, paste, speech); `change` fires when editing finishes (blur for text; immediately for checkbox/select). `cut` / `copy` / `paste` are `ClipboardEvent`s — can `preventDefault()`.

**Sources:** [javascript.info/alert-prompt-confirm](https://javascript.info/alert-prompt-confirm) · [javascript.info/form-elements](https://javascript.info/form-elements) · [javascript.info/focus-blur](https://javascript.info/focus-blur) · [javascript.info/events-change-input](https://javascript.info/events-change-input) · [javascript.info/forms-submit](https://javascript.info/forms-submit)

### Dialog popups

| Method | Returns |
|--------|---------|
| `alert(msg)` | `undefined` |
| `confirm(msg)` | `true` / `false` |
| `prompt(msg, default)` | string or `null` |

All three are **modal**: they pause script execution and block the rest of the page until dismissed. Look and position are browser-controlled.

**Common pitfalls:** `textarea.innerHTML` vs `textarea.value`; using `innerText` in hot loops; `confirm` in async code blocks main thread.

</details>

<details>
  <summary>MutationObserver</summary>

### MutationObserver

**Definition:** Built-in API to watch DOM changes and react via callback.

**How it works:**

- Observer callback receives batch of `MutationRecord`s after DOM changes in microtask.
- `observe(target, { childList, attributes, subtree, characterData })` filters what to watch.
- `disconnect()` stops observation; `takeRecords()` flushes pending.

child nodes added/removed, attribute changes, text content changes.

**When to use:**

Widget injected by ad script; contenteditable sync; attribute changes on custom element.

third-party scripts modifying DOM, lazy-loaded content, Web Components.

#### MutationObserver vs ResizeObserver

| | MutationObserver | ResizeObserver |
|---|------------------|----------------|
| **Watches** | DOM tree changes (nodes, attrs, text) | Element size changes |
| **When to use** | Dynamic content injection, third-party widgets | Responsive components, charts |
| **Performance** | Can fire often — narrow `subtree`/`attributes` | Fires on layout changes only |

See also [IntersectionObserver and ResizeObserver](#intersection-resize-observer).

#### Common pitfalls

Observing entire `document.body` with `subtree: true`; infinite loop if callback mutates observed subtree; forgetting `disconnect`.

**Pluses and minuses:**

| + | − |
|------|------|
| React to third-party DOM changes | Can fire very frequently |
| Async batched — not synchronous | Narrow options or performance suffers |
| No polling needed | Not for size changes — use ResizeObserver |

**Examples:**

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

**Sources:** [javascript.info/mutation-observer](https://javascript.info/mutation-observer)

</details>

<details>
  <summary>Forms vs dialogs</summary>

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

**When to use:**

Checkout → form; delete confirm → modal or `confirm`; search bar → inline form.

#### Common pitfalls

Modal without focus trap; nested `<form>` invalid; form in modal without proper `aria-modal`.

**Pluses and minuses:**

| + | − |
|------|------|
| Semantic HTML, accessible | Modals overused hurt UX |
| Native validation | Custom modals need a11y work |
| Fits multi-field workflows | Forms heavy for single yes/no |

**Examples:**

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

**Sources:** [form vs modal](https://thecontentauthority.com/blog/form-vs-modal)

</details>

---

Interview Q&A and coding tasks live in [JS — Interview](./3_js_interview.md).
