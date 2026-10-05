#!/usr/bin/env python3
import json
from pathlib import Path
p = Path("/Users/radomir/Documents/business/MyConspect/.tmp_fill/xml_pairs.json")
PAIRS = json.loads(p.read_text())

def add(h, en, ru):
    PAIRS.append((h, en.strip(), ru.strip()))

add("What is XML Signature and its role in XML security?",
"""**Definition:**

XML Signature is the W3C syntax and processing rules for a digital signature carried in XML. The recommendation says signatures provide integrity, message authentication, and/or signer authentication for data of any type, whether the data sits inside the signature’s XML or elsewhere.

**How it works:**

- The signature is an XML element. It can cover an element in the same document or data outside it. The processing rules, not a private layout, decide how the bytes are selected and hashed.
- Version 1.1 made Canonical XML 1.1 a required canonicalization algorithm and updated the mandatory algorithms, including Elliptic Curve DSA and additional hash algorithms. Canonicalization exists so two logically identical infosets produce the same bytes before the hash.
- This is the XML packaging of a digital signature. NIST’s definition still applies: the private key signs, the public key verifies, and confidentiality is a different service.
- XML Encryption is that other service. A signature does not hide the data it covers.

**Sources:**

- https://www.w3.org/TR/xmldsig-core1/#sec-Overview
- https://csrc.nist.gov/glossary/term/digital_signature
""",
"""**Definition:**

XML Signature — синтаксис и правила обработки W3C для цифровой подписи, которую несут в XML. Рекомендация говорит, что подписи дают целостность, аутентификацию сообщения и/или аутентификацию подписавшего для данных любого типа, лежат ли данные внутри XML подписи или в другом месте.

**How it works:**

- Подпись — элемент XML. Она может покрывать элемент в том же документе или данные снаружи. Правила обработки, а не частная раскладка, решают, как выбирают и хешируют байты.
- Версия 1.1 сделала Canonical XML 1.1 обязательным алгоритмом канонизации и обновила обязательные алгоритмы, включая Elliptic Curve DSA и дополнительные алгоритмы хеша. Канонизация нужна, чтобы два логически одинаковых infoset давали одни и те же байты до хеша.
- Это XML-упаковка цифровой подписи. Определение NIST по-прежнему действует: закрытый ключ подписывает, открытый проверяет, а конфиденциальность — другой сервис.
- XML Encryption — тот другой сервис. Подпись не скрывает данные, которые покрывает.

**Sources:**

- https://www.w3.org/TR/xmldsig-core1/#sec-Overview
- https://csrc.nist.gov/glossary/term/digital_signature
""")

add("Describe the concept of XML Encryption and its purpose.",
"""**Definition:**

XML Encryption specifies a process for encrypting data and representing the result in XML. The result is an XML Encryption element that contains or references the cipher data.

**How it works:**

- The data may be an octet stream, other unstructured data, or structured XML: a document, an element, or element content. You can encrypt one element and leave the rest of the document readable.
- The cipher data is either inside the encryption element or referenced from it. The recipient uses the key information carried with that element to decrypt.
- Purpose is confidentiality of the chosen data. It does not by itself prove who produced the document. That is XML Signature.
- The two recommendations are designed to be used together. XKMS, in turn, is the key-distribution protocol specified for use with both.

**Sources:**

- https://www.w3.org/TR/xmlenc-core1/#sec-Overview
""",
"""**Definition:**

XML Encryption задаёт процесс шифрования данных и представления результата в XML. Результат — элемент XML Encryption, который содержит шифрданные или ссылается на них.

**How it works:**

- Данные могут быть потоком октетов, другими неструктурированными данными или структурным XML: документом, элементом или содержимым элемента. Можно зашифровать один элемент и оставить остальной документ читаемым.
- Шифрданные либо внутри элемента шифрования, либо на них ссылаются. Получатель использует сведения о ключе, которые несёт этот элемент, чтобы расшифровать.
- Назначение — конфиденциальность выбранных данных. Само по себе это не доказывает, кто создал документ. Это делает XML Signature.
- Две рекомендации рассчитаны на совместное использование. XKMS, в свою очередь, — протокол распространения ключей, заданный для использования с обеими.

**Sources:**

- https://www.w3.org/TR/xmlenc-core1/#sec-Overview
""")

