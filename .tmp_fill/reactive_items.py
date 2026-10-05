# Empty reactive-programming answers. Code and URLs are shared across locales.

RX = "https://reactivex.io/documentation"
REACTOR = "https://projectreactor.io/docs/core/release/reference"
RS = "https://www.reactive-streams.org/"
MANIFESTO = "https://www.reactivemanifesto.org/"
BP = "https://github.com/ReactiveX/RxJava/wiki/Backpressure"

REACTIVE_ITEMS = []


def add(summary, defn, how, example, sources, when=None, lang="java"):
    REACTIVE_ITEMS.append(
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
    "What is a `Scheduler` in RxJava?",
    {
        "en": "A Scheduler is the concurrency abstraction ReactiveX uses so operators can run work off the thread that subscribed. `subscribeOn` chooses where the source starts; `observeOn` chooses where later notifications are delivered.",
        "ru": "Scheduler — абстракция конкурентности, которой ReactiveX переносит работу операторов с потока, где подписались. `subscribeOn` выбирает, где стартует источник; `observeOn` — куда доставляются дальнейшие уведомления.",
    },
    {
        "en": [
            "By default the chain runs and notifies observers on the thread where `subscribe` was called.",
            "`subscribeOn` sets the scheduler the observable operates on, wherever that operator sits in the chain.",
            "`observeOn` changes the thread used to send notifications downstream of that operator.",
            "RxJava’s standard set, described in the library readme, includes computation, a cached scheduler for I/O, single for sequential work, and trampoline.",
        ],
        "ru": [
            "По умолчанию цепочка выполняется и уведомляет наблюдателей в потоке, где вызвали `subscribe`.",
            "`subscribeOn` задаёт scheduler, на котором работает observable, независимо от места оператора в цепочке.",
            "`observeOn` меняет поток, которым уведомления уходят вниз от этого оператора.",
            "Стандартный набор RxJava, описанный в readme библиотеки, включает computation, кэширующий scheduler для ввода-вывода, single для последовательной работы и trampoline.",
        ],
    },
    """Flowable.fromCallable(() -> "Done")
    .subscribeOn(Schedulers.io())
    .observeOn(Schedulers.single())
    .subscribe(System.out::println, Throwable::printStackTrace);""",
    [
        f"{RX}/scheduler.html",
        "https://github.com/reactivex/rxjava/blob/4.x/README.md",
        "https://reactivex.io/RxJava/2.x/javadoc/io/reactivex/schedulers/Schedulers.html",
    ],
    {
        "en": "Use `subscribeOn` once, at the source, for blocking or slow creation. Use `observeOn` where the next stage must run on a different thread, such as a single consumer.",
        "ru": "`subscribeOn` ставят один раз у источника, если создание медленное или блокирующее. `observeOn` — там, где следующий этап должен идти в другом потоке, например у единственного потребителя.",
    },
)

add(
    "Explain the `Subject` class in RxJava.",
    {
        "en": "A Subject is both an Observer and an Observable. It can subscribe to a source and reemit what it sees, and it can also emit its own items to its own observers.",
        "ru": "Subject — одновременно Observer и Observable. Он может подписаться на источник и переизлучать увиденное, а также излучать собственные элементы своим наблюдателям.",
    },
    {
        "en": [
            "Subscribing a Subject to a cold source starts that source. The Subject then behaves as a hot view of it.",
            "`AsyncSubject` emits only the last item, and only after the source completes. An upstream error is forwarded and no item is emitted.",
            "`BehaviorSubject` starts a new observer with the most recent item, or a seed if nothing has been emitted yet, then continues.",
            "`PublishSubject` emits only items that arrive after subscription. `ReplaySubject` replays earlier items to a new observer.",
        ],
        "ru": [
            "Подписка Subject на холодный источник запускает этот источник. Дальше Subject ведёт себя как горячее представление источника.",
            "`AsyncSubject` излучает только последний элемент и только после завершения источника. Ошибка сверху пробрасывается, элемент не излучается.",
            "`BehaviorSubject` начинает нового наблюдателя с последнего элемента или с начального значения, если излучений ещё не было, и затем продолжает.",
            "`PublishSubject` излучает только элементы, пришедшие после подписки. `ReplaySubject` повторяет прежние элементы новому наблюдателю.",
        ],
    },
    """PublishSubject<String> ticks = PublishSubject.create();
ticks.subscribe(System.out::println);
ticks.onNext("a");
ticks.onNext("b");""",
    [
        f"{RX}/subject.html",
        "https://github.com/ReactiveX/RxJava/wiki/Subject",
    ],
    {
        "en": "Use a plain observable when each subscriber should get its own cold sequence. Use a Subject when many subscribers must share one live sequence, and pick the variant by how much history a late subscriber needs.",
        "ru": "Обычный observable — когда каждый подписчик должен получить свою холодную последовательность. Subject — когда многие подписчики делят одну живую последовательность; вариант выбирают по тому, сколько истории нужно опоздавшему.",
    },
)

