add(
"Define Personally Identifiable Information (PII) and discuss how it should be protected.",
"""**Personally identifiable information** is private information an application holds about a person. OWASP's mobile guidance tells developers to minimize it, replace it with less sensitive data where that still meets the need, keep less of it (for example fewer location updates), expire and delete it, and ask for consent before collection or use. The user-privacy sheet treats identities, private information, and communications as data that must be protected with strong cryptography.""",
"""Encrypt communications in transit with TLS, verified certificates, protected private keys, and strong ciphers. Encrypt private data at rest with keys of sufficient length and strict access, technical and procedural. Hash credentials even when the store is also encrypted. Support HTTP Strict Transport Security so browsers keep using HTTPS.

Do not log full request bodies, secrets, or authentication material. Give users a way to see sessions and invalidate a device that was lost. If you cannot legally or technically prevent disclosure of logs, say so plainly. Block optional third-party content when loading it would reveal the user's address to another host.""",
"""**Персональные данные** — это частная информация о человеке, которую хранит приложение. Мобильное руководство OWASP велит уменьшать её объём, заменять менее чувствительными данными, где этого хватает, хранить меньше (например реже обновлять местоположение), задавать срок и удаление и спрашивать согласие до сбора или использования. Шпаргалка о приватности считает личности, частную информацию и переписку данными, которые нужно защищать сильной криптографией.""",
"""Шифруйте связь при передаче с помощью TLS, проверенных сертификатов, защищённых закрытых ключей и стойких шифров. Шифруйте частные данные при хранении ключами достаточной длины и при строгом доступе, техническом и организационном. Хешируйте учётные данные, даже если хранилище тоже зашифровано. Поддерживайте HTTP Strict Transport Security, чтобы браузеры оставались на HTTPS.

Не пишите в журнал полные тела запросов, секреты и материал аутентификации. Дайте пользователям способ увидеть сеансы и инвалидировать потерянное устройство. Если вы не можете по закону или технически предотвратить раскрытие журналов, скажите об этом прямо. Блокируйте необязательное стороннее содержимое, если его загрузка раскрыла бы адрес пользователя другому узлу.""",
"""Cache-Control: no-store
""",
[
("OWASP Mobile Application Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html"),
("OWASP User Privacy Protection Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/User_Privacy_Protection_Cheat_Sheet.html"),
("OWASP HTTP Headers Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html"),
],
lang="http",
)

