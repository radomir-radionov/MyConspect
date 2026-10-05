"""Conceptual reactive-programming answers grounded in the same sources."""

from reactive_items import BP, MANIFESTO, REACTOR, RS, RX, add

JVM = "https://github.com/reactive-streams/reactive-streams-jvm/blob/master/README.md"

add(
    "Define Reactive Systems and how they relate to Reactive Programming.",
    {
        "en": "The Reactive Manifesto calls a system Reactive when it is responsive, resilient, elastic, and message-driven. Reactive programming is the technique of composing asynchronous sequences; it is one way to build the message-driven part, not the whole definition.",
        "ru": "Reactive Manifesto называет систему реактивной, когда она отзывчива, устойчива, эластична и управляется сообщениями. Реактивное программирование — техника сборки асинхронных последовательностей; это один способ сделать часть, управляемую сообщениями, а не всё определение.",
    },
    {
        "en": [
            "Responsive means the system answers in a timely way. Resilient means it stays responsive under failure. Elastic means it stays responsive under changing load. Message-driven means the parts communicate by asynchronous messages.",
            "The manifesto says such systems are more flexible, loosely coupled, and scalable.",
            "A `Flux` pipeline is reactive programming. It becomes a reactive system only when failure, load, and message boundaries are designed as well.",
            "Reactive Streams is the JVM contract for one of those boundaries: demand so a fast sender cannot force an unbounded queue.",
        ],
        "ru": [
            "Отзывчивость — система отвечает вовремя. Устойчивость — она остаётся отзывчивой при сбое. Эластичность — она остаётся отзывчивой при меняющейся нагрузке. Управление сообщениями — части общаются асинхронными сообщениями.",
            "Манифест говорит, что такие системы гибче, слабее связаны и масштабируемее.",
            "Конвейер `Flux` — это реактивное программирование. Реактивной системой он становится, только когда спроектированы ещё сбой, нагрузка и границы сообщений.",
            "Reactive Streams — контракт JVM для одной из этих границ: спрос, чтобы быстрый отправитель не мог заставить очередь расти без предела.",
        ],
    },
    """Mono<String> call = Mono.fromCallable(this::remote)
    .subscribeOn(Schedulers.boundedElastic());""",
    [MANIFESTO, JVM],
)

add(
    "What role does Reactive Programming play in building microservices?",
    {
        "en": "Between services, reactive programming is how one process consumes a stream without blocking its threads and without accepting an unbounded backlog. Reactive Streams is the contract for that exchange.",
        "ru": "Между сервисами реактивное программирование — это как один процесс потребляет поток, не блокируя свои потоки и не принимая безграничный хвост. Reactive Streams — контракт этого обмена.",
    },
    {
        "en": [
            "The Reactive Streams readme targets an asynchronous boundary, including another thread pool or another host, with bounded queues.",
            "A `Mono` is the shape of one response. A `Flux` is the shape of many. Both stay lazy until subscribe.",
            "Blocking I/O is isolated with `subscribeOn(Schedulers.boundedElastic())`, as the Reactor FAQ shows, so the calling thread is not held.",
            "The manifesto’s message-driven trait is the service boundary. Operators such as `map` are inside one process.",
        ],
        "ru": [
            "Readme Reactive Streams целится в асинхронную границу, включая другой пул потоков или другой хост, с ограниченными очередями.",
            "`Mono` — форма одного ответа. `Flux` — форма многих. Оба ленивы до subscribe.",
            "Блокирующий ввод-вывод изолируют через `subscribeOn(Schedulers.boundedElastic())`, как показывает FAQ Reactor, чтобы вызывающий поток не удерживался.",
            "Черта манифеста «управление сообщениями» — это граница сервиса. Операторы вроде `map` живут внутри одного процесса.",
        ],
    },
    """Flux<String> pages = Flux.just("/a", "/b")
    .map(path -> path);""",
    [JVM, f"{REACTOR}/faq.html", MANIFESTO],
)

