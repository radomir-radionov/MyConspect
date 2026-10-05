# English and Russian bodies for empty Scala interview blocks.
# Code samples and source URLs are shared; only prose differs.

S = "https://docs.scala-lang.org"

SCALA_ITEMS = []


def add(summary, defn, how, example, sources, when=None, lang="scala"):
    SCALA_ITEMS.append(
        {
            "summary": summary,
            "defn": defn,
            "how": how,
            "example": example,
            "sources": sources,
            "when": when,
            "lang": lang,
        }
    )


add(
    "Discuss the use of partial functions in Scala.",
    {
        "en": "A partial function is a unary function that is not defined for every value of its argument type. In Scala it implements `PartialFunction[A, B]`.",
        "ru": "Частичная функция — унарная функция, определённая не для каждого значения своего аргумента. В Scala она реализует `PartialFunction[A, B]`.",
    },
    {
        "en": [
            "Write it with a `case`, the same shape as a `match` arm. `isDefinedAt` reports whether an argument is in the domain.",
            "Calling it outside the domain throws `MatchError`. `applyOrElse` supplies a fallback for those arguments.",
            "`orElse` chains two partial functions: the second runs where the first is not defined.",
            "`collect` applies a partial function and keeps only the elements for which it is defined.",
        ],
        "ru": [
            "Её пишут через `case`, как ветку `match`. `isDefinedAt` говорит, входит ли аргумент в область определения.",
            "Вызов вне области бросает `MatchError`. `applyOrElse` подставляет запасное значение для таких аргументов.",
            "`orElse` сцепляет две частичные функции: вторая работает там, где первая не определена.",
            "`collect` применяет частичную функцию и оставляет только элементы, для которых она определена.",
        ],
    },
    """val doubledOdds: PartialFunction[Int, Int] = {
  case i if i % 2 == 1 => i * 2
}

doubledOdds.isDefinedAt(3) // true
List(1, 2, 3).collect(doubledOdds) // List(2, 6)
doubledOdds.applyOrElse(4, _ + 1) // 5""",
    [
        f"{S}/scala3/book/fun-partial-functions.html",
        f"{S}/scala3/book/collections-methods.html",
    ],
    {
        "en": "Use a partial function when only some inputs are meaningful, such as odd numbers or one case-class shape. Use an ordinary function when every input must produce a result.",
        "ru": "Частичная функция уместна, когда осмысленны только некоторые входы, например нечётные числа или одна форма case-класса. Обычная функция нужна, когда результат обязателен для каждого входа.",
    },
)

add(
    "How do you work with closures in Scala?",
    {
        "en": "A closure is a function value that reads names from the scope where it was created. Scala builds that value from an anonymous function, including the short `_` form passed to methods such as `map`.",
        "ru": "Замыкание — значение-функция, которое читает имена из области, где его создали. Scala строит такое значение из анонимной функции, включая короткую форму `_`, которую передают в методы вроде `map`.",
    },
    {
        "en": [
            "The Scala 3 book defines an anonymous function as a block passed to a higher-order function and not bound to its own name. `_ * 2` is that block.",
            "A surrounding `val` or `var` used inside the function is captured. The function still sees that binding when it runs later.",
            "Capturing a `var` means later assignments are visible. That is a side channel, so a pure pipeline prefers a `val`.",
            "The same capture is how a method can return a function, as in a prefix that closes over its tag.",
        ],
        "ru": [
            "Книга Scala 3 определяет анонимную функцию как блок, переданный функции высшего порядка и не привязанный к собственному имени. `_ * 2` — такой блок.",
            "`val` или `var` снаружи, использованный внутри функции, захватывается. Функция видит эту привязку и при более позднем вызове.",
            "Захват `var` делает видимыми последующие присваивания. Это побочный канал, поэтому чистому конвейеру лучше `val`.",
            "Тот же захват позволяет методу вернуть функцию, например префикс, замкнутый на свой тег.",
        ],
    },
    """val factor = 10
val scaled = List(1, 2, 3).map(_ * factor) // List(10, 20, 30)

def prefix(tag: String): String => String =
  value => s"$tag$value"

prefix("id:")("42") // id:42""",
    [
        f"{S}/scala3/book/fun-anonymous-functions.html",
        f"{S}/overviews/scala-book/anonymous-functions.html",
    ],
)

add(
    "What is tail recursion and how does Scala optimize it?",
    {
        "en": "A call is in tail position when it is the last thing the method does. The `@tailrec` annotation makes the compiler reject the method unless that call can be rewritten as a loop, so the stack stays constant.",
        "ru": "Вызов стоит в хвостовой позиции, если это последнее действие метода. Аннотация `@tailrec` заставляет компилятор отклонить метод, если этот вызов нельзя переписать в цикл, чтобы стек оставался постоянным.",
    },
    {
        "en": [
            "The tour shows `@tailrec` on a factorial helper whose recursive call is the whole `else` branch, with the product stored in an accumulator.",
            "A call such as `x * factorialHelper(x - 1)` is not in tail position: the multiplication still has to run after the call. The compiler reports “Recursive call not in tail position”.",
            "Error E097 also requires the method to be a real method, not abstract, and either `private` or `final`, so it cannot be overridden.",
            "The rewrite keeps one stack frame and updates the accumulator, which is why deep recursion over a list does not grow the stack.",
        ],
        "ru": [
            "Тур показывает `@tailrec` на помощнике факториала, где рекурсивный вызов — вся ветка `else`, а произведение лежит в аккумуляторе.",
            "Вызов вида `x * factorialHelper(x - 1)` не в хвостовой позиции: умножение ещё должно выполниться после вызова. Компилятор сообщает «Recursive call not in tail position».",
            "Ошибка E097 также требует, чтобы это был настоящий метод, не абстрактный, и либо `private`, либо `final`, чтобы его нельзя было переопределить.",
            "Переписывание держит один кадр стека и обновляет аккумулятор, поэтому глубокая рекурсия по списку не растит стек.",
        ],
    },
    """import scala.annotation.tailrec

def factorial(x: Int): Int =
  @tailrec
  def helper(n: Int, acc: Int): Int =
    if n <= 1 then acc else helper(n - 1, acc * n)
  helper(x, 1)""",
    [
        f"{S}/tour/annotations.html",
        f"{S}/scala3/reference/error-codes/E097.html",
    ],
    {
        "en": "Put the recursive call in tail position, with an accumulator, when the input can be large. Leave a non-tail recursion only when the depth is tiny and the shape is clearer that way.",
        "ru": "Ставьте рекурсивный вызов в хвостовую позицию с аккумулятором, когда вход может быть большим. Нехвостовую рекурсию оставляйте только при крошечной глубине, если так яснее форма.",
    },
)

add(
    "Explain the use of `map`, `flatMap`, and `filter` in Scala collections.",
    {
        "en": "`map`, `flatMap`, and `filter` build a new collection. On an immutable `List` they do not change the receiver.",
        "ru": "`map`, `flatMap` и `filter` строят новую коллекцию. На неизменяемом `List` они не меняют получателя.",
    },
    {
        "en": [
            "`map` applies a function to every element. `List(\"plum\", \"banana\").map(_.length)` is `List(4, 6)`.",
            "`filter` keeps elements that pass a predicate. `nums.filter(_ > 3)` drops the rest.",
            "`flatMap` applies a function that itself returns a collection, then concatenates those collections. `List(\"apple\", \"pear\").flatMap(_.toUpperCase)` flattens each string into characters.",
            "The methods exist across the collection hierarchy, so the same names work on `Vector`, `Set`, and `Map` as well as `List`.",
        ],
        "ru": [
            "`map` применяет функцию к каждому элементу. `List(\"plum\", \"banana\").map(_.length)` даёт `List(4, 6)`.",
            "`filter` оставляет элементы, прошедшие предикат. `nums.filter(_ > 3)` отбрасывает остальные.",
            "`flatMap` применяет функцию, которая сама возвращает коллекцию, и склеивает эти коллекции. `List(\"apple\", \"pear\").flatMap(_.toUpperCase)` разворачивает каждую строку в символы.",
            "Методы есть во всей иерархии коллекций, поэтому те же имена работают на `Vector`, `Set` и `Map`, не только на `List`.",
        ],
    },
    """val nums = List(5, 1, 3, 11, 7)
nums.filter(_ > 3).map(_ * 2) // List(10, 6, 22, 14)

List("apple", "pear").flatMap(_.toUpperCase)
// List(A, P, P, L, E, P, E, A, R)""",
    [
        f"{S}/scala3/book/collections-methods.html",
        f"{S}/scala3/book/fp-functions-are-values.html",
        f"{S}/overviews/collections-2.13/trait-iterable.html",
    ],
    {
        "en": "Use `map` for one result per element, `filter` to drop elements, and `flatMap` when each element becomes zero or more results that should sit in one collection.",
        "ru": "`map` — когда на элемент один результат, `filter` — чтобы выбросить элементы, `flatMap` — когда элемент становится нулём или несколькими результатами в одной коллекции.",
    },
)

add(
    "How does Scala provide support for lazy evaluation?",
    {
        "en": "Scala delays work in two library forms you opt into: a `lazy val` is computed on first use and then stored, and a `LazyList` does not compute an element until something asks for it.",
        "ru": "Scala откладывает работу в двух библиотечных формах, которые включают явно: `lazy val` считается при первом использовании и затем хранится, а `LazyList` не считает элемент, пока его не запросят.",
    },
    {
        "en": [
            "`LazyList.range(1, Int.MaxValue)` builds a description. `take` and `map` on it stay marked not computed until a strict operation forces elements.",
            "The collections book lists `LazyList` as the lazy immutable linked list for large or infinite sequences.",
            "A `lazy val` initializer runs at most once. Scala 3’s initialization scheme avoids holding a lock during the initializer; recursive `lazy val` initialization is undefined and can deadlock.",
            "Ordinary method arguments and `List.map` are strict. Laziness is the `lazy` modifier or a lazy collection, not the default.",
        ],
        "ru": [
            "`LazyList.range(1, Int.MaxValue)` строит описание. `take` и `map` на нём остаются «not computed», пока строгая операция не заставит элементы.",
            "Книга коллекций называет `LazyList` ленивым неизменяемым связным списком для больших или бесконечных последовательностей.",
            "Инициализатор `lazy val` выполняется не больше одного раза. Схема инициализации Scala 3 не держит блокировку во время инициализатора; рекурсивная инициализация `lazy val` не определена и может зависнуть.",
            "Обычные аргументы методов и `List.map` строгие. Ленивость — это модификатор `lazy` или ленивая коллекция, а не поведение по умолчанию.",
        ],
    },
    """lazy val table: Map[Int, Int] =
  (1 to 1000).map(n => n -> n * n).toMap

val huge = LazyList.range(1, Int.MaxValue)
huge.take(3).toList // List(1, 2, 3)""",
    [
        f"{S}/scala3/book/collections-classes.html",
        f"{S}/scala3/reference/changed-features/lazy-vals-init.html",
    ],
    {
        "en": "Use `lazy val` for an expensive value that many paths might skip. Use `LazyList` when the sequence may be infinite or you only need a prefix. Prefer a strict `List` or `Vector` when you will use every element anyway.",
        "ru": "`lazy val` — для дорогой величины, которую многие пути могут пропустить. `LazyList` — когда последовательность может быть бесконечной или нужен только префикс. Строгий `List` или `Vector` лучше, если элементы всё равно понадобятся все.",
    },
)

add(
    "What is the difference between mutable and immutable collections in Scala?",
    {
        "en": "Immutable collections live in `scala.collection.immutable` and return a new collection from transforming methods. Mutable collections live in `scala.collection.mutable` and can grow or shrink in place.",
        "ru": "Неизменяемые коллекции живут в `scala.collection.immutable`, и преобразующие методы возвращают новую коллекцию. Изменяемые живут в `scala.collection.mutable` и могут расти или сжиматься на месте.",
    },
    {
        "en": [
            "The usual immutable sequences are `List` (linear) and `Vector` (indexed). The usual mutable indexed sequence is `ArrayBuffer`; `ListBuffer` is the mutable linear buffer.",
            "The collections book states that methods on `List` do not mutate it. Adding an element builds another list.",
            "`Map` and `Set` exist in both packages. An unqualified `Map` or `List` in source is the immutable one.",
            "A buffer is the mutable sequence you update while building, then often convert to an immutable `List` or `Vector` before sharing it.",
        ],
        "ru": [
            "Обычные неизменяемые последовательности — `List` (линейный) и `Vector` (индексный). Обычная изменяемая индексная последовательность — `ArrayBuffer`; `ListBuffer` — изменяемый линейный буфер.",
            "Книга коллекций прямо говорит, что методы `List` его не мутируют. Добавление элемента строит другой список.",
            "`Map` и `Set` есть в обоих пакетах. Неквалифицированные `Map` и `List` в исходнике — неизменяемые.",
            "Буфер — изменяемая последовательность, которую обновляют при сборке и часто превращают в неизменяемый `List` или `Vector` перед тем, как отдать наружу.",
        ],
    },
    """val fixed = List(1, 2, 3)
val longer = 0 :: fixed // List(0, 1, 2, 3); fixed is unchanged

val buf = scala.collection.mutable.ArrayBuffer(1, 2, 3)
buf += 4
buf.toList""",
    [
        f"{S}/scala3/book/collections-classes.html",
        f"{S}/scala3/book/taste-collections.html",
        f"{S}/overviews/collections-2.13/overview.html",
    ],
    {
        "en": "Prefer immutable collections for values you pass around. Use `ArrayBuffer` or `ListBuffer` for a local builder that must update one structure many times.",
        "ru": "Неизменяемые коллекции предпочтительны для значений, которые передают дальше. `ArrayBuffer` или `ListBuffer` — для локального сборщика, который много раз обновляет одну структуру.",
    },
)

