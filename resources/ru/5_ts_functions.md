# TypeScript — Functions

Сигнатуры вызовов, перегрузки и этот набор текста.

[ ← Вернуться в хаб](./5_ts.md)

### Related docs

* [TypeScript — hub](./5_ts.md) · [Интервью](./5_ts_interview.md)

### Sections

- [Functions](#functions)

---

## Functions

<details>
  <summary>Function types</summary>

### Function Type Expressions

**Definition:**

Типы встроенных функций: `(a: string, b: number) => boolean`.

| Когда использовать | Заметки |
|-------------|-------|
| Используйте для обратных вызовов и переменных, содержащих функции. Включает имена параметров (необязательно, но документировано). | Имя параметра **обязательно** в синтаксисе. `(string) => void` НЕ означает «принимает строку» — это означает «принимает параметр, названный буквально `string` типа `any`". Всегда пишите имя: `(s:s |

**Examples:**

```typescript
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);

// Named alias
type GreetFunction = (a: string) => void;
function greeter2(fn: GreetFunction) { /* ... */ }
```

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Call Signatures

**Definition:**

Опишите вызываемые объекты, которые также имеют свойства — функции с дополнительными полями.

| Когда использовать | Заметки |
|-------------|-------|
| `` type Desc = { (x: number): boolean; description: string } `` — callable + metadata. | Call signatures use `:` before the return type, not `=>`. `(arg: число): логическое значение` inside `{ }`, not `(arg: число) => boolean`. |

**Examples:**

```typescript
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}

function myFunc(someArg: number) {
  return someArg > 3;
}
myFunc.description = "default description";
doSomething(myFunc);
```

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Construct Signatures

**Definition:**

Опишите что-то, что можно вызвать с помощью `new`: `new (x: number) => SomeClass`.

| Когда использовать | Заметки |
|-------------|-------|
| Введите шаблоны фабрики и интерфейсы конструктора для внедрения зависимостей. | Некоторые значения работают в обе стороны (`Date` можно вызвать с или без `new`). Вы можете комбинировать вызовы и создавать сигнатуры одного и того же типа. |

**Examples:**

```typescript
type SomeConstructor = {
  new (s: string): SomeObject;
};

function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}

// Callable AND constructable
interface CallOrConstruct {
  (n?: number): string;
  new (s: string): Date;
}

fn(Date); // Date works both ways
```

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Generic Functions

**Definition:**

Функции с параметрами типа, связывающими типы ввода и вывода.

| Когда использовать | Заметки |
|-------------|-------|
| `` function first<T>(arr: T[]): T `` — preserves element type. Add constraints: `` T extends { length: number } ``. | TypeScript автоматически выводит параметры типа в большинстве вызовов. Не переусердствуйте — дополнительные параметры типов ухудшают вывод и читаемость. |

**Examples:**

```typescript
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}

const s = firstElement(["a", "b", "c"]); // string
const n = firstElement([1, 2, 3]);       // number
const u = firstElement([]);              // undefined
```

```typescript
function map<Input, Output>(
  arr: Input[],
  func: (arg: Input) => Output
): Output[] {
  return arr.map(func);
}

const parsed = map(["1", "2", "3"], (n) => parseInt(n));
// Input: string, Output: number → number[]
```

```typescript
function longest<Type extends { length: number }>(a: Type, b: Type) {
  return a.length >= b.length ? a : b;
}

longest([1, 2], [1, 2, 3]);     // number[]
longest("alice", "bob");        // string
// longest(10, 100);            // Error — number has no .length
```

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Guidelines for good generics

**Definition:**

Рекомендации по хорошим обобщениям — язык TypeScript или функция компилятора.

| Аспект | Деталь |
|--------|--------|
| Summary | Guidelines for good generics — TypeScript language or compiler feature.

* **Push type params down** — prefer `arr: Type |

* ** Push-параметры вниз** — предпочитаю `arr: Type[]` над `arr: Type extends any[]` (лучший вывод о типе возвращаемого значения)
* **Используйте меньше параметров типа** — каждый параметр должен относиться к двум или более значениям.
* **Параметр типа должен появиться дважды** — если он появляется только один раз, он, вероятно, вам не нужен (`greet<Str extends string>(s: Str)` → просто используйте `string`)

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Pitfall: constrained return type

**Definition:**

Функция, обещающая вернуться `Type` не могу вернуть общий `{ length: number }` — вызывающие абоненты ожидают тот же подтип, который они передали.

| Аспект | Деталь |
|--------|--------|
| Резюме | Функция, обещающая вернуться `Type` не могу вернуть общий `{ length: number }` — вызывающие абоненты ожидают тот же подтип, что и они |

Функция, обещающая вернуться `Type` не могу вернуть общий `{ length: number }` — вызывающие абоненты ожидают тот же подтип, который они передали.

**Examples:**

```typescript
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) return obj;
  return { length: minimum }; // Error — not assignable to Type
}
```

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Optional Parameters

**Definition:**

Параметры функции, которые можно опустить, отмечены значком `?` или заданы значения по умолчанию.

| Когда использовать | Заметки |
|-------------|-------|
| `` function f(a: string, b?: number) `` or `` b = 0 ``. Optional params must come after required ones. | Callers can always pass `неопределенный` explicitly — it simulates a missing argument. `f()`, `f(10)`, and `f(undefined)` все действительны. |

**Examples:**

```typescript
function f(x?: number) {
  // x is number | undefined
}
f();      // OK
f(10);    // OK
f(undefined); // OK

