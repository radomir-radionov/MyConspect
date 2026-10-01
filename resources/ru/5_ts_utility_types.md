# TypeScript — Utility Types

Встроенные utility types: Partial, Pick, Omit, Record, ReturnType и др.

[← Назад к хабу](./5_ts.md)

### Related docs

- [TypeScript — hub](./5_ts.md) · [Type Manipulation](./5_ts_type_manipulation.md) · [Интервью](./5_ts_interview.md)

### Sections

- [Utility types](#utility-types)

---

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

| Аспект | Деталь                                                                                           |
| ------ | ------------------------------------------------------------------------------------------------ |
| Резюме | Однострочные определения (флэш-карточки для интервью) — язык TypeScript или функция компилятора. |

- `Partial<T>` — все объекты |

- `Partial<T>` — все свойства необязательны
- `Required<T>` — все необходимые свойства (в отличие от Partial)
- `Readonly<T>` — свойства нельзя переназначить
- `Record<Keys, T>` — объект с фиксированными ключами и унифицированным типом значения
- `Pick<T, Keys>` — подмножество свойств
- `Omit<T, Keys>` — все свойства, кроме перечисленных ключей
- `Exclude<Union, E>` — удалить членов союза, назначенных `E`
- `Extract<T, U>` — обеспечить возможность назначения членов профсоюза `U`
- `InstanceType<C>` — тип экземпляра из конструктора
- `ThisType<T>` - контекстуальный `this` в объектных литералах

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### Interview examples — all utilities in one place

**Definition:**

Примеры интервью — все утилиты в одном месте — язык TypeScript или функция компилятора.

| Аспект | Деталь                                                                                  |
| ------ | --------------------------------------------------------------------------------------- |
| Резюме | Примеры интервью — все утилиты в одном месте — язык TypeScript или функция компилятора. |

**Examples:**

```typescript
interface Person {
  name: string;
  age: number;
  email: string;
}

const partial: Partial<Person> = { name: "John" };

const required: Required<Partial<Person>> = {
  name: "John",
  age: 25,
  email: "j@x.com",
};

const frozen: Readonly<Person> = { name: "John", age: 25, email: "j@x.com" };
// frozen.name = "Jane"; // Error

const fruits: Record<string, number> = { apple: 5, banana: 3 };

const picked: Pick<Person, "name" | "email"> = {
  name: "John",
  email: "j@x.com",
};

const omitted: Omit<Person, "email"> = { name: "John", age: 30 };

type Primitive = string | number | boolean;
type NoBool = Exclude<Primitive, boolean>; // string | number
type OnlyBool = Extract<Primitive, boolean>; // boolean

type MaybeUser = string | null | undefined;
type User = NonNullable<MaybeUser>; // string

type GetUser = (id: number, active: boolean) => string;
type Params = Parameters<GetUser>; // [number, boolean]
type Ret = ReturnType<() => { name: string }>; // { name: string }

class UserClass {
  name = "John";
  age = 30;
}
type Inst = InstanceType<typeof UserClass>; // UserClass

type Helper = { getName(): string } & ThisType<{ name: string }>;
const helper: Helper = {
  getName() {
    return this.name;
  },
};
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Awaited<Type>`

**Definition:**

Разворачивает `Promise` печатает рекурсивно — моделирует то, что `await` возвращается.

| Когда использовать                                                                                                      | Заметки                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `type R = Awaited<Promise<Promise<string>>>` → `string`. Работает и в союзах с членами, не являющимися членами Promise. | Работает и с профсоюзами — `Awaited<boolean \| Promise<number>>` становится `number \| boolean`, не просто `number`. |

**Examples:**

```typescript
type A = Awaited<Promise<string>>; // string
type B = Awaited<Promise<Promise<number>>>; // number
type C = Awaited<boolean | Promise<number>>; // number | boolean
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Partial<Type>`

**Definition:**

Делает каждое свойство `Type` необязательный.

| Когда использовать                                                                            | Заметки                                                                                                                                                                                                                                  |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
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
  { description: "throw out trash" },
);
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Required<Type>`

**Definition:**

Делает все необходимые свойства — противоположными `Partial`.

| Когда использовать                                                                                             | Заметки                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
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

| Когда использовать                                                                                                   | Заметки                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Readonly<User>` для замороженной конфигурации. Только поверхностное — вложенные объекты все равно могут мутировать. | Только поверхностное — свойства вложенных объектов по-прежнему можно изменять, если вы не пометите их только для чтения или не используете `Readonly` рекурсивно. |

**Examples:**

```typescript
interface Todo {
  title: string;
}

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

| Когда использовать                                                                          | Заметки                                                                                                                               |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
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

| Когда использовать                                                                              | Заметки                                                                              |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
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

| Когда использовать                                                                                                      | Заметки                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
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

| Когда использовать                                                                                       | Заметки                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Exclude<"a" \| "b" \| "c", "c">` → `"a" \| "b"`. Работает с **объединениями**, а не с ключами объектов. | Использует присваиваемость, а не равенство — `Exclude<string \| number, Function>` урожайность `string \| number` потому что ни один из них не может быть назначен `Function`. |

**Examples:**

```typescript
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"

type Shape = { kind: "circle"; radius: number } | { kind: "square"; x: number };

type NoCircle = Exclude<Shape, { kind: "circle" }>;
// { kind: "square"; x: number }
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Extract<Type, Union>`

**Definition:**