add(
    "How do you use tuples in Scala?",
    {
        "en": "A tuple is an immutable value with a fixed number of elements, each with its own type. It is the small product type for returning several values from a method.",
        "ru": "Кортеж — неизменяемое значение с фиксированным числом элементов, у каждого свой тип. Это маленький тип-произведение, чтобы вернуть из метода несколько значений.",
    },
    {
        "en": [
            "`(\"Sugar\", 25)` has type `(String, Int)`.",
            "Elements are read by position: `_1`, `_2`, and so on. Pattern matching binds the same slots by name.",
            "Tuples do not grow. A sequence of unknown length is a `List` or `Vector`, not a tuple.",
            "A pair is also how `Map` stores an entry, so tuple syntax shows up when building maps.",
        ],
        "ru": [
            "`(\"Sugar\", 25)` имеет тип `(String, Int)`.",
            "Элементы читают по позиции: `_1`, `_2` и далее. Сопоставление с образцом именует те же слоты.",
            "Кортеж не растёт. Последовательность неизвестной длины — это `List` или `Vector`, не кортеж.",
            "Пара — ещё и способ хранить запись `Map`, поэтому синтаксис кортежа появляется при сборке отображений.",
        ],
    },
    """def minMax(xs: List[Int]): (Int, Int) =
  (xs.min, xs.max)

val (lo, hi) = minMax(List(3, 1, 4))
val ingredient = ("Sugar", 25)
ingredient._1""",
    [f"{S}/tour/tuples.html"],
)

add(
    "Explain the role of iterators in Scala.",
    {
        "en": "An iterator is not a collection. It is a one-pass cursor: `hasNext` asks whether another element exists, and `next` returns it and advances.",
        "ru": "Итератор — не коллекция. Это курсор на один проход: `hasNext` спрашивает, есть ли ещё элемент, а `next` возвращает его и сдвигается.",
    },
    {
        "en": [
            "Calling `next` after the end throws `NoSuchElementException`.",
            "The collections guide walks an iterator with `while it.hasNext do println(it.next())`.",
            "Each `next` consumes the element. A second loop on the same iterator sees nothing left.",
            "Transformations on an iterator stay lazy until something pulls `next`, which is how you stream a large source without first copying it into a `List`.",
        ],
        "ru": [
            "Вызов `next` после конца бросает `NoSuchElementException`.",
            "Руководство по коллекциям обходит итератор так: `while it.hasNext do println(it.next())`.",
            "Каждый `next` потребляет элемент. Второй цикл по тому же итератору уже ничего не видит.",
            "Преобразования итератора остаются ленивыми, пока кто-то не вызовет `next`. Так читают большой источник, не копируя его сначала в `List`.",
        ],
    },
    """val it = List("a", "b", "c").iterator
val labels = List.newBuilder[String]
while it.hasNext do labels += it.next().toUpperCase
labels.result()""",
    [f"{S}/overviews/collections-2.13/iterators.html"],
    {
        "en": "Use an iterator to stream once. Use a `List` or `Vector` when you need to read the data again or share it.",
        "ru": "Итератор — чтобы пройти данные один раз. `List` или `Vector` — когда данные нужно прочитать снова или отдать нескольким местам.",
    },
)

add(
    "Discuss the difference between fold and reduce operations in Scala.",
    {
        "en": "`reduce` combines the elements of a non-empty collection into one value. `fold` does the same but starts from a seed you supply, so an empty collection can still produce that seed.",
        "ru": "`reduce` сворачивает элементы непустой коллекции в одно значение. `fold` делает то же, но начинает с заданного начального значения, поэтому пустая коллекция всё ещё может вернуть это значение.",
    },
    {
        "en": [
            "The collections book shows `reduce` applying a binary operation to successive elements and reducing the collection to a single value.",
            "`(1 to 10).toList.reduceLeft(_ + _)` is 55. `foldLeft(100)(_ + _)` is 155 because 100 is the seed.",
            "`Iterable` documents `foldLeft` / `foldRight` as starting from `z`, and `reduceLeft` / `reduceRight` as requiring a non-empty collection.",
            "`Left` walks from the start. `Right` walks from the end. A parallel `fold` needs an associative operator; the parallel-collections guide warns that a non-associative operator is not deterministic.",
        ],
        "ru": [
            "Книга коллекций показывает, что `reduce` применяет бинарную операцию к соседним элементам и сводит коллекцию к одному значению.",
            "`(1 to 10).toList.reduceLeft(_ + _)` равно 55. `foldLeft(100)(_ + _)` равно 155, потому что 100 — начальное значение.",
            "`Iterable` описывает `foldLeft` / `foldRight` как старт с `z`, а `reduceLeft` / `reduceRight` — как требование непустой коллекции.",
            "`Left` идёт от начала, `Right` — от конца. Параллельный `fold` требует ассоциативный оператор; руководство по параллельным коллекциям предупреждает, что неассоциативный оператор недетерминирован.",
        ],
    },
    """val firstTen = (1 to 10).toList
firstTen.reduceLeft(_ + _)    // 55
firstTen.foldLeft(100)(_ + _) // 155

List.empty[Int].foldLeft(0)(_ + _) // 0""",
    [
        f"{S}/scala3/book/collections-methods.html",
        f"{S}/scala3/book/taste-collections.html",
        f"{S}/overviews/collections-2.13/trait-iterable.html",
    ],
    {
        "en": "Use `foldLeft` when the collection might be empty or the result type differs from the element type. Use `reduceLeft` when every element is already a value of the result type and the collection is known to be non-empty.",
        "ru": "`foldLeft` — когда коллекция может быть пустой или тип результата отличается от типа элемента. `reduceLeft` — когда каждый элемент уже имеет тип результата и коллекция заведомо непуста.",
    },
)

add(
    "How do parallel collections work in Scala and what are their benefits?",
    {
        "en": "A parallel collection runs a collection operation by splitting the data, applying the operation on each part, and combining the results. From Scala 2.13 the implementation is a separate module; you opt in with `.par`.",
        "ru": "Параллельная коллекция выполняет операцию, разбивая данные, применяя операцию к каждой части и соединяя результаты. С Scala 2.13 реализация — отдельный модуль; её включают через `.par`.",
    },
    {
        "en": [
            "`list.par.map(_ + 42)` is the parallel form of `list.map`. `seq` converts back.",
            "Counterparts include `ParArray`, `ParVector`, parallel hash maps and sets, and `ParRange`. A `List` is copied into a `ParVector` because a linked list is inherently sequential.",
            "Speed-ups show up on large collections, typically several thousand elements. Tiny examples in the guide are only illustrations.",
            "Side effects and non-associative operators are not deterministic, because parts run concurrently and out of order. A parallel `fold` of `_ + _` is safe; appending into a shared `var` is not.",
        ],
        "ru": [
            "`list.par.map(_ + 42)` — параллельная форма `list.map`. `seq` возвращает последовательную коллекцию.",
            "Соответствия включают `ParArray`, `ParVector`, параллельные хеш-отображения и множества и `ParRange`. `List` копируется в `ParVector`, потому что связный список по природе последователен.",
            "Ускорение заметно на больших коллекциях, обычно в несколько тысяч элементов. Крошечные примеры в руководстве только иллюстрации.",
            "Побочные эффекты и неассоциативные операторы недетерминированы: части идут параллельно и не по порядку. Параллельный `fold` с `_ + _` безопасен; дописывание в общий `var` — нет.",
        ],
    },
    """val lastNames = List("Smith", "Jones", "Bach").par
lastNames.map(_.toUpperCase)

val total = (1 to 10000).toArray.par.fold(0)(_ + _)""",
    [
        f"{S}/overviews/parallel-collections/overview.html",
        f"{S}/overviews/parallel-collections/performance.html",
    ],
    {
        "en": "Use `.par` for a pure, associative operation on a large indexed collection such as `Array` or `Vector`. Stay sequential for small data, for order-sensitive work, or when the function writes shared state.",
        "ru": "`.par` — для чистой ассоциативной операции на большой индексной коллекции вроде `Array` или `Vector`. Последовательный вариант — для малых данных, работы, чувствительной к порядку, и функций, которые пишут общее состояние.",
    },
)

add(
    "What are Futures in Scala and how do you use them for asynchronous computation?",
    {
        "en": "A `Future` is a one-shot handle for a value that may not be ready yet, or for the exception if that value cannot be produced. The concurrency chapter prefers it to a raw `Thread` for a single slow computation.",
        "ru": "`Future` — одноразовый дескриптор значения, которого может ещё не быть, или исключения, если значение получить нельзя. Глава о конкурентности предпочитает его голому `Thread` для одного медленного вычисления.",
    },
    {
        "en": [
            "Creating the future starts the work. `Future { longRunningAlgorithm() }` returns immediately with `Future(<not completed>)`, so the next line is not blocked the way a direct call is.",
            "You need an `ExecutionContext`. The chapter’s example imports `ExecutionContext.Implicits.global`.",
            "`map`, `flatMap`, and `filter` transform the value inside. `onComplete` takes a partial function over `Success` and `Failure`.",
            "Several futures started before a `for` comprehension run independently; the `for` waits for each result. A future runs once. The same chapter contrasts that with an Akka actor, which is meant to live and answer many requests.",
        ],
        "ru": [
            "Создание future запускает работу. `Future { longRunningAlgorithm() }` сразу возвращает `Future(<not completed>)`, поэтому следующая строка не блокируется, как прямой вызов.",
            "Нужен `ExecutionContext`. Пример главы импортирует `ExecutionContext.Implicits.global`.",
            "`map`, `flatMap` и `filter` преобразуют значение внутри. `onComplete` принимает частичную функцию по `Success` и `Failure`.",
            "Несколько future, запущенных до `for`, идут независимо; `for` ждёт каждый результат. Future выполняется один раз. Та же глава противопоставляет это актору Akka, который живёт и отвечает на много запросов.",
        ],
    },
    """import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

def loadQuote(symbol: String)(using ExecutionContext): Future[Int] =
  Future {
    symbol.length
  }

def combined(using ExecutionContext): Future[Int] =
  val usd = loadQuote("USD")
  val chf = loadQuote("CHF")
  for
    a <- usd
    b <- chf
  yield a + b""",
    [
        f"{S}/scala3/book/concurrency.html",
        f"{S}/overviews/core/futures.html",
    ],
)

add(
    "Explain the difference between an Actor and a Thread in Scala concurrency.",
    {
        "en": "A `Thread` is the JVM mechanism that runs code. A Scala `Future` is a one-shot computation on some thread. An Akka actor, as the Scala concurrency chapter describes it, is a long-lived process that answers many requests over its life.",
        "ru": "`Thread` — механизм JVM, который выполняет код. `Future` в Scala — одноразовое вычисление на каком-то потоке. Актор Akka, как его описывает глава Scala о конкурентности, — долгоживущий процесс, который за жизнь отвечает на много запросов.",
    },
    {
        "en": [
            "Calling a method on the current thread blocks until it returns. Wrapping that method in `Future` moves the wait off the caller.",
            "A future eventually holds one result, or one failure, from a computation that ran once.",
            "The chapter states that an actor may live for a long time and respond to many requests, whereas a future does not.",
            "You still need threads underneath: the future’s `ExecutionContext` schedules work onto them. The actor model is a way to share those threads without locking every piece of state yourself.",
        ],
        "ru": [
            "Вызов метода в текущем потоке блокирует его до возврата. Обёртка в `Future` уносит ожидание с вызывающего.",
            "Future в итоге хранит один результат или одну ошибку вычисления, которое прошло один раз.",
            "Глава говорит, что актор может жить долго и отвечать на много запросов, а future — нет.",
            "Потоки всё равно нужны снизу: `ExecutionContext` future ставит работу на них. Модель акторов — способ делить эти потоки, не запирая каждое состояние самому.",
        ],
    },
    """import scala.concurrent.{ExecutionContext, Future}

def onThisThread(): Int =
  42

def offThisThread()(using ExecutionContext): Future[Int] =
  Future(onThisThread())""",
    [f"{S}/scala3/book/concurrency.html"],
    {
        "en": "Use a `Future` for one result, such as a single remote call. Use an actor when one identity must process a stream of messages over time. Reach for `new Thread` only when you are integrating with an API that demands a thread.",
        "ru": "`Future` — для одного результата, например одного удалённого вызова. Актор — когда одна сущность должна обрабатывать поток сообщений во времени. `new Thread` — только если API прямо требует поток.",
    },
)

add(
    "How does Scala handle synchronization and concurrency control?",
    {
        "en": "Scala does not invent a second memory model. Shared mutation is still the JVM’s, and `AnyRef` exposes a final `synchronized` method. The concurrency chapter’s preferred control for a single result is a `Future` plus an `ExecutionContext`, not a hand-rolled lock.",
        "ru": "Scala не вводит вторую модель памяти. Общая мутация остаётся моделью JVM, а `AnyRef` даёт финальный метод `synchronized`. Предпочтительный контроль одного результата в главе о конкурентности — `Future` плюс `ExecutionContext`, а не замок, написанный вручную.",
    },
    {
        "en": [
            "`Future` work runs on the execution context’s threads. Transformations such as `map` schedule the next step instead of blocking the caller.",
            "Parallel collections split a pure operation. The overview says a side-effecting operation on a parallel collection is not deterministic.",
            "`AnyRef.synchronized` is the final method the standard-library API documents for running a section under that object’s monitor.",
            "Immutable data removes the need for that monitor: a `val` list shared across futures is safe to read because methods such as `map` return a new list.",
        ],
        "ru": [
            "Работа `Future` идёт на потоках контекста выполнения. Преобразования вроде `map` планируют следующий шаг и не блокируют вызывающего.",
            "Параллельные коллекции дробят чистую операцию. Обзор говорит, что операция с побочным эффектом на параллельной коллекции недетерминирована.",
            "`AnyRef.synchronized` — финальный метод, который API стандартной библиотеки документирует для участка под монитором этого объекта.",
            "Неизменяемые данные снимают нужду в мониторе: `val`-список, общий для нескольких future, можно читать, потому что методы вроде `map` возвращают новый список.",
        ],
    },
    """import scala.concurrent.{ExecutionContext, Future}

def publish(n: Int)(using ExecutionContext): Future[Int] =
  Future(n * 2)

def exclusive(lock: AnyRef, balance: Int): Int =
  lock.synchronized(balance + 1)""",
    [
        f"{S}/scala3/book/concurrency.html",
        "https://www.scala-lang.org/api/current/scala/AnyRef.html",
        f"{S}/overviews/parallel-collections/overview.html",
    ],
    {
        "en": "Prefer an immutable value inside a `Future` when the job is one computation. Use `synchronized` only around a short update of shared mutable state that truly must be exclusive.",
        "ru": "Неизменяемое значение внутри `Future` предпочтительно, когда задача — одно вычисление. `synchronized` — только вокруг короткого обновления общего изменяемого состояния, которое действительно должно быть исключительным.",
    },
)

