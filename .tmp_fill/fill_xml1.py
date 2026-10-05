#!/usr/bin/env python3
import json
from pathlib import Path
p = Path("/Users/radomir/Documents/business/MyConspect/.tmp_fill/xml_pairs.json")
PAIRS = []

def add(h, en, ru):
    PAIRS.append((h, en.strip(), ru.strip()))

add("What is the purpose of the XML prolog and what does it contain?",
"""**Definition:**

The prolog is the optional front of an XML document, before the root element. XML 1.0 says documents should begin with an XML declaration that specifies the version of XML being used.

**How it works:**

- The production is an optional XML declaration, then miscellaneous markup (comments and processing instructions), then an optional document type declaration and more miscellaneous markup.
- The XML declaration is `<?xml`, a required version, an optional encoding, and an optional standalone declaration, closed by `?>`. MDN’s form is `<?xml version="1.0" encoding="UTF-8"?>`.
- The document type declaration, when present, comes before the first element. It is what makes a document a candidate for validity: the document is valid only if it has one and complies with it.
- A document with only a root element and no declaration is still well-formed. `<?xml version="1.0"?><greeting>Hello, world!</greeting>` and `<greeting>Hello, world!</greeting>` are both complete well-formed documents in the spec’s examples. The second is not valid, because it has no document type declaration.

**Examples:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<greeting>Hello, world!</greeting>
```

**Sources:**

- https://www.w3.org/TR/xml/#sec-prolog-dtd
- https://developer.mozilla.org/en-US/docs/Web/XML/Guides/XML_introduction
""",
"""**Definition:**

Пролог — необязательное начало XML-документа перед корневым элементом. XML 1.0 говорит, что документы следует начинать с XML-декларации, которая указывает используемую версию XML.

**How it works:**

- Продукция — необязательная XML-декларация, затем прочая разметка (комментарии и инструкции обработки), затем необязательное объявление типа документа и ещё прочая разметка.
- XML-декларация — это `<?xml`, обязательная версия, необязательная кодировка и необязательное объявление standalone, и закрывается `?>`. Форма у MDN: `<?xml version="1.0" encoding="UTF-8"?>`.
- Объявление типа документа, если оно есть, стоит до первого элемента. Именно оно делает документ кандидатом на действительность: документ действителен, только если объявление есть и документ ему соответствует.
- Документ из одного корневого элемента без декларации всё равно правильно сформирован. `<?xml version="1.0"?><greeting>Hello, world!</greeting>` и `<greeting>Hello, world!</greeting>` в примерах спецификации — оба законченных правильно сформированных документа. Второй не действителен, потому что у него нет объявления типа документа.

**Examples:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<greeting>Hello, world!</greeting>
```

**Sources:**

- https://www.w3.org/TR/xml/#sec-prolog-dtd
- https://developer.mozilla.org/en-US/docs/Web/XML/Guides/XML_introduction
""")

