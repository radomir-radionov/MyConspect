# JS Browser — Additional

API-интерфейсы браузера за пределами дерева документов: хранилище, CORS, наблюдатели, история, URL-адрес, файлы и синхронизация пользовательского интерфейса.

[ ← Назад в JS-хаб](./3_js.md)

### Related docs

* [Документ](./3_js_browser.md) · [События](./3_js_events.md) · [JS-интервью](./3_js_interview.md)
* [JS Core](./3_js_core.md) · [JSON](./3_js_variables.md#json) · [JS Array](./3_js_array.md) · [JS Async](./3_js_async.md)* [HTML-браузер и рендеринг](./1_html.md) · [Веб-API](./6_web_api.md) · [HTTP-файлы cookie](./6_web_api_http.md#http-cookies) · [URI/анатомия URL-адресов](./6_web_api_core.md#uri-url--urn) · [CORS](./6_web_api_security.md#cors) · [PWA](./6_web_api_apps.md#pwa-progressive-web-app)
* [Файлы и файловые системы ОС](./8_nodejs_modules.md#files--file-systems)

### Main concepts

| Площадь | Темы |
|------|--------|
| **Интерфейс** | Размеры, прокрутка, координаты, устранение дребезга, дроссель, `rAF`, обратные вызовы в режиме ожидания |
| **API** | Хранилище, CORS, наблюдатели, API истории, `URL` / `URLSearchParams`, Веб-компоненты, Файл/Blob/двоичный |
| **Окна** | Всплывающие окна, `postMessage`, фреймы |

### Sections

> Теория `<details>` блоки следуют: **Определение** · **Как это работает** · **Когда использовать** · **Плюсы и минусы** · **Примеры** · **Мысли** · **Источники**. **Определение** обязательно; другие разделы являются необязательными.

- [Media queries](#media-queries-in-javascript)
- [Browser APIs & UI patterns](#browser-apis--ui-patterns)
- [Debounce](#debounce) · [Throttle](#throttle)
- [FormData / File / Blob](#formdata-file-api-filereader) · [createObjectURL](#url-createobjecturl)
- [Cross-tab / windows](#cross-tab-communication) · [Clickjacking](#clickjacking-pointer)
- [Browser storage](#browser-storage) · [CORS](#cors-same-origin) · [Observers](#intersection-resize-observer) · [History API](#history-api) · [URL / URLSearchParams](#url--urlsearchparams)
- [Интервью](./3_js_interview.md)

---

## Browser APIs & UI patterns

<a name="formdata-file-api-filereader"></a>

<details>
  <summary>FormData, File API, FileReader</summary>

### FormData, File API, FileReader

**Definition:** API для чтения пользовательских файлов и отправки данных формы на сервер. Пути к дискам, атрибуты и файловые API ОС находятся в [Файлы и файловые системы](./8_nodejs_modules.md#files--file-systems) — браузер видит только `File` выбрал пользователь, а не дерево хостов.

**How it works:**

- `FormData` перенос полей формы или добавление вручную; составной корпус для `fetch`/`XHR`. `set` заменяет одноименные поля; `append` можно добавлять дубликаты. Поле файла: `append(name, blob, fileName)`.
- `File` простирается `Blob` с `name` / `lastModified`. От `<input type="file">` → `input.files[0]`или перетащите `dataTransfer.files`.
- `Blob` = неизменяемый двоичный файл + необязательный MIME `type`. Стройте с `new Blob(parts, { type })`; нарезать с `blob.slice`. Скачать/просмотреть через `URL.createObjectURL` (отозвать после завершения) или `FileReader.readAsDataURL`.
- `FileReader` async читает Blob/File как текст, URL-адрес данных или `ArrayBuffer` (`load` / `error` события). Предпочитать `blob.arrayBuffer()` / `blob.text()` когда доступно.
- **Двоичное ядро:** `ArrayBuffer` = фиксированные необработанные байты (не JS `Array`). Просмотры: TypedArrays (`Uint8Array`, …) or `DataView` для смешанных форматов. `TextDecoder` / `TextEncoder` конвертировать UTF-8 ↔ байты.

**When to use:** Загрузка аватара; CSV-импорт; холст → `toBlob` затем ФормаДанные; декодировать полученный двоичный файл как текст.

#### Common pitfalls

Параметр `Content-Type` вручную на FormData (нарушает границу); никогда не отзывать URL-адреса объектов; лечение `ArrayBuffer` нравиться `Array`; ожидая `fetch` прогресс загрузки (используйте XHR — [HTTP в JS](./6_web_api_http.md#http-in-javascript)).

**Pluses and minuses:**

| + | − |
|------|------|
| `FormData` легкий составной | Большие файлы → память, если она полностью буферизована |
| `Blob` + URL объекта для предварительного просмотра | Должен `revokeObjectURL` |
| Типизированные массивы для бинарных операций | Фиксированная длина — нет `splice` |

**Examples:**

```js
const data = new FormData(form);
data.append('image', canvasBlob, 'shot.png');
await fetch('/upload', { method: 'POST', body: data });

const buf = await file.arrayBuffer();
const text = new TextDecoder().decode(new Uint8Array(buf));
```

**Sources:** [javascript.info/formdata](https://javascript.info/formdata) · [javascript.info/file](https://javascript.info/file) · [javascript.info/blob](https://javascript.info/blob) · [javascript.info/arraybuffer-binary-arrays](https://javascript.info/arraybuffer-binary-arrays) · [javascript.info/text-decoder](https://javascript.info/text-decoder) · [MDN FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)

</details>

<a name="url-createobjecturl"></a>

<details>
  <summary>URL: createObjectURL()</summary>

### URL.createObjectURL()

**Definition:** Создает временный URL-адрес большого двоичного объекта для `File` or `Blob` — полезно для предварительного просмотра загрузок. Разбор `https://` URL-адреса: [URL / URLSearchParams](#url--urlsearchparams).

**How it works:**

- `URL.createObjectURL(blob)` создает `blob:` URL-адрес, ссылающийся на большой двоичный объект в памяти, пока он не будет отозван.
- Документ владеет URL-адресами — отмените их, чтобы освободить память.

Срок действия URL-адреса привязан к документу — отмените его, когда он больше не нужен.

**When to use:**

Предварительный просмотр изображения перед загрузкой; ссылка для скачивания сгенерированного PDF-объекта.

#### Common pitfalls

Никогда не звоню `revokeObjectURL`; сохранение URL-адреса большого двоичного объекта в localStorage; использование после сбора мусора BLOB-объектов без понимания семантики отзыва.

**Pluses and minuses:**

| + | − |
|------|------|
| Мгновенный предварительный просмотр загрузок | Утечка памяти, если ее не отозвать |
| Нет накладных расходов на base64 | URL-адрес недействителен после отзыва |
| Работает с источником видео/аудио | URL-адреса BLOB-объектов не сохраняются между сеансами |

**Examples:**

```js
const file = input.files[0];
const url = URL.createObjectURL(file);
img.src = url;

// cleanup when done
URL.revokeObjectURL(url);
```

**Sources:** [javascript.info/blob](https://javascript.info/blob) · [MDN — URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)

</details>

<details>
  <summary>Web components</summary>

### Web Components

**Definition:** Собственные API-интерфейсы браузера для создания многократно используемых инкапсулированных пользовательских элементов HTML.

**How it works:**

- `customElements.define('my-el', Class)` регистрирует пользовательский тег; `connectedCallback` при вставке.
- `attachShadow({ mode: 'open' })` создает инкапсулированный DOM; стили находятся внутри теневого корня.
- `<template>` содержит инертную разметку, клонированную в теневой корень.

| API | Цель |
|-----|---------|
| Пользовательские элементы | Определить новые теги (`<my-button>`) |
| Тень ДОМ | Инкапсулированный DOM и стили |
| HTML-шаблоны | `<template>` для инертной разметки |
| ES-модули | `import` in `<script type="module">` |

**When to use:**

Проектирование примитивов системы; встраиваемый виджет; межфреймворковый компонент.

системы дизайна, встраиваемые виджеты, компоненты, не зависящие от платформы.

#### Common pitfalls

Ожидается, что глобальный CSS пронзит тень (нужно `::part` или переменные CSS); забывая `customElements.define` однажды охранник; формировать ассоциацию с теневыми входами.

**Pluses and minuses:**

| + | − |
|------|------|
| Собственная инкапсуляция | Рамочная экосистема по-прежнему доминирует |
| Многоразовое использование в стопках | SSR/инструменты для стайлинга более сложные |
| Стандарт в современных браузерах | Закрытую тень труднее отладить |

**Examples:**

```js
class MyButton extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<button><slot></slot></button>`;
  }
}
customElements.define('my-button', MyButton);
```

**Sources:** [Веб-компоненты MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_comComponents)

</details>

<details>
  <summary>Debounce</summary>

### Debounce

**Definition:** Debounce **ждёт остановки вызовов** в течение задержки, затем запускает функцию **один раз** (обычно на заднем фронте). Быстрые вызовы объединяются в один вызов.

**How it works:**

- Каждый звонок `clearTimeout`s предыдущий таймер и запускает новый `setTimeout`.
- Функция запускается только после `ms` миллисекунд без **новых вызовов**.
- Типичный откат происходит по заднему фронту (поиск после пауз при вводе). Отскок на переднем фронте существует, но встречается реже.
- Вернуть обертку из HOF; оставьте ту же обертку для `removeEventListener`.
- Отмените тайм-аут при размонтировании, иначе вы можете бежать. `fn` после того, как пользовательский интерфейс исчез.

**When to use:** Поиск/автозаполнение, проверка формы, макет «изменение размера завершено». Пропустите работу, которая должна выполняться, пока пользователь все еще движется (используйте [Дроссель](#throttle)).

**Pluses and minuses:**

| + | − |
|------|------|
| Уменьшает шум `input` до одного запроса | Ощущение зависания, если `ms` слишком велик |
| Простой: `setTimeout` + `clearTimeout` | Непрерывные события могут **никогда** не срабатывать |

**Examples:**

```js
function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

const search = debounce((q) => {
  fetch(`/api/search?q=${encodeURIComponent(q)}`).then((r) => r.json());
}, 300);

input.addEventListener("input", (e) => search(e.target.value));
```

**Thoughts:** Линия интервью: «Подождите, пока затихнет, а затем бегите один раз».

**See also:** [Дроссель](#Дроссель)

**Sources:** [Глоссарий MDN — Debounce](https://developer.mozilla.org/en-US/docs/Glossary/Debounce) · [MDN Window.setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout) · [MDN Window.clearTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearTimeout)

</details>

<details>
  <summary>Throttle</summary>

### Throttle

**Definition:** Throttle запускает функцию не более **один раз за временное окно**, пока события продолжают срабатывать. В отличие от устранения дребезга, он **не** ждет паузы — он поддерживает ограниченную скорость.

**How it works:**

- **Преимущество:** первый вызов в окне выполняется немедленно; последующие вызовы в этом окне игнорируются до тех пор, пока таймер не очистится (простой `blocked` флаг).
- **Трекинг/измеренное время ожидания:** MDN `scroll` шаблон сохраняет последнее значение и использует `setTimeout` поэтому работа выполняется не чаще, чем каждые N мс.
- `requestAnimationFrame` это **не** дроссель для `scroll` — огонь ВВС и пропеллеров с одинаковой скоростью; замерьте задержку сами(`setTimeout`) или используйте `IntersectionObserver`.

**When to use:** `scroll`, `mousemove`, синхронизация положения в реальном времени. Пропустите, если вас интересует только **конечное** значение после паузы (используйте [Debounce](#debounce)).

**Pluses and minuses:**

| + | − |
|------|------|
| Пользовательский интерфейс обновляется во время движения | Можно пропустить последний образец (только ведущий) |
| Шапки дорогие хендлеры | Легко спутать с откатом |

**Examples:**

```js
function throttle(fn, ms) {
  let blocked = false;
  return (...args) => {
    if (blocked) return;
    fn(...args);
    blocked = true;
    setTimeout(() => {
      blocked = false;
    }, ms);
  };
}

window.addEventListener("scroll", throttle(() => {
  console.log(window.scrollY);
}, 100));

// MDN-style: at most every 20ms, always with latest scrollY
let lastY = 0;
let ticking = false;
document.addEventListener("scroll", () => {
  lastY = window.scrollY;
  if (ticking) return;
  ticking = true;
  setTimeout(() => {
    console.log(lastY);
    ticking = false;
  }, 20);
});
```

**Thoughts:** Строка интервью: «во время шторма все еще работает, но не чаще, чем N мс».

**See also:** [Debounce](#debounce) · [requestAnimationFrame](#request-animation-frame)

**Sources:** [Глоссарий MDN — Throttle](https://developer.mozilla.org/en-US/docs/Glossary/Throttle) · [Событие прокрутки документа MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event) · [MDN Window.setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)

</details>

<a name="request-animation-frame"></a>

<details>
  <summary>requestAnimationFrame</summary>

### requestAnimationFrame

**Definition:** Планирует обратный вызов перед следующей перерисовкой браузера (~60 кадров в секунду). Приостановлено, когда вкладка скрыта.

**How it works:**

- Браузер вызывает обратный вызов перед следующей перерисовкой (~60 Гц); цепочки вызовов создают цикл анимации.
- Приостановлено, когда вкладка скрыта; синхронизируется с обновлением дисплея в отличие от `setTimeout`/`setInterval`.
- Получает аргумент временной метки для расчета разницы во времени.
- `setInterval(fn, 1000/60)` не привязан к рисованию: рывки между кадрами, а после скрытой вкладки таймер может **подтянуться** (много обратных вызовов одновременно).
- Конвейер/грязный макет → [1_html.md](./1_html_rendering.md#browser--rendering).

**When to use:**

JS-анимация; перед покраской измерить макет; игровой цикл; эффекты, связанные с прокруткой.

Визуальная анимация — всегда предпочтительнее `setInterval`/`setTimeout`.

#### Common pitfalls

Выполнение сложной логики внутри обратного вызова rAF; используя rAF для одноразовой задержки (используйте `queueMicrotask` or `setTimeout`); не отменять цикл при размонтировании.

**Pluses and minuses:**

| + | − |
|------|------|
| Плавная анимация | Тем не менее основная тема — тяжелая работа |
| Автопауза в фоновом режиме | Не для невизуальных задержек |
| Лучше, чем `setInterval` для визуальных эффектов | Бюджет одного кадра ~16 мс |

**Examples:**

```js
function animate() {
  element.style.transform = `translateX(${position}px)`;
  position += 2;
  if (position < 500) requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```


| РАФ | установитьТаймаут |
| --- | ----- |
| Синхронизировать с дисплеем | да | нет |
| Приостановлено в фоновой вкладке | да | нет |
| Использовать для | анимации | отложенные разовые задачи |

**Sources:** [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

</details>

<a name="request-idle-callback"></a>

<details>
  <summary>requestIdleCallback</summary>

### requestIdleCallback

**Definition:** Планирует обратный вызов на период **бездействия** браузера — оставшееся время в кадре после ввода, макета и рисования. Отличается от `requestAnimationFrame` (должен запускаться перед отрисовкой) и из микрозадач (запускается перед следующей макрозадачей и может задерживать отрисовку).

**How it works:**

- Обратный звонок получает `IdleDeadline`: `timeRemaining()`, `didTimeout`.
- Необязательный `{ timeout }` заставляет работать, если холостой ход никогда не наступает.
- Кооператив: сделать кусочек работы, вернуться, снова запланировать.


| РАФ | запросIdleCallback | Микрозадачи |
| --- | ----- | --------------------- |
| Когда | Перед покраской | При простое (или тайм-ауте) | После синхронизации, перед следующим макросом |
| Использование | Анимации | Аналитика, предварительная выборка | Обещание реакции |

**When to use:** Несрочная работа. **Не** используйте для анимации перетаскивания/прокрутки.

**Thoughts:** *rAF = количество пикселей этого кадра; простой = оставшееся время; Шторм микрозадач никогда не оставляет лишнего времени.*

**Sources:** [MDN requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)

</details>

---

<details>
  <summary>Element and window dimensions & scroll</summary>

### Element and window dimensions & scroll

**Definition:** DOM-элементы предоставляют `offsetWidth`, `clientWidth`, `scrollWidth`, и т. д.; окно имеет `innerHeight`, `scrollY`.

**How it works:**

- `offset*` включает границу; `client*` содержимое + отступы, без рамки/полосы прокрутки; `scroll*` полный прокручиваемый размер.
- `getBoundingClientRect()` поле относительно области просмотра; добавлять `scrollY` для координат документа.
- `scrollIntoView()` прокручивает предков, чтобы раскрыть элемент.

**When to use:**

Смещение липкого заголовка; бесконечная прокрутка внизу; позиционирование подсказки.

Расчеты макета, бесконечная прокрутка, липкие заголовки, прокрутка до элемента.

якорная навигация, «прокрутка до ошибки», выделение результатов поиска.

#### Common pitfalls

Чтение макета в цикле записи (переборка); `offsetHeight` включает границу, `clientHeight` нет; исправить изменения при прокрутке без повторного чтения.

| Семья недвижимости | Включает границу | Включает полосу прокрутки | Только контент |
|-----------------|-----------------|--------------------|--------------|
| `offset*` | да | нет | нет |
| `client*` | нет | нет | нет |
| `scroll*` | — | — | полная прокручиваемая область |

**Pluses and minuses:**

| + | − |
|------|------|
| `getBoundingClientRect` точный | Форсирует макет, если вызывается в цикле |
| Множество объектов недвижимости для разных нужд | Легко спутать офсет и клиента |
| `scrollIntoView` встроенный | Плавная прокрутка не мгновенная для тестов |

**Examples:**

```js
const el = document.querySelector('.panel');
const rect = el.getBoundingClientRect();
const belowFold = rect.top > window.innerHeight;

el.scrollIntoView({ behavior: 'smooth', block: 'start' });
```

#### scrollIntoView()

Прокручивает элемент в видимую область окна браузера.

```js
document.querySelector('#section-3').scrollIntoView({
  behavior: 'smooth',
  block: 'start',   // 'start' | 'center' | 'end' | 'nearest'
  inline: 'nearest',
});
```

**Thoughts:** `getBoundingClientRect()` относительно области просмотра; добавлять `scrollY` для координат документа.

**Window size / page scroll:** Предпочитать `document.documentElement.clientWidth/Height` для области содержимого (кроме полосы прокрутки). `window.innerWidth` включает полосу прокрутки. Полная высота документа ненадежна по одному свойству — используйте `Math.max(body/documentElement scroll/offset/client heights)`. Прочитайте прокрутку с `window.scrollY` / `scrollX` (псевдонимы `pageYOffset` / `pageXOffset`). Прокрутите с помощью `scrollTo` / `scrollBy` / `elem.scrollIntoView`.

**Sources:** [javascript.info/size-and-scroll](https://javascript.info/size-and-scroll) · [javascript.info/size-and-scroll-window](https://javascript.info/size-and-scroll-window)

---

</details>

<details>
  <summary>Coordinates</summary>

### Coordinates

**Definition:** Положение элемента можно прочитать через `getBoundingClientRect()` (относительно области просмотра) или вычисляется из `offsetTop` цепочка (относительно документа).

**How it works:**

- События мыши: `clientX/Y` окно просмотра; `pageX/Y` = клиент + смещение прокрутки.
- `getBoundingClientRect()` дает поле элемента против области просмотра.
- Математика перетаскивания часто преобразуется между системами координат.

**When to use:**

Перетаскивание; тестирование попадания на холст; всплывающая подсказка возле курсора.

Перетаскивание, всплывающие подсказки, целевые объекты на холсте/SVG.

#### Common pitfalls

Использование клиентских координат для элементов, позиционированных в документе, без прокрутки; игнорирование `transform` на родителе; трогать `touches[0]` vs `changedTouches`.

| Метод | Система координат |
|--------|-------------------|
| `getBoundingClientRect()` | Область просмотра (изменения при прокрутке) |
| `clientX` / `clientY` (события) | Область просмотра |
| `pageX` / `pageY` | Документ (включая прокрутку) |
| `document.elementFromPoint(x, y)` | Самый верхний элемент в точке просмотра (`null` если за окном) |

Преобразовать область просмотра → документ: добавить `window.scrollY` / `scrollX` to `getBoundingClientRect()` края.

**Pluses and minuses:**

| + | − |
|------|------|
| Стандартные координаты событий | Touch имеет несколько касаний |
| `getBoundingClientRect` для попаданий элементов | Масштабирование/трансформирование влияет на прямоугольник |
| `pageX` включает прокрутку | Различия в устаревшем IE практически исчезли |

**Examples:**

```js
document.addEventListener('click', (e) => {
  console.log('viewport:', e.clientX, e.clientY);
  console.log('document:', e.pageX, e.pageY);
});
```

**Sources:** [javascript.info/coordinates](https://javascript.info/coordinates)

---

</details>

<details>
  <summary>Selection and Range API</summary>

### Selection and Range API

**Definition:** `Selection` представляет выбор текста пользователем; `Range` представляет собой фрагмент DOM между двумя граничными точками.

**How it works:**

- `window.getSelection()` возвращает выбор пользователя; `Range` определяет начальные/конечные контейнеры и смещения.
- `range.selectNodeContents(el)` выбирает всех детей; `addRange` относится к выбору.

**When to use:**

Панель инструментов редактора выделена жирным шрифтом; копировать пользовательский формат; выделить совпадения поиска.

Редакторы WYSIWYG, копирование/настройка выделения, поиск на странице.

#### Common pitfalls

Выбор отменен при мутации DOM; объединение выбора с вводом `selectionStart`; не сворачивается диапазон после использования.

**Pluses and minuses:**

| + | − |
|------|------|
| Строительный блок редактора форматированного текста | Кроссбраузерные особенности в крайних случаях |
| Программное копирование/выделение | Сложные вложенные текстовые узлы |
| Проверить выбор пользователя | API выбора мобильного ограничено |

| + | − |
|------|------|
| Поддержка расширенного текстового редактора | Несогласованность браузера в крайних случаях |
| Программный отбор | Сложная поверхность API |

**Examples:**

```js
const selection = window.getSelection();
const range = document.createRange();
range.selectNodeContents(document.querySelector('article'));
selection.removeAllRanges();
selection.addRange(range);
```

**Sources:** [javascript.info/selection-range](https://javascript.info/selection-range)

---

</details>

<a name="cross-tab-communication"></a>

<details>
  <summary>Cross-tab & cross-window communication</summary>

### Cross-tab & cross-window communication

**Definition:**

Вкладки/окна обмениваются данными через несколько API. Выбирайте по **источник**, **1:1 или широковещательная рассылка** и **сообщение или общее состояние**.

**Последовательность** (решить → отправить → получить):

```
1. Origin    same-origin? BroadcastChannel / storage / opener
             cross-origin? postMessage only — never otherWindow.document
2. Send      postMessage / channel.postMessage / localStorage.setItem
3. Receive   message | storage — check event.origin; storage skips the writer
```

Тот же источник = протокол + хост + порт. `sessionStorage` это **на каждую вкладку** (совместно с iframe того же происхождения), а не шину перекрестных таблиц.

| Метод | Только того же происхождения | Перекрестное происхождение | Узор | Лучшее для |
|--------|------------------|--------------|---------|----------|
| `window.postMessage` | нет | да | двухточечный | iframe, всплывающие окна OAuth, микроинтерфейсы |
| `BroadcastChannel` | да | нет | паб/подписка (все вкладки) | синхронизация вкладок одного и того же приложения, трансляция выхода из системы |
| `localStorage` + `storage` событие | да | нет | напишите в одной вкладке, оповестите других | простые общие флаги/состояние последней записи |
| `window.opener` / `window.open` ссылка | да | нет* | родительский ↔ всплывающее окно | рабочие процессы всплывающих окон того же происхождения |
| `SharedWorker` | да | нет | общая фоновая тема | общий сокет, логика общего кэша |
| Сервисный работник + `clients` | да | нет | ПО → все контролируемые вкладки | PWA push, фоновая синхронизация |

\*Всплывающие окна с перекрестным происхождением все еще используются `postMessage`; прямой `opener` доступ к имуществу заблокирован.

**How it works:**

SOP блокирует прямой JS между источниками. `postMessage` представляет `MessageEvent`; получатель **должен** проверить `event.origin` и предпочитаю бетон `targetOrigin` (избегать `*`). `storage` Событие срабатывает на **других** документах, которые используют эту область хранения, а не на записывающем устройстве.

- **Всплывающие окна:** `window.open(url, name, params)` — браузеры блокируются, если они не вызваны жестом пользователя (`onclick`). С параметрами размера → всплывающее окно; в противном случае часто вкладка. Возвращает ссылку на окно; использование всплывающих окон `window.opener`. Вызов `win.close()` / проверять `win.closed`. Фокус/перемещение/изменение размера сильно ограничены.
- **`postMessage`:** `win.postMessage(data, targetOrigin)`; слушать с `addEventListener('message', …)` (нет `onmessage` только для надежности). Событие: `data`, `origin`, `source`.
- **iframe:** `iframe.contentWindow` / `contentDocument` (документ только в том случае, если он того же происхождения). Иерархия: `window.frames`, `parent`, `top`. `sandbox` добавляет ограничения (скрипты/формы/top-nav/same-origin), если они не включены в разрешенный список.
- **`localStorage` + `storage`:** `setItem` в А; `storage` в Б/Ц (`e.key`, `e.newValue`). Только струны; гонки — не автобусное сообщение.
- **`window.open` / `opener`:** может звонить тот же источник `opener.fn()`; в противном случае `opener.postMessage`.
- **`SharedWorker`:** каждая вкладка `new SharedWorker(url)` + `port`; рабочий `onconnect` фанаты вышли. То же происхождение; более слабая поддержка, чем `BroadcastChannel`.
- **Сервисный работник:** `clients.matchAll({ type: 'window' })` затем `client.postMessage`. Разветвление PWA.

```
Cross-origin?                         → postMessage
Same origin, fire-and-forget?         → BroadcastChannel
Persist + notify?                     → localStorage + storage
Popup result?                         → opener or postMessage (safer default)
Shared background work?               → SharedWorker
PWA fan-out?                          → Service Worker clients
```

**When to use:**

Выйти из всех вкладок; Всплывающее окно OAuth; синхронизация тем; виджеты iframe.

#### Common pitfalls

Пропуск `event.origin`; ожидая `storage` на вкладке «Письмо»; с использованием `sessionStorage` для синхронизации между таблицами.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Правильный API для каждого ограничения | Легко лечить `localStorage` как автобус |
| `postMessage` это путь между источниками | Необходимо подтвердить `event.origin` |

**Examples:**

```js
parent.postMessage({ type: 'READY' }, 'https://parent.example.com');

window.addEventListener('message', (e) => {
  if (e.origin !== 'https://child.example.com') return;
  console.log(e.data);
});
```

```js
const channel = new BroadcastChannel('app-events');
channel.postMessage({ type: 'LOGOUT' });
channel.onmessage = (e) => { if (e.data.type === 'LOGOUT') redirectToLogin(); };
channel.close();
```

**Thoughts:** Перекрестное происхождение → `postMessage` + проверка происхождения. Трансляция того же происхождения → `BroadcastChannel`. Всплывающие окна требуют жестов пользователя.

**Sources:** [javascript.info/popup-windows](https://javascript.info/popup-windows) · [javascript.info/cross-window-communication](https://javascript.info/cross-window-communication) · [MDN postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) · [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) · [событие хранилища](https://developer.mozilla.org/en-US/docs/Web/API/Window/событие_хранилища)

</details>

<a name="clickjacking-pointer"></a>

<details>
  <summary>Clickjacking (pointer)</summary>

### Clickjacking

**Definition:** Прозрачный iframe накладывает ваш аутентифицированный пользовательский интерфейс, поэтому щелчок на ложной странице попадает в ваши элементы управления — полное эссе в [Кликджекинг](./7_special_security.md#clickjacking).

**How it works:** Предпочитаю CSP `frame-ancestors`; отступать `X-Frame-Options` (только HTTP-заголовок, а не `<meta>`). `SameSite` файлы cookie сокращают количество сеансов с фреймами на основе файлов cookie, но **не** заменяют элементы управления кадрированием. Один только JS для разрушения фреймов слаб.

**Sources:** [javascript.info/clickjacking](https://javascript.info/clickjacking) · [7_special_security — Clickjacking](./7_special_security.md#clickjacking)

</details>

<a name="browser-storage"></a>

<details>
  <summary>Browser storage (cookies, Web Storage, IndexedDB, localForage)</summary>

### Browser storage

**Definition:** API-интерфейсы персистентности на стороне клиента с разным размером, сроком службы, синхронизацией и асинхронностью, а также возможностью отправки данных на сервер — выберите самый маленький подходящий инструмент.

**How it works:**

- **Файлы cookie** — HTTP, а не обычное хранилище. Серверные наборы `Set-Cookie`; браузер отправляет `Cookie` заголовок последующих запросов. По умолчанию используется **сессионный файл cookie** (нет `Max-Age`/`Expires` → исчезнет, ​​когда сеанс браузера завершится). Флаги: `Path`, `Domain`, `Secure`, `HttpOnly`, `SameSite`. ~4 КБ на файл cookie; кодировать значения (`encodeURIComponent`). Неуклюжий `document.cookie` строка → библиотеки распространены. Отслеживание файлов cookie и конфиденциальность: браузеры ограничивают это; предпочитайте Web Storage/IndexedDB для данных только для клиента. Полные флаги HTTP: [HTTP-файлы cookie](./6_web_api_http.md#http-cookies).
- **Веб-хранилище** — `localStorage` и `sessionStorage`: та же строка синхронизации KV API (`setItem`/`getItem`/`removeItem`/`clear`/`key`/`length`), разное время жизни. Предпочитайте методы доступу к свойствам (избегайте конфликтов со встроенными модулями; `storage` событие срабатывает только для записи метода). `sessionStorage` находится на каждой вкладке и умирает, когда вкладка закрывается. `localStorage` имеет область происхождения и *предназначено* для сохранения до тех пор, пока не будет очищено, но браузеры все равно удалят его. MDN: **5 МБ локально + 5 МБ сеанса** на источник; превышение квоты → `QuotaExceededError` (`try/catch`). Записи блокируют основной поток — избегайте частых/больших записей. Любой скрипт того же происхождения (включая вредоносное расширение) может прочитать его — **не для токенов**. Частное/инкогнито: `localStorage` ведет себя как хранилище сеанса и очищается после завершения частного сеанса. Сторонним iframe может быть отказано в хранении, если сторонние файлы cookie отключены.
- **IndexedDB** — асинхронная транзакционная объектная БД (также в воркёрах). `indexedDB.open(name, version)` → `onupgradeneeded` для создания магазинов/индексов. Хранит структурированные и клонируемые значения (объекты, большие двоичные объекты), диапазоны ключей, гораздо большие квоты (на диске, для конкретного браузера). Одного происхождения. Избыток флага темы; подходит для автономных кэшей, черновиков, больших наборов данных. Необработанный API — это событие/`IDBRequest`-heavy — обертки (`idb`, localForage) являются общими.
- **localForage** — `localStorage`-подобный API, который является **асинхронным**. Драйвер по умолчанию: IndexedDB (WebSQL как устаревший вариант); возвращается к `localStorage`. Может хранить объекты/блобы JS; JSON stringify/parse выполняется автоматически на сервере localStorage.


| Файлы cookie | хранилище сеансов | локальное хранилище | Индексированная БД |
| --- | --------- | ---------------- | -------------- |
| Пожизненная | `Expires` / `Max-Age` / сессия | вкладка | пока не будет ясно / выселение | пока не будет ясно / выселение |
| Область применения | домен + путь | происхождение + вкладка | происхождение (все вкладки) | происхождение |
| Отправлено на сервер | да (каждый соответствующий запрос) | нет | нет | нет |
| Емкость | ~4 КБ/cookie | ~5 МБ | ~5 МБ | большой (квота) |
| API | HTTP + `document.cookie` | строка синхронизации KV | строка синхронизации KV | асинхронные транзакции |

Safari / WebKit ITP (когда включена защита от отслеживания): **данные, доступные для записи скриптов** (файлы cookie JS, веб-хранилище, IndexedDB, кэш ПО и т. д.) могут быть удалены, если в источнике не было **взаимодействия с пользователем** (нажатие/нажатие) в течение последних **7 дней использования браузера**. Файлы cookie, установленные на сервере, освобождаются от такого превентивного удаления. Веб-приложения на главном экране пропускают семидневный лимит.

**When to use:**

Сеанс аутентификации, который должен видеть **сервер** → `HttpOnly` + `Secure` + `SameSite` печенье. Тема/локаль/небольшие настройки пользовательского интерфейса → `localStorage`. Мастер / черновик только с вкладками → `sessionStorage`. Автономные заметки, файлы, списки с возможностью запроса → IndexedDB (или localForage). Данные только для клиента → никогда не используют файлы cookie (они раздувают каждый запрос).

#### Common pitfalls

JWT/токены в веб-хранилище (XSS, расширения). Предположим, что переполнение *очищает* веб-хранилище — оно **выбрасывает**, но не очищается автоматически. Таблица cookie «отправлено, если только HttpOnly» неверна: HttpOnly по-прежнему отправляется на сервер, но его невозможно прочитать из JS. `storage` событие не срабатывает на вкладке записи. Правило 7 дней Safari — **никакого взаимодействия**, а не «не звонил». `getItem`Не рассматривайте localStorage как долговременный объект.

**Pluses and minuses:**

| + | − |
|------|------|
| Файлы cookie: обратный путь к серверу, `HttpOnly` для XSS | Размер; отправил каждый запрос; неуклюжий JS API |
| Веб-хранилище: крошечный API | Синхронизировать; струны; XSS-читаемый; ~5 МБ |
| IndexedDB: асинхронная, структурированная, большая | Подробный API |
| localForage: один API, резервный драйвер | Дополнительная зависимость |

**Examples:**

```js
try {
  localStorage.setItem('user', JSON.stringify({ id: 1 }));
  const user = JSON.parse(localStorage.getItem('user') ?? 'null');
  sessionStorage.setItem('draft', formText);
} catch (e) {
  // QuotaExceededError, disabled storage, or private-mode quirks
}

document.cookie = 'pref=dark; Path=/; Max-Age=31536000; SameSite=Lax';

const req = indexedDB.open('notes', 1);
req.onupgradeneeded = (e) => {
  e.target.result.createObjectStore('notes', { autoIncrement: true });
};
req.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction('notes', 'readwrite');
  tx.objectStore('notes').add({ text: 'read storage notes', ts: Date.now() });
};

await localforage.setItem('user', { id: 1 });
const fromForage = await localforage.getItem('user');
```

**Thoughts:** Файлы cookie для того, что нужно **серверу** при следующем запросе; Веб-хранилище для небольших клиентских предпочтений; IndexedDB (или localForage) для больших/асинхронных данных.

**Sources:** [javascript.info/cookie](https://javascript.info/cookie) · [javascript.info/localstorage](https://javascript.info/localstorage) · [javascript.info/indexeddb](https://javascript.info/indexeddb) · [MDN — Веб Хранилище] (https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) · [MDN — квоты и выселение] (https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) · [MDN — cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies) · [MDN — IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) · [localForage](https://github.com/localForage/localForage)

</details>

<a name="cors-same-origin"></a>

<details>
  <summary>CORS and same-origin policy</summary>

### CORS and same-origin policy

**Definition:** **Политика одного и того же источника** не позволяет документу читать DOM, хранилище и (по умолчанию) HTTP-ответы другого источника. **CORS** — это согласие на использование HTTP, поэтому `fetch`/`XHR` может прочитать ответ перекрестного происхождения.

**How it works:** СОП также распространяется на iframe и `document` доступ — не только API. Заголовки, предполетная проверка, учетные данные, `*`, и `Vary: Origin` жить в [Веб-API — CORS](./6_web_api_security.md#cors).

**When to use:** Перекрестное происхождение `fetch` со страницы; скрипты/шрифты модуля, которым нужен CORS; Вызовам того же источника не нужны заголовки CORS.

**Pluses and minuses:**

| + | − |
|------|------|
| Изолирует вкладки/iframe по происхождению | Легко спутать SOP (DOM) с CORS (чтение HTTP) |

**Examples:** см. [Веб-API — CORS](./6_web_api_security.md#cors).

**Thoughts:** SOP является изолятом по умолчанию; CORS — это заголовки сервера, которые позволяют **page JS** читать ответ, а не брандмауэру сервера.

**Sources:** [javascript.info/fetch-crossorigin](https://javascript.info/fetch-crossorigin) · [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

</details>

<a name="intersection-resize-observer"></a>

<details>
  <summary>IntersectionObserver and ResizeObserver</summary>

### IntersectionObserver and ResizeObserver

**Definition:** `IntersectionObserver` определяет, когда элемент входит или покидает область просмотра (или корень); `ResizeObserver` сообщает об изменении размера поля содержимого элемента.

**How it works:**

- **IntersectionObserver** — обратный вызов, когда видимость цели по сравнению с корнем (окно просмотра или предок) пересекает пороговые значения; асинхронный, пакетный, вне основного цикла опроса.
- **ResizeObserver** — обратный вызов при изменении размера наблюдаемого элемента; сгорает до покраски (макет уже просчитан).
- Оба используют `observe(el)` / `unobserve(el)` / `disconnect()`.


| ПересечениеОбсервер | Изменить размерObserver |
| --- | --------------------- |
| Часы | Коэффициент видимости/пересечения | изменения ширины/высоты |
| Использовать для | ленивая загрузка, бесконечная прокрутка, видимость рекламы | адаптивные компоненты, диаграммы |
| Корень | область просмотра или пользовательский элемент | сам элемент |

**When to use:**

Отложенная загрузка изображений (`data-src` при пересечении); липкая аналитика «50% видна»; текстовая область автоматически увеличивается; изменение размера холста.

#### Common pitfalls

Нет `unobserve` после ленивой загрузки; Обратный вызов ResizeObserver бесконечно меняет размер; ожидая ввода-вывода во время `display:none` (без пересечения).

**Pluses and minuses:**

| + | − |
|------|------|
| Лучшая производительность, чем прослушиватели прокрутки | Время обратного вызова асинхронно — не синхронно с DOM |
| Стандартный шаблон отложенной загрузки | Ошибки ограничения цикла ResizeObserver, если обратный вызов изменяет макет |
| Мелкозернистые пороги | Старым браузерам требуется полифилл для IO |

**Examples:**

```js
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.src = e.target.dataset.src;
      io.unobserve(e.target);
    }
  }
}, { rootMargin: '100px' });
document.querySelectorAll('img[data-src]').forEach((img) => io.observe(img));

const ro = new ResizeObserver((entries) => {
  for (const { contentRect, target } of entries) {
    target.style.setProperty('--w', `${contentRect.width}px`);
  }
});
ro.observe(document.querySelector('.panel'));
```

**Sources:** [MDN IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) · [MDN ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)

</details>

<a name="history-api"></a>

<details>
  <summary>History API and navigation</summary>

### History API and navigation

**Definition:** `history` объект управляет стеком истории сеансов для маршрутизации SPA без полной перезагрузки страницы через `pushState` / `replaceState` и `popstate` событие.

**How it works:**

- `history.pushState(state, '', url)` — добавляет запись; Обновления URL-строки; нет запроса на навигацию.
- `history.replaceState(state, '', url)` — заменяет текущую запись.
- `popstate` стреляет назад/вперед (и `history.back()`); `event.state` является объектом состояния (или нулем).
- `history.length`, `back()`, `forward()`, `go(n)` перемещаться по стеку.
- Полная навигация: `location.assign(href)`, `location.href = url`, or `<a>` клик — загружает новый документ.

**When to use:**

изменение маршрута СПА; шаги мастера; модальная глубокая ссылка; replaceState для удаления параметров временного запроса.

#### Common pitfalls

Забывчивость `popstate` прослушиватель — разрыв кнопки «Назад»; отправка одного и того же стека дубликатов URL-адресов; штат слишком велик; сбивающий с толку `hashchange` (`#/page`) с API истории.

**Pluses and minuses:**

| + | − |
|------|------|
| URL-адреса SPA без перезагрузки | Необходимо вручную синхронизировать состояние приложения с историей |
| Государственный объект на реставрацию | `state` ограничения структурированного клонирования (без узлов DOM) |
| Работает с библиотеками маршрутизаторов (React Router) | Пользователь ожидает, что кнопка «Назад» отменит состояние приложения |

**Examples:**

```js
function navigate(path) {
  history.pushState({ route: path }, '', path);
  renderRoute(path);
}

window.addEventListener('popstate', (e) => {
  renderRoute(e.state?.route ?? location.pathname);
});

// initial load
renderRoute(location.pathname);
```

**Sources:** [javascript.info/history-api](https://javascript.info/history-api) · [API истории MDN](https://developer.mozilla.org/en-US/docs/Web/API/History_API)

</details>

<a name="url--urlsearchparams"></a>

<details>
  <summary>URL and URLSearchParams</summary>

### URL and URLSearchParams

**Definition:** `URL` анализирует/строит полный адрес; `URLSearchParams` читает и записывает строку запроса (`application/x-www-form-urlencoded`: космос → `+`). URL *форма* (схема, хост, фрагмент): [URI, URL и URN](./6_web_api_core.md#uri-url--urn). URL-адреса больших двоичных объектов: [createObjectURL](#url-createobjecturl).

**How it works:**

- `new URL(url, base)` — `base` решает относительно `url` (МДН).
- Полезные поля: `protocol`, `hostname`, `port` (пусто, если по умолчанию), `pathname`, `search`, `searchParams`, `hash`, `href`, `origin` (схема + хост + порт не по умолчанию).
- `searchParams.get` / `getAll` / `set` / `append` / `delete` / `toString()` (без ведущего `?`). Дублирование ключей разрешено; `append` добавляет, `set` заменяет.
- Не разделяйся `?`/`&` вручную — перерывы в кодировании (`привет`, `+` против космоса).

**When to use:**

Создание поисковых ссылок; читать `location.search`; Узел/Далее `new URL(request.url)`.

#### Common pitfalls

`toString()` опускает `?`; строительство `URLSearchParams` из необработанной интерполированной строки может привести к неправильной обработке `+`; `username`/`password` существовать на `URL` но размещение учетных данных в href устарело.

**Examples:**

```js
const url = new URL('/search', 'https://doka.guide');
url.searchParams.set('query', 'привет');
url.searchParams.append('category', 'html');
url.searchParams.append('category', 'js');
url.hash = 'results';
url.href;
// https://doka.guide/search?query=%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82&category=html&category=js#results

url.searchParams.getAll('category'); // ['html', 'js']
```

**Thoughts:** Разобрать с `URL`; изменить запрос с помощью `searchParams`, никогда с объединением строк.

**Sources:** [javascript.info/url](https://javascript.info/url) · [MDN — URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) · [MDN — URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

</details>

<details>
  <summary>Related</summary>

### Related

* HTTP, выборка, хранилище → [6_web_api.md](./6_web_api.md)
* Конвейер рендеринга HTML → [1_html.md](./1_html.md)
* Документ (DOM/BOM) → [3_js_browser.md](./3_js_browser.md)
* События → [3_js_events.md](./3_js_events.md)

</details>

---

Вопросы и ответы на собеседовании, а также задачи по написанию кода находятся в [JS — Interview](./3_js_interview.md).
