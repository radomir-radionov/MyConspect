# Backtracking — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./7_special_algorithms.md)

### Related docs

- [Backtracking — Interview](./7_algo_backtracking_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Backtracking](https://devinterview.io/questions/data-structures-and-algorithms/backtracking-algorithms-interview-questions/).

### Fundamental Concepts and Techniques

<details>
<summary>What is Backtracking?</summary>

### What is Backtracking?

**Definition:**

Backtracking builds a candidate one choice at a time and undoes the latest choice as soon as it cannot lead to a valid solution.

**How it works:**

- The search is a depth-first walk over partial solutions. At each step you pick a legal extension, recurse, then restore the state.
- A constraint check on the partial candidate stops a whole subtree. That early stop is the difference from listing every complete object.
- The call stack stores the path from the root to the current choice. Returning from the call is the undo.
- It fits puzzles with constraints: N-queens, subsets that sum to a target, Sudoku, and generating permutations.

**Examples:**

```text
choose 1, then 2 -> sum 3, too small, continue
choose 1, 2, 4 -> sum 7, target hit, record it
undo 4, undo 2, try 1 then 3
```
</details>

<details>
<summary>How does backtracking differ from brute force methods?</summary>

### How does backtracking differ from brute force methods?

**Definition:**

Brute force generates complete candidates and tests them at the end. Backtracking rejects a partial candidate and never finishes the branches under it.

**How it works:**

- Both can be exponential. Backtracking's saving is the pruned volume, which depends on how early a constraint fails.
- Brute force over permutations of 8 queens tests 8!. Backtracking places queen by queen and drops a row as soon as two queens share a column or a diagonal.
- If the constraint can only be checked on a finished candidate, backtracking degenerates into the same tree as brute force.
- The code shape is also different: brute force often builds the object in a loop or by recursion without an undo of a failed prefix.
</details>

<details>
<summary>Explain the concept of a decision tree in backtracking algorithms.</summary>

### Explain the concept of a decision tree in backtracking algorithms.

**Definition:**

The decision tree is the tree of choices: each level is one variable, and each edge is one value you might assign.

**How it works:**

- The root is the empty assignment. A leaf is either a complete valid solution or a dead end.
- Left-to-right order among siblings is the order you try values. Depth-first search walks one path to a leaf before the next sibling.
- Pruning deletes a node and everything below it when the partial assignment already violates a constraint.
- Drawing the tree is how you explain the algorithm even when the implementation is only a recursive function.

**Examples:**

Subset sum on `{1, 2}` with target 2: the first level is 'take 1 or not', the second is 'take 2 or not'. The path take-1, skip-2 sums to 1 and dies. The path skip-1, take-2 sums to 2 and is a leaf solution.
</details>

<details>
<summary>Discuss common optimizations in backtracking to improve efficiency.</summary>

### Discuss common optimizations in backtracking to improve efficiency.

**Definition:**

Optimizations shrink the tree by failing earlier, trying promising values first, or remembering a state you have already solved.

**How it works:**

- Forward checking removes values that the latest assignment has made impossible, before the recursive call.
- Variable ordering, such as the smallest remaining domain, fails high in the tree instead of after a long prefix.
- Bit sets and incremental scores update a constraint in O(1) or O(width) instead of rescanning the whole partial solution.
- Memoization applies only when the same sub-state can be reached by different paths. A pure permutation search often has no repeated state.
</details>

<details>
<summary>How does backtracking relate to other algorithmic paradigms like divide and conquer?</summary>

### How does backtracking relate to other algorithmic paradigms like divide and conquer?

**Definition:**

Both are recursive, but they split the work differently. Divide and conquer solves independent subproblems and combines them. Backtracking searches one path, then undoes it and tries another.

**How it works:**

- Divide and conquer's subproblems do not share a mutable board. Mergesort's halves can be sorted separately.
- Backtracking's recursive call inherits the board and must restore it, because the sibling call needs the parent state.
- A problem can use both: a divide step that then backtracks inside one region, or a backtracking search whose bounding function comes from a closed-form estimate.
- Dynamic programming is the next relative when subproblems repeat and you store answers instead of re-walking them.
</details>

<details>
<summary>Describe the role of state space tree in understanding backtracking algorithms.</summary>

### Describe the role of state space tree in understanding backtracking algorithms.

**Definition:**

The state-space tree is the decision tree drawn for one run: nodes are partial states, and the algorithm visits only some of them.

**How it works:**

- State means the variables assigned so far, plus whatever incremental facts you keep (used columns, current sum).
- The full tree is conceptual. The running algorithm stores only the current path, which is why the extra memory is proportional to the depth.
- A promising node still has a legal extension. A non-promising node fails the constraint and is not expanded.
- Counting visited nodes, not the size of the full tree, is the real cost of a particular ordering and pruning rule.
</details>

<details>
<summary>Explain the concept of constraint satisfaction in backtracking.</summary>

### Explain the concept of constraint satisfaction in backtracking.

**Definition:**

A constraint-satisfaction problem is a set of variables, a domain for each, and constraints that combinations must obey. Backtracking assigns variables until every constraint is satisfied.

**How it works:**

- Unary constraints limit one variable. Binary constraints link a pair, such as two queens not sharing a diagonal.
- A partial assignment is checked against the constraints that mention only assigned variables. Waiting for a full assignment wastes the prefix.
- Constraint propagation tightens domains after each assignment. Arc consistency removes a value that has no support in a neighbor's domain.
- Sudoku is the standard picture: 81 variables, domains 1–9, and all-different constraints on rows, columns, and boxes.
</details>

### Implementing Backtracking

<details>
<summary>Outline a method to implement backtracking iteratively.</summary>

### Outline a method to implement backtracking iteratively.

**Definition:**

An explicit stack stores frames of `(variable index, next value to try, snapshot)`, and a loop pushes and pops those frames instead of using the call stack.

**How it works:**

- Push the first variable with its first candidate. To go deeper, push the next variable. To backtrack, pop and advance the value on the new top.
- Undo is whatever the frame recorded: clear a cell, restore a sum, or pop a chosen item.
- The loop ends when the stack is empty. A frame that has tried every value is popped.
- This matches recursion's depth-first order and avoids a call-stack overflow on a deep assignment. The logic is easier to get wrong because the undo is manual.

**Examples:**

```text
stack: [(col=0, next_row=0)]
place queen, push (col=1, next_row=0)
dead end -> pop, next_row += 1, try again
```
</details>

<details>
<summary>What are the considerations for choosing candidates at each step in a backtracking algorithm?</summary>

### What are the considerations for choosing candidates at each step in a backtracking algorithm?

**Definition:**

A candidate must be legal given the assignments so far, and the order you try them changes how fast you find the first solution.

**How it works:**

- Generate from the domain, then reject with the constraint, or generate only values that already pass a cheap local check.
- For the first solution, try values that are more likely to succeed first. For every solution, the order does not change the set, only the visit order.
- Least-constraining value tries the choice that rules out the fewest options for neighbors.
- A candidate generator that itself scans the whole board can dominate the runtime even when pruning is good.
</details>

<details>
<summary>Describe the role of pruning in backtracking algorithms.</summary>

### Describe the role of pruning in backtracking algorithms.

**Definition:**

Pruning refuses to expand a node whose partial assignment is already doomed, so those descendants are never built.

**How it works:**

- Feasibility pruning uses a hard constraint: a queen under attack, a sum already past the target, a Sudoku digit repeated.
- Bound pruning uses an estimate: if the best possible completion is worse than a solution you already have, drop the branch. That is the branch-and-bound variant.
- Pruning is safe only when the test has no false failures. A test that rejects a prefix of a real solution loses answers.
- The same algorithm with a weaker test visits many more nodes. Correctness can stay, and the runtime explodes.
</details>

<details>
<summary>How can memoization be integrated with backtracking?</summary>

### How can memoization be integrated with backtracking?

**Definition:**

Memoization stores the answer for a sub-state the first time you solve it, and later paths that reach the same state reuse that answer.

**How it works:**

- The key must include everything that still affects the result: the index you start from, the remaining target, the used mask. Forgetting a field returns a wrong cached answer.
- It helps subset-sum style searches, where many paths share a suffix. It does not help much when every path has a unique board.
- The memory is the number of distinct states, which can be larger than the depth. That is the usual DP trade.
- Store a boolean, a count, or one reconstructed solution. Store the whole list of solutions only when you truly need all of them.

**Examples:**

Knapsack remaining capacity 7 at item 3 is one state. The first path computes it. A later path that also arrives at item 3 with capacity 7 reads the cached best value.
</details>

<details>
<summary>Explain the importance of backtracking in recursive algorithm design.</summary>

### Explain the importance of backtracking in recursive algorithm design.

**Definition:**

Backtracking is the standard recursive shape for 'try a choice, explore, undo'. It keeps the parent state intact for the next choice.

**How it works:**

- The recursive function's contract is: the board is valid on entry, and it is unchanged on exit.
- Forgetting the undo is the bug that makes later siblings see a choice they did not make.
- The same shape generates combinations, permutations, and partitions. Only the candidate rule and the constraint change.
- It is also the mental model for parsers and solvers that commit to a token or a move and retreat when the rest fails.
</details>

<details>
<summary>Explain the impact of variable ordering on the performance of backtracking algorithms.</summary>

### Explain the impact of variable ordering on the performance of backtracking algorithms.

**Definition:**

The order of variables changes the shape of the tree. Failing on a tight variable first cuts more branches than failing on it after a long prefix.

**How it works:**

- Minimum remaining values picks the variable with the smallest domain next. A domain of size 1 is a forced move and should happen immediately.
- A static order fixed before search is simpler and can still be terrible if the first variables are the loose ones.
- Degree heuristic breaks ties by choosing the variable that participates in the most constraints.
- Ordering does not change whether a solution exists. It changes how many nodes you touch before you know.

**Examples:**

In Sudoku, filling a cell that has two legal digits before a cell that has seven fails or finishes that branch sooner than the other way around.
</details>

### Complexity Analysis

<details>
<summary>Explain the time and space complexity of a typical backtracking algorithm.</summary>

### Explain the time and space complexity of a typical backtracking algorithm.

**Definition:**

Time follows the number of nodes the search actually visits. Space follows the depth of one path, plus the output if you store every solution.

**How it works:**

- A complete tree with branching factor `b` and depth `d` is O(bᵈ) nodes. Pruning makes the typical case smaller and leaves the worst case unchanged.
- Work per node is the cost of generating a candidate and testing the constraint. A naive scan can turn O(bᵈ) nodes into something worse.
- Recursion depth is O(d). An explicit board of size d is the other O(d) memory.
- Output-sensitive cost matters: listing all permutations is Θ(n · n!) because there are n! leaves and each takes O(n) to copy.
</details>

<details>
<summary>How do worst-case scenarios in backtracking compare to other algorithms?</summary>

### How do worst-case scenarios in backtracking compare to other algorithms?

**Definition:**

In the worst case backtracking still walks a full exponential tree, the same order as brute force, when every partial candidate looks legal until the end.

**How it works:**

- A problem with a tight constraint, such as N-queens, prunes heavily on typical boards and still has an exponential worst case.
- Dynamic programming wins when the state space is polynomial and repeats. Backtracking without memoization recomputes those overlaps.
- A greedy algorithm or a closed form is better when the problem has the structure they require. Backtracking is what you use when they do not.
- Branch and bound improves the worst practical search for optimization by using a bound, and it still cannot promise polynomial time.
</details>

### Classic Backtracking Problems and Challenges

<details>
<summary>Provide a backtracking solution for the N-Queens problem.</summary>

### Provide a backtracking solution for the N-Queens problem.

**Definition:**

</details>

<details>
<summary>Solve a Sudoku puzzle with backtracking.</summary>

### Solve a Sudoku puzzle with backtracking.

**Definition:**

</details>

<details>
<summary>Solve the rat in a maze problem with backtracking.</summary>

### Solve the rat in a maze problem with backtracking.

**Definition:**

</details>

<details>
<summary>Write a backtracking algorithm to generate all permutations of a string.</summary>

### Write a backtracking algorithm to generate all permutations of a string.

**Definition:**

</details>

<details>
<summary>Implement a backtracking solution for the subset sum problem.</summary>

### Implement a backtracking solution for the subset sum problem.

**Definition:**

</details>

<details>
<summary>Develop a backtracking solution to the Crossword Puzzle problem.</summary>

### Develop a backtracking solution to the Crossword Puzzle problem.

**Definition:**

</details>

<details>
<summary>Create a backtracking solution for the Word Search puzzle.</summary>

### Create a backtracking solution for the Word Search puzzle.

**Definition:**

</details>

### Advanced Problem Solving with Backtracking

<details>
<summary>Solve the graph coloring problem backtracking.</summary>

### Solve the graph coloring problem backtracking.

**Definition:**

</details>

<details>
<summary>Implement a backtracking solution for the Knight's Tour problem.</summary>

### Implement a backtracking solution for the Knight's Tour problem.

**Definition:**

</details>

<details>
<summary>Use backtracking approach to solve cryptarithmetic puzzles.</summary>

### Use backtracking approach to solve cryptarithmetic puzzles.

**Definition:**

</details>

<details>
<summary>Solve the Hamiltonian path problem using backtracking.</summary>

### Solve the Hamiltonian path problem using backtracking.

**Definition:**

</details>

<details>
<summary>Solve Word Break problem using backtracking.</summary>

### Solve Word Break problem using backtracking.

**Definition:**

</details>

<details>
<summary>Write a backtracking algorithm for palindrome partitioning of a string.</summary>

### Write a backtracking algorithm for palindrome partitioning of a string.

**Definition:**

</details>

<details>
<summary>Solve the combination sum problem using a backtracking approach.</summary>

### Solve the combination sum problem using a backtracking approach.

**Definition:**

</details>

<details>
<summary>Implement a backtracking algorithm to find all valid IP addresses from a string of numbers.</summary>

### Implement a backtracking algorithm to find all valid IP addresses from a string of numbers.

**Definition:**

</details>

<details>
<summary>Develop a backtracking solution to the "All Paths From Source to Target" problem in a directed graph.</summary>

### Develop a backtracking solution to the "All Paths From Source to Target" problem in a directed graph.

**Definition:**

</details>

### Real-World Applications of Backtracking

<details>
<summary>How is backtracking used in artificial intelligence for games?</summary>

### How is backtracking used in artificial intelligence for games?

**Definition:**

</details>

<details>
<summary>Explain the role of backtracking in network routing optimization.</summary>

### Explain the role of backtracking in network routing optimization.

**Definition:**

</details>

<details>
<summary>How can backtracking be used in optimizing database query solutions?</summary>

### How can backtracking be used in optimizing database query solutions?

**Definition:**

</details>

<details>
<summary>Discuss the use of backtracking in scheduling and planning problems.</summary>

### Discuss the use of backtracking in scheduling and planning problems.

**Definition:**

</details>
