"""Final reactive interview answers."""

from reactive_items import BP, MANIFESTO, REACTOR, RS, RX, add

JVM = "https://github.com/reactive-streams/reactive-streams-jvm/blob/master/README.md"

add(
    "How is Reactive Programming implemented in languages like JavaScript, Scala, or Java?",
    {
        "en": "The idea is one observable sequence. JavaScript uses RxJS, Java uses RxJava or Reactor, and the ReactiveX pages document the same operators for each. On the JVM, Reactive Streams plus JDK Flow is the shared demand protocol.",
        "ru": "Идея одна: наблюдаемая последовательность. JavaScript использует RxJS, Java — RxJava или Reactor, а страницы ReactiveX документируют одни и те же операторы для каждого. На JVM общий протокол спроса — Reactive Streams плюс JDK Flow.",
    },
    {
        "en": [
            "RxJS `from` and RxJava `fromIterable` are the From operator: emit each element of a collection, then complete.",
            "`debounce`, `zip`, `scan`, and Subject variants keep their contracts across those libraries.",
            "Scala can call the same JVM libraries. A Scala `Future` is one result, not a Reactive Streams publisher.",
            "JDK 9 `java.util.concurrent.Flow` matches the four Reactive Streams types, so Java code need not import a third-party publisher to speak the protocol.",
        ],
        "ru": [
            "RxJS `from` и RxJava `fromIterable` — оператор From: излучить каждый элемент коллекции и завершиться.",
            "`debounce`, `zip`, `scan` и варианты Subject сохраняют свои контракты в этих библиотеках.",
            "Scala может вызывать те же библиотеки JVM. `Future` в Scala — один результат, а не publisher Reactive Streams.",
            "JDK 9 `java.util.concurrent.Flow` совпадает с четырьмя типами Reactive Streams, поэтому код на Java может говорить на протоколе, не импортируя сторонний publisher.",
        ],
    },
    """Observable<Integer> javaSide = Observable.fromIterable(List.of(1, 2, 3));
// RxJS: from([1, 2, 3])""",
    [f"{RX}/operators/from.html", RS, f"{RX}/observable.html"],
)

add(
    "Compare the Reactor pattern in Java with Reactive Extensions in .NET.",
    {
        "en": "The classic Reactor pattern demultiplexes readiness events onto a small set of threads. Reactive Extensions, and Project Reactor on the JVM, compose the values those events carry as sequences with operators and, on the JVM, with demand.",
        "ru": "Классический паттерн Reactor демультиплексирует события готовности на небольшой набор потоков. Reactive Extensions и Project Reactor на JVM собирают значения, которые несут эти события, в последовательности с операторами и, на JVM, со спросом.",
    },
    {
        "en": [
            "A selector loop is the I/O pattern. It does not define `map` or `zip`.",
            "ReactiveX documents those operators once and implements them in Rx.NET as well as RxJava. The names on the operator pages are the comparison.",
            "Project Reactor’s `publishOn` moves the sequence onto a scheduler after a stage. That is composition, not the selector loop itself.",
            "Both still need a bound. Reactive Streams `request` is the JVM form of “do not deliver more than the consumer accepted.”",
        ],
        "ru": [
            "Цикл селектора — паттерн ввода-вывода. Он не определяет `map` или `zip`.",
            "ReactiveX документирует эти операторы один раз и реализует их и в Rx.NET, и в RxJava. Имена на страницах операторов — и есть сравнение.",
            "`publishOn` в Project Reactor переносит последовательность на scheduler после стадии. Это сборка, а не сам цикл селектора.",
            "Предел всё равно нужен. `request` Reactive Streams — форма JVM для «не доставляй больше, чем потребитель принял».",
        ],
    },
    """Flux.just(1, 2).publishOn(Schedulers.parallel()).map(n -> n + 1);""",
    [f"{RX}/observable.html", f"{REACTOR}/coreFeatures/schedulers.html", JVM],
)

