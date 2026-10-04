# XML — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [XML — Interview](./0_sd_xml_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — XML](https://devinterview.io/questions/software-architecture-and-system-design/xml-interview-questions/).

### XML Fundamentals

<details>
<summary>What is XML and what does it stand for?</summary>

### What is XML and what does it stand for?

**Definition:**

XML stands for Extensible Markup Language. It is a text format for trees of named elements, so two systems can exchange a document whose structure is explicit in the tags.

**How it works:**

- An element has a name, optional attributes, and content that is text, child elements, or both.
- A document has one root element. It is well-formed when the tags nest and close correctly, and valid when it also matches a DTD or a schema.
- Namespaces keep the same local name from colliding when vocabularies mix.
- People use it for data exchange, configuration, and document markup. XPath selects nodes, XSLT transforms them, XQuery queries them, and XML Schema describes them.
- It describes structure. It does not, by itself, present a page or run a script. HTML does that job with a fixed vocabulary.
- The format is verbose compared with JSON. It pays off when you need mixed content, namespaces, or a strict schema.

**Examples:**

```xml
<order id="17"><sku>A1</sku><qty>2</qty></order>
```

The tags say what each value is. A reader does not have to guess that the second field is a quantity.
</details>

<details>
<summary>What are the key features and benefits of XML?</summary>

### What are the key features and benefits of XML?

**Definition:**

XML is a self-describing tree in plain text. The tags travel with the data, so a receiver can see the structure without a separate out-of-band layout.

**How it works:**

- Elements nest, so a value can contain structure, not only a flat list of fields.
- It is text, usually Unicode, so it crosses platforms and languages without a binary layout.
- You invent element names (it is extensible) and can constrain them later with a schema.
- Comments and processing instructions can ride in the document without becoming data.
- A schema gives validation: types, which children are required, and how many.
- Namespaces let you mix vocabularies. Versioning is mostly “add an optional element” or a new namespace, so old readers can skip what they do not know if they were written to.
- The benefit is interoperability and a standard toolchain. The cost is size and the need to escape `<` and `&`.

**Examples:**

A supplier adds `<note>` inside `<item>` without breaking a reader that only looks at `<sku>` and `<qty>`, as long as the schema says the note is optional.
</details>

<details>
<summary>Explain the difference between XML and HTML.</summary>

### Explain the difference between XML and HTML.

**Definition:**

XML is a toolkit for defining markup languages. HTML is one markup language, aimed at documents in a browser, with a vocabulary the browser already understands.

**How it works:**

- HTML’s purpose is presentation and interaction: headings, forms, scripts. XML’s purpose is to carry a structure you named.
- HTML tags are fixed (`p`, `a`). XML tags are yours (`sku`, `qty`).
- XML must be well-formed: one root, closed tags, quoted attributes. HTML parsers repair a lot of broken markup. XHTML is HTML written under XML’s stricter rules.
- XML attributes and elements are data. HTML attributes often feed rendering and behavior (`href`, `onclick`).
- HTML documents are interactive because the browser runs script and applies CSS. An XML document does nothing until a program interprets it.
- Both can look similar as tags. Mixing them up means either a browser that will not render your `<order>`, or a strict parser that rejects an unclosed `<p>`.

**Examples:**

```html
<p>Qty: 2</p>
```

is HTML a browser shows. `<qty>2</qty>` is XML a program reads. The browser does not know that `qty` is a number. Your schema might.
</details>

<details>
<summary>What is an XML document and what are its main components?</summary>

### What is an XML document and what are its main components?

**Definition:**

An XML document is one tree: an optional declaration, optional comments and processing instructions, and exactly one root element that contains the rest.

**How it works:**

- The prolog may start with `<?xml version="1.0" encoding="UTF-8"?>`. It is not an element.
- The root element wraps every other element. Two top-level elements are not a well-formed document.
- Inside the root you get elements, text, attributes on those elements, comments, and processing instructions.
- Well-formed means the grammar of XML itself: matching tags, quoted attributes, legal characters.
- Valid means a DTD or schema additionally accepts this tree. A well-formed document can still be invalid.
- Entity references such as `&amp;` are resolved into characters before you see the text value.

