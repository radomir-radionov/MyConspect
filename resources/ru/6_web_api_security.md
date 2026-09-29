# Web APIs — Security

Безопасность браузера, CWV и сторонние интеграции.

[ ← Вернуться в хаб](./6_web_api.md)

### Related docs

- [Веб-API — Core](./6_web_api_core.md) · [Веб-API — HTTP](./6_web_api_http.md) · [Веб-API — стили API](./6_web_api_rest.md) · [Веб-API — аутентификация и хранение](./6_web_api_auth.md) · [Веб-API — Приложения](./6_web_api_apps.md) · [Веб-API — Безопасность](./6_web_api_security.md) · [Веб-API — Интервью](./6_web_api_interview.md)

### Sections

- [13. Security](#13-security)
- [14. Advanced topics](#14-advanced-topics)
- [15. Integrations](#15-integrations)

---

## 13. Security

<details>
  <summary>CORS</summary>

### CORS

**Definition:** CORS (Cross-Origin Resource Sharing) — это **браузерный** механизм, который позволяет серверу включить его, чтобы JavaScript страницы мог **читать** HTTP-ответ из разных источников. Политика одного и того же происхождения — это запрет по умолчанию; CORS — это явный список разрешений.

**How it works:**

- **Происхождение** = схема + хост + порт. `https://doka.guide` и `http://doka.guide` имеют разное происхождение (протокол). Различия в портах также учитываются.
- того же происхождения `fetch` не нуждается в заголовках CORS. Перекрестное происхождение (`app.com` → `api.example.com`) — это **запрос между источниками**.
- Браузер всегда отправляет `Origin`. Вы не устанавливаете заголовки запросов CORS в JS — `Origin`, `Access-Control-Request-Method`, и `Access-Control-Request-Headers` добавляются браузером.
- **Простые запросы** (метод из списка безопасных + заголовки, типичная форма). `Content-Type`) немедленно выйти. Если в ответе отсутствует соответствие `Access-Control-Allow-Origin`**запрос все еще попадает на сервер**; JS не может прочитать тело. Ошибки CORS не имеют полезного сообщения в JS — используйте DevTools.
- **Предполетная подготовка:** непростой метод (`PUT`, `DELETE`, …) или заголовки, не внесенные в безопасный список (`Authorization`, `Content-Type: application/json`, пользовательские заголовки) → браузер отправляет `OPTIONS` первый. Кэшировано через `Access-Control-Max-Age` (браузер также имеет внутреннее ограничение; по умолчанию MDN, если оно опущено, составляет 5 секунд).
- `Access-Control-Allow-Origin` может быть **одного** происхождения или `*` (без учетных данных). Несколько сайтов: отразить запрос `Origin` если оно в белом списке, и отправьте `Vary: Origin`.
- Предполетная проверка **не** должна включать учетные данные. Необходимость подтвержденных фактических запросов `Access-Control-Allow-Credentials: true` и **конкретное** происхождение — никогда `*` (тоже нет `*` в Allow-Methods/Allow-Headers/Expose-Headers с учетными данными).

| Заголовок ответа                   | Роль                                                                                                     |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `Access-Control-Allow-Origin`      | Какой источник может прочитать ответ (`*` или одно происхождение)                                        |
| `Access-Control-Allow-Methods`     | Методы, разрешенные для **фактического** запроса (предварительная проверка)                              |
| `Access-Control-Allow-Headers`     | Заголовки запросов, которые клиент может отправить (предварительная проверка) — **не** заголовки ответов |
| `Access-Control-Allow-Credentials` | `true` можно ли использовать файлы cookie/HTTP-аутентификацию                                            |
| `Access-Control-Max-Age`           | Секунды на кэширование результатов предполетной проверки                                                 |
| `Access-Control-Expose-Headers`    | Заголовки ответов JS может читать (`Response.headers`)                                                   |

| Заголовок запроса (набор браузера) | Роль                                                             |
| ---------------------------------- | ---------------------------------------------------------------- |
| `Origin`                           | Происхождение страницы                                           |
| `Access-Control-Request-Method`    | Метод планового фактического запроса                             |
| `Access-Control-Request-Headers`   | Заголовки фактического запроса, не внесенные в безопасный список |

**When to use:**

СПА включено `https://app.example.com` звоню `https://api.example.com`; общедоступный API без аутентификации с `*`; API файлов cookie/сессий со списком разрешенных источников и учетными данными.

#### Common pitfalls

Рассматривать CORS как брандмауэр (простой запрос уже был выполнен). `Allow-Headers` vs `Expose-Headers`. `*` + печенье. Предполагая `*` «вызывает CSRF» — форма CSRF не требует CORS; CORS не останавливает CSRF на основе файлов cookie. См. [CSRF](./7_special_security.md#csrf-cross-site-request-forgery).

**Pluses and minuses:**

| +                                                                                          | −                                                                                         |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Позволяет SPA вызывать отдельный источник API с согласия сервера                           | Легко ошибиться(`*`, отсутствует предварительная проверка, неправильные имена заголовков) |
| Предварительная проверка может отклонять небезопасные методы/заголовки до реального вызова | Только для браузера — Curl/Postman/между серверами игнорировать CORS                      |
| Стандартный `Access-Control-*` заголовки                                                   | **Не** заменяет защиту CSRF                                                               |

**Examples:**

```http
OPTIONS / HTTP/1.1
Host: api.example.com
Origin: https://doka.guide
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: content-type, authorization
```

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://doka.guide
Access-Control-Allow-Methods: GET, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
Vary: Origin
```

```js
await fetch("https://api.example.com/data", {
  credentials: "include", // needs Allow-Credentials: true and a concrete Allow-Origin
});
```

**Thoughts:** Сервер по-прежнему получает множество запросов из разных источников; CORS только решает, может ли **page JS** прочитать ответ.

**Sources:**

[javascript.info/fetch-crossorigin](https://javascript.info/fetch-crossorigin) · [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) · [Doka — CORS](https://doka.guide/tools/cors/)

---

</details>

<details>
  <summary>Content Security Policy (CSP)</summary>

### Content Security Policy (CSP)

**Definition:** CSP — это HTTP-заголовок, в котором перечислены доверенные источники сценариев, стилей, изображений и другого контента — резервная защита в случае сбоя кодирования XSS.

**How it works:**

Браузер блокирует загрузки и встроенные скрипты, которых нет в политике. Строгий CSP использует **nonce или хэши** для разрешенных сценариев и отключает `eval` / встроенные обработчики. `default-src` заполняет недостающие директивы выборки.

| Директива         | Элементы управления                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `script-src`      | Исходники JavaScript                                                                       |
| `style-src`       | Исходники CSS                                                                              |
| `img-src`         | Изображения (также используются для блокировки пикселей отслеживания)                      |
| `connect-src`     | `fetch` / XHR / Вебсокет                                                                   |
| `default-src`     | Резервный вариант для неуказанных типов выборки                                            |
| `frame-ancestors` | Кто может встраивать эту страницу (кликджекинг) — **только HTTP-заголовок**, а не `<meta>` |

**Examples:**

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; frame-ancestors 'self'
```

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'" />
```

**Thoughts:** `'unsafe-inline'` в значительной степени побеждает защиту XSS. `<meta>` CSP не может установить `frame-ancestors` или некоторые другие директивы документа. См. [HTML — CSP](./1_html.md) · [Специальный — CSP](./7_special_security.md#content-security-policy-csp) · [Специальный — XSS](./7_special_security.md#xss-cross-site-scripting).

**Sources:**

[MDN — CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)

---

</details>

<details>
  <summary>Cross-Site Scripting (XSS)</summary>

### Cross-Site Scripting (XSS)

**Definition:** XSS внедряет скрипт, который запускается в **вашем источнике** в браузере другого пользователя — кража сеанса, действия от имени пользователя или кейлоггинг.

**How it works:**

Ненадежные данные анализируются как HTML/JS. **Отражено** — запрос/текст, отраженный в этом ответе. **Сохранено** — сохраняется и воспроизводится для последующих просмотров (включая кейлоггеры XSS). **DOM** — клиентский JS записывает в DOM ненадежные строки.

| Тип           | Вектор                                               |
| ------------- | ---------------------------------------------------- | --- | ---------- | ------------------------------- |
| Сохранено     | Вредоносные данные сохранены в БД                    |     | Отраженный | URL/запрос отображается в ответ |
| на основе DOM | Клиент JS записывает ненадежные входные данные в DOM |

**Examples:**

```js
element.innerHTML = userInput; // parses tags
element.textContent = userInput; // text only
```

Кодируйте **контекст вывода** (HTML или URL). `encodeURIComponent` предназначен для URL-адресов, а не HTML. Файлы cookie CSP + HttpOnly — это дополнительные уровни. Полный каталог: [Special — XSS](./7_special_security.md#xss-cross-site-scripting).

**Sources:**

[OWASP — XSS](https://owasp.org/www-community/attacks/xss/)

---

</details>

<details>
  <summary>CSRF (Cross-Site Request Forgery)</summary>

### CSRF (Cross-Site Request Forgery)

**Definition:** CSRF обманом заставляет браузер вошедшего в систему пользователя отправить аутентифицированный запрос на сайт, где у него уже есть сеанс — сервер доверяет файлу cookie и выполняет действие.

**How it works:**

1. Пользователь авторизован `bank.com` (набор файлов cookie сеанса).
2. Посещения пользователей `evil.com` который содержит `<form action="https://bank.com/transfer" method="POST">` or `<img src="https://bank.com/transfer?to=attacker&amount=1000">`.
3. Браузер автоматически прикрепляется. `bank.com` файлы cookie → сервер считает запрос законным.

| Оборона                                                    | Как                                                                                                        |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **CSRF-токен**                                             | Сервер встраивает непредсказуемый токен в форму/мета;проверить POST                                        |
| **Файлы cookie SameSite**                                  | `SameSite=Lax` or `Strict` блокирует межсайтовые файлы cookie в POST                                       |
| **Пользовательские заголовки**                             | Требовать `X-Requested-With` or `Content-Type: application/json` — простые формы не могут быть установлены |
| **Проверка происхождения/реферера**                        | Отклонить, если заголовок отсутствует или неправильный                                                     |
| **Повторная аутентификация для конфиденциальных операций** | Пароль/2FA для переводов                                                                                   |

**When to use:**

- API-интерфейсы сеансов на основе файлов cookie — токен CSRF или `SameSite=Strict` для мутаций.
- JWT в `Authorization` только заголовок — **не** уязвим для классического CSRF (браузер не отправляет автоматически пользовательские заголовки).
- `GET` никогда не должен менять состояние — CSRF часто использует GET, изменяющий состояние.

**Pluses and minuses:**

| + (SameSite + токен)                              | −                                                                                  |
| ------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Блокирует большинство CSRF, управляемых браузером | SameSite=Не требуется для некоторых потоков OAuth (требуется Secure)               |
| Шаблон токена хорошо понятен                      | SPA + проверка подлинности cookie требует тщательной настройки CORS/учетных данных |

**Examples:**

```html
<meta name="csrf-token" content="random-token-from-server" />
```

```js
fetch("/api/transfer", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token": document.querySelector("meta[name=csrf-token]").content,
  },
  body: JSON.stringify({ to: "alice", amount: 50 }),
});
```

**Thoughts:** CORS **не** защищает от CSRF. CSRF — это проблема автоматической отправки файлов cookie. `SameSite=Lax` является строгим стандартом для файлов cookie сеанса. Аутентификация («сеанс действителен») — это не то же самое, что авторизация **этой** мутации — используйте токен CSRF. печенье `HttpOnly` не останавливает CSRF. См. [Специальный — CSRF](./7_special_security.md#csrf-cross-site-request-forgery).

**Sources:**

[OWASP — CSRF](https://owasp.org/www-community/attacks/csrf) · [MDN — файлы cookie SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value)

---

</details>

<details>
  <summary>Clickjacking</summary>

### Clickjacking

**Definition:** Злоумышленник накладывает прозрачный iframe вашего сайта, чтобы пользователь нажимал **ваш** пользовательский интерфейс, глядя на приманку.

**How it works:**

Аутентифицированные файлы cookie применяются внутри iframe. XSS не требуется.

| Оборона                                  | Заметки                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| CSP `frame-ancestors 'none'` or `'self'` | Предпочтительно; перечислите дополнительные хосты, если вам необходимо встроить |
| `X-Frame-Options: DENY` or `SAMEORIGIN`  | Все еще широко рассылается; `ALLOW-FROM` устарел (заголовок игнорируется)       |

```http
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: frame-ancestors 'self'
```

**Thoughts:** Только заголовок для XFO (не `<meta>`). SameSite не заменяет политику кадрирования. См. [Специальное — кликджекинг](./7_special_security.md#clickjacking).

**Sources:**

[MDN — X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)

---

</details>

<details>
  <summary>JSONP</summary>

### JSONP

**Definition:**

JSONP обходит SOP, загружая данные из разных источников через `<script>` тег, вызывающий функцию обратного вызова — устаревший метод, в значительной степени замененный CORS.

| JSONP                            | КОРС                                   |
| -------------------------------- | -------------------------------------- |
| ПОЛУЧИТЬ только                  | Все методы (с предполетной обработкой) |
| Нет стандартной обработки ошибок | Стандартная семантика HTTP             |
| На основе доверия                | Разрешение на основе заголовка         |

**Examples:**

```html
<script src="https://api.example.com/data?callback=handleData"></script>
<script>
  function handleData(json) {
    console.log(json);
  }
</script>
```

**Sources:**

[MDN — CORS (предпочитаю JSONP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

</details>

<a name="14-advanced-topics"></a>

## 14. Advanced topics

<details>
  <summary>Service Workers</summary>

### Service Workers

**Definition:**

Service Worker — это фоновый скрипт, который перехватывает сетевые запросы и обеспечивает автономное кэширование, push-уведомления и фоновую синхронизацию.

| Возможность       | Вариант использования                       |
| ----------------- | ------------------------------------------- |
| Получить перехват | Приложения, ориентированные на офлайн-режим |
| API кэша          | Предварительное кэширование активов         |
| Нажмите API       | Уведомления                                 |

**Examples:**

```js
navigator.serviceWorker.register("/sw.js");

// sw.js
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((r) => r || fetch(event.request)),
  );
});
```

**Sources:**

[MDN — API Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

</details>

<details>
  <summary>Web Workers</summary>

### Web Workers

**Definition:**

Веб-воркеры запускают JavaScript в фоновом потоке, поэтому работа с нагрузкой на ЦП не блокирует основной поток пользовательского интерфейса.

| Тип                | Область применения               |
| ------------------ | -------------------------------- |
| Посвященный        | Скрипт с одним владельцем        |
| Общий              | Несколько скриптов/окон          |
| Сервисный работник | Прокси между приложением и сетью |

**Examples:**

```js
const worker = new Worker("hash-worker.js");
worker.postMessage(largeBuffer);
worker.onmessage = (e) => console.log("hash:", e.data);
```

**Sources:**

[MDN — API веб-работников](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

---

</details>

<details>
  <summary>Worklets</summary>

### Worklets

**Definition:**

Рабочие модули — это облегченные контексты параллельного выполнения для конкретных задач, таких как обработка звука (`AudioWorklet`) или живопись (`PaintWorklet`).

| Работа                  | Цель                             |
| ----------------------- | -------------------------------- |
| АудиоWorklet            | DSP аудио в реальном времени     |
| PaintWorklet            | Программное рисование CSS        |
| Анимационный рабочийлет | Анимация, связанная с прокруткой |

**Examples:**

```js
await audioContext.audioWorklet.addModule("processor.js");
const node = new AudioWorkletNode(audioContext, "gain-processor");
```

**Sources:**

[MDN — Worklet](https://developer.mozilla.org/en-US/docs/Web/API/Worklet)

---

</details>

<details>
  <summary>History API</summary>

### History API

**Definition:**

API истории позволяет SPA манипулировать URL-адресом браузера и стеком истории без полной перезагрузки страницы.

| Метод              | Эффект                                 |
| ------------------ | -------------------------------------- |
| `pushState`        | Добавить запись в историю              |
| `replaceState`     | Заменить текущую запись                |
| `popstate` событие | Пользователь перемещается назад/вперед |

**Examples:**

```js
history.pushState({ page: "settings" }, "", "/settings");
window.addEventListener("popstate", (e) => {
  renderPage(e.state?.page ?? "home");
});
```

**Sources:**

[MDN — API истории](https://developer.mozilla.org/en-US/docs/Web/API/History_API)

---

</details>

<details>
  <summary>TCP three-way handshake</summary>

### TCP three-way handshake

**Definition:**

TCP открывает соединение с помощью SYN → SYN-ACK → ACK, поэтому обе стороны согласовывают начальные порядковые номера перед потоком байтов.

| Шаг | Пакет         | Значение                                 |
| --- | ------------- | ---------------------------------------- |
| 1   | СИН           | ISN клиента `x`                          |
| 2   | СИН-АКТ       | ISN сервера `y`, ок `x + 1`              |
| 3   | ПОДТВЕРЖДЕНИЕ | Подтверждение клиента `y + 1`; подключен |

Полное сравнение UDP, TFO и `initcwnd`, `preconnect`, STUN/TURN → [TCP против UDP](./6_web_api_interview.md#tcp-vs-udp).

**Examples:**

```
Client → SYN (seq=100)
Server → SYN-ACK (seq=300, ack=101)
Client → ACK (ack=301)
→ Data can flow both ways
```

**Sources:**

[MDN — TCP-рукопожатие](https://developer.mozilla.org/en-US/docs/Glossary/TCP_handshake)

---

</details>

<details>
  <summary>Throttling & debouncing</summary>

### Throttling & debouncing

**Definition:** Шумные обработчики ограничения скорости. Полные примечания и примеры: [Debounce](./3_js_browser_extra.md#debounce) · [Throttle](./3_js_browser_extra.md#throttle).

**Sources:** [Глоссарий MDN — Debounce](https://developer.mozilla.org/en-US/docs/Glossary/Debounce) · [Глоссарий MDN — Throttle](https://developer.mozilla.org/en-US/docs/Glossary/Throttle)

</details>

<details>
  <summary>Axios interceptors</summary>

### Axios interceptors

**Definition:**

Перехватчики Axios — это перехватчики промежуточного программного обеспечения, которые преобразуют или проверяют запросы и ответы до того, как они достигнут кода вашего приложения.

| Перехватчик | Типичное использование                               |
| ----------- | ---------------------------------------------------- |
| Запрос      | Прикрепите токен аутентификации, войдите             |
| Ответ       | Развертывание данных, обработка ошибки 401 глобально |

**Examples:**

```js
import axios from "axios";

axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) logout();
    return Promise.reject(err);
  },
);
```

**Sources:**

[Аксиос — Перехватчики](https://axios-http.com/docs/interceptors)

---

</details>

<details>
  <summary>Progressive rendering</summary>

### Progressive rendering

**Definition:**

Прогрессивная рендеринг отображает содержательный контент до завершения загрузки всех ресурсов, что повышает воспринимаемую производительность.

| Техника                            | Эффект                               |
| ---------------------------------- | ------------------------------------ |
| Ленивые картинки(`loading="lazy"`) | Отложить изображения за кадром       |
| Критический CSS                    | Встроенные стили над сгибом          |
| Разделение кода                    | Загрузка фрагментов JS по требованию |

**Examples:**

```html
<img src="hero.jpg" loading="lazy" alt="Hero" />
<link rel="preload" href="font.woff2" as="font" crossorigin />
```

**Sources:**

[web.dev — быстрая загрузка](https://web.dev/explore/fast)

---

</details>

<details>
  <summary>SPA, SSR, PWA & SSG</summary>

### SPA, SSR, PWA & SSG

**Definition:** Полная таксономия (статическая/динамическая MPA, SPA, CSR, SSR, SSG, PWA, сравнение) находится в [Типы веб-приложений](./6_web_api_apps.md#12-types-of-web-apps).

**How it works:** SPA = одна страница, маршруты JS. CSR = первая отрисовка в браузере. SSR = первый HTML с сервера. SSG = HTML при сборке. **PWA** = прогрессивное улучшение (установка + API). Установка Chromium = HTTPS + манифест; Service Worker предназначен для автономного режима/принудительной отправки и не требуется для приглашения на установку. Полные примечания: [PWA](./6_web_api_apps.md#pwa-progressive-web-app).

**Examples:**

```json
{
  "name": "My App",
  "start_url": "/",
  "display": "standalone",
  "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
}
```

**Sources:**

[Doka — Типы веб-приложений](https://doka.guide/tools/web-app-types/) · [MDN — Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

---

</details>

<details>
  <summary>Core Web Vitals</summary>

### Core Web Vitals

**Definition:**

Показатели качества страниц Google (2020+). **Основной** набор — **LCP** (основное содержимое нарисовано), **INP** (нажатие/нажатие/клавиша → следующее рисование), **CLS** (неожиданный переход макета). URL **проходит**, если **все три** «хороши» на уровне **p75**, **мобильные и настольные устройства оцениваются отдельно**. **FCP** и **TTFB** являются диагностическими, а не ключевыми и не ранжирующими.

| Метрическая | Вопрос | 🟢 Хорошо | 🟡 Требует улучшения | 🔴 Бедный || ------ | -------- | ------- | -------------------- | ------- |
| **ЛКП** | Когда я увидел основной контент? | ≤ 2,5 с | 2,5–4,0 с | > 4,0 с |
| **ИЯФ** | После того, как я нажал, скоро обновился пользовательский интерфейс? | ≤ 200 мс | 200–500 мс | > 500 мс |
| **CLS** | Что-то подскочило, и я мог нажать не на тот элемент управления? | ≤ 0,1 | 0,1–0,25 | > 0,25 |
| **ФКП** | Когда _что-нибудь_ появилось? | ≤ 1,8 с | 1,8–3,0 с | > 3,0 с || **ТТФБ** | Как скоро сервер начал отвечать? | ≤ 0,8 с | 0,8–1,8 с | > 1,8 с |

Пороговые значения одинаковы на телефоне и настольном компьютере; **образцы нет**. При ранжировании используются данные **поля CrUX** (28-дневный интервал), а не лабораторный анализ Lighthouse. **CLS** является безразмерным; другие — время. **FID** был основным до **12 марта 2024 г.** — его заменил **INP** (все щелчки/нажатия/клавиши, полный путь для рисования).Маяк без пользовательских отчетов **TBT**, а не INP.

|               | **Лаборатория**                           | **Поле** (РУМ)                                         |
| ------------- | ----------------------------------------- | ------------------------------------------------------ |
| Инструменты   | Маяк, лаборатория PSI, Производительность | CruX, поле PSI, Search Console, `web-vitals`           |
| Использование | Воспроизвести _что исправить_             | p75 реальных посещений — _что используется в рейтинге_ |

Лаборатория ≠ поле: ИЯФ нуждается в реальном вкладе; CLS в поле включает скролл/баннеры; Элемент LCP и кэш различаются. Рабочий процесс: сначала поле → лабораторный срез (а не «сделать LCP лучше») → перепроверить все три. Медленный герой → [LCP](#lcp-largest-contentful-paint); неработающие кнопки → [INP](#inp-interaction-to-next-paint);прыжок → [1_html.md — CLS](./1*html* Performance.md#cls-cumulative-layout-shift); пустой экран → [FCP](#first-contentful-paint-fcp) / [TTFB](#ttfb-time-to-first-byte). Запустите **мобильные** URL-адреса с высоким трафиком.

**When to use:**

SEO-рейтинг, сортировка инцидентов, бюджеты Lighthouse CI, заявки с числовой целью p75.

**Пример** — поле (`web-vitals`). Промывка включена `visibilitychange` → `hidden` с помощью `sendBeacon` (`unload` ломает **bfcache**). Отчет **p75**, а не средний.

```js
import { onCLS, onINP, onLCP } from "web-vitals";

