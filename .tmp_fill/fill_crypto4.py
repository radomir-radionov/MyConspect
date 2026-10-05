#!/usr/bin/env python3
import json
from pathlib import Path

p = Path("/Users/radomir/Documents/business/MyConspect/.tmp_fill/crypto_part1.json")
PAIRS = json.loads(p.read_text())

def add(heading, en, ru):
    PAIRS.append((heading, en.strip(), ru.strip()))

add(
"Describe the concept of secure multi-party computation.",
"""**Definition:**

Secure multi-party computation lets several parties jointly compute a function over inputs that stay distributed, without each party revealing its input. NIST describes the result as what a trusted third party would have computed: correct outputs, and no sharing of the inputs.

**How it works:**

- The parties are often mutually distrustful. The protocol replaces the trusted party. Each party learns the agreed output, not the other parties’ inputs.
- NIST’s privacy-enhancing cryptography project lists MPC next to fully homomorphic encryption and zero-knowledge proofs. FHE is one party computing on ciphertext. MPC is several parties, each holding an input.
- One example on that page is a calculation whose data sits at multiple sources that cannot release the data. The function still runs, and the sources do not publish their rows.
- NIST is also gathering reference material on threshold schemes, and it treats multi-party computation as the baseline paradigm for those schemes. This note does not specify a protocol, a round count, or a library.

**When to use:**

Use MPC when the inputs belong to different parties and none of them should see the others’ inputs, but all of them need the function’s result. If a single worker can compute on ciphertext alone, FHE matches that shape more closely.

**Sources:**

- https://csrc.nist.gov/projects/privacy-enhancing-cryptography
""",
"""**Definition:**

Безопасные многосторонние вычисления позволяют нескольким сторонам совместно вычислить функцию над входами, которые остаются распределёнными, и при этом ни одна сторона не раскрывает свой вход. NIST описывает результат как то, что вычислила бы доверенная третья сторона: верные выходы и без передачи входов.

**How it works:**

- Стороны часто не доверяют друг другу. Протокол заменяет доверенную сторону. Каждая сторона узнаёт согласованный выход, а не входы остальных.
- Проект NIST по криптографии, усиливающей приватность, ставит MPC рядом с полностью гомоморфным шифрованием и доказательствами с нулевым разглашением. FHE — это одна сторона, которая считает над шифртекстом. MPC — это несколько сторон, у каждой свой вход.
- Один пример на той странице — расчёт, данные для которого лежат у нескольких источников, и эти источники не могут отдать данные. Функция всё равно выполняется, а строки источники не публикуют.
- NIST также собирает справочный материал по пороговым схемам и считает многосторонние вычисления базовой парадигмой для этих схем. Эта заметка не задаёт протокол, число раундов или библиотеку.

**When to use:**

Используйте MPC, когда входы принадлежат разным сторонам и ни одна не должна видеть чужие входы, но всем нужен результат функции. Если один исполнитель может считать только над шифртекстом, этой форме ближе FHE.

**Sources:**

- https://csrc.nist.gov/projects/privacy-enhancing-cryptography
""")

