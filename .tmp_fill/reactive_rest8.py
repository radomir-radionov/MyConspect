"""Last ten reactive interview answers."""

from reactive_items import BP, MANIFESTO, REACTOR, RS, RX, add

JVM = "https://github.com/reactive-streams/reactive-streams-jvm/blob/master/README.md"

add(
    "What are the trade-offs of using Reactive Programming over traditional imperative programming models?",
    {
        "en": "You gain composition of asynchronous sequences and a bound on in-flight data. You pay with a subscription model, harder stack traces, and no benefit on a finite in-memory loop.",
        "ru": "Вы получаете сборку асинхронных последовательностей и предел данных в пути. Платите моделью подписки, более трудными стеками и отсутствием пользы на конечном цикле по памяти.",
    },
    {
        "en": [
            "A direct call returns a value. A publisher returns a description that runs at subscribe.",
            "Demand and `onBackpressureDrop` are tools an imperative loop does not have. They matter only when the source can outrun the consumer.",
            "`publishOn` splits the stack across threads. The Reactor FAQ says a `ThreadLocal` will not follow that hop.",
            "The manifesto’s responsiveness is the goal. The operator chain is justified only when asynchrony or a bound is real.",
        ],
        "ru": [
            "Прямой вызов возвращает значение. Publisher возвращает описание, которое выполняется в subscribe.",
            "Спрос и `onBackpressureDrop` — инструменты, которых нет у обычного цикла. Они важны, только когда источник может обогнать потребителя.",
            "`publishOn` рвёт стек между потоками. FAQ Reactor говорит, что `ThreadLocal` за этим переходом не последует.",
            "Цель — отзывчивость из манифеста. Цепочка операторов оправдана, только когда асинхронность или предел настоящие.",
        ],
    },
    """// imperative
int doubled = n * 2;
// reactive, when the value arrives later
Mono.just(n).map(x -> x * 2);""",
    [RS, f"{REACTOR}/faq.html", MANIFESTO],
)

add(
    "Discuss some of the complexities and pitfalls that come with adopting Reactive Programming.",
    {
        "en": "The usual pitfalls are subscribing too early, blocking inside `map`, assuming `flatMap` preserves order, and buffering a fast source without a cap.",
        "ru": "Обычные ловушки — подписаться слишком рано, заблокироваться внутри `map`, считать, что `flatMap` сохраняет порядок, и буферизовать быстрый источник без предела.",
    },
    {
        "en": [
            "Nothing runs until subscribe. A forgotten subscribe is a silent no-op, which the schedulers page states.",
            "`flatMap` merges inners and can interleave them. Switch keeps only the latest inner.",
            "An unbounded buffer is the `zip` failure in the RxJava backpressure wiki. Use a capped buffer, which errors when overrun, or drop.",
            "Context is not thread-local. After `publishOn`, read ambient data from Reactor `Context`.",
        ],
        "ru": [
            "Ничего не выполняется до subscribe. Забытая подписка — тихий пустой ход, как говорит страница scheduler.",
            "`flatMap` сливает внутренние потоки и может их чередовать. Switch держит только последний.",
            "Безграничный буфер — сбой `zip` из вики RxJava о backpressure. Используйте буфер с пределом, который падает при переполнении, или отбрасывание.",
            "Context — не thread-local. После `publishOn` сопутствующие данные читают из Reactor `Context`.",
        ],
    },
    """source.flatMap(id -> load(id));          // merges
source.switchMap(id -> load(id));        // latest only
source.onBackpressureDrop();""",
    [f"{RX}/operators/flatmap.html", f"{RX}/operators/switch.html", BP, f"{REACTOR}/faq.html"],
)

add(
    "How do you manage thread exhaustion in a Reactive application?",
    {
        "en": "Thread exhaustion here means blocking calls sitting on the few event-loop threads. Move those calls to `Schedulers.boundedElastic()` and keep the event loop for non-blocking stages.",
        "ru": "Исчерпание потоков здесь значит, что блокирующие вызовы сидят на немногих потоках цикла событий. Перенесите эти вызовы на `Schedulers.boundedElastic()` и оставьте цикл событий неблокирующим стадиям.",
    },
    {
        "en": [
            "The FAQ places `subscribeOn` immediately after the blocking source. Later operators come after that wrapper.",
            "`subscribeOn` does not subscribe by itself. It selects the scheduler used when subscribe happens.",
            "`publishOn` does not make a blocking `map` safe. The blocking call has to be inside the callable that `boundedElastic` runs.",
            "More event-loop threads do not fix a call that blocks each of them. The bound is the elastic pool, which is capped.",
        ],
        "ru": [
            "FAQ ставит `subscribeOn` сразу после блокирующего источника. Поздние операторы идут после этой обёртки.",
            "`subscribeOn` сам не подписывается. Он выбирает scheduler на момент подписки.",
            "`publishOn` не делает блокирующий `map` безопасным. Блокирующий вызов должен быть внутри callable, который выполняет `boundedElastic`.",
            "Больше потоков цикла событий не чинит вызов, который блокирует каждый из них. Предел — пул elastic, и он ограничен.",
        ],
    },
    """Mono.fromCallable(this::blockingCall)
    .subscribeOn(Schedulers.boundedElastic());""",
    [f"{REACTOR}/faq.html", f"{REACTOR}/coreFeatures/schedulers.html"],
)

