# TypeScript — Interview

Вопросы для собеседования по TypeScript. Ответы заполнены для опубликованной части, остальные пустые.

[← Назад к хабу](./5_ts.md)

### Related docs

[TypeScript — хаб](./5_ts.md) · [Типы](./5_ts_types.md) · [Сужение](./5_ts_narrowing.md) · [Функции](./5_ts_functions.md) · [Манипуляции типами](./5_ts_type_manipulation.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Вопросы из [Devinterview.io — TypeScript](https://devinterview.io/questions/web-and-mobile-development/typescript-interview-questions/).

### TypeScript Fundamentals

<details>
<summary>What is TypeScript and how does it differ from JavaScript?</summary>

### What is TypeScript and how does it differ from JavaScript?

**Definition:**

TypeScript — это JavaScript плюс статическая система типов. Компилятор проверяет типы и выдаёт обычный JavaScript, из которого типы убраны.

**How it works:**

- Аннотируют параметры, возвращаемые значения и привязки. Проверка идёт до запуска, поэтому строка, переданная в числовой параметр, — ошибка редактора, а не сюрприз во время выполнения.
- Любой файл JavaScript — точка старта. Типы можно добавлять постепенно, а `allowJs` позволяет смешивать `.js` и `.ts`.
- Система типов структурная: объект принимают, если у него есть нужные члены, независимо от того, объявлен ли он с этим именем.
- `tsc` может выдать более старый диалект ECMAScript, так что современный синтаксис всё равно доезжает до нужных движков.
- Языковой сервис даёт дополнение, переименование и ошибки прямо в редакторе. В обычном JavaScript этой обратной связи нет.
- Модификаторы доступа, enum, интерфейсы и свойства-параметры — возможности TypeScript. Их либо стирают, либо опускают до обычного JavaScript.
- TypeScript не меняет, как движок выполняет результат. Неверное приведение через `as` всё равно упадёт во время выполнения.

**Examples:**

```ts
function berthLabel(id: number): string {
  return `Pier ${id}`;
}
```

**Sources:**

- https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html

</details>

<details>
<summary>Can you explain what is meant by "TypeScript is a superset of JavaScript"?</summary>

### Can you explain what is meant by "TypeScript is a superset of JavaScript"?

**Definition:**

«Надмножество» значит, что верная программа на JavaScript — верная программа на TypeScript. TypeScript добавляет синтаксис и не отвергает язык, в который компилируется.

**How it works:**

- Грамматика включает JavaScript. Файл `.ts` может содержать нетипизированный JavaScript и всё равно компилироваться, с учётом флагов в `tsconfig`.
- При включённом `strict` компилятор всё же может сообщить об ошибках в таком коде, например о неявном `any` или возможном `null`. Синтаксис принят; проверка не прошла.
- Необязательные аннотации позволяют переносить проект файл за файлом. Типы не обязаны стоять на каждой привязке до сборки.
- Компилятор также принимает более новый синтаксис JavaScript и может опустить его до старого, так что исходник может опережать движки, под которые вы поставляете код.
- Дополнительный синтаксис — аннотации, интерфейсы, enum, свойства-параметры — стирается или переписывается. Среда выполнения этих ключевых слов не знает.
- Файл `.ts` — не «JavaScript плюс комментарии». Ошибка типа останавливает `tsc`, когда включён `noEmitOnError`; так обычно устроен CI.

**Examples:**

```ts
const id = 4;          // JavaScript, type inferred as number
id.toFixed(0);
// id = "pier";        // error: string is not assignable to number
```

**Sources:**

- https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html

</details>

<details>
<summary>What are the basic types available in TypeScript?</summary>

### What are the basic types available in TypeScript?

**Definition:**

TypeScript называет те значения JavaScript, которые у вас уже есть, и добавляет несколько конструкций только для типов: кортежи, литеральные типы, `any`, `unknown`, `void` и `never`.

**How it works:**

- Повседневные типы: `boolean`, `number`, `string`, `bigint`, `symbol`, `null`, `undefined`.
- Массивы — `number[]` или `Array<number>`. Кортеж вроде `[string, number]` фиксирует длину и тип каждой позиции.
- Литеральный тип — конкретное значение: `"north" | "south"`. Объединение — значение, которое может быть одним из нескольких типов.
- `enum` — именованный набор констант. Объединение строковых литералов часто оказывается более лёгкой заменой.
- `any` выключает проверку для этого значения. `unknown` — безопасный верхний тип: его сужают, прежде чем использовать.
- `void` — тип возврата функции, которая не возвращает ничего полезного. `never` — тип возврата функции, которая не возвращается, например всегда бросает ошибку.
- `object` значит «не примитив». Ключей он не перечисляет. Объектный тип вроде `{ id: number }` перечисляет.
- При `strictNullChecks` значения `null` и `undefined` нельзя записать в `string`, пока вы не включите их в тип.

**Examples:**

```ts
let open: boolean = true;
let code: string | null = null;
let point: [number, number] = [12, 40];
function fail(message: string): never {
  throw new Error(message);
}
```

**Sources:**

- https://www.typescriptlang.org/docs/handbook/2/everyday-types.html

</details>

<details>
<summary>How do you declare variables in TypeScript?</summary>

### How do you declare variables in TypeScript?

**Definition:**

Привязку объявляют через `const`, `let` или `var`, и либо пишут тип, либо позволяют инициализатору его вывести. Использовать стоит `const` и `let`.

**How it works:**

- `const` — привязка, которую не переприсваивают. Объект, на который она указывает, менять можно. `let` разрешает переприсваивание. Оба имеют область блока.
- `var` имеет область функции и поднимается как `undefined`. TypeScript его принимает, потому что его принимает JavaScript. В новом коде его не добавляют.
- Аннотация стоит после имени: `const id: number = 4`. Если её нет, берётся тип инициализатора.
- Привязка без инициализатора и без аннотации становится `any`, когда `noImplicitAny` выключен, и ошибкой, когда он включён.
- Объявленный тип и инициализатор должны совпадать. `const id: number = "4"` не компилируется.
- Литерал намеренно расширяют аннотацией (`let lane: string = "north"`), если поздние присваивания нуждаются в более широком типе. Иначе у `const` останется литеральный тип `"north"`.
- Объявляйте привязку до использования. Выше своей строки `let` и `const` находятся во временной мёртвой зоне, как в JavaScript.

**Examples:**

```ts
const pier = 4;          // number (literal 4)
let name: string = "North";
name = "South";
```

**Sources:**

- https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
- https://www.typescriptlang.org/docs/handbook/variable-declarations.html

</details>

<details>
<summary>What are Interfaces in TypeScript and how do they work?</summary>

### What are Interfaces in TypeScript and how do they work?

**Definition:**

Интерфейс называет члены, которые должны быть у значения. Это контракт только на уровне типов: для него ничего не порождается, и принимают любое значение нужной формы.

**How it works:**

- Свойство обязательно, если не заканчивается на `?`. `readonly` запрещает присваивание после создания объекта — в системе типов.
- Методы — это сигнатуры вызова на объекте: `open(id: number): void`.
- Сигнатура индекса вроде `[key: string]: number` разрешает дополнительные ключи этого типа.
- `interface Berth extends Spot` добавляет члены. Класс `implements Berth` проверяют на ту же форму.
- Интерфейсы открыты: второе объявление того же имени сливается. Псевдоним `type` не сливается и может назвать объединение, чего интерфейс не может.
- Проверка лишних свойств срабатывает на объектных литералах, которые присваивают интерфейсу напрямую. Переменная, у которой тип уже шире, проверяется структурно и может пройти с лишними полями.
- Для формы объекта берут интерфейс или `type`. Выбор — в слиянии и объединениях, а не в поведении во время выполнения.

**Examples:**

```ts
interface Berth {
  readonly id: number;
  name: string;
  note?: string;
}
const pier: Berth = { id: 4, name: "North" };
```

**Sources:**

- https://www.typescriptlang.org/docs/handbook/2/objects.html
- https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces

</details>

<details>
<summary>Describe the Enum type and when you might use it.</summary>

### Describe the Enum type and when you might use it.

**Definition:**

Enum даёт набору именованных констант собственный тип. Числовой enum порождает объект во время выполнения. Объединение строковых литералов часто выражает ту же идею без лишнего кода.

**How it works:**

- Числовой enum назначает `0`, `1`, `2`, если значения не заданы. Он также порождает обратное отображение от значения к имени.
- Строковый enum требует строковое значение у каждого члена и обратного отображения не строит. Порождённый объект — словарь в одну сторону.
- Смешанный enum сочетает числа и строки. Он законен и редко стоит путаницы.
- `const enum` подставляется на месте и объекта не порождает, но ломается, когда его импортируют через границы компиляции. Предпочтительнее обычный enum или объединение литералов.
- Enum берут, когда набор замкнут, имена должны существовать во время выполнения, и вызывающие не должны случайно передать голое `0` или `"red"`. Направление, статус и фиксированный протокол — обычные случаи.
- Цена реальна: объект попадает в бандл, а числовой enum по-прежнему принимает любое число, пока вы его не проверите.
- Когда нужен только тип, `type Lane = "north" | "south"` стирается и проверяется на полноту в `switch`.

**Examples:**

```ts
enum Lane { North = "north", South = "south" }
const lane: Lane = Lane.North;

type Tide = "flood" | "ebb";
```

**Sources:**

- https://www.typescriptlang.org/docs/handbook/enums.html

</details>

<details>
<summary>How do you define and use a function in TypeScript?</summary>

### How do you define and use a function in TypeScript?

**Definition:**

Функция TypeScript — это функция JavaScript с типами параметров и типом возврата. Дополнительные пометки проверяются при компиляции и удаляются из результата.

**How it works:**

- Объявление перечисляет типы: `function area(w: number, h: number): number`.
- Функциональное выражение и стрелка принимают те же аннотации. Тип можно повесить и на привязку: `const area: (w: number, h: number) => number`.
- Необязательный параметр заканчивается на `?` и его можно не передавать. Параметр со значением по умолчанию необязателен при вызове, и его тип — тип умолчания, если вы не аннотировали его. Необязательные параметры идут после обязательных.
- Rest-параметр — массив: `...ids: number[]`.
- Сигнатуры перегрузки описывают допустимые формы вызова. За ними идёт одна сигнатура реализации, вызывающим она не видна. Реализация должна быть совместима с каждой перегрузкой.
- Сигнатура вызова в типе объекта описывает свойство-функцию ещё до написания самой функции.
- Тип возврата выводится из `return`, если вы его не написали. Аннотируйте его у экспортируемой функции, чтобы поздняя правка не расширила результат молча.
- `void` значит, что возвращаемое значение следует игнорировать. Функция с аннотацией `void` всё же может вернуть значение; вызывающий не должен его использовать.

**Examples:**

```ts
function label(id: number, note = "open"): string {
  return `${id}: ${note}`;
}
```

**Sources:**

- https://www.typescriptlang.org/docs/handbook/2/functions.html

</details>

<details>
<summary>What does "type inference" mean in the context of TypeScript?</summary>

### What does "type inference" mean in the context of TypeScript?

**Definition:**

Вывод значит, что компилятор выбирает тип по тому, как значение написано и используется, и вам не нужно аннотировать то, что и так очевидно.

**How it works:**

- `const`, инициализированный значением `4`, получает литеральный тип `4`. `let`, инициализированный значением `4`, получает `number`, потому что его можно переприсвоить.
- Тип возврата функции выводится из выражений `return`, если аннотацию не написали.
- Массив смешанных литералов выводится как объединение типов элементов, расширенное так, как позволяет привязка. Контекстный тип слева может удержать литералы более узкими.
- «Наилучший общий тип» нескольких выражений — их объединение, когда ни один тип не содержит остальные.
- Контекст течёт внутрь. Колбэк, переданный в `ids.map`, получает тип элемента из массива, поэтому параметр часто не нуждается в аннотации.
- Вывод не читает мысли через границу функции. Параметр без аннотации — это `any` или ошибка, в зависимости от `noImplicitAny`.
- Аннотируйте границы модуля и пустые контейнеры (`const rows: Berth[] = []`). Локальные привязки оставьте выводу.

**Examples:**

```ts
const pier = 4;                 // 4
let count = 4;                  // number
const lanes = ["north", "south"]; // string[]
```

**Sources:**

- https://www.typescriptlang.org/docs/handbook/type-inference.html

</details>

<details>
<summary>Explain the use of 'let' and 'const' in TypeScript.</summary>

### Explain the use of 'let' and 'const' in TypeScript.

**Definition:**

`let` и `const` — блочные привязки из JavaScript. TypeScript добавляет вывод типа и проверку, что поздние присваивания всё ещё совпадают с типом.

**How it works:**

- `let` можно переприсваивать. Выведенный тип расширяется: `let n = 1` имеет тип `number`, поэтому `n = 2` допустимо.
- `const` переприсваивать нельзя. `const n = 1` сохраняет литеральный тип `1`. Переприсваивание — ошибка ещё до рассмотрения типа.
- `const` не замораживает объект. `const berth = { id: 4 }` всё ещё позволяет `berth.id = 5`, пока свойство не помечено `readonly` и значение не заморожено.
- Оба находятся во временной мёртвой зоне до своей строки. Оба исчезают в конце блока.
- `const` берут для привязки, которая не меняется, `let` — когда меняется. `var` всё ещё законен и всё ещё имеет область функции; для нового кода его не выбирают.
- Аннотация на `let` — способ заранее расширить литерал: `let lane: "north" | "south" = "north"`.

**Examples:**

```ts
const id = 4;
let lane: "north" | "south" = "north";
lane = "south";
```

**Sources:**

- https://www.typescriptlang.org/docs/handbook/variable-declarations.html
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const

</details>

<details>
<summary>How do you compile TypeScript files into JavaScript?</summary>

### How do you compile TypeScript files into JavaScript?

**Definition:**

`tsc` читает файлы `.ts`, проверяет типы и пишет `.js`, из которого типы стёрты. `tsconfig.json` говорит, какие файлы и какие настройки выдачи использовать.

**How it works:**

- Компилятор ставят в проект (`typescript`) и запускают `npx tsc`. Глобальная установка расходится с версией, которую ждёт репозиторий.
- `tsc --init` пишет стартовый `tsconfig.json`. `"include"` выбирает файлы. `"compilerOptions.target"` — диалект JavaScript на выходе. `"module"` — формат модулей.
- `"strict": true` включает проверки, которые нужны приложению. `"noEmit": true` проверяет без записи файлов; так часто устроена сборка через бандлер.
- `"outDir"` держит порождённый JavaScript отдельно от исходников. `"rootDir"` — общий корень входных файлов.
- Ссылки на проекты (`references` и `composite`) делят большой репозиторий на меньшие программы, которые собираются по порядку.
- Бандлер вроде esbuild, swc или Babel может снять типы быстрее и пропустить проверку. `tsc --noEmit` всё равно запускают, чтобы проверка не пропала.
- Программный API (`ts.createProgram`) — для инструментов. Код приложения его не вызывает.

**Examples:**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

**Sources:**

- https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
- https://www.typescriptlang.org/docs/handbook/compiler-options.html

</details>

### TypeScript Classes and Objects

<details>
<summary>Explain classes in TypeScript. How are they different from ES6 classes?</summary>

### Explain classes in TypeScript. How are they different from ES6 classes?

**Definition:**

Класс TypeScript — это класс ECMAScript плюс проверки и несколько возможностей только для типов. На выходе всё ещё конструктор и прототип, либо нативный синтаксис класса, если цель достаточно новая.

**How it works:**

- Общее с JavaScript: `constructor`, `extends`, `super`, методы, геттеры и сеттеры, статические члены и вычисляемые имена.
- Свойства-параметры есть только в TypeScript. `constructor(public id: number)` объявляет поле и присваивает `this.id` в одном месте.
- Поля `readonly` можно задать в объявлении или в конструкторе и нельзя позже. Это правило стирается.
- Абстрактные классы и абстрактные методы существуют как шаблон на уровне типов. Порождённый конструктор бросает ошибку, если его всё же вызвать.
- `public`, `protected` и `private` стираются. Это не поля `#` времени выполнения. Член `private` в выходном коде остаётся обычным свойством.
- Поля экземпляра можно объявить и не инициализировать в исходнике. При `strictPropertyInitialization` компилятор требует присваивание, если поле не необязательное и не помечено как точно присвоенное.
- Выражения классов, итераторы и `instanceof` работают. TypeScript эти возможности JavaScript не убирает.

**Examples:**

```ts
class Berth {
  constructor(readonly id: number, public name: string) {}
}
```

**Sources:**

- https://www.typescriptlang.org/docs/handbook/2/classes.html

</details>

<details>
<summary>How do you implement Inheritance in TypeScript?</summary>

### How do you implement Inheritance in TypeScript?

**Definition:**

Подкласс делает `extends` родительского класса, вызывает `super` до использования `this` и добавляет или переопределяет члены. Проверка структурная, а родитель при этом — настоящее значение.

**How it works:**

- `class Dock extends Berth` переносит сторону экземпляра `Berth` на `Dock` и выстраивает цепочку прототипов.
- Конструктор подкласса обязан вызвать `super(...)` до чтения или записи `this`. Сначала выполняется конструктор родителя.
- Переопределённый метод должен оставаться совместимым с сигнатурой родителя. Типы параметров можно расширить; тип возврата — сузить.
- Члены `protected` видны в подклассе. Члены `private` — нет. Поля `#` родителя тоже не видны.
- Подкласс можно присвоить типу родителя. Обратное без проверки неверно.
- `implements` — не наследование. Оно только проверяет, что форма класса совпадает с интерфейсом. Связи прототипов нет.
- Прототипная сборка (`Object.create`, запись `__proto__`) всё ещё работает, потому что на выходе JavaScript. Писать стоит синтаксис классов. Пересечение типов (`A & B`) соединяет формы типов и подкласс не создаёт.

**Examples:**

```ts
class Berth {
  constructor(readonly id: number) {}
  label() { return `Pier ${this.id}`; }
}
class Dock extends Berth {
  constructor(id: number, readonly crane: boolean) {
    super(id);
  }
}
```

**Sources:**

- https://www.typescriptlang.org/docs/handbook/2/classes.html#extends-clauses

</details>

<details>
<summary>What are access modifiers and how do they work in TypeScript?</summary>

### What are access modifiers and how do they work in TypeScript?

**Definition:**

`public`, `protected` и `private` ограничивают, откуда TypeScript позволяет упоминать член класса. Они стираются. Приватность во время выполнения — это поле `#` в JavaScript.

**How it works:**

- `public` стоит по умолчанию. Любой код, у которого есть объект, может читать и писать член.
- `protected` виден в объявившем классе и в подклассах, но не на значении с типом этого класса снаружи.
- `private` виден только внутри объявившего класса. Подкласс его использовать не может. Два класса с одним и тем же `private`-членом нельзя присвоить друг другу: это единственная номинальная проверка в остальном структурной системе.
- Поскольку модификаторы стираются, `obj["id"]` или вызывающий на JavaScript всё ещё могут достать свойство. Не считайте `private` границей безопасности.
- `#secret` — жёстко приватное поле. Доступ вне тела класса — синтаксическая ошибка, и имя не является обычным строковым ключом.
- Свойства-параметры применяют те же модификаторы: `constructor(private id: number)`.
- `readonly` — отдельно. Он ограничивает присваивание, а не видимость.

**Examples:**

```ts
class Gate {
  public name = "north";
  protected code = 4;
  #pin = "1397";
  open(pin: string) { return pin === this.#pin; }
}
```

**Sources:**

- https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements

</details>

<details>
<summary>Discuss Abstract classes and their purposes in TypeScript.</summary>

### Discuss Abstract classes and their purposes in TypeScript.

**Definition:**

Абстрактный класс — это база, которую нельзя сконструировать. В ней могут быть настоящие методы и абстрактные методы, которые обязан реализовать каждый конкретный подкласс.

**How it works:**

- `new` на абстрактном классе — ошибка типа. Смысл в том, чтобы делить код, не притворяясь, что база — готовый объект.
- У абстрактного метода нет тела. Подкласс, который его не реализовал, сам абстрактен, иначе он не компилируется.
- Конкретные методы базы наследуются как написаны. Подклассы вызывают их через `super` или пользуются ими как есть.
- У абстрактных классов могут быть конструкторы, поля и статические члены. Статика принадлежит функции-конструктору и экземпляр не нужен.
- Такой класс берут, когда несколько классов делят настоящее поведение и обязательную форму. Интерфейс берут, когда нужна только форма и общего кода нет.
- Подкласс абстрактного класса можно присвоить абстрактному типу, поэтому функции могут принимать базу и вызывать общие методы.
- Порождённый конструктор бросает ошибку, если его вызвать. Защита — не только проверка типов.

**Examples:**

```ts
abstract class Report {
  abstract title(): string;
  render() { return this.title().toUpperCase(); }
}
class TideReport extends Report {
  title() { return "Tide"; }
}
```

**Sources:**

- https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members

</details>

<details>
<summary>Can you describe the use of Constructors within TypeScript classes?</summary>

### Can you describe the use of Constructors within TypeScript classes?

**Definition:**

Конструктор выполняется, когда вы вызываете `new`. Он принимает аргументы, инициализирует поля и является тем местом, где класс готовит `this`, прежде чем экземпляром пользуются.

**How it works:**

- У класса одна реализация конструктора. Сигнатуры перегрузки могут описать несколько форм вызова; реализация, которая за ними следует, скрыта от вызывающих и должна обработать каждую форму.
- Если конструктор опустить, умолчание не принимает аргументов. Подкласс, который объявил конструктор, обязан вызвать `super` до обращения к `this`.
- Свойства-параметры объявляют и присваивают поля из списка аргументов: `constructor(public id: number)`.
- `readonly` на свойстве-параметре или поле значит, что законны только инициализатор и присваивание в конструкторе.
- Тип возврата конструктора — тип экземпляра. Его не аннотируют. Возврат объекта из конструктора подменяет `this`, как в JavaScript, и тип этого пути легко перепутать.
- Модификаторы доступа на самом конструкторе решают, кто может вызвать `new`. Приватный конструктор заставляет вызывающих идти через фабрику на классе.
- Конструктор — не обычный метод. Его не вызывают как `obj.constructor(...)`, чтобы заново инициализировать живой объект.

**Examples:**

```ts
class Berth {
  constructor(readonly id: number, public name: string) {}
}
const pier = new Berth(4, "North");
```

**Sources:**

- https://www.typescriptlang.org/docs/handbook/2/classes.html#constructors

</details>

<details>
<summary>What are Property Decorators and how do you use them?</summary>

### What are Property Decorators and how do you use them?

**Definition:**

</details>

<details>
<summary>How do getters and setters work in TypeScript?</summary>

### How do getters and setters work in TypeScript?

**Definition:**

</details>

<details>
<summary>Explain Method Overloading in TypeScript.</summary>

### Explain Method Overloading in TypeScript.

**Definition:**

</details>

<details>
<summary>What is the purpose of the 'static' keyword in TypeScript Class?</summary>

### What is the purpose of the 'static' keyword in TypeScript Class?

**Definition:**

</details>

### TypeScript Types and Type Assertions

<details>
<summary>How do you define custom types with Type Aliases?</summary>

### How do you define custom types with Type Aliases?

**Definition:**

</details>

<details>
<summary>Can you explain Union types and provide an example?</summary>

### Can you explain Union types and provide an example?

**Definition:**

</details>

<details>
<summary>How do Intersection types work in TypeScript?</summary>

### How do Intersection types work in TypeScript?

**Definition:**

</details>

<details>
<summary>What are Tuple types and when should they be used?</summary>

### What are Tuple types and when should they be used?

**Definition:**

</details>

<details>
<summary>Explain Type Assertions and why they are useful.</summary>

### Explain Type Assertions and why they are useful.

**Definition:**

</details>

<details>
<summary>How do you use the 'typeof' type guard in TypeScript?</summary>

### How do you use the 'typeof' type guard in TypeScript?

**Definition:**

</details>

<details>
<summary>Can you create types from existing data using Type Inference?</summary>

### Can you create types from existing data using Type Inference?

**Definition:**

</details>

### TypeScript Generics

<details>
<summary>What are Generics in TypeScript and why are they used?</summary>

### What are Generics in TypeScript and why are they used?

**Definition:**

</details>

<details>
<summary>How do you create a generic function?</summary>

### How do you create a generic function?

**Definition:**

</details>

<details>
<summary>Discuss how Generic Interfaces can be defined.</summary>

### Discuss how Generic Interfaces can be defined.

**Definition:**

</details>

<details>
<summary>Explain how Generics work with Classes.</summary>

### Explain how Generics work with Classes.

**Definition:**

</details>

<details>
<summary>Can you provide an example of a generic constraint?</summary>

### Can you provide an example of a generic constraint?

**Definition:**

</details>

### TypeScript Advanced Types and Techniques

<details>
<summary>What is a Discriminated Union in TypeScript?</summary>

### What is a Discriminated Union in TypeScript?

**Definition:**

</details>

<details>
<summary>How do you declare a Readonly type?</summary>

### How do you declare a Readonly type?

**Definition:**

</details>

<details>
<summary>Can you describe the use of Mapped types?</summary>

### Can you describe the use of Mapped types?

**Definition:**

</details>

<details>
<summary>Explain Conditional types in TypeScript.</summary>

### Explain Conditional types in TypeScript.

**Definition:**

</details>

<details>
<summary>What are Index types and how do you use the keyof keyword?</summary>

### What are Index types and how do you use the keyof keyword?

**Definition:**

</details>

<details>
<summary>How does Type Casting differ from Type Assertions?</summary>

### How does Type Casting differ from Type Assertions?

**Definition:**

</details>

<details>
<summary>Discuss the Partial, Required, Readonly, and Pick utility types.</summary>

### Discuss the Partial, Required, Readonly, and Pick utility types.

**Definition:**

</details>

<details>
<summary>What is the 'never' type and when would it be used?</summary>

### What is the 'never' type and when would it be used?

**Definition:**

</details>

### TypeScript Modules and Namespaces

<details>
<summary>How do you organize code with Modules in TypeScript?</summary>

### How do you organize code with Modules in TypeScript?

**Definition:**

</details>

<details>
<summary>When would you use Namespaces?</summary>

### When would you use Namespaces?

**Definition:**

</details>

<details>
<summary>What is the difference between Internal and External modules?</summary>

### What is the difference between Internal and External modules?

**Definition:**

</details>

<details>
<summary>How do you export and import modules?</summary>

### How do you export and import modules?

**Definition:**

</details>

<details>
<summary>Can you describe module resolution and its strategies?</summary>

### Can you describe module resolution and its strategies?

**Definition:**

</details>

<details>
<summary>Discuss the compatibility of TypeScript modules with ES6 modules.</summary>

### Discuss the compatibility of TypeScript modules with ES6 modules.

**Definition:**

</details>

### TypeScript Decorators and Metadata

<details>
<summary>What are Decorators and how do you use them?</summary>

### What are Decorators and how do you use them?

**Definition:**

</details>

<details>
<summary>Can you define Class Decorators and how they can alter Class behavior?</summary>

### Can you define Class Decorators and how they can alter Class behavior?

**Definition:**

</details>

<details>
<summary>How do you use Method Decorators in TypeScript?</summary>

### How do you use Method Decorators in TypeScript?

**Definition:**

</details>

<details>
<summary>What are Accessor Decorators?</summary>

### What are Accessor Decorators?

**Definition:**

</details>

<details>
<summary>Explain how to use Property Decorators.</summary>

### Explain how to use Property Decorators.

**Definition:**

</details>

<details>
<summary>How do Decorators compose in TypeScript?</summary>

### How do Decorators compose in TypeScript?

**Definition:**

</details>

<details>
<summary>Discuss Reflection and how it works with Decorators.</summary>

### Discuss Reflection and how it works with Decorators.

**Definition:**

</details>

### TypeScript Configuration and Compilation

<details>
<summary>Explain the purpose of 'tsconfig.json'.</summary>

### Explain the purpose of 'tsconfig.json'.

**Definition:**

</details>

<details>
<summary>How do you include and exclude files in compilation using 'tsconfig.json'?</summary>

### How do you include and exclude files in compilation using 'tsconfig.json'?

**Definition:**

</details>

<details>
<summary>What are some common compiler options in TypeScript?</summary>

### What are some common compiler options in TypeScript?

**Definition:**

</details>

<details>
<summary>How does TypeScript support source maps?</summary>

### How does TypeScript support source maps?

**Definition:**

</details>

<details>
<summary>Discuss incremental build support in TypeScript.</summary>

### Discuss incremental build support in TypeScript.

**Definition:**

</details>

<details>
<summary>Explain how the "noImplicitAny" compiler option works.</summary>

### Explain how the "noImplicitAny" compiler option works.

**Definition:**

</details>

<details>
<summary>How do you enable strict null checks in TypeScript?</summary>

### How do you enable strict null checks in TypeScript?

**Definition:**

</details>

### TypeScript Typings and @types

<details>
<summary>How do you manage type definitions for external libraries in TypeScript?</summary>

### How do you manage type definitions for external libraries in TypeScript?

**Definition:**

</details>

<details>
<summary>What is DefinitelyTyped and how is it related to TypeScript?</summary>

### What is DefinitelyTyped and how is it related to TypeScript?

**Definition:**

</details>

<details>
<summary>Explain how to use typing files from npm.</summary>

### Explain how to use typing files from npm.

**Definition:**

</details>

### Integrating TypeScript with Frameworks

<details>
<summary>How do you integrate TypeScript with Angular?</summary>

### How do you integrate TypeScript with Angular?

**Definition:**

</details>

<details>
<summary>Explain integrating TypeScript with React.</summary>

### Explain integrating TypeScript with React.

**Definition:**

</details>

<details>
<summary>How do you use TypeScript with Vue.js?</summary>

### How do you use TypeScript with Vue.js?

**Definition:**

</details>

<details>
<summary>Discuss using TypeScript in a Node.js application.</summary>

### Discuss using TypeScript in a Node.js application.

**Definition:**

</details>

### TypeScript Tooling and Ecosystem

<details>
<summary>What are the benefits of using tools like TSLint?</summary>

### What are the benefits of using tools like TSLint?

**Definition:**

</details>

<details>
<summary>Can you describe how to set up a build process with TypeScript and Webpack?</summary>

### Can you describe how to set up a build process with TypeScript and Webpack?

**Definition:**

</details>

<details>
<summary>How does TypeScript work with Babel?</summary>

### How does TypeScript work with Babel?

**Definition:**

</details>

<details>
<summary>Explain using TypeScript with Visual Studio Code or other IDEs.</summary>

### Explain using TypeScript with Visual Studio Code or other IDEs.

**Definition:**

</details>

### TypeScript Best Practices and Patterns

<details>
<summary>What are the best practices for structuring a TypeScript application?</summary>

### What are the best practices for structuring a TypeScript application?

**Definition:**

</details>

<details>
<summary>How do you handle async/await in TypeScript?</summary>

### How do you handle async/await in TypeScript?

**Definition:**

</details>

<details>
<summary>Discuss how you manage state in TypeScript-based applications.</summary>

### Discuss how you manage state in TypeScript-based applications.

**Definition:**

</details>

<details>
<summary>What are some common design patterns used in TypeScript?</summary>

### What are some common design patterns used in TypeScript?

**Definition:**

</details>

<details>
<summary>How do you debug a TypeScript application?</summary>

### How do you debug a TypeScript application?

**Definition:**

</details>

### TypeScript Testing and Quality Assurance

<details>
<summary>How do you write unit tests for TypeScript code?</summary>

### How do you write unit tests for TypeScript code?

**Definition:**

</details>

<details>
<summary>What testing frameworks are commonly used with TypeScript?</summary>

### What testing frameworks are commonly used with TypeScript?

**Definition:**

</details>

<details>
<summary>Discuss how to perform end-to-end testing in TypeScript applications.</summary>

### Discuss how to perform end-to-end testing in TypeScript applications.

**Definition:**

</details>

### TypeScript for Backend Development

<details>
<summary>How do you use TypeScript with Express.js?</summary>

### How do you use TypeScript with Express.js?

**Definition:**

</details>

<details>
<summary>Discuss creating RESTful services with TypeScript.</summary>

### Discuss creating RESTful services with TypeScript.

**Definition:**

</details>

<details>
<summary>Explain how to handle data modeling in a TypeScript backend.</summary>

### Explain how to handle data modeling in a TypeScript backend.

**Definition:**

</details>

<details>
<summary>How do you manage database interactions in TypeScript?</summary>

### How do you manage database interactions in TypeScript?

**Definition:**

</details>

<details>
<summary>Discuss authentication and authorization strategies in TypeScript APIs.</summary>

### Discuss authentication and authorization strategies in TypeScript APIs.

**Definition:**

</details>

### TypeScript Advanced Practices

<details>
<summary>Discuss using TypeScript for Domain-driven Design (DDD).</summary>

### Discuss using TypeScript for Domain-driven Design (DDD).

**Definition:**

</details>

<details>
<summary>How do you implement Event Sourcing in TypeScript?</summary>

### How do you implement Event Sourcing in TypeScript?

**Definition:**

</details>

<details>
<summary>Explain the concept of Isomorphic apps with TypeScript.</summary>

### Explain the concept of Isomorphic apps with TypeScript.

**Definition:**

</details>

### TypeScript Types and ECMAScript Standards

<details>
<summary>How does TypeScript align with the latest ECMAScript standards?</summary>

### How does TypeScript align with the latest ECMAScript standards?

**Definition:**

</details>

<details>
<summary>What enhancements has TypeScript brought to match ES6 and beyond?</summary>

### What enhancements has TypeScript brought to match ES6 and beyond?

**Definition:**

</details>

<details>
<summary>Discuss how TypeScript handles async iterators.</summary>

### Discuss how TypeScript handles async iterators.

**Definition:**

</details>

### TypeScript Performance Optimization

<details>
<summary>How do you optimize the performance of a TypeScript application?</summary>

### How do you optimize the performance of a TypeScript application?

**Definition:**

</details>

<details>
<summary>Discuss tree shaking in TypeScript.</summary>

### Discuss tree shaking in TypeScript.

**Definition:**

</details>

<details>
<summary>Explain how to optimize bundle size with TypeScript.</summary>

### Explain how to optimize bundle size with TypeScript.

**Definition:**

</details>

### TypeScript 4.x Features and Updates

<details>
<summary>What are the new features included in the latest TypeScript release?</summary>

### What are the new features included in the latest TypeScript release?

**Definition:**

</details>

<details>
<summary>How do you use Template Literal Types?</summary>

### How do you use Template Literal Types?

**Definition:**

</details>

<details>
<summary>Discuss the improvements to Inference in Conditional Types.</summary>

### Discuss the improvements to Inference in Conditional Types.

**Definition:**

</details>

<details>
<summary>What is the use of labeled tuple elements?</summary>

### What is the use of labeled tuple elements?

**Definition:**

</details>

### TypeScript Community and Development

<details>
<summary>How can you contribute to the TypeScript community or TypeScript itself?</summary>

### How can you contribute to the TypeScript community or TypeScript itself?

**Definition:**

</details>

<details>
<summary>Discuss the role of TypeScript in open-source development.</summary>

### Discuss the role of TypeScript in open-source development.

**Definition:**

</details>

<details>
<summary>Explain how to stay updated with TypeScript's changes and best practices.</summary>

### Explain how to stay updated with TypeScript's changes and best practices.

**Definition:**

</details>

### Transitioning from JavaScript to TypeScript

<details>
<summary>What steps should a JavaScript developer take to start using TypeScript effectively?</summary>

### What steps should a JavaScript developer take to start using TypeScript effectively?

**Definition:**

</details>
