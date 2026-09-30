# TypeScript — Типы объектов

Формы объектов, интерфейсы, необязательные и readonly-свойства, кортежи.

[← Назад к хабу](./5_ts.md)

### Related docs

- [TypeScript — hub](./5_ts.md) · [Интервью](./5_ts_interview.md)

### Sections

- [Object types](#object-types)
- [Classes & OOP](#classes-oop)
- [Design principles](#design-principles)

---

## Object types

<details>
  <summary>Object shapes</summary>

### Defining Object Types

**Definition:**

Три способа описания формы объекта: встроенный `{ }`, `interface`, or `type` псевдоним.

| Когда использовать                                                                                                                  | Заметки                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
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

| Аспект | Деталь                                                                                              |
| ------ | --------------------------------------------------------------------------------------------------- |
| Резюме | Встроенные типы работают, но повторяют структуру. Извлечь один раз с помощью `type` or `interface`: |

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

| Когда использовать                                                                                                          | Заметки                                                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
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

| Аспект | Деталь                                                                                                                 |
| ------ | ---------------------------------------------------------------------------------------------------------------------- |
| Резюме | При деструктуризации JS `{ shape: Shape }` переименовывает `shape` в переменную `Shape` — НЕ добавляет аннотацию типа. |

В JS |

При деструктуризации JS `{ shape: Shape }` переименовывает `shape` в переменную `Shape` — НЕ добавляет аннотацию типа.

**Examples:**

```typescript
// Wrong — Shape and number become variable names, not types
// function draw({ shape: Shape, xPos: number = 100 }) { ... }

// Correct — type after the whole pattern
function draw({ shape, xPos = 100 }: { shape: Shape; xPos?: number }) {}
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### `readonly` Properties

**Definition:**

Свойства объекта, которые нельзя переназначить после инициализации.

| Когда использовать                                                                                                                        | Заметки                                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
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

| Когда использовать                                                                                                           | Заметки                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
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

| Когда использовать                                                                                                         | Заметки                                                                                                                                                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Обнаруживает опечатки в новых литералах `{ name: "a", nmae: "b" }`. Не применяется при первом назначении через переменную. | Дополнительные проверки применяются только к **новым литералам объектов**. Сначала назначьте переменную, используйте `as Type`или добавьте сигнатуру строкового индекса для обхода — но большинство ошибок лишних свойств являются настоящими ошибками. |

**Examples:**

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig) {
  /* ... */
}

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

| Когда использовать                                                                                               | Заметки                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
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

interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}
interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = { color: "red", radius: 42 };
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Intersection Types

**Definition:**

Комбинируйте типы с `&` — значение должно удовлетворять **всем** членам: `A & B`.

| Когда использовать                                                                                           | Заметки                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Объединить формы объектов: `type Employee = Person & Worker`. Конфликтующие типы свойств становятся `never`. | Пересечение объединяет конфликтующие типы свойств в `never` вместо ошибки во время объявления. `Person1 & Person2` где у обоих есть `name: string` vs `name: number` → `name: never`. |

**Examples:**

```typescript
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}

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

| Когда использовать                                                                                                                      | Заметки                                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Предпочитать `extends` для интерфейсов (ошибки при конфликте). Использовать `&` для типов; противоречивые реквизиты становятся `never`. | Дублировать `interface` имена **объединяются**, если они совместимы; несовместимый реквизит → ошибка. Пересечение типов с конфликтующими реквизитами → `never` в этом свойстве компилируется автоматически, пока вы его не используете. |

**Examples:**

```typescript
// Interface merge — error on conflict
interface Person {
  name: string;
}
// interface Person { name: number; } // Error — incompatible merge

// Intersection — compiles, property becomes never
interface Person1 {
  name: string;
}
interface Person2 {
  name: number;
}
type Staff = Person1 & Person2;
declare const staffer: Staff;
// staffer.name is type `never`
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### Generic Object Types

**Definition:**

Типы объектов, параметризованные другими типами: `Box<T>`, `Array<T>`.

| Когда использовать                                                                          | Заметки                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `interface ApiResponse<T> { data: T; error?: string }` — reuse one shape for many payloads. | `Коробка<string>` is identical to `{ содержимое: строка }` after substitution. Generics on interfaces AND type aliases work; aliases can also build helper types like `введите OrNull<T> = Т \| ноль`. |

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

| Когда использовать                                                                                                          | Заметки                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Назначить изменяемый массив только для чтения ОК; а не наоборот. Массивы только для чтения запрещают `push`/`pop`/`splice`. | `ReadonlyArray<T>` / `readonly T[]` не имеет конструктора — присваивается из обычного массива. Только для чтения → изменяемое присвоение работает; mutable ← только для чтения нет. |

**How it works:** `ReadonlyArray<T>` и `readonly T[]` **эквивалентны** — одинаковое поведение (нет `push`/`pop`/`splice`). `readonly T[]` является синтаксическим сахаром; `ReadonlyArray<T>` является более явным в общем коде.

**Examples:**

```typescript
function process(values: Array<string>) {
  /* ... */
}
function process2(values: string[]) {
  /* ... */
} // same

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

| Когда использовать                                                                                                                                                                     | Заметки                                                                                                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
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
function readButtonInput(name: string, version: number, ...input: boolean[]) {}
```

**Sources:** [Справочник по TypeScript — объекты] (https://www.typescriptlang.org/docs/handbook/2/objects.html)

### `readonly` Tuple Types

**Definition:**

Кортежи, элементы которых нельзя переназначить: `readonly [string, number]`.

| Когда использовать                                                                                                        | Заметки                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
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

Перенесено в [Classes](./5_ts_classes.md).
