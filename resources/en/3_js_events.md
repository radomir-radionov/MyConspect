# JS Browser — Events

Browser events: handlers, phases, delegation, and custom events.

[← Back to JS hub](./3_js.md)

### Related docs

* [Document](./3_js_browser.md) · [Browser additional](./3_js_browser_extra.md) · [JS Interview](./3_js_interview.md)
* [JS Core](./3_js_core.md) · [JS Functions](./3_js_functions.md) · [JS OOP](./3_js_oop.md) · [JS Async](./3_js_async.md)
* [HTML](./1_html.md) · [Web API](./6_web_api.md)

### Main concepts

| Area | Topics |
|------|--------|
| **Events** | Bubbling, capturing, delegation, default actions |
| **UI** | Mouse, pointer, keyboard, scroll |
| **Forms** | Focus, input/change, submit |
| **Custom** | `CustomEvent` and `detail` payloads |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [Events](#events)
- [Default actions](#default-actions)
- [Event phases](#event-phases)
- [Event handlers & delegation](#event-handlers-and-delegation)
- [Custom events](#custom-events)
- [UI events (mouse, pointer, keyboard)](#ui-events-mouse-pointer-keyboard)
- [Interview](./3_js_interview.md)

---

## Events

<details>
  <summary>Events</summary>

### Events

**Definition:** Browser UI is event-driven. An `EventTarget` (`Element`, `document`, `window`) receives named events; you subscribe with `addEventListener` and unsubscribe with `removeEventListener` using the **same function reference**.

**How it works:**

- `addEventListener(type, listener, options?)` — `type` is case-sensitive (`"click"`). The third argument may be `{ capture, once, passive }` or a boolean (`true` = capture).
- `once: true` removes the listener after the first call. `passive: true` promises the listener will not call `preventDefault()` (used for scroll/touch performance).
- Prefer `addEventListener` over `elem.onclick = ...` — assignment keeps only one handler and overwrites the previous one.
- `this` inside a classic-function listener is the element the listener is attached to (`currentTarget`). Arrow functions do not rebind `this`.

**When to use:** Clicks, input, submit, keyboard, load. Skip property handlers (`onclick`) when you need more than one listener or `{ once, capture, passive }`.

**Pluses and minuses:**

| + | − |
|------|------|
| Many listeners per type; options object | Must keep the same function to remove |
| Works on any `EventTarget` | Forgetting `removeEventListener` can leak |

**Examples:**

```js
function onSave(e) {
  console.log(e.type, e.currentTarget);
}

button.addEventListener("click", onSave);
button.addEventListener("click", onSave, { once: true });
button.removeEventListener("click", onSave);
```

**Thoughts:** One named function + `addEventListener`/`removeEventListener` is the interview-safe pattern.

**Sources:** [MDN EventTarget.addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) · [javascript.info/introduction-browser-events](https://javascript.info/introduction-browser-events)

</details>

<details>
  <summary>Default actions</summary>

### Default actions

**Definition:** Many events trigger a built-in browser action (link navigation, form submit, text selection, context menu). Cancel it with `event.preventDefault()` — or `return false` only from `on*` property/attribute handlers.

**How it works:**

- `preventDefault()` works if the event is `cancelable` and the listener is not `{ passive: true }`.
- `event.defaultPrevented` is `true` after cancel — prefer checking this over `stopPropagation()` so outer handlers (analytics, document menus) still see the event.
- `passive: true` tells the browser you will not cancel (smoother scroll/touch); default is often passive for `touchstart`/`touchmove` in Chrome/Firefox.
- Preventing an early event can suppress a follow-up (e.g. cancel `mousedown` → no focus).

**When to use:** Custom SPA links, form validation before submit, custom context menus, drag without native image drag.

**Examples:**

```js
menu.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;
  e.preventDefault();
  route(a.getAttribute("href"));
});

document.addEventListener("contextmenu", (e) => {
  if (e.defaultPrevented) return; // child already handled
  e.preventDefault();
  showDocMenu(e);
});
```

**Thoughts:** `stopPropagation` ≠ `preventDefault`. Cancel the default; let the event bubble unless you have a strong reason not to.

**Sources:** [javascript.info/default-browser-action](https://javascript.info/default-browser-action)

</details>

<details>
  <summary>Event phases</summary>

### Event phases

**Definition:** A DOM event travels in three phases: **capturing** (root → target), **at target**, then **bubbling** (target → root) when `event.bubbles` is true. `event.eventPhase` is `CAPTURING_PHASE` (1), `AT_TARGET` (2), or `BUBBLING_PHASE` (3).

**How it works:**

- Capture listeners run on the way **down** (`addEventListener(type, fn, true)` or `{ capture: true }`). Bubble listeners run on the way **up** (default).
- `event.target` is the node where the event started. `event.currentTarget` is the node whose listener is running now.
- `stopPropagation()` stops further capturing/bubbling. It does **not** cancel default actions — use `preventDefault()` (and the listener must not be `{ passive: true }`).
- `stopImmediatePropagation()` also skips remaining listeners on the **same** node.
- If `bubbles` is false, the flow ends after the target phase.

**When to use:** Capture for “run before children” (e.g. focus). `preventDefault()` on `submit`/`click` to override native behavior. Avoid `stopPropagation()` unless you must isolate a widget.

**Pluses and minuses:**

| + | − |
|------|------|
| One model for nested UI | `stopPropagation` hides bugs and breaks other listeners |
| `target` vs `currentTarget` is explicit | Capture + bubble on the same node can surprise |

**Examples:**

```js
parent.addEventListener("click", (e) => {
  // click child → target is child, currentTarget is parent
  console.log(e.target.id, e.currentTarget.id, e.eventPhase);
});

link.addEventListener("click", (e) => {
  e.preventDefault(); // stay on the page
});

inner.addEventListener("click", (e) => e.stopPropagation());
```

**Thoughts:** Default is bubble. Capture is the exception you name in the third argument.

**Sources:** [MDN Event.eventPhase](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase) · [MDN Event.stopPropagation](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) · [javascript.info/bubbling-and-capturing](https://javascript.info/bubbling-and-capturing)

</details>

<details>
  <summary>Event handlers & delegation</summary>

### Event handlers & delegation

**Definition:** **Delegation** attaches **one** listener to a common ancestor. Inside the handler, `event.target` is the origin node; `event.currentTarget` is the ancestor. Use `closest(selector)` so clicks on inner text/icons still match the intended control.

**How it works:**

- Bubbling delivers child events to the parent, so dynamically added children are handled without re-binding.
- Check the real control: `const item = e.target.closest("li[data-id]")`. If `!item` or `!e.currentTarget.contains(item)`, ignore.
- Do not style `e.target` blindly — it may be a nested `<span>`, not the `<li>`.
- Pair with `data-*` attributes for ids instead of inline `onclick`.

**When to use:** Lists, tables, menus, any UI that adds/removes rows. Direct listeners on each row when the set is small and static.

**Pluses and minuses:**

| + | − |
|------|------|
| One listener; works for future nodes | Need `closest` / ignore unmatched clicks |
| Less memory than N row listeners | Nested widgets may need `stopPropagation` |

**Examples:**

```js
list.addEventListener("click", (e) => {
  const item = e.target.closest("li[data-id]");
  if (!item || !list.contains(item)) return;
  item.remove();
});
```

**Thoughts:** Interview answer: “listen on the parent, identify the child with `closest`.”

**See also:** [DOM navigation — `closest`](./3_js_browser.md#dom-navigation)

**Sources:** [MDN Event.target](https://developer.mozilla.org/en-US/docs/Web/API/Event/target) · [MDN Event.currentTarget](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget) · [javascript.info/event-delegation](https://javascript.info/event-delegation)

</details>

<details>
  <summary>Custom events</summary>

### Custom events

**Definition:** `CustomEvent` is an `Event` you create and `dispatchEvent` yourself. The optional `detail` payload is any value (often an object) read as `event.detail`.

**How it works:**

- `new CustomEvent(type, { detail, bubbles, cancelable, composed })`. Event names are case-sensitive.
- `dispatchEvent` runs listeners **synchronously** with the same capturing/bubbling rules as native events.
- Default `bubbles` is `false` — ancestors will not hear it unless you set `bubbles: true`.
- `composed: true` lets the event cross shadow DOM (web components).

**When to use:** Decouple widgets (`"cart:add"`, `"modal:close"`) without a global event bus. Skip for app-wide state — a store or callback is clearer.

**Pluses and minuses:**

| + | − |
|------|------|
| Same DOM event machinery | Silent if `bubbles` is false and you listen on a parent |
| `detail` carries structured data | Easy to overuse vs explicit function calls |

**Examples:**

```js
item.addEventListener("cart:add", (e) => {
  console.log(e.detail.id);
});

item.dispatchEvent(
  new CustomEvent("cart:add", {
    bubbles: true,
    detail: { id: "sku-1" },
  }),
);
```

**Thoughts:** Custom events are for **DOM components**, not a replacement for application state.

**Sources:** [MDN CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) · [MDN dispatchEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent) · [javascript.info/dispatch-events](https://javascript.info/dispatch-events)

</details>

<a name="ui-events-mouse-pointer-keyboard"></a>

<details>
  <summary>UI events (mouse, pointer, keyboard)</summary>

### UI events (mouse, pointer, keyboard)

**Definition:** Pointer-like input and keyboard hotkeys use dedicated event families. Prefer **Pointer Events** for new UI that must work with mouse, touch, and pen; use keyboard events for shortcuts (not for tracking field text — use `input`).

**How it works:**

**Mouse (basics):** `mousedown` → `mouseup` → `click` (left). Also `dblclick`, `contextmenu`, `mousemove`, `mouseover`/`mouseout` (bubble, relatedTarget), `mouseenter`/`mouseleave` (no bubble, no enter/leave for children). Modifiers: `ctrlKey` / `metaKey` (Mac Cmd) / `shiftKey` / `altKey`. Coords: `clientX/Y` (viewport), `pageX/Y` (document). `event.button`: 0 left, 1 middle, 2 right.

**mouseover vs mouseenter:** `mouseover`/`mouseout` fire when crossing child boundaries (lots of noise). `mouseenter`/`mouseleave` fire once for the element as a whole — better for “hover this card”.

**Drag with mouse/pointer:** `pointerdown` → document `pointermove` → `pointerup`; remember `shiftX/Y` from pointer to element corner; cancel native image drag (`ondragstart = () => false`) and set `touch-action: none` to avoid `pointercancel`. Find droppables with `document.elementFromPoint` (hide the dragged element first). Prefer `setPointerCapture(pointerId)` so moves stay on the thumb without document listeners.

**Pointer extras:** `pointerId`, `pointerType` (`"mouse"|"pen"|"touch"`), `isPrimary` (first finger). Same names as mouse (`pointerdown` …).

**Keyboard:** `keydown` / `keyup`. `event.key` = character/meaning (`"z"`, `"Enter"`); `event.code` = physical key (`"KeyZ"`) — layout-independent for hotkeys. Auto-repeat sets `event.repeat`. Filter hotkeys with `code` + `ctrlKey || metaKey`. Do **not** use keyboard alone to validate text fields — paste/speech skip keys; use `input`.

**Scroll:** `scroll` fires *after* scrolling — cannot `preventDefault` there; freeze with CSS `overflow: hidden` or cancel the causing key (`PageDown`). Geometry helpers: [Element and window dimensions & scroll](./3_js_browser_extra.md#element-and-window-dimensions--scroll).

**When to use:** Hotkeys → `keydown` + `code`. Hover tooltips → `mouseenter`/`mouseleave` or pointer equivalents. Sliders/drag → pointer + capture. Field value → `input` (see [forms](./3_js_browser.md#text-forms-and-dialogs)).

**Pluses and minuses:**

| + | − |
|------|------|
| Pointer unifies mouse/touch/pen | Must handle `pointercancel` / native drag |
| Delegation works for dynamic lists | `mouseover` floods with child events |
| `code` stable for shortcuts | Mobile IME may report `key = "Unidentified"` |

**Examples:**

```js
document.addEventListener("keydown", (e) => {
  if (e.code === "KeyZ" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    undo();
  }
});

thumb.onpointerdown = (e) => {
  thumb.setPointerCapture(e.pointerId);
  thumb.onpointermove = (ev) => {
    thumb.style.left = `${ev.clientX - slider.getBoundingClientRect().left}px`;
  };
  thumb.onpointerup = () => {
    thumb.onpointermove = null;
  };
};
```

**Thoughts:** Interview path: bubbling → delegation → pointer capture for drag → `preventDefault` for defaults.

**Sources:** [javascript.info/mouse-events-basics](https://javascript.info/mouse-events-basics) · [javascript.info/mousemove-mouseover-mouseout-mouseenter-mouseleave](https://javascript.info/mousemove-mouseover-mouseout-mouseenter-mouseleave) · [javascript.info/mouse-drag-and-drop](https://javascript.info/mouse-drag-and-drop) · [javascript.info/pointer-events](https://javascript.info/pointer-events) · [javascript.info/keyboard-events](https://javascript.info/keyboard-events) · [javascript.info/onscroll](https://javascript.info/onscroll)

</details>

---

Interview Q&A and coding tasks live in [JS — Interview](./3_js_interview.md).
