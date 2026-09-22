# CSS — Interview

Вопросы и ответы на собеседовании и дела, требующие быстрого решения.

[ ← Вернуться в центр](./2_css.md)

### Related docs

* [CSS — Core](./2_css_core.md) · [CSS — Layout](./2_css_layout.md) · [CSS — Visual](./2_css_visual.md) · [CSS — Motion](./2_css_motion.md) · [CSS — Modern](./2_css_modern.md) · [CSS — Архитектура](./2_css_architecture.md) · [CSS — Интервью](./2_css_interview.md)

### Sections

- [Questions & Answers](#questions-answers)
- [Quick fixes (cases)](#quick-fixes-cases)

---

## Questions & Answers

<details>
  <summary>What is the CSS box model?</summary>

### What is the CSS box model?

**Definition:** Содержимое → отступ → граница → поле. `width`/`height` по умолчанию — поле содержимого; `box-sizing: border-box` включает отступы и границы. Вертикальные поля схлопываются между одноуровневыми блоками.

</details>

<details>
  <summary>How do you center content horizontally and vertically?</summary>

### How do you center content horizontally and vertically?

**Definition:** Флексбокс (`justify-content` + `align-items`), Сетка (`place-items: center`), or `margin-inline: auto` для горизонтального центрирования блока. Абсолют + `transform: translate(-50%, -50%)` когда вне потока.

</details>

<details>
  <summary>Layout approaches: float, flex, grid?</summary>

### Layout approaches: float, flex, grid?

**Definition:** Плавающее — устаревший вариант, перенос текста/старые столбцы. Flexbox — 1D-макет компонента. Сетка — 2D-матрицы страниц/карточек. Современные приложения: оболочка Grid + внутренние компоненты Flex.

</details>

<details>
  <summary>How do you make an app responsive?</summary>

### How do you make an app responsive?

**Definition:** CSS, ориентированный на мобильные устройства, гибкие единицы измерения (`%`, `fr`, `clamp`, `rem`), Flexbox/Grid, медиа-запросы, контейнерные запросы для компонентов, адаптивные изображения (`srcset`), тестируйте реальные устройства.

</details>

<details>
  <summary>Why vendor prefixes? How to simplify cross-browser CSS?</summary>

### Why vendor prefixes? How to simplify cross-browser CSS?

**Definition:** Префиксы (`-webkit-`) предназначались для экспериментальных функций. Сегодня: Autoprefixer + Browserslist, проверьте caniuse.com, прогрессивное улучшение, `@supports` функциональные запросы.

</details>

<details>
  <summary>CSS preprocessors — what do they add?</summary>

### CSS preprocessors — what do they add?

**Definition:** Переменные, вложенность, миксины, функции, частичный импорт. Скомпилируйте в CSS. Многие вложения/переменные теперь встроены; Sass по-прежнему ценен для примесей и инструментов для токенов.

</details>

<details>
  <summary>CSS custom properties — use cases?</summary>

### CSS custom properties — use cases?

**Definition:** Темы (светлые/темные), токены компонентов, обновления среды выполнения из JS, область действия каждого компонента, `var()` с резервными вариантами. В отличие от переменных Sass, они каскадируются в браузере.

</details>

<details>
  <summary>How does CSS Grid work?</summary>

### How does CSS Grid work?

**Definition:** Определите столбцы/строки в контейнере (`grid-template-*`), размещайте предметы с `grid-column`/`grid-row`/`grid-area`. Использовать `fr`, `minmax`, `auto-fit`/`auto-fill`, `gap` для адаптивных сеток без медиа-запросов.

</details>

<details>
  <summary>Track animation/transition end in JS?</summary>

### Track animation/transition end in JS?

**Definition:** `transitionend` (проверять `propertyName`) и `animationend` события на элементе.

</details>

<details>
  <summary>GPU-accelerated properties and compositor layers?</summary>

### GPU-accelerated properties and compositor layers?

**Definition:** `transform`, `opacity`, `filter` часто составной на графическом процессоре. Слои изолируют, перерисовываются. Слишком много слоев → нехватка памяти → сбои в мобильной вкладке. Избегайте чрезмерного использования `will-change`.

</details>

<details>
  <summary>When use translate() vs absolute positioning?</summary>

### When use translate() vs absolute positioning?

**Definition:** Анимировать с помощью `transform: translate()` — без перекомпоновки макета, компоновка с использованием графического процессора. Абсолютный `top`/`left` запускает макет и работает медленнее для анимации.

</details>

<details>
  <summary>display: none vs visibility: hidden?</summary>

### display: none vs visibility: hidden?

**Definition:** `display: none` — удалено из макета и дерева a11y. `visibility: hidden` — сохраняет пространство, не окрашенное, все еще в дереве.

**How it works:**

- `display: none` — нет ящика, нет событий, исключенных из дерева доступности; дети тоже спрятаны.
- `visibility: hidden` — коробка участвует в раскладке; не окрашенный; потомки могут переопределить с помощью `visibility: visible`.
- `opacity: 0` — все еще в макете и дереве a11y; получает события указателя, если только `pointer-events: none`.

**When to use:** Скрыть модальные окна за пределами экрана → `display: none` or `hidden` атрибут; сохранить макет при загрузке → `visibility: hidden`; плавные переходы → `opacity` + `pointer-events: none`.

</details>

<details>
  <summary>Specificity and !important?</summary>

### Specificity and !important?

**Definition:** Кортеж специфичности: встроенный > ID > класс/псевдокласс/атрибут > тип. `:where()` = 0 специфичность. `:is()` = наивысший аргумент. `!important` инверсии в пределах одного начала. `@layer` управляет каскадными слоями.

**How it works:**

- Кортеж специфичности `(a, b, c)`: встроенные стили, идентификаторы, классы/атрибуты/псевдоклассы, типы/псевдоэлементы.
- Сравните слева направо; ничья → более поздний заказ источника выигрывает.
- `!important` меняет значение в пределах одного происхождения — автор `!important` бьет автора нормально.
- `@layer` порядок важнее специфичности среди многоуровневых авторских стилей; однослойные биты многослойные.

**When to use:** Предпочитаю классы с низкой специфичностью + `@layer` по идентификаторам/`!important`; использовать `:where()` для сбросов; `:is(.a, #x)` наследует `#x` специфичность — избежать случайного веса.

</details>

<details>
  <summary>vh/vw pitfalls?</summary>

### vh/vw pitfalls?

**Definition:** `100vh` на мобильном устройстве непоследовательно включается браузер Chrome — используйте `dvh`. Размеры шрифта в `vw` в одиночку плохо масштабируется — используйте `clamp()`. Для процентной высоты требуется определенная родительская высота.

**How it works:**

- `vh`/`vw` — относительно размера области просмотра; `100vh` = полная высота области просмотра, но строка URL-адреса мобильного устройства вызывает скачки переполнения.
- `dvh`/`svh`/`lvh` — динамические/маленькие/большие единицы просмотра адаптируются к мобильному Chrome.
- `%` Высота требует явной высоты для каждого предка — процент разрешается относительно содержащего блока.

**When to use:** Полноэкранный герой → `min-height: 100dvh`; тип жидкости → `clamp(1rem, 2vw + 0.5rem, 2rem)` не сырой `vw`; ребенок `height: 100%` → установить `html, body { height: 100% }` цепь.

</details>

<details>
  <summary>Best units for font-size?</summary>

### Best units for font-size?

**Definition:** `rem` для глобального масштаба (относительно корня). `em` для определения размеров относительно компонентов. Избегать `px` для корневого текста, размер которого может изменяться пользователем.

**How it works:**

- `rem` — относительно корня `font-size` (обычно 16 пикселей); предсказуемо, не усугубляется при вложении.
- `em` — относительно **собственного элемента** `font-size`; соединения во вложенных компонентах.
- `px` — абсолютный; игнорирует настройки размера шрифта браузера пользователя, если не указан root `px`.

**When to use:** Масштаб тела/заголовка → `rem`; отступ кнопки относительно текста кнопки → `em`; границы/тени → `px` все в порядке.

</details>

<details>
  <summary>Why avoid shorthand carelessly?</summary>

### Why avoid shorthand carelessly?

**Definition:** Сокращение сбрасывает пропущенные подсвойства (например, `background:` очищает `background-image`). Используйте ручную запись при переопределении отдельных подсвойств.

**How it works:**

— Сокращение устанавливает все подсвойства — пропущенные сбрасываются до начальных значений, а не наследуются.
- `background: #fff` салфетки `background-image`, `background-position`, и т. д.
- `font: 400 1rem/1.5 sans-serif` сбрасывает `font-stretch`, `font-variant`, и т. д.

**When to use:** Только переопределить `background-color` → используйте от руки; установить полный стек шрифтов один раз с включенной сокращенной записью `body`, затем вручную вносим изменения в детей.

</details>

<details>
  <summary>CSS methodologies?</summary>

### CSS methodologies?

**Definition:** БЭМ (block__element--модификатор), OOCSS, SMACSS, ITCSS. Цель: предсказуемая специфика, повторно используемые компоненты, слаженность команды.

**How it works:**

- **BEM** — соглашение об именах. `block__element--modifier`; плоские селекторы, низкая специфичность.
- **OOCSS** — отдельная структура (макет) от скина (темы); повторно использовать базовые объекты.
- **SMACSS** — классифицировать: база, макет, модуль, состояние, тема.
- **ITCSS** — перевернутый треугольник: дженерики → элементы → объекты → компоненты → утилиты (повышение специфичности).

**When to use:** Большие команды → BEM или ITCSS; сложные SPA → Tailwind заменяет большую часть BEM; Области CSS-модулей без подробных имен.

</details>

<details>
  <summary>Progressive enhancement for limited browsers?</summary>

### Progressive enhancement for limited browsers?

**Definition:** Основной контент работает без расширенного CSS; `@supports` для улучшений; полифилы экономно; протестируйте целевые браузеры через Browserslist.

**How it works:**

- Базовый макет работает с резервным вариантом flexbox или простым потоком блоков.
- `@supports (display: grid)` завершает улучшения сетки.
— Autoprefixer обрабатывает префиксы поставщиков из списка браузеров, а не анализирует их вручную.
- Обнаружение функций, а не обнаружение браузера (`user-agent` нюхать).

**When to use:** Макет сетки с гибким резервным вариантом; `backdrop-filter` эффект стекла за твердым откатом; контейнерные запросы с резервным медиа-запросом.

</details>

<details>
  <summary>position: sticky not working?</summary>

### position: sticky not working?

**Definition:** Проверить: предок `overflow: hidden/auto`, отсутствующий `top`/`bottom`, родительский элемент не прокручивается, недостаточная высота родительского элемента, элемент не находится в контейнере прокрутки.

**How it works:**

- `sticky` остается в пределах своего **ближайшего предка прокрутки** при смещении (`top`) доволен.
- Любой предок с `overflow: hidden|auto|scroll` (нет `visible`) становится контейнером прокрутки — липкий может прилипать к небольшому прямоугольнику, а не к области просмотра.
— Прикрепленному элементу требуется место для прокрутки внутри родительского элемента — родительский элемент должен быть выше прикрепленного дочернего элемента.

**When to use:** Контрольный список отладки: (1) установлено `top: 0`; (2) проверить предка `overflow`; (3) убедитесь, что контейнер прокрутки имеет высоту; (4) нет `display: table` родительские причуды.

</details>

<details>
  <summary>Styling SVG?</summary>

### Styling SVG?

**Definition:** Использовать `fill`, `stroke`, `stroke-width`. `currentColor` наследует цвет текста. Некоторые свойства HTML не применяются.

**How it works:**

— Встроенный SVG наследует CSS из документа; `fill`/`stroke` заменять `background`/`border`.
- `currentColor` on `fill` or `stroke` синхронизируется с `color` — простая интеграция тем.
- Внешний SVG через `<img>` невозможно стилизовать с помощью CSS — используйте встроенный SVG или `mask-image`.

**When to use:** Системы иконок → встроенный SVG + `fill: currentColor`; состояния наведения через CSS `.icon path`; спрайты с `<symbol>` + `<use>`.

</details>

<details>
  <summary>px vs em vs rem?</summary>

### px vs em vs rem?

**Definition:**

Использовать `rem` для глобальной типографики и интервалов; `em` для внутреннего масштабирования компонента (отступы кнопок относительно размера шрифта кнопки).

* **px** — абсолютные CSS-пиксели; подходит для границ/теней; плохо подходит для доступного корневого масштабирования
* **em** — относительно **элемента** `font-size`; соединения при вложении
* **rem** — относительно **root** `font-size`; предсказуемый интервал/масштаб шрифта

**How it works:** `px` — абсолютные CSS-пиксели; `em` соединения от исходного `font-size`; `rem` всегда ссылки `<html>` размер шрифта — один из источников достоверных данных о масштабах шрифта/интервалов.

**When to use:** Глобальная типография → `rem`; внутреннее заполнение компонента → `em`; тонкая граница → `px`.

</details>

<details>
  <summary>What happens with * { box-sizing: border-box; }?</summary>

### What happens with * { box-sizing: border-box; }?

**Definition:** Каждый элемент (и псевдоэлементы, если они включены) использует `border-box` размеры: `width`/`height` включить отступы и границы. Предотвращает вытеснение фиксированных макетов отступами. Стандартная схема сброса:

**How it works:** `border-box` включает отступы и границы в `width`/`height` — поле размером 200 пикселей с отступом в 20 пикселей остается общим размером 200 пикселей, а не 240 пикселей.

**When to use:** Универсальный сброс включен `*, *::before, *::after`; альтернатива: включить `html { box-sizing: border-box }` и `inherit` на детях.

**Examples:**

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

Не влияет на маржу. Наследуется потомками, если вы установите его `html` вместо `*`.

</details>

<details>
  <summary>How do you adapt a page for print?</summary>

### How do you adapt a page for print?

**Definition:** Использовать `print` медиа-запрос; избегайте темного фона; разверните ссылки, если они полезны; страница управления разрывается на `break-before` / `break-after`. Полный обзор: **Печатные и страничные материалы**.

**How it works:** `@media print` применяется только при печати или экспорте PDF; скрыть несущественный пользовательский интерфейс; установить светлый фон для экономии чернил; `break-*` контролирует нумерацию страниц.

**When to use:** Скрыть навигацию/рекламу; расширять `href` в ссылках; набор `12pt` основной шрифт; `break-inside: avoid` на рисунках/таблицах.

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

Полностью стайлинг `<select>` по-прежнему ограничена кроссбраузерность — рассмотрите возможность использования специального раскрывающегося компонента для полного контроля. Полный обзор: **Форма и стиль встроенного элемента управления**.

* `appearance: none` — удалить Chrome по умолчанию в ОС (затем пересобрать с помощью CSS)
* `accent-color` — флажки, радиоприемники, входы диапазона
* `::placeholder` — текст-заполнитель
* `::file-selector-button` — кнопка ввода файла
* `:focus-visible` — кастомное кольцо фокусировки

**How it works:** `appearance: none` убирает хром ОС — перестраиваете границы/стрелки; `accent-color` родные элементы управления оттенками; Стиль раскрывающегося списка остается под контролем ОС.

**When to use:** Пользовательский флажок/радио с `appearance: none` + псевдоэлементы; `<select>` только закрытое состояние — для полного контроля требуется специальный компонент с ARIA.

</details>

<details>
  <summary>What is progressive rendering?</summary>

### What is progressive rendering?

**Definition:**

Предоставляйте контент поэтапно, чтобы пользователи могли быстро увидеть что-то — методы CSS/медиа поверх критического пути HTML.

1. **Критический CSS** встроен для верхней части страницы.
2. **Async/defer** некритичный CSS
3. **`content-visibility: auto`** для нижних секций
4. **Отложенная загрузка** изображений и шрифтов.
5. **Скелетные экраны** при загрузке данных

Цель: улучшить FCP/LCP, не блокируя рендеринг полного пакета CSS.

**How it works:** Браузер рисует постепенно — критический CSS блокирует первую отрисовку; отсрочка остального и отложенного контента позволяет пользователям быстрее видеть оболочку.

**When to use:** Встроенный критический CSS для верхней части страницы; асинхронная загрузка; `content-visibility: auto` на длинных страницах; заполнители скелета.

**Thoughts:** Определение конвейера и ответ на собеседовании → [1_html.md — Прогрессивная отрисовка](./1_html_rendering.md#browser--rendering).

</details>

<details>
  <summary>Lazy-loading media on a page?</summary>

### Lazy-loading media on a page?

**Definition:** Фоновые изображения только на CSS: Intersection Observer в JS или `content-visibility` для разделов. Адаптивные изображения: `srcset` + `sizes`. Шрифты: `font-display: swap`, подмножество шрифтов, предварительно загружайте только критические веса.

**How it works:** `loading="lazy"` откладывает выборку изображения/iframe за кадром до тех пор, пока он не приблизится к области просмотра; `decoding="async"` позволяет избежать блокировки основного потока; шрифты через `font-display: swap` + предварительная загрузка только критических весов.

**When to use:** Изображения ниже; образ героя `fetchpriority="high"` + нет ленивости; нужны фоновые изображения `IntersectionObserver` or `content-visibility`.

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

Контрольный список для живого кодирования/ревью кода:.

1. **Войны специфики** — замена идентификаторов/`!important` с более простыми селекторами или `@layer`
2. **Магические числа** — используйте собственные свойства или масштаб интервалов.
3. **Плавающие макеты** — переход на гибкие/сетчатые макеты.
4. **Отсутствует `box-sizing`** — добавить сброс рамки
5. **Не реагирует на фиксированную ширину** — используйте `max-width`, `clamp`, `minmax`
6. **Глубокая вложенность** — сглаживание селекторов; избегать `.a .b .c .d`
7. **Сокращенные обозначения** – стенограмма при переопределении одного подсвойства.
8. **Доступность** — стили фокусировки, контрастность, `prefers-reduced-motion`

**How it works:** Обзор кода на собеседовании проверяет, заметили ли вы проблемы с удобством сопровождения, производительностью и другими проблемами, а не просто «выглядит ли он правильно».

**When to use:** Живое кодирование — расскажите о каждом исправлении; предпочитать `@layer` над `!important`; перенести поплавки в сетку; добавлять `min-width: 0` при переполнении гибкого текста.

</details>

<details>
  <summary>Faux bold and faux italic fonts?</summary>

### Faux bold and faux italic fonts?

**Definition:** Когда браузер синтезирует жирный/курсивный шрифт, поскольку отсутствует точный файл толщины/стиля шрифта. Выглядит хуже, чем настоящие файлы шрифтов.

**How it works:**

Браузер синтезирует жирный/курсивный шрифт, когда запрошенный файл веса/стиля отсутствует — наклонная геометрия, а не настоящие курсивные глифы.

загрузить фактическое `font-weight` / `font-style` варианты в `@font-face`или используйте переменный шрифт с полным диапазоном осей. Избегать `font-weight: 700` если бы только `400` загружен.

**When to use:** Нагрузка `font-weight: 400 700` диапазон в переменном шрифте; или отдельный `@font-face` за вес; проверьте DevTools → Вычисляемый → визуализированный шрифт.

</details>

<details>
  <summary>Image formats that support animation?</summary>

### Image formats that support animation?

**Definition:**

CSS `animation` / `@keyframes` Свойства анимации — это не то же самое, что форматы анимированных изображений.

* **GIF** — устаревшая версия, 256 цветов, большие файлы.
* **APNG** — на основе PNG, качество лучше, чем GIF.
* **WebP** — анимированный WebP, хорошее сжатие.
* **AVIF** — анимированный AVIF, лучшее сжатие, растущая поддержка.

**How it works:** Отличие от CSS `@keyframes` — это растровые/векторные **форматы файлов** с несколькими кадрами. `<img>` or `<video>` отображает их; CSS анимирует свойства элементов, а не фреймов файлов.

**When to use:** Короткие циклы → WebP/APNG; лучшее сжатие → AVIF; устаревшая электронная почта → GIF; сложное движение → предпочесть `<video>` или Лотти.

</details>

<details>
  <summary>How do you reuse inline SVG icons?</summary>

### How do you reuse inline SVG icons?

**Definition:** Определите один раз, ссылку с помощью `<use>`:.

**How it works:** `<symbol>` определяет геометрию один раз; `<use href="#id">` экземпляры ссылаются на него — одно определение DOM, множество рендерингов. `currentColor` on `fill` наследует текст `color`.

**When to use:** Кнопка со значком → `<svg class="icon"><use href="#icon-close"/></svg>`; React → обернуть компонентом; большие наборы → альтернатива спрайту или иконочному шрифту, оптимизированному для SVGO.

**Examples:**

```html
<svg style="display:none">
  <symbol id="icon-close" viewBox="0 0 24 24">
    <path d="M6 6l12 12M18 6L6 18"/>
  </symbol>
</svg>

<svg class="icon"><use href="#icon-close"/></svg>
```

Стиль с `fill: currentColor`. Для многих значков используйте лист спрайтов SVG или библиотеку компонентов значков.

</details>

<details>
  <summary>What is a Block Formatting Context (BFC)?</summary>

### What is a Block Formatting Context (BFC)?

**Definition:** Изолированный блок макета, в котором блоки располагаются вертикально, а внутри находятся поплавки. Создать с `display: flow-root`, `overflow: auto/hidden`, гибкий/сетчатый контейнер или `float`. Используется для очистки плавающих элементов, предотвращения схлопывания полей и изоляции макета.

**How it works:** BFC — это независимая область макета — элементы с плавающей запятой не ускользают; поля соседних блоков схлопываются только в пределах одного BFC; `flow-root` это современная замена Clearfix.

**When to use:** Содержать поплавки → `display: flow-root` на родителе; предотвратить коллапс полей между братьями и сестрами → отдельные BFC; изолировать наложение z-индекса.

</details>

<details>
  <summary>Reflow vs repaint vs composite?</summary>

### Reflow vs repaint vs composite?

**Definition:** Layout/reflow — изменение геометрии (`width`, `margin`). Paint — визуальные изменения без верстки (`background`, `color`). Композитный — слои графического процессора (`transform`, `opacity`). Предпочитайте свойства, удобные для компоновщика, для анимации.

**How it works:** Смена стиля → перерасчет → макет (если геометрия) → раскраска (если пиксели) → композит (если слои). Каждый шаг стоит дороже предыдущего для больших страниц.

**When to use:** Оживить `transform`/`opacity` только; пакетное чтение/запись DOM; `will-change` экономно — чрезмерное использование создает нагрузку на память.

</details>

<details>
  <summary>Flex item text overflowing — why?</summary>

### Flex item text overflowing — why?

**Definition:** По умолчанию `min-width: auto` предотвращает сжатие гибких элементов ниже ширины содержимого. Исправить: `min-width: 0` (or `min-height: 0` в столбце flex) на переполненном дочернем элементе; добавлять `overflow: hidden` + `text-overflow: ellipsis` если необходимо.

**How it works:** Гибкий стандарт по умолчанию `min-width: auto` = минимальный размер содержимого — длинные непрерывные строки отказываются сжиматься, переполняя гибкий контейнер.

**When to use:** Обрезать текст на боковой панели → `min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap` на гибком ребенке.

</details>

<details>
  <summary>Explicit vs implicit CSS Grid?</summary>

### Explicit vs implicit CSS Grid?

**Definition:** Явная сетка = треки, которые вы определяете в `grid-template-*`. Неявная сетка = автоматически создаваемые строки/столбцы для дополнительных элементов; контроль с `grid-auto-rows`, `grid-auto-columns`, `grid-auto-flow`.

**How it works:** Предметы за пределами `grid-template-columns` перетекать в неявные дорожки размером `grid-auto-rows`/`grid-auto-columns` (по умолчанию `auto`).

**When to use:** Фиксированная 3-колоночная верстка → явный шаблон; список неизвестных предметов → `grid-auto-flow: row` с `grid-auto-rows: minmax(100px, auto)`.

</details>

<details>
  <summary>How to avoid loading cached CSS/JS files after deploy?</summary>

### How to avoid loading cached CSS/JS files after deploy?

**Definition:**

1. **Хеш содержимого в имени файла** (лучше всего) — `main.a1b2c3d4.css` через сборку Webpack/Vite

2. **Строка запроса** — `styles.css?v=1.2.3` (слабее; некоторые прокси игнорируют строки запроса)
3. **`Cache-Control` заголовки** — `max-age` для статических активов; `no-cache` для `index.html`
4. **Service Worker** — обновление кеша при новом развертывании.
**Очистка кеша** – измените URL-адрес при изменении содержимого файла, чтобы браузеры получали новый файл:

**How it works:** Браузеры кэшируют по URL-адресу — тот же URL-адрес = кэшированный файл даже после развертывания. Хэш содержимого в имени файла меняет URL-адрес при изменении байтов.

**When to use:** Выдача Vite/Webpack `main.[hash].css`; `index.html` получает `no-cache` заголовок; запрос `?v=` слабее (некоторые CDN игнорируют строки запроса).

**Examples:**

```html
<link rel="stylesheet" href="/assets/main.css?v=BUILD_ID">
```

Производственные сборки должны автоматически считывать хешированные имена файлов. Никогда не полагайтесь на ручную очистку кэша для пользователей.

</details>

<details>
  <summary>What is a containing block?</summary>

### What is a containing block?

**Definition:** Поле, используемое для вычисления положения элемента и процентных размеров. Для `absolute` — ближайший позиционированный предок; для `fixed` — окно просмотра; для `static`/`relative` — поле содержимого предка. См. раздел **Содержащий блок** в разделе Модель блока и отображение.

**How it works:** Процент `width`/`height`/`top`/`left` разрешить размеры содержащего блока — неправильный предок = неправильные проценты.

**When to use:** `position: absolute` ребенок → ближайший `position` ≠ `static` предок; `transform` по предку делает его содержащим блок для `fixed` слишком.

</details>

<details>
  <summary>Why does flex need min-width: 0?</summary>

### Why does flex need min-width: 0?

**Definition:** Гибкие элементы по умолчанию имеют значение `min-width: auto` (= минимум контента). Длинный текст предотвращает сжатие → переполнение. Исправить: `min-width: 0` (or `min-height: 0` в столбце flex) на переполненном дочернем элементе. Та же идея, что и `minmax(0, 1fr)` в Гриде.

**How it works:** `min-width: auto` предотвращает сжатие ниже внутренней ширины содержимого — гибкий элемент не сжимается при многоточии или усечении.

**When to use:** То же, что и гибкое переполнение — сетка `minmax(0, 1fr)` решает аналогичную проблему на сеточных дорожках.

</details>

<details>
  <summary>auto-fit vs auto-fill?</summary>

### auto-fit vs auto-fill?

**Definition:** Оба используют `repeat(auto-*, minmax(min, 1fr))`. `auto-fill` сохраняет пустые дорожки в качестве заполнителей. `auto-fit` сворачивает пустые дорожки, поэтому существующие столбцы **растягиваются**, чтобы заполнить строку. Использовать `auto-fit` для адаптивных сеток карточек, которые растут, заполняя пространство.

**How it works:** С 3 элементами в строке, состоящей из 5 столбцов — `auto-fill` оставляет 2 пустых трека; `auto-fit` сворачивается и становится пустым, поэтому 3 элемента расширяются до ширины заполнения.

**When to use:** Сетка карточек, которая растет → `auto-fit`; исправлено ощущение количества столбцов с пробелами → `auto-fill`.

</details>

<details>
  <summary>Intrinsic vs extrinsic sizing?</summary>

### Intrinsic vs extrinsic sizing?

**Внутренний** — размер зависит от содержимого (`min-content`, `max-content`, `fit-content`, `width: auto`). **Внешний** — размер, заданный извне (`width: 300px`, `flex: 1`, процентная ширина). Ловушка для интервью: внутренний минимум контента блокирует гибкость/сжатие сетки.

**How it works:** `min-content` = самое длинное слово; `max-content` = без упаковки; внешние размеры переопределяются, если только `min-width: auto` предотвращает усадку.

**When to use:** Боковая панель под размер → `min-width: 0`; изображение макс → `max-width: 100%; height: auto`.

</details>

<details>
  <summary>100vh vs 100dvh?</summary>

### 100vh vs 100dvh?

**Definition:** `100vh` — это статическая высота области просмотра. На мобильных устройствах она часто включает пространство за строкой URL-адреса браузера, что приводит к переполнению. `100dvh` (динамическая высота области просмотра) адаптируется к показу/скрытию мобильного Chrome. Предпочитать `dvh` для полноэкранных макетов; пара с `env(safe-area-inset-*)` на устройствах с надрезом.

**How it works:** Мобильные браузеры изменяют размер области просмотра, когда строка URL-адреса сворачивается. `vh` не обновляется в середине сеанса; `dvh` отслеживает динамическую видимую область.

**When to use:** Полноэкранный модал/герой → `min-height: 100dvh`; безопасная зона → `padding-bottom: env(safe-area-inset-bottom)`.

</details>

<details>
  <summary>How does @supports work?</summary>

### How does @supports work?

**Definition:** Запрос функции — применяет CSS только в том случае, если браузер поддерживает свойство/значение. Прогрессивное улучшение, а не анализ браузера:.

**How it works:** `@supports (property: value)` правила обертывания применяются только в том случае, если браузер анализирует и поддерживает это объявление — обнаружение функции, а не анализ UA.

**When to use:** Улучшение сетки вместо гибкого резервного варианта; `backdrop-filter` с твердым резервным фоном; `container-type: inline-size` прогрессивное улучшение.

**Examples:**

```css
@supports (display: grid) {
  .layout { display: grid; }
}
```

Для получения префиксов используйте Autoprefixer + Browserslist; использовать `@supports` для дополнительных улучшений (сетка, `backdrop-filter`, контейнерные запросы).

</details>

<details>
  <summary>When is a stacking context created?</summary>

### When is a stacking context created?

**Definition:** `z-index` (нет `auto`) на позиционированном/гибком/сеточном элементе; `opacity < 1`; `transform`, `filter`, `perspective`; `isolation: isolate`; `mix-blend-mode` ≠ `normal`; `will-change` для свойств композитора. Дети не могут рисовать над братьями и сестрами вне контекста своих родителей — см. «Макет» → «Контекст наложения».

**How it works:** Каждый контекст стекирования представляет собой изолированную группу z-порядка — дочерний элемент. `z-index: 9999` не может выйти выше родственного контекста с младшим родителем `z-index`.

**When to use:** Модальное наложение → `isolation: isolate` на обертке; отладка войн z-index на панели слоев DevTools.

</details>

<details>
  <summary>box-shadow vs filter: drop-shadow()?</summary>

### box-shadow vs filter: drop-shadow()?

**Definition:** `box-shadow` следует за рамкой элемента (включая border-radius). `drop-shadow()` следует за альфа-формой — лучше подходит для значков PNG/SVG с прозрачностью. `box-shadow` запускает краску; оба варианта дешевле, чем изменение планировки.

**How it works:** `box-shadow` краски по бордюру; `filter: drop-shadow()` следует за непрозрачными пикселями — пустые значки приобретают правильную форму тени.

**When to use:** Прямоугольные карты → `box-shadow`; Значки PNG/SVG с прозрачностью → `drop-shadow()`; несколько теней → через запятую `box-shadow`.

</details>

<details>
  <summary>Can you fully style a native select?</summary>

### Can you fully style a native select?

**Definition:** Частично. `appearance: none` удаляет ОС Chrome; вы можете стилизовать закрытое состояние (границу, отступы, пользовательскую стрелку с помощью `background`). **Раскрывающийся список** отображается операционной системой — стилизация параметров ограничена кроссбраузерностью. Для полного контроля требуется специальный компонент с поддержкой клавиатуры и ARIA.

**How it works:** Закрыто `<select>` является стильным; открытый раскрывающийся список — это собственный виджет ОС — `<option>` стиль зависит от платформы.

**When to use:** Заклеймите закрытый курок → `appearance: none` + кастомная стрелка; полный контроль над дизайном → создать собственный список с `role="listbox"` и навигация с помощью клавиатуры.

</details>

<details>
  <summary>Pure CSS toggle without JavaScript?</summary>

### Pure CSS toggle without JavaScript?

**Definition:** Скрыть родного `<input type="checkbox">` и стилизовать брата или сестру с помощью `:checked + .track` — сдвиньте ручку с `transform`, сменить трек `background`. Сохраняет доступность и состояние формы. Полное решение: **Стилизация форм и встроенных элементов управления → переключатель Pure CSS** и задача 15.

**How it works:** Флажок остается в порядке табуляции и предоставляет доступ к состоянию вспомогательным технологиям; визуально скрыто с `sr-only` or `opacity: 0`; `:checked` псевдо-драйвы родственных стилей.

**When to use:**

переключатель в стиле iOS; аккордеон с `<details>`; панели вкладок с `:target` или радиовходы.

</details>

---

### Tasks

### Task 1 — Which rule wins? (specificity)

Какого цвета текст? Объясните, почему.

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

Сравнение:.

**Фиолетовый** — селектор `.alert.error` имеет специфику `(0, 2, 1)` (два класса + один тип).

| Селектор | Специфика |
|----------|-------------|
| `p` | 0, 0, 1 |
| `.alert` | 0, 1, 0 |
| `#error` | 1, 0, 0 — **но `#error` не соответствует** (элемент имеет `id="msg"`) |
| `p.error` | 0, 1, 1 |
| `.alert.error` | 0, 2, 1 — **победа** |

Если `#msg` вместо этого использовались ID `(1,0,0)` превзошёл бы занятия, если бы `!important` or `@layer` меняет порядок каскада.

</details>

---

### Task 2 — Center a modal (horizontal + vertical)

Создайте наложение на всю область просмотра с центрированным диалогом. Нет абсолютного позиционирования в диалоге.

```html
<div class="overlay">
  <div class="dialog">Modal content</div>
</div>
```

<details>
  <summary>Solution</summary>

### Solution

**Definition:**

.диалог {

ширина: мин (90 пикселей, 400 пикселей);
  отступ: 1,5рем;
  радиус границы: 12 пикселей;
  фон: #fff;
}
```.

**Examples:**

```CSS
.оверлей {
  дисплей: гибкий;
  оправдание-содержание: центр;
  выровнять-элементы: по центру;
  минимальная высота: 100dvh;
  фон: RGB(0 0 0/50%);
}

**How it works:** `display: grid; place-items: center;` on `.overlay`.

</details>

---

### Task 3 — Responsive card grid (no media queries)

Карточки должны автоматически подходить по размеру: минимум 260 пикселей в ширину, расширяться до заполнения строки, промежуток в 1,5 рема.

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

.карта {

отступ: 1рем;
  граница: сплошная 1 пиксель #e5e7eb;
  радиус границы: 8 пикселей;
}
```.

**Examples:**

```CSS
.карты {
  дисплей: сетка;
  Grid-template-columns: повторение (автоподгонка, minmax (260 пикселей, 1 fr));
  разрыв: 1,5рем;
  стиль списка: нет;
  заполнение: 0;
  маржа: 0;
}

`auto-fit` сворачивает пустые дорожки, поэтому карточки растягиваются, заполняя строку.

</details>

---

### Task 4 — Holy grail layout (header, sidebar, main, footer)

Классическая оболочка страницы: верхний и нижний колонтитулы на всю ширину; боковая панель 240 пикселей; main заполняет оставшееся пространство. Минимальная полная высота области просмотра.

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

.header {область сетки: заголовок; }

.sidebar { область сетки: боковая панель; }
.main { область сетки: основная; минимальная ширина: 0; }
.footer { область сетки: нижний колонтитул; }
```.

**Examples:**

```CSS
.приложение {
  дисплей: сетка;
  минимальная высота: 100dvh;
  столбцы-шаблона сетки: 240 пикселей 1fr;
  сетки-шаблона-строки: авто 1fr авто;
  области шаблонов сетки:
    "заголовок заголовка"
    "главная боковая панель"
    «нижний колонтитул»;
}

`min-width: 0` on main предотвращает переполнение дочернего элемента flex/grid (задача 5).

</details>

---

### Task 5 — Fix flex overflow (sidebar + main)

Основной контент переполняется по горизонтали, а не сжимается. Исправьте только с помощью CSS.

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

.main п {

переполнение: скрыто;
  переполнение текста: многоточие;
  пробел: nowrap;
}
```.

**Examples:**

```CSS
.main {
  гибкий: 1;
  минимальная ширина: 0; /* разрешаем уменьшение содержимого ниже минимума */
  переполнение: скрыто; /* необязательно */
}

По умолчанию `min-width: auto` на гибких элементах = минимальный размер контента, поэтому они отказываются сжиматься.

</details>

---

### Task 6 — Refactor bad CSS (interview Q60)

**До** — исправить особенности, макет и удобство обслуживания:

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

цвет фона: #fff;
}.

**How it works:**

1. Удален `#id` + `!important` — использовать класс `.header`
2. Плавающий макет заменен на Grid.
3. Сплющенный `.container .box .title` → БЭМ `.card__title`
4. Магические числа → пользовательские свойства и `rem`
5. Добавлено `box-sizing: border-box` в глобальном сбросе (см. Ядро)

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

Внедрите токены, готовые к переключению светлой/темной темы. Темный режим через `prefers-color-scheme`.

<details>
  <summary>Solution</summary>

### Solution

**Definition:**

@media (предпочитает цветовую схему: темную) {

:корень {
    --bg: #111827;
    --текст: #f9fafb;
    --граница: #374151;
    --accent: #60a5fa;
  }
}.

**How it works:** набор `document.documentElement.dataset.theme = "dark"` и использовать `[data-theme="dark"] { --bg: ... }`.

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

Затемните элемент, а затем удалите его из DOM, когда затухание завершится.

```html
<div class="toast" id="toast">Saved!</div>
```

<details>
  <summary>Solution</summary>

### Solution

**Definition:**

функция disbToast(el) {

const onEnd = (e) => {
    if (e.target !== el || e.propertyName !== "непрозрачность") return;
    el.removeEventListener("transitionend", onEnd);
    эл.удалить();
  };
  el.addEventListener("transitionend", onEnd);
  el.classList.add("скрывается");
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

Проверять `propertyName` и `e.target` игнорировать всплывающие сообщения от детей.

</details>

---

### Task 9 — Sticky header below a top bar

Верхняя панель фиксированной высоты 48 пикселей. Заголовок под ним должен прилипать при прокрутке, оставаясь под верхней панелью.

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

положение: липкое;
  верх: 48 пикселей; /* смещение = высота верхней панели */
  z-индекс: 10;
  фон: #fff;
  нижняя граница: 1 пиксель сплошной #e5e7eb;
}
```.

**Examples:**

```CSS
.topbar {
  высота: 48 пикселей;
  фон: #1e293b;
  цвет: #fff;
}

**How it works:** `overflow: hidden` on `.page` родитель, пропал без вести `top`, or `top: 0` вызывая перекрытие с верхней панелью.

</details>

---

### Task 10 — Pure CSS tooltip

Показывать текст всплывающей подсказки при наведении/фокусе без JavaScript. Использовать `data-tip` атрибут.

```html
<button class="tip" data-tip="Delete item" aria-label="Delete">🗑</button>
```

<details>
  <summary>Solution</summary>

### Solution

**Definition:**

.tip::after {

содержимое: attr(подсказка к данным);
  позиция: абсолютная;
  внизу: расчет (100% + 6 пикселей);
  осталось: 50%;
  преобразование: TranslateX (-50%);
  заполнение: 0,25 бэр 0,5 бэр;
  размер шрифта: 0,75рем;
  пробел: nowrap;
  фон: #1e293b;
  цвет: #fff;
  радиус границы: 4 пикселя;
  непрозрачность: 0;
  события указателя: нет;
  переход: непрозрачность 0,15 с, легкость;
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

Использование `attr()` псевдоэлементное содержимое. Включать `aria-label` для программ чтения с экрана.

</details>

---

### Task 11 — Calculate specificity with :is() and :where()

Какой цвет применяется?

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

`:where(.a, .b, #x)` имеет **нулевую** специфичность → `(0, 0, 0)`, проигрывает `p` at `(0, 0, 1)` для свойств, где оба совпадают... но здесь `p` is `(0,0,1)` и `:is` is `(1,0,0)`, поэтому **синий побеждает**.

**Синий** - `:is(.a, .b, #x)` принимает специфику своего высшего аргумента: `#x` → `(1, 0, 0)`.

`:where()` полезен для сброса стилей, которые не должны повышать специфичность.

</details>

---

### Task 12 — Flex item text truncation

Гибкая строка имеет фиксированную боковую панель и основную область. Длинный текст заголовка переполняется вместо многоточия.

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

**Definition:** Без `min-width: 0`, гибкий элемент не будет уменьшаться ниже ширины содержимого.

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

Создайте панель мониторинга: заголовок занимает всю ширину, боковая панель шириной 200 пикселей слева, основная заполняется по центру, нижний колонтитул занимает всю ширину. Используйте только именованные области (без номеров строк в элементах).

<details>
  <summary>Solution</summary>

### Solution

**Definition:**

.header {grid-area: head; }

.sidebar {grid-area: nav; }
.content {grid-area: main; минимальная ширина: 0; }
.footer { область сетки: фут; }
```.

**Examples:**

```CSS
.dashboard {
  дисплей: сетка;
  минимальная высота: 100dvh;
  столбцы шаблона сетки: 200 пикселей 1fr;
  сетки-шаблона-строки: авто 1fr авто;
  области шаблонов сетки:
    "голова-голова"
    "главная навигация"
    «нога стопа»;
}

Имена областей должны образовывать прямоугольники; каждая строка имеет одинаковое количество ячеек.

</details>

---

### Task 14 — Component responsive via @container

A `.card` компонент должен размещать изображение над текстом, когда он узкий, но показывать рядом, когда его контейнер имеет размер ≥ 360 пикселей — **без** медиа-запросов области просмотра.

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

.карта {

дисплей: гибкий;
  гибкое направление: столбец;
  разрыв: 1рем;
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

Изменить размер `.slot` ширину для проверки — компонент адаптируется к родительскому элементу, а не к области просмотра.

</details>

---

### Task 15 — Pure CSS iOS-style toggle

Реализуйте тумблер без JavaScript. Необходимо использовать настоящий флажок для доступности.

<details>
  <summary>Solution</summary>

### Solution

**Definition:** Полный текст HTML + CSS см. в разделе **Стилизация форм и встроенных элементов управления → Переключение на чистый CSS**. Ключевой шаблон: скрыт `input[type="checkbox"]` + `.switch__track` брат в стиле `:checked + .track` и `::after` ручка, анимированная через `transform: translateX()`.

</details>

---

### Task 16 — Modal z-index debug

Почему всплывающая подсказка не появляется над модальным наложением?

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

**Definition:** `.modal` создает **новый контекст стекирования** (`transform: translateZ(0)`). `.tooltip`'s `z-index: 9999` соревнуется только **внутри** `.modal` — он не может рисовать выше `.overlay`братья и сестры вне этого контекста.

**How it works:**

1. Удалите ненужное `transform` on `.modal` если не нужно
2. Переместить всплывающую подсказку в корень документа (портал).
3. Поместите всплывающую подсказку снаружи `.modal` в ДОМ
4. Используйте `isolation: isolate` намеренно только там, где это необходимо

</details>

</details>

---

<a name="quick-fixes"></a>

## Quick fixes (cases)

<details>
  <summary>Icons don't show on hover</summary>

### Icons don't show on hover

**Problem:** `visibility: hidden` в состоянии наведения.

**Fix:** использовать `opacity: 0` → `opacity: 1` с `transition`. Удалить конфликтующие `defs` во встроенном SVG.

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

**Answer:** Утилиты имеют одинаковую специфику: побеждает **порядок исходного кода в скомпилированном CSS**, а не порядок классов HTML. Использовать `tailwind-merge` or `@layer utilities` для переопределений.

</details>

<details>
  <summary>Child height 100% not working</summary>

### Child height 100% not working

**Answer:** набор `height` or `min-height: 100%` на каждого предка (`html` → `body` → родительский) или используйте `min-height: 100dvh` в контейнере flex/grid.

</details>

<details>
  <summary>Float parent collapses to zero height</summary>

### Float parent collapses to zero height

**Answer:** `display: flow-root` на родителе (создает BFC). Устаревшее: Clearfix `::after { content: ""; display: table; clear: both; }`.

</details>

### Practical tasks (CSS)

45. Как можно создать компонент-переключатель в стиле iPhone без использования JavaScript?

**Answer:** Переключатель на чистом CSS — скрытый флажок + `:checked` селектор родственного брата. См. разделы **Стилизация форм и встроенных элементов управления → Переключение на чистом CSS**, Вопросы и ответы **Переключение на чистом CSS без JavaScript** и **Задание 15**.


