"""Operators, patterns, and applied reactive answers."""

from reactive_items import BP, MANIFESTO, REACTOR, RS, RX, add

JVM = "https://github.com/reactive-streams/reactive-streams-jvm/blob/master/README.md"

add(
    "Explain the concept of higher-order Observables.",
    {
        "en": "A higher-order observable emits other observables. `flatMap` and Switch both take that shape: each outer item becomes an inner sequence that must be flattened.",
        "ru": "Observable высшего порядка излучает другие observable. И `flatMap`, и Switch имеют эту форму: каждый внешний элемент становится внутренней последовательностью, которую нужно развернуть.",
    },
    {
        "en": [
            "`flatMap` merges inners, so their items may interleave. The ReactiveX flatMap page states that an inner error fails the outer immediately.",
            "Switch, which RxJS calls `switchMap`, unsubscribes from the previous inner when a new one arrives and emits only the latest inner.",
            "The type is nested only until the flattening operator. Downstream sees a single sequence of items.",
            "Leaving the nested observable unflattened emits observables as items, which is rarely what a subscriber wants.",
        ],
        "ru": [
            "`flatMap` сливает внутренние, поэтому их элементы могут чередоваться. Страница flatMap в ReactiveX говорит, что ошибка внутреннего сразу роняет внешний.",
            "Switch, который RxJS называет `switchMap`, отписывается от предыдущего внутреннего, когда приходит новый, и излучает только последний внутренний.",
            "Тип вложен, только пока нет оператора разворота. Ниже по цепочке видна одна последовательность элементов.",
            "Если не разворачивать, наружу уходят сами observable как элементы, а подписчику это редко нужно.",
        ],
    },
    """orders.flatMap(id -> Observable.fromIterable(linesOf(id)));
queries.switchMap(text -> search(text));""",
    [f"{RX}/operators/flatmap.html", f"{RX}/operators/switch.html"],
    when={
        "en": "Merge with `flatMap` when every inner result counts. Switch when only the latest inner counts.",
        "ru": "`flatMap` — когда важен каждый внутренний результат. Switch — когда важен только последний внутренний.",
    },
)

add(
    "How do you implement custom operators in Rx libraries?",
    {
        "en": "A custom operator is a function from one Publisher to another that still obeys the Reactive Streams signal order. Reactor’s `transform` is the supported way to reuse such a function without writing a new Subscriber.",
        "ru": "Свой оператор — функция из одного Publisher в другой, которая всё ещё соблюдает порядок сигналов Reactive Streams. `transform` в Reactor — поддерживаемый способ переиспользовать такую функцию, не писав новый Subscriber.",
    },
    {
        "en": [
            "`transform` applies the function once at assembly. Every subscriber shares that chain.",
            "`transformDeferred` applies it per subscriber.",
            "The JVM readme’s protocol still holds inside the function: `onSubscribe`, then `onNext` zero or more times, then `onError` or `onComplete`.",
            "Do not emit `onNext` after a terminal signal. That breaks the protocol the TCK checks.",
        ],
        "ru": [
            "`transform` применяет функцию один раз при сборке. Все подписчики делят эту цепочку.",
            "`transformDeferred` применяет её на каждого подписчика.",
            "Протокол из readme JVM внутри функции тот же: `onSubscribe`, затем `onNext` ноль или больше раз, затем `onError` или `onComplete`.",
            "Не излучайте `onNext` после терминального сигнала. Это ломает протокол, который проверяет TCK.",
        ],
    },
    """Function<Flux<String>, Flux<String>> upper =
    flux -> flux.map(String::toUpperCase);

names.transform(upper);""",
    [f"{REACTOR}/advancedFeatures/advanced-mutualizing-operator-usage.html", JVM],
)

