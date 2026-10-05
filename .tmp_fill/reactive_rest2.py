"""Reactor, Reactive Streams, and operator answers."""

from reactive_items import BP, MANIFESTO, REACTOR, RS, RX, add

JVM = "https://github.com/reactive-streams/reactive-streams-jvm/blob/master/README.md"

add(
    "What is the Reactive Streams specification?",
    {
        "en": "Reactive Streams is a standard for asynchronous stream processing with non-blocking backpressure. Its goal is to pass elements across an asynchronous boundary without forcing the receiver to buffer an arbitrary amount.",
        "ru": "Reactive Streams — стандарт асинхронной обработки потоков с неблокирующим backpressure. Цель — передавать элементы через асинхронную границу, не заставляя приёмник буферизовать произвольный объём.",
    },
    {
        "en": [
            "The JVM readme says a fast source must not overwhelm the destination, and the queues between threads stay bounded because backpressure is part of the model.",
            "Backpressure signals themselves must be asynchronous. A synchronous signal would cancel the benefit of asynchronous processing.",
            "The specification is the API plus a TCK. Extra features are allowed if the implementation still passes the TCK.",
            "JDK `java.util.concurrent.Flow` is semantically 1:1 with these types. Transformation of streams is explicitly not part of the specification.",
        ],
        "ru": [
            "Readme JVM говорит, что быстрый источник не должен захлёстывать приёмник, а очереди между потоками остаются ограниченными, потому что backpressure входит в модель.",
            "Сами сигналы backpressure должны быть асинхронными. Синхронный сигнал отменил бы пользу асинхронной обработки.",
            "Спецификация — это API плюс TCK. Дополнительные возможности допустимы, если реализация всё ещё проходит TCK.",
            "JDK `java.util.concurrent.Flow` семантически совпадает с этими типами один к одному. Преобразование потоков в спецификацию явно не входит.",
        ],
    },
    """// Maven coordinates from the Reactive Streams JVM readme
// org.reactivestreams:reactive-streams:1.0.4
Publisher<Integer> source = subscriber -> { };""",
    [RS, JVM],
    lang="java",
)

add(
    "Describe the main interfaces of the Reactive Streams API.",
    {
        "en": "The JVM readme lists four components: Publisher, Subscriber, Subscription, and Processor. A Publisher provides a possibly unbounded sequence according to demand from its Subscriber.",
        "ru": "Readme JVM перечисляет четыре компонента: Publisher, Subscriber, Subscription и Processor. Publisher даёт возможно неограниченную последовательность по спросу своего Subscriber.",
    },
    {
        "en": [
            "`Publisher.subscribe(Subscriber)` starts the protocol. The readme gives the signal order `onSubscribe onNext* (onError | onComplete)`.",
            "A Subscription is what the subscriber receives in `onSubscribe`. Demand travels on that subscription.",
            "A Processor is both a Subscriber and a Publisher, so it can sit between two stages.",
            "The specification does not define map or filter. Those are library operators on top of these four types.",
        ],
        "ru": [
            "`Publisher.subscribe(Subscriber)` начинает протокол. Readme задаёт порядок сигналов `onSubscribe onNext* (onError | onComplete)`.",
            "Subscription — то, что подписчик получает в `onSubscribe`. Спрос идёт по этой подписке.",
            "Processor — одновременно Subscriber и Publisher, поэтому он может стоять между двумя стадиями.",
            "Спецификация не определяет map или filter. Это операторы библиотек поверх этих четырёх типов.",
        ],
    },
    """void onSubscribe(Subscription s);
void onNext(T item);
void onError(Throwable t);
void onComplete();""",
    [JVM, RS],
    lang="java",
)

add(
    "How does backpressure work within the Reactive Streams API?",
    {
        "en": "The subscriber tells the publisher how many elements it can accept. The publisher must not emit more than that outstanding demand, so the queue between them stays bounded.",
        "ru": "Подписчик сообщает издателю, сколько элементов готов принять. Издатель не должен излучать больше этого непогашенного спроса, поэтому очередь между ними остаётся ограниченной.",
    },
    {
        "en": [
            "The Reactive Streams site says backpressure is what keeps a fast source from overwhelming the destination.",
            "Demand is requested on the Subscription. Signals, including that request, are required to be non-blocking.",
            "The RxJava backpressure page shows the same pull in `zip`: a small buffer per source, and one more item requested only after an item is emitted.",
            "`onBackpressureBuffer` and `onBackpressureDrop` are RxJava adapters for a source that ignores `request`. They are not part of the four interfaces.",
        ],
        "ru": [
            "Сайт Reactive Streams говорит, что backpressure не даёт быстрому источнику захлестнуть приёмник.",
            "Спрос запрашивают на Subscription. Сигналы, включая этот запрос, обязаны быть неблокирующими.",
            "Страница backpressure RxJava показывает тот же pull в `zip`: маленький буфер на источник и ещё один элемент запрашивается только после излучения.",
            "`onBackpressureBuffer` и `onBackpressureDrop` — адаптеры RxJava для источника, который игнорирует `request`. В четыре интерфейса они не входят.",
        ],
    },
    """public void onSubscribe(Subscription s) {
  s.request(1);
}""",
    [JVM, BP],
    lang="java",
)

