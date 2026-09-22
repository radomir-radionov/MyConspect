# React — Ecosystem

Архитектура, библиотеки, производительность и наследие.

[ ← Вернуться в центр](./4_react.md)

### Related docs

* [React — Core](./4_react_core.md) · [React — Hooks](./4_react_hooks.md) · [React — React 19](./4_react_server.md) · [React — Экосистема](./4_react_ecosystem.md) · [React — Интервью](./4_react_interview.md) · [Архитектура шаблоны](./7_special_architecture.md)

### Sections

- [9. Ecosystem & architecture](#9-ecosystem-architecture)
- [10. Performance](#10-performance)
- [11. Legacy & migration](#11-legacy-migration)

---

## 9. Ecosystem & architecture

Маршрутизация

<details>
  <summary>Routing</summary>

### Routing

**Definition:** **Маршрутизация на стороне клиента** сопоставляет URL-пути с компонентами **без** полной перезагрузки страницы — API истории браузера обновляет URL-адрес; React меняет представление.

**How it works:**

1. Клики пользователей `<Link to="/users">` или браузер назад/вперед
2. Маршрутизатор сопоставляет URL с конфигурацией маршрута (путь, параметры, вложенные макеты).
3. Рендеринг соответствующих компонентов; другие размонтируют
4. Дополнительный **загрузчик** извлекает данные до/во время рендеринга (React Router, шаблон Remix).
5. В Next.js App Router **файловая система** определяет маршруты (`app/users/page.tsx`)

| Библиотека | Заметки |
| ---------------------- | ---------------------------------- |
| **Маршрутизатор приложений Next.js** | Файловые маршруты + RSC по умолчанию |
| **React Router v7** | Режим SPA + Framework с SSR/RSC |
| **Маршрутизатор TanStack** | Типобезопасные маршруты, параметры поиска |

**When to use:** Любое многостраничное приложение React. Next.js, если вам нужна маршрутизация на основе файлов + SSR/RSC; React Router для режима SPA или фреймворка.

**Examples:**

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/users/:id" element={<UserProfile />} />
</Routes>
```

**Thoughts:** *URL-адрес определяет, какие компоненты монтируются — без полной перезагрузки документа.*

**See also:** [Основные сведения о React Router](#react-router-essentials) · [TanStack Router](#tanstack-router)

**Sources:**

[reactrouter.com](https://reactrouter.com/)

Основы React Router

</details>

<details>
  <summary>React Router essentials</summary>

### React Router essentials

**Definition:** **React Router v7** сопоставляет URL-адреса с пользовательским интерфейсом, поддерживает вложенные макеты, **загрузчики данных** и режим платформы с SSR/RSC — де-факто клиентским маршрутизатором для React SPA.

**How it works:** Маршруты образуют дерево — родительские маршруты отображают `<Outlet />` где появляются дочерние маршруты. **Загрузчики** запускаются перед навигацией/рендерингом для получения данных (параллельно сопоставлению маршрутов); результаты доступны через `useLoaderData()`. **Действия** обрабатывают мутации форм. В режиме платформы файловые маршруты и SSR интегрируются, как Next.js lite. Режим SPA использует `<BrowserRouter>` + `<Routes>`; API данных используют `createBrowserRouter` + `RouterProvider`.

**When to use:** Панель инструментов с макетом боковой панели + вложенные страницы, предварительная загрузка пользователя `/users/:id` через загрузчик, формируем POST через действие.

**Pluses and minuses:**

| + | − |
| ------------------------------------------------ | ------------------------------------ |
| Вложенные макеты без перемонтирования родительского | Кривая обучения миграции v6 → v7 |
| Погрузчики уменьшают количество водопадов при извлечении при монтаже | Режим Framework пересекается с Next.js || Типобезопасные маршруты через альтернативу TanStack Router | В режиме «только клиент» отсутствует RSC |

**Examples:**

```tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    loader: () => fetchRootData(),
    children: [
      { index: true, element: <Home /> },
      {
        path: 'users/:userId',
        loader: ({ params }) => fetchUser(params.userId),
        element: <UserProfile />,
      },
    ],
  },
]);

function UserProfile() {
  const user = useLoaderData() as User;
  return <h1>{user.name}</h1>;
}

