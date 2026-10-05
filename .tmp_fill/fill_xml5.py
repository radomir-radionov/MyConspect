#!/usr/bin/env python3
import json
from pathlib import Path
p = Path("/Users/radomir/Documents/business/MyConspect/.tmp_fill/xml_pairs.json")
PAIRS = json.loads(p.read_text())

def add(h, en, ru):
    PAIRS.append((h, en.strip(), ru.strip()))

add("What is the purpose of XML data validation and how is it performed?",
"""**Definition:**

Validation checks a well-formed document against a grammar. In XML 1.0, a document is valid if it has a document type declaration and complies with the constraints in it. XML Schema is the later grammar that constrains structure and datatypes, including namespaced documents.

**How it works:**

- Well-formedness comes first: one root, nested tags, legal characters. A document can be well-formed and not valid.
- DTD validation uses the document type declaration, which must appear before the first element. A validating processor also reports which white space in element content is ignorable.
- Schema validation uses the components in the schema: element and attribute declarations and simple and complex types. Java’s `DocumentBuilder.isValidating()` reports whether that parser was configured to validate, and `getSchema()` returns the `Schema` in use, or null.
- Jakarta XML Binding can validate while unmarshalling or marshalling, and its specification also describes disabling schema validation when you intentionally skip that check.
- Failure means the document does not match the grammar. It does not mean the bytes were unreadable.

**Sources:**

- https://www.w3.org/TR/xml/#sec-prolog-dtd
- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/parsers/DocumentBuilder.html
""",
"""**Definition:**

Проверка сверяет правильно сформированный документ с грамматикой. В XML 1.0 документ действителен, если у него есть объявление типа документа и он соответствует ограничениям в нём. XML Schema — более поздняя грамматика, которая ограничивает структуру и типы данных, включая документы с пространствами имён.

**How it works:**

- Сначала правильная сформированность: один корень, вложенные теги, допустимые символы. Документ может быть правильно сформирован и не быть действительным.
- Проверка DTD использует объявление типа документа, которое должно стоять до первого элемента. Проверяющий процессор также сообщает, какие пробелы в содержимом элемента игнорируемы.
- Проверка схемой использует компоненты схемы: объявления элементов и атрибутов и простые и сложные типы. Java `DocumentBuilder.isValidating()` сообщает, настроен ли этот разборщик на проверку, а `getSchema()` возвращает используемую `Schema` или null.
- Jakarta XML Binding может проверять при демаршалинге или маршалинге, и его спецификация также описывает отключение проверки схемой, когда эту проверку намеренно пропускают.
- Неудача значит, что документ не совпал с грамматикой. Это не значит, что байты нельзя было прочитать.

**Sources:**

- https://www.w3.org/TR/xml/#sec-prolog-dtd
- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/parsers/DocumentBuilder.html
""")

add("Describe the concept of XML data transformation and its techniques.",
"""**Definition:**

Transformation takes an XML document and produces another document. XSLT is the language the W3C specifies for transforming XML into other XML, using XPath to address the source.

**How it works:**

- A stylesheet matches nodes and builds a result. XSLT 3.0 shares the XPath 3.0 data model. Paths select; templates write.
- Streaming in XSLT 3.0 transforms without holding the entire source or the entire result in memory. That is the technique for large inputs. A DOM-based transform holds the tree first: parse with `DOMParser` or `DocumentBuilder`, then walk it.
- SAX can feed a transform without a tree. `TransformerHandler` is a `ContentHandler`, so the parser’s events are the transform’s input.
- XQuery is the related technique when the job is a query across sources that returns a new structure, including JSON maps and arrays in XQuery 3.1, rather than a stylesheet applied to one document.
- Application code is the third technique: read events or a tree and write the output yourself. Use it when the mapping is not a good fit for a declarative stylesheet.

**Sources:**

- https://www.w3.org/TR/xslt-30/#intro
- https://www.w3.org/TR/xquery-31/#id-introduction
- https://developer.mozilla.org/en-US/docs/Web/XML/XPath
""",
"""**Definition:**

Преобразование берёт XML-документ и создаёт другой документ. XSLT — язык, который W3C задаёт для преобразования XML в другой XML, используя XPath, чтобы адресовать источник.

**How it works:**

- Таблица стилей сопоставляет узлы и строит результат. XSLT 3.0 делит модель данных с XPath 3.0. Пути выбирают; шаблоны пишут.
- Потоковый режим в XSLT 3.0 преобразует, не держа в памяти весь источник или весь результат. Это приём для больших входов. Преобразование на DOM сначала держит дерево: разбор через `DOMParser` или `DocumentBuilder`, затем обход.
- SAX может подать преобразование без дерева. `TransformerHandler` — это `ContentHandler`, поэтому события разборщика и есть вход преобразования.
- XQuery — родственный приём, когда задача — запрос по источникам, который возвращает новую структуру, включая карты и массивы JSON в XQuery 3.1, а не таблица стилей к одному документу.
- Код приложения — третий приём: читать события или дерево и писать выход самим. Его используют, когда отображение плохо ложится на декларативную таблицу стилей.

**Sources:**

- https://www.w3.org/TR/xslt-30/#intro
- https://www.w3.org/TR/xquery-31/#id-introduction
- https://developer.mozilla.org/en-US/docs/Web/XML/XPath
""")

