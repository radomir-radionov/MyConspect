# HTML — Interview

HTML interview questions. Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./1_html.md)

### Related docs

* [HTML — Structure](./1_html_structure.md) · [HTML — Semantics](./1_html_semantics.md) · [HTML — Forms](./1_html_forms.md) · [HTML — Media](./1_html_media.md) · [HTML — Rendering](./1_html_rendering.md) · [HTML — Performance](./1_html_performance.md) · [HTML — Accessibility](./1_html_a11y.md) · [HTML — SEO](./1_html_seo.md) · [HTML — Advanced](./1_html_advanced.md) · [HTML — Interview](./1_html_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — HTML5](https://devinterview.io/questions/web-and-mobile-development/html5-interview-questions/).

### HTML Basics

<details>
<summary>What does HTML stand for and what is its purpose?</summary>

### What does HTML stand for and what is its purpose?

**Definition:**

HTML is HyperText Markup Language: the markup that names the parts of a page so a browser can build a document from it. CSS and JavaScript sit on that structure; they do not replace it.

**How it works:**

- Elements mark structure: regions, headings, paragraphs, lists, links, forms, and embedded media.
- Hypertext is the linking part. An `a` element points at another URL or at an id on the same page.
- The browser parses the markup into a DOM. That tree is what scripts and assistive technology walk.
- Semantic names such as `nav` and `article` tell readers and tools what a region is for, not only how it looks.
- Presentation stays in CSS. Behavior stays in JavaScript. The three layers can be owned and cached separately.
- The language is the HTML Living Standard. Older documents still parse, and new elements are ignored by browsers that do not know them rather than breaking the page.
- The same markup is the base for a brochure site, a web app, and most ads that run in a browser.

**Examples:**

```html
<article>
  <h1>Release notes</h1>
  <p>The API now accepts <a href="/docs/pagination">cursor pagination</a>.</p>
</article>
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTML
- https://html.spec.whatwg.org/

</details>

<details>
<summary>Describe the basic structure of an HTML document.</summary>

### Describe the basic structure of an HTML document.

**Definition:**

An HTML document is a doctype, then one root `html` element that holds `head` and `body`. The head describes the document; the body is what people see.

**How it works:**

- `<!DOCTYPE html>` is an instruction to the browser, not an element. It selects standards mode for an HTML document.
- `html` is the root. Everything else is inside it.
- `head` carries the title, character encoding, viewport, and links to styles or scripts. That material is not painted as page text.
- `title` is the name shown on the tab and used as the default label when the page is bookmarked or shared.
- `body` holds the visible tree: headings, paragraphs, images, and controls.
- The usual order is doctype, then `html`, then `head`, then `body`.

**Examples:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Shift notes</title>
  </head>
  <body>
    <h1>Shift notes</h1>
    <p>Doors open at 09:00.</p>
  </body>
</html>
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html
- https://developer.mozilla.org/en-US/docs/Glossary/Doctype

</details>

<details>
<summary>What do DOCTYPE and html lang attributes do?</summary>

### What do DOCTYPE and html lang attributes do?

**Definition:**

The doctype picks the parsing and layout mode. `lang` on `html` names the document’s primary language so tools can pronounce, hyphenate, and index it.

**How it works:**

- `<!DOCTYPE html>` goes before `<html>`. It turns on standards mode. Without a doctype, many browsers fall back to quirks mode and old layout bugs return.
- It does not pick a frozen HTML version. The current doctype means “this is an HTML document.”
- `lang` takes a BCP 47 tag: a language such as `en`, or a language plus region such as `en-GB` or `pt-BR`.
- Screen readers use it to choose a voice. Browsers use it for hyphenation and quotation marks. Search engines use it as a language hint.
- A fragment in another language gets its own `lang`, so a Russian quote inside an English page is not read as English.
- `und` means the language is unknown. Leaving `lang` off is worse than a honest tag: the user agent then has to guess.

**Examples:**

```html
<!DOCTYPE html>
<html lang="en-GB">
  <head><title>Opening hours</title></head>
  <body>
    <p>Closed on bank holidays.</p>
    <p lang="ru">Выходной в праздники.</p>
  </body>
</html>
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html
- https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang

</details>

<details>
<summary>What is the difference between head and body tags?</summary>

### What is the difference between head and body tags?

**Definition:**

`head` configures the document. `body` is the document people read and use. They are siblings inside `html`, and `head` comes first.

**How it works:**

- `head` holds metadata: `title`, charset, viewport, stylesheet links, and script links. Browsers do not paint that block as page content.
- `body` holds the visible tree: text, images, links, forms, and landmarks such as `header`, `nav`, `main`, and `footer`.
- Setup in `head` is available before the body is shown. A charset declared late can already have mis-decoded the file.
- Styles and scripts may live in either place, but the usual split is: describe the page in `head`, put the content in `body`.
- A script at the end of `body` runs after the markup above it has been parsed. A script in `head` without `defer` or `async` blocks parsing.

**Examples:**

```html
<head>
  <meta charset="utf-8">
  <title>Kitchen board</title>
  <link rel="stylesheet" href="/board.css">
</head>
<body>
  <h1>Today</h1>
  <p>Soup, then bread.</p>
</body>
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body

</details>

<details>
<summary>Can you explain the purpose of meta tags in HTML?</summary>

### Can you explain the purpose of meta tags in HTML?

**Definition:**

A `meta` element is machine-readable information about the document. Visitors do not see it as page text; browsers, crawlers, and social sites do.

**How it works:**

- `charset` names the encoding, almost always `utf-8`, and belongs near the start of `head`.
- `name="viewport"` tells mobile browsers the layout width. `width=device-width, initial-scale=1` is the usual responsive setting.
- `name="description"` is a short summary. Search results may show it under the title.
- `name="robots"` can ask a crawler to skip indexing or to skip following links. It is still a real control, not a leftover.
- `name="author"` records who wrote the page. It is optional.
- `name="keywords"` is ignored by major search engines. Do not spend time on it.
- Open Graph (`property="og:…"`) and Twitter card tags describe the preview card when the URL is shared.
- A canonical URL is a `link rel="canonical"`, not a meta name. It names the preferred address when several URLs show the same page.
- `http-equiv="refresh"` is an old redirect. Prefer a real HTTP redirect.

**Examples:**

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Weekend hours for the north clinic.">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="North clinic hours">
  <link rel="canonical" href="https://example.com/hours">
  <title>North clinic hours</title>
</head>
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name

</details>

<details>
<summary>How do you link a CSS file to an HTML document?</summary>

### How do you link a CSS file to an HTML document?

**Definition:**

An external stylesheet is attached with `link` in `head`. `rel="stylesheet"` says what the resource is; `href` says where it lives.

**How it works:**

- `href` may be a path relative to the page (`/styles/app.css`) or an absolute URL.
- `type` is unnecessary for a CSS stylesheet. Browsers already know the type from `rel`.
- One document can link several stylesheets. Later rules win when specificity is equal, which is the cascade.
- The file is cached on its own, so many pages can share it.
- Two other ways exist, with worse reuse: a `style` element in the document, and a `style` attribute on one element.
- `@import` inside CSS pulls another sheet in, but it adds a request chain. A `link` in `head` is the straightforward path.
- Keep one main method. Mixing inline rules, embedded sheets, and several imports makes the cascade hard to trace.

**Examples:**

```html
<head>
  <link rel="stylesheet" href="/styles/app.css">
</head>
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link

</details>

<details>
<summary>How do you link a JavaScript file to an HTML document?</summary>

### How do you link a JavaScript file to an HTML document?

**Definition:**

A classic or module script is loaded with `script`. An external file uses `src`; inline code sits between the start and end tags. The end tag is required.

**How it works:**

- `src` points at the file. The same element does not carry a large inline program and a `src`.
- A classic script without `defer` or `async` runs as soon as it is reached and blocks parsing.
- `defer` on a classic script in `head` downloads during parsing and runs after the document is parsed, in order.
- `async` runs when the download finishes, order not guaranteed. Use it for independent scripts.
- `type="module"` loads an ES module: deferred by default, strict mode, and its own scope.
- Place interactive scripts so the markup they need already exists, or wait for it. The end of `body` is the simple version of that.
- An external file can be cached and shared. Inline code cannot, and it is harder to reuse across pages.
- Comments and secrets do not belong in either place: the script is downloaded by the browser.

**Examples:**

```html
<head>
  <script src="/js/app.js" defer></script>
</head>
<body>
  <button id="save">Save</button>
  <script>
    document.querySelector("#save").addEventListener("click", () => {
      console.log("saved");
    });
  </script>
</body>
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script

</details>

<details>
<summary>How do you add a comment in HTML and why would you use them?</summary>

### How do you add a comment in HTML and why would you use them?

**Definition:**

An HTML comment is text between `<!--` and `-->`. The parser drops it, so it is not shown and it is not an element.

**How it works:**

- Use one to say why a block exists, to mark a temporary workaround, or to hide markup while you debug.
- A comment can hold a reminder for the next edit. It cannot hold a secret: the source is still downloaded.
- Do not narrate the obvious (`<!-- paragraph -->` next to a `p`). If the markup is clear, the comment is noise.
- Keep it short. A comment that restates the code drifts out of date.
- Update or delete a comment when the markup changes. A stale note is worse than none.
- Comments do not nest. `--` inside a comment is unsafe; keep the text plain.
- Conditional comments for old Internet Explorer are historical. Do not write new ones.

**Examples:**

```html
<!-- Price is hidden until the catalog request returns. -->
<p hidden id="price"></p>
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTML/Comments

</details>

<details>
<summary>How do you serve your page in multiple languages?</summary>

### How do you serve your page in multiple languages?

**Definition:**

Each language version is a real document: its own URL, a correct `lang`, and links that tell browsers and crawlers about the other versions.

**How it works:**

- Set `lang` on `<html>` even for a single-language page. Use a BCP 47 tag: `en`, `ru`, `es-MX`, `pt-BR`.
- A region subtag is the ISO 3166 code after a hyphen. `en-GB` and `en-US` are different locales, not just a label.
- Put `lang` on any element whose language differs from the page, and `dir="rtl"` when the writing direction is right to left.
- Give each language its own URL, such as `/en/about` and `/ru/about`, with human-readable paths.
- Advertise the set with `<link rel="alternate" hreflang="ru" href="…">`, including `x-default` for the fallback.
- Do not serve every language from one URL and swap the text with script. Crawlers and shared links then cannot point at a language.
- Translate the visible content. A `lang` tag on untranslated text is a false hint.

**Examples:**

```html
<html lang="en">
  <head>
    <link rel="alternate" hreflang="en" href="https://example.com/en/about">
    <link rel="alternate" hreflang="ru" href="https://example.com/ru/about">
    <link rel="alternate" hreflang="x-default" href="https://example.com/en/about">
    <title>About</title>
  </head>
</html>
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
- https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel#alternate

</details>

<details>
<summary>What are data-* attributes and when should they be used?</summary>

### What are data-* attributes and when should they be used?

**Definition:**

`data-*` attributes store private page data on an element. They are for the page’s own script and styles, not a substitute for visible text or ARIA.

**How it works:**

- The name is `data-` plus a custom token, such as `data-sku`. The attribute is valid HTML; you do not invent a bare `sku` attribute.
- JavaScript reads them on `element.dataset`. `data-sku` becomes `dataset.sku`. A multi-word name such as `data-user-id` becomes `dataset.userId`.
- Values are strings. Numbers and flags need an explicit conversion.
- CSS can match them: `[data-status="held"] { opacity: 0.6 }`.
- Typical uses: a widget id, a product code the click handler needs, or a state flag for styling.
- Do not hide the only copy of information people need inside `data-*`. Screen readers do not announce dataset values.
- Do not use them as a second copy of `aria-*` or of the text already in the element.

**Examples:**

```html
<button type="button" data-sku="NB-14" data-stock="3">Add notebook</button>
```

```js
const button = document.querySelector("[data-sku]");
const sku = button.dataset.sku; // "NB-14"
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/Use_data_attributes

</details>

### Text Formatting in HTML

<details>
<summary>What is the difference between b and strong tags?</summary>

### What is the difference between b and strong tags?

**Definition:**

`strong` marks text that has strong importance. `b` marks a span that is stylistically offset, such as a product name, without adding that importance. Both often look bold; the meaning is not the same.

**How it works:**

- Use `strong` for a warning, a required step, or a word the reader must not miss. Assistive technology can convey that importance.
- Use `b` for a keyword, a product name in a paragraph, or a lead-in that should stand out without being “more important.”
- The default style of both is bold. That is a presentation default, not the definition.
- If you only want heavier type, set `font-weight` in CSS and leave the element that matches the meaning.
- Do not wrap a whole paragraph in `strong` to make it loud. Importance is a span, not a paint bucket.
- `b` is not deprecated. It is the right element when the offset is real and the importance is not.

**Examples:**

```html
<p><b>North line</b> is delayed.</p>
<p><strong>Do not board</strong> until the doors are clear.</p>
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/b

</details>

<details>
<summary>When would you use em over i, and vice versa?</summary>

### When would you use em over i, and vice versa?

**Definition:**

`em` is stress emphasis: the sentence means something else if that word is not stressed. `i` marks text in a different voice, such as a term, a foreign phrase, or a thought, without that stress.

**How it works:**

- `em` changes the reading. “Call the *manager*” is not the same instruction as “call the manager.”
- Stress can nest. An `em` inside an `em` is a stronger stress.
- `i` fits a taxonomic name, a technical term on first use, a phrase in another language, or a character’s thought. Pair a foreign phrase with `lang`.
- Both default to italic. The italic is not the reason to pick one.
- Decorative italic is `font-style: italic` on a normal element. Do not pick `em` or `i` for decoration.
- Do not put a style attribute on `em` to fake a highlight. If the span is a search hit, that is `mark`.

**Examples:**

```html
<p>Charge the <em>spare</em> battery, not the one in the radio.</p>
<p>The sign uses the word <i lang="fr">sortie</i> for the exit.</p>
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/em
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/i

</details>

<details>
<summary>What is the purpose of small, s, and mark tags?</summary>

### What is the purpose of small, s, and mark tags?

**Definition:**

`small`, `s`, and `mark` name three different kinds of text, not three font tricks. Size, strikethrough, and highlight in CSS do not carry those meanings.

**How it works:**

- `small` is a side comment: copyright, legal fine print, or an attribution. It is not a way to say “this heading should be 12px.”
- `s` marks text that is no longer accurate or no longer relevant, such as a superseded price. The browser draws a line through it.
- `del` is the editorial “this was removed.” `s` is “this is no longer correct.” They are not interchangeable.
- `mark` highlights a span that matters in the current context, such as a search match inside a quoted paragraph. It does not mean “important in general”; that is `strong`.
- If you only want smaller type, a line, or a yellow background, use CSS.

**Examples:**

```html
<p>Was <s>$40</s> now $28.</p>
<p>Results for “berth”: please <mark>berth</mark> at pier 4.</p>
<footer><small>© 2026 Harbor office</small></footer>
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/small
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/s
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark

</details>

<details>
<summary>What are semantic HTML tags and why are they important?</summary>

### What are semantic HTML tags and why are they important?

**Definition:**

A semantic element’s name is its role. `nav` is navigation, `p` is a paragraph, `button` is a button. A `div` with a class can look the same and still tell nobody what the region is.

**How it works:**

- Landmarks (`header`, `nav`, `main`, `aside`, `footer`) give assistive technology a map of the page.
- Headings (`h1`–`h6`) outline the document. A heading painted to look big with CSS, sitting in a `div`, is not in that outline.
- `article` is a self-contained piece, such as a post. `section` is a thematic group that should have a heading. Not every page needs both.
- Lists, links, figures, and captions (`ul`, `ol`, `a`, `figure`, `figcaption`) name common parts that generic containers hide.
- Crawlers and browser reader modes use the same names. The page is also easier to restyle, because structure is not buried in class strings.
- Semantics do not replace CSS. You still style the elements. You stop using classes as the only description of what they are.
- One `main` per page. Do not wrap everything in `article` just to look semantic.

**Examples:**

```html
<header>
  <a href="/">Harbor</a>
  <nav>
    <a href="/tides">Tides</a>
    <a href="/berths">Berths</a>
  </nav>
</header>
<main>
  <h1>Pier 4</h1>
  <p>Open to small craft.</p>
</main>
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements

</details>

<details>
<summary>How do you create a paragraph or a line break in HTML?</summary>

### How do you create a paragraph or a line break in HTML?

**Definition:**

A paragraph is a `p` element. A line break inside a block is `br`. They solve different problems, and a `br` is not a way to separate paragraphs.

**How it works:**

- `p` is a block. The default stylesheet adds margin above and below, which is the visual gap between paragraphs. You can change that margin in CSS.
- A paragraph contains phrasing content: text, links, emphasis. It does not contain another paragraph or a heading.
- `br` is an empty element. It ends the current line and continues in the same paragraph or address. A postal address or a poem line is the usual case.
- `br` has no end tag. Writing `</br>` is not the HTML form.
- Stacking `br` elements to fake paragraph spacing fights the default margin and breaks when the font size changes.
- White space in the source collapses. A newline in the file is not a line break on the page.
- `textarea` is a form control for multi-line input. It wraps the user’s text; it does not mark up paragraphs in the document.
- `pre` keeps source line breaks for preformatted text. That is a third tool, not a substitute for `p`.

**Examples:**

```html
<p>The gate closes at dusk.</p>
<p>Late arrivals use the south door.</p>
<address>
  Pier 4<br>
  North quay
</address>
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/br

</details>

### Links and Navigation

<details>
<summary>How do you create a hyperlink in HTML?</summary>

### How do you create a hyperlink in HTML?

**Definition:**

</details>

<details>
<summary>What is the difference between relative and absolute URLs?</summary>

### What is the difference between relative and absolute URLs?

**Definition:**

</details>

<details>
<summary>How can you open a link in a new tab?</summary>

### How can you open a link in a new tab?

**Definition:**

</details>

<details>
<summary>How do you create an anchor to jump to a specific part of the page?</summary>

### How do you create an anchor to jump to a specific part of the page?

**Definition:**

</details>

<details>
<summary>How do you link to a downloadable file in HTML?</summary>

### How do you link to a downloadable file in HTML?

**Definition:**

</details>

### Images and Objects

<details>
<summary>How do you embed images in an HTML page?</summary>

### How do you embed images in an HTML page?

**Definition:**

</details>

<details>
<summary>What is the importance of the alt attribute for images?</summary>

### What is the importance of the alt attribute for images?

**Definition:**

</details>

<details>
<summary>What image formats are supported by web browsers?</summary>

### What image formats are supported by web browsers?

**Definition:**

</details>

<details>
<summary>How do you create image maps in HTML?</summary>

### How do you create image maps in HTML?

**Definition:**

</details>

<details>
<summary>What is the difference between svg and canvas elements?</summary>

### What is the difference between svg and canvas elements?

**Definition:**

</details>

### Lists

<details>
<summary>What are the different types of lists available in HTML?</summary>

### What are the different types of lists available in HTML?

**Definition:**

</details>

<details>
<summary>How do you create ordered, unordered, and description lists in HTML?</summary>

### How do you create ordered, unordered, and description lists in HTML?

**Definition:**

</details>

<details>
<summary>Can lists be nested in HTML? If so, how?</summary>

### Can lists be nested in HTML? If so, how?

**Definition:**

</details>

<details>
<summary>What attributes can you use with lists to modify their appearance or behavior?</summary>

### What attributes can you use with lists to modify their appearance or behavior?

**Definition:**

</details>

### Forms and Input Elements

<details>
<summary>What are HTML forms and how do you create one?</summary>

### What are HTML forms and how do you create one?

**Definition:**

</details>

<details>
<summary>Describe the different form input types in HTML5.</summary>

### Describe the different form input types in HTML5.

**Definition:**

</details>

<details>
<summary>How do you make form inputs required?</summary>

### How do you make form inputs required?

**Definition:**

</details>

<details>
<summary>What is the purpose of the label element in forms?</summary>

### What is the purpose of the label element in forms?

**Definition:**

</details>

<details>
<summary>How do you group form inputs and why would you do this?</summary>

### How do you group form inputs and why would you do this?

**Definition:**

</details>

### HTML5 Features

<details>
<summary>What is new in HTML5 compared to previous versions?</summary>

### What is new in HTML5 compared to previous versions?

**Definition:**

</details>

<details>
<summary>How do you create a section on a webpage using HTML5 semantic elements?</summary>

### How do you create a section on a webpage using HTML5 semantic elements?

**Definition:**

</details>

<details>
<summary>What is the role of the article element in HTML5?</summary>

### What is the role of the article element in HTML5?

**Definition:**

</details>

<details>
<summary>Can you explain the use of the nav and aside elements in HTML5?</summary>

### Can you explain the use of the nav and aside elements in HTML5?

**Definition:**

</details>

<details>
<summary>How do you use the figure and figcaption elements?</summary>

### How do you use the figure and figcaption elements?

**Definition:**

</details>

### Tables

<details>
<summary>How do you create a table in HTML?</summary>

### How do you create a table in HTML?

**Definition:**

</details>

<details>
<summary>What are thead, tbody, and tfoot in a table?</summary>

### What are thead, tbody, and tfoot in a table?

**Definition:**

</details>

<details>
<summary>What is a colspan and rowspan?</summary>

### What is a colspan and rowspan?

**Definition:**

</details>

<details>
<summary>How do you make a table accessible?</summary>

### How do you make a table accessible?

**Definition:**

</details>

<details>
<summary>How can tables be made responsive?</summary>

### How can tables be made responsive?

**Definition:**

</details>

### Media in HTML

<details>
<summary>How do you add audio and video to an HTML document?</summary>

### How do you add audio and video to an HTML document?

**Definition:**

</details>

<details>
<summary>What are the attributes of the video and audio elements?</summary>

### What are the attributes of the video and audio elements?

**Definition:**

</details>

<details>
<summary>How do you provide subtitles or captions for video content in HTML?</summary>

### How do you provide subtitles or captions for video content in HTML?

**Definition:**

</details>

<details>
<summary>What’s the difference between embedding and linking media?</summary>

### What’s the difference between embedding and linking media?

**Definition:**

</details>

### Responsive Design and Media Queries

<details>
<summary>What is a viewport and how can you set it?</summary>

### What is a viewport and how can you set it?

**Definition:**

</details>

<details>
<summary>Can you describe the use of media queries in HTML?</summary>

### Can you describe the use of media queries in HTML?

**Definition:**

</details>

<details>
<summary>How do you create responsive images with different resolutions for different devices?</summary>

### How do you create responsive images with different resolutions for different devices?

**Definition:**

</details>

<details>
<summary>What is responsive web design?</summary>

### What is responsive web design?

**Definition:**

</details>

<details>
<summary>How do flexbox and grids help in creating responsive layouts?</summary>

### How do flexbox and grids help in creating responsive layouts?

**Definition:**

</details>

### Accessibility

<details>
<summary>What is accessibility and why is it important in web development?</summary>

### What is accessibility and why is it important in web development?

**Definition:**

</details>

<details>
<summary>How do you make a website accessible?</summary>

### How do you make a website accessible?

**Definition:**

</details>

<details>
<summary>What are ARIA roles and how do you use them?</summary>

### What are ARIA roles and how do you use them?

**Definition:**

</details>

<details>
<summary>Explain how to use the tabindex attribute.</summary>

### Explain how to use the tabindex attribute.

**Definition:**

</details>

<details>
<summary>How do you ensure your images are accessible?</summary>

### How do you ensure your images are accessible?

**Definition:**

</details>

### Linking and Navigation Techniques

<details>
<summary>How do you make a navigation bar in HTML?</summary>

### How do you make a navigation bar in HTML?

**Definition:**

</details>

<details>
<summary>What’s the significance of breadcrumb navigation?</summary>

### What’s the significance of breadcrumb navigation?

**Definition:**

</details>

<details>
<summary>How do you create a dropdown menu in HTML?</summary>

### How do you create a dropdown menu in HTML?

**Definition:**

</details>

<details>
<summary>Explain the use of the target attribute in a link.</summary>

### Explain the use of the target attribute in a link.

**Definition:**

</details>

<details>
<summary>How do you create a slidedown menu?</summary>

### How do you create a slidedown menu?

**Definition:**

</details>

### Advanced HTML Technologies

<details>
<summary>What are Web Components and how are they used?</summary>

### What are Web Components and how are they used?

**Definition:**

</details>

<details>
<summary>What is Shadow DOM and how do you use it?</summary>

### What is Shadow DOM and how do you use it?

**Definition:**

</details>

<details>
<summary>How do you create a custom HTML element?</summary>

### How do you create a custom HTML element?

**Definition:**

</details>

<details>
<summary>Explain HTML templates and their use cases.</summary>

### Explain HTML templates and their use cases.

**Definition:**

</details>

<details>
<summary>How do you use server-sent events?</summary>

### How do you use server-sent events?

**Definition:**

</details>

### SEO and HTML

<details>
<summary>How do you optimize HTML for search engines?</summary>

### How do you optimize HTML for search engines?

**Definition:**

</details>

<details>
<summary>What is semantic HTML and how does it relate to SEO?</summary>

### What is semantic HTML and how does it relate to SEO?

**Definition:**

</details>

<details>
<summary>Explain the significance of heading tags for SEO.</summary>

### Explain the significance of heading tags for SEO.

**Definition:**

</details>

<details>
<summary>How do structured data and schemas enhance SEO?</summary>

### How do structured data and schemas enhance SEO?

**Definition:**

</details>

<details>
<summary>What are the best practices for using HTML with SEO?</summary>

### What are the best practices for using HTML with SEO?

**Definition:**

</details>

### HTML APIs

<details>
<summary>What is the Geolocation API and how is it used?</summary>

### What is the Geolocation API and how is it used?

**Definition:**

</details>

<details>
<summary>How do you utilize local storage and session storage in HTML?</summary>

### How do you utilize local storage and session storage in HTML?

**Definition:**

</details>

<details>
<summary>Can you describe the use of the Drag and Drop API?</summary>

### Can you describe the use of the Drag and Drop API?

**Definition:**

</details>

<details>
<summary>What is the Fullscreen API and why would you use it?</summary>

### What is the Fullscreen API and why would you use it?

**Definition:**

</details>

### Internationalization

<details>
<summary>How do you handle character encoding in HTML?</summary>

### How do you handle character encoding in HTML?

**Definition:**

</details>

<details>
<summary>What is the lang attribute and its importance in HTML?</summary>

### What is the lang attribute and its importance in HTML?

**Definition:**

</details>

<details>
<summary>How do you accommodate left-to-right and right-to-left language support in HTML?</summary>

### How do you accommodate left-to-right and right-to-left language support in HTML?

**Definition:**

</details>

### HTML and Web Development Tools

<details>
<summary>How do you validate HTML?</summary>

### How do you validate HTML?

**Definition:**

</details>

<details>
<summary>What are the benefits of using an HTML preprocessor like Pug (Jade)?</summary>

### What are the benefits of using an HTML preprocessor like Pug (Jade)?

**Definition:**

</details>

<details>
<summary>How does a templating engine work with HTML?</summary>

### How does a templating engine work with HTML?

**Definition:**

</details>

<details>
<summary>What are browser developer tools, and how do you use them with HTML?</summary>

### What are browser developer tools, and how do you use them with HTML?

**Definition:**

</details>

### HTML Best Practices

<details>
<summary>What are some common bad practices in HTML?</summary>

### What are some common bad practices in HTML?

**Definition:**

</details>

<details>
<summary>How can you ensure that your HTML code follows best practices?</summary>

### How can you ensure that your HTML code follows best practices?

**Definition:**

</details>

<details>
<summary>What are the benefits of minifying HTML documents?</summary>

### What are the benefits of minifying HTML documents?

**Definition:**

</details>

<details>
<summary>How do you optimize the loading time of an HTML page?</summary>

### How do you optimize the loading time of an HTML page?

**Definition:**

</details>

### HTML Frameworks and Libraries

<details>
<summary>What are some popular CSS frameworks that can be integrated with HTML?</summary>

### What are some popular CSS frameworks that can be integrated with HTML?

**Definition:**

</details>

<details>
<summary>How do frameworks like Bootstrap simplify HTML development?</summary>

### How do frameworks like Bootstrap simplify HTML development?

**Definition:**

</details>

<details>
<summary>Can you name some JavaScript libraries that enhance HTML interactivity?</summary>

### Can you name some JavaScript libraries that enhance HTML interactivity?

**Definition:**

</details>

### Advanced HTML Topics

<details>
<summary>What are data visualizations in HTML and how can they be implemented?</summary>

### What are data visualizations in HTML and how can they be implemented?

**Definition:**

</details>

<details>
<summary>Can you explain how progressive enhancement is applied in HTML?</summary>

### Can you explain how progressive enhancement is applied in HTML?

**Definition:**

</details>

<details>
<summary>How are HTML, CSS, and JavaScript interconnected in web development?</summary>

### How are HTML, CSS, and JavaScript interconnected in web development?

**Definition:**

</details>

<details>
<summary>Discuss the importance of documentation in HTML.</summary>

### Discuss the importance of documentation in HTML.

**Definition:**

</details>

### HTML 5.1, 5.2, and Beyond

<details>
<summary>What updates were introduced in HTML 5.1 and 5.2?</summary>

### What updates were introduced in HTML 5.1 and 5.2?

**Definition:**

</details>

<details>
<summary>What future updates do you see coming for HTML?</summary>

### What future updates do you see coming for HTML?

**Definition:**

</details>

<details>
<summary>How does HTML continue to evolve with web standards?</summary>

### How does HTML continue to evolve with web standards?

**Definition:**

</details>

<details>
<summary>What is the Living Standard and how does HTML adhere to it?</summary>

### What is the Living Standard and how does HTML adhere to it?

**Definition:**

</details>

### HTML Challenges and Real-world Scenarios

<details>
<summary>How do you handle multiple browser support and compatibility issues with HTML?</summary>

### How do you handle multiple browser support and compatibility issues with HTML?

**Definition:**

</details>
