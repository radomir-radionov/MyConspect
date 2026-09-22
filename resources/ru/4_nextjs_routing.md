# Next.js — Routing

Маршруты на основе файлов, специальные файлы, навигация, метаданные и SEO.

[ ← Вернуться в центр](./4_nextjs.md)

### Related docs

* [Next.js — Ядро](./4_nextjs_core.md) · [Next.js — Данные](./4_nextjs_data.md) · [Next.js — Маршрутизация](./4_nextjs_routing.md) · [Next.js — Платформа](./4_nextjs_platform.md) · [Next.js — Интервью](./4_nextjs_interview.md)

### Sections

- [10. File-based routing](#10-file-based-routing)
- [11. Special files](#11-special-files)
- [12. Navigation](#12-navigation)
- [13. Metadata & SEO](#13-metadata-seo)

---

## 10. File-based routing

*Темы следующие: Определение → Плюсы и минусы → Когда использовать → Пример → Примечания → Источник ([шаблон](./4_nextjs_core.md#topic-template)).*

<details>
  <summary>Dynamic routes</summary>

### Dynamic routes

**Definition:**

Синтаксис скобок в именах папок создает динамические сегменты URL-адресов. Доступ к значениям через `params` (асинхронный в Next.js 16).

| Узор | URL-адрес | `params` |
|---------|-----|----------|
| `[id]` | `/products/42` | `{ id: '42' }` |
| `[...slug]` | `/docs/a/b` | `{ slug: ['a', 'b'] }` |
| `[[...slug]]` | `/shop` or `/shop/a` | `{ slug: undefined }` or `{ slug: ['a'] }` |

**Examples:**

```tsx
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  return <h1>{product.name}</h1>;
}
```

**Sources:** [nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)

</details>

<details>
  <summary>generateStaticParams</summary>

### generateStaticParams

**Definition:** Предварительно визуализирует динамические маршруты во время сборки. Возвращает список объектов параметров.

**Pluses and minuses:**

| + | − |
|------|------|
| SSG для динамических путей | Построение шкал времени с учетом количества параметров |
| Отлично подходит для блогов, каталогов продукции | Должен обрабатывать новые пули (резервный вариант или по требованию) |

**Examples:**

```tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  return posts.map((post: { slug: string }) => ({ slug: post.slug }));
}
```

**Thoughts:** Комбинировать с `dynamicParams = false` до 404 неизвестных пулей, или `true` (по умолчанию) генерируется при первом посещении.

**Sources:** [nextjs.org/docs/app/api-reference/functions/generate-static-params](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)

</details>

<details>
  <summary>Parallel routes</summary>

### Parallel routes

**Definition:** Именованные слоты через `@folder` синтаксис отображает несколько страниц в одном макете одновременно.

**Pluses and minuses:**

| + | − |
|------|------|
| Независимая загрузка/ошибка для каждого слота | Сложная ментальная модель |
| Макеты приборной панели с боковыми панелями | Требует `default.tsx` для непревзойденных слотов |

**Examples:**

```
app/
├── layout.tsx
├── @team/page.tsx
├── @analytics/page.tsx
└── page.tsx
```

```tsx
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  analytics: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="grid grid-cols-2">
        {team}
        {analytics}
      </div>
    </div>
  );
}
```

**Sources:** [nextjs.org/docs/app/api-reference/file-conventions/parallel-routes](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes)

</details>

<details>
  <summary>Intercepting routes</summary>

### Intercepting routes

**Definition:**

`(.)` соглашение перехватывает маршрут для его рендеринга внутри текущего макета — модальный шаблон.

| Конвенция | Перехваты |
|------------|------------|
| `(.)` | Тот же уровень |
| `(..)` | На уровень выше |
| `(..)(..)` | Два уровня вверх |
| `(...)` | Из корня |

**When to use:** Лайтбоксы для фотографий, модальные окна быстрого редактирования, диалоговые окна обмена.

**Examples:**

```
app/
├── @modal/(.)photo/[id]/page.tsx  # Modal overlay
└── photo/[id]/page.tsx            # Full page on direct visit
```

**Thoughts:** Закрыть модальное окно с помощью `router.back()` - нет `router.push('/')` — для сохранения стека истории.

**Sources:** [nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes)

</details>

<details>
  <summary>URL state — array query parameters</summary>

### URL state — array query parameters

**Definition:** Пользовательские интерфейсы фильтров часто сериализуют состояние множественного выбора в виде повторяющихся ключей запроса (например, `category_ids[]=1&category_ids[]=2`).

**When to use:** Фильтры проектов, фасетный поиск, выбор тегов.

**Pluses and minuses:**

| + | − |
|------|------|
| Состояние фильтра, доступное для совместного использования/закладки | Сложность кодирования (`%5B%5D` для `[]`) |
| Работает без библиотек состояния клиента | Требует `useSearchParams` + Интрига |

**Examples:**

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

export function CategoryFilter({ filterKey }: { filterKey: string }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const onCategoryChange = (value: number) => {
    setSelected(prev =>
      prev.includes(`${value}`)
        ? prev.filter(id => id !== `${value}`)
        : [...prev, `${value}`],
    );
  };

  useEffect(() => {
    const query = selected
      .map(id => `${filterKey}%5B%5D=${id}`)
      .join('&');
    router.push(`/projects?${query}`);
  }, [selected, router, filterKey]);

  return (
  /* render checkboxes calling onCategoryChange */
    <div>{/* … */}</div>
  );
}
```

**Thoughts:** Предпочитать `URLSearchParams` для кодирования вместо ручного `%5B%5D`. Для сложного состояния URL рассмотрите `nuqs` библиотека.

**Sources:** [nextjs.org/docs/app/api-reference/functions/use-search-params](https://nextjs.org/docs/app/api-reference/functions/use-search-params)

</details>

<details>
  <summary>Route groups</summary>

### Route groups

**Definition:** Папки, завернутые в `(name)` организовывать маршруты, не затрагивая URL-адрес.

**When to use:** Отдельные макеты маркетинга и приложений, деревья маршрутов аутентификации и информационной панели.

**Examples:**

```
app/
├── (marketing)/
│   ├── layout.tsx    # Marketing layout
│   └── about/page.tsx
└── (app)/
    ├── layout.tsx    # App shell with sidebar
    └── dashboard/page.tsx
```

**Sources:** [nextjs.org/docs/app/api-reference/file-conventions/route-groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)

</details>

<details>
  <summary>Linking and prefetch</summary>

### Linking and prefetch

**Definition:** `<Link>` от `next/link` обеспечивает навигацию на стороне клиента с автоматической предварительной выборкой статических маршрутов.

**Examples:**

```tsx
import Link from 'next/link';

<Link href="/blog/my-post" prefetch={true}>Read post</Link>
```

**Thoughts:**

Во время сборки обеспечьте согласованность косой черты с помощью `trailingSlash` in `next.config.ts` — несовпадающие косые черты приводят к ошибкам 404 или дублированию маршрутов.

---

**Sources:** [nextjs.org/docs/app/getting-started/linking-and-navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

</details>

<a name="11-special-files"></a>

## 11. Special files

*Темы следующие: Определение → Плюсы и минусы → Когда использовать → Пример → Примечания → Источник ([шаблон](./4_nextjs_core.md#topic-template)).*

<details>
  <summary>error.tsx</summary>

### error.tsx

**Definition:** Граница ошибки клиентского компонента для сегмента маршрута. Отлавливает ошибки в `page.tsx` и дети во время рендеринга.

**Pluses and minuses:**

| + | − |
|------|------|
| Детальный интерфейс ошибок для каждого раздела | Должно быть `'use client'` |
| `reset()` повторные попытки оказать | Не улавливает ошибки в одном сегменте `layout.tsx` |

**Examples:**

```tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

**Sources:** [nextjs.org/docs/app/getting-started/error-handling](https://nextjs.org/docs/app/getting-started/error-handling)

</details>

<details>
  <summary>not-found.tsx</summary>

### not-found.tsx

**Definition:** Пользовательский интерфейс отображается, когда `notFound()` вызывается из серверного компонента или обработчика маршрута.

**Examples:**

```tsx
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  return <div>{product.name}</div>;
}
```

**Sources:** [nextjs.org/docs/app/api-reference/file-conventions/not-found](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

</details>

<details>
  <summary>forbidden.tsx / unauthorized.tsx</summary>

### forbidden.tsx / unauthorized.tsx

**Definition:** Страницы прерываний аутентификации, вызванные `forbidden()` и `unauthorized()` помощники (требуется `authInterrupts: true` в конфигурации).

**When to use:** Доступ на основе ролей — семантика 403 против 401.

**Examples:**

```tsx
import { unauthorized } from 'next/navigation';

export default async function AdminPage() {
  const session = await getSession();
  if (!session) unauthorized();
  return <AdminDashboard />;
}
```

**Sources:** [nextjs.org/docs/app/api-reference/functions/forbidden](https://nextjs.org/docs/app/api-reference/functions/forbidden)

</details>

<details>
  <summary>global-error.tsx</summary>

### global-error.tsx

**Definition:** Граница ошибки корневого уровня, охватывающая всю `html`/`body`. Крайнее средство для ошибок корневого макета.

**Examples:**

```tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <h2>Something went wrong</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

**Thoughts:** Должен включать собственный `<html>` и `<body>` теги.

**Sources:** [nextjs.org/docs/app/api-reference/file-conventions/error](https://nextjs.org/docs/app/api-reference/file-conventions/error)

</details>

<details>
  <summary>Redirect helpers</summary>

### Redirect helpers

**Definition:**

Помощники навигации, которые выдают специальные ошибки для запуска перенаправления или ответов 404 во время рендеринга серверных компонентов.

| Функция | HTTP | Вариант использования |
|----------|------|----------|
| `redirect(url)` | 307 Временно | Перенаправление после мутации |
| `permanentRedirect(url)` | 308 Постоянный | Миграция URL |
| `notFound()` | 404 | Отсутствует ресурс |

**Examples:**

```tsx
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getSession();
  if (!session) redirect('/login');
  return <Dashboard />;
}
```

**Sources:** [nextjs.org/docs/app/api-reference/functions/redirect](https://nextjs.org/docs/app/api-reference/functions/redirect)

</details>

<details>
  <summary>unstable_rethrow</summary>

### unstable_rethrow

**Definition:** Повторно выдает внутренние ошибки Next.js (`redirect`, `notFound`) из блоков catch — иначе они проглатываются.

**Examples:**

```tsx
import { unstable_rethrow } from 'next/navigation';

export default async function Page() {
  try {
    const data = await fetchData();
    return <div>{data}</div>;
  } catch (error) {
    unstable_rethrow(error);
    return <div>Failed to load</div>;
  }
}
```

---

**Sources:** [nextjs.org/docs/app/api-reference/functions/unstable_rethrow](https://nextjs.org/docs/app/api-reference/functions/unstable_rethrow)

</details>

<a name="12-navigation"></a>

## 12. Navigation

*Темы следующие: Определение → Плюсы и минусы → Когда использовать → Пример → Примечания → Источник ([шаблон](./4_nextjs_core.md#topic-template)).*

<details>
  <summary>next/link</summary>

### next/link

**Definition:** Компонент навигации на стороне клиента с автоматической предварительной загрузкой видимых ссылок в рабочей среде.

**Pluses and minuses:**

| + | − |
|------|------|
| Быстрая навигация в стиле SPA | Предварительная выборка может увеличить пропускную способность |
| Восстановление прокрутки | Внешние URL-адреса должны быть простыми `<a>` |

**Examples:**

```tsx
import Link from 'next/link';

<Link href="/about">About</Link>
<Link href="/blog/post-1" replace>Replace history</Link>
<Link href="/docs" scroll={false}>No scroll to top</Link>
```

**Sources:** [nextjs.org/docs/app/api-reference/comComponents/link](https://nextjs.org/docs/app/api-reference/comComponents/link)

</details>

<details>
  <summary>Navigation hooks</summary>

### Navigation hooks

**Definition:**

Клиентские хуки от `next/navigation` (Маршрутизатор приложений). Не используйте `next/router` — это только Pages Router.

| Крюк | Возврат |
|------|---------|
| `useRouter()` | `{ push, replace, refresh, back, forward, prefetch }` |
| `usePathname()` | Текущая строка пути |
| `useSearchParams()` | `URLSearchParams` — требуется Саспенс |
| `useParams()` | Объект параметров динамического маршрута |

**Examples:**

```tsx
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <nav>
      <span>Current: {pathname}?{searchParams.toString()}</span>
      <button onClick={() => router.push('/dashboard')}>Dashboard</button>
      <button onClick={() => router.refresh()}>Refresh server data</button>
    </nav>
  );
}
```

**Sources:** [nextjs.org/docs/app/api-reference/functions/use-router](https://nextjs.org/docs/app/api-reference/functions/use-router)

</details>

<details>
  <summary>Programmatic navigation</summary>

### Programmatic navigation

**Definition:** Обязательная навигация на стороне клиента через `useRouter()` методы — push, replace, back и update.

**Examples:**

```tsx
router.push('/projects?page=2');       // Navigate with history entry
router.replace('/login');              // Replace current entry
router.back();                         // History back
router.refresh();                      // Re-fetch RSC for current route
```

**Sources:** [nextjs.org/docs/app/api-reference/functions/use-router](https://nextjs.org/docs/app/api-reference/functions/use-router)

</details>

<details>
  <summary>trailingSlash</summary>

### trailingSlash

**Definition:** `next.config.ts` параметр, определяющий, требуют ли URL-адреса косой черты в конце.

**Examples:**

```ts
const nextConfig = { trailingSlash: true }; // /about/ instead of /about
```

**Thoughts:**

Будьте последовательны — смешанные ссылки (`/about` vs `/about/`) вызывают дублирование контента и нарушение относительных путей. Когда `trailingSlash: true`, всегда включайте `/` in `href` и `router.push` пути.

---

**Sources:** [nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash](https://nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash)

</details>

<a name="13-metadata--seo"></a>

## 13. Metadata & SEO

*Темы следующие: Определение → Плюсы и минусы → Когда использовать → Пример → Примечания → Источник ([шаблон](./4_nextjs_core.md#topic-template)).*

<details>
  <summary>Static metadata</summary>

### Static metadata

**Definition:** Экспортировать `metadata` объект из `layout.tsx` or `page.tsx` для `<title>`, описание, Open Graph, Твиттер-карточки.

**Examples:**

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Full-stack React on Next.js',
  openGraph: {
    title: 'My App',
    description: 'Full-stack React on Next.js',
    url: 'https://myapp.com',
    siteName: 'My App',
    images: [{ url: 'https://myapp.com/og.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
};
```

**Sources:** [nextjs.org/docs/app/getting-started/metadata-and-og-images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)

</details>

<details>
  <summary>generateMetadata</summary>

### generateMetadata

**Definition:** Асинхронная функция для динамических метаданных на основе параметров маршрута или полученных данных.

**Pluses and minuses:**

| + | − |
|------|------|
| Постраничное SEO на основе данных CMS | Запускается на сервере — смотрите кэширование выборки |
| Дедупликация с выборкой данных страницы, если она хорошо структурирована | Ошибки требуют обработки |

**Examples:**

```tsx
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: [post.coverImage] },
  };
}
```

**Sources:** [nextjs.org/docs/app/api-reference/functions/generate-metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

</details>

<details>
  <summary>File-based metadata</summary>

### File-based metadata

**Definition:**

Файлы соглашений (`icon.png`, `opengraph-image.tsx`, `sitemap.ts`), который Next.js автоматически обнаруживает метаданные SEO.

| Файл | Цель |
|------|---------|
| `favicon.ico` | Фавикон |
| `icon.png` / `apple-icon.png` | Иконки приложений |
| `opengraph-image.tsx` | Динамическое создание изображений OG |
| `twitter-image.tsx` | Изображение карточки Twitter |
| `robots.txt` | Правила краулера |
| `sitemap.ts` | Динамическая карта сайта |

**Examples:**

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export default function Image() {
  return new ImageResponse(
    <div style={{ fontSize: 64, background: '#000', color: '#fff', padding: 40 }}>
      My App
    </div>,
    { width: 1200, height: 630 },
  );
}
```

**Sources:** [nextjs.org/docs/app/api-reference/file-conventions/metadata](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)

</details>

<details>
  <summary>JSON-LD</summary>

### JSON-LD

**Definition:** Структурированные данные для расширенных результатов поиска. Внедрить через `<script type="application/ld+json">` в Серверных компонентах.

**Examples:**

```tsx
export default function ProductPage({ product }: { product: Product }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    offers: { '@type': 'Offer', price: product.price },
  };

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1>{product.name}</h1>
    </section>
  );
}
```

**Thoughts:**

Приложения SSR получают SEO из HTML + метаданных, отображаемых на сервере. Клиентские SPA требуют дополнительной работы — Next.js по умолчанию обрабатывает это в App Router.

---

**Sources:** [nextjs.org/docs/app/guides/json-ld](https://nextjs.org/docs/app/guides/json-ld)

</details>

<a name="14-built-in-optimizations"></a>
