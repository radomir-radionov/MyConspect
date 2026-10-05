"""Applied and interview-discussion answers for the remaining empty blocks."""

from reactive_items import BP, MANIFESTO, REACTOR, RS, RX, add

JVM = "https://github.com/reactive-streams/reactive-streams-jvm/blob/master/README.md"

add(
    "List several popular Reactive Programming frameworks and their primary use cases.",
    {
        "en": "RxJava and RxJS implement ReactiveX observable sequences. Project Reactor implements `Mono` and `Flux` on the Reactive Streams contract. JDK Flow is that same contract in the platform.",
        "ru": "RxJava и RxJS реализуют наблюдаемые последовательности ReactiveX. Project Reactor реализует `Mono` и `Flux` на контракте Reactive Streams. JDK Flow — тот же контракт в платформе.",
    },
    {
        "en": [
            "RxJava is the JVM observable library: schedulers, subjects, and operators such as `debounce` and `zip`.",
            "RxJS is the JavaScript member of the same operator set, including `from` and `scan`.",
            "Reactor is the library whose `publishOn`, `subscribeOn`, `Context`, and `StepVerifier` the reference guide documents.",
            "The Reactive Streams TCK is what a further library must pass if it wants to interoperate, rather than only borrowing the names.",
        ],
        "ru": [
            "RxJava — библиотека observable для JVM: scheduler, subject и операторы вроде `debounce` и `zip`.",
            "RxJS — член того же набора операторов для JavaScript, включая `from` и `scan`.",
            "Reactor — библиотека, чьи `publishOn`, `subscribeOn`, `Context` и `StepVerifier` описывает справочник.",
            "TCK Reactive Streams — то, что должна пройти следующая библиотека, если хочет взаимодействовать, а не только заимствовать имена.",
        ],
    },
    """Observable.just(1).map(n -> n + 1);
Mono.just(1).map(n -> n + 1);""",
    [f"{RX}/observable.html", f"{REACTOR}/coreFeatures/schedulers.html", JVM],
)

add(
    "How does Akka Streams fit into the Reactive Programming paradigm?",
    {
        "en": "Akka Streams is a stream implementation that can sit on the Reactive Streams contract: stages exchange elements asynchronously and the receiver limits demand so buffers stay bounded. Akka actors, by contrast, are the long-lived message processors the Scala concurrency chapter names.",
        "ru": "Akka Streams — реализация потоков, которая может стоять на контракте Reactive Streams: стадии обмениваются элементами асинхронно, а приёмник ограничивает спрос, чтобы буферы оставались конечными. Акторы Akka, напротив, — долгоживущие обработчики сообщений, которые называет глава Scala о конкурентности.",
    },
    {
        "en": [
            "The Reactive Streams readme’s four types are the interoperability edge. A stage that is a Processor is both subscriber and publisher.",
            "Demand via `request` is what keeps a fast stage from forcing an unbounded queue on a slow one.",
            "Operators that transform elements are library features. The specification says it does not cover transformation.",
            "An actor mailbox without demand can grow. A Reactive Streams boundary is the piece that adds the bound.",
        ],
        "ru": [
            "Четыре типа из readme Reactive Streams — край взаимодействия. Стадия-Processor одновременно подписчик и издатель.",
            "Спрос через `request` не даёт быстрой стадии навязать медленной безграничную очередь.",
            "Операторы, которые преобразуют элементы, — возможности библиотеки. Спецификация говорит, что преобразование она не описывает.",
            "Почтовый ящик актора без спроса может расти. Граница Reactive Streams — та часть, которая добавляет предел.",
        ],
    },
    """// A Reactive Streams subscriber bounds an upstream stage.
subscription.request(16);""",
    [JVM, "https://doc.akka.io/libraries/akka-core/current/typed/index.html"],
    lang="java",
)