add(
    "Address the learning curve associated with Reactive Programming. How do you get a team up to speed?",
    {
        "en": "Teach the signal protocol first, then one library’s operators, and keep tests on `StepVerifier` so a wrong mental model fails as an assertion instead of a production hang.",
        "ru": "Сначала учат протокол сигналов, затем операторы одной библиотеки, и держат тесты на `StepVerifier`, чтобы неверная модель падала утверждением, а не зависанием в проде.",
    },
    {
        "en": [
            "The protocol is `onSubscribe`, `onNext` zero or more times, then `onError` or `onComplete`. The JVM readme is that page.",
            "Next: `map` versus `flatMap` versus Switch, and cold `from` versus a Subject. Those four pages cover most design arguments.",
            "`StepVerifier.expectNext(...).verifyComplete()` is the exercise. Virtual time replaces `Thread.sleep` for `delay`.",
            "Add schedulers only after the sequence is correct on one thread. `subscribeOn` and `publishOn` are the following lesson, from the Reactor schedulers page.",
        ],
        "ru": [
            "Протокол — `onSubscribe`, `onNext` ноль или больше раз, затем `onError` или `onComplete`. Readme JVM — эта страница.",
            "Дальше: `map` против `flatMap` против Switch и холодный `from` против Subject. Эти страницы закрывают большинство проектных споров.",
            "Упражнение — `StepVerifier.expectNext(...).verifyComplete()`. Виртуальное время заменяет `Thread.sleep` для `delay`.",
            "Scheduler добавляют, только когда последовательность верна на одном потоке. `subscribeOn` и `publishOn` — следующий урок со страницы scheduler Reactor.",
        ],
    },
    """StepVerifier.create(Flux.just(1, 2).map(n -> n * 2))
    .expectNext(2, 4)
    .verifyComplete();""",
    [JVM, f"{REACTOR}/testing.html", f"{RX}/operators/flatmap.html", f"{RX}/operators/switch.html"],
)

add(
    "What are some known issues with debugging Reactive streams and how do you tackle them?",
    {
        "en": "Stacks split at `publishOn`, nothing runs without subscribe, and an error can be swallowed before the subscriber. Tackle them with `StepVerifier`, by subscribing in the test, and by letting `onError` stay terminal.",
        "ru": "Стеки рвутся на `publishOn`, без subscribe ничего не идёт, а ошибку могут проглотить до подписчика. С этим справляются через `StepVerifier`, подписку в тесте и тем, что `onError` остаётся терминальным.",
    },
    {
        "en": [
            "The first mismatch in `StepVerifier` throws `AssertionError` and names the expected signal.",
            "A missing subscription is not a logic bug inside `map`. The schedulers page: nothing happens until subscribe.",
            "After `publishOn`, a `ThreadLocal` request id disappears. `expectAccessibleContext` checks the `Context` that replaced it.",
            "Time-based bugs use `TestScheduler.advanceTimeBy` so the test does not sleep.",
        ],
        "ru": [
            "Первое несовпадение в `StepVerifier` бросает `AssertionError` и называет ожидаемый сигнал.",
            "Отсутствующая подписка — не ошибка логики внутри `map`. Страница scheduler: ничего не происходит до subscribe.",
            "После `publishOn` идентификатор запроса из `ThreadLocal` исчезает. `expectAccessibleContext` проверяет `Context`, который его заменил.",
            "Ошибки, зависящие от времени, используют `TestScheduler.advanceTimeBy`, чтобы тест не спал.",
        ],
    },
    """StepVerifier.create(mono)
    .expectNext("ok")
    .verifyComplete();""",
    [f"{REACTOR}/testing.html", f"{REACTOR}/coreFeatures/schedulers.html", f"{REACTOR}/faq.html"],
)

