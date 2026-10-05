#!/usr/bin/env python3
import json
from pathlib import Path
p = Path("/Users/radomir/Documents/business/MyConspect/.tmp_fill/xml_pairs.json")
PAIRS = json.loads(p.read_text())

def add(h, en, ru):
    PAIRS.append((h, en.strip(), ru.strip()))

add("What is the difference between XML Schema simple types and complex types?",
"""**Definition:**

A simple type constrains a string and the value it encodes. A complex type declares attributes and a content type for an element’s children.

**How it works:**

- The structures specification says a simple type applies to attribute values and to elements with no element children. Each simple type is a restriction of its base type. Built-in simple types come from the datatypes specification.
- A complex type is a set of attribute declarations and a content type. The content may be empty, a simple-typed string, or elements.
- If an element has child elements, or attributes you must validate, it needs a complex type. If it is only text, a simple type is enough.
- Derivation differs. Simple types restrict a base. Complex types are written as an extension or a restriction of another type.

**When to use:**

Use a simple type for a leaf value such as an integer or a date. Use a complex type as soon as the element has structure.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""",
"""**Definition:**

Простой тип ограничивает строку и значение, которое она кодирует. Сложный тип объявляет атрибуты и тип содержимого для детей элемента.

**How it works:**

- Спецификация структур говорит, что простой тип применяется к значениям атрибутов и к элементам без элементов-детей. Каждый простой тип — ограничение своего базового типа. Встроенные простые типы приходят из спецификации типов данных.
- Сложный тип — набор объявлений атрибутов и тип содержимого. Содержимое может быть пустым, строкой простого типа или элементами.
- Если у элемента есть дочерние элементы или атрибуты, которые надо проверять, ему нужен сложный тип. Если это только текст, достаточно простого типа.
- Порождение различается. Простые типы ограничивают базу. Сложные типы записывают как расширение или ограничение другого типа.

**When to use:**

Простой тип — для листового значения, например целого или даты. Сложный тип — как только у элемента появляется структура.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""")

add("Describe the concept of XML Schema facets and their usage.",
"""**Definition:**

A facet is a constraint that restricts a simple type’s value space relative to its base type. The structures specification names the enumeration facet as one case, used where a value must be one of a listed set.

**How it works:**

- Every user-defined simple type is a restriction of a base. Facets are how that restriction is stated. Without them, a restriction would not say what changed.
- Enumeration is the facet the structures spec cites explicitly: the actual value is checked against the listed values, and the datatype may be more specific than a plain string.
- The same specification notes that fixed and default values on elements and attributes are also tied to the datatype mapping, not left as unchecked text.
- Facets apply to simple types. They do not replace a complex type’s content model. A content model says which children appear. A facet says which values a leaf may take.

**When to use:**

Put a facet on a simple type when the base type is too wide: a closed set of codes, a bounded number, or a pattern the lexical form must match. Use a complex type when the constraint is about child elements.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""",
"""**Definition:**

Фасет — ограничение, которое сужает пространство значений простого типа относительно базового типа. Спецификация структур называет фасет enumeration одним из случаев: значение должно быть одним из перечисленного набора.

**How it works:**

- Каждый пользовательский простой тип — ограничение базы. Фасеты — это то, как ограничение записано. Без них ограничение не говорило бы, что изменилось.
- Enumeration — фасет, который спецификация структур называет явно: фактическое значение сверяют со списком, и тип данных может быть конкретнее простой строки.
- Та же спецификация отмечает, что фиксированные значения и значения по умолчанию у элементов и атрибутов тоже привязаны к отображению типа данных, а не остаются непроверенным текстом.
- Фасеты применяются к простым типам. Они не заменяют модель содержимого сложного типа. Модель содержимого говорит, какие дети появляются. Фасет говорит, какие значения может принимать лист.

**When to use:**

Ставьте фасет на простой тип, когда базовый тип слишком широк: замкнутый набор кодов, ограниченное число или шаблон, которому должна соответствовать лексическая форма. Сложный тип используйте, когда ограничение касается дочерних элементов.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""")