function send(metric) {
  navigator.sendBeacon("/analytics", JSON.stringify(metric));
}

onCLS(send);
onINP(send);
onLCP(send);
```

```js
import { onLCP, onINP, onCLS } from "web-vitals/attribution";
onLCP(({ attribution }) => console.log(attribution)); // TTFB, load delay/duration, render delay
onINP(({ attribution }) =>
  console.log(attribution.inputDelay, attribution.processingDuration),
);
onCLS(({ attribution }) => console.log(attribution.largestShiftTarget));
```

Next.js: [4_nextjs.md — CWV](./4_nextjs_optimizations.md#core-web-vitals-on-vercel). HTML-рычаги: [1_html.md](./1*html* Performance.md#core-web-vitals--html-developer-impact). Инструменты разработчика: [11_vsc_browser.md](./11_vsc_browser.md#devtools--core-web-vitals).

#### Common pitfalls

Доверять Lighthouse, пока Search Console горит красным. Ожидаем CrUX на следующий день. Оптимизация **среднего**. Вызов **FID** Core. Рассматривать **TBT** как INP. Предварительная загрузка всего. Аналитика включена `unload`.

**Pluses and minuses:**

| +                                 | −                                                  |
| --------------------------------- | -------------------------------------------------- |
| Общий язык с SEO                  | Лабораторный зеленый ≠ Зеленый цвет Search Console |
| Атрибуция называет элемент/скрипт | 28-дневный лаг CruUX; значит, прячет хвост         |

**Thoughts:** Лаборатория = как размножаться; поле p75 = волнует ли пользователей (и рейтинг).

**See also:**

[LCP](#lcp-largest-contentful-paint) · [FCP](#first-contentful-paint-fcp) · [TTFB](#ttfb-time-to-first-byte) · [INP](#inp-interaction-to-next-paint)

---

**Sources:** [web.dev — Vitals](https://web.dev/articles/vitals) · [web.dev — INP](https://web.dev/articles/inp) · [Поиск — CWV](https://developers.google.com/search/docs/appearance/core-web-vitals) · [web-vitals](https://github.com/GoogleChrome/web-vitals)

</details>

<details>
  <summary>LCP (Largest Contentful Paint)</summary>

### LCP (Largest Contentful Paint)

**Definition:**

LCP — это время от начала навигации до момента рисования **самого большого элемента контента в области просмотра**. Браузер выбирает элемент (главное изображение, обложку статьи, большой текстовый блок, видеопостер) — вручную его назначить нельзя. Проверьте его в PageSpeed ​​Insights или на панели «Производительность».

Хорошо: **≤ 2,5 с**. Плохо: **> 4 с**. Поле «проходит» — p75 (см. [Core Web Vitals](#core-web-vitals)).До тех пор, пока это не произойдет, пользователь не сможет сказать, что попал на правильную страницу; медленный LCP повышает риск отскока.

**How it works:**

Google разбивает LCP на четыре последовательные части (без пробелов). На **хорошо оптимизированной** странице _типичная_ доля составляет ~40% TTFB, <10% задержка загрузки ресурса, ~40% продолжительность загрузки ресурса, <10% задержка рендеринга элемента — реальные сайты различаются; исправьте большой фрагмент в _вашей_ атрибуции (`web-vitals/attribution`: `timeToFirstByte`, `resourceLoadDelay`, `resourceLoadDuration`, `elementRenderDelay`).

| Подчасть                               | Что это такое                                 | Типичная доля (оптимизированная) |
| -------------------------------------- | --------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **ТТФБ**                               | Начало навигации → первый байт HTML           | ~40%                             |
| **Задержка загрузки ресурса**          | Первый байт HTML → начало запроса ресурса LCP | <10%                             |
| **Продолжительность загрузки ресурса** | Загрузка ресурса LCP                          | ~40%                             |
| **Задержка отрисовки элемента**        | Ресурс готов → рисовать на экране             | <10%                             | Только текстовый LCP (без дополнительных файлов) не имеет **нет** задержки/длительности ресурса — только TTFB + задержка рендеринга. |

Дополнительные редиректы, медленный источник, отсутствие CDN/кеша в HTML. Подробности: [TTFB](#ttfb-время до первого байта). До первого байта браузер не может проанализировать или обнаружить URL-адрес LCP.

Поместите изображение LCP в HTML как `<img src>` поэтому сканер предварительной загрузки находит его — не JS-внедренный, не `data-src`. **не** используйте `loading="lazy"` на этом. Набор `fetchpriority="high"` на ресурсах **1–2** (в противном случае изображения в области просмотра начинаются с низкого уровня до макета). Перекрестное происхождение: `<link rel="preconnect">`, или того же происхождения. CSS `background-image` обнаруживается только после CSS — предпочитайте `<img>`или предварительно загрузить:

```html
<link rel="preload" as="image" href="hero.avif" fetchpriority="high" />
<link
  rel="preload"
  as="image"
  imagesrcset="hero-800.avif 800w, hero-1600.avif 1600w"
  imagesizes="100vw"
  fetchpriority="high"
