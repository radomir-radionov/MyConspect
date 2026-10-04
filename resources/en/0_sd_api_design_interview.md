# API Design — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [API Design — Interview](./0_sd_api_design_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — API Design](https://devinterview.io/questions/software-architecture-and-system-design/api-design-interview-questions/).

### API Design Fundamentals

<details>
<summary>What is an API and what are its main purposes?</summary>

### What is an API and what are its main purposes?

**Definition:**

An API is a contract another program calls: named operations, the inputs they accept, and the outputs they return. It exists so callers do not depend on your private code.

**How it works:**

- It hides the implementation. The caller sees a method, an HTTP resource, or a library function, not your tables.
- It is the boundary where you can change storage or a vendor without rewriting every client.
- It is also the boundary where you enforce authentication, validation, and limits, because every caller comes through it.
- A library API is in-process. A web API is on the network. Both are contracts. Only the second is a wire protocol.

**Examples:**

`POST /invoices` with a JSON body is a web API. `Invoice.create(customer, lines)` in a shared package is a library API. Callers of either should survive a change to the SQL behind them.

</details>

<details>
<summary>Can you explain the difference between an API and a Web service?</summary>

### Can you explain the difference between an API and a Web service?

**Definition:**

A web service is a network API with a documented wire format. “API” is the broader word: it also covers libraries and in-process interfaces that never leave the machine.

**How it works:**

- A library API can expose behavior directly (`charge(card)`). A web service exposes data and actions as requests and responses, historically XML with SOAP and WSDL, commonly JSON over HTTP today.
- REST APIs are tied to HTTP. SOAP services often ride on HTTP or SMTP and describe themselves with WSDL. A web service is not required to be either.
- SOAP’s contract is formal and heavier to call. An HTTP API with JSON is usually easier for a browser or a small client and does not by itself carry WS-Security.
- Both have addresses, operations, and request/response pairs. A REST API spreads operations across resources and methods. A SOAP service often posts every operation to one URL and puts the action in the body.

**Examples:**

```text
REST:  POST /invoices     { "customer": "acme" }
SOAP:  POST /service      <CreateInvoice><customer>acme</customer></CreateInvoice>
```

</details>

<details>
<summary>What are the principles of a RESTful API?</summary>

### What are the principles of a RESTful API?

**Definition:**

A RESTful API applies the REST constraints to HTTP resources so clients manipulate representations, not a private set of remote procedures.

**How it works:**

- Client and server are separate. The client does not need the server’s database, and the server does not render the client’s screen.
- Each request carries what the server needs. The server does not keep a conversational session in order to understand the next call.
- Responses say whether they may be cached and for how long.
- The client cannot tell whether a gateway or a proxy sat in the middle. That is the layered system.
- The uniform interface is the part people mean in practice: resources named by URLs, manipulation through HTTP methods, representations such as JSON, and messages that describe themselves.
- Code on demand — sending the client executable code — is optional and rare.
- “REST” is the set of constraints. “RESTful” is the claim that a particular HTTP API follows them. Many JSON APIs use the resource style and skip hypermedia.

**Examples:**

```text
GET /weather/paris
Cache-Control: max-age=60
→ { "tempC": 18 }
```

The client does not call `getWeather(city)`. It fetches a resource, and it may reuse the response for 60 seconds.

</details>

<details>
<summary>How does a SOAP API differ from a REST API?</summary>

### How does a SOAP API differ from a REST API?

**Definition:**

SOAP is an XML protocol with a formal contract. REST is an architectural style, usually carried over HTTP with JSON and no required schema language.

**How it works:**

- SOAP was specified at the W3C. The body is XML, the contract is WSDL, and the transport is often HTTP or SMTP. The focus is a named operation, with standards for security and transactions when you adopt the WS-* stack. A call can be stateful. Faults are XML elements, not only HTTP statuses.
- REST has no standards body and no required document. It constrains how resources are named and manipulated. HTTP is the usual protocol, JSON is the usual representation, and status codes carry the outcome. The server does not keep a session to interpret the next request. Coupling stays in the resource shape, which clients find easier until the shape changes without notice.
- Choose SOAP when an existing contract, a strict schema, or an enterprise bus already speaks it. Choose a REST-style HTTP API when clients are browsers, mobile apps, or other services that want a URL per resource.

**Examples:**

```text
SOAP: POST /soap  <GetInvoice><id>42</id></GetInvoice>
REST: GET /invoices/42
```