add(
    "Predict how Reactive Programming might evolve in the next few years.",
    {
        "en": "The stable center is already specified: Reactive Streams and JDK Flow are the same demand protocol, and libraries keep their operators on top. Evolution is more runtimes speaking that protocol, not a new set of signal names.",
        "ru": "Устойчивый центр уже специфицирован: Reactive Streams и JDK Flow — один протокол спроса, а библиотеки держат свои операторы сверху. Развитие — больше сред, говорящих на этом протоколе, а не новый набор имён сигналов.",
    },
    {
        "en": [
            "The reactive-streams.org page says JDK Flow is semantically 1:1 and expects libraries to move to those types, with an adapter during the move.",
            "Operators such as `map`, `zip`, and `debounce` stay library features. The specification refuses to define them.",
            "Virtual threads reduce the pain of a blocking call, but they do not bound a queue. `request` remains the bound.",
            "The manifesto’s four properties do not change when the library does.",
        ],
        "ru": [
            "Страница reactive-streams.org говорит, что JDK Flow семантически совпадает один к одному, и ждёт, что библиотеки перейдут на эти типы, с адаптером на время перехода.",
            "Операторы вроде `map`, `zip` и `debounce` остаются возможностями библиотек. Спецификация отказывается их определять.",
            "Виртуальные потоки уменьшают боль блокирующего вызова, но не ограничивают очередь. Пределом остаётся `request`.",
            "Четыре свойства манифеста не меняются вместе с библиотекой.",
        ],
    },
    """// java.util.concurrent.Flow matches Publisher, Subscriber,
// Subscription, and Processor.
subscription.request(1);""",
    [RS, JVM, MANIFESTO],
    lang="java",
)

add(
    "How does Reactive Programming interact with AI and machine learning workloads?",
    {
        "en": "A model call is often blocking and one-shot. Wrap it as a `Mono` on `boundedElastic`. A stream of features is a `Flux` only when the caller must bound how many inferences are in flight.",
        "ru": "Вызов модели часто блокирующий и одноразовый. Оберните его в `Mono` на `boundedElastic`. Поток признаков — это `Flux`, только когда вызывающий должен ограничить, сколько выводов одновременно в пути.",
    },
    {
        "en": [
            "The FAQ’s callable-plus-`subscribeOn` is the adapter for a blocking inference client.",
            "`flatMap` can run one inference per item. A cap on concurrency is a library parameter only where that library documents it; otherwise bound the source with `request`.",
            "Results that must stay in input order use `zip` with the inputs, not an unordered merge.",
            "Training a batch that already fits in memory does not need a publisher. The Reactive Streams problem is the live, unbounded feed.",
        ],
        "ru": [
            "Callable плюс `subscribeOn` из FAQ — адаптер для блокирующего клиента вывода.",
            "`flatMap` может запустить один вывод на элемент. Предел конкурентности — параметр библиотеки только там, где библиотека его документирует; иначе ограничьте источник через `request`.",
            "Результаты, которые должны сохранить порядок входа, используют `zip` со входами, а не неупорядоченное слияние.",
            "Обучение пакета, который уже помещается в память, не нуждается в publisher. Задача Reactive Streams — живой неограниченный поток.",
        ],
    },
    """Mono.fromCallable(() -> model.predict(features))
    .subscribeOn(Schedulers.boundedElastic());""",
    [f"{REACTOR}/faq.html", f"{RX}/operators/zip.html", RS],
)

add(
    "Discuss the relevance of Reactive Programming in the age of serverless architectures.",
    {
        "en": "A serverless invocation is usually one request and one response, which is a `Mono`, or simply async/await. A publisher earns its place when the function consumes or produces a sequence that must be bounded.",
        "ru": "Бессерверный вызов — обычно один запрос и один ответ, то есть `Mono` или просто async/await. Publisher оправдан, когда функция потребляет или производит последовательность, которую нужно ограничить.",
    },
    {
        "en": [
            "Cold start and a short lifetime argue against a long-lived Subject inside the function.",
            "A blocking SDK call still belongs on `boundedElastic` if the runtime is an event loop. On a runtime that gives you a thread per invocation, an ordinary call is enough.",
            "Streaming a response is a `Flux` with demand so the platform buffer stays finite.",
            "The manifesto’s elasticity here is the platform adding invocations. The code’s job is not to block the few threads it was given.",
        ],
        "ru": [
            "Холодный старт и короткая жизнь спорят против долгоживущего Subject внутри функции.",
            "Блокирующий вызов SDK всё ещё принадлежит `boundedElastic`, если среда — цикл событий. На среде, которая даёт поток на вызов, достаточно обычного вызова.",
            "Потоковый ответ — это `Flux` со спросом, чтобы буфер платформы оставался конечным.",
            "Эластичность манифеста здесь — платформа добавляет вызовы. Задача кода — не блокировать те немногие потоки, которые ему дали.",
        ],
    },
    """Mono<String> body = Mono.fromCallable(this::handler)
    .subscribeOn(Schedulers.boundedElastic());""",
    [f"{REACTOR}/faq.html", MANIFESTO, JVM],
    when={
        "en": "Return one value with async/await or a `Mono` when the function does one thing. Use a `Flux` when the function streams and the consumer must apply demand.",
        "ru": "Возвращайте одно значение через async/await или `Mono`, когда функция делает одно дело. `Flux` — когда функция стримит и потребитель должен применить спрос.",
    },
)

