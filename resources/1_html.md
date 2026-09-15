
# HTML — Document structure & browser rendering

Covers document structure, browser rendering, semantics, forms, media, performance, accessibility, SEO, and modern HTML APIs.

### Related docs

* [CSS](./2_css.md) · [JS Browser](./3_js_browser.md) · [JS Async](./3_js_async.md)
* [Web API](./6_web_api.md) · [URL anatomy](./6_web_api.md#uri-url--urn) · [XML](./6_web_api.md#xml) · [TCP vs UDP](./6_web_api.md#tcp-vs-udp) · [Core Web Vitals](./6_web_api.md#core-web-vitals) · [LCP](./6_web_api.md#lcp-largest-contentful-paint) · [INP](./6_web_api.md#inp-interaction-to-next-paint) · [FCP](./6_web_api.md#first-contentful-paint-fcp) · [TTFB](./6_web_api.md#ttfb-time-to-first-byte) · [CLS](#cls-cumulative-layout-shift) · [Next.js CWV](./4_nextjs.md#core-web-vitals-on-vercel) · [React a11y](./4_react.md#accessibility-in-react-a11y)

[← Back to hub](./0_mvp.md)

### Main concepts

| Area | Topics |
|------|--------|
| **Structure** | Document structure, elements, tags, attributes, DOCTYPE, HTML vs XML |
| **Content** | Headings, paragraphs, lists, links, images, tables, comments, entities |
| **Semantics** | Landmark elements, heading hierarchy, figure/figcaption, text semantics |
| **Forms** | Input types, labels, validation, `select`/`textarea`/`button`, dialog, fieldset |
| **Media** | Audio, video, picture, srcset, canvas, SVG |
| **Metadata** | Meta tags, viewport, charset, favicon, resource hints, SRI, Open Graph, manifest |
| **Performance** | Core Web Vitals, FCP, CLS, script loading, lazy loading, caching |
| **Rendering** | Fetch → parse (DOM/CSSOM) → render tree → layout → paint → composite |
| **Security** | CSP, SRI, XSS prevention, iframe sandbox |
| **Quality** | Accessibility (POUR, a11y tree, names, forms, images, `lang`), SEO, validation |

### Sections

> Theory `<details>` blocks follow: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**. **Definition** is required; other sections are optional.

- [HTML structure](#html-structure)
- [Browser rendering pipeline](#browser-rendering-pipeline)
- [Forms & semantics](#forms--semantics)
- [Browser & rendering](#browser--rendering)
- [Document structure & metadata](#document-structure--metadata)
- [HTML vs XML](#html-vs-xml)
- [Semantic markup](#semantic-markup)
- [Elements reference](#elements-reference)
- [Forms & validation](#forms--validation)
- [Media & graphics](#media--graphics)
- [Performance & resource loading](#performance--resource-loading)
- [Accessibility](#accessibility)
- [SEO & structured data](#seo--structured-data)
- [Advanced topics](#advanced-topics)
- [Attributes reference](#attributes-reference)
- [Interview Practice](#interview-practice)

## Resources & links

<details>
  <summary>Primary references</summary>

* [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)
* [MDN — HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [MDN — Learn Accessibility (HTML)](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)
* [W3C HTML Validator](https://validator.w3.org/)
* [Google Search Central — SEO](https://developers.google.com/search/docs)
* [Emmet documentation](https://docs.emmet.io/)
* [InterviewBit — HTML interview questions](https://www.interviewbit.com/html-interview-questions/)
* [HackFrontend — general frontend questions](https://www.hackfrontend.com/en/docs/general-questions)
* [T-Bank frontend interview guide](https://www.tbank.ru/career/it/interview/javascript/frontend/)
* [Doka — How the browser renders pages](https://doka.guide/js/how-the-browser-renders-pages/)
* [DOM / CSSOM / Render Tree article](https://medium.com/weekly-webtips/understand-dom-cssom-render-tree-layout-and-painting-9f002f43d1aa)
* [Stepper component (HTML + CSS)](https://ishadeed.com/article/stepper-component-html-css/)
* [Web Components inspiration](https://calltoinspiration.com/)

</details>

<details>
  <summary>Tools & utilities</summary>

* [SVG assets](https://www.svgrepo.com/)
* [HTML color codes](https://htmlcolorcodes.com/)
* [Unicode symbols](https://symbl.cc/en/)
* [Codemyui — UI snippets](https://codemyui.com/)
* [HTML jargon explained](https://jargoniseasy.com/)

</details>

<details>
  <summary>Figma templates & design references</summary>

### Figma templates & design references

* [Figma verification guide](https://likeable-efraasia-4a7.notion.site/Figma-Pro-2-fcc9e125a02c4087a723e73a2cc70cbc)
* [Figma free landing pages](https://figmafreebie.com/figma-templates-by-category/web-landing-pages)
* [Free Figma templates gallery](https://www.freefigmatemplates.com/gallery/stunning-website-template)
* [E-Learning Site (Community)](https://www.figma.com/design/NUawTrSkffckrVLH7GSLvw/E-Learning-Site--Community-?node-id=0-1&p=f)
* [Whitepace SaaS Landing Page (Community)](https://www.figma.com/design/DJXQXVURpGMK5FKup1DtBf/Whitepace---SaaS-Landing-Page--Community-?node-id=5-34421)
* [NFT Marketplace Template (Community)](https://www.figma.com/design/Ew9CsGh61MDfxGr6KtpLjB/NFT-Marketplace-Template-(Community)?node-id=1647-17907)
* [About pages — Untitled UI (Community)](https://www.figma.com/design/kulMfZE8on7XVAuvdTRB4d/About-pages-%E2%80%93-Untitled-UI--untitledui.com-?node-id=0-1&p=f)
* [Bloom Beauty e-commerce (Community)](https://www.figma.com/design/zbkiTAUnL9Ir3c13XscKXf/Bloom-Beauty-e-commerce-shop---i-interactive-prototype--c---Community-?node-id=410-33166)
* [Positivus Landing Page (Community)](https://www.figma.com/design/3jCIWOnyDCiiZWYg9As5mF/Positivus-Landing-Page-Design--Community-?node-id=25-145&p=f)
* [3legant E-Commerce UI (Community)](https://www.figma.com/design/X1hTraebJOZk2kgq5i78w7/3legant-E-Commerce-UI-Design-Template--Community-?node-id=3-675)

</details>

<details>
  <summary>Website examples & student tutorials</summary>

### Website examples & student tutorials

**Website examples**

* https://advanced.team/
* https://animejs.com/
* https://referest.ru/sites/lendingi

**Student tutorials**

* [Pagination with vanilla JS](https://webdesign.tutsplus.com/pagination-with-vanilla-javascript--cms-41896t)
* [Toast notification in JS](https://dev.to/arafat4693/how-to-create-a-toast-notification-in-javascript-261d)
* [CSS section counter](https://www.w3schools.com/howto/howto_css_section_counter.asp)
* [Tab image gallery](https://www.w3schools.com/howto/howto_js_tab_img_gallery.asp)

**Project drive**

* https://drive.google.com/drive/folders/1cvz-B15d51kwQpbgaY8qrA_y3VWgnq3Z

</details>

<details>
  <summary>Is HTML a programming language?</summary>

### Is HTML a programming language?

HTML is a **markup language**, not a Turing-complete programming language. It describes document structure and semantics; it has no variables, loops, or conditionals on its own.

It is often classified as a **domain-specific language (DSL)** for hypertext documents.

* https://stackoverflow.com/questions/809574/what-is-a-domain-specific-language-anybody-using-it-and-in-what-way
* https://gomakethings.com/is-html-a-programming-language/

</details>

---

<a name="html-structure"></a>

### HTML structure

**Definition:** HTML (Hypertext Markup Language) is the standard markup language for web pages. An HTML document is a text file the browser parses into a tree of elements that communicate structure, meaning, and behavior.

**How it works:**

- Source file contains tags, attributes, and text nodes.
- Browser parser builds a live DOM tree from the markup.
- CSS and JS attach to that tree for presentation and behavior.

| Term | Role |
|------|------|
| **Tag** | Markup syntax (`<p>`, `</p>`) in source code |
| **Element** | Live DOM node — opening tag + content + closing tag (or void tag) |
| **Attribute** | Key/value metadata on an element (`href`, `class`, `alt`) |

**When to use:**

Every web page · email HTML · SSR/SSG output · component templates.

Every web page starts with HTML — it is the structural foundation for CSS and JavaScript.

#### Common pitfalls

- Confusing tags (syntax) with elements (DOM nodes).
- Omitting `lang` on `<html>`.
- Void elements written with closing tags (invalid for some).

**Pluses and minuses:**

| + | − |
|------|------|
| Universal web foundation | Not Turing-complete alone |
| Semantic elements aid a11y/SEO | Invalid markup relies on error recovery |

**Examples:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My page</title>
  </head>
  <body>
    <p class="intro">Hello, world.</p>
  </body>
</html>
```

**Thoughts:** Void elements (`<img>`, `<br>`, `<input>`, `<meta>`, `<link>`) have no closing tag. Validate with [validator.w3.org](https://validator.w3.org/).

**Sources:** [MDN — HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) · [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)

<a name="browser-rendering-pipeline"></a>

### Browser rendering pipeline

**Definition:** After the browser receives HTML, it builds the DOM, combines it with the CSSOM into a render tree, then runs layout, paint, and compositing to display pixels on screen.

**How it works:**

1. **Fetch** — first request is usually HTML; the document lists CSS, JS, images, fonts. Non-blocking resources (images) download in parallel with parse; classic `<script>` pauses HTML parse until the script loads and runs.
2. **Parse** — HTML → **DOM**; CSS → **CSSOM**. Waiting for CSS does not have to stop HTML parse (preload scanner), but **CSS blocks JavaScript** because scripts may query styles.
3. **Render tree** (WebKit name; Gecko: **frame tree**) — visible boxes only (`display: none` excluded).
4. **Layout (reflow)** — geometry, starting from the viewport-sized root, following **normal flow**. **Global** layout (e.g. window resize) walks the whole tree; **incremental** layout only **dirty** nodes (changed element + descendants).
5. **Paint** — fill pixels (text, backgrounds, shadows). Also global or incremental (dirty rectangles). Usually the costliest CPU stage.
6. **Composite** — GPU stacks independent layers. Animate `transform` / `opacity` so other layers are not relaid out or fully repainted.
7. **Repeat** — each **animation frame** (~60 fps / ~16 ms). Use `requestAnimationFrame`, not `setInterval`, so updates run before the next paint.

| Stage | Output | Related doc |
|-------|--------|-------------|
| HTML parsing | DOM | [3_js_browser.md](./3_js_browser.md) |
| CSS parsing | CSSOM | [2_css.md](./2_css.md) |
| Merge | Render tree | — |
| Layout | Geometry (reflow) | [2_css.md](./2_css.md) |
| Paint | Pixels per layer | [2_css.md](./2_css.md) |
| Composite | Final frame | — |

**When to use:**

First page load · dynamic DOM updates · CSS animations triggering paint/composite only.

Understanding this pipeline explains parser-blocking scripts, render-blocking CSS, CLS, and LCP.

#### Common pitfalls

- Parser-blocking scripts in `<head>` without `defer`.
- Images without dimensions causing layout shift.
- Animating layout properties instead of `transform`.

**Pluses and minuses:**

| + | − |
|------|------|
| Clear optimization mental model | Cross-file concerns (HTML/CSS/JS) |
| Measurable via DevTools Performance | Easy to mis-attribute bottlenecks |

**Examples:**

```html
<head>
  <link rel="stylesheet" href="/app.css" />
  <script src="/app.js" defer></script>
</head>
<body>
  <img src="hero.webp" alt="Hero" width="1200" height="630" fetchpriority="high" />
</body>
```

**Thoughts:** Script loading details → [3_js_browser.md](./3_js_browser.md). CSS layout/paint triggers → [2_css.md](./2_css.md). Property → layout/paint/composite map → [csstriggers.com](https://csstriggers.com/).

**Sources:** [web.dev — Critical rendering path](https://web.dev/articles/critical-rendering-path) · [MDN — How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/how_browsers_work) · [Doka — How the browser renders pages](https://doka.guide/js/how-the-browser-renders-pages/)

<a name="forms--semantics"></a>

### Forms & semantics

**Definition:** Semantic HTML uses elements for their intended meaning (`<nav>`, `<main>`, `<button>`) rather than generic `<div>` wrappers. Forms collect user input with native validation and accessible labels.

**How it works:**

- Semantic elements expose implicit ARIA roles to assistive technology.
- Forms wrap controls; `name` attributes key submitted data.
- Native validation (`required`, `pattern`) and `<label for>` association work without JS.

| Pattern | Semantic choice | Avoid |
|---------|-----------------|-------|
| Navigation | `<nav>` + `<a href>` | `<div onclick>` |
| Primary content | `<main>` | `<div class="main">` |
| User action | `<button type="button">` | `<div class="btn">` |
| Form field | `<label for>` + `<input name>` | Placeholder-only inputs |

**When to use:**

Marketing sites (semantics) · login/checkout forms · native `<dialog>` modals.

Always — semantics improve accessibility, SEO, and maintainability without extra JavaScript.

#### Common pitfalls

- `<div class="btn">` instead of `<button>`.
- Form inputs without `name` (silently dropped on submit).
- Placeholder as the only visible label.

**Pluses and minuses:**

| + | − |
|------|------|
| Free accessibility and SEO wins | Custom designs may tempt non-semantic markup |
| Native form validation | Complex widgets may still need ARIA |

**Examples:**

```html
<main>
  <form action="/subscribe" method="post">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required autocomplete="email" />
    <button type="submit">Subscribe</button>
  </form>
</main>
```

**Sources:** [MDN — Semantics](https://developer.mozilla.org/en-US/docs/Glossary/Semantics) · [MDN — Forms](https://developer.mozilla.org/en-US/docs/Learn/Forms)

### Element, tag, and attribute

| Term | Definition |
|------|------------|
| **Tag** | Markup syntax (`<p>`, `</p>`) that introduces an element in source code |
| **Element** | The node in the DOM tree — opening tag + content + closing tag (or void tag) |
| **Attribute** | Extra key/value metadata on an element (`href`, `class`, `alt`) |

### Void (empty) elements

Void elements have no closing tag and no content: `<img>`, `<br>`, `<input>`, `<meta>`, `<link>`, `<hr>`, `<area>`, `<base>`, `<col>`, `<embed>`, `<source>`, `<track>`, `<wbr>`.

### Content categories (HTML5)

| Category | Purpose | Examples |
|----------|---------|----------|
| Metadata | Document info, not displayed | `head`, `title`, `meta`, `link`, `style` |
| Sectioning | Document outline | `article`, `section`, `nav`, `aside` |
| Heading | Section titles | `h1`–`h6` |
| Phrasing | Inline text semantics | `span`, `a`, `em`, `strong`, `code` |
| Flow | Most body content | `div`, `p`, `ul`, `table`, `form` |
| Embedded | External resources | `img`, `video`, `iframe`, `canvas` |
| Interactive | User interaction | `a`, `button`, `input`, `select`, `textarea` |

### Code formatting rules

* One element per line for readability
* Consistent indentation per nesting level
* Always use double quotes for attribute values
* Validate with https://validator.w3.org/

---

<a name="browser--rendering"></a>

## Browser & rendering

<details>
  <summary>What happens when you enter a URL?</summary>

### What happens when you enter a URL?

**Definition:**

Entering a URL triggers a chain from DNS resolution through HTTP to HTML parsing and the full browser rendering pipeline.

| Step | Action |
|------|--------|
| Parse URL | Scheme, host, path, query, fragment |
| Resolve IP | HTTP cache of HTML, then DNS caches → IP |
| TCP | Three-way handshake (SYN → SYN-ACK → ACK) |
| TLS | Extra handshake + encryption if `https:` |
| HTTP | Request HTML; stream response |
| Parse | HTML → DOM; CSS → CSSOM |
| Render | Render tree → layout → paint → **GPU compositing** |

**How it works:**

1. **Parse the URL** — scheme (`http`/`https`), host, port, path, query, hash. Hash is not sent to the server.
2. **Reuse or fetch** — browser HTTP cache may return a stored HTML document (`Cache-Control` / `ETag`). If not, resolve the host to an IP.
3. **Find the IP** — hosts file → browser DNS cache → OS DNS cache → recursive resolver (often ISP) → root → TLD → authoritative. First hit wins.
4. **TCP handshake** — SYN, SYN-ACK, ACK so both sides agree on a connection.
5. **HTTPS** — TLS handshake (certificate + session keys) then all HTTP bytes are encrypted. HTTP skips this step.
6. **HTTP(S) request** — typically `GET /path` with `Host`, cookies, `Accept`. Server (often Nginx) maps the URI to a file or upstream.
7. **HTML stream** — parser builds the **DOM**; linked CSS builds the **CSSOM**. Parser-blocking JS without `defer`/`async`/`type="module"` pauses HTML parse.
8. **Render tree** — merge DOM + CSSOM; skip `display: none`.
9. **Layout** — geometry (where / how big). **Paint** — pixels (color, text, shadows). **Compositing** — GPU stacks layers into the frame (`transform` / `opacity` stay on the compositor — this is what makes cheap animations).

**When to use:**

Full page load · SPA client navigation (History API skips full reload) · prefetch/prerender hints.

#### Common pitfalls

- Assuming DNS is instant (TTL, cache misses).
- Ignoring TLS handshake cost on first visit.
- Measuring only TTFB, not LCP/CLS.
- Animating `top`/`left`/`width` (layout) instead of `transform`/`opacity` (compositor / GPU).

**Pluses and minuses:**

| + | − |
|------|------|
| Predictable critical path | Many network hops on cold start |
| Cacheable at each layer | Hard to debug without DevTools |

**Examples:**

```html
<!DOCTYPE html>
<html lang="en">
  <head><title>Products</title></head>
  <body><h1>Catalog</h1></body>
</html>
```

**Thoughts:**

*URL → caches/DNS → TCP → TLS if HTTPS → HTTP HTML → DOM+CSSOM → render tree → layout → paint → GPU composite.*

CSSOM and paint stages → [2_css.md](./2_css.md). DOM APIs after parse → [3_js_browser.md](./3_js_browser.md). HTTP/TLS/cache → [6_web_api.md](./6_web_api.md).

**Sources:** [MDN — How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work)

</details>

<details>
  <summary>How DNS works</summary>

### How DNS works

**Definition:**

DNS (Domain Name System) maps human-readable domain names to IP addresses so the browser can open a network connection.

| Lookup order | Cache layer |
|--------------|-------------|
| 0 | `/etc/hosts` (or Windows `hosts`) — local overrides |
| 1 | Browser DNS cache |
| 2 | OS DNS cache |
| 3 | Recursive resolver (often ISP) |
| 4 | Root → TLD → authoritative nameserver |

**How it works:**

- Check **hosts file**, then **browser cache**, then **OS cache**, then a **recursive resolver**. Misses walk root → TLD → authoritative.
- Returns A/AAAA records (IP); CNAME chains add latency.
- `dns-prefetch` / `preconnect` warm DNS and TCP/TLS early.

**When to use:**

First visit · CDN CNAME · split-horizon internal DNS.

#### Common pitfalls

- Hard-coding IPs instead of hostnames.
- Forgetting `preconnect` for third-party origins.
- Long CNAME chains without monitoring.

**Pluses and minuses:**

| + | − |
|------|------|
| Human-readable hostnames | Extra lookup latency |
| Distributed, cacheable | Misconfigured TTL causes stale IPs |

**Examples:**

```html
<!-- Browser resolves example.com → 93.184.216.34 before fetching -->
```

**Sources:** [MDN — DNS](https://developer.mozilla.org/en-US/docs/Glossary/DNS)

</details>

<details>
  <summary>How the browser fetches HTML</summary>

### How the browser fetches HTML

**Definition:**

After DNS resolves, the browser opens a TCP/TLS connection, sends an HTTP request, and receives an HTML document stream to parse.

| Phase | What happens |
|-------|--------------|
| Connect | TCP + TLS handshake (HTTPS) |
| Request | `GET /` with `Host` header |
| Response | `200 OK`, `Content-Type: text/html` |
| Parse | Tokenize HTML stream into DOM |

**How it works:**

- After connect, browser sends `GET` with `Host`, `Accept`, cookies.
- Server responds with status, headers, body stream.
- Parser consumes HTML incrementally (streaming).
- Preload scanner discovers linked resources in parallel.
- Linked assets are extra requests: `<link rel="stylesheet">`, `<img src>`, `<script src>`, fonts, etc. Images are typically non-blocking; classic scripts are parser-blocking.

**When to use:**

Same-origin HTML · CDN edge cache hit · `304 Not Modified` revalidation.

#### Common pitfalls

- Giant inline JSON in HTML bloating TTFB.
- Missing `Content-Type: text/html; charset=utf-8`.
- No compression (gzip/Brotli) on HTML.

**Pluses and minuses:**

| + | − |
|------|------|
| Streaming parse starts early | Large HTML still blocks first paint |
| HTTP/2 multiplexing | Head-of-line blocking on HTTP/1.1 |

**Examples:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <link href="/style.css" rel="stylesheet" />
    <title>Document</title>
  </head>
  <body>
    <img src="/hello.jpg" alt="Hello" width="400" height="300" />
    <script src="/index.js" defer></script>
  </body>
</html>
```

The HTML response also triggers fetches for `style.css`, `hello.jpg`, and `index.js`.

**Sources:** [MDN — HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) · [MDN — How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/how_browsers_work)

</details>

<details>
  <summary>What is the DOM?</summary>

### What is the DOM?

**Definition:**

The DOM (Document Object Model) is the browser's live in-memory tree representation of the HTML document. HTML is the source; parsing builds the DOM.

| Concept | Description |
|---------|-------------|
| HTML | Static markup in the response |
| DOM | Runtime object graph |
| Mutation | JS changes DOM → browser re-renders |

**How it works:**

- Parser tokenizes HTML into nodes: `document` → `html` → `head`/`body` → elements/text.
- DOM is **live** — JS mutations trigger style/layout updates.
- HTML source ≠ DOM after JS changes.
- Classic `<script src>` mid-document: parser has only built nodes **above** the tag. `getElementById` for a later `<img>` is `null` unless you use `defer`/`async`/`module` or move the script after the markup.

**When to use:**

Static pages · client-rendered SPAs · `innerHTML` updates.

#### Common pitfalls

- Confusing HTML file with runtime DOM.
- `innerHTML` with untrusted input (XSS).
- Assuming whitespace text nodes don't exist.

**Pluses and minuses:**

| + | − |
|------|------|
| Standard API across browsers | Verbose vs frameworks |
| Live updates | Frequent writes cause layout thrashing |

**Examples:**

```html
<!-- image is null: parser stopped at the script -->
<script src="script.js"></script>
<img id="image" src="/hello.jpg" alt="Hello" />

<!-- image is found -->
<img id="image" src="/hello.jpg" alt="Hello" />
<script src="script.js"></script>

<!-- also found: defer runs after HTML parse -->
<script src="script.js" defer></script>
<img id="image" src="/hello.jpg" alt="Hello" />
```

**Thoughts:** DOM manipulation and events → [3_js_browser.md](./3_js_browser.md).

**Sources:** [MDN — DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) · [MDN — script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)

</details>

<details>
  <summary>How the DOM tree is built (HTML parsing)</summary>

### How the DOM tree is built (HTML parsing)

**Definition:**

The browser parses HTML top-to-bottom: tokenization converts bytes to tokens, then tree construction creates DOM nodes. Classic scripts without `async`/`defer`/`type="module"` block parsing.

| Step | Action |
|------|--------|
| Tokenization | Bytes → start/end tags, text, comments |
| Tree construction | Tokens → DOM nodes |
| Script handling | Blocking scripts pause parser |
| Preload scanner | Discovers resources early |

**How it works:**

- Tokenizer reads bytes → tags, attributes, text, comments.
- Tree builder inserts nodes; fixes optional tags per spec.
- **Parser-blocking** `<script>` without `async`/`defer`/`module` pauses tree build.
- Preload scanner fetches CSS/images/scripts early.

**When to use:**

Document with deferred scripts · inline script mid-body · malformed HTML (error recovery).

#### Common pitfalls

- `<script>` in `<head>` without `defer` blocks entire parse.
- `document.write` during parse (legacy anti-pattern).
- Relying on implicit optional tags for layout.

**Pluses and minuses:**

| + | − |
|------|------|
| Forgiving error recovery | Invalid HTML may differ across engines |
| Incremental build | Blocking scripts delay DOMContentLoaded |

**Examples:**

```html
<html><body><h1>Hello</h1><p>Text</p></body></html>
```

**Thoughts:** `async`/`defer` script behavior → [3_js_browser.md](./3_js_browser.md).

**Sources:** [WHATWG — Parsing](https://html.spec.whatwg.org/multipage/parsing.html)

</details>

<details>
  <summary>What is the CSSOM?</summary>

### What is the CSSOM?

**Definition:**

The CSSOM (CSS Object Model) is the browser's object representation of parsed CSS rules. The DOM holds structure; the CSSOM holds computed style information.

| Model | Holds |
|-------|-------|
| DOM | Document structure |
| CSSOM | Style rules per selector |
| Render tree | DOM + CSSOM merged |

**How it works:**

- Each stylesheet parsed into rule objects (selector → declarations).
- Cascade computes winning styles per element.
- CSSOM is separate from DOM until render tree merge.
- Render-blocking: CSS in `<head>` delays first paint (avoids FOUC). Prefer **critical CSS** first (shared + page-specific above-the-fold).
- Waiting for CSS need not stop HTML parse (preload scanner), but **it blocks JS**: scripts often query computed styles / selectors.

**When to use:**

External stylesheet · inline `<style>` · `@import` chains (slower).

#### Common pitfalls

- `@import` inside CSS (serial loading).
- Missing `<link rel="stylesheet">` in `<head>`.
- Assuming DOM order alone determines paint order.

**Pluses and minuses:**

| + | − |
|------|------|
| Separates structure from presentation | `@import` blocks parallel fetch |
| Cacheable CSS files | Large CSS delays first paint |

**Examples:**

```html
<head><link rel="stylesheet" href="/styles.css" /></head>
<body><h1>Hello</h1></body>
```

**Thoughts:** CSS cascade and specificity → [2_css.md](./2_css.md).

**Sources:** [MDN — CSSOM](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model) · [MDN — How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/how_browsers_work)

</details>

<details>
  <summary>What is the Render Tree?</summary>

### What is the Render Tree?

**Definition:**

The render tree combines the DOM and CSSOM into a tree of boxes ready for layout and paint. Elements with `display: none` are excluded. WebKit/Blink call it the render tree; Gecko uses **frame tree**.

| Input | Output |
|-------|--------|
| DOM | Structure nodes |
| CSSOM | Style for each node |
| Render tree | Visible boxes with computed styles |

**How it works:**

- Walk DOM; attach computed styles from CSSOM.
- Exclude `display: none` subtrees entirely.
- `visibility: hidden` stays in tree (invisible, still occupies space).
- Output: boxes ready for layout.

**When to use:**

Hidden modals (`display:none`) · off-screen menus · `content-visibility: auto`.

#### Common pitfalls

- `visibility:hidden` still affects layout/CLS.
- `aria-hidden` does not remove from render tree.
- `display:none` children still in DOM (queryable).

**Pluses and minuses:**

| + | − |
|------|------|
| Only visible work is laid out | Easy to confuse `hidden` vs `display:none` |
| Merges DOM + styles | Pseudo-elements add extra boxes |

**Examples:**

```html
<body>
  <h1>Hello</h1>
  <p hidden>Not in render tree</p>
</body>
```

**Thoughts:** `display: none` vs `visibility: hidden` → [2_css.md](./2_css.md).

**Sources:** [web.dev — Render tree](https://web.dev/articles/critical-rendering-path/constructing-the-object-model)

</details>

<details>
  <summary>Layout (Reflow)</summary>

### Layout (Reflow)

**Definition:**

Layout (reflow) computes the geometry of every visible element — width, height, position, and margins — on the page.

| Property change | Triggers reflow? |
|-----------------|-----------------|
| `width`, `height`, `padding` | Yes |
| DOM insert/remove | Yes |
| `transform`, `opacity` | No (compositor) |

**How it works:**

- Computes x/y/width/height for every render-tree box, recursively from the root (viewport size).
- **Normal flow:** boxes that do not affect siblings can be sized in one pass — stay in flow so the engine does less work.
- **Global layout** — whole tree (window resize). **Incremental layout** — only **dirty** nodes: the mutated element and its descendants (children may depend on the parent).
- Triggers: size changes, font load, DOM insert/remove, reading layout after write.
- Flexbox/Grid/table algorithms run here.

**When to use:**

Initial page layout · responsive resize · dynamic content injection.

#### Common pitfalls

- Animating `width`/`height`/`top`/`left` (triggers layout every frame).
- Reading `offsetHeight` then writing style in a loop.
- Images without dimensions causing reflow on load.

**Pluses and minuses:**

| + | − |
|------|------|
| Accurate geometry | Most expensive rendering stage |
| Required for readable text flow | Layout thrashing if read/write interleaved |

**Examples:**

```html
<div>One</div>
<div>Two</div>
```

**Thoughts:** Box model and layout modes → [2_css.md](./2_css.md).

**Sources:** [MDN — Reflow](https://developer.mozilla.org/en-US/docs/Glossary/Reflow)

</details>

<details>
  <summary>Paint</summary>

### Paint

**Definition:**

Paint rasterizes the visual appearance of each box — text, backgrounds, borders, and shadows — into bitmap layers.

| Stage | Answers |
|-------|---------|
| Layout | Where and how big? |
| Paint | What does it look like? |
| Composite | How are layers stacked? |

**How it works:**

- Rasterizes visual parts: text, backgrounds, borders, shadows.
- Split into paint records per layer; viewport tiled into rectangles — only dirty tiles repaint.
- Paint is typically the most expensive CPU stage among parse → layout → paint.
- Simplified order (back → front, within a stacking context): `background-color` → `background-image` → `border` → descendants → `outline`. Full order → [2_css.md — stacking context](./2_css.md).
- `overflow:hidden` and stacking contexts create clip boundaries.

**When to use:**

Text rendering · box shadows · `border-radius` · large `box-shadow` repaints.

#### Common pitfalls

- Huge `box-shadow` on scrolling containers.
- Frequent `background` changes on large elements.
- Assuming `opacity` always avoids paint (depends on layer).

**Pluses and minuses:**

| + | − |
|------|------|
| Necessary for visual fidelity | Large paint areas are costly |
| Layer splitting helps | `will-change` overuse wastes memory |

**Examples:**

```html
<p class="hero">Styled text</p>
```

**Thoughts:** Paint cost and `will-change` → [2_css.md](./2_css.md).

**Sources:** [MDN — Repaint](https://developer.mozilla.org/en-US/docs/Glossary/Repaint)

</details>

<details>
  <summary>Compositing</summary>

### Compositing

**Definition:**

Compositing merges painted layers into the final frame on the GPU. Elements with `transform`, `opacity`, or `will-change` may be promoted to their own layer.

| Change type | Typical cost |
|-------------|--------------|
| Layout | Highest |
| Paint | Medium |
| Composite only | Lowest |

**How it works:**

- Layout and paint run on the **CPU**; compositor-friendly animations use the **GPU**.
- GPU merges painted layers into final framebuffer. Layers are independent — a change in one need not repaint another.
- Promoted layers: `transform`, `opacity`, `will-change`, `<video>`, `<canvas>`.
- Compositor-only changes skip layout and often skip paint.
- Check which CSS properties trigger layout/paint/composite: [CSS Triggers](https://csstriggers.com/).

**When to use:**

`transform` animations · fixed headers · video overlays.

#### Common pitfalls

- Animating `margin` instead of `transform`.
- `will-change: transform` on everything.
- Ignoring mobile GPU memory limits.

**Pluses and minuses:**

| + | − |
|------|------|
| Smooth 60fps animations | Extra layers use GPU memory |
| Skips layout for transforms | Over-promotion causes layer explosion |

**Examples:**

```html
<div class="animated-card">Compositor-friendly</div>
```

**Thoughts:** GPU-friendly animations → [2_css.md](./2_css.md).

**Sources:** [MDN — Composite](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Composite)

</details>

<details>
  <summary>Layout vs Paint vs Compositing</summary>

### Layout vs Paint vs Compositing

**Definition:**

These three rendering stages answer different questions. Understanding which CSS properties trigger which stage helps optimize animations and avoid jank.

| Stage | Answers | Typical triggers |
|-------|---------|------------------|
| **Layout** | Where? How big? | `width`, `height`, `padding`, DOM insert |
| **Paint** | What does it look like? | `color`, `background`, `box-shadow` |
| **Composite** | How are layers stacked? | `transform`, `opacity` |

**How it works:**

- **Layout** — geometry. **Paint** — pixels. **Composite** — layer stack.
- DevTools Performance panel shows which stage each change triggered.
- Prefer composite-friendly properties for animations.

| Stage | Cost | Typical properties |
|-------|------|--------------------|
| Layout | Highest | `width`, `height`, `padding` |
| Paint | Medium | `color`, `background`, `box-shadow` |
| Composite | Lowest | `transform`, `opacity` |

**When to use:**

Hover color change (paint) · accordion height (layout) · slide-in panel (`transform`, composite).

#### Common pitfalls

- Using `top`/`left` for animations instead of `transform`.
- One property change triggering all three stages.
- Not profiling before micro-optimizing.

**Examples:**

```html
<div id="box">Content</div>
```

**Thoughts:** Full CSS performance guide → [2_css.md](./2_css.md).

**Sources:** [web.dev — Rendering performance](https://web.dev/articles/rendering-performance)

</details>

<details>
  <summary>Global vs incremental layout (dirty nodes)</summary>

### Global vs incremental layout (dirty nodes)

**Definition:** Layout can recalculate the entire render tree (**global**) or only the **dirty** subtree (**incremental**) — the changed element and its descendants.

**How it works:**

- **Global** — e.g. viewport resize: every box must fit the new width. Expensive.
- **Incremental** — a style/DOM change dirties that node; children are dirtied because their size/position may depend on the parent.
- Stay in **normal flow** when possible so siblings do not force extra passes.

**When to use:**

Window resize (global) · toggling a sidebar width (dirty subtree) · injecting a list item.

#### Common pitfalls

Reading `offsetHeight` after a write forces a synchronous (often global-feeling) reflow.

**Pluses and minuses:**

| + | − |
|---|---|
| Incremental avoids full-tree work | Dirty parent still walks all children |
| Flow layout is one-pass for independent boxes | Out-of-flow / percentage sizes can cascade dirtiness |

**Examples:** Changing one card's `padding` relayouts that card and its nested content, not necessarily the whole page.

**Thoughts:**

*Dirty = changed node + descendants; window resize is global.*

CSS property cost table → [2_css.md — Reflow, repaint, composite](./2_css.md).

**Sources:** [MDN — How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/how_browsers_work) · [Doka — How the browser renders pages](https://doka.guide/js/how-the-browser-renders-pages/)

</details>

<details>
  <summary>Reflow, repaint, and animation frames</summary>

### Reflow, repaint, and animation frames

**Definition:** The render pipeline is cyclic. DOM/style changes rebuild (parts of) the render tree, then **reflow** (layout) and/or **repaint**, once per **animation frame**.

**How it works:**

- New node, text change, or geometry CSS → new/updated render tree → layout → paint.
- Color/`background` often **repaint** only; `width`/`margin`/`top` → **reflow** then paint.
- Target ~60 fps (~16 ms/frame). `requestAnimationFrame(cb)` runs `cb` **before the next paint**, aligned with the display.
- `setInterval(fn, 1000/60)` is not synced to the pipeline: frames can be uneven, and a hidden tab may **catch up** by firing many callbacks at once.

**When to use:**

Canvas/JS animation loops · measuring layout then mutating in rAF · avoiding layout thrashing.

| + rAF | − `setInterval` for visuals |
|--------|-----------------------------|
| Before paint, pauses in background | Unrelated to paint phase |
| Close to refresh rate | Catch-up bursts after inactive tab |

#### Common pitfalls

Animating `left`/`top`/`margin`/`background` every frame (layout/paint). Prefer `transform` and `opacity`.

**Examples:**

```js
function animate(ts) {
  box.style.transform = `translateX(${Math.min(ts / 10, 400)}px)`;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

**Thoughts:**

*One cycle = one animation frame; tell the browser with `requestAnimationFrame`, not a 16 ms interval.*

API details → [3_js_browser.md — requestAnimationFrame](./3_js_browser.md#request-animation-frame).

**Sources:** [MDN — requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) · [MDN — CSS vs JS animation performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance)

</details>

<details>
  <summary>Progressive rendering</summary>

### Progressive rendering

**Definition:** Progressive rendering shows useful pixels early instead of waiting for the full HTML/CSS/JS bundle — paint incrementally as resources arrive.

**How it works:**

- HTML is a **stream**: the parser builds DOM as bytes land; first paint still waits on **render-blocking CSS** for the CSSOM.
- Ship **critical CSS** first; defer the rest. `defer`/`async`/`type="module"` keep scripts off the parser-critical path.
- Below-fold: `loading="lazy"`, `content-visibility: auto`, skeletons while data loads.

**When to use:**

Long articles · marketing LCP hero · SSR HTML that hydrates later.

#### Common pitfalls

One giant CSS file in `<head>`; parser-blocking bundle before content.

**Pluses and minuses:**

| + | − |
|---|---|
| Faster FCP/LCP perception | Extra split CSS/JS complexity |
| Streaming HTML starts parse early | Incomplete CSS still delays first styled paint |

**Examples:** Inline above-the-fold CSS in `<head>`; `<script defer>` for the app; `loading="lazy"` on below-fold images.

**Thoughts:**

*Paint something useful ASAP — critical CSS + non-blocking JS + lazy below-fold.*

CSS techniques → [2_css.md — progressive rendering](./2_css.md). Script loading → [3_js_browser.md](./3_js_browser.md).

**Sources:** [MDN — Critical rendering path](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path) · [web.dev — Critical rendering path](https://web.dev/articles/critical-rendering-path)

</details>

<details>
  <summary>First render — full pipeline</summary>

### First render — full pipeline

**Definition:**

The critical rendering path is the sequence from receiving HTML/CSS/JS to the first painted frame. Parser-blocking resources delay time-to-first-paint.

| # | Step |
|---|------|
| 1 | DNS lookup |
| 2 | TCP/TLS connection |
| 3 | HTTP request/response |
| 4 | HTML → DOM |
| 5 | CSS → CSSOM |
| 6 | Render tree |
| 7 | Layout → Paint → Composite |

**How it works:**

- Critical rendering path: HTML → DOM + CSS → CSSOM → render tree → layout → paint → composite.
- First Contentful Paint (FCP) / LCP mark user-visible milestones. Full FCP: [6_web_api.md](./6_web_api.md#first-contentful-paint-fcp).
- Parser-blocking CSS in `<head>` delays first paint (browser waits for CSSOM). Parser-blocking JS without `defer` pauses HTML parse.

**When to use:**

Marketing landing (optimize LCP hero) · dashboard (defer non-critical JS) · SSR + hydration.

#### Common pitfalls

- Render-blocking scripts in `<head>` without `defer`.
- Hero image without `width`/`height` or `fetchpriority`.
- CSS loaded at bottom of `<body>` causing FOUC.

**Pluses and minuses:**

| + | − |
|------|------|
| Clear optimization targets (CRP) | Many moving parts across HTML/CSS/JS |
| Measurable via Web Vitals | Over-inlining bloats HTML |

**Examples:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="/critical.css" />
    <script src="/app.js" defer></script>
  </head>
  <body><main><h1>First paint</h1></main></body>
</html>
```

**Thoughts:** Script loading → [3_js_browser.md](./3_js_browser.md). CSS blocking → [2_css.md](./2_css.md).

**Sources:** [web.dev — Critical rendering path](https://web.dev/articles/critical-rendering-path)

</details>

---

<a name="document-structure--metadata"></a>

## Document structure & metadata

<details>
  <summary>Basic HTML document structure</summary>

### Basic HTML document structure

**Definition:**

A valid HTML5 document has a DOCTYPE, root `<html>` with `lang`, a `<head>` for metadata, and a `<body>` for visible content.

| Part | Role |
|------|------|
| `<!DOCTYPE html>` | Triggers standards mode |
| `<html lang>` | Root element; language for a11y/SEO |
| `<head>` | Metadata, links — not page content |
| `<body>` | Visible content |

**How it works:**

- `<!DOCTYPE html>` → standards mode.
- `<html lang>` sets document language.
- `<head>`: charset, viewport, title, linked resources.
- `<body>`: visible flow content only.

**When to use:**

Static site · SPA shell (`<div id="app">`) · AMP-like minimal docs.

#### Common pitfalls

- Missing `<meta charset>` (encoding bugs).
- Multiple `<main>` or none.
- Placing visible content in `<head>`.

**Pluses and minuses:**

| + | − |
|------|------|
| Valid skeleton aids a11y/SEO | Boilerplate easy to omit in snippets |
| `lang` helps screen readers | Wrong `lang` hurts pronunciation |

**Examples:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Page title</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body></body>
</html>
```

**Sources:** [MDN — Getting started](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started)

</details>

<details>
  <summary>DOCTYPE</summary>

### DOCTYPE

**Definition:**

The `<!DOCTYPE html>` declaration tells the browser to use HTML5 standards mode. Without it, browsers may enter quirks mode with inconsistent layout behavior.

| Mode | Trigger | Effect |
|------|---------|--------|
| Standards | `<!DOCTYPE html>` | Spec-compliant layout |
| Quirks | Missing/invalid DOCTYPE | Legacy IE emulation |

**How it works:**

- `<!DOCTYPE html>` is the HTML5 doctype — not an element.
- Triggers **standards mode** (no quirks).
- Must be first line; no attributes.

| Mode | Trigger | Effect |
|------|---------|--------|
| Standards | `<!DOCTYPE html>` | Spec-compliant layout |
| Quirks | Missing/invalid DOCTYPE | Legacy box model bugs |

**When to use:**

New HTML5 pages · legacy pages missing DOCTYPE (quirks).

#### Common pitfalls

- Uppercase `<!DOCTYPE HTML>` still works but inconsistent style.
- XML-style `<!DOCTYPE html />` is wrong.
- XHTML doctypes on HTML5 pages.

**Examples:**

```html
<!DOCTYPE html>
<html lang="en"><body></body></html>
```

**Sources:** [MDN — DOCTYPE](https://developer.mozilla.org/en-US/docs/Glossary/Doctype)

</details>

<details>
  <summary>HTML vs XML</summary>

### HTML vs XML

**Definition:** HTML is a **fixed** tag set for pages in a browser. XML is the same *kind* of markup, but **you name the tags** — it is a data/document syntax, not a UI language.

**How it works:** XML is strict (one root, closed tags, quoted attributes). HTML5 parsers recover from errors. `DOCTYPE` is HTML’s mode switch; XML’s optional `<?xml …?>` is encoding/version meta. Full syntax, namespaces, SVG `xmlns`: [6_web_api.md — XML](./6_web_api.md#xml).

**When to use:** Interview “how is XML not HTML?” · why a `.svg` file needs `xmlns` but inline SVG in HTML often does not.

**Thoughts:** HTML displays; XML (and JSON) carry data.

**Sources:** [MDN — XML introduction](https://developer.mozilla.org/en-US/docs/Web/XML/Guides/XML_introduction)

</details>

<details>
  <summary>Meta tags</summary>

### Meta tags

**Definition:**

Meta elements live in `<head>` and provide document metadata — charset, viewport, description, and robots directives.

| Meta | Purpose |
|------|---------|
| `charset` | Character encoding |
| `viewport` | Mobile responsive scaling |
| `description` | Search snippet text |
| `robots` | Crawl/index directives |

**How it works:**

- `<meta>` void elements in `<head>` for document metadata.
- `charset` must be early (first 1024 bytes ideally).
- `viewport` required for mobile responsive layout.
- `description`/`robots` affect search snippets and crawling.

| Meta | Purpose |
|------|--------|
| `charset` | Character encoding |
| `viewport` | Mobile scaling |
| `description` | Search snippet |
| `robots` | Crawl directives |

**When to use:**

Public pages (SEO meta) · `noindex` staging · `theme-color` PWA.

#### Common pitfalls

- Duplicate `viewport` tags.
- `keywords` meta (ignored by major engines).
- `refresh` redirect (bad for a11y; use HTTP redirect).

**Examples:**

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="Short page summary for search results" />
<meta name="robots" content="index, follow" />
```

**Sources:** [Google — Special tags](https://developers.google.com/search/docs/crawling-indexing/special-tags)

</details>

<details>
  <summary>link rel types & resource hints</summary>

### link rel types & resource hints

**Definition:** The `<link>` element connects the document to external resources — stylesheets, icons, canonical URLs, and performance hints.

**How it works:**

- `<link rel="stylesheet">` — render-blocking CSS in critical path.
- `canonical` — preferred URL for duplicate content (SEO).
- `preconnect` — early DNS+TCP+TLS; `preload` — high-priority current-page fetch; `prefetch` — low-priority next navigation.

| `rel` value | Purpose |
|-------------|---------|
| `stylesheet` | CSS |
| `canonical` | Preferred URL for SEO |
| `preconnect` | Early connection (DNS+TCP+TLS) |
| `preload` | High-priority fetch for current page |
| `prefetch` | Low-priority fetch for next navigation |

**When to use:**

Critical font preload · CDN preconnect · next-page prefetch.

| `rel` | When |
|------|------|
| `stylesheet` | App CSS |
| `preconnect` | Third-party origin |
| `preload` | LCP image/font |

#### Common pitfalls

- Preloading everything (bandwidth waste).
- `preload` without matching `as` type.
- `preconnect` to origins never used.

**Examples:**

```html
<link rel="stylesheet" href="/app.css" />
<link rel="canonical" href="https://example.com/page" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preload" href="/hero.woff2" as="font" type="font/woff2" crossorigin />
<script src="https://cdn.example.com/lib.js" integrity="sha384-..." crossorigin="anonymous"></script>
```

**Thoughts:** Why `preconnect` exists (TCP+TLS RTT) → [TCP vs UDP](./6_web_api.md#tcp-vs-udp).

**Sources:** [MDN — link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel)

</details>

<details>
  <summary>Favicon & app icons (link rel icon)</summary>

### Favicon & app icons (link rel icon)

**Definition:** `<link rel="icon">` and related `rel` values declare favicons and home-screen icons browsers and OSes use for tabs, bookmarks, and PWA install UI.

**How it works:**

- Browsers fetch `rel="icon"` from `<head>` (fallback: `/favicon.ico` at site root).
- Provide PNG/SVG sizes; `apple-touch-icon` for iOS; manifest `icons` for PWA install prompts.
- SVG favicons scale; PNG needs multiple sizes for retina.

| `rel` | Purpose |
|------|--------|
| `icon` | Standard favicon |
| `apple-touch-icon` | iOS home screen |
| `mask-icon` | Safari pinned tab |

**When to use:**

Browser tab branding · PWA install · dark/light favicon via `media` attribute on `<link>`.

#### Common pitfalls

- 404 on `/favicon.ico` when only PNG linked.
- Single 16×16 icon blurry on retina.
- Manifest `icons` missing 192×512 for Android install.

**Pluses and minuses:**

| + | − |
|------|------|
| Professional polish in tabs/bookmarks | Many sizes to maintain |
| SVG one file scales | Older IE ignored SVG favicons |

**Examples:**

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
```

**Sources:** [MDN — link rel icon](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel#icon)

</details>

<details>
  <summary>modulepreload & dns-prefetch resource hints</summary>

### modulepreload & dns-prefetch resource hints

**Definition:** Resource hints tell the browser to resolve DNS or fetch modules early, reducing latency on critical cross-origin or ESM resources.

**How it works:**

- `dns-prefetch` — DNS lookup only (cheap hint for third-party domains).
- `preconnect` — DNS + TCP + TLS (use for fonts/CDN you will definitely use).
- `modulepreload` — fetch + parse ES module early; use for entry `.mjs` files.

| Hint | Cost | Use when |
|------|------|----------|
| `dns-prefetch` | DNS only | Many third-party origins |
| `preconnect` | Full connection | Critical CDN/fonts |
| `modulepreload` | Module fetch | ESM entry point |

**When to use:**

Analytics domain dns-prefetch · Google Fonts preconnect · `modulepreload` for `app.mjs`.

#### Common pitfalls

- `preconnect` to origins never used on page.
- `modulepreload` without matching `crossorigin` on CORS modules.
- Replacing all `preconnect` with `dns-prefetch` when full connection warmup needed.

**Pluses and minuses:**

| + | − |
|------|------|
| Cuts connection latency | Over-hinting wastes bandwidth |
| Faster ESM startup | `modulepreload` needs `crossorigin` if CORS |

**Examples:**

```html
<link rel="dns-prefetch" href="https://analytics.example.com" />
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
<link rel="modulepreload" href="/app.mjs" crossorigin />
```

**Sources:** [MDN — dns-prefetch](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/dns-prefetch) · [modulepreload](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/modulepreload)

</details>

<details>
  <summary>base element</summary>

### base element

**Definition:**

The `<base>` element sets the default URL and target for all relative links on the page. Use sparingly — one per document, must be in `<head>`.

| Attribute | Effect |
|-----------|--------|
| `href` | Base URL for relative links |
| `target` | Default `target` for links |

**How it works:**

- Single `<base href>` in `<head>` rewrites relative URLs for `a`, `link`, `img`, `form`, etc.
- Optional `target` sets default link target.
- Affects entire document — use sparingly.

**When to use:**

Email HTML templates · embedded docs in iframe · mirror sites.

#### Common pitfalls

- Multiple `<base>` elements (invalid).
- `<base>` after relative URLs already parsed.
- `target="_blank"` on base affecting all links.

**Pluses and minuses:**

| + | − |
|------|------|
| Portable relative paths | Breaks fragment-only links if mis-set |
| One place to change base URL | Hard to debug unexpected resolves |

**Examples:**

```html
<base href="https://example.com/assets/" target="_blank" />
```

**Sources:** [MDN — base](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)

</details>

<details>
  <summary>Absolute vs relative paths</summary>

### Absolute vs relative paths

**Definition:**

URLs in HTML can be relative to the current document or absolute. Relative paths are portable; absolute URLs are required for external resources.

| Type | Example | Use case |
|------|---------|----------|
| Relative | `/images/logo.png` | Same site |
| Relative parent | `../css/app.css` | Sibling directories |
| Absolute URL | `https://cdn.example.com/app.js` | External CDN |

**How it works:**

- **Relative** — resolved against current URL or `<base>`.
- **Root-relative** (`/assets/x`) — from site root.
- **Absolute** (`https://...`) — full URL, required for cross-origin.

| Type | Example | Use |
|------|---------|-----|
| Root-relative | `/img/logo.png` | Same site |
| Relative | `../css/app.css` | Nested paths |
| Absolute | `https://cdn.../x.js` | External CDN |

**When to use:**

Same-repo assets (`/css/app.css`) · sibling dir (`../img/x`) · CDN (`https://cdn...`).

#### Common pitfalls

- Broken paths when moving files without updating `../`.
- Protocol-relative `//cdn...` (deprecated pattern).
- Relative paths in emails (unreliable).

**Examples:**

```html
<img src="/images/logo.png" alt="Logo" />
<link rel="stylesheet" href="../css/app.css" />
<script src="https://cdn.example.com/lib.js"></script>
```

**Sources:** [MDN — Links](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks)

</details>

<details>
  <summary>Comments & HTML entities</summary>

### Comments & HTML entities

**Definition:**

HTML comments are not rendered. Entities represent special characters that would otherwise break markup or are not on the keyboard.

| Entity | Character |
|--------|-----------|
| `&amp;` | `&` |
| `&lt;` / `&gt;` | `<` / `>` |
| `&copy;` | © |
| `&nbsp;` | non-breaking space |

**How it works:**

- `<!-- comment -->` not rendered; cannot nest.
- Entities encode reserved/special chars: `&lt;`, `&amp;`, `&copy;`.
- Numeric entities `&#169;` / `&#xA9;` for any Unicode code point.

| Entity | Character |
|--------|----------|
| `&amp;` | `&` |
| `&lt;` / `&gt;` | `<` / `>` |
| `&nbsp;` | non-breaking space |

**When to use:**

Template notes in source · displaying `<` in code samples · copyright symbols.

#### Common pitfalls

- Unescaped `&` in URLs/attributes.
- `&nbsp;` for layout spacing (use CSS).
- Comments with `--` inside (invalid).

**Examples:**

```html
<!-- This is a comment; not rendered -->
<p>&copy; 2025 &mdash; Price: &euro;10 &lt; &euro;20</p>
```

**Sources:** [MDN — Entities](https://developer.mozilla.org/en-US/docs/Glossary/Entity)

</details>

---

<a name="semantic-markup"></a>

## Semantic markup

<details>
  <summary>Why semantics matter</summary>

### Why semantics matter

**Definition:**

Semantic markup uses elements for their intended meaning, not just visual appearance. It improves accessibility, SEO, and maintainability.

| Benefit | How semantics help |
|---------|-------------------|
| Accessibility | Screen readers understand structure |
| SEO | Search engines index meaning |
| Maintainability | Styles change without losing meaning |

**How it works:**

- Elements carry meaning beyond default styling.
- Assistive tech maps roles from native tags.
- Search engines use headings/landmarks for outline.
- CSS can change; semantics should not.

| Benefit | How |
|---------|-----|
| Accessibility | SR announces `<nav>`, `<button>` correctly |
| SEO | Heading hierarchy signals topics |
| Maintainability | Meaning survives CSS refactors |

**When to use:**

Public content sites · forms · design systems with native widgets.

#### Common pitfalls

- `<div class="btn">` instead of `<button>`.
- Div-soup layouts with no landmarks.
- ARIA roles duplicating native elements.

**Examples:**

```html
<nav aria-label="Main">
  <a href="/">Home</a>
</nav>
<main><article><h1>Post</h1></article></main>
```

**Sources:** [MDN — Semantics](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)

</details>

<details>
  <summary>Landmark elements</summary>

### Landmark elements

**Definition:**

Landmark elements define major page regions so assistive technology and search engines can navigate the document outline.

| Element | Purpose |
|---------|---------|
| `<header>` | Introductory content |
| `<nav>` | Navigation links |
| `<main>` | Primary unique content (one per page) |
| `<article>` | Self-contained content |
| `<aside>` | Tangentially related content |
| `<footer>` | Footer for page or section |

**How it works:**

- Landmarks: `header`, `nav`, `main`, `footer`, `aside`, `section`, `article`.
- Screen readers provide landmark navigation shortcuts.
- One `<main>` per page; label multiple `nav` with `aria-label`.

| Element | Purpose |
|---------|--------|
| `<main>` | Primary unique content |
| `<nav>` | Navigation link groups |
| `<aside>` | Tangential content |

**When to use:**

Marketing site · blog (`article`) · app shell with `aside` sidebar.

#### Common pitfalls

- Multiple `<main>` elements.
- `<section>` without heading (anonymous region).
- `<header>`/`<footer>` inside every card (over-nesting).

**Examples:**

```html
<header><p>Site title</p></header>
<nav aria-label="Main"><a href="/">Home</a></nav>
<main><article><h1>Post title</h1><p>Content</p></article></main>
<footer><p>&copy; 2025</p></footer>
```

**Sources:** [MDN — Landmarks](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role)

</details>

<details>
  <summary>Heading hierarchy</summary>

### Heading hierarchy

**Definition:**

Headings (`h1`–`h6`) create a logical document outline. Use one `<h1>` per page and do not skip levels.

| Rule | Reason |
|------|--------|
| One `<h1>` per page | Clear page topic |
| No skipped levels | Predictable outline for screen readers |
| Heading per section | Thematic grouping |

**How it works:**

- `h1`–`h6` define document outline levels.
- One logical `h1` per page (topic title).
- Do not skip levels (`h1` → `h3`).
- Section headings should describe the section below.

| Rule | Reason |
|------|--------|
| One `h1` | Clear page topic |
| No skipped levels | Predictable SR outline |

**When to use:**

Article page · settings page with sections · modal with its own `h2`.

#### Common pitfalls

- Choosing heading level for font size (use CSS).
- Empty sections with headings only.
- `h1` in every component on SPA pages.

**Examples:**

```html
<h1>Product catalog</h1>
  <h2>Electronics</h2>
    <h3>Phones</h3>
```

**Sources:** [MDN — Headings](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)

</details>

<details>
  <summary>Figure and navigation patterns</summary>

### Figure and navigation patterns

**Definition:**

The `<figure>` element groups self-contained content with an optional `<figcaption>`. `<nav>` wraps navigation link lists.

| Element | Use |
|---------|-----|
| `<figure>` | Image, diagram, code with caption |
| `<figcaption>` | Caption for figure |
| `<nav>` | Group of navigation links |

**How it works:**

- `<figure>` groups media + optional `<figcaption>`.
- `<nav>` wraps major navigation link lists.
- Use `aria-label` when multiple nav regions exist.

| Element | Use |
|---------|-----|
| `<figure>` | Self-contained media + caption |
| `<nav>` | Link groups for navigation |

**When to use:**

Charts with captions · image galleries · footer vs main nav.

#### Common pitfalls

- `<nav>` around every link group (overuse).
- Figcaption missing for informative images in figure.
- Navigation built from `<div onclick>`.

**Examples:**

```html
<figure>
  <img src="chart.png" alt="Sales grew 40% in Q4" />
  <figcaption>Q4 sales chart</figcaption>
</figure>
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```

**Sources:** [MDN — figure](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)

</details>

<details>
  <summary>Text semantics</summary>

### Text semantics

**Definition:**

Phrasing elements convey meaning for text — emphasis, abbreviations, quotations, code, and dates.

| Element | Meaning |
|---------|---------|
| `<strong>` | Strong importance |
| `<em>` | Stress emphasis |
| `<abbr title>` | Abbreviation |
| `<time datetime>` | Machine-readable date |
| `<code>` / `<pre>` | Code snippets |

**How it works:**

- Phrasing elements: `strong`, `em`, `abbr`, `time`, `code`, `pre`, `mark`.
- `strong`/`em` carry meaning; `b`/`i` are stylistic defaults.
- `time datetime` enables machine-readable dates.

| Element | Meaning |
|---------|--------|
| `<strong>` | Importance |
| `<em>` | Stress emphasis |
| `<time datetime>` | Machine-readable date |

**When to use:**

Warnings (`strong`) · emphasized phrase (`em`) · publish dates (`time`).

#### Common pitfalls

- Using headings for bold text.
- `abbr` without `title` (still OK if expanded in text).
- `code` for non-code bold styling.

**Examples:**

```html
<p><strong>Warning:</strong> <em>Do not</em> skip heading levels.</p>
<abbr title="HyperText Markup Language">HTML</abbr>
<time datetime="2025-07-02">July 2, 2025</time>
```

**Sources:** [MDN — strong](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong)

</details>

<details>
  <summary>details and summary (native disclosure)</summary>

### details and summary (native disclosure)

**Definition:**

The `<details>` and `<summary>` elements provide native expand/collapse UI without JavaScript.

| Element | Role |
|---------|------|
| `<details>` | Disclosure widget container |
| `<summary>` | Visible label / toggle |

**How it works:**

- `<details>` is a disclosure widget; open state is native.
- `<summary>` is the visible toggle (first child).
- No JS required; keyboard accessible by default.

| Element | Role |
|---------|------|
| `<details>` | Expand/collapse container |
| `<summary>` | Toggle label |

**When to use:**

FAQ accordions · optional form sections · help panels.

#### Common pitfalls

- Nesting interactive elements inside `<summary>`.
- Using for primary navigation (use `<nav>`).
- Hiding critical content collapsed by default without hint.

**Examples:**

```html
<details>
  <summary>Shipping info</summary>
  <p>Free shipping on orders over $50.</p>
```

</details>

**Sources:**

[MDN — details](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)

</details>

<details>
  <summary>Lists</summary>

### Lists

**Definition:**

HTML provides three list types for unordered, ordered, and definition-style content.

| Element | Type |
|---------|------|
| `<ul>` + `<li>` | Unordered list |
| `<ol>` + `<li>` | Ordered list |
| `<dl>` + `<dt>` + `<dd>` | Definition list |

**How it works:**

- `<ul>` unordered, `<ol>` ordered, `<dl>` definition list (`dt`/`dd`).
- Lists must contain `<li>` (or `dt`/`dd` pairs).
- CSS `list-style` controls bullets; semantics stay.

| Element | Type |
|---------|------|
| `<ul>` | Unordered |
| `<ol>` | Ordered |
| `<dl>` | Term/definition |

**When to use:**

Nav menus (`ul` + `li` + `a`) · step instructions (`ol`) · glossaries (`dl`).

#### Common pitfalls

- `<div>` bullets instead of list markup.
- Empty `<li>` for spacing.
- Using tables for non-tabular lists.

**Examples:**

```html
<ul><li>Item one</li><li>Item two</li></ul>
<ol><li>First</li><li>Second</li></ol>
<dl><dt>HTML</dt><dd>Hypertext Markup Language</dd></dl>
```

**Sources:** [MDN — Lists](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul)

</details>

---

<a name="elements-reference"></a>

## Elements reference

<details>
  <summary>Block vs inline elements</summary>

### Block vs inline elements

**Definition:**

Block-level elements stack vertically and accept full box model sizing. Inline elements flow with text and typically contain only phrasing content.

| Type | Behavior | Examples |
|------|----------|----------|
| Block | Full width, stacks | `div`, `p`, `section`, `table` |
| Inline | Flows with text | `span`, `a`, `strong`, `em` |

**How it works:**

- **Block** — starts new line, accepts width/height/margin block axis.
- **Inline** — flows in text line; width/height ignored (mostly).
- HTML5 content categories refine nesting rules.

| Type | Behavior | Examples |
|------|----------|----------|
| Block | Stacks vertically | `div`, `p`, `section` |
| Inline | Flows with text | `span`, `a`, `em` |

**When to use:**

Paragraphs (`p`) · inline emphasis (`span`, `a`) · `display` CSS can change presentation.

#### Common pitfalls

- Block elements inside `p` (auto-closes `p`).
- Interactive block-in-inline invalid nesting.
- Assuming `display` changes HTML category.

**Examples:**

```html
<div><p>Block paragraph</p></div>
<p>Inline <span>wrapper</span> inside text.</p>
```

**Sources:** [MDN — Block-level elements](https://developer.mozilla.org/en-US/docs/Glossary/Block-level_content)

</details>

<details>
  <summary>Links (anchor element)</summary>

### Links (anchor element)

**Definition:**

The `<a>` element creates hyperlinks for navigation. Use `<button>` for in-page actions, not links.

| Attribute | Purpose |
|-----------|---------|
| `href` | URL or fragment |
| `target` | `_self`, `_blank`, etc. |
| `rel` | `noopener noreferrer` with `_blank` |
| `download` | Suggest file download |

**How it works:**

- `<a href>` for navigation to URLs or fragments.
- Absolute `https://…` vs relative: no host (browser uses current origin / `<base>`); `/path` from root; `../` up one segment; `mailto:` for email. Full anatomy: [URI, URL & URN](./6_web_api.md#uri-url--urn).
- `target="_blank"` needs `rel="noopener noreferrer"`.
- `download` suggests file download for same-origin URLs.

| Attribute | Purpose |
|-----------|--------|
| `href` | Destination |
| `rel` | `noopener` for `_blank` |
| `download` | Save as file |

**When to use:**

Internal routes · external docs · skip links (`href="#main"`).

#### Common pitfalls

- `<a>` without `href` (not keyboard focusable).
- `javascript:void(0)` hrefs.
- Using `<a>` for buttons (use `<button>`).

**Examples:**

```html
<a href="/about" target="_blank" rel="noopener noreferrer">About</a>
<a href="mailto:hi@example.com">Email</a>
```

**Sources:** [MDN — a](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) · [URI, URL & URN](./6_web_api.md#uri-url--urn)

</details>

<details>
  <summary>Tables</summary>

### Tables

**Definition:**

Tables present tabular data with header and body row groups. Use `scope` on `<th>` for accessibility.

| Element | Role |
|---------|------|
| `<caption>` | Table title |
| `<thead>` / `<tbody>` | Row groups |
| `<th scope>` | Header cell |
| `<td>` | Data cell |

**How it works:**

- Tables for **tabular data** only — not layout.
- `<caption>`, `<thead>`, `<tbody>`, `<th scope>` aid structure.
- `scope="col"` / `scope="row"` for screen readers.

| Element | Role |
|---------|------|
| `<caption>` | Table title |
| `<th scope>` | Header cell |
| `<td>` | Data cell |

**When to use:**

Financial reports · comparison matrices · data grids (consider ARIA for complex).

#### Common pitfalls

- Layout tables (use CSS Grid/Flex).
- Missing headers on data tables.
- `th` without `scope` in simple tables (still better with scope).

**Examples:**

```html
<table>
  <caption>Q4 sales by region</caption>
  <thead><tr><th scope="col">Region</th><th scope="col">Revenue</th></tr></thead>
  <tbody><tr><th scope="row">EMEA</th><td>$1.2M</td></tr></tbody>
</table>
```

**Sources:** [MDN — table](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table)

</details>

<details>
  <summary>iframe and embed security</summary>

### iframe and embed security

**Definition:**

The `<iframe>` embeds another document. Restrict capabilities with `sandbox`, set `title` for accessibility, and control referrer with `referrerpolicy`.

| Attribute | Purpose |
|-----------|---------|
| `sandbox` | Restrict scripts, forms, etc. |
| `referrerpolicy` | Control Referer header |
| `title` | Required for screen readers |

**How it works:**

- `<iframe>` embeds another browsing context.
- `sandbox` attribute restricts scripts, forms, popups.
- Always set `title` for accessibility.

| Attribute | Purpose |
|-----------|--------|
| `sandbox` | Capability restrictions |
| `referrerpolicy` | Referer control |
| `title` | Accessible name |

**When to use:**

Payment widgets · video embeds · isolated third-party content.

#### Common pitfalls

- Missing `sandbox` on untrusted embeds.
- `allow-scripts allow-same-origin` together negates isolation.
- No `title` (SR users hear "frame" only).

**Examples:**

```html
<iframe
  src="https://example.com/embed"
  sandbox="allow-scripts allow-same-origin"
  referrerpolicy="no-referrer"
  title="Embedded content"
></iframe>
```

**Sources:** [MDN — iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)

</details>

<details>
  <summary>Miscellaneous elements</summary>

### Miscellaneous elements

**Definition:**

HTML includes specialized elements for suggestions, progress, output, and no-JS fallbacks.

| Element | Purpose |
|---------|---------|
| `<datalist>` | Suggestions for `<input list>` |
| `<meter>` | Scalar value in known range |
| `<progress>` | Task completion |
| `<noscript>` | Fallback when JS disabled |

**How it works:**

- `<datalist>` — suggestions for `<input list>`.
- `<meter>` — gauge in known range (not progress).
- `<progress>` — task completion.
- `<noscript>` — fallback when JS disabled.

| Element | Purpose |
|---------|--------|
| `<datalist>` | Input suggestions |
| `<progress>` | Completion indicator |
| `<noscript>` | No-JS fallback |

**When to use:**

Autocomplete suggestions · upload progress · critical content fallback.

#### Common pitfalls

- Confusing `<meter>` with `<progress>`.
- Relying on `<noscript>` for essential functionality only.
- `datalist` as sole validation (not enforced).

**Examples:**

```html
<input list="browsers" name="browser" />
<datalist id="browsers">
  <option value="Chrome"></option>
  <option value="Firefox"></option>
</datalist>
<noscript><p>Enable JavaScript for full experience.</p></noscript>
```

**Sources:** [MDN — datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist)

</details>

---

<a name="forms--validation"></a>

## Forms & validation

<details>
  <summary>Form structure</summary>

### Form structure

**Definition:**

A form wraps controls that collect user input and submit data to a server. Every submitting control needs a `name` attribute.

| Element | Role |
|---------|------|
| `<form>` | Container with `action`, `method` |
| `<fieldset>` / `<legend>` | Group related controls |
| `<label for>` | Associates label with control |
| `<button type="submit">` | Submits form |

**How it works:**

- `<form action method enctype>` defines submission target.
- Controls need `name` to appear in submitted data.
- `<fieldset>`/`<legend>` group related fields.
- `<label for>` associates text with control id.

| Element | Role |
|---------|------|
| `<form>` | Submission container |
| `<label for>` | Accessible name |
| `<button type="submit">` | Submit |

**When to use:**

Login · multi-step wizard · search (`method="get"`).

#### Common pitfalls

- Inputs without `name` (not submitted).
- Placeholder-only labels.
- Nested forms (invalid).

**Examples:**

```html
<form action="/api/login" method="post" novalidate>
  <fieldset>
    <legend>Account</legend>
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required autocomplete="email" />
    <label for="password">Password</label>
    <input id="password" name="password" type="password" required minlength="8" />
    <button type="submit">Sign in</button>
  </fieldset>
</form>
```

**Thoughts:** FormData and JS submission → [3_js_browser.md](./3_js_browser.md).

**Sources:** [MDN — Forms](https://developer.mozilla.org/en-US/docs/Learn/Forms)

</details>

<details>
  <summary>Input types</summary>

### Input types

**Definition:** The `type` attribute on `<input>` selects the control behavior, validation rules, and mobile keyboard.

**How it works:**

- `type` selects control UI, validation rules, and mobile keyboard.
- Browser provides built-in validation for `email`, `url`, `number`, etc.
- `required`, `pattern`, `min`/`max` add constraints.

| `type` | Use |
|--------|-----|
| `text`, `email`, `password` | Text variants |
| `number`, `range` | Numeric input |
| `checkbox`, `radio` | Boolean / single choice |
| `date`, `file` | Date picker / file upload |

**When to use:**

Email signup · quantity stepper · file upload with `accept`.

#### Common pitfalls

- `type="number"` for credit cards (use `text` + `inputmode`).
- Missing `name` on inputs.
- `placeholder` as only label.

**Pluses and minuses:**

| + | − |
|------|------|
| Native validation and mobile keyboards | Limited styling vs custom widgets |
| Accessible by default | `type="number"` quirks for some formats |

**Examples:**

```html
<input type="email" name="email" required />
<input type="number" name="qty" min="1" max="99" />
<input type="file" name="avatar" accept="image/png,image/jpeg" />
```

**Sources:** [MDN — input types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)

</details>

<details>
  <summary>select, textarea, and button types</summary>

### select, textarea, and button types

**Definition:** Beyond `<input>`, forms use `<select>` for option lists, `<textarea>` for multi-line text, and `<button>` with explicit `type` for actions.

**How it works:**

- `<select name>` submits selected `<option value>`; `multiple` allows multi-select (submits as array in JS FormData).
- `<textarea name>` value is **text content** between tags, not a `value` attribute.
- `<button type="submit">` (default inside form), `type="reset"`, or `type="button"` for non-submit actions.

| Control | Key attrs |
|---------|----------|
| `<select>` | `name`, `multiple`, `required` |
| `<textarea>` | `name`, `rows`, `maxlength` |
| `<button>` | `type`, `formaction` |

**When to use:**

Country picker · comment field · cancel button (`type="button"`) alongside submit.

#### Common pitfalls

- `<button>` without `type` accidentally submits parent form.
- Putting textarea content in `value` attribute (ignored).
- Empty placeholder option without accessible label on required `<select>`.

**Pluses and minuses:**

| + | − |
|------|------|
| Native keyboard/accessibility | Limited styling vs custom dropdowns |
| No JS required for basic submit | `<button>` defaults to submit in forms |

**Examples:**

```html
<label for="country">Country</label>
<select id="country" name="country" required>
  <option value="">Choose…</option>
  <option value="de">Germany</option>
</select>

<label for="bio">Bio</label>
<textarea id="bio" name="bio" rows="4" maxlength="500"></textarea>

<button type="submit">Save</button>
<button type="button">Cancel</button>
```

**Sources:** [MDN — select](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) · [textarea](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) · [button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)

</details>

<details>
  <summary>Constraint Validation API</summary>

### Constraint Validation API

**Definition:**

HTML5 provides built-in client-side validation via attributes and the Constraint Validation API in JavaScript.

| Attribute / API | Behavior |
|-----------------|----------|
| `required` | Must have a value |
| `pattern` | Regex match |
| `checkValidity()` | Returns boolean |
| `setCustomValidity()` | Custom error message |

**How it works:**

- HTML attributes (`required`, `pattern`, `min`, `max`) set constraints.
- JS: `checkValidity()`, `reportValidity()`, `setCustomValidity(msg)`.
- `:valid`/`:invalid` pseudo-classes reflect state.

| API / attr | Behavior |
|------------|----------|
| `required` | Non-empty |
| `setCustomValidity` | Custom message |
| `reportValidity` | Show native UI |

**When to use:**

Client-side format checks · custom async username check · `novalidate` + JS-only validation.

#### Common pitfalls

- Client validation only (must re-validate server-side).
- `setCustomValidity('')` to clear — empty string means valid.
- `novalidate` forgotten when relying on custom UI.

**Examples:**

```html
<input type="text" name="code" pattern="[A-Z]{2}-\d{4}" title="Format: AB-1234" required />
```

**Thoughts:** Async validation with JS → [3_js_browser.md](./3_js_browser.md).

**Sources:** [MDN — Constraint validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation)

</details>

<details>
  <summary>Form submission attributes</summary>

### Form submission attributes

**Definition:**

Submit buttons can override form defaults with `formaction`, `formmethod`, `formenctype`, and `formnovalidate`.

| Attribute | Overrides |
|-----------|-----------|
| `formaction` | `action` URL |
| `formmethod` | `method` (get/post) |
| `formenctype` | `enctype` |
| `formnovalidate` | Skip validation for this submit |

**How it works:**

- Submit buttons can override form defaults per-button.
- `formaction`/`formmethod`/`formenctype`/`formnovalidate` on submit buttons.
- `form` attribute associates control with distant `<form id>`.

| Attribute | Overrides |
|-----------|----------|
| `formaction` | `action` URL |
| `formnovalidate` | Skip validation |

**When to use:**

Save draft vs publish · delete with `formmethod="post"` · button outside form via `form="id"`.

#### Common pitfalls

- Multiple submit buttons without distinct `formaction`.
- `GET` forms leaking sensitive data in URL.
- Missing `enctype="multipart/form-data"` for file uploads.

**Examples:**

```html
<form action="/publish" method="post">
  <button type="submit">Publish</button>
  <button type="submit" formaction="/save-draft" formnovalidate>Save draft</button>
</form>
```

**Sources:** [MDN — button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)

</details>

<details>
  <summary>dialog element (native modal)</summary>

### dialog element (native modal)

**Definition:**

The `<dialog>` element provides a native modal with backdrop, focus trap, and top-layer rendering — no z-index fights.

| Method | Behavior |
|--------|----------|
| `showModal()` | Modal with backdrop |
| `show()` | Non-modal |
| `close(returnValue)` | Closes dialog |

**How it works:**

- `<dialog>` renders in top layer when `showModal()` called.
- Backdrop click and Escape close (configurable).
- Focus trap and inert background handled by browser.

| Method | Behavior |
|--------|----------|
| `showModal()` | Modal + backdrop |
| `close()` | Returns `returnValue` |

**When to use:**

Confirm delete · login modal · non-modal `show()` panels.

#### Common pitfalls

- Opening without focus management for custom content.
- Stacking multiple modals without UX plan.
- Replacing with `<div role="dialog">` when native works.

**Examples:**

```html
<dialog id="confirm">
  <p>Delete this item?</p>
  <button type="button" onclick="confirm.close()">Cancel</button>
  <button type="button" onclick="confirm.close('ok')">Delete</button>
</dialog>
<button type="button" onclick="confirm.showModal()">Open</button>
```

**Sources:** [MDN — dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)

</details>

<details>
  <summary>Accessible form patterns</summary>

### Accessible form patterns

**Definition:**

Accessible forms associate every control with a label, group related fields, and announce errors clearly.

| Pattern | Implementation |
|---------|----------------|
| Label association | `<label for="id">` |
| Grouping | `<fieldset>` + `<legend>` |
| Error announcement | `aria-invalid` + `aria-describedby` |
| Mobile keyboard | `inputmode`, `enterkeyhint` |

**How it works:**

- Every control has visible `<label for>` or wrapping label.
- Errors: `aria-invalid="true"` + `aria-describedby` pointing to error text.
- Group radios/checkboxes in `<fieldset>` with `<legend>`.

| Pattern | Implementation |
|---------|----------------|
| Label | `<label for="id">` |
| Errors | `aria-describedby` + `role="alert"` |

**When to use:**

Registration form · inline validation · multi-field address group.

#### Common pitfalls

- `aria-label` hiding visible label redundancy incorrectly.
- Error only by color (no text).
- `autocomplete` off on login fields (hurts password managers).

**Examples:**

```html
<label for="phone">Phone</label>
<input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" aria-describedby="phone-hint" />
<span id="phone-hint">Include country code.</span>
```

**Sources:** [MDN — Accessible forms](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)

</details>

<details>
  <summary>autocomplete attribute reference</summary>

### autocomplete attribute reference

**Definition:** The `autocomplete` attribute provides tokens that tell the browser how to autofill form fields — improving UX and password manager compatibility.

**How it works:**

- Set on `<input>`, `<select>`, `<textarea>` (and `name` on form for section tokens).
- Values are standardized tokens (`email`, `name`, `street-address`, `cc-number`, etc.).
- `autocomplete="off"` on one field may be ignored by browsers for login fields.

| Token | Field |
|-------|-------|
| `email` | Email address |
| `username` / `current-password` | Login |
| `street-address` | Address line |
| `cc-number` | Payment card |

**When to use:**

Login forms · checkout/shipping · one-time codes (`autocomplete="one-time-code"`).

#### Common pitfalls

- `autocomplete="email"` on a name field.
- Disabling autocomplete on login (frustrates users).
- Custom `name` attributes without matching autocomplete tokens.

**Pluses and minuses:**

| + | − |
|------|------|
| Faster form completion | Wrong token mis-fills fields |
| Password manager integration | `off` often ignored for passwords |

**Examples:**

```html
<input name="email" type="email" autocomplete="email" />
<input name="password" type="password" autocomplete="current-password" />
<input name="otp" autocomplete="one-time-code" />
```

**Sources:** [MDN — autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)

</details>

---

<a name="media--graphics"></a>

## Media & graphics

<details>
  <summary>img element and responsive images</summary>

### img element and responsive images

**Definition:**

The `<img>` element embeds images. Use `alt`, explicit dimensions, `srcset`/`sizes`, and `loading` for performance and accessibility.

| Attribute | Purpose |
|-----------|---------|
| `alt` | Alternative text (required for meaningful images) |
| `width` / `height` | Reserve space → prevent CLS |
| `srcset` + `sizes` | Responsive selection |
| `loading="lazy"` | Defer off-screen images |

**How it works:**

- `src` fallback; `srcset` + `sizes` pick resolution by viewport.
- `alt` required for meaningful images; decorative → `alt=""`.
- `width`/`height` reserve space to prevent CLS.

| Attribute | Purpose |
|-----------|--------|
| `alt` | Text alternative |
| `srcset`/`sizes` | Responsive selection |
| `loading="lazy"` | Defer off-screen |

**When to use:**

Hero LCP image · lazy below-fold · retina `srcset`.

#### Common pitfalls

- Missing `alt` on content images.
- `loading="lazy"` on LCP hero.
- No dimensions → layout shift on load.

**Examples:**

```html
<img
  src="hero-800.jpg"
  srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="Team collaborating in an office"
  width="800"
  height="450"
  loading="lazy"
  fetchpriority="high"
/>
```

**Sources:** [MDN — Responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

</details>

<details>
  <summary>picture element</summary>

### picture element

**Definition:**

The `<picture>` element provides art direction and modern format fallbacks (AVIF → WebP → JPEG).

| Use case | Approach |
|----------|----------|
| Format fallback | Multiple `<source type>` |
| Art direction | Different crops per breakpoint |

**How it works:**

- `<picture>` wraps multiple `<source>` + fallback `<img>`.
- `type` on source for format negotiation (AVIF/WebP).
- `media` on source for art direction breakpoints.

| Use | Approach |
|-----|----------|
| Format fallback | `<source type="image/avif">` |
| Art direction | `<source media="(max-width: 600px)">` |

**When to use:**

AVIF with JPEG fallback · mobile crop vs desktop crop.

#### Common pitfalls

- Forgetting required `<img>` fallback.
- Same `srcset` on all sources (no benefit).
- `picture` for simple resize (use `img srcset` only).

**Examples:**

```html
<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Hero banner" />
</picture>
```

**Sources:** [MDN — picture](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)

</details>

<details>
  <summary>video and audio</summary>

### video and audio

**Definition:**

The `<video>` and `<audio>` elements embed media with native controls. Provide multiple formats and captions for accessibility.

| Attribute | Notes |
|-----------|-------|
| `controls` | Native playback UI |
| `preload` | `none`, `metadata`, `auto` |
| `poster` | Thumbnail before play |
| `<track>` | Captions/subtitles |

**How it works:**

- `<video>`/`<audio>` embed media with native controls.
- Multiple `<source>` for codec fallback.
- `<track kind="captions">` for accessibility.

| Attribute | Notes |
|-----------|-------|
| `controls` | Native UI |
| `poster` | Video thumbnail |
| `<track>` | Captions/subtitles |

**When to use:**

Product demo video · podcast player · background video (prefer CSS, muted, `playsinline`).

#### Common pitfalls

- Autoplay with sound (blocked by browsers).
- No captions on speech content.
- Single format without fallback source.

**Examples:**

```html
<video controls preload="metadata" poster="thumb.jpg">
  <source src="clip.webm" type="video/webm" />
  <source src="clip.mp4" type="video/mp4" />
  <track kind="captions" src="en.vtt" srclang="en" label="English" default />
</video>
```

**Sources:** [MDN — video](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)

</details>

<details>
  <summary>canvas vs SVG</summary>

### canvas vs SVG

**Definition:**

`<canvas>` is a bitmap surface drawn via JavaScript. `<svg>` is vector markup in the DOM — scalable and accessible.

| | `<canvas>` | `<svg>` |
|---|-----------|---------|
| Model | Bitmap (pixels) | Vector (DOM nodes) |
| Scaling | Loses quality | Resolution-independent |
| Accessibility | Needs ARIA fallback | Native DOM |
| Best for | Games, heavy pixel animation | Icons, diagrams |

**How it works:**

- `<canvas>` — bitmap surface drawn via JS API (`getContext('2d')`).
- `<svg>` — vector DOM; scales cleanly; style with CSS.
- Canvas for pixels/games; SVG for icons/diagrams.

| | `<canvas>` | `<svg>` |
|---|-----------|--------|
| Model | Bitmap | Vector DOM |
| A11y | Needs fallback text | DOM accessible |

**When to use:**

Chart.js on canvas · inline icon SVG · game sprites on canvas.

#### Common pitfalls

- Icon fonts instead of SVG (a11y, scaling).
- Canvas charts without text alternative.
- Huge SVGs not optimized (SVGO).

**Examples:**

```html
<canvas id="chart" width="400" height="200"></canvas>
<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 20v-6h4v6z"/></svg>
```

**Thoughts:** Canvas drawing API → [3_js_browser.md](./3_js_browser.md). Standalone `.svg` files are XML: set `xmlns="http://www.w3.org/2000/svg"` on the outer `<svg>` or the browser will not treat the file as SVG. Inline SVG in HTML does not need `xmlns`. Namespaces: [6_web_api.md — XML](./6_web_api.md#xml).

**Sources:** [MDN — canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)

</details>

---

<a name="performance--resource-loading"></a>

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
- **INP** — time to next paint after click/tap/key (not only input delay). Full notes: [6_web_api.md — INP](./6_web_api.md#inp-interaction-to-next-paint).
- **CLS** — unexpected layout shift (max session window, not a lifetime sum). Full notes: [CLS](#cls-cumulative-layout-shift).
- **TTFB** — time to first byte; diagnostic for server/CDN, **not** a current Core Web Vital. Full notes: [6_web_api.md — TTFB](./6_web_api.md#ttfb-time-to-first-byte).
- **FCP** — first content paint (text/image/SVG/canvas); supporting vital, not ranking. Full notes: [6_web_api.md](./6_web_api.md#first-contentful-paint-fcp).
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

**See also:** Measure / lab vs field / RUM → [6_web_api.md — Core Web Vitals](./6_web_api.md#core-web-vitals). LCP sub-parts → [6_web_api.md — LCP](./6_web_api.md#lcp-largest-contentful-paint). INP → [6_web_api.md](./6_web_api.md#inp-interaction-to-next-paint). TTFB → [6_web_api.md](./6_web_api.md#ttfb-time-to-first-byte). FCP → [6_web_api.md](./6_web_api.md#first-contentful-paint-fcp). Next.js levers → [4_nextjs.md](./4_nextjs.md#core-web-vitals-on-vercel).

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
- Lab (Lighthouse) ≠ field (CrUX). Debug: DevTools **Performance → Layout Shifts**. Measurement / RUM: [6_web_api.md — Core Web Vitals](./6_web_api.md#core-web-vitals).

- Images/video without `width`/`height` (or CSS `aspect-ratio`) — laid out as empty, then neighbors jump when the file arrives.
- Ads, widgets, iframes with unknown height, especially async.
- Inserts **above** already-visible content: cookie banners, recommendation rails, error toasts at render. Same-size insert near the **top** of the viewport scores worse than one near the bottom.
- Web fonts: fallback metrics ≠ custom metrics → reflow. **FOIT** (text hidden until the font loads) vs **FOUT** (fallback text, then swap). CSS: [Font loading](./2_css.md#font-loading).
- Animating `top` / `left` / `margin` / `width` instead of `transform` — layout recalc can move siblings. CSS: [transform](./2_css.md#transform).

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

`srcset` / `<picture>`: keep the **same aspect ratio** across candidates; set `width`/`height` on `<img>` (and on `<source>` in modern browsers). Next.js `<Image>` requires `width`+`height` or `fill`; static import fills dimensions. Framework notes: [4_nextjs.md](./4_nextjs.md#core-web-vitals-on-vercel).

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

## Accessibility

Theory: [overview](#what-is-accessibility-a11y) · [tree](#accessibility-tree) · [name/description](#accessible-name-and-description) · [HTML basics](#accessible-html-basics) · [`lang`](#language-of-the-page-and-fragments) · [forms](#accessible-forms) · [hiding](#hiding-content-from-at-vs-visually) · [images](#image-text-alternatives) · [ARIA](#aria--when-and-how) · [screen readers](#screen-readers)

<details>
  <summary>Web accessibility overview</summary>

### Web accessibility overview

**Definition:**

Web accessibility (a11y) means people with disabilities can perceive, understand, navigate, and interact with the web. Foundation: WCAG (POUR).

| Principle | Meaning |
|-----------|---------|
| Perceivable | Content available to senses |
| Operable | Keyboard and input accessible |
| Understandable | Clear language and behavior |
| Robust | Works with assistive tech |

**How it works:**

- WCAG organized as POUR: Perceivable, Operable, Understandable, Robust.
- HTML is the first layer — semantics, labels, alt text.
- Test with keyboard + screen reader + automated tools.

| Principle | Meaning |
|-----------|--------|
| Perceivable | Alt text, contrast |
| Operable | Keyboard access |

**When to use:**

Public sites (legal requirements) · internal tools · component libraries.

#### Common pitfalls

- ARIA-only fixes without native HTML.
- Color-only error states.
- Removing focus outlines without replacement.

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
  <summary>Semantic HTML first</summary>

### Semantic HTML first

**Definition:**

Prefer native HTML elements over ARIA when possible. The first rule of ARIA: don't use ARIA if a native element exists.

| Need | Use | Avoid |
|------|-----|-------|
| Button action | `<button>` | `<div onclick>` |
| Navigation | `<nav>` + `<a href>` | `<div>` with click handlers |
| Modal | `<dialog>` | `<div role="dialog">` |

**How it works:**

- First rule of ARIA: don't use ARIA if native element exists.
- `<button>`, `<nav>`, `<dialog>`, `<details>` before `role=` equivalents.
- Add ARIA only for gaps native HTML cannot fill.

| Need | Use | Avoid |
|------|-----|-------|
| Action | `<button>` | `<div onclick>` |
| Nav | `<nav>` + `<a>` | div soup |

**When to use:**

Custom tabs (ARIA) vs native `<details>` · modal (`<dialog>`).

#### Common pitfalls

- `role="button"` on divs.
- Redundant `role="navigation"` on `<nav>`.
- ARIA overriding native semantics incorrectly.

**Examples:**

```html
<nav aria-label="Main"><a href="/">Home</a></nav>
<button type="button">Open settings</button>
<details><summary>More info</summary><p>Details here.</p>
```

</details>

**Sources:**

[MDN — ARIA — don't overuse](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides)

</details>

<details>
  <summary>Key accessibility checklist</summary>

### Key accessibility checklist

**Definition:**

A practical checklist for HTML accessibility covering semantics, contrast, labels, headings, and keyboard support.

| Check | Implementation |
|-------|----------------|
| Semantic elements | `button` vs `a`, landmarks |
| Image alt text | Meaningful `alt`; `alt=""` for decorative |
| Form labels | `<label for>` on every control |
| Heading hierarchy | Logical `h1`–`h6` outline |
| Keyboard | All interactive elements focusable |

**How it works:**

- Landmarks, headings, labels, alt text, keyboard, focus, contrast.
- Forms: label every control; announce errors.
- Dynamic updates: `aria-live` regions.

| Check | Implementation |
|-------|----------------|
| Labels | `<label for>` |
| Images | Meaningful `alt` |

**When to use:**

Pre-release audit · PR review checklist · VPAT documentation.

#### Common pitfalls

- Automated tools only (miss ~30–50% of issues).
- Skip links missing on content-heavy pages.
- Icon buttons without accessible name.

**Examples:**

```html
<label for="search">Search</label>
<input id="search" type="search" name="q" />
<img src="decorative.svg" alt="" />
```

**Sources:** [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)

</details>

<details>
  <summary>ARIA — when and how</summary>

### ARIA — when and how

**Definition:**

ARIA (Accessible Rich Internet Applications) adds semantics when HTML alone is insufficient — tabs, live regions, expanded states.

| Pattern | ARIA |
|---------|------|
| Live updates | `aria-live="polite"` |
| Expanded state | `aria-expanded="true/false"` |
| Described by | `aria-describedby="error-id"` |
| Hidden decorative | `aria-hidden="true"` |

**How it works:**

- ARIA adds roles, states, properties when HTML insufficient.
- `aria-expanded`, `aria-selected`, `aria-live` for dynamic UI.
- Never change native role (no `role="button"` on `<a href>`).

| Pattern | ARIA |
|---------|------|
| Live updates | `aria-live="polite"` |
| Described errors | `aria-describedby` |

**When to use:**

Tab panels · live search results · custom sliders.

#### Common pitfalls

- `aria-label` duplicating visible text incorrectly.
- Missing `aria-controls` on tabs.
- `aria-hidden="true"` on focusable elements.

**Examples:**

```html
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel-1">Tab 1</button>
</div>
<div id="panel-1" role="tabpanel">Panel content</div>
<div aria-live="polite" id="status"></div>
```

**Sources:** [MDN — ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)

</details>

<details>
  <summary>Screen readers</summary>

### Screen readers

**Definition:**

A screen reader converts on-screen content to speech or braille. Test with VoiceOver, NVDA, JAWS, or TalkBack.

| Test area | What to verify |
|-----------|----------------|
| Headings | Logical outline navigation |
| Landmarks | `main`, `nav`, `header` |
| Forms | Labels and error messages |
| Images | Meaningful alt text |

**How it works:**

- Convert UI to speech/braille (VoiceOver, NVDA, JAWS).
- Navigate by headings, landmarks, links, forms mode.
- Test real flows, not just page load.

| Test | Verify |
|------|--------|
| Headings | Logical outline |
| Forms | Labels announced |

**When to use:**

Form submission flow · modal open/close · dynamic list updates.

#### Common pitfalls

- `display:none` content still in DOM but not always read (varies).
- Unlabeled icon buttons.
- Reading order ≠ visual order (CSS reorder).

**Examples:**

```html
<main>
  <h1>Article title</h1>
  <p>Content read aloud by assistive technology.</p>
</main>
```

**Sources:** [MDN — Screen readers](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/screen_reader_support)

</details>

<details>
  <summary>What is accessibility (a11y)</summary>

### What is accessibility (a11y)

**Definition:** Accessibility is designing environments, products, and services so people with disabilities can use them. **Web accessibility** is that idea applied to sites, apps, and related tools. The numeronym **a11y** is *accessibility* (*a* + 11 letters + *y*).

**How it works:**

- **Social model:** disability appears when people meet **barriers** (physical, digital, informational) — not only a medical diagnosis.
- **Curb-cut effect:** ramps, captions, and autocomplete help people with disabilities first, then everyone (broken arm, noisy café, slow network). A useful side effect, not the main goal.
- Related but not identical: **universal design** (one solution for as many people as possible), **inclusive design** (diversity beyond disability), **usability** (efficiency/satisfaction — often tested without disabled users).
- **Digital accessibility** is broader (native apps, PDFs, OS). Web a11y is the web slice.
- W3C: the web is for everyone, regardless of device, language, location, or ability.
- Layers: user agents (browsers), assistive tech (screen readers, magnifiers), content (HTML/CSS/JS), authoring tools, people.
- **POUR** (WCAG): Perceivable, Operable, Understandable, Robust.
- Users: motor, neurological, cognitive, visual, auditory, speech — often combined; also temporary/situational limits.
- Specs: HTML/CSS plus **WAI-ARIA**, **WCAG**, **ATAG**, **UAAG**. Prefer native HTML; ARIA fills gaps (tabs, live regions).
- Why teams invest: law, ethics, reach, SEO, reputation, innovation.
- Overlays that “fix” a11y on top of broken HTML usually fail and can add barriers. WCAG conformance is not a substitute for testing with people.

**When to use:**

Public sites, checkout, design systems. Not: treating a11y as a last-sprint overlay.

#### Common pitfalls

Equating a11y with “screen readers only”; separate “blind versions” of a site (old GOST idea — WCAG 2.1+ prefers one flexible site); postponing a11y to QA.

**Pluses and minuses:**

| + | − |
|------|------|
| Legal and ethical baseline; helps more users than “disabled only” | Needs time, training, and ongoing checks as the product changes |
| Semantic HTML covers most cases | Hard to measure AT users via analytics (OS Accessibility APIs) |

**Thoughts:** *Barriers are in the product; POUR + native HTML is the default, ARIA is the exception.*

**Sources:** [Doka — What is accessibility](https://doka.guide/a11y/a11y-overview/) · [W3C WAI](https://www.w3.org/WAI/) · [MDN — Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

</details>

<details>
  <summary>Accessibility tree</summary>

### Accessibility tree

**Definition:** The **accessibility tree** is a browser-built tree of **accessible objects** derived from the DOM (plus CSS and ARIA). Assistive tech does not read the DOM directly — it uses the OS **Accessibility API**, which is fed from this tree.

**How it works:**

- Built alongside the DOM and **updated when the DOM/styles change** (not a one-shot after first paint).
- Each object may have **role**, **name**, **description**, **states/properties**.
- Semantic HTML maps to implicit roles (`<a href>` → `link`, `<button>` → `button`, `<div>`/`<span>` → `generic`).
- Usually **omitted** from the tree: `display: none`, HTML `hidden`, `aria-hidden="true"`, and many empty generic wrappers. `visibility: hidden` is also treated as not shown to AT. Do **not** add redundant `aria-hidden` on already-unrendered nodes.
- **In the tree but visually hidden:** `.sr-only` / clip techniques (see hiding content).
- `::before` / `::after` `content` can contribute to names in some engines.
- Trees **differ by browser** (role names, name computation). DevTools show a **preview**, not what NVDA/VoiceOver actually speak — and they lag on live updates.
- **AOM** (Accessibility Object Model) is experimental; there is no stable JS API to read/write the tree in production.

**When to use:**

Debugging “why isn’t this announced?”; custom widgets; interviews.

#### Common pitfalls

Trusting DevTools only; `role="link"` on a `<span>` without keyboard/activation; assuming decorative `<div>`s always appear.

**Pluses and minuses:**

| + | − |
|------|------|
| Explains AT output | DevTools ≠ real SR; engine differences |

**Examples:**

```html
<main>
  <h1>Products</h1>
  <label for="addr">Address</label>
  <input id="addr" type="text" aria-describedby="hint" />
  <span id="hint">Street and house number</span>
  <button type="submit">Buy</button>
</main>
```

Chrome Accessibility pane (typical): `main`; `heading` level 1 named “Products”; `textbox` named “Address”, described by the hint; `button` “Buy”, focusable.

**Thoughts:** *AT sees a pruned semantic tree, not your CSS layout.*

**Sources:** [MDN — Accessibility tree](https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree) · [Doka — Accessibility tree](https://doka.guide/a11y/a11y-tree/) · [Chrome a11y DevTools](https://developer.chrome.com/docs/devtools/accessibility/reference)

</details>

<details>
  <summary>Accessible name and description</summary>

### Accessible name and description

**Definition:** The **accessible name** is the short label AT uses for an object (what it is / does). The **accessible description** is optional extra help, usually announced after name, role, and state.

**How it works:**

- Names are **required** for many interactive roles (see WAI-ARIA “name required”). Not required for `<p>` or `<time>`.
- **Visible names** come from content (`<a>`, `<button>`, headings). **Invisible** names include `alt` and `aria-label`.
- Native name sources: element contents; `<label>`; `<legend>` / `<caption>` / `<figcaption>`; `alt` on `<img>` / `<area>` / `<input type="image">`; submit/reset `value`.
- ARIA: `aria-labelledby` (highest name precedence — **overrides** visible text and `<label>`), then `aria-label`. Description: `aria-describedby` (can list several ids), then `aria-description` (ARIA 1.3 — **prefer `aria-describedby`**).
- Fallback names: `title` and `placeholder` — unreliable; never the only name.
- AccName algorithm (high → low): `aria-labelledby` → `aria-label` → native (`label` / `alt` / `value` / caption / figcaption / contents) → `title` / `placeholder`.
- Description algorithm: `aria-describedby` → `aria-description` → native caption-like text → `title`.
- Naming rules: short; visible when possible; don’t repeat the role (“Submit button”); put the verb/destination first; keep names stable across pages; update names when UI changes; translate names and ARIA strings.

**When to use:**

Icon buttons, inputs, tables, figures, custom widgets.

#### Common pitfalls

`placeholder` as the label; `aria-label` that disagrees with visible text (WCAG 2.5.3 Label in Name); empty `<button>`; claiming a table without `<caption>` is “decorative” — it is still a `table`; it just lacks a strong accessible name.

**Pluses and minuses:**

| + | − |
|------|------|
| Native HTML names stay translatable and visible | `aria-labelledby` silently replaces visible text |

**Examples:**

```html
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email" aria-describedby="email-hint" />
<span id="email-hint">Use your work address.</span>

<button aria-label="Close">×</button>
```

**Thoughts:** *Name = purpose; description = extra; ARIA name wins over HTML.*

**Sources:** [AccName](https://www.w3.org/TR/accname-1.2/) · [MDN — aria-labelledby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby) · [Doka — Accessible name](https://doka.guide/a11y/accessible-name-and-description/)

</details>

<details>
  <summary>Accessible HTML basics</summary>

### Accessible HTML basics

**Definition:** Most a11y comes from **correct semantics and content**, not from ARIA. Native controls already expose role, keyboard behavior, and form participation.

**How it works:**

- `<button>` is focusable, activatable with Enter/Space, and has role `button`. A `<div>` needs `tabindex`, role, key handlers, and focus styles — easy to get wrong.
- Screen readers jump by headings, landmarks, lists, tables, forms — those need real tags, not styled `<div>`s.
- First rule of ARIA: **don’t use ARIA** if a native element exists. Wrong `role` **replaces** native semantics (`<a role="menuitem">` is no longer a link).
- Not every native control is equally supported (`<details>`/`<summary>` still buggy in some SR + browser pairs; nested content inside `<label>` can be skipped in Safari VoiceOver). Always test.
- `div`/`span` have role `generic` (usually not announced). `role` on `<ul>` can drop list semantics.
- Link text must make sense **out of context** (no “click here”). Expand abbreviations in text; `<abbr title>` is not keyboard/touch friendly.
- Document setup: `<html lang>`, unique `<title>`, allow zoom (`user-scalable` must not be `no`/`0`; avoid `maximum-scale` &lt; 2 — WCAG 1.4.4 resize to 200%).
- One `<h1>` and no skipped levels is a strong authoring practice (MDN); don’t pick heading level for visual size.
- Debug: Chrome/Firefox accessibility inspector, axe, Lighthouse, [W3C HTML checker](https://validator.w3.org/). Keyboard must be manual.

**When to use:**

Every page. Custom tabs/dialogs only when HTML has no equivalent — follow [ARIA APG](https://www.w3.org/WAI/ARIA/apg/).

#### Common pitfalls

`placeholder` instead of `<label>` (majority of sites historically); icon-only controls without a name; heading soup.

**Thoughts:** *Semantics + honest text first; ARIA last; tools don’t replace keyboard + SR.*

**Sources:**

[Doka — Accessible HTML](https://doka.guide/a11y/html/) · [ARIA APG](https://www.w3.org/WAI/ARIA/apg/) · [MDN — HTML: A good basis for accessibility](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML)

</details>

<details>
  <summary>Language of the page and fragments</summary>

### Language of the page and fragments

**Definition:** `lang` tells user agents and screen readers which **BCP 47** language to use for speech, fonts, hyphenation, quotes, and translation. WCAG 3.1.1 requires the page language; 3.1.2 covers parts in another language.

**How it works:**

- Set the document language on `<html lang="ru">` (or `en`, `en-GB`, …). Prefer **short** tags; add region only when it matters (spelling, TTS).
- Mark foreign phrases: `<span lang="sv">Lagom</span>`. CSS: `:lang(sv)`.
- If `lang` is missing, SRs often use the **OS / user** voice — unintelligible for another language.
- `lang="zxx"` = no linguistic content (code, Lorem ipsum).
- RTL scripts: `dir="rtl"` (`ltr` is default; `auto` lets the browser guess).
- Multilingual sites: translate visible text **and** `title`, `alt`, `placeholder`, `label`, `aria-label`, `aria-placeholder`, `aria-roledescription`, `aria-valuetext`, and CSS `content` strings.
- Alternate language URLs: `<link rel="alternate" hreflang="fr">` (SEO) and/or `<a rel="alternate" hreflang="fr">` so AT knows the target language.

**When to use:**

Mixed-language articles, i18n apps, Hebrew/Arabic UI. Full i18n/SEO: [Internationalization](#internationalization-i18n).

#### Common pitfalls

Styling language with CSS classes only; leaving `aria-label` untranslated; `hreflang` without matching `lang` on the target page.

**Examples:**

```html
<html lang="en">
<p>The Swedish word <span lang="sv">lagom</span> means “just enough.”</p>
<p lang="he" dir="rtl">לחיים</p>
```

**Thoughts:** *Wrong `lang` = wrong voice; mark the page and every foreign snippet.*

**Sources:** [MDN — lang](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) · [Doka — Page language](https://doka.guide/a11y/language/) · [Language subtag lookup](https://r12a.github.io/app-subtags/)

</details>

<details>
  <summary>Accessible forms</summary>

### Accessible forms

**Definition:** Accessible forms use native controls, a visible `<label>` per field, predictable focus, format hints, and errors that are not color-only.

**How it works:**

- **Label:** `<label for="id">` (explicit) is more reliable than wrapping the control (implicit). Clicking the label focuses the control. Don’t use `title`/`placeholder` as the only name.
- Native `<input>`/`<select>`/`<textarea>`: keyboard, `name` in submit, `inputmode`/`type` for mobile keyboards. A `contenteditable` `<div>` is not a form control.
- Focus: visible `:focus-visible`; DOM order = tab order (avoid CSS `order`). Don’t auto-advance focus between fields. Split long forms into steps.
- Hints: visible text + `aria-describedby`. Instructions before the form; don’t validate on first keystroke — prefer submit (or blur) then errors.
- Errors: nearby text; `aria-invalid="true"`; link errors with `aria-describedby` (`aria-errormessage` support is weak). Announce with `role="alert"` or `aria-live="assertive"`; move focus to the first invalid field. Success message after submit.
- Types: `email` + `autocomplete="email"`; `password` + `current-password` / `new-password`; radios/checkboxes in `<fieldset>` + `<legend>` (skip fieldset for a single checkbox). Don’t nest fieldsets. Don’t rely on `<optgroup>` as the only grouping cue.
- Buttons: `<button type="submit">` with text (or `value` on `<input type="submit">`). Avoid `type="reset"`. A submit control inside `<form>` enables Enter-to-submit.
- Useful attrs: `required`, `disabled`, `readonly`, `maxlength`, `pattern`, `autocomplete` tokens. Don’t set `autocomplete="off"` without a strong reason.
- One visible `<label>` per control; extra names via `aria-labelledby` / `aria-label` (they **override** `<label>`). `aria-describedby` **adds** hint text — keep the label.
- Search boxes: visually hidden label (`.visually-hidden`) **or** `aria-label` — not both plus `title`.

**When to use:**

Login, checkout, filters. Not: reinventing checkbox with `<div>`.

#### Common pitfalls

`<div for>` (invalid); color-only required markers; sound-only errors; tiny hit targets; clearing field data immediately (except sensitive financial flows).

**Examples:**

```html
<form>
  <label for="email">Email</label>
  <input id="email" name="email" type="email" autocomplete="email" required
    aria-describedby="email-hint email-err" aria-invalid="true" />
  <p id="email-hint">Work address.</p>
  <p id="email-err" role="alert">Enter a valid email.</p>
  <button type="submit">Save</button>
</form>
```

**Thoughts:** *Native control + visible label + described errors; ARIA only to wire hints.*

**Sources:** [MDN — How to structure a web form](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/How_to_structure_a_web_form) · [Doka — Accessible forms](https://doka.guide/a11y/forms/) · [MDN — aria-invalid](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid)

</details>

<details>
  <summary>Hiding content from AT vs visually</summary>

### Hiding content from AT vs visually

**Definition:** “Hide” means three different things: hide from **everyone**, hide from **AT only**, or hide **visually** but keep in the accessibility tree.

**How it works:**

| Goal | Technique | Visual | AT |
|------|-----------|--------|----|
| Hide from all | `hidden`, `display: none` | Gone, no box | Out of tree |
| Hide from all, keep layout | `visibility: hidden` | Invisible, still takes space | Treated as hidden |
| Hide from AT, stay on screen | `aria-hidden="true"` | Visible | Out of tree (descendants too) |
| Hide visually, keep for AT | `.sr-only` / `.visually-hidden` | Off-screen 1×1 clip | Announced |
| Drop native role, keep content | `role="none"` / `role="presentation"` | Unchanged | Semantics removed; **focusable controls stay in tab order** |

```css
.sr-only {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
```

- `clip` is deprecated; keep it only as a fallback next to `clip-path`.
- `width: 0` / `height: 0` often **removes** content from AT — don’t use that for SR-only text.
- Decorative SVG inside a named button: `aria-hidden="true"` on the SVG so the path data is not read.
- Don’t put `aria-hidden="true"` or `role="presentation"` on **visible, focusable** controls.

**When to use:**

Icon+text buttons; skip-link off-screen until focus; closed dialog (`hidden` / `inert`).

#### Common pitfalls

`aria-hidden` on a parent of a focused button; combining hidden `<label>` + `aria-label` + `title` (triple announcement).

**Examples:**

```html
<button type="submit">
  <span class="sr-only">Search the page</span>
  <svg aria-hidden="true" width="24" height="24">…</svg>
</button>
<p hidden>Not shown to anyone.</p>
```

**Thoughts:** *`display:none`/`hidden` = nobody; `aria-hidden` = sighted only; `.sr-only` = AT only.*

**Sources:** [MDN — aria-hidden](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-hidden) · [MDN — hidden](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) · [Doka — Hiding content](https://doka.guide/a11y/hiding-content/)

</details>

<details>
  <summary>Image text alternatives</summary>

### Image text alternatives

**Definition:** Meaningful images need a **short alternative** (`alt` on `<img>`, `<title>` on inline SVG). Optional **caption** (`<figcaption>`) and **long description** (`<p>` + `aria-describedby` / `aria-details`) add what `alt` cannot hold.

**How it works:**

- Ask: does the image change meaning if removed? Yes → informative. No → decorative (`alt=""`, never omit `alt` — SRs may read the file path; don’t use a space).
- Don’t start `alt` with “image/photo” — the role is already `img`. Context decides the same photo’s `alt`. Color can matter; describe it when it carries meaning.
- **Informative:** describe the content. **Text-in-image:** put the words in `alt`, or better as real text. **Complex** (charts, screenshots): short `alt` + visible long text; wire with `aria-describedby`. `aria-details` can point at a longer page — **weak SR support**.
- **Groups:** `<figure>` + shared `<figcaption>`; each `<img>` still has its own `alt`. Caption and `alt` must **not** copy each other.
- **Functional** (logo in a link, icon button): `alt` / accessible name = **destination or action** (“Home”, “Doka”), not “logo” or a picture of the icon. If the link already has visible text, use `alt=""`.
- Inline **SVG:** `role="img"` + `<title>` (and `aria-labelledby` on `<title>`/`<desc>` for reliability). Decorative SVG: no `<title>`, `aria-hidden="true"`. CSS `background-image` is invisible to AT.
- Emoji: OS names vary; wrap with `role="img"` + `aria-label` only if the name must be exact.
- AI image description in SRs is a fallback — authors still own `alt`.

**When to use:**

Content photos, charts, logos, icon buttons, decorative flourishes.

#### Common pitfalls

Missing `alt`; empty `alt` on informative images; repeating `figcaption` in `alt`; putting URLs/emoji in `alt`; describing a logo instead of the link target.

**Examples:**

```html
<img src="chart.png" alt="Q3 revenue rose 12%. Details after the figure." aria-describedby="chart-desc" />
<p id="chart-desc">…</p>

<a href="/"><img src="logo.svg" alt="Home" /></a>
<a href="https://example.com"><img src="logo.svg" alt="" /> Example</a>
<img src="ornament.png" alt="" />

<svg role="img" viewBox="0 0 100 100" aria-labelledby="dog-title">
  <title id="dog-title">Green dog mascot wearing an a11y collar</title>
</svg>
```

**Thoughts:** *Decorative = `alt=""`; content = describe meaning; controls = name the action.*

**Sources:** [MDN — alt](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/alt) · [WAI — Images tutorial](https://www.w3.org/WAI/tutorials/images/) · [Doka — Describing images](https://doka.guide/a11y/images/) · [MDN — SVG in HTML](https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_in_HTML)

</details>

---

<a name="seo--structured-data"></a>

## SEO & structured data

<details>
  <summary>SEO fundamentals for developers</summary>

### SEO fundamentals for developers

**Definition:**

SEO improves visibility in organic search. Developers affect crawlability, indexing, structure, performance, and mobile-friendliness.

| Factor | HTML implementation |
|--------|---------------------|
| Crawlability | Valid HTML, no broken links |
| Indexing | `<title>`, `meta description`, `canonical` |
| Structure | Semantic headings, `<main>` |
| Performance | Core Web Vitals |

**How it works:**

- Crawlable HTML, valid structure, unique `<title>`, meta description.
- Semantic headings, `<main>`, internal links.
- Performance (Core Web Vitals) is ranking signal.

| Factor | HTML |
|--------|------|
| Title | Unique per page |
| Canonical | Duplicate content |

**When to use:**

Marketing pages · docs sites · SPA with SSR/prerender for indexable HTML.

#### Common pitfalls

- Empty or duplicate `<title>` on SPA routes.
- Blocking content behind JS with no SSR.
- `noindex` left on production.

**Examples:**

```html
<head>
  <title>How to Structure HTML — Guide</title>
  <meta name="description" content="Learn semantic HTML for SEO and accessibility." />
  <link rel="canonical" href="https://example.com/guide" />
</head>
```

**Sources:** [Google Search Central](https://developers.google.com/search/docs)

</details>

<details>
  <summary>Open Graph & Twitter cards</summary>

### Open Graph & Twitter cards

**Definition:**

Open Graph and Twitter Card meta tags control how links appear when shared on social platforms.

| Tag | Purpose |
|-----|---------|
| `og:title` | Share title |
| `og:description` | Share summary |
| `og:image` | Preview image |
| `twitter:card` | Twitter card type |

**How it works:**

- `og:*` meta controls Facebook/LinkedIn/Slack previews.
- `twitter:card` for Twitter/X card layout.
- Requires absolute URLs for images.

| Tag | Purpose |
|-----|--------|
| `og:title` | Share title |
| `og:image` | Preview image |

**When to use:**

Blog share cards · product pages · `summary_large_image`.

#### Common pitfalls

- Relative `og:image` URLs.
- Image smaller than 1200×630 for large cards.
- Missing `og:url` canonical.

**Examples:**

```html
<meta property="og:title" content="Page title" />
<meta property="og:description" content="Summary for social shares" />
<meta property="og:image" content="https://example.com/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
```

**Sources:** [ogp.me](https://ogp.me/)

</details>

<details>
  <summary>Structured data (JSON-LD)</summary>

### Structured data (JSON-LD)

**Definition:**

JSON-LD embeds machine-readable structured data for search rich results — articles, products, FAQs, breadcrumbs.

| Format | Notes |
|--------|-------|
| JSON-LD | Google's preferred format |
| Microdata | Attributes on HTML elements |
| RDFa | Less common today |

**How it works:**

- `<script type="application/ld+json">` embeds schema.org data.
- Google prefers JSON-LD over microdata.
- Types: Article, Product, FAQ, BreadcrumbList.

| Format | Notes |
|--------|-------|
| JSON-LD | Preferred by Google |
| Microdata | Attributes on HTML |

**When to use:**

Rich snippets · product prices · FAQ accordions in SERP.

#### Common pitfalls

- Markup doesn't match visible content (spam penalty).
- Invalid JSON syntax.
- Wrong `@type` for content.

**Examples:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to structure HTML",
  "author": { "@type": "Person", "name": "Jane Doe" },
  "datePublished": "2025-07-02"
}
</script>
```

**Sources:** [schema.org](https://schema.org/) · [Google structured data](https://developers.google.com/search/docs/appearance/structured-data)

</details>

<details>
  <summary>Internationalization (i18n)</summary>

### Internationalization (i18n)

**Definition:**

i18n makes content accessible across languages and writing directions. Set `lang` on `<html>` and use `hreflang` for regional variants.

| Technique | Implementation |
|-----------|----------------|
| Page language | `<html lang="en">` |
| RTL | `dir="rtl"` on `<html>` |
| Regional URLs | `<link rel="alternate" hreflang>` |

**How it works:**

- `<html lang="en">` sets page language for SR and hyphenation.
- `dir="rtl"` for Arabic/Hebrew; use CSS logical properties.
- `hreflang` links for regional alternates.

| Technique | Implementation |
|-----------|----------------|
| Page lang | `<html lang>` |
| RTL | `dir="rtl"` |

**When to use:**

Multi-language site · RTL layout · `lang` on inline foreign phrases.

#### Common pitfalls

- Wrong `lang` (bad pronunciation).
- `hreflang` without reciprocal links.
- Hard-coded LTR margins in CSS.

**Examples:**

```html
<html lang="en">
<link rel="alternate" hreflang="de" href="https://example.com/de/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/" />
```

**Thoughts:** CSS logical properties for RTL → [2_css.md](./2_css.md).

**Sources:** [MDN — lang](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)

</details>

---

<a name="advanced-topics"></a>

## Advanced topics

<details>
  <summary>Web Components (all three specs)</summary>

### Web Components (all three specs)

**Definition:**

Web Components combine Custom Elements, Shadow DOM, and HTML Templates for reusable, encapsulated UI.

| Technology | Purpose |
|------------|---------|
| Custom Elements | New HTML tags with lifecycle |
| Shadow DOM | Encapsulated DOM + styles |
| `<template>` + `<slot>` | Inert markup cloned into DOM |

**How it works:**

- Custom Elements — new tag names + lifecycle.
- Shadow DOM — encapsulated subtree + styles.
- `<template>` + `<slot>` — declarative composition.

| Spec | Purpose |
|------|--------|
| Custom Elements | New tags |
| Shadow DOM | Encapsulation |

**When to use:**

Design system primitives · embeddable widgets · framework-agnostic components.

#### Common pitfalls

- Shadow DOM breaking global form styles unexpectedly.
- Not projecting content with slots.
- Closed shadow roots blocking legitimate testing.

**Examples:**

```html
<template id="card-tpl">
  <div class="card"><slot name="title"></slot><slot></slot></div>
</template>
<user-card>
  <template shadowrootmode="open">
    <style>:host { display: block; }</style>
    <slot></slot>
  </template>
  <span>Projected content</span>
</user-card>
```

**Thoughts:** Custom Elements JS API → [3_js_browser.md](./3_js_browser.md).

**Sources:** [MDN — Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)

</details>

<details>
  <summary>Popover API</summary>

### Popover API

**Definition:**

The Popover API provides native top-layer overlays with light-dismiss and focus management via the `popover` attribute.

| Value | Behavior |
|-------|----------|
| `popover="auto"` | Closes on outside click |
| `popover="manual"` | Requires JS to close |

**How it works:**

- `popover` attribute puts element in top layer.
- `popovertarget` on button toggles target by id.
- `popover="auto"` light-dismiss; `manual` needs JS close.

| Value | Behavior |
|-------|----------|
| `auto` | Outside click closes |
| `manual` | JS-controlled |

**When to use:**

Menus · tooltips · teaching UI without z-index wars.

#### Common pitfalls

- Nesting popovers without focus plan.
- Replacing accessible menu patterns incorrectly.
- Browser support check before production.

**Examples:**

```html
<button popovertarget="menu" popovertargetaction="toggle">Open</button>
<div id="menu" popover>
  <p>Popover content</p>
</div>
```

**Sources:** [MDN — Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)

</details>

<details>
  <summary>inert, hidden, contenteditable</summary>

### inert, hidden, contenteditable

**Definition:**

These global attributes control visibility, interactivity, and inline editing behavior.

| Attribute | Behavior |
|-----------|----------|
| `hidden` | Not rendered (`display: none`) |
| `inert` | Excluded from interaction and focus |
| `contenteditable="true"` | User can edit content inline |

**How it works:**

- `hidden` — `display:none`, not rendered, not focusable.
- `inert` — visible but removed from interaction/focus (modal backgrounds).
- `contenteditable` — user can edit inner HTML inline.

| Attribute | Behavior |
|-----------|----------|
| `hidden` | Not displayed |
| `inert` | No interaction |

**When to use:**

Modal backdrop (`inert` on main) · toggle sections (`hidden`) · rich text editor.

#### Common pitfalls

- `aria-hidden` instead of `inert` for modal siblings (focus leak).
- `contenteditable` without sanitization on paste.
- `hidden` elements still in tab order if focusable children exist.

**Examples:**

```html
<div hidden>Not visible</div>
<main inert>Background while modal open</main>
<p contenteditable="true">Editable paragraph</p>
```

**Sources:** [MDN — inert](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert)

</details>

<details>
  <summary>Progressive enhancement vs graceful degradation</summary>

### Progressive enhancement vs graceful degradation

**Definition:**

Progressive enhancement starts with working baseline HTML and layers CSS/JS. Graceful degradation builds full experience with fallbacks.

| Approach | Strategy |
|----------|----------|
| Progressive enhancement | HTML works first; JS enhances |
| Graceful degradation | Full experience with fallbacks |

**How it works:**

- **PE:** baseline HTML works; JS/CSS enhance.
- **GD:** build full experience; provide fallbacks.
- PE is the modern default for resilient web apps.

| Approach | Strategy |
|----------|----------|
| PE | HTML first |
| GD | Full + fallback |

**When to use:**

Form works with POST · search works without JS autocomplete · `<noscript>` notice.

#### Common pitfalls

- Empty `<body>` until JS loads (no PE).
- Essential actions only via JS click handlers.
- Assuming fast JS on all devices.

**Examples:**

```html
<form action="/search" method="get">
  <label for="q">Search</label>
  <input id="q" name="q" type="search" />
  <button type="submit">Search</button>
</form>
<!-- JS can enhance with autocomplete, no-JS still works -->
```

**Sources:** [MDN — Progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)

</details>

<details>
  <summary>Feature detection vs user-agent sniffing</summary>

### Feature detection vs user-agent sniffing

**Definition:**

Feature detection checks whether a capability exists. User-agent sniffing parses browser strings — brittle and discouraged.

| Technique | Reliability |
|-----------|-------------|
| Feature detection | Preferred |
| User-agent sniffing | Brittle — avoid |

**How it works:**

- Feature detection: `if ('showModal' in HTMLDialogElement.prototype)`.
- UA sniffing: parsing `navigator.userAgent` — brittle.
- `@supports` in CSS for style features.

| Technique | Reliability |
|-----------|-------------|
| Feature detection | Good |
| UA sniffing | Poor |

**When to use:**

Polyfill dialog · progressive `popover` · CSS grid fallback.

#### Common pitfalls

- Blocking browsers by version string.
- Sniffing mobile UA for responsive layout (use CSS).
- Detecting Safari by UA for polyfills (false positives).

**Examples:**

```html
<!-- Prefer @supports in CSS and feature checks in JS -->
<!-- Never gate on browser name/version strings -->
```

**Sources:** [MDN — Feature detection](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection)

</details>

<details>
  <summary>HTML validation</summary>

### HTML validation

**Definition:**

Validation checks HTML against the spec. Invalid HTML may render but causes accessibility, SEO, and maintenance issues.

| Type | Checks |
|------|--------|
| Syntax | Well-formed markup |
| Logical | Heading order, unique IDs, alt text |

**How it works:**

- W3C validator checks against HTML spec.
- Invalid markup may still render (error recovery) but hurts a11y/SEO.
- Logical validation: one `h1`, unique ids, alt on images.

| Type | Checks |
|------|--------|
| Syntax | Well-formed tags |
| Logic | Heading order, unique IDs |

**When to use:**

CI HTML lint · pre-release audit · email HTML (stricter clients).

#### Common pitfalls

- Duplicate `id` values (invalid, breaks labels).
- Unclosed tags relying on browser fixes.
- Custom elements without hyphen (invalid CE name).

**Examples:**

```html
<!DOCTYPE html>
<html lang="en">
  <head><title>Valid page</title></head>
  <body><main><h1>Title</h1></main></body>
</html>
```

**Sources:** [W3C Validator](https://validator.w3.org/)

</details>

<details>
  <summary>Cross-browser compatibility</summary>

### Cross-browser compatibility

**Definition:**

HTML features vary by browser support. Check caniuse.com before using new APIs; use polyfills or progressive enhancement.

| Tool | Purpose |
|------|---------|
| caniuse.com | Feature support matrix |
| Progressive enhancement | Baseline HTML always works |

**How it works:**

- Check caniuse.com for new HTML APIs.
- Progressive enhancement: baseline HTML always works.
- Polyfills for `dialog`, `popover` where needed.

| Tool | Purpose |
|------|--------|
| caniuse.com | Support matrix |
| PE | Baseline without new APIs |

**When to use:**

Native `<dialog>` with fallback · `input type="date"` varying UI.

#### Common pitfalls

- Shipping features without support matrix.
- Polyfill without feature detect gate.
- Testing only Chrome.

**Examples:**

```html
<dialog id="modal">
  <p>Native modal — check support, provide fallback.</p>
</dialog>
```

**Sources:** [caniuse.com](https://caniuse.com/)

</details>

<details>
  <summary>HTML5 as an open web platform</summary>

### HTML5 as an open web platform

**Definition:**

HTML5 is part of a broader platform: HTML + CSS + JavaScript + DOM APIs. Markup provides structure; behavior and presentation come from JS and CSS.

| Layer | Role |
|-------|------|
| HTML | Structure and semantics |
| CSS | Presentation → [2_css.md](./2_css.md) |
| JS | Behavior → [3_js_browser.md](./3_js_browser.md) |

**How it works:**

- HTML5 = HTML + related APIs (CSS, JS, DOM).
- Markup provides structure; behavior from JS; presentation from CSS.
- Living Standard at WHATWG — continuous evolution.

| Layer | Role |
|-------|------|
| HTML | Structure |
| CSS | Presentation |
| JS | Behavior |

**When to use:**

PWA (HTML+manifest+SW) · media pages · web components.

#### Common pitfalls

- Treating HTML as obsolete in SPAs.
- Inline styles/scripts instead of separation.
- Ignoring semantic HTML in component frameworks.

**Examples:**

```html
<!DOCTYPE html>
<html lang="en">
  <head><link rel="stylesheet" href="/app.css" /></head>
  <body><main id="app"></main><script src="/app.js" defer></script></body>
</html>
```

**Sources:** [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)

</details>

<details>
  <summary>ES module import maps</summary>

### ES module import maps

**Definition:**

Import maps let browsers resolve bare module specifiers to URLs without a bundler.

| Key | Maps to |
|-----|---------|
| `"lodash"` | `/vendor/lodash.esm.js` |
| `"components/"` | `/js/components/` |

**How it works:**

- `<script type="importmap">` maps bare specifiers to URLs.
- Enables `import 'lodash'` without bundler in modern browsers.
- JSON object: `imports` and optional `scopes`.

| Key | Maps |
|-----|------|
| `imports` | Bare specifier → URL |
| `scopes` | Path-specific overrides |

**When to use:**

No-bundler prototypes · CDN bare imports · scoped mappings.

#### Common pitfalls

- Import map after module scripts (must be first).
- Missing CORS on mapped CDN URLs.
- Production without fallback for unsupported browsers.

**Examples:**

```html
<script type="importmap">
{
  "imports": {
    "lodash": "/vendor/lodash.esm.js",
    "components/": "/js/components/"
  }
}
</script>
<script type="module" src="/app.mjs"></script>
```

**Sources:** [MDN — import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)

</details>

<details>
  <summary>Web App Manifest (PWA)</summary>

### Web App Manifest (PWA)

**Definition:**

The Web App Manifest defines installable PWA metadata — name, icons, `start_url`, `display`, and theme colors.

| Field | Purpose |
|-------|---------|
| `name` | App display name |
| `icons` | Home screen icons |
| `display: standalone` | App-like chrome |

**How it works:**

- `<link rel="manifest" href="/manifest.webmanifest">` — JSON for install metadata.
- Fields: `name`, `icons`, `start_url`, `display`, `theme_color`.
- Works with Service Worker for offline; manifest alone = installable metadata only.

| Field | Purpose |
|-------|--------|
| `icons` | Install icons |
| `display` | `standalone` vs `browser` |

**When to use:**

Add to home screen · standalone display · themed splash.

#### Common pitfalls

- Manifest not served with correct MIME type.
- Missing 192/512 icons.
- `start_url` not cacheable.

**Examples:**

```html
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="theme-color" content="#1a1a2e" />
```

**Sources:** [MDN — Web app manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)

</details>

<details>
  <summary>Obsolete elements — do not use</summary>

### Obsolete elements — do not use

**Definition:**

Obsolete elements still parse in browsers but should not be used — replace with CSS or modern alternatives.

| Obsolete | Replacement |
|----------|-------------|
| `<font>`, `<center>` | CSS typography/alignment |
| `<marquee>` | CSS animations |
| `<frame>`, `<frameset>` | Never use |
| `<acronym>` | `<abbr>` |

**How it works:**

- Legacy presentational tags removed or deprecated: `font`, `center`, `marquee`, `frame`/`frameset`.
- Use CSS for presentation; semantic elements for structure.
- Browsers may still render but invalid and bad for a11y.

| Obsolete | Replacement |
|----------|-------------|
| `<font>` | CSS `color`/`font-family` |
| `<center>` | CSS `text-align` |

**When to use:**

Migrating legacy sites · sanitizing old CMS output.

#### Common pitfalls

- Copying W3Schools-era examples.
- `u` for non-proper names (prefer CSS).
- Table layout tags (`width` on table).

**Examples:**

```html
<p class="centered">Use CSS instead of obsolete tags.</p>
```

**Thoughts:** CSS replacements → [2_css.md](./2_css.md).

**Sources:** [MDN — Obsolete features](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#obsolete_and_deprecated_elements)

</details>

<details>
  <summary>HTML security basics (XSS)</summary>

### HTML security basics (XSS)

**Definition:**

HTML is the first line of defense against XSS. Escape user input, avoid inline handlers, and use CSP and SRI.

| Risk | Safe practice |
|------|---------------|
| User input in HTML | Escape; use `textContent` not `innerHTML` |
| Inline handlers | Avoid `onclick`; use `addEventListener` |
| Third-party scripts | SRI `integrity` attribute |
| `target="_blank"` | Add `rel="noopener noreferrer"` |

**How it works:**

- Never insert untrusted data into HTML without escaping.
- Avoid inline event handlers (`onclick`); use CSP.
- SRI `integrity` on third-party scripts; `rel="noopener"` on `_blank`.

| Risk | Mitigation |
|------|------------|
| `innerHTML` injection | `textContent` / sanitize |
| Inline handlers | CSP + addEventListener |

**When to use:**

User-generated comments · CMS content · third-party widgets.

#### Common pitfalls

- `innerHTML` with user input.
- `target="_blank"` without `noopener`.
- CDN scripts without SRI.

**Examples:**

```html
<a href="https://external.com" target="_blank" rel="noopener noreferrer">External</a>
<script src="https://cdn.example.com/lib.js" integrity="sha384-..." crossorigin="anonymous"></script>
```

**Thoughts:** DOM XSS patterns → [3_js_browser.md](./3_js_browser.md). Stored vs reflected, CSP, clickjacking → [7_special.md](./7_special.md#14-common-web-attacks) · [6_web_api.md](./6_web_api.md#security).

**Sources:** [MDN — XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)

</details>

---

<a name="attributes-reference"></a>

## Attributes reference

<details>
  <summary>Common attributes</summary>

### Common attributes

**Definition:**

Attributes provide metadata and behavior on HTML elements — global attributes work on any element; others are element-specific.

| Attribute | Element(s) | Purpose |
|-----------|-----------|---------|
| `src` | img, script, iframe | Resource URL |
| `href` | a, link | Link target |
| `class` | Global | CSS hook |
| `id` | Global | Unique identifier |
| `name` | form controls | Key in submitted data |

**How it works:**

- Element-specific and global attributes modify behavior.
- `src`/`href` locate resources; `name` keys form data; `class`/`id` hook CSS/JS.

| Attribute | Purpose |
|-----------|--------|
| `src` | Resource URL |
| `name` | Form field key |

**When to use:**

Image `src`+`alt` · link `href` · form control `name`.

#### Common pitfalls

- `id` reused on page.
- `class` for JS-only hooks (prefer `data-*`).
- Missing `alt` when using `src` on img.

**Examples:**

```html
<img src="/logo.png" alt="Logo" class="brand" id="site-logo" />
<a href="/about" class="nav-link">About</a>
<input id="email" name="email" type="email" required />
```

**Sources:** [MDN — Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)

</details>

<details>
  <summary>class vs id</summary>

### class vs id

**Definition:**

`class` can appear on many elements for shared styling. `id` must be unique per page — used for anchors, label association, and unique targets.

| | `class` | `id` |
|---|---------|------|
| Cardinality | Many elements | One per page |
| CSS selector | `.my-class` | `#my-id` |
| Use for | Shared patterns | Unique anchor/target |

**How it works:**

- `class` — reusable, many per page, CSS `.class`.
- `id` — unique per document, `#id` selector, fragment targets.
- `label for` and ARIA reference `id`.

| | `class` | `id` |
|---|---------|------|
| Count | Many | One per page |

**When to use:**

Shared card style (`class`) · skip link target (`id="main"`).

#### Common pitfalls

- Duplicate ids (invalid).
- Styling with ids (high specificity).
- Auto-generated ids colliding in loops.

**Examples:**

```html
<p class="intro highlight">Shared classes</p>
<main id="main">Unique landmark anchor</main>
<label for="email">Email</label>
```

**Sources:** [MDN — id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id)

</details>

<details>
  <summary>Global attributes</summary>

### Global attributes

**Definition:**

Global attributes can be used on any HTML element — `class`, `id`, `hidden`, `inert`, `tabindex`, `data-*`, and all `aria-*` attributes.

| Attribute | Purpose |
|-----------|---------|
| `data-*` | Custom data for JS/CSS |
| `aria-*` | Accessibility semantics |
| `tabindex` | Focus order (`0` or `-1`) |
| `hidden` / `inert` | Visibility and interaction |

**How it works:**

- Valid on any element: `class`, `id`, `hidden`, `inert`, `tabindex`, `data-*`, `aria-*`, `lang`, `title`.

| Attribute | Purpose |
|-----------|--------|
| `data-*` | Custom data |
| `aria-*` | Accessibility |

**When to use:**

`data-user-id` for JS · `aria-label` on icon buttons · `inert` during modal.

#### Common pitfalls

- `tabindex="1"` positive values (avoid).
- `title` as primary label (unreliable).
- Invalid `data-*` names (uppercase).

**Examples:**

```html
<div data-user-id="42" aria-label="User profile card" tabindex="0"></div>
```

**Sources:** [MDN — Global attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes)

</details>

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

Interview answers for the browser section. Full theory: [Browser rendering pipeline](#browser-rendering-pipeline) · [Browser & rendering](#browser--rendering).

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

**See also:** [What happens when you enter a URL?](#browser--rendering) (full theory)

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

**See also:** [How DNS works](#browser--rendering) (full theory)

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

**See also:** [How the browser gets HTML](#browser--rendering)

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

**See also:** [DOM tree construction](#browser--rendering) · [3_js_browser.md](./3_js_browser.md)

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

**See also:** [What is the CSSOM?](#browser--rendering)

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

**See also:** [What is the Render Tree?](#browser--rendering)

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

**See also:** [Layout (Reflow)](#browser--rendering) · [2_css.md](./2_css.md)

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

**See also:** [Paint](#browser--rendering)

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

**See also:** [Compositing](#browser--rendering)

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

**See also:** [Layout vs Paint vs Compositing](#browser--rendering)

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

**See also:** [Browser rendering pipeline](#browser-rendering-pipeline) · [3_js_browser.md — Script loading](./3_js_browser.md#script-loading) · [FCP](./6_web_api.md#first-contentful-paint-fcp)

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

**See also:** [async vs defer vs module](#performance--resource-loading) · [3_js_browser.md — Script loading](./3_js_browser.md#script-loading) · [2_css.md](./2_css.md) critical CSS

**Sources:** [web.dev — Render blocking CSS](https://web.dev/articles/critical-rendering-path/render-blocking-css) · [MDN — script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)

</details>

<details>
  <summary>Q-DIRTY. Global vs incremental layout? What are dirty nodes?</summary>

### Global vs incremental layout? What are dirty nodes?

**Definition:** **Global** layout recalculates the whole render tree (e.g. window resize). **Incremental** layout only the **dirty** subtree — the changed element and its descendants.

**How it works:** Children are dirtied because their geometry often depends on the parent. Stay in normal flow so independent boxes can be sized in one pass.

**Thoughts:** *Dirty = mutated node + kids; resize is global and expensive.*

**See also:** [Global vs incremental layout](#browser--rendering)

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

**See also:** [Reflow, repaint, and animation frames](#browser--rendering) · [3_js_browser.md](./3_js_browser.md#request-animation-frame)

**Sources:** [MDN — requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

</details>

<details>
  <summary>Q-PROG. What is progressive rendering?</summary>

### What is progressive rendering?

**Definition:** Show useful pixels early: stream HTML, inline **critical CSS**, non-blocking scripts, lazy below-fold media — do not wait for the full bundle before first paint.

**How it works:** Parser builds DOM incrementally; styled first paint still needs CSSOM. Approaches: critical CSS, `defer`/`async`, `content-visibility: auto`, `loading="lazy"`, skeletons.

**Thoughts:** *First useful paint beats waiting for everything.*

**See also:** [Progressive rendering](#browser--rendering) · [2_css.md](./2_css.md)

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

**See also:** [Accessibility](#accessibility) (tree, names, forms, images).

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

**Sources:** [Hiding content](#hiding-content-from-at-vs-visually) · [Image text alternatives](#image-text-alternatives)

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

**Sources:** [3_js_browser.md](./3_js_browser.md) · [MDN — Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)

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

**Sources:** [3_js_browser.md](./3_js_browser.md) · [MDN — Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)

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

**Answer:** Visual stability metric. Reserve `width`/`height` or `aspect-ratio` for images, video, ads, iframes; do not inject banners above in-view content; match font fallback metrics (`size-adjust`); animate `transform` not `top`/`margin`. Full notes: [CLS](#cls-cumulative-layout-shift).

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