add("What is the purpose of XML Schema namespace declarations?",
"""**Definition:**

Namespace declarations in a schema keep the schema’s own vocabulary distinct from the vocabulary it defines, and they name the target namespace of the instance elements.

**How it works:**

- Namespaces in XML qualify element and attribute names by associating them with a namespace identified by a URI reference. A default namespace is declared with `xmlns`. A prefixed name uses a prefix bound to a URI.
- The schema language is itself an XML vocabulary and uses namespaces. The structures spec’s example puts `targetNamespace` on `schema` to name the namespace being defined: `http://www.example.com/XMLSchema/1.0/mySchema` in that example.
- Instance elements in the target namespace are the ones the schema validates. Elements in another namespace are a different vocabulary, which is how one document can mix several schemas.
- The prefix is local. Comparison is of the namespace URI, not of the prefix string. Two prefixes bound to the same URI are the same namespace.

**Sources:**

- https://www.w3.org/TR/xml-names/#ns-decl
- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""",
"""**Definition:**

Объявления пространств имён в схеме отделяют собственный словарь схемы от словаря, который она определяет, и называют целевое пространство имён элементов экземпляра.

**How it works:**

- Пространства имён в XML уточняют имена элементов и атрибутов, связывая их с пространством имён, которое задано ссылкой URI. Пространство имён по умолчанию объявляют через `xmlns`. Имя с префиксом использует префикс, привязанный к URI.
- Язык схемы сам является словарём XML и использует пространства имён. В примере спецификации структур на `schema` стоит `targetNamespace`, называющий определяемое пространство имён: в том примере это `http://www.example.com/XMLSchema/1.0/mySchema`.
- Элементы экземпляра в целевом пространстве имён — те, которые схема проверяет. Элементы в другом пространстве имён — другой словарь, поэтому один документ может смешивать несколько схем.
- Префикс локален. Сравнивают URI пространства имён, а не строку префикса. Два префикса, привязанные к одному URI, — одно пространство имён.

**Sources:**

- https://www.w3.org/TR/xml-names/#ns-decl
- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""")

add("Explain the concept of XML Schema substitution groups.",
"""**Definition:**

A substitution group lets one element stand where another element, the head, is expected. The structures specification records this on the element declaration as substitution group affiliations.

**How it works:**

- An element declaration has a set of substitution group affiliations: other element declarations it may substitute for. It also has substitution group exclusions and disallowed substitutions, which can block extension, restriction, or substitution.
- The head is an element declaration. Members are other element declarations that name that head. In the instance, a member can appear where the content model asked for the head, subject to those exclusions.
- This is a feature of element declarations, provided together with them. It is not a complex-type extension. Extension adds content to a type. Substitution swaps which element name is used.
- The `abstract` property on an element declaration, also in that component, can force the instance to use a member rather than the head itself.

**When to use:**

Use a substitution group when several element names share a role in one content model and you want the schema to allow any of those names. Use a choice inside a complex type when the alternatives are local and do not need to be reused as global elements.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""",
"""**Definition:**

Группа подстановки позволяет одному элементу стоять там, где ожидается другой элемент — голова. Спецификация структур записывает это в объявлении элемента как принадлежность к группам подстановки.

**How it works:**

- У объявления элемента есть набор принадлежностей к группам подстановки: другие объявления элементов, которые оно может заменять. Есть также исключения группы подстановки и запрещённые подстановки, которые могут блокировать расширение, ограничение или подстановку.
- Голова — объявление элемента. Члены — другие объявления элементов, которые называют эту голову. В экземпляре член может появиться там, где модель содержимого просила голову, с учётом этих исключений.
- Это свойство объявлений элементов, данное вместе с ними. Это не расширение сложного типа. Расширение добавляет содержимое типу. Подстановка меняет, какое имя элемента использовано.
- Свойство `abstract` у объявления элемента, тоже в этом компоненте, может заставить экземпляр использовать член, а не саму голову.

**When to use:**

Используйте группу подстановки, когда несколько имён элементов делят одну роль в модели содержимого и схема должна разрешить любое из этих имён. Выбор внутри сложного типа используйте, когда альтернативы локальны и их не нужно переиспользовать как глобальные элементы.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""")

