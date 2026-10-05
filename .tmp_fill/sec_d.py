add(
"What is penetration testing, and how does it differ from vulnerability scanning?",
"""OWASP's virtual-patching guidance separates two proactive checks on a live application: **penetration tests**, performed by people, and **automated web assessment tools**. The authorization sheet adds that unit and integration tests catch low-hanging access-control mistakes and are not a substitute for a dedicated security test or penetration test. Automated tests miss more sophisticated issues.""",
"""Scanning repeatedly applies known checks and produces a list of findings. A penetration test is an ethical assessment of the running application, including business logic and chained weaknesses that a scanner does not model. Both are ways to learn about a flaw before an incident. Record the finding, judge whether a virtual patch applies, and still fix the code. Run scanners in CI for the known classes; schedule human testing when the threat model or a major release says the automated result is not enough.

Do not treat a clean scan as proof the authorization logic is sound. The authorization sheet points at the OWASP Web Security Testing Guide for access-control testing beyond unit tests.""",
"""В руководстве OWASP по виртуальному патчу разделены две упреждающие проверки живого приложения: **тесты на проникновение**, которые делают люди, и **автоматические средства оценки веба**. Шпаргалка авторизации добавляет, что модульные и интеграционные тесты ловят простые ошибки контроля доступа и не заменяют отдельный тест безопасности или тест на проникновение. Автоматические тесты пропускают более сложные проблемы.""",
"""Сканирование повторно применяет известные проверки и выдаёт список находок. Тест на проникновение — этичная оценка работающего приложения, включая бизнес-логику и цепочки слабостей, которые сканер не моделирует. Оба способа узнают о недостатке до инцидента. Зафиксируйте находку, решите, уместен ли виртуальный патч, и всё равно исправьте код. Гоняйте сканеры в CI для известных классов; назначайте человеческое тестирование, когда модель угроз или крупный выпуск говорит, что автоматического результата мало.

Чистый скан не доказывает, что логика авторизации верна. Шпаргалка авторизации отсылает к OWASP Web Security Testing Guide для проверки контроля доступа сверх модульных тестов.""",
"""# Automated scan: known checks in CI.
# Penetration test: people exercise the running app, then you still patch the code.
""",
[
("OWASP Virtual Patching Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Virtual_Patching_Cheat_Sheet.html"),
("OWASP Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"),
],
en_w="""Run automated assessment continuously. Commission a penetration test for a new or high-impact system, after major design changes, and when a scanner cannot see business rules. Use the results to prioritize fixes, not as a one-time certificate.""",
ru_w="""Автоматическую оценку гоняйте постоянно. Тест на проникновение заказывайте для новой или важной системы, после крупных изменений схемы и когда сканер не видит бизнес-правила. Результаты нужны, чтобы расставить исправления, а не как разовый сертификат.""",
lang="text",
)

