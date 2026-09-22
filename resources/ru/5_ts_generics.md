# TypeScript — Generics

Обобщенные типы, операторы типов и служебные типы.

[ ← Вернуться в хаб](./5_ts.md)

### Related docs

* [TypeScript — Основы](./5_ts_core.md) · [TypeScript — Сужение](./5_ts_narrowing.md) · [TypeScript — Функции](./5_ts_functions.md) · [TypeScript — Объекты](./5_ts_objects.md) · [TypeScript — Generics](./5_ts_generics.md) · [TypeScript — Ссылка](./5_ts_reference.md) · [TypeScript — Интервью](./5_ts_interview.md)

### Sections

- [Generics & type operators](#generics-type-operators)
- [Utility types](#utility-types)

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

## Utility types

<details>
  <summary>Built-in utilities</summary>

### Quick list — all utility types

1. **`Awaited<T>`** — развернуть `Promise` (рекурсивный)
2. **`Partial<T>`** — все свойства необязательны.
3. **`Required<T>`** — все необходимые свойства
4. **`Readonly<T>`** — все свойства доступны только для чтения
5. **`Record<Keys, Type>`** — тип объекта с фиксированными ключами и унифицированными значениями.
6. **`Pick<T, Keys>`** — подмножество свойств
7. **`Omit<T, Keys>`** — все свойства, кроме перечисленных ключей
8. **`Exclude<Union, Excluded>`** — удалить членов союза, назначенных `Excluded`
9. **`Extract<Type, Union>`** — оставлять членов профсоюза назначаемыми `Union`
10. **`NonNullable<T>`** - удалять `null` и `undefined`
11. **`Parameters<F>`** — кортеж типов параметров функции
12. **`ConstructorParameters<C>`** — кортеж типов параметров конструктора
13. **`ReturnType<F>`** — тип возвращаемого значения функции
14. **`InstanceType<C>`** — тип экземпляра конструктора
15. **`NoInfer<T>`** — блокировать вывод на позицию этого типа
16. **`ThisParameterType<F>`** — тип явного `this` параметр
17. **`OmitThisParameter<F>`** — тип функции без `this`
18. **`ThisType<T>`** — контекстный `this` маркер (не преобразование)
19. **`Uppercase` / `Lowercase` / `Capitalize` / `Uncapitalize`** — преобразование строкового литерала

### One-line definitions (interview flash cards)

**Definition:**

Однострочные определения (флэш-карточки для интервью) — язык TypeScript или функция компилятора.

| Аспект | Деталь |
|--------|--------|
| Резюме | Однострочные определения (флэш-карточки для интервью) — язык TypeScript или функция компилятора.

* `Partial<T>` — все объекты |

* `Partial<T>` — все свойства необязательны
* `Required<T>` — все необходимые свойства (в отличие от Partial)
* `Readonly<T>` — свойства нельзя переназначить
* `Record<Keys, T>` — объект с фиксированными ключами и унифицированным типом значения
* `Pick<T, Keys>` — подмножество свойств
* `Omit<T, Keys>` — все свойства, кроме перечисленных ключей
* `Exclude<Union, E>` — удалить членов союза, назначенных `E`
* `Extract<T, U>` — обеспечить возможность назначения членов профсоюза `U`
* `InstanceType<C>` — тип экземпляра из конструктора
* `ThisType<T>` - контекстуальный `this` в объектных литералах

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### Interview examples — all utilities in one place

**Definition:**

Примеры интервью — все утилиты в одном месте — язык TypeScript или функция компилятора.

| Аспект | Деталь |
|--------|--------|
| Резюме | Примеры интервью — все утилиты в одном месте — язык TypeScript или функция компилятора. |

**Examples:**

```typescript
interface Person { name: string; age: number; email: string }

const partial: Partial<Person> = { name: "John" };

const required: Required<Partial<Person>> = { name: "John", age: 25, email: "j@x.com" };

const frozen: Readonly<Person> = { name: "John", age: 25, email: "j@x.com" };
// frozen.name = "Jane"; // Error

const fruits: Record<string, number> = { apple: 5, banana: 3 };

const picked: Pick<Person, "name" | "email"> = { name: "John", email: "j@x.com" };

const omitted: Omit<Person, "email"> = { name: "John", age: 30 };

type Primitive = string | number | boolean;
type NoBool = Exclude<Primitive, boolean>;        // string | number
type OnlyBool = Extract<Primitive, boolean>;      // boolean

type MaybeUser = string | null | undefined;
type User = NonNullable<MaybeUser>;               // string

type GetUser = (id: number, active: boolean) => string;
type Params = Parameters<GetUser>;                // [number, boolean]
type Ret = ReturnType<() => { name: string }>;    // { name: string }

class UserClass { name = "John"; age = 30 }
type Inst = InstanceType<typeof UserClass>;       // UserClass

type Helper = { getName(): string } & ThisType<{ name: string }>;
const helper: Helper = { getName() { return this.name } };
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Awaited<Type>`

**Definition:**

Разворачивает `Promise` печатает рекурсивно — моделирует то, что `await` возвращается.

| Когда использовать | Заметки |
|-------------|-------|
| `type R = Awaited<Promise<Promise<string>>>` → `string`. Работает и в союзах с членами, не являющимися членами Promise. | Работает и с профсоюзами — `Awaited<boolean \| Promise<number>>` становится `number \| boolean`, не просто `number`. |

**Examples:**

```typescript
type A = Awaited<Promise<string>>;           // string
type B = Awaited<Promise<Promise<number>>>;  // number
type C = Awaited<boolean | Promise<number>>; // number | boolean
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Partial<Type>`

**Definition:**

Делает каждое свойство `Type` необязательный.

| Когда использовать | Заметки |
|-------------|-------|
| `Partial<User>` для полезных данных PATCH/обновления, где отправляются только некоторые поля. | Возвращает тип, представляющий **все подмножества** `Type`, а не «той же формы, но необязательно» только в поверхностном смысле — вложенные объекты остаются такими, как они были объявлены, если вы не сопоставляете их самостоятельно. |

**Examples:**

```typescript
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fields: Partial<Todo>) {
  return { ...todo, ...fields };
}

updateTodo(
  { title: "organize desk", description: "clear clutter" },
  { description: "throw out trash" }
);
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Required<Type>`

**Definition:**

Делает все необходимые свойства — противоположными `Partial`.

| Когда использовать | Заметки |
|-------------|-------|
| `Required<Partial<User>>` или убедитесь, что объекты конфигурации имеют все ключи после необязательного ввода. | Влияет только на необязательные модификаторы верхнего уровня; он не заполняет волшебным образом недостающие вложенные необязательные цепочки. |

**Examples:**

```typescript
interface Props {
  a?: number;
  b?: string;
}

const ok: Props = { a: 5 };
// const bad: Required<Props> = { a: 5 }; // Error: 'b' is missing
const good: Required<Props> = { a: 5, b: "hi" };
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Readonly<Type>`

**Definition:**

Делает каждое свойство верхнего уровня доступным только для чтения — переназначение невозможно.

| Когда использовать | Заметки |
|-------------|-------|
| `Readonly<User>` для замороженной конфигурации. Только поверхностное — вложенные объекты все равно могут мутировать. | Только поверхностное — свойства вложенных объектов по-прежнему можно изменять, если вы не пометите их только для чтения или не используете `Readonly` рекурсивно. |

**Examples:**

```typescript
interface Todo { title: string; }

const todo: Readonly<Todo> = { title: "Delete inactive users" };
// todo.title = "Hello"; // Error: read-only property

// Pairs with Object.freeze at runtime
function freeze<T>(obj: T): Readonly<T> {
  return Object.freeze(obj) as Readonly<T>;
}
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Record<Keys, Type>`

**Definition:**

Тип объекта с ключами из `Keys` и единый тип значения `Type`.

| Когда использовать | Заметки |
|-------------|-------|
| `Record<"a" \| "b", number>` or `Record<string, boolean>` для словарей и справочных таблиц. | `Keys` должно быть `string \| number \| symbol` — часто союз строковых букв. Удобно для словарей/карт с фиксированным набором ключей. |

**Examples:**

```typescript
type CatName = "miffy" | "boris" | "mordred";

interface CatInfo {
  age: number;
  breed: string;
}

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Pick<Type, Keys>`

**Definition:**

Новый тип, содержащий только выбранные ключи из `Type`.

| Когда использовать | Заметки |
|-------------|-------|
| `Pick<User, "id" \| "name">` для DTO, предварительных версий или общедоступных подмножеств API. | `Keys` должен быть назначен на `keyof Type` — нельзя подобрать несуществующие ключи. |

**Examples:**

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = { title: "Clean room", completed: false };
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Omit<Type, Keys>`

**Definition:**

Новый тип с удаленными из списка ключами. `Type`.

| Когда использовать | Заметки |
|-------------|-------|
| `Omit<User, "password">` перед отправкой клиенту. Исправить конфликты пересечений: `Omit<T, "key"> & { key: NewType }`. | Добавлено в ТС 3.5 — до этого люди пользовались `Pick` + `Exclude<keyof T, K>` вручную. |

**Examples:**

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "description" | "createdAt">;
// { title: string; completed: boolean; }
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Exclude<UnionType, ExcludedMembers>`

**Definition:**

Удаляет членов союза, которым можно назначить `ExcludedMembers`.

| Когда использовать | Заметки |
|-------------|-------|
| `Exclude<"a" \| "b" \| "c", "c">` → `"a" \| "b"`. Работает с **объединениями**, а не с ключами объектов. | Использует присваиваемость, а не равенство — `Exclude<string \| number, Function>` урожайность `string \| number` потому что ни один из них не может быть назначен `Function`. |

**Examples:**

```typescript
type T0 = Exclude<"a" | "b" | "c", "a">;        // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;  // "c"

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number };

type NoCircle = Exclude<Shape, { kind: "circle" }>;
// { kind: "square"; x: number }
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Extract<Type, Union>`

**Definition:**

Сохраняет только членов профсоюза, которым можно назначить `Union`.

| Когда использовать | Заметки |
|-------------|-------|
| `Extract<Primitive, boolean>` → `boolean`. Зеркало `Exclude`. | Зеркало `Exclude` — `Extract<T, U>` ≡ `T extends U ? T : never` (дистрибутив над союзами). |

**Examples:**

```typescript
type T0 = Extract<"a" | "b" | "c", "a" | "f">;  // "a"
type T1 = Extract<string | number | (() => void), Function>;  // () => void

type Circle = Extract<Shape, { kind: "circle" }>;
// { kind: "circle"; radius: number }
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `NonNullable<Type>`

**Definition:**

Удаляет `null` и `undefined` от `Type`.

| Когда использовать | Заметки |
|-------------|-------|
| `NonNullable<string \| null>` → `string`. После проверки на нулевое значение или для ввода гарантированно присутствующих значений. | Удаляет только этих двоих — `void` и другие ложные типы остаются. |

**Examples:**

```typescript
type T0 = NonNullable<string | number | undefined>;  // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Parameters<Type>`

**Definition:**

Извлекает типы параметров функции в виде кортежа.

| Когда использовать | Заметки |
|-------------|-------|
| `Parameters<typeof fn>` → `[string, number]` для оберток и функций высшего порядка. | Для перегруженных функций используются параметры **последней** перегрузки. `Parameters<any>` → `unknown[]`; `Parameters<never>` → `never`. |

**Examples:**

```typescript
declare function f1(arg: { a: number; b: string }): void;

type T0 = Parameters<() => string>;           // []
type T1 = Parameters<(s: string) => void>;    // [s: string]
type T2 = Parameters<typeof f1>;              // [arg: { a: number; b: string }]
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ConstructorParameters<Type>`

**Definition:**

Извлекает типы параметров конструктора в виде кортежа.

| Когда использовать | Заметки |
|-------------|-------|
| `ConstructorParameters<typeof Date>` для упаковки собственных или пользовательских конструкторов. | `ConstructorParameters<Function>` is `never` — `Function` слишком свободен, чтобы соответствовать `abstract new (...args: any) => any`. |

**Examples:**

```typescript
type T0 = ConstructorParameters<ErrorConstructor>;  // [message?: string]

class C {
  constructor(a: number, b: string) {}
}
type T1 = ConstructorParameters<typeof C>;  // [a: number, b: string]
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ReturnType<Type>`

**Definition:**

Извлекает тип возвращаемого значения типа функции.

| Когда использовать | Заметки |
|-------------|-------|
| `ReturnType<typeof fetchUser>` — определить тип результата API без дублирования. | Перегрузки → побеждает последняя подпись. `ReturnType<string>` ошибки (не функция); `ReturnType<Function>` деградирует до `any`. |

**Examples:**

```typescript
declare function f1(): { a: number; b: string };

type T0 = ReturnType<() => string>;     // string
type T1 = ReturnType<typeof f1>;         // { a: number; b: string }
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `InstanceType<Type>`

**Definition:**

Получает тип экземпляра из типа конструктора.

| Когда использовать | Заметки |
|-------------|-------|
| `InstanceType<typeof MyClass>` → `MyClass`. Для фабричных шаблонов и контейнеров DI. | `InstanceType<typeof MyClass>` дает тебе `MyClass` экземпляры — полезны для фабричных шаблонов и DI. |

**Examples:**

```typescript
class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>;  // C
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `NoInfer<Type>`

**Definition:**

Блокирует TS вывод аргументов типа из этой позиции (TS 5.4+).

| Когда использовать | Заметки |
|-------------|-------|
| Используйте параметры по умолчанию/общие параметры, которые не должны приводить к выводу: `defaultColor?: NoInfer<C>`. | Добавлено в TS 5.4 — исправлены случаи, когда параметр по умолчанию/обобщенный параметр выводится из аргумента, который вы не хотели использовать для вывода (например, `defaultColor` который расширяет `C`). |

**Examples:**

```typescript
function createStreetLight<C extends string>(
  colors: C[],
  defaultColor?: NoInfer<C>,
) {
  // ...
}

createStreetLight(["red", "yellow", "green"], "red");   // OK
// createStreetLight(["red", "yellow", "green"], "blue"); // Error
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ThisParameterType<Type>`

**Definition:**

Извлекает тип явного `this` параметр из типа функции.

| Когда использовать | Заметки |
|-------------|-------|
| Расширенный — для набора текста `bind` обертки и консервация `this` контекст. | Применяется только тогда, когда функция объявляет `this:` явно — обычные методы используют контекстный `this`. |

**Examples:**

```typescript
function toHex(this: Number) {
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `OmitThisParameter<Type>`

**Definition:**

Удаляет `this` из типа функции — результат `.bind()`.

| Когда использовать | Заметки |
|-------------|-------|
| Введите вывод привязки, когда `this` фиксировано. | Дженерики удаляются; в типе вывода сохраняется только **последняя** перегрузка. |

**Examples:**

```typescript
function toHex(this: Number) {
  return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);
console.log(fiveToHex()); // "5"
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ThisType<Type>`

**Definition:**

Маркер для контекста `this` внутри объектных литералов с методами, а не утилитой преобразования.

| Когда использовать | Заметки |
|-------------|-------|
| Использование в дескрипторах объектов, где необходимо ввести методы. `this` без явного `this` параметр. | Пустой интерфейс в `lib.d.ts`; имеет смысл только тогда, когда компилятор применяет контекстную типизацию к `methods` в дескрипторе объекта. |

**Examples:**

```typescript
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>;
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  return { ...(desc.data ?? {}), ...(desc.methods ?? {}) } as D & M;
}

const obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // 'this' is { x: number; y: number } & methods
      this.y += dy;
    },
  },
});
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### Intrinsic string manipulation types

**Definition:**

Встроенные операторы типов для строковых литералов: `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`.

| Когда использовать | Заметки |
|-------------|-------|
| Применить к объединениям строковых литералов в отображаемых/шаблонных типах — `` Uppercase<"hello"> `` → `"ПРИВЕТ"`. | Only work on string literal types (or unions of them) — `Прописные буквы<string>` stays `строка`, а не конкретный результат. |

**Examples:**

```typescript
type EventName<T extends string> = `${T}Changed`;
type T0 = Uppercase<"hello">;       // "HELLO"
type T1 = Capitalize<"hello">;      // "Hello"
type T2 = Uncapitalize<"Hello">;    // "hello"

type GetterName<T extends string> = `get${Capitalize<T>}`;
type SetterName<T extends string> = `set${Capitalize<T>}`;
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

</details>

<a name="reference"></a>
