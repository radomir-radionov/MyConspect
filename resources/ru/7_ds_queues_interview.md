# Queues — собеседование

Ответы заполнены для опубликованной части, остальные пустые.
[← К обзору](./7_special_data_structures.md)

### Related docs

- [Queues — собеседование](./7_ds_queues_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Queues](https://devinterview.io/questions/data-structures-and-algorithms/queue-data-structure-interview-questions/).

### Queue Fundamentals

<details>
<summary>What is a Queue?</summary>

### What is a Queue?

**Definition:**

Очередь добавляет элементы сзади и снимает их спереди, поэтому первым уходит самый старый.

**How it works:**

- Enqueue и dequeue — два конца. Peek читает начало, не снимая.
- Кольцевой буфер или связный список с указателем на хвост делают оба конца O(1).
- Поиск в ширину, очереди печати и буферы задач — очереди. Стек отдал бы самый новый элемент.
- Dequeue пустой очереди — ошибка. Фиксированный буфер может ещё и переполниться.

**Examples:**

Enqueue 1, затем 2, затем 3. Dequeue возвращает 1, затем 2, затем 3.
</details>

<details>
<summary>Explain the FIFO (First In, First Out) policy that characterizes a Queue.</summary>

### Explain the FIFO (First In, First Out) policy that characterizes a Queue.

**Definition:**

FIFO значит, что порядок ухода совпадает с порядком прихода. Никто не пролезает без смены структуры.

**How it works:**

- Начало — самый ранний из оставшихся. Конец — куда садится следующий приход.
- Стек — LIFO. Очередь с приоритетом уходит по ключу, не по времени прихода.
- FIFO — правило справедливости одной очереди: запрос не голодает за более поздними, если сервер продолжает снимать с начала.
- Две очереди всё ещё могут быть несправедливы друг к другу, если одну из них не обслуживают.
</details>

<details>
<summary>Name some Types of Queues.</summary>

### Name some Types of Queues.

**Definition:**

Семейство держит два конца и затем ослабляет, каким концом можно пользоваться или что значит «следующий».

**How it works:**

- Простая очередь — FIFO на двух концах.
- Кольцевая очередь — та же очередь в фиксированном массиве с заворотом.
- Дек разрешает вставку и удаление с обоих концов.
- Очередь с приоритетом игнорирует порядок прихода и снимает лучший ключ. Двусторонняя очередь с приоритетом показывает оба края.
</details>

<details>
<summary>What is a Priority Queue and how does it differ from a standard Queue?</summary>

### What is a Priority Queue and how does it differ from a standard Queue?

**Definition:**

Очередь с приоритетом снимает элемент с лучшим ключом, даже если он пришёл последним. Обычная очередь снимает тот, который пришёл первым.

**How it works:**

- Двоичная куча делает вставку и извлечение за O(log n). FIFO-очередь делает оба за O(1) и ключа не имеет.
- Равные ключи сами по себе не сохраняют порядок FIFO. Храните в ключе порядковый номер, если ничьи должны быть устойчивыми.
- Дейкстре и планировщикам нужна очередь с приоритетом. Принтеру нужна FIFO.
- FIFO-очередь можно собрать из очереди с приоритетом, взяв время прихода ключом. Очередь с приоритетом из FIFO без прохода не собрать.
</details>

<details>
<summary>When should I use a Stack or a Queue instead of Arrays/Lists?</summary>

### When should I use a Stack or a Queue instead of Arrays/Lists?

**Definition:**

Стек или очередь берут, когда алгоритм определён тем, какой конец двигается. Массив — когда нужны индексы.

**How it works:**

- Поиск в глубину, отмена и скобки — стеки. Поиск в ширину, буферы и порядок прихода — очереди.
- Ограничение и есть смысл. Список позволил бы удалить из середины и спрятать ошибку.
- Под капотом оба часто массивы или списки. Тип документирует контракт.
- Если нужен i-й ожидающий без снятия тех, кто впереди, вам нужны дек или массив, не чистая очередь.
</details>

<details>
<summary>How do you reverse a Queue?</summary>

### How do you reverse a Queue?

**Definition:**

Сливают очередь в стек, затем снимают стек обратно в очередь. Разворот стека становится новым порядком очереди.

**How it works:**

- Каждый dequeue кладёт в стек. Каждый pop делает enqueue. Два прохода, время O(n), дополнительная память O(n).
- Дек можно развернуть, снимая спереди и кладя вперёд второго дека, или поменяв смысл концов, если оба указателя ваши.
- Рекурсия использует стек вызовов как этот временный стек и имеет глубину n.
- Разворот очереди на связном списке на месте — тот же разворот указателей, что у списка, затем голова и хвост меняются ролями.

**Examples:**

Очередь спереди `1 2 3`. После стека порядок снятия `3 2 1`, и новое начало очереди — 3.
</details>

<details>
<summary>Can a queue be implemented as a static data structure and if so, what are the limitations?</summary>

### Can a queue be implemented as a static data structure and if so, what are the limitations?

**Definition:**

Да. Фиксированный массив плюс индексы головы и хвоста — статическая очередь, и она не вырастет сверх этой ёмкости.

**How it works:**

- Без заворота каждый dequeue тратит слот спереди, и очередь «заполняется», пока в массиве ещё есть дыры.
- Кольцевая раскладка переиспользует эти слоты. Полную и пустую надо различать счётчиком размера или одним незанятым слотом.
- Enqueue в полную очередь отказывает или блокируется. Амортизированного расширения нет.
- Граница — преимущество, когда память надо зарезервировать заранее, и ограничение, когда всплеск больше догадки.
</details>

### Queue Operations

<details>
<summary>Write an algorithm to enqueue and dequeue an item from a Queue.</summary>

### Write an algorithm to enqueue and dequeue an item from a Queue.

**Definition:**

В кольцевом массиве enqueue пишет в tail и сдвигает его. Dequeue читает head и сдвигает его. Оба шага — по модулю ёмкости.

**How it works:**

- Enqueue отвергают, когда size равен ёмкости. Dequeue отвергают, когда size равен 0.
- После успешного enqueue size растёт на один. После успешного dequeue size уменьшается на один.
- Связный список пишет узел по указателю хвоста и снимает головной узел. Пустой список ставит оба указателя в null.
- Peek — чтение без сдвига.

**Examples:**

```text
enqueue(x):
  if size == capacity: fail
  buf[tail] = x
  tail = (tail + 1) % capacity
  size += 1
dequeue():
  if size == 0: fail
  x = buf[head]
  head = (head + 1) % capacity
  size -= 1
  return x
```
</details>

<details>
<summary>How to implement a Queue such that enqueue has O(1) and dequeue has O(n) complexity?</summary>

### How to implement a Queue such that enqueue has O(1) and dequeue has O(n) complexity?

**Definition:**

Дописывают в конец массива или списка для enqueue, а при dequeue сдвигают каждый последующий элемент на один, либо идут по односвязному списку без хвоста — это зеркальная цена.

**How it works:**

- Массив: enqueue — дописывание, амортизированно O(1). Dequeue индекса 0 сдвигает хвост, O(n).
- Эта раскладка проста и плоха для горячей очереди. Так выходит, если динамический массив используют как очередь без индекса головы.
- Кольцевой индекс головы убирает сдвиг и делает dequeue тоже O(1). Версия O(n) — та, которая от этого индекса отказывается.
- Односвязный список с головой и без хвоста — зеркало: dequeue в голове O(1), enqueue идёт до конца, O(n).
</details>

<details>
<summary>Discuss a scenario where dequeue must be prioritized over enqueue in terms of complexity.</summary>

### Discuss a scenario where dequeue must be prioritized over enqueue in terms of complexity.

**Definition:**

Когда потребители должны снимать следующую задачу с жёсткой границей, а производители могут позволить более медленный push, сделайте dequeue концом за O(1).

**How it works:**

- Связный список с началом в голове даёт dequeue за O(1). Enqueue может идти до хвоста, или вы добавляете указатель на хвост и оба становятся O(1).
- Обработчик прерывания или кадр интерфейса, который должен взять следующее событие, не должен сдвигать массив.
- Пакетный производитель, который кладёт тысячи и засыпает, может платить O(n) на входе, если ограничение — задержка потребителя. Это редкость, когда указатель на хвост ничего не стоит.
- Если горячие оба конца, перестаньте выбирать и возьмите кольцо или список с обоими указателями.
</details>

<details>
<summary>Explain how you can efficiently track the Minimum or Maximum element in a Queue.</summary>

### Explain how you can efficiently track the Minimum or Maximum element in a Queue.

**Definition:**

Держат дек кандидатов по порядку и выбрасывают кандидата, когда более новый элемент делает его бесполезным или когда он вышел из окна.

**How it works:**

- Для максимума скользящего окна дек хранит индексы по убыванию значений. Перед тем как положить новый индекс, с конца снимают тех, чьи значения меньше.
- С начала снимают, когда индекс вышел из окна. Начало тогда и есть максимум.
- Каждый индекс входит в дек и выходит один раз, поэтому окно, идущее по n элементам, — O(n).
- Обычная очередь плюс пересканирование на каждом dequeue — O(n) на шаг. Дек избегает этого пересканирования. Куча тоже работает и стоит O(log n) на шаг, если не удалять лениво.

**Examples:**

Окно 3 по `[1, 3, 2, 4]`. После третьего элемента дек держит 3, затем 2. Максимум 3. Когда приходит 4, 2 и 3 меньше и уходят, максимум 4.
</details>

<details>
<summary>Discuss an algorithm to merge two or more Queues into one with efficient Dequeuing.</summary>

### Discuss an algorithm to merge two or more Queues into one with efficient Dequeuing.

**Definition:**

Если очереди FIFO и слияние должно остаться FIFO по исходному времени, свяжите их или слейте в порядке прихода. Если каждая очередь отсортирована и слияние должно идти по ключу, используйте кучу начал.

**How it works:**

- Склейка очередей на связных списках — O(1) на очередь: хвост одной указывает на голову следующей. Dequeue результата всё ещё O(1).
- Для k очередей, которые надо чередовать по приоритету, держат кучу текущих начал. Каждый dequeue — O(log k).
- Копирование каждого элемента в новую очередь-массив — O(n) заранее и затем dequeue за O(1), и живые источники теряются.
- Слияние по кругу снимает по одному из каждой непустой очереди по очереди. Это справедливо между источниками и не глобальная сортировка.
</details>

### Queue Implementation Details

<details>
<summary>Name some Queue Implementations. Compare their efficiency.</summary>

### Name some Queue Implementations. Compare their efficiency.

**Definition:**

Обычные реализации — кольцевой массив, связный список с хвостом и два стека.

**How it works:**

- Кольцевой массив: enqueue и dequeue O(1), фиксированный или амортизированный рост, отличная локальность.
- Связный список с головой и хвостом: оба конца O(1), указатель и выделение на элемент, плохая локальность.
- Два стека: один на вход, один на выход. Каждый элемент кладут и снимают постоянное число раз, поэтому оба конца амортизированно O(1), а один dequeue может быть O(n), когда выходной стек наполняют заново.
- `collections.deque` в Python — дек из блоков. `ArrayDeque` в Java — кольцевой массив.
</details>

<details>
<summary>Describe an array-based implementation of a Queue and its disadvantages.</summary>

### Describe an array-based implementation of a Queue and its disadvantages.

**Definition:**

Очередь на массиве держит голову, хвост и элементы в одном блоке. Наивная версия без заворота тратит начало.

**How it works:**

- Линейная голова, которая только ползёт вперёд, не переиспользует снятые слоты. После n enqueue и n dequeue массив выглядит пустым и непригоден.
- Сдвиг на каждом dequeue делает dequeue O(n).
- Кольцевая форма чинит оба недостатка и всё ещё имеет фиксированную ёмкость, пока вы не выделите больший блок и не скопируете живой диапазон по порядку.
- Расширение должно размотать заворот: копировать от головы до конца, затем от 0 до хвоста, в свежий массив с головой в 0.
</details>

<details>
<summary>What are the benefits of implementing a Queue with a Doubly Linked List versus a Singly Linked List?</summary>

### What are the benefits of implementing a Queue with a Doubly Linked List versus a Singly Linked List?

**Definition:**

Односвязный список с головой и хвостом уже даёт enqueue и dequeue за O(1). Двусвязный платит вторым указателем и получает удаление узла, который уже в руках, за O(1).

**How it works:**

- Dequeue нужен только next головы. Указатель назад для чистой FIFO не используется.
- Двойная ссылка важна, когда ожидающий элемент отменяют из середины, как в списке таймеров или в LRU, который ещё и очередь.
- Память на узел выше, и лишняя запись на каждом enqueue заметна в плотном буфере.
- Используйте односвязную очередь, пока нет настоящего удаления из середины. Тогда второй указатель окупается.
</details>

<details>
<summary>Explain the algorithm behind a Circular Queue and some potential issues that might arise.</summary>

### Explain the algorithm behind a Circular Queue and some potential issues that might arise.

**Definition:**

</details>

<details>
<summary>How to manage a Full Circular Queue Event?</summary>

### How to manage a Full Circular Queue Event?

**Definition:**

</details>

### Queue Implementation Challenges

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
<summary>Implement a Stack using Two Queues with efficient Push.</summary>

### Implement a Stack using Two Queues with efficient Push.

**Definition:**

</details>

<details>
<summary>Write code for a Double-Ended Queue (Deque) and explain its usage.</summary>

### Write code for a Double-Ended Queue (Deque) and explain its usage.

**Definition:**

</details>

<details>
<summary>Describe how to implement a Blocking Queue and a use case for it.</summary>

### Describe how to implement a Blocking Queue and a use case for it.

**Definition:**

</details>

<details>
<summary>Solve for a queue that automatically resizes to hold new elements.</summary>

### Solve for a queue that automatically resizes to hold new elements.

**Definition:**

</details>

<details>
<summary>Create a Queue data structure with O(1) complexity for enqueue, dequeue, and finding the maximum element.</summary>

### Create a Queue data structure with O(1) complexity for enqueue, dequeue, and finding the maximum element.

**Definition:**

</details>

### Queue Types and Variants

<details>
<summary>Explain the difference between a Linear Queue and a Circular Queue.</summary>

### Explain the difference between a Linear Queue and a Circular Queue.

**Definition:**

</details>

<details>
<summary>What is a Monotonic Queue, and how do you implement it?</summary>

### What is a Monotonic Queue, and how do you implement it?

**Definition:**

</details>

<details>
<summary>Describe a Bounded Queue. What considerations are necessary when implementing one?</summary>

### Describe a Bounded Queue. What considerations are necessary when implementing one?

**Definition:**

</details>

<details>
<summary>What is the difference between a Single-Ended Queue and a Double-Ended Queue?</summary>

### What is the difference between a Single-Ended Queue and a Double-Ended Queue?

**Definition:**

</details>

### Queue-Related Algorithms and Problem Solving

<details>
<summary>Implement a Queue Algorithm to sort a given list of integers.</summary>

### Implement a Queue Algorithm to sort a given list of integers.

**Definition:**

</details>

<details>
<summary>Implement an algorithm to reverse the first k elements of a Queue.</summary>

### Implement an algorithm to reverse the first k elements of a Queue.

**Definition:**

</details>

<details>
<summary>How can Queues be used in the implementation of a Cache Eviction Policy, like FIFO?</summary>

### How can Queues be used in the implementation of a Cache Eviction Policy, like FIFO?

**Definition:**

</details>

<details>
<summary>Provide an algorithm for rotating a Queue by a certain number of elements.</summary>

### Provide an algorithm for rotating a Queue by a certain number of elements.

**Definition:**

</details>

<details>
<summary>How would you use a Queue to generate binary numbers from 1 to N?</summary>

### How would you use a Queue to generate binary numbers from 1 to N?

**Definition:**

</details>

### Advanced Queue Concepts

<details>
<summary>Explain how a Queue can be utilized in Graph Traversal Algorithms.</summary>

### Explain how a Queue can be utilized in Graph Traversal Algorithms.

**Definition:**

</details>

<details>
<summary>Describe the application of Queues in Scheduling Algorithms, such as Round Robin Scheduling.</summary>

### Describe the application of Queues in Scheduling Algorithms, such as Round Robin Scheduling.

**Definition:**

</details>

<details>
<summary>Explain a scenario where Queues are used in a multi-threading environment.</summary>

### Explain a scenario where Queues are used in a multi-threading environment.

**Definition:**

</details>

<details>
<summary>What is a Dequeuable Priority Queue, and when might one be used?</summary>

### What is a Dequeuable Priority Queue, and when might one be used?

**Definition:**

</details>

<details>
<summary>Discuss the role of Queues in the Breadth-First Search (BFS) and `A*` Search Algorithms.</summary>

### Discuss the role of Queues in the Breadth-First Search (BFS) and `A*` Search Algorithms.

**Definition:**

</details>

### Real-World Queue Applications

<details>
<summary>How are Queues used in Event-Driven Programming and Message Queuing Systems?</summary>

### How are Queues used in Event-Driven Programming and Message Queuing Systems?

**Definition:**

</details>

<details>
<summary>Discuss the importance of Queues in Operating Systems, specifically in Process Management.</summary>

### Discuss the importance of Queues in Operating Systems, specifically in Process Management.

**Definition:**

</details>

<details>
<summary>Explain how a Consumer-Producer Model can be implemented using a Queue.</summary>

### Explain how a Consumer-Producer Model can be implemented using a Queue.

**Definition:**

</details>

<details>
<summary>Describe an application of Queues in Network Packet Routing and Load Balancing.</summary>

### Describe an application of Queues in Network Packet Routing and Load Balancing.

**Definition:**

</details>

### Queue Performance and Optimization

<details>
<summary>What strategies can be implemented to reduce Time Complexity in queue operations?</summary>

### What strategies can be implemented to reduce Time Complexity in queue operations?

**Definition:**

</details>

<details>
<summary>Name the Most Efficient way to implement Stack and Queue together.</summary>

### Name the Most Efficient way to implement Stack and Queue together.

**Definition:**

</details>

<details>
<summary>How do modern CPUs and Memory Caching behavior affect the performance of queue operations?</summary>

### How do modern CPUs and Memory Caching behavior affect the performance of queue operations?

**Definition:**

</details>

### Queue Implementation with Constraints

<details>
<summary>Design a queue which supports a rolling average query with O(1) time complexity.</summary>

### Design a queue which supports a rolling average query with O(1) time complexity.

**Definition:**

</details>

<details>
<summary>Implement a queue with constraints that minimizes total wait time for dequeuing.</summary>

### Implement a queue with constraints that minimizes total wait time for dequeuing.

**Definition:**

</details>

<details>
<summary>Implement an Immutable Queue in a functional programming style.</summary>

### Implement an Immutable Queue in a functional programming style.

**Definition:**

</details>

### Queue in Distributed Systems

<details>
<summary>Explain the concept of a Distributed Queue and its role in distributed systems.</summary>

### Explain the concept of a Distributed Queue and its role in distributed systems.

**Definition:**

</details>

<details>
<summary>How would you design a fault-tolerant Queuing System that ensures message delivery even after a crash?</summary>

### How would you design a fault-tolerant Queuing System that ensures message delivery even after a crash?

**Definition:**

</details>

<details>
<summary>Describe a scenario where a queue is used for Load Leveling in a distributed application.</summary>

### Describe a scenario where a queue is used for Load Leveling in a distributed application.

**Definition:**

</details>

### Queue Interview Challenges

<details>
<summary>Create a simulation of a Queue at a grocery store, including multiple cashier lines.</summary>

### Create a simulation of a Queue at a grocery store, including multiple cashier lines.

**Definition:**

</details>

<details>
<summary>Implement a queue that supports finding the kth Last Element from the tail.</summary>

### Implement a queue that supports finding the kth Last Element from the tail.

**Definition:**

</details>

<details>
<summary>Design a queue that, after enqueuing an item, returns the Median of all elements in the queue.</summary>

### Design a queue that, after enqueuing an item, returns the Median of all elements in the queue.

**Definition:**

</details>

<details>
<summary>Solve the problem of implementing a queue with automatic priority adjustment based on the frequency of element access.</summary>

### Solve the problem of implementing a queue with automatic priority adjustment based on the frequency of element access.

**Definition:**

</details>