add(
"Explain the purpose of post-quantum cryptography.",
"""**Definition:**

Post-quantum cryptography is cryptography meant to stay secure against a future quantum computer. NIST’s project exists to protect information from machines that may be years or decades away and that could defeat many of today’s widely used public-key systems.

**How it works:**

- The algorithms are classical: they run on today’s computers. “Post-quantum” describes the threat they are designed against, not a quantum device you must deploy.
- In August 2024 NIST released three principal standards. FIPS 203 is ML-KEM, a key-encapsulation mechanism. FIPS 204 is ML-DSA, a lattice-based signature. FIPS 205 is SLH-DSA, a stateless hash-based signature.
- NIST says those three should be put into use now and will be the foundation for most deployments. Falcon (signatures) and HQC (key encapsulation) were selected for further standardization.
- Under the timeline in NIST IR 8547, NIST will remove quantum-vulnerable algorithms from its standards by 2035. High-risk systems are expected to move earlier. Migration means finding where the vulnerable algorithms are used and replacing them.
- This is not quantum key distribution. QKD uses quantum states to agree a key. PQC replaces the public-key algorithms a quantum computer would threaten.

**When to use:**

Start with ML-KEM for key establishment and ML-DSA or SLH-DSA for signatures when you are leaving a quantum-vulnerable public-key algorithm. Inventory first, then replace.

**Sources:**

- https://csrc.nist.gov/projects/post-quantum-cryptography
""",
"""**Definition:**

Постквантовая криптография — это криптография, которая должна оставаться стойкой против будущего квантового компьютера. Проект NIST существует, чтобы защитить информацию от машин, которые могут появиться через годы или десятилетия и которые смогут одолеть многие сегодняшние системы с открытым ключом.

**How it works:**

- Алгоритмы классические: они работают на сегодняшних компьютерах. «Постквантовая» описывает угрозу, против которой их проектировали, а не квантовое устройство, которое нужно развернуть.
- В августе 2024 года NIST выпустил три основных стандарта. FIPS 203 — ML-KEM, механизм инкапсуляции ключа. FIPS 204 — ML-DSA, подпись на решётках. FIPS 205 — SLH-DSA, подпись на хешах без состояния.
- NIST говорит, что эти три следует вводить в использование уже сейчас и что они станут основой большинства внедрений. Falcon (подписи) и HQC (инкапсуляция ключа) отобраны для дальнейшей стандартизации.
- По срокам NIST IR 8547 NIST уберёт уязвимые к квантовым вычислениям алгоритмы из своих стандартов к 2035 году. От высокорисковых систем ждут перехода раньше. Миграция означает найти, где уязвимые алгоритмы применяются, и заменить их.
- Это не квантовое распределение ключей. QKD использует квантовые состояния, чтобы согласовать ключ. PQC заменяет алгоритмы с открытым ключом, которым угрожал бы квантовый компьютер.

**When to use:**

Начинайте с ML-KEM для установления ключа и с ML-DSA или SLH-DSA для подписей, когда уходите от уязвимого к квантовым вычислениям алгоритма с открытым ключом. Сначала инвентаризация, затем замена.

**Sources:**

- https://csrc.nist.gov/projects/post-quantum-cryptography
""")

add(
"What is the NIST, and what role does it play in cryptography?",
"""**Definition:**

NIST is the National Institute of Standards and Technology, a U.S. federal laboratory. In cryptography it publishes Federal Information Processing Standards and Special Publications, and it runs the programs that select and validate algorithms and modules.

**How it works:**

- FIPS are the standards federal agencies use for cryptographic modules and for algorithms NIST has standardized. FIPS 140-3 is the current module standard. FIPS 203, 204, and 205 are the principal post-quantum standards released in August 2024.
- Special Publications such as SP 800-57 Part 1 Rev. 5 give key-management guidance, and SP 800-63B gives authenticator requirements, including how passwords are stored.
- The Cryptographic Module Validation Program, a joint effort with the Canadian Centre for Cyber Security, validates modules against those FIPS so agencies have a metric when they buy equipment.
- The post-quantum project ran an international competition and now tells organizations to migrate. NIST’s role there is selection, publication, and a transition timeline, not operation of anyone’s production keys.
- The glossary and the publications are the interview sources. NIST does not replace a vendor’s implementation; it says which algorithms and which module requirements a federal system must meet.

**Sources:**

- https://csrc.nist.gov/projects/post-quantum-cryptography
- https://csrc.nist.gov/projects/cryptographic-module-validation-program
- https://csrc.nist.gov/pubs/fips/140-3/final
""",
"""**Definition:**

NIST — Национальный институт стандартов и технологий, федеральная лаборатория США. В криптографии он публикует федеральные стандарты обработки информации и специальные публикации и ведёт программы, которые отбирают и проверяют алгоритмы и модули.

**How it works:**

- FIPS — стандарты, по которым федеральные агентства применяют криптографические модули и алгоритмы, стандартизованные NIST. FIPS 140-3 — текущий стандарт модулей. FIPS 203, 204 и 205 — основные постквантовые стандарты, выпущенные в августе 2024 года.
- Специальные публикации, такие как SP 800-57 Part 1 Rev. 5, дают руководство по управлению ключами, а SP 800-63B — требования к аутентификаторам, включая то, как хранить пароли.
- Программа проверки криптографических модулей, совместная с Канадским центром кибербезопасности, проверяет модули на соответствие этим FIPS, чтобы у агентств была метрика при закупке оборудования.
- Постквантовый проект провёл международный конкурс и теперь говорит организациям мигрировать. Роль NIST там — отбор, публикация и сроки перехода, а не эксплуатация чьих-то промышленных ключей.
- Глоссарий и публикации — источники для собеседования. NIST не заменяет реализацию поставщика; он говорит, каким алгоритмам и каким требованиям к модулю должна соответствовать федеральная система.

**Sources:**

- https://csrc.nist.gov/projects/post-quantum-cryptography
- https://csrc.nist.gov/projects/cryptographic-module-validation-program
- https://csrc.nist.gov/pubs/fips/140-3/final
""")