**Examples:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="b1">XML</book>
</catalog>
```

`catalog` is the root. `book` is a child. `id` is an attribute. The declaration is metadata for the parser, not a node in the element tree in the same way.
</details>

<details>
<summary>Describe the structure of an XML element.</summary>

### Describe the structure of an XML element.

**Definition:**

An element is a start tag, content, and an end tag with the same name. The start tag may carry attributes. Content is text, child elements, or empty.

**How it works:**

- `<book id="b1">Guide</book>`: name `book`, attribute `id`, text content `Guide`.
- Names are case-sensitive. `<Book>` and `<book>` are different.
- Tags must nest. You close the inner element before the outer one. Overlap is not allowed.
- Attribute values are quoted. An attribute name appears at most once on a tag.
- An empty element can be written `<flag></flag>` or `<flag/>`. Both have no children. Attributes are allowed on either form.
- Character data that must include raw `<` can sit in a CDATA section. Otherwise `<` and `&` are escaped.

**Examples:**

```xml
<book id="b1">
  <title>Guide</title>
</book>
```

`book` contains one child element, not the text `Guide` directly. A JSON object with `"title": "Guide"` is a different tree with the same facts.
</details>

<details>
<summary>What is the purpose of XML attributes?</summary>

### What is the purpose of XML attributes?

**Definition:**

Attributes hang small named values on an element, usually metadata about that element rather than a structure of their own.

**How it works:**

- They appear in the start tag: `id="b1"`, `lang="en"`. The value is always text, always quoted.
- A given name occurs once. If you need many values or nested values, use child elements.
- They suit identifiers, types, and flags: compact, unordered, and not repeated.
- Elements suit content that has its own children, repeats, or mixed text. An attribute cannot contain an element.
- Whitespace in an attribute is normalized more aggressively than in element text. Long prose belongs in an element.
- Whether something is an attribute or a child is a design choice in your vocabulary, not a rule XML enforces beyond the syntax.

**Examples:**

```xml
<book id="b1" lang="en">
  <title>Guide</title>
</book>
```

`id` and `lang` describe the book. The title is content, so it is an element and could later gain its own children.
</details>

<details>
<summary>Explain the concept of XML namespaces.</summary>

### Explain the concept of XML namespaces.

**Definition:**

A namespace keeps element and attribute names from colliding by tying a local name to a URI you choose. Two `id` names in different namespaces are different names.

**How it works:**

- You bind a prefix with `xmlns:ord="http://example.com/order"` and write `ord:id`.
- `xmlns="..."` sets the default namespace for that element and its children. Unprefixed elements use it. Unprefixed attributes do not. They stay in no namespace unless marked.
- The URI is an identifier, not a document the parser must download.
- Without namespaces, a combined document cannot tell your `title` from another vocabulary’s `title`.
- Schema validation and XPath need the same URIs. A prefix can change. The URI is what must match.
- Default namespaces are a common source of bugs: a child looks unprefixed and is still in the default namespace.

**Examples:**

```xml
<root xmlns:a="http://example.com/a" xmlns:b="http://example.com/b">
  <a:item id="1"/>
  <b:item id="2"/>
</root>
```

Both local names are `item`. They are not the same element. Drop the prefixes and a single schema cannot tell them apart.
</details>

<details>
<summary>What is the difference between well-formed and valid XML?</summary>

### What is the difference between well-formed and valid XML?

**Definition:**

Well-formed XML obeys the syntax rules of XML. Valid XML is well-formed and also satisfies a DTD or a schema you named.

**How it works:**

- Well-formed: one root, every start tag has an end tag, elements nest properly, attribute values are quoted, names are legal, and `&` and `<` in text are escaped.
- A parser rejects input that is not well-formed. There is no document to hand you.
- Validity adds a vocabulary: which elements may appear, in what order, how many times, which attributes are required, and what the text should look like (a date, an integer).
- A document can be well-formed and invalid: `<qty>lots</qty>` is fine syntax and fails a schema that says `qty` is an integer.
- Well-formedness is checked by every XML parser. Validity is checked only when you ask for DTD or schema validation.
- Do not skip well-formedness and “be liberal.” XML parsers are strict on purpose.

**Examples:**

`<a><b></a></b>` is not well-formed (the tags cross). `<qty>lots</qty>` inside a single root is well-formed. Against a schema where `qty` is `xs:integer`, it is invalid.
</details>

<details>
<summary>What is the role of XML declaration in an XML document?</summary>

### What is the role of XML declaration in an XML document?

**Definition:**

The XML declaration tells the parser which XML version and which character encoding the bytes use. It is optional, and it is not an element.

**How it works:**

- The form is `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`. It must be the very start of the file if you include it. No comment and no whitespace before it.
- `version` is `1.0` or `1.1`. 1.0 is what almost everything still uses.
- `encoding` names how to turn bytes into characters. If you omit the declaration, the parser falls back to UTF-8 or UTF-16 rules from the specification.
- `standalone="yes"` claims the document does not depend on external DTD declarations for its content. It is a hint to that processing, not a security switch.
- A wrong encoding declaration mojibakes the document or makes the parser fail. The bytes and the label have to match.
- It looks like a processing instruction. Treat it as the prolog, not as application data.

**Examples:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<note>café</note>
```