add(
    "What is Project Reactor, and how is it related to Reactive Streams?",
    {
        "en": "Project Reactor is a Reactive Streams library for the JVM. `Flux` and `Mono` are Publishers, so a Reactor type can be subscribed with the same demand protocol as any other Reactive Streams publisher.",
        "ru": "Project Reactor — библиотека Reactive Streams для JVM. `Flux` и `Mono` — это Publisher, поэтому тип Reactor можно подписать тем же протоколом спроса, что и любой другой publisher Reactive Streams.",
    },
    {
        "en": [
            "Reactor adds operators on top of the specification. The specification itself, the JVM readme says, does not cover transformation.",
            "`subscribeOn` and `publishOn` move work across schedulers. The schedulers page says nothing happens until subscribe, and `publishOn` affects the chain after it while `subscribeOn` affects subscription.",
            "`StepVerifier` subscribes and compares signals, which is Reactor’s test tool, not part of the spec.",
            "A non-Reactor Publisher does not carry Reactor `Context`. The context page says context propagation needs Reactor operators.",
        ],
        "ru": [
            "Reactor добавляет операторы поверх спецификации. Сама спецификация, как говорит readme JVM, преобразования не описывает.",
            "`subscribeOn` и `publishOn` переносят работу между scheduler. Страница scheduler говорит, что ничего не происходит до subscribe, `publishOn` влияет на цепочку после себя, а `subscribeOn` — на подписку.",
            "`StepVerifier` подписывается и сравнивает сигналы; это инструмент тестов Reactor, не часть спецификации.",
            "Publisher не из Reactor не несёт Reactor `Context`. Страница context говорит, что распространение context требует операторов Reactor.",
        ],
    },
    """Mono<String> one = Mono.just("ok");
Flux<Integer> many = Flux.just(1, 2, 3);""",
    [
        f"{REACTOR}/coreFeatures/schedulers.html",
        JVM,
    ],
)

add(
    "Compare and contrast Mono and Flux in Project Reactor.",
    {
        "en": "`Mono` is the Reactor publisher of zero or one item. `Flux` is the publisher of zero to many items. Both complete or error, and both honor Reactive Streams demand.",
        "ru": "`Mono` — publisher Reactor на ноль или один элемент. `Flux` — publisher на от нуля до многих элементов. Оба завершаются или падают с ошибкой, и оба соблюдают спрос Reactive Streams.",
    },
    {
        "en": [
            "`Mono.just` emits one value and completes. `Flux.just` emits each argument, then completes.",
            "The same schedulers apply. `subscribeOn` still only picks the thread for subscription; `publishOn` still switches the downstream chain.",
            "`transform` is documented on a `Flux` chain and works the same way on a `Mono`: the function is applied at assembly time.",
            "Use a `Mono` for one HTTP response body. Use a `Flux` for a stream of rows. Flattening a `Flux` of `Mono` is an operator on top of the spec, not a third interface.",
        ],
        "ru": [
            "`Mono.just` излучает одно значение и завершается. `Flux.just` излучает каждый аргумент и затем завершается.",
            "Те же scheduler применимы. `subscribeOn` по-прежнему выбирает только поток подписки; `publishOn` по-прежнему переключает цепочку ниже.",
            "`transform` документирован на цепочке `Flux` и так же работает на `Mono`: функция применяется во время сборки.",
            "`Mono` — для одного тела HTTP-ответа. `Flux` — для потока строк. Разворот `Flux` из `Mono` — оператор поверх спецификации, а не третий интерфейс.",
        ],
    },
    """Mono<String> body = Mono.just("ok");
Flux<String> rows = Flux.just("a", "b");""",
    [
        f"{REACTOR}/coreFeatures/schedulers.html",
        f"{REACTOR}/advancedFeatures/advanced-mutualizing-operator-usage.html",
    ],
    when={
        "en": "Pick `Mono` when the contract is one result or none. Pick `Flux` when the contract is a sequence.",
        "ru": "`Mono` — когда контракт это один результат или ни одного. `Flux` — когда контракт это последовательность.",
    },
)

