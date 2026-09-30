# TypeScript — Classes

Classes, access modifiers, inheritance, abstract classes, and interfaces with `implements`.

[← Back to hub](./5_ts.md)

### Related docs

* [TypeScript — hub](./5_ts.md) · [Interview](./5_ts_interview.md)

### Sections

- [Classes & OOP](#classes-oop)
- [Design principles](#design-principles)

---

## Classes & OOP

<details>
  <summary>Design-first OOP with interfaces</summary>

### Design-first OOP with interfaces

**Definition:** Describe entity contracts (`interface`, `type`) before implementations. TypeScript checks relations at compile time; emitted JS has no types left.

**How it works:**

- An **interface** is a behavior contract — any object that matches the shape is usable (structural typing).
- Sketch `Ledger` / `LedgerEntry` first; implement classes later. Broken wiring fails in `tsc`, not in production.
- Prefer `type` aliases for branded scalars (`MoneyAmount`) and unions (`RecordKind`). Do **not** name a type `Record` — it clashes with the built-in `Record<K, V>`.
- `enum` works but adds runtime JS and quirks; string unions are usually enough.

**When to use:** Domain models, DI graphs, public module APIs. Skip for throwaway scripts.

**Pluses and minuses:**

| +                                  | −                                   |
| ---------------------------------- | ----------------------------------- |
| Catch bad entity graphs before run | Types erased — runtime still JS     |
| Autocomplete on domain fields      | Over-modeling small scripts         |
| `implements` documents composition | TS `private` is not runtime privacy |

**Examples:**

```ts
type MoneyAmount = number;
type TimeStamp = number;
type RecordKind = "spending" | "income";

type LedgerEntry = {
  kind: RecordKind;
  amount: MoneyAmount;
  dateTime: TimeStamp;
};

interface Ledger {
  addRecord(record: LedgerEntry): void;
}

class History implements Ledger {
  private records: LedgerEntry[] = []; // compile-time only — use #records for runtime privacy
  addRecord(record: LedgerEntry): void {
    this.records.push(record);
  }
}
```

**Thoughts:** Why TS if runtime is JS? Same as engine diagnostics before you drive — you learn about a broken contract before traffic. Full OOP design: [7_special.md](./7_special_engineering.md#object-oriented-programming-oop).

**Sources:** [Doka — OOP](https://doka.guide/tools/oop/) · [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) · [Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>

<details>
  <summary>OOP in TypeScript</summary>

### OOP in TypeScript

**Definition:** TypeScript adds **static types** on top of JavaScript's prototype-based runtime. The four OOP pillars still apply, but TS adds **interfaces**, **abstract classes**, **access modifiers**, and **structural typing** — checked at compile time and **erased** in emitted JS.

**How it works:**

| Pillar            | TypeScript mechanism                                                                |
| ----------------- | ----------------------------------------------------------------------------------- |
| **Encapsulation** | `private` / `protected` / `readonly` (compile-time); `#field` (runtime, same as JS) |
| **Abstraction**   | `interface`, `abstract class`, small public class API                               |
| **Inheritance**   | `extends` one class; methods live on the prototype chain in emit                    |
| **Polymorphism**  | Method overrides + `implements` contracts; structural typing by shape               |

- **Structural typing:** compatible shapes assign — a plain object can satisfy an `interface` without `implements`.
- **`implements`:** class explicitly promises an interface shape; `tsc` errors on mismatch.
- **`extends`:** single base class only (JS limitation); stack multiple contracts with `implements A, B`.
- **`private` / `protected`:** erased in emit — not enforced at runtime. Use `#` when you need real hiding.
- **`abstract class`:** cannot instantiate; may mix concrete and abstract methods.

**When to use:** Domain models, DI graphs, public SDKs, teams that need contracts. Overkill for throwaway scripts.

**Pluses and minuses:**

| +                                                           | −                                                                      |
| ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| `interface` + `implements` document and enforce contracts   | Types erase — runtime is still untyped JS                              |
| Structural typing is flexible for adapters and tests        | Two types with the same shape are interchangeable even if names differ |
| `abstract class` shares implementation + enforces overrides | Over-modeling small scripts adds noise                                 |

**Examples:**

**Encapsulation** — state changes only through methods; `#` enforces privacy at runtime:

```ts
class BankAccount {
  #balance = 0;
  deposit(amount: number) {
    if (amount <= 0) throw new Error("amount must be positive");
    this.#balance += amount;
  }
  withdraw(amount: number) {
    if (amount > this.#balance) throw new Error("insufficient funds");
    this.#balance -= amount;
  }
  getBalance(): number {
    return this.#balance;
  }
}
// account.#balance → SyntaxError
```

**Abstraction** — `interface` hides transport; checkout depends on _what_, not _how_:

```ts
interface PaymentGateway {
  charge(amount: number): Promise<{ ok: boolean }>;
}

class StripeGateway implements PaymentGateway {
  async charge(amount: number) {
    const res = await fetch("/api/charge", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
    return { ok: res.ok };
  }
}

async function checkout(total: number, gateway: PaymentGateway) {
  return gateway.charge(total); // no Stripe URL or auth headers here
}
```

**Inheritance** — parent holds shared code; child overrides only what differs:

```ts
class Employee {
  constructor(public name: string) {}
  getRole(): string {
    return "employee";
  }
}

class Manager extends Employee {
  getRole(): string {
    return "manager";
  }
}

const staff: Employee[] = [new Employee("Ann"), new Manager("Bob")];
staff.map((e) => e.getRole()); // ['employee', 'manager']
```

**Polymorphism** — one `send()` call; swap `EmailAlert` / `SmsAlert` without changing the caller:

```ts
interface Notifier {
  send(message: string): void;
}

class EmailAlert implements Notifier {
  send(message: string) {
    console.log("email:", message);
  }
}

class SmsAlert implements Notifier {
  send(message: string) {
    console.log("sms:", message);
  }
}

function notifyAll(alerts: Notifier[], text: string) {
  alerts.forEach((a) => a.send(text));
}

notifyAll([new EmailAlert(), new SmsAlert()], "Order shipped");
```

**Thoughts:** TS OOP = JS runtime + compile-time contracts. Privacy: [TS `private` vs `#` fields](#ts-private-vs-fields). Design-first workflow: [Design-first OOP with interfaces](#design-first-oop-with-interfaces). Pillars theory: [OOP & SOLID](./7_special_engineering.md#object-oriented-programming-oop). JS mechanisms: [OOP in JavaScript](./3_js_oop.md#oop-in-javascript).

**Sources:** [TypeScript handbook — Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) · [TypeScript handbook — Object types](https://www.typescriptlang.org/docs/handbook/2/objects.html) · [MDN — Private elements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements) · [Doka — OOP](https://doka.guide/tools/oop/) · [OOP & SOLID](./7_special_engineering.md#object-oriented-programming-oop) · [OOP in JavaScript](./3_js_oop.md#oop-in-javascript)

</details>

<details>
  <summary>TS `private` vs `#` fields</summary>

### TS `private` vs `#` fields

**Definition:** `private` / `protected` are **compile-time** only (erased in emit). `#field` is an ECMAScript private slot — inaccessible outside the class **at runtime**.

**How it works:**

- `private foo` → still `instance.foo` in the compiled JS; `instance["foo"]` also works. `tsc` errors; JS consumers do not.
- `#foo` → `SyntaxError` outside the class; `instance["#foo"]` is `undefined`, not the value.
- Chrome DevTools may read `#` fields in the console for debugging — not a language hole.

|                 | `private` (TS)              | `#field` (ES)                      |
| --------------- | --------------------------- | ---------------------------------- |
| Enforced by     | compiler                    | runtime                            |
| Survives emit   | no — public property        | yes — private slot                 |
| Subclass access | `protected` yes             | no (unless getter)                 |
| Old targets     | works (it's a normal field) | needs downlevel or modern runtimes |

**When to use:** Library shipped as JS → `#` if you need real hiding. App-only TS → `private` is often enough plus team discipline.

**Examples:**

```ts
class C {
  private foo = 10;
  #bar = 20;
}
console.log(new C().foo); // tsc error; prints 10 in JS
console.log(new C()["foo"]); // 10
// new C().#bar; // SyntaxError at compile *and* runtime
```

**Thoughts:** TS privacy is a seatbelt in the type-checker; `#` is a lock on the object.

**Sources:** [TypeScript 3.8 — private fields](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html) · [MDN — private elements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements)

</details>

<details>
  <summary>Classes & OOP</summary>

### Verbose constructor vs parameter properties

**Definition:**

constructor(name: string, age: number, nickName: string) {

this.name = name;
this.age = age;
this.nickName = nickName;
}
}

| Aspect  | Detail                                                     |
| ------- | ---------------------------------------------------------- |
| Summary | constructor(name: string, age: number, nickName: string) { |

    this.name = name;
    this.age = age;
    this.nickName = |

**Examples:**

```typescript
class User {
  name: string;
  age: number;
  nickName: string;

  constructor(name: string, age: number, nickName: string) {
    this.name = name;
    this.age = age;
    this.nickName = nickName;
  }
}

const dev = new User("RR", 999, "018");
```

```typescript
class User {
  constructor(
    public name: string,
    public age: number,
    public nickName: string,
    public pass: number,
  ) {}
}
```

```typescript
class User {
  name: string;
  age = 20;
  nickName = "webDev";

  constructor(name: string) {
    this.name = name;
  }

  getPass() {
    return `${this.nickName}${this.age}`; // "webDev20"
  }
}
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Access Modifiers

**Definition:**

Keywords controlling visibility of class members: `public`, `private`, `protected`, `readonly`.

| When to use                                                                                                                             | Notes                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Default is `public`. `private` — class only; `protected` — class + subclasses. TS modifiers are compile-time unless you use `#` fields. | `private`/`protected` in TS are **compile-time only** unless you use ECMAScript `#private` fields. Two structurally identical classes with different `private` members are **not** assignable to each ot |

**Examples:**

```typescript
class User {
  public name: string;
  private nickName: string;
  protected age: number;
  readonly pass: number;

  constructor(name: string, age: number, nickName: string, pass: number) {
    this.name = name;
    this.age = age;
    this.nickName = nickName;
    this.pass = pass;
  }
}

const dev = new User("RR", 30, "webDev", 123);
dev.name; // OK
// dev.nickName; // Error — private
// dev.age;      // Error — protected (outside subclass)
// dev.pass = 1; // Error — readonly
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Parameter Properties

**Definition:**

Constructor shorthand: `constructor(public name: string)` declares and assigns in one line.

| Aspect  | Detail                                                                                      |
| ------- | ------------------------------------------------------------------------------------------- |
| Summary | Constructor shorthand: `constructor(public name: string)` declares and assigns in one line. |

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Compiled output — static on the constructor

**Definition:**

After compilation, `static` lives on the class function, not instances:

| Aspect  | Detail                                                                  |
| ------- | ----------------------------------------------------------------------- |
| Summary | After compilation, `static` lives on the class function, not instances: |

After compilation, `static` lives on the class |

After compilation, `static` lives on the class function, not instances:

**Examples:**

```javascript
"use strict";
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  getPass() {
    return this.name + User.secret;
  }
}
User.secret = 12345;
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Method override in subclass

**Definition:**

Method override in subclass — TypeScript language or compiler feature.

| Aspect  | Detail                                                                 |
| ------- | ---------------------------------------------------------------------- |
| Summary | Method override in subclass — TypeScript language or compiler feature. |

**Examples:**

```typescript
class Child extends User {
  constructor(age: number) {
    super("Yauhen", age);
  }
  getPass() {
    return `${this.age}${this.name}${User.secret}`; // "31Yauhen12345"
  }
}
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Abstract Classes vs Interfaces

**Definition:**

Two ways to define contracts — abstract classes can have implementation; interfaces are signatures only.

| Aspect  | Detail                                                                                                   |
| ------- | -------------------------------------------------------------------------------------------------------- |
| Summary | Two ways to define contracts — abstract classes can have implementation; interfaces are signatures only. |

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Abstract class example

**Definition:**

Abstract class example — TypeScript language or compiler feature.

| Aspect  | Detail                                                            |
| ------- | ----------------------------------------------------------------- |
| Summary | Abstract class example — TypeScript language or compiler feature. |

**Examples:**

```typescript
abstract class User {
  constructor(
    public name: string,
    public age: number,
  ) {}
  greet() {
    console.log(this.name);
  }
  abstract getPass(): string; // must implement in subclass
}

class Child extends User {
  constructor(age: number) {
    super("Yauhen", age);
  }
  getPass() {
    return `${this.age}${this.name}`;
  }
}

const y = new Child(31);
y.greet(); // "Yauhen"
y.getPass(); // "31Yauhen"
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Interfaces with classes

**Definition:**

Using interfaces to describe class instance shapes and contracts.

| Aspect  | Detail                                                            |
| ------- | ----------------------------------------------------------------- |
| Summary | Using interfaces to describe class instance shapes and contracts. |

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Optional, readonly, and index signatures

**Definition:**

// Excess property check — extra keys error unless index signature allows them

interface FlexibleUser {
name: string;
age: number;
[propName: string]: unknown;
}

| Aspect  | Detail                                                                         |
| ------- | ------------------------------------------------------------------------------ |
| Summary | // Excess property check — extra keys error unless index signature allows them |

interface FlexibleUser {
name: string;
|

**Examples:**

```typescript
interface User {
  readonly name: string;
  age?: number;
}

// Excess property check — extra keys error unless index signature allows them
interface FlexibleUser {
  name: string;
  age: number;
  [propName: string]: unknown;
}

const u: FlexibleUser = {
  name: "Yauhen",
  age: 31,
  nickName: "webDev",
};
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### `implements` one or many interfaces

**Definition:**

getPass() {

return `${this.name}${this.age}`;
}
}

| Aspect  | Detail      |
| ------- | ----------- |
| Summary | getPass() { |

    return `${this.name}${this.age}`;

}
} |

**Examples:**

```typescript
interface User {
  name: string;
  age: number;
}
interface Pass {
  getPass(): string;
}

class Employee implements User, Pass {
  name = "Yauhen";
  age = 31;
  nickName = "webDev"; // extra members OK

  getPass() {
    return `${this.name}${this.age}`;
  }
}

interface Admin extends User {
  getPass(): string;
}

class Manager implements Admin {
  name = "Max";
  age = 20;
  getPass() {
    return `${this.name}${this.age}`;
  }
}
```

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

### `implements`

**Definition:**

Promise that a class satisfies an interface contract — all required members must exist.

| Aspect  | Detail                                                                                  |
| ------- | --------------------------------------------------------------------------------------- |
| Summary | Promise that a class satisfies an interface contract — all required members must exist. |

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<a name="design-principles"></a>

## Design principles

<details>
  <summary>SOLID in TypeScript</summary>

### SOLID in TypeScript

**Definition:** The five **SOLID** principles applied to **TypeScript interfaces, classes, and modules** — compile-time contracts via `interface`, `implements`, and constructor injection.

| Principle                     | Meaning                         | TypeScript example                                                                    |
| ----------------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| **S** — Single Responsibility | One reason to change per module | `UserRepository` reads data · `UserFormatter` shapes labels — not one god class       |
| **O** — Open/Closed           | Extend via new code, not edits  | New `StripeProcessor implements PaymentProcessor` — don't edit `CheckoutService`      |
| **L** — Liskov Substitution   | Subtypes honor parent contract  | Every `UserStore` passed to `loadProfile()` must return the same `{ id, name }` shape |
| **I** — Interface Segregation | Small focused interfaces        | `ReadableLedger` for reports — not a fat `Ledger` with `write()` / `delete()`         |
| **D** — Dependency Inversion  | Depend on abstractions          | `placeOrder(id, logger: Logger)` — inject `Logger`, not a concrete console adapter    |

**How it works:**

Each letter matches the **Examples** below — look for `// good` and `// bad`:

1. **S** — split repository vs formatter with separate `interface`s — not one service class.
2. **O** — new provider = new class implementing the interface — not a growing `if/else` in one class.
3. **L** — `implements UserStore` must satisfy the return type — `tsc` catches broken substitutes.
4. **I** — pass `ReadableLedger` where reads are enough — don't require unused write APIs.
5. **D** — domain functions take `Logger` / `DbClient` types — wiring layer picks concrete implementations.

**When to use:** Domain models, services, DI graphs, public module APIs. Skip heavy interfaces on a one-off script.

**Examples:**

```typescript
type DbClient = { query(id: string): Promise<{ id: string; name: string }> };

// S — good: repository vs formatter — separate interfaces
interface UserRepository {
  findById(id: string): Promise<{ id: string; name: string }>;
}

interface UserFormatter {
  label(user: { name: string; email: string }): string;
}

class DbUserRepository implements UserRepository {
  constructor(private db: DbClient) {}
  findById(id: string) {
    return this.db.query(id);
  }
}

// S — bad: one class loads users and formats UI labels
// class UserService {
//   findById(id: string) {
//     return this.db.query(id);
//   }
//   label(user: { name: string; email: string }) {
//     return `${user.name} <${user.email}>`;
//   }
// }

// O — good: new processor = new class implementing PaymentProcessor
interface PaymentProcessor {
  charge(amount: number): Promise<{ ok: true }>;
}

class StripeProcessor implements PaymentProcessor {
  charge(amount: number) {
    return Promise.resolve({ ok: true as const });
  }
}

class CheckoutService {
  constructor(private payments: PaymentProcessor) {}
  checkout(amount: number) {
    return this.payments.charge(amount);
  }
}

// O — bad: edit CheckoutService for every provider
// class CheckoutService {
//   checkout(provider: "stripe" | "paypal", amount: number) {
//     if (provider === "stripe") return payStripe(amount);
//     if (provider === "paypal") return payPaypal(amount);
//   }
// }

// L — good: any UserStore works in loadProfile
interface UserStore {
  get(id: string): Promise<{ id: string; name: string }>;
}

async function loadProfile(id: string, store: UserStore) {
  return store.get(id);
}

class CachedUserStore implements UserStore {
  get(id: string) {
    return Promise.resolve({ id, name: "Ada" });
  }
}

// L — bad: returns string instead of contract — tsc error + broken callers
// class BrokenUserStore implements UserStore {
//   get(id: string) {
//     return Promise.resolve("missing");
//   }
// }

// I — good: report needs only ReadableLedger
interface ReadableLedger {
  read(id: string): Promise<{ id: string; total: number }>;
}

function buildReport(ledger: ReadableLedger) {
  return ledger.read("summary");
}

// I — bad: read-only code forced to depend on write/delete APIs
// interface Ledger {
//   read(id: string): Promise<{ id: string; total: number }>;
//   write(entry: { id: string; total: number }): Promise<void>;
//   delete(id: string): Promise<void>;
// }
// function buildReport(ledger: Ledger) {
//   return ledger.read("summary");
// }

// D — good: inject Logger abstraction
interface Logger {
  info(message: string): void;
}

function placeOrder(orderId: string, logger: Logger) {
  logger.info(`Processing ${orderId}`);
}

// D — bad: domain imports concrete infra
// import { consoleLogger } from "./infra/logger";
// function placeOrder(orderId: string) {
//   consoleLogger.info(`Processing ${orderId}`);
// }
```

**Thoughts:** TypeScript makes **I**, **L**, and **D** visible at compile time — but types erase at runtime; behavior contracts still matter. JS fundamentals: [SOLID in Classes](./3_js_core.md#solid-in-classes) · [SOLID in Functions](./3_js_core.md#solid-in-functions). Framework mapping: [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express). Vue SFC typing (`defineProps`, `vue-tsc`): [TypeScript with Vue](./4_vue_composition.md#typescript-with-vue). Full reference: [OOP & SOLID](./7_special_engineering.md#solid-overview).

**Sources:** [TypeScript handbook — Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) · [TypeScript handbook — Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) · [SOLID (overview)](./7_special_engineering.md#solid-overview) · [JS — SOLID in Classes](./3_js_core.md#solid-in-classes) · [JS — SOLID in Functions](./3_js_core.md#solid-in-functions) · [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express) · [TypeScript with Vue](./4_vue_composition.md#typescript-with-vue)

</details>

<a name="generics"></a>