</details>

<details>
<summary>What is an API endpoint?</summary>

### What is an API endpoint?

**Definition:**

An API endpoint is the address plus the method a client calls to perform one operation on a resource.

**How it works:**

- The URL identifies the resource (`/invoices/42`). The HTTP method says what to do. Headers carry authentication and the content type. The body, when there is one, is the representation you are sending.
- The response has its own status, headers, and body.
- A resource-oriented URL uses nouns and lets the method carry the action: `GET /invoices/42`, `POST /invoices`.
- An RPC-style URL puts the verb in the path and often accepts only POST: `POST /submitInvoice`. It works, and it is harder to cache, to authorize per resource, and to guess.

**Examples:**

```text
GET    /invoices/42     read one invoice
POST   /invoices        create one
PUT    /invoices/42     replace it
PATCH  /invoices/42     change the due date
DELETE /invoices/42     remove it
```

</details>

<details>
<summary>What are the common methods (HTTP verbs) used in a REST API, and what does each method do?</summary>

### What are the common methods (HTTP verbs) used in a REST API, and what does each method do?

**Definition:**

HTTP methods tell a REST API what to do with a resource. Clients and caches rely on the method’s meaning, so do not invent a new verb when an existing one fits.

**How it works:**

- `GET` reads a resource or a collection and must not change server state. `HEAD` is the same without a body.
- `POST` creates a subordinate resource or starts an action that is not idempotent. Repeating it can create a second invoice.
- `PUT` replaces the resource at the URL. Repeating the same representation leaves the same result.
- `PATCH` applies a partial change. It is not automatically idempotent. Make it so when clients will retry.
- `DELETE` removes the resource. Deleting it again still ends with “it is gone.”
- `OPTIONS` reports which methods the URL allows, which browsers use for CORS. `TRACE` echoes the request and is usually disabled. `CONNECT` opens a tunnel through a proxy.
- A private verb is a last resort. Intermediaries and client libraries already understand the standard set.

**Examples:**

```text
POST /invoices          create, not safe to retry blindly
PUT  /invoices/42       replace, safe to retry
GET  /invoices/42       read, caches may store it
```

</details>

<details>
<summary>How do you version an API?</summary>

### How do you version an API?

**Definition:**

Version an API when a change would break existing clients. Prefer an additive change that old clients can ignore, and give a breaking change its own version they can adopt on purpose.

**How it works:**

- Path versioning (`/v1/invoices`, `/v2/invoices`) is obvious in logs and caches. It tempts you to fork the whole API.
- A query parameter (`?version=1`) is easy to miss and awkward to cache as a different resource.
- A custom header, or an `Accept` value such as `application/vnd.example.invoice.v2+json`, keeps the URL stable and makes the version part of content negotiation. Clients forget the header.
- Number breaking changes. Semantic versioning (major.minor.patch) maps well: a new field can be a minor change if old clients skip unknown fields, and a removed field is a major change.
- Document the sunset date, keep the old version running until callers move, and do not change the meaning of an existing field inside a version.

**Examples:**

```text
GET /v1/invoices/42     { "total": 120 }
GET /v2/invoices/42     { "total": 120, "currency": "EUR" }
```

v1 stays until the last client that cannot read `currency` is gone.

</details>

<details>
<summary>What is idempotence in the context of API design, and why is it important?</summary>

### What is idempotence in the context of API design, and why is it important?

**Definition:**

An idempotent operation can be repeated without changing the outcome beyond the first successful application. Clients retry after timeouts, so this is what makes a retry safe.

**How it works:**

- A lost response is indistinguishable from a lost request. Without idempotence, the retry creates a second charge or a second invoice.
- In HTTP, `GET`, `HEAD`, `OPTIONS`, `PUT`, and `DELETE` are defined to be idempotent. `POST` is not. `PATCH` is idempotent only if you design the patch that way.
- Safe methods (`GET`, `HEAD`) are also free of side effects. Idempotent is weaker: `PUT` and `DELETE` change state, and doing so twice is the same as doing so once.
- For operations that are naturally “create once,” accept an idempotency key. Store the key with the result and return the original result when the key is seen again. A timestamp or a nonce only helps if the server remembers it.
- The key has to be stored before you perform the side effect, or two concurrent retries both pass the check.

**Examples:**

```text
POST /payments
Idempotency-Key: 6f1c-a9

first call  → 201 and a payment id
same key    → 201 and the same payment id, no second charge
```

</details>

