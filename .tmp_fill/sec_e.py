add(
"How do you stay informed about the latest web security threats?",
"""OWASP's virtual-patching preparation step is to subscribe to vendor alert lists for the commercial software you run, so a disclosure arrives with patching data instead of as a surprise. The .NET sheet says to watch the security-announcement repositories for the platform. The vulnerable-dependency sheet says to analyze third-party components from the start of the project, not at the end.""",
"""Keep an inventory of applications, libraries, container images, and the operating systems under the pipeline. Turn on dependency and image scanning in CI. Read vendor lists and the feeds those tools use. When a notice arrives, record the identifier, the affected versions, and whether your configuration can hit the issue, then patch or apply a temporary virtual patch while the code fix is prepared.

Threat models and the logging trail show which notices matter to this system. A newsletter with no inventory does not.""",
"""Шаг подготовки в руководстве OWASP по виртуальному патчу — подписаться на списки оповещений поставщиков ПО, которое вы эксплуатируете, чтобы раскрытие приходило вместе с данными об исправлении, а не как сюрприз. Шпаргалка .NET велит следить за репозиториями объявлений безопасности платформы. Шпаргалка уязвимых зависимостей велит разбирать сторонние компоненты с начала проекта, а не в конце.""",
"""Держите инвентарь приложений, библиотек, образов контейнеров и операционных систем под конвейером. Включите сканирование зависимостей и образов в CI. Читайте списки поставщиков и ленты, которыми пользуются эти средства. Когда приходит извещение, запишите идентификатор, затронутые версии и может ли ваша конфигурация попасть в проблему, затем установите исправление или временный виртуальный патч, пока готовится исправление кода.

Модели угроз и след журналов показывают, какие извещения важны этой системе. Рассылка без инвентаря — нет.""",
"""# Watch platform announcement repos and vendor lists.
# Scan dependencies in CI from the first commit, not the week before release.
""",
[
("OWASP Virtual Patching Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Virtual_Patching_Cheat_Sheet.html"),
("OWASP Vulnerable Dependency Management Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html"),
("OWASP DotNet Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/DotNet_Security_Cheat_Sheet.html"),
],
lang="text",
)

