add(
"What is a firewall, and how does it contribute to web security?",
"""A **firewall** is a policy enforcement point that allows or blocks traffic between network zones. In a segmented web architecture, crossing from the internet-facing front end into application or data zones means crossing a firewall. OWASP's Zero Trust sheet also lists firewalls, proxies, application gateways, and API gateways as the components that enforce access decisions, not only at the network edge.""",
"""Place internet-facing services in a front-end zone that includes the load balancer, an application-layer firewall, the web server, and cache. Keep application logic in a middleware zone and databases, directories, and key storage in a back-end zone. Write the allowed paths down: a front end may reach its own application tier, and that tier may reach its own database. A front end must not reach another system's database directly.

A host firewall such as UFW does not automatically govern ports Docker publishes. Docker inserts its own packet rules, so a published port can be reachable even when a deny rule exists. Bind published ports to `127.0.0.1` when they should stay local, or integrate the firewall with Docker's rules. A firewall is one layer; application authorization still runs in server-side code.""",
"""**Межсетевой экран** — точка применения политики, которая разрешает или блокирует трафик между сетевыми зонами. В сегментированной веб-архитектуре переход от фронтенда в интернет к зонам приложений или данных означает проход через экран. В шпаргалке Zero Trust экраны, прокси, шлюзы приложений и API тоже названы компонентами, которые применяют решения о доступе, а не только на краю сети.""",
"""Поместите сервисы из интернета во фронтенд-зону: балансировщик, экран прикладного уровня, веб-сервер и кэш. Логику приложения держите в зоне middleware, а базы, каталоги и хранение ключей — в backend. Запишите разрешённые пути: фронтенд может обращаться к своему уровню приложений, а тот — к своей базе. Фронтенд не должен напрямую достигать чужой базы.

Хостовый экран вроде UFW сам не управляет портами, которые публикует Docker. Docker вставляет свои правила, и опубликованный порт может быть доступен даже при правиле запрета. Привязывайте такие порты к `127.0.0.1`, если они должны остаться локальными, или согласуйте экран с правилами Docker. Экран — один слой; авторизация приложения по-прежнему выполняется в серверном коде.""",
"""# Local only. Publishing 0.0.0.0 bypasses a typical UFW deny.
docker run -p 127.0.0.1:8000:8000 myimage
""",
[
("OWASP Network Segmentation Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Network_Segmentation_Cheat_Sheet.html"),
("OWASP Zero Trust Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Zero_Trust_Architecture_Cheat_Sheet.html"),
("OWASP Docker Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html"),
],
lang="bash",
)

add(
"Define a Virtual Private Network (VPN) and its significance in enhancing web security.",
"""In the guidance OWASP gives for remote access, a **VPN** is a network connection that must not, by itself, authorize access to other resources. Zero Trust treats a VPN that grants broad network access as the old model. The replacement is access to specific resources, with any remaining VPN restricted and monitored. TLS guidance adds that a VPN gateway and a public web server must not share one wildcard certificate.""",
"""Prefer an identity-aware path to the specific application over a tunnel that drops the user onto the internal network. If a VPN is still required during a migration, restrict it and watch it. Device health is monitored continuously, and access is revoked when the device is no longer compliant. A VPN gateway can share a wildcard certificate with another VPN gateway; it must not share that certificate with a public web server or an internal server at a different trust level.

Privacy features and VPNs also reduce the accuracy of location checks used as a risk signal. Do not treat a VPN exit address as proof of who the user is.""",
"""В рекомендациях OWASP по удалённому доступу **VPN** — сетевое соединение, которое само по себе не должно разрешать доступ к другим ресурсам. Zero Trust считает VPN с широким доступом в сеть старой моделью. Замена — доступ к конкретным ресурсам, а оставшийся VPN ограничивают и наблюдают. Руководство по TLS добавляет: шлюз VPN и публичный веб-сервер не должны делить один wildcard-сертификат.""",
"""Предпочитайте путь с проверкой личности к конкретному приложению туннелю, который высаживает пользователя во внутреннюю сеть. Если на время миграции VPN ещё нужен, ограничьте его и наблюдайте. Состояние устройства проверяют непрерывно, доступ отзывают, когда устройство перестаёт соответствовать политике. Шлюз VPN может делить wildcard-сертификат с другим шлюзом VPN; он не должен делить его с публичным веб-сервером или внутренним сервером другого уровня доверия.

Функции приватности и VPN также снижают точность проверки местоположения как сигнала риска. Адрес выхода VPN не доказывает, кто пользователь.""",
"""# Do not reuse one wildcard certificate across trust levels.
# A VPN gateway and a public web server need separate certificates.
""",
[
("OWASP Zero Trust Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Zero_Trust_Architecture_Cheat_Sheet.html"),
("OWASP Transport Layer Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html"),
],
en_w="""Use a tightly scoped VPN only while a specific system still cannot sit behind per-resource checks. For web applications, prefer an identity-aware proxy that authorizes the user and device for that app.""",
ru_w="""Узкий VPN уместен только пока конкретная система ещё не стоит за проверками на каждый ресурс. Для веб-приложений предпочтителен прокси с проверкой личности, который разрешает пользователя и устройство именно для этого приложения.""",
lang="text",
)

