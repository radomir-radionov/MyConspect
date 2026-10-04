# Greedy Algorithms — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./7_special_algorithms.md)

### Related docs

- [Greedy Algorithms — собеседование](./7_algo_greedy_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Greedy Algorithms](https://devinterview.io/questions/data-structures-and-algorithms/greedy-algorithms-interview-questions/).

### Understanding Greedy Algorithms

<details>
<summary>What is a Greedy Algorithm?</summary>

### What is a Greedy Algorithm?

**Definition:**

Жадный алгоритм строит ответ, на каждом шаге беря вариант, который выглядит лучшим прямо сейчас, и не возвращается пересматривать этот выбор.

**How it works:**

- Свойство жадного выбора — надежда, что локально лучший шаг можно достроить до глобально лучшего решения.
- Выборы необратимы. Отката по уже взятым вариантам нет.
- Когда свойство выполнено, алгоритм обычно — сортировка плюс линейный проход, поэтому он быстр по сравнению с перебором всех подмножеств.
- Дробный рюкзак — учебная победа: берут предметы в порядке ценности на единицу веса и дробят только последний, который не влезает.
- Алгоритм Дейкстры — пример на графе: всегда фиксируют незафиксированную вершину с наименьшим предварительным расстоянием и не открывают её снова, когда все веса неотрицательны.
- Если поздний шаг может пожалеть о раннем выборе, жадный алгоритм — неверный проект. Рюкзак 0/1 — обычный контрпример.

**Examples:**

Монеты `1, 5, 10`, чтобы набрать 28: две монеты по 10, одна 5 и три по 1. Брать самую крупную монету, которая ещё влезает, для этого набора оптимально.
</details>

<details>
<summary>What are Greedy Algorithms used for?</summary>

### What are Greedy Algorithms used for?

**Definition:**

Жадные методы используют на задачах оптимизации, где порядок сортировки делает следующий безопасный выбор очевидным: кратчайшие пути, остовные деревья, коды и расписания.

**How it works:**

- Дейкстра растит дерево кратчайших путей на неотрицательных весах, фиксируя ближайшую незафиксированную вершину.
- Kruskal сортирует рёбра по весу и добавляет ребро, когда оно соединяет две компоненты. Prim растит одну компоненту самым дешёвым ребром, которое из неё выходит. Оба строят минимальное остовное дерево.
- Кодирование Хаффмана повторно сливает два самых редких символа, чтобы частые символы получили короткие коды.
- Планирование интервалов сортирует по времени окончания и берёт следующий интервал, который начинается после последнего выбранного, максимизируя, сколько их влезает на один ресурс.
- Жадная эвристика покрытия множества повторно берёт множество, покрывающее больше всего ещё не покрытых элементов. Это приближение, не точный оптимум.
- Дробный рюкзак по плотности ценности точен. Версия 0/1 — не жадная задача.
- Тот же рисунок есть в заполнении строки текста и в правилах вытеснения кэша, которые всегда выбрасывают локально «наименее полезную» запись.

**Examples:**

Занятия кончаются в 3, 5 и 9 и начинаются в 1, 4 и 6. Сортировка по окончанию берёт первое и третье. Второе пересекается с первым.
</details>

<details>
<summary>List some characteristics that are often present in problems that are solvable by greedy algorithms.</summary>

### List some characteristics that are often present in problems that are solvable by greedy algorithms.

**Definition:**

Задача — кандидат на жадный алгоритм, когда локально лучший шаг безопасно оставить, а остаток задачи — та же задача без этого шага.

**How it works:**

- Оптимальная подструктура: оптимальное решение содержит оптимальные решения кусков, оставшихся после выбора.
- Свойство жадного выбора: некоторый локально лучший вариант входит в некоторое оптимальное решение, поэтому остальные варианты пробовать не нужно.
- Выбор не отменяют. Это безопасно только из-за свойства выше, а не потому, что необратимость сама по себе добродетель.
- Каждый входной элемент рассматривают константное число раз, часто один раз после сортировки, поэтому память сверх входа остаётся малой.
- Задача делится на выбор плюс один меньший независимый остаток, а не на таблицу пересекающихся подзадач.
- Классические попадания: Дейкстра на неотрицательных рёбрах, кодирование Хаффмана, выбор занятий и размен для канонических номиналов.
- У задачи может быть оптимальная подструктура, и она всё ещё не жадная. У расстояния редактирования подструктура есть, и нужна таблица, потому что ни одна локальная правка не всегда безопасна.

**Examples:**

Выбор занятий: интервал, который кончается первым, всегда безопасно оставить. После того как его взяли, задача — та же задача на интервалах, которые начинаются позже.
</details>

<details>
<summary>What is the difference between Greedy and Heuristic algorithms?</summary>

### What is the difference between Greedy and Heuristic algorithms?

**Definition:**

Эвристика — любое практическое правило, которое целится в хороший ответ без доказательства, что ответ лучший. Жадный алгоритм — конкретное правило: взять локально лучший допустимый шаг и не пересматривать его. Некоторые жадные алгоритмы точны. Эвристика этого не обещает.

**How it works:**

- Жадный алгоритм решает только по текущему состоянию, обычно после того как вход отсортирован по фиксированной оценке.
- Эвристика может быть жадной оценкой, случайной выборкой, отсечением поиска или правилом, выученным из данных. Слово шире.
- Жадный алгоритм не откатывается. Некоторые эвристики откатываются или перезапускаются.
- Когда свойство жадного выбора доказано, результат оптимален, а не просто правдоподобен. Дробный рюкзак — этот случай.
- Когда оно не доказано, тот же стиль шага — лишь эвристика. Ближайший сосед для коммивояжёра жаден и не оптимален.
- «Эвристика» — для «мы принимаем хороший ответ». «Жадный» — для одношагового локального правила, и отдельно говорите, точно ли это правило.

**Examples:**

Кодирование Хаффмана жадно и оптимально для посимвольных префиксных кодов. Шахматная программа, которая всегда берёт самую ценную фигуру, — жадная эвристика и проигрывает партии, которые выиграл бы поиск.
</details>

<details>
<summary>Compare Greedy vs Divide & Conquer vs Dynamic Programming algorithms.</summary>

### Compare Greedy vs Divide & Conquer vs Dynamic Programming algorithms.

**Definition:**

Жадный алгоритм на каждом шаге фиксирует один вариант. «Разделяй и властвуй» решает независимые куски и соединяет их. Динамическое программирование решает пересекающиеся куски и хранит ответы.

**How it works:**

- Оптимальность: доказанный жадный выбор оптимален и дёшев. «Разделяй и властвуй» оптимален, когда шаг соединения сохраняет ответы кусков, как в merge sort. DP оптимален, когда рекуррентность перечисляет безопасные выборы и хранит лучший.
- Время: жадный алгоритм часто — сортировка, Θ(n log n), плюс проход. «Разделяй и властвуй» следует рекуррентности вроде `T(n) = 2T(n/2) + Θ(n)`. DP — это состояния, умноженные на работу на состояние, и он может быть тяжелее, потому что хранит и проигравших, и победителя.
- Память: жадный алгоритм обычно хранит строящийся ответ. «Разделяй и властвуй» хранит стек рекурсии и иногда буфер. DP хранит таблицу.
- Жадные примеры: Дейкстра, Хаффман, планирование интервалов.
- Примеры «разделяй и властвуй»: merge sort, двоичный поиск и Карацуба или Штрассен, когда куски независимы.
- Примеры DP: расстояние редактирования, рюкзак 0/1, Флойд-Уоршелл и минимакс по явному дереву игры, когда состояния повторяются.
- Задача с пересекающимися подзадачами плохо ложится на голое «разделяй и властвуй», потому что куски пересчитываются. Задача без безопасного локального выбора плохо ложится на жадный алгоритм.

**Examples:**

Размен номиналами `1, 5, 10` жаден. Та же задача с номиналами `1, 3, 4` нуждается в DP, потому что брать самую крупную монету не всегда лучше.
</details>

<details>
<summary>Is Dijkstra’s algorithm a Greedy or Dynamic Programming algorithm?</summary>

### Is Dijkstra’s algorithm a Greedy or Dynamic Programming algorithm?

**Definition:**

Алгоритм Дейкстры жадный. Он всегда фиксирует незафиксированную вершину с наименьшим предварительным расстоянием, и при неотрицательных весах этот выбор не пересматривают.

**How it works:**

- Локальное правило — очередь с приоритетом: extract-min, затем ослабление исходящих рёбер.
- Оптимальная подструктура объясняет, почему выбор безопасен. Кратчайший путь до `u` плюс неотрицательное ребро — кратчайший путь к соседу, как только `u` — ближайшая незафиксированная вершина. Префиксы кратчайшего пути сами кратчайшие.
- Эту подструктуру Дейкстра делит с динамическим программированием. Алгоритм не заполняет таблицу каждой подзадачи, как Флойд-Уоршелл, и не пробует других предыдущих вершин после того, как вершина зафиксирована.
- Беллман-Форд — алгоритм ослабления, который разрешает поздние улучшения, поэтому он переносит отрицательные рёбра. Называть Дейкстру «динамическим программированием» из-за подструктуры смазывает эту разницу.
- Обычная оценка с двоичной кучей — Θ((V + E) log V).

**Examples:**

Из `S` рёбра `S→A` веса 1, `S→B` веса 4 и `A→B` веса 1. Дейкстра сначала фиксирует `A`, затем ослабляет `A→B` до 2 и никогда не открывает `A` снова. Итоговое расстояние до `B` — 2.
</details>

<details>
<summary>Is there a way to Mathematically Prove that a Greedy Algorithm will yield the Optimal Solution?</summary>

### Is there a way to Mathematically Prove that a Greedy Algorithm will yield the Optimal Solution?

**Definition:**

Да, когда можно доказать свойство жадного выбора и оптимальную подструктуру. Для некоторых задач то же доказательство — утверждение, что допустимые множества образуют матроид.

**How it works:**

- Жадный выбор: показывают, что если оптимальное решение расходится с первым жадным выбором, этот выбор можно подменить и остаться оптимальным.
- Оптимальная подструктура: после выбора остаток того оптимального решения оптимален для меньшей задачи.
- Индукция тогда говорит, что вся последовательность выборов оптимальна.
- Матроид упаковывает эти два факта. Семейство допустимых множеств наследственно (подмножество допустимого множества допустимо) и имеет свойство обмена (меньшее допустимое множество может взять некоторый элемент большего и остаться допустимым). Жадный алгоритм, который добавляет лучший подходящий элемент, тогда оптимален. Графические матроиды — причина, почему работает Kruskal.
- У дробного рюкзака есть прямое доказательство обменом, и его обычно не подают как матроид. У рюкзака 0/1 нет свойства обмена: лидера по плотности не всегда можно подменить, не сломав допустимость или оптимальность.

**Examples:**

Если оптимальный набор занятий пропускает интервал, который кончается первым, замените его первое занятие этим интервалом. Замена всё ещё влезает, и число не падает. Эта подмена — доказательство жадного выбора.
</details>

<details>
<summary>Explain the Greedy Choice Property and its significance in greedy algorithms.</summary>

### Explain the Greedy Choice Property and its significance in greedy algorithms.

**Definition:**

Свойство жадного выбора говорит, что локально лучший вариант входит в некоторое глобально оптимальное решение. Благодаря ему алгоритм фиксирует шаг, не обыскивая другие ветви.

**How it works:**

- Шаг использует только то, что известно сейчас: самое дешёвое ребро, которое не замыкает цикл, интервал, который кончается раньше всех, пара символов с наименьшими частотами.
- Он не смотрит, как оценят поздние шаги. Доказательство, сделанное отдельно, показывает, что некоторый оптимум содержит этот шаг.
- Без свойства то же локальное правило может промахнуться мимо оптимума. Это ограничение задачи, а не повод добавить откат и всё ещё называть алгоритм жадным.
- Задачи, у которых свойство есть: минимальные остовные деревья, Дейкстра на неотрицательных весах, кодирование Хаффмана, дробный рюкзак и выбор занятий.
- Политики кэша вроде «вытеснить давно не использованное» — жадные правила ради хорошей доли попаданий. Этого свойства у них нет для каждой последовательности запросов.

**Examples:**

Дети, покупающие конфеты с общей целью «как можно больше штук», не должны каждый тратить монеты на одну самую приятную штуку. У выбора занятий свойство есть: самое раннее окончание оставляет больше всего места всем остальным.
</details>

### Greedy Algorithm Design

<details>
<summary>Design a greedy algorithm for making change using the fewest coins possible.</summary>

### Design a greedy algorithm for making change using the fewest coins possible.

**Definition:**

Для канонических монетных систем повторно берут крупнейший номинал, который не превышает остаток. Монеты США и степени основания работают. Произвольные номиналы — нет.

**How it works:**

- Один раз сортируют номиналы по убыванию.
- Пока остаток положителен, берут крупнейшую монету, которая влезает, вычитают её и считают.
- На канонической системе это совпадает с оптимумом. Доказательство — обмен: оптимум, в котором достаточно мелких монет, чтобы заменить крупную, может подставить крупную и не использовать больше монет.
- Время Θ(число номиналов + число выданных монет) после сортировки, и это нормально, когда мельчайшая монета — 1. Это не Θ(сумма), если не вычитать по единице.
- Если номиналы `1, 3, 4`, а сумма 6, две тройки бьют четвёрку плюс две единицы. Жадный выбор четвёрки неверен. Для неканонического набора используйте таблицу DP размена.
- Если нет монеты 1 и некоторый остаток набрать нельзя, цикл должен остановиться и сообщить неудачу, а не крутиться.

**Examples:**

```text
for coin in denominations_desc:
  take = remainder // coin
  remainder -= take * coin
  count += take
```

Сумма 30 при `25, 10, 1` даёт одну монету 25 и пять по 1, шесть монет, и для этих номиналов это оптимум.
</details>

<details>
<summary>Describe a greedy strategy for scheduling events that use the fewest number of resources.</summary>

### Describe a greedy strategy for scheduling events that use the fewest number of resources.

**Definition:**

Минимум ресурсов равен самой глубокой наложению: максимуму событий, которые идут в один и тот же миг. Проход по линии времени находит эту глубину.

**How it works:**

- Сортируют события по времени начала.
- Ведут мин-кучу времён окончания событий, которым уже выдан ресурс. Перед размещением следующего события снимают каждое окончание, которое не позже этого начала. Эти ресурсы свободны.
- Если куча пуста, событию нужен новый ресурс. Иначе переиспользуют ресурс, чьё событие кончилось первым, и кладут время окончания этого события.
- Максимальный размер, которого куча достигает, — число ресурсов. Каждому событию назначают ресурс, который только что переиспользовали или создали.
- Сортировка Θ(n log n), и каждое событие кладётся и снимается один раз, поэтому сумма Θ(n log n).
- Сортировка по окончанию и выбор непересекающегося подмножества решает другую задачу: сколько событий может принять один ресурс. Она не считает, сколько ресурсов нужно набору пересекающихся событий.

**Examples:**

Встречи `[0, 30), [5, 10), [15, 20)`. Вторая начинается во время первой, поэтому глубина 2. Третья может переиспользовать ресурс, освобождённый в момент 10. Двух комнат необходимо и достаточно.
</details>

<details>
<summary>Explain how to apply a greedy approach to minimize the total waiting time for a given set of queries.</summary>

### Explain how to apply a greedy approach to minimize the total waiting time for a given set of queries.

**Definition:**

Сначала планируйте самый короткий запрос. Время ожидания запроса — сумма длительностей, поставленных перед ним, поэтому длинная работа в начале очереди заставляет платить всех позади.

**How it works:**

- Сортируют длительности по возрастанию.
- Время ожидания работы в позиции `i` (с нуля) — сумма длительностей перед ней. Суммарное ожидание — сумма этих префиксных сумм.
- Равносильно: работа длины `d`, после которой ещё `k` работ, входит в каждое из этих `k` ожиданий, поэтому её считают `k` раз. Поставить большое `d` поздно значит сделать `k` малым.
- Сортировка Θ(n log n). Префиксная сумма Θ(n).
- Это минимизирует сумму времён ожидания или сумму времён завершения для одного процессора без времён поступления и без дедлайнов. Дедлайны или приоритеты меняют правило.
- Кратчайшая работа первой не справедлива. Длинную работу можно откладывать вечно, если короткие всё прибывают. Утверждение об оптимальности — про фиксированную пачку.

**Examples:**

Длительности `5, 1, 3`. Порядок `1, 3, 5`. Ожидания `0`, `1` и `1+3 = 4`, сумма 5. Порядок `5, 3, 1` ждёт `0 + 5 + 8 = 13`.
</details>

<details>
<summary>Develop a greedy algorithm for the activity selection problem to maximize the number of activities.</summary>

### Develop a greedy algorithm for the activity selection problem to maximize the number of activities.

**Definition:**

Сортируют занятия по времени окончания и повторно берут следующее, которое начинается не раньше предыдущего окончания. Это наибольшее множество непересекающихся занятий.

**How it works:**

- Занятие — полуоткрытый интервал `[start, finish)`.
- Сортировка по `finish` по возрастанию. Самое раннее окончание всегда безопасный первый выбор: любой оптимальный набор может подменить своё первое занятие этим.
- Просматривают остальное. Берут занятие, когда его начало не меньше окончания последнего взятого. Иначе пропускают.
- Сортировка Θ(n log n). Проход Θ(n). Дополнительная память — список выхода.
- Сортировка по началу или по длительности не имеет того же доказательства. Длинное занятие, которое начинается первым, может перекрыть несколько коротких.
- Это максимизирует число на одном ресурсе. Оно не максимизирует суммарную длительность и не назначает много ресурсов.

**Examples:**

```text
сортировать по окончанию
last = -infinity
for activity in activities:
  if activity.start >= last:
    take(activity)
    last = activity.finish
```

Интервалы с окончаниями 3, 5, 9 и началами 1, 2, 6 дают первый и третий.
</details>

### Correctness and Optimization

<details>
<summary>How can you establish the correctness of a greedy algorithm?</summary>

### How can you establish the correctness of a greedy algorithm?

**Definition:**

Покажите, что первый локальный выбор может заменить то, что оптимальное решение сделало вместо него, и что остаток задачи решается тем же аргументом.

**How it works:**

- Обмен: берут оптимальное решение, которое отличается от жадного выбора. Подменяют жадный элемент. Показывают допустимость и то, что цель не стала хуже. Выбор занятий подменяет в первый слот интервал с самым ранним окончанием.
- Для минимального остовного дерева объект подмены — безопасное ребро: легчайшее ребро через некоторый разрез входит в некоторое MST. Kruskal и Prim добавляют только безопасные рёбра.
- После обмена удаляют этот выбор и повторяют на меньшей задаче. Индукция покрывает всю последовательность.
- Матроид — упакованная версия тех же двух лемм. Если обмен не находится, не утверждайте оптимальность. Измеряйте алгоритм как эвристику.
- «На примере сработало» — не аргумент. Один контрпример, например монеты `1, 3, 4` на сумму 6, убивает общее утверждение.

**Examples:**

Prim растит дерево `T`. Легчайшее ребро с одним концом в `T` безопасно. Если MST использует другое ребро через этот разрез, подменяют. Вес не растёт, и `T` остаётся ацикличным.
</details>

<details>
<summary>What is the role of sorting in many greedy algorithms, and why is it often necessary?</summary>

### What is the role of sorting in many greedy algorithms, and why is it often necessary?

**Definition:**

Сортировка превращает «лучший оставшийся элемент» в «следующий элемент в этом порядке», поэтому проход может фиксировать выбор за один раз.

**How it works:**

- Выбору занятий нужен порядок по окончанию. Kruskal нужен порядок по весу. Дробному рюкзаку нужен порядок по ценности на вес. Кратчайшей работе первой нужен порядок по длительности.
- Без этого порядка поиск лучшего подходящего элемента на каждом шаге может стоить линейного прохода каждый раз, или можно взять элемент, который не безопасен.
- Сортировку обычно делают один раз в начале. Некоторые алгоритмы сортируют только фронт — это то, что куча делает внутри Дейкстры и Prim.
- Если вход уже приходит упорядоченным, сортировка бесплатна и проход — весь алгоритм.
- Сортировка не создаёт свойство жадного выбора. Она только открывает порядок, в котором можно применить свойство, которое вы уже доказали.
- Сортировка Θ(n log n) часто доминирует. Поздний проход линеен.

**Examples:**

Предметы дробного рюкзака `(ценность, вес)` `(60, 10)`, `(100, 20)`, `(120, 30)`. Плотности `6`, `5` и `4`. Берут в этом порядке. Вместимость 50 берёт первые два целиком и `20/30` третьего.
</details>

<details>
<summary>Can greedy algorithms be used to solve optimization problems? Give an example.</summary>

### Can greedy algorithms be used to solve optimization problems? Give an example.

**Definition:**

Да, когда доказано, что локально лучший шаг входит в оптимальное решение. Выбор занятий — чистый пример: максимизировать число непересекающихся интервалов.

**How it works:**

- Сортируют по времени окончания. Берут первый интервал. Затем берут следующий, который начинается после этого окончания, и повторяют.
- Цель — число, не суммарная длина. Ограничение — выбранные интервалы не пересекаются.
- Доказательство обменом говорит, что оптимальное расписание можно переписать так, чтобы оно начиналось с жадного интервала, не уменьшив число.
- Время Θ(n log n) из сортировки, затем Θ(n) на проход. Список выхода в худшем случае Θ(n), когда ничего не пересекается.
- Жадный алгоритм — не универсальный оптимизатор. Те же интервалы, если цель — максимальная суммарная длина, могут предпочесть один длинный интервал двум коротким, которые взяло бы правило раннего окончания. Назовите цель, прежде чем утверждать, что алгоритм решает «ту самую» задачу оптимизации.

**Examples:**

Интервалы `[1, 4), [3, 5), [0, 6), [5, 7), [8, 9)`. Самое раннее окончание берёт `[1, 4)`, затем `[5, 7)`, затем `[8, 9)`. Три интервала. Длинный `[0, 6)` правильно пропущен.
</details>

### Greedy Algorithm Challenges

<details>
<summary>Solve the fractional knapsack problem using a greedy method.</summary>

### Solve the fractional knapsack problem using a greedy method.

**Definition:**

</details>

<details>
<summary>Implement a greedy algorithm to arrange a group of intervals by their start times to minimize the number of rooms needed.</summary>

### Implement a greedy algorithm to arrange a group of intervals by their start times to minimize the number of rooms needed.

**Definition:**

</details>

<details>
<summary>Design a method using greedy algorithms for minimizing the total number of platforms needed at a railway station.</summary>

### Design a method using greedy algorithms for minimizing the total number of platforms needed at a railway station.

**Definition:**

</details>

### Comparison and Analysis

<details>
<summary>Discuss situations where a greedy algorithm might not produce the optimal solution.</summary>

### Discuss situations where a greedy algorithm might not produce the optimal solution.

**Definition:**

</details>

<details>
<summary>Compare the efficiency of a greedy algorithm to a brute force approach for the traveling salesman problem.</summary>

### Compare the efficiency of a greedy algorithm to a brute force approach for the traveling salesman problem.

**Definition:**

</details>

<details>
<summary>What is the Huffman Coding algorithm, and is it considered a greedy algorithm?</summary>

### What is the Huffman Coding algorithm, and is it considered a greedy algorithm?

**Definition:**

</details>

### Real-World Applications

<details>
<summary>How do greedy algorithms apply to network routing protocols?</summary>

### How do greedy algorithms apply to network routing protocols?

**Definition:**

</details>

<details>
<summary>Explain how greedy algorithms can be used in load balancing and task scheduling in distributed systems.</summary>

### Explain how greedy algorithms can be used in load balancing and task scheduling in distributed systems.

**Definition:**

</details>

<details>
<summary>Describe an application of greedy algorithms in financial portfolio optimization.</summary>

### Describe an application of greedy algorithms in financial portfolio optimization.

**Definition:**

</details>

### Greedy Algorithm Techniques and Methods

<details>
<summary>Discuss the primality of cuts and how it pertains to greedy algorithms.</summary>

### Discuss the primality of cuts and how it pertains to greedy algorithms.

**Definition:**

</details>

<details>
<summary>Describe the ‘local ratio’ technique and its application to greedy algorithms.</summary>

### Describe the ‘local ratio’ technique and its application to greedy algorithms.

**Definition:**

</details>

<details>
<summary>What is the ‘exchange argument’ in the context of analyzing greedy algorithms?</summary>

### What is the ‘exchange argument’ in the context of analyzing greedy algorithms?

**Definition:**

</details>

### Limitations and Failures

<details>
<summary>Provide an example where a greedy algorithm fails to achieve the global optimum.</summary>

### Provide an example where a greedy algorithm fails to achieve the global optimum.

**Definition:**

</details>

<details>
<summary>Explain why greedy algorithms can be ineffective for the coin change problem with non-standard denominations.</summary>

### Explain why greedy algorithms can be ineffective for the coin change problem with non-standard denominations.

**Definition:**

</details>

<details>
<summary>Discuss the limitations of greedy algorithms when applied to graph coloring problems.</summary>

### Discuss the limitations of greedy algorithms when applied to graph coloring problems.

**Definition:**

</details>

### Optimization Problems

<details>
<summary>Solve the problem of finding the largest number possible from a list of numbers using a greedy approach.</summary>

### Solve the problem of finding the largest number possible from a list of numbers using a greedy approach.

**Definition:**

</details>

<details>
<summary>Implement a greedy solution for the job sequencing problem with deadlines to maximize profit.</summary>

### Implement a greedy solution for the job sequencing problem with deadlines to maximize profit.

**Definition:**

</details>

<details>
<summary>Use greedy algorithm to solve the ‘Minimum Number of Arrows to Burst Balloons’ problem.</summary>

### Use greedy algorithm to solve the ‘Minimum Number of Arrows to Burst Balloons’ problem.

**Definition:**

</details>

### Complex Greedy Strategy Implementations

<details>
<summary>How would you optimize a network’s bandwidth allocation using a greedy strategy?</summary>

### How would you optimize a network’s bandwidth allocation using a greedy strategy?

**Definition:**

</details>

<details>
<summary>Write a greedy solution for compressing data using a variable-length encoding scheme.</summary>

### Write a greedy solution for compressing data using a variable-length encoding scheme.

**Definition:**

</details>

<details>
<summary>Implement a greedy strategy to construct the minimum spanning tree of a graph.</summary>

### Implement a greedy strategy to construct the minimum spanning tree of a graph.

**Definition:**

</details>

### Advanced Theoretical Concepts

<details>
<summary>What is a matroid, and how do greedy algorithms relate to matroid theory?</summary>

### What is a matroid, and how do greedy algorithms relate to matroid theory?

**Definition:**

</details>

<details>
<summary>Explain the relationship between greedy algorithms and the concept of safe moves.</summary>

### Explain the relationship between greedy algorithms and the concept of safe moves.

**Definition:**

</details>

<details>
<summary>Discuss how approximation algorithms use greedy strategies to find near-optimal solutions.</summary>

### Discuss how approximation algorithms use greedy strategies to find near-optimal solutions.

**Definition:**

</details>

### Greedy Algorithms in Competitive Programming

<details>
<summary>Design a greedy algorithm to solve the ‘Gas Station’ problem commonly seen in competitive programming contests.</summary>

### Design a greedy algorithm to solve the ‘Gas Station’ problem commonly seen in competitive programming contests.

**Definition:**

</details>

<details>
<summary>Solve the ‘Majority Element’ problem under the constraints of using a single pass algorithm and constant additional space.</summary>

### Solve the ‘Majority Element’ problem under the constraints of using a single pass algorithm and constant additional space.

**Definition:**

</details>