add(
    "Discuss the integration of Reactive Programming libraries with traditional web frameworks.",
    {
        "en": "A traditional framework expects a thread to block until the result is ready. A reactive library expects a `Mono` or `Flux` and a subscribe. The integration is an adapter at the edge, not a rewrite of every operator.",
        "ru": "Традиционный фреймворк ждёт, что поток заблокируется, пока результат не будет готов. Реактивная библиотека ждёт `Mono` или `Flux` и subscribe. Интеграция — адаптер на краю, а не переписывание каждого оператора.",
    },
    {
        "en": [
            "Return a `Mono` for one response body and a `Flux` for a stream. The caller subscribes; the chain does not run before that.",
            "If the existing code blocks, wrap it as the Reactor FAQ shows: `Mono.fromCallable(...).subscribeOn(Schedulers.boundedElastic())`.",
            "Do not call `block` on the event-loop thread. That recreates the thread-per-request cost the scheduler split exists to avoid.",
            "Errors stay on `onError`. The edge adapter maps that terminal signal to the framework’s error response.",
        ],
        "ru": [
            "Возвращайте `Mono` для одного тела ответа и `Flux` для потока. Вызывающий подписывается; до этого цепочка не идёт.",
            "Если существующий код блокирует, оберните его, как показывает FAQ Reactor: `Mono.fromCallable(...).subscribeOn(Schedulers.boundedElastic())`.",
            "Не вызывайте `block` на потоке цикла событий. Это возвращает цену «поток на запрос», ради избежания которой и разделено планирование.",
            "Ошибки остаются в `onError`. Адаптер на краю отображает этот терминальный сигнал в ошибочный ответ фреймворка.",
        ],
    },
    """Mono<String> body = Mono.fromCallable(this::legacyBlocking)
    .subscribeOn(Schedulers.boundedElastic());""",
    [f"{REACTOR}/faq.html", f"{REACTOR}/coreFeatures/schedulers.html"],
)

add(
    "What are some Reactive Programming utilities provided by the Spring WebFlux framework?",
    {
        "en": "Spring WebFlux speaks Reactor types at the HTTP edge: a handler returns `Mono` or `Flux`, and the framework subscribes. The reactive utilities are therefore Reactor’s, not a second operator set.",
        "ru": "Spring WebFlux говорит типами Reactor на краю HTTP: обработчик возвращает `Mono` или `Flux`, а фреймворк подписывается. Реактивные утилиты поэтому принадлежат Reactor, а не второму набору операторов.",
    },
    {
        "en": [
            "One JSON body is a `Mono`. A streamed body is a `Flux`. Both honor Reactive Streams demand.",
            "`publishOn` and `subscribeOn` are how a handler leaves the event loop for CPU or blocking work. The Reactor schedulers page is the contract.",
            "Request-scoped data that must survive a thread hop goes in Reactor `Context`, not in a `ThreadLocal`, because `publishOn` changes threads.",
            "Tests use `StepVerifier` on the returned publisher rather than a servlet thread.",
        ],
        "ru": [
            "Одно тело JSON — это `Mono`. Потоковое тело — `Flux`. Оба соблюдают спрос Reactive Streams.",
            "`publishOn` и `subscribeOn` — как обработчик уходит с цикла событий на CPU или блокирующую работу. Контракт — страница scheduler Reactor.",
            "Данные запроса, которые должны пережить смену потока, кладут в Reactor `Context`, а не в `ThreadLocal`, потому что `publishOn` меняет потоки.",
            "Тесты используют `StepVerifier` на возвращённом publisher, а не поток сервлета.",
        ],
    },
    """Mono<String> hello = Mono.just("ok");
Flux<String> ticks = Flux.just("a", "b");""",
    [
        "https://docs.spring.io/spring-framework/reference/web/webflux.html",
        f"{REACTOR}/coreFeatures/schedulers.html",
        f"{REACTOR}/testing.html",
    ],
)

add(
    "How do you debug a complex Reactive streams pipeline?",
    {
        "en": "Debug the signal sequence, not a stack that crosses threads. `StepVerifier` states the expected `onNext` values and the terminal signal. A mismatch throws `AssertionError` at the first wrong signal.",
        "ru": "Отлаживают последовательность сигналов, а не стек, который пересекает потоки. `StepVerifier` задаёт ожидаемые значения `onNext` и терминальный сигнал. Несовпадение бросает `AssertionError` на первом неверном сигнале.",
    },
    {
        "en": [
            "Shrink the chain until the verifier passes, then add one operator back. `transform` makes that slice a named function.",
            "If the failure is “nothing happens”, nothing subscribed. Reactor’s schedulers page: nothing happens until subscribe.",
            "If the failure is a blocked event loop, a blocking call sits in `map`. Move it behind `subscribeOn(Schedulers.boundedElastic())`.",
            "If logs lose the request id after `publishOn`, read it from `Context`, which follows the subscription rather than the thread.",
        ],
        "ru": [
            "Ужимайте цепочку, пока верификатор не проходит, затем верните один оператор. `transform` делает этот кусок именованной функцией.",
            "Если сбой в том, что «ничего не происходит», никто не подписался. Страница scheduler Reactor: ничего не происходит до subscribe.",
            "Если цикл событий заблокирован, блокирующий вызов сидит в `map`. Перенесите его за `subscribeOn(Schedulers.boundedElastic())`.",
            "Если журналы теряют идентификатор запроса после `publishOn`, читайте его из `Context`, который следует за подпиской, а не за потоком.",
        ],
    },
    """StepVerifier.create(flux.map(String::toUpperCase))
    .expectNext("A")
    .verifyComplete();""",
    [f"{REACTOR}/testing.html", f"{REACTOR}/faq.html", f"{REACTOR}/coreFeatures/schedulers.html"],
)

