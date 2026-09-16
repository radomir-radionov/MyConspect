# System design — Patterns

Principles and GOF/GRASP patterns.

[← Back to hub](./0_system_design.md)

### Related docs

* [System design — Foundations](./0_system_design_foundations.md) · [System design — Architecture](./0_system_design_architecture.md) · [System design — Data](./0_system_design_data.md) · [System design — Patterns](./0_system_design_patterns.md) · [System design — Interview](./0_system_design_interview.md)

### Sections

- [7. Principles & patterns](#7-principles-patterns)

---

## 7. Principles & patterns

<details>
  <summary>Entities, relations & constructor injection</summary>

### Entities, relations & constructor injection

**Definition:** Design names **entities** (domain actors) and **relations** (who depends on whom). Express them as objects that send messages. Pass collaborators in through the **constructor** (manual DI) so arrows stay one-way.

**How it works:**

- External world = data in/out. Internal world = entity-to-entity messages.
- UML arrows point at the dependency: History → Record; DailyAmount → Budget + History. Cycles (A constructs B constructs A) are a smell.
- Keep knowledge on the expert (GRASP): History computes `spentToday`, Budget computes `perDay`, DailyAmount only subtracts.
- JS has no interfaces — constructor injection still decouples *construction*, but DIP onto an abstraction needs TypeScript or duck typing.

**When to use:** More than one collaborating concept (order + lines, budget + ledger). Skip for a single function.

**Pluses and minuses:**

| + | − |
|------|------|
| Code map matches the domain | Upfront modeling |
| Tests swap fakes at the constructor | God constructors with 8 deps |
| Avoids hidden `new` inside business classes | JS won't enforce the contract at runtime |

**Examples:**

```ts
class DailyAmount {
  constructor(
    private readonly budget: { perDay: number },
    private readonly history: { spentToday: number },
  ) {}
  get valueOf() {
    return this.budget.perDay - this.history.spentToday;
  }
}
```

**Thoughts:** Full OOP walkthrough (budget clone): [7_special.md — OOP](./7_special_paradigms.md#2-oop--fp). GRASP Expert + Creator sit next to this.

**Sources:** [Doka — OOP](https://doka.guide/tools/oop/)

</details>

<details>
  <summary>SOLID principles</summary>

### SOLID principles

**Definition:**

Five OOP design principles (Robert C. Martin) for maintainable, extensible systems — apply to modules and functions, not only classes. React-agnostic cheat sheet here; per-letter essays: [7_special.md — SOLID](./7_special_engineering.md#9-solid-principles). React components/hooks: [4_react.md — SOLID in React](./4_react_core.md#solid-in-react).

| | Principle | One-liner |
|--|-----------|-----------|
| **S** | Single Responsibility | One reason to change per module |
| **O** | Open/Closed | Open for extension, closed for modification |
| **L** | Liskov Substitution | Subtypes must honor the parent contract |
| **I** | Interface Segregation | Small, focused interfaces |
| **D** | Dependency Inversion | Depend on abstractions, not concretions |

**How it works:** Together they push toward small units that change independently and extend via **new** code. JS/TS: composition + injected functions; TypeScript interfaces express DIP/ISP (JS cannot natively).

**When to use:**

God classes; payment/export variants; injectable data layers. **Not** a 50-line script.

#### Common pitfalls

SRP ≠ “one method.” `Square extends Rectangle`. Fat `Worker` with `eat()` that robots stub. Instantiating SDKs inside domain modules.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Shared review vocabulary; easier tests | Abstraction sprawl if applied as a scorecard |

**Examples:**

checkout depends on a `PaymentProcessor` port, not `new StripeClient()` — swap Stripe/PayPal or a fake in tests without editing the use case.

```ts
type PaymentProcessor = { charge(amount: number): Promise<void> };

class OrderService {
  constructor(private readonly payment: PaymentProcessor) {}
  async checkout(total: number) {
    await this.payment.charge(total);
  }
}
```

**Thoughts:** Depend inward on contracts; add variants without editing the core.

**See also:** [7_special.md — SOLID (overview)](./7_special_engineering.md#solid-overview) · [DRY, YAGNI, KISS](#dry-yagni-kiss)

**Sources:** [Doka — OOP](https://doka.guide/tools/oop/) · [freeCodeCamp — SOLID](https://www.freecodecamp.org/news/solid-principles-single-responsibility-principle-explained/)

</details>

<details>
  <summary>DRY, YAGNI, KISS</summary>

### DRY, YAGNI, KISS

#### DRY (Don't Repeat Yourself)

**Definition:** Every piece of knowledge should have a single, unambiguous representation in the system.

**When to use:** Repeated business logic, validation rules, API clients. Not for coincidentally similar code with different reasons to change.

**Pluses and minuses:**

| + | − |
|------|------|
| Less duplication, easier changes | Premature abstraction creates wrong shared code |
| Consistent behavior | "Copy-paste" vs "wrong abstraction" dilemma |

**Examples:**

Extract shared `formatCurrency()` — not forced shared component for two UIs that look similar but evolve differently.

#### YAGNI (You Aren't Gonna Need It)

**Definition:** Don't implement functionality until it is actually needed.

**When to use:**

Default stance. Build for today's requirements with clean extension points (OCP), not speculative features.

#### KISS (Keep It Simple, Stupid)

**Pluses and minuses:**

| + | − |
|------|------|
| Faster delivery | May need refactor when requirement arrives |
| Less dead code | Under-engineering if requirements are well-known |

**Definition:** Most systems work best when kept simple rather than made complicated.

**When to use:** Always prefer the simplest solution that meets current requirements. Complexity must be justified by measured need.

**Pluses and minuses:**

| + | − |
|------|------|
| Easier to understand and debug | May need to revisit when scale demands |
| Lower maintenance cost | "Simple" is subjective |

**Thoughts:** DRY vs WET (Write Everything Twice) — duplicate once, abstract on third occurrence. YAGNI fights gold-plating. KISS fights resume-driven architecture.

</details>

<details>
  <summary>GRASP principles</summary>

### GRASP principles

**Definition:**

General Responsibility Assignment Software Patterns — nine principles for assigning responsibilities to classes and objects.

| Principle | Definition | When to apply |
|-----------|------------|---------------|
| **Expert** | Assign responsibility to the class that has the information needed to fulfill it | Order calculates its own total |
| **Creator** | Class A creates class B if A contains/records/uses/closely relates to B | Order creates OrderLine |
| **Controller** | Object handles system events, delegating to domain objects | OrderController handles HTTP, delegates to Order |
| **Low Coupling** | Minimize dependencies between classes | Inject services, avoid direct concrete deps |
| **High Cohesion** | Keep related responsibilities together in one class | PaymentValidator validates, doesn't send emails |
| **Polymorphism** | Use polymorphism for type-varying behavior | PaymentProcessor interface, not switch on type |
| **Indirection** | Assign responsibility to intermediate object to decouple | Repository between service and DB |
| **Protected Variations** | Shield elements from changes in other elements with stable interface | Adapter around third-party API |
| **Pure Fabrication** | Create classes that don't represent domain concepts to achieve low coupling/high cohesion | Repository, Factory, DTO |

**Thoughts:** GRASP is more practical than memorizing all 23 GOF patterns for day-to-day design. Expert + Creator + Controller cover most assignment questions.

</details>

<details>
  <summary>TDD & BDD</summary>

### TDD & BDD

#### TDD (Test-Driven Development)

**Definition:** Write a failing test first, then minimal code to pass, then refactor (Red → Green → Refactor).

**When to use:**

Core business logic, algorithms, utilities with clear inputs/outputs.

#### BDD (Behavior-Driven Development)

**Pluses and minuses:**

| + | − |
|------|------|
| Forces clear requirements | Slower initial development |
| High test coverage by design | Tests can be brittle if over-mocked |
| Safer refactoring | Not suited for exploratory/spike work |

**Definition:** Tests describe expected behavior in natural language (Given/When/Then), shared between devs and stakeholders.

**When to use:** Complex business rules, cross-team alignment on behavior. Often with Cucumber/Playwright.

**Pluses and minuses:**

| + | − |
|------|------|
| Shared language with product | Ceremony overhead |
| Tests as living documentation | Gherkin scenarios can become UI-test duplicates |

**Thoughts:** TDD/BDD are practices, not architecture. Use where feedback loop helps — don't mandate 100% TDD for UI prototypes. Friction (tight coupling, no fixtures) is why TDD gets skipped — [Making tests easy](./7_special_engineering.md#making-tests-easy).

</details>

<details>
  <summary>GOF design patterns — catalog</summary>

### GOF design patterns — catalog

**Definition:**

Gang of Four (Gamma, Helm, Johnson, Vlissides) — 23 reusable OOP design patterns from *Design Patterns: Elements of Reusable Object-Oriented Software* (1994).

| Creational | Structural | Behavioral |
|------------|------------|------------|
| Factory Method | Adapter | Chain of Responsibility |
| Abstract Factory | Bridge | Command |
| Builder | Composite | Interpreter |
| Prototype | Decorator | Iterator |
| Singleton | Facade | Mediator |
| | Flyweight | Memento |
| | Proxy | Observer |
| | | State |
| | | Strategy |
| | | Template Method |
| | | Visitor |

**Thoughts:**

Patterns are vocabulary, not goals. "We need a Factory" is the wrong starting point — identify the problem first, then name the pattern. Deep JS/Doka notes: [7_special.md — Creational cheat sheet](./7_special_engineering.md#creational-patterns--cheat-sheet).

Doka’s frontend shortlist (not the full 23):

| Kind | Job | Names to know |
|------|-----|----------------|
| **Creational** | Create objects / families without duplication | Simple Factory (informal), Factory Method, Abstract Factory, Builder |
| **Structural** | Combine entities (“how to assemble a component”) | Adapter, Decorator, Facade, Proxy |
| **Behavioral** | Who does what, how they talk (“how to organize behavior”) | Chain of Responsibility, Strategy, Command, Observer |

Refactoring Guru: creational = creation mechanisms; structural = assemble objects/classes; behavioral = algorithms and responsibility. **Simple Factory** is a common name for a function that `switch`es on type — useful, but not a separate GoF pattern (Factory Method is). Shortlists: [structural](#structural-patterns--cheat-sheet) · [behavioral](#behavioral-patterns--cheat-sheet).

**Sources:** [Refactoring Guru — Catalog](https://refactoring.guru/design-patterns/catalog) · [Doka — Architecture and design patterns](https://doka.guide/tools/architecture-and-design-patterns/) · [ByteByteGo — OOP Design Patterns](https://blog.bytebytego.com/i/162154465/oop-design-patterns-you-must-know)

</details>

<details>
  <summary>Structural patterns — cheat sheet</summary>

<a name="structural-patterns--cheat-sheet"></a>

### Structural patterns — cheat sheet

**Definition:**

Structural patterns compose objects (“how to assemble a component”). Full JS notes: [7_special.md](./7_special_engineering.md#structural-patterns--cheat-sheet).

| Pattern | Job | Not this |
|---------|-----|----------|
| **Adapter** | Different interface / data shape → what the client already uses | Not adding logging |
| **Facade** | New *simple* API over a *subsystem* (many objects or steps) | Not wrapping one object to match a target type |
| **Decorator** | Same interface; *add* behavior; wrappers stack | Not changing the public contract |
| **Proxy** | Same interface; *control* access (lazy, protect, remote, cache) | Not primarily enriching the API |

**Thoughts:**

Translate / simplify / add / gate. JS `Proxy` is a trap mechanism — the GoF pattern is the *intent*.

```js
// Adapter: rename fields so the UI never depends on the server contract
const toUser = (row) => ({ id: row.ID, name: row.user_name });

// Facade: one call hides inventory + pay + persist
const placeOrder = async (items) => {
  const reserved = await inventory.reserve(items);
  const payment = await payments.charge(reserved.total);
  return orders.create({ items, payment });
};

// Decorator: wrap fn, keep the same call signature
const withLog = (fn) => (...a) => { console.log(a); return fn(...a); };

// Proxy: intercept reads; target object stays intact
const view = new Proxy(user, {
  get(t, k, r) { return k === 'ssn' ? undefined : Reflect.get(t, k, r); },
});
```

Adapter **maps**. Facade **orchestrates**. Decorator **wraps a function**. Proxy **intercepts property access**.

**Sources:** [Refactoring Guru — Adapter](https://refactoring.guru/design-patterns/adapter) · [MDN `Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

</details>

<details>
  <summary>Behavioral patterns — cheat sheet</summary>

### Behavioral patterns — cheat sheet

**Definition:**

Behavioral patterns answer “who does what, and how do they talk?” — they split **responsibility** and **communication**, not object creation or assembly.

| Pattern | One line | Swap in your head |
|---------|----------|-------------------|
| **Strategy** | Same job, different algorithm; pick (and swap) at runtime | Navigator: walk / bike / drive |
| **Chain of Responsibility** | Request walks handlers until **one** can handle it | Charge USD vs EUR vs RUB |
| **Command** | Action + data become an object you can queue, log, undo | Redux action `{ type, payload }` |
| **Observer** | Subject notifies whoever subscribed; list can change | Vacancy → matching applicants |

**How it works:**

- **Strategy vs CoR** — Strategy: caller *chooses* the algorithm. CoR: caller *does not know* who will handle; order of handlers decides.
- **CoR vs `switch`** — `switch` works when all cases are known and owned here (Redux reducers). CoR wins when handlers, order, or variants are unknown or plugged in later — the dispatcher does not import every handler.
- **CoR vs middleware** — Doka: middleware lets **every** link run (auth → log → handler). Canonical CoR: **one** handler consumes the request and stops. Refactoring Guru still treats middleware as CoR with inverted “always call `next()` unless you stop.”
- **Null Object** — same interface, does nothing. Use as `switch` `default` or chain terminator so callers skip `if (handler)`.
- **Command vs Observer** — Command is a *one-shot* encapsulated request (invoker → `execute`). Observer is *ongoing* subscription (`attach` / `detach` / `notify`).

| Use | Pattern |
|-----|---------|
| Algorithm may change while the app runs | Strategy |
| Unknown / plugin handlers; don’t couple dispatcher to all of them | CoR |
| Undo, queue, history, extra payload on an action | Command |
| Unknown how many listeners; subscription is temporary | Observer |

**Thoughts:** Name the *problem* (swap algorithm / pass until handled / reify an action / notify many). The pattern is vocabulary, not a class count.

**Sources:** [Doka — Behavioral patterns](https://doka.guide/tools/design-patterns-behaviorial/) · [Refactoring Guru — Catalog](https://refactoring.guru/design-patterns/catalog)

</details>

<details>
  <summary>Factory Method</summary>

### Factory Method

**Definition:** Define an interface for creating objects, but let subclasses decide which class to instantiate.

**When to use:** Object creation logic is complex or varies by context. Framework hooks (React creates component instances).

**Pluses and minuses:**

| + | − |
|------|------|
| Decouples creation from usage | More classes |
| Easy to add new product types | Overkill for simple creation |

**Examples:**

```ts
interface Dialog { render(): void; }
class WindowsDialog implements Dialog { render() { /* native */ } }
class WebDialog implements Dialog { render() { /* HTML */ } }

function createDialog(os: string): Dialog {
  return os === 'windows' ? new WindowsDialog() : new WebDialog();
}
```

**Thoughts:** A lone `createX(type)` with a `switch` is **Simple Factory** (idiom). Factory Method is when a *class* defers instantiation to subclasses (or an equivalent override).

</details>

<details>
  <summary>Abstract Factory</summary>

### Abstract Factory

**Definition:** Provide an interface for creating families of related objects without specifying concrete classes.

**When to use:** Cross-platform UI kits, themed component families (dark/light mode with matching button/input/dialog).

**Pluses and minuses:**

| + | − |
|------|------|
| Ensures compatible product families | Hard to add new product types |
| Swaps entire UI theme/platform | Many interfaces |

**Examples:** `UIFactory` creates `Button`, `Checkbox`, `TextField` — all Windows-style or all macOS-style.

</details>

<details>
  <summary>Builder</summary>

### Builder

**Definition:** Separate construction of a complex object from its representation, enabling step-by-step creation.

**When to use:** Objects with many optional fields (QueryBuilder, HTTP request builder, test data builders).

**Pluses and minuses:**

| + | − |
|------|------|
| Readable construction of complex objects | Verbose for simple objects |
| Immutable result | |
| Optional parameters without telescoping constructors | |

**Examples:**

```ts
const user = new UserBuilder()
  .setName('Ada')
  .setEmail('ada@example.com')
  .setRole('admin')
  .build();
```

</details>

<details>
  <summary>Singleton</summary>

### Singleton

**Definition:** Ensure a class has only one instance and provide global access to it.

**When to use:** Rarely. Database connection pool config, logger — prefer module-level exports in JS/TS.

**Pluses and minuses:**

| + | − |
|------|------|
| Controlled access to sole instance | Hidden global state — hard to test |
| Lazy initialization | Violates SRP |
| | Concurrency issues in multi-threaded env |

**Thoughts:** Singleton is often an anti-pattern in modern apps. In JS, `export const db = createPool()` is a module singleton — prefer that over class Singleton. Hard to mock in tests.

</details>

<details>
  <summary>Adapter</summary>

### Adapter

**Definition:** Convert the interface of a class into another interface clients expect — wrap incompatible APIs.

**How it works:** `WeatherAdapter.getForecast` is the method the app already wants; inside it calls `fetchXml` and converts. `serverToClientAdapter` does the same job for JSON field names. Neither changes the legacy API.

**When to use:** Third-party SDK with wrong interface, legacy API migration, normalizing different data formats.

**Pluses and minuses:**

| + | − |
|------|------|
| Integrate legacy/third-party without changing them | Extra indirection layer |
| Single Responsibility — conversion isolated | |

**Examples:**

```ts
// Legacy API returns XML; app expects JSON
class WeatherAdapter {
  constructor(private legacy: LegacyWeatherApi) {}
  async getForecast(city: string): Promise<Forecast> {
    const xml = await this.legacy.fetchXml(city);
    return parseXmlToForecast(xml);
  }
}

// Doka: snake_case array → camelCase string the app owns
function serverToClientAdapter(data: { some_data: string[] }) {
  return { someData: data.some_data.join(' ') };
}
```

**Thoughts:** Adapter changes **interface**; Decorator adds **behavior** on the same interface. Typical at API boundaries.

</details>

<details>
  <summary>Decorator</summary>

### Decorator

**Definition:** Attach additional responsibilities to an object dynamically without altering its structure.

**How it works:** `fetchWithLog('/users')` logs `GET /users`, then calls real `fetch`. Call site still looks like `fetch`. Stack more wrappers the same way.

**When to use:** Middleware, stream transforms, adding logging/caching/validation to services.

**Pluses and minuses:**

| + | − |
|------|------|
| Flexible alternative to subclassing | Many small wrapper objects |
| Compose behavior at runtime | Debugging through layers is harder |

**Examples:**

```ts
function withLogging(fn: FetchFn): FetchFn {
  return async (url) => {
    console.log(`GET ${url}`);
    return fn(url);
  };
}
const fetchWithLog = withLogging(fetch);
```

**Thoughts:** React HOCs and middleware (Express, Redux) are Decorator pattern. React hooks composition is a functional variant.

</details>

<details>
  <summary>Facade</summary>

### Facade

**Definition:** Provide a simplified interface to a complex subsystem.

**How it works:** Checkout code calls `placeOrder(items)` once. Reserve / charge / create stay inside the facade so screens do not orchestrate three services.

**When to use:** API client wrapping multiple endpoints, service layer over complex domain, `index.ts` public API of a module.

**Pluses and minuses:**

| + | − |
|------|------|
| Reduces coupling to subsystem | Can become a god-object if too much logic |
| Easier onboarding | |

**Examples:**

```ts
class OrderFacade {
  async placeOrder(items: Item[]): Promise<OrderId> {
    const inventory = await this.inventory.reserve(items);
    const payment = await this.payment.charge(inventory.total);
    return this.orders.create({ items, payment });
  }
}
```

</details>

<details>
  <summary>Proxy</summary>

### Proxy

**Definition:** Provide a surrogate or placeholder to control access to another object.

**How it works:** `safeUser.ssn` throws; `safeUser.name` still reads from `user`. The real object is unchanged — access is gated, not remapped to a new type.

**When to use:** Virtual proxy (lazy init), protection proxy (auth check), caching proxy (memoization), remote proxy (RPC stub).

**Pluses and minuses:**

| + | − |
|------|------|
| Lazy loading, access control, caching, logging | Extra indirection |
| Transparent to client | |

**Examples:**

```ts
const handler: ProxyHandler<User> = {
  get(target, prop) {
    if (prop === 'ssn') throw new Error('Access denied');
    return target[prop as keyof User];
  },
};
const safeUser = new Proxy(user, handler);
```

**Thoughts:** JS `Proxy` is native language support for the pattern. Vue 3 reactivity uses Proxy. Use `Reflect.get` when you need default `[[Get]]` + correct `receiver` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)).

</details>

<details>
  <summary>Strategy</summary>

### Strategy

**Definition:** Family of interchangeable algorithms behind one interface; a **context** holds the current strategy and delegates to it.

**When to use:** Several ways to do the same job — especially if the choice can change **while the program runs** (navigator: bike → walk).

**Pluses and minuses:**

| + | − |
|------|------|
| Swap the algorithm at runtime without rewriting the caller | Client (or UI) still picks *which* strategy |
| Context stays free of `if/else` per algorithm | Extra types if you over-abstract one variant |

**Examples:**

```ts
type RouteStrategy = { findRoute(from: Point, to: Point): Step[] };

class Navigator {
  constructor(private strategy: RouteStrategy) {}
  use(strategy: RouteStrategy) { this.strategy = strategy; }
  homeToWork() { return this.strategy.findRoute(home, work); }
}

const nav = new Navigator(cyclistRoute);
nav.use(pedestrianRoute); // same method, new algorithm
```

**Thoughts:** Context does not implement routes; it only calls `findRoute`. Opposite of stuffing walk/bike/drive into one giant function.

**Sources:** [Doka — Behavioral](https://doka.guide/tools/design-patterns-behaviorial/) · [Refactoring Guru — Strategy](https://refactoring.guru/design-patterns/strategy)

</details>

<details>
  <summary>Observer</summary>

### Observer

**Definition:** Subject keeps a list of observers and **notifies** them on change; observers can **subscribe / unsubscribe** without the subject knowing their concrete types in advance.

**When to use:** You don’t know who must update, and the subscription may be temporary (DOM events, store listeners, job-board applicants).

**Pluses and minuses:**

| + | − |
|------|------|
| Add/remove listeners without changing the publisher | Memory leaks if you never `unsubscribe` |
| Unknown count of listeners at write time | Notification order can matter |

**Examples:**

```ts
class HrAgency {
  private listeners: { update(role: string): void }[] = [];
  subscribe(o: { update(role: string): void }) { this.listeners.push(o); }
  notify(role: string) { this.listeners.forEach((o) => o.update(role)); }
}
```

**Thoughts:** Observer → Pub/Sub when a **broker** sits between publishers and subscribers (they don’t hold each other’s refs). React state / `EventTarget` are Observer-like.

**Sources:** [Doka — Behavioral](https://doka.guide/tools/design-patterns-behaviorial/) · [Refactoring Guru — Observer](https://refactoring.guru/design-patterns/observer)

</details>

<details>
  <summary>Mediator</summary>

### Mediator

**Definition:** Behavioral pattern — defines an object that **centralizes** how other objects interact, so components don't reference each other directly.

**How it works:**

- Colleagues send messages to **Mediator**, not to each other.
- Mediator routes messages, coordinates state, triggers side effects.
- Opposite of letting every component hold references to every other component.

| Pattern | Coupling | Mediator role |
|---------|----------|---------------|
| **Direct calls** | A knows B, C | None |
| **Mediator** | A knows only Mediator | In-process coordinator |
| **Pub/Sub** | Publisher knows broker only | Broker is often a Mediator + async transport |

Observer — subject holds list of observers and notifies directly. Mediator — colleagues are decoupled; only mediator knows the graph.

Mediator coordinates **in-process** communication. Saga coordinates **distributed transactions** across services with compensations.

**When to use:**

- Chat room / group messaging — users talk through room object.
- Air traffic control UI — many forms/dialogs coordinated by one controller.
- **NestJS** — `CommandBus`, `EventBus`, `QueryBus` (CQRS module).
- **Redux** — store mediates between actions and reducers (components don't call each other).

**Pluses and minuses:**

| + | − |
|------|------|
| Reduces tangled dependencies (N×N → N) | Mediator can become a god-object |
| Single place to change interaction rules | Extra indirection |
| Components stay focused on their job | |

**Examples:**

```ts
interface Mediator {
  notify(sender: object, event: string, payload?: unknown): void;
}

class ChatRoom implements Mediator {
  private users = new Map<string, User>();

  register(user: User) {
    this.users.set(user.name, user);
    user.setMediator(this);
  }

  notify(sender: User, event: string, payload?: unknown) {
    if (event === 'message') {
      for (const user of this.users.values()) {
        if (user !== sender) user.receive(payload as string);
      }
    }
  }
}
```

**Thoughts:** Use when many-to-many object communication creates spaghetti — centralize routing, keep endpoints dumb.

**Sources:** [Refactoring Guru — Mediator](https://refactoring.guru/design-patterns/mediator)

</details>

<details>
  <summary>Chain of Responsibility</summary>

### Chain of Responsibility

**Definition:** Pass a request along linked handlers until **one** handles it (or the chain ends). Each handler knows only `setNext` / `handle`, not the full set of siblings.

**When to use:** Handler set, order, or variants are **not all known** up front. If the set is closed and owned in one file, a `switch` is enough (higher coupling).

**Pluses and minuses:**

| + | − |
|------|------|
| Caller need not import every handler or know their order | Request can “fall off” the end |
| Plug in handlers without rewriting the dispatcher | Order and stop-vs-continue must be explicit |

**Examples:**

```ts
abstract class Handler {
  protected next?: Handler;
  setNext(h: Handler) { this.next = h; return h; }
  handle(currency: string, amount: number) {
    this.next?.handle(currency, amount) ?? console.log('No handler');
  }
}
class UsdHandler extends Handler {
  handle(currency: string, amount: number) {
    if (currency === 'USD') return console.log(`charged ${amount}$`);
    super.handle(currency, amount);
  }
}
// rub.setNext(usd).setNext(eur) — start from any link that is connected
```

**Thoughts:** **Null Object** = same interface, no-op — useful as `default` in a `switch`. **Middleware** usually lets *each* layer run (`next()`); Doka treats that as similar-but-not-the-same. Refactoring Guru: middleware is still CoR with inverted continue/stop.

**Sources:** [Doka — Behavioral](https://doka.guide/tools/design-patterns-behaviorial/) · [Refactoring Guru — Chain of Responsibility](https://refactoring.guru/design-patterns/chain-of-responsibility)

</details>

<details>
  <summary>Command</summary>

### Command

**Definition:** Turn an action (and the data it needs) into an object so you can delay, queue, log, or undo it — invoker calls `execute` without knowing the receiver’s internals.

**When to use:** Operation needs extra payload; buffer/queue/history of actions; **undo**.

**Pluses and minuses:**

| + | − |
|------|------|
| Undo / history / job queue | Extra types |
| Invoker decoupled from *how* work is done | Easy to over-command simple clicks |

**Examples:**

```ts
// Classic: command *is* the handler
const updateUser = { execute(payload: User) { /* mutate / API */ } };

// Common split (Redux / CQRS): data object + handler outside
const action = { type: 'UPDATE_USER', payload: { name: 'Alex' } };
function userReducer(state, action) {
  if (action.type === 'UPDATE_USER') return { ...state, ...action.payload };
  return state;
}
```

**Thoughts:** Redux **actions** are Command *data*; the reducer is the handler (not inside the action). Application-layer “use cases” often use `Command` + `CommandHandler`.

**Sources:** [Doka — Behavioral](https://doka.guide/tools/design-patterns-behaviorial/) · [Refactoring Guru — Command](https://refactoring.guru/design-patterns/command)

</details>

<details>
  <summary>State</summary>

### State

**Definition:** Allow an object to alter its behavior when its internal state changes — object appears to change its class.

**When to use:** Workflow engines, TCP connection states, media player (playing/paused/stopped), order lifecycle.

**Pluses and minuses:**

| + | − |
|------|------|
| Eliminates large conditionals | Many state classes |
| State transitions explicit | Overkill for few states |

**Examples:**

```ts
type OrderState = { submit(order: Order): void };
const draft: OrderState = {
  submit(order) { order.state = pending; order.notifyWarehouse(); },
};
const pending: OrderState = {
  submit() { throw new Error('Already submitted'); },
};
```

**Thoughts:**

State vs Strategy — State transitions are internal and often define valid next states. Strategy is chosen externally and interchangeable.

---

</details>

<a name="8-resources"></a>
