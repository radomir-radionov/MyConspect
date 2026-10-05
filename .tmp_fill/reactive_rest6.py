"""Closing interview answers. Operators only from the cited pages."""

from reactive_items import BP, MANIFESTO, REACTOR, RS, RX, add

JVM = "https://github.com/reactive-streams/reactive-streams-jvm/blob/master/README.md"

add(
    "What are some common design patterns used in Reactive Programming?",
    {
        "en": "The patterns that show up in the docs are a cold source per subscriber, a Subject as a hot bridge, operators as the pipeline, and `request` as the bound on the queue.",
        "ru": "Шаблоны, которые видны в документации, — холодный источник на подписчика, Subject как горячий мост, операторы как конвейер и `request` как предел очереди.",
    },
    {
        "en": [
            "`from` on a collection is the cold pattern: each subscribe walks the data again.",
            "A Subject is the hot pattern. `BehaviorSubject` keeps the latest item; `PublishSubject` does not.",
            "`map` and `flatMap` are the pipeline. `transform` names a reusable slice of it.",
            "Reactive Streams `request` is the pattern that keeps the asynchronous boundary bounded.",
        ],
        "ru": [
            "`from` по коллекции — холодный шаблон: каждая подписка обходит данные снова.",
            "Subject — горячий шаблон. `BehaviorSubject` хранит последний элемент; `PublishSubject` — нет.",
            "`map` и `flatMap` — конвейер. `transform` именует переиспользуемый кусок.",
            "`request` Reactive Streams — шаблон, который держит асинхронную границу ограниченной.",
        ],
    },
    """Observable.fromIterable(List.of(1, 2, 3)).map(n -> n * 2);""",
    [f"{RX}/operators/from.html", f"{RX}/subject.html", f"{REACTOR}/advancedFeatures/advanced-mutualizing-operator-usage.html"],
)

add(
    "How do you apply commonly known Gang of Four patterns in Reactive Programming?",
    {
        "en": "The Observer pattern is the subscriber. A pipeline of operators is a chain of wrappers around a source. A Subject is a proxy that is both observer and observable.",
        "ru": "Паттерн «наблюдатель» — это подписчик. Конвейер операторов — цепочка обёрток вокруг источника. Subject — заместитель, который одновременно наблюдатель и observable.",
    },
    {
        "en": [
            "ReactiveX describes a Subject as a bridge or proxy: it can subscribe, and it can reemit.",
            "`map` wraps a source and returns a new observable. The source is unchanged.",
            "Strategy is the function you pass: the same `scan` shape with a different accumulator.",
            "The Gang of Four observer does not include demand. Reactive Streams adds `request` so the observer can slow the subject down.",
        ],
        "ru": [
            "ReactiveX описывает Subject как мост или заместитель: он может подписаться и может переизлучать.",
            "`map` оборачивает источник и возвращает новый observable. Источник не меняется.",
            "Стратегия — функция, которую передают: та же форма `scan` с другим аккумулятором.",
            "Наблюдатель из «банды четырёх» не включает спрос. Reactive Streams добавляет `request`, чтобы наблюдатель мог замедлить источник.",
        ],
    },
    """PublishSubject<String> bus = PublishSubject.create();
bus.map(String::trim).subscribe(System.out::println);""",
    [f"{RX}/subject.html", JVM, f"{RX}/operators/scan.html"],
)

add(
    "What are some best practices for error handling in Reactive streams?",
    {
        "en": "Treat `onError` as terminal. Recover by substituting another publisher, or let the subscriber see the error. Do not emit further `onNext` after the error.",
        "ru": "Считайте `onError` терминальным. Восстанавливайтесь, подставляя другой publisher, или дайте подписчику увидеть ошибку. Не излучайте `onNext` после ошибки.",
    },
    {
        "en": [
            "The JVM readme’s protocol is `onSubscribe`, then `onNext` repeated, then exactly one of `onError` or `onComplete`.",
            "The ReactiveX catch operator replaces a failing sequence with another. That is recovery.",
            "An empty error callback hides the terminal signal. The subscriber then waits forever.",
            "Retry resubscribes a cold source. It does not rewind a hot Subject.",
        ],
        "ru": [
            "Протокол readme JVM — `onSubscribe`, затем повторяющийся `onNext`, затем ровно один из `onError` или `onComplete`.",
            "Оператор catch в ReactiveX заменяет упавшую последовательность другой. Это восстановление.",
            "Пустой callback ошибки прячет терминальный сигнал. Подписчик тогда ждёт вечно.",
            "Повтор подписывается на холодный источник заново. Горячий Subject он не отматывает.",
        ],
    },
    """source.onErrorResume(error -> Mono.just("fallback"));""",
    [JVM, f"{RX}/operators/catch.html"],
)

