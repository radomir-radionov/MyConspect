# Next.js — Interview

Interview Q&A and coding tasks.

[← Back to hub](./4_nextjs.md)

### Related docs

* [Next.js — Core](./4_nextjs_core.md) · [Next.js — Data](./4_nextjs_data.md) · [Next.js — Routing](./4_nextjs_routing.md) · [Next.js — Platform](./4_nextjs_platform.md) · [Next.js — Interview](./4_nextjs_interview.md)

### Sections

- [Interview Practice](#interview-practice)
- [Questions & Answers](#questions-answers)
- [Coding tasks](#coding-tasks)

---

<a name="interview-practice"></a>

## Interview Practice

Questions for Next.js interviews. Try answering before opening solutions.

**Definition:** Curated Q&A and coding tasks covering App Router rendering, caching, Server Actions, and deployment.

*Interview answers follow: Definition → comparison table → When to use → Example → Notes → Source.*

### Question index

| Topic | Answer |
|-------|--------|
| SSR vs SSG vs ISR vs CSR | Q&A |
| Core Web Vitals (LCP, INP, CLS, TTFB) | Q&A |
| App Router vs Pages Router | Q&A |
| Server vs Client Components | Q&A |
| Caching (`fetch`, `revalidate`) | Q&A |
| Server Actions | Q&A |
| Coding tasks 1–3 | Tasks |

---

## Questions & Answers

<details>
  <summary>SSR vs SSG vs ISR vs CSR?</summary>

### SSR vs SSG vs ISR vs CSR?

**Definition:** Four ways HTML reaches the browser — the interview tests whether you know **when** each runs and which Next.js API triggers it.

| Mode | When HTML is built | Next.js trigger | Use case |
|------|-------------------|-----------------|----------|
| **CSR** | Client after JS loads | `'use client'` + client fetch | Heavy dashboards behind auth, low SEO need |
| **SSR** | Every request on server | `cache: 'no-store'`, `cookies()`, `force-dynamic` | Personalized, always-fresh pages |
| **SSG** | Build time | Default `fetch`, `force-static` | Marketing, docs, legal |
| **ISR** | Build + periodic refresh | `next: { revalidate: N }`, `export const revalidate` | Blogs, catalogs that change occasionally |
| **PPR** (bonus) | Static shell + streamed dynamic | `cacheComponents: true`, `use cache` | Best of static + personalized |

| Pros | Cons |
|------|------|
| SSG/ISR — fastest, CDN-friendly | Stale until revalidation |
| SSR — always current | Higher TTFB, no CDN for HTML |
| CSR — rich interactivity | Poor SEO, slow first paint |
| ISR — balance for content sites | Wrong TTL → stale or wasted rebuilds |

**When to use:**

- Marketing landing → **SSG**
- Blog with 60s freshness → **ISR** (`revalidate: 60`)
- User dashboard with session → **SSR** (read `cookies()`)
- Admin chart with live polling → **CSR** leaf inside Server shell

**Examples:**

```tsx
// ISR
const posts = await fetch(url, { next: { revalidate: 60 } });

// SSR
const user = await fetch(url, { cache: 'no-store' });
```

**Thoughts:** App Router is **static by default** — former `getServerSideProps` pages may need explicit `no-store`. Mention **streaming SSR** — HTML chunks sent before slow data resolves.

**Sources:** [nextjs.org/docs/app/guides/caching](https://nextjs.org/docs/app/guides/caching)

</details>

<details>
  <summary>What are Core Web Vitals? How do you improve them in Next.js?</summary>

### What are Core Web Vitals? How do you improve them in Next.js?

**Definition:** Field metrics for real users: **LCP** (largest paint ≤ 2.5s), **INP** (interaction ≤ 200ms; replaced FID), **CLS** (layout shift ≤ 0.1). **TTFB** and **FCP** (≤ 1.8s) are diagnostics that feed LCP, not Core Vitals.

**How it works:** `next/image` + `priority` on the LCP image; Server Components / smaller client bundles for INP; `next/font` and explicit image sizes for CLS. Avoid `force-dynamic` when a static or ISR page would hit the CDN.

**Common pitfalls:** Citing FID as a current Core Web Vital. Edge SSR + far-away DB worsening TTFB.

**Thoughts:** One lever per metric — image, JS, layout.

**See also:** [Core Web Vitals on Vercel](./4_nextjs_platform.md#core-web-vitals-on-vercel) · [TTFB](./6_web_api_security.md#ttfb-time-to-first-byte) · [CLS](./1_html_performance.md#cls-cumulative-layout-shift) · [FCP](./6_web_api_security.md#first-contentful-paint-fcp) · [lab vs field](./6_web_api_security.md#core-web-vitals)

</details>

<details>
  <summary>App Router vs Pages Router?</summary>

### App Router vs Pages Router?

**Definition:** Two routing systems in one framework — App Router (`app/`) is the default for new projects; Pages Router (`pages/`) is legacy maintenance mode.

| | App Router | Pages Router |
|---|------------|--------------|
| **Directory** | `app/` | `pages/` |
| **Default component** | Server Component | Client (pre-RSC model) |
| **Data fetching** | `async` Server Component, `fetch` cache | `getServerSideProps`, `getStaticProps` |
| **Layouts** | Nested `layout.tsx` | Single `_app.tsx` |
| **Loading / error** | `loading.tsx`, `error.tsx` colocated | Manual |
| **Mutations** | Server Actions | API routes + client fetch |
| **Metadata** | `metadata` export / `generateMetadata` | `next/head` |
| **Middleware** | `proxy.ts` (Next 16) | `middleware.ts` |

| Pros (App) | Cons (App) |
|------------|------------|
| RSC, streaming, nested layouts | Steeper caching learning curve |
| Server Actions, fine-grained caching | Migration cost from Pages |
| Colocated special files | Some libs still lack RSC support |

**When to use App Router:** Every greenfield project since Next.js 13+.

**When to keep Pages Router:** Large legacy app mid-migration — migrate route-by-route, not big-bang.

**Example — migration mapping:**

| Pages | App Router |
|-------|------------|
| `pages/index.tsx` | `app/page.tsx` |
| `getStaticProps` | `fetch` with default cache or `use cache` |
| `getServerSideProps` | `fetch({ cache: 'no-store' })` or `cookies()` |
| `pages/api/users.ts` | `app/api/users/route.ts` |

**Thoughts:** Cannot serve the same URL from both routers. Coexist during migration on **different paths** only.

**Sources:** [nextjs.org/docs/app/guides/migrating](https://nextjs.org/docs/app/guides/migrating)

</details>

<details>
  <summary>Server vs Client Components?</summary>

### Server vs Client Components?

**Definition:** App Router components are **Server Components by default**. `"use client"` opts into client-side hydration for interactivity.

| | Server Component | Client Component |
|---|------------------|------------------|
| **Runs on** | Server only | Server (SSR) + browser (hydration) |
| **JS shipped** | None for component logic | Yes — bundle included |
| **Can use** | `async/await`, DB, secrets | `useState`, `useEffect`, events |
| **Cannot use** | Hooks, `onClick`, browser APIs | Direct `fs`, server secrets |
| **Props** | Receives serializable props | Receives serializable props |

| Pros | Cons |
|------|------|
| Smaller client bundles | No interactivity without Client leaves |
| Secrets safe on server | Serialization limits props |
| Data fetching without waterfalls | Debugging needs server logs |

**When to use Server:** Data fetch, layouts, static content, passing data to interactive leaves.

**When to use Client:** Buttons, forms with instant validation, charts, `useEffect`, browser APIs.

**Example — composition pattern:**

```tsx
// app/posts/page.tsx — Server (no directive)
export default async function PostsPage() {
  const posts = await getPosts();
  return posts.map(p => <PostCard key={p.id} post={p} />);
}

// post-card.tsx
'use client';
export function PostCard({ post }: { post: { id: string; title: string } }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{post.title}</button>;
}
```

**Thoughts:** Push `"use client"` to **leaves**, not page roots. Importing a Client Component into a Server Component works; the reverse does not.

**Sources:** [nextjs.org/docs/app/getting-started/server-and-client-components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

</details>

<details>
  <summary>Next.js caching mental model?</summary>

### Next.js caching mental model?

**Definition:** Four cache layers — interview answer should name each, what it stores, and how to invalidate after mutations.

| Layer | Stores | Cleared by |
|-------|--------|------------|
| Request memoization | Deduped fetch per render | New request |
| Data Cache | `fetch` / `use cache` results | `revalidateTag`, TTL |
| Full Route Cache | HTML + RSC payload | `revalidatePath`, `revalidateTag` |
| Router Cache | Client navigation RSC payload | `router.refresh()`, reload |

| `fetch` option | Behavior |
|----------------|----------|
| Default (`force-cache`) | Static — cached until invalidated |
| `cache: 'no-store'` | Dynamic every request |
| `next: { revalidate: 60 }` | ISR — refresh after 60s |
| `next: { tags: ['x'] }` | Tag for `revalidateTag('x', 'max')` |

| Pros | Cons |
|------|------|
| Huge perf for read-heavy apps | #1 bug: stale UI after mutation |
| Request dedup prevents double DB hits | Router Cache surprises after `revalidatePath` |

**When to use:**

- Public catalog → default cache + tags
- User dashboard → `no-store` or `use cache: private`
- After mutation → `revalidateTag` + `revalidatePath` in Server Action

**Examples:**

```tsx
'use server';
export async function updateProduct(id: string) {
  await db.product.update({ where: { id }, data: {} });
  revalidateTag(`product-${id}`, 'max');
  revalidatePath('/products');
}
```

**Thoughts:** `cookies()` opts route dynamic. `unstable_noStore()` / `connection()` escape static cache. Next.js 16: prefer `use cache` + `cacheTag` over blanket `force-dynamic`.

**Sources:** [nextjs.org/docs/app/guides/caching](https://nextjs.org/docs/app/guides/caching)

</details>

<details>
  <summary>Server Actions vs Route Handlers?</summary>

### Server Actions vs Route Handlers?

**Definition:** Two server mutation patterns — Actions are RPC for your app; Route Handlers are real HTTP endpoints.

| | Server Actions | Route Handlers |
|---|----------------|----------------|
| **File** | `'use server'` function or file | `route.ts` |
| **Invocation** | `<form action>`, import in Client | `fetch('/api/...')` |
| **Protocol** | POST with encrypted action ID | GET, POST, PUT, PATCH, DELETE |
| **Consumers** | Next.js app only | Any HTTP client |
| **CSRF** | Built-in Origin check | You implement |
| **Progressive enhancement** | Yes — works without JS | No |

| Pros | Cons |
|------|------|
| Actions — colocated, type-safe mutations | Not a public API |
| Handlers — webhooks, mobile, third parties | No form progressive enhancement |
| Actions — built-in CSRF for same-origin | Actions POST-only under the hood |

**When to use Actions:** Form submits, in-app mutations, optimistic UI with `useActionState`.

**When to use Route Handlers:** Stripe webhooks, public REST API, OAuth callbacks, mobile app backend.

**Examples:**

```tsx
// Server Action — internal mutation
'use server';
export async function createTodo(fd: FormData) {
  await db.todo.create({ data: { title: String(fd.get('title')) } });
  revalidatePath('/todos');
}

// Route Handler — external webhook
export async function POST(req: Request) {
  const event = await req.json();
  await processWebhook(event);
  return Response.json({ ok: true });
}
```

**Thoughts:** Never expose Server Actions as a substitute for a public API. Always validate auth in both — built-in CSRF ≠ authorization.

**Sources:** [nextjs.org/docs/app/getting-started/route-handlers](https://nextjs.org/docs/app/getting-started/route-handlers)

</details>

---

## Coding tasks

<details>
  <summary>Task 1 — Fix stale cached page</summary>

### Task 1 — Fix stale cached page

**Definition:** Practice scenario — product list stays stale after admin mutation because server cache was not invalidated.

**Scenario:** `/products` uses cached `fetch` or `use cache`. Admin updates a product via Server Action but the public list still shows old data after redirect.

| Symptom | Likely cause |
|---------|--------------|
| Old data after mutation | Missing `revalidatePath` / `revalidateTag` |
| Old data only on client nav | Router Cache — add `router.refresh()` |
| Always stale | `revalidate` too high or cache never tagged |

**What to add:**

1. Tag the fetch: `next: { tags: ['products'] }` or `cacheTag('products')` in `use cache`
2. In the Server Action after DB write:

```tsx
'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function updateProduct(id: string, formData: FormData) {
  await db.product.update({ where: { id }, data: { /* ... */ } });
  revalidateTag('products', 'max');      // Data Cache
  revalidateTag(`product-${id}`, 'max'); // per-item tag
  revalidatePath('/products');           // Full Route Cache
}
```

3. If Client Component still shows stale list after nav: `router.refresh()` after action success.

<details>
  <summary>Answer</summary>

**Root cause:** Mutation updated the database but **Data Cache** and/or **Full Route Cache** still serve the old render.

**Fix:** Call `revalidateTag('products', 'max')` and `revalidatePath('/products')` in the Server Action immediately after the DB write. Ensure the read path uses matching tags. Alternative: lower `revalidate` interval — worse for perf, acceptable for low-traffic admin.

**Follow-up interview points:** Name all four cache layers; explain why `revalidatePath` alone may not update Router Cache on client navigation.

**Sources:** [nextjs.org/docs/app/api-reference/functions/revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)

</details>

</details>

<details>
  <summary>Task 2 — Server Action form</summary>

### Task 2 — Server Action form

**Definition:** Practice scenario — progressive enhancement form that submits via Server Action without client-side `fetch`.

**Scenario:** Build a todo form that works with JavaScript disabled — browser native submit, server mutation, updated list on redirect/render.

| Requirement | Implementation |
|-------------|----------------|
| No `onSubmit` / client `fetch` | `<form action={addTodo}>` |
| Server mutation | `'use server'` function |
| Fresh list after add | `revalidatePath('/todos')` |
| Validation | Check `formData` in action; return errors via `useActionState` (optional) |

**Examples:**

```tsx
// actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function addTodo(formData: FormData) {
  const title = formData.get('title');
  if (!title || String(title).trim().length === 0) {
    return { error: 'Title required' };
  }
  await db.todo.create({ data: { title: String(title).trim() } });
  revalidatePath('/todos');
}

// page.tsx — Server Component
import { addTodo } from './actions';

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

Use `<form action={addTodo}>` where `addTodo` is a Server Action (`'use server'`). The browser performs a native POST; Next.js invokes the action on the server, runs `revalidatePath`, and re-renders the route — **no `onSubmit`, no client `fetch`**.

**Bonus:** Wrap with `useActionState` in a Client Component for inline error display while keeping progressive enhancement.

**Security note:** Validate and authorize inside the action — CSRF is handled for same-origin posts, but auth is not automatic.

**Sources:** [nextjs.org/docs/app/getting-started/mutating-data](https://nextjs.org/docs/app/getting-started/mutating-data)

</details>

</details>

<details>
  <summary>Task 3 — loading.tsx vs Suspense</summary>

### Task 3 — loading.tsx vs Suspense

**Definition:** Practice scenario — choosing between route-level and component-level loading boundaries for streaming.

**Scenario:** Dashboard page has a fast header and a slow analytics widget. Full-page spinner feels sluggish; you want the header immediately.

| Tool | Scope | Triggers on |
|------|-------|-------------|
| `loading.tsx` | Entire route segment | Client navigation to that segment |
| `<Suspense fallback>` | Wrapped subtree only | That async child suspending |

| Pros (`loading.tsx`) | Pros (`<Suspense>`) |
|----------------------|---------------------|
| Zero boilerplate per route | Granular — fast + slow regions on same page |
| Instant skeleton on navigation | Multiple boundaries per page |
| Works with `app/router` prefetch | Compose with Server Component children |

**Examples:**

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { Analytics } from './analytics'; // async Server Component

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

Use **`loading.tsx`** when the **whole route segment** should show a fallback during client navigation (e.g. navigating from `/` to `/dashboard`).

Use **inline `<Suspense>`** when only **part** of the page is slow — header renders immediately, analytics streams in when ready. You can combine both: `loading.tsx` for route transitions, Suspense for intra-page streaming.

**Interview follow-up:** Both use React Suspense under the hood; `loading.tsx` is a file convention that auto-wraps `page.tsx`.

**Sources:** [nextjs.org/docs/app/api-reference/file-conventions/loading](https://nextjs.org/docs/app/api-reference/file-conventions/loading)

</details>

</details>

---
