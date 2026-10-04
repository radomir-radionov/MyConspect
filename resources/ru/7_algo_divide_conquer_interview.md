# Divide & Conquer — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./7_special_algorithms.md)

### Related docs

- [Divide & Conquer — собеседование](./7_algo_divide_conquer_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Divide & Conquer](https://devinterview.io/questions/data-structures-and-algorithms/divide-and-conquer-interview-questions/).

### Basic Concepts of Divide & Conquer Algorithms

<details>
<summary>Define Divide & Conquer algorithms and their main characteristics.</summary>

### Define Divide & Conquer algorithms and their main characteristics.

**Definition:**

Разделяй и властвуй режет задачу на меньшие независимые подзадачи того же вида, решает их и соединяет результаты.

**How it works:**

- Разрез должен давать подзадачи, которым не нужно промежуточное состояние друг друга.
- База — вход постоянного размера, который решают напрямую.
- Шаг соединения часто и есть настоящая работа: слияние двух отсортированных половин или сложение двух частичных произведений.
- Обычная цена — рекуррентность вида `T(n) = a T(n/b) + f(n)`.

**Examples:**

Двоичный поиск смотрит середину и продолжает в одной половине. Вторая отбрасывается, поэтому `a = 1` и `b = 2`.
</details>

<details>
<summary>Explain the difference between Divide & Conquer and Dynamic Programming.</summary>

### Explain the difference between Divide & Conquer and Dynamic Programming.

**Definition:**

Разделяй и властвуй решает каждую подзадачу один раз по ходу рекурсии, и эти подзадачи не пересекаются. Динамическое программирование — для пересекающихся подзадач, и оно хранит ответы, чтобы не считать их снова.

**How it works:**

- Половины mergesort не пересекаются. Наивная рекурсия Фибоначчи считает одно и то же `F(k)` много раз; таблица ДП считает его один раз.
- Разделяй и властвуй обычно идёт сверху вниз. ДП — сверху вниз с мемоизацией или снизу вверх по таблице.
- Если к рекурсии разделяй и властвуй добавить кэш и он попадает, получилось динамическое программирование.
- ДП тоже требует оптимальную подструктуру: лучший ответ строится из лучших ответов меньших состояний.
</details>

<details>
<summary>What is the role of recursion in Divide & Conquer algorithms?</summary>

### What is the role of recursion in Divide & Conquer algorithms?

**Definition:**

Рекурсия — обычный способ применить тот же алгоритм к каждому меньшему куску, пока не дойдёте до базы.

**How it works:**

- Каждый вызов получает диапазон, часто `lo` и `hi`, и вызывает себя на одном или нескольких поддиапазонах.
- Стек вызовов держит незаконченные шаги соединения. Глубина O(log n), когда размер сжимается в постоянное число раз, и O(n) при сильно перекошенном разрезе.
- Явный стек или цикл снизу вверх могут заменить вызовы. Нижняя форма mergesort сливает отрезки длины 1, затем 2, затем 4.
- Сама рекурсия ускорение не создаёт. Ускорение — от меньшего числа соединений, чем наивный просмотр всех пар.
</details>

<details>
<summary>What are the three main steps in a typical Divide & Conquer algorithm?</summary>

### What are the three main steps in a typical Divide & Conquer algorithm?

**Definition:**

Три шага — разделить, решить и соединить.

**How it works:**

- Разделение режет вход на меньшие независимые куски. Равные размеры держат рекуррентность сбалансированной.
- Решение обрабатывает каждый кусок. Если он достаточно мал, его решают напрямую. Иначе рекурсия.
- Соединение собирает результаты кусков в ответ для исходного входа.
- У некоторых алгоритмов соединение тривиально (двоичный поиск возвращает ответ рекурсии), а у некоторых тривиально разделение (работа quicksort — это разбиение до рекурсивных вызовов).

**Examples:**

Mergesort: режем массив пополам, сортируем каждую половину, затем сливаем двумя указателями.
</details>

### Mathematical Foundations

<details>
<summary>Give an example of a recurrence relation that can describe the time complexity of a Divide & Conquer algorithm.</summary>

### Give an example of a recurrence relation that can describe the time complexity of a Divide & Conquer algorithm.

**Definition:**

Рекуррентность записывает цену размера n через цену меньших вызовов плюс работу вне них.

**How it works:**

- `T(n) = 2 T(n/2) + O(n)` — mergesort: две половины и линейное слияние.
- `T(n) = T(n/2) + O(1)` — двоичный поиск: одна половина и постоянная проверка.
- `T(n) = 2 T(n/2) + O(n²)` было бы квадратичным соединением двух половин, что хуже прямого двойного цикла.
- База — `T(1) = O(1)`. Округления вниз и вверх не меняют асимптотику этих гладких разрезов.

**Examples:**

Раскрытие mergesort: `n + 2·(n/2) + 4·(n/4) + …` — это `n` на уровень и `log₂ n` уровней, значит `O(n log n)`.
</details>

<details>
<summary>Explain the Master Theorem and its importance in analyzing Divide & Conquer algorithms.</summary>

### Explain the Master Theorem and its importance in analyzing Divide & Conquer algorithms.

**Definition:**

Основная теорема даёт асимптотику `T(n) = a T(n/b) + O(nᵏ)`, сравнивая работу в корне с работой в листьях.

**How it works:**

- Пусть `c_crit = log_b(a)`. Если `k < c_crit`, доминируют листья и `T(n) = Θ(n^{c_crit})`.
- Если `k = c_crit`, каждый уровень стоит одинаково и `T(n) = Θ(nᵏ log n)`.
- Если `k > c_crit`, доминирует соединение в корне и `T(n) = Θ(nᵏ)`.
- Она не покрывает неровные разрезы, неполиномиальную цену соединения и округления, которые меняют форму. Для них нужно дерево рекурсии или теорема Акры–Бацци.

**Examples:**

У mergesort `a = 2`, `b = 2`, `k = 1`. `log₂ 2 = 1 = k`, поэтому средний случай даёт `Θ(n log n)`.
</details>

<details>
<summary>How can the Master Theorem be applied to find the time complexity of a binary search algorithm?</summary>

### How can the Master Theorem be applied to find the time complexity of a binary search algorithm?

**Definition:**

Двоичный поиск делает один рекурсивный вызов на половине массива и постоянную работу на сравнение среднего элемента.

**How it works:**

- Значит `a = 1`, `b = 2` и `f(n) = O(1) = O(n⁰)`.
- `log₂ 1 = 0`, что равно показателю `f`. Применяется случай равных уровней.
- Теорема тогда говорит `T(n) = Θ(n⁰ log n) = Θ(log n)`.
- Та же граница видна по глубине: каждый вызов выбрасывает половину оставшихся элементов, поэтому вызовов около `log₂ n`.
</details>

### Algorithms Design and Implementation

<details>
<summary>Describe how you would use Divide & Conquer to find the maximum and minimum of an array.</summary>

### Describe how you would use Divide & Conquer to find the maximum and minimum of an array.

**Definition:**

Режем массив пополам, ищем минимум и максимум каждой половины и оставляем меньший минимум и больший максимум.

**How it works:**

- Диапазон из одного элемента возвращает его и как min, и как max. Диапазон из двух элементов берёт одно сравнение.
- Соединение — два сравнения. Рекуррентность `T(n) = 2 T(n/2) + O(1)`, то есть `Θ(n)`.
- Число сравнений около `3n/2 − 2`, когда n — степень двойки. Это лучше, чем `2n − 2` у одного прохода слева направо, который ведёт оба значения.
- Алгоритм всё равно линейный. Выигрыш в константе, не в классе относительно одного прохода.

**Examples:**

`[4, 1, 7, 3]` режется на `[4, 1]` и `[7, 3]`. Они возвращают `(1, 4)` и `(3, 7)`. Соединение возвращает минимум 1 и максимум 7.
</details>

<details>
<summary>Illustrate how the Merge Sort algorithm exemplifies the Divide & Conquer technique.</summary>

### Illustrate how the Merge Sort algorithm exemplifies the Divide & Conquer technique.

**Definition:**

Mergesort рекурсивно сортирует каждую половину и сливает две отсортированные половины линейным проходом двух указателей.

**How it works:**

- Разделение — середина. Решение — две рекурсивные сортировки. Соединение — слияние во вспомогательный буфер.
- Слияние устойчиво, если при равных ключах первым остаётся элемент левой половины.
- Время `Θ(n log n)` в любом случае. Дополнительная память буфера — `Θ(n)`.
- В дереве рекурсии `log n` уровней, и каждый уровень переносит `Θ(n)` элементов.

**Examples:**

```text
[3, 1, 4, 2]
[3, 1] [4, 2]
[3] [1] [4] [2]
слияние -> [1, 3] [2, 4] -> [1, 2, 3, 4]
```
</details>

<details>
<summary>Explain how Quicksort works and how it adopts the Divide & Conquer strategy.</summary>

### Explain how Quicksort works and how it adopts the Divide & Conquer strategy.

**Definition:**

Quicksort разбивает массив вокруг опоры, затем сортирует две стороны. Соединять нечего: разбиение уже положило каждый меньший ключ слева.

**How it works:**

- Работа — разбиение, линейное по текущему диапазону. Рекурсивные вызовы затем сортируют левую и правую части, пропуская опору.
- Среднее время при случайной или удачной опоре — `O(n log n)`. Опора, которая всегда крайний ключ, даёт `O(n²)`.
- Обычно сортировка на месте, стек `O(log n)` на сбалансированных опорах и `O(n)` на вырожденных. Сначала меньшая сторона держит стек логарифмическим.
- Обычное разбиение на месте не устойчиво.

**Examples:**

`[3, 1, 4, 2]` с опорой 3 после разбиения становится `[1, 2, 3, 4]`, и обе стороны уже тривиальны.
</details>

<details>
<summary>How does the Karatsuba algorithm for multiplying large numbers employ Divide & Conquer?</summary>

### How does the Karatsuba algorithm for multiplying large numbers employ Divide & Conquer?

**Definition:**

Карацуба умножает два n-значных числа тремя умножениями чисел из n/2 знаков вместо четырёх, которые дал бы школьный разрез.

**How it works:**

- Записывают `x = a · B + b` и `y = c · B + d`, где B — основание в середине.
- Школьное произведение требует `ac`, `ad`, `bc` и `bd`. Карацуба ещё считает `(a + b)(c + d)` и восстанавливает `ad + bc` как это произведение минус `ac` минус `bd`.
- Рекуррентность `T(n) = 3 T(n/2) + O(n)`. Так как `log₂ 3 ≈ 1.585`, время `O(n^{1.585})`, лучше `O(n²)`.
- Ниже небольшого порога по числу знаков реализация переходит на школьное умножение, потому что лишние сложения начинают доминировать.
</details>

<details>
<summary>Describe the Strassen’s algorithm for matrix multiplication using Divide & Conquer.</summary>

### Describe the Strassen’s algorithm for matrix multiplication using Divide & Conquer.

**Definition:**

Штрассен умножает две матрицы n×n семью рекурсивными умножениями блоков n/2 вместо восьми в блочном школьном методе.

**How it works:**

- Каждую матрицу режут на четыре блока n/2. Семи произведений сумм и разностей этих блоков хватает, чтобы собрать четыре блока произведения.
- Рекуррентность `T(n) = 7 T(n/2) + O(n²)`. `log₂ 7 ≈ 2.807`, поэтому время `O(n^{2.807})`, ниже классических `O(n³)`.
- Лишние сложения и неудобная блочная раскладка делают его медленнее настроенного классического ядра, пока n не станет большим.
- Более поздние алгоритмы имеют меньший показатель. Библиотеки всё равно предпочитают блочное классическое умножение на тех размерах, которые реально поставляют.
</details>

### Problem Solving with Divide & Conquer

<details>
<summary>How would you use a Divide & Conquer approach to calculate the power of a number?</summary>

### How would you use a Divide & Conquer approach to calculate the power of a number?

**Definition:**

Возведение в степень делением показателя пополам на каждом вызове делает степень за логарифмическое число умножений.

**How it works:**

- `xⁿ = (x²)^{n/2}`, когда n чётно. Когда n нечётно, `xⁿ = x · xⁿ⁻¹`, и n−1 чётно.
- Рекуррентность — `T(n) = T(n/2) + O(1)` умножений, значит `O(log n)` умножений вместо `O(n)`.
- Та же идея с умножениями по модулю считает `xⁿ mod m`, не строя огромное число.
- Итеративное двоичное возведение смотрит биты n и возводит накопитель в квадрат. Это тот же алгоритм без рекурсии.

**Examples:**

`3⁸`: квадрат `9`, квадрат `81`, квадрат `6561`. Три возведения в квадрат, а не восемь умножений на 3.
</details>

<details>
<summary>Solve the Tower of Hanoi problem using Divide & Conquer techniques.</summary>

### Solve the Tower of Hanoi problem using Divide & Conquer techniques.

**Definition:**

Чтобы перенести n дисков с колышка A на C, используя запасной B, переносят n−1 на запасной, переносят самый большой на цель, затем переносят n−1 с запасного на цель.

**How it works:**

- Самый большой диск можно двигать, только когда n−1 над ним сняты, и ставить только на пустой колышек или на больший диск. Рекурсивные переносы сохраняют этот инвариант.
- `T(n) = 2 T(n−1) + O(1)` при `T(1) = 1`, поэтому число ходов `2ⁿ − 1`.
- Разрез — на две задачи размера n−1, не n/2. Форма основной теоремы с `n/b` не применяется; замкнутый вид получается раскрытием.
- Для классических правил это оптимально: граф конфигураций требует не меньше стольких ходов.

**Examples:**

Три диска A→C: перенести 2 с A на B (через C), перенести диск 3 A→C, перенести 2 с B на C (через A). Шаги «перенести 2» сами режутся на ходы одного диска.
</details>

<details>
<summary>Solve the Closest Pair of Points problem using Divide & Conquer.</summary>

### Solve the Closest Pair of Points problem using Divide & Conquer.

**Definition:**

Сортируют точки по x, режут вертикальной прямой, решают каждую половину и проверяют только полосу у прямой, где ещё может прятаться более близкая пара.

**How it works:**

- Рекурсивные ответы дают расстояние δ — лучшую пару целиком слева или целиком справа.
- Более близкая пара обязана иметь по точке в каждой половине, и обе внутри вертикальной полосы ширины 2δ вокруг разреза.
- Точкам этой полосы, отсортированным по y, достаточно постоянного числа соседей вперёд по этому порядку. Каждая точка сравнивается с несколькими следующими, не со всей полосой.
- Рекуррентность `T(n) = 2 T(n/2) + O(n)` после начальной сортировки, поэтому поиск — `O(n log n)`.

**Examples:**

Ближайшее слева — 5, справа — 4, значит δ = 4. Через разрез сравнивают только точки в пределах 4 от средней линии, и истинная ближайшая пара может быть одной из этих пар на расстоянии 3.
</details>

<details>
<summary>Use Divide & Conquer to solve the Majority Element problem in an array.</summary>

### Use Divide & Conquer to solve the Majority Element problem in an array.

**Definition:**

</details>

<details>
<summary>Implement an algorithm to efficiently find the Median of Two Sorted Arrays.</summary>

### Implement an algorithm to efficiently find the Median of Two Sorted Arrays.

**Definition:**

</details>

### Advanced Divide & Conquer Applications

<details>
<summary>Explain the key differences when Divide & Conquer is applied to External Sorting vs In-memory Sorting.</summary>

### Explain the key differences when Divide & Conquer is applied to External Sorting vs In-memory Sorting.

**Definition:**

</details>

<details>
<summary>How is Divide & Conquer utilized in the Cooley-Tukey FFT algorithm?</summary>

### How is Divide & Conquer utilized in the Cooley-Tukey FFT algorithm?

**Definition:**

</details>

<details>
<summary>Solve the Skyline Problem using Divide & Conquer.</summary>

### Solve the Skyline Problem using Divide & Conquer.

**Definition:**

</details>

### Optimization and Improvement

<details>
<summary>What strategies can be employed to reduce the overhead in recursive calls of Divide & Conquer algorithms?</summary>

### What strategies can be employed to reduce the overhead in recursive calls of Divide & Conquer algorithms?

**Definition:**

</details>

<details>
<summary>Discuss how tail recursion optimization could be beneficial for Divide & Conquer algorithms.</summary>

### Discuss how tail recursion optimization could be beneficial for Divide & Conquer algorithms.

**Definition:**

</details>

<details>
<summary>Explain how memoization or caching can affect the performance of Divide & Conquer algorithms.</summary>

### Explain how memoization or caching can affect the performance of Divide & Conquer algorithms.

**Definition:**

</details>

### Complexity Analysis

<details>
<summary>Compare the worst-case time complexities of Merge Sort, Quicksort, and Heapsort.</summary>

### Compare the worst-case time complexities of Merge Sort, Quicksort, and Heapsort.

**Definition:**

</details>

<details>
<summary>How do you determine the space complexity of a Divide & Conquer algorithm?</summary>

### How do you determine the space complexity of a Divide & Conquer algorithm?

**Definition:**

</details>

<details>
<summary>Why do some Divide & Conquer algorithms have a high space complexity, and how can this be mitigated?</summary>

### Why do some Divide & Conquer algorithms have a high space complexity, and how can this be mitigated?

**Definition:**

</details>

### Parallelization and Distributed Computing

<details>
<summary>Discuss how Divide & Conquer algorithms can be parallelized.</summary>

### Discuss how Divide & Conquer algorithms can be parallelized.

**Definition:**

</details>

<details>
<summary>Provide an example of a Divide & Conquer algorithm that could benefit from a distributed computing environment.</summary>

### Provide an example of a Divide & Conquer algorithm that could benefit from a distributed computing environment.

**Definition:**

</details>

### Miscellaneous

<details>
<summary>How does the use of randomization in Quicksort improve its performance on average?</summary>

### How does the use of randomization in Quicksort improve its performance on average?

**Definition:**

</details>

<details>
<summary>Describe an instance where a Divide & Conquer algorithm is not the best choice.</summary>

### Describe an instance where a Divide & Conquer algorithm is not the best choice.

**Definition:**

</details>

<details>
<summary>Discuss the application of Divide & Conquer in non-computer-science fields.</summary>

### Discuss the application of Divide & Conquer in non-computer-science fields.

**Definition:**

</details>

### Practical Applications and Coding Challenges

<details>
<summary>Develop a Divide & Conquer algorithm to count inversions in an array.</summary>

### Develop a Divide & Conquer algorithm to count inversions in an array.

**Definition:**

</details>

<details>
<summary>Write an efficient algorithm for the Convex Hull problem using Divide & Conquer.</summary>

### Write an efficient algorithm for the Convex Hull problem using Divide & Conquer.

**Definition:**

</details>

<details>
<summary>Provide an example of a real-world application where Divide & Conquer algorithms significantly improve performance.</summary>

### Provide an example of a real-world application where Divide & Conquer algorithms significantly improve performance.

**Definition:**

</details>

<details>
<summary>Implement a Divide & Conquer algorithm to solve the Maximum Subarray Problem.</summary>

### Implement a Divide & Conquer algorithm to solve the Maximum Subarray Problem.

**Definition:**

</details>

### Coding Challenges on Divide & Conquer Algorithms

<details>
<summary>Implement an algorithm to find the Median of Two Sorted Arrays using Divide & Conquer.</summary>

### Implement an algorithm to find the Median of Two Sorted Arrays using Divide & Conquer.

**Definition:**

</details>

<details>
<summary>Code a Divide & Conquer solution to Merge k Sorted Lists into one sorted list.</summary>

### Code a Divide & Conquer solution to Merge k Sorted Lists into one sorted list.

**Definition:**

</details>

<details>
<summary>Develop a Divide & Conquer algorithm to solve the Maximum Subarray Problem and find the contiguous subarray with the maximum sum.</summary>

### Develop a Divide & Conquer algorithm to solve the Maximum Subarray Problem and find the contiguous subarray with the maximum sum.

**Definition:**

</details>

<details>
<summary>Construct a Binary Tree from given Preorder and Inorder traversal arrays using Divide & Conquer.</summary>

### Construct a Binary Tree from given Preorder and Inorder traversal arrays using Divide & Conquer.

**Definition:**

</details>

<details>
<summary>Construct a Binary Tree from given Inorder and Postorder traversal arrays employing a Divide & Conquer approach.</summary>

### Construct a Binary Tree from given Inorder and Postorder traversal arrays employing a Divide & Conquer approach.

**Definition:**

</details>

<details>
<summary>Convert a Sorted Array into a height-balanced Binary Search Tree using Divide & Conquer.</summary>

### Convert a Sorted Array into a height-balanced Binary Search Tree using Divide & Conquer.

**Definition:**

</details>

<details>
<summary>Convert a Sorted Linked List into a height-balanced Binary Search Tree with a Divide & Conquer method.</summary>

### Convert a Sorted Linked List into a height-balanced Binary Search Tree with a Divide & Conquer method.

**Definition:**

</details>

<details>
<summary>Create a Divide & Conquer algorithm to Sort a linked list.</summary>

### Create a Divide & Conquer algorithm to Sort a linked list.

**Definition:**

</details>

<details>
<summary>Implement an efficient algorithm to Search a 2D Matrix II with a Divide & Conquer approach.</summary>

### Implement an efficient algorithm to Search a 2D Matrix II with a Divide & Conquer approach.

**Definition:**

</details>

<details>
<summary>Code a Divide & Conquer solution for Count of Smaller Numbers After Self in an array.</summary>

### Code a Divide & Conquer solution for Count of Smaller Numbers After Self in an array.

**Definition:**

</details>

<details>
<summary>Use Divide & Conquer to calculate the Count of Range Sum in an array for given lower and upper bounds.</summary>

### Use Divide & Conquer to calculate the Count of Range Sum in an array for given lower and upper bounds.

**Definition:**

</details>

<details>
<summary>Find the Top K Frequent Elements in an array using a Divide & Conquer strategy.</summary>

### Find the Top K Frequent Elements in an array using a Divide & Conquer strategy.

**Definition:**

</details>

<details>
<summary>Determine the Kth Largest Element in an unsorted array with a Divide & Conquer technique.</summary>

### Determine the Kth Largest Element in an unsorted array with a Divide & Conquer technique.

**Definition:**

</details>

<details>
<summary>Implement a Divide & Conquer algorithm to compute the Number of Ships in a Rectangle on a 2D plane, given top-right and bottom-left coordinates of rectangles.</summary>

### Implement a Divide & Conquer algorithm to compute the Number of Ships in a Rectangle on a 2D plane, given top-right and bottom-left coordinates of rectangles.

**Definition:**

</details>

<details>
<summary>Balance a given Binary Search Tree into a balanced BST using Divide & Conquer.</summary>

### Balance a given Binary Search Tree into a balanced BST using Divide & Conquer.

**Definition:**

</details>

<details>
<summary>Create a Sorted Array through a series of Instructions using a Divide & Conquer and Binary Indexed Tree.</summary>

### Create a Sorted Array through a series of Instructions using a Divide & Conquer and Binary Indexed Tree.

**Definition:**

</details>

<details>
<summary>Use a Divide & Conquer approach to Sort an Array.</summary>

### Use a Divide & Conquer approach to Sort an Array.

**Definition:**

</details>

<details>
<summary>Design and implement a Divide & Conquer solution to generate a Beautiful Array.</summary>

### Design and implement a Divide & Conquer solution to generate a Beautiful Array.

**Definition:**

</details>

<details>
<summary>Solve the Longest Increasing Subsequence II problem where updates and queries happen in real-time, using a Divide & Conquer strategy combined with advanced data structures.</summary>

### Solve the Longest Increasing Subsequence II problem where updates and queries happen in real-time, using a Divide & Conquer strategy combined with advanced data structures.

**Definition:**

</details>