add(
    "Describe a scenario where Reactive Programming is not the ideal approach. Why?",
    {
        "en": "A short, finite, CPU-bound transformation of data you already hold does not need a subscriber, a scheduler, or demand. A direct call returns the value on the same thread.",
        "ru": "Короткое конечное преобразование уже имеющихся данных, занятое процессором, не нуждается в подписчике, scheduler или спросе. Прямой вызов возвращает значение в том же потоке.",
    },
    {
        "en": [
            "The Reactive Streams problem statement is live data whose volume is not known, across an asynchronous boundary. A `List` in memory is not that problem.",
            "Wrapping that list in `Flux.just` and blocking on it adds a protocol without a queue to bound.",
            "A single blocking JDBC call hidden inside `map` on the event loop is worse than an ordinary call. The FAQ only helps if you actually move it to `boundedElastic`.",
            "Operators pay off when there are many values, cancellation, or a thread hop. Otherwise they obscure a straight-line function.",
        ],
        "ru": [
            "Постановка задачи Reactive Streams — живые данные неизвестного объёма через асинхронную границу. `List` в памяти — не эта задача.",
            "Обернуть этот список в `Flux.just` и заблокироваться на нём добавляет протокол без очереди, которую нужно ограничить.",
            "Один блокирующий вызов JDBC, спрятанный в `map` на цикле событий, хуже обычного вызова. FAQ помогает, только если вы и вправду перенесёте его на `boundedElastic`.",
            "Операторы окупаются, когда значений много, есть отмена или переход между потоками. Иначе они затемняют прямую функцию.",
        ],
    },
    """List<Integer> doubled = List.of(1, 2, 3).stream().map(n -> n * 2).toList();""",
    [RS, f"{REACTOR}/faq.html"],
    when={
        "en": "Stay imperative for one finite in-memory pass. Use a publisher when the data arrives over time, the work is asynchronous, or the consumer must bound the rate.",
        "ru": "Оставайтесь в обычном коде для одного конечного прохода по памяти. Publisher — когда данные приходят со временем, работа асинхронна или потребитель должен ограничить скорость.",
    },
)

add(
    "Explain the use of backpressure strategies, like buffering and dropping.",
    {
        "en": "When a source ignores `request`, RxJava offers `onBackpressureBuffer` and `onBackpressureDrop`. Buffering keeps items and emits them as the subscriber requests. Dropping discards items the subscriber is not ready for.",
        "ru": "Когда источник игнорирует `request`, RxJava предлагает `onBackpressureBuffer` и `onBackpressureDrop`. Буферизация хранит элементы и излучает их по запросу подписчика. Отбрасывание выкидывает элементы, к которым подписчик не готов.",
    },
    {
        "en": [
            "The backpressure wiki introduces both operators as the way to force a simple policy onto a source that was not written for reactive pull.",
            "An experimental bounded `onBackpressureBuffer` terminates with an error if the buffer is overrun. An unbounded buffer can exhaust memory; the wiki’s `zip` example is that failure.",
            "`debounce`, `sample`, and `throttleFirst` shrink the stream before a buffer is required.",
            "`buffer` groups items into lists. That is a different operator: it changes the item type, it does not implement `request`.",
        ],
        "ru": [
            "Вики о backpressure вводит оба оператора как способ навязать простую политику источнику, который не писали под реактивный pull.",
            "Экспериментальный ограниченный `onBackpressureBuffer` завершается ошибкой, если буфер переполнен. Безграничный буфер может исчерпать память; пример `zip` в вики — этот сбой.",
            "`debounce`, `sample` и `throttleFirst` сжимают поток, прежде чем понадобится буфер.",
            "`buffer` группирует элементы в списки. Это другой оператор: он меняет тип элемента и не реализует `request`.",
        ],
    },
    """source.onBackpressureBuffer();
source.onBackpressureDrop();
bursty.debounce(10, TimeUnit.MILLISECONDS);""",
    [BP, f"{RX}/operators/debounce.html"],
    when={
        "en": "Buffer when every item must eventually be delivered and the burst is bounded. Drop when a stale item is useless, such as a sensor sample replaced by a newer one.",
        "ru": "Буферизуйте, когда каждый элемент в итоге нужно доставить и всплеск ограничен. Отбрасывайте, когда устаревший элемент бесполезен, например замер датчика, который заменит более новый.",
    },
)

