# TypeScript — Objects

Интерфейсы, типы объектов, классы и ООП.

[ ← Вернуться в хаб](./5_ts.md)

### Related docs

* [TypeScript — Основы](./5_ts_core.md) · [TypeScript — Сужение](./5_ts_narrowing.md) · [TypeScript — Функции](./5_ts_functions.md) · [TypeScript — Объекты](./5_ts_objects.md) · [TypeScript — Generics](./5_ts_generics.md) · [TypeScript — Ссылка](./5_ts_reference.md) · [TypeScript — Интервью](./5_ts_interview.md)

### Sections

- [Object types](#object-types)
- [Classes & OOP](#classes-oop)

---

## Object types

<details>
  <summary>Object shapes</summary>

### Defining Object Types

**Definition:**

Три способа описания формы объекта: встроенный `{ }`, `interface`, or `type` псевдоним.

| Когда использовать | Заметки |
|-------------|-------|
| Выберите один стиль для каждой базы кода. Встроенный для разовых заказов; `interface`/`type` для повторного использования в файлах. | TypeScript использует **структурную типизацию** — важна только форма, а не имя. Переменная, типизированная как `Person` действителен в любом месте `{ name: string; age: number }` ожидается. |

**Examples:**

```typescript
// 1. Anonymous inline type
function greet(person: { name: string; age: number }) {
  return "Hello " + person.name;
}

// 2. Interface
interface Person {
  name: string;
  age: number;
}

// 3. Type alias
type Person = {
  name: string;
  age: number;
};
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Reusing object shapes — avoid repetition

**Definition:**

Встроенные типы работают, но повторяют структуру. Извлечь один раз с помощью `type` or `interface`:

| Аспект | Деталь |
|--------|--------|
| Резюме | Встроенные типы работают, но повторяют структуру. Извлечь один раз с помощью `type` or `interface`:

Встроенные типы работают, но повторяют структуру |

Встроенные типы работают, но повторяют структуру. Извлечь один раз с помощью `type` or `interface`:

**Examples:**

```typescript
type Person = { name: string; age: number; nickName: string };

let user: Person = { name: "Yauhen", age: 30, nickName: "webDev" };
let admin: Person = { name: "Max", age: 20, nickName: "Mad" };

// Optional fields for variants of the same shape
type PersonWithExtras = {
  name: string;
  age: number;
  nickName?: string;
  getPass?: () => string;
};

let admin2: PersonWithExtras = {
  name: "Max",
  age: 20,
  getPass() {
    return `${this.name}${this.age}`;
  },
};
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Optional Properties

**Definition:**

Поля объекта, которые могут отсутствовать, отмечены значком `?`.

| Когда использовать | Заметки |
|-------------|-------|
| Об интерфейсах/типах в главе «Типы объектов» — то же, что и о повседневных типах: дополнительные ключи могут отсутствовать. | Необязательно ≠ только «может не существовать во время выполнения» — под `strictNullChecks`, чтение необязательного свойства дает `T \| undefined`. Использовать значения по умолчанию при деструктуризации (`{ xPos = 0 }`) для сужения внутри функций |

**Examples:**

```typescript
interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}

paintShape({ shape });
paintShape({ shape, xPos: 100 });

function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos; // number | undefined

  let xPos2 = opts.xPos === undefined ? 0 : opts.xPos; // number

  // Defaults via destructuring
  function paint({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
    console.log(xPos, yPos); // both number
  }
}
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Pitfall: no types inside destructuring rename syntax

**Definition:**

При деструктуризации JS `{ shape: Shape }` переименовывает `shape` в переменную `Shape` — НЕ добавляет аннотацию типа.

| Аспект | Деталь |
|--------|--------|
| Резюме | При деструктуризации JS `{ shape: Shape }` переименовывает `shape` в переменную `Shape` — НЕ добавляет аннотацию типа.

В JS |

При деструктуризации JS `{ shape: Shape }` переименовывает `shape` в переменную `Shape` — НЕ добавляет аннотацию типа.

**Examples:**

```typescript
// Wrong — Shape and number become variable names, not types
// function draw({ shape: Shape, xPos: number = 100 }) { ... }

// Correct — type after the whole pattern
function draw({ shape, xPos = 100 }: { shape: Shape; xPos?: number }) { }
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### `readonly` Properties

**Definition:**

Свойства объекта, которые нельзя переназначить после инициализации.

| Когда использовать | Заметки |
|-------------|-------|
| Отметить значком `readonly` в полях интерфейса или `readonly` массивы/кортежи. Только во время компиляции — поверхностная неизменяемость. | `readonly` неглубокий — содержимое вложенных объектов все еще может видоизменяться. Также, `readonly` игнорируется при проверке совместимости типов через псевдонимы — `readonly` представление все равно может измениться, если вы удерживаете изменяемый элемент al |

**Examples:**

```typescript
interface SomeType {
  readonly prop: string;
}

function doSomething(obj: SomeType) {
  console.log(obj.prop); // OK
  // obj.prop = "hello"; // Error
}

interface Home {
  readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
  home.resident.age++; // OK — mutating nested object
  // home.resident = { ... }; // Error — can't reassign readonly property
}

let writable: Person = { name: "Alice", age: 42 };
let readonly: ReadonlyPerson = writable;
writable.age++; // mutates shared object — readonly view sees 43
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Index Signatures

**Definition:**

Описывайте объекты с помощью динамических строковых/цифровых ключей: `{ [key: string]: number }`.

| Когда использовать | Заметки |
|-------------|-------|
| Используйте, когда ключи не известны заранее. Объединить с известными полями; Тип значения должен включать все типы свойств. | Все именованные свойства должны соответствовать типу подписи индекса. `number` значения индекса должны быть подтипом `string` значения индекса (поскольку `obj[100]` === `obj["100"]` в JS). Используйте типы индексов объединения, когда prope |

**Examples:**

```typescript
interface StringArray {
  [index: number]: string;
}

const arr: StringArray = getStringArray();
const item = arr[1]; // string

// All properties must fit the index type
interface NumberDictionary {
  [index: string]: number;
  length: number; // OK
  // name: string; // Error — string not assignable to number index
}

interface FlexibleDict {
  [index: string]: number | string;
  length: number;
  name: string;
}

interface ReadonlyStringArray {
  readonly [index: number]: string;
}
// arr[2] = "x"; // Error — readonly index
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Excess Property Checks

**Definition:**

TS отклоняет объектные литералы со свойствами, не объявленными в целевом типе.

| Когда использовать | Заметки |
|-------------|-------|
| Обнаруживает опечатки в новых литералах `{ name: "a", nmae: "b" }`. Не применяется при первом назначении через переменную. | Дополнительные проверки применяются только к **новым литералам объектов**. Сначала назначьте переменную, используйте `as Type`или добавьте сигнатуру строкового индекса для обхода — но большинство ошибок лишних свойств являются настоящими ошибками. |

**Examples:**

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig) { /* ... */ }

// Error — 'colour' is not in SquareConfig
// createSquare({ colour: "red", width: 100 });

// Workarounds (use sparingly):
createSquare({ width: 100, opacity: 0.5 } as SquareConfig);

interface LooseConfig {
  color?: string;
  width?: number;
  [prop: string]: unknown; // allows extra keys
}

let options = { colour: "red", width: 100 };
createSquare(options); // OK — not a fresh literal check
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Extending Types

**Definition:**

Добавление полей к существующему типу через `interface Child extends Parent`.

| Когда использовать | Заметки |
|-------------|-------|
| Интерфейсы стека: `interface Admin extends User { role: string }`. Для типов используйте пересечение `&` вместо. | `extends` сигнализирует о намерении и позволяет избежать повторения полей. Предпочитайте его копипасту при создании специализированных версий базовой фигуры. |

**Examples:**

```typescript
interface BasicAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
  unit: string;
}

interface Colorful { color: string; }
interface Circle { radius: number; }
interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = { color: "red", radius: 42 };
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Intersection Types

**Definition:**

Комбинируйте типы с `&` — значение должно удовлетворять **всем** членам: `A & B`.

| Когда использовать | Заметки |
|-------------|-------|
| Объединить формы объектов: `type Employee = Person & Worker`. Конфликтующие типы свойств становятся `never`. | Пересечение объединяет конфликтующие типы свойств в `never` вместо ошибки во время объявления. `Person1 & Person2` где у обоих есть `name: string` vs `name: number` → `name: never`. |

**Examples:**

```typescript
interface Colorful { color: string; }
interface Circle { radius: number; }

type ColorfulCircle = Colorful & Circle;

function draw(circle: ColorfulCircle) {
  console.log(circle.color, circle.radius);
}

draw({ color: "blue", radius: 42 });
// draw({ color: "red", raidus: 42 }); // Error — typo caught
```

```typescript
type Person = { name: string; age: number };
type Employee = { company: string; position: string };
type EmployeePerson = Person & Employee;

const employee: EmployeePerson = {
  name: "John",
  age: 30,
  company: "ABC Corp",
  position: "Manager",
};
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Interface Extension vs Intersection

**Definition:**

Два способа объединения типов — они по-разному обрабатывают конфликты свойств.

| Когда использовать | Заметки |
|-------------|-------|
| Предпочитать `extends` для интерфейсов (ошибки при конфликте). Использовать `&` для типов; противоречивые реквизиты становятся `never`. | Дублировать `interface` имена **объединяются**, если они совместимы; несовместимый реквизит → ошибка. Пересечение типов с конфликтующими реквизитами → `never` в этом свойстве компилируется автоматически, пока вы его не используете. |

**Examples:**

```typescript
// Interface merge — error on conflict
interface Person { name: string; }
// interface Person { name: number; } // Error — incompatible merge

// Intersection — compiles, property becomes never
interface Person1 { name: string; }
interface Person2 { name: number; }
type Staff = Person1 & Person2;
declare const staffer: Staff;
// staffer.name is type `never`
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Generic Object Types

**Definition:**

Типы объектов, параметризованные другими типами: `Box<T>`, `Array<T>`.

| Когда использовать | Заметки |
|-------------|-------|
| `` interface ApiResponse<T> { data: T; error?: string } `` — reuse one shape for many payloads. | `Коробка<string>` is identical to `{ содержимое: строка }` after substitution. Generics on interfaces AND type aliases work; aliases can also build helper types like `введите OrNull<T> = Т \| ноль`. |

**Examples:**

```typescript
interface Box<Type> {
  contents: Type;
}

let box: Box<string> = { contents: "hello" };
// same as StringBox { contents: string }

type AppleBox = Box<Apple>;

function setContents<Type>(box: Box<Type>, newContents: Type) {
  box.contents = newContents;
}

// Generic type aliases
type OrNull<Type> = Type | null;
type OneOrMany<Type> = Type | Type[];
type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### `Array` and `ReadonlyArray`

**Definition:**

`Array<T>` / `T[]` для изменяемых списков; `ReadonlyArray<T>` / `readonly T[]` для неизменных представлений.

| Когда использовать | Заметки |
|-------------|-------|
| Назначить изменяемый массив только для чтения ОК; а не наоборот. Массивы только для чтения запрещают `push`/`pop`/`splice`. | `ReadonlyArray<T>` / `readonly T[]` не имеет конструктора — присваивается из обычного массива. Только для чтения → изменяемое присвоение работает; mutable ← только для чтения нет. |

**How it works:** `ReadonlyArray<T>` и `readonly T[]` **эквивалентны** — одинаковое поведение (нет `push`/`pop`/`splice`). `readonly T[]` является синтаксическим сахаром; `ReadonlyArray<T>` является более явным в общем коде.

**Examples:**

```typescript
function process(values: Array<string>) { /* ... */ }
function process2(values: string[]) { /* ... */ } // same

function readOnly(values: readonly string[]) {
  values.slice(); // OK
  // values.push("x"); // Error
}

// No constructor:
// new ReadonlyArray("a", "b"); // Error

let x: readonly string[] = [];
let y: string[] = [];
x = y; // OK — readonly accepts mutable
// y = x; // Error — can't assign readonly to mutable
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Tuple Types

**Definition:**

Массив фиксированной длины с определенным типом для каждого индекса: `[string, number]`.

| Когда использовать | Заметки |
|-------------|-------|
| Объявить `type Pair = [string, number]` or `let t: [string, number] = ["a", 1]`. Порядок имеет значение. Используйте для координат, `[value, error]` пары или зеркальные функции args. | **Порядок имеет значение** — `[string, number]` не назначается из `[number, string]`. Кортежи идеально подходят для API, основанных на соглашениях (`[x, y]` координаты), но объекты с именованными полями часто более понятны. |

**Examples:**

```typescript
type StringNumberPair = [string, number];

let x: StringNumberPair = ["hello", 42]; // OK
// let bad: StringNumberPair = [42, "hello"]; // Error — order matters

function doSomething(pair: [string, number]) {
  const a = pair[0]; // string
  const b = pair[1]; // number
  // const c = pair[2]; // Error — no index 2
}

doSomething(["hello", 42]);

const [input, hash] = pair; // destructuring
```

```typescript
type Either2dOr3d = [number, number, number?];

function setCoordinate(coord: Either2dOr3d) {
  const [x, y, z] = coord; // z: number | undefined
  console.log(coord.length); // 2 | 3
}

type StringNumberBooleans = [string, number, ...boolean[]];

const a: StringNumberBooleans = ["hello", 1];
const b: StringNumberBooleans = ["world", 2, true, false];
```

```typescript
function readButtonInput(...args: [string, number, ...boolean[]]) {
  const [name, version, ...input] = args;
}

// Equivalent to:
function readButtonInput(name: string, version: number, ...input: boolean[]) { }
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### `readonly` Tuple Types

**Definition:**

Кортежи, элементы которых нельзя переназначить: `readonly [string, number]`.

| Когда использовать | Заметки |
|-------------|-------|
| Отметить параметры `readonly` когда звонящие проходят `as const` кортежи. Предотвращает случайную мутацию внутри функции. | `readonly [3, 4]` НЕ назначается `[number, number]` потому что вызываемый объект может изменять элементы. Предпочитать `readonly` параметры кортежа, когда вы не будете мутировать — совпадают `as const` сайты звонков. |

**Examples:**

```typescript
function doSomething(pair: readonly [string, number]) {
  // pair[0] = "hello"; // Error
}

let point = [3, 4] as const; // readonly [3, 4]

function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

// distanceFromOrigin(point); // Error — readonly not assignable to mutable tuple

function distanceFromOrigin2([x, y]: readonly [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}
distanceFromOrigin2(point); // OK
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

</details>

<a name="classes"></a>

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

| + | − |
|------|------|
| Отловить плохие графы сущностей перед запуском | Типы стерты — среда выполнения все еще JS |
| Автозаполнение полей домена | Перемоделирование небольших скриптов |
| `implements` составление документов | ТС `private` это не конфиденциальность во время выполнения |

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

class History implements Ledger {
  private records: LedgerEntry[] = []; // compile-time only — use #records for runtime privacy
  addRecord(record: LedgerEntry): void {
    this.records.push(record);
  }
}
```

**Thoughts:** Почему TS, если среда выполнения — JS? То же, что и диагностика двигателя перед поездкой — о расторгнутом контракте вы узнаете еще до пробки. Полный дизайн ООП: [7_special.md](./7_special_engineering.md#объектно-ориентированное-программирование-oop).

**Sources:** [Doka — ООП](https://doka.guide/tools/oop/) · [Справочник TypeScript — классы](https://www.typescriptlang.org/docs/handbook/2/classes.html) · [Повседневные типы](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>

<details>
  <summary>TS `private` vs `#` fields</summary>

### TS `private` vs `#` fields

**Definition:** `private` / `protected` являются **только во время компиляции** (удаляются при генерации). `#field` — это частный слот ECMAScript, недоступный за пределами класса **во время выполнения**.

**How it works:**

- `private foo` → еще `instance.foo` в скомпилированном JS; `instance["foo"]` тоже работает. `tsc` ошибки; Потребители JS этого не делают.
- `#foo` → `SyntaxError` вне класса; `instance["#foo"]` is `undefined`, а не значение.
- Chrome DevTools может читать `#` поля в консоли для отладки — не языковая дыра.

| | `private` (TS) | `#field` (ИС) |
|---|----------------|---------------|
| Принудительно | компилятор | время выполнения |
| Выживает испускает | нет — общественная собственность | да — приватный слот |
| Доступ к подклассу | `protected` да | нет (если только геттер) |
| Старые цели | работает (это обычное поле) | нужна более ранняя или современная среда выполнения |

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

| Аспект | Деталь |
|--------|--------|
| Резюме | конструктор (имя: строка, возраст: номер, ник: строка) {
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

| Когда использовать | Заметки |
|-------------|-------|
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
dev.name;        // OK
// dev.nickName; // Error — private
// dev.age;      // Error — protected (outside subclass)
// dev.pass = 1; // Error — readonly
```

**Sources:** [Справочник по TypeScript — классы] (https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Parameter Properties

**Definition:**

Сокращение конструктора: `constructor(public name: string)` объявляет и назначает в одной строке.

| Аспект | Деталь |
|--------|--------|
| Резюме | Сокращение конструктора: `constructor(public name: string)` объявляет и назначает в одной строке. |

**Sources:** [Справочник по TypeScript — классы] (https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Compiled output — static on the constructor

**Definition:**

После компиляции `static` живет в функции класса, а не в экземплярах:

| Аспект | Деталь |
|--------|--------|
| Резюме | После компиляции `static` живет в функции класса, а не в экземплярах:

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

| Аспект | Деталь |
|--------|--------|
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

| Аспект | Деталь |
|--------|--------|
| Резюме | Два способа определения контрактов: абстрактные классы могут иметь реализацию; интерфейсы являются только сигнатурами. |

**Sources:** [Справочник по TypeScript — классы] (https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Abstract class example

**Definition:**

Пример абстрактного класса — язык TypeScript или функция компилятора.

| Аспект | Деталь |
|--------|--------|
| Резюме | Пример абстрактного класса — язык TypeScript или функция компилятора. |

**Examples:**

```typescript
abstract class User {
  constructor(public name: string, public age: number) {}
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
y.greet();    // "Yauhen"
y.getPass();  // "31Yauhen"
```

**Sources:** [Справочник по TypeScript — классы] (https://www.typescriptlang.org/docs/handbook/2/classes.html)

### Interfaces with classes

**Definition:**

Использование интерфейсов для описания форм и контрактов экземпляров классов.

| Аспект | Деталь |
|--------|--------|
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

| Аспект | Деталь |
|--------|--------|
| Резюме | // Лишняя проверка свойств — ошибка дополнительных ключей, если сигнатура индекса их не допускает
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

| Аспект | Деталь |
|--------|--------|
| Резюме | getPass() {
    возвращение `${this.name}${this.age}`;
  }
} |

**Examples:**

```typescript
interface User { name: string; age: number }
interface Pass { getPass(): string }

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

| Аспект | Деталь |
|--------|--------|
| Резюме | Пообещайте, что класс удовлетворяет контракту интерфейса — все необходимые члены должны существовать. |

**Sources:** [Справочник по TypeScript — классы] (https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<a name="generics"></a>
