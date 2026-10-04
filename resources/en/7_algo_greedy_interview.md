# Greedy Algorithms — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./7_special_algorithms.md)

### Related docs

- [Greedy Algorithms — Interview](./7_algo_greedy_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Greedy Algorithms](https://devinterview.io/questions/data-structures-and-algorithms/greedy-algorithms-interview-questions/).

### Understanding Greedy Algorithms

<details>
<summary>What is a Greedy Algorithm?</summary>

### What is a Greedy Algorithm?

**Definition:**

A greedy algorithm builds an answer by taking, at each step, the option that looks best right now, and it does not go back to revise that choice.

**How it works:**

- The greedy-choice property is the hope that a locally best step can be extended to a globally best solution.
- Choices are irreversible. There is no backtracking over the options already taken.
- When the property holds, the algorithm is usually a sort plus a linear scan, which is why it is fast compared with a search of every subset.
- Fractional knapsack is the textbook win: take items in order of value per weight, and split only the last one that does not fit.
- Dijkstra’s algorithm is the graph example: always settle the unsettled vertex with the smallest tentative distance, and never reopen it when every weight is nonnegative.
- If a later step can regret an early choice, greedy is the wrong design. The 0/1 knapsack is the usual counterexample.

**Examples:**

Coins `1, 5, 10` to make 28: take two 10s, one 5, and three 1s. Taking the largest coin that still fits is optimal for this set.
</details>

<details>
<summary>What are Greedy Algorithms used for?</summary>

### What are Greedy Algorithms used for?

**Definition:**

Greedy methods are used on optimization problems where a sorted order makes the next safe choice obvious: shortest paths, spanning trees, codes, and schedules.

**How it works:**

- Dijkstra grows a shortest-path tree on nonnegative weights by settling the closest unsettled vertex.
- Kruskal sorts edges by weight and adds an edge when it connects two components. Prim grows one component by the cheapest edge that leaves it. Both build a minimum spanning tree.
- Huffman coding repeatedly merges the two least frequent symbols so frequent symbols end up with short codes.
- Interval scheduling sorts by finish time and takes the next interval that starts after the last chosen one, maximizing how many fit on one resource.
- The greedy set-cover heuristic repeatedly takes the set that covers the most still-uncovered elements. That is an approximation, not an exact optimum.
- Fractional knapsack, by value density, is exact. The 0/1 version is not a greedy problem.
- The same pattern shows up in filling a line of text and in cache eviction rules that always drop a locally “least useful” entry.

**Examples:**

Activities ending at times 3, 5, and 9, starting at 1, 4, and 6. Sort by finish and take the first and the third. The second overlaps the first.
</details>

<details>
<summary>List some characteristics that are often present in problems that are solvable by greedy algorithms.</summary>

### List some characteristics that are often present in problems that are solvable by greedy algorithms.

**Definition:**

A problem is a greedy candidate when a locally best step is safe to keep, and the rest of the problem is the same kind of problem without that step.

**How it works:**

- Optimal substructure: an optimal solution contains optimal solutions of the pieces left after the choice.
- Greedy-choice property: some locally best option is part of some optimal solution, so you do not have to try the other options.
- The choice is not undone. That is safe only because of the property above, not because irreversibility is a virtue by itself.
- Each input item is considered a constant number of times, often once after a sort, so the memory beyond the input stays small.
- The problem splits into a choice plus one smaller independent remainder, not into a table of overlapping subproblems.
- Classic fits: Dijkstra on nonnegative edges, Huffman coding, activity selection, and coin change for canonical denominations.
- A problem can have optimal substructure and still not be greedy. Edit distance has the substructure and needs the table, because no single local edit is always safe.

**Examples:**

Activity selection: the interval that finishes first is always safe to keep. After it is taken, the problem is the same problem on the intervals that start later.
</details>

<details>
<summary>What is the difference between Greedy and Heuristic algorithms?</summary>

### What is the difference between Greedy and Heuristic algorithms?

**Definition:**

A heuristic is any practical rule that aims at a good answer without a proof that the answer is best. A greedy algorithm is a specific rule: take the locally best feasible step and do not revisit it. Some greedy algorithms are exact. A heuristic does not promise that.

**How it works:**

- Greedy decides from the current state alone, usually after the input has been sorted by a fixed score.
- A heuristic can be a greedy score, a random sample, a cutoff in search, or a rule of thumb learned from data. The word is wider.
- Greedy does not backtrack. Some heuristics do, or they restart.
- When the greedy-choice property is proved, the result is optimal, not merely plausible. Fractional knapsack is that case.
- When it is not proved, the same style of step is only a heuristic. Nearest-neighbor for the traveling salesman is greedy and not optimal.
- Use “heuristic” for “we accept a good answer”. Use “greedy” for the one-step local rule, and say separately whether that rule is exact.

**Examples:**

Huffman coding is greedy and optimal for symbol-by-symbol prefix codes. A chess program that always captures the most valuable piece is a greedy heuristic and loses games a search would win.
</details>

<details>
<summary>Compare Greedy vs Divide & Conquer vs Dynamic Programming algorithms.</summary>

### Compare Greedy vs Divide & Conquer vs Dynamic Programming algorithms.

**Definition:**

Greedy commits to one option per step. Divide and conquer solves independent pieces and combines them. Dynamic programming solves overlapping pieces and stores the answers.

**How it works:**

- Optimality: a proved greedy choice is optimal and cheap. Divide and conquer is optimal when the combine step preserves the answers of the pieces, as in merge sort. DP is optimal when the recurrence enumerates the safe choices and keeps the best.
- Time: greedy is often a sort, Θ(n log n), plus a scan. Divide and conquer follows a recurrence such as `T(n) = 2T(n/2) + Θ(n)`. DP is states times work per state, and it can be heavier because it keeps the losers as well as the winner.
- Memory: greedy usually stores the answer being built. Divide and conquer stores the recursion stack and sometimes a buffer. DP stores a table.
- Greedy examples: Dijkstra, Huffman, interval scheduling.
- Divide and conquer examples: merge sort, binary search, and Karatsuba or Strassen when the pieces are independent.
- DP examples: edit distance, 0/1 knapsack, Floyd-Warshall, and minimax over an explicit game tree when states repeat.
- A problem with overlapping subproblems is a poor fit for plain divide and conquer, because the pieces are recomputed. A problem with no safe local choice is a poor fit for greedy.

**Examples:**

Coin change with denominations `1, 5, 10` is greedy. The same problem with denominations `1, 3, 4` needs DP, because taking the largest coin is not always best.
</details>

<details>
<summary>Is Dijkstra’s algorithm a Greedy or Dynamic Programming algorithm?</summary>

### Is Dijkstra’s algorithm a Greedy or Dynamic Programming algorithm?

**Definition:**

Dijkstra’s algorithm is greedy. It always settles the unsettled vertex with the smallest tentative distance, and with nonnegative weights that choice is never revised.

**How it works:**

- The local rule is the priority queue: extract-min, then relax the outgoing edges.
- Optimal substructure is why the choice is safe. A shortest path to `u` plus a nonnegative edge is a shortest path to the neighbor once `u` is the closest unsettled vertex. Prefixes of a shortest path are themselves shortest.
- That substructure is something Dijkstra shares with dynamic programming. The algorithm does not fill a table of every subproblem the way Floyd-Warshall does, and it does not try alternative previous vertices after a vertex is settled.
- Bellman-Ford is the relaxation algorithm that does allow later improvements, which is why it can handle negative edges. Calling Dijkstra “dynamic programming” because of the substructure blurs that difference.
- The usual bound with a binary heap is Θ((V + E) log V).

**Examples:**

From `S`, edges `S→A` weight 1 and `S→B` weight 4 and `A→B` weight 1. Dijkstra settles `A` first, then relaxes `A→B` to 2, and never reopens `A`. The final distance to `B` is 2.
</details>

<details>
<summary>Is there a way to Mathematically Prove that a Greedy Algorithm will yield the Optimal Solution?</summary>

### Is there a way to Mathematically Prove that a Greedy Algorithm will yield the Optimal Solution?

**Definition:**

Yes, when you can prove a greedy-choice property and optimal substructure. For some problems the same proof is the statement that the feasible sets form a matroid.

**How it works:**

- Greedy choice: show that if an optimal solution disagrees with the first greedy pick, you can swap that pick in and stay optimal.
- Optimal substructure: after the pick, the remainder of that optimal solution is optimal for the smaller instance.
- Induction then says the whole sequence of picks is optimal.
- A matroid packages those two facts. The family of allowed sets is hereditary (a subset of an allowed set is allowed) and has the exchange property (a smaller allowed set can take some element from a larger one and stay allowed). The greedy algorithm that adds the best eligible element is then optimal. Graphic matroids are why Kruskal works.
- Fractional knapsack has a direct exchange proof and is not usually presented as a matroid. 0/1 knapsack does not have the exchange property: you cannot always swap the density leader in without breaking feasibility or optimality.

**Examples:**

If an optimal activity set skips the interval that finishes first, replace its first activity with that interval. The replacement still fits, and the count does not fall. That swap is the greedy-choice proof.
</details>

<details>
<summary>Explain the Greedy Choice Property and its significance in greedy algorithms.</summary>

### Explain the Greedy Choice Property and its significance in greedy algorithms.

**Definition:**

The greedy-choice property says that a locally best option is part of some globally optimal solution. It is what lets the algorithm commit without searching the other branches.

**How it works:**

- The step uses only information available now: the cheapest edge that does not close a cycle, the interval that ends soonest, the symbol pair with the smallest frequencies.
- It does not look at how later steps will score. The proof, done separately, shows that some optimum contains this step.
- Without the property, the same local rule can miss the optimum. That is a limitation of the problem, not a reason to add backtracking and still call it greedy.
- Problems that have the property include minimum spanning trees, Dijkstra on nonnegative weights, Huffman coding, fractional knapsack, and activity selection.
- Cache policies such as “evict the least recently used” are greedy rules aimed at a good hit rate. They do not have this property for every request sequence.

**Examples:**

Children buying candy with a shared goal of “most pieces” should not each spend their coins on the single nicest piece. Activity selection does have the property: the earliest finish leaves the most room for everyone else.
</details>

### Greedy Algorithm Design

<details>
<summary>Design a greedy algorithm for making change using the fewest coins possible.</summary>

### Design a greedy algorithm for making change using the fewest coins possible.

**Definition:**

For canonical coin systems, repeatedly take the largest denomination that does not exceed the remaining amount. US coins and powers of a base work. Arbitrary denominations do not.

**How it works:**

- Sort the denominations descending once.
- While the remainder is positive, take the largest coin that fits, subtract it, and count it.
- With a canonical system this matches the optimum. The proof is an exchange: an optimum that uses enough smaller coins to replace a larger one can swap in the larger coin and not use more coins.
- Time is Θ(number of denominations + number of coins paid) after the sort, which is fine when the smallest coin is 1. It is not Θ(amount) unless you subtract one unit at a time.
- If the denominations are `1, 3, 4` and the amount is 6, two 3s beat a 4 plus two 1s. The greedy pick of 4 is wrong. Use the DP coin-change table for a non-canonical set.
- If no coin equals 1 and some remainder cannot be made, the loop must stop and report failure instead of spinning.

**Examples:**

```text
for coin in denominations_desc:
  take = remainder // coin
  remainder -= take * coin
  count += take
```

Amount 30 with `25, 10, 1` yields one quarter and five cents, six coins, which is optimal for those denominations.
</details>

<details>
<summary>Describe a greedy strategy for scheduling events that use the fewest number of resources.</summary>

### Describe a greedy strategy for scheduling events that use the fewest number of resources.

**Definition:**

The fewest resources equal the deepest overlap: the maximum number of events that are running at the same instant. A sweep finds that depth.

**How it works:**

- Sort the events by start time.
- Walk a min-heap of end times of the events already given a resource. Before placing the next event, pop every end time that is no later than this start. Those resources are free.
- If the heap is empty, this event needs a new resource. Otherwise reuse the resource whose event ended first, and push this event’s end time.
- The maximum size the heap reaches is the number of resources. Each event is assigned the resource you just reused or created.
- Sorting is Θ(n log n), and each event is pushed and popped once, so the total is Θ(n log n).
- Sorting by finish time and taking a non-overlapping subset solves a different problem: the most events one resource can host. It does not compute how many resources a set of overlapping events needs.

**Examples:**

Meetings `[0, 30), [5, 10), [15, 20)`. The second starts during the first, so the depth is 2. The third can reuse the resource freed at time 10. Two rooms are necessary and enough.
</details>

<details>
<summary>Explain how to apply a greedy approach to minimize the total waiting time for a given set of queries.</summary>

### Explain how to apply a greedy approach to minimize the total waiting time for a given set of queries.

**Definition:**

Schedule the shortest query first. Each query’s waiting time is the sum of the durations placed ahead of it, so a long job early in line makes everyone behind it pay.

**How it works:**

- Sort the durations ascending.
- The waiting time of the job in position `i` (0-based) is the sum of the durations before it. The total waiting time is the sum of those prefix sums.
- Equivalently, a job of length `d` that has `k` jobs after it contributes `d` to each of those `k` waits, so it is counted `k` times. Putting large `d` late makes `k` small.
- Sorting is Θ(n log n). The prefix sum is Θ(n).
- This minimizes the sum of waiting times, or the sum of completion times, for a single processor with no release dates and no deadlines. Deadlines or priorities change the rule.
- Shortest-job-first is not fair. A long job can be postponed forever if short jobs keep arriving. The optimality claim is about a fixed batch.

**Examples:**

Durations `5, 1, 3`. Order `1, 3, 5`. Waits are `0`, `1`, and `1+3 = 4`, total 5. Order `5, 3, 1` waits `0 + 5 + 8 = 13`.
</details>

<details>
<summary>Develop a greedy algorithm for the activity selection problem to maximize the number of activities.</summary>

### Develop a greedy algorithm for the activity selection problem to maximize the number of activities.

**Definition:**

Sort activities by finish time and repeatedly take the next one that starts at or after the previous finish. That set is a largest set of non-overlapping activities.

**How it works:**

- An activity is a half-open interval `[start, finish)`.
- Sort by `finish` ascending. The earliest finish is always a safe first pick: any optimal set can swap its first activity for this one.
- Scan the rest. Take an activity when its start is at least the finish of the last taken activity. Skip it otherwise.
- Sorting is Θ(n log n). The scan is Θ(n). Extra memory is the output list.
- Sorting by start time, or by duration, does not have the same proof. A long activity that starts first can block several short ones.
- This maximizes the count on one resource. It does not maximize total duration, and it does not assign many resources.

**Examples:**

```text
sort by finish
last = -infinity
for activity in activities:
  if activity.start >= last:
    take(activity)
    last = activity.finish
```

Intervals finishing at 3, 5, 9 and starting at 1, 2, 6 yield the first and the third.
</details>

### Correctness and Optimization

<details>
<summary>How can you establish the correctness of a greedy algorithm?</summary>

### How can you establish the correctness of a greedy algorithm?

**Definition:**

Show that the first local choice can replace whatever an optimal solution did instead, and that the leftover problem is solved by the same argument.

**How it works:**

- Exchange: take an optimal solution that differs from the greedy pick. Swap the greedy element in. Show feasibility and that the objective does not get worse. Activity selection swaps the earliest-finishing interval into the first slot.
- For a minimum spanning tree the swapped object is a safe edge: the lightest edge across some cut is in some MST. Kruskal and Prim only add safe edges.
- After the exchange, delete that choice and repeat on the smaller instance. Induction covers the whole sequence.
- A matroid is a packaged version of the same two lemmas. If you cannot find the exchange, do not claim optimality. Measure the algorithm as a heuristic instead.
- “It worked on the sample” is not the argument. One counterexample, such as coins `1, 3, 4` for amount 6, kills a general claim.

**Examples:**

Prim grows a tree `T`. The lightest edge with one end in `T` is safe. If an MST uses another edge across that cut, swap. The weight does not rise, and `T` stays acyclic.
</details>

<details>
<summary>What is the role of sorting in many greedy algorithms, and why is it often necessary?</summary>

### What is the role of sorting in many greedy algorithms, and why is it often necessary?

**Definition:**

Sorting turns “the best remaining item” into “the next item in this order”, so the scan can commit in one pass.

**How it works:**

- Activity selection needs finish order. Kruskal needs weight order. Fractional knapsack needs value-per-weight order. Shortest-job-first needs duration order.
- Without that order, finding the best eligible item at every step can cost a linear scan each time, or it can pick an item that is not safe.
- The sort is usually done once, up front. Some algorithms sort only a frontier, which is what a heap does inside Dijkstra and Prim.
- If the input arrives already ordered, the sort is free and the scan is the whole algorithm.
- Sorting does not create the greedy-choice property. It only exposes an order in which a property you have already proved can be applied.
- The Θ(n log n) sort is often the dominant term. The later scan is linear.

**Examples:**

Fractional knapsack items `(value, weight)` `(60, 10)`, `(100, 20)`, `(120, 30)`. Densities are `6`, `5`, and `4`. Take them in that order. Capacity 50 takes all of the first two and `20/30` of the third.
</details>

<details>
<summary>Can greedy algorithms be used to solve optimization problems? Give an example.</summary>

### Can greedy algorithms be used to solve optimization problems? Give an example.

**Definition:**

Yes, when a locally best step is proved to belong to an optimal solution. Activity selection is the clean example: maximize the number of non-overlapping intervals.

**How it works:**

- Sort by finishing time. Take the first interval. Then take the next interval that starts after that finish, and repeat.
- The objective is the count, not the total length. The constraint is that chosen intervals do not overlap.
- The exchange proof says an optimal schedule can be rewritten to start with the greedy interval without lowering the count.
- Time is Θ(n log n) from the sort, then Θ(n) to scan. The output list is Θ(n) in the worst case, when nothing overlaps.
- Greedy is not a general optimizer. The same intervals, if the goal is maximum total length, can prefer one long interval over two short ones that the earliest-finish rule would take. State the objective before you claim the algorithm solves “the” optimization problem.

**Examples:**

Intervals `[1, 4), [3, 5), [0, 6), [5, 7), [8, 9)`. Earliest finish takes `[1, 4)`, then `[5, 7)`, then `[8, 9)`. Three intervals. The long `[0, 6)` is correctly skipped.
</details>

### Greedy Algorithm Challenges

<details>
<summary>Solve the fractional knapsack problem using a greedy method.</summary>

### Solve the fractional knapsack problem using a greedy method.

**Definition:**

</details>

<details>
<summary>Implement a greedy algorithm to arrange a group of intervals by their start times to minimize the number of rooms needed.</summary>

### Implement a greedy algorithm to arrange a group of intervals by their start times to minimize the number of rooms needed.

**Definition:**

</details>

<details>
<summary>Design a method using greedy algorithms for minimizing the total number of platforms needed at a railway station.</summary>

### Design a method using greedy algorithms for minimizing the total number of platforms needed at a railway station.

**Definition:**

</details>

### Comparison and Analysis

<details>
<summary>Discuss situations where a greedy algorithm might not produce the optimal solution.</summary>

### Discuss situations where a greedy algorithm might not produce the optimal solution.

**Definition:**

</details>

<details>
<summary>Compare the efficiency of a greedy algorithm to a brute force approach for the traveling salesman problem.</summary>

### Compare the efficiency of a greedy algorithm to a brute force approach for the traveling salesman problem.

**Definition:**

</details>

<details>
<summary>What is the Huffman Coding algorithm, and is it considered a greedy algorithm?</summary>

### What is the Huffman Coding algorithm, and is it considered a greedy algorithm?

**Definition:**

</details>

### Real-World Applications

<details>
<summary>How do greedy algorithms apply to network routing protocols?</summary>

### How do greedy algorithms apply to network routing protocols?

**Definition:**

</details>

<details>
<summary>Explain how greedy algorithms can be used in load balancing and task scheduling in distributed systems.</summary>

### Explain how greedy algorithms can be used in load balancing and task scheduling in distributed systems.

**Definition:**

</details>

<details>
<summary>Describe an application of greedy algorithms in financial portfolio optimization.</summary>

### Describe an application of greedy algorithms in financial portfolio optimization.

**Definition:**

</details>

### Greedy Algorithm Techniques and Methods

<details>
<summary>Discuss the primality of cuts and how it pertains to greedy algorithms.</summary>

### Discuss the primality of cuts and how it pertains to greedy algorithms.

**Definition:**

</details>

<details>
<summary>Describe the ‘local ratio’ technique and its application to greedy algorithms.</summary>

### Describe the ‘local ratio’ technique and its application to greedy algorithms.

**Definition:**

</details>

<details>
<summary>What is the ‘exchange argument’ in the context of analyzing greedy algorithms?</summary>

### What is the ‘exchange argument’ in the context of analyzing greedy algorithms?

**Definition:**

</details>

### Limitations and Failures

<details>
<summary>Provide an example where a greedy algorithm fails to achieve the global optimum.</summary>

### Provide an example where a greedy algorithm fails to achieve the global optimum.

**Definition:**

</details>

<details>
<summary>Explain why greedy algorithms can be ineffective for the coin change problem with non-standard denominations.</summary>

### Explain why greedy algorithms can be ineffective for the coin change problem with non-standard denominations.

**Definition:**

</details>

<details>
<summary>Discuss the limitations of greedy algorithms when applied to graph coloring problems.</summary>

### Discuss the limitations of greedy algorithms when applied to graph coloring problems.

**Definition:**

</details>

### Optimization Problems

<details>
<summary>Solve the problem of finding the largest number possible from a list of numbers using a greedy approach.</summary>

### Solve the problem of finding the largest number possible from a list of numbers using a greedy approach.

**Definition:**

</details>

<details>
<summary>Implement a greedy solution for the job sequencing problem with deadlines to maximize profit.</summary>

### Implement a greedy solution for the job sequencing problem with deadlines to maximize profit.

**Definition:**

</details>

<details>
<summary>Use greedy algorithm to solve the ‘Minimum Number of Arrows to Burst Balloons’ problem.</summary>

### Use greedy algorithm to solve the ‘Minimum Number of Arrows to Burst Balloons’ problem.

**Definition:**

</details>

### Complex Greedy Strategy Implementations

<details>
<summary>How would you optimize a network’s bandwidth allocation using a greedy strategy?</summary>

### How would you optimize a network’s bandwidth allocation using a greedy strategy?

**Definition:**

</details>

<details>
<summary>Write a greedy solution for compressing data using a variable-length encoding scheme.</summary>

### Write a greedy solution for compressing data using a variable-length encoding scheme.

**Definition:**

</details>

<details>
<summary>Implement a greedy strategy to construct the minimum spanning tree of a graph.</summary>

### Implement a greedy strategy to construct the minimum spanning tree of a graph.

**Definition:**

</details>

### Advanced Theoretical Concepts

<details>
<summary>What is a matroid, and how do greedy algorithms relate to matroid theory?</summary>

### What is a matroid, and how do greedy algorithms relate to matroid theory?

**Definition:**

</details>

<details>
<summary>Explain the relationship between greedy algorithms and the concept of safe moves.</summary>

### Explain the relationship between greedy algorithms and the concept of safe moves.

**Definition:**

</details>

<details>
<summary>Discuss how approximation algorithms use greedy strategies to find near-optimal solutions.</summary>

### Discuss how approximation algorithms use greedy strategies to find near-optimal solutions.

**Definition:**

</details>

### Greedy Algorithms in Competitive Programming

<details>
<summary>Design a greedy algorithm to solve the ‘Gas Station’ problem commonly seen in competitive programming contests.</summary>

### Design a greedy algorithm to solve the ‘Gas Station’ problem commonly seen in competitive programming contests.

**Definition:**

</details>

<details>
<summary>Solve the ‘Majority Element’ problem under the constraints of using a single pass algorithm and constant additional space.</summary>

### Solve the ‘Majority Element’ problem under the constraints of using a single pass algorithm and constant additional space.

**Definition:**

</details>
