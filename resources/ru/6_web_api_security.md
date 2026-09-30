# Web APIs — Security

Безопасность браузера и сторонние интеграции.

[ ← Вернуться в хаб](./6_web_api.md)

### Related docs

- [Веб-API — Core](./6_web_api_core.md) · [Веб-API — HTTP](./6_web_api_http.md) · [Веб-API — стили API](./6_web_api_rest.md) · [Веб-API — аутентификация и хранение](./6_web_api_auth.md) · [Веб-API — Приложения](./6_web_api_apps.md) · [Веб-API — Безопасность](./6_web_api_security.md) · [Веб-API — Performance](./6_web_api_performance.md) · [Веб-API — Интервью](./6_web_api_interview.md)

### Sections

- [13. Security](#13-security)
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