add("What is XML parsing and why is it important?",
"""**Definition:**

XML parsing reads a text document and reports its structure: elements, attributes, and character data, under the well-formedness rules. Without a parser, the application would be guessing at tags.

**How it works:**

- A well-formed document has exactly one root and properly nested elements. A parser rejects text that breaks those constraints instead of handing the application a half-read tree.
- Character references and the predefined entities are expanded by the processor. Markup such as comments and processing instructions is separated from character data.
- Two shapes of API are common. A tree API builds a document you can walk later. `DOMParser.parseFromString()` returns a `Document`. An event API reports start and end of elements as it reads. SAX `ContentHandler` is that shape: the parser calls `startElement` and `endElement`.
- Parsing is what makes the later steps possible: XPath, schema validation, and transformation all assume a processor has already recognized the markup.

**Sources:**

- https://www.w3.org/TR/xml/#sec-well-formed
- https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
""",
"""**Definition:**

Разбор XML читает текстовый документ и сообщает его структуру: элементы, атрибуты и символьные данные по правилам правильной сформированности. Без разборщика приложение угадывало бы теги.

**How it works:**

- У правильно сформированного документа ровно один корень и правильно вложенные элементы. Разборщик отвергает текст, который нарушает эти ограничения, вместо того чтобы отдать приложению полусобранное дерево.
- Ссылки на символы и предопределённые сущности раскрывает процессор. Разметку вроде комментариев и инструкций обработки он отделяет от символьных данных.
- Обычны две формы API. Древесный API строит документ, по которому можно ходить потом. `DOMParser.parseFromString()` возвращает `Document`. Событийный API сообщает начало и конец элементов по мере чтения. SAX `ContentHandler` — эта форма: разборщик вызывает `startElement` и `endElement`.
- Разбор делает возможными следующие шаги: XPath, проверка схемой и преобразование предполагают, что процессор уже распознал разметку.

**Sources:**

- https://www.w3.org/TR/xml/#sec-well-formed
- https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
""")

add("Explain the difference between DOM and SAX parsing.",
"""**Definition:**

DOM parsing builds a tree and returns it. SAX parsing reports events while it reads and does not keep the tree.

**How it works:**

- In the browser, `DOMParser.parseFromString()` parses an XML string into a `Document`. You then walk `childNodes` or query the tree. The whole document is in memory after the call returns.
- SAX `ContentHandler` is the other contract. The application registers a handler with `setContentHandler`. The parser calls `startDocument`, `startElement`, `characters`, `endElement`, and `endDocument` in document order. Element content is reported between the matching start and end events.
- DOM can be revisited and modified. SAX is one pass. If you need a parent after you have seen a later sibling, SAX has already moved on unless you stored it yourself.
- SAX can reject or skip work before the document ends. A fatal error may stop the parse so that `endDocument` is never called.

**When to use:**

Use DOM or `DOMParser` when the document is small enough to hold and you will query it more than once. Use SAX when the document is large and you can decide as each element arrives.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/org/xml/sax/ContentHandler.html
""",
"""**Definition:**

Разбор DOM строит дерево и возвращает его. Разбор SAX сообщает события по мере чтения и дерево не хранит.

**How it works:**

- В браузере `DOMParser.parseFromString()` разбирает строку XML в `Document`. Дальше вы обходите `childNodes` или запрашиваете дерево. После возврата вызова весь документ в памяти.
- SAX `ContentHandler` — другой контракт. Приложение регистрирует обработчик через `setContentHandler`. Разборщик вызывает `startDocument`, `startElement`, `characters`, `endElement` и `endDocument` в порядке документа. Содержимое элемента сообщается между парными событиями начала и конца.
- DOM можно пересматривать и менять. SAX — один проход. Если родитель нужен после того, как вы увидели следующего соседа, SAX уже ушёл дальше, если вы сами его не сохранили.
- SAX может отвергнуть работу или пропустить её до конца документа. Фатальная ошибка может остановить разбор так, что `endDocument` не будет вызван.

**When to use:**

Используйте DOM или `DOMParser`, когда документ достаточно мал, чтобы его держать, и вы будете запрашивать его больше одного раза. Используйте SAX, когда документ велик и решение можно принять по мере прихода каждого элемента.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/org/xml/sax/ContentHandler.html
""")