add(
    "How do you use Reactive Programming in modern front-end frameworks like React or Angular?",
    {
        "en": "In the browser the sequence is usually RxJS. Angular consumes observables directly. React keeps its own state: you subscribe at the edge and store the latest item, often the value a `BehaviorSubject` already holds.",
        "ru": "В браузере последовательность обычно RxJS. Angular потребляет observable напрямую. React хранит своё состояние: подписываются на краю и кладут последний элемент, часто то значение, которое `BehaviorSubject` уже держит.",
    },
    {
        "en": [
            "`from` turns an array into an observable. `fromEvent` is not required to listen if you already have a callback that calls `next` on a Subject.",
            "`scan` folds events into the state you render. `debounce` waits for a quiet gap, which the debounce page defines.",
            "Switch drops the previous inner request when the user types again. That is the ReactiveX Switch operator, spelled `switchMap` in RxJS.",
            "Unsubscribe when the view goes away. A live subscription is the leak. A Promise cannot express that cancel.",
        ],
        "ru": [
            "`from` превращает массив в observable. `fromEvent` не обязателен, если callback и так зовёт `next` у Subject.",
            "`scan` сворачивает события в состояние, которое рисуют. `debounce` ждёт паузу — так его определяет страница debounce.",
            "Switch отбрасывает предыдущий внутренний запрос, когда пользователь печатает снова. Это оператор Switch в ReactiveX, в RxJS записанный как `switchMap`.",
            "Отписывайтесь, когда представление исчезает. Живая подписка — это утечка. Promise эту отмену не выражает.",
        ],
    },
    """const query = new BehaviorSubject("");
query.pipe(switchMap(text => from(search(text))));""",
    [f"{RX}/subject.html", f"{RX}/operators/switch.html", f"{RX}/operators/debounce.html"],
    lang="javascript",
)

add(
    "What are some considerations for using Reactive Programming in a functional programming language?",
    {
        "en": "Operators are functions from a sequence to a sequence. They stay referentially honest when `map` does not write shared state and the only effects sit at subscribe.",
        "ru": "Операторы — функции из последовательности в последовательность. Они остаются ссылочно честными, когда `map` не пишет общее состояние, а единственные эффекты сидят в subscribe.",
    },
    {
        "en": [
            "`map` and `scan` take a function and return a new sequence. The source is not mutated.",
            "`flatMap` is the flatten after a function that itself returns a sequence. Switch is the variant that keeps only the latest inner.",
            "A lazy cold source fits a functional style: describing `from(array)` does not run it. Subscribe is the edge.",
            "`publishOn` changes the thread, so a closed-over mutable variable is a race. Pass the value in the item or in Reactor `Context`.",
        ],
        "ru": [
            "`map` и `scan` принимают функцию и возвращают новую последовательность. Источник не мутирует.",
            "`flatMap` — это разворот после функции, которая сама возвращает последовательность. Switch — вариант, который держит только последний внутренний поток.",
            "Ленивый холодный источник подходит функциональному стилю: описание `from(array)` его не запускает. Subscribe — край.",
            "`publishOn` меняет поток, поэтому захваченная изменяемая переменная — гонка. Передавайте значение в элементе или в Reactor `Context`.",
        ],
    },
    """flux.map(n -> n * 2).scan(0, Integer::sum);""",
    [f"{RX}/operators/scan.html", f"{RX}/operators/flatmap.html", f"{REACTOR}/faq.html"],
)

add(
    "How does the async-await pattern in modern languages relate to Reactive Programming?",
    {
        "en": "`async`/`await` waits for one future value and then continues. A publisher can emit many values, starts at subscribe, and can be bounded by demand. Await is the one-item case, closest to a `Mono`, not to a `Flux`.",
        "ru": "`async`/`await` ждёт одно будущее значение и затем продолжает. Publisher может излучить много значений, стартует в subscribe и может быть ограничен спросом. Await — случай одного элемента, ближе к `Mono`, чем к `Flux`.",
    },
    {
        "en": [
            "A Promise or a Scala `Future` settles once. `Flux` is the sequence of many settlements.",
            "Awaiting inside a loop pulls. A subscriber is pushed to, and on the JVM it pulls only via `request`.",
            "You can adapt one item: the first element of a `Mono` is what await wants. A multi-value `Flux` does not fit a single await.",
            "Cancellation of an await and unsubscribe of a stream are different. Unsubscribing stops demand.",
        ],
        "ru": [
            "Promise или `Future` в Scala завершается один раз. `Flux` — последовательность многих завершений.",
            "Await внутри цикла тянет. Подписчику толкают, и на JVM он тянет только через `request`.",
            "Один элемент можно адаптировать: первый элемент `Mono` — то, чего ждёт await. Многозначный `Flux` в один await не помещается.",
            "Отмена await и отписка от потока — разное. Отписка прекращает спрос.",
        ],
    },
    """Mono<String> one = Mono.just("ok");
Flux<Integer> many = Flux.just(1, 2, 3);""",
    [f"{RX}/observable.html", f"{REACTOR}/coreFeatures/schedulers.html"],
    when={
        "en": "Use async/await for one result. Use a publisher when there is a sequence, a cancelable subscription, or a need to bound the rate.",
        "ru": "Async/await — для одного результата. Publisher — когда есть последовательность, отменяемая подписка или нужда ограничить скорость.",
    },
)

