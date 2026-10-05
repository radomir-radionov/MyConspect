#!/usr/bin/env python3
import json
from pathlib import Path
p = Path("/Users/radomir/Documents/business/MyConspect/.tmp_fill/xml_pairs.json")
PAIRS = json.loads(p.read_text())

def add(h, en, ru):
    PAIRS.append((h, en.strip(), ru.strip()))

add("What is the difference between XML pull parsing and push parsing?",
"""**Definition:**

Push parsing calls your code when the parser is ready. Pull parsing waits until your code asks for the next event.

**How it works:**

- SAX is push. You implement `ContentHandler` and the parser invokes `startElement`, `characters`, and `endElement` in document order. You cannot pause the parser between events except by throwing from the callback.
- StAX `XMLStreamReader` is pull. It starts on `START_DOCUMENT`. You call `hasNext()` and `next()`, then read the current event with `getEventType()`, `getLocalName()`, or `getText()`.
- Pull code can interleave other work between events and can stop without setting up a handler object. Push code keeps the parse loop inside the parser, which is simple when you only react.
- Both are one-pass. Neither builds the DOM tree that `DocumentBuilder.parse` returns.

**When to use:**

Use pull (`XMLStreamReader`) when the application should control the loop. Use push (SAX) when a handler already matches the events and you want the parser to drive.

**Sources:**

- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/org/xml/sax/ContentHandler.html
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/stream/XMLStreamReader.html
""",
"""**Definition:**

При выталкивающем разборе ваш код вызывают, когда разборщик готов. При вытягивающем разборе разборщик ждёт, пока ваш код попросит следующее событие.

**How it works:**

- SAX — выталкивающий. Вы реализуете `ContentHandler`, и разборщик вызывает `startElement`, `characters` и `endElement` в порядке документа. Между событиями разборщик не поставить на паузу, кроме как бросив исключение из обратного вызова.
- StAX `XMLStreamReader` — вытягивающий. Он начинается с `START_DOCUMENT`. Вы вызываете `hasNext()` и `next()`, затем читаете текущее событие через `getEventType()`, `getLocalName()` или `getText()`.
- Вытягивающий код может вставлять другую работу между событиями и может остановиться, не заводя объект обработчика. Выталкивающий код держит цикл разбора внутри разборщика, и это просто, когда вы только реагируете.
- Оба — один проход. Ни один не строит дерево DOM, которое возвращает `DocumentBuilder.parse`.

**When to use:**

Используйте вытягивание (`XMLStreamReader`), когда циклом должно управлять приложение. Используйте выталкивание (SAX), когда обработчик уже совпадает с событиями и циклом должен управлять разборщик.

**Sources:**

- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/org/xml/sax/ContentHandler.html
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/stream/XMLStreamReader.html
""")

add("Describe the concept of XML streaming and its benefits.",
"""**Definition:**

Streaming reads or writes XML without holding the whole document as a tree. The benefit is bounded memory and an earlier result.

**How it works:**

- `XMLStreamReader` is specified as forward, read-only access and as the lowest-level efficient way to read XML. You iterate with `next()` and never receive a `Document`.
- SAX streams in the other direction: events arrive in order, and character data may be split across several `characters` calls. You still do not hold the document.
- XSLT 3.0 added streaming so that neither the source nor the result has to be held in memory in its entirety. That is the same idea at stylesheet level.
- A DOM parse cannot stream. `DOMParser` and `DocumentBuilder.parse` return only after the tree exists.
- Streaming loses random access. If a later decision needs an earlier sibling you did not store, you cannot go back on an `XMLStreamReader`.

**When to use:**

Stream when documents are large or when you can emit output as soon as one element is complete. Build a DOM when you need to query arbitrary nodes afterward.

**Sources:**

- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/stream/XMLStreamReader.html
- https://www.w3.org/TR/xslt-30/#intro
""",
"""**Definition:**

Потоковая обработка читает или пишет XML, не держа весь документ деревом. Выигрыш — ограниченная память и более ранний результат.

**How it works:**

- `XMLStreamReader` задан как доступ только вперёд и только для чтения и как самый низкоуровневый эффективный способ читать XML. Вы идёте через `next()` и не получаете `Document`.
- SAX потоковый в другую сторону: события приходят по порядку, а символьные данные могут быть разбиты на несколько вызовов `characters`. Документ вы всё равно не держите.
- XSLT 3.0 добавил потоковый режим, чтобы ни источник, ни результат не нужно было целиком держать в памяти. Та же идея на уровне таблицы стилей.
- Разбор DOM потоковым не бывает. `DOMParser` и `DocumentBuilder.parse` возвращают управление только когда дерево уже есть.
- Поток теряет произвольный доступ. Если позднее решение требует более раннего соседа, которого вы не сохранили, вернуться по `XMLStreamReader` нельзя.

**When to use:**

Поток используйте, когда документы велики или когда результат можно выдать, как только один элемент закончен. DOM стройте, когда потом нужно запрашивать произвольные узлы.

**Sources:**

- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/stream/XMLStreamReader.html
- https://www.w3.org/TR/xslt-30/#intro
""")

