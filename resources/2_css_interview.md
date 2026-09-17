# CSS — Interview

Interview Q&A and quick-fix cases.

[← Back to hub](./2_css.md)

### Related docs

* [CSS — Fundamentals](./2_css_core.md) · [CSS — Layout](./2_css_layout.md) · [CSS — Visual](./2_css_visual.md) · [CSS — Motion](./2_css_motion.md) · [CSS — Modern](./2_css_modern.md) · [CSS — Architecture](./2_css_architecture.md) · [CSS — Interview](./2_css_interview.md)

### Sections

- [Questions & Answers](#questions-answers)
- [Quick fixes (cases)](#quick-fixes-cases)

---

## Questions & Answers

<details>
  <summary>What is the CSS box model?</summary>

### What is the CSS box model?

**Definition:** Content → padding → border → margin. `width`/`height` default to content box; `box-sizing: border-box` includes padding and border. Vertical margins collapse between block siblings.

</details>

<details>
  <summary>How do you center content horizontally and vertically?</summary>

### How do you center content horizontally and vertically?

**Definition:** Flexbox (`justify-content` + `align-items`), Grid (`place-items: center`), or `margin-inline: auto` for horizontal block centering. Absolute + `transform: translate(-50%, -50%)` when out of flow.

</details>

<details>
  <summary>Layout approaches: float, flex, grid?</summary>

### Layout approaches: float, flex, grid?

**Definition:** Float — legacy, text wrap / old columns. Flexbox — 1D component layout. Grid — 2D page/card matrices. Modern apps: Grid shell + Flex internals.

</details>

<details>
  <summary>How do you make an app responsive?</summary>

### How do you make an app responsive?

**Definition:** Mobile-first CSS, fluid units (`%`, `fr`, `clamp`, `rem`), Flexbox/Grid, media queries, container queries for components, responsive images (`srcset`), test real devices.

</details>

<details>
  <summary>Why vendor prefixes? How to simplify cross-browser CSS?</summary>

### Why vendor prefixes? How to simplify cross-browser CSS?

**Definition:** Prefixes (`-webkit-`) were for experimental features. Today: Autoprefixer + Browserslist, check caniuse.com, progressive enhancement, `@supports` feature queries.

</details>

<details>
  <summary>CSS preprocessors — what do they add?</summary>

### CSS preprocessors — what do they add?

**Definition:** Variables, nesting, mixins, functions, partial imports. Compile to CSS. Much nesting/variables now native; Sass still valuable for mixins and token tooling.

</details>

<details>
  <summary>CSS custom properties — use cases?</summary>

### CSS custom properties — use cases?

**Definition:** Theming (light/dark), component tokens, runtime updates from JS, scoping per component, `var()` with fallbacks. Unlike Sass vars, they cascade in the browser.

</details>

<details>
  <summary>How does CSS Grid work?</summary>

### How does CSS Grid work?

**Definition:** Define columns/rows on container (`grid-template-*`), place items with `grid-column`/`grid-row`/`grid-area`. Use `fr`, `minmax`, `auto-fit`/`auto-fill`, `gap` for responsive grids without media queries.

</details>

<details>
  <summary>Track animation/transition end in JS?</summary>

### Track animation/transition end in JS?

**Definition:** `transitionend` (check `propertyName`) and `animationend` events on the element.

</details>

<details>
  <summary>GPU-accelerated properties and compositor layers?</summary>

### GPU-accelerated properties and compositor layers?

**Definition:** `transform`, `opacity`, `filter` often composite on GPU. Layers isolate repaints. Too many layers → memory pressure → mobile tab crashes. Avoid overusing `will-change`.

</details>

<details>
  <summary>When use translate() vs absolute positioning?</summary>

### When use translate() vs absolute positioning?

**Definition:** Animate with `transform: translate()` — no layout reflow, GPU-composited. Absolute `top`/`left` triggers layout and is slower for animation.

</details>

<details>
  <summary>display: none vs visibility: hidden?</summary>

### display: none vs visibility: hidden?

**Definition:** `display: none` — removed from layout and a11y tree. `visibility: hidden` — keeps space, not painted, still in a11y tree.

**How it works:**

- `display: none` — no box, no events, excluded from accessibility tree; children also hidden.
- `visibility: hidden` — box participates in layout; not painted; descendants can override with `visibility: visible`.
- `opacity: 0` — still in layout and a11y tree; receives pointer events unless `pointer-events: none`.

**When to use:** Hide modals off-screen → `display: none` or `hidden` attribute; preserve layout while loading → `visibility: hidden`; fade transitions → `opacity` + `pointer-events: none`.

</details>

<details>
  <summary>Specificity and !important?</summary>

### Specificity and !important?

**Definition:** Specificity tuple: inline > ID > class/pseudo-class/attribute > type. `:where()` = 0 specificity. `:is()` = highest arg. `!important` inversions within same origin. `@layer` controls cascade layers.

**How it works:**

- Specificity tuple `(a, b, c)`: inline styles, IDs, classes/attributes/pseudo-classes, types/pseudo-elements.
- Compare left to right; tie → later source order wins.
- `!important` flips importance within same origin — author `!important` beats author normal.
- `@layer` order beats specificity among layered author styles; unlayered beats layered.

**When to use:** Prefer low-specificity classes + `@layer` over IDs/`!important`; use `:where()` for resets; `:is(.a, #x)` inherits `#x` specificity — avoid accidental weight.

</details>

<details>
  <summary>vh/vw pitfalls?</summary>

### vh/vw pitfalls?

**Definition:** `100vh` on mobile includes browser chrome inconsistently — use `dvh`. Font sizes in `vw` alone scale poorly — use `clamp()`. Percentage heights need defined parent height.

**How it works:**

- `vh`/`vw` — relative to viewport size; `100vh` = full viewport height but mobile URL bar causes overflow jumps.
- `dvh`/`svh`/`lvh` — dynamic/small/large viewport units adapt to mobile chrome.
- `%` height requires explicit height on every ancestor — percentage resolves against containing block.

**When to use:** Full-screen hero → `min-height: 100dvh`; fluid type → `clamp(1rem, 2vw + 0.5rem, 2rem)` not raw `vw`; child `height: 100%` → set `html, body { height: 100% }` chain.

</details>

<details>
  <summary>Best units for font-size?</summary>

### Best units for font-size?

**Definition:** `rem` for global scale (root-relative). `em` for component-relative sizing. Avoid `px` for user-resizable root text.

**How it works:**

- `rem` — relative to root `font-size` (usually 16px); predictable, doesn't compound when nested.
- `em` — relative to **element's own** `font-size`; compounds in nested components.
- `px` — absolute; ignores user browser font-size settings unless root is in `px`.

**When to use:** Body/heading scale → `rem`; button padding relative to button text → `em`; borders/shadows → `px` is fine.

</details>

<details>
  <summary>Why avoid shorthand carelessly?</summary>

### Why avoid shorthand carelessly?

**Definition:** Shorthand resets omitted sub-properties (e.g. `background:` clears `background-image`). Use longhand when overriding single sub-properties.

**How it works:**

- Shorthand sets all sub-properties — omitted ones reset to initial values, not inherit.
- `background: #fff` wipes `background-image`, `background-position`, etc.
- `font: 400 1rem/1.5 sans-serif` resets `font-stretch`, `font-variant`, etc.

**When to use:** Override only `background-color` → use longhand; set full font stack once with shorthand on `body`, then longhand tweaks on children.

</details>

<details>
  <summary>CSS methodologies?</summary>

### CSS methodologies?

**Definition:** BEM (block__element--modifier), OOCSS, SMACSS, ITCSS. Goal: predictable specificity, reusable components, team consistency.

**How it works:**

- **BEM** — naming convention `block__element--modifier`; flat selectors, low specificity.
- **OOCSS** — separate structure (layout) from skin (theme); reuse base objects.
- **SMACSS** — categorize: base, layout, module, state, theme.
- **ITCSS** — inverted triangle: generics → elements → objects → components → utilities (increasing specificity).

**When to use:** Large teams → BEM or ITCSS; utility-heavy SPAs → Tailwind replaces much of BEM; CSS Modules scopes without verbose names.

</details>

<details>
  <summary>Progressive enhancement for limited browsers?</summary>

### Progressive enhancement for limited browsers?

**Definition:** Core content works without advanced CSS; `@supports` for enhancements; polyfills sparingly; test target browsers via Browserslist.

**How it works:**

- Base layout works with flexbox fallback or simple block flow.
- `@supports (display: grid)` wraps grid enhancements.
- Autoprefixer handles vendor prefixes from Browserslist — not manual sniffing.
- Feature detection, not browser detection (`user-agent` sniffing).

**When to use:** Grid layout with flex fallback; `backdrop-filter` glass effect behind solid fallback; container queries with media query fallback.

</details>

<details>
  <summary>position: sticky not working?</summary>

### position: sticky not working?

**Definition:** Check: ancestor `overflow: hidden/auto`, missing `top`/`bottom`, parent not scrollable, insufficient parent height, element not in scroll container.

**How it works:**

- `sticky` sticks within its **nearest scroll ancestor** while offset (`top`) is satisfied.
- Any ancestor with `overflow: hidden|auto|scroll` (not `visible`) becomes the scroll container — sticky may stick inside a small box instead of viewport.
- Sticky element needs room to scroll within parent — parent must be taller than sticky child.

**When to use:** Debug checklist: (1) set `top: 0`; (2) check ancestor `overflow`; (3) ensure scroll container has height; (4) no `display: table` parent quirks.

</details>

<details>
  <summary>Styling SVG?</summary>

### Styling SVG?

**Definition:** Use `fill`, `stroke`, `stroke-width`. `currentColor` inherits text color. Some HTML properties do not apply.

**How it works:**

- Inline SVG inherits CSS from the document; `fill`/`stroke` replace `background`/`border`.
- `currentColor` on `fill` or `stroke` syncs with `color` — easy theme integration.
- External SVG via `<img>` cannot be styled with CSS — use inline SVG or `mask-image`.

**When to use:** Icon systems → inline SVG + `fill: currentColor`; hover states via CSS on `.icon path`; sprites with `<symbol>` + `<use>`.

</details>

<details>
  <summary>px vs em vs rem?</summary>

### px vs em vs rem?

**Definition:**

Use `rem` for global typography and spacing; `em` for component-internal scaling (button padding relative to button font-size).

* **px** — absolute CSS pixels; fine for borders/shadows; poor for accessible root scaling
* **em** — relative to **element's** `font-size`; compounds when nested
* **rem** — relative to **root** `font-size`; predictable spacing/type scale

**How it works:** `px` is absolute CSS pixels; `em` compounds from parent `font-size`; `rem` always references `<html>` font-size — one source of truth for type/spacing scales.

**When to use:** Global typography → `rem`; component-internal padding → `em`; hairline borders → `px`.

</details>

<details>
  <summary>What happens with * { box-sizing: border-box; }?</summary>

### What happens with * { box-sizing: border-box; }?

**Definition:** Every element (and pseudo-elements if included) uses `border-box` sizing: `width`/`height` include padding and border. Prevents padding from blowing out fixed layouts. Standard reset pattern:

**How it works:** `border-box` includes padding and border in `width`/`height` — a 200px box with 20px padding stays 200px total, not 240px.

**When to use:** Universal reset on `*, *::before, *::after`; alternative: set on `html { box-sizing: border-box }` and `inherit` on children.

**Examples:**

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

Does not affect margin. Inherited by descendants if you set it on `html` instead of `*`.

</details>

<details>
  <summary>How do you adapt a page for print?</summary>

### How do you adapt a page for print?

**Definition:** Use `print` media query; avoid dark backgrounds; expand links if useful; control page breaks with `break-before` / `break-after`. Full conspect: **Print & Paged Media**.

**How it works:** `@media print` applies only when printing or PDF export; hide non-essential UI; force light backgrounds for ink savings; `break-*` controls pagination.

**When to use:** Hide nav/ads; expand `href` in links; set `12pt` body font; `break-inside: avoid` on figures/tables.

**Examples:**

```css
@media print {
  nav, .sidebar, .ads { display: none; }
  body { font-size: 12pt; color: #000; background: #fff; }
  a[href]::after { content: " (" attr(href) ")"; }
  .page-break { break-before: page; }
}
```

</details>

<details>
  <summary>How do you customize native form element styles?</summary>

### How do you customize native form element styles?

**Definition:**

Fully styling `<select>` still limited cross-browser — consider custom dropdown component for full control. Full conspect: **Form & Native Control Styling**.

* `appearance: none` — remove OS default chrome (then rebuild with CSS)
* `accent-color` — checkboxes, radios, range inputs
* `::placeholder` — placeholder text
* `::file-selector-button` — file input button
* `:focus-visible` — custom focus ring

**How it works:** `appearance: none` strips OS chrome — you rebuild borders/arrows; `accent-color` tints native controls; dropdown list styling remains OS-controlled.

**When to use:** Custom checkbox/radio with `appearance: none` + pseudo-elements; `<select>` closed state only — full control needs custom component with ARIA.

</details>

<details>
  <summary>What is progressive rendering?</summary>

### What is progressive rendering?

**Definition:**

Deliver content in stages so users see something fast — CSS/media techniques on top of the HTML critical path.

1. **Critical CSS** inlined for above-the-fold
2. **Async/defer** non-critical CSS
3. **`content-visibility: auto`** for below-fold sections
4. **Lazy-load** images/fonts
5. **Skeleton screens** while data loads

Goal: improve FCP/LCP without blocking render on the full CSS bundle.

**How it works:** Browser paints incrementally — critical CSS blocks first paint; deferring the rest and lazy content lets users see a shell faster.

**When to use:** Inline critical CSS for above-fold; async load rest; `content-visibility: auto` on long pages; skeleton placeholders.

**Thoughts:** Pipeline definition and interview answer → [1_html.md — Progressive rendering](./1_html_rendering.md#browser--rendering).

</details>

<details>
  <summary>Lazy-loading media on a page?</summary>

### Lazy-loading media on a page?

**Definition:** CSS-only background images: Intersection Observer in JS, or `content-visibility` for sections. Responsive images: `srcset` + `sizes`. Fonts: `font-display: swap`, subset fonts, preload only critical weights.

**How it works:** `loading="lazy"` defers off-screen image/iframe fetch until near viewport; `decoding="async"` avoids blocking main thread; fonts via `font-display: swap` + preload critical weights only.

**When to use:** Below-fold images; hero image `fetchpriority="high"` + no lazy; background images need `IntersectionObserver` or `content-visibility`.

**Examples:**

```html
<img src="photo.jpg" loading="lazy" decoding="async" alt="...">
<iframe loading="lazy" src="..."></iframe>
```

</details>

<details>
  <summary>How do you review and fix bad CSS?</summary>

### How do you review and fix bad CSS?

**Definition:**

Checklist for live coding / code review:.

1. **Specificity wars** — replace IDs/`!important` with simpler selectors or `@layer`
2. **Magic numbers** — use custom properties or spacing scale
3. **Float layouts** — migrate to flex/grid
4. **Missing `box-sizing`** — add border-box reset
5. **Non-responsive fixed widths** — use `max-width`, `clamp`, `minmax`
6. **Deep nesting** — flatten selectors; avoid `.a .b .c .d`
7. **Shorthand accidents** — longhand when overriding one sub-property
8. **Accessibility** — focus styles, contrast, `prefers-reduced-motion`

**How it works:** Interview code review tests whether you spot maintainability, performance, and a11y issues — not just "does it look right."

**When to use:** Live coding — narrate each fix; prefer `@layer` over `!important`; migrate floats to grid; add `min-width: 0` on flex text overflow.

</details>

<details>
  <summary>Faux bold and faux italic fonts?</summary>

### Faux bold and faux italic fonts?

**Definition:** When the browser synthesizes bold/italic because the exact font weight/style file is missing. Looks worse than real font files.

**How it works:**

Browser synthesizes bold/italic when the requested weight/style file is missing — slanted geometry, not true italic glyphs.

load the actual `font-weight` / `font-style` variants in `@font-face`, or use a variable font with full axis range. Avoid `font-weight: 700` if only `400` is loaded.

**When to use:** Load `font-weight: 400 700` range in variable font; or separate `@font-face` per weight; check DevTools → Computed → rendered font.

</details>

<details>
  <summary>Image formats that support animation?</summary>

### Image formats that support animation?

**Definition:**

CSS `animation` / `@keyframes` animates properties — not the same as animated image formats.

* **GIF** — legacy, 256 colors, large files
* **APNG** — PNG-based, better quality than GIF
* **WebP** — animated WebP, good compression
* **AVIF** — animated AVIF, best compression, growing support

**How it works:** Distinct from CSS `@keyframes` — these are raster/vector **file formats** with multiple frames. `<img>` or `<video>` displays them; CSS animates properties on elements, not file frames.

**When to use:** Short loops → WebP/APNG; best compression → AVIF; legacy email → GIF; complex motion → prefer `<video>` or Lottie.

</details>

<details>
  <summary>How do you reuse inline SVG icons?</summary>

### How do you reuse inline SVG icons?

**Definition:** Define once, reference with `<use>`:.

**How it works:** `<symbol>` defines geometry once; `<use href="#id">` instances reference it — one DOM definition, many renders. `currentColor` on `fill` inherits text `color`.

**When to use:** Icon button → `<svg class="icon"><use href="#icon-close"/></svg>`; React → wrap in component; large sets → SVGO-optimized sprite or icon font alternative.

**Examples:**

```html
<svg style="display:none">
  <symbol id="icon-close" viewBox="0 0 24 24">
    <path d="M6 6l12 12M18 6L6 18"/>
  </symbol>
</svg>

<svg class="icon"><use href="#icon-close"/></svg>
```

Style with `fill: currentColor`. For many icons, use an SVG sprite sheet or icon component library.

</details>

<details>
  <summary>What is a Block Formatting Context (BFC)?</summary>

### What is a Block Formatting Context (BFC)?

**Definition:** An isolated layout box where blocks stack vertically and floats are contained inside. Create with `display: flow-root`, `overflow: auto/hidden`, flex/grid container, or `float`. Used to clear floats, prevent margin collapse, and isolate layout.

**How it works:** BFC is an independent layout region — floats don't escape; margins of adjacent blocks collapse only within the same BFC; `flow-root` is the modern clearfix replacement.

**When to use:** Contain floats → `display: flow-root` on parent; prevent margin collapse between siblings → separate BFCs; isolate z-index stacking.

</details>

<details>
  <summary>Reflow vs repaint vs composite?</summary>

### Reflow vs repaint vs composite?

**Definition:** Layout/reflow — geometry changes (`width`, `margin`). Paint — visual changes without layout (`background`, `color`). Composite — GPU layers (`transform`, `opacity`). Prefer compositor-friendly properties for animations.

**How it works:** Style change → recalc → layout (if geometry) → paint (if pixels) → composite (if layers). Each step costs more than the previous for large pages.

**When to use:** Animate `transform`/`opacity` only; batch DOM reads/writes; `will-change` sparingly — overuse creates memory pressure.

</details>

<details>
  <summary>Flex item text overflowing — why?</summary>

### Flex item text overflowing — why?

**Definition:** Default `min-width: auto` prevents flex items from shrinking below content width. Fix: `min-width: 0` (or `min-height: 0` in column flex) on the overflowing child; add `overflow: hidden` + `text-overflow: ellipsis` if needed.

**How it works:** Flex default `min-width: auto` = content minimum size — long unbroken strings refuse to shrink, overflowing the flex container.

**When to use:** Truncate text in sidebar → `min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap` on flex child.

</details>

<details>
  <summary>Explicit vs implicit CSS Grid?</summary>

### Explicit vs implicit CSS Grid?

**Definition:** Explicit grid = tracks you define in `grid-template-*`. Implicit grid = auto-created rows/columns for extra items; control with `grid-auto-rows`, `grid-auto-columns`, `grid-auto-flow`.

**How it works:** Items beyond `grid-template-columns` flow into implicit tracks sized by `grid-auto-rows`/`grid-auto-columns` (default `auto`).

**When to use:** Fixed 3-column layout → explicit template; unknown item count list → `grid-auto-flow: row` with `grid-auto-rows: minmax(100px, auto)`.

</details>

<details>
  <summary>How to avoid loading cached CSS/JS files after deploy?</summary>

### How to avoid loading cached CSS/JS files after deploy?

**Definition:**

1. **Content hash in filename** (best) — `main.a1b2c3d4.css` via Webpack/Vite build

2. **Query string** — `styles.css?v=1.2.3` (weaker; some proxies ignore query strings)
3. **`Cache-Control` headers** — `max-age` for static assets; `no-cache` for `index.html`
4. **Service worker** — update cache on new deploy.
**Cache busting** — change the URL when file content changes so browsers fetch the new file:

**How it works:** Browsers cache by URL — same URL = cached file even after deploy. Content hash in filename changes URL when bytes change.

**When to use:** Vite/Webpack emit `main.[hash].css`; `index.html` gets `no-cache` header; query `?v=` is weaker (some CDNs ignore query strings).

**Examples:**

```html
<link rel="stylesheet" href="/assets/main.css?v=BUILD_ID">
```

Production builds should fingerprint hashed filenames automatically. Never rely on manual cache clear for users.

</details>

<details>
  <summary>What is a containing block?</summary>

### What is a containing block?

**Definition:** The box used to compute an element's position and percentage sizes. For `absolute` — nearest positioned ancestor; for `fixed` — viewport; for `static`/`relative` — ancestor content box. See **Containing block** in Box Model & Display.

**How it works:** Percentage `width`/`height`/`top`/`left` resolve against the containing block's dimensions — wrong ancestor = wrong percentages.

**When to use:** `position: absolute` child → nearest `position` ≠ `static` ancestor; `transform` on ancestor makes it containing block for `fixed` too.

</details>

<details>
  <summary>Why does flex need min-width: 0?</summary>

### Why does flex need min-width: 0?

**Definition:** Flex items default to `min-width: auto` (= content minimum). Long text prevents shrinking → overflow. Fix: `min-width: 0` (or `min-height: 0` in column flex) on the overflowing child. Same idea as `minmax(0, 1fr)` in Grid.

**How it works:** `min-width: auto` prevents shrinking below intrinsic content width — flex item won't compress for ellipsis/truncation.

**When to use:** Same as flex overflow — grid `minmax(0, 1fr)` solves equivalent issue in grid tracks.

</details>

<details>
  <summary>auto-fit vs auto-fill?</summary>

### auto-fit vs auto-fill?

**Definition:** Both use `repeat(auto-*, minmax(min, 1fr))`. `auto-fill` keeps empty tracks as placeholders. `auto-fit` collapses empty tracks so existing columns **stretch** to fill the row. Use `auto-fit` for responsive card grids that grow to fill space.

**How it works:** With 3 items in a 5-column capable row — `auto-fill` leaves 2 empty tracks; `auto-fit` collapses empties so 3 items expand to fill width.

**When to use:** Card grid that grows → `auto-fit`; fixed column count feel with gaps → `auto-fill`.

</details>

<details>
  <summary>Intrinsic vs extrinsic sizing?</summary>

### Intrinsic vs extrinsic sizing?

**Intrinsic** — size from content (`min-content`, `max-content`, `fit-content`, `width: auto`). **Extrinsic** — size imposed from outside (`width: 300px`, `flex: 1`, percentage widths). Interview trap: intrinsic content minimum blocks flex/grid shrinking.

**How it works:** `min-content` = longest word; `max-content` = no wrapping; extrinsic sizes override unless `min-width: auto` prevents shrink.

**When to use:** Shrink-to-fit sidebar → `min-width: 0`; image max → `max-width: 100%; height: auto`.

</details>

<details>
  <summary>100vh vs 100dvh?</summary>

### 100vh vs 100dvh?

**Definition:** `100vh` is the static viewport height — on mobile it often includes space behind the browser URL bar, causing overflow. `100dvh` (dynamic viewport height) adapts as mobile chrome shows/hides. Prefer `dvh` for full-screen layouts; pair with `env(safe-area-inset-*)` on notched devices.

**How it works:** Mobile browsers resize viewport when URL bar collapses — `vh` doesn't update mid-session; `dvh` tracks the dynamic visible area.

**When to use:** Full-screen modal/hero → `min-height: 100dvh`; safe area → `padding-bottom: env(safe-area-inset-bottom)`.

</details>

<details>
  <summary>How does @supports work?</summary>

### How does @supports work?

**Definition:** Feature query — applies CSS only if the browser supports a property/value. Progressive enhancement, not browser sniffing:.

**How it works:** `@supports (property: value)` wraps rules applied only if the browser parses and supports that declaration — feature detection, not UA sniffing.

**When to use:** Grid enhancement over flex fallback; `backdrop-filter` with solid background fallback; `container-type: inline-size` progressive enhancement.

**Examples:**

```css
@supports (display: grid) {
  .layout { display: grid; }
}
```

Combine with Autoprefixer + Browserslist for prefixes; use `@supports` for optional enhancements (grid, `backdrop-filter`, container queries).

</details>

<details>
  <summary>When is a stacking context created?</summary>

### When is a stacking context created?

**Definition:** `z-index` (not `auto`) on positioned/flex/grid item; `opacity < 1`; `transform`, `filter`, `perspective`; `isolation: isolate`; `mix-blend-mode` ≠ `normal`; `will-change` for compositor properties. Children cannot paint above siblings outside their parent's context — see Layout → Stacking context.

**How it works:** Each stacking context is an isolated z-order group — child `z-index: 9999` cannot escape above a sibling context with lower parent `z-index`.

**When to use:** Modal overlay → `isolation: isolate` on wrapper; debug z-index wars in DevTools Layers panel.

</details>

<details>
  <summary>box-shadow vs filter: drop-shadow()?</summary>

### box-shadow vs filter: drop-shadow()?

**Definition:** `box-shadow` follows the element's box (border-radius included). `drop-shadow()` follows the alpha shape — better for PNG/SVG icons with transparency. `box-shadow` triggers paint; both are cheaper than layout changes.

**How it works:** `box-shadow` paints on the border box; `filter: drop-shadow()` follows non-transparent pixels — hollow icons get correct shadow shape.

**When to use:** Rectangular cards → `box-shadow`; PNG/SVG icons with transparency → `drop-shadow()`; multiple shadows → comma-separated `box-shadow`.

</details>

<details>
  <summary>Can you fully style a native select?</summary>

### Can you fully style a native select?

**Definition:** Partially. `appearance: none` removes OS chrome; you can style the closed state (border, padding, custom arrow via `background`). The **dropdown list** is rendered by the OS — options styling is limited cross-browser. Full control requires a custom component with keyboard support and ARIA.

**How it works:** Closed `<select>` is stylable; open dropdown is a native OS widget — `<option>` styling varies by platform.

**When to use:** Brand the closed trigger → `appearance: none` + custom arrow; full design control → build custom listbox with `role="listbox"` and keyboard nav.

</details>

<details>
  <summary>Pure CSS toggle without JavaScript?</summary>

### Pure CSS toggle without JavaScript?

**Definition:** Hide a native `<input type="checkbox">` and style a sibling with `:checked + .track` — slide the knob with `transform`, change track `background`. Keeps accessibility and form state. Full solution: **Form & Native Control Styling → Pure CSS toggle** and Task 15.

**How it works:** Checkbox remains in tab order and exposes state to assistive tech; visually hidden with `sr-only` or `opacity: 0`; `:checked` pseudo drives sibling styles.

**When to use:**

iOS-style toggle; accordion with `<details>`; tab panels with `:target` or radio inputs.

</details>

---

### Tasks

### Task 1 — Which rule wins? (specificity)

What color is the text? Explain why.

```html
<p id="msg" class="alert error">Hello</p>
```

```css
p { color: blue; }
.alert { color: orange; }
#error { color: red; }
p.error { color: green; }
.alert.error { color: purple; }
```

<details>
  <summary>Answer</summary>

### Answer

**Definition:**

Comparison:.

**Purple** — selector `.alert.error` has specificity `(0, 2, 1)` (two classes + one type).

| Selector | Specificity |
|----------|-------------|
| `p` | 0, 0, 1 |
| `.alert` | 0, 1, 0 |
| `#error` | 1, 0, 0 — **but `#error` does not match** (element has `id="msg"`) |
| `p.error` | 0, 1, 1 |
| `.alert.error` | 0, 2, 1 — **wins** |

If `#msg` were used instead, ID `(1,0,0)` would beat classes unless `!important` or `@layer` changes cascade order.

</details>

---

### Task 2 — Center a modal (horizontal + vertical)

Build a full-viewport overlay with a centered dialog. No absolute positioning on the dialog.

```html
<div class="overlay">
  <div class="dialog">Modal content</div>
</div>
```

<details>
  <summary>Solution</summary>

### Solution

**Definition:**

.dialog {

width: min(90vw, 400px);
  padding: 1.5rem;
  border-radius: 12px;
  background: #fff;
}
```.

**Examples:**

```css
.overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100dvh;
  background: rgb(0 0 0 / 50%);
}

**How it works:** `display: grid; place-items: center;` on `.overlay`.

</details>

---

### Task 3 — Responsive card grid (no media queries)

Cards should auto-fit: minimum 260px wide, grow to fill the row, 1.5rem gap.

```html
<ul class="cards">
  <li class="card">1</li>
  <li class="card">2</li>
  <!-- ... -->
</ul>
```

<details>
  <summary>Solution</summary>

### Solution

**Definition:**

.card {

padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
```.

**Examples:**

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

`auto-fit` collapses empty tracks so cards stretch to fill the row.

</details>

---

### Task 4 — Holy grail layout (header, sidebar, main, footer)

Classic page shell: header and footer full width; sidebar 240px; main fills remaining space. Minimum full viewport height.

```html
<div class="app">
  <header class="header">Header</header>
  <aside class="sidebar">Sidebar</aside>
  <main class="main">Main</main>
  <footer class="footer">Footer</footer>
</div>
```

<details>
  <summary>Solution</summary>

### Solution

**Definition:**

.header  { grid-area: header; }

.sidebar { grid-area: sidebar; }
.main    { grid-area: main; min-width: 0; }
.footer  { grid-area: footer; }
```.

**Examples:**

```css
.app {
  display: grid;
  min-height: 100dvh;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}

`min-width: 0` on main prevents flex/grid child overflow (Task 5).

</details>

---

### Task 5 — Fix flex overflow (sidebar + main)

Main content overflows horizontally instead of shrinking. Fix with CSS only.

```css
.layout {
  display: flex;
  min-height: 100dvh;
}
.sidebar { width: 240px; flex-shrink: 0; }
.main { flex: 1; /* overflows! */ }
```

```html
<div class="layout">
  <aside class="sidebar">Nav</aside>
  <main class="main">
    <p>Very long unbreakable-text-that-should-not-push-the-layout...</p>
  </main>
</div>
```

<details>
  <summary>Solution</summary>

### Solution

**Definition:**

.main p {

overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```.

**Examples:**

```css
.main {
  flex: 1;
  min-width: 0; /* allow shrinking below content minimum */
  overflow: hidden; /* optional */
}

Default `min-width: auto` on flex items = content minimum size, so they refuse to shrink.

</details>

---

### Task 6 — Refactor bad CSS (interview Q60)

**Before** — fix specificity, layout, and maintainability:

```css
#header {
  background-color: #ffffff !important;
}
div.container div.box {
  width: 300px;
  height: 200px;
  float: left;
  margin: 10px;
}
div.container div.box div.title {
  font-size: 18px;
  font-weight: bold;
}
```

<details>
  <summary>Solution</summary>

### Solution

**Definition:**

.header {

background-color: #fff;
}.

**How it works:**

1. Removed `#id` + `!important` — use class `.header`
2. Replaced float layout with Grid
3. Flattened `.container .box .title` → BEM `.card__title`
4. Magic numbers → custom properties and `rem`
5. Added `box-sizing: border-box` in global reset (see Fundamentals)

**Examples:**

```css
:root {
  --space-sm: 0.625rem;
  --card-width: 300px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--card-width), 1fr));
  gap: var(--space-sm);
}

.card {
  min-height: 200px;
}

.card__title {
  font-size: 1.125rem;
  font-weight: 700;
}
```

</details>

---

### Task 7 — Dark theme with CSS custom properties

Implement light/dark theme toggle-ready tokens. Dark mode via `prefers-color-scheme`.

<details>
  <summary>Solution</summary>

### Solution

**Definition:**

@media (prefers-color-scheme: dark) {

:root {
    --bg: #111827;
    --text: #f9fafb;
    --border: #374151;
    --accent: #60a5fa;
  }
}.

**How it works:** set `document.documentElement.dataset.theme = "dark"` and use `[data-theme="dark"] { --bg: ... }`.

**Examples:**

```css
:root {
  --bg: #ffffff;
  --text: #111827;
  --border: #e5e7eb;
  --accent: #2563eb;
}

body {
  background: var(--bg);
  color: var(--text);
}

.card {
  border: 1px solid var(--border);
}

.button {
  background: var(--accent);
  color: #fff;
}
```

</details>

---

### Task 8 — Detect transition end in JavaScript

Fade out an element, then remove it from the DOM when the fade completes.

```html
<div class="toast" id="toast">Saved!</div>
```

<details>
  <summary>Solution</summary>

### Solution

**Definition:**

function dismissToast(el) {

const onEnd = (e) => {
    if (e.target !== el || e.propertyName !== "opacity") return;
    el.removeEventListener("transitionend", onEnd);
    el.remove();
  };
  el.addEventListener("transitionend", onEnd);
  el.classList.add("is-hiding");
}.

**Examples:**

```css
.toast {
  opacity: 1;
  transition: opacity 0.3s ease;
}
.toast.is-hiding {
  opacity: 0;
}
```

```js
const toast = document.getElementById("toast");

dismissToast(toast);
```

Check `propertyName` and `e.target` to ignore bubbled events from children.

</details>

---

### Task 9 — Sticky header below a top bar

Top bar 48px fixed height. Header below it should stick when scrolling, staying under the top bar.

```html
<div class="topbar">Top bar</div>
<div class="page">
  <header class="sticky-header">Sticky nav</header>
  <main>...</main>
</div>
```

<details>
  <summary>Solution</summary>

### Solution

**Definition:**

.sticky-header {

position: sticky;
  top: 48px; /* offset = topbar height */
  z-index: 10;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}
```.

**Examples:**

```css
.topbar {
  height: 48px;
  background: #1e293b;
  color: #fff;
}

**How it works:** `overflow: hidden` on `.page` parent, missing `top`, or `top: 0` causing overlap with topbar.

</details>

---

### Task 10 — Pure CSS tooltip

Show tooltip text on hover/focus without JavaScript. Use `data-tip` attribute.

```html
<button class="tip" data-tip="Delete item" aria-label="Delete">🗑</button>
```

<details>
  <summary>Solution</summary>

### Solution

**Definition:**

.tip::after {

content: attr(data-tip);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  white-space: nowrap;
  background: #1e293b;
  color: #fff;
  border-radius: 4px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}.

**Examples:**

```css
.tip {
  position: relative;
}

.tip:hover::after,
.tip:focus-visible::after {
  opacity: 1;
}
```

Uses `attr()` pseudo-element content. Include `aria-label` for screen readers.

</details>

---

### Task 11 — Calculate specificity with :is() and :where()

What color applies?

```css
:where(.a, .b, #x) { color: red; }
:is(.a, .b, #x) { color: blue; }
p { color: green; }
```

```html
<p class="a">Text</p>
```

<details>
  <summary>Answer</summary>

### Answer

**Definition:**

`:where(.a, .b, #x)` has **zero** specificity → `(0, 0, 0)`, loses to `p` at `(0, 0, 1)` for properties where both match... but here `p` is `(0,0,1)` and `:is` is `(1,0,0)`, so **blue wins**.

**Blue** — `:is(.a, .b, #x)` takes the specificity of its highest argument: `#x` → `(1, 0, 0)`.

`:where()` is useful for reset styles that should not raise specificity.

</details>

---

### Task 12 — Flex item text truncation

A flex row has a fixed sidebar and a main area. Long title text overflows instead of showing ellipsis.

```html
<div class="row">
  <aside class="side">Nav</aside>
  <h1 class="title">Very long product name that should truncate with ellipsis</h1>
</div>
```

```css
.row { display: flex; gap: 1rem; max-width: 400px; }
.side { flex: 0 0 80px; }
.title { flex: 1; }
```

<details>
  <summary>Solution</summary>

### Solution

**Definition:** Without `min-width: 0`, flex item won't shrink below content width.

**Examples:**

```css
.title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

</details>

---

### Task 13 — Sidebar layout with grid-template-areas

Build a dashboard: header spans full width, 200px sidebar left, main fills center, footer spans full width. Use named areas only (no line numbers on items).

<details>
  <summary>Solution</summary>

### Solution

**Definition:**

.header { grid-area: head; }

.sidebar { grid-area: nav; }
.content { grid-area: main; min-width: 0; }
.footer { grid-area: foot; }
```.

**Examples:**

```css
.dashboard {
  display: grid;
  min-height: 100dvh;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "head head"
    "nav  main"
    "foot foot";
}

Area names must form rectangles; every row has the same number of cells.

</details>

---

### Task 14 — Component responsive via @container

A `.card` component should stack image above text when narrow, but show side-by-side when its container is ≥ 360px — **without** viewport media queries.

```html
<div class="slot" style="width: 280px">
  <div class="card-wrap">
    <article class="card">...</article>
  </div>
</div>
```

<details>
  <summary>Solution</summary>

### Solution

**Definition:**

.card {

display: flex;
  flex-direction: column;
  gap: 1rem;
}.

**Examples:**

```css
.card-wrap {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 360px) {
  .card {
    flex-direction: row;
    align-items: center;
  }

  .card img {
    width: 120px;
    flex-shrink: 0;
  }
}
```

Resize `.slot` width to verify — component adapts to parent, not viewport.

</details>

---

### Task 15 — Pure CSS iOS-style toggle

Implement a toggle switch without JavaScript. Must use a real checkbox for accessibility.

<details>
  <summary>Solution</summary>

### Solution

**Definition:** See **Form & Native Control Styling → Pure CSS toggle** for full HTML + CSS. Key pattern: hidden `input[type="checkbox"]` + `.switch__track` sibling styled with `:checked + .track` and `::after` knob animated via `transform: translateX()`.

</details>

---

### Task 16 — Modal z-index debug

Why does the tooltip not appear above the modal overlay?

```html
<div class="overlay" style="z-index: 100">
  <div class="modal">
    <button class="tip-btn">?</button>
    <span class="tooltip" style="z-index: 9999">Help text</span>
  </div>
</div>
```

```css
.modal { position: relative; transform: translateZ(0); }
.tooltip { position: absolute; }
```

<details>
  <summary>Answer</summary>

### Answer

**Definition:** `.modal` creates a **new stacking context** (`transform: translateZ(0)`). `.tooltip`'s `z-index: 9999` only competes **inside** `.modal` — it cannot paint above `.overlay`'s siblings outside that context.

**How it works:**

1. Remove unnecessary `transform` on `.modal` if not needed
2. Move tooltip to document root (portal)
3. Put tooltip outside `.modal` in DOM
4. Use `isolation: isolate` deliberately only where needed

</details>

</details>

---

<a name="quick-fixes"></a>

## Quick fixes (cases)

<details>
  <summary>Icons don't show on hover</summary>

### Icons don't show on hover

**Problem:** `visibility: hidden` on hover state.

**Fix:** use `opacity: 0` → `opacity: 1` with `transition`. Remove conflicting `defs` in inline SVG.

</details>

<details>
  <summary>Custom scrollbar</summary>

### Custom scrollbar

**Examples:**

```css
.scrollable::-webkit-scrollbar { width: 8px; }
.scrollable::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}
/* Firefox */
.scrollable { scrollbar-width: thin; scrollbar-color: #ccc transparent; }
```

</details>

<details>
  <summary>Tailwind class precedence not respected</summary>

### Tailwind class precedence not respected

**Answer:** utilities share equal specificity — **source order in compiled CSS** wins, not HTML class order. Use `tailwind-merge` or `@layer utilities` for overrides.

</details>

<details>
  <summary>Child height 100% not working</summary>

### Child height 100% not working

**Answer:** set `height` or `min-height: 100%` on every ancestor (`html` → `body` → parent), or use `min-height: 100dvh` on the flex/grid container.

</details>

<details>
  <summary>Float parent collapses to zero height</summary>

### Float parent collapses to zero height

**Answer:** `display: flow-root` on parent (creates BFC). Legacy: clearfix `::after { content: ""; display: table; clear: both; }`.

</details>

### Practical tasks (CSS)

45. How could you build an iPhone-style toggle component without JavaScript?

**Answer:** Pure CSS toggle — hidden checkbox + `:checked` sibling selector. See **Form & Native Control Styling → Pure CSS toggle**, Q&A **Pure CSS toggle without JavaScript**, and **Task 15**.