add(
    "How can you make your Reactive streams more composable and reusable?",
    {
        "en": "Return a `Flux` or `Mono` from a method and reuse a slice with `transform`. The Reactor guide says `transform` applies one function at assembly time, equivalent to writing the operators inline.",
        "ru": "Возвращайте из метода `Flux` или `Mono` и переиспользуйте кусок через `transform`. Руководство Reactor говорит, что `transform` применяет одну функцию во время сборки, что равносильно записать операторы прямо.",
    },
    {
        "en": [
            "A method that subscribes inside itself cannot be composed. The caller must be the one that subscribes.",
            "`transform` shares one assembled chain. `transformDeferred` rebuilds it per subscriber when the chain depends on that subscription.",
            "Keep the function pure: `map` returns a value. Side effects belong at the subscriber or in an explicit logging step that does not swallow errors.",
            "Name the function after the policy, such as `withoutOrange`, not after the call site.",
        ],
        "ru": [
            "Метод, который подписывается внутри себя, нельзя собрать с другими. Подписываться должен вызывающий.",
            "`transform` делит одну собранную цепочку. `transformDeferred` пересобирает её на подписчика, когда цепочка зависит от этой подписки.",
            "Держите функцию чистой: `map` возвращает значение. Побочные эффекты — у подписчика или в явном шаге журнала, который не глотает ошибки.",
            "Называйте функцию по политике, например `withoutOrange`, а не по месту вызова.",
        ],
    },
    """Function<Flux<String>, Flux<String>> withoutOrange =
    flux -> flux.filter(color -> !color.equals("orange"));

colors.transform(withoutOrange);""",
    [f"{REACTOR}/advancedFeatures/advanced-mutualizing-operator-usage.html"],
)

add(
    "What are some best practices for scaling Reactive applications?",
    {
        "en": "Scale by bounding work, not by adding unbounded buffers. The manifesto’s elasticity is staying responsive under load; Reactive Streams does that with demand, and Reactor does it by keeping blocking work off the event loop.",
        "ru": "Масштабируют, ограничивая работу, а не добавляя безграничные буферы. Эластичность манифеста — оставаться отзывчивым под нагрузкой; Reactive Streams делает это спросом, а Reactor — тем, что блокирующая работа не сидит на цикле событий.",
    },
    {
        "en": [
            "`request(n)` caps in-flight elements per subscription.",
            "Blocking calls go to `Schedulers.boundedElastic()`, immediately after the source, as the FAQ shows.",
            "CPU work can move with `publishOn`. The placement matters: it affects operators after it.",
            "Drop or sample a hot stream that subscribers cannot keep up with, instead of buffering it without a cap.",
        ],
        "ru": [
            "`request(n)` ограничивает элементы в пути на подписку.",
            "Блокирующие вызовы идут на `Schedulers.boundedElastic()` сразу после источника, как показывает FAQ.",
            "Работу CPU можно перенести через `publishOn`. Позиция важна: он влияет на операторы после себя.",
            "Горячий поток, за которым подписчики не успевают, отбрасывают или прореживают, а не буферизуют без предела.",
        ],
    },
    """Mono.fromCallable(this::blockingCall)
    .subscribeOn(Schedulers.boundedElastic())
    .map(String::trim);""",
    [MANIFESTO, f"{REACTOR}/faq.html", BP],
)