add("What is the purpose of XML Canonicalization and its usage?",
"""**Definition:**

Canonical XML produces one physical representation of an XML document so that logically equivalent documents, which XML allows to differ in syntax, compare as equal. Version 1.1 is a revision of 1.0 for namespace attributes inherited by document subsets.

**How it works:**

- XML 1.0 permits differences that do not change the logical document: attribute order, certain white space, and how namespaces are written. A signature over raw bytes would fail after a harmless rewrite.
- If two documents have the same canonical form, they are logically equivalent in the application context the specification describes, except for a few unusual cases it limits. The reverse is not always true: differing canonical forms can still be equivalent under application rules the spec does not try to capture.
- Canonical XML 1.1 is defined for XML 1.0 and the XPath 1.0 data model. It is not defined for XML 1.1. It changes inheritance of XML-namespace attributes on subsets, including not inheriting `xml:id`, and it treats `xml:base` URI paths in a defined way.
- XML Signature 1.1 requires Canonical XML 1.1 as a canonicalization algorithm. That is the usual place you meet it: before hashing signed XML.

**Sources:**

- https://www.w3.org/TR/xml-c14n11/#sec-Intro
- https://www.w3.org/TR/xmldsig-core1/#sec-Overview
""",
"""**Definition:**

Канонический XML даёт одно физическое представление XML-документа, чтобы логически эквивалентные документы, которым XML разрешает различаться синтаксисом, сравнивались как равные. Версия 1.1 — пересмотр 1.0 для атрибутов пространств имён, которые наследуют подмножества документа.

**How it works:**

- XML 1.0 допускает различия, которые не меняют логический документ: порядок атрибутов, некоторые пробелы и то, как записаны пространства имён. Подпись по сырым байтам не сошлась бы после безобидной перезаписи.
- Если у двух документов одна каноническая форма, они логически эквивалентны в том контексте приложения, который описывает спецификация, кроме нескольких необычных случаев, которые она ограничивает. Обратное не всегда верно: разные канонические формы всё ещё могут быть эквивалентны по правилам приложения, которые спецификация не пытается охватить.
- Canonical XML 1.1 определён для XML 1.0 и модели данных XPath 1.0. Для XML 1.1 он не определён. Он меняет наследование атрибутов пространства имён XML на подмножествах, включая отказ наследовать `xml:id`, и заданным образом обрабатывает пути URI в `xml:base`.
- XML Signature 1.1 требует Canonical XML 1.1 как алгоритм канонизации. Обычно его встречают именно там: перед хешированием подписанного XML.

**Sources:**

- https://www.w3.org/TR/xml-c14n11/#sec-Intro
- https://www.w3.org/TR/xmldsig-core1/#sec-Overview
""")