add("Describe the concept of XML character references and their usage.",
"""**Definition:**

A character reference names one character by its code point in ISO/IEC 10646. Decimal form is `&#` digits `;`. Hexadecimal form is `&#x` hex digits `;`.

**How it works:**

- The referenced character must match the Char production. That is a well-formedness constraint.
- `&#x` takes the hexadecimal code point. `&#` takes the decimal code point. Both end at `;`.
- Numeric character references are expanded when recognized and must be treated as character data. The spec says `&#60;` and `&#38;` may escape `<` and `&` in character data.
- They are not entity references. An entity reference is `&` name `;` and pulls in a named entity. The five predefined entities are `amp`, `lt`, `gt`, `apos`, and `quot`. Processors must recognize those whether or not they are declared.
- Use a character reference for a character you cannot type, or when you must write `<` or `&` as character data without a CDATA section.

**Examples:**

```xml
<price>&#8364;10</price>
<compare>&#60; and &#38;</compare>
```

**Sources:**

- https://www.w3.org/TR/xml/#sec-references
- https://www.w3.org/TR/xml/#sec-predefined-ent
""",
"""**Definition:**

Ссылка на символ называет один символ его кодовой позицией в ISO/IEC 10646. Десятичная форма — `&#` цифры `;`. Шестнадцатеричная — `&#x` шестнадцатеричные цифры `;`.

**How it works:**

- Указанный символ должен соответствовать продукции Char. Это ограничение правильной сформированности.
- `&#x` берёт шестнадцатеричную кодовую позицию. `&#` берёт десятичную. Обе формы кончаются на `;`.
- Числовые ссылки на символы раскрываются при распознавании и должны считаться символьными данными. Спецификация говорит, что `&#60;` и `&#38;` могут экранировать `<` и `&` в символьных данных.
- Это не ссылки на сущности. Ссылка на сущность — `&` имя `;` и подставляет именованную сущность. Пять предопределённых сущностей — `amp`, `lt`, `gt`, `apos` и `quot`. Процессоры должны узнавать их независимо от объявления.
- Ссылку на символ используют для символа, который нельзя набрать, или когда `<` или `&` нужно записать как символьные данные без секции CDATA.

**Examples:**

```xml
<price>&#8364;10</price>
<compare>&#60; and &#38;</compare>
```

**Sources:**

- https://www.w3.org/TR/xml/#sec-references
- https://www.w3.org/TR/xml/#sec-predefined-ent
""")

add("What is the difference between an XML document and an XML fragment?",
"""**Definition:**

An XML document matches the document production: an optional prolog, exactly one root element, and optional miscellaneous markup after it. A fragment is a piece of that tree, not a document by itself.

**How it works:**

- Well-formedness requires one or more elements and exactly one root, with every other element nested inside it. Two sibling elements with no parent are not a document.
- MDN’s `Document` is the object `DOMParser.parseFromString()` returns when it parses a full XML or HTML source string. `XMLSerializer` turns a DOM tree back into source.
- A `DocumentFragment` is a minimal document object with no parent. It stores a segment of nodes and is not part of the active document tree. Changes to the fragment do not change the document until you insert the fragment.
- Inserting the fragment with `append()` or `appendChild()` moves its children into the document and leaves the fragment empty.
- Do not send a fragment to a parser that requires a single root and expect a document. Wrap it in one root element first.

**When to use:**

Parse a document when you have one root and need a `Document`. Build a `DocumentFragment` when you are assembling several nodes before attaching them to a live tree.

**Sources:**

- https://www.w3.org/TR/xml/#sec-well-formed
- https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
- https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
""",
"""**Definition:**

XML-документ соответствует продукции document: необязательный пролог, ровно один корневой элемент и необязательная прочая разметка после него. Фрагмент — кусок этого дерева, а не документ сам по себе.

**How it works:**

- Правильная сформированность требует один или несколько элементов и ровно один корень, внутри которого вложены все остальные. Два соседних элемента без родителя — не документ.
- `Document` у MDN — объект, который возвращает `DOMParser.parseFromString()`, когда разбирает полную строку XML или HTML. `XMLSerializer` превращает дерево DOM обратно в исходный текст.
- `DocumentFragment` — минимальный объект документа без родителя. Он хранит отрезок узлов и не входит в активное дерево документа. Изменения фрагмента не меняют документ, пока фрагмент не вставлен.
- Вставка фрагмента через `append()` или `appendChild()` переносит его детей в документ и оставляет фрагмент пустым.
- Не отдавайте фрагмент разборщику, которому нужен один корень, и не ждите документ. Сначала оберните его одним корневым элементом.

**When to use:**

Разбирайте документ, когда есть один корень и нужен `Document`. Собирайте `DocumentFragment`, когда несколько узлов нужно собрать до присоединения к живому дереву.

**Sources:**

- https://www.w3.org/TR/xml/#sec-well-formed
- https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
- https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
""")