function g(x = 10) {
  // x is number — undefined replaced with 10
}
```

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Pitfall: optional params in callbacks

**Definition:**

myForEach([1, 2, 3], (a, i) => {

console.log(i.toFixed()); // Ошибка: возможно, я не определен
});

`обратный вызов: (arg: an |

`callback: (arg: any, index?: number) => void` означает, что **вызывающий объект** может вызываться с одним аргументом, поэтому `index` is `number | undefined` в вашем обратном вызове. Если «обратный вызов может пропустить индекс», вместо этого используйте rest-объединение или перегрузку.

**How it works:** Никогда не отмечайте параметр обратного вызова как необязательный, если только вы не собираетесь вызывать его без этого аргумента.

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed()); // Error: i possibly undefined
});
```

```typescript
// Wrong mental model — index? means caller might skip it
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i]); // legal — index might be undefined in callback
  }
}

myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed()); // Error: i possibly undefined
});
```

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Practical examples — defaults, optional, rest, return types

**Definition:**

// Необязательный параметр

const приветствие = (имя: строка, возраст?: число) => `${name}${age ?? ""}`;
// createPassword('Джек'); // Ошибка без необязательного возраста

| Аспект | Деталь |
|--------|--------|
| Резюме | // Необязательный параметр
const приветствие = (имя: строка, возраст?: число) => `${name}${age ?? ""}`;
// createPassword('Джек'); // |

**Examples:**

```typescript
// Default parameters
const createPassword = (name = "Max", age: number | string = 20) =>
  `${name}${age}`;

// Optional parameter
const greet = (name: string, age?: number) => `${name}${age ?? ""}`;
// createPassword('Jack'); // Error without optional age

// Rest parameters
const createSkills = (name: string, ...skills: string[]) =>
  `${name}, my skills are ${skills.join()}`;
createSkills("Jack", "JS", "TS", "React");

// Explicit return types
const sum = (a: number, b: number): number => a + b;
const createEmptyObject = (): object => ({});

// void — no return value (don't annotate the variable as void)
const greetUser = (): void => {
  alert("Hello!");
};

// never — throws or runs forever
const fail = (msg: string): never => {
  throw new Error(msg);
};
const infiniteLoop = (): never => {
  while (true) {}
};
```

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Function Overloads

**Definition:**

Несколько сигнатур вызовов для одного имени функции с разными типами параметров/возвратов.

| Когда использовать | Заметки |
|-------------|-------|
| Напишите выше сигнатуры перегрузки, а затем одну широкую реализацию. TS выбирает соответствующую перегрузку на месте вызова. | Подпись реализации **невидима** для вызывающих сторон — вы не можете вызвать ее напрямую. Он должен быть совместим со всеми перегрузками.Предпочитайте **объединенные типы параметров**, а не перегрузки, когда arg count и retu |

**Examples:**

```typescript
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  }
  return new Date(mOrTimestamp);
}

const d1 = makeDate(12345678);  // OK — 1 arg
const d2 = makeDate(5, 5, 5);   // OK — 3 args
// const d3 = makeDate(1, 3);   // Error — no overload for 2 args
```

```typescript
// Different parameter types → different return types
function combine(a: string, b: string): string;
function combine(a: number, b: number): number;
function combine(a: string | number, b: string | number): string | number {
  return a + b;
}

