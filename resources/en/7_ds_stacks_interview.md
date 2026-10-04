# Stacks — Interview

Answers are filled for the published subset; the rest are still empty.
[← Back to hub](./7_special_data_structures.md)

### Related docs

- [Stacks — Interview](./7_ds_stacks_interview.md)

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

A stack is a linear collection that adds and removes at the same end, called the top. The last item pushed is the first item popped.

**How it works:**

- The allowed end operations are push, pop, and usually peek. Reaching an item under the top means popping what is above it.
- An array with an index, or a linked list with a pointer at the head, both implement it in O(1).
- The call stack, undo history, and depth-first search are the everyday pictures.
- An empty pop is an error. A fixed array stack can also be full.

**Examples:**

Push 1, push 2, push 3. Pop returns 3, then 2, then 1.
</details>

<details>
<summary>Why Stack is considered a Recursive data structure?</summary>

### Why Stack is considered a Recursive data structure?

**Definition:**

A stack is either empty or a top element sitting on a smaller stack. That is the same shape as a recursive definition.

**How it works:**

- Pop corresponds to stripping the outermost call. Push corresponds to one more nested call.
- A recursive function that processes a list by handling the head and recursing on the tail is walking a stack of frames, one per element.
- Depth-first traversal can be written as recursion or as an explicit stack. They visit in the same order.
- The recursion depth is the stack height. A long chain can overflow the call stack even when an explicit stack of the same height would fit on the heap.
</details>

<details>
<summary>What are the primary operations performed on a Stack and their time complexities?</summary>

### What are the primary operations performed on a Stack and their time complexities?

**Definition:**

The core operations touch only the top, so they are O(1) in both the array and the linked-list versions.

**How it works:**

- Push writes the new top. Pop removes it and returns it. Peek reads it without removing it.
- isEmpty and size are O(1) if you keep a counter or a top index. Searching for an arbitrary value is O(n), because you may have to pop everything.
- A dynamic-array push is amortized O(1) and occasionally O(n) on resize.
- Space is O(n) for n items.
</details>

### Stack Usage and Applications

<details>
<summary>When should I use Stack or Queue data structures instead of Arrays/Lists?</summary>

### When should I use Stack or Queue data structures instead of Arrays/Lists?

**Definition:**

Use a stack or a queue when the problem only allows access at an end. Use an array when you need random indexes.

**How it works:**

- A stack matches nested structure: parentheses, function calls, undo, DFS.
- A queue matches arrival order: tasks, BFS, buffers between a producer and a consumer.
- An array or a dynamic list is the right tool for binary search, sorting, and `a[i]`.
- Under the hood the stack or queue often is an array or a list. The point of the narrower type is to make the illegal access obvious.
</details>

<details>
<summary>What are Infix, Prefix, and Postfix notations?</summary>

### What are Infix, Prefix, and Postfix notations?

**Definition:**

The three notations differ in where the operator sits relative to its operands. Postfix and prefix do not need parentheses to fix order.

**How it works:**

- Infix writes the operator between operands: `2 + 3`. Precedence and parentheses decide what binds.
- Prefix (Polish) writes the operator first: `+ 2 3`. Postfix (reverse Polish) writes it last: `2 3 +`.
- A stack evaluates postfix left to right: push numbers, and on an operator pop the operands, compute, and push the result.
- Infix to postfix also uses a stack of operators, popping while the top has higher or equal precedence.

**Examples:**

`2 + 3 * 4` is postfix `2 3 4 * +`, which evaluates as `3 * 4 = 12`, then `2 + 12 = 14`.
</details>

<details>
<summary>Explain how Stacks are used in Function Call management in programming languages.</summary>

### Explain how Stacks are used in Function Call management in programming languages.

**Definition:**

Each call pushes a frame: return address, parameters, and local variables. Returning pops that frame and resumes the caller.

**How it works:**