add(
    "How can you achieve thread-safety in RxJava?",
    {
        "en": "An Rx contract assumes notifications for one observer are serial. The RxJava Subject wiki says calls into a Subject from several threads are not safe, and a serialized wrapper restores that contract.",
        "ru": "Контракт Rx предполагает, что уведомления одному наблюдателю идут последовательно. Вики RxJava про Subject говорит, что вызовы в Subject из нескольких потоков небезопасны, и сериализующая обёртка восстанавливает этот контракт.",
    },
    {
        "en": [
            "ReactiveX says that on the observer side of a Subject, concurrent `onNext` from multiple threads can leave an undefined state.",
            "The RxJava wiki shows `new SerializedSubject(unsafe)` so those calls are queued onto one sequence.",
            "`subscribeOn` and `observeOn` move work between schedulers, but they do not make an arbitrary Subject safe if you also call `onNext` yourself from two threads.",
            "Prefer emitting from one thread, or from operators that already hop with `observeOn`, instead of sharing a mutable collector.",
        ],
        "ru": [
            "ReactiveX говорит, что на стороне наблюдателя у Subject параллельные `onNext` из нескольких потоков могут оставить неопределённое состояние.",
            "Вики RxJava показывает `new SerializedSubject(unsafe)`, чтобы эти вызовы выстроились в одну последовательность.",
            "`subscribeOn` и `observeOn` переносят работу между scheduler, но не делают произвольный Subject безопасным, если вы сами зовёте `onNext` из двух потоков.",
            "Лучше излучать из одного потока или из операторов, которые и так переключаются через `observeOn`, а не делить изменяемый накопитель.",
        ],
    },
    """Subject<Integer> raw = PublishSubject.create();
Subject<Integer> safe = new SerializedSubject<>(raw);
safe.subscribe(System.out::println);
safe.onNext(1);""",
    [
        f"{RX}/subject.html",
        "https://github.com/ReactiveX/RxJava/wiki/Subject",
        f"{RX}/scheduler.html",
    ],
)

add(
    "What is the `debounce` operator in RxJava?",
    {
        "en": "`debounce` (also called `throttleWithTimeout`) emits an item only when a timespan has passed without the source emitting another item. The last item is still emitted if nothing follows it inside the window.",
        "ru": "`debounce` (также `throttleWithTimeout`) излучает элемент, только если за заданный промежуток источник не излучил следующий. Последний элемент всё равно излучается, если внутри окна за ним ничего не пришло.",
    },
    {
        "en": [
            "Items that are quickly followed by another item are filtered out.",
            "The time span is a duration plus a time unit. A Scheduler argument chooses where the timer runs; without it the operator uses its default scheduler.",
            "A variant calls a function per item and waits on the observable that function returns. A new source item before that inner completes drops the previous one.",
            "The backpressure wiki lists `debounce` next to `sample` and `throttleFirst` as a way to shrink a burst before a slow consumer.",
        ],
        "ru": [
            "Элементы, за которыми быстро приходит другой, отбрасываются.",
            "Промежуток задают длительностью и единицей времени. Аргумент Scheduler выбирает, где идёт таймер; без него оператор берёт свой scheduler по умолчанию.",
            "Вариант вызывает функцию на элемент и ждёт observable, который она вернула. Новый элемент источника до завершения этого внутреннего отбрасывает предыдущий.",
            "Вики о backpressure ставит `debounce` рядом с `sample` и `throttleFirst` как способ сжать всплеск до медленного потребителя.",
        ],
    },
    """Observable<Integer> burstyDebounced =
    bursty.debounce(10, TimeUnit.MILLISECONDS);""",
    [
        f"{RX}/operators/debounce.html",
        BP,
    ],
    {
        "en": "Use `debounce` for a burst where only the quiet-period item matters, such as a search box. Use `sample` when you want the latest item on a fixed clock instead of a quiet gap.",
        "ru": "`debounce` — для всплеска, где важен элемент после паузы, например поле поиска. `sample` — когда нужен последний элемент по фиксированным часам, а не после тишины.",
    },
)
