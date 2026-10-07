# JS Browser — Document

Дерево DOM, запросы, мутации, спецификация и загрузка скриптов.

[ ← Назад в JS-хаб](./3_js.md)

### Related docs

* [JS Core](./3_js_core.md) · [JS Array](./3_js_array.md) · [JS-функции](./3_js_functions.md) · [JS OOP](./3_js_oop.md) · [JS Async](./3_js_async.md)
* [События](./3_js_events.md) · [Дополнительный браузер](./3_js_browser_extra.md) · [JS Interview](./3_js_interview.md)
* [HTML-браузер и рендеринг](./1_html.md) · [Веб-API](./6_web_api.md) · [файлы и файловые системы ОС](./8_nodejs_modules.md#files--file-systems)* [Jest DOM-тесты (`jsdom`)](./7_special_testing_tooling.md#jest--first-tests-node-vs-jsdom)

### Main concepts

| Площадь | Темы |
|------|--------|
| **Окружающая среда** | `window`, характеристики, загрузка скриптов |
| **ДОМ** | Дерево, запросы, атрибуты и свойства, модификация |
| **СПЕЦИФИКАЦИЯ** | `location`, `navigator`, `history` |

### Sections

> Теория `<details>` блоки следуют: **Определение** · **Как это работает** · **Когда использовать** · **Плюсы и минусы** · **Примеры** · **Мысли** · **Источники**. **Определение** обязательно; другие разделы являются необязательными.

- [Script loading](#script-loading)
- [DOM & BOM](#dom-bom-events)
- [События](./3_js_events.md)
- [Интервью](./3_js_interview.md)

---

## Script loading

<details>
  <summary>Script loading</summary>

### Script tags & loading

**Definition:** `<script>` загружает и запускает JavaScript. По умолчанию он **блокирует анализ HTML** до завершения сценария.

**How it works:**

- Парсер хитов `<script>` без `async`/`defer` → останавливает анализ HTML, извлекает (если `src`), выполняется, а затем возобновляет анализ.
- `defer`: загружать параллельно, выполнять по порядку после анализа HTML, перед `DOMContentLoaded`.
- `async`: загружать параллельно, выполнять по готовности (порядок не гарантируется), может блокировать анализ при выполнении.
- Динамически создается `<script>` по умолчанию используется **асинхронное** поведение; набор `script.async = false` чтобы сохранить порядок вставки (например, `defer`).
- `type="module"`: отложено по умолчанию, строгий режим, `import`/`export`.
- Тег с **`src` игнорирует любое встроенное тело** — используйте второе `<script>` для встроенного кода. Не смешивайте `src` и контент в одном теге.
- Старая разметка: `language` является устаревшим; `type="text/javascript"` не требуется для классических сценариев. Современный `type` предназначен для модулей/карт импорта/блоков данных.

**When to use:**

Пакет приложений → `defer`; аналитика/реклама → `async`; Приложение ES → `type="module"`.

#### Common pitfalls

Два `async` скрипты, зависящие друг от друга; встроенный сценарий перед отложенным внешним, при условии, что он запущен; Требования модуля CORS для перекрестного происхождения `src`; ожидая встроенного кода внутри `<script src="…">` запустить (игнорируется).

**Pluses and minuses:**

| + | − |
|------|------|
| `defer` сохраняет порядок, неблокируется | Все еще выполняется в основном потоке |
| `async` для независимых скриптов | Заказать непредсказуемо |
| Модули древовидные, строгие | Старым браузерам требуется резервный вариант nomodule |

**Examples:**

```html
<script src="app.js" defer></script>
<script src="analytics.js" async></script>

<!-- WRONG: alert never runs -->
<script src="file.js">
  alert(1);
</script>

<!-- OK: external + separate inline -->
<script src="file.js"></script>
<script>
  alert(1);
</script>
```

**Thoughts:** Размещайте некритичные сценарии в конце `<body>` или используйте `async` / `defer` чтобы избежать блокировки рендеринга.

### async & defer

| Атрибут | Скачать | Порядок выполнения | Лучшее для |
|-----------|----------|-----------------|----------|
| *(нет)* | разбор блоков | заказ документов | устаревшие встроенные скрипты |
| `defer` | параллель | порядок документов, прежде `DOMContentLoaded` | пакеты приложений, которым требуется полный DOM |
| `async` | параллель | первый готовый первый запуск | реклама, аналитика, независимые скрипты |
| `type="module"` | параллель | отложенный, строгий режим по умолчанию | ES-модули |

**Examples:**

```html
<script src="a.js" defer></script>
<script src="b.js" defer></script>
<script src="tracker.js" async></script>
```

**Sources:** [javascript.info/hello-world](https://javascript.info/hello-world) · [javascript.info/script-async-defer](https://javascript.info/script-async-defer) · [MDN `<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script)

</details>

<a name="dom-bom-events"></a>

## DOM & BOM

<details>
  <summary>DOM</summary>

### DOM

**Definition:**

DOM — это живое **дерево узлов**, которое браузер строит на основе HTML/XML. JS читает и изменяет его через `document` — это не исходный файл.

**Последовательность** (анализ → изменение):

```
1. Parse    HTML → node tree (`document` root)
2. Access   documentElement / head / body → getElementById / querySelector
3. Read     nodeType; children vs childNodes; attributes vs properties
4. Mutate   createElement / append / property write → later layout/paint
```

`window` → `document` → `<html>` (`document.documentElement`). Теги, текст и комментарии — это узлы.

| Узел | `nodeType` | Пример |
|------|------------|---------|
| Документ | `DOCUMENT_NODE` (9) | `document` |
| Элемент | `ELEMENT_NODE` (1) | `<div>` |
| Текст | `TEXT_NODE` (3) | `"Hello"` |
| Комментарий | `COMMENT_NODE` (8) | `<!-- note -->` |

| API | Возврат |
|-----|---------|
| `children` / `nextElementSibling` | только элементы |
| `childNodes` / `nextSibling` | все узлы (часто текст с пробелами) |
| `getElementById` / `querySelector` / `querySelectorAll` | id/первое совпадение CSS/все совпадения |
| `matches(sel)` / `closest(sel)` / `contains(node)` | логическое совпадение/проверка ближайшего предка/потомка |

**How it works:**

Пишет обновить живое дерево сразу; смешанные циклы чтения/записи могут привести к сбоям в макете. Живые коллекции меняются вместе с изменением дерева.

**Node identity:** `nodeType` (число), `nodeName` (всегда в верхнем регистре для элементов HTML, например `"DIV"`), `tagName` (только элементы, то же, что и `nodeName` для HTML). Предпочитать `tagName`/`nodeName` чрезмерная структуризация узла.

**Attributes vs properties:** Стандартные атрибуты HTML становятся свойствами JS, но сопоставление не происходит 1:1.


| | Атрибут (`getAttribute`) | Собственность (напр. `el.id`) |
| | --|----------------------------|-------------------------|
| | Тип | всегда строка | набрал (`checked` → логическое значение, `style` → объект) |
| | Имя | нечувствителен к регистру | с учетом регистра |
| | Синхронизировать | самые стандартные атрибуты ↔ реквизит | исключения: `input.value` обновляет свойство из атрибута, а не атрибут из свойства |

- Нестандартные атрибуты → нет свойств; использовать `getAttribute` / `setAttribute`или безопаснее `data-*` → `elem.dataset`.
- `href` атрибут = как написано; `.href` = абсолютный URL.
- Предпочитать свойства DOM для нормальной работы; атрибуты, когда вам нужно значение в формате HTML или `data-*`.

**When to use:**

Монтировать пользовательский интерфейс; читать/обновлять атрибуты и свойства; строить списки.

#### Common pitfalls

`innerHTML` + пользовательский ввод (XSS); `checked`/`value` атрибут против свойства; предполагая `firstChild` является элементом.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Стандартное живое дерево, селекторы CSS | Многословие против VDOM; живые списки-сюрприз |

**Examples:**

```js
document.title = 'My App';
const app = document.getElementById('app');
app.children[0].tagName; // "P"
app.firstChild;          // often a whitespace text node

const box = document.querySelector('input[type=checkbox]');
box.checked = false;
box.getAttribute('checked'); // still "checked" if it was in HTML
```

**Thoughts:** Измените **дерево среды выполнения**, а не HTML-файл.

**See also:** [Навигация по DOM](#dom-navigation) · [Методы и реквизиты DOM](#dom-methods--props) · [HTMLCollection vs NodeList](#htmlcollection-vs-nodelist) · [innerHTML vs externalHTML](#innerhtml-vs-outerhtml)

**Sources:** [javascript.info/dom-nodes](https://javascript.info/dom-nodes) · [javascript.info/basic-dom-node-properties](https://javascript.info/basic-dom-node-properties) · [javascript.info/dom-attributes-and-properties](https://javascript.info/dom-attributes-and-properties) · [MDN DOM](https://developer.mozilla.org/en-US/docs/Glossary/DOM)

### shadow dom

**Definition:** Частное изолированное поддерево DOM, прикрепленное к основному элементу, отдельное от обычного (облегченного) DOM страницы.

**How it works:**

Без него все компоненты имеют одну глобальную область DOM и CSS — утечки стилей, конфликты селекторов и раскрытие внутренних компонентов. Shadow DOM обеспечивает **инкапсуляцию**: стили с ограниченной областью действия, скрытую разметку и безопасное повторное использование на разных страницах.

- **Light Tree** — обычное поддерево DOM из дочерних элементов HTML.
- **Теневое дерево** — скрытое поддерево, не отраженное в исходном HTML.

```js
const shadowRoot = elem.attachShadow({ mode: 'open' | 'closed' });
// mode: 'open' → accessible via elem.shadowRoot
```

Теневые элементы DOM:

- Иметь собственную область идентификатора
- Невидимый для `querySelector` из основного документа
- Стилизовано только стилями внутри теневого дерева.

**When to use:**

Веб-компоненты, встраиваемые виджеты, сторонний интерфейс на неизвестных страницах.

Приложения React/Vue (они по-разному обрабатывают инкапсуляцию); если вы хотите, чтобы глобальные стили страницы влияли на компонент.

**Sources:** [javascript.info/shadow-dom](https://javascript.info/shadow-dom)

### Page lifecycle events

**Definition:**

Браузер генерирует события при загрузке и выгрузке страницы. Используйте их для инициализации пользовательского интерфейса или предупреждения пользователей о несохраненных данных.

| Событие | Срабатывает, когда | Цель |
|-------|-----------|--------|
| `DOMContentLoaded` | HTML проанализирован, DOM готов (изображения все еще могут загружаться) | `document` |
| `load` | Все ресурсы загружены (изображения, стили, скрипты) | `window` |
| `beforeunload` | Пользователь покидает страницу | `window` |
| `unload` | Страница выгружается | `window` |

**How it works:**

- `DOMContentLoaded` ждет классических/отложенных скриптов; `async` скрипты и динамически вставляемые скрипты не блокируют его. Таблицы стилей перед сценарием могут задержать этот сценарий (и, следовательно, `DOMContentLoaded`).
- `document.readyState`: `"loading"` → `"interactive"` (≈ до `DOMContentLoaded`) → `"complete"` (≈ `window.load`).
- `beforeunload`: набор `event.returnValue = ""` (или вернуть строку из `onbeforeunload`), чтобы отобразить подтверждение выхода — браузеры игнорируют пользовательский текст сообщения.
- `unload`: работает только по принципу "выстрелил и забыл"(`navigator.sendBeacon`); не ждите асинхронных ответов.
- Ресурс `load` / `error` on `<img>`, `<script>`и т. д. отслеживать только этот ресурс, а не анализировать ошибки внутри успешно загруженного скрипта (`window.onerror` для тех). Ошибки сценариев перекрестного происхождения остаются непрозрачными, если только `crossorigin` + CORS-заголовки.

**Examples:**

```js
document.addEventListener('DOMContentLoaded', () => {
  initApp(); // DOM is ready
});

window.addEventListener('load', () => {
  hideLoader(); // images loaded too
});

window.addEventListener('beforeunload', (e) => {
  if (formDirty) e.returnValue = '';
});

const img = new Image();
img.onload = () => console.log(img.width);
img.onerror = () => console.log('failed');
img.src = '/hero.png';
```

**Sources:** [javascript.info/onload-ondomcontentloaded](https://javascript.info/onload-ondomcontentloaded) · [javascript.info/onload-onerror](https://javascript.info/onload-onerror)

### Creating & appending elements

**Examples:**

```js
const li = document.createElement('li');
li.textContent = 'New item';
li.classList.add('active');
document.querySelector('ul').append(li);
```

### HTMLCollection vs NodeList


| | HTMLКоллекция | Список узлов |
| | --- | ---------------- |
| | **В прямом эфире?** | да (автообновления) | обычно статично(`querySelectorAll`) |
| | **Содержит** | только элементы | любой тип узла |
| | **Доступ** | индекс, имя, идентификатор | только индекс |
| | **От** | `getElementsBy*` | `querySelectorAll`, `childNodes` |

**Examples:**

```js
const live = document.getElementsByClassName('item');   // live
const snap = document.querySelectorAll('.item');      // static snapshot

document.querySelector('.item').remove();
live.length;  // decreased
snap.length;  // unchanged
```

**Note:** Ни один из них не является настоящим массивом — используйте `Array.from()` или распространите для итерации с помощью методов массива.

### innerHTML vs outerHTML

| Недвижимость | Возврат/комплекты |
|----------|----------------|
| `innerHTML` | HTML **внутри** элемента (только дочерние элементы) |
| `outerHTML` | HTML **включая** сам элемент |

**Examples:**

```html
<div id="box"><span>Hi</span></div>
```

```js
box.innerHTML;  // '<span>Hi</span>'
box.outerHTML;  // '<div id="box"><span>Hi</span></div>'
```

**Warning:** `innerHTML` анализирует строки HTML — очищает ввод пользователя для предотвращения XSS. Типы и кодировка: [Special — XSS](./7_special_security.md#xss-cross-site-scripting).

### window vs document


| | `window` | `document` |
| | --- | ---------- |
| | **Роль** | Глобальный объект браузера | Точка входа в DOM (дочерний элемент `window`) |
| | **Доступ** | неявный глобальный | `document` or `window.document` |
| | **API** | `alert()`, `location`, `setTimeout` | `getElementById`, `createElement`, `querySelector` |

**Examples:**

```js
window.innerWidth;              // viewport size
document.querySelector('h1');   // DOM query
```

</details>

<details>
  <summary>DOM navigation</summary>

### DOM navigation

**Definition:** Пройдите по дереву DOM, используя родительские/дочерние/родственные свойства и методы запроса.

**How it works:**

- Ссылки на дерево: `parentNode`, `childNodes`, `nextSibling`, и т. д.; варианты, содержащие только элементы, пропускают текстовые узлы.
- `querySelector(All)` запускает механизм селектора на поддереве; `getElementsBy*` возвращает живую HTMLCollection.

| Направление | Все узлы | Только элементы |
|-----------|-----------|---------------|
| Родитель | `parentNode` | `parentElement` |
| Дети | `childNodes` | `children` |
| Первый ребенок | `firstChild` | `firstElementChild` |
| Последний ребенок | `lastChild` | `lastElementChild` |
| Предыдущий | `previousSibling` | `previousElementSibling` |
| Следующий | `nextSibling` | `nextElementSibling` |

| Метод | Область применения | Возврат | Жить? |
|--------|-------|---------|-------|
| `getElementById(id)` | документ | элемент или `null` | — |
| `getElementsByClassName(cls)` | элемент | HTMLКоллекция | да |
| `getElementsByTagName(tag)` | элемент | HTMLКоллекция | да |
| `querySelector(sel)` | элемент | первый матч или `null` | — |
| `querySelectorAll(sel)` | элемент | Список узлов | статический |

**When to use:**

Перейти к родительской форме; найти следующий родственный элемент; ограниченный `el.querySelector('.title')`.

#### Common pitfalls

`firstChild` vs `firstElementChild`; изменение живой коллекции во время цикла; предполагая `children[0]` существует.

**Pluses and minuses:**

| + | − |
|------|------|
| Быстрый прямой обход известной структуры | `childNodes` включает текстовые узлы |
| `querySelector` гибкий | Обновление живых коллекций во время итерации |
| `closest()` для целей делегирования | Глубокие ходы ручные и ломкие |

**Examples:**

```js
const list = document.querySelector('.list');
list.children;                        // element children only
list.querySelectorAll('li.active');   // static NodeList
list.getElementsByTagName('li');      // live HTMLCollection
```

**Thoughts:** `getElementsBy*` возвращает **живые** коллекции; `querySelectorAll` возвращает **снимок**.

**Also:** `elem.matches(css)` — соответствует ли этот элемент? `elem.closest(css)` — ближайший предок (в т.ч. сам). `elemA.contains(elemB)` — is `elemB` внутри `elemA`?

**Sources:** [javascript.info/dom-navigation](https://javascript.info/dom-navigation) · [javascript.info/searching-elements-dom](https://javascript.info/searching-elements-dom)

</details>

<details>
  <summary>DOM methods</summary>

### DOM methods
**Definition:** Общие API для поиска элементов, работы с формами и чтения пользовательских данных.

**How it works:**

- `document` методы поиска из корня документа или элемента.
- `dataset` карты `data-*` атрибуты свойств CamelCase JS.
- `forms` индексы коллекций `<form>` элементы; `requestSubmit()` пожары отправляют событие + проверку.

`parentNode`, `childNodes`, `firstChild`, `lastChild`, `previousSibling`, `nextSibling`.

#### `.forms` property

Возвращает `HTMLCollection` из всех `<form>` элементы в документе.

```js
document.forms[0].submit();
```

#### `.submit()` vs `.requestSubmit()`

| Метод | Пожары `submit` событие | Запускает проверку |
|--------|---------------------|-----------------|
| `.submit()` | нет | нет |
| `.requestSubmit()` | да | да |

```js
form.requestSubmit(); // preferred — triggers validation & handlers
```

#### `.dataset` property

Читает `data-*` атрибуты как объект CamelCase.

```html
<div data-user-id="42" data-role="admin"></div>
```

```js
el.dataset.userId;  // "42"
el.dataset.role;    // "admin"
el.dataset.score = '100'; // sets data-score="100"
```

**When to use:**

Читать `data-id` для делегирования; отправка программной формы с проверкой; найти первого подходящего ребенка.

#### Common pitfalls

`dataset` устанавливает только строку; `getAttribute('value')` vs `input.value` отличаться; несколько форм — `document.forms[name]`.

**Pluses and minuses:**

| + | − |
|------|------|
| `dataset` очистить API пользовательских данных | Все `data-*` значения являются строками |
| `requestSubmit()` уважает ограничения | `submit()` обходит обработчики |
| Ограниченный запрос по элементам | `getElementsBy*` живые коллекции сбивают с толку |

**Examples:**

```js
document.getElementById('app');
document.getElementsByClassName('card');
document.querySelector('.card.active');
document.querySelectorAll('li');
```

**`querySelector` vs `getElementsBy*`:** `querySelector(All)` работает с любым элементом и принимает полные селекторы CSS; `getElementsBy*` только ищет потомков и возвращает живые коллекции.

</details>
	

<details>
  <summary>BOM</summary>

### BOM

**Definition:** Объектная модель браузера — объекты, предоставляемые браузером **вне** документа: `window`, `location`, `navigator`, `history`, `screen`, таймеры.

**How it works:**

- `window` является глобальным объектом в браузерах; `document`, `location`, `history`, `navigator` являются свойствами.
- API-интерфейсы BOM зависят от браузера (не входят в спецификацию ECMAScript); DOM является отдельным, но доступ к нему осуществляется через `window.document`.

| Объект | Цель |
|--------|---------|
| `window` | Глобальная область видимости, диалоговые окна, размер области просмотра |
| `location` | Текущий URL, перенаправление |
| `navigator` | Информация о браузере/ОС (`userAgent`) |
| `history` | Навигация назад/вперед |
| `screen` | Размеры экрана |

**When to use:**

Перенаправление через `location.href`; читать `navigator.userAgent` (функция лучше обнаруживает); `history.pushState` для СПА.

#### Common pitfalls

Рассматривать спецификацию как часть ECMAScript; `window.open` заблокирован блокировщиками всплывающих окон; `navigator` поля можно подделать.

**Pluses and minuses:**

| + | − |
|------|------|
| Единый `window` точка входа | Недоступно в узле (различные глобальные переменные) |
| `location` для навигации | Прямой `location` задание полная перезагрузка страницы |
| `history` для маршрутизации SPA | Ограничения по размеру государства в истории |

**Examples:**

```js
location.href = 'https://example.com';
navigator.userAgent;
history.back();
```

**Sources:** [javascript.info/browser-environment](https://javascript.info/browser-environment)

<a name="dom-vs-bom"></a>

### DOM vs BOM


| | ДОМ | спецификация |
| | --- | ----- |
| | **Объем** | Содержание документа (страница) | Среда браузера |
| | **Точка входа** | `document` | `window` |
| | **Примеры** | `querySelector`, `createElement` | `location`, `navigator`, `alert()` |
| | **Спецификация** | Спецификация DOM (работает и вне браузеров) | Спецификация HTML (только для браузера) |

</details>

<details>
  <summary>Changing the DOM</summary>

### Changing the DOM

**Definition:** Создавайте, вставляйте, изменяйте и удаляйте узлы для динамического обновления страницы.

**How it works:**

- `createElement` / `createTextNode` строить узлы; вставить через `append`, `before`, `after`, `replaceWith`.
- При перемещении существующего узла он удаляется из старого родительского правила — правила единственного родителя.
- `innerHTML` анализирует HTML-строку; `textContent` экранируется и безопасен для текста.

добавление существующего узла **перемещает** его (не копирует).

#### Legacy methods (old code)

`appendChild`, `removeChild`, `insertBefore`, `replaceChild` — все еще работают, но предпочитают современные методы, описанные выше.

#### Changing appearance (styles & classes)

Предпочитайте **классы CSS** встроенным стилям. Использовать `style` только для значений, вычисленных во время выполнения (например, координат).

| API | Роль |
|-----|------|
| `className` | весь `class` строка (заменяет все) |
| `classList.add/remove/toggle/contains` | по одному занятию |
| `elem.style.prop` | только встроенный стиль (camelCase: `backgroundColor`) |
| `elem.style.cssText` | переписать всю строку встроенного стиля |
| `getComputedStyle(elem)` | разрешенные стили после каскада (только для чтения; геометрия обычно в `px`) |

```js
el.classList.add('active');
el.classList.toggle('hidden');
el.style.left = `${x}px`;          // need units
el.style.display = '';             // clear inline → CSS classes apply again
getComputedStyle(el).marginTop;    // not available via el.style if set in CSS
```

`hasAttribute`, `getAttribute`, `setAttribute`, `removeAttribute`.

**When to use:**

Создание элементов списка; заменить баннер; продезинфицировать тогда `textContent` для пользовательского текста.

#### Common pitfalls

`innerHTML` с пользовательскими строками; добавление в цикл вызывает N перекомпоновок (используйте `DocumentFragment`); `appendChild` то же самое, что перемещать, а не копировать.

#### Creating nodes

**Pluses and minuses:**

| + | − |
|------|------|
| Современные методы вставки читаемы | Много перекомпоновок при вставке по одному |
| `replaceWith` атомный своп | `innerHTML` XSS, если ему не доверяют |
| `cloneNode(true)` глубокая копия | Перемещенные узлы оставляют старые ссылки устаревшими |

**Examples:**

```js
const div = document.createElement('div');
const text = document.createTextNode('Hello');
const comment = document.createComment('note');
```

#### Inserting nodes

| Метод | Вставки |
|--------|---------|
| `append(...nodes)` | после последнего ребенка |
| `prepend(...nodes)` | до появления первого ребенка |
| `before(...nodes)` | перед элементом |
| `after(...nodes)` | после элемента |
| `replaceWith(...nodes)` | заменяет элемент |

```js
parent.append(newLi);
parent.prepend(header);
item.before(divider);
item.after(footer);
```

#### Inserting HTML

| Метод | Разбирает HTML? | XSS-риск |
|--------|-------------|----------|
| `textContent` | нет (безопасный текст) | низкий |
| `innerHTML` | да | высокий — очистка пользовательского ввода |
| `insertAdjacentHTML(where, html)` | да | высокий |

```js
el.textContent = 'Safe text';
el.innerHTML = '<strong>Bold</strong>'; // only trusted HTML
el.insertAdjacentHTML('beforeend', '<li>Item</li>');
```

#### Removing & cloning

```js
node.remove();              // remove from DOM
node.cloneNode(true);       // deep clone (with children)
```

**Sources:** [javascript.info/modifying-document](https://javascript.info/modifying-document) · [javascript.info/styles-and-classes](https://javascript.info/styles-and-classes)

</details>

<details>
  <summary>Text, forms, and dialogs</summary>

### innerText vs textContent

**Definition:** `textContent` и `innerText` читать текст элемента по-другому; формы выставляют вживую `.value`; `alert`/`confirm`/`prompt` блокируют модальные диалоги.

**How it works:**

- `textContent` возвращает все текстовые узлы, включая скрытые; `innerText` с учетом макета (только видимый текст, триггеры перекомпоновки).
- Использование элементов управления формой `.value` имущество (живое состояние), не `innerHTML`.
- `requestSubmit()` запускает событие отправки и запускает проверку; `submit()` нет.


| | `textContent` | `innerText` |
| | --- | --------------- |
| | **Возврат** | Весь текст (в т.ч. скрытый) | Только видимый текст |
| | **С учетом макета** | нет | да (уважает CSS) |
| | **Производительность** | быстрее | медленнее (запускает перекомпоновку) |
| | **Использовать для** | чтение/письмо текста | отображать текст пользователю |

**When to use:** Установить текст метки → `textContent`; прочитать отображаемый текст → `innerText`; прочитать ввод → `.value`; подтвердить удаление → `confirm` или пользовательское модальное окно.

**Pluses and minuses:**

| + | − |
|------|------|
| `textContent` быстро и предсказуемо | `innerText` медленнее |
| `.value` исправить входные данные | Блокировка диалогов замораживает пользовательский интерфейс |
| `requestSubmit()` правильная проверка | `alert` не стилизован |

**Examples:**

```js
el.textContent = 'Hello'; // preferred for setting text
```

### Forms

Использовать `.value` для входов — **нет** `innerHTML` (особенно `<textarea>`). Перейдите через `document.forms[name]` и `form.elements[name]`; каждый элемент управления имеет `.form` вернемся к форме.

```js
const form = document.forms.my;     // or document.forms[0]
form.elements.login.value;
input.value;       // current value (property)
textarea.value;    // not textarea.innerHTML
form.requestSubmit(); // triggers validation + submit event
form.submit();        // sends without submit event / validation
```

`<select>`: `select.value`, `select.selectedIndex`, or `option.selected`. Создавайте варианты с `new Option(text, value, defaultSelected, selected)`.

**Focus:** `focus` / `blur` не всплывать — используйте захват или всплеск `focusin` / `focusout`. Большинству элементов требуется `tabindex` быть сосредоточенным (`0` = естественный порядок табуляции, `-1` = только программные). Текущий фокус: `document.activeElement`.

**Value events:** `input` срабатывает при каждом изменении (набор текста, вставка, речь); `change` срабатывает при завершении редактирования (размытие текста; немедленно для флажка/выбора). `cut` / `copy` / `paste` являются `ClipboardEvent`с - может `preventDefault()`.

**Sources:** [javascript.info/alert-prompt-confirm](https://javascript.info/alert-prompt-confirm) · [javascript.info/form-elements](https://javascript.info/form-elements) · [javascript.info/focus-blur](https://javascript.info/focus-blur) · [javascript.info/events-change-input](https://javascript.info/events-change-input) · [javascript.info/forms-submit](https://javascript.info/forms-submit)

### Dialog popups

| Метод | Возврат |
|--------|---------|
| `alert(msg)` | `undefined` |
| `confirm(msg)` | `true` / `false` |
| `prompt(msg, default)` | строка или `null` |

Все три являются **модальными**: они приостанавливают выполнение скрипта и блокируют остальную часть страницы до тех пор, пока она не будет закрыта. Внешний вид и положение контролируются браузером.

**Common pitfalls:** `textarea.innerHTML` vs `textarea.value`; с использованием `innerText` в горячих петлях; `confirm` в асинхронном коде блокируется основной поток.

</details>

<details>
  <summary>MutationObserver</summary>

### MutationObserver

**Definition:** Встроенный API для отслеживания изменений DOM и реагирования посредством обратного вызова.

**How it works:**

- Обратный вызов наблюдателя получает пакет `MutationRecord`с после изменения DOM в микрозадаче.
- `observe(target, { childList, attributes, subtree, characterData })` фильтрует, что смотреть.
- `disconnect()` прекращает наблюдение; `takeRecords()` ожидаются сбросы.

добавлены/удалены дочерние узлы, изменения атрибутов, изменения текстового содержимого.

**When to use:**

Виджет, внедренный рекламным скриптом; контент-редактируемая синхронизация; изменения атрибутов пользовательского элемента.

сторонние скрипты, изменяющие DOM, лениво загружаемый контент, веб-компоненты.

#### MutationObserver vs ResizeObserver


| | Мутационный наблюдатель | Изменить размерObserver |
| | --- | ------------------ |
| | **Часы** | Изменения в дереве DOM (узлы, атрибуты, текст) | Изменение размера элемента |
| | **Когда использовать** | Динамическое внедрение контента, сторонние виджеты | Адаптивные компоненты, диаграммы |
| | **Производительность** | Может стрелять часто — узко `subtree`/`attributes` | Срабатывает только при изменении макета |

См. также [IntersectionObserver и ResizeObserver](#intersection-resize-observer).

#### Common pitfalls

Наблюдение всего `document.body` с `subtree: true`; бесконечный цикл, если обратный вызов изменяет наблюдаемое поддерево; забывая `disconnect`.

**Pluses and minuses:**

| + | − |
|------|------|
| Реакция на изменения DOM сторонних разработчиков | Может стрелять очень часто |
| Асинхронная пакетная обработка — не синхронная | Узкие возможности или страдает производительность |
| Опрос не требуется | Не для изменения размера — используйте ResizeObserver |

**Examples:**

```js
const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    console.log(m.type, m.target);
  }
});

observer.observe(document.querySelector('#app'), {
  childList: true,
  attributes: true,
  subtree: true,
});

observer.disconnect(); // cleanup when done
```

**Sources:** [javascript.info/mutation-observer](https://javascript.info/mutation-observer)

</details>

<details>
  <summary>Forms vs dialogs</summary>

### Form vs modal

**Definition:** Формы собирают и отправляют структурированные данные; модальные окна прерывают поток пользователя для целенаправленных действий или подтверждений.

**How it works:**

- Формы используют собственные элементы управления + API проверки; submit перемещается или перехватывается с помощью `preventDefault` + принести.
- Модальные окна ловят фокус, блокируют фоновое взаимодействие; родной `<dialog>.showModal()` или собственный шаблон наложения.


| | Форма | Модальный |
| | --- | ------ |
| | **Цель** | Собрать и отправить данные | Прерывание рабочего процесса для действия/информации |
| | **Использовать для** | Регистрация, оформление заказа, поиск | Подтверждения, ошибки, быстрый ввод |
| | **UX** | Часть потока страницы | Блокирует страницу до закрытия |

**When to use:**

Оформить заказ → форма; удалить подтверждение → модально или `confirm`; панель поиска → встроенная форма.

#### Common pitfalls

Модальный без ловушки фокуса; вложенный `<form>` неверный; форма в модальном режиме без надлежащего `aria-modal`.

**Pluses and minuses:**

| + | − |
|------|------|
| Семантический HTML, доступный | Чрезмерное использование модальных окон вредит UX |
| Собственная проверка | Пользовательские модальные окна требуют тщательной работы |
| Подходит для многопольных рабочих процессов | Формы тяжелые для одиноких да/нет |

**Examples:**

```js
// Form submit via fetch
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await fetch('/api/signup', { method: 'POST', body: new FormData(form) });
});

// Native dialog
const dlg = document.querySelector('dialog');
dlg.showModal();
dlg.close('confirmed');
```

**Sources:** [форма против модального](https://thecontentauthority.com/blog/form-vs-modal)

</details>

---

Вопросы и ответы на собеседовании, а также задачи по написанию кода находятся в [JS — Interview](./3_js_interview.md).
