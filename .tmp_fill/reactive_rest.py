"""Remaining reactive answers, appended onto reactive_items.REACTIVE_ITEMS."""

from reactive_items import BP, MANIFESTO, REACTOR, RS, RX, add

add(
    "What is Reactive Extensions (ReactiveX or Rx) and RxJS?",
    {
        "en": "ReactiveX is the family of libraries that compose asynchronous events as observable sequences. RxJS is the JavaScript member of that family; RxJava is the JVM member. The same operator names — map, zip, debounce, subjects, schedulers — are documented once and implemented per language.",
        "ru": "ReactiveX — семейство библиотек, которые собирают асинхронные события как наблюдаемые последовательности. RxJS — член этого семейства для JavaScript, RxJava — для JVM. Одни и те же имена операторов — map, zip, debounce, subjects, schedulers — описаны один раз и реализованы в каждом языке.",
    },
    {
        "en": [
            "An observable pushes items, an error, or completion to an observer.",
            "Operators such as `zip` and `debounce` are pure functions from one sequence to another. They are listed on the ReactiveX operator pages, which name RxJS and RxJava together.",
            "A Subject is the bridge that is both observer and observable, shared by the implementations.",
            "Schedulers are how a chain leaves the subscribing thread. In the browser that hop is smaller; the operator contract is the same.",
        ],
        "ru": [
            "Observable толкает наблюдателю элементы, ошибку или завершение.",
            "Операторы вроде `zip` и `debounce` — функции из одной последовательности в другую. Они перечислены на страницах операторов ReactiveX, где RxJS и RxJava названы вместе.",
            "Subject — мост, который одновременно наблюдатель и observable; его делят реализации.",
            "Schedulers уводят цепочку с потока подписки. В браузере этот переход меньше; контракт оператора тот же.",
        ],
    },
    """// ReactiveX From, as implemented by RxJS `from` and RxJava `fromIterable`
Observable.fromIterable(java.util.List.of(1, 2, 3))
    .map(n -> n * 2);""",
    [f"{RX}/observable.html", f"{RX}/operators.html", f"{RX}/operators/from.html"],
)

add(
    "Give an example of how to implement a simple RxJS Observable.",
    {
        "en": "A simple observable is a function that, on subscribe, pushes items and then a completion. ReactiveX’s `from` turns an array into that sequence; RxJS exposes it as `from`.",
        "ru": "Простой observable — функция, которая при подписке толкает элементы и затем завершение. `from` в ReactiveX превращает массив в такую последовательность; RxJS открывает её как `from`.",
    },
    {
        "en": [
            "Nothing is emitted until something subscribes. That is the cold behavior the RxJava backpressure page describes for a sequence built from a static collection.",
            "`from` walks the array and emits each element in order, then completes.",
            "Operators such as `map` return a new observable. They do not run the array walk by themselves.",
            "The observer receives `next` calls and one terminal signal. After completion the sequence emits nothing else.",
        ],
        "ru": [
            "Ничего не излучается, пока кто-то не подпишется. Это холодное поведение, которое страница backpressure RxJava описывает для последовательности из статической коллекции.",
            "`from` обходит массив и излучает каждый элемент по порядку, затем завершается.",
            "Операторы вроде `map` возвращают новый observable. Сами они обход массива не запускают.",
            "Наблюдатель получает вызовы `next` и один завершающий сигнал. После завершения последовательность больше ничего не излучает.",
        ],
    },
    """import { from } from "rxjs";
import { map } from "rxjs/operators";

from([1, 2, 3]).pipe(map(n => n * 2)).subscribe(console.log);""",
    [f"{RX}/operators/from.html", f"{RX}/observable.html"],
    lang="javascript",
)