const r1 = combine("Hello", "World"); // string
const r2 = combine(5, 10);            // number

// Class method overloads — same pattern
class Logger {
  log(message: string): void;
  log(code: number): void;
  log(value: string | number): void {
    console.log(value);
  }
}

new Logger().log("Hello");
new Logger().log(404);
```

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Prefer unions over overloads when possible

**Definition:**

Лен("");  // ОК

Лен([0]); // ОК
// len(Math.random() > 0.5 ? "привет" : [0]); // Ошибка — нет соответствующей перегрузки

| Оператор | Значение |
|----------|----------|
| `A \| B` | Один из A или B |
| `A & B` | Должен удовлетворить оба |

**Examples:**

```typescript
// Overloads — fails on union input
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) { return x.length; }

len("");  // OK
len([0]); // OK
// len(Math.random() > 0.5 ? "hello" : [0]); // Error — no matching overload

// Union — works with union input
function len2(x: string | any[]) {
  return x.length;
}
```

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Declaring `this` in a Function

**Definition:**

Явный `this` тип параметра в функциях, которые используют `this` определенным образом.

| Когда использовать | Заметки |
|-------------|-------|
| `` function fn(this: HTMLElement, e: Event) `` — first param is `этот`; not passed at call site. | Arrow functions **cannot** declare `этот` — they lexically capture outer `этот`. Use `функция` syntax when `эта типизация имеет значение. |

**Examples:**

```typescript
interface User {
  admin: boolean;
}

interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(function (this: User) {
  return this.admin; // OK — this is User
});

// Arrow function — captures outer/global this, not User
// db.filterUsers(() => this.admin); // Error
```

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `void`, `object`, `unknown`, `never`, and `Function`

**Definition:**

Общие типы для функций и значений: без возврата, непримитивные, безопасный верх, невозможно и избегать. `Function`.

| Когда использовать | Заметки |
|-------------|-------|
| `void` без возврата; `unknown` для входов; `never` для бросков; `object` для непримитивов; никогда не используй `Function` тип. | `void` ≠ `undefined`. `void` означает «возвращаемое значение игнорируется». `unknown` безопасно `any` — перед использованием необходимо сузить. Никогда не используйте глобальные `Function` тип — он возвращает `any`. |

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `void` — no meaningful return

**Definition:**

// void ≠ не определено на уровне типа

// Функция, возвращающая неопределенное значение, не совпадает с void во всех контекстах
 |

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // void ≠ undefined at the type level
// A function returning undefined is not the same as void in all contexts
```

```typescript
function noop(): void {
  return; // OK
}

// void ≠ undefined at the type level
// A function returning undefined is not the same as void in all contexts
```

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `object` — any non-primitive

**Definition:**

// объект | null — отклоняет примитивы

const create = (o: object | null): void => {};
// создать(1);      // Ошибка
// создать("42");   // Ошибка
создать ({объект: 1}); // ОК

| Аспект | Деталь |
|--------|--------|
| Резюме | // объект \| null — отклоняет примитивы
const create = (o: object \| null): void => {};
// создать(1);      // Ошибка
// кр |

**Examples:**

```typescript
function logObj(val: object) { /* ... */ }

// object | null — rejects primitives
const create = (o: object | null): void => {};
// create(1);      // Error
// create("42");   // Error
create({ obj: 1 }); // OK

// Functions are objects in JS — function types count as object
```

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `unknown` — safe any

**Definition:**

ProcessValue("Привет"); // «ПРИВЕТ»

ProcessValue (10);      // "Неизвестное значение"
 |

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | processValue("hello"); // "HELLO"
processValue(10);      // "Unknown value"
```

```typescript
function f1(a: any) {
  a.b(); // OK — no checking
}

function f2(a: unknown) {
  // a.b(); // Error — must narrow first
  if (typeof a === "object" && a !== null && "b" in a) {
    (a as { b: () => void }).b();
  }
}

function safeParse(s: string): unknown {
  return JSON.parse(s);
}

function processValue(value: unknown): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return "Unknown value";
}

processValue("hello"); // "HELLO"
processValue(10);      // "Unknown value"
```

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `never` — never returns

**Definition:**

