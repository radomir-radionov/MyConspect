# OOP — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [OOP & SOLID](./7_special_engineering.md) · [OOP — Interview](./7_oop_interview.md) · [System design — Interview](./0_system_design_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — OOP](https://devinterview.io/questions/web-and-mobile-development/oop-interview-questions/).

### OOP Fundamentals

<details>
<summary>What is Object-Oriented Programming (OOP)?</summary>

### What is Object-Oriented Programming (OOP)?

**Definition:**

Object-oriented programming organizes a program as objects that keep their data and the operations on that data together.

**How it works:**

- A class is the blueprint. An object is one live instance with its own identity.
- Encapsulation hides internal state and exposes a small set of methods.
- Inheritance lets a new class reuse and specialize an existing one, an “is-a” relationship.
- Polymorphism lets a caller use a superclass or interface while the concrete object supplies its own behavior. Overloading is chosen at compile time from the parameter list. Overriding is chosen at run time from the object’s class.
- Abstraction shows only the operations a caller needs. Abstract classes can mix required methods with shared code. Interfaces state a contract without that shared state.
- Aggregation is a “has-a” link where the part can outlive the whole. Composition is the stricter form: the part’s lifetime is tied to the owner.
- The split into objects makes code easier to reuse, to extend through a new subtype, and to change behind a stable public method.

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

Procedural code is a sequence of procedures that operate on data, often shared. Object-oriented code bundles the data with the procedures that are allowed to change it.

**How it works:**

- In a procedural style, functions act on data that may be global, so two functions can clash over the same value.
- In OOP, state sits inside the object and other code talks to it through methods.
- Procedural reuse is “call this function again.” OOP reuse is also a class, a subtype, or a composed part.
- Inheritance and polymorphism are not part of the procedural model. C is the usual procedural example. Java is built around classes, encapsulation, and inheritance.
- A procedural checkout adds tax in a function that receives the price. An object-oriented checkout asks an `Order` to compute its own total.

**Examples:**

```java
// procedural: the function owns the rule, the number is just data
static int total(int price, int taxPercent) {
    return price + price * taxPercent / 100;
}

// object: the order owns its price and the rule
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

Encapsulation keeps an object’s data and the methods that change it in one unit, and it decides which of that is visible outside.

**How it works:**

- Information hiding stops other code from depending on fields and private helpers.
- Getters and setters are the narrow door. A setter can reject a value that breaks a rule, such as a negative balance.
- Callers are insulated from a change of representation, so the internals can be replaced without rewriting them.
- Tests should go through the public methods, which is the behavior the rest of the program is allowed to rely on.
- Languages expose this with access modifiers such as `private`, `protected`, and `public`.

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

Polymorphism lets different types answer the same call. Overloading picks a method from the arguments at compile time. Overriding picks the subclass method at run time.

**How it works:**

- Overloading: one class has several methods with the same name and different parameter lists. The compiler chooses from the declared types of the arguments.
- Overriding: a subclass replaces a method of its superclass. The call goes through the object’s actual class.
- In C++ that runtime choice requires a `virtual` method. Java methods are virtual by default. The mechanism is dynamic dispatch, also called late binding.
- A caller can hold a list of the superclass and still get each object’s own behavior.

**Examples:**

```java
class Printer {
    String format(int n) { return Integer.toString(n); }
    String format(String s) { return s; }          // overload
}
class HtmlPrinter extends Printer {
    @Override String format(String s) {            // override
        return "<p>" + s + "</p>";
    }
}
```

</details>

<details>
<summary>What is inheritance? Name some types of inheritance.</summary>

### What is inheritance? Name some types of inheritance.

**Definition:**

Inheritance lets a new class take fields and methods from an existing class. The subclass is a more specific kind of the superclass.

**How it works:**

- Single: one subclass, one superclass. This is the Java class model.
- Multiple: one class extends more than one class. C++ allows it. Java approaches the same idea with interfaces, because a class has only one superclass.
- Multilevel: C extends B, and B extends A.
- Hierarchical: several subclasses share one superclass.
- Hybrid: two of those shapes combined, for example multiple plus multilevel. It is easy to make the graph hard to follow, including the diamond problem when two paths lead to the same ancestor.

**Examples:**

```text
Vehicle
  └── Car          single, and the start of a multilevel chain
        └── Taxi
  └── Bus          hierarchical: Car and Bus both extend Vehicle