add("What are some best practices for XML performance optimization?",
"""**Definition:**

XML performance is dominated by whether you build a tree, how large the document is, and whether external grammars are fetched. Choose the API that matches the access pattern.

**How it works:**

- `XMLStreamReader` is specified as forward, read-only, and the lowest-level efficient read. Use it, or SAX `ContentHandler`, for one pass over a large file. `DocumentBuilder.parse` and `DOMParser.parseFromString()` hold the whole tree.
- XSLT 3.0 streaming exists so a transform need not hold the entire source or result. Use it when the stylesheet can be written that way. A DOM transform pays for the tree first.
- Do not fetch a DTD or schema on every parse when you already have the file. `DocumentBuilder.setEntityResolver` points external identifiers at a local `InputSource`.
- `DocumentBuilder.reset()` returns a builder to the state it had after `newDocumentBuilder()`, so a process can reuse the builder instead of constructing one per document. The reset builder is not guaranteed to be the same resolver object, only a functionally equal one.
- MDN’s note on `DocumentFragment` is the opposite caution: assembling a fragment is not automatically faster than appending nodes, and readability wins when the difference is marginal. Do not add a fragment only as a performance trick.
- Binding with Jakarta XML Binding allocates an object graph. That is the wrong tool when you only need to filter elements.

**Sources:**

- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/stream/XMLStreamReader.html
- https://www.w3.org/TR/xslt-30/#intro
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/parsers/DocumentBuilder.html
""",
"""**Definition:**

Производительность XML определяется тем, строите ли вы дерево, насколько велик документ и забираются ли внешние грамматики по сети. Выбирайте API под способ доступа.

**How it works:**

- `XMLStreamReader` задан как чтение только вперёд и только для чтения и как самый низкоуровневый эффективный способ читать. Используйте его или SAX `ContentHandler` для одного прохода по большому файлу. `DocumentBuilder.parse` и `DOMParser.parseFromString()` держат всё дерево.
- Потоковый XSLT 3.0 существует, чтобы преобразованию не нужно было держать весь источник или весь результат. Используйте его, когда таблицу стилей можно так записать. Преобразование на DOM сначала платит за дерево.
- Не забирайте DTD или схему при каждом разборе, если файл уже есть. `DocumentBuilder.setEntityResolver` направляет внешние идентификаторы на локальный `InputSource`.
- `DocumentBuilder.reset()` возвращает построитель в состояние после `newDocumentBuilder()`, чтобы процесс переиспользовал построитель, а не создавал его на каждый документ. После сброса не гарантируется тот же объект распознавателя, только функционально равный.
- Замечание MDN про `DocumentFragment` — обратная осторожность: сборка фрагмента не автоматически быстрее, чем добавление узлов, и при ничтожной разнице выигрывает читаемость. Не добавляйте фрагмент только как трюк производительности.
- Привязка через Jakarta XML Binding выделяет граф объектов. Это неверный инструмент, когда нужно только отфильтровать элементы.

**Sources:**

- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/stream/XMLStreamReader.html
- https://www.w3.org/TR/xslt-30/#intro
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/parsers/DocumentBuilder.html
""")