function Layout() {
  return <><nav /><Outlet /><footer /></>;
}
```

**Thoughts:** Предпочитаю погрузчики `useEffect` выборка данных, привязанных к маршруту. Разделите загрузчики на каждый маршрут, чтобы медленные дочерние данные не блокировали родительскую оболочку.

**Sources:**

[reactrouter.com](https://reactrouter.com/) · [Загрузчики маршрутов](https://reactrouter.com/start/framework/route-module#loader)

Доступность в React (a11y)

</details>

<details>
  <summary>Accessibility in React (a11y)</summary>

### Accessibility in React (a11y)

**Definition:** Создание пользовательских интерфейсов, которые подходят для пользователей клавиатуры, программ чтения с экрана и вспомогательных технологий. React не меняет семантику HTML; вы должны правильно применять **ARIA**, **управление фокусом** и семантические элементы.

**How it works:** Используйте собственные интерактивные элементы (`<button>`, `<a href>`, `<input>`) перед виджетами ARIA. Соедините ярлыки с `htmlFor`/`id` или оберните входные данные в `<label>`. Использовать `useId()` для SSR-безопасных ID-каналов. Управление фокусом в модальных окнах: захват фокуса внутри, восстановление при закрытии, установка `aria-modal="true"`. Объявляйте о динамических обновлениях с помощью `role="alert"` or `aria-live` регионы. Radix UI/React Aria предоставляет доступные примитивы со встроенным табиндексом перемещения клавиатуры.

**When to use:** Сообщения о проверке формы (`aria-describedby`), кнопки только со значками (`aria-label`), поля со списком (используйте библиотеку), ссылки для пропуска, живые регионы для всплывающих уведомлений.

**Pluses and minuses:**

| + | − |
| ------------------------------------------------ | -------------------------------------- |
| Семантический HTML охватывает большинство случаев | Пользовательским виджетам нужна полная спецификация клавиатуры |
| `eslint-plugin-jsx-a11y` выявляет типичные ошибки | Порталам/модалам нужна ловушка ручной фокусировки |
| Библиотеки (Radix) обрабатывают сложные шаблоны | Неправильное использование ARIA может больше навредить, чем помочь |

**Examples:**

```tsx
function Dialog({ title, onClose, children }: DialogProps) {
  const titleId = useId();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  return (
    <dialog ref={ref} aria-labelledby={titleId} onClose={onClose}>
      <h2 id={titleId}>{title}</h2>
      {children}
      <button type="button" onClick={onClose}>Close</button>
    </dialog>
  );
}
```

**Thoughts:** Первое правило ARIA: не используйте ARIA, если достаточно встроенного HTML. Протестируйте с помощью навигации только с помощью клавиатуры и VoiceOver/NVDA.

**Sources:**

[react.dev/learn/accessibility](https://react.dev/learn/accessibility) · [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)

Получение данных

</details>

<details>
  <summary>Data fetching</summary>

### Data fetching

**Definition:**

Шаблоны загрузки данных сервера в React — загрузчики фреймворков, клиентские кеши, серверные компоненты и приостановка.

| Подход | Когда |
| ---------------------------- | ------------------------------------------------ |
| **Серверный компонент** `fetch` | По умолчанию в маршрутизаторе приложений Next.js — кэшируется на сервере |
| **Запрос TanStack** | Клиентские SPA — кэширование, выборка, оптимистические обновления |
| **RTK-запрос** | Та же идея внутри Redux Toolkit (`createApi`)     |
| `use()` **+ Интрига** | Асинхронность в дереве компонентов с помощью React 19 |
| **Действия сервера** | Мутации из форм в Next.js |

**How it works:** Рамки `fetch` / RSC-кеш на **сервере**. Клиентские библиотеки кэшируют **JSON в памяти**, используя ключ конечной точки + аргументы. Это **не** HTTP `Cache-Control` (браузер/CDN). RTK-запрос: подписки с подсчетом ссылок; неиспользуемые данные удаляются после `keepUnusedDataFor` (по умолчанию **60** секунд).

**Examples:**

```tsx
// Next.js Server Component
async function Page() {
  const res = await fetch('https://api.example.com/posts', { next: { revalidate: 60 } });
  const posts = await res.json();
  return <PostList posts={posts} />;
}
```

**Thoughts:** Не `useEffect` + `fetch` для данных начальной страницы, если RSC или загрузчик маршрутизатора могут их предоставить. Заголовки HTTP и кэш клиента → [6_web_api.md — кэширование HTTP](./6_web_api.md).

**Sources:**

[react.dev/reference/rsc/server-comComponents](https://react.dev/reference/rsc/server-comComponents) · [Поведение кэша запросов RTK](https://redux-toolkit.js.org/rtk-query/usage/cache-behavior)

Библиотеки государственного управления

</details>

<details>
  <summary>State management libraries</summary>

### State management libraries

**Definition:**

Внешние библиотеки для общего состояния клиента и кэша сервера — дополняют локальные `useState` и Контекст. **Состояние приложения** — это данные в данный момент (например, блоки редактора + временные метки), хранящиеся в виде объектов, а не смешанные с HTML, поэтому их можно обрабатывать, экспортировать и сохранять в формате JSON.

| Библиотека | Лучшее для |
| ------------------------ | ------------------------------------------------------- || **Набор инструментов Redux** | Большие команды, отладка путешествий во времени, нормализованные сущности |
| **Зустанд** | Минимальный шаблон, глобальное состояние на основе срезов |
| **Джотай/Отдача** | Атомные детальные подписки |
| **Запрос TanStack** | Состояние сервера/асинхронности — не состояние пользовательского интерфейса |
| **RTK-запрос** | Кэш сервера в магазине Redux (`createApi`) |
| **Контекст + useReducer** | Маленькие приложения, тема/локаль |

**How it works:**

|         | Флюс | Редукс |
| ------- | --------------------------- | ------------------------ |
| Магазины | Несколько | Один магазин |
| Обновления | Магазины самостоятельного обновления | Только чистые редукторы |
| Поток | Действие → Диспетчер → Магазин | Действие → Редуктор → Сохранить |

| Тип государства | Инструмент || ------------------------------ | --------------------------- |
| Серверные/асинхронные данные | Запрос TanStack или запрос RTK |
| Локальное состояние пользовательского интерфейса | `useState` / `useReducer`   |
| Общий клиентский интерфейс (тема, корзина) | Зустанд или Контекст |
| Сложное состояние приложения + DevTools | Инструментарий Redux |
| Мелкозернистые атомы | Джотай |

Сложное общее состояние клиента, промежуточное программное обеспечение (ведение журнала, аналитика), инструменты разработчика для путешествий во времени. **Когда пропускать:** Большая часть состояния — это данные сервера (используйте запрос) или локальные (`useState`).

**Examples:**

```tsx
const useStore = create(set => ({
  count: 0,
  inc: () => set(s => ({ count: s.count + 1 })),
}));
```

**Thoughts:** *Состояние сервера и состояние пользовательского интерфейса — это разные проблемы — не помещайте выборку кеша в Redux, если вам не нужен RTK-запрос.*

**Sources:**

[redux-toolkit.js.org](https://redux-toolkit.js.org/)

Формы

</details>

<details>
  <summary>Forms</summary>

### Forms

**Definition:** Шаблоны для сбора и проверки вводимых пользователем данных в React — от встроенных контролируемых входных данных до действий React 19 и библиотек, управляемых схемами.

**How it works:**

| Подход | Когда |
| ------------------------------------- | ------------------------------------------------------------ |
| **Контролируется** (`value` + `onChange`) | Полный контроль, малые формы |
| **Неконтролируемый + Действия** | Простые отправки, React 19, прогрессивное улучшение |
| **РФ + Зод** | Сложная проверка, массивы полей, большие формы, чувствительные к производительности |

`<form action={fn}>` — браузер собирает `FormData`; React вызывает действие с состоянием ожидания. Нет руководства `e.preventDefault()` для поведения отправки по умолчанию.

**When to use:**

#### Common pitfalls

— В схеме Zod отсутствует поле — RHF не будет включать его в отправляемые данные (добавьте по желанию).
- Контролируемый вход без `onChange` — поле только для чтения
- Микширование контролируемого и неконтролируемого на одном входе (`value` + `defaultValue`)

**Examples:**

```tsx
const schema = z.object({ email: z.string().email() });
const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });
```

**Thoughts:** *Простые формы → Действия; комплексная проверка → RHF + Zod.*

**See also:** [Контролируемые и неконтролируемые входы](./4_react_core.md#control-vs-uncontrolled-inputs) · [Действия](./4_react_server.md#actions) · [useActionState](./4_react_server.md#useactionstate)

**Sources:**

[react-hook-form.com](https://react-hook-form.com/)

Стилизация в React

</details>

<details>
  <summary>Styling in React</summary>

### Styling in React

**Definition:**

В React нет встроенных стилей — прикрепите CSS через `className`, CSS-модули, служебные платформы или CSS-in-JS.

| Подход | Компромисс |
| ----------------------------------------- | --------------------------------------------------------- |
| **Глобальный CSS** | Простой; коллизии именования в масштабе || **CSS-модули** | Ограниченные классы; нулевое время работы — `import styles from './Button.module.css'` |
| **Попутный ветер** | Утилита прежде всего; быстрая итерация; хорошо сочетается с библиотеками компонентов |
| **CSS-in-JS** (стилизованные компоненты, Emotion) | Совмещенные стили; стоимость времени выполнения; плохая совместимость с RSC |
| **Экстракт ванили** | Типобезопасные CSS-файлы с нулевым временем выполнения |

**How it works:** Модули Tailwind или CSS для новых приложений. CSS-in-JS (Emotion) во время выполнения конфликтует с RSC — вместо этого используйте Vanilla Extract или Tailwind. В соответствии `style={{}}` только для динамических значений (позиция из состояния).

**When to use:** Модули CSS или Tailwind для большинства новых проектов. Избегайте использования CSS-in-JS во время выполнения в приложениях с большим количеством RSC.

**Examples:**

```tsx
import styles from './Button.module.css';

