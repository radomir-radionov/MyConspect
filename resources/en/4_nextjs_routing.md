# Next.js — Routing

File-based routes, special files, navigation, metadata, and SEO.

[← Back to hub](./4_nextjs.md)

### Related docs

* [Next.js — Core](./4_nextjs_core.md) · [Next.js — Data](./4_nextjs_data.md) · [Next.js — Routing](./4_nextjs_routing.md) · [Next.js — Platform](./4_nextjs_platform.md) · [Next.js — Interview](./4_nextjs_interview.md)

### Sections

- [10. File-based routing](#10-file-based-routing)
- [11. Special files](#11-special-files)
- [12. Navigation](#12-navigation)
- [13. Metadata & SEO](#13-metadata-seo)

---

## 10. File-based routing

*Topics follow: Definition → Pros / Cons → When to use → Example → Notes → Source ([template](./4_nextjs_core.md#topic-template)).*

<details>
  <summary>Dynamic routes</summary>

### Dynamic routes

**Definition:**

Bracket syntax in folder names creates dynamic URL segments. Access values via `params` (async in Next.js 16).

| Pattern | URL | `params` |
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

**Definition:** Pre-renders dynamic routes at build time. Returns list of param objects.

**Pluses and minuses:**

| + | − |
|------|------|
| SSG for dynamic paths | Build time scales with param count |
| Great for blogs, product catalogs | Must handle new slugs (fallback or on-demand) |

**Examples:**

```tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  return posts.map((post: { slug: string }) => ({ slug: post.slug }));
}
```

**Thoughts:** Combine with `dynamicParams = false` to 404 unknown slugs, or `true` (default) to generate on first visit.

**Sources:** [nextjs.org/docs/app/api-reference/functions/generate-static-params](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)

</details>

<details>
  <summary>Parallel routes</summary>

### Parallel routes

**Definition:** Named slots via `@folder` syntax render multiple pages in the same layout simultaneously.

**Pluses and minuses:**

| + | − |
|------|------|
| Independent loading/error per slot | Complex mental model |
| Dashboard layouts with side panels | Requires `default.tsx` for unmatched slots |

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

`(.)` convention intercepts a route to render it inside the current layout — modal pattern.

| Convention | Intercepts |
|------------|------------|
| `(.)` | Same level |
| `(..)` | One level up |
| `(..)(..)` | Two levels up |
| `(...)` | From root |

**When to use:** Photo lightboxes, quick-edit modals, share dialogs.

**Examples:**

```
app/
├── @modal/(.)photo/[id]/page.tsx  # Modal overlay
└── photo/[id]/page.tsx            # Full page on direct visit
```

**Thoughts:** Close modal with `router.back()` — not `router.push('/')` — to preserve history stack.

**Sources:** [nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes)

</details>

<details>
  <summary>URL state — array query parameters</summary>

### URL state — array query parameters

**Definition:** Filter UIs often serialize multi-select state as repeated query keys (e.g. `category_ids[]=1&category_ids[]=2`).

**When to use:** Project filters, faceted search, tag selection.

**Pluses and minuses:**

| + | − |
|------|------|
| Shareable/bookmarkable filter state | Encoding complexity (`%5B%5D` for `[]`) |
| Works without client state libs | Requires `useSearchParams` + Suspense |

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

**Thoughts:** Prefer `URLSearchParams` for encoding instead of manual `%5B%5D`. For complex URL state consider `nuqs` library.

**Sources:** [nextjs.org/docs/app/api-reference/functions/use-search-params](https://nextjs.org/docs/app/api-reference/functions/use-search-params)

</details>

<details>
  <summary>Route groups</summary>

### Route groups

**Definition:** Folders wrapped in `(name)` organize routes without affecting the URL.

**When to use:** Separate marketing vs app layouts, auth vs dashboard route trees.

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

**Definition:** `<Link>` from `next/link` enables client-side navigation with automatic prefetching of static routes.

**Examples:**

```tsx
import Link from 'next/link';

<Link href="/blog/my-post" prefetch={true}>Read post</Link>
```

**Thoughts:**

At build time, ensure trailing slash consistency via `trailingSlash` in `next.config.ts` — mismatched slashes cause 404s or duplicate routes.

---

**Sources:** [nextjs.org/docs/app/getting-started/linking-and-navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

</details>

<a name="11-special-files"></a>

## 11. Special files

*Topics follow: Definition → Pros / Cons → When to use → Example → Notes → Source ([template](./4_nextjs_core.md#topic-template)).*

<details>
  <summary>error.tsx</summary>

### error.tsx

**Definition:** Client Component error boundary for a route segment. Catches errors in `page.tsx` and children during rendering.

**Pluses and minuses:**

| + | − |
|------|------|
| Granular error UI per section | Must be `'use client'` |
| `reset()` re-attempts render | Does not catch errors in same-segment `layout.tsx` |

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

**Definition:** UI shown when `notFound()` is called from a Server Component or Route Handler.

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

**Definition:** Auth interrupt pages triggered by `forbidden()` and `unauthorized()` helpers (requires `authInterrupts: true` in config).

**When to use:** Role-based access — 403 vs 401 semantics.

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

**Definition:** Root-level error boundary wrapping the entire `html`/`body`. Last resort for root layout errors.

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

**Thoughts:** Must include own `<html>` and `<body>` tags.

**Sources:** [nextjs.org/docs/app/api-reference/file-conventions/error](https://nextjs.org/docs/app/api-reference/file-conventions/error)

</details>

<details>
  <summary>Redirect helpers</summary>

### Redirect helpers

**Definition:**

Navigation helpers that throw special errors to trigger redirects or 404 responses during Server Component render.

| Function | HTTP | Use case |
|----------|------|----------|
| `redirect(url)` | 307 Temporary | Post-mutation redirect |
| `permanentRedirect(url)` | 308 Permanent | URL migration |
| `notFound()` | 404 | Missing resource |

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

**Definition:** Re-throws Next.js internal errors (`redirect`, `notFound`) from catch blocks — otherwise they are swallowed.

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

*Topics follow: Definition → Pros / Cons → When to use → Example → Notes → Source ([template](./4_nextjs_core.md#topic-template)).*

<details>
  <summary>next/link</summary>

### next/link

**Definition:** Client-side navigation component with automatic prefetch for visible links in production.

**Pluses and minuses:**

| + | − |
|------|------|
| Fast SPA-like navigation | Prefetch can increase bandwidth |
| Scroll restoration | External URLs need plain `<a>` |

**Examples:**

```tsx
import Link from 'next/link';

<Link href="/about">About</Link>
<Link href="/blog/post-1" replace>Replace history</Link>
<Link href="/docs" scroll={false}>No scroll to top</Link>
```

**Sources:** [nextjs.org/docs/app/api-reference/components/link](https://nextjs.org/docs/app/api-reference/components/link)

</details>

<details>
  <summary>Navigation hooks</summary>

### Navigation hooks

**Definition:**

Client-side hooks from `next/navigation` (App Router). Do not use `next/router` — that is Pages Router only.

| Hook | Returns |
|------|---------|
| `useRouter()` | `{ push, replace, refresh, back, forward, prefetch }` |
| `usePathname()` | Current pathname string |
| `useSearchParams()` | `URLSearchParams` — requires Suspense |
| `useParams()` | Dynamic route params object |

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

**Definition:** Imperative client-side navigation via `useRouter()` methods — push, replace, back, and refresh.

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

**Definition:** `next.config.ts` option controlling whether URLs require trailing slashes.

**Examples:**

```ts
const nextConfig = { trailingSlash: true }; // /about/ instead of /about
```

**Thoughts:**

Be consistent — mixed links (`/about` vs `/about/`) cause duplicate content and broken relative paths. When `trailingSlash: true`, always include `/` in `href` and `router.push` paths.

---

**Sources:** [nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash](https://nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash)

</details>

<a name="13-metadata--seo"></a>

## 13. Metadata & SEO

*Topics follow: Definition → Pros / Cons → When to use → Example → Notes → Source ([template](./4_nextjs_core.md#topic-template)).*

<details>
  <summary>Static metadata</summary>

### Static metadata

**Definition:** Export a `metadata` object from `layout.tsx` or `page.tsx` for `<title>`, description, Open Graph, Twitter cards.

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

**Definition:** Async function for dynamic metadata based on route params or fetched data.

**Pluses and minuses:**

| + | − |
|------|------|
| Per-page SEO from CMS data | Runs on server — watch fetch caching |
| Deduplicates with page data fetch if structured well | Errors need handling |

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

Convention files (`icon.png`, `opengraph-image.tsx`, `sitemap.ts`) that Next.js auto-discovers for SEO metadata.

| File | Purpose |
|------|---------|
| `favicon.ico` | Favicon |
| `icon.png` / `apple-icon.png` | App icons |
| `opengraph-image.tsx` | Dynamic OG image generation |
| `twitter-image.tsx` | Twitter card image |
| `robots.txt` | Crawler rules |
| `sitemap.ts` | Dynamic sitemap |

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

**Definition:** Structured data for rich search results. Inject via `<script type="application/ld+json">` in Server Components.

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

SSR apps get SEO from server-rendered HTML + metadata. Client-only SPAs need extra work — Next.js handles this by default in App Router.

---

**Sources:** [nextjs.org/docs/app/guides/json-ld](https://nextjs.org/docs/app/guides/json-ld)

</details>

<a name="14-built-in-optimizations"></a>
