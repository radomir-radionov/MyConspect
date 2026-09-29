# Next.js — Core

Framework model and design principles.

[← Back to hub](./4_nextjs.md)

### Related docs

- [Next.js — Core](./4_nextjs_core.md) · [Next.js — Rendering](./4_nextjs_rendering.md) · [Next.js — Data](./4_nextjs_data.md) · [Next.js — Routing](./4_nextjs_routing.md) · [Next.js — Optimizations](./4_nextjs_optimizations.md) · [Next.js — Platform](./4_nextjs_platform.md) · [Next.js — Interview](./4_nextjs_interview.md)

### Sections

- [1. Framework overview](#1-framework-overview)
- [2. Design principles](#2-design-principles)

---

## 1. Framework overview

_Topics follow: Definition → Pros / Cons → When to use → Example → Notes → Source ([template](#topic-template))._

<details>
  <summary>Next.js overview</summary>

### Next.js overview

**Definition:** Next.js is a **React framework** for building full-stack web applications. You build the UI with React components; Next.js adds routing, rendering, data fetching, and production tooling — bundlers and compilers configured so you focus on the product, not the stack.

**When to use:**

- Marketing sites, blogs, and documentation with SEO requirements
- E-commerce, dashboards, and SaaS with authenticated and public pages
- BFF (Backend for Frontend) — colocate API with UI
- Teams deploying on Vercel or needing standalone Docker output
- Apps benefiting from RSC (smaller client bundles, server data access)

**When not to use:**

- Pure static sites with minimal JS — consider **Astro**
- Mobile apps — use **Expo / React Native**
- Heavy custom Node server (long-lived WebSockets hub) — dedicated backend + Vite SPA may fit better
- Content-only sites where React is unnecessary overhead

**Pluses and minuses:**

| +                                                               | −                                                                    |
| --------------------------------------------------------------- | -------------------------------------------------------------------- |
| Batteries-included: routing, SSR, API, image/font optimization  | Opinionated — escape hatches exist but add complexity                |
| React Server Components + streaming out of the box (App Router) | Steep caching mental model; easy to ship stale or over-dynamic pages |
| Excellent Vercel integration (preview deploys, CDN, analytics)  | Vendor affinity when using Vercel-specific features                  |
| SEO-friendly by default (SSR/SSG/ISR/PPR)                       | Cold starts on serverless; not ideal for all workloads               |
| TypeScript-first, large ecosystem, strong hiring signal         | Two routers (App + Pages) — legacy codebases carry migration debt    |
| Automatic code splitting per route                              | Build times grow with app size                                       |

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

**Thoughts:** Next.js is **not** a replacement for React knowledge — it is a layer on top. Interview framing: React = library (view); Next.js = framework (routing, rendering, data, deployment). New projects should default to **App Router** (Next.js 13+). Pages Router is maintenance mode for existing apps.

**Sources:** [nextjs.org/docs](https://nextjs.org/docs)

</details>

<details>
  <summary>React vs Next.js</summary>

### React vs Next.js

**Definition:**

React renders UI; Next.js orchestrates how and where that UI is built, cached, and delivered.

|                   | React                     | Next.js                                          |
| ----------------- | ------------------------- | ------------------------------------------------ |
| **Role**          | UI library                | Full-stack framework                             |
| **Routing**       | Bring your own            | File-based `app/` directory                      |
| **Data fetching** | Client hooks / manual SSR | Server Components, `fetch` cache, Server Actions |
| **Rendering**     | CSR by default (Vite)     | SSR, SSG, ISR, PPR configurable per route        |
| **API**           | Separate backend          | Route Handlers + Server Actions                  |
| **Deployment**    | Static CDN or custom      | Optimized for Vercel; `standalone` for Docker    |

**Thoughts:** For generic RSC, hydration, and hook rules see [4_react.md §8 — Server rendering & RSC](./4_react_server.md#8-server-rendering--rsc). Rendering strategies (SSR, SSG, ISR, PPR): [Next.js — Rendering](./4_nextjs_rendering.md). Caching semantics: [Next.js — Data](./4_nextjs_data.md).

**Sources:** [react.dev](https://react.dev/) · [nextjs.org/docs](https://nextjs.org/docs)

</details>

<details>
  <summary>Next.js vs alternatives</summary>

### Next.js vs alternatives

**Definition:**

Comparison of Next.js against other full-stack and meta-framework choices for React and content sites.

| Framework               | Strength                                 | Trade-off                                  |
| ----------------------- | ---------------------------------------- | ------------------------------------------ |
| **Vite + React Router** | Maximum flexibility, fast dev, SPA-first | Manual SSR/RSC setup                       |
| **Remix**               | Web standards, loaders/actions, forms    | Smaller ecosystem than Next                |
| **Astro**               | Content sites, islands architecture      | Less suited for heavy client interactivity |
| **SvelteKit**           | Performance, simplicity                  | Different UI paradigm                      |

**How it works:** SEO, first-load performance, colocated server logic, team standardization on Vercel.

**Sources:** [nextjs.org/docs/app](https://nextjs.org/docs/app)

</details>

<details>
  <summary>History (compressed)</summary>

### History (compressed)

**Definition:**

Timeline of major Next.js releases and routing/rendering milestones.

| Version  | Milestone                                                      |
| -------- | -------------------------------------------------------------- |
| **2016** | Next.js 1 — Pages Router, SSR                                  |
| **v9**   | API Routes (`pages/api`)                                       |
| **v12**  | Middleware, React 18 support                                   |
| **v13**  | App Router (beta), RSC, `app/` directory                       |
| **v14**  | App Router stable, partial prerendering experimental           |
| **v15**  | Async request APIs (`cookies`, `headers`, `params`)            |
| **v16**  | Cache Components, `proxy.ts`, `use cache`, async APIs required |

---

**Sources:** [nextjs.org/blog](https://nextjs.org/blog)

</details>

<a name="2-app-vs-pages-router"></a>

### Topic template

Every major topic in `<details>` sections follows:

**Definition** → **How it works** → **When to use** → **Pluses and minuses** → **Examples** → **Thoughts** → **Sources**

---

<a name="1-framework-overview"></a>

### Primary references

**Definition:**

Official documentation and platform guides for Next.js and Vercel.

- [nextjs.org/docs](https://nextjs.org/docs) — official documentation
- [nextjs.org/docs/llms.txt](https://nextjs.org/docs/llms.txt) — full docs index for LLMs
- [Vercel Next.js framework guide](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Partial Prerendering on Vercel](https://vercel.com/docs/partial-prerendering)
- [Vercel Runtime Cache](https://vercel.com/docs/caching/runtime-cache)
- [Vercel Routing Middleware](https://vercel.com/docs/routing-middleware)

**Sources:** [nextjs.org/docs](https://nextjs.org/docs)

</details>

## 2. Design principles

<details>
  <summary>SOLID in Next.js</summary>

### SOLID in Next.js

**Definition:** The five **SOLID** principles applied to **Next.js modules, Server/Client components, Route Handlers, and `lib/` helpers** — not only `class`.

| Principle                     | Meaning                         | Next.js example                                                                                |
| ----------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| **S** — Single Responsibility | One reason to change per module | `page.tsx` composes · `queries.ts` reads · `actions.ts` mutates                                |
| **O** — Open/Closed           | Extend via new code, not edits  | Add `applePay` provider — don't edit `checkout()` for every payment type                       |
| **L** — Liskov Substitution   | Subtypes honor parent contract  | Shared layout/page props work for every variant — no sneaky client-only fields on server types |
| **I** — Interface Segregation | Small focused APIs              | Pass `{ readUser }` — not the whole DB client when only reads are needed                       |
| **D** — Dependency Inversion  | Depend on abstractions          | `placeOrder(input, store)` — inject repository; test with a fake `store`                       |

**How it works:**

Each letter matches the **Examples** below — look for `// good` and `// bad`:

1. **S** — split `page.tsx`, `queries.ts`, `actions.ts` — not one file that fetches, validates, emails, and renders.
2. **O** — new payment provider = new function in a map — not a new `if` in `checkout()`.
3. **L** — any layout wrapper must accept the same `children` contract — no variant that breaks streaming or RSC rules.
4. **I** — `loadCheckout()` takes `{ readCart }` — not the entire `db` module.
5. **D** — domain in `lib/` receives `store` / `fetch` — Route Handler wires concrete adapters.

**When to use:** Refactoring fat `page.tsx` files; plugin-style providers (auth, payments, CMS); code review for new App Router features.

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

**Thoughts:** SOLID is a **guide**, not a law — a one-off marketing page does not need five interfaces. Apply when change pain or test pain appears. React mapping: [SOLID in React](./4_react_core.md#solid-in-react). Express mapping: [SOLID in Express](./8_nodejs_http.md#solid-in-express) · [SOLID in TypeScript](./5_ts_objects.md#solid-in-typescript). Full reference: [OOP & SOLID](./7_special_engineering.md#solid-overview).

**Sources:** [freecodecamp — SOLID](https://www.freecodecamp.org/news/solid-principles-single-responsibility-principle-explained/) · [SOLID (overview)](./7_special_engineering.md#solid-overview) · [JS — SOLID in Classes](./3_js_core.md#solid-in-classes) · [JS — SOLID in Functions](./3_js_core.md#solid-in-functions) · [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Express](./8_nodejs_http.md#solid-in-express) · [SOLID in TypeScript](./5_ts_objects.md#solid-in-typescript)

</details>
