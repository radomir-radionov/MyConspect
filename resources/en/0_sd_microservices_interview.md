# Microservices — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [Microservices — Interview](./0_sd_microservices_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Microservices](https://devinterview.io/questions/software-architecture-and-system-design/microservices-interview-questions/).

### Microservices Fundamentals

<details>
<summary>What is a microservice and how does it differ from a monolithic architecture?</summary>

### What is a microservice and how does it differ from a monolithic architecture?

**Definition:**

A microservice is one deployable process that owns a single business capability and its data. A monolith keeps those capabilities in one program, one release, and usually one database.

**How it works:**

- A monolith is one codebase and one deployment unit. Modules call each other in process.
- A microservice is a separate process, released on its own, talking over HTTP, gRPC, or a broker.
- The monolith typically shares one database. Each service can keep its own store.
- Scaling a monolith copies the whole application. A service can be scaled on its own.
- A monolith usually sticks to one stack. Services may use different languages and stores.
- One team can own a small monolith. A large system often splits ownership across teams, one service each.
- The split pays off when capabilities scale differently, teams need to ship independently, or one function wants a different tool. It costs a network and an operations surface.

**Examples:**

```text
monolith:  checkout + inventory + mail  ->  one process, one database
services:  checkout -> orders-db
           inventory -> stock-db
           mail      -> queue
```
</details>

<details>
<summary>Can you describe the principles behind the microservices architecture?</summary>

### Can you describe the principles behind the microservices architecture?

**Definition:**

Microservices structure an application as small services, each built around one business capability, owned by one team, and released on its own.

**How it works:**

- Each service has its own codebase, data, and runtime. It does not share tables with its neighbors.
- The boundary follows a business capability, and the published API is the only thing outsiders depend on.
- Teams own the service from build through production. That is the usual link with DevOps: you build it, you run it.
- Failure is expected. Timeouts, bulkheads, and degraded behavior are part of the design, not an afterthought.
- Governance is light. A team picks the stack that fits, as long as the contract stays stable.
- Build, deploy, and config are automated, and changes land as small releases rather than rare big ones.
- Services are discoverable through a documented API or a registry, so callers do not hard-code locations.
- Team shape follows the services. Conway’s law is the reason a mismatched org chart fights the architecture.

**Examples:**

```text
POST /loans
  credit-check service decides eligibility
  this service only returns approved or refused
  it does not share the credit-check database
```
</details>

<details>
<summary>What are the main benefits of using microservices?</summary>

### What are the main benefits of using microservices?

**Definition:**

The benefit of microservices is that one capability can change, scale, and fail without dragging the rest of the system with it.

**How it works:**

- A hot service is scaled on its own instead of copying every module.
- A fault is more likely to stay inside one process, so the others keep answering.
- Teams ship on their own cadence, which shortens the path from change to production.
- A service can use the language and store that fit its job.
- A smaller codebase is easier for one team to understand and change safely.
- Security policy can be tighter on the service that holds sensitive data, and looser on the one that does not.
- Those gains show up only when boundaries and operations are actually independent.
</details>

<details>
<summary>What are some of the challenges you might face when designing a microservices architecture?</summary>

### What are some of the challenges you might face when designing a microservices architecture?

**Definition:**

Splitting a system into services replaces in-process calls with a network, and replaces one database with many owners. Most of the pain comes from those two facts.

**How it works:**

- Each service owning its data makes cross-service queries and atomic updates hard. You usually get eventual consistency.
- Synchronous chains couple availability: one slow callee stalls the caller. Discovery and routing get harder as the count grows.
- Auth, timeouts, and policy have to be consistent across many codebases, or they drift.
- More processes mean more deploys, more config, and monitoring that has to follow one request across services.
- A business action that needs several services is no longer one local transaction.
- Integration tests are expensive, and versioned APIs must keep old callers working.
- Teams that never share a picture of the domain will draw boundaries that do not match the business.

**Examples:**

A checkout that writes orders, stock, and payment in three databases cannot wrap them in one commit. A failed stock reservation has to be undone with a compensating step, not a database rollback.
</details>

<details>
<summary>How do microservices communicate with each other?</summary>

### How do microservices communicate with each other?

**Definition:**

Services communicate either by a call that waits for an answer, or by a message the sender does not wait on. The choice is about coupling and latency, not about a favorite protocol.

**How it works:**