add(
    "Provide examples of real-world use cases where Reactive Programming is applied.",
    {
        "en": "The documented fits are a burst of UI events thinned by `debounce`, a running total via `scan`, and a service call that must not block, wrapped as a `Mono` on `boundedElastic`.",
        "ru": "Документированные случаи — всплеск событий интерфейса, прореженный `debounce`, бегущий итог через `scan` и вызов сервиса, который не должен блокировать, обёрнутый в `Mono` на `boundedElastic`.",
    },
    {
        "en": [
            "The debounce page exists for items that arrive in bursts. A search box is that shape.",
            "`zip` combines two sources in lockstep, and RxJava requests only enough to refill a small buffer.",
            "A WebFlux-style handler returns `Mono` or `Flux` and lets the framework subscribe.",
            "A finite in-memory list does not need any of this.",
        ],
        "ru": [
            "Страница debounce существует для элементов, которые приходят всплесками. Поле поиска — эта форма.",
            "`zip` сочетает два источника шаг в шаг, и RxJava запрашивает лишь столько, сколько нужно для маленького буфера.",
            "Обработчик в духе WebFlux возвращает `Mono` или `Flux` и даёт фреймворку подписаться.",
            "Конечный список в памяти ни в чём этом не нуждается.",
        ],
    },
    """bursty.debounce(10, TimeUnit.MILLISECONDS);
ticks.scan(0, Integer::sum);""",
    [f"{RX}/operators/debounce.html", f"{RX}/operators/scan.html", f"{REACTOR}/faq.html"],
)

add(
    "Analyze the impact of Reactive Programming on cloud-native application design.",
    {
        "en": "Cloud-native design already scales by adding instances. Reactive programming changes the instance: fewer threads blocked per call, and a demand signal so a peer cannot force an unbounded buffer.",
        "ru": "Облачный дизайн и так масштабируется добавлением экземпляров. Реактивное программирование меняет сам экземпляр: меньше потоков, заблокированных на вызов, и сигнал спроса, чтобы сосед не мог навязать безграничный буфер.",
    },
    {
        "en": [
            "The manifesto calls this elasticity and loose coupling through asynchronous messages.",
            "Reactor’s `boundedElastic` is where the remaining blocking cloud SDK calls go, off the event loop.",
            "Reactive Streams across hosts is the network form of the same bound. RSocket is one protocol that carries that idea.",
            "Autoscaling does not fix a handler that `block`s the event loop. The FAQ’s wrapper does.",
        ],
        "ru": [
            "Манифест называет это эластичностью и слабой связанностью через асинхронные сообщения.",
            "`boundedElastic` в Reactor — место, куда уходят оставшиеся блокирующие вызовы облачных SDK, с цикла событий.",
            "Reactive Streams между хостами — сетевая форма того же предела. RSocket — один протокол, который несёт эту идею.",
            "Автомасштабирование не чинит обработчик, который делает `block` на цикле событий. Обёртка из FAQ чинит.",
        ],
    },
    """Mono.fromCallable(this::cloudCall).subscribeOn(Schedulers.boundedElastic());""",
    [MANIFESTO, f"{REACTOR}/faq.html", JVM],
)

add(
    "Discuss how large-scale streaming platforms benefit from Reactive Programming principles.",
    {
        "en": "A streaming platform’s problem is the one Reactive Streams states: live data of unknown volume must cross a boundary without an arbitrary buffer. Demand, or an explicit drop or sample, is the benefit.",
        "ru": "Проблема потоковой платформы — та, которую формулирует Reactive Streams: живые данные неизвестного объёма должны пересечь границу без произвольного буфера. Польза — спрос или явное отбрасывание либо прореживание.",
    },
    {
        "en": [
            "`request(n)` keeps the in-flight set finite.",
            "`onBackpressureDrop` and `sample` shed a burst when the consumer is behind. The backpressure wiki shows both families.",
            "`zip` of two infinite sources without demand is the counterexample: the faster source’s buffer grows forever.",
            "The platform’s own processor, such as Kafka Streams, keeps its API. The reactive principle is the bound, not a renamed operator.",
        ],
        "ru": [
            "`request(n)` держит множество элементов в пути конечным.",
            "`onBackpressureDrop` и `sample` сбрасывают всплеск, когда потребитель отстаёт. Вики о backpressure показывает оба семейства.",
            "`zip` двух бесконечных источников без спроса — контрпример: буфер более быстрого растёт бесконечно.",
            "Собственный обработчик платформы, например Kafka Streams, сохраняет свой API. Реактивный принцип — это предел, а не переименованный оператор.",
        ],
    },
    """source.onBackpressureDrop();
source.sample(500, TimeUnit.MILLISECONDS);""",
    [RS, BP],
)

