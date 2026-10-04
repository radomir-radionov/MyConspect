# Queues — Interview

Answers are filled for the published subset; the rest are still empty.
[← Back to hub](./7_special_data_structures.md)

### Related docs

- [Queues — Interview](./7_ds_queues_interview.md)

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

A queue adds items at the back and removes them from the front, so the oldest item leaves first.

**How it works:**

- Enqueue and dequeue are the two ends. Peek reads the front without removing it.
- A ring buffer or a linked list with a tail pointer makes both ends O(1).
- BFS, print spoolers, and task buffers are queues. A stack would serve the newest item instead.
- Empty dequeue is an error. A fixed buffer can also be full.

**Examples:**

Enqueue 1, then 2, then 3. Dequeue returns 1, then 2, then 3.
</details>

<details>
<summary>Explain the FIFO (First In, First Out) policy that characterizes a Queue.</summary>

### Explain the FIFO (First In, First Out) policy that characterizes a Queue.

**Definition:**

FIFO means the departure order matches the arrival order. Nothing jumps the line unless you switch to a different structure.

**How it works:**

- The front is the earliest remaining item. The back is where the next arrival lands.
- A stack is LIFO. A priority queue leaves by key, not by arrival.
- FIFO is the fairness rule for a single line: a request cannot starve behind later requests if the server keeps dequeuing.
- Two queues can still be unfair to each other if one of them is never served.
</details>

<details>
<summary>Name some Types of Queues.</summary>

### Name some Types of Queues.

**Definition:**

The family shares two ends and then relaxes which end you may use, or what 'next' means.

**How it works:**

- A simple queue is FIFO at two ends.
- A circular queue is that queue in a fixed array with wrap-around.
- A deque allows insert and delete at both ends.
- A priority queue ignores arrival order and extracts the best key. A double-ended priority queue exposes both extremes.
</details>

<details>
<summary>What is a Priority Queue and how does it differ from a standard Queue?</summary>

### What is a Priority Queue and how does it differ from a standard Queue?

**Definition:**

A priority queue extracts the item with the best key, even if it arrived last. A standard queue extracts the item that arrived first.

**How it works:**

- A binary heap implements insert and extract in O(log n). A FIFO queue does both in O(1) and has no key.
- Equal keys do not automatically keep FIFO order. Store a sequence number in the key if ties must be stable.
- Dijkstra and schedulers want the priority queue. A printer wants FIFO.
- You can build a FIFO queue from a priority queue by using arrival time as the key. You cannot build a priority queue from a FIFO queue without a scan.
</details>

<details>
<summary>When should I use a Stack or a Queue instead of Arrays/Lists?</summary>

### When should I use a Stack or a Queue instead of Arrays/Lists?

**Definition:**

Use a stack or a queue when the algorithm is defined by which end moves. Use an array when you need indexes.

**How it works:**

- DFS, undo, and bracket matching are stacks. BFS, buffers, and arrival order are queues.
- The restriction is the point. A list would let you remove from the middle and hide a bug.
- Underneath, both are often arrays or lists. The type documents the contract.
- If you need the i-th waiting item without removing the ones in front, you wanted a deque or an array, not a pure queue.
</details>

<details>
<summary>How do you reverse a Queue?</summary>

### How do you reverse a Queue?

**Definition:**

Drain the queue into a stack, then pop the stack back into the queue. The stack's reversal becomes the queue's new order.

**How it works:**

- Each dequeue pushes onto the stack. Each pop enqueues. Two passes, O(n) time, O(n) extra memory.
- A deque can reverse by taking from the front and pushing to the front of a second deque, or by swapping the meaning of the ends if you own both pointers.
- Recursion uses the call stack as that temporary stack and hits a depth of n.
- In-place reversal of a linked-list queue is the same pointer reverse as a list, then the head and tail swap roles.

**Examples:**

Queue front `1 2 3`. After the stack, pop order is `3 2 1`, and the queue's new front is 3.
</details>

<details>
<summary>Can a queue be implemented as a static data structure and if so, what are the limitations?</summary>

### Can a queue be implemented as a static data structure and if so, what are the limitations?

**Definition:**

Yes. A fixed array plus head and tail indexes is a static queue, and it cannot grow past that capacity.

**How it works:**

- Without wrap-around, each dequeue wastes a slot at the front and the queue 'fills' while the array still has holes.
- A circular layout reuses those slots. Full and empty must be distinguished by a size counter or by leaving one slot unused.
- Enqueue on a full queue fails or blocks. There is no amortized resize.
- The bound is an advantage when memory must be reserved up front, and a limitation when the burst can exceed the guess.
</details>

### Queue Operations

<details>
<summary>Write an algorithm to enqueue and dequeue an item from a Queue.</summary>

### Write an algorithm to enqueue and dequeue an item from a Queue.

**Definition:**

On a circular array, enqueue writes at tail and advances it. Dequeue reads at head and advances it. Both moves are modulo the capacity.

**How it works:**

- Reject enqueue when size equals capacity. Reject dequeue when size is 0.
- After a successful enqueue, size grows by one. After a successful dequeue, size shrinks by one.
- A linked list writes a node at the tail pointer and removes the head node. An empty list sets both pointers to null.
- Peek is the read without the advance.

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