/>
```

Следующий.js: `priority` on `next/image` отключает отложенную загрузку и повышает приоритет выборки; в **Next.js 16** предпочитают `preload` (`priority` устарел). → [4_nextjs.md](./4_nextjs_optimizations.md#core-web-vitals-on-vercel).

Фотографии → растр **AVIF → WebP → JPEG** через `<picture>`, а не SVG. Служить `srcset`/`sizes`. CDN изображений могут выбирать формат/размер из Client Hints/UA. Длинный `Cache-Control` на статических файлах; сортировка/очистка ненужных запросов очистки кеша; избегать `Set-Cookie` о кэшируемых ответах. Понизить конкурирующую работу: `fetchpriority="low"` на карусельных слайдах без LCP; `defer`/`async` сторонние скрипты. Маленькие значки: `data:` URL или **встроенный `<svg>`** (СВГО); base64 на ~⅓ больше и использует общий кеш документов — не для героев. Полевые данные часто показывают преобладание TTFB/задержек — проверьте перед марафонским кодированием.

Уменьшите CSS, блокирующий рендеринг (критическое встроенное, покрытие для неиспользуемых). Избегайте синхронизации JS в `<head>` (`defer`/`async` или конец `body`). SSR/SSG, чтобы узел LCP находился в первом HTML. Длинные задачи после прибытия изображения задерживают покраску. Текст ЛКП: `font-display: swap` + предварительно загрузить критический шрифт.

Асинхронный некритичный CSS (риск FOUC):

```html
<link
  rel="preload"
  href="non-critical.css"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript><link rel="stylesheet" href="non-critical.css" /></noscript>