add(
"How do cryptographic modules and algorithms get validated (e.g., FIPS 140-2)?",
"""**Definition:**

A cryptographic module is validated under the Cryptographic Module Validation Program against FIPS 140-3, which superseded FIPS 140-2. Independent laboratories test the module. CMVP reviews the submission and, on success, lists the module.

**How it works:**

- FIPS 140-3, published 22 March 2019, defines four increasing qualitative levels. The areas include module specification, interfaces, roles, services, and authentication, software and firmware security, the operating environment, physical security, non-invasive security, management of sensitive security parameters, self-tests, life-cycle assurance, and mitigation of other attacks.
- CMVP is joint work by NIST and the Canadian Centre for Cyber Security. Testing laboratories are accredited by NVLAP. CMVP began accepting FIPS 140-3 submissions on 22 September 2020. It stopped accepting FIPS 140-2 submissions for new certificates; the last new-certificate date in the program table is 22 September 2021, with a narrower exception through 1 April 2022.
- A validated module is Active for 5 years, or 2 years for an interim validation. FIPS 140-2 modules may still be used for new systems through 21 September 2026. After that they move to the Historical list and are only for existing systems.
- For U.S. federal agencies, if cryptography is required, CMVP states that non-validated cryptography is treated as providing no protection: the data is unprotected plaintext. A revoked module may no longer be used.

**When to use:**

Buy or build to FIPS 140-3 when a federal system must cryptographically protect information. Treat a FIPS 140-2 module as a legacy validation with the 21 September 2026 limit for new systems.

**Sources:**

- https://csrc.nist.gov/pubs/fips/140-3/final
- https://csrc.nist.gov/projects/cryptographic-module-validation-program
""",
"""**Definition:**

Криптографический модуль проверяется по программе CMVP на соответствие FIPS 140-3, который сменил FIPS 140-2. Независимые лаборатории испытывают модуль. CMVP рассматривает заявку и при успехе включает модуль в перечень.

**How it works:**

- FIPS 140-3, опубликованный 22 марта 2019 года, задаёт четыре нарастающих качественных уровня. Области включают спецификацию модуля, интерфейсы, роли, сервисы и аутентификацию, безопасность ПО и прошивки, операционную среду, физическую безопасность, неинвазивную безопасность, управление чувствительными параметрами безопасности, самопроверки, гарантии жизненного цикла и смягчение прочих атак.
- CMVP — совместная работа NIST и Канадского центра кибербезопасности. Испытательные лаборатории аккредитует NVLAP. CMVP начал принимать заявки по FIPS 140-3 22 сентября 2020 года. Заявки по FIPS 140-2 на новые сертификаты он перестал принимать; последняя дата новых сертификатов в таблице программы — 22 сентября 2021 года, с более узким исключением до 1 апреля 2022 года.
- Проверенный модуль остаётся в статусе Active 5 лет или 2 года для промежуточной проверки. Модули FIPS 140-2 ещё можно использовать в новых системах до 21 сентября 2026 года. После этого они переходят в исторический перечень и годятся только для существующих систем.
- Для федеральных агентств США, если криптография обязательна, CMVP указывает, что непроверенная криптография считается не дающей защиты: данные рассматриваются как незащищённый открытый текст. Отозванный модуль больше использовать нельзя.

**When to use:**

Покупайте или стройте по FIPS 140-3, когда федеральная система должна криптографически защищать информацию. Модуль FIPS 140-2 считайте устаревшей проверкой с пределом 21 сентября 2026 года для новых систем.

**Sources:**

- https://csrc.nist.gov/pubs/fips/140-3/final
- https://csrc.nist.gov/projects/cryptographic-module-validation-program
""")

