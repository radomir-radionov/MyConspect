# Linked Lists — Interview

Answers are filled for the published subset; the rest are still empty.
[← Back to hub](./7_special_data_structures.md)

### Related docs

- [Linked Lists — Interview](./7_ds_linked_lists_interview.md)

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

A linked list stores each element in its own node, and each node holds a pointer to the next one. The list is the pointer to the first node.

**How it works:**

- There is no index arithmetic. Reaching the k-th node walks k links, which is O(k).
- Insert or delete next to a node you already hold is O(1): swing a couple of pointers. Finding that node is the expensive part.
- Nodes live wherever the allocator put them, so a scan jumps around memory.
- Variants add a previous pointer, a tail pointer, or a link from the last node back to the first.

**Examples:**

`10 -> 20 -> 30`. The head points at 10. 20 is reachable only by following 10's next pointer.
</details>

<details>
<summary>What are some pros and cons of Linked List compared to Arrays?</summary>

### What are some pros and cons of Linked List compared to Arrays?

**Definition:**

A list wins when you insert and delete in the middle and already have the node. An array wins when you need an index or a tight scan.

**How it works:**

- List: O(1) splice at a known node, and the size grows one node at a time. Array: O(1) index, cache-friendly scan, O(n) shift in the middle.
- A list uses a pointer (and often a heap header) per element. An array uses one block plus maybe spare capacity.
- A list has no random access. Binary search on a plain list is not O(log n) in time, because you cannot jump to the middle.
- Prefer a list for a queue of tasks you splice, an LRU's node moves, or an allocator free list. Prefer an array for numeric data and indexes.
</details>

<details>
<summary>Explain the difference between Singly Linked Lists and Doubly Linked Lists.</summary>

### Explain the difference between Singly Linked Lists and Doubly Linked Lists.

**Definition:**

A singly linked node stores next. A doubly linked node stores next and previous, so you can walk both ways and delete a node from the node itself.

**How it works:**

- Singly linked: less memory, and insert-after or delete-after a known node is O(1). Delete of this node needs the previous node, which a forward-only walk may not have.
- Doubly linked: delete of a known node is O(1), and you can step backward. Each node pays a second pointer.
- A tail pointer makes append O(1) on both. Without it, append on a singly linked list walks to the end.
- Browser history and LRU caches want the double links. A simple stack does not.
</details>

<details>
<summary>How does a Linked List manage memory allocation differently from an Array?</summary>

### How does a Linked List manage memory allocation differently from an Array?

**Definition:**

An array asks for one contiguous block. A list asks for one node at a time, and those nodes need not be adjacent.

**How it works:**

- The array allocation fails if no single gap is large enough, even when the total free memory would fit the elements.
- The list allocation can succeed node by node from scattered free blocks. It fails only when one node does not fit.
- Freeing a list walks the nodes and frees each, or it returns them to a pool. Freeing an array is one release.
- A node is larger than the payload because of the pointer and the allocator's header. A tight array of integers is denser.
</details>

<details>
<summary>What are the basic operations that can be performed on a Linked List?</summary>

### What are the basic operations that can be performed on a Linked List?

**Definition:**

The basic operations are traverse, insert, delete, and search. Their cost depends on whether you already hold the neighboring node.

**How it works:**

- Insert at the head is O(1). Insert after a known node is O(1). Insert at an index walks there first, O(n).
- Delete at the head is O(1). Delete after a known node is O(1) on a singly linked list. Delete of a known node is O(1) on a doubly linked list.
- Search and index are O(n). There is no O(1) jump.
- Reverse, find the middle with two pointers, and detect a cycle are built from the same walk.
</details>

### Advantages and Use Cases of Linked Lists

<details>
<summary>What are some real-life Use Cases of Linked Lists?</summary>

### What are some real-life Use Cases of Linked Lists?

**Definition:**

Lists show up where items are spliced by pointer more often than they are indexed.

**How it works:**

- A music playlist or a browser history that moves to the next and previous item and deletes the current one.
- An OS free-memory list or a scheduler queue that takes and returns blocks in the middle.
- An LRU cache: the hash table finds the node, and the doubly linked list moves it to the front in O(1).
- A polynomial or a sparse row stored as terms, so absent terms take no nodes.
</details>

<details>
<summary>When is a Circular Linked List useful?</summary>

### When is a Circular Linked List useful?

**Definition:**

A circular list links the last node back to the first, so a walk can spin forever and there is no null end to test.

**How it works:**

- Round-robin scheduling walks next and wraps without a special case at the tail.
- A circular buffer of nodes, or the second half of Floyd's cycle algorithm, uses the loop on purpose.
- Insert and delete still swing pointers, and you keep a cursor rather than a head-plus-null.
- A missing break in the walk is an infinite loop. The end condition is 'back to the start', not 'next is null'.
</details>

<details>
<summary>When is Doubly Linked List more efficient than Singly Linked List?</summary>

### When is Doubly Linked List more efficient than Singly Linked List?

**Definition:**

A doubly linked list is more efficient when the operation needs the previous node and you do not already have it from a forward scan.

**How it works:**

- Deleting a node you found by value is O(1) once you hold it, because previous is inside the node. A singly linked delete walks again to find previous, unless you tracked it.
- Moving backward, or inserting before a node, is O(1).
- The extra pointer is pure overhead when you only ever push and pop at the head.
- LRU caches and intrusive lists in kernels are the usual reason to pay for the second pointer.
</details>