add(
    "How does Project Reactor enable asynchronous and non-blocking operations?",
    {
        "en": "Reactor keeps the chain lazy until subscribe, then runs stages on schedulers so a slow source does not block the caller. Demand from the subscriber bounds how much may be in flight.",
        "ru": "Reactor держит цепочку ленивой до subscribe, затем выполняет стадии на scheduler, чтобы медленный источник не блокировал вызывающего. Спрос подписчика ограничивает, сколько может быть в пути.",
    },
    {
        "en": [
            "The schedulers page: nothing happens until you subscribe. `subscribeOn` changes the thread that subscribes. Its position does not pick which later operator runs where; the closest downstream `subscribeOn` is the one that matters.",
            "`publishOn` switches the thread for operators after it, up to the next `publishOn`.",
            "The FAQ shows a blocking call wrapped and placed on `subscribeOn` immediately after the source, with later operators after that wrapper.",
            "Reactive Streams requires the exchange, including backpressure, to be non-blocking. Buffering without bound would break that.",
        ],
        "ru": [
            "Страница scheduler: ничего не происходит, пока вы не подпишетесь. `subscribeOn` меняет поток, который подписывается. Его позиция не выбирает, где выполнится поздний оператор; важен ближайший `subscribeOn` ниже по цепочке.",
            "`publishOn` переключает поток для операторов после себя, до следующего `publishOn`.",
            "FAQ показывает блокирующий вызов, обёрнутый и поставленный на `subscribeOn` сразу после источника, а дальнейшие операторы — после этой обёртки.",
            "Reactive Streams требует, чтобы обмен, включая backpressure, был неблокирующим. Безграничный буфер это ломает.",
        ],
    },
    """Mono<String> blockingWrapper = Mono.fromCallable(this::blockingCall)
    .subscribeOn(Schedulers.boundedElastic());""",
    [
        f"{REACTOR}/coreFeatures/schedulers.html",
        f"{REACTOR}/faq.html",
        JVM,
    ],
)

add(
    "What are some strategies for testing Reactor flows?",
    {
        "en": "`StepVerifier` subscribes to a `Flux` or `Mono` and compares each signal with the next expectation. The first mismatch throws `AssertionError`.",
        "ru": "`StepVerifier` подписывается на `Flux` или `Mono` и сравнивает каждый сигнал со следующим ожиданием. Первое несовпадение бросает `AssertionError`.",
    },
    {
        "en": [
            "Create the verifier on the publisher your method returns. Expectations such as `expectNext` then `verifyComplete` both describe the sequence and start it.",
            "`expectAccessibleContext` checks Reactor context, then `then()` returns to sequence expectations.",
            "`StepVerifierOptions` can start the test with an initial context.",
            "`expectNoAccessibleContext` is for a publisher that is not a Reactor type and therefore cannot propagate context.",
        ],
        "ru": [
            "Верификатор создают на publisher, который возвращает ваш метод. Ожидания вроде `expectNext` и затем `verifyComplete` и описывают последовательность, и запускают её.",
            "`expectAccessibleContext` проверяет context Reactor, затем `then()` возвращает к ожиданиям последовательности.",
            "`StepVerifierOptions` может начать тест с начальным context.",
            "`expectNoAccessibleContext` — для publisher не типа Reactor, который поэтому не может распространить context.",
        ],
    },
    """StepVerifier.create(Mono.just(1).map(i -> i + 10))
    .expectNext(11)
    .verifyComplete();""",
    [f"{REACTOR}/testing.html"],
)

add(
    "How do you convert blocking code to non-blocking reactive code in Reactor?",
    {
        "en": "Isolate the blocking call in a `Callable` and subscribe that `Mono` on a scheduler meant for blocking work. The FAQ says `subscribeOn` does not itself subscribe; it only chooses the scheduler used when subscribe happens.",
        "ru": "Изолируйте блокирующий вызов в `Callable` и подпишите этот `Mono` на scheduler, предназначенный для блокирующей работы. FAQ говорит, что `subscribeOn` сам не подписывается; он только выбирает scheduler на момент подписки.",
    },
    {
        "en": [
            "Put `subscribeOn` immediately after the blocking source. Further operators are defined after that wrapper.",
            "`Schedulers.boundedElastic()` is the scheduler the FAQ uses for that wrapper.",
            "Do not call the blocking method inside `map` on a non-blocking thread. That occupies the event-loop thread the schedulers page is trying to keep free.",
            "The outer type stays a `Mono` or `Flux`, so callers compose it instead of waiting.",
        ],
        "ru": [
            "Поставьте `subscribeOn` сразу после блокирующего источника. Дальнейшие операторы определяют после этой обёртки.",
            "`Schedulers.boundedElastic()` — scheduler, который FAQ использует для такой обёртки.",
            "Не вызывайте блокирующий метод внутри `map` на неблокирующем потоке. Это занимает поток цикла событий, который страница scheduler старается держать свободным.",
            "Внешний тип остаётся `Mono` или `Flux`, поэтому вызывающие его собирают, а не ждут.",
        ],
    },
    """Mono<String> result = Mono.fromCallable(this::blockingCall)
    .subscribeOn(Schedulers.boundedElastic());""",
    [f"{REACTOR}/faq.html", f"{REACTOR}/coreFeatures/schedulers.html"],
    when={
        "en": "Wrap a call that blocks. Leave an already asynchronous publisher alone; adding `subscribeOn` around a non-blocking source only adds a thread hop.",
        "ru": "Оборачивайте вызов, который блокирует. Уже асинхронный publisher не трогайте: `subscribeOn` вокруг неблокирующего источника только добавляет переход между потоками.",
    },
)