add(
"What is an Intrusion Detection System (IDS) vs. an Intrusion Prevention System (IPS)?",
"""An **intrusion detection system** records suspicious activity so people and tooling can investigate it. OWASP's logging guidance lists network and host intrusion detection systems (NIDS and HIDS) among the places security events come from. An **intrusion prevention system** is an inline enforcement layer: the virtual-patching guidance names an IPS appliance, next to a WAF, as a device that can block matching attempts against a known vulnerability without changing the vulnerable code.""",
"""Detection feeds the log stream: authentication failures, policy violations, and other security events that a central store or SIEM can correlate. Prevention sits on the path and can block traffic the rule recognizes. A virtual patch, whether on an IPS or a WAF, only covers traffic that device sees and variants its rules recognize. It does not remove the vulnerability. Test legitimate workflows before blocking, keep an audit trail of rule id and outcome, and continue the code or vendor fix.

Do not treat either box as a substitute for server-side authorization, parameterized queries, or patching.""",
"""**Система обнаружения вторжений** записывает подозрительную активность, чтобы люди и инструменты могли её разобрать. В руководстве OWASP по журналированию сетевые и хостовые системы обнаружения (NIDS и HIDS) перечислены среди источников событий безопасности. **Система предотвращения вторжений** стоит на пути трафика: в руководстве по виртуальному патчу IPS назван рядом с WAF как устройство, которое может блокировать совпавшие попытки против известной уязвимости, не меняя уязвимый код.""",
"""Обнаружение питает поток журналов: неудачные аутентификации, нарушения политики и другие события, которые центральное хранилище или SIEM может сопоставить. Предотвращение стоит на пути и может блокировать трафик, который узнаёт правило. Виртуальный патч на IPS или WAF покрывает только трафик, который устройство видит, и варианты, которые узнают его правила. Уязвимость он не устраняет. До блокировки проверьте легитимные сценарии, храните след с id правила и исходом и продолжайте исправление кода или поставщика.

Ни один из ящиков не заменяет серверную авторизацию, параметризованные запросы или установку исправлений.""",
"""# Detective: NIDS/HIDS contribute events to the application log stream.
# Preventive: an IPS or WAF can block a known pattern while the code fix is prepared.
""",
[
("OWASP Logging Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"),
("OWASP Virtual Patching Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Virtual_Patching_Cheat_Sheet.html"),
],
en_w="""Use detection when you need visibility and an investigation trail. Add inline prevention when you must reduce exposure to a known issue before the code change ships, and remove or retire that rule after the real fix is in place.""",
ru_w="""Обнаружение — когда нужны видимость и след для разбора. Встроенное предотвращение — когда нужно сократить окно известной проблемы до выкладки исправления кода, и снимите или выведите правило после настоящего исправления.""",
lang="text",
)