add(
"Explain the importance and usage of the Common Criteria for Information Technology Security Evaluation.",
"""**Definition:**

Common Criteria is the governing document that provides a comprehensive, rigorous method for specifying security function and assurance requirements for products and systems. That is the NIST glossary definition, drawn from CNSSI 4009-2022.

**How it works:**

- The method separates what the product claims to do (security functions) from how strongly that claim was examined (assurance). A buyer can ask for a given set of requirements instead of trusting a vendor’s brochure.
- It is a product-evaluation framework. It is not a cipher and not FIPS 140-3. FIPS 140-3 and CMVP validate a cryptographic module. Common Criteria evaluates an IT product against a stated security target.
- NIST SP 800-53 Rev. 5 and SP 800-37 Rev. 2 point at the same glossary entry when they need a name for that evaluation method. Usage is procurement and assurance: require an evaluation against a protection profile or a security target when the buyer needs a third-party examination of the product’s security claims.
- This note does not list evaluation assurance levels, because the glossary page does not define them.

**When to use:**

Use Common Criteria when you need a rigorous statement of a product’s security functions and of the assurance applied to that statement. Use CMVP when the question is specifically whether a cryptographic module meets FIPS 140-3.

**Sources:**

- https://csrc.nist.gov/glossary/term/common_criteria
""",
"""**Definition:**

Common Criteria — руководящий документ, который даёт всеобъемлющий и строгий метод задавать требования к функциям безопасности и к гарантиям для продуктов и систем. Так это определяет глоссарий NIST со ссылкой на CNSSI 4009-2022.

**How it works:**

- Метод отделяет то, что продукт заявляет (функции безопасности), от того, насколько строго это заявление проверили (гарантии). Покупатель может потребовать заданный набор требований, а не верить брошюре поставщика.
- Это каркас оценки продукта. Это не шифр и не FIPS 140-3. FIPS 140-3 и CMVP проверяют криптографический модуль. Common Criteria оценивает ИТ-продукт относительно заявленной цели безопасности.
- NIST SP 800-53 Rev. 5 и SP 800-37 Rev. 2 указывают на ту же статью глоссария, когда им нужно имя этого метода оценки. Применение — закупка и гарантии: требовать оценку относительно профиля защиты или цели безопасности, когда покупателю нужна независимая проверка заявлений продукта о безопасности.
- Эта заметка не перечисляет уровни гарантии оценки, потому что страница глоссария их не определяет.

**When to use:**

Используйте Common Criteria, когда нужно строгое описание функций безопасности продукта и гарантий, применённых к этому описанию. Используйте CMVP, когда вопрос именно в том, соответствует ли криптографический модуль FIPS 140-3.

**Sources:**

- https://csrc.nist.gov/glossary/term/common_criteria
""")

