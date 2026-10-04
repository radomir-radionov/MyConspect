# Dynamic Programming — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./7_special_algorithms.md)

### Related docs

- [Dynamic Programming — Interview](./7_algo_dp_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Dynamic Programming](https://devinterview.io/questions/data-structures-and-algorithms/dynamic-programming-interview-questions/).

### Basic Dynamic Programming Concepts

<details>
<summary>What is Dynamic Programming and how does it differ from recursion?</summary>

### What is Dynamic Programming and how does it differ from recursion?

**Definition:**

Dynamic programming solves a recurrence by keeping each overlapping subproblem’s answer. Plain recursion recomputes that answer every time the call tree asks for it.

**How it works:**

- Recursion shrinks the input until a base case. Nothing is stored, so the same call can run exponentially often.
- DP uses the same recurrence, but each distinct state is evaluated a constant number of times and then reused.
- Top-down DP is recursion plus a memo table: compute a state when it is first needed.
- Bottom-up DP fills a table from the smallest states toward the answer, usually with a loop.
- Fibonacci shows the split. The naive tree calls `fib(k)` once per path that reaches it. The memoized or tabulated version calls it once.

**Examples:**

`fib(5)` naively expands into two calls of `fib(4)` and `fib(3)`, and those repeat `fib(2)`. A table `t[i] = t[i-1] + t[i-2]` writes each index one time.
</details>

<details>
<summary>Can you explain the concept of overlapping subproblems?</summary>

### Can you explain the concept of overlapping subproblems?

**Definition:**

Overlapping subproblems means the same smaller problem shows up on many branches of the recursion, so a stored answer can be reused.

**How it works:**

- The repeat is what makes a cache pay. If every subproblem is unique, as with the two halves of merge sort, a table does not remove work.
- Fibonacci is the textbook overlap: `fib(n)` and `fib(n-1)` both need `fib(n-2)`.
- Edit distance has the same shape. The distance between a prefix of “Saturday” and a prefix of “Sunday” is reached by more than one sequence of insert, delete, and replace.
- Optimal substructure is the partner property: an optimal answer is built from optimal answers to those repeated pieces. Overlap alone is not enough if the pieces do not compose that way.

**Examples:**

`fib(6)` calls `fib(4)` from both `fib(6)` and `fib(5)`. One stored `fib(4)` replaces a whole subtree.
</details>

<details>
<summary>Define memoization and how it improves performance in Dynamic Programming.</summary>

### Define memoization and how it improves performance in Dynamic Programming.

**Definition:**

Memoization stores the result of a call under its arguments and returns that result when the same arguments appear again. In DP it is the top-down way to fill the state table.

**How it works:**

- The first call does the work and writes the cache. Later calls are a lookup.
- The code stays close to the recurrence, without an explicit loop over every state.
- You only compute states the original call actually reaches, which can beat a bottom-up table that fills a larger rectangle.
- The costs are the cache itself, the recursion depth, and any policy for dropping stale entries if the function is not a pure function of its arguments.
- For Fibonacci the cache turns an exponential tree into one chain of new states, Θ(n) time and Θ(n) entries.

**Examples:**

```text
fib(n):
  if n in cache: return cache[n]
  if n < 2: return n
  cache[n] = fib(n-1) + fib(n-2)
  return cache[n]
```
</details>

<details>
<summary>What is the difference between top-down and bottom-up approaches in Dynamic Programming?</summary>

### What is the difference between top-down and bottom-up approaches in Dynamic Programming?

**Definition:**

Top-down starts at the requested answer and recurses, caching each state. Bottom-up starts at the base cases and loops until the requested answer is filled.

**How it works:**

- Top-down is memoized recursion. The call `fib(n)` asks for `fib(n-1)` and `fib(n-2)`, and the map stops the repeat.
- Bottom-up allocates `t[0] = 0`, `t[1] = 1`, then sets `t[i] = t[i-1] + t[i-2]` for `i` from 2 to n.
- Both use the same recurrence and the same asymptotic time when every state is needed. Top-down can skip states that nothing asks for. Bottom-up has no call stack and a predictable loop.
- Bottom-up makes the dependency order obvious: a cell is written only after the cells it reads. Top-down discovers that order through the recursion.

**Examples:**

`fib(4)` top-down calls 4, then 3, then 2, then stores 2, 3, and 4 on the way back. Bottom-up writes indices 2, 3, and 4 in that order and never builds a stack of calls.
</details>

<details>
<summary>Explain the importance of state definition in Dynamic Programming solutions.</summary>

### Explain the importance of state definition in Dynamic Programming solutions.

**Definition:**

The state is the smallest tuple of parameters that identifies a subproblem. A wrong tuple either cannot be recursed, or it stores more than the recurrence needs.

**How it works:**

- A clear state is how you name the overlapping pieces and write the transition between them.
- Keeping only the fields the transition reads is what bounds the table. Extra fields multiply the memory.
- The same discipline produces shorter code: one function or one loop per state, not a pile of special cases.
- Optimization states usually store the best value so far, such as max value for a knapsack capacity.
- Counting states store how many ways reach that tuple.
- Decision states store a yes or no, such as “can this prefix form the amount?”.

**Examples:**

0/1 knapsack: state `(i, w)` is the best value using the first `i` items with capacity `w`. Dropping `i` makes the transition ambiguous, because you no longer know which item you are deciding.
</details>

### Fundamental Dynamic Programming Problems

<details>
<summary>Compute the Fibonacci sequence using Dynamic Programming.</summary>

### Compute the Fibonacci sequence using Dynamic Programming.

**Definition:**

The nth Fibonacci number is the classic one-dimensional DP: `F(i) = F(i-1) + F(i-2)` with `F(0) = 0` and `F(1) = 1`.

**How it works:**

- Tabulation allocates an array and writes the base cases first.
- For `i` from 2 through n, set `fib[i]` to the sum of the two previous cells.
- Time is Θ(n), against the exponential tree of the naive recursion.
- Space is Θ(n) for the array. Two rolling variables cut that to Θ(1) if you only need `F(n)`, not the whole sequence.
- The loop order is the proof the dependency is satisfied: a cell is written only after both parents exist.

**Examples:**

```text
fib = [0, 1]
for i in 2..n: fib[i] = fib[i-1] + fib[i-2]
return fib[n]
```

`n = 6` writes `1, 2, 3, 5, 8`.
</details>

<details>
<summary>Implement a solution to the Coin Change Problem using DP.</summary>

### Implement a solution to the Coin Change Problem using DP.

**Definition:**

Coin change (fewest coins) asks for the minimum number of coins from a denomination list that sum to `amount`.

**How it works:**

- Let `dp[x]` be the fewest coins that sum to `x`. Set `dp[0] = 0` and every other cell to a sentinel larger than `amount`, such as `amount + 1`.
- For each amount `x` from 1 to `amount`, and each coin `c`, if `c <= x` then `dp[x] = min(dp[x], 1 + dp[x - c])`.
- The `1` is the coin you just took. `dp[x - c]` is the best way to make the rest.
- If `dp[amount]` is still the sentinel, no combination works.
- Time is Θ(amount × number of coins). Space is Θ(amount).
- This order allows unlimited reuse of a coin. The 0/1 variant would iterate coins on the outside and amounts downward.

**Examples:**

Coins `[1, 2, 5]`, amount `11`. One optimal pick is `5 + 5 + 1`, so the answer is 3. `dp[11]` ends at 3.
</details>

<details>
<summary>Use Dynamic Programming approach to solve the 0/1 Knapsack problem.</summary>

### Use Dynamic Programming approach to solve the 0/1 Knapsack problem.

**Definition:**

The 0/1 knapsack takes each item at most once. Choose a subset whose weight is at most `W` and whose value is maximum.

**How it works:**

- State `dp[i][w]` is the best value using the first `i` items and capacity `w`.
- The table has `(n + 1)` rows and `(W + 1)` columns. Row 0 and column 0 stay 0.
- If item `i` weighs more than `w`, copy `dp[i-1][w]`. Otherwise take the max of skipping it and of `value[i] + dp[i-1][w - weight[i]]`.
- The answer is `dp[n][W]`. Walk back from that cell, and whenever the value changed from the row above, that item was taken.
- Time and the full table are Θ(n · W). One rolling row of length `W + 1`, filled from the right, keeps the same time and Θ(W) memory.

**Examples:**

Items `(weight 2, value 3)` and `(weight 3, value 4)`, capacity 5. Taking both exceeds 5. The table’s best cell is 4, the second item alone, unless a third item fits beside the first.
</details>

<details>
<summary>Implement an algorithm for computing the longest common subsequence of two sequences.</summary>

### Implement an algorithm for computing the longest common subsequence of two sequences.

**Definition:**

A longest common subsequence is the longest sequence that appears in both inputs in the same order, not necessarily as a contiguous slice.

**How it works:**

- Let the strings have lengths `m` and `n`. `L[i][j]` is the LCS length of the first `i` characters of `X` and the first `j` of `Y`.
- Start from a zero border. If `X[i-1] == Y[j-1]`, then `L[i][j] = L[i-1][j-1] + 1`. Otherwise `L[i][j] = max(L[i-1][j], L[i][j-1])`.
- The length is `L[m][n]`. To recover one subsequence, walk from that cell: on a match, emit the character and step diagonally; otherwise step toward the larger neighbor.
- Time and space are Θ(m n) for the full matrix. Two rolling rows keep the length in Θ(min(m, n)) memory; reconstructing the string still needs a way to remember the choices.

**Examples:**

`X = ABCD`, `Y = ACBD`. One LCS is `ABD`, length 3. `ACD` is another of the same length.
</details>

<details>
<summary>Solve matrix chain multiplication problem with Dynamic Programming.</summary>

### Solve matrix chain multiplication problem with Dynamic Programming.

**Definition:**

Matrix chain multiplication chooses where to parenthesize a product `A1 A2 … An` so the number of scalar multiplications is minimized. The matrices’ dimensions are compatible; only the association changes the cost.

**How it works:**

- State `(i, j)` is the cheapest way to multiply the chain from matrix `i` through matrix `j`.
- A single matrix costs 0. A split after matrix `k` costs `dp[i][k] + dp[k+1][j]` plus `rows(i) * cols(k) * cols(j)`.
- Fill by increasing chain length. For each length, try every start `i` and every split `k`.
- The optimal association of a chain uses an optimal association on each side of that split. The table’s argmin records the `k` if you need the parenthesization, not only the cost.
- Time is Θ(n³) from the three nested loops. The table is Θ(n²).

**Examples:**

Dimensions `10×30`, `30×5`, `5×60`. Splitting after the first matrix costs `10*30*5 + 10*5*60 = 4500`. Splitting after the second costs `30*5*60 + 10*30*60 = 27000`. The DP picks 4500.
</details>

### Optimizing Dynamic Programming Solutions

<details>
<summary>What are the trade-offs between memoization and tabulation in Dynamic Programming?</summary>

### What are the trade-offs between memoization and tabulation in Dynamic Programming?

**Definition:**

Memoization is the cached top-down recurrence. Tabulation is the bottom-up loop that writes every dependent state before the caller needs it.

**How it works:**

- Memoization starts at the original problem and computes a subproblem only when a call reaches it. That skips unreachable states.
- Its drawbacks are the recursion overhead and a call stack that can be as deep as the longest chain of states.
- Tabulation has no recursive stack. The loop order has to match the dependencies, which is harder when those dependencies are not a simple index order.
- Tabulation often fills states nobody needed, whenever the table is larger than the set of reachable states.
- Time is the same order when both end up touching the same states. Pick memoization when the reachable set is sparse or the recurrence is clearer as a function. Pick tabulation when you want a bounded stack and a tight rolling array.

**Examples:**

A knapsack whose capacities jump by large weights may never visit most `w` values from the top. The bottom-up row still writes every capacity.
</details>

<details>
<summary>How do you determine the time complexity of a Dynamic Programming algorithm?</summary>

### How do you determine the time complexity of a Dynamic Programming algorithm?

**Definition:**

DP time is the number of states times the work to compute one state from the states it already depends on. Space is the number of states you keep.

**How it works:**

- Count the distinct tuples. A 1D index `i ≤ n` is Θ(n) states. A pair `(i, j)` over lengths `m` and `n` is Θ(m n).
- Multiply by the transitions tried per state. Coin change tries every coin, so the bound is Θ(amount × coins), not Θ(amount).
- Memoized recursion has the same bound once each state is cached, even if the uncached tree was exponential. The stack is extra space on top of the cache.
- A 1D bottom-up loop is often Θ(n × work per cell). A 2D table is Θ(m n × work per cell) time and Θ(m n) memory unless you roll a row away.
- Shrinking the state changes both bounds: two rolling Fibonacci variables, a sliding window of the last row, or iterating a knapsack row backward so one array is enough.

**Examples:**

Matrix chain: Θ(n²) subchains, and each tries Θ(n) splits, so Θ(n³) time. Fibonacci: Θ(n) states and Θ(1) work each, so Θ(n).
</details>

<details>
<summary>Describe techniques to optimize space complexity in Dynamic Programming problems.</summary>

### Describe techniques to optimize space complexity in Dynamic Programming problems.

**Definition:**

Space drops when a state only reads a thin slice of earlier states, so the rest of the table never has to exist at once.

**How it works:**

- Rolling variables: Fibonacci needs only the last two numbers, so the Θ(n) array becomes two words.
- Rolling rows: LCS and edit distance read only the previous row (and the current cell’s left neighbor). Keep two rows, or even one row plus a diagonal variable.
- 0/1 knapsack reads `dp[i-1][w - weight]` while filling row `i`. Iterate `w` downward in a single array so the values you still need have not been overwritten.
- Interleaving is the same idea on a grid: compute one diagonal or one row, then discard it.
- Do not memoize a huge state if the decision depends only on the current position. A maze cell does not need a copy of the whole path.
- Bitsets pack a boolean row, which is how some string and knapsack DP cuts the constant, not the asymptotic shape, when the state is a set of reachable flags.

**Examples:**

Edit distance between strings of length `n` can keep two arrays of length `n + 1` instead of an `(n+1) × (n+1)` matrix. The distance is the last cell; the full alignment still needs the choices or the full table.
</details>

<details>
<summary>What is state transition, and how do you derive state transition relations?</summary>

### What is state transition, and how do you derive state transition relations?

**Definition:**

A state transition is the rule that builds one state’s answer from a few earlier states. Deriving it means naming the state, the legal moves, the start, and the stop.

**How it works:**

- Write down the fields that must be known to continue. That tuple is the state.
- List the choices at that tuple and the state each choice lands in. The relation is the min, max, or sum over those landings.
- The initial state is the empty prefix, zero items, or the base Fibonacci pair. It has to match the real start of the problem.
- A terminal state is where no choice remains: the capacity is exhausted, the string is consumed, or the index has reached `n`.
- The table is only a memory for those relations. Without a correct relation, filling order does not matter.
- Knapsack’s relation is the pattern: from `(i, w)` you either stay at `(i-1, w)` or, when the item fits, add its value to `(i-1, w - weight)`.

**Examples:**

```text
dp[i][w] = dp[i-1][w]                         if weight[i] > w
dp[i][w] = max(dp[i-1][w],
               value[i] + dp[i-1][w-weight])  otherwise
```
</details>

### String-related Dynamic Programming Questions

<details>
<summary>Find the longest palindromic substring in a given string.</summary>

### Find the longest palindromic substring in a given string.

**Definition:**

The longest palindromic substring is the longest contiguous slice that reads the same forward and backward. DP records whether each slice is a palindrome, then keeps the longest one that is.

**How it works:**

- `dp[i][j]` is true when `s[i..j]` is a palindrome.
- Every length-1 slice is true. A length-2 slice is true when the two characters match.
- For a longer slice, `dp[i][j]` is true when `s[i] == s[j]` and `dp[i+1][j-1]` is true. Fill by increasing length so the inner slice already exists.
- Track the `(i, j)` with the greatest `j - i` among the true cells.
- Time and the boolean table are Θ(n²). Expanding around each center finds the same answer in Θ(n²) time and Θ(1) extra memory; the DP table is the version that makes the dependency explicit.

**Examples:**

`s = "babad"`. Both `"bab"` and `"aba"` are palindromes of length 3, and nothing longer is. Either one is a correct answer.
</details>

<details>
<summary>Provide a Dynamic Programming solution for the edit distance problem.</summary>

### Provide a Dynamic Programming solution for the edit distance problem.

**Definition:**

</details>

<details>
<summary>Explain Dynamic Programming on strings with the example of word break problem.</summary>

### Explain Dynamic Programming on strings with the example of word break problem.

**Definition:**

</details>

### Sequence and Subsequence related Problems

<details>
<summary>Solve the Longest Increasing Subsequence problem using Dynamic Programming.</summary>

### Solve the Longest Increasing Subsequence problem using Dynamic Programming.

**Definition:**

</details>

<details>
<summary>Solve the Maximum Sum Increasing Subsequence problem with DP.</summary>

### Solve the Maximum Sum Increasing Subsequence problem with DP.

**Definition:**

</details>

<details>
<summary>Implement an algorithm for finding the number of subsequences with a given sum in an array.</summary>

### Implement an algorithm for finding the number of subsequences with a given sum in an array.

**Definition:**

</details>

### Partitioning Problems

<details>
<summary>Solve the partition problem using Dynamic Programming.</summary>

### Solve the partition problem using Dynamic Programming.

**Definition:**

</details>

<details>
<summary>Provide a Dynamic Programming solution for the subset sum problem.</summary>

### Provide a Dynamic Programming solution for the subset sum problem.

**Definition:**

</details>

<details>
<summary>Solve the Balanced Partition problem dynamically.</summary>

### Solve the Balanced Partition problem dynamically.

**Definition:**

</details>

### Path-finding Dynamic Programming Questions

<details>
<summary>Solve the unique paths problem in a grid with obstacles using DP.</summary>

### Solve the unique paths problem in a grid with obstacles using DP.

**Definition:**

</details>

<details>
<summary>Use Dynamic Programming to solve the minimum cost path problem in a grid.</summary>

### Use Dynamic Programming to solve the minimum cost path problem in a grid.

**Definition:**

</details>

<details>
<summary>Find the longest path in a matrix with given constraints.</summary>

### Find the longest path in a matrix with given constraints.

**Definition:**

</details>

### Advanced Dynamic Programming Problems

<details>
<summary>Solving the word wrap problem using DP.</summary>

### Solving the word wrap problem using DP.

**Definition:**

</details>

<details>
<summary>Implement an algorithm for the maximal square problem in a 2D binary matrix.</summary>

### Implement an algorithm for the maximal square problem in a 2D binary matrix.

**Definition:**

</details>

<details>
<summary>Apply Dynamic Programming to solve the maximum profit in job scheduling.</summary>

### Apply Dynamic Programming to solve the maximum profit in job scheduling.

**Definition:**

</details>

### Dynamic Programming in Graphs

<details>
<summary>How Dynamic Programming can be used for finding shortest paths in graphs (e.g., Floyd-Warshall algorithm)?</summary>

### How Dynamic Programming can be used for finding shortest paths in graphs (e.g., Floyd-Warshall algorithm)?

**Definition:**

</details>

<details>
<summary>How to use Dynamic Programming to find the number of ways to reach a given vertex in a directed acyclic graph?</summary>

### How to use Dynamic Programming to find the number of ways to reach a given vertex in a directed acyclic graph?

**Definition:**

</details>

### Game Theory and Dynamic Programming

<details>
<summary>Implement an algorithm to solve the Nim Game using Dynamic Programming.</summary>

### Implement an algorithm to solve the Nim Game using Dynamic Programming.

**Definition:**

</details>

<details>
<summary>Apply Dynamic Programming to solve the minimax problem in game theory.</summary>

### Apply Dynamic Programming to solve the minimax problem in game theory.

**Definition:**

</details>

### Stochastic Dynamic Programming Questions

<details>
<summary>Can Dynamic Programming be used to solve problems with probabilistic states? Provide an example.</summary>

### Can Dynamic Programming be used to solve problems with probabilistic states? Provide an example.

**Definition:**

</details>

<details>
<summary>How does Stochastic Dynamic Programming differ from deterministic Dynamic Programming, and what are its applications?</summary>

### How does Stochastic Dynamic Programming differ from deterministic Dynamic Programming, and what are its applications?

**Definition:**

</details>