add(
    "What are the implications of unicast vs multicast Observables?",
    {
        "en": "A unicast cold observable runs its sequence separately for each subscriber. A multicast hot observable, typically a Subject, shares one sequence among subscribers.",
        "ru": "Одноадресный холодный observable выполняет свою последовательность отдельно для каждого подписчика. Многоадресный горячий, обычно Subject, делит одну последовательность между подписчиками.",
    },
    {
        "en": [
            "The RxJava backpressure page: a cold observable can start when the observer wants and at the observer’s rate, without changing the sequence. An iterable converted with `from` is the example.",
            "A Subject subscribed to a cold source starts it and then reemits to many observers, which is the hot view the subject page describes.",
            "`PublishSubject` gives a late subscriber only future items. `BehaviorSubject` also gives the latest item. `ReplaySubject` gives earlier items.",
            "Multicast plus a source that ignores demand is how an unbounded buffer appears. Demand or `onBackpressureBuffer` / `onBackpressureDrop` has to sit on that shared sequence.",
        ],
        "ru": [
            "Страница backpressure RxJava: холодный observable может начаться, когда наблюдатель хочет, и с его скоростью, не меняя последовательность. Пример — итерируемое, преобразованное через `from`.",
            "Subject, подписанный на холодный источник, запускает его и затем переизлучает многим наблюдателям — это горячее представление со страницы subject.",
            "`PublishSubject` даёт опоздавшему только будущие элементы. `BehaviorSubject` даёт ещё и последний. `ReplaySubject` даёт прежние.",
            "Многоадресность плюс источник, который игнорирует спрос, — путь к безграничному буферу. Спрос или `onBackpressureBuffer` / `onBackpressureDrop` должны стоять на этой общей последовательности.",
        ],
    },
    """Observable<Integer> cold = Observable.fromIterable(List.of(1, 2));
PublishSubject<Integer> hot = PublishSubject.create();""",
    [BP, f"{RX}/subject.html", f"{RX}/operators/from.html"],
    when={
        "en": "Stay cold when each subscriber needs a fresh run, such as one HTTP call each. Go hot when many subscribers must see the same live events.",
        "ru": "Оставайтесь холодными, когда каждому подписчику нужен свой запуск, например свой HTTP-вызов. Переходите к горячему, когда многие подписчики должны видеть одни и те же живые события.",
    },
)

add(
    "How do you use `combineLatest`, `withLatestFrom`, and `zip` operators for combining multiple streams?",
    {
        "en": "`zip` pairs items by index and emits only when each source has a new unpaired item. `combineLatest` emits when any source emits, using the latest item from each. `withLatestFrom` emits only when the primary source emits, attaching the latest value from the other.",
        "ru": "`zip` спаривает элементы по индексу и излучает, только когда у каждого источника есть новый неспаренный элемент. `combineLatest` излучает, когда излучает любой источник, беря последний элемент каждого. `withLatestFrom` излучает, только когда излучает основной источник, присоединяя последнее значение другого.",
    },
    {
        "en": [
            "The combineLatest page says it is similar to zip, except zip waits for a previously unused item from every source.",
            "The same page is where ReactiveX discusses `withLatestFrom`: the output is driven by one source, not by either source.",
            "RxJava’s `zip` keeps a small buffer and requests one more item per source after each combined emission, which is the backpressure wiki’s example.",
            "If one source is much faster, `zip` holds its extra items. That is the backlog the wiki warns about.",
        ],
        "ru": [
            "Страница combineLatest говорит, что он похож на zip, кроме того что zip ждёт ранее не использованный элемент от каждого источника.",
            "На той же странице ReactiveX разбирает `withLatestFrom`: выход ведёт один источник, а не любой из них.",
            "`zip` в RxJava держит маленький буфер и после каждого сочетанного излучения запрашивает ещё один элемент с каждого источника — это пример вики о backpressure.",
            "Если один источник гораздо быстрее, `zip` удерживает его лишние элементы. Это тот хвост, о котором предупреждает вики.",
        ],
    },
    """Observable.zip(ids, names, (id, name) -> id + ":" + name);
Observable.combineLatest(a, b, (x, y) -> x + y);""",
    [f"{RX}/operators/zip.html", f"{RX}/operators/combinelatest.html", BP],
    when={
        "en": "Use `zip` to pair corresponding items. Use `combineLatest` when any update should recompute from the latest of each. Use `withLatestFrom` when only one stream is the trigger.",
        "ru": "`zip` — чтобы спарить соответствующие элементы. `combineLatest` — когда любое обновление должно пересчитать результат из последних значений. `withLatestFrom` — когда триггер только один поток.",
    },
)

