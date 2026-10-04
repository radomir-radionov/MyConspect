# Arrays — собеседование

Ответы заполнены для опубликованной части, остальные пустые.
[← К обзору](./7_special_data_structures.md)

### Related docs

- [Arrays — собеседование](./7_ds_arrays_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Arrays](https://devinterview.io/questions/data-structures-and-algorithms/array-data-structure-interview-questions/).

### Fundamental Array Concepts

<details>
<summary>What is an Array?</summary>

### What is an Array?

**Definition:**

Массив хранит элементы одной ширины в одном непрерывном блоке, поэтому индекс превращается в адрес арифметикой.

**How it works:**

- Адрес индекса `i` — `base + i × размер элемента`. Поэтому произвольный доступ — O(1).
- Поиск в неотсортированном массиве — O(n). Вставка или удаление в середине сдвигает соседей, это O(n).
- Ёмкость фиксирована, пока язык не обернёт блок в динамический массив. Индексы обычно с нуля.
- Непрерывная раскладка делает последовательный проход дружелюбным к кэшу процессора.

**Examples:**

```text
base = 1000, размер элемента = 4
индекс 3 -> адрес 1012
значения [10, 20, 30, 40], a[2] = 30
```
</details>

<details>
<summary>What are Dynamic Arrays?</summary>

### What are Dynamic Arrays?

**Definition:**

Динамический массив — непрерывный буфер плюс длина и ёмкость. Когда добавление в конец не влезает, выделяют больший буфер и копируют.

**How it works:**

- Рост обычно в постоянное число раз, часто в 2. Серия добавлений в конец амортизированно O(1), хотя одно расширение — O(n).
- Доступ по индексу остаётся O(1). Вставка или удаление в середине всё ещё O(n), потому что элементы сдвигаются, и расширение может добавить ещё O(n).
- Неиспользованная ёмкость — накладная память. Сжатие при удалении необязательно и обычно откладывается, чтобы массив не дёргался.
- `ArrayList`, `std::vector` и `list` в Python — эта структура.

**Examples:**

```text
ёмкость 2, длина 2, добавить 7
выделить 4, скопировать два старых элемента, записать 7, длина = 3
```
</details>

<details>
<summary>What is an Associative Array (Dictionary)?</summary>

### What is an Associative Array (Dictionary)?

**Definition:**

Ассоциативный массив хранит значения под ключами и ищет их по ключу, а не по плотному индексу.

**How it works:**

- Хеш-таблица делает это за ожидаемые O(1) и может упасть до O(n), когда все ключи попали в одну корзину.
- Сбалансированное дерево поиска делает это за O(log n) и держит ключи упорядоченными.
- Список пар — O(n) и уместен только для горстки ключей.
- Запись существующего ключа заменяет значение. Отсутствующий ключ — это отсутствие, а не дырка в середине диапазона индексов.

**Examples:**

`prices["tea"] = 2`, затем `prices["tea"]` возвращает 2. Ключ — строка, не позиция.
</details>

<details>
<summary>What defines the Dimensionality of an array?</summary>

### What defines the Dimensionality of an array?

**Definition:**

Размерность — сколько индексов нужно, чтобы назвать один элемент.

**How it works:**

- Один индекс — последовательность. Два — сетка. Три — стопка сеток.
- Число элементов — произведение длин осей.
- Память всё ещё один блок в порядке по строкам или по столбцам, либо это массив массивов с отдельным выделением на строку.
- Смещение `[r, c]` по строкам — `r × число_столбцов + c`. Порядок по столбцам меняет роли.

**Examples:**

Сетка 2×3 `[ [1, 2, 3], [4, 5, 6] ]` в порядке по строкам — плоский буфер `[1, 2, 3, 4, 5, 6]`. Элемент `[1, 2]` сидит по смещению `1×3+2 = 5`.
</details>

### Array Types and Properties

<details>
<summary>Name some Advantages and Disadvantages of arrays.</summary>

### Name some Advantages and Disadvantages of arrays.

**Definition:**

Массивы выигрывают на доступе по индексу и на проходах. Они проигрывают, когда середина коллекции всё время меняется или размер неизвестен и огромен.

**How it works:**

- Доступ по индексу O(1) и последовательный проход, который использует кэш, потому что соседи лежат рядом.
- Ёмкость фиксирована, пока вы не платите копированием динамического массива. Вставка и удаление в середине — O(n).
- Дырка в середине — это либо сдвиг, либо потраченный слот. Разреженные данные платят за каждую пустую клетку.
- Массив уместен, когда размер известен или доступ по индексу доминирует. Список или хеш-таблица — когда середина постоянно меняется или поиск идёт по произвольному ключу.
</details>

<details>
<summary>Explain Sparse and Dense arrays.</summary>

### Explain Sparse and Dense arrays.

**Definition:**

Плотный массив выделяет каждый слот, включая значения по умолчанию. Разреженный хранит только элементы, которые отличаются от умолчания, вместе с их индексами.

**How it works:**

- Поиск в плотном — арифметика и O(1). Поиск в разреженном ищет в карте, списке координат или сжатом индексе.
- CSR и CSC хранят ненули матрицы плюс указатели строк или столбцов. Список координат хранит тройки `(строка, столбец, значение)`.
- Разреженный выигрывает, когда почти каждая клетка пуста, как в счётчиках терм-документ или во многих линейных системах. Плотный выигрывает, когда заполнена большая доля клеток: индекс стоил бы дороже дыр.
- Арифметика на разреженных форматах должна явно пропускать нули. Библиотека, которая случайно уплотнит данные, может взорвать память.
</details>

<details>
<summary>What are advantages and disadvantages of Sorted Arrays?</summary>

### What are advantages and disadvantages of Sorted Arrays?

**Definition:**

Отсортированный массив держит элементы по порядку, поэтому поиск и запросы диапазона логарифмические, а каждая вставка платит сдвигом, чтобы вернуть порядок.

**How it works:**

- Двоичный поиск, сосед справа, сосед слева и запросы диапазона — O(log n), а проход диапазона дружелюбен к кэшу.
- Вставка и удаление — O(n), потому что элементы двигаются, чтобы сохранить порядок.
- Порядок полный, чего куча не даёт. Можно двоично искать любой ключ, а не только читать крайний.
- Подходит данным, которые часто ищут и редко меняют.
</details>

<details>
<summary>What are the advantages of Heaps over Sorted Arrays?</summary>

### What are the advantages of Heaps over Sorted Arrays?

**Definition:**

Двоичная куча держит только порядок родитель-ребёнок, поэтому крайний элемент в корне за O(1), а обновление этого края — O(log n).

**How it works:**

- Отсортированный массив тоже показывает минимум или максимум за O(1), но каждая вставка или удаление сдвигает элементы и стоит O(n).
- Куча не умеет быстро искать произвольный ключ. Найти среднее значение — O(n).
- Куча уместна, когда множество часто меняется и нужен только текущий край, как в очереди с приоритетом или в Дейкстре.
- Отсортированный массив уместен, когда нужен двоичный поиск или диапазон, а не только конец порядка.
</details>

### Array Operations and Management

<details>
<summary>How does Indexing work in arrays?</summary>

### How does Indexing work in arrays?

**Definition:**

Индекс называет позицию, обычно от 0 до n−1, и адрес вычисляется, а не ищется проходом.

**How it works:**

- Элементы равной ширины дают `address(i) = base + i × ширина`.
- Проверка границ сравнивает `i` с длиной. Пропуск — ошибка безопасности памяти.
- Многомерный индекс сплющивается. В порядке по строкам смещение — `строка × длина_строки + столбец`.
- Отрицательные индексы в некоторых языках считают с конца и являются сахаром над `длина + i`, а не вторым массивом.

**Examples:**

`a = [10, 20, 30]`, `a[0]` — это 10, `a[2]` — это 30. В Python `a[-1]` — тот же слот, что `a[2]`.
</details>

<details>
<summary>Merge two Sorted Arrays into one Sorted Array.</summary>

### Merge two Sorted Arrays into one Sorted Array.

**Definition:**

Идут по двум отсортированным входам двумя индексами и всегда дописывают меньшее текущее значение.

**How it works:**

- Если головы равны, дописывают одну, затем другую. Устойчивость оставляет копию левого входа первой, если это важно.
- Когда один вход кончился, копируют хвост другого. Хвост уже отсортирован.
- Время O(n + m). Выходу нужно O(n + m) дополнительной памяти. Это шаг соединения mergesort.
- Слияние на месте в буфер, у которого пустые слоты уже в конце, — тот же порядок сравнений задом наперёд.

**Examples:**

```text
[1, 4, 6] и [2, 3, 5]
-> 1, затем 2, затем 3, затем 4, затем 5, затем 6
```
</details>

<details>
<summary>Implement three Stacks with one Array.</summary>

### Implement three Stacks with one Array.

**Definition:**

Либо отдают каждому стеку фиксированный кусок массива, либо хранят все три как связанные списки слотов плюс список свободных, чтобы любой стек мог взять любой свободный слот.

**How it works:**

- Фиксированные трети: у каждого стека своя вершина внутри `[0, n/3)`, `[n/3, 2n/3)` и `[2n/3, n)`. Push и pop — O(1), и один стек может быть полон, пока другой кусок пуст.
- Гибкая раскладка: каждый слот хранит значение и индекс предыдущего слота того же стека. Свободный список связывает неиспользованные индексы.
- Push снимает свободный индекс, пишет значение и указывает его на старую вершину. Pop возвращает этот индекс в свободный список.
- Обе версии — O(1) на операцию. Гибкая тратит лишнее целое на слот и заполняет весь массив.

**Examples:**

```text
слоты: [a, b, _, c]
вершины: stack0=0, stack1=1, stack2=3
свободный: 2
push stack0 -> взять слот 2, prev=0
```
</details>

<details>
<summary>How do you perform Array Rotation and what are its applications?</summary>

### How do you perform Array Rotation and what are its applications?

**Definition:**

Поворот переносит префикс в конец или суффикс в начало, не меняя относительный порядок внутри этих кусков.

**How it works:**

- Левый поворот на `k` — три разворота: развернуть первые `k`, развернуть хвост, развернуть весь массив. Правый поворот сначала разворачивает весь массив.
- `k` берут по модулю n, чтобы огромный счётчик не крутился. Время O(n), дополнительная память O(1).
- Цикл «жонглирования» или временный буфер из `k` тоже работают. Разворот — форма на месте, которой не нужен лишний буфер.
- Та же идея есть в кольцевых буферах, повороте строки изображения и проверке, является ли одна строка поворотом другой, поиском в `s + s`.

**Examples:**

```text
[1, 2, 3, 4, 5] влево на 2
разворот [1, 2] -> [2, 1, 3, 4, 5]
разворот [3, 4, 5] -> [2, 1, 5, 4, 3]
разворот всего -> [3, 4, 5, 1, 2]
```
</details>

<details>
<summary>Reverse an Array in place.</summary>

### Reverse an Array in place.

**Definition:**

Меняют элемент левого индекса с элементом правого, затем двигают оба индекса к центру, пока они не встретятся.

**How it works:**

- Около `n/2` обменов идут за O(n) с дополнительной памятью O(1). Исходный массив перезаписывается.
- Сначала копируют, если старый порядок должен сохраниться.
- Нечётная длина оставляет средний элемент без обмена, и это верно.
- Тот же шаблон двух указателей разворачивает буфер строки или срез массива.

**Examples:**

```text
[1, 2, 3, 4]
обмен 1 и 4 -> [4, 2, 3, 1]
обмен 2 и 3 -> [4, 3, 2, 1]
```
</details>

<details>
<summary>Remove Duplicates from a sorted array without using extra space.</summary>

### Remove Duplicates from a sorted array without using extra space.

**Definition:**

Раз массив отсортирован, дубликаты сидят рядом. Индекс записи держит последнее уникальное значение, индекс чтения идёт вперёд.

**How it works:**

- `write` стартует с 0. Для каждого следующего `read`, если `a[read]` отличается от `a[write]`, сдвигают `write` и копируют туда `a[read]`.
- Уникальный префикс имеет длину `write + 1`. Слоты дальше нужно игнорировать: это остатки.
- Время O(n), дополнительная память O(1). Алгоритм опирается на порядок. Неотсортированному массиву сначала нужно множество или сортировка.
- Вариант, который разрешает каждое значение дважды, сравнивает с `a[write - 1]`, а не с `a[write]`.

**Examples:**

```text
[1, 1, 2, 2, 3]
write остаётся на первой 1, затем копирует 2, затем 3
уникальный префикс [1, 2, 3], длина 3
```
</details>

<details>
<summary>Implement a Queue using an array.</summary>

### Implement a Queue using an array.

**Definition:**

Кольцевой буфер хранит очередь в фиксированном массиве с индексом головы, индексом хвоста и размером и заворачивается через остаток от деления.

**How it works:**

- Enqueue пишет в `tail` и ставит `tail = (tail + 1) % ёмкость`. Dequeue читает `head` и сдвигает его так же.
- Оба — O(1). Очередь пуста, когда `size` равен 0, и полна, когда `size` равен ёмкости.
- Без заворота слоты, из которых уже забрали элемент, пропадают, и очередь кажется полной, хотя занят только хвост.
- Расширение копирует живые элементы по порядку от `head`, затем ставит `head` в 0. Память остаётся пропорциональной ёмкости.

**Examples:**

```text
ёмкость 4, enqueue 1, 2, 3 -> слоты [1, 2, 3, _]
dequeue -> 1, head заворачивается
enqueue 4, 5 -> [5, 2, 3, 4]
```
</details>

### Array-based Algorithms

<details>
<summary>Check the String for Balanced Parentheses, using linear time and constant space.</summary>

### Check the String for Balanced Parentheses, using linear time and constant space.

**Definition:**

</details>

<details>
<summary>Explain an algorithm to find the Longest Consecutive Sequence in an unsorted array.</summary>

### Explain an algorithm to find the Longest Consecutive Sequence in an unsorted array.

**Definition:**

</details>

<details>
<summary>Find the “Kth” Largest Element in an Array.</summary>

### Find the “Kth” Largest Element in an Array.

**Definition:**

</details>

<details>
<summary>Explain how to do Binary Search in a Sorted Array.</summary>

### Explain how to do Binary Search in a Sorted Array.

**Definition:**

</details>

<details>
<summary>Implement Heap Sort using an Array.</summary>

### Implement Heap Sort using an Array.

**Definition:**

</details>

### Array Comparison

<details>
<summary>What are some pros and cons of Linked List compared to Arrays?</summary>

### What are some pros and cons of Linked List compared to Arrays?

**Definition:**

</details>

<details>
<summary>Compare Array-based vs Linked List stack implementations.</summary>

### Compare Array-based vs Linked List stack implementations.

**Definition:**

</details>

<details>
<summary>Compare Dynamic Arrays with Linked Lists.</summary>

### Compare Dynamic Arrays with Linked Lists.

**Definition:**

</details>

### Advanced Array Topics and Techniques

<details>
<summary>Shuffle an array, ensuring that each element has an equal probability of being in any position.</summary>

### Shuffle an array, ensuring that each element has an equal probability of being in any position.

**Definition:**

</details>

<details>
<summary>Solve the Rain Water Trapping problem using arrays.</summary>

### Solve the Rain Water Trapping problem using arrays.

**Definition:**

</details>

<details>
<summary>Explain the two-pointer technique and give examples of its use in array problems.</summary>

### Explain the two-pointer technique and give examples of its use in array problems.

**Definition:**

</details>

<details>
<summary>What are the typical use cases for using an array in a Sliding Window Algorithm?</summary>

### What are the typical use cases for using an array in a Sliding Window Algorithm?

**Definition:**

</details>

<details>
<summary>Find all pairs in an Array with a given sum.</summary>

### Find all pairs in an Array with a given sum.

**Definition:**

</details>

### Array Optimization and Use Cases

<details>
<summary>Explain the difference between Column-major Order and Row-major Order in multidimensional arrays.</summary>

### Explain the difference between Column-major Order and Row-major Order in multidimensional arrays.

**Definition:**

</details>

<details>
<summary>How is a Circular Array useful, and how would you implement one?</summary>

### How is a Circular Array useful, and how would you implement one?

**Definition:**

</details>

<details>
<summary>How to optimize operations in a Very Large Array that has many zero elements (i.e., a Sparse Array).</summary>

### How to optimize operations in a Very Large Array that has many zero elements (i.e., a Sparse Array).

**Definition:**

</details>

<details>
<summary>How would you create and work with a Multi-Dimensional Array?</summary>

### How would you create and work with a Multi-Dimensional Array?

**Definition:**

</details>

<details>
<summary>Explain the methodology for Resizing a Dynamic Array and its impact on time complexity.</summary>

### Explain the methodology for Resizing a Dynamic Array and its impact on time complexity.

**Definition:**

</details>

### Array Techniques and Optimization

<details>
<summary>Implement Binary Search in a circularly sorted array.</summary>

### Implement Binary Search in a circularly sorted array.

**Definition:**

</details>

<details>
<summary>Describe an algorithm for Dutch National Flag sorting problem.</summary>

### Describe an algorithm for Dutch National Flag sorting problem.

**Definition:**

</details>

<details>
<summary>How would you multiply two large numbers represented as integer arrays?</summary>

### How would you multiply two large numbers represented as integer arrays?

**Definition:**

</details>

<details>
<summary>Explain how to implement an Efficient Range Sum Query using arrays.</summary>

### Explain how to implement an Efficient Range Sum Query using arrays.

**Definition:**

</details>

<details>
<summary>Describe a Space-Efficient Data Structure for sparse arrays.</summary>

### Describe a Space-Efficient Data Structure for sparse arrays.

**Definition:**

</details>

### Searching and Sorting Challenges

<details>
<summary>Explain the Quickselect algorithm and its relation to arrays.</summary>

### Explain the Quickselect algorithm and its relation to arrays.

**Definition:**

</details>

<details>
<summary>How can Quicksort be optimized for arrays with many duplicate elements?</summary>

### How can Quicksort be optimized for arrays with many duplicate elements?

**Definition:**

</details>

<details>
<summary>Describe an algorithm to perform Inversion Count in an array.</summary>

### Describe an algorithm to perform Inversion Count in an array.

**Definition:**

</details>

<details>
<summary>Explain the application of Binary Indexed Trees or Fenwick Trees in the context of arrays.</summary>

### Explain the application of Binary Indexed Trees or Fenwick Trees in the context of arrays.

**Definition:**

</details>

<details>
<summary>Design an algorithm for the Skyline Problem using arrays.</summary>

### Design an algorithm for the Skyline Problem using arrays.

**Definition:**

</details>

### Multidimensional Arrays and Matrices

<details>
<summary>How would you implement an efficient matrix transpose operation?</summary>

### How would you implement an efficient matrix transpose operation?

**Definition:**

</details>

<details>
<summary>What are some efficient methods for performing matrix multiplication using arrays?</summary>

### What are some efficient methods for performing matrix multiplication using arrays?

**Definition:**

</details>

<details>
<summary>Solve the Sudoku Solver problem using arrays.</summary>

### Solve the Sudoku Solver problem using arrays.

**Definition:**

</details>

<details>
<summary>Flatten a 2D Matrix into a 1D Array without extra space.</summary>

### Flatten a 2D Matrix into a 1D Array without extra space.

**Definition:**

</details>

<details>
<summary>Implement an algorithm to search in a Row-wise and Column-wise Sorted 2D Array.</summary>

### Implement an algorithm to search in a Row-wise and Column-wise Sorted 2D Array.

**Definition:**

</details>

### Specific Data Structures Using Arrays

<details>
<summary>Explain how a Priority Queue can be implemented using an array.</summary>

### Explain how a Priority Queue can be implemented using an array.

**Definition:**

</details>

<details>
<summary>How can we use arrays to implement a Suffix Array and what is its usefulness?</summary>

### How can we use arrays to implement a Suffix Array and what is its usefulness?

**Definition:**

</details>

<details>
<summary>Design a Double-ended Queue (Deque) using arrays.</summary>

### Design a Double-ended Queue (Deque) using arrays.

**Definition:**

</details>

<details>
<summary>Provide the implementation of a Trie data structure using an array-based representation.</summary>

### Provide the implementation of a Trie data structure using an array-based representation.

**Definition:**

</details>

### Advanced Algorithmic Problems

<details>
<summary>Develop an algorithm to solve the Kadane’s Algorithm (Maximum Subarray Problem).</summary>

### Develop an algorithm to solve the Kadane’s Algorithm (Maximum Subarray Problem).

**Definition:**

</details>

<details>
<summary>Solve the Minimum Jumps to Reach End problem with arrays.</summary>

### Solve the Minimum Jumps to Reach End problem with arrays.

**Definition:**

</details>

<details>
<summary>Design a data structure that supports adding new elements, removing specific elements, and finding random elements efficiently.</summary>

### Design a data structure that supports adding new elements, removing specific elements, and finding random elements efficiently.

**Definition:**

</details>

<details>
<summary>Solve the 0/1 Knapsack Problem using a dynamic programming approach based on arrays.</summary>

### Solve the 0/1 Knapsack Problem using a dynamic programming approach based on arrays.

**Definition:**

</details>

<details>
<summary>Develop an algorithm to find the Median of Two Sorted Arrays of different sizes.</summary>

### Develop an algorithm to find the Median of Two Sorted Arrays of different sizes.

**Definition:**

</details>

### Performance and Memory Considerations

<details>
<summary>Provide strategies for handling Integer Overflow while working with numeric arrays.</summary>

### Provide strategies for handling Integer Overflow while working with numeric arrays.

**Definition:**

</details>

<details>
<summary>What are the implications of Data Caching and Locality of Reference in array operations?</summary>

### What are the implications of Data Caching and Locality of Reference in array operations?

**Definition:**

</details>

<details>
<summary>How to minimize Page Faults while accessing large arrays in memory-constrained environments?</summary>

### How to minimize Page Faults while accessing large arrays in memory-constrained environments?

**Definition:**

</details>
