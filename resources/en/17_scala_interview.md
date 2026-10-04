# Scala — Interview

Answers are filled for the published subset; the rest are still empty.

### Related docs

- [Scala — Interview](./17_scala_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Scala](https://devinterview.io/questions/machine-learning-and-data-science/scala-interview-questions/).

### Scala Fundamentals

<details>
<summary>What is Scala and why is it important for machine learning?</summary>

### What is Scala and why is it important for machine learning?

**Definition:**

Scala is a statically typed language on the JVM that mixes classes with first-class functions, so one codebase can model domain objects and transform data. Machine-learning jobs use that mix because numeric work can call Java libraries and Spark without leaving the language.

**How it works:**

- The compiler checks types before the program runs, so a mismatched feature shape fails at compile time.
- Functions are values: pipelines pass transformations, prefer immutable data, and take values apart with pattern matching.
- Classes still provide encapsulation and inheritance when a model or service needs a stable interface.
- The syntax stays short enough that a multi-step algorithm can sit in one readable expression.
- Bytecode on the JVM keeps heavy numeric work in the same performance range as Java.
- Breeze covers linear algebra and statistics, Smile covers classical models such as clustering and regression, and Spark MLlib trains models across a cluster.

**Examples:**

```scala
import breeze.linalg._

val features = DenseVector(2.0, 0.5, 1.0)
val weights = DenseVector(0.4, -0.2, 0.1)
val score = features.dot(weights)
```

</details>

<details>
<summary>Explain the difference between `var` and `val` in Scala.</summary>

### Explain the difference between `var` and `val` in Scala.

**Definition:**

`val` names a binding that cannot be assigned again; `var` can point at a new value later. A fixed binding does not freeze a mutable object stored behind it.

**How it works:**

- Both keywords introduce a name and an initial value.
- A second assignment to a `val` is a compile error.
- A `var` may be assigned a new value in the same scope.
- Prefer `val` so concurrent code is not racing to overwrite a shared name.
- If the value is a mutable buffer, callers can still change its contents. Immutability of the name and of the object are separate questions.

**Examples:**

```scala
var retries = 0
retries = retries + 1

val userId = 42
// userId = 7   // does not compile
```

</details>

<details>
<summary>What are the main features of Scala that make it amenable for data science and machine learning tasks?</summary>

### What are the main features of Scala that make it amenable for data science and machine learning tasks?

**Definition:**

Scala suits data science because a static type system, immutable defaults, and the JVM library stack line up with long-running numeric jobs.

**How it works:**

- Immutable values turn a pipeline step into a transformation instead of an in-place edit.
- Futures and actor toolkits such as Akka structure concurrent stages without a shared mutable heap.
- Inference drops annotations where the type is obvious, while static checking still catches mismatches.
- Java classes are called directly, so existing numeric and IO libraries stay available.
- Spark and Flink treat Scala as a primary API for distributed data.
- The same ecosystem includes notebook-style literate workflows and reactive streams, a pull-based flow with backpressure, when a job is exploratory or continuous.

**Examples:**

A feature step that must not mutate its input returns a new collection: `rows.map(scale).filter(keep)`, leaving `rows` unchanged for the next branch of the experiment.

</details>

<details>
<summary>Can you describe the type hierarchy in Scala?</summary>

### Can you describe the type hierarchy in Scala?

**Definition:**

Every Scala value sits under `Any`, which splits into value types and reference types, with `Nothing` as the bottom type.

**How it works:**

- `Any` is the top type. Every other type is a subtype of it.
- `AnyVal` covers `Byte`, `Short`, `Int`, `Long`, `Float`, `Double`, `Char`, `Boolean`, and `Unit`. `Unit` means “no useful result,” the same role as Java `void`.
- `AnyRef` is the reference side and corresponds to `java.lang.Object`. Classes and traits live here.
- `Nothing` is a subtype of every type, so it types a throw or an empty branch. `Null` is a subtype of every `AnyRef`, which is why `null` is not a valid `Int`.
- Scala 3 adds union types (`String | Int`) and singleton types that pin a type to one inhabitant, such as the literal `1`.

**Examples:**

```scala
def fail(message: String): Nothing =
  throw new IllegalStateException(message)

val id: String | Int = 7
```

</details>

<details>
<summary>How is Scala interoperable with Java?</summary>

### How is Scala interoperable with Java?

**Definition:**

Scala and Java share the JVM, so each language can call the other’s classes, with explicit conversions at the collection and null boundaries.

**How it works:**

- A Scala class is a JVM class. Java can call its public methods, and Scala can extend a Java class or implement a Java interface.
- Primitive types line up (`Int` with `int`, and the same for the other numeric and boolean types).
- `scala.jdk.CollectionConverters` moves data between Scala and Java collections in both directions.
- Java `null` stays null until you wrap it. `Option(javaRef)` is `None` when the reference is null.
- A Scala lambda can implement a single-method Java interface.

**Examples:**

```scala
import scala.jdk.CollectionConverters.*

val ids = java.util.List.of(1, 2, 3).asScala.toVector
val missing = Option(System.getProperty("absent.key")) // None
```

</details>

<details>
<summary>What are case classes in Scala and how do they benefit pattern matching?</summary>

### What are case classes in Scala and how do they benefit pattern matching?

**Definition:**

A case class is a data holder whose fields are immutable by default, and the compiler generates the methods that pattern matching needs.

**How it works:**

- Fields are `val` unless you mark them `var`.
- The compiler adds `equals`, `hashCode`, `toString`, `apply`, `unapply`, and `copy`.
- `match` uses `unapply` to take the value apart, so you do not write an extractor by hand.
- `copy` returns a new instance with the fields you name changed and the rest kept.
- A custom extractor is still an `unapply` on a companion when the type is not a case class.

**Examples:**

```scala
case class Reading(sensor: String, value: Double)

val current = Reading("temp", 21.5)
val label = current match
  case Reading(name, v) if v > 20 => name

val adjusted = current.copy(value = 19.0)
```

</details>

<details>
<summary>Explain the concept of `object` in Scala and its usage.</summary>

### Explain the concept of `object` in Scala and its usage.

**Definition:**

An `object` declares one instance that the runtime creates for you. That is how Scala groups methods Java would mark `static`.

**How it works:**

- The instance is created once, lazily, the first time something uses it. You do not call a constructor.
- Members are reached through the object’s name.
- Related functions and constants live together without a throwaway class.
- Visibility follows the package and access modifiers. It is not a free global variable.
- Initialization is synchronized. Fields you mutate yourself are not automatically safe to share across threads.
- A companion object shares the class name and can see that class’s private members. `object Main extends App` is a common program entry.

**Examples:**

```scala
object Temperature:
  def celsiusToF(c: Double): Double = c * 9.0 / 5.0 + 32

Temperature.celsiusToF(20)
```

</details>

<details>
<summary>How do you implement traits in Scala?</summary>

### How do you implement traits in Scala?

**Definition:**

A trait bundles abstract requirements with concrete methods and fields so one class can mix in several behaviors.

**How it works:**

- Declare it with `trait`. A member may be abstract or already have a body.
- A class takes the first trait with `extends` and further traits with `with`.
- Concrete members are inherited as they are, or the class overrides the ones it needs to change.
- If two traits define the same member, linearization picks the winner, and `super` calls the next trait in that order.
- The class still has to implement anything the traits left abstract.

**Examples:**

```scala
trait Titled:
  def title: String
  def label: String = s"[$title]"

class Report(val title: String) extends Titled

new Report("Q1").label  // [Q1]
```

</details>

<details>
<summary>Discuss the importance of immutability and how Scala supports it.</summary>

### Discuss the importance of immutability and how Scala supports it.

**Definition:**

Immutability means a value does not change after it is created, so readers and threads all see the same data.

**How it works:**

- One stable value is easier to read, to test, and to replay in a debugger.
- Threads can share it without locks, because nobody writes it.
- An “update” builds a new value. The previous one stays as it was.
- `val` refuses a new assignment; `var` allows one.
- Default collections such as `List`, `Vector`, and immutable `Map` return a new collection from transforming methods.
- Case-class fields are vals, and pattern matching reads them.
- A `val` that points at a mutable buffer does not freeze that buffer. At a Java boundary, an unmodifiable wrapper can stop callers from editing a collection you hand out.

**Examples:**

```scala
val scores = Vector(1, 2, 3)
val next = scores :+ 4
// scores is still Vector(1, 2, 3)
```

</details>

<details>
<summary>Explain the difference between a sequence and a list in Scala.</summary>

### Explain the difference between a sequence and a list in Scala.

**Definition:**

`Seq` is the trait for ordered collections. `List` is one implementation: an immutable singly linked list.

**How it works:**

- A sequence may be immutable or mutable. A `List` is always immutable.
- `List` is a linked spine, so cons, head, and tail are cheap, and an index walks the nodes.
- An indexed sequence such as `Vector` makes random access much cheaper.
- `LinearSeq` marks structures whose head and tail are constant-time, which is the `List` shape.
- Mutable ordered buffers live in `scala.collection.mutable` and are not lists.
- Build with `List` when you prepend. Use `Vector` when you index.

**Examples:**

```scala
val linked: Seq[Int] = List(10, 20, 30)
linked.head   // 10, no walk
linked(2)     // walks two links

val indexed: Seq[Int] = Vector(10, 20, 30)
indexed(2)    // direct index
```

</details>

<details>
<summary>What are the advantages of using Option in Scala?</summary>

### What are the advantages of using Option in Scala?

**Definition:**

`Option[A]` is either `Some(value)` or `None`, so a missing result is part of the type instead of a `null` that fails later.

**How it works:**

- `map`, `flatMap`, and `getOrElse` keep the success path short and force the empty case to be handled.
- Return `Option` when absence is a normal outcome, so the API documents that fact.
- At a Java boundary, `Option(ref)` turns a null reference into `None`.

**Examples:**

```scala
def parsePort(raw: String): Option[Int] =
  raw.toIntOption.filter(p => p > 0 && p < 65536)

parsePort("8080").getOrElse(80)
```

</details>

<details>
<summary>Discuss the role of implicit parameters in Scala.</summary>

### Discuss the role of implicit parameters in Scala.

**Definition:**

An implicit parameter is filled by the compiler from a unique in-scope value of the required type, so callers skip repetitive context such as an execution context or a type-class instance.

**How it works:**

- The parameter sits in its own list (`implicit` in Scala 2, `using` in Scala 3). The value is provided with `implicit` or `given`.
- Lookup walks the current scope and the givens you imported. Zero candidates or two equally good ones is a compile error.
- Disambiguate by passing the argument yourself, by not using an implicit list, or by narrowing the import so only one candidate remains.
- This is how type classes such as `Ordering` are passed around.
- Shorter call sites hide data flow. Keep the mechanism for context and type classes, not for ordinary business arguments.

**Examples:**

```scala
def shout(message: String)(using prefix: String): String =
  prefix + message

given String = "note: "
shout("disk full")  // "note: disk full"
```

</details>

<details>
<summary>How do for-comprehensions work in Scala?</summary>

### How do for-comprehensions work in Scala?

**Definition:**

A for-comprehension is syntax sugar over `map`, `flatMap`, and `withFilter`, so several dependent steps read as a straight sequence.

**How it works:**

- A generator `x <- xs` pulls values from a source.
- A guard `if p` becomes `withFilter`.
- A binding `y = expr` names an intermediate value for the rest of the comprehension.
- `yield` builds the result of each iteration. Without `yield`, the comprehension runs for effect.
- Every generator except the last becomes `flatMap`; the last becomes `map`.
- The same shape works for `List`, `Option`, `Either`, and `Future`, which is why it sequences failure and asynchronous steps as well as collections.

**Examples:**

```scala
val squares =
  for
    n <- List(1, 2, 3, 4)
    if n % 2 == 0
    square = n * n
  yield square
// List(4, 16)
```

</details>

### Functional Programming in Scala

<details>
<summary>What is functional programming and how does Scala support it?</summary>

### What is functional programming and how does Scala support it?

**Definition:**

Functional programming builds a result by applying functions to values, and Scala supports that style without removing classes.

**How it works:**

- Functions are values: they can be stored, passed, and returned.
- A pure function’s result depends only on its inputs and does not change outside state.
- Immutable data keeps that promise when several threads read the same value.
- Recursion, including optimized direct tail recursion, replaces many loops.
- Pattern matching and case classes express algebraic data and the branches over it.
- Lazy values delay work until the result is needed. Inference and a static type system cut noise without dropping checks.
- Libraries such as Cats and Scalaz, and runtimes such as Akka and Spark, are built around this style.
- `var` and ordinary classes remain for the steps that are clearer when written imperatively.

**Examples:**

```scala
def total(xs: List[Int]): Int = xs.foldLeft(0)(_ + _)
```

</details>

<details>
<summary>Explain higher-order functions in Scala.</summary>

### Explain higher-order functions in Scala.

**Definition:**

A higher-order function takes a function, returns a function, or both, so a repeated loop becomes one named operation.

**How it works:**

- The varying part — a predicate, a mapping — is an argument, which removes a copied traversal.
- Small functions compose into a pipeline that can be tested on its own.
- A parameter function is written `A => B` and passed by name or as a lambda.
- A function can return another function and close over the values it needs.

**Examples:**

```scala
def select[A](xs: List[A])(keep: A => Boolean): List[A] =
  xs.filter(keep)

def prefix(tag: String): String => String =
  value => s"$tag$value"

select(List("a", "ab", "b"))(_.length > 1)
prefix("id:")("42")
```

</details>

<details>
<summary>What are pure functions and why are they important in Scala?</summary>

### What are pure functions and why are they important in Scala?

**Definition:**

</details>

<details>
<summary>Discuss the use of partial functions in Scala.</summary>

### Discuss the use of partial functions in Scala.

**Definition:**

</details>

<details>
<summary>How do you work with closures in Scala?</summary>

### How do you work with closures in Scala?

**Definition:**

</details>

<details>
<summary>What is tail recursion and how does Scala optimize it?</summary>

### What is tail recursion and how does Scala optimize it?

**Definition:**

</details>

<details>
<summary>Explain the use of `map`, `flatMap`, and `filter` in Scala collections.</summary>

### Explain the use of `map`, `flatMap`, and `filter` in Scala collections.

**Definition:**

</details>

<details>
<summary>How does Scala provide support for lazy evaluation?</summary>

### How does Scala provide support for lazy evaluation?

**Definition:**

</details>

### Scala Collection API

<details>
<summary>What is the difference between mutable and immutable collections in Scala?</summary>

### What is the difference between mutable and immutable collections in Scala?

**Definition:**

</details>

<details>
<summary>How do you use tuples in Scala?</summary>

### How do you use tuples in Scala?

**Definition:**

</details>

<details>
<summary>Explain the role of iterators in Scala.</summary>

### Explain the role of iterators in Scala.

**Definition:**

</details>

<details>
<summary>Discuss the difference between fold and reduce operations in Scala.</summary>

### Discuss the difference between fold and reduce operations in Scala.

**Definition:**

</details>

<details>
<summary>How do parallel collections work in Scala and what are their benefits?</summary>

### How do parallel collections work in Scala and what are their benefits?

**Definition:**

</details>

### Concurrency in Scala

<details>
<summary>What are Futures in Scala and how do you use them for asynchronous computation?</summary>

### What are Futures in Scala and how do you use them for asynchronous computation?

**Definition:**

</details>

<details>
<summary>Explain the difference between an Actor and a Thread in Scala concurrency.</summary>

### Explain the difference between an Actor and a Thread in Scala concurrency.

**Definition:**

</details>

<details>
<summary>How does Scala handle synchronization and concurrency control?</summary>

### How does Scala handle synchronization and concurrency control?

**Definition:**

</details>

<details>
<summary>What is the Akka framework and how does it relate to Scala?</summary>

### What is the Akka framework and how does it relate to Scala?

**Definition:**

</details>

### Scala and Machine Learning Libraries

<details>
<summary>Name some popular machine learning libraries that support Scala.</summary>

### Name some popular machine learning libraries that support Scala.

**Definition:**

</details>

<details>
<summary>How does the Breeze library facilitate scientific computing in Scala?</summary>

### How does the Breeze library facilitate scientific computing in Scala?

**Definition:**

</details>

<details>
<summary>What are Saddle and Algebird, and how do they contribute to machine learning operations in Scala?</summary>

### What are Saddle and Algebird, and how do they contribute to machine learning operations in Scala?

**Definition:**

</details>

### Object-Oriented Programming in Scala

<details>
<summary>Explain the concept of inheritance in Scala.</summary>

### Explain the concept of inheritance in Scala.

**Definition:**

</details>

<details>
<summary>How do abstract classes work in Scala?</summary>

### How do abstract classes work in Scala?

**Definition:**

</details>

<details>
<summary>What are companion objects in Scala?</summary>

### What are companion objects in Scala?

**Definition:**

</details>

<details>
<summary>Describe the use of mixins and trait composition.</summary>

### Describe the use of mixins and trait composition.

**Definition:**

</details>

### Scala Coding Challenges

<details>
<summary>Write a Scala function to compute the factorial of a number using tail recursion.</summary>

### Write a Scala function to compute the factorial of a number using tail recursion.

**Definition:**

</details>

<details>
<summary>Implement a function in Scala that verifies if a list of integers is sorted.</summary>

### Implement a function in Scala that verifies if a list of integers is sorted.

**Definition:**

</details>

<details>
<summary>Create a Scala class that represents a Matrix and a method to multiply two matrices.</summary>

### Create a Scala class that represents a Matrix and a method to multiply two matrices.

**Definition:**

</details>

<details>
<summary>Write a Scala program to read a CSV file and calculate the average value of a numeric column.</summary>

### Write a Scala program to read a CSV file and calculate the average value of a numeric column.

**Definition:**

</details>

<details>
<summary>Implement a simple decision tree algorithm in Scala.</summary>

### Implement a simple decision tree algorithm in Scala.

**Definition:**

</details>

<details>
<summary>Use Scala to perform text preprocessing for natural language processing (e.g., tokenization, normalization).</summary>

### Use Scala to perform text preprocessing for natural language processing (e.g., tokenization, normalization).

**Definition:**

</details>

<details>
<summary>Write a Scala function that performs element-wise addition of two vectors.</summary>

### Write a Scala function that performs element-wise addition of two vectors.

**Definition:**

</details>

### Advanced Scala Concepts

<details>
<summary>Discuss implicits in Scala and how they can be used in type conversion.</summary>

### Discuss implicits in Scala and how they can be used in type conversion.

**Definition:**

</details>

<details>
<summary>Explain the concept of path-dependent types in Scala.</summary>

### Explain the concept of path-dependent types in Scala.

**Definition:**

</details>

<details>
<summary>What is Type Erasure in Scala and how can it be addressed?</summary>

### What is Type Erasure in Scala and how can it be addressed?

**Definition:**

</details>

<details>
<summary>Describe Type Bounds in Scala and provide an example of their usage.</summary>

### Describe Type Bounds in Scala and provide an example of their usage.

**Definition:**

</details>

<details>
<summary>How are variance annotations (covariant and contravariant) used in Scala?</summary>

### How are variance annotations (covariant and contravariant) used in Scala?

**Definition:**

</details>

<details>
<summary>Discuss the use and implications of macros in Scala.</summary>

### Discuss the use and implications of macros in Scala.

**Definition:**

</details>

### Machine Learning Algorithms in Scala

<details>
<summary>Demonstrate how to implement a k-means clustering algorithm in Scala.</summary>

### Demonstrate how to implement a k-means clustering algorithm in Scala.

**Definition:**

</details>

<details>
<summary>Write a Scala implementation for logistic regression.</summary>

### Write a Scala implementation for logistic regression.

**Definition:**

</details>

<details>
<summary>How would you implement a recommendation system using alternating least squares (ALS) in Scala?</summary>

### How would you implement a recommendation system using alternating least squares (ALS) in Scala?

**Definition:**

</details>

<details>
<summary>Explain how you would utilize random forests for classification in Scala.</summary>

### Explain how you would utilize random forests for classification in Scala.

**Definition:**

</details>

### Scala for Big Data Processing

<details>
<summary>How does Apache Spark integrate with Scala for machine learning tasks?</summary>

### How does Apache Spark integrate with Scala for machine learning tasks?

**Definition:**

</details>

<details>
<summary>What are resilient distributed datasets (RDDs) and how do they work in Scala?</summary>

### What are resilient distributed datasets (RDDs) and how do they work in Scala?

**Definition:**

</details>

<details>
<summary>Explain the DataFrame API in Spark and its usage with Scala.</summary>

### Explain the DataFrame API in Spark and its usage with Scala.

**Definition:**

</details>

<details>
<summary>How can you leverage Spark's MLlib library for machine learning in Scala?</summary>

### How can you leverage Spark's MLlib library for machine learning in Scala?

**Definition:**

</details>

### Performance Optimization in Scala

<details>
<summary>Discuss techniques for optimizing Scala code performance.</summary>

### Discuss techniques for optimizing Scala code performance.

**Definition:**

</details>

<details>
<summary>What is the role of JVM in Scala's performance?</summary>

### What is the role of JVM in Scala's performance?

**Definition:**

</details>

<details>
<summary>How can you manage memory effectively in Scala applications?</summary>

### How can you manage memory effectively in Scala applications?

**Definition:**

</details>

### Scala Testing and Debugging

<details>
<summary>What frameworks are commonly used for testing Scala applications?</summary>

### What frameworks are commonly used for testing Scala applications?

**Definition:**

</details>

<details>
<summary>Describe the process of unit testing in Scala.</summary>

### Describe the process of unit testing in Scala.

**Definition:**

</details>

<details>
<summary>How would you debug an application in Scala that is not performing as expected?</summary>

### How would you debug an application in Scala that is not performing as expected?

**Definition:**

</details>

### Real-World Applications and Case Studies

<details>
<summary>Present a case study where Scala is used in a machine learning pipeline.</summary>

### Present a case study where Scala is used in a machine learning pipeline.

**Definition:**

</details>

<details>
<summary>How can Scala be used for processing large-scale graph data in machine learning?</summary>

### How can Scala be used for processing large-scale graph data in machine learning?

**Definition:**

</details>

<details>
<summary>Describe an application of Scala in natural language processing.</summary>

### Describe an application of Scala in natural language processing.

**Definition:**

</details>

<details>
<summary>Discuss the use of Scala in finance for algorithmic trading systems.</summary>

### Discuss the use of Scala in finance for algorithmic trading systems.

**Definition:**

</details>

### Scalability with Scala

<details>
<summary>How does Scala address scalability in large machine learning systems?</summary>

### How does Scala address scalability in large machine learning systems?

**Definition:**

</details>

<details>
<summary>Discuss the implementation of a distributed machine learning system using Scala.</summary>

### Discuss the implementation of a distributed machine learning system using Scala.

**Definition:**

</details>