add(
    "Discuss the concept of side-effects in Reactive Streams and how to avoid them.",
    {
        "en": "A side effect is work that is not the next item, such as writing a shared variable. The sequence contract is easier to keep when each stage is a pure function of its input item and the subscriber is the only place that performs I/O.",
        "ru": "Побочный эффект — работа, которая не является следующим элементом, например запись в общую переменную. Контракт последовательности проще держать, когда каждая стадия — чистая функция своего элемента, а ввод-вывод делает только подписчик.",
    },
    {
        "en": [
            "`map` should return the next value. Mutating a list captured from outside makes the result depend on who subscribed and on which thread `publishOn` picked.",
            "The Reactor FAQ says `publishOn` moves later stages to another thread, so a `ThreadLocal` written upstream is not visible downstream. Put that value in `Context` instead.",
            "An error handler that swallows `onError` breaks the protocol: the subscriber never sees the terminal signal.",
            "Logging that rethrows, or that only records and lets the error continue, is the side effect that stays honest.",
        ],
        "ru": [
            "`map` должен вернуть следующее значение. Изменение списка, захваченного снаружи, делает результат зависимым от того, кто подписался и какой поток выбрал `publishOn`.",
            "FAQ Reactor говорит, что `publishOn` переносит поздние стадии на другой поток, поэтому `ThreadLocal`, записанный выше, ниже не виден. Это значение кладут в `Context`.",
            "Обработчик ошибки, который глотает `onError`, ломает протокол: подписчик не видит терминальный сигнал.",
            "Журнал, который пробрасывает ошибку или только записывает и даёт ошибке идти дальше, — честный побочный эффект.",
        ],
    },
    """flux.map(String::toUpperCase)
    .contextWrite(Context.of("requestId", id));""",
    [f"{REACTOR}/faq.html", f"{REACTOR}/advancedFeatures/context.html", JVM],
)

add(
    "Explain the difference between `takeUntil` and `takeWhile` operators.",
    {
        "en": "`takeWhile` emits items while a predicate on the item is true and stops when it is false. `takeUntil` emits items from the source until a second observable emits, then stops.",
        "ru": "`takeWhile` излучает элементы, пока предикат на элементе истинен, и останавливается, когда он ложен. `takeUntil` излучает элементы источника, пока второй observable не излучит, и тогда останавливается.",
    },
    {
        "en": [
            "The takeWhile page filters by the item itself. The decision does not need another stream.",
            "The takeUntil page watches a notifier. The source items are not what trips the stop, the other observable is.",
            "Both complete the output when they stop. They do not emit an error for a normal stop.",
            "Neither requests an unbounded remainder after the stop if the source honors demand.",
        ],
        "ru": [
            "Страница takeWhile фильтрует по самому элементу. Другой поток для решения не нужен.",
            "Страница takeUntil следит за уведомителем. Остановку вызывает не элемент источника, а другой observable.",
            "Оба завершают выход, когда останавливаются. Обычная остановка — не ошибка.",
            "Ни один не запрашивает безграничный остаток после остановки, если источник соблюдает спрос.",
        ],
    },
    """source.takeWhile(n -> n < 10);
source.takeUntil(cancel);""",
    [f"{RX}/operators/takewhile.html", f"{RX}/operators/takeuntil.html"],
    when={
        "en": "Use `takeWhile` when the items themselves say when to stop. Use `takeUntil` when a different stream, such as a click or a shutdown signal, says when to stop.",
        "ru": "`takeWhile` — когда остановку говорят сами элементы. `takeUntil` — когда остановку говорит другой поток, например щелчок или сигнал остановки.",
    },
)

