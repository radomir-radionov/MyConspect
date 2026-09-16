# HTML — Interview

Interview Q&A and coding tasks for HTML.

[← Back to hub](./1_html.md)

### Related docs

* [HTML — Structure](./1_html_structure.md) · [HTML — Forms](./1_html_forms.md) · [HTML — Media](./1_html_media.md) · [HTML — Rendering](./1_html_rendering.md) · [HTML — Performance](./1_html_performance.md) · [HTML — Accessibility](./1_html_a11y.md) · [HTML — SEO](./1_html_seo.md) · [HTML — Advanced](./1_html_advanced.md) · [HTML — Interview](./1_html_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

<a name="interview-practice"></a>

## Interview Practice

Interview questions, review tasks, and coding challenges from [0_interview.md](0_interview.md). Each item has a **question**, **answer**, or **solution**.

**Coverage:** theory sections above + question index below — all indexed questions link to Q&A or tasks.

### Question index (0_interview.md)

| # | Topic | Section |
|---|-------|---------|
| 43 | `async` vs `defer` vs `module` | Theory Q1 |
| 44 | `innerHTML` vs `textContent` vs `innerText` | Theory Q2 |
| 55 | Web Accessibility | Theory Q3 |
| 57 | Semantic layout principles | Theory Q4 |
| 60 | Review bad HTML | Task 1 |
| 74 | `#shadow-root` in DevTools | Theory Q5 |
| 75 | Custom Elements | Theory Q6 |
| 76 | HTML whitespace & performance | Theory Q7 |
| — | CLS (Cumulative Layout Shift) | Theory Q-CLS |
| 77 | Canvas rendering context | Theory Q8 |
| 71–72 | SVG reuse & optimization | Theory Q9–Q10 |
| 91 | Async form validation | Theory Q11 |
| 12 | Content Security Policy | Theory Q12 |
| 16 | Shadow DOM | Theory Q5 |
| 142 | Find HTML links in string | Task 3 |
| 147 | HTMLConstruct builder | Task 2 |
| — | URL → DNS → render pipeline | Browser Q1–Q10 |
| — | What blocks first paint? | Q-BLOCK |
| — | Dirty layout / rAF / progressive rendering | Q-DIRTY · Q-RAF · Q-PROG |

---

### Browser pipeline Q&A

Interview answers for the browser section. Full theory: [Browser rendering pipeline](./1_html_structure.md#browser-rendering-pipeline) · [Browser & rendering](./1_html_rendering.md#browser--rendering).

<details>
  <summary>Q-URL. What happens when you enter a URL?</summary>

### What happens when you enter a URL?

**Definition:** Entering a URL starts a chain from DNS resolution through HTTP to HTML parsing and the full rendering pipeline.

**How it works:**

```
Parse URL → HTTP cache? → hosts / DNS caches → IP
  → TCP handshake → TLS if HTTPS → HTTP GET
  → HTML stream → DOM + CSSOM → render tree
  → layout → paint → GPU compositing
```

| Step | What happens |
|------|----------------|
| Parse URL | Scheme, host, path, query (hash stays client-side) |
| Cache / DNS | Stored HTML, then hosts → browser → OS → ISP → authoritative |
| Connect | TCP SYN/SYN-ACK/ACK; TLS + encryption if `https:` |
| Request | `GET` with `Host`; server maps URI to file or proxy |
| Parse | HTML → DOM; CSS → CSSOM (blocking CSS/JS delay this) |
| Render | Render tree → layout → paint → composite on GPU |

**When to use:** Cold first visit · cached DNS/TLS · SPA client navigation (History API skips full reload).

**Thoughts:** *The browser does not paint until it has enough DOM and CSSOM to build a render tree; compositing on the GPU is why `transform`/`opacity` animations stay cheap.*

**See also:** [What happens when you enter a URL?](./1_html_rendering.md#browser--rendering) (full theory)

**Sources:** [MDN — How the Internet works](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/How_does_the_Internet_work)

</details>

<details>
  <summary>Q-DNS. How does DNS work?</summary>

### How does DNS work?

**Definition:** DNS maps human-readable domain names to IP addresses so the browser can open a network connection.

**How it works:**

1. Hosts file (local override)
2. Browser DNS cache
3. OS DNS cache
4. Recursive resolver (ISP)
5. Root → TLD → authoritative nameserver
6. IP returned; browser opens TCP connection

**When to use:** First visit · CDN CNAME · `dns-prefetch` / `preconnect` for performance.

**Thoughts:** *DNS lookup adds latency on cold starts — caches and prefetch help.*

**See also:** [How DNS works](./1_html_rendering.md#browser--rendering) (full theory)

**Sources:** [MDN — DNS](https://developer.mozilla.org/en-US/docs/Glossary/DNS)

</details>

<details>
  <summary>Q-HTML. How does the browser get HTML?</summary>

### How does the browser get HTML?

**Definition:** After DNS resolves, the browser opens a TCP/TLS connection, sends an HTTP request, and receives an HTML document stream to parse.

**How it works:**

- Browser sends `GET /path HTTP/1.1` with `Host`, cookies, `Accept`, etc.
- Server responds with status, headers (`Content-Type`, `Cache-Control`), and body.
- Parser consumes the HTML stream incrementally — it does not wait for the full file.
- Parser-blocking scripts (`<script>` without `async`/`defer`) pause HTML parsing.

**When to use:** Static file from CDN · SSR HTML from Node/Next.js · chunked transfer encoding.

**Thoughts:** *HTML parsing starts as soon as bytes arrive — streaming reduces time-to-first-byte impact.*

**See also:** [How the browser gets HTML](./1_html_rendering.md#browser--rendering)

</details>

<details>
  <summary>Q-DOM. What is the DOM? How is the DOM tree built?</summary>

### What is the DOM? How is the DOM tree built?

**Definition:** The DOM (Document Object Model) is the browser's live, in-memory tree representation of the HTML document — nodes, elements, attributes, and text.

**How it works:**

- HTML tokenizer reads bytes → tokens (tags, attributes, text).
- Tree builder creates nodes and parent/child links.
- DOM is **live** — JS mutations (`appendChild`, `textContent`) update the tree instantly.
- Invalid HTML is corrected by the parser (e.g. auto-closing tags).

**When to use:** `document.querySelector` · React commits minimal DOM updates · accessibility tree derived from DOM.

**Thoughts:** *DOM is structure; it does not include computed styles (that's CSSOM).*

**See also:** [DOM tree construction](./1_html_rendering.md#browser--rendering) · [3_js_browser.md](./3_js_browser.md)

</details>

<details>
  <summary>Q-CSSOM. What is the CSSOM?</summary>

### What is the CSSOM?

**Definition:** The CSSOM (CSS Object Model) is the browser's object representation of parsed CSS rules — selectors mapped to style declarations.

**How it works:**

- Each CSS file and `<style>` block is parsed into rules.
- CSSOM is separate from DOM until the render tree merge.
- Render-blocking: CSS in `<head>` delays first render (browser waits to avoid FOUC).
- `display: none` elements exist in DOM but are excluded from render tree.

**When to use:** External stylesheet · critical CSS inlined · `@media` queries filter rules.

**Thoughts:** *No CSSOM → no styled render tree → blank or unstyled flash.*

**See also:** [What is the CSSOM?](./1_html_rendering.md#browser--rendering)

**Sources:** [MDN — CSSOM](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model)

</details>

<details>
  <summary>Q-RT. What is the render tree?</summary>

### What is the render tree?

**Definition:** The render tree combines DOM and CSSOM into a tree of visible boxes ready for layout and paint. `display: none` nodes are excluded; `visibility: hidden` stays in the tree. Gecko names this the **frame tree**.

**How it works:**

1. Walk DOM nodes.
2. Attach computed styles from CSSOM.
3. Skip non-visible nodes (`display: none`, `<head>`, etc.).
4. Output: boxes with geometry and paint info.

**When to use:** Understanding why hidden elements don't affect layout but `visibility:hidden` does.

**Thoughts:** *Render tree = what you see, not the full DOM.*

**See also:** [What is the Render Tree?](./1_html_rendering.md#browser--rendering)

**Sources:** [web.dev — Render tree](https://web.dev/articles/critical-rendering-path/constructing-the-object-model)

</details>

<details>
  <summary>Q-LAYOUT. What is layout (reflow)?</summary>

### What is layout (reflow)?

**Definition:** Layout computes the size and position of every visible element — width, height, margins, and coordinates on the page.

**How it works:**

- Triggered by: DOM insert/remove, size changes, font load, window resize, reading layout properties after writes.
- Window resize → **global** layout; a local style change → **incremental** layout of **dirty** nodes (element + descendants).
- `transform` and `opacity` typically skip layout (compositor-only).
- Layout thrashing: interleaving reads (`offsetHeight`) and writes in a loop forces repeated reflows.

**When to use:** Initial page layout · responsive resize · dynamic list injection.

**Thoughts:** *Layout is expensive — batch DOM reads and writes; prefer `transform` for animations.*

**See also:** [Layout (Reflow)](./1_html_rendering.md#browser--rendering) · [2_css.md](./2_css.md)

</details>

<details>
  <summary>Q-PAINT. What is paint?</summary>

### What is paint?

**Definition:** Paint rasterizes the visual appearance of each box — text, backgrounds, borders, shadows — into bitmap layers.

**How it works:**

- After layout, the browser fills pixels for each visible region.
- Large `box-shadow` or `border-radius` areas increase paint cost.
- Some properties trigger repaint without layout (`color`, `background`).

**When to use:** Text rendering · repainting on hover color change · `will-change` hints.

**Thoughts:** *Paint answers "what does it look like?" after layout answers "where and how big?"*

**See also:** [Paint](./1_html_rendering.md#browser--rendering)

**Sources:** [MDN — Repaint](https://developer.mozilla.org/en-US/docs/Glossary/Repaint)

</details>

<details>
  <summary>Q-COMP. What is compositing?</summary>

### What is compositing?

**Definition:** Compositing merges painted layers into the final frame on the GPU. Elements with `transform`, `opacity`, or `will-change` may get their own layer.

**How it works:**

- GPU stacks layers into the final framebuffer.
- Compositor-only changes skip layout and often skip full repaint.
- Over-promoting layers (`will-change` everywhere) wastes memory.

**When to use:** Smooth `transform`/`opacity` animations · parallax · fixed headers.

**Thoughts:** *Composite is the cheapest stage — animate with `transform`, not `top`/`left`.*

**See also:** [Compositing](./1_html_rendering.md#browser--rendering)

**Sources:** [MDN — Composite](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Composite)

</details>

<details>
  <summary>Q-LPC. Layout vs paint vs compositing?</summary>

### Layout vs paint vs compositing?

**Definition:** Three rendering stages with different cost profiles — layout (geometry), paint (pixels), composite (layer stack).

| Stage | Question | Example triggers |
|-------|----------|------------------|
| **Layout** | Where? How big? | `width`, DOM insert, `padding` |
| **Paint** | What does it look like? | `color`, `background`, `box-shadow` |
| **Composite** | How are layers stacked? | `transform`, `opacity` |

**How it works:** Layout → paint → composite (simplified). Composite-only changes are fastest.

**Thoughts:** *Know which properties trigger which stage — critical for performance interviews.*

**See also:** [Layout vs Paint vs Compositing](./1_html_rendering.md#browser--rendering)

</details>

<details>
  <summary>Q-FPR. What happens on first page render?</summary>

### What happens on first page render?

**Definition:** First render (First Contentful Paint path) is the initial pass from received HTML to visible pixels on screen.

**How it works:**

```
1. Parse HTML → build DOM (incremental)
2. Fetch & parse CSS → CSSOM
3. Build render tree (DOM + CSSOM)
4. Layout — compute positions
5. Paint — draw pixels
6. Composite — show frame
7. Execute JS (defer/module after parse; async when ready)
8. DOMContentLoaded → load event → lazy resources
```

**When to use:** Render-blocking CSS delays FCP · parser-blocking scripts delay DOM · images without dimensions cause CLS.

**Thoughts:** *Critical rendering path = minimum steps from HTML to first paint.*

**See also:** [Browser rendering pipeline](./1_html_structure.md#browser-rendering-pipeline) · [3_js_browser.md — Script loading](./3_js_browser.md#script-loading) · [FCP](./6_web_api_security.md#first-contentful-paint-fcp)

**Sources:** [web.dev — Critical rendering path](https://web.dev/articles/critical-rendering-path)

</details>

<details>
  <summary>Q-BLOCK. What blocks first paint?</summary>

### What blocks first paint?

**Definition:** First paint waits on the **critical rendering path** — mainly HTML parse plus **render-blocking CSS**. Classic `<script>` without `defer`/`async`/`type="module"` **blocks HTML parsing** (and therefore DOM construction). Fonts can delay styled text (FOIT/FOUT).

**How it works:**

- **CSS** in `<head>` (`<link rel="stylesheet">`) is render-blocking: the browser typically does not first-paint until CSSOM is ready (avoids a flash of unstyled content). `@import` inside CSS serializes extra requests — worse.
- **JavaScript** without `defer`/`async`/`module`: parser hits the tag, fetches (if `src`), **runs**, then continues HTML. That delays DOM, `DOMContentLoaded`, and often first paint.
- **`defer` / `type="module"`** — download in parallel, run after HTML parse, in document order, before `DOMContentLoaded`.
- **`async`** — download in parallel, run as soon as ready (order not guaranteed); can still interrupt parse at execute time.
- **Critical CSS** — inline above-the-fold rules in `<head>` so first paint does not wait on a large stylesheet; load the rest asynchronously.

**When to use:** App bundle in `<head>` without `defer` · huge CSS file · webfonts without `font-display`.

**Thoughts:** *CSS blocks first paint; undefferred JS blocks HTML parse — use `defer`/`module` and keep critical CSS small.*

**See also:** [async vs defer vs module](./1_html_media.md#performance--resource-loading) · [3_js_browser.md — Script loading](./3_js_browser.md#script-loading) · [2_css.md](./2_css.md) critical CSS

**Sources:** [web.dev — Render blocking CSS](https://web.dev/articles/critical-rendering-path/render-blocking-css) · [MDN — script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)

</details>

<details>
  <summary>Q-DIRTY. Global vs incremental layout? What are dirty nodes?</summary>

### Global vs incremental layout? What are dirty nodes?

**Definition:** **Global** layout recalculates the whole render tree (e.g. window resize). **Incremental** layout only the **dirty** subtree — the changed element and its descendants.

**How it works:** Children are dirtied because their geometry often depends on the parent. Stay in normal flow so independent boxes can be sized in one pass.

**Thoughts:** *Dirty = mutated node + kids; resize is global and expensive.*

**See also:** [Global vs incremental layout](./1_html_rendering.md#browser--rendering)

</details>

<details>
  <summary>Q-RAF. Why `requestAnimationFrame` instead of `setInterval` for animation?</summary>

### Why `requestAnimationFrame` instead of `setInterval` for animation?

**Definition:** `requestAnimationFrame(cb)` schedules `cb` before the next browser **repaint**, typically near display refresh (~60 fps). `setInterval(fn, 16)` is a timer, not a paint hook.

**How it works:**

- rAF aligns with the animation frame; pauses in background tabs.
- Intervals can fire between paints (jank) or **catch up** after an inactive tab (many frames at once).
- Animate `transform`/`opacity`, not `left`/`top`/`margin`.

**Thoughts:** *Tell the compositor when the next frame is — do not guess 16 ms.*

**See also:** [Reflow, repaint, and animation frames](./1_html_rendering.md#browser--rendering) · [3_js_browser.md](./3_js_browser_extra.md#request-animation-frame)

**Sources:** [MDN — requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

</details>

<details>
  <summary>Q-PROG. What is progressive rendering?</summary>

### What is progressive rendering?

**Definition:** Show useful pixels early: stream HTML, inline **critical CSS**, non-blocking scripts, lazy below-fold media — do not wait for the full bundle before first paint.

**How it works:** Parser builds DOM incrementally; styled first paint still needs CSSOM. Approaches: critical CSS, `defer`/`async`, `content-visibility: auto`, `loading="lazy"`, skeletons.

**Thoughts:** *First useful paint beats waiting for everything.*

**See also:** [Progressive rendering](./1_html_rendering.md#browser--rendering) · [2_css.md](./2_css.md)

</details>

---

### Theory questions

<details>
  <summary>Q1. Compare `async`, `defer`, and `type="module"` on script tags</summary>

### Q1. Compare `async`, `defer`, and `type="module"` on script tags

**Definition:** Script loading attributes control download timing, execution timing, and order relative to HTML parsing.

**How it works:**

- Parser behavior differs per attribute; see table in answer.
- `defer`/`module` preserve order; `async` does not.
- All still run on main thread.

| Attribute | Blocks parse at execute? |
|-----------|-------------------------|
| `defer` | No until end of parse |
| `async` | Yes, when ready |

**When to use:** App bundle (`defer`) · analytics (`async`) · ESM app (`module`).

**Common pitfalls:**

- Saying `async` preserves order.
- Forgetting modules are deferred by default.
- Omitting CORS requirement for cross-origin modules.
**Question:** What is the difference between `async`, `defer`, and `type="module"` when loading scripts?

**Answer:**

| Attribute | Download | Execute | Order |
|-----------|----------|---------|-------|
| (none) | Blocks HTML parser | Immediately | Sequential |
| `defer` | Parallel | After document parsed | Preserved |
| `async` | Parallel | As soon as ready | Not guaranteed |
| `type="module"` | Parallel | After parse (deferred) | Preserved; strict mode |

**Modern practice:** put CSS in `<head>`; put app scripts in `<head>` with `defer` or `type="module"`. Use `async` only for independent scripts (analytics). Avoid parser-blocking scripts without attributes.

**Examples:**

```html
<script src="app.js" defer></script>
<script src="analytics.js" async></script>
<script type="module" src="app.mjs"></script>
```

**Sources:** [3_js_browser.md](./3_js_browser.md) · [MDN — script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)

</details>

<details>
  <summary>Q2. Difference between `innerHTML`, `textContent`, and `innerText`?</summary>

### Q2. Difference between `innerHTML`, `textContent`, and `innerText`?

**Definition:** These DOM properties read/write element content differently — `innerHTML` parses markup (XSS risk), `textContent` returns raw text, `innerText` respects CSS visibility.

**How it works:**

- `innerHTML` parses HTML string into DOM nodes.
- `textContent` gets/sets all text, no HTML parsing.
- `innerText` reflects rendered text (CSS-aware, slower).

| Property | XSS risk |
|----------|----------|
| `innerHTML` | High with untrusted input |
| `textContent` | Low |

**When to use:** Render template (`innerHTML` sanitized) · set user name (`textContent`) · copy visible text (`innerText`).

**Common pitfalls:**

- Using `innerHTML` for user input.
- Assuming `innerText` includes hidden text.
- Confusing with `textContent` in forms.
**Question:** How do `innerHTML`, `textContent`, and `innerText` differ?

**Answer:**

| Property | Parses HTML | Respects CSS visibility | Use |
|----------|-------------|------------------------|-----|
| `innerHTML` | Yes | N/A | Insert/read markup — **XSS risk** with untrusted input |
| `textContent` | No | No | Safe read/write of raw text |
| `innerText` | No | Yes (layout-aware) | Text as displayed to the user |

```js
el.innerHTML = "<b>bold</b>";    // renders bold
el.textContent = "<b>bold</b>";  // literal "<b>bold</b>"
```

Never assign unsanitized user input to `innerHTML`. Prefer `textContent` for user data.

**Sources:** [3_js_browser.md](./3_js_browser.md) · [MDN — textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

</details>

<details>
  <summary>Q3. What is Web Accessibility and how do you achieve it in HTML?</summary>

### Q3. What is Web Accessibility and how do you achieve it in HTML?

**Definition:** Web accessibility means people with disabilities can perceive, operate, understand, and use the web — achieved in HTML through semantic elements, labels, alt text, and logical structure.

**How it works:**

- WCAG POUR framework structures interview answer.
- HTML layer: semantics, labels, alt, headings, lang.
- ARIA supplements; does not replace native elements.

| Principle | HTML practice |
|-----------|---------------|
| Perceivable | `alt`, contrast |
| Operable | `<button>`, keyboard |

**When to use:** Public sector compliance · ecommerce checkout · form-heavy apps.

**Common pitfalls:**

- Claiming ARIA alone makes site accessible.
- Skipping keyboard testing.
- Color-only form errors.
**Question:** Explain Web Accessibility. What HTML practices matter most?

**Answer:**

Web accessibility means people with disabilities can perceive, operate, understand, and use the web.

**Interview structure (POUR — WCAG):**

1. **Perceivable** — `alt` on images; sufficient color contrast; don't use color alone for meaning
2. **Operable** — keyboard access; visible focus; skip links
3. **Understandable** — logical headings; clear labels; associated form errors
4. **Robust** — valid semantic HTML; ARIA only when native elements are insufficient

**HTML checklist:** semantic landmarks, `<button>` vs `<a>`, `<label for>`, heading hierarchy, `aria-live` for dynamic updates, `lang` on `<html>`, empty `alt=""` for decorative images, don’t use `aria-hidden` on focusable nodes.

**Hide vs show to AT:** `hidden`/`display:none` = nobody; `aria-hidden="true"` = sighted only; `.sr-only` = AT only.

**See also:** [Accessibility](./1_html_a11y.md#accessibility) (tree, names, forms, images).

**Examples:**

```html
<html lang="en">
  <body>
    <a href="#main">Skip to content</a>
    <main id="main"><h1>Accessible page</h1></main>
  </body>
</html>
```

**Sources:** [MDN — Accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility)

</details>

<details>
  <summary>Q3b. Hidden vs aria-hidden vs presentation? How do you write alt text?</summary>

### Q3b. Hidden vs aria-hidden vs presentation? How do you write alt text?

**Definition:** These attributes hide **different audiences**. `alt` names images for AT and broken-image fallback — empty for decoration, descriptive for content, action-based inside links/buttons.

**Answer — hiding:**

| | `hidden` / `display:none` | `aria-hidden="true"` | `role="none"` / `presentation` |
|--|---------------------------|----------------------|--------------------------------|
| Visual | Hidden | Visible | Visible |
| AT | Out of tree | Out of tree | Semantics stripped; **tab stops remain** |

`.sr-only` = visually hidden, still announced. Never `aria-hidden` on a focused control.

**Answer — images:** Meaningful vs decorative. Omit `alt` → SR may read `src`. Don’t start with “picture”. Logo in a home link → `alt="Home"`, not “logo”. Duplicate nearby text → `alt=""`. Charts → short `alt` + long description.

**Sources:** [Hiding content](./1_html_a11y.md#hiding-content-from-at-vs-visually) · [Image text alternatives](./1_html_a11y.md#image-text-alternatives)

</details>

<details>
  <summary>Q4. What are semantic layout principles?</summary>

### Q4. What are semantic layout principles?

**Definition:** Semantic layout uses HTML elements for their intended meaning — landmarks, heading hierarchy, native controls — rather than generic `<div>` wrappers.

**How it works:**

- Landmarks define page regions; one `main`.
- Heading hierarchy reflects outline, not font size.
- Native interactive elements for actions and navigation.

| Principle | Example |
|-----------|--------|
| Landmarks | `<nav>`, `<main>` |
| Controls | `<button>` not div |

**When to use:** Blog layout · dashboard · marketing landing.

**Common pitfalls:**

- Div-only layouts in interview code samples.
- Multiple `h1` without explanation (SPA exception).
- `section` without headings everywhere.
**Question:** What principles define semantically correct HTML layout?

**Answer:**

1. Use landmark elements: `header`, `nav`, `main`, `article`, `section`, `footer`
2. One logical heading outline — don't skip levels (`h1` → `h2`, not `h1` → `h4`)
3. `<button>` for actions; `<a href>` for navigation
4. Every input has an associated `<label>`
5. Meaningful `alt` on images; `alt=""` for decorative images
6. Prefer native widgets: `<details>`, `<dialog>` over div-based components
7. One `<main>` per page

**Examples:**

```html
<header><nav><a href="/">Home</a></nav></header>
<main><article><h1>Title</h1></article></main>
<footer><p>&copy; 2025</p></footer>
```

**Sources:** [MDN — Semantics](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)

</details>

<details>
  <summary>Q5. What is `#shadow-root` in DevTools? What is Shadow DOM?</summary>

### Q5. What is `#shadow-root` in DevTools? What is Shadow DOM?

**Definition:** Shadow DOM attaches an encapsulated DOM subtree to an element, isolating styles and markup from the rest of the page.

**How it works:**

- Shadow root attaches encapsulated subtree to host element.
- Styles scoped inside shadow tree; slots project light DOM children.
- `open` vs `closed` modes affect inspectability.

| Mode | DevTools |
|------|----------|
| `open` | `#shadow-root (open)` |
| `closed` | Hidden from `element.shadowRoot` |

**When to use:** Web components · design system buttons · browser built-ins (video controls).

**Common pitfalls:**

- Saying Shadow DOM is same as React shadowing.
- Claiming closed mode is security.
- Forgetting slots for content projection.
**Question:** You see `#shadow-root (open)` in DevTools. What is it?

**Answer:**

**Shadow DOM** attaches a hidden, encapsulated DOM subtree to an element. Styles and markup inside do not leak out; page CSS does not pierce in (unless explicitly allowed).

`#shadow-root` in DevTools is that encapsulated tree.

| Mode | Access |
|------|--------|
| `open` | `element.shadowRoot` works; visible in DevTools as `(open)` |
| `closed` | `shadowRoot` returns `null`; harder to inspect |

Part of **Web Components** (with Custom Elements and `<template>`/`<slot>`). Enables reusable, framework-agnostic components.

**Examples:**

```html
<user-card>
  <template shadowrootmode="open">
    <style>:host { display: block; }</style>
    <slot></slot>
  </template>
  <span>Projected content</span>
</user-card>
```

**Sources:** [3_js_browser_extra.md](./3_js_browser_extra.md) · [MDN — Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)

</details>

<details>
  <summary>Q6. Why are Custom Elements needed?</summary>

### Q6. Why are Custom Elements needed?

**Definition:** Custom Elements let you define new HTML tags with lifecycle hooks, enabling reusable components across any framework.

**How it works:**

- Register new tag names with browser (`customElements.define`).
- Lifecycle callbacks: `connectedCallback`, `attributeChangedCallback`.
- Framework-agnostic reuse across stacks.

| Pros | Cons |
|------|------|
| Native in HTML | SSR/hydration complexity |
| Encapsulation with Shadow DOM | Learning curve |

**When to use:** `<user-card>` in design system · embeddable widget · gradual migration from legacy.

**Common pitfalls:**

- Not mentioning custom element naming rule (must contain hyphen).
- Confusing with React components only.
- Skipping `observedAttributes` for reactive attrs.
**Question:** What problem do Custom Elements solve?

**Answer:**

They let you define **new HTML tags** with lifecycle hooks, reusable across any page or framework:

```js
class UserCard extends HTMLElement {
  static observedAttributes = ["name"];
  connectedCallback() {
    this.textContent = this.getAttribute("name");
  }
}
customElements.define("user-card", UserCard);
```

Use when: repeating UI patterns, needing encapsulation (Shadow DOM), or building design-system primitives that work in React, Vue, or plain HTML.

**Examples:**

```html
<user-card name="Ada">
  <h2 slot="title">Ada Lovelace</h2>
  <p>First programmer.</p>
</user-card>
```

**Sources:** [3_js_browser_extra.md](./3_js_browser_extra.md) · [MDN — Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)

</details>

<details>
  <summary>Q7. Does removing HTML whitespace improve page performance?</summary>

### Q7. Does removing HTML whitespace improve page performance?

**Definition:** Minifying HTML whitespace has negligible performance impact because gzip/Brotli compress whitespace efficiently; focus on images, scripts, and CLS instead.

**How it works:**

- Gzip/Brotli compress whitespace efficiently — tiny wire savings.
- Parser cost difference negligible for typical pages.
- Whitespace between inline elements affects **rendering**, not transfer.

| Effort | Impact |
|--------|--------|
| HTML whitespace minify | Negligible |
| Image optimization | High |

**When to use:** Minify in build pipeline (minor) · fix inline spacing with CSS not NBSP.

**Common pitfalls:**

- Claiming large perf gains from HTML minify.
- Confusing transfer size with inline layout whitespace.
- Ignoring LCP/CLS levers in answer.
**Question:** Will minifying HTML whitespace significantly improve load performance?

**Answer:**

**No meaningful impact.** Gzip/Brotli compress whitespace efficiently, so wire savings are tiny. Parser cost difference is negligible for typical pages.

**Separate issue — inline whitespace collapsing:** HTML collapses whitespace between inline elements into one space (`<span>A</span>   <span>B</span>` → "A B"). That affects rendering, not transfer size. Use `<pre>` or `white-space: pre` to preserve.

Focus performance effort on: image dimensions, `srcset`, render-blocking scripts, LCP image `fetchpriority`, CLS prevention.

**Examples:**

```html
<img src="hero.webp" alt="Hero" width="1200" height="630" fetchpriority="high" />
<script src="/app.js" defer></script>
```

**Sources:** [web.dev — Vitals](https://web.dev/articles/vitals)

</details>

<details>
  <summary>Q-CLS. What is Cumulative Layout Shift (CLS)?</summary>

### Q-CLS. What is Cumulative Layout Shift (CLS)?

**Definition:** CLS measures unexpected visual movement of already-visible content. Good **≤ 0.1**, poor **> 0.25**. It is a Core Web Vital (with LCP and INP).

**How it works:** Score = impact × distance. Shifts group into session windows (1s gap, max 5s); the page score is the **worst window**. Clicks exclude shifts for 500ms.

**Question:** What is CLS and how do you keep it low?

**Answer:** Visual stability metric. Reserve `width`/`height` or `aspect-ratio` for images, video, ads, iframes; do not inject banners above in-view content; match font fallback metrics (`size-adjust`); animate `transform` not `top`/`margin`. Full notes: [CLS](./1_html_performance.md#cls-cumulative-layout-shift).

**Sources:** [web.dev — CLS](https://web.dev/articles/cls)

</details>

<details>
  <summary>Q8. What is a canvas rendering context? 2d vs WebGL?</summary>

### Q8. What is a canvas rendering context? 2d vs WebGL?

**Definition:** A canvas rendering context is the drawing API for a `<canvas>` element — `2d` for bitmap 2D graphics, `webgl`/`webgl2` for GPU-accelerated 3D.

**How it works:**

- `getContext('2d')` — 2D immediate-mode drawing API.
- `webgl`/`webgl2` — GPU shaders, 3D pipelines.
- Context is null if unsupported or wrong type requested.

| Context | Use |
|---------|-----|
| `2d` | Shapes, text, 2D charts |
| `webgl2` | 3D, GPU compute |

**When to use:** Charts (`2d`) · games (`webgl2`) · image filters (`2d`).

**Common pitfalls:**

- Saying canvas is vector (it's bitmap).
- No fallback when WebGL unavailable.
- Forgetting `willReadFrequently` hint for 2d readback.
**Question:** What are canvas context types for 2D and 3D rendering?

**Answer:**

```js
const canvas = document.querySelector("canvas");
const ctx2d = canvas.getContext("2d");
const gl    = canvas.getContext("webgl2");
```

| Context | Use |
|---------|-----|
| `"2d"` | 2D shapes, text, charts, image editing |
| `"webgl"` / `"webgl2"` | 3D scenes, shaders, GPU-heavy graphics |

`<canvas>` content is bitmap-based and requires JS to draw. `<svg>` is vector DOM markup — better for icons and accessibility.

**Examples:**

```html
<canvas id="chart" width="400" height="200"></canvas>
<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 20v-6h4v6z"/></svg>
```

**Sources:** [MDN — canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)

</details>

<details>
  <summary>Q9. How do you reuse inline SVG across a page?</summary>

### Q9. How do you reuse inline SVG across a page?

**Definition:** SVG sprites with `<symbol>` and `<use>` let you define an icon once and reference it multiple times without duplicating markup.

**How it works:**

- Define `<symbol id>` in hidden sprite SVG.
- Reference with `<use href="#id">` inline or external sprite.
- Set `viewBox` on symbol for scaling.

| Approach | Pros |
|----------|------|
| Inline sprite | No extra HTTP |
| External sprite | Cacheable |

**When to use:** Icon systems · multi-color icons · external CDN sprite.

**Common pitfalls:**

- Duplicating full SVG per icon.
- External sprite CORS issues.
- Missing `aria-hidden` on decorative icons.
**Question:** How can you avoid duplicating the same SVG markup many times?

**Answer:**

Use an **SVG sprite** with `<symbol>` and `<use>`:

```html
<svg style="display:none" aria-hidden="true">
  <symbol id="icon-home" viewBox="0 0 24 24">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </symbol>
</svg>

<svg class="icon" aria-hidden="true"><use href="#icon-home"/></svg>
```

External sprites: `<use href="/icons.svg#icon-home">` (watch CORS). Prefer sprites over icon fonts for accessibility and sharp scaling.

**Sources:** [MDN — SVG use](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use)

</details>

<details>
  <summary>Q10. How do you optimize SVG files?</summary>

### Q10. How do you optimize SVG files?

**Definition:** SVG optimization reduces file size and improves maintainability by stripping metadata, simplifying paths, and using sprites.

**How it works:**

- SVGO removes metadata, simplifies paths, rounds coordinates.
- Use `currentColor` for themeable icons.
- Sprite sheet for many icons.

| Step | Benefit |
|------|--------|
| SVGO | Smaller file |
| `viewBox` | Responsive scale |

**When to use:** Icon font migration · hero illustrations · animated SVG.

**Common pitfalls:**

- Over-simplifying paths (visible quality loss).
- Huge inline SVGs in HTML (bloats document).
- Icon fonts instead of SVG in 2025.
**Question:** What steps reduce SVG file size and improve maintainability?

**Answer:**

1. Run through **SVGO** — strip metadata, reduce path precision
2. Remove editor cruft (Illustrator/Inkscape layers)
3. Use `viewBox` for scaling instead of fixed dimensions
4. Use `currentColor` so icons inherit text color
5. Combine into a sprite sheet for many icons

**Examples:**

```html
<svg class="icon" aria-hidden="true"><use href="#icon-home"/></svg>
```

**Sources:** [SVGO](https://github.com/svg/svgo)

</details>

<details>
  <summary>Q11. What is async form validation? How is it implemented?</summary>

### Q11. What is async form validation? How is it implemented?

**Definition:** Async form validation checks field values against a server (e.g. username availability) using the Constraint Validation API with `setCustomValidity()`.

**How it works:**

- Sync: HTML `required`/`pattern` via Constraint Validation API.
- Async: fetch server on `blur`/`input`, then `setCustomValidity`.
- Always pair with `reportValidity` and `aria-describedby` for errors.

| Layer | Tool |
|-------|------|
| Format | HTML attrs |
| Server | `fetch` + `setCustomValidity` |

**When to use:** Username availability · email domain check · coupon code validation.

**Common pitfalls:**

- Only client-side validation.
- Race conditions on fast typing (abort prior fetch).
- Not disabling submit during async check.
**Question:** How do you validate a field against the server (e.g. username taken) using HTML validation?

**Answer:**

Keep native validation for format; use `setCustomValidity` for async server checks:

```js
usernameInput.addEventListener("blur", async () => {
  const res = await fetch(`/api/check-username?name=${encodeURIComponent(usernameInput.value)}`);
  const { available } = await res.json();
  usernameInput.setCustomValidity(available ? "" : "Username already taken");
  usernameInput.reportValidity();
});
```

Pair with `aria-describedby` pointing to an error message element with `role="alert"`.

**Examples:**

```html
<label for="username">Username</label>
<input id="username" name="username" type="text" required aria-describedby="username-error" />
<span id="username-error" role="alert"></span>
```

**Sources:** [MDN — Constraint validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation)

</details>

<details>
  <summary>Q12. What is Content Security Policy (CSP)?</summary>

### Q12. What is Content Security Policy (CSP)?

**Definition:** CSP is an HTTP header that whitelists allowed script, style, and resource sources — the primary server-side defense against XSS.

**How it works:**

- HTTP header (or meta) whitelisting resource origins.
- Blocks inline script unless nonce/hash matches.
- Primary XSS mitigation at delivery layer.

| Directive | Controls |
|-----------|----------|
| `script-src` | JS sources |
| `default-src` | Fallback |

**When to use:** Strict `script-src 'self'` · nonce for inline boot script · `frame-ancestors` against clickjacking.

**Common pitfalls:**

- `unsafe-inline` defeating CSP purpose.
- Meta CSP cannot set `frame-ancestors`.
- Forgetting nonce on allowed inline scripts.
**Question:** What is CSP and how does it relate to HTML?

**Answer:**

CSP is an HTTP header (or `<meta http-equiv="Content-Security-Policy">`) that whitelists allowed script/style/resource sources.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-abc123'
```

**HTML impact:**

* Blocks inline `<script>` unless `nonce` or hash matches
* Blocks `onclick="..."` inline handlers
* Blocks `eval()` unless explicitly allowed
* Use `<script nonce="abc123">` matching server nonce for allowed inline scripts

Primary defense against XSS injection through markup.

**Examples:**

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'nonce-abc123'" />
<script nonce="abc123">/* allowed inline script */</script>
```

**Sources:** [MDN — CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)

</details>

<details>
  <summary>Q13. `button` vs `a` — when to use which?</summary>

### Q13. `button` vs `a` — when to use which?

**Definition:** Use `<a href>` for navigation and `<button>` for in-page actions — mixing them breaks UX, accessibility, and keyboard behavior.

**How it works:**

- `<a href>` navigates — URL changes, open in tab, bookmark.
- `<button>` triggers actions — submit, toggle, open dialog.
- Wrong choice breaks keyboard, SR, and user expectations.

| Element | Default action |
|---------|----------------|
| `<a href>` | Navigate |
| `<button>` | Submit if in form |

**When to use:** Nav link (`a`) · form submit (`button type=submit`) · open modal (`button type=button`).

**Common pitfalls:**

- `<a href="#">` as button.
- `<button>` styled link without `href` behavior.
- Missing `type="button"` causing accidental submit.
**Question:** When should you use `<button>` vs `<a href>`?

**Answer:**

| Element | Use for |
|---------|---------|
| `<a href="url">` | Navigation — supports open in new tab, copy link, bookmark |
| `<button type="button">` | In-page actions — toggle, open dialog, submit form |
| `<button type="submit">` | Form submission |

Using `<a>` for JS actions or `<button>` for navigation breaks UX, accessibility, and keyboard behavior.

**Examples:**

```html
<a href="/about">About page</a>
<button type="button">Open settings</button>
<button type="submit">Submit form</button>
```

**Sources:** [MDN — a](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)

</details>

<details>
  <summary>Q14. `strong`/`em` vs `b`/`i`?</summary>

### Q14. `strong`/`em` vs `b`/`i`?

**Definition:** `<strong>`/`<em>` carry semantic importance and stress; `<b>`/`<i>` are stylistic bold/italic without added meaning for assistive technology.

**How it works:**

- `strong`/`em` — semantic importance and stress.
- `b`/`i` — stylistic bold/italic without added meaning.
- Screen readers may emphasize `strong`/`em`; `b`/`i` typically not.

| Pair | Semantic? |
|------|------------|
| `strong`/`em` | Yes |
| `b`/`i` | No |

**When to use:** Warning (`strong`) · emphasized word (`em`) · keyword visual (`b` in abstract).

**Common pitfalls:**

- Using `b` for all bold headings.
- CSS `font-weight` vs semantic elements confusion.
- `i` for icons (use SVG + `aria-hidden`).
**Question:** What is the difference between `<strong>`/`<em>` and `<b>`/`<i>`?

**Answer:**

* `<strong>` / `<em>` — **semantic** importance and stress emphasis (affect meaning for screen readers and SEO)
* `<b>` / `<i>` — **visual** bold/italic without added semantics

Use semantic elements by default; use `<b>`/`<i>` only for stylistic offset without semantic weight (e.g. keywords in a summary).

**Examples:**

```html
<p><strong>Warning:</strong> <em>Do not</em> skip heading levels. <b>Keywords</b> in summary.</p>
```

**Sources:** [MDN — strong](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong)

</details>

<details>
  <summary>Q15. What is the DOM? How does it relate to HTML?</summary>

### Q15. What is the DOM? How does it relate to HTML?

**Definition:** The DOM is the browser's live in-memory tree of the document; HTML is the source markup that parsing transforms into DOM nodes.

**How it works:**

- HTML is serialized markup in the response.
- Parser builds live DOM tree object graph.
- JS mutates DOM; browser re-runs rendering pipeline as needed.

| | HTML | DOM |
|---|------|-----|
| Nature | Static source | Live runtime tree |

**When to use:** Static page · SPA hydration · `document.querySelector` updates.

**Common pitfalls:**

- Saying HTML and DOM are identical after JS runs.
- Confusing DOM with Virtual DOM (framework concept).
- Forgetting shadow DOM is separate tree.
**Question:** What is the DOM?

**Answer:**

The **DOM** (Document Object Model) is the browser's live in-memory tree of the document. HTML is the source markup; parsing HTML **builds** the DOM.

```js
document.querySelector("h1").textContent = "Updated";
```

HTML = static structure definition. DOM = runtime object graph. JS APIs mutate the DOM; the browser re-renders.

**Examples:**

```html
<body><h1 id="title">Hello</h1></body>
```

**Sources:** [3_js_browser.md](./3_js_browser.md) · [MDN — DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)

</details>

<details>
  <summary>Q16. Quirks mode vs standards mode?</summary>

### Q16. Quirks mode vs standards mode?

**Definition:** `<!DOCTYPE html>` triggers standards mode; without it browsers may enter quirks mode with legacy layout bugs.

**How it works:**

- DOCTYPE triggers standards mode in modern browsers.
- Quirks mode emulates legacy IE box model bugs.
- Always use `<!DOCTYPE html>` first line.

| Mode | Box model |
|------|----------|
| Standards | `box-sizing` per CSS spec |
| Quirks | Content box quirks |

**When to use:** Legacy pages without DOCTYPE · iframe inheriting quirks · HTML email (limited).

**Common pitfalls:**

- Random DOCTYPE strings from old templates.
- XML declaration before DOCTYPE triggering quirks.
- Assuming quirks mode is gone (still triggered without DOCTYPE).
**Question:** What happens without `<!DOCTYPE html>`?

**Answer:**

Browsers may enter **quirks mode** — emulates legacy IE bugs (wrong box model, inconsistent sizing). Always start with:

```html
<!DOCTYPE html>
```

This triggers **standards mode** (no quirks) in all modern browsers.

**Examples:**

```html
<!DOCTYPE html>
<html lang="en"><body></body></html>
```

**Sources:** [MDN — DOCTYPE](https://developer.mozilla.org/en-US/docs/Glossary/Doctype)

</details>

---

### Review tasks

<details>
  <summary>Task 1 — Fix bad HTML (accessibility & semantics)</summary>

### Task 1 — Fix bad HTML (accessibility & semantics)

**Task:** Find and fix all issues in this markup.

```html
<!-- BAD -->
<div class="header">
  <div onclick="goHome()">Home</div>
</div>
<div class="main">
  <h3>Welcome</h3>
  <img src="hero.jpg">
  <input type="email" placeholder="Email">
  <div class="btn" onclick="submit()">Subscribe</div>
</div>
```

<details>
  <summary>Solution</summary>

```html
<!-- FIXED -->
<header>
  <nav aria-label="Main">
    <a href="/">Home</a>
  </nav>
</header>
<main id="main">
  <h1>Welcome</h1>
  <img src="hero.jpg" alt="Team working together" width="1200" height="630">
  <form action="/subscribe" method="post">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email" required>
    <button type="submit">Subscribe</button>
  </form>
</main>
```

**Fixes applied:**

| Issue | Fix |
|-------|-----|
| `div.header` | `<header>` + `<nav>` landmark |
| `onclick` on div | `<a href>` for navigation; `<button type="submit">` for action |
| `h3` as page title | `<h1>` — one main heading per page |
| Missing `alt` | Descriptive `alt` text |
| No `width`/`height` | Dimensions to prevent CLS |
| Input without label | `<label for="email">` |
| `placeholder` only | Label is required; placeholder is optional hint |
| `div.main` | `<main id="main">` landmark |

</details>

</details>

<details>
  <summary>Task 2 — Fix bad HTML (security & performance)</summary>

### Task 2 — Fix bad HTML (security & performance)

**Task:** Fix security and loading issues.

```html
<!-- BAD -->
<head>
  <script src="https://cdn.example.com/analytics.js"></script>
  <script src="https://cdn.example.com/app.js"></script>
</head>
<body>
  <a href="https://external.com" target="_blank">External</a>
  <iframe src="https://widget.example.com"></iframe>
</body>
```

<details>
  <summary>Solution</summary>

```html
<!-- FIXED -->
<head>
  <script src="https://cdn.example.com/analytics.js" async></script>
  <script src="https://cdn.example.com/app.js" defer
    integrity="sha384-..." crossorigin="anonymous"></script>
</head>
<body>
  <a href="https://external.com" target="_blank" rel="noopener noreferrer">External</a>
  <iframe
    src="https://widget.example.com"
    title="Widget embed"
    sandbox="allow-scripts allow-same-origin"
    loading="lazy"
  ></iframe>
</body>
```

**Fixes:**

* Analytics → `async` (independent, no order dependency)
* App script → `defer` (runs after parse, in order) + **SRI** `integrity`
* `target="_blank"` → add `rel="noopener noreferrer"` (prevents `window.opener` attack)
* iframe → `title` for a11y, `sandbox` to restrict capabilities, `loading="lazy"` if below fold

</details>

</details>

---

### Coding tasks

<details>
  <summary>Task 3 — HTMLConstruct: fluent HTML string builder</summary>

### Task 3 — HTMLConstruct: fluent HTML string builder

**Task:** Implement a fluent API (from 0_interview.md Q147):

```js
HTMLConstruct.span('foo');                    // → '<span>foo</span>'
HTMLConstruct.div.span('bar');                // → '<div><span>bar</span></div>'
HTMLConstruct.div.p(
  HTMLConstruct.span('bar'),
  HTMLConstruct.div.span('baz')
);                                            // → '<div><p><span>bar</span><div><span>baz</span></div></p></div>'
```

<details>
  <summary>Solution</summary>

```js
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function createTagBuilder(tag) {
  const builder = function (...children) {
    const content = children
      .map((c) => (typeof c === "function" ? c() : escapeHtml(c)))
      .join("");
    return `<${tag}>${content}</${tag}>`;
  };
  return builder;
}

function createConstruct(tags) {
  const result = {};
  for (const tag of tags) {
    const builder = createTagBuilder(tag);
    for (const sub of tags) {
      builder[sub] = (...args) => createTagBuilder(tag)(createTagBuilder(sub)(...args));
    }
    result[tag] = builder;
  }
  return result;
}

const HTMLConstruct = createConstruct([
  "div", "span", "p", "a", "ul", "li", "h1", "h2",
]);
```

**Interview points:** nested property access on functions, escaping user text (XSS), supporting both string children and nested tag calls.

</details>

</details>

<details>
  <summary>Task 4 — Find all HTML links in a string (0_interview.md Q142)</summary>

### Task 4 — Find all HTML links in a string (0_interview.md Q142)

**Task:** Write a function that extracts all `href` values from `<a>` tags in an HTML string.

```js
const html = `
  <p>Visit <a href="https://example.com">Example</a> or
  <a href="/about">About</a></p>
`;
findHtmlLinks(html); // → ['https://example.com', '/about']
```

<details>
  <summary>Solution A — RegExp (mention caveats)</summary>

### Solution A — RegExp (mention caveats)

```js
function findHtmlLinks(str) {
  const re = /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi;
  const links = [];
  let match;
  while ((match = re.exec(str)) !== null) {
    links.push(match[1]);
  }
  return links;
}
```

**Caveat:** breaks on malformed HTML, nested tags, or `href` without quotes. Mention in interview; don't use in production.

</details>

<details>
  <summary>Solution B — DOMParser (preferred)</summary>

### Solution B — DOMParser (preferred)

```js
function findHtmlLinks(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return [...doc.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
}
```

Browser-native parsing handles edge cases correctly. Prefer this in real code.

</details>

</details>

<details>
  <summary>Task 5 — Build accessible semantic page skeleton</summary>

### Task 5 — Build accessible semantic page skeleton

**Task:** Write HTML for a blog post page with: site header, navigation, main content (article with figure), sidebar, footer. Must pass basic a11y checks.

<details>
  <summary>Solution</summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>How to Structure HTML — Blog</title>
</head>
<body>
  <a href="#main" class="skip-link">Skip to content</a>

  <header>
    <a href="/" aria-label="Home">My Blog</a>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/" aria-current="page">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>

  <main id="main">
    <article>
      <header>
        <h1>How to Structure HTML</h1>
        <p><time datetime="2025-07-02">July 2, 2025</time> · Jane Doe</p>
      </header>

      <figure>
        <img src="diagram.png" alt="HTML landmark elements diagram"
             width="800" height="450" loading="lazy">
        <figcaption>Landmark regions in a typical page layout</figcaption>
      </figure>

      <p>Semantic HTML improves accessibility and SEO...</p>
    </article>

    <aside aria-label="Related posts">
      <h2>Related</h2>
      <ul>
        <li><a href="/post/css-grid">CSS Grid Guide</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2025 My Blog</p>
  </footer>
</body>
</html>
```

**Checklist:** `lang`, skip link, landmarks, one `h1`, `figure`/`figcaption`, image `alt` + dimensions, `aria-label` on nav/aside, `time datetime`.

</details>

</details>

---

### Quick oral questions (self-check)

Try answering without looking, then expand each.

1. What is the difference between an HTML **tag**, **element**, and **attribute**?
2. What are **void elements**? Name five.
3. What happens when you enter a URL? (browser pipeline)
4. What is the **critical rendering path**?
5. Why put `width` and `height` on `<img>`?
6. When use `<picture>` vs `srcset` on `<img>`?
7. What is the difference between `<section>` and `<article>`?
8. What does `rel="noopener noreferrer"` prevent?
9. What is the Constraint Validation API?
10. What are the three Web Components specs?
11. What is **Declarative Shadow DOM**?
12. What is the **Popover API**?
13. What does the `inert` attribute do?
14. What is **JSON-LD** used for?
15. What is `hreflang` for?
16. What is **progressive rendering**?
17. Why `requestAnimationFrame` over `setInterval` for animation?

<details>
  <summary>Answers</summary>

### Answers

1. **Tag** — markup syntax (`<p>`). **Element** — DOM node (tag + content). **Attribute** — metadata on an element (`class`, `href`).
2. **Void elements** have no closing tag or content: `<img>`, `<br>`, `<input>`, `<meta>`, `<link>`.
3. **URL pipeline:** DNS → TCP/TLS → HTTP → HTML → DOM + CSSOM → Render Tree → Layout → Paint → Composite.
4. **Critical rendering path** — sequence from HTML/CSS/JS to first paint; parser-blocking resources delay it.
5. **`width`/`height`** — browser reserves space before image loads → prevents CLS (layout shift).
6. **`<picture>`** — art direction or format fallback (AVIF/WebP/JPEG). **`srcset` on `<img>`** — responsive resolution selection only.
7. **`<section>`** — thematic grouping with heading. **`<article>`** — self-contained, distributable content.
8. **`noopener`** — new tab can't access `window.opener`. **`noreferrer`** — no Referer header sent.
9. **Constraint Validation API** — native form validation: `required`, `pattern`, `checkValidity()`, `setCustomValidity()`, `:valid`/`:invalid`.
10. **Custom Elements**, **Shadow DOM**, **HTML Templates** (`<template>` + `<slot>`).
11. **Declarative Shadow DOM** — embed `<template shadowrootmode="open">` in HTML without JS constructor.
12. **Popover API** — `popover` attribute + `popovertarget`; native top-layer overlays with light-dismiss.
13. **`inert`** — element and descendants excluded from interaction, focus, and find-in-page.
14. **JSON-LD** — structured data in `<script type="application/ld+json">` for search rich results.
15. **`hreflang`** — tells search engines which URL is for which language/region (`<link rel="alternate" hreflang="de">`).
16. **Progressive rendering** — paint useful pixels early: stream HTML, critical CSS, non-blocking JS, lazy below-fold.
17. **rAF** runs before the next paint (~60 fps), pauses in background; `setInterval(16)` can jank or catch up after a hidden tab. Animate `transform`/`opacity`.

</details>