add(
    "What is the Akka framework and how does it relate to Scala?",
    {
        "en": "Akka is the actor toolkit the Scala concurrency chapter names for long-lived concurrent processes. A Scala `Future` runs one computation; an Akka actor stays up and answers many messages.",
        "ru": "Akka — инструментарий акторов, который глава Scala о конкурентности называет для долгоживущих конкурентных процессов. `Future` в Scala выполняет одно вычисление; актор Akka остаётся живым и отвечает на много сообщений.",
    },
    {
        "en": [
            "The chapter’s contrast is explicit: an actor may live for a long time and respond to many requests, while a future holds the result of a computation that ran once.",
            "Actors are how you model a service that keeps its own state and mailbox, instead of sharing a `var` across threads.",
            "Scala itself still supplies `Future`, parallel collections, and `AnyRef.synchronized`. Akka sits on that JVM, it is not a keyword of the language.",
            "The same Scala functions you pass to `map` are the behavior you send as messages: small immutable values in, immutable values out.",
        ],
        "ru": [
            "Противопоставление в главе прямое: актор может жить долго и отвечать на много запросов, а future хранит результат вычисления, которое прошло один раз.",
            "Акторы моделируют сервис со своим состоянием и почтовым ящиком вместо общего `var` между потоками.",
            "Сам язык по-прежнему даёт `Future`, параллельные коллекции и `AnyRef.synchronized`. Akka стоит на этой JVM, это не ключевое слово языка.",
            "Те же функции Scala, которые передают в `map`, становятся поведением сообщений: на вход маленькие неизменяемые значения, на выход тоже.",
        ],
    },
    """import scala.concurrent.{ExecutionContext, Future}

def oneShot()(using ExecutionContext): Future[String] =
  Future("done once")

// An Akka actor is the long-lived counterpart the concurrency chapter
// contrasts with this one-shot Future.
oneShot()""",
    [
        f"{S}/scala3/book/concurrency.html",
        "https://doc.akka.io/libraries/akka-core/current/typed/index.html",
    ],
)

add(
    "Name some popular machine learning libraries that support Scala.",
    {
        "en": "On the JVM, Scala calls the same libraries Java calls. The Spark machine-learning guide names MLlib as Spark’s library for scalable learning, and Breeze is the numerical library aimed at Scala.",
        "ru": "На JVM Scala вызывает те же библиотеки, что и Java. Руководство Spark по машинному обучению называет MLlib библиотекой Spark для масштабируемого обучения, а Breeze — численная библиотека, нацеленная на Scala.",
    },
    {
        "en": [
            "MLlib’s stated goal is practical machine learning that is scalable and easy. It lists algorithms, featurization, pipelines, persistence, and utilities.",
            "The same guide says the DataFrame-based API is now primary. The RDD-based API is in maintenance mode and does not receive new features.",
            "Breeze describes itself as a library for numerical processing: generic, clean, and powerful. Its readme documents the `org.scalanlp` %% `breeze` dependency.",
            "GraphX, in the Spark GraphX guide, adds graph-parallel computation on the same cluster. Scala is the language of the Spark shell examples, not a separate runtime.",
        ],
        "ru": [
            "Заявленная цель MLlib — практичное машинное обучение, масштабируемое и простое. В списке алгоритмы, признаки, конвейеры, сохранение и утилиты.",
            "То же руководство говорит, что основной теперь API на DataFrame. API на RDD в режиме сопровождения и не получает новых возможностей.",
            "Breeze описывает себя как библиотеку численной обработки: обобщённую, ясную и мощную. Readme документирует зависимость `org.scalanlp` %% `breeze`.",
            "GraphX в руководстве Spark добавляет графо-параллельные вычисления на том же кластере. Scala — язык примеров оболочки Spark, а не отдельная среда выполнения.",
        ],
    },
    """// build.sbt — coordinates published by the Breeze readme
// libraryDependencies += "org.scalanlp" %% "breeze" % "2.1.0"

def dot(xs: Seq[Double], ys: Seq[Double]): Double =
  xs.zip(ys).map(_ * _).sum""",
    [
        "https://spark.apache.org/docs/latest/ml-guide.html",
        "https://github.com/scalanlp/breeze",
        "https://spark.apache.org/docs/latest/graphx-programming-guide.html",
    ],
)

add(
    "How does the Breeze library facilitate scientific computing in Scala?",
    {
        "en": "Breeze is a Scala numerical-processing library. Its own readme says it aims to be generic, clean, and powerful without giving up much efficiency, and it publishes a Scala 3 / 2.13 / 2.12 artifact.",
        "ru": "Breeze — библиотека численной обработки для Scala. Её readme говорит, что цель — быть обобщённой, ясной и мощной, не теряя много в эффективности, и публикует артефакт для Scala 3 / 2.13 / 2.12.",
    },
    {
        "en": [
            "You add `\"org.scalanlp\" %% \"breeze\" % \"2.1.0\"`. Visualization is a separate `breeze-viz` artifact and depends on LGPL code.",
            "From Breeze 1.3, native linear-algebra backends come from netlib, bundled by default, instead of an older `breeze-natives` artifact.",
            "The project’s own status line says it is mostly retired: bug-fix reviews, not active feature work. Pin a version rather than expecting a moving API.",
            "The quickstart and linear-algebra cheat sheet linked from the readme are the usage pages. Dense vectors and matrices are that library’s job; a Scala `Seq` is only the language collection underneath.",
        ],
        "ru": [
            "Добавляют `\"org.scalanlp\" %% \"breeze\" % \"2.1.0\"`. Визуализация — отдельный артефакт `breeze-viz`, он зависит от кода под LGPL.",
            "С Breeze 1.3 нативные бэкенды линейной алгебры идут из netlib и входят по умолчанию, вместо старого артефакта `breeze-natives`.",
            "Собственная строка статуса проекта говорит, что он в основном на покое: ревью исправлений, не активная разработка возможностей. Фиксируйте версию.",
            "Quickstart и шпаргалка по линейной алгебре, на которые ссылается readme, — страницы использования. Плотные векторы и матрицы — задача этой библиотеки; `Seq` в Scala — только коллекция языка под ней.",
        ],
    },
    """// libraryDependencies += "org.scalanlp" %% "breeze" % "2.1.0"
// Dense linear algebra lives in Breeze; this is the same dot product
// expressed with the Scala collections the language already documents.
def dot(xs: Seq[Double], ys: Seq[Double]): Double =
  xs.zip(ys).foldLeft(0.0) { case (acc, (x, y)) => acc + x * y }""",
    [
        "https://github.com/scalanlp/breeze",
        "https://github.com/scalanlp/breeze/wiki/Quickstart",
        f"{S}/scala3/book/collections-methods.html",
    ],
)

add(
    "What are Saddle and Algebird, and how do they contribute to machine learning operations in Scala?",
    {
        "en": "Saddle and Algebird are not part of the Scala language. The operations they are chosen for — columnar frames and associative aggregations — are the same operations the Scala collections and Spark MLlib guides already name: map, reduce, and distributed combine.",
        "ru": "Saddle и Algebird не входят в язык Scala. Операции, ради которых их выбирают — колоночные кадры и ассоциативные агрегации — те же, которые уже называют руководства по коллекциям Scala и Spark MLlib: map, reduce и распределённое объединение.",
    },
    {
        "en": [
            "A frame of columns is, in the language, a collection of tuples or a `Map`. `map` and `filter` on that collection are the documented transformations.",
            "An aggregation that can be split and combined is a `fold` with an associative operator. The parallel-collections guide requires that associativity for a deterministic parallel fold.",
            "Spark MLlib’s guide lists utilities for statistics and data handling, and says the DataFrame API is the primary machine-learning API. That is the cluster form of the same split-and-combine.",
            "Reach for a third-party frame or algebra library only after the standard collection or the Spark DataFrame cannot express the operation. Do not invent their types in place of `List` and `foldLeft`.",
        ],
        "ru": [
            "Кадр из колонок на языке — коллекция кортежей или `Map`. `map` и `filter` на этой коллекции — документированные преобразования.",
            "Агрегация, которую можно разбить и собрать, — это `fold` с ассоциативным оператором. Руководство по параллельным коллекциям требует эту ассоциативность для детерминированного параллельного fold.",
            "Руководство MLlib перечисляет утилиты статистики и работы с данными и говорит, что API DataFrame — основной API машинного обучения. Это кластерная форма того же «разбить и собрать».",
            "Стороннюю библиотеку кадров или алгебры берут, только если стандартная коллекция или DataFrame Spark не выражают операцию. Не подменяйте их типы вместо `List` и `foldLeft`.",
        ],
    },
    """def columnMean(xs: List[Double]): Double =
  xs.foldLeft(0.0)(_ + _) / xs.length

def mergeCounts(a: Map[String, Int], b: Map[String, Int]): Map[String, Int] =
  b.foldLeft(a) { case (acc, (k, v)) =>
    acc.updated(k, acc.getOrElse(k, 0) + v)
  }""",
    [
        f"{S}/scala3/book/collections-methods.html",
        f"{S}/overviews/parallel-collections/overview.html",
        "https://spark.apache.org/docs/latest/ml-guide.html",
    ],
)

add(
    "Explain the concept of inheritance in Scala.",
    {
        "en": "Inheritance in Scala is subtyping: an instance of a subclass can be used where a superclass is expected. The Scala 3 OOP chapter says traits, not classes, are the primary tool for splitting a design.",
        "ru": "Наследование в Scala — это подтипирование: экземпляр подкласса можно использовать там, где ждут суперкласс. Глава ООП Scala 3 говорит, что главный инструмент разбиения проекта — трейты, а не классы.",
    },
    {
        "en": [
            "A class `extends` a trait and implements its abstract members. Concrete members of the trait are provided to the subclass.",
            "The tour describes traits as a way to share interfaces and fields. A trait is not instantiated on its own.",
            "A class extends one class. Further traits are mixed in. The mixin-composition tour starts from an abstract class and adds traits.",
            "Override a concrete member with `override`. Subtyping is what lets a `Document` that extends `Showable` be passed to code that only needs `show`.",
        ],
        "ru": [
            "Класс делает `extends` трейта и реализует его абстрактные члены. Конкретные члены трейта достаются подклассу.",
            "Тур описывает трейты как способ делить интерфейсы и поля. Сам по себе трейт не создают.",
            "Класс наследует один класс. Дальнейшие трейты подмешивают. Тур по mixin-композиции начинает с абстрактного класса и добавляет трейты.",
            "Конкретный член переопределяют через `override`. Подтипирование позволяет передать `Document`, который расширяет `Showable`, туда, где нужен только `show`.",
        ],
    },
    """trait Showable:
  def show: String

class Document(text: String) extends Showable:
  def show = text

def render(s: Showable): String = s.show
render(Document("notes"))""",
    [
        f"{S}/scala3/book/domain-modeling-oop.html",
        f"{S}/tour/traits.html",
        f"{S}/tour/classes.html",
    ],
)

add(
    "How do abstract classes work in Scala?",
    {
        "en": "An abstract class is a class you cannot instantiate because some members are still abstract. The Scala book says traits cover most of that job, and an abstract class is the tool when the base needs constructor parameters or Java must call the type.",
        "ru": "Абстрактный класс — класс, который нельзя создать, потому что часть членов ещё абстрактна. Книга Scala говорит, что трейты закрывают большую часть этой задачи, а абстрактный класс нужен, когда базе требуются параметры конструктора или тип должен вызываться из Java.",
    },
    {
        "en": [
            "The Scala 2 book notes that a trait, as that book describes it, does not take constructor parameters, so a base that must receive arguments is an abstract class.",
            "A class can extend only one abstract class. Extra behavior is mixed in as traits.",
            "Java does not know Scala traits. The same book says to use an abstract class when Java code will call the base.",
            "Subclasses implement the abstract members and may call the superclass constructor with arguments.",
        ],
        "ru": [
            "Книга Scala 2 отмечает, что трейт, как она его описывает, не принимает параметры конструктора, поэтому база, которой нужны аргументы, — абстрактный класс.",
            "Класс может расширить только один абстрактный класс. Дополнительное поведение подмешивают трейтами.",
            "Java не знает трейтов Scala. Та же книга советует абстрактный класс, когда базовый тип будет вызывать код на Java.",
            "Подклассы реализуют абстрактные члены и могут вызвать конструктор суперкласса с аргументами.",
        ],
    },
    """abstract class Shape(val name: String):
  def area: Double

class Square(side: Double) extends Shape("square"):
  def area = side * side""",
    [
        f"{S}/overviews/scala-book/abstract-classes.html",
        f"{S}/tour/traits.html",
        f"{S}/scala3/reference/other-new-features/trait-parameters.html",
    ],
    {
        "en": "Use a trait when you are sharing an interface inside Scala. Use an abstract class when the base must take constructor arguments in the style the Scala book describes, or when Java will extend or call it. A class still has only one superclass.",
        "ru": "Трейт — когда интерфейс делят внутри Scala. Абстрактный класс — когда базе нужны аргументы конструктора в том виде, как описывает книга Scala, или когда её будет расширять или вызывать Java. Суперкласс у класса всё равно один.",
    },
)