add(
    "How does concurrency control work in Reactive Programming?",
    {
        "en": "Concurrency is explicit. `subscribeOn` chooses the subscription thread, `observeOn` or Reactor’s `publishOn` chooses where later notifications run, and Reactive Streams demand bounds how many items may be outstanding.",
        "ru": "Конкурентность явная. `subscribeOn` выбирает поток подписки, `observeOn` или `publishOn` в Reactor выбирает, где идут поздние уведомления, а спрос Reactive Streams ограничивает, сколько элементов может быть не погашено.",
    },
    {
        "en": [
            "ReactiveX: by default the chain stays on the subscribing thread. `subscribeOn` moves the source. `observeOn` moves notifications downstream of that call.",
            "Reactor: the closest downstream `subscribeOn` is the one that schedules subscription. `publishOn` affects operators after it until the next `publishOn`.",
            "A Subject still needs serialization if `onNext` arrives from several threads. The RxJava wiki’s `SerializedSubject` is that queue.",
            "Bounded demand is the other half. A scheduler without `request` can still grow a queue.",
        ],
        "ru": [
            "ReactiveX: по умолчанию цепочка остаётся на потоке подписки. `subscribeOn` переносит источник. `observeOn` переносит уведомления ниже этого вызова.",
            "Reactor: ближайший `subscribeOn` ниже по цепочке планирует подписку. `publishOn` влияет на операторы после себя до следующего `publishOn`.",
            "Subject всё ещё нужно сериализовать, если `onNext` приходит из нескольких потоков. `SerializedSubject` из вики RxJava — эта очередь.",
            "Ограниченный спрос — вторая половина. Scheduler без `request` всё ещё может растить очередь.",
        ],
    },
    """Flux.just(1, 2, 3)
    .publishOn(Schedulers.parallel())
    .map(n -> n * 2);""",
    [f"{RX}/scheduler.html", f"{REACTOR}/coreFeatures/schedulers.html", "https://github.com/ReactiveX/RxJava/wiki/Subject"],
)

add(
    "What is the role of virtual time in testing Reactive applications?",
    {
        "en": "Virtual time advances a test scheduler’s clock without waiting on the wall clock. RxJava’s `TestScheduler` is the tool the 2.0 notes show for an operator that delays, such as a one-second `delay`.",
        "ru": "Виртуальное время двигает часы тестового scheduler, не дожидаясь настенных часов. `TestScheduler` RxJava — инструмент, который заметки 2.0 показывают для оператора с задержкой, например `delay` на одну секунду.",
    },
    {
        "en": [
            "Create the `TestScheduler`, pass it to the time-based operator, and subscribe with a test observer.",
            "`advanceTimeBy` moves the virtual clock. The 2.0 example asserts emptiness at 999 ms and the value at 1000 ms.",
            "Reactor’s `StepVerifier` compares signals after subscribe. Time-based Reactor tests use the verifier’s virtual-time schedule rather than `Thread.sleep`.",
            "A real scheduler in a unit test makes the test depend on load. The virtual clock does not.",
        ],
        "ru": [
            "Создают `TestScheduler`, передают его оператору, зависящему от времени, и подписываются тестовым наблюдателем.",
            "`advanceTimeBy` двигает виртуальные часы. Пример 2.0 проверяет пустоту на 999 мс и значение на 1000 мс.",
            "`StepVerifier` Reactor сравнивает сигналы после подписки. Тесты Reactor, зависящие от времени, используют виртуальное расписание верификатора, а не `Thread.sleep`.",
            "Настоящий scheduler в модульном тесте делает тест зависимым от нагрузки. Виртуальные часы — нет.",
        ],
    },
    """TestScheduler scheduler = new TestScheduler();
TestObserver<Integer> ts = source.delay(1, TimeUnit.SECONDS, scheduler).test();
scheduler.advanceTimeBy(1, TimeUnit.SECONDS);
ts.assertValue(1);""",
    [
        "https://github.com/ReactiveX/RxJava/wiki/What's-different-in-2.0",
        f"{REACTOR}/testing.html",
    ],
)

