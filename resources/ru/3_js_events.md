# JS Browser — Events

События браузера: обработчики, фазы, делегирование и пользовательские события.

[ ← Назад в JS-хаб](./3_js.md)

### Related docs

* [Документ](./3_js_browser.md) · [Дополнительный браузер](./3_js_browser_extra.md) · [JS Interview](./3_js_interview.md)
* [JS Core](./3_js_core.md) · [JS-функции](./3_js_functions.md) · [JS OOP](./3_js_oop.md) · [JS Async](./3_js_async.md)
* [HTML](./1_html.md) · [Веб-API](./6_web_api.md)

### Main concepts

| Площадь | Темы |
|------|--------|
| **События** | Всплывание, захват, делегирование, действия по умолчанию |
| **Интерфейс** | Мышь, указатель, клавиатура, прокрутка |
| **Формы** | Фокус, ввод/изменение, отправка |
| **Пользовательский** | `CustomEvent` и `detail` полезная нагрузка |

### Sections

> Теория `<details>` блоки следуют: **Определение** · **Как это работает** · **Когда использовать** · **Плюсы и минусы** · **Примеры** · **Мысли** · **Источники**. **Определение** обязательно; другие разделы являются необязательными.

- [Events](#events)
- [Default actions](#default-actions)
- [Event phases](#event-phases)
- [Event handlers & delegation](#event-handlers-and-delegation)
- [Custom events](#custom-events)
- [UI events (mouse, pointer, keyboard)](#ui-events-mouse-pointer-keyboard)
- [Интервью](./3_js_interview.md)

---

## Events

<details>
  <summary>Events</summary>

### Events

**Definition:** Пользовательский интерфейс браузера управляется событиями. Ан `EventTarget` (`Element`, `document`, `window`) получает именованные события; вы подписываетесь на `addEventListener` и отписаться с помощью `removeEventListener` используя **ту же ссылку на функцию**.

**How it works:**

- `addEventListener(type, listener, options?)` — `type` чувствителен к регистру (`"click"`). Третий аргумент может быть `{ capture, once, passive }` или логическое значение (`true` = захват).
- `once: true` удаляет прослушиватель после первого вызова. `passive: true` обещает, что слушатель не позвонит `preventDefault()` (используется для прокрутки/касания).
- Предпочитать `addEventListener` над `elem.onclick = ...` — присваивание сохраняет только один обработчик и перезаписывает предыдущий.
- `this` внутри прослушивателя классической функции — это элемент, к которому прикреплен прослушиватель (`currentTarget`). Стрелочные функции не перепривязываются `this`.

**When to use:** Клики, ввод, отправка, клавиатура, загрузка. Пропустить обработчики свойств (`onclick`), когда вам нужно более одного слушателя или `{ once, capture, passive }`.

**Pluses and minuses:**

| + | − |
|------|------|
| Множество слушателей каждого типа; объект опций | Необходимо сохранить ту же функцию для удаления |
| Работает на любом `EventTarget` | Забывчивость `removeEventListener` может протечь |

**Examples:**

```js
function onSave(e) {
  console.log(e.type, e.currentTarget);
}

button.addEventListener("click", onSave);
button.addEventListener("click", onSave, { once: true });
button.removeEventListener("click", onSave);
```

**Thoughts:** Одна именованная функция + `addEventListener`/`removeEventListener` это шаблон, безопасный для интервью.

**Sources:** [MDN EventTarget.addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) · [javascript.info/introduction-browser-events](https://javascript.info/introduction-browser-events)

</details>

<details>
  <summary>Default actions</summary>

### Default actions

**Definition:** Многие события вызывают встроенные действия браузера (навигация по ссылке, отправка формы, выбор текста, контекстное меню). Отмените это с помощью `event.preventDefault()` — or `return false` только из `on*` обработчики свойств/атрибутов.

**How it works:**

- `preventDefault()` работает, если событие `cancelable` а слушатель нет `{ passive: true }`.
- `event.defaultPrevented` is `true` после отмены — лучше проверить это еще раз `stopPropagation()` поэтому внешние обработчики (аналитика, меню документов) по-прежнему видят событие.
- `passive: true` сообщает браузеру, что вы не будете отменять (более плавная прокрутка/прикосновение); по умолчанию часто является пассивным для `touchstart`/`touchmove` в Хроме/Файрфоксе.
- Предотвращение раннего события может подавить последующее действие (например, отменить `mousedown` → нет фокуса).

**When to use:** Пользовательские ссылки SPA, проверка формы перед отправкой, настраиваемые контекстные меню, перетаскивание без перетаскивания собственного изображения.

**Examples:**

```js
menu.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;
  e.preventDefault();
  route(a.getAttribute("href"));
});

document.addEventListener("contextmenu", (e) => {
  if (e.defaultPrevented) return; // child already handled
  e.preventDefault();
  showDocMenu(e);
});
```

**Thoughts:** `stopPropagation` ≠ `preventDefault`. Отмените значение по умолчанию; позвольте событию всплыть, если у вас нет веских причин не делать этого.

**Sources:** [javascript.info/default-browser-action](https://javascript.info/default-browser-action)

</details>

<details>
  <summary>Event phases</summary>

### Event phases

**Definition:** Событие DOM проходит в три этапа: **захват** (корневой → целевой), **на целевом объекте**, затем **всплывающий** (цель → корневой), когда `event.bubbles` это правда. `event.eventPhase` is `CAPTURING_PHASE` (1), `AT_TARGET` (2), or `BUBBLING_PHASE` (3).

**How it works:**

- Захватите слушателей, бегущих по пути **вниз** (`addEventListener(type, fn, true)` or `{ capture: true }`). Обработчики пузырьков работают по пути **вверх** (по умолчанию).
- `event.target` — это узел, где началось событие. `event.currentTarget` — это узел, прослушиватель которого работает сейчас.
- `stopPropagation()` останавливает дальнейший захват/пузырение. Он **не** отменяет действия по умолчанию — используйте `preventDefault()` (и слушатель не должен быть `{ passive: true }`).
- `stopImmediatePropagation()` также пропускает оставшиеся прослушиватели на **том же** узле.
- Если `bubbles` имеет значение false, поток завершается после целевой фазы.

**When to use:** Захват для «бега перед детьми» (например, фокусировка). `preventDefault()` on `submit`/`click` чтобы переопределить собственное поведение. Избегать `stopPropagation()` если только вам не нужно изолировать виджет.

**Pluses and minuses:**

| + | − |
|------|------|
| Одна модель для вложенного пользовательского интерфейса | `stopPropagation` скрывает ошибки и ломает другие слушатели |
| `target` vs `currentTarget` является явным | Захват + пузырь на одном узле может удивить |

**Examples:**

```js
parent.addEventListener("click", (e) => {
  // click child → target is child, currentTarget is parent
  console.log(e.target.id, e.currentTarget.id, e.eventPhase);
});

link.addEventListener("click", (e) => {
  e.preventDefault(); // stay on the page
});

inner.addEventListener("click", (e) => e.stopPropagation());
```

**Thoughts:** По умолчанию — пузырь. Capture — это исключение, которое вы указываете в третьем аргументе.

**Sources:** [MDN Event.eventPhase](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase) · [MDN Event.stopPropagation](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) · [javascript.info/bubbling-and-capturing](https://javascript.info/bubbling-and-capturing)

</details>

<details>
  <summary>Event handlers & delegation</summary>

### Event handlers & delegation

**Definition:** **Делегирование** присоединяет **одного** слушателя к общему предку. Внутри обработчика `event.target` — исходный узел; `event.currentTarget` является предком. Использовать `closest(selector)` поэтому щелчки по внутреннему тексту/значкам по-прежнему соответствуют предполагаемому элементу управления.

**How it works:**

- Всплывание доставляет дочерние события родительскому элементу, поэтому динамически добавляемые дочерние элементы обрабатываются без повторной привязки.
- Проверьте реальный контроль: `const item = e.target.closest("li[data-id]")`. If `!item` or `!e.currentTarget.contains(item)`, игнорируй.
- Не стилизовать `e.target` вслепую — это может быть вложенный `<span>`, а не `<li>`.
- Сопряжение с `data-*` атрибуты для идентификаторов вместо встроенных `onclick`.

**When to use:** Списки, таблицы, меню и любой пользовательский интерфейс, который добавляет/удаляет строки. Прямые прослушиватели в каждой строке, когда набор небольшой и статический.

**Pluses and minuses:**

| + | − |
|------|------|
| Один слушатель; работает для будущих узлов | Нуждаться `closest` / игнорировать несовпадающие клики |
| Меньше памяти, чем прослушиватели N строк | Вложенным виджетам может потребоваться `stopPropagation` |

**Examples:**

```js
list.addEventListener("click", (e) => {
  const item = e.target.closest("li[data-id]");
  if (!item || !list.contains(item)) return;
  item.remove();
});
```

**Thoughts:** Ответ на собеседовании: «Послушайте родителя, определите ребенка с `closest`.”

**See also:** [Навигация по DOM — `closest`](./3_js_browser.md#dom-navigation)

**Sources:** [MDN Event.target](https://developer.mozilla.org/en-US/docs/Web/API/Event/target) · [MDN Event.currentTarget](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget) · [javascript.info/event-delegation](https://javascript.info/event-delegation)

</details>

<details>
  <summary>Custom events</summary>

### Custom events

**Definition:** `CustomEvent` это `Event` ты создаешь и `dispatchEvent` сам. Необязательный `detail` полезная нагрузка — это любое значение (часто объект), читаемое как `event.detail`.

**How it works:**

- `new CustomEvent(type, { detail, bubbles, cancelable, composed })`. Имена событий чувствительны к регистру.
- `dispatchEvent` запускает прослушиватели **синхронно** с теми же правилами захвата/всплытия, что и собственные события.
- По умолчанию `bubbles` is `false` — предки не услышат, если вы не установите `bubbles: true`.
- `composed: true` позволяет событию пересекать теневой DOM (веб-компоненты).

**When to use:** Отделить виджеты (`"cart:add"`, `"modal:close"`) без глобальной шины событий. Пропустите состояние всего приложения — хранилище или обратный вызов становятся более понятными.

**Pluses and minuses:**

| + | − |
|------|------|
| То же оборудование для проведения мероприятий DOM | Тихий, если `bubbles` неверно, и вы слушаете родительского |
| `detail` переносит структурированные данные | Легкость злоупотребления против явных вызовов функций |

**Examples:**

```js
item.addEventListener("cart:add", (e) => {
  console.log(e.detail.id);
});

item.dispatchEvent(
  new CustomEvent("cart:add", {
    bubbles: true,
    detail: { id: "sku-1" },
  }),
);
```

**Thoughts:** Пользовательские события предназначены для **компонентов DOM** и не заменяют состояние приложения.

**Sources:** [MDN CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) · [MDN sendEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent) · [javascript.info/dispatch-events](https://javascript.info/dispatch-events)

</details>

<a name="ui-events-mouse-pointer-keyboard"></a>

<details>
  <summary>UI events (mouse, pointer, keyboard)</summary>

### UI events (mouse, pointer, keyboard)

**Definition:** Для ввода данных в виде указателя и горячих клавиш клавиатуры используются специальные семейства событий. Предпочитайте **События указателя** для нового пользовательского интерфейса, который должен работать с мышью, касанием и пером; используйте события клавиатуры для сочетаний клавиш (не для отслеживания текста поля — используйте `input`).

**How it works:**

**Mouse (basics):** `mousedown` → `mouseup` → `click` (левый). Также `dblclick`, `contextmenu`, `mousemove`, `mouseover`/`mouseout` (пузырь, связанная цель), `mouseenter`/`mouseleave` (без пузырьков, без входа/выхода детей). Модификаторы: `ctrlKey` / `metaKey` (команда Mac) / `shiftKey` / `altKey`. Координаты: `clientX/Y` (окно просмотра), `pageX/Y` (документ). `event.button`: 0 слева, 1 посередине, 2 справа.

**mouseover vs mouseenter:** `mouseover`/`mouseout` пожар при пересечении дочерней границы (много шума). `mouseenter`/`mouseleave` активируйте один раз для элемента в целом — лучше для «наведите курсор на эту карту».

**Drag with mouse/pointer:** `pointerdown` → документ `pointermove` → `pointerup`; помнить `shiftX/Y` от указателя до угла элемента; отменить перетаскивание собственного изображения (`ondragstart = () => false`) и установите `touch-action: none` избегать `pointercancel`. Найдите дропблы с помощью `document.elementFromPoint` (сначала скройте перетаскиваемый элемент). Предпочитать `setPointerCapture(pointerId)` поэтому ходы остаются на месте без прослушивателей документов.

**Pointer extras:** `pointerId`, `pointerType` (`"mouse"|"pen"|"touch"`), `isPrimary` (первый палец). Те же имена, что и мышь (`pointerdown` …).

**Keyboard:** `keydown` / `keyup`. `event.key` = символ/значение (`"z"`, `"Enter"`); `event.code` = физический ключ (`"KeyZ"`) — не зависит от раскладки горячих клавиш. Автоповторяющиеся наборы `event.repeat`. Фильтрация горячих клавиш с помощью `code` + `ctrlKey || metaKey`. **Не** используйте только клавиатуру для проверки текстовых полей — клавиши пропуска/вставки речи; использовать `input`.

**Scroll:** `scroll` срабатывает *после* прокрутки — невозможно `preventDefault` там; заморозить с помощью CSS `overflow: hidden` или отменить вызывающий ключ (`PageDown`). Помощники по геометрии: [Размеры элементов и окон и прокрутка](./3_js_browser_extra.md#element-and-window-dimensions--scroll).

**When to use:** Горячие клавиши → `keydown` + `code`. Подсказки при наведении → `mouseenter`/`mouseleave` или эквиваленты указателей. Ползунки/перетаскивание → указатель + захват. Значение поля → `input` (см. [формы](./3_js_browser.md#text-forms-and-dialogs)).

**Pluses and minuses:**

| + | − |
|------|------|
| Указатель объединяет мышь, сенсорный экран и перо | Должен справиться `pointercancel` / родное сопротивление |
| Делегирование работает для динамических списков | `mouseover` наводнения с дочерними событиями |
| `code` стабильно для ярлыков | Мобильный IME может сообщить `key = "Unidentified"` |

**Examples:**

```js
document.addEventListener("keydown", (e) => {
  if (e.code === "KeyZ" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    undo();
  }
});

thumb.onpointerdown = (e) => {
  thumb.setPointerCapture(e.pointerId);
  thumb.onpointermove = (ev) => {
    thumb.style.left = `${ev.clientX - slider.getBoundingClientRect().left}px`;
  };
  thumb.onpointerup = () => {
    thumb.onpointermove = null;
  };
};
```

**Thoughts:** Путь интервью: всплывание → делегирование → захват указателя для перетаскивания → `preventDefault` для значений по умолчанию.

**Sources:** [javascript.info/mouse-events-basics](https://javascript.info/mouse-events-basics) · [javascript.info/mousemove-mouseover-mouseout-mouseenter-mouseleave](https://javascript.info/mousemove-mouseover-mouseout-mouseenter-mouseleave) · [javascript.info/mouse-drag-and-drop](https://javascript.info/mouse-drag-and-drop) · [javascript.info/pointer-events](https://javascript.info/pointer-events) · [javascript.info/keyboard-events](https://javascript.info/keyboard-events) · [javascript.info/onscroll](https://javascript.info/onscroll)

</details>

---

Вопросы и ответы на собеседовании, а также задачи по написанию кода находятся в [JS — Interview](./3_js_interview.md).
