# SOA — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [SOA — Interview](./0_sd_soa_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — SOA](https://devinterview.io/questions/software-architecture-and-system-design/service-oriented-architecture-interview-questions/).

### SOA Fundamentals

<details>
<summary>What are the core principles of Service-Oriented Architecture (SOA)?</summary>

### What are the core principles of Service-Oriented Architecture (SOA)?

**Definition:**

SOA splits a system into services that each own a business capability and publish a contract other systems can call.

**How it works:**

- Loose coupling: callers use an API or a queue, not the provider’s code, tables, or host name.
- Contract-driven: each service publishes operations and a schema so both sides know the messages.
- Platform neutrality: a service may use any stack as long as the messages stay interoperable.
- Granularity: a service does one coherent job. A middleware layer can compose several services into a larger flow.
- Reusability: the same capability, such as billing, is called by many applications instead of being copied.
- Autonomy: a team can change and deploy its service on its own schedule.
- Discovery and composition: consumers find services and assemble them for a process.
- Scale and isolation: load can be spread, and a slow service does not have to stall every other capability.
- Persistence: a service may keep its own durable state rather than borrowing the caller’s database.
- Compared with a monolith, SOA draws boundaries on business capabilities and talks over the network. Microservices push the same idea toward smaller deployable units that each own their data.

**Examples:**

An order screen calls a shared Customer service and a shared Pricing service. Replacing the pricing engine does not require a new checkout binary, as long as the price message stays the same.
</details>

<details>
<summary>Can you describe the difference between SOA and a microservices architecture?</summary>

### Can you describe the difference between SOA and a microservices architecture?

**Definition:**

Both styles split work into services with contracts. They differ in size, data ownership, how they integrate, and how strictly the enterprise governs them.

**How it works:**

- SOA services are usually coarser and may cover several related capabilities. A microservice is typically one capability, small enough for one team.
- Classic SOA often integrates with synchronous calls and an enterprise bus. Microservices mix HTTP with queues and try to avoid a shared bus as the place where business logic lives.
- SOA frequently shares canonical data models through contracts. Microservices prefer a private database per service and accept duplication at the edges.
- SOA tends to standardize the stack and central governance. Microservice teams pick their own language and release on their own pipeline.
- SOA deployments are independent but often coordinated. A microservice can ship without redeploying its neighbors.
- Shared problems remain: finding a healthy instance, partial failure, and data that is no longer in one transaction.
- Principles that carry over: loose coupling, a published contract, and autonomy. What gets stricter is “you own your data” and “you deploy alone.”

**Examples:**

A SOA “Order” service might reserve stock, charge a card, and notify shipping behind one contract. A microservice split would make Inventory, Payments, and Shipping separate deployables, each with its own store, and compose them with events.
</details>

<details>
<summary>Explain the concept of a service contract in SOA.</summary>

### Explain the concept of a service contract in SOA.

**Definition:**

A service contract is the promise a consumer may rely on: operations, message shapes, protocol, faults, and policies. Internals on either side may change while that promise holds.

**How it works:**

- It names the operations, the schema of each message, and which faults can come back.
- Policies ride along: authentication, encryption, idempotency, and sometimes a service level.
- Provider and consumer can be written in different languages because they share the contract, not the code.
- Styles include a WSDL document, an OpenAPI description, or an explicit schema such as JSON Schema or protobuf.
- Versioning is part of the contract. A breaking change is a new contract, not a silent edit.
- The split is what makes independent releases possible: callers bind to the contract, not to a class inside the provider.

**Examples:**

```text
POST /reservations
body: { "sku": "A1", "qty": 2 }
201: { "id": "r-9" }
409: { "error": "out_of_stock" }
```

The inventory team can replace its database as long as this request, this success body, and this conflict error stay valid.
</details>

<details>
<summary>How does SOA facilitate service reusability?</summary>

### How does SOA facilitate service reusability?

**Definition:**

