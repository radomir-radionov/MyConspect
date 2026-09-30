# Next.js — Interview

Интервью с вопросами и ответами и задания по кодированию.

[ ← Вернуться в центр](./4_nextjs.md)

### Related docs

- [Next.js — Ядро](./4_nextjs_core.md) · [Next.js — Rendering](./4_nextjs_rendering.md) · [Next.js — Данные](./4_nextjs_data.md) · [Next.js — Маршрутизация](./4_nextjs_routing.md) · [Next.js — Оптимизации](./4_nextjs_optimizations.md) · [Next.js — Платформа](./4_nextjs_platform.md) · [Next.js — Интервью](./4_nextjs_interview.md)

### Sections

- [Interview Practice](#interview-practice)
- [Questions & Answers](#questions-answers)
- [Coding tasks](#coding-tasks)

---

## Interview Practice

Вопросы для собеседований по Next.js. Попробуйте ответить, прежде чем открывать решения.

**Definition:** Курируемые вопросы и ответы, а также задачи по написанию кода, охватывающие рендеринг, кэширование App Router, действия сервера и развертывание.

_Ответы на интервью следуют: Определение → Сравнительная таблица → Когда использовать → Пример → Примечания → Источник._

### Question index

| Тема                                                  | Ответ            |
| ----------------------------------------------------- | ---------------- |
| SSR против SSG против ISR против CSR                  | Вопросы и ответы |
| Маршрутизатор приложений против Маршрутизатор страниц | Вопросы и ответы |
| Серверные и клиентские компоненты                     | Вопросы и ответы |
| Кэширование (`fetch`, `revalidate`)                   | Вопросы и ответы |
| Действия сервера                                      | Вопросы и ответы |
| Задания по кодированию 1–3                            | Задачи           |

---

## Questions & Answers

<details>
  <summary>SSR vs SSG vs ISR vs CSR?</summary>

### SSR vs SSG vs ISR vs CSR?

**Definition:** Четыре способа, которыми HTML достигает браузера: в ходе собеседования проверяется, знаете ли вы, **когда** каждый из них запускается и какой API Next.js его запускает.

| Режим           | Когда HTML построен                       | Триггер Next.js                                      | Вариант использования                                                      |
| --------------- | ----------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------- |
| **КС**          | Клиент после загрузки JS                  | `'use client'` + получение клиента                   | Тяжелые информационные панели за аутентификацией, низкая потребность в SEO |
| **ССР**         | Каждый запрос на сервере                  | `cache: 'no-store'`, `cookies()`, `force-dynamic`    | Персонализированные, всегда свежие страницы                                |
| **ССГ**         | Время сборки                              | По умолчанию `fetch`, `force-static`                 | Маркетинг, документация, юриспруденция                                     |
| **ИСР**         | Сборка + периодическое обновление         | `next: { revalidate: N }`, `export const revalidate` | Блоги, каталоги, которые время от времени меняются                         |
| **PPR** (бонус) | Статическая оболочка + потоковая динамика | `cacheComponents: true`, `use cache`                 | Лучшее из статических + персонализированных                                |

| Плюсы                                     | Минусы                                                     |
| ----------------------------------------- | ---------------------------------------------------------- |
| SSG/ISR — самый быстрый и удобный для CDN | Устарело до повторной проверки                             |
| ССР — всегда актуально                    | Более высокий TTFB, отсутствие CDN для HTML                |
| КСО — насыщенная интерактивность          | Плохое SEO, медленная первая отрисовка                     |
| ISR — баланс для контентных сайтов        | Неправильный TTL → устаревшие или напрасные восстановления |

**When to use:**

- Маркетинговый лендинг → **SSG**
- Блог со свежестью 60-х → **ISR** (`revalidate: 60`)
- Панель пользователя с сеансом → **SSR** (читайте `cookies()`)
- Диаграмма администратора с опросом в реальном времени → **CSR** лист внутри оболочки сервера.

**Examples:**

```tsx
// ISR
const posts = await fetch(url, { next: { revalidate: 60 } });

// SSR
const user = await fetch(url, { cache: "no-store" });
```

**Thoughts:** Маршрутизатор приложений **статичен по умолчанию** — ранее `getServerSideProps` страницам может потребоваться явное `no-store`. Упомяните **потоковую SSR** — фрагменты HTML отправляются до разрешения медленных данных.

**Sources:** [nextjs.org/docs/app/guides/caching](https://nextjs.org/docs/app/guides/caching)

</details>

<details>
  <summary>App Router vs Pages Router?</summary>

### App Router vs Pages Router?

**Definition:** Две системы маршрутизации в одном фреймворке — App Router (`app/`) используется по умолчанию для новых проектов; Маршрутизатор страниц (`pages/`) — устаревший режим обслуживания.

|                            | Маршрутизатор приложений                 | Маршрутизатор страниц                  |
| -------------------------- | ---------------------------------------- | -------------------------------------- |
| **Каталог**                | `app/`                                   | `pages/`                               |
| **Компонент по умолчанию** | Серверный компонент                      | Клиент (модель до RSC)                 |
| **Извлечение данных**      | `async` Серверный компонент, `fetch` кэш | `getServerSideProps`, `getStaticProps` |
| **Макеты**                 | Вложенный `layout.tsx`                   | Одинокий `_app.tsx`                    |
| **Загрузка/ошибка**        | `loading.tsx`, `error.tsx` совмещенный   | Руководство                            |
| **Мутации**                | Действия сервера                         | Маршруты API + выборка клиента         |
| **Метаданные**             | `metadata` экспорт / `generateMetadata`  | `next/head`                            |
| **Промежуточное ПО**       | `proxy.ts` (Следующие 16)                | `middleware.ts`                        |

| Плюсы (приложение)                            | Минусы (приложение)                                          |
| --------------------------------------------- | ------------------------------------------------------------ |
| RSC, потоковая передача, вложенные макеты     | Более крутая кривая обучения кэшированию                     |
| Действия сервера, мелкомасштабное кэширование | Стоимость миграции со Pages                                  |
| Совмещенные специальные файлы                 | В некоторых библиотеках до сих пор отсутствует поддержка RSC |

**When to use App Router:** Каждый новый проект, начиная с Next.js 13+.

**When to keep Pages Router:** Промежуточная миграция крупных устаревших приложений — переносите поэтапно, а не масштабно.

**Example — migration mapping:**

| Страницы             | Маршрутизатор приложений                      |
| -------------------- | --------------------------------------------- |
| `pages/index.tsx`    | `app/page.tsx`                                |
| `getStaticProps`     | `fetch` с кешем по умолчанию или `use cache`  |
| `getServerSideProps` | `fetch({ cache: 'no-store' })` or `cookies()` |
| `pages/api/users.ts` | `app/api/users/route.ts`                      |

**Thoughts:** Невозможно обслуживать один и тот же URL-адрес с обоих маршрутизаторов. Сосуществовать во время миграции только по **разным путям**.

**Sources:** [nextjs.org/docs/app/guides/migrating](https://nextjs.org/docs/app/guides/migrating)

</details>

<details>
  <summary>Server vs Client Components?</summary>

### Server vs Client Components?

**Definition:** Компоненты App Router по умолчанию являются **серверными компонентами**. `"use client"` выбирает гидратацию на стороне клиента для интерактивности.

|                             | Серверный компонент              | Клиентский компонент                |
| --------------------------- | -------------------------------- | ----------------------------------- |
| **Действует**               | Только сервер                    | Сервер (SSR) + браузер (гидратация) |
| **JS отправлен**            | Нет для компонентной логики      | Да — комплект включен               |
| **Можно использовать**      | `async/await`, БД, секреты       | `useState`, `useEffect`, события    |
| **Невозможно использовать** | Крючки, `onClick`, API браузера  | Прямой `fs`, секреты сервера        |
| **Реквизит**                | Получает сериализуемые реквизиты | Получает сериализуемые реквизиты    |

| Плюсы                             | Минусы                                    |
| --------------------------------- | ----------------------------------------- |
| Меньшие пакеты клиентов           | Никакой интерактивности без ухода Клиента |
| Секреты в безопасности на сервере | Реквизит ограничений сериализации         |
| Извлечение данных без водопадов   | Для отладки необходимы журналы сервера    |

**When to use Server:** Получение данных, макеты, статический контент, передача данных в интерактивные листья.

**When to use Client:** Кнопки, формы с мгновенной проверкой, диаграммы, `useEffect`, API браузера.

**Example — composition pattern:**

```tsx
// app/posts/page.tsx — Server (no directive)
export default async function PostsPage() {
  const posts = await getPosts();
  return posts.map((p) => <PostCard key={p.id} post={p} />);
}

// post-card.tsx
("use client");
export function PostCard({ post }: { post: { id: string; title: string } }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{post.title}</button>;
}
```

**Thoughts:** Толкать `"use client"` в **оставление**, а не в корень страницы. Импорт клиентского компонента в серверный компонент работает; обратного нет.

**Sources:** [nextjs.org/docs/app/getting-started/server-and-client-comComponents](https://nextjs.org/docs/app/getting-started/server-and-client-comComponents)

</details>

<details>
  <summary>Next.js caching mental model?</summary>

### Next.js caching mental model?

**Definition:** Четыре слоя кэша — ответ на собеседовании должен назвать каждый, что он хранит и как сделать его недействительным после мутаций.

| Слой                 | Магазины                                    | Очистил                           |
| -------------------- | ------------------------------------------- | --------------------------------- |
| Запросить мемоизацию | Дедупликация выборки для каждого рендеринга | Новый запрос                      |
| Кэш данных           | `fetch` / `use cache` результаты            | `revalidateTag`, ТТЛ              |
| Полный кэш маршрутов | Полезная нагрузка HTML + RSC                | `revalidatePath`, `revalidateTag` |
| Кэш маршрутизатора   | Клиентская навигация Полезная нагрузка RSC  | `router.refresh()`, перезагрузить |

| `fetch` вариант              | Поведение                                                            |
| ---------------------------- | -------------------------------------------------------------------- |
| По умолчанию (`force-cache`) | Статический — кэшируется до тех пор, пока не станет недействительным |
| `cache: 'no-store'`          | Динамический каждый запрос                                           |
| `next: { revalidate: 60 }`   | ISR — обновление после 60-х годов                                    |
| `next: { tags: ['x'] }`      | Тег для `revalidateTag('x', 'max')`                                  |

| Плюсы                                                               | Минусы                                                         |
| ------------------------------------------------------------------- | -------------------------------------------------------------- |
| Огромная производительность для приложений с большим объемом чтения | Ошибка №1: устаревший пользовательский интерфейс после мутации |
| Дедупликация запросов предотвращает двойные попадания в БД          | Кэш маршрутизатора удивляет после `revalidatePath`             |

**When to use:**

- Публичный каталог → кеш по умолчанию + теги
- Панель пользователя → `no-store` or `use cache: private`
- После мутации → `revalidateTag` + `revalidatePath` в действии сервера

**Examples:**

```tsx
"use server";
export async function updateProduct(id: string) {
  await db.product.update({ where: { id }, data: {} });
  revalidateTag(`product-${id}`, "max");
  revalidatePath("/products");
}
```

**Thoughts:** `cookies()` выбирает динамический маршрут. `unstable_noStore()` / `connection()` выйти из статического кэша. Next.js 16: предпочитаю `use cache` + `cacheTag` над одеялом `force-dynamic`.

**Sources:** [nextjs.org/docs/app/guides/caching](https://nextjs.org/docs/app/guides/caching)

</details>

<details>
  <summary>Server Actions vs Route Handlers?</summary>

### Server Actions vs Route Handlers?

**Definition:** Два шаблона мутации сервера. Действия для вашего приложения — это RPC; Обработчики маршрутов — это настоящие конечные точки HTTP.

|                             | Действия сервера                              | Обработчики маршрутов                             |
| --------------------------- | --------------------------------------------- | ------------------------------------------------- |
| **Файл**                    | `'use server'` функция или файл               | `route.ts`                                        |
| **Призыв**                  | `<form action>`, импорт в Клиент              | `fetch('/api/...')`                               |
| **Протокол**                | POST с зашифрованным идентификатором действия | ПОЛУЧИТЬ, ОТПРАВИТЬ, ПОЛОЖИТЬ, ИСПРАВИТЬ, УДАЛИТЬ |
| **Потребители**             | Только приложение Next.js                     | Любой HTTP-клиент                                 |
| **CSRF**                    | Встроенная проверка Origin                    | Вы реализуете                                     |
| **Прогрессивное улучшение** | Да — работает без JS                          | Нет                                               |

| Плюсы                                            | Минусы                           |
| ------------------------------------------------ | -------------------------------- | --- | ------------------------------------------- | ---------------------------------- |
| Действия — совмещенные типобезопасные мутации    | Не общедоступный API             |     | Обработчики — вебхуки, мобильные, сторонние | Нет формы прогрессивного улучшения |
| Действия — встроенный CSRF для того же источника | Действия POST-только под капотом |

**When to use Actions:** Отправка форм, изменения в приложении, оптимистичный пользовательский интерфейс с `useActionState`.

**When to use Route Handlers:** Веб-перехватчики Stripe, общедоступный REST API, обратные вызовы OAuth, серверная часть мобильного приложения.

**Examples:**

```tsx
// Server Action — internal mutation
"use server";
export async function createTodo(fd: FormData) {
  await db.todo.create({ data: { title: String(fd.get("title")) } });
  revalidatePath("/todos");
}

// Route Handler — external webhook
export async function POST(req: Request) {
  const event = await req.json();
  await processWebhook(event);
  return Response.json({ ok: true });
}
```

**Thoughts:** Никогда не используйте действия сервера вместо общедоступного API. Всегда проверяйте аутентификацию в обоих случаях — встроенный CSRF ≠ авторизация.

**Sources:** [nextjs.org/docs/app/getting-started/route-handlers](https://nextjs.org/docs/app/getting-started/route-handlers)

</details>

---

## Coding tasks

<details>
  <summary>Task 1 — Fix stale cached page</summary>

### Task 1 — Fix stale cached page

**Definition:** Практический сценарий — список продуктов остается устаревшим после изменения администратора, поскольку кеш сервера не был аннулирован.

**Scenario:** `/products` использует кэшированный `fetch` or `use cache`. Администратор обновляет продукт с помощью действия сервера, но после перенаправления в общедоступном списке по-прежнему отображаются старые данные.

| Симптом                                  | Вероятная причина                                       |
| ---------------------------------------- | ------------------------------------------------------- |
| Старые данные после мутации              | Отсутствующий `revalidatePath` / `revalidateTag`        |
| Старые данные только в навигации клиента | Кэш роутера — добавить `router.refresh()`               |
| Всегда несвежий                          | `revalidate` слишком высокий или кеш никогда не помечен |

**What to add:**

1. Пометьте выборку: `next: { tags: ['products'] }` or `cacheTag('products')` in `use cache`
2. В Действии сервера после БД напишите:

```tsx
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function updateProduct(id: string, formData: FormData) {
  await db.product.update({
    where: { id },
    data: {
      /* ... */
    },
  });
  revalidateTag("products", "max"); // Data Cache
  revalidateTag(`product-${id}`, "max"); // per-item tag
  revalidatePath("/products"); // Full Route Cache
}
```

3. Если клиентский компонент по-прежнему показывает устаревший список после навигации: `router.refresh()` после успеха действия.

<details>
  <summary>Answer</summary>

**Root cause:** Мутация обновила базу данных, но **Кэш данных** и/или **Полный кэш маршрутов** по-прежнему поддерживает старый рендеринг.

**Fix:** Вызов `revalidateTag('products', 'max')` и `revalidatePath('/products')` в действии сервера сразу после записи в БД. Убедитесь, что путь чтения использует соответствующие теги. Альтернатива: ниже `revalidate` интервал — хуже для производительности, приемлемо для админа с низким трафиком.

**Follow-up interview points:** Назовите все четыре слоя кэша; объясни почему `revalidatePath` сам по себе не может обновлять кэш маршрутизатора при навигации клиента.

**Sources:** [nextjs.org/docs/app/api-reference/functions/revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)

</details>

</details>

<details>
  <summary>Task 2 — Server Action form</summary>

### Task 2 — Server Action form

**Definition:** Практический сценарий — форма постепенного улучшения, которая отправляется через действие сервера без участия клиента. `fetch`.

**Scenario:** Создайте форму задачи, которая работает с отключенным JavaScript — встроенная отправка браузера, мутация сервера, обновленный список при перенаправлении/рендеринге.

| Требование                      | Реализация                                                                                |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| Нет `onSubmit` / клиент `fetch` | `<form action={addTodo}>`                                                                 |
| Мутация сервера                 | `'use server'` функция                                                                    |
| Свежий список после добавления  | `revalidatePath('/todos')`                                                                |
| Проверка                        | Проверять `formData` в действии; возвращать ошибки через `useActionState` (необязательно) |

**Examples:**

```tsx
// actions.ts
"use server";

import { revalidatePath } from "next/cache";

export async function addTodo(formData: FormData) {
  const title = formData.get("title");
  if (!title || String(title).trim().length === 0) {
    return { error: "Title required" };
  }
  await db.todo.create({ data: { title: String(title).trim() } });
  revalidatePath("/todos");
}

// page.tsx — Server Component
import { addTodo } from "./actions";

export default function TodosPage() {
  return (
    <form action={addTodo}>
      <input name="title" required />
      <button type="submit">Add</button>
    </form>
  );
}
```

<details>
  <summary>Answer</summary>

Использовать `<form action={addTodo}>` где `addTodo` это действие сервера (`'use server'`). Браузер выполняет собственный POST; Next.js вызывает действие на сервере, запускает `revalidatePath`и перерисовывает маршрут — **нет `onSubmit`, нет клиента `fetch`**.

**Bonus:** Обернуть с `useActionState` в клиентском компоненте для встроенного отображения ошибок при сохранении прогрессивного улучшения.

**Security note:** Проверка и авторизация внутри действия — CSRF обрабатывается для сообщений одного и того же происхождения, но аутентификация не происходит автоматически.

**Sources:** [nextjs.org/docs/app/getting-started/mutating-data](https://nextjs.org/docs/app/getting-started/mutating-data)

</details>

</details>

<details>
  <summary>Task 3 — loading.tsx vs Suspense</summary>

### Task 3 — loading.tsx vs Suspense

**Definition:** Практический сценарий — выбор между границами загрузки на уровне маршрута и компонента для потоковой передачи.

**Scenario:** Страница информационной панели имеет быстрый заголовок и медленный виджет аналитики. Полностраничный счетчик работает медленно; вам нужен заголовок немедленно.

| Инструмент            | Область применения          | Триггеры                                           |
| --------------------- | --------------------------- | -------------------------------------------------- |
| `loading.tsx`         | Весь участок маршрута       | Клиентская навигация к этому сегменту              |
| `<Suspense fallback>` | Только завернутое поддерево | Этот асинхронный дочерний элемент приостанавливает |

| Плюсы (`loading.tsx`)                           | Плюсы (`<Suspense>`)                                            |
| ----------------------------------------------- | --------------------------------------------------------------- |
| Нулевой шаблон на маршрут                       | Гранулированный — быстрые и медленные области на одной странице |
| Мгновенный скелет по навигации                  | Несколько границ на странице                                    |
| Работает с `app/router` предварительная выборка | Создание с дочерними компонентами серверных компонентов         |

**Examples:**

```tsx
// app/dashboard/page.tsx
import { Suspense } from "react";
import { Analytics } from "./analytics"; // async Server Component

export default function DashboardPage() {
  return (
    <div>
      <header>Dashboard</header> {/* renders immediately */}
      <Suspense fallback={<p>Loading analytics…</p>}>
        <Analytics />
      </Suspense>
    </div>
  );
}
```

```tsx
// app/dashboard/loading.tsx — shows during navigation to /dashboard/*
export default function Loading() {
  return <DashboardSkeleton />;
}
```

<details>
  <summary>Answer</summary>

Использовать **`loading.tsx`** когда **весь сегмент маршрута** должен отображать резервный вариант во время навигации клиента (например, переход от `/` to `/dashboard`).

Используйте **встроенный `<Suspense>`** если только **часть** страницы работает медленно — заголовок отображается немедленно, а аналитика поступает по мере готовности. Вы можете объединить оба: `loading.tsx` для переходов маршрутов, приостановка для внутристраничной потоковой передачи.

**Interview follow-up:** Оба используют React Suspense под капотом; `loading.tsx` это соглашение о файлах, которое автоматически переносит `page.tsx`.

**Sources:** [nextjs.org/docs/app/api-reference/file-conventions/loading](https://nextjs.org/docs/app/api-reference/file-conventions/loading)

</details>

</details>

---
