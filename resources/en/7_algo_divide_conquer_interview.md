# Divide & Conquer — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./7_special_algorithms.md)

### Related docs

- [Divide & Conquer — Interview](./7_algo_divide_conquer_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Divide & Conquer](https://devinterview.io/questions/data-structures-and-algorithms/divide-and-conquer-interview-questions/).

### Basic Concepts of Divide & Conquer Algorithms

<details>
<summary>Define Divide & Conquer algorithms and their main characteristics.</summary>

### Define Divide & Conquer algorithms and their main characteristics.

**Definition:**

Divide and conquer splits a problem into smaller independent subproblems of the same kind, solves them, and combines the results.

**How it works:**

- The split must produce subproblems that do not need each other's intermediate state.
- The base case is a constant-size input solved directly.
- The combine step is where the real work often sits: merging two sorted halves, or adding two partial products.
- The usual cost is a recurrence such as `T(n) = a T(n/b) + f(n)`.

**Examples:**

Binary search looks at the middle, then continues in one half. The other half is discarded, so `a = 1` and `b = 2`.
</details>

<details>
<summary>Explain the difference between Divide & Conquer and Dynamic Programming.</summary>

### Explain the difference between Divide & Conquer and Dynamic Programming.

**Definition:**

Divide and conquer solves each subproblem once as it recurses, and those subproblems are disjoint. Dynamic programming is for overlapping subproblems, and it stores answers so they are not recomputed.

**How it works:**

- Mergesort's halves do not overlap. Fibonacci's naive recursion computes the same `F(k)` many times; the DP table computes it once.
- Divide and conquer is usually top-down. DP is top-down with memoization or bottom-up over a table.
- If you add a cache to a divide-and-conquer recursion and the cache hits, you have reinvented DP.
- DP needs an optimal substructure too: the best answer is built from best answers of smaller states.
</details>

<details>
<summary>What is the role of recursion in Divide & Conquer algorithms?</summary>

### What is the role of recursion in Divide & Conquer algorithms?

**Definition:**

Recursion is the usual way to apply the same algorithm to each smaller piece until the base case.

**How it works:**

- Each call receives a range, often `lo` and `hi`, and calls itself on one or more subranges.
- The call stack holds the unfinished combine steps. Depth is O(log n) when the size shrinks by a constant factor, and O(n) for a badly unbalanced split.
- An explicit stack or a bottom-up loop can replace the calls. Mergesort's bottom-up form merges runs of length 1, then 2, then 4.
- The recursion does not create the speedup by itself. The speedup comes from fewer combinations than a naive scan of all pairs.
</details>

<details>
<summary>What are the three main steps in a typical Divide & Conquer algorithm?</summary>

### What are the three main steps in a typical Divide & Conquer algorithm?

**Definition:**

The three steps are divide, conquer, and combine.

**How it works:**

- Divide splits the input into smaller independent pieces. Equal sizes keep the recurrence balanced.
- Conquer solves each piece. If it is small enough, solve it directly. Otherwise recurse.
- Combine merges the piece results into an answer for the original input.
- Some algorithms have a trivial combine (binary search returns the recursive answer) and some have a trivial divide (quicksort's work is the partition before the recursive calls).

**Examples:**

Mergesort: split the array in half, sort each half, then merge with two pointers.
</details>

### Mathematical Foundations

<details>
<summary>Give an example of a recurrence relation that can describe the time complexity of a Divide & Conquer algorithm.</summary>

### Give an example of a recurrence relation that can describe the time complexity of a Divide & Conquer algorithm.

**Definition:**

A recurrence states the cost of size n in terms of the cost of the smaller calls plus the work outside them.

**How it works:**

- `T(n) = 2 T(n/2) + O(n)` is mergesort: two halves, and a linear merge.
- `T(n) = T(n/2) + O(1)` is binary search: one half, and a constant test.
- `T(n) = 2 T(n/2) + O(n²)` would be a quadratic combine on two halves, which is worse than a straight double loop.
- The base is `T(1) = O(1)`. Floors and ceilings do not change the asymptotic result for these smooth splits.

**Examples:**

Unrolling mergesort: `n + 2·(n/2) + 4·(n/4) + …` is `n` per level for `log₂ n` levels, so `O(n log n)`.
</details>

<details>
<summary>Explain the Master Theorem and its importance in analyzing Divide & Conquer algorithms.</summary>

### Explain the Master Theorem and its importance in analyzing Divide & Conquer algorithms.

**Definition:**

The Master Theorem gives the asymptotic solution of `T(n) = a T(n/b) + O(nᵏ)` by comparing the work at the root with the work in the leaves.

**How it works:**

- Let `c_crit = log_b(a)`. If `k < c_crit`, the leaves dominate and `T(n) = Θ(n^{c_crit})`.
- If `k = c_crit`, every level costs the same and `T(n) = Θ(nᵏ log n)`.
- If `k > c_crit`, the root's combine dominates and `T(n) = Θ(nᵏ)`.
- It does not cover uneven splits, non-polynomial combine costs, or floors that change the shape. Those need a recursion tree or the Akra–Bazzi theorem.

**Examples:**

Mergesort has `a = 2`, `b = 2`, `k = 1`. `log₂ 2 = 1 = k`, so the middle case gives `Θ(n log n)`.
</details>

<details>
<summary>How can the Master Theorem be applied to find the time complexity of a binary search algorithm?</summary>

### How can the Master Theorem be applied to find the time complexity of a binary search algorithm?

**Definition:**

Binary search makes one recursive call on half the array and does a constant amount of work to compare the middle element.

**How it works:**

- So `a = 1`, `b = 2`, and `f(n) = O(1) = O(n⁰)`.
- `log₂ 1 = 0`, which equals the exponent of `f`. The balanced-levels case applies.
- The theorem then says `T(n) = Θ(n⁰ log n) = Θ(log n)`.
- The same bound comes from the depth: each call throws away half the remaining elements, so there are about `log₂ n` calls.
</details>

### Algorithms Design and Implementation

<details>
<summary>Describe how you would use Divide & Conquer to find the maximum and minimum of an array.</summary>

### Describe how you would use Divide & Conquer to find the maximum and minimum of an array.

**Definition:**

Split the array in half, find the min and max of each half, and keep the smaller min and the larger max.

**How it works:**

- A one-element range returns that element as both min and max. A two-element range takes one comparison.
- The combine is two comparisons. The recurrence is `T(n) = 2 T(n/2) + O(1)`, which is `Θ(n)`.
- The comparison count is about `3n/2 − 2` for n a power of two, better than the `2n − 2` of a single left-to-right scan that tracks both.
- The algorithm is still linear. The win is the constant, not the big-O class versus one pass.

**Examples:**

`[4, 1, 7, 3]` splits into `[4, 1]` and `[7, 3]`. Those return `(1, 4)` and `(3, 7)`. The combine returns min 1 and max 7.
</details>

<details>
<summary>Illustrate how the Merge Sort algorithm exemplifies the Divide & Conquer technique.</summary>

### Illustrate how the Merge Sort algorithm exemplifies the Divide & Conquer technique.

**Definition:**

Mergesort sorts each half recursively and merges the two sorted halves with a linear two-pointer scan.

**How it works:**

- Divide is the midpoint. Conquer is the two recursive sorts. Combine is the merge into an auxiliary buffer.
- The merge is stable if equal keys keep the left half's element first.
- Time is `Θ(n log n)` in every case. Extra memory for the buffer is `Θ(n)`.
- The recursion tree has `log n` levels and each level moves `Θ(n)` elements.

**Examples:**

```text
[3, 1, 4, 2]
[3, 1] [4, 2]
[3] [1] [4] [2]
merge -> [1, 3] [2, 4] -> [1, 2, 3, 4]
```
</details>

<details>
<summary>Explain how Quicksort works and how it adopts the Divide & Conquer strategy.</summary>

### Explain how Quicksort works and how it adopts the Divide & Conquer strategy.

**Definition:**

Quicksort partitions the array around a pivot, then sorts the two sides. The combine step does nothing because the partition already put every smaller key on the left.

**How it works:**

- The work is the partition, which is linear in the current range. Recursive calls then sort the left and the right, skipping the pivot.
- Average time on random or well-chosen pivots is `O(n log n)`. A pivot that is always the extreme key is `O(n²)`.
- It is usually in place, with `O(log n)` stack on balanced pivots and `O(n)` stack on degenerate ones. Sorting the smaller side first keeps the stack logarithmic.
- It is not stable in the usual in-place partition.

**Examples:**

`[3, 1, 4, 2]` with pivot 3 becomes `[1, 2, 3, 4]` after partition, and the two sides are already trivial.
</details>

<details>
<summary>How does the Karatsuba algorithm for multiplying large numbers employ Divide & Conquer?</summary>

### How does the Karatsuba algorithm for multiplying large numbers employ Divide & Conquer?

**Definition:**

Karatsuba multiplies two n-digit numbers with three multiplications of n/2-digit numbers instead of the four a schoolbook split would use.

**How it works:**

- Write `x = a · B + b` and `y = c · B + d`, where B is the base at the midpoint.
- The schoolbook product needs `ac`, `ad`, `bc`, and `bd`. Karatsuba also computes `(a + b)(c + d)` and recovers `ad + bc` as that product minus `ac` minus `bd`.
- The recurrence is `T(n) = 3 T(n/2) + O(n)`. Since `log₂ 3 ≈ 1.585`, the time is `O(n^{1.585})`, better than `O(n²)`.
- Below a small digit cutoff the implementation switches to schoolbook multiplication, because the extra additions dominate.
</details>

<details>
<summary>Describe the Strassen’s algorithm for matrix multiplication using Divide & Conquer.</summary>

### Describe the Strassen’s algorithm for matrix multiplication using Divide & Conquer.

**Definition:**

Strassen multiplies two n×n matrices with seven recursive multiplications of n/2 blocks instead of the eight in the block schoolbook method.

**How it works:**

- Each matrix is split into four n/2 blocks. Seven products of sums and differences of those blocks are enough to assemble the four blocks of the product.
- The recurrence is `T(n) = 7 T(n/2) + O(n²)`. `log₂ 7 ≈ 2.807`, so the time is `O(n^{2.807})`, below the classical `O(n³)`.
- The extra additions and the awkward block layout make it slower than a tuned classical kernel until n is large.
- Later algorithms have a lower exponent. Libraries still prefer blocked classical multiplication for the sizes they actually ship.
</details>

### Problem Solving with Divide & Conquer

<details>
<summary>How would you use a Divide & Conquer approach to calculate the power of a number?</summary>

### How would you use a Divide & Conquer approach to calculate the power of a number?

**Definition:**

Exponentiation by squaring halves the exponent each call, so a power takes a logarithmic number of multiplications.

**How it works:**

- `xⁿ = (x²)^{n/2}` when n is even. When n is odd, `xⁿ = x · xⁿ⁻¹`, and n−1 is even.
- The recurrence is `T(n) = T(n/2) + O(1)` multiplications, so `O(log n)` multiplications instead of `O(n)`.
- The same idea with modular multiplies computes `xⁿ mod m` without building the huge integer.
- Iterative binary exponentiation scans the bits of n and squares an accumulator, which is the same algorithm without recursion.

**Examples:**

`3⁸`: square to `9`, square to `81`, square to `6561`. Three squarings, not eight multiplications by 3.
</details>

<details>
<summary>Solve the Tower of Hanoi problem using Divide & Conquer techniques.</summary>

### Solve the Tower of Hanoi problem using Divide & Conquer techniques.

**Definition:**

To move n disks from peg A to peg C using spare peg B, move n−1 to the spare, move the largest disk to the target, then move n−1 from the spare onto the target.

**How it works:**

- The largest disk can move only when the n−1 above it are off it, and it can land only on an empty peg or a larger disk. The recursive moves keep that invariant.
- `T(n) = 2 T(n−1) + O(1)` with `T(1) = 1`, so the move count is `2ⁿ − 1`.
- This split is into two problems of size n−1, not n/2. The Master Theorem's `n/b` form does not apply; the closed form comes from unrolling.
- It is optimal for the classic rules: each disk configuration graph requires at least that many moves.

**Examples:**

Three disks A→C: move 2 from A to B (using C), move disk 3 A→C, move 2 from B to C (using A). The 'move 2' steps themselves split into single-disk moves.
</details>

<details>
<summary>Solve the Closest Pair of Points problem using Divide & Conquer.</summary>

### Solve the Closest Pair of Points problem using Divide & Conquer.

**Definition:**

Sort points by x, split them by a vertical line, solve each half, then check only the strip near the line where a closer pair could still hide.

**How it works:**

- The recursive answers give a distance δ, the best pair entirely on the left or entirely on the right.
- A closer pair must have one point in each half and both inside the vertical strip of width 2δ around the split.
- Points in that strip, sorted by y, need only a constant number of neighbors ahead in that order. Each point compares with the next few, not with the whole strip.
- The recurrence is `T(n) = 2 T(n/2) + O(n)` after the initial sort, so the search is `O(n log n)`.

**Examples:**

Left half's closest distance is 5, right half's is 4, so δ = 4. Only points within 4 of the midline are compared across the cut, and the true closest pair might be one of those cross pairs at distance 3.
</details>

<details>
<summary>Use Divide & Conquer to solve the Majority Element problem in an array.</summary>

### Use Divide & Conquer to solve the Majority Element problem in an array.

**Definition:**

</details>

<details>
<summary>Implement an algorithm to efficiently find the Median of Two Sorted Arrays.</summary>

### Implement an algorithm to efficiently find the Median of Two Sorted Arrays.

**Definition:**

</details>

### Advanced Divide & Conquer Applications

<details>
<summary>Explain the key differences when Divide & Conquer is applied to External Sorting vs In-memory Sorting.</summary>

### Explain the key differences when Divide & Conquer is applied to External Sorting vs In-memory Sorting.

**Definition:**

</details>

<details>
<summary>How is Divide & Conquer utilized in the Cooley-Tukey FFT algorithm?</summary>

### How is Divide & Conquer utilized in the Cooley-Tukey FFT algorithm?

**Definition:**

</details>

<details>
<summary>Solve the Skyline Problem using Divide & Conquer.</summary>

### Solve the Skyline Problem using Divide & Conquer.

**Definition:**

</details>

### Optimization and Improvement

<details>
<summary>What strategies can be employed to reduce the overhead in recursive calls of Divide & Conquer algorithms?</summary>

### What strategies can be employed to reduce the overhead in recursive calls of Divide & Conquer algorithms?

**Definition:**

</details>

<details>
<summary>Discuss how tail recursion optimization could be beneficial for Divide & Conquer algorithms.</summary>

### Discuss how tail recursion optimization could be beneficial for Divide & Conquer algorithms.

**Definition:**

</details>

<details>
<summary>Explain how memoization or caching can affect the performance of Divide & Conquer algorithms.</summary>

### Explain how memoization or caching can affect the performance of Divide & Conquer algorithms.

**Definition:**

</details>

### Complexity Analysis

<details>
<summary>Compare the worst-case time complexities of Merge Sort, Quicksort, and Heapsort.</summary>

### Compare the worst-case time complexities of Merge Sort, Quicksort, and Heapsort.

**Definition:**

</details>

<details>
<summary>How do you determine the space complexity of a Divide & Conquer algorithm?</summary>

### How do you determine the space complexity of a Divide & Conquer algorithm?

**Definition:**

</details>

<details>
<summary>Why do some Divide & Conquer algorithms have a high space complexity, and how can this be mitigated?</summary>

### Why do some Divide & Conquer algorithms have a high space complexity, and how can this be mitigated?

**Definition:**

</details>

### Parallelization and Distributed Computing

<details>
<summary>Discuss how Divide & Conquer algorithms can be parallelized.</summary>

### Discuss how Divide & Conquer algorithms can be parallelized.

**Definition:**

</details>

<details>
<summary>Provide an example of a Divide & Conquer algorithm that could benefit from a distributed computing environment.</summary>

### Provide an example of a Divide & Conquer algorithm that could benefit from a distributed computing environment.

**Definition:**

</details>

### Miscellaneous

<details>
<summary>How does the use of randomization in Quicksort improve its performance on average?</summary>

### How does the use of randomization in Quicksort improve its performance on average?

**Definition:**

</details>

<details>
<summary>Describe an instance where a Divide & Conquer algorithm is not the best choice.</summary>

### Describe an instance where a Divide & Conquer algorithm is not the best choice.

**Definition:**

</details>

<details>
<summary>Discuss the application of Divide & Conquer in non-computer-science fields.</summary>

### Discuss the application of Divide & Conquer in non-computer-science fields.

**Definition:**

</details>

### Practical Applications and Coding Challenges

<details>
<summary>Develop a Divide & Conquer algorithm to count inversions in an array.</summary>

### Develop a Divide & Conquer algorithm to count inversions in an array.

**Definition:**

</details>

<details>
<summary>Write an efficient algorithm for the Convex Hull problem using Divide & Conquer.</summary>

### Write an efficient algorithm for the Convex Hull problem using Divide & Conquer.

**Definition:**

</details>

<details>
<summary>Provide an example of a real-world application where Divide & Conquer algorithms significantly improve performance.</summary>

### Provide an example of a real-world application where Divide & Conquer algorithms significantly improve performance.

**Definition:**

</details>

<details>
<summary>Implement a Divide & Conquer algorithm to solve the Maximum Subarray Problem.</summary>

### Implement a Divide & Conquer algorithm to solve the Maximum Subarray Problem.

**Definition:**

</details>

### Coding Challenges on Divide & Conquer Algorithms

<details>
<summary>Implement an algorithm to find the Median of Two Sorted Arrays using Divide & Conquer.</summary>

### Implement an algorithm to find the Median of Two Sorted Arrays using Divide & Conquer.

**Definition:**

</details>

<details>
<summary>Code a Divide & Conquer solution to Merge k Sorted Lists into one sorted list.</summary>

### Code a Divide & Conquer solution to Merge k Sorted Lists into one sorted list.

**Definition:**

</details>

<details>
<summary>Develop a Divide & Conquer algorithm to solve the Maximum Subarray Problem and find the contiguous subarray with the maximum sum.</summary>

### Develop a Divide & Conquer algorithm to solve the Maximum Subarray Problem and find the contiguous subarray with the maximum sum.

**Definition:**

</details>

<details>
<summary>Construct a Binary Tree from given Preorder and Inorder traversal arrays using Divide & Conquer.</summary>

### Construct a Binary Tree from given Preorder and Inorder traversal arrays using Divide & Conquer.

**Definition:**

</details>

<details>
<summary>Construct a Binary Tree from given Inorder and Postorder traversal arrays employing a Divide & Conquer approach.</summary>

### Construct a Binary Tree from given Inorder and Postorder traversal arrays employing a Divide & Conquer approach.

**Definition:**

</details>

<details>
<summary>Convert a Sorted Array into a height-balanced Binary Search Tree using Divide & Conquer.</summary>

### Convert a Sorted Array into a height-balanced Binary Search Tree using Divide & Conquer.

**Definition:**

</details>

<details>
<summary>Convert a Sorted Linked List into a height-balanced Binary Search Tree with a Divide & Conquer method.</summary>

### Convert a Sorted Linked List into a height-balanced Binary Search Tree with a Divide & Conquer method.

**Definition:**

</details>

<details>
<summary>Create a Divide & Conquer algorithm to Sort a linked list.</summary>

### Create a Divide & Conquer algorithm to Sort a linked list.

**Definition:**

</details>

<details>
<summary>Implement an efficient algorithm to Search a 2D Matrix II with a Divide & Conquer approach.</summary>

### Implement an efficient algorithm to Search a 2D Matrix II with a Divide & Conquer approach.

**Definition:**

</details>

<details>
<summary>Code a Divide & Conquer solution for Count of Smaller Numbers After Self in an array.</summary>

### Code a Divide & Conquer solution for Count of Smaller Numbers After Self in an array.

**Definition:**

</details>

<details>
<summary>Use Divide & Conquer to calculate the Count of Range Sum in an array for given lower and upper bounds.</summary>

### Use Divide & Conquer to calculate the Count of Range Sum in an array for given lower and upper bounds.

**Definition:**

</details>

<details>
<summary>Find the Top K Frequent Elements in an array using a Divide & Conquer strategy.</summary>

### Find the Top K Frequent Elements in an array using a Divide & Conquer strategy.

**Definition:**

</details>

<details>
<summary>Determine the Kth Largest Element in an unsorted array with a Divide & Conquer technique.</summary>

### Determine the Kth Largest Element in an unsorted array with a Divide & Conquer technique.

**Definition:**

</details>

<details>
<summary>Implement a Divide & Conquer algorithm to compute the Number of Ships in a Rectangle on a 2D plane, given top-right and bottom-left coordinates of rectangles.</summary>

### Implement a Divide & Conquer algorithm to compute the Number of Ships in a Rectangle on a 2D plane, given top-right and bottom-left coordinates of rectangles.

**Definition:**

</details>

<details>
<summary>Balance a given Binary Search Tree into a balanced BST using Divide & Conquer.</summary>

### Balance a given Binary Search Tree into a balanced BST using Divide & Conquer.

**Definition:**

</details>

<details>
<summary>Create a Sorted Array through a series of Instructions using a Divide & Conquer and Binary Indexed Tree.</summary>

### Create a Sorted Array through a series of Instructions using a Divide & Conquer and Binary Indexed Tree.

**Definition:**

</details>

<details>
<summary>Use a Divide & Conquer approach to Sort an Array.</summary>

### Use a Divide & Conquer approach to Sort an Array.

**Definition:**

</details>

<details>
<summary>Design and implement a Divide & Conquer solution to generate a Beautiful Array.</summary>

### Design and implement a Divide & Conquer solution to generate a Beautiful Array.

**Definition:**

</details>

<details>
<summary>Solve the Longest Increasing Subsequence II problem where updates and queries happen in real-time, using a Divide & Conquer strategy combined with advanced data structures.</summary>

### Solve the Longest Increasing Subsequence II problem where updates and queries happen in real-time, using a Divide & Conquer strategy combined with advanced data structures.

**Definition:**

</details>
