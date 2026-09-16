# HTML — Performance

Script loading, resource hints, Core Web Vitals, and FOUC.

[← Back to hub](./1_html.md)

### Related docs

* [HTML — Structure](./1_html_structure.md) · [HTML — Forms](./1_html_forms.md) · [HTML — Media](./1_html_media.md) · [HTML — Rendering](./1_html_rendering.md) · [HTML — Performance](./1_html_performance.md) · [HTML — Accessibility](./1_html_a11y.md) · [HTML — SEO](./1_html_seo.md) · [HTML — Advanced](./1_html_advanced.md) · [HTML — Interview](./1_html_interview.md)

### Sections

- [Performance & resource loading](#performance-resource-loading)

---

## Performance & resource loading

<details>
  <summary>async vs defer vs module</summary>

### async vs defer vs module

**Definition:**

Script loading attributes control when JavaScript downloads and executes relative to HTML parsing.

| Attribute | Download | Execute | Order |
|-----------|----------|---------|-------|
| (none) | Blocks parser | Immediately | Sequential |
| `defer` | Parallel | After parse | Preserved |
| `async` | Parallel | When ready | Not guaranteed |
| `type="module"` | Parallel | After parse | Preserved; strict mode |

**How it works:**

- Default `<script>` blocks HTML parse during download + execute.
- `defer` — parallel download, execute in order after parse.
- `async` — parallel download, execute when ready (unordered).
- `type="module"` — deferred, strict, `import`/`export`.

| Attribute | Order | Blocks parse? |
|-----------|-------|---------------|
| `defer` | Preserved | No (execute after parse) |
| `async` | Not guaranteed | At execute time |
| `module` | Preserved | No |

**When to use:**

App bundle → `defer` · analytics → `async` · ES app → `module`.

#### Common pitfalls

- Two `async` scripts with dependencies.
- Module scripts need CORS on cross-origin `src`.
- Inline script assuming deferred external already ran.

**Examples:**

```html
<script src="app.js" defer></script>
<script src="analytics.js" async></script>
<script type="module" src="app.mjs"></script>
```

**Thoughts:** Full script loading guide → [3_js_browser.md](./3_js_browser.md).

**Sources:** [MDN — Script loading](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)

</details>

<details>
  <summary>Page load optimization (HTML-level)</summary>

### Page load optimization (HTML-level)

**Definition:**

HTML-level optimizations reduce transfer size, prevent layout shift, and avoid parser-blocking resources.

| Technique | Benefit |
|-----------|---------|
| `srcset` / modern formats | Smaller images |
| `width`/`height` on images | Prevent CLS |
| `defer` / `module` scripts | Non-blocking JS |
| Resource hints | Faster critical resources |

**How it works:**

- Minimize render-blocking resources in critical path.
- Preload LCP assets; lazy-load below-fold images.
- `defer`/`module` for app scripts; `async` for independent tags.

| Technique | Benefit |
|-----------|--------|
| `srcset`/modern formats | Smaller images |
| `defer` scripts | Non-blocking JS |
| Resource hints | Faster critical fetch |

**When to use:**

Landing page LCP · blog with many images · third-party script budgeting.

#### Common pitfalls

- Preloading too many assets.
- Render-blocking CSS at bottom.
- Third-party scripts without `async`/`defer`.

**Examples:**

```html
<link rel="preconnect" href="https://cdn.example.com" />
<img src="photo.webp" alt="Photo" width="600" height="400" loading="lazy" />
<script src="/app.js" defer></script>
```

**Sources:** [web.dev — Performance](https://web.dev/explore/performance)

</details>

<details>
  <summary>Core Web Vitals — HTML developer impact</summary>

### Core Web Vitals — HTML developer impact

**Definition:**

Core Web Vitals measure real-user experience. HTML choices directly affect LCP, INP, and CLS.

| Metric | What it measures | HTML levers |
|--------|------------------|-------------|
| **LCP** | Largest visible element render | `fetchpriority`, `preload`, `width`/`height` |
| **INP** | Input responsiveness | Semantic `<button>`, defer non-critical JS |
| **CLS** | Visual stability | Image dimensions, reserved embed space — [CLS](#cls-cumulative-layout-shift) |

**How it works:**

- **LCP** — largest visible paint (hero image/text).
- **INP** — time to next paint after click/tap/key (not only input delay). Full notes: [6_web_api.md — INP](./6_web_api_security.md#inp-interaction-to-next-paint).
- **CLS** — unexpected layout shift (max session window, not a lifetime sum). Full notes: [CLS](#cls-cumulative-layout-shift).
- **TTFB** — time to first byte; diagnostic for server/CDN, **not** a current Core Web Vital. Full notes: [6_web_api.md — TTFB](./6_web_api_security.md#ttfb-time-to-first-byte).
- **FCP** — first content paint (text/image/SVG/canvas); supporting vital, not ranking. Full notes: [6_web_api.md](./6_web_api_security.md#first-contentful-paint-fcp).
- HTML levers: dimensions, `fetchpriority`, script loading, semantic buttons.

**When to use:**

Optimize hero for LCP · reserve ad/embed space for CLS · use `<button>` for INP.

#### Common pitfalls

- Lazy-loading LCP image.
- Injecting content above existing without reserved space.
- `<div onclick>` instead of `<button>`.

**Examples:**

```html
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />
<img src="/hero.webp" alt="Hero" width="1200" height="630" fetchpriority="high" />
```

**Thoughts:** Core Web Vitals are **LCP, INP, CLS**. TTFB and FCP explain a slow first paint / LCP; they are not Core Vitals.

**See also:** Measure / lab vs field / RUM → [6_web_api.md — Core Web Vitals](./6_web_api_security.md#core-web-vitals). LCP sub-parts → [6_web_api.md — LCP](./6_web_api_security.md#lcp-largest-contentful-paint). INP → [6_web_api.md](./6_web_api_security.md#inp-interaction-to-next-paint). TTFB → [6_web_api.md](./6_web_api_security.md#ttfb-time-to-first-byte). FCP → [6_web_api.md](./6_web_api_security.md#first-contentful-paint-fcp). Next.js levers → [4_nextjs.md](./4_nextjs_platform.md#core-web-vitals-on-vercel).

**Sources:** [web.dev — Vitals](https://web.dev/articles/vitals)

</details>

<details>
  <summary>CLS (Cumulative Layout Shift)</summary>

### CLS (Cumulative Layout Shift)

**Definition:** CLS is the Core Web Vital for visual stability: how much already-visible content unexpectedly moves during (and after) load. Good **≤ 0.1**, needs improvement **0.1–0.25**, poor **> 0.25** (75th percentile).

**How it works:**

- A **layout shift** is recorded when a visible element changes position between frames without a user-driven reason. Classic case: you aim at “Buy”, a banner loads above, content jumps, you tap “Cancel”.
- Score of one shift: **impact fraction × distance fraction** — viewport share that shifted × how far it moved (as a viewport fraction). Bigger area + longer travel = worse.
- Shifts group into **session windows**: a new window starts if the gap between shifts is **≥ 1s**; a window lasts at most **5s**. Page CLS is the **worst window**, not the sum of every shift on a long-lived tab.
- **Expected** shifts are excluded: discrete input (click/tap) has a **500ms** grace (`hadRecentInput`). Continuous gestures (scroll, pinch) do **not** get that exclusion.
- Lab (Lighthouse) ≠ field (CrUX). Debug: DevTools **Performance → Layout Shifts**. Measurement / RUM: [6_web_api.md — Core Web Vitals](./6_web_api_security.md#core-web-vitals).

- Images/video without `width`/`height` (or CSS `aspect-ratio`) — laid out as empty, then neighbors jump when the file arrives.
- Ads, widgets, iframes with unknown height, especially async.
- Inserts **above** already-visible content: cookie banners, recommendation rails, error toasts at render. Same-size insert near the **top** of the viewport scores worse than one near the bottom.
- Web fonts: fallback metrics ≠ custom metrics → reflow. **FOIT** (text hidden until the font loads) vs **FOUT** (fallback text, then swap). CSS: [Font loading](./2_css_visual.md#font-loading).
- Animating `top` / `left` / `margin` / `width` instead of `transform` — layout recalc can move siblings. CSS: [transform](./2_css_motion.md#transform).

- Always a generic fallback: `"Google Sans", sans-serif` — never a lone custom family (browser-default metrics diverge more).
- Match fallback to the webfont with `@font-face` **`size-adjust`**, `ascent-override`, `descent-override`, `line-gap-override`.
- Preload critical fonts (`<link rel="preload" as="font" … crossorigin>`). Prefer **WOFF2**, variable fonts, `unicode-range` subsets (Cyrillic-only download for Cyrillic text).
- `next/font` self-hosts (no Google CDN hop) and tunes fallback `size-adjust`.

```tsx
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={geist.className}>
      <body>{children}</body>
    </html>
  );
}
```

- Container `min-height` or `aspect-ratio` for the **likely** slot; media queries for breakpoint sizes. `<iframe width height>` when known.
- Cookie banners: reserve the slot (or overlay). On mobile they can also become the **LCP** element. `preconnect` / `dns-prefetch` if third-party.
- Do not inject above the viewport without a user gesture. Prefer below-the-fold, overlay, or a fixed-size slot.
- Infinite feed: swap inside a **fixed-size** carousel; prefetch **before** the user reaches the end (500ms post-interaction exclusion); or **“Load more”** so the change is expected.

animate `transform` (`translate` / `scale` / `rotate`) and `opacity`. Those run after layout.

back/forward cache restores the whole page instantly; LCP/FCP/CLS on that navigation are often ~0. web.dev: ~**10%** of desktop and ~**20%** of mobile navigations are back/forward. Common blockers: `unload` (use `pagehide`) and `Cache-Control: no-store`. DevTools → Application → Back/forward cache → Test. [11_vsc_browser.md](./11_vsc_browser.md#devtools--core-web-vitals).

**When to use:**

Late media, third-party embeds, consent UI, infinite scroll, custom fonts.

#### Common pitfalls

- Treating CLS as a sum of all shifts (it is the **max session window**).
- Counting shifts after a click as unexpected (500ms exclusion).
- In-flow cookie bar on mobile (CLS **and** LCP).
- `font-family` without a generic fallback; `font-display: block` FOIT.
- Auto-appending infinite-scroll items in view without reserved space.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Stable tap targets, fewer misclicks | Cookie/ad slots must exist before first paint |
| Reserving space is cheaper than chasing a bad field score | Overlay vs in-flow: overlays avoid CLS but can hide LCP/content |

**Examples:**

```html
<img src="cat.jpg" alt="Cat" width="800" height="600" />
<style>
  img {
    height: auto;
    width: 100%;
  }
</style>
```

`srcset` / `<picture>`: keep the **same aspect ratio** across candidates; set `width`/`height` on `<img>` (and on `<source>` in modern browsers). Next.js `<Image>` requires `width`+`height` or `fill`; static import fills dimensions. Framework notes: [4_nextjs.md](./4_nextjs_platform.md#core-web-vitals-on-vercel).

**Thoughts:** Reserve space **before** late content arrives; do not shove new boxes into the current viewport unless the user just asked for them.

**Sources:** [web.dev — CLS](https://web.dev/articles/cls) · [web.dev — Optimize CLS](https://web.dev/articles/optimize-cls) · [web.dev — Vitals](https://web.dev/articles/vitals) · [Next.js fonts](https://nextjs.org/docs/app/getting-started/fonts) · [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image)

</details>

<details>
  <summary>Flash of Unstyled Content (FOUC)</summary>

### Flash of Unstyled Content (FOUC)

**Definition:**

FOUC occurs when HTML renders before CSS is applied. Keep critical CSS in `<head>` — render-blocking CSS is intentional.

| Strategy | Effect |
|----------|--------|
| CSS in `<head>` | Styles apply before first paint |
| Inline critical CSS | Fast above-fold paint |
| `font-display: swap` | Control font FOUC (CSS) |

**How it works:**

- HTML may paint before CSS applied → unstyled flash.
- Keep CSS in `<head>`; critical CSS can be inlined.
- `font-display` in CSS controls font FOUC.

| Strategy | Effect |
|----------|--------|
| CSS in `<head>` | Styles before first paint |
| Inline critical CSS | Fast above-fold |

**When to use:**

Slow CSS CDN · web fonts · CSS loaded via JS (anti-pattern).

#### Common pitfalls

- `@import` chains delaying CSS.
- Hiding body with `opacity:0` until load (bad for LCP).
- Loading styles at end of body.

**Examples:**

```html
<head>
  <link rel="stylesheet" href="/app.css" />
  <link rel="preload" href="/app.css" as="style" />
</head>
```

**Thoughts:** `font-display` and critical CSS → [2_css.md](./2_css.md).

**Sources:** [MDN — FOUC](https://developer.mozilla.org/en-US/docs/Glossary/FOUC)

</details>

<details>
  <summary>Caching (historical note: ApplicationCache)</summary>

### Caching (historical note: ApplicationCache)

**Definition:**

ApplicationCache (appcache) was an HTML5 offline API — deprecated and removed. Use Service Workers and HTTP cache headers instead.

| Approach | Status |
|----------|--------|
| ApplicationCache | Deprecated |
| Service Workers | Modern programmatic caching |
| HTTP `Cache-Control` | Standard asset caching |

**How it works:**

- ApplicationCache (appcache) — removed; do not use.
- Modern: Service Workers + HTTP `Cache-Control`.
- `<link rel="manifest">` for PWA install metadata.

| Approach | Status |
|----------|--------|
| ApplicationCache | Deprecated |
| Service Workers | Modern |
| HTTP cache | Standard |

**When to use:**

Static asset caching (HTTP headers) · offline SPA (Service Worker).

#### Common pitfalls

- Copying appcache examples from old tutorials.
- No cache busting on deployed HTML.
- Confusing browser cache with CDN edge cache.

**Examples:**

```html
<!-- Modern: link manifest for PWA, HTTP headers for caching -->
<link rel="manifest" href="/manifest.webmanifest" />
```

**Sources:** [MDN — HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)

</details>

---

<a name="accessibility"></a>