Сохраняет только членов профсоюза, которым можно назначить `Union`.

| Когда использовать                                            | Заметки                                                                                    |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `Extract<Primitive, boolean>` → `boolean`. Зеркало `Exclude`. | Зеркало `Exclude` — `Extract<T, U>` ≡ `T extends U ? T : never` (дистрибутив над союзами). |

**Examples:**

```typescript
type T0 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type T1 = Extract<string | number | (() => void), Function>; // () => void

type Circle = Extract<Shape, { kind: "circle" }>;
// { kind: "circle"; radius: number }
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `NonNullable<Type>`

**Definition:**

Удаляет `null` и `undefined` от `Type`.

| Когда использовать                                                                                                                 | Заметки                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `NonNullable<string \| null>` → `string`. После проверки на нулевое значение или для ввода гарантированно присутствующих значений. | Удаляет только этих двоих — `void` и другие ложные типы остаются. |

**Examples:**

```typescript
type T0 = NonNullable<string | number | undefined>; // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `Parameters<Type>`

**Definition:**

Извлекает типы параметров функции в виде кортежа.

| Когда использовать                                                                  | Заметки                                                                                                                                    |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `Parameters<typeof fn>` → `[string, number]` для оберток и функций высшего порядка. | Для перегруженных функций используются параметры **последней** перегрузки. `Parameters<any>` → `unknown[]`; `Parameters<never>` → `never`. |

**Examples:**

```typescript
declare function f1(arg: { a: number; b: string }): void;

type T0 = Parameters<() => string>; // []
type T1 = Parameters<(s: string) => void>; // [s: string]
type T2 = Parameters<typeof f1>; // [arg: { a: number; b: string }]
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ConstructorParameters<Type>`

**Definition:**

Извлекает типы параметров конструктора в виде кортежа.

| Когда использовать                                                                                | Заметки                                                                                                                                 |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `ConstructorParameters<typeof Date>` для упаковки собственных или пользовательских конструкторов. | `ConstructorParameters<Function>` is `never` — `Function` слишком свободен, чтобы соответствовать `abstract new (...args: any) => any`. |

**Examples:**

```typescript
type T0 = ConstructorParameters<ErrorConstructor>; // [message?: string]

class C {
  constructor(a: number, b: string) {}
}
type T1 = ConstructorParameters<typeof C>; // [a: number, b: string]
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ReturnType<Type>`

**Definition:**

Извлекает тип возвращаемого значения типа функции.

| Когда использовать                                                               | Заметки                                                                                                                          |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `ReturnType<typeof fetchUser>` — определить тип результата API без дублирования. | Перегрузки → побеждает последняя подпись. `ReturnType<string>` ошибки (не функция); `ReturnType<Function>` деградирует до `any`. |

**Examples:**

```typescript
declare function f1(): { a: number; b: string };

type T0 = ReturnType<() => string>; // string
type T1 = ReturnType<typeof f1>; // { a: number; b: string }
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `InstanceType<Type>`

**Definition:**

Получает тип экземпляра из типа конструктора.

| Когда использовать                                                                   | Заметки                                                                                              |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `InstanceType<typeof MyClass>` → `MyClass`. Для фабричных шаблонов и контейнеров DI. | `InstanceType<typeof MyClass>` дает тебе `MyClass` экземпляры — полезны для фабричных шаблонов и DI. |

**Examples:**

```typescript
class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>; // C
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `NoInfer<Type>`

**Definition:**

Блокирует TS вывод аргументов типа из этой позиции (TS 5.4+).

| Когда использовать                                                                                                     | Заметки                                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Используйте параметры по умолчанию/общие параметры, которые не должны приводить к выводу: `defaultColor?: NoInfer<C>`. | Добавлено в TS 5.4 — исправлены случаи, когда параметр по умолчанию/обобщенный параметр выводится из аргумента, который вы не хотели использовать для вывода (например, `defaultColor` который расширяет `C`). |

**Examples:**

```typescript
function createStreetLight<C extends string>(
  colors: C[],
  defaultColor?: NoInfer<C>,
) {
  // ...
}

createStreetLight(["red", "yellow", "green"], "red"); // OK
// createStreetLight(["red", "yellow", "green"], "blue"); // Error
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

### `ThisParameterType<Type>`

**Definition:**

Извлекает тип явного `this` параметр из типа функции.

| Когда использовать                                                            | Заметки                                                                                                        |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
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

| Когда использовать                                | Заметки                                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------------------- |
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

| Когда использовать                                                                                      | Заметки                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
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

| Когда использовать                                                                                               | Заметки                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Применить к объединениям строковых литералов в отображаемых/шаблонных типах — `Uppercase<"hello">` → `"ПРИВЕТ"`. | Only work on string literal types (or unions of them) — `Прописные буквы<string>` stays `строка`, а не конкретный результат. |

**Examples:**

```typescript
type EventName<T extends string> = `${T}Changed`;
type T0 = Uppercase<"hello">; // "HELLO"
type T1 = Capitalize<"hello">; // "Hello"
type T2 = Uncapitalize<"Hello">; // "hello"

type GetterName<T extends string> = `get${Capitalize<T>}`;
type SetterName<T extends string> = `set${Capitalize<T>}`;
```

**Sources:** [Справочник по TypeScript — типы утилит] (https://www.typescriptlang.org/docs/handbook/utility-types.html)

</details>

<a name="reference"></a>
