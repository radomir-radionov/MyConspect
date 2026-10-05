add(
"What is the difference between authentication and authorization?",
"""**Authentication** verifies that an entity is who it claims to be, using one or more authenticators such as a password, fingerprint, or security token. **Authorization** verifies that a requested action or service is approved for that entity. A person who has signed in is often still not allowed to perform every action the system can technically do.""",
"""OWASP treats the two checks as separate. Authentication establishes identity. Authorization then decides which operations that identity may perform, and some public resources are authorized without any login.

On the HTTP authentication framework, a failed or missing credential challenge uses `401` (Unauthorized) with `WWW-Authenticate`. Valid credentials that are still inadequate for the resource use `403` (Forbidden). The server may instead return `404` (Not Found) when it should not reveal that the resource exists.

Defenses: deny by default, enforce least privilege, and validate the permission on every request on the server, gateway, or serverless function. Client-side checks are only for the interface. When a check fails, stop in a safe state and do not leak logs or debug detail in the error.""",
"""**Аутентификация** проверяет, что субъект — тот, за кого себя выдаёт, с помощью одного или нескольких аутентификаторов: пароля, отпечатка или токена. **Авторизация** проверяет, что запрошенное действие или сервис этому субъекту разрешены. Вошедший пользователь часто всё равно не может выполнять все действия, которые система технически умеет.""",
"""OWASP разделяет эти проверки. Аутентификация устанавливает личность. Авторизация затем решает, какие операции этой личности доступны, а часть публичных ресурсов доступна и без входа.

В HTTP-фреймворке аутентификации неудачный или отсутствующий вызов учётных данных даёт `401` (Unauthorized) и заголовок `WWW-Authenticate`. Верные учётные данные, которых всё же недостаточно для ресурса, дают `403` (Forbidden). Сервер может вернуть `404` (Not Found), если не должен раскрывать существование ресурса.

Защита: запрет по умолчанию, наименьшие привилегии и проверка права на каждый запрос на сервере, шлюзе или serverless-функции. Проверки в браузере только для интерфейса. При отказе завершайте работу в безопасном состоянии и не отдавайте в ошибке журналы или отладочные данные.""",
"""HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic realm="Access to the staging site"
""",
[
("OWASP Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"),
("MDN — HTTP authentication", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication"),
],
en_w="""Authenticate when you must know who the caller is. Authorize on every protected operation after that, including public reads that are intentionally allowed without a login. Use `401` when the caller should try again with credentials, and `403` when this already-known caller must not have the resource.""",
ru_w="""Аутентифицируйте, когда нужно знать, кто вызывает. Авторизуйте каждую защищённую операцию после этого, включая намеренно публичное чтение без входа. `401` — когда вызывающему стоит повторить запрос с учётными данными, `403` — когда этот уже известный вызывающий не должен получить ресурс.""",
lang="http",
)

add(
"Explain basic authentication and its weaknesses.",
"""HTTP **Basic** authentication, defined in RFC 7617, sends a user id and password as a base64-encoded pair in the `Authorization` request header. Base64 is a reversible encoding, not encryption. The server challenges the client with `401` and a `WWW-Authenticate` header that names the scheme and a realm.""",
"""The browser usually prompts, then repeats the request with `Authorization: Basic` plus the encoded credentials. Those credentials are sent on later requests to that realm. MDN states that this is insecure unless the exchange is over HTTPS/TLS, because anyone who can read the bytes can recover the password.

Basic is also a weak fit for browser apps that change data: the user agent attaches the credentials regardless of which site triggered the request, so the site needs HTTPS, state-changing requests that are not simple cross-site GETs, and CSRF tokens. Without those controls, Basic should not protect sensitive or valuable information. Do not put the user id and password in the URL; modern browsers strip that form before the request is sent.""",
"""HTTP-схема **Basic** (RFC 7617) передаёт идентификатор и пароль парой в кодировке base64 в заголовке запроса `Authorization`. Base64 — обратимое кодирование, не шифрование. Сервер вызывает клиента ответом `401` и заголовком `WWW-Authenticate` со схемой и realm.""",
"""Браузер обычно показывает запрос пароля и повторяет запрос с `Authorization: Basic` и закодированными учётными данными. Они уходят и в следующих запросах к этому realm. MDN указывает, что схема небезопасна без HTTPS/TLS: кто прочитает байты, восстановит пароль.

Basic плохо подходит браузерным приложениям, которые меняют данные: агент прикладывает учётные данные независимо от того, какой сайт инициировал запрос, поэтому нужны HTTPS, изменяющие состояние запросы, которые не являются простыми межсайтовыми GET, и CSRF-токены. Без этих мер Basic не должен защищать чувствительную или ценную информацию. Не помещайте идентификатор и пароль в URL: современные браузеры вырезают такую форму до отправки.""",
"""WWW-Authenticate: Basic realm="Access to the staging site"
Authorization: Basic <base64 user-id:password>
""",
[
("MDN — HTTP authentication", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication"),
],
en_w="""Use Basic only for low-sensitivity access over TLS, or for a proxy challenge (`407`, `Proxy-Authenticate`, `Proxy-Authorization`). Prefer a modern authenticator, short-lived bearer or sender-constrained tokens, and server-side authorization for application data.""",
ru_w="""Используйте Basic только для малочувствительного доступа поверх TLS или для вызова прокси (`407`, `Proxy-Authenticate`, `Proxy-Authorization`). Для данных приложения предпочтительны современный аутентификатор, короткоживущие bearer- или sender-constrained токены и серверная авторизация.""",
lang="http",
)

add(
"What is OAuth, and how does it work?",
"""**OAuth 2.0** lets a client application access a protected resource on behalf of a resource owner, with that owner's authorization. An authorization server issues an access token after authenticating the resource owner and obtaining consent. The resource server accepts that token instead of learning every authentication scheme the owner might use.""",
"""The usual parties are the client, the resource owner (the end user when a person is granting access), the authorization server, and the resource server. Access tokens should be short-lived and audience-restricted, preferably to one resource server. Refresh tokens obtain new access tokens and should be sender-constrained (DPoP or mTLS) or rotated.

Current practice is the authorization code grant with PKCE (`response_type=code`) for every client type, including browser and native apps. The implicit grant (`response_type=token`) is deprecated by RFC 9700 and removed from OAuth 2.1 because it places access tokens in the URL fragment. Do not use the resource-owner password grant: it exposes the owner's credentials to the client. Clients must not forward the browser to an arbitrary URI from a query parameter. Authorization responses must not travel over unencrypted connections; `http` redirect URIs are limited to native loopback clients.""",
"""**OAuth 2.0** позволяет клиентскому приложению обращаться к защищённому ресурсу от имени владельца ресурса и с его разрешения. Сервер авторизации выдаёт access token после аутентификации владельца и получения согласия. Сервер ресурсов принимает этот токен и не обязан понимать все схемы аутентификации владельца.""",
"""Обычные стороны: клиент, владелец ресурса (конечный пользователь, если доступ даёт человек), сервер авторизации и сервер ресурсов. Access token должен быть короткоживущим и ограниченным аудиторией, лучше одним сервером ресурсов. Refresh token получает новые access token и должен быть привязан к отправителю (DPoP или mTLS) либо ротироваться.

Текущая практика — authorization code с PKCE (`response_type=code`) для всех типов клиентов, включая браузер и нативные приложения. Implicit grant (`response_type=token`) устарел по RFC 9700 и убран из OAuth 2.1, потому что кладёт access token во фрагмент URL. Не используйте resource-owner password grant: он раскрывает учётные данные владельца клиенту. Клиент не должен перенаправлять браузер на произвольный URI из query-параметра. Ответы авторизации не передают по незашифрованному соединению; redirect URI со схемой `http` допустим только для native loopback.""",
"""GET /authorize?response_type=code&client_id=app&code_challenge=<S256>&code_challenge_method=S256
""",
[
("OWASP OAuth2 Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html"),
],
en_w="""Use OAuth when a client needs delegated access to an API. Use OpenID Connect when the client must verify who the end user is. Add DPoP or mTLS when a leaked bearer token must not be replayable by itself, especially for sensitive or long-lived tokens.""",
ru_w="""Используйте OAuth, когда клиенту нужен делегированный доступ к API. OpenID Connect — когда клиент должен проверить, кто конечный пользователь. DPoP или mTLS — когда утёкший bearer-токен сам по себе не должен быть пригоден для повтора, особенно для чувствительных или долгоживущих токенов.""",
lang="http",
)

add(
"What is OpenID and how does it relate to web security?",
"""**OpenID Connect 1.0** is an identity layer on top of OAuth 2.0. It lets a relying party verify the end user's identity from an authentication performed by an authorization server, and obtain basic profile claims in an interoperable way. The ID token is a signed JWT. OWASP's guidance is to use OpenID Connect for authentication and single sign-on, and OAuth for authorization to APIs.""",
"""The client (relying party) starts at the authorization server and receives an ID token whose signature, issuer, and audience it must check. Access tokens for APIs still come from the token endpoint, not from the front channel. In OpenID Connect flows the `nonce` parameter provides CSRF protection; otherwise use a one-time `state` value bound to the user agent. PKCE remains required for the authorization code.

Tokens are bearer credentials: whoever holds one can present it. Send them only over TLS. Do not put them in browser `localStorage`. Prefer secure, HTTP-only cookies or the platform's secure storage, keep access tokens short-lived, and rotate refresh tokens. Because OpenID Connect removes user-managed passwords from the application, the application no longer stores those passwords; it must protect the tokens instead.""",
"""**OpenID Connect 1.0** — слой идентификации поверх OAuth 2.0. Он позволяет проверяющей стороне подтвердить личность конечного пользователя по аутентификации на сервере авторизации и получить базовые утверждения профиля совместимым способом. ID token — подписанный JWT. Рекомендация OWASP: OpenID Connect для аутентификации и единого входа, OAuth для авторизации к API.""",
"""Клиент (relying party) обращается к серверу авторизации и получает ID token, у которого нужно проверить подпись, издателя и аудиторию. Access token для API по-прежнему приходит с token endpoint, а не по фронт-каналу. В потоках OpenID Connect параметр `nonce` даёт защиту от CSRF; иначе используйте одноразовый `state`, привязанный к агенту пользователя. PKCE для authorization code остаётся обязательным.

Токены — bearer-учётные данные: кто держит токен, тот может его предъявить. Передавайте их только по TLS. Не кладите их в `localStorage` браузера. Предпочтительны безопасные HTTP-only cookie или защищённое хранилище платформы, короткие access token и ротация refresh token. Раз приложение больше не хранит пароли пользователей, защищать нужно токены.""",
"""GET /authorize?response_type=code&scope=openid&nonce=<transaction-specific>&code_challenge=<S256>&code_challenge_method=S256
""",
[
("OWASP OAuth2 Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html"),
("OWASP Authentication Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"),
],
en_w="""Choose OpenID Connect when the product needs login or SSO through an identity provider. Choose OAuth alone when the client is calling an API with a previously authorized grant and does not need an ID token.""",
ru_w="""Выбирайте OpenID Connect, когда продукту нужен вход или SSO через поставщика идентификации. Один OAuth — когда клиент вызывает API по уже выданному разрешению и ID token не нужен.""",
lang="http",
)

add(
"Can you describe Multi-Factor Authentication (MFA) and where it's used?",
"""**Multifactor authentication** requires evidence from at least two distinct factors: something you know, something you have, and something you are. Two passwords, or a password and a PIN, are the same factor and are not MFA. Location and other risk signals can inform a decision, but NIST guidance cited by OWASP says they do not substitute for a factor.""",
"""OWASP treats MFA as the strongest practical defense against account compromise that starts from a weak, reused, or stolen password, and recommends it for all users, with TOTP as an option users can turn on and a hard requirement for administrative accounts. The factors must be independent so one compromise does not yield both.

Require MFA at login and again for sensitive actions: changing the password, changing the email address, disabling MFA, or raising a session to an administrator. Every login path, including a separate API or a companion mobile app, needs the same bar. One-time passwords need a short lifetime, single use, a strict attempt limit, and invalidation after success. Do not log them or store them as long-term plaintext. Provide a secure reset path; a casual bypass becomes the weak factor.""",
"""**Многофакторная аутентификация** требует доказательств как минимум из двух разных факторов: знание, владение и биометрия. Два пароля или пароль и PIN — один и тот же фактор, это не MFA. Местоположение и другие сигналы риска могут влиять на решение, но по руководству NIST, на которое ссылается OWASP, они не заменяют фактор.""",
"""OWASP считает MFA самой сильной практической защитой от захвата учётной записи, который начинается со слабого, повторно использованного или украденного пароля, и рекомендует её всем пользователям, с возможностью включить TOTP и с обязательным требованием для администраторов. Факторы должны быть независимы, чтобы одна компрометация не давала оба.

Требуйте MFA при входе и снова для чувствительных действий: смена пароля, смена адреса почты, отключение MFA, повышение сеанса до администратора. Каждый путь входа, включая отдельный API или мобильное приложение, должен держать ту же планку. Одноразовые пароли: короткий срок, одно использование, жёсткий лимит попыток и инвалидация после успеха. Не пишите их в журнал и не храните долго в открытом виде. Дайте безопасный сброс; случайный обход становится слабым фактором.""",
"""# Distinct factors, not two secrets of the same kind.
know = password
have = totp  # short TTL, single use, attempt limit
""",
[
("OWASP Multifactor Authentication Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"),
],
en_w="""Require MFA for every interactive login when users can enroll a second factor, and always for administrators and for the sensitive account changes listed above. Offer TOTP rather than treating SMS as equivalent; the cheat sheet lists SMS and phone calls as restricted.""",
ru_w="""Требуйте MFA на каждый интерактивный вход, если пользователь может подключить второй фактор, и всегда для администраторов и для перечисленных чувствительных изменений учётной записи. Предлагайте TOTP; в шпаргалке SMS и телефонные звонки помечены как ограниченные.""",
lang="python",
)

add(
"What is JWT (JSON Web Tokens) and how are they used in authentication?",
"""A **JSON Web Token** (RFC 7519) is a compact, URL-safe way to carry claims between two parties. The claims are a JSON object used as the payload of a JSON Web Signature or as the plaintext of a JSON Web Encryption, so they can be signed, integrity-protected with a MAC, and/or encrypted. OWASP describes a signed JWT as a protected identity card: the issuer's signature stops a client from forging claims such as an administrator role.""",
"""A signed token is three base64url parts: protected header, claims, and signature. The signature is either a public-key signature or a MAC over a shared secret. Registered claims include `iss`, `sub`, `aud`, `exp`, `nbf`, `iat`, and `jti`.

In OpenID Connect the ID token is a JWT. In OAuth 2 an access token may be a JWT. A JWT is often suggested for stateless sessions; OWASP frowns on that use. The resource server must verify integrity and must not choose the algorithm from the token header, including `alg` of `none`. For API access tokens, require and check `iss`, `aud`, and `exp`. If the user logs out or an idle timeout ends the session before `exp`, place the server-issued `jti` (optionally with `aud`) on a denylist until the token expires. Prefer signatures over MACs when many services would otherwise share a key that can also mint tokens.""",
"""**JSON Web Token** (RFC 7519) — компактный URL-безопасный способ передать утверждения между двумя сторонами. Утверждения — JSON-объект: полезная нагрузка JSON Web Signature или открытый текст JSON Web Encryption, поэтому их можно подписать, защитить целостность с помощью MAC и/или зашифровать. OWASP описывает подписанный JWT как защищённое удостоверение: подпись издателя не даёт клиенту подделать утверждения, например роль администратора.""",
"""Подписанный токен — три части в base64url: защищённый заголовок, утверждения и подпись. Подпись — либо подпись на ключе пары, либо MAC на общем секрете. Зарегистрированные утверждения: `iss`, `sub`, `aud`, `exp`, `nbf`, `iat` и `jti`.

В OpenID Connect ID token — это JWT. В OAuth 2 access token может быть JWT. JWT часто предлагают для сеансов без состояния; OWASP такой приём не одобряет. Сервер ресурсов проверяет целостность и не выбирает алгоритм из заголовка токена, включая `alg` со значением `none`. Для access token API требуйте и проверяйте `iss`, `aud` и `exp`. Если пользователь вышел или idle timeout закончил сеанс раньше `exp`, поместите выданный сервером `jti` (при необходимости вместе с `aud`) в список запрета до истечения токена. Подписи предпочтительнее MAC, когда иначе много сервисов делят ключ, которым можно и выпускать токены.""",
"""# Signed JWT: base64url(header).base64url(claims).base64url(signature)
# Verify iss, aud, and exp with the key you configured — not with alg from the header.
""",
[
("RFC 7519 — JSON Web Token (JWT)", "https://www.rfc-editor.org/rfc/rfc7519.html"),
("OWASP JSON Web Token Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html"),
("OWASP REST Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html"),
],
en_w="""Use a signed JWT as an ID token or as an access token when the resource server can validate issuer, audience, and expiry. Do not use a long-lived JWT as the only session record if you must revoke access on logout or idle timeout; keep server-side invalidation for that case.""",
ru_w="""Используйте подписанный JWT как ID token или access token, если сервер ресурсов может проверить издателя, аудиторию и срок. Не делайте долгоживущий JWT единственной записью сеанса, если доступ нужно отзывать при выходе или idle timeout; для этого нужна серверная инвалидация.""",
lang="text",
)

add(
"How do you securely store user passwords?",
"""Store passwords with a slow, adaptive password hash, not with reversible encryption and not with a fast hash such as SHA-256. OWASP's order is Argon2id, then scrypt if Argon2id is unavailable, bcrypt only on legacy systems, and PBKDF2-HMAC-SHA-256 when FIPS 140 validation is required. Each password gets a unique salt so precomputed tables cannot match many users at once.""",
"""Argon2id minimums published on the cheat sheet include 19 MiB of memory, 2 iterations, and parallelism 1 (do not use that set with Argon2i). Bcrypt, when you must keep it, needs a work factor of at least 10 and a 72-byte password limit. PBKDF2-HMAC-SHA-256 needs at least 600,000 iterations. A pepper stored outside the password database, in a secrets vault or HSM, adds a hurdle when only the database is taken. Compare with the language's password verify function, or with a constant-time compare, and do not silently truncate.

You do not need to hide which modern algorithm you use. Re-hash on the next successful login when you raise the work factor. Transmit passwords only over TLS, on the login page and on later authenticated pages. Avoid periodic forced changes; rotate credentials when a leak is identified or the authenticator technology changes.""",
"""Храните пароли медленным адаптивным хешем, а не обратимым шифрованием и не быстрым хешем вроде SHA-256. Порядок OWASP: Argon2id, затем scrypt, если Argon2id недоступен, bcrypt только в унаследованных системах и PBKDF2-HMAC-SHA-256, когда нужна проверка FIPS 140. У каждого пароля свой salt, чтобы заранее посчитанные таблицы не подходили сразу многим пользователям.""",
"""Минимумы Argon2id в шпаргалке включают 19 МиБ памяти, 2 итерации и параллелизм 1 (этот набор не для Argon2i). Если bcrypt приходится оставить, work factor не ниже 10 и предел пароля 72 байта. PBKDF2-HMAC-SHA-256 — не меньше 600 000 итераций. Pepper вне базы паролей, в хранилище секретов или HSM, мешает, когда унесена только база. Сравнивайте функцией проверки пароля языка или сравнением за постоянное время и не обрезайте пароль молча.

Современный алгоритм можно не скрывать. При повышении work factor пересчитывайте хеш при следующем успешном входе. Передавайте пароли только по TLS, и на странице входа, и на следующих аутентифицированных страницах. Не заставляйте менять пароль по календарю; меняйте учётные данные, когда обнаружена утечка или сменилась технология аутентификатора.""",
"""# Legacy bcrypt only. Prefer Argon2id (19 MiB, t=2, p=1) when the library exists.
String hash = BCrypt.hashpw(password, BCrypt.gensalt(12));
""",
[
("OWASP Password Storage Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html"),
],
en_w="""Use Argon2id for new applications. Use scrypt where Argon2id is missing, PBKDF2 where a FIPS-validated implementation is mandatory, and bcrypt only while an older deployment cannot move yet.""",
ru_w="""Для новых приложений — Argon2id. scrypt — где нет Argon2id, PBKDF2 — где обязательна реализация с проверкой FIPS, bcrypt — только пока старое развёртывание ещё не перенесено.""",
lang="java",
)

add(
"What is Single Sign-On (SSO) and what are its benefits?",
"""**Single sign-on** lets a user authenticate once with an identity provider and then receive authentication and authorization assertions that relying applications accept. Two profiles OWASP documents for this are OpenID Connect (an identity layer on OAuth 2.0, with a signed ID token) and the SAML Web Browser SSO profile with Redirect/POST bindings.""",
"""The benefit is one authentication service that can require MFA, short-lived tokens, and a consistent account policy, instead of every application storing its own passwords. OWASP notes that OpenID Connect reduces password-related risk by moving authentication to an identity provider.

The relying party still has to check the assertion. For SAML, use TLS 1.2 for confidentiality and integrity in transit, require a digital signature with a certified key, and require the profile's data elements: the authentication request's ID and service provider, `InResponseTo` on the response, and an assertion signed with the identity provider's private key that names the client, the identity provider, and the service provider. Cookie-authenticated SSO paths still need CSRF protection; token-only APIs do not replace that on the cookie paths. Do not let the application's front end share an internal directory that is also used for unsecured public access.""",
"""**Единый вход** позволяет пользователю один раз аутентифицироваться у поставщика идентификации, после чего проверяющие приложения принимают утверждения об аутентификации и авторизации. Два профиля, которые описывает OWASP: OpenID Connect (слой идентификации на OAuth 2.0 с подписанным ID token) и профиль SAML Web Browser SSO со связываниями Redirect/POST.""",
"""Польза в одном сервисе аутентификации, который может требовать MFA, короткие токены и единую политику учётных записей, вместо хранения своих паролей в каждом приложении. OWASP отмечает, что OpenID Connect снижает риск, связанный с паролями, перенося аутентификацию к поставщику идентификации.

Проверяющая сторона всё равно обязана проверить утверждение. Для SAML используйте TLS 1.2 для конфиденциальности и целостности в пути, требуйте цифровую подпись сертифицированным ключом и элементы данных профиля: ID запроса аутентификации и поставщика услуг, `InResponseTo` в ответе и утверждение, подписанное закрытым ключом поставщика идентификации, с именами клиента, поставщика идентификации и поставщика услуг. Пути SSO на cookie по-прежнему нуждаются в защите от CSRF; API только с токенами эту защиту на cookie-путях не заменяют. Не отдавайте фронтенду тот же внутренний каталог, который используется для незащищённого публичного доступа.""",
"""# OpenID Connect: authenticate at the IdP, then accept a signed ID token.
# SAML: require InResponseTo and an assertion signed by the IdP.
""",
[
("OWASP SAML Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/SAML_Security_Cheat_Sheet.html"),
("OWASP OAuth2 Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html"),
],
en_w="""Use SSO when several applications should share one identity provider. Prefer OpenID Connect for new web and API login. Use SAML where an existing enterprise identity provider already speaks that profile, and validate every required element before creating a local session.""",
ru_w="""Используйте SSO, когда несколько приложений должны делить одного поставщика идентификации. Для нового входа в веб и API предпочтителен OpenID Connect. SAML — где существующий корпоративный поставщик уже говорит на этом профиле; проверяйте каждый обязательный элемент до создания локального сеанса.""",
lang="text",
)

add(
"Explain role-based access control (RBAC) and how it is implemented.",
"""**Role-based access control** grants or denies access from roles assigned to a user. Permissions attach to the role, and the user inherits the permissions of their roles. Users and roles are typically many-to-many, and roles may form a hierarchy. OWASP distinguishes this from attribute-based access control, which also considers subject, object, and environment attributes, and from relationship-based access control, which uses relationships between a user and an object.""",
"""Implement checks on the server for every request, with a default of deny. Map, during design, which role may perform which operation on which resource, then test that map. Review permissions after deployment so they do not creep past the approved set. Do not let the client be the place that decides.

OWASP prefers attribute- or relationship-based decisions for most application development because a role check is coarse: it struggles with object-level rules, many roles create a role explosion, and a chain of `hasAnyRole` calls is easy to get wrong. A role can still be one attribute inside an attribute-based policy. Keep identifiers from becoming the only control: even a hard-to-guess id needs an authorization check for that specific object.""",
"""**Ролевое управление доступом** разрешает или запрещает доступ по ролям пользователя. Права привязаны к роли, пользователь наследует права своих ролей. Связь пользователей и ролей обычно многие-ко-многим, роли могут образовывать иерархию. OWASP отличает это от доступа по атрибутам, который учитывает ещё атрибуты субъекта, объекта и среды, и от доступа по отношениям между пользователем и объектом.""",
"""Проверяйте права на сервере для каждого запроса и по умолчанию запрещайте. На этапе проектирования зафиксируйте, какая роль какую операцию с каким ресурсом может выполнять, и проверьте эту карту тестами. После развёртывания пересматривайте права, чтобы они не расползлись дальше одобренного набора. Не оставляйте решение клиенту.

OWASP для большинства приложений предпочитает решения по атрибутам или отношениям: проверка роли грубая, ей трудно выразить правила уровня объекта, множество ролей создаёт их взрыв, а цепочку `hasAnyRole` легко написать неверно. Роль может остаться одним атрибутом политики. Идентификатор не должен быть единственным контролем: даже трудноугадываемый id требует проверки права на этот конкретный объект.""",
"""if not user.has_role("ACCT_MANAGER"):
    return  # deny by default; check the object too, not only the role
""",
[
("OWASP Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"),
],
en_w="""Use a small RBAC model when a few stable job functions really do match the permissions. Move to attributes or relationships when access depends on the specific object, the time, the device, or who created the record.""",
ru_w="""Небольшая модель RBAC уместна, когда несколько устойчивых должностных функций правда совпадают с правами. Переходите к атрибутам или отношениям, когда доступ зависит от конкретного объекта, времени, устройства или от того, кто создал запись.""",
lang="python",
)

add(
"What are the best practices for handling user session timeouts?",
"""Session timeout limits how long a server-side session stays valid. OWASP requires both an **idle timeout** (no HTTP request for that session id) and an **absolute timeout** (measured from when the application created the session, regardless of activity). After either limit, the user must authenticate again and receive a new session.""",
"""Enforce both limits on the server. If the client stores the login time or the remaining minutes, that value can be changed to stretch the session. When the session expires or the user logs out, invalidate it on the server with the platform call (`HttpSession.invalidate()`, `Session.Abandon()`, or `session_destroy()` / `unset()`) and clear the client token. For a cookie, send an empty session id and an `Expires` (or `Max-Age`) date in the past.

Idle timeout also limits how much session state a quiet client can hold, which matters for availability as well as for account takeover. Absolute timeout caps a session that stays active. Do not rely on the browser closing to end the session.""",
"""Таймаут сеанса ограничивает, как долго серверный сеанс остаётся действительным. OWASP требует и **idle timeout** (не было HTTP-запроса с этим id сеанса), и **абсолютный timeout** (от момента, когда приложение создало сеанс, независимо от активности). После любого предела пользователь аутентифицируется снова и получает новый сеанс.""",
"""Оба предела применяет сервер. Если клиент хранит время входа или оставшиеся минуты, это значение можно изменить и растянуть сеанс. Когда сеанс истёк или пользователь вышел, инвалидируйте его на сервере вызовом платформы (`HttpSession.invalidate()`, `Session.Abandon()` или `session_destroy()` / `unset()`) и очистите клиентский токен. Для cookie отправьте пустой id сеанса и дату `Expires` (или `Max-Age`) в прошлом.

Idle timeout также ограничивает, сколько состояния тихого клиента держит сервер, это важно и для доступности, и против захвата учётной записи. Абсолютный timeout ограничивает сеанс, который остаётся активным. Не рассчитывайте, что сеанс кончится, когда закроют браузер.""",
"""Set-Cookie: id=; Expires=Friday, 17-May-03 18:45:00 GMT
""",
[
("OWASP Session Management Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html"),
],
lang="http",
)
