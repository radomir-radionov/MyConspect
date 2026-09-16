# Paradigms

Programming fundamentals, OOP, and functional style.

[← Back to hub](./7_special.md)

### Related docs

* [Paradigms](./7_special_paradigms.md) · [Architecture patterns](./7_special_architecture.md) · [Algorithms](./7_special_algorithms.md) · [Engineering](./7_special_engineering.md) · [Web security](./7_special_security.md) · [Paradigms — Interview](./7_special_interview.md)

### Sections

- [1. Programming fundamentals](#1-programming-fundamentals)
- [2. OOP & FP](#2-oop-fp)

---

Each `<details>` topic follows: **Definition** → **How it works** → **When to use** → **Pluses and minuses** → **Examples** → **Thoughts** → **Sources**

- [10. Design patterns](./7_special_engineering.md#10-design-patterns) — [creational cheat sheet](./7_special_engineering.md#creational-patterns--cheat-sheet)
- [11. SDLC & Agile](./7_special_engineering.md#11-sdlc--agile) — [methodology](./7_special_engineering.md#software-design-methodology), [Waterfall](./7_special_engineering.md#waterfall), [Agile](./7_special_engineering.md#agile), [Scrum](./7_special_engineering.md#scrum), [Kanban](./7_special_engineering.md#kanban), [not a silver bullet](./7_special_engineering.md#not-a-silver-bullet)
- [12. Testing](./7_special_engineering.md#12-testing) — [why tests / AAA](./7_special_engineering.md#why-write-tests-aaa), pyramid, [integration](./7_special_engineering.md#integration-testing), [system / E2E](./7_special_engineering.md#system-testing), TDD, BDD, [making tests easy](./7_special_engineering.md#making-tests-easy), [test doubles](./7_special_engineering.md#test-doubles-stubs-mocks-spies), [Jest first tests](./7_special_engineering.md#jest--first-tests-node-vs-jsdom)

### Topic template

Every major topic follows:

**Definition** → **How it works** → **When to use** → **Pluses and minuses** → **Examples** → **Thoughts** → **Sources**

### Programming paradigms

**Definition:**

A paradigm is a set of techniques and concepts that define *how to write* — the same program can be an instruction list (**imperative**) or a description of the desired result (**declarative**).

| Style | Question it answers | Typical descendants |
|-------|---------------------|---------------------|
| **Imperative** | *How* — ordered commands that change state | Procedural, OOP |
| **Declarative** | *What* — result; hide the how | Logic, functional |

**How it works:**

Imperative mixes *purpose* with *implementation details*. Declarative states purpose and pushes details into a lower abstraction (`filter`, SQL optimizer, React reconciler). Working memory is limited — hiding the how at the business-logic layer reduces cognitive load.

Парадигма — «как писать». Императив = *как* (шаги). Декларатив = *что* (результат). Алгоритм — императивно; бизнес-логика — декларативно, детали ниже.

**When to use:** Algorithms and tight control → imperative. Business rules, UI, queries → declarative on top of well-named primitives.

**Examples:**

Odd numbers — same contract, different styles (`filter` returns a **new** array; the loop mutates `result` with `push`).

```js
function onlyOddImperative(array) {
  const result = [];
  for (const element of array) {
    if (element % 2 !== 0) result.push(element);
  }
  return result;
}

function onlyOddDeclarative(array) {
  return array.filter((element) => element % 2 !== 0);
}
```

**Thoughts:** Paradigms are lenses, not religions — JS/TS are multi-paradigm; pick per layer.

**Sources:** [Doka — programming paradigms](https://doka.guide/tools/programming-paradigms/) · [MDN `Array.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) · [cs.lmu.edu paradigms](https://cs.lmu.edu/~ray/notes/paradigms/)

### Algorithms & Big O

**Definition:**

Big O describes how time or space grows relative to input size `n` — worst-case upper bound for asymptotic comparison.

| Notation | Example |
|----------|---------|
| O(1) | Array index, `Map.get` |
| O(log n) | Binary search |
| O(n) | Single pass |
| O(n log n) | Merge sort |
| O(n²) | Nested loops |

**When to use:** Choosing sort/search strategy; reviewing nested loops on large collections; system design capacity estimates.

**Sources:** [ByteByteGo Big O](https://blog.bytebytego.com/p/ep132-big-o-notation-101-the-secret)

### Web security

**Definition:**

Practices to protect confidentiality, integrity, and availability of web apps and user data — authentication, authorization, input validation, transport security, and defense in depth.

| Threat | Mitigation |
|--------|------------|
| XSS | Encode output, CSP, HttpOnly cookies |
| CSRF | CSRF tokens, SameSite cookies |
| Clickjacking | CSP `frame-ancestors`, `X-Frame-Options` |
| Injection | Parameterized queries (not a kind of XSS) |
| DoS / Slowloris | Rate limits, timeouts, capacity |
| MITM | HTTPS/TLS, HSTS |
| Stolen password DB | Slow salted hashes (Argon2id / bcrypt), not reversible encryption |

**When to use:** Always in production; threat-model before launch.

**Sources:**

[OWASP XSS](https://owasp.org/www-community/attacks/xss/)

---

<a name="1-programming-fundamentals"></a>

## 1. Programming fundamentals

<details>
  <summary>Programming</summary>

### Programming

**Definition:** Programming is composing sequences of instructions (programs) that a computer executes. A program is an algorithm expressed in a programming language; code is the text of that program.

**Thoughts:**

Think in concepts, not syntax. Language is the medium; algorithms, data structures, and architecture are the substance.

---

</details>

<details>
  <summary>Programming paradigm</summary>

### Programming paradigm

**Definition:**

A programming paradigm is a coherent style and set of ideas that shape how programs are structured — e.g. imperative, declarative, object-oriented, functional.

| Paradigm | Focus | Typical constructs |
|----------|-------|-------------------|
| **Imperative** | How to do it — step-by-step state changes | variables, assignment, loops |
| **Declarative** | What to do — describe desired result | SQL, HTML, React JSX, `filter`/`map` |
| **Procedural** | Imperative + named subroutines sharing memory | functions, modules, globals |
| **OOP** | Entities as objects (class instances) | classes, inheritance, encapsulation |
| **Logic** | Solve via facts, rules, and inference | Prolog-style models |
| **Functional** | Math-like transforms; pure functions | map/filter/reduce, immutability |
| **Structural** | Control flow via blocks (if/while), no goto spaghetti | structured programming |

**How it works:**

Same destination, different instructions — turn-by-turn directions vs an address. Declarative code is usually easier to *read* as intent; both styles can take similar time to *write*. Hide implementation behind a lower layer when you are at business-logic height.

Один адрес — два объяснения: повороты vs «дом 38». JS — мультипарадигма; линзы, не религия.

**When to use:**

- Imperative: concrete algorithms, hardware/bit-level steps, performance-critical loops
- Declarative: UI (React), queries (SQL), config, “filter this list”
- OOP: domain models with clear entity boundaries
- FP: data transforms, concurrency-friendly pipelines
- Logic: constraint / knowledge modeling (less common in typical JS apps)

**Pluses and minuses:**

| + (multi-paradigm) | − |
|-------------------------|------|
| Pick the right tool per subproblem | Mixing paradigms inconsistently confuses teams |
| Modern languages support several (JS, TS, Python) | "Paradigm wars" distract from delivery |

**Examples:**

```js
// Imperative — how
let sum = 0;
for (const n of nums) sum += n;

// Declarative / functional — what
const sum = nums.reduce((a, b) => a + b, 0);
```

**Thoughts:** JavaScript is multi-paradigm. React blends declarative UI with functional state updates. Interview answer: paradigms are lenses, not religions.

**Sources:**

[Doka — programming paradigms](https://doka.guide/tools/programming-paradigms/) · [cs.lmu.edu paradigms](https://cs.lmu.edu/~ray/notes/paradigms/)

---

</details>

<a name="reactive-programming--reactivity"></a>

<details>
  <summary>Reactive programming & reactivity</summary>

### Reactive programming & reactivity

**Definition:**

**Reactivity** is automatically updating a system when data changes. **Reactive programming** is a paradigm centered on **data streams** — time-ordered event sequences from any source — and the relationships between them.

| Perspective | Meaning |
|-------------|---------|
| **User** | UI responds instantly to input (typing, clicks, loaders) |
| **Developer** | Derived values stay in sync with sources without manual recomputation |

**How it works:**

Built on the **Observer** pattern. When the source changes, subscribers react — but *when* they react depends on push vs pull:

| Type | Mechanism | Subscribers update | JS examples |
|------|-----------|-------------------|-------------|
| **Push** | Source pushes each change immediately | On every event | `addEventListener`, RxJS `fromEvent`, WebSockets |
| **Pull** | Consumers read fresh values on demand | On next system pass (e.g. render) | React re-render, MobX `autorun` |

`const sum = a + b` is a one-time snapshot — changing `a`/`b` later does not update `sum`. Reactive systems recompute dependents when inputs change (frameworks wire this for you).

| Push | Pull |
|------|------|
| Immediate; natural for events | Deferred work — compute only when needed |
| Risk: duplicate work under heavy streams | Risk: refreshing the whole graph can be costly |

**When to use:** Live dashboards, event-heavy UIs, validation chains, syncing UI with server push. **FRP** (functional reactive programming) composes streams with `map` / `filter` / `scan` — RxJS in JS; Elm is a pure FRP language.

**Examples:**

```js
// Push — native events
document.addEventListener('click', () => console.log('clicked'));

// Push — RxJS
import { fromEvent } from 'rxjs';
fromEvent(document, 'click').subscribe(() => console.log('clicked'));
```

**Thoughts:**

Express *relationships* between data; let the runtime sync consumers (especially UI) instead of manually re-running every step.

`$name` or `clicks$` often marks Observables/streams. In practice reactive ideas mix with imperative/OOP (React hooks, Vue Proxy). Two-way binding is *UI ↔ model sync*; reactivity is *derived values recompute* — [Data flow](./7_special_architecture.md#data-flow--one-way-vs-two-way). See [Observer](./0_system_design_patterns.md#observer) · [React state](./4_react_core.md#state).

**Sources:**

[Doka — reactivity](https://doka.guide/js/reactivity/) · [RxJS overview](https://rxjs.dev/guide/overview)

---

</details>

<details>
  <summary>Imperative vs declarative</summary>

### Imperative vs declarative

**Definition:** **Imperative** code is a sequence of commands (*assign, loop, branch, mutate*). **Declarative** code states the result and lets another layer perform the steps (`array.filter`, SQL, JSX).

**How it works:**

- Imperative `onlyOdd`: `result = []` → `for…of` → `% 2` → `push` → `return` — you own every step.
- Declarative `onlyOdd`: “keep elements where the predicate is true” — `filter` hides allocation and iteration ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter): new array of truthy callback results).
- Difference is **who owns implementation details**, not whether a CPU still loops underneath.

Императив — сам цикл и `push`. Декларатив — `filter`: важно *что* оставить. `filter` всё равно цикл, ты его не пишешь.

**When to use:**

Spell out an algorithm → imperative. Business logic → declarative API; put the loop in a named helper.

#### Common pitfalls

Calling `filter` “magic” — it is still a loop; you just do not reimplement it. Declarative style still needs a correct predicate.

**Pluses and minuses:**

| + | − |
|------|------|
| Declarative: intent-first, smaller working set in your head | Poor abstractions leak the how anyway |
| Imperative: full control for algorithms and side-effect order | Mixes *what* and *how*; harder to scan at scale |

**Examples:**

```js
function onlyOddImperative(array) {
  const result = [];
  for (const element of array) {
    if (element % 2 !== 0) result.push(element);
  }
  return result;
}

function onlyOddDeclarative(array) {
  return array.filter((element) => element % 2 !== 0);
}
```

**Thoughts:** *How* vs *what* — hide the how one layer below the decision you are making.

**Sources:**

[Doka — programming paradigms](https://doka.guide/tools/programming-paradigms/) · [MDN filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

---

</details>

<details>
  <summary>Procedural programming</summary>

### Procedural programming

**Definition:** Imperative style grouped into **subroutines** (procedures/functions) that communicate mainly through **shared memory** (globals, buffers, device state) rather than only return values.

**How it works:**

Sequential commands live in named procedures. Modules grew out of this grouping, but reuse is weak if everything depends on one mutable store. Analog in JS: functions that read/write a shared array instead of taking args and returning new data.

Процедурное = функции + общая память (глобали). Просто для железа; плохо переиспользовать и тестировать.

**When to use:** Drivers, firmware-style bit flags, scripts that step a single workspace. Prefer explicit arguments once the program is larger than a toy.

**Pluses and minuses:**

| + | − |
|------|------|
| Simple mapping to hardware / one memory image | Shared mutable state is hard to reuse and test |
| Clear call order | Race conditions if two procedures mutate the same cells |

**Examples:**

```js
let memory = [0, 0, 0, 0, 0, 0, 0, 0];

function invertSmallestBit() {
  memory[7] = Number(!memory[7]);
  return memory;
}

function invertBiggestBit() {
  memory[0] = Number(!memory[0]);
  return memory;
}

invertSmallestBit(); // [0, 0, 0, 0, 0, 0, 0, 1]
invertBiggestBit();  // [1, 0, 0, 0, 0, 0, 0, 1]
invertSmallestBit(); // [1, 0, 0, 0, 0, 0, 0, 0]
```

**Thoughts:**

Scopes matter — procedures “talk” like globals. See [JS Core — scope](./3_js_core.md) for lexical vs global memory.

Procedures + shared RAM — the ancestor of modules, not a good default for app domain logic.

**Sources:**

[Doka — programming paradigms](https://doka.guide/tools/programming-paradigms/)

---

</details>

<details>
  <summary>Logic programming</summary>

### Logic programming

**Definition:** A **declarative** paradigm: encode facts and rules; an inference engine (unification, resolution) searches for solutions — closer to applied logic than to sequential “do this then that.”

**How it works:**

Translate the business problem into predicates. The runtime proves queries (classic: Prolog). Used for process modeling, constraints, expert-style rules — not typical day-to-day JS.

Логическое: факты + правила, движок ищет ответ (Prolog). Во фронте почти не встречается.

**When to use:** Knowledge bases, constraint solvers, some AI/planning layers. Skip inventing a math model in an interview unless asked.

**Pluses and minuses:**

| + | − |
|------|------|
| Compact expression of rules and relations | Steep encoding cost; rare in frontend stacks |
| Engine searches combinations for you | Debugging search trees is unlike stepping a loop |

**Examples:** (sketch, not JS) `parent(X, Y)` + `ancestor` rules; query `ancestor(alice, Who)`.

**Thoughts:** You state *truths*; the machine derives *answers*.

**Sources:**

[Doka — programming paradigms](https://doka.guide/tools/programming-paradigms/)

---

</details>

<details>
  <summary>Statement vs expression</summary>

### Statement vs expression

**Definition:**

A **statement** performs an action (assign, loop, declare). An **expression** evaluates to a value (`42`, `a + b`, `fn()`).

| | Statement | Expression |
|---|-----------|------------|
| Returns value | No | Yes |
| Examples | `if`, `for`, `const x = 1` | `1 + 2`, ternary, arrow fn body without braces |

**When to use:** Prefer expressions in functional pipelines; statements for control flow and side effects at boundaries.

**Examples:**

```js
const doubled = items.map(x => x * 2); // expression-bodied callback
if (items.length === 0) return [];     // statement
```

**Thoughts:**

`const x = (y = 1)` — assignment inside expression is valid but hurts readability.

---

</details>

<details>
  <summary>Code refactoring</summary>

### Code refactoring

**Definition:** Refactoring improves internal structure, readability, and maintainability **without changing external behavior**.

**When to use:** After green tests; small steps; before adding features to tangled code.

**Pluses and minuses:**

| + | − |
|------|------|
| Reduces tech debt incrementally | Risky without tests |
| Enables safer feature work | Can become endless "cleanup" without product value |

**Examples:** Extract duplicated validation into `validateUser(input)` — same API, clearer modules.

**Thoughts:** "Refactor" ≠ rewrite. Boy Scout rule: leave code slightly better. Never refactor and change behavior in one commit.

**Sources:**

[refactoring.com](https://refactoring.com/)

---

</details>

<a name="2-oop--fp"></a>

## 2. OOP & FP

<details>
  <summary>Object-Oriented Programming (OOP)</summary>

### Object-Oriented Programming (OOP)

**Definition:** OOP models programs as **objects** — instances of a **class** (blueprint). Each object holds fields and methods described once on the class.

**How it works:**

| Pillar | Meaning |
|--------|---------|
| **Abstraction** | Keep the characteristics that describe behavior; omit internals |
| **Encapsulation** | Keep data next to the object that uses it; hide the rest |
| **Polymorphism** | One interface, many types |
| **Inheritance** | Take properties from a parent — prefer **composition** when “is-a” is messy |

ООП: класс = чертёж, объект = экземпляр. Столпы: абстракция, инкапсуляция, полиморфизм, наследование. Чайник с таймером — композиция, не двойное наследование. Общая память + два писателя = гонки. Код — карта бизнес-логики.

**When to use:** Rich domain models, UI component trees, SDKs with clear type hierarchies. Teapot-with-timer: inherit from teapot *or* timer? Prefer **composition** (has a kettle + has a timer).

**Pluses and minuses:**

| + | − |
|------|------|
| Modeling: components as objects; relations are easier to pin down | Shared mutable data + several writers → races (not unique to OOP) |
| Enterprise modeling (UML, ER, DFD) grew around objects | Simple inheritance rarely matches real “has both” objects |
| Well-studied: books, known failure modes | Encapsulation can block sharing; concurrent edits need extra design |

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
user.nameOf();  // 'Alex'
```

**Thoughts:**

In JS, `class` desugars to prototypes. Concurrent edits (two users, one Google Doc) need OT/CRDT or locks — encapsulation does not solve shared writes. See [3_js_oop.md](./3_js_oop.md).

Good code is a **map of the territory**: business rules, entity relations, and change axes. When the map drifts from reality, the code becomes fragile. OOP is one way to keep entities and messages aligned with that map.

**Sources:**

[Doka — OOP](https://doka.guide/tools/oop/) · [Doka — programming paradigms](https://doka.guide/tools/programming-paradigms/) · [MDN Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

---

</details>

<details>
  <summary>Entities, relations & design</summary>

### Entities, relations & design

**Definition:** Design decides two things: how the program talks to the outside world (data in/out), and how **entities** talk to each other. Entities are the main actors; their relations are the business rules.

**How it works:**

- Start from the **goal**, then name entities. Budget app: `Budget`, `History`, `Record` (a spend or income).
- Draw **relations** (UML): History *contains* Records; DailyAmount *depends on* Budget + History. Arrow direction = who depends on whom — keep it matching the domain, avoid cycles.
- Express entities as **objects that send and receive messages** (method calls), not as loose bags of data.
- A class that needs other objects is a **dependent**. Popular strategy: **constructor injection** — pass collaborators in, store them as fields.

Проектирование = внешний мир + общение сущностей. Стрелки UML — кто от кого зависит. Внедрение через конструктор соединяет сущности без циклов.

**When to use:** Any domain with more than one concept that must stay consistent (budget + ledger, order + lines, cart + items). Skip heavy diagrams for a one-file script.

**Pluses and minuses:**

| + | − |
|------|------|
| Code structure matches the domain | Upfront modeling cost |
| Changes stay in the entity that owns the rule | Easy to invent entities that don't exist in the business |
| Dependency arrows make cycles visible | UML can outgrow the actual problem |

**Examples:**

```js
class Budget {
  constructor(amount, daysCount) {
    this.amount = amount;
    this.startDate = Date.now();
    this.daysCount = daysCount;
  }
  get perDay() {
    return this.amount / this.daysCount;
  }
}

class History {
  records = [];
  addRecord(record) {
    this.records.push(record);
  }
  get spentToday() {
    return this.records.reduce((sum, r) => sum + r.amount, 0); // filter with isToday(r.dateTime) in real code
  }
}

class DailyAmount {
  constructor(budget, history) {
    this.budget = budget;
    this.history = history;
  }
  get valueOf() {
    return this.budget.perDay - this.history.spentToday;
  }
}
```

**Thoughts:** `DailyAmount` does not create Budget/History — it receives them. That keeps dependency direction one-way and makes tests swap fakes. Full class syntax: [3_js_oop.md](./3_js_oop.md). SOLID mapping: [§9](./7_special_engineering.md#9-solid-principles).

**Sources:**

[Doka — OOP](https://doka.guide/tools/oop/)

---

</details>

<details>
  <summary>Encapsulation</summary>

### Encapsulation

**Definition:** Keep knowledge about an entity **inside** that entity (or its module). Outside code talks through a small API; internals stay hidden.

**How it works:**

- Data + the operations that know how to change it live together. History knows how to add a record — callers do not `history.records.push(...)`.
- If History were a bare array, *how to add* would leak into every caller. Change storage later → rewrite the app.
- Related work in one module = **high cohesion**. Uncontrolled access from outside = low encapsulation.
- JS: hide with `#` fields, closures, or module scope. `this` lets the same method update *this* instance when several Histories exist.

Инкапсуляция — знание о сущности внутри неё. История сама знает, как добавить запись. `this` — «свой» объект, когда историй несколько.

**When to use:** Domain objects; any type with more than one instance (`this` vs a captured outer variable). Always prefer methods over poking public arrays/maps.

**Pluses and minuses:**

| + | − |
|------|------|
| One place to change storage or rules | Over-private APIs hinder testing |
| Callers stay stable when internals change | Getters/setters can leak the model |
| Prevents accidental mutation | Easy to wrap every field and call it "OOP" |

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

Наследование = «является». Если «и чайник, и таймер» — лучше *имеет* (композиция), а не два родителя.

---

**When to use:** True "is-a" relationships with stable base behavior. Prefer shallow hierarchies (≤2 levels).

**Pluses and minuses:**

| + | − |
|------|------|
| DRY for shared behavior | Tight coupling to parent implementation |
| Natural "is-a" modeling | LSP violations when subclass breaks parent contract |

**Examples:**

```js
class Employee {
  constructor(name) { this.name = name; }
  getRole() { return 'employee'; }
}

class Manager extends Employee {
  getRole() { return 'manager'; }
}
```

**Thoughts:** Favor composition when behavior varies by combination, not taxonomy. "Prefer composition over inheritance" — Gang of Four.

</details>

<details>
  <summary>Polymorphism</summary>

### Polymorphism

**Definition:**

Use an object without knowing the concrete type — only a shared contract (methods/shape). One operation, many implementations.

| Type | Meaning |
|------|---------|
| **Subtype (inheritance)** | Subclass usable wherever parent is expected |
| **Parametric (generics)** | Same code works on many types (`T[]`) |
| **Ad-hoc (overloading)** | Same name, different signatures (limited in JS) |
| **Structural (JS/TS)** | If it has the methods, it fits — duck typing / TS structural types |

**How it works:**

Code written against one concrete type is **tightly coupled**. A shared shape (`Record` with `kind`, or `shape.area()`) lets History accept spend *and* income without changing `addRecord`. JS has no `interface` keyword — you fake the contract with duck typing, JSDoc, or TypeScript.

Полиморфизм — объект по контракту, не по конкретному классу. `addRecord` принимает трату и доход. В JS нет интерфейсов — утка / TypeScript.

**When to use:** Strategy-like swaps; plugin systems; ledger entries that are spend or income; rendering different component types from one list.

**Pluses and minuses:**

| + | − |
|------|------|
| Fewer `if/else` on concrete types | Need a real shared contract, not a random `type` string |
| Lower coupling — change one variant, not every caller | JS won't check the contract at runtime |
| Plugin lists, renderers, strategies | Fake "polymorphism" via flags can become a god `switch` |

**Examples:**

```js
class LedgerRecord {
  constructor(amount, kind) {
    this.kind = kind; // 'spending' | 'income'
    this.amount = amount;
    this.dateTime = Date.now();
  }
}

const spending = new LedgerRecord(400, 'spending');
const income = new LedgerRecord(400, 'income');
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

| + | − |
|------|------|
| Simplifies mental model | Wrong abstraction is expensive to undo |
| Enables swapping implementations | Too many layers obscure flow |

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

| | High (good / bad) | Low |
|---|-------------------|-----|
| **Cohesion** | Good — related code in one module | Bad — a class does budget *and* HTTP *and* UI |
| **Coupling** | Bad — many modules break when one changes | Good — swap History storage without touching DailyAmount |

Связность — близкие задачи в одном модуле. Сцепление / зацепление — сколько модули знают друг о друге. Цель: высокая связность, низкое сцепление. High coupling → many mocks just to boot a unit test; see [Making tests easy](./7_special_engineering.md#making-tests-easy).

**When to use:** Refactor when you copy the same formula; when a UI tweak forces a domain-class edit.

**Thoughts:** Hide internals (encapsulation) + talk through contracts (polymorphism) = cohesive modules that barely know each other.

**Sources:**

[Doka — OOP](https://doka.guide/tools/oop/)

---

</details>

<details>
  <summary>Class vs prototype inheritance</summary>

### Class vs prototype inheritance

**Definition:**

**Class inheritance** uses `class extends` syntax; **prototype inheritance** links objects via `[[Prototype]]` — `Object.create`, `Object.setPrototypeOf`.

| | Class syntax | Prototype chain |
|---|--------------|-----------------|
| Readability | Familiar to OOP devs | Lower-level, flexible |
| Under the hood (JS) | Desugars to prototypes | Native mechanism |
| Constructors | `constructor()` required pattern | Factory functions + `Object.create` |

**When to use:** `class` for most app code; prototypes for libraries, mixins, or understanding JS internals.

**Pluses and minuses:**

| + (prototypes) | − |
|-------------------|------|
| Dynamic — add methods at runtime | Harder for newcomers |
| Memory-efficient shared methods | `setPrototypeOf` is slow — avoid hot paths |

**Examples:**

```js
const animal = {
  speak() { return 'sound'; },
};
const dog = Object.create(animal);
dog.speak = () => 'bark';
```

**Thoughts:** `class` methods live on `prototype`, not instance. `instanceof` walks the prototype chain.

**Sources:**

[3_js_oop.md](./3_js_oop.md)

---

</details>

<details>
  <summary>OOP in JavaScript</summary>

### OOP in JavaScript

**Definition:** JS can do objects, classes, and `this`, but classic OOP also wants **user-defined types and interfaces**. Those are missing at runtime — TypeScript adds them at compile time.

**How it works:**

| Have | Missing |
|------|---------|
| Classes, objects, prototypes, `#` private fields | Native interfaces / nominal user types |
| Duck typing, factory functions, mixins | Native abstraction checks (no `implements` at runtime) |

- `class` is sugar over prototypes — still one inheritance chain. Composition and mixins (`Object.assign`, spread) are how you mix feature sets without a hierarchy.
- Without interfaces, readable composition is harder: you cannot write `class Human implements Cardio, Immune`. TS can.
- Design-first in TS: describe `History { addRecord(record: LedgerEntry): void }` before writing the class. The compiler flags broken relations **before** you run the app.
- TS `private` is erased in emit — JS can still read the field. `#field` stays private at runtime (`SyntaxError` outside the class). Chrome's console may still show/read `#` for debugging.

В JS есть классы, нет интерфейсов. Классическое ООП удобнее на TypeScript: контракты на этапе проектирования. `private` в TS — только компилятор; `#` — и в рантайме.

**When to use:** Domain-heavy apps, DI graphs, teams that need contracts. Stay on factories + modules for tiny scripts.

**Pluses and minuses:**

| + (TS for OOP) | − |
|-------------------|------|
| Interfaces, unions, `implements` — real contracts | Still compiles to JS — no runtime types |
| Catch bad entity wiring at compile time | Extra toolchain |
| Autocomplete on domain fields | `enum` and `private` have JS pitfalls (prefer unions + `#`) |

**Examples:**

```ts
type MoneyAmount = number;
type TimeStamp = number;
type RecordKind = 'spending' | 'income';

type LedgerEntry = {
  kind: RecordKind;
  amount: MoneyAmount;
  dateTime: TimeStamp;
};

interface Ledger {
  addRecord(record: LedgerEntry): void;
}
// Implement Ledger later — the rest of the system already type-checks against the contract.
```

**Thoughts:** Do not name a type `Record` — that clashes with TS's built-in `Record<K, V>`. Prefer `LedgerEntry`. Full privacy comparison: [5_ts.md](./5_ts_objects.md#classes). Classes: [3_js_oop.md](./3_js_oop.md).

**Sources:**

[Doka — OOP](https://doka.guide/tools/oop/) · [MDN — private elements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements) · [TS handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

---

</details>

<details>
  <summary>Functional Programming (FP)</summary>

### Functional Programming (FP)

**Definition:** A **declarative** paradigm where a **function** is the unit of composition — a math-like transform of inputs to outputs. Core rules: **pure functions** and **immutable data**.

**How it works:**

- Code should mirror business rules as accurately as a map mirrors territory — FP helps keep that map stable when requirements change.
- **Composition unit** = function. Chaining calls passes data step by step: `multiply(add(10, 5), 42)`.
- Good boundaries: single responsibility, communicate via data (Law of Demeter), separate config from logic (Twelve-Factor).
- No shared mutable memory → parallel-safe calls, easy unit tests (args only).
- Real apps need I/O — isolate effects at the edges; see [Functional core, imperative shell](#functional-core-imperative-shell).

| Concept | Definition |
|---------|------------|
| **Pure function** | Same input → same output; no side effects |
| **Immutability** | Don't mutate; return new copies |
| **Higher-order function** | Takes or returns functions |
| **Composition** | Output of one function → input of next |
| **Referential transparency** | Replace `f(x)` with its value without changing behavior |

ФП: функция = элемент композиции; чистые функции + иммутабельность. Плюс — тесты и параллельность. Минус — копии в памяти. I/O — на краю.

**When to use:** Data transforms, reducers, selectors, event streams, workers, React immutable updates. Keep `fetch`, DOM, logging in adapters.

**Pluses and minuses:**

| + | − |
|------|------|
| Predictable, testable transforms | Immutability → extra copies, memory pressure |
| Referential transparency → compiler/runtime optimizations | Pure FP alone cannot do DB/network/DOM |
| Parallel / thread-safe by default | Steep jargon (monads, functors) in strict FP |
| Composable pipelines (`map` / `filter` / `reduce`) | Awkward for some stateful algorithms |

**Examples:**

```js
function add(a, b) { return a + b; }
function multiply(a, b) { return a * b; }

const additionResult = add(10, 5);
const finalResult = multiply(additionResult, 42); // 735
```

**Thoughts:** Functions transform data; effects live at the shell — the universe is a side effect.

**Sources:**

[Doka — programming paradigms](https://doka.guide/tools/programming-paradigms/) · [javascript.info/functional-programming](https://javascript.info/functional-programming)

---

</details>

<details>
  <summary>Function composition</summary>

### Function composition

**Definition:** Building a program by passing the **output of one function as input to the next** — the core composition pattern in FP.

**How it works:**

- Sequential: `const y = f(x); const z = g(y);` — same as `g(f(x))`.
- **`compose(f, g, ...)(x)`** = `f(g(...(x)))` — applies **right to left**.
- **`pipe(f, g, ...)(x)`** = `g(f(...(x)))` — applies **left to right** (not built into JS; common in Ramda/lodash/fp-ts).
- Mathematical basis: function composition `(f ∘ g)(x) = f(g(x))`.

**When to use:**

`parse → validate → normalize → save` pipelines; middleware chains; transform utilities.

#### Common pitfalls

Confusing `compose` (RTL) with `pipe` (LTR). Forgetting that each function in the chain should ideally be pure.

**Pluses and minuses:**

| + | − |
|------|------|
| Reusable pipelines without duplicating control flow | Order of `compose` vs `pipe` is easy to confuse |
| Clear data flow | Deep nesting hurts readability without naming |

**Examples:**

```js
const compose = (...fns) => (x) =>
  fns.reduceRight((acc, fn) => fn(acc), x);

const add1 = (x) => x + 1;
const double = (x) => x * 2;

compose(add1, double)(3); // add1(double(3)) = 7
// compose(f, g)(x) === f(g(x))
```

**Thoughts:** *Small pure steps composed into one behavior — interview: `compose(...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x)`.*

**Sources:**

[javascript.info/currying-partials](https://javascript.info/currying-partials)

---

</details>

<details>
  <summary>Pure functions & side effects</summary>

### Pure functions & side effects

**Definition:** A **pure** function always returns the same result for the same arguments and causes **no side effects**. A **side effect** is any observable interaction with the outside world — including **reading** unstable external state.

**How it works:**

- Pure ≈ mathematical function: input → output by fixed rules.
- **Impure reads count too:** `Date.now()`, `Math.random()`, globals — you cannot guarantee the external method doesn't mutate hidden state.
- **Impure writes:** mutating outer variables, DOM, network, DB, `console.log`, throwing based on global state.
- **Referential transparency:** `double(2)` can be replaced with `4` anywhere without changing program meaning.
- Purity is a spectrum — `console.log` at boundaries may be acceptable; core logic stays pure.

| Pure | Impure |
|------|--------|
| `(a, b) => ((a + b) * a) / b` | Uses `Math.random()` in calculation |
| `(x) => x * 2` | `Date.now()`, reads/mutates outer `counter` |
| Predictable, memoizable | I/O, DOM, logging |

**When to use:**

Reducers, selectors, pricing rules, parsers — anything TDD-friendly. Wrap I/O in thin impure shells.

#### Common pitfalls

Testing `expect(expected).toEqual(expected)` — always passes. Assuming `Date.now()` is "read-only safe" — external code may mutate state on access.

**Pluses and minuses:**

| + (pure) | − (pure) |
|-------------|-------------|
| Trivial unit tests — no mocks for world state | Cannot perform I/O inside pure core |
| Safe parallel execution | Strict purity feels verbose in UI code |
| Compiler can evaluate at compile time (referential transparency) | |

**Examples:**

```js
function pureFn(a, b) {
  return ((a + b) * a) / b; // always same for same a, b
}

function impureFn(a, b) {
  return ((a + b) * a) / Math.random(); // different every call
}

let counter = 0;
const FakeDate = {
  now() { counter++; return 42; }, // hidden mutation on read
};
function alsoImpure() { return FakeDate.now(); }
```

**Thoughts:** *Same args → same result; the outside world is untouched (including hidden reads).*

**See also:** [Interview — What is a pure function?](./7_special_interview.md#interview-practice) · [JS Functions — Pure vs impure](./3_js_functions.md)

**Sources:**

[javascript.info/functional-programming](https://javascript.info/functional-programming)

---

</details>

<details>
  <summary>Immutability</summary>

### Immutability

**Definition:** Treat every value as **unchangeable** — to "update", return a **new** value with the desired changes instead of mutating in place.

**How it works:**

- Impure style: `let a = 1; a = a * 2` — same binding, new value overwrites.
- FP style: `const changedA = update(a, 2)` — old `a` unchanged; new reference returned.
- In JS: spread (`{ ...obj, key: val }`), `map`/`filter`/`toSorted()`, `structuredClone` for deep copies when needed.
- Snapshots of immutable state enable time-travel debugging (Redux DevTools) — replay history by swapping references.

**When to use:** React state updates, Redux reducers, config objects, concurrent pipelines.

**Pluses and minuses:**

| + | − |
|------|------|
| Easy to reason about — no hidden mutations | Full copies use more memory |
| Safe sharing across threads/workers | Deep nested updates need care (immer, lenses) |
| Change detection by reference (`===`) | Shallow copy — nested objects still mutable unless handled |

**Examples:**

```js
// impure
let a = 1;
const update = (value) => { a = 2 * value; };

// immutable
const a = 1;
const update = (original, value) => original * value;
const changedA = update(a, 2); // a still 1
```

**Thoughts:**

React `setState(s => ({ ...s, count: s.count + 1 }))` is immutability in practice.

*Don't change data — produce new data.*

**Sources:**

[javascript.info/array-methods](https://javascript.info/array-methods)

---

</details>

<details>
  <summary>Recursion & declarative iteration</summary>

### Recursion & declarative iteration

**Definition:** Strict FP avoids mutable loops; iteration is expressed via **recursion**, **`map`**, or **`reduce`** — declarative over collections.

**How it works:**

- **Recursion:** base case + recursive step — mirrors math definitions (factorial, tree walk).
- **`map` / `filter` / `reduce`:** encode loops as transforms — no manual index mutation.
- Tail-call optimization (TCO) is not guaranteed in all JS engines — deep recursion can overflow stack; use iteration or trampolining for huge depths.

**When to use:** Tree/graph traversal, nested structures, functional pipelines. Prefer `map`/`filter` for flat lists.

**Pluses and minuses:**

| + | − |
|------|------|
| Matches mathematical problem statements | Stack overflow on unbounded depth without TCO |
| Declarative, composable | Some devs find recursion harder to debug |
| `reduce` can express any loop | Performance-sensitive hot paths may need imperative loops |

**Examples:**

```js
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

const sum = nums.reduce((acc, n) => acc + n, 0); // declarative fold
```

**Thoughts:** *Repeat via recursion or higher-order array methods — not via mutating loop counters.*

**Sources:**

[javascript.info/recursion](https://javascript.info/recursion)

---

</details>

<details>
  <summary>Higher-order functions (HOF)</summary>

### Higher-order functions (HOF)

**Definition:** A function that **accepts another function as an argument** and/or **returns a function** — the main abstraction tool in FP.

**How it works:**

- Same control flow, different predicate → one `filter(list, predicate)` instead of duplicate loops.
- Returning functions → decorators (`timed(fn)`), factories (`makeAdder(x)`), React HOCs.
- Built-in HOFs: `map`, `filter`, `reduce`, `sort`, `setTimeout`, middleware `use((req,res,next) => ...)`.
- JS functions are **first-class citizens** — assign to variables, pass as args, return from functions (required for HOFs).

```js
const multipleTwo = (n) => n * 2;           // assign to variable
loadData(getData);                           // pass as argument
function makeAdder(x) { return (y) => x + y; } // return from function
```

**When to use:** Array transforms, middleware, event handlers, memoization wrappers, custom `filter`/`once`/`debounce`.

**Pluses and minuses:**

| + | − |
|------|------|
| DRY control flow | Over-nesting obscures execution order |
| Declarative data pipelines | Stack traces through wrappers |
| Basis for Strategy, Decorator patterns | |

**Examples:**

```js
function filter(list, predicate) {
  const result = [];
  list.forEach((value) => {
    if (predicate(value)) result.push(value);
  });
  return result;
}

const isNegative = (n) => n < 0;
const isEven = (n) => n % 2 === 0;
filter([-1, 2, 5, -5, 6], isNegative); // [-1, -5]
filter([-1, 2, 5, -5, 6], isEven);     // [2, 6]
```

**Thoughts:** *Functions are values — pass behavior instead of duplicating loops.*

**See also:** [JS Functions — HOF](./3_js_functions.md)

**Sources:**

[javascript.info/functional-programming](https://javascript.info/functional-programming)

---

</details>

<details>
  <summary>Partial application & currying</summary>

### Partial application & currying

**Definition:** **Partial application** fixes some arguments ahead of time, producing a specialized function. **Currying** transforms `f(a, b, c)` into `f(a)(b)(c)` — automated partial application.

**How it works:**

- Manual partial: `multiply(2)` returns `b => 2 * b` → `const double = multiply(2)`.
- **`Function.prototype.bind`** can partial-apply: `multiply.bind(null, 2)` — less idiomatic in strict FP but practical in JS.
- **Curry** collects args until `args.length >= func.length`, then calls original.
- Curried multiply: `curriedMultiply(2)(10)` or full `curriedMultiply(2, 10)`.

| | Partial application | Currying |
|---|---------------------|----------|
| Goal | Pre-fill known args | Transform signature to unary chain |
| JS tool | `bind`, closures | `curry()` helper, lodash `_.curry` |
| Example | `const double = (x) => multiply(2, x)` | `curry(multiply)(2)(10)` |

**When to use:** Configured validators, API clients with fixed base URL, FP libraries (Ramda). Prefer plain functions when arity is small.

**Pluses and minuses:**

| + | − |
|------|------|
| Reusable configured functions (`double`, `triple`) | `multiply(5)(10)` unfamiliar to newcomers |
| Fewer parameters at call site | Extra function layers |

**Examples:**

```js
function multiply(a, b) { return a * b; }

// partial application
function multiplyBy(a) {
  return (b) => a * b;
}
const double = multiplyBy(2);

// curry
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    }
    return (...args2) => curried.apply(this, args.concat(args2));
  };
}

const curriedMultiply = curry(multiply);
curriedMultiply(2)(10);  // 20
curriedMultiply(2, 10);  // 20 — still works
```

**Thoughts:** *Fix args early → specialized reusable functions; curry automates the wrapping.*

**See also:** [JS Functions — Currying & composition](./3_js_functions.md)

**Sources:**

[javascript.info/currying-partials](https://javascript.info/currying-partials) · [javascript.info/bind](https://javascript.info/bind)

---

</details>

<a name="functional-core-imperative-shell"></a>

<details>
  <summary>Functional core, imperative shell</summary>

### Functional core, imperative shell

**Definition:** Keep **business logic pure** (functional core) inside an **impure boundary** (imperative shell) that handles I/O — the pragmatic FP pattern for real apps.

**How it works:**

- **Sandwich pattern:** I/O → pure transform → I/O.
- Example — update DB record: (1) fetch row [effect], (2) `applyBusinessRules(row, input)` [pure], (3) persist [effect].
- Rule: **impure may call pure; pure must not call impure** — keeps core testable without DB/network mocks.
- Strict FP (Haskell, IO monads) pushes further; JS/TS typically use this lighter pattern.

**When to use:** Redux reducers (pure) + thunks (effects), service layer, React Server Actions (validate pure → DB write impure).

**Pluses and minuses:**

| + | − |
|------|------|
| Core logic unit-testable with plain inputs/outputs | Discipline required — easy to leak I/O into core |
| Clear separation of "what" vs "how to reach world" | Boilerplate adapters at boundaries |

**Examples:**

```js
// pure core
function applyDiscount(cart, coupon) {
  return { ...cart, total: cart.total * (1 - coupon.percent) };
}

// imperative shell
async function checkout(cartId, couponCode) {
  const cart = await db.cart.find(cartId);        // effect
  const coupon = await db.coupon.find(couponCode); // effect
  const updated = applyDiscount(cart, coupon);     // pure
  await db.cart.save(updated);                     // effect
  return updated;
}
```

**Thoughts:** *Effects at the edges; decisions in the middle.*

**See also:** Mark Seemann’s **impure / pure / impure** (“impureim”) sandwich — same idea. Why it lowers test friction: [Making tests easy](./7_special_engineering.md#making-tests-easy).

**Sources:**

[javascript.info/functional-programming](https://javascript.info/functional-programming)

---

</details>

<details>
  <summary>Result containers (Box, Ok / Error)</summary>

### Result containers (Box, Ok / Error)

**Definition:** Wrap values in **containers** so transformations compose via `.map()` without nested `try/catch` at every step — errors short-circuit the chain.

**How it works:**

- **Box:** generic wrapper — `Box(x).map(f).map(g)` threads value through transforms.
- **Ok / Error:** railway-oriented programming — `Ok(x).map(f)` runs `f`; `Error(e).map(f)` **skips** `f` and stays Error.
- Similar to `Maybe`/`Either` in Haskell, `Result` in Rust, or `fp-ts` `Either`.
- Extract final value with `.fold()`, `.getOrElse()`, or pattern match — depends on library.

**When to use:**

Chained validation, parsing pipelines, avoiding `undefined.toUpperCase()` on missing lookup.

#### Common pitfalls

Using arrays as containers (`[str].map(...)[0]`) works for demos but loses error semantics. For production, prefer typed `Result<T, E>` (TS) or `neverthrow` / `fp-ts`.

**Pluses and minuses:**

| + | − |
|------|------|
| Linear pipelines vs nested conditionals | Custom containers add abstraction overhead |
| Errors propagate without boilerplate | JS has no native `Result` — use libs or TS unions |
| Composable with `map` / `flatMap` | |

**Examples:**

```js
const Ok = (x) => ({
  map: (f) => Ok(f(x)),
  fold: (_, onOk) => onOk(x),
});

const Error = (e) => ({
  map: (_f) => Error(e),
  fold: (onErr, _onOk) => onErr(e),
});

const fromNullable = (x) => (x != null ? Ok(x) : Error('missing'));

function findName(alias) {
  return { nagibator3000: 'Mike', superUfaStar: 'Alice' }[alias];
}

// safe chain — no throw if alias missing
fromNullable(findName('missing-alias'))
  .map((v) => v.toUpperCase())
  .map((v) => `@${v}`);
// Error('missing') — subsequent maps skipped
```

**Thoughts:** *Container carries success or failure; `map` on Error is a no-op — errors flow down the track.*

**Sources:**

[Fantasy Land spec](https://github.com/fantasyland/fantasy-land) · Professor Frisby — Composable Functional JavaScript (Egghead)

---

</details>

<details>
  <summary>Pattern matching</summary>

### Pattern matching

**Definition:** Match a value against **patterns** (literals, types, predicates) and execute the corresponding branch — richer than basic `switch`.

**How it works:**

- Conceptually like `switch`, but patterns can include types, guards, destructuring (in ML, Haskell, Rust, TS 5.0+).
- JS native: limited — `switch (value)` on primitives; hack `switch (true)` with predicate cases.
- TS 5.0 **`switch (x) { case { kind: 'ok' }: ... }`** — structural pattern matching (experimental/stable per TS version).
- Libraries: `ts-pattern`, `zod` `.safeParse` + exhaustive checks.

**When to use:** Discriminated unions in TS, parsing ADTs, routing on event types.

**Pluses and minuses:**

| + | − |
|------|------|
| Exhaustiveness checking (with TS) | Verbose in plain JS without libs |
| Replaces nested if/else for unions | `switch (true)` hacks are fragile |

**Examples:**

```js
function stringifyAmount(amount) {
  switch (true) {
    case amount === 0:
      return 'Empty!';
    case amount > 0 && amount < 10:
      return 'A few';
    default:
      return 'Many';
  }
}
```

**Thoughts:** *One value, many shapes — pick the branch that matches.*

**Sources:**

[TypeScript — switch/statements](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)

---

</details>

<details>
  <summary>FP — math foundations, pros & cons</summary>

### FP — math foundations, pros & cons

**Definition:** FP interprets functions as **mathematical mappings** — foundations in **lambda calculus** (computation) and **category theory** (composition of structures).

**How it works:**

- Math functions: one input → one output, no side effects — FP mirrors this ideal.
- **Referential transparency** → compiler can pre-evaluate pure subexpressions (constant folding, memoization at compile time).
- **No shared mutable state** → safe parallelism (workers, concurrent pipelines).
- Category theory terms in JS ecosystem: **functors** (`map`), **monads** (`flatMap` / chain), **semigroups** (`concat`) — [Fantasy Land](https://github.com/fantasyland/fantasy-land) spec.

Мат. основа — лямбда-исчисление, теория категорий. Плюсы: тесты, параллелизм, оптимизация. Минусы: память, интеграция с I/O.

**When to use:** Data-heavy backends (Clojure, Elixir), frontend transforms (React + Redux), concurrent systems. Less ideal for rapid UI prototyping where mutation is faster.

**Pluses and minuses:**

| + | − |
|------|------|
| **Reliability & testing** — pure fns need minimal test infra; static types catch more | **Memory** — immutable updates copy state |
| **Compile-time optimization** — referential transparency | **Impure reality** — DB, API, UI are all effects |
| **Parallelism / thread safety** — no races on shared vars | **Learning curve** — monad tutorials, jargon |
| **Living docs** — composed pure functions read as specs | Some algorithms unnatural without mutation |

**Thoughts:**

"Functional core, imperative shell" is the pragmatic compromise in JS/TS. React blends OOP-like components with FP state updates.

*Math-like functions at the core; effects quarantined; trade memory for predictability.*

**Sources:**

[Fantasy Land](https://github.com/fantasyland/fantasy-land) · [Doka — FP](https://doka.guide/tools/programming-paradigms/)

---

</details>

<details>
  <summary>OOP vs FP</summary>

### OOP vs FP

**Definition:**

Comparison of object-oriented and functional composition styles — objects encapsulate state vs functions transform immutable data.

| | OOP | FP |
|---|-----|-----|
| Unit of composition | Object | Function |
| State | Encapsulated in objects | Avoided or isolated |
| Extension | Inheritance / interfaces | Composition + HOFs |
| Best for | Entity-rich domains | Data pipelines, transforms |

**How it works:**

ООП — сущности со состоянием. ФП — преобразования данных. Во фронте обычно смесь (компоненты + чистые селекторы).

---

**When to use:** Hybrid is standard in modern frontend — OOP for components/classes, FP for state and selectors.

**Pluses and minuses:**

| + (combining) | − |
|------------------|------|
| React: components (OOP-like) + hooks (FP) | Inconsistent style across codebase |
| Domain objects + pure utilities | Team must agree on boundaries |

**Thoughts:** Interview: "Neither replaces the other. Use objects for nouns, functions for verbs."

</details>

<details>
  <summary>Choosing a paradigm in practice</summary>

### Choosing a paradigm in practice

**Definition:** Pure FP and pure OOP are both rare in production. Pick the style that makes **this** task cheap — team conventions, language, and habit matter; **fit to the problem** matters most.

**How it works:**

One function is enough → do not spawn a class zoo. Need I/O → do not refuse FP’s testable core; put effects at the edge. JS is **multi-paradigm** (OOP via prototypes/`class` with caveats). Same module can be a stateful `Calculator` or `add`/`subtract` of arguments.

Чистый ФП и чистый ООП редко нужны. Одна функция — не зоопарк классов. JS можно мешать. Удобство задачи важнее «чистоты» парадигмы.

**When to use:** Default to the smallest abstraction. Mix procedural glue, OOP entities, and FP transforms in one JS app.

**Examples:**

```js
class Calculator {
  constructor(initial = 0) {
    this.value = initial;
  }
  add(x) {
    this.value += x;
  }
  subtract(x) {
    this.value -= x;
  }
  valueOf() {
    return this.value;
  }
}

const calculator = new Calculator();
calculator.add(3);
calculator.add(4);
calculator.subtract(1);
calculator.valueOf(); // 6

function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
subtract(add(add(0, 3), 4), 1); // 6
```

**Thoughts:** Convenience for the task beats paradigm purity — JS lets you mix.

**Sources:**

[Doka — programming paradigms](https://doka.guide/tools/programming-paradigms/)

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

| + (composition) | − |
|------------------|------|
| Loose coupling; swap behaviors at runtime | More boilerplate wiring |
| Avoids fragile base class problem | Many small objects to track |
| Aligns with LSP and OCP | |

| + (inheritance) | − |
|--------------------|------|
| Fast to prototype shared behavior | Changes in base break subclasses |
| Clear taxonomy | Deep trees resist refactoring |

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

<a name="3-architecture-patterns"></a>