add("Explain the concept of XML Catalogs and their benefits.",
"""**Definition:**

An XML catalog is a local map from the external identifiers in a document to resources the processor should actually open. The parser asks an entity resolver; the catalog is the table that resolver consults.

**How it works:**

- XML documents refer to external entities and to grammars through identifiers in the document type declaration. A processor that fetches each of those URIs over the network depends on the network and on whatever is currently published at that URI.
- Java’s `DocumentBuilder.setEntityResolver` is the hook. The application supplies an `EntityResolver` that turns those identifiers into a local `InputSource`. Setting the resolver to null restores the implementation’s default.
- The benefit is repeatability and speed: the same public or system identifier always resolves to the copy you shipped, and validation does not wait on a remote host.
- A catalog does not change well-formedness or the schema. It only changes where the bytes of an external entity are read from.

**When to use:**

Use a catalog or another `EntityResolver` when documents reference DTDs or schemas that you can ship beside the application. Leave the default resolver only when the remote copy is the one you intend to trust.

**Sources:**

- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/parsers/DocumentBuilder.html
- https://www.w3.org/TR/xml/#sec-prolog-dtd
""",
"""**Definition:**

Каталог XML — локальная карта от внешних идентификаторов в документе к ресурсам, которые процессор должен реально открыть. Разборщик спрашивает распознаватель сущностей; каталог — таблица, в которую этот распознаватель смотрит.

**How it works:**

- XML-документы ссылаются на внешние сущности и грамматики через идентификаторы в объявлении типа документа. Процессор, который забирает каждый такой URI по сети, зависит от сети и от того, что сейчас опубликовано по этому URI.
- Точка подключения в Java — `DocumentBuilder.setEntityResolver`. Приложение даёт `EntityResolver`, который превращает эти идентификаторы в локальный `InputSource`. Установка распознавателя в null возвращает поведение реализации по умолчанию.
- Выигрыш — повторяемость и скорость: один и тот же публичный или системный идентификатор всегда разрешается в копию, которую вы поставили рядом, и проверка не ждёт удалённый хост.
- Каталог не меняет правильную сформированность и не меняет схему. Он меняет только то, откуда читают байты внешней сущности.

**When to use:**

Используйте каталог или другой `EntityResolver`, когда документы ссылаются на DTD или схемы, которые можно поставить рядом с приложением. Оставляйте распознаватель по умолчанию только когда удалённая копия — именно та, которой вы намерены доверять.

**Sources:**

- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/parsers/DocumentBuilder.html
- https://www.w3.org/TR/xml/#sec-prolog-dtd
""")

add("What are some best practices for designing XML schemas?",
"""**Definition:**

Design a schema as a set of named types and global elements in a target namespace, with simple types restricted only as far as the values require and complex types reserved for structure.

**How it works:**

- Put the vocabulary in a `targetNamespace`. The schema document itself lives in the schema namespace, so the two do not collide. That is the split the structures specification is built on.
- Prefer a simple type, restricted from a built-in base, for a leaf. Add facets such as enumeration when the value set is closed. Use a complex type when there are children or attributes.
- Keep element declarations global when other schemas or substitution groups must refer to them. Use a local declaration when the name only makes sense inside one parent.
- Version the namespace or the schema location when the content model changes in a way old readers must not silently accept. A changed type in the same namespace without a version story makes old and new documents look alike and fail differently.
- Validate with the schema. Well-formedness alone does not enforce it. `DocumentBuilder` can be configured to validate and can expose the `Schema` it uses.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""",
"""**Definition:**

Проектируйте схему как набор именованных типов и глобальных элементов в целевом пространстве имён: простые типы ограничивайте ровно настолько, насколько требуют значения, а сложные типы оставляйте для структуры.

**How it works:**

- Поместите словарь в `targetNamespace`. Сам документ схемы живёт в пространстве имён схемы, поэтому они не сталкиваются. На этом разделении построена спецификация структур.
- Для листа предпочитайте простой тип, ограниченный от встроенной базы. Добавляйте фасеты вроде enumeration, когда набор значений замкнут. Сложный тип используйте, когда есть дети или атрибуты.
- Объявления элементов держите глобальными, когда на них должны ссылаться другие схемы или группы подстановки. Локальное объявление используйте, когда имя имеет смысл только внутри одного родителя.
- Меняйте пространство имён или расположение схемы, когда модель содержимого меняется так, что старые читатели не должны молча её принять. Изменённый тип в том же пространстве имён без истории версий делает старые и новые документы похожими, а падают они по-разному.
- Проверяйте схемой. Одной правильной сформированности недостаточно. `DocumentBuilder` можно настроить на проверку, и он может показать `Schema`, которую использует.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""")

