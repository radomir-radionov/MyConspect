# Big-O Notation — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./7_special_algorithms.md)

### Related docs

- [Big-O Notation — собеседование](./7_algo_big_o_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Big-O Notation](https://devinterview.io/questions/data-structures-and-algorithms/big-o-notation-interview-questions/).

### Fundamental Concepts of Big-O Notation

<details>
<summary>What is Big-O Notation?</summary>

### What is Big-O Notation?

**Definition:**

Big-O — асимптотическая верхняя оценка того, как стоимость, обычно время или память, растёт с размером входа. Это инструмент сравнения алгоритмов, когда `n` велико.

**How it works:**

- Константы и меньшие члены отбрасывают, оставляют доминирующий. `3n² + 10n` — это O(n²).
- Оценка про тренд при росте `n`, а не про точное число операций на одной машине.
- В разговоре об алгоритмах Big-O — потолок. Сказать, что алгоритм O(n²), значит обещать, что после некоторого n₀ он не растёт быстрее, чем константа на n².
- Обычные классы от медленного роста к быстрому: O(1) доступ по индексу или фиксированный буфер; O(log n) двоичный поиск; O(n) проход или массив пропорциональный входу; O(n log n) merge sort; O(n²) простой вложенный цикл вроде bubble sort или матрица n на n; O(2ⁿ) перечисление всех подмножеств.
- У одного алгоритма есть лучший, средний и худший вход. Линейный поиск — O(1), если цель первая, и O(n), если она последняя или её нет. Среднее, когда каждый слот равновероятен, всё ещё Θ(n).
- По оценке планируют память, ставят потолок задержки и видят, какой цикл — узкое место.

**Examples:**

Проход по 1 000 элементов и по 1 000 000 отличается примерно в 1 000 раз, если проход линейный. Двоичный поиск на том же росте — это несколько лишних сравнений.
</details>

<details>
<summary>Explain the difference between Big-O, Big-Theta, and Big-Omega notations.</summary>

### Explain the difference between Big-O, Big-Theta, and Big-Omega notations.

**Definition:**

Big-O, Big-Theta и Big-Omega — три способа зажать функцию стоимости. Это не три имени худшего случая.

**How it works:**

- O(g) — верхняя оценка: после некоторого n₀ `f(n)` не больше `k · g(n)`. Алгоритм O(n²) не растёт быстрее квадрата, с точностью до константы. Он всё ещё может быть линейным.
- Ω(g) — нижняя оценка: `f(n)` не меньше `k · g(n)`. Она говорит, что стоимость не может расти медленнее g. Это не автоматически вход лучшего случая.
- Θ(g) — обе стороны: `k1 · g(n) ≤ f(n) ≤ k2 · g(n)`. Сравнения merge sort — Θ(n log n) на любом входе, оценка плотная.
- Один алгоритм может носить разные символы на разных входах. Адаптивный insertion sort всегда O(n²), на упорядоченном входе Ω(n), а при подсчёте инверсий Θ(n + k).
- Θ используют, когда рост совпал. O и Ω — когда известна только одна сторона, что обычно для адаптивных сортировок и для лучшего против худшего входа.

**Examples:**

Сравнения двоичного поиска в худшем случае — Θ(log n): можно заставить сделать около log₂ n проб, и больше не нужно. Сказать только O(n) было бы верно и гораздо слишком свободно.
</details>

<details>
<summary>Describe the role of constants and lower-order terms in Big-O analysis.</summary>

### Describe the role of constants and lower-order terms in Big-O analysis.

**Definition:**

Константы и члены меньшего порядка описывают точный ведущий многочлен, а затем исчезают из класса Big-O, потому что не меняют порядок роста.

**How it works:**

- Константный множитель — фиксированное число операций на шаг. `7n²` и `n²` оба O(n²). При большом n семёрка меняет наклон, а не класс.
- Член меньшего порядка растёт строго медленнее. В `3n³ + 100n² + 25n` член n³ обгоняет остальные, поэтому класс O(n³).
- «Малое o» — более строгий родственник: член есть o(g), когда он становится пренебрежимо мал рядом с g. Член n² — это o(n³). Big-O говорит только «не быстрее».
- Их отбрасывают, поэтому две реализации одного класса всё ещё могут ощущаться по-разному на том n, который вы реально гоняете. Асимптотический класс — сравнение после того, как эта разница перестаёт иметь значение.

**Examples:**

`7n²` против `n³`. При n = 10 первое может быть дешевле. После скромного n куб выигрывает гонку независимо от ведущей семёрки.
</details>

<details>
<summary>Give examples of how amortized analysis can provide a more balanced complexity measure.</summary>

### Give examples of how amortized analysis can provide a more balanced complexity measure.

**Definition:**

Амортизированный анализ усредняет стоимость последовательности операций. Одна из них может быть дорогой, но она достаточно редка, чтобы среднее на операцию оставалось малым.

**How it works:**

- Динамический массив удваивается, когда заполнен. Удвоение копирует n элементов и стоит O(n). Вставки между удвоениями — O(1). На n вставок копии суммируются меньше чем в 2n, поэтому средняя вставка — O(1).
- Это не обещание худшего случая для одной вставки. Следующая вставка всё ещё может быть той, что копирует.
- Рост хеш-таблицы — та же история: перехеширование линейно, и его раскладывают на вставки, которые заполнили старую таблицу.
- Двоичный поиск — плохая иллюстрация амортизации. Каждый поиск уже O(log n) в худшем случае; внутри более дешёвого среднего не прячется редкий дорогой поиск.
- Кэшированный Фибоначчи — мемоизация, не амортизация. Первое вычисление каждого индекса платится один раз и превращает экспоненциальную рекуррентность в Θ(n). Повторные запросы — это поиск O(1). Учёт «каждое состояние один раз» родствен по духу и является другой теоремой.

**Examples:**

```text
insert в удваивающийся массив:
  if full: выделить 2× и скопировать  # O(n), на размерах 1, 2, 4, ...
  записать один слот                   # O(1)
```

n вставок копируют `1+2+4+…+n` элементов, это меньше `2n`.
</details>

<details>
<summary>Describe how the coefficients of higher-order terms affect Big-O Notation in practical scenarios.</summary>

### Describe how the coefficients of higher-order terms affect Big-O Notation in practical scenarios.

**Definition:**

Ведущий коэффициент меняет наклон внутри класса Big-O. Класс он не меняет, и он значит меньше, как только в гонке есть член более высокого порядка.

**How it works:**

- Один класс, маленький n: `3n + 500` может проиграть `6n + 10`, потому что прибавка 500 доминирует, пока n крошечное. Big-O называет оба O(n).
- Один класс, большой n: `0.05n` всё ещё делает около половины работы `0.1n`. Отношение коэффициентов остаётся видимым; оно просто не растёт с n.
- Квадрат с крошечным коэффициентом: `0.00001 n²` и `0.0001 n²` оба O(n²). При большом n член n² забивает прибавленные константы, и больший коэффициент медленнее примерно на этот постоянный множитель.
- Больший коэффициент при той же степени (`10n²` против `2n²`) меняет постоянный множитель при любом n. В другой асимптотический класс алгоритм он не переводит.
- Поэтому линейный проход, записанный как `4n + 2`, всё ещё называют O(n), и поэтому `4n` против `0.5n` — это всё ещё разрыв в 8 раз, который можно измерить на большом массиве.

**Examples:**

При n = 20 `3n + 500` равно 560, а `6n + 10` равно 130, так что «меньший» коэффициент медленнее. При n = 10 000 первое примерно вдвое меньше второго.
</details>

<details>
<summary>Explain how probabilistic algorithms can have a different Big-O Notation compared to deterministic ones.</summary>

### Explain how probabilistic algorithms can have a different Big-O Notation compared to deterministic ones.

**Definition:**

Детерминированная оценка покрывает каждый вход. Вероятностной оценке разрешено ошибиться с малой вероятностью или назвать ожидаемую стоимость по своим случайным выборам, поэтому выражение может быть плотнее.

**How it works:**

- Ожидаемые сравнения рандомизированного quicksort — Θ(n log n) для любого входа. Детерминированная опора «первый элемент» — Θ(n²) на упорядоченном массиве. Случайная версия не меняет потолок худшего случая; она переносит этот потолок на маловероятный набор последовательностей опор.
- Алгоритмы Монте-Карло могут вернуть неверный ответ с вероятностью, которую можно снизить повторами. Время остаётся стоимостью одного испытания, умноженной на число испытаний, а не стоимостью доказательства, которое работает на каждом входе.
- Алгоритмы Лас-Вегаса всегда возвращают верный ответ, и случайная величина — время работы. Цифра, которую называют, — это ожидание.
- Достижимость в графе имеет детерминированные DFS или BFS за Θ(V + E). Случайное блуждание можно разобрать как ожидание, которое на одних графах кончает рано, а на других имеет тяжёлый хвост. Ожидание не заменяет худший случай Θ(V + E), пока вы не ограничили и этот хвост.
- Читайте квантор. «Ожидаемое O(n log n)» и «O(n log n) с высокой вероятностью» — другие утверждения, чем «O(n log n) на каждом входе».

**Examples:**

Перемешайте массив, затем quicksort с фиксированной опорой. Ожидание по перемешиваниям — Θ(n log n). Одно неудачное перемешивание всё ещё может дать квадратичный рисунок опор.
</details>

### Big-O in Common Data Structures and Algorithms

<details>
<summary>Analyze the Big-O time complexity of array operations.</summary>

### Analyze the Big-O time complexity of array operations.

**Definition:**

Непрерывный массив даёт индексацию O(1), потому что адрес — это `base + i * width`. Почти всё, что сдвигает элементы, линейно.

**How it works:**

- Чтение или запись по индексу: Θ(1).
- Поиск в неупорядоченном массиве: Θ(n) в худшем случае. Упорядоченный массив может использовать двоичный поиск, Θ(log n).
- Вставка или удаление по произвольному индексу: Θ(n), потому что поздние элементы двигаются. Добавление в конец динамического массива — амортизированное Θ(1) и иногда Θ(n) при росте.
- Сортировка массива — отдельный алгоритм: mergesort всегда Θ(n log n), quicksort в среднем Θ(n log n) и в худшем Θ(n²).
- Обмен двух соседних слотов — Θ(1). Это не стоимость транспонирования матрицы n на n, которое трогает Θ(n²) ячеек.
- Слияние двух упорядоченных массивов в один упорядоченный — Θ(n + m) двумя указателями.

**Examples:**

`a[i] = 7` — запись за константу. Вставка по индексу 0 в массив длины n копирует каждый поздний элемент на слот вправо.
</details>

<details>
<summary>Discuss the Big-O space complexity of using linked lists.</summary>

### Discuss the Big-O space complexity of using linked lists.

**Definition:**

Связный список из n узлов — это Θ(n) памяти. Константа на узел — полезная нагрузка плюс один или два указателя, и именно эту константу меняют варианты.

**How it works:**

- Узел односвязного списка хранит значение и один указатель `next`. Указатель — слово, часто 8 байт на 64-битной машине, и их n, поэтому память под указатели — Θ(n), не Θ(1).
- Узел двусвязного списка хранит `next` и `prev`. Узлов всё ещё Θ(n), байт под указатели примерно вдвое больше.
- Кольцевой список замыкает хвост на голову. Одна лишняя связь класс не меняет.
- XOR-список упаковывает `prev` и `next` в одно слово через XOR. Узлов всё ещё Θ(n), константа меньше, и код должен восстановить второй указатель из адреса, откуда пришли.
- Дополнительный указатель на узел, например прыжок, поднимает байты на узел и остаётся Θ(n), пока число лишних указателей само не растёт с n.

**Examples:**

Миллион 8-байтовых целых в односвязном списке хранит ещё около миллиона 8-байтовых указателей. Те же целые в массиве не хранят указатель на элемент.
</details>

<details>
<summary>Compare the Big-O complexities of various sorting algorithms.</summary>

### Compare the Big-O complexities of various sorting algorithms.

**Definition:**

Сортировки сравнением в худшем случае сидят на Ω(n log n). Квадратичные проще. Сортировки без сравнений могут быть линейными, когда формат ключа это позволяет.

**How it works:**

- Bubble sort: Θ(n) в лучшем случае с флагом раннего выхода, Θ(n²) в худшем и среднем.
- Selection sort: Θ(n²) на любом входе, потому что сканируется каждый суффикс.
- Insertion sort: Θ(n), когда массив упорядочен, Θ(n²), когда он обратный.
- Merge sort: время Θ(n log n) всегда, дополнительная память Θ(n).
- Quicksort: Θ(n log n) в среднем и лучшем, когда опоры делят поровну, Θ(n²), когда опора всегда крайняя.
- Heapsort: Θ(n log n) в лучшем и худшем. Построение кучи — Θ(n), каждое из n извлечений — O(log n).
- Counting sort: время и дополнительная память Θ(n + k) для целых в диапазоне размера k.
- Radix sort: Θ(d (n + k)) для d цифр и алфавита цифры k. Оценка следит за цифрами, а не за деревом сравнений.
- Bucket sort: ожидаемое Θ(n + k) на равномерных ключах по k блокам и Θ(n²), если все ключи попали в один блок и он сортируется квадратично.
- Shell sort: оценка зависит от последовательности шагов. Обычные последовательности около O(n log² n) или хуже; одного худшего случая, не зависящего от шагов, нет.

**Examples:**

Миллион случайных целых: quicksort, mergesort или heapsort. Миллион целых в `0..1000`: линейный вариант — counting sort.
</details>

<details>
<summary>Evaluate the Big-O time complexity of binary search.</summary>

### Evaluate the Big-O time complexity of binary search.

**Definition:**

Двоичный поиск находит ключ в упорядоченном массиве с произвольным доступом, каждый раз отбрасывая половину оставшегося диапазона. Число проб в худшем случае — Θ(log n).

**How it works:**

- Каждый шаг делает константную работу и заменяет n примерно на n/2. Рекуррентность `T(n) = T(n/2) + Θ(1)` даёт Θ(log n).
- После k делений пополам `n / 2^k` равно 1, поэтому `k = log₂ n`. Это и верхняя, и нижняя оценка для неуспешного поиска.
- Он обгоняет линейный проход Θ(n), когда массив достаточно длинный и предусловие «уже упорядочен» оплачено.
- Итеративная форма использует Θ(1) дополнительной памяти. Рекурсивная — Θ(log n) кадров стека. Устранение хвостового вызова может схлопнуть этот стек, и не каждый компилятор это делает.
- Массив уже должен быть упорядочен, а средний элемент достижим за O(1). У связного списка та же логика деления пополам пропадает, потому что дойти до середины уже Θ(n).

**Examples:**

```text
lo, hi = 0, n - 1
while lo <= hi:
  mid = lo + (hi - lo) // 2
  if a[mid] == target: return mid
  if a[mid] < target: lo = mid + 1
  else: hi = mid - 1
```

На 1 000 000 упорядоченных ключей тело цикла выполняется не больше чем около 20 раз.
</details>

<details>
<summary>Determine the Big-O time and space complexities of hash table operations.</summary>

### Determine the Big-O time and space complexities of hash table operations.

**Definition:**

Хеш-таблица отображает ключ через хеш-функцию в слот. При хорошем хеше и ограниченном коэффициенте заполнения вставка, поиск и удаление ожидаемо O(1). Худший случай линейный.

**How it works:**

- Поиск хеширует ключ и смотрит этот слот или цепочку либо последовательность проб, которая там начинается. Ожидаемое время O(1), пока цепочки короткие.
- Вставка и удаление — те же ожидаемые O(1), плюс редкое изменение размера.
- Изменение размера выделяет большую таблицу и вставляет каждый ключ заново. Одно изменение — Θ(n). На растущей таблице это амортизированное O(1) на вставку, по тому же аргументу раскладки, что и удваивающийся массив.
- Если все ключи столкнулись в одну цепочку, поиск, вставка и удаление — Θ(n).
- Память Θ(n) на n хранимых ключей плюс пустые слоты, которые держат коэффициент заполнения низким. Пустые слоты меняют константу, а не тот факт, что память следит за числом ключей.

**Examples:**

Таблица из 1 000 ключей при коэффициенте 0,5 имеет около 2 000 слотов. Попадание считает один хеш и идёт по короткой цепочке. Рост до 4 000 слотов один раз переписывает все 1 000 ключей.
</details>

<details>
<summary>Discuss the Big-O complexities of tree operations, including binary search trees and AVL trees.</summary>

### Discuss the Big-O complexities of tree operations, including binary search trees and AVL trees.

**Definition:**

Двоичное дерево поиска стоит O(h) на поиск, вставку и удаление, где h — высота. AVL-дерево держит h на Θ(log n), поэтому эти операции остаются Θ(log n) в худшем случае.

**How it works:**

- В BST каждое сравнение уходит в левого или правого ребёнка. Сбалансированное дерево отбрасывает около половины узлов, это Θ(log n). Палка из n узлов — связный список, и те же операции — Θ(n).
- Лучший поиск — Θ(1) только когда цель — корень. Под это оценку не проектируют.
- Вставка идёт по тому же пути и подвешивает новый лист. В AVL-дереве обратный подъём может вращать.
- Одиночный поворот чинит узел, который стал перекошен влево или вправо по прямой. Двойной поворот (лево-право или право-лево) чинит зигзаг. Каждый поворот перевязывает константное число указателей, поэтому это O(1) сверху прохода O(log n).
- Поиск, вставка и удаление в AVL поэтому Θ(log n) в худшем случае. Дерево хранит в каждом узле фактор баланса или высоту — это Θ(n) дополнительных полей сверху ключей.

**Examples:**

Вставка упорядоченных ключей `1, 2, 3, 4` в обычное BST строит правый хребет. Те же вставки в AVL-дерево вращают его и оставляют короткое дерево высоты 2.
</details>

<details>
<summary>Analyze the Big-O complexity of graph algorithms, including traversal and shortest path algorithms.</summary>

### Analyze the Big-O complexity of graph algorithms, including traversal and shortest path algorithms.

**Definition:**

Оценки графов пишут через вершины V и рёбра E. Обход смотрит каждую вершину и каждое ребро константное число раз. Кратчайшие пути доплачивают за очередь с приоритетом или за ещё один вложенный цикл.

**How it works:**

- DFS и BFS — Θ(V + E) времени на списке смежности. DFS в худшем случае занимает Θ(V) стека. BFS занимает Θ(V) очереди, и широкий уровень может её заполнить.
- Дейкстра с двоичной кучей — Θ((V + E) log V) на неотрицательных весах и Θ(V) дополнительной памяти на расстояния и очередь. Куча Фибоначчи улучшает учебную оценку; двоичная куча — обычная реализация.
- Беллман-Форд ослабляет каждое ребро по разу на вершину: время Θ(V E) и память Θ(V). Последний проход ловит отрицательный цикл. Это алгоритм, когда веса могут быть отрицательными.
- Флойд-Уоршелл — DP всех пар: время Θ(V³) и память Θ(V²) на матрицу расстояний.
- A* с согласованной эвристикой — это направляемая Дейкстра. Плохая эвристика может раскрыть гораздо больше, чем фронт кратчайшего пути; общей оценки O(log V) нет.
- Алгоритм Джонсона перевзвешивает одним Беллманом-Фордом, затем запускает Дейкстру из каждой вершины. Обычная оценка — Θ(V E + V² log V) с двоичной кучей, и она привлекательна на редких графах.

**Examples:**

Дорожный граф с 1 000 000 вершин и несколькими рёбрами у каждой — редкий: Дейкстра или A* из одного источника. Матрица расстояний на 400 вершин достаточно мала, чтобы V³ Флойда-Уоршелла было приемлемо.
</details>

<details>
<summary>Discuss time and space complexities of various heap operations.</summary>

### Discuss time and space complexities of various heap operations.

**Definition:**

Двоичная куча — полное двоичное дерево в массиве. Форма делает индексы родителя и детей O(1), а свойство кучи делает чтение крайнего элемента O(1) и удаление O(log n).

**How it works:**

- Родитель индекса `i` — `⌊(i−1)/2⌋`. Дети — `2i+1` и `2i+2` в массиве с нуля.
- Вставка кладёт ключ в конец и поднимает его. Это O(log n) обменов и O(1) дополнительной памяти.
- Удаление минимума (или максимума) переносит последний ключ в корень и опускает его. Время O(log n), дополнительная память O(1).
- Чтение минимума или максимума — O(1): он сидит в индексе 0. Дополнительной памяти нет.
- Построение кучи из n неупорядоченных ключей — Θ(n), это плотнее, чем n отдельных вставок. Heapsort затем делает n извлечений и стоит Θ(n log n).
- Сам массив — Θ(n). Просеивание обычно пишут циклом, поэтому лишний стек — O(1), а не O(log n), если не рекурсировать.

**Examples:**

```text
sift_up(i):
  while i > 0 and a[i] < a[parent(i)]:
    swap a[i] with a[parent(i)]
    i = parent(i)
```

Куча из миллиона ключей просеивает не больше чем около 20 уровней.
</details>

### Practical Application and Analysis

<details>
<summary>Provide examples of space-time tradeoffs in algorithm design.</summary>

### Provide examples of space-time tradeoffs in algorithm design.

**Definition:**

Компромисс времени и памяти тратит память, чтобы не повторять работу, или тратит время, чтобы не хранить промежуточный результат. Оба даром получают редко.

**How it works:**

- Индекс отображает слово в документы, которые его содержат. Запросы становятся поиском, а не проходом. Индекс — дополнительная память, на диске или в RAM.
- База, которая держит этот индекс на диске, платит хранилищем, чтобы не строить индекс заново на каждый запрос.
- Сжатие тратит CPU, чтобы уменьшить байты. Быстрый слабый компрессор экономит время и оставляет файл больше. Кодирование Хаффмана тратит проход по частотам и дерево, чтобы частые символы занимали меньше бит.
- Мемоизация — алгоритмическая форма той же сделки: кэш Фибоначчи — это Θ(n) памяти и превращает экспоненциальную рекурсию в линейное время.
- Обратное тоже встречается: пересчитать маленькое значение вместо таблицы держит рабочий набор в кэше, и это может быть быстрее, хотя число операций растёт.

**Examples:**

Несжатый текст хранит символ. Код Хаффмана хранит короткую битовую строку для `e` и более длинную для `q`, плюс дерево, без которого не декодировать.
</details>

<details>
<summary>Compare the complexities of recursive and iterative solutions to the same problem.</summary>

### Compare the complexities of recursive and iterative solutions to the same problem.

**Definition:**

</details>

<details>
<summary>Discuss Big-O implications when scaling applications horizontally versus vertically.</summary>

### Discuss Big-O implications when scaling applications horizontally versus vertically.

**Definition:**

</details>

<details>
<summary>Analyze the Big-O of database indexing and query retrieval.</summary>

### Analyze the Big-O of database indexing and query retrieval.

**Definition:**

</details>

<details>
<summary>Evaluate how caching layers influence the Big-O performance of a system.</summary>

### Evaluate how caching layers influence the Big-O performance of a system.

**Definition:**

</details>

### Coding Challenges

<details>
<summary>Calculate the Big-O Notation for a given recursive algorithm.</summary>

### Calculate the Big-O Notation for a given recursive algorithm.

**Definition:**

</details>

<details>
<summary>Implement a binary search algorithm and analyze its time complexity.</summary>

### Implement a binary search algorithm and analyze its time complexity.

**Definition:**

</details>

<details>
<summary>Optimize a nested loop algorithm to achieve a better Big-O time complexity.</summary>

### Optimize a nested loop algorithm to achieve a better Big-O time complexity.

**Definition:**

</details>

<details>
<summary>Create a divide and conquer algorithm and explain its complexity.</summary>

### Create a divide and conquer algorithm and explain its complexity.

**Definition:**

</details>

<details>
<summary>Implement a dynamic programming solution and discuss its Big-O time complexity.</summary>

### Implement a dynamic programming solution and discuss its Big-O time complexity.

**Definition:**

</details>

<details>
<summary>Refactor a recursive algorithm to use memoization and analyze the complexity change.</summary>

### Refactor a recursive algorithm to use memoization and analyze the complexity change.

**Definition:**

</details>

<details>
<summary>Develop efficient multi-threaded algorithms and evaluate their Big-O complexity.</summary>

### Develop efficient multi-threaded algorithms and evaluate their Big-O complexity.

**Definition:**

</details>

### Big-O Notation in Advanced Topics

<details>
<summary>How does data structure choice affect the Big-O complexity of an algorithm?</summary>

### How does data structure choice affect the Big-O complexity of an algorithm?

**Definition:**

</details>

<details>
<summary>Analyze the Big-O complexity of algorithms in a distributed system.</summary>

### Analyze the Big-O complexity of algorithms in a distributed system.

**Definition:**

</details>

<details>
<summary>Explore the Big-O complexity in the context of concurrent and parallel computing.</summary>

### Explore the Big-O complexity in the context of concurrent and parallel computing.

**Definition:**

</details>

<details>
<summary>Discuss the relevance of Big-O Notation in machine learning algorithms.</summary>

### Discuss the relevance of Big-O Notation in machine learning algorithms.

**Definition:**

</details>
