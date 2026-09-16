# JS Browser — Events

Browser events: handlers, phases, delegation, and custom events.

[← Back to JS hub](./3_js.md)

### Related docs

* [Document](./3_js_browser.md) · [Browser additional](./3_js_browser_extra.md)
* [JS Core](./3_js_core.md) · [JS Functions](./3_js_functions.md) · [JS OOP](./3_js_oop.md) · [JS Async](./3_js_async.md)
* [HTML](./1_html.md) · [Web API](./6_web_api.md)

### Main concepts

| Area | Topics |
|------|--------|
| **Events** | Bubbling, capturing, delegation, default actions |
| **Custom** | `CustomEvent` and `detail` payloads |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [Events](#event)
- [Event phases](#event-phases)
- [Event handlers & delegation](#event-delegation)
- [Custom events](#custom-events)
- [Interview Practice](#interview-practice)

---

<a name="event"></a>

<details>
  <summary>Events</summary>

### Events

**Definition:** An event is a browser signal that something happened (click, keypress, scroll, load). A **handler** is a function that runs in response.

**How it works:**

- User action or browser signal creates event object; dispatches through capture → target → bubble phases.
- `addEventListener(type, handler, options)` registers; multiple handlers per event allowed.
- Handler receives event as first argument; `this` is `currentTarget` for non-arrow functions.

Mouse, Keyboard, Form, Document/Window, Touch.

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

| Method | Example | Notes |
|--------|---------|-------|
| HTML attribute | `onclick="..."` | Avoid — mixes HTML & JS |
| DOM property | `elem.onclick = fn` | Only one handler per event |
| `addEventListener` | `elem.addEventListener('click', fn)` | Preferred — multiple handlers, options |

**When to use:**

Click/key handlers; form `submit`; `DOMContentLoaded` init; custom events for decoupling.

#### Common pitfalls

Arrow vs function `this` difference; assuming `target` === `currentTarget`; duplicate listeners on re-render without cleanup.

**Pluses and minuses:**

| + | − |
|------|------|
| Declarative UI reactions | Forgetting `removeEventListener` leaks memory |
| `addEventListener` flexible options | Inline handlers mix concerns |
| Event object rich metadata | Too many listeners hurt performance |

**Examples:**

```js
button.addEventListener('click', (e) => {
  console.log(e.type, e.target);
});
```

### Event object

**Definition:** The browser passes an `event` object as the first argument to every handler.

**How it works:**

`type`, `target`, `currentTarget`, `clientX`/`clientY` (mouse), `key` (keyboard).

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

**Sources:** [javascript.info/events](https://learn.javascript.ru/events) · [default-browser-action](https://learn.javascript.ru/default-browser-action)

</details>

<a name="event-phases"></a>

<details>
  <summary>Event phases</summary>

### Event phases

**Definition:**

Every event travels through 3 phases: **capturing** (top → target), **target**, **bubbling** (target → top). Default handlers run on the **bubble** phase.

<img width="688" alt="image" src="https://github.com/Way-to-Front-end-Developer/Core/assets/66359081/cae585f8-2239-4d66-a49c-53c34560312d">

**How it works:**

- Capture: window → … → parent of target (handlers with `capture: true`).
- Target: handlers on target element (both capture-flag and bubble-flag run in registration order on target).
- Bubble: target → … → window (default `capture: false`).

| Property | Meaning |
|----------|---------|
| `event.target` | Element that triggered the event (doesn't change) |
| `event.currentTarget` | Element whose handler is running now (`this`) |
| `event.eventPhase` | `1` capturing, `2` target, `3` bubbling |

pass `{ capture: true }` as third argument to `addEventListener`.

**When to use:**

Delegation on bubble (default); focus trap on capture; analytics on capture before `stopPropagation`.

#### Common pitfalls

Parent capture handler stopping before child runs; confusing `target` (clicked node) with `currentTarget` (node with listener).

| Phase | Direction | Default? |
|-------|-----------|----------|
| Capturing | `window` → target | no |
| Target | on the element itself | — |
| Bubbling | target → `window` | **yes** |

**Pluses and minuses:**

| + | − |
|------|------|
| Capture for early interception | Easy to forget which phase handler uses |
| Bubble enables delegation | Stopping propagation affects other listeners |
| `eventPhase` introspection | Three phases mental overhead |

**Examples:**

```js
parent.addEventListener('click', handler, { capture: true }); // runs on way down
child.addEventListener('click', handler);                     // runs on way up (bubble)
```

</details>

<details>
  <summary>Event handlers</summary>

<a name="event-delegation"></a>

### Event handlers

**Definition:** Functions that run when an event fires. Prefer `addEventListener` over inline handlers.

**How it works:**

- `preventDefault()` blocks default browser action (navigation, submit).
- `stopPropagation()` stops further propagation; `stopImmediatePropagation()` also blocks other handlers on same element.
- `passive: true` tells browser listener won't `preventDefault` — scroll performance.

`removeEventListener(event, sameFn, capture)` — must pass the **same function reference**.

regular functions → `this` is `currentTarget`; arrow functions → inherit outer `this`.

<img width="642" alt="image" src="https://github.com/Way-to-Front-end-Developer/Core/assets/66359081/0d37f5f7-4c42-49d6-9100-6520df837439">

**When to use:**

List click delegation; prevent form full page submit; stop modal click bubbling to overlay.

#### Common pitfalls

`stopPropagation` on child blocks parent delegation; rebinding new arrow fn each render prevents removal; passive + `preventDefault` ignored.

**Pluses and minuses:**

| + | − |
|------|------|
| Delegation — one listener for many children | Wrong `target` if nested elements inside `li` |
| `once: true` auto cleanup | `removeEventListener` needs same function reference |
| Passive listeners smoother scroll | Cannot preventDefault in passive listener |

**Examples:**

```js
elem.addEventListener(event, handler, options);
// options: { capture, once, passive }
```

| Option | Effect |
|--------|--------|
| `capture: true` | Run during capturing phase |
| `once: true` | Auto-remove after first call |
| `passive: true` | Won't call `preventDefault()` (better scroll perf) |

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

**Sources:** [javascript.info/event-delegation](https://learn.javascript.ru/event-delegation)

</details>

<a name="custom-events"></a>

<details>
  <summary>Custom events</summary>

### Custom events

**Definition:** `CustomEvent` lets you dispatch application-specific events through the DOM event system with optional `detail` payload.

**How it works:**

- `new CustomEvent('name', { detail, bubbles, cancelable })` then `dispatchEvent` on element.
- Listeners same as native events; `detail` carries payload.

**When to use:**

Widget signals parent; micro-frontend integration; legacy plugin hooks.

Micro-frontends, Web Components communication, legacy widget integration.

#### Common pitfalls

Typo in event name; forgetting `bubbles: true` for parent listeners; huge objects in `detail` causing retention.

**Pluses and minuses:**

| + | − |
|------|------|
| Decoupled pub/sub on DOM tree | Hard to trace vs explicit callbacks |
| Bubbles like native events | Overuse creates spaghetti |
| Works with Web Components | Not a state management solution |

| + | − |
|------|------|
| Decoupled components | Overuse creates hard-to-trace flows |
| Same bubbling/capture as native events | Not a replacement for state management |

**Examples:**

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

**Sources:** [MDN CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)

</details>

<a name="interview-practice"></a>

<details>
  <summary>Interview Practice</summary>

### Interview Practice

Questions from [0_interview.md](0_interview.md). Document → [3_js_browser.md](./3_js_browser.md#interview-practice).

### Question index

| Topic | Answer |
|-------|--------|
| Event bubbling/capturing | Q&A |
| Event delegation | Task |

---

## Questions & Answers

<details>
  <summary>Event bubbling and delegation?</summary>

### Event bubbling and delegation?

**Definition:** **Bubbling** — event propagates from target up to `window`. **Delegation** — one listener on ancestor handles events from descendants via `event.target`.

**How it works:**

1. Capture phase (optional): window → target.
2. Target phase: handlers on target.
3. Bubble phase (default): target → window.
4. Delegation: parent listens on bubble; checks `e.target.matches(selector)`.

**When to use:**

Dynamic list items — one `ul` listener; stopping propagation when overlay handles click; capture for early intercept.

#### Common pitfalls

`target` may be child inside `li` (use `closest`); `stopPropagation` breaks delegation above; assuming delegate on capture without `{ capture: true }`.

**Examples:**

```js
list.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li || !list.contains(li)) return;
  console.log(li.textContent);
});
```

See [Event phases](#event-phases) and [Event delegation](#event-delegation).

**Sources:** [javascript.info/event-delegation](https://learn.javascript.ru/event-delegation)

</details>

### Tasks

### Task 1 — Event delegation

List of `<li>` items — one click handler on `<ul>`, alert clicked item text.

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

<details>
  <summary>Junior — Front-end</summary>

### Junior — Front-end

45. Describe the event bubbling process in the DOM.

46. How do you stop event bubbling?

47. How do you prevent the default event action?

48. What is `this` in an event handler?

</details>

<details>
  <summary>Middle — Front-end</summary>

### Middle — Front-end

44. What is the key difference between `mouseleave` and `mouseout`?

45. In what order are DOM events processed (click, mouseover, etc.)? FIFO or LIFO?

46. What are event bubbling and event capturing?

47. Compare `stopPropagation` and `stopImmediatePropagation`.

</details>

</details>