add("Explain the concept of XML security and its key considerations.",
"""**Definition:**

XML security is the set of W3C mechanisms that sign XML, encrypt XML, and put signed bytes into a canonical form, plus the ordinary XML rules that keep a parser from treating data as markup.

**How it works:**

- Integrity and signer authentication are XML Signature: a signature over data inside the document or elsewhere. Confidentiality is XML Encryption: an encryption element that contains or references cipher data, which may be one element or element content.
- Canonical XML 1.1 gives the byte sequence those signatures hash, so attribute order and namespace syntax do not change the signed value. XML Signature 1.1 requires that canonicalization.
- The parser’s job is separate. Character data must escape `<` and `&`, or use a CDATA section whose only special sequence is `]]>`. External entities are resolved through an `EntityResolver`. Point that resolver at local copies you trust rather than at whatever a document asks the network to fetch.
- XKMS distributes and registers the public keys those signatures and encryption steps use. The key is not inside the algorithm; it has to be bound to the party.
- None of these replace TLS on the wire. They protect the XML document as a document, including after it is stored or forwarded.

**Sources:**

- https://www.w3.org/TR/xmldsig-core1/#sec-Overview
- https://www.w3.org/TR/xmlenc-core1/#sec-Overview
- https://www.w3.org/TR/xml-c14n11/#sec-Intro
""",
"""**Definition:**

Безопасность XML — это набор механизмов W3C, которые подписывают XML, шифруют XML и приводят подписанные байты к канонической форме, плюс обычные правила XML, которые не дают разборщику принять данные за разметку.

**How it works:**

- Целостность и аутентификация подписавшего — это XML Signature: подпись над данными внутри документа или снаружи. Конфиденциальность — XML Encryption: элемент шифрования, который содержит шифрданные или ссылается на них; это может быть один элемент или содержимое элемента.
- Canonical XML 1.1 даёт последовательность байтов, которую эти подписи хешируют, чтобы порядок атрибутов и синтаксис пространств имён не меняли подписанное значение. XML Signature 1.1 требует эту канонизацию.
- Работа разборщика отдельно. Символьные данные должны экранировать `<` и `&` или использовать секцию CDATA, у которой особая последовательность только `]]>`. Внешние сущности разрешаются через `EntityResolver`. Направляйте этот распознаватель на локальные копии, которым доверяете, а не на то, что документ просит забрать из сети.
- XKMS распространяет и регистрирует открытые ключи, которые используют эти шаги подписи и шифрования. Ключ не внутри алгоритма; его нужно связать со стороной.
- Ничто из этого не заменяет TLS на проводе. Они защищают XML-документ как документ, в том числе после хранения или пересылки.

**Sources:**

- https://www.w3.org/TR/xmldsig-core1/#sec-Overview
- https://www.w3.org/TR/xmlenc-core1/#sec-Overview
- https://www.w3.org/TR/xml-c14n11/#sec-Intro
""")

add("What is XML Signature and how does it ensure data integrity?",
"""**Definition:**

An XML Signature is an XML structure whose verification succeeds only if the signed data still matches the digest that was signed. The recommendation defines that as an integrity service, together with message authentication and signer authentication.

**How it works:**

- The data may be inside the same XML or elsewhere. The signature processing rules select the bytes, canonicalize XML when the data is XML, hash them, and check that value with the signature.
- Canonical XML 1.1 is what makes the byte sequence stable. Without it, a change in attribute order would change the hash even though the logical document did not change. With it, a real change in the text changes the canonical form and the digest no longer matches.
- XML Signature 1.1 requires Canonical XML 1.1 and names the hash algorithms that are part of conformance. The hash is the integrity check. A weak hash undermines it, which is why the recommendation added further hash algorithms.
- Verification uses the public key. It does not decrypt the payload. Hiding the payload is XML Encryption.

**Sources:**

- https://www.w3.org/TR/xmldsig-core1/#sec-Overview
- https://www.w3.org/TR/xml-c14n11/#sec-Intro
""",
"""**Definition:**

XML Signature — структура XML, проверка которой проходит, только если подписанные данные всё ещё совпадают с подписанным дайджестом. Рекомендация определяет это как сервис целостности вместе с аутентификацией сообщения и аутентификацией подписавшего.

**How it works:**

- Данные могут быть внутри того же XML или в другом месте. Правила обработки подписи выбирают байты, канонизируют XML, когда данные — это XML, хешируют их и проверяют это значение подписью.
- Canonical XML 1.1 делает последовательность байтов устойчивой. Без него смена порядка атрибутов меняла бы хеш, хотя логический документ не изменился. С ним настоящее изменение текста меняет каноническую форму, и дайджест больше не совпадает.
- XML Signature 1.1 требует Canonical XML 1.1 и называет алгоритмы хеша, которые входят в соответствие. Хеш и есть проверка целостности. Слабый хеш её подрывает, поэтому рекомендация добавила дополнительные алгоритмы хеша.
- Проверка использует открытый ключ. Она не расшифровывает нагрузку. Скрытие нагрузки — это XML Encryption.

**Sources:**

- https://www.w3.org/TR/xmldsig-core1/#sec-Overview
- https://www.w3.org/TR/xml-c14n11/#sec-Intro
""")