add(
"Can you discuss the implications of quantum computing on web security?",
"""OWASP's post-quantum sheet says a sufficiently powerful quantum computer could break RSA, Diffie-Hellman, and elliptic-curve cryptography, which affects public-key encryption, key exchange, and digital signatures. AES is treated differently: prefer AES-256 for margin, while NIST's FAQ cited there still permits AES-128, AES-192, and AES-256. A hybrid TLS key exchange does not make classical certificate signatures quantum-resistant (RFC 9794).""",
"""Inventory every use: transport, stored keys, signatures, HSMs, and backups. Prioritize data that must stay confidential for years and verifiers that are hard to update, because collecting ciphertext now can matter later. Adopt supported implementations, not a home-built combination: ML-KEM (FIPS 203) for key establishment and a separate signature migration such as ML-DSA (FIPS 204). Pilot a hybrid exchange such as X25519MLKEM768 and keep certificate and hostname checks on. Test real clients, proxies, and size limits. Roll out gradually, record negotiated algorithms without logging secrets, and give every classical-only exception an owner and an end date.

Start the inventory even when a dependency cannot migrate yet.""",
"""Шпаргалка OWASP по постквантовой криптографии говорит, что достаточно мощный квантовый компьютер может сломать RSA, Диффи–Хеллмана и криптографию на эллиптических кривых, а это затрагивает шифрование с открытым ключом, обмен ключами и цифровые подписи. AES рассматривается иначе: предпочтителен AES-256 как запас, при этом FAQ NIST, на который там ссылаются, по-прежнему допускает AES-128, AES-192 и AES-256. Гибридный обмен ключами TLS не делает классические подписи сертификатов стойкими к квантовым атакам (RFC 9794).""",
"""Инвентаризируйте каждое применение: транспорт, хранимые ключи, подписи, HSM и резервные копии. В первую очередь данные, которые должны оставаться конфиденциальными годами, и проверяющие стороны, которые трудно обновить, потому что собранный сейчас шифртекст может иметь значение позже. Берите поддерживаемые реализации, а не самодельную комбинацию: ML-KEM (FIPS 203) для установления ключа и отдельную миграцию подписи, например ML-DSA (FIPS 204). Пилотируйте гибридный обмен вроде X25519MLKEM768 и оставляйте проверки сертификата и имени узла. Тестируйте реальных клиентов, прокси и пределы размера. Выкатывайте постепенно, записывайте согласованные алгоритмы без секретов и у каждого исключения «только классика» должны быть владелец и дата окончания.

Начинайте инвентарь, даже если зависимость ещё не может мигрировать.""",
"""# Inventory purpose, algorithm, library, and owner. Store metadata, never key material.
# Prefer AES-256 for stored data; plan ML-KEM for key establishment.
""",
[
("OWASP Post-Quantum Cryptography Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Post_Quantum_Cryptography_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What role does artificial intelligence play in web security?",
"""OWASP's AI-agent sheet describes agents that reason, plan, call tools, keep memory, and take actions. That capability adds risks beyond a single prompt: tool abuse, data leaving through a tool call, memory that affects later sessions, actions without a person, and unbounded loops that run up cost. The defensive role of these controls is to keep an agent inside least privilege.""",
"""Give the agent only the tools that task needs, with read versus write scope. Separate tool sets for internal and user-facing agents. Require an explicit authorization step before a sensitive or irreversible action. Validate tool arguments on the server the same way you validate any other request: schema, parameterized queries, and an authorization check that does not trust the model's claim.

Keep secrets and personal data out of the prompt, the memory store, and the logs. Cap iterations and spend. Treat documents and web pages the agent reads as untrusted input. The JavaScript sheet's rule still applies to any web UI in front of the agent: do not pass model output to `innerHTML`, `dangerouslySetInnerHTML`, `v-html`, or Angular's trust-bypass APIs.""",
"""Шпаргалка OWASP об ИИ-агентах описывает агентов, которые рассуждают, планируют, вызывают инструменты, хранят память и совершают действия. Эта способность добавляет риски сверх одного запроса: злоупотребление инструментами, уход данных через вызов инструмента, память, влияющая на следующие сеансы, действия без человека и неограниченные циклы, которые раздувают стоимость. Защитная роль этих контролей — удержать агента в наименьших привилегиях.""",
"""Давайте агенту только инструменты этой задачи, с разделением чтения и записи. Разделяйте наборы инструментов внутренних и пользовательских агентов. Требуйте явный шаг авторизации перед чувствительным или необратимым действием. Проверяйте аргументы инструментов на сервере так же, как любой другой запрос: схема, параметризованные запросы и проверка авторизации, которая не верит утверждению модели.

Держите секреты и персональные данные вне запроса, хранилища памяти и журналов. Ограничьте число шагов и расход. Считайте документы и страницы, которые читает агент, недоверенным вводом. Правило шпаргалки JavaScript по-прежнему относится к веб-интерфейсу перед агентом: не передавайте вывод модели в `innerHTML`, `dangerouslySetInnerHTML`, `v-html` или API Angular, которые обходят доверие.""",
"""# Least privilege: one tool, one scope. Authorize high-impact actions outside the model.
""",
[
("OWASP AI Agent Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html"),
("OWASP JavaScript and TypeScript Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/JavaScript_and_TypeScript_Security_Cheat_Sheet.html"),
],
lang="text",
)

add(
"How can Internet of Things (IoT) devices create web security risks?",
"""OWASP's Zero Trust sheet lists IoT devices with servers, databases, and user devices as resources that need their own controls. A device is not safe because it sits on an internal network. If a web application trusts that network location, a weak device becomes a path to the application.""",
"""Treat every device session like any other client. Authenticate it, authorize the specific resource, and expire the session. Encrypt the connection regardless of whether the device is "inside." Monitor posture: a device that is not patched or no longer matches policy loses access. Do not reuse a VPN-style grant that opens the whole network once the device connects.

Web APIs that devices call need the same REST controls: HTTPS only, tokens with `iss`, `aud`, and `exp`, and rate limits. Store as little personal data from the device as the feature allows, and delete it on a schedule.""",
"""Шпаргалка Zero Trust перечисляет устройства IoT вместе с серверами, базами и устройствами пользователей как ресурсы, которым нужны собственные контроли. Устройство небезопасно лишь потому, что стоит во внутренней сети. Если веб-приложение доверяет этому месту в сети, слабое устройство становится путём к приложению.""",
"""Относитесь к каждому сеансу устройства как к любому другому клиенту. Аутентифицируйте его, разрешайте конкретный ресурс и завершайте сеанс. Шифруйте соединение независимо от того, «внутри» устройство или нет. Наблюдайте состояние: устройство без исправлений или вне политики теряет доступ. Не выдавайте разрешение в духе VPN, которое открывает всю сеть, как только устройство подключилось.

Веб-API, которые вызывают устройства, нуждаются в тех же контролях REST: только HTTPS, токены с `iss`, `aud` и `exp` и лимиты частоты. Храните с устройства столько персональных данных, сколько позволяет функция, и удаляйте их по расписанию.""",
"""# Zero Trust: an IoT device is a resource. Network location is not authorization.
""",
[
("OWASP Zero Trust Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Zero_Trust_Architecture_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What is Zero Trust security architecture?",
"""**Zero Trust** means never trust by default, including callers already inside the network. OWASP's sheet takes the principles from NIST SP 800-207: every data source and service is a resource; communication is secured wherever it is; access to one resource does not grant another; policy is dynamic; asset posture is measured; authentication and authorization are enforced and rechecked; and telemetry improves later decisions, with privacy limits on that monitoring.""",
"""Three roles cooperate. The policy engine decides. The policy administrator turns the decision into commands. Policy enforcement points — firewalls, proxies, application gateways, API gateways — allow or block. Enforcement is not only at the edge.

Prefer access to a specific application over a broad VPN. A WAF can filter requests as defense in depth and does not replace server-side authorization. Collect logs in a SIEM, exclude sensitive data, and revoke access when posture fails. The same sheet maps these controls onto ISO 27001, PCI DSS, HIPAA, and GDPR obligations.""",
"""**Нулевое доверие** означает не доверять по умолчанию, в том числе вызывающим уже внутри сети. Шпаргалка OWASP берёт принципы из NIST SP 800-207: каждый источник данных и сервис — ресурс; связь защищена где бы она ни была; доступ к одному ресурсу не даёт другой; политика динамическая; состояние активов измеряется; аутентификация и авторизация применяются и перепроверяются; телеметрия улучшает следующие решения, с пределами приватности этого наблюдения.""",
"""Три роли работают вместе. Policy engine решает. Policy administrator превращает решение в команды. Точки применения — экраны, прокси, шлюзы приложений, шлюзы API — разрешают или блокируют. Применение не только на краю.

Предпочитайте доступ к конкретному приложению широкому VPN. WAF может фильтровать запросы как эшелонированную защиту и не заменяет серверную авторизацию. Собирайте журналы в SIEM, исключайте чувствительные данные и отзывайте доступ, когда состояние не соответствует политике. Та же шпаргалка сопоставляет эти контроли с обязанностями ISO 27001, PCI DSS, HIPAA и GDPR.""",
"""# Never trust, always verify. One session authorizes one resource.
""",
[
("OWASP Zero Trust Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Zero_Trust_Architecture_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What is an incident response plan, and why is it critical?",
"""An **incident response plan** is the practiced sequence for what the organization does when a security event happens. OWASP's secure-product sheet lists a practiced plan as part of secure configuration, because it limits damage. The virtual-patching workflow copies the same phases used for IT incident response: preparation, identification, analysis, creating the mitigation, implementation and testing, then recovery and follow-up.""",
"""Preparation is the part that cannot wait for the incident: know assets, have logging that redacts secrets, pre-authorize an emergency control such as a WAF rule, and name who decides. Identification is how you learn, from a vendor notice, a public disclosure, or a live event. Analysis records impact and affected versions. The mitigation might be a code fix, a key rotation, or a temporary virtual patch that is tested against real traffic before it blocks. Follow-up updates the ticket, the threat model, and the plan.

Without the plan, the first hours are spent choosing tools and owners. The product sheet treats that delay as part of the harm.""",
"""**План реагирования на инцидент** — отрепетированная последовательность того, что организация делает, когда происходит событие безопасности. Шпаргалка безопасного продукта называет отрепетированный план частью безопасной конфигурации, потому что он ограничивает ущерб. Процесс виртуального патча копирует те же фазы, что и реагирование на ИТ-инцидент: подготовка, выявление, анализ, создание меры, внедрение и проверка, затем восстановление и разбор.""",
"""Подготовка — часть, которая не может ждать инцидента: знать активы, иметь журналирование без секретов, заранее разрешить аварийный контроль вроде правила WAF и назвать, кто решает. Выявление — как вы узнаёте: извещение поставщика, публичное раскрытие или живое событие. Анализ фиксирует ущерб и затронутые версии. Мера может быть исправлением кода, ротацией ключа или временным виртуальным патчем, который проверяют на живом трафике до блокировки. Разбор обновляет заявку, модель угроз и план.

Без плана первые часы уходят на выбор средств и владельцев. Шпаргалка продукта считает эту задержку частью вреда.""",
"""# Phases: prepare, identify, analyze, mitigate, implement and test, recover and follow up.
""",
[
("OWASP Secure Product Design Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html"),
("OWASP Virtual Patching Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Virtual_Patching_Cheat_Sheet.html"),
],
lang="text",
)

add(
"Explain the steps you would take after discovering a data breach.",
"""After a suspected breach, OWASP's materials point at containment that does not destroy evidence, then a durable fix. The secrets sheet's incident note, echoed by the webhook guidance, is to revoke a compromised secret immediately and replace it; accepting it during an overlap still allows forged use. Cryptographic-storage guidance says to rotate keys when compromise is known or suspected, including when someone who could use the key leaves.""",
"""Preserve logs: copy them to a store the affected system cannot rewrite, which the segmentation sheet illustrates with append-only syslog. Record who accessed what, without collecting more personal data than the investigation needs. Invalidate sessions server-side and denylist stolen token identifiers until they expire. Force credential reset where passwords may be in the taken data, and re-hash with the current algorithm on the next login. Tell users what you cannot protect, which the privacy sheet requires when disclosure is real.

Patch the path that was used, or put a tested virtual patch in front while the code change is built. Update the threat model and the incident plan with what the timeline showed. GDPR-oriented monitoring in the Zero Trust sheet exists so this detection is not optional for personal data.""",
"""После подозрения на нарушение материалы OWASP указывают на сдерживание, которое не уничтожает свидетельства, и затем на устойчивое исправление. Заметка об инциденте в руководстве по секретам, которую повторяет шпаргалка вебхуков: немедленно отозвать скомпрометированный секрет и заменить его; принимать его в период перекрытия всё ещё позволяет подделку. Руководство по криптохранилищу велит ротировать ключи, когда компрометация известна или подозревается, в том числе когда уходит человек, который мог пользоваться ключом.""",
"""Сохраните журналы: скопируйте их в хранилище, которое затронутая система не может переписать; шпаргалка сегментации показывает это на примере syslog только на добавление. Запишите, кто к чему обращался, не собирая персональных данных больше, чем нужно разбору. Инвалидируйте сеансы на сервере и запретите украденные идентификаторы токенов до их истечения. Принудительно сбросьте учётные данные, если пароли могли быть в унесённых данных, и пересчитайте хеш текущим алгоритмом при следующем входе. Скажите пользователям, что вы не можете защитить, — этого требует шпаргалка приватности, когда раскрытие реально.

Исправьте использованный путь или поставьте проверенный виртуальный патч, пока готовится изменение кода. Обновите модель угроз и план инцидента тем, что показала хронология. Наблюдение, ориентированное на GDPR, в шпаргалке Zero Trust существует, чтобы для персональных данных это обнаружение не было необязательным.""",
"""# Revoke the secret now. Overlap is for planned rotation, not for a known compromise.
""",
[
("OWASP Webhook Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Webhook_Security_Cheat_Sheet.html"),
("OWASP Cryptographic Storage Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html"),
("OWASP Network Segmentation Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Network_Segmentation_Cheat_Sheet.html"),
],
lang="text",
)

add(
"How important is user training in preventing web security incidents?",
"""OWASP's threat-modeling sheet says many developers lack security experience, so they miss threats or rank them poorly, and that the remedy is regular training tailored to the team plus security people in the modeling sessions. The CI/CD sheet says education is required before a tool is used to deploy code: secure configuration does not appear by itself.""",
"""Train people on the failures those sheets name: passwords and MFA, not pasting tokens into tickets, reporting a suspected phish, and not bypassing a certificate warning. Train developers on parameterized queries, server-side authorization, and secret storage. Invite security into threat-modeling sessions so the training is about this system.

The mobile sheet notes that security which people cannot use gets bypassed. Training works together with usable controls, not instead of them. A practiced incident plan tells everyone the first call to make.""",
"""Шпаргалка моделирования угроз говорит, что многим разработчикам не хватает опыта в безопасности, поэтому они пропускают угрозы или плохо их ранжируют, и что лекарство — регулярное обучение под команду плюс люди из безопасности на сессиях моделирования. Шпаргалка CI/CD говорит, что обучение нужно до того, как средством начнут выкладывать код: безопасная конфигурация сама не появляется.""",
"""Учите тому, что называют эти шпаргалки: пароли и MFA, не вставлять токены в заявки, сообщать о подозрительном письме и не обходить предупреждение сертификата. Учите разработчиков параметризованным запросам, серверной авторизации и хранению секретов. Приглашайте безопасность на сессии моделирования угроз, чтобы обучение было про эту систему.

Мобильная шпаргалка отмечает, что защиту, которой люди не могут пользоваться, обходят. Обучение работает вместе с удобными контролями, а не вместо них. Отрепетированный план инцидента говорит всем, кому звонить первым.""",
"""# Training topic: report the event, do not "click through" a certificate warning.
""",
[
("OWASP Threat Modeling Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"),
("OWASP CI CD Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html"),
],
lang="text",
)

add(
"Can you discuss the role of a Security Operations Center (SOC)?",
"""OWASP does not define a SOC org chart in the pages used here. It does define the work those teams perform: central logging, a SIEM, and response. The logging sheet says application logs should be consistent so a SIEM or SEM can correlate them. The authorization sheet says to consider sending access-control logs to a centralized log server or SIEM. Zero Trust says to invest in SIEM and analytics or you cannot detect, tune policy, or show compliance.""",
"""The operational role is to collect authentication failures, authorization denials, and other security events; exclude passwords and full bodies; keep clocks aligned; alert on spikes such as webhook signature failures; and start the incident plan. Detection systems (NIDS, HIDS, WAF) are inputs, not a replacement for application logs.

Automated blocking, which Zero Trust lists next to the SIEM, still needs a tested rule and a person who can roll it back. Threat hunting looks for activity the first alert missed. The trail is also what an audit and a breach investigation read later.""",
"""OWASP на использованных здесь страницах не задаёт оргструктуру SOC. Он задаёт работу, которую такие команды выполняют: центральные журналы, SIEM и реагирование. Шпаргалка журналирования говорит, что журналы приложения должны быть согласованными, чтобы SIEM или SEM могли их сопоставить. Шпаргалка авторизации предлагает отправлять журналы контроля доступа на центральный сервер журналов или в SIEM. Zero Trust говорит вкладываться в SIEM и аналитику, иначе нельзя обнаружить, настроить политику или показать соответствие.""",
"""Операционная роль — собирать неудачные аутентификации, отказы авторизации и другие события безопасности; исключать пароли и полные тела; держать часы согласованными; поднимать тревогу на всплески вроде провалов подписи вебхука; запускать план инцидента. Системы обнаружения (NIDS, HIDS, WAF) — входы, не замена журналов приложения.

Автоматическая блокировка, которую Zero Trust ставит рядом с SIEM, всё равно нуждается в проверенном правиле и человеке, который может его откатить. Поиск угроз ищет активность, которую первое оповещение пропустило. Этот след потом читают аудит и разбор нарушения.""",
"""# Ship application security events to a SIEM. Keep secrets out of the event.
""",
[
("OWASP Logging Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"),
("OWASP Zero Trust Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Zero_Trust_Architecture_Cheat_Sheet.html"),
("OWASP Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"),
],
lang="text",
)

add(
"How does web security change when applications are moved to the cloud?",
"""Moving to the cloud changes who operates each layer and adds shared, elastic infrastructure. OWASP's threat-modeling sheet says cloud threat models must include the shared-responsibility split, IAM, managed services, multi-tenant isolation, and infrastructure that appears and disappears. The secure-cloud sheet says to spend assessment effort on threats, likelihood, attack surface, and business impact before buying controls.""",
"""Identity becomes the main boundary. Use short-lived workload credentials instead of keys in images. Segment front end, application, and data. Put a WAF on the load balancer or API gateway as a first filter, and keep authorization in the application. Encrypt with the provider's KMS where the threat model says the application must not hold the key itself. Log to a store the application cannot rewrite.

You still write the same application controls: parameterized queries, session timeouts, security headers, and dependency updates. The provider does not do those for an application you deploy.""",
"""Переезд в облако меняет, кто эксплуатирует каждый слой, и добавляет общую эластичную инфраструктуру. Шпаргалка моделирования угроз говорит, что облачные модели должны включать раздел общей ответственности, IAM, управляемые сервисы, изоляцию многих арендаторов и инфраструктуру, которая появляется и исчезает. Облачная шпаргалка велит до покупки контролей оценить угрозы, вероятность, поверхность и деловой ущерб.""",
"""Главной границей становится идентичность. Используйте короткоживущие учётные данные рабочей нагрузки вместо ключей в образах. Разделяйте фронтенд, приложение и данные. Поставьте WAF на балансировщик или шлюз API как первый фильтр и оставьте авторизацию в приложении. Шифруйте KMS поставщика, где модель угроз говорит, что приложение не должно само держать ключ. Журналируйте в хранилище, которое приложение не может переписать.

Те же контроли приложения вы пишете по-прежнему: параметризованные запросы, таймауты сеансов, заголовки безопасности и обновления зависимостей. Поставщик не делает это за приложение, которое разворачиваете вы.""",
"""# Cloud change: shared responsibility, IAM, and ephemeral infrastructure belong in the threat model.
""",
[
("OWASP Threat Modeling Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"),
("OWASP Secure Cloud Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Cloud_Architecture_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What are the shared responsibility models in cloud security?",
"""The **shared responsibility model** in OWASP's cloud sheet splits duties between the cloud provider and the customer by how much of the stack the provider operates. Physical machines and the data center stay with the provider. Depending on the service, the customer may own everything from the operating system upward, or only configuration and code.""",
"""IaaS: the provider maintains infrastructure; the customer maintains authentication and authorization, data storage and access, some networking such as ports and network ACLs, and the application. PaaS: the customer still controls application authentication and authorization, application software, and external data storage, while the platform hosts the code. SaaS: the provider runs the stack; the customer configures the product, designates administrators, and connects other products. Ask SaaS vendors for attestation such as ISO 27001.

Write down which team patches the OS, rotates keys, and reviews IAM. A control with no owner is the customer's outage even when the provider runs the hardware.""",
"""**Модель общей ответственности** в облачной шпаргалке OWASP делит обязанности поставщика и заказчика по тому, какую часть стека эксплуатирует поставщик. Физические машины и дата-центр остаются у поставщика. В зависимости от сервиса заказчик может владеть всем от операционной системы вверх или только конфигурацией и кодом.""",
"""IaaS: поставщик держит инфраструктуру; заказчик держит аутентификацию и авторизацию, хранение и доступ к данным, часть сети вроде портов и сетевых ACL и приложение. PaaS: заказчик по-прежнему контролирует аутентификацию и авторизацию приложения, ПО приложения и внешнее хранение данных, а платформа размещает код. SaaS: стек ведёт поставщик; заказчик настраивает продукт, назначает администраторов и подключает другие продукты. У поставщиков SaaS просите аттестацию вроде ISO 27001.

Запишите, какая команда обновляет ОС, ротирует ключи и пересматривает IAM. Контроль без владельца — простой заказчика, даже если оборудование ведёт поставщик.""",
"""# IaaS: you own the OS upward. PaaS: you own the app and its data access. SaaS: you own configuration and admins.
""",
[
("OWASP Secure Cloud Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Cloud_Architecture_Cheat_Sheet.html"),
],
en_w="""Choose IaaS when you must control the operating system and can staff it. Choose PaaS when the team should run application code and data access without owning the host. Choose SaaS when the product already exists and you can accept the vendor's stack in exchange for their attestation.""",
ru_w="""Выбирайте IaaS, когда нужно контролировать операционную систему и есть кому её сопровождать. Выбирайте PaaS, когда команда должна вести код приложения и доступ к данным, не владея узлом. Выбирайте SaaS, когда продукт уже есть и вы принимаете стек поставщика в обмен на его аттестацию.""",
lang="text",
)

add(
"Explain how encryption is handled in the cloud.",
"""Cloud encryption uses the same algorithms as anywhere else, with provider key services as the preferred store. OWASP's cryptographic-storage sheet lists a physical or virtual HSM, Amazon KMS, Azure Key Vault, and external secrets managers. These give central management in container fleets, rotation, secure generation, and a harder path to export the key. The cloud architecture sheet says object access should use short-lived workload identity, not a long-lived key embedded in the application.""",
"""Pick the layer from the threat model. Provider disk encryption helps against physical loss of a volume. It does not help if the attacker runs as the application. Application-level AES-GCM with a data key wrapped by a KMS key separates the people who can read ciphertext from the people who can use the key. Keep the wrapped data key with the data only if the wrapping key stays in KMS.

Turn on the provider's encryption for backups and snapshots as part of the same rotation plan. Do not put key material in images, environment variables, or source control. Passwords remain slow hashes, not KMS ciphertext, unless an external system truly requires the original password.""",
"""Облачное шифрование использует те же алгоритмы, что и везде, а предпочтительным хранилищем служат сервисы ключей поставщика. Шпаргалка криптохранилища перечисляет физический или виртуальный HSM, Amazon KMS, Azure Key Vault и внешние менеджеры секретов. Они дают центральное управление в парке контейнеров, ротацию, безопасную генерацию и более трудный вывоз ключа. Облачная шпаргалка говорит, что доступ к объектам должен идти через короткоживущую идентичность рабочей нагрузки, а не через долгий ключ, зашитый в приложение.""",
"""Слой выбирают по модели угроз. Шифрование диска у поставщика помогает против физической потери тома. Оно не помогает, если злоумышленник работает как приложение. AES-GCM на уровне приложения с ключом данных, обёрнутым ключом KMS, разделяет тех, кто может читать шифртекст, и тех, кто может пользоваться ключом. Обёрнутый ключ данных можно хранить с данными, только если оборачивающий ключ остаётся в KMS.

Включите шифрование поставщика для резервных копий и снимков в том же плане ротации. Не кладите ключевой материал в образы, переменные окружения или исходники. Пароли остаются медленными хешами, а не шифртекстом KMS, если только внешняя система правда не требует исходный пароль.""",
"""# Store the key in the provider KMS. The application asks to use the key; it does not embed it.
""",
[
("OWASP Cryptographic Storage Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html"),
("OWASP Secure Cloud Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Cloud_Architecture_Cheat_Sheet.html"),
],
lang="text",
)

add(
"What special considerations are there for web security with cloud storage services?",
"""OWASP's cloud sheet gives object storage three access modes: IAM policies, cryptographically signed URLs, and public objects. The secure default for application data is IAM through a workload identity with short-lived credentials and permissions limited to the operations and resources required. Public storage exposes the object to anyone who has the URL. The authorization sheet calls out poorly secured cloud buckets as a standing problem and says static files belong in the same access policy as other resources.""",
"""Do not ship a long-lived access key in the image or the repository. Separate keys from data: ciphertext in the bucket, wrapping keys in KMS. Classify objects so logs and exports are not world-readable. Turn off public listing. Sign URLs only for a specific object and a short lifetime when a browser must fetch directly. Log access. Apply the file-upload rules if users can write objects: allow-listed types, size limits, and names the server chooses.

A bucket policy is not a substitute for checking, in the application, that this user may read this object.""",
"""Облачная шпаргалка OWASP даёт объектному хранилищу три режима доступа: политики IAM, криптографически подписанные URL и публичные объекты. Безопасный вариант по умолчанию для данных приложения — IAM через идентичность рабочей нагрузки с короткоживущими учётными данными и правами только на нужные операции и ресурсы. Публичное хранилище открывает объект любому, у кого есть URL. Шпаргалка авторизации называет плохо закрытые облачные бакеты постоянной проблемой и говорит, что статические файлы входят в ту же политику доступа, что и другие ресурсы.""",
"""Не кладите долгий ключ доступа в образ или репозиторий. Отделяйте ключи от данных: шифртекст в бакете, оборачивающие ключи в KMS. Классифицируйте объекты, чтобы журналы и выгрузки не были читаемы всем. Выключите публичный список. Подписывайте URL только для конкретного объекта и на короткий срок, когда браузер должен забрать файл напрямую. Журналируйте доступ. Если пользователи могут писать объекты, применяйте правила загрузки файлов: разрешённые типы, пределы размера и имена, которые выбирает сервер.

Политика бакета не заменяет проверку в приложении, что этот пользователь может читать этот объект.""",
"""# Workload identity with short-lived credentials. Do not embed a persistent access key.
""",
[
("OWASP Secure Cloud Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Cloud_Architecture_Cheat_Sheet.html"),
("OWASP Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"),
],
lang="text",
)

add(
"How does a Web Application Firewall (WAF) protect cloud-hosted web applications?",
"""A **web application firewall** monitors or blocks common attack payloads, or allows only specific request types and patterns. OWASP's cloud sheet says to attach it to entry points such as load balancers or API gateways as a first line of defense. Provider rule sets (AWS Managed Rules, GCP WAF rules, Azure core rule sets) cover generic cases and will not cover every issue an application has, so custom rules should match this application's routes and fields. Zero Trust adds that a WAF, including rules such as OWASP CRS, is defense in depth and does not replace authorization or business rules in server-side code.""",
"""The virtual-patching sheet defines the temporary use: an enforcement layer that blocks attempts it recognizes against a known vulnerability while the code is fixed. Start in log-only mode, test real user flows, then block. Positive rules that describe valid input are preferred to a pattern copied from one report. Log the rule id and outcome, and redact bodies so the WAF log is not a second copy of passwords.

A WAF sees only traffic that passes through it. Direct paths to the origin bypass it. Keep parameterized queries and server-side checks anyway.""",
"""**Межсетевой экран веб-приложений** наблюдает или блокирует распространённые вредоносные нагрузки либо пропускает только определённые типы и шаблоны запросов. Облачная шпаргалка OWASP велит вешать его на точки входа вроде балансировщиков или шлюзов API как первую линию. Наборы правил поставщика (AWS Managed Rules, правила GCP WAF, базовые наборы Azure) закрывают общие случаи и не закроют каждую проблему приложения, поэтому свои правила должны совпадать с маршрутами и полями этого приложения. Zero Trust добавляет, что WAF, включая правила вроде OWASP CRS, — эшелонированная защита и не заменяет авторизацию или бизнес-правила в серверном коде.""",
"""Шпаргалка виртуального патча задаёт временное применение: слой, который блокирует узнанные попытки против известной уязвимости, пока чинят код. Начните в режиме только журнала, проверьте живые сценарии пользователей, затем блокируйте. Правила, которые описывают допустимый ввод, предпочтительнее шаблона, скопированного из одного отчёта. Журналируйте id правила и исход и вырезайте тела, чтобы журнал WAF не стал второй копией паролей.

WAF видит только трафик, который через него проходит. Прямые пути к origin его обходят. Параметризованные запросы и серверные проверки всё равно оставляйте.""",
"""# Attach the WAF to the load balancer or API gateway.
# Log only, then block. Authorization stays in application code.
""",
[
("OWASP Secure Cloud Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Cloud_Architecture_Cheat_Sheet.html"),
("OWASP Zero Trust Architecture Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Zero_Trust_Architecture_Cheat_Sheet.html"),
("OWASP Virtual Patching Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Virtual_Patching_Cheat_Sheet.html"),
],
lang="text",
)