- Synchronous HTTP or gRPC fits when the caller needs the result now. The caller is coupled to the callee’s availability.
- A queue or an event fits when the work can finish later. The sender stays up if the receiver is down, and the broker absorbs bursts.
- A log or stream fits a continuous high-volume feed, such as prices or click events.
- REST is easy to debug and portable. gRPC with a schema is faster and catches type mismatches earlier, and it is less convenient for a browser.
- A gateway or a mesh can add routing, auth, and telemetry. It does not change the sync-versus-async decision.

**Examples:**

```text
sync:  checkout --HTTP--> inventory  (wait for "reserved")
async: checkout --OrderPlaced--> broker --> mail, analytics
```
</details>

<details>
<summary>What is Domain-Driven Design (DDD) and how is it related to microservices?</summary>

### What is Domain-Driven Design (DDD) and how is it related to microservices?

**Definition:**

Domain-Driven Design models the business as bounded contexts, each with its own language and rules. A microservice often maps to one context so that model can change without a shared enterprise schema.

**How it works:**

- A bounded context is the edge inside which a word and a model mean one thing.
- The same word, such as customer, may mean a lead in sales and an account in billing. That split is allowed.
- Inside the context the team keeps the model consistent, often in its own relational store.
- Outside, other services see only the API or domain events, not the tables.
- A ubiquitous language shared by developers and domain experts is what keeps the code and the business talking about the same things.

**Examples:**

Sales stores a lead with a score. Billing stores an account with a balance. They never share a Customer table. When a lead converts, sales publishes LeadConverted and billing creates the account.
</details>

<details>
<summary>How would you decompose a monolithic application into microservices?</summary>

### How would you decompose a monolithic application into microservices?

**Definition:**

Decompose along business capabilities and the words people already use, then move one slice out at a time while the monolith still serves the rest.

**How it works:**

- Find a capability whose data and rules change together. That is the candidate service, not a technical layer such as “all controllers”.
- Give that slice its own API and move its tables out of the shared database.
- Route only that capability to the new service. The strangler approach leaves the monolith running.
- Keep cross-service calls few. If two slices chat on every request, the boundary is probably wrong.
- Repeat. Do not rewrite the whole system before the first slice has a real owner and a real deploy.

**Examples:**

```text
monolith still serves catalog and checkout
new service owns only shipping rates and labels
traffic for /shipping goes to the new service
```
</details>

<details>
<summary>What strategies can be employed to manage transactions across multiple microservices?</summary>

### What strategies can be employed to manage transactions across multiple microservices?

**Definition:**

Keep a transaction inside one service when the business rule fits there. When several services must cooperate, coordinate local commits instead of one global lock.

**How it works:**

- Two-phase commit asks every participant to prepare, then commit. It can still coordinate a global outcome, but it blocks participants and is a poor default.
- A three-phase variant adds a pre-commit to reduce blocking, and it is still heavy for service calls.
- A saga runs a local transaction in each service and a compensating action if a later step fails.
- A transactional outbox writes the business change and the outgoing message in the same local commit, then a relay publishes the message.
- If the contexts were drawn so the rule lives in one service, the distributed transaction disappears.
- CQRS and event sourcing help when the write model is a sequence of facts and the read model can lag.

**Examples:**

Take payment, then reserve stock. If stock fails, refund the payment. That is a saga. The payment service does not roll back the stock database.
</details>

<details>
<summary>Explain the concept of ‘Bounded Context’ in the microservices architecture.</summary>

### Explain the concept of ‘Bounded Context’ in the microservices architecture.

**Definition:**

A bounded context is the boundary inside which a model and its vocabulary mean one thing. A microservice usually implements one context and hides the rest.

**How it works:**

- The team and the domain experts share one language inside the boundary. The same word may mean something else next door.
- Consistency and transactions stay local. Data leaves only through an API or an event.
- The context typically has its own codebase, so another team cannot reach in and change the model.
- Relationships between contexts are explicit: one supplies, one conforms, or a translation layer sits between them.

**Examples:**

In sales, a lead is a person who might buy. In support, the same person is a ticket contact. Two contexts, two models, two services. They integrate by events, not by a shared Lead table.
</details>

<details>
<summary>How do you handle failure in a microservice?</summary>

### How do you handle failure in a microservice?

**Definition:**

Treat failure as normal. Isolate the broken dependency, retry only what is safe, and keep a smaller useful behavior when the full one is down.

**How it works:**