add(
    "What are companion objects in Scala?",
    {
        "en": "A companion object is a singleton `object` with the same name as a class, defined next to it. The class and the object can see each other’s private members.",
        "ru": "Объект-компаньон — синглтон `object` с тем же именем, что и класс, объявленный рядом. Класс и объект видят приватные члены друг друга.",
    },
    {
        "en": [
            "The Scala book shows that an `apply` method on the companion is why `List(1, 2, 3)` constructs a list without writing `new`.",
            "The tour says an `object` is a class with exactly one instance, created lazily when it is referenced, like a lazy val.",
            "Factory methods and private constructors live on the companion so callers use the factory instead of `new`.",
            "A companion is not a second instance of the class. It is the place for methods that do not need a particular instance.",
        ],
        "ru": [
            "Книга Scala показывает, что метод `apply` на компаньоне — причина, почему `List(1, 2, 3)` строит список без `new`.",
            "Тур говорит, что `object` — класс ровно с одним экземпляром, создаваемый лениво при первом обращении, как lazy val.",
            "Фабрики и приватные конструкторы живут на компаньоне, чтобы вызывающий шёл через фабрику, а не через `new`.",
            "Компаньон — не второй экземпляр класса. Это место для методов, которым не нужен конкретный экземпляр.",
        ],
    },
    """class User private (val id: Long)

object User:
  def apply(id: Long): User =
    require(id > 0)
    new User(id)

val user = User(7)""",
    [
        f"{S}/overviews/scala-book/companion-objects.html",
        f"{S}/tour/singleton-objects.html",
    ],
)

add(
    "Describe the use of mixins and trait composition.",
    {
        "en": "A mixin is a trait used to compose a class. Mixin composition stacks several traits so each supplies some members and can rely on abstract members that another part implements.",
        "ru": "Mixin — это трейт, которым собирают класс. Композиция трейтов складывает несколько трейтов: каждый даёт часть членов и может опираться на абстрактные члены, которые реализует другая часть.",
    },
    {
        "en": [
            "The OOP chapter calls abstract members required services and concrete members provided services.",
            "A class `extends` the first trait or class and adds more with `with`.",
            "The mixin tour starts from an abstract class with an abstract `message` and mixes in traits that use it.",
            "Order matters when two traits implement the same member: linearization picks the winner. Keep each trait small so the stack stays readable.",
        ],
        "ru": [
            "Глава ООП называет абстрактные члены требуемыми сервисами, а конкретные — предоставляемыми.",
            "Класс делает `extends` первого трейта или класса и добавляет остальные через `with`.",
            "Тур по mixin начинает с абстрактного класса с абстрактным `message` и подмешивает трейты, которые его используют.",
            "Порядок важен, когда два трейта реализуют один член: линеаризация выбирает победителя. Держите трейты маленькими, чтобы стек читался.",
        ],
    },
    """trait Greeting:
  def translate(text: String): String
  def sayHello = translate("Hello")

trait English extends Greeting:
  def translate(text: String) = text

class Greeter extends English

Greeter().sayHello""",
    [
        f"{S}/scala3/book/domain-modeling-oop.html",
        f"{S}/tour/mixin-class-composition.html",
    ],
)

add(
    "Write a Scala function to compute the factorial of a number using tail recursion.",
    {
        "en": "The factorial of n is the product of the integers from 1 through n. The tour’s `@tailrec` example keeps that product in an accumulator so the recursive call is the whole remaining expression.",
        "ru": "Факториал n — произведение целых от 1 до n. Пример `@tailrec` в туре хранит это произведение в аккумуляторе, чтобы рекурсивный вызов был всем оставшимся выражением.",
    },
    {
        "en": [
            "The helper takes the remaining integer and the accumulator. At `n <= 1` it returns the accumulator.",
            "The recursive call is `helper(n - 1, acc * n)`, which is in tail position. Multiplying after the call would not be.",
            "`@tailrec` fails the compilation if that shape is broken, including error E097 when the method is overridable.",
            "The outer method only starts the helper at `(x, 1)`.",
        ],
        "ru": [
            "Помощник принимает оставшееся число и аккумулятор. При `n <= 1` он возвращает аккумулятор.",
            "Рекурсивный вызов — `helper(n - 1, acc * n)`, он в хвостовой позиции. Умножение после вызова ею не было бы.",
            "`@tailrec` ломает компиляцию, если эта форма нарушена, включая ошибку E097, когда метод можно переопределить.",
            "Внешний метод только запускает помощника с `(x, 1)`.",
        ],
    },
    """import scala.annotation.tailrec

def factorial(x: Int): Int =
  @tailrec
  def helper(n: Int, acc: Int): Int =
    if n <= 1 then acc else helper(n - 1, acc * n)
  helper(x, 1)""",
    [
        f"{S}/tour/annotations.html",
        f"{S}/scala3/reference/error-codes/E097.html",
    ],
)

add(
    "Implement a function in Scala that verifies if a list of integers is sorted.",
    {
        "en": "A list of integers is sorted ascending when every element is less than or equal to the next. `zip` and `forall` express that check without a hand-written index loop.",
        "ru": "Список целых отсортирован по возрастанию, если каждый элемент не больше следующего. `zip` и `forall` выражают эту проверку без ручного цикла по индексу.",
    },
    {
        "en": [
            "Pair each element with the following one: `xs.zip(xs.tail)`.",
            "`forall` returns true only if every pair passes `<=`. An empty list and a one-element list have no failing pair, so they are sorted.",
            "These methods return a new result and do not mutate the list, which is the contract the collections book states for `List`.",
            "A failing pair stops the check. You do not need to sort a copy and compare.",
        ],
        "ru": [
            "Каждый элемент ставят в пару со следующим: `xs.zip(xs.tail)`.",
            "`forall` истинен, только если каждая пара проходит `<=`. У пустого списка и списка из одного элемента нет плохой пары, они отсортированы.",
            "Эти методы возвращают новый результат и не мутируют список — это контракт, который книга коллекций задаёт для `List`.",
            "Плохая пара останавливает проверку. Копию сортировать и сравнивать не нужно.",
        ],
    },
    """def isSorted(xs: List[Int]): Boolean =
  xs.zip(xs.drop(1)).forall((a, b) => a <= b)

isSorted(List(1, 2, 2, 4))
isSorted(Nil)""",
    [
        f"{S}/scala3/book/collections-methods.html",
        f"{S}/tour/tuples.html",
    ],
)

add(
    "Create a Scala class that represents a Matrix and a method to multiply two matrices.",
    {
        "en": "A matrix here is a rectangular `Vector` of rows, each row a `Vector[Double]`. The product `C(i)(j)` is the dot of row `i` of the left matrix with column `j` of the right, which is a `map` over a fixed width.",
        "ru": "Матрица здесь — прямоугольный `Vector` строк, каждая строка — `Vector[Double]`. Элемент произведения `C(i)(j)` — скалярное произведение строки `i` левой матрицы и столбца `j` правой, то есть `map` по фиксированной ширине.",
    },
    {
        "en": [
            "Store rows in an immutable `Vector` so indexing a row is the indexed-sequence case the collections book recommends.",
            "Width of the left matrix must equal height of the right. The method checks that before building the result.",
            "Column `j` is `b.rows.map(_(j))`. The dot is `zip` then `map` of the product then `sum`, the same reduce the collections book shows.",
            "The result is a new `Matrix`. Neither input is updated.",
        ],
        "ru": [
            "Строки хранят в неизменяемом `Vector`: индексация строки — тот индексный случай, который рекомендует книга коллекций.",
            "Ширина левой матрицы должна равняться высоте правой. Метод проверяет это до сборки результата.",
            "Столбец `j` — это `b.rows.map(_(j))`. Скалярное произведение — `zip`, затем `map` произведения и `sum`, тот же reduce, что в книге коллекций.",
            "Результат — новая `Matrix`. Ни один вход не обновляется.",
        ],
    },
    """final case class Matrix(rows: Vector[Vector[Double]]):
  def multiply(b: Matrix): Matrix =
    require(rows.head.size == b.rows.size)
    val cols = b.rows.head.indices.map(j => b.rows.map(_(j))).toVector
    Matrix(rows.map { row =>
      cols.map(col => row.zip(col).map(_ * _).sum)
    })""",
    [
        f"{S}/scala3/book/collections-classes.html",
        f"{S}/scala3/book/collections-methods.html",
        f"{S}/tour/classes.html",
    ],
)

add(
    "Write a Scala program to read a CSV file and calculate the average value of a numeric column.",
    {
        "en": "A CSV average is a `fold` over the lines of a file: skip the header, parse one column, and divide the sum by the count. `scala.io.Source` is the standard-library reader; the arithmetic is an ordinary `foldLeft`.",
        "ru": "Среднее по CSV — это `fold` по строкам файла: пропустить заголовок, разобрать один столбец и поделить сумму на число. `scala.io.Source` — читатель стандартной библиотеки; арифметика — обычный `foldLeft`.",
    },
    {
        "en": [
            "`Source.fromFile` yields lines. `getLines` is an iterator, so the file is not first copied into a random-access matrix.",
            "Drop the header, `split` on commas, and read the chosen index. `toDouble` parses the field.",
            "`foldLeft` on `(0.0, 0)` keeps sum and count, including the empty case the collections book contrasts with `reduce`.",
            "Close the source when the fold finishes so the file handle does not stay open.",
        ],
        "ru": [
            "`Source.fromFile` даёт строки. `getLines` — итератор, поэтому файл не копируют сначала в матрицу произвольного доступа.",
            "Заголовок отбрасывают, делят по запятым и читают нужный индекс. `toDouble` разбирает поле.",
            "`foldLeft` по `(0.0, 0)` хранит сумму и счётчик, включая пустой случай, который книга коллекций противопоставляет `reduce`.",
            "Источник закрывают, когда fold закончился, чтобы дескриптор файла не оставался открытым.",
        ],
    },
    """import scala.io.Source

def averageColumn(path: String, column: Int): Double =
  val source = Source.fromFile(path)
  try
    val (sum, n) = source.getLines().drop(1).foldLeft((0.0, 0)) { case ((s, c), line) =>
      val cell = line.split(",", -1)(column).toDouble
      (s + cell, c + 1)
    }
    if n == 0 then 0.0 else sum / n
  finally source.close()""",
    [
        "https://www.scala-lang.org/api/current/scala/io/Source.html",
        f"{S}/scala3/book/taste-collections.html",
        f"{S}/overviews/collections-2.13/iterators.html",
    ],
)

add(
    "Implement a simple decision tree algorithm in Scala.",
    {
        "en": "A decision tree is a nested choice: a leaf predicts a label, an internal node tests one feature and picks a child. Pattern matching on a `sealed` hierarchy is the Scala form of that choice.",
        "ru": "Дерево решений — вложенный выбор: лист предсказывает метку, внутренний узел проверяет один признак и выбирает ребёнка. Сопоставление с образцом по `sealed`-иерархии — форма этого выбора в Scala.",
    },
    {
        "en": [
            "A `sealed trait` with `Leaf` and `Branch` makes the set of nodes closed. The compiler checks that `predict` handles both.",
            "`Branch` stores a feature index, a threshold, and two subtrees. `predict` compares `features(index)` with the threshold.",
            "The walk is a direct recursive call on one child. It is not a collection `map`.",
            "Training a split by impurity is a separate search over candidate thresholds. The structure below is the model you evaluate; Spark’s guide lists decision trees as one of its learning methods when the data no longer fits one process.",
        ],
        "ru": [
            "`sealed trait` с `Leaf` и `Branch` замыкает набор узлов. Компилятор проверяет, что `predict` обрабатывает оба.",
            "`Branch` хранит индекс признака, порог и два поддерева. `predict` сравнивает `features(index)` с порогом.",
            "Обход — прямой рекурсивный вызов одного ребёнка. Это не `map` по коллекции.",
            "Обучение разбиения по неоднородности — отдельный перебор порогов. Структура ниже — модель, которую вычисляют; руководство Spark перечисляет деревья решений среди методов обучения, когда данные уже не помещаются в один процесс.",
        ],
    },
    """enum Tree:
  case Leaf(label: String)
  case Branch(index: Int, threshold: Double, left: Tree, right: Tree)

def predict(tree: Tree, features: Vector[Double]): String =
  tree match
    case Tree.Leaf(label) => label
    case Tree.Branch(index, threshold, left, right) =>
      if features(index) <= threshold then predict(left, features)
      else predict(right, features)""",
    [
        f"{S}/tour/pattern-matching.html",
        f"{S}/scala3/book/collections-classes.html",
        "https://spark.apache.org/docs/latest/ml-classification-regression.html",
    ],
)

add(
    "Use Scala to perform text preprocessing for natural language processing (e.g., tokenization, normalization).",
    {
        "en": "Tokenization and normalization here are `String` operations inside `map`: lowercase, drop punctuation, and split on whitespace. The result is a `List[String]` built with the collection methods the Scala book documents.",
        "ru": "Токенизация и нормализация здесь — операции `String` внутри `map`: нижний регистр, снятие пунктуации и разбиение по пробелам. Результат — `List[String]`, собранный методами коллекций, которые документирует книга Scala.",
    },
    {
        "en": [
            "`toLowerCase` normalizes case. `filter` on characters keeps letters, digits, and spaces.",
            "`split` on whitespace yields the tokens. `filter(_.nonEmpty)` drops blanks.",
            "`flatMap` on a list of lines concatenates the token lists into one sequence, which is the `flatMap` contract in the collections book.",
            "This is the whole preprocessing step. A model on a cluster would then hand the tokens to Spark MLlib’s featurization, which the MLlib guide lists separately from the algorithms.",
        ],
        "ru": [
            "`toLowerCase` нормализует регистр. `filter` по символам оставляет буквы, цифры и пробелы.",
            "`split` по пробелам даёт токены. `filter(_.nonEmpty)` убирает пустые.",
            "`flatMap` по списку строк склеивает списки токенов в одну последовательность — это контракт `flatMap` в книге коллекций.",
            "Это весь шаг предобработки. Модель на кластере затем отдаёт токены в выделение признаков MLlib, которое руководство MLlib перечисляет отдельно от алгоритмов.",
        ],
    },
    """def tokens(line: String): List[String] =
  line.toLowerCase
    .filter(ch => ch.isLetterOrDigit || ch.isWhitespace)
    .split("\\\\s+")
    .toList
    .filter(_.nonEmpty)

def tokenize(lines: List[String]): List[String] =
  lines.flatMap(tokens)""",
    [
        f"{S}/scala3/book/collections-methods.html",
        "https://spark.apache.org/docs/latest/ml-guide.html",
    ],
)