export function Button({ children }: { children: React.ReactNode }) {
  return <button className={styles.primary}>{children}</button>;
}
```

**Thoughts:** *Предпочитайте CSS с нулевым временем выполнения в приложениях RSC — стили не должны зависеть от внедрения клиентского JS.*

**Sources:**

[react.dev/learn](https://react.dev/learn)

</details>

<details>
  <summary>Feature-Sliced Design (FSD)</summary>

### Feature-Sliced Design (FSD)

**Definition:** Методология создания папок внешнего интерфейса: слои (приложение → страницы → виджеты → функции → сущности → общие) плюс фрагменты с общедоступным `index.ts`.

Канонический: [Функциональный дизайн](./7_special_architecture.md#feature-sliced-design-fsd). Специфично для React: не допускайте попадания библиотек состояния сервера `entities` модели — [Состояние в масштабе](./7_special_architecture.md#state-at-scale).

**Sources:** [feature-sliced.design](https://feature-sliced.design/)

</details>

<details>
  <summary>TanStack Router</summary>

### TanStack Router

**Definition:** Полностью типобезопасный маршрутизатор React с первоклассными параметрами поиска, загрузчиками и файловыми маршрутами — типы для `params` и данные загрузчика выводятся из определения маршрута.

**How it works:** Экспорт файловых маршрутов `Route = createFileRoute('/posts/$postId')({ loader, validateSearch, component })`. `Route.useParams()`, `Route.useLoaderData()`, и `Route.useSearch()` наследовать типы из этого файла. `validateSearch` (часто Zod) анализирует строку запроса; `loaderDeps` передать проверенный поиск в загрузчик, чтобы ключи кэша оставались правильными.

**When to use:**

Приложения Vite/SPA, которым требуются введенные URL-адреса; информационные панели с состоянием фильтра в строке запроса. **Не** является заменой Next.js App Router RSC.

#### Common pitfalls

Использование Next.js `app/` соглашения о файлах внутри приложения TanStack. Пропуск `validateSearch` so `?offset=abc` вылетает загрузчик.

**Pluses and minuses:**

| + | − |
| --------------------------------------------- | ---------------------------------------------------- |
| Параметры, данные поиска и загрузчика вводятся | Другой маршрутизатор, если вы уже используете Next.js App Router |
| Параметры поиска как первоклассное состояние (подобно nuqs) | Настройка файла-плагина для `createFileRoute`              |
| Погрузчики избегают водопадов, связанных с доставкой на месте | Перекрывается режим платформы Next.js/React Router v7 |

**Examples:**

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/posts/$postId')({
  validateSearch: z.object({ tab: z.enum(['info', 'comments']).catch('info') }),
  loader: async ({ params }) => {
    const post = await fetchPost(params.postId); // params.postId: string
    return { post };
  },
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  const { postId } = Route.useParams();
  const { tab } = Route.useSearch();
  return <article><h1>{post.title}</h1><p>{postId} / {tab}</p></article>;
}
```

**Thoughts:** Модуль маршрута *является* источником типа — перехватчики не требуют ручных обобщений.

**Sources:**

