# Heaps and Maps — Interview

Answers are filled for the published subset; the rest are still empty.
[← Back to hub](./7_special_data_structures.md)

### Related docs

- [Heaps and Maps — Interview](./7_ds_heaps_maps_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Heaps And Maps](https://devinterview.io/questions/data-structures-and-algorithms/heap-and-map-data-structures-interview-questions/).

### Basic Heap Concepts

<details>
<summary>What is a Heap?</summary>

### What is a Heap?

**Definition:**

A binary heap is a complete binary tree stored so that every parent is ordered against its children. The extreme value sits at the root.

**How it works:**

- In a min-heap each parent is less than or equal to its children. In a max-heap each parent is greater than or equal to its children.
- The tree is complete, so it packs into an array: the children of index `i` are `2i + 1` and `2i + 2` when indexes start at 0.
- Insert and delete-extreme are O(log n). Reading the extreme is O(1). Finding an arbitrary value is O(n).
- The heap order is not a full sort. The array is not sorted from left to right.

**Examples:**

Min-heap array `[1, 3, 2]`: 1 is the root, 3 is the left child, 2 is the right child.
</details>

<details>
<summary>What is a Priority Queue?</summary>

### What is a Priority Queue?

**Definition:**

A priority queue retrieves the item with the best key next, not the item that arrived first.

**How it works:**

- The usual operations are insert and extract-min or extract-max. A binary heap implements both in O(log n).
- A sorted array makes extract O(1) and insert O(n). An unsorted array makes insert O(1) and extract O(n).
- Dijkstra, A*, Huffman coding, and schedulers use it to always expand the current best.
- Stable ordering of equal keys is not part of the heap contract. If arrival order matters among equals, store a counter in the key.
</details>

<details>
<summary>How does the Binary Heap property differ between a max heap and a min heap?</summary>

### How does the Binary Heap property differ between a max heap and a min heap?

**Definition:**

The shape is the same complete tree. Only the comparison at each parent flips.

**How it works:**

- Max-heap: `parent ≥ left` and `parent ≥ right`. The largest value is at index 0.
- Min-heap: `parent ≤ left` and `parent ≤ right`. The smallest value is at index 0.
- Children of one parent have no order between them. `[1, 4, 2]` and `[1, 2, 4]` can both be min-heaps.
- A max-heap is a min-heap of negated keys, which is how one implementation serves both.
</details>

<details>
<summary>Can you explain heap property maintenance after an Insert operation and a Delete operation?</summary>

### Can you explain heap property maintenance after an Insert operation and a Delete operation?

**Definition:**

Insert sifts the new item up. Delete-extreme puts the last item at the root and sifts it down.

**How it works:**

- Insert writes the item at the next free index, which is the next leaf of the complete tree. While it beats its parent, swap them. That is O(log n) swaps.
- Delete-min (or delete-max) reads the root, moves the last leaf into the root, shrinks the size, and sifts down: swap with the better child until the order holds.
- Sift-up and sift-down only follow one path. They do not rebuild the whole tree.
- After either operation the tree is still complete and every parent still obeys the heap order.

**Examples:**

Min-heap `[1, 3, 2]`, insert 0. The array becomes `[1, 3, 2, 0]`, then 0 swaps with 3 and then with 1, ending as `[0, 1, 2, 3]`.
</details>

<details>
<summary>Insert an item into the Heap. Explain your actions.</summary>

### Insert an item into the Heap. Explain your actions.

**Definition:**

Append the item as the last leaf, then swap it upward while it violates the order with its parent.

**How it works:**

- The parent of index `i` is `(i - 1) // 2` for zero-based arrays.
- Stop when the item is the root or it no longer beats its parent.
- Each swap restores the order on that edge and may break the edge above, which the next swap fixes.
- The item does not compare with its siblings. Only the ancestor chain matters.

**Examples:**

Max-heap `[9, 5, 6]`, insert 8. Place 8 at index 3. Parent index 1 holds 5, and 8 > 5, so swap to `[9, 8, 6, 5]`. Parent of index 1 is 9, and 8 ≤ 9, so stop.
</details>

### Heaps Implementation and Optimization

<details>
<summary>Compare Heaps-Based vs. Arrays-Based priority queue implementations.</summary>

### Compare Heaps-Based vs. Arrays-Based priority queue implementations.

**Definition:**

A heap keeps insert and extract logarithmic. An array makes one of those two operations linear.

**How it works:**

- Unsorted array: insert at the end is O(1), extract scans for the extreme and shifts, O(n).
- Sorted array: extract at the end is O(1), insert binary-searches and then shifts, O(n).
- Binary heap: both are O(log n), and the extreme is always at index 0.
- Use the unsorted array only for a tiny queue. Use the heap when both operations are frequent, which is the usual graph algorithm.
</details>

<details>
<summary>How can you implement a heap efficiently using Dynamic Arrays?</summary>

### How can you implement a heap efficiently using Dynamic Arrays?

**Definition:**

The heap's complete shape is exactly a prefix of a dynamic array. Grow the array when the next leaf does not fit.

**How it works:**

- Index arithmetic replaces pointers. No per-node allocation, and siblings sit near each other in memory.
- Append is the insert's first step. Doubling keeps a series of inserts amortized O(1) before the O(log n) sift.
- Delete-extreme swaps the root with the last index and then `pop`s the array, which is O(1) at the end, then sifts down.
- Shrinking the capacity after many deletes is optional. Leaving spare capacity avoids a grow-shrink loop.
</details>

<details>
<summary>Name some ways to implement Priority Queue.</summary>

### Name some ways to implement Priority Queue.

**Definition:**

Any structure that can insert an item and later remove the best one is a priority queue. The heap is the default.

**How it works:**

- Binary heap on an array: O(log n) insert and extract.
- Unsorted or sorted array, or a linked list: one of the two operations is O(n).
- A balanced BST orders every key, so extract-min is O(log n) and you also get search. The constants and the pointers are heavier than a heap.
- A Fibonacci heap has a cheaper theoretical decrease-key. In practice a binary heap is what libraries ship.
</details>

<details>
<summary>How does the Lazy deletion technique work in a heap and what is its purpose?</summary>

### How does the Lazy deletion technique work in a heap and what is its purpose?

**Definition:**

Lazy deletion marks an item dead and leaves it in place until it reaches the root, instead of searching the array to remove it now.

**How it works:**

- A direct delete of an arbitrary index is possible in O(log n) if you already know the index. Finding that index is O(n) unless you keep a side map.
- With a deleted-set, extract skips a root that is marked and sifts the replacement, repeating until the root is live.
- Insert of a 'new version' of a key can leave the old version marked. Decrease-key in Dijkstra is often done this way: push the better pair and ignore the stale one when it comes out.
- The heap can hold dead entries, so the size used for complexity is the number of pushes, not the number of live items, until a rebuild drops the dead ones.
</details>

<details>
<summary>Explain Heapify and where it is used in heap operations.</summary>

### Explain Heapify and where it is used in heap operations.

**Definition:**

Heapify restores the heap order at one subtree, assuming the children are already heaps. Building a heap calls it from the bottom up.

**How it works:**

- Sift-down at index `i` compares the node with its children and swaps with the extreme child, then repeats.
- Floyd's build starts at the last parent, index `n // 2 - 1`, and sifts down through the root. The total is O(n), not O(n log n), because most nodes are near the leaves.
- Insert uses sift-up, which is a different direction. Delete-extreme uses sift-down at the root, which is heapify on the whole tree.
- Heapsort's loop is extract plus heapify on the shrinking prefix.
</details>

### Heaps Sorting and Algorithms

<details>
<summary>What is Heap Sort?</summary>

### What is Heap Sort?

**Definition:**

Heapsort builds a max-heap and then repeatedly swaps the root with the last unsorted index and sifts the new root down.

**How it works:**

- After the build, the largest item is at index 0. Swap it to the end, shrink the heap by one, and sift down. The end of the array fills with sorted items.
- Time is O(n log n) in every case. Extra memory is O(1) beyond the input array.
- It is not stable. Equal keys can reorder.
- The inner loop jumps around the array, so it is often slower than a well-tuned quicksort even though the worst case is better.

**Examples:**

`[3, 1, 2]` becomes a max-heap `[3, 1, 2]`, swap 3 to the end, sift `[2, 1]`, swap 2, and the array is `[1, 2, 3]`.
</details>

<details>
<summary>How does Heap Sort compare to Quick Sort in terms of speed and memory usage?</summary>

### How does Heap Sort compare to Quick Sort in terms of speed and memory usage?

**Definition:**

Heapsort guarantees O(n log n) time and O(1) extra memory. Quicksort is usually faster and uses O(log n) stack, with an O(n²) worst case if pivots are bad.

**How it works:**

- Quicksort's partition scans a range sequentially, which matches the cache. Heapsort's sift jumps from parent to child.
- Introsort starts as quicksort and switches to heapsort when the recursion gets too deep, which is how several standard libraries get both speed and a worst-case bound.
- Mergesort is stable and also O(n log n), and it needs O(n) extra buffer. Heapsort does not.
- Pick heapsort when you need a hard time bound and no extra buffer and stability does not matter.
</details>

<details>
<summary>Describe the algorithm for Merging k Sorted Arrays using a heap.</summary>

### Describe the algorithm for Merging k Sorted Arrays using a heap.

**Definition:**

A min-heap of size k holds the current head of each array. Each extract-min is the next output item, and you push the successor from that same array.

**How it works:**

- Initialize the heap with `(value, array_id, index)` for index 0 of every non-empty array.
- Pop the smallest, append it to the output, and if that array has a next element, push it. Repeat until the heap is empty.
- There are N elements in total and each costs O(log k), so the merge is O(N log k). The heap stores k tuples, not all N items.
- A pairwise mergesort of the arrays is another O(N log k). The heap version streams the output and matches the k-way merge inside external sort.

**Examples:**

Arrays `[1, 4]`, `[2, 3]`, `[0]`. The heap starts with 1, 2, and 0. Pop 0, then 1, push 4, pop 2, pop 3, pop 4. Output `[0, 1, 2, 3, 4]`.
</details>

<details>
<summary>Implement a heap that efficiently supports Find-Max and Find-Min operations.</summary>

### Implement a heap that efficiently supports Find-Max and Find-Min operations.

**Definition:**

One binary heap exposes only one extreme in O(1). To read both, keep a min-heap and a max-heap of the same items, or use a min-max heap that alternates the order by level.

**How it works:**

- Twin heaps: every item lives in both, linked by indexes or ids. Insert updates both in O(log n). Delete-min removes from the min-heap and from the max-heap by the stored index.
- A min-max heap stores mins on even levels and maxes on odd levels, in one array. Find-min and find-max are O(1). Insert and delete are still O(log n), with a longer sift.
- A balanced BST also does both in O(1) for the ends and O(log n) for updates, and it uses more memory per node.
- If you only need both ends and not a general priority delete, a double-ended heap is enough. Do not fully sort the array.
</details>

### Heap Applications

<details>
<summary>What are some Practical Applications of Heaps?</summary>

### What are some Practical Applications of Heaps?

**Definition:**

Heaps show up wherever the next step is 'take the current best' and the set of candidates keeps changing.

**How it works:**

- Dijkstra and Prim grow a frontier by the smallest distance or weight.
- Heapsort and the selection of the k smallest items: a bounded heap of size k is O(n log k).
- Huffman coding repeatedly merges the two lightest trees.
- Operating systems schedule the next timer or the next ready task by priority. Streaming medians use two heaps.
</details>

<details>
<summary>How is a heap used in the Huffman Coding algorithm?</summary>

### How is a heap used in the Huffman Coding algorithm?

**Definition:**

</details>

<details>
<summary>Explain how heaps are used in Real-Time Scheduling systems.</summary>

### Explain how heaps are used in Real-Time Scheduling systems.

**Definition:**

</details>

<details>
<summary>Discuss how heaps can manage efficiently Data Stream Median Finding.</summary>

### Discuss how heaps can manage efficiently Data Stream Median Finding.

**Definition:**

</details>

### Heaps Comparison and Choice

<details>
<summary>What are the advantages of Heaps over Sorted Arrays?</summary>

### What are the advantages of Heaps over Sorted Arrays?

**Definition:**

</details>

<details>
<summary>What is the difference between Heap and Red-Black Tree?</summary>

### What is the difference between Heap and Red-Black Tree?

**Definition:**

</details>

<details>
<summary>When would you choose a Fibonacci Heap over a Binary Heap?</summary>

### When would you choose a Fibonacci Heap over a Binary Heap?

**Definition:**

</details>

<details>
<summary>What situations might call for using a Binomial Heap?</summary>

### What situations might call for using a Binomial Heap?

**Definition:**

</details>

<details>
<summary>Compare and contrast the use cases of Min-Heaps vs. Max-Heaps.</summary>

### Compare and contrast the use cases of Min-Heaps vs. Max-Heaps.

**Definition:**

</details>

### Heap Operations and Challenges

<details>
<summary>Find 100 largest numbers in an Array of 1 billion numbers.</summary>

### Find 100 largest numbers in an Array of 1 billion numbers.

**Definition:**

</details>

<details>
<summary>Implement the operation Decrease-Key in a Binary Heap, and discuss its complexity.</summary>

### Implement the operation Decrease-Key in a Binary Heap, and discuss its complexity.

**Definition:**

</details>

<details>
<summary>Solve the Kth Smallest Element in a Min Heap without modifying the heap.</summary>

### Solve the Kth Smallest Element in a Min Heap without modifying the heap.

**Definition:**

</details>

<details>
<summary>How could you implement a heap which supports the operation of Deleting any element (not only the root)?</summary>

### How could you implement a heap which supports the operation of Deleting any element (not only the root)?

**Definition:**

</details>

### Map Data Structures Basics

<details>
<summary>Define a Map data structure and explain how it differs from a Heap.</summary>

### Define a Map data structure and explain how it differs from a Heap.

**Definition:**

</details>

<details>
<summary>What is a Hash Map, and how does it work internally?</summary>

### What is a Hash Map, and how does it work internally?

**Definition:**

</details>

<details>
<summary>Discuss various collision resolution strategies in a Hash Map.</summary>

### Discuss various collision resolution strategies in a Hash Map.

**Definition:**

</details>

### Map Data Structures Implementation

<details>
<summary>Implement a simple Hash Map with Chaining for collision resolution.</summary>

### Implement a simple Hash Map with Chaining for collision resolution.

**Definition:**

</details>

<details>
<summary>How does a Tree Map work, and when would you use it over a hash map?</summary>

### How does a Tree Map work, and when would you use it over a hash map?

**Definition:**

</details>

<details>
<summary>Could you implement a map using an Array? If so, what would be the limitations?</summary>

### Could you implement a map using an Array? If so, what would be the limitations?

**Definition:**

</details>

### Maps Operations and Complexities

<details>
<summary>What is the average-case and worst-case Time Complexity for operations in a Hash Map?</summary>

### What is the average-case and worst-case Time Complexity for operations in a Hash Map?

**Definition:**

</details>

<details>
<summary>How do Cuckoo Hashing and Linear Probing improve Hash Map performance?</summary>

### How do Cuckoo Hashing and Linear Probing improve Hash Map performance?

**Definition:**

</details>

<details>
<summary>Explain the impact of the Load Factor on a Hash Map’s performance.</summary>

### Explain the impact of the Load Factor on a Hash Map’s performance.

**Definition:**

</details>

### Maps in Algorithms and Applications

<details>
<summary>Describe a scenario where a Map is used in a Caching System (like LRUCache).</summary>

### Describe a scenario where a Map is used in a Caching System (like LRUCache).

**Definition:**

</details>

<details>
<summary>How are maps used in the implementation of Graph Data Structures like adjacency lists?</summary>

### How are maps used in the implementation of Graph Data Structures like adjacency lists?

**Definition:**

</details>

<details>
<summary>Discuss the role of maps in constructing an efficient Word Dictionary or Inverted Index.</summary>

### Discuss the role of maps in constructing an efficient Word Dictionary or Inverted Index.

**Definition:**

</details>

### Maps and Heaps Coding Challenges

<details>
<summary>Design a data structure that supports the following operations: Insertion, Deletion, Get-Random Element, where all operations have equal probability using both Heaps and Maps.</summary>

### Design a data structure that supports the following operations: Insertion, Deletion, Get-Random Element, where all operations have equal probability using both Heaps and Maps.

**Definition:**

</details>

<details>
<summary>Implement a Counter Map to find and list the k most frequent elements in an array.</summary>

### Implement a Counter Map to find and list the k most frequent elements in an array.

**Definition:**

</details>

<details>
<summary>Write a solution for the Sliding Window Maximum problem using Heaps.</summary>

### Write a solution for the Sliding Window Maximum problem using Heaps.

**Definition:**

</details>

<details>
<summary>Solve the Top K Frequent Words problem with a combination of Heap and Map data structures.</summary>

### Solve the Top K Frequent Words problem with a combination of Heap and Map data structures.

**Definition:**

</details>

<details>
<summary>Design a Leaderboard system that supports fast player score updates and rank retrieval using both Heaps and Maps.</summary>

### Design a Leaderboard system that supports fast player score updates and rank retrieval using both Heaps and Maps.

**Definition:**

</details>
