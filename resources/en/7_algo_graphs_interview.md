# Graph Theory — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./7_special_algorithms.md)

### Related docs

- [Graph Theory — Interview](./7_algo_graphs_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Graph Theory](https://devinterview.io/questions/data-structures-and-algorithms/graph-data-structure-interview-questions/).

### Introduction to Graphs

<details>
<summary>What is a Graph?</summary>

### What is a Graph?

**Definition:**

A graph is a set of vertices plus a set of edges that connect pairs of those vertices. It records relationships, not a hierarchy.

**How it works:**

- A vertex (node) holds an identity and sometimes a payload. An edge connects two vertices. A directed edge is an ordered pair; an undirected edge is an unordered pair.
- A self-loop connects a vertex to itself. A multigraph allows more than one edge between the same pair. A simple graph allows neither.
- Three stored forms are common. An adjacency matrix is a V by V table of edge presence or weight. An adjacency list stores, for each vertex, the vertices it points to. An edge list stores the pairs themselves.
- The matrix answers “is there an edge?” in O(1) and costs Θ(V²) memory. The list costs Θ(V + E) and is the default for sparse graphs. The edge list is the natural input to algorithms that sort edges, such as Kruskal.

**Examples:**

Vertices `{A, B, C}` and undirected edges `{A-B, B-C}` are a path of length 2. There is no edge `A-C`.
</details>

<details>
<summary>What are some common Types and Categories of Graphs?</summary>

### What are some common Types and Categories of Graphs?

**Definition:**

The same vertices can be classified by direction, weights, cycles, density, connectivity, and whether duplicate edges are allowed.

**How it works:**

- Undirected: an edge `{u, v}` can be walked either way. Directed: an edge `(u, v)` does not imply `(v, u)`.
- Weighted: each edge has a cost. Unweighted: every edge is treated as cost 1, so path length is the number of edges.
- Cyclic: some walk returns to its start without repeating an edge, or, in the usual definition, a closed walk with no repeated vertex except the start. Acyclic: no such closed walk. A directed acyclic graph is the setting for topological order.
- Dense: E is close to the maximum, Θ(V²) for a simple undirected graph. Sparse: E is much closer to V.
- Connected: every vertex can reach every other vertex. Disconnected: two or more pieces. For a digraph the matching notions are weak connectivity (ignore direction) and strong connectivity (respect it).
- A multigraph allows parallel edges. A simple graph does not, and it usually forbids loops.

**Examples:**

A city street map with one-way roads is a directed, weighted, sparse graph. A tournament in which every pair played once is dense and directed.
</details>

<details>
<summary>What is the difference between a Tree and a Graph?</summary>

### What is the difference between a Tree and a Graph?

**Definition:**

A tree is a special undirected graph: connected, with no cycles, and therefore exactly `V − 1` edges. A general graph may be disconnected, cyclic, or directed.

**How it works:**

- A graph is vertices plus edges. Edges may be directed, parallel, or loops, and the graph may have several components.
- A free tree has a unique simple path between every pair of vertices. It has no root until you pick one.
- A rooted tree adds a root and orients every edge from parent to child. Every node except the root has one parent, and there is no cycle.
- Graphs are about arbitrary relationships. Rooted trees are about a hierarchy under one root.
- Losing the “no cycle” or “connected” rule puts you back in general graphs. Adding either a cycle or a second path between two nodes means the structure is no longer a tree.

**Examples:**

A company org chart is a rooted tree. A road network with two routes between the same cities is a graph and not a tree, because those routes form a cycle.
</details>

<details>
<summary>How can you determine the Minimum number of edges for a graph to remain connected?</summary>

### How can you determine the Minimum number of edges for a graph to remain connected?

**Definition:**

A simple undirected graph on `n` vertices is connected only if it has at least `n − 1` edges. That minimum is achieved exactly by the trees.

**How it works:**

- Start with `n` isolated vertices, which have `n` components. Each new edge that joins two different components reduces the component count by one.
- After `n − 1` such edges one component remains, and there is still no cycle. That graph is a tree, and it is connected.
- Fewer than `n − 1` edges cannot bring `n` vertices into one component. More edges are allowed; they add cycles and the graph stays connected.
- This is not the same number as edge connectivity. Edge connectivity is how many edges you must delete to disconnect a graph that is already connected, and it is at most the smallest degree. A tree has `n − 1` edges and edge connectivity 1.
- For a weakly connected digraph the same counting lower bound is `n − 1` directed edges. Strong connectivity needs more structure than that count alone.

**Examples:**

Four cities need at least three roads to be one connected network: a path or a star. Two roads always leave at least one city out or split the map.
</details>

<details>
<summary>Define Euler Path and Euler Circuit in the context of graph theory.</summary>

### Define Euler Path and Euler Circuit in the context of graph theory.

**Definition:**

An Euler path walks every edge exactly once. An Euler circuit is an Euler path that returns to its start. Vertices may be repeated; that is what separates this from a Hamiltonian path, which visits each vertex once.

**How it works:**

- Degree is the number of incident edges. In a directed graph, compare in-degree with out-degree.
- A connected undirected graph has an Euler circuit if and only if every vertex has even degree.
- It has an Euler path that is not closed if and only if exactly two vertices have odd degree. The path must start at one odd vertex and end at the other.
- Every edge has to be reachable from the start, so the edges must lie in a single connected component. Isolated vertices do not matter.
- The circuit is closed: the start and the end are the same vertex. The path is open when the two odd-degree endpoints differ.
- Hierholzer’s algorithm builds the walk by stitching cycles. It runs in time linear in the number of edges.

**Examples:**

A square has four even degrees and an Euler circuit: walk the perimeter. A path of three edges has two odd endpoints and an Euler path, and no circuit.
</details>

### Graph Representations

<details>
<summary>Compare Adjacency Lists and Adjacency Matrices for graph representation.</summary>

### Compare Adjacency Lists and Adjacency Matrices for graph representation.

**Definition:**

An adjacency matrix spends Θ(V²) memory and answers edge queries in O(1). An adjacency list spends Θ(V + E) and is faster to scan when the graph is sparse.

**How it works:**

- Space: the matrix is V by V even when most entries are zero. The list stores each vertex once and each edge once (twice in an undirected graph if you store both directions).
- Edge lookup: the matrix reads one cell, O(1). The list scans the neighbors of one endpoint, O(degree).
- Full traversal: the matrix looks at every cell, Θ(V²). The list visits each vertex and each stored edge, Θ(V + E).
- Add or remove an edge: the matrix writes one cell, O(1). The list edits a neighbor sequence, O(degree) unless the neighbors live in a hash set.
- Add a vertex: the matrix must grow by a row and a column, Θ(V²) if it is copied. The list appends an empty neighbor collection, amortized O(1).
- Use the matrix for dense graphs and for Floyd-Warshall. Use the list for BFS, DFS, and Dijkstra on sparse graphs.

**Examples:**

A social graph of a million users with a few hundred friends each cannot store a million-by-million matrix. A list of friend ids fits. A 200-vertex distance table fits in a matrix and makes “is there an edge?” a single read.
</details>

<details>
<summary>What is an Incidence Matrix, and when would you use it?</summary>

### What is an Incidence Matrix, and when would you use it?

**Definition:**

An incidence matrix has a row per vertex and a column per edge. Each column marks the one or two vertices that the edge touches.

**How it works:**

- Undirected graph: a column has 1 in the two endpoints, or a single 2 or 1 for a loop, depending on the convention. A directed graph often uses `+1` at the head and `−1` at the tail, so each column sums to 0.
- Size is Θ(V · E), which is larger than an adjacency list. It is the wrong default for traversal.
- It is the right object when the algorithm is about edges as unknowns: network flows, cycle space, and cuts are linear algebra on this matrix.
- Graph comparison and some database layouts store the matrix when both the vertex set and the edge set are small and you want columns to be edges.
- Line graphs and other transformations that promote edges to vertices read this incidence relation directly.

**Examples:**

Directed edge `A → B` is a column with `−1` at `A` and `+1` at `B`. Two parallel edges are two columns with the same pattern, which an adjacency matrix would collapse into one cell unless it stores a count.
</details>

<details>
<summary>Discuss Edge List as a graph representation and its use cases.</summary>

### Discuss Edge List as a graph representation and its use cases.

**Definition:**

An edge list is an array of pairs `(u, v)`, plus a weight if the graph is weighted. It stores edges and almost nothing about vertices that have degree zero.

**How it works:**

- Directed and undirected graphs use the same shape. For an undirected graph you either store one unordered pair or you agree to store both orders.
- Duplicate pairs mean a multigraph. A set of pairs means a simple graph.
- “Is `u` adjacent to `v`?” is a scan, Θ(E), unless you also build an index. Neighbor iteration is the same scan.
- The form is the input to Kruskal: sort the pairs by weight and add an edge when it joins two components.
- It is compact to ship over the network and easy to append. It is a poor structure for BFS, which wants the neighbors of one vertex without rereading every edge.
- Isolated vertices are invisible unless you store the vertex count separately.

**Examples:**

```text
edges = [(0, 1, 4), (0, 2, 1), (2, 1, 2)]  # u, v, weight
```

Sort by the third field and Kruskal considers `(0, 2)`, then `(2, 1)`, then `(0, 1)`.
</details>

<details>
<summary>Explain how to save space while storing a graph using Compressed Sparse Row (CSR).</summary>

### Explain how to save space while storing a graph using Compressed Sparse Row (CSR).

**Definition:**

Compressed sparse row stores a sparse graph’s adjacency lists in two flat arrays, so neighbor scans stay sequential and the per-edge pointer overhead disappears.

**How it works:**

- `indices` (sometimes called the column array) concatenates every neighbor list. Its length is the number of stored arcs.
- `offsets` has length `V + 1`. Neighbors of vertex `v` occupy `indices[offsets[v] : offsets[v+1]]`.
- An optional `data` array of the same length as `indices` holds the edge weight.
- Space is Θ(V + E) with a small constant: integers, not pointers to heap nodes. A linked adjacency list pays a pointer per edge.
- Building CSR wants the edges grouped by source. Inserting one edge in the middle is a shift, so CSR is for a graph you build once and then traverse.
- Matrix libraries use the same layout for a sparse matrix. A graph algorithm reads it as “row = vertex”.

**Examples:**

```text
vertices 0, 1, 2 with neighbors [1, 2], [2], []
offsets = [0, 2, 3, 3]
indices = [1, 2, 2]
```

Neighbors of vertex 1 are `indices[2:3]`, which is `[2]`.
</details>

### Graph Traversal Algorithms

<details>
<summary>Explain the Breadth-First Search (BFS) traversing method.</summary>

### Explain the Breadth-First Search (BFS) traversing method.

**Definition:**

Breadth-first search visits vertices in order of distance from the source, one edge-layer at a time. A queue holds the frontier.

**How it works:**

- Mark the source visited and enqueue it.
- While the queue is not empty, dequeue `u`, then enqueue every unvisited neighbor of `u` and mark it visited when it is enqueued, not when it is dequeued. Marking on enqueue stops the same vertex from being queued twice.
- The first time a vertex is reached, the path that reached it is a shortest path in an unweighted graph.
- With an adjacency list the time is Θ(V + E). The queue holds O(V) vertices in the worst case, one wide level.
- BFS does not by itself handle weights. Nonnegative weights need Dijkstra. A weight of 1 on every edge is exactly BFS.

**Examples:**

```text
queue = [source]; seen = {source}
while queue:
  u = queue.pop(0)
  for v in neighbors(u):
    if v not in seen:
      seen.add(v); parent[v] = u; queue.append(v)
```

On a binary tree this visits the root, then both children, then the grandchildren.
</details>

<details>
<summary>Explain the Depth-First Search (DFS) algorithm.</summary>

### Explain the Depth-First Search (DFS) algorithm.

**Definition:**

Depth-first search follows one neighbor as far as it can, then backtracks and tries the next neighbor. The frontier is a stack, or the call stack of a recursive function.

**How it works:**

- Mark the start visited. For each unvisited neighbor, recurse, or push it.
- The iterative form pops a vertex and pushes its unvisited neighbors. Visit order depends on whether you mark a vertex when it is pushed or when it is popped; mark on push if you want each vertex processed once.
- When the stack is empty, every vertex reachable from the start has been seen. Other components need another start.
- Time is Θ(V + E) with an adjacency list. The stack is O(V) in the worst case, a long path, and O(log V) on a balanced tree.
- DFS is the tool for cycle detection, topological order, and strongly connected components. It does not give shortest paths.

**Examples:**

```text
def dfs(u):
  seen.add(u)
  for v in neighbors(u):
    if v not in seen:
      dfs(v)
```

From `A` with neighbors `B` then `C`, and `B` leading to `D`, the first descent visits `A, B, D` before `C`.
</details>

<details>
<summary>What are the key differences between BFS and DFS?</summary>

### What are the key differences between BFS and DFS?

**Definition:**

BFS expands layer by layer and uses a queue. DFS goes down one branch and uses a stack. On an unweighted graph only BFS yields shortest paths.

**How it works:**

- Strategy: BFS finishes every vertex at distance `d` before distance `d + 1`. DFS finishes a descendant before the next sibling.
- Memory: BFS may hold an entire level, Θ(V) in a wide graph. DFS holds the current path, Θ(V) on a long path and much less on a bushy shallow graph.
- Shortest paths: in an unweighted graph the BFS tree is a shortest-path tree. The DFS tree is not.
- Use BFS for minimum hops and for bipartite coloring by layers. Use DFS for cycles, topological sort, and connected components when the path length does not matter.
- Both are Θ(V + E) time with adjacency lists. The choice is the order and the auxiliary structure, not the asymptotic scan of the graph.

**Examples:**

In a maze where each step has cost 1, BFS finds the exit in the fewest steps. DFS can wander down a long dead end first and still visit every cell.
</details>

<details>
<summary>Implement a method to check if there is a Path between two vertices in a graph.</summary>

### Implement a method to check if there is a Path between two vertices in a graph.

**Definition:**

A path exists when a traversal that starts at the source reaches the target. DFS and BFS both answer the question; neither needs to list every path.

**How it works:**

- Mark vertices as seen so a cycle cannot loop forever.
- DFS: from the current vertex, if it is the target return true. Otherwise recurse on each unseen neighbor. If every branch fails, return false.
- BFS does the same with a queue and can stop at the first time the target is dequeued. That also gives a minimum-hop path if you stored parents.
- With an adjacency list the search is Θ(V + E) time and Θ(V) memory for the seen set and the stack or queue.
- In a disconnected graph, failing to reach the target only says the target is not in the source’s component.

**Examples:**

```text
def reaches(u, target):
  if u == target: return True
  seen.add(u)
  return any(v not in seen and reaches(v, target) for v in neighbors(u))
```
</details>

<details>
<summary>Solve the problem of printing all Paths from a source to destination in a Directed Graph with BFS or DFS.</summary>

### Solve the problem of printing all Paths from a source to destination in a Directed Graph with BFS or DFS.

**Definition:**

Listing every source-to-target path is a DFS that carries the path built so far and backtracks. The number of paths can be exponential, so the time is not Θ(V + E) once you write them all out.

**How it works:**

- Recurse with the current vertex and the path from the source. If the current vertex is the target, emit a copy of the path.
- Otherwise append each unused neighbor and recurse, then remove it. That pop is the backtrack.
- A seen set along the current path stops cycles from producing infinite walks. A vertex may still appear on a different path later, so the mark is removed on the way back. A global “visited forever” set would drop later paths.
- BFS can store whole paths in the queue. That also lists them, and it uses more memory because many partial paths sit in the queue at once.
- Time and output size follow the number of simple paths, which can be exponential in V. Space is Θ(V) for one DFS path, plus whatever you store for the answers.

**Examples:**

```text
def walk(u, path):
  if u == target:
    emit(path); return
  for v in neighbors(u):
    if v not in path:
      path.append(v); walk(v, path); path.pop()
```
</details>

### Graph Properties and Types

<details>
<summary>What is a Bipartite Graph? How to detect one?</summary>

### What is a Bipartite Graph? How to detect one?

**Definition:**

A graph is bipartite when its vertices split into two sets with every edge running between the sets and none inside a set. Equivalently, it has no odd cycle.

**How it works:**

- Color the source red and try to color every neighbor blue, then their neighbors red. If a vertex is ever asked to take both colors, the graph is not bipartite.
- BFS does this layer by layer. DFS does it along the recursion. Either is a 2-coloring.
- Run the coloring once per connected component. A component that was never reached is not evidence either way.
- An odd cycle forces two adjacent vertices onto the same color. An even cycle 2-colors cleanly.
- With an adjacency list the check is Θ(V + E) time and Θ(V) memory for colors and the frontier.

**Examples:**

A square is bipartite: opposite corners share a color. A triangle is not: the third edge joins two vertices that the first two edges already forced onto different sides and then closes on one side.
</details>

<details>
<summary>Define Cyclic and Acyclic graphs and explain how to identify them.</summary>

### Define Cyclic and Acyclic graphs and explain how to identify them.

**Definition:**

</details>

<details>
<summary>Explain Planar graphs and the conditions that make a graph planar.</summary>

### Explain Planar graphs and the conditions that make a graph planar.

**Definition:**

</details>

<details>
<summary>What are Dense and Sparse graphs? Discuss their density measures and typical use cases.</summary>

### What are Dense and Sparse graphs? Discuss their density measures and typical use cases.

**Definition:**

</details>

### Graph Algorithms and Complexity

<details>
<summary>Why the complexity of DFS is O(V+E)?</summary>

### Why the complexity of DFS is O(V+E)?

**Definition:**

</details>

<details>
<summary>Provide an implementation for Topological Sort in a Directed Acyclic Graph (DAG).</summary>

### Provide an implementation for Topological Sort in a Directed Acyclic Graph (DAG).

**Definition:**

</details>

<details>
<summary>Write an algorithm to detect a Cycle in an undirected graph.</summary>

### Write an algorithm to detect a Cycle in an undirected graph.

**Definition:**

</details>

<details>
<summary>Discuss the complexity of finding All Pair Shortest Paths in a weighted graph.</summary>

### Discuss the complexity of finding All Pair Shortest Paths in a weighted graph.

**Definition:**

</details>

### Memory and Performance in Graph Operations

<details>
<summary>Why does Breadth-First Search use more memory than Depth-First Search?</summary>

### Why does Breadth-First Search use more memory than Depth-First Search?

**Definition:**

</details>

<details>
<summary>Illustrate the difference in Peak Memory Consumption between DFS and BFS.</summary>

### Illustrate the difference in Peak Memory Consumption between DFS and BFS.

**Definition:**

</details>

<details>
<summary>How can Graph Data Structures be optimized for better Cache Locality?</summary>

### How can Graph Data Structures be optimized for better Cache Locality?

**Definition:**

</details>

<details>
<summary>Discuss methods to Reduce Memory Usage in graph representations.</summary>

### Discuss methods to Reduce Memory Usage in graph representations.

**Definition:**

</details>

### Shortest Path Algorithms

<details>
<summary>What is the difference between BFS and Dijkstra’s algorithms when looking for the shortest path?</summary>

### What is the difference between BFS and Dijkstra’s algorithms when looking for the shortest path?

**Definition:**

</details>

<details>
<summary>Implement Dijkstra’s Algorithm for finding the shortest path in a graph with non-negative edge weights.</summary>

### Implement Dijkstra’s Algorithm for finding the shortest path in a graph with non-negative edge weights.

**Definition:**

</details>

<details>
<summary>How does Bellman-Ford Algorithm differ from Dijkstra’s and where would you use it?</summary>

### How does Bellman-Ford Algorithm differ from Dijkstra’s and where would you use it?

**Definition:**

</details>

<details>
<summary>Explain the concept of Floyd-Warshall Algorithm and its usage.</summary>

### Explain the concept of Floyd-Warshall Algorithm and its usage.

**Definition:**

</details>

### Heuristic-Based Graph Search Algorithms

<details>
<summary>What is `A*` Search?</summary>

### What is `A*` Search?

**Definition:**

</details>

<details>
<summary>What is the heuristic cost function in `A*` Search?</summary>

### What is the heuristic cost function in `A*` Search?

**Definition:**

</details>

<details>
<summary>Explain the difference between Best-First Search and `A*` Search.</summary>

### Explain the difference between Best-First Search and `A*` Search.

**Definition:**

</details>

<details>
<summary>Provide an implementation of the Greedy Best-First Search and compare it to `A*`.</summary>

### Provide an implementation of the Greedy Best-First Search and compare it to `A*`.

**Definition:**

</details>

<details>
<summary>How can you adapt `A*` Search to work on a puzzle game like Sudoku?</summary>

### How can you adapt `A*` Search to work on a puzzle game like Sudoku?

**Definition:**

</details>

### Real-World Applications of Graphs

<details>
<summary>What are some real-world Applications of Graphs?</summary>

### What are some real-world Applications of Graphs?

**Definition:**

</details>

<details>
<summary>Provide some practical examples of using Depth-First Search vs Breadth-First Search.</summary>

### Provide some practical examples of using Depth-First Search vs Breadth-First Search.

**Definition:**

</details>

<details>
<summary>How do social networks use graphs for recommendations and features like friend suggestions?</summary>

### How do social networks use graphs for recommendations and features like friend suggestions?

**Definition:**

</details>

<details>
<summary>Explain how a GPS navigation system might use graph data structures and algorithms.</summary>

### Explain how a GPS navigation system might use graph data structures and algorithms.

**Definition:**

</details>

### Advanced Graph Topics

<details>
<summary>What is a Graph Embedding, and how is it applicable in machine learning?</summary>

### What is a Graph Embedding, and how is it applicable in machine learning?

**Definition:**

</details>

<details>
<summary>Describe the Min-Cut Max-Flow Theorem and its significance in network flow problems.</summary>

### Describe the Min-Cut Max-Flow Theorem and its significance in network flow problems.

**Definition:**

</details>

<details>
<summary>Discuss the concept of Edge Coloring and its applications.</summary>

### Discuss the concept of Edge Coloring and its applications.

**Definition:**

</details>

<details>
<summary>Implement an algorithm that finds the Minimum Spanning Tree of a graph.</summary>

### Implement an algorithm that finds the Minimum Spanning Tree of a graph.

**Definition:**

</details>

<details>
<summary>Explain the importance of Graph Databases and how they differ from traditional relational databases.</summary>

### Explain the importance of Graph Databases and how they differ from traditional relational databases.

**Definition:**

</details>

### Algorithms for Specific Graph Classes

<details>
<summary>Discuss how algorithms might vary when dealing with Weighted vs Unweighted Graphs.</summary>

### Discuss how algorithms might vary when dealing with Weighted vs Unweighted Graphs.

**Definition:**

</details>

<details>
<summary>What special considerations are needed when implementing algorithms for Directed vs Undirected Graphs?</summary>

### What special considerations are needed when implementing algorithms for Directed vs Undirected Graphs?

**Definition:**

</details>

<details>
<summary>Provide an efficient algorithm for finding Articulation Points in a graph.</summary>

### Provide an efficient algorithm for finding Articulation Points in a graph.

**Definition:**

</details>

### Graph Challenges and Problem-Solving

<details>
<summary>Solve the Knight’s tour problem using graph traversal techniques.</summary>

### Solve the Knight’s tour problem using graph traversal techniques.

**Definition:**

</details>

<details>
<summary>How would you design an algorithm to evaluate the connected components of an undirected graph?</summary>

### How would you design an algorithm to evaluate the connected components of an undirected graph?

**Definition:**

</details>

<details>
<summary>Implement a graph solution for the River Crossing Problem.</summary>

### Implement a graph solution for the River Crossing Problem.

**Definition:**

</details>