add("Explain the concept of XML Encryption and its role in data confidentiality.",
"""**Definition:**

XML Encryption’s role is confidentiality: data is encrypted and the result is represented as XML. The recommendation says the result is an XML Encryption element that contains or references the cipher data.

**How it works:**

- The input may be an octet stream or XML: a whole document, one element, or the content of an element. Encrypting element content leaves the surrounding tags visible and hides what was inside.
- The recipient decrypts with the key information associated with that encryption element. The ciphertext is not useful without that key.
- Confidentiality here is about the document, not about the TLS session that carried it. A stored message stays confidential only if this encryption, or an equivalent, was applied.
- It does not provide the integrity service. A ciphertext can still be replaced. Pair it with XML Signature when you also need to detect a change and identify the signer.

**Sources:**

- https://www.w3.org/TR/xmlenc-core1/#sec-Overview
- https://www.w3.org/TR/xmldsig-core1/#sec-Overview
""",
"""**Definition:**

Роль XML Encryption — конфиденциальность: данные шифруют, и результат представляют как XML. Рекомендация говорит, что результат — элемент XML Encryption, который содержит шифрданные или ссылается на них.

**How it works:**

- Вход может быть потоком октетов или XML: целым документом, одним элементом или содержимым элемента. Шифрование содержимого элемента оставляет окружающие теги видимыми и скрывает то, что было внутри.
- Получатель расшифровывает по сведениям о ключе, связанным с этим элементом шифрования. Без этого ключа шифртекст бесполезен.
- Конфиденциальность здесь про документ, а не про сеанс TLS, который его вёз. Хранимое сообщение остаётся конфиденциальным, только если применено это шифрование или равносильное.
- Сервис целостности оно не даёт. Шифртекст всё ещё можно подменить. Сочетайте его с XML Signature, когда нужно ещё и заметить изменение и опознать подписавшего.

**Sources:**

- https://www.w3.org/TR/xmlenc-core1/#sec-Overview
- https://www.w3.org/TR/xmldsig-core1/#sec-Overview
""")

add("What is the purpose of XML Digital Signatures and how are they created?",
"""**Definition:**

The purpose is integrity, message authentication, and signer authentication for any data, inside the signature document or outside it. Creation follows the XML Signature processing rules: select the data, canonicalize XML, hash, and sign.

**How it works:**

- The signature element records what was signed, which canonicalization and hash algorithms were used, and the signature value. Version 1.1 requires Canonical XML 1.1 so the hashed bytes do not depend on insignificant syntax.
- Hash algorithms are part of the signature. The 1.1 recommendation extended the set that implementations must handle, including additional hashes and Elliptic Curve DSA, because the digest is what later verification recomputes.
- The private key produces the signature value. Verifiers use the public key. NIST’s description of a digital signature is the same operation: private key signs, public key verifies, and the result is not confidentiality.
- Creating a signature does not encrypt the referenced data. If the data must be hidden, apply XML Encryption as a separate step and sign the result you need protected.

**Sources:**

- https://www.w3.org/TR/xmldsig-core1/#sec-Overview
- https://www.w3.org/TR/xml-c14n11/#sec-Intro
""",
"""**Definition:**

Назначение — целостность, аутентификация сообщения и аутентификация подписавшего для любых данных, внутри документа подписи или снаружи. Создание следует правилам обработки XML Signature: выбрать данные, канонизировать XML, хешировать и подписать.

**How it works:**

- Элемент подписи записывает, что подписано, какие алгоритмы канонизации и хеша использованы и значение подписи. Версия 1.1 требует Canonical XML 1.1, чтобы хешируемые байты не зависели от незначащего синтаксиса.
- Алгоритмы хеша — часть подписи. Рекомендация 1.1 расширила набор, который реализации должны поддерживать, включая дополнительные хеши и Elliptic Curve DSA, потому что дайджест — это то, что проверка потом пересчитывает.
- Закрытый ключ создаёт значение подписи. Проверяющие используют открытый ключ. Описание цифровой подписи у NIST — та же операция: закрытый ключ подписывает, открытый проверяет, и результат — не конфиденциальность.
- Создание подписи не шифрует данные, на которые она ссылается. Если данные надо скрыть, примените XML Encryption отдельным шагом и подпишите тот результат, который нужно защитить.

**Sources:**

- https://www.w3.org/TR/xmldsig-core1/#sec-Overview
- https://www.w3.org/TR/xml-c14n11/#sec-Intro
""")

