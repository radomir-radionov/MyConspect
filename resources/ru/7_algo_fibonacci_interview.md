# Fibonacci Sequence — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./7_special_algorithms.md)

### Related docs

- [Fibonacci Sequence — собеседование](./7_algo_fibonacci_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Fibonacci Sequence](https://devinterview.io/questions/data-structures-and-algorithms/fibonacci-sequence-interview-questions/).

### Fibonacci Sequence Basics

<details>
<summary>What is the Fibonacci sequence?</summary>

### What is the Fibonacci sequence?

**Definition:**

Последовательность Фибоначчи начинается с `0, 1`, и каждый следующий член — сумма двух предыдущих: `F(n) = F(n-1) + F(n-2)`, при `F(0) = 0` и `F(1) = 1`.

**How it works:**

- Первые члены: `0, 1, 1, 2, 3, 5, 8, 13`. Некоторые тексты начинают с `1, 1`; рекуррентность та же, индекс сдвигается на один.
- Отношение соседних членов стремится к золотому сечению `φ = (1 + √5) / 2 ≈ 1.618`.
- Та же рекуррентность появляется при подсчёте укладок плитки, двоичных строк без двух единиц подряд и листьев наивного дерева рекурсии.
- Прямая рекурсивная функция совпадает с определением и повторяет огромный объём работы. Цикл или таблица пишут каждый член один раз.

**Examples:**

```text
F(0)=0, F(1)=1
F(6)=8, потому что 0,1,1,2,3,5,8
```
</details>

<details>
<summary>Write a function to calculate the nth Fibonacci number using a recursive approach.</summary>

### Write a function to calculate the nth Fibonacci number using a recursive approach.

**Definition:**

Рекурсивная функция возвращает базу для 0 и 1 и иначе возвращает сумму двух меньших вызовов.

**How it works:**

- Если `n` равно 0, вернуть 0. Если `n` равно 1, вернуть 1.
- Иначе вернуть `fib(n-1) + fib(n-2)`.
- Время Θ(φⁿ), что часто записывают как O(2ⁿ). Каждый вызов ветвится надвое, и у дерева рекурсии экспоненциально много листьев.
- Память стека Θ(n), потому что самая глубокая цепочка — это хребет `n-1`, а не всё дерево.
- Мемоизация или цикл убирают повторные вызовы. Сама рекуррентность остаётся той же.

**Examples:**

```text
fib(n):
  if n < 2: return n
  return fib(n-1) + fib(n-2)
```

`fib(5)` возвращает 5 после дерева, которое несколько раз пересчитывает `fib(2)` и `fib(3)`.
</details>

<details>
<summary>Provide a non-recursive implementation for generating the Fibonacci sequence to the nth number.</summary>

### Provide a non-recursive implementation for generating the Fibonacci sequence to the nth number.

**Definition:**

Нерекурсивный Фибоначчи либо идёт циклом от двух семян, либо считает замкнутую форму Бине. В код отдают цикл.

**How it works:**

- Бине: `F(n) = (φⁿ − ψⁿ) / √5`, где `φ = (1+√5)/2` и `ψ = (1−√5)/2`. Округление `φⁿ / √5` до ближайшего целого тоже работает, пока значение с плавающей точкой точно.
- Эта формула — арифметика O(1) и память O(1), и она уезжает, как только `φⁿ` перестаёт помещаться в точный float. Большому `n` нужен точный метод.
- Итеративный метод начинает с `prev = 0`, `curr = 1`. На каждом шаге до `n` пара заменяется на `(curr, prev + curr)`.
- Цикл — Θ(n) времени и Θ(1) дополнительной памяти, если хранить только два последних члена. Хранение всего списка — Θ(n) памяти, и это размер выхода.

**Examples:**

```text
prev, curr = 0, 1
for _ in 2..n:
  prev, curr = curr, prev + curr
return curr if n > 0 else 0
```

После четырёх обновлений пара проходит `1,1`, затем `1,2`, затем `2,3`, затем `3,5`.
</details>

<details>
<summary>What is the time complexity of the recursive Fibonacci solution, and how can this be improved?</summary>

### What is the time complexity of the recursive Fibonacci solution, and how can this be improved?

**Definition:**

Наивная рекурсия экспоненциальна, потому что каждый вызов делает ещё два. Кэш или цикл считают каждый индекс константное число раз.

**How it works:**

- База: вернуть 0 при `n = 0` и 1 при `n = 1`.
- Каждый больший вызов складывает два рекурсивных результата. Дерево вызовов — Θ(φⁿ), часто ограничивают как O(2ⁿ). Глубина стека — Θ(n).
- Мемоизация сохраняет `fib(n)` при первом вычислении. Поздние вызовы возвращают сохранённое. Время падает до Θ(n), кэш — Θ(n) памяти.
- Итеративная пара `(a, b) = (0, 1)`, обновляемая `n` раз, тоже Θ(n) времени и только Θ(1) памяти.
- Возведение матрицы в степень и быстрое удвоение идут дальше, до Θ(log n) арифметических операций, если умножение растущих целых учитывать аккуратно.

**Examples:**

`fib(10)` без кэша делает сотни вызовов. С кэшем заполняет индексы от 2 до 10 по одному разу.
</details>

<details>
<summary>Describe the memoization technique as applied to the Fibonacci sequence calculation.</summary>

### Describe the memoization technique as applied to the Fibonacci sequence calculation.

**Definition:**

Мемоизованный Фибоначчи держит отображение `n` в `F(n)` и заполняет запись только при первом вызове с этим аргументом.

**How it works:**

- На входе, если `n` уже в отображении, вернуть его.
- Если `n` равно 0 или 1, сохранить эту базу и вернуть её.
- Иначе вычислить `fib(n-1) + fib(n-2)`, сохранить сумму под `n` и вернуть её.
- Каждый индекс от 0 до n пишется один раз, поэтому время Θ(n), а не экспонента.
- Отображение держит Θ(n) записей, и рекурсия всё ещё использует Θ(n) стека, пока база не вернётся. Явный цикл этого стека избегает.

**Examples:**

```text
fib(n, memo):
  if n in memo: return memo[n]
  memo[n] = n if n < 2 else fib(n-1, memo) + fib(n-2, memo)
  return memo[n]
```

Второй вызов `fib(40)` после первого — один поиск.
</details>

### Efficient Fibonacci Algorithms

<details>
<summary>Implement an iterative solution to generate the Fibonacci sequence, discussing its time and space complexity.</summary>

### Implement an iterative solution to generate the Fibonacci sequence, discussing its time and space complexity.

**Definition:**

Итеративное решение хранит два последних члена и продвигает их `n` раз. Дерево рекурсии оно не строит.

**How it works:**

- Начинают с `a = 0` и `b = 1`, это `F(0)` и `F(1)`.
- Повторяют `n` раз, если нужно `F(n)`: `a, b = b, a + b`. После `k` шагов `a` равно `F(k)`.
- Один шаг — константная арифметика на текущих целых. На словах фиксированной ширины это Θ(n) времени. На растущих больших целых поздние сложения стоят больше, чем O(1).
- Дополнительная память Θ(1) помимо выхода, против Θ(n) стека у наивной рекурсии и времени Θ(φⁿ).
- Если вызывающему нужна вся последовательность, каждый `a` дописывают в список. Этот список — Θ(n) и является результатом, а не накладными расходами.

**Examples:**

```text
a, b = 0, 1
повторить n раз:
  a, b = b, a + b
# a это F(n)
```

Первые четыре шага `a`: `1, 1, 2, 3`.
</details>

<details>
<summary>Explain the concept of dynamic programming as it relates to the Fibonacci sequence.</summary>

### Explain the concept of dynamic programming as it relates to the Fibonacci sequence.

**Definition:**

Фибоначчи — самый маленький пример DP: рекуррентность пересекается, и однократное сохранение каждого `F(k)` превращает экспоненциальное дерево в линейную цепочку.

**How it works:**

- Оптимальная подструктура — сама рекуррентность. `F(n)` в точности `F(n-1) + F(n-2)`, поэтому ответ собран из меньших ответов.
- Пересечение — это потери наивного дерева: до `F(n-2)` доходят обе ветви.
- DP сверху вниз мемоизирует рекурсивную функцию. DP снизу вверх пишет массив от индекса 2 до n.
- Оба варианта — Θ(n) времени. Массив — явная таблица; карта мемоизации — та же таблица, заполненная в порядке, который обнаруживает рекурсия.
- Две скользящие переменные — это снизу вверх со сжатой памятью. Это всё ещё DP: каждый шаг переиспользует два предыдущих состояния и выбрасывает более старые.

**Examples:**

`t[0] = 0`, `t[1] = 1`, затем `t[i] = t[i-1] + t[i-2]`. Ячейка `t[n]` — ответ, и ни одна ячейка не считалась дважды.
</details>

<details>
<summary>Solve the nth Fibonacci number problem using matrix exponentiation and analyze its efficiency.</summary>

### Solve the nth Fibonacci number problem using matrix exponentiation and analyze its efficiency.

**Definition:**

Шаг от `(F(n), F(n+1))` к следующей паре — умножение на фиксированную матрицу 2×2. Возведение этой матрицы в степень n прыгает прямо к `F(n)`.

**How it works:**

- `[[1, 1], [1, 0]]ⁿ = [[F(n+1), F(n)], [F(n), F(n-1)]]`. Правый верхний элемент — `F(n)`.
- Возведение в степень возведением в квадрат считает степень за Θ(log n) умножений матриц: квадраты дают `M²`, `M⁴` и так далее, и перемножают те множители, чьи биты установлены в `n`.
- Каждое умножение — константная арифметика, если целые фиксированной ширины. У больших целых длина `F(n)` в битах — Θ(n), поэтому каждое умножение дорожает с ростом `n`.
- Дополнительная память — стек Θ(log n) у возведения в квадрат или Θ(1), если возведение в квадрат написано циклом.
- Это та же рекуррентность, что и у цикла. Она пропускает промежуточные числа Фибоначчи, которые не нужны, кроме тех, которые возведение в квадрат всё равно образует.

**Examples:**

```text
M = [[1, 1], [1, 0]]
# правый верхний элемент M^n это F(n)
# M^1 даёт F(1)=1, M^5 даёт F(5)=5
```
</details>

<details>
<summary>Can the nth Fibonacci number be found using the golden ratio, and if so, how would you implement this method?</summary>

### Can the nth Fibonacci number be found using the golden ratio, and if so, how would you implement this method?

**Definition:**

Да. Ближайшее целое к `φⁿ / √5` — это `F(n)`, где `φ = (1 + √5) / 2`. Это формула Бине, в которой меньший член `ψⁿ` уходит в округление.

**How it works:**

- `φ` и `√5` иррациональны, поэтому реализация использует плавающую точку или точный алгебраический тип.
- Двойная точность остаётся точной только пока `F(n)` достаточно мало, чтобы ошибка округления была меньше `0.5`. Примерно после `n = 70` 64-битный float уже не безопасный источник целого.
- Арифметика O(1) для float фиксированной ширины и не строит предыдущие члены.
- Для большого точного `F(n)` используют целочисленный цикл, быстрое удвоение или степень матрицы. Форму золотого сечения оставляют для замкнутой формулы, предельного аргумента или маленького `n`, где округление проверено.

**Examples:**

```text
phi = (1 + sqrt(5)) / 2
F(n) = round(phi**n / sqrt(5))
```

`n = 10` округляется до 55. Не используйте это для `n = 100` в 64-битном float.
</details>

<details>
<summary>Present an approach to precomputing Fibonacci numbers to answer multiple nth Fibonacci queries efficiently.</summary>

### Present an approach to precomputing Fibonacci numbers to answer multiple nth Fibonacci queries efficiently.

**Definition:**

Если много запросов делят верхнюю границу, один раз заполните таблицу до этой границы и отвечайте на каждый запрос по индексу.

**How it works:**

- Пусть `N` — наибольшее `n`, которое спросят, или растите таблицу, когда запрос её превышает.
- Пишут `t[0] = 0`, `t[1] = 1` и `t[i] = t[i-1] + t[i-2]` до `N`. Этот проход — Θ(N) арифметики.
- Запрос `n ≤ N` — это Θ(1): вернуть `t[n]`.
- `q` запросов с максимумом `N` стоят Θ(N + q) вместо Θ(N) на запрос.
- Таблица — Θ(N) памяти, или больше, когда сами целые становятся большими. Если пришёл один запрос, хватает скользящего цикла, и таблица потрачена зря.

**Examples:**

```text
один раз построить до max_n
answer(n) = table[n]
```

Запросы `7, 3, 7` после построения до 7 — три чтения массива: `13, 2, 13`.
</details>

### Fibonacci Variants and Applications

<details>
<summary>How might the Fibonacci sequence be altered to start with two arbitrary initial values? Provide an algorithm for such a sequence.</summary>

### How might the Fibonacci sequence be altered to start with two arbitrary initial values? Provide an algorithm for such a sequence.

**Definition:**

Оставьте тот же шаг сложения и замените семена. Последовательность с `G(0) = a` и `G(1) = b`, затем `G(n) = G(n-1) + G(n-2)`, — последовательность типа Фибоначчи. Числа Люка — случай `a = 2`, `b = 1`.

**How it works:**

- Если `n` равно 0, вернуть `a`. Если `n` равно 1, вернуть `b`. Два семени могут совпадать; рекуррентность этого не запрещает.
- Иначе делают `n - 1` шагов от пары `(a, b)`, каждый раз заменяя её на `(b, a + b)`. Первая компонента становится `G(n)`.
- Время Θ(n), дополнительная память Θ(1), как у обычного Фибоначчи.
- Любая такая последовательность — линейная комбинация стандартной последовательности Фибоначчи, поэтому замкнутая форма и степень матрицы всё ещё применимы после замены начального вектора.

**Examples:**

```text
nth(a, b, n):
  if n == 0: return a
  x, y = a, b
  повторить n-1 раз:
    x, y = y, x + y
  return x
```

`nth(2, 1, 5)` — число Люка 11: `2, 1, 3, 4, 7, 11`.
</details>

<details>
<summary>Explain an algorithm to compute the sum of the first n Fibonacci numbers without generating the entire sequence.</summary>

### Explain an algorithm to compute the sum of the first n Fibonacci numbers without generating the entire sequence.

**Definition:**

Сумма `F(1) + … + F(n)` равна `F(n+2) − 1`. Если включить `F(0) = 0`, сумма до `F(n)` — то же значение. Считают одно более позднее число Фибоначчи и вычитают 1.

**How it works:**

- Тождество: `F(1) + … + F(n) = F(n+2) − 1`. Проверка: `1+1+2+3+5 = 12` и `F(7) − 1 = 13 − 1`.
- Считают `F(n+2)` скользящим циклом, быстрым удвоением или степенью матрицы и вычитают 1. `F(1)` … `F(n)` хранить не нужно.
- Матричная форма — та же матрица Фибоначчи 2×2. Её степень n даёт `F(n+2)` в том углу, который читают, за Θ(log n) умножений.
- Смена семян меняет замкнутую сумму. Для стандартных семян вычитание 1 и есть весь короткий путь.
- Время совпадает с той процедурой Фибоначчи, которую вызывают. Скользящий цикл — Θ(n); степень матрицы — Θ(log n) арифметических операций.

**Examples:**

Сумма первых 6 положительных чисел Фибоначчи: `1+1+2+3+5+8 = 20`, и `F(8) − 1 = 21 − 1 = 20`.
</details>

<details>
<summary>Define the Lucas sequence and detail how a program can generate it.</summary>

### Define the Lucas sequence and detail how a program can generate it.

**Definition:**

Последовательность Люка использует рекуррентность Фибоначчи с семенами `L(0) = 2` и `L(1) = 1`. Члены начинаются так: `2, 1, 3, 4, 7, 11, 18`.

**How it works:**

- `L(n) = L(n-1) + L(n-2)`. Шаг — то же сложение, что у Фибоначчи; меняется только стартовая пара. Это не более дешёвая рекуррентность.
- Цикл от `(2, 1)` даёт `L(n)` за Θ(n) времени и Θ(1) дополнительной памяти.
- Замкнутая форма — `L(n) = φⁿ + ψⁿ`, и это целое, хотя `φ` и `ψ` иррациональны. Форма Бине для Фибоначчи делит на `√5` и затем округляет.
- Люка и Фибоначчи связаны: `L(n) = F(n-1) + F(n+1)`. Если таблица Фибоначчи уже есть, член Люка — одно сложение.

**Examples:**

```text
x, y = 2, 1
повторить n раз:
  x, y = y, x + y
# x это L(n)
```

`L(5) = 11`.
</details>

<details>
<summary>How can the Fibonacci sequence be used to solve the tiling problem, where you need to cover a 2xn rectangle with 2x1 tiles?</summary>

### How can the Fibonacci sequence be used to solve the tiling problem, where you need to cover a 2xn rectangle with 2x1 tiles?

**Definition:**

Число способов замостить доску `2×n` домино `2×1` — число Фибоначчи, потому что левый столбец заставляет разбить задачу на меньшую доску того же вида.

**How it works:**

- Пусть `T(n)` — число замощений `2×n`. `T(0) = 1` (один способ замостить пустоту) и `T(1) = 1` (одно вертикальное домино). Горизонтальное домино закрывает два столбца и обязано идти с парой, поэтому это один кусок ширины 2.
- Замощение либо начинается с вертикального домино и замощения `2×(n-1)`, либо с двух горизонтальных и замощения `2×(n-2)`. Эти случаи не пересекаются.
- Поэтому `T(n) = T(n-1) + T(n-2)`. При таких семенах `T(n) = F(n+1)`, если `F(1) = 1`, `F(2) = 1`, `F(3) = 2`.
- Считают тем же скользящим циклом. Время Θ(n), дополнительная память Θ(1).

**Examples:**

У доски `2×3` три замощения: три вертикальных; два горизонтальных слева и одно вертикальное; одно вертикальное и два горизонтальных справа. `T(3) = 3 = F(4)`.
</details>

### Large Fibonacci Numbers and Modular Arithmetic

<details>
<summary>How to calculate large Fibonacci numbers without encountering integer overflow issues?</summary>

### How to calculate large Fibonacci numbers without encountering integer overflow issues?

**Definition:**

У `F(n)` Θ(n) бит, поэтому целое фиксированной ширины переполняется. Используйте тип, который растёт, или перестаньте хранить всё число, если нужны только остаток или суффикс.

**How it works:**

- Более широкий примитив только откладывает переполнение. `F(93)` уже не влезает в знаковое 64-битное целое. `long` в C++ — не план для `F(1000)`.
- Целые произвольной точности, такие как Python `int` или Java `BigInteger`, выделяют больше разрядов по мере роста числа. Цикл остаётся правильным алгоритмом; каждое сложение дорожает с длиной в битах.
- Если нужно только `F(n) mod m`, берите остаток на каждом шаге. Значения ограничены `m`, и переполнения полного `F(n)` не случается. Период Пизано говорит, что последовательность остатков повторяется.
- Последние `k` десятичных цифр — частный случай `m = 10^k`.
- Ручной массив цифр или массив разрядов по основанию 10⁹ — та же идея, что библиотека больших целых, когда язык её не даёт.

**Examples:**

```text
a, b = 0, 1          # большие целые языка
повторить n раз:
  a, b = b, a + b
```

В языке с фиксированными словами храните `a` и `b` как списки цифр и складывайте их с переносом.
</details>

<details>
<summary>Implement a function that computes the nth Fibonacci number modulo m.</summary>

### Implement a function that computes the nth Fibonacci number modulo m.

**Definition:**

</details>

<details>
<summary>Implement an algorithm to find the last k digits of the nth Fibonacci number.</summary>

### Implement an algorithm to find the last k digits of the nth Fibonacci number.

**Definition:**

</details>

<details>
<summary>Check if a given number is a Fibonacci number.</summary>

### Check if a given number is a Fibonacci number.

**Definition:**

</details>

<details>
<summary>Solve for the nth Fibonacci number using fast doubling.</summary>

### Solve for the nth Fibonacci number using fast doubling.

**Definition:**

</details>

### Fibonacci Sequence in Data Structures

<details>
<summary>How can a Fibonacci heap data structure benefit from the properties of the Fibonacci sequence?</summary>

### How can a Fibonacci heap data structure benefit from the properties of the Fibonacci sequence?

**Definition:**

</details>

<details>
<summary>Implement Fibonacci sequence generation using an array as storage.</summary>

### Implement Fibonacci sequence generation using an array as storage.

**Definition:**

</details>

<details>
<summary>Provide an example of when and why a Fibonacci queue might be preferred over a traditional queue structure.</summary>

### Provide an example of when and why a Fibonacci queue might be preferred over a traditional queue structure.

**Definition:**

</details>

### Advanced Fibonacci Concepts

<details>
<summary>Explain the Pisano Period and how it pertains to the calculation of Fibonacci numbers modulo m.</summary>

### Explain the Pisano Period and how it pertains to the calculation of Fibonacci numbers modulo m.

**Definition:**

</details>

<details>
<summary>What is the relationship between Fibonacci numbers and the Euclidean algorithm for finding the greatest common divisor?</summary>

### What is the relationship between Fibonacci numbers and the Euclidean algorithm for finding the greatest common divisor?

**Definition:**

</details>

<details>
<summary>Can you prove that the sum of n Fibonacci numbers is equivalent to the (n+2)nd Fibonacci number minus 1?</summary>

### Can you prove that the sum of n Fibonacci numbers is equivalent to the (n+2)nd Fibonacci number minus 1?

**Definition:**

</details>

### Fibonacci Numbers in Sorting and Searching Algorithms

<details>
<summary>Describe a scenario where Fibonacci numbers can be applied to optimize a search algorithm.</summary>

### Describe a scenario where Fibonacci numbers can be applied to optimize a search algorithm.

**Definition:**

</details>

<details>
<summary>Implement a Fibonacci Search algorithm and compare its efficiency with binary search.</summary>

### Implement a Fibonacci Search algorithm and compare its efficiency with binary search.

**Definition:**

</details>

<details>
<summary>Can the Fibonacci sequence optimize the worst-case running time of an algorithm? Provide an example.</summary>

### Can the Fibonacci sequence optimize the worst-case running time of an algorithm? Provide an example.

**Definition:**

</details>

### Fibonacci Sequence Mathematical Questions

<details>
<summary>Prove by induction that the sum of the first n even-indexed Fibonacci numbers is the (n+1)st Fibonacci number minus 1.</summary>

### Prove by induction that the sum of the first n even-indexed Fibonacci numbers is the (n+1)st Fibonacci number minus 1.

**Definition:**

</details>

<details>
<summary>How can Fibonacci numbers be related to the Binet’s formula, and is it practical for computing Fibonacci numbers?</summary>

### How can Fibonacci numbers be related to the Binet’s formula, and is it practical for computing Fibonacci numbers?

**Definition:**

</details>

<details>
<summary>Do Fibonacci numbers have a connection with Pascal’s Triangle?</summary>

### Do Fibonacci numbers have a connection with Pascal’s Triangle?

**Definition:**

</details>

<details>
<summary>Generate the Fibonacci sequence using a two-variable iterative process.</summary>

### Generate the Fibonacci sequence using a two-variable iterative process.

**Definition:**

</details>

### Fibonacci Numbers in Theoretical Computer Science

<details>
<summary>How is the Fibonacci sequence used in the analysis of algorithms, particularly in the derivation of time complexities?</summary>

### How is the Fibonacci sequence used in the analysis of algorithms, particularly in the derivation of time complexities?

**Definition:**

</details>

<details>
<summary>Discuss the significance of the Fibonacci sequence in computational complexity theory and provide an example.</summary>

### Discuss the significance of the Fibonacci sequence in computational complexity theory and provide an example.

**Definition:**

</details>

### Fibonacci Sequence Interview Challenges

<details>
<summary>Implement a script that generates a spiral matrix filled in with Fibonacci numbers.</summary>

### Implement a script that generates a spiral matrix filled in with Fibonacci numbers.

**Definition:**

</details>