add("Explain the concept of XML modularity and its benefits.",
"""**Definition:**

XML modularity is splitting a vocabulary or a stylesheet into parts that compose, instead of one document that defines everything.

**How it works:**

- Namespaces are the composition rule for vocabularies. Each module has a namespace URI. A document mixes them with prefixes. The Namespaces recommendation exists so those names stay qualified.
- Schema components can be global, so another schema document can refer to an element or type instead of copying it. Substitution groups are one reuse mechanism on element declarations.
- XSLT 3.0 calls modularity out as a design aim: large stylesheets built from independently developed components. Streaming is the other aim; modularity is what keeps a large transform maintainable.
- External entities and catalogs are the physical side. A grammar can live in its own file, and an `EntityResolver` can load your copy. That is reuse of text, which is weaker than reuse of schema components, because the included text is not a namespace of its own.

**When to use:**

Split on namespace and on global schema components when more than one team owns the vocabulary. Split an XSLT stylesheet when independent transforms must be combined.

**Sources:**

- https://www.w3.org/TR/xml-names/#ns-decl
- https://www.w3.org/TR/xslt-30/#intro
- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""",
"""**Definition:**

Модульность XML — это разбиение словаря или таблицы стилей на части, которые собираются вместе, вместо одного документа, который определяет всё.

**How it works:**

- Пространства имён — правило сборки словарей. У каждого модуля свой URI пространства имён. Документ смешивает их префиксами. Рекомендация Namespaces существует, чтобы эти имена оставались уточнёнными.
- Компоненты схемы могут быть глобальными, поэтому другой документ схемы может сослаться на элемент или тип, а не копировать его. Группы подстановки — один механизм переиспользования на объявлениях элементов.
- XSLT 3.0 прямо называет модульность целью проекта: большие таблицы стилей из независимо разработанных компонентов. Потоковость — другая цель; модульность делает большое преобразование поддерживаемым.
- Внешние сущности и каталоги — физическая сторона. Грамматика может жить в своём файле, а `EntityResolver` может загрузить вашу копию. Это переиспользование текста, и оно слабее переиспользования компонентов схемы, потому что включённый текст сам не является пространством имён.

**When to use:**

Делите по пространству имён и по глобальным компонентам схемы, когда словарём владеет больше одной команды. Делите таблицу стилей XSLT, когда независимые преобразования нужно сочетать.

**Sources:**

- https://www.w3.org/TR/xml-names/#ns-decl
- https://www.w3.org/TR/xslt-30/#intro
- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""")

add("What is the purpose of XML versioning and how is it achieved?",
"""**Definition:**

Versioning tells a reader which grammar a document uses, so a change in that grammar is visible instead of being mistaken for a valid old document.

**How it works:**

- The XML declaration’s version is the version of XML, such as `1.0`, not the version of your vocabulary. Do not overload it as an application version.
- A schema’s `targetNamespace` is the stable name of a vocabulary. A breaking change belongs in a new namespace URI, so old and new elements do not validate against each other’s types.
- Within one namespace, a compatible extension can add optional content. The structures specification’s extension of a complex type is the mechanism that adds attributes or children. Old readers that ignore unknown optional pieces can still read the core. Readers that validate strictly need the new schema.
- The document can also carry an application version attribute in your own namespace. That is a convention on top of the namespace, useful when the namespace stays the same and only optional fields appear.

**When to use:**

Change the namespace URI when a required content model changes. Extend a complex type, and keep the namespace, when you are only adding optional information.

**Sources:**

- https://www.w3.org/TR/xml/#sec-prolog-dtd
- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""",
"""**Definition:**

Версионирование говорит читателю, какую грамматику использует документ, чтобы изменение грамматики было видно, а не принималось за действительный старый документ.

**How it works:**

- Версия в XML-декларации — это версия XML, например `1.0`, а не версия вашего словаря. Не перегружайте её как версию приложения.
- `targetNamespace` схемы — устойчивое имя словаря. Ломающее изменение принадлежит новому URI пространства имён, чтобы старые и новые элементы не проходили проверку типами друг друга.
- Внутри одного пространства имён совместимое расширение может добавить необязательное содержимое. Расширение сложного типа в спецификации структур — механизм, который добавляет атрибуты или детей. Старые читатели, которые игнорируют неизвестные необязательные части, всё ещё читают ядро. Читателям со строгой проверкой нужна новая схема.
- Документ может также нести атрибут версии приложения в вашем собственном пространстве имён. Это соглашение поверх пространства имён, полезное, когда пространство имён остаётся тем же и появляются только необязательные поля.

**When to use:**

Меняйте URI пространства имён, когда меняется обязательная модель содержимого. Расширяйте сложный тип и сохраняйте пространство имён, когда вы только добавляете необязательные сведения.

**Sources:**

- https://www.w3.org/TR/xml/#sec-prolog-dtd
- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""")

