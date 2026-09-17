# Algorithms — Data structures

Arrays, trees, graphs, heaps, and how to pick the right structure.

[← Back to hub](./7_special_algorithms.md)

### Related docs

* [Algorithms — Big O](./7_special_algorithms_core.md) · [Algorithms — Common](./7_special_algorithms_common.md) · [Algorithms — Patterns](./7_special_algorithms_patterns.md) · [Algorithms — Data structures](./7_special_algorithms_data.md) · [JavaScript — Document](./3_js_browser.md)

### Sections

- [Data structures](#data-structures)

---

## 8. Data structures

<details>
  <summary>Choosing a data structure</summary>

### Choosing a data structure

**Definition:**

Lookup table matching common access patterns to the right abstract data structure and expected complexity.

| Need | Structure | Why |
|------|-----------|-----|
| Ordered index access | Array | O(1) index |
| Fast lookup by key | Map / Hash table | O(1) average |
| Unique values | Set | O(1) has |
| LIFO undo/history | Stack | O(1) push/pop |
| FIFO job queue | Queue | O(1) enqueue/dequeue* |
| Hierarchy | Tree | Parent-child |
| Relationships | Graph | Arbitrary edges |
| Min/max repeatedly | Heap | O(log n) insert/extract |
| Prefix search | Trie | O(m) per char |

\*Use proper queue — `array.shift()` is O(n) in JS.

---

</details>

<details>
  <summary>Array</summary>

### Array

**Definition:** Ordered collection with O(1) random access by index.

**When to use:** Lists, buffers, stack/queue (if you know shift cost).

**Pluses and minuses:**

| + | − |
|------|------|
| Cache-friendly, fast index | Insert/delete middle O(n) |
| Versatile in JS | `shift`/`unshift` are O(n) |

**Examples:**

`const arr = [1, 2, 3]; arr.push(4);`

| Operation | Time |
|-----------|------|
| Access by index | O(1) |
| Push/pop end | O(1) |
| Shift/unshift | O(n) |
| Search unsorted | O(n) |

---

</details>

<details>
  <summary>Object (plain object)</summary>

### Object (plain object)

**Definition:** Unordered key-value map (string/symbol keys). V8 may optimize as hidden class or dictionary mode.

**When to use:** Fixed-shape records, DTOs, namespaces. Prefer `Map` for dynamic keys.

**Pluses and minuses:**

| + | − |
|------|------|
| Literal syntax, JSON-like | Key order quirks (mostly insertion now) |
| Prototype chain for defaults | Not ideal for frequent add/delete keys |

**Examples:**

```js
const user = { name: 'Ada', role: 'admin' };
```

---

</details>

<details>
  <summary>Linked list</summary>

### Linked list

**Definition:** Nodes with `value` + `next` pointer. Doubly linked adds `prev`.

**When to use:** LRU cache internals, undo chains, interview problems. Rare in app JS — arrays usually win.

**Pluses and minuses:**

| + | − |
|------|------|
| O(1) insert/delete at known node | O(n) access by index |
| No reindexing on insert | Extra pointer memory |
| | Poor cache locality |

**Examples:**

```js
class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}
```

---

</details>

<details>
  <summary>Stack</summary>

### Stack

**Definition:** LIFO — last in, first out.

**When to use:** Call stack, bracket matching, DFS iterative, browser history (back).

**Pluses and minuses:**

| + | − |
|------|------|
| O(1) push/pop (array end) | No random access |
| Simple undo, parsing | |

**Examples:**

```js
const stack = [];
stack.push(1);
stack.push(2);
stack.pop(); // 2
```

---

</details>

<details>
  <summary>Queue</summary>

### Queue

**Definition:** FIFO — first in, first out.

**When to use:** BFS, job queues, event loops (macro/micro task queues).

**Pluses and minuses:**

| + | − |
|------|------|
| Fair ordering | JS array `shift` is O(n) |
| BFS, task scheduling | Use ring buffer or linked list for O(1) |

**Examples:**

```js
const queue = [];
queue.push('a');
queue.push('b');
queue.shift(); // 'a' — O(n); use index for hot paths
```

---

</details>

<details>
  <summary>Set</summary>

### Set

**Definition:** Collection of **unique** values.

**When to use:** Unique tags, visited nodes in graph, permission sets.

**Pluses and minuses:**

| + | − |
|------|------|
| O(1) has/add/delete average | No index access |
| Dedup, membership | Iteration order = insertion |

**Examples:**

```js
const seen = new Set([1, 2, 2, 3]); // Set(3) {1,2,3}
seen.has(2); // true
```

---

</details>

<details>
  <summary>Map</summary>

### Map

**Definition:** Key-value store; keys can be any type (objects, primitives).

**When to use:** Dynamic keys, object keys, counting frequencies, caches.

**Pluses and minuses:**

| + | − |
|------|------|
| O(1) average get/set | More memory than object for tiny maps |
| Maintains insertion order | |
| No prototype pollution | |

**Examples:**

```js
const counts = new Map();
for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
```

---

</details>

<details>
  <summary>Tree</summary>

### Tree

**Definition:** Hierarchical nodes; no cycles. Binary tree: ≤2 children per node.

**When to use:** DOM, file systems, decision trees, BST maps.

**Pluses and minuses:**

| + | − |
|------|------|
| Models hierarchy (DOM, FS) | Balancing needed for performance |
| O(log n) ops if balanced BST | Unbalanced → O(n) |

**Examples:**

```js
const node = {
  value: 'root',
  children: [
    { value: 'left', children: [] },
    { value: 'right', children: [] },
  ],
};
```

**Thoughts:**

DOM is a tree. React fiber tree is a linked tree structure. Traversal → next block.

---

</details>

<details>
  <summary>Tree traversal (recursive vs iterative)</summary>

### Tree traversal (recursive vs iterative)

**Definition:** Visit every node of a tree (or forest). Depth-first uses a **stack** (call stack or explicit); breadth-first uses a **queue**.

**How it works:**

- **Recursive DFS:** visit node, then walk each child. Skip `null` / missing children so you do not push junk values.
- **Iterative DFS:** explicit `stack`. Push children in reverse if you want left-to-right order.
- **Call stack:** each recursive frame costs stack space. Deep trees (10k+ levels) can throw `RangeError: Maximum call stack size exceeded`. Production code often uses an iterative stack or a depth limit.
- **React:** nested menus, comment threads, file trees — recursion is natural for *shallow* UI trees. Prefer iteration or flattening if depth is unbounded (user-generated nesting).

**When to use:**

Interview “print all values”; React recursive `<Folder children={...} />`; DOM walk.

#### Common pitfalls

Forgetting `null` checks and collecting `undefined` in the result. Recursing on production data with unknown depth.

**Pluses and minuses:**

| + | − |
|------|------|
| Recursion matches the data shape | Stack overflow on deep trees |
| Iterative stack has heap-limited depth | More boilerplate |

**Examples:**

```js
function walk(node, visit) {
  if (node == null) return;
  visit(node.value);
  for (const child of node.children ?? []) walk(child, visit);
}

function walkIterative(root, visit) {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    if (node == null) continue;
    visit(node.value);
    const children = node.children ?? [];
    for (let i = children.length - 1; i >= 0; i--) stack.push(children[i]);
  }
}
```

**Thoughts:** *Recursion is the clean DFS; an explicit stack is the same algorithm without blowing the call stack.*

**Sources:**

[MDN — recursion](https://developer.mozilla.org/en-US/docs/Glossary/Recursion)

---

</details>

<details>
  <summary>Graph</summary>

### Graph

**Definition:** Vertices + edges. Directed or undirected, weighted or not.

**When to use:** Routing, dependency graphs, recommendation, state machines.

**Pluses and minuses:**

| + | − |
|------|------|
| Models networks, deps, social | More complex than trees |
| BFS/DFS foundation | Representation choice matters |

| Type | + | − |
|------|------|------|
| Adjacency list | Sparse graphs, easy iterate neighbors | Slow edge lookup |
| Adjacency matrix | O(1) edge check | O(V²) space |

**Examples:**

```js
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D'],
  C: ['A'],
  D: ['B'],
};
```

---

</details>

<details>
  <summary>Hash table</summary>

### Hash table

**Definition:** Key-value store that maps keys to **buckets** via a **hash function**; collisions resolved by chaining (linked lists per bucket) or open addressing (probe for next slot).

**How it works:**

1. `hash(key) % bucketCount` → bucket index.
2. **Insert** — store at bucket; on collision, chain or probe.
3. **Lookup** — hash key, search bucket — O(1) average when load factor is low.
4. **Resize** — rehash when load factor exceeds threshold (typically 0.7) to keep O(1) average.
5. Worst case O(n) if all keys collide (adversarial or poor hash).

**When to use:** Caches, deduplication (`Set`), word counts, session stores, database indexes, `Map` for dynamic keys, object property access (V8 hidden classes optimize fixed shapes).

**Pluses and minuses:**

| + | − |
|------|------|
| O(1) average lookup, insert, delete | O(n) worst case with bad hash or attacks |
| Ideal for frequency counts, caches, indexes | No inherent ordering (use `Map` for insertion order in JS) |
| JS `Map`/`Set` are hash-based | Memory overhead for buckets + pointers |

**Examples:**

```js
// Frequency count — same pattern as hash table use
const freq = new Map();
for (const word of words) {
  freq.set(word, (freq.get(word) ?? 0) + 1);
}

// Custom hash map concept
class HashMap {
  constructor(size = 16) { this.buckets = Array.from({ length: size }, () => []); }
  _hash(key) { let h = 0; for (const c of String(key)) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h) % this.buckets.length; }
  set(key, val) { const b = this.buckets[this._hash(key)]; const i = b.findIndex(([k]) => k === key); if (i >= 0) b[i][1] = val; else b.push([key, val]); }
  get(key) { return this.buckets[this._hash(key)].find(([k]) => k === key)?.[1]; }
}
```

**Thoughts:** JS `Map` and `Set` are hash-based. Plain objects use hidden classes for stable shapes; many add/delete keys → dictionary mode (slower). For interview: mention load factor and collision strategies. Table hashes are **not** cryptographic SHA — see [Encryption](./7_special_security.md#encryption).

**Sources:**

[javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)

---

</details>

<details>
  <summary>Heap (priority queue)</summary>

### Heap (priority queue)

**Definition:** Complete binary tree stored in an array where **min-heap** has parent ≤ children (root = minimum) or **max-heap** has parent ≥ children (root = maximum).

**How it works:**

1. **Array representation** — parent at index `i`, children at `2i+1` and `2i+2`.
2. **Insert** — append to end, **bubble up** (swap with parent until heap property holds) — O(log n).
3. **Extract-min** — swap root with last element, remove last, **bubble down** — O(log n).
4. **Peek** — root is min/max — O(1).
5. **Heapify** — build heap from array in O(n) bottom-up.

**When to use:** Dijkstra's algorithm (priority queue), task/job schedulers, merge K sorted lists, find median from stream, event-driven simulation, A* search.

**Pluses and minuses:**

| + | − |
|------|------|
| O(log n) insert and extract-min/max | No O(1) lookup of arbitrary element |
| O(1) peek at priority element | Not built into JS — implement or use library |
| Efficient for streaming top-K | Array-based heap less intuitive than tree diagram |

**Examples:**

```js
class MinHeap {
  constructor() { this.a = []; }
  peek() { return this.a[0]; }
  push(val) {
    this.a.push(val);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p] <= this.a[i]) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    if (this.a.length === 1) return this.a.pop();
    const min = this.a[0];
    this.a[0] = this.a.pop();
    let i = 0;
    while (true) {
      let s = i, l = 2 * i + 1, r = 2 * i + 2;
      if (l < this.a.length && this.a[l] < this.a[s]) s = l;
      if (r < this.a.length && this.a[r] < this.a[s]) s = r;
      if (s === i) break;
      [this.a[i], this.a[s]] = [this.a[s], this.a[i]];
      i = s;
    }
    return min;
  }
}
```

**Thoughts:** For top-K largest, use min-heap of size K. `Array.prototype.sort` is O(n log n) for one-shot; heap wins for incremental inserts.

**Sources:**

[javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)

---

</details>

<details>
  <summary>Trie</summary>

### Trie

**Definition:** Tree where each edge is a character; paths spell strings. Good for prefix operations.

**When to use:** Autocomplete, IP routing tables, word games.

**Pluses and minuses:**

| + | − |
|------|------|
| O(m) search prefix length m | Space-heavy for sparse alphabets |
| Autocomplete, spell check | |

**Examples:**

```js
class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}
```

---

</details>

<details>
  <summary>DOM and data structures</summary>

### DOM and data structures

**Definition:**

Mapping between browser DOM concepts and classic data structures — explains traversal APIs, tree shape, and event-loop queues.

| DOM concept | Data structure |
|-------------|----------------|
| Document tree | Tree |
| Parent/child links | Linked structure |
| Attributes | Key-value (map-like) |
| childNodes | Array-like list |
| classList | Set-like |
| Event queue | Queue (event loop) |

**Thoughts:** Understanding DOM as a tree explains `querySelector`, traversal APIs, and reflow cost.

**Sources:**

[3_js_browser.md](./3_js_browser.md)

---

</details>
