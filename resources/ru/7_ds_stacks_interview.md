# Stacks — собеседование

Ответы заполнены для опубликованной части, остальные пустые.
[← К обзору](./7_special_data_structures.md)

### Related docs

- [Stacks — собеседование](./7_ds_stacks_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Stacks](https://devinterview.io/questions/data-structures-and-algorithms/stack-data-structure-interview-questions/).

### Stack Fundamentals

<details>
<summary>What is a Stack?</summary>

### What is a Stack?

**Definition:**

Стек — линейная коллекция, которая добавляет и снимает с одного конца, вершины. Последний положенный элемент снимается первым.

**How it works:**

- Операции конца — push, pop и обычно peek. Добраться до элемента под вершиной значит снять то, что выше.
- Массив с индексом или связный список с указателем на голову оба делают это за O(1).
- Стек вызовов, история отмены и поиск в глубину — бытовые картины.
- Pop пустого стека — ошибка. Стек на фиксированном массиве может ещё и переполниться.

**Examples:**

Push 1, push 2, push 3. Pop возвращает 3, затем 2, затем 1.
</details>

<details>
<summary>Why Stack is considered a Recursive data structure?</summary>

### Why Stack is considered a Recursive data structure?

**Definition:**

Стек либо пуст, либо это верхний элемент, лежащий на меньшем стеке. Это та же форма, что у рекурсивного определения.

**How it works:**

- Pop соответствует снятию самого внешнего вызова. Push — ещё одному вложенному вызову.
- Рекурсивная функция, которая обрабатывает голову списка и уходит в хвост, идёт по стеку кадров, по кадру на элемент.
- Обход в глубину можно записать рекурсией или явным стеком. Порядок посещения тот же.
- Глубина рекурсии — высота стека. Длинная цепочка может переполнить стек вызовов, хотя явный стек той же высоты поместился бы в куче.
</details>

<details>
<summary>What are the primary operations performed on a Stack and their time complexities?</summary>

### What are the primary operations performed on a Stack and their time complexities?

**Definition:**

Основные операции трогают только вершину, поэтому они O(1) и в массиве, и в связном списке.

**How it works:**

- Push пишет новую вершину. Pop снимает её и возвращает. Peek читает, не снимая.
- isEmpty и size — O(1), если хранить счётчик или индекс вершины. Поиск произвольного значения — O(n), потому что, возможно, придётся снять всё.
- Push динамического массива амортизированно O(1) и иногда O(n) при расширении.
- Память — O(n) на n элементов.
</details>

### Stack Usage and Applications

<details>
<summary>When should I use Stack or Queue data structures instead of Arrays/Lists?</summary>

### When should I use Stack or Queue data structures instead of Arrays/Lists?

**Definition:**

Стек или очередь берут, когда задаче разрешён доступ только с конца. Массив — когда нужны произвольные индексы.

**How it works:**

- Стек совпадает с вложенностью: скобки, вызовы функций, отмена, поиск в глубину.
- Очередь совпадает с порядком прибытия: задачи, поиск в ширину, буфер между производителем и потребителем.
- Массив или динамический список — инструмент для двоичного поиска, сортировки и `a[i]`.
- Под капотом стек или очередь часто и есть массив или список. Смысл более узкого типа — сделать незаконный доступ очевидным.
</details>

<details>
<summary>What are Infix, Prefix, and Postfix notations?</summary>

### What are Infix, Prefix, and Postfix notations?

**Definition:**

Три записи различаются тем, где стоит оператор относительно операндов. Постфикс и префикс не нуждаются в скобках, чтобы зафиксировать порядок.

**How it works:**

- Инфикс пишет оператор между операндами: `2 + 3`. Приоритет и скобки решают, что с чем связано.
- Префикс (польская запись) пишет оператор первым: `+ 2 3`. Постфикс (обратная польская) пишет его последним: `2 3 +`.
- Стек вычисляет постфикс слева направо: числа кладёт, на операторе снимает операнды, считает и кладёт результат.
- Перевод инфикса в постфикс тоже использует стек операторов и снимает их, пока на вершине приоритет выше или равен.

**Examples:**

`2 + 3 * 4` в постфиксе — `2 3 4 * +`. Считается как `3 * 4 = 12`, затем `2 + 12 = 14`.
</details>

<details>
<summary>Explain how Stacks are used in Function Call management in programming languages.</summary>

### Explain how Stacks are used in Function Call management in programming languages.

**Definition:**

Каждый вызов кладёт кадр: адрес возврата, параметры и локальные переменные. Возврат снимает этот кадр и продолжает вызывающего.

**How it works:**

- Указатель кадра и указатель стека отмечают текущий кадр. Вызываемый, который соблюдает соглашение, восстанавливает регистры вызывающего.
- Рекурсия — несколько кадров одной функции. Глубина — число живых вызовов.
- Переполнение стека — эта область кончилась. Хвостовые вызовы могут переиспользовать кадр, если язык делает эту оптимизацию.
- Отладчики идут по кадрам от вершины и печатают трассировку.

**Examples:**

`main` вызывает `f`, `f` вызывает `g`. Кадры лежат как `main`, затем `f`, затем `g`. Когда `g` возвращается, сверху снова кадр `f`.
</details>

<details>
<summary>Describe an application where Stacks are naturally suited over other data structures.</summary>

### Describe an application where Stacks are naturally suited over other data structures.

**Definition:**

Проверка вложенных скобок — задача для стека: закрывающая скобка должна совпасть с последней открывающей.

**How it works:**

- Каждую открывающую кладут. На закрывающей снимают и сравнивают. Несовпадение, снятие с пустого стека или остаток в конце значат, что строка неверна.
- Очередь сопоставила бы самую старую открывающую, то есть не ту скобку. Индексом массива это можно сделать, но вы заново строите стек.
- Тот же шаблон разбирает вложенные выражения и возвращается от ребёнка к родителю в поиске в глубину.
- Время O(n), дополнительная память O(n) для полностью вложенной строки.

**Examples:**

`([]{})` кладёт `(`, `[`, снимает на `]`, снимает на `)`, кладёт `{`, снимает на `}`. Стек кончает пустым, строка совпала.
</details>

### Stack Implementation Details

<details>
<summary>Compare Array-based vs Linked List stack implementations.</summary>

### Compare Array-based vs Linked List stack implementations.

**Definition:**

Стек на массиве держит элементы в блоке и индекс вершины. Стек на связном списке кладёт и снимает у головного узла.

**How it works:**

- Push и pop массива — O(1), пока не упёрлись в фиксированную ёмкость, или амортизированные O(1), если блок растёт. У списка push и pop — O(1) и выделяют узел каждый раз.
- Массив дружелюбен к кэшу и тратит неиспользованную ёмкость. Список использует только свои узлы и платит указателем на элемент плюс накладными расходами аллокатора.
- Массив может переполнить фиксированный буфер. Список отказывает, только когда не удалось выделить память в куче.
- Peek — O(1) в обоих. Ни один не ищет произвольный элемент быстрее O(n).
</details>

<details>
<summary>Implement a Dynamic Stack that automatically resizes itself.</summary>

### Implement a Dynamic Stack that automatically resizes itself.

**Definition:**

Хранят элементы в динамическом массиве. Когда push видит `size == capacity`, выделяют больший блок, копируют и пишут новую вершину.

**How it works:**

- Обычный рост — удвоение. Одно расширение — O(n), серия push с пустого стека амортизированно O(1).
- Pop может сжимать, когда размер падает ниже доли ёмкости, часто четверти, чтобы рост и сжатие не колебались.
- Копируют в новый блок по индексам и сохраняют тот же индекс вершины.
- Публичные операции остаются push, pop и peek. Вызывающий ёмкость не видит.

**Examples:**

```text
ёмкость 2, push 1, push 2, push 3
выделить 4, скопировать [1, 2], записать 3, size = 3
```
</details>

<details>
<summary>What are the performance implications of a Fixed-size Array Stack Implementation?</summary>

### What are the performance implications of a Fixed-size Array Stack Implementation?

**Definition:**

Фиксированный массив делает каждый push и pop настоящими O(1) без выделения памяти и отказывает в push, когда буфер полон.

**How it works:**

- Нет амортизированного скачка расширения, что привлекательно на пути реального времени.
- Ёмкость выбирают заранее. Слишком маленькая роняет законную нагрузку. Слишком большая резервирует память, которая пустует.
- Локальность отличная: живой префикс — один непрерывный блок.
- Переполнение должно быть явной ошибкой или заданной политикой отбрасывания. Тихий заворот в старые слоты портит стек.
</details>

### Stack Design Challenges

<details>
<summary>Design a Stack that supports Retrieving the min element in O(1).</summary>

### Design a Stack that supports Retrieving the min element in O(1).

**Definition:**

Держат второй стек минимумов. Каждый push записывает минимум из нового значения и прежнего минимума, каждый pop выбрасывает эту запись.

**How it works:**

- Основной стек хранит значения в порядке LIFO. Вершина стека минимумов всегда равна минимуму основного стека.
- Push и pop остаются O(1). getMin читает вершину стека минимумов за O(1). Дополнительная память O(n).
- Более плотная версия кладёт в стек минимумов, только когда новое значение меньше или равно текущему минимуму, и снимает оттуда, только когда снятое значение равно этому минимуму.
- Дубликаты важны: если положили вторую копию текущего минимума, плотная версия должна положить и её, иначе поздний pop откроет неверный минимум.

**Examples:**

```text
push 3 -> min 3
push 1 -> min 1
push 2 -> min 1
pop     -> min всё ещё 1, потому что 2 не был минимумом
pop     -> min 3
```
</details>

<details>
<summary>How can you design a Stack to be thread-safe?</summary>

### How can you design a Stack to be thread-safe?

**Definition:**

Сериализуют операции, которые читают или пишут вершину, или используют конкурентный стек, чьи узлы связаны атомарным compare-and-swap.

**How it works:**

- Мьютекс вокруг push, pop и peek делает стек на массиве или списке корректным. Он же заставляет эти вызовы ждать друг друга.
- Держите блокировку только вокруг обновления указателя или индекса, не вокруг дальнейшей работы вызывающего со значением.
- Безблокировочный стек кладёт элемент, переставляя голову через CAS, и так же снимает. Проблема ABA и безопасное освобождение узлов — трудная часть.
- Безблокировочный дизайн всё ещё не политика справедливости. Горячий стек может морить медленный поток. Иногда на самом деле нужна была очередь.
</details>

<details>
<summary>Implement a Stack with a Find-Middle operation in O(1) time.</summary>

### Implement a Stack with a Find-Middle operation in O(1) time.

**Definition:**

Используют двусвязный список и держат указатель на средний узел плюс размер, чтобы середина сдвигалась не больше чем на один узел при каждом push или pop.

**How it works:**

- Push и pop по-прежнему идут в голове, это вершина. Указатель середины — не вершина.
- Когда размер переходит из нечётного в чётный или обратно, середину сдвигают на шаг к голове или к хвосту. Правило надо зафиксировать и проверить. И «нижняя середина», и «верхняя» согласованы, если держаться одной.
- findMiddle читает этот узел за O(1). Delete-middle отцепляет его за O(1), потому что есть предыдущий указатель, затем сдвигает середину к соседу.
- Стек на массиве тоже находит индекс середины за O(1), но удаление сдвигает элементы и стоит O(n).

**Examples:**

Размер 3, узлы `3 ↔ 2 ↔ 1`, середина указывает на 2. Push 4: размер 4, середина шагает один раз к новой голове или остаётся, по выбранному правилу чётности, и это одно обновление указателя.
</details>

### Stack and Other Data Structures

<details>
<summary>Implement a Linked List using Stack.</summary>

### Implement a Linked List using Stack.

**Definition:**

Прямой порядок односвязного списка можно собрать, складывая узлы и затем снимая их: стек переворачивается в порядок списка. Повседневные операции списка одним стеком не выражаются.

**How it works:**

- Чтобы развернуть список, кладут каждый узел, затем снимают их в новую цепочку. Это один стек как черновик, время O(n) и дополнительная память O(n).
- Вставка и удаление в середине списка всё ещё требуют прохода по указателям. Стек помогает только на одном конце.
- Два стека могут изобразить список с курсором: левый стек — всё до курсора в обратном порядке, правый — всё после. Сдвиг курсора снимает с одного стека и кладёт в другой.
- Такой список на двух стеках делает вставку у курсора за O(1), а длинный сдвиг — за O(n).

**Examples:**

Список `1 -> 2 -> 3`. Push 1, 2, 3. Pop в новый список: `3 -> 2 -> 1`.
</details>

<details>
<summary>Implement Doubly Linked List using Stacks with min complexity.</summary>

### Implement Doubly Linked List using Stacks with min complexity.

**Definition:**

Два стека спина к спине дают последовательность с двумя концами: один стек держит левую сторону, другой правую, а переход через середину переносит один элемент.

**How it works:**

- Вершина левого стека — элемент сразу слева от курсора. Вершина правого — сразу справа. Push слева и push справа — O(1).
- Шаг влево снимает с левого стека и кладёт это значение в правый. Шаг вправо делает наоборот. Один шаг — O(1). Прыжок на n шагов — O(n).
- Это минимальная добавка, которая даёт вставку и удаление у подвижного курсора за O(1) без двух указателей внутри каждого элемента.
- Настоящий произвольный доступ остаётся O(n). Если индекс `i` нужен часто, массив дешевле, чем двигать курсор.

**Examples:**

Левый `[1, 2]` с 2 на вершине, правый `[4, 3]` с 3 на вершине изображают последовательность `1 2 | 3 4`. Один шаг вправо даёт левый `[1, 2, 3]` и правый `[4]`.
</details>

<details>
<summary>Implement a Queue using Two Stacks.</summary>

### Implement a Queue using Two Stacks.

**Definition:**

</details>

<details>
<summary>Implement a Queue using only One Stack.</summary>

### Implement a Queue using only One Stack.

**Definition:**

</details>

<details>
<summary>Implement Stack using Two Queues with efficient push.</summary>

### Implement Stack using Two Queues with efficient push.

**Definition:**

</details>

<details>
<summary>Implement Three Stacks with One Array.</summary>

### Implement Three Stacks with One Array.

**Definition:**

</details>

### Stack Manipulation and Variation

<details>
<summary>Reverse a String using Stack.</summary>

### Reverse a String using Stack.

**Definition:**

</details>

<details>
<summary>Reverse a Stack without using any additional data structure.</summary>

### Reverse a Stack without using any additional data structure.

**Definition:**

</details>

<details>
<summary>Sort a Stack using Recursion.</summary>

### Sort a Stack using Recursion.

**Definition:**

</details>

<details>
<summary>Sort a Stack using another Stack.</summary>

### Sort a Stack using another Stack.

**Definition:**

</details>

<details>
<summary>Implement a Shuffling Algorithm using a Stack.</summary>

### Implement a Shuffling Algorithm using a Stack.

**Definition:**

</details>

### Stack in Parsing and Expression Evaluation

<details>
<summary>Check if parentheses are Balanced using Stack.</summary>

### Check if parentheses are Balanced using Stack.

**Definition:**

</details>

<details>
<summary>Find Duplicate Parenthesis in an expression.</summary>

### Find Duplicate Parenthesis in an expression.

**Definition:**

</details>

<details>
<summary>How can a Stack be used to evaluate Postfix expressions?</summary>

### How can a Stack be used to evaluate Postfix expressions?

**Definition:**

</details>

<details>
<summary>Convert an Infix expression to Postfix using a Stack.</summary>

### Convert an Infix expression to Postfix using a Stack.

**Definition:**

</details>

<details>
<summary>Build a Binary Expression Tree for the given expression.</summary>

### Build a Binary Expression Tree for the given expression.

**Definition:**

</details>

### Handling Large Datasets with Stack

<details>
<summary>Given an Extremely Large File that doesn’t fit into memory, check if the parentheses are Balanced.</summary>

### Given an Extremely Large File that doesn’t fit into memory, check if the parentheses are Balanced.

**Definition:**

</details>

<details>
<summary>Check for Braces Balance in a really large (1T) file in Parallel.</summary>

### Check for Braces Balance in a really large (1T) file in Parallel.

**Definition:**

</details>

<details>
<summary>Design a script to process large-scale, real-time Undo Operations using Stacks.</summary>

### Design a script to process large-scale, real-time Undo Operations using Stacks.

**Definition:**

</details>

<details>
<summary>How would a Stack handle Memory Allocation in large data scenarios?</summary>

### How would a Stack handle Memory Allocation in large data scenarios?

**Definition:**

</details>

### Advanced Stack Problems

<details>
<summary>Solve the Stock Span Problem using a Stack.</summary>

### Solve the Stock Span Problem using a Stack.

**Definition:**

</details>

<details>
<summary>Design an algorithm to Calculate Rainwater Trapped between towers using a Stack.</summary>

### Design an algorithm to Calculate Rainwater Trapped between towers using a Stack.

**Definition:**

</details>

### Stack Performance Optimization

<details>
<summary>Explain how to minimize Stack Overflow in programming with limited memory.</summary>

### Explain how to minimize Stack Overflow in programming with limited memory.

**Definition:**

</details>

<details>
<summary>What techniques can be used to improve the Locality of reference for a Stack?</summary>

### What techniques can be used to improve the Locality of reference for a Stack?

**Definition:**

</details>

### Stacks in Multithreading and Concurrency

<details>
<summary>Describe a Lock-free Stack and where it may be used.</summary>

### Describe a Lock-free Stack and where it may be used.

**Definition:**

</details>

<details>
<summary>Illustrate how a Stack can be used in implementing Producer-Consumer scenarios.</summary>

### Illustrate how a Stack can be used in implementing Producer-Consumer scenarios.

**Definition:**

</details>

### Stack Invariants and Monitoring

<details>
<summary>Propose a method to maintain a History of Operations on a Stack.</summary>

### Propose a method to maintain a History of Operations on a Stack.

**Definition:**

</details>

<details>
<summary>How might you design a monitoring system for Capacity Thresholds of a Stack?</summary>

### How might you design a monitoring system for Capacity Thresholds of a Stack?

**Definition:**

</details>

### Stack Error Handling and Exceptions

<details>
<summary>Explain how a Stack Trace is used in debugging and exception handling.</summary>

### Explain how a Stack Trace is used in debugging and exception handling.

**Definition:**

</details>

<details>
<summary>What methods exist to handle Stack Overflow Exceptions in memory-constrained environments?</summary>

### What methods exist to handle Stack Overflow Exceptions in memory-constrained environments?

**Definition:**

</details>

### Stack Algorithm Challenges

<details>
<summary>Create an algorithm to Normalize Pathnames using a Stack.</summary>

### Create an algorithm to Normalize Pathnames using a Stack.

**Definition:**

</details>

<details>
<summary>Implement a function that finds the Next Greater Element using a Stack.</summary>

### Implement a function that finds the Next Greater Element using a Stack.

**Definition:**

</details>

<details>
<summary>Develop an algorithm to check for Cycles in a Directed Graph using Stack-based DFS.</summary>

### Develop an algorithm to check for Cycles in a Directed Graph using Stack-based DFS.

**Definition:**

</details>
