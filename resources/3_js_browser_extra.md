# JS Browser — Additional

Browser APIs beyond the document tree: storage, CORS, observers, History, URL, files, and UI timing.

[← Back to JS hub](./3_js.md)

### Related docs

* [Document](./3_js_browser.md) · [Events](./3_js_events.md) · [JS Interview](./3_js_interview.md)
* [JS Core](./3_js_core.md) · [JSON](./3_js_core.md#json) · [JS Array](./3_js_array.md) · [JS Async](./3_js_async.md)
* [HTML browser & rendering](./1_html.md) · [Web API](./6_web_api.md) · [HTTP cookies](./6_web_api_http.md#http-cookies) · [URI / URL anatomy](./6_web_api_core.md#uri-url--urn) · [CORS](./6_web_api_security.md#cors) · [PWA](./6_web_api_apps.md#pwa-progressive-web-app)
* [OS files & file systems](./8_nodejs_core.md#files--file-systems)

### Main concepts

| Area | Topics |
|------|--------|
| **UI** | Dimensions, scroll, coordinates, debounce, throttle, `rAF`, idle callbacks |
| **APIs** | Storage, CORS, observers, History API, `URL` / `URLSearchParams`, Web Components, File API |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [Media queries](#media-queries-in-javascript)
- [Browser APIs & UI patterns](#browser-apis--ui-patterns)
- [Debounce](#debounce) · [Throttle](#throttle)
- [Browser storage & security](#browser-storage) · [CORS](#cors-same-origin) · [Observers](#intersection-resize-observer) · [History API](#history-api) · [URL / URLSearchParams](#url--urlsearchparams)
- [Interview](./3_js_interview.md)

---

## Browser APIs & UI patterns

<a name="formdata-file-api-filereader"></a>

<details>
  <summary>FormData, File API, FileReader Api</summary>

### FormData, File API, FileReader

**Definition:** APIs for reading user files and sending form data to a server. Disk paths, attributes, and OS file APIs live in [Files & file systems](./8_nodejs_core.md#files--file-systems) — the browser only sees a `File` the user picked, not the host tree.

**How it works:**

- `FormData` wraps form fields or manual append; multipart body for `fetch`.
- File input `files` is `FileList`; drag-drop `dataTransfer.files`.
- `FileReader` async reads file as text, data URL, or ArrayBuffer via events.

**When to use:**

Avatar upload; CSV import; drag-drop text file preview.

#### Common pitfalls

Forgetting `enctype` not needed with fetch FormData; reading huge file with `readAsDataURL`; not revoking object URLs.

#### FormData

Collects key/value pairs from a form (including files) for `fetch` or `XHR`.

**Pluses and minuses:**

| + | − |
|------|------|
| `FormData` easy uploads | Large files block if read fully to memory |
| `FileReader` flexible formats | Event-based API verbose |
| Works with fetch/XHR | No built-in progress on fetch (XHR has progress) |

**Examples:**

```js
const form = document.querySelector('form');
const data = new FormData(form);
// or manually:
data.append('avatar', fileInput.files[0]);

await fetch('/upload', { method: 'POST', body: data });
```

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

**Sources:** [javascripttutorial FormData](https://www.javascripttutorial.net/web-apis/javascript-formdata/) · [MDN FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)

</details>

<details>
  <summary>URL: createObjectURL()</summary>

### URL.createObjectURL()

**Definition:** Creates a temporary blob URL for a `File` or `Blob` — useful for previewing uploads. Parsing `https://` URLs: [URL / URLSearchParams](#url--urlsearchparams).

**How it works:**

- `URL.createObjectURL(blob)` creates `blob:` URL referencing in-memory blob until revoked.
- Document owns URLs — revoke when done to free memory.

URL lifetime is tied to the document — revoke when no longer needed.

**When to use:**

Image preview before upload; download link for generated PDF blob.

#### Common pitfalls

Never calling `revokeObjectURL`; storing blob URL in localStorage; using after blob garbage collected without revoke semantics understood.

**Pluses and minuses:**

| + | − |
|------|------|
| Instant preview of uploads | Memory leak if not revoked |
| No base64 overhead | URL invalid after revoke |
| Works with video/audio src | Blob URLs not persistent across sessions |

**Examples:**

```js
const file = input.files[0];
const url = URL.createObjectURL(file);
img.src = url;

// cleanup when done
URL.revokeObjectURL(url);
```

**Sources:** [MDN createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)

</details>

<details>
  <summary>Web components</summary>

### Web Components

**Definition:** Browser-native APIs for creating reusable, encapsulated custom HTML elements.

**How it works:**

- `customElements.define('my-el', Class)` registers custom tag; `connectedCallback` when inserted.
- `attachShadow({ mode: 'open' })` creates encapsulated DOM; styles scoped inside shadow root.
- `<template>` holds inert markup cloned into shadow root.

| API | Purpose |
|-----|---------|
| Custom Elements | Define new tags (`<my-button>`) |
| Shadow DOM | Encapsulated DOM & styles |
| HTML Templates | `<template>` for inert markup |
| ES Modules | `import` in `<script type="module">` |

**When to use:**

Design system primitives; embeddable widget; cross-framework component.

design systems, embeddable widgets, framework-agnostic components.

#### Common pitfalls

Expecting global CSS to pierce shadow (need `::part` or CSS variables); forgetting `customElements.define` once guard; form association with shadow inputs.

**Pluses and minuses:**

| + | − |
|------|------|
| Native encapsulation | Framework ecosystem still dominant |
| Reusable across stacks | SSR/styling tooling more complex |
| Standard in modern browsers | Closed shadow harder to debug |

**Examples:**

```js
class MyButton extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<button><slot></slot></button>`;
  }
}
customElements.define('my-button', MyButton);
```

**Sources:** [MDN Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)

</details>

<details>
  <summary>Debounce</summary>

### Debounce

**Definition:** Debounce **waits until calls stop** for a delay, then runs the function **once** (usually on the trailing edge). Rapid calls are collapsed into one invocation.

**How it works:**

- Each call `clearTimeout`s the previous timer and starts a new `setTimeout`.
- The function runs only after `ms` milliseconds with **no new calls**.
- Typical debounce is trailing-edge (search after typing pauses). Leading-edge debounce exists but is less common.
- Return the wrapper from a HOF; keep the same wrapper for `removeEventListener`.
- Cancel the timeout on unmount or you may run `fn` after the UI is gone.

**When to use:** Search/autocomplete, form validation, “resize ended” layout. Skip for work that must keep up while the user is still moving (use [Throttle](#throttle)).

**Pluses and minuses:**

| + | − |
|------|------|
| Cuts noisy `input` down to one request | Feels laggy if `ms` is too large |
| Simple: `setTimeout` + `clearTimeout` | Continuous events may **never** fire |

**Examples:**

```js
function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

const search = debounce((q) => {
  fetch(`/api/search?q=${encodeURIComponent(q)}`).then((r) => r.json());
}, 300);

input.addEventListener("input", (e) => search(e.target.value));
```

**Thoughts:** Interview line: “wait for quiet, then run once.”

**See also:** [Throttle](#throttle)

**Sources:** [MDN Glossary — Debounce](https://developer.mozilla.org/en-US/docs/Glossary/Debounce) · [MDN Window.setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout) · [MDN Window.clearTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearTimeout)

</details>

<details>
  <summary>Throttle</summary>

### Throttle

**Definition:** Throttle runs a function at most **once per time window** while events keep firing. Unlike debounce, it does **not** wait for a pause — it keeps up at a capped rate.

**How it works:**

- **Leading edge:** first call in a window runs immediately; later calls in that window are ignored until the timer clears (simple `blocked` flag).
- **Trailing / measured timeout:** MDN’s `scroll` pattern stores the latest value and uses `setTimeout` so work runs at most every N ms.
- `requestAnimationFrame` is **not** a throttle for `scroll` — rAF and scroll fire at similar rates; measure the delay yourself (`setTimeout`) or use `IntersectionObserver`.

**When to use:** `scroll`, `mousemove`, live position sync. Skip when you only care about the **final** value after a pause (use [Debounce](#debounce)).

**Pluses and minuses:**

| + | − |
|------|------|
| UI stays updated during motion | May skip the last sample (leading-only) |
| Caps expensive handlers | Easy to confuse with debounce |

**Examples:**

```js
function throttle(fn, ms) {
  let blocked = false;
  return (...args) => {
    if (blocked) return;
    fn(...args);
    blocked = true;
    setTimeout(() => {
      blocked = false;
    }, ms);
  };
}

window.addEventListener("scroll", throttle(() => {
  console.log(window.scrollY);
}, 100));

// MDN-style: at most every 20ms, always with latest scrollY
let lastY = 0;
let ticking = false;
document.addEventListener("scroll", () => {
  lastY = window.scrollY;
  if (ticking) return;
  ticking = true;
  setTimeout(() => {
    console.log(lastY);
    ticking = false;
  }, 20);
});
```

**Thoughts:** Interview line: “still runs during the storm, but not more often than N ms.”

**See also:** [Debounce](#debounce) · [requestAnimationFrame](#request-animation-frame)

**Sources:** [MDN Glossary — Throttle](https://developer.mozilla.org/en-US/docs/Glossary/Throttle) · [MDN Document scroll event](https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event) · [MDN Window.setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)

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
- Pipeline / dirty layout → [1_html.md](./1_html_rendering.md#browser--rendering).

**When to use:**

JS animations; measure layout before paint; game loop; scroll-linked effects.

Visual animations — always prefer over `setInterval`/`setTimeout`.

#### Common pitfalls

Doing heavy logic inside rAF callback; using rAF for one-shot delay (use `queueMicrotask` or `setTimeout`); not cancelling loop on unmount.

**Pluses and minuses:**

| + | − |
|------|------|
| Smooth animations | Still main-thread — heavy work janks |
| Auto-pauses in background | Not for non-visual delays |
| Better than `setInterval` for visuals | One frame budget ~16ms |

**Examples:**

```js
function animate() {
  element.style.transform = `translateX(${position}px)`;
  position += 2;
  if (position < 500) requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

| | rAF | setTimeout |
|---|-----|------------|
| Sync with display | yes | no |
| Paused in background tab | yes | no |
| Use for | animations | delayed one-off tasks |

**Sources:** [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

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

**When to use:** Non-urgent work. Do **not** use for drag/scroll animation.

**Thoughts:** *rAF = this frame’s pixels; idle = leftover time; microtask storms never leave leftover time.*

**Sources:** [MDN requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)

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

**When to use:**

Sticky header offset; infinite scroll near bottom; tooltip positioning.

Layout calculations, infinite scroll, sticky headers, scroll-to-element.

anchor navigation, "scroll to error", highlighting search results.

#### Common pitfalls

Reading layout in write loop (thrashing); `offsetHeight` includes border, `clientHeight` not; rect changes on scroll without re-read.

| Property family | Includes border | Includes scrollbar | Content only |
|-----------------|-----------------|--------------------|--------------|
| `offset*` | yes | no | no |
| `client*` | no | no | no |
| `scroll*` | — | — | full scrollable area |

**Pluses and minuses:**

| + | − |
|------|------|
| `getBoundingClientRect` precise | Forces layout if called in loop |
| Many properties for different needs | Easy to confuse offset vs client |
| `scrollIntoView` built-in | Smooth scroll not instant for tests |

**Examples:**

```js
const el = document.querySelector('.panel');
const rect = el.getBoundingClientRect();
const belowFold = rect.top > window.innerHeight;

el.scrollIntoView({ behavior: 'smooth', block: 'start' });
```

#### scrollIntoView()

Scrolls the element into the visible area of the browser window.

```js
document.querySelector('#section-3').scrollIntoView({
  behavior: 'smooth',
  block: 'start',   // 'start' | 'center' | 'end' | 'nearest'
  inline: 'nearest',
});
```

**Thoughts:** `getBoundingClientRect()` is relative to viewport; add `scrollY` for document coordinates.

**Sources:**

[javascript.info/size-and-scroll](https://learn.javascript.ru/size-and-scroll)

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

**When to use:**

Drag-drop; canvas hit testing; tooltip at cursor.

Drag-and-drop, tooltips, click targets on canvas/SVG.

#### Common pitfalls

Using client coords for document-positioned elements without scroll; ignoring `transform` on parent; touch `touches[0]` vs `changedTouches`.

| Method | Coordinate system |
|--------|-------------------|
| `getBoundingClientRect()` | Viewport (changes on scroll) |
| `clientX` / `clientY` (events) | Viewport |
| `pageX` / `pageY` | Document (includes scroll) |

**Pluses and minuses:**

| + | − |
|------|------|
| Standard event coordinates | Touch has multiple touches |
| `getBoundingClientRect` for element hits | Zoom/transform affect rect |
| `pageX` includes scroll | Legacy IE differences mostly gone |

**Examples:**

```js
document.addEventListener('click', (e) => {
  console.log('viewport:', e.clientX, e.clientY);
  console.log('document:', e.pageX, e.pageY);
});
```

**Sources:**

[javascript.info/coordinates](https://learn.javascript.ru/coordinates)

---

</details>

<details>
  <summary>Selection and Range API</summary>

### Selection and Range API

**Definition:** `Selection` represents user text selection; `Range` is a DOM fragment between two boundary points.

**How it works:**

- `window.getSelection()` returns user selection; `Range` defines start/end containers and offsets.
- `range.selectNodeContents(el)` selects all children; `addRange` applies to selection.

**When to use:**

Editor toolbar bold; copy custom format; highlight search matches.

WYSIWYG editors, copy/custom highlight, find-in-page.

#### Common pitfalls

Selection cleared on DOM mutation; conflating selection with input `selectionStart`; not collapsing range after use.

**Pluses and minuses:**

| + | − |
|------|------|
| Rich text editor building block | Cross-browser quirks in edge cases |
| Programmatic copy/highlight | Complex nested text nodes |
| Inspect user selection | Mobile selection API limited |

| + | − |
|------|------|
| Rich text editor support | Browser inconsistencies in edge cases |
| Programmatic selection | Complex API surface |

**Examples:**

```js
const selection = window.getSelection();
const range = document.createRange();
range.selectNodeContents(document.querySelector('article'));
selection.removeAllRanges();
selection.addRange(range);
```

**Sources:**

[javascript.info/selection-range](https://learn.javascript.ru/selection-range)

---

</details>

<a name="cross-tab-communication"></a>

<details>
  <summary>Cross-tab & cross-window communication</summary>

### Cross-tab & cross-window communication

**Definition:**

Tabs/windows exchange data through several APIs. Pick by **origin**, **1:1 vs broadcast**, and **message vs shared state**.

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

**How it works:**

SOP blocks direct JS across origins. `postMessage` delivers a `MessageEvent`; the receiver **must** check `event.origin`. The `storage` event fires on **other** documents that share that storage area — not on the writer.

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

**When to use:**

Logout all tabs; OAuth popup; theme sync; iframe widgets.

#### Common pitfalls

Skipping `event.origin`; expecting `storage` in the writing tab; using `sessionStorage` for cross-tab sync.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Right API per constraint | Easy to treat `localStorage` as a bus |
| `postMessage` is the cross-origin path | Must validate `event.origin` |

**Examples:**

```js
parent.postMessage({ type: 'READY' }, 'https://parent.example.com');

window.addEventListener('message', (e) => {
  if (e.origin !== 'https://child.example.com') return;
  console.log(e.data);
});
```

```js
const channel = new BroadcastChannel('app-events');
channel.postMessage({ type: 'LOGOUT' });
channel.onmessage = (e) => { if (e.data.type === 'LOGOUT') redirectToLogin(); };
channel.close();
```

**Thoughts:** Cross-origin → `postMessage` + origin check. Same-origin broadcast → `BroadcastChannel`.

**Sources:** [MDN postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) · [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) · [storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)

### Clickjacking

**Definition:** Attacker embeds your site in a hidden iframe and tricks the user into clicking your UI under a deceptive overlay.

**How it works:** `X-Frame-Options: DENY` or CSP `frame-ancestors 'none'` (or allowlist trusted parents only).

**Sources:**

[javascript.info/cross-window-communication](https://learn.javascript.ru/cross-window-communication) · [MDN BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) · [MDN storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)

---

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

**When to use:**

Auth session the **server** must see → `HttpOnly` + `Secure` + `SameSite` cookie. Theme / locale / small UI prefs → `localStorage`. Wizard / tab-only draft → `sessionStorage`. Offline notes, files, queryable lists → IndexedDB (or localForage). Client-only data → never cookies (they bloat every request).

#### Common pitfalls

JWT / tokens in Web Storage (XSS, extensions). Assuming overflow *wipes* Web Storage — it **throws**, it does not auto-clear. Cookie table “sent unless HttpOnly” is wrong: HttpOnly is still sent to the server, just not readable from JS. `storage` event does not fire in the writing tab. Safari 7-day rule is **no interaction**, not “did not call `getItem`”. Do not treat localStorage as durable forever.

**Pluses and minuses:**

| + | − |
|------|------|
| Cookies: server round-trip, `HttpOnly` for XSS | Size; sent every request; clumsy JS API |
| Web Storage: tiny API | Sync; strings; XSS-readable; ~5 MiB |
| IndexedDB: async, structured, large | Verbose API |
| localForage: one API, driver fallback | Extra dependency |

**Examples:**

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

**Thoughts:** Cookies for what the **server** needs on the next request; Web Storage for small client prefs; IndexedDB (or localForage) for large/async data.

**Sources:** [MDN — Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) · [MDN — quotas & eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) · [MDN — cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies) · [MDN — IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) · [localForage](https://github.com/localForage/localForage)

</details>

<a name="cors-same-origin"></a>

<details>
  <summary>CORS and same-origin policy</summary>

### CORS and same-origin policy

**Definition:** **Same-origin policy** stops a document from reading another origin’s DOM, storage, and (by default) HTTP responses. **CORS** is the HTTP opt-in so `fetch`/`XHR` can read a cross-origin response.

**How it works:** SOP also covers iframes and `document` access — not only APIs. Headers, preflight, credentials, `*`, and `Vary: Origin` live in [Web API — CORS](./6_web_api_security.md#cors).

**When to use:** Cross-origin `fetch` from a page; module scripts / fonts that need CORS; same-origin calls need no CORS headers.

**Pluses and minuses:**

| + | − |
|------|------|
| Isolates tabs/iframes by origin | Easy to confuse SOP (DOM) with CORS (HTTP read) |

**Examples:** see [Web API — CORS](./6_web_api_security.md#cors).

**Thoughts:** SOP is the default isolate; CORS is server headers that let **page JS** read a response — not a server firewall.

**Sources:** [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

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

**When to use:**

Lazy-load images (`data-src` when intersecting); sticky analytics "50% visible"; textarea auto-grow; canvas resize.

#### Common pitfalls

Not `unobserve` after lazy load; ResizeObserver callback changing size infinitely; expecting IO during `display:none` (no intersection).

**Pluses and minuses:**

| + | − |
|------|------|
| Better perf than scroll listeners | Callback timing async — not synchronous with DOM |
| Lazy loading standard pattern | ResizeObserver loop limit errors if callback mutates layout |
| Fine-grained thresholds | Older browsers need polyfill for IO |

**Examples:**

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

**Sources:** [MDN IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) · [MDN ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)

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

**When to use:**

SPA route change; wizard steps; modal deep-link; replaceState to strip temp query params.

#### Common pitfalls

Forgetting `popstate` listener — back button breaks; pushing same URL duplicates stack; state too large; confusing `hashchange` (`#/page`) with History API.

**Pluses and minuses:**

| + | − |
|------|------|
| SPA URLs without reload | Must sync app state with history manually |
| State object for restore | `state` structured-clone limits (no DOM nodes) |
| Works with router libs (React Router) | User expects back button to undo app state |

**Examples:**

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

**Sources:** [javascript.info/modifying-document](https://learn.javascript.ru/modifying-document) · [MDN History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)

</details>

<a name="url--urlsearchparams"></a>

<details>
  <summary>URL and URLSearchParams</summary>

### URL and URLSearchParams

**Definition:** `URL` parses/builds a full address; `URLSearchParams` reads and writes the query string (`application/x-www-form-urlencoded`: space → `+`). URL *shape* (scheme, host, fragment): [URI, URL & URN](./6_web_api_core.md#uri-url--urn). Blob URLs: [createObjectURL](#url-createobjecturl).

**How it works:**

- `new URL(url, base)` — `base` resolves relative `url` (MDN).
- Useful fields: `protocol`, `hostname`, `port` (empty if default), `pathname`, `search`, `searchParams`, `hash`, `href`, `origin` (scheme + host + non-default port).
- `searchParams.get` / `getAll` / `set` / `append` / `delete` / `toString()` (no leading `?`). Duplicate keys are allowed; `append` adds, `set` replaces.
- Do not split `?`/`&` by hand — encoding breaks (`привет`, `+` vs space).

**When to use:**

Build search links; read `location.search`; Node/Next `new URL(request.url)`.

#### Common pitfalls

`toString()` omits `?`; constructing `URLSearchParams` from a raw interpolated string can mishandle `+`; `username`/`password` exist on `URL` but putting credentials in a href is deprecated.

**Examples:**

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

**Thoughts:** Parse with `URL`; mutate query with `searchParams`, never with string concat.

**Sources:** [MDN — URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) · [MDN — URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

</details>

<details>
  <summary>Related</summary>

### Related

* HTTP, Fetch, storage → [6_web_api.md](./6_web_api.md)
* HTML rendering pipeline → [1_html.md](./1_html.md)
* Document (DOM/BOM) → [3_js_browser.md](./3_js_browser.md)
* Events → [3_js_events.md](./3_js_events.md)

</details>

---

Interview Q&A and coding tasks live in [JS — Interview](./3_js_interview.md).