add(
    "In Reactor, how is `Context` used?",
    {
        "en": "Reactor `Context` is a map tied to a subscription, not to a thread. It propagates from the final subscriber upward so operators can read values such as a correlation id without a `ThreadLocal`.",
        "ru": "Reactor `Context` — отображение, привязанное к подписке, а не к потоку. Оно распространяется от конечного подписчика вверх, чтобы операторы читали значения вроде correlation id без `ThreadLocal`.",
    },
    {
        "en": [
            "Write it with `contextWrite` at subscription time. `contextWrite` merges the view you pass with the downstream context via `putAll`, producing a new context for upstream.",
            "Read it from a source with `deferContextual`. In the middle of a chain, use `transformDeferredContextual`. Inside `flatMap`, `Mono.deferContextual` materializes the view.",
            "The FAQ contrasts this with MDC, which assumes one thread. `publishOn` breaks that assumption; context does not.",
            "`StepVerifier.expectAccessibleContext` asserts what was propagated. A non-Reactor publisher has no accessible context.",
        ],
        "ru": [
            "Пишут его через `contextWrite` в момент подписки. `contextWrite` сливает переданное представление с context снизу через `putAll` и даёт новый context вверх.",
            "Из источника читают через `deferContextual`. В середине цепочки — `transformDeferredContextual`. Внутри `flatMap` представление материализует `Mono.deferContextual`.",
            "FAQ противопоставляет это MDC, который предполагает один поток. `publishOn` ломает это предположение; context — нет.",
            "`StepVerifier.expectAccessibleContext` проверяет, что распространилось. У publisher не из Reactor доступного context нет.",
        ],
    },
    """Mono<String> greeting = Mono.just("Hello")
    .flatMap(s -> Mono.deferContextual(ctx ->
        Mono.just(s + " " + ctx.get("name"))))
    .contextWrite(Context.of("name", "World"));""",
    [
        f"{REACTOR}/advancedFeatures/context.html",
        f"{REACTOR}/faq.html",
        f"{REACTOR}/testing.html",
    ],
)

add(
    "What is the `transform` operator and how do you use it in Reactor?",
    {
        "en": "`transform` encapsulates a piece of operator chain in a function and applies that function once, at assembly time. The Reactor guide says this is equivalent to writing the operators directly on the chain.",
        "ru": "`transform` упаковывает кусок цепочки операторов в функцию и применяет её один раз, во время сборки. Руководство Reactor говорит, что это равносильно записать операторы прямо на цепочке.",
    },
    {
        "en": [
            "Every subscriber of that sequence sees the same assembled operators.",
            "`transformDeferred` applies the function per subscriber, so each subscription can get a different chain.",
            "The guide’s example prints, then `transform(filterAndMap)`, then subscribes.",
            "Assembly-time means the function runs when the chain is built, not once per element.",
        ],
        "ru": [
            "Каждый подписчик этой последовательности видит одни и те же собранные операторы.",
            "`transformDeferred` применяет функцию на каждого подписчика, поэтому у каждой подписки может быть другая цепочка.",
            "Пример руководства печатает, затем делает `transform(filterAndMap)`, затем подписывается.",
            "Время сборки значит, что функция выполняется, когда цепочку строят, а не один раз на элемент.",
        ],
    },
    """Function<Flux<String>, Flux<String>> filterAndMap =
    f -> f.filter(color -> !color.equals("orange"))
          .map(String::toUpperCase);

Flux.just("blue", "orange").transform(filterAndMap);""",
    [f"{REACTOR}/advancedFeatures/advanced-mutualizing-operator-usage.html"],
    when={
        "en": "Use `transform` to reuse one chain for every subscriber. Use `transformDeferred` when the chain must depend on the individual subscription.",
        "ru": "`transform` — чтобы переиспользовать одну цепочку для каждого подписчика. `transformDeferred` — когда цепочка должна зависеть от конкретной подписки.",
    },
)