add("Explain the concept of XML whitespace handling.",
"""**Definition:**

White space in XML is one or more spaces (`#x20`), tabs (`#x9`), carriage returns (`#xD`), or line feeds (`#xA`). An XML processor must pass every character that is not markup through to the application.

**How it works:**

- Editors use white space to lay out tags. That white space is often not meant to be part of the delivered text. Poetry and source code are the spec’s examples of significant white space that should be kept.
- A validating processor must also tell the application which of those characters are white space in element content. SAX exposes that split: a validating parser reports ignorable white space through `ignorableWhitespace`, not only through `characters`.
- `xml:space` on an element signals intent. In a valid document it must be declared as an enumeration of `default`, `preserve`, or both. `default` means the application’s normal handling is acceptable. `preserve` means keep all the white space. The value applies to descendants until another `xml:space` overrides it. Any other value is an error.
- End-of-line handling happens first: literal `#xD` characters are removed or replaced by `#xA` before other processing. A character reference is how a `#xD` can still match the white-space production inside an entity value.

**Sources:**

- https://www.w3.org/TR/xml/#sec-white-space
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/org/xml/sax/ContentHandler.html
""",
"""**Definition:**

Пробельные символы в XML — это один или несколько пробелов (`#x20`), табуляций (`#x9`), возвратов каретки (`#xD`) или переводов строки (`#xA`). XML-процессор обязан передать приложению каждый символ, который не является разметкой.

**How it works:**

- Редакторы ставят пробелы, чтобы разложить теги. Эти пробелы часто не должны входить в выдаваемый текст. Поэзия и исходный код — примеры спецификации значимых пробелов, которые нужно сохранить.
- Проверяющий процессор обязан также сообщить приложению, какие из этих символов — пробелы в содержимом элемента. SAX показывает это разделение: проверяющий разборщик сообщает игнорируемые пробелы через `ignorableWhitespace`, а не только через `characters`.
- `xml:space` на элементе сообщает намерение. В действительном документе атрибут надо объявить перечислением `default`, `preserve` или обоих. `default` значит, что обычная обработка приложения приемлема. `preserve` значит сохранить все пробелы. Значение действует на потомков, пока другой `xml:space` его не перекроет. Любое иное значение — ошибка.
- Сначала обрабатываются концы строк: литеральные символы `#xD` удаляются или заменяются на `#xA` до другой обработки. Ссылка на символ — способ, которым `#xD` всё ещё может соответствовать продукции пробела внутри значения сущности.

**Sources:**

- https://www.w3.org/TR/xml/#sec-white-space
- https://docs.oracle.com/en/java/javase/21/docs/api/java.xml/org/xml/sax/ContentHandler.html
""")

add("What is XML Schema and its purpose?",
"""**Definition:**

XML Schema Definition Language describes the structure of XML documents and constrains their contents, including documents that use XML namespaces. The schema is itself an XML vocabulary and uses namespaces.

**How it works:**

- XSD 1.1 Part 1 substantially reconstructs and extends what a DTD can say. It depends on Part 2, Datatypes.
- A document can be well-formed and still fail a schema. Validity against a DTD is the XML 1.0 notion (a document type declaration plus compliance). Schema validation is the later, richer check.
- Components include element declarations, attribute declarations, simple type definitions, and complex type definitions. An element declaration associates a name with a type, an optional default, and identity constraints.
- `targetNamespace` on the `schema` element names the namespace the schema defines. The structures spec’s own example is `<schema targetNamespace="http://www.example.com/XMLSchema/1.0/mySchema">`.

**When to use:**

Use a schema when consumers must reject documents that are well-formed but shaped wrong. Use a DTD only when you are maintaining a document type that already has one.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""",
"""**Definition:**

Язык определения схемы XML описывает структуру XML-документов и ограничивает их содержимое, включая документы, которые используют пространства имён XML. Сама схема — словарь XML и использует пространства имён.

**How it works:**

- XSD 1.1 Part 1 существенно пересобирает и расширяет то, что может сказать DTD. Он зависит от Part 2, Datatypes.
- Документ может быть правильно сформирован и всё равно не пройти схему. Действительность относительно DTD — это понятие XML 1.0 (объявление типа документа плюс соответствие). Проверка схемой — более поздняя и более богатая проверка.
- Среди компонентов — объявления элементов, объявления атрибутов, определения простых типов и определения сложных типов. Объявление элемента связывает имя с типом, необязательным значением по умолчанию и ограничениями тождества.
- `targetNamespace` на элементе `schema` называет пространство имён, которое схема определяет. Пример самой спецификации структур: `<schema targetNamespace="http://www.example.com/XMLSchema/1.0/mySchema">`.

**When to use:**

Используйте схему, когда потребители должны отвергать документы, которые правильно сформированы, но имеют неверную форму. DTD оставляйте там, где тип документа уже им описан.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""")

