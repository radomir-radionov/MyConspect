# Arrays — Interview

Answers are filled for the published subset; the rest are still empty.
[← Back to hub](./7_special_data_structures.md)

### Related docs

- [Arrays — Interview](./7_ds_arrays_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Arrays](https://devinterview.io/questions/data-structures-and-algorithms/array-data-structure-interview-questions/).

### Fundamental Array Concepts

<details>
<summary>What is an Array?</summary>

### What is an Array?

**Definition:**

An array stores elements of one width in one contiguous block, so an index turns into an address with arithmetic.

**How it works:**

- The address of index `i` is `base + i × element size`. That is why random access is O(1).
- A search in an unsorted array is O(n). Insert or delete in the middle shifts neighbors, so those are O(n).
- The capacity is fixed unless the language wraps the block in a dynamic array. Indexes are usually zero-based.
- Contiguous layout makes a sequential scan friendly to the CPU cache.

**Examples:**

```text
base = 1000, element size = 4
index 3 -> address 1012
values [10, 20, 30, 40], a[2] = 30
```
</details>

<details>
<summary>What are Dynamic Arrays?</summary>

### What are Dynamic Arrays?

**Definition:**

A dynamic array is a contiguous buffer plus a length and a capacity. When an append does not fit, it allocates a larger buffer and copies.

**How it works:**

- Growth is usually by a constant factor, often 2. A series of appends is amortized O(1) even though one resize is O(n).
- Indexed access stays O(1). Insert or delete in the middle is still O(n) because elements shift, and a resize can add another O(n).
- The unused capacity is the space overhead. Shrinking on delete is optional and is usually delayed so the array does not thrash.
- `ArrayList`, `std::vector`, and Python's `list` are this structure.

**Examples:**

```text
capacity 2, length 2, append 7
allocate 4, copy the two old items, write 7, length = 3
```
</details>

<details>
<summary>What is an Associative Array (Dictionary)?</summary>

### What is an Associative Array (Dictionary)?

**Definition:**

An associative array stores values under keys and looks them up by key, not by a dense index.

**How it works:**

- A hash table does this in expected O(1) and can fall to O(n) when every key lands in one bucket.
- A balanced search tree does it in O(log n) and keeps keys ordered.
- A list of pairs is O(n) and is only reasonable for a handful of keys.
- Writing an existing key replaces the value. Missing keys are an absence, not a hole in the middle of an index range.

**Examples:**

`prices["tea"] = 2` then `prices["tea"]` returns 2. The key is the string, not a position.
</details>

<details>
<summary>What defines the Dimensionality of an array?</summary>

### What defines the Dimensionality of an array?

**Definition:**

Dimensionality is how many indexes you need to name one element.

**How it works:**

- One index is a sequence. Two indexes are a grid. Three indexes are a stack of grids.
- The element count is the product of the axis lengths.
- Memory is still one block in row-major or column-major order, or it is an array of arrays with a separate allocation per row.
- Row-major offset for `[r, c]` is `r × columns + c`. Column-major swaps those roles.

**Examples:**

A 2×3 grid `[ [1, 2, 3], [4, 5, 6] ]` in row-major order is the flat buffer `[1, 2, 3, 4, 5, 6]`. Element `[1, 2]` sits at offset `1×3+2 = 5`.
</details>

### Array Types and Properties

<details>
<summary>Name some Advantages and Disadvantages of arrays.</summary>

### Name some Advantages and Disadvantages of arrays.

**Definition:**

Arrays win on index access and on scans. They lose when the middle of the collection changes all the time or the size is unknown and huge.

**How it works:**

- O(1) access by index, and a sequential scan that uses the cache because neighbors sit next to each other.
- Fixed capacity unless you pay for a dynamic array's copies. Insert and delete in the middle are O(n).
- A hole in the middle is either a shift or a wasted slot. Sparse data pays for every empty cell.
- Prefer an array when the size is known or index access dominates. Prefer a list or a hash table when the middle changes constantly or lookup is by an arbitrary key.
</details>

<details>
<summary>Explain Sparse and Dense arrays.</summary>

### Explain Sparse and Dense arrays.

**Definition:**

A dense array allocates every slot, including defaults. A sparse array stores only the entries that differ from the default, together with their indexes.

**How it works:**

- Dense lookup is arithmetic and O(1). Sparse lookup searches a map, a coordinate list, or a compressed index.
- CSR and CSC store non-zeros of a matrix plus row or column pointers. A coordinate list stores `(row, column, value)` triples.
- Sparse wins when almost every cell is empty, as in term-document counts or many linear systems. Dense wins when a large fraction of cells are filled, because the index would cost more than the holes.
- Arithmetic on sparse formats has to skip zeros explicitly. A library that densifies by accident can blow memory.
</details>

<details>
<summary>What are advantages and disadvantages of Sorted Arrays?</summary>

### What are advantages and disadvantages of Sorted Arrays?

**Definition:**

A sorted array keeps elements in order so search and range queries are logarithmic, and every insert pays a shift to restore that order.

**How it works:**

- Binary search, successor, predecessor, and range queries are O(log n), and the scan of a range is cache-friendly.
- Insert and delete are O(n) because elements move to keep the order.
- The order is total, which a heap does not give you. You can binary-search any key, not only read the extreme.
- It fits data that is searched often and changed rarely.
</details>

<details>
<summary>What are the advantages of Heaps over Sorted Arrays?</summary>

### What are the advantages of Heaps over Sorted Arrays?

**Definition:**

A binary heap keeps only a parent-child order, so the extreme element is at the root in O(1) and an update of that extreme is O(log n).

**How it works:**

- A sorted array also exposes the minimum or maximum in O(1), but every insert or delete shifts elements and is O(n).
- The heap does not support fast search for an arbitrary key. Finding a middle value is O(n).
- Use a heap when the set changes often and you only need the current extreme, as in a priority queue or Dijkstra.
- Use a sorted array when you need binary search or a range, not only the end of the order.
</details>

### Array Operations and Management

<details>
<summary>How does Indexing work in arrays?</summary>

### How does Indexing work in arrays?

**Definition:**

An index names a position, usually from 0 through n−1, and the address is computed instead of scanned.

**How it works:**

- Equal-sized elements make `address(i) = base + i × width`.
- A bounds check compares `i` with the length. Skipping it is a memory-safety bug.
- A multi-dimensional index flattens. In row-major order the offset is `row × row_length + column`.
- Negative indexes in some languages count from the end and are sugar over `length + i`, not a second array.

**Examples:**

`a = [10, 20, 30]`, `a[0]` is 10, `a[2]` is 30. In Python `a[-1]` is the same slot as `a[2]`.
</details>

<details>
<summary>Merge two Sorted Arrays into one Sorted Array.</summary>

### Merge two Sorted Arrays into one Sorted Array.

**Definition:**

Walk both sorted inputs with one index each and always append the smaller current value.

**How it works:**

- If the heads are equal, append one and then the other; stability keeps the left input's copy first if you care.
- When one input ends, copy the rest of the other. Those leftovers are already sorted.
- Time is O(n + m). The output needs O(n + m) extra space. This is the combine step of mergesort.
- Merging in place into a buffer that already has empty slots at the end is the same comparison order run backwards.

**Examples:**

```text
[1, 4, 6] and [2, 3, 5]
-> 1, then 2, then 3, then 4, then 5, then 6
```
</details>

<details>
<summary>Implement three Stacks with one Array.</summary>

### Implement three Stacks with one Array.

**Definition:**

Either give each stack a fixed slice of the array, or store all three as linked lists of slots plus a free list so any stack can use any free slot.

**How it works:**

- Fixed thirds: each stack has its own top inside `[0, n/3)`, `[n/3, 2n/3)`, and `[2n/3, n)`. Push and pop are O(1), and one stack can be full while another slice is empty.
- Flexible layout: each slot stores a value and the index of the previous slot of the same stack. A free list threads unused indexes.
- Push pops a free index, writes the value, and points it at the old top. Pop returns that index to the free list.
- Both versions are O(1) per operation. The flexible one uses an extra integer per slot and fills the whole array.

**Examples:**

```text
array slots: [a, b, _, c]
tops: stack0=0, stack1=1, stack2=3
free: 2
push stack0 -> take slot 2, prev=0
```
</details>

<details>
<summary>How do you perform Array Rotation and what are its applications?</summary>

### How do you perform Array Rotation and what are its applications?

**Definition:**

A rotation moves a prefix to the end, or a suffix to the front, without changing the relative order inside those pieces.

**How it works:**

- Left rotate by `k` is three reversals: reverse the first `k`, reverse the rest, reverse the whole array. Right rotate reverses the whole array first.
- `k` is taken modulo n so a huge count does not loop. Time is O(n) and extra memory is O(1).
- A juggling cycle or a temporary buffer of `k` also works. Reversal is the in-place form that needs no extra buffer.
- The same idea appears in ring buffers, rotating an image row, and testing whether one string is a rotation of another by searching `s + s`.

**Examples:**

```text
[1, 2, 3, 4, 5] left by 2
reverse [1, 2] -> [2, 1, 3, 4, 5]
reverse [3, 4, 5] -> [2, 1, 5, 4, 3]
reverse all -> [3, 4, 5, 1, 2]
```
</details>

<details>
<summary>Reverse an Array in place.</summary>

### Reverse an Array in place.

**Definition:**

Swap the element at the left index with the element at the right index, then move both indexes toward the center until they meet.

**How it works:**

- About `n/2` swaps run in O(n) time with O(1) extra memory. The original array is overwritten.
- Copy first if the old order must survive.
- An odd length leaves the middle element unswapped, which is correct.
- The same two-pointer pattern reverses a string buffer or a slice of an array.

**Examples:**

```text
[1, 2, 3, 4]
swap 1 and 4 -> [4, 2, 3, 1]
swap 2 and 3 -> [4, 3, 2, 1]
```
</details>

<details>
<summary>Remove Duplicates from a sorted array without using extra space.</summary>

### Remove Duplicates from a sorted array without using extra space.

**Definition:**

Because the array is sorted, duplicates sit together. A write index keeps the last unique value, and a read index scans forward.

**How it works:**

- Start `write` at 0. For each later `read`, if `a[read]` differs from `a[write]`, advance `write` and copy `a[read]` there.
- The unique prefix has length `write + 1`. Slots past that length are leftovers and must be ignored.
- Time is O(n) and extra memory is O(1). The algorithm relies on sorted order; an unsorted array needs a set or a sort first.
- A variant that allows each value twice compares against `a[write - 1]` instead of `a[write]`.

**Examples:**

```text
[1, 1, 2, 2, 3]
write stays on the first 1, then copies 2, then copies 3
unique prefix [1, 2, 3], length 3
```
</details>

<details>
<summary>Implement a Queue using an array.</summary>

### Implement a Queue using an array.

**Definition:**

A ring buffer stores the queue in a fixed array with a head index, a tail index, and a size, and wraps with modulo.

**How it works:**

- Enqueue writes at `tail` and sets `tail = (tail + 1) % capacity`. Dequeue reads `head` and advances it the same way.
- Both are O(1). The queue is empty when `size` is 0 and full when `size` equals capacity.
- Without wrap-around, dequeued slots at the front are wasted and the queue seems full while the back is the only part in use.
- Resizing copies the live elements in order from `head`, then resets `head` to 0. Space stays proportional to capacity.

**Examples:**

```text
capacity 4, enqueue 1, 2, 3 -> slots [1, 2, 3, _]
dequeue -> 1, head wraps
enqueue 4, 5 -> [5, 2, 3, 4]
```
</details>

### Array-based Algorithms

<details>
<summary>Check the String for Balanced Parentheses, using linear time and constant space.</summary>

### Check the String for Balanced Parentheses, using linear time and constant space.

**Definition:**

</details>

<details>
<summary>Explain an algorithm to find the Longest Consecutive Sequence in an unsorted array.</summary>

### Explain an algorithm to find the Longest Consecutive Sequence in an unsorted array.

**Definition:**

</details>

<details>
<summary>Find the “Kth” Largest Element in an Array.</summary>

### Find the “Kth” Largest Element in an Array.

**Definition:**

</details>

<details>
<summary>Explain how to do Binary Search in a Sorted Array.</summary>

### Explain how to do Binary Search in a Sorted Array.

**Definition:**

</details>

<details>
<summary>Implement Heap Sort using an Array.</summary>

### Implement Heap Sort using an Array.

**Definition:**

</details>

### Array Comparison

<details>
<summary>What are some pros and cons of Linked List compared to Arrays?</summary>

### What are some pros and cons of Linked List compared to Arrays?

**Definition:**

</details>

<details>
<summary>Compare Array-based vs Linked List stack implementations.</summary>

### Compare Array-based vs Linked List stack implementations.

**Definition:**

</details>

<details>
<summary>Compare Dynamic Arrays with Linked Lists.</summary>

### Compare Dynamic Arrays with Linked Lists.

**Definition:**

</details>

### Advanced Array Topics and Techniques

<details>
<summary>Shuffle an array, ensuring that each element has an equal probability of being in any position.</summary>

### Shuffle an array, ensuring that each element has an equal probability of being in any position.

**Definition:**

</details>

<details>
<summary>Solve the Rain Water Trapping problem using arrays.</summary>

### Solve the Rain Water Trapping problem using arrays.

**Definition:**

</details>

<details>
<summary>Explain the two-pointer technique and give examples of its use in array problems.</summary>

### Explain the two-pointer technique and give examples of its use in array problems.

**Definition:**

</details>

<details>
<summary>What are the typical use cases for using an array in a Sliding Window Algorithm?</summary>

### What are the typical use cases for using an array in a Sliding Window Algorithm?

**Definition:**

</details>

<details>
<summary>Find all pairs in an Array with a given sum.</summary>

### Find all pairs in an Array with a given sum.

**Definition:**

</details>

### Array Optimization and Use Cases

<details>
<summary>Explain the difference between Column-major Order and Row-major Order in multidimensional arrays.</summary>

### Explain the difference between Column-major Order and Row-major Order in multidimensional arrays.

**Definition:**

</details>

<details>
<summary>How is a Circular Array useful, and how would you implement one?</summary>

### How is a Circular Array useful, and how would you implement one?

**Definition:**

</details>

<details>
<summary>How to optimize operations in a Very Large Array that has many zero elements (i.e., a Sparse Array).</summary>

### How to optimize operations in a Very Large Array that has many zero elements (i.e., a Sparse Array).

**Definition:**

</details>

<details>
<summary>How would you create and work with a Multi-Dimensional Array?</summary>

### How would you create and work with a Multi-Dimensional Array?

**Definition:**

</details>

<details>
<summary>Explain the methodology for Resizing a Dynamic Array and its impact on time complexity.</summary>

### Explain the methodology for Resizing a Dynamic Array and its impact on time complexity.

**Definition:**

</details>

### Array Techniques and Optimization

<details>
<summary>Implement Binary Search in a circularly sorted array.</summary>

### Implement Binary Search in a circularly sorted array.

**Definition:**

</details>

<details>
<summary>Describe an algorithm for Dutch National Flag sorting problem.</summary>

### Describe an algorithm for Dutch National Flag sorting problem.

**Definition:**

</details>

<details>
<summary>How would you multiply two large numbers represented as integer arrays?</summary>

### How would you multiply two large numbers represented as integer arrays?

**Definition:**

</details>

<details>
<summary>Explain how to implement an Efficient Range Sum Query using arrays.</summary>

### Explain how to implement an Efficient Range Sum Query using arrays.

**Definition:**

</details>

<details>
<summary>Describe a Space-Efficient Data Structure for sparse arrays.</summary>

### Describe a Space-Efficient Data Structure for sparse arrays.

**Definition:**

</details>

### Searching and Sorting Challenges

<details>
<summary>Explain the Quickselect algorithm and its relation to arrays.</summary>

### Explain the Quickselect algorithm and its relation to arrays.

**Definition:**

</details>

<details>
<summary>How can Quicksort be optimized for arrays with many duplicate elements?</summary>

### How can Quicksort be optimized for arrays with many duplicate elements?

**Definition:**

</details>

<details>
<summary>Describe an algorithm to perform Inversion Count in an array.</summary>

### Describe an algorithm to perform Inversion Count in an array.

**Definition:**

</details>

<details>
<summary>Explain the application of Binary Indexed Trees or Fenwick Trees in the context of arrays.</summary>

### Explain the application of Binary Indexed Trees or Fenwick Trees in the context of arrays.

**Definition:**

</details>

<details>
<summary>Design an algorithm for the Skyline Problem using arrays.</summary>

### Design an algorithm for the Skyline Problem using arrays.

**Definition:**

</details>

### Multidimensional Arrays and Matrices

<details>
<summary>How would you implement an efficient matrix transpose operation?</summary>

### How would you implement an efficient matrix transpose operation?

**Definition:**

</details>

<details>
<summary>What are some efficient methods for performing matrix multiplication using arrays?</summary>

### What are some efficient methods for performing matrix multiplication using arrays?

**Definition:**

</details>

<details>
<summary>Solve the Sudoku Solver problem using arrays.</summary>

### Solve the Sudoku Solver problem using arrays.

**Definition:**

</details>

<details>
<summary>Flatten a 2D Matrix into a 1D Array without extra space.</summary>

### Flatten a 2D Matrix into a 1D Array without extra space.

**Definition:**

</details>

<details>
<summary>Implement an algorithm to search in a Row-wise and Column-wise Sorted 2D Array.</summary>

### Implement an algorithm to search in a Row-wise and Column-wise Sorted 2D Array.

**Definition:**

</details>

### Specific Data Structures Using Arrays

<details>
<summary>Explain how a Priority Queue can be implemented using an array.</summary>

### Explain how a Priority Queue can be implemented using an array.

**Definition:**

</details>

<details>
<summary>How can we use arrays to implement a Suffix Array and what is its usefulness?</summary>

### How can we use arrays to implement a Suffix Array and what is its usefulness?

**Definition:**

</details>

<details>
<summary>Design a Double-ended Queue (Deque) using arrays.</summary>

### Design a Double-ended Queue (Deque) using arrays.

**Definition:**

</details>

<details>
<summary>Provide the implementation of a Trie data structure using an array-based representation.</summary>

### Provide the implementation of a Trie data structure using an array-based representation.

**Definition:**

</details>

### Advanced Algorithmic Problems

<details>
<summary>Develop an algorithm to solve the Kadane’s Algorithm (Maximum Subarray Problem).</summary>

### Develop an algorithm to solve the Kadane’s Algorithm (Maximum Subarray Problem).

**Definition:**

</details>

<details>
<summary>Solve the Minimum Jumps to Reach End problem with arrays.</summary>

### Solve the Minimum Jumps to Reach End problem with arrays.

**Definition:**

</details>

<details>
<summary>Design a data structure that supports adding new elements, removing specific elements, and finding random elements efficiently.</summary>

### Design a data structure that supports adding new elements, removing specific elements, and finding random elements efficiently.

**Definition:**

</details>

<details>
<summary>Solve the 0/1 Knapsack Problem using a dynamic programming approach based on arrays.</summary>

### Solve the 0/1 Knapsack Problem using a dynamic programming approach based on arrays.

**Definition:**

</details>

<details>
<summary>Develop an algorithm to find the Median of Two Sorted Arrays of different sizes.</summary>

### Develop an algorithm to find the Median of Two Sorted Arrays of different sizes.

**Definition:**

</details>

### Performance and Memory Considerations

<details>
<summary>Provide strategies for handling Integer Overflow while working with numeric arrays.</summary>

### Provide strategies for handling Integer Overflow while working with numeric arrays.

**Definition:**

</details>

<details>
<summary>What are the implications of Data Caching and Locality of Reference in array operations?</summary>

### What are the implications of Data Caching and Locality of Reference in array operations?

**Definition:**

</details>

<details>
<summary>How to minimize Page Faults while accessing large arrays in memory-constrained environments?</summary>

### How to minimize Page Faults while accessing large arrays in memory-constrained environments?

**Definition:**

</details>