add(
"How does a Distributed Denial-of-Service (DDoS) attack work, and how can websites be protected from it?",
"""A denial-of-service condition removes availability, one part of the CIA triad. OWASP groups the surfaces as application (the app becomes unusable or runs out of resources without filling the network), session or protocol (server or middlebox resources, including firewalls and load balancers), and network (bandwidth saturation). A distributed attack uses many sources against those same surfaces.""",
"""There is no single switch. Inventory components, find single points of failure, and design for scaling, redundancy, and bulkheads so one failure does not spread. Degrade gracefully. Do cheap validation before expensive work. Cap upload size, total request size, and work that grows with input. Set an idle session timeout and an absolute timeout, and keep little data on each session. Authenticate before expensive functions, but do not let account lockout itself become the outage.

For slow requests, define a minimum ingress rate with a read timeout, an absolute connection timeout, and a maximum rate and bandwidth, tuned from real traffic so legitimate slow clients are not rejected wholesale. Cache and serve static files from another host so the application receives fewer requests. Ask the ISP about capacity and filtering, and consider a filtering service for large volumetric events. Rate limits can also return `429 Too Many Requests`.""",
"""Отказ в обслуживании лишает доступности, одной из частей триады CIA. OWASP делит поверхности на приложение (сервис становится непригоден или исчерпывает ресурсы, не заполняя сеть), сеанс или протокол (ресурсы сервера или промежуточных узлов, включая экраны и балансировщики) и сеть (насыщение канала). Распределённая атака использует много источников против тех же поверхностей.""",
"""Одного переключателя нет. Инвентаризируйте компоненты, найдите единые точки отказа и закладывайте масштабирование, резервирование и переборки, чтобы один сбой не расползался. Деградируйте мягко. Сначала дешёвая проверка, потом дорогая работа. Ограничьте размер загрузки, общий размер запроса и работу, которая растёт от ввода. Задайте idle timeout и абсолютный timeout сеанса и храните на сеансе мало данных. Аутентифицируйте до дорогих функций, но не позволяйте блокировке учётной записи самой стать отказом.

Для медленных запросов задайте минимальную скорость приёма с таймаутом чтения, абсолютный таймаут соединения и максимум скорости и полосы, подобрав их по живому трафику, чтобы не отсечь всех медленных легитимных клиентов. Кэшируйте и отдавайте статику с другого узла, чтобы приложение получало меньше запросов. Узнайте у провайдера про ёмкость и фильтрацию и рассмотрите сервис фильтрации для крупных объёмных событий. Лимит частоты может отвечать `429 Too Many Requests`.""",
"""HTTP/1.1 429 Too Many Requests
Retry-After: 30
""",
[
("OWASP Denial of Service Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html"),
("OWASP REST Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html"),
],
lang="http",
)

add(
"Explain the concept of a Content Delivery Network (CDN) and its importance in web security.",
"""Sites sometimes host scripts and styles on a third party, including a **content delivery network**, instead of only on their own origin. That reduces load on the application origin. OWASP's availability guidance says caching and hosting static resources on a different domain make the application more resilient to bandwidth exhaustion. The same split creates a supply-chain risk: if the third-party host is changed, the browser would otherwise run whatever bytes it receives.""",
"""Subresource Integrity is the browser control for that risk. Put an `integrity` attribute on `<script>` and on `<link rel="stylesheet">` (also `preload` and `modulepreload`) with a `sha256`, `sha384`, or `sha512` hash. The browser uses the strongest algorithm present and refuses the resource on mismatch. Cross-origin integrity requires CORS, so set `crossorigin="anonymous"`. A typical CDN sends `Access-Control-Allow-Origin: *`.

SRI checks bytes. It does not decide whether you should execute that third party's code at all. Limit tags to what you need, and prefer self-hosting when you can version the file yourself. `Integrity-Policy` can require integrity metadata for scripts or styles instead of hoping every tag includes it.""",
"""Сайты иногда размещают сценарии и стили у третьей стороны, в том числе в **сети доставки содержимого**, а не только на своём origin. Это снижает нагрузку на исходное приложение. В руководстве OWASP по доступности кэш и статика на другом домене делают приложение устойчивее к исчерпанию полосы. Тот же разрез создаёт риск цепочки поставки: если узел третьей стороны изменён, браузер иначе выполнит любые полученные байты.""",
"""Subresource Integrity — браузерный контроль этого риска. Поставьте атрибут `integrity` на `<script>` и на `<link rel="stylesheet">` (также `preload` и `modulepreload`) с хешем `sha256`, `sha384` или `sha512`. Браузер берёт самый сильный из присутствующих алгоритмов и при несовпадении отказывается от ресурса. Для междоменной проверки целостности нужен CORS, поэтому задайте `crossorigin="anonymous"`. Типичная CDN отвечает `Access-Control-Allow-Origin: *`.

SRI проверяет байты. Оно не решает, следует ли вообще выполнять код этой третьей стороны. Ограничьте метки тем, что нужно, и по возможности размещайте файл у себя, чтобы самим задавать версию. `Integrity-Policy` может требовать метаданные целостности для сценариев или стилей, а не надеяться, что каждый тег их содержит.""",
"""<script
  src="https://cdn.example.com/script.js"
  integrity="sha384-<base64-hash>"
  crossorigin="anonymous"></script>
""",
[
("MDN — Subresource Integrity", "https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity"),
("OWASP Denial of Service Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html"),
],
lang="html",
)