[tanstack.com/router](https://tanstack.com/router)

nuqs (параметры поиска URL)

</details>

<details>
  <summary>nuqs (URL search params)</summary>

### nuqs (URL search params)

**Definition:** Типобезопасное состояние параметра поиска для React: `useQueryState` работает как `useState`, но источником истины является строка запроса URL. `qs` — универсальный анализатор строки запроса; nuqs — это ориентированная на React/Next замена состояния фильтра/пагинации.

**How it works:** Оберните приложение с помощью `NuqsAdapter` (Маршрутизатор приложений Next.js: `nuqs/adapters/next/app`). В клиентских компонентах `useQueryState('name')` читает/пишет `?name=`. Парсеры (`parseAsInteger`, `parseAsStringLiteral`, …) принудительные значения и значения по умолчанию. Поделитесь одной картой парсера: `useQueryStates` на клиенте, `createLoader` / `nuqs/server` в Серверных компонентах. `setState(null)` удаляет ключ.

**When to use:**

Фасетный поиск, пагинация, табы в URL. Пропустить, когда TanStack Router `validateSearch` уже владеет строкой запроса или когда параметр является одноразовым `?ref=` вы никогда не пишете из пользовательского интерфейса.

#### Common pitfalls

Импорт парсеров из `nuqs` в компонентах сервера — используйте `nuqs/server`. Забывчивость `NuqsAdapter`. Рассматривать nuqs как кеш для данных сервера (для этого используйте Query).

**Pluses and minuses:**

| + | − |
| --------------------------------------------- | ------------------------------------------------------------------------------- |
| Общее состояние фильтра с возможностью добавления в закладки | Только клиентский крючок — обернуть адаптером || Типизированные парсеры вместо необработанных `URLSearchParams` | Маршрутизатор приложений Next.js уже имеет `useSearchParams`; nuqs добавляет набор текста и пакетную обработку |
| Одни и те же парсеры на сервере и клиенте | Дополнительная библиотека, если вам нужен только один строковый параметр |

**Examples:**

```tsx
// app/layout.tsx
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}

// client
'use client';
import { parseAsInteger, useQueryState } from 'nuqs';

function Pager() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  return <button onClick={() => setPage((p) => p + 1)}>Page {page}</button>;
}
```

**Thoughts:** URL-адрес — это состояние. Разберите его; не скручивай вручную `%5B%5D` кодировка.

**Sources:**

[nuqs.dev](https://nuqs.dev/) · [github.com/47ng/nuqs](https://github.com/47ng/nuqs)

Запрос TanStack против запроса RTK

</details>

<details>
  <summary>TanStack Query vs RTK Query</summary>

### TanStack Query vs RTK Query

**Definition:** Два кеша **состояния сервера**. TanStack Query (React Query) — это автономный кеш, управляемый ключом `queryKey`. RTK Query — та же идея в Redux Toolkit (`createApi`), поэтому кеш сервера находится в хранилище Redux.

**How it works:**

Оба кэшируют JSON в памяти (а не HTTP). `Cache-Control`). TanStack Query v5 использует один объект параметров: `useQuery({ queryKey, queryFn, staleTime })`. По умолчанию `staleTime` равно **0** (всегда устаревшее → фоновая повторная выборка); `gcTime` (был `cacheTime`) по умолчанию — **5 минут**. `invalidateQueries` помечает ключи устаревшими и повторно выбирает активных наблюдателей. RTK-запрос: `createApi` + `keepUnusedDataFor` (по умолчанию **60 с**); перехватчики генерируются из конечных точек.

|              | Запрос TanStack | RTK-запрос |
| ------------ | --------------------------------------------- | ------------------------------ |
| Магазин | Собственный `QueryClient`                             | Магазин Redux |
| Шаблон | Низкий | Выше (`createApi`, ломтики) |
| Лучше всего с | Zustand/Контекст для состояния пользовательского интерфейса | Существующее приложение Redux Toolkit |
| Аннулирование | `queryClient.invalidateQueries({ queryKey })` | `invalidatesTags` о мутациях |

**When to use:**

Новый SPA без Redux → TanStack Query. Большая кодовая база Redux → RTK-запрос. Сервер RSC/Next.js `fetch` первый; добавляйте кэш клиента только для живых обновлений клиента.

#### Common pitfalls

позиционные аргументы v4 (`useQuery(key, fn)`) — v5 требует объектную форму. Размещение состояния формы/переключения в запросе. Забывчивость `queryKey` включает в себя все входные данные, которые меняют ответ.

**Pluses and minuses:**

| + | − |
| ------------------------------------------------ | --------------------------------------------- |
| Запрос: гибкий, не зависящий от платформы | Легко относиться к нему как к глобальному магазину пользовательского интерфейса (не надо) |
| RTK-запрос: одно хранилище, DevTools, поддержка кодирования | Кэш сервера пар для Redux |

**Examples:**

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function Todos() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 30_000,
  });
  const { mutate } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
  return <ul>{data?.map(t => <li key={t.id}>{t.title}</li>)}</ul>;
}
```

**Thoughts:** Запрос кэширует данные **сервера**. Redux/Zustand кэширует данные **клиента**. Не смешивайте их.

**Sources:**

[tanstack.com/query](https://tanstack.com/query/latest) · [redux-toolkit.js.org/rtk-query](https://redux-toolkit.js.org/rtk-query/overview)

CASL (авторизация)

</details>

<details>
  <summary>CASL (authorization)</summary>

### CASL (authorization)

**Definition:** Библиотека изоморфной авторизации: вы определяете **способности** (`can` / `cannot`) на действия над предметами, затем проверяйте их в интерфейсе и на сервере. Поддерживает RBAC (роли → правила) и ABAC (правила для атрибутов).

**How it works:** Создайте `Ability` с `AbilityBuilder` / `defineAbility`. `@casl/react` разоблачает `AbilityProvider`, `<Can I="update" this={article}>`, и `useAbility()`. Тип темы может быть строкой (`'Article'`) или класс с `detectSubjectType`. Сохранение правил из серверной части; никогда не доверяйте проверкам только пользовательского интерфейса.

**When to use:**

Панели администратора, «редактировать собственное сообщение» имеют флажки, которые на самом деле являются разрешениями. Сопряжение с охранниками NestJS или действиями сервера Next.js, которые выполняют повторную проверку. `ability.can(...)`.

#### Common pitfalls

Скрытие кнопки без повторной проверки в мутации. Использование CASL в качестве аутентификации (это **authz**, а не вход в систему).

**Pluses and minuses:**

| + | − |
| -------------------------------------- | ------------------------------------------- |
| Те же правила для клиента и API | Легко забыть о принудительном исполнении на стороне сервера |
| Декларативный `<Can>` сохраняет JSX читабельным | Сложные условия ABAC требуют испытаний |
| Машинопись `MongoAbility` кортежи | Условия в стиле Монго требуют обучения |

**Examples:**

```tsx
import { defineAbility } from '@casl/ability';
import { Can } from '@casl/react';

const ability = defineAbility((can, cannot) => {
  can('read', 'Article');
  can('update', 'Article', { authorId: user.id });
  cannot('delete', 'Article');
});

function Editor({ article }: { article: Article }) {
  return (
    <Can I="update" this={article}>
      <button type="button">Edit</button>
    </Can>
  );
}
```

**Thoughts:** Пользовательский интерфейс может скрываться; сервер должен отказать.

**Sources:**

[casl.js.org](https://casl.js.org/) · [@casl/react](https://github.com/stalniy/casl/tree/master/packages/casl-react)

орвал (кодовый генератор OpenAPI)

</details>

<details>
  <summary>orval (OpenAPI codegen)</summary>

### orval (OpenAPI codegen)

**Definition:** Генерирует клиенты TypeScript, модели и дополнительные макеты на основе спецификации OpenAPI/Swagger — обычно перехватывает запросы TanStack, привязанные к операциям.

**How it works:** Точка `orval.config.ts` по спецификации YAML/JSON; набор `output.client: 'react-query'`. Orval генерирует функции запроса, ключи запроса и `useX` крючки. Используйте **мутатор** для общего Axios/`fetch` экземпляр (заголовки аутентификации). Повторите запуск при изменении спецификации в CI, чтобы типы интерфейса не могли отклоняться от контракта.

**When to use:**

Backend-first команды с OpenAPI; большие поверхности REST. Пропустите одну или две конечные точки.

#### Common pitfalls

Фиксация сгенерированных файлов, которые никто не восстанавливает. Редактирование сгенерированных файлов вручную.

**Pluses and minuses:**

| + | − |
| ----------------------------------------- | --------------------------------------------- |
| Спецификация – источник истины | Спецификация для мусора → крючки для мусора |
| Ключи запроса + аннулирование могут быть сгенерированы | Еще один шаг к сохранению экологии || Дополнительные макеты MSW из той же спецификации | Пользовательским конечным точкам все еще нужны рукописные перехватчики |

**Examples:**

```ts
import { defineConfig } from 'orval';