add("What is the purpose of XML SAX events and how are they handled?",
"""**Definition:**

SAX events are the callbacks a parser makes as it recognizes markup. The application handles them by implementing `ContentHandler` and registering it with `setContentHandler`.

**How it works:**

- `startDocument` is called once, before the other events, except that `setDocumentLocator` may come first. `endDocument` is called after a successful parse. A fatal error may skip `endDocument`.
- `startElement` reports the namespace URI, the local name, the qualified name, and the attributes. `endElement` uses the same names. Content of an element, including children, is reported between those two calls, even when the element is empty.
- `characters` reports a chunk of character data. The parser may split one run of text into several calls. The application must read only `ch[start]` through `length` characters. Validating parsers report ignorable white space with `ignorableWhitespace` instead.
- `processingInstruction` reports a target and data. A SAX parser must not use that method for the XML declaration. A separate `declaration` callback exists for version, encoding, and standalone.
- `startPrefixMapping` and `endPrefixMapping` report namespace scope. `skippedEntity` reports an entity the parser did not expand.

**Sources:**

- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/org/xml/sax/ContentHandler.html
""",
"""**Definition:**

События SAX — это обратные вызовы, которые разборщик делает, распознавая разметку. Приложение обрабатывает их, реализуя `ContentHandler` и регистрируя его через `setContentHandler`.

**How it works:**

- `startDocument` вызывается один раз, до остальных событий, кроме того что `setDocumentLocator` может прийти раньше. `endDocument` вызывается после успешного разбора. Фатальная ошибка может пропустить `endDocument`.
- `startElement` сообщает URI пространства имён, локальное имя, уточнённое имя и атрибуты. `endElement` использует те же имена. Содержимое элемента, включая детей, сообщается между этими двумя вызовами, даже если элемент пуст.
- `characters` сообщает кусок символьных данных. Разборщик может разбить один участок текста на несколько вызовов. Приложение должно читать только `ch[start]` на `length` символов. Проверяющие разборщики сообщают игнорируемые пробелы через `ignorableWhitespace`.
- `processingInstruction` сообщает цель и данные. Разборщик SAX не должен использовать этот метод для XML-декларации. Для версии, кодировки и standalone есть отдельный обратный вызов `declaration`.
- `startPrefixMapping` и `endPrefixMapping` сообщают область пространства имён. `skippedEntity` сообщает сущность, которую разборщик не раскрыл.

**Sources:**

- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/org/xml/sax/ContentHandler.html
""")

