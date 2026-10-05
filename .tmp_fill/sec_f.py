add(
"What built-in security features do modern web application frameworks typically include?",
"""Modern web frameworks ship controls that are secure when left on and easy to turn off. The OWASP sheets for Rails, Django, and ASP.NET Core describe the same set: HTTPS redirection, CSRF protection on cookie-authenticated state changes, session and CSRF cookies marked secure, output encoding in templates, parameterized data access, and response headers such as HSTS and a content security policy.""",
"""Turn the deployment checks on and read the warnings. Django's `check --deploy` reports an unset `SECURE_HSTS_SECONDS`, `SECURE_SSL_REDIRECT` not true, a weak `SECRET_KEY`, `SESSION_COOKIE_SECURE` and `CSRF_COOKIE_SECURE` not true, `DEBUG` still true, and an empty `ALLOWED_HOSTS`. Rails enables `protect_from_forgery` on the base controller and `config.force_ssl` for TLS, HSTS, and secure cookies. ASP.NET Core uses `UseHttpsRedirection`, HSTS, `HttpOnly` cookies, and anti-forgery validation.

Exceptions to CSRF, a debug page, or an empty host list undo those defaults. Review every exception. Repeat authorization on the server even when the framework has a login decorator.""",
"""Современные веб-фреймворки поставляют контроли, которые безопасны, пока их не выключили. Шпаргалки OWASP по Rails, Django и ASP.NET Core описывают один набор: перенаправление на HTTPS, защита от CSRF на изменениях состояния с cookie, cookie сеанса и CSRF с флагом secure, кодирование вывода в шаблонах, параметризованный доступ к данным и заголовки ответа вроде HSTS и политики содержимого.""",
"""Включите проверки развёртывания и читайте предупреждения. `check --deploy` в Django сообщает о пустом `SECURE_HSTS_SECONDS`, `SECURE_SSL_REDIRECT` не true, слабом `SECRET_KEY`, `SESSION_COOKIE_SECURE` и `CSRF_COOKIE_SECURE` не true, `DEBUG` всё ещё true и пустом `ALLOWED_HOSTS`. Rails включает `protect_from_forgery` на базовом контроллере и `config.force_ssl` для TLS, HSTS и безопасных cookie. ASP.NET Core использует `UseHttpsRedirection`, HSTS, cookie `HttpOnly` и проверку anti-forgery.

Исключения из CSRF, страница отладки или пустой список хостов отменяют эти значения по умолчанию. Просматривайте каждое исключение. Повторяйте авторизацию на сервере, даже если у фреймворка есть декоратор входа.""",
"""# Django deployment check. Fix every warning before production.
./manage.py check --deploy
""",
[
("OWASP Django Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Django_Security_Cheat_Sheet.html"),
("OWASP Ruby on Rails Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Ruby_on_Rails_Cheat_Sheet.html"),
("OWASP .NET Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/DotNet_Security_Cheat_Sheet.html"),
],
lang="bash",
)

add(
"How does Ruby on Rails handle web security, and what are its built-in protection mechanisms?",
"""Ruby on Rails includes CSRF tokens and forces TLS when production is configured that way. OWASP's Rails sheet says to keep `protect_from_forgery` on the base `ApplicationController`, and to set `config.force_ssl = true` so the app is served over SSL, sends Strict-Transport-Security, and uses secure cookies.""",
"""CSRF exceptions exist and must be reviewed. The sheet notes that Rails does not apply CSRF protection to HTTP `GET` by default, so state-changing work should not be a GET. Token-only APIs do not need this controller protection; cookie-authenticated paths still do.

SQL values go through placeholders. A `LIKE` pattern is escaped with `sanitize_sql_like` and still bound as a parameter. Mass assignment is the Rails name for binding a request object straight onto a model; allow only the attributes the action may set.""",
"""Ruby on Rails включает CSRF-токены и включает TLS, когда production так настроен. Шпаргалка OWASP по Rails велит оставить `protect_from_forgery` на базовом `ApplicationController` и задать `config.force_ssl = true`, чтобы приложение шло по SSL, отправляло Strict-Transport-Security и использовало безопасные cookie.""",
"""Исключения CSRF существуют и их надо просматривать. Шпаргалка отмечает, что Rails по умолчанию не применяет защиту CSRF к HTTP `GET`, поэтому работа, меняющая состояние, не должна быть GET. API только с токенами эта защита контроллера не нужна; пути с аутентификацией по cookie — нужна.

Значения SQL идут через заполнители. Шаблон `LIKE` экранируют `sanitize_sql_like` и всё равно связывают как параметр. Mass assignment — имя Rails для прямой привязки объекта запроса к модели; разрешайте только атрибуты, которые это действие может задавать.""",
"""# config/environments/production.rb
config.force_ssl = true

class ApplicationController < ActionController::Base
  protect_from_forgery
end
""",
[
("OWASP Ruby on Rails Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Ruby_on_Rails_Cheat_Sheet.html"),
("OWASP Mass Assignment Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html"),
],
en_w="""Keep the defaults on every cookie-authenticated controller. Add a `protect_from_forgery` exception only for a path that does not use cookies, and record why.""",
ru_w="""Оставляйте значения по умолчанию на каждом контроллере с аутентификацией по cookie. Исключение `protect_from_forgery` добавляйте только для пути без cookie и запишите, зачем.""",
lang="ruby",
)

add(
"What are the security features provided by Django for Python web applications?",
"""Django aims to be secure by default and still lets a developer reconfigure a component unsafely. OWASP's Django sheet points at `manage.py check --deploy`, the CSRF middleware, secure session and CSRF cookies, and `@login_required` so an unauthenticated caller is redirected to the login page.""",
"""Address every warning from `check --deploy`: set HSTS only when the whole site is HTTPS, set `SECURE_SSL_REDIRECT` or redirect at the proxy, use a long random `SECRET_KEY` that is not prefixed with `django-insecure-`, set `SESSION_COOKIE_SECURE` and `CSRF_COOKIE_SECURE`, turn `DEBUG` off, and set `ALLOWED_HOSTS`. Any custom cookie from `HttpResponse.set_cookie()` needs its secure parameter true. Hash passwords with `make_password` from `django.contrib.auth.hashers`, not with a reversible store.

`@login_required` checks that someone is signed in. It does not decide which object that person may read. Add that check in the view.""",
"""Django стремится быть безопасным по умолчанию и всё же позволяет разработчику небезопасно перенастроить компонент. Шпаргалка OWASP по Django указывает на `manage.py check --deploy`, middleware CSRF, безопасные cookie сеанса и CSRF и `@login_required`, чтобы неаутентифицированный вызывающий ушёл на страницу входа.""",
"""Закройте каждое предупреждение `check --deploy`: задавайте HSTS только когда весь сайт на HTTPS, включите `SECURE_SSL_REDIRECT` или перенаправление на прокси, используйте длинный случайный `SECRET_KEY` без префикса `django-insecure-`, включите `SESSION_COOKIE_SECURE` и `CSRF_COOKIE_SECURE`, выключите `DEBUG` и задайте `ALLOWED_HOSTS`. У любой своей cookie из `HttpResponse.set_cookie()` параметр secure должен быть true. Хешируйте пароли через `make_password` из `django.contrib.auth.hashers`, а не обратимым хранением.

`@login_required` проверяет, что кто-то вошёл. Он не решает, какой объект этот человек может читать. Добавьте эту проверку во view.""",
"""SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
DEBUG = False
""",
[
("OWASP Django Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Django_Security_Cheat_Sheet.html"),
],
lang="python",
)