add(
    "Explain the difference between Reactive Systems and Reactive Programming.",
    {
        "en": "Reactive programming composes sequences with operators. A reactive system, in the manifesto, is an architecture that stays responsive by being resilient, elastic, and message-driven.",
        "ru": "Реактивное программирование собирает последовательности операторами. Реактивная система, по манифесту, — архитектура, которая остаётся отзывчивой за счёт устойчивости, эластичности и сообщений.",
    },
    {
        "en": [
            "You can write a `Flux.map` pipeline and still be a single blocking process. That is reactive programming without the system properties.",
            "You can pass asynchronous messages between services and not use `Flux` at all. That can still be a reactive system.",
            "Reactive Streams is a library-level contract used inside the programming style. The manifesto does not specify Publisher or Subscriber.",
            "The useful overlap is the boundary: non-blocking demand so one part cannot force another to buffer without limit.",
        ],
        "ru": [
            "Можно написать конвейер `Flux.map` и остаться одним блокирующим процессом. Это реактивное программирование без свойств системы.",
            "Можно передавать асинхронные сообщения между сервисами и вовсе не использовать `Flux`. Это всё ещё может быть реактивная система.",
            "Reactive Streams — контракт уровня библиотеки внутри стиля программирования. Манифест не задаёт Publisher или Subscriber.",
            "Полезное пересечение — граница: неблокирующий спрос, чтобы одна часть не могла заставить другую буферизовать без предела.",
        ],
    },
    """// programming: operators
Flux.just(1, 2, 3).map(n -> n * 2);
// system: bounded asynchronous exchange, per the Reactive Streams goal""",
    [MANIFESTO, JVM],
    when={
        "en": "Talk about operators, `Mono`, and `Flux` when the question is programming. Talk about failure, load, and asynchronous messages when the question is the system.",
        "ru": "Говорите об операторах, `Mono` и `Flux`, когда вопрос про программирование. Говорите о сбое, нагрузке и асинхронных сообщениях, когда вопрос про систему.",
    },
    lang="java",
)

add(
    "How can you ensure that Reactive Systems are resilient?",
    {
        "en": "The manifesto’s resilience means the system stays responsive when a part fails. In a stream that means the failure is a terminal signal you replace or isolate, not a stuck thread.",
        "ru": "Устойчивость в манифесте значит, что система остаётся отзывчивой, когда часть отказала. В потоке это значит, что сбой — терминальный сигнал, который заменяют или изолируют, а не застрявший поток.",
    },
    {
        "en": [
            "Reactive Streams ends a subscription with `onError` or `onComplete`. After `onError` that subscriber receives nothing else.",
            "Recovery is a library operator that substitutes another publisher before the error reaches the edge. The ReactiveX catch page is that substitution.",
            "A bounded queue is part of staying up: the readme says an unbounded buffer under a fast source defeats the asynchronous design.",
            "Isolate blocking recovery work on `boundedElastic`, as the Reactor FAQ does, so the failure path does not block the event loop.",
        ],
        "ru": [
            "Reactive Streams заканчивает подписку через `onError` или `onComplete`. После `onError` этот подписчик больше ничего не получает.",
            "Восстановление — оператор библиотеки, который подставляет другой publisher, прежде чем ошибка дойдёт до края. Страница catch в ReactiveX — эта подстановка.",
            "Ограниченная очередь — часть того, чтобы оставаться на ногах: readme говорит, что безграничный буфер при быстром источнике отменяет асинхронный замысел.",
            "Блокирующую работу восстановления изолируйте на `boundedElastic`, как FAQ Reactor, чтобы путь сбоя не блокировал цикл событий.",
        ],
    },
    """source.onErrorResume(error -> Mono.just("fallback"));""",
    [MANIFESTO, JVM, f"{RX}/operators/catch.html"],
)

add(
    "Describe how you would implement backpressure across microservices.",
    {
        "en": "Across a process boundary, backpressure is a demand signal so the sender does not outrun the receiver. The Reactive Streams readme requires that signal to be asynchronous and the queue between them to be bounded.",
        "ru": "Через границу процесса backpressure — это сигнал спроса, чтобы отправитель не обгонял получателя. Readme Reactive Streams требует, чтобы этот сигнал был асинхронным, а очередь между ними — ограниченной.",
    },
    {
        "en": [
            "The subscriber requests `n`. The publisher emits at most the outstanding demand.",
            "If the protocol is not Reactive Streams, apply the RxJava adapters the backpressure wiki names: `onBackpressureBuffer` or `onBackpressureDrop`, or shrink the stream with `debounce` or `sample` first.",
            "A synchronous call that blocks until the remote accepts more is the failure mode the readme warns about: it negates asynchronous processing.",
            "One response is a `Mono`. A streamed response is a `Flux` whose demand crosses the same boundary.",
        ],
        "ru": [
            "Подписчик запрашивает `n`. Издатель излучает не больше непогашенного спроса.",
            "Если протокол — не Reactive Streams, примените адаптеры, которые называет вики RxJava: `onBackpressureBuffer` или `onBackpressureDrop`, либо сначала сожмите поток через `debounce` или `sample`.",
            "Синхронный вызов, который блокируется, пока удалённая сторона не примет ещё, — тот режим отказа, о котором предупреждает readme: он отменяет асинхронную обработку.",
            "Один ответ — это `Mono`. Потоковый ответ — `Flux`, чей спрос пересекает ту же границу.",
        ],
    },
    """public void onSubscribe(Subscription s) {
  s.request(8);
}""",
    [JVM, BP],
    lang="java",
)