add(
"How is fuzzing used in security testing?",
"""OWASP's logging guidance says to confirm that logging stays enabled during application security, **fuzz**, penetration, and performance testing. In that setting, fuzzing is an input-generation test that throws varied data at the application while you watch for crashes, error leaks, and log injection. The input-validation sheet tells you what those runs must include: valid values, invalid values, and near-matches, with length limits applied before matching, and a timeout treated as validation failure.""",
"""Bound request size first so the test does not become an availability problem of its own. Point fuzzing at parsers, regular expressions, file uploads, and query parameters. Fail closed on malformed input. Assert that logs record the failure and metadata, not secrets or the full body. The logging sheet also says to test that the logging path itself is not subject to injection and that losing the network does not have an unwanted side effect if logs are shipped remotely.

Fuzzing finds broken handling. It does not replace parameterized queries or an authorization matrix.""",
"""В руководстве OWASP по журналированию сказано проверять, что журналирование остаётся включённым во время тестов безопасности приложения, **фаззинга**, проникновения и производительности. В этом контексте фаззинг — тест с порождением ввода, который подаёт приложению разнообразные данные, пока вы смотрите на падения, утечки в ошибках и внедрение в журнал. Шпаргалка проверки ввода говорит, что такие прогоны должны включать верные значения, неверные и почти совпавшие, с пределом длины до сопоставления, а таймаут считается провалом проверки.""",
"""Сначала ограничьте размер запроса, чтобы сам тест не стал проблемой доступности. Направляйте фаззинг на парсеры, регулярные выражения, загрузки файлов и параметры запроса. При искажённом вводе отказывайте в закрытом состоянии. Проверяйте, что журналы пишут факт сбоя и метаданные, а не секреты или полное тело. Шпаргалка журналирования также велит проверить, что сам путь журналирования не подвержен внедрению и что потеря сети не даёт нежелательного побочного эффекта, если журналы уходят наружу.

Фаззинг находит сломанную обработку. Он не заменяет параметризованные запросы или матрицу авторизации.""",
"""# Exercise valid, invalid, and near-matching values.
# A matcher timeout is a validation failure, not a pass.
""",
[
("OWASP Logging Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"),
("OWASP Input Validation Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What are the main objectives of a security audit?",
"""A **security audit** checks whether the controls you claim are actually in place and whether their logs can support that claim. OWASP's logging sheet lists compliance monitoring, audit trails of data addition, change, deletion, and export, and later requests for information as reasons application logs exist. The secure-code-review sheet adds a human pass over architecture, entry points, authentication, authorization, data flow, cryptography, error handling, and deployment configuration.""",
"""Objectives that those pages support:

- Confirm server-side authorization, deny-by-default, and safe failure.
- Confirm passwords are slow-hashed, sessions expire on the server, and cookies use `HttpOnly`, `Secure`, and `SameSite`.
- Confirm TLS, security headers, and dependency updates.
- Confirm security events are logged in a consistent format, clocks agree, and sensitive values are excluded.
- Confirm third-party components are known and reviewed.

An audit is not only a scanner report. Automated findings guide the manual review; people still judge business rules and whether a control can be measured.""",
"""**Аудит безопасности** проверяет, что заявленные контроли действительно стоят и что их журналы могут это подтвердить. Шпаргалка журналирования OWASP называет мониторинг соответствия, следы добавления, изменения, удаления и выгрузки данных и последующие запросы сведений причинами, зачем приложению журналы. Шпаргалка безопасного просмотра кода добавляет человеческий проход по архитектуре, точкам входа, аутентификации, авторизации, потокам данных, криптографии, обработке ошибок и конфигурации развёртывания.""",
"""Цели, которые поддерживают эти страницы:

- Подтвердить серверную авторизацию, запрет по умолчанию и безопасный отказ.
- Подтвердить, что пароли хешируются медленно, сеансы истекают на сервере, а cookie используют `HttpOnly`, `Secure` и `SameSite`.
- Подтвердить TLS, заголовки безопасности и обновления зависимостей.
- Подтвердить, что события безопасности пишутся в согласованном формате, часы совпадают, а чувствительные значения исключены.
- Подтвердить, что сторонние компоненты известны и просмотрены.

Аудит — не только отчёт сканера. Автоматические находки направляют ручной просмотр; люди всё равно судят о бизнес-правилах и о том, можно ли измерить контроль.""",
"""# Audit trail events: add, change, delete, export.
# Exclude passwords, tokens, and full request bodies.
""",
[
("OWASP Logging Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"),
("OWASP Secure Code Review Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html"),
],
lang="text",
)

add(
"Can you explain the concept of threat modeling?",
"""**Threat modeling** is a structured, repeatable process that models a system from a security perspective, identifies applicable threats, and decides a response. OWASP says to do it early, in design, and to keep the model updated with the system rather than once. The Threat Modeling Manifesto questions are: What are we working on? What can go wrong? What are we going to do about it? Did we do a good enough job?""",
"""Decompose the system with data-flow diagrams that show trust boundaries, flows, stores, processes, and external entities. Identify threats with a method that fits the question. STRIDE is the usual prompt for a technical design: spoofing against authentication, tampering against integrity, repudiation against accounting, information disclosure against confidentiality, denial of service against availability, and elevation of privilege against authorization. Other methods (attack trees, abuse cases, LINDDUN, PASTA, OCTAVE, VAST) are for privacy, business impact, or organization-wide risk; do not pile them on for appearance.

Each threat gets a response: mitigate, eliminate, transfer, or accept. Transfer does not by itself reduce likelihood or harm; record who still owns the controls. Review the model with stakeholders, not only developers, and turn mitigations into requirements you can test. Cloud models must include shared responsibility, IAM, managed services, and ephemeral infrastructure.""",
"""**Моделирование угроз** — структурированный повторяемый процесс: система описывается с точки зрения безопасности, находятся применимые угрозы и выбирается ответ. OWASP велит делать это рано, на проектировании, и обновлять модель вместе с системой, а не один раз. Вопросы манифеста: над чем мы работаем? что может пойти не так? что мы с этим сделаем? достаточно ли хорошо мы это сделали?""",
"""Разложите систему диаграммами потоков данных с границами доверия, потоками, хранилищами, процессами и внешними сущностями. Ищите угрозы методом, который подходит вопросу. STRIDE — обычная подсказка для технического проекта: подмена против аутентификации, искажение против целостности, отказ от авторства против учёта, раскрытие информации против конфиденциальности, отказ в обслуживании против доступности и повышение привилегий против авторизации. Другие методы (деревья атак, случаи злоупотребления, LINDDUN, PASTA, OCTAVE, VAST) — для приватности, делового ущерба или риска организации; не складывайте их для вида.

У каждой угрозы есть ответ: смягчить, устранить, передать или принять. Передача сама по себе не снижает вероятность или вред; запишите, кто по-прежнему владеет контролями. Модель смотрят заинтересованные стороны, не только разработчики, а смягчения становятся требованиями, которые можно проверить. Облачные модели должны включать общую ответственность, IAM, управляемые сервисы и эфемерную инфраструктуру.""",
"""# Four questions: what is it, what can go wrong, what will we do, did we do enough?
# STRIDE on each trust boundary, then a recorded response per threat.
""",
[
("OWASP Threat Modeling Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What is static code analysis and how it is beneficial in identifying security risks?",
"""**Static analysis** (SAST) examines source or built artifacts without running the application. OWASP's secure-code-review sheet says automated tools complement manual review: they highlight likely issues, dependency risk, and anti-patterns, while people judge business logic, authorization, and cryptographic misuse. Docker's CI guidance lists static analysis next to lint and image scanning as a pipeline step.""",
"""Run SAST before the human review so obvious findings are already visible. People filter false positives and spend time on gaps tools miss: workflow bypass, race conditions, and whether a role check covers the specific object. Focus the tools on query construction, file paths, `eval` and similar sinks, deserialization, and hardcoded secrets.

Static analysis does not see a live configuration or a missing firewall rule. Pair it with dependency review, tests, and a diff review on every change. Keep the rules current with the language, including `no-eval` for JavaScript.""",
"""**Статический анализ** (SAST) изучает исходники или собранные артефакты, не запуская приложение. Шпаргалка безопасного просмотра кода OWASP говорит, что автоматические средства дополняют ручной просмотр: они подсвечивают вероятные проблемы, риск зависимостей и антипаттерны, а люди судят о бизнес-логике, авторизации и неверном использовании криптографии. В руководстве Docker по CI статический анализ стоит рядом с линтом и сканированием образов как шаг конвейера.""",
"""Запускайте SAST до человеческого просмотра, чтобы очевидные находки уже были видны. Люди отсеивают ложные срабатывания и тратят время на пробелы средств: обход сценария, гонки и то, покрывает ли проверка роли конкретный объект. Направляйте средства на сборку запросов, пути файлов, `eval` и похожие стоки, десериализацию и зашитые секреты.

Статический анализ не видит живую конфигурацию или отсутствующее правило экрана. Сочетайте его с разбором зависимостей, тестами и просмотром каждого изменения. Держите правила актуальными для языка, включая `no-eval` для JavaScript.""",
"""# Pipeline order from the review sheet: scan, then manual review of what tools cannot judge.
# JavaScript: no-eval, no-implied-eval, no-new-func
""",
[
("OWASP Secure Code Review Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html"),
("OWASP Docker Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What are some common web security compliance standards?",
"""The OWASP pages fetched for this note name several standards that constrain web controls, without replacing the standard's own text. **ISO/IEC 27001** appears as information-security management and risk-based access decisions. **PCI DSS** appears as network segmentation, encrypted communications, access monitoring, and a ban on TLS 1.0 and 1.1. **HIPAA** appears as granular access control, encryption, and audit trails. **GDPR** appears as privacy-by-design, access logging, and breach detection. **FIPS 140** appears when cryptographic modules or password hashes such as PBKDF2 must be validated. **SOC 2** appears next to access control, monitoring, and audit logging.""",
"""Use the standard that matches the data. Cardholder data pulls in PCI DSS and the TLS baseline (TLS 1.3, TLS 1.2 only if you still need it, no SSL). Health data pulls in the HIPAA row: tight access, encryption, trails. Personal data of people in the European Union pulls in the GDPR row and, often, MFA. An information-security management system pulls in ISO 27001's risk-based decisions. Ask SaaS vendors for attestation evidence, which the cloud sheet specifically ties to ISO 27001.

Meeting a named control in a cheat-sheet table is not a certification. Map each obligation to an owner, a technical control, and a log you can show.""",
"""Полученные для этой заметки страницы OWASP называют несколько стандартов, которые ограничивают веб-контроли, не заменяя текст самого стандарта. **ISO/IEC 27001** фигурирует как управление информационной безопасностью и решения о доступе на основе риска. **PCI DSS** — как сегментация сети, шифрованная связь, наблюдение за доступом и запрет TLS 1.0 и 1.1. **HIPAA** — как дробный контроль доступа, шифрование и аудиторские следы. **GDPR** — как privacy-by-design, журнал доступа и обнаружение нарушений. **FIPS 140** — когда криптомодули или хеши паролей вроде PBKDF2 должны быть проверены. **SOC 2** стоит рядом с контролем доступа, мониторингом и журналом аудита.""",
"""Берёте стандарт под данные. Данные держателя карты тянут PCI DSS и базовую линию TLS (TLS 1.3, TLS 1.2 только если он ещё нужен, без SSL). Медицинские данные тянут строку HIPAA: тесный доступ, шифрование, следы. Персональные данные людей в Евросоюзе тянут строку GDPR и часто MFA. Система управления информационной безопасностью тянет решения ISO 27001 на основе риска. У поставщиков SaaS просите свидетельства аттестации, которые облачная шпаргалка прямо связывает с ISO 27001.

Выполнить названный в таблице контроль — не сертификация. Сопоставьте каждое обязательство с владельцем, техническим контролем и журналом, который можно показать.""",
"""# TLS baseline cited with PCI DSS: disable TLS 1.0, TLS 1.1, SSLv2, and SSLv3.
# Default to TLS 1.3; keep TLS 1.2 only when compatibility requires it.
""",
[
("OWASP Zero Trust Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Zero_Trust_Architecture_Cheat_Sheet.html"),
("OWASP Transport Layer Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html"),
("OWASP Secure Cloud Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Cloud_Architecture_Cheat_Sheet.html"),
],
lang="text",
)

add(
"Explain the purpose and key aspects of ISO/IEC 27001.",
"""**ISO/IEC 27001**, as OWASP's Zero Trust sheet summarizes it, is the standard associated with information security management and risk-based access decisions. The secure-cloud sheet says that when you assess a SaaS provider you should ask for attestation records and proof of compliance to standards like ISO 27001.""",
"""In practice that means an information-security management system: decide risk, choose controls, operate them, and keep evidence. The Zero Trust table pairs the standard with risk-based access rather than with a fixed network perimeter. Decisions consider who is asking, the device, and the resource, and they are logged.

For a web system, the evidence is the same material other OWASP sheets already require: threat models, access reviews, encryption in transit and at rest, security logging, and vendor attestations. ISO 27001 does not replace those engineering controls; it is the management frame that shows they were chosen and checked.""",
"""**ISO/IEC 27001**, как её кратко передаёт шпаргалка Zero Trust, — стандарт, связанный с управлением информационной безопасностью и решениями о доступе на основе риска. Облачная шпаргалка говорит: оценивая поставщика SaaS, просите записи аттестации и доказательство соответствия стандартам вроде ISO 27001.""",
"""На практике это система управления информационной безопасностью: оценить риск, выбрать контроли, эксплуатировать их и хранить свидетельства. Таблица Zero Trust связывает стандарт с доступом на основе риска, а не с фиксированным периметром сети. Решения учитывают, кто спрашивает, устройство и ресурс, и они журналируются.

Для веб-системы свидетельства — тот же материал, которого уже требуют другие шпаргалки OWASP: модели угроз, пересмотр доступа, шифрование при передаче и хранении, журналы безопасности и аттестации поставщиков. ISO 27001 не заменяет эти инженерные контроли; это управленческая рамка, которая показывает, что их выбрали и проверили.""",
"""# Ask a SaaS vendor for ISO 27001 attestation evidence.
# Pair it with risk-based access decisions and audit logs.
""",
[
("OWASP Zero Trust Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Zero_Trust_Architecture_Cheat_Sheet.html"),
("OWASP Secure Cloud Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Cloud_Architecture_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What is PCI DSS and its relevance to web security?",
"""**PCI DSS** is the payment-card security standard. OWASP's Zero Trust table associates it with network segmentation, encrypted communications, and access monitoring. The TLS cheat sheet says PCI DSS forbids TLS 1.0 and TLS 1.1. The cryptographic-storage sheet says card data is a prime candidate for not being stored at all, and that PCI DSS tightly constrains storage when you must keep it. FIPS-style limits on algorithms can also apply.""",
"""For a web checkout: terminate TLS at 1.3 (1.2 only for a documented compatibility need), disable SSL and the deprecated TLS versions, segment the card environment from the rest of the network, encrypt what you truly must store, and log access without storing the card number in the log. Prefer a payment provider so the application never sees the full card. Database accounts that touch payment data get least privilege.

A scanner stamp is not the whole obligation. The virtual-patching and authorization sheets still require the application to authorize each operation and to parameterize queries.""",
"""**PCI DSS** — стандарт безопасности платёжных карт. Таблица Zero Trust связывает его с сегментацией сети, шифрованной связью и наблюдением за доступом. Шпаргалка TLS говорит, что PCI DSS запрещает TLS 1.0 и TLS 1.1. Шпаргалка криптохранилища говорит, что данные карты — первый кандидат на то, чтобы их вообще не хранить, а если хранить приходится, PCI DSS жёстко ограничивает хранение. Ограничения на алгоритмы в духе FIPS тоже могут применяться.""",
"""Для веб-оплаты: завершайте TLS на 1.3 (1.2 только при задокументированной нужде в совместимости), отключите SSL и устаревшие версии TLS, отделите среду карт от остальной сети, шифруйте то, что действительно нужно хранить, и журналируйте доступ, не записывая номер карты. Предпочитайте платёжного провайдера, чтобы приложение не видело полную карту. Учётные записи базы, которые касаются платёжных данных, получают наименьшие привилегии.

Отметка сканера — не весь долг. Шпаргалки виртуального патча и авторизации по-прежнему требуют разрешать каждую операцию и параметризовать запросы.""",
"""# PCI DSS, via the TLS cheat sheet: disable TLS 1.0 and TLS 1.1.
# Do not store card data if a payment provider can hold it instead.
""",
[
("OWASP Zero Trust Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Zero_Trust_Architecture_Cheat_Sheet.html"),
("OWASP Transport Layer Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html"),
("OWASP Cryptographic Storage Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html"),
],
lang="text",
)

add(
"Can you discuss the importance of HIPAA compliance in web applications?",
"""**HIPAA**, in OWASP's Zero Trust summary, lines up with granular access controls, data encryption, and audit trails for health-related data. The multifactor sheet adds that healthcare regulations commonly require MFA. A web application that handles that data has to implement those three controls in the application, not only in a policy document.""",
"""Authorize each record on the server, not only by a coarse role: a clinician's session must not read every patient's file merely because the id is known. Encrypt in transit with the TLS baseline and at rest with AES-GCM or an equivalent authenticated mode, keys in a KMS or HSM. Write an audit trail of access, change, and export, and keep the health data itself out of the log line.

MFA belongs on the accounts that can open those records, and again on sensitive changes. Session idle and absolute timeouts limit how long a browser left open remains a door. HIPAA compliance is the obligation to show these controls; the engineering is the same least privilege, encryption, and logging OWASP already describes.""",
"""**HIPAA** в кратком изложении Zero Trust совпадает с дробным контролем доступа, шифрованием данных и аудиторскими следами для данных, связанных со здоровьем. Шпаргалка MFA добавляет, что правила здравоохранения обычно требуют MFA. Веб-приложение, которое обрабатывает такие данные, должно реализовать эти три контроля в приложении, а не только в документе политики.""",
"""Разрешайте каждую запись на сервере, не только грубой ролью: сеанс клинициста не должен читать файл любого пациента лишь потому, что известен id. Шифруйте при передаче по базовой линии TLS и при хранении AES-GCM или равноценным режимом с аутентификацией, ключи — в KMS или HSM. Пишите аудиторский след доступа, изменения и выгрузки и не помещайте сами медицинские данные в строку журнала.

MFA нужна учётным записям, которые открывают эти записи, и снова при чувствительных изменениях. Idle timeout и абсолютный timeout сеанса ограничивают, как долго открытый браузер остаётся дверью. Соответствие HIPAA — обязанность показать эти контроли; инженерия — те же наименьшие привилегии, шифрование и журналирование, которые OWASP уже описывает.""",
"""# HIPAA row: granular access, encryption, audit trails, plus MFA for those accounts.
""",
[
("OWASP Zero Trust Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Zero_Trust_Architecture_Cheat_Sheet.html"),
("OWASP Multifactor Authentication Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"),
],
lang="text",
)