The file is UTF-8, so `é` is the UTF-8 bytes for that character. Labeling this file `encoding="UTF-16"` makes a correct parser reject it.
</details>

<details>
<summary>Describe the concept of XML entities and their usage.</summary>

### Describe the concept of XML entities and their usage.

**Definition:**

An entity is a named stand-in. When the parser sees a reference, it replaces it with the entity’s value. Built-in entities exist so markup characters can appear as text.

**How it works:**

- The predefined entities are `&lt;` `<`, `&gt;` `>`, `&amp;` `&`, `&apos;` `'`, and `&quot;` `"`. You need `&amp;` and `&lt;` in text or the parser thinks markup has started.
- A character reference is numeric: `&#233;` or `&#xE9;` is `é`. It does not need a declaration.
- A DTD can declare a general entity: `<!ENTITY city "Paris">`, used as `&city;` in content.
- Parameter entities (`%name;`) are for use inside the DTD itself, to reuse pieces of declarations.
- External entities point at another file or URL. That is the XXE problem: a parser that resolves them can be tricked into reading local files or calling internal hosts. Disable external entity resolution unless you fully control the DTD.
- Entities are expanded before your application sees the text. They are not tags.

**Examples:**

```xml
<note>Tom &amp; Jerry &#x2014; a title</note>
```

The text value is `Tom & Jerry — a title`. The raw `&` could not have been written unescaped.
</details>

### XML Syntax and Structure

<details>
<summary>What are the rules for naming XML elements and attributes?</summary>

### What are the rules for naming XML elements and attributes?

**Definition:**

Element and attribute names follow the same Name rule. They are case-sensitive, and they cannot contain spaces or start with a digit or punctuation that markup already uses.

**How it works:**

- A name may start with a letter, underscore, or colon. Later characters may also be digits, hyphens, and periods. Colons are allowed by the grammar but reserved for namespace prefixes. Do not put a colon in a name you invent unless it is a real prefix.
- `item`, `_id`, and `sku-2` are legal. `2sku`, `sku code`, and `sku<` are not.
- `<Item>` and `<item>` are two different elements. The same applies to attributes.
- There is no separate, stricter rule for attributes. `id` as an attribute is not special to the XML grammar (some applications treat `xml:id` specially).
- Names that start with `xml` in any case are reserved for the specification (`xml:lang`, `xml:space`).
- Prefer short, stable names without colons. The schema, not the name grammar, says which names are allowed in your vocabulary.

**Examples:**

```xml
<sku-code region="eu">A1</sku-code>   <!-- legal -->
<!-- <2sku region=eu> is illegal: name starts with a digit, attribute is unquoted -->
```
</details>

<details>
<summary>Explain the difference between XML elements and attributes.</summary>

### Explain the difference between XML elements and attributes.

**Definition:**

Elements build the tree and can contain text and other elements. Attributes are unordered name-value strings on a single element, and they cannot repeat or nest.

**How it works:**

