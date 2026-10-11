# React — Performance

Applied **render and network performance** — measure first, then fix waterfalls, bundles, and wasted renders.

[← Back to hub](./4_react.md)

### Related docs

- [React — Patterns](./4_react_patterns.md) · [React — Algorithms](./4_react_algorithms.md) · [Ecosystem — Performance](./4_react_ecosystem.md#10-performance) · [Profiler](./4_react_components.md#profiler)

### Main concepts

| Concept                       | Covers                                    |
| ----------------------------- | ----------------------------------------- |
| **Measure before memo**       | Profiler, React DevTools, real metrics    |
| **Request waterfalls**        | Parallelize fetches; Suspense + `use`     |
| **Render discipline**         | Pure components, context split, list keys |
| **Code splitting**            | `lazy`, route-level chunks                |
| **Expensive work off render** | `useMemo`, Web Workers, debounce          |
| **Production checklist**      | Bundle analyze, hydration, INP            |

### Sections

- [Overview](#overview)
- [Measurement](#measurement)
- [Network & data](#network-data)
- [Render & bundle](#render-bundle)

---

## Overview

<details>
  <summary>Overview</summary>

### Overview

**Definition:** React performance work targets **user-visible latency** (INP, LCP) and **wasted CPU** (re-renders, large lists) — not micro-optimizing every component.

**How it works:** Profile → find largest slice (network waterfall, one heavy subtree, huge bundle) → apply one pattern from this page → measure again.

**When to use:** Slow dashboards, janky typing, Lighthouse regressions after a feature ship.

**See also:** [When to memoize](./4_react_patterns.md#when-to-memoize) · [List rendering algorithm](./4_react_algorithms.md#list-rendering-algorithm)

**Sources:**

[react.dev/learn/render-and-commit](https://react.dev/learn/render-and-commit)

Measure before memo

</details>

### Measurement

<details>
  <summary>Measure before memo</summary>

### Measure before memo

**Definition:** Use **React DevTools Profiler** and browser **Performance** panel before adding `memo` everywhere. Optimize what actually costs time.

**How it works:**

1. Record interaction (filter table, open modal)
2. Inspect **commit duration** and **which components** re-rendered
3. Optional: wrap subtree in `<Profiler id="Sidebar" onRender={onRender} />` in dev
4. Fix root cause (unstable props, context blast radius) then memo leaves if needed

**When to use:** “App feels slow” with no hypothesis; before interview answer “I’d use useMemo”.

**Sources:**

[react.dev/reference/react/Profiler](https://react.dev/reference/react/Profiler)

Production checklist

</details>

<details>
  <summary>Production checklist</summary>

### Production checklist

**Definition:** Short list before shipping performance-sensitive UI.

**How it works:**

| Check     | Action                                                |
| --------- | ----------------------------------------------------- |
| Bundle    | Analyze with framework bundle tool; lazy heavy routes |
| Lists     | Stable keys; virtualize large tables                  |
| Images    | Sized, modern formats (framework Image)               |
| Fonts     | `font-display`, subset                                |
| Hydration | No server/client markup drift                         |
| INP       | Defer heavy work with `startTransition`               |

**See also:** [Core Web Vitals](./6_web_api_security.md)

**Sources:**

[web.dev — INP](https://web.dev/articles/inp)

Request waterfalls

</details>

### Network & data

<details>
  <summary>Request waterfalls</summary>

### Request waterfalls

**Definition:** **Waterfall** = request B starts only after A finishes because code `await`s sequentially in one component or effect chain.

**How it works:**

- Bad: parent `await user` then child `await posts` in series on server/client
- Good: `Promise.all([fetchUser(), fetchPosts()])` or parallel Server Components
- UI: nested **Suspense** so fast sections paint while slow fetches run

**When to use:** Page with header + sidebar + main all fetching; RSC apps with multiple `async` children.

**Examples:**

```tsx
const [user, posts] = await Promise.all([getUser(id), getPosts(id)]);
```

**See also:** [Concurrent UI](./4_react_concurrent.md) · [TanStack Query](./4_react_tanstack.md)

**Sources:**

[react.dev/reference/react/Suspense](https://react.dev/reference/react/Suspense)

Prefetch & preload

</details>

<details>
  <summary>Prefetch & preload</summary>

### Prefetch & preload

**Definition:** Start loading **before** the user navigates — hover on link, viewport prefetch, router `preload`.

**How it works:** Framework routers (Next.js, TanStack Router) prefetch route JS + data. Pair with `link` `prefetch` props or custom `onMouseEnter` + query `prefetchQuery`.

**When to use:** Known next click (pagination, tabs, wizard steps).

**See also:** [Next.js — Routing](./4_nextjs_routing.md)

**Sources:**

[react.dev/learn/synchronizing-with-effects](https://react.dev/learn/synchronizing-with-effects)

Render discipline

</details>

### Render & bundle

<details>
  <summary>Render discipline</summary>

### Render discipline

**Definition:** Keep renders **predictable** — pure presentational leaves, split context, avoid parent state that changes every frame unless needed.

**How it works:**

- Lift only shared state; derive the rest
- Do not put `{ ...config, tick: Date.now() }` on context value each render
- Split “layout shell” from “data table” so typing in search does not re-render chart

**See also:** [Context splitting](./4_react_patterns.md#context-splitting)

**Sources:**

[react.dev/learn/scaling-up-with-reducer-and-context](https://react.dev/learn/scaling-up-with-reducer-and-context)

Code splitting

</details>

<details>
  <summary>Code splitting</summary>

### Code splitting

**Definition:** Load JS for a route or widget **only when needed** via dynamic `import()` and `React.lazy`.

**How it works:**

```tsx
const Admin = lazy(() => import("./AdminPanel"));

<Suspense fallback={<Spinner />}>
  <Admin />
</Suspense>;
```

Framework file-based routing usually splits automatically; use `lazy` for heavy optional panels (charts, editors).

**When to use:** Admin-only modules, PDF viewer, map SDK.

**See also:** [`lazy`](./4_react_apis.md#lazy) · [Suspense](./4_react_components.md#suspense)

**Sources:**

[react.dev/reference/react/lazy](https://react.dev/reference/react/lazy)

</details>