add(
    "How can Reactive Programming enhance the performance of IoT systems?",
    {
        "en": "Sensors emit faster than a store can write. `debounce`, `sample`, or `onBackpressureDrop` keep the latest useful reading and discard the rest, which is the backpressure wiki’s remedy for a bursty source.",
        "ru": "Датчики излучают быстрее, чем хранилище успевает писать. `debounce`, `sample` или `onBackpressureDrop` оставляют последнее полезное чтение и отбрасывают остальное — это средство вики о backpressure против всплеска.",
    },
    {
        "en": [
            "`sample` emits the most recent item on a period. `debounce` emits an item only after a quiet gap.",
            "Dropping is correct when an old reading is obsolete. Buffering is correct when every reading must be kept and the burst is capped.",
            "A `BehaviorSubject` holds the latest reading for a dashboard that subscribes late.",
            "The device link still needs an asynchronous demand signal if the buffer is not allowed to grow. That is the Reactive Streams goal across hosts.",
        ],
        "ru": [
            "`sample` излучает самый недавний элемент по периоду. `debounce` излучает элемент только после паузы.",
            "Отбрасывание верно, когда старое чтение устарело. Буферизация верна, когда каждое чтение нужно сохранить и всплеск ограничен.",
            "`BehaviorSubject` держит последнее чтение для панели, которая подписалась поздно.",
            "Каналу устройства всё ещё нужен асинхронный сигнал спроса, если буферу нельзя расти. Это цель Reactive Streams между хостами.",
        ],
    },
    """readings.sample(1, TimeUnit.SECONDS);
readings.onBackpressureDrop();""",
    [BP, f"{RX}/operators/debounce.html", f"{RX}/subject.html"],
    when={
        "en": "Sample or drop when only a recent reading matters. Buffer when the archive must not lose points and you have set a capacity that errors instead of growing forever.",
        "ru": "Прореживайте или отбрасывайте, когда важно только недавнее чтение. Буферизуйте, когда архив не должен терять точки и задана ёмкость, которая завершается ошибкой, а не растёт вечно.",
    },
)

add(
    "Share a case study where the adoption of Reactive Programming solved a scalability issue.",
    {
        "en": "The failure mode the docs describe is a thread blocked per request, or a `zip` buffer that grows without bound. The fix they describe is a `Mono` subscribed on `boundedElastic` for the blocking call, and `request` or `onBackpressureDrop` for the fast source.",
        "ru": "Режим отказа, который описывают документы, — поток, заблокированный на запрос, или буфер `zip`, который растёт без границы. Исправление, которое они описывают, — `Mono`, подписанный на `boundedElastic`, для блокирующего вызова и `request` или `onBackpressureDrop` для быстрого источника.",
    },
    {
        "en": [
            "Before: each call occupies a thread until the remote returns. Threads run out while most of them wait.",
            "After: the event loop accepts the call, `subscribeOn(boundedElastic)` runs the blocking client, and the `Mono` completes later.",
            "A second failure, a fast publisher and a slow consumer, is fixed by demand rather than by a larger heap.",
            "The manifesto’s names for the result are elastic and responsive. The code is the FAQ wrapper plus Reactive Streams `request`.",
        ],
        "ru": [
            "До: каждый вызов занимает поток, пока удалённая сторона не вернётся. Потоки кончаются, пока большинство из них ждёт.",
            "После: цикл событий принимает вызов, `subscribeOn(boundedElastic)` выполняет блокирующий клиент, и `Mono` завершается позже.",
            "Второй сбой, быстрый издатель и медленный потребитель, чинится спросом, а не большей кучей.",
            "Имена результата в манифесте — эластичность и отзывчивость. Код — обёртка из FAQ плюс `request` Reactive Streams.",
        ],
    },
    """Mono.fromCallable(this::blockingCall)
    .subscribeOn(Schedulers.boundedElastic());""",
    [f"{REACTOR}/faq.html", JVM, MANIFESTO],
)