<details>
<summary>Can you explain what API rate limiting is and give an example of why it might be used?</summary>

### Can you explain what API rate limiting is and give an example of why it might be used?

**Definition:**

Rate limiting caps how many requests a client may make in a window, so one caller cannot consume the service or deny it to everyone else.

**How it works:**

- A burst of traffic, a retry storm, or a script in a loop will take the process down if every request is served.
- The cap is also a fairness rule and a way to enforce the plan the client paid for.
- Count by API key, user, or IP. Decide the limit and the window (100 requests per minute). When the cap is hit, respond with `429 Too Many Requests` and a `Retry-After` header so a well-behaved client backs off.
- Put the limiter at the edge, before the expensive work. A limit only in the database still lets the request consume a connection.

**Examples:**

```text
GET /invoices
→ 429 Too Many Requests
Retry-After: 30
X-RateLimit-Remaining: 0
```

A polling client waits 30 seconds instead of looping.

</details>

<details>
<summary>Describe the concept of OAuth in relation to API security.</summary>

### Describe the concept of OAuth in relation to API security.

**Definition:**

OAuth is an authorization framework: a user lets one application touch their data on another service without giving that application their password.

**How it works:**

- The resource owner is the user. The client is the application asking for access. The authorization server authenticates the user and issues a token. The resource server holds the data and accepts that token.
- The user approves a scope (read invoices, not send payments). The authorization server gives the client an access token, often by an authorization code that the client exchanges in a back channel. The client sends the token to the resource server.
- The password stays with the user and the authorization server. The token is limited in scope and time, and it can be revoked.
- OAuth is not a login protocol by itself. OpenID Connect adds identity on top of it. Using an access token as proof of who someone is, without that layer, is a common mistake.

**Examples:**

```text
user approves "read invoices" for the accounting app
app receives an access token
GET /invoices  Authorization: Bearer <token>
```

The accounting app never sees the user’s password.

</details>

### API Design Best Practices

<details>
<summary>What strategies would you use to ensure the backward compatibility of an API?</summary>

### What strategies would you use to ensure the backward compatibility of an API?

**Definition:**

Backward compatibility means a client written against today’s contract still works after you ship the next change.

**How it works:**

- Do not remove or rename a field, a URL, or a method that clients use. Add fields instead. Old clients ignore what they do not know. New clients read it.
- Do not change the meaning of an existing field, the requiredness of an old one, or the status code a case already returns. A new error code is safe. A reused code with a new meaning is not.
- Accept the old request shape and the new one during a transition. If a multi-step flow must stay compatible, keep each step idempotent so a retry from an old client does not double-apply.
- When you must break the contract, publish a new version and run both until usage of the old one drops. Document the date.

**Examples:**

```json
{ "total": 120, "currency": "EUR" }
```

A client that only reads `total` keeps working. A client that required `total` to be a string breaks the day you send a number. That second change is not compatible.

</details>

<details>
<summary>What are some common response codes that an API might return, and what do they signify?</summary>

### What are some common response codes that an API might return, and what do they signify?

**Definition:**

HTTP status codes are the first thing a client branches on. The class tells you whether to retry, to fix the request, or to follow a redirect. The specific code tells you which.

**How it works:**

- 1xx means the server is still working. `100 Continue` lets a client send a large body only after the server agrees.
- 2xx means the request succeeded. `200` is a generic success, `201` created a resource, `202` accepted work that is not finished, `204` succeeded with no body, `206` is a partial body.
- 3xx means look elsewhere. `301` and `308` are permanent, `302` and `307` are temporary, `304` means the cached copy is still fresh.
- 4xx means the client should change the request. `400` is malformed, `401` needs authentication, `403` is authenticated but not allowed, `404` is missing, `405` is the wrong method, `409` conflicts with current state, `410` is gone on purpose, `429` is rate limited.
- 5xx means the server failed and the client may retry if the method is safe or idempotent. `500` is unhandled, `502` and `504` point at a gateway or a timeout, `503` means temporarily unavailable.

**Examples:**

```text
POST /invoices        → 201 Created, Location: /invoices/42
GET  /invoices/42     → 200
DELETE /invoices/42   → 204
GET  /invoices/42     → 404
```

</details>

<details>
<summary>How can you design an API to be easily consumable by clients?</summary>

### How can you design an API to be easily consumable by clients?

**Definition:**

A consumable API is one a caller can use correctly from the URL, the method, and one example, without reading your database schema.

