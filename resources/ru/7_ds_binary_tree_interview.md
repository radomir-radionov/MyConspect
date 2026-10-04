# Binary Tree — собеседование

Ответы заполнены для опубликованной части, остальные пустые.
[← К обзору](./7_special_data_structures.md)

### Related docs

- [Binary Tree — собеседование](./7_ds_binary_tree_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Binary Tree](https://devinterview.io/questions/data-structures-and-algorithms/binary-tree-data-structure-interview-questions/).

### Fundamental Tree Concepts

<details>
<summary>What is a Tree Data Structure?</summary>

### What is a Tree Data Structure?

**Definition:**

Дерево — связный граф без циклов с иерархией: от каждого узла один путь вверх к корню и дети ниже.

**How it works:**

- Узел хранит значение и ссылки на детей. У корня нет родителя. У листа нет детей.
- Между любыми двумя узлами ровно один путь. Цикл сделал бы это обычным графом.
- Глубина — число рёбер от корня. Высота — число рёбер на самом длинном пути вниз.
- Обычные применения — файловые системы, документы DOM, деревья решений и деревья поиска.
</details>

<details>
<summary>What is a Binary Tree?</summary>

### What is a Binary Tree?

**Definition:**

Двоичное дерево даёт каждому узлу не больше двух детей, обычно левого и правого.

**How it works:**

- У узла может быть только левый, только правый, оба или ни одного. Отсутствующий ребёнок — не пустой узел-заглушка, если вы не рисуете кучу.
- Полное двоичное дерево имеет 0 или 2 детей у каждого узла. Завершённое заполняет уровни слева направо. Идеальное полно и все листья на одной глубине.
- Обходы: симметричный (левый, узел, правый), прямой (узел, левый, правый), обратный (левый, правый, узел). По уровням используют очередь.
- Цепочка из n узлов всё ещё двоичное дерево, и её высота n−1, поэтому алгоритмы, которые на сбалансированном дереве логарифмические, становятся линейными.
</details>

### Specific Tree Types and Data Structures

<details>
<summary>What is Binary Heap?</summary>

### What is Binary Heap?

**Definition:**

Двоичная куча — полное двоичное дерево с порядком родитель-ребёнок, лежащее в массиве. Это очередь с приоритетом, не дерево поиска.

**How it works:**

- Полное здесь значит: все уровни, кроме, возможно, последнего, заполнены, а последний упакован слева. Дети индекса `i` — `2i+1` и `2i+2`.
- Мин-куча кладёт наименьший ключ в корень. Макс-куча — наибольший. Братья не упорядочены.
- Вставка просеивает вверх, удаление края — вниз, оба O(log n). Поиск произвольного ключа — O(n).
- Не путайте с двоичным деревом поиска, где левое поддерево меньше узла, а правое больше.
</details>

<details>
<summary>What is a Binary Search Tree?</summary>

### What is a Binary Search Tree?

**Definition:**

Двоичное дерево поиска упорядочивает ключи: каждый ключ в левом поддереве меньше узла, каждый ключ в правом больше.

**How it works:**

- Поиск, вставка и удаление идут по одному пути от корня и стоят O(высота). На сбалансированном дереве это O(log n). На вставке в отсортированном порядке это O(n).
- Симметричный обход посещает ключи по возрастанию.
- Удаление узла с двумя детьми заменяет его симметричным преемником или предшественником, затем удаляет эту замену со старого места.
- Равным ключам нужна фиксированная политика: отвергать их или всегда слать влево или вправо. Сравнения должны оставаться транзитивными.

**Examples:**

Вставили 5, затем 2, затем 8, затем 1. Поиск 1 идёт левее 5, левее 2 и находит 1.
</details>

<details>
<summary>What is AVL Tree? How to Balance it?</summary>

### What is AVL Tree? How to Balance it?

**Definition:**

AVL-дерево — двоичное дерево поиска, в котором высоты двух детей каждого узла различаются не больше чем на один.

**How it works:**

- Каждый узел хранит баланс: высота(левый) − высота(правый), из {−1, 0, +1}.
- Вставка и удаление обновляют высоты на обратном пути. Первый узел, чей фактор стал ±2, балансируют поворотом.
- Перекос лево-левый или право-правый — один поворот. Лево-правый или право-левый — двойной поворот: сначала ребёнок, потом узел.
- Высота около 1.44 log₂ n, поэтому поиск, вставка и удаление — O(log n). AVL вращается чаще красно-чёрного дерева и ищет чуть быстрее.
</details>

<details>
<summary>What is a Red-Black Tree?</summary>

### What is a Red-Black Tree?

**Definition:**

Красно-чёрное дерево — двоичное дерево поиска с цветом у каждого узла и правилами, которые держат самый длинный путь не длиннее удвоенного самого короткого.

**How it works:**

- Каждый узел красный или чёрный. Корень чёрный. У красного узла только чёрные дети. На каждом пути от узла до листового стража одинаковое число чёрных узлов.
- Вставка красит новый узел красным и чинит перекраской и не больше чем парой поворотов. У удаления больше случаев, и поворотов всё равно постоянное число.
- Высота O(log n), поэтому операции отображения — O(log n). Граница свободнее, чем у AVL, и обновления вращаются реже.
- C++ `std::map` и Java `TreeMap` — типичные красно-чёрные деревья.
</details>

<details>
<summary>How is an AVL Tree different from a B-Tree?</summary>

### How is an AVL Tree different from a B-Tree?

**Definition:**

AVL — двоичное дерево поиска, сбалансированное по высоте, для поиска в памяти. B-дерево — широкое дерево поиска для дисков и страниц.

**How it works:**

- У узла AVL один ключ и не больше двух детей. У узла B-дерева много ключей и много детей, по размеру страницы.
- AVL поворачивается, чтобы починить разрыв высоты 2. B-дерево расщепляет полный узел и при удалении сливает или одалживает, чтобы держать минимальную заполненность.
- Поиск AVL трогает O(log n) узлов, и узлы маленькие. Поиск B-дерева трогает O(log_b n) страниц, и на диске важна именно эта цена.
- Базы и файловые системы используют B-деревья или B+ деревья. Отображения библиотек языков — AVL или красно-чёрные.
</details>

<details>
<summary>How can a Fenwick Tree (Binary Indexed Tree) be beneficial in algorithm design?</summary>

### How can a Fenwick Tree (Binary Indexed Tree) be beneficial in algorithm design?

**Definition:**

Дерево Фенвика хранит префиксные агрегаты в массиве, так что точечное обновление и префиксный запрос оба идут по O(log n) индексам.

**How it works:**

- Индекс `i` отвечает за диапазон, длина которого — младший установленный бит `i`. Прибавление этого бита идёт к следующему префиксу. Сброс — к родителю.
- Оно использует n целых и никаких указателей. Оно проще и плотнее дерева отрезков, когда нужны только префиксные суммы или точечные обновления.
- Сумма диапазона — `prefix(r) − prefix(l−1)`. Обновление диапазона требует второго дерева или трюка с разностным массивом.
- Оно не хранит произвольные диапазоны так гибко, как дерево отрезков, и хочет индексы с единицы.

**Examples:**

Частоты `[0, 3, 2, −1]`. `add(2, 5)` и `prefix(3)` трогают пару слотов, не весь префикс.
</details>

<details>
<summary>What is a Segment Tree, and how does it differ from a traditional binary tree in usage and efficiency?</summary>

### What is a Segment Tree, and how does it differ from a traditional binary tree in usage and efficiency?

**Definition:**

Дерево отрезков — полное двоичное дерево над массивом, где каждый узел хранит агрегат полуоткрытого диапазона.

**How it works:**

- Корень — `[0, n)`. Каждый внутренний узел режет свой диапазон пополам. Листья — одиночные индексы.
- Точечное обновление пересчитывает O(log n) предков. Запрос диапазона посещает O(log n) узлов, чьи диапазоны покрывают запрос, без линейного прохода.
- Оно для «сумма, минимум или максимум на меняющемся диапазоне», не для поиска по упорядоченному ключу. BST делает обратное.
- Память около 4n узлов в раскладке массива. Построение — O(n).

**Examples:**

Массив `[2, 1, 5, 3]`. Узел `[0, 2)` хранит `2+1`. Запрос `[1, 4)` соединяет лист `1` с узлом `[2, 4)`.
</details>

<details>
<summary>What is a Splay Tree, and how does its splay operation work?</summary>

### What is a Splay Tree, and how does its splay operation work?

**Definition:**

Splay-дерево — двоичное дерево поиска, которое поворотами поднимает запрошенный узел в корень, так что недавно использованные ключи остаются у вершины.

**How it works:**

- Splay использует повороты zig, zig-zig и zig-zag вдоль пути, а не один поворот до корня, который может оставить дерево тонким.
- Поиск, вставка и удаление делают splay затронутого узла. Неудачный поиск делает splay последнего посещённого узла.
- Одна операция может быть O(n). На последовательности амортизированная цена — O(log n) на операцию.
- Биты баланса не нужны. Оно хорошо для локальности: тот же ключ, запрошенный снова, уже в корне.
</details>

<details>
<summary>Explain the concept and structure of a Ternary Tree.</summary>

### Explain the concept and structure of a Ternary Tree.

**Definition:**

Троичное дерево даёт каждому узлу до трёх детей. В троичном дереве поиска эти дети значат меньше, равно и больше для одного символа.

**How it works:**

- Обычное троичное дерево — просто ветвление три, для тернарных куч или узлов выражений с тремя операндами.
- Троичное дерево поиска хранит в узле символ. Левый ребёнок — меньший символ, правый — больший, средний — следующий символ того же слова.
- Поиск слова длины L — O(L log σ) по алфавиту символов, когда боковые деревья сбалансированы. Префиксы делятся как в префиксном дереве, и пустого места меньше, чем у узла trie на 26 детей.
- Это индекс строк, не сбалансированное BST целых ключей.
</details>

<details>
<summary>Describe a Lazy Segment Tree and when it is used over a regular Segment Tree.</summary>

### Describe a Lazy Segment Tree and when it is used over a regular Segment Tree.

**Definition:**

Ленивое дерево отрезков откладывает обновления диапазона, храня ожидающую метку на узле, и проталкивает её детям, только когда поздний запрос их потребует.

**How it works:**

- Прибавление на `[L, R)` помечает O(log n) канонических узлов и сразу обновляет их агрегаты. Дети остаются устаревшими до push.
- Запрос проталкивает метки по пути вниз, поэтому видит обновления, которые покрывают его путь. И обновление, и запрос остаются O(log n).
- Без лени прибавление к диапазону длины n правит n листьев. Этот случай ленивое дерево и избегает.
- Метка должна складываться: два ожидающих прибавления становятся одним. Метка присваивания затирает прибавления. Ошибка в этом сложении портит дерево.
</details>

<details>
<summary>What is a Treap, and how does it combine the properties of a binary search tree and a heap?</summary>

### What is a Treap, and how does it combine the properties of a binary search tree and a heap?

**Definition:**

Декартово дерево хранит в каждом узле ключ и случайный приоритет. Ключи подчиняются порядку BST. Приоритеты — порядку кучи.

**How it works:**

- Вставка ищет по ключу, затем поворотами поднимает новый узел, пока его приоритет не встанет в порядок кучи с родителем.
- Удаление поворотами опускает узел, пока он не станет листом, предпочитая ребёнка с лучшим приоритетом, затем отцепляет его.
- Случайные приоритеты дают ожидаемую высоту O(log n). Отдельного фактора баланса нет.
- Split и merge по ключу — операции, которые делают неявные декартовы деревья удобными для последовательностей.
</details>

### Tree Properties and Operations

<details>
<summary>What is a Balanced Tree?</summary>

### What is a Balanced Tree?

**Definition:**

Сбалансированное дерево держит высоту логарифмической от числа узлов, поэтому путь от корня к листу остаётся коротким после обновлений.

**How it works:**

- AVL, красно-чёрные, B-деревья и декартовы деревья со случайными приоритетами сбалансированы каждое в своём смысле.
- Обычное BST, заполненное в отсортированном порядке, — цепочка и не сбалансировано.
- Именно гарантия делает операции отображения O(log n), а не O(n).
- Баланс стоит полей, поворотов или более широких узлов. Отсортированному массиву, который пишут один раз, это не нужно.
</details>

<details>
<summary>What are advantages and disadvantages of BST?</summary>

### What are advantages and disadvantages of BST?

**Definition:**

BST даёт упорядоченный поиск, преемника и запросы диапазона. Без баланса эти операции идут по высоте и могут быть линейными.

**How it works:**

- Симметричный обход — отсортированная последовательность. Запрос диапазона обходит только нужный кусок.
- Сбалансированное BST делает вставку, удаление и поиск за O(log n) и держит ключи упорядоченными, чего хеш-таблица не делает.
- Несбалансированное BST вырождается в список. Либо рандомизируют вставку, либо берут декартово дерево, либо правила AVL или красно-чёрного.
- Узлы с указателями тяжелее и хуже для кэша, чем отсортированный массив. Массив предпочтителен, когда данные статичны.
</details>

<details>
<summary>How does Inserting or Deleting nodes affect a Red-Black Tree?</summary>

### How does Inserting or Deleting nodes affect a Red-Black Tree?

**Definition:**

</details>

<details>
<summary>What is the time complexity for Insert into Red-Black Tree?</summary>

### What is the time complexity for Insert into Red-Black Tree?

**Definition:**

</details>

<details>
<summary>How does tree balancing improve search operation performance in a tree?</summary>

### How does tree balancing improve search operation performance in a tree?

**Definition:**

</details>

<details>
<summary>Discuss the concept of immutable binary trees and its implications in functional programming.</summary>

### Discuss the concept of immutable binary trees and its implications in functional programming.

**Definition:**

</details>

### Comparisons Between Tree Varieties

<details>
<summary>Explain the difference between Binary Tree and Binary Search Tree.</summary>

### Explain the difference between Binary Tree and Binary Search Tree.

**Definition:**

</details>

<details>
<summary>What is the difference between Heap and Red-Black Tree?</summary>

### What is the difference between Heap and Red-Black Tree?

**Definition:**

</details>

<details>
<summary>Compare Trie vs. Binary Search Trie.</summary>

### Compare Trie vs. Binary Search Trie.

**Definition:**

</details>

<details>
<summary>Compare Red-Black Trees and AVL Trees.</summary>

### Compare Red-Black Trees and AVL Trees.

**Definition:**

</details>

<details>
<summary>When standard BSTs might be preferred over AVL Trees?</summary>

### When standard BSTs might be preferred over AVL Trees?

**Definition:**

</details>

<details>
<summary>Compare the performance of a Splay Tree versus a Red-Black Tree under various operations.</summary>

### Compare the performance of a Splay Tree versus a Red-Black Tree under various operations.

**Definition:**

</details>

<details>
<summary>How does a B+ Tree differ from a B-Tree and in what situations might it be preferred?</summary>

### How does a B+ Tree differ from a B-Tree and in what situations might it be preferred?

**Definition:**

</details>

### Tree Implementations and Traversals

<details>
<summary>Name some ways to implement Priority Queue.</summary>

### Name some ways to implement Priority Queue.

**Definition:**

</details>

<details>
<summary>Classify Tree Traversal Algorithms.</summary>

### Classify Tree Traversal Algorithms.

**Definition:**

</details>

<details>
<summary>Implement Pre-order Traversal of Binary Tree using Recursion.</summary>

### Implement Pre-order Traversal of Binary Tree using Recursion.

**Definition:**

</details>

<details>
<summary>Implement Iterative Pre-order Traversal of a Binary Tree without Recursion.</summary>

### Implement Iterative Pre-order Traversal of a Binary Tree without Recursion.

**Definition:**

</details>

<details>
<summary>Convert a Binary Tree into a Doubly Linked List.</summary>

### Convert a Binary Tree into a Doubly Linked List.

**Definition:**

</details>

<details>
<summary>Build a Binary Expression Tree for the given expression.</summary>

### Build a Binary Expression Tree for the given expression.

**Definition:**

</details>

<details>
<summary>What is Morris Traversal for a Tree? How to implement one?</summary>

### What is Morris Traversal for a Tree? How to implement one?

**Definition:**

</details>

<details>
<summary>Explain how to perform level-order traversal in a binary tree and its applications.</summary>

### Explain how to perform level-order traversal in a binary tree and its applications.

**Definition:**

</details>

<details>
<summary>Describe the use of BFS and DFS in binary trees and how they relate to tree traversals.</summary>

### Describe the use of BFS and DFS in binary trees and how they relate to tree traversals.

**Definition:**

</details>

### Advanced Tree Concepts and Applications

<details>
<summary>Implement a Map data structure using Binary Search Tree.</summary>

### Implement a Map data structure using Binary Search Tree.

**Definition:**

</details>

<details>
<summary>Explain the process of Tree Rotation and its use cases.</summary>

### Explain the process of Tree Rotation and its use cases.

**Definition:**

</details>

<details>
<summary>Discuss the concept of Threaded Binary Trees.</summary>

### Discuss the concept of Threaded Binary Trees.

**Definition:**

</details>

<details>
<summary>In what scenarios would a Recursive Tree Traversal be impractical?</summary>

### In what scenarios would a Recursive Tree Traversal be impractical?

**Definition:**

</details>

<details>
<summary>Discuss the Space Complexity for storing a binary tree.</summary>

### Discuss the Space Complexity for storing a binary tree.

**Definition:**

</details>

<details>
<summary>How to determine if a given binary tree is a full binary tree?</summary>

### How to determine if a given binary tree is a full binary tree?

**Definition:**

</details>

<details>
<summary>What are the characteristics of a perfect binary tree and how do you identify one?</summary>

### What are the characteristics of a perfect binary tree and how do you identify one?

**Definition:**

</details>

<details>
<summary>How can you serialize and deserialize a binary tree?</summary>

### How can you serialize and deserialize a binary tree?

**Definition:**

</details>

<details>
<summary>How to check if a binary tree is height-balanced?</summary>

### How to check if a binary tree is height-balanced?

**Definition:**

</details>

<details>
<summary>Describe the application of Binary Trees in networking (e.g., routing, addressing).</summary>

### Describe the application of Binary Trees in networking (e.g., routing, addressing).

**Definition:**

</details>

<details>
<summary>Explain the concept of Path Sum in a binary tree and how it is calculated.</summary>

### Explain the concept of Path Sum in a binary tree and how it is calculated.

**Definition:**

</details>

<details>
<summary>Find the lowest common ancestor (LCA) of two nodes in a binary tree.</summary>

### Find the lowest common ancestor (LCA) of two nodes in a binary tree.

**Definition:**

</details>

<details>
<summary>Can a binary tree be reconstructed from its inorder and preorder (or postorder) traversals?</summary>

### Can a binary tree be reconstructed from its inorder and preorder (or postorder) traversals?

**Definition:**

</details>

<details>
<summary>Implement a function to check if a binary tree is symmetric (a mirror image of itself).</summary>

### Implement a function to check if a binary tree is symmetric (a mirror image of itself).

**Definition:**

</details>

<details>
<summary>Describe how binary trees can be used in decision-making processes (e.g., decision trees in AI).</summary>

### Describe how binary trees can be used in decision-making processes (e.g., decision trees in AI).

**Definition:**

</details>

<details>
<summary>Discuss the role of binary trees in garbage collection algorithms like the mark-and-sweep algorithm.</summary>

### Discuss the role of binary trees in garbage collection algorithms like the mark-and-sweep algorithm.

**Definition:**

</details>

<details>
<summary>Explain how trie data structures are used in implementing autocomplete features.</summary>

### Explain how trie data structures are used in implementing autocomplete features.

**Definition:**

</details>

<details>
<summary>What is Huffman Coding, and how is a binary tree used in this compression technique?</summary>

### What is Huffman Coding, and how is a binary tree used in this compression technique?

**Definition:**

</details>
