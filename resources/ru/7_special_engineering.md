# OOP & SOLID

OOP pillars and the five SOLID principles for modules and APIs.

[← Back to hub](./0_system_design.md)

### Related docs

- [System design — Core](./0_system_design_core.md) · [System design — Architecture](./0_system_design_architecture.md) · [Architecture patterns](./7_special_architecture.md) · [System design — Data](./0_system_design_data.md) · [SOLID](./7_special_engineering.md) · [DRY, KISS, YAGNI](./0_system_design_principles.md) · [GRASP](./0_system_design_grasp.md) · [Design patterns](./7_special_patterns.md) · [System design — Interview](./0_system_design_interview.md) · [JS OOP](./3_js_oop.md)

### Sections

- [9. OOP & SOLID](#9-oop-and-solid)

## 9. OOP & SOLID

<details>
  <summary>Object-Oriented Programming (OOP)</summary>

### Object-Oriented Programming (OOP)

**Definition:** OOP models programs as **objects** — instances of a **class** (blueprint). Each object holds fields and methods described once on the class.

**How it works:**

| Pillar            | Meaning                                                                     |
| ----------------- | --------------------------------------------------------------------------- |
| **Abstraction**   | Keep the characteristics that describe behavior; omit internals             |
| **Encapsulation** | Keep data next to the object that uses it; hide the rest                    |
| **Polymorphism**  | One interface, many types                                                   |
| **Inheritance**   | Take properties from a parent — prefer **composition** when “is-a” is messy |

ООП: класс = чертёж, объект = экземпляр. Столпы: абстракция, инкапсуляция, полиморфизм, наследование. Чайник с таймером — композиция, не двойное наследование. Общая память + два писателя = гонки. Код — карта бизнес-логики.

**When to use:** Rich domain models, UI component trees, SDKs with clear type hierarchies. Teapot-with-timer: inherit from teapot _or_ timer? Prefer **composition** (has a kettle + has a timer).

**Pluses and minuses:**

| +                                                                 | −                                                                   |
| ----------------------------------------------------------------- | ------------------------------------------------------------------- |
| Modeling: components as objects; relations are easier to pin down | Shared mutable data + several writers → races (not unique to OOP)   |
| Enterprise modeling (UML, ER, DFD) grew around objects            | Simple inheritance rarely matches real “has both” objects           |
| Well-studied: books, known failure modes                          | Encapsulation can block sharing; concurrent edits need extra design |

**Examples:**

```js
class User {
  constructor(name) {
    this.name = name;
    this.admin = false;
  }
  isAdmin() {
    return this.admin;
  }
  nameOf() {
    return this.name;
  }
}

const user = new User("Alex");
user.isAdmin(); // false
user.nameOf(); // 'Alex'
```

**Thoughts:**

In JS, `class` desugars to prototypes. Concurrent edits (two users, one Google Doc) need OT/CRDT or locks — encapsulation does not solve shared writes. See [3_js_oop.md](./3_js_oop.md).

Good code is a **map of the territory**: business rules, entity relations, and change axes. When the map drifts from reality, the code becomes fragile. OOP is one way to keep entities and messages aligned with that map.

**Sources:**

[Doka — OOP](https://doka.guide/tools/oop/) · [Doka — programming paradigms](https://doka.guide/tools/programming-paradigms/) · [MDN Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

---

</details>

<details>
  <summary>Encapsulation</summary>

### Encapsulation

**Definition:** Keep knowledge about an entity **inside** that entity (or its module). Outside code talks through a small API; internals stay hidden.

**How it works:**

- Data + the operations that know how to change it live together. History knows how to add a record — callers do not `history.records.push(...)`.
- If History were a bare array, _how to add_ would leak into every caller. Change storage later → rewrite the app.
- Related work in one module = **high cohesion**. Uncontrolled access from outside = low encapsulation.
- JS: hide with `#` fields, closures, or module scope. `this` lets the same method update _this_ instance when several Histories exist.

Инкапсуляция — знание о сущности внутри неё. История сама знает, как добавить запись. `this` — «свой» объект, когда историй несколько.

**When to use:** Domain objects; any type with more than one instance (`this` vs a captured outer variable). Always prefer methods over poking public arrays/maps.

**Pluses and minuses:**

| +                                         | −                                          |
| ----------------------------------------- | ------------------------------------------ |
| One place to change storage or rules      | Over-private APIs hinder testing           |
| Callers stay stable when internals change | Getters/setters can leak the model         |
| Prevents accidental mutation              | Easy to wrap every field and call it "OOP" |

**Examples:**

```js
// Knowledge leaked — every caller must know the structure
function addRecord(history, record) {
  history.push(record);
}

class History {
  records = [];
  addRecord(record) {
    this.records.push(record); // this instance, not a captured outer `history`
  }
}

const history1 = new History();
const history2 = new History();
history1.addRecord({ amount: 100, dateTime: Date.now() });
```

**Thoughts:** `public` fields in TS/JS are convention-only unless `#` or closures enforce privacy. Chrome DevTools can read `#` fields in the console for debugging — that is **not** app-code access. See [3_js_oop.md — private fields](./3_js_oop.md).

**Sources:**

[Doka — OOP](https://doka.guide/tools/oop/) · [MDN — private elements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements)

---

</details>

<details>
  <summary>Inheritance</summary>

### Inheritance

**Definition:** A class (subclass) acquires properties and methods from a parent (superclass), enabling code reuse and specialization.

**How it works:**

Наследование = «является». Если «и чайник, и таймер» — лучше _имеет_ (композиция), а не два родителя.

---

**When to use:** True "is-a" relationships with stable base behavior. Prefer shallow hierarchies (≤2 levels).

**Pluses and minuses:**

| +                       | −                                                   |
| ----------------------- | --------------------------------------------------- |
| DRY for shared behavior | Tight coupling to parent implementation             |
| Natural "is-a" modeling | LSP violations when subclass breaks parent contract |

**Examples:**

```js
class Employee {
  constructor(name) {
    this.name = name;
  }
  getRole() {
    return "employee";
  }
}

class Manager extends Employee {
  getRole() {
    return "manager";
  }
}
```

**Thoughts:** Favor composition when behavior varies by combination, not taxonomy. "Prefer composition over inheritance" — Gang of Four.

</details>

<details>
  <summary>Polymorphism</summary>

### Polymorphism

**Definition:**

Use an object without knowing the concrete type — only a shared contract (methods/shape). One operation, many implementations.

| Type                      | Meaning                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| **Subtype (inheritance)** | Subclass usable wherever parent is expected                        |
| **Parametric (generics)** | Same code works on many types (`T[]`)                              |
| **Ad-hoc (overloading)**  | Same name, different signatures (limited in JS)                    |
| **Structural (JS/TS)**    | If it has the methods, it fits — duck typing / TS structural types |

**How it works:**

Code written against one concrete type is **tightly coupled**. A shared shape (`Record` with `kind`, or `shape.area()`) lets History accept spend _and_ income without changing `addRecord`. JS has no `interface` keyword — you fake the contract with duck typing, JSDoc, or TypeScript.

Полиморфизм — объект по контракту, не по конкретному классу. `addRecord` принимает трату и доход. В JS нет интерфейсов — утка / TypeScript.

**When to use:** Strategy-like swaps; plugin systems; ledger entries that are spend or income; rendering different component types from one list.

**Pluses and minuses:**

| +                                                     | −                                                       |
| ----------------------------------------------------- | ------------------------------------------------------- |
| Fewer `if/else` on concrete types                     | Need a real shared contract, not a random `type` string |
| Lower coupling — change one variant, not every caller | JS won't check the contract at runtime                  |
| Plugin lists, renderers, strategies                   | Fake "polymorphism" via flags can become a god `switch` |

**Examples:**

```js
class LedgerRecord {
  constructor(amount, kind) {
    this.kind = kind; // 'spending' | 'income'
    this.amount = amount;
    this.dateTime = Date.now();
  }
}

const spending = new LedgerRecord(400, "spending");
const income = new LedgerRecord(400, "income");
history.addRecord(spending);
history.addRecord(income); // same API — History does not care which kind
```

**Thoughts:** Prefer a real interface in TS over a string `kind` when variants diverge in behavior. Inheritance is another path — composition + a contract is usually safer. See [OOP in JavaScript](#2-oop--fp) below.

**Sources:**

[Doka — OOP](https://doka.guide/tools/oop/)

---

</details>

<details>
  <summary>Abstraction</summary>

### Abstraction

**Definition:** Exposing essential behavior while hiding implementation complexity.

**How it works:** Абстракция — поведение без внутренностей. Слишком мало или слишком много слоёв — оба вредят.

**When to use:** APIs, repositories, storage adapters, payment providers.

**Pluses and minuses:**

| +                                | −                                      |
| -------------------------------- | -------------------------------------- |
| Simplifies mental model          | Wrong abstraction is expensive to undo |
| Enables swapping implementations | Too many layers obscure flow           |

**Examples:**

```js
// Caller depends on abstraction, not fetch vs axios
async function getUser(id, client) {
  return client.request(`/users/${id}`);
}
```

**Thoughts:** Interface in TS = compile-time abstraction. In JS, document contracts via JSDoc or tests.

**Sources:**

[Doka — OOP](https://doka.guide/tools/oop/)

---

</details>

<details>
  <summary>Cohesion vs coupling</summary>

### Cohesion vs coupling

**Definition:** **Cohesion** (связность) is how closely a module's internals belong together. **Coupling** (сцепление) is how much one module knows about another. Want high cohesion, low coupling.

**How it works:**

- Encapsulation raises cohesion: spent-today lives on History, per-day on Budget — `DailyAmount` only subtracts.
- Polymorphism lowers coupling: callers depend on a contract, not on `Spending` vs `Income`.
- Duplicate "spent today" logic in three files is low cohesion spread thin — a rule change misses a copy.

|              | High (good / bad)                         | Low                                                      |
| ------------ | ----------------------------------------- | -------------------------------------------------------- |
| **Cohesion** | Good — related code in one module         | Bad — a class does budget _and_ HTTP _and_ UI            |
| **Coupling** | Bad — many modules break when one changes | Good — swap History storage without touching DailyAmount |

Связность — близкие задачи в одном модуле. Сцепление / зацепление — сколько модули знают друг о друге. Цель: высокая связность, низкое сцепление. High coupling → many mocks just to boot a unit test; see [Making tests easy](./7_special_testing.md#making-tests-easy).

**When to use:** Refactor when you copy the same formula; when a UI tweak forces a domain-class edit.

**Thoughts:** Hide internals (encapsulation) + talk through contracts (polymorphism) = cohesive modules that barely know each other.

**Sources:**

[Doka — OOP](https://doka.guide/tools/oop/)

---

</details>

<details>
  <summary>Composition vs inheritance</summary>

### Composition vs inheritance

**Definition:** **Inheritance** builds "is-a" hierarchies. **Composition** builds "has-a" by embedding objects and delegating behavior.

**How it works:**

Inheritance designs **from general to specific** (Animal → Dog). Composition designs **from parts to whole** (Human = skeleton + immune + cardio). Feature sets group into contracts; a class picks the set it needs — no single taxonomy. Biology has several overlapping trees; software usually does too.

Наследование — «является» (иерархия). Композиция — «имеет» (набор фич). Иерархий может быть несколько сразу — композиция не ломается.

**When to use:** Default to composition. Inheritance only for stable, shallow "is-a" (e.g. `Error` subclasses).

**Pluses and minuses:**

| + (composition)                           | −                           |
| ----------------------------------------- | --------------------------- |
| Loose coupling; swap behaviors at runtime | More boilerplate wiring     |
| Avoids fragile base class problem         | Many small objects to track |
| Aligns with LSP and OCP                   |                             |

| + (inheritance)                   | −                                |
| --------------------------------- | -------------------------------- |
| Fast to prototype shared behavior | Changes in base break subclasses |
| Clear taxonomy                    | Deep trees resist refactoring    |

**Examples:**

```js
// Composition — mix feature objects (JS has no `implements`)
const cardio = {
  pumpBlood() {},
};
const immune = {
  fightInfection() {},
};

const human = { ...cardio, ...immune };
const worm = { ...cardio, ...immune }; // same features, no shared parent class
```

**Thoughts:** React favors composition (`children`, render props, hooks). SOLID: OCP via composition; LSP applies to inheritance. Mixins/spread work but stay untyped without TS interfaces. See [Mixins](./3_js_oop.md).

**Sources:**

[Doka — OOP](https://doka.guide/tools/oop/) · [refactoring.guru — composition over inheritance](https://refactoring.guru/design-patterns/composite)

---

</details>

<details>
  <summary>SOLID (overview)</summary>

### SOLID (overview)

**Definition:** **SOLID** — пять принципов дизайна Роберта Мартина («Дядя Боб») для кода, который остаётся **удобным для изменений, тестов и расширения**. Сформулированы в ООП, но относятся к **классам**, **модулям** и **функциям**. **Ориентир, когда больно менять код** — не требование писать пять абстракций в каждом коротком скрипте.

**How it works:**

| Letter | Principle             | Простыми словами                                       |
| ------ | --------------------- | ------------------------------------------------------ |
| **S**  | Single Responsibility | Один модуль / класс / функция = одна задача            |
| **O**  | Open/Closed           | Расширять **новым** кодом — не править стабильный      |
| **L**  | Liskov Substitution   | Любой подтип должен работать там же, где родитель      |
| **I**  | Interface Segregation | Не навязывать методы, которые вызывающий не использует |
| **D**  | Dependency Inversion  | Передавать зависимости снаружи — не хардкодить внутри  |

Каждая буква закрывает свой вид связности. Эссе по каждому принципу на этой странице: [SRP](#single-responsibility-srp) · [OCP](#open-closed-ocp) · [LSP](#liskov-substitution-lsp) · [ISP](#interface-segregation-isp) · [DIP](#dependency-inversion-dip).

**When to use:** God-классы и god-модули; plugin-style провайдеры; code review; интервью. На одноразовом скрипте — без тяжёлой абстракции.

**Pluses and minuses:**

| +                                              | −                                  |
| ---------------------------------------------- | ---------------------------------- |
| Проще тесты, рефакторинг, зоны ответственности | Переусложнение — лишние абстракции |
| Общий словарь на code review                   | Споры про SOLID вместо доставки    |
| Масштабируется с ростом кодовой базы           | Границы субъективны (особенно SRP) |

**Examples:**

```js
// S — good: engine logic separate from dashboard UI
class CarEngine {
  start() {
    return "engine on";
  }
}

class CarDashboard {
  render({ speed }) {
    return `${speed} km/h`;
  }
}

// S — bad: one class mixes engine + UI (two reasons to change)
// class Car {
//   start() { return "engine on"; }
//   renderDashboard() { return `${this.speed} km/h`; }
// }

// O — good: new engine = new class, Car unchanged
class GasEngine {
  start() {
    return "gas started";
  }
}

class Car {
  constructor(engine) {
    this.engine = engine;
  }
  start() {
    return this.engine.start();
  }
}

new Car(new GasEngine());

// O — bad: edit Car.start() for every new engine type
// class Car {
//   start() {
//     if (this.type === "gas") return "gas started";
//     if (this.type === "electric") return "motor started";
//   }
// }

// L — good: goToWork(car) works for any car that returns a result
function goToWork(car) {
  return car.drive(10);
}

class RoadCar {
  drive(km) {
    return { km, status: "ok" };
  }
}

goToWork(new RoadCar());

// L — bad: subclass throws — goToWork crashes without try/catch
class OutOfFuelCar extends RoadCar {
  drive(km) {
    throw new Error("No fuel");
  }
}
// goToWork(new OutOfFuelCar());

// I — good: showroom lists; workshop repairs — separate APIs
class CarLot {
  listAvailable() {
    return ["sedan", "suv"];
  }
}

class CarWorkshop {
  repair(carId) {
    return `repaired ${carId}`;
  }
}

// I — bad: lot forced to stub repair() it never uses
// class Garage {
//   listAvailable() { return ["sedan", "suv"]; }
//   repair() { throw new Error("We don't repair here"); }
// }
// class CarLot extends Garage {}

// D — good: inject logger — business logic does not own console
function processOrder(order, logger) {
  logger.log(`Processing ${order.id}`);
}

// D — bad: hardcoded console inside domain code
// function processOrder(order) {
//   console.log(`Processing ${order.id}`);
// }
```

**Thoughts:** Разбор по стеку с `// good` / `// bad` для всех пяти букв: [JS — SOLID in Classes](./3_js_core.md#solid-in-classes) · [JS — SOLID in Functions](./3_js_core.md#solid-in-functions) · [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express). Дополняет [DRY, KISS, YAGNI](./0_system_design_principles.md) — не абстрагируйте, пока не появится второй use case.

**Sources:**

[Doka — OOP](https://doka.guide/tools/oop/) · [freecodecamp — SOLID](https://www.freecodecamp.org/news/solid-principles-single-responsibility-principle-explained/) · [JS — SOLID in Classes](./3_js_core.md#solid-in-classes) · [JS — SOLID in Functions](./3_js_core.md#solid-in-functions) · [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express)

---

</details>

<details>
  <summary>Single Responsibility (SRP)</summary>

### Single Responsibility (SRP)

**Definition:** A module (class, function, file) should have **one reason to change** — one cohesive job or axis of change.

**How it works:**

- Identify **who** would request changes: UI team, API team, billing rules, etc.
- If two unrelated stakeholders trigger edits in the same module, split it.
- SRP is about **cohesion**, not "one method per class" — a `UserValidator` with three validation methods still has one job.
- In React: separate data fetching, formatting, and presentation.

**When to use:** Split god components; `UserRepository` (DB) vs `UserPresenter` (UI); separate email template rendering from send logic; extract validation from route handlers.

**Pluses and minuses:**

| +                                       | −                                      |
| --------------------------------------- | -------------------------------------- |
| Easier test, refactor, and reason about | Over-splitting creates file sprawl     |
| Clear ownership per module              | "One reason" is subjective             |
| Smaller diffs, fewer merge conflicts    | Can feel bureaucratic for tiny scripts |

**Examples:**

```js
// ❌ Two reasons to change: DB schema AND API response shape
class UserService {
  async getUser(id) {
    const row = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return { fullName: `${row.first} ${row.last}`, avatar: row.img_url };
  }
}

// ✅ Split responsibilities
class UserRepository { findById(id) { return db.query(...); } }
class UserMapper { toDto(row) { return { fullName: `${row.first} ${row.last}`, ... }; } }
```

**Thoughts:**

Interview: SRP ≠ "one function" — it's one **axis of change**. A change in tax law shouldn't force editing UI code.

**Sources:** [SOLID (overview)](#solid-overview) · [JS — SOLID in Classes](./3_js_core.md#solid-in-classes) · [JS — SOLID in Functions](./3_js_core.md#solid-in-functions) · [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express)

---

</details>

<details>
  <summary>Open/Closed (OCP)</summary>

### Open/Closed (OCP)

**Definition:** Software entities should be **open for extension** but **closed for modification** — add behavior via new code, not by editing stable modules.

**How it works:**

- Define **extension points**: strategy interfaces, middleware hooks, plugin registries.
- New variants implement the interface or register with the registry.
- Core logic calls the abstraction — never a growing `if/else` or `switch` on types.
- In JS: object maps, higher-order functions, and middleware pipelines achieve OCP without inheritance.

**When to use:** Payment providers, export formats (CSV/JSON/PDF), validation rules, Express/Koa middleware, ESLint rules, React render props / compound components.

**Pluses and minuses:**

| +                                         | −                                        |
| ----------------------------------------- | ---------------------------------------- |
| Safer additions — existing code untouched | Abstraction upfront cost                 |
| Plugin and middleware architectures       | Wrong extension points are hard to fix   |
| Fewer regression bugs on extend           | Can over-engineer for one implementation |

**Examples:**

```js
const paymentStrategies = {
  stripe: (amount) => chargeStripe(amount),
  paypal: (amount) => chargePayPal(amount),
};

function checkout(provider, amount) {
  const pay = paymentStrategies[provider];
  if (!pay) throw new Error("Unknown provider");
  return pay(amount); // add new provider without editing this function
}
```

**Thoughts:**

OCP pairs with Strategy and Factory patterns. A `switch` on closed enum is fine if the set is truly fixed and owned by one team.

**Sources:** [SOLID (overview)](#solid-overview) · [JS — SOLID in Classes](./3_js_core.md#solid-in-classes) · [JS — SOLID in Functions](./3_js_core.md#solid-in-functions) · [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express)

---

</details>

<details>
  <summary>Liskov Substitution (LSP)</summary>

### Liskov Substitution (LSP)

**Definition:** Subtypes must be **substitutable** for their base types — callers using the parent contract must not break when given a subclass.

**How it works:**

- Subclass must honor **preconditions** (not strengthen), **postconditions** (not weaken), and **invariants** of the parent.
- If code expects `Rectangle.setWidth(w)` to leave height unchanged, `Square extends Rectangle` violates LSP when `setWidth` also changes height.
- Prefer composition when "is-a" taxonomy doesn't hold behaviorally.
- In JS/TS: duck typing doesn't save you — behavioral contracts still matter.

**When to use:** Review any `extends` — does subclass throw on parent methods? Narrow input types? Return incompatible shapes? Plugin systems where plugins must not break host assumptions.

**Pluses and minuses:**

| +                                 | −                                                 |
| --------------------------------- | ------------------------------------------------- |
| Reliable polymorphism             | Violations are subtle and discovered late         |
| Safe refactoring with inheritance | Pushes toward composition (good, but more wiring) |
| Clear contracts in hierarchies    | Hard to formalize in untyped JS                   |

**Examples:**

```js
class Bird {
  fly() {
    return "flying";
  }
}
class Penguin extends Bird {
  fly() {
    throw new Error("Cannot fly");
  } // ❌ breaks callers expecting fly()
}

// ✅ Better — separate interfaces
class Penguin {
  swim() {
    return "swimming";
  }
}
```

**Thoughts:**

Classic interview trap: `Square extends Rectangle`. Fix: don't model square as rectangle subtype; use shared `Shape` with `area()`.

**Sources:** [SOLID (overview)](#solid-overview) · [JS — SOLID in Classes](./3_js_core.md#solid-in-classes) · [JS — SOLID in Functions](./3_js_core.md#solid-in-functions) · [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express)

---

</details>

<details>
  <summary>Interface Segregation (ISP)</summary>

### Interface Segregation (ISP)

**Definition:** Clients should not be forced to depend on methods they don't use — prefer **small, focused interfaces** over fat ones.

**How it works:**

- Split large interfaces into role-specific ones (`Readable`, `Writable`, `Deletable`).
- Callers depend only on the methods they need — easier to mock and implement.
- In TS: `interface` segregation; in JS: pass minimal object shapes or use JSDoc `@typedef` for contracts.
- Fat React component props that force unused callbacks violate ISP spirit.

**When to use:** Split `File` god interface into `read()`, `write()`, `watch()`; API clients that only need `get` shouldn't require `delete`; segregate admin vs read-only service interfaces.

**Pluses and minuses:**

| +                                     | −                                        |
| ------------------------------------- | ---------------------------------------- |
| Smaller, focused contracts            | More types/interfaces to maintain        |
| Easier mocks in tests                 | Can fragment APIs if overdone            |
| Implementers only stub what they need | Discovery — "which interface do I need?" |

**Examples:**

```ts
type Readable = { read(id: string): Promise<Data> };
type Writable = { write(data: Data): Promise<void> };

// Report generator only needs Readable
function generateReport(source: Readable) {
  return source.read("summary");
}
```

**Thoughts:**

ISP reduces coupling between modules. In frontend, prop drilling fat objects is an ISP smell — pass only needed fields.

**Sources:** [SOLID (overview)](#solid-overview) · [JS — SOLID in Classes](./3_js_core.md#solid-in-classes) · [JS — SOLID in Functions](./3_js_core.md#solid-in-functions) · [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express)

---

</details>

<details>
  <summary>Dependency Inversion (DIP)</summary>

### Dependency Inversion (DIP)

**Definition:** High-level modules depend on **abstractions**; low-level modules **implement** those abstractions — both depend on interfaces, not on each other directly.

**How it works:**

1. High-level policy (`OrderService`) defines what it needs (`PaymentGateway`, `OrderRepo`).
2. Low-level details (`StripeGateway`, `PostgresOrderRepo`) implement those abstractions.
3. **Inject** dependencies via constructor, factory, or DI container — don't `import` concrete implementations inside business logic.
4. Tests swap in fakes/mocks at the abstraction boundary — kinds: [Test doubles](./7_special_testing.md#test-doubles-stubs-mocks-spies).

**When to use:** Inject `HttpClient`, `Storage`, `Logger`; repository pattern over raw ORM in services; React context/providers for testable dependencies; avoid `fetch` calls inside pure domain functions.

**Pluses and minuses:**

| +                                                | −                                   |
| ------------------------------------------------ | ----------------------------------- |
| Testable via mocks/stubs                         | Indirection and wiring overhead     |
| Swappable implementations (DB, payment, storage) | DI containers can hide dependencies |
| Business logic isolated from frameworks          | Learning curve for junior devs      |

**Examples:**

```ts
type UserRepo = { findById(id: string): Promise<User> };

function getUserProfile(id: string, repo: UserRepo) {
  return repo.findById(id); // depends on abstraction
}

// Production: getUserProfile(id, new PostgresUserRepo())
// Test:       getUserProfile(id, { findById: async () => mockUser })
```

**Thoughts:** DIP ≠ every function takes 10 params. Module-level defaults with injectable overrides is idiomatic in JS. Pairs with Factory and Repository patterns. JS has no interfaces — constructor injection still helps (`new DailyAmount(budget, history)`), but the _inversion onto an abstraction_ is a TypeScript/`typedef` story. See [Entities, relations & design](./0_system_design_grasp.md#entities-relations--design).

**See also:** Swappable fakes at the interface = less mock archaeology — [Making tests easy](./7_special_testing.md#making-tests-easy).

**Sources:**

[Doka — OOP](https://doka.guide/tools/oop/) · [SOLID (overview)](#solid-overview) · [JS — SOLID in Classes](./3_js_core.md#solid-in-classes) · [JS — SOLID in Functions](./3_js_core.md#solid-in-functions) · [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express)

---

</details>