add("Explain the difference between XML DTD and XML Schema.",
"""**Definition:**

A DTD is the document type declaration’s constraint language from XML 1.0. XML Schema is a separate XML vocabulary that describes structure and datatypes, and it extends what DTDs can express.

**How it works:**

- XML 1.0 says a document is valid if it has an associated document type declaration and complies with the constraints in it. The declaration must appear before the first element.
- The schema specification says the schema language substantially reconstructs and considerably extends DTD capabilities, and that it is itself represented in XML and uses namespaces. A DTD is not an XML document instance in that sense.
- Schema ties an element to a simple or complex type. A simple type constrains strings and the values they encode, for attributes and for text-only elements. A DTD’s attribute types are a smaller set (the XML spec’s CDATA, ID, IDREF, and the rest).
- Namespaces are a schema concern the DTD does not model as a namespace URI. The structures spec calls out documents which exploit the XML Namespace facility.

**When to use:**

Prefer XML Schema for new vocabularies that need types, namespaces, and constraints beyond a DTD. Keep a DTD when existing documents are validated that way and you are not ready to migrate.

**Sources:**

- https://www.w3.org/TR/xml/#sec-prolog-dtd
- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""",
"""**Definition:**

DTD — язык ограничений из объявления типа документа в XML 1.0. XML Schema — отдельный словарь XML, который описывает структуру и типы данных и расширяет то, что могут выразить DTD.

**How it works:**

- XML 1.0 говорит, что документ действителен, если у него есть связанное объявление типа документа и он соответствует ограничениям в нём. Объявление должно стоять до первого элемента.
- Спецификация схемы говорит, что язык схемы существенно пересобирает и значительно расширяет возможности DTD и что сам он представлен в XML и использует пространства имён. DTD в этом смысле не является экземпляром XML-документа.
- Схема связывает элемент с простым или сложным типом. Простой тип ограничивает строки и значения, которые они кодируют, для атрибутов и для элементов только с текстом. Типы атрибутов DTD — более узкий набор (CDATA, ID, IDREF и остальные из спецификации XML).
- Пространства имён — забота схемы, которую DTD не моделирует как URI пространства имён. Спецификация структур отдельно говорит о документах, которые пользуются средством пространств имён XML.

**When to use:**

Для новых словарей, которым нужны типы, пространства имён и ограничения шире DTD, предпочитайте XML Schema. DTD оставляйте, когда существующие документы проверяются так и вы ещё не готовы к переносу.

**Sources:**

- https://www.w3.org/TR/xml/#sec-prolog-dtd
- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""")

