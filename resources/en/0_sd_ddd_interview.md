# Domain-Driven Design — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [Domain-Driven Design — Interview](./0_sd_ddd_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Domain Driven Design](https://devinterview.io/questions/software-architecture-and-system-design/domain-driven-design-interview-questions/).

### DDD Fundamentals

<details>
<summary>What is Domain-Driven Design (DDD) and what are its core principles?</summary>

### What is Domain-Driven Design (DDD) and what are its core principles?

**Definition:**

Domain-Driven Design builds the software model around the business, in the language the business already uses, and splits that model where the language changes.

**How it works:**

- A ubiquitous language is shared by code, tests, and conversations. A term in the model means what the experts mean.
- A bounded context is the boundary of one model. The same word may mean something else in the next context.
- Tactical building blocks live inside a context: entities, value objects, aggregates, domain events, repositories, and domain services.
- Aggregates draw the consistency boundary. Repositories load and save them. Domain events announce what already happened.
- The model is not the database schema. Persistence follows the model, not the other way around.
</details>

<details>
<summary>How does DDD differ from traditional data-driven or service-driven approaches?</summary>

### How does DDD differ from traditional data-driven or service-driven approaches?

**Definition:**

A data-driven design starts from tables and lets the schema dictate the code. A service-driven design starts from procedures. DDD starts from the business rules and the words used to state them.

**How it works:**

- Data-driven code often mirrors tables: one class per table, behavior scattered in queries.
- A procedural service layer can become a place where every rule lands, with entities that are only bags of fields.
- DDD puts invariants in the model. An order refuses an empty line instead of waiting for a service to remember the check.
- Persistence is behind a repository. Callers do not assemble SQL to enforce a rule.
- Ownership of a rule sits in one context, not in a shared god-service.

**Examples:**

A data-driven `placeOrder` inserts rows and hopes the totals match. A domain model’s `Order.addItem` rejects a quantity below one before anything is saved.
</details>

<details>
<summary>What is the difference between the Domain Model and the Data Model in DDD?</summary>

### What is the difference between the Domain Model and the Data Model in DDD?

**Definition:**

The domain model is the business rules in code. The data model is how those facts are stored. They are allowed to look different.

**How it works:**

- The domain model uses entities, value objects, and methods that protect invariants. It does not know table names.
- The data model uses tables, documents, or events. It may split one aggregate across rows or pack it into one document.
- A repository translates between them on load and save.
- Changing a column should not rename a business concept, and renaming a concept should not require a leaky query in the domain.

**Examples:**

```text
domain: Order.addItem(sku, qty) refuses qty < 1
data:   orders row + order_items rows
repo:   loads both, returns one Order
```
</details>

<details>
<summary>Can you explain what Bounded Contexts are in DDD, and why they are important?</summary>

### Can you explain what Bounded Contexts are in DDD, and why they are important?

**Definition:**

A bounded context is the limit inside which a model and its vocabulary are consistent. Outside that limit, the same word is not assumed to mean the same thing.

**How it works:**

- “Customer” can be a lead in sales and an account in billing. Forcing one class to be both makes both models worse.
- The context is also a team boundary. One team can change the model without a meeting about every other module.
- Integration is explicit: an API, an event, or a translation layer. There is no shared mutable model.
- A microservice often implements one context, because the deploy unit then matches the model unit.

**Examples:**

Sales stores a lead score. Billing stores a balance. They publish LeadConverted. They do not share a Customer table.
</details>

<details>
<summary>What strategies can you use to define Bounded Contexts in a large system?</summary>

### What strategies can you use to define Bounded Contexts in a large system?

**Definition:**

Draw a context where the language, the rules, and the people who change them already form a cluster.

**How it works:**

- Listen for words that shift meaning. That shift is a boundary.
- Follow a business process until the data and the invariants stop changing together.
- Align with teams. A context that two departments both “own” will be pulled apart. Conway’s law is the warning.
- Prefer a boundary that can be deployed and evolved without a lockstep release.
- Keep cohesive behavior inside. If every change to A also changes B, they are probably one context.

**Examples:**

“Order” in the shop means a basket being paid. “Order” in the warehouse means a pick list. Two contexts, even though the business uses one word.
</details>

<details>
<summary>How do you integrate multiple Bounded Contexts within a single system?</summary>

### How do you integrate multiple Bounded Contexts within a single system?

**Definition:**