```

[Правила спекуляции] (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/speculationrules) могут предварительно отображать вероятный следующий URL-адрес, поэтому LCP для этой навигации будет близок к нулю (аналогично восстановлению **bfcache**). Хром-только при записи; Задержка Safari/Firefox. `eagerness`: `immediate` / `eager` / `moderate` / `conservative` — более ранние предположения теряют больше смысла, если пользователь никогда не нажимает на ссылку.

```html
<script type="speculationrules">
  {
    "prerender": [
      { "where": { "href_matches": "/*" }, "eagerness": "moderate" }
    ]
  }
</script>
```

**When to use:**

Герой продукта, обложка статьи, маркетинговый лендинг. Подтвердите слабый фрагмент с помощью CrUX/атрибуции, прежде чем сжимать файлы «на всякий случай».

#### Common pitfalls

- `loading="lazy"` или JS/`data-src` на герое (сканер предзагрузки никогда не видит настоящего `src`).
- `fetchpriority="high"` на многих активах (сигнал становится шумом).
- Герой только для CSS, без `preload`.
- Предварительная загрузка всего и ограничение реального запроса LCP.
- Оптимизация размера файла, когда атрибуция показывает TTFB или задержку рендеринга.

**Pluses and minuses:**

| +                                                  | −                                                              |
| -------------------------------------------------- | -------------------------------------------------------------- |
| Сопоставляет видимый момент «основного содержания» | Изменение элемента LCP в зависимости от области просмотра/кэша |
| Четыре именных кусочка для билетов                 | Лабораторный холодный тайник ≠ полевой теплый тайник           |

**Examples:**

```html
<img
  src="hero.avif"
  alt="Cover"
  width="1200"
  height="630"
  fetchpriority="high"
/>

<picture>
  <source
    type="image/avif"
    srcset="hero-640.avif 640w, hero-1280.avif 1280w"
    sizes="100vw"
  />
  <source
    type="image/webp"
    srcset="hero-640.webp 640w, hero-1280.webp 1280w"
    sizes="100vw"
  />
  <img
    src="hero-1280.jpg"
    srcset="hero-640.jpg 640w, hero-1280.jpg 1280w"
    sizes="100vw"
    alt="Cover"
    width="1280"
    height="720"
    fetchpriority="high"
  />
