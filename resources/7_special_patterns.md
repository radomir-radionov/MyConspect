# Design patterns

GoF creational, structural, and behavioral patterns.

[← Back to hub](./0_system_design.md)

### Related docs

* [System design — Core](./0_system_design_core.md) · [System design — Architecture](./0_system_design_architecture.md) · [Architecture patterns](./7_special_architecture.md) · [System design — Data](./0_system_design_data.md) · [SOLID](./7_special_engineering.md) · [DRY, KISS, YAGNI](./0_system_design_principles.md) · [GRASP](./0_system_design_grasp.md) · [System design — Patterns](./0_system_design_patterns.md) · [Design patterns](./7_special_patterns.md) · [System design — Interview](./0_system_design_interview.md)

### Sections

- [10. Design patterns](#10-design-patterns)

---

<a name="10-design-patterns"></a>

## 10. Design patterns

<details>
  <summary>Design pattern (general)</summary>

### Design pattern (general)

**Definition:**

A reusable solution to a recurring design problem — not copy-paste code, but a structure and collaboration pattern.

| Category | Examples |
|----------|----------|
| **Creational** | Factory, Factory Method, Abstract Factory, Builder, Singleton, Prototype |
| **Structural** | Adapter, Decorator, Facade, Proxy |
| **Behavioral** | Chain of Responsibility, Observer, Strategy, Command, Iterator |

**When to use:** When problem matches catalog; name patterns in docs and reviews.

**Pluses and minuses:**

| + | − |
|------|------|
| Shared vocabulary | Over-application ("pattern fever") |
| Battle-tested structures | Can obscure simple code |

**Thoughts:** See full catalog and frontend grouping in [Patterns](./0_system_design_patterns.md#gof-design-patterns--catalog). Responsibility assignment (Expert, Creator, Controller): [GRASP](./0_system_design_grasp.md#grasp-principles). Creational shortlist: [cheat sheet](#creational-patterns--cheat-sheet). Structural shortlist: [cheat sheet](#structural-patterns--cheat-sheet). Behavioral shortlist: [Patterns](./0_system_design_patterns.md#behavioral-patterns--cheat-sheet). Patterns are not the goal of a PR.

**Sources:**

[refactoring.guru](https://refactoring.guru/design-patterns/catalog) · [Doka — Architecture and design patterns](https://doka.guide/tools/architecture-and-design-patterns/)

---

</details>

<details>
  <summary>Creational patterns — cheat sheet</summary>

<a name="creational-patterns--cheat-sheet"></a>

### Creational patterns — cheat sheet

**Definition:**

Creational patterns hide **how objects are born** — fields, defaults, extra data, which class to instantiate — so callers do not repeat construction and do not depend on concrete types.

Doka’s everyday four (not the full GoF list): **Factory** (simple), **Abstract Factory**, **Builder**, **Singleton**. GoF also has **Factory Method** and **Prototype**. Doka’s “factory” is the informal **simple factory** function — not Factory Method.

| Pattern | One line | Mental model |
|---------|----------|--------------|
| **Factory** (simple) | Function owns the recipe; caller passes intent (`createGuitar(6)`) | Guitar shop vs milling a neck |
| **Factory Method** | Creator subclasses override `createX()` — which *class* is born | Department.hire → Programmer vs Accountant |
| **Abstract Factory** | Interface that creates a **family** of related products | Orchestra reservation: instrument + musician, one API |
| **Builder** | Optional steps, then `build()`; chain returns `this` | Coffee: espresso + milk + sugar |
| **Singleton** | At most one instance; later `new` returns the first | One Sun — usually redesign instead |

**How it works:**

- **Factory vs Abstract Factory** — Factory returns **one** product. Abstract Factory is a factory of factories: same *operations*, different *families* (Violin+Violinist vs Cello+Cellist). Goal is dropping `instanceof` trees.
- **Factory vs Builder** — Factory: “give me a complete object, maybe with a couple of args.” Builder: many **optional steps**, order matters, avoid a constructor with ten booleans.
- **Simple Factory vs Factory Method** — `createX(type)` + `switch` is an idiom. Factory Method is when a *class* defers `new` to subclasses (Refactoring Guru).
- **Pattern Singleton vs DI “singleton”** — Pattern = restrict count. DI lifetime = reuse the same injected instance. Different jobs (Doka).

| Use | Pattern |
|-----|---------|
| Construction > 1–2 lines, or needs calc / extra data | Factory |
| Related products must stay compatible; client must not name classes | Abstract Factory |
| Many optional features; telescoping constructors | Builder |
| Domain truly allows only one (rare) | Singleton — prefer ESM `export const` |

```js
// Factory — recipe + a calculation. Call sites stay createGuitar(6) if fields change.
function createGuitar(stringsCount = 6, maxWeight = 5) {
  const fretBoardMaterial = maxWeight <= 5 ? 'fir' : 'cedar';
  return { stringsCount, fretsCount: 24, fretBoardMaterial };
}
createGuitar(6);
createGuitar(7, 8);
```

```js
// Abstract Factory — same two methods; violin vs cello family. reserve() never instanceofs.
const violinKit = {
  reserveInstrument: () => ({ play: (n) => `violin ${n}` }),
  notifyPlayer: () => ({ play: (piece) => piece.map((n) => `violin ${n}`) }),
};
const celloKit = {
  reserveInstrument: () => ({ play: (n) => `cello ${n}` }),
  notifyPlayer: () => ({ play: (piece) => piece.map((n) => `cello ${n}`) }),
};
function reserve(kit) {
  kit.notifyPlayer();
  return kit.reserveInstrument();
}
reserve(violinKit).play('A'); // 'violin A'
reserve(celloKit).play('A');  // 'cello A'
```

```js
// Builder — optional steps, then build(). addX returns this so you can chain.
class DrinkBuilder {
  settings = { base: 'espresso' };
  addMilk() { this.settings.milk = true; return this; }
  addSugar() { this.settings.sugar = true; return this; }
  build() { return { ...this.settings }; }
}
new DrinkBuilder().addMilk().build();           // { base: 'espresso', milk: true }
new DrinkBuilder().addSugar().addMilk().build();
```

```js
// Singleton — second new returns the first object. Prefer export const in real JS.
class Sun {
  static #instance = null;
  constructor() {
    if (Sun.#instance) return Sun.#instance;
    Sun.#instance = this;
  }
}
new Sun() === new Sun(); // true
// Idiomatic: export const sun = Object.freeze({ mass: 1.989e30 });
```

**See also:** [Factory](#factory--factory-method) · [Abstract Factory](#abstract-factory) · [Builder](#builder) · [Singleton](#singleton-caution) · [0_system_design.md catalog](./0_system_design_patterns.md#gof-design-patterns--catalog) · [JS OOP factory](./3_js_oop.md)

**Sources:**

[Doka — Creational patterns](https://doka.guide/tools/design-patterns-creational/) (Sasha Bespoyasov, updated 2024-02-29) · [Refactoring Guru — Catalog](https://refactoring.guru/design-patterns/catalog) · [Factory comparison](https://refactoring.guru/design-patterns/factory-comparison)

---

</details>

<details>
  <summary>Structural patterns — cheat sheet</summary>

<a name="structural-patterns--cheat-sheet"></a>

### Structural patterns — cheat sheet

**Definition:**

Structural patterns answer “how do we assemble a component so it can compose with others?” — they manage **object composition**, not creation (creational) or who talks to whom (behavioral).

| Pattern | One line | Mental model |
|---------|----------|--------------|
| **Adapter** | Translate incompatible API / data shape into what the client already expects | Travel plug |
| **Facade** | One simple method over many subsystem steps | “Heat water” vs 8 atomic machine calls |
| **Decorator** | Wrap to **add** behavior; keep the same interface | Phone + case; `debounce(fn)` |
| **Proxy** | Same interface; **gate** access (lazy, auth, cache, intercept) | Receptionist; JS `Proxy` |

**How they differ** (Refactoring Guru):

- **Adapter vs Decorator** — Adapter provides a *different* interface. Decorator keeps (or extends) the original and supports stacking wrappers.
- **Adapter vs Facade** — Adapter wraps *one* object to match a target interface. Facade gives a *new, simpler* interface over a *subsystem* (many objects / many calls).
- **Decorator vs Proxy** — both wrap and usually keep the same interface. Decorator *adds* responsibilities (log, retry, encrypt). Proxy *controls* access (lazy init, protection, remote stub, cache) and does not exist to enrich the public API.
- **JS `Proxy` vs the pattern** — `new Proxy(target, handler)` is a language tool that intercepts operations (`get`, `set`, …). You can implement a GoF Proxy *or* a Decorator with it. Vue 3 reactivity uses `Proxy`.

**How it works:**

| Use | Pattern |
|-----|---------|
| Server `snake_case` / nested payload ≠ app `camelCase` DTOs | Adapter |
| Hexagonal / ports: Prisma, Stripe, Express live in the outer **adapter** layer | Adapter |
| Same multi-step SDK dance copied in several places | Facade |
| Cross-cutting extras: log, metrics, cache, `throttle` / `debounce` | Decorator |
| Check / delay / deny before the real object (auth, lazy, DOM insert guard) | Proxy |

```js
// Adapter — foreign shape → our shape. Callers never see snake_case.
function toUser(dto) {
  return { id: dto.ID, name: dto.user_name };
}
toUser({ ID: '1', user_name: 'Ada' }); // { id: '1', name: 'Ada' }
```

```js
// Facade — one function runs several subsystem steps. UI calls brew(), not 4 SDK methods.
function brew(machine) {
  machine.grind();
  machine.heat();
  machine.pour();
  return machine.cup();
}
```

```js
// Decorator — same function, extra behavior before/after. update itself stays clean.
const withLog = (fn) => (...args) => {
  console.log('call', args);
  return fn(...args);
};
const save = (user) => { /* write */ };
const saveLogged = withLog(save);
saveLogged({ id: 1 }); // logs, then save
```

```js
// Proxy — same property names; trap decides what happens. original.secret stays readable.
const user = { name: 'Ada', secret: 'x' };
const gate = new Proxy(user, {
  get(t, key, r) {
    if (key === 'secret') return undefined;
    return Reflect.get(t, key, r);
  },
});
gate.name;   // 'Ada'
gate.secret; // undefined
```

**Thoughts:** Adapter **translates**. Facade **simplifies**. Decorator **adds**. Proxy **gates**.

**See also:** [Adapter](#adapter) · [Facade](#facade) · [Decorator](#decorator) · [Proxy](#proxy) · [JS `Proxy`](./3_js_core.md#proxy-and-reflect) · [Hexagonal adapters](./0_system_design_architecture.md#clean-architecture--hexagonal)

**Sources:**

[Refactoring Guru — Adapter relations](https://refactoring.guru/design-patterns/adapter) · [Decorator](https://refactoring.guru/design-patterns/decorator) · [Facade](https://refactoring.guru/design-patterns/facade) · [Proxy](https://refactoring.guru/design-patterns/proxy) · [MDN `Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

---

</details>

<details>
  <summary>Observer</summary>

### Observer

**Definition:** Subject notifies observers on state change — one-to-many dependency.

**When to use:** DOM events, Redux subscriptions, pub/sub, `EventEmitter`.

**Pluses and minuses:**

| + | − |
|------|------|
| Loose coupling | Order of notification matters |
| Event-driven UIs | Memory leaks if unsubscribe forgotten |

**Examples:**

```js
class Store {
  #listeners = new Set();
  subscribe(fn) { this.#listeners.add(fn); return () => this.#listeners.delete(fn); }
  notify(data) { this.#listeners.forEach(fn => fn(data)); }
}
```

**Thoughts:**

React's `useEffect` cleanup is observer unsubscribe.

---

</details>

<details>
  <summary>Factory / Factory Method</summary>

<a name="factory--factory-method"></a>

### Factory / Factory Method

**Definition:** Encapsulate object creation so the caller does not know field names, defaults, extra lookups, or whether the result is a plain object or `new Class()`.

**How it works:**

A **simple factory** is a function that returns same-shaped objects (`createGuitar(6)`, `createSpending(amount)`). **Factory Method** (GoF) defers `new` to a subclass. Both keep construction rules in one place — if the product schema changes, only the factory changes.

Doka: use a factory when creation is more than 1–2 lines, especially if you **compute** something first (fretboard wood from max weight). Call sites stay `createGuitar(6)` even if you later return `new Guitar(...)`.

**When to use:**

Construction logic / defaults / validation; many similar objects; `createParser('json')`; test doubles. Skip for `{ id }` literals.

#### Common pitfalls

Wrapping every object in a factory (“pattern fever”). Confusing simple factory with Factory Method / Abstract Factory.

**Pluses and minuses:**

| + | − |
|------|------|
| Hides construction complexity | Extra indirection |
| Centralizes defaults (e.g. `dateTime: Date.now()`) | Over-factorying simple DTOs |
| Fewer typos than duplicating object literals | No `instanceof` unless you share a prototype/`class` |

**Examples:**

```js
// 1) Construction logic — Doka: compute a field, hide the rest of the recipe
function createGuitar(stringsCount = 6, maxWeight = 5) {
  const fretBoardMaterial = maxWeight <= 5 ? 'fir' : 'cedar';
  return { stringsCount, fretsCount: 24, fretBoardMaterial, boardMaterial: 'maple' };
}
createGuitar(6);     // light guitar → fir
createGuitar(7, 9);  // heavy → cedar
```

```js
// 2) Many similar objects — defaults (timestamp, kind) in one place
function createSpending(amount) {
  return { amount, dateTime: Date.now(), kind: 'spending' };
}
const spending1 = createSpending(250);
const spending2 = createSpending(100);
```

```js
// 3) Pick implementation by type — simple factory (not Factory Method)
function createParser(kind) {
  if (kind === 'json') return (text) => JSON.parse(text);
  if (kind === 'csv') return (text) => text.split(',').map((s) => s.trim());
  throw new Error(`Unknown parser: ${kind}`);
}
createParser('json')('{"a":1}'); // { a: 1 }
createParser('csv')('a, b');     // ['a', 'b']
```

```js
// 4) Test double — same factory, fake in tests
function createLogger(env) {
  if (env === 'test') return { info: () => {} };
  return { info: (msg) => console.log(msg) };
}
createLogger('prod').info('up');
createLogger('test').info('silent');
```

```js
// 5) Factory Method (GoF) — subclass decides which class is born
class Department {
  hire(id) {
    const employee = this.createEmployee(id);
    employee.start();
    return employee;
  }
  createEmployee(id) { throw new Error('override me'); }
}
class ITDepartment extends Department {
  createEmployee(id) {
    return { id, role: 'programmer', start() {} };
  }
}
class AccountingDepartment extends Department {
  createEmployee(id) {
    return { id, role: 'accountant', start() {} };
  }
}
new ITDepartment().hire(1).role;          // 'programmer'
new AccountingDepartment().hire(2).role; // 'accountant'
```

**Thoughts:**

Factories are enough for small objects. Grow into a `class` when you need `this` or methods that must stay on the entity. See [3_js_oop.md — factory](./3_js_oop.md).

Knowledge of *how* to build lives in one function.

**Sources:**

[Doka — Creational patterns](https://doka.guide/tools/design-patterns-creational/) · [Doka — OOP](https://doka.guide/tools/oop/) · [Refactoring Guru — Factory comparison](https://refactoring.guru/design-patterns/factory-comparison)

---

</details>

<details>
  <summary>Abstract Factory</summary>

<a name="abstract-factory"></a>

### Abstract Factory

**Definition:** An interface for creating a **family** of related products without naming concrete classes — “a factory of factories.” It returns abstractions (`Instrument`, `Musician`), not one hardcoded type.

**How it works:**

Shared contract (`ReservationFactory { reserveInstrument(); notifyPlayer(); }`). Each family (violin, cello) implements that contract. Client `reserve(factory)` never `instanceof`s. Add a viola → new class, not a new branch in `reserve()`.

Refactoring Guru: one factory produces matching products (Windows button + Windows checkbox). Harder to add a *new product type* (every factory gains a method).

**When to use:**

Related-but-not-identical objects with the same creation steps (reserve + notify; themed UI kits).

#### Common pitfalls

Union types + `instanceof` instead of a shared factory interface — fragile when the orchestra grows.

**Pluses and minuses:**

| + | − |
|------|------|
| Compatible product families | Many interfaces / classes |
| Client code stays on abstractions | Adding a new product kind touches all factories |
| No `instanceof` trees | Overkill for one product type |

**Examples:**

```js
// 1) Orchestra family — same API, different products. Client has no instanceof.
class Violin {
  playNote(note) { return `violin ${note}`; }
}
class Cello {
  playNote(note) { return `cello ${note}`; }
}
class Violinist {
  instrument = new Violin();
  play(piece) { return piece.map((n) => this.instrument.playNote(n)); }
}
class Cellist {
  instrument = new Cello();
  play(piece) { return piece.map((n) => this.instrument.playNote(n)); }
}

class ViolinReservation {
  reserveInstrument() { return new Violin(); }
  notifyPlayer() { return new Violinist(); }
}
class CelloReservation {
  reserveInstrument() { return new Cello(); }
  notifyPlayer() { return new Cellist(); }
}

function reserve(factory) {
  const player = factory.notifyPlayer();
  factory.reserveInstrument();
  return player;
}
reserve(new ViolinReservation()).play(['A', 'C']); // ['violin A', 'violin C']
reserve(new CelloReservation()).play(['A', 'C']);  // ['cello A', 'cello C']
```

```js
// 2) Themed UI kit — button + input stay in the same family (dark vs light)
const lightUi = {
  button: (label) => ({ kind: 'button', theme: 'light', label }),
  input: (name) => ({ kind: 'input', theme: 'light', name }),
};
const darkUi = {
  button: (label) => ({ kind: 'button', theme: 'dark', label }),
  input: (name) => ({ kind: 'input', theme: 'dark', name }),
};

function loginForm(ui) {
  return { submit: ui.button('Log in'), email: ui.input('email') };
}
loginForm(lightUi).submit.theme; // 'light'
loginForm(darkUi).email.theme;   // 'dark'
```

**Thoughts:** You create *types of products*, not `new Violin()` in the client.

**Sources:**

[Doka — Creational patterns](https://doka.guide/tools/design-patterns-creational/) · [Refactoring Guru — Abstract Factory](https://refactoring.guru/design-patterns/abstract-factory)

---

</details>

<details>
  <summary>Builder</summary>

<a name="builder"></a>

### Builder

**Definition:** Construct a complex object **step by step**, with optional parts, then `build()`. Same construction process can yield different representations.

**How it works:**

Builder holds settings. Each `addX()` / `setX()` mutates and **returns `this`** (fluent chain). `build()` produces the product. Refactoring Guru: kills **telescoping constructors** (`Pizza(size)`, `Pizza(size, cheese)`, `Pizza(size, cheese, pepperoni)`…). Director (optional) runs a fixed sequence of steps.

Unlike other creational patterns, Builder can produce products that **do not share** one interface (Car vs Manual from the same steps).

**When to use:**

Many optional ingredients/fields (coffee drink, HTTP request, query, test data). Process splits into named steps.

#### Common pitfalls

Builder when a factory with two args is enough. Forgetting `return this` breaks chaining.

**Pluses and minuses:**

| + | − |
|------|------|
| Readable optional configuration | Verbose for 2-field objects |
| Avoids boolean-flag constructors | Mutable builder if reused without `reset()` |
| Same steps, different products | |

**Examples:**

```js
// 1) Coffee drink — optional ingredients, fluent chain (Doka)
class DrinkBuilder {
  settings = { base: 'espresso' };
  addMilk() { this.settings.milk = true; return this; }
  addSugar() { this.settings.sugar = true; return this; }
  addCream() { this.settings.cream = true; return this; }
  build() { return { ...this.settings }; }
}
const latte = new DrinkBuilder().addMilk().build();
const extra = new DrinkBuilder().addSugar().addCream().build();
```

```js
// 2) HTTP request — skip unused options instead of fetch(url, { method, headers, body, … })
class RequestBuilder {
  #url = '';
  #init = { method: 'GET', headers: {} };
  url(value) { this.#url = value; return this; }
  method(value) { this.#init.method = value; return this; }
  header(key, value) { this.#init.headers[key] = value; return this; }
  json(body) {
    this.#init.body = JSON.stringify(body);
    return this.header('Content-Type', 'application/json').method('POST');
  }
  build() { return { url: this.#url, ...this.#init }; }
}
new RequestBuilder().url('/api/users').json({ name: 'Ada' }).build();
// { url: '/api/users', method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"name":"Ada"}' }
```

```js
// 3) Query / test data — named steps, no telescoping constructor
class UserBuilder {
  #user = { name: 'anon', role: 'user', active: true };
  name(value) { this.#user.name = value; return this; }
  admin() { this.#user.role = 'admin'; return this; }
  inactive() { this.#user.active = false; return this; }
  build() { return { ...this.#user }; }
}
new UserBuilder().name('Ada').admin().build();
// { name: 'Ada', role: 'admin', active: true }
```

**Thoughts:** Steps first, object last — `build()` is the only `new`.

**Sources:**

[Doka — Creational patterns](https://doka.guide/tools/design-patterns-creational/) · [Refactoring Guru — Builder](https://refactoring.guru/design-patterns/builder)

---

</details>

<details>
  <summary>Strategy</summary>

### Strategy

**Definition:** Family of interchangeable algorithms behind one interface.

**When to use:** Sort comparators, pricing rules, validation strategies, payment methods.

**Pluses and minuses:**

| + | − |
|------|------|
| Runtime algorithm swap | More classes/functions |
| OCP-friendly | |

**Examples:**

```js
const strategies = {
  stripe: (amount) => chargeStripe(amount),
  paypal: (amount) => chargePayPal(amount),
};
strategies[provider](total);
```

---

</details>

<details>
  <summary>Singleton (caution)</summary>

<a name="singleton-caution"></a>

### Singleton (caution)

**Definition:** Creational pattern ensuring **only one instance** exists; a later create-attempt returns the existing object. Provides a global access point.

**How it works:**

- Typical class form: static private `#instance`; constructor returns existing instance (Doka `Sun`) or private ctor + `getInstance()`.
- In JS, **module scope** (`export const db = createPool()`) naturally gives one instance per process — idiomatic singleton without ceremony.
- Risk: hidden global mutable state shared across tests and requests. Refactoring Guru: same drawbacks as globals — less modular, unit tests need the singleton present.

Doka: may violate **open/closed**, raise coupling — sometimes treated as an antipattern. Prefer a design that does not need it.

Pattern Singleton (limit count) vs DI **singleton lifetime** (same instance injected into dependents). Different mechanisms (Doka).

**When to use:** Rarely in frontend — prefer module scope or DI container. Server: DB pool, config, logger. **Avoid** business-logic singletons with mutable session state. Domain “only one Sun” is the textbook yes — still think twice.

**Pluses and minuses:**

| + | − |
|------|------|
| Controlled global access point | Hidden global state — hard to test |
| Lazy init saves resources | Tight coupling to concrete instance |
| One connection pool / config object | Concurrency issues in multi-threaded envs (Java) |
| | Violates DIP if callers can't inject alternatives |

**Examples:**

```js
// 1) Domain uniqueness — Doka Sun: later new returns the same object
class Sun {
  static #instance = null;
  constructor() {
    if (Sun.#instance) return Sun.#instance;
    Sun.#instance = this;
  }
}
const a = new Sun();
const b = new Sun();
a === b; // true
```

```js
// 2) Idiomatic JS — one module export per process (config / logger / pool)
// config.js
export const config = Object.freeze({ apiUrl: process.env.API_URL ?? '/api' });
// importers share the same binding — no class Singleton needed
```

```js
// 3) Logger registry — one shared object; still prefer injecting it in tests
class Logger {
  static #instance = null;
  #lines = [];
  constructor() {
    if (Logger.#instance) return Logger.#instance;
    Logger.#instance = this;
  }
  info(msg) { this.#lines.push(msg); }
  dump() { return this.#lines.slice(); }
}
new Logger().info('boot');
new Logger().dump(); // ['boot'] — same instance
```

```js
// 4) Not the same as DI singleton — container reuses one instance when injecting
function createApp({ logger = new Logger() } = {}) {
  return { log: (msg) => logger.info(msg) };
}
const logger = new Logger();
const appA = createApp({ logger });
const appB = createApp({ logger });
// both apps share logger because we passed it — not because of a global getInstance()
```

**Thoughts:**

GoF class Singleton is often an **anti-pattern** in tests — inject dependencies instead. Interview: testability is the main objection.

One instance is a last resort, not a default.

**Sources:**

[Doka — Creational patterns](https://doka.guide/tools/design-patterns-creational/) · [Refactoring Guru — Singleton](https://refactoring.guru/design-patterns/singleton)

---

</details>

<details>
  <summary>Facade</summary>

<a name="facade"></a>

### Facade

**Definition:** Structural pattern providing a **simplified interface** over a complex subsystem — one entry point hides many internal classes/APIs.

**How it works:**

- Client calls `facade.doThing()` instead of orchestrating `auth()`, `retry()`, `parse()`, `cache()` itself.
- Facade **delegates** to subsystem components — it doesn't duplicate their logic.
- Can wrap legacy APIs, third-party SDKs, or microservice calls behind one stable contract.
- Risk: facade grows into a god object if it accumulates business logic instead of delegating.

Callers write `getUser('42')` or `heatWater(machine)` instead of repeating token refresh + fetch + parse, or `turnOn` / `getWater` / heater steps. The facade **owns the sequence**; the coffee machine / HTTP stack stay dumb.

**When to use:** `apiClient.getUser()` wrapping auth refresh + fetch + retry + JSON parse; `paymentService.charge()` over Stripe; a coffee-machine `heatWater()` over `turnOn` / `getWater` / `turnOnHeater`; React hooks that bundle several context reads.

**Pluses and minuses:**

| + | − |
|------|------|
| Easier API for consumers | Can become god facade if logic creeps in |
| Hides legacy or complex internals | Extra layer to maintain |
| Stable public surface while subsystem refactors | May hide needed low-level control |

**Examples:**

```js
// Facade over fetch + auth + error handling
export async function getUser(id) {
  const token = await auth.refreshIfNeeded();
  const res = await fetch(`/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new ApiError(res.status);
  return res.json();
}

const user = await getUser('42');

// Same idea: many atomic SDK calls → one use case
function heatWater(machine) {
  machine.turnOn();
  while (machine.getWaterLevel() < 1000) machine.getWater();
  machine.turnOnHeater();
  if (machine.getTemperature() >= 90) machine.turnOffHeater();
}
```

**Thoughts:** Facade ≠ Adapter (changes interface to match client) or Proxy (controls access). Facade simplifies **many** calls into **one**. It can make an awkward API usable, but that is a side effect — the job is encapsulation of a repeated workflow. Don't let it become a god object.

**Sources:**

[refactoring.guru — Facade](https://refactoring.guru/design-patterns/facade)

---

</details>

<details>
  <summary>Adapter</summary>

<a name="adapter"></a>

### Adapter

**Definition:** Structural pattern that converts one interface into another **expected by the client** — wraps incompatible API so existing code works without changes.

**How it works:**

- **Target** — interface the client expects.
- **Adaptee** — legacy or third-party API with different shape.
- **Adapter** — translates calls: `target.method()` → `adaptee.oldMethod()` with arg/response mapping.
- Object adapter (composition) vs class adapter (inheritance) — composition preferred in JS.

`fakeAPI()` is the adaptee (nested `entries`, `user_name`, `ID`). `responseToWantedAdapter` is the only place that knows that mapping. The rest of the app receives `{ userName, email, id }[]` — if the server renames a field, you change the adapter, not every screen.

**When to use:** Server JSON uses `user_name` / `ID` while the UI wants `camelCase`; wrap old REST when migrating to GraphQL; adapt Node `fs` callbacks to Promises; normalize payment providers to `PaymentResult`; `axios` adapter for `fetch`-shaped code.

**Pluses and minuses:**

| + | − |
|------|------|
| Reuse existing code with new interfaces | Thin adapters can pile up |
| Integrate third-party SDKs cleanly | Mapping layer may lag API updates |
| Isolate legacy from modern modules | Extra indirection |

**Examples:**

```js
function fakeAPI() {
  return {
    entries: [
      { user_name: 'Ada', email_address: 'a@x.com', ID: '1' },
    ],
  };
}

function responseToWantedAdapter(response) {
  return response.entries.map((entry) => ({
    userName: entry.user_name,
    email: entry.email_address,
    id: entry.ID,
  }));
}

const compatible = responseToWantedAdapter(fakeAPI());
// [{ userName: 'Ada', email: 'a@x.com', id: '1' }]
```

**Thoughts:** Adapter changes **interface**; Decorator adds **behavior** on the same interface. In Clean/Hexagonal architecture, adapters occupy the outer layer (DB, HTTP, UI) so the domain never depends on third-party shapes.

**Sources:**

[refactoring.guru — Adapter](https://refactoring.guru/design-patterns/adapter)

---

</details>

<details>
  <summary>Decorator</summary>

<a name="decorator"></a>

### Decorator

**Definition:** Structural pattern that **wraps** an object to add behavior dynamically without subclassing — same interface, enhanced functionality.

**How it works:**

- Decorator implements the same interface as the wrapped object.
- Delegates to inner object, adding logic before/after (logging, caching, auth).
- Stack multiple decorators: `withAuth(withCache(withRetry(api)))`.
- In React: **Higher-Order Components (HOCs)** and wrapper components are decorator-like.

`loggingDecorator` is a HOF: it takes `update` and returns `wrapped`. `wrapped` logs, then calls the original with the same args. You did **not** edit `update`. You can stack more wrappers (`debounce(loggingDecorator(update))`) the same way.

**When to use:** Logging/metrics middleware; `memoize()`; React HOC `withAuth(Component)`; Express/Redux middleware; caching on repositories; **`throttle` / `debounce`** as function wrappers ([JS Functions](./3_js_functions.md)).

**Pluses and minuses:**

| + | − |
|------|------|
| Open/closed — extend without modifying original | Many wrappers → hard to trace call stack |
| Compose behavior at runtime | Order of decorators matters |
| Alternative to deep inheritance trees | Can obscure what's actually running |

**Examples:**

```js
function loggingDecorator(fn) {
  return function wrapped(...args) {
    console.log(`log: ${args.join(', ')}`);
    return fn(...args);
  };
}

const user = { name: 'Ada', email: 'a@x.com' };
function update(name, email) {
  user.name = name;
  user.email = email;
}

const updateWithLogging = loggingDecorator(update);
updateWithLogging('Maria', 'm@x.com');
// console: "log: Maria, m@x.com" — then user becomes { name: 'Maria', email: 'm@x.com' }
```

**Thoughts:** TypeScript `experimentalDecorators` / stage-3 decorators formalize this for classes — the *pattern* is older and works as a HOF in JS. Decorator vs Proxy: decorator is an explicit wrapper that *adds* behavior; a GoF Proxy *gates* the original. Stacking (`EncryptionDecorator(CompressionDecorator(file))`) is the GoF picture.

**Sources:**

[refactoring.guru — Decorator](https://refactoring.guru/design-patterns/decorator)

---

</details>

<details>
  <summary>Proxy</summary>

<a name="proxy"></a>

### Proxy

**Definition:** Structural pattern that provides a **surrogate** with the **same interface** as the real object, so the client talks to the proxy and the proxy decides when (and whether) to reach the original.

**How it works:**

- Client depends on the target interface; the proxy forwards, delays, caches, or denies.
- Common kinds: **virtual** (lazy create), **protection** (auth), **remote** (RPC stub), **caching**.
- In JS, `new Proxy(target, handler)` intercepts operations via traps. `handler.get(target, property, receiver)` runs on `proxy.foo`. Use `Reflect.get(target, property, receiver)` for default `[[Get]]` behavior (MDN).
- Original object can stay untouched; only the proxy is “weird.”

Reads go through `get`. The trap blocks `ssn` on the **proxy only**. `Reflect.get` is the default `[[Get]]` (MDN) so other fields still come from `original`. That is a **protection proxy**: same keys, gated access — not a new DTO (adapter) and not extra logging wrapped around a function (decorator).

**When to use:** Hide `ssn` on a user object; lazy-init a heavy module; cache `getUser`; check conditions before inserting a DOM node; Vue reactivity.

**Pluses and minuses:**

| + | − |
|------|------|
| Lazy load, access control, cache, logging without changing the real object | Extra hop; debugging through traps is harder |
| Transparent to callers that already use the target API | `Proxy` traps have invariants (e.g. non-writable data props) |
| Native `Proxy` is how Vue 3 tracks reads | Overhead on hot paths |

**Examples:**

```js
const original = { name: 'Maria', email: 'hi@site.com', ssn: '000' };

const proxied = new Proxy(original, {
  get(target, prop, receiver) {
    if (prop === 'ssn') throw new Error('Access denied');
    console.log(`get ${String(prop)}`);
    return Reflect.get(target, prop, receiver);
  },
});

proxied.name;  // logs "get name", then 'Maria'
proxied.ssn;   // throws 'Access denied'
original.ssn;  // still '000' — the real object is not mutated
```

**Thoughts:** A GoF Proxy does not exist to *change the product’s public behavior* the way a Decorator does — it *mediates*. The article-style demo that returns `'YOU HAVE BEEN PWND!'` for every field is interception, not a typical production proxy. Language `Proxy` ≠ always the design pattern.

**Sources:**

[refactoring.guru — Proxy](https://refactoring.guru/design-patterns/proxy) · [MDN `Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) · [MDN `handler.get`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/get)

---

</details>

<details>
  <summary>Repository</summary>

### Repository

**Definition:** Pattern that **mediates between domain logic and data mapping** — collection-like interface for domain objects, hiding persistence details (SQL, ORM, API).

**How it works:**

- Domain/service code calls `userRepo.findById(id)` — not raw SQL or Prisma directly.
- Repository implements CRUD + domain queries (`findByEmail`, `save`).
- Swappable backends: Postgres repo, in-memory repo for tests, mock API repo.
- Often one repository per aggregate root (User, Order).

**When to use:** Service layer in backend; frontend data access modules (`userApi` with consistent interface); testing business rules without database; Prisma/TypeORM repository wrappers.

**Pluses and minuses:**

| + | − |
|------|------|
| Testable domain logic with in-memory fakes | Extra abstraction over ORM |
| Centralized query logic | Generic repos become god objects |
| Persistence technology can change | Mapping entity ↔ DB row overhead |

**Examples:**

```ts
type User = { id: string; email: string };
type UserRepository = {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
};

class InMemoryUserRepo implements UserRepository {
  #store = new Map<string, User>();
  async findById(id) { return this.#store.get(id) ?? null; }
  async save(user) { this.#store.set(user.id, user); }
}

async function inviteUser(email: string, repo: UserRepository) {
  const existing = await repo.findById(email); // domain doesn't know storage
  if (existing) throw new Error('Already exists');
  await repo.save({ id: crypto.randomUUID(), email });
}
```

**Thoughts:** Pairs with DIP. Don't wrap every ORM call blindly — repository shines when domain logic is rich and persistence varies (tests, caching layer, multiple sources).

**Sources:**

[refactoring.guru — Repository](https://refactoring.guru/design-patterns/repository)

---

</details>