- A circuit breaker stops calling a dependency that is already failing, then probes it later.
- A bulkhead gives each dependency its own pool, so one stuck callee cannot exhaust every thread.
- Retries use a limit and backoff. Retrying a non-idempotent charge is how you double-bill.
- A queue decouples a slow consumer. A health check pulls a bad instance out of rotation.
- Cache or a reduced response covers a read when the source is down. Sharding keeps one database outage from taking every key.
- Version the API so an old caller still works while a new instance is sick.
- Auto-scaling replaces load, not a logic bug. Alert on symptoms, and degrade on purpose instead of timing out the user.

**Examples:**

Inventory starts returning errors. Checkout opens the circuit, stops waiting, and accepts the order as “reservation pending” instead of failing the whole page.
</details>

### Design Patterns and Best Practices

<details>
<summary>What design patterns are commonly used in microservices architectures?</summary>

### What design patterns are commonly used in microservices architectures?

**Definition:**

The patterns that show up most often are about the edge, failure, data ownership, and how a change reaches production.

**How it works:**

- An API gateway is the one door clients use. A registry and discovery let services find each other as instances come and go.
- A circuit breaker and a bulkhead stop one failure from taking the callers down.
- Database per service keeps ownership clear. A saga coordinates multi-service work. An outbox publishes events without losing them.
- Event sourcing stores facts instead of only the latest row. Cache-aside lets the service fill the cache on a miss.
- A strangler fig replaces a monolith one route at a time. Blue-green and canary cut over traffic. A/B compares two behaviors on a slice of users.

**Examples:**

Clients call only the gateway. The gateway looks up inventory in the registry, and a breaker wraps that call. Inventory never reads the orders database.
</details>

<details>
<summary>Can you describe the API Gateway pattern and its benefits?</summary>

### Can you describe the API Gateway pattern and its benefits?

**Definition:**

An API gateway is the single client-facing entry that routes, shapes, and protects calls to the services behind it.

**How it works:**

- It can fan out one client call into several service calls and assemble one response.
- It caches hot reads, authenticates the caller, and enforces a rate limit before traffic hits the services.
- It can balance load and resolve which instance is alive.
- Clients learn one host and one shape. Services may speak different protocols behind the gateway.
- A failure can be turned into a fallback at the edge instead of cascading to the client.
- Logs and metrics at the gateway show the client’s view of the system.
- The gateway itself must be redundant, or it becomes the outage.

**Examples:**

A mobile home screen needs profile, cart count, and recommendations. The app calls GET /home once. The gateway calls three services and returns one JSON object.
</details>

<details>
<summary>Explain the ‘Circuit Breaker’ pattern. Why is it important in a microservices ecosystem?</summary>

### Explain the ‘Circuit Breaker’ pattern. Why is it important in a microservices ecosystem?

**Definition:**

A circuit breaker stops a caller from hammering a dependency that is already failing, and it tries that dependency again only after a pause.

**How it works:**

- Closed means calls go through. Failures are counted.
- Open means calls fail fast or hit a fallback. The dependency gets time to recover.
- Half-open lets a few trial calls through. Success closes the circuit. Failure opens it again.
- Thresholds are consecutive errors, error rate, or timeouts, not a single blip.
- Without it, threads pile up on a dead service and the caller falls over too.

**Examples:**

```text
closed -> 5 timeouts -> open for 30s
half-open -> one success -> closed
half-open -> timeout -> open again
```
</details>

<details>
<summary>What is a ‘Service Mesh’? How does it aid in managing microservices?</summary>

### What is a ‘Service Mesh’? How does it aid in managing microservices?

**Definition:**

A service mesh is a dedicated network layer, usually a sidecar proxy next to each service, that handles service-to-service traffic so application code does not.

**How it works:**

- The data plane is the proxies, such as Envoy, that sit beside each instance and carry the bytes.
- The control plane, such as Istio, pushes policy: routes, retries, and certificates.
- Mutual TLS and identity give you encrypted calls without each service inventing its own security.
- The mesh health-checks peers, balances by latency or round-robin, and can shift a slice of traffic for a canary.
- If an instance looks unhealthy, the proxy stops sending it work.
- Metrics and traces come from the proxies, so every service gets the same telemetry.

**Examples:**

Checkout does not know inventory’s pod IP. Its sidecar sends the call to the inventory sidecar, which retries once, records the latency, and presents a certificate.
</details>

<details>
<summary>How do you ensure data consistency across microservices?</summary>

### How do you ensure data consistency across microservices?

**Definition:**

Each service commits its own database, so a business action that spans services is usually eventually consistent. Design the path so a local commit and the message that follows it cannot diverge.