add(
    "What are the best tools for monitoring and troubleshooting Reactive applications?",
    {
        "en": "Troubleshoot with the signal tools the libraries document: Reactor’s `StepVerifier` for expected items and context, and RxJava’s `TestScheduler` for time. Production monitoring still watches the bounded queues the Reactive Streams model exists to protect.",
        "ru": "Разбираются инструментами сигналов, которые документируют библиотеки: `StepVerifier` Reactor для ожидаемых элементов и context и `TestScheduler` RxJava для времени. Боевой мониторинг по-прежнему смотрит на ограниченные очереди, которые модель Reactive Streams и защищает.",
    },
    {
        "en": [
            "`StepVerifier` fails on the first unexpected signal, including an unexpected `onError`.",
            "`expectAccessibleContext` checks that a correlation id survived the chain.",
            "`TestScheduler.advanceTimeBy` shows whether a `delay` or `debounce` fired without sleeping.",
            "A queue that grows without a matching `request` is the overflow the Reactive Streams readme says must not happen. Alert on that depth, not only on thread count.",
        ],
        "ru": [
            "`StepVerifier` падает на первом неожиданном сигнале, включая неожиданный `onError`.",
            "`expectAccessibleContext` проверяет, что correlation id пережил цепочку.",
            "`TestScheduler.advanceTimeBy` показывает, сработал ли `delay` или `debounce`, без сна.",
            "Очередь, которая растёт без соответствующего `request`, — то переполнение, которого readme Reactive Streams требует не допускать. Сигнальте о её глубине, а не только о числе потоков.",
        ],
    },
    """StepVerifier.create(mono)
    .expectNext("ok")
    .verifyComplete();""",
    [f"{REACTOR}/testing.html", "https://github.com/ReactiveX/RxJava/wiki/What's-different-in-2.0", JVM],
)

add(
    "Explain how Reactive Programming can be used with Kafka Streams.",
    {
        "en": "Kafka Streams processes a log of records with its own topology API. Reactive Streams solves a different, adjacent problem: crossing an asynchronous boundary with bounded demand. Use Kafka Streams for the log topology, and a `Flux` only at an edge that must speak Publisher and Subscriber.",
        "ru": "Kafka Streams обрабатывает журнал записей своим API топологии. Reactive Streams решает другую, соседнюю задачу: пересечь асинхронную границу с ограниченным спросом. Kafka Streams — для топологии журнала, а `Flux` — только на краю, который должен говорить на Publisher и Subscriber.",
    },
    {
        "en": [
            "Do not rename a Kafka Streams operation to `flatMap`. The ReactiveX operator is not the Kafka Streams method.",
            "A consumer that is a Reactive Streams subscriber requests `n` and stops when demand is exhausted, which is how the readme keeps the queue bounded.",
            "Order inside one partition is the log’s order. `zip` is for pairing two reactive sources, not for reordering a partition.",
            "Backpressure across the network still has to be asynchronous. A consumer that blocks the poll thread to apply demand negates that, which the readme warns about.",
        ],
        "ru": [
            "Не переименовывайте операцию Kafka Streams в `flatMap`. Оператор ReactiveX — не метод Kafka Streams.",
            "Потребитель, который является подписчиком Reactive Streams, запрашивает `n` и останавливается, когда спрос исчерпан, — так readme держит очередь ограниченной.",
            "Порядок внутри одного раздела — порядок журнала. `zip` спаривает два реактивных источника, а не переупорядочивает раздел.",
            "Backpressure через сеть всё равно должен быть асинхронным. Потребитель, который блокирует поток poll, чтобы применить спрос, отменяет это, о чём предупреждает readme.",
        ],
    },
    """// Reactive Streams demand at the edge of a consumer.
// Kafka Streams topologies stay in the Kafka Streams API.
subscription.request(32);""",
    [JVM, "https://kafka.apache.org/documentation/streams/"],
    lang="java",
)

