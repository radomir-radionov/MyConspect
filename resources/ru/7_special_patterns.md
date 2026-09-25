# Design patterns

Каталог GoF: творческие, структурные и поведенческие модели. SOLID, DRY/KISS/YAGNI и GRASP живут в родственных темах Принципов. TDD/BDD: [Тесты](./7_special_testing.md). Внедрение конструктора: [Сущности, отношения и дизайн](./0_system_design_grasp.md#entities-relations--design).

[ ← Вернуться в хаб](./0_system_design.md)

### Related docs

* [Проектирование системы — Ядро](./0_system_design_core.md) · [Проектирование системы — Архитектура](./0_system_design_architecture.md) · [Шаблоны архитектуры](./7_special_architecture.md) · [Проектирование системы — Данные](./0_system_design_data.md) · [SOLID](./7_special_engineering.md) · [DRY, KISS, YAGNI](./0_system_design_principles.md) · [GRASP](./0_system_design_grasp.md) · [Шаблоны проектирования](./7_special_patterns.md) · [Проектирование системы —Интервью](./0_system_design_interview.md)

### Main concepts

| Площадь | Темы |
|------|--------|
| Каталог | 23 GoF patterns (creational, structural, behavioral) |
| Шпаргалки | Группировка, ориентированная на интерфейс |
| Экстра | Репозиторий (не GoF) |

### Sections

- [10. Design patterns](#10-design-patterns)
- [GOF design patterns — catalog](#gof-design-patterns--catalog)
- [Creational patterns — cheat sheet](#creational-patterns--cheat-sheet)
- [Structural patterns — cheat sheet](#structural-patterns--cheat-sheet)
- [Behavioral patterns — cheat sheet](#behavioral-patterns--cheat-sheet)

---

<a name="10-design-patterns"></a>

## 10. Design patterns

<details>
  <summary>Design pattern (general)</summary>

### Design pattern (general)

**Definition:**

Многоразовое решение повторяющейся проблемы дизайна — не копирование кода, а структура и шаблон сотрудничества.

| Категория | Примеры |
|----------|----------|
| **Творческий** | Фабрика, Фабричный метод, Абстрактная фабрика, Построитель, Синглтон, Прототип |
| **Структурный** | Адаптер, Декоратор, Фасад, Прокси |
| **Поведенческий** | Цепочка ответственности, Наблюдатель, Стратегия, Команда, Итератор |

**When to use:** Когда проблема соответствует каталогу; шаблоны названий в документах и ​​обзорах.

**Pluses and minuses:**

| + | − |
|------|------|
| Общий словарь | Чрезмерное применение («типичная лихорадка») |
| Испытанные в бою конструкции | Может скрыть простой код |

**Thoughts:** Полный каталог и группировку внешнего интерфейса см. в [Каталог GOF](#gof-design-patterns--catalog). Распределение ответственности (Эксперт, Создатель, Контролер): [GRASP](./0_system_design_grasp.md#grasp-principles). Творческий список: [шпаргалка](#creational-patterns--шпаргалка). Структурный список: [шпаргалка](#structural-patterns--шпаргалка). Поведенческий список: [шпаргалка](#behavioral-patterns--шпаргалка).Шаблоны не являются целью пиара.

**Sources:**

[refactoring.guru](https://refactoring.guru/design-patterns/catalog) · [Doka — Архитектура и шаблоны проектирования](https://doka.guide/tools/architecture-and-design-patterns/)

---

</details>

<details>
  <summary>GOF design patterns — catalog</summary>

<a name="gof-design-patterns--catalog"></a>

### GOF design patterns — catalog

**Definition:**

Банда четырех (Гамма, Хелм, Джонсон, Влиссидес) — 23 многократно используемых шаблона ООП-проектирования из *Шаблоны проектирования: элементы многоразового объектно-ориентированного программного обеспечения* (1994).

| Творческий | Структурный | Поведенческий |
|------------|------------|------------|
| Фабричный метод | Адаптер | Цепочка ответственности |
| Абстрактная фабрика | Мост | Команда |
| Строитель | Композитный | Переводчик |
| Прототип | Декоратор | Итератор || Синглтон | Фасад | Медиатор |
| | Наилегчайший вес | Сувенир |
| | Прокси | наблюдатель |
| | | Государство |
| | | Стратегия |
| | | Шаблонный метод |
| | | Посетитель |

**Thoughts:**

Шаблоны — это словарный запас, а не цели. «Нам нужна фабрика» — неправильная отправная точка: сначала определите проблему, а затем назовите закономерность. Примечания Deep JS/Doka: [Шпаргалка по созданию](#creational-patterns--шпаргалка).

Список фронтенда Doka (не все 23):

| Вид | Работа | Имена, которые нужно знать |
|------|-----|----------------|| **Творческий** | Создание объектов/семейств без дублирования | Простая фабрика (неформальная), Фабричный метод, Абстрактная фабрика, Строитель |
| **Структурный** | Объединить сущности («как собрать компонент») | Адаптер, Декоратор, Фасад, Прокси |
| **Поведенческий** | Кто что делает, как разговаривает («как организовать поведение») | Цепочка ответственности, Стратегия, Командование, Наблюдатель |Гуру рефакторинга: Creational = механизмы создания; структурный = собрать объекты/классы; поведенческий = алгоритмы и ответственность. **Простая фабрика** — это общее название функции, которая `switch`es по типу — полезно, но не является отдельным шаблоном GoF (фабричный метод есть). Короткие списки: [структурные](#structural-patterns--шпаргалка) · [поведенческие](#behavioral-patterns--шпаргалка).

**Sources:** [Гуру рефакторинга — Каталог](https://refactoring.guru/design-patterns/catalog) · [Doka — Архитектура и шаблоны проектирования](https://doka.guide/tools/architecture-and-design-patterns/) · [ByteByteGo — ООП-дизайн Шаблоны] (https://blog.bytebytego.com/i/162154465/oop-design-patterns-you-must-know)

</details>

<details>
  <summary>Creational patterns — cheat sheet</summary>

<a name="creational-patterns--cheat-sheet"></a>

### Creational patterns — cheat sheet

**Definition:**

Шаблоны создания скрывают **как рождаются объекты** — поля, значения по умолчанию, дополнительные данные, экземпляр какого класса создавать — поэтому вызывающие объекты не повторяют конструкцию и не зависят от конкретных типов.

Четыре повседневных набора Doka (не полный список GoF): **Factory** (простой), **Абстрактная фабрика**, **Builder**, **Singleton**. В GoF также есть **Фабричный метод** и **Прототип**.«Фабрика» Doka — это неформальная **простая фабричная** функция, а не фабричный метод.

| Узор | Одна линия | Ментальная модель |
|---------|----------|--------------|
| **Завод** (простой) | Функция владеет рецептом; вызывающий абонент передает намерение (`createGuitar(6)`) | Гитарный магазин против фрезерования грифа |
| **Заводской метод** | Подклассы создателя переопределяют `createX()` — какой *класс* рождается | Department.hire → Программист vs Бухгалтер |
| **Абстрактная фабрика** | Интерфейс, создающий **семейство** сопутствующих продуктов | Резервирование оркестра: инструмент + музыкант, один API |
| **Строитель** | Дополнительные шаги, затем `build()`; цепочка возвращается `this` | Кофе: эспрессо + молоко + сахар |
| **Синглтон** | Не более одного экземпляра; позже `new` возвращает первый | One Sun — вместо этого обычно делают редизайн |

**How it works:**

- **Фабрика против Абстрактной фабрики** — Фабрика возвращает **один** продукт. Абстрактная Фабрика — это фабрика фабрик: одни и те же *операции*, разные *семьи* (Скрипка+Скрипач против Виолончели+Виолончелист). Цель снижается `instanceof` деревья.
- **Factory vs Builder** — Фабрика: «дайте мне полный объект, может быть, с парой аргументов». Построитель: много **необязательных шагов**, порядок имеет значение, избегайте конструктора с десятью логическими значениями.
- **Простой фабричный метод против фабричного метода** — `createX(type)` + `switch` это идиома. Фабричный метод — это когда *класс* откладывается `new` на подклассы (Refactoring Guru).
- **Шаблон Singleton против DI «singleton»** — Шаблон = ограничить количество. Срок службы DI = повторное использование одного и того же внедренного экземпляра. Разные работы (Дока).

| Использование | Узор |
|-----|---------|
| Построение > 1–2 строк, или требуется расчет/дополнительные данные | Фабрика |
| Сопутствующие продукты должны оставаться совместимыми; клиент не должен называть классы | Абстрактная фабрика |
| Множество дополнительных функций;телескопические конструкторы | Строитель |
| Домен действительно допускает только один (редкий) | Синглтон — предпочитаю ESM `export const` |

```js
// Factory — recipe + a calculation. Call sites stay createGuitar(6) if fields change.
function createGuitar(stringsCount = 6, maxWeight = 5) {
  const fretBoardMaterial = maxWeight <= 5 ? 'fir' : 'cedar';
  return { stringsCount, fretsCount: 24, fretBoardMaterial };
}
createGuitar(6);
createGuitar(7, 8);
```

```js
// Abstract Factory — same two methods; violin vs cello family. reserve() never instanceofs.
const violinKit = {
  reserveInstrument: () => ({ play: (n) => `violin ${n}` }),
  notifyPlayer: () => ({ play: (piece) => piece.map((n) => `violin ${n}`) }),
};
const celloKit = {
  reserveInstrument: () => ({ play: (n) => `cello ${n}` }),
  notifyPlayer: () => ({ play: (piece) => piece.map((n) => `cello ${n}`) }),
};
function reserve(kit) {
  kit.notifyPlayer();
  return kit.reserveInstrument();
}
reserve(violinKit).play('A'); // 'violin A'
reserve(celloKit).play('A');  // 'cello A'
```

```js
// Builder — optional steps, then build(). addX returns this so you can chain.
class DrinkBuilder {
  settings = { base: 'espresso' };
  addMilk() { this.settings.milk = true; return this; }
  addSugar() { this.settings.sugar = true; return this; }
  build() { return { ...this.settings }; }
}
new DrinkBuilder().addMilk().build();           // { base: 'espresso', milk: true }
new DrinkBuilder().addSugar().addMilk().build();
```

```js
// Singleton — second new returns the first object. Prefer export const in real JS.
class Sun {
  static #instance = null;
  constructor() {
    if (Sun.#instance) return Sun.#instance;
    Sun.#instance = this;
  }
}
new Sun() === new Sun(); // true
// Idiomatic: export const sun = Object.freeze({ mass: 1.989e30 });
```

**See also:** [Factory](#factory--factory-method) · [Абстрактная фабрика](#abstract-factory) · [Builder](#builder) · [Singleton](#singleton-caution) · [Каталог GOF](#gof-design-patterns--catalog) · [фабрика JS OOP](./3_js_oop.md)

**Sources:**

[Doka — Шаблоны создания](https://doka.guide/tools/design-patterns-creational/) (Саша Беспоясов, обновление 29 февраля 2024 г.) · [Refactoring Guru — Каталог](https://refactoring.guru/design-patterns/catalog) · [Сравнение фабрик](https://refactoring.guru/design-patterns/factory-comparison)

---

</details>

<details>
  <summary>Structural patterns — cheat sheet</summary>

<a name="structural-patterns--cheat-sheet"></a>

### Structural patterns — cheat sheet

**Definition:**

Структурные шаблоны отвечают на вопрос: «Как нам собрать компонент, чтобы он мог сочетаться с другими?» — они управляют **композицией объектов**, а не созданием (креационное) или тем, кто с кем разговаривает (поведенческое).

| Узор | Одна линия | Ментальная модель |
|---------|----------|--------------|
| **Адаптер** | Перевести несовместимую форму API/данных в то, что уже ожидает клиент | Дорожная вилка || **Фасад** | Один простой метод для многих шагов подсистемы | «Нагреть воду» против 8 вызовов атомных машин |
| **Декоратор** | Перенос, чтобы **добавить** поведение; сохранить тот же интерфейс | Телефон + чехол; `debounce(fn)` |
| **Прокси** | Тот же интерфейс; **gate** доступ (ленивый, аутентификация, кеш, перехват) | Администратор; JS `Proxy` |

**Чем они отличаются** (Гуру рефакторинга):

- **Адаптер против Декоратора** — Адаптер предоставляет *другой* интерфейс. Декоратор сохраняет (или расширяет) оригинал и поддерживает укладку оберток.
- **Адаптер против фасада** — адаптер оборачивает *один* объект в соответствии с целевым интерфейсом. Фасад предоставляет *новый, более простой* интерфейс над *подсистемой* (много объектов/много вызовов).- **Декоратор против прокси** — оба оборачивают и обычно сохраняют один и тот же интерфейс. Декоратор *добавляет* обязанности (регистрация, повтор, шифрование). Прокси *управляет* доступом (отложенная инициализация, защита, удаленная заглушка, кеш) и не предназначен для обогащения общедоступного API.
- **ДжС `Proxy` против шаблона** — `new Proxy(target, handler)` — это языковой инструмент, который перехватывает операции (`get`, `set`, …). С его помощью вы можете реализовать GoF Proxy *или* Decorator. Использование реактивности Vue 3 `Proxy`.

**How it works:**

| Использование | Узор |
|-----|---------|
| Сервер `snake_case` / вложенная полезная нагрузка ≠ приложение `camelCase` DTO | Адаптер |
| Шестиугольный / порты: Prisma, Stripe, Express работают во внешнем слое **адаптера** | Адаптер |
| Один и тот же многошаговый танец SDK, скопированный в нескольких местах | Фасад |
| Сквозные дополнительные возможности: журнал, метрики, кеш, `throttle` / `debounce` | Декоратор |
| Проверка/задержка/отказ перед реальным объектом (аутентификация, отложенная проверка, защита вставки DOM) | Прокси |

```js
// Adapter — foreign shape → our shape. Callers never see snake_case.
function toUser(dto) {
  return { id: dto.ID, name: dto.user_name };
}
toUser({ ID: '1', user_name: 'Ada' }); // { id: '1', name: 'Ada' }
```

```js
// Facade — one function runs several subsystem steps. UI calls brew(), not 4 SDK methods.
function brew(machine) {
  machine.grind();
  machine.heat();
  machine.pour();
  return machine.cup();
}
```

```js
// Decorator — same function, extra behavior before/after. update itself stays clean.
const withLog = (fn) => (...args) => {
  console.log('call', args);
  return fn(...args);
};
const save = (user) => { /* write */ };
const saveLogged = withLog(save);
saveLogged({ id: 1 }); // logs, then save
```

```js
// Proxy — same property names; trap decides what happens. original.secret stays readable.
const user = { name: 'Ada', secret: 'x' };
const gate = new Proxy(user, {
  get(t, key, r) {
    if (key === 'secret') return undefined;
    return Reflect.get(t, key, r);
  },
});
gate.name;   // 'Ada'
gate.secret; // undefined
```

**Thoughts:** Адаптер **переводит**. Фасад **упрощается**. Декоратор **добавляет**. Прокси **ворота**.

**See also:** [Адаптер](#адаптер) · [Фасад](#фасад) · [Декоратор](#декоратор) · [Прокси](#прокси) · [JS `Proxy`](./3_js_oop.md#proxy-and-reflect) · [Шестиугольные адаптеры](./7_special_architecture.md#clean-architecture--hexagonal)

**Sources:**

[Гуру рефакторинга — отношения адаптера](https://refactoring.guru/design-patterns/adapter) · [Декоратор](https://refactoring.guru/design-patterns/decorator) · [Фасад](https://refactoring.guru/design-patterns/facade) · [Прокси](https://refactoring.guru/design-patterns/proxy) · [MDN `Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

---

</details>

<details>
  <summary>Behavioral patterns — cheat sheet</summary>

<a name="behavioral-patterns--cheat-sheet"></a>

### Behavioral patterns — cheat sheet

**Definition:**

Поведенческие модели отвечают на вопрос: «Кто что делает и как разговаривает?» — они разделяют **ответственность** и **общение**, а не создание или сборку объектов.

| Узор | Одна линия | Поменяйтесь местами в своей голове |
|---------|----------|-------------------|
| **Стратегия** | Та же работа, другой алгоритм; выбрать (и поменять местами) во время выполнения | Навигатор: прогулка/велосипед/поезд || **Цепочка ответственности** | Запрос обходит обработчики до тех пор, пока **один** не сможет его обработать | Начисление доллара США против евро против рубля |
| **Команда** | Действие + данные становятся объектом, который можно ставить в очередь, регистрировать и отменять | Редукторное действие `{ type, payload }` |
| **Наблюдатель** | Субъект уведомляет всех, кто подписался; список может измениться | Вакансия → подбор кандидатов |

**How it works:**

- **Стратегия против CoR** — Стратегия: вызывающий абонент *выбирает* алгоритм. CoR: звонивший *не знает*, кто будет отвечать; порядок обработчиков решает.
- **CoR против `switch`** — `switch` работает, когда все случаи известны и принадлежат здесь (редюсеры Redux). CoR выигрывает, когда обработчики, порядок или варианты неизвестны или подключаются позже — диспетчер не импортирует каждый обработчик.
- **CoR против промежуточного программного обеспечения** — Doka: промежуточное программное обеспечение позволяет запускать **каждую** ссылку (аутентификация → журнал → обработчик). Canonical CoR: **один** обработчик обрабатывает запрос и останавливается. Refactoring Guru по-прежнему рассматривает промежуточное программное обеспечение как CoR с перевернутым принципом «всегда вызывать». `next()` если ты не остановишься».
- **Null Object** — тот же интерфейс, ничего не делает. Использовать как `switch` `default` или терминатор цепочки, чтобы звонящие пропускали вызов `if (handler)`.
- **Command vs Observer** — Команда представляет собой *однократный* инкапсулированный запрос (вызыватель → `execute`). У Observer *действующая* подписка (`attach` / `detach` / `notify`).

| Использование | Узор |
|-----|---------|
| Алгоритм может измениться во время работы приложения | Стратегия |
| Неизвестные/обработчики плагинов; не связывайте диспетчера со всеми ними | КОР |
| Отмена, очередь, история, дополнительная полезная нагрузка для действия | Команда |
| Неизвестно, сколько слушателей; подписка временная | наблюдатель |

**Thoughts:** Назовите *проблему* (поменяйте алгоритм / продолжайте до тех пор, пока не будет обработано / повторите действие / уведомите многих). Шаблон — это словарный запас, а не количество классов.

**Sources:** [Doka — Поведенческие шаблоны](https://doka.guide/tools/design-patterns-behaviorial/) · [Гуру рефакторинга — Каталог](https://refactoring.guru/design-patterns/catalog)

</details>

<details>
  <summary>Observer</summary>

### Observer

**Definition:** Субъект уведомляет наблюдателей об изменении состояния — зависимость «один ко многим».

**When to use:** События DOM, подписки Redux, публикация/подписка, `EventEmitter`.

**Pluses and minuses:**

| + | − |
|------|------|
| Ослабленная связь | Порядок уведомления имеет значение |
| Интерфейсы, управляемые событиями | Утечки памяти, если забыли отписаться |

**Examples:**

```js
class Store {
  #listeners = new Set();
  subscribe(fn) { this.#listeners.add(fn); return () => this.#listeners.delete(fn); }
  notify(data) { this.#listeners.forEach(fn => fn(data)); }
}
```

**Thoughts:**

Реагировать `useEffect` очистка-это наблюдатель отписаться.

---

</details>

<details>
  <summary>Factory / Factory Method</summary>

<a name="factory--factory-method"></a>

### Factory / Factory Method

**Definition:** Инкапсулируйте создание объекта, чтобы вызывающий объект не знал имен полей, значений по умолчанию, дополнительных поисков или того, является ли результат простым объектом или `new Class()`.

**How it works:**

**Простая фабрика** — это функция, которая возвращает объекты одинаковой формы (`createGuitar(6)`, `createSpending(amount)`). **Фабричный метод** (GoF) откладывается `new` в подкласс. Оба хранят правила построения в одном месте — если меняется схема продукта, меняется только фабрика.

Doka: используйте фабрику, когда создание занимает более 1–2 строк, особенно если вы сначала что-то **вычисляете** (дерево грифа из максимального веса). Сайты звонков остаются `createGuitar(6)` даже если ты позже вернешься `new Guitar(...)`.

**When to use:**

Логика построения/умолчания/проверка; много похожих объектов; `createParser('json')`; тестовые двойки. Пропустить `{ id }` литералы.

#### Common pitfalls

Фабричная упаковка каждого предмета («шаблональная лихорадка»). Путаница простой фабрики с фабричным методом/абстрактной фабрикой.

**Pluses and minuses:**

| + | − |
|------|------|
| Скрывает сложность конструкции | Дополнительная косвенность |
| Централизует настройки по умолчанию (например. `dateTime: Date.now()`) | Чрезмерная фабрикация простых DTO |
| Меньше опечаток, чем при дублировании литералов объектов | Нет `instanceof` если вы не поделитесь прототипом/`class` |

**Examples:**

```js
// 1) Construction logic — Doka: compute a field, hide the rest of the recipe
function createGuitar(stringsCount = 6, maxWeight = 5) {
  const fretBoardMaterial = maxWeight <= 5 ? 'fir' : 'cedar';
  return { stringsCount, fretsCount: 24, fretBoardMaterial, boardMaterial: 'maple' };
}
createGuitar(6);     // light guitar → fir
createGuitar(7, 9);  // heavy → cedar
```

```js
// 2) Many similar objects — defaults (timestamp, kind) in one place
function createSpending(amount) {
  return { amount, dateTime: Date.now(), kind: 'spending' };
}
const spending1 = createSpending(250);
const spending2 = createSpending(100);
```

```js
// 3) Pick implementation by type — simple factory (not Factory Method)
function createParser(kind) {
  if (kind === 'json') return (text) => JSON.parse(text);
  if (kind === 'csv') return (text) => text.split(',').map((s) => s.trim());
  throw new Error(`Unknown parser: ${kind}`);
}
createParser('json')('{"a":1}'); // { a: 1 }
createParser('csv')('a, b');     // ['a', 'b']
```

```js
// 4) Test double — same factory, fake in tests
function createLogger(env) {
  if (env === 'test') return { info: () => {} };
  return { info: (msg) => console.log(msg) };
}
createLogger('prod').info('up');
createLogger('test').info('silent');
```

```js
// 5) Factory Method (GoF) — subclass decides which class is born
class Department {
  hire(id) {
    const employee = this.createEmployee(id);
    employee.start();
    return employee;
  }
  createEmployee(id) { throw new Error('override me'); }
}
class ITDepartment extends Department {
  createEmployee(id) {
    return { id, role: 'programmer', start() {} };
  }
}
class AccountingDepartment extends Department {
  createEmployee(id) {
    return { id, role: 'accountant', start() {} };
  }
}
new ITDepartment().hire(1).role;          // 'programmer'
new AccountingDepartment().hire(2).role; // 'accountant'
```

**Thoughts:**

Заводов достаточно для небольших объектов. Вырасти в `class` когда тебе нужно `this` или методы, которые должны оставаться на объекте. См. [3_js_oop.md — фабрика](./3_js_oop.md).

Знание того, *как* строить жизнь в одной функции.

**Sources:**

[Doka — Шаблоны создания](https://doka.guide/tools/design-patterns-creational/) · [Doka — ООП](https://doka.guide/tools/oop/) · [Гуру рефакторинга — Сравнение фабрик](https://refactoring.guru/design-patterns/factory-comparison)

---

</details>

<details>
  <summary>Abstract Factory</summary>

<a name="abstract-factory"></a>

### Abstract Factory

**Definition:** Интерфейс для создания **семейства** связанных продуктов без указания конкретных классов — «фабрика фабрик». Он возвращает абстракции (`Instrument`, `Musician`), ни одного жестко запрограммированного типа.

**How it works:**

Долевой договор (`ReservationFactory { reserveInstrument(); notifyPlayer(); }`). Каждая семья (скрипка, виолончель) выполняет этот контракт. Клиент `reserve(factory)` никогда `instanceof`с. Добавить альт → новый класс, а не новую ветку в `reserve()`.

Гуру рефакторинга: одна фабрика производит соответствующие продукты (кнопка Windows + флажок Windows). Сложнее добавить *новый тип продукта* (каждая фабрика приобретает свой метод).

**When to use:**

Связанные, но неидентичные объекты с одинаковыми этапами создания (зарезервировать + уведомить; тематические наборы пользовательского интерфейса).

#### Common pitfalls

Типы союзов + `instanceof` вместо общего заводского интерфейса — хрупкого, когда оркестр растет.

**Pluses and minuses:**

| + | − |
|------|------|
| Совместимые семейства продуктов | Множество интерфейсов/классов |
| Клиентский код остается на абстракциях | Добавление нового вида продукции затронет все фабрики |
| Нет `instanceof` деревья | Перебор для одного типа продукта |

**Examples:**

```js
// 1) Orchestra family — same API, different products. Client has no instanceof.
class Violin {
  playNote(note) { return `violin ${note}`; }
}
class Cello {
  playNote(note) { return `cello ${note}`; }
}
class Violinist {
  instrument = new Violin();
  play(piece) { return piece.map((n) => this.instrument.playNote(n)); }
}
class Cellist {
  instrument = new Cello();
  play(piece) { return piece.map((n) => this.instrument.playNote(n)); }
}

class ViolinReservation {
  reserveInstrument() { return new Violin(); }
  notifyPlayer() { return new Violinist(); }
}
class CelloReservation {
  reserveInstrument() { return new Cello(); }
  notifyPlayer() { return new Cellist(); }
}

function reserve(factory) {
  const player = factory.notifyPlayer();
  factory.reserveInstrument();
  return player;
}
reserve(new ViolinReservation()).play(['A', 'C']); // ['violin A', 'violin C']
reserve(new CelloReservation()).play(['A', 'C']);  // ['cello A', 'cello C']
```

```js
// 2) Themed UI kit — button + input stay in the same family (dark vs light)
const lightUi = {
  button: (label) => ({ kind: 'button', theme: 'light', label }),
  input: (name) => ({ kind: 'input', theme: 'light', name }),
};
const darkUi = {
  button: (label) => ({ kind: 'button', theme: 'dark', label }),
  input: (name) => ({ kind: 'input', theme: 'dark', name }),
};

function loginForm(ui) {
  return { submit: ui.button('Log in'), email: ui.input('email') };
}
loginForm(lightUi).submit.theme; // 'light'
loginForm(darkUi).email.theme;   // 'dark'
```

**Thoughts:** Вы создаете *типы продуктов*, а не `new Violin()` в клиенте.

**Sources:**

[Doka — Шаблоны создания](https://doka.guide/tools/design-patterns-creational/) · [Гуру рефакторинга — Абстрактная фабрика](https://refactoring.guru/design-patterns/abstract-factory)

---

</details>

<details>
  <summary>Builder</summary>

<a name="builder"></a>

### Builder

**Definition:** Создайте сложный объект **шаг за**, используя дополнительные части, а затем `build()`. Один и тот же процесс построения может привести к разным представлениям.

**How it works:**

Строитель хранит настройки. Каждый `addX()` / `setX()` мутирует и ** возвращается `this`** (свободная цепь). `build()` производит продукт. Гуру рефакторинга: убивает **телескопические конструкторы** (`Pizza(size)`, `Pizza(size, cheese)`, `Pizza(size, cheese, pepperoni)`…). Директор (необязательно) выполняет фиксированную последовательность шагов.

В отличие от других творческих шаблонов, Builder может создавать продукты, которые **не имеют общего** одного интерфейса (автомобиль и руководство по одним и тем же этапам).

**When to use:**

Множество дополнительных ингредиентов/полей (кофейный напиток, HTTP-запрос, запрос, тестовые данные). Процесс разбивается на именованные шаги.

#### Common pitfalls

Строитель, когда достаточно фабрики с двумя аргументами. Забывчивость `return this` разрывает цепочку.

**Pluses and minuses:**

| + | − |
|------|------|
| Читаемая дополнительная конфигурация | Подробное описание для объектов с двумя полями |
| Избегает конструкторов с логическими флагами | Изменяемый конструктор при повторном использовании без `reset()` |
| Те же шаги, разные продукты | |

**Examples:**

```js
// 1) Coffee drink — optional ingredients, fluent chain (Doka)
class DrinkBuilder {
  settings = { base: 'espresso' };
  addMilk() { this.settings.milk = true; return this; }
  addSugar() { this.settings.sugar = true; return this; }
  addCream() { this.settings.cream = true; return this; }
  build() { return { ...this.settings }; }
}
const latte = new DrinkBuilder().addMilk().build();
const extra = new DrinkBuilder().addSugar().addCream().build();
```

```js
// 2) HTTP request — skip unused options instead of fetch(url, { method, headers, body, … })
class RequestBuilder {
  #url = '';
  #init = { method: 'GET', headers: {} };
  url(value) { this.#url = value; return this; }
  method(value) { this.#init.method = value; return this; }
  header(key, value) { this.#init.headers[key] = value; return this; }
  json(body) {
    this.#init.body = JSON.stringify(body);
    return this.header('Content-Type', 'application/json').method('POST');
  }
  build() { return { url: this.#url, ...this.#init }; }
}
new RequestBuilder().url('/api/users').json({ name: 'Ada' }).build();
// { url: '/api/users', method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"name":"Ada"}' }
```

```js
// 3) Query / test data — named steps, no telescoping constructor
class UserBuilder {
  #user = { name: 'anon', role: 'user', active: true };
  name(value) { this.#user.name = value; return this; }
  admin() { this.#user.role = 'admin'; return this; }
  inactive() { this.#user.active = false; return this; }
  build() { return { ...this.#user }; }
}
new UserBuilder().name('Ada').admin().build();
// { name: 'Ada', role: 'admin', active: true }
```

**Thoughts:** Сначала шаги, потом объект — `build()` единственный `new`.

**Sources:**

[Doka — Шаблоны создания](https://doka.guide/tools/design-patterns-creational/) · [Гуру рефакторинга — Builder](https://refactoring.guru/design-patterns/builder)

---

</details>

<details>
  <summary>Strategy</summary>

### Strategy

**Definition:** Семейство взаимозаменяемых алгоритмов за одним интерфейсом.

**When to use:** Сортировка компараторов, правила ценообразования, стратегии проверки, способы оплаты.

**Pluses and minuses:**

| + | − |
|------|------|
| Замена алгоритма времени выполнения | Дополнительные классы/функции |
| Совместимость с OCP | |

**Examples:**

```js
const strategies = {
  stripe: (amount) => chargeStripe(amount),
  paypal: (amount) => chargePayPal(amount),
};
strategies[provider](total);
```

---

</details>

<details>
  <summary>Singleton (caution)</summary>

<a name="singleton-caution"></a>

### Singleton (caution)

**Definition:** Шаблон создания, обеспечивающий существование **только одного экземпляра**; более поздняя попытка создания возвращает существующий объект. Предоставляет глобальную точку доступа.

**How it works:**

- Типичная форма класса: статический частный `#instance`; конструктор возвращает существующий экземпляр (Doka `Sun`) или частный актер + `getInstance()`.
- В JS **область модуля** (`export const db = createPool()`), естественно, дает один экземпляр для каждого процесса — идиоматический синглтон без церемоний.
- Риск: скрытое глобальное изменяемое состояние, общее для всех тестов и запросов. Refactoring Guru: те же недостатки, что и у глобальных переменных — менее модульные, модульные тесты требуют наличия синглтона.

Doka: может нарушать **открытие/закрытие**, увеличивать связанность — иногда рассматривается как антишаблон. Отдайте предпочтение дизайну, который в этом не нуждается.Шаблон Singleton (ограниченное количество) и DI **время существования синглтона** (один и тот же экземпляр внедряется в зависимые объекты). Различные механизмы (Дока).

**When to use:** Редко во внешнем интерфейсе — предпочитают область видимости модуля или контейнер DI. Сервер: пул БД, конфигурация, логгер. **Избегайте** одиночных элементов бизнес-логики с изменяемым состоянием сеанса. Домен «только одно Солнце» — это учебник, да, но все же подумайте дважды.

**Pluses and minuses:**

| + | − |
|------|------|
| Контролируемая глобальная точка доступа | Скрытое глобальное состояние — трудно проверить |
| Ленивая инициализация экономит ресурсы | Плотная привязка к конкретному экземпляру |
| Один пул соединений/объект конфигурации | Проблемы параллелизма в многопоточных средах (Java) |
| | Нарушает DIP, если вызывающие абоненты не могут ввести альтернативы |

**Examples:**

```js
// 1) Domain uniqueness — Doka Sun: later new returns the same object
class Sun {
  static #instance = null;
  constructor() {
    if (Sun.#instance) return Sun.#instance;
    Sun.#instance = this;
  }
}
const a = new Sun();
const b = new Sun();
a === b; // true
```

```js
// 2) Idiomatic JS — one module export per process (config / logger / pool)
// config.js
export const config = Object.freeze({ apiUrl: process.env.API_URL ?? '/api' });
// importers share the same binding — no class Singleton needed
```

```js
// 3) Logger registry — one shared object; still prefer injecting it in tests
class Logger {
  static #instance = null;
  #lines = [];
  constructor() {
    if (Logger.#instance) return Logger.#instance;
    Logger.#instance = this;
  }
  info(msg) { this.#lines.push(msg); }
  dump() { return this.#lines.slice(); }
}
new Logger().info('boot');
new Logger().dump(); // ['boot'] — same instance
```

```js
// 4) Not the same as DI singleton — container reuses one instance when injecting
function createApp({ logger = new Logger() } = {}) {
  return { log: (msg) => logger.info(msg) };
}
const logger = new Logger();
const appA = createApp({ logger });
const appB = createApp({ logger });
// both apps share logger because we passed it — not because of a global getInstance()
```

**Thoughts:**

Класс GoF Singleton часто является **анти-шаблоном** в тестах — вместо этого внедряйте зависимости. Интервью: главное возражение — проверяемость.

Один экземпляр — это последнее средство, а не значение по умолчанию.

**Sources:**

[Doka — Шаблоны создания](https://doka.guide/tools/design-patterns-creational/) · [Гуру рефакторинга — Singleton](https://refactoring.guru/design-patterns/singleton)

---

</details>

<details>
  <summary>Facade</summary>

<a name="facade"></a>

### Facade

**Definition:** Структурный шаблон, обеспечивающий **упрощенный интерфейс** для сложной подсистемы — одна точка входа скрывает множество внутренних классов/API.

**How it works:**

- Звонки клиентов `facade.doThing()` вместо того, чтобы организовывать `auth()`, `retry()`, `parse()`, `cache()` сам.
- Фасад **делегирует** компонентам подсистемы — он не дублирует их логику.
- Можно объединить устаревшие API, сторонние SDK или вызовы микросервисов в один стабильный контракт.
- Риск: фасад превращается в объект-бог, если он накапливает бизнес-логику вместо делегирования.

Звонящие пишут `getUser('42')` or `heatWater(machine)` вместо повторения обновления токена + выборки + анализа или `turnOn` / `getWater` / ступеньки обогревателя. Фасад **владеет последовательностью**; кофемашина/стек HTTP остаются немыми.

**When to use:** `apiClient.getUser()` обновление аутентификации + выборка + повтор + анализ JSON; `paymentService.charge()` над Страйпом; кофемашина `heatWater()` над `turnOn` / `getWater` / `turnOnHeater`; Хуки React, объединяющие несколько операций чтения контекста.

**Pluses and minuses:**

| + | − |
|------|------|
| Упрощенный API для потребителей | Может стать фасадом бога, если закрадется логика |
| Скрывает устаревшие или сложные внутренние компоненты | Дополнительный слой для поддержания |
| Стабильная общедоступная поверхность во время рефакторинга подсистемы | Может скрыть необходимый низкоуровневый контроль |

**Examples:**

```js
// Facade over fetch + auth + error handling
export async function getUser(id) {
  const token = await auth.refreshIfNeeded();
  const res = await fetch(`/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new ApiError(res.status);
  return res.json();
}

const user = await getUser('42');

// Same idea: many atomic SDK calls → one use case
function heatWater(machine) {
  machine.turnOn();
  while (machine.getWaterLevel() < 1000) machine.getWater();
  machine.turnOnHeater();
  if (machine.getTemperature() >= 90) machine.turnOffHeater();
}
```

**Thoughts:** Фасад ≠ Адаптер (изменяет интерфейс в соответствии с клиентом) или Прокси (управляет доступом). Фасад упрощает **многие** вызовы до **одного**. Это может сделать неудобный API удобным для использования, но это побочный эффект — работа заключается в инкапсуляции повторяющегося рабочего процесса. Не позволяйте этому стать объектом Бога.

**Sources:**

[refactoring.guru — Фасад](https://refactoring.guru/design-patterns/facade)

---

</details>

<details>
  <summary>Adapter</summary>

<a name="adapter"></a>

### Adapter

**Definition:** Структурный шаблон, преобразующий один интерфейс в другой, **ожидаемый клиентом**, — оборачивает несовместимый API, поэтому существующий код работает без изменений.

**How it works:**

- **Target** — интерфейс, который ожидает клиент.
- **Adaptee** — устаревший или сторонний API другой формы.
- **Адаптер** — переводит звонки: `target.method()` → `adaptee.oldMethod()` с сопоставлением аргументов/ответов.
- Адаптер объекта (композиция) против адаптера класса (наследование) — композиция предпочтительна в JS.

`fakeAPI()` является адаптируемым (вложенным `entries`, `user_name`, `ID`). `responseToWantedAdapter` это единственное место, которое знает это отображение. Остальная часть приложения получает `{ userName, email, id }[]` — если сервер переименовывает поле, вы меняете адаптер, а не каждый экран.

**When to use:** Сервер JSON использует `user_name` / `ID` пока пользовательский интерфейс хочет `camelCase`; обернуть старый REST при переходе на GraphQL; адаптировать узел `fs` обратные вызовы к обещаниям; нормализовать платежные системы, чтобы `PaymentResult`; `axios` адаптер для `fetch`-образный код.

**Pluses and minuses:**

| + | − |
|------|------|
| Повторное использование существующего кода с новыми интерфейсами | Тонкие адаптеры могут накапливаться |
| Чистая интеграция сторонних SDK | Картографический слой может отставать от обновлений API |
| Изолировать наследие от современных модулей | Дополнительная косвенность |

**Examples:**

```js
function fakeAPI() {
  return {
    entries: [
      { user_name: 'Ada', email_address: 'a@x.com', ID: '1' },
    ],
  };
}

function responseToWantedAdapter(response) {
  return response.entries.map((entry) => ({
    userName: entry.user_name,
    email: entry.email_address,
    id: entry.ID,
  }));
}

const compatible = responseToWantedAdapter(fakeAPI());
// [{ userName: 'Ada', email: 'a@x.com', id: '1' }]
```

**Thoughts:** Адаптер меняет **интерфейс**; Декоратор добавляет **поведение** в тот же интерфейс. В чистой/шестиугольной архитектуре адаптеры занимают внешний уровень (DB, HTTP, UI), поэтому домен никогда не зависит от сторонних форм.

**Sources:**

[refactoring.guru — Адаптер](https://refactoring.guru/design-patterns/adapter)

---

</details>

<details>
  <summary>Decorator</summary>

<a name="decorator"></a>

### Decorator

**Definition:** Структурный шаблон, который **обертывает** объект для динамического добавления поведения без создания подклассов — тот же интерфейс, расширенная функциональность.

**How it works:**

- Декоратор реализует тот же интерфейс, что и обернутый объект.
- Делегирует внутренний объект, добавляя логику до/после (ведение журнала, кеширование, аутентификация).
- Сложите несколько декораторов: `withAuth(withCache(withRetry(api)))`.
- В React: **Компоненты высшего порядка (HOC)** и компоненты-обертки похожи на декораторы.

`loggingDecorator` это HOF: это занимает `update` и возвращается `wrapped`. `wrapped` logs, затем вызывает оригинал с теми же аргументами. Вы **не** редактировали `update`. Вы можете сложить больше оберток (`debounce(loggingDecorator(update))`) таким же образом.

**When to use:** Промежуточное программное обеспечение для ведения журналов/метрик; `memoize()`; Реагировать HOC `withAuth(Component)`; Промежуточное программное обеспечение Express/Redux; кэширование в репозиториях; **`throttle` / `debounce`** как оболочки функций ([JS Functions](./3_js_functions.md)).

**Pluses and minuses:**

| + | − |
|------|------|
| Открыто/закрыто — расширить без изменения исходного | Множество оберток → трудно отследить стек вызовов |
| Создание поведения во время выполнения | Порядок декораторов имеет значение |
| Альтернатива глубоким деревьям наследования | Может скрыть то, что на самом деле работает |

**Examples:**

```js
function loggingDecorator(fn) {
  return function wrapped(...args) {
    console.log(`log: ${args.join(', ')}`);
    return fn(...args);
  };
}

const user = { name: 'Ada', email: 'a@x.com' };
function update(name, email) {
  user.name = name;
  user.email = email;
}

const updateWithLogging = loggingDecorator(update);
updateWithLogging('Maria', 'm@x.com');
// console: "log: Maria, m@x.com" — then user becomes { name: 'Maria', email: 'm@x.com' }
```

**Thoughts:** Машинопись `experimentalDecorators` Декораторы stage-3 формализуют это для классов — *шаблон* более старый и работает как HOF в JS. Декоратор против прокси: декоратор — это явная оболочка, которая *добавляет* поведение; Прокси GoF *закрывает* оригинал. Укладка (`EncryptionDecorator(CompressionDecorator(file))`) — изображение GoF.

**Sources:**

[refactoring.guru — Декоратор](https://refactoring.guru/design-patterns/decorator)

---

</details>

<details>
  <summary>Proxy</summary>

<a name="proxy"></a>

### Proxy

**Definition:** Структурный шаблон, который предоставляет **суррогат** с **тот же интерфейс**, что и реальный объект, поэтому клиент взаимодействует с прокси-сервером, а прокси-сервер решает, когда (и нужно ли) достичь оригинала.

**How it works:**

- Клиент зависит от целевого интерфейса; прокси-сервер пересылает, задерживает, кэширует или отклоняет.
- Распространенные виды: **виртуальный** (отложенное создание), **защита** (аутентификация), **удаленный** (заглушка RPC), **кэширование**.
- В JS, `new Proxy(target, handler)` перехватывает операции через ловушки. `handler.get(target, property, receiver)` бежит дальше `proxy.foo`. Использовать `Reflect.get(target, property, receiver)` по умолчанию `[[Get]]` поведение (MDN).
- Исходный объект может остаться нетронутым; только прокси «странный».

Чтения проходят `get`. Ловушка блокируется `ssn` на **только прокси**. `Reflect.get` это значение по умолчанию `[[Get]]` (MDN), поэтому другие поля по-прежнему поступают из `original`. Это **защитный прокси**: те же ключи, закрытый доступ — не новый DTO (адаптер) и не дополнительное ведение журнала, обернутое функцией (декоратором).

**When to use:** Скрывать `ssn` на пользовательском объекте; ленивая инициализация тяжелого модуля; кэш `getUser`; проверьте условия перед вставкой узла DOM; Vue реактивность.

**Pluses and minuses:**

| + | − |
|------|------|
| Ленивая загрузка, контроль доступа, кеш, журналирование без изменения реального объекта | Дополнительный хмель; отладка через ловушки сложнее |
| Прозрачно для вызывающих абонентов, которые уже используют целевой API | `Proxy` ловушки имеют инварианты (например, незаписываемые реквизиты данных) |
| Родной `Proxy` как читает треки Vue 3 | Накладные расходы на горячие пути |

**Examples:**

```js
const original = { name: 'Maria', email: 'hi@site.com', ssn: '000' };

const proxied = new Proxy(original, {
  get(target, prop, receiver) {
    if (prop === 'ssn') throw new Error('Access denied');
    console.log(`get ${String(prop)}`);
    return Reflect.get(target, prop, receiver);
  },
});

proxied.name;  // logs "get name", then 'Maria'
proxied.ssn;   // throws 'Access denied'
original.ssn;  // still '000' — the real object is not mutated
```

**Thoughts:** Прокси-сервер GoF не существует для *изменения публичного поведения продукта*, как это делает Декоратор — он *опосредует*. Демо-версия в стиле статьи, которая возвращает `'YOU HAVE BEEN PWND!'` ибо каждое поле — это перехват, а не типичный производственный прокси. Язык `Proxy` ≠ всегда шаблон проектирования.

**Sources:**

[refactoring.guru — Прокси](https://refactoring.guru/design-patterns/proxy) · [MDN `Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) · [MDN `handler.get`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/get)

---

</details>

<details>
  <summary>Mediator</summary>

### Mediator

**Definition:** Поведенческий шаблон — определяет объект, который **централизует** взаимодействие других объектов, поэтому компоненты не ссылаются друг на друга напрямую.

**How it works:**

- Коллеги отправляют сообщения **Медиатору**, а не друг другу.
- Медиатор маршрутизирует сообщения, координирует состояние, запускает побочные эффекты.
- Противоположность тому, чтобы каждый компонент содержал ссылки на любой другой компонент.

| Узор | Соединение | Роль посредника |
|---------|----------|---------------|
| **Прямые звонки** | А знает Б, С | Нет |
| **Посредник** | А знает только Посредник | Координатор процесса || **Паб/подписка** | Издатель знает только брокера | Брокер часто является посредником + асинхронный транспорт |

Наблюдатель — субъект хранит список наблюдателей и уведомляет напрямую. Медиатор — коллеги развязаны; только посредник знает граф.

Посредник координирует **в процессе** коммуникации. Saga координирует **распределенные транзакции** между услугами с помощью компенсаций.

**When to use:**

- Чат/групповой обмен сообщениями — пользователи общаются через объект комнаты.
- Пользовательский интерфейс управления воздушным движением — множество форм/диалогов, координируемых одним диспетчером.
- **NestJS** — `CommandBus`, `EventBus`, `QueryBus` (модуль CQRS).
- **Redux** — храните посредники между действиями и редукторами (компоненты не вызывают друг друга).

**Pluses and minuses:**

| + | − |
|------|------|
| Уменьшает запутанные зависимости (N×N → N) | Посредник может стать объектом-богом |
| Единое место для изменения правил взаимодействия | Дополнительная косвенность |
| Компоненты остаются сосредоточенными на своей работе | |

**Examples:**

```ts
interface Mediator {
  notify(sender: object, event: string, payload?: unknown): void;
}

class ChatRoom implements Mediator {
  private users = new Map<string, User>();

  register(user: User) {
    this.users.set(user.name, user);
    user.setMediator(this);
  }

  notify(sender: User, event: string, payload?: unknown) {
    if (event === 'message') {
      for (const user of this.users.values()) {
        if (user !== sender) user.receive(payload as string);
      }
    }
  }
}
```

**Thoughts:** Используйте, когда объектная связь «многие ко многим» создает спагетти — централизуйте маршрутизацию, сохраняйте конечные точки «незаметными».

**Sources:** [Гуру рефакторинга — Медиатор](https://refactoring.guru/design-patterns/mediator)

</details>

<details>
  <summary>Chain of Responsibility</summary>

### Chain of Responsibility

**Definition:** Передавайте запрос через связанные обработчики до тех пор, пока **один** не обработает его (или цепочка не закончится). Каждый обработчик знает только `setNext` / `handle`, а не полный набор братьев и сестер.

**When to use:** Набор обработчиков, порядок или варианты **не все известны** заранее. Если набор закрыт и принадлежит одному файлу, `switch` достаточно (высшая связь).

**Pluses and minuses:**

| + | − |
|------|------|
| Вызывающему объекту не нужно импортировать каждый обработчик или знать их порядок | Запрос может «отвалиться» на конце |
| Подключаем обработчики не переписывая диспетчер | Порядок и стоп-продолжение должны быть явными |

**Examples:**

```ts
abstract class Handler {
  protected next?: Handler;
  setNext(h: Handler) { this.next = h; return h; }
  handle(currency: string, amount: number) {
    this.next?.handle(currency, amount) ?? console.log('No handler');
  }
}
class UsdHandler extends Handler {
  handle(currency: string, amount: number) {
    if (currency === 'USD') return console.log(`charged ${amount}$`);
    super.handle(currency, amount);
  }
}
// rub.setNext(usd).setNext(eur) — start from any link that is connected
```

**Thoughts:** **Null Object** = тот же интерфейс, неактивен — полезен как `default` в `switch`. **Промежуточное ПО** обычно позволяет запускать *каждый* уровень (`next()`); Doka рассматривает это как нечто похожее, но не то же самое. Гуру рефакторинга: промежуточное программное обеспечение по-прежнему представляет собой CoR с инвертированным продолжением/остановкой.

**Sources:** [Doka — Поведенческий подход](https://doka.guide/tools/design-patterns-behaviorial/) · [Гуру рефакторинга — Цепочка ответственности](https://refactoring.guru/design-patterns/chain-of-responsibility)

</details>

<details>
  <summary>Command</summary>

### Command

**Definition:** Превратите действие (и необходимые ему данные) в объект, чтобы вы могли отложить его, поставить в очередь, записать в журнал или отменить его — вызовы инициатора `execute` не зная внутренностей приемника.

**When to use:** Операция требует дополнительной полезной нагрузки; буфер/очередь/история действий; **отменить**.

**Pluses and minuses:**

| + | − |
|------|------|
| Отмена / история / очередь заданий | Дополнительные типы |
| Invoker отделен от того, *как* выполняется работа | Легко поддавать команды простым щелчком мыши |

**Examples:**

```ts
// Classic: command *is* the handler
const updateUser = { execute(payload: User) { /* mutate / API */ } };

// Common split (Redux / CQRS): data object + handler outside
const action = { type: 'UPDATE_USER', payload: { name: 'Alex' } };
function userReducer(state, action) {
  if (action.type === 'UPDATE_USER') return { ...state, ...action.payload };
  return state;
}
```

**Thoughts:** **действия** Redux — это команды *данные*; редуктор — это обработчик (не внутри действия). «Сценарии использования» прикладного уровня часто используют `Command` + `CommandHandler`.

**Sources:** [Doka — Поведенческий подход](https://doka.guide/tools/design-patterns-behaviorial/) · [Гуру рефакторинга — Команда](https://refactoring.guru/design-patterns/command)

</details>

<details>
  <summary>State</summary>

### State

**Definition:** Разрешить объекту изменять свое поведение при изменении его внутреннего состояния — создается впечатление, что объект меняет свой класс.

**When to use:** Механизмы рабочих процессов, состояния TCP-соединения, медиаплеер (воспроизведение/приостановка/остановка), жизненный цикл заказа.

**Pluses and minuses:**

| + | − |
|------|------|
| Устраняет большие условные предложения | Многие государственные классы |
| Явные переходы между состояниями | Излишнее убийство для нескольких штатов |

**Examples:**

```ts
type OrderState = { submit(order: Order): void };
const draft: OrderState = {
  submit(order) { order.state = pending; order.notifyWarehouse(); },
};
const pending: OrderState = {
  submit() { throw new Error('Already submitted'); },
};
```

**Thoughts:** Состояние против стратегии. Переходы между состояниями являются внутренними и часто определяют допустимые следующие состояния. Стратегия выбирается внешне и взаимозаменяема.

</details>

<details>
  <summary>Repository</summary>

### Repository

**Definition:** Шаблон, который **посредствует между логикой предметной области и сопоставлением данных** — интерфейс, похожий на коллекцию, для объектов предметной области, скрывающий детали персистентности (SQL, ORM, API).

**How it works:**

- Вызовы кодов домена/услуги `userRepo.findById(id)` — а не сырой SQL или Prisma напрямую.
- Репозиторий реализует запросы CRUD + домена (`findByEmail`, `save`).
- Заменяемые серверные части: репозиторий Postgres, репозиторий в памяти для тестов, репозиторий ложного API.
- Часто по одному репозиторию на совокупный корень (Пользователь, Заказ).

**When to use:** Сервисный уровень в бэкэнде; модули доступа к внешним данным (`userApi` с последовательным интерфейсом); тестирование бизнес-правил без базы данных; Обертки репозитория Prisma/TypeORM.

**Pluses and minuses:**

| + | − |
|------|------|
| Тестируемая доменная логика с подделками в памяти | Дополнительная абстракция над ORM |
| Централизованная логика запросов | Универсальные репозитории становятся объектами-богами |
| Технология стойкости может измениться | Сопоставление объекта ↔ Заголовок строки БД |

**Examples:**

```ts
type User = { id: string; email: string };
type UserRepository = {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
};

class InMemoryUserRepo implements UserRepository {
  #store = new Map<string, User>();
  async findById(id) { return this.#store.get(id) ?? null; }
  async save(user) { this.#store.set(user.id, user); }
}

async function inviteUser(email: string, repo: UserRepository) {
  const existing = await repo.findById(email); // domain doesn't know storage
  if (existing) throw new Error('Already exists');
  await repo.save({ id: crypto.randomUUID(), email });
}
```

**Thoughts:** Сочетается с ДИП. Не оборачивайте каждый вызов ORM вслепую — репозиторий хорош, когда логика предметной области богата, а постоянство варьируется (тесты, уровень кэширования, несколько источников).

**Sources:**

[refactoring.guru — Репозиторий](https://refactoring.guru/design-patterns/repository)

---

</details>