**How it works:**

- A synchronous call can look fresh, and it still is not an atomic commit across two databases. It also couples availability.
- Publish through an outbox: the row change and the event insert commit together, and a relay delivers the event.
- Consumers apply their own local transaction and must be safe to receive the event more than once.
- A saga compensates when a later step fails. BASE — basically available, soft state, eventually consistent — is the usual description of this stance.
- During a partition you cannot have a linearizable multi-service update and full availability. Pick which operations may lag.

**Examples:**

```text
BEGIN;
  UPDATE orders SET status = 'placed' WHERE id = 9;
  INSERT INTO outbox (type, payload) VALUES ('OrderPlaced', '...');
COMMIT;
-- a relay publishes OrderPlaced after the commit
```
</details>

<details>
<summary>Discuss the strategies you would use for testing microservices.</summary>

### Discuss the strategies you would use for testing microservices.

**Definition:**

</details>

<details>
<summary>How can you prevent configuration drift in a microservices environment?</summary>

### How can you prevent configuration drift in a microservices environment?

**Definition:**

</details>

<details>
<summary>When should you use synchronous vs. asynchronous communication in microservices?</summary>

### When should you use synchronous vs. asynchronous communication in microservices?

**Definition:**

</details>

<details>
<summary>What role does containerization play in microservices?</summary>

### What role does containerization play in microservices?

**Definition:**

</details>

### Deployment and Operations

<details>
<summary>What are the challenges of deploying microservices?</summary>

### What are the challenges of deploying microservices?

**Definition:**

</details>

<details>
<summary>Describe blue-green deployment and how it applies to microservices.</summary>

### Describe blue-green deployment and how it applies to microservices.

**Definition:**

</details>

<details>
<summary>How does canary releasing work, and how is it beneficial for microservices deployments?</summary>

### How does canary releasing work, and how is it beneficial for microservices deployments?

**Definition:**

</details>

<details>
<summary>Explain the concept of ‘Infrastructure as Code’ and how it benefits microservices management.</summary>

### Explain the concept of ‘Infrastructure as Code’ and how it benefits microservices management.

**Definition:**

</details>

<details>
<summary>Describe what Continuous Integration/Continuous Deployment (CI/CD) pipelines look like for microservices.</summary>

### Describe what Continuous Integration/Continuous Deployment (CI/CD) pipelines look like for microservices.

**Definition:**

</details>

<details>
<summary>How do you monitor health and performance of microservices?</summary>

### How do you monitor health and performance of microservices?

**Definition:**

</details>

### Microservices and Data Management

<details>
<summary>How do you handle database schema changes in a microservice architecture?</summary>

### How do you handle database schema changes in a microservice architecture?

**Definition:**

</details>

<details>
<summary>Discuss the pros and cons of using a shared database vs. a database-per-service.</summary>

### Discuss the pros and cons of using a shared database vs. a database-per-service.

**Definition:**

</details>

<details>
<summary>Explain the concept of ‘Event Sourcing’ in the context of microservices.</summary>

### Explain the concept of ‘Event Sourcing’ in the context of microservices.

**Definition:**

</details>

<details>
<summary>What is Command Query Responsibility Segregation (CQRS) and how can it be applied to microservices?</summary>

### What is Command Query Responsibility Segregation (CQRS) and how can it be applied to microservices?

**Definition:**

</details>

<details>
<summary>Can you discuss strategies for dealing with data consistency without using distributed transactions?</summary>

### Can you discuss strategies for dealing with data consistency without using distributed transactions?

**Definition:**

</details>

### Security

<details>
<summary>How do you implement authentication and authorization in microservices?</summary>

### How do you implement authentication and authorization in microservices?

**Definition:**

</details>

<details>
<summary>What are some common security concerns when handling inter-service communication?</summary>

### What are some common security concerns when handling inter-service communication?

**Definition:**

</details>

<details>
<summary>Describe how you would use OAuth2 or JWT in a microservices architecture.</summary>

### Describe how you would use OAuth2 or JWT in a microservices architecture.

**Definition:**

</details>

<details>
<summary>What mechanisms would you implement to prevent or detect security breaches at the microservices level?</summary>

### What mechanisms would you implement to prevent or detect security breaches at the microservices level?

**Definition:**

</details>

<details>
<summary>How do you ensure that sensitive data is protected when using microservices?</summary>

### How do you ensure that sensitive data is protected when using microservices?

**Definition:**

</details>

### Scalability and Performance

