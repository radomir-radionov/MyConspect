# HTML — Performance

Загрузка сценариев, подсказки по ресурсам, основные веб-показатели и FOUC.

[ ← Вернуться в центр](./1_html.md)

### Related docs

* [HTML — Структура](./1_html_structure.md) · [HTML — Семантика](./1_html_semantics.md) · [HTML — Формы](./1_html_forms.md) · [HTML — Медиа](./1_html_media.md) · [HTML — Рендеринг](./1_html_rendering.md) · [HTML — Производительность](./1_html_ Performance.md) · [HTML — Доступность](./1_html_a11y.md) · [HTML — SEO](./1_html_seo.md) · [HTML — Расширенный](./1_html_advanced.md) · [HTML — Интервью](./1_html_interview.md)

### Sections

- [Performance & resource loading](#performance-resource-loading)

---

## Performance & resource loading

<details>
  <summary>async vs defer vs module</summary>

### async vs defer vs module

**Definition:**

Атрибуты загрузки скрипта управляют загрузкой и выполнением JavaScript относительно анализа HTML.

| Атрибут | Скачать | Выполнить | Заказать |
|-----------|----------|---------|-------|
| (нет) | Парсер блоков | Немедленно | Последовательный |
| `defer` | Параллельно | После разбора | Сохранено |
| `async` | Параллельно | Когда все будет готово | Не гарантировано |
| `type="module"` | Параллельно | После разбора | Сохранено; строгий режим |

**How it works:**

- По умолчанию `<script>` блокирует анализ HTML во время загрузки + выполнения.
- `defer` — параллельная загрузка, выполнение по порядку после разбора.
- `async` — параллельная загрузка, выполняется по готовности (неупорядоченная).
- `type="module"` — отсроченный, строгий, `import`/`export`.

| Атрибут | Заказать | Блокирует разбор? |
|-----------|-------|---------------|
| `defer` | Сохранено | Нет (выполнить после анализа) |
| `async` | Не гарантировано | Во время выполнения |
| `module` | Сохранено | Нет |

**When to use:**

Пакет приложений → `defer` · аналитика → `async` · ES-приложение → `module`.

#### Common pitfalls

- Два `async` скрипты с зависимостями.
- Скрипты модулей требуют CORS для перекрестного происхождения. `src`.
- Встроенный скрипт, предполагающий, что отложенный внешний файл уже запущен.

**Examples:**

```html
<script src="app.js" defer></script>
<script src="analytics.js" async></script>
<script type="module" src="app.mjs"></script>
```

**Thoughts:** Полное руководство по загрузке скриптов → [3_js_browser.md](./3_js_browser.md).

**Sources:** [MDN — загрузка скрипта](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)

</details>

<details>
  <summary>Page load optimization (HTML-level)</summary>

### Page load optimization (HTML-level)

**Definition:**

Оптимизация на уровне HTML уменьшает размер передачи, предотвращает сдвиг макета и позволяет избежать блокировки ресурсов синтаксического анализатора.

| Техника | Выгода |
|-----------|---------|
| `srcset` / современные форматы | Уменьшенные изображения |
| `width`/`height` на изображениях | Предотвратить CLS |
| `defer` / `module` сценарии | Неблокирующий JS |
| Подсказки по ресурсам | Ускорение критически важных ресурсов |

**How it works:**

- Минимизируйте ресурсы, блокирующие рендеринг, на критическом пути.
- Предварительная загрузка ресурсов LCP; ленивая загрузка изображений ниже сгиба.
- `defer`/`module` для сценариев приложений; `async` для независимых тегов.

| Техника | Выгода |
|-----------|--------|
| `srcset`/современные форматы | Уменьшенные изображения |
| `defer` сценарии | Неблокирующий JS |
| Подсказки по ресурсам | Ускоренная критическая выборка |

**When to use:**

Целевая страница LCP · блог с множеством изображений · составление бюджета на основе сторонних сценариев.

#### Common pitfalls

- Предварительная загрузка слишком большого количества ресурсов.
- CSS, блокирующий рендеринг, внизу.
- Сторонние скрипты без `async`/`defer`.

**Examples:**

```html
<link rel="preconnect" href="https://cdn.example.com" />
<img src="photo.webp" alt="Photo" width="600" height="400" loading="lazy" />
<script src="/app.js" defer></script>
```

**Sources:** [web.dev — Производительность](https://web.dev/explore/ Performance)

</details>

<details>
  <summary>Core Web Vitals — HTML developer impact</summary>

### Core Web Vitals — HTML developer impact

**Definition:**

Core Web Vitals измеряет реальный опыт пользователей. Выбор HTML напрямую влияет на LCP, INP и CLS.

| Метрическая | Что он измеряет | HTML-рычаги |
|--------|------------------|-------------|
| **ЛКП** | Рендеринг крупнейшего видимого элемента | `fetchpriority`, `preload`, `width`/`height` |
| **ИЯФ** | Скорость ввода | Семантический `<button>`, отложить некритичный JS |
| **CLS** | Визуальная стабильность | Размеры изображения, зарезервированное пространство для встраивания — [CLS](#cls-cumulative-layout-shift) |

**How it works:**

- **LCP** — самая большая видимая краска (главное изображение/текст).
- **INP** — время до следующего рисования после щелчка/тапа/клавиши (не только задержка ввода). Полные примечания: [6_web_api.md — INP](./6_web_api_security.md#inp-interaction-to-next-paint).
- **CLS** — неожиданный сдвиг макета (максимальное окно сеанса, а не сумма за все время). Полные примечания: [CLS](#cls-cumulative-layout-shift).
- **TTFB** — время до первого байта;диагностика для сервера/CDN, **не** текущий Core Web Vital. Полные примечания: [6_web_api.md — TTFB](./6_web_api_security.md#ttfb-time-to-first-byte).
- **FCP** — первая отрисовка контента (текст/изображение/SVG/холст); поддержка жизненно важна, а не ранжирование. Полные примечания: [6_web_api.md](./6_web_api_security.md#first-contentful-paint-fcp).
- рычаги HTML: размеры, `fetchpriority`, загрузка скрипта, смысловые кнопки.

**When to use:**

Оптимизировать героя для LCP · зарезервировать место для рекламы/вставки для CLS · использовать `<button>` для ИЯФ.

#### Common pitfalls

- Отложенная загрузка образа LCP.
- Внедрение контента поверх существующего без зарезервированного места.
- `<div onclick>` вместо `<button>`.

**Examples:**

```html
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />
<img src="/hero.webp" alt="Hero" width="1200" height="630" fetchpriority="high" />
```

**Thoughts:** Основные веб-показатели: **LCP, INP, CLS**. TTFB и FCP объясняют медленную первую отрисовку/LCP; они не являются основными жизненно важными элементами.

**See also:** Измерение / лаборатория против поля / RUM → [6_web_api.md — основные веб-показатели](./6_web_api_security.md#core-web-vitals). Подразделы LCP → [6_web_api.md — LCP](./6_web_api_security.md#lcp-largest-contentful-paint). INP → [6_web_api.md](./6_web_api_security.md#inp-interaction-to-next-paint). TTFB → [6_web_api.md](./6_web_api_security.md#ttfb-time-to-first-byte).FCP → [6_web_api.md](./6_web_api_security.md#first-contentful-paint-fcp). Рычаги Next.js → [4_nextjs.md](./4_nextjs_platform.md#core-web-vitals-on-vercel).

**Sources:** [web.dev — Vitals](https://web.dev/articles/vitals)

</details>

<details>
  <summary>CLS (Cumulative Layout Shift)</summary>

### CLS (Cumulative Layout Shift)

**Definition:** CLS — это основной веб-важный фактор визуальной стабильности: сколько уже видимого контента неожиданно перемещается во время (и после) загрузки. Хорошо **≤ 0,1**, требует улучшения **0,1–0,25**, плохо **> 0,25** (75-й процентиль).

**How it works:**

- **Сдвиг макета** фиксируется, когда видимый элемент меняет положение между кадрами без причины, определяемой пользователем. Классический случай: вы нажимаете «Купить», вверху загружается баннер, контент подскакивает, вы нажимаете «Отменить».
- Оценка одного сдвига: **доля воздействия × доля расстояния** — доля области просмотра, которая сместилась × насколько далеко она переместилась (в виде доли области просмотра). Большая территория + более продолжительное путешествие = хуже.- Группа смен в **окна сеансов**: новое окно запускается, если промежуток между сменами составляет **≥ 1 с**; окно длится не более **5 секунд**. CLS страницы — это **худшее окно**, а не сумма всех сдвигов на долгоживущей вкладке.
- **Ожидаемые** сдвиги исключены: дискретный вход (щелчок/касание) имеет отсрочку **500 мс** (`hadRecentInput`). Непрерывные жесты (прокрутка, масштабирование) **не** подпадают под это исключение.
- Лаборатория (Маяк) ≠ Поле (CrUX). Отладка: DevTools **Производительность → Изменения макета**. Измерение/RUM: [6_web_api.md — основные веб-показатели](./6_web_api_security.md#core-web-vitals).

- Изображения/видео без `width`/`height` (или CSS `aspect-ratio`) — выкладывается пустым, тогда соседи подпрыгивают при приходе файла.
- Объявления, виджеты, iframe неизвестной высоты, особенно асинхронные.
- Вставляет **выше** уже видимое содержимое: баннеры cookie, панели рекомендаций, всплывающие сообщения об ошибках при рендеринге. Вставка одинакового размера вблизи **верхней** области просмотра оценивается хуже, чем вставка внизу.
- Веб-шрифты: резервные метрики ≠ пользовательские метрики → перекомпоновка.**FOIT** (текст скрыт до загрузки шрифта) и **FOUT** (резервный текст, затем замена). CSS: [Загрузка шрифта](./2_css_visual.md#font-loading).
- Анимация `top` / `left` / `margin` / `width` вместо `transform` — пересчет макета может перемещать одноуровневые элементы. CSS: [transform](./2_css_motion.md#transform).

- Всегда общий запасной вариант: `"Google Sans", sans-serif` — никогда не использовать одиночное пользовательское семейство (метрики по умолчанию в браузере расходятся сильнее).
- Сопоставьте резервный вариант с веб-шрифтом с помощью `@font-face` **`size-adjust`**, `ascent-override`, `descent-override`, `line-gap-override`.
- Предварительная загрузка критически важных шрифтов (`<link rel="preload" as="font" … crossorigin>`). Предпочитаю **WOFF2**, переменные шрифты, `unicode-range` подмножества (загрузка только для кириллического текста).
- `next/font` самостоятельные хосты (без перехода Google CDN) и резервная настройка `size-adjust`.

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

- Контейнер `min-height` or `aspect-ratio` для **вероятного** слота; медиа-запросы для размеров точек останова. `<iframe width height>` когда известно.
- Баннеры cookie: зарезервируйте слот (или наложение). На мобильных устройствах они также могут стать элементом **LCP**. `preconnect` / `dns-prefetch` если сторонний.
- Не вводите данные над областью просмотра без жеста пользователя. Отдавайте предпочтение нижнему сгибу, наложению или слоту фиксированного размера.
- Бесконечная лента: переключайтесь внутри карусели **фиксированного размера**; предварительная выборка **до того, как** пользователь достигнет конца (исключение после взаимодействия 500 мс); или ** «Загрузить еще»**, чтобы ожидать изменения.

оживлять `transform` (`translate` / `scale` / `rotate`) и `opacity`. Они выполняются после макета.

Кэш назад/вперед мгновенно восстанавливает всю страницу; LCP/FCP/CLS в этой навигации часто ~0. web.dev: ~**10%** настольных компьютеров и ~**20%** мобильных устройств навигации вперед/назад. Распространенные блокаторы: `unload` (использовать `pagehide`) и `Cache-Control: no-store`. DevTools → Приложение → Кэш назад/вперед → Тест. [11_vsc_browser.md](./11_vsc_browser.md#devtools--core-web-vitals).

**When to use:**

Поздние медиа, сторонние внедрения, пользовательский интерфейс согласия, бесконечная прокрутка, пользовательские шрифты.

#### Common pitfalls

- CLS рассматривается как сумма всех смен (это **максимальное окно сеанса**).
- Счет сдвигов после щелчка как неожиданных (исключение 500 мс).
- Панель файлов cookie в потоке на мобильных устройствах (CLS ** и ** LCP).
- `font-family` без общего резервного варианта; `font-display: block` ФОИТ.
- Автоматическое добавление элементов с бесконечной прокруткой без зарезервированного места.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Стабильные цели касаний, меньше ошибочных кликов | Перед первой отрисовкой должны существовать файлы cookie/рекламные места |
| Резервировать место дешевле, чем гнаться за плохим результатом | Наложение против потока: наложения позволяют избежать CLS, но могут скрыть LCP/контент |

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

`srcset` / `<picture>`: сохранять **одинаковое соотношение сторон** для всех кандидатов; набор `width`/`height` on `<img>` (и дальше `<source>` в современных браузерах). Next.js `<Image>` требует `width`+`height` or `fill`; статический импорт заполняет размеры. Примечания к фреймворку: [4_nextjs.md](./4_nextjs_platform.md#core-web-vitals-on-vercel).

**Thoughts:** Зарезервируйте место **до** поступления позднего контента; не помещайте новые блоки в текущую область просмотра, если только пользователь не попросил их.

**Sources:** [web.dev — CLS](https://web.dev/articles/cls) · [web.dev — Оптимизация CLS](https://web.dev/articles/optimize-cls) · [web.dev — Vitals](https://web.dev/articles/vitals) · [шрифты Next.js](https://nextjs.org/docs/app/getting-started/fonts) · [Изображение Next.js](https://nextjs.org/docs/app/api-reference/comComponents/image)

</details>

<details>
  <summary>Flash of Unstyled Content (FOUC)</summary>

### Flash of Unstyled Content (FOUC)

**Definition:**

FOUC возникает, когда HTML отображается до применения CSS. Держите критический CSS в себе `<head>` — CSS, блокирующий рендеринг, создан намеренно.

| Стратегия | Эффект |
|----------|--------|
| CSS в `<head>` | Стили применяются до первой покраски |
| Встроенный критический CSS | Быстрая покраска сверху |
| `font-display: swap` | Контрольный шрифт FOUC (CSS) |

**How it works:**

- HTML может отрисовываться до применения CSS → флэш без стилей.
- Сохраняйте CSS `<head>`; критический CSS может быть встроен.
- `font-display` в CSS контролируется шрифт FOUC.

| Стратегия | Эффект |
|----------|--------|
| CSS в `<head>` | Стили перед первой покраской |
| Встроенный критический CSS | Быстро выше раза |

**When to use:**

Медленный CSS CDN · веб-шрифты · CSS, загружаемый через JS (анти-шаблон).

#### Common pitfalls

- `@import` цепочки, задерживающие CSS.
- Сокрытие тела с `opacity:0` до загрузки (плохо для LCP).
- Загрузка стилей в конце тела.

**Examples:**

```html
<head>
  <link rel="stylesheet" href="/app.css" />
  <link rel="preload" href="/app.css" as="style" />
</head>
```

**Thoughts:** `font-display` и критический CSS → [2_css.md](./2_css.md).

**Sources:** [MDN — FOUC](https://developer.mozilla.org/en-US/docs/Glossary/FOUC)

</details>

<details>
  <summary>Caching (historical note: ApplicationCache)</summary>

### Caching (historical note: ApplicationCache)

**Definition:**

ApplicationCache (appcache) представлял собой автономный API HTML5, который устарел и был удален. Вместо этого используйте Service Workers и заголовки кэша HTTP.

| Подход | Статус |
|----------|--------|
| Кэш приложений | Устарело |
| Работники сферы обслуживания | Современное программное кэширование |
| HTTP `Cache-Control` | Стандартное кэширование активов |

**How it works:**

- ApplicationCache (appcache) — удалено; не используйте.
- Современный: сервисные работники + HTTP `Cache-Control`.
- `<link rel="manifest">` для метаданных установки PWA.

| Подход | Статус |
|----------|--------|
| Кэш приложений | Устарело |
| Работники сферы обслуживания | Современный |
| HTTP-кеш | Стандарт |

**When to use:**

Статическое кэширование активов (заголовки HTTP) · автономный SPA (Service Worker).

#### Common pitfalls

- Копирование примеров appcache из старых руководств.
- Нет очистки кеша при развернутом HTML.
- Путаница кеша браузера с пограничным кешем CDN.

**Examples:**

```html
<!-- Modern: link manifest for PWA, HTTP headers for caching -->
<link rel="manifest" href="/manifest.webmanifest" />
```

**Sources:** [MDN — HTTP-кэширование](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)

</details>

---

<a name="accessibility"></a>