add(
    "How does RxJS's `Observable` differ from a Promise?",
    {
        "en": "A Promise settles once, eagerly, with a value or a rejection. An Observable is a sequence: it can emit many items, it starts when subscribed, and it can be stopped by unsubscribing.",
        "ru": "Promise завершается один раз, сразу, значением или отказом. Observable — последовательность: он может излучить много элементов, стартует при подписке и его можно остановить отпиской.",
    },
    {
        "en": [
            "Constructing a Promise runs the executor. Constructing an Observable from an array does not walk it until `subscribe`, which is the cold behavior described for a static source.",
            "An observable may call `next` many times and then `complete` or `error`. A Promise has one resolution.",
            "Operators such as `map` and `debounce` compose the sequence. A Promise chain is `then` on a single future value.",
            "Unsubscribing drops the observer. A Promise has no cancel in the same sense; it still settles.",
        ],
        "ru": [
            "Создание Promise запускает исполнитель. Создание Observable из массива не обходит его до `subscribe` — это холодное поведение статического источника.",
            "Observable может много раз вызвать `next` и затем `complete` или `error`. У Promise одно разрешение.",
            "Операторы вроде `map` и `debounce` собирают последовательность. Цепочка Promise — это `then` над одним будущим значением.",
            "Отписка убирает наблюдателя. Promise в том же смысле не отменяется: он всё равно завершится.",
        ],
    },
    """// one settlement
Promise.resolve(1).then(console.log);

// a sequence, started by subscribe
from([1, 2, 3]).subscribe(console.log);""",
    [f"{RX}/observable.html", f"{RX}/operators/from.html"],
    when={
        "en": "Use a Promise for one result that should start immediately. Use an Observable when there are many values, when work should wait for subscribe, or when the consumer must be able to unsubscribe.",
        "ru": "Promise — для одного результата, который должен начаться сразу. Observable — когда значений много, когда работа должна ждать подписки или когда потребитель должен иметь возможность отписаться.",
    },
    lang="javascript",
)

add(
    "Explain the concept of marble diagrams in RxJS.",
    {
        "en": "A marble diagram draws one observable as a time arrow. Marbles are items, a vertical bar is completion, and an X is an error. Operator pages on ReactiveX use that drawing to show input arrows and the output arrow.",
        "ru": "Мраморная диаграмма рисует один observable как стрелку времени. Шарики — элементы, вертикальная черта — завершение, крест — ошибка. Страницы операторов ReactiveX этим рисунком показывают входные стрелки и выходную.",
    },
    {
        "en": [
            "Time moves to the right. The horizontal gap between marbles is the gap between emissions.",
            "The debounce page’s diagram drops marbles that are followed too quickly and keeps the one after a quiet gap, including the last marble.",
            "A second arrow under the first is the operator’s result, not a second subscription.",
            "Completion on the source ends the output. An error on the source ends it with an error instead.",
        ],
        "ru": [
            "Время идёт вправо. Горизонтальный зазор между шариками — зазор между излучениями.",
            "Диаграмма на странице debounce отбрасывает шарики, за которыми слишком быстро пришёл следующий, и оставляет шарик после паузы, включая последний.",
            "Вторая стрелка под первой — результат оператора, а не вторая подписка.",
            "Завершение источника заканчивает выход. Ошибка источника заканчивает его ошибкой.",
        ],
    },
    """source:   --a--b-c------d--|
debounce: -----b------c------d--|""",
    [f"{RX}/operators/debounce.html", f"{RX}/operators.html"],
    lang="text",
)

add(
    "In RxJS, how would you convert an array to an Observable sequence?",
    {
        "en": "The ReactiveX `from` operator converts an array, an iterable, or a similar structure into an observable that emits each element and then completes. RxJS names that function `from`; RxJava 2 names the iterable form `fromIterable`.",
        "ru": "Оператор ReactiveX `from` превращает массив, итерируемое или похожую структуру в observable, который излучает каждый элемент и затем завершается. RxJS называет эту функцию `from`; RxJava 2 называет форму для итерируемого `fromIterable`.",
    },
    {
        "en": [
            "Subscription starts the walk. A second subscriber walks the array again, because a static source is cold.",
            "Order is the array order. There is no timer unless you add one.",
            "`map` after `from` transforms each element without changing the completion.",
            "An empty array completes without a `next`.",
        ],
        "ru": [
            "Подписка начинает обход. Второй подписчик обходит массив снова, потому что статический источник холодный.",
            "Порядок — порядок массива. Таймера нет, пока его не добавят.",
            "`map` после `from` преобразует каждый элемент и не меняет завершение.",
            "Пустой массив завершается без `next`.",
        ],
    },
    """from([1, 2, 3]).subscribe({
  next: console.log,
  complete: () => console.log("done")
});""",
    [f"{RX}/operators/from.html"],
    lang="javascript",
)