</picture>
```

**Thoughts:** Вы не выбираете узел LCP — вы делаете все, что выбрал браузер, быстрым, сокращая TTFB, задержку обнаружения, байты, а затем ожидание основного потока/CSS/шрифта.

**See also:** [Core Web Vitals](#core-web-vitals) · [TTFB](#ttfb-time-to-first-byte) · [FCP](#first-contentful-paint-fcp) · [INP](#inp-interaction-to-next-paint) · HTML → [1_html.md](./1*html* Performance.md#core-web-vitals--html-developer-impact) · [img](./1_html_media.md#img-element-and-Response-images) · [DevTools](./11_vsc_browser.md#devtools--core-web-vitals)

**Sources:**

[web.dev — Оптимизация LCP](https://web.dev/articles/optimize-lcp) · [web.dev — LCP](https://web.dev/articles/lcp) · [web.dev — Приоритет выборки](https://web.dev/articles/fetch-priority)

---

</details>

<details>
  <summary>First Contentful Paint (FCP)</summary>

### First Contentful Paint (FCP)

**Definition:** FCP — это время от начала навигации до момента, когда браузер отрисовывает первый **контент**: текст, изображение, SVG или непустой объект. `<canvas>`. Это означает «пустой экран закончился», а не «страница готова».

**How it works:**

- FCP – это **Web Vital**, используемый для диагностики нагрузки. Это **не** Core Web Vital (это LCP, INP, CLS) и **не** напрямую влияет на рейтинг.
- Медленный FCP обычно означает медленный **LCP**: оба ждут одного и того же раннего пути — [TTFB](#ttfb-time-to-first-byte) и **блокировка рендеринга** CSS/JS перед первой отрисовкой.
- Оценка **75-го процентиля** отдельно для мобильных и настольных компьютеров. **Хорошо:** ≤ 1,8 с.**Требует улучшения:** 1,8–3 с. **Плохо:** > 3 с.
- Хороший FCP все равно может заставить пользователя ждать: основной контент (**LCP**) и скорость ввода (**INP**) могут появиться гораздо позже.

- Убран блокирующий рендеринг CSS/JS; минимизировать CSS; удалите неиспользуемый CSS.
- Нижний ТТФБ; добавлять `<link rel="preconnect">` (DNS+TCP+TLS); удалить лишние редиректы.
- `<link rel="preload">` для файлов, необходимых для первой покраски; оптимизировать шрифты (`font-display`, подмножество неиспользуемых глифов).
- Меньший вес страницы; HTTP-кэширование.

**When to use:**

Длинный белый экран. Когда LCP плох, FCP сообщает вам: «еще ничего не нарисовано» или «неправильный самый большой элемент». Те же ранние рычаги, что и LCP/TTFB.

#### Common pitfalls

- Называть FCP ключевым веб-важным или считать его «страницей готовой».
- Оптимизация логотипа-заставки, чтобы FCP выглядел хорошо, пока LCP задерживается.

**Pluses and minuses:**

| +                                                 | −                                                    |
| ------------------------------------------------- | ---------------------------------------------------- |
| Самый ранний видимый пользователю сигнал нагрузки | Не основные веб-показатели / нет рейтинга            |
| Разделяет критический путь с LCP                  | Первый логотип или строка текста ≠ полезная страница |

**Examples:**

```js
import { onFCP } from "web-vitals";
onFCP(console.log);
```

Предпочитать `web-vitals` над сырым `PerformanceObserver` on `paint`: поле FCP также обрабатывает фоновые вкладки, восстановление bfcache, iframe и предварительную визуализацию (`activationStart`).

**Thoughts:** FCP = первые пиксели контента. Исправление TTFB и блокировки ресурсов; еще измеряю LCP и INP.

**See also:** [Core Web Vitals](#core-web-vitals) · [LCP](#lcp-largest-contentful-paint) · [TTFB](#ttfb-time-to-first-byte) · [INP](#inp-interaction-to-next-paint) · [preload, prefetch, preconnect](#preload-prefetch-preconnect--prerender) · [HTML — first краска](./1_html_interview.md#what-happens-on-first-page-render)

**Sources:**

[web.dev — FCP](https://web.dev/articles/fcp) · [web.dev — Vitals](https://web.dev/articles/vitals)

---

</details>

<details>
  <summary>TTFB (Time to First Byte)</summary>

### TTFB (Time to First Byte)

**Definition:** TTFB — это время от начала навигации до получения браузером **первого байта** ответа. Это **диагностический** показатель (а не Core Web Vital) для настройки соединения и реагирования источника/CDN.

**How it works:**

TTFB представляет собой сумму:

- редиректы (каждый 301/302 — это еще один путь туда и обратно);
- запуск сервис-воркера, если он управляет страницей;
- DNS-поиск;
- TCP-соединение + TLS-квитирование;
- сервер работает до первого байта ответа.

Пока этот байт не прибудет, браузеру нечего анализировать, поэтому **FCP и LCP ждут**. Высокий TTFB часто снижает другие показатели.**Низкий** TTFB **не** гарантирует хороший LCP/FCP — ресурсы, JS и отрисовка по-прежнему следуют за ним.

| Рейтинг ([web.dev](https://web.dev/articles/optimize-ttfb)) | ТТФБ      |
| ----------------------------------------------------------- | --------- |
| Хорошо                                                      | ≤ 0,8 с   |
| Требует улучшения                                           | 0,8–1,8 с |
| Бедные                                                      | > 1,8 с   |

Измерьте в PageSpeed ​​Insights, DevTools **Сеть** (Ожидание/TTFB), `web-vitals` `onTTFB`или данные поля через **CrUX**. Типичные причины: **сеть** (расстояние, отсутствие CDN) или **происхождение** (отрисовка HTML, база данных, сторонние API).

**Сеть**

- CDN для статических ресурсов и, если возможно, HTML — обычно также HTTP/2, HTTP/3, TLS 1.3. См. [CDN](./6_web_api_core.md#cdn-content-delivery-network).
- Кэшировать HTML с помощью `Cache-Control`; сделать недействительным при развертывании; избегайте уникальных строк запроса, которые разрушают CDN/общие кеши. См. [HTTP-кэширование](./6_web_api_http.md#http-caching).
- Отключить редиректы (правильная схема и косая черта). `Strict-Transport-Security` удаляет HTTP→HTTPS при **повторных** посещениях; при первом посещении по-прежнему выполняется перенаправление, если хост не находится в **списке предварительной загрузки HSTS**. См. [Подтверждение SSL/TLS](./6_web_api_http.md#ssltls--https-handshake).

**Сервер**

- Поток HTML (`renderToPipeableStream` + `<Suspense>` в React), чтобы браузер мог анализировать фрагменты, пока медленно загружаются данные. См. [проектирование системы — потоковая SSR](./0_system_design_architecture.md#rendering-strategies-when-html-is-built).
- Next.js: SSG / [ISR](./4_nextjs_rendering.md#incremental-static-regeneration-isr) для страниц, которым не требуется HTML для каждого посетителя — тогда CDN может его обслуживать. Рычаги: [Core Web Vitals на Vercel](./4_nextjs_optimizations.md#core-web-vitals-on-vercel).
- Сервис-воркер **stale- while-revalidate** может немедленно вернуть оболочку приложения из кэша; **не** используйте его для персонализированного HTML-кода для каждого запроса (это может привести к устаревшему документу). См. раздел [Сервисные работники](#service-workers).
- **103 ранних подсказки:** пока источник готовит окончательный ответ, отправьте `Link` подсказки, чтобы браузер мог запустить важные ресурсы. Некоторые CDN (например, Cloudflare) выдают 103 до того, как существует исходный HTML. Принятие по-прежнему неравномерно.
- Здоровье Origin (память, время работы). Разбить время происхождения с помощью `Server-Timing`; эти метки отображаются в браузере через **Время навигации** (`PerformanceNavigationTiming`).

**When to use:**

Медленный LCP с поздним документом; пользователи вдали от места происхождения; SSR, который ожидает DB/API перед отправкой любого HTML.

#### Common pitfalls

Уникальные параметры аналитических запросов в обход кеша CDN. Дополнительные 301/302 прыжков. Edge SSR рядом с удаленной базой данных (TTFB хуже, чем у регионального узла). Предполагается, что кэшированный персонализированный HTML безопасен. Рассматривать TTFB как замену LCP.

**Pluses and minuses:**

| +                                            | −                                                                                                  |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Объясняет зависание FCP/LCP перед анализом   | Не является основной веб-важной задачей; погоня за TTFB не дает возможности увидеть JS/изображения |
| Атрибуция разделяет DNS, соединение и запрос | 103 Early Hints могут сделать «первый байт» промежуточным ответом, а не окончательным HTML         |

**Examples:**

```js
import { onTTFB } from "web-vitals";