add(
    "What role might Reactive Programming play in the future of distributed systems and edge computing?",
    {
        "en": "Edge nodes are slow consumers of a fast core, or the reverse. The role of reactive programming is the asynchronous demand the Reactive Streams readme requires across hosts so the queue on the small node stays bounded.",
        "ru": "Узлы на краю — медленные потребители быстрого ядра или наоборот. Роль реактивного программирования — асинхронный спрос, которого readme Reactive Streams требует между хостами, чтобы очередь на маленьком узле оставалась ограниченной.",
    },
    {
        "en": [
            "A synchronous backpressure call would block the link and, the readme says, cancel the benefit of asynchrony.",
            "`sample` or `onBackpressureDrop` fits a link that can lose intermediate readings. A capped buffer fits a link that must not.",
            "Message-driven, in the manifesto, is how the edge stays decoupled from the core’s thread pool.",
            "Operators stay at the ends. The wire carries demand and items, which is the protocol, not `map`.",
        ],
        "ru": [
            "Синхронный вызов backpressure заблокировал бы канал и, как говорит readme, отменил бы пользу асинхронности.",
            "`sample` или `onBackpressureDrop` подходит каналу, который может терять промежуточные чтения. Буфер с пределом — каналу, который не может.",
            "Управление сообщениями в манифесте — как край остаётся отвязанным от пула потоков ядра.",
            "Операторы остаются на концах. По проводу идут спрос и элементы — это протокол, а не `map`.",
        ],
    },
    """edge.onBackpressureDrop();
subscription.request(4);""",
    [JVM, BP, MANIFESTO],
)

add(
    "How are current advancements in hardware affecting Reactive Programming paradigms?",
    {
        "en": "More cores make the asynchronous boundary inside one machine ordinary: the Reactive Streams readme already names multiple CPU cores as a reason to pass elements between thread pools with a bounded queue.",
        "ru": "Больше ядер делает асинхронную границу внутри одной машины обычной: readme Reactive Streams уже называет несколько ядер CPU причиной передавать элементы между пулами потоков с ограниченной очередью.",
    },
    {
        "en": [
            "Faster cores do not remove the need for `request`. A faster producer overflows a slower consumer even more quickly.",
            "Reactor’s `publishOn(Schedulers.parallel())` is how CPU-bound stages use those cores. Blocking I/O still does not belong on that scheduler; the FAQ uses `boundedElastic`.",
            "Virtual threads make a blocking call cheaper. They do not implement demand. A `zip` of two infinite sources can still buffer without bound.",
            "The four manifesto properties stay about responsiveness under failure and load, not about a core count.",
        ],
        "ru": [
            "Более быстрые ядра не снимают нужду в `request`. Более быстрый производитель переполняет более медленного потребителя ещё скорее.",
            "`publishOn(Schedulers.parallel())` в Reactor — как стадии, занятые CPU, используют эти ядра. Блокирующий ввод-вывод этому scheduler всё ещё не принадлежит; FAQ использует `boundedElastic`.",
            "Виртуальные потоки удешевляют блокирующий вызов. Спрос они не реализуют. `zip` двух бесконечных источников всё ещё может буферизовать без границы.",
            "Четыре свойства манифеста по-прежнему про отзывчивость при сбое и нагрузке, а не про число ядер.",
        ],
    },
    """Flux.range(1, 100)
    .publishOn(Schedulers.parallel())
    .map(n -> n * n);""",
    [JVM, f"{REACTOR}/coreFeatures/schedulers.html", f"{REACTOR}/faq.html", MANIFESTO],
)