export default defineConfig({
  petstore: {
    input: { target: './openapi.yaml' },
    output: {
      mode: 'tags-split',
      target: 'src/api/petstore.ts',
      schemas: 'src/api/model',
      client: 'react-query',
      override: {
        mutator: { path: './src/api/mutator.ts', name: 'customInstance' },
      },
    },
  },
});
```

**Thoughts:** Генерировать из контракта; не вводите вручную DTO, которые уже существуют в OpenAPI.

**Sources:**

[orval.dev](https://orval.dev/)

Shadcn / пользовательский интерфейс

</details>

<details>
  <summary>shadcn/ui</summary>

### shadcn/ui

**Definition:** Это не библиотека компонентов npm, которую вы импортируете как черный ящик, а интерфейс командной строки, который **копирует** доступные примитивы (Radix + Tailwind) в *ваш* репозиторий, так что исходный код принадлежит вам.

**How it works:** `npx shadcn@latest init` пишет `components.json`. `npx shadcn@latest add button` капли `components/ui/button.tsx` в проект. Вы редактируете этот файл, как и любой другой компонент. Копирование-вставка без CLI также работает; `components.json` требуется только для CLI.

**When to use:**

Пользовательский интерфейс продукта, который будет отличаться от темы. **Если НЕТ:** вам нужен заблокированный комплект стороннего производителя только с обновлениями Semver.

#### Common pitfalls

Называя это «библиотекой, от которой мы зависим» на собеседованиях, интервьюеры хотят, чтобы «код принадлежал нам». Обертывание каждого примитива до тех пор, пока ничего не станет настраиваемым.

**Pluses and minuses:**

| + | − |
| ------------------------------------- | ------------------------------------------------ |
| Полное владение и настройка | Вы сохраняете копии (a11y + обновления) |
| Работает с RSC (без CSS-in-JS во время выполнения) | По умолчанию не является версионным пакетом дизайн-системы || Доступные примитивы (Radix) | Команда должна договориться о том, когда следует извлекать исходные различия |

**Examples:**

```bash
npx shadcn@latest add button
```

```tsx
import { Button } from '@/components/ui/button';

export function SaveBar() {
  return <Button type="submit">Save</Button>;
}
```

**Thoughts:** Копируйте, владейте, настраивайте — это модель распространения, а не зависимость во время выполнения.

**Sources:**

[ui.shadcn.com](https://ui.shadcn.com/)

Графики (Nivo / amCharts)

</details>

<details>
  <summary>Charts (Nivo / amCharts)</summary>

### Charts (Nivo / amCharts)

**Definition:** Реагируйте на слои диаграмм поверх SVG/Canvas. **Nivo** имеет открытый исходный код, ориентирован на React, под капотом D3. **amCharts** — это пакет коммерческого уровня (оболочка JS + React), используемый, когда продукту требуются усовершенствованные карты/диаграммы акций.

**How it works:** Вы передаете данные + ключи; библиотека управляет масштабами, осями и анимацией. Храните диаграммы в **Клиентских компонентах** (`"use client"`) — им нужен DOM и часто `ResizeObserver`. Для приложений RSC извлеките данные на сервере и передайте сериализуемый массив в лист диаграммы.

**When to use:** Дашборды, аналитика. Предпочитаю **ленивый** `React.lazy` / `next/dynamic` поэтому фрагмент диаграммы не находится на целевой странице.

**Pluses and minuses:**

| + | − |
| --------------------------------------------- | ----------------------------------------------------- |
| Nivo: компонуемый, MIT, хорошие настройки по умолчанию | Размер пакета — маршруты диаграмм с отложенной загрузкой |
| amCharts: карты, диаграмма Ганта, акции, лицензионная польская версия | Стоимость лицензии; более тяжелый API || Декларативный API React | Для доступности диаграмм SVG необходимы заголовки/`aria-label` |

**Examples:**

```tsx
'use client';
import { ResponsiveBar } from '@nivo/bar';