SOA aims at one implementation of a business function, behind a stable contract, so many applications call it instead of copying the logic.

**How it works:**

- Modularity keeps the function in one service with a single purpose.
- A shared contract and a standard message format mean a new channel does not need a private variant.
- Loose coupling lets the provider move or be rewritten without each caller changing.
- Platform-neutral messages let a web shop, a branch app, and a batch job all call the same billing service.
- A registry makes that service findable, so teams do not invent a second one because they cannot see the first.
- Reuse fails when each team still ships a private copy with a slightly different schema.

**Examples:**

Checkout, a call center tool, and a partner API all call `Customer.lookup`. A new field is added to that contract once, not pasted into three codebases.
</details>

<details>
<summary>What is loose coupling in SOA and why is it important?</summary>

### What is loose coupling in SOA and why is it important?

**Definition:**

Loose coupling means a caller depends on another service’s contract, not on its code, database, or address. You can move or replace the provider without redeploying every caller.

**How it works:**

- Interaction goes through messages or an API. A shared table or an in-process call is the opposite.
- Location transparency: the caller looks up an endpoint instead of baking in a host.
- The provider can scale, fail over, or change its stack while the contract holds.
- That buys resilience (one outage need not take down every caller if they can retry or queue) and lets teams ship on separate schedules.
- The hard parts are discovery and versioning, keeping data consistent across a boundary, and agreeing on transport and message format.
- Techniques that keep the coupling low: a published contract, messaging, stateless operations, idempotent retries, and hiding the provider’s data model.

**Examples:**

Checkout calls `POST /prices` and does not know whether pricing runs in one process or twenty. Moving pricing to another cluster changes the registry entry, not the checkout code.
</details>

<details>
<summary>What do you understand by service orchestration and service choreography in the context of SOA?</summary>

### What do you understand by service orchestration and service choreography in the context of SOA?

**Definition:**

Orchestration puts one coordinator in charge of the steps. Choreography has no conductor: each service reacts to events and chooses its own next step.

**How it works:**

- An orchestrator calls inventory, payment, and shipping in order and handles errors in one place. The flow is easy to read and to change.
- That coordinator is also a place that can bottleneck or become a second monolith if too much logic lands there.
- In choreography, “seat reserved” is an event. Billing and notification each subscribe and act alone. No service tells the others what to do next.
- Choreography avoids a central runtime and keeps services independent. The overall flow is harder to see, and a missing subscriber fails quietly unless you trace events.
- Pick orchestration when the business process has a strict order and one owner. Pick choreography when peers should stay decoupled and the set of listeners will grow.

**Examples:**

Orchestration: `placeOrder` calls reserve, then charge, then ship, and compensates if charge fails. Choreography: Order emits `OrderPlaced`; Inventory and Billing each consume it and emit their own result. Nobody waits inside `placeOrder` for both.
</details>

<details>
<summary>How does SOA differ from traditional monolithic application architectures?</summary>

### How does SOA differ from traditional monolithic application architectures?

**Definition:**

A monolith ships as one process with in-process calls and usually one database. SOA splits capabilities into services that talk over the network and can be owned and scaled apart.

**How it works:**

- A monolith’s modules live in one codebase and one deployable. A change or a scale-out touches the whole application.
- SOA modules are services. They call each other with messages, not with a local function.
- Teams can own a service for its whole life and release it without rebuilding every other capability.
- The monolith gets one transaction and one schema. SOA pushes consistency across a network boundary.
- Services may use different languages. A monolith usually shares one stack.
- You pay latency, partial failure, and more operations in exchange for deploying and scaling a capability on its own.

**Examples:**

In one process, `createOrder` calls `reserveStock` as a method and both share a database transaction. After the split, checkout sends a reservation request and must handle a timeout even if the stock service later succeeds.
</details>

<details>
<summary>What role does a service registry play in SOA?</summary>

### What role does a service registry play in SOA?

**Definition:**