add("What are the advantages and disadvantages of using DOM parsing?",
"""**Definition:**

DOM parsing gives you a `Document` you can traverse and change. The cost is that the tree exists in memory for the whole document.

**How it works:**

- `DOMParser.parseFromString()` returns a `Document`. `XMLSerializer` can turn that tree back into XML text. Java’s `DocumentBuilder.parse` does the same job from a file, stream, URI, or SAX `InputSource`, and `newDocument()` builds an empty tree.
- Advantages: random access, a second query without rereading the file, and straightforward edits. XPath on MDN is defined as a way to address parts of that kind of tree.
- Disadvantages: memory grows with the document. You cannot emit a result until the parse finishes. A streaming handler such as SAX `ContentHandler` or StAX `XMLStreamReader` never holds the unused siblings.
- MDN notes that a `DocumentFragment` is a lighter place to assemble nodes before you attach them. It does not remove the cost of parsing a huge source into a `Document` first.

**When to use:**

Use DOM when you will query or edit the document and it fits in memory. Prefer a streaming parser when you only need one pass over a large file.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/parsers/DocumentBuilder.html
""",
"""**Definition:**

Разбор DOM даёт `Document`, который можно обходить и менять. Цена в том, что дерево лежит в памяти для всего документа.

**How it works:**

- `DOMParser.parseFromString()` возвращает `Document`. `XMLSerializer` может превратить это дерево обратно в текст XML. Java `DocumentBuilder.parse` делает ту же работу из файла, потока, URI или SAX `InputSource`, а `newDocument()` строит пустое дерево.
- Плюсы: произвольный доступ, второй запрос без повторного чтения файла и прямые правки. XPath на MDN определён как способ адресовать части такого дерева.
- Минусы: память растёт вместе с документом. Результат нельзя выдать, пока разбор не закончится. Потоковый обработчик вроде SAX `ContentHandler` или StAX `XMLStreamReader` не держит неиспользуемых соседей.
- MDN отмечает, что `DocumentFragment` — более лёгкое место собрать узлы перед присоединением. Он не снимает цену разбора огромного источника в `Document`.

**When to use:**

Используйте DOM, когда документ будут запрашивать или править и он помещается в память. Потоковый разборщик предпочтителен, когда нужен один проход по большому файлу.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/javax/xml/parsers/DocumentBuilder.html
""")

add("Describe the concept of XML XPath and its usage.",
"""**Definition:**

XPath is the XML Path Language. MDN says it uses a non-XML syntax to address parts of an XML document and to test whether a node matches a pattern.

**How it works:**

- Paths look like URLs: steps through the tree. The non-XML syntax is deliberate so a path can sit in a URI or in an attribute value.
- XPath is mainly used in XSLT. MDN also documents it as a way to navigate the DOM of an XML-like document, including HTML and SVG, through `XPathExpression`, instead of only `getElementById`, `querySelectorAll`, and `childNodes`.
- Axes describe relationships between nodes. Functions compute on the nodes a path selects. MDN keeps those two lists as the reference.
- A path does not transform the document. It selects. Transformation is XSLT’s job, and querying a collection of documents is XQuery’s.

**Examples:**

A path such as `/catalog/book[@id='b1']/title` points at the `title` child of the `book` whose `id` attribute is `b1`, starting from the document root.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/XML/XPath
""",
"""**Definition:**

XPath — язык путей XML. MDN говорит, что он использует не-XML синтаксис, чтобы адресовать части XML-документа и проверять, соответствует ли узел образцу.

**How it works:**

- Пути похожи на URL: шаги по дереву. Не-XML синтаксис намеренный, чтобы путь мог стоять в URI или в значении атрибута.
- XPath в основном используют в XSLT. MDN также описывает его как способ ходить по DOM XML-подобного документа, включая HTML и SVG, через `XPathExpression`, а не только через `getElementById`, `querySelectorAll` и `childNodes`.
- Оси описывают отношения между узлами. Функции считают над узлами, которые путь выбрал. MDN держит эти два списка как справочник.
- Путь документ не преобразует. Он выбирает. Преобразование — задача XSLT, а запрос к набору документов — задача XQuery.

**Examples:**

Путь вроде `/catalog/book[@id='b1']/title` указывает на дочерний `title` того `book`, у которого атрибут `id` равен `b1`, начиная от корня документа.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/XML/XPath
""")