add(
    "How do you handle load balancing in a Reactive microservices setup?",
    {
        "en": "Elastic in the manifesto means staying responsive as load changes. In a stream, load is balanced by demand: a slow instance requests less, so the sender does not keep filling an unbounded queue toward it.",
        "ru": "Эластичность в манифесте значит оставаться отзывчивым при изменении нагрузки. В потоке нагрузку уравновешивает спрос: медленный экземпляр запрашивает меньше, поэтому отправитель не продолжает наполнять к нему безграничную очередь.",
    },
    {
        "en": [
            "Reactive Streams `request(n)` is the per-connection brake. It is not a substitute for a router, and a router is not a substitute for the brake.",
            "`onBackpressureDrop` sheds load by discarding. `onBackpressureBuffer` keeps a bounded backlog and errors when the cap is hit, which the RxJava wiki describes.",
            "`debounce` and `sample` shrink a hot stream before it is forwarded.",
            "More instances help only if each one still bounds its own queue. Extra threads without demand just move the overflow.",
        ],
        "ru": [
            "`request(n)` Reactive Streams — тормоз на соединение. Это не замена маршрутизатору, и маршрутизатор не замена тормозу.",
            "`onBackpressureDrop` сбрасывает нагрузку, отбрасывая. `onBackpressureBuffer` держит ограниченный хвост и падает с ошибкой при достижении предела — так описывает вики RxJava.",
            "`debounce` и `sample` сжимают горячий поток, прежде чем его пересылать.",
            "Больше экземпляров помогает, только если каждый всё ещё ограничивает свою очередь. Лишние потоки без спроса лишь переносят переполнение.",
        ],
    },
    """source.onBackpressureDrop();
source.sample(500, TimeUnit.MILLISECONDS);""",
    [MANIFESTO, BP],
)

add(
    "Discuss how Reactive Programming influences event-driven architecture.",
    {
        "en": "An event-driven architecture already passes asynchronous messages. Reactive programming adds a subscriber that can compose those events with operators and, on the JVM, can limit demand.",
        "ru": "Событийная архитектура уже передаёт асинхронные сообщения. Реактивное программирование добавляет подписчика, который может собирать эти события операторами и, на JVM, ограничивать спрос.",
    },
    {
        "en": [
            "The manifesto’s message-driven trait is the architecture. `map`, `scan`, and `filter`-style narrowing are the programming.",
            "`scan` turns a stream of events into a running state. That state is emitted, not stored in a mutable field closed over by the chain.",
            "A hot Subject is the in-process bus. Late subscribers see only what that Subject variant promises: future items, the latest item, or a replay.",
            "Between processes, the Reactive Streams bound still applies. An event log does not by itself implement `request`.",
        ],
        "ru": [
            "Черта манифеста «управление сообщениями» — это архитектура. `map`, `scan` и сужение в духе `filter` — это программирование.",
            "`scan` превращает поток событий в бегущее состояние. Это состояние излучается, а не лежит в изменяемом поле, захваченном цепочкой.",
            "Горячий Subject — шина внутри процесса. Опоздавшие видят только то, что обещает этот вариант Subject: будущие элементы, последний или повтор.",
            "Между процессами предел Reactive Streams всё ещё действует. Журнал событий сам по себе не реализует `request`.",
        ],
    },
    """events.scan(0, (count, event) -> count + 1);""",
    [MANIFESTO, f"{RX}/operators/scan.html", f"{RX}/subject.html"],
)

add(
    "What is RSocket, and how does it support Reactive Programming patterns?",
    {
        "en": "RSocket is a protocol for reactive streams across a network. It carries the Reactive Streams idea of asynchronous demand so one peer cannot force the other to buffer without bound.",
        "ru": "RSocket — протокол реактивных потоков через сеть. Он переносит идею Reactive Streams об асинхронном спросе, чтобы одна сторона не могла заставить другую буферизовать без границы.",
    },
    {
        "en": [
            "The Reactive Streams readme already requires backpressure signals to be asynchronous across hosts, not only across thread pools.",
            "A request-response interaction is one item, the `Mono` shape. A request-stream interaction is many items, the `Flux` shape.",
            "Application operators still sit in Reactor or RxJava. The protocol does not replace `map` or `zip`.",
            "A blocking adapter at either end removes the benefit the readme describes.",
        ],
        "ru": [
            "Readme Reactive Streams уже требует, чтобы сигналы backpressure были асинхронными между хостами, а не только между пулами потоков.",
            "Взаимодействие запрос-ответ — один элемент, форма `Mono`. Запрос-поток — много элементов, форма `Flux`.",
            "Операторы приложения по-прежнему живут в Reactor или RxJava. Протокол не заменяет `map` или `zip`.",
            "Блокирующий адаптер на любом конце снимает пользу, которую описывает readme.",
        ],
    },
    """// One response is a Mono; a stream of responses is a Flux.
// Demand still travels as Reactive Streams request(n).
Mono<String> one = Mono.just("ok");""",
    ["https://rsocket.io/", JVM],
)
