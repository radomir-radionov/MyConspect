# Linked Lists — собеседование

Ответы заполнены для опубликованной части, остальные пустые.
[← К обзору](./7_special_data_structures.md)

### Related docs

- [Linked Lists — собеседование](./7_ds_linked_lists_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Linked Lists](https://devinterview.io/questions/data-structures-and-algorithms/linked-list-data-structure-interview-questions/).

### Basics of Linked Lists

<details>
<summary>What is a Linked List?</summary>

### What is a Linked List?

**Definition:**

Связный список хранит каждый элемент в своём узле, и каждый узел держит указатель на следующий. Список — это указатель на первый узел.

**How it works:**

- Арифметики индекса нет. Добраться до k-го узла — пройти k ссылок, это O(k).
- Вставка или удаление рядом с узлом, который уже в руках, — O(1): переставить пару указателей. Найти этот узел — дорогая часть.
- Узлы лежат там, куда их положил аллокатор, поэтому проход прыгает по памяти.
- Варианты добавляют указатель на предыдущий, указатель на хвост или ссылку от последнего узла к первому.

**Examples:**

`10 -> 20 -> 30`. Голова указывает на 10. До 20 можно дойти только по next у 10.
</details>

<details>
<summary>What are some pros and cons of Linked List compared to Arrays?</summary>

### What are some pros and cons of Linked List compared to Arrays?

**Definition:**

Список выигрывает, когда вставляют и удаляют в середине и узел уже в руках. Массив выигрывает, когда нужен индекс или плотный проход.

**How it works:**

- Список: склейка за O(1) у известного узла, размер растёт по одному узлу. Массив: индекс за O(1), проход дружелюбный к кэшу, сдвиг в середине O(n).
- Список тратит указатель и часто заголовок кучи на элемент. Массив тратит один блок плюс, может быть, запас ёмкости.
- У списка нет произвольного доступа. Двоичный поиск по обычному списку не занимает O(log n) времени, потому что к середине нельзя прыгнуть.
- Список — для очереди задач, которые переставляют, для движений узла в LRU или для списка свободных блоков аллокатора. Массив — для чисел и индексов.
</details>

<details>
<summary>Explain the difference between Singly Linked Lists and Doubly Linked Lists.</summary>

### Explain the difference between Singly Linked Lists and Doubly Linked Lists.

**Definition:**

Односвязный узел хранит next. Двусвязный хранит next и previous, поэтому можно идти в обе стороны и удалить узел, имея только его.

**How it works:**

- Односвязный: меньше памяти, вставка или удаление после известного узла — O(1). Удаление самого узла требует предыдущий, которого обход только вперёд может не иметь.
- Двусвязный: удаление известного узла — O(1), и можно шагнуть назад. Каждый узел платит вторым указателем.
- Указатель на хвост делает дописывание O(1) в обоих. Без него дописывание односвязного списка идёт до конца.
- Истории браузера и кэшу LRU нужны двойные ссылки. Простому стеку — нет.
</details>

<details>
<summary>How does a Linked List manage memory allocation differently from an Array?</summary>

### How does a Linked List manage memory allocation differently from an Array?

**Definition:**

Массив просит один непрерывный блок. Список просит по одному узлу, и эти узлы не обязаны лежать рядом.

**How it works:**

- Выделение массива не удаётся, если нет одной достаточно большой дыры, даже когда суммарно свободной памяти хватило бы на элементы.
- Выделение списка может удаваться узел за узлом из разбросанных свободных блоков. Оно не удаётся, только когда не влезает один узел.
- Освобождение списка проходит узлы и освобождает каждый или возвращает их в пул. Освобождение массива — один возврат.
- Узел больше полезной нагрузки из-за указателя и заголовка аллокатора. Плотный массив целых плотнее.
</details>

<details>
<summary>What are the basic operations that can be performed on a Linked List?</summary>

### What are the basic operations that can be performed on a Linked List?

**Definition:**

Базовые операции — обход, вставка, удаление и поиск. Цена зависит от того, есть ли уже соседний узел в руках.

**How it works:**

- Вставка в голову — O(1). Вставка после известного узла — O(1). Вставка по индексу сначала идёт туда, O(n).
- Удаление головы — O(1). Удаление после известного узла — O(1) в односвязном списке. Удаление известного узла — O(1) в двусвязном.
- Поиск и индекс — O(n). Прыжка за O(1) нет.
- Разворот, поиск середины двумя указателями и поиск цикла строятся из того же прохода.
</details>

### Advantages and Use Cases of Linked Lists

<details>
<summary>What are some real-life Use Cases of Linked Lists?</summary>

### What are some real-life Use Cases of Linked Lists?

**Definition:**

Списки появляются там, где элементы чаще переставляют указателем, чем ищут по индексу.

**How it works:**

- Плейлист или история браузера, где переходят к следующему и предыдущему и удаляют текущий.
- Список свободной памяти ОС или очередь планировщика, которые забирают и возвращают блоки в середине.
- Кэш LRU: хеш-таблица находит узел, а двусвязный список переносит его в начало за O(1).
- Многочлен или разреженная строка из членов, так что отсутствующие члены не занимают узлов.
</details>

<details>
<summary>When is a Circular Linked List useful?</summary>

### When is a Circular Linked List useful?

**Definition:**

Кольцевой список связывает последний узел с первым, поэтому обход может крутиться вечно и нулевого конца, который проверяют, нет.

**How it works:**

- Планирование по кругу идёт по next и заворачивается без особого случая на хвосте.
- Кольцевой буфер из узлов или вторая половина алгоритма Флойда используют петлю намеренно.
- Вставка и удаление по-прежнему переставляют указатели, и держат курсор, а не голову плюс null.
- Пропущенный выход из обхода — бесконечный цикл. Конец — «вернулись к старту», не «next равен null».
</details>

<details>
<summary>When is Doubly Linked List more efficient than Singly Linked List?</summary>

### When is Doubly Linked List more efficient than Singly Linked List?

**Definition:**

Двусвязный список эффективнее, когда операции нужен предыдущий узел, а прямого прохода, который его уже держит, нет.

**How it works:**

- Удаление узла, найденного по значению, — O(1), как только узел в руках, потому что previous внутри узла. Удаление в односвязном списке идёт ещё раз, чтобы найти предыдущий, если вы его не запомнили.
- Шаг назад или вставка перед узлом — O(1).
- Лишний указатель — чистые накладные расходы, когда вы только кладёте и снимаете в голове.
- Кэши LRU и интрузивные списки в ядрах — обычная причина платить за второй указатель.
</details>

<details>
<summary>Describe a scenario where the use of a Linked List is more suitable than a Dynamic Array.</summary>

### Describe a scenario where the use of a Linked List is more suitable than a Dynamic Array.

**Definition:**

Связный список подходит, когда постоянно склеивают в середине и почти никогда не спрашивают i-й элемент.

**How it works:**

- Таблица кусков текстового редактора может быть списком кусков: вставка абзаца переставляет указатели, а не сдвигает каждый последующий символ.
- Очередь событий, которая удаляет отменённую задачу из середины, когда узел уже в руках, — O(1). Динамический массив сдвигает хвост.
- Список хуже, когда следующий шаг — проход миллионов целых: погоня за указателями проигрывает непрерывному буферу.
- Если нужны и склейка, и индекс, следующий шаг — rope, список с пропусками или сбалансированное дерево кусков, не сырой список.
</details>

### Linked Lists vs. Other Data Structures

<details>
<summary>Compare Array-based vs Linked List stack implementations.</summary>

### Compare Array-based vs Linked List stack implementations.

**Definition:**

Оба стека кладут и снимают с одного конца за O(1). Они различаются выделением памяти, локальностью и тем, что значит «полон».

**How it works:**

- Версия на массиве пишет по индексу вершины. Фиксированный буфер может быть полон. Динамический иногда расширяется.
- Версия на списке вставляет узел в голову и снимает, сдвигая голову. Она выделяет память на каждый push.
- Массив — одна кэш-линия за другой. Список — погоня за указателем.
- Peek — O(1) в обоих случаях. Ни один не является стеком с произвольным доступом.
</details>

<details>
<summary>How do Linked Lists perform in comparison with Trees for various operations?</summary>

### How do Linked Lists perform in comparison with Trees for various operations?

**Definition:**

Список — дерево, ограниченное одним ребёнком, поэтому поиск линейный. Сбалансированное дерево поиска тратит логарифм, чтобы прыгнуть к ключу.

**How it works:**

- Поиск и индекс в списке — O(n). В сбалансированном BST — O(log n).
- Вставка в известную позицию списка — O(1). Вставка в сбалансированное дерево — O(log n), потому что дерево ищет место и, может быть, поворачивается.
- Упорядоченный обход — O(n) у обоих. Константа списка меньше, а проход всё ещё гонится за указателями, если узлы не выделяли вместе.
- Список — для последовательности, которую идут с начала. Дерево — когда ищут по ключу.
</details>

<details>
<summary>When would you use a Linked List over a Hash Table?</summary>

### When would you use a Linked List over a Hash Table?

**Definition:**

Список берут, когда порядок элементов и есть данные или когда склеивают соседей. Хеш-таблицу — когда нужно членство или поиск по ключу.

**How it works:**

- Список хранит порядок вставки без хеша и без коэффициента заполнения. Хеш-таблица — нет, если это не упорядоченный вариант, который прячет список внутри.
- Ключа нет. Дорожки плейлиста и шаги отмены — последовательность, не отображение.
- Хеш-таблица — неверный инструмент для «узел после этого» и верный для «видел ли я этот id».
- Связка обычна: хеш-таблица для поиска за O(1) и список для порядка за O(1), как в LRU.
</details>

### Traversal and Search in Linked Lists

<details>
<summary>Is it possible to Traverse a Linked List in O(n1/2)? (Jump Pointers).</summary>

### Is it possible to Traverse a Linked List in O(n1/2)? (Jump Pointers).

**Definition:**

Прыжковый указатель на части узлов смотрит вперёд примерно на √n шагов, поэтому поиск пропускает большинство узлов и садится в блок длины около √n.

**How it works:**

- Дополнительную ссылку ставят каждые √n узлов. Поиск идёт по прыжкам, пока следующий прыжок не перескочит цель, затем идёт по обычным ссылкам.
- Фаза прыжков и фаза шагов — по O(√n), так что один поиск — O(√n). Построение прыжков — O(n).
- Это уже не голый список. Вы добавили второй указатель и должны чинить прыжки при вставке и удалении, иначе пропуск врёт.
- Список с пропусками обобщает ту же идею на несколько уровней и получает ожидаемые O(log n).

**Examples:**

100 узлов, прыжок каждые 10. Поиск элемента 47 идёт 4 прыжка до 40, затем 7 обычных ссылок.
</details>

<details>
<summary>How to apply Binary Search in O(log n) on a Sorted Linked List? (Skip Lists).</summary>

### How to apply Binary Search in O(log n) on a Sorted Linked List? (Skip Lists).

**Definition:**

Обычный отсортированный список не умеет двоичный поиск за O(log n), потому что середина — это проход. Список с пропусками добавляет ссылки верхних уровней, и поиск спускается как двоичный.

**How it works:**

- Каждый узел есть на уровне 0. На следующий уровень его поднимают с вероятностью около 1/2, как случайное двоичное дерево поверх списка.
- Поиск начинает сверху слева. Идёт вправо, пока следующий ключ ещё ≤ цели, затем спускается на уровень. Ожидаемый поиск — O(log n).
- Вставка поднимает новый узел подбрасываниями монеты и вклеивает его на каждый достигнутый уровень. Ожидаемые вставка и удаление — O(log n).
- O(log n) ожидаемые, не жёсткая граница высоты. Детерминированный список с пропусками или сбалансированное дерево дают худший случай.
</details>

<details>
<summary>Is it possible to do Binary Search on a Doubly Linked List in O(n) time?</summary>

### Is it possible to do Binary Search on a Doubly Linked List in O(n) time?

**Definition:**

Да. На отсортированном двусвязном списке повторные проходы к середине оставшегося диапазона вместе стоят O(n), потому что проходы каждый раз вдвое короче.

**How it works:**

- Первая середина — n/2 шагов, следующая n/4 и так далее. Сумма меньше n, поэтому ходьба по указателям — O(n).
- Число сравнений ключей — O(log n). Во времени доминируют проходы, не сравнения.
- Линейный проход тоже O(n) и с меньшей константой, поэтому такой двоичный поиск не обгоняет прямой обход для одного поиска.
- Это не O(log n). Такую границу дают ссылки с пропусками или дерево, а не только previous и next.

**Examples:**

16 отсортированных узлов. Проход 8, затем 4, затем 2, затем 1. Это 15 шагов, как один проход, и четыре сравнения.
</details>

<details>
<summary>Implement a method to find the middle element of a Linked List.</summary>

### Implement a method to find the middle element of a Linked List.

**Definition:**

</details>

### Implementations and Conversions

<details>
<summary>Implement a Linked List using Stack.</summary>

### Implement a Linked List using Stack.

**Definition:**

</details>

<details>
<summary>Reverse a Singly Linked List using only Two Pointers.</summary>

### Reverse a Singly Linked List using only Two Pointers.

**Definition:**

</details>

<details>
<summary>Convert a Singly Linked List to a Circular Linked List.</summary>

### Convert a Singly Linked List to a Circular Linked List.

**Definition:**

</details>

<details>
<summary>Convert a Singly Linked List to a Doubly Linked List.</summary>

### Convert a Singly Linked List to a Doubly Linked List.

**Definition:**

</details>

<details>
<summary>Implement a Doubly Linked List using Stacks with minimal complexity.</summary>

### Implement a Doubly Linked List using Stacks with minimal complexity.

**Definition:**

</details>

<details>
<summary>Convert a Binary Tree into a Doubly Linked List.</summary>

### Convert a Binary Tree into a Doubly Linked List.

**Definition:**

</details>

### Insertion and Deletion

<details>
<summary>Implement a method to Insert a node at a specific position in a Linked List.</summary>

### Implement a method to Insert a node at a specific position in a Linked List.

**Definition:**

</details>

<details>
<summary>Describe how to Delete a node in a Linked List without having a head pointer.</summary>

### Describe how to Delete a node in a Linked List without having a head pointer.

**Definition:**

</details>

<details>
<summary>Implement an efficient function to Append a node to the end of a Linked List.</summary>

### Implement an efficient function to Append a node to the end of a Linked List.

**Definition:**

</details>

<details>
<summary>Insert an item in a Sorted Linked List, while maintaining order.</summary>

### Insert an item in a Sorted Linked List, while maintaining order.

**Definition:**

</details>

### Algorithms on Linked Lists

<details>
<summary>Explain Floyd’s Cycle Detection Algorithm.</summary>

### Explain Floyd’s Cycle Detection Algorithm.

**Definition:**

</details>

<details>
<summary>Is there an algorithm Better Than Floyd’s for Cycle Detection in linked lists?</summary>

### Is there an algorithm Better Than Floyd’s for Cycle Detection in linked lists?

**Definition:**

</details>

<details>
<summary>Write an algorithm to Shuffle a Linked List.</summary>

### Write an algorithm to Shuffle a Linked List.

**Definition:**

</details>

<details>
<summary>Detect if a List is Cyclic using a Hash Table.</summary>

### Detect if a List is Cyclic using a Hash Table.

**Definition:**

</details>

<details>
<summary>Implement an algorithm to Sort a Linked List.</summary>

### Implement an algorithm to Sort a Linked List.

**Definition:**

</details>

### Merging and Reversing

<details>
<summary>Merge two sorted Singly Linked Lists without creating new nodes.</summary>

### Merge two sorted Singly Linked Lists without creating new nodes.

**Definition:**

</details>

<details>
<summary>Reverse a Linked List recursively.</summary>

### Reverse a Linked List recursively.

**Definition:**

</details>

<details>
<summary>Write a function that Reverse K nodes of the Linked List at a time.</summary>

### Write a function that Reverse K nodes of the Linked List at a time.

**Definition:**

</details>

### Advanced Manipulations

<details>
<summary>Find the N-th element from the end of a Singly Linked List.</summary>

### Find the N-th element from the end of a Singly Linked List.

**Definition:**

</details>

<details>
<summary>Remove Duplicates from an Unsorted Linked List.</summary>

### Remove Duplicates from an Unsorted Linked List.

**Definition:**

</details>

<details>
<summary>Find Common Elements in two given Linked Lists and return them as a new Linked List.</summary>

### Find Common Elements in two given Linked Lists and return them as a new Linked List.

**Definition:**

</details>

<details>
<summary>Split the Linked List into k consecutive parts.</summary>

### Split the Linked List into k consecutive parts.

**Definition:**

</details>

<details>
<summary>Sum two numbers represented as Linked Lists.</summary>

### Sum two numbers represented as Linked Lists.

**Definition:**

</details>

### Special Cases and Challenges

<details>
<summary>Find a Merge Point (Intersection) of two Linked Lists.</summary>

### Find a Merge Point (Intersection) of two Linked Lists.

**Definition:**

</details>

<details>
<summary>Given a Singly Linked List, determine if it is a Palindrome.</summary>

### Given a Singly Linked List, determine if it is a Palindrome.

**Definition:**

</details>

<details>
<summary>Find the length of a Linked List that contains a Cycle.</summary>

### Find the length of a Linked List that contains a Cycle.

**Definition:**

</details>

<details>
<summary>Duplicate a Linked List with Random Pointers using O(1) space.</summary>

### Duplicate a Linked List with Random Pointers using O(1) space.

**Definition:**

</details>

<details>
<summary>Implement a function to check if two Singly Linked Lists intersect without using extra space.</summary>

### Implement a function to check if two Singly Linked Lists intersect without using extra space.

**Definition:**

</details>

<details>
<summary>How would you rotate a Linked List by k places?</summary>

### How would you rotate a Linked List by k places?

**Definition:**

</details>

### Complexity and Analysis

<details>
<summary>Discuss the Time Complexity of various operations in Linked Lists.</summary>

### Discuss the Time Complexity of various operations in Linked Lists.

**Definition:**

</details>

<details>
<summary>Assess the Space Complexity of a Linked List with auxiliary pointers, such as in a Skip List.</summary>

### Assess the Space Complexity of a Linked List with auxiliary pointers, such as in a Skip List.

**Definition:**

</details>

<details>
<summary>Explain how Recursion affects time and space complexity in Linked List operations.</summary>

### Explain how Recursion affects time and space complexity in Linked List operations.

**Definition:**

</details>

### Linked List Problems and Solutions

<details>
<summary>Solve the problem of finding the Intersection Point of a Y-shaped Linked List.</summary>

### Solve the problem of finding the Intersection Point of a Y-shaped Linked List.

**Definition:**

</details>

<details>
<summary>Write an algorithm to segregate even and odd nodes in a Singly Linked List.</summary>

### Write an algorithm to segregate even and odd nodes in a Singly Linked List.

**Definition:**

</details>

<details>
<summary>How can you sort a Linked List that is sorted alternating between ascending and descending orders?</summary>

### How can you sort a Linked List that is sorted alternating between ascending and descending orders?

**Definition:**

</details>

<details>
<summary>Develop a method to swap pairs of nodes in a Linked List.</summary>

### Develop a method to swap pairs of nodes in a Linked List.

**Definition:**

</details>

<details>
<summary>Implement an algorithm to remove all Odd-Indexed Nodes from a Linked List.</summary>

### Implement an algorithm to remove all Odd-Indexed Nodes from a Linked List.

**Definition:**

</details>

<details>
<summary>Describe a technique to randomly select a node from a Linked List with a uniform distribution.</summary>

### Describe a technique to randomly select a node from a Linked List with a uniform distribution.

**Definition:**

</details>

<details>
<summary>Implement a version of a Linked List where each node has an additional arbitrary pointer to within the list.</summary>

### Implement a version of a Linked List where each node has an additional arbitrary pointer to within the list.

**Definition:**

</details>