add("Describe the concept of XML internationalization and localization.",
"""**Definition:**

Internationalization is marking which natural language a document’s content is in, and encoding that content in Unicode. Localization is supplying the content for a particular language.

**How it works:**

- XML 1.0 defines `xml:lang` for this. The attribute specifies the language of the element’s contents and attribute values. Values are IETF BCP 47 language tags, and the empty string is allowed. In a valid document the attribute must be declared if it is used.
- The declaration applies to the element and, by inheritance in the spec’s processing model, identifies the language of that content. A child may set a different `xml:lang`.
- The XML declaration’s encoding, such as `UTF-8` in MDN’s example, is how the bytes map to characters. Character references address a code point in ISO/IEC 10646 when the character is not typed directly.
- Names of elements should be words, the specification says, and almost all characters are allowed in names. That is a separate choice from `xml:lang`: the tag language and the content language need not match.
- Localization does not require a different schema for each language if the structure is the same. It requires different character data, identified by `xml:lang`.

**Examples:**

```xml
<p xml:lang="en">The quick brown fox</p>
<p xml:lang="ru">Быстрая бурая лиса</p>
```

**Sources:**

- https://www.w3.org/TR/xml/#sec-lang-tag
- https://developer.mozilla.org/en-US/docs/Web/XML/Guides/XML_introduction
""",
"""**Definition:**

Интернационализация — это пометка, на каком естественном языке содержимое документа, и кодирование этого содержимого в Unicode. Локализация — поставка содержимого для конкретного языка.

**How it works:**

- XML 1.0 определяет для этого `xml:lang`. Атрибут задаёт язык содержимого элемента и значений его атрибутов. Значения — языковые метки IETF BCP 47, и пустая строка допустима. В действительном документе атрибут надо объявить, если он используется.
- Объявление относится к элементу и в модели обработки спецификации идентифицирует язык этого содержимого. Ребёнок может задать другой `xml:lang`.
- Кодировка в XML-декларации, например `UTF-8` в примере MDN, — это то, как байты отображаются в символы. Ссылки на символы адресуют кодовую позицию в ISO/IEC 10646, когда символ не набран напрямую.
- Имена элементов, говорит спецификация, должны быть словами, и в именах разрешены почти все символы. Это отдельный выбор от `xml:lang`: язык тегов и язык содержимого не обязаны совпадать.
- Локализация не требует отдельной схемы на каждый язык, если структура одна и та же. Она требует другие символьные данные, помеченные `xml:lang`.

**Examples:**

```xml
<p xml:lang="en">The quick brown fox</p>
<p xml:lang="ru">Быстрая бурая лиса</p>
```

**Sources:**

- https://www.w3.org/TR/xml/#sec-lang-tag
- https://developer.mozilla.org/en-US/docs/Web/XML/Guides/XML_introduction
""")