export function RevenueBar({ data }: { data: { month: string; value: number }[] }) {
  return (
    <div style={{ height: 320 }} role="img" aria-label="Revenue by month">
      <ResponsiveBar data={data} keys={['value']} indexBy="month" />
    </div>
  );
}
```

**Thoughts:** Графики — это листы клиента. Получение данных может оставаться на сервере.

**Sources:**

[nivo.rocks](https://nivo.rocks/) · [amcharts.com](https://www.amcharts.com/)

i18n (интернационализация)

</details>

<details>
  <summary>i18n (internationalization)</summary>

### i18n (internationalization)

**Definition:** Обслуживание строк пользовательского интерфейса, дат и чисел для каждого языкового стандарта, а также дополнительная маршрутизация с префиксом языкового стандарта (`/en/about`, `/de/ueber-uns`).

**How it works:** Каталоги сообщений (JSON/ICU) с ключом по пространству имен. В маршрутизаторе приложений Next.js **next-intl** загружает сообщения в `i18n/request.ts` с помощью `getRequestConfig`, оборачивает дерево `NextIntlClientProvider`и использует `useTranslations('HomePage')` в компонентах. Отформатируйте даты с помощью `Intl` (см. [3_js_core.md](./3_js_core.md)) вместо объединения строк.

**When to use:**

Многоязычный продукт, SEO для каждого региона. Пропустите, если продукт навсегда останется однолокальным.

#### Common pitfalls

Жестко закодированные строки пользовательского интерфейса. Разделение предложений по ключам (`t('hello') + name + t('excl')`) — использовать отделение интенсивной терапии `{name}` вместо. Отложенная загрузка локали JSON для неиспользуемых языков на клиенте.

**Pluses and minuses:**

| +                                                                       | −                                                                                  |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Заполнители для отделений интенсивной терапии позволяют избежать нарушений грамматики | Маршрутизация + промежуточное программное обеспечение/прокси должны оставаться синхронизированными |
| Серверные компоненты могут выполнять перевод без отправки клиенту всех локалей | Отсутствующие ключи терпят неудачу во время выполнения, если они не набраны |
| `next-intl` плагин провода `next.config`                                     | Следующий.js 16 `proxy.ts` предназначено только для узлов — промежуточное ПО Edge i18n может оставаться прежним. `middleware.ts` |

**Examples:**

```tsx
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```

```ts
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = 'en';
  return { locale, messages: (await import(`../messages/${locale}.json`)).default };
});
```

**Thoughts:** Перевести сообщения и отформатировать их с помощью `Intl`; не объединяйте грамматику локали.

**Sources:**

[next-intl.dev](https://next-intl.dev/) · [MDN Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)

Тестирование

</details>

<details>
  <summary>Testing</summary>

### Testing

**Definition:** Тестируйте **поведение, которое видят пользователи**, а не детали реализации (внутреннее состояние, порядок вызова перехватчика). Запросы RTL отражают то, как вспомогательные технологии находят элементы.

**How it works:**

1. **Рендеринг** компонента с помощью `render(<App />)`
2. **Запрос** по доступной роли/метке (`getByRole`, `getByLabelText`) - нет `querySelector` или идентификаторы тестов, если это необходимо.
3. **Действуйте** с `userEvent` (предпочтительно) или `fireEvent`
4. **Утверждать** видимые выходные данные (`expect(screen.getByText(...))`)

Пользовательские потоки (вход в систему, форма отправки), условный пользовательский интерфейс, состояния ошибок. **Что НЕ тестировать:** Частные функции, поверхностный снимок всего дерева, внутренние компоненты сторонних библиотек.

Зачем тесты/ААА/пирамида: [7_special.md](./7_special_testing.md#tests-and-aaa).

| Инструмент | Использование || ------------------------- | ---------------------------------------------------------------------------------- |
| **Библиотека тестирования React** | Рендеринг, запрос по роли/метке, срабатывание событий |
| **Джест / Витест** | Запуск теста — [Jest Node против jsdom](./7_special_testing.md#jest--first-tests-node-vs-jsdom) || **ТБО** | Макет сети в интеграционных тестах |

**Examples:**

```tsx
render(<LoginForm />);
await userEvent.type(screen.getByLabelText(/email/i), 'ada@example.com');
await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
```

**Thoughts:**

*Тестируйте как пользователь — роли и метки, а не имена классов.*

Не тестируйте состояние напрямую — проверяйте визуализированный вывод. `userEvent` над `fireEvent` для реалистичного взаимодействия. RTL в jsdom — это **интеграция**, а не E2E — полные пользовательские потоки: [7_special.md — E2E](./7_special_testing.md#e2e-testing).

**Sources:**

[testing-library.com/docs/react-testing-library/intro](https://testing-library.com/docs/react-testing-library/intro/)

---

</details>

## 10. Performance

Диагностика повторных рендерингов

<details>
  <summary>Diagnosing re-renders</summary>

### Diagnosing re-renders

**Definition:** **Повторный рендеринг** — это повторный вызов функции вашего компонента React. Не каждый повторный рендеринг является проблемой — исправляйте его только тогда, когда Profiler показывает измеримую стоимость.

**How it works:**

| Причина | Почему ребенок перерисовывает |
| ------------------------------------ | ------------------------------------------------- |
| Родительское состояние изменено | По умолчанию — дети перерисовываются, если не запомнены |
| Значение контекста изменено | Все потребители перерисовывают |
| Новый объект/функция для каждого рендеринга | `style={{}}`, `onClick={() => ...}` перерывы `memo` |
| Изменено расположение крючков | `useContext`, крючки на заказ |

React DevTools **Profiler** — запись взаимодействия → «почему это произошло?» Выделение обновлений включает повторную визуализацию флэш-памяти в dev.

1. **Переместить состояние вниз** — оставляют состояние только для тех, кому это необходимо.
2. **Разделение контекста** — тема, пользователь и диспетчеризация.
3. **Запомнить значение контекста** — `useMemo` у провайдера `value`
4. `React.memo` **/Компилятор** на дорогих чистых детях
5. **Виртуализация** длинных списков (`@tanstack/react-virtual`)

**Examples:**

```tsx
// New object/function every render → memo child still re-renders
<Item style={{ color }} onClick={() => save(id)} />

// Stabilize when Profiler shows cost
const style = useMemo(() => ({ color }), [color]);
const onClick = useCallback(() => save(id), [id]);
```

**Thoughts:** *Сначала профилируйте — большинство повторных рендерингов обходятся дешево; исправить архитектуру перед поливкой* `memo`*.*

**See also:** [memo / useMemo / useCallback vs Compiler](#memo--usememo--usecallback-vs-compiler) · [Конвейер рендеринга](./4_react_core.md#render-pipeline)

**Sources:**

[react.dev/learn/react-developer-tools](https://react.dev/learn/react-developer-tools)

memo/useMemo/useCallback против компилятора

</details>

<details>
  <summary>memo / useMemo / useCallback vs Compiler</summary>

### memo / useMemo / useCallback vs Compiler

**Definition:** Ручное запоминание (`memo`, `useMemo`, `useCallback`) пропускает работу, если deps не изменились. **Компилятор React** делает это автоматически во время сборки.

**How it works:**

| Инструмент | Что он кэширует |
| ------------- | ------------------------------------------- |
| `React.memo`  | Целый компонент, если реквизит неглубокий-равный |
| `useMemo`     | Дорогая расчетная стоимость |
| `useCallback` | Справочник функций для стабильных дочерних отделов |
| **Компилятор** | Все вышеперечисленное, когда анализ оказывается безопасным |

Компилятора пока нет; проверенное узкое место в Profiler; третья сторона `memo` детям нужен устойчивый реквизит.

**When to use:**

Преждевременная оптимизация; мутирование реквизита на месте (памятка не поможет).

| Без компилятора | с компилятором React |
| -------------------------------- | ------------------------------------ |
| Руководство `memo` по пунктам списка | Компилятор автоматически пропускает, если реквизиты стабильны |
| `useCallback` для воспитателей детей | Обычно не требуется |
| Профиль перед запоминанием | Еще профиль — Компилятор — это не волшебство |

**Examples:**

```tsx
const Row = React.memo(function Row({ item }: { item: Item }) {
  return <div>{item.name}</div>;
});
```

**Thoughts:** *Компилятор заменяет ручные заметки для большинства приложений — профиль, не угадайте.*

**See also:** [Компилятор React](./4_react_server.md#react-compiler) · [useMemo / useCallback](./4_react_hooks.md#usememo--usecallback)

**Sources:**

[react.dev/learn/react-compiler](https://react.dev/learn/react-compiler)

Разделение кода

</details>

<details>
  <summary>Code splitting</summary>

### Code splitting

**Definition:** Разделите JavaScript на **несколько частей**, чтобы пользователи загружали только код, необходимый для текущего маршрута или взаимодействия, а не все приложение заранее.

**How it works:** Бандлеры (Vite, webpack, Rollup) создают отдельные файлы для каждого динамического `import()`. `React.lazy` запускает загрузку фрагмента при первом рендеринге; Ожидание показывает запасной вариант, пока он не прибудет. Разделение на уровне маршрута отображает один фрагмент на каждый маршрут. Разделение на уровне компонентов откладывает тяжелые библиотеки (диаграммы, редакторы). Разделение обработчика событий загружает код при нажатии (`import()` внутренний обработчик). Фреймворки автоматически разбиваются по маршрутам в файловых маршрутизаторах.

**When to use:** Панель администратора, просмотрщик PDF-файлов, файлы локали i18n, редко используемые экраны настроек.

**Pluses and minuses:**

| + | − |
| ---------------------------------- | ----------------------------------------- |
| Меньший первоначальный пакет, более быстрый TTI | Больше HTTP-запросов (уменьшается HTTP/2) |
| Платите за то, что используете, за маршрут | Водопад, если цепочка кусков без предварительной выборки |
| Легко с `lazy` + динамический импорт | Сбои нагрузки требуют границ ошибок |

**Examples:**

```tsx
// Route-level
const Settings = lazy(() => import('./Settings'));