Contexts integrate through an explicit relationship, not through a shared database. The context map names that relationship.

**How it works:**

- Partnership: two teams change the contract together.
- Customer–supplier: the upstream team provides what the downstream team needs, on a schedule they agree.
- Conformist: the downstream team takes the upstream model as-is and does not translate.
- An anti-corruption layer translates a foreign model so it cannot leak into yours.
- A shared kernel is a small piece both sides truly share, such as a money value object, versioned on purpose. It is not a shared business module.
- Events and APIs carry facts across the line. Each side maps them into its own language.

**Examples:**

Billing speaks “invoice”. Shipping speaks “consignment”. An anti-corruption layer in shipping turns InvoicePaid into a consignment it understands, and billing’s class names never appear in shipping’s model.
</details>

<details>
<summary>Why is Ubiquitous Language important in DDD, and how do you establish it?</summary>

### Why is Ubiquitous Language important in DDD, and how do you establish it?

**Definition:**

A ubiquitous language is one vocabulary for a context, used in speech, tickets, and code. It matters because a translation gap is where the wrong rule gets built.

**How it works:**

- Collect the nouns and verbs experts actually use. Prefer those names in types and methods.
- When experts disagree on a word, you have either two contexts or a concept that is not settled. Do not paper over it with a vague class name.
- Tests and event names use the same words, so a failing test reads like the business rule.
- Drop synonyms. If the business says “buyer” at checkout, the code should not say `User` there.

**Examples:**

Experts say “reserve stock”, not “update the inventory row”. The method is `Stock.reserve(sku, qty)`. A later reader does not have to translate.
</details>

<details>
<summary>What is the role of Entities in DDD, and how do they differ from Value Objects?</summary>

### What is the role of Entities in DDD, and how do they differ from Value Objects?

**Definition:**

An entity is defined by a stable identity that survives changes of its attributes. A value object is defined only by its attributes and has no identity of its own.

**How it works:**

- Two entities are the same when their ids match, even if a field changed. An order is still that order after a line is added.
- Two value objects are the same when every attribute matches. Two `Money(10, EUR)` values are interchangeable.
- Entities have a lifecycle. Value objects are replaced rather than mutated: a new address replaces the old one.
- Value objects are immutable so they can be shared and compared without surprises.
- Entities are the things you look up. Value objects describe them: money, a date range, a quantity.

**Examples:**

`Order` with id 9 is one entity. Its `Money` total is a value object. Changing the total replaces the money value. It does not create a second order.
</details>

<details>
<summary>How would you identify Aggregates in a domain model, and what boundary rules apply to them?</summary>

### How would you identify Aggregates in a domain model, and what boundary rules apply to them?

**Definition:**

An aggregate is a cluster of entities and value objects that must stay consistent together, with one entity as the root. The boundary is the largest set you are willing to lock in one transaction.

**How it works:**

- Start from an invariant. “An order total equals its lines” means the lines belong inside the order aggregate.
- Outside code holds only the root’s id. It does not reach in and mutate a child.
- Keep aggregates small. A customer aggregate that contains every order will lock too much.
- One transaction changes one aggregate. Another aggregate hears about it through a domain event.
- Reference other aggregates by id, not by a live object pointer.

**Examples:**

Order is the root. Order lines live inside it. The customer is a different aggregate, stored as `customerId` on the order. Paying the order does not load the customer’s whole history.
</details>

<details>
<summary>Can you explain what a Domain Event is and give an example of when it might be used?</summary>

### Can you explain what a Domain Event is and give an example of when it might be used?

**Definition:**

A domain event is a fact the model has already recorded, named in the ubiquitous language. Other parts of the system react to it instead of being called directly.

**How it works:**

- The name is past tense: OrderPlaced, StockReserved. It is not a command.
- It carries the ids and the data a subscriber needs, not the whole aggregate.
- Inside the context it can update another aggregate after the first commit. Across contexts it is the integration message.
- Handlers must tolerate seeing the event more than once.

**Examples:**

When an order is placed, the aggregate records OrderPlaced. Shipping starts a consignment. Mail sends a receipt. The order aggregate does not call either of them.
</details>

### Tactical Design in DDD

<details>
<summary>How do Repositories function in DDD and what is their main responsibility?</summary>

### How do Repositories function in DDD and what is their main responsibility?

**Definition:**

A repository pretends the aggregates are an in-memory collection. Its job is to load and save a whole aggregate, and to hide how that is stored.