- An element can appear many times as a sibling (`<sku>` twice). An attribute name can appear only once on that tag.
- An element can hold children and mixed content. An attribute value is flat text.
- Order of elements is significant in the document. Order of attributes is not. Parsers may hand them back in any order.
- Attributes fit ids, language, and units. Elements fit lists, long text, and anything that may grow structure later.
- Some APIs make attributes slightly more awkward to extend. Adding a child is usually a compatible change. Changing an attribute into an element is not.
- Neither is “more valid.” Validity is whatever your schema says. The split is about shape.

**Examples:**

```xml
<book id="b1">
  <author>Ada</author>
  <author>Edsger</author>
</book>
```

Two authors need elements. `author="Ada"` cannot be repeated on the same `book`, and it cannot later grow a `<born>` child.
</details>

<details>
<summary>What is the purpose of XML comments and how are they represented?</summary>

### What is the purpose of XML comments and how are they represented?

**Definition:**

A comment is a note for people reading the source. The parser does not treat it as data, and a normal application never sees it as an element or as text content.

**How it works:**

- The syntax is `<!-- words -->`. It may appear where miscellaneous markup is allowed: in the prolog, after the root, and between elements.
- It must not contain `--`. That sequence is how the comment grammar works, so a double hyphen ends it early or makes the document not well-formed.
- Comments are not a place for secrets. They are still in the file you ship, and some pipelines keep them.
- Do not wrap real data in a comment and expect a consumer to read it. Data belongs in elements.
- A comment cannot appear inside a tag, and it does not change validation of the elements around it except by being skipped.

**Examples:**

```xml
<qty>2</qty> <!-- warehouse count, not the order qty -->
```

The application’s text for `qty` is `2`. The note is for the person editing the file.
</details>

<details>
<summary>Describe the concept of XML processing instructions.</summary>

### Describe the concept of XML processing instructions.

**Definition:**

A processing instruction is a note addressed to a particular program, not to the XML data model of elements and text. The parser passes the target name and the rest of the text through.

**How it works:**

- The form is `<?target instructions?>`. The target is a name. What follows is up to that program and is not attributes in the XML sense, even when it looks like `key="value"`.
- `xml-stylesheet` is the common one: `<?xml-stylesheet type="text/xsl" href="style.xsl"?>` tells a browser or processor which transform to apply.
- The XML declaration `<?xml ...?>` looks similar but is the prolog, not an application instruction. Do not invent a target named `xml`.
- Targets are case-sensitive. Unknown targets are ignored by programs that are not the audience.
- They are not a substitute for elements. Data you need to query belongs in the tree. A processing instruction is a side channel for a tool.
- CDATA, character references, and the declaration solve different problems (raw text, a character, encoding). They are not processing instructions.

**Examples:**

```xml
<?xml-stylesheet type="text/xsl" href="order.xsl"?>
<order id="17"/>
```

A browser that honors the instruction applies `order.xsl`. A program that only reads `order` can ignore the instruction and still see the element.
</details>

<details>
<summary>What is the difference between an empty element and a self-closing element in XML?</summary>

### What is the difference between an empty element and a self-closing element in XML?

**Definition:**

In XML they are two ways to write the same thing: an element with no content. `<flag></flag>` and `<flag/>` produce the same element in the data model.

**How it works:**

- The empty-element tag `<flag/>` is syntax. The paired form `<flag></flag>` is also empty when nothing sits between the tags.
- Both may carry attributes: `<flag on="true"/>` and `<flag on="true"></flag>` match.
- Neither form can contain children. If there is text or a child, you must use a start tag and an end tag. A self-closing tag cannot “also” hold content.
- Parsers are allowed to report either spelling. Do not branch your code on which form was in the file. Branch on whether the element has children.
- HTML is different. Some HTML elements are void (`br`, `img`) and HTML5 does not use XML’s rules. XHTML, being XML, treats `<br/>` and `<br></br>` as the same empty element.
- Android layout XML follows the XML rule: the self-closing form and the paired empty form are equivalent.

**Examples:**

```xml
<img src="a.png"/>
<img src="a.png"></img>
```

An XML parser builds one element named `img` with one attribute either way. `<img src="a.png">caption</img>` is a third case: it is not empty, so the self-closing form cannot express it.
</details>

<details>
<summary>Explain the concept of XML CDATA sections and their usage.</summary>