add(
    "How do you manage state in Reactive Programming?",
    {
        "en": "Carry state in the sequence. `scan` emits each next accumulator. A `BehaviorSubject` holds the latest value for late subscribers. Reactor `Context` holds subscription-scoped data that is not an item.",
        "ru": "Состояние несут в последовательности. `scan` излучает каждый следующий аккумулятор. `BehaviorSubject` держит последнее значение для опоздавших подписчиков. Reactor `Context` держит данные области подписки, которые не являются элементом.",
    },
    {
        "en": [
            "`scan` folds items with a seed and emits every intermediate result. A sum of ticks is the scan page’s shape.",
            "`BehaviorSubject` replays the current item on subscribe, then later items. It is shared state, so serialize it if several threads call `onNext`.",
            "`contextWrite` stores a correlation id for the subscription. It is not a replacement for `scan` of business data.",
            "A mutable field closed over by `map` races once `publishOn` moves the chain.",
        ],
        "ru": [
            "`scan` сворачивает элементы с начальным значением и излучает каждый промежуточный результат. Сумма тиков — форма со страницы scan.",
            "`BehaviorSubject` при подписке повторяет текущий элемент, затем поздние. Это общее состояние, поэтому сериализуйте его, если `onNext` зовут несколько потоков.",
            "`contextWrite` хранит correlation id подписки. Это не замена `scan` для деловых данных.",
            "Изменяемое поле, захваченное `map`, гоняется, как только `publishOn` переносит цепочку.",
        ],
    },
    """flux.scan(0, Integer::sum);
BehaviorSubject<String> current = BehaviorSubject.createDefault("none");""",
    [f"{RX}/operators/scan.html", f"{RX}/subject.html", f"{REACTOR}/advancedFeatures/context.html"],
    when={
        "en": "Use `scan` for state derived from items. Use a `BehaviorSubject` for a shared current value. Use `Context` for ambient subscription data such as a request id.",
        "ru": "`scan` — для состояния, выведенного из элементов. `BehaviorSubject` — для общего текущего значения. `Context` — для сопутствующих данных подписки, например идентификатора запроса.",
    },
)

add(
    "Describe strategies to handle out-of-order messages in a Reactive system.",
    {
        "en": "Streams preserve the order of one publisher’s `onNext` calls. Order across merged publishers is not guaranteed. Pick the combining operator that matches the order you actually need.",
        "ru": "Потоки сохраняют порядок вызовов `onNext` одного publisher. Порядок между слитыми publisher не гарантирован. Выберите оператор сочетания, который соответствует порядку, который вам действительно нужен.",
    },
    {
        "en": [
            "`zip` emits in lockstep: the nth output uses the nth item of each source. A faster source waits.",
            "`flatMap` merges inners as they arrive, so a slow first inner can be overtaken.",
            "Switch keeps only the latest inner and drops the previous one’s remainder, which is the ordered choice when older work is stale.",
            "A sequence number inside the item is application data. `scan` can remember the last accepted number and `takeWhile` or `filter` can drop a regression. The specification does not reorder for you.",
        ],
        "ru": [
            "`zip` излучает шаг в шаг: n-й выход использует n-й элемент каждого источника. Более быстрый источник ждёт.",
            "`flatMap` сливает внутренние по мере прихода, поэтому медленный первый внутренний могут обогнать.",
            "Switch держит только последний внутренний и отбрасывает остаток предыдущего — это выбор порядка, когда старая работа уже не нужна.",
            "Номер последовательности внутри элемента — данные приложения. `scan` может помнить последний принятый номер, а `filter` — отбросить откат. Спецификация за вас не переупорядочивает.",
        ],
    },
    """Observable.zip(clock, values, (t, v) -> t + ":" + v);
latest.switchMap(id -> load(id));""",
    [f"{RX}/operators/zip.html", f"{RX}/operators/flatmap.html", f"{RX}/operators/switch.html"],
)