**How it works:**

- Use the HTTP method for the action and a noun for the resource. Prefer `/invoices/42` over `/getInvoice?id=42`.
- Use plural collections (`/invoices`) and a single id for one item (`/invoices/42`). Keep that pattern on every resource.
- Return the same error shape everywhere, with a stable code and a message a human can read.
- Paginate, filter, and sort large collections in the query string so a client is not forced to download the table.
- Version breaking changes, and do not overload one POST with a free-form `action` field when a resource or a method would say the same thing.
- Names should be predictable: `dueDate`, not `dd`, and the same word on the way in and the way out.

**Examples:**

```text
GET /invoices?status=open&limit=20
→ 200
{ "data": [ { "id": "42", "total": 120 } ], "next": "/invoices?status=open&cursor=42" }
```

</details>

<details>
<summary>When designing an API, how would you document it for end-users?</summary>

### When designing an API, how would you document it for end-users?

**Definition:**

Document an API as a contract a caller can try: the URL, the method, the fields, the errors, and a worked example. Prose that says “see the code” is not that contract.

**How it works:**

- An OpenAPI document (the format people still call Swagger) describes resources, parameters, and schemas in YAML or JSON. Tools turn it into a page where you can send a request. Swagger was the earlier name of that specification.
- API Blueprint and RAML are other description formats. They solve the same problem: one machine-readable contract.
- Generated references from source comments (Javadoc, doc comments) help for a library. For an HTTP API they go stale unless the comment is generated from the contract, not the other way around.
- Postman collections are useful as examples and as tests. They are a poor sole specification because they drift from the server.
- Publish authentication, pagination, and every error code. Keep a changelog next to the version.

**Examples:**

```yaml
paths:
  /invoices/{id}:
    get:
      parameters:
        - name: id
          in: path
          required: true
      responses:
        "200":
          description: The invoice
        "404":
          description: No such invoice
```

</details>

<details>
<summary>What considerations might influence how you paginate API responses?</summary>

### What considerations might influence how you paginate API responses?

**Definition:**

Pagination is how a collection endpoint returns a bounded page instead of the whole table. The scheme you pick has to stay correct when rows are inserted or deleted during the walk.

**How it works:**

- Offset and limit (`?offset=40&limit=20`) are easy. They get slow as the offset grows, and a row inserted on page one shifts every later page, so the client skips or repeats items.
- Keyset pagination remembers the last key you returned and asks for rows after it (`where id > 42 order by id limit 20`). It stays fast and does not drift if the key is unique and ordered. It cannot jump to page 50.
- A timestamp works the same way when the time is monotonic and unique. Ties need a second key.
- A cursor is an opaque token for that position. The client treats it as a bookmark, which lets you change the key underneath. It is the better client contract.
- Also decide the default page size, the maximum, the sort you promise, and whether the URL is cacheable. Tell the client there is a next page with a link, not by making them guess.

**Examples:**

```text
GET /invoices?limit=20
→ { "data": [ ... ], "next": "/invoices?limit=20&cursor=eyJpZCI6IjQyIn0" }

GET /invoices?limit=20&cursor=eyJpZCI6IjQyIn0
→ the following page, stable if a new invoice arrives at the top
```

</details>

<details>
<summary>What is HATEOAS, and how does it relate to API design?</summary>

### What is HATEOAS, and how does it relate to API design?

**Definition:**

</details>

<details>
<summary>How would you handle localization and internationalization in APIs?</summary>

### How would you handle localization and internationalization in APIs?

**Definition:**

</details>

<details>
<summary>What are some best practices for designing error responses in an API?</summary>

### What are some best practices for designing error responses in an API?

**Definition:**

</details>

<details>
<summary>What are the benefits of using API Gateways?</summary>

### What are the benefits of using API Gateways?

**Definition:**

</details>

<details>
<summary>How would you approach handling file uploads in an API design?</summary>

### How would you approach handling file uploads in an API design?

**Definition:**

</details>

### API Performance and Scalability

<details>
<summary>How can caching be incorporated into API design to improve performance?</summary>

### How can caching be incorporated into API design to improve performance?

**Definition:**

</details>

<details>
<summary>What are some strategies for dealing with high traffic volumes in a scalable API?</summary>

### What are some strategies for dealing with high traffic volumes in a scalable API?

**Definition:**

</details>

<details>
<summary>How does connection pooling work and how can it benefit API performance?</summary>

### How does connection pooling work and how can it benefit API performance?

