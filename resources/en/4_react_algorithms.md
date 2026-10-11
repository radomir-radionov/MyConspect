# React — Algorithms

Step-by-step **UI logic** in React — filtering, debouncing, mutations, pagination, and scaling lists.

[← Back to hub](./4_react.md)

### Related docs

- [React — Patterns](./4_react_patterns.md) · [React — Hooks](./4_react_hooks.md) · [TanStack](./4_react_tanstack.md) · [React — Core](./4_react_core.md)

### Main concepts

| Concept                          | Covers                                  |
| -------------------------------- | --------------------------------------- |
| **Client filter & sort**         | Derive rows in render; stable sort keys |
| **Debounced search**             | Pause before network or heavy filter    |
| **Throttle vs debounce**         | Rate-limit scroll/resize vs input       |
| **Fetch with abort**             | Cancel stale requests                   |
| **Optimistic updates**           | Patch UI first, rollback on error       |
| **Pagination & infinite scroll** | Offset, cursor, `fetchNext`             |
| **useTransition for slow UI**    | Keep input responsive during heavy work |
| **List rendering algorithm**     | Keys, virtualization, context split     |

### Sections

- [Overview](#overview)
- [Data & filter algorithms](#data-filter-algorithms)
- [Async UI algorithms](#async-ui-algorithms)
- [List algorithms](#list-algorithms)

---

## Overview

<details>
  <summary>Overview</summary>

### Overview

**Definition:** **Algorithms** here mean repeatable procedures for UI behavior — when to fire a search, how to paginate, how to render large lists — implemented with state, effects, and framework data tools.

**How it works:** Pair each algorithm with clear **inputs**, **outputs**, and **failure modes** (stale requests, rollback, empty pages). Structural patterns (lifting, composition) live in [Patterns](./4_react_patterns.md).

**When to use:** Autocomplete, feeds, admin tables, optimistic toggles, interview “implement infinite scroll / debounce” tasks.

**Sources:**

[react.dev/reference/react/useDeferredValue](https://react.dev/reference/react/useDeferredValue) · [react.dev/learn/rendering-lists](https://react.dev/learn/rendering-lists)

Client filter & sort

</details>

### Data & filter algorithms

<details>
  <summary>Client filter & sort</summary>

### Client filter & sort

**Definition:** Filter and sort collections **during render** (or in `useMemo`) from props/query state — O(n) or O(n log n) per update, no extra `useEffect`.

**How it works:**

1. Keep `query`, `sortKey`, `sortDir` in state (or URL via nuqs)
2. `const visible = useMemo(() => { ... }, [items, query, sortKey])`
3. Normalize strings once (`toLowerCase`) for case-insensitive search
4. Sort with **stable** tie-breaker (e.g. `id`) when keys compare equal

**When to use:** < few thousand rows client-side; move to server pagination when latency or memory hurts.

**Examples:**

```tsx
function useFiltered<T>(items: T[], query: string, pick: (item: T) => string) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => pick(item).toLowerCase().includes(q));
  }, [items, query, pick]);
}
```

**See also:** [Debounced search](#debounced-search) · [Thinking in React](./4_react_patterns.md#thinking-in-react)

**Sources:**

[react.dev/learn/thinking-in-react](https://react.dev/learn/thinking-in-react)

Throttle vs debounce

</details>

<details>
  <summary>Throttle vs debounce</summary>

### Throttle vs debounce

**Definition:** **Debounce** runs after input **stops** for `ms` (search). **Throttle** runs at most once per `ms` while events fire (scroll, resize).

**How it works:**

| Technique | Fires when                          | Typical use              |
| --------- | ----------------------------------- | ------------------------ |
| Debounce  | Quiet period after last event       | Search box, autosave     |
| Throttle  | Every `ms` during continuous events | Scroll spy, resize chart |

Do not debounce every keystroke display — only the **expensive** side (API). Keep controlled input instant.

**When to use:** Interview “difference debounce/throttle”; infinite scroll load-more often uses throttle or intersection, not debounce.

**Sources:**

[MDN — setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)

Fetch with abort

</details>

### Async UI algorithms

<details>
  <summary>Fetch with abort</summary>

### Fetch with abort

**Definition:** Attach an **`AbortController`** per request; abort on dependency change or unmount so late responses do not overwrite newer data.

**How it works:**

1. Effect creates `const ac = new AbortController()`
2. `fetch(url, { signal: ac.signal })`
3. Cleanup: `ac.abort()`
4. Ignore `AbortError`; handle real errors in UI

TanStack Query does this via **query keys** and automatic cancellation — prefer for server state.

**When to use:** Manual `useEffect` fetch; typeahead; tab switches mid-request.

**Examples:**

```tsx
useEffect(() => {
  const ac = new AbortController();
  (async () => {
    const res = await fetch(`/api?q=${query}`, { signal: ac.signal });
    const data = await res.json();
    setResults(data);
  })().catch((e) => {
    if (e.name !== "AbortError") setError(e);
  });
  return () => ac.abort();
}, [query]);
```

**See also:** [TanStack Query](./4_react_tanstack.md) · [You might not need an effect](./4_react_hooks.md#you-might-not-need-an-effect)

**Sources:**

[MDN — AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

Debounced search

</details>

<details>
  <summary>Debounced search</summary>

<details>
  <summary>Debounced search</summary>

### Debounced search

**Definition:** Wait until the user **pauses typing** before firing an expensive filter or network search — reduces work and avoids racey partial queries.

**How it works:**

1. Keep **immediate** `query` in state for the input
2. Keep **debouncedQuery** (custom hook or `useDeferredValue`) for fetch/filter
3. Cancel or ignore stale responses (`AbortController`, query keys in TanStack Query)

**When to use:** Autocomplete, admin tables, any keystroke-triggered API.

**Examples:**

```tsx
function useDebounced<T>(value: T, ms: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}
```

**See also:** [`useDeferredValue`](./4_react_hooks.md#usedeferredvalue) · [TanStack Query](./4_react_tanstack.md)

**Sources:**

[react.dev/reference/react/useDeferredValue](https://react.dev/reference/react/useDeferredValue)

Optimistic updates

</details>

<details>
  <summary>Optimistic updates</summary>

### Optimistic updates

**Definition:** Update the UI **before** the server confirms success; **roll back** on error. Makes mutations feel instant while keeping server as source of truth.

**How it works:**

1. Snapshot current cache/state
2. Apply optimistic patch locally
3. `await` mutation
4. On failure: restore snapshot + show error; on success: reconcile with server response

**When to use:** Likes, toggles, reorder lists — not for irreversible actions without confirmation.

**Examples:**

```tsx
async function toggleTodo(id: string) {
  const prev = todos;
  setTodos((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  try {
    await api.toggleTodo(id);
  } catch {
    setTodos(prev);
  }
}
```

**See also:** [Actions](./4_react_server.md#actions) · [`useOptimistic`](./4_react_hooks.md)

**Sources:**

[react.dev/reference/react/useOptimistic](https://react.dev/reference/react/useOptimistic)

Pagination & infinite scroll

</details>

<details>
  <summary>Pagination & infinite scroll</summary>

### Pagination & infinite scroll

**Definition:** **Pagination** loads fixed pages (cursor/offset); **infinite scroll** appends the next page when the user nears the list end — both need stable **keys** and clear loading/error UI.

**How it works:**

| Approach        | State you track                           | Pitfall                            |
| --------------- | ----------------------------------------- | ---------------------------------- |
| Page buttons    | `page`, `pageSize`, total count           | Double fetch on fast clicks        |
| Cursor          | `cursor`, `hasMore`                       | Stale cursor after mutations       |
| Infinite scroll | `pages[]` or flattened list + `fetchNext` | Scroll jank without virtualization |

Use `IntersectionObserver` or library helpers; pair large lists with [virtualization](./4_react_tanstack.md).

**When to use:** Feeds, tables with thousands of rows, mobile lists.

**Sources:**

[MDN — Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

useTransition for slow UI

</details>

<details>
  <summary>useTransition for slow UI</summary>

### useTransition for slow UI

**Definition:** Mark non-urgent state updates as **transitions** so React keeps the UI responsive (input stays snappy) while a heavy re-render or filter runs.

**How it works:** `const [pending, startTransition] = useTransition()` — wrap `setState` that triggers slow tree work. Show `pending` on secondary UI (spinner on list, not on text field).

**When to use:** Large client-side filter, tab switch with heavy chart, route prefetch.

**Examples:**

```tsx
const [query, setQuery] = useState("");
const [pending, startTransition] = useTransition();

function onChange(value: string) {
  setQuery(value); // urgent — input
  startTransition(() => {
    setDeferredFilter(value); // heavy table filter
  });
}
```

**See also:** [`startTransition`](./4_react_apis.md#starttransition) · [`useDeferredValue`](./4_react_hooks.md#usedeferredvalue)

**Sources:**

[react.dev/reference/react/useTransition](https://react.dev/reference/react/useTransition)

Async validation algorithm

</details>

<details>
  <summary>Async validation algorithm</summary>

### Async validation algorithm

**Definition:** Validate form fields on blur or submit with **async** rules (username taken, VAT check) without racing older responses.

**How it works:**

1. Track `fieldErrors` + `validating` flags per field
2. On blur/submit, increment **request id** or abort prior check
3. Only apply result if `id` still matches latest
4. Disable submit while `validating` or `isPending` from Actions

Prefer schema libs (Zod) for sync rules; async layer for server checks.

**When to use:** Sign-up, checkout, admin forms with server-side uniqueness.

**See also:** [Actions](./4_react_server.md#actions) · [Controlled vs uncontrolled](./4_react_patterns.md#controlled-vs-uncontrolled)

**Sources:**

[react.dev/reference/react-dom/components/form](https://react.dev/reference/react-dom/components/form)

List rendering algorithm

</details>

### List algorithms

<details>
  <summary>List rendering algorithm</summary>

### List rendering algorithm

**Definition:** Rendering `n` items is **O(n)** reconciliation work per update. Procedure: derive rows, assign stable **keys**, **virtualize** when `n` is large.

**How it works:**

1. Derive `visibleRows` from props + filters (single pass if possible)
2. `rows.map(row => <Row key={row.id} … />)` — avoid `key={index}` when the list reorders
3. If `visibleRows.length` > ~100–500, window with TanStack Virtual or similar
4. Split context so rows do not re-render when unrelated global state changes

**When to use:** Tables, feeds, nested trees; common interview “optimize this list”.

**See also:** [Reconciliation](./4_react_core.md#reconciliation) · [When to memoize](./4_react_patterns.md#when-to-memoize)

**Sources:**

[react.dev/learn/rendering-lists](https://react.dev/learn/rendering-lists) · [react.dev/learn/preserving-and-resetting-state](https://react.dev/learn/preserving-and-resetting-state)

Tree flatten algorithm

</details>

<details>
  <summary>Tree flatten algorithm</summary>

### Tree flatten algorithm

**Definition:** Turn nested data (folders, comments) into a **visible row list** for virtualized tables — expand/collapse toggles which nodes appear.

**How it works:**

1. Walk tree DFS; push `{ id, depth, node }` when ancestors expanded
2. Recompute `visibleRows` when `expandedIds` or data changes (`useMemo`)
3. Row component uses `paddingLeft: depth * 12` for indent
4. Stable `key={node.id}` — never reuse keys across different nodes

**When to use:** File trees, threaded comments, nested admin menus with thousands of nodes.

**See also:** [List rendering algorithm](#list-rendering-algorithm) · [TanStack Table](./4_react_tanstack.md)

**Sources:**

[react.dev/learn/rendering-lists](https://react.dev/learn/rendering-lists)

</details>