add("What are the key components of an XML Schema document?",
"""**Definition:**

An XML Schema is a set of schema components. The ones interviews name first are element declarations, attribute declarations, simple type definitions, and complex type definitions.

**How it works:**

- An element declaration associates a name with a simple or complex type, an optional default or fixed value, and a possibly empty set of identity-constraint definitions. It is either global or scoped to a complex type. The structures spec compares a top-level element declaration to a pair of DTD declarations.
- A complex type definition is a set of attribute declarations and a content type for the attributes and children of an element. The content may be empty, a string of a simple type, or a sequence of elements.
- A simple type definition is a set of constraints on strings and on the values they encode. It applies to attribute values and to elements with no element children. Each simple type, built-in or user-defined, is a restriction of its base type.
- Other components in the same specification include model groups, attribute groups, notations, and identity constraints. You do not need every component in a small schema. You do need a type for every element you want validated.
- The document element is `schema`, and `targetNamespace` names the namespace being defined.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""",
"""**Definition:**

XML Schema — это набор компонентов схемы. Те, которые на собеседовании называют первыми, — объявления элементов, объявления атрибутов, определения простых типов и определения сложных типов.

**How it works:**

- Объявление элемента связывает имя с простым или сложным типом, необязательным значением по умолчанию или фиксированным значением и, возможно, пустым набором ограничений тождества. Оно либо глобальное, либо ограничено сложным типом. Спецификация структур сравнивает объявление элемента верхнего уровня с парой объявлений DTD.
- Определение сложного типа — набор объявлений атрибутов и тип содержимого для атрибутов и детей элемента. Содержимое может быть пустым, строкой простого типа или последовательностью элементов.
- Определение простого типа — набор ограничений на строки и на значения, которые они кодируют. Оно применяется к значениям атрибутов и к элементам без элементов-детей. Каждый простой тип, встроенный или пользовательский, — ограничение своего базового типа.
- Другие компоненты той же спецификации — группы моделей, группы атрибутов, нотации и ограничения тождества. В маленькой схеме не нужен каждый компонент. Нужен тип для каждого элемента, который вы хотите проверять.
- Корневой элемент — `schema`, а `targetNamespace` называет определяемое пространство имён.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""")

add("Describe the concept of XML Schema data types.",
"""**Definition:**

XML Schema datatypes are the simple types Part 2 defines and the restrictions you build from them. A simple type constrains a string and the value that string encodes.

**How it works:**

- The structures spec says each simple type definition, built-in or user-defined, is a restriction of its base type. Built-in types are defined in XML Schema Datatypes. User-defined types restrict a base rather than starting from nothing.
- A simple type applies to an attribute value or to an element that has no element children. It does not describe nested elements. Nested structure is a complex type.
- The actual value is not always a string. The structures spec notes that it can be an integer, a boolean, a URI reference, and so on, after the lexical string is mapped.
- Facets, including the enumeration facet the structures spec names, are how a restriction narrows the base type.
- Part 1 depends on Part 2. You cannot talk about `xs:integer` or `xs:date` as structures-only ideas. They come from the datatypes specification.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""",
"""**Definition:**

Типы данных XML Schema — это простые типы, которые определяет Part 2, и ограничения, которые вы строите из них. Простой тип ограничивает строку и значение, которое эта строка кодирует.

**How it works:**

- Спецификация структур говорит, что каждое определение простого типа, встроенное или пользовательское, является ограничением своего базового типа. Встроенные типы определены в XML Schema Datatypes. Пользовательские типы ограничивают базу, а не начинаются из ничего.
- Простой тип применяется к значению атрибута или к элементу без элементов-детей. Вложенные элементы он не описывает. Вложенная структура — это сложный тип.
- Фактическое значение — не всегда строка. Спецификация структур отмечает, что после отображения лексической строки это может быть целое, логическое значение, ссылка URI и так далее.
- Фасеты, включая фасет enumeration, который называет спецификация структур, — это способ, которым ограничение сужает базовый тип.
- Part 1 зависит от Part 2. Нельзя говорить о `xs:integer` или `xs:date` как об идеях только структур. Они приходят из спецификации типов данных.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""")

