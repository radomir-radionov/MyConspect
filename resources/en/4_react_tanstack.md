# React — TanStack

TanStack Query, Router, Table, Virtual, Form, and related ecosystem tools.

[← Back to hub](./4_react.md)

### Related docs

- [React — Basics](./4_react_core.md) · [React — Hooks](./4_react_hooks.md) · [React — React 19](./4_react_server.md) · [React — Core](./4_react_ecosystem.md) · [React — Redux](./4_react_redux.md) · [React — TanStack](./4_react_tanstack.md) · [React — Interview](./4_react_interview.md)

### Sections

- [Overview](#overview)
- [TanStack Query](#tanstack-query)
- [Working with TanStack Query](#working-with-tanstack-query)
- [TanStack Query vs RTK Query](#tanstack-query-vs-rtk-query)
- [TanStack Router](#tanstack-router)
- [TanStack Table](#tanstack-table)
- [TanStack Virtual](#tanstack-virtual)
- [TanStack Form](#tanstack-form)
- [Codegen (orval)](#codegen-orval)

---

## Overview

<details>
  <summary>TanStack ecosystem</summary>

### TanStack ecosystem

**Definition:** **TanStack** is a family of **headless, framework-agnostic** libraries for common React app problems — each package focuses on logic and state, not UI markup.

**How it works:**

| Library              | Package                   | Problem it solves                                             |
| -------------------- | ------------------------- | ------------------------------------------------------------- |
| **TanStack Query**   | `@tanstack/react-query`   | Server/async state — fetch, cache, refetch, mutations         |
| **TanStack Router**  | `@tanstack/react-router`  | Type-safe client routing, loaders, search params              |
| **TanStack Table**   | `@tanstack/react-table`   | Headless data grids — sort, filter, paginate, select          |
| **TanStack Virtual** | `@tanstack/react-virtual` | Virtualize long lists/tables — constant DOM size              |
| **TanStack Form**    | `@tanstack/react-form`    | Headless form state, validation, submission                   |
| **TanStack Start**   | `@tanstack/react-start`   | Full-stack React (routing + SSR) — TanStack's Next-like stack |

All packages share design goals: **TypeScript-first**, **tree-shakeable**, **no imposed UI** — you bring Tailwind, shadcn/ui, or your own components.

**When to use:**

Client SPAs (Vite) that need server-state caching → **Query**. Typed URLs and loaders without Next.js → **Router**. Admin tables with sorting/filtering → **Table**. 1000+ row lists → **Virtual**. Type-safe forms without RHF → **Form**.

**Pluses and minuses:**

| +                                       | −                                                 |
| --------------------------------------- | ------------------------------------------------- |
| Best-in-class server-state with Query   | Another ecosystem to learn alongside React Router |
| Headless — pairs with any design system | Overlaps Next.js App Router for routing/data      |
| Consistent patterns across packages     | TanStack Start overlaps Next.js for full-stack    |

**Thoughts:** _TanStack Query is the default answer for "how do I fetch JSON in a client SPA?" — not Redux, not `useEffect` + `fetch`._

**See also:** [TanStack Query essentials](#tanstack-query-essentials) · [TanStack Router](#tanstack-router) · [Data fetching](./4_react_ecosystem.md#data-fetching)

**Sources:**

[tanstack.com](https://tanstack.com/)

TanStack Query essentials

</details>

## TanStack Query

<details>
  <summary>TanStack Query essentials</summary>

### TanStack Query essentials

**Definition:** **TanStack Query** (formerly React Query) manages **server state** — data that lives remotely, is fetched asynchronously, can go stale, and is shared across components.

**How it works:**

1. Wrap the app in `QueryClientProvider` with a `QueryClient`
2. `useQuery({ queryKey, queryFn })` fetches and caches by **query key** (array — include every input that changes the response)
3. **Stale time** — how long data is considered fresh (default **0** → refetch on mount/focus)
4. **gcTime** (was `cacheTime` in v4) — how long unused cache stays in memory (default **5 min**)
5. `useMutation` for writes; `queryClient.invalidateQueries({ queryKey })` marks matching queries stale and refetches active ones

Server state ≠ client state. Do **not** put form toggles, modal open flags, or cart UI state in Query — use `useState`, Zustand, or Redux.

**When to use:**

Client SPAs that poll/refetch API data, need optimistic updates, or dedupe parallel requests for the same endpoint. In Next.js, prefer Server Component `fetch` first; add Query only for live client-side updates.

#### Common pitfalls

- v4 positional `useQuery(key, fn)` — v5 requires the **object** form
- `queryKey` missing a filter param → wrong cache hits
- Storing UI state in query cache
- `useEffect` + `fetch` when Query already handles loading/error/deduping

**Pluses and minuses:**

| +                                      | −                                      |
| -------------------------------------- | -------------------------------------- |
| Automatic deduping, background refetch | Learning curve for keys/invalidation   |
| Built-in loading/error/success states  | Not a replacement for RSC server fetch |
| Devtools for cache inspection          | Easy to over-cache rarely-used data    |

**Examples:**

```tsx
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  );
}

function Todos() {
  const { isPending, error, data } = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("/api/todos").then((r) => r.json()),
    staleTime: 30_000,
  });
  if (isPending) return "Loading…";
  if (error) return `Error: ${error.message}`;
  return (
    <ul>
      {data.map((t) => (
        <li key={t.id}>{t.title}</li>
      ))}
    </ul>
  );
}
```

**Thoughts:** _Query owns "what the server last said" — not "what the user is typing right now."_

**See also:** [Working with TanStack Query](#working-with-tanstack-query) · [TanStack Query vs RTK Query](#tanstack-query-vs-rtk-query) · [Data fetching](./4_react_ecosystem.md#data-fetching)

**Sources:**

[tanstack.com/query](https://tanstack.com/query/latest)

Working with TanStack Query

</details>

## Working with TanStack Query

<details>
  <summary>Working with TanStack Query</summary>

### Working with TanStack Query

**Definition:** Practical patterns for queries, mutations, invalidation, and integration in React apps.

**How it works:**

| Task                    | API / pattern                                                              |
| ----------------------- | -------------------------------------------------------------------------- |
| Fetch on mount          | `useQuery({ queryKey, queryFn })`                                          |
| Skip until ready        | `enabled: !!userId`                                                        |
| Dependent fetch         | `queryKey: ['user', userId]` — refetches when `userId` changes             |
| Create/update/delete    | `useMutation({ mutationFn, onSuccess })` + `invalidateQueries`             |
| Optimistic UI           | `onMutate` snapshot + `onError` rollback + `onSettled` invalidate          |
| Paginated/infinite list | `useInfiniteQuery` + `getNextPageParam`                                    |
| Prefetch on hover       | `queryClient.prefetchQuery({ queryKey, queryFn })`                         |
| Global defaults         | `new QueryClient({ defaultOptions: { queries: { staleTime, queryFn } } })` |

**Invalidation:** `queryClient.invalidateQueries({ queryKey: ['todos'] })` marks matches stale (overrides `staleTime`) and refetches observers. Prefer targeted invalidation over manual cache surgery.

**When to use:**

Any client-side CRUD against REST/GraphQL. Pair with **orval** for generated hooks from OpenAPI.

#### Common pitfalls

- Invalidating too broadly (`invalidateQueries()` with no key) → thundering herd refetch
- Forgetting `enabled` on queries that need an ID from another query
- Putting derived UI state in `select` when a simple `useMemo` on `data` is enough

**Examples:**

```tsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function TodoList() {
  const queryClient = useQueryClient();
  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
  const { mutate, isPending } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });
  return (
    <>
      <button disabled={isPending} onClick={() => mutate({ title: "New" })}>
        Add
      </button>
      <ul>
        {todos?.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </>
  );
}
```

**Thoughts:** _Invalidate the smallest query key that covers the changed data — `['todos']` not every key in the app._

**See also:** [TanStack Query essentials](#tanstack-query-essentials) · [Codegen (orval)](#codegen-orval) · [TanStack Query vs RTK Query](#tanstack-query-vs-rtk-query)

**Sources:**

[tanstack.com/query — invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation) · [tanstack.com/query — mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)

TanStack Query vs RTK Query

</details>

## TanStack Query vs RTK Query

<details>
  <summary>TanStack Query vs RTK Query</summary>

### TanStack Query vs RTK Query

**Definition:** Two **server-state** caches. TanStack Query is a standalone cache keyed by `queryKey`. RTK Query is the same idea inside Redux Toolkit (`createApi`) so server cache lives in the Redux store.

**How it works:**

Both cache JSON in memory (not HTTP `Cache-Control`). TanStack Query v5: `useQuery({ queryKey, queryFn, staleTime })`. Default `staleTime` is **0**; `gcTime` defaults to **5 minutes**. `invalidateQueries` marks keys stale and refetches active observers. RTK Query: `createApi` + `keepUnusedDataFor` (default **60s**); hooks are generated from endpoints.

|              | TanStack Query                                | RTK Query                      |
| ------------ | --------------------------------------------- | ------------------------------ |
| Store        | Own `QueryClient`                             | Redux store                    |
| Boilerplate  | Low                                           | Higher (`createApi`, slices)   |
| Best with    | Zustand / Context for UI state                | Existing Redux Toolkit app     |
| Invalidation | `queryClient.invalidateQueries({ queryKey })` | `invalidatesTags` on mutations |

**When to use:**

New SPA without Redux → TanStack Query. Large Redux codebase → RTK Query. RSC/Next.js server `fetch` first; add a client cache only for live client updates.

#### Common pitfalls

v4 positional args — v5 requires the object form. Putting form/toggle state in Query. Forgetting `queryKey` includes every input that changes the response.

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

**See also:** [TanStack Query essentials](#tanstack-query-essentials) · [Redux — RTK Query](./4_react_redux.md#rtk-query) · [When to use Redux](./4_react_redux.md#when-to-use-redux)

**Sources:**

[tanstack.com/query](https://tanstack.com/query/latest) · [redux-toolkit.js.org/rtk-query](https://redux-toolkit.js.org/rtk-query/overview)

TanStack Router

</details>

## TanStack Router

<details>
  <summary>TanStack Router</summary>

### TanStack Router

**Definition:** Fully type-safe React router with first-class search params, loaders, and file-based routes — types for `params` and loader data are inferred from the route definition.

**How it works:** File routes export `Route = createFileRoute('/posts/$postId')({ loader, validateSearch, component })`. `Route.useParams()`, `Route.useLoaderData()`, and `Route.useSearch()` inherit types from that file. `validateSearch` (often Zod) parses the query string; `loaderDeps` pass validated search into the loader so cache keys stay correct.

**When to use:**

Vite/SPA apps that need typed URLs; dashboards with filter state in the query string. **Not** a replacement for Next.js App Router RSC.

#### Common pitfalls

Using Next.js `app/` file conventions inside a TanStack app. Skipping `validateSearch` so `?offset=abc` crashes the loader.

**Pluses and minuses:**

| +                                              | −                                                    |
| ---------------------------------------------- | ---------------------------------------------------- |
| Params, search, and loader data are typed      | Another router if you already use Next.js App Router |
| Search params as first-class state (nuqs-like) | File-plugin setup for `createFileRoute`              |
| Loaders avoid fetch-on-mount waterfalls        | Overlaps Next.js / React Router v7 framework mode    |

**Examples:**

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/posts/$postId")({
  validateSearch: z.object({ tab: z.enum(["info", "comments"]).catch("info") }),
  loader: async ({ params }) => {
    const post = await fetchPost(params.postId);
    return { post };
  },
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  const { postId } = Route.useParams();
  const { tab } = Route.useSearch();
  return (
    <article>
      <h1>{post.title}</h1>
      <p>
        {postId} / {tab}
      </p>
    </article>
  );
}
```

**Thoughts:** The route module _is_ the type source — hooks do not need manual generics.

**See also:** [Routing](./4_react_ecosystem.md#routing) · [nuqs](./4_react_ecosystem.md#nuqs-url-search-params) · [TanStack ecosystem](#tanstack-ecosystem)

**Sources:**

[tanstack.com/router](https://tanstack.com/router)

TanStack Table

</details>

## TanStack Table

<details>
  <summary>TanStack Table</summary>

### TanStack Table

**Definition:** **Headless** table engine — sorting, filtering, pagination, row selection, and column visibility as **state + helpers**, with zero built-in markup.

**How it works:**

1. Define **columns** (`createColumnHelper` or `accessorKey` columns)
2. `useReactTable({ data, columns, getCoreRowModel, … })` returns a table instance
3. Register optional **features** via `tableFeatures` — filtering, sorting, pagination (client-side row models or server-side manual state)
4. Render with `flexRender(cell.column.columnDef.cell, cell.getContext())` — you own `<table>`, `<tr>`, `<td>`

For large datasets, pair with [TanStack Virtual](#tanstack-virtual) inside rows.

**When to use:**

Admin dashboards, data grids with custom design, tables that need programmatic column APIs. Skip for a simple static `<table>` with 10 rows.

#### Common pitfalls

Expecting styled components — Table is logic only. Forgetting `getCoreRowModel()` (or equivalent). Client-side row models on 100k rows — paginate server-side instead.

**Pluses and minuses:**

| +                                       | −                                    |
| --------------------------------------- | ------------------------------------ |
| Full control over markup and a11y       | More setup than `<table>` + map      |
| Client or server-driven sort/filter     | Steep API surface for simple tables  |
| Works with any UI library (shadcn, MUI) | Virtualization is a separate package |

**Examples:**

```tsx
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Person = { name: string; age: number };
const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("age", { header: "Age" }),
];

function DataTable({ data }: { data: Person[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => (
              <th key={h.id}>
                {flexRender(h.column.columnDef.header, h.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

**Thoughts:** _Headless = you style it; the library owns sort/filter/pagination state._

**See also:** [TanStack Virtual](#tanstack-virtual) · [List virtualization](./4_react_ecosystem.md#list-virtualization)

**Sources:**

[tanstack.com/table](https://tanstack.com/table)

TanStack Virtual

</details>

## TanStack Virtual

<details>
  <summary>TanStack Virtual</summary>

### TanStack Virtual

**Definition:** Render only **visible rows** (plus overscan) in long scrollable lists — DOM node count stays constant regardless of list size.

**How it works:** `useVirtualizer({ count, getScrollElement, estimateSize })` calculates which indices intersect the viewport from `scrollTop` and container height. Only those indices mount; off-screen items are absent from the DOM. Rows reposition via `transform` or absolute `top` offsets.

**When to use:** Data tables with thousands of rows, infinite feeds, chat history, log viewers. Threshold: **1000+ DOM nodes** in one scroll container cause jank.

**Pluses and minuses:**

| +                                  | −                                                              |
| ---------------------------------- | -------------------------------------------------------------- |
| 10k+ rows without browser slowdown | Fixed row height is simpler; variable height needs measurement |
| Constant memory and paint cost     | Breaks native find-in-page for off-screen rows                 |
| Pairs with TanStack Table          | Keyboard navigation needs extra a11y work                      |

**Examples:**

```tsx
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

function VirtualList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
  });
  return (
    <div ref={parentRef} style={{ height: 400, overflow: "auto" }}>
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((row) => (
          <div
            key={row.index}
            style={{ position: "absolute", top: row.start, height: row.size }}
          >
            {items[row.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

**See also:** [List virtualization](./4_react_ecosystem.md#list-virtualization) · [TanStack Table](#tanstack-table)

**Sources:**

[tanstack.com/virtual](https://tanstack.com/virtual)

TanStack Form

</details>

## TanStack Form

<details>
  <summary>TanStack Form</summary>

### TanStack Form

**Definition:** **Headless**, type-safe form state for React — field-level validation, async validators, and submission without imposing markup.

**How it works:**

`useForm({ defaultValues, onSubmit })` returns a form API. Fields use `form.Field` with `validators` (sync or async). State updates are fine-grained — only subscribed fields re-render. Works across React, Vue, Solid, etc. from the same core.

**When to use:**

Type-safe forms when you want headless control (custom inputs, design system). For large apps already on **RHF + Zod**, staying on RHF is fine — see [Forms](./4_react_ecosystem.md#forms).

#### Common pitfalls

Re-implementing RHF field arrays without reading TanStack Form's array APIs. Mixing uncontrolled native inputs with form state.

**Pluses and minuses:**

| +                           | −                                      |
| --------------------------- | -------------------------------------- |
| Strong TypeScript inference | Smaller ecosystem than React Hook Form |
| Headless — any UI           | Newer; fewer Stack Overflow answers    |
| Framework-agnostic core     | shadcn/ui examples often use RHF       |

**Examples:**

```tsx
import { useForm } from "@tanstack/react-form";

function SignupForm() {
  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      await saveUser(value);
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) =>
            !value.includes("@") ? "Invalid email" : undefined,
        }}
      >
        {(field) => (
          <>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.join(", ")}
          </>
        )}
      </form.Field>
      <button type="submit">Save</button>
    </form>
  );
}
```

**Thoughts:** _Pick RHF for ecosystem size; pick TanStack Form for headless + shared core across frameworks._

**See also:** [Forms](./4_react_ecosystem.md#forms) · [Controlled vs uncontrolled inputs](./4_react_core.md#controlled-vs-uncontrolled-inputs)

**Sources:**

[tanstack.com/form](https://tanstack.com/form)

Codegen (orval)

</details>

## Codegen (orval)

<details>
  <summary>Codegen (orval)</summary>

### Codegen (orval)

**Definition:** Generates TypeScript clients, models, and optional **TanStack Query hooks** from an OpenAPI/Swagger spec — keeps frontend types aligned with the API contract.

**How it works:** Point `orval.config.ts` at a YAML/JSON spec; set `output.client: 'react-query'`. Orval emits query functions, query keys, and `useX` hooks. Use a **mutator** for a shared Axios/`fetch` instance (auth headers). Re-run on spec change in CI.

**When to use:** Backend publishes OpenAPI; frontend wants typed hooks without hand-writing `queryKey` + `queryFn` per endpoint.

**See also:** [Working with TanStack Query](#working-with-tanstack-query) · [orval](./4_react_ecosystem.md#orval-openapi-codegen)

**Sources:**

[orval.dev](https://orval.dev/)

</details>