add(
"How does ASP.NET Core enforce web security?",
"""The OWASP .NET sheet configures ASP.NET Core to redirect to HTTPS, send HSTS, and set browser security headers. Cookie options set `HttpOnly` and an expiry. Anti-forgery validation is applied on handlers that must not run from another site.""",
"""`app.UseHttpsRedirection()` sends browsers to HTTPS. `UseHsts` sets a max age; the sheet's example uses one year and `IncludeSubdomains`. NWebsec helpers in the same sheet set `X-Content-Type-Options`, `Referrer-Policy` of `NoReferrer`, `X-Frame-Options` deny, and a content security policy limited to `'self'` for scripts, styles, fonts, images, and form actions. `ConfigureApplicationCookie` sets `Cookie.HttpOnly = true` and `ExpireTimeSpan` of 60 minutes, with sliding expiration left off unless you have accepted that trade-off.

`[ValidateAntiForgeryToken]` checks the token, including on a GET handler when you apply it there. Remove `X-Powered-By` and the server version header so the response does not advertise the stack. These headers do not replace an authorization filter on the action.""",
"""Шпаргалка OWASP по .NET настраивает ASP.NET Core так, чтобы он перенаправлял на HTTPS, отправлял HSTS и выставлял браузерные заголовки безопасности. Параметры cookie задают `HttpOnly` и срок. Проверка anti-forgery ставится на обработчики, которые не должны выполняться с другого сайта.""",
"""`app.UseHttpsRedirection()` отправляет браузеры на HTTPS. `UseHsts` задаёт max age; в примере шпаргалки это один год и `IncludeSubdomains`. Помощники NWebsec в той же шпаргалке задают `X-Content-Type-Options`, `Referrer-Policy` со значением `NoReferrer`, `X-Frame-Options` deny и политику содержимого, ограниченную `'self'` для сценариев, стилей, шрифтов, изображений и действий форм. `ConfigureApplicationCookie` ставит `Cookie.HttpOnly = true` и `ExpireTimeSpan` в 60 минут, а скользящее продление оставляют выключенным, пока этот компромисс не принят.

`[ValidateAntiForgeryToken]` проверяет токен, в том числе на обработчике GET, если атрибут там стоит. Уберите `X-Powered-By` и заголовок версии сервера, чтобы ответ не рекламировал стек. Эти заголовки не заменяют фильтр авторизации на действии.""",
"""app.UseHttpsRedirection();
app.UseHsts(hsts => hsts.MaxAge(365).IncludeSubdomains());
services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
    options.SlidingExpiration = false;
});
""",
[
("OWASP .NET Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/DotNet_Security_Cheat_Sheet.html"),
],
lang="csharp",
)

add(
"What security considerations must be taken into account when using client-side JavaScript frameworks like Angular, React, or Vue.js?",
"""OWASP's cross-site scripting sheet says modern frameworks reduce XSS because templates auto-escape. Gaps remain at the escape hatches: React's `dangerouslySetInnerHTML` without a sanitizer, Angular's `bypassSecurityTrustAs*` functions, Lit's `unsafeHTML`, and Polymer's `inner-h-t-m-l` attribute. React also does not accept `javascript:` or `data:` URLs without extra validation.""",
"""Keep data in text sinks. The DOM sheet's safe pattern is `textContent`, `insertAdjacentText`, `createTextNode`, and setting `value` on a form field. Use `innerHTML` only after a maintained sanitizer such as DOMPurify. The AJAX sheet says React, Vue, Angular, and Svelte standardize DOM updates and still require developers to avoid those unsafe APIs.

Know where your framework stops protecting you. Output encoding and HTML sanitization cover the gap. Keep framework packages current. A content security policy still limits which scripts the browser will run if a sink is misused.""",
"""Шпаргалка OWASP по межсайтовому скриптингу говорит, что современные фреймворки снижают XSS, потому что шаблоны сами экранируют. Пробелы остаются на люках: `dangerouslySetInnerHTML` в React без санитайзера, функции `bypassSecurityTrustAs*` в Angular, `unsafeHTML` в Lit и атрибут `inner-h-t-m-l` в Polymer. React также не принимает URL `javascript:` или `data:` без дополнительной проверки.""",
"""Держите данные в текстовых приёмниках. Безопасный приём из шпаргалки DOM — `textContent`, `insertAdjacentText`, `createTextNode` и установка `value` у поля формы. `innerHTML` — только после поддерживаемого санитайзера вроде DOMPurify. Шпаргалка AJAX говорит, что React, Vue, Angular и Svelte стандартизируют обновление DOM и всё равно требуют не пользоваться теми небезопасными API.

Знайте, где ваш фреймворк перестаёт защищать. Кодирование вывода и санитизация HTML закрывают пробел. Держите пакеты фреймворка актуальными. Политика содержимого по-прежнему ограничивает, какие сценарии браузер выполнит, если приёмник использован неверно.""",
"""elem.textContent = untrusted;
""",
[
("OWASP Cross Site Scripting Prevention Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html"),
("OWASP DOM based XSS Prevention Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html"),
("OWASP AJAX Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/AJAX_Security_Cheat_Sheet.html"),
],
en_w="""Use the framework's default template binding for text. Step outside it only to render HTML you have sanitized, and keep that path small and reviewed.""",
ru_w="""Для текста используйте обычную привязку шаблона фреймворка. Выходите за неё только чтобы показать HTML, который вы санитизировали, и держите этот путь маленьким и просмотренным.""",
lang="javascript",
)

