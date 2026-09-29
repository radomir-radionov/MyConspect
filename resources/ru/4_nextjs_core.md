# Next.js — Core

Модель платформы и принципы проектирования.

[ ← Вернуться в центр](./4_nextjs.md)

### Related docs

- [Next.js — Ядро](./4_nextjs_core.md) · [Next.js — Rendering](./4_nextjs_rendering.md) · [Next.js — Данные](./4_nextjs_data.md) · [Next.js — Маршрутизация](./4_nextjs_routing.md) · [Next.js — Оптимизации](./4_nextjs_optimizations.md) · [Next.js — Платформа](./4_nextjs_platform.md) · [Next.js — Интервью](./4_nextjs_interview.md)

### Sections

- [1. Framework overview](#1-framework-overview)
- [2. Design principles](#2-design-principles)

---

## 1. Framework overview

_Темы следующие: Определение → Плюсы и минусы → Когда использовать → Пример → Примечания → Источник ([шаблон](#topic-template))._

<details>
  <summary>Next.js overview</summary>

### Next.js overview

**Definition:** Next.js — это **фреймворк React** для создания полноценных веб-приложений. UI строится компонентами React; Next.js добавляет маршрутизацию, рендеринг, работу с данными и production-инструменты — сборщики и компиляторы уже настроены, чтобы вы сосредоточились на продукте, а не на стеке.

**When to use:**

- Маркетинговые сайты, блоги и документация с требованиями SEO
- E-commerce, дашборды и SaaS с аутентифицированными и публичными страницами
- BFF (Backend for Frontend) — API рядом с UI
- Команды на Vercel или со standalone Docker output
- Приложения с RSC (меньшие клиентские бандлы, доступ к серверным данным)

**When not to use:**

- Чисто статические сайты с минимальным JS — рассмотрите **Astro**
- Мобильные приложения — **Expo / React Native**
- Тяжёлый кастомный Node-сервер (долгоживущий WebSockets hub) — отдельный backend + Vite SPA могут подойти лучше
- Контентные сайты, где React — лишняя нагрузка

**Pluses and minuses:**

| +                                                                                | −                                                                                                    |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --- | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| Батарейки в комплекте: маршрутизация, SSR, API, оптимизация изображений/шрифтов  | Мнение: аварийные люки существуют, но усложняют ситуацию                                             |
| Серверные компоненты React + потоковая передача «из коробки» (App Router)        | Ментальная модель крутого кэширования; легко отправлять устаревшие или чрезмерно динамичные страницы |
| Отличная интеграция с Vercel (предварительные развертывания, CDN, аналитика)     | Привязка к поставщикам при использовании функций Vercel                                              |     | SEO-оптимизирован по умолчанию (SSR/SSG/ISR/PPR) | Холодный запуск на бессерверной версии; не идеален для всех рабочих нагрузок |
| TypeScript — прежде всего, большая экосистема, сильный сигнал о приеме на работу | Два маршрутизатора (приложение + страницы) — устаревшие кодовые базы несут долг по миграции          |
| Автоматическое разделение кода на маршрут                                        | Время сборки увеличивается с размером приложения                                                     |

**Examples:**

```bash
npx create-next-app@latest my-app --typescript --app --turbopack
cd my-app && npm run dev
```

```tsx
// app/page.tsx — Server Component by default
export default async function HomePage() {
  const res = await fetch("https://api.example.com/posts", {
    next: { revalidate: 60 },
  });
  const posts = await res.json();

  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {posts.map((p: { id: string; title: string }) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </main>
  );
}
```

**Thoughts:** Next.js **не** является заменой знаний React — это верхний слой. Оформление интервью: React = библиотека (просмотр); Next.js = фреймворк (маршрутизация, рендеринг, данные, развертывание). В новых проектах по умолчанию должен использоваться **App Router** (Next.js 13+). Pages Router — это режим обслуживания существующих приложений.

**Sources:** [nextjs.org/docs](https://nextjs.org/docs)

</details>

<details>
  <summary>React vs Next.js</summary>

### React vs Next.js

**Definition:**

React отображает пользовательский интерфейс; Next.js определяет, как и где создается, кэшируется и доставляется этот пользовательский интерфейс.

|                       | Реагировать                             | Next.js                                               |
| --------------------- | --------------------------------------- | ----------------------------------------------------- |
| **Роль**              | библиотека пользовательского интерфейса | Полнофункциональный фреймворк                         |
| **Маршрутизация**     | Принесите свой собственный              | Файловый `app/` каталог                               |
| **Извлечение данных** | Клиентские крючки / ручные SSR          | Серверные компоненты, `fetch` кэш, Действия сервера   |
| **Рендеринг**         | КСО по умолчанию (Vite)                 | SSR, SSG, ISR, PPR настраиваются для каждого маршрута |
| **API**               | Отдельный бэкэнд                        | Обработчики маршрутов + Действия сервера              |
| **Развертывание**     | Статический CDN или собственный         | Оптимизирован для Верселя; `standalone` для Докера    |

**Thoughts:** Общие правила RSC, гидратации и перехвата см. в [4_react.md §8 — Серверный рендеринг и RSC](./4_react_server.md#8-server-rendering--rsc). Стратегии рендеринга (SSR, SSG, ISR, PPR): [Next.js — Rendering](./4_nextjs_rendering.md). Семантика кэширования: [Next.js — Data](./4_nextjs_data.md).

**Sources:** [react.dev](https://react.dev/) · [nextjs.org/docs](https://nextjs.org/docs)

</details>

<details>
  <summary>Next.js vs alternatives</summary>

### Next.js vs alternatives

**Definition:**

Сравнение Next.js с другими полнофункциональными и метафреймворками для React и контентных сайтов.

| Рамочная                | Сила                                                     | Компромисс                                    |
| ----------------------- | -------------------------------------------------------- | --------------------------------------------- | --- | --------- | ----------------------------------- | ---------------------------------------------------------- |
| **Vite + React Router** | Максимальная гибкость, быстрая разработка, приоритет SPA | Ручная настройка SSR/RSC                      |
| **Ремикс**              | Веб-стандарты, загрузчики/действия, формы                | Меньшая экосистема, чем Следующая             |     | **Астро** | Контент-сайты, архитектура островов | Менее подходит для интенсивного взаимодействия с клиентами |
| **SvelteKit**           | Производительность, простота                             | Другая парадигма пользовательского интерфейса |

**How it works:** SEO, производительность при первой загрузке, логика совместного размещения серверов, командная стандартизация на Vercel.

**Sources:** [nextjs.org/docs/app](https://nextjs.org/docs/app)

</details>

<details>
  <summary>History (compressed)</summary>

### History (compressed)

**Definition:**

Хронология основных выпусков Next.js и основные этапы маршрутизации/рендеринга.

| Версия   | Веха                                                                         |
| -------- | ---------------------------------------------------------------------------- |
| **2016** | Next.js 1 — Маршрутизатор страниц, SSR                                       |
| **v9**   | API-маршруты (`pages/api`)                                                   |
| **v12**  | Промежуточное ПО, поддержка React 18                                         |
| **v13**  | Маршрутизатор приложений (бета-версия), RSC, `app/` каталог                  |
| **v14**  | App Router стабильный, частичный предварительный рендеринг экспериментальный |
| **v15**  | API асинхронных запросов (`cookies`, `headers`, `params`)                    |
| **v16**  | Компоненты кэша, `proxy.ts`, `use cache`, требуются асинхронные API          |

---

**Sources:** [nextjs.org/блог](https://nextjs.org/блог)

</details>

<a name="2-app-vs-pages-router"></a>

### Topic template

Каждая важная тема в `<details>` следующие разделы:

**Определение** → **Как это работает** → **Когда использовать** → **Плюсы и минусы** → **Примеры** → **Мысли** → **Источники**

---

<a name="1-framework-overview"></a>

### Primary references

**Definition:**

Официальная документация и руководства по платформам для Next.js и Vercel.

- [nextjs.org/docs](https://nextjs.org/docs) — официальная документация
- [nextjs.org/docs/llms.txt](https://nextjs.org/docs/llms.txt) — полный указатель документации для LLM.
- [Руководство по платформе Vercel Next.js](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Частичный предварительный рендеринг на Vercel](https://vercel.com/docs/partial-prerendering)\* [Кэш времени выполнения Vercel](https://vercel.com/docs/caching/runtime-cache)
- [Промежуточное программное обеспечение Vercel Routing] (https://vercel.com/docs/routing-middleware)

**Sources:** [nextjs.org/docs](https://nextjs.org/docs)

</details>

## 2. Design principles

<details>
  <summary>SOLID in Next.js</summary>

### SOLID in Next.js

**Definition:** Пять принципов **SOLID** для **модулей Next.js, Server/Client Components, Route Handlers и хелперов в `lib/`** — не только для `class`.

| Principle                     | Meaning                            | Next.js example                                                                              |
| ----------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| **S** — Single Responsibility | Одна причина для изменения модуля  | `page.tsx` композирует · `queries.ts` читает · `actions.ts` мутирует                         |
| **O** — Open/Closed           | Расширять новым кодом, не правками | Добавить `applePay` — не править `checkout()` под каждый тип оплаты                          |
| **L** — Liskov Substitution   | Подтипы соблюдают контракт         | Общие layout/page props работают для каждого варианта — без client-only полей в server-типах |
| **I** — Interface Segregation | Маленькие сфокусированные API      | Передавать `{ readUser }` — не весь DB-клиент, когда нужны только чтения                     |
| **D** — Dependency Inversion  | Зависеть от абстракций             | `placeOrder(input, store)` — инжектить repository; в тестах — фейковый `store`               |

**How it works:**

Каждая буква соответствует **Examples** ниже — ищите `// good` и `// bad`:

1. **S** — разделить `page.tsx`, `queries.ts`, `actions.ts` — не один файл с fetch, validate, email и render.
2. **O** — новый payment provider = новая функция в map — не новый `if` в `checkout()`.
3. **L** — любой layout wrapper принимает тот же контракт `children` — без варианта, ломающего streaming/RSC.
4. **I** — `loadCheckout()` принимает `{ readCart }` — не весь модуль `db`.
5. **D** — домен в `lib/` получает `store` / `fetch` — Route Handler подключает конкретные адаптеры.

**When to use:** Рефакторинг жирных `page.tsx`; plugin-style провайдеры (auth, payments, CMS); code review для новых фич App Router.

**Examples:**

```ts
type OrderInput = { sku: string; qty: number };
type Order = OrderInput & { id: string };
type OrderStore = { save(order: Order): Promise<void> };

// S — good: domain validation separate from route wiring
export function validateOrder(input: OrderInput): Order {
  return { ...input, id: crypto.randomUUID() };
}

export async function placeOrder(input: OrderInput, store: OrderStore) {
  await store.save(validateOrder(input));
}

// S — bad: page.tsx fetches, validates, saves, sends email, renders form
// export default async function CheckoutPage() {
//   const cart = await db.cart.find(...);
//   await sendReceiptEmail(...);
//   return <form>...</form>;
// }

// O — good: add provider without editing checkout
const payProviders = {
  stripe: (amount: number) => ({ ok: true, provider: "stripe", amount }),
  paypal: (amount: number) => ({ ok: true, provider: "paypal", amount }),
};

function checkout(provider: keyof typeof payProviders, amount: number) {
  return payProviders[provider](amount);
}

// O — bad: edit checkout() for every new provider
// function checkout(provider: string, amount: number) {
//   if (provider === "stripe") return payStripe(amount);
//   if (provider === "paypal") return payPaypal(amount);
// }

// L — good: layout always renders children the same way
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// L — bad: "layout" that sometimes omits children or throws for certain routes
// export default function BrokenLayout({ children, variant }) {
//   if (variant === "marketing") throw new Error("No layout");
//   return <div>{children}</div>;
// }

// I — good: query helper needs only readUser
type UserReader = { readUser(id: string): Promise<{ id: string; name: string }> };

export async function loadProfile(id: string, users: UserReader) {
  return users.readUser(id);
}

// I — bad: pass whole db client into a function that only reads one row
// export async function loadProfile(id: string, db: DbClient) {
//   return db.user.findUnique({ where: { id } });
// }

// D — good: inject store in lib/ — test with fake
export async function placeOrder(input: OrderInput, store: OrderStore) {
  await store.save(validateOrder(input));
}
// placeOrder(input, { save: async () => {} });

// D — bad: lib/ imports Prisma directly — hard to test, locked to one DB
// import { prisma } from "@/lib/prisma";
// export async function placeOrder(input: OrderInput) {
//   await prisma.order.create({ data: validateOrder(input) });
// }
```

```tsx
// S — good: page composes; queries live elsewhere
import { CheckoutForm } from "./checkout-form";
import { loadCheckout } from "./queries";

export default async function CheckoutPage() {
  const checkout = await loadCheckout();
  return <CheckoutForm initial={checkout} />;
}
```

**Thoughts:** SOLID — **ориентир**, не закон: для одноразовой маркетинговой страницы пять интерфейсов не нужны. Применять, когда больно менять или тестировать. React: [SOLID in React](./4_react_core.md#solid-in-react). Express: [SOLID in Express](./8_nodejs_http.md#solid-in-express) · [SOLID in TypeScript](./5_ts_objects.md#solid-in-typescript). Полный справочник: [OOP & SOLID](./7_special_engineering.md#solid-overview).

**Sources:** [freecodecamp — SOLID](https://www.freecodecamp.org/news/solid-principles-single-responsibility-principle-explained/) · [SOLID (overview)](./7_special_engineering.md#solid-overview) · [JS — SOLID in Classes](./3_js_core.md#solid-in-classes) · [JS — SOLID in Functions](./3_js_core.md#solid-in-functions) · [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Express](./8_nodejs_http.md#solid-in-express) · [SOLID in TypeScript](./5_ts_objects.md#solid-in-typescript)

</details>