add("What is the purpose of XML XSLT and how does it work?",
"""**Definition:**

XSLT is a language for transforming XML documents into other XML documents. XSLT 3.0 is designed to be used with XPath 3.0 and shares XPath’s data model.

**How it works:**

- A stylesheet matches nodes and writes a result tree. XPath, not a second XML query language, is how a template addresses the source.
- XSLT 3.0’s main change from 2.0 is streaming: a transformation that does not have to hold the entire source or the entire result in memory. The other aim is modularity, so a large stylesheet can be built from independently developed components.
- The stylesheet is itself XML. The source is XML. The result is often XML, but the language’s stated primary purpose is transforming XML into other XML.
- SAX has a `TransformerHandler` among the known implementors of `ContentHandler`, which is the event-shaped way a processor can receive the source. You do not have to build a DOM first if the processor streams.

**When to use:**

Use XSLT when the job is a declarative mapping from one XML shape to another. Use application code when the mapping depends on state XSLT would only obscure.

**Sources:**

- https://www.w3.org/TR/xslt-30/#intro
- https://developer.mozilla.org/en-US/docs/Web/XML/XPath
""",
"""**Definition:**

XSLT — язык преобразования XML-документов в другие XML-документы. XSLT 3.0 рассчитан на использование вместе с XPath 3.0 и делит с XPath модель данных.

**How it works:**

- Таблица стилей сопоставляет узлы и пишет дерево результата. XPath, а не второй язык запросов XML, — это то, как шаблон адресует источник.
- Главное изменение XSLT 3.0 относительно 2.0 — потоковый режим: преобразование, которому не нужно держать в памяти весь источник или весь результат. Другая цель — модульность, чтобы большую таблицу стилей можно было собрать из независимо разработанных компонентов.
- Сама таблица стилей — XML. Источник — XML. Результат часто тоже XML, но заявленная основная цель языка — преобразовывать XML в другой XML.
- У SAX среди известных реализаций `ContentHandler` есть `TransformerHandler`: это событийный способ, которым процессор может получить источник. DOM заранее строить не обязательно, если процессор работает потоком.

**When to use:**

Используйте XSLT, когда задача — декларативное отображение одной формы XML в другую. Код приложения используйте, когда отображение зависит от состояния, которое XSLT только затуманит.

**Sources:**

- https://www.w3.org/TR/xslt-30/#intro
- https://developer.mozilla.org/en-US/docs/Web/XML/XPath
""")

add("Explain the concept of XML DOM traversal and manipulation.",
"""**Definition:**

DOM traversal walks the node tree a parser built. Manipulation inserts, moves, or replaces those nodes, then can serialize the tree back to XML.

**How it works:**

- `DOMParser.parseFromString()` produces a `Document`. From there, `childNodes`, `getElementById`, and `querySelectorAll` walk elements. MDN also points at XPath as a more powerful address into the same tree.
- `DocumentFragment` is the usual place to assemble a subtree off to the side. `append`, `prepend`, and `replaceChildren` change its children. Appending the fragment to a live parent moves the nodes and leaves the fragment empty.
- `XMLSerializer` performs the opposite of parsing: a DOM tree becomes XML or HTML source.
- Java’s `DocumentBuilder.newDocument()` creates an empty `Document` you can fill, and `parse` fills one from bytes. Edits are to the tree, not to the original file, until you write the serialization out.
- Traversal sees the logical tree. Attribute order on a start tag is not significant in XML, so do not depend on attribute order surviving a parse and a write.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
- https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
- https://www.w3.org/TR/xml/#sec-starttags
""",
"""**Definition:**

Обход DOM проходит по дереву узлов, которое построил разборщик. Изменение вставляет, перемещает или заменяет эти узлы, а затем может сериализовать дерево обратно в XML.

**How it works:**

- `DOMParser.parseFromString()` создаёт `Document`. Дальше `childNodes`, `getElementById` и `querySelectorAll` обходят элементы. MDN также указывает на XPath как на более сильную адресацию в то же дерево.
- `DocumentFragment` — обычное место собрать поддерево в стороне. `append`, `prepend` и `replaceChildren` меняют его детей. Присоединение фрагмента к живому родителю переносит узлы и оставляет фрагмент пустым.
- `XMLSerializer` делает обратное разбору: дерево DOM становится исходным текстом XML или HTML.
- Java `DocumentBuilder.newDocument()` создаёт пустой `Document`, который можно наполнить, а `parse` наполняет его из байтов. Правки относятся к дереву, а не к исходному файлу, пока вы не запишете сериализацию.
- Обход видит логическое дерево. Порядок атрибутов в открывающем теге в XML не значим, поэтому не рассчитывайте, что порядок атрибутов переживёт разбор и запись.

**Sources:**

- https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
- https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
- https://www.w3.org/TR/xml/#sec-starttags
""")

p.write_text(json.dumps(PAIRS, ensure_ascii=False))
print(len(PAIRS))