add(
"Describe the purpose of the Transport Layer Security (TLS) protocol and its predecessor SSL.",
"""**Definition:**

TLS lets a client and a server communicate over the Internet in a way designed to prevent eavesdropping, tampering, and message forgery. RFC 8446 specifies TLS 1.3. MDN states that TLS was formerly called SSL.

**How it works:**

- Both are client/server protocols. The server presents a valid digital certificate so the client can confirm its identity. Mutual authentication is possible when the client presents a certificate too.
- TLS 1.3 obsoletes RFC 5246 (TLS 1.2’s previous base, as cited by RFC 8446) in the sense that RFC 8446 is the current protocol specification and also sets new requirements for TLS 1.2 implementations. MDN says major browsers removed TLS 1.0 and 1.1 in early 2020, so a server needs TLS 1.2 or 1.3.
- Forward secrecy in TLS 1.3 comes from (EC)DHE. A pre-shared key used with (EC)DHE keeps it. A pre-shared key used alone loses it for the application data.
- SSL is the predecessor name. New work speaks TLS. The purpose did not change: an authenticated channel that hides and protects the bytes.

**When to use:**

Use TLS 1.3 where both peers support it, and TLS 1.2 where you still need that generation. Do not design for SSL or for TLS 1.0 or 1.1.

**Sources:**

- https://www.rfc-editor.org/rfc/rfc8446#section-1.2
- https://developer.mozilla.org/en-US/docs/Glossary/TLS
""",
"""**Definition:**

TLS позволяет клиенту и серверу общаться через Интернет так, чтобы это было рассчитано на предотвращение подслушивания, подмены и подлога сообщений. RFC 8446 задаёт TLS 1.3. MDN указывает, что TLS раньше назывался SSL.

**How it works:**

- Оба — протоколы клиента и сервера. Сервер предъявляет действительный цифровой сертификат, чтобы клиент мог подтвердить его личность. Взаимная аутентификация возможна, когда сертификат предъявляет и клиент.
- TLS 1.3 отменяет RFC 5246 в том смысле, что RFC 8446 — текущая спецификация протокола и заодно задаёт новые требования к реализациям TLS 1.2. MDN говорит, что крупные браузеры убрали TLS 1.0 и 1.1 в начале 2020 года, поэтому серверу нужен TLS 1.2 или 1.3.
- Прямая секретность в TLS 1.3 идёт от (EC)DHE. Заранее известный ключ вместе с (EC)DHE её сохраняет. Заранее известный ключ сам по себе лишает её данные приложения.
- SSL — предшествующее имя. Новая работа говорит TLS. Назначение не изменилось: аутентифицированный канал, который скрывает байты и защищает их.

**When to use:**

Используйте TLS 1.3, где его поддерживают обе стороны, и TLS 1.2, где всё ещё нужно это поколение. Не проектируйте под SSL и не под TLS 1.0 или 1.1.

**Sources:**

- https://www.rfc-editor.org/rfc/rfc8446#section-1.2
- https://developer.mozilla.org/en-US/docs/Glossary/TLS
""")

