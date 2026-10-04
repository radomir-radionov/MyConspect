# OOP — Interview

Ответы заполнены для опубликованной части, остальные пустые.

[ ← Вернуться в хаб](./0_system_design.md)

### Related docs

- [SOLID](./7_special_engineering.md) · [OOP — Интервью](./7_oop_interview.md) · [Проектирование системы — Интервью](./0_system_design_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Вопросы с [Devinterview.io — OOP](https://devinterview.io/questions/web-and-mobile-development/oop-interview-questions/).

### OOP Fundamentals

<details>
<summary>What is Object-Oriented Programming (OOP)?</summary>

### What is Object-Oriented Programming (OOP)?

**Definition:**

Объектно-ориентированное программирование собирает программу из объектов, которые держат данные и операции над этими данными вместе.

**How it works:**

- Класс — чертёж. Объект — живой экземпляр со своей идентичностью.
- Инкапсуляция прячет внутреннее состояние и открывает небольшой набор методов.
- Наследование позволяет новому классу переиспользовать и уточнить существующий: отношение «является».
- Полиморфизм позволяет вызывающему работать с суперклассом или интерфейсом, а конкретный объект подставляет своё поведение. Перегрузка выбирается при компиляции по списку параметров. Переопределение выбирается во время выполнения по классу объекта.
- Абстракция показывает только нужные операции. Абстрактный класс может смешивать обязательные методы с общим кодом. Интерфейс задаёт контракт без этого общего состояния.
- Агрегация — связь «имеет», при которой часть может пережить целое. Композиция строже: время жизни части привязано к владельцу.
- Разбиение на объекты упрощает повторное использование, расширение новым подтипом и смену внутренностей за стабильным публичным методом.

**Examples:**

```java
abstract class Animal {
    private final String name;
    protected Animal(String name) { this.name = name; }
    public String getName() { return name; }
    public abstract String sound();
}

class Lion extends Animal {
    public Lion(String name) { super(name); }
    public String sound() { return "roar"; }
}
```

</details>

<details>
<summary>What is the difference between procedural and Object-Oriented programming?</summary>

### What is the difference between procedural and Object-Oriented programming?

**Definition:**

Процедурный код — последовательность процедур над данными, часто общими. Объектный код складывает данные с процедурами, которым разрешено их менять.

**How it works:**

- В процедурном стиле функции действуют на данные, которые могут быть глобальными, и две функции сталкиваются на одном значении.
- В ООП состояние лежит внутри объекта, а остальной код говорит с ним через методы.
- Процедурное переиспользование — «вызвать эту функцию ещё раз». В ООП переиспользуют ещё класс, подтип или составную часть.
- Наследования и полиморфизма в процедурной модели нет. C — обычный процедурный пример. Java построена вокруг классов, инкапсуляции и наследования.
- Процедурный расчёт передаёт цену в функцию налога. Объектный расчёт просит `Order` посчитать свой итог.

**Examples:**

```java
// процедурно: правило у функции, число — просто данные
static int total(int price, int taxPercent) {
    return price + price * taxPercent / 100;
}

// объект: заказ владеет ценой и правилом
class Order {
    private final int price;
    Order(int price) { this.price = price; }
    int total(int taxPercent) { return price + price * taxPercent / 100; }
}
```

</details>

<details>
<summary>What is encapsulation?</summary>

### What is encapsulation?

**Definition:**

Инкапсуляция держит данные объекта и методы, которые их меняют, в одной единице и решает, что из этого видно снаружи.

**How it works:**

- Сокрытие информации не даёт остальному коду зависеть от полей и приватных помощников.
- Геттеры и сеттеры — узкая дверь. Сеттер может отвергнуть значение, которое ломает правило, например отрицательный баланс.
- Вызывающие не зависят от способа хранения, поэтому внутреннее представление можно сменить, не переписывая их.
- Тесты должны идти через публичные методы: именно на это поведение остальной программе разрешено опираться.
- Языки выражают это модификаторами доступа вроде `private`, `protected` и `public`.

**Examples:**

```java
class Account {
    private int cents;
    public void deposit(int amount) {
        if (amount <= 0) throw new IllegalArgumentException("amount");
        cents += amount;
    }
    public int balance() { return cents; }
}
```

</details>

<details>
<summary>What is polymorphism? Explain overriding and overloading.</summary>

### What is polymorphism? Explain overriding and overloading.

**Definition:**

Полиморфизм позволяет разным типам отвечать на один и тот же вызов. Перегрузка выбирает метод по аргументам при компиляции. Переопределение выбирает метод подкласса во время выполнения.

**How it works:**

- Перегрузка: в одном классе несколько методов с одним именем и разными списками параметров. Компилятор выбирает по объявленным типам аргументов.
- Переопределение: подкласс заменяет метод суперкласса. Вызов идёт по фактическому классу объекта.
- В C++ такой выбор во время выполнения требует `virtual`. В Java методы виртуальные по умолчанию. Механизм называется динамической диспетчеризацией, или поздним связыванием.
- Вызывающий может держать список суперкласса и всё равно получить поведение каждого объекта.

**Examples:**

```java
class Printer {
    String format(int n) { return Integer.toString(n); }
    String format(String s) { return s; }          // перегрузка
}
class HtmlPrinter extends Printer {
    @Override String format(String s) {            // переопределение
        return "<p>" + s + "</p>";
    }
}
```

</details>

<details>
<summary>What is inheritance? Name some types of inheritance.</summary>

### What is inheritance? Name some types of inheritance.

**Definition:**

Наследование позволяет новому классу взять поля и методы существующего. Подкласс — более конкретный вид суперкласса.

**How it works:**

- Одиночное: один подкласс и один суперкласс. Так устроены классы Java.
- Множественное: один класс расширяет больше одного класса. C++ это разрешает. Java приближается к той же идее интерфейсами, потому что у класса один суперкласс.
- Многоуровневое: C расширяет B, а B расширяет A.
- Иерархическое: несколько подклассов делят один суперкласс.
- Гибридное: сочетание двух этих форм, например множественное плюс многоуровневое. Граф легко сделать трудным для чтения, включая проблему ромба, когда к одному предку ведут два пути.

**Examples:**

```text
Vehicle
  └── Car          одиночное и начало многоуровневой цепочки
        └── Taxi
  └── Bus          иерархическое: и Car, и Bus расширяют Vehicle
```

</details>

<details>
<summary>What is an abstraction? Name some abstraction techniques.</summary>

### What is an abstraction? Name some abstraction techniques.

**Definition:**

Абстракция оставляет видимыми существенные операции и прячет детали, которые вызывающему не нужны, чтобы этими операциями пользоваться.

**How it works:**

- Абстрактный класс нельзя создать. Он может хранить общие поля и методы и оставлять часть методов подклассам. Его берут, когда несколько типов делят настоящий код и общую идентичность.
- Интерфейс называет методы (а в современных языках ещё необязательные методы по умолчанию) и не владеет состоянием объекта. Его берут, когда неродственные классы должны дать один набор операций.
- Третий приём — сама инкапсуляция: конкретный класс открывает узкую поверхность и прячет алгоритм.

**Examples:**

```java
interface Payable { int amountDue(); }

abstract class Document {
    private final String id;
    protected Document(String id) { this.id = id; }
    public String id() { return id; }
    public abstract String render();
}
```

</details>

<details>
<summary>What is a class in OOP?</summary>

### What is a class in OOP?

**Definition:**

Класс — чертёж объектов: он называет их данные и операции, которые этим данным принадлежат.

**How it works:**

- Атрибуты хранят состояние одного объекта. Методы читают или меняют это состояние либо вычисляют что-то из него.
- Наследование позволяет подклассу начать с суперкласса, а не копировать его.
- Инкапсуляция решает, какие атрибуты и методы видны.
- Полиморфизм позволяет разным классам отвечать на один вызов.
- Абстракция — это выбор опубликовать только те методы, которые вызывающим действительно нужны.

**Examples:**

```java
class Car {
    private int speed;
    public void accelerate(int delta) { speed += delta; }
    public int speed() { return speed; }
}
```

</details>

<details>
<summary>What is an object in OOP?</summary>

### What is an object in OOP?

**Definition:**

Объект — экземпляр класса во время выполнения. У него своя идентичность, состояние из значений полей и поведение из методов.

**How it works:**

- Идентичность отличает два объекта, даже если их поля сейчас совпадают.
- Состояние — текущие значения полей, и оно может меняться, когда выполняются методы.
- Поведение — то, что этим методам разрешено делать.
- Обычный жизненный цикл: выделение памяти, конструирование, использование, затем уничтожение или сборка, когда на объект не остаётся достижимых ссылок.

**Examples:**

```java
Car left = new Car();
Car right = new Car();
left.accelerate(10);
// left и right — разные объекты; едет только left
```

</details>

<details>
<summary>How do access specifiers work and what are they typically?</summary>

### How do access specifiers work and what are they typically?

**Definition:**

Спецификаторы доступа решают, какой код видит член класса. Обычные три уровня — private, protected и public.

**How it works:**

- Приватные члены видны только внутри объявившего класса. Для полей это желаемый уровень по умолчанию.
- Защищённые члены видны ещё и подклассам. Пакетный доступ, в языках где он есть, стоит между private и public.
- Публичные члены входят в поверхность, которой может пользоваться любой вызывающий.
- Уровни поддерживают инкапсуляцию и заодно ограничивают то, от чего подклассу позволено зависеть.
- Геттер, который только возвращает поле, или публичное поле, которое снаружи никому не нужно, расширяют поверхность без причины.
- Предпочитайте композицию, когда типы связаны слабо, держите члены приватными, пока вызывающему они действительно не понадобятся, и сохраняйте выбор видимости внутри класса согласованным.

**Examples:**

```java
class User {
    private String email;                 // только User
    protected String displayName;         // User и подклассы
    public String name() { return displayName; }
}
```

</details>

<details>
<summary>Name some ways to overload a method.</summary>

### Name some ways to overload a method.

**Definition:**

Перегрузка значит, что несколько методов делят имя, а компилятор различает их по списку параметров.

**How it works:**

- Меняют число параметров: `log(String message)` и `log(String message, int level)`.
- Меняют порядок типов параметров: `draw(int x, String label)` и `draw(String label, int x)`. Один лишь порядок — слабый способ перегрузки. Настоящий сигнал — разные типы.
- Меняют тип параметра: `add(int a, int b)` и `add(double a, double b)`.
- Одного типа возврата недостаточно. Вызов должен быть однозначным по аргументам.

**Examples:**

```java
class Clock {
    void set(int hour) { set(hour, 0); }
    void set(int hour, int minute) { /* store both */ }
}
```

</details>

<details>
<summary>What is cohesion in OOP?</summary>

### What is cohesion in OOP?

**Definition:**

Связность — насколько сильно поля и методы одного класса принадлежат одной ответственности. Цель — высокая связность.

**How it works:**

- Совпадающая (coincidental): у членов нет настоящей связи.
- Логическая: их сгруппировали по размытой категории, например «все помощники».
- Временная: они выполняются в один момент, например класс, который существует только чтобы всё запустить.
- Процедурная: они должны идти в фиксированном порядке, но не делят одну задачу.
- Коммуникационная: они работают с одними данными.
- Последовательная: выход одного метода — вход следующего.
- Функциональная: каждый член служит одной определённой задаче. Этот уровень совпадает с принципом единственной ответственности.
- Класс, который пишет файлы, говорит с базой и управляет кэшем, обладает низкой связностью. Разделите его так, чтобы каждый тип владел одной из этих работ, и прячьте данные за методами этой работы.

**Examples:**

`ReportRenderer`, который только превращает отчёт в HTML, функционально связен. `Utils`, который рисует HTML, шлёт почту и открывает соединение с базой, связен лишь совпадением.

</details>

<details>
<summary>What is coupling in OOP?</summary>

### What is coupling in OOP?

**Definition:**

Связанность — насколько один класс обязан знать о другом. Нужна слабая связанность: они говорят через небольшой интерфейс.

**How it works:**

- Связанность по содержимому — самая тесная: один модуль лезет в приватные данные другого.
- Общая: несколько модулей делят одно глобальное значение.
- По управлению: один модуль передаёт флаг, который выбирает путь другого.
- Внешняя: модули связаны внешним форматом, например общей раскладкой файла или схемой.
- По структуре (stamp): модули передают целую структуру, а каждый использует лишь её часть.
- По сообщениям — самая слабая: модуль вызывает метод или шлёт сообщение и не знает внутренностей получателя.
- Единственная ответственность и разделение интерфейсов уменьшают набор зависимостей. Открытость/закрытость и подстановка Лисков позволяют расширить или заменить тип, не правя вызывающих. Инверсия зависимостей заставляет обе стороны зависеть от абстракции, а не от конкретного класса.

**Examples:**

`Invoice`, который вызывает `payment.charge(amount)`, связан по сообщениям. `Invoice`, который пишет в `payment.gateway.socket`, связан по содержимому.

</details>


### Class Relationships and Design

<details>
<summary>What is a constructor and how is it used?</summary>

### What is a constructor and how is it used?

**Definition:**

Конструктор выполняется при создании объекта и оставляет его в допустимом состоянии. Это не обычный метод: у него нет типа возврата, а имя совпадает с классом.

**How it works:**

- Он задаёт поля и проверяет инварианты до того, как выполнится любой другой метод.
- Язык вызывает его как часть `new` (или аналога). Позже его не вызывают, чтобы «сбросить» объект.
- Конструктор по умолчанию не имеет параметров. Многие языки создают его сами, если вы не объявили ни одного.
- Параметризованный конструктор принимает значения, которые нужны объекту.
- Конструктор копирования принимает другой экземпляр того же типа и копирует его состояние. В C++ так обычно управляют глубоким копированием.
- Статический инициализатор, или статический блок, задаёт состояние уровня класса. Экземпляр он не создаёт, и он есть не в каждом языке.

**Examples:**

```java
class Point {
    private final int x;
    private final int y;
    public Point(int x, int y) { this.x = x; this.y = y; }
    public Point(Point other) { this(other.x, other.y); }
}
```

</details>

<details>
<summary>Describe the concept of destructor or finalizer in OOP.</summary>

### Describe the concept of destructor or finalizer in OOP.

**Definition:**

Деструктор или финализатор выполняет очистку, когда время жизни объекта заканчивается: закрывает файл, сокет, блокировку или чужую память.

**How it works:**

- Явное уничтожение — метод, который вызывает программист, или деструктор, который язык запускает в известный момент. Деструкторы C++ выполняются, когда объект покидает область видимости.
- Неявное уничтожение делает сборщик мусора в Java, C# и Python. Момент не гарантирован, поэтому финализатор — плохое место для дефицитного ресурса.
- Хук нужен для ресурсов, о которых сборщик не знает: открытые файлы, сетевые соединения, сессии базы, дескрипторы устройств.
- Предпочтительнее конструкция с областью (`using`, `try-with-resources`, RAII), чтобы освобождение случилось на каждом выходе, включая исключения.
- Писать журнал остановки туда стоит только если момент уже детерминирован. На финализатор Java нельзя опираться ради корректности.

**Examples:**

```cpp
struct File {
    FILE* handle;
    explicit File(const char* path) : handle(std::fopen(path, "r")) {}
    ~File() { if (handle) std::fclose(handle); }
};
```

</details>

<details>
<summary>Compare inheritance vs. mixin vs. composition.</summary>

### Compare inheritance vs. mixin vs. composition.

**Definition:**

Наследование, примеси и композиция — три способа переиспользовать поведение. Они различаются отношением, которое заявляют, и тем, насколько трудно их потом изменить.

**How it works:**

- Наследование — «является». `Taxi` расширяет `Car` и получает его поля и методы. Это самое прямое переиспользование, и оно же строит иерархию, которая становится хрупкой, когда подкласс на самом деле не подходит родителю.
- Примесь (mixin) — набор методов, который подмешивают в класс, не делая его подтипом «главного» типа примеси. `Loggable` можно применить и к сервису, и к задаче. Переиспользование пересекает иерархии. Цена — столкновения имён и менее очевидный источник вызова в стеке. Обычные формы — примеси Python и трейты Scala.
- Композиция — «имеет». `Car` держит `Engine` и пересылает ему вызовы. Части можно подменять, в том числе в тестах. Цена — больше явной сборки заранее.

**Examples:**

```java
class Car {
    private final Engine engine;          // композиция
    Car(Engine engine) { this.engine = engine; }
    void start() { engine.ignite(); }
}
```

</details>

<details>
<summary>Explain the concept of an interface and how it differs from an abstract class.</summary>

### Explain the concept of an interface and how it differs from an abstract class.

**Definition:**

</details>

<details>
<summary>Can a class have multiple parents in a single-inheritance system?</summary>

### Can a class have multiple parents in a single-inheritance system?

**Definition:**

</details>

<details>
<summary>How would you design a class to prevent it from being subclassed?</summary>

### How would you design a class to prevent it from being subclassed?

**Definition:**

</details>

<details>
<summary>Explain the 'is-a' vs 'has-a' relationship in OOP.</summary>

### Explain the 'is-a' vs 'has-a' relationship in OOP.

**Definition:**

</details>

<details>
<summary>Explain how aggregation relationship is represented in OOP.</summary>

### Explain how aggregation relationship is represented in OOP.

**Definition:**

</details>

<details>
<summary>What is method overriding, and what rules apply to it?</summary>

### What is method overriding, and what rules apply to it?

**Definition:**

</details>

<details>
<summary>Describe the use of static methods and when they are appropriate.</summary>

### Describe the use of static methods and when they are appropriate.

**Definition:**

</details>


### Advanced OOP Concepts

<details>
<summary>What is multiple inheritance and what are some of its disadvantages?</summary>

### What is multiple inheritance and what are some of its disadvantages?

**Definition:**

</details>

<details>
<summary>Can you explain the 'diamond problem' in multiple inheritance?</summary>

### Can you explain the 'diamond problem' in multiple inheritance?

**Definition:**

</details>

<details>
<summary>How does OOP languages support polymorphism under the hood?</summary>

### How does OOP languages support polymorphism under the hood?

**Definition:**

</details>

<details>
<summary>What are generics, and how can they be useful in OOP?</summary>

### What are generics, and how can they be useful in OOP?

**Definition:**

</details>

<details>
<summary>Explain the concept of object composition and its benefits.</summary>

### Explain the concept of object composition and its benefits.

**Definition:**

</details>

<details>
<summary>What is Liskov Substitution Principle (LSP)? Provide some examples of violation and adherence.</summary>

### What is Liskov Substitution Principle (LSP)? Provide some examples of violation and adherence.

**Definition:**

</details>

<details>
<summary>What is the dependency inversion principle?</summary>

### What is the dependency inversion principle?

**Definition:**

</details>

<details>
<summary>How can the open/closed principle guide object-oriented design?</summary>

### How can the open/closed principle guide object-oriented design?

**Definition:**

</details>

<details>
<summary>Describe how the Interface Segregation Principle affects system design.</summary>

### Describe how the Interface Segregation Principle affects system design.

**Definition:**

</details>

<details>
<summary>What is a mixin, and how does it differ from traditional inheritance?</summary>

### What is a mixin, and how does it differ from traditional inheritance?

**Definition:**

</details>


### Practical Use and Patterns

<details>
<summary>How would you refactor a class that has too many responsibilities?</summary>

### How would you refactor a class that has too many responsibilities?

**Definition:**

</details>

<details>
<summary>Describe a singleton pattern and discuss its pros and cons.</summary>

### Describe a singleton pattern and discuss its pros and cons.

**Definition:**

</details>

<details>
<summary>What is a factory method, and when should it be used?</summary>

### What is a factory method, and when should it be used?

**Definition:**

</details>

<details>
<summary>Explain the builder pattern and where you might apply it.</summary>

### Explain the builder pattern and where you might apply it.

**Definition:**

</details>

<details>
<summary>What is the prototype pattern, and how does it relate to OOP?</summary>

### What is the prototype pattern, and how does it relate to OOP?

**Definition:**

</details>

<details>
<summary>When would you use the Adapter pattern?</summary>

### When would you use the Adapter pattern?

**Definition:**

</details>

<details>
<summary>Can you explain the use of the Decorator pattern?</summary>

### Can you explain the use of the Decorator pattern?

**Definition:**

</details>

<details>
<summary>Describe the Observer pattern and a scenario in which you might use it.</summary>

### Describe the Observer pattern and a scenario in which you might use it.

**Definition:**

</details>

<details>
<summary>What are the advantages of using the Command pattern?</summary>

### What are the advantages of using the Command pattern?

**Definition:**

</details>

<details>
<summary>How does the Strategy pattern provide flexibility in objects?</summary>

### How does the Strategy pattern provide flexibility in objects?

**Definition:**

</details>


### OOP Best Practices

<details>
<summary>What are some common OOP design anti-patterns?</summary>

### What are some common OOP design anti-patterns?

**Definition:**

</details>

<details>
<summary>How do you ensure that your objects are properly encapsulated?</summary>

### How do you ensure that your objects are properly encapsulated?

**Definition:**

</details>

<details>
<summary>Name some techniques for reducing coupling between classes.</summary>

### Name some techniques for reducing coupling between classes.

**Definition:**

</details>

<details>
<summary>How does immutability help in object-oriented design, and how can it be implemented?</summary>

### How does immutability help in object-oriented design, and how can it be implemented?

**Definition:**

</details>

<details>
<summary>What tools or techniques would you use to document an object-oriented design?</summary>

### What tools or techniques would you use to document an object-oriented design?

**Definition:**

</details>

<details>
<summary>How do you address circular dependencies in an OOP system?</summary>

### How do you address circular dependencies in an OOP system?

**Definition:**

</details>

<details>
<summary>Explain how to apply unit testing to object-oriented code.</summary>

### Explain how to apply unit testing to object-oriented code.

**Definition:**

</details>

<details>
<summary>What strategies can be used to safely refactor legacy object-oriented code?</summary>

### What strategies can be used to safely refactor legacy object-oriented code?

**Definition:**

</details>

<details>
<summary>How can the principles of OOP help in achieving a modular and maintainable codebase?</summary>

### How can the principles of OOP help in achieving a modular and maintainable codebase?

**Definition:**

</details>

<details>
<summary>How do you balance the use of OOP principles with performance considerations in a system design?</summary>

### How do you balance the use of OOP principles with performance considerations in a system design?

**Definition:**

</details>