add(
    "Write a Scala function that performs element-wise addition of two vectors.",
    {
        "en": "Element-wise addition pairs values that share an index and adds each pair. `zip` builds those pairs and `map` adds them, which is the collection `map` from the Scala book.",
        "ru": "Поэлементное сложение ставит в пары значения с одним индексом и складывает каждую пару. `zip` строит пары, `map` их складывает — это коллекционный `map` из книги Scala.",
    },
    {
        "en": [
            "`xs.zip(ys)` stops at the shorter vector, so the function checks equal length first.",
            "The result is a new `Vector`. Inputs stay unchanged, matching the immutable-sequence contract.",
            "`Vector` is the indexed immutable sequence the collections book recommends when you need fast access by position.",
            "A numeric library such as Breeze packages the same idea for dense arrays. The operation itself does not require it.",
        ],
        "ru": [
            "`xs.zip(ys)` останавливается на более коротком векторе, поэтому функция сначала проверяет равную длину.",
            "Результат — новый `Vector`. Входы не меняются, как требует контракт неизменяемой последовательности.",
            "`Vector` — индексная неизменяемая последовательность, которую книга коллекций рекомендует, когда нужен быстрый доступ по позиции.",
            "Численная библиотека вроде Breeze упаковывает ту же идею для плотных массивов. Самой операции она не требуется.",
        ],
    },
    """def add(xs: Vector[Double], ys: Vector[Double]): Vector[Double] =
  require(xs.length == ys.length)
  xs.zip(ys).map(_ + _)""",
    [
        f"{S}/scala3/book/collections-methods.html",
        f"{S}/scala3/book/collections-classes.html",
    ],
)

add(
    "Discuss implicits in Scala and how they can be used in type conversion.",
    {
        "en": "An implicit conversion lets a caller pass a value of one type where another type is required. Scala 3 expresses that conversion as a `given Conversion[A, B]`. The Scala 3 book says to prefer extension methods when the real goal is extra members on a closed type.",
        "ru": "Неявное преобразование позволяет передать значение одного типа туда, где требуется другой. Scala 3 выражает это преобразование как `given Conversion[A, B]`. Книга Scala 3 советует предпочесть методы расширения, если настоящая цель — дополнительные члены у закрытого типа.",
    },
    {
        "en": [
            "The book’s example is a method that wants a `Long`. A conversion from `Int` or from a small id type lets the call site pass the original value.",
            "In Scala 2 the same mechanism was an `implicit def`. Scala 3 keeps the behavior and spells the intent as a given conversion.",
            "The conversion must be unambiguous. Two givens that both produce the expected type make the call fail to compile.",
            "Extension methods, not conversions, are the Scala 3 recommendation for adding operations to a type you do not own.",
        ],
        "ru": [
            "Пример книги — метод, которому нужен `Long`. Преобразование из `Int` или из маленького типа идентификатора позволяет на месте вызова передать исходное значение.",
            "В Scala 2 тот же механизм был `implicit def`. Scala 3 сохраняет поведение и записывает намерение как given-преобразование.",
            "Преобразование должно быть однозначным. Два given, которые оба дают ожидаемый тип, ломают компиляцию вызова.",
            "Методы расширения, а не преобразования, — рекомендация Scala 3, когда к чужому типу добавляют операции.",
        ],
    },
    """import scala.Conversion

case class UserId(value: Long)

given Conversion[UserId, Long] = _.value

def findUserById(id: Long): Option[String] =
  Option.when(id > 0)(s"user-$id")

findUserById(UserId(7))""",
    [
        f"{S}/scala3/book/ca-implicit-conversions.html",
        f"{S}/tour/implicit-conversions.html",
    ],
    {
        "en": "Use a given conversion for a true, lossless adaptation such as a wrapper to its underlying value. Use an extension method when you only want new operations, and an ordinary method when the conversion would hide a lossy cast.",
        "ru": "Given-преобразование — для настоящей адаптации без потерь, например обёртки к её значению. Метод расширения — когда нужны только новые операции. Обычный метод — когда преобразование спрятало бы потерю данных.",
    },
)

add(
    "Explain the concept of path-dependent types in Scala.",
    {
        "en": "A path-dependent type is a type nested in a specific outer object. The inner-classes tour uses it so a node of one graph is not a node of another graph.",
        "ru": "Путь-зависимый тип — тип, вложенный в конкретный внешний объект. Тур по внутренним классам использует его, чтобы узел одного графа не был узлом другого.",
    },
    {
        "en": [
            "In Scala an inner class is bound to the outer object, not merely to the outer class as in Java.",
            "`graph.Node` and `other.Node` are different types. `connectTo` accepts only a node of that same graph.",
            "The type is written with the value’s path: `g.Node` for a particular `g`.",
            "This is a compile-time check. It does not search the graph at runtime.",
        ],
        "ru": [
            "В Scala внутренний класс привязан к внешнему объекту, а не только к внешнему классу, как в Java.",
            "`graph.Node` и `other.Node` — разные типы. `connectTo` принимает только узел того же графа.",
            "Тип пишут путём значения: `g.Node` для конкретного `g`.",
            "Это проверка времени компиляции. Граф в рантайме она не обходит.",
        ],
    },
    """class Graph:
  class Node:
    private var links: List[Node] = Nil
    def connectTo(other: Node): Unit =
      if !links.contains(other) then links = other :: links

  def newNode(): Node = Node()

val g = Graph()
val a = g.newNode()
val b = g.newNode()
a.connectTo(b)""",
    [f"{S}/tour/inner-classes.html"],
)

add(
    "What is Type Erasure in Scala and how can it be addressed?",
    {
        "en": "Scala types are erased at runtime, like other JVM languages. The compiler’s full type, such as `List[String]`, is not what a reflective lookup sees unless you carry a `TypeTag` or a `ClassTag` that the compiler built.",
        "ru": "Типы Scala стираются во время выполнения, как у других языков JVM. Полный тип компилятора, например `List[String]`, рефлексивный поиск не видит, если не пронести `TypeTag` или `ClassTag`, который собрал компилятор.",
    },
    {
        "en": [
            "The reflection overview says a runtime inspection of an instance may lack type information the compiler had.",
            "A `TypeTag[List[String]]` keeps the full type. A `ClassTag[List[String]]` keeps only the erased class, here `List`.",
            "The compiler generates these tags. You summon them as context parameters; you do not construct the type arguments by hand at runtime.",
            "The same page is marked as Scala 2 reflection. On Scala 3, prefer match types and the inline/macro machinery when the goal is compile-time information rather than `scala.reflect` tags.",
        ],
        "ru": [
            "Обзор рефлексии говорит, что осмотр экземпляра в рантайме может не иметь типовой информации, которая была у компилятора.",
            "`TypeTag[List[String]]` хранит полный тип. `ClassTag[List[String]]` хранит только стёртый класс, здесь `List`.",
            "Эти теги порождает компилятор. Их запрашивают как контекстные параметры; аргументы типа вручную в рантайме не собирают.",
            "Та же страница помечена как рефлексия Scala 2. В Scala 3 для информации времени компиляции предпочтительны match-типы и inline/макросы, а не теги `scala.reflect`.",
        ],
    },
    """import scala.reflect.ClassTag

def arrayOf[T: ClassTag](x: T, y: T): Array[T] =
  Array(x, y)

arrayOf("a", "b")""",
    [
        f"{S}/overviews/reflection/typetags-manifests.html",
        f"{S}/scala3/guides/macros/macros.html",
    ],
)

add(
    "Describe Type Bounds in Scala and provide an example of their usage.",
    {
        "en": "A type bound limits what a type parameter may be. An upper bound `T <: A` means `T` is a subtype of `A`. A lower bound `B >: A` means `B` is a supertype of `A`.",
        "ru": "Ограничение типа сужает, чем может быть параметр типа. Верхняя граница `T <: A` значит, что `T` — подтип `A`. Нижняя граница `B >: A` значит, что `B` — супертип `A`.",
    },
    {
        "en": [
            "The upper-bound tour uses the bound so a container can call members of `A`, such as `name` on an animal, which an unbounded `T` would not reveal.",
            "Its example is `PetContainer` over a subtype of `Pet`. A `Cat` fits; an unrelated type does not.",
            "The lower-bound tour uses `B >: A` on a method, classically `prepend` on a covariant list, so the result list may be a supertype of the original element.",
            "Bounds are compile-time constraints. They do not check values at runtime.",
        ],
        "ru": [
            "Тур по верхней границе использует её, чтобы контейнер мог вызвать члены `A`, например `name` у животного, чего неограниченный `T` не показал бы.",
            "Его пример — `PetContainer` над подтипом `Pet`. `Cat` подходит; посторонний тип — нет.",
            "Тур по нижней границе использует `B >: A` на методе, классически `prepend` у ковариантного списка, чтобы список-результат мог иметь супертип исходного элемента.",
            "Границы — ограничения времени компиляции. Значения в рантайме они не проверяют.",
        ],
    },
    """abstract class Animal:
  def name: String

class Cat extends Animal:
  def name = "cat"

class PetContainer[T <: Animal](val pet: T):
  def label: String = pet.name

PetContainer(Cat()).label""",
    [
        f"{S}/tour/upper-type-bounds.html",
        f"{S}/tour/lower-type-bounds.html",
    ],
)

add(
    "How are variance annotations (covariant and contravariant) used in Scala?",
    {
        "en": "Variance annotations control how subtyping of a type argument affects subtyping of the parameterized type. The tour writes `Foo[+A]` for covariant, `Bar[-A]` for contravariant, and `Baz[A]` for invariant.",
        "ru": "Аннотации вариантности управляют тем, как подтипирование аргумента типа влияет на подтипирование параметризованного типа. Тур пишет `Foo[+A]` для ковариантного, `Bar[-A]` для контравариантного и `Baz[A]` для инвариантного.",
    },
    {
        "en": [
            "The Scala 3 variance chapter says variance controls subtyping of parameterized types such as classes and traits.",
            "Covariant `+A` means if `Cat` is a `Pet`, then `Box[Cat]` is a `Box[Pet]`. That fits a type that only produces `A`.",
            "Contravariant `-A` reverses the direction. It fits a type that only consumes `A`, such as a function argument.",
            "Invariant is the default. A mutable slot that both reads and writes `A` stays invariant so a `Box[Cat]` is not treated as a `Box[Pet]`.",
        ],
        "ru": [
            "Глава Scala 3 о вариантности говорит, что она управляет подтипированием параметризованных типов, таких как классы и трейты.",
            "Ковариантный `+A` значит: если `Cat` — это `Pet`, то `Box[Cat]` — это `Box[Pet]`. Это подходит типу, который только производит `A`.",
            "Контравариантный `-A` переворачивает направление. Он подходит типу, который только потребляет `A`, например аргументу функции.",
            "По умолчанию тип инвариантен. Изменяемая ячейка, которая и читает, и пишет `A`, остаётся инвариантной, чтобы `Box[Cat]` не считали `Box[Pet]`.",
        ],
    },
    """class Producer[+A](val value: A)
class Consumer[-A]:
  def accept(a: A): String = a.toString

val pets: Producer[AnyRef] = Producer("cat")""",
    [
        f"{S}/tour/variances.html",
        f"{S}/scala3/book/types-variance.html",
    ],
    {
        "en": "Annotate `+` when the parameter appears only as a result, `-` when it appears only as an input, and leave it invariant when it appears in both positions.",
        "ru": "`+` — когда параметр встречается только как результат, `-` — только как вход, без аннотации — когда он встречается в обеих позициях.",
    },
)

add(
    "Discuss the use and implications of macros in Scala.",
    {
        "en": "A Scala 3 macro treats a program as data. An expression of type `T` is a `scala.quoted.Expr[T]`, and an inline method is the entry point that asks the compiler to run that macro.",
        "ru": "Макрос Scala 3 обращается с программой как с данными. Выражение типа `T` — это `scala.quoted.Expr[T]`, а inline-метод — точка входа, которая просит компилятор выполнить этот макрос.",
    },
    {
        "en": [
            "The macros guide says inline methods already move some work to compile time, and macros are the stronger tool when you must analyze or build a program.",
            "The sample `inspectCode` prints `x.show` during compilation and returns the original expression.",
            "The macro runs in the compiler, not on the user’s data at runtime. A mistake fails the build.",
            "The older Scala 2 macros overview is a different API. New code follows the quoted `Expr` guide, not `scala.reflect.macros`.",
        ],
        "ru": [
            "Руководство по макросам говорит, что inline-методы уже переносят часть работы на компиляцию, а макросы — более сильный инструмент, когда программу нужно разобрать или построить.",
            "Пример `inspectCode` печатает `x.show` во время компиляции и возвращает исходное выражение.",
            "Макрос выполняется в компиляторе, а не на данных пользователя в рантайме. Ошибка ломает сборку.",
            "Старый обзор макросов Scala 2 — другой API. Новый код следует руководству по quoted `Expr`, а не `scala.reflect.macros`.",
        ],
    },
    """import scala.quoted.*

def inspectCode(x: Expr[Any])(using Quotes): Expr[Any] =
  println(x.show)
  x

inline def inspect(inline x: Any): Any = ${ inspectCode('x) }""",
    [
        f"{S}/scala3/guides/macros/macros.html",
        f"{S}/overviews/macros/overview.html",
    ],
    {
        "en": "Use a macro when a library must see the syntax of the call, such as a compile-time inspection. Use an ordinary function when the work depends on runtime values.",
        "ru": "Макрос — когда библиотека должна видеть синтаксис вызова, например осмотр на этапе компиляции. Обычная функция — когда работа зависит от значений времени выполнения.",
    },
)

