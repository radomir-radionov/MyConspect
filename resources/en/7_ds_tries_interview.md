# Trie — Interview

Answers are filled for the published subset; the rest are still empty.
[← Back to hub](./7_special_data_structures.md)

### Related docs

- [Trie — Interview](./7_ds_tries_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Trie Data Structure](https://devinterview.io/questions/data-structures-and-algorithms/trie-data-structure-interview-questions/).

### Understanding Tries

<details>
<summary>What is a Trie?</summary>

### What is a Trie?

**Definition:**

A trie is a tree of characters. Each edge is one character, and a path from the root spells a prefix or a whole key.

**How it works:**

- A node holds a map from character to child, plus a flag that a word ends here. The flag is needed because a word can be a prefix of another.
- Insert, search, and starts-with walk one edge per character, so a key of length L costs O(L) and does not depend on how many other keys share no prefix.
- Shared prefixes share nodes. That is the space win over storing each string separately when the dictionary overlaps.
- The alphabet size decides whether the child map is an array, a hash map, or a sorted list.

**Examples:**

Insert `cat` and `car`. The node `c → a` is shared. `t` and `r` are different children, and both are marked as word ends.
</details>

<details>
<summary>What are the advantages of Tries over Hash Tables?</summary>

### What are the advantages of Tries over Hash Tables?

**Definition:**

A trie finds every key with a given prefix and can list them in sorted order. A hash table finds an exact key and scatters order.

**How it works:**

- Prefix search, autocomplete, and longest-prefix match are a walk to the prefix node plus a subtree scan.
- There is no hash collision and no load factor. The cost is proportional to the key length.
- Sorted iteration is a depth-first walk of the children in character order.
- A hash table is smaller and faster for exact lookup of long, unshared keys. The trie pays a node per character.
</details>

<details>
<summary>What are Advantages and Disadvantages of a Trie?</summary>

### What are Advantages and Disadvantages of a Trie?

**Definition:**

Tries excel at prefixes and shared structure. They waste space when keys barely overlap or the alphabet array is wide and sparse.

**How it works:**

- Lookup is O(L) with a small constant when children are an array. Failed searches stop at the first missing edge.
- An array of 26 or 256 pointers per node is fast and mostly empty. A hash map of children is denser and slower per step.
- Delete must unmark the word and then prune nodes that are not a word end and have no children.
- Unicode and long random ids make the tree deep or wide. A hash table or a radix tree (compressed trie) is often a better fit.
</details>

<details>
<summary>How do you handle the case sensitivity problem in Tries?</summary>

### How do you handle the case sensitivity problem in Tries?

**Definition:**

Decide the alphabet before the first insert. Either fold case when you walk, or store both cases as different edges.

**How it works:**

- Folding to lower case at insert and at search makes `Cat` and `cat` one word. Do it with a Unicode case fold, not only ASCII `toLowerCase`, if the dictionary is not English.
- Keeping case means `C` and `c` are different children. Search is case-sensitive and matches the stored spelling.
- A third option stores the original spelling at the terminal node and walks a case-folded path, so autocomplete can show `Cat` while search ignores case.
- Mixing the policies between insert and search is a bug: one path lowercases and the other does not, and the word is missing.
</details>

### Applications and Use Cases of Tries

<details>
<summary>What are some Practical Applications of a Trie?</summary>

### What are some Practical Applications of a Trie?

**Definition:**

Tries are used wherever the next character narrows a set of strings.

**How it works:**

- Autocomplete and spell check walk the prefix and then explore the subtree.
- Longest-prefix match in a router walks the bits of an address until the deepest marked prefix.
- A dictionary in a word game tests a prefix before extending a path.
- T9 and some tokenizers use the same character tree. Exact-id lookup of random UUIDs usually does not.
</details>

<details>
<summary>Describe how a Trie can be used for implementing autocomplete functionality.</summary>

### Describe how a Trie can be used for implementing autocomplete functionality.

**Definition:**

Autocomplete walks the characters typed so far, then collects word-end flags in that subtree, usually the first k in sorted order.

**How it works:**

- If the walk dies on a missing edge, there are no suggestions.
- A depth-first walk of children in alphabetical order yields lexicographic suggestions. Stop after k hits.
- A frequency stored at the terminal node lets you keep a small heap of the best k instead of the alphabetical k.
- The walk is O(L + output). Precomputing the top suggestions on each node makes the query faster and the update slower.

**Examples:**

Dictionary `car`, `card`, `cat`. The prefix `ca` lands on the shared node. A walk finds `car`, `card`, and `cat`.
</details>

<details>
<summary>Explain the use of a Trie in IP Routing to match IP prefixes.</summary>

### Explain the use of a Trie in IP Routing to match IP prefixes.

**Definition:**

A routing trie walks the bits of the destination address and remembers the deepest prefix that was marked as a route.

**How it works:**

- Each edge is a bit, or a stride of several bits. A marked node stores the next hop for that prefix.
- Search does not stop at the first mark. A longer matching prefix overrides a shorter one. The last mark on the walk is the answer.
- If the walk cannot continue and a mark was seen higher up, that higher prefix still matches.
- A compressed radix tree (a Patricia trie) collapses chains of one child, which is how forwarding tables stay small.

**Examples:**

Routes `10.0.0.0/8` and `10.1.0.0/16`. Address `10.1.2.3` walks past both marks and uses the `/16`. Address `10.2.2.3` stops being able to follow the `/16` and keeps the `/8`.
</details>

<details>
<summary>How is a Trie used in text spell-checking and correction systems?</summary>

### How is a Trie used in text spell-checking and correction systems?

**Definition:**

The dictionary is a trie. A word is correct if the walk ends on a word flag. Suggestions are words within a small edit distance of the path that failed.

**How it works:**

- Exact check is one walk of length L.
- Correction explores deletions, insertions, substitutions, and sometimes transpositions, pruning when the remaining budget of edits cannot reach a word.
- Shared prefixes mean one wrong suffix does not restart the search from scratch for every dictionary word.
- A frequency on the terminal node ranks `teh` → `the` above a rare word at the same distance.
</details>

### Implementation and Operations in Tries

<details>
<summary>Name some Trie Implementation strategies.</summary>

### Name some Trie Implementation strategies.

**Definition:**

The child map is the implementation choice. The walk algorithm stays the same.

**How it works:**

- A fixed array indexed by character is the fastest for a small alphabet and the most wasteful when most slots are empty.
- A hash map per node is compact for sparse Unicode and adds hashing on every step.
- A sorted vector of children is compact and makes ordered walks natural. Lookup inside the node is logarithmic in the number of children.
- A radix tree compresses single-child chains into one edge labeled with a string. A ternary search tree stores one character and three links.
</details>

<details>
<summary>Write the code to insert a word into a Trie.</summary>

### Write the code to insert a word into a Trie.

**Definition:**

Start at the root and for each character create the child if it is missing, then move to that child. Mark the last node as a word.

**How it works:**

- Creating missing edges is what makes the first insert of a prefix allocate the path.
- A second insert of the same word only sets the end flag again.
- Do not mark intermediate nodes unless that shorter string was also inserted.
- Time is O(L) child lookups, times the cost of the map.

**Examples:**

```text
def insert(root, word):
    node = root
    for ch in word:
        node = node.children.setdefault(ch, Node())
    node.is_word = True
```
</details>

<details>
<summary>Implement a Search function to determine if a word is included in a Trie.</summary>

### Implement a Search function to determine if a word is included in a Trie.

**Definition:**

Walk the characters. If any edge is missing, the word is absent. If the walk finishes, the node must be marked as a word, not merely a prefix.

**How it works:**

- `startsWith` returns true at the end of the walk even when the end flag is false.
- Search returns false for a proper prefix of an inserted word.
- An empty word is present only if the root itself is marked, which is a policy you should decide.
- The walk is O(L).

**Examples:**

```text
def search(root, word):
    node = root
    for ch in word:
        node = node.children.get(ch)
        if node is None:
            return False
    return node.is_word
```

`car` is found. `ca` walks successfully and returns false if only `car` was inserted.
</details>

<details>
<summary>Write a script to Delete a word from a Trie.</summary>

### Write a script to Delete a word from a Trie.

**Definition:**

Unmark the terminal node, then delete nodes on the way back while they have no children and are not the end of another word.

**How it works:**

- If the word is only a prefix of a longer word, clearing the flag is enough. The nodes stay because the longer word uses them.
- If a node still has other children, stop pruning there.
- If the word was never inserted, the walk fails and the trie is unchanged.
- A recursive delete returns whether the child was removed, so the parent can drop that map entry.

**Examples:**

```text
def delete(node, word, i=0):
    if i == len(word):
        if not node.is_word:
            return False
        node.is_word = False
        return len(node.children) == 0
    ch = word[i]
    child = node.children.get(ch)
    if child is None or not delete(child, word, i + 1):
        return False
    del node.children[ch]
    return not node.is_word and len(node.children) == 0
```
</details>

### Trie Variants and Comparison with Other Data Structures

<details>
<summary>Compare Trie vs. Binary Search Tree.</summary>

### Compare Trie vs. Binary Search Tree.

**Definition:**

A trie branches on the next character. A BST branches on a comparison of the whole key.

**How it works:**

- Trie search is O(L). BST search is O(L · height) if each comparison scans the string, or O(height) after the keys are interned.
- A trie gives prefix queries for free. A BST of whole strings gives predecessor and successor of a full key, and prefix queries need extra care.
- A balanced BST has a logarithmic height in the number of keys. A trie is as deep as the longest key, which can be more or less than log n.
- The trie spends memory on characters. The BST spends memory on key pointers and balance fields.
</details>

<details>
<summary>How to choose between a Hash Table and a Trie?</summary>

### How to choose between a Hash Table and a Trie?

**Definition:**

Choose a hash table for exact lookup of opaque keys. Choose a trie when the characters themselves are the query, especially prefixes.

**How it works:**

- Hash lookup is expected O(L) to hash the key plus O(1) in the table, with a collision tail. Trie lookup is O(L) with no collision tail and a larger constant if the map is wide.
- Autocomplete, longest prefix, and lexicographic enumeration point at the trie.
- Random ids, cache keys, and records addressed by a primary key point at the hash table.
- A radix tree or a Patricia trie is the compromise when you want prefixes without a node per character.
</details>

<details>
<summary>What is a Suffix Trie, and how does it differ from a standard Trie?</summary>

### What is a Suffix Trie, and how does it differ from a standard Trie?

**Definition:**

A suffix trie inserts every suffix of one text, so any substring is a prefix of some suffix and can be found by a walk.

**How it works:**

- A standard trie stores a dictionary of separate words. A suffix trie stores one string's suffixes, often with an index of where that suffix starts.
- Naively it has O(n²) nodes. A suffix tree compresses unary paths and has O(n) nodes. A suffix array stores the sorted suffixes in O(n) integers.
- Search of a pattern of length m is O(m) in the trie or tree after the build, and reports every occurrence via the leaves below that node.
- Use it for many queries against a fixed text. For one search, KMP is less machinery.

**Examples:**

Text `banana`. The suffix `ana` is inserted, so the pattern `ana` walks that path and can report the start indexes 1 and 3.
</details>

<details>
<summary>How does a Compressed Trie or Radix Tree improve on a standard Trie structure?</summary>

### How does a Compressed Trie or Radix Tree improve on a standard Trie structure?

**Definition:**

</details>

### Advanced Operations in Tries

<details>
<summary>Find the longest common prefix among a set of strings using a Trie.</summary>

### Find the longest common prefix among a set of strings using a Trie.

**Definition:**

</details>

<details>
<summary>Implement an algorithm to count the total number of words stored in a Trie.</summary>

### Implement an algorithm to count the total number of words stored in a Trie.

**Definition:**

</details>

<details>
<summary>List all words with a given prefix stored in a Trie.</summary>

### List all words with a given prefix stored in a Trie.

**Definition:**

</details>

<details>
<summary>Write an algorithm for the word search in a matrix grid using a Trie.</summary>

### Write an algorithm for the word search in a matrix grid using a Trie.

**Definition:**

</details>

### Optimization and Efficiency

<details>
<summary>How can using a Trie reduce the time complexity of searching for a word in a dataset?</summary>

### How can using a Trie reduce the time complexity of searching for a word in a dataset?

**Definition:**

</details>

<details>
<summary>Discuss the space optimizations that can be made in a Trie.</summary>

### Discuss the space optimizations that can be made in a Trie.

**Definition:**

</details>

<details>
<summary>What is Memory Pooling, and how can it make Trie operations more efficient?</summary>

### What is Memory Pooling, and how can it make Trie operations more efficient?

**Definition:**

</details>

### Implementation Challenges

<details>
<summary>How would you serialize and deserialize a trie?</summary>

### How would you serialize and deserialize a trie?

**Definition:**

</details>

<details>
<summary>Implement a Trie that supports wildcard characters ‘?’ and ‘*’ for pattern matching.</summary>

### Implement a Trie that supports wildcard characters ‘?’ and ‘*’ for pattern matching.

**Definition:**

</details>

<details>
<summary>Implement a Trie backed Subsequence Indexing system for a rapid text searching.</summary>

### Implement a Trie backed Subsequence Indexing system for a rapid text searching.

**Definition:**

</details>

<details>
<summary>Design a Trie that supports insert, search, and startsWith operations efficiently.</summary>

### Design a Trie that supports insert, search, and startsWith operations efficiently.

**Definition:**

</details>

<details>
<summary>How can a Balanced Trie be achieved, and what are the factors affecting the balance?</summary>

### How can a Balanced Trie be achieved, and what are the factors affecting the balance?

**Definition:**

</details>