onTTFB((metric) => {
  console.log("TTFB:", metric.value, "ms", metric.rating);
  const nav = metric.entries[0];
  if (nav) {
    console.log("DNS:", nav.domainLookupEnd - nav.domainLookupStart);
    console.log("Connect:", nav.connectEnd - nav.connectStart);
    console.log("Request→first byte:", nav.responseStart - nav.requestStart);
  }
});
```

```http
Server-Timing: db;dur=53, app;dur=47.2;desc="render"
103 Early Hints
Link: </hero.webp>; rel=preload; as=image
```

**Thoughts:** Первый байт разблокирует синтаксический анализ. Исправьте работу CDN, перенаправлений и источников, а затем оптимизируйте LCP после запуска HTML.

**See also:** [Core Web Vitals](#core-web-vitals) · [LCP](#lcp-largest-contentful-paint) · [FCP](#first-contentful-paint-fcp) · [INP](#inp-interaction-to-next-paint) · [CDN](./6_web_api_core.md#cdn-content-delivery-network)

**Sources:**

[web.dev — TTFB](https://web.dev/articles/ttfb) · [web.dev — Оптимизация TTFB](https://web.dev/articles/optimize-ttfb) · [web-vitals `onTTFB`](https://github.com/GoogleChrome/web-vitals) · [MDN — Server-Timing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) · [MDN — 103 ранних подсказки](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103)

---

</details>

<details>
  <summary>INP (Interaction to Next Paint)</summary>

### INP (Interaction to Next Paint)

**Definition:**

Полевая метрика для реагирования: время от щелчка, касания или нажатия клавиши до того, как браузер отрисует следующий кадр, который может показать видимый ответ. **Хорошо** ≤ 200 мс, **требует улучшения** ≤ 500 мс, **плохо** > 500 мс — на **75-м процентиле** просмотров страниц отдельно на мобильных устройствах и компьютерах.

INP **не** ожидает сети или более поздней версии асинхронного пользовательского интерфейса. Он измеряет, как долго блокируется следующая краска\*\*.Медленная обратная связь выглядит так, будто действие не удалось (двойное добавление в корзину, отказ от оформления заказа).

**How it works:**

INP отслеживает **все** соответствующие взаимодействия на протяжении всего срока службы страницы. Значением обычно является **худшее** взаимодействие, игнорируя выбросы (один самый высокий показатель на 50 взаимодействий). Наведение курсора, прокрутка и масштабирование **не** учитываются, если они не включают в себя щелчок/касание/клавишу. Взаимодействия iframe учитываются для пользователей (CrUX), но JS RUM часто не видит iframe из разных источников.

Взаимодействие — это один жест (`pointerdown` + `click`, or `keydown` + `keyup`). Задержка — это самое продолжительное событие в этой группе, от начала до возможности следующей отрисовки.

Три фазы (сумма = задержка взаимодействия):

| Фаза                            | Что                                                   | Типичная причина                                 |
| ------------------------------- | ----------------------------------------------------- | ------------------------------------------------ | --- | ------------------------ | ----------------------------------- | ------------------------------------------- |
| **Задержка ввода**              | Действие пользователя → запускается первый обработчик | Основной поток занят (JS, длинные задачи)        |
| **Продолжительность обработки** | Обработчики + другая работа по синхронизации          | Обработчики тяжелых кликов, большой коммит React |     | **Задержка презентации** | Обработчики готовы → обновлен фрейм | Верстка/рисовка, сторонний JS, огромный DOM |

FID (Core Vital до **марта 2024**) измерял только **первое** взаимодействие и только **задержку ввода**. INP заменил его: все клики/нажатия/клавиши, полный путь к следующей отрисовке. Lab Lighthouse без отчетов пользователей **TBT**, а не INP.

Чем INP хуже:

- **Длинные задачи** (> 50 мс) в основном потоке.- Тяжелые обработчики/большие обновления клиентского DOM.
- **Перестановка макета** — писать стили → читать `offsetHeight` → написать еще раз (раскладка принудительной синхронизации).
- Большой/глубокий DOM (Маяк предупреждает ~800 узлов, серьезный ~1400).
- Клиент `innerHTML` большой разметки (один длинный анализ/вставка; сканер предварительной загрузки пропускает вложенные ресурсы → также LCP).

`useTransition` / `useDeferredValue` отмечать тяжелые обновления как несрочные. Раздельное увлажнение с помощью `<Suspense>`; RSC пропускает гидратацию. Реакция **19.2** `<Activity mode="hidden">` сохраняет состояние/DOM, срывает эффекты, скрывается с помощью `display: none`. Подробности — [4_react.md](./4_react_ecosystem.md#web-vitals-in-react-apps).

**Долгая работа** после критического пользовательского интерфейса. `scheduler.yield()` (Chrome 129+, Firefox 142+; **не Safari**) продолжает работать с приоритетом планировщика; `setTimeout(0)` переходит в конец очереди макрозадач. **не** полагайтесь на `navigator.scheduling.isInputPending()` (может быть `false` после щелчка).

```js
function yieldToMain() {
  if (globalThis.scheduler?.yield) return scheduler.yield();
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function saveSettings() {
  validateForm();
  showSpinner();
  updateUI();
  await yieldToMain();
  saveToLocalStorage();
  sendAnalytics();
}

async function runJobs(jobQueue, deadline = 50) {
  let lastYield = performance.now();
  for (const job of jobQueue) {
    job();
    if (performance.now() - lastYield > deadline) {
      await yieldToMain();
      lastYield = performance.now();
    }
  }
}
```

Веб-воркеры для **чистого** процессора (сортировка, анализ) — без DOM. Комлинк обертывает `postMessage`; большие полезные нагрузки: передача `ArrayBuffer`.

часто доминируют задержки презентации. Рабочие не могут запускать GTM как есть (требуется DOM). **Partytown** передает DOM в основной поток; Следующий `next/script` `strategy="worker"` потребности `experimental.nextScriptWorkers`. Предпочитать `lazyOnload`; удалить неиспользуемые теги. Стоимость тега: пиксели (только HTTP) < пользовательские шаблоны < собственный HTML (макет). Контейнер GTM должен быть небольшим (жесткий размер 300 КБ). Фасад для встраивания (`lite-youtube-embed`); `loading="lazy"` + `width`/`height` в iframe (CLS).

**When to use:**

Поиск, корзина, оформление заказа, фильтры, автозаполнение. Сначала измерьте поле (`web-vitals` атрибуция: `inputDelay`, `processingDuration`, `presentationDelay`).

**Исправьте порядок — сначала поставьте меньше JS.** Анализ + выполнение происходит в основном потоке. Большие связки повреждают INP и могут задерживать LCP.

1. **Измерить** — `webpack-bundle-analyzer` / `@next/bundle-analyzer`.
2. **Разделение кода** — по маршруту; `import()` / `React.lazy` / `next/dynamic` для диаграмм, редакторов, модальных окон. См. [10_build.md](./10_build_bundlers.md#code-splitting).
3. **Tree-shake** — под названием ESM (`lodash-es`, `date-fns`), нет `import _ from 'lodash'` / Момент. [10_build.md](./10_build_bundlers.md#tree-shaking).
4. **Напильники** — `export *` от `index.ts` может вытащить целый комплект пользовательского интерфейса. Следующий: [`optimizePackageImports`](./4_nextjs_optimizations.md#optimizepackageimports) (В следующих документах он по-прежнему отмечен как экспериментальный; Turbopack часто сам анализирует импорт).
5. **Работа на сервере** — RSC вместо клиентского Markdown и т. д. Лучший JS — это JS, который никогда не отправляется. Затем более легкие библиотеки, Brotli, бюджет пакета CI.

Другие методы:

- Отказ от дребезга `input`; дроссель `scroll`/`resize`.
- Прервать устаревание `fetch` с `AbortController` — [3_js_async.md](./3_js_async.md#abortcontroller).
- Предпочитаю одноразовый `setTimeout` сверх остатков `setInterval`; перенести тяжелую работу по таймеру на работника.
- Анимировать `transform`/`opacity` в CSS; JS включен `width`/`top`/`box-shadow` Расположение сил — [2_css.md](./2_css.md).
- Пакетный DOM: **все читает, затем все записывает**.
- Меньший DOM: фрагменты, более плоские деревья, не отображать скрытые вкладки, пока они не понадобятся; `content-visibility: auto` — [2_css.md](./2_css_architecture.md#contain--content-visibility).
- Более дешевые селекторы (длинные цепочки требуют больше затрат на пересчет стиля в большом DOM).
- Файлы JS меньшего размера (как правило, ~100 КБ); `type="module"` анализируется как отдельные фрагменты, поэтому ввод может проходить между ними.
- `touch-action: manipulation` на кнопках — пропускает историческое ожидание двойного касания и масштабирования примерно в 300 мс.

#### Common pitfalls

Yield/Workers перед вырезанием неиспользуемого JS. Рассматривать FID или TBT как INP. Счет прокрутки/наведения как INP. `isInputPending()` вместо того, чтобы уступить. Пользовательский HTML-код GTM для наглядного пользовательского интерфейса. Дублирующиеся теги в HTML **и** диспетчере тегов.

**Pluses and minuses:**

| +                                                                                | −                                                          |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Соответствует пользовательскому интерфейсу после загрузки (большая часть сеанса) | Нет INP, если никто не щелкнул/нажал/напечатал             |
| Контроль имен атрибуции + этап                                                   | Лаборатория INP зависит от того, какие клики вы выполняете |
| Общий язык с SEO                                                                 | Прокрутка/наведение курсора выходят за рамки               |

**Examples:**

```tsx
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("./heavy-chart"), { ssr: false });
```

```js
let controller;
input.addEventListener("input", async (e) => {
  const query = e.target.value.trim();
  controller?.abort();
  if (!query) return;
  controller = new AbortController();
  const res = await fetch(`/search?q=${encodeURIComponent(query)}`, {
    signal: controller.signal,
  });
});
```

```js
// bad — layout each iteration
boxes.forEach((box) => {
  const height = box.offsetHeight;
  box.style.height = `${height * 2}px`;
});
// good — one layout
const heights = boxes.map((box) => box.offsetHeight);
boxes.forEach((box, i) => {
  box.style.height = `${heights[i] * 2}px`;
});
```

**Thoughts:** Нарисуйте ответ **сейчас** (спиннер, оптимистичный интерфейс); держите основной поток свободным от длинного JS.

**See also:** [Core Web Vitals](#core-web-vitals) · [LCP](#lcp-largest-contentful-paint) · [4_react.md — Web Vitals](./4_react_ecosystem.md#web-vitals-in-react-apps) · [4_nextjs.md — CWV](./4_nextjs_optimizations.md#core-web-vitals-on-vercel)

**Sources:**

[web.dev — INP](https://web.dev/articles/inp) · [web.dev — Оптимизация длительных задач](https://web.dev/articles/optimize-long-tasks) · [MDN — Scheduler.yield](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield) · [React `<Activity>`](https://react.dev/reference/react/Activity)

---

</details>

<details>
  <summary>preload, prefetch, preconnect & prerender</summary>

### preload, prefetch, preconnect & prerender

**Definition:**

Подсказки к ресурсам сообщают браузеру о необходимости раннего доступа или подключения, ускоряя текущую или будущую навигацию.

| Подсказка    | Когда             | Цель                                     |
| ------------ | ----------------- | ---------------------------------------- |
| `preload`    | Текущая страница  | Критический ресурс необходим сейчас      |
| `prefetch`   | Будущая навигация | Вероятно, следующий ресурс страницы      |
| `preconnect` | Ранний            | DNS + TCP + TLS к источнику              |
| `prerender`  | Будущая страница  | Отобразить всю страницу в фоновом режиме |

**Examples:**

```html
<link rel="preload" href="/app.js" as="script" />
<link rel="prefetch" href="/next-page.js" as="script" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
```

**Sources:**

[MDN — rel=preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload)

---

</details>

<details>
  <summary>PRPL pattern</summary>

### PRPL pattern

**Definition:**

PRPL (Push, Render, Pre-cache, Lazy-load) — это шаблон производительности для быстрых интерактивных веб-приложений.

| Шаг                         | Цель                                          |
| --------------------------- | --------------------------------------------- |
| Нажмите                     | Отправляйте критически важные ресурсы заранее |
| Рендеринг                   | Показать контент как можно скорее             |
| Предварительное кэширование | Кэшировать наиболее необходимые ресурсы       |
| Ленивая загрузка            | Отложить некритичный код/активы               |

**Examples:**

```html
<!-- Push critical route -->
<link rel="preload" href="/route-home.js" as="script" />
<!-- Lazy-load below-fold images -->
<img loading="lazy" src="/gallery/photo-9.jpg" />
```

**Sources:**

[web.dev — шаблон PRPL](https://web.dev/articles/apply-instant-loading-with-prpl)

---

---

</details>

<a name="15-integrations"></a>

## 15. Integrations

<details>
  <summary>Payments, analytics & third-party SDKs</summary>

### Payments, analytics & third-party SDKs

**Definition:** Внешние поставщики, которые вы интегрируете через HTTPS + клиентский SDK: **платежи** (Stripe/PayPal), **аналитика** (GA4, Meta Pixel, продуктовая аналитика), **maps/auth/CMS**. Ваше приложение владеет UX; поставщик владеет PCI, пикселями отслеживания или идентификационными данными.

**How it works:**

- **Платежи:** никогда не сохраняйте необработанные номера карт. Токенизация Stripe Checkout/Payment Element по их происхождению; ваш сервер подтверждает секретным ключом (`checkout.session.completed` вебхук). Ключи идемпотентности при создании платежа.
- **Аналитика:** загрузите скрипт поставщика. `async`; отправлять события после согласия (GDPR). Предпочитайте события на стороне сервера для получения дохода, чтобы блокировщики рекламы не снижали конверсии.
- **SDK:** заключён в адаптер (`lib/payments.ts`), поэтому смена поставщиков не просачивается в пользовательский интерфейс. Тяжелые SDK с ленивой загрузкой (`next/dynamic`), чтобы они не повредили INP/LCP.

**When to use:**

Оформление заказа SaaS, маркетинговые воронки, «Войти через Google». Пропустите загрузку аналитики при первой отрисовке приземляющегося героя, если целью является LCP.

#### Common pitfalls

Размещение секретных ключей в браузере. Доверчивый клиент сообщил `amount`. Блокировка рендеринга включена `gtag.js`. Пропуск проверок подписи вебхука.

**Pluses and minuses:**

| +                                                       | −                                                      |
| ------------------------------------------------------- | ------------------------------------------------------ |
| Соблюдение требований PCI/отслеживания — работа вендора | Размер сценария, конфиденциальность и CSP `script-src` |
| Вебхуки синхронизируют вашу БД                          | Проверка подписи вебхука обязательна                   |
| Быстрее, чем создавать биллинг самостоятельно           | Блокировка поставщиков и песочница против живых ключей |

**Examples:**

```ts
// Server — confirm after webhook, never trust the client amount alone
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const event = stripe.webhooks.constructEvent(
    await req.text(),
    sig!,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
  if (event.type === "checkout.session.completed") {
    await markPaid(event.data.object.id);
  }
  return new Response(null, { status: 200 });
}
```

**Thoughts:** Клиентский SDK для UX; сервер + подписанные вебхуки для истины.

**Sources:**

[Веб-перехватчики Stripe](https://docs.stripe.com/webhooks) · [сторонние веб-разработчики](https://web.dev/articles/optimizing-content-efficiency-loading- Third-party-javascript)

---

</details>

<a name="interview-practice"></a>
