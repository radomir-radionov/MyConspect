# TypeScript — Манипуляции с типами

Generics, keyof, typeof, индексный доступ, условные и отображаемые типы.

[← Назад к хабу](./5_ts.md)

### Related docs

* [TypeScript — hub](./5_ts.md) · [Интервью](./5_ts_interview.md)

### Sections

- [Generics & type operators](#generics-type-operators)

---

## Generics & type operators

<details>
  <summary>Generics & type operators</summary>

### Generics

**Definition:**

Введите параметры, которые позволяют одной функции/классу/интерфейсу работать со многими типами, сохраняя при этом безопасность типов: `<T>`.

| Когда использовать | Заметки |
|-------------|-------|
| Объявить `function id<T>(x: T): T` or `class Box<T> { value: T }`. ТС делает вывод `T` из аргументов; передавать явно, когда это необходимо: `id<string>("a")`. Ограничить с помощью `T extends SomeType`. | Параметры типа заменяют *любой* тип, пока не будут ограничены — вы не можете вызывать `.length` on `T` если ты не ограничиваешь `T extends { length: number }`. Вывод обычно заполняет `<T>` для тебя; передать явно w |

**Examples:**

```typescript
// Too narrow
function identity(arg: number): number { return arg; }

// Loses type info
function identity(arg: any): any { return arg; }

// Generic — preserves type
function identity<T>(arg: T): T { return arg; }

let a = identity("myString");        // inferred: string
let b = identity<string>("myString"); // explicit type arg
```

```typescript
const getter = <T>(data: T): T => data;

getter("test").length;     // 4 — inferred string
// getter(10).length;      // Error — number has no length

// Explicit type argument when inference fails
getter<number>(10);
getter<string>("test").length; // 4
```

```typescript
function getFirstElement<T>(arr: T[]): T {
  return arr[0];
}

const first = getFirstElement([1, 2, 3]);     // number
const word = getFirstElement(["a", "b"]);   // string
// getFirstElement([1, "two"]);            // Error — mixed array unless T is string | number
```

**Sources:** [Справочник по TypeScript — типы-из-типов] (https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Interview example — API wrapper + React `useState`

**Definition:**

// Общая форма ответа API

введите ApiResponse<T> =
  | { успех: правда; данные: Т }
  | { успех: ложь; ошибка: строка };

| Аспект | Деталь |
|--------|--------|
| Резюме | // Общая форма ответа API
введите ApiResponse<T> =
  \| { успех: правда; данные: Т }
  \| { успех: ложь; ошибка: строка |

**Examples:**

```typescript
// React — generic state
const [ids, setIds] = useState<number[]>([]);

// Generic API response shape
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function fetchJson<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  if (!res.ok) return { success: false, error: res.statusText };
  const data = (await res.json()) as T;
  return { success: true, data };
}

type User = { id: number; name: string };

const result = await fetchJson<User[]>("/api/users");
if (result.success) {
  result.data.forEach((u) => u.name); // User[] — full autocomplete
}
```

```typescript
interface Box<T> {
  contents: T;
}

interface GenericIdentityFn<T> {
  (arg: T): T;
}

class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

// Single type param — both fields same type
class User<T> {
  constructor(public name: T, public age: T) {}
  getPass() {
    return `${this.name}${this.age}`;
  }
}
new User("Yauhen", "31").getPass(); // "Yauhen31"
new User(123, 321).getPass();       // "123321"

// Multiple type params — different field types
class User2<T, K> {
  constructor(public name: T, public age: K) {}
  getPass() {
    return `${this.name}${this.age}`;
  }
}
new User2("Leo", 22).getPass(); // "Leo22"

// Constrained type param
class User3<T, K extends number> {
  constructor(public name: T, public age: K) {}
  getSecret() {
    return this.age ** 2;
  }
}
new User3("Yauhen", 31).getSecret(); // 961
// new User3("Max", "20"); // Error — age must be number

// Multiple type params + constraints (Pair pattern)
class Pair<T, K extends number> {
  constructor(public key: T, public value: K) {}
  square() {
    return this.value ** 2;
  }
}

const p = new Pair("age", 31);
p.square(); // 961

// Generic classes: type param applies to instance side, not static members
```

**Sources:** [Справочник по TypeScript — типы-из-типов] (https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### `keyof` Type Operator

**Definition:**

Производит объединение ключей объекта: `keyof { a: 1; b: 2 }` → `"a" | "b"`.

| Когда использовать | Заметки |
|-------------|-------|
| Используйте с дженериками для безопасного доступа к свойствам: `function get<T, K extends keyof T>(obj: T, key: K): T[K]`. Основа отображаемых типов. | С индексными подписями, `keyof` возвращает тип индекса — `keyof { [k: string]: boolean }` → `string \| number` (потому что `obj[0]` === `obj["0"]` в JS). Прекрасно сочетается с отображаемыми типами и `getProper |

**How it works:** `keyof` + `extends` создает **типобезопасные API** без магических строк — `getProperty(user, "phone")` происходит сбой во время компиляции, если `"phone"` не является ключом `user`. Комбинировать с `typeof`, `in`и типы утилит для гибких контрактов.

**Examples:**

```typescript
type Point = { x: number; y: number };
type P = keyof Point; // "x" | "y"

type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish; // number

type Mapish = { [k: string]: boolean };
type M = keyof Mapish; // string | number
```

**Sources:** [Справочник по TypeScript — типы-из-типов] (https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### `typeof` Type Operator

**Definition:**

В позиции **типа** получает тип значения или переменной, а не среду выполнения. `typeof` нить.

| Когда использовать | Заметки |
|-------------|-------|
| Писать `type A = typeof myVar` or `typeof obj["prop"]`. Общий шаблон: `ReturnType<typeof fn>` потребности `typeof fn` первый. | Значения и типы живут в разных пространствах имен. `ReturnType<f>` неправильно — используйте `ReturnType<typeof f>`. Работает только с идентификаторами и их свойствами, а не с произвольными выражениями (предотвращает `typeof msgbox( |

**Examples:**

```typescript
let s = "hello";
let n: typeof s; // string

function f() {
  return { x: 10, y: 3 };
}

type P = ReturnType<typeof f>; // { x: number; y: number }

// type P = ReturnType<f>; // Error — f is a value, not a type
```

**Sources:** [Справочник по TypeScript — типы-из-типов] (https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Indexed Access Types

**Definition:**

Найдите тип свойства по другому типу: `Person["age"]` → `number`.

| Когда использовать | Заметки |
|-------------|-------|
| Использовать `T["key"]` or `T[K]` где `K extends keyof T`. Извлекайте вложенные типы без дублирования фигур. | Индекс должен быть **типом**, а не переменной времени выполнения. `const key = "age"` не будет работать как `Person[key]` - использовать `type key = "age"` or `Person[typeof key]` с `as const`. |

**Examples:**

```typescript
type Person = { age: number; name: string; alive: boolean };

type Age = Person["age"];                    // number
type I1 = Person["age" | "name"];          // string | number
// type Bad = Person["alve"];              // Error — typo: property doesn't exist
type I2 = Person[keyof Person];             // string | number | boolean

const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
];
type Person = typeof MyArray[number];        // element type
type Age = typeof MyArray[number]["age"];   // number

// const key = "age";
// type Bad = Person[key]; // Error — key is a value

type key = "age";
type Good = Person[key]; // number
```

**Sources:** [Справочник по TypeScript — типы-из-типов] (https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Conditional Types

**Definition:**

Уровень типа if/else: `T extends U ? X : Y` — выбирает `X` or `Y` исходя из того, `T` присваивается `U`.

| Когда использовать | Заметки |
|-------------|-------|
| Строить зависимые типы, разворачивать массивы (`Flatten<T>`), извлеките возвращаемые типы с помощью `infer`. Завернуть в `[T]` отключить распределение по союзам. | **Распределительный** по союзам: `ToArray<string \| number>` → `string[] \| number[]`, нет `(string \| number)[]`. Завернуть в `[T]` отключить: `[Type] extends [any] ? Type[] : never`. |

**Examples:**

```typescript
type Example1 = Dog extends Animal ? number : string; // number
type Example2 = RegExp extends Animal ? number : string; // string

type NameOrId<T extends number | string> =
  T extends number ? IdLabel : NameLabel;

function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}
```

```typescript
type MessageOf<T> = T extends { message: unknown }
  ? T["message"]
  : never;

type Flatten<T> = T extends any[] ? T[number] : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number>;   // number
```

```typescript
type Flatten<T> = T extends Array<infer Item> ? Item : T;

type GetReturnType<T> = T extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>; // number
```

**Sources:** [Справочник по TypeScript — типы-из-типов] (https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Mapped Types

**Definition:**

Преобразуйте каждое свойство типа, перебирая ключи: `{ [K in keyof T]: NewType }`.

| Когда использовать | Заметки |
|-------------|-------|
| Создайте объекты флагов, сделайте все реквизиты необязательными/только для чтения, переименуйте ключи с помощью `as`. База для многих типов утилит (`Partial`, `Record`). | Модификаторы отображения: `readonly`, `?`и их удалятели `-readonly`, `-?`. Переназначение ключей с помощью `as` (TS 4.1+): `[K in keyof T as NewKey]: T[K]`. Фильтровать ключи путем сопоставления с `never`. |

**Examples:**

```typescript
type OptionsFlags<T> = {
  [Property in keyof T]: boolean;
};

type Features = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<Features>;
// { darkMode: boolean; newUserProfile: boolean }
```

```typescript
// Mapped type + conditional — transform property types per key
type Person = { name: string; age: number };

type UpdatedPerson = {
  [P in keyof Person]: P extends "name" ? string : number;
};

const person: UpdatedPerson = { name: "John", age: 25 };
```

```typescript
// Remove readonly
type CreateMutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// Remove optional
type Concrete<T> = {
  [P in keyof T]-?: T[P];
};
```

**Sources:** [Справочник по TypeScript — типы-из-типов] (https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Template Literal Types

**Definition:**

Строковые типы, созданные из строковых литералов и объединений: `` `get${Капитализировать<Keys>}` ``.

| Когда использовать | Заметки |
|-------------|-------|
| Создавайте имена событий, ключи CSS или пути API из объединения строк. Объедините с сопоставленными типами для имен методов получения/установки. | `` `${А \| Делать ставку` `` → every combination. Cross-multiply multiple unions for i18n keys etc. Built-in intrinsics: `Прописные буквы`, `строчные буквы`, `капитализировать`, `Uncapitalize` — не учитывает локаль. |

**Examples:**

```typescript
type World = "world";
type Greeting = `hello ${World}`; // "hello world"

type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"

type Lang = "en" | "ja";
type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
// 2 × 4 = 8 string literal combinations
```

```typescript
type PropEventSource<T> = {
  on<K extends string & keyof T>(
    eventName: `${K}Changed`,
    callback: (newValue: T[K]) => void
  ): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  age: 26,
});

person.on("firstNameChanged", (name) => {
  console.log(name.toUpperCase()); // name: string
});

person.on("ageChanged", (age) => {
  if (age < 0) console.warn("negative age"); // age: number
});

// person.on("firstName", () => {}); // Error — wrong event name
```

**Sources:** [Справочник по TypeScript — типы-из-типов] (https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Intrinsic string manipulation types

**Definition:**

Внутренние типы манипуляций со строками — язык TypeScript или функция компилятора.

| Аспект | Деталь |
|--------|--------|
| Резюме | Внутренние типы манипуляций со строками — язык TypeScript или функция компилятора. |

**Examples:**

```typescript
type Shouty = Uppercase<"hello">;           // "HELLO"
type Quiet = Lowercase<"HELLO">;            // "hello"
type Cap = Capitalize<"hello world">;       // "Hello world"
type Uncap = Uncapitalize<"HELLO WORLD">;   // "hELLO WORLD"

type CacheKey<S extends string> = `ID-${Uppercase<S>}`;
type MainID = CacheKey<"my_app">; // "ID-MY_APP"
```

**Sources:** [Справочник по TypeScript — типы-из-типов] (https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### How the tools combine

**Definition:**

// typeof + индексированный доступ + вывод (например, встроенный ReturnType)

введите MyReturn<T> = T расширяет (...args: никогда[]) => выводит R ? Р: никогда;

| Аспект | Деталь |
|--------|--------|
| Резюме | // typeof + индексированный доступ + вывод (например, встроенный ReturnType)
введите MyReturn<T> = T расширяет (...args: никогда[]) => вывести R |

**Examples:**

```typescript
// keyof + indexed access + mapped + template literal + conditional
type EventMap<T> = {
  [K in keyof T as `${string & K}Changed`]: T[K];
};

// typeof + indexed access + infer (like built-in ReturnType)
type MyReturn<T> = T extends (...args: never[]) => infer R ? R : never;

// Generic + keyof + extends (typed getProperty)
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

**Sources:** [Справочник по TypeScript — типы-из-типов] (https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Map Pattern (union → object lookup)

**Definition:**

Замените большое объединение несовместимых фигур объектом с ключом дискриминанта.

| Когда использовать | Заметки |
|-------------|-------|
| Определять `{ [K in Status]: HandlerFor<K> }` и индекс по статусу — типобезопасный поиск без невозможных пересечений. | `type Status = "idle" \| "loading" \| "error"` работает до тех пор, пока вам не понадобятся метаданные для каждого статуса. А `Record` или константный объект лучше масштабируется. |

**Examples:**

```typescript
// ❌ Union grows unwieldy — easy to miss a case
type Status = "idle" | "loading" | "success" | "error";

// ✅ Map pattern — keys are the union, values hold per-status data
const STATUS_CONFIG = {
  idle: { label: "Idle", retry: false },
  loading: { label: "Loading…", retry: false },
  success: { label: "Done", retry: false },
  error: { label: "Failed", retry: true },
} as const;

type Status = keyof typeof STATUS_CONFIG;

function getConfig(s: Status) {
  return STATUS_CONFIG[s]; // autocomplete for all keys
}
```

**Sources:** [Справочник по TypeScript — типы-из-типов] (https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Branded / Nominal Types (interview pattern)

**Definition:**

Метод, позволяющий сделать структурно идентичные типы несовместимыми путем добавления фиктивного поля бренда.

| Аспект | Деталь |
|--------|--------|
| Резюме | Метод, позволяющий сделать структурно идентичные типы несовместимыми путем добавления фиктивного поля бренда. |

**Examples:**

```typescript
type UserId = string & { readonly __brand: unique symbol };
type OrderId = string & { readonly __brand: unique symbol };

function userId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId) { /* ... */ }

const uid = userId("u-123");
const oid = userId("o-456") as OrderId;
// getUser(oid); // Error — OrderId is not UserId despite both being strings
getUser(uid);    // OK
```

**Sources:** [Справочник по TypeScript — типы-из-типов] (https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

</details>

<a name="utility-types"></a>