add(
"What is the S/MIME standard, and what is it used for?",
"""**Definition:**

S/MIME is Secure/Multipurpose Internet Mail Extensions. RFC 8551 defines version 4.0 as a consistent way to send and receive secure MIME data. It obsoletes RFC 5751.

**How it works:**

- Digital signatures provide authentication, message integrity, and non-repudiation with proof of origin.
- Encryption provides data confidentiality.
- Compression can be used to reduce data size. It is a third operation the RFC lists, not a security service.
- The protected object is MIME data, so the standard fits email and any other MIME body, not a TLS session and not a raw packet.
- The signature and encryption services match the NIST split: a signature does not make the body confidential, and encryption does not by itself prove who sent it. S/MIME can apply both.

**When to use:**

Use S/MIME when the message is MIME and you need signed origin, integrity, or confidentiality of that message as it sits in a mailbox or is forwarded. Use TLS when you need the transport protected, including messages that are not MIME.

**Sources:**

- https://www.rfc-editor.org/rfc/rfc8551#section-1
""",
"""**Definition:**

S/MIME — это Secure/Multipurpose Internet Mail Extensions. RFC 8551 определяет версию 4.0 как согласованный способ отправлять и получать защищённые данные MIME. Он отменяет RFC 5751.

**How it works:**

- Цифровые подписи дают аутентификацию, целостность сообщения и неотказуемость с доказательством происхождения.
- Шифрование даёт конфиденциальность данных.
- Сжатие можно использовать, чтобы уменьшить размер данных. Это третья операция, которую перечисляет RFC, а не сервис безопасности.
- Защищаемый объект — данные MIME, поэтому стандарт подходит почте и любому другому телу MIME, а не сеансу TLS и не голому пакету.
- Сервисы подписи и шифрования совпадают с разделением NIST: подпись не делает тело конфиденциальным, а шифрование само по себе не доказывает, кто отправил. S/MIME может применить и то и другое.

**When to use:**

Используйте S/MIME, когда сообщение — это MIME и нужны подписанное происхождение, целостность или конфиденциальность этого сообщения, пока оно лежит в ящике или пересылается. Используйте TLS, когда нужно защитить транспорт, в том числе для сообщений, которые не являются MIME.

**Sources:**

- https://www.rfc-editor.org/rfc/rfc8551#section-1
""")

add(
"When should you use hardware-based cryptographic modules such as HSMs in an application?",
"""**Definition:**

Use a hardware cryptographic module when the private or secret key must stay inside a module that has been validated for physical security, interfaces, and management of sensitive security parameters. An HSM is that kind of module: the key is used on the device instead of being loaded into ordinary process memory as an exportable file.

**How it works:**

- FIPS 140-3’s requirements include physical security, non-invasive security, roles and authentication, self-tests, and management of sensitive security parameters. Those are the properties you are buying, not a faster CPU.
- CMVP says that for U.S. federal agencies, if cryptography is required, non-validated cryptography is treated as no protection. A validated module is the metric agencies use when they procure equipment.
- The application calls the module for signing or decryption. The private key does not need to leave the module for those operations.
- A software library on a general-purpose server is the right default for low-value development keys. It is the wrong place for a key whose copy would let someone else sign or decrypt production data.

**When to use:**

Use an HSM or another validated hardware module for production signing keys, decryption keys that must survive a host compromise, and any federal system that must meet FIPS 140-3. Prefer a module with a current FIPS 140-3 validation over a new deployment that only has FIPS 140-2.

**Sources:**

- https://csrc.nist.gov/pubs/fips/140-3/final
- https://csrc.nist.gov/projects/cryptographic-module-validation-program
""",
"""**Definition:**

Используйте аппаратный криптографический модуль, когда закрытый или секретный ключ должен оставаться внутри модуля, проверенного на физическую безопасность, интерфейсы и управление чувствительными параметрами безопасности. HSM — такой модуль: ключ применяется на устройстве, а не загружается в обычную память процесса как выгружаемый файл.

**How it works:**

- Требования FIPS 140-3 включают физическую безопасность, неинвазивную безопасность, роли и аутентификацию, самопроверки и управление чувствительными параметрами безопасности. Вы покупаете эти свойства, а не более быстрый процессор.
- CMVP говорит, что для федеральных агентств США, если криптография обязательна, непроверенная криптография считается отсутствием защиты. Проверенный модуль — метрика, которой агентства пользуются при закупке оборудования.
- Приложение вызывает модуль для подписи или расшифрования. Закрытому ключу не нужно покидать модуль для этих операций.
- Программная библиотека на сервере общего назначения — нормальный выбор для малоценных ключей разработки. Это неверное место для ключа, копия которого позволила бы кому-то другому подписывать или расшифровывать промышленные данные.

**When to use:**

Используйте HSM или другой проверенный аппаратный модуль для промышленных ключей подписи, ключей расшифрования, которые должны пережить компрометацию хоста, и любой федеральной системы, которая должна соответствовать FIPS 140-3. Для нового внедрения предпочитайте модуль с текущей проверкой FIPS 140-3, а не только FIPS 140-2.

**Sources:**

- https://csrc.nist.gov/pubs/fips/140-3/final
- https://csrc.nist.gov/projects/cryptographic-module-validation-program
""")

