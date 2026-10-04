# Big-O Notation — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./7_special_algorithms.md)

### Related docs

- [Big-O Notation — Interview](./7_algo_big_o_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Big-O Notation](https://devinterview.io/questions/data-structures-and-algorithms/big-o-notation-interview-questions/).

### Fundamental Concepts of Big-O Notation

<details>
<summary>What is Big-O Notation?</summary>

### What is Big-O Notation?

**Definition:**

Big-O is an asymptotic upper bound on how a cost, usually time or memory, grows with the input size. It is the tool for comparing algorithms once `n` is large.

**How it works:**

- Drop constants and smaller terms and keep the dominant term. `3n² + 10n` is O(n²).
- The bound is about the trend as `n` grows, not the exact operation count on one machine.
- As used for algorithms, Big-O is a ceiling. Saying an algorithm is O(n²) promises it will not grow faster than some constant times n² past some n₀.
- Common classes, from slow growth to fast: O(1) index access or a fixed buffer; O(log n) binary search; O(n) a scan or an array proportional to the input; O(n log n) merge sort; O(n²) a simple nested loop such as bubble sort or an n by n matrix; O(2ⁿ) listing every subset.
- The same algorithm has a best, average, and worst input. Linear search is O(1) if the target is first, and O(n) if it is last or missing. The average, when every slot is equally likely, is still Θ(n).
- The bound is how you budget memory, set a latency ceiling, and see which loop is the bottleneck.

**Examples:**

A scan of 1,000 items and a scan of 1,000,000 items differ by about 1,000× if the scan is linear. Binary search on the same growth is a handful of extra comparisons.
</details>

<details>
<summary>Explain the difference between Big-O, Big-Theta, and Big-Omega notations.</summary>

### Explain the difference between Big-O, Big-Theta, and Big-Omega notations.

**Definition:**

Big-O, Big-Theta, and Big-Omega are three ways to sandwich a cost function. They are not three names for the worst case.

**How it works:**

- O(g) is an upper bound: past some n₀, `f(n)` is at most `k · g(n)`. An algorithm that is O(n²) never grows faster than quadratic, up to a constant. It might still be linear.
- Ω(g) is a lower bound: `f(n)` is at least `k · g(n)`. It says the cost cannot grow slower than g. It is not automatically the best-case input.
- Θ(g) is both: `k1 · g(n) ≤ f(n) ≤ k2 · g(n)`. Merge sort’s comparisons are Θ(n log n) on every input, so the bound is tight.
- A single algorithm can wear different symbols on different inputs. Adaptive insertion sort is O(n²) always, Ω(n) on sorted input, and Θ(n + k) when you count inversions.
- Use Θ when you have matched the growth. Use O and Ω when only one side is known, which is common for adaptive sorts and for best versus worst inputs.

**Examples:**

Binary search comparisons are Θ(log n) in the worst case: you can force about log₂ n probes, and you never need more. Saying only O(n) would be true and much too loose.
</details>

<details>
<summary>Describe the role of constants and lower-order terms in Big-O analysis.</summary>

### Describe the role of constants and lower-order terms in Big-O analysis.

**Definition:**

Constants and lower-order terms describe the exact leading polynomial, then disappear from the Big-O class because they do not change the order of growth.

**How it works:**

- A constant multiplier is a fixed number of operations per step. `7n²` and `n²` are both O(n²). For large n the `7` changes the slope, not the class.
- A lower-order term grows strictly slower. In `3n³ + 100n² + 25n` the n³ term overtakes the rest, so the class is O(n³).
- “Small-o” is the stricter cousin: a term is o(g) when it becomes negligible next to g. The n² term is o(n³). Big-O only says “no faster than”.
- Dropping them is why two implementations in the same class can still feel different at the n you actually run. The asymptotic class is the comparison after that difference stops mattering.

**Examples:**

`7n²` versus `n³`. At n = 10 the first can be cheaper. Past a modest n the cubic wins the race no matter what the leading 7 was.
</details>

<details>
<summary>Give examples of how amortized analysis can provide a more balanced complexity measure.</summary>

### Give examples of how amortized analysis can provide a more balanced complexity measure.

**Definition:**

Amortized analysis averages the cost of a sequence of operations. One of them may be expensive, but that expense is rare enough that the average per operation stays small.

**How it works:**

- A dynamic array doubles when it fills. The doubling copies n items and is O(n). Inserts between doublings are O(1). Over n inserts the copies sum to under 2n, so the average insert is O(1).
- That is not a worst-case promise for a single insert. The next insert can still be the one that copies.
- Hash-table growth is the same story: a rehash is linear, and it is charged across the inserts that filled the old table.
- Binary search is a poor illustration of amortization. Every search is already O(log n) in the worst case; there is no rare expensive search hiding inside a cheaper average.
- Cached Fibonacci is memoization, not amortization. The first computation of each index is paid once, which turns an exponential recurrence into Θ(n). Repeated queries are then O(1) lookups. The accounting is “each state once”, which is related in spirit and is a different theorem.

**Examples:**

```text
insert into a doubling array:
  if full: allocate 2× and copy  # O(n), happens at sizes 1, 2, 4, ...
  write one slot                 # O(1)
```

n inserts copy `1+2+4+…+n` items, which is under `2n`.
</details>

<details>
<summary>Describe how the coefficients of higher-order terms affect Big-O Notation in practical scenarios.</summary>

### Describe how the coefficients of higher-order terms affect Big-O Notation in practical scenarios.

**Definition:**

The leading coefficient changes the slope inside a Big-O class. It does not change the class, and it matters less as soon as a higher-order term is in the race.

**How it works:**

- Same class, small n: `3n + 500` can lose to `6n + 10` because the added 500 dominates while n is tiny. Big-O calls both O(n).
- Same class, large n: `0.05n` still does about half the work of `0.1n`. The ratio of the coefficients remains visible; it just does not grow with n.
- Quadratic with a tiny coefficient: `0.00001 n²` and `0.0001 n²` are both O(n²). For large n the n² term swamps the added constants, and the larger coefficient is slower by about that constant factor.
- A larger coefficient on the same power (`10n²` versus `2n²`) changes the constant factor for every n. It never turns the algorithm into a different asymptotic class.
- This is why a linear scan written as `4n + 2` is still called O(n), and why `4n` versus `0.5n` is still an 8× gap you can measure on a large array.

**Examples:**

At n = 20, `3n + 500` is 560 and `6n + 10` is 130, so the “smaller” coefficient is slower. At n = 10,000 the first is about half the second.
</details>

<details>
<summary>Explain how probabilistic algorithms can have a different Big-O Notation compared to deterministic ones.</summary>

### Explain how probabilistic algorithms can have a different Big-O Notation compared to deterministic ones.

**Definition:**

A deterministic bound covers every input. A probabilistic bound is allowed to fail with a small probability, or to quote an expected cost over its random choices, so the expression can be tighter.

**How it works:**

- Randomized quicksort’s expected comparisons are Θ(n log n) for every input. A deterministic “first element” pivot is Θ(n²) on a sorted array. The random version does not change the worst-case ceiling; it moves that ceiling onto an unlikely set of pivot sequences.
- Monte Carlo algorithms may return a wrong answer with probability you can drive down by repeating. The time stays the cost of one trial times the number of trials, instead of the cost of a proof that works on every input.
- Las Vegas algorithms always return the correct answer, and the random variable is the running time. The figure people quote is the expectation.
- Graph reachability has a deterministic DFS or BFS at Θ(V + E). A random walk can be analyzed as an expectation that finishes early on some graphs and has a heavy tail on others. The expectation is not a substitute for the worst-case Θ(V + E) unless you also bound that tail.
- Read the quantifier. “Expected O(n log n)” and “O(n log n) with high probability” are different claims from “O(n log n) on every input”.

**Examples:**

Shuffle the array, then quicksort with a fixed pivot. The expectation over shuffles is Θ(n log n). One unlucky shuffle can still produce the quadratic pivot pattern.
</details>

### Big-O in Common Data Structures and Algorithms

<details>
<summary>Analyze the Big-O time complexity of array operations.</summary>

### Analyze the Big-O time complexity of array operations.

**Definition:**

A contiguous array gives O(1) indexing because the address is `base + i * width`. Almost everything that shifts elements is linear.

**How it works:**

- Read or write by index: Θ(1).
- Search an unsorted array: Θ(n) worst case. A sorted array can use binary search, Θ(log n).
- Insert or delete at an arbitrary index: Θ(n), because later elements move. Append at the end of a dynamic array is amortized Θ(1) and occasionally Θ(n) on growth.
- Sorting the array is a separate algorithm: mergesort Θ(n log n) always, quicksort Θ(n log n) average and Θ(n²) worst.
- Swapping two adjacent slots is Θ(1). That is not the cost of transposing an n by n matrix, which touches Θ(n²) entries.
- Merging two sorted arrays into one sorted array is Θ(n + m) with two pointers.

**Examples:**

`a[i] = 7` is a constant-time write. Inserting at index 0 of a length-n array copies every later element one slot right.
</details>

<details>
<summary>Discuss the Big-O space complexity of using linked lists.</summary>

### Discuss the Big-O space complexity of using linked lists.

**Definition:**

A linked list of n nodes is Θ(n) memory. The constant per node is the payload plus one or two pointers, and that constant is what the variants change.

**How it works:**

- A singly linked node stores the value and one `next` pointer. The pointer is a word, often 8 bytes on a 64-bit machine, and there are n of them, so the extra pointer storage is Θ(n), not Θ(1).
- A doubly linked node stores `next` and `prev`. Still Θ(n) nodes, with about twice the pointer bytes.
- A circular list points the tail back at the head. That one extra link does not change the class.
- An XOR-linked list packs `prev` and `next` into one word with XOR. It is still Θ(n) nodes, with a smaller constant, and the code has to recover the other pointer from the address you came from.
- Adding an auxiliary pointer per node, such as a jump pointer, raises the bytes per node and stays Θ(n) unless the number of extra pointers itself grows with n.

**Examples:**

A million 8-byte integers in a singly linked list also store about a million 8-byte pointers. The same integers in an array store no per-element pointer.
</details>

<details>
<summary>Compare the Big-O complexities of various sorting algorithms.</summary>

### Compare the Big-O complexities of various sorting algorithms.

**Definition:**

Comparison sorts sit at Ω(n log n) in the worst case. Quadratic sorts are simpler. Non-comparison sorts can be linear when the key format allows it.

**How it works:**

- Bubble sort: Θ(n) best case with an early-exit flag, Θ(n²) worst and average.
- Selection sort: Θ(n²) on every input, because every suffix is scanned.
- Insertion sort: Θ(n) when the array is sorted, Θ(n²) when it is reversed.
- Merge sort: Θ(n log n) time in every case, Θ(n) extra memory.
- Quicksort: Θ(n log n) average and best when pivots split evenly, Θ(n²) when a pivot is always extreme.
- Heapsort: Θ(n log n) best and worst. Building the heap is Θ(n), and each of n extractions is O(log n).
- Counting sort: Θ(n + k) time and extra memory for integers in a range of size k.
- Radix sort: Θ(d (n + k)) for d digits and digit alphabet k. The bound tracks the digits, not a comparison tree.
- Bucket sort: Θ(n + k) expected on uniform keys spread over k buckets, and Θ(n²) if every key lands in one bucket and that bucket is sorted quadratically.
- Shell sort: the bound depends on the gap sequence. Common sequences are around O(n log² n) or worse; there is no single worst-case number independent of the gaps.

**Examples:**

One million random integers: prefer quicksort, mergesort, or heapsort. One million integers in `0..1000`: counting sort is the linear option.
</details>

<details>
<summary>Evaluate the Big-O time complexity of binary search.</summary>

### Evaluate the Big-O time complexity of binary search.

**Definition:**

Binary search finds a key in a sorted random-access array by repeatedly discarding half of the remaining range. The worst-case number of probes is Θ(log n).

**How it works:**

- Each step does a constant amount of work and replaces n with about n/2. The recurrence `T(n) = T(n/2) + Θ(1)` solves to Θ(log n).
- After k halvings, `n / 2^k` is 1, so `k = log₂ n`. That is both the upper and the lower bound for the unsuccessful search.
- It beats a linear scan, which is Θ(n), once the array is long enough that the sort-or-already-sorted precondition has been paid.
- The iterative form uses Θ(1) extra memory. The recursive form uses Θ(log n) stack frames. Tail-call elimination can collapse that stack, and not every compiler does it.
- The array must already be sorted, and the middle element must be reachable in O(1). A linked list has the same halving logic and loses it, because reaching the middle is already Θ(n).

**Examples:**

```text
lo, hi = 0, n - 1
while lo <= hi:
  mid = lo + (hi - lo) // 2
  if a[mid] == target: return mid
  if a[mid] < target: lo = mid + 1
  else: hi = mid - 1
```

On 1,000,000 sorted keys the loop body runs at most about 20 times.
</details>

<details>
<summary>Determine the Big-O time and space complexities of hash table operations.</summary>

### Determine the Big-O time and space complexities of hash table operations.

**Definition:**

A hash table maps a key through a hash function to a slot. With a good hash and a bounded load factor, insert, lookup, and delete are expected O(1). The worst case is linear.

**How it works:**

- Lookup hashes the key and inspects that slot, or the chain or probe sequence that starts there. Expected time is O(1) when chains stay short.
- Insert and delete are the same expected O(1), plus the occasional resize.
- Resize allocates a larger table and reinserts every key. One resize is Θ(n). Across a growing table it is amortized O(1) per insert, by the same charging argument as a doubling array.
- If every key collides into one chain, lookup, insert, and delete are Θ(n).
- Space is Θ(n) for n stored keys, plus empty slots that keep the load factor down. Those empty slots change the constant, not the fact that memory tracks the number of keys.

**Examples:**

A table of 1,000 keys at load factor 0.5 has about 2,000 slots. A hit computes one hash and follows a short chain. A resize to 4,000 slots rewrites all 1,000 keys once.
</details>

<details>
<summary>Discuss the Big-O complexities of tree operations, including binary search trees and AVL trees.</summary>

### Discuss the Big-O complexities of tree operations, including binary search trees and AVL trees.

**Definition:**

A binary search tree is O(h) for search, insert, and delete, where h is the height. An AVL tree keeps h at Θ(log n), so those operations stay Θ(log n) in the worst case.

**How it works:**

- In a BST each comparison drops into the left or right child. A balanced tree discards about half the nodes, which is Θ(log n). A stick of n nodes is a linked list, and the same operations are Θ(n).
- The best search is Θ(1) only when the root is the target. That is not the bound you design for.
- Insert walks the same path and links a new leaf. In an AVL tree the walk back up may rotate.
- A single rotation fixes a node that became left-heavy or right-heavy in a straight line. A double rotation (left-right or right-left) fixes a zigzag. Each rotation rewires a constant number of pointers, so it is O(1) on top of the O(log n) walk.
- AVL search, insert, and delete are therefore Θ(log n) worst case. The tree stores a balance factor or a height in each node, which is Θ(n) extra fields on top of the keys.

**Examples:**

Inserting sorted keys `1, 2, 3, 4` into a plain BST builds a right spine. The same inserts into an AVL tree rotate and stay a short tree of height 2.
</details>

<details>
<summary>Analyze the Big-O complexity of graph algorithms, including traversal and shortest path algorithms.</summary>

### Analyze the Big-O complexity of graph algorithms, including traversal and shortest path algorithms.

**Definition:**

Graph bounds are written in vertices V and edges E. A traversal looks at each vertex and edge a constant number of times. Shortest paths pay extra for the priority queue or for another nested loop.

**How it works:**

- DFS and BFS are Θ(V + E) time with an adjacency list. DFS uses Θ(V) stack space in the worst case. BFS uses Θ(V) queue space, and a wide level can fill that queue.
- Dijkstra with a binary heap is Θ((V + E) log V) on nonnegative weights, and Θ(V) extra memory for distances and the queue. A Fibonacci heap improves the textbook bound; the binary heap is the usual implementation.
- Bellman-Ford relaxes every edge once per vertex, Θ(V E) time and Θ(V) space. A final pass detects a negative cycle. It is the algorithm you use when weights may be negative.
- Floyd-Warshall is the all-pairs DP: Θ(V³) time and Θ(V²) memory for the distance matrix.
- A* with a consistent heuristic is guided Dijkstra. A bad heuristic can expand far more than the shortest-path frontier; there is no general O(log V) bound.
- Johnson’s algorithm reweights with one Bellman-Ford, then runs Dijkstra from each vertex. The usual bound is Θ(V E + V² log V) with a binary heap, which is attractive on sparse graphs.

**Examples:**

A road graph with 1,000,000 vertices and a few edges each is sparse: Dijkstra or A* from one source. A 400-vertex distance matrix is small enough that Floyd-Warshall’s V³ is acceptable.
</details>

<details>
<summary>Discuss time and space complexities of various heap operations.</summary>

### Discuss time and space complexities of various heap operations.

**Definition:**

A binary heap is a complete binary tree stored in an array. The shape makes parent and child indexes O(1), and the heap property makes the extreme element O(1) to read and O(log n) to remove.

**How it works:**

- Parent of index `i` is `⌊(i−1)/2⌋`. Children are `2i+1` and `2i+2`, for a 0-based array.
- Insert places the key at the end and sifts it up. That is O(log n) swaps and O(1) extra memory.
- Delete-min (or delete-max) moves the last key into the root and sifts it down. Time O(log n), extra memory O(1).
- Reading the minimum or maximum is O(1): it sits at index 0. No extra memory.
- Building a heap from n unsorted keys is Θ(n), which is tighter than n separate inserts. Heapsort then does n extract operations and is Θ(n log n).
- The array itself is Θ(n). The sift is usually written as a loop, so the extra stack is O(1), not O(log n), unless you recurse.

**Examples:**

```text
sift_up(i):
  while i > 0 and a[i] < a[parent(i)]:
    swap a[i] with a[parent(i)]
    i = parent(i)
```

A heap of a million keys sifts at most about 20 levels.
</details>

### Practical Application and Analysis

<details>
<summary>Provide examples of space-time tradeoffs in algorithm design.</summary>

### Provide examples of space-time tradeoffs in algorithm design.

**Definition:**

A space-time tradeoff spends memory to avoid repeating work, or spends time to avoid storing an intermediate result. You rarely get both for free.

**How it works:**

- An index maps a word to the documents that contain it. Queries become a lookup instead of a scan. The index is extra memory, on disk or in RAM.
- A database that keeps that index on disk pays storage so it does not rebuild the index for every query.
- Compression spends CPU to shrink bytes. A fast, weak compressor saves time and leaves a larger file. Huffman coding spends a pass over frequencies and a tree so the frequent symbols use fewer bits.
- Memoization is the algorithm form of the same deal: a Fibonacci cache is Θ(n) memory and turns an exponential recursion into linear time.
- The inverse also shows up: recomputing a small value instead of storing a table keeps the working set in cache, and that can be faster even though the operation count goes up.

**Examples:**

Uncompressed text stores the character. A Huffman code stores a short bit string for `e` and a longer one for `q`, plus the tree you need in order to decode.
</details>

<details>
<summary>Compare the complexities of recursive and iterative solutions to the same problem.</summary>

### Compare the complexities of recursive and iterative solutions to the same problem.

**Definition:**

</details>

<details>
<summary>Discuss Big-O implications when scaling applications horizontally versus vertically.</summary>

### Discuss Big-O implications when scaling applications horizontally versus vertically.

**Definition:**

</details>

<details>
<summary>Analyze the Big-O of database indexing and query retrieval.</summary>

### Analyze the Big-O of database indexing and query retrieval.

**Definition:**

</details>

<details>
<summary>Evaluate how caching layers influence the Big-O performance of a system.</summary>

### Evaluate how caching layers influence the Big-O performance of a system.

**Definition:**

</details>

### Coding Challenges

<details>
<summary>Calculate the Big-O Notation for a given recursive algorithm.</summary>

### Calculate the Big-O Notation for a given recursive algorithm.

**Definition:**

</details>

<details>
<summary>Implement a binary search algorithm and analyze its time complexity.</summary>

### Implement a binary search algorithm and analyze its time complexity.

**Definition:**

</details>

<details>
<summary>Optimize a nested loop algorithm to achieve a better Big-O time complexity.</summary>

### Optimize a nested loop algorithm to achieve a better Big-O time complexity.

**Definition:**

</details>

<details>
<summary>Create a divide and conquer algorithm and explain its complexity.</summary>

### Create a divide and conquer algorithm and explain its complexity.

**Definition:**

</details>

<details>
<summary>Implement a dynamic programming solution and discuss its Big-O time complexity.</summary>

### Implement a dynamic programming solution and discuss its Big-O time complexity.

**Definition:**

</details>

<details>
<summary>Refactor a recursive algorithm to use memoization and analyze the complexity change.</summary>

### Refactor a recursive algorithm to use memoization and analyze the complexity change.

**Definition:**

</details>

<details>
<summary>Develop efficient multi-threaded algorithms and evaluate their Big-O complexity.</summary>

### Develop efficient multi-threaded algorithms and evaluate their Big-O complexity.

**Definition:**

</details>

### Big-O Notation in Advanced Topics

<details>
<summary>How does data structure choice affect the Big-O complexity of an algorithm?</summary>

### How does data structure choice affect the Big-O complexity of an algorithm?

**Definition:**

</details>

<details>
<summary>Analyze the Big-O complexity of algorithms in a distributed system.</summary>

### Analyze the Big-O complexity of algorithms in a distributed system.

**Definition:**

</details>

<details>
<summary>Explore the Big-O complexity in the context of concurrent and parallel computing.</summary>

### Explore the Big-O complexity in the context of concurrent and parallel computing.

**Definition:**

</details>

<details>
<summary>Discuss the relevance of Big-O Notation in machine learning algorithms.</summary>

### Discuss the relevance of Big-O Notation in machine learning algorithms.

**Definition:**

</details>