add(
    "Demonstrate how to implement a k-means clustering algorithm in Scala.",
    {
        "en": "K-means assigns each point to the nearest of k centers, then moves each center to the mean of its points, and repeats. The Spark clustering guide implements that algorithm as an `Estimator` that fits a `KMeansModel`; the steps below are the same loop on a local `Vector`.",
        "ru": "K-means относит каждую точку к ближайшему из k центров, затем сдвигает каждый центр в среднее своих точек и повторяет. Руководство Spark по кластеризации реализует этот алгоритм как `Estimator`, который обучает `KMeansModel`; шаги ниже — тот же цикл на локальном `Vector`.",
    },
    {
        "en": [
            "Distance is a `zip`/`map`/`sum` over coordinates. Assignment is the index of the minimum distance.",
            "A new center is the coordinate-wise mean of the points that chose it. `foldLeft` is the documented way to start from a zero vector even if a cluster is empty.",
            "Each round returns new centers. The previous vectors are not mutated.",
            "Spark’s guide sets `k` with `setK` and a seed with `setSeed` on the DataFrame API, which is the form to use once the points are partitioned. The RDD-based API is in maintenance mode.",
        ],
        "ru": [
            "Расстояние — `zip`/`map`/`sum` по координатам. Назначение — индекс минимального расстояния.",
            "Новый центр — среднее по координатам точек, которые его выбрали. `foldLeft` — документированный способ начать с нулевого вектора, даже если кластер пуст.",
            "Каждый раунд возвращает новые центры. Прежние векторы не мутируют.",
            "Руководство Spark задаёт `k` через `setK` и зерно через `setSeed` в API DataFrame — эта форма нужна, когда точки уже разбиты на разделы. API на RDD в режиме сопровождения.",
        ],
    },
    """def kMeans(points: Vector[Vector[Double]], centers: Vector[Vector[Double]]): Vector[Vector[Double]] =
  def dist2(a: Vector[Double], b: Vector[Double]): Double =
    a.zip(b).map((x, y) => val d = x - y; d * d).sum
  val groups = points.groupBy(p => centers.indices.minBy(i => dist2(p, centers(i))))
  centers.indices.toVector.map { i =>
    val bucket = groups.getOrElse(i, Vector.empty)
    if bucket.isEmpty then centers(i)
    else
      val n = bucket.size.toDouble
      bucket.foldLeft(Vector.fill(centers(i).size)(0.0)) { (acc, p) =>
        acc.zip(p).map(_ + _)
      }.map(_ / n)
  }""",
    [
        f"{S}/scala3/book/collections-methods.html",
        "https://spark.apache.org/docs/latest/ml-clustering.html",
        "https://spark.apache.org/docs/latest/ml-guide.html",
    ],
)

add(
    "Write a Scala implementation for logistic regression.",
    {
        "en": "Logistic regression scores a point with a weighted sum passed through the logistic function, then nudges the weights to reduce error. Spark’s classification guide lists linear methods, including logistic regression, on the DataFrame API; the update below is one gradient step on a local vector.",
        "ru": "Логистическая регрессия считает оценку точки как взвешенную сумму, пропущенную через логистическую функцию, и сдвигает веса, чтобы уменьшить ошибку. Руководство Spark по классификации перечисляет линейные методы, включая логистическую регрессию, в API DataFrame; обновление ниже — один шаг градиента на локальном векторе.",
    },
    {
        "en": [
            "The score is `1 / (1 + exp(-dot(w, x)))`. The dot is `zip` and `sum`.",
            "For a label `y` in `{0, 1}`, the gradient contribution of one row is `(prediction - y) * x`.",
            "`foldLeft` accumulates that gradient from a zero vector, then the step subtracts `learningRate` times the mean gradient.",
            "Weights stay an immutable `Vector`. The next step receives the returned vector. Cluster training uses Spark’s DataFrame estimators rather than this single-process loop.",
        ],
        "ru": [
            "Оценка — `1 / (1 + exp(-dot(w, x)))`. Скалярное произведение — `zip` и `sum`.",
            "Для метки `y` из `{0, 1}` вклад строки в градиент — `(prediction - y) * x`.",
            "`foldLeft` копит этот градиент от нулевого вектора, затем шаг вычитает `learningRate`, умноженный на средний градиент.",
            "Веса остаются неизменяемым `Vector`. Следующий шаг получает возвращённый вектор. Обучение на кластере использует оценщики DataFrame в Spark, а не этот однопроцессный цикл.",
        ],
    },
    """def step(
    weights: Vector[Double],
    rows: Vector[(Vector[Double], Double)],
    learningRate: Double
): Vector[Double] =
  def dot(a: Vector[Double], b: Vector[Double]) = a.zip(b).map(_ * _).sum
  val grad = rows.foldLeft(Vector.fill(weights.size)(0.0)) { case (acc, (x, y)) =>
    val pred = 1.0 / (1.0 + math.exp(-dot(weights, x)))
    acc.zip(x).map((g, xi) => g + (pred - y) * xi)
  }
  val n = rows.size.toDouble
  weights.zip(grad).map((w, g) => w - learningRate * g / n)""",
    [
        f"{S}/scala3/book/collections-methods.html",
        "https://spark.apache.org/docs/latest/ml-classification-regression.html",
    ],
)

add(
    "How would you implement a recommendation system using alternating least squares (ALS) in Scala?",
    {
        "en": "Alternating least squares learns latent factors for users and items by fixing one side and solving the other, then swapping. Spark’s collaborative-filtering guide documents that algorithm and its parameters: `rank`, `maxIter`, `regParam`, `numBlocks`, and `implicitPrefs`.",
        "ru": "Чередующиеся наименьшие квадраты учат скрытые факторы пользователей и предметов: фиксируют одну сторону, решают другую и меняют их местами. Руководство Spark по коллаборативной фильтрации документирует этот алгоритм и параметры: `rank`, `maxIter`, `regParam`, `numBlocks` и `implicitPrefs`.",
    },
    {
        "en": [
            "`rank` is the number of latent factors, default 10. `maxIter` is the iteration cap, default 10. `regParam` is the regularization, default 1.0.",
            "`numBlocks` partitions users and items so the solves run in parallel, default 10.",
            "`implicitPrefs` selects the implicit-feedback variant. The default `false` is explicit ratings.",
            "The DataFrame-based API is the primary MLlib API. A local sketch can show one alternating update; the partitioned solve is the Spark estimator, not a hand-rolled `Map`.",
        ],
        "ru": [
            "`rank` — число скрытых факторов, по умолчанию 10. `maxIter` — предел итераций, по умолчанию 10. `regParam` — регуляризация, по умолчанию 1.0.",
            "`numBlocks` разбивает пользователей и предметы, чтобы решения шли параллельно, по умолчанию 10.",
            "`implicitPrefs` выбирает вариант с неявной обратной связью. Значение по умолчанию `false` — явные оценки.",
            "API на DataFrame — основной API MLlib. Локальный набросок может показать одно чередующееся обновление; разбитое на разделы решение — это оценщик Spark, а не ручной `Map`.",
        ],
    },
    """final case class AlsSettings(
    rank: Int = 10,
    maxIter: Int = 10,
    regParam: Double = 1.0,
    numBlocks: Int = 10,
    implicitPrefs: Boolean = false
)

def predict(user: Vector[Double], item: Vector[Double]): Double =
  user.zip(item).map(_ * _).sum""",
    ["https://spark.apache.org/docs/latest/ml-collaborative-filtering.html"],
)

add(
    "Explain how you would utilize random forests for classification in Scala.",
    {
        "en": "A random forest averages many decision trees. Spark’s classification guide lists a random forest classifier next to the single decision tree. Each tree votes a label; the forest returns the majority label.",
        "ru": "Случайный лес усредняет много деревьев решений. Руководство Spark по классификации ставит классификатор «случайный лес» рядом с одним деревом решений. Каждое дерево голосует за метку; лес возвращает метку большинства.",
    },
    {
        "en": [
            "One tree is the `sealed` leaf-or-branch model: a test on one feature chooses a child.",
            "The forest is a `Vector` of those trees. `map` collects a label from each, then `groupBy` counts votes.",
            "Trees differ because each one saw a sample of rows and a sample of features. That sampling is the training step; prediction only walks trees that already exist.",
            "On a cluster, the DataFrame API is the primary MLlib path. The RDD-based API is in maintenance mode.",
        ],
        "ru": [
            "Одно дерево — `sealed`-модель листа или ветки: проверка одного признака выбирает ребёнка.",
            "Лес — `Vector` таких деревьев. `map` собирает метку с каждого, затем `groupBy` считает голоса.",
            "Деревья различаются, потому что каждое видело выборку строк и выборку признаков. Эта выборка — шаг обучения; предсказание только обходит уже существующие деревья.",
            "На кластере основной путь MLlib — API DataFrame. API на RDD в режиме сопровождения.",
        ],
    },
    """def majority(votes: Vector[String]): String =
  votes.groupBy(identity).maxBy(_._2.size)._1

def forestPredict(trees: Vector[Vector[Double] => String], row: Vector[Double]): String =
  majority(trees.map(_(row)))""",
    [
        "https://spark.apache.org/docs/latest/ml-classification-regression.html",
        f"{S}/scala3/book/collections-methods.html",
    ],
)

add(
    "How does Apache Spark integrate with Scala for machine learning tasks?",
    {
        "en": "Spark’s driver program is ordinary Scala. The RDD guide says an application starts from a Scala collection or a file and transforms it into a partitioned collection that the cluster operates on in parallel. MLlib is the machine-learning library on that runtime.",
        "ru": "Программа-драйвер Spark — обычная Scala. Руководство по RDD говорит, что приложение стартует с коллекции Scala или файла и превращает её в разбитую на разделы коллекцию, с которой кластер работает параллельно. MLlib — библиотека машинного обучения на этой среде.",
    },
    {
        "en": [
            "An RDD is created from a Hadoop-style file or from an existing Scala collection in the driver, then transformed.",
            "Transformations stay lazy until an action. Persisting an RDD keeps it in memory for reuse across later actions.",
            "MLlib adds algorithms, featurization, pipelines, and persistence. Its guide says the DataFrame-based API is primary.",
            "Functions you pass are Scala function values. Closures shipped to workers should capture immutable data; the RDD guide notes that Spark sends a copy of each used variable to the task.",
        ],
        "ru": [
            "RDD создают из файла в стиле Hadoop или из уже существующей коллекции Scala на драйвере, затем преобразуют.",
            "Преобразования остаются ленивыми до действия. Сохранение RDD держит его в памяти для повторного использования в следующих действиях.",
            "MLlib добавляет алгоритмы, признаки, конвейеры и сохранение. Его руководство говорит, что основной API — на DataFrame.",
            "Функции, которые передают, — значения-функции Scala. Замыкания, уезжающие на рабочие узлы, должны захватывать неизменяемые данные; руководство по RDD отмечает, что Spark отправляет копию каждой использованной переменной в задачу.",
        ],
    },
    """// Driver-side Scala. spark.sparkContext.parallelize turns this
// collection into a partitioned RDD, as the RDD guide describes.
val labels = List("cat", "cat", "dog")
val counts = labels.groupBy(identity).view.mapValues(_.size).toMap""",
    [
        "https://spark.apache.org/docs/latest/rdd-programming-guide.html",
        "https://spark.apache.org/docs/latest/ml-guide.html",
    ],
)

add(
    "What are resilient distributed datasets (RDDs) and how do they work in Scala?",
    {
        "en": "An RDD is Spark’s partitioned collection. The RDD guide defines it as elements split across the cluster that can be operated on in parallel, created from a file or from a Scala collection in the driver, and able to recover from node failures.",
        "ru": "RDD — разбитая на разделы коллекция Spark. Руководство по RDD определяет её как элементы, распределённые по кластеру, с которыми можно работать параллельно; её создают из файла или из коллекции Scala на драйвере, и она восстанавливается после отказа узла.",
    },
    {
        "en": [
            "Transformations describe a new RDD. They do not run until an action asks for a result.",
            "You can persist an RDD in memory so later actions reuse it.",
            "A failure recomputes lost partitions from the lineage instead of restarting the whole job from scratch.",
            "From the driver, `parallelize` on a Scala collection is one way in. The MLlib guide says new machine-learning work should prefer the DataFrame API; the RDD API is in maintenance mode.",
        ],
        "ru": [
            "Преобразования описывают новый RDD. Они не выполняются, пока действие не запросит результат.",
            "RDD можно сохранить в памяти, чтобы следующие действия его переиспользовали.",
            "Отказ пересчитывает потерянные разделы по цепочке преобразований, а не запускает всю работу с нуля.",
            "С драйвера `parallelize` коллекции Scala — один вход. Руководство MLlib говорит, что новой работе по машинному обучению лучше предпочесть API DataFrame; API RDD в режиме сопровождения.",
        ],
    },
    """val local = List(1, 2, 3, 4)
val doubled = local.map(_ * 2)
// On a cluster the same function is the transformation body:
// sc.parallelize(local).map(_ * 2)
doubled""",
    [
        "https://spark.apache.org/docs/latest/rdd-programming-guide.html",
        "https://spark.apache.org/docs/latest/ml-guide.html",
    ],
)

add(
    "Explain the DataFrame API in Spark and its usage with Scala.",
    {
        "en": "In Spark SQL, DataFrame operations are the untyped Dataset operations. The getting-started guide builds them from a `SparkSession`, registers a temp view, and runs SQL whose result is again a DataFrame.",
        "ru": "В Spark SQL операции DataFrame — это нетипизированные операции Dataset. Руководство по началу работы строит их из `SparkSession`, регистрирует временное представление и выполняет SQL, чей результат снова DataFrame.",
    },
    {
        "en": [
            "`createDataFrame` turns a local collection plus a schema into a DataFrame. `createOrReplaceTempView` gives SQL a name for it.",
            "A SQL string such as a `SELECT` with a `WHERE` returns a DataFrame. Columns are named, unlike a bare RDD of tuples.",
            "MLlib’s guide says this DataFrame API is now the primary machine-learning API. Estimators read a features column and write a prediction column.",
            "The RDD guide’s parallel collection is still underneath, and a DataFrame can hand its contents back as an RDD. New pipelines start from the DataFrame, not from that RDD.",
        ],
        "ru": [
            "`createDataFrame` превращает локальную коллекцию плюс схему в DataFrame. `createOrReplaceTempView` даёт SQL имя для него.",
            "Строка SQL, например `SELECT` с `WHERE`, возвращает DataFrame. У колонок есть имена, в отличие от голого RDD кортежей.",
            "Руководство MLlib говорит, что этот API DataFrame теперь основной API машинного обучения. Оценщики читают колонку признаков и пишут колонку предсказания.",
            "Параллельная коллекция из руководства по RDD всё ещё лежит снизу, и DataFrame может отдать содержимое обратно как RDD. Новые конвейеры начинают с DataFrame, не с этого RDD.",
        ],
    },
    """val people = Seq(("Ann", 20), ("Bo", 15))
// spark.createDataFrame(people).toDF("name", "age")
//   .createOrReplaceTempView("people")
// spark.sql("SELECT name FROM people WHERE age >= 13 AND age <= 19")
people.filter(_._2 >= 13).map(_._1)""",
    [
        "https://spark.apache.org/docs/latest/sql-getting-started.html",
        "https://spark.apache.org/docs/latest/ml-guide.html",
    ],
)

