# HTML — Interview

Интервью с вопросами и ответами и задания по кодированию для HTML.

[ ← Вернуться в центр](./1_html.md)

### Related docs

* [HTML — Структура](./1_html_structure.md) · [HTML — Семантика](./1_html_semantics.md) · [HTML — Формы](./1_html_forms.md) · [HTML — Медиа](./1_html_media.md) · [HTML — Рендеринг](./1_html_rendering.md) · [HTML — Производительность](./1_html_ Performance.md) · [HTML — Доступность](./1_html_a11y.md) · [HTML — SEO](./1_html_seo.md) · [HTML — Расширенный](./1_html_advanced.md) · [HTML — Интервью](./1_html_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Вопросы для собеседования, обзорные задания и задачи по кодированию из [0_interview.md](0_interview.md). У каждого элемента есть **вопрос**, **ответ** или **решение**.

**Coverage:** разделы теории выше + указатель вопросов ниже — все проиндексированные вопросы связаны с вопросами и ответами или заданиями.

### Question index (0_interview.md)

| # | Тема | Раздел |
|---|-------|---------|
| 43 | `async` vs `defer` vs `module` | Теория Q1 |
| 44 | `innerHTML` vs `textContent` vs `innerText` | Теория Q2 |
| 55 | Веб-доступность | Теория Q3 |
| 57 | Принципы семантической компоновки | Теория Q4 |
| 60 | Просмотрите плохой HTML | Задача 1 |
| 74 | `#shadow-root` в Инструментах разработчика | Теория Q5 |
| 75 | Пользовательские элементы | Теория Q6 |
| 76 | Пробелы HTML и производительность | Теория Q7 |
| — | CLS (кумулятивный сдвиг макета) | Теория Q-CLS |
| 77 | Контекст рендеринга холста | Теория Q8 |
| 71–72 | Повторное использование и оптимизация SVG | Теория Q9–Q10 |
| 91 | Асинхронная проверка формы | Теория Q11 |
| 12 | Политика безопасности контента | Теория Q12 |
| 16 | Тень ДОМ | Теория Q5 || 142 | Найти HTML-ссылки в строке | Задача 3 |
| 147 | HTMLConstruct конструктор | Задача 2 |
| — | URL → DNS → конвейер рендеринга | Браузер Q1–Q10 |
| — | Что блокирует первую покраску? | Q-БЛОК |
| — | Грязная верстка / rAF / прогрессивный рендеринг | Q-DIRTY · Q-RAF · Q-PROG |

---

### Browser pipeline Q&A

Ответы на собеседовании для браузерного раздела. Полная теория: [Конвейер рендеринга браузера](./1_html_structure.md#browser-rendering-pipeline) · [Браузер и рендеринг](./1_html_rendering.md#browser--rendering).

<details>
  <summary>Q-URL. What happens when you enter a URL?</summary>

### What happens when you enter a URL?

**Definition:** Ввод URL-адреса запускает цепочку от разрешения DNS через HTTP до анализа HTML и полного конвейера рендеринга.

**How it works:**

```
Parse URL → HTTP cache? → hosts / DNS caches → IP
  → TCP handshake → TLS if HTTPS → HTTP GET
  → HTML stream → DOM + CSSOM → render tree
  → layout → paint → GPU compositing
```

| Шаг | Что происходит |
|------|----------------|
| Разобрать URL | Схема, хост, путь, запрос (хэш остается на стороне клиента) |
| Кэш/DNS | Сохраненный HTML, затем хосты → браузер → ОС → интернет-провайдер → авторитетный |
| Подключиться | TCP SYN/SYN-ACK/ACK; TLS + шифрование, если `https:` |
| Запрос | `GET` с `Host`; сервер сопоставляет URI с файлом или прокси |
| Разобрать | HTML → DOM; CSS → CSSOM (блокировка задержки CSS/JS) |
| Рендеринг | Дерево рендеринга → макет → рисование → композит на графическом процессоре |

**When to use:** Холодное первое посещение · кэширование DNS/TLS · навигация по SPA-клиенту (API истории пропускает полную перезагрузку).

**Thoughts:** *Браузер не рисует, пока в нем не будет достаточно DOM и CSSOM для построения дерева рендеринга; композитинг на графическом процессоре, вот почему `transform`/`opacity` анимация остается дешевой.*

**See also:** [Что происходит, когда вы вводите URL-адрес?](./1_html_rendering.md#browser--rendering) (полная теория)

**Sources:** [MDN — Как работает Интернет](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/How_does_the_Internet_work)

</details>

<details>
  <summary>Q-DNS. How does DNS work?</summary>

### How does DNS work?

**Definition:** DNS сопоставляет удобочитаемые доменные имена с IP-адресами, чтобы браузер мог открыть сетевое соединение.

**How it works:**

1. Файл хостов (локальное переопределение)
2. DNS-кеш браузера.
3. DNS-кэш ОС
4. Рекурсивный преобразователь (ISP)
5. Корень → TLD → авторитетный сервер имен.
6. IP вернулся; браузер открывает TCP-соединение

**When to use:** Первое посещение · CDN CNAME · `dns-prefetch` / `preconnect` для производительности.

**Thoughts:** *Поиск DNS увеличивает задержку при холодном запуске — помогает кэширование и предварительная выборка.*

**See also:** [Как работает DNS](./1_html_rendering.md#browser--rendering) (полная теория)

**Sources:** [MDN — DNS](https://developer.mozilla.org/en-US/docs/Glossary/DNS)

</details>

<details>
  <summary>Q-HTML. How does the browser get HTML?</summary>

### How does the browser get HTML?

**Definition:** После разрешения DNS браузер открывает соединение TCP/TLS, отправляет HTTP-запрос и получает поток HTML-документов для анализа.

**How it works:**

- Браузер отправляет `GET /path HTTP/1.1` с `Host`, печенье, `Accept`и т. д.
- Сервер отвечает статусом, заголовками (`Content-Type`, `Cache-Control`) и тело.
- Парсер обрабатывает HTML-поток постепенно — он не ждет полного файла.
- Скрипты блокировки парсера (`<script>` без `async`/`defer`) приостановить анализ HTML.

**When to use:** Статический файл из CDN · SSR HTML из Node/Next.js · фрагментированное кодирование передачи.

**Thoughts:** *Разбор HTML начинается сразу после поступления байтов — потоковая передача сокращает время обработки первого байта.*

**See also:** [Как браузер получает HTML](./1_html_rendering.md#browser--rendering)

</details>

<details>
  <summary>Q-DOM. What is the DOM? How is the DOM tree built?</summary>

### What is the DOM? How is the DOM tree built?

**Definition:** DOM (объектная модель документа) — это живое, хранящееся в памяти древовидное представление HTML-документа в браузере — узлы, элементы, атрибуты и текст.

**How it works:**

- HTML-токенизатор читает байты → токены (теги, атрибуты, текст).
- Построитель деревьев создает узлы и родительские/дочерние ссылки.
- DOM **живой** — мутации JS (`appendChild`, `textContent`) мгновенно обновить дерево.
- Неверный HTML исправляется парсером (например, автозакрывающиеся теги).

**When to use:** `document.querySelector` · React фиксирует минимальные обновления DOM · Дерево доступности, полученное из DOM.

**Thoughts:** *DOM — структура; он не включает вычисляемые стили (это CSSOM).*

**See also:** [Построение дерева DOM](./1_html_rendering.md#browser--rendering) · [3_js_browser.md](./3_js_browser.md)

</details>

<details>
  <summary>Q-CSSOM. What is the CSSOM?</summary>

### What is the CSSOM?

**Definition:** CSSOM (объектная модель CSS) — это объектное представление в браузере анализируемых правил CSS — селекторов, сопоставленных с объявлениями стилей.

**How it works:**

- Каждый файл CSS и `<style>` блок разбирается на правила.
- CSSOM отделен от DOM до тех пор, пока дерево рендеринга не объединится.
- Блокировка рендеринга: CSS в `<head>` задерживает первый рендеринг (браузер ждет, чтобы избежать FOUC).
- `display: none` элементы существуют в DOM, но исключены из дерева рендеринга.

**When to use:** Внешняя таблица стилей · встроенный критический CSS · `@media` правила фильтрации запросов.

**Thoughts:** *Нет CSSOM → нет стилизованного дерева рендеринга → пустой или нестилизованный Flash.*

**See also:** [Что такое CSSOM?](./1_html_rendering.md#browser--rendering)

**Sources:** [MDN — CSSOM](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model)

</details>

<details>
  <summary>Q-RT. What is the render tree?</summary>

### What is the render tree?

**Definition:** Дерево рендеринга объединяет DOM и CSSOM в дерево видимых блоков, готовых к макетированию и рисованию. `display: none` узлы исключены; `visibility: hidden` остается на дереве. Геккон называет это **каркасным деревом**.

**How it works:**

1. Обход узлов DOM.
2. Прикрепите вычисленные стили из CSSOM.
3. Пропустить невидимые узлы (`display: none`, `<head>`, и т. д.).
4. Вывод: коробки с геометрией и информацией о покраске.

**When to use:** Понимание того, почему скрытые элементы не влияют на макет, но `visibility:hidden` делает.

**Thoughts:** *Дерево рендеринга = то, что вы видите, а не полный DOM.*

**See also:** [Что такое дерево рендеринга?](./1_html_rendering.md#browser--rendering)

**Sources:** [web.dev — Дерево рендеринга](https://web.dev/articles/critical-rendering-path/constructing-the-object-model)

</details>

<details>
  <summary>Q-LAYOUT. What is layout (reflow)?</summary>

### What is layout (reflow)?

**Definition:** Layout вычисляет размер и положение каждого видимого элемента — ширину, высоту, поля и координаты на странице.

**How it works:**

- Запускается при: вставке/удалении DOM, изменении размера, загрузке шрифта, изменении размера окна, чтении свойств макета после записи.
- Изменение размера окна → **глобальный** макет; локальное изменение стиля → **инкрементное** расположение **грязных** узлов (элемент + потомки).
- `transform` и `opacity` обычно пропускают макет (только для композитора).
- Перестановка макета: чередование чтений(`offsetHeight`) и записывает в цикле, вызывая повторную перекомпоновку.

**When to use:** Первоначальный макет страницы · Адаптивное изменение размера · Динамическое внедрение списка.

**Thoughts:** *Макет требует больших затрат — пакетное чтение и запись DOM; предпочитать `transform` для анимации.*

**See also:** [Макет (перекомпоновка)](./1_html_rendering.md#browser--rendering) · [2_css.md](./2_css.md)

</details>

<details>
  <summary>Q-PAINT. What is paint?</summary>

### What is paint?

**Definition:** Paint растрирует внешний вид каждого блока — текст, фон, границы, тени — в растровые слои.

**How it works:**

- После верстки браузер заполняет пиксели для каждой видимой области.
- Большой `box-shadow` or `border-radius` области увеличивают стоимость краски.
- Некоторые свойства вызывают перерисовку без макета (`color`, `background`).

**When to use:** Рендеринг текста · перерисовка при наведении, изменение цвета · `will-change` подсказки.

**Thoughts:** *Рисунок отвечает на вопрос: «Как это выглядит?» после макета отвечает "где и насколько большой?"*

**See also:** [Paint](./1_html_rendering.md#browser--rendering)

**Sources:** [MDN — Repaint](https://developer.mozilla.org/en-US/docs/Glossary/Repaint)

</details>

<details>
  <summary>Q-COMP. What is compositing?</summary>

### What is compositing?

**Definition:** Композиция объединяет нарисованные слои в финальный кадр на графическом процессоре. Элементы с `transform`, `opacity`, or `will-change` может получить свой собственный слой.

**How it works:**

- Графический процессор складывает слои в конечный кадровый буфер.
- Изменения только в композиторе пропускают макет и часто пропускают полную перерисовку.
- Чрезмерное продвижение слоев (`will-change` везде) тратит память.

**When to use:** Гладкий `transform`/`opacity` анимации · параллакс · фиксированные заголовки.

**Thoughts:** *Композитный этап — самый дешевый этап — анимация с помощью `transform`, нет `top`/`left`.*

**See also:** [Композитинг](./1_html_rendering.md#browser--rendering)

**Sources:** [MDN — Композитный](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Composite)

</details>

<details>
  <summary>Q-LPC. Layout vs paint vs compositing?</summary>

### Layout vs paint vs compositing?

**Definition:** Три этапа рендеринга с разными профилями затрат — макет (геометрия), покраска (пиксели), композит (наложение слоев).

| Этап | Вопрос | Примеры триггеров |
|-------|----------|------------------|
| **Макет** | Где? Насколько большой? | `width`, вставка DOM, `padding` |
| **Краска** | Как это выглядит? | `color`, `background`, `box-shadow` |
| **Композитный** | Как укладываются слои? | `transform`, `opacity` |

**How it works:** Макет → покраска → композит (упрощенный). Изменения, состоящие только из составных частей, выполняются быстрее всего.

**Thoughts:** *Знайте, какие свойства запускают какой этап, что крайне важно для собеседований по эффективности.*

**See also:** [Макет, рисование и композитинг](./1_html_rendering.md#browser--rendering)

</details>

<details>
  <summary>Q-FPR. What happens on first page render?</summary>

### What happens on first page render?

**Definition:** Первый рендеринг (первый путь отрисовки контента) — это начальный переход от полученного HTML к видимым пикселям на экране.

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

**When to use:** Блокирующий рендеринг CSS задерживает FCP · Скрипты, блокирующие парсер, задерживают DOM · Изображения без размеров вызывают CLS.

**Thoughts:** *Критический путь рендеринга = минимальные шаги от HTML до первой отрисовки.*

**See also:** [Конвейер рендеринга браузера](./1_html_structure.md#browser-rendering-pipeline) · [3_js_browser.md — загрузка скрипта](./3_js_browser.md#script-loading) · [FCP](./6_web_api_security.md#first-contentful-paint-fcp)

**Sources:** [web.dev — критический путь рендеринга](https://web.dev/articles/critical-rendering-path)

</details>

<details>
  <summary>Q-BLOCK. What blocks first paint?</summary>

### What blocks first paint?

**Definition:** Первая отрисовка ожидает на **критическом пути рендеринга** — в основном анализ HTML плюс **CSS, блокирующий рендеринг**. Классический `<script>` без `defer`/`async`/`type="module"` **блокирует синтаксический анализ HTML** (и, следовательно, построение DOM). Шрифты могут задерживать стилизованный текст (FOIT/FOUT).

**How it works:**

- **CSS** в `<head>` (`<link rel="stylesheet">`) блокирует рендеринг: браузер обычно не выполняет первую отрисовку до тех пор, пока CSSOM не будет готов (чтобы избежать вспышки нестилизованного содержимого). `@import` внутри CSS сериализует лишние запросы — еще хуже.
- **JavaScript** без `defer`/`async`/`module`: парсер попадает в тег, извлекает (если `src`), **запускается**, затем продолжается HTML. Это задерживает DOM, `DOMContentLoaded`, и часто сначала красят.
- **`defer` / `type="module"`** — загрузка параллельно, запуск после парсинга HTML, в порядке документа, перед `DOMContentLoaded`.
- **`async`** — загрузка параллельно, запуск по мере готовности (заказ не гарантируется); все еще может прервать синтаксический анализ во время выполнения.
- **Критический CSS** — встроенные правила над сгибом `<head>` поэтому первая отрисовка не ждет большой таблицы стилей; остальное загрузите асинхронно.

**When to use:** Пакет приложений в `<head>` без `defer` · огромный файл CSS · веб-шрифты без `font-display`.

**Thoughts:** *CSS блокирует первую отрисовку; undefferred JS блокирует анализ HTML — используйте `defer`/`module` и сохраняйте небольшой размер критически важного CSS.*

**See also:** [async vs defer vs mod](./1_html_media.md# Performance--resource-loading) · [3_js_browser.md — загрузка скрипта](./3_js_browser.md#script-loading) · [2_css.md](./2_css.md) критический CSS

**Sources:** [web.dev — CSS, блокирующий рендеринг](https://web.dev/articles/critical-rendering-path/render-blocking-css) · [MDN — скрипт](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)

</details>

<details>
  <summary>Q-DIRTY. Global vs incremental layout? What are dirty nodes?</summary>

### Global vs incremental layout? What are dirty nodes?

**Definition:** **Глобальный** макет пересчитывает все дерево рендеринга (например, изменение размера окна). **Инкрементная** компоновка только **грязного** поддерева — измененного элемента и его потомков.

**How it works:** Дети пачкаются, потому что их геометрия часто зависит от родителя. Оставайтесь в нормальном потоке, чтобы независимые коробки можно было определить по размеру за один проход.

**Thoughts:** *Dirty = мутировавший узел + дети; изменение размера является глобальным и дорогостоящим.*

**See also:** [Глобальный или инкрементный макет](./1_html_rendering.md#browser--rendering)

</details>

<details>
  <summary>Q-RAF. Why `requestAnimationFrame` instead of `setInterval` for animation?</summary>

### Why `requestAnimationFrame` instead of `setInterval` for animation?

**Definition:** `requestAnimationFrame(cb)` графики `cb` перед следующей **перерисовкой** браузера, обычно при обновлении экрана (~60 кадров в секунду). `setInterval(fn, 16)` это таймер, а не крючок для рисования.

**How it works:**

- rAF выравнивается по кадру анимации; паузы в фоновых вкладках.
- Интервалы могут возникать между отрисовками (рывками) или **догонять** после неактивной вкладки (много кадров одновременно).
- Анимировать `transform`/`opacity`, нет `left`/`top`/`margin`.

**Thoughts:** *Сообщите наборщику, когда будет следующий кадр — не угадывайте 16 мс.*

**See also:** [Перекомпоновка, перерисовка и анимация кадров](./1_html_rendering.md#browser--rendering) · [3_js_browser.md](./3_js_browser_extra.md#request-animation-frame)

**Sources:** [MDN — requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

</details>

<details>
  <summary>Q-PROG. What is progressive rendering?</summary>

### What is progressive rendering?

**Definition:** Покажите полезные пиксели заранее: потоковый HTML, встроенный **критический CSS**, неблокирующие скрипты, ленивые медиафайлы под сгибом — не ждите полного пакета перед первой отрисовкой.

**How it works:** Parser строит DOM постепенно; для стилизованной первой отрисовки по-прежнему требуется CSSOM. Подходы: критический CSS, `defer`/`async`, `content-visibility: auto`, `loading="lazy"`, скелеты.

**Thoughts:** *Первая полезная краска лучше, чем ожидание всего.*

**See also:** [Прогрессивная визуализация](./1_html_rendering.md#browser--rendering) · [2_css.md](./2_css.md)

</details>

---

### Theory questions

<details>
  <summary>Q1. Compare `async`, `defer`, and `type="module"` on script tags</summary>

### Q1. Compare `async`, `defer`, and `type="module"` on script tags

**Definition:** Атрибуты загрузки скрипта управляют временем загрузки, временем выполнения и порядком относительно анализа HTML.

**How it works:**

- Поведение парсера различается в зависимости от атрибута; см. таблицу в ответе.
- `defer`/`module` сохранять порядок; `async` нет.
- Все по-прежнему выполняется в основном потоке.

| Атрибут | Блокирует анализ при выполнении? |
|-----------|-------------------------|
| `defer` | Нет до конца анализа |
| `async` | Да, когда будет готово |

**When to use:** Пакет приложений (`defer`) · аналитика (`async`) · Приложение ESM (`module`).

**Common pitfalls:**

- Говоря `async` сохраняет порядок.
- Модули забывания откладываются по умолчанию.
- Исключение требования CORS для модулей перекрестного происхождения.
**Question:** В чем разница между `async`, `defer`, и `type="module"` при загрузке скриптов?

**Answer:**

| Атрибут | Скачать | Выполнить | Заказать |
|-----------|----------|---------|-------|
| (нет) | Блокирует парсер HTML | Немедленно | Последовательный |
| `defer` | Параллельно | После анализа документа | Сохранено |
| `async` | Параллельно | Как только будет готово | Не гарантировано |
| `type="module"` | Параллельно | После синтаксического анализа (отложенно) | Сохранено; строгий режим |

**Modern practice:** вставь CSS `<head>`; вставьте скрипты приложения `<head>` с `defer` or `type="module"`. Использовать `async` только для независимых скриптов (аналитики). Избегайте сценариев, блокирующих парсер, без атрибутов.

**Examples:**

```html
<script src="app.js" defer></script>
<script src="analytics.js" async></script>
<script type="module" src="app.mjs"></script>
```

**Sources:** [3_js_browser.md](./3_js_browser.md) · [MDN — скрипт](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)

</details>

<details>
  <summary>Q2. Difference between `innerHTML`, `textContent`, and `innerText`?</summary>

### Q2. Difference between `innerHTML`, `textContent`, and `innerText`?

**Definition:** Эти свойства DOM по-разному читают/записывают содержимое элемента — `innerHTML` анализирует разметку (риск XSS), `textContent` возвращает необработанный текст, `innerText` учитывает видимость CSS.

**How it works:**

- `innerHTML` анализирует строку HTML в узлы DOM.
- `textContent` получает/устанавливает весь текст, без анализа HTML.
- `innerText` отражает отображаемый текст (с учетом CSS, медленнее).

| Недвижимость | XSS-риск |
|----------|----------|
| `innerHTML` | Высокий при ненадежном вводе |
| `textContent` | Низкий |

**When to use:** Шаблон рендеринга (`innerHTML` продезинфицировано) · установить имя пользователя (`textContent`) · копировать видимый текст (`innerText`).

**Common pitfalls:**

- С использованием `innerHTML` для пользовательского ввода.
- Предполагая `innerText` включает скрытый текст.
- Спутать с `textContent` в формах.
**Question:** Как `innerHTML`, `textContent`, и `innerText` отличаются?

**Answer:**

| Недвижимость | Разбирает HTML | Уважает видимость CSS | Использование |
|----------|-------------|------------------------|-----|
| `innerHTML` | Да | Н/Д | Вставка/чтение разметки — **риск XSS** при ненадежном вводе |
| `textContent` | Нет | Нет | Безопасное чтение/запись необработанного текста |
| `innerText` | Нет | Да (с учетом макета) | Текст, отображаемый пользователю |

```js
el.innerHTML = "<b>bold</b>";    // renders bold
el.textContent = "<b>bold</b>";  // literal "<b>bold</b>"
```

Никогда не назначайте несанкционированный пользовательский ввод `innerHTML`. Предпочитать `textContent` для пользовательских данных.

**Sources:** [3_js_browser.md](./3_js_browser.md) · [MDN — textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

</details>

<details>
  <summary>Q3. What is Web Accessibility and how do you achieve it in HTML?</summary>

### Q3. What is Web Accessibility and how do you achieve it in HTML?

**Definition:** Доступность Интернета означает, что люди с ограниченными возможностями могут воспринимать, работать, понимать и использовать Интернет. Это достигается с помощью HTML с помощью семантических элементов, меток, замещающего текста и логической структуры.

**How it works:**

- Ответ на собеседование по рамочным структурам WCAG POUR.
- Слой HTML: семантика, метки, alt, заголовки, язык.
- добавки ARIA; не заменяет родные элементы.

| Принцип | HTML-практика |
|-----------|----------------|
| воспринимаемый | `alt`, контраст |
| Работоспособный | `<button>`, клавиатура |

**When to use:** Соответствие требованиям государственного сектора · Оформление заказов в электронной торговле · Приложения с большим количеством форм.

**Common pitfalls:**

- Заявление о том, что только ARIA делает сайт доступным.
- Пропуск тестирования клавиатуры.
- Ошибки формы только для цвета.
**Question:** Объясните веб-доступность. Какие методы HTML имеют наибольшее значение?

**Answer:**

Доступность Интернета означает, что люди с ограниченными возможностями могут воспринимать, работать, понимать и использовать Интернет.

**Interview structure (POUR — WCAG):**

1. **Ощутимое** — `alt` на изображениях; достаточный цветовой контраст; не используйте только цвет для определения значения
2. **Работа** — доступ с клавиатуры; видимый фокус; пропускать ссылки
3. **Понятно** — логические заголовки; четкие этикетки; связанные ошибки формы
4. **Надежный** – действительный семантический HTML; ARIA только тогда, когда собственных элементов недостаточно.

**HTML checklist:** смысловые ориентиры, `<button>` vs `<a>`, `<label for>`, иерархия заголовков, `aria-live` для динамических обновлений, `lang` on `<html>`, пустой `alt=""` для декоративных изображений не используйте `aria-hidden` на фокусируемых узлах.

**Hide vs show to AT:** `hidden`/`display:none` = никто; `aria-hidden="true"` = только зрячий; `.sr-only` = Только АТ.

**See also:** [Доступность](./1_html_a11y.md#accessibility) (дерево, имена, формы, изображения).

**Examples:**

```html
<html lang="en">
  <body>
    <a href="#main">Skip to content</a>
    <main id="main"><h1>Accessible page</h1></main>
  </body>
</html>
```

**Sources:** [MDN — Доступность](https://developer.mozilla.org/en-US/docs/Learn/Accessibility)

</details>

<details>
  <summary>Q3b. Hidden vs aria-hidden vs presentation? How do you write alt text?</summary>

### Q3b. Hidden vs aria-hidden vs presentation? How do you write alt text?

**Definition:** Эти атрибуты скрывают **разные аудитории**. `alt` называет изображения для AT и резервные копии битых изображений — пустые для оформления, описательные для контента, основанные на действиях внутри ссылок/кнопок.

**Answer — hiding:**

| | `hidden` / `display:none` | `aria-hidden="true"` | `role="none"` / `presentation` |
|--|---------------------------|----------------------|--------------------------------|
| Визуальный | Скрытый | Видимый | Видимый |
| АТ | Из дерева | Из дерева | Семантика удалена; **табуляции остаются** |

`.sr-only` = визуально скрыто, но объявлено. Никогда `aria-hidden` на целенаправленном контроле.

**Answer — images:** Значимое против декоративного. Пропускать `alt` → СР может прочитать `src`. Не начинайте со слова «картинка». Логотип в главной ссылке → `alt="Home"`, а не «логотип». Дублировать соседний текст → `alt=""`. Графики → короткие `alt` + длинное описание.

**Sources:** [Скрытие контента](./1_html_a11y.md#hiding-content-from-at-vs-visually) · [Альтернативы текста изображения](./1_html_a11y.md#image-text-alternatives)

</details>

<details>
  <summary>Q4. What are semantic layout principles?</summary>

### Q4. What are semantic layout principles?

**Definition:** Семантическая компоновка использует элементы HTML по их прямому назначению — ориентиры, иерархию заголовков, встроенные элементы управления — а не общие. `<div>` обертки.

**How it works:**

- Ориентиры определяют регионы страницы; один `main`.
- Иерархия заголовков отражает контур, а не размер шрифта.
- Нативные интерактивные элементы для действий и навигации.

| Принцип | Пример |
|-----------|--------|
| Достопримечательности | `<nav>`, `<main>` |
| Элементы управления | `<button>` не дел |

**When to use:** Макет блога · информационная панель · маркетинговый лендинг.

**Common pitfalls:**

- Макеты только для Div в примерах кода для интервью.
- Несколько `h1` без объяснения причин (исключение SPA).
- `section` без заголовков везде.
**Question:** Какие принципы определяют семантически правильную разметку HTML?

**Answer:**

1. Используйте элементы ориентира: `header`, `nav`, `main`, `article`, `section`, `footer`
2. Один логичный заголовок — не пропускайте уровни (`h1` → `h2`, нет `h1` → `h4`)
3. `<button>` за действия; `<a href>` для навигации
4. Каждому входу соответствует связанный `<label>`
5. Значимый `alt` на изображениях; `alt=""` для декоративных изображений
6. Отдавайте предпочтение родным виджетам: `<details>`, `<dialog>` над компонентами на основе div
7. Один `<main>` за страницу

**Examples:**

```html
<header><nav><a href="/">Home</a></nav></header>
<main><article><h1>Title</h1></article></main>
<footer><p>&copy; 2025</p></footer>
```

**Sources:** [MDN — Семантика](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)

</details>

<details>
  <summary>Q5. What is `#shadow-root` in DevTools? What is Shadow DOM?</summary>

### Q5. What is `#shadow-root` in DevTools? What is Shadow DOM?

**Definition:** Shadow DOM прикрепляет инкапсулированное поддерево DOM к элементу, изолируя стили и разметку от остальной части страницы.

**How it works:**

- Теневой корень прикрепляет инкапсулированное поддерево к ведущему элементу.
- Стили находятся внутри теневого дерева; проект слотов Light DOM Children.
- `open` vs `closed` режимы влияют на проверяемость.

| Режим | Инструменты для разработчиков |
|------|----------|
| `open` | `#shadow-root (open)` |
| `closed` | Скрыто от `element.shadowRoot` |

**When to use:** Веб-компоненты · дизайн кнопок системы · встроенные функции браузера (управление видео).

**Common pitfalls:**

- Сказать, что Shadow DOM — это то же самое, что и затенение React.
- Заявление о закрытом режиме – это безопасность.
- Забыты слоты для проецирования контента.
**Question:** Понимаете `#shadow-root (open)` в Инструментах разработчика. Что это такое?

**Answer:**

**Shadow DOM** прикрепляет к элементу скрытое инкапсулированное поддерево DOM. Стили и разметка внутри не вытекают; CSS страницы не проникает (если это явно не разрешено).

`#shadow-root` в DevTools это инкапсулированное дерево.

| Режим | Доступ |
|------|--------|
| `open` | `element.shadowRoot` работает; виден в DevTools как `(open)` |
| `closed` | `shadowRoot` возвращает `null`; сложнее проверить |

Часть **Веб-компонентов** (с настраиваемыми элементами и `<template>`/`<slot>`). Включает повторно используемые компоненты, независимые от платформы.

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

**Sources:** [3_js_browser_extra.md](./3_js_browser_extra.md) · [MDN — Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_comComponents/Using_shadow_DOM)

</details>

<details>
  <summary>Q6. Why are Custom Elements needed?</summary>

### Q6. Why are Custom Elements needed?

**Definition:** Пользовательские элементы позволяют определять новые HTML-теги с перехватчиками жизненного цикла, обеспечивая повторное использование компонентов в любой среде.

**How it works:**

- Зарегистрируйте новые имена тегов в браузере (`customElements.define`).
- Обратные вызовы жизненного цикла: `connectedCallback`, `attributeChangedCallback`.
- Повторное использование в стеках независимо от платформы.

| Плюсы | Минусы |
|------|------|
| Нативный в HTML | ССР/сложность гидратации |
| Инкапсуляция с помощью Shadow DOM | Кривая обучения |

**When to use:** `<user-card>` в дизайн-системе · встраиваемый виджет · постепенный переход от устаревших версий.

**Common pitfalls:**

- Не упоминается правило именования пользовательских элементов (должно содержать дефис).
- Путаница только с компонентами React.
- Пропуск `observedAttributes` для реактивных атрибутов.
**Question:** Какую проблему решают пользовательские элементы?

**Answer:**

Они позволяют вам определять **новые HTML-теги** с крючками жизненного цикла, которые можно повторно использовать на любой странице или в любой платформе:

```js
class UserCard extends HTMLElement {
  static observedAttributes = ["name"];
  connectedCallback() {
    this.textContent = this.getAttribute("name");
  }
}
customElements.define("user-card", UserCard);
```

Используйте при: повторении шаблонов пользовательского интерфейса, необходимости инкапсуляции (Shadow DOM) или создании примитивов системы дизайна, которые работают в React, Vue или простом HTML.

**Examples:**

```html
<user-card name="Ada">
  <h2 slot="title">Ada Lovelace</h2>
  <p>First programmer.</p>
</user-card>
```

**Sources:** [3_js_browser_extra.md](./3_js_browser_extra.md) · [MDN — Пользовательские элементы](https://developer.mozilla.org/en-US/docs/Web/API/Web_comComponents/Using_custom_elements)

</details>

<details>
  <summary>Q7. Does removing HTML whitespace improve page performance?</summary>

### Q7. Does removing HTML whitespace improve page performance?

**Definition:** Минимизация пробелов в HTML оказывает незначительное влияние на производительность, поскольку gzip/Brotli эффективно сжимает пробелы; Вместо этого сосредоточьтесь на изображениях, сценариях и CLS.

**How it works:**

- Gzip/Brotli эффективно сжимает пробелы — небольшая экономия проводов.
- Разница в стоимости парсера незначительна для типичных страниц.
- Пробелы между встроенными элементами влияют на **рендеринг**, а не на передачу.

| Усилия | Воздействие |
|--------|--------|
| Минимизировать пробелы HTML | Незначительный |
| Оптимизация изображения | Высокий |

**When to use:** Уменьшите размер в конвейере сборки (незначительное) · Исправьте межстрочный интервал с помощью CSS, а не NBSP.

**Common pitfalls:**

- Заявление о значительном повышении производительности за счет минимизации HTML.
- Непонятный размер передачи из-за пробелов в макете.
- Игнорирование рычагов LCP/CLS в ответ.
**Question:** Поможет ли минимизация пробелов в HTML значительно улучшить производительность загрузки?

**Answer:**

**Нет существенного влияния.** Gzip/Brotli эффективно сжимает пробелы, поэтому экономия проводов незначительна. Разница в стоимости парсера незначительна для типичных страниц.

**Separate issue — inline whitespace collapsing:** HTML сжимает пробелы между строковыми элементами в одно пространство (`<span>A</span>   <span>B</span>` → «А Б»). Это влияет на рендеринг, а не на размер передачи. Использовать `<pre>` or `white-space: pre` сохранить.

Сосредоточьте усилия на: размерах изображения, `srcset`, скрипты блокировки рендеринга, изображение LCP `fetchpriority`, профилактика CLS.

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

**Definition:** CLS измеряет неожиданное визуальное движение уже видимого контента. Хорошо **≤ 0,1**, плохо **> 0,25**. Это Core Web Vital (с LCP и INP).

**How it works:** Оценка = воздействие × расстояние. Перемещает группу в окна сеанса (промежуток 1 с, максимум 5 с); оценка страницы — **худшее окно**. Щелчки исключают сдвиги на 500 мс.

**Question:** Что такое CLS и как его поддерживать на низком уровне?

**Answer:** Показатель визуальной стабильности. Бронировать `width`/`height` or `aspect-ratio` для изображений, видео, рекламы, iframe; не размещайте баннеры над контентом, видимым в поле зрения; соответствие метрикам резервного шрифта (`size-adjust`); оживлять `transform` нет `top`/`margin`. Полные примечания: [CLS](./1_html_ Performance.md#cls-cumulative-layout-shift).

**Sources:** [web.dev — CLS](https://web.dev/articles/cls)

</details>

<details>
  <summary>Q8. What is a canvas rendering context? 2d vs WebGL?</summary>

### Q8. What is a canvas rendering context? 2d vs WebGL?

**Definition:** Контекст рендеринга холста — это API рисования для `<canvas>` элемент — `2d` для растровой 2D-графики, `webgl`/`webgl2` для 3D с графическим ускорением.

**How it works:**

- `getContext('2d')` — API 2D-рисования в немедленном режиме.
- `webgl`/`webgl2` — GPU-шейдеры, 3D-конвейеры.
- Контекст имеет значение null, если запрошен неподдерживаемый или неправильный тип.

| Контекст | Использование |
|---------|-----|
| `2d` | Фигуры, текст, 2D-диаграммы |
| `webgl2` | 3D, вычисления на графическом процессоре |

**When to use:** Графики (`2d`) · игры (`webgl2`) · фильтры изображений (`2d`).

**Common pitfalls:**

- Сказать, что холст — это вектор (это растровое изображение).
- Нет резервного варианта, когда WebGL недоступен.
- Забывчивость `willReadFrequently` подсказка для 2D чтения.
**Question:** Каковы типы контекста холста для 2D- и 3D-рендеринга?

**Answer:**

```js
const canvas = document.querySelector("canvas");
const ctx2d = canvas.getContext("2d");
const gl    = canvas.getContext("webgl2");
```

| Контекст | Использование |
|---------|-----|
| `"2d"` | 2D-фигуры, текст, диаграммы, редактирование изображений |
| `"webgl"` / `"webgl2"` | 3D-сцены, шейдеры, графика с интенсивным использованием графических процессоров |

`<canvas>` контент основан на растровых изображениях и для его рисования требуется JS. `<svg>` — это векторная разметка DOM — лучше подходит для значков и доступности.

**Examples:**

```html
<canvas id="chart" width="400" height="200"></canvas>
<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 20v-6h4v6z"/></svg>
```

**Sources:** [MDN — холст](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)

</details>

<details>
  <summary>Q9. How do you reuse inline SVG across a page?</summary>

### Q9. How do you reuse inline SVG across a page?

**Definition:** SVG-спрайты с `<symbol>` и `<use>` позволяют определить значок один раз и ссылаться на него несколько раз без дублирования разметки.

**How it works:**

- Определять `<symbol id>` в скрытом спрайте SVG.
- Ссылка с `<use href="#id">` встроенный или внешний спрайт.
- Набор `viewBox` на символе масштабирования.

| Подход | Плюсы |
|----------|------|
| Встроенный спрайт | Никакого дополнительного HTTP |
| Внешний спрайт | Кэшируемый |

**When to use:** Системы иконок · многоцветные иконки · внешний спрайт CDN.

**Common pitfalls:**

- Дублирование полного SVG для каждой иконки.
- Проблемы с внешними спрайтами CORS.
- Отсутствующий `aria-hidden` на декоративных иконах.
**Question:** Как избежать многократного дублирования одной и той же разметки SVG?

**Answer:**

Используйте **спрайт SVG** с `<symbol>` и `<use>`:

```html
<svg style="display:none" aria-hidden="true">
  <symbol id="icon-home" viewBox="0 0 24 24">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </symbol>
</svg>

<svg class="icon" aria-hidden="true"><use href="#icon-home"/></svg>
```

Внешние спрайты: `<use href="/icons.svg#icon-home">` (смотрите CORS). Отдавайте предпочтение спрайтам, а не иконочным шрифтам, поскольку они обеспечивают доступность и четкое масштабирование.

**Sources:** [MDN — использование SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use)

</details>

<details>
  <summary>Q10. How do you optimize SVG files?</summary>

### Q10. How do you optimize SVG files?

**Definition:** Оптимизация SVG уменьшает размер файла и повышает удобство обслуживания за счет удаления метаданных, упрощения путей и использования спрайтов.

**How it works:**

- SVGO удаляет метаданные, упрощает пути, округляет координаты.
- Использовать `currentColor` для тематических иконок.
- Лист спрайтов для многих значков.

| Шаг | Выгода |
|------|--------|
| СВГО | Меньший файл |
| `viewBox` | Адаптивный масштаб |

**When to use:** Миграция иконочных шрифтов · главные иллюстрации · анимированный SVG.

**Common pitfalls:**

- Чрезмерное упрощение путей (видимая потеря качества).
- Огромные встроенные SVG в HTML (раздутый документ).
- Иконочные шрифты вместо SVG в 2025 году.
**Question:** Какие шаги позволяют уменьшить размер файла SVG и улучшить удобство обслуживания?

**Answer:**

1. Запустите **SVGO** — удалите метаданные, уменьшите точность пути.
2. Удалите мусор в редакторе (слои Illustrator/Inkscape).
3. Используйте `viewBox` для масштабирования вместо фиксированных размеров
4. Используйте `currentColor` поэтому значки наследуют цвет текста
5. Объедините в лист спрайтов множество значков.

**Examples:**

```html
<svg class="icon" aria-hidden="true"><use href="#icon-home"/></svg>
```

**Sources:** [SVGO](https://github.com/svg/svgo)

</details>

<details>
  <summary>Q11. What is async form validation? How is it implemented?</summary>

### Q11. What is async form validation? How is it implemented?

**Definition:** Асинхронная проверка формы проверяет значения полей на сервере (например, доступность имени пользователя) с помощью API проверки ограничений с `setCustomValidity()`.

**How it works:**

- Синхронизация: HTML `required`/`pattern` через API проверки ограничений.
- Async: загрузка сервера включена `blur`/`input`, затем `setCustomValidity`.
- Всегда в паре с `reportValidity` и `aria-describedby` за ошибки.

| Слой | Инструмент |
|-------|------|
| Формат | HTML-атрибуты |
| Сервер | `fetch` + `setCustomValidity` |

**When to use:** Доступность имени пользователя · проверка домена электронной почты · проверка кода купона.

**Common pitfalls:**

- Только проверка на стороне клиента.
- Условия гонки при быстром наборе текста (прерывание предварительной выборки).
- Не отключать отправку во время асинхронной проверки.
**Question:** Как вы проверяете поле на сервере (например, полученное имя пользователя) с помощью проверки HTML?

**Answer:**

Сохраняйте встроенную проверку формата; использовать `setCustomValidity` для асинхронных проверок сервера:

```js
usernameInput.addEventListener("blur", async () => {
  const res = await fetch(`/api/check-username?name=${encodeURIComponent(usernameInput.value)}`);
  const { available } = await res.json();
  usernameInput.setCustomValidity(available ? "" : "Username already taken");
  usernameInput.reportValidity();
});
```

Сопряжение с `aria-describedby` указывая на элемент сообщения об ошибке с помощью `role="alert"`.

**Examples:**

```html
<label for="username">Username</label>
<input id="username" name="username" type="text" required aria-describedby="username-error" />
<span id="username-error" role="alert"></span>
```

**Sources:** [MDN — проверка ограничений](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation)

</details>

<details>
  <summary>Q12. What is Content Security Policy (CSP)?</summary>

### Q12. What is Content Security Policy (CSP)?

**Definition:** CSP — это HTTP-заголовок, который заносит в белый список разрешенные источники сценариев, стилей и ресурсов — основная защита на стороне сервера от XSS.

**How it works:**

- Источники ресурсов белого списка HTTP-заголовков (или мета).
- Блокирует встроенный скрипт, если nonce/hash не совпадает.
- Первичное смягчение XSS на уровне доставки.

| Директива | Элементы управления |
|-----------|----------|
| `script-src` | JS-исходники |
| `default-src` | Резервный вариант |

**When to use:** Строгий `script-src 'self'` · nonce для встроенного загрузочного сценария · `frame-ancestors` против кликджекинга.

**Common pitfalls:**

- `unsafe-inline` поражение цели CSP.
- Meta CSP не может быть установлен `frame-ancestors`.
- Забывание nonce в разрешенных встроенных скриптах.
**Question:** Что такое CSP и как он связан с HTML?

**Answer:**

CSP — это HTTP-заголовок (или `<meta http-equiv="Content-Security-Policy">`), что в белые списки разрешены источники сценариев/стилей/ресурсов.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-abc123'
```

**HTML impact:**

* Блоки встроены `<script>` пока не `nonce` или хэш-соответствия
* Блоки `onclick="..."` встроенные обработчики
* Блоки `eval()` если это явно не разрешено
* Использование `<script nonce="abc123">` сопоставление nonce сервера для разрешенных встроенных скриптов

Первичная защита от внедрения XSS через разметку.

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

**Definition:** Использовать `<a href>` для навигации и `<button>` для действий на странице — их смешивание нарушает UX, доступность и поведение клавиатуры.

**How it works:**

- `<a href>` навигация — изменение URL-адреса, открытие во вкладке, закладка.
- `<button>` запускает действия — отправить, переключить, открыть диалог.
- Неправильный выбор нарушает ожидания клавиатуры, SR и пользователей.

| Элемент | Действие по умолчанию |
|---------|----------------|
| `<a href>` | Навигация |
| `<button>` | Отправить, если в форме |

**When to use:** Навигационная ссылка (`a`) · форма отправки (`button type=submit`) · открытое модальное окно (`button type=button`).

**Common pitfalls:**

- `<a href="#">` как кнопка.
- `<button>` стилизованная ссылка без `href` поведение.
- Отсутствующий `type="button"` вызывая случайную отправку.
**Question:** Когда следует использовать `<button>` vs `<a href>`?

**Answer:**

| Элемент | Использовать для |
|---------|---------|
| `<a href="url">` | Навигация — поддерживает открытие в новой вкладке, копирование ссылки, закладку |
| `<button type="button">` | Действия на странице — переключение, открытие диалогового окна, отправка формы |
| `<button type="submit">` | Отправка формы |

С использованием `<a>` для действий JS или `<button>` поскольку навигация нарушает UX, доступность и поведение клавиатуры.

**Examples:**

```html
<a href="/about">About page</a>
<button type="button">Open settings</button>
<button type="submit">Submit form</button>
```

**Sources:** [MDN — а](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)

</details>

<details>
  <summary>Q14. `strong`/`em` vs `b`/`i`?</summary>

### Q14. `strong`/`em` vs `b`/`i`?

**Definition:** `<strong>`/`<em>` несут смысловую значимость и ударение; `<b>`/`<i>` стилистически выделены жирным шрифтом/курсивом и не имеют дополнительного значения для вспомогательных технологий.

**How it works:**

- `strong`/`em` — смысловая значимость и ударение.
- `b`/`i` — стилистический жирный/курсив без дополнительного смысла.
- Программы чтения с экрана могут подчеркивать `strong`/`em`; `b`/`i` обычно нет.

| Пара | Семантический? |
|------|------------|
| `strong`/`em` | Да |
| `b`/`i` | No |

**When to use:** Предупреждение (`strong`) · подчеркнутое слово (`em`) · Визуализация ключевых слов (`b` в абстрактном виде).

**Common pitfalls:**

- С использованием `b` для всех заголовков, выделенных жирным шрифтом.
- CSS `font-weight` против путаницы семантических элементов.
- `i` для иконок (используйте SVG + `aria-hidden`).
**Question:** В чем разница между `<strong>`/`<em>` и `<b>`/`<i>`?

**Answer:**

* `<strong>` / `<em>` — **семантическая** важность и акцент на стрессе (влияет на значение для программ чтения с экрана и SEO)
* `<b>` / `<i>` — **визуальный** жирный/курсив без дополнительной семантики

Использовать семантические элементы по умолчанию; использовать `<b>`/`<i>` только для стилистического смещения без смыслового веса (например, ключевые слова в резюме).

**Examples:**

```html
<p><strong>Warning:</strong> <em>Do not</em> skip heading levels. <b>Keywords</b> in summary.</p>
```

**Sources:** [MDN — сильный](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong)

</details>

<details>
  <summary>Q15. What is the DOM? How does it relate to HTML?</summary>

### Q15. What is the DOM? How does it relate to HTML?

**Definition:** DOM — это живое дерево документа в памяти браузера; HTML — это исходная разметка, которая при синтаксическом анализе преобразуется в узлы DOM.

**How it works:**

- HTML — это сериализованная разметка в ответе.
- Парсер строит живой граф объектов дерева DOM.
- JS мутирует DOM; браузер повторно запускает конвейер рендеринга по мере необходимости.

| | HTML | ДОМ |
|---|------|-----|
| Природа | Статический источник | Живое дерево времени выполнения |

**When to use:** Статическая страница · SPA-увлажнение · `document.querySelector` обновления.

**Common pitfalls:**

- Заявление о том, что HTML и DOM идентичны после запуска JS.
- Путаница DOM с Virtual DOM (концепция фреймворка).
- Забываем, что теневой DOM — это отдельное дерево.
**Question:** Что такое ДОМ?

**Answer:**

**DOM** (объектная модель документа) — это живое дерево документа в памяти браузера. HTML — исходная разметка; анализ HTML **создает** DOM.

```js
document.querySelector("h1").textContent = "Updated";
```

HTML = определение статической структуры. DOM = граф объектов времени выполнения. JS API изменяют DOM; браузер выполняет повторный рендеринг.

**Examples:**

```html
<body><h1 id="title">Hello</h1></body>
```

**Sources:** [3_js_browser.md](./3_js_browser.md) · [MDN — DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)

</details>

<details>
  <summary>Q16. Quirks mode vs standards mode?</summary>

### Q16. Quirks mode vs standards mode?

**Definition:** `<!DOCTYPE html>` запускает стандартный режим; без него браузеры могут войти в режим совместимости с ошибками устаревшего макета.

**How it works:**

- DOCTYPE запускает стандартный режим в современных браузерах.
- Режим Quirks имитирует ошибки устаревшей блочной модели IE.
- Всегда используйте `<!DOCTYPE html>` первая линия.

| Режим | Модель коробки |
|------|----------|
| Стандарты | `box-sizing` согласно спецификации CSS |
| Причуды | Особенности коробки с содержимым |

**When to use:** Старые страницы без DOCTYPE · Особенности наследования iframe · Электронная почта в формате HTML (ограничено).

**Common pitfalls:**

- Случайные строки DOCTYPE из старых шаблонов.
- Объявление XML перед срабатыванием DOCTYPE.
- Предполагается, что режим совместимости исчез (все еще активируется без DOCTYPE).
**Question:** Что происходит без `<!DOCTYPE html>`?

**Answer:**

Браузеры могут перейти в **режим совместимости** — эмулирует ошибки предыдущих версий IE (неправильная модель блока, несогласованный размер). Всегда начинайте с:

```html
<!DOCTYPE html>
```

Это активирует **стандартный режим** (без особенностей) во всех современных браузерах.

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

**Task:** Найдите и исправьте все проблемы в этой разметке.

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

| Выпуск | Исправить |
|-------|-----|
| `div.header` | `<header>` + `<nav>` ориентир |
| `onclick` на div | `<a href>` для навигации; `<button type="submit">` для действий |
| `h3` в качестве заголовка страницы | `<h1>` — один основной заголовок на странице |
| Отсутствующий `alt` | Описательный `alt` текст |
| Нет `width`/`height` | Размеры для предотвращения CLS |
| Ввод без метки | `<label for="email">` |
| `placeholder` только | Этикетка обязательна; заполнитель является необязательной подсказкой |
| `div.main` | `<main id="main">` ориентир |

</details>

</details>

<details>
  <summary>Task 2 — Fix bad HTML (security & performance)</summary>

### Task 2 — Fix bad HTML (security & performance)

**Task:** Исправьте проблемы с безопасностью и загрузкой.

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

* Аналитика → `async` (независимый, не зависит от порядка)
* Скрипт приложения → `defer` (выполняется после синтаксического анализа по порядку) + **SRI** `integrity`
* `target="_blank"` → добавить `rel="noopener noreferrer"` (предотвращает `window.opener` атаковать)
* iframe → `title` для a11y, `sandbox` ограничить возможности, `loading="lazy"` если ниже сгиба

</details>

</details>

---

### Coding tasks

<details>
  <summary>Task 3 — HTMLConstruct: fluent HTML string builder</summary>

### Task 3 — HTMLConstruct: fluent HTML string builder

**Task:** Внедрите свободный API (из 0_interview.md Q147):

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

**Interview points:** доступ к вложенным свойствам функций, экранирование пользовательского текста (XSS), поддержка как дочерних строк, так и вызовов вложенных тегов.

</details>

</details>

<details>
  <summary>Task 4 — Find all HTML links in a string (0_interview.md Q142)</summary>

### Task 4 — Find all HTML links in a string (0_interview.md Q142)

**Task:** Напишите функцию, которая извлекает все `href` значения из `<a>` теги в строке HTML.

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

**Caveat:** прерывается из-за неправильного HTML-кода, вложенных тегов или `href` без кавычек. Упоминание в интервью; не использовать в производстве.

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

Собственный браузерный анализ корректно обрабатывает крайние случаи. Предпочитайте это в реальном коде.

</details>

</details>

<details>
  <summary>Task 5 — Build accessible semantic page skeleton</summary>

### Task 5 — Build accessible semantic page skeleton

**Task:** Напишите HTML для страницы сообщения в блоге с: заголовком сайта, навигацией, основным контентом (статья с рисунком), боковой панелью, нижним колонтитулом. Должен пройти базовую проверку на 11 лет.

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

**Checklist:** `lang`, пропустить ссылку, ориентиры, один `h1`, `figure`/`figcaption`, изображение `alt` + размеры, `aria-label` в режиме навигации/в сторону, `time datetime`.

</details>

</details>

---

### Quick oral questions (self-check)

Попробуйте ответить, не глядя, а затем раскройте каждый вопрос.

1. В чем разница между **тегом**, **элементом** и **атрибутом** HTML?
2. Что такое **пустые элементы**? Назовите пять.
3. Что происходит, когда вы вводите URL-адрес? (конвейер браузера)
4. Что такое **критический путь рендеринга**?
5. Зачем ставить `width` и `height` on `<img>`?
6. При использовании `<picture>` vs `srcset` on `<img>`?
7. В чем разница между `<section>` и `<article>`?
8. Что означает `rel="noopener noreferrer"` предотвращать?
9. Что такое API проверки ограничений?
10. Каковы три спецификации веб-компонентов?
11. Что такое **декларативный теневой DOM**?
12. Что такое **Popover API**?
13. Что означает `inert` атрибут делать?
14. Для чего используется **JSON-LD**?
15. Что такое `hreflang` для?
16. Что такое **прогрессивная визуализация**?
17. Почему `requestAnimationFrame` над `setInterval` для анимации?

<details>
  <summary>Answers</summary>

### Answers

1. **Тег** — синтаксис разметки (`<p>`). **Элемент** — узел DOM (тег + контент). **Атрибут** — метаданные элемента (`class`, `href`).
2. **Пустые элементы** не имеют закрывающего тега или содержимого: `<img>`, `<br>`, `<input>`, `<meta>`, `<link>`.
3. **Конвейер URL-адресов:** DNS → TCP/TLS → HTTP → HTML → DOM + CSSOM → Дерево рендеринга → Макет → Paint → Композитный.
4. **Критический путь рендеринга** — последовательность от HTML/CSS/JS до первой отрисовки; ресурсы, блокирующие парсер, задерживают его.
5. **`width`/`height`** — браузер резервирует место перед загрузкой изображения → предотвращает CLS (смещение макета).
6. **`<picture>`** — художественное оформление или резервный формат (AVIF/WebP/JPEG). **`srcset` on `<img>`** — только адаптивный выбор разрешения.
7. **`<section>`** — тематическая группировка с заголовком. **`<article>`** — самостоятельный распространяемый контент.
8. **`noopener`** — новая вкладка недоступна `window.opener`. **`noreferrer`** — заголовок Referer не отправлен.
9. **API проверки ограничений** — встроенная проверка формы: `required`, `pattern`, `checkValidity()`, `setCustomValidity()`, `:valid`/`:invalid`.
10. **Пользовательские элементы**, **Теневой DOM**, **Шаблоны HTML** (`<template>` + `<slot>`).
11. **Декларативный теневой DOM** — встроить `<template shadowrootmode="open">` в HTML без конструктора JS.
12. **Popover API** — `popover` атрибут + `popovertarget`; собственные наложения верхнего слоя с отключением света.
13. **`inert`** — элемент и его потомки исключены из взаимодействия, фокуса и поиска на странице.
14. **JSON-LD** — структурированные данные в формате `<script type="application/ld+json">` для расширенных результатов поиска.
15. **`hreflang`** — сообщает поисковым системам, какой URL-адрес для какого языка/региона (`<link rel="alternate" hreflang="de">`).
16. **Прогрессивный рендеринг** — рисуйте полезные пиксели заранее: потоковый HTML, критический CSS, неблокирующий JS, ленивый сгиб ниже.
17. **rAF** запускается перед следующей отрисовкой (~60 кадров в секунду), пауза в фоновом режиме; `setInterval(16)` может дергаться или догонять после скрытой вкладки. Оживить `transform`/`opacity`.

</details>


