# PWA — Interview

Ответы заполнены для опубликованной части, остальные пустые.

[ ← Вернуться в хаб](./6_web_api.md)

### Related docs

- [Веб-API — Приложения](./6_web_api_apps.md) · [WebSockets — Интервью](./6_web_api_websockets_interview.md) · [PWA — Интервью](./6_web_api_pwa_interview.md) · [Веб-API — Интервью](./6_web_api_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Вопросы с [Devinterview.io — PWA](https://devinterview.io/questions/web-and-mobile-development/pwa-interview-questions/).

### PWA Fundamentals

<details>
<summary>What is a Progressive Web App (PWA)?</summary>

### What is a Progressive Web App (PWA)?

**Definition:**

Прогрессивное веб-приложение — сайт, который можно установить и, если добавить service worker, продолжать работу из кэша. Это по-прежнему веб: один URL, одна кодовая база и браузер как среда выполнения.

**How it works:**

- Манифест веб-приложения (имя, значки, `start_url`, `display`) говорит браузеру, как должно выглядеть установленное приложение.
- HTTPS или localhost в разработке нужны, прежде чем браузер предложит установку.
- Service worker — отдельный скрипт, который может перехватывать загрузки, заполнять Cache API и принимать push. Текущие правила установки Chromium его не требуют; офлайн-поведение требует.
- После установки приложение может открыться без хромированной оболочки браузера, если `display` равен `standalone`.
- Обновления приходят, когда пользователь онлайн и новый service worker берёт управление. Проверки магазина нет, пока вы дополнительно не упакуете сайт для магазина.
- Страница всё равно работает как обычный сайт в браузере, который её не устанавливает.

**Sources:**

- [MDN — Progressive web apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
</details>

<details>
<summary>How do PWAs differ from traditional web applications?</summary>

### How do PWAs differ from traditional web applications?

**Definition:**

Обычный сайт ждёт сеть на каждую навигацию и живёт во вкладке. PWA можно установить, открыть в своём окне и отвечать на навигацию из кэша, если вы дали ему service worker.

**How it works:**

- Устанавливаемость идёт от манифеста и безопасного контекста. Значок тогда стоит рядом с другими приложениями.
- У обычного сайта нет запроса на установку и нет отдельного окна, если пользователь сам не добавил закладку.
- Push и фоновая синхронизация нуждаются в service worker. Обычная страница не примет push после закрытия.
- Офлайн — это стратегия кэша, а не свойство «быть PWA». Без обработчика `fetch` установленное приложение всё равно падает без сети.
- Оба варианта можно открыть по ссылке и проиндексировать. Запись в магазине — необязательная упаковка, а не определение.
- Адаптивная вёрстка есть у любого современного сайта. Сама по себе она не делает сайт устанавливаемым.

**Examples:**

```html
<link rel="manifest" href="/manifest.webmanifest" />
```

**Sources:**

- [MDN — Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
</details>

<details>
<summary>Can you list the core pillars of a PWA?</summary>

### Can you list the core pillars of a PWA?

**Definition:**

Части, которые есть у серьёзного PWA: безопасный origin, манифест, service worker, вёрстка под экран и быстрая первая загрузка. Установка и офлайн — два результата, которые видит пользователь.

**How it works:**

- HTTPS (или localhost) — ворота для service worker и для запроса установки.
- Манифест даёт имя, значки, стартовый URL и режим отображения.
- Service worker кэширует оболочку приложения и может отдать её, когда сеть отказала.
- Адаптивная вёрстка использует тот же CSS, что и любой сайт. Установленное окно — просто ещё один viewport.
- Оболочка приложения — устойчивая рамка (шапка, навигация, пустая область контента), которую кэшируют заранее, а данные дорисовывают потом.
- «Быстро» и «надёжно» — следствие кэша и небольших ресурсов, а не отдельных форматов файлов.
- Вовлечение — установка, push, фоновая синхронизация — стоит на воркере и необязательно.

**Sources:**

- [MDN — Progressive web apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
</details>

<details>
<summary>What are the advantages of developing a PWA over a native app?</summary>

### What are the advantages of developing a PWA over a native app?

**Definition:**

PWA поставляется как сайт: одна кодовая база, URL и обновление при следующей загрузке браузером. Нативное приложение получает более глубокий доступ к устройству и распространение через магазин ценой отдельной сборки на платформу.

**How it works:**

- Вы пишете HTML, CSS и JavaScript один раз. Сборки iOS и Android не обязательны для установки из браузера.
- Пользователь может открыть URL до любой установки. Поиск индексирует страницы.
- Новый деплой заменяет кэшированные ресурсы, когда обновляется service worker. За каждым исправлением в магазин не ходят.
- Установленный пакет часто меньше, потому что среду выполнения уже даёт браузер.
- Нативный код всё ещё выигрывает в тяжёлой графике, правилах фонового выполнения и API, которых нет в вебе.
- Магазины тоже могут распространять PWA (инструменты упаковки его оборачивают), но это необязательно. Источник остаётся сайтом.

**Sources:**

- [MDN — What is a progressive web app?](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/What_is_a_progressive_web_app)
</details>

<details>
<summary>What is the role of the service worker in a PWA?</summary>

### What is the role of the service worker in a PWA?

**Definition:**

Service worker — скрипт, который браузер выполняет отдельно от страницы. Он может перехватывать сетевые запросы, читать и писать Cache API и принимать push и события фоновой синхронизации, даже когда страница закрыта.

**How it works:**

- Его регистрируют со страницы, затем он устанавливается, активируется и позже заменяется, когда байты нового скрипта отличаются.
- Обработчик `fetch` выбирает «сначала кэш», «сначала сеть» или запасной ответ. Это и есть офлайн-поведение.
- DOM он не трогает. Он шлёт сообщения странице, а страница обновляет интерфейс.
- Push приходит на воркер. Воркер показывает уведомление, если пользователь дал разрешение.
- Background Sync (API Chromium) позволяет воркеру повторить поставленную в очередь запись, когда связь возвращается.
- Воркер работает только на безопасном origin и только в области, которую вы зарегистрировали.

**Examples:**

```js
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((hit) => hit || fetch(event.request)),
  );
});
```

**Sources:**

- [MDN — Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
</details>

<details>
<summary>How do you make a web app installable on a user's home screen?</summary>

### How do you make a web app installable on a user's home screen?

**Definition:**

Отдайте сайт по HTTPS и подключите манифест, который удовлетворяет правилам установки браузера. Тогда браузер сам предложит установку; отдельный API «на домашний экран» вы не реализуете.

**How it works:**

- Chromium просит `name` или `short_name`, значки 192 и 512, `start_url` и `display` или `display_override`. `prefer_related_applications` не должен быть истинным.
- Каждая страница, которая должна считаться, включает `<link rel="manifest" href="...">`.
- Localhost допустим при разработке. Страница `file://` не устанавливается.
- Service worker нужен, чтобы добавить офлайн. В текущих критериях установки у MDN его нет как требования к запросу Chromium.
- `beforeinstallprompt` (Chromium, не iOS) позволяет показать свою кнопку и вызвать `prompt()` у события.
- iOS использует меню «Поделиться». События `beforeinstallprompt` там нет.
- После установки `display: "standalone"` открывает приложение без вкладок браузера.

**Examples:**

```json
{
  "name": "Notes",
  "start_url": "/",
  "display": "standalone",
  "icons": [{ "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }]
}
```

**Sources:**

- [MDN — Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
</details>

<details>
<summary>What is a manifest file and what is its significance in PWAs?</summary>

### What is a manifest file and what is its significance in PWAs?

**Definition:**

Манифест веб-приложения — JSON-файл, который описывает установленное приложение: имя, значки, стартовый URL, цвета и открывается ли оно отдельным окном. Без него Chromium не предложит сайт к установке.

**How it works:**

- `name` и `short_name` — подписи. В `icons` нужно несколько размеров, чтобы лаунчер не растягивал одну картинку.
- `start_url` — страница, которая открывается со значка. `scope` ограничивает, какие URL остаются внутри установленного окна.
- `display` обычно `standalone` для окна приложения или `browser` для обычной вкладки. `display_override` перечисляет запасные варианты.
- `background_color` виден до загрузки таблицы стилей. `theme_color` красит окружающий интерфейс.
- `id` даёт приложению устойчивую личность, когда меняется `start_url`.
- HTML-страница указывает на файл через `<link rel="manifest">`. Манифест с ответом 404 значит, что сайт не устанавливается.

**Examples:**

```html
<link rel="manifest" href="/manifest.webmanifest" />
```

**Sources:**

- [MDN — Web app manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)
</details>

<details>
<summary>What is the purpose of the 'Add to Home Screen' feature?</summary>

### What is the purpose of the 'Add to Home Screen' feature?

**Definition:**

«На экран Домой» превращает сайт в значок лаунчера, который открывает стартовый URL в отдельном окне. Смысл — повторный визит в одно нажатие, а не вторая копия кода.

**How it works:**

- Браузер показывает свою установку, когда манифест подходит. Страница может добавить кнопку, которая вызывает `prompt()` у `beforeinstallprompt`, где это событие есть.
- Значок и имя берутся из манифеста, поэтому лаунчер совпадает с продуктом.
- Запуск использует `start_url` и `display`. `standalone` прячет адресную строку.
- Офлайн по-прежнему зависит от service worker. Сам значок ничего не кэширует.
- Практический результат — вовлечение: приложение остаётся на устройстве и может принимать push, если пользователь разрешил.
- iOS ставит из меню «Поделиться». Событие Chromium — не то, как устроена эта платформа.

**Sources:**

- [MDN — Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
</details>

<details>
<summary>How can you detect if your web app has been added to the user's home screen?</summary>

### How can you detect if your web app has been added to the user's home screen?

**Definition:**

Определяют режим отображения, в котором открылось окно, а не постоянный бит «установлено» на устройстве. `matchMedia("(display-mode: standalone)")` — проверка для разных браузеров, а `navigator.standalone` — старый сигнал iOS.

**How it works:**

- Когда манифест говорит `display: "standalone"` и пользователь открыл значок, медиазапрос совпадает.
- Вкладка на том же origin не совпадает, поэтому одна сборка может прятать кнопку установки только в установленном окне.
- iOS Safari давно показывает `navigator.standalone === true` для веб-приложения с домашнего экрана.
- `beforeinstallprompt` говорит, что браузер Chromium готов установить. Он не говорит, что установка уже была. Событие `appinstalled` приходит, когда пользователь согласился.
- `document.hidden` — о том, ушла ли вкладка в фон. Это не проверка установки.
- Нет веб-API, который перечислит каждое устройство, где пользователь установил приложение.

**Examples:**

```js
const installed = window.matchMedia("(display-mode: standalone)").matches
  || window.navigator.standalone === true;
```

**Sources:**

- [MDN — display-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/display-mode)
</details>

<details>
<summary>Explain how PWAs achieve offline functionality.</summary>

### Explain how PWAs achieve offline functionality.

**Definition:**

Офлайн — это service worker, который отвечает на `fetch` из Cache API, плюс IndexedDB, когда странице нужны структурные данные, пережившие перезагрузку. Сам манифест ничего не кэширует.

**How it works:**

- При установке воркер открывает именованный кэш и кладёт оболочку: HTML, CSS, JS и значки.
- Обработчик «сначала кэш» возвращает кэшированный ответ, если он есть, иначе идёт в сеть. «Сначала сеть» пробует сеть и берёт кэш, когда она отказала.
- Версионируйте имя кэша. При активации удаляйте кэши, которых больше не называете, чтобы старые ресурсы не залипали.
- IndexedDB хранит записи (черновики, последний известный список). `localStorage` — маленькая синхронная карта строк и плохое место для набора данных.
- Background Sync может позже повторить поставленную запись в браузерах, которые это умеют. Сама очередь обычно живёт в IndexedDB.
- Покажите пользователю, что ответ пришёл из кэша. Тихая устаревшая страница выглядит как ошибка.

**Examples:**

```js
const cache = await caches.open("shell-v3");
await cache.addAll(["/", "/app.css", "/app.js"]);
```

**Sources:**

- [MDN — Caching](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
</details>

<details>
<summary>What are the security requirements for a PWA?</summary>

### What are the security requirements for a PWA?

**Definition:**

PWA — сайт с дополнительными возможностями, поэтому он наследует правила веба: HTTPS, service worker того же origin и явное разрешение на push. Манифест не выдаёт доступ к камере или к чужим origin.

**How it works:**

- Service worker и запрос установки требуют безопасный контекст. Отдавайте TLS и перенаправляйте HTTP на HTTPS.
- Скрипт воркера — того же origin (или разрешён правилами области). Сторонний скрипт не может тихо стать вашим прокси `fetch`.
- Content-Security-Policy ограничивает, какие скрипты и соединения может использовать страница. Это важнее, когда страница установлена и выглядит как приложение.
- Push и уведомления требуют жест пользователя и разрешение. Отказ — нормальный исход.
- Кэшируйте только ответы, которым доверяете. Кэш страницы ошибки атакующего или непрозрачного чужого ответа, который вы не собирались хранить, станет следующей офлайн-загрузкой.
- Установленное приложение всё ещё веб. XSS на странице выполняется с властью origin, включая воркер, если страница может его зарегистрировать.

**Sources:**

- [MDN — Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
</details>

<details>
<summary>Can you delineate between App Shell and content in a PWA context?</summary>

### Can you delineate between App Shell and content in a PWA context?

**Definition:**

Оболочка приложения — устойчивая рамка интерфейса, которую кэшируют, чтобы окно отрисовалось сразу. Контент — данные, которые меняются от пользователя или визита и дорисовываются, когда оболочка уже на экране.

**How it works:**

- Части оболочки — шапка, навигация и пустая область, куда придут результаты. Они меняются при деплое, а не когда пользователь нажал.
- Контент — JSON, изображения и текст этой сессии. Кэшируйте его с более коротким сроком или стратегией «сначала сеть».
- Воркер может вернуть оболочку на навигацию, а страница затем запрашивает данные. Офлайн оболочка всё равно рисуется, а запрос данных явно падает.
- Если положить персональный HTML в долгоживущий кэш оболочки, один пользователь увидит страницу другого.
- Разделение — выбор кэширования. Это не отдельный формат файла, которого требует браузер.

**Examples:**

```text
cache "shell-v3": /app.html, /app.css, /app.js
network, then cache: /api/notes
```

**Sources:**

- [MDN — Caching](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
</details>

<details>
<summary>How does a PWA function on a low-bandwidth or offline network?</summary>

### How does a PWA function on a low-bandwidth or offline network?

**Definition:**

На слабой или отсутствующей сети service worker отвечает тем, что уже закэшировал, а страница читает структурные данные из IndexedDB. Запросы, которых в кэше не было, падают, и интерфейс должен это сказать.

**How it works:**

- Стратегия «сначала кэш» обходит медленную сеть для оболочки. Тайм-аут вокруг `fetch` может отступить в кэш, когда радио зависло, а не висеть.
- Оболочку кладут в кэш при установке. Кэш во время работы хранит ответы, которые пользователь реально запросил, например последнюю статью.
- IndexedDB держит черновики и последний список, чтобы перезагрузка офлайн не была пустым экраном.
- Background Sync, где он есть, ставит POST в очередь, пока браузер не решит, что сеть снова пригодна.
- У изображения может быть маленький кэшированный заполнитель. Не притворяйтесь, что запись прошла, если она только в очереди.
- Сами service worker требуют HTTPS, в том числе когда следующие загрузки отдаются из кэша.

**Sources:**

- [MDN — Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
</details>

<details>
<summary>What are push notifications in the context of PWAs?</summary>

### What are push notifications in the context of PWAs?

**Definition:**

Веб-push доставляет сообщение service worker, пока страница закрыта. Воркер затем показывает уведомление, если пользователь дал разрешение и у браузера есть push-служба.

**How it works:**

- Страница спрашивает `Notification.permission`, затем `pushManager.subscribe` с публичным ключом VAPID. Подписка (endpoint и ключи) уходит на ваш сервер.
- Сервер шлёт нагрузку на этот endpoint. Push-служба браузера будит воркер событием `push`.
- Воркер вызывает `showNotification`. Обработчик `notificationclick` фокусирует или открывает окно.
- iOS поддерживает веб-push для установленных веб-приложений с домашнего экрана, не для случайной вкладки. Другие браузеры различаются.
- Разрешение — на origin, и его легко потерять. Не спрашивайте на первой отрисовке.
- Нагрузка push маленькая. Обычный приём — «что-то изменилось», а подробность страница забирает, когда откроется.

**Examples:**

```js
self.addEventListener("push", (event) => {
  event.waitUntil(self.registration.showNotification("Notes", { body: "New note" }));
});
```

**Sources:**

- [MDN — Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
</details>

<details>
<summary>Can you explain the concept of background sync in PWAs?</summary>

### Can you explain the concept of background sync in PWAs?

**Definition:**

Background Sync позволяет service worker повторить запись, которая не прошла, потому что устройство было офлайн. Страница ставит работу в очередь, а браузер вызывает событие `sync`, когда считает, что сеть вернулась.

**How it works:**

- Страница хранит нагрузку в IndexedDB и вызывает `registration.sync.register("send-note")`.
- Воркер слушает `sync`. Если `event.tag` совпал, он читает очередь, отправляет её и при успехе удаляет локальную копию.
- `event.waitUntil` держит воркер, пока промис не завершится. Отклонение просит браузер повторить позже, с паузой.
- Это Background Synchronization API, реализованный в Chromium. На Safari и Firefox гарантии нет, поэтому открытая страница всё равно должна уметь повторить попытку.
- Синхронизация не запускает произвольные таймеры. Periodic Background Sync — отдельный, более ограниченный API.
- Сервер должен считать повтор идемпотентным. Одна и та же заметка может прийти дважды, если ответ потерялся.

**Examples:**

```js
self.addEventListener("sync", (event) => {
  if (event.tag === "send-note") event.waitUntil(flushQueue());
});
```

**Sources:**

- [MDN — Background Synchronization API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API)
</details>

<details>
<summary>What is a service worker lifecycle?</summary>

### What is a service worker lifecycle?

**Definition:**

</details>

<details>
<summary>How do you handle compatibility issues across different browsers for PWAs?</summary>

### How do you handle compatibility issues across different browsers for PWAs?

**Definition:**

</details>

<details>
<summary>How would you test a PWA?</summary>

### How would you test a PWA?

**Definition:**

</details>

<details>
<summary>What is the role of HTTPS in PWAs?</summary>

### What is the role of HTTPS in PWAs?

**Definition:**

</details>

<details>
<summary>What are the limitations of PWAs?</summary>

### What are the limitations of PWAs?

**Definition:**

</details>

### Service Workers

<details>
<summary>What is the role of the 'install' event in a service worker?</summary>

### What is the role of the 'install' event in a service worker?

**Definition:**

</details>

<details>
<summary>How do you cache assets using service workers?</summary>

### How do you cache assets using service workers?

**Definition:**

</details>

<details>
<summary>Can you explain how service worker updates are managed?</summary>

### Can you explain how service worker updates are managed?

**Definition:**

</details>

<details>
<summary>What different caching strategies can be implemented with service workers?</summary>

### What different caching strategies can be implemented with service workers?

**Definition:**

</details>

<details>
<summary>Describe how you would use a service worker to intercept network requests.</summary>

### Describe how you would use a service worker to intercept network requests.

**Definition:**

</details>

<details>
<summary>What is a FetchEvent in the context of service workers?</summary>

### What is a FetchEvent in the context of service workers?

**Definition:**

</details>

<details>
<summary>How do you handle errors in a service worker script?</summary>

### How do you handle errors in a service worker script?

**Definition:**

</details>

<details>
<summary>Discuss how service workers can be debugged.</summary>

### Discuss how service workers can be debugged.

**Definition:**

</details>

<details>
<summary>What is the 'activate' event in a service worker and what is it used for?</summary>

### What is the 'activate' event in a service worker and what is it used for?

**Definition:**

</details>

<details>
<summary>Explain the concept of "cache busting" and why it's important for PWAs.</summary>

### Explain the concept of "cache busting" and why it's important for PWAs.

**Definition:**

</details>

### Web App Manifest

<details>
<summary>What key properties does the Web App Manifest contain?</summary>

### What key properties does the Web App Manifest contain?

**Definition:**

</details>

<details>
<summary>How do you define the start URL in a manifest file?</summary>

### How do you define the start URL in a manifest file?

**Definition:**

</details>

<details>
<summary>What are the guidelines for designing app icons for a PWA?</summary>

### What are the guidelines for designing app icons for a PWA?

**Definition:**

</details>

<details>
<summary>How does the web app manifest affect the appearance of the PWA on a device?</summary>

### How does the web app manifest affect the appearance of the PWA on a device?

**Definition:**

</details>

<details>
<summary>Can you dynamically generate a web app manifest or must it be static?</summary>

### Can you dynamically generate a web app manifest or must it be static?

**Definition:**

</details>

### User Engagement & Experience

<details>
<summary>How do push notifications enhance user engagement in a PWA?</summary>

### How do push notifications enhance user engagement in a PWA?

**Definition:**

</details>

<details>
<summary>What strategies can you use to prompt the user to install your PWA?</summary>

### What strategies can you use to prompt the user to install your PWA?

**Definition:**

</details>

<details>
<summary>How would you customize the prompt that asks users to add your PWA to their home screen?</summary>

### How would you customize the prompt that asks users to add your PWA to their home screen?

**Definition:**

</details>

<details>
<summary>Can you tailor the UX of a PWA depending on whether it's run in a browser or as an installed app?</summary>

### Can you tailor the UX of a PWA depending on whether it's run in a browser or as an installed app?

**Definition:**

</details>

<details>
<summary>What is the significance of having a responsive design in PWAs?</summary>

### What is the significance of having a responsive design in PWAs?

**Definition:**

</details>

### Performance & Optimization

<details>
<summary>What tools can be used for performance auditing of a PWA?</summary>

### What tools can be used for performance auditing of a PWA?

**Definition:**

</details>

<details>
<summary>How do you optimize the loading time of your PWA?</summary>

### How do you optimize the loading time of your PWA?

**Definition:**

</details>

<details>
<summary>Discuss the impact of JavaScript bundling and minification on PWAs.</summary>

### Discuss the impact of JavaScript bundling and minification on PWAs.

**Definition:**

</details>

<details>
<summary>What role does image optimization play in PWAs?</summary>

### What role does image optimization play in PWAs?

**Definition:**

</details>

<details>
<summary>How do you track and improve the First Contentful Paint (FCP) in PWAs?</summary>

### How do you track and improve the First Contentful Paint (FCP) in PWAs?

**Definition:**

</details>

<details>
<summary>What is Time to Interactive (TTI), and how do you optimize it for PWAs?</summary>

### What is Time to Interactive (TTI), and how do you optimize it for PWAs?

**Definition:**

</details>

<details>
<summary>How do you implement lazy loading in a PWA?</summary>

### How do you implement lazy loading in a PWA?

**Definition:**

</details>

<details>
<summary>Why is it important to prioritize above-the-fold content for PWAs?</summary>

### Why is it important to prioritize above-the-fold content for PWAs?

**Definition:**

</details>

<details>
<summary>Discuss how to prevent janky animations and achieve smooth performance in a PWA.</summary>

### Discuss how to prevent janky animations and achieve smooth performance in a PWA.

**Definition:**

</details>

<details>
<summary>What strategies can be employed to minimize main-thread work in a PWA?</summary>

### What strategies can be employed to minimize main-thread work in a PWA?

**Definition:**

</details>

### PWA Architecture and Application Structure

<details>
<summary>What architectural patterns are commonly used in PWAs?</summary>

### What architectural patterns are commonly used in PWAs?

**Definition:**

</details>

<details>
<summary>How should you structure your files and directories for a PWA?</summary>

### How should you structure your files and directories for a PWA?

**Definition:**

</details>

<details>
<summary>Can you explain the Model-View-ViewModel (MVVM) architecture in the context of PWAs?</summary>

### Can you explain the Model-View-ViewModel (MVVM) architecture in the context of PWAs?

**Definition:**

</details>

<details>
<summary>How do you manage state in a PWA?</summary>

### How do you manage state in a PWA?

**Definition:**

</details>

<details>
<summary>Discuss the role of front-end frameworks and libraries in PWA development.</summary>

### Discuss the role of front-end frameworks and libraries in PWA development.

**Definition:**

</details>

<details>
<summary>How does a PWA handle dynamic content and user personalization?</summary>

### How does a PWA handle dynamic content and user personalization?

**Definition:**

</details>

### Offline Capabilities

<details>
<summary>How do you design for offline-first in a PWA?</summary>

### How do you design for offline-first in a PWA?

**Definition:**

</details>

<details>
<summary>What is the role of IndexedDB in PWAs?</summary>

### What is the role of IndexedDB in PWAs?

**Definition:**

</details>

<details>
<summary>How can you synchronize local changes with a server once online?</summary>

### How can you synchronize local changes with a server once online?

**Definition:**

</details>

<details>
<summary>Can you explain how to manage user-generated content in offline mode?</summary>

### Can you explain how to manage user-generated content in offline mode?

**Definition:**

</details>

<details>
<summary>What are the considerations for storing and retrieving data locally in a PWA?</summary>

### What are the considerations for storing and retrieving data locally in a PWA?

**Definition:**

</details>

### Push Notifications

<details>
<summary>How do you register a service worker for push notifications?</summary>

### How do you register a service worker for push notifications?

**Definition:**

</details>

<details>
<summary>What is the Web Push Protocol and how is it used in PWAs?</summary>

### What is the Web Push Protocol and how is it used in PWAs?

**Definition:**

</details>

<details>
<summary>Can you explain the notification click event handling in a PWA?</summary>

### Can you explain the notification click event handling in a PWA?

**Definition:**

</details>

<details>
<summary>What are the best practices for sending push notifications to users?</summary>

### What are the best practices for sending push notifications to users?

**Definition:**

</details>

<details>
<summary>How do you customize the notification appearance and behavior on different platforms?</summary>

### How do you customize the notification appearance and behavior on different platforms?

**Definition:**

</details>

### Scalability and Maintainability

<details>
<summary>How do you ensure that a PWA remains scalable as features grow?</summary>

### How do you ensure that a PWA remains scalable as features grow?

**Definition:**

</details>

<details>
<summary>Discuss the use of module bundlers in PWAs for better maintainability.</summary>

### Discuss the use of module bundlers in PWAs for better maintainability.

**Definition:**

</details>

<details>
<summary>What considerations must be taken into account for version control in PWAs?</summary>

### What considerations must be taken into account for version control in PWAs?

**Definition:**

</details>

<details>
<summary>How do you handle data migrations in PWAs?</summary>

### How do you handle data migrations in PWAs?

**Definition:**

</details>

<details>
<summary>Can you implement feature toggles in PWAs?</summary>

### Can you implement feature toggles in PWAs?

**Definition:**

</details>

### PWA and E-commerce

<details>
<summary>Why are PWAs well-suited for e-commerce platforms?</summary>

### Why are PWAs well-suited for e-commerce platforms?

**Definition:**

</details>

<details>
<summary>How can a PWA improve conversion rates for an e-commerce site?</summary>

### How can a PWA improve conversion rates for an e-commerce site?

**Definition:**

</details>

<details>
<summary>What are the unique challenges of developing PWAs for e-commerce?</summary>

### What are the unique challenges of developing PWAs for e-commerce?

**Definition:**

</details>

<details>
<summary>How would you handle checkout and payment processing in an e-commerce PWA?</summary>

### How would you handle checkout and payment processing in an e-commerce PWA?

**Definition:**

</details>

<details>
<summary>Can you discuss strategies for integrating analytics in an e-commerce PWA?</summary>

### Can you discuss strategies for integrating analytics in an e-commerce PWA?

**Definition:**

</details>

### APIs and Integration

<details>
<summary>What are the common APIs used in developing a PWA?</summary>

### What are the common APIs used in developing a PWA?

**Definition:**

</details>

<details>
<summary>How do PWAs integrate with native device features?</summary>

### How do PWAs integrate with native device features?

**Definition:**

</details>

<details>
<summary>Discuss how a PWA can access a user's camera or GPS.</summary>

### Discuss how a PWA can access a user's camera or GPS.

**Definition:**

</details>

<details>
<summary>How do you handle cross-origin requests in a PWA?</summary>

### How do you handle cross-origin requests in a PWA?

**Definition:**

</details>

<details>
<summary>How can third-party services be integrated into a PWA?</summary>

### How can third-party services be integrated into a PWA?

**Definition:**

</details>

### Advanced PWA Topics

<details>
<summary>What are Progressive Enhancement and Graceful Degradation in the context of PWAs?</summary>

### What are Progressive Enhancement and Graceful Degradation in the context of PWAs?

**Definition:**

</details>

<details>
<summary>How do you implement a periodic background sync in PWA?</summary>

### How do you implement a periodic background sync in PWA?

**Definition:**

</details>

<details>
<summary>Discuss the concept of Credential Management API in PWAs.</summary>

### Discuss the concept of Credential Management API in PWAs.

**Definition:**

</details>

<details>
<summary>What is the Payment Request API and how does it simplify transactions in a PWA?</summary>

### What is the Payment Request API and how does it simplify transactions in a PWA?

**Definition:**

</details>

<details>
<summary>How can a PWA be part of the Internet of Things (IoT)?</summary>

### How can a PWA be part of the Internet of Things (IoT)?

**Definition:**

</details>

### Platform-Specific Considerations

<details>
<summary>How do you optimize a PWA for iOS devices?</summary>

### How do you optimize a PWA for iOS devices?

**Definition:**

</details>

<details>
<summary>What are the current limitations for PWAs on the Apple App Store?</summary>

### What are the current limitations for PWAs on the Apple App Store?

**Definition:**

</details>

<details>
<summary>Discuss the differences between optimizing PWAs for Android vs. iOS.</summary>

### Discuss the differences between optimizing PWAs for Android vs. iOS.

**Definition:**

</details>

<details>
<summary>How does the choice of web browser affect the behavior of a PWA?</summary>

### How does the choice of web browser affect the behavior of a PWA?

**Definition:**

</details>

### Testing & Debugging PWAs

<details>
<summary>What strategies do you use for testing the service workers?</summary>

### What strategies do you use for testing the service workers?

**Definition:**

</details>

<details>
<summary>How do you simulate offline testing conditions for your PWA?</summary>

### How do you simulate offline testing conditions for your PWA?

**Definition:**

</details>

<details>
<summary>What are the main aspects to test before deploying a PWA?</summary>

### What are the main aspects to test before deploying a PWA?

**Definition:**

</details>

<details>
<summary>How can you debug a PWA on a mobile device?</summary>

### How can you debug a PWA on a mobile device?

**Definition:**

</details>

<details>
<summary>What are common issues encountered when testing push notifications and how do you address them?</summary>

### What are common issues encountered when testing push notifications and how do you address them?

**Definition:**

</details>

### PWA Case Studies and Real-life Applications

<details>
<summary>Can you provide examples of successful PWAs?</summary>

### Can you provide examples of successful PWAs?

**Definition:**

</details>

<details>
<summary>Discuss how PWAs have impacted mobile traffic for major websites.</summary>

### Discuss how PWAs have impacted mobile traffic for major websites.

**Definition:**

</details>

<details>
<summary>How has the user engagement changed pre and post PWA implementation for a notable company?</summary>

### How has the user engagement changed pre and post PWA implementation for a notable company?

**Definition:**

</details>

<details>
<summary>What challenges did developers face when transitioning a traditional web app to a PWA?</summary>

### What challenges did developers face when transitioning a traditional web app to a PWA?

**Definition:**

</details>

### The Future of PWAs

<details>
<summary>What future advancements do you anticipate in the field of PWAs?</summary>

### What future advancements do you anticipate in the field of PWAs?

**Definition:**

</details>