### Explain the concept of XML CDATA sections and their usage.

**Definition:**

</details>

<details>
<summary>What is the purpose of the XML prolog and what does it contain?</summary>

### What is the purpose of the XML prolog and what does it contain?

**Definition:**

</details>

<details>
<summary>Describe the concept of XML character references and their usage.</summary>

### Describe the concept of XML character references and their usage.

**Definition:**

</details>

<details>
<summary>What is the difference between an XML document and an XML fragment?</summary>

### What is the difference between an XML document and an XML fragment?

**Definition:**

</details>

<details>
<summary>Explain the concept of XML whitespace handling.</summary>

### Explain the concept of XML whitespace handling.

**Definition:**

</details>

### XML Validation and Schemas

<details>
<summary>What is XML Schema and its purpose?</summary>

### What is XML Schema and its purpose?

**Definition:**

</details>

<details>
<summary>Explain the difference between XML DTD and XML Schema.</summary>

### Explain the difference between XML DTD and XML Schema.

**Definition:**

</details>

<details>
<summary>What are the key components of an XML Schema document?</summary>

### What are the key components of an XML Schema document?

**Definition:**

</details>

<details>
<summary>Describe the concept of XML Schema data types.</summary>

### Describe the concept of XML Schema data types.

**Definition:**

</details>

<details>
<summary>What is the purpose of XML Schema elements and attributes?</summary>

### What is the purpose of XML Schema elements and attributes?

**Definition:**

</details>

<details>
<summary>Explain the concept of XML Schema complex types and their usage.</summary>

### Explain the concept of XML Schema complex types and their usage.

**Definition:**

</details>

<details>
<summary>What is the difference between XML Schema simple types and complex types?</summary>

### What is the difference between XML Schema simple types and complex types?

**Definition:**

</details>

<details>
<summary>Describe the concept of XML Schema facets and their usage.</summary>

### Describe the concept of XML Schema facets and their usage.

**Definition:**

</details>

<details>
<summary>What is the purpose of XML Schema namespace declarations?</summary>

### What is the purpose of XML Schema namespace declarations?

**Definition:**

</details>

<details>
<summary>Explain the concept of XML Schema substitution groups.</summary>

### Explain the concept of XML Schema substitution groups.

**Definition:**

</details>

### XML Parsing and Processing

<details>
<summary>What is XML parsing and why is it important?</summary>

### What is XML parsing and why is it important?

**Definition:**

</details>

<details>
<summary>Explain the difference between DOM and SAX parsing.</summary>

### Explain the difference between DOM and SAX parsing.

**Definition:**

</details>

<details>
<summary>What are the advantages and disadvantages of using DOM parsing?</summary>

### What are the advantages and disadvantages of using DOM parsing?

**Definition:**

</details>

<details>
<summary>Describe the concept of XML XPath and its usage.</summary>

### Describe the concept of XML XPath and its usage.

**Definition:**

</details>

<details>
<summary>What is the purpose of XML XSLT and how does it work?</summary>

### What is the purpose of XML XSLT and how does it work?

**Definition:**

</details>

<details>
<summary>Explain the concept of XML DOM traversal and manipulation.</summary>

### Explain the concept of XML DOM traversal and manipulation.

**Definition:**

</details>

<details>
<summary>What is the difference between XML pull parsing and push parsing?</summary>

### What is the difference between XML pull parsing and push parsing?

**Definition:**

</details>

<details>
<summary>Describe the concept of XML streaming and its benefits.</summary>

### Describe the concept of XML streaming and its benefits.

**Definition:**

</details>

<details>
<summary>What is the purpose of XML SAX events and how are they handled?</summary>

### What is the purpose of XML SAX events and how are they handled?

**Definition:**

</details>

<details>
<summary>Explain the concept of XML StAX (Streaming API for XML) and its usage.</summary>

### Explain the concept of XML StAX (Streaming API for XML) and its usage.

**Definition:**

</details>

### XML Technologies and APIs

<details>
<summary>What is XML DOM (Document Object Model) and its purpose?</summary>

### What is XML DOM (Document Object Model) and its purpose?

**Definition:**

</details>

<details>
<summary>Explain the concept of XML SAX (Simple API for XML) and its usage.</summary>