add(
    "Describe the `switchMap` operator in RxJS.",
    {
        "en": "ReactiveX names this operator Switch. It takes an observable that emits observables and emits items only from the most recently emitted inner observable, unsubscribing from the previous inner.",
        "ru": "ReactiveX называет этот оператор Switch. Он берёт observable, который излучает другие observable, и излучает элементы только самого недавнего внутреннего observable, отписываясь от предыдущего.",
    },
    {
        "en": [
            "Switch subscribes to an inner observable when the outer emits it.",
            "When the outer emits a newer inner, the previous inner is unsubscribed. Later items from the old inner are ignored.",
            "RxJS spells the same operator `switchMap`: the function returns the inner for each outer item.",
            "This is the opposite of merging every inner. Only one inner is active.",
        ],
        "ru": [
            "Switch подписывается на внутренний observable, когда внешний его излучил.",
            "Когда внешний излучает более новый внутренний, от предыдущего отписываются. Поздние элементы старого внутреннего игнорируются.",
            "RxJS записывает тот же оператор как `switchMap`: функция возвращает внутренний observable для каждого внешнего элемента.",
            "Это не слияние всех внутренних. Активен только один.",
        ],
    },
    """// RxJS name for ReactiveX Switch
source.pipe(switchMap(id => from(load(id))));""",
    [f"{RX}/operators/switch.html"],
    when={
        "en": "Use `switchMap` when a new outer item makes the previous inner obsolete, such as the latest search. Use `flatMap` when every inner must be merged, which is the contract already stated for flatMap.",
        "ru": "`switchMap` — когда новый внешний элемент делает предыдущий внутренний ненужным, например последний поиск. `flatMap` — когда каждый внутренний нужно слить; этот контракт для flatMap уже зафиксирован.",
    },
    lang="javascript",
)

add(
    "How do you handle backpressure in RxJS?",
    {
        "en": "Backpressure is what you do when a source emits faster than the consumer can take. RxJS has no Reactive Streams `request(n)` pull. The RxJava backpressure page’s first defense still applies: shrink the sequence with `debounce`, `sample`, or `buffer` before it reaches the subscriber.",
        "ru": "Backpressure — это что делать, когда источник излучает быстрее, чем потребитель успевает забирать. В RxJS нет pull-модели Reactive Streams с `request(n)`. Первая защита со страницы backpressure RxJava всё равно применима: сожмите последовательность через `debounce`, `sample` или `buffer`, прежде чем она дойдёт до подписчика.",
    },
    {
        "en": [
            "The backpressure wiki shows `debounce`, `sample` / `throttleLast`, and `throttleFirst` cutting a burst down.",
            "`buffer` collects items and emits them as lists, so the subscriber sees fewer, larger notifications.",
            "A cold source built with `from` already emits only as the subscriber pulls by being synchronous. A hot source such as UI events does not wait.",
            "JVM libraries add `onBackpressureBuffer` and `onBackpressureDrop` because they implement `request`. Those two operators are not RxJS methods.",
        ],
        "ru": [
            "Вики о backpressure показывает, как `debounce`, `sample` / `throttleLast` и `throttleFirst` срезают всплеск.",
            "`buffer` собирает элементы и излучает их списками, поэтому подписчик видит меньше, но более крупные уведомления.",
            "Холодный источник из `from` и так излучает лишь пока синхронный подписчик забирает. Горячий источник, например события UI, не ждёт.",
            "Библиотеки JVM добавляют `onBackpressureBuffer` и `onBackpressureDrop`, потому что реализуют `request`. Эти два оператора — не методы RxJS.",
        ],
    },
    """fromEvent(input, "input").pipe(
  debounceTime(10),
  map(event => event.target.value)
);""",
    [BP, f"{RX}/operators/debounce.html"],
    lang="javascript",
)