**How it works:**

- Callers ask for an aggregate by id, or by a domain query, and get the root with its children consistent.
- Save writes the whole aggregate. Callers do not update a child table themselves.
- The interface lives in the domain. The SQL or document implementation lives outside it.
- It is not a general query API for screens. A read model can serve lists without going through the aggregate.

**Examples:**

`orders.get(id)` returns an Order. `orders.save(order)` writes the order and its lines. The application service never sees the `order_items` table.
</details>

<details>
<summary>What is the difference between a Repository and a Service in DDD?</summary>

### What is the difference between a Repository and a Service in DDD?

**Definition:**

A repository loads and saves aggregates. A domain service holds a business rule that does not naturally belong to one entity.

**How it works:**

- If the operation is “get me this order” or “store this order”, it is the repository.
- If the operation is “price this shipment given the tariff and the address”, and neither object should own the other, it is a domain service.
- A repository has no business policy beyond reconstituting a valid aggregate.
- A service must not become a place that reaches into another aggregate’s internals. It talks to roots or to other services.

**Examples:**

`OrderRepository.save` persists an order. `TransferService.move(from, to, amount)` is a domain service because the rule spans two accounts and lives in neither one alone.
</details>

<details>
<summary>How would you handle complex domain logic that involves multiple entities and value objects?</summary>

### How would you handle complex domain logic that involves multiple entities and value objects?

**Definition:**

Put the rule on the aggregate root if the entities share one consistency boundary. If they do not, publish an event and let the other aggregate decide.

**How it works:**

- The root is the only door. `Order.addItem` checks quantity, recalculates the money total, and rejects a broken order.
- Value objects such as Money and Quantity carry the small rules: no negative amount, a known currency.
- Guard clauses fail before state changes, so a half-updated aggregate is never saved.
- A rule that spans aggregates is eventual. The first aggregate commits, the event is stored with that commit, and the second aggregate reacts.
- Do not grow the aggregate just to make the rule synchronous. A large aggregate is a large lock.

**Examples:**

`Order.addItem` refuses a second lamp when the lines would exceed the customer’s limit stored on the order. The customer’s credit limit lives on the Customer aggregate and is checked by a domain service before the order is opened, not by reaching into Customer from Order.
</details>

<details>
<summary>Can you delineate the role of a Domain Service versus an Application Service?</summary>

### Can you delineate the role of a Domain Service versus an Application Service?

**Definition:**

A domain service is a business rule with no natural home on one entity. An application service is the use-case coordinator: it loads aggregates, calls the model, and saves.

**How it works:**

- Domain service: pure domain types in, a domain result out. No HTTP, no transaction API, no repository if it can be avoided.
- Application service: one use case. It opens the transaction, fetches aggregates, calls the domain, publishes events, and commits.
- Business ifs belong in the domain. “What do we do when the client calls this endpoint” belongs in the application service.
- If the application service starts checking quantities itself, the model has been bypassed.

**Examples:**

`PricingService.quote(shipment, tariff)` is domain: it returns a Money. `BookShipmentService` is application: it loads the shipment, calls `quote`, reserves stock, and saves.
</details>

<details>
<summary>What considerations are there for implementing Aggregates to ensure transactional consistency?</summary>

### What considerations are there for implementing Aggregates to ensure transactional consistency?

**Definition:**

Transactional consistency stops at the aggregate. One transaction saves one aggregate, and a version check rejects a stale write.

**How it works:**

- Load the aggregate, change it only through the root, save it. The invariant holds at the commit or the commit does not happen.
- Optimistic concurrency stores a version. Two writers of the same order: the second save fails and retries against the new version.
- Do not use a two-phase commit to drag another aggregate into the same transaction. Publish a domain event instead.
- An outbox table in the same transaction as the aggregate makes the event durable with the state change.
- Keep the aggregate small so the lock or the version conflict stays rare.

**Examples:**

```text
load order version 4
add item
save where version = 4, set version = 5
a parallel save still on version 4 fails and reloads
```
</details>

<details>
<summary>How do you deal with performance issues when loading large Aggregates?</summary>

### How do you deal with performance issues when loading large Aggregates?

**Definition:**

</details>

<details>
<summary>In what scenarios might you use a Specification pattern in DDD?</summary>

### In what scenarios might you use a Specification pattern in DDD?

**Definition:**

</details>

