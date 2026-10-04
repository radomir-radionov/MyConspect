# HTML — Interview

Вопросы для собеседования по HTML. Ответы заполнены для опубликованной части, остальные пустые.

[← Вернуться в центр](./1_html.md)

### Related docs

* [HTML — Структура](./1_html_structure.md) · [HTML — Семантика](./1_html_semantics.md) · [HTML — Формы](./1_html_forms.md) · [HTML — Медиа](./1_html_media.md) · [HTML — Рендеринг](./1_html_rendering.md) · [HTML — Производительность](./1_html_performance.md) · [HTML — Доступность](./1_html_a11y.md) · [HTML — SEO](./1_html_seo.md) · [HTML — Расширенный](./1_html_advanced.md) · [HTML — Интервью](./1_html_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Вопросы из [Devinterview.io — HTML5](https://devinterview.io/questions/web-and-mobile-development/html5-interview-questions/).

### HTML Basics

<details>
<summary>What does HTML stand for and what is its purpose?</summary>

### What does HTML stand for and what is its purpose?

**Definition:**

HTML — это HyperText Markup Language: разметка, которая называет части страницы, чтобы браузер собрал из неё документ. CSS и JavaScript опираются на эту структуру и не подменяют её.

**How it works:**

- Элементы задают структуру: области, заголовки, абзацы, списки, ссылки, формы и встроенные медиа.
- Гипертекст — это связи. Элемент `a` ведёт на другой URL или на id той же страницы.
- Браузер разбирает разметку в DOM. По этому дереву ходят скрипты и вспомогательные технологии.
- Семантические имена вроде `nav` и `article` сообщают, для чего область, а не только как она выглядит.
- Оформление остаётся в CSS, поведение — в JavaScript. Три слоя можно вести и кэшировать отдельно.
- Язык описан живым стандартом HTML. Старые документы по-прежнему разбираются, а незнакомые элементы браузер пропускает, не ломая страницу.
- Та же разметка лежит в основе сайта-визитки, веб-приложения и большинства объявлений в браузере.

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

Документ HTML — это doctype и один корневой элемент `html`, внутри которого лежат `head` и `body`. В `head` документ описывают, в `body` — то, что видит человек.

**How it works:**

- `<!DOCTYPE html>` — указание браузеру, а не элемент. Оно включает стандартный режим для HTML-документа.
- `html` — корень. Всё остальное находится внутри него.
- `head` несёт заголовок окна, кодировку, viewport и ссылки на стили или скрипты. Этот материал не рисуется как текст страницы.
- `title` — имя вкладки и подпись по умолчанию, когда страницу сохраняют или делятся ею.
- `body` держит видимое дерево: заголовки, абзацы, изображения и элементы управления.
- Обычный порядок: doctype, затем `html`, затем `head`, затем `body`.

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

Doctype выбирает режим разбора и вёрстки. `lang` на `html` называет основной язык документа, чтобы инструменты могли его озвучить, перенести и проиндексировать.

**How it works:**

- `<!DOCTYPE html>` стоит перед `<html>`. Он включает стандартный режим. Без doctype многие браузеры уходят в режим совместимости, и возвращаются старые ошибки вёрстки.
- Это не выбор замороженной версии HTML. Текущий doctype значит «это HTML-документ».
- `lang` принимает метку BCP 47: язык вроде `en` или язык с регионом, например `en-GB` или `pt-BR`.
- Программы чтения с экрана по ней выбирают голос. Браузеры используют её для переносов и кавычек. Поисковые системы — как подсказку языка.
- Фрагмент на другом языке получает свой `lang`, чтобы русская цитата внутри английской страницы не читалась как английская.
- `und` значит, что язык неизвестен. Пустой `lang` хуже честной метки: агент тогда вынужден угадывать.

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

`head` настраивает документ. `body` — это документ, который читают и используют. Они соседи внутри `html`, и `head` идёт первым.

**How it works:**

- `head` хранит метаданные: `title`, кодировку, viewport, ссылки на стили и скрипты. Браузер не рисует этот блок как содержимое страницы.
- `body` хранит видимое дерево: текст, изображения, ссылки, формы и ориентиры вроде `header`, `nav`, `main` и `footer`.
- Настройка в `head` нужна до показа `body`. Кодировка, объявленная слишком поздно, уже может неверно прочитать файл.
- Стили и скрипты допустимы в обоих местах, но обычное деление такое: описание страницы в `head`, содержимое в `body`.
- Скрипт в конце `body` выполняется после разбора разметки выше. Скрипт в `head` без `defer` или `async` блокирует разбор.

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

Элемент `meta` — это машиночитаемые сведения о документе. Посетитель не видит их как текст страницы; их читают браузер, роботы и соцсети.

**How it works:**

- `charset` называет кодировку, почти всегда `utf-8`, и стоит в начале `head`.
- `name="viewport"` сообщает мобильному браузеру ширину вёрстки. Обычная адаптивная настройка — `width=device-width, initial-scale=1`.
- `name="description"` — краткое описание. Поиск может показать его под заголовком.
- `name="robots"` может попросить робота не индексировать страницу или не переходить по ссылкам. Это по-прежнему рабочий рычаг, а не пережиток.
- `name="author"` записывает автора. Он необязателен.
- `name="keywords"` крупные поисковые системы игнорируют. Тратить на него время не стоит.
- Open Graph (`property="og:…"`) и карточки Twitter описывают превью, когда ссылкой делятся.
- Канонический адрес — это `link rel="canonical"`, а не имя meta. Он называет предпочтительный URL, если одну страницу открывают несколько адресов.
- `http-equiv="refresh"` — старый редирект. Предпочтительнее настоящий HTTP-редирект.

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

Внешнюю таблицу стилей подключают элементом `link` в `head`. `rel="stylesheet"` говорит, что это за ресурс, `href` — где он лежит.

**How it works:**

- `href` может быть путём относительно страницы (`/styles/app.css`) или абсолютным URL.
- `type` для CSS не нужен. Браузер и так понимает тип по `rel`.
- К одному документу можно подключить несколько таблиц. При равной специфичности побеждают более поздние правила — это каскад.
- Файл кэшируется отдельно, поэтому его делят многие страницы.
- Есть ещё два способа с худшим переиспользованием: элемент `style` в документе и атрибут `style` на одном элементе.
- `@import` внутри CSS подтягивает другой файл, но добавляет цепочку запросов. Прямой путь — `link` в `head`.
- Держите один основной способ. Смесь встроенных правил, внедрённых таблиц и нескольких импортов делает каскад трудно прослеживаемым.

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

Обычный скрипт или модуль подключают элементом `script`. Внешний файл задают через `src`; встроенный код пишут между открывающим и закрывающим тегами. Закрывающий тег обязателен.

**How it works:**

- `src` указывает на файл. В одном элементе не совмещают большую встроенную программу и `src`.
- Обычный скрипт без `defer` или `async` выполняется сразу, как только до него дошли, и блокирует разбор.
- `defer` у обычного скрипта в `head` качает файл во время разбора и запускает его после разбора документа, по порядку.
- `async` запускает скрипт, когда загрузка кончилась, без гарантии порядка. Его берут для независимых скриптов.
- `type="module"` грузит ES-модуль: по умолчанию он отложен, в строгом режиме и в своей области видимости.
- Интерактивный скрипт ставят так, чтобы нужная разметка уже существовала, либо ждут её. Простой вариант — конец `body`.
- Внешний файл можно кэшировать и делить между страницами. Встроенный код так не кэшируется, и его труднее переиспользовать.
- Ни комментарии, ни секреты сюда не кладут: скрипт скачивается браузером.

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

Комментарий HTML — это текст между `<!--` и `-->`. Парсер его отбрасывает: он не показывается и не является элементом.

**How it works:**

- Им поясняют, зачем нужен блок, помечают временный обход или прячут разметку на время отладки.
- В комментарии можно оставить напоминание к следующей правке. Секрет там держать нельзя: исходник всё равно скачивается.
- Не пересказывайте очевидное (`<!-- paragraph -->` рядом с `p`). Если разметка ясна, комментарий — шум.
- Пишите коротко. Комментарий, который повторяет код, быстро устаревает.
- Обновляйте или удаляйте комментарий, когда меняется разметка. Устаревшая заметка хуже её отсутствия.
- Комментарии не вкладываются. `--` внутри комментария небезопасен; текст держите простым.
- Условные комментарии для старого Internet Explorer — история. Новые так не пишут.

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

Каждая языковая версия — отдельный документ: свой URL, верный `lang` и ссылки, которые сообщают браузерам и роботам об остальных версиях.

**How it works:**

- `lang` на `<html>` ставят даже у одноязычной страницы. Метка BCP 47: `en`, `ru`, `es-MX`, `pt-BR`.
- Регион — код ISO 3166 после дефиса. `en-GB` и `en-US` — разные локали, а не просто подпись.
- Свой `lang` ставят на любой элемент с другим языком, а `dir="rtl"` — когда письмо идёт справа налево.
- У каждого языка свой URL, например `/en/about` и `/ru/about`, с читаемыми путями.
- Набор объявляют через `<link rel="alternate" hreflang="ru" href="…">`, включая `x-default` как запасной вариант.
- Не отдавайте все языки с одного URL, подменяя текст скриптом. Робот и общая ссылка тогда не смогут указать на язык.
- Переводите видимый текст. `lang` на непереведённом тексте — ложная подсказка.

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

Атрибуты `data-*` хранят служебные данные страницы на элементе. Они нужны скрипту и стилям этой страницы и не заменяют видимый текст или ARIA.

**How it works:**

- Имя — это `data-` и свой токен, например `data-sku`. Такой атрибут — допустимый HTML; голый атрибут `sku` выдумывать не нужно.
- JavaScript читает их через `element.dataset`. `data-sku` становится `dataset.sku`. Имя из нескольких слов, например `data-user-id`, становится `dataset.userId`.
- Значения — строки. Числа и флаги нужно преобразовать явно.
- CSS может их выбирать: `[data-status="held"] { opacity: 0.6 }`.
- Типичные случаи: id виджета, код товара для обработчика клика или флаг состояния для стилей.
- Не прячьте единственную копию сведений для людей в `data-*`. Программы чтения с экрана значения dataset не объявляют.
- Не дублируйте ими `aria-*` и текст, который уже есть в элементе.

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

`strong` помечает текст особой важности. `b` помечает фрагмент, который выделен стилистически, например название товара, без этой важности. Оба часто выглядят жирными; смысл разный.

**How it works:**

- `strong` ставят на предупреждение, обязательный шаг или слово, которое нельзя пропустить. Вспомогательные технологии могут передать эту важность.
- `b` ставят на ключевое слово, название товара в абзаце или вводную фразу, которую нужно выделить без смысла «важнее».
- Стиль по умолчанию у обоих — жирный. Это оформление, а не определение.
- Если нужна только толщина шрифта, задайте `font-weight` в CSS и оставьте элемент, который совпадает со смыслом.
- Не оборачивайте весь абзац в `strong`, чтобы он кричал. Важность — это фрагмент, а не заливка.
- `b` не устарел. Он уместен, когда выделение настоящее, а дополнительной важности нет.

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

`em` — это смысловое ударение: без него фраза значит другое. `i` помечает текст другой интонации — термин, иностранную фразу или мысль — без такого ударения.

**How it works:**

- `em` меняет чтение. «Позвони *менеджеру*» — не та же инструкция, что «позвони менеджеру».
- Ударение может быть вложенным. `em` внутри `em` — более сильное ударение.
- `i` подходит для названия вида, термина при первом упоминании, фразы на другом языке или мысли персонажа. Иностранную фразу сопровождают `lang`.
- Оба по умолчанию курсивные. Курсив — не причина выбора.
- Декоративный курсив — это `font-style: italic` на обычном элементе. Не берите `em` или `i` ради украшения.
- Не вешайте на `em` атрибут style, чтобы изобразить подсветку. Если фрагмент — совпадение поиска, это `mark`.

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

`small`, `s` и `mark` называют три разных вида текста, а не три приёма шрифта. Размер, зачёркивание и подсветка в CSS этого смысла не несут.

**How it works:**

- `small` — побочная пометка: копирайт, юридическая сноска или указание источника. Это не способ сказать «заголовок должен быть 12px».
- `s` помечает текст, который больше не верен или не актуален, например прежнюю цену. Браузер перечёркивает его.
- `del` — редакторское «это удалили». `s` — «это больше неверно». Они не взаимозаменяемы.
- `mark` выделяет фрагмент, важный в текущем контексте, например совпадение поиска внутри цитаты. Это не «важно вообще»; для важности есть `strong`.
- Если нужны только меньший кегль, линия или жёлтый фон, это CSS.

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

Имя семантического элемента — это его роль. `nav` — навигация, `p` — абзац, `button` — кнопка. `div` с классом может выглядеть так же и при этом никому не сообщать, что это за область.

**How it works:**

- Ориентиры (`header`, `nav`, `main`, `aside`, `footer`) дают вспомогательным технологиям карту страницы.
- Заголовки (`h1`–`h6`) строят оглавление документа. Заголовок, который только выглядит крупным за счёт CSS и сидит в `div`, в это оглавление не входит.
- `article` — самостоятельный материал, например запись. `section` — тематическая группа, у которой должен быть заголовок. Не каждой странице нужны оба.
- Списки, ссылки, иллюстрации и подписи (`ul`, `ol`, `a`, `figure`, `figcaption`) называют обычные части, которые безликие контейнеры прячут.
- Те же имена используют роботы и режим чтения. Страницу проще переоформить, потому что структура не закопана в строках классов.
- Семантика не отменяет CSS. Элементы по-прежнему стилизуют. Класс перестаёт быть единственным описанием того, что они такое.
- На странице один `main`. Не оборачивайте всё в `article` только ради вида семантики.

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

Абзац — это элемент `p`. Разрыв строки внутри блока — это `br`. Они решают разные задачи, и `br` не отделяет абзацы.

**How it works:**

- `p` — блок. Таблица стилей по умолчанию добавляет поля сверху и снизу: это визуальный зазор между абзацами. Поле можно изменить в CSS.
- В абзаце — фразовое содержимое: текст, ссылки, выделение. Другой абзац или заголовок внутрь не кладут.
- `br` — пустой элемент. Он заканчивает текущую строку и продолжает тот же абзац или адрес. Обычный случай — почтовый адрес или строка стихотворения.
- У `br` нет закрывающего тега. Запись `</br>` — не форма HTML.
- Стопка элементов `br` вместо интервала между абзацами спорит с полем по умолчанию и ломается при смене размера шрифта.
- Пробелы в исходнике схлопываются. Перевод строки в файле — не разрыв строки на странице.
- `textarea` — поле формы для многострочного ввода. Оно переносит текст пользователя и не размечает абзацы документа.
- `pre` сохраняет переводы строк исходника для заранее оформленного текста. Это третий инструмент, а не замена `p`.

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