add("Explain the concept of XML StAX (Streaming API for XML) and its usage.",
"""**Definition:**

StAX is the pull-style streaming API. `XMLStreamReader` gives forward, read-only access: the application drives the cursor with `next()` and `hasNext()`.

**How it works:**

- An instance starts at `START_DOCUMENT`. `getEventType()` is the current event. `next()` loads the next one. At `END_DOCUMENT` the valid call is `close()`.
- Events include the XML declaration, a DTD, a start tag, character data, white space, an end tag, a comment, and a processing instruction. On `START_ELEMENT` you may call `getLocalName()`, `getAttribute` methods, and `getElementText()`. On character data you call `getText`.
- Calling a method in the wrong state throws `IllegalStateException`. The class documents which methods are valid for each event type.
- During a DTD event, `getProperty("javax.xml.stream.notations")` and `getProperty("javax.xml.stream.entities")` expose notations and entity declarations. Those properties are defined to return null if the information is not available, and they are only for the DTD event.
- This is not SAX. Nothing calls you. You poll.

**When to use:**

Use `XMLStreamReader` to read a large document in one forward pass when you want the loop in your own code.

**Sources:**

- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/stream/XMLStreamReader.html
""",
"""**Definition:**

StAX — потоковый API с вытягиванием. `XMLStreamReader` даёт доступ только вперёд и только для чтения: приложение двигает курсор методами `next()` и `hasNext()`.

**How it works:**

- Экземпляр начинается с `START_DOCUMENT`. `getEventType()` — текущее событие. `next()` загружает следующее. На `END_DOCUMENT` допустимый вызов — `close()`.
- События включают XML-декларацию, DTD, открывающий тег, символьные данные, пробелы, закрывающий тег, комментарий и инструкцию обработки. На `START_ELEMENT` можно вызвать `getLocalName()`, методы `getAttribute` и `getElementText()`. На символьных данных вызывают `getText`.
- Вызов метода в неверном состоянии бросает `IllegalStateException`. Класс документирует, какие методы допустимы для каждого типа события.
- Во время события DTD `getProperty("javax.xml.stream.notations")` и `getProperty("javax.xml.stream.entities")` отдают нотации и объявления сущностей. Эти свойства определены так, что возвращают null, если сведений нет, и они только для события DTD.
- Это не SAX. Вас никто не вызывает. Вы опрашиваете.

**When to use:**

Используйте `XMLStreamReader`, чтобы читать большой документ одним проходом вперёд, когда цикл должен быть в вашем коде.

**Sources:**

- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/stream/XMLStreamReader.html
""")

add("What is XML DOM (Document Object Model) and its purpose?",
"""**Definition:**

The DOM is a tree of nodes that represents a document after parsing. Its purpose is to let a program inspect and change the document without rereading the text.

**How it works:**

- In the browser, `DOMParser.parseFromString()` turns an XML or HTML string into a `Document`. `XMLSerializer` turns a tree back into source.
- The tree is made of nodes. Elements have children. A `DocumentFragment` holds a segment that is not yet in the live tree.
- Java obtains the same kind of object from `DocumentBuilder`, created by `DocumentBuilderFactory.newDocumentBuilder()`. `parse` reads a file, stream, URI, or `InputSource`. `newDocument()` starts an empty tree. `isNamespaceAware()` and `isValidating()` report how that builder was configured.
- The purpose stops at the tree. Selecting with a path is XPath. Rewriting to another shape is XSLT. Checking a schema is validation. The DOM is the structure those steps can sit on.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/parsers/DocumentBuilder.html
""",
"""**Definition:**

DOM — дерево узлов, которое представляет документ после разбора. Его назначение — дать программе осмотреть и изменить документ, не перечитывая текст.

**How it works:**

- В браузере `DOMParser.parseFromString()` превращает строку XML или HTML в `Document`. `XMLSerializer` превращает дерево обратно в исходный текст.
- Дерево состоит из узлов. У элементов есть дети. `DocumentFragment` держит отрезок, которого ещё нет в живом дереве.
- Java получает объект того же рода из `DocumentBuilder`, созданного через `DocumentBuilderFactory.newDocumentBuilder()`. `parse` читает файл, поток, URI или `InputSource`. `newDocument()` начинает пустое дерево. `isNamespaceAware()` и `isValidating()` сообщают, как этот построитель настроен.
- Назначение кончается на дереве. Выбор путём — это XPath. Переписывание в другую форму — XSLT. Проверка схемой — validation. DOM — структура, на которой эти шаги могут сидеть.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/parsers/DocumentBuilder.html
""")