A service registry is the directory where providers publish a contract and an endpoint, and where consumers look them up. Lookup replaces hard-coded addresses.

**How it works:**

- A provider registers its name, version, address, and metadata. A consumer queries that entry before it calls.
- The registry can also push changes, so subscribers learn when an instance appears or goes away.
- That is what keeps location transparent: the process can move, and callers still resolve the name.
- Entries should be access-controlled, and updates should be authenticated so a stranger cannot publish a fake endpoint.
- Classic SOA used UDDI. The same job today is often Consul, a mesh control plane, or a cloud service catalog.
- The registry is not the bus. It answers “where is a compatible instance?” It does not transform the message.

**Examples:**

On startup a pricing process registers `pricing` at `10.0.4.8:8080` with version `2`. Checkout asks the registry for `pricing` version `2` and calls whatever address comes back. A second replica registers beside it. Checkout does not store either IP.
</details>

### Designing SOA-based Systems

<details>
<summary>What factors do you consider when designing a service interface in SOA?</summary>

### What factors do you consider when designing a service interface in SOA?

**Definition:**

Shape the interface around one business capability, with a small explicit schema, so callers can reuse it without learning the provider’s internals.

**How it works:**

- Granularity: wide enough to be useful, narrow enough that unrelated changes do not ride along. Group operations that belong in one business step.
- Keep inputs small and make the output the full result of that call, including a clear fault format.
- Hide tables and internal types. The contract is the encapsulation boundary.
- Design for reuse across channels, then let orchestration specialize the flow.
- Put authentication, authorization, and validation in the contract’s rules, not only in one caller.
- Prefer idempotent operations where clients will retry, and make the transactional boundary obvious.
- Separate what is stable from what changes often, so volatile details do not force a new contract every week.
- The service must be findable, measurable (latency, errors, availability), and versioned so old callers survive.
- Name the schema, cache only where staleness is acceptable, and follow the standards the organization already uses.

**Examples:**

`POST /orders` accepts a cart id and a payment token and returns an order id or a typed error. It does not accept a raw SQL fragment, and repeating the same idempotency key does not create a second order.
</details>

<details>
<summary>Explain how versioning of services is handled in a SOA environment.</summary>

### Explain how versioning of services is handled in a SOA environment.

**Definition:**

Publish a new contract version when a change would break current clients, and keep the old version until those clients move.

**How it works:**

- URL versioning puts the version in the path (`/v1/orders`, `/v2/orders`). It is obvious and easy to route. The cost is more paths to keep alive.
- Header versioning puts it in the request, for example `Accept: application/vnd.orders+json;version=2`. URLs stay stable. Caches and some clients handle a custom media type poorly.
- Semantic versions tell clients whether a change is additive (`1.1.0`) or breaking (`2.0.0`).
- Additive fields that old clients ignore can stay on the same major version. Removing or retyping a field needs a new one.
- A gateway can send each version to the right deployment so callers keep one host name.
- Retire a version only after you can see that no traffic still uses it.

**Examples:**

`GET /v1/orders/1` still returns `total`. `GET /v2/orders/1` splits that into `net` and `tax`. The gateway routes `/v1` to the old process until the last client is gone.
</details>

<details>
<summary>Describe a scenario in which you might opt for synchronous communication over asynchronous in SOA.</summary>

### Describe a scenario in which you might opt for synchronous communication over asynchronous in SOA.

**Definition:**

Use a synchronous call when the caller cannot take the next step without the result. A queue would leave that step hanging on a later event.

**How it works:**

- Checkout must know immediately whether the card was authorized, so the screen can confirm or ask for another card.
- A uniqueness check before creating an account has the same shape: the answer decides whether to commit.
- The steps have a required order, and the error has to be shown to the user in that request.
- You accept the cost: the caller now depends on the callee’s availability and latency, and a slow dependency slows the request.
- Work that can finish later (email, analytics, warehouse pick) stays on a queue.

**Examples:**

