
# CSS — Stylesheets & Layout

Covers cascade, selectors, box model, flexbox, grid, responsive design, motion, architecture, and performance.

### Related docs

* [HTML browser & rendering](./1_html.md) · [JS Browser](./3_js_browser.md) · [React](./4_react.md) · [Core Web Vitals](./6_web_api.md#core-web-vitals) · [INP](./6_web_api.md#inp-interaction-to-next-paint) · [CLS](./1_html.md#cls-cumulative-layout-shift)

### Main concepts

| Area | Topics |
|------|--------|
| **Fundamentals** | Ways to add CSS, `@import` anti-patterns, rule syntax, global keywords, inheritance, code style, reset vs normalize |
| **Cascade** | Selectors, combinators, specificity, `@layer`, pseudo-classes/elements, `:has()` |
| **Box model** | Margin/padding, `box-sizing`, BFC, containing block, intrinsic sizing |
| **Layout** | Display, `display: contents`, positioning, stacking context, flexbox, grid, centering, float (legacy) |
| **Responsive** | Media queries, container queries, units, `clamp()`, custom properties, nesting |
| **Decoration** | Background, border, outline, box-shadow |
| **Typography** | Font loading, `text-wrap`, text overflow, colors, gradients, `color-scheme`, dark mode |
| **Motion** | Transform, transition, `@keyframes`, scroll-driven animations |
| **Effects** | Filters, clip-path, backdrop-filter, blend modes, scroll-snap |
| **Forms & print** | Native control styling, pure CSS toggle, `@media print`, `@page` |
| **Mobile** | Scroll/touch, safe-area insets, `dvh`, overscroll-behavior |
| **Modern CSS** | `@starting-style`, anchor positioning, `@scope`, scroll-driven animations, View Transitions, `@property` |
| **Architecture** | BEM, Sass, PostCSS, CSS Modules, Tailwind, methodologies |
| **Performance** | Reflow/paint/composite, critical CSS, `contain`, `content-visibility`, Core Web Vitals |
| **Quality** | Accessibility, interview Q&A, hands-on tasks |

## Resources & links

<details>
  <summary>External references</summary>

* [MDN CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
* [web.dev Learn CSS](https://web.dev/learn/css/)
* [CSS-Tricks](https://css-tricks.com/)
* [Flexbox Froggy](https://flexboxfroggy.com/)
* [Grid Garden](https://cssgridgarden.com/)
* [CSS for JS developers](https://learn.javascript.ru/css-for-js)
* [Modern CSS 2025 (Frontend Masters)](https://frontendmasters.com/blog/what-you-need-to-know-about-modern-css-2025-edition/)
* [CodemyUI patterns](https://codemyui.com/)
* [CSS interview questions](https://www.interviewbit.com/css-interview-questions/)
* [Google Fonts](https://fonts.google.com/)
* [caniuse.com](https://caniuse.com/)

**Videos**

* [5 CSS Tips for Responsive Design](https://www.youtube.com/watch?v=2IV08sP9m3U)
* [10 CSS Pro Tips](https://www.youtube.com/watch?v=44FTAS-qT8Q)
* [CSS Animations](https://www.youtube.com/watch?v=UxFnW2cPRi8)

</details>

### Sections

- [Fundamentals](#fundamentals)
- [Selectors & Cascade](#selectors-cascade)
- [Box Model & Display](#box-model-display)
- [Layout Systems](#layout-systems)
- [Responsive Design](#responsive-design)
- [Scroll, Touch & Mobile](#scroll-touch-mobile)
- [Typography & Colors](#typography-colors)
- [Decoration](#decoration)
- [Form Styling](#form-styling)
- [Print & Paged Media](#print)
- [Transforms & Animations](#transforms-animations)
- [Visual Effects](#visual-effects)
- [Modern CSS](#modern-css)
- [CSS Phase 2](#css-phase-2)
- [Architecture & Tooling](#architecture-tooling)
- [Performance](#performance)
- [Interview Practice](#interview-practice)
- [Quick fixes](#quick-fixes)

> Theory `<details>` blocks follow: **Definition** · **How it works** · **Cases** · **Pros | Cons** · **Example** · pitfalls where relevant.

### Cascade & specificity

**Definition:** The cascade resolves conflicting rules by origin, importance, specificity, and source order; inheritance passes some properties from parent to child.

| Concept | Role |
|---------|------|
| **Cascade** | Picks the winning declaration when rules conflict |
| **Specificity** | Tuple score per selector — more specific wins |
| **Inheritance** | `color`, `font-*`, `line-height` flow down; layout props do not |
| **`@layer`** | Explicit layer order beats specificity among author styles |

**When to use:** Every stylesheet — understanding cascade prevents specificity wars and `!important` hacks.

**When NOT to use:** Inline `style=""` and ID selectors for styling — they raise specificity and hurt maintainability.

**Example:**

<details>
  <summary>Code</summary>

```css
@layer reset, components, utilities;

@layer components {
  .button { background: #2563eb; }
}

.card .button { background: #1d4ed8; } /* wins: unlayered beats layered */
```

</details>

**Notes:** Render pipeline — CSS builds the CSSOM before layout → [1_html.md](./1_html.md).

**Source:** [MDN — Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade) · [Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)

### Box model & layout

**Definition:** Every element is a box (content → padding → border → margin); layout systems position and distribute those boxes in 1D (flex) or 2D (grid).

| System | Best for |
|--------|----------|
| **Flexbox** | Toolbars, nav rows, centering, 1D alignment |
| **Grid** | Page shells, dashboards, responsive card matrices |
| **`border-box`** | Predictable sizing — `width` includes padding and border |
| **BFC** | Contains floats, prevents margin collapse |

**When to use:** Flex for components; Grid for page structure; both together in production layouts.

**Example:**

<details>
  <summary>Code</summary>

```css
*, *::before, *::after { box-sizing: border-box; }

.app {
  display: grid;
  min-height: 100dvh;
  grid-template-columns: 240px 1fr;
  grid-template-areas: "sidebar main";
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
```

</details>

**Notes:** Layout changes trigger reflow in the render pipeline → [1_html.md](./1_html.md).

**Source:** [MDN — Box model](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model) · [Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout) · [Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)

### Responsive & modern CSS

**Definition:** Responsive CSS adapts layouts to viewport and container size using fluid units, media/container queries, and modern features like custom properties and nesting.

| Feature | Purpose |
|---------|---------|
| **Media queries** | Viewport breakpoints, `prefers-reduced-motion`, dark mode |
| **Container queries** | Component adapts to parent width, not viewport |
| **`clamp()`** | Fluid typography and spacing without breakpoints |
| **Custom properties** | Runtime theming; JS-updatable tokens |
| **Modern CSS** | `@scope`, anchor positioning, scroll-driven animations |

**When to use:** Mobile-first `min-width` queries; `@container` for reusable components in sidebars and dashboards.

**Example:**

<details>
  <summary>Code</summary>

```css
:root {
  --space-md: 1rem;
  --text: clamp(0.875rem, 0.8rem + 0.25vw, 1.125rem);
}

.card-wrap { container-type: inline-size; }

@container (min-width: 400px) {
  .card { display: grid; grid-template-columns: 120px 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

</details>

**Source:** [web.dev — Learn CSS](https://web.dev/learn/css/) · [MDN — Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)

### Why CSS styles don't apply

1. Stylesheet not linked or wrong path
2. Selector doesn't match the element
3. Overridden by higher specificity or later rule
4. Property invalid or unsupported in browser
5. `display: none` / `visibility: hidden` on parent
6. Typo in property or value

---

<a name="fundamentals"></a>

## Fundamentals

<details>
  <summary>Ways to add CSS</summary>

### Ways to add CSS

**Definition:** CSS can be linked externally, embedded in `<style>`, or applied inline on elements; external stylesheets are the production default.

| Method | Syntax | Use case |
|--------|--------|----------|
| **External** | `<link rel="stylesheet" href="styles.css">` | Production default — cacheable, reusable |
| **Internal** | `<style>` in `<head>` | Single-page prototypes, critical CSS |
| **Inline** | `style="..."` on element | Avoid except dynamic one-offs; specificity 1000 |

**Loading performance:** prefer `<link rel="stylesheet">` over CSS `@import` — `@import` blocks parallel downloads and adds a serial request chain. Preload critical CSS: `<link rel="preload" href="critical.css" as="style">`.

**Source:** [MDN — Using CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps/How_CSS_is_structured)

</details>

<details>
  <summary>@import anti-patterns</summary>

### @import anti-patterns

**Definition:** `@import` loads another stylesheet from within CSS — convenient but harmful to performance and maintainability compared to `<link>` tags or bundler imports.

**How it works:**

- Browser must parse the parent CSS before discovering `@import` URLs — serializes downloads.
- `@import` inside `<style>` or late-loaded CSS delays everything it pulls in.
- Nested `@import` chains multiply latency; order depends on source position.

| Pros | Cons |
|------|------|
| Split files without HTML changes | Blocks parallel fetch vs `<link>` |
| Works in plain CSS projects | Hard to trace in DevTools cascade |
| | Bundlers may duplicate if mixed with JS imports |

**Cases:** Avoid in production — use `<link rel="stylesheet">`, bundler entry (`import './base.css'`), or `@layer` for ordering. Legacy exception: print-only `@import url("print.css") print;` when isolated.

**Example:**

<details>
  <summary>Code</summary>

```css
/* Anti-pattern — blocks rendering */
@import url("reset.css");
@import url("components.css"); /* waits for reset to parse */

/* Prefer in HTML */
/* <link rel="stylesheet" href="reset.css"> */
/* <link rel="stylesheet" href="components.css"> */
```

</details>

**Source:** [MDN — @import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)

</details>

<details>
  <summary>CSS rule syntax</summary>

### CSS rule syntax

**Definition:** A CSS rule pairs a selector with a declaration block of `property: value` pairs that style matching elements.

**Example:**

<details>
  <summary>Code</summary>

```css
selector {
  property: value;
  another-property: value;
}
```

</details>

Multiple selectors (grouping): `h1, .price { color: navy; }`  
Chaining (AND): `.card.featured { }` — element must match all parts.

**Source:** [MDN — CSS syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax)

</details>

<details>
  <summary>Global keywords</summary>

### Global keywords

**Definition:** CSS global keywords (`inherit`, `initial`, `unset`, `revert`) control how property values reset or cascade.

| Keyword | Behavior |
|---------|----------|
| `inherit` | Take computed value from parent |
| `initial` | Reset to CSS spec default |
| `unset` | `inherit` if inheritable, else `initial` |
| `revert` | Roll back to user-agent stylesheet |
| `revert-layer` | Roll back within the current `@layer` |

**How it works:**

- `inherit` — child takes parent's **computed** value for that property.
- `initial` — CSS-wide initial value (not always the UA default for that element).
- `unset` — inheritable properties → `inherit`; others → `initial`.
- `revert` — UA stylesheet value for that element/property.

| Pros | Cons |
|------|------|
| Reset without duplicating rules | `initial` ≠ element default (e.g. `display` on `<div>`) |
| `all: unset` strips author styles fast | `revert` support still maturing in older browsers |

**Cases:** `all: unset` on buttons before custom styling; `color: revert` to restore UA link colors; `display: revert` to undo author overrides on semantic elements.

**Example:**

<details>
  <summary>Code</summary>

```css
button {
  all: unset;
  cursor: pointer;
}

a { color: revert; }
```

</details>

**Source:** [MDN — CSS values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Values_and_Units)

</details>

<details>
  <summary>Code style — property order</summary>

### Code style — property order

**Definition:** Grouping CSS properties in a consistent order (position → box → typography → decoration → animation) improves readability and review speed.

Group properties for readability (positioning → box model → typography → decoration → animation → misc):

**Example:**

<details>
  <summary>Code</summary>

```css
.card {
  /* Positioning */
  position: relative;
  z-index: 1;

  /* Box model */
  display: flex;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  padding: 1rem;

  /* Typography */
  font: 400 1rem/1.5 system-ui, sans-serif;
  color: #333;

  /* Decoration */
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;

  /* Animation */
  transition: box-shadow 0.2s ease;

  /* Misc */
  will-change: auto;
}
```

</details>

**Sources:** [Netology CSS codestyle](https://netology-university.bitbucket.io/codestyle/css/) · [CSS for JS](https://learn.javascript.ru/css-for-js)

> `float` in older style guides is legacy — prefer Flexbox/Grid for layout.

**Source:** [Netology CSS codestyle](https://netology-university.bitbucket.io/codestyle/css/)

</details>

<details>
  <summary>Reset.css vs Normalize.css</summary>

### Reset.css vs Normalize.css

**Definition:** Reset strips browser defaults to a blank slate; Normalize preserves useful defaults while fixing cross-browser inconsistencies.

* **Reset** — strips most default browser styles to a blank slate
* **Normalize** — preserves useful defaults, fixes cross-browser inconsistencies

Modern projects often use a minimal reset or framework base (Tailwind Preflight, etc.).

---

**Source:** [Normalize.css](https://necolas.github.io/normalize.css/)

</details>

<a name="selectors-cascade"></a>

## Selectors & Cascade

<details>
  <summary>Selector types</summary>

### Selector types

**Definition:** CSS selectors target elements by type, class, ID, attribute, or pseudo-class/element; each type contributes to specificity.

| Type | Example | Specificity |
|------|---------|-------------|
| Universal | `*` | 0 |
| Type | `p`, `h1` | 0,0,1 |
| Class | `.btn` | 0,1,0 |
| ID | `#header` | 1,0,0 |
| Attribute | `[type="email"]`, `[href^="https"]` | 0,1,0 |
| Pseudo-class | `:hover`, `:nth-child(2)` | 0,1,0 |
| Pseudo-element | `::before`, `::selection` | 0,0,1 (acts like type) |

**Source:** [MDN — Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)

</details>

<details>
  <summary>Combinators</summary>

### Combinators

**Definition:** Combinators define relationships between selectors — descendant, child, adjacent sibling, and general sibling.

| Combinator | Meaning | Example |
|------------|---------|---------|
| Descendant (space) | Any nested descendant | `.nav li` |
| Child `>` | Direct child only | `.nav > li` |
| Adjacent `+` | Immediate next sibling | `h2 + p` |
| General `~` | Any following sibling | `h2 ~ p` |

**Source:** [MDN — Combinators](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Combinators)

</details>

<details>
  <summary>Class vs ID</summary>

### Class vs ID

**Definition:** Classes are reusable styling hooks; IDs are unique per page and carry higher specificity — prefer classes for styling.

* **ID** — unique per page; high specificity; prefer for JS hooks or fragment targets, not styling
* **Class** — reusable; kebab-case (`card-title`); multiple per element (space-separated)

**How it works:**

- ID selector (`#header`) — specificity `(1,0,0)`; document-unique.
- Class selector (`.nav`) — specificity `(0,1,0)`; reusable; multiple per element.
- IDs valid for fragment targets (`#section`), `aria-labelledby`, `label for=`; classes for styling hooks.

| Pros (class) | Cons (ID for styling) |
|--------------|----------------------|
| Low specificity, easy overrides | IDs create specificity wars |
| Composable modifiers (`btn--primary`) | One per page — brittle for components |
| Team-friendly naming conventions | Hard to refactor at scale |

**Cases:** Style with classes; reserve IDs for anchors and ARIA references. Avoid `#id .class` chains to win specificity — flatten selectors or use `@layer` instead.

**Example:**

<details>
  <summary>Code</summary>

```html
<header id="main-header" class="site-header">...</header>
<nav class="nav nav--compact">...</nav>
```

</details>

**Source:** [MDN — ID selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors)

</details>

<details>
  <summary>Modern functional selectors</summary>

### Modern functional selectors

**Definition:** `:is()`, `:where()`, `:not()`, and `:has()` group or filter selectors with different specificity rules.

**Example:**

<details>
  <summary>Code</summary>

```css
/* :is() — groups selectors; specificity = highest argument */
:is(h1, h2, h3) { margin-block: 0; }

/* :where() — same grouping, ZERO specificity */
:where(h1, h2, h3) { margin-block: 0; }

/* :not() — exclusion */
li:not(:last-child) { border-bottom: 1px solid #eee; }

/* :has() — parent selector ("has selector") */
.card:has(img) { padding-top: 0; }
.form:has(:invalid) .submit { opacity: 0.5; }
```

</details>

**Source:** [MDN — :has()](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)

</details>

<details>
  <summary>Specificity calculation</summary>

### Specificity calculation

**Definition:** Specificity is a tuple score (inline, IDs, classes/attributes/pseudo-classes, types/pseudo-elements) that decides which rule wins in the cascade.

Count (inline, IDs, classes/attributes/pseudo-classes, types/pseudo-elements):

**Example:**

<details>
  <summary>Code</summary>

```
#nav .item a:hover     →  1,1,2
.btn.btn--primary     →  0,2,0
p                     →  0,0,1
style="" attribute    →  1000 (inline)
!important             →  beats normal declarations in same origin
```

</details>

**Tie-breaker:** later rule in source order wins.

> The old "1-10-100" mental model is a simplification. Use real specificity tuples or DevTools "Computed" panel.

**Edge cases:**

| Selector | Specificity note |
|----------|------------------|
| `:not(.a)` | `:not()` itself is 0; argument `.a` adds `(0,1,0)` |
| `:is(.a, #x)` | Takes highest argument → `#x` = `(1,0,0)` |
| `:where(.a, #x)` | Always `(0,0,0)` |
| `::before` | Counts as a type pseudo-element `(0,0,1)` |

**`!important` + `@layer`:** within the same origin, unlayered styles beat layered styles regardless of specificity. Among layered styles, layer order wins first, then specificity. `!important` inversions apply per origin — author `!important` beats author normal, but user `!important` can beat author `!important`.

```
Cascade resolution (simplified):
  1. Origin + importance (user !important > author !important > author normal > user normal > UA)
  2. @layer order (later layer wins; unlayered beats all layers)
  3. Specificity tuple
  4. Source order
```

**Source:** [MDN — Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)

</details>

<details>
  <summary>Cascade origins</summary>

### Cascade origins

**Definition:** The cascade resolves conflicts across user-agent, user, and author stylesheets before specificity and source order.

| Origin | Source | Typical examples |
|--------|--------|------------------|
| **User-agent (UA)** | Browser default stylesheet | `display: block` on `div`, bold `h1` |
| **User** | User settings / extensions | High-contrast mode, custom fonts |
| **Author** | Your CSS (linked, embedded, inline) | App stylesheets |

**Inheritance** is separate from cascade — inherited values flow down the DOM tree but still participate in cascade when overridden on a child.

**`revert`** rolls back to the UA stylesheet for that property; `revert-layer` rolls back within the current `@layer`.

**Source:** [MDN — Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade)

</details>

<details>
  <summary>Inheritance</summary>

### Inheritance

**Definition:** Some CSS properties pass their computed values from parent to child; others do not. Inheritance is separate from the cascade — a child can inherit a value that still loses to a more specific author rule.

**How it works:**

- Inheritable: `color`, `font-*`, `line-height`, `text-align`, `visibility`, custom properties (`--*`), etc.
- Non-inheritable: `margin`, `padding`, `border`, `width`, `display`, `background`, etc.
- `inherit` keyword forces inheritance even on non-inheritable properties.
- `initial` / `unset` / `revert` interact with inheritance per property rules.

| Pros | Cons |
|------|------|
| Typography/color theming from `:root` | Easy to forget what inherits vs what doesn't |
| Custom properties cascade naturally | Inherited `visibility: hidden` hides all descendants |
| Less duplication for text styles | Layout props must be set per element |

**Cases:** Set `font-family` / `color` on `body` or `:root`; use `color: inherit` on buttons/links; don't expect `width` or `margin` to flow down — set explicitly or use layout containers.

**Example:**

<details>
  <summary>Code</summary>

```css
:root {
  --brand: #2563eb;
  font-family: system-ui, sans-serif;
  color: #111;
}

.card {
  color: inherit;           /* explicit inherit on non-default */
  border: 1px solid #e5e7eb; /* does NOT inherit from parent */
}
```

</details>

**Source:** [MDN — Inheritance](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Inheritance)

</details>

<details>
  <summary>@layer (cascade layers)</summary>

### @layer (cascade layers)

**Definition:** `@layer` declares explicit cascade layers so resets, components, and utilities stack in a predictable order.

Control cascade order explicitly — useful for design systems, resets, and utilities:

**Example:**

<details>
  <summary>Code</summary>

```css
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; }
}

@layer utilities {
  .hidden { display: none !important; }
}
```

</details>

Unlayered styles beat layered styles. Later layers beat earlier layers within the same origin.

**Source:** [MDN — @layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)

</details>

<details>
  <summary>Pseudo-classes</summary>

### Pseudo-classes

**Definition:** Pseudo-classes select elements in a particular state or structural position (`:hover`, `:nth-child`, `:focus-visible`).

| Category | Selectors | Use case |
|----------|-----------|----------|
| **Interaction** | `:hover`, `:active` | Pointer feedback |
| **Focus** | `:focus`, `:focus-visible`, `:focus-within` | Keyboard vs mouse focus; parent when child focused |
| **Structure** | `:first-child`, `:last-child`, `:nth-child(n)`, `:only-child` | Position among all siblings |
| **Type structure** | `:first-of-type`, `:nth-of-type(n)` | Position among same tag siblings only |
| **Negation** | `:not(.disabled)` | Exclude matches |
| **Form state** | `:checked`, `:disabled`, `:invalid`, `:valid`, `:placeholder-shown`, `:required` | Native validation styling |
| **Navigation** | `:target` | URL fragment highlight |
| **Parent** | `:has(.error)` | Style parent based on descendant |

**`:nth-child` vs `:nth-of-type`:**

**Example:**

<details>
  <summary>Code</summary>

```html
<div><p>A</p><span>B</span><p>C</p></div>
```

</details>

* `p:nth-child(2)` — no match (`span` is 2nd child)
* `p:nth-of-type(1)` — matches first `<p>` (A)
* `p:nth-of-type(2)` — matches second `<p>` (C)

**`:focus` vs `:focus-visible`:** `:focus` fires on any focus (including mouse click); `:focus-visible` only when the UA determines focus should be visible (keyboard). Use `:focus-visible` for outline rings; never remove `:focus` without a replacement.

**Source:** [MDN — Pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)

</details>

<details>
  <summary>Pseudo-elements</summary>

### Pseudo-elements

**Definition:** Pseudo-elements style generated sub-parts of an element (`::before`, `::after`, `::selection`).

Target sub-parts of an element (use `::`):

* `::before`, `::after` — generated content (`content` required)
* `::first-letter`, `::first-line`
* `::selection` — user-selected text
* `::placeholder` — input placeholder text

**Example:**

<details>
  <summary>Code</summary>

```css
.tooltip::after {
  content: attr(data-tip);
  position: absolute;
}
```

</details>

**Source:** [MDN — Pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)

</details>

<details>
  <summary>attr() function</summary>

### attr() function

**Definition:** The `attr()` function reads an HTML attribute value for use in CSS, commonly in `content` on pseudo-elements.

Reads an HTML attribute value for use in CSS (common with `content`):

**Example:**

<details>
  <summary>Code</summary>

```css
a[href^="http"]::after {
  content: " (" attr(href) ")";
}
```

</details>

**How it works:**

- `attr(name)` reads the attribute value as a string for `content`, and in modern browsers for other properties (`attr(data-label type(<string>))`).
- Typed `attr()` (CSS Values Level 5) allows `type(<color>)`, `type(<length>)`, etc. — check browser support.
- Empty/missing attributes yield empty string in `content`.

| Pros | Cons |
|------|------|
| DRY tooltips/labels from HTML data | Limited property support without typed `attr()` |
| No JS for decorative pseudo-content | Screen readers may not read `::after` content — add `aria-label` |
| Good for print link expansion | Security: never inject unescaped user HTML via attributes |

**Cases:** External link hints in print; decorative labels from `data-*`; counter badges. Always pair decorative `attr()` content with accessible names.

**Source:** [MDN — attr()](https://developer.mozilla.org/en-US/docs/Web/CSS/attr)

</details>

<a name="box-model-display"></a>

## Box Model & Display

<details>
  <summary>CSS box model</summary>

### CSS box model

**Definition:** Every element is a rectangular box: content, padding, border, and margin — the foundation of layout sizing.

Every element is a rectangular box: **content → padding → border → margin**.

By default, `width` / `height` apply to the **content box** only; padding and border add to total size.

**Example:**

<details>
  <summary>Code</summary>

```
┌──────────── margin ────────────┐
│  ┌──────── border ────────┐    │
│  │  ┌──── padding ────┐   │    │
│  │  │    content      │   │    │
│  │  └─────────────────┘   │    │
│  └────────────────────────┘    │
└────────────────────────────────┘
```

</details>

**MDN:** [Introduction to the CSS box model](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Introduction_to_the_CSS_box_model)

**Source:** [MDN — Box model](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Introduction_to_the_CSS_box_model)

</details>

<details>
  <summary>box-sizing</summary>

### box-sizing

**Definition:** `box-sizing` controls whether `width`/`height` include padding and border (`border-box`) or content only (`content-box`).

**Example:**

<details>
  <summary>Code</summary>

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

</details>

| Value | `width` includes |
|-------|------------------|
| `content-box` | content only (default) |
| `border-box` | content + padding + border |

Use `border-box` globally to make sizing predictable. `padding-box` exists but is rarely used.

**Source:** [MDN — box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing)

</details>

<details>
  <summary>Margin & padding</summary>

### Margin & padding

**Definition:** Padding is space inside the border; margin is space outside. Vertical margins between block siblings can collapse.

* **Padding** — space inside border; affects background; does not collapse
* **Margin** — space outside border; can collapse

**Margin collapsing:** vertical margins of adjacent block siblings collapse to the larger value. Does not apply to flex/grid items, floated elements, or horizontal margins.

**Additional collapse cases:**

* **Parent + first/last child** — top margin of first child can collapse with parent's top margin; same for bottom
* **Empty block** — top and bottom margins of an empty block collapse into one
* **Prevention** — padding/border on parent, `overflow: auto`, `display: flow-root`, or flex/grid on parent stops collapse

**Negative margins:** pull elements visually; can break layout — use sparingly.

**Source:** [MDN — margin](https://developer.mozilla.org/en-US/docs/Web/CSS/margin)

</details>

<details>
  <summary>Containing block</summary>

### Containing block

**Definition:** The containing block is the reference box used to compute an element's position and percentage-based sizes.

The **containing block** is the box used to calculate an element's size and position (`top`, `left`, `width`, `height`, percentages).

| `position` | Containing block is |
|------------|---------------------|
| `static` / `relative` | Nearest block ancestor's **content box** |
| `absolute` | Nearest **positioned** ancestor (`relative`, `absolute`, `fixed`, `sticky`) padding edge; if none, initial containing block (viewport) |
| `fixed` | Viewport (or transform/filter ancestor in some browsers) |
| `sticky` | Nearest scroll ancestor's content box |

**Interview trap:** `position: relative` on parent does not change flow, but it **does** become the containing block for `position: absolute` children.

**Example:**

<details>
  <summary>Code</summary>

```css
.parent { position: relative; }
.child  { position: absolute; inset: 0; } /* fills .parent, not viewport */
```

</details>

Percentage `width`/`height` resolve against the containing block's width/height — if the containing block has no explicit height, `height: 100%` fails.

**MDN:** [Containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block)

**Source:** [MDN — Containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block)

</details>

<details>
  <summary>Intrinsic & extrinsic sizing</summary>

### Intrinsic & extrinsic sizing

**Definition:** Intrinsic sizing derives size from content (`min-content`, `max-content`); extrinsic sizing is imposed from outside (`width`, `flex`).

| Keyword | Meaning |
|---------|---------|
| `min-content` | Smallest size without overflow (longest word / widest unbreakable content) |
| `max-content` | Size needed to fit all content on one line |
| `fit-content` | `min(max-content, max(min-content, stretch))` — shrink but not below min-content |
| `auto` | Browser-dependent; in flex/grid often means `minmax(auto, max-content)` |

**Example:**

<details>
  <summary>Code</summary>

```css
.sidebar { width: min(240px, 25vw); }
.card    { width: fit-content; }
.grid-col { grid-template-columns: minmax(0, 1fr); } /* allow shrink below content */
```

</details>

**Extrinsic sizing** — size imposed from outside (`width: 300px`, `flex: 1`). **Intrinsic sizing** — size derived from content (`width: max-content`, `width: auto` on inline-block).

**Flex/grid trap:** default `min-width: auto` on flex items prevents shrinking below content — use `min-width: 0` or `minmax(0, 1fr)` in grid to allow truncation.

**Source:** [MDN — min-content](https://developer.mozilla.org/en-US/docs/Web/CSS/min-content)

</details>

<details>
  <summary>Block formatting context (BFC)</summary>

### Block formatting context (BFC)

**Definition:** A BFC is an isolated layout region where block boxes stack vertically and floats are contained.

**Key idea:** An isolated layout region where block boxes stack vertically and floats are contained.

**Creates a BFC:**

* `overflow` other than `visible` (`auto`, `hidden`, `scroll`)
* `display: flow-root` (preferred — no side effects)
* `display: flex` / `grid` on container
* `position: absolute` / `fixed`
* `float` other than `none`

**Why it matters:**

* Contains floated children (prevents parent height collapse)
* Prevents margin collapsing with outside elements
* Isolates layout for independent z-index stacking

**Example:**

<details>
  <summary>Code</summary>

```css
.clear-float-context {
  display: flow-root; /* modern clearfix replacement */
}
```

</details>

**Source:** [MDN — BFC](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context)

</details>

<details>
  <summary>display</summary>

### display

**Definition:** The `display` property defines how an element participates in layout — block, inline, flex, grid, or none.

| Value | Behavior |
|-------|----------|
| `block` | New line, full width available |
| `inline` | Flows with text, no width/height |
| `inline-block` | Inline flow, box model applies |
| `flex` | Flex container |
| `grid` | Grid container |
| `none` | Removed from layout and accessibility tree |
| `contents` | Box disappears; children remain |
| `flow-root` | Creates BFC; contains floats |

**Source:** [MDN — display](https://developer.mozilla.org/en-US/docs/Web/CSS/display)

</details>

<details>
  <summary>display: contents</summary>

### display: contents

**Definition:** `display: contents` makes the element's box disappear — its children participate in the parent's layout as if the wrapper were not there.

**How it works:**

- The element is not rendered as a box; children are hoisted to the parent formatting context.
- Useful for semantic wrappers (`<li>` around flex children, table fixups) without extra layout boxes.
- Pseudo-elements (`::before`/`::after`) on the `contents` element may still generate boxes.

| Pros | Cons |
|------|------|
| Semantic HTML without layout penalty | **Accessibility:** element removed from a11y tree in many browsers |
| Fixes table/flex participation issues | No box = no `background`, `border`, `padding` on wrapper |
| Cleaner grid/flex item lists | Unpredictable with positioned descendants |

**Cases:** List item wrappers in flex/grid layouts; table accessibility fixes. **Avoid** on interactive or landmark elements (`<button>`, `<nav>`, `<main>`) — use a real layout value or add explicit ARIA roles on children.

**Example:**

<details>
  <summary>Code</summary>

```css
/* Semantic <li> wrappers in a flex toolbar */
.toolbar > li {
  display: contents;
}

/* a11y warning — screen readers may skip the <li> box */
/* Prefer restructuring markup or use role="listitem" on children if needed */
```

</details>

**Source:** [MDN — display: contents](https://developer.mozilla.org/en-US/docs/Web/CSS/display#contents)

</details>

<details>
  <summary>visibility vs display</summary>

### visibility vs display

**Definition:** `display: none` removes an element from layout; `visibility: hidden` keeps its space but hides painting.

| Property | In layout? | Painted? | Events? |
|----------|------------|----------|---------|
| `display: none` | No | No | No |
| `visibility: hidden` | Yes | No | No |
| `opacity: 0` | Yes | No* | Yes (unless `pointer-events: none`) |

**Source:** [MDN — visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/visibility)

</details>

<details>
  <summary>overflow, aspect-ratio, object-fit</summary>

### overflow, aspect-ratio, object-fit

**Definition:** `overflow` clips or scrolls overflowing content; `aspect-ratio` and `object-fit` control media box proportions.

**Example:**

<details>
  <summary>Code</summary>

```css
.scroll-panel {
  overflow: auto;           /* scroll when needed */
  aspect-ratio: 16 / 9;
}

.cover-image {
  width: 100%;
  height: 200px;
  object-fit: cover;      /* fill box, crop */
  object-position: center;
}
```

</details>

**Source:** [MDN — object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)

</details>

<details>
  <summary>Logical properties</summary>

### Logical properties

**Definition:** Logical properties (`margin-inline`, `padding-block`) map to physical sides based on writing direction for i18n-friendly CSS.

Write direction-aware styles (RTL, vertical writing):

**Example:**

<details>
  <summary>Code</summary>

```css
.card {
  margin-inline: auto;      /* left+right in LTR */
  padding-block: 1rem;      /* top+bottom */
  border-inline-start: 2px solid blue;
}
```

</details>

Prefer logical properties in new code over physical `left`/`right` when supporting i18n.

**Source:** [MDN — Logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)

</details>

<details>
  <summary>scrollbar-gutter</summary>

### scrollbar-gutter

**Definition:** `scrollbar-gutter: stable` reserves scrollbar space to prevent layout shift when scrollbars appear.

Reserves space for scrollbar to prevent layout shift:

**Example:**

<details>
  <summary>Code</summary>

```css
html {
  scrollbar-gutter: stable;
}
```

</details>

Values: `auto` | `stable` | `stable both-edges`

---

**Source:** [MDN — scrollbar-gutter](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter)

</details>

<a name="layout-systems"></a>

## Layout Systems

<details>
  <summary>Positioning</summary>

### Positioning

**Definition:** `position` removes elements from normal flow (`absolute`, `fixed`) or offsets them (`relative`, `sticky`).

| Value | Containing block | Scroll behavior |
|-------|------------------|-----------------|
| `static` | Normal flow | Normal |
| `relative` | Self (offset from normal position) | Normal |
| `absolute` | Nearest positioned ancestor | Normal |
| `fixed` | Viewport | Fixed to viewport |
| `sticky` | Nearest scroll ancestor | Sticks within parent bounds |

**sticky requirements:** ancestor must not have `overflow: hidden`; `top`/`bottom`/`left`/`right` must be set; parent must be tall enough to scroll.

**sticky vs fixed:** `fixed` is always viewport-relative; `sticky` toggles between relative and fixed within its container's scroll range.

**Source:** [MDN — position](https://developer.mozilla.org/en-US/docs/Web/CSS/position)

</details>

<details>
  <summary>Stacking context & z-index</summary>

### Stacking context & z-index

**Definition:** A stacking context layers painted elements; `z-index` only compares within the same context.

`z-index` only works on **positioned** elements (`relative`, `absolute`, `fixed`, `sticky`) or flex/grid children.

**Paint (simplified, per box):** `background-color` → `background-image` → `border` → descendants → `outline`. Full stacking list below. Render pipeline → [1_html.md](./1_html.md).

**Stacking order (within one stacking context, back → front):**

```
1. Stacking contexts with negative z-index
2. In-flow, non-positioned blocks
3. Floated elements
4. In-flow inline elements
5. Positioned elements (z-index: auto / 0)
6. Positioned elements with positive z-index
7. Stacking contexts with z-index: auto that created a context (opacity, transform, etc.)
```

**Creates a new stacking context:**

* `position` + `z-index` (not `auto`) on positioned/flex/grid item
* `opacity < 1`
* `transform`, `filter`, `perspective`, `clip-path`
* `will-change` for transform/opacity/filter
* `isolation: isolate`
* `mix-blend-mode` other than `normal`

**Pitfall — child cannot escape parent context:**

```
┌─ .modal-backdrop (z-index: 100, creates context) ─┐
│  ┌─ .tooltip (z-index: 9999) ─┐  ← still BELOW     │
│  │  still inside parent layer  │     sibling modal  │
│  └─────────────────────────────┘                     │
└──────────────────────────────────────────────────────┘
```

**Fix:** move overlay/tooltip to a top-level portal, or ensure parent does not create an unintended stacking context.

**`isolation: isolate`** — force a new stacking context without side effects (useful for blend modes / z-index scoping).

**Example:**

<details>
  <summary>Code</summary>

```css
.card { isolation: isolate; }
.tooltip { z-index: 1; } /* competes only within .card */
```

</details>

**Blend modes (brief):**

```css
.overlay { mix-blend-mode: multiply; }
.hero    { background-blend-mode: overlay; }
```

**Source:** [MDN — Stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context)

</details>

<details>
  <summary>Flexbox</summary>

### Flexbox

**Definition:** One-dimensional layout: distribute space along a **main axis** (`row` or `column`).

**How it works:** `display: flex` / `inline-flex`. Main axis = `flex-direction`; cross axis is perpendicular. Items size with `flex` (`grow shrink basis`). Default `min-width: auto` (min-content) — set `min-width: 0` (column: `min-height: 0`) so items can shrink. `justify-self` does **not** apply to flex items — use `align-self` or `margin: auto`.

| Container | Role |
|-----------|------|
| `flex-direction` | `row` \| `row-reverse` \| `column` \| `column-reverse` |
| `flex-wrap` | `nowrap` \| `wrap` \| `wrap-reverse` |
| `justify-content` | Main axis: `flex-start` \| `center` \| `flex-end` \| `space-between` \| `space-around` \| `space-evenly` |
| `align-items` | Cross axis, one line: `stretch` \| `flex-start` \| `center` \| `flex-end` \| `baseline` |
| `align-content` | Extra cross-axis space when wrapped; ignored on a single line |
| `gap` | Space between items |

| Item | Role |
|------|------|
| `flex: 1` | `1 1 0%` — share leftover space evenly |
| `flex: auto` | `1 1 auto` — grow/shrink from content size |
| `flex: none` | `0 0 auto` — fixed; no grow/shrink |
| `flex: 0 0 240px` | Fixed sidebar |
| `align-self` | Override `align-items` |
| `order` | Visual reorder only — **not** tab order |

**Cases:** Toolbars, nav, card rows, centering, sidebar + main.

| + | − |
| --- | --- |
| Content-driven 1D alignment | Nested 2D layouts fight Flex — use Grid |
| `gap` + `margin: auto` for leftover space | `min-width: auto` overflows text unless reset |

**Example:**

<details>
  <summary>Code</summary>

```css
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.sidebar { flex: 0 0 240px; }
.main { flex: 1 1 auto; min-width: 0; }

.nav { display: flex; }
.nav .logo { margin-inline-end: auto; } /* leftover space → links right */
```

</details>

**Common pitfalls:** Overflow without `min-width: 0`. `order` vs a11y. Column flex: `justify-content` is **vertical**.

**Key idea:** One axis at a time — Flex for rows/columns; Grid when you need both.

**Source:** [MDN — Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout)

</details>

<details>
  <summary>CSS Grid</summary>

### CSS Grid

**Definition:** Two-dimensional layout: rows **and** columns on one container.

**How it works:** `display: grid` / `inline-grid`. Explicit tracks = `grid-template-columns` / `rows` / `areas`. Overflowing items create an **implicit** grid (`grid-auto-rows` / `columns` / `flow`). `fr` = share of free space; `minmax(min, max)` bounds a track — use `minmax(0, 1fr)` so tracks can shrink below content. Items: `grid-column` / `grid-row` / `grid-area`, `justify-self` / `align-self`. Align cells with `justify-items` / `align-items`; align the whole grid with `justify-content` / `align-content`. `gap` for gutters.

`repeat(auto-fit|auto-fill, minmax(280px, 1fr))`: **auto-fill** keeps empty tracks; **auto-fit** collapses them so remaining columns stretch. Areas: same cell count per row, rectangles only (no L-shapes), `.` for empty cells.

**Cases:** Page shells, dashboards, card matrices. Nested `subgrid` inherits parent tracks (align card title/body/footer across a row).

| + | − |
| --- | --- |
| 2D template + named areas | Overkill for a single toolbar row |
| `auto-fit` / `fr` without media queries | Implicit tracks surprise if `auto-flow` unset |

**Example:**

<details>
  <summary>Code</summary>

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.dashboard {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100dvh;
}
.header { grid-area: header; }

.grid {
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(120px, auto);
  grid-auto-flow: dense;
}

.card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
}
```

</details>

**Common pitfalls:** `1fr` that won’t shrink (use `minmax(0, 1fr)`). L-shaped `grid-template-areas`. Mixing Flex 2D nesting instead of Grid.

**Key idea:** Grid owns the 2D shell; Flex owns 1D alignment inside cells.

**Source:** [MDN — Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)

</details>

<details>
  <summary>Flex vs Grid — when to use which</summary>

### Flex vs Grid — when to use which

**Definition:** Flexbox excels at 1D component rows; Grid excels at 2D page shells and card matrices.

| | Flexbox | Grid |
|---|---------|------|
| Dimensions | 1D | 2D |
| Content-driven | Yes — items dictate flow | Yes — or template-driven |
| Gaps | `gap` | `gap` |
| Best for | Nav, rows, alignment | Page layout, card matrices |

Use both together: Grid for page shell, Flexbox inside cells.

**Source:** [web.dev — Flexbox vs Grid](https://web.dev/learn/css/grid/#grid-or-flexbox)

</details>

<details>
  <summary>Float (legacy)</summary>

### Float (legacy)

**Definition:** Floats pull elements out of flow for text wrapping; legacy for layout — prefer flex or grid.

Floats (`float: left/right`) pull elements out of flow; text wraps around them. Historically used for multi-column layouts.

**Problems:** collapsed parent height, clearing needed (`clearfix`, `overflow: hidden`, `display: flow-root`).

**Today:** use Flexbox or Grid. Floats remain valid for text-wrapping around images.

**How it works:**

- Floated element is taken out of normal block flow; inline content wraps around it.
- Parent often collapses to zero height unless it creates a BFC (`flow-root`, `overflow`, flex/grid).
- Clearing (`clear`, clearfix, `display: flow-root` on parent) stops following content from wrapping.

| Pros | Cons |
|------|------|
| Natural text wrap around images | Collapsed parent height without BFC |
| Still valid for magazine-style wrap | Clearing hacks (`clearfix`) add complexity |
| Works without flex/grid support | Multi-column layouts fragile vs Grid |

**Cases:** Image with text wrap; `shape-outside` for non-rectangular wrap. **Not** for page columns, nav bars, or card grids — use flex/grid.

**Example:**

<details>
  <summary>Code</summary>

```css
.figure {
  float: left;
  margin: 0 1rem 1rem 0;
  shape-outside: margin-box;
}

.article::after {
  content: "";
  display: table;
  clear: both; /* clearfix */
}
```

</details>

**Source:** [MDN — float](https://developer.mozilla.org/en-US/docs/Web/CSS/float)

</details>

<details>
  <summary>Centering cookbook</summary>

### Centering cookbook

**Definition:** Common patterns for horizontal, vertical, and full centering using margin, flex, grid, or absolute positioning.

**Example:**

<details>
  <summary>Code</summary>

```css
/* Horizontal — block element */
.center-h {
  width: fit-content;
  margin-inline: auto;
}

/* Vertical + horizontal — Flexbox */
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100dvh;
}

/* Vertical + horizontal — Grid */
.center-grid {
  display: grid;
  place-items: center;
  min-height: 100dvh;
}

/* Absolute center (known size) */
.center-abs {
  position: absolute;
  inset: 50%;
  transform: translate(-50%, -50%);
}
```

</details>

**Height 100% chain:** percentage height requires explicit height on every ancestor up to the containing block. Prefer `min-height: 100dvh` on `html, body` for full-viewport layouts.

```css
html, body {
  min-height: 100%;
}
/* or */
html {
  height: 100%;
}
body {
  min-height: 100%;
}
```

---

**Source:** [CSS for JS](https://learn.javascript.ru/css-for-js)

</details>

<a name="responsive-design"></a>

## Responsive Design & Container Queries

<details>
  <summary>Responsive vs adaptive</summary>

### Responsive vs adaptive

**Definition:** Responsive layouts scale fluidly; adaptive layouts switch at discrete breakpoints.

| Approach | Behavior |
|----------|----------|
| **Responsive** | Fluid layouts — one design scales smoothly (%, `fr`, `clamp`, flex/grid) |
| **Adaptive** | Discrete breakpoints — different layouts at fixed widths |

Modern practice: **mobile-first responsive** with breakpoints as enhancement.

**Source:** [web.dev — Responsive](https://web.dev/learn/design/responsive)

</details>

<details>
  <summary>Media queries</summary>

### Media queries

**Definition:** Media queries apply CSS based on viewport features — width, motion preference, color scheme, pointer type.

**Example:**

<details>
  <summary>Code</summary>

```css
/* Mobile-first: base styles, then enhance */
.card-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}
```

</details>

**Common breakpoints (guideline, not law):** 640px · 768px · 1024px · 1280px — tune to your content.

**Feature queries:**

```css
@supports (display: grid) {
  .layout { display: grid; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}

@media (prefers-color-scheme: dark) {
  :root { color-scheme: dark; }
}
```

**User preference media features:**

| Feature | Values | Use case |
|---------|--------|----------|
| `prefers-reduced-motion` | `reduce` | Disable/limit animations |
| `prefers-color-scheme` | `light` \| `dark` | Theme switching |
| `prefers-contrast` | `more` \| `less` | High-contrast UI |
| `prefers-reduced-transparency` | `reduce` | Solid backgrounds over glass |

**Input / device media features:**

| Feature | Values | Use case |
|---------|--------|----------|
| `(hover: hover)` | hover-capable device | Show hover-only UI on desktop |
| `(hover: none)` | touch-primary | Larger tap targets, no hover-dependent UX |
| `(pointer: fine)` | mouse/stylus | Dense UI |
| `(pointer: coarse)` | finger | Bigger buttons, more spacing |

```css
@media (hover: hover) and (pointer: fine) {
  .card:hover { transform: translateY(-2px); }
}

@media (hover: none) {
  .card-actions { opacity: 1; } /* always visible on touch */
}
```

**`@supports`** — feature detection for progressive enhancement (not browser sniffing):

```css
@supports (backdrop-filter: blur(1px)) {
  .glass { backdrop-filter: blur(12px); }
}
```

**Source:** [MDN — Media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries)

</details>

<details>
  <summary>Container queries</summary>

### Container queries

**Definition:** Container queries style elements based on their parent container's size, not the viewport.

Style based on **parent container size**, not viewport — essential for reusable components in sidebars, split views, etc.

**Example:**

<details>
  <summary>Code</summary>

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 120px 1fr;
  }
}

/* Shorthand */
@container (min-width: 30rem) {
  .widget { padding: 2rem; }
}
```

</details>

**When to use:** component adapts to its slot; media queries when layout depends on viewport (nav, page grid).

**`container-type`:**

| Value | Queries on |
|-------|------------|
| `inline-size` | Width only (most common) |
| `size` | Width and height |
| `normal` | Not a query container |

**Container query units** (relative to the query container, not viewport):

| Unit | Meaning |
|------|---------|
| `cqw` | 1% of container width |
| `cqh` | 1% of container height |
| `cqi` / `cqb` | Inline/block axis % |
| `cqmin` / `cqmax` | Smaller/larger of cqi and cqb |

```css
.card-container { container-type: inline-size; }

.card-title {
  font-size: clamp(1rem, 4cqi + 0.5rem, 1.5rem);
}
```

**Container queries vs media queries:** use `@container` when a **component** must adapt to its parent (sidebar widget, dashboard panel); use `@media` when layout depends on **viewport** (global nav, page grid).

**Source:** [MDN — Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)

</details>

<details>
  <summary>Units</summary>

### Units

**Definition:** CSS length units (`px`, `rem`, `%`, `vw`, `fr`, `dvh`) resolve relative to different reference boxes.

| Unit | Meaning | Pitfalls |
|------|---------|----------|
| `px` | Absolute pixels | Fine for borders; avoid for root font sizing |
| `%` | Relative to parent | Height % needs parent height |
| `em` | Relative to element font-size | Compounds when nested |
| `rem` | Relative to root font-size | Preferred for spacing/type scale |
| `ch` | Character width of "0" | Max line length (`max-width: 65ch`) |
| `vw` / `vh` | % of viewport | Mobile `100vh` includes URL bar — use `dvh`/`svh`/`lvh` |
| `fr` | Grid free space fraction | Grid only |
| `dvh` | Dynamic viewport height | Adapts when mobile browser chrome shows/hides |

**Fluid sizing with clamp:**

**Example:**

<details>
  <summary>Code</summary>

```css
h1 {
  font-size: clamp(1.5rem, 2vw + 1rem, 3rem);
}

.section {
  padding: clamp(1rem, 5vw, 4rem);
}
```

</details>

**Font size:** prefer `rem` for consistency; `em` when sizing relative to parent component (buttons inside a card).

**Math functions:**

```css
.sidebar {
  width: calc(100% - 240px);
  padding: max(1rem, 2vw);
  font-size: clamp(0.875rem, 0.8rem + 0.25vw, 1.125rem);
}
```

`calc()` — mix units (`%`, `px`, `rem`, `vw`). `min()` / `max()` — pick smallest/largest. `clamp(min, preferred, max)` — fluid values without media queries.

---

**Source:** [MDN — CSS values](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)

</details>

<details>
  <summary>CSS Custom Properties</summary>

### CSS Custom Properties

**Definition:** Custom properties (`--name`) are live CSS variables that cascade and inherit, enabling runtime theming.

**What they are:** Variables defined with `--name`, used with `var()`. Cascade and inherit like normal properties.

**Example:**

<details>
  <summary>Code</summary>

```css
:root {
  --color-primary: #2563eb;
  --space-md: 1rem;
  --radius: 8px;
}

.button {
  background: var(--color-primary);
  padding: var(--space-md);
  border-radius: var(--radius);
}

.button--danger {
  --color-primary: #dc2626; /* override in scope */
}

.theme-dark {
  --color-primary: #60a5fa;
}
```

</details>

**Fallback:** `var(--missing, fallback-value)`

**Scope:** set on `:root` for global; on a component class for local theming.

**vs Sass variables:** custom properties are live in the browser — runtime theming, media queries, and JS updates (`element.style.setProperty('--x', val)`).

**Source:** [MDN — Custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

</details>

<details>
  <summary>Native CSS nesting</summary>

### Native CSS nesting

**Definition:** Native nesting lets you write descendant and pseudo selectors inside a rule block without a preprocessor.

Supported in modern browsers (2023+). No preprocessor required:

**Example:**

<details>
  <summary>Code</summary>

```css
.card {
  padding: 1rem;

  & .title {
    font-weight: 700;
  }

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  }
}
```

</details>

---

**Source:** [MDN — Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)

</details>

<a name="scroll-touch-mobile"></a>

## Scroll, Touch & Mobile Viewport

<details>
  <summary>Scroll behavior</summary>

### Scroll behavior

**Definition:** Scroll-related properties control smooth scrolling, scroll chaining, and anchor offset for fixed headers.

**Example:**

<details>
  <summary>Code</summary>

```css
html {
  scroll-behavior: smooth; /* anchor links */
}

.modal-body {
  overflow-y: auto;
  overscroll-behavior: contain; /* no scroll chaining to body */
}
```

</details>

| Property | Values | Use case |
|----------|--------|----------|
| `scroll-behavior` | `auto` \| `smooth` | Smooth anchor navigation |
| `overscroll-behavior` | `auto` \| `contain` \| `none` | Prevent pull-to-refresh / bounce chaining |
| `scroll-padding-top` | length | Offset for fixed headers on anchor scroll |

**Legacy:** `-webkit-overflow-scrolling: touch` (momentum scroll on old iOS) — no longer needed on modern Safari.

**Source:** [MDN — overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior)

</details>

<details>
  <summary>Touch & pointer</summary>

### Touch & pointer

**Definition:** `touch-action` and pointer media queries adapt interaction for touch vs mouse devices.

**Example:**

<details>
  <summary>Code</summary>

```css
.carousel {
  touch-action: pan-x; /* horizontal swipe only */
}

.button {
  touch-action: manipulation; /* disable double-tap zoom delay */
}
```

</details>

| `touch-action` | Effect |
|----------------|--------|
| `auto` | Browser handles all gestures |
| `none` | Disable browser gestures (custom drag) |
| `pan-x` / `pan-y` | Allow scroll on one axis |
| `manipulation` | Pan + pinch-zoom; no double-tap delay |

Pair with media queries: `@media (pointer: coarse)` for larger hit areas on touch devices.

**Source:** [MDN — touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)

</details>

<details>
  <summary>Safe areas & viewport units</summary>

### Safe areas & viewport units

**Definition:** Safe-area insets and dynamic viewport units (`dvh`) handle notched devices and mobile browser chrome.

Notched devices and mobile browser chrome need extra padding:

**Example:**

<details>
  <summary>Code</summary>

```css
.header {
  padding-top: env(safe-area-inset-top);
  padding-inline: env(safe-area-inset-left) env(safe-area-inset-right);
}

.fullscreen {
  min-height: 100dvh; /* dynamic — adapts when URL bar hides */
  padding-bottom: env(safe-area-inset-bottom);
}
```

</details>

| Viewport unit | Behavior |
|---------------|----------|
| `vh` / `vw` | Static viewport — `100vh` can overflow on mobile |
| `dvh` / `dvw` | Dynamic — changes as browser UI shows/hides |
| `svh` | Small viewport (UI visible) |
| `lvh` | Large viewport (UI hidden) |

Enable safe-area: `<meta name="viewport" content="width=device-width, viewport-fit=cover">`

**Source:** [MDN — viewport units](https://developer.mozilla.org/en-US/docs/Web/CSS/length#viewport-percentage_lengths)

</details>

---

<a name="typography-colors"></a>

## Typography & Colors

<details>
  <summary>Font loading</summary>

### Font loading

**Definition:** `@font-face` and `font-display` control how web fonts load and swap to avoid invisible text.

**Example:**

<details>
  <summary>Code</summary>

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap; /* show fallback immediately, swap when loaded */
}
```

</details>

| `font-display` | Behavior |
|----------------|----------|
| `swap` | Text visible immediately; may FOUT |
| `optional` | Short block period; may keep fallback on slow networks |
| `block` | Invisible text during load (FOIT) — avoid |

**Variable fonts:** single file, `font-weight: 100 900` range, `font-variation-settings`.

**Stack:** `font-family: "Inter", system-ui, sans-serif;` — always end with generic family.

Match fallback metrics with `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` so the swap does not shift layout. CLS (FOIT/FOUT, preload, WOFF2, `unicode-range`) → [1_html.md — CLS](./1_html.md#cls-cumulative-layout-shift).

**Source:** [MDN — @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)

</details>

<details>
  <summary>Typography properties</summary>

### Typography properties

**Definition:** Typography properties control font size, line height, truncation, wrapping, and text rendering quality.

**Example:**

<details>
  <summary>Code</summary>

```css
body {
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 400;
  text-wrap: pretty;        /* reduce orphans */
}

.heading {
  font-size: clamp(1.25rem, 2vw + 1rem, 2rem);
  letter-spacing: -0.02em;
}

.truncate {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

</details>

* `line-height` — unitless preferred (1.5 scales with font-size)
* `line-clamp` — truncate multi-line text (use with `overflow: hidden`)
* `text-rendering: optimizeLegibility` — better kerning/ligatures; minor perf cost
* `text-decoration-skip-ink: auto` — underline skips glyph descenders

**Text overflow:**

```css
/* Single-line ellipsis */
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Multi-line clamp — see .truncate above */
```

**Word breaking:**

| Property | Effect |
|----------|--------|
| `overflow-wrap: break-word` | Break long words at arbitrary points if needed |
| `word-break: break-all` | Break anywhere (URLs, codes) |
| `hyphens: auto` | Language-aware hyphenation (`lang` attribute required) |

**`white-space` pitfalls:**

| Value | Behavior |
|-------|----------|
| `normal` | Collapse whitespace; wrap |
| `nowrap` | No wrap — needs `overflow: hidden` + ellipsis |
| `pre-wrap` | Preserve whitespace; wrap |

**Source:** [MDN — Typography](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text)

</details>

<details>
  <summary>text-wrap: balance / pretty</summary>

### text-wrap: balance / pretty

**Definition:** `text-wrap` controls how the browser breaks lines — `balance` evens line lengths in headings; `pretty` reduces orphans in body text.

**How it works:**

- `text-wrap: balance` — browser redistributes words across lines for more even line lengths (best for short headings).
- `text-wrap: pretty` — prefers breaks that avoid single-word last lines (orphans) in paragraphs.
- `text-wrap: wrap` — default wrapping behavior.

| Pros | Cons |
|------|------|
| Better typography without JS | `balance` can be costly on long text — use on headings only |
| Progressive enhancement | Check caniuse — growing support in Chromium/Safari/Firefox |
| Pairs with `text-wrap: nowrap` + ellipsis for UI | Not a substitute for manual `<wbr>` in URLs |

**Cases:** `balance` on `h1`–`h3` and card titles; `pretty` on article body copy; keep `nowrap` + ellipsis for table cells and badges.

**Example:**

<details>
  <summary>Code</summary>

```css
h1, h2, h3 {
  text-wrap: balance;
}

article p {
  text-wrap: pretty;
}
```

</details>

**Source:** [MDN — text-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap)

</details>

<details>
  <summary>Color formats</summary>

### Color formats

**Definition:** Modern color formats (`rgb()`, `hsl()`, `oklch()`, `color-mix()`) support perceptually uniform theming.

**Example:**

<details>
  <summary>Code</summary>

```css
.keyword   { color: navy; }
.hex       { color: #2563eb; }
.rgb       { color: rgb(37 99 235); }
.rgba      { color: rgb(37 99 235 / 80%); }
.hsl       { color: hsl(220 90% 56%); }
.oklch     { color: oklch(58% 0.22 264); }  /* perceptually uniform */
.mix       { color: color-mix(in oklch, blue 70%, white); }
.current   { border-color: currentColor; }
```

</details>

**Prefer `oklch` / `hsl` for theming** — easier to adjust lightness/saturation than hex.

**Source:** [MDN — color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)

</details>

<details>
  <summary>Gradients</summary>

### Gradients

**Definition:** CSS gradients (`linear-gradient`, `radial-gradient`) create smooth color transitions without image assets.

**Example:**

<details>
  <summary>Code</summary>

```css
.hero {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.badge {
  background: radial-gradient(circle at top left, #fff, #f0f0f0);
}

.shimmer {
  background: linear-gradient(
    90deg,
    #eee 25%,
    #f5f5f5 50%,
    #eee 75%
  );
  background-size: 200% 100%;
}
```

</details>

**Source:** [MDN — gradient](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient)

</details>

<details>
  <summary>Dark mode</summary>

### Dark mode

**Definition:** Dark mode uses `prefers-color-scheme` and custom properties to swap color tokens at runtime.

**Example:**

<details>
  <summary>Code</summary>

```css
:root {
  color-scheme: light dark;
  --bg: #fff;
  --text: #111;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #111;
    --text: #eee;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}
```

</details>

**Source:** [MDN — prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

</details>

<details>
  <summary>color-scheme & light-dark()</summary>

### color-scheme & light-dark()

**Definition:** `color-scheme` tells the browser which color schemes the page supports (affects scrollbars, form controls, `canvas`); `light-dark()` picks a value based on the used color scheme.

**How it works:**

- `color-scheme: light dark` on `:root` — page supports both; browser picks from `prefers-color-scheme` or author override.
- `color-scheme: dark` — hint dark-native UI chrome even if tokens are custom.
- `light-dark(light-value, dark-value)` — one declaration for both themes without duplicating rules.

| Pros | Cons |
|------|------|
| Native form control theming | `light-dark()` needs `color-scheme` set on root |
| Less `@media` duplication | Not a full design-token system — pair with custom properties |
| Scrollbar/UI chrome matches theme | Test contrast in both schemes |

**Cases:** Set `color-scheme: light dark` on `:root`; use `light-dark()` for borders and surfaces; combine with `prefers-color-scheme` for complex token swaps.

**Example:**

<details>
  <summary>Code</summary>

```css
:root {
  color-scheme: light dark;
  --surface: light-dark(#fff, #1a1a1a);
  --text: light-dark(#111, #eee);
  --border: light-dark(#e5e7eb, #333);
}

body {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}
```

</details>

**Source:** [MDN — color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) · [light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark)

</details>

<a name="decoration"></a>

## Decoration — Background, Border, Shadow

<details>
  <summary>Background</summary>

### Background

**Definition:** Background longhands control color, image, size, position, repeat, clip, and origin independently.

Prefer longhands when overriding a single sub-property — `background:` shorthand resets all sub-properties.

**Example:**

<details>
  <summary>Code</summary>

```css
.hero {
  background-color: #1e293b;
  background-image: url("/bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed; /* parallax-like; avoid on mobile */
  background-clip: border-box;
  background-origin: padding-box;
}
```

</details>

| Property | Purpose |
|----------|---------|
| `background-size` | `cover` \| `contain` \| explicit size |
| `background-position` | Anchor point (`center top`, `50% 50%`) |
| `background-repeat` | `repeat` \| `no-repeat` \| `space` \| `round` |
| `background-clip` | Paint area (`border-box`, `padding-box`, `text`) |
| `background-origin` | Positioning box for `background-position` |

Multiple backgrounds stack first-declared on top:

```css
.badge {
  background:
    linear-gradient(rgb(0 0 0 / 40%), rgb(0 0 0 / 40%)),
    url("/photo.jpg") center / cover no-repeat;
}
```

**Source:** [MDN — background](https://developer.mozilla.org/en-US/docs/Web/CSS/background)

</details>

<details>
  <summary>Border, outline & box-shadow</summary>

### Border, outline & box-shadow

**Definition:** Borders affect layout; outlines do not. `box-shadow` paints multiple layered shadows on the box.

**Example:**

<details>
  <summary>Code</summary>

```css
.card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  outline: 2px solid transparent; /* room for focus ring */
  outline-offset: 2px;
  box-shadow:
    0 1px 2px rgb(0 0 0 / 5%),
    0 8px 24px rgb(0 0 0 / 10%);
}
```

</details>

| Property | Notes |
|----------|-------|
| `border` | Shorthand — sets width, style, color on all sides |
| `border-radius` | Per-corner: `border-radius: 8px 8px 0 0` |
| `outline` | Does not affect layout (unlike border); use for focus |
| `box-shadow` | Multiple layers comma-separated; `inset` for inner shadow |

**`box-shadow` vs `filter: drop-shadow()`:**

| | `box-shadow` | `filter: drop-shadow()` |
|---|--------------|-------------------------|
| Follows | Box (including border-radius) | Alpha shape of content |
| SVG/images | Rectangular box only | Follows non-transparent pixels |
| Performance | Paint | Composite |

**Source:** [MDN — box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)

</details>

---

<a name="form-styling"></a>

## Form & Native Control Styling

<details>
  <summary>Customizing form controls</summary>

### Customizing form controls

**Definition:** Native form controls can be restyled with `appearance: none`, `accent-color`, and pseudo-element selectors.

**Example:**

<details>
  <summary>Code</summary>

```css
.input {
  appearance: none;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  accent-color: #2563eb;
}

.input::placeholder {
  color: #9ca3af;
}

.input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

input[type="file"]::file-selector-button {
  padding: 0.25rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #f9fafb;
}
```

</details>

| Technique | Applies to |
|-----------|------------|
| `appearance: none` | Remove OS chrome — rebuild with CSS |
| `accent-color` | Checkbox, radio, range, progress |
| `::placeholder` | Placeholder text color |
| `:focus-visible` | Custom focus ring |

**Cross-browser limits:** fully custom `<select>` dropdowns still inconsistent — use native `<select>` with `appearance: none` + custom arrow, or build a custom component with ARIA for full control.

**Source:** [MDN — appearance](https://developer.mozilla.org/en-US/docs/Web/CSS/appearance)

</details>

<details>
  <summary>Pure CSS toggle (no JavaScript)</summary>

### Pure CSS toggle (no JavaScript)

**Definition:** A hidden checkbox plus sibling selectors (`:checked +`) can drive a toggle UI without JavaScript.

iOS-style switch using hidden checkbox + sibling selector:

```html
<label class="switch">
  <input type="checkbox" class="switch__input" />
  <span class="switch__track" aria-hidden="true"></span>
</label>
```

**Example:**

<details>
  <summary>Code</summary>

```css
.switch__input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.switch__track {
  display: inline-block;
  width: 48px;
  height: 28px;
  background: #d1d5db;
  border-radius: 999px;
  position: relative;
  transition: background 0.2s ease;
  cursor: pointer;
}

.switch__track::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.switch__input:checked + .switch__track {
  background: #22c55e;
}

.switch__input:checked + .switch__track::after {
  transform: translateX(20px);
}

.switch__input:focus-visible + .switch__track {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

</details>

Uses `:checked` + adjacent sibling `+`. Keep native `<input type="checkbox">` for accessibility and form submission.

**Source:** [CSS for JS — forms](https://learn.javascript.ru/css-for-js)

</details>

---

<a name="print"></a>

## Print & Paged Media

<details>
  <summary>Print styles</summary>

### Print styles

**Definition:** `@media print` hides chrome, adjusts typography, and controls page breaks for printable output.

**Example:**

<details>
  <summary>Code</summary>

```css
@media print {
  nav, .sidebar, .ads, .no-print { display: none !important; }
  body {
    font-size: 12pt;
    color: #000;
    background: #fff;
  }
  a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 0.85em;
  }
  .page-break { break-before: page; }
  h1, h2, h3 { break-after: avoid; }
  img { max-width: 100% !important; }
}
```

</details>

| Property | Purpose |
|----------|---------|
| `break-before` / `break-after` | Force or avoid page breaks |
| `break-inside: avoid` | Keep block on one page |
| `print-color-adjust: exact` | Print background colors as designed |

**`@page` rule:**

```css
@page {
  margin: 2cm;
  size: A4 portrait;
}
```

Avoid dark backgrounds in print — wastes ink; expand URLs only when useful.

**Source:** [MDN — Print](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries#printing)

</details>

---

<a name="transforms-animations"></a>

## Transforms, Transitions & Animations

<details>
  <summary>transform</summary>

### transform

**Definition:** `transform` applies 2D/3D transforms without triggering layout — ideal for GPU-composited animation.

**Example:**

<details>
  <summary>Code</summary>

```css
.card:hover {
  transform: translateY(-4px) scale(1.02);
}

.spinner {
  transform: rotate(0deg);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

</details>

**GPU-friendly:** `transform` and `opacity` promote to compositor layer — smooth 60fps animations.

**translate vs absolute positioning for animation:** `translate()` does not trigger layout; `top`/`left` changes do. Always animate `transform`/`opacity` when possible.

**How it works:**

- `transform` applies a 2D/3D matrix to the element without changing layout flow (element still occupies original space unless combined with positioning).
- Functions compose right-to-left: `translateX(10px) rotate(45deg)` — rotate then translate in transformed space.
- `transform-origin` sets pivot point; `perspective` on parent enables 3D depth.
- Promotes element to compositor layer — repaints skip layout.

| Pros | Cons |
|------|------|
| GPU-composited — smooth 60fps | Does not affect document flow (ghost space remains) |
| No layout/reflow on change | 3D transforms can cause blurry text on subpixel layers |
| Composable functions | `transform` on parent creates containing block for `fixed` children |

**Cases:** Hover lift (`translateY`), spinners (`rotate`), scale on press, parallax (sparingly). Animate `transform` + `opacity` — never `top`/`left`/`width` for motion (those cause reflow and can raise [CLS](./1_html.md#cls-cumulative-layout-shift)).

**Source:** [MDN — transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)

</details>

<details>
  <summary>transition</summary>

### transition

**Definition:** `transition` animates property changes over time with duration, easing, and delay.

**Example:**

<details>
  <summary>Code</summary>

```css
.button {
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.button:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}
```

</details>

Shorthand: `transition: property duration timing-function delay`

**Avoid:** `transition: all` — lists every property; can animate expensive properties accidentally.

**How it works:**

- Browser interpolates from computed start value to end value when a property changes (class toggle, `:hover`, JS `style` change).
- Shorthand: `transition: property duration timing-function delay` — comma-separate for multiple properties.
- Only **animatable** properties transition; `display` generally does not (use `@starting-style` or `allow-discrete` where supported).
- `transition-behavior: allow-discrete` enables discrete transitions for `display`, `visibility`, etc. (modern browsers).

| Pros | Cons |
|------|------|
| Simple micro-interactions without JS | `transition: all` accidentally animates layout props |
| Composable easing per property | No control over mid-animation without JS |
| Respects `prefers-reduced-motion` if you gate it | Long durations on layout props cause jank |

**Cases:** Hover color/shadow changes; drawer `transform`; opacity fades. List explicit properties — `transition: opacity 0.2s, transform 0.2s`.

**Source:** [MDN — transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition)

</details>

<details>
  <summary>@keyframes animation</summary>

### @keyframes animation

**Definition:** `@keyframes` defines multi-step animations applied via the `animation` shorthand.

**Example:**

<details>
  <summary>Code</summary>

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.modal {
  animation: fade-in 0.3s ease forwards;
}
```

</details>

**Properties:** `animation-name` · `duration` · `timing-function` · `delay` · `iteration-count` · `direction` · `fill-mode` · `play-state`

**How it works:**

- `@keyframes` defines intermediate steps (`from`/`to` or `0%`/`100%`); `animation` shorthand applies them.
- `animation-fill-mode: forwards` keeps final keyframe state after end; `both` applies before and after.
- `animation-iteration-count: infinite` for loaders; `animation-play-state: paused` for hover control.
- Unlike `transition`, runs without a trigger property change — starts on load or when `animation-name` is set.

| Pros | Cons |
|------|------|
| Multi-step, looping, bidirectional | Harder to reverse mid-flight than transitions |
| Independent of property triggers | Animating layout props (`width`, `top`) causes reflow |
| `animation-timeline` for scroll-driven | Many simultaneous animations → GPU memory pressure |

**Cases:** Loaders (`infinite rotate`), entrance effects (`fade-in forwards`), attention pulses. Prefer `transform`/`opacity` keyframes; gate with `@media (prefers-reduced-motion: reduce)`.

**Source:** [MDN — @keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes)

</details>

<details>
  <summary>JS animation events</summary>

### JS animation events

**Definition:** `transitionend` and `animationend` fire when CSS animations complete — useful for DOM cleanup in JS.

**Example:**

<details>
  <summary>Code</summary>

```js
el.addEventListener('transitionend', (e) => {
  if (e.propertyName === 'opacity') { /* done */ }
});

el.addEventListener('animationend', () => { /* keyframes done */ });
```

</details>

Check `e.target === el` to avoid bubbling from children.

---

**Source:** [MDN — transitionend](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)

</details>

<a name="visual-effects"></a>

## Visual Effects

<details>
  <summary>Filters</summary>

### Filters

**Definition:** CSS `filter` applies graphical effects (blur, brightness, grayscale) to an element's rendered output.

**Example:**

<details>
  <summary>Code</summary>

```css
.blur-bg   { filter: blur(4px); }
.dim       { filter: brightness(0.8); }
.mono      { filter: grayscale(100%); }
.combined  { filter: contrast(1.2) saturate(1.1); }
```

</details>

Functions: `blur()` · `brightness()` · `contrast()` · `grayscale()` · `hue-rotate()` · `invert()` · `opacity()` · `saturate()` · `sepia()` · `drop-shadow()`

**How it works:**

- `filter` applies graphical effects to the **entire element** (including children) as a single bitmap.
- Functions chain left-to-right: `filter: contrast(1.2) brightness(0.9)`.
- `filter: opacity()` differs from `opacity` property — filter opacity does not create stacking context the same way.
- `drop-shadow()` follows alpha shape — better for icons than `box-shadow` on transparent PNGs.

| Pros | Cons |
|------|------|
| GPU-composited in many cases | Expensive on large elements (full repaint) |
| `drop-shadow` follows transparency | Chained filters multiply cost |
| No layout impact | `filter` on parent affects all descendants |

**Cases:** Image hover effects (`brightness`, `saturate`); disabled state (`grayscale`); icon shadows (`drop-shadow`). Avoid animating `filter: blur()` on full-screen overlays on mobile.

**Source:** [MDN — filter](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)

</details>

<details>
  <summary>clip-path & shape</summary>

### clip-path & shape

**Definition:** `clip-path` masks element shape; `shape-outside` lets floated content wrap around non-rectangular boxes.

**Example:**

<details>
  <summary>Code</summary>

```css
.avatar {
  clip-path: circle(50%);
}

.blob {
  clip-path: polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%);
}

.float-text {
  float: left;
  shape-outside: circle(50%);
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
```

</details>

**How it works:**

- `clip-path` masks visible area — content outside path is clipped, not scrolled.
- Basic shapes: `circle()`, `ellipse()`, `inset()`, `polygon()`, `path()`; `clip-path: url(#svg)` for complex SVG paths.
- `shape-outside` affects float wrap geometry only — element must be floated.
- `clip-path` triggers paint; animating complex paths can be costly.

| Pros | Cons |
|------|------|
| Non-rectangular avatars and heroes | Complex `polygon()` hard to maintain — use SVG |
| `shape-outside` for magazine layouts | `clip-path` does not affect hit-testing uniformly in all browsers |
| Animate with `@keyframes` on simple shapes | Float + `shape-outside` is legacy pattern |

**Cases:** Circular avatars (`circle(50%)`); diagonal section dividers (`polygon`); floated images with text wrap (`shape-outside`). Prefer `border-radius` when a circle suffices.

**Source:** [MDN — clip-path](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path)

</details>

<details>
  <summary>backdrop-filter</summary>

### backdrop-filter

**Definition:** `backdrop-filter` blurs or filters content behind semi-transparent elements (glass morphism).

**Example:**

<details>
  <summary>Code</summary>

```css
.glass {
  background: rgb(255 255 255 / 20%);
  backdrop-filter: blur(12px);
}
```

</details>

**Source:** [MDN — backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)

</details>

<details>
  <summary>SVG styling</summary>

### SVG styling

**Definition:** SVG elements use `fill` and `stroke` instead of `background` and `border`.

SVG uses `fill`, `stroke`, `stroke-width` instead of `background`/`border`:

**Example:**

<details>
  <summary>Code</summary>

```css
.icon {
  fill: currentColor;
  stroke: none;
}
```

</details>

**Source:** [MDN — SVG styling](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Fills_and_Strokes)

</details>

<details>
  <summary>scroll-snap</summary>

### scroll-snap

**Definition:** Scroll snap aligns scroll positions to defined points for carousels and paginated scroll areas.

**Example:**

<details>
  <summary>Code</summary>

```css
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 1rem;
}

.slide {
  scroll-snap-align: start;
  flex: 0 0 100%;
}
```

</details>

**Source:** [MDN — scroll-snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap)

</details>

<details>
  <summary>pointer-events & outline</summary>

### pointer-events & outline

**Definition:** `pointer-events` controls hit testing; `:focus-visible` provides keyboard-only focus rings.

**Example:**

<details>
  <summary>Code</summary>

```css
.overlay {
  pointer-events: none; /* clicks pass through */
}

.overlay .button {
  pointer-events: auto;
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

</details>

Use `:focus-visible` instead of `:focus` for keyboard-only focus rings.

---

**Source:** [MDN — :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)

</details>

<a name="modern-css"></a>

## Modern CSS (2024+)

Features worth knowing for interviews and new projects.

<details>
  <summary>@starting-style</summary>

### @starting-style

**Definition:** `@starting-style` defines entry styles for elements when they first appear (dialogs, popovers).

Entry animations for elements when they first appear (popover, dialog):

**Example:**

<details>
  <summary>Code</summary>

```css
.dialog {
  transition: opacity 0.3s, transform 0.3s;
  opacity: 1;
  transform: scale(1);
}

@starting-style {
  .dialog[open] {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

</details>

**How it works:**

- `@starting-style` defines the "before" state for elements entering the document or toggling `display` / `[open]` / popover states.
- Pairs with `transition` — browser interpolates from starting-style to normal rule on entry.
- Replaces JS `requestAnimationFrame` hacks for first-paint animations on `<dialog>`, `[popover]`, accordions.

| Pros | Cons |
|------|------|
| Pure CSS enter animations | Requires `transition-behavior: allow-discrete` for `display` in some cases |
| Works with popover/dialog APIs | Browser support still rolling out — check caniuse |
| No flash of unstyled final state | Exit animations still need separate rules or View Transitions |

**Cases:** Dialog/modal fade-in; popover scale entrance; list item expand. Combine with `@media (prefers-reduced-motion: reduce)`.

**Source:** [MDN — @starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style)

</details>

<details>
  <summary>CSS anchor positioning</summary>

### CSS anchor positioning

**Definition:** Anchor positioning places popovers relative to an anchor element without JavaScript measurements.

Position popovers/tooltips relative to an anchor element without JS measurements:

**Example:**

<details>
  <summary>Code</summary>

```css
.anchor {
  anchor-name: --trigger;
}

.tooltip {
  position: absolute;
  position-anchor: --trigger;
  inset-area: block-end;
}
```

</details>

**How it works:**

- Anchor element declares `anchor-name: --trigger`; positioned element references it via `position-anchor: --trigger`.
- `anchor()` function places edges relative to anchor: `top: anchor(bottom)`, `left: anchor(center)`.
- `position-area` / `inset-area` shorthand maps to logical sides (block-start, inline-end, etc.).
- `anchor-size()` can size popover to anchor width.

| Pros | Cons |
|------|------|
| No JS `getBoundingClientRect` for tooltips | Chromium-first — verify Firefox/Safari support |
| Scroll/resize aware by default | Fallback positioning logic still needed for viewport edges |
| Works with `position: fixed` popovers | Naming collisions if `--anchor` names reused |

**Cases:** Tooltips, dropdown menus, popovers anchored to buttons. Provide JS fallback or `@supports (anchor-name: --x)` progressive enhancement.

**Source:** [MDN — Anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning)

</details>

<details>
  <summary>Scroll-driven animations</summary>

### Scroll-driven animations

**Definition:** Scroll-driven animations tie keyframe progress to scroll position instead of time.

Animate tied to scroll progress (no JS scroll listeners):

**Example:**

<details>
  <summary>Code</summary>

```css
@keyframes reveal {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.reveal {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

</details>

**How it works:**

- `animation-timeline` binds keyframe progress to scroll or view progress instead of time.
- `scroll()` — tied to scroll container; `view()` — tied to element visibility in scrollport.
- `animation-range` maps scroll/view intervals to keyframe `0%`–`100%` (`entry`, `exit`, `cover`, `contain`).
- Runs on compositor — no `scroll` event listeners for parallax/reveal effects.

| Pros | Cons |
|------|------|
| No scroll JS — better performance | Limited browser support — progressive enhancement required |
| Smooth parallax and reveal | Harder to debug than time-based animations |
| Respects `prefers-reduced-motion` if gated | Complex ranges need experimentation |

**Cases:** Scroll-reveal sections; progress bars tied to scroll; header shrink on scroll. Fallback: `IntersectionObserver` + class toggle.

**Source:** [MDN — scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations)

</details>

<details>
  <summary>@scope</summary>

### @scope

**Definition:** `@scope` limits selector reach to a subtree for encapsulation without Shadow DOM.

Limit selector reach to a subtree (native encapsulation without Shadow DOM):

**Example:**

<details>
  <summary>Code</summary>

```css
@scope (.card) {
  :scope { padding: 1rem; }
  img { border-radius: 8px; } /* only images inside .card */
}
```

</details>

**How it works:**

- `@scope (root)` limits selector matching to descendants of `root` — like a lightweight Shadow DOM boundary.
- `:scope` refers to the scoping root element itself.
- `@scope (.a) to (.b)` sets an optional upper boundary — selectors don't escape past `.b`.
- Specificity unchanged — scope only affects **reach**, not weight.

| Pros | Cons |
|------|------|
| Component isolation without build tools | No style encapsulation against global `!important` |
| Flat selectors inside scope (`img` not `.card img`) | Browser support still maturing |
| Pairs with cascade layers | Overlapping scopes need careful root choice |

**Cases:** Card component styles without BEM prefixes; design-system widgets in CMS content. Prefer CSS Modules/Shadow DOM when hard isolation is required.

**Source:** [MDN — @scope](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope)

</details>

---

<a name="css-phase-2"></a>

## CSS Phase 2 (advanced)

Stub sections — expand as needed. MDN links for deep dives.

<details>
  <summary>Multi-column layout</summary>

### Multi-column layout

**Definition:** CSS multi-column layout flows text across columns like magazine layouts.

CSS columns for magazine-style text flow:

**Example:**

<details>
  <summary>Code</summary>

```css
.article {
  column-count: 3;
  column-gap: 2rem;
  column-rule: 1px solid #e5e7eb;
}
.break { break-inside: avoid; }
```

</details>

**MDN:** [Using multi-column layouts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_multicol_layout)

**Source:** [MDN — Multicol](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_multicol_layout)

</details>

<details>
  <summary>View Transitions API</summary>

### View Transitions API

**Definition:** View transitions animate shared elements and page state changes in SPAs.

Animate DOM state changes (SPA route changes, shared element transitions):

**Example:**

<details>
  <summary>Code</summary>

```css
.card { view-transition-name: hero; }
::view-transition-old(hero) { animation: fade-out 0.2s; }
::view-transition-new(hero) { animation: fade-in 0.2s; }
```

</details>

**How it works:**

- JS triggers `document.startViewTransition(() => { /* DOM update */ })` — browser snapshots old/new states.
- `view-transition-name` on elements pairs old/new snapshots for shared-element morphing.
- `::view-transition-old()` / `::view-transition-new()` pseudo-elements style crossfade layers.
- Default crossfade applies; custom keyframes override per named transition.

| Pros | Cons |
|------|------|
| SPA route transitions without FLIP JS | Requires JS API call — not pure CSS alone |
| Shared-element hero animations | Single transition at a time — no parallel VTs |
| Works with MPA via `@view-transition` rule (emerging) | Large DOM snapshots can be slow on low-end devices |

**Cases:** SPA page transitions; card-to-detail hero morph; theme toggle crossfade. Respect `prefers-reduced-motion` — skip or shorten transitions.

**MDN:** [View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)

**Source:** [MDN — View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)

</details>

<details>
  <summary>@property registered custom properties</summary>

### @property registered custom properties

**Definition:** `@property` registers typed custom properties that can be animated.

Make CSS variables animatable and typed:

**Example:**

<details>
  <summary>Code</summary>

```css
@property --angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
```

</details>

**How it works:**

- `@property --name` registers a custom property with `syntax`, `inherits`, and `initial-value`.
- Browser validates assignments — invalid values fall back to `initial-value` instead of invalidating the whole property.
- Registered properties with typed `syntax` can be **animated** in `@keyframes` (e.g. `--angle` from `0deg` to `360deg`).
- Unregistered `--vars` are treated as strings — no interpolation.

| Pros | Cons |
|------|------|
| Animatable gradients, colors, lengths via `--vars` | Verbose registration per property |
| Type safety for design tokens | `syntax` types must match assignments exactly |
| Enables Houdini-style extensibility | Fallback needed for browsers without `@property` |

**Cases:** Animated conic gradients (`--angle`); theme tokens with validation; color transitions on custom properties. Pair with `@supports` or progressive enhancement.

**MDN:** [@property](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)

**Source:** [MDN — @property](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)

</details>

<details>
  <summary>Relative color syntax</summary>

### Relative color syntax

**Definition:** Relative color syntax derives new colors from existing values (`oklch(from var(--brand) ...)`).

Derive colors from existing values:

**Example:**

<details>
  <summary>Code</summary>

```css
.theme {
  --brand: oklch(58% 0.22 264);
  --brand-muted: oklch(from var(--brand) l c h / 50%);
}
```

</details>

**MDN:** [Relative colors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors)

**Source:** [MDN — Relative colors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors)

</details>

<details>
  <summary>Table and list styling</summary>

### Table and list styling

**Definition:** Tables and lists have dedicated properties for borders, spacing, and markers.

`border-collapse`, `table-layout: fixed`, `list-style-type`, `list-style-position`. Use semantic `<table>` for tabular data; style with `thead`/`tbody` for zebra rows.

**Source:** [MDN — table-layout](https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout)

</details>

<details>
  <summary>Writing-mode and RTL</summary>

### Writing-mode and RTL

**Definition:** `writing-mode` and `direction` control text flow; pair with logical properties for RTL support.

`writing-mode: vertical-rl`, `direction: rtl` — pair with logical properties (`margin-inline`, `padding-block`). See **Logical properties** in Box Model section.

**Source:** [MDN — writing-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode)

</details>

---

<a name="architecture-tooling"></a>

## Architecture & Tooling

<details>
  <summary>BEM (Block Element Modifier)</summary>

### BEM (Block Element Modifier)

**Definition:** BEM is a naming convention: `block__element--modifier` for predictable, low-specificity CSS.

Naming convention for modular CSS:

**Example:**

<details>
  <summary>Code</summary>

```
block__element--modifier
```

```html
<button class="button button--primary button--large">
  <span class="button__icon">...</span>
  <span class="button__text">Submit</span>
</button>
```

</details>

| Part | Separator | Example |
|------|-----------|---------|
| Block | — | `button` |
| Element | `__` | `button__icon` |
| Modifier | `--` | `button--primary` |

**Pros:** predictable specificity, reusable blocks, team consistency  
**Cons:** verbose class names; not required if using CSS Modules or scoped frameworks

**Source:** [getbem.com](http://getbem.com/)

</details>

<details>
  <summary>CSS preprocessors (Sass/SCSS, Less)</summary>

### CSS preprocessors (Sass/SCSS, Less)

**Definition:** Preprocessors compile Sass/Less to CSS, adding variables, mixins, and nesting at build time.

Compile to CSS. Historically added variables, nesting, mixins, imports.

**Example:**

<details>
  <summary>Code</summary>

```scss
$primary: #2563eb;

@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  color: $primary;

  &__title {
    font-weight: 700;
  }
}
```

</details>

**Today:** native custom properties and nesting reduce the need for preprocessors. Sass still useful for `@mixin`, `@function`, and large design-token pipelines.

**Sass vs SCSS:** SCSS uses `{}` syntax (CSS-compatible); indented Sass syntax is less common.

**Source:** [Sass](https://sass-lang.com/)

</details>

<details>
  <summary>PostCSS & Autoprefixer</summary>

### PostCSS & Autoprefixer

**Definition:** PostCSS transforms CSS with plugins; Autoprefixer adds vendor prefixes from Browserslist config.

PostCSS transforms CSS with plugins. **Autoprefixer** adds vendor prefixes from [Browserslist](https://browsersl.ist/) config — do not hand-write `-webkit-` prefixes in 2025.

**How it works:**

- PostCSS parses CSS to an AST; plugins transform and stringify back — like Babel for CSS.
- **Autoprefixer** reads Browserslist (`> 1%, last 2 versions`) and adds only needed prefixes.
- Other plugins: `postcss-preset-env` (stage features), `cssnano` (minify), `postcss-nesting`, custom transforms.
- Runs at build time in Vite/Webpack — zero runtime cost.

| Pros | Cons |
|------|------|
| Write modern CSS; ship compatible CSS | Extra build step and config |
| Autoprefixer eliminates manual prefixes | Plugin order matters — can break if misconfigured |
| Ecosystem of transforms | Debugging generated CSS harder than source |

**Cases:** Autoprefixer for all production builds; `postcss-preset-env` for nesting/`color-mix` polyfills; `cssnano` for production minification. Set Browserslist in `package.json` — single source of truth.

**Example:**

<details>
  <summary>Code</summary>

```json
// package.json
"browserslist": ["> 1%", "last 2 versions", "not dead"]
```

```js
// postcss.config.js
export default {
  plugins: {
    'postcss-preset-env': { stage: 2 },
    autoprefixer: {},
    cssnano: process.env.NODE_ENV === 'production' ? {} : false,
  },
};
```

</details>

**Source:** [PostCSS](https://postcss.org/) · [Autoprefixer](https://github.com/postcss/autoprefixer)

</details>

<details>
  <summary>CSS Modules</summary>

### CSS Modules

**Definition:** CSS Modules scope class names at build time to prevent global style collisions.

Scope class names at build time — `import styles from './Button.module.css'` → unique hashes prevent global collisions.

**How it works:**

- Bundler renames `.button` → `.Button_button_x7f3a` at compile time.
- Import as JS object: `className={styles.button}` — typo-safe with TypeScript plugins.
- `:global(.foo)` escapes scoping for third-party overrides; `:local` is default.
- Composition: `composes: primary from './theme.module.css'`.

| Pros | Cons |
|------|------|
| No global namespace collisions | Class names unreadable in DevTools |
| Co-located styles with components | Dynamic class names need `styles[variant]` pattern |
| Works with any framework | No true DOM encapsulation — globals can still leak in |

**Cases:** React/Vue/Svelte component styles; design-system primitives; replacing BEM in SPAs. Pair with CSS custom properties for theming across modules.

**Example:**

<details>
  <summary>Code</summary>

```css
/* Button.module.css */
.button { padding: 0.5rem 1rem; }
.primary { composes: button; background: var(--brand); }
```

```jsx
import styles from './Button.module.css';
<button className={styles.primary}>Submit</button>
```

</details>

**Source:** [CSS Modules](https://github.com/css-modules/css-modules)

</details>

<details>
  <summary>Tailwind CSS (utility-first)</summary>

### Tailwind CSS (utility-first)

**Definition:** Tailwind applies atomic utility classes in HTML for rapid, token-consistent styling.

**Example:**

<details>
  <summary>Code</summary>

```html
<button class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
  Submit
</button>
```

</details>

| Pros | Cons |
|------|------|
| Fast prototyping | HTML verbosity |
| Consistent design tokens | Learning curve |
| Purged unused CSS in prod | Class precedence issues with dynamic classes |

**Class precedence:** Tailwind utilities have equal specificity — order in generated CSS matters, not HTML class order. Use `tailwind-merge` or arbitrary variants for conflicts.

**Source:** [Learn Tailwind — responsive card](https://www.freecodecamp.org/news/learn-tailwind-css-by-building-a-responsive-product-card/)

</details>

<details>
  <summary>Bootstrap</summary>

### Bootstrap

**Definition:** Bootstrap is a component framework with grid, utilities, and optional JS widgets.

Component framework with grid, utilities, and JS widgets. Good for rapid MVPs; learn underlying CSS to avoid fighting the framework.

**Source:** [Bootstrap](https://getbootstrap.com/docs/)

</details>

<details>
  <summary>CSS methodologies comparison</summary>

### CSS methodologies comparison

**Definition:** Methodologies (BEM, OOCSS, SMACSS, ITCSS) organize CSS for maintainability and team scale.

| Method | Idea |
|--------|------|
| **BEM** | Block/element/modifier naming |
| **OOCSS** | Separate structure and skin |
| **SMACSS** | Base, layout, module, state, theme categories |
| **ITCSS** | Inverted triangle — specificity layers |

---

**Source:** [CSS-Tricks — methodologies](https://css-tricks.com/poll-results-what-css-methodology-do-you-use/)

</details>

<a name="performance"></a>

## Performance

<details>
  <summary>Reflow, repaint, composite</summary>

### Reflow, repaint, composite

**Definition:** Style changes trigger style recalc, layout (reflow), paint, or composite — with different performance costs.

When CSS changes, the browser pays different costs:

| Step | Trigger examples | Cost |
|------|------------------|------|
| **Style recalc** | class change, `:hover` | Low–medium |
| **Layout (reflow)** | `width`, `height`, `margin`, `font-size`, DOM insert | High |
| **Paint** | `color`, `background`, `box-shadow`, `visibility` | Medium |
| **Composite** | `transform`, `opacity`, `filter` | Low (GPU) |

**Rule:** animate `transform` and `opacity`; avoid layout properties in animation loops. Batch DOM reads/writes in JS to avoid layout thrashing.

**Notes:** Full pipeline, dirty/global layout, rAF vs interval → [1_html.md — Browser & rendering](./1_html.md#browser--rendering). Property → layout/paint/composite → [CSS Triggers](https://csstriggers.com/). Field metrics (LCP / INP / CLS) → [6_web_api.md — Core Web Vitals](./6_web_api.md#core-web-vitals). INP phases/fixes → [6_web_api.md — INP](./6_web_api.md#inp-interaction-to-next-paint). Layout-shift metric → [CLS](./1_html.md#cls-cumulative-layout-shift).

**Layout reflow triggers (non-exhaustive):** `width`, `height`, `min-*`, `max-*`, `margin`, `padding`, `border`, `font-size`, `line-height`, `display`, `position`, `top`/`left`, `flex-*`, `grid-*`, DOM insert/remove, reading `offsetHeight`/`getBoundingClientRect()` after a write.

**Decision tree:**

```
Need to animate?
├─ transform / opacity only → Composite (best)
├─ color / box-shadow / background → Paint (ok for short transitions)
└─ width / height / margin / top → Layout (expensive — avoid in loops)
```

**Source:** [web.dev — Rendering performance](https://web.dev/articles/critical-rendering-path)

</details>

<details>
  <summary>Critical CSS</summary>

### Critical CSS

**Definition:** Critical CSS inlines above-the-fold styles to reduce render-blocking and improve first paint.

Inline or preload CSS required for **above-the-fold** content to reduce render-blocking.

Benefits: faster first paint, better LCP, improved mobile performance.

**Source:** [web.dev — Extract critical CSS](https://web.dev/articles/extract-critical-css)

</details>

<details>
  <summary>Compositor layers & GPU</summary>

### Compositor layers & GPU

**Definition:** Compositor layers isolate GPU-friendly properties (`transform`, `opacity`) for smooth animation.

Properties that typically composite on GPU (no layout/paint): `transform`, `opacity`, `filter`, `will-change`.

**Compositor layer triggers:** `transform`, `opacity < 1`, `filter`, `will-change`, `position: fixed`, video/canvas, etc.

**Pitfall:** too many layers → high memory use → crashes on mobile. Do not sprinkle `will-change` everywhere; apply before animation, remove after.

**`will-change` guidelines:**

| Do | Don't |
|----|-------|
| Add briefly before a known animation | Leave on dozens of elements permanently |
| Use `will-change: transform` for hover lifts | Use `will-change: auto` everywhere "just in case" |
| Remove after `transitionend` / `animationend` | Expect it to fix layout bugs |

**Source:** [web.dev — Layers](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count)

</details>

<details>
  <summary>contain & content-visibility</summary>

### contain & content-visibility

**Definition:** `contain` isolates layout/paint; `content-visibility: auto` skips rendering off-screen content.

**Example:**

<details>
  <summary>Code</summary>

```css
.card-list-item {
  contain: layout style paint;
}

.below-fold {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
```

</details>

`content-visibility: auto` skips rendering off-screen content — major perf win for long lists.

**Pattern for long pages:**

```css
.section {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px; /* placeholder height prevents scrollbar jump */
}
```

Browser skips layout/paint for off-screen sections; `contain-intrinsic-size` reserves approximate space so scroll position stays stable.

| `contain` value | Isolates |
|-----------------|----------|
| `layout` | Internal layout from affecting outside |
| `style` | Counters, quotes |
| `paint` | Painting to element box |
| `size` | Size as if empty (use carefully) |
| `strict` | `layout style paint size` |

**Source:** [MDN — content-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility) · INP / large DOM: [6_web_api.md](./6_web_api.md#inp-interaction-to-next-paint)

</details>

<details>
  <summary>CSS sprites (historical)</summary>

### CSS sprites (historical)

**Definition:** Sprites pack multiple icons in one image, positioned via `background-position` — largely replaced by SVG.

One image, multiple icons via `background-position`. Less relevant with HTTP/2, SVG icons, and icon fonts — but still valid for legacy sprite sheets.

**How it works:**

- Single raster image contains all icons at fixed coordinates.
- Each icon element sets `background-image: url(sprite.png)`, fixed `width`/`height`, and negative `background-position` to show the correct tile.
- HTTP/1.1 reduced requests — one image vs many; HTTP/2 reduces this advantage.

| Pros | Cons |
|------|------|
| Fewer HTTP requests on HTTP/1 | Painful to maintain — pixel math on every icon add |
| Consistent icon sizing in one asset | Retina requires `@2x` sprite sheets |
| No JS required | SVG icons + icon components are the modern default |

**Cases:** Legacy enterprise sites; email templates (limited SVG support). **Today:** inline SVG, SVG sprites (`<symbol>` + `<use>`), or icon fonts — not raster sprites.

**Example:**

<details>
  <summary>Code</summary>

```css
.icon-home {
  width: 24px;
  height: 24px;
  background: url("icons.png") no-repeat 0 0;
}
.icon-search {
  background-position: -24px 0;
}
```

</details>

**Source:** [MDN — background-position](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position)

</details>

<details>
  <summary>Shorthand pitfalls</summary>

### Shorthand pitfalls

**Definition:** CSS shorthands reset omitted sub-properties to initial values — use longhands when overriding one sub-property.

Shorthand resets unspecified sub-properties to initial values:

**Example:**

<details>
  <summary>Code</summary>

```css
/* Dangerous — resets background-image, position, etc. */
background: #fff;

/* Safer when overriding one sub-property */
background-color: #fff;
```

</details>

---

**Source:** [MDN — Shorthand properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties)

</details>

<details>
  <summary>Accessibility in CSS</summary>

### Accessibility in CSS

**Definition:** Accessible CSS respects motion preferences, preserves focus indicators, and maintains sufficient contrast.

**Example:**

<details>
  <summary>Code</summary>

```css
/* Respect motion preferences */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Keyboard focus only */
:focus { outline: none; }
:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Screen-reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Sufficient contrast — aim WCAG AA: 4.5:1 body text, 3:1 large text */
```

</details>

Never remove focus indicators without a `:focus-visible` replacement.

---

**Source:** [MDN — Accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/CSS_and_JavaScript)

</details>

---

<a name="interview-practice"></a>

<details>
  <summary>Interview Practice</summary>

### Interview Practice

Questions and hands-on tasks from [0_interview.md](0_interview.md). HTML-only topics → [1_html.md](1_html.md). Render pipeline → [1_html.md](./1_html.md).

Try answering before opening solutions.

### Original questions (from 0_interview.md)

**Junior — CSS / layout (Q53–61)**

53. What is the CSS box model?  
54. What centering techniques do you know (horizontal and vertical)?  
55. What layout approaches do you know (float, flex, grid, etc.)?  
56. How do you make an application responsive?  
58. Why do some CSS properties need vendor prefixes (`-webkit-`, `-moz-`, etc.)?  
59. How do you simplify cross-browser styling?  
60. Practical: review and fix a bad CSS or HTML example.  
61. What are CSS preprocessors? Which have you used? What do they add over standard CSS?

> Q57 (semantic layout) → [1_html.md](1_html.md)

**CSS / layout (Q57–73, CSS only)**

57. Explain the difference between `px`, `em`, and `rem`.  
58. What are CSS custom properties for? Give usage examples.  
59. What happens when you add `* { box-sizing: border-box; }`?  
60. How do you adapt a page for print?  
61. Describe styling native form controls.  
62. What is progressive rendering? What approaches exist?  
63. Name ways to lazy-load media on a page.  
65. Name popular CSS methodologies and their differences.  
66. How does CSS Grid work?  
67. Which image formats support animation?  
68. How do you track CSS `@keyframes` or `transition` end in JS?  
69. Which CSS properties are GPU-composited? What are compositor layers?  
70. How do you reuse inline SVG elements on a page?  
73. What is faux bold or faux italic font rendering?

> Q64 (templating), Q71–72, Q74–77 (SVG opt, shadow DOM, canvas) → [1_html.md](1_html.md) or general frontend

### Question index

| # | Topic | Answer below |
|---|-------|--------------|
| 53 | Box model | Box model |
| 54 | Centering | Centering |
| 55 | float / flex / grid | Layout approaches |
| 56 | Responsive app | Responsive |
| 58–59 | Vendor prefixes / cross-browser | Vendor prefixes |
| 60 | Review bad CSS | Bad CSS review + Task 6 |
| 61 | Preprocessors | Preprocessors |
| 57† | px / em / rem | Units |
| 58† | CSS variables | Custom properties |
| 59† | `* { box-sizing }` | Universal box-sizing |
| 60† | Print styles | Print styles |
| 61† | Form styling | Form styling |
| 62† | Progressive rendering | Progressive rendering |
| 63† | Lazy-loading media | Lazy-loading |
| 65† | CSS methodologies | Methodologies |
| 66† | CSS Grid | Grid |
| 67† | Animated image formats | Animated images |
| 68† | Animation events in JS | Animation JS + Task 8 |
| 69† | GPU / compositor layers | GPU layers |
| 70† | Reuse inline SVG | Reuse SVG |
| 73† | Faux bold/italic | Faux fonts |
| — | BFC, reflow, flex overflow, implicit grid | See Q&A |
| — | Containing block | Containing block |
| — | `min-width: 0` in flex | Flex min-width |
| — | `auto-fit` vs `auto-fill` | Auto-fit vs auto-fill |
| — | Intrinsic vs extrinsic sizing | Intrinsic sizing |
| — | `100vh` vs `100dvh` | Viewport units |
| — | `@supports` | Supports queries |
| — | Stacking context | Stacking context |
| — | `box-shadow` vs `drop-shadow` | Shadow vs drop-shadow |
| — | Native `<select>` limits | Select styling |
| — | Pure CSS toggle | CSS toggle |
| 45 | iPhone toggle without JS | CSS toggle + Task 15 |
| Q13 | Cache busting CSS/JS | Cache busting |

† Advanced block · Semantic layout (Q57) → [1_html.md](1_html.md)

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

**Cases:** Hide modals off-screen → `display: none` or `hidden` attribute; preserve layout while loading → `visibility: hidden`; fade transitions → `opacity` + `pointer-events: none`.

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

**Cases:** Prefer low-specificity classes + `@layer` over IDs/`!important`; use `:where()` for resets; `:is(.a, #x)` inherits `#x` specificity — avoid accidental weight.

</details>

<details>
  <summary>vh/vw pitfalls?</summary>

### vh/vw pitfalls?

**Definition:** `100vh` on mobile includes browser chrome inconsistently — use `dvh`. Font sizes in `vw` alone scale poorly — use `clamp()`. Percentage heights need defined parent height.

**How it works:**

- `vh`/`vw` — relative to viewport size; `100vh` = full viewport height but mobile URL bar causes overflow jumps.
- `dvh`/`svh`/`lvh` — dynamic/small/large viewport units adapt to mobile chrome.
- `%` height requires explicit height on every ancestor — percentage resolves against containing block.

**Cases:** Full-screen hero → `min-height: 100dvh`; fluid type → `clamp(1rem, 2vw + 0.5rem, 2rem)` not raw `vw`; child `height: 100%` → set `html, body { height: 100% }` chain.

</details>

<details>
  <summary>Best units for font-size?</summary>

### Best units for font-size?

**Definition:** `rem` for global scale (root-relative). `em` for component-relative sizing. Avoid `px` for user-resizable root text.

**How it works:**

- `rem` — relative to root `font-size` (usually 16px); predictable, doesn't compound when nested.
- `em` — relative to **element's own** `font-size`; compounds in nested components.
- `px` — absolute; ignores user browser font-size settings unless root is in `px`.

**Cases:** Body/heading scale → `rem`; button padding relative to button text → `em`; borders/shadows → `px` is fine.

</details>

<details>
  <summary>Why avoid shorthand carelessly?</summary>

### Why avoid shorthand carelessly?

**Definition:** Shorthand resets omitted sub-properties (e.g. `background:` clears `background-image`). Use longhand when overriding single sub-properties.

**How it works:**

- Shorthand sets all sub-properties — omitted ones reset to initial values, not inherit.
- `background: #fff` wipes `background-image`, `background-position`, etc.
- `font: 400 1rem/1.5 sans-serif` resets `font-stretch`, `font-variant`, etc.

**Cases:** Override only `background-color` → use longhand; set full font stack once with shorthand on `body`, then longhand tweaks on children.

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

**Cases:** Large teams → BEM or ITCSS; utility-heavy SPAs → Tailwind replaces much of BEM; CSS Modules scopes without verbose names.

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

**Cases:** Grid layout with flex fallback; `backdrop-filter` glass effect behind solid fallback; container queries with media query fallback.

</details>

<details>
  <summary>position: sticky not working?</summary>

### position: sticky not working?

**Definition:** Check: ancestor `overflow: hidden/auto`, missing `top`/`bottom`, parent not scrollable, insufficient parent height, element not in scroll container.

**How it works:**

- `sticky` sticks within its **nearest scroll ancestor** while offset (`top`) is satisfied.
- Any ancestor with `overflow: hidden|auto|scroll` (not `visible`) becomes the scroll container — sticky may stick inside a small box instead of viewport.
- Sticky element needs room to scroll within parent — parent must be taller than sticky child.

**Cases:** Debug checklist: (1) set `top: 0`; (2) check ancestor `overflow`; (3) ensure scroll container has height; (4) no `display: table` parent quirks.

</details>

<details>
  <summary>Styling SVG?</summary>

### Styling SVG?

**Definition:** Use `fill`, `stroke`, `stroke-width`. `currentColor` inherits text color. Some HTML properties do not apply.

**How it works:**

- Inline SVG inherits CSS from the document; `fill`/`stroke` replace `background`/`border`.
- `currentColor` on `fill` or `stroke` syncs with `color` — easy theme integration.
- External SVG via `<img>` cannot be styled with CSS — use inline SVG or `mask-image`.

**Cases:** Icon systems → inline SVG + `fill: currentColor`; hover states via CSS on `.icon path`; sprites with `<symbol>` + `<use>`.

</details>

<details>
  <summary>px vs em vs rem?</summary>

### px vs em vs rem?

**Definition:** Use `rem` for global typography and spacing; `em` for component-internal scaling (button padding relative to button font-size).
* **px** — absolute CSS pixels; fine for borders/shadows; poor for accessible root scaling
* **em** — relative to **element's** `font-size`; compounds when nested
* **rem** — relative to **root** `font-size`; predictable spacing/type scale

**How it works:** `px` is absolute CSS pixels; `em` compounds from parent `font-size`; `rem` always references `<html>` font-size — one source of truth for type/spacing scales.

**Cases:** Global typography → `rem`; component-internal padding → `em`; hairline borders → `px`.

</details>

<details>
  <summary>What happens with * { box-sizing: border-box; }?</summary>

### What happens with * { box-sizing: border-box; }?

**Definition:** Every element (and pseudo-elements if included) uses `border-box` sizing: `width`/`height` include padding and border. Prevents padding from blowing out fixed layouts. Standard reset pattern:

**Example:**

<details>
  <summary>Code</summary>

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

</details>

Does not affect margin. Inherited by descendants if you set it on `html` instead of `*`.

**How it works:** `border-box` includes padding and border in `width`/`height` — a 200px box with 20px padding stays 200px total, not 240px.

**Cases:** Universal reset on `*, *::before, *::after`; alternative: set on `html { box-sizing: border-box }` and `inherit` on children.

</details>

<details>
  <summary>How do you adapt a page for print?</summary>

### How do you adapt a page for print?

**Definition:** Use `print` media query; avoid dark backgrounds; expand links if useful; control page breaks with `break-before` / `break-after`. Full conspect: **Print & Paged Media**.
**Example:**

<details>
  <summary>Code</summary>

```css
@media print {
  nav, .sidebar, .ads { display: none; }
  body { font-size: 12pt; color: #000; background: #fff; }
  a[href]::after { content: " (" attr(href) ")"; }
  .page-break { break-before: page; }
}
```

</details>

**How it works:** `@media print` applies only when printing or PDF export; hide non-essential UI; force light backgrounds for ink savings; `break-*` controls pagination.

**Cases:** Hide nav/ads; expand `href` in links; set `12pt` body font; `break-inside: avoid` on figures/tables.

</details>

<details>
  <summary>How do you customize native form element styles?</summary>

### How do you customize native form element styles?

**Definition:** Fully styling `<select>` still limited cross-browser — consider custom dropdown component for full control. Full conspect: **Form & Native Control Styling**.
* `appearance: none` — remove OS default chrome (then rebuild with CSS)
* `accent-color` — checkboxes, radios, range inputs
* `::placeholder` — placeholder text
* `::file-selector-button` — file input button
* `:focus-visible` — custom focus ring

**How it works:** `appearance: none` strips OS chrome — you rebuild borders/arrows; `accent-color` tints native controls; dropdown list styling remains OS-controlled.

**Cases:** Custom checkbox/radio with `appearance: none` + pseudo-elements; `<select>` closed state only — full control needs custom component with ARIA.

</details>

<details>
  <summary>What is progressive rendering?</summary>

### What is progressive rendering?

**Definition:** Deliver content in stages so users see something fast — CSS/media techniques on top of the HTML critical path.

1. **Critical CSS** inlined for above-the-fold
2. **Async/defer** non-critical CSS
3. **`content-visibility: auto`** for below-fold sections
4. **Lazy-load** images/fonts
5. **Skeleton screens** while data loads

Goal: improve FCP/LCP without blocking render on the full CSS bundle.

**How it works:** Browser paints incrementally — critical CSS blocks first paint; deferring the rest and lazy content lets users see a shell faster.

**Cases:** Inline critical CSS for above-fold; async load rest; `content-visibility: auto` on long pages; skeleton placeholders.

**Notes:** Pipeline definition and interview answer → [1_html.md — Progressive rendering](./1_html.md#browser--rendering).

</details>

<details>
  <summary>Lazy-loading media on a page?</summary>

### Lazy-loading media on a page?

**Definition:** CSS-only background images: Intersection Observer in JS, or `content-visibility` for sections. Responsive images: `srcset` + `sizes`. Fonts: `font-display: swap`, subset fonts, preload only critical weights.
**Example:**

<details>
  <summary>Code</summary>

```html
<img src="photo.jpg" loading="lazy" decoding="async" alt="...">
<iframe loading="lazy" src="..."></iframe>
```

</details>

**How it works:** `loading="lazy"` defers off-screen image/iframe fetch until near viewport; `decoding="async"` avoids blocking main thread; fonts via `font-display: swap` + preload critical weights only.

**Cases:** Below-fold images; hero image `fetchpriority="high"` + no lazy; background images need `IntersectionObserver` or `content-visibility`.

</details>

<details>
  <summary>How do you review and fix bad CSS?</summary>

### How do you review and fix bad CSS?

**Definition:** Checklist for live coding / code review:.
1. **Specificity wars** — replace IDs/`!important` with simpler selectors or `@layer`
2. **Magic numbers** — use custom properties or spacing scale
3. **Float layouts** — migrate to flex/grid
4. **Missing `box-sizing`** — add border-box reset
5. **Non-responsive fixed widths** — use `max-width`, `clamp`, `minmax`
6. **Deep nesting** — flatten selectors; avoid `.a .b .c .d`
7. **Shorthand accidents** — longhand when overriding one sub-property
8. **Accessibility** — focus styles, contrast, `prefers-reduced-motion`

**How it works:** Interview code review tests whether you spot maintainability, performance, and a11y issues — not just "does it look right."

**Cases:** Live coding — narrate each fix; prefer `@layer` over `!important`; migrate floats to grid; add `min-width: 0` on flex text overflow.

</details>

<details>
  <summary>Faux bold and faux italic fonts?</summary>

### Faux bold and faux italic fonts?

**Definition:** When the browser synthesizes bold/italic because the exact font weight/style file is missing. Looks worse than real font files.
**Fix:** load the actual `font-weight` / `font-style` variants in `@font-face`, or use a variable font with full axis range. Avoid `font-weight: 700` if only `400` is loaded.

**How it works:** Browser synthesizes bold/italic when the requested weight/style file is missing — slanted geometry, not true italic glyphs.

**Cases:** Load `font-weight: 400 700` range in variable font; or separate `@font-face` per weight; check DevTools → Computed → rendered font.

</details>

<details>
  <summary>Image formats that support animation?</summary>

### Image formats that support animation?

**Definition:** CSS `animation` / `@keyframes` animates properties — not the same as animated image formats.
* **GIF** — legacy, 256 colors, large files
* **APNG** — PNG-based, better quality than GIF
* **WebP** — animated WebP, good compression
* **AVIF** — animated AVIF, best compression, growing support

**How it works:** Distinct from CSS `@keyframes` — these are raster/vector **file formats** with multiple frames. `<img>` or `<video>` displays them; CSS animates properties on elements, not file frames.

**Cases:** Short loops → WebP/APNG; best compression → AVIF; legacy email → GIF; complex motion → prefer `<video>` or Lottie.

</details>

<details>
  <summary>How do you reuse inline SVG icons?</summary>

### How do you reuse inline SVG icons?

**Definition:** Define once, reference with `<use>`:.
**Example:**

<details>
  <summary>Code</summary>

```html
<svg style="display:none">
  <symbol id="icon-close" viewBox="0 0 24 24">
    <path d="M6 6l12 12M18 6L6 18"/>
  </symbol>
</svg>

<svg class="icon"><use href="#icon-close"/></svg>
```

</details>

Style with `fill: currentColor`. For many icons, use an SVG sprite sheet or icon component library.

**How it works:** `<symbol>` defines geometry once; `<use href="#id">` instances reference it — one DOM definition, many renders. `currentColor` on `fill` inherits text `color`.

**Cases:** Icon button → `<svg class="icon"><use href="#icon-close"/></svg>`; React → wrap in component; large sets → SVGO-optimized sprite or icon font alternative.

</details>

<details>
  <summary>What is a Block Formatting Context (BFC)?</summary>

### What is a Block Formatting Context (BFC)?

**Definition:** An isolated layout box where blocks stack vertically and floats are contained inside. Create with `display: flow-root`, `overflow: auto/hidden`, flex/grid container, or `float`. Used to clear floats, prevent margin collapse, and isolate layout.

**How it works:** BFC is an independent layout region — floats don't escape; margins of adjacent blocks collapse only within the same BFC; `flow-root` is the modern clearfix replacement.

**Cases:** Contain floats → `display: flow-root` on parent; prevent margin collapse between siblings → separate BFCs; isolate z-index stacking.

</details>

<details>
  <summary>Reflow vs repaint vs composite?</summary>

### Reflow vs repaint vs composite?

**Definition:** Layout/reflow — geometry changes (`width`, `margin`). Paint — visual changes without layout (`background`, `color`). Composite — GPU layers (`transform`, `opacity`). Prefer compositor-friendly properties for animations.

**How it works:** Style change → recalc → layout (if geometry) → paint (if pixels) → composite (if layers). Each step costs more than the previous for large pages.

**Cases:** Animate `transform`/`opacity` only; batch DOM reads/writes; `will-change` sparingly — overuse creates memory pressure.

</details>

<details>
  <summary>Flex item text overflowing — why?</summary>

### Flex item text overflowing — why?

**Definition:** Default `min-width: auto` prevents flex items from shrinking below content width. Fix: `min-width: 0` (or `min-height: 0` in column flex) on the overflowing child; add `overflow: hidden` + `text-overflow: ellipsis` if needed.

**How it works:** Flex default `min-width: auto` = content minimum size — long unbroken strings refuse to shrink, overflowing the flex container.

**Cases:** Truncate text in sidebar → `min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap` on flex child.

</details>

<details>
  <summary>Explicit vs implicit CSS Grid?</summary>

### Explicit vs implicit CSS Grid?

**Definition:** Explicit grid = tracks you define in `grid-template-*`. Implicit grid = auto-created rows/columns for extra items; control with `grid-auto-rows`, `grid-auto-columns`, `grid-auto-flow`.

**How it works:** Items beyond `grid-template-columns` flow into implicit tracks sized by `grid-auto-rows`/`grid-auto-columns` (default `auto`).

**Cases:** Fixed 3-column layout → explicit template; unknown item count list → `grid-auto-flow: row` with `grid-auto-rows: minmax(100px, auto)`.

</details>

<details>
  <summary>How to avoid loading cached CSS/JS files after deploy?</summary>

### How to avoid loading cached CSS/JS files after deploy?

**Definition:** 1. **Content hash in filename** (best) — `main.a1b2c3d4.css` via Webpack/Vite build
2. **Query string** — `styles.css?v=1.2.3` (weaker; some proxies ignore query strings)
3. **`Cache-Control` headers** — `max-age` for static assets; `no-cache` for `index.html`
4. **Service worker** — update cache on new deploy.
**Cache busting** — change the URL when file content changes so browsers fetch the new file:

**Example:**

<details>
  <summary>Code</summary>

```html
<link rel="stylesheet" href="/assets/main.css?v=BUILD_ID">
```

</details>

Production builds should fingerprint hashed filenames automatically. Never rely on manual cache clear for users.

**How it works:** Browsers cache by URL — same URL = cached file even after deploy. Content hash in filename changes URL when bytes change.

**Cases:** Vite/Webpack emit `main.[hash].css`; `index.html` gets `no-cache` header; query `?v=` is weaker (some CDNs ignore query strings).

</details>

<details>
  <summary>What is a containing block?</summary>

### What is a containing block?

**Definition:** The box used to compute an element's position and percentage sizes. For `absolute` — nearest positioned ancestor; for `fixed` — viewport; for `static`/`relative` — ancestor content box. See **Containing block** in Box Model & Display.

**How it works:** Percentage `width`/`height`/`top`/`left` resolve against the containing block's dimensions — wrong ancestor = wrong percentages.

**Cases:** `position: absolute` child → nearest `position` ≠ `static` ancestor; `transform` on ancestor makes it containing block for `fixed` too.

</details>

<details>
  <summary>Why does flex need min-width: 0?</summary>

### Why does flex need min-width: 0?

**Definition:** Flex items default to `min-width: auto` (= content minimum). Long text prevents shrinking → overflow. Fix: `min-width: 0` (or `min-height: 0` in column flex) on the overflowing child. Same idea as `minmax(0, 1fr)` in Grid.

**How it works:** `min-width: auto` prevents shrinking below intrinsic content width — flex item won't compress for ellipsis/truncation.

**Cases:** Same as flex overflow — grid `minmax(0, 1fr)` solves equivalent issue in grid tracks.

</details>

<details>
  <summary>auto-fit vs auto-fill?</summary>

### auto-fit vs auto-fill?

**Definition:** Both use `repeat(auto-*, minmax(min, 1fr))`. `auto-fill` keeps empty tracks as placeholders. `auto-fit` collapses empty tracks so existing columns **stretch** to fill the row. Use `auto-fit` for responsive card grids that grow to fill space.

**How it works:** With 3 items in a 5-column capable row — `auto-fill` leaves 2 empty tracks; `auto-fit` collapses empties so 3 items expand to fill width.

**Cases:** Card grid that grows → `auto-fit`; fixed column count feel with gaps → `auto-fill`.

</details>

<details>
  <summary>Intrinsic vs extrinsic sizing?</summary>

### Intrinsic vs extrinsic sizing?

**Intrinsic** — size from content (`min-content`, `max-content`, `fit-content`, `width: auto`). **Extrinsic** — size imposed from outside (`width: 300px`, `flex: 1`, percentage widths). Interview trap: intrinsic content minimum blocks flex/grid shrinking.

**How it works:** `min-content` = longest word; `max-content` = no wrapping; extrinsic sizes override unless `min-width: auto` prevents shrink.

**Cases:** Shrink-to-fit sidebar → `min-width: 0`; image max → `max-width: 100%; height: auto`.

</details>

<details>
  <summary>100vh vs 100dvh?</summary>

### 100vh vs 100dvh?

**Definition:** `100vh` is the static viewport height — on mobile it often includes space behind the browser URL bar, causing overflow. `100dvh` (dynamic viewport height) adapts as mobile chrome shows/hides. Prefer `dvh` for full-screen layouts; pair with `env(safe-area-inset-*)` on notched devices.

**How it works:** Mobile browsers resize viewport when URL bar collapses — `vh` doesn't update mid-session; `dvh` tracks the dynamic visible area.

**Cases:** Full-screen modal/hero → `min-height: 100dvh`; safe area → `padding-bottom: env(safe-area-inset-bottom)`.

</details>

<details>
  <summary>How does @supports work?</summary>

### How does @supports work?

**Definition:** Feature query — applies CSS only if the browser supports a property/value. Progressive enhancement, not browser sniffing:.
**Example:**

<details>
  <summary>Code</summary>

```css
@supports (display: grid) {
  .layout { display: grid; }
}
```

</details>

Combine with Autoprefixer + Browserslist for prefixes; use `@supports` for optional enhancements (grid, `backdrop-filter`, container queries).

**How it works:** `@supports (property: value)` wraps rules applied only if the browser parses and supports that declaration — feature detection, not UA sniffing.

**Cases:** Grid enhancement over flex fallback; `backdrop-filter` with solid background fallback; `container-type: inline-size` progressive enhancement.

</details>

<details>
  <summary>When is a stacking context created?</summary>

### When is a stacking context created?

**Definition:** `z-index` (not `auto`) on positioned/flex/grid item; `opacity < 1`; `transform`, `filter`, `perspective`; `isolation: isolate`; `mix-blend-mode` ≠ `normal`; `will-change` for compositor properties. Children cannot paint above siblings outside their parent's context — see Layout → Stacking context.

**How it works:** Each stacking context is an isolated z-order group — child `z-index: 9999` cannot escape above a sibling context with lower parent `z-index`.

**Cases:** Modal overlay → `isolation: isolate` on wrapper; debug z-index wars in DevTools Layers panel.

</details>

<details>
  <summary>box-shadow vs filter: drop-shadow()?</summary>

### box-shadow vs filter: drop-shadow()?

**Definition:** `box-shadow` follows the element's box (border-radius included). `drop-shadow()` follows the alpha shape — better for PNG/SVG icons with transparency. `box-shadow` triggers paint; both are cheaper than layout changes.

**How it works:** `box-shadow` paints on the border box; `filter: drop-shadow()` follows non-transparent pixels — hollow icons get correct shadow shape.

**Cases:** Rectangular cards → `box-shadow`; PNG/SVG icons with transparency → `drop-shadow()`; multiple shadows → comma-separated `box-shadow`.

</details>

<details>
  <summary>Can you fully style a native select?</summary>

### Can you fully style a native select?

**Definition:** Partially. `appearance: none` removes OS chrome; you can style the closed state (border, padding, custom arrow via `background`). The **dropdown list** is rendered by the OS — options styling is limited cross-browser. Full control requires a custom component with keyboard support and ARIA.

**How it works:** Closed `<select>` is stylable; open dropdown is a native OS widget — `<option>` styling varies by platform.

**Cases:** Brand the closed trigger → `appearance: none` + custom arrow; full design control → build custom listbox with `role="listbox"` and keyboard nav.

</details>

<details>
  <summary>Pure CSS toggle without JavaScript?</summary>

### Pure CSS toggle without JavaScript?

**Definition:** Hide a native `<input type="checkbox">` and style a sibling with `:checked + .track` — slide the knob with `transform`, change track `background`. Keeps accessibility and form state. Full solution: **Form & Native Control Styling → Pure CSS toggle** and Task 15.

**How it works:** Checkbox remains in tab order and exposes state to assistive tech; visually hidden with `sr-only` or `opacity: 0`; `:checked` pseudo drives sibling styles.

**Cases:** iOS-style toggle; accordion with `<details>`; tab panels with `:target` or radio inputs.

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

**Definition:** Comparison:.
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

**Definition:** .dialog {
  width: min(90vw, 400px);
  padding: 1.5rem;
  border-radius: 12px;
  background: #fff;
}
```.
**Example:**

```css
.overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100dvh;
  background: rgb(0 0 0 / 50%);
}

**Grid alternative:** `display: grid; place-items: center;` on `.overlay`.

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

**Definition:** .card {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
```.
**Example:**

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

**Definition:** .header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; min-width: 0; }
.footer  { grid-area: footer; }
```.
**Example:**

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

**Definition:** .main p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```.
**Example:**

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

**Definition:** .header {
  background-color: #fff;
}.
**Example:**

<details>
  <summary>Code</summary>

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

**Changes:**

1. Removed `#id` + `!important` — use class `.header`
2. Replaced float layout with Grid
3. Flattened `.container .box .title` → BEM `.card__title`
4. Magic numbers → custom properties and `rem`
5. Added `box-sizing: border-box` in global reset (see Fundamentals)

</details>

---

### Task 7 — Dark theme with CSS custom properties

Implement light/dark theme toggle-ready tokens. Dark mode via `prefers-color-scheme`.

<details>
  <summary>Solution</summary>

### Solution

**Definition:** @media (prefers-color-scheme: dark) {
  :root {
    --bg: #111827;
    --text: #f9fafb;
    --border: #374151;
    --accent: #60a5fa;
  }
}.
**Example:**

<details>
  <summary>Code</summary>

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

**JS toggle:** set `document.documentElement.dataset.theme = "dark"` and use `[data-theme="dark"] { --bg: ... }`.

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

**Definition:** function dismissToast(el) {
  const onEnd = (e) => {
    if (e.target !== el || e.propertyName !== "opacity") return;
    el.removeEventListener("transitionend", onEnd);
    el.remove();
  };
  el.addEventListener("transitionend", onEnd);
  el.classList.add("is-hiding");
}.
**Example:**

<details>
  <summary>Code</summary>

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

</details>

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

**Definition:** .sticky-header {
  position: sticky;
  top: 48px; /* offset = topbar height */
  z-index: 10;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}
```.
**Example:**

```css
.topbar {
  height: 48px;
  background: #1e293b;
  color: #fff;
}

**Common failures:** `overflow: hidden` on `.page` parent, missing `top`, or `top: 0` causing overlap with topbar.

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

**Definition:** .tip::after {
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
**Example:**

<details>
  <summary>Code</summary>

```css
.tip {
  position: relative;
}

.tip:hover::after,
.tip:focus-visible::after {
  opacity: 1;
}
```

</details>

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

**Definition:** `:where(.a, .b, #x)` has **zero** specificity → `(0, 0, 0)`, loses to `p` at `(0, 0, 1)` for properties where both match... but here `p` is `(0,0,1)` and `:is` is `(1,0,0)`, so **blue wins**.
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
**Example:**

<details>
  <summary>Code</summary>

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

</details>

---

### Task 13 — Sidebar layout with grid-template-areas

Build a dashboard: header spans full width, 200px sidebar left, main fills center, footer spans full width. Use named areas only (no line numbers on items).

<details>
  <summary>Solution</summary>

### Solution

**Definition:** .header { grid-area: head; }
.sidebar { grid-area: nav; }
.content { grid-area: main; min-width: 0; }
.footer { grid-area: foot; }
```.
**Example:**

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

**Definition:** .card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}.
**Example:**

<details>
  <summary>Code</summary>

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

</details>

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
**Fixes:**

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

**Example:**

<details>
  <summary>Code</summary>

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