- The frame pointer and the stack pointer mark the current frame. Callees that obey the calling convention restore the caller's registers.
- Recursion is several frames of the same function. The depth is the number of live calls.
- A stack overflow is that region running out. Tail calls can reuse a frame when the language performs that optimization.
- Debuggers walk the frames from the top to print the stack trace.

**Examples:**

`main` calls `f`, `f` calls `g`. The frames sit as `main`, then `f`, then `g`. When `g` returns, `f`'s frame is on top again.
</details>

<details>
<summary>Describe an application where Stacks are naturally suited over other data structures.</summary>

### Describe an application where Stacks are naturally suited over other data structures.

**Definition:**

Matching nested delimiters is a stack problem: the closer you see must match the opener most recently seen.

**How it works:**

- Push each opening bracket. On a closing bracket, pop and compare. A mismatch, or a pop on empty, or leftovers at the end, means the string is invalid.
- A queue would match the oldest opener, which is the wrong bracket. An array index can do it, but you would be rebuilding a stack.
- The same pattern parses nested expressions and walks back from a child to a parent in a depth-first search.
- Time is O(n) and extra memory is O(n) for a fully nested string.

**Examples:**

`([]{})` pushes `(`, `[`, pops on `]`, pops on `)`, pushes `{`, pops on `}`. The stack ends empty, so the string matches.
</details>

### Stack Implementation Details

<details>
<summary>Compare Array-based vs Linked List stack implementations.</summary>

### Compare Array-based vs Linked List stack implementations.

**Definition:**

An array stack keeps items in a block and a top index. A linked-list stack pushes and pops at the head node.

**How it works:**

- Array push and pop are O(1) until a fixed capacity is hit, or amortized O(1) if the block grows. Linked-list push and pop are O(1) and allocate a node each time.
- The array is cache-friendly and wastes the unused capacity. The list uses only the nodes it has and pays a pointer per item plus allocator overhead.
- The array can overflow a fixed buffer. The list fails only when the heap allocation fails.
- Peek is O(1) in both. Neither finds an arbitrary item faster than O(n).
</details>

<details>
<summary>Implement a Dynamic Stack that automatically resizes itself.</summary>

### Implement a Dynamic Stack that automatically resizes itself.

**Definition:**

Store the items in a dynamic array. When a push finds `size == capacity`, allocate a larger block, copy, then write the new top.

**How it works:**

- Doubling is the usual growth. One resize is O(n), and a series of pushes from empty is amortized O(1).
- Pop can shrink when the size falls below a fraction of capacity, often a quarter, so grow and shrink do not oscillate.
- Copy into the new block in index order and keep the same top index.
- The public operations stay push, pop, and peek. Callers do not see the capacity.

**Examples:**

```text
capacity 2, push 1, push 2, push 3
allocate 4, copy [1, 2], write 3, size = 3
```
</details>

<details>
<summary>What are the performance implications of a Fixed-size Array Stack Implementation?</summary>

### What are the performance implications of a Fixed-size Array Stack Implementation?

**Definition:**

A fixed array makes every push and pop a true O(1) with no allocation, and it refuses a push once the buffer is full.

**How it works:**

- There is no amortized resize spike, which is attractive on a real-time path.
- You must pick the capacity up front. Too small fails a legal workload. Too large reserves memory that sits empty.
- Locality is excellent: the live prefix is one contiguous block.
- Overflow has to be an explicit error or a defined drop policy. Silent wrap into old slots corrupts the stack.
</details>

### Stack Design Challenges

<details>
<summary>Design a Stack that supports Retrieving the min element in O(1).</summary>

### Design a Stack that supports Retrieving the min element in O(1).

**Definition:**

Keep a second stack of the minimums. Each push records the minimum of the new value and the previous minimum, and each pop discards that record.

**How it works:**

- The main stack stores values in LIFO order. The min stack's top is always the minimum of the main stack.
- Push and pop stay O(1). getMin reads the min stack's top in O(1). Extra space is O(n).
- A tighter version pushes onto the min stack only when the new value is less than or equal to the current minimum, and pops it only when the popped value equals that minimum.
- Duplicates matter: if you push a second copy of the current minimum, the tight version must push it too, or a later pop would expose the wrong minimum.