// Interaction-level
async function exportPdf() {
  const { generatePdf } = await import('./pdf');
  generatePdf(data);
}
```

**Thoughts:** Анализируйте пакеты с помощью `rollup-plugin-visualizer` или анализатор пакетов Next.js. Предварительная выборка маршрутов при наведении курсора мыши или видимости ссылки, когда задержка имеет значение.

**Sources:**

[react.dev/reference/react/lazy](https://react.dev/reference/react/lazy)

Список виртуализации

</details>

<details>
  <summary>List virtualization</summary>

### List virtualization

**Definition:** Отрисовывайте только **видимые строки** (плюс небольшой буфер пересканирования) в длинных прокручиваемых списках — количество узлов DOM остается постоянным независимо от размера списка.

**How it works:** Виртуализатор вычисляет, какие элементы пересекают область просмотра прокрутки. `scrollTop`, высота контейнера и фиксированная/переменная высота строк. Только эти индексы монтируются как узлы DOM; элементы за кадром отсутствуют в документе. При прокрутке виртуализатор обновляет видимое окно и перемещает строки с помощью `transform` или абсолютный `top` смещения. Библиотеки: `@tanstack/react-virtual`, `react-window`, `react-virtuoso`.

**When to use:** Таблицы данных с тысячами строк, бесконечными каналами, историей сообщений чата, средствами просмотра журналов. Порог: учитывайте, когда **более 1000 узлов DOM** в одном контейнере прокрутки вызывают зависание.

**Pluses and minuses:**

| + | − |
| -------------------- | ---------------------------------------------- |
| Более 10 тыс. строк без замедления браузера | Фиксированная высота строки проще; переменная высота требует измерения |
| Постоянная память и стоимость краски | Разрыв встроенной страницы поиска для строк за кадром || Необходим для создания сеток данных и журналов чатов | Навигация с помощью клавиатуры требует дополнительной работы |

**Examples:**

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
  });
  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map(row => (
          <div key={row.index} style={{ position: 'absolute', top: row.start, height: row.size }}>
            {items[row.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Sources:**

[tanstack.com/virtual](https://tanstack.com/virtual)

Web Vitals в приложениях React

</details>

<details>
  <summary>Web Vitals in React apps</summary>

### Web Vitals in React apps

**Definition:** Основные показатели производительности (LCP, INP, CLS), применяемые к приложениям React — размер пакета, стоимость интеграции и стабильность макета напрямую влияют на оценки.

**How it works:**

| Метрическая | Реагирующий рычаг |
| ------- | ------------------------------------------------------------------------------------------------------- |
| **ЛКП** | Меньший комплект(`lazy`), RSC для статического контента, SSR/потоковая передача для быстрого HTML |
| **ИЯФ** | `useTransition` для тяжелых обновлений избегайте длительной синхронизации обработчика кликов, разделения кода |
| **CLS** | Сопоставьте размеры скелета с конечным содержанием; резервное пространство изображения; избегайте вставки поверх существующего контента |

- Анализируем пакет: `rollup-plugin-visualizer` / Анализатор Next.js
– Предпочитайте RSC для статического, неинтерактивного контента.
- Отложите некритичный JS с помощью `lazy` + `Suspense`
- Избегайте сбоев макета `useLayoutEffect`
- INP: гранулированный `<Suspense>`, Реагировать 19.2 `<Activity mode="hidden">` → [6_web_api.md — INP](./6_web_api_security.md#inp-interaction-to-next-paint)
- Причины CLS в HTML/CSS → [1_html.md — CLS](./1_html_ Performance.md#cls-cumulative-layout-shift)

**Examples:**

```bash
npm run build && npx @next/bundle-analyzer
```

**Thoughts:** *Жизненно важные показатели измеряют скорость, воспринимаемую пользователем, — оптимизируйте работу связок, гидратации и основного потока.*

**Sources:**

[web.dev/vitals](https://web.dev/vitals/) · [react.dev — Activity](https://react.dev/reference/react/Activity)

---

</details>

## 11. Legacy & migration

Компоненты класса (устаревшие)

<details>
  <summary>Class components (legacy)</summary>

### Class components (legacy)

**Definition:**

Расширение классов ES6 `React.Component` с `render()` метод. По-прежнему поддерживается, но не рекомендуется для нового кода.

| Жизненный цикл класса | Крючки эквивалентные |
| ------------------------------ | ------------------------------ |
| `constructor`                  | `useState` начальная стоимость |
| `componentDidMount`            | `useEffect(() => {}, [])`      |
| `componentDidUpdate`           | `useEffect(() => {}, [deps])`  |
| `componentWillUnmount`         | `useEffect` уборка |
| `shouldComponentUpdate`        | `React.memo` + неизменяемый реквизит |
| `this.state` / `this.setState` | `useState` / `useReducer`      |

**How it works:**

- Границы ошибок (по-прежнему только для классов)
- `this.forceUpdate()` (анти-паттерн — используйте `key` перемонтировать)

**Examples:**

```tsx
class Counter extends React.Component {
  state = { count: 0 };
  render() { return <button onClick={() => this.setState(s => ({ count: s.count + 1 }))}>{this.state.count}</button>; }
}
```

**Sources:**

[react.dev/reference/react/Component](https://react.dev/reference/react/Component)

Чистый Компонент

</details>

<details>
  <summary>PureComponent</summary>

### PureComponent

**Definition:** База компонентов устаревшего класса (`extends React.PureComponent`), который **пропускает повторный рендеринг**, когда реквизиты и состояние **полностью равны** предыдущему рендерингу.

**How it works:** `PureComponent` реализует `shouldComponentUpdate` с поверхностным сравнением — то же, что `React.memo` для функциональных компонентов. Сравнивает каждое поле свойства/состояния с `Object.is`. Изменения вложенных объектов внутри одной и той же ссылки **не** вызывают повторный рендеринг (та же ошибка, что и `memo`). Современный эквивалент: `React.memo(Component)` или автоматическое запоминание с помощью React Compiler.

**When to use:** Элементы списка устаревших классов с примитивными реквизитами, ссылка на миграцию при чтении старого кода. **Новый код:** `memo` + неизменяемые обновления или компилятор React.

**Pluses and minuses:**

| + | − |
| --------------------------------- | ------------------------------------- |
| Дешевый скип для стабильных опор | Поверхностное сравнение пропускает глубокие мутации |
| Знаком с устаревшими кодовыми базами | Только класс — не для нового кода |
| Уменьшает количество ненужных дочерних рендеров | Руководство — Компилятор может заменить необходимость |

**Examples:**

```tsx
// Legacy class
class Item extends React.PureComponent<{ name: string }> {
  render() { return <li>{this.props.name}</li>; }
}