add(
    "How do you manage configuration changes in a Reactive system?",
    {
        "en": "Treat a configuration change as an item on a stream. `scan` folds it into the current settings, or a `BehaviorSubject` holds the latest settings for whoever subscribes next.",
        "ru": "Изменение конфигурации — элемент потока. `scan` сворачивает его в текущие настройки, либо `BehaviorSubject` держит последние настройки для того, кто подпишется следующим.",
    },
    {
        "en": [
            "`BehaviorSubject` emits the current value on subscribe, which is the contract on the ReactiveX subject page.",
            "Downstream work that must restart on a change uses Switch: the new configuration unsubscribes the previous inner.",
            "Do not stash the value in a mutable field read from `map` after `publishOn`. The thread will not be the one that wrote it.",
            "Subscription-scoped values that are not the configuration stream belong in Reactor `Context`.",
        ],
        "ru": [
            "`BehaviorSubject` при подписке излучает текущее значение — это контракт на странице Subject в ReactiveX.",
            "Работа ниже, которую нужно перезапустить при изменении, использует Switch: новая конфигурация отписывает предыдущий внутренний поток.",
            "Не прячьте значение в изменяемое поле, которое читает `map` после `publishOn`. Поток будет не тем, который писал.",
            "Значения области подписки, которые не являются потоком конфигурации, принадлежат Reactor `Context`.",
        ],
    },
    """BehaviorSubject<Integer> limit = BehaviorSubject.createDefault(10);
configs.switchMap(cfg -> source.takeWhile(n -> n < cfg.limit()));""",
    [f"{RX}/subject.html", f"{RX}/operators/switch.html", f"{REACTOR}/advancedFeatures/context.html"],
)

add(
    "Discuss the CQRS pattern in the context of Reactive Systems.",
    {
        "en": "CQRS splits commands that change state from queries that read it. In a reactive system both sides are message-driven: a command is an event you fold with `scan`, and a query reads the latest value from a `BehaviorSubject` or a store fed by that fold.",
        "ru": "CQRS отделяет команды, которые меняют состояние, от запросов, которые его читают. В реактивной системе обе стороны управляются сообщениями: команда — событие, которое сворачивают через `scan`, а запрос читает последнее значение из `BehaviorSubject` или из хранилища, которое кормит эта свёртка.",
    },
    {
        "en": [
            "The manifesto’s message-driven trait is why the write path does not share a thread with the read path.",
            "`scan` emits each next state. Subscribers of the query side observe those emissions instead of locking a model.",
            "A failure on the command stream is `onError` and is terminal for that subscription. It does not half-apply inside `map`.",
            "Demand still bounds how fast commands may be applied. CQRS does not remove backpressure.",
        ],
        "ru": [
            "Черта манифеста «управление сообщениями» — причина, почему путь записи не делит поток с путём чтения.",
            "`scan` излучает каждое следующее состояние. Подписчики стороны запроса наблюдают эти излучения вместо того, чтобы запирать модель.",
            "Сбой потока команд — это `onError`, и для этой подписки он терминален. Внутри `map` он не применяется наполовину.",
            "Спрос по-прежнему ограничивает, как быстро можно применять команды. CQRS не отменяет backpressure.",
        ],
    },
    """commands.scan(State.empty(), State::apply);""",
    [MANIFESTO, f"{RX}/operators/scan.html", f"{RX}/subject.html"],
    lang="java",
)

add(
    "What are the principles of the Reactive Manifesto?",
    {
        "en": "The manifesto names four properties: responsive, resilient, elastic, and message-driven. Systems with those properties are, in its words, more flexible, loosely coupled, and scalable.",
        "ru": "Манифест называет четыре свойства: отзывчивость, устойчивость, эластичность и управление сообщениями. Системы с этими свойствами, по его словам, более гибки, слабее связаны и масштабируемы.",
    },
    {
        "en": [
            "Responsive: the system responds in a timely fashion.",
            "Resilient: it stays responsive in the face of failure.",
            "Elastic: it stays responsive under a changing workload.",
            "Message-driven: the parts rely on asynchronous message passing. The Reactive Streams readme points at the manifesto to explain why that backpressure signal must itself be asynchronous.",
        ],
        "ru": [
            "Отзывчивость: система отвечает своевременно.",
            "Устойчивость: она остаётся отзывчивой перед лицом сбоя.",
            "Эластичность: она остаётся отзывчивой при меняющейся нагрузке.",
            "Управление сообщениями: части опираются на асинхронную передачу сообщений. Readme Reactive Streams ссылается на манифест, объясняя, почему сам сигнал backpressure должен быть асинхронным.",
        ],
    },
    """// Four properties from the manifesto:
// responsive, resilient, elastic, message-driven""",
    [MANIFESTO, JVM],
    lang="text",
)
