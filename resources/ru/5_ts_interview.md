# TypeScript — Interview

Интервью с вопросами и ответами и тип задач.

[ ← Вернуться в хаб](./5_ts.md)

### Related docs

* [TypeScript — Основы](./5_ts_core.md) · [TypeScript — Сужение](./5_ts_narrowing.md) · [TypeScript — Функции](./5_ts_functions.md) · [TypeScript — Объекты](./5_ts_objects.md) · [TypeScript — Generics](./5_ts_generics.md) · [TypeScript — Ссылка](./5_ts_reference.md) · [TypeScript — Интервью](./5_ts_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

<details>
  <summary>Interview Practice</summary>

### Interview Practice

**Definition:** Головоломки на уровне шрифта и общие подсказки по живому кодированию для собеседований на TypeScript.

| Площадь | Должен знать |
|------|-----------|
| **Основы** | `any` vs `unknown` vs `never`, сужения, соединения |
| **Структура** | `interface` vs `type`, дженерики, типы утилит |
| **Безопасность** | `strict`, дискриминационные профсоюзы, исчерпывающий характер, `erasableSyntaxOnly` |
| **Расширенный** | `infer`, условные/сопоставленные типы, `keyof` |
| **Время выполнения** | Типы стерты — проверка внешних данных (Зод) |

**Sources:** [Введите задачи](https://github.com/type-challenges/type-challenges)

| Тема | Ответ |
|-------|--------|
| Зачем ТС /большие проекты/ когда больно | Вопросы и ответы |
| Интерфейсы, ориентированные на дизайн / `private` vs `#` | Q&A |
| `any` приемлемые случаи, расширить `interface` | Вопросы и ответы |
| Объединения, литералы, сборка с ошибками типов | Вопросы и ответы |
| Введите API/объект/массив/функцию | Вопросы и ответы |
| Необязательный / `undefined` поля | Вопросы и ответы |
| Агрегация корзины (типизированная) | Задача — Корзина |

---

### Questions & Answers

<details>
  <summary>What is TypeScript?</summary>

### What is TypeScript?

**Definition:** Типизированное расширение JavaScript — типы проверяются во время компиляции и **стираются** в создаваемом JS. Добавляет интерфейсы, дженерики, перечисления и строгие проверки на нулевое значение без изменения семантики времени выполнения.

| Плюсы | Минусы |
|------|------|
| Более безопасный рефакторинг, лучшая поддержка IDE | Дополнительный шаг компиляции |
| Постепенное принятие (`allowJs`) | `any` / `as` может обойти безопасность |
| Обнаруживает ошибки перед развертыванием | Типы не существуют во время выполнения |

**How it works:** `tsc` (или esbuild/swc с `noEmit` check) анализирует код → сообщает об ошибках → выдает JS. Внешние данные (API, `JSON.parse`) по-прежнему требует проверки во время выполнения (Zod, io-ts), поскольку TS не может проверять полезную нагрузку сети.

**When to use:** Любое поддерживаемое приложение, общие библиотеки, команды, кодовые базы NestJS/Angular.

**Examples:**

```typescript
function greet(name: string): string {
  return `Hello, ${name}`;
}
greet(42); // compile error: number not assignable to string
```

**Interview one-liner:** *"TypeScript — это JavaScript с дополнительными статическими типами — безопасность во время компиляции, среда выполнения по-прежнему JS."*

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

</details>

<details>
  <summary>Why TypeScript for OOP if it emits JS?</summary>

### Why TypeScript for OOP if it emits JS?

**Short answer:** В JS есть классы, но **нет интерфейсов**. TS позволяет проектировать отношения сущностей на основе абстракций и давать сбой во время компиляции. Среда выполнения по-прежнему JS, поэтому `private` стерто — используйте `#` для настоящего сокрытия.

**How it works:** Писать `interface Ledger { addRecord(r: LedgerEntry): void }` первый. Реализации `implements Ledger`. Неправильная проводка (отсутствует поле, неправильный `kind`) представляет собой `tsc` ошибка. По той же причине, что и диагностика автомобиля перед поездкой.

**When to use:** Приложения с интенсивным использованием предметной области, DI, команды. Не требуется для сценария из 20 строк.

**See also:** [ООП-проектирование с интерфейсами](./5_ts_objects.md#classes) · [Doka — ООП](https://doka.guide/tools/oop/)

</details>

<details>
  <summary>Compiler vs transpiler?</summary>

### Compiler vs transpiler?

**Definition:** `tsc` **проверка типов** (компилятор) и **генерация JS** из TS (транспиляция между языками высокого уровня).

| Роль | `tsc` |
|------|-------|
| Компилятор | Статический анализ |
| Транспилер | TS → JS излучает |

**Examples:**

```bash
tsc --noEmit
tsc
```

**Sources:** [TypeScript с нуля](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

</details>

<details>
  <summary>Error handling — static vs runtime?</summary>

### Error handling — static vs runtime

**Definition:** TypeScript обнаруживает ошибки формы во время компиляции; время выполнения все еще нужно `try/catch` и проверка схемы для внешних данных.

| Слой | Оснастка |
|-------|---------|
| Время компиляции | `tsc`, IDE |
| Время выполнения | `try/catch`, Зод/ио-ц |

**Examples:**

```typescript
function parseAge(input: string): number {
  const n = Number(input);
  if (Number.isNaN(n)) throw new Error("Invalid age");
  return n;
}
```

**Sources:** [Повседневные типы](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

</details>

<details>
  <summary>Union vs intersection?</summary>

### Union vs intersection

**Definition:** `A | B` — один из; `A & B` — должен удовлетворить всех. `string & number` невозможно.

| Оператор | Значение |
|----------|---------|
| `\|` | любой тип |
| `&` | объединить фигуры |

**Examples:**

```typescript
let id: number | string;
type Person = { name: string } & { age: number };
```

**Sources:** [Союзы](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

</details>

<details>
  <summary>`any` vs `unknown` vs `never`?</summary>

### `any` vs `unknown` vs `never`

**Definition:** `any` отключает проверку; `unknown` требует сужения; `never` — пустой тип (недоступный).

| Тип | Поведение |
|------|----------|
| `any` | Никаких проверок |
| `unknown` | Сузить перед использованием |
| `never` | Исчерпывание/броски |

**Examples:**

```typescript
function parse(input: unknown) {
  if (typeof input === "string") return input.trim();
}
```

**Sources:** [Повседневные типы](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

</details>

<details>
  <summary>`interface` vs `type`?</summary>

### `interface` vs `type`

**Definition:** Оба описывают формы объектов и работают с классами (`implements`). Структурная типизация означает, что совместимые фигуры назначаются друг другу независимо от ключевого слова.

**How it works:**

| Особенность | `interface` | `type` |
|---------|-------------|--------|
| Форма объекта | да | да |
| Продлить | `extends` | пересечение `&` |
| Декларация о слиянии | да — повторяющиеся имена объединяют поля | нет — дубликат = ошибка |
| Союз `A \| B` | нет | да |
| Кортеж `[string, number]` | неловкий | натуральный |
| Сопоставленные/условные типы | ограниченный | основной инструмент |
| Псевдоним примитивов `type ID = string` | нет | да |
| `implements` в классе | да | да (часто через перекресток) |

**When to use:**

- **`interface`** — контракты общедоступных объектов (DTO, API плагинов), которые вы можете расширить позже (`declare module 'express-serve-static-core'`).
- **`type`** — объединения, распознанные объединения, трубопроводы коммунального типа (`Pick`, `Omit`, `ReturnType`).

**Examples:**

```typescript
// interface — merging (common for augmenting library types)
interface User { id: string }
interface User { email: string } // merged

// type — union (impossible with interface alone)
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// equivalent extension
interface Admin extends User { role: 'admin' }
type AdminUser = User & { role: 'admin' };
```

**Interview pitfall:** «Что быстрее?» — незначительная разница; выбирайте по выразительности. Не используйте `interface` для типов объединения; не используй `type` когда вам нужно расширение модуля.

**Thoughts:** Для 90% форм объектов подойдет любой вариант — согласованность в кодовой базе важнее, чем ключевое слово.

**Sources:** [Справочник — Различия между псевдонимами типов и интерфейсами] (https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)

</details>

<details>
  <summary>Why avoid `enum`?</summary>

### Why avoid `enum`?

**Definition:** Числовые перечисления добавляют объекты времени выполнения; `as const` + Union легче и не боится дрожания деревьев.

**Examples:**

```typescript
const Status = { Active: "active", Removed: "removed" } as const;
type Status = (typeof Status)[keyof typeof Status];
```

**Sources:** [Перечисления](https://www.typescriptlang.org/docs/handbook/enums.html)

</details>

<details>
  <summary>Important strict compiler flags?</summary>

### Important strict compiler flags

**Definition:** `strict` позволяет `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`и соответствующие проверки.

| Флаг | Эффект |
|------|--------|
| `strictNullChecks` | `null`/`undefined` не везде назначается |
| `noUncheckedIndexedAccess` | Доступ к индексу может быть `undefined` |

**Sources:** [tsconfig](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

</details>

<details>
  <summary>OOP principles in TypeScript?</summary>

### OOP principles in TypeScript

**Definition:** Инкапсуляция, наследование (`extends`), полиморфизм (переопределения), абстракция (`abstract`/`interface`).

| Принцип | механизм ТС |
|-----------|--------------|
| Инкапсуляция | `private`, `protected`, `readonly` |
| Наследование | `extends` (одна база) |
| Абстракция | `abstract class`, `interface` |

**Examples:**

```typescript
abstract class Animal {
  constructor(public name: string) {}
  abstract makeSound(): void;
}
class Dog extends Animal {
  makeSound() { console.log("Woof"); }
}
```

**Sources:** [Классы](https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<details>
  <summary>`extends` vs `implements`?</summary>

### `extends` vs `implements`

**Definition:** `extends` наследует один класс; `implements` удовлетворяет контрактам интерфейса без наследуемого кода.

| | `extends` | `implements` |
|---|-----------|----------------|
| Цель | класс | интерфейс(ы) |
| Реализация | унаследованный | должны предоставить участникам |

**Sources:** [Классы](https://www.typescriptlang.org/docs/handbook/2/classes.html)

</details>

<details>
  <summary>What problems does TypeScript solve? Why in large projects?</summary>

### What problems does TypeScript solve? Why in large projects?

**Definition:** TypeScript добавляет в JavaScript дополнительные статические типы — перехватывая ошибки формы во время компиляции, прежде чем они попадут в рабочую среду.

**Problems it solves:**

- Опечатки и неверный доступ к свойствам (`user.nmae`)
- Безопасность рефакторинга — переименуйте поле, компилятор найдет все варианты использования.
- Самодокументируемые API — сигнатуры функций показывают намерение.
- Улучшено автозаполнение и навигация в IDE.
- Общие контракты между модулями внешнего и внутреннего интерфейса.

**Why large projects:** Больше файлов, больше разработчиков, больше точек интеграции — типы масштабируют общение лучше, чем комментарии. `strict` Режим окупается, когда кодовая база переживет память любого отдельного разработчика.

**Thoughts:** *Типы — это документация, которую обеспечивает компилятор.*

**See also:** [Что такое TypeScript?](#what-is-typescript) · вводный раздел

</details>

<details>
  <summary>When can TypeScript hinder development?</summary>

### When can TypeScript hinder development?

**Definition:** TS помогает большинству поддерживаемых приложений, но требует затрат — особенно на ранних этапах проекта или при неправильном использовании.

| Помеха | смягчение последствий |
|-----------|------------|
| Кривая обучения | Начните с `strict` постепенно; использовать `allowJs` |
| Медленный CI при проверке типов всего монолита | Ссылки на проекты, инкрементные сборки |
| Борьба с компилятором в сложных дженериках | Упрощать; не переусердствуйте с типами |
| `any` / `as` аварийные люки обхода безопасности | Давать возможность `noImplicitAny`, проверка кода |
| Сторонние библиотеки без типов | `@types/*`, местный `.d.ts`, `unknown` + Зод на границах |
| Скорость прототипирования | `// @ts-nocheck` только для файлов спайков, а не для производства |

**Thoughts:** *TS причиняет боль, когда вы относитесь к типам как к бюрократии, а не как к ограждению, или когда команда отключает строгие проверки.*

</details>

<details>
  <summary>When is `any` acceptable?</summary>

### When is `any` acceptable?

**Definition:** `any` отключает проверку типов — используйте умеренно на границах, а не по умолчанию.

**Acceptable cases:**

- Постепенный переход с JS (`allowJs` кодовая база)
- Код спайка прототипа (временный, с билетом для ввода позже)
- Действительно динамические данные с немедленным сужением до `unknown`
- Устаревший сторонний код без типов и времени на перенос

**Prefer instead:** `unknown` + сужение, обобщения или тонкая типизированная оболочка вокруг нетипизированной библиотеки.

**Thoughts:** *`any` это скальпель для границ миграции, а не образ жизни.*

**See also:** [`any` vs `unknown` vs `never`](#любой-против-неизвестного-против-никогда)

</details>

<details>
  <summary>Can you extend an `interface`?</summary>

### Can you extend an `interface`?

**Definition:** Да - `interface` поддерживает `extends` для наследования и **объединения объявлений** для расширения.

**How it works:**

```typescript
interface User { id: string }
interface User { email: string } // merges — User has id + email

interface Admin extends User { role: 'admin' }
```

- `extends` — наследовать поля от другого интерфейса или класса.
- Объединение деклараций — дубликат `interface` объединение имен (полезно для расширения модулей).
- `type` использует пересечение (`&`) вместо; никакого слияния.

**Thoughts:** *Использовать `interface` когда вы можете продлить или увеличить; использовать `type` для профсоюзов.*

**See also:** [`interface` vs `type`](#интерфейс-против-типа)

</details>

<details>
  <summary>Union and literal types — where are they used?</summary>

### Union and literal types — where are they used?

**Definition:** Союзы (`A | B`) модель «один из»; литеральные типы (`'pending' | 'done'`) ограничиться определенными значениями.

**Where used:**

| Вариант использования | Пример |
|----------|---------|
| Статус API | `type Status = 'idle' \| 'loading' \| 'error'` |
| Дискриминированные профсоюзы | `{ kind: 'success'; data: T } \| { kind: 'error'; msg: string }` |
| Ключи конфигурации | `type Theme = 'light' \| 'dark'` |
| Функция ввода перегрузки | `string \| number` ID |
| `as const` объекты | Сохраняйте литералы вместо расширения до `string` |

**Thoughts:** *Лутеральные объединения + дискриминантное поле = безопасно. `switch` с проверкой полноты.*

**See also:** [Типы объединений](./5_ts_core.md#union-types) · [Литеральные типы](./5_ts_core.md#literal-types) · [Дискриминированные объединения](./5_ts_narrowing.md#discrimination-unions)

</details>

<details>
  <summary>What happens on build with type errors?</summary>

### What happens on build with type errors?

**Definition:** По умолчанию `tsc` **сообщает об ошибках, но может по-прежнему выдавать JS** — типы не блокируют вывод, если они не настроены.

**How it works:**

| Настройка/флаг | Поведение |
|----------------|----------|
| По умолчанию `tsc` | Зарегистрированы ошибки; JS все еще может быть выпущен |
| `noEmitOnError: true` | Нет вывода JS, пока типы не пройдут |
| `tsc --noEmit` | Только проверка типа — никаких выбросов (обычно в CI) |
| Вите/esbuild/SWC | Транспилировать без проверки типа; бегать `tsc --noEmit` отдельно |

**Interview answer:** *В строгом режиме CI мы выполняем `tsc --noEmit` и провалить сборку из-за ошибок. Сами по себе бандлеры не гарантируют типобезопасность.*

**Thoughts:** *Проверка типов и транспиляция — это отдельные этапы в современных конвейерах.*

**Sources:** [tsconfig — noEmitOnError](https://www.typescriptlang.org/tsconfig#noEmitOnError)

</details>

<details>
  <summary>How to typify API response, object, array, and function?</summary>

### How to typify API response, object, array, and function?

**Definition:** Формы модели на границах; проверять внешние данные во время выполнения, поскольку типы TS удаляются.

**API response:**

```typescript
type User = { id: string; name: string };
type ApiResponse<T> = { data: T; meta: { page: number } };

async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  const json: unknown = await res.json();
  // validate with Zod in production
  return json as User;
}
```

**Object (product):**

```typescript
type Product = { id: string; name: string; price: number; category: 'food' | 'electronics' };
```

**Array of objects:**

```typescript
const products: Product[] = await res.json();
// or ReadonlyArray<Product> for immutability
```

**Function with return object:**

```typescript
type CartSummary = { subtotal: number; discount: number; total: number };

function calculateCart(items: CartItem[]): CartSummary {
  return items.reduce(/* ... */, { subtotal: 0, discount: 0, total: 0 });
}
```

**Thoughts:** *Типы описывают намерение; Zod/io-ts проверяет реальность на границе сети.*

</details>

<details>
  <summary>How to handle optional and `undefined` fields?</summary>

### How to handle optional and `undefined` fields?

**Definition:** С `strictNullChecks`, пропал и `undefined` должны обрабатываться явно.

| Синтаксис | Значение |
|--------|---------|
| `prop?: string` | Может отсутствовать или `undefined` |
| `prop: string \| undefined` | Должен присутствовать; значение может быть `undefined` |
| `obj.prop?.trim()` | Необязательная цепочка — короткое замыкание на нуль/неопределенное |
| `value ?? 'default'` | Нулевое слияние — только для `null`/`undefined` |

```typescript
type User = { name: string; email?: string };

function greet(user: User) {
  const domain = user.email?.split('@')[1] ?? 'unknown';
  return `${user.name}@${domain}`;
}
```

**Thoughts:** *`?` по реквизиту + `?.` и `??` на сайтах доступа — никогда не предполагайте, что поле существует.*

**See also:** [Необязательные свойства](./5_ts_objects.md#optional-properties) · [`null` и `undefined`](./5_ts_core.md#null-and-undefined)

</details>

---

`AddressType` определяет `city: string`. Пересекаясь с `{ city: { id: string } }` создает невозможный тип (`string & { id: string }`). Держать `AddressType` и `address` без изменений; исправить только `AddressWithIdType`.

```typescript
type AddressType = {
  country: string;
  city: string;
};

type AddressWithIdType = AddressType & {
  city: {
    id: string;
    value?: string;
  };
};

const address: AddressWithIdType = {
  country: "Australia",
  city: {
    id: "bd2917ff-08ac-4e0a-a4d6-6185cd6e69c4",
  },
};
```

<details>
  <summary>Solution hint</summary>

### Solution hint

Использовать `Omit` чтобы удалить конфликтующий ключ перед пересечением:

```typescript
type AddressWithIdType = Omit<AddressType, "city"> & {
  city: {
    id: string;
    value?: string;
  };
};
```
</details>

---

### Task 2 — Exclude a union member

Осуществлять `RemoveC<T>` so `RemoveC<"a" | "b" | "c">` становится `"a" | "b"`.

```typescript
type Letters = "a" | "b" | "c";

type RemoveC<T> = unknown; // your implementation

type LettersWithoutC = RemoveC<Letters>;

declare function testFunction(option: "a" | "b");

const validConst1: LettersWithoutC = "a";
const validConst2: LettersWithoutC = "b";
const invalidConst1: LettersWithoutC = "c"; // should error
```

<details>
  <summary>Solution</summary>

```typescript
type RemoveC<T> = Exclude<T, "c">;
// or: T extends "c" ? never : T
```
</details>

---

### Quick oral questions (self-check)

**Definition:** Четырнадцать вопросов для самопроверки, охватывающих основные темы собеседований по TypeScript; ответы в сворачиваемом блоке ниже.

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

1. В чем разница между `any` и `unknown`?
2. Когда бы вы выбрали `interface` над `type`?
3. Что означает `strictNullChecks` изменять?
4. Чем структурная типизация отличается от номинальной типизации?
5. Что такое дискриминируемый профсоюз и почему он `never` полезно с этим?
6. Что стирается во время компиляции — существуют ли модификаторы доступа во время выполнения?
7. `Exclude` vs `Omit` — над чем работает каждый?
8. Когда `as const` нужный?
9. Что означает `satisfies` сделай это `as` нет?
10. Когда бы вы использовали шаблон карты вместо объединения?
11. В чем разница между компилятором и транспилятором в контексте `tsc`?
12. Что такое объединение объявлений на интерфейсах?
13. Когда бы вы использовали `extends` vs `implements`?
14. Что такое миксины и зачем использовать их при множественном наследовании?
15. Что означает `erasableSyntaxOnly` запретить, и зачем его включать?

<details>
  <summary>Answers</summary>

### Answers

1. **`any` vs `unknown`** — Оба принимают любое значение. `any` отключает проверку: вы можете вызывать методы, назначать где угодно, сужение не требуется. `unknown` это безопасный тип верха: вы должны сузить (`typeof`, `in`и т. д.) или утверждайте перед использованием. Предпочитать `unknown` для внешних/ненадежных данных.

2. **`interface` над `type`** — Формы объектов, которые можно расширять или дополнять; объединение объявлений (например, исправление глобальных переменных). Использовать `type` для объединений, кортежей, примитивов, отображаемых/условных типов. Они **не** идентичны.

3. **`strictNullChecks`** — `null` и `undefined` больше не могут быть присвоены каждому типу. Становятся необходимыми дополнительные цепочки и явные проверки. Перехватывает ошибки типа «забыл обработать нуль». Без него null бесшумно течет повсюду.

4. **Структурная или номинальная**. TS использует **структурную** типизацию: совместимость определяется формой, а не объявленным именем. Два типа с одинаковыми полями являются взаимозаменяемыми. Java/C# используют **номинальную** типизацию: имена классов имеют значение.Брендинг имитирует номинальные идентификаторы в TS.

5. **Дискриминируемый профсоюз + `never`** — Объекты имеют общее поле (`kind`, `type`), поэтому TS сужается `switch`. Присвоение союза `never` in `default` обеспечивает полноту — если вы добавите вариант и забудете ветку, произойдет ошибка компиляции.

6. **Удаляется во время компиляции** — все аннотации типов, интерфейсы, дженерики и `private`/`protected` (только для TS) удаляются. **Нет** информации о типе среды выполнения. ECMAScript `#private` поля **существуют** существуют во время выполнения. `public`/`private` в классах TS выполняются только во время компиляции, если вы не используете `#`.

7. **`Exclude` vs `Omit`** — `Exclude<T, U>` работает с **типами объединения** (удаляет элементы, назначаемые `U`). `Omit<T, K>` работает с **типами объектов** (удаляет ключи `K` от `T`). Разные ресурсы, разные работы.

8. **`as const`** — Когда вам нужны **литеральные типы** вместо расширенных примитивов (`"GET"` нет `string`, `readonly` кортеж, замороженная конфигурация). Исправляет вывод объектных литералов и массивов. Альтернатива ручным буквальным объединениям.

9. **`satisfies` vs `as`** — `satisfies Type` **проверяет**, что значение соответствует типу **и сохраняет** узкие выведенные типы (например, кортеж остается кортежем). `as Type` **форсирует** тип и **расширяет** вывод — никакой реальной проверки, только доверие.

10. **Шаблон карты против объединения**. Используйте **карту/объект**, когда для каждого варианта требуются разные поля или поведение, определяемое дискриминантом. Это позволяет избежать огромных объединений несовместимых фигур. Шаблон: `{ [K in Status]: Handler }[status]` вместо `A | B | C` с несвязанными полями.

11. **Компилятор против транспилятора (`tsc`)** — **Компилятор**: проверка типов (статический анализ). **Транспилер**: TS → JS (от высокого уровня к высокому уровню). `tsc` делает и то, и другое. Ни один из них не запускается во время выполнения — выходные данные представляют собой простой JS.

12. **Объединение объявлений** — множественное `interface Foo { ... }` блоки с **одним и тем же именем** объединяются в один интерфейс (поля объединяются). Работает только с `interface`, нет `type`. Общий для увеличения `Window`, типы модулей.

13. **`extends` vs `implements`** — `extends`: класс наследует **один** базовый класс (реализация + цепочка прототипов). `implements`: класс обещает удовлетворить **один или несколько** контрактов интерфейса (только подписи, без унаследованного кода).

14. **Миксины** — функции, которые принимают класс и возвращают расширенный класс. Создайте поведение без множественного наследования (которое TS/JS не поддерживает). Миксины стека: `class User extends WithId(WithTimestamp(Entity))`.

15. **`erasableSyntaxOnly`** — Флаг TS 5.8+: ошибка в синтаксисе, который выдает изобретенный во время выполнения JS TypeScript (свойства параметров конструктора, `enum`, `namespace`). Позволяет средам выполнения/очистителям типов (`tsc --noEmit`, Удаление типов узлов) рассматривают TS только как стираемые типы. Использовать `this.x = x` вместо `constructor(public x: number)`.

</details>

---

### Task 3 — Implement `MyPick`

Осуществлять `MyPick<T, K>` как встроенный `Pick`.

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyPick<Todo, "title" | "completed">;
// { title: string; completed: boolean }

const preview: TodoPreview = { title: "Learn TS", completed: false };
```

<details>
  <summary>Solution</summary>

```typescript
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```
</details>

---

### Task 4 — Implement `GetReturnType`

Без использования встроенной утилиты:

```typescript
type MyReturn<T> = unknown; // your implementation

declare const fn: (a: number, b: string) => boolean;
type R = MyReturn<typeof fn>; // should be boolean
```

<details>
  <summary>Solution</summary>

```typescript
type MyReturn<T> = T extends (...args: never[]) => infer R ? R : never;
```
</details>

---

### Task 5 — Implement `DeepReadonly`

Сделайте каждое свойство (включая вложенные объекты) доступным только для чтения.

```typescript
interface X {
  a: number;
  b: { c: string };
}

type RX = DeepReadonly<X>;
// { readonly a: number; readonly b: { readonly c: string } }

declare const x: RX;
// x.b.c = "no"; // should error
```

<details>
  <summary>Solution</summary>

```typescript
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;
```
</details>

---

### Task 6 — Implement `Flatten`

Разверните один уровень массива: `Flatten<string[][]>` → `string[]`.

```typescript
type Flatten<T> = unknown; // your implementation

type A = Flatten<string[]>;       // string
type B = Flatten<number[][]>;     // number[]
type C = Flatten<boolean>;        // boolean
```

<details>
  <summary>Solution</summary>

```typescript
type Flatten<T> = T extends (infer U)[] ? U : T;
```
</details>

---

### Task 7 — Implement `Parameters`

Извлеките типы параметров функции в виде кортежа.

```typescript
type MyParameters<T> = unknown;

declare function join(a: string, b: number): boolean;
type P = MyParameters<typeof join>; // [string, number]
```

<details>
  <summary>Solution</summary>

```typescript
type MyParameters<T> = T extends (...args: infer P) => unknown ? P : never;
```
</details>

---

---

### Oral questions (ITVDN — TypeScript)

**Definition:** Устные вопросы для самопроверки из курса ITVDN TypeScript.

**Sources:** [Справочник по TypeScript — введение](https://www.typescriptlang.org/docs/handbook/intro.html)

79. Каковы преимущества набора текста на TypeScript?

80. Какие функции TypeScript вы можете использовать для набора текста (интерфейсы, типы, перечисления и т. д.)?

81. В чем разница между интерфейсом и классом?

82. В чем разница между интерфейсом и абстрактным классом?

83.В чем разница между интерфейсом и типом?

---

### Oral questions (extra)

**Definition:** Дополнительные устные вопросы на собеседовании по флагам компилятора и шаблонам модулей.

1. Что означает `noUncheckedIndexedAccess` измениться `arr[i]`?
2. Когда бы вы использовали `import type` vs `import`?
3. Как ссылки на проекты ускоряют сборку монорепо?
4. Почему `as User` on `res.json()` небезопасно на производстве?
5. В чем разница между параметрами ковариантной и контравариантной функции?
6. Когда `const` параметр универсального типа полезен?
7. Что означает `composite: true` включить в `tsconfig`?

<details>
  <summary>Answers</summary>

### Answers

1. **`noUncheckedIndexedAccess`** — Возвращает доступ к индексу `T | undefined` вместо `T`. `arr[i]` и `obj[key]` может быть за пределами границ/отсутствовать — необходимо сузить или использовать `??` перед использованием. Безопаснее, но шумнее в устаревшем коде.

2. **`import type` vs `import`** — `import type` / `export type` **удаляются** при отправке — импорт во время выполнения невозможен. Используйте только для типовых символов. Импорт стоимости (`import { fn }`) оставаться во время выполнения. `verbatimModuleSyntax` обеспечивает соблюдение этого разделения. Не позволяет сборщикам втягивать в пакет модули, содержащие только типы.

3. **Ссылки на проекты**. Разделите монорепозиторий на **составные** проекты с помощью `references`. `tsc --build` проверяет типы и выдает **инкрементально** — перестраиваются только измененные проекты. Зависимости строятся по порядку. Более быстрый CI, чем один гигант `tsc` на всем.

4. **`as User` on `res.json()`** — Утверждение действует **только во время компиляции**; нет проверки времени выполнения. API может возвращать любую форму JSON; неправильные данные вызывают сбои во время выполнения (неопределенный доступ, неправильные типы). Использовать `unknown` + проверка схемы (Zod и т.п.) на границе.

5. **Ковариантные и контравариантные параметры** — **Типы возвращаемых значений** являются ковариантными: возврат подтипа допустим при назначении функций. **Типы параметров** являются контрвариантными (с `strictFunctionTypes`): функция, которая принимает **более широкий** ввод, может быть назначена там, где ожидается **более узкий** ввод. По умолчанию методы остаются бивариантными (ненадежно, но эргономично).

6. **`const` по параметру универсального типа** — сохраняет **литеральный** вывод в дженериках: `routes<const T>(["/a", "/b"])` → кортеж литералов, а не `string[]`. Полезно для объектов конфигурации, определений маршрутов и API, где расширение теряет точность.

7. **`composite: true`** — помечает проект как часть графика **ссылки на проекты**. Требует `declaration: true`. Включает инкрементные сборки и позволяет другим проектам `reference` Вот этот. Требуется для `tsc --build` рабочие процессы монорепо.

</details>

---

### Task — Cart aggregation (typed)

Полностью типизированный калькулятор корзины — зеркала [3_js_array.md, задача 16](./3_js_array.md#interview-practice).

```typescript
type ProductCategory = 'food' | 'electronics' | 'clothing';

type Product = {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
};

type CartItem = { product: Product; qty: number };

type CartSummary = { subtotal: number; discount: number; total: number };

type Discounts = Partial<Record<ProductCategory, number>>;

function calculateCart(items: CartItem[], discounts: Discounts = {}): CartSummary {
  return items.reduce<CartSummary>(
    (acc, { product, qty }) => {
      const lineSubtotal = product.price * qty;
      const rate = discounts[product.category] ?? 0;
      const lineDiscount = lineSubtotal * rate;
      acc.subtotal += lineSubtotal;
      acc.discount += lineDiscount;
      acc.total += lineSubtotal - lineDiscount;
      return acc;
    },
    { subtotal: 0, discount: 0, total: 0 },
  );
}
```

**Interview talking points:**

- `ProductCategory` буквальный союз — поиск скидок типобезопасен.
- `Partial<Record<...>>` — не каждой категории нужна скидка.
- `CartSummary` возвращаемый тип документирует контракт API.
- Дискриминированные варианты (например. `DigitalProduct | PhysicalProduct`) можно расширить это с помощью `kind` поле + сужение.

<details>
  <summary>Variant with discriminated product types</summary>

```typescript
type BaseProduct = { id: string; name: string; price: number };

type FoodProduct = BaseProduct & { kind: 'food'; expiryDays: number };
type ElectronicsProduct = BaseProduct & { kind: 'electronics'; warrantyMonths: number };
type ClothingProduct = BaseProduct & { kind: 'clothing'; size: string };

type Product = FoodProduct | ElectronicsProduct | ClothingProduct;

// Narrow in reduce:
function getDiscountRate(product: Product, discounts: Discounts): number {
  return discounts[product.kind] ?? 0;
}
```

</details>

---

</details>


