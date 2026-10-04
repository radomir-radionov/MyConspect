# CSS — Interview

CSS interview questions. Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./2_css.md)

### Related docs

* [CSS — Core](./2_css_core.md) · [CSS — Layout](./2_css_layout.md) · [CSS — Visual](./2_css_visual.md) · [CSS — Motion](./2_css_motion.md) · [CSS — Modern](./2_css_modern.md) · [CSS — Architecture](./2_css_architecture.md) · [CSS — Interview](./2_css_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — CSS](https://devinterview.io/questions/web-and-mobile-development/css-interview-questions/).

### CSS Basics

<details>
<summary>What does CSS stand for and what is its primary use?</summary>

### What does CSS stand for and what is its primary use?

**Definition:**

CSS is Cascading Style Sheets. It describes presentation — color, type, spacing, and layout — separately from the HTML that names the content.

**How it works:**

- A rule is a selector plus declarations. The selector names the elements. Each declaration is a property and a value, such as `color: #1a1a1a`.
- The cascade decides the winner when several rules match: origin, importance, specificity, then source order.
- One stylesheet can serve many pages, so a color change does not require an edit in every document.
- The same HTML can be restyled for print, a narrow screen, or a high-contrast theme without rewriting the content.
- CSS does not add the paragraph or the heading. It only paints the elements HTML already defined.

**Examples:**

```css
article h1 {
  font-size: 1.5rem;
  color: #14213d;
}
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS

</details>

<details>
<summary>How do you include CSS in your HTML document?</summary>

### How do you include CSS in your HTML document?

**Definition:**

CSS reaches a page in four ways: a linked file, a `style` element, a `style` attribute, or `@import`. A linked file is the one you keep for a real site.

**How it works:**

- External: `<link rel="stylesheet" href="/styles/app.css">` in `head`. The file is cached and shared.
- Embedded: a `style` element, usually in `head`, holds rules for that document only.
- Inline: `style="color: navy"` on one element. Specificity is high, so later stylesheets struggle to override it.
- `@import` inside a sheet or a `style` element loads another sheet. It adds a request chain; prefer another `link`.
- Specificity, reuse, and who can edit the rule all change with the method. Inline wins often and is the hardest to reuse.
- Pick one main method. A page that mixes all four is difficult to debug.
- Inline is reasonable for a value that truly belongs to one element, such as a position computed in script.

**Examples:**

```html
<head>
  <link rel="stylesheet" href="/styles/app.css">
  <style>
    .notice { border: 1px solid #ccc; }
  </style>
</head>
<body>
  <p style="color: #333">Pier 4 is open.</p>
</body>
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link
- https://developer.mozilla.org/en-US/docs/Web/CSS/@import

</details>

<details>
<summary>Can you explain the difference between class and ID selectors?</summary>

### Can you explain the difference between class and ID selectors?

**Definition:**

A class marks a group. An id marks one element in the document. The CSS selectors are `.name` and `#name`, and they differ in specificity and in the HTML rule behind them.

**How it works:**

- `.lane` matches every element with `class="lane"`. One element may carry several classes.
- `#pier-4` matches the element whose `id` is `pier-4`. An id must be unique in the document. Repeating it is invalid HTML, even if a browser still styles both.
- Specificity: an id beats a class, which beats an element selector. That is why an id rule is hard to override without another id or `!important`.
- Use classes for shared look: buttons, cards, status colors.
- Use an id when something must be unique for a fragment link or for `getElementById`. Prefer a class when the only goal is styling.
- Selector speed is not a reason to pick one. Modern engines do not make id selectors meaningfully faster for page CSS.

**Examples:**

```html
<p class="note">Tide at 06:10.</p>
<p class="note" id="pier-4">Pier 4 is full.</p>
```

```css
.note { color: #1d3557; }
#pier-4 { font-weight: 700; }
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Class_selectors
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/ID_selectors

</details>

<details>
<summary>What are pseudo-classes in CSS?</summary>

### What are pseudo-classes in CSS?

**Definition:**

A pseudo-class matches an element by state, position, or language, not by an extra class in the HTML. It is written with a single colon: `a:hover`.

**How it works:**

- Action and UI state: `:hover`, `:focus`, `:focus-visible`, `:active`.
- Form state: `:checked`, `:enabled`, `:disabled`, `:required`, `:optional`, `:valid`, `:invalid`, `:default`.
- Tree position: `:first-child`, `:last-child`, `:nth-child()`, `:only-child`, `:empty`.
- Language and direction: `:lang(ru)`, `:dir(rtl)`.
- Negation and relations: `:not()`, `:is()`, `:where()`, `:has()`.
- A pseudo-class is a condition on a real element. A pseudo-element (`::before`) styles a fragment that is not its own element.
- `:hover` alone is not enough for keyboard users. Pair the important states with `:focus-visible`.

**Examples:**

```css
button:disabled { opacity: 0.5; }
tr:nth-child(odd) { background: #f6f7f8; }
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Pseudo-classes

</details>

<details>
<summary>Describe how to implement a CSS reset and why it is useful.</summary>

### Describe how to implement a CSS reset and why it is useful.

**Definition:**

A CSS reset flattens built-in browser styles so your rules start from the same place in every engine. A normalize stylesheet is the milder cousin: it keeps useful defaults and only fixes disagreements.

**How it works:**

- Engines ship different margins on `body` and headings, different list markers, and different form controls. A layout that depends on those defaults shifts between browsers.
- A reset typically zeroes margin and padding, sets a common `box-sizing`, and removes list markers you intend to draw yourself.
- Load it first, before the site sheet, so later rules override it on purpose.
- `box-sizing: border-box` on `*`, or on `*, *::before, *::after`, stops padding from blowing up a stated width. That is a reset concern, not a separate mystery.
- A reset is not a design. Headings become plain text until you style them.
- Prefer a small reset you understand, or a maintained normalize, over pasting a huge sheet you never read.

**Examples:**

```css
*, *::before, *::after { box-sizing: border-box; }
body, h1, p, ul { margin: 0; }
ul { padding: 0; list-style: none; }
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Cascade
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-sizing

</details>

### Selectors and Combinators

<details>
<summary>How do you select elements by attribute in CSS?</summary>

### How do you select elements by attribute in CSS?

**Definition:**

An attribute selector matches elements by an attribute’s presence or value. It is written in square brackets and combines with type, class, and pseudo-classes.

**How it works:**

- `[href]` matches any element that has the attribute.
- `[type="email"]` is an exact value match.
- `[href^="https"]` starts with, `[href$=".pdf"]` ends with, `[href*="cdn"]` contains.
- `[class~="lane"]` matches a space-separated token. `[lang|="en"]` matches `en` or `en-GB`.
- Adding `i` before the closing bracket makes the value comparison case-insensitive: `[type="email" i]`. The `s` flag forces case-sensitive comparison.
- They are useful when the hook already exists in HTML, such as `target`, `disabled`, or `data-status`, and you would rather not add a class.
- They have the same specificity as a class. Quoting the value is the safe form when it contains spaces or special characters.

**Examples:**

```css
a[href^="https"]::after { content: " ↗"; }
[data-status="held"] { opacity: 0.55; }
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Attribute_selectors

</details>

<details>
<summary>What is a pseudo-element, and what are they used for?</summary>

### What is a pseudo-element, and what are they used for?

**Definition:**

A pseudo-element styles a part of an element that has no tag of its own, or it generates a box. The current syntax uses two colons: `p::first-letter`.

**How it works:**

- `::before` and `::after` insert generated boxes. They appear only when `content` is set, even to an empty string.
- `::first-line` and `::first-letter` style a slice of the text. `::selection` styles the highlight the user drags. `::placeholder` styles input hint text. `::marker` styles a list marker.
- Generated content is not a substitute for real text. Screen readers may skip or announce `content` inconsistently, so do not put the only copy of a label there.
- Typical uses: a decorative mark on an external link, a drop cap, quotation marks on a `blockquote`, a custom checkbox drawn over the native control, and a clearfix (`::after { content: ""; display: block; clear: both; }`).
- One colon (`:before`) is the old syntax. It still works for the original set; new pseudo-elements need two colons.
- You cannot select the text inside `content` from the DOM. It is not an element.

**Examples:**

```css
.external::after {
  content: " ↗";
}
.quote::before {
  content: "“";
}
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Pseudo-elements

</details>

<details>
<summary>Explain the difference between the child combinator and the descendant combinator.</summary>

### Explain the difference between the child combinator and the descendant combinator.

**Definition:**

The child combinator `>` matches one level down. The descendant combinator is a space and matches any depth. The tilde `~` is the general sibling combinator, not the descendant combinator.

**How it works:**

- `ul > li` matches an `li` whose parent is that `ul`. An `li` inside a nested list is not a child of the outer `ul`.
- `nav a` matches every `a` inside `nav`, however deep.
- A descendant selector is easy to make too wide: `div a` can restyle links you did not mean to touch.
- Prefer the child combinator when the structure is known and you want to leave nested regions alone.
- Specificity is the sum of the two sides. The combinator itself adds none.
- More specific is not automatically faster. Choose the combinator that matches the tree you mean.

**Examples:**

```css
nav > a { font-weight: 700; }
nav a { text-decoration: none; }
```

```html
<nav>
  <a href="/tides">Tides</a>
  <div><a href="/pier">Pier</a></div>
</nav>
```

The first rule styles only “Tides”. The second styles both links.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Child_combinator
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Descendant_combinator

</details>

<details>
<summary>How would you select all direct children elements of a particular type?</summary>

### How would you select all direct children elements of a particular type?

**Definition:**

Pair the parent, the child combinator, and the child type: `ul > li`. That list is only the `li` elements whose parent is that `ul`.

**How it works:**

- The right-hand type can be any element, a class, or an attribute: `menu > .item`, `form > button`.
- A nested list’s items do not match `ul > li` on the outer list, because their parent is the inner `ul`.
- `ul li` without `>` would include those nested items. Use it only when that is what you want.
- To style every direct child regardless of type, use `ul > *`.

**Examples:**

```css
.menu > li { padding-block: 0.25rem; }
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Child_combinator

</details>

<details>
<summary>What are the universal selector and the sibling combinator, and when would you use them?</summary>

### What are the universal selector and the sibling combinator, and when would you use them?

**Definition:**

The universal selector `*` matches every element. Sibling combinators match elements that share a parent: `+` is the next sibling, `~` is any following sibling.

**How it works:**

- `*` is reasonable in a narrow reset, such as `*, *::before, *::after { box-sizing: border-box; }`, or as `.card > *` when every direct child should lose its default margin.
- A bare `*` on a large document matches a lot. Scope it to a parent when you can.
- `h2 + p` styles a paragraph that immediately follows an `h2`.
- `h2 ~ p` styles every paragraph that follows an `h2` under the same parent, not only the next one.
- Siblings must share a parent. A combinator does not reach into a child or backward to a previous sibling.
- They fit patterns such as “the field after this checkbox” or “every panel after the heading,” without adding classes.
- A structure that only works because of a fragile `+` chain is a sign the markup should carry a class instead.

**Examples:**

```css
.card > * { margin: 0; }
label + input { margin-inline-start: 0.5rem; }
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Universal_selectors
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Next-sibling_combinator
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Subsequent-sibling_combinator

</details>

### Box Model and Layout

<details>
<summary>What is the CSS Box Model?</summary>

### What is the CSS Box Model?

**Definition:**

Every element box is four nested areas: content, padding, border, and margin. Width and height refer to different parts of that stack depending on `box-sizing`.

**How it works:**

- Content is the text or the replaced object. Padding is the transparent gap inside the border. The border is the edge. Margin is the gap outside the border, shared with neighbors.
- Backgrounds paint the content, padding, and border (under a transparent border). Margin is never painted.
- With the initial `box-sizing: content-box`, a stated width is only the content. Padding and border are added outside it.
- With `border-box`, the stated width includes content, padding, and border. Margin stays outside either way.
- Horizontal `margin: auto` on a block that has a width narrower than its container centers that block.
- Parent and child boxes add up. A child’s margin can collapse with the parent’s margin when nothing separates them. That interaction is margin collapsing, not a bug in the width.
- Outlines and shadows sit outside the border and do not take space in the layout the way margin does.

**Examples:**

```css
.card {
  box-sizing: border-box;
  width: 20rem;
  padding: 1rem;
  border: 1px solid #ccc;
  margin-block: 1rem;
}
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Introduction_to_the_CSS_box_model

</details>

<details>
<summary>Explain margin collapsing.</summary>

### Explain margin collapsing.

**Definition:**

Adjoining vertical margins of block boxes in normal flow combine into one margin. The used value is the larger of the two, or the sum when one margin is negative. Horizontal margins do not collapse.

**How it works:**

- Adjacent siblings: the bottom margin of one block and the top margin of the next become a single gap.
- Parent and first or last child: if the parent has no padding, border, or inline content separating them, the child’s margin sticks out through the parent.
- Empty blocks can collapse their own top and bottom margins through themselves.
- No collapse inside flex or grid formatting contexts, on floats, or on inline-block boxes.
- The root element’s margin does not collapse with the body in the way people sometimes expect; `body` margin is the usual source of the gap around a page.
- To keep both margins, separate the boxes: padding or border on the parent, `overflow` other than `visible`, or `display: flow-root` to make a new block formatting context.
- Collapsing is why two `1rem` paragraph margins do not become a `2rem` gap.

**Examples:**

```css
p { margin-block: 1rem; }
.panel { padding-block: 1px; }
```

Two paragraphs show a 1rem gap, not 2rem. The padding on `.panel` stops a child’s margin from escaping the panel.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing

</details>

<details>
<summary>What are the different values for the box-sizing property and what do they do?</summary>

### What are the different values for the box-sizing property and what do they do?

**Definition:**

`box-sizing` chooses whether a stated width and height include the padding and border. The two values that change the box are `content-box` and `border-box`.

**How it works:**

- `content-box` is the initial value. Width and height are the content box. Padding and border are added outside, so the border edge is wider than the number you set.
- `border-box` includes content, padding, and border in that number. Adding padding shrinks the content box instead of growing the element.
- Margin is outside the width in both values.
- `initial` is the CSS-wide keyword that restores the property’s initial value, which is `content-box`. It is not a third sizing model.
- A global `border-box` reset (`*, *::before, *::after`) makes percentages and layout math match the size you think you set.
- Replaced elements such as images have their own sizing rules on top of this.

**Examples:**

```css
.field {
  box-sizing: border-box;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #999;
}
```

The control stays within the parent. The same width with `content-box` would overflow by the padding and the border.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-sizing

</details>

<details>
<summary>How do you center a block element with CSS?</summary>

### How do you center a block element with CSS?

**Definition:**

A block narrower than its container is centered on the inline axis with `margin-inline: auto`. Vertical centering is a job for flex or grid on the parent, not for auto margins on a normal block.

**How it works:**

- Auto margins need a definite leftover space. Set a width (or `max-width`) smaller than the container, then `margin-inline: auto`. `margin: 0 auto` is the horizontal form.
- A block that stretches to 100% has no leftover space, so auto margins do nothing visible.
- Flex: `display: flex; justify-content: center` centers children on the main axis. With the default row direction that is horizontal. `align-items: center` centers on the cross axis.
- Grid: `display: grid; place-items: center` centers the child both ways in the cell.
- Text inside a block is centered with `text-align: center`. That does not center the block itself.
- Absolute positioning with `inset: 0; margin: auto` and a set size also centers, and it takes the element out of flow. Use it when the overlay is the point.

**Examples:**

```css
.dialog {
  width: min(32rem, 100%);
  margin-inline: auto;
}
.stage {
  display: grid;
  place-items: center;
  min-height: 100vh;
}
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_alignment

</details>

<details>
<summary>What is the difference between block, inline, and inline-block elements?</summary>

### What is the difference between block, inline, and inline-block elements?

**Definition:**

`display` decides whether a box breaks the line, how wide it grows, and which sizes apply. `block`, `inline`, and `inline-block` are three different answers.

**How it works:**

- `block` starts on a new line in normal flow and stretches to the containing block’s width. Width, height, and vertical margins apply. Examples: `div`, `p`, `h1`, unless you change them.
- `inline` sits in the line with the text. Width and height do not apply. Vertical margin does not apply; horizontal margin and padding do. Examples: `span`, `a`, `strong`.
- `inline-block` sits in the line like inline, but width, height, padding, and vertical margin apply as they do on a block. The baseline alignment can leave a gap under the box; `vertical-align` adjusts it.
- Changing `display` does not change the element’s meaning. A `span` set to `block` is still not a heading.
- Flex and grid items use yet another display role. A flex item’s `display: inline` does not keep it inline inside the flex container.

**Examples:**

```html
<div class="block">Full line</div>
<span class="inline">In the sentence</span>
<span class="chip">Sized chip</span>
```

```css
.chip {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #e8eef5;
}
```

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/display
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_display/Introduction_to_formatting_contexts

</details>

### Positioning and Stacking Contexts

<details>
<summary>Explain the different values for the position property.</summary>

### Explain the different values for the position property.

**Definition:**

</details>

<details>
<summary>Describe z-index and how stacking order is controlled in CSS.</summary>

### Describe z-index and how stacking order is controlled in CSS.

**Definition:**

</details>

<details>
<summary>How do you create a sticky footer with CSS?</summary>

### How do you create a sticky footer with CSS?

**Definition:**

</details>

<details>
<summary>Can you explain how to create a fixed header that remains at the top on scroll?</summary>

### Can you explain how to create a fixed header that remains at the top on scroll?

**Definition:**

</details>

<details>
<summary>When would you use position: sticky?</summary>

### When would you use position: sticky?

**Definition:**

</details>

### Styling Text and Fonts

<details>
<summary>How do you change the font of text in CSS?</summary>

### How do you change the font of text in CSS?

**Definition:**

</details>

<details>
<summary>What is a web-safe font?</summary>

### What is a web-safe font?

**Definition:**

</details>

<details>
<summary>When would you use a font shorthand property?</summary>

### When would you use a font shorthand property?

**Definition:**

</details>

<details>
<summary>How can you include and use custom fonts on a webpage?</summary>

### How can you include and use custom fonts on a webpage?

**Definition:**

</details>

<details>
<summary>What is the difference between em and rem units?</summary>

### What is the difference between em and rem units?

**Definition:**

</details>

### Colors, Backgrounds, and Gradients

<details>
<summary>How do you add a background image to an element?</summary>

### How do you add a background image to an element?

**Definition:**

</details>

<details>
<summary>What is the difference between hex codes, RGB, and named color values?</summary>

### What is the difference between hex codes, RGB, and named color values?

**Definition:**

</details>

<details>
<summary>What are alpha transparency and RGBA?</summary>

### What are alpha transparency and RGBA?

**Definition:**

</details>

<details>
<summary>How do you create a gradient background with CSS?</summary>

### How do you create a gradient background with CSS?

**Definition:**

</details>

<details>
<summary>Explain how to implement multiple backgrounds on a single element.</summary>

### Explain how to implement multiple backgrounds on a single element.

**Definition:**

</details>

### Flexbox

<details>
<summary>Describe Flexbox and its advantages.</summary>

### Describe Flexbox and its advantages.

**Definition:**

</details>

<details>
<summary>How does flex-grow work?</summary>

### How does flex-grow work?

**Definition:**

</details>

<details>
<summary>Explain the difference between justify-content and align-items.</summary>

### Explain the difference between justify-content and align-items.

**Definition:**

</details>

<details>
<summary>When would you use align-self?</summary>

### When would you use align-self?

**Definition:**

</details>

<details>
<summary>How do you create equal-width columns using Flexbox?</summary>

### How do you create equal-width columns using Flexbox?

**Definition:**

</details>

### CSS Grid

<details>
<summary>What is the CSS Grid layout, and why is it useful?</summary>

### What is the CSS Grid layout, and why is it useful?

**Definition:**

</details>

<details>
<summary>How do you define grid columns and rows?</summary>

### How do you define grid columns and rows?

**Definition:**

</details>

<details>
<summary>What is the difference between grid-template-areas and grid-template-columns?</summary>

### What is the difference between grid-template-areas and grid-template-columns?

**Definition:**

</details>

<details>
<summary>How do you place items in the CSS Grid layout?</summary>

### How do you place items in the CSS Grid layout?

**Definition:**

</details>

<details>
<summary>How is overlapping of grid items handled in CSS Grid?</summary>

### How is overlapping of grid items handled in CSS Grid?

**Definition:**

</details>

### Responsive Design and Media Queries

<details>
<summary>What is a media query?</summary>

### What is a media query?

**Definition:**

</details>

<details>
<summary>How does the viewport meta tag assist with mobile responsive designs?</summary>

### How does the viewport meta tag assist with mobile responsive designs?

**Definition:**

</details>

<details>
<summary>Describe how to create a mobile-first responsive design.</summary>

### Describe how to create a mobile-first responsive design.

**Definition:**

</details>

<details>
<summary>How can you build a layout that changes from a two-column to a single-column with media queries?</summary>

### How can you build a layout that changes from a two-column to a single-column with media queries?

**Definition:**

</details>

<details>
<summary>Explain the use of min-width and max-width in media queries.</summary>

### Explain the use of min-width and max-width in media queries.

**Definition:**

</details>

### Transitions and Animations

<details>
<summary>How do you create a CSS transition?</summary>

### How do you create a CSS transition?

**Definition:**

</details>

<details>
<summary>What is the difference between a CSS transition and animation?</summary>

### What is the difference between a CSS transition and animation?

**Definition:**

</details>

<details>
<summary>How do you animate an item's entrance and exit on the page?</summary>

### How do you animate an item's entrance and exit on the page?

**Definition:**

</details>

<details>
<summary>Can you explain how to use @keyframes?</summary>

### Can you explain how to use @keyframes?

**Definition:**

</details>

<details>
<summary>How do you set the timing functions in CSS animations?</summary>

### How do you set the timing functions in CSS animations?

**Definition:**

</details>

### Advanced CSS Techniques

<details>
<summary>What is a CSS preprocessor and why would you use one?</summary>

### What is a CSS preprocessor and why would you use one?

**Definition:**

</details>

<details>
<summary>Describe the importance of using CSS variables (custom properties).</summary>

### Describe the importance of using CSS variables (custom properties).

**Definition:**

</details>

<details>
<summary>How do you use CSS modules?</summary>

### How do you use CSS modules?

**Definition:**

</details>

<details>
<summary>Can you explain the concept of CSS-in-JS?</summary>

### Can you explain the concept of CSS-in-JS?

**Definition:**

</details>

<details>
<summary>What tools would you use for CSS linting and formatting?</summary>

### What tools would you use for CSS linting and formatting?

**Definition:**

</details>

### Styling Forms and User Interfaces

<details>
<summary>How do you style a submit button to appear as a regular link?</summary>

### How do you style a submit button to appear as a regular link?

**Definition:**

</details>

<details>
<summary>How can you create custom checkboxes and radio buttons with CSS?</summary>

### How can you create custom checkboxes and radio buttons with CSS?

**Definition:**

</details>

<details>
<summary>Describe how to style a dropdown select box without JavaScript.</summary>

### Describe how to style a dropdown select box without JavaScript.

**Definition:**

</details>

<details>
<summary>What is the best practice for styling placeholder text of an input field?</summary>

### What is the best practice for styling placeholder text of an input field?

**Definition:**

</details>

<details>
<summary>How do you implement focus styles for accessibility?</summary>

### How do you implement focus styles for accessibility?

**Definition:**

</details>

### Layout Debugging and Troubleshooting

<details>
<summary>How do you diagnose and solve layout issues?</summary>

### How do you diagnose and solve layout issues?

**Definition:**

</details>

<details>
<summary>Can you explain how to fix a layout that has unexpectedly broken columns?</summary>

### Can you explain how to fix a layout that has unexpectedly broken columns?

**Definition:**

</details>

<details>
<summary>Describe approaches to resolving common browser compatibility issues in CSS.</summary>

### Describe approaches to resolving common browser compatibility issues in CSS.

**Definition:**

</details>

<details>
<summary>How would you determine which styles are applied to an element when multiple styles collide?</summary>

### How would you determine which styles are applied to an element when multiple styles collide?

**Definition:**

</details>

<details>
<summary>What common CSS problems might cause performance issues?</summary>

### What common CSS problems might cause performance issues?

**Definition:**

</details>

### CSS 3D Transforms and Visual Effects

<details>
<summary>How do you utilize 3D transforms in CSS?</summary>

### How do you utilize 3D transforms in CSS?

**Definition:**

</details>

<details>
<summary>Explain how to use the perspective property in CSS.</summary>

### Explain how to use the perspective property in CSS.

**Definition:**

</details>

<details>
<summary>What is backface visibility?</summary>

### What is backface visibility?

**Definition:**

</details>

<details>
<summary>How do you create a flip card effect using CSS?</summary>

### How do you create a flip card effect using CSS?

**Definition:**

</details>

<details>
<summary>What are some examples of visual effects you can achieve with CSS filters?</summary>

### What are some examples of visual effects you can achieve with CSS filters?

**Definition:**

</details>

### Layout and Design Principles

<details>
<summary>What are the principles of responsive web design?</summary>

### What are the principles of responsive web design?

**Definition:**

</details>

<details>
<summary>How would you approach designing a grid system with CSS?</summary>

### How would you approach designing a grid system with CSS?

**Definition:**

</details>

<details>
<summary>Describe the principle of "mobile-first" design.</summary>

### Describe the principle of "mobile-first" design.

**Definition:**

</details>

<details>
<summary>What are some techniques for maintaining aspect ratios in responsive designs?</summary>

### What are some techniques for maintaining aspect ratios in responsive designs?

**Definition:**

</details>

<details>
<summary>How do you ensure your design is accessible and inclusive?</summary>

### How do you ensure your design is accessible and inclusive?

**Definition:**

</details>

### Print Stylesheets and CSS for Print

<details>
<summary>How do you create a print stylesheet for your web page?</summary>

### How do you create a print stylesheet for your web page?

**Definition:**

</details>

<details>
<summary>What are the common best practices when creating CSS for print?</summary>

### What are the common best practices when creating CSS for print?

**Definition:**

</details>

<details>
<summary>Explain the use of page-break in CSS.</summary>

### Explain the use of page-break in CSS.

**Definition:**

</details>

<details>
<summary>How can you test the print version of your web page?</summary>

### How can you test the print version of your web page?

**Definition:**

</details>

<details>
<summary>What are some challenges when designing CSS for print?</summary>

### What are some challenges when designing CSS for print?

**Definition:**

</details>

### Pseudo-Elements and Pseudo-Classes

<details>
<summary>Describe the purpose of the ::before and ::after pseudo-elements.</summary>

### Describe the purpose of the ::before and ::after pseudo-elements.

**Definition:**

</details>

<details>
<summary>What is the :hover pseudo-class and how does it work?</summary>

### What is the :hover pseudo-class and how does it work?

**Definition:**

</details>

<details>
<summary>Explain the difference between :nth-child and :nth-of-type.</summary>

### Explain the difference between :nth-child and :nth-of-type.

**Definition:**

</details>

<details>
<summary>How do :first-child and :last-child work?</summary>

### How do :first-child and :last-child work?

**Definition:**

</details>

<details>
<summary>What is the :not pseudo-class and when would you use it?</summary>

### What is the :not pseudo-class and when would you use it?

**Definition:**

</details>

### CSS Performance Optimization

<details>
<summary>How does the complexity of selectors impact performance?</summary>

### How does the complexity of selectors impact performance?

**Definition:**

</details>

<details>
<summary>What strategies would you use to optimize the rendering path of CSS?</summary>

### What strategies would you use to optimize the rendering path of CSS?

**Definition:**

</details>

<details>
<summary>How do you minimize CSS repaints and reflows?</summary>

### How do you minimize CSS repaints and reflows?

**Definition:**

</details>

<details>
<summary>What are some of the best practices for writing efficient CSS?</summary>

### What are some of the best practices for writing efficient CSS?

**Definition:**

</details>

<details>
<summary>How do you optimize CSS for critical rendering path and fast load times?</summary>

### How do you optimize CSS for critical rendering path and fast load times?

**Definition:**

</details>

### Scalable and Maintainable CSS

<details>
<summary>What is Object-Oriented CSS (OOCSS)?</summary>

### What is Object-Oriented CSS (OOCSS)?

**Definition:**

</details>

<details>
<summary>Can you explain the BEM (Block Element Modifier) naming convention?</summary>

### Can you explain the BEM (Block Element Modifier) naming convention?

**Definition:**

</details>

<details>
<summary>What are the advantages of using a CSS framework like Bootstrap or TailwindCSS?</summary>

### What are the advantages of using a CSS framework like Bootstrap or TailwindCSS?

**Definition:**

</details>

<details>
<summary>How do you ensure CSS scalability and maintainability in a large project?</summary>

### How do you ensure CSS scalability and maintainability in a large project?

**Definition:**

</details>

<details>
<summary>What are some CSS architecture approaches for large-scale applications?</summary>

### What are some CSS architecture approaches for large-scale applications?

**Definition:**

</details>

### CSS Special Cases and Practical Scenarios

<details>
<summary>How would you create a CSS-only hamburger menu toggle?</summary>

### How would you create a CSS-only hamburger menu toggle?

**Definition:**

</details>

<details>
<summary>Explain how to make a pure CSS carousel or slider.</summary>

### Explain how to make a pure CSS carousel or slider.

**Definition:**

</details>

<details>
<summary>How do you create a masonry layout with CSS?</summary>

### How do you create a masonry layout with CSS?

**Definition:**

</details>

<details>
<summary>How would you apply CSS to a web application that should print as well as display on screen?</summary>

### How would you apply CSS to a web application that should print as well as display on screen?

**Definition:**

</details>

<details>
<summary>How do you create a seamless waterfall flow of elements in a responsive design?</summary>

### How do you create a seamless waterfall flow of elements in a responsive design?

**Definition:**

</details>
