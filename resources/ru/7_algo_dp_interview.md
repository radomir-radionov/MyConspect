# Dynamic Programming — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./7_special_algorithms.md)

### Related docs

- [Dynamic Programming — собеседование](./7_algo_dp_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Dynamic Programming](https://devinterview.io/questions/data-structures-and-algorithms/dynamic-programming-interview-questions/).

### Basic Dynamic Programming Concepts

<details>
<summary>What is Dynamic Programming and how does it differ from recursion?</summary>

### What is Dynamic Programming and how does it differ from recursion?

**Definition:**

Динамическое программирование решает рекуррентность, сохраняя ответ каждой пересекающейся подзадачи. Обычная рекурсия пересчитывает этот ответ каждый раз, когда дерево вызовов его просит.

**How it works:**

- Рекурсия уменьшает вход до базы. Ничего не хранится, поэтому один и тот же вызов может выполниться экспоненциально часто.
- DP использует ту же рекуррентность, но каждое различное состояние считается константное число раз и затем переиспользуется.
- DP сверху вниз — рекурсия плюс таблица мемоизации: состояние считается, когда оно впервые нужно.
- DP снизу вверх заполняет таблицу от меньших состояний к ответу, обычно циклом.
- Числа Фибоначчи показывают разницу. Наивное дерево вызывает `fib(k)` по разу на каждый путь, который до него доходит. Мемоизация или таблица вызывают его один раз.

**Examples:**

`fib(5)` наивно разворачивается в два вызова `fib(4)` и `fib(3)`, и те повторяют `fib(2)`. Таблица `t[i] = t[i-1] + t[i-2]` пишет каждый индекс один раз.
</details>

<details>
<summary>Can you explain the concept of overlapping subproblems?</summary>

### Can you explain the concept of overlapping subproblems?

**Definition:**

Пересекающиеся подзадачи значат, что одна и та же меньшая задача появляется на многих ветвях рекурсии, и сохранённый ответ можно использовать снова.

**How it works:**

- Повтор и делает кэш окупаемым. Если каждая подзадача уникальна, как две половины merge sort, таблица работу не убирает.
- Фибоначчи — учебное пересечение: `fib(n)` и `fib(n-1)` оба нуждаются в `fib(n-2)`.
- Расстояние редактирования той же формы. Расстояние между префиксом «Saturday» и префиксом «Sunday» достигается больше чем одной цепочкой вставки, удаления и замены.
- Оптимальная подструктура — парное свойство: оптимальный ответ собирается из оптимальных ответов этих повторяющихся кусков. Одного пересечения мало, если куски так не складываются.

**Examples:**

`fib(6)` вызывает `fib(4)` и из `fib(6)`, и из `fib(5)`. Один сохранённый `fib(4)` заменяет целое поддерево.
</details>

<details>
<summary>Define memoization and how it improves performance in Dynamic Programming.</summary>

### Define memoization and how it improves performance in Dynamic Programming.

**Definition:**

Мемоизация хранит результат вызова по его аргументам и возвращает его, когда те же аргументы появляются снова. В DP это способ сверху вниз заполнить таблицу состояний.

**How it works:**

- Первый вызов делает работу и пишет кэш. Поздние вызовы — это поиск.
- Код остаётся близким к рекуррентности, без явного цикла по всем состояниям.
- Считаются только состояния, до которых реально доходит исходный вызов. Это может быть лучше таблицы снизу вверх, которая заполняет больший прямоугольник.
- Цена — сам кэш, глубина рекурсии и любая политика выбрасывания устаревших записей, если функция не является чистой функцией своих аргументов.
- Для Фибоначчи кэш превращает экспоненциальное дерево в одну цепочку новых состояний: Θ(n) времени и Θ(n) записей.

**Examples:**

```text
fib(n):
  if n in cache: return cache[n]
  if n < 2: return n
  cache[n] = fib(n-1) + fib(n-2)
  return cache[n]
```
</details>

<details>
<summary>What is the difference between top-down and bottom-up approaches in Dynamic Programming?</summary>

### What is the difference between top-down and bottom-up approaches in Dynamic Programming?

**Definition:**

Сверху вниз начинают с запрошенного ответа и рекурсируют, кэшируя каждое состояние. Снизу вверх начинают с базы и крутят цикл, пока запрошенный ответ не заполнен.

**How it works:**

- Сверху вниз — рекурсия с мемоизацией. Вызов `fib(n)` просит `fib(n-1)` и `fib(n-2)`, а словарь останавливает повтор.
- Снизу вверх выделяют `t[0] = 0`, `t[1] = 1`, затем ставят `t[i] = t[i-1] + t[i-2]` для `i` от 2 до n.
- Обе схемы используют одну рекуррентность и одну асимптотику, когда нужны все состояния. Сверху вниз может пропустить состояния, которые никто не спросил. Снизу вверх нет стека вызовов, и цикл предсказуем.
- Снизу вверх делает порядок зависимостей явным: ячейка пишется только после ячеек, которые она читает. Сверху вниз обнаруживает этот порядок через рекурсию.

**Examples:**

`fib(4)` сверху вниз вызывает 4, затем 3, затем 2 и на обратном пути сохраняет 2, 3 и 4. Снизу вверх пишет индексы 2, 3 и 4 в этом порядке и не строит стек вызовов.
</details>

<details>
<summary>Explain the importance of state definition in Dynamic Programming solutions.</summary>

### Explain the importance of state definition in Dynamic Programming solutions.

**Definition:**

Состояние — это наименьший набор параметров, который называет подзадачу. Неверный набор либо нельзя рекурсировать, либо он хранит больше, чем нужно рекуррентности.

**How it works:**

- Ясное состояние — это способ назвать пересекающиеся куски и записать переход между ними.
- Хранить только поля, которые читает переход, и значит ограничить таблицу. Лишние поля умножают память.
- Та же дисциплина даёт более короткий код: одна функция или один цикл на состояние, а не гора частных случаев.
- Состояния оптимизации обычно хранят лучшее значение, например максимальную ценность при вместимости рюкзака.
- Состояния подсчёта хранят, сколькими способами можно прийти к этому набору.
- Состояния решения хранят да или нет, например «может ли этот префикс набрать сумму?».

**Examples:**

Рюкзак 0/1: состояние `(i, w)` — лучшая ценность на первых `i` предметах при вместимости `w`. Если выкинуть `i`, переход становится двусмысленным: уже неясно, какой предмет вы решаете.
</details>

### Fundamental Dynamic Programming Problems

<details>
<summary>Compute the Fibonacci sequence using Dynamic Programming.</summary>

### Compute the Fibonacci sequence using Dynamic Programming.

**Definition:**

n-е число Фибоначчи — классическое одномерное DP: `F(i) = F(i-1) + F(i-2)` при `F(0) = 0` и `F(1) = 1`.

**How it works:**

- Табуляция выделяет массив и сначала пишет базу.
- Для `i` от 2 до n кладёт в `fib[i]` сумму двух предыдущих ячеек.
- Время Θ(n) против экспоненциального дерева наивной рекурсии.
- Память Θ(n) на массив. Две скользящие переменные срезают это до Θ(1), если нужно только `F(n)`, а не вся последовательность.
- Порядок цикла и есть доказательство, что зависимость выполнена: ячейка пишется только после того, как оба родителя уже есть.

**Examples:**

```text
fib = [0, 1]
for i in 2..n: fib[i] = fib[i-1] + fib[i-2]
return fib[n]
```

`n = 6` пишет `1, 2, 3, 5, 8`.
</details>

<details>
<summary>Implement a solution to the Coin Change Problem using DP.</summary>

### Implement a solution to the Coin Change Problem using DP.

**Definition:**

Задача о размене (минимум монет) просит наименьшее число монет из списка номиналов, которые в сумме дают `amount`.

**How it works:**

- Пусть `dp[x]` — минимум монет, дающих сумму `x`. `dp[0] = 0`, остальные ячейки — страж больше `amount`, например `amount + 1`.
- Для каждой суммы `x` от 1 до `amount` и каждой монеты `c`, если `c <= x`, то `dp[x] = min(dp[x], 1 + dp[x - c])`.
- Единица — монета, которую только что взяли. `dp[x - c]` — лучший способ набрать остаток.
- Если `dp[amount]` всё ещё страж, комбинации нет.
- Время Θ(amount × число монет). Память Θ(amount).
- Этот порядок разрешает брать монету сколько угодно раз. Вариант 0/1 шёл бы по монетам снаружи и по суммам вниз.

**Examples:**

Монеты `[1, 2, 5]`, сумма `11`. Один оптимальный набор — `5 + 5 + 1`, ответ 3. `dp[11]` заканчивается на 3.
</details>

<details>
<summary>Use Dynamic Programming approach to solve the 0/1 Knapsack problem.</summary>

### Use Dynamic Programming approach to solve the 0/1 Knapsack problem.

**Definition:**

Рюкзак 0/1 берёт каждый предмет не больше одного раза. Нужно подмножество веса не больше `W` с максимальной ценностью.

**How it works:**

- Состояние `dp[i][w]` — лучшая ценность на первых `i` предметах при вместимости `w`.
- Таблица имеет `(n + 1)` строк и `(W + 1)` столбцов. Строка 0 и столбец 0 остаются нулями.
- Если предмет `i` тяжелее `w`, копируют `dp[i-1][w]`. Иначе берут максимум из «пропустить» и из `value[i] + dp[i-1][w - weight[i]]`.
- Ответ — `dp[n][W]`. Идут назад от этой ячейки: если ценность изменилась относительно строки выше, предмет взят.
- Время и полная таблица — Θ(n · W). Одна скользящая строка длины `W + 1`, заполняемая справа, сохраняет время и даёт память Θ(W).

**Examples:**

Предметы `(вес 2, ценность 3)` и `(вес 3, ценность 4)`, вместимость 5. Оба вместе больше 5. Лучшая ячейка таблицы — 4, только второй предмет, если рядом с первым не влезает третий.
</details>

<details>
<summary>Implement an algorithm for computing the longest common subsequence of two sequences.</summary>

### Implement an algorithm for computing the longest common subsequence of two sequences.

**Definition:**

Наибольшая общая подпоследовательность — самая длинная последовательность, которая есть в обоих входах в том же порядке, не обязательно подряд.

**How it works:**

- Пусть длины строк `m` и `n`. `L[i][j]` — длина LCS первых `i` символов `X` и первых `j` символов `Y`.
- Начинают с нулевой каймы. Если `X[i-1] == Y[j-1]`, то `L[i][j] = L[i-1][j-1] + 1`. Иначе `L[i][j] = max(L[i-1][j], L[i][j-1])`.
- Длина — `L[m][n]`. Чтобы восстановить одну подпоследовательность, идут от этой ячейки: при совпадении выдают символ и шагают по диагонали, иначе шагают к большему соседу.
- Время и память полной матрицы — Θ(m n). Две скользящие строки держат длину в памяти Θ(min(m, n)); восстановить строку всё равно нужно, запоминая выборы.

**Examples:**

`X = ABCD`, `Y = ACBD`. Одна LCS — `ABD`, длина 3. `ACD` — другая той же длины.
</details>

<details>
<summary>Solve matrix chain multiplication problem with Dynamic Programming.</summary>

### Solve matrix chain multiplication problem with Dynamic Programming.

**Definition:**

Перемножение цепочки матриц выбирает, где расставить скобки в произведении `A1 A2 … An`, чтобы число скалярных умножений было минимальным. Размеры совместимы; меняется только ассоциация.

**How it works:**

- Состояние `(i, j)` — самый дешёвый способ перемножить цепочку от матрицы `i` до матрицы `j`.
- Одна матрица стоит 0. Разрез после матрицы `k` стоит `dp[i][k] + dp[k+1][j]` плюс `rows(i) * cols(k) * cols(j)`.
- Заполняют по возрастанию длины цепочки. Для каждой длины пробуют каждый старт `i` и каждый разрез `k`.
- Оптимальная ассоциация цепочки использует оптимальную ассоциацию по каждую сторону разреза. Аргумент минимума в таблице запоминает `k`, если нужны скобки, а не только цена.
- Время Θ(n³) из трёх вложенных циклов. Таблица Θ(n²).

**Examples:**

Размеры `10×30`, `30×5`, `5×60`. Разрез после первой матрицы стоит `10*30*5 + 10*5*60 = 4500`. Разрез после второй стоит `30*5*60 + 10*30*60 = 27000`. DP выбирает 4500.
</details>

### Optimizing Dynamic Programming Solutions

<details>
<summary>What are the trade-offs between memoization and tabulation in Dynamic Programming?</summary>

### What are the trade-offs between memoization and tabulation in Dynamic Programming?

**Definition:**

Мемоизация — это рекуррентность сверху вниз с кэшем. Табуляция — цикл снизу вверх, который пишет каждое зависимое состояние до того, как оно понадобится вызывающему.

**How it works:**

- Мемоизация начинает с исходной задачи и считает подзадачу только когда вызов до неё доходит. Недостижимые состояния пропускаются.
- Минусы — накладные расходы рекурсии и стек вызовов глубиной до самой длинной цепочки состояний.
- У табуляции нет рекурсивного стека. Порядок цикла должен совпасть с зависимостями, и это труднее, когда зависимости — не простой порядок индексов.
- Табуляция часто заполняет состояния, которые никому не нужны, если таблица больше множества достижимых состояний.
- Время одного порядка, когда обе схемы трогают одни и те же состояния. Берите мемоизацию, когда достижимое множество редкое или рекуррентность яснее как функция. Берите табуляцию, когда нужен ограниченный стек и плотный скользящий массив.

**Examples:**

Рюкзак, у которого вместимости прыгают большими весами, сверху может не посетить большинство значений `w`. Строка снизу вверх всё равно пишет каждую вместимость.
</details>

<details>
<summary>How do you determine the time complexity of a Dynamic Programming algorithm?</summary>

### How do you determine the time complexity of a Dynamic Programming algorithm?

**Definition:**

Время DP — это число состояний, умноженное на работу, чтобы посчитать одно состояние из тех, от которых оно уже зависит. Память — число состояний, которые вы храните.

**How it works:**

- Считают различные кортежи. Одномерный индекс `i ≤ n` — Θ(n) состояний. Пара `(i, j)` по длинам `m` и `n` — Θ(m n).
- Умножают на переходы, которые пробуют на состояние. Размен монет пробует каждую монету, поэтому оценка Θ(amount × монеты), а не Θ(amount).
- Рекурсия с мемоизацией имеет ту же оценку, как только каждое состояние закэшировано, даже если дерево без кэша было экспоненциальным. Стек — память сверху кэша.
- Одномерный цикл снизу вверх часто Θ(n × работа на ячейку). Двумерная таблица — Θ(m n × работа на ячейку) времени и Θ(m n) памяти, если строку не выбрасывают.
- Сжатие состояния меняет обе оценки: две скользящие переменные Фибоначчи, скользящее окно последней строки или проход строки рюкзака назад, чтобы хватило одного массива.

**Examples:**

Цепочка матриц: Θ(n²) подцепочек, каждая пробует Θ(n) разрезов, итого Θ(n³). Фибоначчи: Θ(n) состояний и Θ(1) работы на каждое, итого Θ(n).
</details>

<details>
<summary>Describe techniques to optimize space complexity in Dynamic Programming problems.</summary>

### Describe techniques to optimize space complexity in Dynamic Programming problems.

**Definition:**

Память падает, когда состояние читает только тонкий срез более ранних состояний, и остальная таблица не обязана существовать целиком.

**How it works:**

- Скользящие переменные: Фибоначчи нужны только два последних числа, и массив Θ(n) становится двумя словами.
- Скользящие строки: LCS и расстояние редактирования читают только предыдущую строку и левого соседа текущей ячейки. Хранят две строки или даже одну строку плюс диагональную переменную.
- Рюкзак 0/1 читает `dp[i-1][w - weight]`, заполняя строку `i`. Идут по `w` вниз в одном массиве, чтобы ещё нужные значения не были затёрты.
- Чередование — та же идея на сетке: посчитали одну диагональ или строку и выбросили её.
- Не мемоизируйте огромное состояние, если решение зависит только от текущей позиции. Клетке лабиринта не нужна копия всего пути.
- Битовые множества упаковывают булев ряд. Так некоторые строковые и рюкзачные DP срезают константу, а не асимптотическую форму, когда состояние — набор достижимых флагов.

**Examples:**

Расстояние редактирования строк длины `n` может держать два массива длины `n + 1` вместо матрицы `(n+1) × (n+1)`. Расстояние — последняя ячейка; полное выравнивание всё ещё требует выборов или полной таблицы.
</details>

<details>
<summary>What is state transition, and how do you derive state transition relations?</summary>

### What is state transition, and how do you derive state transition relations?

**Definition:**

Переход состояния — правило, которое строит ответ одного состояния из нескольких более ранних. Вывести его значит назвать состояние, допустимые ходы, старт и остановку.

**How it works:**

- Записывают поля, которые нужно знать, чтобы продолжать. Этот кортеж и есть состояние.
- Перечисляют выборы в этом кортеже и состояние, куда каждый выбор попадает. Отношение — min, max или сумма по этим попаданиям.
- Начальное состояние — пустой префикс, ноль предметов или база Фибоначчи. Оно должно совпасть с реальным стартом задачи.
- Конечное состояние — где выбора не осталось: вместимость исчерпана, строка съедена или индекс дошёл до `n`.
- Таблица — только память для этих отношений. Без верного отношения порядок заполнения не важен.
- Отношение рюкзака — образец: из `(i, w)` либо остаются в `(i-1, w)`, либо, если предмет влезает, прибавляют его ценность к `(i-1, w - weight)`.

**Examples:**

```text
dp[i][w] = dp[i-1][w]                         если weight[i] > w
dp[i][w] = max(dp[i-1][w],
               value[i] + dp[i-1][w-weight])  иначе
```
</details>

### String-related Dynamic Programming Questions

<details>
<summary>Find the longest palindromic substring in a given string.</summary>

### Find the longest palindromic substring in a given string.

**Definition:**

Наибольшая палиндромная подстрока — самый длинный непрерывный кусок, который одинаково читается вперёд и назад. DP записывает, является ли каждый кусок палиндромом, и хранит самый длинный из тех, что являются.

**How it works:**

- `dp[i][j]` истинно, когда `s[i..j]` — палиндром.
- Каждый кусок длины 1 истинен. Кусок длины 2 истинен, когда два символа совпадают.
- Для более длинного куска `dp[i][j]` истинно, когда `s[i] == s[j]` и `dp[i+1][j-1]` истинно. Заполняют по возрастанию длины, чтобы внутренний кусок уже существовал.
- Следят за `(i, j)` с наибольшим `j - i` среди истинных ячеек.
- Время и булева таблица — Θ(n²). Раскрытие от каждого центра находит тот же ответ за Θ(n²) времени и Θ(1) дополнительной памяти; таблица DP — версия, где зависимость явна.

**Examples:**

`s = "babad"`. И `"bab"`, и `"aba"` — палиндромы длины 3, длиннее нет. Любой из них — верный ответ.
</details>

<details>
<summary>Provide a Dynamic Programming solution for the edit distance problem.</summary>

### Provide a Dynamic Programming solution for the edit distance problem.

**Definition:**

</details>

<details>
<summary>Explain Dynamic Programming on strings with the example of word break problem.</summary>

### Explain Dynamic Programming on strings with the example of word break problem.

**Definition:**

</details>

### Sequence and Subsequence related Problems

<details>
<summary>Solve the Longest Increasing Subsequence problem using Dynamic Programming.</summary>

### Solve the Longest Increasing Subsequence problem using Dynamic Programming.

**Definition:**

</details>

<details>
<summary>Solve the Maximum Sum Increasing Subsequence problem with DP.</summary>

### Solve the Maximum Sum Increasing Subsequence problem with DP.

**Definition:**

</details>

<details>
<summary>Implement an algorithm for finding the number of subsequences with a given sum in an array.</summary>

### Implement an algorithm for finding the number of subsequences with a given sum in an array.

**Definition:**

</details>

### Partitioning Problems

<details>
<summary>Solve the partition problem using Dynamic Programming.</summary>

### Solve the partition problem using Dynamic Programming.

**Definition:**

</details>

<details>
<summary>Provide a Dynamic Programming solution for the subset sum problem.</summary>

### Provide a Dynamic Programming solution for the subset sum problem.

**Definition:**

</details>

<details>
<summary>Solve the Balanced Partition problem dynamically.</summary>

### Solve the Balanced Partition problem dynamically.

**Definition:**

</details>

### Path-finding Dynamic Programming Questions

<details>
<summary>Solve the unique paths problem in a grid with obstacles using DP.</summary>

### Solve the unique paths problem in a grid with obstacles using DP.

**Definition:**

</details>

<details>
<summary>Use Dynamic Programming to solve the minimum cost path problem in a grid.</summary>

### Use Dynamic Programming to solve the minimum cost path problem in a grid.

**Definition:**

</details>

<details>
<summary>Find the longest path in a matrix with given constraints.</summary>

### Find the longest path in a matrix with given constraints.

**Definition:**

</details>

### Advanced Dynamic Programming Problems

<details>
<summary>Solving the word wrap problem using DP.</summary>

### Solving the word wrap problem using DP.

**Definition:**

</details>

<details>
<summary>Implement an algorithm for the maximal square problem in a 2D binary matrix.</summary>

### Implement an algorithm for the maximal square problem in a 2D binary matrix.

**Definition:**

</details>

<details>
<summary>Apply Dynamic Programming to solve the maximum profit in job scheduling.</summary>

### Apply Dynamic Programming to solve the maximum profit in job scheduling.

**Definition:**

</details>

### Dynamic Programming in Graphs

<details>
<summary>How Dynamic Programming can be used for finding shortest paths in graphs (e.g., Floyd-Warshall algorithm)?</summary>

### How Dynamic Programming can be used for finding shortest paths in graphs (e.g., Floyd-Warshall algorithm)?

**Definition:**

</details>

<details>
<summary>How to use Dynamic Programming to find the number of ways to reach a given vertex in a directed acyclic graph?</summary>

### How to use Dynamic Programming to find the number of ways to reach a given vertex in a directed acyclic graph?

**Definition:**

</details>

### Game Theory and Dynamic Programming

<details>
<summary>Implement an algorithm to solve the Nim Game using Dynamic Programming.</summary>

### Implement an algorithm to solve the Nim Game using Dynamic Programming.

**Definition:**

</details>

<details>
<summary>Apply Dynamic Programming to solve the minimax problem in game theory.</summary>

### Apply Dynamic Programming to solve the minimax problem in game theory.

**Definition:**

</details>

### Stochastic Dynamic Programming Questions

<details>
<summary>Can Dynamic Programming be used to solve problems with probabilistic states? Provide an example.</summary>

### Can Dynamic Programming be used to solve problems with probabilistic states? Provide an example.

**Definition:**

</details>

<details>
<summary>How does Stochastic Dynamic Programming differ from deterministic Dynamic Programming, and what are its applications?</summary>

### How does Stochastic Dynamic Programming differ from deterministic Dynamic Programming, and what are its applications?

**Definition:**

</details>