add(
    "In a microservices architecture, how do Reactive Streams help manage resources?",
    {
        "en": "Reactive Streams keeps the queue between a fast producer and a slow consumer bounded. That bound is the resource limit: memory for in-flight elements stays finite.",
        "ru": "Reactive Streams держит очередь между быстрым производителем и медленным потребителем ограниченной. Эта граница — предел ресурса: память под элементы в пути остаётся конечной.",
    },
    {
        "en": [
            "The site states the problem as live data whose volume is not known in advance.",
            "Demand is the control knob. Without it, the RxJava wiki’s `zip` of two infinite sources would buffer the faster one without limit.",
            "Non-blocking demand means the receiver can say “no more for now” without occupying a thread to do it.",
            "JDK Flow is the same contract, so a service can speak it without taking a dependency on one library’s `Flux`.",
        ],
        "ru": [
            "Сайт формулирует проблему как живые данные, чей объём заранее неизвестен.",
            "Спрос — ручка управления. Без неё `zip` двух бесконечных источников из вики RxJava буферизовал бы более быстрый без предела.",
            "Неблокирующий спрос значит, что приёмник может сказать «пока больше не надо», не занимая поток ради этого.",
            "JDK Flow — тот же контракт, поэтому сервис может говорить на нём, не завися от `Flux` одной библиотеки.",
        ],
    },
    """// zip requests only enough to refill a small buffer
// after each combined item, as the RxJava backpressure page describes
Observable.zip(left, right, (a, b) -> a + b);""",
    [RS, BP],
)

add(
    "Discuss the advantages of using Reactive Programming in microservices communication.",
    {
        "en": "The gain is composition of asynchronous calls without blocking a thread per call, plus a demand protocol so one service cannot force another to hold an unbounded buffer.",
        "ru": "Выигрыш — сборка асинхронных вызовов без блокировки потока на каждый вызов плюс протокол спроса, чтобы один сервис не мог заставить другой держать безграничный буфер.",
    },
    {
        "en": [
            "Operators such as `map` and `zip` describe the combination. Work starts at subscribe.",
            "`zip` waits for an item from each source and, in RxJava’s implementation, requests only enough to refill a small buffer.",
            "A `Mono` models one response. Failures stay on the same sequence as values, ending in `onError`.",
            "The manifesto’s loose coupling follows when services exchange messages instead of sharing a thread.",
        ],
        "ru": [
            "Операторы вроде `map` и `zip` описывают сочетание. Работа начинается в subscribe.",
            "`zip` ждёт элемент от каждого источника и в реализации RxJava запрашивает лишь столько, сколько нужно, чтобы пополнить маленький буфер.",
            "`Mono` моделирует один ответ. Сбои остаются в той же последовательности, что и значения, и заканчиваются `onError`.",
            "Слабая связанность из манифеста появляется, когда сервисы обмениваются сообщениями, а не делят поток.",
        ],
    },
    """Mono.zip(user, orders, (u, o) -> u + ":" + o);""",
    [f"{RX}/operators/zip.html", JVM, MANIFESTO],
)