add(
"What are secure coding practices, and why are they needed?",
"""**Secure coding** is the quality bar on how a product's behavior is implemented, not only that the feature works. OWASP's secure-product guidance says products must meet the organization's security requirements and that security decisions must be explicit. The practices exist so a missing check is not discovered only after the system is in production.""",
"""The sheet's baseline list is: validate input types, formats, lengths, and business constraints, and still use parameterized queries for SQL values; handle errors without disclosing sensitive detail; authenticate and authorize; use HTTPS and encryption at rest at the level the product requires; run code and hosts with least privilege; use memory-safe languages or explicit bounds; keep secrets out of source and in a secure store; test for vulnerabilities during development and before deployment; review code, including with automated tools; and keep dependencies and the platform patched.

Establish secure defaults, minimize what you expose, and fail closed. Repeat the checks at each tier. Threat modeling supplies the stories those checks must cover.""",
"""**Безопасная разработка** — это планка качества того, как реализовано поведение продукта, а не только что функция работает. В руководстве OWASP по проектированию продукта продукты должны выполнять требования безопасности организации, а решения по безопасности должны быть явными. Практики нужны, чтобы отсутствующую проверку не обнаруживали уже в промышленной системе.""",
"""Базовый список шпаргалки: проверяйте типы, форматы, длины и бизнес-ограничения ввода и всё равно используйте параметризованные запросы для значений SQL; обрабатывайте ошибки без раскрытия чувствительных подробностей; аутентифицируйте и авторизуйте; используйте HTTPS и шифрование хранения на уровне, который требует продукт; запускайте код и узлы с наименьшими привилегиями; берите языки с безопасной памятью или явные границы; не держите секреты в исходниках, храните их в защищённом хранилище; тестируйте уязвимости во время разработки и перед развёртыванием; просматривайте код, в том числе автоматическими средствами; обновляйте зависимости и платформу.

Задайте безопасные значения по умолчанию, уменьшите то, что вы выставляете, и отказывайте в закрытом состоянии. Повторяйте проверки на каждом уровне. Моделирование угроз даёт истории, которые эти проверки должны закрыть.""",
"""# SQL values are parameters. Validation does not replace that.
cursor.execute("SELECT balance FROM accounts WHERE id = ?", (account_id,))
""",
[
("OWASP Secure Product Design Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html"),
],
lang="python",
)