add(
    "How can you leverage Spark's MLlib library for machine learning in Scala?",
    {
        "en": "MLlib is Spark’s machine-learning library. Its guide says the goal is practical learning that scales, and that the DataFrame-based API is the one that receives new work.",
        "ru": "MLlib — библиотека машинного обучения Spark. Её руководство говорит, что цель — практичное обучение, которое масштабируется, и что новую работу принимает API на DataFrame.",
    },
    {
        "en": [
            "The tools it lists are algorithms (classification, regression, clustering, collaborative filtering), featurization, pipelines, persistence, and utilities such as statistics.",
            "A pipeline chains transformers and estimators. Fitting the pipeline on a DataFrame produces a model you can save and load.",
            "K-means is an estimator that writes a prediction column. ALS exposes `rank`, `maxIter`, `regParam`, `numBlocks`, and `implicitPrefs`. Random forests are listed with the other classifiers.",
            "The RDD-based API remains supported but is in maintenance mode. The guide says it will not gain new features.",
        ],
        "ru": [
            "Инструменты в списке: алгоритмы (классификация, регрессия, кластеризация, коллаборативная фильтрация), признаки, конвейеры, сохранение и утилиты вроде статистики.",
            "Конвейер сцепляет преобразователи и оценщики. Обучение конвейера на DataFrame даёт модель, которую можно сохранить и загрузить.",
            "K-means — оценщик, который пишет колонку предсказания. ALS открывает `rank`, `maxIter`, `regParam`, `numBlocks` и `implicitPrefs`. Случайные леса перечислены среди других классификаторов.",
            "API на RDD ещё поддерживается, но в режиме сопровождения. Руководство говорит, что новых возможностей он не получит.",
        ],
    },
    """// DataFrame path documented by the clustering guide:
// val kmeans = new org.apache.spark.ml.clustering.KMeans().setK(2).setSeed(1)
// val model = kmeans.fit(dataset)
// model.transform(dataset)
def majorityLabel(votes: List[String]): String =
  votes.groupBy(identity).maxBy(_._2.size)._1""",
    [
        "https://spark.apache.org/docs/latest/ml-guide.html",
        "https://spark.apache.org/docs/latest/ml-clustering.html",
        "https://spark.apache.org/docs/latest/ml-collaborative-filtering.html",
    ],
)

add(
    "Discuss techniques for optimizing Scala code performance.",
    {
        "en": "The largest wins in the Scala guides are picking the collection that matches the access pattern, keeping recursion in tail position, and turning on parallel execution only when the data is large and the operator is associative.",
        "ru": "Самые крупные выигрыши в руководствах Scala — выбрать коллекцию под шаблон доступа, держать рекурсию в хвостовой позиции и включать параллельное выполнение только когда данных много, а оператор ассоциативен.",
    },
    {
        "en": [
            "`Vector` is the indexed immutable sequence; `List` is the linear one. Indexing a long `List` walks links. The collections book tells you to choose on that axis.",
            "`@tailrec` rewrites a tail call into a loop so a long fold does not grow the stack. A non-tail call is rejected when the annotation is present.",
            "Parallel collections copy a `List` into a `ParVector` and only pay off around several thousand elements. Side effects and non-associative folds are not deterministic.",
            "An iterator or `LazyList` avoids building an intermediate `List` when you only need one pass or a prefix.",
        ],
        "ru": [
            "`Vector` — индексная неизменяемая последовательность, `List` — линейная. Индексация длинного `List` идёт по ссылкам. Книга коллекций просит выбирать по этой оси.",
            "`@tailrec` переписывает хвостовой вызов в цикл, чтобы длинный fold не растил стек. Нехвостовой вызов при аннотации отклоняется.",
            "Параллельные коллекции копируют `List` в `ParVector` и окупаются примерно от нескольких тысяч элементов. Побочные эффекты и неассоциативные fold недетерминированы.",
            "Итератор или `LazyList` не строят промежуточный `List`, когда нужен один проход или только префикс.",
        ],
    },
    """import scala.annotation.tailrec

def sum(xs: List[Int]): Int =
  @tailrec
  def go(rest: List[Int], acc: Int): Int = rest match
    case Nil => acc
    case h :: t => go(t, acc + h)
  go(xs, 0)""",
    [
        f"{S}/scala3/book/collections-classes.html",
        f"{S}/tour/annotations.html",
        f"{S}/overviews/parallel-collections/overview.html",
        f"{S}/overviews/collections-2.13/performance-characteristics.html",
    ],
)

add(
    "What is the role of JVM in Scala's performance?",
    {
        "en": "Scala compiles to JVM bytecode and runs on the same runtime as Java. The concurrency chapter’s threads, futures, and monitors are JVM threads and the JVM memory model, not a separate Scala machine.",
        "ru": "Scala компилируется в байткод JVM и работает на той же среде, что и Java. Потоки, future и мониторы из главы о конкурентности — это потоки JVM и модель памяти JVM, а не отдельная машина Scala.",
    },
    {
        "en": [
            "A method call, a `Thread`, and `AnyRef.synchronized` are JVM operations. The standard-library page for `synchronized` is the hook onto that monitor.",
            "Type erasure is a JVM fact the reflection overview states: `List[String]` and `List[Int]` do not both exist as different runtime classes.",
            "Tail-call optimization via `@tailrec` is the compiler emitting a loop because the JVM does not give Scala a general tail-call instruction.",
            "Spark’s speed on Scala is the same JVM running many tasks. The RDD guide’s parallelism is processes and threads on that runtime, plus partition recovery.",
        ],
        "ru": [
            "Вызов метода, `Thread` и `AnyRef.synchronized` — операции JVM. Страница стандартной библиотеки для `synchronized` — крючок к этому монитору.",
            "Стирание типов — факт JVM, который утверждает обзор рефлексии: `List[String]` и `List[Int]` не существуют как разные классы времени выполнения.",
            "Оптимизация хвостового вызова через `@tailrec` — это цикл, который выпускает компилятор, потому что JVM не даёт Scala общей инструкции хвостового вызова.",
            "Скорость Spark на Scala — та же JVM, на которой идёт много задач. Параллелизм из руководства по RDD — процессы и потоки этой среды плюс восстановление разделов.",
        ],
    },
    """def work(n: Int): Int =
  n * 2

val scheduled =
  scala.concurrent.Future(work(21))(scala.concurrent.ExecutionContext.global)""",
    [
        f"{S}/scala3/book/concurrency.html",
        f"{S}/overviews/reflection/typetags-manifests.html",
        f"{S}/tour/annotations.html",
        "https://www.scala-lang.org/api/current/scala/AnyRef.html",
    ],
)

add(
    "How can you manage memory effectively in Scala applications?",
    {
        "en": "Memory stays bounded when you do not retain a whole intermediate collection, when recursion is tail position, and when a lazy structure is forced only for the prefix you need.",
        "ru": "Память остаётся ограниченной, если не удерживать всю промежуточную коллекцию, если рекурсия в хвостовой позиции и если ленивую структуру заставляют считаться только на нужном префиксе.",
    },
    {
        "en": [
            "An iterator yields one element at a time. Holding the iterator’s source and also a `toList` of it keeps both.",
            "`LazyList.range` does not allocate every integer up to `Int.MaxValue`. `take(n).toList` allocates n cells.",
            "`@tailrec` keeps one frame. The non-tail factorial the annotations tour rejects would push a frame per call.",
            "A future that closes over a huge collection ships that capture with the task. The RDD guide says Spark copies each used variable to the task, so capture the small value, not the whole driver heap.",
        ],
        "ru": [
            "Итератор отдаёт по одному элементу. Если удержать и источник итератора, и его `toList`, в памяти оба.",
            "`LazyList.range` не выделяет каждое целое до `Int.MaxValue`. `take(n).toList` выделяет n ячеек.",
            "`@tailrec` держит один кадр. Нехвостовой факториал, который отклоняет тур по аннотациям, клал бы кадр на каждый вызов.",
            "Future, замкнутый на огромную коллекцию, увозит этот захват вместе с задачей. Руководство по RDD говорит, что Spark копирует каждую использованную переменную в задачу, поэтому захватывайте маленькое значение, а не всю кучу драйвера.",
        ],
    },
    """val nums = LazyList.range(1, Int.MaxValue)
val prefixSum = nums.take(1000).foldLeft(0)(_ + _)

def streamSum(xs: Iterator[Int]): Int =
  xs.foldLeft(0)(_ + _)""",
    [
        f"{S}/scala3/book/collections-classes.html",
        f"{S}/overviews/collections-2.13/iterators.html",
        f"{S}/tour/annotations.html",
        "https://spark.apache.org/docs/latest/rdd-programming-guide.html",
    ],
)

add(
    "What frameworks are commonly used for testing Scala applications?",
    {
        "en": "The Scala book names two tools that show up together on a Scala project: sbt to build, and ScalaTest to test. You run the tests through sbt rather than a separate harness.",
        "ru": "Книга Scala называет два инструмента, которые вместе встречаются в проекте на Scala: sbt для сборки и ScalaTest для тестов. Тесты запускают через sbt, а не отдельной обвязкой.",
    },
    {
        "en": [
            "The sbt and ScalaTest lesson introduces ScalaTest as the code-testing framework and sbt as the build tool.",
            "Later lessons in that book cover BDD-style and TDD-style tests written with those two.",
            "A pure function is the easy case: one input, one expected output, no clock and no network. The pure-functions chapter is why that test is stable.",
            "Futures need the test to observe completion. The concurrency chapter’s `onComplete` or a transformation such as `map` is the production shape; the test waits for that future instead of sleeping a fixed time.",
        ],
        "ru": [
            "Урок про sbt и ScalaTest представляет ScalaTest как фреймворк тестирования кода, а sbt как инструмент сборки.",
            "Дальнейшие уроки той книги покрывают тесты в стиле BDD и TDD, написанные этими двумя.",
            "Чистая функция — лёгкий случай: один вход, один ожидаемый выход, без часов и сети. Глава о чистых функциях объясняет, почему такой тест стабилен.",
            "Для future тест должен дождаться завершения. `onComplete` или преобразование вроде `map` из главы о конкурентности — боевая форма; тест ждёт этот future, а не спит фиксированное время.",
        ],
    },
    """def isSorted(xs: List[Int]): Boolean =
  xs.zip(xs.drop(1)).forall((a, b) => a <= b)

def check(): Unit =
  require(isSorted(List(1, 2, 2)))
  require(!isSorted(List(2, 1)))""",
    [
        f"{S}/overviews/scala-book/sbt-scalatest-intro.html",
        f"{S}/overviews/scala-book/sbt-scalatest-bdd.html",
        f"{S}/overviews/scala-book/sbt-scalatest-tdd.html",
        f"{S}/scala3/book/fp-pure-functions.html",
    ],
)

add(
    "Describe the process of unit testing in Scala.",
    {
        "en": "A unit test calls one function with a known input and checks the result. The Scala book’s path is to put that check in ScalaTest and run it with sbt.",
        "ru": "Модульный тест вызывает одну функцию с известным входом и проверяет результат. Путь книги Scala — положить эту проверку в ScalaTest и запустить её через sbt.",
    },
    {
        "en": [
            "Pick a pure function so the result depends only on the arguments. The pure-functions chapter lists `map` and `filter` as that kind of operation.",
            "Assert the exact collection, not a printout. `isSorted(List(1, 2))` is either true or false.",
            "Include the empty input. `foldLeft` on an empty list returns the seed; `reduce` does not apply to an empty collection.",
            "sbt compiles the test and ScalaTest reports the failures. The intro lesson is the entry point; the BDD and TDD lessons show how the specs are written.",
        ],
        "ru": [
            "Берут чистую функцию, чтобы результат зависел только от аргументов. Глава о чистых функциях относит `map` и `filter` к таким операциям.",
            "Проверяют саму коллекцию, а не печать. `isSorted(List(1, 2))` либо истина, либо ложь.",
            "Включают пустой вход. `foldLeft` на пустом списке возвращает начальное значение; `reduce` к пустой коллекции не применяется.",
            "sbt компилирует тест, ScalaTest сообщает о сбоях. Вводный урок — точка входа; уроки BDD и TDD показывают, как пишут спецификации.",
        ],
    },
    """def average(xs: List[Double]): Double =
  if xs.isEmpty then 0.0 else xs.sum / xs.length

def specs(): Unit =
  require(average(Nil) == 0.0)
  require(average(List(2.0, 4.0)) == 3.0)""",
    [
        f"{S}/overviews/scala-book/sbt-scalatest-intro.html",
        f"{S}/scala3/book/fp-pure-functions.html",
        f"{S}/scala3/book/taste-collections.html",
    ],
)

