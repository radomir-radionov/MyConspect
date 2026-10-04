# Recursion — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./7_special_algorithms.md)

### Related docs

- [Recursion — собеседование](./7_algo_recursion_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Recursion](https://devinterview.io/questions/data-structures-and-algorithms/recursion-algorithm-interview-questions/).

### Understanding Recursion

<details>
<summary>How Dynamic Programming is different from Recursion and Memoization?</summary>

### How Dynamic Programming is different from Recursion and Memoization?

**Definition:**

Рекурсия — вызов, который решает меньшую копию той же задачи. Мемоизация — рекурсия плюс кэш. Динамическое программирование — решение определить состояния и переходы так, чтобы каждое состояние решалось один раз; таблица снизу вверх — это DP без рекурсивных вызовов.

**How it works:**

- Обычная рекурсия может пересчитывать одни и те же аргументы на каждой ветви, поэтому наивный Фибоначчи экспоненциален.
- Мемоизация сохраняет форму сверху вниз и запоминает результат при первом появлении этих аргументов. Поздние вызовы — поиски. Заполняются только состояния, до которых доходит исходный вызов.
- DP снизу вверх заполняет каждое состояние, которого требует порядок зависимостей, обычно циклами, и не держит стек вызовов.
- Все три могут выразить одну рекуррентность. Меняется то, сохраняется ли повторная работа и начинаете ли вы с ответа или с базы.
- И кэш, и таблица стоят памяти пропорционально числу хранимых состояний. Рекурсивные формы ещё стоят глубины стека.

**Examples:**

`fib(n)`, который вызывает себя дважды, — рекурсия. Та же функция, которая возвращает сохранённый `fib(n)`, — мемоизация. Цикл `t[i] = t[i-1] + t[i-2]` — DP снизу вверх.
</details>

<details>
<summary>What are some Common Examples of Recursion in computer science?</summary>

### What are some Common Examples of Recursion in computer science?

**Definition:**

Рекурсия подходит, когда значение определено таким же значением на меньшем входе: дерево, диапазон, строка или стопка дисков.

**How it works:**

- Обходы дерева: симметричный порядок посещает левое поддерево, узел, затем правое. Каждый вызов — та же процедура на ребёнке.
- Проверка палиндрома сравнивает концы и рекурсирует на куске между ними.
- Факториал — `n * fact(n-1)` при `fact(0) = 1`.
- Обход каталога вызывает себя на каждом подкаталоге.
- Ханойские башни убирают `n-1` дисков, двигают самый большой, затем кладут `n-1` обратно сверху.
- Merge sort сортирует две половины, затем сливает. Это «разделяй и властвуй»: рекурсия плюс шаг соединения.
- Числа Каталана считают двоичные деревья, правильные скобочные последовательности и триангуляции многоугольника рекуррентностью, которая суммирует произведения меньших чисел Каталана.

**Examples:**

`fact(4)` — это `4 * fact(3)`, что разворачивается в `4*3*2*1`. Обход каталога — та же форма со списком детей вместо `n-1`.
</details>

<details>
<summary>What is the difference between Backtracking and Recursion?</summary>

### What is the difference between Backtracking and Recursion?

**Definition:**

Откат — способ искать в пространстве выборов. Его обычно пишут рекурсией, но сама рекурсия выбор не отменяет.

**How it works:**

- Рекурсия делит задачу на меньшие копии и соединяет их результаты. Merge sort, обходы дерева и факториал никогда не говорят «этот выбор плох, верни прежнее состояние».
- Откат строит кандидата по одному шагу. Когда частичного кандидата нельзя достроить до решения, он отменяет последний шаг и пробует другой.
- Отмена и есть имя: снять ферзя, очистить клетку, убрать ребро из текущего пути.
- Рекурсия без поиска: обходы, «разделяй и властвуй» и рекуррентность DP.
- Откат как поиск: судоку, перестановки и подмножества рюкзака, когда исследуют «взять или пропустить» и бросают ветвь, которая уже превысила вместимость.
- Откат можно писать явным стеком. Рекурсивная форма обычна, потому что стек вызовов хранит выбор, который нужно отменить.

**Examples:**

Перестановки: дописать число, рекурсия, затем снять его. Снятие — это откат. У факториала есть рекурсивный вызов и нечего отменять.
</details>

<details>
<summary>Define Base Case in the context of recursive functions.</summary>

### Define Base Case in the context of recursive functions.

**Definition:**

База — это вход, на который функция отвечает, не вызывая себя. Благодаря ей рекурсия останавливается.

**How it works:**

- Находят наименьший вход, который уже является ответом: `fact(0) = 1`, пустой диапазон в двоичном поиске, отсутствующий ребёнок в обходе дерева.
- Эту проверку ставят до рекурсивного вызова. Если вызов первый, до базы не доходят.
- Каждый рекурсивный вызов должен двигаться к базе. `fact(n)` вызывает `fact(n-1)`, а не `fact(n)`.
- Пропущенная база или шаг не в ту сторону растит стек, пока среда выполнения его не оборвёт.
- У функции может быть больше одной базы. Фибоначчи останавливается и на 0, и на 1.

**Examples:**

```text
fact(n):
  if n == 0: return 1      # база
  return n * fact(n - 1)   # шаг к 0
```
</details>

<details>
<summary>Explain the concept of Recursion Depth and its implications on algorithm complexity.</summary>

### Explain the concept of Recursion Depth and its implications on algorithm complexity.

**Definition:**

Глубина рекурсии — сколько вызовов открыто одновременно, высота стека вызовов. Она ограничивает память стека и не равна общему числу вызовов.

**How it works:**

- Одна цепочка, например `fact(n)`, вызывающий `fact(n-1)`, имеет глубину `n` и тоже Θ(n) вызовов. Время и стек совпадают.
- Двоичное дерево рекурсии может иметь экспоненциально много вызовов и глубину только `n`, как наивный Фибоначчи. Время следует числу вызовов. Стек следует глубине.
- Память кадров — Θ(глубина) плюс то, что хранит каждый кадр. Кадр с массивом размера n делает память хуже, чем одна глубина.
- Устранение хвостового вызова переиспользует один кадр, когда рекурсивный вызов — последнее действие. Не каждый язык это делает, поэтому хвостовая рекурсия всё ещё может переполнить стек.
- Если глубина превысит стек, перепишите алгоритм циклом или явным стеком в куче, либо кэшируйте результаты, чтобы глубина осталась длиной одной цепочки новых состояний.

**Examples:**

`fact(100000)` — одна тонкая цепочка из 100000 кадров и часто умирает переполнением стека, хотя математика тривиальна. Цикл использует один кадр.
</details>

<details>
<summary>How does the Call Stack operate in recursive function calls?</summary>

### How does the Call Stack operate in recursive function calls?

**Definition:**

Каждый вызов кладёт кадр с аргументами, адресом возврата и локальными переменными. Кадр живёт, пока этот вызов не вернётся. Рекурсия — стек таких кадров, по одному на открытый вызов.

**How it works:**

- Вызов `fact(3)` кладёт кадр с `n = 3`. Умножить он ещё не может, поэтому вызывает `fact(2)`, который кладёт ещё один кадр.
- База `fact(0)` или `fact(1)` кладёт кадр, который сразу возвращается. Это снятие — первый возврат.
- Каждый ждущий кадр затем умножает на свой `n` и снимается. Стек разворачивается от самого глубокого вызова назад к исходному вызывающему.
- Максимум кадров — это глубина, а не общее число вызовов за весь запуск. После снятия кадра его память может занять поздний соседний вызов.
- Трассировка стека в отладчике — эта цепочка. Верхний кадр — вызов, который ещё не вернулся.

**Examples:**

```text
fact(3) ждёт
  fact(2) ждёт
    fact(1) возвращает 1
  fact(2) возвращает 2
fact(3) возвращает 6
```
</details>

<details>
<summary>Are there any safety considerations when determining the Recursion Depth? If yes, provide an example.</summary>

### Are there any safety considerations when determining the Recursion Depth? If yes, provide an example.

**Definition:**

Да. Глубина — это предел ресурса. Глубокая или цикличная рекурсия исчерпывает стек вызовов, и атакующий, который управляет глубиной, может превратить это в отказ в обслуживании.

**How it works:**

- Среда выполнения даёт каждому потоку фиксированный стек. За этим пределом процесс поднимает переполнение стека вместо ответа.
- База, до которой не доходят, или обход графа без пометки посещённых вершин — это бесконечная рекурсия. Переполнение — симптом.
- Недоверенный вход, который задаёт `n`, или вложенный документ, который атакующий может сделать сколь угодно глубоким, не следует обходить кадром на уровень. Ограничьте глубину или используйте цикл и стек в куче, который можно ограничить.
- Даже верная рекурсия глубины в десятки тысяч может переполнить стек по умолчанию, рассчитанный на сотни кадров.
- Оптимизация хвостового вызова убирает рост только когда компилятор реально переписывает вызов. Не полагайтесь на неё для безопасности, если язык её не гарантирует.

**Examples:**

Рекурсивный обход JSON по массиву глубины 100 000 из одноэлементных массивов переполнит стек задолго до конца документа. Явный стек с максимальной глубиной возвращает управляемую ошибку.
</details>

### Recursive Algorithms

<details>
<summary>Explain the Depth-First Search algorithm.</summary>

### Explain the Depth-First Search algorithm.

**Definition:**

Поиск в глубину идёт по одному исходящему ребру так далеко, как может, затем возвращается к следующему неиспытанному ребру. Фронт — стек.

**How it works:**

- Помечают старт посещённым, чтобы цикл не возвращался в него.
- Рекурсия по каждому непосещённому соседу или укладка соседей и снятие их в цикле.
- Когда вызов возвращается, пробуют следующего соседа вызывающего. Этот возврат и есть откат.
- Пустой стек значит, что каждая вершина, достижимая из старта, увидена. Другой компоненте нужен новый старт.
- Время Θ(V + E) на списке смежности. Память стека Θ(V) на длинном пути.
- Его берут для циклов, топологического порядка и компонент связности. Кратчайших путей он не даёт.

**Examples:**

```text
def dfs(u):
  seen.add(u)
  for v in neighbors(u):
    if v not in seen:
      dfs(v)
```
</details>

<details>
<summary>Implement a Recursive Algorithm to perform a Binary Search.</summary>

### Implement a Recursive Algorithm to perform a Binary Search.

**Definition:**

Рекурсивный двоичный поиск смотрит на середину текущего диапазона и вызывает себя на той половине, которая ещё может содержать цель.

**How it works:**

- Если диапазон пуст (`lo > hi`), цели нет.
- Пусть `mid = lo + (hi - lo) // 2`. Форма с вычитанием не переполняет фиксированную ширину `lo + hi`.
- Если `a[mid]` — цель, вернуть `mid`. Если цель больше, искать `mid + 1 .. hi`. Если меньше, искать `lo .. mid - 1`.
- Массив уже должен быть упорядочен, а `mid` читаем за O(1).
- Время — Θ(log n) сравнений. Рекурсивная форма использует Θ(log n) кадров стека. Итеративная — Θ(1) дополнительной памяти и столько же сравнений.

**Examples:**

```text
def bsearch(a, target, lo, hi):
  if lo > hi: return -1
  mid = lo + (hi - lo) // 2
  if a[mid] == target: return mid
  if a[mid] < target: return bsearch(a, target, mid + 1, hi)
  return bsearch(a, target, lo, mid - 1)
```
</details>

<details>
<summary>Solve the Tower of Hanoi problem recursively.</summary>

### Solve the Tower of Hanoi problem recursively.

**Definition:**

Ханойские башни переносят `n` дисков с исходного стержня на целевой, используя запасной. За раз двигается один диск, и больший диск никогда не лежит на меньшем.

**How it works:**

- Чтобы перенести `n` дисков с `src` на `dst`, используя `spare`: перенести `n-1` с `src` на `spare` (через `dst`), перенести самый большой диск с `src` на `dst`, затем перенести `n-1` с `spare` на `dst` (через `src`).
- База — `n == 0`: ничего не делать. `n == 1` — один перенос.
- Число переносов — `2^n − 1`. Каждый уровень удваивает работу, поэтому время Θ(2ⁿ).
- Глубина стека Θ(n), один кадр на диск, который ещё ждёт вторую половину своего переноса.
- Рекуррентность вынужденна правилами. Более короткой последовательности, которая им подчиняется, нет.

**Examples:**

```text
hanoi(n, src, dst, spare):
  if n == 0: return
  hanoi(n-1, src, spare, dst)
  перенести диск n с src на dst
  hanoi(n-1, spare, dst, src)
```

Три диска — 7 переносов.
</details>

<details>
<summary>Recursively Check for Palindromes in a string.</summary>

### Recursively Check for Palindromes in a string.

**Definition:**

Строка — палиндром, когда концы совпадают и кусок между ними — палиндром. Пустая строка и один символ — палиндромы.

**How it works:**

- Если длина диапазона 0 или 1, вернуть истину.
- Если первый и последний символы различаются, вернуть ложь.
- Иначе рекурсия на открытом интервале между ними.
- Пропустите это, если нужно игнорировать регистр или пробелы; сначала нормализуйте или передайте индексы и предикат.
- Сравнений Θ(n), и кадров стека Θ(n), если каждый вызов режет новую строку. Передача индексов избегает копий и держит дополнительную память кучи на Θ(1), стек всё ещё Θ(n).
- Два указателя в цикле делают те же сравнения при Θ(1) дополнительной памяти.

**Examples:**

```text
pal(s, i, j):
  if i >= j: return true
  if s[i] != s[j]: return false
  return pal(s, i+1, j-1)
```

`"radar"` совпадает на обоих концах дважды и заканчивает на `"d"`. `"hello"` падает на `h` против `o`.
</details>

<details>
<summary>Explain the process of performing a recursive In-order Tree Traversal.</summary>

### Explain the process of performing a recursive In-order Tree Traversal.

**Definition:**

Симметричный обход двоичного дерева посещает левое поддерево, затем узел, затем правое поддерево. На двоичном дереве поиска этот порядок — порядок ключей по возрастанию.

**How it works:**

- Если узла нет, вернуться. Это база.
- Рекурсия на левого ребёнка, выдать ключ узла, рекурсия на правого ребёнка.
- Стек вызовов держит предков, которые ждут, чтобы выдать себя после того, как их левое поддерево закончится.
- Время Θ(n) на n узлов. Глубина стека — высота, Θ(log n), когда дерево сбалансировано, и Θ(n), когда это хребет.
- Прямой порядок выдаёт узел до детей. Обратный — после обоих детей. Только симметричный «бутерброд» совпадает с порядком сортировки BST.

**Examples:**

```text
inorder(node):
  if node is null: return
  inorder(node.left)
  emit(node.key)
  inorder(node.right)
```

BST с корнем 2, левым 1 и правым 3 выдаёт `1, 2, 3`.
</details>

### Tail Recursion

<details>
<summary>Calculate N-th Fibonacci Number using Tail Recursion.</summary>

### Calculate N-th Fibonacci Number using Tail Recursion.

**Definition:**

Хвостовой Фибоначчи несёт два предыдущих значения аргументами, поэтому рекурсивный вызов — вся оставшаяся работа. После его возврата делать нечего.

**How it works:**

- `go(n, a, b)` возвращает `a`, когда `n` равно 0. Иначе вызывает `go(n-1, b, a+b)`.
- Начинают с `go(n, 0, 1)`. После k шагов `a` равно `F(k)`.
- Время Θ(n). Компилятор с устранением хвостового вызова переиспользует один кадр стека, поэтому дополнительная память Θ(1). Без этого устранения глубина всё ещё Θ(n).
- Это итеративный цикл, записанный так, что последнее действие — вызов. Число сложений он не меняет.

**Examples:**

```text
def fib(n, a=0, b=1):
  if n == 0: return a
  return fib(n-1, b, a+b)
```

`fib(6)` возвращает 8.
</details>

<details>
<summary>Discuss how Tail Recursion can be optimized by compilers and its benefits.</summary>

### Discuss how Tail Recursion can be optimized by compilers and its benefits.

**Definition:**

Оптимизация хвостового вызова переписывает вызов, который является последним действием функции, в прыжок и переиспользует текущий кадр. Хвостовой рекурсивный цикл тогда занимает константный стек.

**How it works:**

- Вызов в хвостовой позиции, когда вызывающий возвращает его результат без изменений. `return f(...)` может быть прыжком. `return n * f(...)` не может, потому что умножение всё ещё ждёт.
- Компилятор заменяет укладку нового кадра обновлением текущих аргументов и переходом к началу.
- Языки семейства Scheme этого требуют. Многие функциональные компиляторы это делают. C, Java и CPython этого не гарантируют, поэтому тот же исходник всё ещё может растить стек.
- Польза в том, что рекурсивное определение цикла остаётся циклом во время выполнения: большое `n` не переполняет стек, и кадр на шаг не платится.
- Экспоненциальную рекурсию линейной это не делает. Наивный Фибоначчи — не хвостовой вызов, потому что оба рекурсивных результата всё ещё нужны.

**Examples:**

`return fact(n-1, acc*n)` — хвостовой вызов. `return n * fact(n-1)` — нет: кадр должен остаться живым, чтобы умножить после возврата вызова.
</details>

<details>
<summary>What is the difference between Head Recursion and Tail Recursion?</summary>

### What is the difference between Head Recursion and Tail Recursion?

**Definition:**

Головная рекурсия сначала делает рекурсивный вызов и использует результат на обратном пути. Хвостовая рекурсия сначала делает работу и делает рекурсивный вызов своим последним действием.

**How it works:**

- Головная рекурсия, как в печати списка снизу или в `n * fact(n-1)`, должна держать кадр живым. Стек держит каждый кадр, пока самый глубокий вызов не вернётся.
- Хвостовая рекурсия передаёт обновлённый аккумулятор в вызов и напрямую возвращает результат этого вызова. После вызова нечего умножать или печатать.
- Для устранения хвостового вызова годится только хвостовая форма. Головной рекурсии всегда нужен стек пропорционально глубине, потому что ожидающая работа и есть суть.
- Ту же функцию можно переписать из головной в хвостовую, добавив аргумент-аккумулятор. Ожидающее умножение факториала становится `acc * n`, переданным вниз.
- «Головная» здесь значит, что вызов происходит до локальной работы, а не особую позицию в файле исходника.

**Examples:**

```text
head(n):                 tail(n, acc):
  if n == 0: return 1     if n == 0: return acc
  return n * head(n-1)    return tail(n-1, acc*n)
```
</details>

<details>
<summary>Use Tail Recursive function to calculate the Factorial of a number.</summary>

### Use Tail Recursive function to calculate the Factorial of a number.

**Definition:**

</details>

<details>
<summary>Can Tail Recursion be more efficient than non-tail recursion? Explain with an example.</summary>

### Can Tail Recursion be more efficient than non-tail recursion? Explain with an example.

**Definition:**

</details>

### Converting Recursive to Iterative

<details>
<summary>Is it always possible to write a Non-Recursive form for every Recursive function?</summary>

### Is it always possible to write a Non-Recursive form for every Recursive function?

**Definition:**

</details>

<details>
<summary>Convert the given Recursive Function into an Iterative Function.</summary>

### Convert the given Recursive Function into an Iterative Function.

**Definition:**

</details>

<details>
<summary>Describe how to simulate the recursive QuickSort algorithm iteratively.</summary>

### Describe how to simulate the recursive QuickSort algorithm iteratively.

**Definition:**

</details>

<details>
<summary>Convert a recursive Depth-First Search to an iterative approach using a Stack.</summary>

### Convert a recursive Depth-First Search to an iterative approach using a Stack.

**Definition:**

</details>

### Recursive Problems in Data Structures

<details>
<summary>Convert a Binary Tree into a Doubly Linked List.</summary>

### Convert a Binary Tree into a Doubly Linked List.

**Definition:**

</details>

<details>
<summary>Reverse a Linked List recursively.</summary>

### Reverse a Linked List recursively.

**Definition:**

</details>

<details>
<summary>Sort a Stack using Recursion.</summary>

### Sort a Stack using Recursion.

**Definition:**

</details>

<details>
<summary>Implement a recursive algorithm to Find the Lowest Common Ancestor in a BST.</summary>

### Implement a recursive algorithm to Find the Lowest Common Ancestor in a BST.

**Definition:**

</details>

<details>
<summary>Solve the problem of recursively Flattening a Multilevel Doubly Linked List.</summary>

### Solve the problem of recursively Flattening a Multilevel Doubly Linked List.

**Definition:**

</details>

<details>
<summary>How would you recursively Serialize and Deserialize a Binary Tree?</summary>

### How would you recursively Serialize and Deserialize a Binary Tree?

**Definition:**

</details>

### Fundamental Recursive Problems

<details>
<summary>Calculate the N-th value of the Fibonacci Sequence recursively.</summary>

### Calculate the N-th value of the Fibonacci Sequence recursively.

**Definition:**

</details>

<details>
<summary>Write a recursive function to calculate Sum of Digits in a number.</summary>

### Write a recursive function to calculate Sum of Digits in a number.

**Definition:**

</details>

<details>
<summary>Implement Merge Sort recursively.</summary>

### Implement Merge Sort recursively.

**Definition:**

</details>

<details>
<summary>Implement a recursive function to Print all Permutations of a given string.</summary>

### Implement a recursive function to Print all Permutations of a given string.

**Definition:**

</details>

<details>
<summary>Generate all Balanced Parentheses using a recursive approach.</summary>

### Generate all Balanced Parentheses using a recursive approach.

**Definition:**

</details>

### Advanced Recursive Problems

<details>
<summary>Use recursive approach to solve the Skyline Problem.</summary>

### Use recursive approach to solve the Skyline Problem.

**Definition:**

</details>

<details>
<summary>Implement a recursive backtracking solution for the Sudoku Solver problem.</summary>

### Implement a recursive backtracking solution for the Sudoku Solver problem.

**Definition:**

</details>

<details>
<summary>Find the K-th Order Statistic in an unsorted list using a recursive strategy.</summary>

### Find the K-th Order Statistic in an unsorted list using a recursive strategy.

**Definition:**

</details>

<details>
<summary>Use a recursive algorithm to detect a Cycle in an Undirected Graph.</summary>

### Use a recursive algorithm to detect a Cycle in an Undirected Graph.

**Definition:**

</details>

<details>
<summary>Find All Possible Full Binary Trees with N nodes recursively.</summary>

### Find All Possible Full Binary Trees with N nodes recursively.

**Definition:**

</details>

### Recursion in Algorithms Design

<details>
<summary>Explain how Divide and Conquer is a form of recursion and give examples.</summary>

### Explain how Divide and Conquer is a form of recursion and give examples.

**Definition:**

</details>

<details>
<summary>Use recursion to solve the Longest Common Subsequence problem.</summary>

### Use recursion to solve the Longest Common Subsequence problem.

**Definition:**

</details>

<details>
<summary>Define the role of recursion in the design of Greedy Algorithms.</summary>

### Define the role of recursion in the design of Greedy Algorithms.

**Definition:**

</details>

<details>
<summary>How is recursion utilized in the Backtracking paradigm for algorithm design?</summary>

### How is recursion utilized in the Backtracking paradigm for algorithm design?

**Definition:**

</details>

<details>
<summary>Illustrate the use of recursion in Dynamic Programming with an example problem.</summary>

### Illustrate the use of recursion in Dynamic Programming with an example problem.

**Definition:**

</details>

### Optimization in Recursive Functions

<details>
<summary>Define Memoization and explain how it optimizes recursive solutions.</summary>

### Define Memoization and explain how it optimizes recursive solutions.

**Definition:**

</details>

<details>
<summary>What’s the impact of Stack Overflow in recursive algorithms and how is it avoided?</summary>

### What’s the impact of Stack Overflow in recursive algorithms and how is it avoided?

**Definition:**

</details>

<details>
<summary>Discuss Space Complexity and how it relates to iterative vs. recursive solutions.</summary>

### Discuss Space Complexity and how it relates to iterative vs. recursive solutions.

**Definition:**

</details>

<details>
<summary>Explain Tail Call Optimization (TCO) and its support in various programming languages.</summary>

### Explain Tail Call Optimization (TCO) and its support in various programming languages.

**Definition:**

</details>

<details>
<summary>Implement a recursive algorithm with an explicit Manual Stack to avoid Stack Overflow.</summary>

### Implement a recursive algorithm with an explicit Manual Stack to avoid Stack Overflow.

**Definition:**

</details>

### Tricky Recursive Cases and Handling

<details>
<summary>How to handle negative input cases in a recursive Absolute Value function?</summary>

### How to handle negative input cases in a recursive Absolute Value function?

**Definition:**

</details>

<details>
<summary>Solve the problem of computing all possible combinations of well-formed m-n pairs recursively.</summary>

### Solve the problem of computing all possible combinations of well-formed m-n pairs recursively.

**Definition:**

</details>

<details>
<summary>Discuss strategies to visually debug recursive functions.</summary>

### Discuss strategies to visually debug recursive functions.

**Definition:**

</details>

<details>
<summary>Recursively determine if a Graph is Connected.</summary>

### Recursively determine if a Graph is Connected.

**Definition:**

</details>

<details>
<summary>Recursively implement a Regular Expression Matcher.</summary>

### Recursively implement a Regular Expression Matcher.

**Definition:**

</details>

### Recursion Theory Questions

<details>
<summary>Explain the relationship between Recursion and Lambda Calculus.</summary>

### Explain the relationship between Recursion and Lambda Calculus.

**Definition:**

</details>