add(
"How can input validation prevent web security threats?",
"""**Input validation** checks that data meets the application's requirements before the application uses it. It reduces malformed data, invalid business operations, and excessive resource use. OWASP separates it from the other defenses that are still required: parameterized queries for SQL, context-aware output encoding for cross-site scripting, and a separate authorization check. A well-formed account id does not mean the caller may read that account.""",
"""Validate syntax and meaning. Fixed choices must be members of the allowed set, including values that came from a menu. Numbers and dates need type, format, and bounds. Strings need length and the structure the field requires. Objects need allowed and required fields. Arrays need size limits and a check of every item.

Define what you accept and reject the rest. Do not try to recognize every dangerous string. Apply size limits before parsing, use a maintained parser, and validate the decoded value you will actually use. Reject the request instead of continuing with a partial object. Client-side checks are for immediate feedback; repeat them on the server. Data from internal APIs, partners, queues, and stored records is still untrusted when it crosses a trust boundary.""",
"""**Проверка ввода** убеждается, что данные соответствуют требованиям приложения, до того как приложение их использует. Она снижает долю искажённых данных, неверных бизнес-операций и чрезмерного расхода ресурсов. OWASP отделяет её от других защит, которые всё равно нужны: параметризованные запросы для SQL, контекстное кодирование вывода против межсайтового скриптинга и отдельная проверка авторизации. Правильно оформленный id счёта не означает, что вызывающий может этот счёт читать.""",
"""Проверяйте синтаксис и смысл. Фиксированные варианты должны входить в разрешённый набор, включая значения из меню. Числам и датам нужны тип, формат и границы. Строкам — длина и структура поля. Объектам — разрешённые и обязательные поля. Массивам — пределы размера и проверка каждого элемента.

Опишите, что вы принимаете, и отклоняйте остальное. Не пытайтесь узнать каждую опасную строку. Ограничьте размер до разбора, используйте поддерживаемый парсер и проверяйте декодированное значение, которое реально пойдёт в работу. Отклоняйте запрос, а не продолжайте с частично проверенным объектом. Проверки в браузере дают мгновенную обратную связь; повторите их на сервере. Данные внутренних API, партнёров, очередей и хранилищ остаются недоверенными, когда пересекают границу доверия.""",
"""import re
if re.fullmatch(r"[0-9]{1,6}", account_id) is None:
    raise ValueError("account id")
""",
[
("OWASP Input Validation Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"),
],
lang="python",
)

add(
"What are parameterized queries, and how do they prevent SQL injection?",
"""A **parameterized query** (a prepared statement with bound variables) forces the SQL text to be defined first and each data value to be passed later. The database then treats user input as data, not as part of the statement, so the statement's intent stays the one the developer wrote.""",
"""OWASP lists this as the primary defense. Stop building queries by concatenating strings. Stored procedures prevent the same class of flaw only when they are themselves parameterized; dynamic SQL inside a procedure brings the risk back. If a table name, column name, or sort direction cannot be a bound parameter, map the user value onto a fixed allow-list in code and append only that chosen literal. Escaping user input is strongly discouraged and is database-specific.

Keep a second layer: allow-list validation, and database accounts with only the rights that feature needs. Do not give the application a DBA account. Different features can use different database users so a login path cannot write.""",
"""**Параметризованный запрос** (подготовленное выражение со связанными переменными) заставляет сначала задать текст SQL, а каждое значение данных передать потом. База тогда считает пользовательский ввод данными, а не частью оператора, и замысел оператора остаётся тем, который написал разработчик.""",
"""OWASP называет это основной защитой. Перестаньте собирать запросы склейкой строк. Хранимые процедуры закрывают тот же класс недостатков, только если сами параметризованы; динамический SQL внутри процедуры возвращает риск. Если имя таблицы, столбца или направление сортировки нельзя связать как параметр, отобразите значение пользователя на фиксированный список в коде и дописывайте только выбранный литерал. Экранирование ввода настоятельно не рекомендуется и зависит от базы.

Второй слой: проверка по списку разрешённого и учётные записи базы только с правами, которые нужны функции. Не давайте приложению учётную запись DBA. Разные функции могут ходить под разными пользователями базы, чтобы путь входа не мог писать.""",
"""String query = "SELECT account_balance FROM user_data WHERE user_name = ?";
PreparedStatement pstmt = connection.prepareStatement(query);
pstmt.setString(1, custname);
ResultSet results = pstmt.executeQuery();
""",
[
("OWASP SQL Injection Prevention Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"),
],
lang="java",
)