<details>
<summary>How do you ensure that a microservice is scalable?</summary>

### How do you ensure that a microservice is scalable?

**Definition:**

</details>

<details>
<summary>What metrics would you monitor to assess a microservice’s performance?</summary>

### What metrics would you monitor to assess a microservice’s performance?

**Definition:**

</details>

<details>
<summary>Discuss strategies to handle high-load or peak traffic in a microservices architecture.</summary>

### Discuss strategies to handle high-load or peak traffic in a microservices architecture.

**Definition:**

</details>

<details>
<summary>How do Microservices handle load balancing?</summary>

### How do Microservices handle load balancing?

**Definition:**

</details>

<details>
<summary>In terms of performance, what would influence your decision to use a message broker vs direct service-to-service communication?</summary>

### In terms of performance, what would influence your decision to use a message broker vs direct service-to-service communication?

**Definition:**

</details>

### Inter-Process Communication

<details>
<summary>What are the advantages and drawbacks of using REST over gRPC in microservice communication?</summary>

### What are the advantages and drawbacks of using REST over gRPC in microservice communication?

**Definition:**

</details>

<details>
<summary>How would you implement versioning in microservices API?</summary>

### How would you implement versioning in microservices API?

**Definition:**

</details>

<details>
<summary>What are the challenges of network latency in microservices and how can they be mitigated?</summary>

### What are the challenges of network latency in microservices and how can they be mitigated?

**Definition:**

</details>

<details>
<summary>Explain the difference between message queues and event buses. In which scenarios would you use each?</summary>

### Explain the difference between message queues and event buses. In which scenarios would you use each?

**Definition:**

</details>

<details>
<summary>How can transactional outbox patterns be used in microservices?</summary>

### How can transactional outbox patterns be used in microservices?

**Definition:**

</details>

### Resiliency and Reliability

<details>
<summary>How would you design a microservice to be fault-tolerant?</summary>

### How would you design a microservice to be fault-tolerant?

**Definition:**

</details>

<details>
<summary>Discuss the importance of timeouts and retry logic in a microservices architecture.</summary>

### Discuss the importance of timeouts and retry logic in a microservices architecture.

**Definition:**

</details>

<details>
<summary>What strategies can be used to achieve high availability in microservices?</summary>

### What strategies can be used to achieve high availability in microservices?

**Definition:**

</details>

<details>
<summary>How do you approach disaster recovery in a microservices-based system?</summary>

### How do you approach disaster recovery in a microservices-based system?

**Definition:**

</details>

<details>
<summary>Explain how you would handle a cascading failure in a microservice ecosystem.</summary>

### Explain how you would handle a cascading failure in a microservice ecosystem.

**Definition:**

</details>

### Observability and Monitoring

<details>
<summary>What tools or practices would you recommend for logging in a distributed microservices system?</summary>

### What tools or practices would you recommend for logging in a distributed microservices system?

**Definition:**

</details>

<details>
<summary>How do you trace requests across boundaries of different microservices?</summary>

### How do you trace requests across boundaries of different microservices?

**Definition:**

</details>

<details>
<summary>Discuss the importance of metrics and alerts in maintaining a microservices architecture.</summary>

### Discuss the importance of metrics and alerts in maintaining a microservices architecture.

**Definition:**

</details>

<details>
<summary>How do you handle performance bottlenecks in microservices?</summary>

### How do you handle performance bottlenecks in microservices?

**Definition:**

</details>

<details>
<summary>What is distributed tracing and which tools help you accomplish it in a microservices setup?</summary>

### What is distributed tracing and which tools help you accomplish it in a microservices setup?

**Definition:**

</details>

### Containers and Orchestration

<details>
<summary>Explain the role of Docker in developing and deploying microservices.</summary>

### Explain the role of Docker in developing and deploying microservices.

**Definition:**

</details>

<details>
<summary>How do container orchestration tools like Kubernetes help with microservice deployment?</summary>

### How do container orchestration tools like Kubernetes help with microservice deployment?

**Definition:**

</details>

<details>
<summary>Describe the lifecycle of a container within a microservices architecture.</summary>

### Describe the lifecycle of a container within a microservices architecture.

**Definition:**

</details>

<details>
<summary>How do you ensure that containers are secure and up-to-date?</summary>

### How do you ensure that containers are secure and up-to-date?

**Definition:**

</details>

<details>
<summary>What are the best practices for container networking in the context of microservices?</summary>

### What are the best practices for container networking in the context of microservices?

**Definition:**

</details>