**Definition:**

</details>

<details>
<summary>When is it appropriate to use synchronous vs asynchronous processing in an API?</summary>

### When is it appropriate to use synchronous vs asynchronous processing in an API?

**Definition:**

</details>

<details>
<summary>What are some challenges of maintaining an API at scale?</summary>

### What are some challenges of maintaining an API at scale?

**Definition:**

</details>

### API Security Considerations

<details>
<summary>What are common security concerns when designing an API?</summary>

### What are common security concerns when designing an API?

**Definition:**

</details>

<details>
<summary>How do you prevent injection attacks in API design?</summary>

### How do you prevent injection attacks in API design?

**Definition:**

</details>

<details>
<summary>Can you explain what CORS is and why it’s important in API design?</summary>

### Can you explain what CORS is and why it’s important in API design?

**Definition:**

</details>

<details>
<summary>What is the purpose of an API key?</summary>

### What is the purpose of an API key?

**Definition:**

</details>

<details>
<summary>How would you implement authentication and authorization in APIs?</summary>

### How would you implement authentication and authorization in APIs?

**Definition:**

</details>

### Advanced API Design Concepts

<details>
<summary>What is the role of an API Gateway in microservices architecture?</summary>

### What is the role of an API Gateway in microservices architecture?

**Definition:**

</details>

<details>
<summary>Can you explain the concept of a headless API?</summary>

### Can you explain the concept of a headless API?

**Definition:**

</details>

<details>
<summary>How do GraphQL APIs differ from traditional RESTful APIs?</summary>

### How do GraphQL APIs differ from traditional RESTful APIs?

**Definition:**

</details>

<details>
<summary>What is gRPC and how might it be used in API design?</summary>

### What is gRPC and how might it be used in API design?

**Definition:**

</details>

<details>
<summary>How can WebSockets enhance API functionalities?</summary>

### How can WebSockets enhance API functionalities?

**Definition:**

</details>

### API Development and Testing

<details>
<summary>What tools or frameworks do you use to develop and test APIs?</summary>

### What tools or frameworks do you use to develop and test APIs?

**Definition:**

</details>

<details>
<summary>How would you test for API performance and what metrics would you track?</summary>

### How would you test for API performance and what metrics would you track?

**Definition:**

</details>

<details>
<summary>What is contract testing in the context of API development?</summary>

### What is contract testing in the context of API development?

**Definition:**

</details>

<details>
<summary>Describe the mocking of APIs for development and testing purposes.</summary>

### Describe the mocking of APIs for development and testing purposes.

**Definition:**

</details>

<details>
<summary>How can automated API testing improve the software development lifecycle?</summary>

### How can automated API testing improve the software development lifecycle?

**Definition:**

</details>

### API Data Management

<details>
<summary>How do you handle large volumes of data in API responses?</summary>

### How do you handle large volumes of data in API responses?

**Definition:**

</details>

<details>
<summary>How can an API be designed to support multiple data formats?</summary>

### How can an API be designed to support multiple data formats?

**Definition:**

</details>

<details>
<summary>What are best practices for managing sensitive data through an API?</summary>

### What are best practices for managing sensitive data through an API?

**Definition:**

</details>

<details>
<summary>In an API, how do you approach filtering and sorting of data?</summary>

### In an API, how do you approach filtering and sorting of data?

**Definition:**

</details>

<details>
<summary>Can you discuss strategies for transaction management within API endpoints?</summary>

### Can you discuss strategies for transaction management within API endpoints?

**Definition:**

</details>

### API Specification and Standards

<details>
<summary>Are you familiar with any API specification formats and what benefits do they provide?</summary>

### Are you familiar with any API specification formats and what benefits do they provide?

**Definition:**

</details>

<details>
<summary>How do you approach the design of an API to comply with industry standards?</summary>

### How do you approach the design of an API to comply with industry standards?

**Definition:**

</details>

<details>
<summary>How do you foresee OpenAPI/Swagger specifications evolving, and how do they impact API design?</summary>

### How do you foresee OpenAPI/Swagger specifications evolving, and how do they impact API design?

**Definition:**

</details>

<details>
<summary>How can APIs be designed with interoperability in mind?</summary>

### How can APIs be designed with interoperability in mind?

**Definition:**

</details>

<details>
<summary>How does a standard like JSON:API influence the way you structure response payloads?</summary>

### How does a standard like JSON:API influence the way you structure response payloads?

**Definition:**

</details>
