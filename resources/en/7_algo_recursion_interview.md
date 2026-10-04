# Recursion — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./7_special_algorithms.md)

### Related docs

- [Recursion — Interview](./7_algo_recursion_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Recursion](https://devinterview.io/questions/data-structures-and-algorithms/recursion-algorithm-interview-questions/).

### Understanding Recursion

<details>
<summary>How Dynamic Programming is different from Recursion and Memoization?</summary>

### How Dynamic Programming is different from Recursion and Memoization?

**Definition:**

Recursion is a call that solves a smaller copy of the same problem. Memoization is recursion plus a cache. Dynamic programming is the decision to define states and transitions so each state is solved once; the bottom-up table is DP without the recursive calls.

**How it works:**

- Plain recursion can recompute the same arguments on every branch, which is why naive Fibonacci is exponential.
- Memoization keeps the top-down shape and stores a result the first time those arguments appear. Later calls are lookups. It only fills states the original call reaches.
- Bottom-up DP fills every state the dependency order requires, usually with loops, and does not keep a call stack.
- All three can express the same recurrence. What changes is whether repeated work is stored, and whether you start from the answer or from the base cases.
- The cache and the table both cost memory proportional to the number of states you keep. The recursive forms also cost stack depth.

**Examples:**

`fib(n)` that calls itself twice is recursion. The same function that returns a stored `fib(n)` is memoization. A loop that writes `t[i] = t[i-1] + t[i-2]` is bottom-up DP.
</details>

<details>
<summary>What are some Common Examples of Recursion in computer science?</summary>

### What are some Common Examples of Recursion in computer science?

**Definition:**

Recursion fits when a value is defined by the same kind of value on a smaller input: a tree, a range, a string, or a pile of disks.

**How it works:**

- Tree walks: in-order visits the left subtree, the node, then the right subtree. Each call is the same procedure on a child.
- A palindrome check compares the ends and recurses on the slice between them.
- Factorial is `n * fact(n-1)` with `fact(0) = 1`.
- A directory listing calls itself on each subdirectory.
- Towers of Hanoi moves `n-1` disks out of the way, moves the largest disk, then moves the `n-1` back on top.
- Merge sort sorts the two halves, then merges. That is divide and conquer, which is recursion plus a combine step.
- Catalan numbers count binary trees, balanced parentheses, and polygon triangulations with a recurrence that sums products of smaller Catalan numbers.

**Examples:**

`fact(4)` is `4 * fact(3)`, which unwinds to `4*3*2*1`. The directory walk is the same shape with a list of children instead of `n-1`.
</details>

<details>
<summary>What is the difference between Backtracking and Recursion?</summary>

### What is the difference between Backtracking and Recursion?

**Definition:**

Backtracking is a way of searching a space of choices. It is usually written with recursion, but recursion by itself does not undo a choice.

**How it works:**

- Recursion splits a problem into smaller copies and combines their results. Merge sort, tree walks, and factorial never say “that choice was wrong, restore the previous state”.
- Backtracking builds a candidate one step at a time. When the partial candidate cannot be extended to a solution, it undoes the last step and tries a different one.
- The undo is the name: pop the queen, clear the cell, remove the edge from the current path.
- Recursion without search: traversals, divide and conquer, and a DP recurrence.
- Backtracking as search: Sudoku, permutations, and the subsets of a knapsack when you explore include-or-skip and abandon a branch that already exceeds the capacity.
- You can write backtracking with an explicit stack. The recursive form is the usual one because the call stack stores the choice to undo.

**Examples:**

Permutations: append a number, recurse, then pop it. The pop is the backtrack. Factorial has a recursive call and nothing to undo.
</details>

<details>
<summary>Define Base Case in the context of recursive functions.</summary>

### Define Base Case in the context of recursive functions.

**Definition:**

The base case is the input the function answers without calling itself. It is what makes the recursion stop.

**How it works:**

- Identify the smallest input that is already an answer: `fact(0) = 1`, an empty range in binary search, a missing child in a tree walk.
- Put that test before the recursive call. If the call comes first, the base case is never reached.
- Every recursive call must move toward a base case. `fact(n)` calls `fact(n-1)`, not `fact(n)`.
- Missing the base case, or stepping the wrong way, grows the stack until the runtime aborts it.
- A function can have more than one base case. Fibonacci stops at both 0 and 1.

**Examples:**

```text
fact(n):
  if n == 0: return 1      # base
  return n * fact(n - 1)   # step toward 0
```
</details>

<details>
<summary>Explain the concept of Recursion Depth and its implications on algorithm complexity.</summary>

### Explain the concept of Recursion Depth and its implications on algorithm complexity.

**Definition:**

Recursion depth is how many calls are open at once, the height of the call stack. It bounds stack memory, and it is not the same number as the total number of calls.

**How it works:**

- A single chain, such as `fact(n)` calling `fact(n-1)`, has depth `n` and also Θ(n) calls. Time and stack match.
- A binary recursion tree can have exponentially many calls and only depth `n`, as in naive Fibonacci. Time follows the number of calls. Stack follows the depth.
- Space for the frames is Θ(depth) plus whatever each frame stores. A frame that holds an array of size n makes the space worse than the depth alone.
- Tail-call elimination reuses one frame when the recursive call is the last action. Not every language does this, so a tail-recursive function can still overflow.
- If the depth would exceed the stack, rewrite the algorithm as a loop or as an explicit heap-allocated stack, or cache results so the depth stays the length of one chain of new states.

**Examples:**

`fact(100000)` is one thin chain of 100000 frames and often dies with a stack overflow even though the math is trivial. A loop uses one frame.
</details>

<details>
<summary>How does the Call Stack operate in recursive function calls?</summary>

### How does the Call Stack operate in recursive function calls?

**Definition:**

Each call pushes a frame that holds the arguments, the return address, and the local variables. The frame stays until that call returns. Recursion is a stack of those frames, one per open call.

**How it works:**

- Calling `fact(3)` pushes a frame with `n = 3`. It cannot multiply yet, so it calls `fact(2)`, which pushes another frame.
- The base case `fact(0)` or `fact(1)` pushes a frame that returns immediately. That pop is the first return.
- Each waiting frame then multiplies by its own `n` and pops. The stack unwinds from the deepest call back to the original caller.
- The maximum number of frames is the depth, not the total number of calls over the whole run. After a frame pops, its memory can be reused by a later sibling call.
- A debugger’s stack trace is this chain. The top frame is the call that has not returned.

**Examples:**

```text
fact(3) waits
  fact(2) waits
    fact(1) returns 1
  fact(2) returns 2
fact(3) returns 6
```
</details>

<details>
<summary>Are there any safety considerations when determining the Recursion Depth? If yes, provide an example.</summary>

### Are there any safety considerations when determining the Recursion Depth? If yes, provide an example.

**Definition:**

Yes. Depth is a resource limit. A deep or cyclic recursion exhausts the call stack, and an attacker who controls the depth can turn that into a denial of service.

**How it works:**

- The runtime gives each thread a fixed stack. Past that limit the process raises a stack overflow instead of returning an answer.
- A base case that is never hit, or a graph walk that does not mark visited vertices, is an infinite recursion. The overflow is the symptom.
- Untrusted input that sets `n`, or a nested document an attacker can make arbitrarily deep, should not be followed with one frame per level. Cap the depth, or use a loop and a heap stack you can limit.
- Even a correct recursion of depth tens of thousands can overflow a default stack that was sized for hundreds of frames.
- Tail-call optimization removes the growth only when the compiler actually rewrites the call. Do not rely on it for safety unless the language guarantees it.

**Examples:**

A recursive JSON walker on a 100,000-deep array of single-element arrays will overflow long before it finishes the document. An explicit stack with a max depth returns a controlled error.
</details>

### Recursive Algorithms

<details>
<summary>Explain the Depth-First Search algorithm.</summary>

### Explain the Depth-First Search algorithm.

**Definition:**

Depth-first search follows one outgoing edge as far as it can, then backtracks to the next untried edge. The frontier is a stack.

**How it works:**

- Mark the start visited so a cycle does not revisit it.
- Recurse on each unvisited neighbor, or push neighbors and pop them in a loop.
- When a call returns, the next neighbor of the caller is tried. That return is the backtrack.
- An empty stack means every vertex reachable from the start was seen. Another component needs a new start.
- Time is Θ(V + E) with an adjacency list. Stack space is Θ(V) on a long path.
- Use it for cycles, topological order, and connected components. It does not produce shortest paths.

**Examples:**

```text
def dfs(u):
  seen.add(u)
  for v in neighbors(u):
    if v not in seen:
      dfs(v)
```
</details>

<details>
<summary>Implement a Recursive Algorithm to perform a Binary Search.</summary>

### Implement a Recursive Algorithm to perform a Binary Search.

**Definition:**

Recursive binary search looks at the middle of the current range and calls itself on the half that can still hold the target.

**How it works:**

- If the range is empty (`lo > hi`), the target is absent.
- Let `mid = lo + (hi - lo) // 2`. The subtraction form avoids overflowing a fixed-width `lo + hi`.
- If `a[mid]` is the target, return `mid`. If the target is greater, search `mid + 1 .. hi`. If it is smaller, search `lo .. mid - 1`.
- The array must already be sorted, and `mid` must be readable in O(1).
- Time is Θ(log n) comparisons. The recursive form uses Θ(log n) stack frames. The iterative form uses Θ(1) extra memory and the same number of comparisons.

**Examples:**

```text
def bsearch(a, target, lo, hi):
  if lo > hi: return -1
  mid = lo + (hi - lo) // 2
  if a[mid] == target: return mid
  if a[mid] < target: return bsearch(a, target, mid + 1, hi)
  return bsearch(a, target, lo, mid - 1)
```
</details>

<details>
<summary>Solve the Tower of Hanoi problem recursively.</summary>

### Solve the Tower of Hanoi problem recursively.

**Definition:**

Tower of Hanoi moves `n` disks from a source peg to a destination peg, using a spare peg. Only one disk moves at a time, and a larger disk never sits on a smaller one.

**How it works:**

- To move `n` disks from `src` to `dst` using `spare`: move `n-1` from `src` to `spare` (using `dst`), move the largest disk from `src` to `dst`, then move `n-1` from `spare` to `dst` (using `src`).
- The base case is `n == 0`: do nothing. `n == 1` is a single move.
- The number of moves is `2^n − 1`. Each level doubles the work, so the time is Θ(2ⁿ).
- Stack depth is Θ(n), one frame per disk still waiting for the second half of its move.
- The recurrence is forced by the rules. There is no shorter sequence that obeys them.

**Examples:**

```text
hanoi(n, src, dst, spare):
  if n == 0: return
  hanoi(n-1, src, spare, dst)
  move disk n from src to dst
  hanoi(n-1, spare, dst, src)
```

Three disks take 7 moves.
</details>

<details>
<summary>Recursively Check for Palindromes in a string.</summary>

### Recursively Check for Palindromes in a string.

**Definition:**

A string is a palindrome when the ends match and the slice between them is a palindrome. The empty string and a single character are palindromes.

**How it works:**

- If the range has length 0 or 1, return true.
- If the first and last characters differ, return false.
- Otherwise recurse on the open interval between them.
- Skip this if you need to ignore case or spaces; normalize first, or pass indexes and a predicate.
- There are Θ(n) comparisons and Θ(n) stack frames if each call slices a new string. Passing indexes avoids the copies and keeps the extra heap memory at Θ(1), with the stack still Θ(n).
- Two pointers in a loop do the same comparisons in Θ(1) extra memory.

**Examples:**

```text
pal(s, i, j):
  if i >= j: return true
  if s[i] != s[j]: return false
  return pal(s, i+1, j-1)
```

`"radar"` matches at both ends twice and finishes on `"d"`. `"hello"` fails on `h` versus `o`.
</details>

<details>
<summary>Explain the process of performing a recursive In-order Tree Traversal.</summary>

### Explain the process of performing a recursive In-order Tree Traversal.

**Definition:**

In-order traversal of a binary tree visits the left subtree, then the node, then the right subtree. On a binary search tree that order is the sorted order of the keys.

**How it works:**

- If the node is missing, return. That is the base case.
- Recurse on the left child, emit the node’s key, recurse on the right child.
- The call stack holds the ancestors waiting to emit themselves after their left subtree finishes.
- Time is Θ(n) for n nodes. Stack depth is the height, Θ(log n) when the tree is balanced and Θ(n) when it is a spine.
- Pre-order emits the node before the children. Post-order emits it after both children. Only the in-order sandwich matches BST sort order.

**Examples:**

```text
inorder(node):
  if node is null: return
  inorder(node.left)
  emit(node.key)
  inorder(node.right)
```

A BST with root 2, left 1, right 3 emits `1, 2, 3`.
</details>

### Tail Recursion

<details>
<summary>Calculate N-th Fibonacci Number using Tail Recursion.</summary>

### Calculate N-th Fibonacci Number using Tail Recursion.

**Definition:**

Tail-recursive Fibonacci carries the two previous values as arguments, so the recursive call is the entire remaining work. Nothing is left to do after it returns.

**How it works:**

- `go(n, a, b)` returns `a` when `n` is 0. Otherwise it calls `go(n-1, b, a+b)`.
- Start with `go(n, 0, 1)`. After k steps, `a` is `F(k)`.
- Time is Θ(n). A compiler that does tail-call elimination reuses one stack frame, so the extra memory is Θ(1). Without that elimination the depth is still Θ(n).
- This is the iterative loop written so the last action is the call. It does not change the number of additions.

**Examples:**

```text
def fib(n, a=0, b=1):
  if n == 0: return a
  return fib(n-1, b, a+b)
```

`fib(6)` returns 8.
</details>

<details>
<summary>Discuss how Tail Recursion can be optimized by compilers and its benefits.</summary>

### Discuss how Tail Recursion can be optimized by compilers and its benefits.

**Definition:**

Tail-call optimization rewrites a call that is the last action of a function into a jump, reusing the current frame. A tail-recursive loop then uses constant stack space.

**How it works:**

- A call is in tail position when the caller returns its result unchanged. `return f(...)` can be a jump. `return n * f(...)` cannot, because the multiply is still waiting.
- The compiler replaces the push of a new frame with an update of the current arguments and a branch back to the start.
- Languages in the Scheme family require this. Many functional compilers do it. C, Java, and CPython do not guarantee it, so the same source can still grow the stack.
- The benefit is that a recursive definition of a loop stays a loop at runtime: large `n` does not overflow, and you do not pay a frame per step.
- It does not make an exponential recursion linear. Naive Fibonacci is not a tail call, because both recursive results are still needed.

**Examples:**

`return fact(n-1, acc*n)` is a tail call. `return n * fact(n-1)` is not: the frame must stay alive to multiply after the call returns.
</details>

<details>
<summary>What is the difference between Head Recursion and Tail Recursion?</summary>

### What is the difference between Head Recursion and Tail Recursion?

**Definition:**

Head recursion does the recursive call first and uses the result on the way back. Tail recursion does the work first and makes the recursive call as its last action.

**How it works:**

- Head recursion, as in printing a list from the bottom or computing `n * fact(n-1)`, must keep the frame alive. The stack holds every frame until the deepest call returns.
- Tail recursion passes the updated accumulator into the call and returns that call’s result directly. After the call there is nothing to multiply or print.
- Only the tail form is eligible for tail-call elimination. Head recursion always needs the stack proportional to the depth, because the pending work is the point.
- The same function can be rewritten from head to tail by adding an accumulator argument. Factorial’s pending multiply becomes `acc * n` passed downward.
- “Head” here means the call happens before the local work, not a special position in the source file.

**Examples:**

```text
head(n):                 tail(n, acc):
  if n == 0: return 1     if n == 0: return acc
  return n * head(n-1)    return tail(n-1, acc*n)
```
</details>

<details>
<summary>Use Tail Recursive function to calculate the Factorial of a number.</summary>

### Use Tail Recursive function to calculate the Factorial of a number.

**Definition:**

</details>

<details>
<summary>Can Tail Recursion be more efficient than non-tail recursion? Explain with an example.</summary>

### Can Tail Recursion be more efficient than non-tail recursion? Explain with an example.

**Definition:**

</details>

### Converting Recursive to Iterative

<details>
<summary>Is it always possible to write a Non-Recursive form for every Recursive function?</summary>

### Is it always possible to write a Non-Recursive form for every Recursive function?

**Definition:**

</details>

<details>
<summary>Convert the given Recursive Function into an Iterative Function.</summary>

### Convert the given Recursive Function into an Iterative Function.

**Definition:**

</details>

<details>
<summary>Describe how to simulate the recursive QuickSort algorithm iteratively.</summary>

### Describe how to simulate the recursive QuickSort algorithm iteratively.

**Definition:**

</details>

<details>
<summary>Convert a recursive Depth-First Search to an iterative approach using a Stack.</summary>

### Convert a recursive Depth-First Search to an iterative approach using a Stack.

**Definition:**

</details>

### Recursive Problems in Data Structures

<details>
<summary>Convert a Binary Tree into a Doubly Linked List.</summary>

### Convert a Binary Tree into a Doubly Linked List.

**Definition:**

</details>

<details>
<summary>Reverse a Linked List recursively.</summary>

### Reverse a Linked List recursively.

**Definition:**

</details>

<details>
<summary>Sort a Stack using Recursion.</summary>

### Sort a Stack using Recursion.

**Definition:**

</details>

<details>
<summary>Implement a recursive algorithm to Find the Lowest Common Ancestor in a BST.</summary>

### Implement a recursive algorithm to Find the Lowest Common Ancestor in a BST.

**Definition:**

</details>

<details>
<summary>Solve the problem of recursively Flattening a Multilevel Doubly Linked List.</summary>

### Solve the problem of recursively Flattening a Multilevel Doubly Linked List.

**Definition:**

</details>

<details>
<summary>How would you recursively Serialize and Deserialize a Binary Tree?</summary>

### How would you recursively Serialize and Deserialize a Binary Tree?

**Definition:**

</details>

### Fundamental Recursive Problems

<details>
<summary>Calculate the N-th value of the Fibonacci Sequence recursively.</summary>

### Calculate the N-th value of the Fibonacci Sequence recursively.

**Definition:**

</details>

<details>
<summary>Write a recursive function to calculate Sum of Digits in a number.</summary>

### Write a recursive function to calculate Sum of Digits in a number.

**Definition:**

</details>

<details>
<summary>Implement Merge Sort recursively.</summary>

### Implement Merge Sort recursively.

**Definition:**

</details>

<details>
<summary>Implement a recursive function to Print all Permutations of a given string.</summary>

### Implement a recursive function to Print all Permutations of a given string.

**Definition:**

</details>

<details>
<summary>Generate all Balanced Parentheses using a recursive approach.</summary>

### Generate all Balanced Parentheses using a recursive approach.

**Definition:**

</details>

### Advanced Recursive Problems

<details>
<summary>Use recursive approach to solve the Skyline Problem.</summary>

### Use recursive approach to solve the Skyline Problem.

**Definition:**

</details>

<details>
<summary>Implement a recursive backtracking solution for the Sudoku Solver problem.</summary>

### Implement a recursive backtracking solution for the Sudoku Solver problem.

**Definition:**

</details>

<details>
<summary>Find the K-th Order Statistic in an unsorted list using a recursive strategy.</summary>

### Find the K-th Order Statistic in an unsorted list using a recursive strategy.

**Definition:**

</details>

<details>
<summary>Use a recursive algorithm to detect a Cycle in an Undirected Graph.</summary>

### Use a recursive algorithm to detect a Cycle in an Undirected Graph.

**Definition:**

</details>

<details>
<summary>Find All Possible Full Binary Trees with N nodes recursively.</summary>

### Find All Possible Full Binary Trees with N nodes recursively.

**Definition:**

</details>

### Recursion in Algorithms Design

<details>
<summary>Explain how Divide and Conquer is a form of recursion and give examples.</summary>

### Explain how Divide and Conquer is a form of recursion and give examples.

**Definition:**

</details>

<details>
<summary>Use recursion to solve the Longest Common Subsequence problem.</summary>

### Use recursion to solve the Longest Common Subsequence problem.

**Definition:**

</details>

<details>
<summary>Define the role of recursion in the design of Greedy Algorithms.</summary>

### Define the role of recursion in the design of Greedy Algorithms.

**Definition:**

</details>

<details>
<summary>How is recursion utilized in the Backtracking paradigm for algorithm design?</summary>

### How is recursion utilized in the Backtracking paradigm for algorithm design?

**Definition:**

</details>

<details>
<summary>Illustrate the use of recursion in Dynamic Programming with an example problem.</summary>

### Illustrate the use of recursion in Dynamic Programming with an example problem.

**Definition:**

</details>

### Optimization in Recursive Functions

<details>
<summary>Define Memoization and explain how it optimizes recursive solutions.</summary>

### Define Memoization and explain how it optimizes recursive solutions.

**Definition:**

</details>

<details>
<summary>What’s the impact of Stack Overflow in recursive algorithms and how is it avoided?</summary>

### What’s the impact of Stack Overflow in recursive algorithms and how is it avoided?

**Definition:**

</details>

<details>
<summary>Discuss Space Complexity and how it relates to iterative vs. recursive solutions.</summary>

### Discuss Space Complexity and how it relates to iterative vs. recursive solutions.

**Definition:**

</details>

<details>
<summary>Explain Tail Call Optimization (TCO) and its support in various programming languages.</summary>

### Explain Tail Call Optimization (TCO) and its support in various programming languages.

**Definition:**

</details>

<details>
<summary>Implement a recursive algorithm with an explicit Manual Stack to avoid Stack Overflow.</summary>

### Implement a recursive algorithm with an explicit Manual Stack to avoid Stack Overflow.

**Definition:**

</details>

### Tricky Recursive Cases and Handling

<details>
<summary>How to handle negative input cases in a recursive Absolute Value function?</summary>

### How to handle negative input cases in a recursive Absolute Value function?

**Definition:**

</details>

<details>
<summary>Solve the problem of computing all possible combinations of well-formed m-n pairs recursively.</summary>

### Solve the problem of computing all possible combinations of well-formed m-n pairs recursively.

**Definition:**

</details>

<details>
<summary>Discuss strategies to visually debug recursive functions.</summary>

### Discuss strategies to visually debug recursive functions.

**Definition:**

</details>

<details>
<summary>Recursively determine if a Graph is Connected.</summary>

### Recursively determine if a Graph is Connected.

**Definition:**

</details>

<details>
<summary>Recursively implement a Regular Expression Matcher.</summary>

### Recursively implement a Regular Expression Matcher.

**Definition:**

</details>

### Recursion Theory Questions

<details>
<summary>Explain the relationship between Recursion and Lambda Calculus.</summary>

### Explain the relationship between Recursion and Lambda Calculus.

**Definition:**

</details>
