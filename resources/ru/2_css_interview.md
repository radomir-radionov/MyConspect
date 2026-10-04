# CSS — Interview

Вопросы для собеседования по CSS. Ответы заполнены для опубликованной части, остальные пустые.

[← Вернуться в центр](./2_css.md)

### Related docs

* [CSS — Core](./2_css_core.md) · [CSS — Layout](./2_css_layout.md) · [CSS — Visual](./2_css_visual.md) · [CSS — Motion](./2_css_motion.md) · [CSS — Modern](./2_css_modern.md) · [CSS — Архитектура](./2_css_architecture.md) · [CSS — Интервью](./2_css_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Вопросы из [Devinterview.io — CSS](https://devinterview.io/questions/web-and-mobile-development/css-interview-questions/).

### CSS Basics

<details>
<summary>What does CSS stand for and what is its primary use?</summary>

### What does CSS stand for and what is its primary use?

**Definition:**

CSS — это Cascading Style Sheets. Он описывает оформление — цвет, шрифт, интервалы и раскладку — отдельно от HTML, который называет содержимое.

**How it works:**

- Правило — это селектор и объявления. Селектор называет элементы. Каждое объявление — свойство и значение, например `color: #1a1a1a`.
- Каскад выбирает победителя, когда совпало несколько правил: источник, важность, специфичность, затем порядок в файле.
- Одна таблица стилей обслуживает много страниц, поэтому смена цвета не требует правки каждого документа.
- Тот же HTML можно переоформить для печати, узкого экрана или контрастной темы, не переписывая содержимое.
- CSS не добавляет абзац или заголовок. Он только оформляет элементы, которые уже задал HTML.

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

CSS попадает на страницу четырьмя путями: подключённый файл, элемент `style`, атрибут `style` или `@import`. Для настоящего сайта оставляют подключённый файл.

**How it works:**

- Внешний: `<link rel="stylesheet" href="/styles/app.css">` в `head`. Файл кэшируется и делится между страницами.
- Внедрённый: элемент `style`, обычно в `head`, держит правила только этого документа.
- Встроенный: `style="color: navy"` на одном элементе. Специфичность высокая, поэтому поздним таблицам трудно его перекрыть.
- `@import` внутри таблицы или элемента `style` грузит другую таблицу. Он добавляет цепочку запросов; лучше ещё один `link`.
- От способа зависят специфичность, переиспользование и то, кто может править правило. Встроенный стиль часто побеждает и хуже всех переиспользуется.
- Выберите один основной способ. Страницу, где смешаны все четыре, трудно отлаживать.
- Встроенный стиль уместен для значения, которое правда принадлежит одному элементу, например координаты, посчитанной скриптом.

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

Класс помечает группу. Id помечает один элемент документа. Селекторы CSS — `.name` и `#name`; они различаются специфичностью и правилом HTML за ними.

**How it works:**

- `.lane` совпадает с каждым элементом с `class="lane"`. У одного элемента может быть несколько классов.
- `#pier-4` совпадает с элементом, чей `id` равен `pier-4`. Id должен быть уникален в документе. Повтор — неверный HTML, даже если браузер стилизует оба.
- Специфичность: id сильнее класса, класс сильнее селектора элемента. Поэтому правило с id трудно перекрыть без другого id или `!important`.
- Классы — для общего вида: кнопки, карточки, цвета статусов.
- Id — когда элемент должен быть уникален для ссылки-якоря или `getElementById`. Если цель только оформление, берите класс.
- Скорость селектора — не причина выбора. Современные движки не делают id заметно быстрее в CSS страницы.

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

Псевдокласс выбирает элемент по состоянию, положению или языку, а не по дополнительному классу в HTML. Его пишут с одним двоеточием: `a:hover`.

**How it works:**

- Действие и состояние интерфейса: `:hover`, `:focus`, `:focus-visible`, `:active`.
- Состояние формы: `:checked`, `:enabled`, `:disabled`, `:required`, `:optional`, `:valid`, `:invalid`, `:default`.
- Место в дереве: `:first-child`, `:last-child`, `:nth-child()`, `:only-child`, `:empty`.
- Язык и направление: `:lang(ru)`, `:dir(rtl)`.
- Отрицание и связи: `:not()`, `:is()`, `:where()`, `:has()`.
- Псевдокласс — условие на настоящем элементе. Псевдоэлемент (`::before`) оформляет фрагмент, который сам элементом не является.
- Одного `:hover` мало для клавиатуры. Важные состояния дублируйте через `:focus-visible`.

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

CSS-reset выравнивает встроенные стили браузеров, чтобы ваши правила начинались с одного места в каждом движке. Normalize — более мягкий родственник: он сохраняет полезные умолчания и чинит только расхождения.

**How it works:**

- Движки по-разному задают поля у `body` и заголовков, маркеры списков и вид полей формы. Вёрстка, которая на эти умолчания опирается, плывёт между браузерами.
- Reset обычно обнуляет margin и padding, задаёт общий `box-sizing` и убирает маркеры списков, которые вы рисуете сами.
- Его подключают первым, до таблицы сайта, чтобы поздние правила перекрывали его намеренно.
- `box-sizing: border-box` на `*` или на `*, *::before, *::after` не даёт padding раздуть заявленную ширину. Это забота reset, а не отдельная загадка.
- Reset — не дизайн. Заголовки становятся обычным текстом, пока вы их не оформите.
- Лучше короткий reset, который вы понимаете, или поддерживаемый normalize, чем огромный лист, который никто не читал.

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

Селектор атрибута выбирает элементы по наличию или значению атрибута. Его пишут в квадратных скобках и сочетают с типом, классом и псевдоклассами.

**How it works:**

- `[href]` совпадает с любым элементом, у которого атрибут есть.
- `[type="email"]` — точное совпадение значения.
- `[href^="https"]` — начинается с, `[href$=".pdf"]` — заканчивается на, `[href*="cdn"]` — содержит.
- `[class~="lane"]` совпадает с токеном в списке через пробел. `[lang|="en"]` совпадает с `en` или `en-GB`.
- Флаг `i` перед закрывающей скобкой делает сравнение без учёта регистра: `[type="email" i]`. Флаг `s` принуждает сравнение с учётом регистра.
- Они полезны, когда зацепка уже есть в HTML, например `target`, `disabled` или `data-status`, и класс добавлять не хочется.
- Специфичность такая же, как у класса. Кавычки вокруг значения — безопасная форма, если в нём пробелы или особые символы.

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

Псевдоэлемент оформляет часть элемента, у которой нет своего тега, или порождает бокс. Современный синтаксис — два двоеточия: `p::first-letter`.

**How it works:**

- `::before` и `::after` вставляют порождённые боксы. Они появляются, только если задан `content`, хотя бы пустой строкой.
- `::first-line` и `::first-letter` оформляют срез текста. `::selection` — выделение, которое тащит пользователь. `::placeholder` — подсказку поля. `::marker` — маркер списка.
- Порождённый текст не замена настоящему. Программы чтения с экрана могут пропустить или непредсказуемо озвучить `content`, поэтому единственную подпись туда не кладут.
- Типичные случаи: значок внешней ссылки, буквица, кавычки у `blockquote`, своя отрисовка флажка поверх нативного и clearfix (`::after { content: ""; display: block; clear: both; }`).
- Одно двоеточие (`:before`) — старый синтаксис. Он ещё работает для исходного набора; новым псевдоэлементам нужны два.
- Текст внутри `content` из DOM не выбрать. Это не элемент.

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

Комбинатор потомка-ребёнка `>` совпадает на один уровень вниз. Комбинатор потомка — это пробел, он совпадает на любой глубине. Тильда `~` — общий комбинатор соседа, а не потомка.

**How it works:**

- `ul > li` выбирает `li`, чей родитель — этот `ul`. `li` во вложенном списке не является ребёнком внешнего `ul`.
- `nav a` выбирает каждый `a` внутри `nav`, как бы глубоко он ни лежал.
- Селектор потомка легко сделать слишком широким: `div a` может переоформить ссылки, которые вы не имели в виду.
- Комбинатор ребёнка берут, когда структура известна и вложенные области трогать не нужно.
- Специфичность — сумма двух сторон. Сам комбинатор ничего не добавляет.
- Более узкий селектор не становится автоматически быстрее. Берите комбинатор, который совпадает с нужным деревом.

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

Первое правило оформляет только «Tides». Второе — обе ссылки.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Child_combinator
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Descendant_combinator

</details>

<details>
<summary>How would you select all direct children elements of a particular type?</summary>

### How would you select all direct children elements of a particular type?

**Definition:**

Соедините родителя, комбинатор ребёнка и тип ребёнка: `ul > li`. В выборку попадают только те `li`, чей родитель — этот `ul`.

**How it works:**

- Справа может быть любой элемент, класс или атрибут: `menu > .item`, `form > button`.
- Пункты вложенного списка не совпадают с `ul > li` внешнего списка, потому что их родитель — внутренний `ul`.
- `ul li` без `>` включит и вложенные пункты. Так пишут, только если это и нужно.
- Чтобы оформить каждого прямого ребёнка независимо от типа, пишут `ul > *`.

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

Универсальный селектор `*` совпадает с каждым элементом. Комбинаторы соседей выбирают элементы с общим родителем: `+` — следующий сосед, `~` — любой сосед после.

**How it works:**

- `*` уместен в узком reset, например `*, *::before, *::after { box-sizing: border-box; }`, или как `.card > *`, когда у каждого прямого ребёнка нужно снять поле по умолчанию.
- Голый `*` на большом документе совпадает со слишком многим. По возможности ограничьте его родителем.
- `h2 + p` оформляет абзац, который идёт сразу за `h2`.
- `h2 ~ p` оформляет каждый абзац после `h2` у того же родителя, не только соседний.
- Соседи должны делить родителя. Комбинатор не спускается в ребёнка и не смотрит на предыдущего соседа.
- Ими описывают схемы вроде «поле после этого флажка» или «все панели после заголовка» без лишних классов.
- Структура, которая держится только на хрупкой цепочке `+`, — знак, что в разметке нужен класс.

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

Каждый бокс элемента — это четыре вложенные области: содержимое, padding, рамка и margin. Ширина и высота относятся к разным частям этой стопки в зависимости от `box-sizing`.

**How it works:**

- Содержимое — текст или заменяемый объект. Padding — прозрачный зазор внутри рамки. Рамка — край. Margin — зазор снаружи рамки, общий с соседями.
- Фон закрашивает содержимое, padding и рамку (под прозрачной рамкой). Margin не закрашивается никогда.
- При начальном `box-sizing: content-box` заявленная ширина — только содержимое. Padding и рамка добавляются снаружи.
- При `border-box` заявленная ширина включает содержимое, padding и рамку. Margin в обоих случаях остаётся снаружи.
- Горизонтальный `margin: auto` у блока, который уже контейнера, центрирует этот блок.
- Боксы родителя и ребёнка складываются. Поле ребёнка может схлопнуться с полем родителя, если между ними ничего нет. Это схлопывание margin, а не ошибка ширины.
- Outline и тени сидят снаружи рамки и не занимают место в раскладке так, как margin.

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

Соседние вертикальные поля блоков в обычном потоке сливаются в одно. Берётся большее из двух, а если одно отрицательное — их сумма. Горизонтальные поля не схлопываются.

**How it works:**

- Соседние братья: нижнее поле одного блока и верхнее поле следующего становятся одним зазором.
- Родитель и первый или последний ребёнок: если у родителя нет padding, рамки или строчного содержимого между ними, поле ребёнка вылезает сквозь родителя.
- Пустые блоки могут схлопнуть собственные верхнее и нижнее поля насквозь.
- Схлопывания нет в контекстах flex и grid, у float и у inline-block.
- Поле корневого элемента не схлопывается с body так, как иногда ждут; обычный зазор вокруг страницы даёт margin у `body`.
- Чтобы сохранить оба поля, разделите боксы: padding или рамка у родителя, `overflow` кроме `visible`, или `display: flow-root`, чтобы создать новый блочный контекст форматирования.
- Из-за схлопывания два поля абзаца по `1rem` не дают зазор `2rem`.

**Examples:**

```css
p { margin-block: 1rem; }
.panel { padding-block: 1px; }
```

Два абзаца показывают зазор 1rem, а не 2rem. Padding у `.panel` не даёт полю ребёнка выйти из панели.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing

</details>

<details>
<summary>What are the different values for the box-sizing property and what do they do?</summary>

### What are the different values for the box-sizing property and what do they do?

**Definition:**

`box-sizing` выбирает, включают ли заявленные ширина и высота padding и рамку. Два значения, которые меняют бокс, — `content-box` и `border-box`.

**How it works:**

- `content-box` — начальное значение. Ширина и высота — это бокс содержимого. Padding и рамка добавляются снаружи, поэтому край рамки шире числа, которое вы задали.
- `border-box` включает в это число содержимое, padding и рамку. Добавление padding сжимает бокс содержимого, а не растит элемент.
- Margin в обоих значениях остаётся снаружи ширины.
- `initial` — общее ключевое слово CSS, которое возвращает начальное значение свойства, то есть `content-box`. Это не третья модель размеров.
- Глобальный reset `border-box` (`*, *::before, *::after`) делает проценты и арифметику раскладки равными тому размеру, который вы думаете, что задали.
- У заменяемых элементов, например изображений, поверх этого есть свои правила размеров.

**Examples:**

```css
.field {
  box-sizing: border-box;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #999;
}
```

Поле остаётся внутри родителя. Та же ширина с `content-box` вылезла бы на padding и рамку.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-sizing

</details>

<details>
<summary>How do you center a block element with CSS?</summary>

### How do you center a block element with CSS?

**Definition:**

Блок уже своего контейнера центрируют по строчной оси через `margin-inline: auto`. Вертикальное центрирование — задача flex или grid у родителя, а не автополей у обычного блока.

**How it works:**

- Автополям нужно определённое свободное место. Задайте ширину (или `max-width`) меньше контейнера, затем `margin-inline: auto`. `margin: 0 auto` — горизонтальная форма.
- Блок, растянутый на 100%, свободного места не имеет, поэтому автополя ничего заметного не делают.
- Flex: `display: flex; justify-content: center` центрирует детей по главной оси. При направлении row по умолчанию это горизонталь. `align-items: center` центрирует по поперечной оси.
- Grid: `display: grid; place-items: center` центрирует ребёнка в ячейке по обеим осям.
- Текст внутри блока центрируют через `text-align: center`. Сам блок это не центрирует.
- Абсолютное позиционирование с `inset: 0; margin: auto` и заданным размером тоже центрирует и вынимает элемент из потока. Его берут, когда нужна именно накладка.

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

`display` решает, переносит ли бокс строку, насколько он растягивается и какие размеры к нему применяются. `block`, `inline` и `inline-block` — три разных ответа.

**How it works:**

- `block` в обычном потоке начинается с новой строки и тянется на ширину содержащего блока. Ширина, высота и вертикальные поля работают. Примеры: `div`, `p`, `h1`, пока вы их не смените.
- `inline` сидит в строке вместе с текстом. Ширина и высота не применяются. Вертикальное поле не применяется; горизонтальные поле и padding — да. Примеры: `span`, `a`, `strong`.
- `inline-block` сидит в строке как inline, но ширина, высота, padding и вертикальное поле работают как у блока. Выравнивание по базовой линии может оставить зазор под боксом; его поправляет `vertical-align`.
- Смена `display` не меняет смысл элемента. `span` с `block` всё равно не заголовок.
- Элементы flex и grid играют ещё одну роль. `display: inline` у flex-элемента не оставляет его строчным внутри flex-контейнера.

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