**Examples:**

```text
push 3 -> min 3
push 1 -> min 1
push 2 -> min 1
pop     -> min 1 still, because 2 was not the minimum
pop     -> min 3
```
</details>

<details>
<summary>How can you design a Stack to be thread-safe?</summary>

### How can you design a Stack to be thread-safe?

**Definition:**

Serialize the operations that read or write the top, or use a concurrent stack whose nodes are linked with an atomic compare-and-swap.

**How it works:**

- A mutex around push, pop, and peek makes the array or list stack correct. It also makes those calls wait on each other.
- Hold the lock only around the pointer or index update, not around the caller's later work on the value.
- A lock-free stack pushes by swinging the head with CAS and pops the same way. The ABA problem and safe reclamation of nodes are the hard parts.
- A lock-free design is still not a fairness policy. A hot stack can starve a slow thread. Sometimes a queue is the structure you actually wanted.
</details>

<details>
<summary>Implement a Stack with a Find-Middle operation in O(1) time.</summary>

### Implement a Stack with a Find-Middle operation in O(1) time.

**Definition:**

Use a doubly linked list and keep a pointer at the middle node, plus the size, so the middle moves by at most one node on each push or pop.

**How it works:**

- Push and pop still happen at the head, which is the top. The middle pointer is not the top.
- When the size goes from odd to even or even to odd, slide the middle pointer one step toward the head or toward the tail. The exact rule must be fixed and tested; both 'lower middle' and 'upper middle' are coherent if you stick to one.
- findMiddle reads that node in O(1). Delete-middle unlinks it in O(1) because you have the previous pointer, then slides the middle to a neighbor.
- An array stack finds the middle index in O(1) too, but deleting it shifts elements and is O(n).

**Examples:**

Size 3, nodes `3 ↔ 2 ↔ 1`, middle points at 2. Push 4: size 4, middle steps once toward the new head or stays, according to the chosen parity rule, and the move is one pointer update.
</details>

### Stack and Other Data Structures

<details>
<summary>Implement a Linked List using Stack.</summary>

### Implement a Linked List using Stack.

**Definition:**

A singly linked list's forward order can be built by pushing nodes and then popping them, which reverses a stack into list order, but day-to-day list operations are not a single stack.

**How it works:**

- To reverse a list, push every node, then pop them into a new chain. That is one stack used as scratch space, O(n) time and O(n) extra memory.
- Insert and delete in the middle of a list still need a pointer walk. A stack only helps at one end.
- Two stacks can simulate a list with a cursor: the left stack is everything before the cursor, reversed, and the right stack is everything after it. Moving the cursor pops one stack and pushes the other.
- That two-stack list makes insert-at-cursor O(1) and makes a long move O(n).

**Examples:**

List `1 -> 2 -> 3`. Push 1, 2, 3. Pop into a new list: `3 -> 2 -> 1`.
</details>

<details>
<summary>Implement Doubly Linked List using Stacks with min complexity.</summary>

### Implement Doubly Linked List using Stacks with min complexity.

**Definition:**

Two stacks back to back give a doubly ended sequence: one stack holds the left side and the other the right side, and moving across the middle transfers one element.

**How it works:**

- The left stack's top is the element just left of the cursor. The right stack's top is the element just right of it. Push-left and push-right are O(1).
- A step left pops the left stack and pushes that value onto the right stack. A step right does the opposite. One step is O(1). Jumping n steps is O(n).
- This is the minimum extra structure that gives O(1) insert and delete at a movable cursor without storing two pointers inside every element.
- True random access stays O(n). If you need index `i` often, an array is cheaper than sliding the cursor.

**Examples:**

Left `[1, 2]` with 2 on top, right `[4, 3]` with 3 on top represents the sequence `1 2 | 3 4`. One step right yields left `[1, 2, 3]` and right `[4]`.
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