<details>
<summary>What are some Domain Modeling strategies to enforce invariants within an Aggregate?</summary>

### What are some Domain Modeling strategies to enforce invariants within an Aggregate?

**Definition:**

</details>

<details>
<summary>Can you discuss strategies for dealing with concurrency and synchronization within Aggregates?</summary>

### Can you discuss strategies for dealing with concurrency and synchronization within Aggregates?

**Definition:**

</details>

### Domain Events and Event Sourcing

<details>
<summary>How can Domain Events help in designing a loosely coupled system?</summary>

### How can Domain Events help in designing a loosely coupled system?

**Definition:**

</details>

<details>
<summary>What is Event Sourcing, and how does it differ from standard persistence mechanisms?</summary>

### What is Event Sourcing, and how does it differ from standard persistence mechanisms?

**Definition:**

</details>

<details>
<summary>Can you explain how CQRS (Command Query Responsibility Segregation) complements DDD?</summary>

### Can you explain how CQRS (Command Query Responsibility Segregation) complements DDD?

**Definition:**

</details>

<details>
<summary>In what situations would you choose to implement Event Sourcing in a DDD context?</summary>

### In what situations would you choose to implement Event Sourcing in a DDD context?

**Definition:**

</details>

<details>
<summary>How do you typically handle events that should trigger side effects in other Bounded Contexts?</summary>

### How do you typically handle events that should trigger side effects in other Bounded Contexts?

**Definition:**

</details>

### Strategic Design and DDD Implementation

<details>
<summary>How does DDD address the issue of complex domain logic changes over time?</summary>

### How does DDD address the issue of complex domain logic changes over time?

**Definition:**

</details>

<details>
<summary>Describe the concept of a context map in DDD and its purpose.</summary>

### Describe the concept of a context map in DDD and its purpose.

**Definition:**

</details>

<details>
<summary>What is the Anti-Corruption Layer in DDD, and when would you use one?</summary>

### What is the Anti-Corruption Layer in DDD, and when would you use one?

**Definition:**

</details>

<details>
<summary>How might you implement a Policy in DDD, and what are its advantages?</summary>

### How might you implement a Policy in DDD, and what are its advantages?

**Definition:**

</details>

<details>
<summary>Can you give an example of how DDD can coexist with microservices architecture?</summary>

### Can you give an example of how DDD can coexist with microservices architecture?

**Definition:**

</details>

<details>
<summary>What factors would influence the decision to refactor a legacy system with a DDD approach?</summary>

### What factors would influence the decision to refactor a legacy system with a DDD approach?

**Definition:**

</details>

### Advanced DDD Concepts

<details>
<summary>Explain how DDD principles can be applied at different scales in a software project.</summary>

### Explain how DDD principles can be applied at different scales in a software project.

**Definition:**

</details>

<details>
<summary>How can DDD help in understanding and aligning complex organizational structures?</summary>

### How can DDD help in understanding and aligning complex organizational structures?

**Definition:**

</details>

<details>
<summary>How does DDD assist in creating a pluggable component architecture?</summary>

### How does DDD assist in creating a pluggable component architecture?

**Definition:**

</details>

<details>
<summary>How does DDD help manage distributed systems complexity, particularly in consistency management?</summary>

### How does DDD help manage distributed systems complexity, particularly in consistency management?

**Definition:**

</details>

<details>
<summary>What are the challenges involved in implementing DDD in a large, multidisciplinary team?</summary>

### What are the challenges involved in implementing DDD in a large, multidisciplinary team?

**Definition:**

</details>

### Practical Considerations

<details>
<summary>What are common pitfalls when transitioning an existing project to DDD?</summary>

### What are common pitfalls when transitioning an existing project to DDD?

**Definition:**

</details>

<details>
<summary>How do you measure the success of DDD implementation in a project?</summary>

### How do you measure the success of DDD implementation in a project?

**Definition:**

</details>

<details>
<summary>What tools or frameworks are supportive of DDD and why?</summary>

### What tools or frameworks are supportive of DDD and why?

**Definition:**

</details>

<details>
<summary>How would you address the training and knowledge transfer needed for a team new to DDD?</summary>

### How would you address the training and knowledge transfer needed for a team new to DDD?

**Definition:**

</details>

<details>
<summary>Can you provide an example of a project where DDD provided clear benefits over other design approaches?</summary>

### Can you provide an example of a project where DDD provided clear benefits over other design approaches?

**Definition:**

</details>
