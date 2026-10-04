# Graph Theory — собеседование

Ответы заполнены для опубликованной части, остальные пустые.

[← К обзору](./7_special_algorithms.md)

### Related docs

- [Graph Theory — собеседование](./7_algo_graphs_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Graph Theory](https://devinterview.io/questions/data-structures-and-algorithms/graph-data-structure-interview-questions/).

### Introduction to Graphs

<details>
<summary>What is a Graph?</summary>

### What is a Graph?

**Definition:**

Граф — это множество вершин плюс множество рёбер, которые соединяют пары этих вершин. Он записывает отношения, а не иерархию.

**How it works:**

- Вершина (узел) хранит имя и иногда данные. Ребро соединяет две вершины. Ориентированное ребро — упорядоченная пара; неориентированное — неупорядоченная.
- Петля соединяет вершину с собой. Мультиграф разрешает больше одного ребра между той же парой. Простой граф не разрешает ни того, ни другого.
- Обычны три формы хранения. Матрица смежности — таблица V на V наличия или веса ребра. Список смежности хранит для каждой вершины вершины, куда она указывает. Список рёбер хранит сами пары.
- Матрица отвечает «есть ли ребро?» за O(1) и стоит Θ(V²) памяти. Список стоит Θ(V + E) и является выбором по умолчанию для редких графов. Список рёбер — естественный вход алгоритмов, которые сортируют рёбра, например Kruskal.

**Examples:**

Вершины `{A, B, C}` и неориентированные рёбра `{A-B, B-C}` — путь длины 2. Ребра `A-C` нет.
</details>

<details>
<summary>What are some common Types and Categories of Graphs?</summary>

### What are some common Types and Categories of Graphs?

**Definition:**

Одни и те же вершины классифицируют по направлению, весам, циклам, плотности, связности и тому, разрешены ли повторяющиеся рёбра.

**How it works:**

- Неориентированный: ребро `{u, v}` можно пройти в любую сторону. Ориентированный: ребро `(u, v)` не влечёт `(v, u)`.
- Взвешенный: у каждого ребра есть цена. Невзвешенный: каждое ребро считают ценой 1, поэтому длина пути — число рёбер.
- Циклический: некоторый обход возвращается в старт. Ациклический: такого замкнутого обхода нет. Ориентированный ациклический граф — место для топологического порядка.
- Плотный: E близко к максимуму, Θ(V²) для простого неориентированного графа. Редкий: E гораздо ближе к V.
- Связный: из каждой вершины можно дойти до каждой другой. Несвязный: две или больше компонент. Для орграфа соответствующие понятия — слабая связность (направление игнорируют) и сильная (его уважают).
- Мультиграф разрешает параллельные рёбра. Простой граф не разрешает, и обычно запрещает петли.

**Examples:**

Карта улиц с односторонним движением — ориентированный, взвешенный, редкий граф. Турнир, где каждая пара сыграла один раз, плотный и ориентированный.
</details>

<details>
<summary>What is the difference between a Tree and a Graph?</summary>

### What is the difference between a Tree and a Graph?

**Definition:**

Дерево — особый неориентированный граф: связный, без циклов и поэтому ровно с `V − 1` рёбрами. Общий граф может быть несвязным, цикличным или ориентированным.

**How it works:**

- Граф — вершины плюс рёбра. Рёбра могут быть ориентированными, параллельными или петлями, и у графа может быть несколько компонент.
- Свободное дерево имеет единственный простой путь между каждой парой вершин. Корня нет, пока его не выберете.
- Корневое дерево добавляет корень и направляет каждое ребро от родителя к ребёнку. У каждого узла, кроме корня, один родитель, и цикла нет.
- Графы — про произвольные отношения. Корневые деревья — про иерархию под одним корнем.
- Потеря правила «без цикла» или «связный» возвращает к общим графам. Цикл или второй путь между двумя узлами значит, что структура уже не дерево.

**Examples:**

Оргсхема компании — корневое дерево. Дорожная сеть с двумя маршрутами между теми же городами — граф и не дерево, потому что эти маршруты образуют цикл.
</details>

<details>
<summary>How can you determine the Minimum number of edges for a graph to remain connected?</summary>

### How can you determine the Minimum number of edges for a graph to remain connected?

**Definition:**

Простой неориентированный граф на `n` вершинах связен, только если в нём хотя бы `n − 1` ребро. Этот минимум достигается ровно на деревьях.

**How it works:**

- Начинают с `n` изолированных вершин, это `n` компонент. Каждое новое ребро, которое соединяет две разные компоненты, уменьшает число компонент на один.
- После `n − 1` таких рёбер остаётся одна компонента, и цикла всё ещё нет. Этот граф — дерево, и он связен.
- Меньше чем `n − 1` рёбер не могут собрать `n` вершин в одну компоненту. Больше рёбер можно; они добавляют циклы, и граф остаётся связным.
- Это не то же число, что рёберная связность. Рёберная связность — сколько рёбер нужно удалить, чтобы разъединить уже связный граф, и она не больше наименьшей степени. У дерева `n − 1` ребро и рёберная связность 1.
- Для слабо связного орграфа та же нижняя оценка — `n − 1` ориентированное ребро. Сильная связность требует большего, чем один этот счёт.

**Examples:**

Четырём городам нужно хотя бы три дороги, чтобы сеть была одной связной: путь или звезда. Две дороги всегда оставляют хотя бы один город снаружи или рвут карту.
</details>

<details>
<summary>Define Euler Path and Euler Circuit in the context of graph theory.</summary>

### Define Euler Path and Euler Circuit in the context of graph theory.

**Definition:**

Эйлеров путь проходит каждое ребро ровно один раз. Эйлеров цикл — эйлеров путь, который возвращается в старт. Вершины можно повторять; этим он отличается от гамильтонова пути, который посещает каждую вершину один раз.

**How it works:**

- Степень — число инцидентных рёбер. В орграфе сравнивают полустепень захода с полустепенью исхода.
- Связный неориентированный граф имеет эйлеров цикл тогда и только тогда, когда у каждой вершины чётная степень.
- Он имеет незамкнутый эйлеров путь тогда и только тогда, когда ровно две вершины нечётной степени. Путь обязан начаться в одной из них и кончиться в другой.
- Каждое ребро должно быть достижимо из старта, поэтому рёбра лежат в одной связной компоненте. Изолированные вершины не важны.
- Цикл замкнут: старт и конец — одна вершина. Путь открыт, когда два конца нечётной степени различаются.
- Алгоритм Хирхольцера строит обход, сшивая циклы. Он работает за время, линейное по числу рёбер.

**Examples:**

У квадрата четыре чётные степени и есть эйлеров цикл: обойти периметр. У пути из трёх рёбер два нечётных конца и есть эйлеров путь, а цикла нет.
</details>

### Graph Representations

<details>
<summary>Compare Adjacency Lists and Adjacency Matrices for graph representation.</summary>

### Compare Adjacency Lists and Adjacency Matrices for graph representation.

**Definition:**

Матрица смежности тратит Θ(V²) памяти и отвечает на запрос ребра за O(1). Список смежности тратит Θ(V + E) и быстрее сканируется, когда граф редкий.

**How it works:**

- Память: матрица V на V, даже если большинство ячеек нули. Список хранит каждую вершину один раз и каждое ребро один раз (дважды в неориентированном графе, если хранить оба направления).
- Поиск ребра: матрица читает одну ячейку, O(1). Список сканирует соседей одной вершины, O(степень).
- Полный обход: матрица смотрит каждую ячейку, Θ(V²). Список посещает каждую вершину и каждое сохранённое ребро, Θ(V + E).
- Добавить или удалить ребро: матрица пишет одну ячейку, O(1). Список правит последовательность соседей, O(степень), если соседи не лежат в хеш-множестве.
- Добавить вершину: матрица должна вырасти на строку и столбец, Θ(V²), если её копируют. Список дописывает пустую коллекцию соседей, амортизированное O(1).
- Матрицу берут для плотных графов и для Флойда-Уоршелла. Список — для BFS, DFS и Дейкстры на редких графах.

**Examples:**

Социальный граф из миллиона пользователей с несколькими сотнями друзей у каждого не может хранить матрицу миллион на миллион. Список идентификаторов друзей влезает. Таблица расстояний на 200 вершин влезает в матрицу, и «есть ли ребро?» — одно чтение.
</details>

<details>
<summary>What is an Incidence Matrix, and when would you use it?</summary>

### What is an Incidence Matrix, and when would you use it?

**Definition:**

Матрица инцидентности имеет строку на вершину и столбец на ребро. Каждый столбец отмечает одну или две вершины, которых касается ребро.

**How it works:**

- Неориентированный граф: в столбце 1 у двух концов или одна 2 либо 1 для петли, в зависимости от соглашения. Ориентированный граф часто ставит `+1` у головы и `−1` у хвоста, поэтому сумма столбца равна 0.
- Размер Θ(V · E), это больше списка смежности. Для обхода это плохой выбор по умолчанию.
- Это правильный объект, когда алгоритм про рёбра как про неизвестные: потоки, пространство циклов и разрезы — линейная алгебра на этой матрице.
- Сравнение графов и некоторые схемы баз хранят матрицу, когда и вершины, и рёбра малы и столбцы должны быть рёбрами.
- Рёберные графы и другие преобразования, которые поднимают рёбра до вершин, читают это отношение инцидентности напрямую.

**Examples:**

Ориентированное ребро `A → B` — столбец с `−1` у `A` и `+1` у `B`. Два параллельных ребра — два столбца с одним рисунком, которые матрица смежности схлопнула бы в одну ячейку, если не хранит счётчик.
</details>

<details>
<summary>Discuss Edge List as a graph representation and its use cases.</summary>

### Discuss Edge List as a graph representation and its use cases.

**Definition:**

Список рёбер — массив пар `(u, v)` плюс вес, если граф взвешен. Он хранит рёбра и почти ничего о вершинах степени ноль.

**How it works:**

- Ориентированные и неориентированные графы используют одну форму. Для неориентированного графа либо хранят одну неупорядоченную пару, либо договариваются хранить оба порядка.
- Повторяющиеся пары значат мультиграф. Множество пар значит простой граф.
- «Смежна ли `u` с `v`?» — это проход, Θ(E), если не построен ещё и индекс. Перебор соседей — тот же проход.
- Эта форма — вход Kruskal: сортируют пары по весу и добавляют ребро, когда оно соединяет две компоненты.
- Её компактно передать по сети и легко дописывать. Для BFS она плоха: соседей одной вершины хочется без перечитывания каждого ребра.
- Изолированные вершины невидимы, если отдельно не хранить число вершин.

**Examples:**

```text
edges = [(0, 1, 4), (0, 2, 1), (2, 1, 2)]  # u, v, weight
```

Сортировка по третьему полю: Kruskal рассматривает `(0, 2)`, затем `(2, 1)`, затем `(0, 1)`.
</details>

<details>
<summary>Explain how to save space while storing a graph using Compressed Sparse Row (CSR).</summary>

### Explain how to save space while storing a graph using Compressed Sparse Row (CSR).

**Definition:**

Сжатый разреженный ряд хранит списки смежности редкого графа в двух плоских массивах, поэтому просмотр соседей остаётся последовательным и накладные расходы указателя на ребро исчезают.

**How it works:**

- `indices` (иногда массив столбцов) склеивает все списки соседей. Его длина — число сохранённых дуг.
- `offsets` имеет длину `V + 1`. Соседи вершины `v` занимают `indices[offsets[v] : offsets[v+1]]`.
- Необязательный массив `data` той же длины, что `indices`, хранит вес ребра.
- Память Θ(V + E) с маленькой константой: целые, а не указатели на узлы в куче. Связный список смежности платит указателем за ребро.
- Построение CSR хочет рёбра, сгруппированные по источнику. Вставка одного ребра в середину — это сдвиг, поэтому CSR для графа, который строят один раз и потом обходят.
- Библиотеки матриц используют ту же раскладку для разреженной матрицы. Алгоритм на графе читает её как «строка = вершина».

**Examples:**

```text
вершины 0, 1, 2 с соседями [1, 2], [2], []
offsets = [0, 2, 3, 3]
indices = [1, 2, 2]
```

Соседи вершины 1 — это `indices[2:3]`, то есть `[2]`.
</details>

### Graph Traversal Algorithms

<details>
<summary>Explain the Breadth-First Search (BFS) traversing method.</summary>

### Explain the Breadth-First Search (BFS) traversing method.

**Definition:**

Поиск в ширину посещает вершины в порядке расстояния от источника, слой за слоем по одному ребру. Очередь держит фронт.

**How it works:**

- Помечают источник посещённым и ставят его в очередь.
- Пока очередь не пуста, снимают `u` и ставят в очередь каждого непосещённого соседа `u`, помечая его посещённым в момент постановки, а не в момент снятия. Пометка при постановке не даёт поставить одну вершину дважды.
- В первый раз, когда вершина достигнута, путь, которым её достигли, — кратчайший в невзвешенном графе.
- На списке смежности время Θ(V + E). Очередь в худшем случае держит O(V) вершин, один широкий слой.
- Сам по себе BFS веса не обрабатывает. Неотрицательным весам нужна Дейкстра. Вес 1 на каждом ребре — это ровно BFS.

**Examples:**

```text
queue = [source]; seen = {source}
while queue:
  u = queue.pop(0)
  for v in neighbors(u):
    if v not in seen:
      seen.add(v); parent[v] = u; queue.append(v)
```

На двоичном дереве это посещает корень, затем обоих детей, затем внуков.
</details>

<details>
<summary>Explain the Depth-First Search (DFS) algorithm.</summary>

### Explain the Depth-First Search (DFS) algorithm.

**Definition:**

Поиск в глубину идёт по одному соседу так далеко, как может, затем возвращается и пробует следующего соседа. Фронт — стек или стек вызовов рекурсивной функции.

**How it works:**

- Помечают старт посещённым. Для каждого непосещённого соседа рекурсируют или кладут его в стек.
- Итеративная форма снимает вершину и кладёт её непосещённых соседей. Порядок посещения зависит от того, помечают вершину при укладке или при снятии; помечайте при укладке, если каждую вершину нужно обработать один раз.
- Когда стек пуст, каждая вершина, достижимая из старта, увидена. Другим компонентам нужен другой старт.
- Время Θ(V + E) на списке смежности. Стек в худшем случае O(V), длинный путь, и O(log V) на сбалансированном дереве.
- DFS — инструмент для поиска цикла, топологического порядка и компонент сильной связности. Кратчайших путей он не даёт.

**Examples:**

```text
def dfs(u):
  seen.add(u)
  for v in neighbors(u):
    if v not in seen:
      dfs(v)
```

Из `A` с соседями `B`, затем `C`, и из `B` в `D`, первый спуск посещает `A, B, D` до `C`.
</details>

<details>
<summary>What are the key differences between BFS and DFS?</summary>

### What are the key differences between BFS and DFS?

**Definition:**

BFS раскрывает слой за слоем и использует очередь. DFS уходит вниз по одной ветви и использует стек. В невзвешенном графе только BFS даёт кратчайшие пути.

**How it works:**

- Стратегия: BFS заканчивает каждую вершину на расстоянии `d` до расстояния `d + 1`. DFS заканчивает потомка до следующего соседа.
- Память: BFS может держать целый уровень, Θ(V) в широком графе. DFS держит текущий путь, Θ(V) на длинном пути и гораздо меньше на кустистом мелком графе.
- Кратчайшие пути: в невзвешенном графе дерево BFS — дерево кратчайших путей. Дерево DFS — нет.
- BFS берут для минимума прыжков и для раскраски двудольного графа по слоям. DFS — для циклов, топологической сортировки и компонент связности, когда длина пути не важна.
- Оба — Θ(V + E) времени на списках смежности. Выбор — это порядок и вспомогательная структура, а не асимптотический просмотр графа.

**Examples:**

В лабиринте, где каждый шаг стоит 1, BFS находит выход за наименьшее число шагов. DFS может сначала уйти в длинный тупик и всё равно посетить каждую клетку.
</details>

<details>
<summary>Implement a method to check if there is a Path between two vertices in a graph.</summary>

### Implement a method to check if there is a Path between two vertices in a graph.

**Definition:**

Путь есть, когда обход, начатый в источнике, достигает цели. И DFS, и BFS отвечают на вопрос; ни одному не нужно перечислять все пути.

**How it works:**

- Помечают вершины как увиденные, чтобы цикл не крутился вечно.
- DFS: если текущая вершина — цель, вернуть истину. Иначе рекурсия по каждому неувиденному соседу. Если каждая ветвь неудачна, вернуть ложь.
- BFS делает то же очередью и может остановиться в первый момент, когда цель снята с очереди. Если хранить родителей, это ещё и путь с минимумом прыжков.
- На списке смежности поиск — Θ(V + E) времени и Θ(V) памяти на множество увиденных и на стек или очередь.
- В несвязном графе недостигнутая цель говорит только, что цель не в компоненте источника.

**Examples:**

```text
def reaches(u, target):
  if u == target: return True
  seen.add(u)
  return any(v not in seen and reaches(v, target) for v in neighbors(u))
```
</details>

<details>
<summary>Solve the problem of printing all Paths from a source to destination in a Directed Graph with BFS or DFS.</summary>

### Solve the problem of printing all Paths from a source to destination in a Directed Graph with BFS or DFS.

**Definition:**

Перечисление каждого пути от источника к цели — это DFS, который несёт уже построенный путь и откатывается. Путей может быть экспоненциально много, поэтому время — не Θ(V + E), как только вы их все выписываете.

**How it works:**

- Рекурсия с текущей вершиной и путём от источника. Если текущая вершина — цель, выдать копию пути.
- Иначе дописать каждого неиспользованного соседа, рекурсия, затем снять его. Это снятие и есть откат.
- Множество увиденных вдоль текущего пути не даёт циклам порождать бесконечные обходы. Вершина может появиться на другом пути позже, поэтому пометку снимают на обратном пути. Глобальное «посещено навсегда» отбросило бы поздние пути.
- BFS может хранить целые пути в очереди. Он тоже их перечисляет и тратит больше памяти, потому что много неполных путей сидят в очереди сразу.
- Время и размер выхода следуют числу простых путей, которое может быть экспоненциально по V. Память Θ(V) на один путь DFS плюс то, что вы храните как ответы.

**Examples:**

```text
def walk(u, path):
  if u == target:
    emit(path); return
  for v in neighbors(u):
    if v not in path:
      path.append(v); walk(v, path); path.pop()
```
</details>

### Graph Properties and Types

<details>
<summary>What is a Bipartite Graph? How to detect one?</summary>

### What is a Bipartite Graph? How to detect one?

**Definition:**

Граф двудольный, когда его вершины делятся на два множества и каждое ребро идёт между множествами, а не внутри одного. Равносильно: в нём нет цикла нечётной длины.

**How it works:**

- Красят источник красным и пытаются покрасить каждого соседа синим, затем их соседей красным. Если вершину просят принять оба цвета, граф не двудольный.
- BFS делает это слой за слоем. DFS делает это вдоль рекурсии. И то и другое — раскраска в 2 цвета.
- Запускают раскраску по разу на компоненту. Компонента, до которой не дошли, сама по себе ничего не доказывает.
- Нечётный цикл заставляет две соседние вершины получить один цвет. Чётный цикл красится в 2 цвета чисто.
- На списке смежности проверка — Θ(V + E) времени и Θ(V) памяти на цвета и фронт.

**Examples:**

Квадрат двудольный: противоположные углы делят цвет. Треугольник нет: третье ребро соединяет две вершины, которые первые два ребра уже вынудили на разные стороны, и замыкает одну сторону.
</details>

<details>
<summary>Define Cyclic and Acyclic graphs and explain how to identify them.</summary>

### Define Cyclic and Acyclic graphs and explain how to identify them.

**Definition:**

</details>

<details>
<summary>Explain Planar graphs and the conditions that make a graph planar.</summary>

### Explain Planar graphs and the conditions that make a graph planar.

**Definition:**

</details>

<details>
<summary>What are Dense and Sparse graphs? Discuss their density measures and typical use cases.</summary>

### What are Dense and Sparse graphs? Discuss their density measures and typical use cases.

**Definition:**

</details>

### Graph Algorithms and Complexity

<details>
<summary>Why the complexity of DFS is O(V+E)?</summary>

### Why the complexity of DFS is O(V+E)?

**Definition:**

</details>

<details>
<summary>Provide an implementation for Topological Sort in a Directed Acyclic Graph (DAG).</summary>

### Provide an implementation for Topological Sort in a Directed Acyclic Graph (DAG).

**Definition:**

</details>

<details>
<summary>Write an algorithm to detect a Cycle in an undirected graph.</summary>

### Write an algorithm to detect a Cycle in an undirected graph.

**Definition:**

</details>

<details>
<summary>Discuss the complexity of finding All Pair Shortest Paths in a weighted graph.</summary>

### Discuss the complexity of finding All Pair Shortest Paths in a weighted graph.

**Definition:**

</details>

### Memory and Performance in Graph Operations

<details>
<summary>Why does Breadth-First Search use more memory than Depth-First Search?</summary>

### Why does Breadth-First Search use more memory than Depth-First Search?

**Definition:**

</details>

<details>
<summary>Illustrate the difference in Peak Memory Consumption between DFS and BFS.</summary>

### Illustrate the difference in Peak Memory Consumption between DFS and BFS.

**Definition:**

</details>

<details>
<summary>How can Graph Data Structures be optimized for better Cache Locality?</summary>

### How can Graph Data Structures be optimized for better Cache Locality?

**Definition:**

</details>

<details>
<summary>Discuss methods to Reduce Memory Usage in graph representations.</summary>

### Discuss methods to Reduce Memory Usage in graph representations.

**Definition:**

</details>

### Shortest Path Algorithms

<details>
<summary>What is the difference between BFS and Dijkstra’s algorithms when looking for the shortest path?</summary>

### What is the difference between BFS and Dijkstra’s algorithms when looking for the shortest path?

**Definition:**

</details>

<details>
<summary>Implement Dijkstra’s Algorithm for finding the shortest path in a graph with non-negative edge weights.</summary>

### Implement Dijkstra’s Algorithm for finding the shortest path in a graph with non-negative edge weights.

**Definition:**

</details>

<details>
<summary>How does Bellman-Ford Algorithm differ from Dijkstra’s and where would you use it?</summary>

### How does Bellman-Ford Algorithm differ from Dijkstra’s and where would you use it?

**Definition:**

</details>

<details>
<summary>Explain the concept of Floyd-Warshall Algorithm and its usage.</summary>

### Explain the concept of Floyd-Warshall Algorithm and its usage.

**Definition:**

</details>

### Heuristic-Based Graph Search Algorithms

<details>
<summary>What is `A*` Search?</summary>

### What is `A*` Search?

**Definition:**

</details>

<details>
<summary>What is the heuristic cost function in `A*` Search?</summary>

### What is the heuristic cost function in `A*` Search?

**Definition:**

</details>

<details>
<summary>Explain the difference between Best-First Search and `A*` Search.</summary>

### Explain the difference between Best-First Search and `A*` Search.

**Definition:**

</details>

<details>
<summary>Provide an implementation of the Greedy Best-First Search and compare it to `A*`.</summary>

### Provide an implementation of the Greedy Best-First Search and compare it to `A*`.

**Definition:**

</details>

<details>
<summary>How can you adapt `A*` Search to work on a puzzle game like Sudoku?</summary>

### How can you adapt `A*` Search to work on a puzzle game like Sudoku?

**Definition:**

</details>

### Real-World Applications of Graphs

<details>
<summary>What are some real-world Applications of Graphs?</summary>

### What are some real-world Applications of Graphs?

**Definition:**

</details>

<details>
<summary>Provide some practical examples of using Depth-First Search vs Breadth-First Search.</summary>

### Provide some practical examples of using Depth-First Search vs Breadth-First Search.

**Definition:**

</details>

<details>
<summary>How do social networks use graphs for recommendations and features like friend suggestions?</summary>

### How do social networks use graphs for recommendations and features like friend suggestions?

**Definition:**

</details>

<details>
<summary>Explain how a GPS navigation system might use graph data structures and algorithms.</summary>

### Explain how a GPS navigation system might use graph data structures and algorithms.

**Definition:**

</details>

### Advanced Graph Topics

<details>
<summary>What is a Graph Embedding, and how is it applicable in machine learning?</summary>

### What is a Graph Embedding, and how is it applicable in machine learning?

**Definition:**

</details>

<details>
<summary>Describe the Min-Cut Max-Flow Theorem and its significance in network flow problems.</summary>

### Describe the Min-Cut Max-Flow Theorem and its significance in network flow problems.

**Definition:**

</details>

<details>
<summary>Discuss the concept of Edge Coloring and its applications.</summary>

### Discuss the concept of Edge Coloring and its applications.

**Definition:**

</details>

<details>
<summary>Implement an algorithm that finds the Minimum Spanning Tree of a graph.</summary>

### Implement an algorithm that finds the Minimum Spanning Tree of a graph.

**Definition:**

</details>

<details>
<summary>Explain the importance of Graph Databases and how they differ from traditional relational databases.</summary>

### Explain the importance of Graph Databases and how they differ from traditional relational databases.

**Definition:**

</details>

### Algorithms for Specific Graph Classes

<details>
<summary>Discuss how algorithms might vary when dealing with Weighted vs Unweighted Graphs.</summary>

### Discuss how algorithms might vary when dealing with Weighted vs Unweighted Graphs.

**Definition:**

</details>

<details>
<summary>What special considerations are needed when implementing algorithms for Directed vs Undirected Graphs?</summary>

### What special considerations are needed when implementing algorithms for Directed vs Undirected Graphs?

**Definition:**

</details>

<details>
<summary>Provide an efficient algorithm for finding Articulation Points in a graph.</summary>

### Provide an efficient algorithm for finding Articulation Points in a graph.

**Definition:**

</details>

### Graph Challenges and Problem-Solving

<details>
<summary>Solve the Knight’s tour problem using graph traversal techniques.</summary>

### Solve the Knight’s tour problem using graph traversal techniques.

**Definition:**

</details>

<details>
<summary>How would you design an algorithm to evaluate the connected components of an undirected graph?</summary>

### How would you design an algorithm to evaluate the connected components of an undirected graph?

**Definition:**

</details>

<details>
<summary>Implement a graph solution for the River Crossing Problem.</summary>

### Implement a graph solution for the River Crossing Problem.

**Definition:**

</details>