add("What is the purpose of XML Schema elements and attributes?",
"""**Definition:**

In a schema, an element declaration and an attribute declaration say which names may appear and which type each name has. They are the bridge from a tag in the instance to a type in the schema.

**How it works:**

- An element declaration associates a name with a simple or complex type, an optional value constraint, and identity constraints. Global declarations can be referenced from many content models. A local declaration is scoped to the complex type that contains it.
- Attributes are declared as part of a complex type. The complex type definition is a set of attribute declarations plus a content type for the children.
- In the instance, XML 1.0 already treats attributes as name-value pairs on a start tag, with order not significant and with each name unique. The schema adds the type and whether the attribute is required.
- Use an element when the value has children or must repeat in order. Use an attribute for a single token that qualifies the element, such as `xml:lang`.

**When to use:**

Declare an element for structured or repeating data. Declare an attribute for a simple qualifier that does not itself contain elements.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
- https://www.w3.org/TR/xml/#sec-starttags
""",
"""**Definition:**

В схеме объявление элемента и объявление атрибута говорят, какие имена могут появиться и какой тип у каждого имени. Это мост от тега в экземпляре к типу в схеме.

**How it works:**

- Объявление элемента связывает имя с простым или сложным типом, необязательным ограничением значения и ограничениями тождества. Глобальные объявления можно ссылать из многих моделей содержимого. Локальное объявление ограничено сложным типом, который его содержит.
- Атрибуты объявляют как часть сложного типа. Определение сложного типа — набор объявлений атрибутов плюс тип содержимого для детей.
- В экземпляре XML 1.0 уже считает атрибуты парами имя-значение на открывающем теге: порядок не значим, и каждое имя уникально. Схема добавляет тип и то, обязателен ли атрибут.
- Элемент используют, когда у значения есть дети или оно должно повторяться по порядку. Атрибут — для одного токена, который уточняет элемент, например `xml:lang`.

**When to use:**

Объявляйте элемент для структурированных или повторяющихся данных. Объявляйте атрибут для простого уточнения, которое само не содержит элементов.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
- https://www.w3.org/TR/xml/#sec-starttags
""")

add("Explain the concept of XML Schema complex types and their usage.",
"""**Definition:**

A complex type definition is a set of attribute declarations and a content type. It applies to the attributes and the children of an element.

**How it works:**

- The content type may require the children to be empty, or to be a string of a particular simple type, or to contain elements according to a content model.
- A complex type that allows element or attribute content in addition to what another type allows is an extension. A restriction narrows a base type. The structures spec notes that a vacuous restriction and a vacuous extension would accept the same inputs, but the syntax still requires each derived type to be written as one or the other.
- Use a complex type whenever an element has child elements or attributes that you want validated. A text-only element with no attributes can stay a simple type.
- Identity constraints and substitution-group affiliations hang off the element declaration, not off the idea of “a complex type” by itself. The type describes shape. The declaration attaches the shape to a name.

**When to use:**

Use a complex type for any element whose content is more than a single simple value. Extend a base when you are adding attributes or children. Restrict a base when every valid instance of the new type must already have been valid for the base.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""",
"""**Definition:**

Определение сложного типа — это набор объявлений атрибутов и тип содержимого. Оно применяется к атрибутам и детям элемента.

**How it works:**

- Тип содержимого может требовать, чтобы дети были пустыми, или были строкой определённого простого типа, или содержали элементы по модели содержимого.
- Сложный тип, который разрешает содержимое элементов или атрибутов сверх того, что разрешает другой тип, — это расширение. Ограничение сужает базовый тип. Спецификация структур отмечает, что пустое ограничение и пустое расширение приняли бы одни и те же входы, но синтаксис всё равно требует записать каждый производный тип как одно или другое.
- Сложный тип нужен, когда у элемента есть дочерние элементы или атрибуты, которые вы хотите проверять. Элемент только с текстом и без атрибутов может остаться простым типом.
- Ограничения тождества и принадлежность к группе подстановки висят на объявлении элемента, а не на идее «сложного типа» самой по себе. Тип описывает форму. Объявление прикрепляет форму к имени.

**When to use:**

Используйте сложный тип для любого элемента, чьё содержимое богаче одного простого значения. Расширяйте базу, когда добавляете атрибуты или детей. Ограничивайте базу, когда каждый действительный экземпляр нового типа уже должен был быть действителен для базы.

**Sources:**

- https://www.w3.org/TR/xmlschema11-1/#intro-purpose
""")

p.write_text(json.dumps(PAIRS, ensure_ascii=False))
print(len(PAIRS))
