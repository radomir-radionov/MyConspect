# React — Interview

Interview Q&A and coding tasks.

[← Back to hub](./4_react.md)

### Related docs

- [React — Core](./4_react_core.md) · [React — Hooks](./4_react_hooks.md) · [React — React 19](./4_react_server.md) · [React — Ecosystem](./4_react_ecosystem.md) · [React — Redux](./4_react_redux.md) · [React — Interview](./4_react_interview.md)

### Sections

- [Questions & Answers](#questions-answers)
- [Coding tasks](#coding-tasks)

---

## Questions & Answers

State vs props?

<details>
  <summary>State vs props?</summary>

### State vs props?

**Answer:** **Props** = read-only inputs from the parent. **State** = data the component owns; the setter schedules a re-render. Share across siblings → lift to the closest parent.

**See also:** [State vs props](#state-vs-props) · [Lifting state up](./4_react_core.md#lifting-state-up)

Why hooks? Custom hooks?

</details>

<details>
  <summary>Why hooks? Custom hooks?</summary>

### Why hooks? Custom hooks?

**Answer:** Hooks let function components hold state and sync with the outside world without classes or `this`. Related logic sits together (`useEffect` for a subscription) instead of being split across `componentDidMount` / `componentDidUpdate` / `componentWillUnmount`. Custom `useX` reuses **that logic**; each call has its **own** state — two `useForm()` calls are two forms, not one shared store. Call order must be stable every render → [Rules of Hooks](./4_react_hooks.md#rules-of-hooks) (no hooks in `if` / loops; `eslint-plugin-react-hooks`). Classes remain for error boundaries if you don’t use a library.

**See also:** [Hooks reference](./4_react_hooks.md#5-hooks-reference) · [Custom hooks](./4_react_hooks.md#custom-hooks)

Fragments and portals?

</details>

<details>
  <summary>Fragments and portals?</summary>

### Fragments and portals?

**Answer:** **Fragment** (`<>`) = extra grouping, zero DOM. **Portal** (`createPortal`) = DOM elsewhere (`document.body`) but React tree/events stay with the parent.

**See also:** [Fragments](./4_react_core.md#fragments) · [Portals](./4_react_hooks.md#portals)

useRef vs createRef?

</details>

<details>
  <summary>useRef vs createRef?</summary>

### useRef vs createRef?

**Answer:** `useRef` is stable across renders. `createRef()` in a function body is a **new object every render** — use it only on class instances.

**See also:** [useRef](./4_react_hooks.md#useref)

Virtual DOM and reconciliation?

</details>

<details>
  <summary>Virtual DOM and reconciliation?</summary>

### Virtual DOM and reconciliation?

**Answer:** Diff **element trees** (plain objects) by `type` + `key` — not a live DOM clone. Re-render ≠ DOM write. Fiber makes the walk interruptible.

**See also:** [Virtual DOM & reconciliation](./4_react_core.md#virtual-dom--reconciliation) · [React Fiber](./4_react_core.md#react-fiber)

Why list keys? Index as key?

</details>

<details>
  <summary>Why list keys? Index as key?</summary>

### Why list keys? Index as key?

**Answer:** `key` is identity across renders. Index is OK only for **static** lists. Reorder/filter + index → wrong instance reuse and stale state. Never `key={Math.random()}`.

**See also:** [Keys](./4_react_core.md#keys)

Context vs Redux vs Zustand vs React Query?

</details>

<details>
  <summary>Context vs Redux vs Zustand vs React Query?</summary>

### Context vs Redux vs Zustand vs React Query?

**Answer:** Context = rare shared values (theme/auth). Redux/Zustand = client app state. TanStack Query = server cache. URL = shareable filters. Don't put a hot cart in one Context.

**See also:** [Context](./4_react_core.md#context) · [Redux core principles](./4_react_redux.md#redux-core-principles) · [When to use Redux](./4_react_redux.md#when-to-use-redux) · [TanStack Query vs RTK Query](./5_ts_tanstack.md#tanstack-query-vs-rtk-query)

How does React.lazy load a component when a condition becomes true?

</details>

<details>
  <summary>How does React.lazy load a component when a condition becomes true?</summary>

### How does React.lazy load a component when a condition becomes true?

**Answer:** `lazy(() => import('./X'))` stores a loader. First render of `<X />` runs `import()`, Suspense shows fallback, React caches `default`. Later remounts reuse the chunk.

**See also:** [React.lazy + Suspense](./4_react_hooks.md#reactlazy--suspense)

useEffect vs useLayoutEffect?

</details>

<details>
  <summary>useEffect vs useLayoutEffect?</summary>

### useEffect vs useLayoutEffect?

**Answer:** After DOM commit: `useInsertionEffect` (CSS-in-JS) → `useLayoutEffect` (**sync, before paint**, blocks the user from seeing a wrong frame) → browser paint → `useEffect` (after paint, default). Fetch, subscriptions, analytics → `useEffect`. Measure tooltip/focus without flicker → `useLayoutEffect`. Effects are **client-only**. Don’t treat them as `componentDidMount` — cleanup also runs when **deps change**, and Strict Mode runs an extra setup/cleanup in development.

**See also:** [useEffect](./4_react_hooks.md#useeffect) · [useLayoutEffect](./4_react_hooks.md#uselayouteffect) · [Render pipeline](./4_react_core.md#render-pipeline)

React library or framework?

</details>

<details>
  <summary>React library or framework?</summary>

### React library or framework?

**Answer:** React is a **library** (you compose the stack). Next.js / React Router framework mode **invert control** (file routes, SSR/RSC).

**See also:** [Library vs framework](./4_react_core.md#library-vs-framework)

What is React?

</details>

<details>
  <summary>What is React?</summary>

### What is React?

**Answer:** JS **library** for UIs from components — describe `UI = f(state)`; React reconciles the DOM.

**See also:** [React overview](./4_react_core.md#react-overview)

What is JSX? What does it compile to?

</details>

<details>
  <summary>What is JSX? What does it compile to?</summary>

### What is JSX? What does it compile to?

**Answer:** Sugar for `createElement(type, props, ...children)`. Not HTML: `className`, camelCase, `{expr}`.

**See also:** [JSX](./4_react_core.md#jsx)

What happens when a component renders?

</details>

<details>
  <summary>What happens when a component renders?</summary>

### What happens when a component renders?

**Answer:** React **calls** the function → element snapshot. Then commit may (or may not) touch the DOM. Concurrent render can repeat before one commit.

**See also:** [Render pipeline](./4_react_core.md#render-pipeline)

What is `useState`? Why not mutate state?

</details>

<details>
  <summary>What is `useState`? Why not mutate state?</summary>

### What is `useState`? Why not mutate state?

**Answer:** `useState` returns `[snapshot, set]`. `set` **queues** the next render; it does not change the variable in the current closure (`console.log(count)` after `setCount` still shows the old value). React skips the update if `Object.is(next, current)` — mutating `items.push(x)` then `setItems(items)` keeps the same reference, so the UI may not update. Copy: `setItems([...items, x])` or an updater `setItems(prev => [...prev, x])`. Lazy init: pass `useState(createTodos)` not `createTodos()`. Prefer `useReducer` when many related fields change together.

**See also:** [useState](./4_react_hooks.md#usestate) · [Task 2 — State mutation](#task-2--state-mutation)

`useEffect` and the dependency array?

</details>

<details>
  <summary>`useEffect` and the dependency array?</summary>

### `useEffect` and the dependency array?

**Answer:** After paint, React compares each dep with `Object.is`. **No array** = every commit. **`[]`** = first commit only (plus Strict Mode’s extra cycle in dev). **`[id, url]`** = re-run when those change: cleanup (old values) then setup (new values). List every reactive value the effect reads (`eslint` `exhaustive-deps`). Missing deps → stale closures. Object/function created in render as a dep → re-run every time. Prefer creating that object **inside** the effect; don’t make the effect callback `async`.

**See also:** [useEffect](./4_react_hooks.md#useeffect) · [Task 3 — Object dependency in useEffect](#task-3--object-dependency-in-useeffect)

Stale closures?

</details>

<details>
  <summary>Stale closures?</summary>

### Stale closures?

**Answer:** A function “closes over” the props/state from the render that created it. An effect with `[]` that reads `count` always sees the **first** `count`. Fix: add `count` to deps, or use a functional updater `setCount(c => c + 1)`, or React 19.2 `useEffectEvent` for “read latest without re-subscribing.” Don’t “fix” it by omitting the deps array unless you truly want to re-run after every commit.

**See also:** [useEffect](./4_react_hooks.md#useeffect) · [useEffectEvent](./4_react_hooks.md#useeffectevent-react-192)

Why does `useEffect` run twice on mount?

</details>

<details>
  <summary>Why does `useEffect` run twice on mount?</summary>

### Why does `useEffect` run twice on mount?

**Answer:** **Strict Mode, development only.** React runs setup → cleanup → setup to prove cleanup undoes setup. Production mounts once. Double network calls mean you need `AbortController` / ignore flag / real disconnect — not `useRef` to skip the second run.

**See also:** [Strict Mode](./4_react_core.md#strict-mode) · [useEffect](./4_react_hooks.md#useeffect)

`useState` vs `useReducer`?

</details>

<details>
  <summary>`useState` vs `useReducer`?</summary>

### `useState` vs `useReducer`?

**Answer:** Same storage. `useState` for one value or independent fields. `useReducer` when the next state is a **transition** (`action` → new state): forms, wizards, “this field depends on that.” `dispatch` is stable; `setState` is too, but you often pass many setters. Not a replacement for Redux/Zustand (those are **global**).

**See also:** [useState](./4_react_hooks.md#usestate) · [useReducer](#usereducer-1)

`useRef` vs `useState`?

</details>

<details>
  <summary>`useRef` vs `useState`?</summary>

### `useRef` vs `useState`?

**Answer:** Both persist across renders. `ref.current = x` does **not** re-render (DOM node, timer id, previous value). `setState` **does** — use it for anything on screen. Don’t read/write refs during render. `useRef` ≠ `createRef()` in function components (`createRef` is a new object every render).

**See also:** [useRef](./4_react_hooks.md#useref) · [State](./4_react_core.md#state)

`useCallback` vs `useMemo`?

</details>

<details>
  <summary>`useCallback` vs `useMemo`?</summary>

### `useCallback` vs `useMemo`?

**Answer:** `useMemo(() => compute(), deps)` **runs** `compute` and caches the **result**. `useCallback(fn, deps)` caches **`fn` itself** (equivalent to `useMemo(() => fn, deps)`). Useful when a `memo` child would re-render because of a new function, or when the function is an effect dep. Not useful on every handler. Prefer moving functions **inside** `useEffect` over memoizing them as deps. Compiler can replace a lot of this.

**See also:** [useMemo / useCallback](./4_react_hooks.md#usememo--usecallback)

What are custom hooks?

</details>

<details>
  <summary>What are custom hooks?</summary>

### What are custom hooks?

**Answer:** `function useX()` that calls other hooks. Share **behavior** (subscribe, form dirty-check), not JSX and not automatically shared state. Each call site is independent. The `use` prefix is how the linter applies the Rules of Hooks. Prefer hooks over HOCs for the same logic.

**See also:** [Custom hooks](./4_react_hooks.md#custom-hooks)

Context API — when to use?

</details>

<details>
  <summary>Context API — when to use?</summary>

### Context API — when to use?

**Answer:** Theme, locale, auth — many consumers, rare updates. Not a hot store. Else: props, composition, lift state, URL, Zustand.

**See also:** [Context](./4_react_core.md#context)

HOC — what, why less common, vs hooks?

</details>

<details>
  <summary>HOC — what, why less common, vs hooks?</summary>

### HOC — what, why less common, vs hooks?

**Answer:** `(Component) => Enhanced` injects props. Wrapper hell + prop clashes. Prefer hooks for the same logic.

**See also:** [Composition patterns](./4_react_core.md#composition-patterns)

Why did hooks replace class components?

</details>

<details>
  <summary>Why did hooks replace class components?</summary>

### Why did hooks replace class components?

**Answer:** Related logic lives in one function (`useEffect` setup + cleanup) instead of three class methods. No `this` binding. Reuse via custom hooks instead of HOCs. Classes still exist (error boundaries unless a library provides one). Hooks are not “faster” by themselves — they match the function-component model.

**See also:** [Class components (legacy)](./4_react_ecosystem.md#class-components-legacy)

Why extra re-renders? How to reduce them?

</details>

<details>
  <summary>Why extra re-renders? How to reduce them?</summary>

### Why extra re-renders? How to reduce them?

**Answer:** Parent/context/`memo` broken by new `{}`/`() =>`. Fix: move state down, split context, then `memo`/Compiler, virtualize lists. Profile first.

**See also:** [Diagnosing re-renders](./4_react_ecosystem.md#diagnosing-re-renders)

Why avoid creating objects in render?

</details>

<details>
  <summary>Why avoid creating objects in render?</summary>

### Why avoid creating objects in render?

**Answer:** `style={{}}` / `onClick={() =>}` is a new reference each time → `memo` children still re-render. Stabilize with `useMemo` / `useCallback` when it matters.

**See also:** [memo / useMemo / useCallback vs Compiler](./4_react_ecosystem.md#memo--usememo--usecallback-vs-compiler)

React Fiber and concurrent rendering?

</details>

<details>
  <summary>React Fiber and concurrent rendering?</summary>

### React Fiber and concurrent rendering?

**Sequence:** Queue update → render WIP (DFS: `beginWork` ↓ / `completeWork` ↑) → commit flags to DOM. Render is interruptible; commit is not. Render ≠ paint.

**Chunks:** Fibers until `shouldYield()` (~5ms) — pause _between_ fibers, resume next; commit never yields.

**Priority:** Scheduler _when_; lanes _which_ (sync > input > default > transition > idle). Urgent discards WIP. APIs: `useTransition`, `useDeferredValue`, `Suspense`, `createRoot`.

**Thoughts:** _Work loop reconciles in memory; commit flushes atomically; Scheduler decides when._

**See also:** [React Fiber](./4_react_core.md#react-fiber) · [Concurrent rendering](./4_react_core.md#concurrent-rendering)

React and the browser DOM?

</details>

<details>
  <summary>React and the browser DOM?</summary>

### React and the browser DOM?

**Definition:** `react-dom` bridges React's element tree to real DOM nodes via `createRoot`.

**How it works:**

- Reconciliation diffs trees — only changed nodes update
- Batches multiple `setState` calls into one commit (React 18+)
- Event delegation via synthetic events
- Fiber prioritizes urgent updates

`setState` **from browser view:** Schedules render → reconcile → commit DOM mutations → layout → paint → run effects.

**Thoughts:** _React is faster than naive direct DOM not because VDOM is magic — because it batches, diffs, and minimizes writes._

**See also:**

[Virtual DOM and reconciliation?](#virtual-dom-and-reconciliation)

SPA first render vs SSR?

</details>

<details>
  <summary>SPA first render vs SSR?</summary>

### SPA first render vs SSR?

**Definition:**

**SPA (CSR):** browser downloads JS bundle, executes, builds DOM client-side — blank/skeleton until JS runs. **SSR:** server sends HTML with content; browser hydrates.

|               | SPA (CSR)              | SSR               |
| ------------- | ---------------------- | ----------------- |
| First paint   | Slow (needs JS)        | Fast (HTML ready) |
| SEO           | Weak without prerender | Strong            |
| Interactivity | After hydration        | After hydration   |

**Thoughts:** _SPA = client builds UI; SSR = server sends HTML first._

**See also:**

[SPA vs SSR vs RSC](./4_react_server.md#8-server-rendering--rsc) · [4_nextjs.md Interview Practice](./4_nextjs_interview.md#interview-practice) · [Types of web apps](./6_web_api_apps.md#types-of-web-apps)

TanStack Query vs RTK Query — when?

</details>

<details>
  <summary>TanStack Query vs RTK Query — when?</summary>

### TanStack Query vs RTK Query — when?

**Definition:** Both cache **server** state. Pick TanStack Query unless the app already lives in Redux Toolkit.

**How it works:**

Query keys identify data; mutations invalidate keys. RTK Query generates hooks from `createApi` and stores the cache in Redux. UI toggles and form drafts stay in `useState` / Zustand — not in the server cache.

| Pick               | When                                      |
| ------------------ | ----------------------------------------- |
| **TanStack Query** | New SPA, Zustand/Context for client state |
| **RTK Query**      | Existing RTK store, one DevTools tree     |
| **RSC** `fetch`    | Next.js App Router initial page data      |

**Thoughts:** Server cache ≠ client store.

**See also:**

[TanStack Query vs RTK Query](./5_ts_tanstack.md#tanstack-query-vs-rtk-query)

How do you hide an Edit button the user cannot use?

</details>

<details>
  <summary>How do you hide an Edit button the user cannot use?</summary>

### How do you hide an Edit button the user cannot use?

**Definition:** Authorization (CASL) can hide UI, but the **mutation must deny** on the server.

**How it works:** `<Can I="update" this={article}>` wraps the button. Server Action / API still calls `ability.cannot('update', article)` and returns 403. Roles map to rules; attributes (`authorId`) enable ABAC.

**Thoughts:** Hide in UI; enforce on the server.

**See also:**

[CASL](./4_react_ecosystem.md#9-ecosystem--architecture)

Is shadcn/ui an npm component library?

</details>

<details>
  <summary>Is shadcn/ui an npm component library?</summary>

### Is shadcn/ui an npm component library?

**Definition:** No — the CLI copies source into `components/ui`. You own and edit the files (Radix + Tailwind).

**When to use:** Product UI you will customize. When NOT: you need a locked third-party kit with only semver upgrades.

**Thoughts:** Distribution of source, not a black-box dependency.

**See also:**

[shadcn/ui](./4_react_ecosystem.md#9-ecosystem--architecture)

nuqs vs useSearchParams vs qs?

</details>

<details>
  <summary>nuqs vs useSearchParams vs qs?</summary>

### nuqs vs useSearchParams vs qs?

**Definition:** `useSearchParams` (Next.js) is a raw `URLSearchParams` view. **nuqs** adds typed parsers and `useState`-like setters. **qs** parses/stringifies nested objects (`a[b]=1`) — useful on the server, not a React state layer.

**How it works:** Prefer nuqs when UI writes many typed filters to the URL. Prefer `useSearchParams` + `router.push` for a single throwaway param. Prefer `qs` (or `URLSearchParams`) when you only serialize on the API, not in React.

**Thoughts:** nuqs is URL _state_. Query is server _cache_.

**See also:**

[nuqs](./4_react_ecosystem.md#9-ecosystem--architecture)

---

Junior — React

</details>

### Junior — React

1. Have you worked with class components? What are their characteristics? → [Class components (legacy)](./4_react_ecosystem.md#11-legacy--migration)
2. What data belongs in component state vs props? Give an example. → [State vs props?](#questions--answers)
3. Are you familiar with hooks? What are their advantages? Have you written custom hooks and why? → [Why hooks? Custom hooks?](#questions--answers)
4. Are you familiar with fragments and portals? What are they for? → [Fragments](./4_react_core.md#fragments) · [Fragments and portals?](#questions--answers)
5. When and why are refs used? → [useRef vs createRef?](#questions--answers)
6. What component lifecycle methods do you know? → [Section 11 — Legacy](./4_react_ecosystem.md#11-legacy--migration)
7. In which lifecycle method (or hook) should you fetch from the server? Why? → [useEffect vs useLayoutEffect?](#questions--answers)
8. In which lifecycle method should you subscribe and unsubscribe from listeners? Why unsubscribe? → [useEffect](./4_react_hooks.md#5-hooks-reference)
9. Have you worked with Context? When should you use it? → [Context vs Redux vs Zustand vs React Query?](#questions--answers)
10. What is special about `PureComponent`? → [PureComponent](./4_react_ecosystem.md#11-legacy--migration)
11. Have you worked with memoized selectors? What are they for and how do they work?
12. What advantages do you see in React?
13. Why is React fast? What is the Virtual DOM? → [Virtual DOM & reconciliation](./4_react_core.md#virtual-dom--reconciliation)
14. Why do lists need keys? Can array indices be keys? When is that acceptable? → [Why list keys? Index as key?](#questions--answers)
15. What is the core idea of Redux? → [Redux core principles](./4_react_redux.md#redux-core-principles)
16. Working with styles in React → [Styling in React](./4_react_ecosystem.md#9-ecosystem--architecture) · CSS basics: [2_css.md](2_css.md)
17. Is React a library or a framework? What is the difference? → [React library or framework?](#questions--answers)
18. Can you use jQuery together with React? Why or why not?
19. What is a codemod?
20. How do you build good architecture for a React project? → [Feature-Sliced Design (FSD)](./4_react_ecosystem.md#9-ecosystem--architecture)
21. List libraries you have used with React. → [TanStack Query vs RTK Query](./5_ts_tanstack.md#tanstack-query-vs-rtk-query) · [CASL](./4_react_ecosystem.md#9-ecosystem--architecture) · [shadcn/ui](./4_react_ecosystem.md#9-ecosystem--architecture) · [orval](./4_react_ecosystem.md#9-ecosystem--architecture)
22. What is the hardest thing you have implemented with React?

Middle — React

### Middle — React

1. What is JSX? What is it based on? → [JSX](./4_react_core.md#3-describing-the-ui)
2. How does the Virtual DOM algorithm work? → [Virtual DOM & reconciliation](./4_react_core.md#virtual-dom--reconciliation)
3. Why is the `key` property needed when rendering lists? → [Keys](./4_react_core.md#2-rendering-model)
4. What is the difference between function and class components? → [Class components (legacy)](./4_react_ecosystem.md#11-legacy--migration)
5. Why and when must you pass props to `super()` in class components?
6. Why must you use `setState()` to update internal component state?
7. What is "lifting state up"? → [Lifting state up](./4_react_core.md#4-state--interactivity)
8. What state management libraries for React do you know? Why are they needed? → [State management libraries](./4_react_redux.md#state-management-libraries)
9. When should you use Redux? What are the alternatives?
10. Redux vs MobX?
11. Explain the basic principle of React Hooks. → [Hooks reference](./4_react_hooks.md#5-hooks-reference)
12. What is the difference between `createRef` and `useRef`? → [useRef vs createRef?](#questions--answers)
13. When should you use React refs? When should you not?
14. What disadvantages of React do you see?
15. What patterns do you use with React? → [Composition patterns](./4_react_core.md#3-describing-the-ui)
16. How do you feel about typing with React? → [TypeScript](./5_ts.md)
17. How do you build good architecture for a React project? → [Feature-Sliced Design (FSD)](./4_react_ecosystem.md#9-ecosystem--architecture)
18. How do you optimize React apps? How do you measure performance? → [Performance](./4_react_ecosystem.md#10-performance)
19. Can you embed one React app inside another React app?

Junior — Practical tasks (React project)

### Junior — Practical tasks (React project)

1. Build a mini project — user list with create/edit form (Firebase + Bootstrap).

Middle — Practical tasks (React)

### Middle — Practical tasks (React)

1. Implement a table with virtual scroll.

## Coding tasks

Task 1 — Unstable list keys

<details>
  <summary>Task 1 — Unstable list keys</summary>

### Task 1 — Unstable list keys

What happens on every render?

```tsx
const UserList = ({ users }) => {
  return users.map((user) => <UserCard key={Math.random()} user={user} />);
};
```

Fix:

```tsx
const UserList = ({ users }) => {
  return users.map((user) => <UserCard key={user.id} user={user} />);
};
```

Answer

`Math.random()` produces a **new key on every render**. React treats each `UserCard` as a **different element** — it unmounts the old instance and mounts a new one. That causes:

- unnecessary re-renders and DOM churn
- lost local state inside `UserCard` (inputs, expanded rows, etc.)
- broken animations and focus

Use a **stable, unique** key (`user.id`). Index is acceptable only when the list is static and never reordered.

Task 2 — State mutation

</details>

<details>
  <summary>Task 2 — State mutation</summary>

### Task 2 — State mutation

What is wrong? Why might the UI not update?

```tsx
const [user, setUser] = useState({ name: "Anna" });

user.name = "Kate";
console.log(user.name); // "Kate"
setUser(user);
```

Answer

`useState` compares the **previous and next state by reference** (`Object.is`). Mutating `user.name` changes the object in place but **does not change the reference**, so React skips a re-render.

Fix — return a **new object**:

```tsx
setUser({ ...user, name: "Kate" });
// or
setUser((prev) => ({ ...prev, name: "Kate" }));
```

`console.log(user.name)` prints `"Kate"` because the mutation happened in memory; the UI simply did not get a new render cycle.

Task 3 — Object dependency in useEffect

</details>

<details>
  <summary>Task 3 — Object dependency in useEffect</summary>

### Task 3 — Object dependency in useEffect

Find the cause:

```tsx
useEffect(() => {
  loadData();
}, [filters]); // filters is an object recreated every render
```

Fix:

```tsx
const filters = useMemo(() => ({ name, isActive }), [name, isActive]);

useEffect(() => {
  loadData();
}, [name, isActive]);
```

Answer

A **new** `filters` **object** is created on every render (`{}` !== `{}` by reference). `useEffect` sees a changed dependency each time → `loadData()` runs in a loop or far too often.

Options:

1. Depend on **primitives** (`name`, `isActive`) instead of the object.
2. Memoize the object with `useMemo` when you must pass a composite value.
3. Pass `filters` into `loadData(filters)` and list stable fields in the dependency array.

Task 4 — Async fetch in useEffect

</details>

<details>
  <summary>Task 4 — Async fetch in useEffect</summary>

### Task 4 — Async fetch in useEffect

Fix the problem:

```tsx
const fetchData = async () => {
  const data = await api.get();
  setData(data);
};

useEffect(() => {
  fetchData();
}, []);
```

Answer

Problems:

1. **Race condition** — if the component unmounts or `fetchData` runs again, a late response can call `setState` on an unmounted component.
2. **No cancellation** — stale responses can overwrite newer data.
3. `useEffect` **callback must not be** `async` — an async function returns a Promise; React ignores it and cannot treat it as a cleanup function.

Fix — inline async IIFE + `AbortController`:

```tsx
useEffect(() => {
  const controller = new AbortController();

  (async () => {
    try {
      const data = await api.get({ signal: controller.signal });
      setData(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err);
      }
    }
  })();

  return () => controller.abort();
}, []);
```

Alternatively use a data-fetching library (TanStack Query, SWR) or React 19 `use()` with Suspense — they handle abort, deduplication, and caching.

</details>
