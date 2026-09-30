# React — Redux

Redux Toolkit, global client state, and RTK Query.

[← Back to hub](./4_react.md)

### Related docs

- [React — Basics](./4_react_core.md) · [React — Hooks](./4_react_hooks.md) · [React — React 19](./4_react_server.md) · [React — Core](./4_react_ecosystem.md) · [React — Redux](./4_react_redux.md) · [React — Interview](./4_react_interview.md)

### Sections

- [State management](#state-management)
- [RTK Query](#rtk-query)

---

## State management

<details>
  <summary>State management libraries</summary>

### State management libraries

**Definition:**

External libraries for shared client state and server cache — complement local `useState` and Context. **Application state** is the data at a given moment (e.g. editor blocks + timestamps), kept as objects — not mixed into HTML — so it can be processed, exported, and saved as JSON.

| Library                  | Best for                                                |
| ------------------------ | ------------------------------------------------------- |
| **Redux Toolkit**        | Large teams, time-travel debugging, normalized entities |
| **Zustand**              | Minimal boilerplate, slice-based global state           |
| **Jotai / Recoil**       | Atomic fine-grained subscriptions                       |
| **TanStack Query**       | Server/async state — not UI state                       |
| **RTK Query**            | Server cache in the Redux store (`createApi`)           |
| **Context + useReducer** | Small apps, theme/locale                                |

**How it works:**

|         | Flux                        | Redux                    |
| ------- | --------------------------- | ------------------------ |
| Stores  | Multiple                    | Single store             |
| Updates | Stores self-update          | Pure reducers only       |
| Flow    | Action → Dispatcher → Store | Action → Reducer → Store |

| State type                     | Tool                        |
| ------------------------------ | --------------------------- |
| Server/async data              | TanStack Query or RTK Query |
| Local UI state                 | `useState` / `useReducer`   |
| Shared client UI (theme, cart) | Zustand or Context          |
| Complex app state + DevTools   | Redux Toolkit               |
| Fine-grained atoms             | Jotai                       |

Complex shared client state, middleware (logging, analytics), time-travel DevTools. **When to skip:** Most state is server data (use Query) or local (`useState`).

**Examples:**

```tsx
const useStore = create((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));
```

**Thoughts:** _Server state and UI state are different problems — don't put fetch cache in Redux unless you need RTK Query._

**See also:** [TanStack Query vs RTK Query](#tanstack-query-vs-rtk-query) · [Data fetching](./4_react_ecosystem.md#data-fetching)

**Sources:**

[redux-toolkit.js.org](https://redux-toolkit.js.org/)

TanStack Query vs RTK Query

</details>

## RTK Query

<details>
  <summary>TanStack Query vs RTK Query</summary>

### TanStack Query vs RTK Query

**Definition:** Two **server-state** caches. TanStack Query (React Query) is a standalone cache keyed by `queryKey`. RTK Query is the same idea inside Redux Toolkit (`createApi`) so server cache lives in the Redux store.

**How it works:**

Both cache JSON in memory (not HTTP `Cache-Control`). TanStack Query v5 uses a single options object: `useQuery({ queryKey, queryFn, staleTime })`. Default `staleTime` is **0** (always stale → background refetch); `gcTime` (was `cacheTime`) defaults to **5 minutes**. `invalidateQueries` marks keys stale and refetches active observers. RTK Query: `createApi` + `keepUnusedDataFor` (default **60s**); hooks are generated from endpoints.

|              | TanStack Query                                | RTK Query                      |
| ------------ | --------------------------------------------- | ------------------------------ |
| Store        | Own `QueryClient`                             | Redux store                    |
| Boilerplate  | Low                                           | Higher (`createApi`, slices)   |
| Best with    | Zustand / Context for UI state                | Existing Redux Toolkit app     |
| Invalidation | `queryClient.invalidateQueries({ queryKey })` | `invalidatesTags` on mutations |

**When to use:**

New SPA without Redux → TanStack Query. Large Redux codebase → RTK Query. RSC/Next.js server `fetch` first; add a client cache only for live client updates.

#### Common pitfalls

v4 positional args (`useQuery(key, fn)`) — v5 requires the object form. Putting form/toggle state in Query. Forgetting `queryKey` includes every input that changes the response.

**Pluses and minuses:**

| +                                                | −                                             |
| ------------------------------------------------ | --------------------------------------------- |
| Query: flexible, framework-agnostic              | Easy to treat it as a global UI store (don't) |
| RTK Query: one store, DevTools, codegen-friendly | Couples server cache to Redux                 |

**Examples:**

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function Todos() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    staleTime: 30_000,
  });
  const { mutate } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });
  return (
    <ul>
      {data?.map((t) => (
        <li key={t.id}>{t.title}</li>
      ))}
    </ul>
  );
}
```

**Thoughts:** Query caches **server** data. Redux/Zustand caches **client** data. Do not mix them.

**See also:** [State management libraries](#state-management-libraries) · [Data fetching](./4_react_ecosystem.md#data-fetching)

**Sources:**

[tanstack.com/query](https://tanstack.com/query/latest) · [redux-toolkit.js.org/rtk-query](https://redux-toolkit.js.org/rtk-query/overview)

</details>