// Modern equivalent
const MemoizedItem = React.memo(function Item({ name }: { name: string }) {
  return <li>{name}</li>;
});
```

**Thoughts:** Неглубокое равенство означает `{ user: { name: 'Ada' } }` с мутировавшим `user.name` не будет перерисовываться — всегда рассматривайте реквизиты как неизменяемые.

**Sources:**

[react.dev/reference/react/PureComponent](https://react.dev/reference/react/PureComponent) · [памятка](https://react.dev/reference/react/memo)

Создать приложение React

</details>

<details>
  <summary>Create React App</summary>

### Create React App

**Definition:** Бывший официальный фреймворк **zero-config** React (`create-react-app`) — в комплекте веб-пакет, Babel и шаблон одностраничного приложения без извлечения.

**How it works:** `npx create-react-app my-app` создал проект с `react-scripts` скрытие конфигурации веб-пакета. Необратимое удаление открытой конфигурации. CRA поддерживает SPA только для клиента — без SSR, без файловой маршрутизации, медленные сборки в масштабе. Команда React **отменила поддержку CRA** (февраль 2025 г.) в пользу Vite и мета-фреймворков.

**When to use:** Поддержание существующих приложений CRA (перенос при возможности). **Новые проекты:** Vite, Next.js или Expo.

**Pluses and minuses:**

| + | − |
| ---------------------------------------- | ---------------------------------- |
| Нулевой конфиг для новичков (исторически) | Устарело — больше не рекомендуется |
| Знакомо многим разработчикам | Медленный сервер разработки веб-пакетов против Vite |
|                                          | Нет SSR/RSC в стандартной комплектации ||                                          | Трудно настроить без извлечения |

**Examples:**

```bash
# Deprecated — do not start new projects
# npx create-react-app my-app

# Recommended replacements
npm create vite@latest my-app -- --template react-ts
npx create-next-app@latest my-app
```

**Thoughts:** Путь миграции: Vite для SPA (`@vitejs/plugin-react`), Next.js для полного стека. См. [сообщение в блоге Sunsetting CRA](https://react.dev/blog/2025/02/14/sunsetting-create-react-app).

**Sources:**

[react.dev/blog/2025/02/14/sunsetting-create-react-app](https://react.dev/blog/2025/02/14/sunsetting-create-react-app)

переадресация → ссылка опора

</details>

<details>
  <summary>forwardRef → ref prop</summary>

### forwardRef → ref prop

**Definition:** React 19 позволяет функциональным компонентам принимать `ref` как **обычный реквизит** вместо обертывания `forwardRef`.

**How it works:**

Объявить `ref` в типе реквизита перейдите к элементу DOM или дочернему элементу. `forwardRef` по-прежнему работает для обратной совместимости — мигрируйте при касании кода. Машинопись: `ref?: Ref<HTMLInputElement>` or `ComponentPropsWithRef<'input'>`.

Проектируйте входные данные системы, оболочки вокруг собственных элементов, любые родители компонентов, на которых нужно сосредоточиться/измерить.

**Examples:**

```tsx
// Before (React 18)
const Input = forwardRef<HTMLInputElement, Props>((props, ref) => <input ref={ref} {...props} />);

// After (React 19)
function Input({ ref, ...props }: Props & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}
```

**Thoughts:** `ref` *теперь это просто реквизит — без оболочки HOC.*

**See also:** [ref as prop](./4_react_server.md#ref-as-prop) · [Refs (React 19)](./4_react_hooks.md#refs-react-19-ref-as-prop)

**Sources:**

[react.dev/blog/2024/12/05/react-19](https://react.dev/blog/2024/12/05/react-19)

Контрольный список миграции

</details>

<details>
  <summary>Migration checklist</summary>

### Migration checklist

**Definition:** Пошаговые обновления при модернизации устаревших кодовых баз React до шаблонов React 18/19.

**How it works:**

| Шаг | От | Чтобы |
| ---- | -------------------------- | ------------------------------------- |
| 1 | `ReactDOM.render`          | `createRoot` / `hydrateRoot`          |
| 2 | Компоненты класса | Функция + крючки |
| 3 | `UNSAFE_*` жизненные циклы | `useEffect` с очисткой |
| 4 | `forwardRef` обертки | `ref` в качестве реквизита (React 19) |
| 5 | Руководство `isLoading` формы | Действия + `useActionState`            |
| 6    | `useEffect` получить на монтировании | Загрузчики маршрутизаторов / RSC / TanStack Query |
| 7 | Руководство `memo` повсюду | Оценка компилятора React |
| 8 | КРА | Vite (SPA) или Next.js (полный стек) |

**Examples:**

```tsx
// React 18+ root API
import { createRoot } from 'react-dom/client';
createRoot(document.getElementById('root')!).render(<App />);
```

**Thoughts:** *Сначала обновляйте среду выполнения, затем шаблоны — по одному критическому изменению за раз.*

**Sources:**

[react.dev/blog/2022/03/08/react-18-upgrade-guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)

---

</details>
