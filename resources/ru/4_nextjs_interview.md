# Next.js — Interview

Вопросы для собеседования по Next.js. Ответы заполнены для опубликованной части, остальные пустые.

[← Вернуться в центр](./4_nextjs.md)

### Related docs

- [Next.js — Ядро](./4_nextjs_core.md) · [Next.js — Rendering](./4_nextjs_rendering.md) · [Next.js — Данные](./4_nextjs_data.md) · [Next.js — Маршрутизация](./4_nextjs_routing.md) · [Next.js — Оптимизации](./4_nextjs_optimizations.md) · [Next.js — Платформа](./4_nextjs_platform.md) · [Next.js — Интервью](./4_nextjs_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Вопросы из [Devinterview.io — Next.js](https://devinterview.io/questions/web-and-mobile-development/next-interview-questions/).

### Next.js Fundamentals

<details>
<summary>What is Next.js and what are its main features?</summary>

### What is Next.js and what are its main features?

**Definition:**

Next.js — фреймворк для React. Он добавляет маршруты, серверный рендеринг и сборку, чтобы интерфейс React был сайтом, а не только клиентским бандлом.

**How it works:**

- Файловая маршрутизация сопоставляет файлы с URL. App Router использует `app/`. Pages Router — `pages/`. Новые приложения по умолчанию на `app/`.
- Маршрут может быть статическим HTML, рисоваться на сервере для запроса или кэшироваться и обновляться позже. Это выбирают для маршрута, а не один раз на всё приложение.
- Разделение кода идёт по маршрутам. Браузер грузит JavaScript открытой страницы, а не всех страниц.
- `next/image` меняет размер и отдаёт картинки в современных форматах. `next/font` подключает шрифты без сдвига вёрстки из-за поздней таблицы стилей.
- Route Handlers в `app/` и API-маршруты в `pages/api` — серверные точки в том же проекте.
- CSS Modules, глобальный CSS и Sass работают без своего webpack для обычных случаев.
- Фреймворк работает на Node. Хост вроде Vercel выполняет серверные части; статический экспорт доступен, когда они не нужны.

**Examples:**

```tsx
export default function Page() {
  return <h1>Pier 4</h1>;
}
```

**Sources:**

- https://nextjs.org/docs

</details>

<details>
<summary>How does Next.js differ from Create React App?</summary>

### How does Next.js differ from Create React App?

**Definition:**

Create React App собирает одностраничное приложение с отрисовкой на клиенте и на этом заканчивает. Next.js рисует на сервере, маршрутизирует файлами и может держать серверные функции в том же проекте. CRA больше не рекомендуют как старт React-приложения.

**How it works:**

- CRA отдаёт пустую клиентскую оболочку. Первый кадр ждёт JavaScript. Next может отправить HTML маршрута — его и видят роботы и медленные устройства.
- Маршруты CRA — библиотека вроде React Router, объявленная в компонентах. Маршруты Next — дерево файлов.
- Данные в CRA обычно грузят в `useEffect` после отрисовки. Next грузит данные маршрута до готового HTML, в `getServerSideProps` / `getStaticProps` или в серверном компоненте App Router.
- Разделение кода в CRA ручное (`React.lazy`). Next делит по маршрутам само.
- У Next есть Route Handlers и `pages/api`. У CRA сервера нет. Второй бэкенд добавляете вы.
- `eject` в CRA копирует конфигурацию сборки наружу, и вы её сопровождаете. Next открывает `next.config.ts` для настроек, которые как раз и должны меняться.
- Результат CRA — статические файлы на CDN. Next тоже может быть статическим или Node-сервером, когда маршрут динамический.
- SEO следует из настоящего HTML и API метаданных (`metadata` в `app/`, `next/head` в `pages/`). Приложению CRA это нужно добавлять самому.

**Examples:**

```text
app/tides/page.tsx   →  /tides
```

Тот же URL в приложении CRA был бы `<Route>`, который вы зарегистрировали в роутере.

**Sources:**

- https://nextjs.org/docs/app/getting-started
- https://create-react-app.dev/

</details>

<details>
<summary>What command is used to create a new Next.js app?</summary>

### What command is used to create a new Next.js app?

**Definition:**

`npx create-next-app@latest` скачивает текущий каркас и спрашивает, куда положить приложение. `npx` запускает пакет без глобальной установки.

**How it works:**

- Имя каталога пропускает вопрос о пути: `npx create-next-app@latest harbor`.
- Вопросы покрывают TypeScript, App Router, Tailwind, ESLint и псевдоним импорта. Флаги вроде `--ts` и `--app` отвечают на них сразу.
- `@latest` важен. Глобально установленный старый `create-next-app` развернёт старый мажор.
- На выходе — `package.json`, `app/` или `pages/` и `next.config`. Запуск — `npm run dev`.
- Для текущего Next.js нужен Node 18.18 или новее. Старый путь «поставить create-next-app глобально на Node 10» устарел.

**Examples:**

```bash
npx create-next-app@latest harbor
```

**Sources:**

- https://nextjs.org/docs/app/getting-started/installation

</details>

<details>
<summary>How does Next.js handle server-side rendering (SSR)?</summary>

### How does Next.js handle server-side rendering (SSR)?

**Definition:**

Серверный рендеринг значит, что HTML для запроса собирается на сервере, а браузер затем гидрирует его, чтобы страница стала интерактивной. Человек видит содержимое до того, как догрузится клиентский бандл.

**How it works:**

- Запрос попадает в маршрут. Next загружает нужные маршруту данные, рисует React в HTML и отправляет этот документ.
- В Pages Router экспортируют `getServerSideProps`. Он выполняется на каждый запрос, и его `props` попадают в страницу.
- В App Router серверный компонент по умолчанию рисуется на сервере. Маршрут остаётся динамическим, когда читает cookies, заголовки или fetch без кэша.
- Гидратация вешает обработчики на уже отправленный HTML. Это не вторая пустая первая отрисовка.
- Дальнейшие переходы — клиентские. `next/link` запрашивает полезную нагрузку следующего маршрута, а не просит браузер целиком скачать документ, если ссылка не уходит из приложения.
- Рендер на каждый запрос берут, когда HTML зависит от пользователя или от данных, которые обязаны быть свежими. Статический или кэшированный HTML дешевле, когда это не так.

**Examples:**

```js
export async function getServerSideProps() {
  return { props: { opened: new Date().toISOString() } };
}
```

**Sources:**

- https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering
- https://nextjs.org/docs/app/getting-started/server-and-client-components

</details>

<details>
<summary>Can you explain the purpose of the pages directory in a Next.js project?</summary>

### Can you explain the purpose of the pages directory in a Next.js project?

**Definition:**

В Pages Router файл в `pages/` — это маршрут. Путь файла — путь URL. Аналог в App Router — каталог `app/`, а маршрут там — `page.js`.

**How it works:**

- `pages/index.js` — это `/`. `pages/tides/index.js` — `/tides`. `pages/about.js` — `/about`.
- `pages/tides/[id].js` — `/tides/:id`. Имя сегмента становится параметром.
- `pages/_app.js` оборачивает каждую страницу. Туда кладут глобальные стили и провайдеры. Это не маршрут.
- `pages/_document.js` настраивает серверную оболочку HTML (`html`, `body`). Он выполняется только на сервере.
- `pages/404.js` — страница «не найдено». `pages/500.js` — страница ошибки сервера.
- Файл, имя которого начинается с `_`, скрыт от маршрутизатора. У него нет URL.
- Компоненты, которые не являются маршрутами, в `pages/` не кладут. Они стали бы адресами. Общие компоненты живут вне этого каталога.

**Examples:**

```text
pages/index.js          → /
pages/tides/[id].js     → /tides/abc
pages/_app.js           → wraps every page
```

**Sources:**

- https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts

</details>

<details>
<summary>In Next.js, how do you create a page that is rendered on the server for every request?</summary>

### In Next.js, how do you create a page that is rendered on the server for every request?

**Definition:**

В Pages Router экспортируют `getServerSideProps`. Next вызывает его на каждый запрос и передаёт `props` в страницу, поэтому HTML не переиспользуется со сборки.

**How it works:**

- Функция выполняется только на сервере. Она может читать cookies, спрашивать базу и вернуть `{ props }`, `{ notFound: true }` или `{ redirect }`.
- Страница, которая её экспортирует, не оптимизируется статически. Серверный рендер оплачивается каждый раз.
- Её берут, когда ответ зависит от запроса: личный кабинет, проверка прав, данные, которые не должны быть артефактом сборки.
- Статическая генерация (`getStaticProps`) — другой инструмент. Она выполняется во время сборки или по интервалу revalidate. На одной странице не экспортируют оба.
- Дорогую общую выборку можно кэшировать внутри функции. Сама функция при этом всё равно выполняется.
- В App Router маршрут динамический, когда использует `cookies()`, `headers()` или fetch без кэша. В `app/` нет `getServerSideProps`.

**Examples:**

```js
export async function getServerSideProps() {
  return { props: { at: Date.now() } };
}

export default function Page({ at }) {
  return <p>{at}</p>;
}
```

**Sources:**

- https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props

</details>

<details>
<summary>What file extensions does Next.js support for pages?</summary>

### What file extensions does Next.js support for pages?

**Definition:**

Страница Pages Router — это `.js`, `.jsx`, `.ts` или `.tsx`. С настроенным MDX страница может быть ещё `.md` или `.mdx`. Другие расширения страницами не являются.

**How it works:**

- `.jsx` и `.tsx` — те, в которых лежат компоненты. `.js` и `.ts` работают, когда компилятор принимает в них JSX, и Next это делает.
- Файлы CSS (`.css`, `.module.css`, `.scss`) — стили, которые импортируют. Маршрут они не создают.
- `_app`, `_document`, `404` и `500` используют те же расширения страниц. `_error.js` — старая своя страница ошибки в Pages Router.
- Типа страницы `.fetch.js` нет. Загрузка данных — экспортируемая функция в файле страницы или серверный компонент в `app/`.
- В App Router файл маршрута называется `page.tsx` (или `page.js`). Имя папки — сегмент URL.
- Для новых страниц берите TypeScript (`.tsx`). Смешивать расширения в одном сегменте незачем.

**Examples:**

```text
pages/tides.tsx
pages/notes.mdx
app/tides/page.tsx
```

**Sources:**

- https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts

</details>

<details>
<summary>How do environment variables work in Next.js?</summary>

### How do environment variables work in Next.js?

**Definition:**

Next загружает файлы окружения в `process.env` для серверного кода. Переменная попадает в браузер, только если её имя начинается с `NEXT_PUBLIC_`.

**How it works:**

- `.env` — общий файл. `.env.local` перекрывает его и не должен попадать в репозиторий. `.env.production` и `.env.development` действуют в своём режиме.
- Серверный код, включая `getServerSideProps`, Route Handlers и серверные компоненты, может читать любую переменную: `process.env.DB_HOST`.
- `NEXT_PUBLIC_API_URL` встраивается в клиентский бандл на сборке. Его видит каждый, кто скачал страницу. Секрет за этим префиксом не прячут.
- Смена публичной переменной требует пересборки. В браузере она не читается вживую.
- На хосте те же имена задают в настройках проекта. `.env.local` — для машины, на которой вы разрабатываете.
- Отсутствующая переменная равна `undefined`. Значение по умолчанию в коде ставят, только когда оно правда безопасно.
- Значения `NEXT_PUBLIC_` подставляются как строки. Это не endpoint конфигурации во время выполнения.

**Examples:**

```bash
DB_HOST=localhost
NEXT_PUBLIC_API_URL=https://example.com
```

```js
const host = process.env.DB_HOST;
const api = process.env.NEXT_PUBLIC_API_URL;
```

**Sources:**

- https://nextjs.org/docs/app/guides/environment-variables

</details>

<details>
<summary>What is Automatic Static Optimization in Next.js?</summary>

### What is Automatic Static Optimization in Next.js?

**Definition:**

В Pages Router страница без `getServerSideProps` и без `getInitialProps` заранее рисуется в HTML во время сборки. Next делает это без дополнительного экспорта. Это и есть Automatic Static Optimization.

**How it works:**

- Страница всё ещё может быть клиентским компонентом с `useState`. HTML — первый рендер, браузер его гидрирует. Чтобы отдать этот файл, сервер не нужен.
- `getStaticProps` — явная статическая генерация. Она тоже порождает HTML на сборке и может загрузить данные. Автоматическая оптимизация — случай, когда функции данных нет вовсе.
- Экспорт `getServerSideProps` выключает оптимизацию. Страница становится серверным рендером на каждый запрос.
- Статический файл может устареть. Incremental Static Regeneration (`revalidate` у `getStaticProps`) пересобирает его по интервалу. Это другая возможность, не автоматический путь.
- Страница, которой нужны данные конкретного запроса, не должна опираться на эту оптимизацию. HTML был бы одним и тем же для каждого посетителя.
- В App Router близкая идея — статическая отрисовка: маршрут, который не трогает некэшированные данные запроса, порождается заранее.

**Examples:**

```js
export default function About() {
  return <p>Hours: 09:00–17:00</p>;
}
```

Эта страница — статический HTML. В ней нет ничего, что просило бы сервер о свежем значении.

**Sources:**

- https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization

</details>

### Pages and Routing

<details>
<summary>How does file-based routing work in Next.js?</summary>

### How does file-based routing work in Next.js?

**Definition:**

URL следует за файлами. Таблицу маршрутов регистрировать не нужно. Сегмент — это либо имя папки, либо динамические скобки.

**How it works:**

- Pages Router: `pages/cart.js` — это `/cart`. `pages/products/index.js` — `/products`. `pages/products/[id].js` — `/products/123`.
- App Router: `app/cart/page.tsx` — `/cart`. `layout.tsx` оборачивает сегмент и сегменты под ним. `loading.tsx` и `not-found.tsx` — UI этих состояний, а не лишние URL.
- Файлы `page` и `route` — публичный вход. Файл компонента рядом с ними маршрутом не является.
- Соседство файлов — компромисс. Дерево легко просматривать, а глубокая вложенность папок всё ещё глубокий URL, который вам может быть не нужен.
- Группы маршрутов `(shop)` раскладывают файлы, не влияя на URL. Они есть в App Router.
- Catch-all или rewrite в `next.config` — способ уйти от дерева файлов, когда URL не должен с ним совпадать.
- Расширения TypeScript и JSX в URL не входят.

**Examples:**

```text
app/products/page.tsx        → /products
app/products/[id]/page.tsx   → /products/123
```

**Sources:**

- https://nextjs.org/docs/app/getting-started/project-structure
- https://nextjs.org/docs/pages/building-your-application/routing

</details>

<details>
<summary>How do you create dynamic routes in Next.js?</summary>

### How do you create dynamic routes in Next.js?

**Definition:**

Имя параметра ставят в скобки. `pages/posts/[id].js` или `app/posts/[id]/page.tsx` совпадает с `/posts/123`, и `id` равен `"123"`.

**How it works:**

- Одна пара скобок — один сегмент. `products/[category]/[id]` совпадает с двумя.
- Catch-all `[...slug]` совпадает с остатком пути как массив строк. Необязательный catch-all `[[...slug]]` совпадает и с путём без лишних сегментов.
- В Pages Router `useRouter().query.id` читает сегмент в браузере, а `context.params.id` — в `getServerSideProps` или `getStaticProps`. Динамические статические страницы ещё экспортируют `getStaticPaths`.
- В App Router страница получает `params`. В текущем Next.js этот prop — промис, который нужно дождаться.
- Shallow routing (`router.push(href, undefined, { shallow: true })` или `<Link shallow>`) меняет query той же страницы, не запуская `getServerSideProps` снова. К переходу на другую страницу это не относится, и это возможность Pages Router.
- Строка запроса (`?page=2`) отдельно от динамического сегмента. Ссылка не сохраняет её, если `href` её не содержит.
- Не выдумывайте суффикс `.client.js`, чтобы сделать сегмент динамическим. Скобки — весь механизм.

**Examples:**

```text
app/posts/[id]/page.tsx
/posts/abc    →    params.id === "abc"
```

**Sources:**

- https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes
- https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes

</details>

<details>
<summary>Explain how to access URL parameters in a dynamic route.</summary>

### Explain how to access URL parameters in a dynamic route.

**Definition:**

Имя внутри скобок и есть параметр. Его читают из роутера на клиенте или из контекста функции данных на сервере. `window.location` самим разбирать не нужно.

**How it works:**

- Pages Router, клиент: `const { query } = useRouter()`, затем `query.id`. На первом рендере `query` ещё может быть пустым, поэтому перед запросом его проверяют.
- Pages Router, сервер: `context.params.id` внутри `getServerSideProps` или `getStaticProps` — строка (или `string[]` для catch-all) и готов до рендера.
- App Router: `const { id } = await params` в серверной странице. Клиентская страница читает `useParams()`.
- Значение используют, чтобы загрузить одну запись, выбрать страницу списка или собрать канонический URL. Сегмент — строка, даже если выглядит как число.
- Отсутствующий или неизвестный id должен закончиться `notFound()`, а не полусобранной страницей.
- Параметры поиска (`?page=2`) — другой набор: `useSearchParams` в App Router, а в Pages Router они смешаны с параметрами маршрута в `query`.

**Examples:**

```js
export async function getServerSideProps({ params }) {
  return { props: { id: params.id } };
}
```

**Sources:**

- https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes
- https://nextjs.org/docs/app/api-reference/file-conventions/page

</details>

<details>
<summary>Describe the functionality of the Link component in Next.js.</summary>

### Describe the functionality of the Link component in Next.js.

**Definition:**

`next/link` рисует ссылку, которая меняет маршрут внутри приложения. Next заранее подгружает назначение и JavaScript этого маршрута, вместо того чтобы просить браузер скачать весь документ.

**How it works:**

- `<Link href="/tides">Tides</Link>` порождает `<a href="/tides">`. href — настоящий URL, поэтому «открыть в новой вкладке» и роботы работают.
- В области видимости Next заранее загружает статические маршруты. Клик затем применяет уже полученную нагрузку. Динамические маршруты так же полностью заранее не грузятся.
- Код страницы назначения подгружается вместе с переходом. Делить каждую страницу руками не нужно.
- `Link` — для переходов внутри приложения. Ссылке на другой сайт, скачиванию или mailto он не нужен; правильный элемент — обычный `<a>`.
- `replace` заменяет запись истории, а не добавляет её. `scroll` решает, начинается ли следующая страница сверху.
- В Pages Router `shallow` меняет URL той же страницы, не перезапуская функции данных. Это не способ анимировать уход и не способ открыть новую вкладку.
- Не вешайте на `Link` обработчик, который вызывает `router.push` на тот же href. Компонент и так выполняет переход.

**Examples:**

```jsx
import Link from "next/link";

<Link href="/tides/4">Pier 4</Link>
```

**Sources:**

- https://nextjs.org/docs/app/api-reference/components/link

</details>

<details>
<summary>How do you handle catch-all routes in Next.js?</summary>

### How do you handle catch-all routes in Next.js?

**Definition:**

Catch-all сегмент совпадает с остатком пути. `[...slug]` требует хотя бы один сегмент. `[[...slug]]` совпадает и с URL без сегментов.

**How it works:**

- `pages/docs/[...slug].js` совпадает с `/docs/a` и `/docs/a/b`. `slug` равен `["a"]` или `["a", "b"]`. С `/docs` он не совпадает.
- `pages/docs/[[...slug]].js` совпадает и с `/docs`. `slug` тогда `undefined` или пустой список, в зависимости от роутера, поэтому его проверяют.
- Более конкретные файлы побеждают catch-all. `pages/docs/index.js` и `pages/docs/[...slug].js` могут жить вместе.
- В App Router те же имена — папки: `app/docs/[...slug]/page.tsx`.
- `getStaticPaths` решает, какие из этих путей существуют как статический HTML. `fallback: false` значит, что неизвестные пути — 404. `fallback: true` сначала отдаёт запасной UI и порождает путь. `fallback: "blocking"` порождает его на сервере до ответа, без запасного UI.
- Catch-all нужен деревьям документации, путям файлов и slug из CMS. Одиночный id лучше оставить `[id]`: его проще проверить.

**Examples:**

```text
app/docs/[...slug]/page.tsx
/docs/tides/spring  →  slug = ["tides", "spring"]
```

**Sources:**

- https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes#catch-all-segments
- https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking

</details>

### Data Fetching and Rendering

<details>
<summary>What is getStaticProps and when would you use it?</summary>

### What is getStaticProps and when would you use it?

**Definition:**

`getStaticProps` — экспорт Pages Router, который выполняется во время сборки. Он возвращает `{ props }`, и Next записывает страницу в статический HTML. В браузере он не выполняется.

**How it works:**

- Его берут для содержимого, которое можно знать до запроса: запись блога, товар из CMS, список, который меняется несколько раз в день.
- `revalidate: 60` включает инкрементальную статическую регенерацию. Следующий запрос после стольких секунд запускает пересборку в фоне, и поздние запросы видят новый HTML.
- Динамический маршрут, который его использует, обязан ещё экспортировать `getStaticPaths` со списком params для генерации.
- Функция может импортировать модули только для сервера и читать секреты из `process.env`. Эти импорты не попадают в клиентский бандл. На ту сторону переходят только сериализуемые `props`. Не возвращайте экземпляр класса, функцию или `Date`.
- Это неверный инструмент для HTML на каждого пользователя. Для этого есть `getServerSideProps` или динамический маршрут App Router.
- В App Router нет `getStaticProps`. Серверный компонент, который запрашивает кэшированные данные, — статический аналог, а `export const revalidate = 60` — ручка регенерации.

**Examples:**

```js
export async function getStaticProps() {
  const tides = await loadTides();
  return { props: { tides }, revalidate: 3600 };
}
```

**Sources:**

- https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props

</details>

<details>
<summary>What is getServerSideProps and what kind of rendering does it enable?</summary>

### What is getServerSideProps and what kind of rendering does it enable?

**Definition:**

</details>

<details>
<summary>How would you implement Incremental Static Regeneration (ISR) in Next.js?</summary>

### How would you implement Incremental Static Regeneration (ISR) in Next.js?

**Definition:**

</details>

<details>
<summary>Can you use client-side data fetching in Next.js? If so, how?</summary>

### Can you use client-side data fetching in Next.js? If so, how?

**Definition:**

</details>

<details>
<summary>Explain the 'fallback' key used in the getStaticPaths function.</summary>

### Explain the 'fallback' key used in the getStaticPaths function.

**Definition:**

</details>

### API Routes

<details>
<summary>How do you create an API route in Next.js?</summary>

### How do you create an API route in Next.js?

**Definition:**

</details>

<details>
<summary>Can you use middleware within Next.js API routes?</summary>

### Can you use middleware within Next.js API routes?

**Definition:**

</details>

<details>
<summary>Explain how to handle query parameters in Next.js API routes.</summary>

### Explain how to handle query parameters in Next.js API routes.

**Definition:**

</details>

### Styling in Next.js

<details>
<summary>How can you include CSS modules in your Next.js application?</summary>

### How can you include CSS modules in your Next.js application?

**Definition:**

</details>

<details>
<summary>Compare and contrast CSS-in-JS and styled-components in the context of Next.js.</summary>

### Compare and contrast CSS-in-JS and styled-components in the context of Next.js.

**Definition:**

</details>

<details>
<summary>Can global styles be used in Next.js? If so, how?</summary>

### Can global styles be used in Next.js? If so, how?

**Definition:**

</details>

### Performance Optimization

<details>
<summary>What is the Image component and how does it help optimize performance in Next.js?</summary>

### What is the Image component and how does it help optimize performance in Next.js?

**Definition:**

</details>

<details>
<summary>How does code splitting work in Next.js?</summary>

### How does code splitting work in Next.js?

**Definition:**

</details>

<details>
<summary>What are the methods provided by Next.js for prefetching pages?</summary>

### What are the methods provided by Next.js for prefetching pages?

**Definition:**

</details>

### Deployment and Hosting

<details>
<summary>What are the benefits of deploying a Next.js application to Vercel?</summary>

### What are the benefits of deploying a Next.js application to Vercel?

**Definition:**

</details>

<details>
<summary>How do you configure custom domain names when deploying a Next.js application?</summary>

### How do you configure custom domain names when deploying a Next.js application?

**Definition:**

</details>

<details>
<summary>Explain how to deploy a Next.js app using a different hosting service, such as AWS or Netlify.</summary>

### Explain how to deploy a Next.js app using a different hosting service, such as AWS or Netlify.

**Definition:**

</details>

### Integrations and Plugins

<details>
<summary>How do you integrate a CSS framework like Tailwind CSS into a Next.js project?</summary>

### How do you integrate a CSS framework like Tailwind CSS into a Next.js project?

**Definition:**

</details>

<details>
<summary>What are some popular plugins for Next.js and what functionalities do they add?</summary>

### What are some popular plugins for Next.js and what functionalities do they add?

**Definition:**

</details>

<details>
<summary>How do you enable TypeScript support in a Next.js project?</summary>

### How do you enable TypeScript support in a Next.js project?

**Definition:**

</details>

### Advanced Features

<details>
<summary>How do you implement a custom server in Next.js and why would you do so?</summary>

### How do you implement a custom server in Next.js and why would you do so?

**Definition:**

</details>

<details>
<summary>What are the considerations when setting up internationalized routing in Next.js?</summary>

### What are the considerations when setting up internationalized routing in Next.js?

**Definition:**

</details>

<details>
<summary>How do you handle custom error pages in a Next.js application?</summary>

### How do you handle custom error pages in a Next.js application?

**Definition:**

</details>

### Best Practices

<details>
<summary>What folder structure is recommended for large-scale Next.js applications?</summary>

### What folder structure is recommended for large-scale Next.js applications?

**Definition:**

</details>

<details>
<summary>How should you structure components in a Next.js application for optimal code reusability?</summary>

### How should you structure components in a Next.js application for optimal code reusability?

**Definition:**

</details>

<details>
<summary>What are some security best practices you should follow in a Next.js app?</summary>

### What are some security best practices you should follow in a Next.js app?

**Definition:**

</details>

### State Management in Next.js

<details>
<summary>How do you manage global state in a Next.js application without using external libraries?</summary>

### How do you manage global state in a Next.js application without using external libraries?

**Definition:**

</details>

<details>
<summary>When should you consider using a state management library like Redux in a Next.js project?</summary>

### When should you consider using a state management library like Redux in a Next.js project?

**Definition:**

</details>

<details>
<summary>Explain how to persist state between page transitions in a Next.js app.</summary>

### Explain how to persist state between page transitions in a Next.js app.

**Definition:**

</details>

### Next.js and TypeScript

<details>
<summary>What are the advantages of using TypeScript in a Next.js project?</summary>

### What are the advantages of using TypeScript in a Next.js project?

**Definition:**

</details>

<details>
<summary>How do you add type definitions for a Next.js page's props?</summary>

### How do you add type definitions for a Next.js page's props?

**Definition:**

</details>

<details>
<summary>What steps are involved in migrating an existing Next.js project to TypeScript?</summary>

### What steps are involved in migrating an existing Next.js project to TypeScript?

**Definition:**

</details>

<details>
<summary>Can you describe how to use TypeScript for defining API route handlers in Next.js?</summary>

### Can you describe how to use TypeScript for defining API route handlers in Next.js?

**Definition:**

</details>

<details>
<summary>How do you enforce type checking for dynamic routes in Next.js using TypeScript?</summary>

### How do you enforce type checking for dynamic routes in Next.js using TypeScript?

**Definition:**

</details>

<details>
<summary>How does Next.js handle automatic type generation for pages and API routes when using TypeScript?</summary>

### How does Next.js handle automatic type generation for pages and API routes when using TypeScript?

**Definition:**

</details>

<details>
<summary>What is the role of the tsconfig.json file in a Next.js project with TypeScript, and how do you customize it for your specific needs?</summary>

### What is the role of the tsconfig.json file in a Next.js project with TypeScript, and how do you customize it for your specific needs?

**Definition:**

</details>
