# React — Redux

Redux Toolkit, глобальное состояние клиента и RTK Query.

[ ← Вернуться в центр](./4_react.md)

### Related docs

- [React — Basics](./4_react_core.md) · [React — Hooks](./4_react_hooks.md) · [React — React 19](./4_react_server.md) · [React — Core](./4_react_ecosystem.md) · [React — Redux](./4_react_redux.md) · [React — Интервью](./4_react_interview.md)

### Sections

- [State management](#state-management)
- [RTK Query](#rtk-query)

---

## State management

<details>
  <summary>State management libraries</summary>

### State management libraries

**Definition:**

Внешние библиотеки для общего состояния клиента и кэша сервера — дополняют локальные `useState` и Контекст. **Состояние приложения** — это данные в данный момент (например, блоки редактора + временные метки), хранящиеся в виде объектов, а не смешанные с HTML, поэтому их можно обрабатывать, экспортировать и сохранять в формате JSON.

| Библиотека               | Лучшее для                                                                  |
| ------------------------ | --------------------------------------------------------------------------- |
| **Redux Toolkit**        | Большие команды, отладка путешествий во времени, нормализованные сущности   |
| **Zustand**              | Минимальный шаблон, глобальное состояние на основе срезов                   |
| **Jotai / Recoil**       | Атомные детальные подписки                                                  |
| **TanStack Query**       | Состояние сервера/асинхронности — не состояние пользовательского интерфейса |
| **RTK Query**            | Кэш сервера в хранилище Redux (`createApi`)                                 |
| **Context + useReducer** | Маленькие приложения, тема/локаль                                           |

**How it works:**

|         | Flux                          | Redux                    |
| ------- | ----------------------------- | ------------------------ |
| Stores  | Несколько                     | Одно хранилище           |
| Updates | Хранилища обновляют себя сами | Только чистые редукторы  |
| Flow    | Action → Dispatcher → Store   | Action → Reducer → Store |

| Тип состояния                           | Инструмент                   |
| --------------------------------------- | ---------------------------- |
| Серверные/асинхронные данные            | TanStack Query или RTK Query |
| Локальное состояние UI                  | `useState` / `useReducer`    |
| Общий клиентский UI (тема, корзина)     | Zustand или Context          |
| Сложное состояние приложения + DevTools | Redux Toolkit                |
| Мелкозернистые атомы                    | Jotai                        |

Сложное общее состояние клиента, middleware (логирование, аналитика), time-travel DevTools. **Когда пропускать:** Большая часть состояния — данные сервера (используйте Query) или локальные (`useState`).

**Examples:**

```tsx
const useStore = create((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));
```

**Thoughts:** _Состояние сервера и состояние UI — разные задачи — не помещайте fetch-кэш в Redux, если вам не нужен RTK Query._

**See also:** [TanStack Query vs RTK Query](#tanstack-query-vs-rtk-query) · [Data fetching](./4_react_ecosystem.md#data-fetching)

**Sources:**

[redux-toolkit.js.org](https://redux-toolkit.js.org/)

TanStack Query vs RTK Query

</details>

## RTK Query

<details>
  <summary>TanStack Query vs RTK Query</summary>

### TanStack Query vs RTK Query

**Definition:** Два кэша **состояния сервера**. TanStack Query (React Query) — автономный кэш с ключом `queryKey`. RTK Query — та же идея внутри Redux Toolkit (`createApi`), поэтому кэш сервера живёт в хранилище Redux.

**How it works:**

Оба кэшируют JSON в памяти (не HTTP `Cache-Control`). TanStack Query v5 использует один объект опций: `useQuery({ queryKey, queryFn, staleTime })`. По умолчанию `staleTime` — **0** (всегда устаревшее → фоновый refetch); `gcTime` (раньше `cacheTime`) по умолчанию — **5 минут**. `invalidateQueries` помечает ключи устаревшими и перезапрашивает активных наблюдателей. RTK Query: `createApi` + `keepUnusedDataFor` (по умолчанию **60 с**); хуки генерируются из endpoints.

|              | TanStack Query                                | RTK Query                                |
| ------------ | --------------------------------------------- | ---------------------------------------- |
| Store        | Собственный `QueryClient`                     | Хранилище Redux                          |
| Boilerplate  | Низкий                                        | Выше (`createApi`, slices)               |
| Best with    | Zustand / Context для UI state                | Существующее приложение на Redux Toolkit |
| Invalidation | `queryClient.invalidateQueries({ queryKey })` | `invalidatesTags` на мутациях            |

**When to use:**

Новый SPA без Redux → TanStack Query. Большая кодовая база Redux → RTK Query. RSC/Next.js server `fetch` сначала; добавляйте клиентский кэш только для live-обновлений на клиенте.

#### Common pitfalls

Позиционные аргументы v4 (`useQuery(key, fn)`) — v5 требует объектную форму. Размещение состояния формы/переключателей в Query. Забыть, что `queryKey` включает каждый вход, меняющий ответ.

**Pluses and minuses:**

| +                                                     | −                                                    |
| ----------------------------------------------------- | ---------------------------------------------------- |
| Query: гибкий, независимый от фреймворка              | Легко воспринимать как глобальный UI store (не надо) |
| RTK Query: одно хранилище, DevTools, codegen-friendly | Связывает server cache с Redux                       |

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

**Thoughts:** Query кэширует данные **сервера**. Redux/Zustand кэширует данные **клиента**. Не смешивайте их.

**See also:** [State management libraries](#state-management-libraries) · [Data fetching](./4_react_ecosystem.md#data-fetching)

**Sources:**

[tanstack.com/query](https://tanstack.com/query/latest) · [redux-toolkit.js.org/rtk-query](https://redux-toolkit.js.org/rtk-query/overview)

</details>