```

</details>

<details>
<summary>What is an abstraction? Name some abstraction techniques.</summary>

### What is an abstraction? Name some abstraction techniques.

**Definition:**

Abstraction keeps the essential operations visible and hides the details a caller does not need in order to use them.

**How it works:**

- An abstract class cannot be constructed. It can hold shared fields and methods, and it can leave some methods for subclasses to fill in. Use it when several types share real code and a common identity.
- An interface names methods (and, in modern languages, optional default methods) without owning the object’s state. Use it when unrelated classes must offer the same set of operations.
- A third technique is encapsulation itself: a concrete class exposes a small surface and hides the algorithm.

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

A class is the blueprint for objects: it names their data and the operations that belong with that data.

**How it works:**

- Attributes store one object’s state. Methods read or change that state, or compute something from it.
- Inheritance lets a subclass start from a superclass instead of copying it.
- Encapsulation decides which attributes and methods are visible.
- Polymorphism lets different classes answer the same call.
- Abstraction is the choice to publish only the methods callers actually need.

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

An object is a runtime instance of a class. It has its own identity, a state made of its field values, and behavior made of its methods.

**How it works:**

- Identity distinguishes two objects even when their fields currently match.
- State is the current field values, and it can change when methods run.
- Behavior is what those methods are allowed to do.
- The usual life cycle is allocation, construction, use, and then destruction or collection when nothing reachable points at the object.

**Examples:**

```java
Car left = new Car();
Car right = new Car();
left.accelerate(10);
// left and right are different objects; only left is moving
```

</details>

<details>
<summary>How do access specifiers work and what are they typically?</summary>

### How do access specifiers work and what are they typically?

**Definition:**

Access specifiers decide which code may see a class member. The usual three levels are private, protected, and public.

**How it works:**

- Private members are visible only inside the declaring class. That is the default you want for fields.
- Protected members are also visible to subclasses. Package-private, in languages that have it, sits between private and public.
- Public members are part of the surface every caller may use.
- The levels support encapsulation, and they also control what a subclass is allowed to depend on.
- A getter that does nothing but return a field, or a public field nobody outside needs, widens the surface for no reason.
- Prefer composition when two types are only loosely related, keep members private until a caller truly needs them, and keep one class’s visibility choices consistent.

**Examples:**

```java
class User {
    private String email;                 // only User
    protected String displayName;         // User and subclasses
    public String name() { return displayName; }
}
```

</details>

<details>
<summary>Name some ways to overload a method.</summary>

### Name some ways to overload a method.

**Definition:**

Overloading means several methods share a name and the compiler tells them apart by the parameter list.

**How it works:**

- Change the number of parameters: `log(String message)` and `log(String message, int level)`.
- Change the order of parameter types: `draw(int x, String label)` and `draw(String label, int x)`. Order alone is a weak way to overload. Different types are the real signal.
- Change a parameter’s type: `add(int a, int b)` and `add(double a, double b)`.
- The return type by itself is not enough. The call still has to be unambiguous from the arguments.

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

Cohesion is how strongly the fields and methods of one class belong to a single responsibility. High cohesion is the goal.

**How it works:**

- Coincidental: the members have no real relationship.
- Logical: they are grouped by a vague category, such as “all the helpers.”
- Temporal: they run at the same moment, such as a class that only exists to start everything.
- Procedural: they must run in a fixed order but do not share one job.
- Communicational: they operate on the same data.
- Sequential: the output of one method is the input of the next.
- Functional: every member serves one defined task. This is the level that matches the Single Responsibility Principle.
- A class that writes files, talks to a database, and manages a cache is low cohesion. Split it so each type owns one of those jobs, and keep data hidden behind the methods of that job.

**Examples:**

`ReportRenderer` that only turns a report into HTML is functionally cohesive. `Utils` that renders HTML, sends mail, and opens a database connection is coincidental.

</details>

<details>
<summary>What is coupling in OOP?</summary>

### What is coupling in OOP?

**Definition:**

Coupling is how much one class must know about another. Loose coupling, where they talk through a small interface, is the form you want.

**How it works:**

- Content coupling is the tightest: one module reaches into another’s private data.
- Common coupling: several modules share one global value.
- Control coupling: one module passes a flag that chooses the other’s path.
- External coupling: modules are tied by an outside format, such as a shared file layout or schema.
- Stamp coupling: modules pass a whole structure and each uses only part of it.
- Message coupling is the loosest: a module calls a method or sends a message and does not know the receiver’s internals.
- Single responsibility and interface segregation shrink the set of dependencies. Open/closed and Liskov substitution let you extend or swap a type without editing callers. Dependency inversion makes both sides depend on an abstraction rather than on a concrete class.

**Examples:**

`Invoice` that calls `payment.charge(amount)` is message-coupled. `Invoice` that writes `payment.gateway.socket` is content-coupled.

</details>


### Class Relationships and Design

<details>
<summary>What is a constructor and how is it used?</summary>

### What is a constructor and how is it used?

**Definition:**

A constructor runs when an object is created and leaves that object in a valid state. It is not an ordinary method: it has no return type, and its name matches the class.

**How it works:**

- It sets fields and checks invariants before any other method runs.
- The language calls it as part of `new` (or the equivalent). You do not call it later to “reset” the object.
- A default constructor has no parameters. Many languages synthesize one when you declare none.
- A parameterized constructor takes the values the object needs.
- A copy constructor takes another instance of the same type and copies its state. In C++ that is the usual way to control a deep copy.
- A static initializer, or static block, sets class-level state. It does not create an instance, and not every language has one.

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

A destructor or finalizer runs cleanup when an object’s lifetime ends: releasing a file, a socket, a lock, or native memory.

**How it works:**

- Explicit destruction is a method the programmer calls, or a destructor the language runs at a known time. C++ destructors run when the object leaves scope.
- Implicit destruction is what a garbage collector does in Java, C#, and Python. The moment is not guaranteed, so a finalizer is a poor place for a scarce resource.
- Use the hook for resources the collector does not know about: open files, network connections, database sessions, device handles.
- Prefer a scoped construct (`using`, `try-with-resources`, RAII) so the release happens on every exit path, including exceptions.
- Log the shutdown there only if you already have a deterministic point. Do not rely on a Java finalizer for correctness.

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

Inheritance, mixins, and composition are three ways to reuse behavior. They differ in the relationship they claim and in how hard they are to change later.

**How it works:**

- Inheritance is “is-a.” `Taxi` extends `Car` and receives its fields and methods. It is the most direct reuse, and it also builds a hierarchy that becomes brittle when a subclass does not actually fit the parent.
- A mixin is a bundle of methods mixed into a class that is not a subtype of the mixin’s “main” type. `Loggable` can be applied to a service and to a job. Reuse crosses hierarchies. The cost is name clashes and a call stack whose source is less obvious. Python mixins and Scala traits are the usual forms.
- Composition is “has-a.” A `Car` holds an `Engine` and forwards calls to it. Parts can be swapped, including in tests. The cost is more wiring up front.

**Examples:**

```java
class Car {
    private final Engine engine;          // composition
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
