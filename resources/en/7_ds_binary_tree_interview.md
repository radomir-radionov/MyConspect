# Binary Tree — Interview

Answers are filled for the published subset; the rest are still empty.
[← Back to hub](./7_special_data_structures.md)

### Related docs

- [Binary Tree — Interview](./7_ds_binary_tree_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Binary Tree](https://devinterview.io/questions/data-structures-and-algorithms/binary-tree-data-structure-interview-questions/).

### Fundamental Tree Concepts

<details>
<summary>What is a Tree Data Structure?</summary>

### What is a Tree Data Structure?

**Definition:**

A tree is a connected acyclic graph with a hierarchy: one parent path from each node up to a root, and children below.

**How it works:**

- A node holds a value and links to its children. The root has no parent. A leaf has no children.
- There is exactly one path between any two nodes. A cycle would make it a general graph.
- Depth is the number of edges from the root. Height is the number of edges on the longest downward path.
- Typical uses are file systems, DOM documents, decision trees, and search trees.
</details>

<details>
<summary>What is a Binary Tree?</summary>

### What is a Binary Tree?

**Definition:**

A binary tree gives every node at most two children, usually called left and right.

**How it works:**

- A node may have only a left child, only a right child, both, or neither. Missing children are not the same as empty placeholder nodes unless you are drawing a heap.
- A full binary tree has 0 or 2 children at every node. A complete one fills levels left to right. A perfect one is full and every leaf is at the same depth.
- Traversal is inorder (left, node, right), preorder (node, left, right), or postorder (left, right, node). Level order uses a queue.
- A chain of n nodes is still a binary tree, and its height is n−1, so algorithms that look logarithmic on a balanced tree become linear.
</details>

### Specific Tree Types and Data Structures

<details>
<summary>What is Binary Heap?</summary>

### What is Binary Heap?

**Definition:**

A binary heap is a complete binary tree with a parent-child order, stored in an array. It is a priority queue, not a search tree.

**How it works:**

- Complete means every level except possibly the last is full, and the last level is packed from the left. Children of index `i` are `2i+1` and `2i+2`.
- A min-heap puts the smallest key at the root. A max-heap puts the largest there. Siblings are not ordered.
- Insert sifts up and delete-extreme sifts down, both O(log n). Search for an arbitrary key is O(n).
- Do not confuse it with a binary search tree, where the left subtree is smaller than the node and the right is larger.
</details>

<details>
<summary>What is a Binary Search Tree?</summary>

### What is a Binary Search Tree?

**Definition:**

A binary search tree orders keys: every key in the left subtree is smaller than the node, and every key in the right subtree is larger.

**How it works:**

- Search, insert, and delete follow one path from the root and cost O(height). On a balanced tree that is O(log n). On a sorted insertion order it is O(n).
- Inorder traversal visits keys in sorted order.
- Delete of a node with two children replaces it with its inorder successor or predecessor, then deletes that stand-in from its old place.
- Equal keys need a fixed policy: reject them, or send them consistently left or right. The comparisons must stay transitive.

**Examples:**

Insert 5, then 2, then 8, then 1. Search for 1 goes left of 5, left of 2, and finds 1.
</details>

<details>
<summary>What is AVL Tree? How to Balance it?</summary>

### What is AVL Tree? How to Balance it?

**Definition:**

An AVL tree is a binary search tree where the heights of the two children of every node differ by at most one.

**How it works:**

- Each node stores a balance factor: height(left) − height(right), in {−1, 0, +1}.
- Insert and delete update heights on the way back up. The first node whose factor becomes ±2 is rebalanced with a rotation.
- A left-left or right-right imbalance is one rotation. A left-right or right-left imbalance is a double rotation: rotate the child, then the node.
- Height stays about 1.44 log₂ n, so search, insert, and delete are O(log n). AVL rotates more often than a red-black tree and looks up a bit faster.
</details>

<details>
<summary>What is a Red-Black Tree?</summary>

### What is a Red-Black Tree?

**Definition:**

A red-black tree is a binary search tree with a color on each node and rules that keep the longest path at most twice the shortest.

**How it works:**

- Every node is red or black. The root is black. A red node has only black children. Every path from a node to a leaf sentinel has the same number of black nodes.
- Insert colors the new node red and repairs with recoloring and at most a couple of rotations. Delete has more cases and still a constant number of rotations.
- The height is O(log n), so the map operations are O(log n). The bound is looser than AVL, and updates rotate less.
- C++ `std::map` and Java `TreeMap` are typical red-black trees.
</details>

<details>
<summary>How is an AVL Tree different from a B-Tree?</summary>

### How is an AVL Tree different from a B-Tree?

**Definition:**

An AVL tree is a binary search tree balanced by height, aimed at in-memory lookup. A B-tree is a wide search tree aimed at disks and pages.

**How it works:**

- AVL nodes have one key and at most two children. B-tree nodes have many keys and many children, sized to a page.
- AVL rotates to fix a height gap of 2. A B-tree splits a full node and merges or borrows on delete to keep a minimum occupancy.
- An AVL lookup touches O(log n) nodes, and those nodes are small. A B-tree lookup touches O(log_b n) pages, which is the cost that matters on disk.
- Databases and file systems use B-trees or B+ trees. Language library maps use AVL or red-black trees.
</details>

<details>
<summary>How can a Fenwick Tree (Binary Indexed Tree) be beneficial in algorithm design?</summary>

### How can a Fenwick Tree (Binary Indexed Tree) be beneficial in algorithm design?

**Definition:**

A Fenwick tree stores prefix aggregates in an array so a point update and a prefix query both walk O(log n) indexes.

**How it works:**

- Index `i` is responsible for a range whose length is the lowest set bit of `i`. Adding that bit moves to the next prefix. Clearing it moves to the parent.
- It uses n integers and no pointers. It is simpler and tighter than a segment tree when you only need prefix sums or point updates.
- Range sums are `prefix(r) − prefix(l−1)`. Range updates need a second tree or a difference-array trick.
- It does not store the original array's arbitrary ranges as flexibly as a segment tree, and it wants 1-based indexes.

**Examples:**

Frequencies `[0, 3, 2, −1]`. `add(2, 5)` and `prefix(3)` each touch a couple of slots, not the whole prefix.
</details>

<details>
<summary>What is a Segment Tree, and how does it differ from a traditional binary tree in usage and efficiency?</summary>

### What is a Segment Tree, and how does it differ from a traditional binary tree in usage and efficiency?

**Definition:**

A segment tree is a full binary tree over an array, where each node stores the aggregate of a half-open range.

**How it works:**

- The root is `[0, n)`. Each internal node splits its range in half. Leaves are single indexes.
- A point update recomputes O(log n) ancestors. A range query visits O(log n) nodes whose ranges cover the query without a linear scan.
- It is built for 'sum, min, or max on a range that changes', not for ordered-key search. A BST does the opposite.
- Memory is about 4n nodes in the array layout. Build is O(n).

**Examples:**

Array `[2, 1, 5, 3]`. The node for `[0, 2)` stores `2+1`. A query `[1, 4)` combines the leaf `1` with the node for `[2, 4)`.
</details>

<details>
<summary>What is a Splay Tree, and how does its splay operation work?</summary>

### What is a Splay Tree, and how does its splay operation work?

**Definition:**

A splay tree is a binary search tree that rotates the accessed node up to the root, so recently used keys stay near the top.

**How it works:**

- Splay uses zig, zig-zig, and zig-zag rotations along the path, not a single rotate-to-root that can leave the tree skinny.
- Search, insert, and delete splay the touched node. A missing search splays the last node visited.
- One operation can be O(n). Over a sequence, the amortized cost is O(log n) per operation.
- It needs no balance bits. It is a good fit for locality: the same key looked up again is now at the root.
</details>

<details>
<summary>Explain the concept and structure of a Ternary Tree.</summary>

### Explain the concept and structure of a Ternary Tree.

**Definition:**

A ternary tree gives each node up to three children. In a ternary search tree those children mean less, equal, and greater for one character.

**How it works:**

- A plain ternary tree is just a branching factor of three, used for 3-ary heaps or expression nodes with three operands.
- A ternary search tree stores a character in the node. The left child is a smaller character, the right a larger one, and the middle child is the next character of the same word.
- Lookup of a word of length L is O(L log σ) in the character alphabet when the side trees are balanced, and it can share prefixes the way a trie does, with less empty space than a 26-way trie node.
- It is a string index, not a balanced BST of whole keys.
</details>

<details>
<summary>Describe a Lazy Segment Tree and when it is used over a regular Segment Tree.</summary>

### Describe a Lazy Segment Tree and when it is used over a regular Segment Tree.

**Definition:**

A lazy segment tree postpones range updates by storing a pending tag on a node, and pushes that tag to the children only when a later query needs them.

**How it works:**

- A range add on `[L, R)` marks O(log n) canonical nodes and updates their aggregates immediately. Their children stay stale until a push.
- A query pushes tags on the way down, so it sees the updates that cover its path. Both update and query stay O(log n).
- Without laziness, adding a value to a range of length n would edit n leaves. That is the case the lazy tree avoids.
- The tag must compose: two pending adds become one add. Assignment tags overwrite adds. Getting that composition wrong corrupts the tree.
</details>

<details>
<summary>What is a Treap, and how does it combine the properties of a binary search tree and a heap?</summary>

### What is a Treap, and how does it combine the properties of a binary search tree and a heap?

**Definition:**

A treap stores a key and a random priority in each node. Keys obey the BST order. Priorities obey the heap order.

**How it works:**

- Insert searches by key, then rotates the new node up until its priority is in heap order with its parent.
- Delete rotates the node down until it is a leaf, preferring the child with the better priority, then unlinks it.
- Random priorities make the expected height O(log n). There is no separate balance factor.
- Split and merge by key are the operations that make implicit treaps useful for sequences.
</details>

### Tree Properties and Operations

<details>
<summary>What is a Balanced Tree?</summary>

### What is a Balanced Tree?

**Definition:**

A balanced tree keeps its height logarithmic in the number of nodes, so a root-to-leaf path stays short after updates.

**How it works:**

- AVL, red-black trees, B-trees, and treaps with random priorities are balanced in their own senses.
- A plain BST inserted in sorted order is a chain and is not balanced.
- The guarantee is what makes map operations O(log n) rather than O(n).
- Balance has a cost: extra fields, rotations, or wider nodes. A write-once sorted array needs none of that.
</details>

<details>
<summary>What are advantages and disadvantages of BST?</summary>

### What are advantages and disadvantages of BST?

**Definition:**

A BST gives ordered search, successor, and range queries. Without balance, those operations follow the height and can be linear.

**How it works:**

- Inorder is the sorted sequence. Range queries walk only the relevant slice.
- A balanced BST does insert, delete, and search in O(log n) and keeps keys ordered, which a hash table does not.
- An unbalanced BST degrades to a list. You either randomize insertion, use a treap, or use AVL or red-black rules.
- Pointer nodes are heavier and less cache-friendly than a sorted array. Prefer the array when the data is static.
</details>

<details>
<summary>How does Inserting or Deleting nodes affect a Red-Black Tree?</summary>

### How does Inserting or Deleting nodes affect a Red-Black Tree?

**Definition:**

</details>

<details>
<summary>What is the time complexity for Insert into Red-Black Tree?</summary>

### What is the time complexity for Insert into Red-Black Tree?

**Definition:**

</details>

<details>
<summary>How does tree balancing improve search operation performance in a tree?</summary>

### How does tree balancing improve search operation performance in a tree?

**Definition:**

</details>

<details>
<summary>Discuss the concept of immutable binary trees and its implications in functional programming.</summary>

### Discuss the concept of immutable binary trees and its implications in functional programming.

**Definition:**

</details>

### Comparisons Between Tree Varieties

<details>
<summary>Explain the difference between Binary Tree and Binary Search Tree.</summary>

### Explain the difference between Binary Tree and Binary Search Tree.

**Definition:**

</details>

<details>
<summary>What is the difference between Heap and Red-Black Tree?</summary>

### What is the difference between Heap and Red-Black Tree?

**Definition:**

</details>

<details>
<summary>Compare Trie vs. Binary Search Trie.</summary>

### Compare Trie vs. Binary Search Trie.

**Definition:**

</details>

<details>
<summary>Compare Red-Black Trees and AVL Trees.</summary>

### Compare Red-Black Trees and AVL Trees.

**Definition:**

</details>

<details>
<summary>When standard BSTs might be preferred over AVL Trees?</summary>

### When standard BSTs might be preferred over AVL Trees?

**Definition:**

</details>

<details>
<summary>Compare the performance of a Splay Tree versus a Red-Black Tree under various operations.</summary>

### Compare the performance of a Splay Tree versus a Red-Black Tree under various operations.

**Definition:**

</details>

<details>
<summary>How does a B+ Tree differ from a B-Tree and in what situations might it be preferred?</summary>

### How does a B+ Tree differ from a B-Tree and in what situations might it be preferred?

**Definition:**

</details>

### Tree Implementations and Traversals

<details>
<summary>Name some ways to implement Priority Queue.</summary>

### Name some ways to implement Priority Queue.

**Definition:**

</details>

<details>
<summary>Classify Tree Traversal Algorithms.</summary>

### Classify Tree Traversal Algorithms.

**Definition:**

</details>

<details>
<summary>Implement Pre-order Traversal of Binary Tree using Recursion.</summary>

### Implement Pre-order Traversal of Binary Tree using Recursion.

**Definition:**

</details>

<details>
<summary>Implement Iterative Pre-order Traversal of a Binary Tree without Recursion.</summary>

### Implement Iterative Pre-order Traversal of a Binary Tree without Recursion.

**Definition:**

</details>

<details>
<summary>Convert a Binary Tree into a Doubly Linked List.</summary>

### Convert a Binary Tree into a Doubly Linked List.

**Definition:**

</details>

<details>
<summary>Build a Binary Expression Tree for the given expression.</summary>

### Build a Binary Expression Tree for the given expression.

**Definition:**

</details>

<details>
<summary>What is Morris Traversal for a Tree? How to implement one?</summary>

### What is Morris Traversal for a Tree? How to implement one?

**Definition:**

</details>

<details>
<summary>Explain how to perform level-order traversal in a binary tree and its applications.</summary>

### Explain how to perform level-order traversal in a binary tree and its applications.

**Definition:**

</details>

<details>
<summary>Describe the use of BFS and DFS in binary trees and how they relate to tree traversals.</summary>

### Describe the use of BFS and DFS in binary trees and how they relate to tree traversals.

**Definition:**

</details>

### Advanced Tree Concepts and Applications

<details>
<summary>Implement a Map data structure using Binary Search Tree.</summary>

### Implement a Map data structure using Binary Search Tree.

**Definition:**

</details>

<details>
<summary>Explain the process of Tree Rotation and its use cases.</summary>

### Explain the process of Tree Rotation and its use cases.

**Definition:**

</details>

<details>
<summary>Discuss the concept of Threaded Binary Trees.</summary>

### Discuss the concept of Threaded Binary Trees.

**Definition:**

</details>

<details>
<summary>In what scenarios would a Recursive Tree Traversal be impractical?</summary>

### In what scenarios would a Recursive Tree Traversal be impractical?

**Definition:**

</details>

<details>
<summary>Discuss the Space Complexity for storing a binary tree.</summary>

### Discuss the Space Complexity for storing a binary tree.

**Definition:**

</details>

<details>
<summary>How to determine if a given binary tree is a full binary tree?</summary>

### How to determine if a given binary tree is a full binary tree?

**Definition:**

</details>

<details>
<summary>What are the characteristics of a perfect binary tree and how do you identify one?</summary>

### What are the characteristics of a perfect binary tree and how do you identify one?

**Definition:**

</details>

<details>
<summary>How can you serialize and deserialize a binary tree?</summary>

### How can you serialize and deserialize a binary tree?

**Definition:**

</details>

<details>
<summary>How to check if a binary tree is height-balanced?</summary>

### How to check if a binary tree is height-balanced?

**Definition:**

</details>

<details>
<summary>Describe the application of Binary Trees in networking (e.g., routing, addressing).</summary>

### Describe the application of Binary Trees in networking (e.g., routing, addressing).

**Definition:**

</details>

<details>
<summary>Explain the concept of Path Sum in a binary tree and how it is calculated.</summary>

### Explain the concept of Path Sum in a binary tree and how it is calculated.

**Definition:**

</details>

<details>
<summary>Find the lowest common ancestor (LCA) of two nodes in a binary tree.</summary>

### Find the lowest common ancestor (LCA) of two nodes in a binary tree.

**Definition:**

</details>

<details>
<summary>Can a binary tree be reconstructed from its inorder and preorder (or postorder) traversals?</summary>

### Can a binary tree be reconstructed from its inorder and preorder (or postorder) traversals?

**Definition:**

</details>

<details>
<summary>Implement a function to check if a binary tree is symmetric (a mirror image of itself).</summary>

### Implement a function to check if a binary tree is symmetric (a mirror image of itself).

**Definition:**

</details>

<details>
<summary>Describe how binary trees can be used in decision-making processes (e.g., decision trees in AI).</summary>

### Describe how binary trees can be used in decision-making processes (e.g., decision trees in AI).

**Definition:**

</details>

<details>
<summary>Discuss the role of binary trees in garbage collection algorithms like the mark-and-sweep algorithm.</summary>

### Discuss the role of binary trees in garbage collection algorithms like the mark-and-sweep algorithm.

**Definition:**

</details>

<details>
<summary>Explain how trie data structures are used in implementing autocomplete features.</summary>

### Explain how trie data structures are used in implementing autocomplete features.

**Definition:**

</details>

<details>
<summary>What is Huffman Coding, and how is a binary tree used in this compression technique?</summary>

### What is Huffman Coding, and how is a binary tree used in this compression technique?

**Definition:**

</details>