add(
    "What is the `BehaviorSubject` in RxJS?",
    {
        "en": "A `BehaviorSubject` is the Subject variant that, on subscription, emits the most recent item, or a seed if nothing has been emitted yet, and then emits later items.",
        "ru": "`BehaviorSubject` — вариант Subject, который при подписке излучает самый недавний элемент или начальное значение, если излучений ещё не было, а затем излучает дальнейшие.",
    },
    {
        "en": [
            "The ReactiveX subject page states that contract directly.",
            "A late subscriber does not miss the current value. It also does not see the whole history; that is `ReplaySubject`.",
            "It is hot: the value exists whether or not someone is subscribed.",
            "As with any Subject, concurrent emissions from several threads are not part of the contract. RxJS is usually single-threaded; the JVM wiki still says to serialize a Subject.",
        ],
        "ru": [
            "Страница Subject в ReactiveX формулирует этот контракт прямо.",
            "Опоздавший подписчик не пропускает текущее значение. Всю историю он не видит; это уже `ReplaySubject`.",
            "Он горячий: значение есть независимо от того, подписан ли кто-то.",
            "Как у любого Subject, параллельные излучения из нескольких потоков не входят в контракт. RxJS обычно однопоточен; вики JVM всё равно говорит сериализовать Subject.",
        ],
    },
    """const selected = new BehaviorSubject("none");
selected.subscribe(console.log); // "none"
selected.next("row-1");""",
    [f"{RX}/subject.html"],
    lang="javascript",
)

add(
    "What are the uses of the `scan` operator in RxJS?",
    {
        "en": "`scan` applies a function to each item together with the accumulator so far and emits every intermediate accumulator. It is the running fold of a sequence.",
        "ru": "`scan` применяет функцию к каждому элементу вместе с аккумулятором и излучает каждый промежуточный аккумулятор. Это бегущая свёртка последовательности.",
    },
    {
        "en": [
            "The ReactiveX scan page describes emitting the accumulated value on each source item, not only the final one.",
            "You pass a seed. The first emission is the seed combined with the first item.",
            "The sequence still completes or errors with the source. `scan` does not hide an error.",
            "A counter, a growing sum, or a state object folded from events are the usual shapes.",
        ],
        "ru": [
            "Страница scan в ReactiveX описывает излучение накопленного значения на каждый элемент источника, а не только итога.",
            "Передают начальное значение. Первое излучение — начальное значение, соединённое с первым элементом.",
            "Последовательность по-прежнему завершается или падает вместе с источником. `scan` ошибку не прячет.",
            "Счётчик, растущая сумма или объект состояния, свёрнутый из событий, — обычные формы.",
        ],
    },
    """from([1, 2, 3]).pipe(
  scan((acc, n) => acc + n, 0)
);
// 1, 3, 6""",
    [f"{RX}/operators/scan.html"],
    lang="javascript",
)

add(
    "How do you do error recovery in RxJS?",
    {
        "en": "An error is terminal for that sequence. Recovery means replacing the failure with a value, another observable, or a resubscription before the error reaches the subscriber.",
        "ru": "Ошибка для этой последовательности терминальна. Восстановление значит заменить сбой значением, другим observable или повторной подпиской, прежде чем ошибка дойдёт до подписчика.",
    },
    {
        "en": [
            "Letting the error reach `subscribe` is correct when the UI should show the failure.",
            "ReactiveX recovery follows the same split the RxJava error path uses: return a fallback item, switch to another observable, or resubscribe.",
            "Resubscribing repeats a cold source such as `from` or a new HTTP call. It does not rewind a hot Subject.",
            "A side-effect logger must rethrow or return the error channel. Swallowing the error in an empty callback hides the failure.",
        ],
        "ru": [
            "Допустить ошибку до `subscribe` правильно, когда интерфейс должен показать сбой.",
            "Восстановление в ReactiveX следует тому же разделению, что и путь ошибок RxJava: вернуть запасной элемент, переключиться на другой observable или подписаться снова.",
            "Повторная подписка повторяет холодный источник вроде `from` или новый HTTP-вызов. Горячий Subject она не отматывает.",
            "Журнал как побочный эффект должен пробросить ошибку или вернуть канал ошибки. Пустой callback прячет сбой.",
        ],
    },
    """source.pipe(
  catchError(() => of([]))
);""",
    [f"{RX}/observable.html", "https://reactivex.io/documentation/operators/catch.html"],
    lang="javascript",
)
