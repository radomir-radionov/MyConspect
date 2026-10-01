# Data Structures — hub

Массивы, деревья, графы, кучи и выбор подходящей структуры.

[← Back to hub](./7_special.md)

### Related docs

- [Algorithms](./7_special_algorithms.md) · [Computer science](./7_special_cs.md) · [JavaScript — Document](./3_js_browser.md)

### Sections

- [Choosing a data structure](#choosing-a-data-structure)
- [Linear](./7_special_data_structures_linear.md)
- [Trees & graphs](./7_special_data_structures_trees.md)
- [Hash & heap](./7_special_data_structures_advanced.md)

---

## Overview

<details>
  <summary>Choosing a data structure</summary>

### Choosing a data structure

**Definition:**

Lookup table matching common access patterns to the right abstract data structure and expected complexity.

| Need                 | Structure        | Why                     |
| -------------------- | ---------------- | ----------------------- |
| Ordered index access | Array            | O(1) index              |
| Fast lookup by key   | Map / Hash table | O(1) average            |
| Unique values        | Set              | O(1) has                |
| LIFO undo/history    | Stack            | O(1) push/pop           |
| FIFO job queue       | Queue            | O(1) enqueue/dequeue\*  |
| Hierarchy            | Tree             | Parent-child            |
| Relationships        | Graph            | Arbitrary edges         |
| Min/max repeatedly   | Heap             | O(log n) insert/extract |
| Prefix search        | Trie             | O(m) per char           |

\*Use proper queue — `array.shift()` is O(n) in JS.

---

</details>