<details>
<summary>Describe a scenario where the use of a Linked List is more suitable than a Dynamic Array.</summary>

### Describe a scenario where the use of a Linked List is more suitable than a Dynamic Array.

**Definition:**

A linked list fits when you constantly splice in the middle and almost never ask for the i-th item.

**How it works:**

- A text editor's piece table or a gap buffer can be a list of chunks: inserting a paragraph swings pointers instead of shifting every later character.
- An event queue that removes a cancelled task from the middle, when you already hold the node, is O(1). A dynamic array shifts the tail.
- The list is worse when the next step is a scan of millions of integers: the pointer chasing loses to a contiguous buffer.
- If you need both splice and index, a rope, a skip list, or a balanced tree of chunks is the next step, not a raw list.
</details>

### Linked Lists vs. Other Data Structures

<details>
<summary>Compare Array-based vs Linked List stack implementations.</summary>

### Compare Array-based vs Linked List stack implementations.

**Definition:**

Both stacks push and pop at one end in O(1). They differ in allocation, locality, and what 'full' means.

**How it works:**

- The array version writes at a top index. A fixed buffer can be full. A dynamic buffer resizes occasionally.
- The list version inserts a node at the head and pops by advancing head. It allocates per push.
- The array is one cache line after another. The list is a pointer chase.
- Peek is O(1) either way. Neither is a good random-access stack.
</details>

<details>
<summary>How do Linked Lists perform in comparison with Trees for various operations?</summary>

### How do Linked Lists perform in comparison with Trees for various operations?

**Definition:**

A list is a tree restricted to one child, so search is linear. A balanced search tree spends a log factor to jump toward a key.

**How it works:**

- Search and index on a list are O(n). On a balanced BST they are O(log n).
- Insert at a known list position is O(1). Insert in a balanced tree is O(log n) because the tree must find the place and maybe rotate.
- Ordered iteration is O(n) for both. The list's constant is smaller and the scan is still pointer-chasing unless the nodes were allocated together.
- Use a list for a sequence you walk from the front. Use a tree when you look up by key.
</details>

<details>
<summary>When would you use a Linked List over a Hash Table?</summary>

### When would you use a Linked List over a Hash Table?

**Definition:**

Use a list when the order of items is the data, or when you splice neighbors. Use a hash table when you need membership or lookup by key.

**How it works:**

- A list preserves insertion order with no hash and no load factor. A hash table does not, unless it is one of the ordered variants that hide a list inside.
- There is no key. Playlist tracks and undo steps are a sequence, not a map.
- A hash table is the wrong tool for 'the node after this one' and the right tool for 'have I seen this id'.
- The combination is common: a hash table for O(1) find and a list for O(1) order, as in LRU.
</details>

### Traversal and Search in Linked Lists

<details>
<summary>Is it possible to Traverse a Linked List in O(n1/2)? (Jump Pointers).</summary>

### Is it possible to Traverse a Linked List in O(n1/2)? (Jump Pointers).

**Definition:**

A jump pointer on some nodes points ahead by about √n steps, so a search can skip most nodes and land in a block of length about √n.

**How it works:**

- Build an extra link every √n nodes. A search follows jump links until the next jump would pass the target, then walks the ordinary links.
- The jump phase and the walk phase are each O(√n), so one search is O(√n). Building the jumps is O(n).
- This is not the plain list. You added a second pointer and you must fix jumps on insert and delete, or the skip is wrong.
- A skip list generalizes the same idea into several levels and gets expected O(log n).

**Examples:**

100 nodes, a jump every 10. Finding item 47 follows 4 jump links to 40, then walks 7 ordinary links.
</details>

<details>
<summary>How to apply Binary Search in O(log n) on a Sorted Linked List? (Skip Lists).</summary>

### How to apply Binary Search in O(log n) on a Sorted Linked List? (Skip Lists).

**Definition:**

A plain sorted list cannot do O(log n) binary search, because the middle is a walk. A skip list adds higher-level links so the search drops down like a binary search.

**How it works:**

- Each node appears in level 0. It is promoted to the next level with probability about 1/2, like a random binary tree laid over the list.
- Search starts at the top-left. It walks right while the next key is still ≤ the target, then drops a level. Expected search is O(log n).
- Insert promotes the new node by coin flips and splices it into each level it reaches. Expected insert and delete are O(log n).
- The O(log n) is expected, not a hard height bound. A deterministic skip list or a balanced tree gives a worst-case bound.
</details>

<details>
<summary>Is it possible to do Binary Search on a Doubly Linked List in O(n) time?</summary>

### Is it possible to do Binary Search on a Doubly Linked List in O(n) time?

**Definition:**

Yes. On a sorted doubly linked list, repeatedly walking to the middle of the remaining range costs O(n) altogether, because the walks halve each time.

**How it works:**

- The first middle is n/2 steps, the next n/4, and so on. The sum is less than n, so the pointer walking is O(n).
- The number of key comparisons is O(log n). The time is dominated by the walks, not by the comparisons.
- A linear scan is also O(n) and has a smaller constant, so this binary search does not beat a straight walk for a one-shot lookup.
- It is not O(log n). Getting that bound needs skip links or a tree, not only previous and next.

**Examples:**

16 sorted nodes. Walk 8, then 4, then 2, then 1. That is 15 steps, one pass's worth, and four comparisons.
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