add("Describe the concept of XML Key Management and its importance.",
"""**Definition:**

XML Key Management (XKMS) specifies protocols for distributing and registering public keys, for use with XML Signature and XML Encryption. It has two parts: X-KISS, the key information service, and X-KRSS, the key registration service.

**How it works:**

- A signature is only as useful as the binding between the public key and the signer. XKMS is how a client asks a service to locate and validate that key information instead of doing every trust decision locally.
- X-KRSS is the registration side: a holder registers a public key with the service. X-KISS is the query side: a verifier asks what a key means.
- The recommendation is explicit that these protocols are suitable for use in conjunction with the XML Signature and XML Encryption recommendations. They do not replace those processing rules.
- Importance follows from that split. Encryption and signature algorithms do not name the person. Key management does. Without a registered, locatable public key, a verifier cannot decide whose signature it just checked.

**Sources:**

- https://www.w3.org/TR/xkms2/#sec-Introduction
""",
"""**Definition:**

Управление ключами XML (XKMS) задаёт протоколы распространения и регистрации открытых ключей для использования с XML Signature и XML Encryption. У него две части: X-KISS, сервис сведений о ключах, и X-KRSS, сервис регистрации ключей.

**How it works:**

- Подпись полезна лишь настолько, насколько крепка связь открытого ключа и подписавшего. XKMS — это то, как клиент просит сервис найти и проверить эти сведения о ключе, вместо того чтобы принимать каждое решение о доверии локально.
- X-KRSS — сторона регистрации: владелец регистрирует открытый ключ в сервисе. X-KISS — сторона запроса: проверяющий спрашивает, что ключ означает.
- Рекомендация прямо говорит, что эти протоколы подходят для использования вместе с рекомендациями XML Signature и XML Encryption. Они не заменяют правила обработки тех рекомендаций.
- Важность следует из этого разделения. Алгоритмы шифрования и подписи не называют человека. Управление ключами называет. Без зарегистрированного и находимого открытого ключа проверяющий не может решить, чью подпись он только что проверил.

**Sources:**

- https://www.w3.org/TR/xkms2/#sec-Introduction
""")

add("What is the role of XML in web services and service-oriented architectures (SOA)?",
"""**Definition:**

In a service-oriented system, XML is the message format that carries a self-describing request or response between services. SOAP 1.2 defines that message as an XML construct that can travel over different underlying protocols.

**How it works:**

- SOAP’s messaging framework is extensible and decentralized. The envelope is XML, so intermediaries can see the structure, route on headers, and leave the payload in its own namespace.
- The payload can be described by a schema: element declarations and complex types say what a valid body contains. Validation at the edge rejects a well-formed message that does not match the contract.
- XML Signature and XML Encryption apply to the message as a document, which matters when the message is stored or passes through a hop that is not the original TLS session.
- XKMS is the companion for the public keys those services use. The architecture is: schema for the contract, SOAP for the envelope, signature and encryption for the document, namespaces so each service’s vocabulary stays distinct.
- A later HTTP API may send JSON instead. That does not change what XML’s role was in the SOAP-based service layer: the typed, namespaced message.

**Sources:**

- https://www.w3.org/TR/soap12-part1/#intro
- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
- https://www.w3.org/TR/xml-names/#ns-decl
""",
"""**Definition:**

В сервис-ориентированной системе XML — формат сообщения, который несёт самоописываемый запрос или ответ между сервисами. SOAP 1.2 определяет это сообщение как конструкцию XML, которая может идти по разным нижележащим протоколам.

**How it works:**

- Каркас сообщений SOAP расширяем и децентрализован. Конверт — XML, поэтому посредники видят структуру, маршрутизируют по заголовкам и оставляют нагрузку в её собственном пространстве имён.
- Нагрузку можно описать схемой: объявления элементов и сложные типы говорят, что содержит действительное тело. Проверка на границе отвергает правильно сформированное сообщение, которое не совпало с контрактом.
- XML Signature и XML Encryption применяются к сообщению как к документу, и это важно, когда сообщение хранят или оно проходит узел, который не является исходным сеансом TLS.
- XKMS — спутник для открытых ключей, которые эти сервисы используют. Архитектура такая: схема для контракта, SOAP для конверта, подпись и шифрование для документа, пространства имён, чтобы словарь каждого сервиса оставался отдельным.
- Более поздний HTTP API может слать JSON. Это не меняет роль XML в слое сервисов на SOAP: типизированное сообщение с пространствами имён.

**Sources:**

- https://www.w3.org/TR/soap12-part1/#intro
- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
- https://www.w3.org/TR/xml-names/#ns-decl
""")