Введите значения, которые никогда не встречаются — генерирующие функции, бесконечные циклы или проверки полноты.

| Аспект | Деталь |
|--------|--------|
| Резюме | Введите значения, которые никогда не встречаются — генерирующие функции, бесконечные циклы или проверки полноты. |

**Examples:**

```typescript
function fail(msg: string): never {
  throw new Error(msg);
}

const infiniteLoop = (): never => {
  while (true) {}
};

function fn(x: string | number) {
  if (typeof x === "string") { /* ... */ }
  else if (typeof x === "number") { /* ... */ }
  else {
    const _exhaustive: never = x; // x is never here
  }
}
```

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

### `Function` — avoid it

**Definition:**

// Предпочитаю:

введите VoidFunc = () => void; // когда ты не будешь его вызывать
тип SpecificFunc = (a: число, b: строка) => логическое значение;
машинописный текст
функция doSomething (f: Функция) {
  вернуть f(1, 2, 3); // возвращает любое — небезопасно
}

// Предпочитаю:
введите VoidFunc = () => void; // когда ты не будешь его вызывать
тип SpecificFunc = (a: число, b: строка) => логическое значение;
```

**Examples:**

```

| Аспект | Деталь |
|--------|--------|
| Резюме | // Предпочитаю:
введите VoidFunc = () => void; // когда ты не будешь его вызывать
тип SpecificFunc = (a: число, b: строка) => логическое значение;
 |

```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Rest Parameters and Arguments

**Definition:**

Collect remaining args into a tuple/array: `...rest: number[]`.

| When to use | Notes |
|-------------|-------|
| `` function sum(...nums: number[]) ``. Tuple rest: `...args: [string, number, ...boolean[]]`. | `const args = [8, 5]` infers `number[]`, not a 2-tuple — spread into `Math.atan2` fails. Fix with `as const` for a fixed-length tuple. |

**Examples:**

```машинописный текст
функция умножить(n: число, ...m: число[]) {
  return m.map((x) => n * x);
}

const a = умножить (10, 1, 2, 3, 4); // [10, 20, 30, 40]
```

```машинописный текст
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2);

// Ошибка — выводится как число[], а не кортеж
константные аргументы = [8, 5];
// Math.atan2(...args); // Ошибка

// Исправить
const args2 = [8, 5] как const;
Math.atan2(...args2); // ХОРОШО
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Parameter Destructuring

**Definition:**

Typing unpacked object/ array parameters in the function signature.

| When to use | Notes |
|-------------|-------|
| `` function f({ x, y }: { x: number; y: number }) `` — inline or named type for the destructured shape. | Inline `{ a, b, c }: { a: number; b: number; c: number }` gets verbose fast — extract a named type or interface for reuse. |

**Examples:**

```машинописный текст
function sum({ a, b, c }: { a: число; b: число; c: число }) {
  console.log(а + б + с);
}

сумма ({а: 10, б: 3, в: 9});

тип ABC = {а: число; б: номер; с: номер};
функция sum2({ a, b, c }: ABC) {
  console.log(а + б + с);
}
```

**Sources:** [TypeScript handbook — functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

### Function Assignability

**Definition:**

Rules for when one function type can be assigned to another (params contravariant, returns covariant with strict).

| When to use | Notes |
|-------------|-------|
| `() => void` accepts functions that return anything (return discarded). Enable `strictFunctionTypes` for sounder param checking. | `() => void` accepts implementations that return *anything* — the return value is discarded. This is why `forEach` callbacks can return values even though the type says `void`. But a **literal** `func |

**Examples:**

```машинописный текст
введите VoidFunc = () => void;

const f1: VoidFunc = () => { return true; };  // ОК — возврат игнорируется
const f2: VoidFunc = () => true;               // ОК
const f3: VoidFunc = функция () { return true; }; // ОК

константа v1 = f1(); // v1 недействителен

// Почему это важно:
константный источник = [1, 2, 3];
константа dst = [0];
src.forEach((el) => dst.push(el)); // push возвращает число, forEach ожидает void — ОК
```

```машинописный текст
функция f2(): void {
  вернуть истину; // Ошибка в явном теле функции void
}

const f3 = функция (): void {
  вернуть истину; // Ошибка
};
```

**Sources:** [Справочник по TypeScript — функции] (https://www.typescriptlang.org/docs/handbook/2/functions.html)

</details>

<a name="object-types"></a>