add(
    "What are some challenges you might face when designing Reactive Systems?",
    {
        "en": "The hard part is the boundary the Reactive Streams readme names: stay asynchronous, keep queues bounded, and still remain responsive when a part fails.",
        "ru": "Трудная часть — граница, которую называет readme Reactive Streams: оставаться асинхронным, держать очереди ограниченными и при этом оставаться отзывчивым, когда часть отказала.",
    },
    {
        "en": [
            "A blocking call inside `map` occupies the thread `publishOn` selected. The FAQ’s fix is to isolate it with `subscribeOn` on `boundedElastic`.",
            "An unbounded `onBackpressureBuffer` only moves the overflow into memory. The wiki notes a capacity-limited buffer terminates with an error when it is overrun.",
            "Context is not a `ThreadLocal`. After `publishOn`, thread-local logging state is gone unless it was put in Reactor context.",
            "The specification does not include operators. Each library’s `flatMap` can interleave inners; assuming order is a design bug.",
        ],
        "ru": [
            "Блокирующий вызов внутри `map` занимает поток, который выбрал `publishOn`. Исправление FAQ — изолировать его через `subscribeOn` на `boundedElastic`.",
            "Безграничный `onBackpressureBuffer` только переносит переполнение в память. Вики отмечает, что буфер с пределом ёмкости завершается ошибкой, когда его переполняют.",
            "Context — не `ThreadLocal`. После `publishOn` журнальное состояние потока пропадает, если его не положили в context Reactor.",
            "Спецификация не включает операторы. `flatMap` каждой библиотеки может чередовать внутренние последовательности; предполагать порядок — ошибка проекта.",
        ],
    },
    """Mono.fromCallable(this::blockingCall)
    .subscribeOn(Schedulers.boundedElastic());""",
    [JVM, f"{REACTOR}/faq.html", BP],
)

add(
    "How does a message-driven system relate to Reactive Microservices?",
    {
        "en": "Message-driven is one of the four manifesto traits: components communicate with asynchronous messages. A reactive microservice uses that instead of a shared thread or a synchronous call that holds the caller.",
        "ru": "Управление сообщениями — одна из четырёх черт манифеста: компоненты общаются асинхронными сообщениями. Реактивный микросервис использует это вместо общего потока или синхронного вызова, который держит вызывающего.",
    },
    {
        "en": [
            "A message can be a stream element. Reactive Streams then adds demand so the mailbox cannot grow without bound.",
            "The signal protocol is `onSubscribe`, zero or more `onNext`, then `onError` or `onComplete`.",
            "Elastic and resilient behavior in the manifesto depend on this decoupling: a slow consumer slows the producer by demand, and a failed consumer ends in `onError` rather than a stuck call.",
            "Operators inside a process are not the messages between processes.",
        ],
        "ru": [
            "Сообщение может быть элементом потока. Reactive Streams тогда добавляет спрос, чтобы почтовый ящик не рос без границы.",
            "Протокол сигналов — `onSubscribe`, ноль или больше `onNext`, затем `onError` или `onComplete`.",
            "Эластичность и устойчивость в манифесте зависят от этой развязки: медленный потребитель замедляет производителя спросом, а упавший потребитель заканчивается `onError`, а не застрявшим вызовом.",
            "Операторы внутри процесса — это не сообщения между процессами.",
        ],
    },
    """subscriber.onSubscribe(subscription);
subscriber.onNext(message);
subscriber.onComplete();""",
    [MANIFESTO, JVM],
    lang="java",
)

add(
    "What are some of the most common Reactive libraries and frameworks for microservices?",
    {
        "en": "On the JVM the common pieces are the Reactive Streams API itself, RxJava, and Project Reactor. JDK `java.util.concurrent.Flow` is the same four roles. RxJS is the JavaScript member of ReactiveX.",
        "ru": "На JVM обычные части — сам API Reactive Streams, RxJava и Project Reactor. JDK `java.util.concurrent.Flow` — те же четыре роли. RxJS — член ReactiveX для JavaScript.",
    },
    {
        "en": [
            "RxJava implements observable sequences, schedulers, and subjects. Its backpressure story for sources that ignore demand is `onBackpressureBuffer` and `onBackpressureDrop`.",
            "Reactor implements `Mono` and `Flux`, `publishOn` / `subscribeOn`, and `Context`.",
            "The TCK is how a library shows it actually follows the spec, not only the type names.",
            "The manifesto is not a library. It is the system-level description these libraries are often used to satisfy.",
        ],
        "ru": [
            "RxJava реализует наблюдаемые последовательности, scheduler и subject. Его история backpressure для источников, которые игнорируют спрос, — `onBackpressureBuffer` и `onBackpressureDrop`.",
            "Reactor реализует `Mono` и `Flux`, `publishOn` / `subscribeOn` и `Context`.",
            "TCK — способ библиотеке показать, что она и вправду следует спецификации, а не только именам типов.",
            "Манифест — не библиотека. Это описание системы, которому эти библиотеки часто служат.",
        ],
    },
    """Flux.just(1).map(n -> n + 1);
Observable.just(1).map(n -> n + 1);""",
    [JVM, f"{RX}/observable.html", f"{REACTOR}/coreFeatures/schedulers.html"],
)
