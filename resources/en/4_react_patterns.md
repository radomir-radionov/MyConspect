# React — Patterns

Repeatable **component and state shapes** — how to place state, compose UI, and avoid effect smells in real features.

[← Back to hub](./4_react.md)

### Related docs

- [React — Algorithms](./4_react_algorithms.md) · [React — Core](./4_react_core.md) · [Composition patterns](./4_react_core.md#composition-patterns) · [Architecture patterns](./7_special_architecture.md)

### Main concepts

| Concept                        | Covers                                               |
| ------------------------------ | ---------------------------------------------------- |
| **Thinking in React**          | Component tree, minimal state, lift to common parent |
| **Controlled vs uncontrolled** | Props-driven vs local state for inputs and widgets   |
| **State colocation & lifting** | Where `useState` lives; one source of truth          |
| **Derived state & effects**    | Compute in render; effects for external systems only |
| **Compound components**        | Context-backed families (`Tabs`, `Select`)           |
| **Custom hooks**               | Extract stateful logic; replace HOC/render props     |
| **Container vs UI**            | Split data wiring from presentational markup         |
| **When to memoize**            | `memo` / `useMemo` / `useCallback` after profiling   |

### Sections

- [Overview](#overview)
- [Thinking in React](#thinking-in-react)
- [State patterns](#state-patterns)
- [Component patterns](#component-patterns)
- [Performance patterns](#performance-patterns)

---

## Overview

<details>
  <summary>Overview</summary>

### Overview

**Definition:** **Patterns** are repeatable ways to structure components and state — composition, lifting, colocation, compound components, and knowing when to memoize.

**How it works:** Theory for composition and reconciliation lives in [Core](./4_react_core.md). This topic is **applied practice**: choosing a pattern under time pressure (features, interviews, code review).

**When to use:** New screens, refactors from HOC/render-prop legacy, design-system widgets.

**See also:** [Algorithms](./4_react_algorithms.md) — debounce, pagination, optimistic UI.

**Sources:**

[patterns.dev/react](https://www.patterns.dev/react/) · [react.dev/learn/thinking-in-react](https://react.dev/learn/thinking-in-react)

Thinking in React

</details>

## Thinking in React

<details>
  <summary>Thinking in React</summary>

### Thinking in React

**Definition:** Break the UI into a **component tree**, find **state** that must be shared, **lift** it to the lowest common parent, and pass **props down** + **events up** (one-way data flow).

**How it works:**

1. Draw boxes around every UI region that can change independently
2. Name components — usually one component per box on the mockup
3. Build a static version with props only (no shared state yet)
4. Find minimal state: does it change over time? Can a parent compute it from props? If yes → not state
5. Place state in the parent that owns both consumers (e.g. filter text + table rows → `FilterableProductTable`)

**When to use:** New screens, legacy JSX spaghetti, interview “build a searchable table” tasks.

**Examples:**

```tsx
function FilterableList({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const visible = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <SearchBar value={query} onChange={setQuery} />
      <ItemTable rows={visible} />
    </>
  );
}
```

**See also:** [Composition patterns](./4_react_core.md#composition-patterns) · [Lifting state up](./4_react_core.md#lifting-state-up)

**Sources:**

[react.dev/learn/thinking-in-react](https://react.dev/learn/thinking-in-react)

State patterns

</details>

### State patterns

<details>
  <summary>State colocation & lifting</summary>

### State colocation & lifting

**Definition:** **Colocate** state with the component that needs it; **lift** only when siblings must stay in sync. Prefer **one source of truth** over duplicated `useState` in children.

**How it works:**

| Situation                        | Pattern                                 |
| -------------------------------- | --------------------------------------- |
| Toggle only inside one panel     | `useState` in that panel                |
| Search + list must match         | Lift `query` to parent; list is derived |
| Deep tree, stable theme/auth     | Context (not a high-frequency store)    |
| Many fields, complex transitions | `useReducer` or small state machine     |

**When to use:** Before adding Context or Redux — most bugs are wrong state placement, not missing libraries.

**Examples:**

```tsx
function Cart({ items, coupon }: Props) {
  const total = items.reduce((sum, i) => sum + i.price, 0);
  const discounted = coupon ? total * 0.9 : total;
  return <p>Total: {discounted}</p>;
}
```

**See also:** [`useReducer`](./4_react_hooks.md#usereducer) · [Redux](./4_react_redux.md)

**Sources:**

[react.dev/learn/sharing-state-between-components](https://react.dev/learn/sharing-state-between-components)

Derived state & effects

</details>

<details>
  <summary>Derived state & effects</summary>

### Derived state & effects

**Definition:** Values computable from props or other state should be **derived in render**, not copied into `useState` + `useEffect`. Effects synchronize with **external systems** (network, DOM, subscriptions), not with React props.

**How it works:**

| Avoid                                         | Prefer                                         |
| --------------------------------------------- | ---------------------------------------------- |
| `useEffect(() => setX(transform(props)), …)`  | `const x = transform(props)` in render         |
| `useEffect` to set loading `true` then fetch  | `use` / Query / `startTransition` + Actions    |
| Storing `selected = items.find(...)` in state | `const selected = items.find(...)` each render |

**When to use:** Code review smell: effect that only sets state from props; interview “fix unnecessary re-renders / loops”.

**Examples:**

```tsx
function UserRow({ users, selectedId }: Props) {
  const selected = users.find((u) => u.id === selectedId);
  return selected ? <Profile user={selected} /> : <Empty />;
}
```

**See also:** [You might not need an effect](./4_react_hooks.md#you-might-not-need-an-effect)

**Sources:**

[react.dev/learn/you-might-not-need-an-effect](https://react.dev/learn/you-might-not-need-an-effect)

Compound components

</details>

<details>
  <summary>Compound components</summary>

### Compound components

**Definition:** A small **family** of components that share implicit state via Context (tabs, select, accordion) while exposing a composable JSX API — `Tabs`, `Tabs.List`, `Tabs.Panel`.

**How it works:** Parent holds active index/id; children read context. Consumers compose markup without prop-drilling `activeTab` through every layer.

**When to use:** Design systems, reusable widgets with flexible layout; prefer over render props/HOC for new code.

**Examples:**

```tsx
const TabsContext = createContext<{
  active: string;
  setActive: (id: string) => void;
} | null>(null);

export function Tabs({
  children,
  defaultId,
}: {
  children: React.ReactNode;
  defaultId: string;
}) {
  const [active, setActive] = useState(defaultId);
  return <TabsContext value={{ active, setActive }}>{children}</TabsContext>;
}
```

**See also:** [`createContext`](./4_react_apis.md#createcontext) · [Composition patterns](./4_react_core.md#composition-patterns)

**Sources:**

[react.dev/learn/passing-data-deeply-with-context](https://react.dev/learn/passing-data-deeply-with-context)

Controlled vs uncontrolled

</details>

<details>
  <summary>Controlled vs uncontrolled</summary>

### Controlled vs uncontrolled

**Definition:** A component is **controlled** when its important UI state is driven by **props** (`value` + `onChange` from parent). **Uncontrolled** keeps that state in **local `useState`** (or DOM refs for forms).

**How it works:**

| Style        | Who owns state | Parent can                        |
| ------------ | -------------- | --------------------------------- |
| Controlled   | Parent         | Reset, sync siblings, persist URL |
| Uncontrolled | Child          | Use with less wiring              |

Prefer **fully controlled** when two widgets must stay in sync (dual inputs, accordion with one open panel). Keep **uncontrolled** for isolated leaves.

**When to use:** Forms in wizards, design-system inputs, “sync these two fields” tasks.

**Examples:**

```tsx
function Toggle({
  isOn,
  onChange,
}: {
  isOn: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button type="button" onClick={() => onChange(!isOn)}>
      {isOn ? "On" : "Off"}
    </button>
  );
}
```

**See also:** [State colocation & lifting](#state-colocation-lifting)

**Sources:**

[react.dev/learn/sharing-state-between-components](https://react.dev/learn/sharing-state-between-components)

</details>

### Component patterns

<details>
  <summary>Custom hooks pattern</summary>

### Custom hooks pattern

**Definition:** Move **stateful logic** (state + effects + handlers) into `useSomething()` so components stay mostly JSX — replaces most **HOC** and **render props**.

**How it works:** Hook returns `{ data, actions }`; call only at component top level (Rules of Hooks).

**When to use:** Shared fetch status, media queries, form helpers, keyboard shortcuts.

**Examples:**

```tsx
function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}
```

**See also:** [Hooks](./4_react_hooks.md)

**Sources:**

[react.dev/learn/reusing-logic-with-custom-hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

Container vs presentational

</details>

<details>
  <summary>Container vs presentational</summary>

### Container vs presentational

**Definition:** **Presentational** components render from props; **containers** (pages or hooks) own data and mutations.

**How it works:** `useUsers()` + `<UserList users={...} />` — list is pure; page wires navigation and fetch.

**When to use:** Tables, charts, cards you want in Storybook without mocking the whole app.

**Thoughts:** _Hooks replaced most class “container” components._

**See also:** [Custom hooks pattern](#custom-hooks-pattern)

**Sources:**

[react.dev/learn/thinking-in-react](https://react.dev/learn/thinking-in-react)

Legacy HOC and render props

</details>

<details>
  <summary>Legacy HOC and render props</summary>

### Legacy HOC and render props

**Definition:** **HOC** injects props by wrapping; **render props** use `render={(data) => ...}`. Common before Hooks.

**When to use:** Reading legacy code — migrate new work to **custom hooks**.

**Examples:**

```tsx
// Modern replacement
function Profile() {
  const user = useUser("/api/user");
  return <Avatar user={user} />;
}
```

**Sources:**

[react.dev/learn/reusing-logic-with-custom-hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

State reducer pattern

</details>

<details>
  <summary>State reducer pattern</summary>

### State reducer pattern

**Definition:** Centralize transitions in a **reducer** with typed actions instead of many `setState` calls — scales better than boolean soup.

**How it works:** `dispatch({ type: "set", field: "email", value })` — one place for validation and side effects.

**When to use:** Multi-step forms, wizards, complex toggles; libraries exposing `onStateChange` hooks.

**See also:** [`useReducer`](./4_react_hooks.md#usereducer)

**Sources:**

[react.dev/reference/react/useReducer](https://react.dev/reference/react/useReducer)

When to memoize

</details>

### Performance patterns

<details>
  <summary>When to memoize</summary>

### When to memoize

**Definition:** **`memo`**, **`useMemo`**, and **`useCallback`** skip work when inputs are unchanged — **optimizations**, not correctness. Profile first; React Compiler may auto-memoize.

**How it works:**

| Tool              | Skips                                    | Needs                                      |
| ----------------- | ---------------------------------------- | ------------------------------------------ |
| `memo(Component)` | Child re-render when props shallow-equal | Stable props (avoid inline `{}` / `() =>`) |
| `useMemo`         | Expensive pure calculation               | Correct dependency array                   |
| `useCallback`     | New function identity each render        | Passed to memoized children                |

**When to use:** Heavy list rows, charts, editors — not every leaf button.

**See also:** [`memo`](./4_react_apis.md#memo) · [List rendering algorithm](./4_react_algorithms.md#list-rendering-algorithm)

**Sources:**

[react.dev/reference/react/memo](https://react.dev/reference/react/memo)

</details>

<details>
  <summary>Context splitting</summary>

### Context splitting

**Definition:** Split unrelated values into **separate context providers** so updating theme does not re-render consumers of auth, and vice versa.

**How it works:**

- Bad: one giant `AppContext` with `{ theme, user, cart }` — any change re-renders all consumers
- Good: `ThemeProvider`, `AuthProvider`, `CartProvider` nested; components subscribe only to what they need
- For high-frequency updates (mouse position, scroll), prefer **refs + subscriptions** or external store — not raw Context

**When to use:** App shell with theme + user; performance issues from “everything re-renders on cart change”.

**See also:** [`createContext`](./4_react_apis.md#createcontext) · [Redux](./4_react_redux.md)

**Sources:**

[react.dev/learn/passing-data-deeply-with-context](https://react.dev/learn/passing-data-deeply-with-context)

</details>
