# JS Async APIs — Timers, fetch, and AbortController

Timers, `fetch` helpers, `AbortController`, `requestIdleCallback`, and JSON response parsing.

### Related docs

- [JS Event Loop](./3_js_async_event_loop.md) · [JS Async/Await](./3_js_async_await.md) · [JSON](./3_js_variables.md#json)
- [HTTP — Fetch & AbortController](./6_web_api_http.md#fetch-api-abortcontroller-and-formdata) · [JS Interview](./3_js_interview.md)

[← Back to JS hub](./3_js.md) · [Async hub](./3_js_async.md)

### Main concepts

| Area | Topics |
| ---- | ------ |
| **Browser** | Timers, `AbortController`, `requestIdleCallback` |
| **Data** | `res.json()` and JSON pointers |

### Sections

- [AbortController](#abortcontroller)
- [Related APIs](#related-apis)
- [Interview](./3_js_interview.md)


Each topic: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**.

---
<a name="abortcontroller"></a>

## AbortController

<details>
  <summary>AbortController</summary>

### AbortController

**Definition:** `AbortController` provides a `signal` to cancel `fetch` and other async operations.

**How it works:**

- `const ac = new AbortController();` — `ac.signal` is an `AbortSignal`.
- Pass `{ signal: ac.signal }` to `fetch` (and other APIs that support it).
- `ac.abort()` — aborts linked operations; `fetch` rejects with `AbortError`.
- `signal.aborted` and `signal.reason` check state.
- `AbortSignal.timeout(ms)` — shorthand for timeout abort (modern browsers/Node).
- Compose: one signal can abort multiple fetches; React cleanup calls `abort()` on unmount.

**When to use:**

| Situation           | Pattern                                     |
| ------------------- | ------------------------------------------- |
| User navigates away | `abort()` in `useEffect` cleanup            |
| Search debounce     | Abort previous request on new keystroke     |
| Request timeout     | `AbortSignal.timeout(5000)` or manual timer |
| Race winner         | Abort losers after `Promise.race`           |

#### Common pitfalls

- Treating `AbortError` as real failure — often expected on navigation.
- Not aborting on component unmount — setState on unmounted component warning.
- Single-use controller — create new one per request.

**Pluses and minuses:**

| +                                    | −                                                 |
| ------------------------------------ | ------------------------------------------------- |
| Cancels in-flight requests           | Not all APIs support `AbortSignal`                |
| Composable with timeouts             | Must wire signal into each call                   |
| Prevents stale responses updating UI | Aborted fetch still rejects — handle `AbortError` |
| Standard across fetch ecosystem      | Older libraries need manual cancellation          |

**Examples:**

```js
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const res = await fetch("/api/data", { signal: controller.signal });
  clearTimeout(timeout);
  const data = await res.json();
} catch (err) {
  if (err.name === "AbortError") console.log("Request aborted");
  else throw err;
}
```

**Thoughts:** Aborting stale search `fetch` reduces main-thread work and races — helps **INP**. [6_web_api.md — INP](./6_web_api_security.md#inp-interaction-to-next-paint).

**Sources:** [javascript.info/fetch-abort](https://javascript.info/fetch-abort) — full Fetch details in [HTTP — AbortController & FormData](./6_web_api_http.md#fetch-api-abortcontroller-and-formdata)

</details>

## Related APIs

<details>
  <summary>Timers</summary>

### Timers

**Definition:** `setTimeout` runs a callback once after a delay; `setInterval` repeats at a fixed interval. Both schedule **macrotasks**. `clearTimeout` / `clearInterval` cancel pending callbacks.

**How it works:**

- `setTimeout(fn, ms)` — minimum delay `ms`; actual delay ≥ `ms` (clamped to ~4ms in browsers when nested ≥5 deep).
- `setInterval(fn, ms)` — repeats until `clearInterval`; interval includes callback time — real gap between starts can shrink or stack.
- **Nested `setTimeout`** — schedule the next run at the **end** of the current one: guarantees a minimum pause between finishes; can adjust delay (backoff) per iteration.
- Return value is numeric ID (browser) or `Timeout` object (Node) — pass to `clear*`.
- Callback runs as macrotask — after current sync code and all microtasks.
- `setTimeout(fn, 0)` defers to next macrotask turn — not immediate.
- Scheduler holds a reference to the callback until it runs / is cleared — cancel unused timers to free closed-over memory.

| API                   | Behavior                                       |
| --------------------- | ---------------------------------------------- |
| `setTimeout(fn, ms)`  | Run once after `ms` (minimum ~4ms in browsers) |
| `setInterval(fn, ms)` | Repeat every `ms` until cleared                |
| Nested `setTimeout`   | Next tick planned after previous finishes      |
| `clearTimeout(id)`    | Cancel a `setTimeout`                          |
| `clearInterval(id)`   | Cancel a `setInterval`                         |

**When to use:**

| Use                   | Prefer instead                              |
| --------------------- | ------------------------------------------- |
| Debounce/throttle     | `requestAnimationFrame` for visual updates  |
| Delayed UI update     | `queueMicrotask` for before-next-macro      |
| Polling               | WebSocket/SSE for server push               |
| `sleep` in async code | `await new Promise(r => setTimeout(r, ms))` |

#### Common pitfalls

- `this` in timer callback — use arrow function or `.bind`.
- Forgetting `clearInterval` on SPA route change — leaks and stale updates.
- Assuming exact timing — event loop load adds jitter.
- Leftover `setInterval` (polling, autosave) regularly steals the main thread — worse for **INP** than a one-shot `setTimeout`. [6_web_api.md — INP](./6_web_api_security.md#inp-interaction-to-next-paint).

**Pluses and minuses:**

| +                                | −                                              |
| -------------------------------- | ---------------------------------------------- |
| Simple deferral and scheduling   | Not precise for animations (use `rAF`)         |
| Works everywhere                 | `setInterval` stacks up if handler is slow     |
| Good for debounce/throttle base  | Minimum delay clamping surprises nested timers |
| Macrotask — allows paint between | No cancellation of in-flight callback mid-run  |

**Examples:**

```js
const id = setTimeout(() => console.log("later"), 1000);
clearTimeout(id);

const interval = setInterval(() => tick(), 500);
clearInterval(interval);

// Nested setTimeout — delay between *ends*, optional backoff
let delay = 1000;
let timerId = setTimeout(function tick() {
  // work...
  delay = overloaded ? delay * 2 : 1000;
  timerId = setTimeout(tick, delay);
}, delay);

// Async sleep helper
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(1000);
```

**Sources:** [javascript.info/settimeout-setinterval](https://javascript.info/settimeout-setinterval)

</details>

<details>
  <summary>requestIdleCallback</summary>

### requestIdleCallback

**Definition:** Browser API that runs a callback during an **idle period** (after layout/paint work, when the event loop has spare time). It is **not** a Promise microtask and **not** `requestAnimationFrame`.

**How it works:**

- `requestIdleCallback(cb, { timeout })` — `cb` receives an `IdleDeadline`: `timeRemaining()` (ms left in this idle slice) and `didTimeout`.
- Yield when `timeRemaining()` hits ~0 so the browser can paint. If you pass `timeout`, the callback still runs when the deadline expires (`didTimeout === true`) even if the tab was busy — `timeRemaining()` is then ~0.
- Without `timeout`, a busy page **may never** call you.
- Not available in Node. Prefer `scheduler.yield()` / chunking work if you need wider support; rAF for visual frames.

**When to use:** Defer non-critical JS; contrast with rAF (must run before paint) and microtasks (run before the next macrotask **and** can delay paint if they never drain).

**Pluses and minuses:**

| +                                       | −                                                  |
| --------------------------------------- | -------------------------------------------------- |
| Low-priority work (analytics, prefetch) | Can starve without `timeout`                       |
| Cooperates with rendering               | Not a substitute for Web Workers on CPU-heavy jobs |

**Examples:**

```js
requestIdleCallback(
  (deadline) => {
    while (deadline.timeRemaining() > 0 && queue.length) {
      work(queue.pop());
    }
  },
  { timeout: 2000 },
);
```

**Thoughts:** _Idle work runs when the browser is not painting; a never-ending microtask queue never reaches idle or paint._

**Sources:** [MDN — requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) · [IdleDeadline](https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline)

</details>

<details>
  <summary>JSON</summary>

### JSON

**Definition:** Syntax, `stringify`/`parse`, and pitfalls: [JSON](./3_js_variables.md#json). Config comments → [YAML](./10_build_ci.md#yaml).

**How it works:** `await res.json()` parses the fetch body (same as `JSON.parse` on the text). Send with `JSON.stringify(body)` and `Content-Type: application/json`.

**Thoughts:** _Fetch delivers JSON text; Core JSON APIs turn it into values._

</details>

---

Interview Q&A and coding tasks live in [JS — Interview](./3_js_interview.md).