add("Explain the concept of XML SAX (Simple API for XML) and its usage.",
"""**Definition:**

SAX is an event API. The parser reads the document and calls a `ContentHandler` for each logical piece, instead of returning a tree.

**How it works:**

- Most SAX applications implement `ContentHandler` and register it with `setContentHandler`. The order of callbacks mirrors the document. An element’s character data, processing instructions, and children arrive between `startElement` and `endElement`.
- SAX 2.0, the interface in Java SE since 1.4, adds namespaces and `skippedEntity` relative to the older `DocumentHandler`.
- `DefaultHandler` is a provided class that implements the interface, so you override only the events you care about.
- `DocumentBuilder` reuses SAX types such as `InputSource`, `ErrorHandler`, and `EntityResolver`. Using those types does not mean the DOM builder is required to parse with a SAX parser. It means the application-facing API is shared.
- Use SAX to scan. Keep only the state you need. Do not expect to walk backward.

**Sources:**

- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/org/xml/sax/ContentHandler.html
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/parsers/DocumentBuilder.html
""",
"""**Definition:**

SAX — событийный API. Разборщик читает документ и вызывает `ContentHandler` для каждого логического куска, вместо того чтобы вернуть дерево.

**How it works:**

- Большинство приложений SAX реализуют `ContentHandler` и регистрируют его через `setContentHandler`. Порядок обратных вызовов повторяет документ. Символьные данные элемента, инструкции обработки и дети приходят между `startElement` и `endElement`.
- SAX 2.0, интерфейс в Java SE с версии 1.4, добавляет пространства имён и `skippedEntity` относительно старого `DocumentHandler`.
- `DefaultHandler` — готовый класс, который реализует интерфейс, так что вы перекрываете только нужные события.
- `DocumentBuilder` переиспользует типы SAX, такие как `InputSource`, `ErrorHandler` и `EntityResolver`. Использование этих типов не значит, что построитель DOM обязан разбирать через SAX-разборщик. Это значит, что API, обращённый к приложению, общий.
- SAX используют, чтобы просматривать. Храните только нужное состояние. Не ждите, что можно пойти назад.

**Sources:**

- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/org/xml/sax/ContentHandler.html
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/parsers/DocumentBuilder.html
""")

add("What is XML JAXP (Java API for XML Processing) and its key components?",
"""**Definition:**

JAXP is the Java SE API for processing XML. The pieces interviews meet are the DOM builder, the SAX handler, and the StAX cursor, all in the platform modules that `java.xml` exposes.

**How it works:**

- `DocumentBuilder`, from `DocumentBuilderFactory.newDocumentBuilder()`, parses to a W3C-style `Document` or creates an empty one with `newDocument()`. It can be namespace-aware and validating, and it accepts an `EntityResolver` and an `ErrorHandler`.
- SAX is the push parser behind `ContentHandler`: `startElement`, `endElement`, `characters`, and the rest.
- StAX is the pull parser: `XMLStreamReader.next()` walks `START_ELEMENT`, `CHARACTERS`, `END_ELEMENT`, and the other event types.
- `DocumentBuilder.getSchema()` returns the `Schema` in use, or null. That is the hook from parsing to XML Schema validation. Transformation sits next to these parsers; SAX even lists `TransformerHandler` as a `ContentHandler`.
- JAXP is not data binding. Mapping elements onto Java beans is Jakarta XML Binding, a separate specification.

**Sources:**

- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/parsers/DocumentBuilder.html
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/org/xml/sax/ContentHandler.html
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/stream/XMLStreamReader.html
""",
"""**Definition:**

JAXP — API Java SE для обработки XML. Части, которые встречаются на собеседовании, — построитель DOM, обработчик SAX и курсор StAX, все в платформенных модулях, которые открывает `java.xml`.

**How it works:**

- `DocumentBuilder` из `DocumentBuilderFactory.newDocumentBuilder()` разбирает в `Document` в стиле W3C или создаёт пустой через `newDocument()`. Он может учитывать пространства имён и проверять документ и принимает `EntityResolver` и `ErrorHandler`.
- SAX — выталкивающий разборщик за `ContentHandler`: `startElement`, `endElement`, `characters` и остальное.
- StAX — вытягивающий разборщик: `XMLStreamReader.next()` проходит `START_ELEMENT`, `CHARACTERS`, `END_ELEMENT` и другие типы событий.
- `DocumentBuilder.getSchema()` возвращает используемую `Schema` или null. Это стык разбора и проверки XML Schema. Преобразование стоит рядом с этими разборщиками; у SAX `TransformerHandler` даже указан как `ContentHandler`.
- JAXP — это не привязка данных. Отображение элементов на Java-бины — Jakarta XML Binding, отдельная спецификация.

**Sources:**

- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/parsers/DocumentBuilder.html
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/org/xml/sax/ContentHandler.html
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/stream/XMLStreamReader.html
""")