add(
"What are the best practices for managing cryptographic keys within an enterprise?",
"""**Definition:**

Manage keys by the type of key and the security service it provides. NIST SP 800-57 Part 1 Rev. 5 is the general recommendation: which algorithms and key types to use, what protection each type of keying material requires, and which management functions the organization has to operate.

**How it works:**

- Name the service first. Confidentiality, integrity, and origin authentication are different services, and NIST’s glossary does not treat a signature key as a confidentiality key. Use separate keys for signing and for encryption. RFC 8017 already splits RSA signature schemes from RSA encryption schemes.
- Protect each type as that type requires. Secret and private keys need confidentiality. Public keys need integrity, which is what a certificate provides. SP 800-57 is where those protection requirements are specified.
- Generate and store high-value private keys in a module validated under CMVP when the data must be cryptographically protected for a federal system. CMVP treats non-validated cryptography as providing no protection in that case.
- Distribution is part of management. A shared symmetric key has to reach the other party without being copied by anyone else. A public key has to arrive unmodified.
- Passwords are not general-purpose keys. SP 800-63B requires a salted password hash with a cost factor, on an authenticated channel. Do not store them next to encryption keys as raw strings.
- Plan for recovery of encryption keys only when policy allows escrow or backup of that specific key. Do not copy a signing key in order to decrypt.

**Sources:**

- https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final
- https://csrc.nist.gov/projects/cryptographic-module-validation-program
- https://pages.nist.gov/800-63-4/sp800-63b.html
""",
"""**Definition:**

Управляйте ключами по типу ключа и по сервису безопасности, который он даёт. NIST SP 800-57 Part 1 Rev. 5 — общая рекомендация: какие алгоритмы и типы ключей применять, какая защита нужна каждому типу ключевого материала и какие функции управления должна вести организация.

**How it works:**

- Сначала назовите сервис. Конфиденциальность, целостность и аутентификация источника — разные сервисы, и глоссарий NIST не считает ключ подписи ключом конфиденциальности. Для подписи и для шифрования используйте разные ключи. RFC 8017 уже разделяет схемы подписи RSA и схемы шифрования RSA.
- Защищайте каждый тип так, как требует этот тип. Секретным и закрытым ключам нужна конфиденциальность. Открытым ключам нужна целостность, и её даёт сертификат. Требования к этой защите задаёт SP 800-57.
- Порождайте и храните ценные закрытые ключи в модуле, проверенном CMVP, когда данные обязаны быть криптографически защищены для федеральной системы. В этом случае CMVP считает непроверенную криптографию не дающей защиты.
- Распределение — часть управления. Общий симметричный ключ должен дойти до другой стороны так, чтобы его никто больше не скопировал. Открытый ключ должен прибыть неизменным.
- Пароли — не ключи общего назначения. SP 800-63B требует солёный хеш пароля с коэффициентом стоимости и аутентифицированный канал. Не храните их рядом с ключами шифрования как обычные строки.
- Планируйте восстановление ключей шифрования только когда политика разрешает депонирование или резервную копию именно этого ключа. Не копируйте ключ подписи ради расшифрования.

**Sources:**

- https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final
- https://csrc.nist.gov/projects/cryptographic-module-validation-program
- https://pages.nist.gov/800-63-4/sp800-63b.html
""")

p.write_text(json.dumps(PAIRS, ensure_ascii=False, indent=1))
print("count", len(PAIRS))