add(
"Why should developers avoid security through obscurity?",
"""**Security through obscurity** treats secrecy of an identifier, a header, or an algorithm name as if it were an access check. OWASP's authorization guidance says that making an object id hard to guess is not enough: the user must not gain an object merely by knowing its id. Access control has to authorize that object. The password-storage guidance likewise says you do not need to hide which modern password hash you use when it is configured properly.""",
"""Hiding the `Server` or `X-Powered-By` header is still worth doing because those headers advertise software, but OWASP notes that other fingerprinting remains. Removing a version header is hygiene, not the control that stops a vulnerable parser.

Prefer designs that stay safe when the mechanism is known: parameterized queries, server-side authorization, slow password hashes with public parameters, and TLS. Deny by default so a newly added route is not exposed because nobody wrote a rule. Custom cryptographic algorithms are rejected outright by the cryptographic-storage guidance.""",
"""**Безопасность через неясность** принимает секретность идентификатора, заголовка или имени алгоритма за проверку доступа. В руководстве OWASP по авторизации трудноугадываемый id объекта недостаточен: пользователь не должен получать объект лишь потому, что знает id. Контроль доступа должен разрешить именно этот объект. Руководство по хранению паролей так же говорит, что современный хеш пароля при правильной настройке можно не скрывать.""",
"""Скрывать заголовки `Server` или `X-Powered-By` всё же стоит, потому что они рекламируют ПО, но OWASP отмечает, что другое снятие отпечатка остаётся. Убрать заголовок версии — гигиена, а не контроль, который останавливает уязвимый разбор.

Предпочитайте схемы, которые остаются безопасными, когда механизм известен: параметризованные запросы, серверная авторизация, медленные хеши паролей с публичными параметрами и TLS. Запрещайте по умолчанию, чтобы новый маршрут не оказался открыт из-за отсутствия правила. Собственные криптографические алгоритмы руководство по криптохранилищу отвергает сразу.""",
"""# Authorize the object. A random id is not the access check.
if not can_read(user, account_id):
    abort(404)
""",
[
("OWASP Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"),
("OWASP Password Storage Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html"),
("OWASP HTTP Headers Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html"),
],
lang="python",
)

add(
"How do you securely handle file uploads to prevent web security issues?",
"""File upload lets a user send a photo, a document, or similar content. OWASP's defensive baseline is an allow-list of extensions the business needs, validation of the file type rather than trust in the client `Content-Type`, a server-generated file name, limits on name length and size, authorization of the uploader, storage outside the web root or on another host, malware scanning where you have it, and CSRF protection on the upload.""",
"""No single check is sufficient. Decode the file name before you judge the extension, and allow only the types you agreed, such as one image type or `docx` and `pdf` for a CV. Generate a UUID instead of keeping the client's name. Restrict any user-visible name to a short allowed character set and reject leading dots. Store files outside the web root with least-privilege permissions, and disable per-directory server configuration on the upload directory so a dropped configuration file cannot change how the server treats types.

When the browser must download rather than render, send `Content-Disposition: attachment`, `Content-Type: application/octet-stream` for unknown bytes, and `X-Content-Type-Options: nosniff`. Cap size before you expand archives. Only authenticated users with permission for that operation should upload.""",
"""Загрузка файла позволяет пользователю прислать фото, документ или похожее содержимое. Базовая защита OWASP: список разрешённых расширений, которые нужны бизнесу, проверка типа файла без доверия к клиентскому `Content-Type`, имя файла, созданное сервером, пределы длины имени и размера, авторизация загружающего, хранение вне корня сайта или на другом узле, проверка на вредоносность, где она есть, и защита загрузки от CSRF.""",
"""Одной проверки недостаточно. Декодируйте имя файла до оценки расширения и разрешайте только согласованные типы, например один тип изображения или `docx` и `pdf` для резюме. Генерируйте UUID вместо имени клиента. Любое имя, видимое пользователю, ограничьте коротким набором символов и отвергайте ведущие точки. Храните файлы вне корня сайта с наименьшими правами и отключите покаталоговую конфигурацию сервера в каталоге загрузок, чтобы подложенный файл конфигурации не изменил обработку типов.

Когда браузер должен скачать, а не отобразить, отдайте `Content-Disposition: attachment`, `Content-Type: application/octet-stream` для неизвестных байтов и `X-Content-Type-Options: nosniff`. Ограничьте размер до распаковки архивов. Загружать должны только аутентифицированные пользователи с правом на эту операцию.""",
"""Content-Disposition: attachment
Content-Type: application/octet-stream
X-Content-Type-Options: nosniff
""",
[
("OWASP File Upload Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html"),
("OWASP HTTP Headers Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html"),
],
lang="http",
)