add("Describe the concept of XML JAXB (Java Architecture for XML Binding) and its benefits.",
"""**Definition:**

Jakarta XML Binding, the specification that continues JAXB, maps between XML Schema and Java classes. Unmarshalling reads XML into objects. Marshalling writes objects back to XML.

**How it works:**

- The specification’s requirements cover XML Schema to Java, including default bindings and a customized binding schema, and the opposite direction, Java to XML Schema.
- The architecture uses mapping annotations and a binding framework. Unmarshalling and marshalling are the two runtime directions. Validation can run as part of those steps, and the specification also allows disabling schema validation.
- The benefit is that application code sees fields and objects instead of `startElement` events or a raw `Document`. The schema, not hand-written parsers, drives the mapping.
- It is not a parser you drop in where SAX belongs. Something still parses. Binding sits on top and allocates the object graph, so a huge document still costs memory proportional to the objects you materialize.
- The current specification is Jakarta XML Binding 4.0. The package is `jakarta.xml.bind`, not the older `javax.xml.bind` that Java SE no longer ships.

**When to use:**

Use binding when you have a stable schema and want Java objects. Use SAX or StAX when you must not build the object graph.

**Sources:**

- https://jakarta.ee/specifications/xml-binding/4.0/jakarta-xml-binding-spec-4.0.html
""",
"""**Definition:**

Jakarta XML Binding, спецификация, которая продолжает JAXB, отображает XML Schema и классы Java. Демаршалинг читает XML в объекты. Маршалинг записывает объекты обратно в XML.

**How it works:**

- Требования спецификации покрывают путь от XML Schema к Java, включая привязки по умолчанию и настраиваемую схему привязки, и обратное направление, от Java к XML Schema.
- Архитектура использует аннотации отображения и каркас привязки. Демаршалинг и маршалинг — два направления во время выполнения. Проверка может идти как часть этих шагов, и спецификация также позволяет отключить проверку схемой.
- Выигрыш в том, что код приложения видит поля и объекты, а не события `startElement` или сырой `Document`. Отображением управляет схема, а не написанные вручную разборщики.
- Это не разборщик, который ставят туда, где место SAX. Что-то всё равно разбирает. Привязка сидит сверху и выделяет граф объектов, поэтому огромный документ всё ещё стоит памяти пропорционально материализованным объектам.
- Текущая спецификация — Jakarta XML Binding 4.0. Пакет — `jakarta.xml.bind`, а не прежний `javax.xml.bind`, которого Java SE больше не поставляет.

**When to use:**

Используйте привязку, когда схема стабильна и нужны объекты Java. Используйте SAX или StAX, когда граф объектов строить нельзя.

**Sources:**

- https://jakarta.ee/specifications/xml-binding/4.0/jakarta-xml-binding-spec-4.0.html
""")