add(
    "How would you debug an application in Scala that is not performing as expected?",
    {
        "en": "When a Scala job is wrong or slow, check the three causes the guides actually warn about: a non-tail recursion growing the stack, a side effect inside a parallel operation, and a future that was never observed.",
        "ru": "Когда работа на Scala ошибочна или медленна, проверяют три причины, о которых руководства предупреждают прямо: нехвостовая рекурсия растит стек, побочный эффект внутри параллельной операции и future, результат которой никто не наблюдает.",
    },
    {
        "en": [
            "If the stack overflows, the recursive call is not in tail position. `@tailrec` turns that into a compile error instead of a production crash. E097 also fires if the method is still overridable.",
            "If a parallel `map` or `foreach` updates a shared `var`, the parallel-collections guide says the result is not deterministic. Run the same function on the sequential collection and compare.",
            "If a future’s result never arrives, the caller continued without `map` or `onComplete`, or the execution context is blocked. The concurrency chapter shows the value as `Future(<not completed>)` until the body finishes.",
            "Add a ScalaTest check for the pure core, which the sbt lesson introduces, so the next run fails in the test instead of in production.",
        ],
        "ru": [
            "Если стек переполняется, рекурсивный вызов не в хвостовой позиции. `@tailrec` превращает это в ошибку компиляции, а не в падение в проде. E097 срабатывает и если метод всё ещё можно переопределить.",
            "Если параллельные `map` или `foreach` обновляют общий `var`, руководство по параллельным коллекциям говорит, что результат недетерминирован. Прогоните ту же функцию на последовательной коллекции и сравните.",
            "Если результат future не приходит, вызывающий пошёл дальше без `map` или `onComplete`, либо контекст выполнения заблокирован. Глава о конкурентности показывает значение как `Future(<not completed>)`, пока тело не закончится.",
            "Добавьте проверку ScalaTest для чистого ядра, которое вводит урок про sbt, чтобы следующий прогон падал в тесте, а не в проде.",
        ],
    },
    """import scala.annotation.tailrec

@tailrec
def length[A](xs: List[A], acc: Int = 0): Int = xs match
  case Nil => acc
  case _ :: t => length(t, acc + 1)""",
    [
        f"{S}/tour/annotations.html",
        f"{S}/scala3/reference/error-codes/E097.html",
        f"{S}/overviews/parallel-collections/overview.html",
        f"{S}/scala3/book/concurrency.html",
    ],
)

add(
    "Present a case study where Scala is used in a machine learning pipeline.",
    {
        "en": "A small pipeline is three documented stages: normalize text with collection methods, turn rows into the DataFrame the Spark SQL guide queries, and fit an MLlib estimator. Nothing here requires a custom runtime.",
        "ru": "Небольшой конвейер — три документированные стадии: нормализовать текст методами коллекций, превратить строки в DataFrame, который запрашивает руководство Spark SQL, и обучить оценщик MLlib. Отдельная среда выполнения для этого не нужна.",
    },
    {
        "en": [
            "Tokenization is `toLowerCase`, `filter`, and `split`, then `flatMap` across lines.",
            "Those rows become a DataFrame through `SparkSession`, the path the SQL getting-started guide titles “Creating DataFrames”. SQL or column filters select the training slice.",
            "MLlib fits an estimator on a features column. The clustering guide’s k-means writes a prediction column; the classification guide’s trees do the same for labels.",
            "The pure functions stay in the driver tests. ScalaTest, which the Scala book introduces, checks tokenization before the cluster job runs.",
        ],
        "ru": [
            "Токенизация — `toLowerCase`, `filter` и `split`, затем `flatMap` по строкам.",
            "Эти строки становятся DataFrame через `SparkSession` — путь, который руководство SQL по началу работы называет «Creating DataFrames». SQL или фильтры колонок выбирают обучающий срез.",
            "MLlib обучает оценщик на колонке признаков. K-means из руководства по кластеризации пишет колонку предсказания; деревья из руководства по классификации делают то же для меток.",
            "Чистые функции остаются в тестах драйвера. ScalaTest, который вводит книга Scala, проверяет токенизацию до запуска кластерной работы.",
        ],
    },
    """def tokens(line: String): List[String] =
  line.toLowerCase.filter(ch => ch.isLetterOrDigit || ch.isWhitespace)
    .split("\\\\s+").toList.filter(_.nonEmpty)

val docs = List("Scala collections", "Scala futures").map(tokens)
// spark.createDataFrame(docs.map(ts => Tuple1(ts.mkString(" "))))
docs.map(_.length)""",
    [
        f"{S}/scala3/book/collections-methods.html",
        "https://spark.apache.org/docs/latest/sql-getting-started.html",
        "https://spark.apache.org/docs/latest/ml-guide.html",
    ],
)

add(
    "How can Scala be used for processing large-scale graph data in machine learning?",
    {
        "en": "GraphX is Spark’s component for graph-parallel computation. Its guide defines the graph as a directed multigraph with properties on each vertex and each edge, on top of the same partitioned RDDs.",
        "ru": "GraphX — компонент Spark для графо-параллельных вычислений. Его руководство определяет граф как ориентированный мультиграф со свойствами на каждой вершине и каждом ребре, поверх тех же разбитых на разделы RDD.",
    },
    {
        "en": [
            "A directed multigraph can have several edges between the same pair of vertices, which the guide cites for relationships such as coworker and friend.",
            "Vertices and edges carry user-defined properties. Algorithms in the guide run as graph-parallel operations rather than a single-threaded walk.",
            "The local prototype is the path-dependent `Graph` from the Scala tour: a node belongs to one graph value. That check is compile-time and does not partition data.",
            "When the graph no longer fits one machine, the GraphX property graph replaces the in-memory `List` of neighbors. Recovery of a lost partition is the RDD guide’s lineage.",
        ],
        "ru": [
            "Ориентированный мультиграф может иметь несколько рёбер между одной парой вершин; руководство приводит отношения вроде коллеги и друга.",
            "Вершины и рёбра несут пользовательские свойства. Алгоритмы в руководстве идут как графо-параллельные операции, а не как однопоточный обход.",
            "Локальный прототип — путь-зависимый `Graph` из тура Scala: узел принадлежит одному значению графа. Эта проверка на этапе компиляции и данные не разбивает.",
            "Когда граф больше не помещается в одну машину, граф свойств GraphX заменяет `List` соседей в памяти. Восстановление потерянного раздела — цепочка преобразований из руководства по RDD.",
        ],
    },
    """class Graph:
  class Node
  def link(from: Node, to: Node): Unit = ()

val g = Graph()
val a = g.Node()
val b = g.Node()
g.link(a, b)""",
    [
        "https://spark.apache.org/docs/latest/graphx-programming-guide.html",
        f"{S}/tour/inner-classes.html",
        "https://spark.apache.org/docs/latest/rdd-programming-guide.html",
    ],
)

add(
    "Describe an application of Scala in natural language processing.",
    {
        "en": "A Scala NLP step that stays inside documented APIs is tokenization into a collection, then a count with `groupBy` or `foldLeft`. Spark MLlib’s guide lists feature extraction and transformation as the cluster follow-up.",
        "ru": "Шаг NLP на Scala, который остаётся внутри документированных API, — токенизация в коллекцию и затем подсчёт через `groupBy` или `foldLeft`. Руководство MLlib перечисляет извлечение и преобразование признаков как продолжение на кластере.",
    },
    {
        "en": [
            "Normalize with `toLowerCase` and split on whitespace. `flatMap` merges tokens from many lines.",
            "A bag of words is `groupBy(identity)` and a size, or a `foldLeft` into a `Map`. The merge of two maps is the associative combine a parallel fold needs.",
            "MLlib featurization turns those tokens into the features column an estimator reads. The guide separates featurization from the learning algorithms.",
            "The pure token function is what ScalaTest checks. The DataFrame job is what runs once the corpus is partitioned.",
        ],
        "ru": [
            "Нормализация — `toLowerCase` и разбиение по пробелам. `flatMap` сливает токены многих строк.",
            "Мешок слов — `groupBy(identity)` и размер либо `foldLeft` в `Map`. Слияние двух отображений — ассоциативное объединение, которое нужен параллельному fold.",
            "Выделение признаков MLlib превращает эти токены в колонку признаков, которую читает оценщик. Руководство отделяет признаки от алгоритмов обучения.",
            "Чистую функцию токенов проверяет ScalaTest. Работа DataFrame запускается, когда корпус уже разбит на разделы.",
        ],
    },
    """def termCounts(lines: List[String]): Map[String, Int] =
  lines.flatMap(_.toLowerCase.split("\\\\s+").filter(_.nonEmpty))
    .groupBy(identity)
    .view.mapValues(_.size).toMap""",
    [
        f"{S}/scala3/book/collections-methods.html",
        "https://spark.apache.org/docs/latest/ml-guide.html",
    ],
)

add(
    "Discuss the use of Scala in finance for algorithmic trading systems.",
    {
        "en": "A trading calculation that the Scala guides support directly is a pure function from inputs to a decision, plus a `Future` when the input is a slow remote quote. Shared mutable position state is the case the parallel-collections guide says will not be deterministic.",
        "ru": "Расчёт для торговли, который руководства Scala поддерживают прямо, — чистая функция от входов к решению плюс `Future`, когда вход — медленная удалённая котировка. Общее изменяемое состояние позиции — тот случай, про который руководство по параллельным коллекциям говорит, что он не будет детерминированным.",
    },
    {
        "en": [
            "A pure pricing function depends only on its arguments. The pure-functions chapter says that is what makes the same inputs produce the same output, so a test can replay a quote.",
            "Two quotes fetched as futures run together. The concurrency chapter combines them with a `for` comprehension.",
            "An actor, which that chapter contrasts with a one-shot future, is the long-lived place that receives many orders. The future itself does not keep a book of positions.",
            "Do not update a shared `var` from a parallel `foreach`. Fold an immutable list of fills instead.",
        ],
        "ru": [
            "Чистая функция цены зависит только от аргументов. Глава о чистых функциях говорит, что именно поэтому одни и те же входы дают один и тот же выход, и тест может повторить котировку.",
            "Две котировки, полученные как future, идут вместе. Глава о конкурентности соединяет их через `for`.",
            "Актор, который эта глава противопоставляет одноразовому future, — долгоживущее место, куда приходит много заявок. Сам future книгу позиций не хранит.",
            "Не обновляйте общий `var` из параллельного `foreach`. Сворачивайте неизменяемый список исполнений.",
        ],
    },
    """def side(bid: Double, ask: Double, fair: Double): String =
  if ask < fair then "buy" else if bid > fair then "sell" else "hold"

import scala.concurrent.{ExecutionContext, Future}
def decision(bid: Future[Double], ask: Future[Double], fair: Double)(using ExecutionContext) =
  for b <- bid; a <- ask yield side(b, a, fair)""",
    [
        f"{S}/scala3/book/fp-pure-functions.html",
        f"{S}/scala3/book/concurrency.html",
        f"{S}/overviews/parallel-collections/overview.html",
    ],
)

add(
    "How does Scala address scalability in large machine learning systems?",
    {
        "en": "On one machine, Scala scales a pure collection operation with `.par` once the collection is large. Across machines, the RDD guide’s partitioned collection and MLlib’s DataFrame estimators are the documented step up.",
        "ru": "На одной машине Scala масштабирует чистую операцию над коллекцией через `.par`, когда коллекция большая. Между машинами документированный следующий шаг — разбитая на разделы коллекция из руководства по RDD и оценщики DataFrame из MLlib.",
    },
    {
        "en": [
            "Parallel collections split, compute, and combine. They pay off around several thousand elements and require an associative operator for a deterministic fold.",
            "An RDD partitions elements across nodes, runs transformations in parallel, and recomputes a lost partition from lineage.",
            "MLlib’s goal statement is practical machine learning that is scalable. Pipelines and the DataFrame API are the primary surface.",
            "A `Future` only moves one computation off the caller. It does not partition a training set. That split is Spark’s, not the future’s.",
        ],
        "ru": [
            "Параллельные коллекции разбивают, считают и соединяют. Они окупаются примерно от нескольких тысяч элементов и требуют ассоциативный оператор для детерминированного fold.",
            "RDD разбивает элементы по узлам, выполняет преобразования параллельно и пересчитывает потерянный раздел по цепочке преобразований.",
            "Формулировка цели MLlib — практичное машинное обучение, которое масштабируется. Конвейеры и API DataFrame — основная поверхность.",
            "`Future` только уносит одно вычисление с вызывающего. Обучающую выборку он не разбивает. Это разбиение делает Spark, не future.",
        ],
    },
    """val local = (1 to 10000).toVector.map(_ * 2)
val parallelSum = local.par.fold(0)(_ + _)
// Cluster step: sc.parallelize(local).map(_ * 2).reduce(_ + _)
parallelSum""",
    [
        f"{S}/overviews/parallel-collections/overview.html",
        "https://spark.apache.org/docs/latest/rdd-programming-guide.html",
        "https://spark.apache.org/docs/latest/ml-guide.html",
    ],
)

add(
    "Discuss the implementation of a distributed machine learning system using Scala.",
    {
        "en": "A distributed learner in this stack is a Scala driver that builds a DataFrame, fits an MLlib pipeline, and lets Spark partition the rows. The RDD guide’s contract is parallel operations plus recovery when a node fails.",
        "ru": "Распределённый обучатель в этом стеке — драйвер на Scala, который строит DataFrame, обучает конвейер MLlib и позволяет Spark разбить строки. Контракт руководства по RDD — параллельные операции плюс восстановление, когда узел отказал.",
    },
    {
        "en": [
            "The driver holds the Scala collection or the path to the file. `parallelize` or a DataFrame reader spreads the rows.",
            "Transformations are lazy. An action, or `fit` on an estimator, is what launches tasks.",
            "MLlib pipelines chain featurization and an algorithm, then save the model. The guide lists persistence as a first-class tool.",
            "Closures sent to tasks must not mutate a driver `var`. The parallel-collections warning about side effects is the same rule on one machine; the RDD guide’s copied variables are the cluster form.",
        ],
        "ru": [
            "Драйвер держит коллекцию Scala или путь к файлу. `parallelize` или читатель DataFrame раздаёт строки.",
            "Преобразования ленивы. Действие или `fit` оценщика запускает задачи.",
            "Конвейеры MLlib сцепляют признаки и алгоритм, затем сохраняют модель. Руководство перечисляет сохранение как полноценный инструмент.",
            "Замыкания, отправленные в задачи, не должны мутировать `var` драйвера. Предупреждение параллельных коллекций о побочных эффектах — то же правило на одной машине; скопированные переменные из руководства по RDD — кластерная форма.",
        ],
    },
    """def normalize(rows: List[Vector[Double]]): List[Vector[Double]] =
  rows.map { v =>
    val n = math.sqrt(v.map(x => x * x).sum)
    if n == 0 then v else v.map(_ / n)
  }
// Fit stays on the cluster:
// new org.apache.spark.ml.clustering.KMeans().setK(2).fit(frame)
normalize(List(Vector(3.0, 4.0)))""",
    [
        "https://spark.apache.org/docs/latest/rdd-programming-guide.html",
        "https://spark.apache.org/docs/latest/ml-guide.html",
        f"{S}/overviews/parallel-collections/overview.html",
    ],
)