Append at the end of an array or a list for enqueue, and on dequeue shift every later item down by one, or walk a singly linked list that has no tail cache for the opposite cost.

**How it works:**

- Array: enqueue is an append, amortized O(1). Dequeue of index 0 memmoves the tail, O(n).
- That layout is simple and terrible for a hot queue. It is what you get from using a dynamic array as a queue without a head index.
- The circular head index removes the shift and makes dequeue O(1) too. The O(n) version is the one that refuses that index.
- A singly linked list with a head and no tail is the mirror: dequeue at the head is O(1) and enqueue walks to the end, O(n).
</details>

<details>
<summary>Discuss a scenario where dequeue must be prioritized over enqueue in terms of complexity.</summary>

### Discuss a scenario where dequeue must be prioritized over enqueue in terms of complexity.

**Definition:**

When consumers must pop the next job with a tight bound and producers can afford a slower push, make dequeue the O(1) end.

**How it works:**

- A linked list with the front at the head gives O(1) dequeue. Enqueue can walk to the tail, or you add a tail pointer and both become O(1).
- An interrupt handler or a UI frame that must take the next event should not shift an array.
- A batch producer that enqueues thousands and then sleeps can pay O(n) on the way in if the consumer's latency is the constraint. That is unusual once a tail pointer is free.
- If both ends are hot, stop choosing and use a ring or a list with both pointers.
</details>

<details>
<summary>Explain how you can efficiently track the Minimum or Maximum element in a Queue.</summary>

### Explain how you can efficiently track the Minimum or Maximum element in a Queue.

**Definition:**

Keep a deque of candidates in order, and drop a candidate when a newer item makes it useless or when it slides out of the window.

**How it works:**

- For a sliding-window maximum, the deque stores indexes in decreasing value. Before pushing the new index, pop the back while those values are smaller.
- Pop the front when its index has left the window. The front is then the maximum.
- Each index enters and leaves the deque once, so a window moving across n items is O(n).
- A plain queue plus a rescan on every dequeue is O(n) per step. The deque avoids that rescan. A heap also works and is O(log n) per step unless you lazily delete.

**Examples:**

Window of 3 over `[1, 3, 2, 4]`. After the third item the deque holds 3, then 2. The max is 3. When 4 arrives, 2 and 3 are smaller and leave, and the max is 4.
</details>

<details>
<summary>Discuss an algorithm to merge two or more Queues into one with efficient Dequeuing.</summary>

### Discuss an algorithm to merge two or more Queues into one with efficient Dequeuing.

**Definition:**

If the queues are FIFO and the merge should stay FIFO by original time, link them or drain them in arrival order. If each queue is sorted and the merge should be by key, use a heap of fronts.

**How it works:**

- Concatenating linked-list queues is O(1) per queue: point one tail at the next head. Dequeue of the result is still O(1).
- For k queues that must be interleaved by a priority, keep a heap of the current front of each. Each dequeue is O(log k).
- Copying every element into a new array queue is O(n) up front and then O(1) dequeue, and it loses the live sources.
- A round-robin merge dequeues one from each non-empty queue in turn. That is fair across sources and not a global sort.
</details>

### Queue Implementation Details

<details>
<summary>Name some Queue Implementations. Compare their efficiency.</summary>

### Name some Queue Implementations. Compare their efficiency.

**Definition:**

The usual implementations are a circular array, a linked list with a tail, and two stacks.

**How it works:**

- Circular array: enqueue and dequeue O(1), fixed or amortized growth, excellent locality.
- Linked list with head and tail: both ends O(1), a pointer and an allocation per item, poor locality.
- Two stacks: one for input, one for output. Each item is pushed and popped a constant number of times, so both ends are amortized O(1), and one dequeue can be O(n) when the output stack is refilled.
- `collections.deque` in Python is a block-linked deque. `ArrayDeque` in Java is a circular array.
</details>

<details>
<summary>Describe an array-based implementation of a Queue and its disadvantages.</summary>

### Describe an array-based implementation of a Queue and its disadvantages.

**Definition:**

An array queue keeps a head, a tail, and the items in one block. The naive version that does not wrap wastes the front.

**How it works:**

- A linear head that only moves forward cannot reuse dequeued slots. After n enqueues and n dequeues the array looks empty and is unusable.
- Shifting on every dequeue makes dequeue O(n).
- The circular form fixes both and still has a fixed capacity until you allocate a bigger block and copy the live range in order.
- A resize must unwind the wrap: copy from head to the end, then from 0 to tail, into a fresh array with head at 0.
</details>

<details>
<summary>What are the benefits of implementing a Queue with a Doubly Linked List versus a Singly Linked List?</summary>

### What are the benefits of implementing a Queue with a Doubly Linked List versus a Singly Linked List?

**Definition:**

A singly linked list with head and tail already gives O(1) enqueue and dequeue. A doubly linked list pays a second pointer and gains O(1) removal of a node you already hold.

**How it works:**

- Dequeue only needs the head's next pointer. The previous pointer is unused for pure FIFO.
- The double link matters when a waiting item is cancelled from the middle, as in a timer list or an LRU that is also a queue.
- Memory per node is higher, and the extra write on every enqueue is measurable in a tight buffer.
- Use the singly linked queue until you have a real mid-list delete. Then the second pointer pays for itself.
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
