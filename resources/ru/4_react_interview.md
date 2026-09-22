# React — Interview

Интервью с вопросами и ответами и задания по кодированию.

[ ← Вернуться в центр](./4_react.md)

### Related docs

* [React — Core](./4_react_core.md) · [React — Hooks](./4_react_hooks.md) · [React — React 19](./4_react_server.md) · [React — Ecosystem](./4_react_ecosystem.md) · [React — Интервью](./4_react_interview.md)

### Sections

- [Questions & Answers](#questions-answers)
- [Coding tasks](#coding-tasks)

---

## Questions & Answers

Государство против реквизита?

<details>
  <summary>State vs props?</summary>

### State vs props?

**Answer:** **Props** = входные данные родительского объекта, доступные только для чтения. **Состояние** = данные, которыми владеет компонент; установщик планирует повторный рендеринг. Распределить между братьями и сестрами → перенести до ближайшего родителя.

**See also:** [Состояние против реквизита](#state-vs-props) · [Поднятие состояния](./4_react_core.md#lifting-state-up)

Почему крючки? Нестандартные крючки?

</details>

<details>
  <summary>Why hooks? Custom hooks?</summary>

### Why hooks? Custom hooks?

**Answer:** Хуки позволяют функциональным компонентам сохранять состояние и синхронизироваться с внешним миром без использования классов или `this`. Связанная логика сидит вместе (`useEffect` за подписку) вместо разделения между `componentDidMount` / `componentDidUpdate` / `componentWillUnmount`. Обычай `useX` повторно использует **эту логику**; каждый вызов имеет свое **собственное** состояние — два `useForm()` вызовы — это две формы, а не одно общее хранилище. Порядок вызовов должен быть стабильным при каждом рендеринге → [Правила перехватчиков](./4_react_hooks.md#rules-of-hooks) (в `if` /петли; `eslint-plugin-react-hooks`). Классы остаются для границ ошибок, если вы не используете библиотеку.

**See also:** [Справочник по крючкам](./4_react_hooks.md#5-hooks-reference) · [Пользовательские крючки](./4_react_hooks.md#custom-hooks)

Фрагменты и порталы?

</details>

<details>
  <summary>Fragments and portals?</summary>

### Fragments and portals?

**Answer:** **Фрагмент** (`<>`) = дополнительная группировка, нулевой DOM. **Портал** (`createPortal`) = DOM в другом месте (`document.body`), но дерево/события React остаются с родителем.

**See also:** [Фрагменты](./4_react_core.md#fragments) · [Порталы](./4_react_hooks.md#portals)

useRef против createRef?

</details>

<details>
  <summary>useRef vs createRef?</summary>

### useRef vs createRef?

**Answer:** `useRef` стабилен при рендеринге. `createRef()` в теле функции есть **новый объект при каждом рендеринге** — используйте его только для экземпляров класса.

**See also:** [useRef](./4_react_hooks.md#useref)

Виртуальный DOM и согласование?

</details>

<details>
  <summary>Virtual DOM and reconciliation?</summary>

### Virtual DOM and reconciliation?

**Answer:** Различие **деревьев элементов** (простых объектов) по `type` + `key` — не живой клон DOM. Повторный рендеринг ≠ запись DOM. Клетчатка делает прогулку прерываемой.

**See also:** [Виртуальный DOM и согласование](./4_react_core.md#virtual-dom--reconciliation) · [React Fiber](./4_react_core.md#react-fiber)

Зачем перечислять ключи? Индекс как ключ?

</details>

<details>
  <summary>Why list keys? Index as key?</summary>

### Why list keys? Index as key?

**Answer:** `key` это идентичность во всех рендерах. Индекс подходит только для **статических** списков. Переупорядочение/фильтр + индекс → неправильное повторное использование экземпляра и устаревшее состояние. Никогда `key={Math.random()}`.

**See also:** [Ключи](./4_react_core.md#keys)

Контекст против Redux против Zustand против React Query?

</details>

<details>
  <summary>Context vs Redux vs Zustand vs React Query?</summary>

### Context vs Redux vs Zustand vs React Query?

**Answer:** Контекст = редкие общие значения (тема/аутентификация). Redux/Zustand = состояние клиентского приложения. TanStack Query = кэш сервера. URL = общие фильтры. Не помещайте горячую корзину в один контекст.

**See also:** [Контекст](./4_react_core.md#context) · [Библиотеки управления состоянием](./4_react_ecosystem.md#state-management-libraries) · [Запрос TanStack против запроса RTK](./4_react_ecosystem.md#tanstack-query-vs-rtk-query)

Как React.lazy загружает компонент, когда условие становится истинным?

</details>

<details>
  <summary>How does React.lazy load a component when a condition becomes true?</summary>

### How does React.lazy load a component when a condition becomes true?

**Answer:** `lazy(() => import('./X'))` хранит погрузчик. Первый рендер `<X />` бежит `import()`, Приостановка показывает запасной вариант, Кеши React `default`. Последующие перемонтирования повторно используют чанк.

**See also:** [React.lazy + Suspense](./4_react_hooks.md#reactlazy--suspense)

useEffect против useLayoutEffect?

</details>

<details>
  <summary>useEffect vs useLayoutEffect?</summary>

### useEffect vs useLayoutEffect?

**Answer:** После фиксации DOM: `useInsertionEffect` (CSS-в-JS) → `useLayoutEffect` (**синхронизация перед рисованием** не позволяет пользователю увидеть неправильный кадр) → рисование в браузере → `useEffect` (после покраски, по умолчанию). Получение, подписки, аналитика → `useEffect`. Измерить подсказку/фокус без мерцания → `useLayoutEffect`. Эффекты доступны **только для клиента**. Не относитесь к ним как к `componentDidMount` — очистка также запускается при **изменении deps**, а строгий режим запускает дополнительную настройку/очистку в процессе разработки.

**See also:** [useEffect](./4_react_hooks.md#useeffect) · [useLayoutEffect](./4_react_hooks.md#uselayouteffect) · [конвейер рендеринга](./4_react_core.md#render-pipeline)

Библиотека React или фреймворк?

</details>

<details>
  <summary>React library or framework?</summary>

### React library or framework?

**Answer:** React — это **библиотека** (стек составляете вы). Режим платформы Next.js/React Router **инвертировать управление** (маршруты файлов, SSR/RSC).

**See also:** [Библиотека против фреймворка](./4_react_core.md#library-vs-framework)

Что такое Реакт?

</details>

<details>
  <summary>What is React?</summary>

### What is React?

**Answer:** JS **библиотека** для UI из компонентов — опишите `UI = f(state)`; React согласовывает DOM.

**See also:** [Реагировать](./4_react_core.md#react)

Что такое JSX? Во что это компилируется?

</details>

<details>
  <summary>What is JSX? What does it compile to?</summary>

### What is JSX? What does it compile to?

**Answer:** Сахар для `createElement(type, props, ...children)`. Не HTML: `className`, `{expr}`.

**See also:** [JSX](./4_react_core.md#jsx)

Что происходит при рендеринге компонента?

</details>

<details>
  <summary>What happens when a component renders?</summary>

### What happens when a component renders?

**Answer:** React **вызывает** функцию → снимок элемента. Тогда коммит может (или не может) коснуться DOM. Параллельный рендеринг может повторяться перед одним коммитом.

**See also:** [Конвейер рендеринга](./4_react_core.md#render-pipeline)

Что такое `useState`? Почему бы не изменить состояние?

</details>

<details>
  <summary>What is `useState`? Why not mutate state?</summary>

### What is `useState`? Why not mutate state?

**Answer:** `useState` возвращает `[snapshot, set]`. `set` **ставит в очередь** следующий рендеринг; он не меняет переменную в текущем замыкании (`console.log(count)` после `setCount` все еще показывает старое значение). React пропускает обновление, если `Object.is(next, current)` - мутирующий `items.push(x)` затем `setItems(items)` сохраняет ту же ссылку, поэтому пользовательский интерфейс может не обновляться. Копировать: `setItems([...items, x])` или программа обновления `setItems(prev => [...prev, x])`. Ленивая инициализация: пройти `useState(createTodos)` нет `createTodos()`. Предпочитать `useReducer` когда многие связанные поля изменяются вместе.

**See also:** [useState](./4_react_hooks.md#usestate) · [Задача 2 — Мутация состояния](#task-2-state-mutation)

`useEffect` и массив зависимостей?

</details>

<details>
  <summary>`useEffect` and the dependency array?</summary>

### `useEffect` and the dependency array?

**Answer:** После рисования React сравнивает каждую версию с `Object.is`. **Нет массива** = каждый коммит. **`[]`** = только первая фиксация (плюс дополнительный цикл строгого режима в разработке). **`[id, url]`** = повторный запуск при изменении значений: очистка (старые значения), затем настройка (новые значения). Перечислите все реактивные значения, которые считывает эффект (`eslint` `exhaustive-deps`). Отсутствующие данные → устаревшие закрытия. Объект/функция, созданная при рендеринге как dep → каждый раз перезапускается. Предпочитайте создавать этот объект **внутри** эффекта; не выполнять обратный вызов эффекта `async`.

**See also:** [useEffect](./4_react_hooks.md#useeffect) · [Задача 3 — Зависимость объекта в useEffect](#task-3--object-dependent-in-useeffect)

Устаревшие закрытия?

</details>

<details>
  <summary>Stale closures?</summary>

### Stale closures?

**Answer:** Функция «закрывает» реквизит/состояние из рендеринга, который его создал. Эффект с `[]` это читается `count` всегда видит **первым** `count`. Исправлено: добавить `count` в deps или используйте функциональное средство обновления `setCount(c => c + 1)`или Реагировать 19.2 `useEffectEvent` для «прочитать последнее без повторной подписки». Не «исправляйте» это, опуская массив deps, если только вы действительно не хотите выполнять повторный запуск после каждого коммита.

**See also:** [useEffect](./4_react_hooks.md#useeffect) · [useEffectEvent](./4_react_hooks.md#useeffectevent-react-192)

Почему `useEffect` запустить дважды на монтировании?

</details>

<details>
  <summary>Why does `useEffect` run twice on mount?</summary>

### Why does `useEffect` run twice on mount?

**Answer:** **Строгий режим, только для разработки.** React запускает настройку → очистку → настройку, чтобы доказать, что очистка отменяет настройку. Производство монтируется один раз. Двойные сетевые вызовы означают, что вам нужно `AbortController` / флаг игнорирования / реальное отключение — нет `useRef` пропустить второй запуск.

**See also:** [Строгий режим](./4_react_core.md#strict-mode) · [useEffect](./4_react_hooks.md#useeffect)

`useState` vs `useReducer`?

</details>

<details>
  <summary>`useState` vs `useReducer`?</summary>

### `useState` vs `useReducer`?

**Answer:** То же хранилище. `useState` для одного значения или независимых полей. `useReducer` когда следующее состояние является **переходом** (`action` → новое состояние): формы, мастера, «это поле зависит от того». `dispatch` является стабильным; `setState` тоже, но вы часто пропускаете много сеттеров. Не является заменой Redux/Zustand (они **глобальны**).

**See also:** [useState](./4_react_hooks.md#usestate) · [useReducer](#usereducer-1)

`useRef` vs `useState`?

</details>

<details>
  <summary>`useRef` vs `useState`?</summary>

### `useRef` vs `useState`?

**Answer:** Оба сохраняются во время рендеринга. `ref.current = x` **не** выполняет повторную визуализацию (узел DOM, идентификатор таймера, предыдущее значение). `setState` **делает** — используйте его для чего угодно на экране. Не читайте и не записывайте ссылки во время рендеринга. `useRef` ≠ `createRef()` в функциональных компонентах (`createRef` это новый объект при каждом рендеринге).

**See also:** [useRef](./4_react_hooks.md#useref) · [State](./4_react_core.md#state)

`useCallback` vs `useMemo`?

</details>

<details>
  <summary>`useCallback` vs `useMemo`?</summary>

### `useCallback` vs `useMemo`?

**Answer:** `useMemo(() => compute(), deps)` **бежит** `compute` и кэширует **результат**. `useCallback(fn, deps)` кэши**`fn` сам** (эквивалент `useMemo(() => fn, deps)`). Полезно, когда `memo` дочерний элемент будет перерисовываться из-за новой функции или когда функция является функцией эффекта. Не полезно для каждого обработчика. Предпочитаю перемещать функции **внутри** `useEffect` за запоминание их как deps. Компилятор может многое из этого заменить.

**See also:** [useMemo / useCallback](./4_react_hooks.md#usememo--usecallback)

Что такое специальные крючки?

</details>

<details>
  <summary>What are custom hooks?</summary>

### What are custom hooks?

**Answer:** `function useX()` это вызывает другие хуки. Делитесь **поведением** (подписка, форма грязной проверки), а не JSX и не публикуемым автоматически состоянием. Каждый сайт вызова независим. `use` префикс — это то, как линтер применяет Правила хуков. Предпочитайте перехваты HOC по той же логике.

**See also:** [Пользовательские крючки](./4_react_hooks.md#custom-hooks)

Контекстный API — когда использовать?

</details>

<details>
  <summary>Context API — when to use?</summary>

### Context API — when to use?

**Answer:** Тема, локаль, авторизация — много потребителей, редкие обновления. Не горячий магазин. Остальное: реквизит, композиция, состояние лифта, URL, Zustand.

**See also:** [Контекст](./4_react_core.md#context)

HOC — что, почему менее распространено, чем крючки?

</details>

<details>
  <summary>HOC — what, why less common, vs hooks?</summary>

### HOC — what, why less common, vs hooks?

**Answer:** `(Component) => Enhanced` вводит реквизит. Адская обертка + конфликты реквизитов. Предпочитайте хуки для той же логики.

**See also:** [Шаблоны композиции](./4_react_core.md#composition-patterns)

Почему хуки заменили компоненты класса?

</details>

<details>
  <summary>Why did hooks replace class components?</summary>

### Why did hooks replace class components?

**Answer:** Связанная логика живет в одной функции (`useEffect` настройка + очистка) вместо трех методов класса. Нет `this` привязка. Повторное использование через специальные хуки вместо HOC. Классы все еще существуют (границы ошибок, если библиотека их не предоставляет). Хуки сами по себе не «быстрее» — они соответствуют модели «функция-компонент».

**See also:** [Компоненты класса (устаревшие)](./4_react_ecosystem.md#class-comComponents-legacy)

Зачем дополнительные повторные рендеры? Как их уменьшить?

</details>

<details>
  <summary>Why extra re-renders? How to reduce them?</summary>

### Why extra re-renders? How to reduce them?

**Answer:** Родитель/контекст/`memo` сломанный новым `{}`/`() =>`. Исправлено: переместить состояние вниз, разделить контекст, затем `memo`/Компилятор, виртуализация списков. Профиль в первую очередь.

**See also:** [Диагностика повторного рендеринга](./4_react_ecosystem.md#diagnosing-rerenders)

Почему следует избегать создания объектов при рендеринге?

</details>

<details>
  <summary>Why avoid creating objects in render?</summary>

### Why avoid creating objects in render?

**Answer:** `style={{}}` / `onClick={() =>}` каждый раз новая ссылка → `memo` дети все равно перерисовывают. Стабилизировать с помощью `useMemo` / `useCallback` когда это имеет значение.

**See also:** [memo/useMemo/useCallback vs Compiler](./4_react_ecosystem.md#memo--usememo--usecallback-vs-compiler)

React Fiber и параллельный рендеринг?

</details>

<details>
  <summary>React Fiber and concurrent rendering?</summary>

### React Fiber and concurrent rendering?

**Sequence:** Обновление очереди → рендеринг WIP (DFS: `beginWork` ↓ / `completeWork` ↑) → зафиксировать флаги в DOM. Рендер можно прервать; коммит нет. Рендер ≠ краска.

**Chunks:** Волокна до `shouldYield()` (~5 мс) — пауза *между* волокнами, возобновление следующего; commit никогда не уступает.

**Priority:** Планировщик *когда*; полосы *которые* (синхронизация > ввод > по умолчанию > переход > холостой ход). Срочно отбрасывает незавершенное производство. API: `useTransition`, `useDeferredValue`, `Suspense`, `createRoot`.

**Thoughts:** *Рабочий цикл согласовывается в памяти; совершать сбросы атомарно; Планировщик решает, когда.*

**See also:** [React Fiber](./4_react_core.md#react-fiber) · [Параллельный рендеринг](./4_react_core.md#concurrent-rendering)

React и DOM браузера?

</details>

<details>
  <summary>React and the browser DOM?</summary>

### React and the browser DOM?

**Definition:** `react-dom` соединяет дерево элементов React с реальными узлами DOM через `createRoot`.

**How it works:**

- Согласование деревьев различий — обновляются только измененные узлы.
- Пакеты несколько `setState` вызовы в один коммит (React 18+)
- Делегирование событий через синтетические события
- Fiber отдает приоритет срочным обновлениям.

`setState` **из просмотра браузера:** Графики рендеринга → согласования → фиксации изменений DOM → макета → рисования → запуска эффектов.

**Thoughts:** *React быстрее, чем наивный прямой DOM, не потому, что VDOM — это волшебство, а потому, что он пакетирует, сравнивает и минимизирует записи.*

**See also:**

[Виртуальный DOM и примирение?](#virtual-dom-and-reconciliation)

Первый рендеринг SPA или SSR?

</details>

<details>
  <summary>SPA first render vs SSR?</summary>

### SPA first render vs SSR?

**Definition:**

**SPA (CSR):** браузер загружает пакет JS, выполняет, собирает DOM на стороне клиента — пустой/скелетный, пока не запустится JS. **SSR:** сервер отправляет HTML с содержимым; браузер гидратируется.

|               | СПА (КСО) | ССР |
| ------------- | ---------------------- | ----------------- |
| Первая краска | Медленно (требуется JS) | Быстро (готово для HTML) |
| SEO | Слабый без пререндера | Сильный || Интерактивность | После гидратации | После гидратации |

**Thoughts:** *SPA = клиент создает пользовательский интерфейс; SSR = сервер сначала отправляет HTML.*

**See also:**

[SPA против SSR против RSC](./4_react_server.md#8-server-rendering--rsc) · [4_nextjs.md Практика собеседований](./4_nextjs_interview.md#interview-practice) · [Типы веб-приложений](./6_web_api_apps.md#types-of-web-apps)

TanStack Query против RTK-запроса — когда?

</details>

<details>
  <summary>TanStack Query vs RTK Query — when?</summary>

### TanStack Query vs RTK Query — when?

**Definition:** Оба кэшируют состояние **сервера**. Выберите TanStack Query, если приложение еще не находится в Redux Toolkit.

**How it works:**

Ключи запроса идентифицируют данные; мутации делают ключи недействительными. RTK Query генерирует перехваты из `createApi` и сохраняет кеш в Redux. Переключатели пользовательского интерфейса и черновики форм остаются в силе. `useState` /Zustand — нет в кеше сервера.

| Выбрать | Когда |
| ------------------ | ----------------------------------------- |
| **Запрос TanStack** | Новый SPA, Zustand/Context для государства-клиента |
| **RTK-запрос** | Существующее хранилище RTK, одно дерево DevTools |
| **РСЦ** `fetch`    | Данные начальной страницы Next.js App Router |

**Thoughts:** Кэш сервера ≠ клиентское хранилище.

**See also:**

[Запрос TanStack против запроса RTK](./4_react_ecosystem.md#9-ecosystem--architecture)

Как скрыть кнопку «Редактировать», которую пользователь не может использовать?

</details>

<details>
  <summary>How do you hide an Edit button the user cannot use?</summary>

### How do you hide an Edit button the user cannot use?

**Definition:** Авторизация (CASL) может скрыть пользовательский интерфейс, но **мутация должна быть запрещена** на сервере.

**How it works:** `<Can I="update" this={article}>` оборачивает кнопку. Действие сервера/API все еще вызывает `ability.cannot('update', article)` и возвращает 403. Роли сопоставляются с правилами; атрибуты (`authorId`) включить ABAC.

**Thoughts:** Скрыть в пользовательском интерфейсе; применить на сервере.

**See also:**

[CASL](./4_react_ecosystem.md#9-ecosystem--архитектура)

Является ли shadcn/ui библиотекой компонентов npm?

</details>

<details>
  <summary>Is shadcn/ui an npm component library?</summary>

### Is shadcn/ui an npm component library?

**Definition:** Нет — CLI копирует исходный код в `components/ui`. Вы являетесь владельцем и редактируете файлы (Radix + Tailwind).

**When to use:** Пользовательский интерфейс продукта, который вы сможете настроить. Когда НЕТ: вам нужен заблокированный сторонний комплект только с обновлениями Semver.

**Thoughts:** Распространение исходного кода, а не зависимость от «черного ящика».

**See also:**

[shadcn/ui](./4_react_ecosystem.md#9-ecosystem--архитектура)

nuqs против useSearchParams против qs?

</details>

<details>
  <summary>nuqs vs useSearchParams vs qs?</summary>

### nuqs vs useSearchParams vs qs?

**Definition:** `useSearchParams` (Next.js) — это сырой `URLSearchParams` вид. **nuqs** добавляет типизированные парсеры и `useState`- как сеттеры. **qs** анализирует и преобразует в строки вложенные объекты (`a[b]=1`) — полезно на сервере, а не на уровне состояния React.

**How it works:** Предпочитайте nuqs, когда пользовательский интерфейс записывает в URL-адрес множество типизированных фильтров. Предпочитать `useSearchParams` + `router.push` для одного одноразового параметра. Предпочитать `qs` (or `URLSearchParams`), когда вы сериализуете только через API, а не в React.

**Thoughts:** nuqs — это URL *state*. Запрос — это серверный *кэш*.

**See also:**

[nuqs](./4_react_ecosystem.md#9-ecosystem--архитектура)

---

Джуниор — Реагировать

</details>

### Junior — React

1. Работали ли вы с компонентами классов? Каковы их характеристики? → [Компоненты класса (устаревшие)](./4_react_ecosystem.md#11-legacy--migration)
2. Какие данные относятся к состоянию компонента и реквизитам? Приведите пример. → [Государство против реквизита?](#вопросы--ответы)
3. Знакомы ли вы с крючками? Каковы их преимущества? Писали ли вы собственные хуки и почему? → [Почему крючки? Пользовательские перехватчики?](#вопросы--ответы)
4.Знакомы ли вы с фрагментами и порталами? Для чего они нужны? → [Фрагменты](./4_react_core.md#fragments) · [Фрагменты и порталы?](#вопросы--ответы)
5. Когда и почему используются ссылки? → [useRef vs createRef?](#questions--ответы)
6. Какие методы жизненного цикла компонентов вы знаете? → [Раздел 11 — Наследие](./4_react_ecosystem.md#11-legacy--migration)
7.В каком методе жизненного цикла (или перехватчике) следует получать данные с сервера? Почему? → [useEffect vs useLayoutEffect?](#questions--ответы)
8. В каком методе жизненного цикла следует подписываться на прослушиватели и отписываться от них? Зачем отписываться? → [useEffect](./4_react_hooks.md#5-hooks-reference)
9. Работали ли вы с Context? Когда вам следует его использовать? → [Context vs Redux vs Zustand vs React Query?](#questions--ответы)
10.Что особенного в `PureComponent`? → [PureComponent](./4_react_ecosystem.md#11-legacy--migration)
11. Работали ли вы с мемоизированными селекторами? Для чего они нужны и как работают?
12. Какие преимущества вы видите в React?
13. Почему React быстрый? Что такое виртуальный DOM? → [Виртуальный DOM и сверка](./4_react_core.md#virtual-dom--reconciliation)
14.Зачем спискам нужны ключи? Могут ли индексы массива быть ключами? Когда это приемлемо? → [Зачем перечислять ключи? Индекс как ключ?](#вопросы--ответы)
15. Какова основная идея Redux? → [Библиотеки управления состоянием](./4_react_ecosystem.md#9-ecosystem--architecture)
16. Работа со стилями в React → [Стилизация в React](./4_react_ecosystem.md#9-ecosystem--architecture) · Основы CSS: [2_css.md](2_css.md)
17.React — это библиотека или фреймворк? В чем разница? → [Библиотека React или фреймворк?](#вопросы--ответы)
18. Можете ли вы использовать jQuery вместе с React? Почему или почему нет?
19. Что такое кодмод?
20. Как создать хорошую архитектуру для проекта React? → [Функциональное проектирование (FSD)](./4_react_ecosystem.md#9-ecosystem--architecture)
21. Перечислите библиотеки, которые вы использовали с React.→ [Запрос TanStack против запроса RTK](./4_react_ecosystem.md#9-ecosystem--architecture) · [CASL](./4_react_ecosystem.md#9-ecosystem--architecture) · [shadcn/ui](./4_react_ecosystem.md#9-ecosystem--architecture) · [orval](./4_react_ecosystem.md#9-ecosystem--архитектура)
22. Что самое сложное вы реализовали с помощью React?

Средний — Реагировать

### Middle — React

1. Что такое JSX? На чем это основано? → [JSX](./4_react_core.md#3-description-the-ui)
2. Как работает алгоритм Virtual DOM? → [Виртуальный DOM и сверка](./4_react_core.md#virtual-dom--reconciliation)
3. Почему `key` свойство, необходимое при рендеринге списков? → [Ключи](./4_react_core.md#2-rendering-model)
4. В чем разница между компонентами функции и класса? → [Компоненты класса (устаревшие)](./4_react_ecosystem.md#11-legacy--migration)
5. Почему и когда нужно передавать реквизит `super()` в компонентах класса?
6. Почему вам необходимо использовать `setState()` обновить состояние внутреннего компонента?
7. Что такое «поднятие государства»? → [Поднятие состояния](./4_react_core.md#4-state--interactivity)
8. Какие библиотеки управления состоянием для React вы знаете? Зачем они нужны? → [Библиотеки управления состоянием](./4_react_ecosystem.md#9-ecosystem--architecture)
9. Когда следует использовать Redux? Каковы альтернативы?
10. Redux против MobX?
11. Объясните основной принцип React Hooks.→ [Справочник по крючкам](./4_react_hooks.md#5-hooks-reference)
12. В чем разница между `createRef` и `useRef`? → [useRef vs createRef?](#questions--ответы)
13. Когда следует использовать ссылки React? Когда не следует этого делать?
14. Какие недостатки React вы видите?
15. Какие шаблоны вы используете в React? → [Шаблоны композиции](./4_react_core.md#3-description-the-ui)
16. Как вы относитесь к набору текста с помощью React? → [TypeScript](./5_ts.md)
17.Как создать хорошую архитектуру для проекта React? → [Функциональное проектирование (FSD)](./4_react_ecosystem.md#9-ecosystem--architecture)
18. Как вы оптимизируете приложения React? Как вы измеряете производительность? → [Производительность](./4_react_ecosystem.md#10- Performance)
19. Можете ли вы встроить одно приложение React в другое приложение React?

Младший — Практические задания (проект React)

### Junior — Practical tasks (React project)

1. Создайте мини-проект — список пользователей с формой создания/редактирования (Firebase + Bootstrap).

Средний — Практические задачи (React)

### Middle — Practical tasks (React)

1. Реализуйте таблицу с виртуальной прокруткой.

## Coding tasks

Задача 1 — Нестабильные ключи списка

<details>
  <summary>Task 1 — Unstable list keys</summary>

### Task 1 — Unstable list keys

Что происходит при каждом рендере?

```tsx
const UserList = ({ users }) => {
  return users.map(user => (
    <UserCard
      key={Math.random()}
      user={user}
    />
  ));
};
```

Исправить:

```tsx
const UserList = ({ users }) => {
  return users.map(user => (
    <UserCard
      key={user.id}
      user={user}
    />
  ));
};
```

Отвечать

`Math.random()` создает **новый ключ при каждом рендеринге**. React обрабатывает каждый `UserCard` как **другой элемент** — он отмонтирует старый экземпляр и монтирует новый. Это вызывает:

- ненужные повторные рендеринги и смена DOM
- потеряно локальное состояние внутри `UserCard` (входные данные, расширенные строки и т. д.)
- сломанные анимации и фокус

Используйте **стабильный, уникальный** ключ (`user.id`). Индекс приемлем только в том случае, если список статичен и никогда не переупорядочивается.

Задача 2 — Мутация состояния

</details>

<details>
  <summary>Task 2 — State mutation</summary>

### Task 2 — State mutation

Что не так? Почему пользовательский интерфейс может не обновляться?

```tsx
const [user, setUser] = useState({ name: 'Anna' });

user.name = 'Kate';
console.log(user.name); // "Kate"
setUser(user);
```

Отвечать

`useState` сравнивает **предыдущее и следующее состояние по ссылке** (`Object.is`). Мутация `user.name` меняет объект на месте, но **не меняет ссылку**, поэтому React пропускает повторный рендеринг.

Исправление — вернуть **новый объект**:

```tsx
setUser({ ...user, name: 'Kate' });
// or
setUser(prev => ({ ...prev, name: 'Kate' }));
```

`console.log(user.name)` принты `"Kate"` потому что мутация произошла в памяти; пользовательский интерфейс просто не получил новый цикл рендеринга.

Задача 3 — Зависимость объекта в useEffect

</details>

<details>
  <summary>Task 3 — Object dependency in useEffect</summary>

### Task 3 — Object dependency in useEffect

Найдите причину:

```tsx
useEffect(() => {
  loadData();
}, [filters]); // filters is an object recreated every render
```

Исправить:

```tsx
const filters = useMemo(
  () => ({ name, isActive }),
  [name, isActive],
);

useEffect(() => {
  loadData();
}, [name, isActive]);
```

Ответ

**новый** `filters` **объект** создается при каждом рендеринге (`{}` !== `{}` по ссылке). `useEffect` каждый раз видит измененную зависимость → `loadData()` работает в цикле или слишком часто.

Опции:

1. Зависит от **примитивов** (`name`, `isActive`) вместо объекта.
2. Запомните объект с помощью `useMemo` когда вам необходимо передать составное значение.
3. Пройти `filters` в `loadData(filters)` и перечислите стабильные поля в массиве зависимостей.

Задача 4. Асинхронная выборка в useEffect

</details>

<details>
  <summary>Task 4 — Async fetch in useEffect</summary>

### Task 4 — Async fetch in useEffect

Устраните проблему:

```tsx
const fetchData = async () => {
  const data = await api.get();
  setData(data);
};

useEffect(() => {
  fetchData();
}, []);
```

Ответ

Проблемы:

1. **Условие гонки** — если компонент отмонтируется или `fetchData` запускается снова, поздний ответ может вызвать вызов `setState` на несмонтированном компоненте.
2. **Без отмены** — устаревшие ответы могут перезаписать новые данные.
3. `useEffect` **обратный вызов не должен быть** `async` — асинхронная функция возвращает обещание; React игнорирует это и не может рассматривать как функцию очистки.

Исправлено — встроенный асинхронный IIFE + `AbortController`:

```tsx
useEffect(() => {
  const controller = new AbortController();

  (async () => {
    try {
      const data = await api.get({ signal: controller.signal });
      setData(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
      }
    }
  })();

  return () => controller.abort();
}, []);
```

Альтернативно используйте библиотеку выборки данных (TanStack Query, SWR) или React 19. `use()` с помощью Suspense — они обрабатывают прерывание, дедупликацию и кэширование.
</details>


