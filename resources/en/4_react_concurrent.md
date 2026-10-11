# React — Concurrent UI

**Concurrent React** features for responsive navigation and incremental loading — transitions, deferred values, and Suspense boundaries.

[← Back to hub](./4_react.md)

### Related docs

- [React — Algorithms](./4_react_algorithms.md) · [`useTransition`](./4_react_apis.md#starttransition) · [Suspense](./4_react_components.md#suspense) · [React 19](./4_react_server.md)

### Main concepts

| Concept                   | Covers                                   |
| ------------------------- | ---------------------------------------- |
| **Transitions**           | Non-urgent updates stay interruptible    |
| **useDeferredValue**      | Defer expensive derived UI               |
| **Suspense boundaries**   | Local fallbacks, avoid full-page spinner |
| **Nested Suspense**       | Shell fast, panels stream in             |
| **Navigation UX**         | `isPending` + keep previous layout       |
| **Errors in transitions** | Error boundaries around transition trees |

### Sections

- [Overview](#overview)
- [Transitions](#transitions)
- [Suspense UX](#suspense-ux)

---

## Overview

<details>
  <summary>Overview</summary>

### Overview

**Definition:** **Concurrent UI** lets React **prepare** updates in the background (transitions, Suspense) so urgent input (typing, clicks) stays smooth.

**How it works:** Mark slow updates with `startTransition` or suspend with `use`/data libraries; show fallbacks only around the slow subtree.

**When to use:** Tabbed apps, client-side “routing”, heavy filters, streaming RSC/SSR pages.

**Sources:**

[react.dev/blog/2022/03/29/react-v18](https://react.dev/blog/2022/03/29/react-v18)

Transitions

</details>

### Transitions

<details>
  <summary>Transitions</summary>

### Transitions

**Definition:** Updates inside **`startTransition`** are **non-urgent** — React may keep showing the previous UI and interrupt work if something urgent arrives.

**How it works:**

```tsx
const [isPending, startTransition] = useTransition();

function selectTab(id: string) {
  startTransition(() => setTab(id));
}
```

Use `isPending` for subtle chrome (dim header, disable tab) — not for blocking the whole page unless necessary.

**When to use:** Client tab switch, route state in SPA, applying heavy filter state.

**See also:** [useTransition for slow UI](./4_react_algorithms.md#usetransition-for-slow-ui)

**Sources:**

[react.dev/reference/react/useTransition](https://react.dev/reference/react/useTransition)

useDeferredValue

</details>

<details>
  <summary>useDeferredValue</summary>

### useDeferredValue

**Definition:** **`useDeferredValue(value)`** returns a lagging copy of `value` that React may update after urgent renders — good for keeping input instant while list re-filters.

**How it works:** Pair deferred value with memoized child list; input uses live `query`, table uses `deferredQuery`.

**When to use:** Large client filter where debounce feels laggy on the input itself.

**See also:** [Debounced search](./4_react_algorithms.md#debounced-search)

**Sources:**

[react.dev/reference/react/useDeferredValue](https://react.dev/reference/react/useDeferredValue)

Suspense UX

</details>

### Suspense UX

<details>
  <summary>Suspense boundaries</summary>

### Suspense boundaries

**Definition:** **`<Suspense fallback={...}>`** declares where to show placeholder UI while children suspend (async Server Components, `use(promise)`, `lazy`).

**How it works:**

- One giant boundary → whole page becomes spinner on navigation
- **Nested** boundaries → header stays, albums section shows skeleton

Place boundaries around **independently loading** regions.

**When to use:** Dashboard widgets, artist page (bio vs albums), any `lazy` route segment.

**Examples:**

```tsx
<Suspense fallback={<AlbumsSkeleton />}>
  <Albums artistId={id} />
</Suspense>
```

**Sources:**

[react.dev/reference/react/Suspense](https://react.dev/reference/react/Suspense)

Navigation without layout flash

</details>

<details>
  <summary>Navigation without layout flash</summary>

### Navigation without layout flash

**Definition:** Combine **`useTransition`** on route/tab state with **Suspense inside layout** so chrome does not unmount when only the main panel suspends.

**How it works:**

1. Wrap router outlet in transition when changing `page` state
2. Keep `Layout` outside inner Suspense boundaries
3. Show `isPending` on chrome, not full-screen blocker

**When to use:** Music-browser style demos; any SPA replacing content under fixed header.

**Sources:**

[react.dev/reference/react/Suspense](https://react.dev/reference/react/Suspense)

Errors in transitions

</details>

<details>
  <summary>Errors in transitions</summary>

### Errors in transitions

**Definition:** If code inside **`startTransition`** throws, surface it with an **error boundary** around that subtree — transitions do not replace try/catch.

**How it works:** Wrap transition-triggering component in `ErrorBoundary` (class `componentDidCatch` or `react-error-boundary`). Pending state clears; fallback UI shows.

**When to use:** Mutation buttons using transitions; lazy-loaded panels.

**See also:** [Resilience](./4_react_resilience.md)

**Sources:**

[react.dev/reference/react/useTransition](https://react.dev/reference/react/useTransition)

</details>
