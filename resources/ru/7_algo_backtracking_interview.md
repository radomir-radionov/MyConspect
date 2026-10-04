# Backtracking — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./7_special_algorithms.md)

### Related docs

- [Backtracking — собеседование](./7_algo_backtracking_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Backtracking](https://devinterview.io/questions/data-structures-and-algorithms/backtracking-algorithms-interview-questions/).

### Fundamental Concepts and Techniques

<details>
<summary>What is Backtracking?</summary>

### What is Backtracking?

**Definition:**

Поиск с возвратом собирает кандидата по одному выбору и отменяет последний выбор, как только он не может привести к допустимому решению.

**How it works:**

- Поиск — обход в глубину по частичным решениям. На каждом шаге берут допустимое расширение, уходят в рекурсию и восстанавливают состояние.
- Проверка ограничения на частичном кандидате отсекает целое поддерево. Эта ранняя остановка отличает метод от перечисления всех полных объектов.
- Стек вызовов хранит путь от корня к текущему выбору. Возврат из вызова — это отмена.
- Подходит головоломкам с ограничениями: N ферзей, подмножества с заданной суммой, судоку и порождение перестановок.

**Examples:**

```text
взяли 1, затем 2 -> сумма 3, мало, идём дальше
взяли 1, 2, 4 -> сумма 7, цель, записываем
откат 4, откат 2, пробуем 1 затем 3
```
</details>

<details>
<summary>How does backtracking differ from brute force methods?</summary>

### How does backtracking differ from brute force methods?

**Definition:**

Полный перебор порождает готовых кандидатов и проверяет их в конце. Поиск с возвратом отвергает частичного кандидата и не достраивает ветки под ним.

**How it works:**

- Оба могут быть экспоненциальными. Выигрыш поиска с возвратом — объём отсечения, и он зависит от того, как рано ломается ограничение.
- Перебор перестановок 8 ферзей проверяет 8!. Поиск с возвратом ставит ферзя за ферзём и бросает строку, как только двое делят столбец или диагональ.
- Если ограничение можно проверить только на готовом кандидате, поиск с возвратом вырождается в то же дерево, что и полный перебор.
- Форма кода тоже другая: полный перебор часто собирает объект циклом или рекурсией без отмены неудачного префикса.
</details>

<details>
<summary>Explain the concept of a decision tree in backtracking algorithms.</summary>

### Explain the concept of a decision tree in backtracking algorithms.

**Definition:**

Дерево решений — дерево выборов: каждый уровень — одна переменная, каждое ребро — одно значение, которое можно назначить.

**How it works:**

- Корень — пустое назначение. Лист — либо полное допустимое решение, либо тупик.
- Порядок слева направо среди братьев — порядок перебора значений. Поиск в глубину проходит один путь до листа, прежде чем взять следующего брата.
- Отсечение удаляет узел и всё под ним, когда частичное назначение уже нарушает ограничение.
- Рисунок дерева объясняет алгоритм, даже если реализация — только рекурсивная функция.

**Examples:**

Сумма подмножества на `{1, 2}` с целью 2: первый уровень — «взять 1 или нет», второй — «взять 2 или нет». Путь взять-1, пропустить-2 даёт 1 и умирает. Путь пропустить-1, взять-2 даёт 2 и является листом-решением.
</details>

<details>
<summary>Discuss common optimizations in backtracking to improve efficiency.</summary>

### Discuss common optimizations in backtracking to improve efficiency.

**Definition:**

Оптимизации уменьшают дерево: падать раньше, пробовать перспективные значения первыми или помнить состояние, которое уже решили.

**How it works:**

- Предварительная проверка убирает значения, которые последнее назначение сделало невозможными, ещё до рекурсивного вызова.
- Порядок переменных, например наименьший оставшийся домен, роняет ветку высоко в дереве, а не после длинного префикса.
- Битовые маски и нарастающий счёт обновляют ограничение за O(1) или O(ширина), а не перечитывают всё частичное решение.
- Мемоизация уместна, только когда в одно подсостояние можно прийти разными путями. У чистого перебора перестановок повторов часто нет.
</details>

<details>
<summary>How does backtracking relate to other algorithmic paradigms like divide and conquer?</summary>

### How does backtracking relate to other algorithmic paradigms like divide and conquer?

**Definition:**

Оба рекурсивны, но режут работу по-разному. Разделяй и властвуй решает независимые подзадачи и соединяет их. Поиск с возвратом идёт по одному пути, отменяет его и пробует другой.

**How it works:**

- У разделяй и властвуй подзадачи не делят изменяемую доску. Половинки mergesort можно сортировать отдельно.
- Рекурсивный вызов поиска с возвратом наследует доску и обязан её восстановить, потому что соседнему вызову нужно состояние родителя.
- Задача может использовать оба: шаг разделения, а затем возврат внутри одной области, или поиск с оценкой границы по замкнутой формуле.
- Динамическое программирование — следующий родственник, когда подзадачи повторяются и ответы хранят, а не обходят заново.
</details>

<details>
<summary>Describe the role of state space tree in understanding backtracking algorithms.</summary>

### Describe the role of state space tree in understanding backtracking algorithms.

**Definition:**

Дерево пространства состояний — дерево решений одного прогона: узлы — частичные состояния, и алгоритм посещает только часть из них.

**How it works:**

- Состояние — уже назначенные переменные плюс нарастающие факты, которые вы храните (занятые столбцы, текущая сумма).
- Полное дерево существует как картина. Работающий алгоритм хранит только текущий путь, поэтому лишняя память пропорциональна глубине.
- Перспективный узел ещё имеет допустимое расширение. Бесперспективный нарушает ограничение и не раскрывается.
- Настоящая цена — число посещённых узлов, а не размер полного дерева. Его задают конкретный порядок и правило отсечения.
</details>

<details>
<summary>Explain the concept of constraint satisfaction in backtracking.</summary>

### Explain the concept of constraint satisfaction in backtracking.

**Definition:**

Задача удовлетворения ограничений — набор переменных, домен каждой и ограничения, которым должны подчиняться комбинации. Поиск с возвратом назначает переменные, пока все ограничения не выполнены.

**How it works:**

- Унарные ограничения касаются одной переменной. Бинарные связывают пару, например два ферзя не делят диагональ.
- Частичное назначение проверяют по ограничениям, которые упоминают только уже назначенные переменные. Ждать полного назначения — тратить префикс.
- Распространение ограничений сужает домены после каждого назначения. Согласованность по дуге убирает значение, у которого нет опоры в домене соседа.
- Судоку — стандартная картина: 81 переменная, домены 1–9 и ограничения «все различны» на строки, столбцы и блоки.
</details>

### Implementing Backtracking

<details>
<summary>Outline a method to implement backtracking iteratively.</summary>

### Outline a method to implement backtracking iteratively.

**Definition:**

Явный стек хранит кадры `(индекс переменной, следующее значение, снимок)`, а цикл кладёт и снимает эти кадры вместо стека вызовов.

**How it works:**

- Кладём первую переменную с первым кандидатом. Чтобы углубиться, кладём следующую переменную. Чтобы вернуться, снимаем кадр и сдвигаем значение на новой вершине.
- Отмена — то, что записал кадр: очистить клетку, вернуть сумму или снять выбранный предмет.
- Цикл кончается, когда стек пуст. Кадр, который перебрал все значения, снимается.
- Порядок тот же, что у рекурсии в глубину, и нет переполнения стека вызовов на глубоком назначении. Логику легче сломать, потому что отмена ручная.

**Examples:**

```text
stack: [(col=0, next_row=0)]
поставили ферзя, push (col=1, next_row=0)
тупик -> pop, next_row += 1, пробуем снова
```
</details>

<details>
<summary>What are the considerations for choosing candidates at each step in a backtracking algorithm?</summary>

### What are the considerations for choosing candidates at each step in a backtracking algorithm?

**Definition:**

Кандидат должен быть допустим при уже сделанных назначениях, и порядок перебора меняет, как быстро найдётся первое решение.

**How it works:**

- Порождают из домена и отвергают ограничением, или сразу порождают только значения, которые проходят дешёвую локальную проверку.
- Для первого решения сначала пробуют значения, которые скорее удадутся. Для всех решений порядок не меняет множество, только порядок посещения.
- Наименее ограничивающее значение пробует выбор, который закрывает меньше всего вариантов у соседей.
- Генератор кандидатов, который сам сканирует всю доску, может съесть время, даже когда отсечение хорошее.
</details>

<details>
<summary>Describe the role of pruning in backtracking algorithms.</summary>

### Describe the role of pruning in backtracking algorithms.

**Definition:**

Отсечение отказывается раскрывать узел, чьё частичное назначение уже обречено, поэтому потомки не строятся.

**How it works:**

- Отсечение по допустимости использует жёсткое ограничение: ферзь под боем, сумма уже больше цели, цифра судоку повторилась.
- Отсечение по границе использует оценку: если лучшее возможное завершение хуже уже найденного решения, ветку бросают. Это вариант метода ветвей и границ.
- Отсечение безопасно, только когда проверка не даёт ложных отказов. Проверка, которая отвергает префикс настоящего решения, теряет ответы.
- Тот же алгоритм со слабой проверкой посещает гораздо больше узлов. Корректность может сохраниться, а время взрывается.
</details>

<details>
<summary>How can memoization be integrated with backtracking?</summary>

### How can memoization be integrated with backtracking?

**Definition:**

Мемоизация запоминает ответ подсостояния при первом решении, и поздние пути, которые пришли в то же состояние, берут этот ответ.

**How it works:**

- Ключ должен включать всё, что ещё влияет на результат: индекс старта, оставшуюся цель, маску занятого. Забытое поле вернёт неверный кэш.
- Она помогает поискам в духе суммы подмножества, где много путей делят хвост. Она мало помогает, когда у каждого пути своя доска.
- Память — число различных состояний, и оно может быть больше глубины. Это обычный обмен динамического программирования.
- Хранят булево, счётчик или одно восстановленное решение. Весь список решений хранят, только когда они действительно все нужны.

**Examples:**

Оставшаяся ёмкость рюкзака 7 на предмете 3 — одно состояние. Первый путь его считает. Поздний путь, который тоже пришёл к предмету 3 с ёмкостью 7, читает закэшированное лучшее значение.
</details>

<details>
<summary>Explain the importance of backtracking in recursive algorithm design.</summary>

### Explain the importance of backtracking in recursive algorithm design.

**Definition:**

Поиск с возвратом — стандартная рекурсивная форма «попробовать выбор, исследовать, отменить». Состояние родителя остаётся целым для следующего выбора.

**How it works:**

- Контракт функции: на входе доска допустима, на выходе она не изменилась.
- Забытая отмена — ошибка, из-за которой поздние соседи видят выбор, которого не делали.
- Та же форма порождает сочетания, перестановки и разбиения. Меняются только правило кандидата и ограничение.
- Это ещё и картина парсеров и решателей, которые фиксируют токен или ход и отступают, когда хвост не сошёлся.
</details>

<details>
<summary>Explain the impact of variable ordering on the performance of backtracking algorithms.</summary>

### Explain the impact of variable ordering on the performance of backtracking algorithms.

**Definition:**

Порядок переменных меняет форму дерева. Провал на тесной переменной в начале срезает больше веток, чем провал на ней после длинного префикса.

**How it works:**

- Минимум оставшихся значений берёт следующей переменную с самым маленьким доменом. Домен размера 1 — вынужденный ход, его делают сразу.
- Статический порядок, зафиксированный до поиска, проще и всё ещё может быть плохим, если первые переменные самые свободные.
- Эвристика степени при равенстве выбирает переменную, которая входит в больше всего ограничений.
- Порядок не меняет, существует ли решение. Он меняет, сколько узлов вы тронете, прежде чем это узнаете.

**Examples:**

В судоку клетка с двумя допустимыми цифрами, заполненная раньше клетки с семью, быстрее заканчивает или роняет ветку, чем обратный порядок.
</details>

### Complexity Analysis

<details>
<summary>Explain the time and space complexity of a typical backtracking algorithm.</summary>

### Explain the time and space complexity of a typical backtracking algorithm.

**Definition:**

Время зависит от числа узлов, которые поиск реально посетил. Память зависит от глубины одного пути плюс вывод, если хранить каждое решение.

**How it works:**

- Полное дерево с ветвлением `b` и глубиной `d` — O(bᵈ) узлов. Отсечение уменьшает типичный случай и не меняет худший.
- Работа на узел — цена порождения кандидата и проверки ограничения. Наивный проход может сделать O(bᵈ) узлов ещё дороже.
- Глубина рекурсии — O(d). Явная доска размера d — ещё O(d) памяти.
- Цена, зависящая от вывода, важна: перечислить все перестановки — Θ(n · n!), потому что листьев n! и каждую копируют за O(n).
</details>

<details>
<summary>How do worst-case scenarios in backtracking compare to other algorithms?</summary>

### How do worst-case scenarios in backtracking compare to other algorithms?

**Definition:**

В худшем случае поиск с возвратом всё ещё обходит полное экспоненциальное дерево, того же порядка, что полный перебор, когда каждый частичный кандидат выглядит допустимым до конца.

**How it works:**

- Задача с жёстким ограничением, такая как N ферзей, сильно отсекает типичные доски и всё равно имеет экспоненциальный худший случай.
- Динамическое программирование выигрывает, когда пространство состояний полиномиально и повторяется. Поиск с возвратом без мемоизации пересчитывает эти пересечения.
- Жадный алгоритм или замкнутая форма лучше, когда у задачи есть нужная им структура. Поиск с возвратом — то, чем пользуются, когда её нет.
- Метод ветвей и границ улучшает практический худший поиск в оптимизации за счёт границы и всё равно не обещает полиномиальное время.
</details>

### Classic Backtracking Problems and Challenges

<details>
<summary>Provide a backtracking solution for the N-Queens problem.</summary>

### Provide a backtracking solution for the N-Queens problem.

**Definition:**

</details>

<details>
<summary>Solve a Sudoku puzzle with backtracking.</summary>

### Solve a Sudoku puzzle with backtracking.

**Definition:**

</details>

<details>
<summary>Solve the rat in a maze problem with backtracking.</summary>

### Solve the rat in a maze problem with backtracking.

**Definition:**

</details>

<details>
<summary>Write a backtracking algorithm to generate all permutations of a string.</summary>

### Write a backtracking algorithm to generate all permutations of a string.

**Definition:**

</details>

<details>
<summary>Implement a backtracking solution for the subset sum problem.</summary>

### Implement a backtracking solution for the subset sum problem.

**Definition:**

</details>

<details>
<summary>Develop a backtracking solution to the Crossword Puzzle problem.</summary>

### Develop a backtracking solution to the Crossword Puzzle problem.

**Definition:**

</details>

<details>
<summary>Create a backtracking solution for the Word Search puzzle.</summary>

### Create a backtracking solution for the Word Search puzzle.

**Definition:**

</details>

### Advanced Problem Solving with Backtracking

<details>
<summary>Solve the graph coloring problem backtracking.</summary>

### Solve the graph coloring problem backtracking.

**Definition:**

</details>

<details>
<summary>Implement a backtracking solution for the Knight's Tour problem.</summary>

### Implement a backtracking solution for the Knight's Tour problem.

**Definition:**

</details>

<details>
<summary>Use backtracking approach to solve cryptarithmetic puzzles.</summary>

### Use backtracking approach to solve cryptarithmetic puzzles.

**Definition:**

</details>

<details>
<summary>Solve the Hamiltonian path problem using backtracking.</summary>

### Solve the Hamiltonian path problem using backtracking.

**Definition:**

</details>

<details>
<summary>Solve Word Break problem using backtracking.</summary>

### Solve Word Break problem using backtracking.

**Definition:**

</details>

<details>
<summary>Write a backtracking algorithm for palindrome partitioning of a string.</summary>

### Write a backtracking algorithm for palindrome partitioning of a string.

**Definition:**

</details>

<details>
<summary>Solve the combination sum problem using a backtracking approach.</summary>

### Solve the combination sum problem using a backtracking approach.

**Definition:**

</details>

<details>
<summary>Implement a backtracking algorithm to find all valid IP addresses from a string of numbers.</summary>

### Implement a backtracking algorithm to find all valid IP addresses from a string of numbers.

**Definition:**

</details>

<details>
<summary>Develop a backtracking solution to the "All Paths From Source to Target" problem in a directed graph.</summary>

### Develop a backtracking solution to the "All Paths From Source to Target" problem in a directed graph.

**Definition:**

</details>

### Real-World Applications of Backtracking

<details>
<summary>How is backtracking used in artificial intelligence for games?</summary>

### How is backtracking used in artificial intelligence for games?

**Definition:**

</details>

<details>
<summary>Explain the role of backtracking in network routing optimization.</summary>

### Explain the role of backtracking in network routing optimization.

**Definition:**

</details>

<details>
<summary>How can backtracking be used in optimizing database query solutions?</summary>

### How can backtracking be used in optimizing database query solutions?

**Definition:**

</details>

<details>
<summary>Discuss the use of backtracking in scheduling and planning problems.</summary>

### Discuss the use of backtracking in scheduling and planning problems.

**Definition:**

</details>