### Explain the concept of XML SAX (Simple API for XML) and its usage.

**Definition:**

</details>

<details>
<summary>What is XML JAXP (Java API for XML Processing) and its key components?</summary>

### What is XML JAXP (Java API for XML Processing) and its key components?

**Definition:**

</details>

<details>
<summary>Describe the concept of XML JAXB (Java Architecture for XML Binding) and its benefits.</summary>

### Describe the concept of XML JAXB (Java Architecture for XML Binding) and its benefits.

**Definition:**

</details>

<details>
<summary>What is the purpose of XML XQuery and how does it differ from XPath?</summary>

### What is the purpose of XML XQuery and how does it differ from XPath?

**Definition:**

</details>

<details>
<summary>Explain the concept of XML Namespaces and their usage in XML technologies.</summary>

### Explain the concept of XML Namespaces and their usage in XML technologies.

**Definition:**

</details>

<details>
<summary>What is XML Signature and its role in XML security?</summary>

### What is XML Signature and its role in XML security?

**Definition:**

</details>

<details>
<summary>Describe the concept of XML Encryption and its purpose.</summary>

### Describe the concept of XML Encryption and its purpose.

**Definition:**

</details>

<details>
<summary>What is the purpose of XML Canonicalization and its usage?</summary>

### What is the purpose of XML Canonicalization and its usage?

**Definition:**

</details>

<details>
<summary>Explain the concept of XML Catalogs and their benefits.</summary>

### Explain the concept of XML Catalogs and their benefits.

**Definition:**

</details>

### XML Best Practices and Design Patterns

<details>
<summary>What are some best practices for designing XML schemas?</summary>

### What are some best practices for designing XML schemas?

**Definition:**

</details>

<details>
<summary>Explain the concept of XML modularity and its benefits.</summary>

### Explain the concept of XML modularity and its benefits.

**Definition:**

</details>

<details>
<summary>What is the purpose of XML versioning and how is it achieved?</summary>

### What is the purpose of XML versioning and how is it achieved?

**Definition:**

</details>

<details>
<summary>Describe the concept of XML internationalization and localization.</summary>

### Describe the concept of XML internationalization and localization.

**Definition:**

</details>

<details>
<summary>What are some common XML design patterns and their usage?</summary>

### What are some common XML design patterns and their usage?

**Definition:**

</details>

<details>
<summary>Explain the concept of XML data binding and its advantages.</summary>

### Explain the concept of XML data binding and its advantages.

**Definition:**

</details>

<details>
<summary>What is the purpose of XML data validation and how is it performed?</summary>

### What is the purpose of XML data validation and how is it performed?

**Definition:**

</details>

<details>
<summary>Describe the concept of XML data transformation and its techniques.</summary>

### Describe the concept of XML data transformation and its techniques.

**Definition:**

</details>

<details>
<summary>What are some best practices for XML performance optimization?</summary>

### What are some best practices for XML performance optimization?

**Definition:**

</details>

<details>
<summary>Explain the concept of XML security and its key considerations.</summary>

### Explain the concept of XML security and its key considerations.

**Definition:**

</details>

### Advanced XML Topics

<details>
<summary>What is XML Signature and how does it ensure data integrity?</summary>

### What is XML Signature and how does it ensure data integrity?

**Definition:**

</details>

<details>
<summary>Explain the concept of XML Encryption and its role in data confidentiality.</summary>

### Explain the concept of XML Encryption and its role in data confidentiality.

**Definition:**

</details>

<details>
<summary>What is the purpose of XML Digital Signatures and how are they created?</summary>

### What is the purpose of XML Digital Signatures and how are they created?

**Definition:**

</details>

<details>
<summary>Describe the concept of XML Key Management and its importance.</summary>

### Describe the concept of XML Key Management and its importance.

**Definition:**

</details>

<details>
<summary>What is the role of XML in web services and service-oriented architectures (SOA)?</summary>

### What is the role of XML in web services and service-oriented architectures (SOA)?

**Definition:**

</details>

<details>
<summary>Explain the concept of XML-based protocols such as SOAP and REST.</summary>

### Explain the concept of XML-based protocols such as SOAP and REST.

**Definition:**

</details>