```text
POST /checkout
  -> POST /payments/authorize   # wait
  <- { "status": "approved" }
  -> create order
```

If authorize times out, checkout returns an error. It does not tell the customer the order exists and hope a message arrives later.
</details>

<details>
<summary>What are some of the common data formats used for service communication in SOA?</summary>

### What are some of the common data formats used for service communication in SOA?

**Definition:**

The contract names the bytes on the wire so every consumer parses the same structure.

**How it works:**

- SOAP services exchange XML envelopes, often with a WSDL description of operations and types.
- Resource-style HTTP APIs more often use JSON: text, easy to read, loosely typed unless you add a schema.
- Binary schemas such as Protocol Buffers or Avro show up when message size and strict evolution rules matter.
- XML still fits when the enterprise already shares XSD contracts or needs namespaces and strict validation.
- Pick one format per contract. Mixing them at one operation forces every caller to guess.

**Examples:**

A partner gateway speaks SOAP with an XSD. An internal order API speaks JSON documented by OpenAPI. A high-volume stock feed uses protobuf so the same message stays small and typed.
</details>

<details>
<summary>Provide an example of how you would refactor a monolithic application into a SOA-based architecture.</summary>

### Provide an example of how you would refactor a monolithic application into a SOA-based architecture.

**Definition:**

Cut the monolith along business capabilities, publish each contract, and move one service out at a time with its data. Leave a facade so the old process still looks the same to callers.

**How it works:**

- Find modules with their own reason to change. In a shop that is often catalog, orders, users, and payments.
- Decide which calls must return now (checkout to payments) and which can be events (email, analytics).
- Write the interface and the error cases before moving code.
- Extract the service, move the tables it owns, and point the monolith at the new endpoint through a thin adapter.
- Register the endpoint, then add authentication and metrics on that boundary.
- Repeat. Do not split every class in one release.
- You gain separate deploys and the freedom to scale payments alone. You take on network failures, and a database transaction that used to be local becomes a saga.

**Examples:**

Week one: `PaymentService` moves out. The monolith’s `charge()` becomes an HTTP call with an idempotency key. Orders and catalog stay in-process. Week two: catalog moves, and the monolith only keeps the checkout facade.
</details>

### Implementing SOA

<details>
<summary>What is an Enterprise Service Bus (ESB) and how does it support SOA?</summary>

### What is an Enterprise Service Bus (ESB) and how does it support SOA?

**Definition:**

An enterprise service bus is middleware that routes, transforms, and mediates messages so services do not each integrate with every peer.

**How it works:**

- A messaging engine moves messages. Adapters speak each system’s protocol.
- A mediation layer transforms formats, maps fields, and validates messages.
- A registry on the bus records which services exist. Routing can depend on content.
- The bus can enforce security and other policy in one place, host a queue, and run an orchestration flow.
- Services talk to the bus instead of holding every peer’s address and schema.
- The risk is the same centralization: if business decisions pile up inside the bus, it becomes a bottleneck and a single place every change must touch.

**Examples:**

A warehouse system emits a fixed-width file message. The bus turns it into the order service’s JSON, checks the schema, and delivers it. Neither system links to the other’s library.
</details>

<details>
<summary>How would you handle transaction management in a SOA system?</summary>

### How would you handle transaction management in a SOA system?

**Definition:**

Inside one service, a local database transaction can still be atomic. Across services, a distributed two-phase commit is brittle, so the usual design is a sequence of local commits plus an explicit undo.

**How it works:**

- A local transaction covers one service’s own tables. Isolation and durability stay inside that database.
- Propagating one ACID transaction across the network ties every participant’s locks together and fails badly when one of them is down.
- Compensation: each step commits locally, and a failure runs an undo such as a refund or a stock release. The undo is a normal operation, not a database rollback.
- A saga records which steps succeeded and runs the matching compensations in reverse. Orchestration can own that record, or each service can react to a failure event.
- Retries must be idempotent, and timeouts must be explicit, because the network can deliver a success after the caller gave up.
- Isolation is weaker than in one database: another caller can see stock reserved before payment finishes. The flow has to allow that intermediate state.