add("What are some common XML design patterns and their usage?",
"""**Definition:**

The patterns that come straight from the specifications are: one vocabulary per namespace, elements for structure, attributes for qualifiers, simple types for leaves, and complex types for trees.

**How it works:**

- Envelope versus payload. SOAP’s message construct is the envelope; the application data sits inside it. The envelope is one namespace, the payload another, which is what namespaces are for.
- Document versus collection. A document has exactly one root. A list of siblings that is not yet a document is a fragment; wrap it before you parse it as a document, or hold it in a `DocumentFragment` until you insert it.
- Extension versus substitution. Extend a complex type to add children or attributes. Use a substitution group when a different element name should be accepted where a head element was declared.
- Streaming versus tree. SAX and `XMLStreamReader` handle one pass. DOM handles repeated queries. Pick the pattern from the access, not from habit.
- Sign and encrypt as separate layers. XML Signature covers integrity and signer authentication. XML Encryption covers confidentiality and can encrypt a single element.

**Sources:**

- https://www.w3.org/TR/xml-names/#ns-decl
- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
- https://www.w3.org/TR/soap12-part1/#intro
""",
"""**Definition:**

Образцы, которые прямо следуют из спецификаций: один словарь на пространство имён, элементы для структуры, атрибуты для уточнений, простые типы для листьев и сложные типы для деревьев.

**How it works:**

- Конверт и полезная нагрузка. Конструкция сообщения SOAP — конверт; данные приложения лежат внутри. Конверт — одно пространство имён, нагрузка — другое, для этого пространства имён и существуют.
- Документ и набор. У документа ровно один корень. Список соседей, который ещё не документ, — фрагмент; оберните его, прежде чем разбирать как документ, или держите в `DocumentFragment`, пока не вставите.
- Расширение и подстановка. Расширяйте сложный тип, чтобы добавить детей или атрибуты. Группу подстановки используйте, когда в месте объявленного головного элемента должно приниматься другое имя элемента.
- Поток и дерево. SAX и `XMLStreamReader` делают один проход. DOM обслуживает повторные запросы. Выбирайте образец по доступу, а не по привычке.
- Подпись и шифрование — разные слои. XML Signature покрывает целостность и аутентификацию подписавшего. XML Encryption покрывает конфиденциальность и может зашифровать один элемент.

**Sources:**

- https://www.w3.org/TR/xml-names/#ns-decl
- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
- https://www.w3.org/TR/soap12-part1/#intro
""")

add("Explain the concept of XML data binding and its advantages.",
"""**Definition:**

Data binding maps between an XML document and programming-language objects. Jakarta XML Binding specifies that mapping in both directions: schema to Java, and Java to schema.

**How it works:**

- Unmarshalling reads XML and builds the object graph. Marshalling writes the graph back out. The specification’s binding framework includes both, plus validation during those steps.
- Default bindings cover ordinary schema components. A customized binding schema or mapping annotations override the defaults when a name or a shape should not follow the default.
- The advantage is that business code uses fields. It does not implement `ContentHandler` or walk a `Document` for every field. The schema remains the contract.
- The cost is the object graph. Streaming with SAX or StAX stays cheaper when you do not need the objects. Binding also lags the schema: a change in a complex type means regenerating or adjusting the classes.

**When to use:**

Bind when the schema is the API and the application wants objects. Parse events when the application is a filter or a transform that should not allocate the graph.

**Sources:**

- https://jakarta.ee/specifications/xml-binding/4.0/jakarta-xml-binding-spec-4.0.html
""",
"""**Definition:**

Привязка данных отображает XML-документ и объекты языка программирования. Jakarta XML Binding задаёт это отображение в обе стороны: от схемы к Java и от Java к схеме.

**How it works:**

- Демаршалинг читает XML и строит граф объектов. Маршалинг записывает граф обратно. Каркас привязки спецификации включает оба направления и проверку во время этих шагов.
- Привязки по умолчанию покрывают обычные компоненты схемы. Настраиваемая схема привязки или аннотации отображения перекрывают умолчания, когда имя или форма не должны следовать умолчанию.
- Преимущество в том, что прикладной код пользуется полями. Он не реализует `ContentHandler` и не обходит `Document` ради каждого поля. Контрактом остаётся схема.
- Цена — граф объектов. Поток через SAX или StAX остаётся дешевле, когда объекты не нужны. Привязка также отстаёт от схемы: изменение сложного типа означает перегенерацию или правку классов.

**When to use:**

Привязывайте, когда схема и есть API и приложению нужны объекты. Разбирайте события, когда приложение — фильтр или преобразование, которое не должно выделять граф.

**Sources:**

- https://jakarta.ee/specifications/xml-binding/4.0/jakarta-xml-binding-spec-4.0.html
""")

p.write_text(json.dumps(PAIRS, ensure_ascii=False))
print(len(PAIRS))
