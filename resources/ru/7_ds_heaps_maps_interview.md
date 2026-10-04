# Heaps and Maps — собеседование

Ответы заполнены для опубликованной части, остальные пустые.
[← К обзору](./7_special_data_structures.md)

### Related docs

- [Heaps and Maps — собеседование](./7_ds_heaps_maps_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Heaps And Maps](https://devinterview.io/questions/data-structures-and-algorithms/heap-and-map-data-structures-interview-questions/).

### Basic Heap Concepts

<details>
<summary>What is a Heap?</summary>

### What is a Heap?

**Definition:**

Двоичная куча — полное двоичное дерево, уложенное так, что каждый родитель упорядочен относительно детей. Крайнее значение сидит в корне.

**How it works:**

- В мин-куче каждый родитель меньше или равен детям. В макс-куче каждый родитель больше или равен детям.
- Дерево полное, поэтому оно упаковывается в массив: дети индекса `i` — `2i + 1` и `2i + 2`, если индексы с нуля.
- Вставка и удаление края — O(log n). Чтение края — O(1). Поиск произвольного значения — O(n).
- Порядок кучи — не полная сортировка. Массив не отсортирован слева направо.

**Examples:**

Массив мин-кучи `[1, 3, 2]`: 1 — корень, 3 — левый ребёнок, 2 — правый.
</details>

<details>
<summary>What is a Priority Queue?</summary>

### What is a Priority Queue?

**Definition:**

Очередь с приоритетом достаёт следующим элемент с лучшим ключом, а не тот, который пришёл первым.

**How it works:**

- Обычные операции — вставка и extract-min или extract-max. Двоичная куча делает обе за O(log n).
- Отсортированный массив делает extract за O(1) и вставку за O(n). Неотсортированный массив делает вставку за O(1) и extract за O(n).
- Дейкстра, A*, кодирование Хаффмана и планировщики используют её, чтобы всегда раскрывать текущий лучший.
- Устойчивый порядок равных ключей не входит в контракт кучи. Если среди равных важен порядок прибытия, храните в ключе счётчик.
</details>

<details>
<summary>How does the Binary Heap property differ between a max heap and a min heap?</summary>

### How does the Binary Heap property differ between a max heap and a min heap?

**Definition:**

Форма — то же полное дерево. Меняется только сравнение у каждого родителя.

**How it works:**

- Макс-куча: `родитель ≥ левый` и `родитель ≥ правый`. Наибольшее значение в индексе 0.
- Мин-куча: `родитель ≤ левый` и `родитель ≤ правый`. Наименьшее значение в индексе 0.
- Дети одного родителя между собой не упорядочены. `[1, 4, 2]` и `[1, 2, 4]` обе могут быть мин-кучами.
- Макс-куча — это мин-куча от отрицательных ключей. Так одна реализация обслуживает обе.
</details>

<details>
<summary>Can you explain heap property maintenance after an Insert operation and a Delete operation?</summary>

### Can you explain heap property maintenance after an Insert operation and a Delete operation?

**Definition:**

Вставка просеивает новый элемент вверх. Удаление края ставит последний элемент в корень и просеивает его вниз.

**How it works:**

- Вставка пишет элемент в следующий свободный индекс, это следующий лист полного дерева. Пока он лучше родителя, их меняют. Это O(log n) обменов.
- Delete-min или delete-max читает корень, переносит последний лист в корень, уменьшает размер и просеивает вниз: обмен с лучшим ребёнком, пока порядок не выполнится.
- Просеивание вверх и вниз идёт по одному пути. Они не перестраивают всё дерево.
- После любой из операций дерево всё ещё полное, и каждый родитель соблюдает порядок кучи.

**Examples:**

Мин-куча `[1, 3, 2]`, вставка 0. Массив становится `[1, 3, 2, 0]`, затем 0 меняется с 3 и потом с 1 и заканчивает как `[0, 1, 2, 3]`.
</details>

<details>
<summary>Insert an item into the Heap. Explain your actions.</summary>

### Insert an item into the Heap. Explain your actions.

**Definition:**

Дописывают элемент последним листом, затем меняют его с родителем вверх, пока он нарушает порядок.

**How it works:**

- Родитель индекса `i` — `(i - 1) // 2` для массивов с нуля.
- Стоп, когда элемент стал корнем или больше не лучше родителя.
- Каждый обмен восстанавливает порядок на этом ребре и может сломать ребро выше, которое чинит следующий обмен.
- С братьями элемент не сравнивается. Важна только цепочка предков.

**Examples:**

Макс-куча `[9, 5, 6]`, вставка 8. Кладём 8 в индекс 3. Родитель с индексом 1 хранит 5, и 8 > 5, обмен даёт `[9, 8, 6, 5]`. Родитель индекса 1 — это 9, и 8 ≤ 9, стоп.
</details>

### Heaps Implementation and Optimization

<details>
<summary>Compare Heaps-Based vs. Arrays-Based priority queue implementations.</summary>

### Compare Heaps-Based vs. Arrays-Based priority queue implementations.

**Definition:**

Куча держит вставку и извлечение логарифмическими. Массив делает одну из этих двух операций линейной.

**How it works:**

- Неотсортированный массив: вставка в конец O(1), извлечение ищет край и сдвигает, O(n).
- Отсортированный массив: извлечение с конца O(1), вставка двоично ищет и затем сдвигает, O(n).
- Двоичная куча: обе операции O(log n), и край всегда в индексе 0.
- Неотсортированный массив годится только для крошечной очереди. Куча — когда обе операции частые, как в обычном алгоритме на графе.
</details>

<details>
<summary>How can you implement a heap efficiently using Dynamic Arrays?</summary>

### How can you implement a heap efficiently using Dynamic Arrays?

**Definition:**

Полная форма кучи — это в точности префикс динамического массива. Массив растят, когда следующий лист не влезает.

**How it works:**

- Арифметика индексов заменяет указатели. Нет выделения на узел, и братья сидят в памяти рядом.
- Дописывание — первый шаг вставки. Удвоение держит серию вставок амортизированно O(1) до просеивания O(log n).
- Удаление края меняет корень с последним индексом и делает `pop` массива, это O(1) в конце, затем просеивание вниз.
- Сжатие ёмкости после многих удалений необязательно. Запас ёмкости избегает цикла рост-сжатие.
</details>

<details>
<summary>Name some ways to implement Priority Queue.</summary>

### Name some ways to implement Priority Queue.

**Definition:**

Любая структура, которая умеет вставить элемент и позже снять лучший, — очередь с приоритетом. Куча — выбор по умолчанию.

**How it works:**

- Двоичная куча на массиве: вставка и извлечение O(log n).
- Неотсортированный или отсортированный массив, или связный список: одна из двух операций O(n).
- Сбалансированное BST упорядочивает каждый ключ, поэтому extract-min — O(log n), и поиск тоже есть. Константы и указатели тяжелее, чем у кучи.
- Куча Фибоначчи дешевле теоретически на decrease-key. На практике библиотеки поставляют двоичную кучу.
</details>

<details>
<summary>How does the Lazy deletion technique work in a heap and what is its purpose?</summary>

### How does the Lazy deletion technique work in a heap and what is its purpose?

**Definition:**

Ленивое удаление помечает элемент мёртвым и оставляет его на месте, пока он не всплывёт в корень, вместо того чтобы сейчас искать его в массиве.

**How it works:**

- Прямое удаление произвольного индекса возможно за O(log n), если индекс уже известен. Найти индекс — O(n), если нет боковой карты.
- Со множеством удалённых extract пропускает корень с пометкой и просеивает замену, пока корень не станет живым.
- Вставка «новой версии» ключа может оставить старую помеченной. Decrease-key в Дейкстре часто делают так: кладут лучшую пару и игнорируют устаревшую, когда она выходит.
- Куча может держать мёртвые записи, поэтому размер для сложности — число push, а не число живых элементов, пока перестройка не выкинет мёртвые.
</details>

<details>
<summary>Explain Heapify and where it is used in heap operations.</summary>

### Explain Heapify and where it is used in heap operations.

**Definition:**

Heapify восстанавливает порядок кучи в одном поддереве, считая, что дети уже кучи. Построение кучи вызывает его снизу вверх.

**How it works:**

- Просеивание вниз в индексе `i` сравнивает узел с детьми и меняет его с крайним ребёнком, затем повторяет.
- Построение Флойда начинает с последнего родителя, индекс `n // 2 - 1`, и просеивает вниз до корня. Сумма — O(n), не O(n log n), потому что большинство узлов у листьев.
- Вставка использует просеивание вверх, это другое направление. Удаление края использует просеивание вниз от корня, то есть heapify на всём дереве.
- Цикл heapsort — это extract плюс heapify на сжимающемся префиксе.
</details>

### Heaps Sorting and Algorithms

<details>
<summary>What is Heap Sort?</summary>

### What is Heap Sort?

**Definition:**

Heapsort строит макс-кучу и затем раз за разом меняет корень с последним неотсортированным индексом и просеивает новый корень вниз.

**How it works:**

- После построения наибольший элемент в индексе 0. Меняют его с концом, уменьшают кучу на один и просеивают вниз. Конец массива заполняется отсортированными элементами.
- Время O(n log n) в любом случае. Дополнительная память O(1) сверх входного массива.
- Сортировка не устойчива. Равные ключи могут переставиться.
- Внутренний цикл прыгает по массиву, поэтому она часто медленнее хорошо настроенной quicksort, хотя худший случай лучше.

**Examples:**

`[3, 1, 2]` становится макс-кучей `[3, 1, 2]`, 3 меняется с концом, просеивается `[2, 1]`, меняется 2, и массив — `[1, 2, 3]`.
</details>

<details>
<summary>How does Heap Sort compare to Quick Sort in terms of speed and memory usage?</summary>

### How does Heap Sort compare to Quick Sort in terms of speed and memory usage?

**Definition:**

Heapsort гарантирует время O(n log n) и дополнительную память O(1). Quicksort обычно быстрее и использует стек O(log n), с худшим случаем O(n²), если опоры плохие.

**How it works:**

- Разбиение quicksort сканирует диапазон последовательно, что совпадает с кэшем. Просеивание heapsort прыгает от родителя к ребёнку.
- Introsort начинает как quicksort и переключается на heapsort, когда рекурсия слишком глубока. Так несколько стандартных библиотек получают и скорость, и границу худшего случая.
- Mergesort устойчива и тоже O(n log n), и ей нужен буфер O(n). Heapsort — нет.
- Heapsort выбирают, когда нужна жёсткая граница времени и нет лишнего буфера, а устойчивость не важна.
</details>

<details>
<summary>Describe the algorithm for Merging k Sorted Arrays using a heap.</summary>

### Describe the algorithm for Merging k Sorted Arrays using a heap.

**Definition:**

Мин-куча размера k держит текущую голову каждого массива. Каждый extract-min — следующий элемент вывода, и вы кладёте преемника из того же массива.

**How it works:**

- Инициализируют кучу кортежами `(значение, номер_массива, индекс)` для индекса 0 каждого непустого массива.
- Снимают наименьший, дописывают его в вывод и, если в том массиве есть следующий элемент, кладут его. Повторяют, пока куча не пуста.
- Всего N элементов, и каждый стоит O(log k), поэтому слияние — O(N log k). Куча хранит k кортежей, не все N элементов.
- Попарный mergesort массивов — тоже O(N log k). Версия с кучей выдаёт вывод потоком и совпадает с k-путевым слиянием внешней сортировки.

**Examples:**

Массивы `[1, 4]`, `[2, 3]`, `[0]`. Куча начинает с 1, 2 и 0. Снимаем 0, затем 1, кладём 4, снимаем 2, снимаем 3, снимаем 4. Вывод `[0, 1, 2, 3, 4]`.
</details>

<details>
<summary>Implement a heap that efficiently supports Find-Max and Find-Min operations.</summary>

### Implement a heap that efficiently supports Find-Max and Find-Min operations.

**Definition:**

Одна двоичная куча показывает только один край за O(1). Чтобы читать оба, держат мин-кучу и макс-кучу одних и тех же элементов или используют min-max кучу, которая чередует порядок по уровням.

**How it works:**

- Две кучи: каждый элемент живёт в обеих, связанный индексами или идентификаторами. Вставка обновляет обе за O(log n). Delete-min снимает из мин-кучи и из макс-кучи по сохранённому индексу.
- Min-max куча хранит минимумы на чётных уровнях и максимумы на нечётных, в одном массиве. Find-min и find-max — O(1). Вставка и удаление всё ещё O(log n), с более длинным просеиванием.
- Сбалансированное BST тоже делает оба конца за O(1) и обновления за O(log n) и тратит больше памяти на узел.
- Если нужны только оба конца, а не произвольное удаление по приоритету, двусторонней кучи достаточно. Не сортируйте массив целиком.
</details>

### Heap Applications

<details>
<summary>What are some Practical Applications of Heaps?</summary>

### What are some Practical Applications of Heaps?

**Definition:**

Кучи появляются там, где следующий шаг — «взять текущий лучший», а множество кандидатов всё время меняется.

**How it works:**

- Дейкстра и Прим растят фронт по наименьшему расстоянию или весу.
- Heapsort и выбор k наименьших: ограниченная куча размера k стоит O(n log k).
- Кодирование Хаффмана раз за разом сливает два самых лёгких дерева.
- Операционные системы планируют следующий таймер или следующую готовую задачу по приоритету. Потоковая медиана использует две кучи.
</details>

<details>
<summary>How is a heap used in the Huffman Coding algorithm?</summary>

### How is a heap used in the Huffman Coding algorithm?

**Definition:**

</details>

<details>
<summary>Explain how heaps are used in Real-Time Scheduling systems.</summary>

### Explain how heaps are used in Real-Time Scheduling systems.

**Definition:**

</details>

<details>
<summary>Discuss how heaps can manage efficiently Data Stream Median Finding.</summary>

### Discuss how heaps can manage efficiently Data Stream Median Finding.

**Definition:**

</details>

### Heaps Comparison and Choice

<details>
<summary>What are the advantages of Heaps over Sorted Arrays?</summary>

### What are the advantages of Heaps over Sorted Arrays?

**Definition:**

</details>

<details>
<summary>What is the difference between Heap and Red-Black Tree?</summary>

### What is the difference between Heap and Red-Black Tree?

**Definition:**

</details>

<details>
<summary>When would you choose a Fibonacci Heap over a Binary Heap?</summary>

### When would you choose a Fibonacci Heap over a Binary Heap?

**Definition:**

</details>

<details>
<summary>What situations might call for using a Binomial Heap?</summary>

### What situations might call for using a Binomial Heap?

**Definition:**

</details>

<details>
<summary>Compare and contrast the use cases of Min-Heaps vs. Max-Heaps.</summary>

### Compare and contrast the use cases of Min-Heaps vs. Max-Heaps.

**Definition:**

</details>

### Heap Operations and Challenges

<details>
<summary>Find 100 largest numbers in an Array of 1 billion numbers.</summary>

### Find 100 largest numbers in an Array of 1 billion numbers.

**Definition:**

</details>

<details>
<summary>Implement the operation Decrease-Key in a Binary Heap, and discuss its complexity.</summary>

### Implement the operation Decrease-Key in a Binary Heap, and discuss its complexity.

**Definition:**

</details>

<details>
<summary>Solve the Kth Smallest Element in a Min Heap without modifying the heap.</summary>

### Solve the Kth Smallest Element in a Min Heap without modifying the heap.

**Definition:**

</details>

<details>
<summary>How could you implement a heap which supports the operation of Deleting any element (not only the root)?</summary>

### How could you implement a heap which supports the operation of Deleting any element (not only the root)?

**Definition:**

</details>

### Map Data Structures Basics

<details>
<summary>Define a Map data structure and explain how it differs from a Heap.</summary>

### Define a Map data structure and explain how it differs from a Heap.

**Definition:**

</details>

<details>
<summary>What is a Hash Map, and how does it work internally?</summary>

### What is a Hash Map, and how does it work internally?

**Definition:**

</details>

<details>
<summary>Discuss various collision resolution strategies in a Hash Map.</summary>

### Discuss various collision resolution strategies in a Hash Map.

**Definition:**

</details>

### Map Data Structures Implementation

<details>
<summary>Implement a simple Hash Map with Chaining for collision resolution.</summary>

### Implement a simple Hash Map with Chaining for collision resolution.

**Definition:**

</details>

<details>
<summary>How does a Tree Map work, and when would you use it over a hash map?</summary>

### How does a Tree Map work, and when would you use it over a hash map?

**Definition:**

</details>

<details>
<summary>Could you implement a map using an Array? If so, what would be the limitations?</summary>

### Could you implement a map using an Array? If so, what would be the limitations?

**Definition:**

</details>

### Maps Operations and Complexities

<details>
<summary>What is the average-case and worst-case Time Complexity for operations in a Hash Map?</summary>

### What is the average-case and worst-case Time Complexity for operations in a Hash Map?

**Definition:**

</details>

<details>
<summary>How do Cuckoo Hashing and Linear Probing improve Hash Map performance?</summary>

### How do Cuckoo Hashing and Linear Probing improve Hash Map performance?

**Definition:**

</details>

<details>
<summary>Explain the impact of the Load Factor on a Hash Map’s performance.</summary>

### Explain the impact of the Load Factor on a Hash Map’s performance.

**Definition:**

</details>

### Maps in Algorithms and Applications

<details>
<summary>Describe a scenario where a Map is used in a Caching System (like LRUCache).</summary>

### Describe a scenario where a Map is used in a Caching System (like LRUCache).

**Definition:**

</details>

<details>
<summary>How are maps used in the implementation of Graph Data Structures like adjacency lists?</summary>

### How are maps used in the implementation of Graph Data Structures like adjacency lists?

**Definition:**

</details>

<details>
<summary>Discuss the role of maps in constructing an efficient Word Dictionary or Inverted Index.</summary>

### Discuss the role of maps in constructing an efficient Word Dictionary or Inverted Index.

**Definition:**

</details>

### Maps and Heaps Coding Challenges

<details>
<summary>Design a data structure that supports the following operations: Insertion, Deletion, Get-Random Element, where all operations have equal probability using both Heaps and Maps.</summary>

### Design a data structure that supports the following operations: Insertion, Deletion, Get-Random Element, where all operations have equal probability using both Heaps and Maps.

**Definition:**

</details>

<details>
<summary>Implement a Counter Map to find and list the k most frequent elements in an array.</summary>

### Implement a Counter Map to find and list the k most frequent elements in an array.

**Definition:**

</details>

<details>
<summary>Write a solution for the Sliding Window Maximum problem using Heaps.</summary>

### Write a solution for the Sliding Window Maximum problem using Heaps.

**Definition:**

</details>

<details>
<summary>Solve the Top K Frequent Words problem with a combination of Heap and Map data structures.</summary>

### Solve the Top K Frequent Words problem with a combination of Heap and Map data structures.

**Definition:**

</details>

<details>
<summary>Design a Leaderboard system that supports fast player score updates and rank retrieval using both Heaps and Maps.</summary>

### Design a Leaderboard system that supports fast player score updates and rank retrieval using both Heaps and Maps.

**Definition:**

</details>
