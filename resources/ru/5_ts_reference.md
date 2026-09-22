# TypeScript — Reference

Справочник по языку и расширенные темы.

[ ← Вернуться в хаб](./5_ts.md)

### Related docs

* [TypeScript — Основы](./5_ts_core.md) · [TypeScript — Сужение](./5_ts_narrowing.md) · [TypeScript — Функции](./5_ts_functions.md) · [TypeScript — Объекты](./5_ts_objects.md) · [TypeScript — Generics](./5_ts_generics.md) · [TypeScript — Ссылка](./5_ts_reference.md) · [TypeScript — Интервью](./5_ts_interview.md)

### Sections

- [Language reference](#language-reference)
- [Advanced topics](#advanced-topics)

---

## Language reference

<details>
  <summary>Language reference</summary>

### Why TypeScript instead of JavaScript?

**Definition:**

JavaScript является динамически типизированным — ошибки типа обнаруживаются только во время выполнения** (или никогда, если путь к ошибке не обнаружен). TypeScript — это **расширенная версия JavaScript**: весь допустимый JS является действительным TS. Он добавляет дополнительные статические типы, которые проверяются во время **компиляции**, а затем удаляются — на выходе по-прежнему остается простой JavaScript.

| Аспект | Деталь |
|--------|--------|| Резюме | JavaScript является динамически типизированным — ошибки типа обнаруживаются только во время выполнения** (или никогда, если путь к ошибке не обнаружен).  |

JavaScript является динамически типизированным — ошибки типа обнаруживаются только во время выполнения** (или никогда, если путь к ошибке не обнаружен). TypeScript — это **расширенная версия JavaScript**: весь допустимый JS является действительным TS.Он добавляет дополнительные статические типы, которые проверяются во время **компиляции**, а затем удаляются — на выходе по-прежнему остается простой JavaScript.

**Используйте TypeScript, когда** вам нужно меньше производственных ошибок, более безопасный рефакторинг, лучшая поддержка редактора и более четкие контракты между модулями — особенно в командах и в долгоживущих базах кода.

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Quick list — core concepts

1. **Статическая проверка типов** — выявляет ошибки до запуска кода.
2. **Ошибки, не связанные с исключениями** — TS отмечает ошибки, которые JS автоматически разрешает.
3. **Типы инструментов** — автозаполнение, быстрые исправления, рефакторинг, переход к определению.
4. **`tsc`** — компилятор TypeScript (проверка типа + генерирование JS)
5. **Выдача с ошибками** — JS по-прежнему выводит по умолчанию; использовать `--noEmitOnError` заблокировать это
6. **Явные типы** — аннотируйте параметры и переменные, когда вывода недостаточно.
7. **Стертые типы** — аннотации исчезают во время компиляции; нулевой эффект во время выполнения
8. **Понижение уровня** — TS переписывает современный JS на более старые цели (например, ES2015 → ES5).
9. **Строгость** — проверка дозвона с помощью `strict`, `noImplicitAny`, `strictNullChecks`

### Error handling — static vs runtime

**Definition:**

1. **Статическая проверка типов** — несоответствия, отсутствующие свойства, недоступный код (`tsc` / IDE)

2. **Время выполнения `try/catch`** — сбои сети, синтаксический анализ, неожиданное поведение во время выполнения.
3. **Пользовательские классы ошибок** — структурированные ошибки с дополнительным контекстом.
4. **Защитные предложения и утверждения** — узкие типы (`if (!user) return`) or `as` (без проверки времени выполнения)
5. **Строгий режим** — `strict` in `tsconfig.json`

| Аспект | Деталь |
|--------|--------|
| Резюме | 1. **Статическая проверка типов** — несоответствия, отсутствующие свойства, недоступный код (`tsc` / IDE)
2. **Время выполнения `try/catch`** |

1. **Статическая проверка типов** — несоответствия, отсутствующие свойства, недоступный код (`tsc` / IDE)
2. **Время выполнения `try/catch`** — сбои сети, синтаксический анализ, неожиданное поведение во время выполнения.
3. **Пользовательские классы ошибок** — структурированные ошибки с дополнительным контекстом.
4. **Защитные предложения и утверждения** — узкие типы (`if (!user) return`) or `as` (без проверки времени выполнения)
5. **Строгий режим** — `strict` in `tsconfig.json`

**Examples:**

```typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

function parseAge(input: string): number {
  const n = Number(input);
  if (Number.isNaN(n)) {
    throw new ValidationError("Invalid age", "age");
  }
  return n;
}
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Union (`|`) vs intersection (`&`) — quick ref

**Definition:**

Союз (`|`) против пересечения (`&`) — быстрая ссылка — язык TypeScript или функция компилятора.

| Оператор | Значение |
|----------|----------|
| `A \| B` | Один из A или B |
| `A & B` | Должен удовлетворить оба |

* **Union** — значение является **одним из** нескольких типов: `string | number` (или/или)
* **Пересечение** — значение должно удовлетворять **всем** типам одновременно: `A & B` (объединить фигуры)
* `string & number` невозможно (нет значения одновременно)
* Расширение интерфейсов — пересечение; `interface Admin extends User` vs `type Admin = User & { role: string }`

**Examples:**

```typescript
let id: number | string;
id = 10;    // OK
id = "42";  // OK
// id = true; // Error

type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged; // must have both name and age
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Quick list — all everyday types

1. **Примитивы** — `string`, `number`, `boolean`
2. **Массивы** — `number[]`, `string[]`, `Array<T>`
3. **`any`** — тип «Сдаюсь»
4. **`unknown`** — безопасный верхний тип; перед использованием необходимо сузить (см. подробнее о функциях)
5. **Аннотации типов** — явные метки переменных.
5. **Функции** — типы параметров, типы возвращаемых значений, контекстная типизация.
6. **Типы объектов** — фигуры с именованными свойствами.
7. **Дополнительные свойства** — `?` в полях, которые могут отсутствовать
8. **Типы объединения** — `A | B` — «может быть то ИЛИ то»
9. **Введите псевдонимы** — `type Name = ...` — дать типу прозвище
10. **Интерфейсы** — `interface Name { ... }` — чертежи объектов, которые можно расширить
11. **Тип утверждений** — `as SomeType` — «поверь мне, компилятор»
12. **`satisfies`** — проверка формы без расширения вывода (TS 4.9+)
13. **Литеральные типы** — точные значения, например `"left"` or `42`
14. **`null` и `undefined`** — виды отсутствия
15. **Enums** — именованные наборы констант (функция времени выполнения)
16. **Менее распространенные примитивы** — `bigint`, `symbol`

### Quick list — function concepts

1. **Выражения типа функции** — `(a: string) => void`
2. **Сигнатуры вызовов** — вызываемые объекты со свойствами.
3. **Создание подписей** — `new (...)` для конструкторов
4. **Общие функции** — введите параметры, связывающие ввод и вывод.
5. **Необязательные параметры** — `?` и значения по умолчанию
6. **Перегрузки функций** — несколько сигнатур вызовов, одна реализация.
7. **`this` типы** — объявите, что `this` находится внутри функции
8. **`void`, `object`, `unknown`, `never`** — общие типы, связанные с функциями
9. **Параметры отдыха** — `...args` для неограниченных аргументов
10. **Деструктуризация параметров** — встроенная распаковка аргументов объекта
11. **Назначаемость** — почему `() => boolean` подходит `() => void`

### Object Types

**Definition:**

В JavaScript данные группируются и передаются как объекты. TypeScript описывает эти фигуры с помощью **типов объектов** — анонимных встроенных типов, `interface`, or `type` псевдоним.

| Аспект | Деталь |
|--------|--------|
| Резюме | В JavaScript данные группируются и передаются как объекты. TypeScript описывает эти фигуры с помощью **типов объектов** — |

В JavaScript данные группируются и передаются как объекты. TypeScript описывает эти фигуры с помощью **типов объектов** — анонимных встроенных типов, `interface`, or `type` псевдоним.

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Quick list — object type concepts

1. **Определение типов объектов** — встроенный `{ }`, `interface`, or `type`
2. **Дополнительные свойства** — `prop?: Type`
3. **`readonly` свойства** — неизменяемость свойства во время компиляции
4. **Индексные подписи** — `[key: string]: Type` для динамических ключей
5. **Чрезмерные проверки свойств** — дополнительные ключи, помеченные в литералах объектов.
6. **Расширение типов** — `interface Child extends Parent`
7. **Типы пересечений** — `A & B` комбинировать типы объектов
8. **Расширение и пересечение** — обработка конфликтов различается
9. **Общие типы объектов** — `Box<Type>`, `Array<Type>`
10. **`ReadonlyArray`** — `readonly T[]` / `ReadonlyArray<T>`
11. **Типы кортежей** — типизированные позиции фиксированной длины. `[string, number]`

### Quick list — OOP interview topics

1. **Модификаторы доступа** — `public` (по умолчанию), `private`, `protected`, `readonly`
2. **Свойства параметра** — `constructor(public name: string)` автоматически назначает `this.name`
3. **Наследование** — `extends` + `super()`; переопределить методы с совместимыми сигнатурами
4. **`static`** — принадлежит конструктору, а не экземплярам
5. **`abstract class`** — невозможно создать экземпляр; может иметь конкретные + абстрактные методы
6. **`interface` + `implements`** — контракт на форму класса (без выдачи во время выполнения)
7. **Абстрактный класс и интерфейс** — сравнение см. ниже.
8. **Структурная типизация** — TS проверяет форму, а не номинальные имена классов (кроме `private`/`protected` совместимость)

**OOP building blocks:** классы + интерфейсы, наследование/полиморфизм, модификаторы доступа, абстрактные классы, дженерики классов, декораторы.

### Quick list — type manipulation tools

1. **Обобщенные** — `Type<T>` — типы, которые принимают параметры типа
2. **`keyof`** — объединение ключей объекта
3. **`typeof`** — тип значения/переменной (в позиции типа)
4. **Индексированный доступ** — `T["prop"]` — выберите тип недвижимости
5. **Условные типы** — `T extends U ? X : Y` — if/else для типов
6. **`infer`** — извлечение типов внутри условных выражений
7. **Сопоставленные типы** — `{ [K in keyof T]: ... }` — трансформировать все свойства
8. **Типы литералов шаблонов** — `` `префикс${T}` `` — типы строк из строк
9. **Внутренние помощники** — `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`

### Quick list — reference topics

1. **Шпаргалки** — краткие справочные карточки, которые можно распечатать.
2. **Декораторы** — аннотируют/изменяют классы и члены.
3. **Объединение объявлений** — одно и то же имя → одно объединенное определение.
4. **Enums** — именованные числовые/строковые константы (специфичная для TS функция времени выполнения).
5. **Итераторы и генераторы** — `Symbol.iterator`, `for..of`, генераторы
6. **JSX** — встраивание XML-подобного синтаксиса в `.tsx` файлы
7. **Миксины** — составляют классы из частичных строительных блоков.
8. **Пространства имен** — организация кода в глобальной области видимости (устаревшая версия).
9. **Пространства имен и модули** — когда какие использовать
10. **Символы** — уникальные примитивные ключи и `unique symbol`
11. **Директивы с тройной косой чертой** — директивы компилятора в комментариях.
12. **Совместимость типов** — правила структурного подтипирования.
13. **Вывод типа** — как TS делает вывод без аннотаций
14. **Объявление переменной** — `var` vs `let` vs `const`

### Cheat Sheets

**Definition:**

Сжатые справочные карточки для печати (типы, синтаксис, конфигурация) из официальной документации TypeScript.

| Когда использовать | Заметки |
|-------------|-------|
| Закладка для интервью и настольных справок — не заменит понимания; использовать вместе с этим руководством. | Не особенность языка — артефакт документации. Канонический указатель находится в разделе «Ссылка» в справочнике;контентом могут быть PDF/карточки с изображениями, а не страницы прозы. |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### What to memorize

**Definition:**

Что запомнить — язык TypeScript или особенность компилятора.

| Аспект | Деталь |
|--------|--------|
| Резюме | Что запомнить — язык TypeScript или особенность компилятора.

* Примитивные и объектные типы, синтаксис объединения/пересечения.
* `к |

* Примитивные и объектные типы, синтаксис объединения/пересечения.
* `keyof`, `typeof`, `infer`, сопоставленные/условные типы
* Общие типы утилит (`Partial`, `Pick`, `Omit`, `Record`, `ReturnType`)
* Строгие флаги: `strict`, `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`
* Основы разрешения модуля: `module`, `moduleResolution`, `paths`
* Классы: модификаторы доступа, `abstract` vs `interface`, `implements`, `static`
* Тип сужения: `typeof`, `in`, `instanceof`, предикаты типов, распознаваемые объединения
* `interface` vs `type` — когда какой использовать
* `satisfies` vs `as` против аннотации типа
* Шаблон карты для объединения → таблицы поиска.
* Фирменные типы для идентификаторов именного типа.
* Расширенный: `const` тип параметров, `using`/`Disposable`, `override`, ссылки на проекты, публикации `.d.ts`
* Более строгие флаги: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`
---

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Decorators

**Definition:** Функции, связанные с `@` к классам, методам, свойствам, средствам доступа или параметрам.

**How it works:**

| Рамочная | Примеры |
|-----------|----------|
| **Угловой** | `@Component`, `@Injectable` |
| **NestJS** | `@Controller`, `@Get`, `@Post` |
| **ТипORM** | `@Entity`, `@Column` |

Декораторы оборачивают классы/члены для добавления журналирования, проверки, внедрения внедрения или кэширования **без изменения бизнес-логики**.

**When to use:** Включить для каждого проекта (этап 2) `experimentalDecorators` или ТС 5+ стадия 3). Активно используется в NestJS, Angular, TypeORM.

**Thoughts:** В справочнике описаны декораторы **этапа 2 (экспериментальный)** (`experimentalDecorators: true`). В **TypeScript 5.0+** добавлены декораторы **этапа 3** — другой синтаксис и семантика; проверьте, какой из них использует ваш проект.

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Key concepts

**Definition:**

// Состав: фабрики оцениваются сверху вниз,

// функции декоратора, вызываемые снизу вверх
@first()
@секунда()
метод() {}
// Вывод: first(): фабрика → секунда(): фабрика → секунда(): вызвано → first(): вызвано

**How it works:**

класс, метод, свойство, метод доступа, декораторы параметров.

| Декоратор | Получает | Заметки |
|-----------|----------|-------|
| **Класс** | `constructor` | Если он возвращает значение, заменяет объявление класса |
| **Недвижимость** | `target` (прототип), `propertyKey` | Невозможно использовать в `.d.ts` / окружающий контекст |
| **Метод** | `target`, `propertyKey`, `descriptor` | Можно наблюдать, изменять или заменять метод |
| **Доступ** | то же, что и метод | Применяется для получения/установки `PropertyDescriptor` |
| **Параметр** | параметры конструктора или метода | Только метаданные — ограниченное использование во время выполнения |

См. [Декораторы в TypeScript 5.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#decorators) — нет `experimentalDecorators` нужный; соответствует стандарту ECMAScript.

[Декораторы](https://www.typescriptlang.org/docs/handbook/decorators.html)

`instanceof` является **защитником типа** для экземпляров класса (см. Сужение типов), а не декоратором. Это сужает `unknown`/`union` к определенному классу внутри `if (x instanceof Foo)`.

**Examples:**

```typescript
// Decorator factory — returns the actual decorator
function color(value: string) {
  return function (target: object) {
    // use target and value
  };
}

// Composition: factories evaluated top-to-bottom,
// decorator functions called bottom-to-top
@first()
@second()
method() {}
// Output: first(): factory → second(): factory → second(): called → first(): called

// Evaluation order inside a class:
// 1. Instance member decorators (per member)
// 2. Static member decorators
// 3. Constructor parameter decorators
// 4. Class decorator
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Decorator examples — all four kinds

**Definition:**

// Декоратор свойства — цель — прототип, propertyKey — имя поля

const logProperty = (цель: объект, propertyKey: строка | символ) => {
  console.log(propertyKey); // "секрет"
};

| Аспект | Деталь |
|--------|--------|
| Резюме | // Декоратор свойства — цель — прототип, propertyKey — имя поля
const logProperty = (цель: объект, propertyKey: |

**Examples:**

```typescript
// Class decorator — logs constructor; return value would replace class
const logClass = (constructor: Function) => {
  console.log(constructor); // class User {}
};

// Property decorator — target is prototype, propertyKey is field name
const logProperty = (target: object, propertyKey: string | symbol) => {
  console.log(propertyKey); // "secret"
};

// Method decorator — receives PropertyDescriptor
const logMethod = (
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  console.log(propertyKey); // "getPass"
};

// Accessor decorator — on get/set
const logSet = (
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  console.log(propertyKey); // "myAge"
};

@logClass
class User {
  @logProperty
  secret: number;

  constructor(public name: string, public age: number, secret: number) {
    this.secret = secret;
  }

  @logMethod
  getPass() {
    return `${this.name}${this.age}`;
  }

  @logSet
  set myAge(age: number) {
    this.age = age;
  }
}
```

```typescript
// Parameter decorator — metadata on constructor/method params (NestJS DI uses this pattern)
function logParameter(
  _target: object,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  console.log(`Param ${parameterIndex} of ${String(propertyKey)}`);
}

class Account {
  constructor(
    public name: string,
    @logParameter public balance: number,
  ) {}
}

// Class decorator that returns a constructor REPLACES the class declaration
function Timestamped<T extends new (...args: any[]) => object>(Base: T) {
  return class extends Base {
    createdAt = Date.now();
  };
}

@Timestamped
class User {
  constructor(public name: string) {}
}

const u = new User("Alice");
// u.name + u.createdAt — subclass instance, not plain User
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Decorator examples — interview patterns

**Definition:**

// Декоратор метода — получает PropertyDescriptor

const logMethod = (
  _target: объект,
  propertyKey: строка | символ,
  дескриптор: PropertyDescriptor,
) => {
  const original = descriptor.value;
  descriptor.value = функция (...args: неизвестно []) {
    консоль.log(`Calling ${String(propertyKey)}`);
    вернуть original.apply(this, args);
  };
};

| Аспект | Деталь |
|--------|--------|
| Резюме | // Декоратор метода — получает PropertyDescriptor
const logMethod = (
  _target: объект,
  PropertyKey: строка \| символ |

**Examples:**

```typescript
// Class decorator — receives constructor
const logClass = (constructor: Function) => {
  console.log(constructor.name);
};

// Method decorator — receives PropertyDescriptor
const logMethod = (
  _target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  const original = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    console.log(`Calling ${String(propertyKey)}`);
    return original.apply(this, args);
  };
};

// Decorator factory — factory runs first (top-to-bottom), decorators bottom-to-top
const enumerable = (value: boolean) => (
  _target: object,
  _key: string | symbol,
  descriptor: PropertyDescriptor,
) => {
  descriptor.enumerable = value;
};

@logClass
class User {
  constructor(public name: string) {}

  @logMethod
  @enumerable(false)
  getPass() {
    return this.name;
  }
}
// Factory order: logMethod factory → enumerable factory → enumerable called → logMethod called
```

```typescript
// AOP logging decorator — frameworks like NestJS use similar patterns
function Log(
  _target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const original = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    console.log(`Call: ${propertyKey}(${args.join(", ")})`);
    return original.apply(this, args);
  };
}

class Service {
  @Log
  getData(id: number) {
    return { id, name: "Test" };
  }
}

new Service().getData(42); // Console: Call: getData(42)
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Decorator composition — exact execution order

**Definition:**

Состав декоратора — точный порядок выполнения — язык TypeScript или функция компилятора.

| Аспект | Деталь |
|--------|--------|
| Резюме | Состав декоратора — точный порядок выполнения — язык TypeScript или функция компилятора. |

---

**Examples:**

```typescript
const first = () => {
  console.log("first() completing");
  return () => console.log("first() called");
};
const second = () => {
  console.log("second() completing");
  return () => console.log("second() called");
};

class User {
  @first()
  @second()
  getPass() {
    return "pass";
  }
}
// Console output:
// "first() completing"   ← factory 1 evaluated (top to bottom)
// "second() completing"  ← factory 2 evaluated
// "second() called"      ← decorator 2 applied (bottom to top)
// "first() called"       ← decorator 1 applied
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Declaration Merging

**Definition:** Несколько объявлений с одним и тем же `interface` названия объединяются в один тип.

**When to use:** Дополнить глобальные переменные (`interface Window { myApp: App }`) или типы библиотек. Работает только с `interface`, нет `type`.

**Thoughts:**

Объявления создают сущности в трех группах — **пространство имен**, **тип** и **значение**. Какие слияния зависят от типа объявления:

| Декларация | Пространство имен | Тип | Значение |
|-------------|-----------|------|-------|
| Пространство имен | ✓ | ✓ | ✓ |
| Класс | ✓ | ✓ | ✓ |
| Перечисление | ✓ | ✓ | ✓ |
| Интерфейс |           | ✓ |       || Введите псевдоним |           | ✓ |       |
| Функция |           |      | ✓ |
| Переменная |           |      | ✓ |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Interface merging

**Definition:**

// Члены функций → перегрузки (более поздние интерфейсы выигрывают в порядке наборов перегрузок)

интерфейс Cloner { clone(animal: Animal): Animal; }
интерфейс Cloner { клон (животное: Овца): Овца; }
машинописный текст
интерфейсный блок { высота: число; ширина: число; }
интерфейсный блок { масштаб: число; }

let box: Box = { высота: 5, ширина: 6, масштаб: 10 };

// Члены функций → перегрузки (более поздние интерфейсы выигрывают в порядке наборов перегрузок)интерфейс Cloner { clone(animal: Animal): Animal; }
интерфейс Cloner { клон (животное: Овца): Овца; }
```

Non-function members with the same name must have the **same type** or the compiler errors.

**Examples:**

```

| Аспект | Деталь |
|--------|--------|
| Резюме | // Члены функций → перегрузки (более поздние интерфейсы выигрывают в порядке наборов перегрузок)
интерфейс Cloner { клон(животное: Анима |

```

**Sources:** [TypeScript handbook — intro](https://www.typescriptlang.org/docs/handbook/intro.html)

### Namespace + class/function/enum merging

**Definition:**

// Function with static properties

function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}
namespace buildLabel {
  export let suffix = "";
  export let prefix = "Hello, ";
}
typescript
// Inner class pattern
class Album {
  label: Album.AlbumLabel;
}
namespace Album {
  export class AlbumLabel {}
}

// Function with static properties
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}
namespace buildLabel {
  export let suffix = "";
  export let prefix = "Hello, ";
}
typescript
// map.ts
import { Observable } from "./observable";
declare module "./observable" {
  interface Observable<T> {
    map<U>(f: (x: T) => U): Observable<U>;
  }
}
Observable.prototype.map = function (f) { /* ... */ };
```

Ограничения: невозможно добавлять новые объявления верхнего уровня; не может увеличить экспорт по умолчанию.
---

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // Function with static properties
function buildLabel(name: string): string {
  return buildLabel.prefix + name + build |

```

```

**Module augmentation** — patch existing modules (not merge JS modules natively):

```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Enums

**Definition:**

Именованные константы, которые компилируются в реальный объект JavaScript (числовые или строковые члены).

| Когда использовать | Заметки |
|-------------|-------|
| `enum Color { Red, Green }` затем `Color.Red`. Числовые перечисления поддерживают обратный поиск; строковые перечисления этого не делают. См. «Повседневные типы» → «Перечисления для React/».`as const` альтернативы. | Современный код часто предпочитает `as const` объекты вместо перечислений, чтобы оставаться ближе к простому JS. Числовые перечисления получают **обратные сопоставления** (`Enum[0] === "A"`); строковые перечисления этого не делают. |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Numeric enums

**Definition:**

// Без инициализатора: Вверх = 0, Вниз = 1, ...

enum Dir { Вверх, Вниз, Влево, Вправо }
 |

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // Without initializer: Up = 0, Down = 1, ...
enum Dir { Up, Down, Left, Right }
```

```typescript
enum Direction {
  Up = 1,
  Down,   // 2 — auto-increment
  Left,   // 3
  Right,  // 4
}

// Without initializer: Up = 0, Down = 1, ...
enum Dir { Up, Down, Left, Right }
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### String enums

**Definition:**

Сериализация/отладка лучше, чем непрозрачные числовые значения. Нет автоинкремента.

| Аспект | Деталь |
|--------|--------|
| Резюме | Сериализация/отладка лучше, чем непрозрачные числовые значения. Нет автоинкремента. |

Сериализация/отладка лучше, чем непрозрачные числовые значения. Нет автоинкремента.

**Examples:**

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Union enums & const enums

**Definition:**

// const enum — встраивается во время компиляции, нет объекта времени выполнения

const enum Direction { Вверх, Вниз, Влево, Вправо }
let dirs = [Направление.Вверх, Направление.Вниз]; // → [0, 1] в JS

| Оператор | Значение |
|----------|----------|
| `A \| B` | Один из A или B |
| `A & B` | Должен удовлетворить оба |

**How it works:**

использовать `keyof typeof MyEnum`, нет `keyof MyEnum`.

---

**Examples:**

```typescript
// Literal enum members → enum members become types too
enum ShapeKind { Circle, Square }
interface Circle { kind: ShapeKind.Circle; radius: number; }

// const enum — inlined at compile time, no runtime object
const enum Direction { Up, Down, Left, Right }
let dirs = [Direction.Up, Direction.Down]; // → [0, 1] in JS

// Pitfall: ambient const enums in .d.ts break isolatedModules consumers
```

```typescript
const ODirection = { Up: 0, Down: 1, Left: 2, Right: 3 } as const;
type Direction = typeof ODirection[keyof typeof ODirection];
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Iterators and Generators

**Definition:**

`Symbol.iterator` позволяет `for..of`; `function*` дает ленивые последовательности.

| Когда использовать | Заметки |
|-------------|-------|
| Введите возврат генератора как `Generator<Yield, Return, Next>`. Итерируемые типы работают с `for..of` и распространиться. | `for..in` перебирает **ключи** (часто индексы массива в виде строк); `for..of` перебирает **значения** через протокол итератора. На `Set`, `for..in` видит только свойства, не являющиеся итераторами, такие как `"species"`, не элемент |

**Examples:**

```typescript
let list = [4, 5, 6];
for (let i in list)  console.log(i); // "0", "1", "2" — keys
for (let v of list)  console.log(v); // 4, 5, 6 — values

function toArray<X>(xs: Iterable<X>): X[] {
  return [...xs];
}

// Generators — function* yields values
function* gen() {
  yield 1;
  yield 2;
}
for (const n of gen()) console.log(n);
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### JSX

**Definition:**

XML-подобный синтаксис в `.tsx` файлы для UI-фреймворков (React и т. д.).

| Когда использовать | Заметки |
|-------------|-------|
| Набор `"jsx": "react-jsx"` in `tsconfig`. TS типы реквизита через `JSX.IntrinsicElements` и типы компонентов. | Утверждения типа угловых скобок (`<Foo>bar`) **запрещены** в `.tsx` - использовать `bar as Foo` вместо этого (неоднозначность парсера с тегами JSX). |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Setup & jsx modes

**Definition:**

1. Используйте `.tsx` расширение

2. Установите `"jsx"` in `tsconfig.json`

1. Используйте `.tsx` расширение
2. Установите `"jsx"` in `tsconfig.json`

| Режим | Выход |
|------|--------|
| `preserve` | Сохранить JSX → `.jsx` |
| `react` | `React.createElement(...)` |
| `react-jsx` | Автоматическое время выполнения `_jsx(...)` |
| `react-native` | Сохранить JSX → `.js` |

**How it works:**

* Нижний регистр (`<div>`) → внутренний элемент DOM/хост → `JSX.IntrinsicElements`
* Прописные буквы (`<MyComponent>`) → ваш компонент → решено из области видимости

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Type checking highlights

**Definition:**

// FC должен вернуть JSX.Element (или настроить JSX.ElementType в TS 5.1+)

Реквизит интерфейса {имя: строка}
функция Greet(реквизит: Реквизит) {
  возвращение <span>{реквизит.имя}</span>;
}

| Аспект | Деталь |
|--------|--------|
| Резюме | // FC должен вернуть JSX.Element (или настроить JSX.ElementType в TS 5.1+)
Реквизит интерфейса {имя: строка}
функция Приветствовать( |

Настроить через `jsxFactory`, `jsxFragmentFactory`, `jsxImportSource`.
---

**Examples:**

```typescript
// Intrinsic elements
declare namespace JSX {
  interface IntrinsicElements {
    foo: { bar?: boolean };
  }
}

// FC must return JSX.Element (or customize JSX.ElementType in TS 5.1+)
interface Props { name: string }
function Greet(props: Props) {
  return <span>{props.name}</span>;
}

// Children — JSX.ElementChildrenAttribute (default: children)
// Attributes — JSX.ElementAttributesProperty (default: props)
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Mixins

**Definition:**

Функции, которые принимают класс и возвращают расширенный класс, формируют поведение без множественного наследования.

| Когда использовать | Заметки |
|-------------|-------|
| `` class User extends WithId(WithTimestamp(Entity)) `` — стек фабрик миксинов. | Лучше всего поддерживается через **выражение класса**, возвращаемое из универсальной фабрики, а не через декораторы (миксины декораторов не объединяют типы в класс). |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Class expression pattern

**Definition:**

Шаблон выражения класса — язык TypeScript или функция компилятора.

| Аспект | Деталь |
|--------|--------|
| Резюме | Шаблон выражения класса — язык TypeScript или функция компилятора. |

**Ограниченные миксины** — общее базовое ограничение гарантирует наличие необходимых методов:

---

**Examples:**

```typescript
type Constructor = new (...args: any[]) => {};

function Scale<TBase extends Constructor>(Base: TBase) {
  return class Scaling extends Base {
    _scale = 1;
    setScale(scale: number) { this._scale = scale; }
    get scale() { return this._scale; }
  };
}

class Sprite {
  name = "";
  constructor(name: string) { this.name = name; }
}

const EightBitSprite = Scale(Sprite);
const bird = new EightBitSprite("Bird");
bird.setScale(0.8);
```

```typescript
type GConstructor<T = {}> = new (...args: any[]) => T;
type Positionable = GConstructor<{ setPos(x: number, y: number): void }>;

function Jumpable<TBase extends Positionable>(Base: TBase) {
  return class extends Base {
    jump() { this.setPos(0, 20); }
  };
}
```

```typescript
// Stacking mixins — WithId + WithTimestamp
type Constructor<T = object> = new (...args: any[]) => T;

function WithId<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    id = Math.random().toString(36).slice(2);
  };
}

function WithTimestamp<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

class Entity {}

class User extends WithId(WithTimestamp(Entity)) {
  name = "Alice";
}

const u = new User();
// u.id, u.timestamp, u.name — all present
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Namespaces

**Definition:**

Устаревший способ группировки кода в глобальной области видимости: `namespace Utils { export function f() {} }`.

| Когда использовать | Заметки |
|-------------|-------|
| Предпочитайте модули ES (`import`/`export`) в современном коде. Пространства имен все еще появляются в старых `.d.ts` файлы. | `module X` это устаревший псевдоним для `namespace X`. Предпочитайте **модули ES** (`import`/`export`) в современном коде — пространства имен загрязняют глобальную область видимости и усложняют отслеживание зависимостей. |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Patterns

**Definition:**

Utils.getPass("Евгений", 31);           // "Яухень31"

Utils.isEmpty(Utils.SECRET);         // ложь

| Аспект | Деталь |
|--------|--------|
| Резюме | Utils.getPass("Евгений", 31);           // "Яухень31"
Utils.isEmpty(Utils.SECRET);         // ложь |

**Окружающие пространства имен** (`declare namespace D3 { ... }`) описывают глобальные библиотеки, загруженные через `<script>`.
---

**Examples:**

```typescript
// Legacy namespace — encapsulates globals; must export to expose
namespace Utils {
  export const SECRET = "123321";
  const PI = 3.14; // private to namespace — not accessible outside
  export const getPass = (name: string, age: number) => `${name}${age}`;
  export const isEmpty = <T>(data: T) => !data;
}

Utils.getPass("Yauhen", 31);           // "Yauhen31"
Utils.isEmpty(Utils.SECRET);         // false

// Modern equivalent — ES modules (no namespace wrapper needed)
// export const SECRET = "123321";
// export const getPass = ...
// import { getPass, SECRET } from "./Utils";

namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) { return s.length === 5 && /^\d+$/.test(s); }
  }
}

// Alias — import q = x.y.z (not the same as import from "module")
import polygons = Shapes.Polygons;
let sq = new polygons.Square();

// Multi-file: same namespace name merges across files
// Use /// <reference path="..." /> to order compilation
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Namespaces and Modules

**Definition:**

Как TS организует код — модули ES (файлы) и устаревшие пространства имен (глобальные).

| Когда использовать | Заметки |
|-------------|-------|
| Использовать `import`/`export` за файл. Пространства имен только для глобального расширения или взаимодействия с устаревшими версиями. | Не `/// <reference path="foo.ts">` когда ты имеешь в виду `import` — ссылки добавляют файлы в компиляцию; импорт — это граф модуля. |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Common pitfalls

**Definition:**

// ХОРОШО

класс экспорта Треугольник {}

| Аспект | Деталь |
|--------|--------|
| Резюме | // ХОРОШО
класс экспорта Треугольник {} |

**How it works:** ---

**Examples:**

```typescript
// BAD — needless namespace wrapper in a module
export namespace Shapes {
  export class Triangle {}
}
// Consumer: new shapes.Shapes.Triangle() 😬

// GOOD
export class Triangle {}

// Modules can't use outFile with commonjs/umd — only amd/system
```

```typescript
// myModules.d.ts (not a module)
declare module "SomeModule" {
  export function fn(): string;
}

// myOtherModule.ts
/// <reference path="myModules.d.ts" />
import * as m from "SomeModule";
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Symbols

**Definition:**

Примитив ES6 для уникальных ключей — `Symbol("desc")` всегда создает новую ценность.

| Когда использовать | Заметки |
|-------------|-------|
| Используйте для поиска ключей, `Symbol.iterator` для итераций, `unique symbol` для брендовых типов. | `sym2 === sym3` всегда `false` даже с таким же описанием. TypeScript `unique symbol` тип связывает идентичность с **конкретным объявлением** — только на `const` or `readonly static`.  --- |

**Examples:**

```typescript
const sym = Symbol();
let obj = { [sym]: "value" };
console.log(obj[sym]); // "value"

// unique symbol — must be const
declare const sym1: unique symbol;
let sym3: typeof sym1 = sym1; // OK — same declaration

const sym2 = Symbol();
const sym3b = Symbol();
// if (sym2 === sym3b) {} // Error: types have no overlap

class C {
  static readonly StaticSymbol: unique symbol = Symbol();
}
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Triple-Slash Directives

**Definition:**

Однострочный `///` комментарии в верхней части файла, которые дают указания компилятору.

| Когда использовать | Заметки |
|-------------|-------|
| `` /// <reference path="./types.d.ts" /> `` — legacy; prefer `импортировать` and `цконфигурация` `ссылки` today. | As of TS 5.5, the compiler does **not** emit handwritten triple-slash directives to output unless `save="истина"`. |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Common directives

**Definition:**

/// <amd-module name="NamedModule"/>    // Имя модуля AMD в выводе

|

* **`reference path`** — относительная зависимость файлов; разрешение в глубину
* **`reference types`** - нравиться `import` для пакетов деклараций (`@types/node`); предпочитать `"types"` in `tsconfig.json` для `.ts` файлы
* **`reference lib`** — извлечь фрагменты библиотеки DOM/ES.
* **`--noResolve`** — игнорирует все ссылочные директивы

**How it works:**

`/// <amd-dependency path="..." />` - использовать `import "moduleName"` вместо.

---

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | /// <amd-module name="NamedModule"/>    // Name AMD module in output
```

```typescript
/// <reference path="./utils.ts" />     // Add file to compilation (ordering)
/// <reference types="node" />          // Include @types package
/// <reference lib="es2017.string" />   // Include built-in lib (like --lib)
/// <reference no-default-lib="true"/>  // Skip default lib.d.ts

/// <amd-module name="NamedModule"/>    // Name AMD module in output
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Ambient Declarations and `declare`

**Definition:**

Типовые описания кода, который существует где-либо еще (библиотеки JS, глобальные переменные, `.d.ts` прокладки).

| Когда использовать | Заметки |
|-------------|-------|
| `` declare const $: JQueryStatic `` or `объявить модуль «устаревшим»`. Emits no JS. | `объявить` does not create a value at runtime. Pair with `@типы/*` packages or hand-written `.d.ts` для нетипизированных библиотек. |

**Examples:**

```typescript
// Global variable loaded via <script>
declare const jQuery: (selector: string) => unknown;

// Ambient module — shape of an untyped npm package
declare module "legacy-lib" {
  export function doSomething(x: number): string;
}

// Ambient namespace — global library
declare namespace D3 {
  export function select(selector: string): unknown;
}

// declare class/function/var — types only, no JS emit
declare function greet(name: string): void;
declare class LegacyWidget {
  constructor(el: string);
  render(): void;
}

// Asset imports — tell TS non-TS files exist (Vite/Webpack)
declare module "*.svg" {
  const content: string;
  export default content;
}
declare module "*.png" {
  const src: string;
  export default src;
}
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### `noImplicitAny` and `strictNullChecks` — interview definitions

**Definition:**

Оба включены `"strict": true` in `tsconfig.json`.

---

| Аспект | Деталь |
|--------|--------|
| Резюме | Оба включены `"strict": true` in `tsconfig.json`.
--- |

**`noImplicitAny`** — если TS не может определить тип, по умолчанию будет `any`. Этот флаг превращает это в **ошибку**, требующую явных аннотаций. Предотвращает тихую потерю безопасности типов в параметрах функции и нетипизированных переменных.

**`strictNullChecks`** - по умолчанию `null` и `undefined` присвоить любому типу. Этот флаг делает их разными — вы должны явно обрабатывать возможность обнуления. Отлавливает наиболее распространенный класс производственных ошибок.

Оба включены `"strict": true` in `tsconfig.json`.
---

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Type Compatibility

**Definition:**

Правила присвоения типа А типу Б — структурные, а не номинальные.

| Когда использовать | Заметки |
|-------------|-------|
| Дополнительные свойства разрешены для переменных, передаваемых в функции; лишние проверки новых литералов. См. таблицу назначаемости. | TS намеренно **неправильно** местами — дополнительные свойства переменных допустимы при передаче в функцию, но **нет** в объектных литералах, назначенных типизированной переменной. |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Core rules

**Definition:**

// let bad: Pet = { name: "Лесси", владелец: "Радд" }; // Ошибка — проверка лишнего свойства

|

**How it works:**

параметры по умолчанию проверяются **двувариантно** (необоснованно) — вы можете назначить `(a: number) => void` to `(b: number, s: string) => void`. Давать возможность `strictFunctionTypes` исправить сигнатуры, не являющиеся методами.

исходный возврат должен быть **подтипом** целевого возврата.

сравниваются только элементы **экземпляра**; статический/конструктор игнорируется. Для совместимости **частные/защищенные** члены должны происходить из **того же** класса.

`Empty<number>` и `Empty<string>` совместимо, если `T` неиспользованный в конструкции; `NotEmpty<number>` vs `NotEmpty<string>` - ошибка.

**Examples:**

```

| Aspect | Detail |
|--------|--------|
| Summary | // let bad: Pet = { name: "Lassie", owner: "Rudd" }; // Error — excess property check
```

```typescript
interface Pet { name: string; }
let dog = { name: "Lassie", owner: "Rudd" };
let pet: Pet = dog; // OK — extra 'owner' is fine

// let bad: Pet = { name: "Lassie", owner: "Rudd" }; // Error — excess property check
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Assignability table (summary)

**Definition:**

Таблица назначаемости (сводка) — язык TypeScript или функция компилятора.

|        | любой | неизвестный | объект | пустота | неопределенный | ноль | никогда |
|--------|-----|---------|--------|------|-----------|------|-------|
| → любой | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* | ✕ |
| → неизвестно | ✓ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ || никогда → | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

*`strictNullChecks` выключить изменения `null`/`undefined` поведение значительно.

**неизвестно** ≈ противоположность **никогда**: все, что можно назначить `unknown`; `unknown` присваивается только `any` (и себя).
---

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Type Inference

**Definition:**

Как TS выводит типы, когда вы опускаете аннотации.

| Когда использовать | Заметки |
|-------------|-------|
| Пусть сначала сработает умозаключение; аннотировать на границах API. Контекстная типизация заполняет типы параметров обратного вызова. | Вывод выбирает **наилучший общий тип** из кандидатов — если ни одного супертипа не существует, вы получаете **объединение** (`Rhino \| Elephant \| Snake`) вместо `Animal[]` если вы не комментируете или не предоставляете контекст. |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Best common type

**Definition:**

Лучший распространенный тип — язык TypeScript или функция компилятора.

| Аспект | Деталь |
|--------|--------|
| Резюме | Лучший распространенный тип — язык TypeScript или функция компилятора. |

**Examples:**

```typescript
let x = 3;                    // number
let arr = [0, 1, null];       // (number | null)[]

let zoo = [new Rhino(), new Elephant(), new Snake()];
// (Rhino | Elephant | Snake)[] — not Animal[]

let zoo2: Animal[] = [new Rhino(), new Elephant(), new Snake()]; // OK
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Contextual typing

**Definition:**

// Без контекста параметр `any` (если только noImplicitAny)

константный обработчик = функция (uiEvent) {
  console.log(uiEvent.button); // ОК — нет ошибок без контекста
};

| Аспект | Деталь |
|--------|--------|
| Резюме | // Без контекста параметр `any` (если только noImplicitAny)
константный обработчик = функция (uiEvent) {
  console.log(uiEvent |

---

**Examples:**

```typescript
window.onmousedown = function (mouseEvent) {
  console.log(mouseEvent.button);    // OK — MouseEvent
  // console.log(mouseEvent.kangaroo); // Error
};

// Without context, parameter is `any` (unless noImplicitAny)
const handler = function (uiEvent) {
  console.log(uiEvent.button); // OK — no error without context
};

// Context applies to: call arguments, assignment RHS, assertions,
// object/array literals, return statements
function createZoo(): Animal[] {
  return [new Rhino(), new Elephant(), new Snake()]; // Animal[] inferred from return type
}
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Variable Declaration

**Definition:**

`var` (функционально, поднято), `let` (блочная область видимости), `const` (блочная область, без переназначения).

| Когда использовать | Заметки |
|-------------|-------|
| Предпочитать `const` > `let` > `var`. ТС проверяет все три; `const` не делает объекты глубоко неизменяемыми. | `const` предотвращает только **перепривязку** переменной — внутренности объекта остаются изменяемыми, если только `readonly` or `Object.freeze`. |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### var problems

**Definition:**

// Одна и та же переменная во вложенных циклах — классическая ошибка

для (вар я = 0; я <3; я++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

| Аспект | Деталь |
|--------|--------|
| Резюме | // Одна и та же переменная во вложенных циклах — классическая ошибка
для (вар я = 0; я <3; я++) {
  setTimeout(() => console.log(i), 100); // 3, 3 |

**Examples:**

```typescript
// Function-scoped — leaks out of blocks
if (true) { var x = 10; }
console.log(x); // 10

// Same var in nested loops — classic bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// Redeclaration allowed
var x = 1;
var x = 2; // OK
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### let — block-scoped

**Definition:**

// Временная мертвая зона — нельзя использовать до объявления

// а++; пусть а; // Ошибка

| Аспект | Деталь |
|--------|--------|
| Резюме | // Временная мертвая зона — нельзя использовать до объявления
// а++; пусть а; // Ошибка |

**Examples:**

```typescript
if (true) {
  let b = 1;
}
// console.log(b); // Error — not in scope

// Temporal dead zone — can't use before declaration
// a++; let a; // Error

// Per-iteration binding in loops
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}

// No redeclaration in same scope
let x = 10;
// let x = 20; // Error
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### const & destructuring

**Definition:**

// Предпочитаем const, если вы не переназначаете (минимальные привилегии)

| Аспект | Деталь |
|--------|--------|
| Резюме | // Предпочитаем const, если не переназначаем (минимальные привилегии) ​​|

**Examples:**

```typescript
const kitty = { name: "Aurora", numLives: 9 };
// kitty = { ... };     // Error — rebind
kitty.name = "Rory";    // OK — mutate property

// Prefer const unless you will reassign (least privilege)

// Array destructuring
let [first, second] = [1, 2];
let [head, ...rest] = [1, 2, 3, 4]; // rest: [2,3,4]

// Object destructuring
let { a, b } = { a: 1, b: 2 };
let { a: renamed } = { a: 1 }; // property rename

// Tuple destructuring preserves element types
let tuple: [number, string] = [7, "hello"];
let [n, s] = tuple; // n: number, s: string
```

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Quick list — checklist

1. **`const` параметры типа** — буквальный вывод в дженериках (TS 5.0+)
2. **`using` / `Disposable`** — очистка ресурсов по заданной области (TS 5.2+)
3. **`override` ключевое слово** — явные, проверенные переопределения метода
4. **Более строгие флаги компилятора** — `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
5. **ESM/ЗАП** — `moduleResolution: node16` / `nodenext`, `verbatimModuleSyntax`
6. **Ссылки на проекты** — разделение монорепозиториев, инкрементальное `tsc --build`
7. **Публикация типизированных пакетов** — `declaration`, `types` поле, связка `.d.ts`
8. **Рекурсивные типы** — `Json`, деревья, глубоко `Partial`
9. **Дисперсия** — ковариантная доходность, контравариантные параметры, подводные камни бивариантности.
10. **Проверка времени выполнения** — типы TS ≠ время выполнения; используйте Zod/io-ts для внешних данных

</details>

<a name="advanced"></a>

## Advanced topics

<details>
  <summary>Modern TypeScript</summary>

### `const` Type Parameters (TS 5.0+)

**Definition:**

Универсальный модификатор параметра, сохраняющий литеральные типы при выводе.

| Когда использовать | Заметки |
|-------------|-------|
| `` function routes<const T extends readonly string[]>(paths: T) `` — keeps tuple of literals, not `нить[]`. | recursion must have a **base case** (`T расширяет защиту объекта), иначе компилятор достигает предела глубины. |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

### Variance (functions and assignability)

**Definition:**

Как подтипирование работает для параметров функции (контравариантно) и возвращаемых значений (ковариантно).

| Аспект | Деталь |
|--------|--------|
| Резюме | Как подтипирование работает для параметров функции (контравариантно) и возвращаемых значений (ковариантно). |

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>

<a name="interview-practice"></a>