add(
"What is the General Data Protection Regulation (GDPR), and what are its key tenets?",
"""The **General Data Protection Regulation** is the European Union privacy regulation. OWASP's multifactor guidance notes that finance and healthcare rules, and GDPR, often require MFA. The Zero Trust cheat sheet maps GDPR-related controls to privacy-by-design, logging of data access, and breach detection. Those are the tenets the fetched OWASP pages actually name; they are not a reprint of the regulation's articles.""",
"""Privacy-by-design, in the product guidance those pages sit next to, means collecting less personal data, encrypting it in transit and at rest, hashing passwords, and telling users honestly what you cannot protect. Access logging records who reached personal data and when, without storing the data itself in the log. Breach detection depends on that trail plus monitoring, so an incident is visible rather than silent.

MFA for accounts that can reach personal data is the control the authentication sheet ties to GDPR compliance. Pair it with the right to practical session invalidation when a device is lost, which the privacy sheet recommends.""",
"""**Общий регламент по защите данных** — это регламент Евросоюза о приватности. В руководстве OWASP по MFA отмечено, что правила финансов и здравоохранения и GDPR часто требуют MFA. Шпаргалка Zero Trust сопоставляет связанные с GDPR меры с privacy-by-design, журналированием доступа к данным и обнаружением нарушений. Это те принципы, которые названы в полученных страницах OWASP, а не пересказ статей регламента.""",
"""Privacy-by-design рядом с этими страницами означает собирать меньше персональных данных, шифровать их при передаче и хранении, хешировать пароли и честно говорить пользователям, что вы не можете защитить. Журнал доступа фиксирует, кто и когда достиг персональных данных, не сохраняя сами данные в журнале. Обнаружение нарушения опирается на этот след и на наблюдение, чтобы инцидент был виден, а не молчалив.

MFA для учётных записей, которые достигают персональных данных, — контроль, который шпаргалка аутентификации связывает с соответствием GDPR. Добавьте практическую инвалидацию сеанса при потере устройства, как рекомендует шпаргалка приватности.""",
"""# Privacy-by-design controls named alongside GDPR in the Zero Trust sheet:
# less collection, access logs, breach detection, and MFA for those accounts.
""",
[
("OWASP Zero Trust Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Zero_Trust_Architecture_Cheat_Sheet.html"),
("OWASP Multifactor Authentication Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What are data encryption best practices for sensitive information?",
"""**Encryption of stored data** should follow the threat model: who you are protecting against decides whether encryption belongs in the application, the database (for example SQL Server TDE), the filesystem (BitLocker or LUKS), or hardware. Hardware encryption can address physical theft and does nothing for an attacker who already runs code on the server. The strongest reduction is to not store the sensitive value, especially card data.""",
"""For symmetric encryption, OWASP prefers AES with a key of at least 128 bits and ideally 256, in an authenticated mode: GCM or CCM. If those are unavailable, CTR or CBC plus encrypt-then-MAC. Do not use ECB outside very specific cases. Do not invent algorithms. For public-key encryption use a maintained hybrid scheme such as HPKE; if RSA is required, use at least 2048-bit keys and OAEP (RFC 8017). RSA and elliptic-curve public keys are not post-quantum secure; long-lived secrecy needs a plan such as ML-KEM (FIPS 203) in a hybrid construction. AES still encrypts the data.

Generate keys with a CSPRNG (`SecureRandom`, `secrets`, `crypto.randomBytes()`, not `Math.random()` or `rand()`). Store them in an HSM, a cloud KMS, or a secrets manager, not in source control. Keep keys apart from ciphertext. Rotate on compromise, on a cryptoperiod, on usage limits of the mode, or when the algorithm weakens. Passwords are hashed, not encrypted, except the rare case where another system still demands the original password and no OIDC-style grant exists.""",
"""**Шифрование хранимых данных** следует модели угроз: от кого вы защищаетесь, решает, шифровать в приложении, в базе (например SQL Server TDE), в файловой системе (BitLocker или LUKS) или в оборудовании. Аппаратное шифрование закрывает физическую кражу и ничего не даёт против того, кто уже выполняет код на сервере. Самое сильное сокращение — не хранить чувствительное значение, особенно данные карты.""",
"""Для симметричного шифрования OWASP предпочитает AES с ключом не короче 128 бит и лучше 256, в режиме с аутентификацией: GCM или CCM. Если их нет — CTR или CBC плюс encrypt-then-MAC. ECB не используют вне очень узких случаев. Свои алгоритмы не изобретают. Для шифрования с открытым ключом берите поддерживаемую гибридную схему вроде HPKE; если нужен RSA — ключ не короче 2048 бит и OAEP (RFC 8017). Открытые ключи RSA и эллиптических кривых не стойки к постквантовым атакам; долгая секретность требует плана вроде ML-KEM (FIPS 203) в гибридной конструкции. Данные по-прежнему шифрует AES.

Ключи генерируйте CSPRNG (`SecureRandom`, `secrets`, `crypto.randomBytes()`, не `Math.random()` и не `rand()`). Храните их в HSM, облачном KMS или менеджере секретов, не в системе контроля версий. Держите ключи отдельно от шифртекста. Ротируйте при компрометации, по криптопериоду, по пределам использования режима или когда алгоритм слабеет. Пароли хешируют, а не шифруют, кроме редкого случая, когда другая система всё ещё требует исходный пароль и нет выдачи в духе OIDC.""",
"""# Node.js CSPRNG for a 256-bit data key. Do not use Math.random().
const key = crypto.randomBytes(32);
""",
[
("OWASP Cryptographic Storage Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html"),
("OWASP Post-Quantum Cryptography Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Post_Quantum_Cryptography_Cheat_Sheet.html"),
],
lang="javascript",
)

add(
"Explain data masking and how it can protect sensitive data.",
"""**Data masking** hides sensitive values from people who can see a screen or a log but do not need the raw data. OWASP's mobile sheet calls out masking sensitive fields in the interface to reduce shoulder surfing. The logging sheet says not to record secrets, full bodies, or authentication material. The HTTP caching guidance says sensitive responses should use `Cache-Control: no-store` so shared caches do not keep them.""",
"""Mask in the UI at the field that a bystander could read, and keep the full value only on the server path that is authorized to use it. In logs, store the fact of the event and a correlation id, not the password, the card number, or the request body. In object storage, prefer IAM access from the application over public objects, and use short-lived credentials rather than a long-lived access key.

Masking is a display and retention control. It does not replace encryption at rest or an authorization check. Randomizing an object id, which the authorization sheet discusses, is also not a substitute for authorizing that object.""",
"""**Маскирование данных** скрывает чувствительные значения от тех, кто видит экран или журнал, но не нуждается в исходных данных. Мобильная шпаргалка OWASP отдельно называет маскирование чувствительных полей интерфейса, чтобы снизить подглядывание. Шпаргалка журналирования запрещает записывать секреты, полные тела и материал аутентификации. Руководство по HTTP-кэшу велит для чувствительных ответов ставить `Cache-Control: no-store`, чтобы общие кэши их не хранили.""",
"""Маскируйте в интерфейсе поле, которое может прочитать посторонний, и держите полное значение только на серверном пути, которому оно разрешено. В журналах храните факт события и id корреляции, а не пароль, номер карты или тело запроса. В объектном хранилище предпочитайте доступ приложения через IAM публичным объектам и короткоживущие учётные данные вместо долгого ключа доступа.

Маскирование — контроль показа и хранения. Оно не заменяет шифрование при хранении и проверку авторизации. Случайный id объекта, о котором говорит шпаргалка авторизации, тоже не заменяет разрешение на этот объект.""",
"""Cache-Control: no-store
""",
[
("OWASP Mobile Application Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Mobile_Application_Security_Cheat_Sheet.html"),
("OWASP Logging Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"),
("OWASP HTTP Headers Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html"),
],
lang="http",
)

add(
"What steps can organizations take to ensure data privacy?",
"""**User privacy protection**, in OWASP's sheet, is the set of mitigations that keep identities, private information, and communications from being exposed by the service itself. The steps are cryptographic, transport, session, and transparency controls, not a promise that the network is anonymous.""",
"""Encrypt private data in transit and at rest. Hash passwords with a slow hash. Send HSTS so browsers refuse to fall back to cleartext HTTP. Let users review sessions and invalidate a lost or stolen device. If third-party images or tags would leak the user's address, let users block that content. If the service cannot prevent disclosure of logs to an outside party, tell users in plain language.

Minimize collection, ask consent, and delete on a schedule, as the mobile sheet requires for PII. Log security events without the personal payload. Zero Trust's GDPR row adds privacy-by-design, access logging, and breach detection as the operational loop.""",
"""**Защита приватности пользователя** в шпаргалке OWASP — это меры, которые не дают самому сервису раскрыть личности, частную информацию и переписку. Шаги — криптография, транспорт, сеансы и прозрачность, а не обещание, что сеть анонимна.""",
"""Шифруйте частные данные при передаче и хранении. Хешируйте пароли медленным хешем. Отдавайте HSTS, чтобы браузеры не возвращались к открытому HTTP. Дайте пользователям просмотр сеансов и инвалидацию потерянного или украденного устройства. Если сторонние изображения или метки раскрыли бы адрес пользователя, дайте возможность их блокировать. Если сервис не может предотвратить раскрытие журналов внешней стороне, скажите об этом простым языком.

Уменьшайте сбор, спрашивайте согласие и удаляйте по расписанию, как требует мобильная шпаргалка для PII. Журналируйте события безопасности без персональной нагрузки. Строка GDPR в Zero Trust добавляет privacy-by-design, журнал доступа и обнаружение нарушений как рабочий цикл.""",
"""Strict-Transport-Security: max-age=31536000; includeSubDomains
""",
[
("OWASP User Privacy Protection Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/User_Privacy_Protection_Cheat_Sheet.html"),
("OWASP Zero Trust Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Zero_Trust_Architecture_Cheat_Sheet.html"),
],
lang="http",
)

add(
"What are security headers, and why are they important?",
"""**Security headers** are HTTP response headers that tell the browser how to handle the page. OWASP calls them an easy boost against cross-site scripting, clickjacking, and information disclosure. They apply to responses the browser will render; a JSON API that is never rendered gains little from framing or script policy.""",
"""Set `Content-Security-Policy` to limit script and style sources, and prefer `frame-ancestors` over `X-Frame-Options`. If you still send `X-Frame-Options`, `DENY` refuses framing. Set `X-Content-Type-Options: nosniff` and a correct `Content-Type`, including `charset=UTF-8` for HTML. Set `Referrer-Policy: strict-origin-when-cross-origin` explicitly. Use `Cache-Control: no-store` for sensitive responses. `Strict-Transport-Security` belongs on HTTPS responses only.

Turn `X-XSS-Protection` off (`0`); the cheat sheet warns it can create flaws and says to rely on CSP instead. Do not send `Expect-CT` or `Public-Key-Pins`. Remove `X-Powered-By` and non-informative `Server` values, knowing fingerprinting still exists. `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp`, and `Cross-Origin-Resource-Policy: same-site` isolate browsing contexts. `Permissions-Policy` can disable camera, microphone, and geolocation when the site does not need them. If you send `Access-Control-Allow-Origin`, name a specific origin instead of `*` unless the API is intentionally public.""",
"""**Заголовки безопасности** — это заголовки ответа HTTP, которые говорят браузеру, как обращаться со страницей. OWASP называет их простой прибавкой против межсайтового скриптинга, кликджекинга и раскрытия сведений. Они относятся к ответам, которые браузер отрисует; JSON API, который не отрисовывают, мало получает от политики кадров или сценариев.""",
"""Задайте `Content-Security-Policy`, чтобы ограничить источники сценариев и стилей, и предпочитайте `frame-ancestors` заголовку `X-Frame-Options`. Если `X-Frame-Options` всё же отправляете, `DENY` запрещает встраивание. Ставьте `X-Content-Type-Options: nosniff` и верный `Content-Type`, для HTML включая `charset=UTF-8`. Явно ставьте `Referrer-Policy: strict-origin-when-cross-origin`. Для чувствительных ответов — `Cache-Control: no-store`. `Strict-Transport-Security` только на ответах HTTPS.

Выключите `X-XSS-Protection` (`0`); шпаргалка предупреждает, что он может создать недостатки, и велит опираться на CSP. Не отправляйте `Expect-CT` и `Public-Key-Pins`. Уберите `X-Powered-By` и бессодержательные значения `Server`, помня, что снятие отпечатка остаётся. `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp` и `Cross-Origin-Resource-Policy: same-site` изолируют контексты просмотра. `Permissions-Policy` может отключить камеру, микрофон и геолокацию, если сайту они не нужны. Если отправляете `Access-Control-Allow-Origin`, назовите конкретный origin вместо `*`, если только API намеренно не публичный.""",
"""Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
""",
[
("OWASP HTTP Headers Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html"),
],
lang="http",
)

add(
"What is Content Security Policy (CSP) and how does it improve web security?",
"""**Content Security Policy** is the `Content-Security-Policy` response header (or a `<meta http-equiv>` element) that lists which origins and script endpoints a page may load. MDN states that this helps guard against cross-site scripting. Policies are directives separated by semicolons. Fetch directives such as `default-src`, `script-src`, and `style-src` name allowed sources; `default-src` is the fallback.""",
"""If `script-src` or `default-src` is present and does not include `'unsafe-inline'` or `'unsafe-eval'`, inline scripts and string evaluation are blocked. Prefer nonces or hashes (`sha256`, `sha384`, `sha512`) for the few inline scripts you must keep. `'strict-dynamic'` extends trust from a nonce or hash to scripts that trusted script adds. `frame-ancestors` lists who may embed the page. `object-src 'none'` blocks plugins. `upgrade-insecure-requests` rewrites HTTP URLs to HTTPS.

Multiple policies only tighten: if one policy sets `connect-src 'none'`, a second policy cannot reopen it. While testing, `Content-Security-Policy-Report-Only` reports violations without blocking. OWASP says to turn off `X-XSS-Protection` and use CSP instead. A report-only policy does not block execution.""",
"""**Content Security Policy** — это заголовок ответа `Content-Security-Policy` (или элемент `<meta http-equiv>`), который перечисляет, с каких origin и конечных точек сценариев страница может загружать ресурсы. MDN указывает, что это помогает сдерживать межсайтовый скриптинг. Политика — директивы через точку с запятой. Директивы загрузки вроде `default-src`, `script-src` и `style-src` называют разрешённые источники; `default-src` — запасной вариант.""",
"""Если есть `script-src` или `default-src` и в них нет `'unsafe-inline'` или `'unsafe-eval'`, встроенные сценарии и вычисление строк блокируются. Для немногих встроенных сценариев, которые приходится оставить, предпочтительны nonce или хеши (`sha256`, `sha384`, `sha512`). `'strict-dynamic'` распространяет доверие от nonce или хеша на сценарии, которые добавляет доверенный сценарий. `frame-ancestors` перечисляет, кто может встроить страницу. `object-src 'none'` блокирует плагины. `upgrade-insecure-requests` переписывает URL HTTP на HTTPS.

Несколько политик только ужесточают: если одна ставит `connect-src 'none'`, вторая не может это открыть. На время проверки `Content-Security-Policy-Report-Only` сообщает о нарушениях, не блокируя. OWASP велит выключить `X-XSS-Protection` и использовать CSP. Политика только с отчётами исполнение не блокирует.""",
"""Content-Security-Policy: default-src https:; object-src 'none'
""",
[
("MDN — Content-Security-Policy", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy"),
("OWASP HTTP Headers Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html"),
],
lang="http",
)

add(
"Can you explain the role of Subresource Integrity (SRI) in web security?",
"""**Subresource Integrity** lets the browser check that a fetched script or stylesheet matches a cryptographic hash you supply. MDN describes it as a defense when a third-party host, such as a CDN, is changed and would otherwise serve different bytes. It applies to `<script>` and to `<link>` whose `rel` is `stylesheet`, `preload`, or `modulepreload`.""",
"""The `integrity` value is a whitespace-separated list of hashes prefixed with `sha256-`, `sha384-`, or `sha512-`. The browser selects the strongest algorithm present, hashes the bytes, and loads the resource only on a match; otherwise it fails the load with a network error. Several hashes of the same algorithm allow alternate legitimate files.

Cross-origin SRI requires CORS, so the tag needs `crossorigin="anonymous"` and the host must send `Access-Control-Allow-Origin`. Without `crossorigin`, the request is `no-cors` and browsers refuse to apply integrity. `Integrity-Policy: blocked-destinations=(script)` can require integrity metadata. Generate the hash from the file you intend to serve, for example with OpenSSL `dgst -sha384 -binary` piped to `base64 -A`.""",
"""**Subresource Integrity** позволяет браузеру проверить, что загруженный сценарий или таблица стилей совпадает с криптографическим хешем, который вы указали. MDN описывает это как защиту, когда сторонний узел, например CDN, изменён и иначе отдал бы другие байты. Механизм применяется к `<script>` и к `<link>`, у которого `rel` равен `stylesheet`, `preload` или `modulepreload`.""",
"""Значение `integrity` — список хешей через пробел с префиксами `sha256-`, `sha384-` или `sha512-`. Браузер выбирает самый сильный из присутствующих алгоритмов, хеширует байты и загружает ресурс только при совпадении; иначе загрузка завершается сетевой ошибкой. Несколько хешей одного алгоритма допускают альтернативные легитимные файлы.

Междоменный SRI требует CORS, поэтому тегу нужен `crossorigin="anonymous"`, а узел должен послать `Access-Control-Allow-Origin`. Без `crossorigin` запрос идёт в режиме `no-cors`, и браузеры отказываются применять целостность. `Integrity-Policy: blocked-destinations=(script)` может требовать метаданные целостности. Считайте хеш от файла, который собираетесь отдавать, например OpenSSL `dgst -sha384 -binary` и далее `base64 -A`.""",
"""cat FILENAME.js | openssl dgst -sha384 -binary | openssl base64 -A
""",
[
("MDN — Subresource Integrity", "https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity"),
],
lang="bash",
)

add(
"What is Domain Name System Security Extensions (DNSSEC), and how does it work?",
"""**DNSSEC** (RFC 4033) adds data origin authentication and data integrity to the Domain Name System. The specification introduces the extensions, their capabilities, and their limitations. It states that these extensions do not provide confidentiality.""",
"""Resolvers can authenticate that DNS data came from the zone that is authoritative for the name and that the data was not altered, including authenticated denial when a name or type does not exist. Operators publish the signed records and a chain of trust back to a trust anchor. Clients and resolvers that validate reject data that does not authenticate.

Because DNSSEC does not encrypt queries or answers, it does not hide which names were looked up. Confidentiality of web traffic remains the job of TLS. DNSSEC is still worth deploying so a resolver can detect unauthorized changes to the records that point users at your site.""",
"""**DNSSEC** (RFC 4033) добавляет к системе доменных имён аутентификацию происхождения данных и целостность данных. Спецификация вводит расширения, их возможности и ограничения. В ней сказано, что эти расширения не обеспечивают конфиденциальность.""",
"""Резолверы могут удостоверить, что данные DNS пришли из зоны, авторитетной для имени, и что данные не изменены, включая удостоверенный отказ, когда имени или типа нет. Операторы публикуют подписанные записи и цепочку доверия до якоря доверия. Клиенты и резолверы, которые проверяют подписи, отвергают данные, которые не аутентифицированы.

Поскольку DNSSEC не шифрует запросы и ответы, он не скрывает, какие имена искали. Конфиденциальность веб-трафика остаётся задачей TLS. DNSSEC всё же стоит включать, чтобы резолвер замечал несанкционированные изменения записей, которые направляют пользователей на ваш сайт.""",
"""# DNSSEC (RFC 4033): origin authentication and integrity.
# It does not provide confidentiality; use TLS for that.
""",
[
("RFC 4033 — DNS Security Introduction and Requirements", "https://www.rfc-editor.org/rfc/rfc4033.html"),
],
lang="text",
)

add(
"What is HTTP Strict Transport Security (HSTS) and how can it be used?",
"""**HTTP Strict Transport Security** is the `Strict-Transport-Security` response header. MDN says it tells browsers that the host should be contacted only with HTTPS, and that later HTTP attempts are upgraded. On later connections the browser will not let the user bypass certificate errors. The host is identified by domain name only, not by IP address. Browsers ignore the header if it arrives over cleartext HTTP.""",
"""`max-age` is seconds. `includeSubDomains` covers subdomains of that host, not the parent. `preload` requires `max-age` of at least `31536000` (one year) and `includeSubDomains`. OWASP's header sheet shows `max-age=63072000; includeSubDomains; preload` and warns that a long policy plus a broken certificate can lock users out until the age expires. Send the header only on HTTPS. A first HTTP visit can still be redirected; MDN's example uses `301` with a `Location` of the HTTPS URL, and that redirect itself must not include HSTS. Preload lists close the gap before the first HTTPS response, and they are operational, not part of the HSTS specification. `max-age=0` clears the policy, but only over HTTPS.""",
"""**HTTP Strict Transport Security** — это заголовок ответа `Strict-Transport-Security`. MDN говорит, что он сообщает браузерам обращаться к узлу только по HTTPS, а последующие попытки HTTP повышаются до HTTPS. При следующих соединениях браузер не даст пользователю обойти ошибки сертификата. Узел опознаётся только по доменному имени, не по IP-адресу. Браузеры игнорируют заголовок, если он пришёл по открытому HTTP.""",
"""`max-age` — секунды. `includeSubDomains` покрывает поддомены этого узла, не родителя. `preload` требует `max-age` не меньше `31536000` (один год) и `includeSubDomains`. Шпаргалка заголовков OWASP показывает `max-age=63072000; includeSubDomains; preload` и предупреждает, что долгая политика плюс сломанный сертификат может закрыть пользователей до истечения срока. Отправляйте заголовок только по HTTPS. Первый визит по HTTP всё ещё можно перенаправить; пример MDN использует `301` с `Location` на HTTPS URL, и само перенаправление не должно содержать HSTS. Списки preload закрывают окно до первого ответа HTTPS, и они эксплуатационные, не часть спецификации HSTS. `max-age=0` снимает политику, но только по HTTPS.""",
"""Strict-Transport-Security: max-age=31536000; includeSubDomains
""",
[
("MDN — Strict-Transport-Security", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security"),
("OWASP HTTP Headers Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html"),
],
en_w="""Enable HSTS on HTTPS responses after the whole host, including subdomains if you set that directive, serves valid certificates. Use a short `max-age` first. Add `preload` only when you can meet the one-year minimum and accept that clients will keep the policy.""",
ru_w="""Включайте HSTS на ответах HTTPS после того, как весь узел, включая поддомены, если директива их покрывает, отдаёт действительные сертификаты. Сначала короткий `max-age`. Добавляйте `preload`, только когда выдерживаете минимум в один год и принимаете, что клиенты сохранят политику.""",
lang="http",
)
