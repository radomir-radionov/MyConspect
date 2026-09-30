# TypeScript — Классы

Классы, модификаторы доступа, наследование, абстрактные классы и `implements`.

[← Назад к хабу](./5_ts.md)

### Related docs

* [TypeScript — hub](./5_ts.md) · [Интервью](./5_ts_interview.md)

### Sections

- [Classes & OOP](#classes-oop)
- [Design principles](#design-principles)

---

## Classes & OOP

<details>
  <summary>Design-first OOP with interfaces</summary>

### Design-first OOP with interfaces

**Definition:** Описать контракты с сущностями (`interface`, `type`) перед реализациями. TypeScript проверяет отношения во время компиляции; в исходном JS не осталось типов.

**How it works:**

- **Интерфейс** — это контракт поведения: любой объект, соответствующий форме, можно использовать (структурная типизация).
- Эскиз `Ledger` / `LedgerEntry` первый; реализовать классы позже. Сломанная проводка выходит из строя `tsc`, не в производстве.
- Предпочитать `type` псевдонимы для фирменных скаляров (`MoneyAmount`) и союзы (`RecordKind`). **Не** называйте тип `Record` — конфликтует со встроенным `Record<K, V>`.
- `enum` работает, но добавляет JS во время выполнения и особенности; строковых объединений обычно достаточно.

**When to use:** Модели предметной области, графики внедрения зависимостей, API общедоступных модулей. Пропустите одноразовые сценарии.

**Pluses and minuses:**

| +                                              | −                                                          |
| ---------------------------------------------- | ---------------------------------------------------------- |
| Отловить плохие графы сущностей перед запуском | Типы стерты — среда выполнения все еще JS                  |
| Автозаполнение полей домена                    | Перемоделирование небольших скриптов                       |
| `implements` составление документов            | ТС `private` это не конфиденциальность во время выполнения |

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

**Thoughts:** Почему TS, если среда выполнения — JS? То же, что и диагностика двигателя перед поездкой — о расторгнутом контракте вы узнаете еще до пробки. Полный дизайн ООП: [7_special.md](./7_special_engineering.md#object-oriented-programming-oop).

**Sources:** [Doka — ООП](https://doka.guide/tools/oop/) · [Справочник TypeScript — классы](https://www.typescriptlang.org/docs/handbook/2/classes.html) · [Повседневные типы](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>

<details>
  <summary>OOP in TypeScript</summary>

### OOP in TypeScript

**Definition:** TypeScript добавляет **статические типы** поверх прототипного рантайма JavaScript. Четыре столпа ООП сохраняются, но TS добавляет **интерфейсы**, **абстрактные классы**, **модификаторы доступа** и **структурную типизацию** — проверка при компиляции, в emit **стирается**.

**How it works:**

| Столп            | Механизм TypeScript                                                               |
| ---------------- | --------------------------------------------------------------------------------- |
| **Инкапсуляция** | `private` / `protected` / `readonly` (compile-time); `#field` (runtime, как в JS) |
| **Абстракция**   | `interface`, `abstract class`, небольшой публичный API класса                     |
| **Наследование** | `extends` одного класса; методы в emit на цепочке прототипов                      |
| **Полиморфизм**  | Переопределения методов + контракты `implements`; структурная типизация по форме  |

- **Структурная типизация:** совместимые формы присваиваются — plain object может удовлетворять `interface` без `implements`.
- **`implements`:** класс явно обещает форму интерфейса; `tsc` ругается при расхождении.
- **`extends`:** только один базовый класс (ограничение JS); несколько контрактов — `implements A, B`.
- **`private` / `protected`:** стираются в emit — в рантайме не защищают. Для реального сокрытия — `#`.
- **`abstract class`:** нельзя инстанцировать; можно смешивать конкретные и абстрактные методы.

**When to use:** Доменные модели, DI, публичные SDK, команды с контрактами. Для одноразовых скриптов — избыточно.

**Pluses and minuses:**

| +                                                              | −                                                                            |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `interface` + `implements` документируют и проверяют контракты | Типы стираются — рантайм остаётся нетипизированным JS                        |
| Структурная типизация гибка для адаптеров и тестов             | Две формы с одинаковыми полями взаимозаменяемы, даже если имена типов разные |
| `abstract class` делит реализацию и требует override           | Перемоделирование мелких скриптов добавляет шум                              |

**Examples:**

**Encapsulation** — состояние меняется только через методы; `#` защищает приватность в рантайме:

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

**Abstraction** — `interface` скрывает транспорт; checkout зависит от _что_, а не _как_:

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
  return gateway.charge(total); // без URL Stripe и заголовков auth
}
```

**Inheritance** — общий код в родителе; потомок переопределяет только отличия:

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

**Polymorphism** — один вызов `send()`; меняйте `EmailAlert` / `SmsAlert` без правок вызывающего кода:

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

**Thoughts:** ООП в TS = JS-рантайм + контракты на этапе компиляции. Приватность: [TS `private` vs `#` fields](#ts-private-vs-fields). Design-first: [Design-first OOP with interfaces](#design-first-oop-with-interfaces). Теория столпов: [OOP & SOLID](./7_special_engineering.md#object-oriented-programming-oop). Механизмы JS: [OOP in JavaScript](./3_js_oop.md#oop-in-javascript).

**Sources:** [TypeScript handbook — Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) · [TypeScript handbook — Object types](https://www.typescriptlang.org/docs/handbook/2/objects.html) · [MDN — Private elements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements) · [Doka — OOP](https://doka.guide/tools/oop/) · [OOP & SOLID](./7_special_engineering.md#object-oriented-programming-oop) · [OOP in JavaScript](./3_js_oop.md#oop-in-javascript)

</details>

<details>
  <summary>TS `private` vs `#` fields</summary>

### TS `private` vs `#` fields

**Definition:** `private` / `protected` являются **только во время компиляции** (удаляются при генерации). `#field` — это частный слот ECMAScript, недоступный за пределами класса **во время выполнения**.

**How it works:**

- `private foo` → еще `instance.foo` в скомпилированном JS; `instance["foo"]` тоже работает. `tsc` ошибки; Потребители JS этого не делают.
- `#foo` → `SyntaxError` вне класса; `instance["#foo"]` is `undefined`, а не значение.
- Chrome DevTools может читать `#` поля в консоли для отладки — не языковая дыра.

|                    | `private` (TS)                   | `#field` (ИС)                                       |
| ------------------ | -------------------------------- | --------------------------------------------------- |
| Принудительно      | компилятор                       | время выполнения                                    |
| Выживает испускает | нет — общественная собственность | да — приватный слот                                 |
| Доступ к подклассу | `protected` да                   | нет (если только геттер)                            |
| Старые цели        | работает (это обычное поле)      | нужна более ранняя или современная среда выполнения |

**When to use:** Библиотека поставляется как JS → `#` если вам нужно настоящее сокрытие. Только приложение TS → `private` зачастую достаточно плюс командная дисциплина.

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

**Thoughts:** TS приватность — ремень безопасности в тип-чекере; `#` это блокировка объекта.

**Sources:** [TypeScript 3.8 — частные поля] (https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html) · [MDN — частные элементы] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements)

</details>

<details>
  <summary>Classes & OOP</summary>

### Verbose constructor vs parameter properties

**Definition:**

конструктор (имя: строка, возраст: номер, ник: строка) {

это.имя = имя;
this.age = возраст;
this.nickName = псевдоним;
}
}

| Аспект | Деталь                                                   |
| ------ | -------------------------------------------------------- |
| Резюме | конструктор (имя: строка, возраст: номер, ник: строка) { |

    это.имя = имя;
    this.age = возраст;
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

**Sources:** [Справочник по TypeScript — классы] (https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Access Modifiers

**Definition:**

Ключевые слова, управляющие видимостью членов класса: `public`, `private`, `protected`, `readonly`.

| Когда использовать                                                                                                                                                | Заметки                                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| По умолчанию `public`. `private` — только класс; `protected` — класс + подклассы. Модификаторы TS создаются во время компиляции, если вы не используете `#` поля. | `private`/`protected` в TS используются **только во время компиляции**, если вы не используете ECMAScript. `#private` поля. Два структурно одинаковых класса с разными `private` члены **не** могут быть назначены каждому из |

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

**Sources:** [Справочник по TypeScript — классы] (https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Parameter Properties

**Definition:**

Сокращение конструктора: `constructor(public name: string)` объявляет и назначает в одной строке.

| Аспект | Деталь                                                                                            |
| ------ | ------------------------------------------------------------------------------------------------- |
| Резюме | Сокращение конструктора: `constructor(public name: string)` объявляет и назначает в одной строке. |

**Sources:** [Справочник по TypeScript — классы] (https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Compiled output — static on the constructor

**Definition:**

После компиляции `static` живет в функции класса, а не в экземплярах:

| Аспект | Деталь                                                                |
| ------ | --------------------------------------------------------------------- |
| Резюме | После компиляции `static` живет в функции класса, а не в экземплярах: |

После компиляции `static` живет в классе |

После компиляции `static` живет в функции класса, а не в экземплярах:

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

**Sources:** [Справочник по TypeScript — классы] (https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Method override in subclass

**Definition:**

Переопределение метода в подклассе — функция языка TypeScript или компилятора.

| Аспект | Деталь                                                                         |
| ------ | ------------------------------------------------------------------------------ |
| Резюме | Переопределение метода в подклассе — функция языка TypeScript или компилятора. |

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

**Sources:** [Справочник по TypeScript — классы] (https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Abstract Classes vs Interfaces

**Definition:**

Два способа определения контрактов: абстрактные классы могут иметь реализацию; интерфейсы являются только сигнатурами.

| Аспект | Деталь                                                                                                                 |
| ------ | ---------------------------------------------------------------------------------------------------------------------- |
| Резюме | Два способа определения контрактов: абстрактные классы могут иметь реализацию; интерфейсы являются только сигнатурами. |

**Sources:** [Справочник по TypeScript — классы] (https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Abstract class example

**Definition:**

Пример абстрактного класса — язык TypeScript или функция компилятора.

| Аспект | Деталь                                                                |
| ------ | --------------------------------------------------------------------- |
| Резюме | Пример абстрактного класса — язык TypeScript или функция компилятора. |

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

**Sources:** [Справочник по TypeScript — классы] (https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Interfaces with classes

**Definition:**

Использование интерфейсов для описания форм и контрактов экземпляров классов.

| Аспект | Деталь                                                                        |
| ------ | ----------------------------------------------------------------------------- |
| Резюме | Использование интерфейсов для описания форм и контрактов экземпляров классов. |

**Sources:** [Справочник по TypeScript — классы] (https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Optional, readonly, and index signatures

**Definition:**

// Лишняя проверка свойств — ошибка дополнительных ключей, если сигнатура индекса их не допускает

интерфейс FlexibleUser {
имя: строка;
возраст: номер;
[propName: строка]: неизвестно;
}

| Аспект | Деталь                                                                                            |
| ------ | ------------------------------------------------------------------------------------------------- |
| Резюме | // Лишняя проверка свойств — ошибка дополнительных ключей, если сигнатура индекса их не допускает |

интерфейс FlexibleUser {
имя: строка;
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

**Sources:** [Справочник по TypeScript — классы] (https://www.typescriptlang.org/docs/handbook/2/classes.html)

### `implements` one or many interfaces

**Definition:**

getPass() {

возвращение `${this.name}${this.age}`;
}
}

| Аспект | Деталь      |
| ------ | ----------- |
| Резюме | getPass() { |

    возвращение `${this.name}${this.age}`;

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

**Sources:** [Справочник по TypeScript — классы] (https://www.typescriptlang.org/docs/handbook/2/classes.html)

### `implements`

**Definition:**

Пообещайте, что класс удовлетворяет контракту интерфейса — все необходимые члены должны существовать.

| Аспект | Деталь                                                                                                |
| ------ | ----------------------------------------------------------------------------------------------------- |
| Резюме | Пообещайте, что класс удовлетворяет контракту интерфейса — все необходимые члены должны существовать. |

**Sources:** [TypeScript handbook — classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<a name="design-principles"></a>

## Design principles

<details>
  <summary>SOLID in TypeScript</summary>

### SOLID in TypeScript

**Definition:** Пять принципов **SOLID** для **TypeScript interfaces, classes и modules** — compile-time контракты через `interface`, `implements` и constructor injection.

| Principle                     | Meaning                            | TypeScript example                                                                 |
| ----------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------- |
| **S** — Single Responsibility | Одна причина для изменения модуля  | `UserRepository` читает · `UserFormatter` форматирует — не один god class          |
| **O** — Open/Closed           | Расширять новым кодом, не правками | Новый `StripeProcessor implements PaymentProcessor` — не править `CheckoutService` |
| **L** — Liskov Substitution   | Подтипы соблюдают контракт         | Любой `UserStore` в `loadProfile()` возвращает одну форму `{ id, name }`           |
| **I** — Interface Segregation | Маленькие интерфейсы               | `ReadableLedger` для отчётов — не fat `Ledger` с `write()` / `delete()`            |
| **D** — Dependency Inversion  | Зависеть от абстракций             | `placeOrder(id, logger: Logger)` — инжектить `Logger`, не concrete console adapter |

**How it works:**

Каждая буква соответствует **Examples** ниже — ищите `// good` и `// bad`:

1. **S** — repository и formatter через разные `interface` — не один service class.
2. **O** — новый provider = новый class с `implements` — не растущий `if/else` в одном class.
3. **L** — `implements UserStore` обязан соблюдать return type — `tsc` ловит сломанные substitutes.
4. **I** — передавать `ReadableLedger`, когда нужны только reads — не требовать write API.
5. **D** — domain принимает типы `Logger` / `DbClient` — wiring выбирает concrete implementations.

**When to use:** Domain models, services, DI graphs, public module APIs. На одноразовом скрипте — без тяжёлых interfaces.

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

**Thoughts:** TypeScript делает **I**, **L** и **D** видимыми на compile time — но types стираются в runtime; behavioral contracts всё равно важны. JS: [SOLID in Classes](./3_js_core.md#solid-in-classes) · [SOLID in Functions](./3_js_core.md#solid-in-functions). Фреймворки: [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express). Типизация Vue SFC (`defineProps`, `vue-tsc`): [TypeScript with Vue](./4_vue_composition.md#typescript-with-vue). Полный справочник: [OOP & SOLID](./7_special_engineering.md#solid-overview).

**Sources:** [TypeScript handbook — Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) · [TypeScript handbook — Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) · [SOLID (overview)](./7_special_engineering.md#solid-overview) · [JS — SOLID in Classes](./3_js_core.md#solid-in-classes) · [JS — SOLID in Functions](./3_js_core.md#solid-in-functions) · [SOLID in React](./4_react_core.md#solid-in-react) · [SOLID in Next.js](./4_nextjs_core.md#solid-in-nextjs) · [SOLID in Express](./8_nodejs_http.md#solid-in-express) · [TypeScript with Vue](./4_vue_composition.md#typescript-with-vue)

</details>

<a name="generics"></a>