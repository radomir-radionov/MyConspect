# JS Async — Event Loop, Promises & Practice

Covers asynchronous JavaScript: event loop, timers, promises, `async/await`, and interview practice.

### Related docs

* [JS Core](./3_js_core.md) · [Memory: stack and heap](./3_js_core.md#memory-stack-heap) · [JSON](./3_js_core.md#json) · [JS OOP](./3_js_oop.md) · [JS Browser](./3_js_browser.md)
* [Web API](./6_web_api.md) · [CORS](./6_web_api.md#cors) · [INP](./6_web_api.md#inp-interaction-to-next-paint) · [Node.js](./8_nodejs.md) · [React](./4_react.md) · [YAML](./10_build.md#yaml)
* [Jest — mock `fetch`](./7_special.md#jest--first-tests-node-vs-jsdom)

[← Back to JS hub](./3_js.md)

### Main concepts

| Area | Topics |
|------|--------|
| **Runtime** | Call stack, microtasks, macrotasks, render queue |
| **Patterns** | Callbacks, promises, `async/await`, iterators |
| **APIs** | Timers, fetch JSON bodies, AbortController, `queueMicrotask` |
| **Practice** | Output tasks, interview Q&A |

### Sections

- [Event loop](#event-loop)
- [Callbacks & async patterns](#callbacks-async-patterns)
- [Promises](#promises)
- [Async / await](#async-await)
- [Related APIs](#related-apis)
- [queueMicrotask & process.nextTick](#queuemicrotask-processnexttick)
- [Unhandled promise rejections](#unhandled-promise-rejections)
- [Top-level await](#top-level-await)
- [Promise.withResolvers](#promisewithresolvers)
- [Practice](#practice)
- [Interview Practice](#interview-practice)

Each topic: **Definition** · **How it works** · **Cases** · **Pros/Cons** · **Examples**

### Event loop

**Definition:** JavaScript is single-threaded; the event loop moves callbacks from task queues to the call stack when the stack is empty.

**How it works:** The running script is a **task**. When it finishes, the engine runs a **microtask checkpoint** (drain the entire microtask queue, including microtasks those callbacks enqueue). Then it takes **one** task (`setTimeout`, I/O, UI event). Browsers may render between tasks. Infinite microtasks never return to the browser — paint and timers starve.

| Pros | Cons |
|------|------|
| No race conditions on shared memory | CPU-bound code blocks UI |
| Predictable ordering with microtasks | Easy to starve rendering with infinite microtasks |

**Cases:** Debug `setTimeout(0)` vs `Promise.resolve().then()` ordering, UI freezes, promise chains.

**Execution order:** current task (sync) → all microtasks → next task (macrotask) → (possibly render) → repeat.

**Example:**

<details>
  <summary>Code</summary>

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// 1, 4, 3, 2
```

</details>

**Common pitfalls:** Treating `setTimeout(fn, 0)` as “next line.” Recursive `queueMicrotask` / `.then` loops. Confusing Node `process.nextTick` (before promise microtasks) with the browser.

**Key idea:** After every task, empty the microtask queue before the next timer or paint.

**Notes:** `MutationObserver` and promise callbacks are microtasks. Node `process.nextTick` runs before other microtasks.

**Source:** [javascript.info/event-loop](https://learn.javascript.ru/event-loop) · [MDN microtask guide](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)

### Promises

**Definition:** A Promise represents a future value; states: `pending` → `fulfilled` or `rejected`. `.then` handlers run as microtasks.

| Pros | Cons |
|------|------|
| Composable chains, clear error propagation | Verbose vs `async/await` |
| `Promise.all` for parallelism | `.then` throw skips to outer `.catch` only |

**When to use:** Parallel requests (`Promise.all`), library APIs, wrapping callbacks.

**When NOT to use:** Sequential logic — prefer `async/await` for readability.

**Example:**

<details>
  <summary>Code</summary>

```js
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

await delay(100);
const [a, b] = await Promise.all([fetch('/a'), fetch('/b')]);
```

</details>

**Notes:** Errors thrown inside `.then` reject the chain. Always return promises from `.then` or use `async` handlers.

**Source:** [javascript.info/promise-basics](https://learn.javascript.ru/promise-basics)

### async/await

**Definition:** `async` functions always return a Promise; `await` pauses within the function until a Promise settles.

| Pros | Cons |
|------|------|
| Readable sequential async code | Easy to forget `await` |
| `try/catch` for errors | Sequential awaits are slower than `Promise.all` |

**When to use:** Default for async logic in modern codebases.

**When NOT to use:** Independent parallel requests — use `Promise.all([a(), b()])`, not sequential `await`.

**Example:**

<details>
  <summary>Code</summary>

```js
async function fetchUserPosts(userId) {
  try {
    const [user, posts] = await Promise.all([
      fetch(`/api/users/${userId}`).then(r => r.json()),
      fetch(`/api/users/${userId}/posts`).then(r => r.json()),
    ]);
    return { user, posts };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
```

</details>

**Notes:** Stale closures in React `useEffect` — see [4_react.md](./4_react.md).

**Source:** [javascript.info/async-await](https://learn.javascript.ru/async-await)

---

<a name="event-loop"></a>

## Event loop

<details>
  <summary>Event loop overview</summary>

### Event loop

**Definition:** The event loop is a scheduler that watches the call stack and task queues. When the stack is empty, it takes the next task from a queue and pushes it onto the stack for execution.

**How it works:**

- JavaScript runs **synchronously** on a **single thread** — only one call stack frame executes at a time.
- Long-running work (timers, I/O, network) is delegated to the host (browser Web APIs or Node libuv).
- When async work completes, its callback is placed in a **task queue** (microtask or macrotask).
- The event loop repeatedly: drain sync code → drain all microtasks → run one macrotask → (browser: maybe render) → repeat.
- The stack must be empty before any queued callback runs.

| Part | Role |
|------|------|
| **Call stack** | Runs synchronous function calls (LIFO) |
| **Web APIs / Node APIs** | Timers, I/O, DOM events, `fetch` |
| **Task queues** | Hold callbacks ready to run |

| Pros | Cons |
|------|------|
| Simple concurrency model — no locks on JS heap | CPU-heavy sync code blocks everything |
| Microtasks give predictable promise ordering | Infinite microtasks starve macrotasks and rendering |
| Works identically in browser and Node (mostly) | Node has extra `process.nextTick` priority |

**Cases:**

| Situation | What to check |
|-----------|---------------|
| `setTimeout(fn, 0)` not immediate | Callback waits for stack + microtasks |
| UI freeze | Long sync loop on main thread |
| Promise vs timer order | Microtasks always before next macrotask |
| Debugging async flow | Use [JSV9000](https://www.jsv9000.app/) or [Loupe](http://latentflip.com/loupe/) |

**Example:**

<details>
  <summary>Code</summary>

```js
console.log('sync');
setTimeout(() => console.log('macrotask'), 0);
Promise.resolve().then(() => console.log('microtask'));
// sync → microtask → macrotask
```

</details>

**Common pitfalls:**

- Assuming `setTimeout(fn, 0)` runs right after the current line — microtasks run first.
- Scheduling unbounded `Promise.resolve().then(...)` chains — blocks rendering and timers.
- Confusing browser event loop with Node phases — see [8_nodejs.md](./8_nodejs.md).

**Source:** [javascript.info/event-loop](https://learn.javascript.ru/event-loop) · [JSV9000 visualizer](https://www.jsv9000.app/) · [Loupe](http://latentflip.com/loupe/)

</details>

<details>
  <summary>Call stack</summary>

### Call stack

**Definition:** A LIFO data structure that tracks active function calls and their execution contexts. All JavaScript application code runs through the call stack.

**How it works:**

- Each function call **pushes** a new execution context onto the stack.
- When a function **returns**, its context is **popped** off.
- Nested calls build a stack: `main()` → `foo()` → `bar()`.
- Each context has: variable environment, scope chain, `this` binding, and (for generators) state.
- Stack overflow (`Maximum call stack size exceeded`) happens when recursion never returns or depth exceeds engine limit (~10k–50k frames). OS/process memory model (virtual pages, heap vs stack): [Memory: stack and heap](./3_js_core.md#memory-stack-heap).

| Stage | What happens |
|-------|----------------|
| **Creation** | Allocate memory, build scope chain, bind `this` |
| **Execution** | Run function body; nested calls push onto stack |
| **Teardown** | Pop context when function returns |

| Pros | Cons |
|------|------|
| Simple mental model for sync flow | Deep recursion can overflow |
| Stack traces map directly to call order | No parallel JS execution on one thread |
| Fast push/pop for function calls | Async callbacks run later — not on the same stack frame |

**Cases:**

| Situation | Implication |
|-----------|---------------|
| Reading stack traces | Top = current function, bottom = entry point |
| Recursion | Must have base case or use trampoline/iteration |
| `async` functions | `await` suspends function but does not block the stack — continuation runs as microtask |
| Event handlers | Each invocation gets a fresh stack frame |

**Example:**

<details>
  <summary>Code</summary>

```js
function greet(name) {
  console.log('Hello, ' + name + '!');
}

function main() {
  greet('Alice');
  greet('Bob');
}

main();
// Stack: main → greet('Alice') → pop → greet('Bob') → pop → pop
```

</details>

**Common pitfalls:**

- Expecting `async`/`await` to block the thread — only that function pauses; other code keeps running.
- Infinite recursion without tail-call optimization in JS (not guaranteed) — stack overflow.

**Source:** [javascript.info/call-stack](https://learn.javascript.ru/call-stack)

</details>

<details>
  <summary>Microtasks vs macrotasks</summary>

### Microtasks vs macrotasks

**Definition:** Asynchronous work is scheduled in two queue types. **Microtasks** run after the current sync code and before the next macrotask. **Macrotasks** run one at a time per event-loop turn.

**How it works:**

- After sync code finishes and the stack is empty, the engine drains the **entire microtask queue**.
- Each microtask can enqueue more microtasks — all run in the same turn before any macrotask.
- Then **one** macrotask runs (timer, I/O callback, UI event).
- Browser may paint between macrotasks; microtasks can delay paint.
- Node adds `process.nextTick` — runs before other microtasks (higher priority).

| Type | Examples | Priority |
|------|----------|----------|
| **Microtask** | `Promise.then/catch/finally`, `queueMicrotask`, `MutationObserver`, `async/await` continuations | Higher — drain all before next macrotask |
| **Macrotask** | `setTimeout`, `setInterval`, I/O, UI events, `message` event | Lower — one per loop iteration |

| Pros | Cons |
|------|------|
| Microtasks batch promise reactions efficiently | Long microtask chains block timers and UI |
| Macrotasks yield to rendering (browser) | Harder to reason about mixed timer/promise code |
| Clear priority: promises before `setTimeout` | Node `nextTick` can starve I/O if abused |

**Cases:**

| Use microtasks | Use macrotasks |
|----------------|----------------|
| Promise reactions, `queueMicrotask` | Timers, user events, I/O completion |
| DOM observation (`MutationObserver`) | Debounced UI updates (often `setTimeout`) |
| Breaking up sync work without blocking paint | Animation frames (`requestAnimationFrame` — separate queue) |

**Example:**

<details>
  <summary>Code</summary>

```js
Promise.resolve().then(() => console.log('micro 1'));
Promise.resolve().then(() => console.log('micro 2'));
setTimeout(() => console.log('macro'), 0);
// micro 1, micro 2, macro
```

</details>

**Common pitfalls:**

- `requestAnimationFrame` is **not** a microtask — runs before paint, separate from both queues.
- Recursive `queueMicrotask` or promise chains — can freeze the page.
- Assuming `setInterval` fires exactly on interval — delayed if main thread is busy.

**Source:** [MDN queueMicrotask](https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask) · [MDN MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)

</details>

<details>
  <summary>Execution order & browser queues</summary>

### Execution order

**Definition:** One event-loop iteration follows a fixed order: run sync code until the stack is empty, drain **all** microtasks, run **one** macrotask, then optionally render a frame (browser).

**How it works:**

- Sync code always runs first — top to bottom until stack empty.
- All pending microtasks run — including ones scheduled by earlier microtasks in the same turn.
- Exactly **one** macrotask runs per iteration (unless browser batches).
- Browser: after macrotask, may run **render steps** (style, layout, paint) if enough time passed (~16ms for 60fps).
- Loop repeats until all queues are empty and no new work arrives.

**Rules:**

- Sync code always runs first.
- All pending microtasks run before the next macrotask.
- A microtask that schedules another microtask — the new one also runs in the same turn.
- Browser may have separate render queues between macrotasks.

| Pros | Cons |
|------|------|
| Deterministic ordering for interview puzzles | Real apps mix many sources — hard to trace |
| Microtasks keep promise chains atomic per turn | Render can be delayed by microtask storms |
| One macrotask per turn allows paint opportunities | Order differs slightly in Node vs browser |

**Cases:**

| Situation | Expected behavior |
|-----------|-------------------|
| Async output puzzles | Trace: sync → microtasks → one macro |
| Batch DOM reads/writes | Read in sync, write after microtasks or in `requestAnimationFrame` |
| `Promise.then` inside `setTimeout` | Macro runs first, then its microtasks |
| Performance tuning | Keep microtask queues short |

**Example:**

<details>
  <summary>Code</summary>

```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
Promise.resolve().then(() => setTimeout(() => console.log(4)));
Promise.resolve().then(() => console.log(5));
setTimeout(() => console.log(6), 0);
console.log(7);
// 1, 7, 3, 5, 2, 6, 4
```

</details>

**Common pitfalls:**

- Forgetting that `setTimeout` inside a microtask still schedules a **future** macrotask (4 runs after 2 and 6).
- `new Promise(executor)` runs the executor **synchronously** — only `.then` is async.

**Source:** [javascript.info/event-loop](https://learn.javascript.ru/event-loop)

</details>

<a name="callbacks-async-patterns"></a>

## Callbacks & async patterns

<details>
  <summary>Sync vs async execution</summary>

### Sync vs async execution

**Definition:** **Synchronous** code runs in the main thread one step at a time — the next line waits for the previous to finish. **Asynchronous** code schedules work to complete later without blocking the main thread.

**How it works:**

- Sync: call stack runs each statement; function calls block until return.
- Async: host API starts work; JS continues; callback/promise runs later via queues.
- `async/await` is syntactic sugar — still single-threaded, still queue-based.
- Completion order of async tasks is **not** guaranteed to match start order (except within one chain).

| | Sync | Async |
|---|------|-------|
| **Blocking** | Yes — holds the thread | No — callback/promise runs later |
| **Examples** | `console.log`, arithmetic | `setTimeout`, `fetch`, `fs.readFile` |
| **Ordering** | Strict top-to-bottom | Completion order depends on queues |

| Pros | Cons |
|------|------|
| Sync: simple reasoning, immediate results | Sync I/O blocks UI and server throughput |
| Async: responsive UI, concurrent I/O | Harder debugging, callback/promise complexity |
| Mix both in same app | Easy to accidentally block with sync work |

**Cases:**

| Use sync | Use async |
|----------|-----------|
| Pure computation, local data transforms | Network, filesystem, timers |
| Short DOM reads in event handler | Long operations, multi-step I/O |
| Validation before async call | Anything that should not freeze the UI |

**Example:**

<details>
  <summary>Code</summary>

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
console.log('C');
// A, C, B
```

</details>

**Common pitfalls:**

- Treating `fetch` as sync — it returns a Promise immediately; body is async.
- `fs.readFileSync` in Node on main thread — blocks entire process.

**Source:** [javascript.info/intro](https://learn.javascript.ru/intro)

</details>

<details>
  <summary>Callbacks</summary>

### Callbacks

**Definition:** A function passed as an argument to be invoked when an async operation completes — the original JavaScript async pattern.

**How it works:**

- Caller passes `callback(err, result)` or `onSuccess` / `onError` to an API.
- When async work finishes, the host invokes the callback via the event loop.
- Nested callbacks create pyramids ("callback hell") when steps depend on each other.
- Error-first convention in Node: `(err, data) => { if (err) ... }`.
- No built-in composition — manual wiring for sequential and parallel flows.

| Pros | Cons |
|------|------|
| Simple, universal | Callback hell with nested logic |
| No extra types | Hard to compose and handle errors |
| Works in all environments | Inversion of control — caller loses flow |
| Fine for one-shot events | Parallel + error handling gets verbose |

**Cases:**

| Use callbacks | Prefer promises/`async` |
|---------------|-------------------------|
| Event listeners (`on('click', fn)`) | Multi-step request pipelines |
| Legacy Node APIs | New application code |
| Simple `setTimeout` delays | Parallel fetches with error aggregation |
| Libraries that expose callback API | Need `try/catch` style errors |

**Example:**

<details>
  <summary>Code</summary>

```js
function loadData(url, onSuccess, onError) {
  fetch(url)
    .then(r => r.json())
    .then(onSuccess)
    .catch(onError);
}

// Error-first (Node style)
fs.readFile('file.txt', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
```

</details>

**Common pitfalls:**

- Forgetting to handle errors — silent failures.
- Callback called twice — guard with a flag or promisify.
- `forEach` with async callbacks — does not await; use `for...of` or `Promise.all`.

**Source:** [javascript.info/callbacks](https://learn.javascript.ru/callbacks)

</details>

<details>
  <summary>Side effects</summary>

### Side effects

**Definition:** Operations that interact with the outside world — network, filesystem, DOM, timers, or logging — as opposed to pure computation on local data.

**How it works:**

- Pure functions: same input → same output, no external reads/writes.
- Side effects: mutate global state, touch DOM, call APIs, write files, `console.log`.
- Async side effects complete later — must be awaited or handled in `.then`.
- In React, side effects belong in `useEffect` or event handlers, not render.
- Tests mock side effects (fetch, timers) to keep units isolated. Jest: stub `global.fetch` to a `{ json }` Response — [Jest first tests](./7_special.md#jest--first-tests-node-vs-jsdom). Stub vs mock vs spy: [Test doubles](./7_special.md#test-doubles-stubs-mocks-spies).

**Common async side effects:**

| Operation | Example |
|-----------|---------|
| API call | `fetch('/api')` |
| DOM mutation | `element.textContent = '...'` |
| Timer | `Date.now()`, `setTimeout` |
| Logging | `console.log` |

| Pros | Cons |
|------|------|
| Side effects are how apps do real work | Harder to test and reason about |
| Async effects keep UI responsive | Race conditions if order not managed |
| Clear separation in well-structured code | Easy to scatter effects across codebase |

**Cases:**

| Situation | Approach |
|-----------|----------|
| Identify what to `await` | Network, DB, file I/O |
| Unit tests | Mock `fetch` (`jest.fn` / Vitest `vi.fn`), fake timers (`vi.useFakeTimers`) — [Test doubles](./7_special.md#test-doubles-stubs-mocks-spies) |
| React data loading | `useEffect` + cleanup (`AbortController`) |
| Redux/reducers | Keep reducers pure — effects in thunks/sagas |

**Example:**

<details>
  <summary>Code</summary>

```js
async function refreshUI() {
  const data = await fetch('/api/user').then(r => r.json()); // side effect: network
  document.title = data.name; // side effect: DOM
}
```

</details>

**Common pitfalls:**

- Fire-and-forget `fetch` without error handling.
- Stale closure reading old state after async gap — common in React `useEffect`.
- Multiple concurrent effects updating same DOM — race to last write wins.

**Source:** [javascript.info/intro](https://learn.javascript.ru/intro)

</details>

<details>
  <summary>AJAX</summary>

### AJAX

**Definition:** **Asynchronous JavaScript and XML** — a pattern for requesting server data without a full page reload. Modern code uses `fetch` or `XMLHttpRequest`.

**How it works:**

- Browser sends HTTP in the background (`XMLHttpRequest` or `fetch`).
- **Early AJAX:** server often returned an **HTML fragment**; JS inserted it — no full reload, API still coupled to markup.
- **Today:** payload is usually **JSON**; the client renders. `fetch` returns a Promise; XHR uses `onload` / `onerror`.
- CORS, cookies, and auth headers apply — see [Web API — CORS](./6_web_api.md#cors).

| Pros | Cons |
|------|------|
| Responsive SPAs | Error handling and caching complexity |
| Partial updates | CORS and auth concerns |
| Better UX than full page reloads | SEO/hydration concerns without SSR |
| Standard `fetch` API in modern browsers | XHR legacy APIs still in old code |

**Cases:**

| Use AJAX/`fetch` | Consider alternatives |
|------------------|----------------------|
| Dynamic data loading | Static content — SSR/SSG |
| Form submit without reload | WebSockets for push streams |
| Search autocomplete | Server-Sent Events for one-way push |
| Dashboard polling | WebSocket or SSE for real-time |

**Example:**

<details>
  <summary>Code</summary>

```js
const res = await fetch('/api/items');
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const items = await res.json();
```

</details>

**Common pitfalls:**

- Forgetting `res.ok` check — `fetch` does not reject on 404/500.
- No timeout by default — wrap with `AbortController`.
- Parsing JSON before checking status.

**Source:** [MDN AJAX](https://developer.mozilla.org/en-US/docs/Glossary/AJAX) · [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) · history: [6_web_api.md — Evolution](./6_web_api.md#evolution-of-web-apps)

</details>

<details>
  <summary>Callback vs Promise vs async/await</summary>

### Callback vs Promise vs async/await

**Definition:** Three layers of async abstraction — from manual callbacks to composable promises to synchronous-looking `async/await` syntax.

**How it works:**

- **Callbacks:** pass functions; callee invokes when done. Manual error propagation.
- **Promises:** object with `.then`/`.catch`; chainable; errors bubble to nearest `.catch`.
- **async/await:** `async` function returns Promise; `await` unwraps it; `try/catch` for errors.
- All three compile down to the same event-loop queues — syntax sugar, not new concurrency.
- Promises and `async/await` interoperate — `await` works on any thenable.

| Pattern | Pros | Cons |
|---------|------|------|
| Callback | Simple, universal | Callback hell, weak error handling |
| Promise | Composable, chainable | Verbose for sequential logic |
| async/await | Readable, `try/catch` | Easy sequential trap; needs `Promise.all` for parallelism |

**Cases:**

| Pattern | Best for |
|---------|----------|
| Callbacks | DOM events, legacy APIs, `EventEmitter` |
| Promises | Parallel batches (`Promise.all`), library APIs |
| async/await | Default for sequential application logic |

**Example:**

<details>
  <summary>Code</summary>

```js
// Promise chain
getUser(id)
  .then(user => getPosts(user.id))
  .then(posts => render(posts))
  .catch(console.error);

// async/await equivalent
try {
  const user = await getUser(id);
  const posts = await getPosts(user.id);
  render(posts);
} catch (err) {
  console.error(err);
}
```

</details>

**Common pitfalls:**

- Mixing callbacks and promises without promisifying — double error paths.
- `async` function without `await` still returns Promise — easy to forget `await` on call site.
- Sequential `await` in loop when `Promise.all` would work.

**Source:** [javascript.info/async](https://learn.javascript.ru/async)

</details>

<a name="promises"></a>

## Promises

<details>
  <summary>Promise basics</summary>

### Promise

**Definition:** A Promise is an object representing the eventual result of an async operation. It is always in one of three states: `pending`, `fulfilled`, or `rejected`. Once settled, the state cannot change.

**How it works:**

- Created with `new Promise((resolve, reject) => { ... })` or static helpers (`Promise.resolve`, etc.).
- Executor runs **synchronously**; `resolve`/`reject` settle the promise once (ignored if called again).
- `.then(onFulfilled, onRejected)` schedules handlers as **microtasks** when promise settles.
- `.catch(fn)` is `.then(undefined, fn)` — catches rejections and throws in prior `.then`.
- `.finally(fn)` runs on settle regardless of outcome; does not receive value; returns new promise.
- `await` and `.then` return chained promises.

| Method | Purpose |
|--------|---------|
| `.then(onFulfilled, onRejected)` | Handle success or failure |
| `.catch(onRejected)` | Handle rejection |
| `.finally(onFinally)` | Run cleanup regardless of outcome |

| Pros | Cons |
|------|------|
| Composable chains | Verbose vs `async/await` |
| Clear settled state machine | Executor errors need outer `try/catch` or `.catch` on returned promise |
| `Promise.all` for parallelism | Forgetting `return` in `.then` breaks chain |
| Universal interop (`thenable`) | `.then` second arg rarely used — prefer `.catch` |

**Cases:**

| Use promises | Use `async/await` instead |
|--------------|---------------------------|
| Wrapping callback APIs | Sequential business logic |
| Library public APIs | `try/catch` error blocks |
| Parallel `Promise.all` batches | Readable control flow |
| When you need `.finally` cleanup | Loops with conditionals |

**Example:**

<details>
  <summary>Code</summary>

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("I'm a Promise!"), 500);
});

promise
  .then(value => console.log(value))
  .catch(err => console.error(err))
  .finally(() => console.log('done'));
```

</details>

**Common pitfalls:**

- Not returning promise from `.then` — next `.then` gets `undefined`.
- Using second arg of `.then` instead of `.catch` — misses throws in fulfillment handler.
- `new Promise` anti-pattern when value already exists — use `Promise.resolve(x)`.

**Source:** [MDN Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) · [javascript.info/promise-basics](https://learn.javascript.ru/promise-basics)

</details>

<details>
  <summary>Promise states & chaining</summary>

### Promise states & chaining

**Definition:** A promise follows strict rules: it must expose a `.then` method; it starts `pending` and settles once to `fulfilled` or `rejected`; the settled value is immutable.

**How it works:**

- **pending** → operation in progress; handlers queued until settle.
- **fulfilled** → `resolve(value)` called; `.then` handlers receive `value`.
- **rejected** → `reject(reason)` or throw in executor; `.catch` handlers receive `reason`.
- Each `.then`/`.catch`/`.finally` returns a **new** promise — enables chaining.
- Return value from handler becomes fulfillment of next promise; thrown error becomes rejection.
- Returning a promise from handler **flattens** — next promise waits for it.

| State | Meaning |
|-------|---------|
| `pending` | Initial; operation in progress |
| `fulfilled` | Completed successfully |
| `rejected` | Failed with a reason |

| Pros | Cons |
|------|------|
| Immutable settled value — safe to pass around | Cannot cancel native Promise (use `AbortSignal`) |
| Chain encodes pipeline clearly | Long chains hard to debug without labels |
| Errors propagate to nearest `.catch` | Swallowed errors if `.catch` missing at end |

**Cases:**

| Situation | Pattern |
|-----------|---------|
| Multi-step dependent requests | `.then` chain or sequential `await` |
| Transform result per step | `return` mapped value from each `.then` |
| Recover from error | `.catch(() => fallback)` then continue chain |
| Stop chain on error | Let rejection propagate — no recovery `.catch` |

**Example:**

<details>
  <summary>Code</summary>

```js
Promise.resolve(1)
  .then(x => x + 1)
  .then(x => { throw new Error('fail'); })
  .catch(() => 42)
  .then(console.log);
// 42
```

</details>

**Common pitfalls:**

- Throwing in `.then` without `.catch` — unhandled rejection.
- `async` handler in `.then` returns Promise — must return it explicitly if nested.
- Assuming `.then` runs immediately — always microtask after current sync code.

**Source:** [javascript.info/promise-chaining](https://learn.javascript.ru/promise-chaining)

</details>

<details>
  <summary>Promise static methods</summary>

### Promise static methods

**Definition:** Class methods to run multiple promises with different completion semantics.

**How it works:**

- `Promise.all(iterable)` — waits for all; rejects on first rejection; results in order.
- `Promise.allSettled(iterable)` — waits for all; never rejects; `{ status, value|reason }[]`.
- `Promise.race(iterable)` — settles when **first** promise settles (fulfill or reject).
- `Promise.any(iterable)` — fulfills on first success; rejects `AggregateError` if all fail.
- Non-promise elements wrapped with `Promise.resolve`.
- Empty iterable: `all` → `[]`, `race` → pending forever, `any` → `AggregateError`.

| Method | Resolves when | Rejects when |
|--------|---------------|--------------|
| `Promise.all` | all fulfill | first reject |
| `Promise.race` | first settle | first reject |
| `Promise.allSettled` | all settle | never |
| `Promise.any` | first fulfill | all reject |

| Pros | Cons |
|------|------|
| `all` — fast fail, ordered results | One failure loses all results |
| `allSettled` — inspect every outcome | More verbose result parsing |
| `race` — timeouts, first responder | First reject wins — not always desired |
| `any` — redundant mirrors/CDNs | All-fail case needs `AggregateError` handling |

**Cases:**

| Method | Use when |
|--------|----------|
| `Promise.all` | All results required (e.g. user + posts) |
| `Promise.allSettled` | Batch where some may fail (bulk upload status) |
| `Promise.race` | Timeout wrapper, fastest CDN wins |
| `Promise.any` | First successful mirror; fallback pool |

**Example:**

<details>
  <summary>Code</summary>

```js
var p1 = new Promise(resolve => setTimeout(() => resolve('one'), 500));
var p2 = new Promise(resolve => setTimeout(() => resolve('two'), 100));

Promise.race([p1, p2]).then(console.log); // "two"

// Timeout pattern
const timeout = (ms) => new Promise((_, reject) =>
  setTimeout(() => reject(new Error('timeout')), ms)
);
await Promise.race([fetch('/api'), timeout(5000)]);
```

</details>

**Common pitfalls:**

- `Promise.all` with sequential `await` inside loop — use `map` + `all` instead.
- `race` for timeout — losing request still runs; cancel with `AbortController`.
- `allSettled` result order matches input order, not completion order.

**Source:** [javascript.info/promise-api](https://learn.javascript.ru/promise-api)

</details>

<details>
  <summary>Promisification</summary>

### Promisification

**Definition:** Wrapping a callback-style API (`fn(arg, (err, result) => ...)`) into a function that returns a Promise.

**How it works:**

- Wrap original function; return `new Promise((resolve, reject) => ...)`.
- Call original with args + callback; on error-first callback: `err ? reject(err) : resolve(result)`.
- Node provides `util.promisify(fn)` for standard error-first functions.
- Loses multi-callback semantics (e.g. `progress` callbacks) unless extended.
- Result is composable with `await` and `Promise.all`.

| Pros | Cons |
|------|------|
| Unified async style | Loses multi-callback semantics |
| Composable with `await` | Must handle error-first convention correctly |
| One-time wrapper, reuse everywhere | Some APIs use success-only callbacks |

**Cases:**

| Situation | Approach |
|-----------|----------|
| Legacy Node `fs.*` | `util.promisify` or `fs.promises` |
| Old browser API | Manual promisify wrapper |
| Library with callback + promise versions | Use promise version when available |
| Custom event completion | `new Promise` + `once` listener |

**Example:**

<details>
  <summary>Code</summary>

```js
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}

// Node: util.promisify(fs.readFile)
const readFile = promisify(fs.readFile);
const data = await readFile('file.txt', 'utf8');
```

</details>

**Common pitfalls:**

- Promisifying function that calls callback multiple times — only first settle counts.
- Wrong callback signature (success-only vs error-first).
- Not binding `this` for methods — use `promisify(fs.readFile.bind(fs))` or `fs.promises`.

**Source:** [javascript.info/promisify](https://learn.javascript.ru/promisify)

</details>

<details>
  <summary>try...catch with promises</summary>

### try...catch with promises

**Definition:** `try...catch` handles synchronous throws; with `async/await` it also catches rejected promises. With raw promises, use `.catch()` or a trailing `.catch` on the chain.

**How it works:**

- `try/catch` around `await` catches promise rejections as if they were throws.
- Sync throw inside `async` function → rejected promise returned to caller.
- `.catch` on chain handles rejections from any prior `.then`.
- `.finally` runs after success or failure — good for cleanup (close connections).
- Unhandled rejection: rejected promise with no `.catch` and no `await` in try/catch.

| Approach | Best for |
|----------|----------|
| `.catch()` on chain | Promise pipelines |
| `try/catch` + `await` | `async` functions |
| `.finally()` | Cleanup in both success and failure paths |

| Pros | Cons |
|------|------|
| `try/catch` reads like sync code | `try/catch` per `await` is verbose |
| `.catch` at end of chain — one handler | Easy to forget handler on fire-and-forget promise |
| `.finally` for shared cleanup | `.finally` does not suppress rejection |

**Cases:**

| Situation | Pattern |
|-----------|---------|
| Single async function | `try { await ... } catch (e) { ... }` |
| Promise pipeline | trailing `.catch(console.error)` |
| Always close resource | `try { ... } finally { cleanup() }` |
| Re-throw after log | `catch (e) { log(e); throw e; }` |

**Example:**

<details>
  <summary>Code</summary>

```js
const processData = async () => {
  try {
    const data = await fetchData();
    console.log('Processed:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Promise chain equivalent
fetchData()
  .then(data => console.log('Processed:', data))
  .catch(error => console.error('Error:', error));
```

</details>

**Common pitfalls:**

- `try/catch` without `await` — `fetch()` returns pending promise; errors not caught.
- Empty `catch` swallowing errors — hides bugs.
- `return` in `catch` without rethrow — caller sees success with `undefined`.

**Source:** [javascript.info/try-catch](https://learn.javascript.ru/try-catch)

</details>

<a name="async-await"></a>

## Async / await

<details>
  <summary>async/await basics</summary>

### async/await

**Definition:** `async` marks a function that always returns a Promise. `await` pauses execution inside that function until a Promise settles, then resumes with the value.

**How it works:**

- `async function f() { ... }` — always returns `Promise`; `return x` → `Promise.resolve(x)`; `throw` → rejection.
- `await promise` — suspends **only** that async function; other code on the thread continues.
- After await resolves, execution resumes as a **microtask**.
- `await` works on thenables, not only native Promises.
- Top-level `await` allowed in ES modules — see [Top-level await](#top-level-await).

| Pros | Cons |
|------|------|
| Readable sequential code | Forgetting `await` silently breaks logic |
| Native `try/catch` | Sequential loops are slow without batching |
| Familiar control flow (`if`, `for`) | Debugging async stacks can be harder |
| Interops with promises | Cannot use `await` in non-`async` functions (except TLA in modules) |

**Cases:**

| Use async/await | Use raw promises |
|-----------------|------------------|
| Default for app logic | Library returning thenables |
| Sequential steps with branches | `Promise.race` one-liners |
| `try/catch` error handling | Callback-style interop |

**Example:**

<details>
  <summary>Code</summary>

```js
async function load() {
  const res = await fetch('/api/data');
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

load().then(data => console.log(data));
```

</details>

**Common pitfalls:**

- Missing `await` — `const x = fetch()` is a Promise, not data.
- `async` IIFE forgotten — top-level await only in modules.
- `forEach` with `async` callback — does not await iterations.

**Source:** [javascript.info/async-await](https://learn.javascript.ru/async-await)

</details>

<details>
  <summary>Parallel vs sequential</summary>

### Parallel vs sequential

**Definition:** Sequential `await` runs tasks one after another; parallel execution starts all tasks first, then awaits together.

**How it works:**

- `const a = await fetchA(); const b = await fetchB();` — B starts only after A completes.
- `const [a, b] = await Promise.all([fetchA(), fetchB()]);` — both start immediately; wait for both.
- Key: call functions **before** `await` to start work — `const p = fetchA(); await p` is parallel-friendly.
- `for await` and sequential `await` in loop — one at a time by design.
- Use `Promise.all` for independent I/O; sequential when each step needs previous result.

| Pros | Cons |
|------|------|
| Sequential: simple dependencies | Sequential: sum of latencies |
| Parallel: min latency for independent work | Parallel: all fail if `Promise.all` and one rejects |
| `allSettled` for partial success | More memory — all requests in flight |

**Cases:**

| Pattern | When |
|---------|------|
| Sequential `await` | Step B needs result of step A |
| `Promise.all` | Independent fetches, all required |
| `Promise.allSettled` | Independent, OK if some fail |
| `map` + `all` | N parallel items with order preserved |

**Example:**

<details>
  <summary>Code</summary>

```js
// Sequential — B waits for A
const a = await fetchA();
const b = await fetchB();

// Parallel — start both, await together
const [a, b] = await Promise.all([fetchA(), fetchB()]);

// Parallel in loop
const results = await Promise.all(ids.map(id => fetchItem(id)));
```

</details>

**Common pitfalls:**

- `await` inside `for` loop — N × latency; batch with `Promise.all`.
- Starting promises but awaiting one-by-one — still sequential if second await waits for first's completion only after first started late.
- `Promise.all` when one failure should not cancel others — use `allSettled`.

**Source:** [javascript.info/promise-api](https://learn.javascript.ru/promise-api)

</details>

<details>
  <summary>Async iterators and for await...of</summary>

### Async iterators and for await...of

**Definition:** Objects with `[Symbol.asyncIterator]` yield Promises; `for await...of` consumes them sequentially.

**How it works:**

- Async iterable exposes `asyncIterator()` returning `{ next() → Promise<{ value, done }> }`.
- `for await (const x of asyncIterable)` — awaits each `next()` before continuing.
- Async generators: `async function* gen() { yield await fetch(...); }`.
- Works on streams (Node readable), paginated APIs, Web Streams `ReadableStream`.
- Must be inside `async` function or top-level module (with TLA).

| Pros | Cons |
|------|------|
| Stream large async data | Sequential — slower than parallel |
| Clean syntax vs manual `.then` chains | Requires async function context |
| Backpressure with streams (Node) | Error handling needs `try/catch` around loop |
| Memory-efficient pagination | Not for unrelated parallel fetches |

**Cases:**

| Use `for await...of` | Use `Promise.all` |
|----------------------|-------------------|
| File/network streams | Independent parallel requests |
| Paginated API (page depends on cursor) | Fixed list of known URLs |
| WebSocket message stream | Batch processing with concurrency limit |

**Example:**

<details>
  <summary>Code</summary>

```js
async function* generateIds() {
  for (let i = 0; i < 3; i++) {
    await new Promise(r => setTimeout(r, 100));
    yield i;
  }
}

(async () => {
  for await (const id of generateIds()) {
    console.log(id);
  }
})();
```

</details>

**Common pitfalls:**

- Using `for await` on non-async iterable — runtime error.
- Not breaking loop on error — entire stream fails unless handled per iteration.
- Parallelizing with `for await` — wrong tool; use concurrent workers + queue.

**Source:** [javascript.info/async-iterators-generators](https://learn.javascript.ru/async-iterators-generators)

</details>

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

| Pros | Cons |
|------|------|
| Cancels in-flight requests | Not all APIs support `AbortSignal` |
| Composable with timeouts | Must wire signal into each call |
| Prevents stale responses updating UI | Aborted fetch still rejects — handle `AbortError` |
| Standard across fetch ecosystem | Older libraries need manual cancellation |

**Cases:**

| Situation | Pattern |
|-----------|---------|
| User navigates away | `abort()` in `useEffect` cleanup |
| Search debounce | Abort previous request on new keystroke |
| Request timeout | `AbortSignal.timeout(5000)` or manual timer |
| Race winner | Abort losers after `Promise.race` |

**Example:**

<details>
  <summary>Code</summary>

```js
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const res = await fetch('/api/data', { signal: controller.signal });
  clearTimeout(timeout);
  const data = await res.json();
} catch (err) {
  if (err.name === 'AbortError') console.log('Request aborted');
  else throw err;
}
```

</details>

**Common pitfalls:**

- Treating `AbortError` as real failure — often expected on navigation.
- Not aborting on component unmount — setState on unmounted component warning.
- Single-use controller — create new one per request.

**Notes:** Aborting stale search `fetch` reduces main-thread work and races — helps **INP**. [6_web_api.md — INP](./6_web_api.md#inp-interaction-to-next-paint).

**Source:** [javascript.info/fetch-abort](https://learn.javascript.ru/fetch-abort) — full Fetch details in [6_web_api.md](./6_web_api.md)

</details>

<a name="related-apis"></a>

## Related APIs

<details>
  <summary>Timers</summary>

### Timers

**Definition:** `setTimeout` runs a callback once after a delay; `setInterval` repeats at a fixed interval. Both schedule **macrotasks**. `clearTimeout` / `clearInterval` cancel pending callbacks.

**How it works:**

- `setTimeout(fn, ms)` — minimum delay `ms`; actual delay ≥ `ms` (clamped to ~4ms in browsers when nested).
- `setInterval(fn, ms)` — repeats until `clearInterval`; can drift if callback runs longer than interval.
- Return value is numeric ID (browser) or `Timeout` object (Node) — pass to `clear*`.
- Callback runs as macrotask — after current sync code and all microtasks.
- `setTimeout(fn, 0)` defers to next macrotask turn — not immediate.

| API | Behavior |
|-----|----------|
| `setTimeout(fn, ms)` | Run once after `ms` (minimum ~4ms in browsers) |
| `setInterval(fn, ms)` | Repeat every `ms` until cleared |
| `clearTimeout(id)` | Cancel a `setTimeout` |
| `clearInterval(id)` | Cancel a `setInterval` |

| Pros | Cons |
|------|------|
| Simple deferral and scheduling | Not precise for animations (use `rAF`) |
| Works everywhere | `setInterval` stacks up if handler is slow |
| Good for debounce/throttle base | Minimum delay clamping surprises nested timers |
| Macrotask — allows paint between | No cancellation of in-flight callback mid-run |

**Cases:**

| Use | Prefer instead |
|-----|----------------|
| Debounce/throttle | `requestAnimationFrame` for visual updates |
| Delayed UI update | `queueMicrotask` for before-next-macro |
| Polling | WebSocket/SSE for server push |
| `sleep` in async code | `await new Promise(r => setTimeout(r, ms))` |

**Example:**

<details>
  <summary>Code</summary>

```js
const id = setTimeout(() => console.log('later'), 1000);
clearTimeout(id);

const interval = setInterval(() => tick(), 500);
clearInterval(interval);

// Async sleep helper
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
await sleep(1000);
```

</details>

**Common pitfalls:**

- `this` in timer callback — use arrow function or `.bind`.
- Forgetting `clearInterval` on SPA route change — leaks and stale updates.
- Assuming exact timing — event loop load adds jitter.
- Leftover `setInterval` (polling, autosave) regularly steals the main thread — worse for **INP** than a one-shot `setTimeout`. [6_web_api.md — INP](./6_web_api.md#inp-interaction-to-next-paint).

**Source:** [javascript.info/settimeout-setinterval](https://learn.javascript.ru/settimeout-setinterval)

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

| Pros | Cons |
|------|------|
| Low-priority work (analytics, prefetch) | Can starve without `timeout` |
| Cooperates with rendering | Not a substitute for Web Workers on CPU-heavy jobs |

**Cases:** Defer non-critical JS; contrast with rAF (must run before paint) and microtasks (run before the next macrotask **and** can delay paint if they never drain).

**Example:**

<details>
  <summary>Code</summary>

```js
requestIdleCallback((deadline) => {
  while (deadline.timeRemaining() > 0 && queue.length) {
    work(queue.pop());
  }
}, { timeout: 2000 });
```

</details>

**Key idea:** *Idle work runs when the browser is not painting; a never-ending microtask queue never reaches idle or paint.*

**Source:** [MDN — requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) · [IdleDeadline](https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline)

</details>

<details>
  <summary>JSON</summary>

### JSON

**Definition:** Syntax, `stringify`/`parse`, and pitfalls: [JS Core — JSON](./3_js_core.md#json). Config comments → [YAML](./10_build.md#yaml).

**How it works (async):** `await res.json()` parses the fetch body (same as `JSON.parse` on the text). Send with `JSON.stringify(body)` and `Content-Type: application/json`.

**Key idea:** *Fetch delivers JSON text; Core JSON APIs turn it into values.*

</details>

<details>
  <summary>Related</summary>

### Related

**Definition:** Cross-references to adjacent topics covered in other study notes — HTTP, Node event loop, and browser rendering.

**How it works:**

- Fetch, CORS, HTTP methods → [6_web_api.md](./6_web_api.md#cors)
- Node event loop phases, `libuv` → [8_nodejs.md](./8_nodejs.md)
- DOM events, `requestAnimationFrame`, `requestIdleCallback` → [3_js_browser.md](./3_js_browser.md)
- React async patterns, stale closures → [4_react.md](./4_react.md)

**Cases:** Follow these links when async code touches networking, server runtime, UI timing, or framework lifecycle.

**Source:** See linked docs above.

</details>

<a name="queuemicrotask-processnexttick"></a>

## queueMicrotask & process.nextTick

<details>
  <summary>queueMicrotask & process.nextTick (Node)</summary>

### queueMicrotask & process.nextTick

**Definition:** `queueMicrotask(fn)` schedules a microtask in browser and Node. Node's `process.nextTick(fn)` schedules a callback with **higher priority** than other microtasks.

**How it works:**

- `queueMicrotask(callback)` — runs after current sync code, in microtask queue, before next macrotask.
- Same queue family as `Promise.then` reactions.
- Node `process.nextTick(callback)` — separate queue drained **before** promise microtasks and before I/O.
- Intended for deferring work without delaying I/O; abusing `nextTick` can starve the event loop.
- Browser: `queueMicrotask` on `globalThis` or `window`.

| API | Environment | Priority |
|-----|-------------|----------|
| `queueMicrotask` | Browser, Node | Standard microtask |
| `Promise.then` | Both | Standard microtask |
| `process.nextTick` | Node only | Above other microtasks |

| Pros | Cons |
|------|------|
| Explicit microtask scheduling | Easy to starve macrotasks if recursive |
| `nextTick` runs before promise handlers in Node | `nextTick` not available in browser |
| Break up sync work without `setTimeout(0)` | Overuse blocks I/O and timers |
| Predictable ordering within microtask tier | Differs between Node and browser |

**Cases:**

| Use | Avoid |
|-----|-------|
| Run after DOM update, before paint | Long-running loops in microtasks |
| Node: defer callback before I/O phase | `nextTick` recursion instead of `setImmediate` for heavy work |
| Polyfill promise reaction timing | Replacing `Promise.then` for readability |

**Example:**

<details>
  <summary>Code</summary>

```js
console.log('sync');

queueMicrotask(() => console.log('microtask'));

Promise.resolve().then(() => console.log('promise microtask'));

// Node only:
// process.nextTick(() => console.log('nextTick')); // runs before promise microtask

setTimeout(() => console.log('macrotask'), 0);

// sync → nextTick (Node) → microtask → promise microtask → macrotask
```

</details>

**Common pitfalls:**

- Infinite `process.nextTick` chain in Node — blocks I/O indefinitely.
- Assuming `queueMicrotask` runs before `Promise.then` — same queue, order of scheduling matters.
- Using `setTimeout(0)` when microtask is enough — adds unnecessary macrotask delay.

**Source:** [MDN queueMicrotask](https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask) · [Node process.nextTick](https://nodejs.org/api/process.html#processnexttickcallback-args) · [8_nodejs.md](./8_nodejs.md)

</details>

<a name="unhandled-promise-rejections"></a>

## Unhandled promise rejections

<details>
  <summary>Unhandled promise rejections</summary>

### Unhandled promise rejections

**Definition:** A rejected Promise with no `.catch` handler and no `await` inside `try/catch` is **unhandled**. Runtimes emit events and may terminate the process (Node) or log to console (browser).

**How it works:**

- Rejection tracked when promise rejects and no handler attached yet.
- If handler attached later (same tick or microtask turn in some engines), may still count as handled.
- Browser: `window` event `unhandledrejection`; `event.promise`, `event.reason`.
- `event.preventDefault()` — suppress default logging (browser).
- Node: `process.on('unhandledRejection', (reason, promise) => ...)`.
- Node 15+: unhandled rejection can crash process by default.
- `rejectionhandled` / `handled` events when handler added late.

| Environment | Default behavior |
|-------------|------------------|
| Browser | `console.error` + `unhandledrejection` event |
| Node (modern) | Warning or process exit |
| `async` main without catch | Unhandled rejection on returned promise |

| Pros | Cons |
|------|------|
| Surfaces forgotten error paths | Can crash production if uncaught |
| Global handlers for logging/monitoring | Easy to miss fire-and-forget promises |
| Forces explicit error strategy | Async stack traces can be unclear |

**Cases:**

| Situation | Fix |
|-----------|-----|
| `fetch()` without catch | Add `.catch` or `try/catch` with `await` |
| `async` IIFE | `.catch` on the promise: `(async () => {})().catch(...)` |
| Express route handlers | Wrap in try/catch or error middleware |
| Global monitoring | `unhandledrejection` listener → report to Sentry |

**Example:**

<details>
  <summary>Code</summary>

```js
// Unhandled — logs error / may crash Node
Promise.reject(new Error('oops'));

// Handled
Promise.reject(new Error('oops')).catch(console.error);

// async without catch
async function main() {
  throw new Error('fail');
}
main(); // unhandled
main().catch(console.error); // handled

// Browser global handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled:', event.reason);
  event.preventDefault();
});
```

</details>

**Common pitfalls:**

- `async` function return value ignored — rejection unhandled at call site.
- `.then(fn)` without `.catch` — rejection in `fn` propagates but outer promise needs handler.
- Swallowing in global handler without fixing root cause.

**Source:** [MDN unhandledrejection](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event) · [Node unhandledRejection](https://nodejs.org/api/process.html#event-unhandledrejection)

</details>

<a name="top-level-await"></a>

## Top-level await

<details>
  <summary>Top-level await (brief)</summary>

### Top-level await

**Definition:** `await` at module top level (not inside `async` function) — pauses **module evaluation** until the promise settles. ES2022 feature for ES modules only.

**How it works:**

- Only in `.mjs` files or `<script type="module">` — not CommonJS, not classic scripts.
- Module graph waits — importers of this module block until TLA completes.
- Use for: loading config, WASM init, conditional imports.
- Downside: serializes module load chain — can slow app startup.

| Pros | Cons |
|------|------|
| No async IIFE wrapper | Blocks dependent module imports |
| Clean config/bootstrap | Not in CJS without dynamic `import()` |
| Natural for module init | Overuse hurts parallel loading |

**Cases:**

| Good use | Avoid |
|----------|-------|
| `const config = await loadConfig()` in entry module | Heavy I/O in widely-imported utility module |
| Dynamic `await import()` based on env | Replacing all lazy loading with TLA |
| WASM `await init()` | CJS `require` contexts |

**Example:**

<details>
  <summary>Code</summary>

```js
// config.mjs
const res = await fetch('/api/config');
export const config = await res.json();

// app.mjs — waits for config.mjs to finish
import { config } from './config.mjs';
console.log(config.apiUrl);
```

</details>

**Common pitfalls:**

- TLA in deep dependency tree — unexpected startup delay.
- Using in shared module imported by many — bottleneck.
- Classic script or CJS — `SyntaxError`; use async IIFE or dynamic import.

**Source:** [MDN top-level await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await) · [javascript.info/modules](https://learn.javascript.ru/modules-intro)

</details>

<a name="promisewithresolvers"></a>

## Promise.withResolvers

<details>
  <summary>Promise.withResolvers (brief)</summary>

### Promise.withResolvers

**Definition:** ES2024 static method returning `{ promise, resolve, reject }` — splits promise creation from executor, useful when resolve/reject must be called from outside the constructor.

**How it works:**

- `const { promise, resolve, reject } = Promise.withResolvers();`
- Equivalent to manual `let resolve, reject; const promise = new Promise((res, rej) => { resolve = res; reject = rej; });`
- `resolve`/`reject` callable multiple times — only first counts (standard promise rules).
- Cleaner for deferred patterns, event-to-promise bridges, tests.

| Pros | Cons |
|------|------|
| Avoids awkward executor pattern | ES2024 — check target environment support |
| Clearer deferred/event APIs | Still need `.catch` for unhandled rejections |
| Same semantics as `new Promise` | Polyfill needed for older runtimes |

**Cases:**

| Use | Example |
|-----|---------|
| Deferred — expose resolve to caller | Manual promise control |
| Event → promise once | `once(emitter, 'data')` helper |
| Test fixtures | Resolve promise from outside test body |
| Queue with backpressure | Resolve when slot available |

**Example:**

<details>
  <summary>Code</summary>

```js
const { promise, resolve, reject } = Promise.withResolvers();

setTimeout(() => resolve('done'), 1000);

const result = await promise; // 'done'

// Event bridge
function once(emitter, event) {
  const { promise, resolve } = Promise.withResolvers();
  emitter.once(event, resolve);
  return promise;
}
```

</details>

**Common pitfalls:**

- Forgetting to call `resolve` or `reject` — promise hangs forever.
- Calling both — first wins; second ignored.
- No native support in older Node — use polyfill or manual pattern.

**Source:** [MDN Promise.withResolvers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers)

</details>

<a name="practice"></a>

## Practice

<details>
  <summary>Output tasks</summary>

### Output tasks

```js
console.log([] + null + 1) // 'null1'
```

<details>
  <summary>details</summary>

`[]` coerces to `""`. `"" + null` → `"null"`. `"null" + 1` → `"null1"`.

</details>

```js
"foo" + + "bar" // 'fooNaN'
```

<details>
  <summary>details</summary>

Unary `+` on `"bar"` → `NaN`. `"foo" + NaN` → `"fooNaN"`.

</details>

```
!!"false" == !!"true" // true
```

<details>
  <summary>details</summary>

Both `!!"false"` and `!!"true"` are `true` (non-empty strings are truthy).

</details>

```
"a" && "" && "c" // ""
```

<details>
  <summary>details</summary>

`&&` returns the first falsy operand — `""`.

</details>

```
"a" && "" || "c" // "c"
```

<details>
  <summary>details</summary>

`"a" && ""` → `""` (falsy). `"" || "c"` → `"c"`.

</details>

```
"" ?? "a" // ""
```

<details>
  <summary>details</summary>

`??` returns the right side only for `null` or `undefined`. `""` is neither.

</details>

```js
var employeeId = '1234abe';
(function () {
  console.log(employeeId);
  var employeeId = '122345';
})();
// undefined (hoisting — TDZ until assignment in IIFE)
```

```js
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
Promise.resolve().then(() => setTimeout(() => console.log(4)));
Promise.resolve().then(() => console.log(5));
setTimeout(() => console.log(6));
console.log(7);
// 1, 7, 3, 5, 2, 6, 4
```

```js
setTimeout(() => console.log(1), 500);
console.log(2);
setTimeout(() => console.log(3));
Promise.resolve(6).then(response => console.log(response));
Promise.resolve(new Promise(() => console.log(7)));
console.log(4);
setTimeout(() => console.log(5), 200);
// 2, 7, 4, 6, 5, 3, 1
```

```js
const square = {
  side: 10,
  area() {
    return this.side * this.side;
  },
  perimeter: () => 2 * this.side,
};

console.log(square.area());      // 100
console.log(square.perimeter()); // NaN (arrow — no own this)
```

```js
var foo = function bar() {
  return 1;
};
console.log(typeof bar());
// ReferenceError: bar is not defined (bar is not in outer scope)
```

</details>

<details>
  <summary>each — map callback exercise</summary>

### each — map callback exercise

```js
function each(array, callback) {
  const newArray = array.map(callback);
  return newArray;
}

const eachToTitle = value => value.toUpperCase();
const eachToReverse = value => value.split('').reverse().join('');
const eachToFactor2 = value => value * 2;

const arrayOfNumbers = [1, 2, 3];
const arrayOfStrings = ['roman', 'getsman'];

console.log(each(arrayOfNumbers, eachToFactor2));  // [2, 4, 6]
console.log(each(arrayOfStrings, eachToReverse));  // ['namor', 'namsteg']
console.log(each(arrayOfStrings, eachToTitle));    // ['ROMAN', 'GETSMAN']
```

</details>

<details>
  <summary>Interview questions</summary>

### How can code be shared between files?

- **ES modules** — `import` / `export` between files.
- **Bundlers** — webpack, Rollup, Vite combine modules for production.
- **Global object** (`window`) — generally discouraged; risks naming collisions.

### polyfill

A polyfill is a script that implements a modern API on older environments that lack native support.

</details>

<details>
  <summary>Date formatting</summary>

### date

```js
export const dateFormat = (
  ms,
  options,
  locale,
) => {
  const _options = options || {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat(locale || 'ru-RU', _options).format(ms);
};

dateFormat(Date.now(), {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});
```

</details>

<details>
  <summary>Promise coding exercises</summary>

### Promises

```js
function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function main() {
  console.log(1);
  await delay(1000);
  console.log(2);
}

main();
```

```js
console.log(Promise.resolve(1));
// Promise { <fulfilled>: 1 }

Promise.resolve()
  .then(() => 1)
  .then(console.log);
// 1

Promise.resolve()
  .then(() => console.log(2))
  .then(() => console.log(3))
  .then(() => {
    setTimeout(() => console.log(4));
  })
  .then(() => console.log(5));

new Promise((resolve, reject) => {
  console.log(6);
  setTimeout(() => console.log(7), 0);
  resolve();
});

setTimeout(() => console.log(8), 0);

console.log(9);
// 6, 9, 2, 3, 5, 7, 8, 4
```

```js
const delay = t => new Promise(r => setTimeout(r, t));

const runner = async task => {
  await task();
};

const main = () => {
  const t1 = async () => { await delay(10); console.log('t1'); };
  const t2 = async () => { await delay(5);  console.log('t2'); };
  const t3 = async () => { await delay(15); console.log('t3'); };

  runner(t1);
  runner(t2);
  runner(t3);
};

main();
// t2, t1, t3 (parallel start, finish by delay)
```

Logger exercise: [jsfiddle](https://jsfiddle.net/hlieb/fryuvapb/1/)

</details>

<details>
  <summary>Junior — JS Core (async topics)</summary>

### Junior — JS Core

23. What are `setTimeout` and `setInterval` for?
24. Compare callbacks vs promises vs async/await.
38. What is recursion?
29. What is a Promise? Order of `then` and `catch` in a chain.
30. Sequential vs parallel async execution. Difference between `Promise.all()` and `Promise.allSettled()`.

</details>

<details>
  <summary>Middle — JS Core (async topics)</summary>

### Middle — JS Core

18. Describe the Event loop.
28. What is an Observable vs a Promise?
29. What is a Promise? Order of `then` and `catch` in a chain.
30. Sequential vs parallel async. `Promise.all()` vs `Promise.allSettled()`.
37. Generators and iterators.
39. Async disposer pattern.

</details>

<details>
  <summary>Practical tasks (async)</summary>

### Practical tasks (async)

43. Implement an async `Array.prototype.filter` (must support `await` in predicate).

140. Write `Sleep(ms)` that pauses an async function for a given duration.

141. Implement one array method (e.g. `splice`).

</details>

<a name="interview-practice"></a>

## Interview Practice

Questions from [0_interview.md](0_interview.md). Try answering before opening solutions.

### Question index

| Topic | Answer |
|-------|--------|
| Event loop order | Q&A + Tasks 1–5 |
| Nested log order (sync / micro / macro) | Q&A |
| Promise vs callback | Q&A |
| `Promise.all` / `allSettled` / `race` | Q&A |
| `async/await` errors, parallel vs sequential | Q&A |
| Unhandled rejection | Q&A |
| AbortController | Q&A |

---

## Questions & Answers

<details>
  <summary>Explain the event loop order</summary>

### Explain the event loop order

**Definition:** The event loop schedules work in a fixed priority: synchronous call stack first, then all microtasks, then one macrotask, then (browser) possibly a render frame.

**How it works:**

1. Run synchronous code until the call stack is empty.
2. Drain **all microtasks** (`Promise.then`, `queueMicrotask`, `MutationObserver`, `async/await` continuations).
3. Run **one macrotask** (`setTimeout`, I/O, UI events).
4. Browser: optionally run render steps (style, layout, paint).
5. Repeat.

Node: `process.nextTick` runs before other microtasks.

| Pros | Cons |
|------|------|
| Predictable promise-before-timer ordering | Easy to get wrong in nested puzzles |
| Microtasks batch related async work | Long microtask queues delay UI |
| One macro per turn allows paint | Node phases add complexity |

**Cases:** Interview output questions; debugging "why did this run first?"; avoiding UI jank.

**Example:**

<details>
  <summary>Code</summary>

```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// 1, 4, 3, 2
```

</details>

**Common pitfalls:**

- `new Promise(executor)` — executor is sync; only `.then` is microtask.
- `setTimeout` inside microtask still waits for next macrotask turn.

**Key idea:** *Sync → drain all microtasks → one macrotask → (browser may paint) → micros spawned by that macrotask → … Infinite micros starve paint and idle callbacks.*

**Source:** [javascript.info/event-loop](https://learn.javascript.ru/event-loop)

</details>

<details>
  <summary>Log order: sync, Promise, then setTimeout that queues another Promise</summary>

### Log order: sync, Promise, then setTimeout that queues another Promise

**Definition:** Nested scheduling: a macrotask can enqueue microtasks that run **before** the next macrotask.

**How it works:**

```js
console.log('A');
setTimeout(() => {
  console.log('B');
  Promise.resolve().then(() => console.log('C'));
}, 0);
Promise.resolve().then(() => {
  console.log('D');
  setTimeout(() => console.log('E'), 0);
});
console.log('F');
// A, F, D, B, C, E
```

1. Sync: `A`, register timer, register micro `D`, `F`.
2. Drain micros: `D` (schedules timer `E`).
3. One macro: `B` (schedules micro `C`).
4. Drain micros: `C`.
5. Next macro: `E`.

**Cases:** Interview output puzzles. Comment each line: sync / micro / macro.

**Key idea:** *After each macrotask, empty the microtask queue again before the next timer.*

**See also:** [Explain the event loop order](#interview-practice)

**Source:** [javascript.info/event-loop](https://learn.javascript.ru/event-loop)

</details>

<details>
  <summary>Promise vs callback?</summary>

### Promise vs callback?

**Definition:** Callbacks invoke a function when async work completes; Promises are objects representing a future value with chainable `.then`/`.catch`.

**How it works:**

- Callbacks: inversion of control — callee decides when to call.
- Promises: single settlement, composable chains, errors propagate to `.catch`.
- Promises wrap callbacks via promisification; `async/await` is promise syntax sugar.

| | Callback | Promise |
|---|----------|---------|
| Composition | Manual nesting | `.then` chains, `Promise.all` |
| Errors | Error-first convention or easy to miss | `.catch` / `try/catch` with `await` |
| Multiple calls | Possible (events) | Settles once |

| Pros | Cons |
|------|------|
| Promises unify async style | Promises don't cancel natively |
| Callbacks universal for events | Callback hell for sequential steps |
| Promises work with `await` | Promisifying loses multi-callback APIs |

**Cases:** Events → callbacks; app logic → promises/`async`; legacy Node → promisify.

**Example:**

<details>
  <summary>Code</summary>

```js
// Callback
readFile('a.txt', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});

// Promise
readFilePromise('a.txt')
  .then(data => console.log(data))
  .catch(console.error);
```

</details>

**Source:** [javascript.info/promise-basics](https://learn.javascript.ru/promise-basics) · [javascript.info/callbacks](https://learn.javascript.ru/callbacks)

</details>

<details>
  <summary>Promise.all vs allSettled vs race vs any?</summary>

### Promise.all vs allSettled vs race vs any?

**Definition:** Static methods combining multiple promises with different settlement rules.

**How it works:**

- `all` — all fulfill or first reject; results in input order.
- `allSettled` — wait for all; never rejects; `{ status, value|reason }`.
- `race` — first settle wins (fulfill or reject).
- `any` — first fulfill wins; `AggregateError` if all reject.

| Method | Resolves when | Rejects when |
|--------|---------------|--------------|
| `Promise.all` | all fulfill | first reject |
| `Promise.allSettled` | all settle | never |
| `Promise.race` | first settle | first reject |
| `Promise.any` | first fulfill | all reject |

| Pros | Cons |
|------|------|
| `all` — fast fail, parallel required data | One failure loses everything |
| `allSettled` — full status report | Verbose to map results |
| `race` — timeouts | Loser requests may still run |
| `any` — redundant sources | Rare; `AggregateError` handling |

**Cases:**

| Method | Use when |
|--------|----------|
| `all` | User + permissions both required |
| `allSettled` | Bulk upload — show per-file status |
| `race` | 5s timeout on `fetch` |
| `any` | Try CDN mirrors until one succeeds |

**Example:**

<details>
  <summary>Code</summary>

```js
const results = await Promise.allSettled([
  fetch('/a'),
  fetch('/b'),
]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log(r.value);
  else console.error(r.reason);
});
```

</details>

**Common pitfalls:**

- `all` when partial success is OK — use `allSettled`.
- `race` for timeout without `AbortController` — request continues in background.

**Source:** [javascript.info/promise-api](https://learn.javascript.ru/promise-api)

</details>

<details>
  <summary>async/await — parallel vs sequential?</summary>

### async/await — parallel vs sequential?

**Definition:** Sequential `await` waits for each task before starting the next; parallel execution starts all tasks, then awaits together (usually `Promise.all`).

**How it works:**

- Sequential: total time ≈ sum of latencies.
- Parallel: total time ≈ max latency (for independent I/O).
- Start promises before `await` — `const p = fetchA(); await fetchB(); await p` overlaps A and B.
- `for` loop with `await` — sequential by default.

| Pattern | Latency (independent 100ms × 2) |
|---------|-----------------------------------|
| Sequential `await` | ~200ms |
| `Promise.all` | ~100ms |

| Pros | Cons |
|------|------|
| Sequential: clear dependencies | Sequential: unnecessarily slow |
| Parallel: minimal wait | `all`: one failure fails batch |
| `allSettled` for partial success | Harder to read than sync-looking code |

**Cases:** Sequential when step 2 needs step 1 output; parallel for independent API calls.

**Example:**

<details>
  <summary>Code</summary>

```js
// Sequential — B waits for A
const a = await fetchA();
const b = await fetchB();

// Parallel — start both, await together
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

</details>

**Common pitfalls:**

- Sequential `await` in `for` loop over 100 items — 100 round trips.
- Forgetting that `fetchA()` without await still starts the request — good for parallel if you collect promises first.

**Source:** [javascript.info/async-await](https://learn.javascript.ru/async-await)

</details>

<details>
  <summary>What does async function return?</summary>

### What does async function return?

**Definition:** An `async` function **always** returns a `Promise`, regardless of what you `return`.

**How it works:**

- `return value` → `Promise.resolve(value)`.
- `throw err` → `Promise.reject(err)`.
- Bare `return` → `Promise.resolve(undefined)`.
- Caller must `await fn()` or `fn().then(...)` to get value or catch errors.
- `await` inside only works in `async` functions (or top-level modules).

| Pros | Cons |
|------|------|
| Uniform promise interface | Easy to forget `await` at call site |
| Interops with `.then` chains | Stack traces cross async boundaries |
| `try/catch` inside async fn | Returned promise needs its own `.catch` |

**Cases:** Always treat call result as Promise unless you `await` immediately.

**Example:**

<details>
  <summary>Code</summary>

```js
async function getValue() {
  return 42;
}
getValue(); // Promise { 42 }
await getValue(); // 42

async function fail() {
  throw new Error('oops');
}
fail().catch(console.error); // required or unhandled rejection
```

</details>

**Common pitfalls:**

- `const x = asyncFn()` — `x` is Promise, not resolved value.
- `async` arrow in `map` without `Promise.all` — concurrent but unhandled rejections.

**Source:** [javascript.info/async-await](https://learn.javascript.ru/async-await)

</details>

<details>
  <summary>Unhandled promise rejection?</summary>

### Unhandled promise rejection?

**Definition:** A rejected Promise with no attached `.catch` and no `await` in `try/catch` triggers runtime warnings or process exit.

**How it works:**

- Browser: `unhandledrejection` on `window`.
- Node: `process.on('unhandledRejection', ...)`.
- Fix: `.catch`, `try/catch` + `await`, or `.catch` on async IIFE.
- Global handler for logging — not a substitute for local handling.

| Pros | Cons |
|------|------|
| Surfaces missing error paths | Can crash Node in production |
| Monitor with global listener | Fire-and-forget promises easy to miss |

**Cases:** Every `fetch`, `async` route handler, and fire-and-forget task needs a handler.

**Example:**

<details>
  <summary>Code</summary>

```js
// Bad
async function load() { throw new Error('fail'); }
load();

// Good
load().catch(console.error);
```

</details>

**Source:** [MDN unhandledrejection](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event)

</details>

<details>
  <summary>AbortController?</summary>

### AbortController?

**Definition:** API to cancel `fetch` and other operations via an `AbortSignal`.

**How it works:**

- Create controller; pass `signal` to `fetch`.
- Call `abort()` to cancel; promise rejects with `AbortError`.
- Use in React `useEffect` cleanup to cancel on unmount.
- `AbortSignal.timeout(ms)` for built-in timeout (modern runtimes).

| Pros | Cons |
|------|------|
| Stops stale requests | Not all APIs support signals |
| Prevents race conditions in UI | Must distinguish `AbortError` from real errors |
| Standard across fetch | One-shot — new controller per request |

**Cases:** Search autocomplete, route change, request timeout, `Promise.race` cleanup.

**Example:**

<details>
  <summary>Code</summary>

```js
const ac = new AbortController();
fetch('/api', { signal: ac.signal });
ac.abort(); // AbortError
```

</details>

**Source:** [javascript.info/fetch-abort](https://learn.javascript.ru/fetch-abort)

</details>

---

### Tasks

### Task 1 — Event loop output

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```

<details><summary>Answer</summary> A, D, C, B </details>

### Task 2 — Promise chain

```js
Promise.resolve(1)
  .then(x => x + 1)
  .then(x => { throw new Error('fail'); })
  .catch(() => 42)
  .then(console.log);
```

<details><summary>Answer</summary> `42` </details>

### Task 3 — Implement delay

```js
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Task 4 — promiseAll polyfill

```js
function promiseAll(iterable) { /* ... */ }
```

<details><summary>Solution</summary>

```js
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(iterable);
    if (arr.length === 0) return resolve([]);
    const results = [];
    let done = 0;
    arr.forEach((p, i) => {
      Promise.resolve(p).then(
        val => { results[i] = val; if (++done === arr.length) resolve(results); },
        reject
      );
    });
  });
}
```

</details>

### Task 5 — Retry with backoff

```js
async function retry(fn, retries = 3, delay = 100) { /* ... */ }
```

<details><summary>Solution</summary>

```js
async function retry(fn, retries = 3, delay = 100) {
  try {
    return await fn();
  } catch (e) {
    if (retries <= 0) throw e;
    await new Promise(r => setTimeout(r, delay));
    return retry(fn, retries - 1, delay * 2);
  }
}
```

</details>

---

<details>
  <summary>Coding tasks (legacy)</summary>

### Coding tasks (legacy)

10. What is the Event Loop? Callback queue.
11. What are promises? Solve the delay task.

</details>