add("Explain the concept of XML-based protocols such as SOAP and REST.",
"""**Definition:**

SOAP 1.2 is an XML protocol: a lightweight messaging framework whose message is an XML construct exchanged over an underlying protocol. REST is not an XML protocol. MDN defines REST as architecture constraints for distributed systems, and notes that HTTP APIs are often called REST even when they do not meet every constraint.

**How it works:**

- A SOAP message is XML. Namespaces separate the envelope from the payload. The framework is extensible, and the same message construct can be carried by more than one transport. Part 1 is the messaging framework, not a programming API.
- A REST interaction transfers a representation of a resource using standard client/server operations. The representation may be XML, or it may be something else. Nothing in the REST constraints requires an XML envelope, a WSDL description, or a SOAP header.
- Choosing SOAP means choosing XML as the message and, usually, a schema as the contract, plus XML Signature or XML Encryption when the document itself must be protected.
- Choosing a REST-style HTTP API means choosing the resource and the HTTP method. If the representation is XML, the XML rules still apply: one root, namespaces if you mix vocabularies, and a schema if you validate. The protocol is still HTTP.

**When to use:**

Use SOAP when the contract is an XML message that must travel unchanged across intermediaries. Use HTTP with an XML or non-XML representation when the client is calling resources with ordinary web tools, which is the sense in which MDN says beginners can treat a REST API as an HTTP service.

**Sources:**

- https://www.w3.org/TR/soap12-part1/#intro
- https://developer.mozilla.org/en-US/docs/Glossary/REST
""",
"""**Definition:**

SOAP 1.2 — протокол на XML: лёгкий каркас сообщений, чьё сообщение — конструкция XML, которой обмениваются поверх нижележащего протокола. REST — не протокол на XML. MDN определяет REST как ограничения архитектуры для распределённых систем и отмечает, что HTTP API часто называют REST, даже когда они не выполняют каждое ограничение.

**How it works:**

- Сообщение SOAP — это XML. Пространства имён отделяют конверт от нагрузки. Каркас расширяем, и одну и ту же конструкцию сообщения можно везти больше чем одним транспортом. Part 1 — каркас сообщений, а не программный API.
- Взаимодействие REST передаёт представление ресурса обычными операциями клиента и сервера. Представление может быть XML, а может быть чем-то другим. Ничто в ограничениях REST не требует конверта XML, описания WSDL или заголовка SOAP.
- Выбор SOAP означает выбор XML как сообщения и, обычно, схемы как контракта, плюс XML Signature или XML Encryption, когда защищать нужно сам документ.
- Выбор HTTP API в стиле REST означает выбор ресурса и метода HTTP. Если представление — XML, правила XML всё равно действуют: один корень, пространства имён, если смешиваются словари, и схема, если вы проверяете. Протоколом остаётся HTTP.

**When to use:**

Используйте SOAP, когда контракт — XML-сообщение, которое должно пройти посредников без изменения. Используйте HTTP с XML или не-XML представлением, когда клиент вызывает ресурсы обычными веб-средствами: в этом смысле MDN говорит, что новички могут считать REST API HTTP-сервисом.

**Sources:**

- https://www.w3.org/TR/soap12-part1/#intro
- https://developer.mozilla.org/en-US/docs/Glossary/REST
""")

p.write_text(json.dumps(PAIRS, ensure_ascii=False))
print("count", len(PAIRS))