**Examples:**

Reserve stock (commit), then charge the card. If the charge is declined, call `releaseStock` with the same reservation id. A second release is a no-op. There is no transaction that spans the warehouse database and the card processor.
</details>

<details>
<summary>What strategies would you use to ensure high availability in a SOA deployment?</summary>

### What strategies would you use to ensure high availability in a SOA deployment?

**Definition:**

</details>

<details>
<summary>What is WS-Security and how does it relate to SOA?</summary>

### What is WS-Security and how does it relate to SOA?

**Definition:**

</details>

### SOA Standards and Protocols

<details>
<summary>What are the benefits of using standard protocols like SOAP or REST in SOA?</summary>

### What are the benefits of using standard protocols like SOAP or REST in SOA?

**Definition:**

</details>

<details>
<summary>Explain the role of WSDL in SOA.</summary>

### Explain the role of WSDL in SOA.

**Definition:**

</details>

<details>
<summary>How does UDDI facilitate service discovery in SOA?</summary>

### How does UDDI facilitate service discovery in SOA?

**Definition:**

</details>

<details>
<summary>What is the significance of OASIS in the context of SOA?</summary>

### What is the significance of OASIS in the context of SOA?

**Definition:**

</details>

### Securing SOA Applications

<details>
<summary>What are the main security concerns in a SOA environment?</summary>

### What are the main security concerns in a SOA environment?

**Definition:**

</details>

<details>
<summary>How would you approach identity management in SOA?</summary>

### How would you approach identity management in SOA?

**Definition:**

</details>

<details>
<summary>Can you explain the concept of security tokens in SOA?</summary>

### Can you explain the concept of security tokens in SOA?

**Definition:**

</details>

### SOA Testing

<details>
<summary>Describe your approach to testing services in SOA.</summary>

### Describe your approach to testing services in SOA.

**Definition:**

</details>

<details>
<summary>What are the challenges of testing in a SOA-based system compared to a monolithic one?</summary>

### What are the challenges of testing in a SOA-based system compared to a monolithic one?

**Definition:**

</details>

<details>
<summary>How would you perform load testing for an SOA service?</summary>

### How would you perform load testing for an SOA service?

**Definition:**

</details>

### Performance and Scalability

<details>
<summary>How would you monitor the performance of services in SOA?</summary>

### How would you monitor the performance of services in SOA?

**Definition:**

</details>

<details>
<summary>Describe a strategy to scale a service in a SOA system.</summary>

### Describe a strategy to scale a service in a SOA system.

**Definition:**

</details>

<details>
<summary>How do you manage service dependencies to avoid performance bottlenecks in SOA?</summary>

### How do you manage service dependencies to avoid performance bottlenecks in SOA?

**Definition:**

</details>

### SOA Governance

<details>
<summary>What does governance mean in the context of SOA?</summary>

### What does governance mean in the context of SOA?

**Definition:**

</details>

<details>
<summary>Describe a policy you might enforce as part of SOA governance.</summary>

### Describe a policy you might enforce as part of SOA governance.

**Definition:**

</details>

<details>
<summary>Can you explain the purpose of a service level agreement (SLA) in a SOA context?</summary>

### Can you explain the purpose of a service level agreement (SLA) in a SOA context?

**Definition:**

</details>

### Troubleshooting and Maintenance

<details>
<summary>What steps would you take to troubleshoot a failing service in a SOA architecture?</summary>

### What steps would you take to troubleshoot a failing service in a SOA architecture?

**Definition:**

</details>

<details>
<summary>How do you manage and maintain services throughout their lifecycle in a SOA infrastructure?</summary>

### How do you manage and maintain services throughout their lifecycle in a SOA infrastructure?

**Definition:**

</details>