add(
"How do mobile web applications pose unique security challenges?",
"""OWASP's mobile sheet says mobile development has security problems that web applications do not share in the same way. The app binary, the device store, backups, screenshots, and deep links sit on a device the developer does not control. A patch also reaches users late, because of store review and because people update on their own schedule.""",
"""Do not trust the client. Authenticate and authorize on the server, and load sensitive data only after that succeeds. Do not store the user's password on the device; use a revocable token in platform storage (Keychain on iOS, Keystore on Android). Encrypt data at rest with platform APIs and hardware-backed keys when they exist. Assume the network can be read: use HTTPS, do not disable certificate checks, and consider pinning only after reading the pinning sheet's trade-offs.

Deep links, widgets, Shortcuts, and Siri can open a function while the device is locked. Require device authentication for those sensitive actions and still enforce the app session. Plan a forced update when a fix cannot wait for voluntary installs.""",
"""Мобильная шпаргалка OWASP говорит, что у мобильной разработки есть проблемы безопасности, которых у веб-приложений в том же виде нет. Двоичный файл, хранилище устройства, резервные копии, снимки экрана и глубокие ссылки лежат на устройстве, которым разработчик не управляет. Исправление тоже доходит до пользователей с задержкой из-за проверки магазина и потому что люди обновляются по своему графику.""",
"""Не доверяйте клиенту. Аутентифицируйте и авторизуйте на сервере и загружайте чувствительные данные только после успеха. Не храните пароль пользователя на устройстве; используйте отзывной токен в хранилище платформы (Keychain на iOS, Keystore на Android). Шифруйте данные при хранении API платформы и аппаратными ключами, когда они есть. Считайте, что сеть могут прочитать: используйте HTTPS, не отключайте проверку сертификата и рассматривайте pinning только после компромиссов из шпаргалки pinning.

Глубокие ссылки, виджеты, Shortcuts и Siri могут открыть функцию при заблокированном устройстве. Требуйте аутентификацию устройства для этих чувствительных действий и всё равно проверяйте сеанс приложения. Планируйте принудительное обновление, когда исправление не может ждать добровольной установки.""",
"""# Sensitive App Intents: require unlock. This is not a substitute for the server session.
authenticationPolicy = .requiresLocalDeviceAuthentication
""",
[
("OWASP Mobile Application Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What steps can be taken to secure mobile APIs and services?",
"""The mobile sheet's secure-API guidance is to communicate with backend services securely, use OAuth 2, JWT, or a similar mechanism, and rotate API keys and tokens. The same sheet says authentication and authorization decisions are made on the server.""",
"""Use HTTPS for every call. Do not override certificate validation to accept an invalid certificate. Prefer certificates from a trusted CA and strong cipher suites. Do not hard-code credentials in the app. Store tokens in platform secure storage, handle expiry, and time out idle sessions. Offer remote logout. Require the user to authenticate again for a password change or a payment update.

An API key in the binary is not access control for sensitive data. The REST sheet says API keys can limit farming and still must not be the only control on high-value resources. Return `429 Too Many Requests` when calls arrive too quickly, and revoke a key that breaks the usage agreement.""",
"""Руководство мобильной шпаргалки по безопасным API — безопасно общаться с серверными службами, использовать OAuth 2, JWT или похожий механизм и ротировать ключи и токены API. Та же шпаргалка говорит, что решения об аутентификации и авторизации принимаются на сервере.""",
"""Используйте HTTPS для каждого вызова. Не отключайте проверку сертификата, чтобы принять недействительный сертификат. Предпочитайте сертификаты доверенного CA и стойкие наборы шифров. Не зашивайте учётные данные в приложение. Храните токены в безопасном хранилище платформы, обрабатывайте истечение срока и завершайте простой сеанса. Дайте удалённый выход. Требуйте повторную аутентификацию для смены пароля или обновления оплаты.

Ключ API в двоичном файле — не контроль доступа к чувствительным данным. Шпаргалка REST говорит, что ключи API могут ограничить сбор данных и всё равно не должны быть единственным контролем ценных ресурсов. Возвращайте `429 Too Many Requests`, когда вызовы приходят слишком часто, и отзывайте ключ, который нарушает соглашение об использовании.""",
"""Authorization: Bearer <access-token>
""",
[
("OWASP Mobile Application Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html"),
("OWASP REST Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html"),
],
lang="http",
)

add(
"Discuss the security implications of third-party libraries in mobile web app development.",
"""The mobile sheet treats third-party libraries as a supply-chain unknown. Its controls are to sign the app, use only trusted and validated components, control updates and releases, and watch those products for security incidents. The vulnerable-dependency sheet, which it links, is the follow-up when a notice arrives.""",
"""Keep libraries current; the sheet lists that as its own testing item. Audit dependencies rather than waiting for a release week. Pin versions so a build does not silently move. Sign release artifacts so an update is the one you built.

A library runs with the app's permissions and can read what the app stores. Request only the device and backend permissions the feature needs. Do not add a component whose maintainer you cannot identify.""",
"""Мобильная шпаргалка считает сторонние библиотеки неизвестностью цепочки поставки. Её контроли: подписывать приложение, брать только доверенные и проверенные компоненты, контролировать обновления и выпуски и следить за инцидентами этих продуктов. Шпаргалка уязвимых зависимостей, на которую она ссылается, — продолжение, когда приходит извещение.""",
"""Держите библиотеки актуальными; шпаргалка выделяет это отдельным пунктом тестирования. Проверяйте зависимости, а не ждите недели выпуска. Фиксируйте версии, чтобы сборка не сдвинулась молча. Подписывайте артефакты выпуска, чтобы обновление было тем, которое вы собрали.

Библиотека работает с правами приложения и может читать то, что приложение хранит. Запрашивайте только права устройства и сервера, которые нужны функции. Не добавляйте компонент, чей сопровождающий вам неизвестен.""",
"""# Audit third-party components from the start of the project.
# Prefer a maintained library and pin the version you reviewed.
""",
[
("OWASP Mobile Application Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html"),
("OWASP Vulnerable Dependency Management Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What are common vulnerabilities found in mobile web applications?",
"""The mobile sheet groups the failures it wants developers to close: trusting the client, storing passwords or hard-coded secrets on the device, sending data without HTTPS, turning off certificate checks, leaking data through logs, caches, and snapshots, and opening sensitive screens from a deep link or a lock-screen widget without an authentication check.""",
"""Perform authentication and authorization on the server and repeat any client check there. Use platform secure storage. Do not put secrets in `plist` files or in Android `SharedPreferences`. Minimize PII, expire it, and ask consent. Mask sensitive fields on screen. Validate input and validate output.

Disable debugging on release builds, verify the app signature, and do not treat obfuscation as the access check. The sheet also says usable security matters: controls people cannot use get worked around. Give a fallback such as a PIN next to biometrics, and do not allow a 4-digit PIN.""",
"""Мобильная шпаргалка группирует сбои, которые она просит закрыть: доверие клиенту, хранение паролей или зашитых секретов на устройстве, передача данных без HTTPS, отключение проверки сертификата, утечка данных через журналы, кэши и снимки и открытие чувствительных экранов из глубокой ссылки или виджета на экране блокировки без проверки аутентификации.""",
"""Выполняйте аутентификацию и авторизацию на сервере и повторяйте там любую клиентскую проверку. Используйте безопасное хранилище платформы. Не кладите секреты в файлы `plist` или в Android `SharedPreferences`. Уменьшайте PII, задавайте срок и спрашивайте согласие. Маскируйте чувствительные поля на экране. Проверяйте ввод и проверяйте вывод.

Отключайте отладку в выпускаемых сборках, проверяйте подпись приложения и не считайте обфускацию проверкой доступа. Шпаргалка также говорит, что удобство безопасности важно: контроли, которыми люди не могут пользоваться, обходят. Дайте запасной путь вроде PIN рядом с биометрией и не разрешайте PIN из 4 цифр.""",
"""# Do not store the account password on the device.
# Store a revocable token in Keychain or Keystore.
""",
[
("OWASP Mobile Application Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html"),
],
lang="text",
)

add(
"How does server hardening affect web security?",
"""Hardening removes defaults that advertise or over-privilege the host. The TLS sheet says to disable SSL and TLS 1.0 and 1.1, default to TLS 1.3, keep TLS 1.2 only for compatibility, disable null, anonymous, and export ciphers, and patch the TLS library. The .NET sheet removes the server version header and `X-Powered-By`. The Docker sheet requires a `USER` directive and pinned base-image versions.""",
"""After the configuration change, test it. The TLS sheet points at the OWASP Testing Guide chapter on SSL/TLS testing and at external checkers such as SSL Labs. Protect the private key with filesystem permissions. Certificates should hash with SHA-256, not MD5 or SHA-1, and the name belongs in `subjectAlternativeName`.

A hardened host still runs the application. Parameterized queries, authorization, and secure cookies remain application work. Network segmentation keeps that host from reaching zones it does not serve.""",
"""Укрепление убирает значения по умолчанию, которые рекламируют узел или дают ему лишние права. Шпаргалка TLS велит отключить SSL и TLS 1.0 и 1.1, по умолчанию использовать TLS 1.3, оставлять TLS 1.2 только для совместимости, отключить null, анонимные и export-шифры и обновлять библиотеку TLS. Шпаргалка .NET убирает заголовок версии сервера и `X-Powered-By`. Шпаргалка Docker требует директиву `USER` и зафиксированные версии базового образа.""",
"""После изменения конфигурации проверьте её. Шпаргалка TLS отсылает к главе OWASP Testing Guide о проверке SSL/TLS и к внешним проверкам вроде SSL Labs. Защитите закрытый ключ правами файловой системы. Сертификаты должны хешировать SHA-256, а не MD5 или SHA-1, и имя должно быть в `subjectAlternativeName`.

Укреплённый узел всё равно выполняет приложение. Параметризованные запросы, авторизация и безопасные cookie остаются работой приложения. Сегментация сети не даёт этому узлу достигать зон, которые он не обслуживает.""",
"""USER app
""",
[
("OWASP Transport Layer Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html"),
("OWASP Docker Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html"),
("OWASP .NET Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/DotNet_Security_Cheat_Sheet.html"),
],
lang="dockerfile",
)

add(
"Explain the importance of patch management in maintaining web security.",
"""A missing patch leaves a known flaw in a library, a container image, or the TLS stack. The TLS sheet says SSL and TLS libraries must be kept up to date, citing historical library flaws such as Heartbleed. The mobile sheet adds that a released mobile patch still waits on store review and on the user to install it, so you need a way to require an update.""",
"""Inventory dependencies from the start of the project and scan them in CI, which is the vulnerable-dependency and Docker guidance. Subscribe to vendor alerts so a notice arrives with patch data. When a fix is not in production yet, a virtual patch on a device that sees the traffic can block recognized attempts; it does not remove the flaw, and the code or image update still has to ship.

Record the identifier, the affected versions, and whether your configuration can hit the issue. Retire the temporary rule after the real fix is deployed.""",
"""Пропущенное исправление оставляет известный недостаток в библиотеке, образе контейнера или стеке TLS. Шпаргалка TLS говорит, что библиотеки SSL и TLS надо держать актуальными, и приводит исторические недостатки библиотек вроде Heartbleed. Мобильная шпаргалка добавляет, что выпущенное мобильное исправление всё ещё ждёт проверки магазина и установки пользователем, поэтому нужен способ потребовать обновление.""",
"""Инвентаризируйте зависимости с начала проекта и сканируйте их в CI — это рекомендации шпаргалок уязвимых зависимостей и Docker. Подпишитесь на оповещения поставщиков, чтобы извещение приходило вместе с данными об исправлении. Пока исправление не в production, виртуальный патч на устройстве, которое видит трафик, может блокировать узнанные попытки; недостаток он не устраняет, и обновление кода или образа всё равно надо выпустить.

Запишите идентификатор, затронутые версии и может ли ваша конфигурация попасть в проблему. Снимите временное правило после развёртывания настоящего исправления.""",
"""# Scan the image in CI. Push it only when the scan is clean.
""",
[
("OWASP Transport Layer Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html"),
("OWASP Vulnerable Dependency Management Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html"),
("OWASP Virtual Patching Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Virtual_Patching_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What is network segmentation, and how can it improve security for web applications?",
"""OWASP's network-segmentation sheet describes a three-layer layout. The front-end zone holds the load balancer, an application-layer firewall, the web server, and the web cache. Middleware holds applications that talk to each other. The back-end zone holds databases, directory services, and log servers.""",
"""An edge firewall can split a DMZ for Internet-facing services, protected by a WAF, from a segment that may call out but is not reachable from the Internet. Write the allowed paths: a front end reaches its application tier, and that tier reaches its own database. A front end does not reach another system's database.

Segmentation fails closed only while the firewall is the place a packet must cross. If many applications share one network and a balancer is the only door, the sheet says access control between those applications has moved to layer 7 on the balancer. Application authorization is still required on each request.""",
"""Шпаргалка OWASP по сегментации сети описывает трёхслойную схему. Фронтенд-зона держит балансировщик, экран прикладного уровня, веб-сервер и веб-кэш. Middleware держит приложения, которые общаются друг с другом. Backend держит базы, службы каталогов и серверы журналов.""",
"""Пограничный экран может отделить DMZ для служб из интернета, защищённых WAF, от сегмента, который может вызывать наружу, но недоступен из интернета. Запишите разрешённые пути: фронтенд достигает своего уровня приложений, а тот — своей базы. Фронтенд не достигает чужой базы.

Сегментация закрывает доступ, только пока пакет обязан пройти экран. Если много приложений делят одну сеть и единственная дверь — балансировщик, шпаргалка говорит, что контроль доступа между этими приложениями переехал на 7-й уровень балансировщика. Авторизация приложения всё равно нужна на каждый запрос.""",
"""# FRONTEND: balancer, application-layer firewall, web server, cache.
# MIDDLEWARE: applications. BACKEND: databases, directory, logs.
""",
[
("OWASP Network Segmentation Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Network_Segmentation_Cheat_Sheet.html"),
],
lang="text",
)

add(
"Describe how load balancers can be configured to improve web application security.",
"""In the segmentation sheet the load balancer sits in the front-end zone with the application-layer firewall, the web server, and the cache. When several applications share one network, the sheet says you open one port to that network and balance, for example, on HTTP request parameters. The balancer is then the only incoming door.""",
"""That design concentrates entry, which is useful, and it also means segmentation between those applications no longer happens in the firewall. The sheet says that control is then performed at layer 7 by the balancer. Put a WAF on that entry when the cloud sheet's guidance applies, and still authorize every request in application code.

Do not treat the balancer as the session or the permission system. REST endpoints remain stateless and check the caller. Health checks and management ports stay off the public interface.""",
"""В шпаргалке сегментации балансировщик стоит во фронтенд-зоне вместе с экраном прикладного уровня, веб-сервером и кэшем. Когда несколько приложений делят одну сеть, шпаргалка говорит открыть в эту сеть один порт и балансировать, например, по параметрам HTTP-запроса. Балансировщик тогда — единственная входящая дверь.""",
"""Такая схема собирает вход в одну точку, и это полезно, и она же означает, что сегментация между этими приложениями больше не происходит на экране. Шпаргалка говорит, что контроль тогда выполняется на 7-м уровне балансировщиком. Поставьте WAF на этот вход, когда действует облачная шпаргалка, и всё равно авторизуйте каждый запрос в коде приложения.

Не считайте балансировщик сеансом или системой прав. Конечные точки REST остаются без состояния сеанса и проверяют вызывающего. Проверки здоровья и порты управления не выставляйте на публичный интерфейс.""",
"""# One incoming port to the network, then balance on HTTP request parameters.
# Authorization for each application still runs behind the balancer.
""",
[
("OWASP Network Segmentation Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Network_Segmentation_Cheat_Sheet.html"),
("OWASP Secure Cloud Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Cloud_Architecture_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What is the difference between symmetric and asymmetric encryption, and how are they used in web security?",
"""OWASP's key-management sheet, citing NIST SP 800-57 Part 1, separates algorithms by how many keys they use. A symmetric algorithm uses the same secret key for an operation and its inverse, such as encryption and decryption. An asymmetric algorithm uses a key pair: a public key anyone may know, and a private key that stays with the owner. Knowledge of the public key does not reveal the private key.""",
"""Symmetric keys provide confidentiality and also message authentication codes. The .NET and Java sheets show AES-GCM with a 256-bit key and a 12-byte nonce that must be unique for every encryption under that key. Asymmetric algorithms in the key-management sheet are used to compute digital signatures and to establish keying material. TLS uses both: the sheet's AEAD suites (AES-GCM or ChaCha20-Poly1305 on TLS 1.3) protect the records, and the certificate's public key lets the client authenticate the server.

Do not write your own cryptographic functions. The Java sheet says to prefer a maintained library or a cloud key service. Passwords are not encrypted with a reversible symmetric cipher; use a password hash.""",
"""Шпаргалка управления ключами OWASP, со ссылкой на NIST SP 800-57 Part 1, делит алгоритмы по числу ключей. Симметричный алгоритм использует один и тот же секретный ключ для операции и обратной к ней, например шифрования и расшифрования. Асимметричный использует пару: открытый ключ, который может знать кто угодно, и закрытый, который остаётся у владельца. Знание открытого ключа не раскрывает закрытый.""",
"""Симметричные ключи дают конфиденциальность и также коды аутентификации сообщения. Шпаргалки .NET и Java показывают AES-GCM с ключом 256 бит и nonce в 12 байт, уникальным для каждого шифрования этим ключом. Асимметричные алгоритмы в шпаргалке ключей используют, чтобы считать цифровые подписи и устанавливать ключевой материал. TLS использует оба: наборы AEAD из шпаргалки (AES-GCM или ChaCha20-Poly1305 в TLS 1.3) защищают записи, а открытый ключ сертификата позволяет клиенту аутентифицировать сервер.

Не пишите свои криптографические функции. Шпаргалка Java велит предпочесть поддерживаемую библиотеку или облачную службу ключей. Пароли не шифруют обратимым симметричным шифром; используйте хеш пароля.""",
"""// AES-GCM: 32-byte key, 12-byte nonce, a new nonce for every encryption.
var key = new byte[32];
var nonce = new byte[12];
""",
[
("OWASP Key Management Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html"),
("OWASP .NET Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/DotNet_Security_Cheat_Sheet.html"),
("OWASP Transport Layer Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html"),
],
en_w="""Use a symmetric AEAD cipher for bulk data once a secret key exists. Use the asymmetric key pair to sign, or to agree that secret key. Use a password hash for passwords.""",
ru_w="""Симметричный AEAD-шифр — для больших данных, когда секретный ключ уже есть. Пара асимметричных ключей — чтобы подписать или согласовать этот секрет. Для паролей — хеш пароля.""",
lang="csharp",
)

add(
"Explain the role of digital signatures in maintaining web security.",
"""The key-management sheet says asymmetric algorithms are used to compute digital signatures, and that hash functions compress messages for signature generation and verification. It cites FIPS 186 for digital signature algorithms. A signature lets a verifier check integrity and origin with the public key. It does not hide the message.""",
"""The private key stays with the owner. The public key may be known by anyone, so the verifier still needs a reason to believe that key belongs to the named party. That binding is the certificate, described in the TLS sheet: the name is in `subjectAlternativeName`, and the hash is SHA-256 rather than MD5 or SHA-1.

On an API, the REST sheet prefers a signature over a MAC for JWT integrity. With a MAC, every service that can check the token can also mint one with the same key. Verify `iss`, `aud`, and `exp`, and do not take the algorithm from the token header.""",
"""Шпаргалка управления ключами говорит, что асимметричные алгоритмы используют для вычисления цифровых подписей, а хеш-функции сжимают сообщения для создания и проверки подписи. Она ссылается на FIPS 186 для алгоритмов цифровой подписи. Подпись позволяет проверяющему сверить целостность и происхождение открытым ключом. Сообщение она не скрывает.""",
"""Закрытый ключ остаётся у владельца. Открытый ключ может знать кто угодно, поэтому проверяющему всё ещё нужно основание верить, что ключ принадлежит названной стороне. Эта привязка — сертификат из шпаргалки TLS: имя в `subjectAlternativeName`, а хеш — SHA-256, а не MD5 или SHA-1.

На API шпаргалка REST предпочитает подпись MAC для целостности JWT. С MAC каждая служба, которая может проверить токен, может и выпустить его тем же ключом. Проверяйте `iss`, `aud` и `exp` и не берите алгоритм из заголовка токена.""",
"""# Verify the JWT with the key you configured.
# Require iss, aud, and exp. Ignore alg from the token header.
""",
[
("OWASP Key Management Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html"),
("OWASP REST Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html"),
("OWASP Transport Layer Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What is a cryptographic hash function, and where is it used in web security?",
"""The key-management sheet, citing NIST SP 800-57, says a cryptographic hash takes a possibly large input and produces a relatively small digest that is fundamentally hard to reverse: it is hard to find an input that yields a given output. Hash functions do not use a key. Approved hash functions are defined in FIPS 180. The same section says many cryptographic schemes use a hash as a component.""",
"""The sheet lists the uses: data authentication and integrity when the hash is keyed into a MAC, compressing a message before a digital signature, deriving keys, and deterministic random numbers. TLS certificates should use SHA-256 rather than MD5 or SHA-1.

A password is a special case. The cryptographic-storage sheet says passwords must not be stored with reversible encryption; use a password hashing algorithm from the password-storage sheet. A fast hash such as the one inside a signature is the wrong tool for a password.""",
"""Шпаргалка управления ключами, со ссылкой на NIST SP 800-57, говорит, что криптографический хеш берёт возможно большой вход и даёт сравнительно маленький дайджест, который принципиально трудно обратить: трудно найти вход, дающий заданный выход. Хеш-функции не используют ключ. Одобренные хеш-функции заданы в FIPS 180. Тот же раздел говорит, что многие криптосхемы используют хеш как компонент.""",
"""Шпаргалка перечисляет применения: аутентификация и целостность данных, когда хеш входит в MAC с ключом, сжатие сообщения перед цифровой подписью, вывод ключей и детерминированные случайные числа. Сертификаты TLS должны использовать SHA-256, а не MD5 или SHA-1.

Пароль — особый случай. Шпаргалка криптохранилища говорит, что пароли нельзя хранить обратимым шифрованием; используйте алгоритм хеширования паролей из шпаргалки хранения паролей. Быстрый хеш, какой стоит внутри подписи, — неверный инструмент для пароля.""",
"""# Certificate hashing algorithm: SHA-256.
# Passwords: a password hash, not this digest.
""",
[
("OWASP Key Management Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html"),
("OWASP Cryptographic Storage Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html"),
("OWASP Transport Layer Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html"),
],
en_w="""Use a hash inside signatures, MACs, and certificate fingerprints. Use a slow password hash when the secret is a password a person chose.""",
ru_w="""Хеш — внутри подписей, MAC и отпечатков сертификатов. Медленный хеш пароля — когда секрет выбрал человек.""",
lang="text",
)

add(
"How can Public Key Infrastructure (PKI) be used to secure web applications?",
"""The TLS sheet says a correctly implemented TLS session lets the client confirm it is connected to the legitimate server. The client's identity is not verified unless client certificates are used. The key-management sheet lists trusted certificates and trust anchors as the keys that authenticate an end device. A certificate binds the public key to a name the verifier can check.""",
"""Put the fully qualified name in `subjectAlternativeName`. Modern Chrome ignores `commonName` alone; keep the primary name in the CN as well for compatibility. Use RSA keys of at least 2048 bits, SHA-256, and protect the private key with filesystem permissions and administrative controls. Do not put internal names or IP addresses on a certificate that faces the Internet. Avoid a wildcard shared across different trust levels; the TLS sheet says a wildcard violates least privilege because one key is then valid for every subdomain.

For a highly privileged REST service, the REST sheet says to consider mutually authenticated client certificates in addition to HTTPS. Store keys in an HSM or a key vault when you have one, which is the cryptographic-storage guidance.""",
"""Шпаргалка TLS говорит, что правильно выполненный сеанс TLS позволяет клиенту убедиться, что он подключён к настоящему серверу. Личность клиента не проверяется, если не используются клиентские сертификаты. Шпаргалка ключей перечисляет доверенные сертификаты и якоря доверия как ключи, которые аутентифицируют конечное устройство. Сертификат связывает открытый ключ с именем, которое проверяющий может сверить.""",
"""Поместите полное доменное имя в `subjectAlternativeName`. Современный Chrome игнорирует один `commonName`; для совместимости держите основное имя ещё и в CN. Используйте ключи RSA не короче 2048 бит, SHA-256 и защищайте закрытый ключ правами файловой системы и организационными контролями. Не помещайте внутренние имена или IP-адреса на сертификат, который смотрит в интернет. Не делите wildcard между разными уровнями доверия; шпаргалка TLS говорит, что wildcard нарушает наименьшие привилегии, потому что один ключ тогда действителен для каждого поддомена.

Для очень привилегированной службы REST шпаргалка REST предлагает рассмотреть взаимно аутентифицированные клиентские сертификаты вдобавок к HTTPS. Храните ключи в HSM или в хранилище ключей, когда оно есть — это рекомендация шпаргалки криптохранилища.""",
"""# SAN holds the FQDN. Hash algorithm: SHA-256. RSA key: at least 2048 bits.
""",
[
("OWASP Transport Layer Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html"),
("OWASP Key Management Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html"),
("OWASP REST Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html"),
],
lang="text",
)

add(
"How does DevSecOps integrate security into the web development lifecycle?",
"""OWASP's guidance is to treat the pipeline as production. The GitHub Actions sheet says a CI/CD pipeline often holds sensitive credentials, so it needs threat modeling, secure review, security validation, and penetration testing, and it points at the CI/CD security cheat sheet. The Kubernetes sheet says the pipeline should vet code, scan the built image, and push to a private registry only when the assessment passes.""",
"""Fail the build when the scan fails, so a vulnerable image does not enter the registry. The Docker sheet adds lint in that pipeline: a `USER` directive, pinned base-image and package versions, and `COPY` rather than `ADD`. Sign images and keep the registry private.

Threat modeling is not a one-time gate. The threat-modeling sheet says to answer what you are working on, what can go wrong, what you will do about it, and whether you did a good enough job, and to update that model with the system.""",
"""Рекомендация OWASP — относиться к конвейеру как к production. Шпаргалка GitHub Actions говорит, что конвейер CI/CD часто держит чувствительные учётные данные, поэтому ему нужны моделирование угроз, безопасный просмотр, проверка безопасности и тест на проникновение, и отсылает к шпаргалке безопасности CI/CD. Шпаргалка Kubernetes говорит, что конвейер должен проверять код, сканировать собранный образ и отправлять в частный реестр только когда оценка пройдена.""",
"""Ломайте сборку, когда сканирование не прошло, чтобы уязвимый образ не попал в реестр. Шпаргалка Docker добавляет в этот конвейер линтер: директива `USER`, зафиксированные версии базового образа и пакетов и `COPY` вместо `ADD`. Подписывайте образы и держите реестр частным.

Моделирование угроз — не разовый шлагбаум. Шпаргалка моделирования угроз велит ответить, над чем вы работаете, что может пойти не так, что вы с этим сделаете и достаточно ли хорошо вы это сделали, и обновлять эту модель вместе с системой.""",
"""# Scan the image after the build. Push only if the assessment passes.
""",
[
("OWASP CI CD Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html"),
("OWASP Kubernetes Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html"),
("OWASP Threat Modeling Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What are security Information and Event Management (SIEM) systems and their role in web security?",
"""A SIEM, or a log aggregator, is where security logs become something you can act on. OWASP's software supply-chain sheet says logging is not sufficient by itself and prefers a centralized SIEM or similar tool so the data is actionable. The logging sheet says application logs must record when, where, who, and what for each event.""",
"""Include the time, the application and its address, the user identity when it is known, the event type, the severity, and whether the action succeeded. Give related events one interaction identifier so a later reader does not have to reconstruct the request. Flag security events. Protect the logs from change.

Do not write secrets into that stream. Before you emit a log, remove fields such as passwords, API keys, and tokens. Authentication failures and authorization denials belong in the stream. A dashboard that nobody reviews is not monitoring.""",
"""SIEM или сборщик журналов — место, где журналы безопасности становятся тем, на что можно действовать. Шпаргалка OWASP по цепочке поставки ПО говорит, что одного журналирования недостаточно, и предпочитает централизованный SIEM или похожее средство, чтобы данные были пригодны к действию. Шпаргалка журналирования говорит, что журналы приложения должны записывать когда, где, кто и что для каждого события.""",
"""Включайте время, приложение и его адрес, личность пользователя, когда она известна, тип события, серьёзность и успех действия. Связанным событиям дайте один идентификатор взаимодействия, чтобы потом не собирать запрос заново. Помечайте события безопасности. Защитите журналы от изменения.

Не пишите секреты в этот поток. Перед записью уберите поля вроде паролей, ключей API и токенов. Неудачные аутентификации и отказы авторизации принадлежат потоку. Панель, которую никто не смотрит, — не наблюдение.""",
"""# Each security event: when, where, who, what. No passwords or tokens.
""",
[
("OWASP Logging Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"),
("OWASP Software Supply Chain Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html"),
],
lang="text",
)

add(
"How can containerization improve web security?",
"""A container can run as a non-root user, from a pinned base image, in a private registry that accepts only scanned images. OWASP's Docker sheet says the pipeline should check that a `USER` is set, that the base image and OS packages are pinned, and that `COPY` is used instead of `ADD`. The Kubernetes sheet says to start from a minimal verified base image and to keep approved images in a private registry.""",
"""Scan the image for known vulnerabilities, secrets, and misconfigurations before it is pushed. Sign it so the cluster can check what it runs. Publishing a port on all interfaces can skip a host firewall; bind to `127.0.0.1` when the port should stay local.

A container is not an authorization boundary for the application inside it. The process still needs least privilege, and the app still checks the caller.""",
"""Контейнер может работать не от root, с зафиксированного базового образа, в частном реестре, который принимает только просканированные образы. Шпаргалка Docker говорит, что конвейер должен проверить, что задан `USER`, что базовый образ и пакеты ОС зафиксированы и что используется `COPY`, а не `ADD`. Шпаргалка Kubernetes говорит начинать с минимального проверенного базового образа и держать одобренные образы в частном реестре.""",
"""Сканируйте образ на известные уязвимости, секреты и ошибки конфигурации до отправки. Подпишите его, чтобы кластер мог проверить, что он запускает. Публикация порта на всех интерфейсах может обойти хостовый экран; привязывайте к `127.0.0.1`, когда порт должен остаться локальным.

Контейнер — не граница авторизации для приложения внутри. Процессу всё ещё нужны наименьшие привилегии, а приложение всё ещё проверяет вызывающего.""",
"""USER app
""",
[
("OWASP Docker Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html"),
("OWASP Kubernetes Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html"),
],
en_w="""Use containers when you can pin the base image, scan it, and run it as a non-root user from a private registry. They do not replace application authorization.""",
ru_w="""Контейнеры уместны, когда вы фиксируете базовый образ, сканируете его и запускаете не от root из частного реестра. Авторизацию приложения они не заменяют.""",
lang="dockerfile",
)

add(
"Discuss the role of automated security pipelines in web application deployments.",
"""An automated pipeline is the place OWASP expects security checks to run on every build: lint, static analysis, dependency scanning, and container scanning. The Docker sheet lists those checks and names scanners such as Trivy and Grype. The Kubernetes sheet says a failed assessment must fail the pipeline so the image is not pushed.""",
"""Treat the pipeline definition as production code. It holds credentials, so protect it with the same review and threat model as the application, which is the GitHub Actions sheet's rule. Pin the tools. Do not print secrets into the job log.

A green pipeline shows the checks you encoded. It does not replace a human review of authorization and business rules, or a penetration test when the threat model says the automated result is not enough.""",
"""Автоматический конвейер — место, где OWASP ждёт проверки безопасности на каждой сборке: линтер, статический анализ, сканирование зависимостей и сканирование контейнеров. Шпаргалка Docker перечисляет эти проверки и называет сканеры вроде Trivy и Grype. Шпаргалка Kubernetes говорит, что неудачная оценка должна сломать конвейер, чтобы образ не был отправлен.""",
"""Считайте описание конвейера промышленным кодом. Оно держит учётные данные, поэтому защищайте его тем же просмотром и моделью угроз, что и приложение — это правило шпаргалки GitHub Actions. Фиксируйте версии средств. Не печатайте секреты в журнал задания.

Зелёный конвейер показывает проверки, которые вы закодировали. Он не заменяет человеческий просмотр авторизации и бизнес-правил или тест на проникновение, когда модель угроз говорит, что автоматического результата мало.""",
"""# Fail the job when the image scan reports a vulnerability you have not accepted.
""",
[
("OWASP Docker Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html"),
("OWASP Kubernetes Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html"),
("OWASP CI CD Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What are the primary concerns for REST API security?",
"""OWASP's REST sheet says a secure REST service provides only HTTPS endpoints, so credentials and tokens are protected in transit and the client can authenticate the service. Each non-public endpoint performs access control. The API is stateless: every call checks whether this caller may perform this operation. Passing session state from the client so the service can pretend to be stateless is called out as an anti-pattern.""",
"""Prefer an identity provider that issues access tokens, and let the endpoint decide locally. For a JWT, require a signature rather than a MAC when services must not share a minting key, reject `alg` of `none`, and validate `iss`, `aud`, and `exp`. Allow only the HTTP methods you documented and reject others with `405 Method not allowed`. Validate length, range, format, and type. Reject an oversized body with `413`. Require a supported `Content-Type` and reject others with `415`.

Return generic errors without stack traces. Audit security events. For browser clients send `Cache-Control: no-store`, `Content-Type`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, and `Content-Security-Policy: frame-ancestors 'none'`. Keep management endpoints off the Internet or behind multi-factor authentication and a restricted network.""",
"""Шпаргалка REST говорит, что безопасная служба REST предоставляет только конечные точки HTTPS, чтобы учётные данные и токены были защищены в пути и клиент мог аутентифицировать службу. Каждая непубличная точка выполняет контроль доступа. API без состояния сеанса: каждый вызов проверяет, может ли этот вызывающий выполнить эту операцию. Передача состояния сеанса с клиента, чтобы служба притворялась не имеющей состояния, названа антипаттерном.""",
"""Предпочитайте поставщика идентификации, который выдаёт access token, и пусть точка решает локально. Для JWT требуйте подпись, а не MAC, когда службы не должны делить ключ выпуска, отвергайте `alg` со значением `none` и проверяйте `iss`, `aud` и `exp`. Разрешайте только описанные методы HTTP и отвергайте остальные с `405 Method not allowed`. Проверяйте длину, диапазон, формат и тип. Слишком большое тело отвергайте с `413`. Требуйте поддерживаемый `Content-Type` и отвергайте остальные с `415`.

Возвращайте общие ошибки без стека вызовов. Ведите аудит событий безопасности. Для браузерных клиентов отправляйте `Cache-Control: no-store`, `Content-Type`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security` и `Content-Security-Policy: frame-ancestors 'none'`. Конечные точки управления не выставляйте в интернет или ставьте за многофакторную аутентификацию и ограниченную сеть.""",
"""Cache-Control: no-store
Content-Security-Policy: frame-ancestors 'none'
X-Content-Type-Options: nosniff
""",
[
("OWASP REST Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html"),
],
lang="http",
)

add(
"How does OAuth 2.0 provide secure delegated access?",
"""The REST sheet centralizes user authentication in an identity provider that issues access tokens, so each resource endpoint does not invent its own login. OAuth 2.0 is that delegation: the client receives an access token after the resource owner authorizes it, and the resource server accepts the token. The OWASP OAuth sheet's current grant is authorization code with PKCE.""",
"""Send the authorize request with `response_type=code`, a `code_challenge`, and `code_challenge_method=S256`. Do not use the implicit grant, which places the token in the URL fragment, or the resource-owner password grant, which gives the client the owner's password. Keep access tokens short-lived and audience-restricted. Prefer a sender-constrained token or rotate refresh tokens.

On the API, validate the token's integrity with your configured key, and check `iss`, `aud`, and `exp`. HTTPS is mandatory. The token is a bearer credential: protect it in storage and do not log it.""",
"""Шпаргалка REST собирает аутентификацию пользователя у поставщика идентификации, который выдаёт access token, чтобы каждая точка ресурса не изобретала свой вход. OAuth 2.0 — это делегирование: клиент получает access token после разрешения владельца ресурса, а сервер ресурсов принимает токен. Текущий grant в шпаргалке OAuth OWASP — authorization code с PKCE.""",
"""Отправляйте запрос authorize с `response_type=code`, `code_challenge` и `code_challenge_method=S256`. Не используйте implicit grant, который кладёт токен во фрагмент URL, и resource-owner password grant, который отдаёт клиенту пароль владельца. Держите access token короткоживущими и ограниченными аудиторией. Предпочитайте токен, привязанный к отправителю, или ротируйте refresh token.

На API проверяйте целостность токена настроенным ключом и сверяйте `iss`, `aud` и `exp`. HTTPS обязателен. Токен — bearer-учётные данные: защитите его в хранилище и не пишите в журнал.""",
"""GET /authorize?response_type=code&code_challenge=<S256>&code_challenge_method=S256
""",
[
("OWASP REST Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html"),
("OWASP OAuth2 Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html"),
],
en_w="""Use OAuth 2.0 when a client needs access to an API on a user's behalf. Use OpenID Connect when that client must also learn who the user is.""",
ru_w="""Используйте OAuth 2.0, когда клиенту нужен доступ к API от имени пользователя. OpenID Connect — когда этот клиент должен ещё узнать, кто пользователь.""",
lang="http",
)

add(
"What are best practices for securing GraphQL APIs?",
"""OWASP's GraphQL sheet says to validate all incoming data, limit expensive queries, enforce access control, and turn off insecure defaults such as introspection and GraphiQL on any public or production endpoint.""",
"""Authorize both edges and nodes, not only one of them. Resolvers are a place to check permission. Use allow-lists, GraphQL scalars and enums, and schemas for mutation input. Pass values to SQL through parameterized APIs. Do not let user input choose the host of an outbound request.

Unbounded depth or amount can exhaust the service. Set depth and amount limits, paginate, set timeouts, and consider a maximum query cost. Rate-limit per IP or per user. Disable introspection with a validation rule, and enable GraphiQL only outside production.""",
"""Шпаргалка GraphQL OWASP велит проверять все входящие данные, ограничивать дорогие запросы, применять контроль доступа и выключать небезопасные значения по умолчанию, такие как introspection и GraphiQL, на любой публичной или промышленной точке.""",
"""Авторизуйте и рёбра, и узлы, а не только одно из них. Резолверы — место проверки права. Используйте списки разрешённого, скаляры и enum GraphQL и схемы ввода мутаций. Передавайте значения в SQL через параметризованные API. Не позволяйте пользовательскому вводу выбирать хост исходящего запроса.

Неограниченная глубина или количество могут исчерпать службу. Задайте пределы глубины и количества, пагинацию, таймауты и рассмотрите максимальную стоимость запроса. Ограничивайте частоту по IP или по пользователю. Отключите introspection правилом проверки и включайте GraphiQL только вне production.""",
"""app.use('/graphql', graphqlHTTP({
  schema: MySessionAwareGraphQLSchema,
  validationRules: [NoIntrospection],
  graphiql: process.env.NODE_ENV === 'development',
}));
""",
[
("OWASP GraphQL Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html"),
],
lang="javascript",
)

add(
"How can webhooks be secured to ensure they are not exploited?",
"""A webhook is a server-to-server callback. OWASP's payment-gateway sheet says only those server-to-server callbacks should be trusted for a decision such as fulfilling an order, and that the callback's authenticity must be checked, for example with an HMAC or a secret token. The secrets sheet says never to send a secret in plaintext; use TLS.""",
"""Verify the signature with the secret you stored, using a constant-time compare. Check a unique transaction id and reject an expired or already used id so a repeated callback does not fulfill twice. Confirm the amount, currency, and order id on your server with the provider's API before you fulfill. Do not trust fields that arrived only because the user's browser was redirected.

Log callback attempts without the secret. Idempotency means a second delivery of the same event does not repeat the side effect.""",
"""Webhook — это обратный вызов от сервера к серверу. Шпаргалка OWASP по платёжному шлюзу говорит, что для решения вроде исполнения заказа следует доверять только таким вызовам между серверами и что подлинность вызова надо проверить, например HMAC или секретным токеном. Шпаргалка секретов говорит никогда не передавать секрет открытым текстом; используйте TLS.""",
"""Проверьте подпись сохранённым секретом, сравнением за постоянное время. Проверьте уникальный id транзакции и отвергните истёкший или уже использованный id, чтобы повторный вызов не исполнил заказ дважды. До исполнения подтвердите сумму, валюту и id заказа на своём сервере через API поставщика. Не доверяйте полям, которые пришли только потому, что браузер пользователя перенаправили.

Журналируйте попытки вызова без секрета. Идемпотентность значит, что вторая доставка того же события не повторяет побочный эффект.""",
"""# Accept the callback only over TLS.
# Check HMAC(secret, body) and a one-time transaction id before fulfillment.
""",
[
("OWASP Third Party Payment Gateway Integration Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Payment_Gateway_Integration_Cheat_Sheet.html"),
("OWASP Secrets Management Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html"),
],
lang="text",
)

add(
"Explain the significance of rate limiting in API security.",
"""Rate limiting caps how fast a client may call an API. The REST sheet says to return `429 Too Many Requests` when requests arrive too quickly, and that API keys can reduce the impact of denial of service without being the only control on sensitive data. The GraphQL sheet says to rate-limit per IP or per user so an expensive query cannot be repeated without bound.""",
"""Apply the limit before the expensive work. Count by a stable identity: the API key, the user, or the tenant, not only by an address that many people share. When you refuse, the multi-tenant sheet's example sends `429` and a `Retry-After` value. Revoke a key that violates the usage agreement.

A limit protects availability. It does not authenticate the caller or authorize the object. Keep those checks.""",
"""Ограничение частоты ставит предел тому, как быстро клиент может вызывать API. Шпаргалка REST велит возвращать `429 Too Many Requests`, когда запросы приходят слишком часто, и говорит, что ключи API могут снизить влияние отказа в обслуживании, не будучи единственным контролем чувствительных данных. Шпаргалка GraphQL велит ограничивать частоту по IP или по пользователю, чтобы дорогой запрос нельзя было повторять без предела.""",
"""Применяйте предел до дорогой работы. Считайте по устойчивой личности: ключ API, пользователь или арендатор, а не только по адресу, который делят многие люди. При отказе пример из шпаргалки нескольких арендаторов отправляет `429` и значение `Retry-After`. Отзывайте ключ, который нарушает соглашение об использовании.

Предел защищает доступность. Он не аутентифицирует вызывающего и не авторизует объект. Эти проверки оставляйте.""",
"""HTTP/1.1 429 Too Many Requests
Retry-After: 30
""",
[
("OWASP REST Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html"),
("OWASP GraphQL Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html"),
],
en_w="""Rate-limit public and authenticated APIs that do real work. Use a tighter limit on login and on unauthenticated calls than on a normal signed-in read.""",
ru_w="""Ограничивайте частоту публичных и аутентифицированных API, которые делают реальную работу. На вход и на неаутентифицированные вызовы ставьте более жёсткий предел, чем на обычное чтение вошедшего пользователя.""",
lang="http",
)

add(
"How do you foster a culture of security within a web development team?",
"""The threat-modeling sheet says modeling should be a normal step in the lifecycle, not an add-on, and that the model is updated with the system. The secure-product sheet says security decisions must be explicit. The mobile sheet says to make security a focus of code review, and that controls people cannot use will be worked around.""",
"""Give the team the four questions from the Threat Modeling Manifesto: what are we working on, what can go wrong, what will we do about it, and did we do a good enough job. Review permissions for privilege creep after release. Run `check --deploy` or the equivalent and treat warnings as work, not as noise.

Invite the people who operate the system into the review. Pair training with usable controls: MFA that can be enrolled, errors that do not dump secrets, and a place to report a suspected incident.""",
"""Шпаргалка моделирования угроз говорит, что моделирование должно быть обычным шагом жизненного цикла, а не довеском, и что модель обновляют вместе с системой. Шпаргалка безопасного продукта говорит, что решения по безопасности должны быть явными. Мобильная шпаргалка велит делать безопасность фокусом просмотра кода и говорит, что контроли, которыми люди не могут пользоваться, будут обходить.""",
"""Дайте команде четыре вопроса из Threat Modeling Manifesto: над чем мы работаем, что может пойти не так, что мы с этим сделаем и достаточно ли хорошо мы это сделали. После выпуска просматривайте права на расползание привилегий. Запускайте `check --deploy` или аналог и считайте предупреждения работой, а не шумом.

Приглашайте в просмотр людей, которые эксплуатируют систему. Совмещайте обучение с удобными контролями: MFA, которую можно подключить, ошибки, которые не вываливают секреты, и место, куда сообщить о подозреваемом инциденте.""",
"""# In design review: what can go wrong, and what will we do about it?
""",
[
("OWASP Threat Modeling Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"),
("OWASP Secure Product Design Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What should a web security policy include?",
"""A web security policy is the written set of decisions the product must meet. OWASP's secure-product sheet says products must meet the organization's security requirements and that those decisions must be explicit. The authorization sheet adds deny by default, least privilege, and a server-side check on every request.""",
"""State who may perform which operation on which resource, and that new routes are denied until a rule allows them. Require HTTPS, secure cookies, and password hashing for accounts. Require parameterized queries and output encoding. Say where secrets live: a vault or HSM, not the repository. Name the log events (authentication failures, authorization denials) and what must never be logged.

Include session idle and absolute timeouts, MFA for administrators, and how a lost device is signed out. Name the dependency and image scanning the pipeline must pass. A policy that is not tested is a wish; the authorization sheet says to test the permission map.""",
"""Политика веб-безопасности — записанный набор решений, которым продукт должен соответствовать. Шпаргалка безопасного продукта говорит, что продукты должны выполнять требования безопасности организации и что эти решения должны быть явными. Шпаргалка авторизации добавляет запрет по умолчанию, наименьшие привилегии и серверную проверку на каждый запрос.""",
"""Запишите, кто какую операцию с каким ресурсом может выполнять, и что новые маршруты запрещены, пока правило их не разрешит. Требуйте HTTPS, безопасные cookie и хеширование паролей учётных записей. Требуйте параметризованные запросы и кодирование вывода. Скажите, где живут секреты: в хранилище или HSM, не в репозитории. Назовите события журнала (неудачная аутентификация, отказ авторизации) и что нельзя журналировать никогда.

Включите idle и абсолютный таймауты сеанса, MFA для администраторов и как выходят с потерянного устройства. Назовите сканирование зависимостей и образов, которое конвейер должен пройти. Политика, которую не проверяют, — пожелание; шпаргалка авторизации велит тестировать карту прав.""",
"""# Deny by default. Every new route needs an explicit allow.
""",
[
("OWASP Secure Product Design Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html"),
("OWASP Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"),
],
lang="text",
)

add(
"Discuss the process of conducting a security risk assessment for web applications.",
"""OWASP's threat-modeling sheet defines a repeatable process: model the system from a security perspective, identify threats from that model, and decide the response. It should start in design and be updated as the system changes. The four questions are what you are working on, what can go wrong, what you will do about it, and whether the job was good enough.""",
"""Map trust boundaries, the kinds of users, the resources, and the operations on those resources. The authorization sheet says to decide, for each combination, which operations are allowed, then test that map. Prefer deny by default so an unmatched request is refused.

Record the result as work: a control, an accepted risk with an owner, or a change to the design. Revisit after deployment for privilege creep. Automated scans and a penetration test feed the same list; they do not replace the model of how the business process can be misused.""",
"""Шпаргалка моделирования угроз задаёт повторяемый процесс: смоделировать систему с точки зрения безопасности, выявить угрозы по этой модели и решить, какой будет ответ. Начинать надо в проектировании и обновлять модель, когда система меняется. Четыре вопроса: над чем вы работаете, что может пойти не так, что вы с этим сделаете и достаточно ли хорошо это сделано.""",
"""Нанесите границы доверия, виды пользователей, ресурсы и операции над этими ресурсами. Шпаргалка авторизации велит для каждой комбинации решить, какие операции разрешены, и затем проверить эту карту. Предпочитайте запрет по умолчанию, чтобы несовпавший запрос был отвергнут.

Запишите результат как работу: контроль, принятый риск с владельцем или изменение схемы. После развёртывания вернитесь к расползанию привилегий. Автоматические сканы и тест на проникновение питают тот же список; они не заменяют модель того, как бизнес-процесс можно использовать не по назначению.""",
"""# 1. What are we working on?
# 2. What can go wrong?
# 3. What will we do about it?
# 4. Did we do a good enough job?
""",
[
("OWASP Threat Modeling Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"),
("OWASP Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"),
],
lang="text",
)

add(
"How does change management impact web security?",
"""A change can add a route, a permission, or an image that nobody re-checked. The authorization sheet says to review permissions after deployment for privilege creep: current rights must not exceed the design plus formally approved changes. The Kubernetes sheet says only approved images are pushed to the private registry, and only after the pipeline's security assessment passes.""",
"""Treat the pipeline and the infrastructure definition as code that is reviewed. Pin image and package versions so a rebuild does not change them silently. A framework default can change underneath you; the authorization sheet says not to rely on a library's deny-by-default behavior without an explicit configuration.

Roll back a change that fails its security check. Temporary virtual patches are changes too: record them and remove them when the code fix ships.""",
"""Изменение может добавить маршрут, право или образ, которые никто не перепроверил. Шпаргалка авторизации велит после развёртывания просматривать права на расползание привилегий: текущие права не должны превышать проект плюс формально одобренные изменения. Шпаргалка Kubernetes говорит, что в частный реестр отправляют только одобренные образы и только после того, как оценка безопасности конвейера пройдена.""",
"""Считайте конвейер и описание инфраструктуры кодом, который просматривают. Фиксируйте версии образов и пакетов, чтобы пересборка не меняла их молча. Значение по умолчанию фреймворка может измениться под вами; шпаргалка авторизации велит не полагаться на запрет по умолчанию библиотеки без явной конфигурации.

Откатывайте изменение, которое не прошло проверку безопасности. Временные виртуальные патчи — тоже изменения: записывайте их и снимайте, когда выходит исправление кода.""",
"""# Ship the image only after the pipeline assessment passes.
# Review permissions against the approved set after release.
""",
[
("OWASP Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"),
("OWASP Kubernetes Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html"),
],
lang="text",
)

add(
"Why should a company have an established data breach response protocol?",
"""An incident that nobody has practiced becomes a scramble, and the logs that would explain it may not exist. The logging sheet says security events must be logged so they can be monitored and acted on. The mobile sheet lists an incident-response plan as its own operations item, next to monitoring. The supply-chain sheet says a centralized SIEM is preferred so those logs are actionable.""",
"""Decide in advance who is called, which tokens and keys can be revoked, and how users are told. Remote logout and session invalidation, from the mobile and session sheets, are the controls that limit a lost device or a stolen token. Do not put passwords or tokens in the ticket or the log while you investigate.

The protocol also drives preparation: audit logs before and after security events, generic errors that do not leak internals, and a way to patch or apply a temporary virtual patch while the code fix is built. Write the plan before you need it, and practice the first calls.""",
"""Инцидент, который никто не репетировал, превращается в суету, а журналов, которые его объяснили бы, может не быть. Шпаргалка журналирования говорит, что события безопасности надо записывать, чтобы их можно было наблюдать и на них действовать. Мобильная шпаргалка выделяет план реагирования на инцидент отдельным пунктом эксплуатации, рядом с наблюдением. Шпаргалка цепочки поставки предпочитает централизованный SIEM, чтобы эти журналы были пригодны к действию.""",
"""Заранее решите, кого вызывают, какие токены и ключи можно отозвать и как сообщают пользователям. Удалённый выход и инвалидация сеанса из мобильной шпаргалки и шпаргалки сеансов — контроли, которые ограничивают потерянное устройство или украденный токен. Не кладите пароли или токены в заявку или журнал, пока разбираетесь.

Протокол также задаёт подготовку: журналы аудита до и после событий безопасности, общие ошибки без утечки внутренностей и способ установить исправление или временный виртуальный патч, пока делают исправление кода. Напишите план до того, как он понадобится, и отрепетируйте первые звонки.""",
"""# Before the incident: log security events, name the on-call, know how to revoke a token.
""",
[
("OWASP Logging Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"),
("OWASP Mobile Application Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html"),
("OWASP Software Supply Chain Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What is the Secure Development Lifecycle (SDL) and its relevance to web security?",
"""OWASP ASVS section V1.1 names secure software development lifecycle requirements and points at the threat-modeling cheat sheet. That sheet says threat modeling belongs early, in design, and again whenever the system changes. It is a standard step, not an extra. The authorization sheet says least privilege is addressed throughout the lifecycle, not only at deployment.""",
"""In design, enumerate users, resources, and operations, and deny by default. In implementation, use the framework controls: parameterized queries, output encoding, CSRF on cookie paths, HTTPS, and password hashing. In the pipeline, scan dependencies and images and fail the build on a finding you have not accepted. In operation, log security events, review permissions for privilege creep, and keep the threat model current.

The four questions keep the loop short: what are we working on, what can go wrong, what will we do about it, and did we do a good enough job.""",
"""Раздел V1.1 OWASP ASVS называет требования безопасного жизненного цикла разработки ПО и отсылает к шпаргалке моделирования угроз. Та шпаргалка говорит, что моделирование угроз принадлежит ранней стадии, проектированию, и снова при каждом изменении системы. Это обычный шаг, не добавка. Шпаргалка авторизации говорит, что наименьшие привилегии рассматривают на всём жизненном цикле, а не только при развёртывании.""",
"""В проектировании перечислите пользователей, ресурсы и операции и запрещайте по умолчанию. В реализации используйте контроли фреймворка: параметризованные запросы, кодирование вывода, CSRF на путях с cookie, HTTPS и хеширование паролей. В конвейере сканируйте зависимости и образы и ломайте сборку на находке, которую вы не приняли. В эксплуатации журналируйте события безопасности, просматривайте права на расползание привилегий и держите модель угроз актуальной.

Четыре вопроса держат цикл коротким: над чем мы работаем, что может пойти не так, что мы с этим сделаем и достаточно ли хорошо мы это сделали.""",
"""# SDL: model in design, build the controls, scan in CI, review permissions after release.
""",
[
("OWASP Threat Modeling Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"),
("OWASP Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"),
],
lang="text",
)