add("What is the purpose of XML XQuery and how does it differ from XPath?",
"""**Definition:**

XQuery is a query language for XML data sources. XPath addresses parts of a document. XQuery uses XPath’s model and adds the language that queries across sources and builds a result.

**How it works:**

- The XQuery 3.1 recommendation says a query language that uses XML’s structure can query structured and semi-structured documents, relational data, and object repositories, whether the data is stored as XML or only viewed as XML.
- XPath, on MDN, is a non-XML path syntax for pointing at nodes and testing patterns. It does not by itself describe a FLWOR-style query or a constructed result document. XSLT is the transform language that embeds XPath.
- XQuery 3.1 also covers JSON: maps and arrays in the data model, for applications that mix JSON with XML and HTML.
- Use a path when you already hold one document and need a node. Use a query when the question spans many documents or must return a new structure.

**When to use:**

Choose XPath inside XSLT, a DOM, or a single-document lookup. Choose XQuery when the task is a query over a collection.

**Sources:**

- https://www.w3.org/TR/xquery-31/#id-introduction
- https://developer.mozilla.org/en-US/docs/Web/XML/XPath
""",
"""**Definition:**

XQuery — язык запросов к источникам данных XML. XPath адресует части документа. XQuery использует модель XPath и добавляет язык, который запрашивает несколько источников и строит результат.

**How it works:**

- Рекомендация XQuery 3.1 говорит, что язык запросов, который разумно использует структуру XML, может запрашивать структурированные и полуструктурированные документы, реляционные данные и хранилища объектов, независимо от того, хранятся ли данные как XML или только видны как XML.
- XPath, по MDN, — не-XML синтаксис путей, чтобы указывать на узлы и проверять образцы. Сам по себе он не описывает запрос в стиле FLWOR и не описывает построенный документ-результат. XSLT — язык преобразований, который встраивает XPath.
- XQuery 3.1 также покрывает JSON: карты и массивы в модели данных для приложений, которые смешивают JSON с XML и HTML.
- Путь нужен, когда документ уже в руках и нужен узел. Запрос нужен, когда вопрос охватывает много документов или должен вернуть новую структуру.

**When to use:**

Выбирайте XPath внутри XSLT, DOM или поиска по одному документу. Выбирайте XQuery, когда задача — запрос к коллекции.

**Sources:**

- https://www.w3.org/TR/xquery-31/#id-introduction
- https://developer.mozilla.org/en-US/docs/Web/XML/XPath
""")

add("Explain the concept of XML Namespaces and their usage in XML technologies.",
"""**Definition:**

An XML namespace qualifies an element or attribute name by associating it with a URI reference, so two vocabularies can share a document without colliding.

**How it works:**

- The Namespaces recommendation says this is a simple method for qualifying names. A default namespace uses `xmlns="uri"` and applies to unprefixed elements in scope. A prefix is bound with `xmlns:prefix="uri"` and used as `prefix:local`.
- Scope is the element where the declaration appears, and its descendants, until overridden. Attributes are not in the default namespace; an unprefixed attribute has no namespace.
- Names beginning with `xml` are reserved by XML itself. `xml:space` and `xml:lang` are in that reserved vocabulary. Do not invent your own `xml:` names.
- Schema uses namespaces twice: the schema document is in the schema vocabulary, and `targetNamespace` names the vocabulary being defined. XPath and DOM expose the namespace URI separately from the prefix. SAX `startElement` passes `uri`, `localName`, and `qName` for that reason. Canonical XML has to pick one physical form for those declarations, because prefixes are not part of the logical name.

**Sources:**

- https://www.w3.org/TR/xml-names/#ns-decl
- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""",
"""**Definition:**

Пространство имён XML уточняет имя элемента или атрибута, связывая его со ссылкой URI, чтобы два словаря могли делить документ без столкновения.

**How it works:**

- Рекомендация Namespaces говорит, что это простой способ уточнять имена. Пространство имён по умолчанию использует `xmlns="uri"` и действует на элементы без префикса в области видимости. Префикс привязывают через `xmlns:prefix="uri"` и используют как `prefix:local`.
- Область — элемент, где стоит объявление, и его потомки, пока объявление не перекроют. Атрибуты не входят в пространство имён по умолчанию; атрибут без префикса не имеет пространства имён.
- Имена, начинающиеся с `xml`, зарезервированы самим XML. `xml:space` и `xml:lang` относятся к этому зарезервированному словарю. Не выдумывайте свои имена `xml:`.
- Схема использует пространства имён дважды: документ схемы лежит в словаре схемы, а `targetNamespace` называет определяемый словарь. XPath и DOM показывают URI пространства имён отдельно от префикса. SAX `startElement` передаёт `uri`, `localName` и `qName` именно поэтому. Канонический XML должен выбрать одну физическую форму этих объявлений, потому что префиксы не входят в логическое имя.

**Sources:**

- https://www.w3.org/TR/xml-names/#ns-decl
- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""")

p.write_text(json.dumps(PAIRS, ensure_ascii=False))
print(len(PAIRS))
