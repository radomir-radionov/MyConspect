# Hash Tables — Interview

Answers are filled for the published subset; the rest are still empty.
[← Back to hub](./7_special_data_structures.md)

### Related docs

- [Hash Tables — Interview](./7_ds_hash_tables_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Hash Tables](https://devinterview.io/questions/data-structures-and-algorithms/hash-table-data-structure-interview-questions/).

### Basic Hash Table Concepts

<details>
<summary>What is a Hash Table?</summary>

### What is a Hash Table?

**Definition:**

A hash table stores key-value pairs in an array and uses a hash function to turn a key into a bucket index.

**How it works:**

- Lookup, insert, and delete are expected O(1) when keys spread across buckets. One overloaded bucket makes those operations O(n).
- Two keys can hash to the same index. The table needs a collision policy: a chain, or another slot in the array.
- The load factor is the number of keys divided by the number of buckets. Growing the array and rehashing keeps that ratio in a chosen range.
- Keys need a stable hash and an equality test. Mutable keys that change hash after insertion are lost.

**Examples:**

Buckets of size 8. Key `"tea"` hashes to 3 and is stored in bucket 3. A later lookup hashes `"tea"` again and finds that slot.
</details>

<details>
<summary>What is Hashing?</summary>

### What is Hashing?

**Definition:**

Hashing maps a key of any size to a fixed-size integer, then usually reduces that integer to a bucket index.

**How it works:**

- A hash of a password or a file is a fingerprint. A hash inside a table is an index function. The same word covers both, and the requirements differ.
- For a table, equal keys must hash equal, and unequal keys should spread out. A cryptographic hash is slower than a table needs.
- The index is often `hash(key) modulo capacity`, or a mask when the capacity is a power of two.
- A hash is not encryption. It is not meant to be reversed, and a table hash is not meant to resist an attacker unless you asked for that.
</details>

<details>
<summary>Explain the difference between Hashing and Hash Tables.</summary>

### Explain the difference between Hashing and Hash Tables.

**Definition:**

Hashing is the function from key to integer. A hash table is the data structure that stores pairs and resolves collisions with that function.

**How it works:**

- You can hash without a table: checksums, content addresses, hash sets of signatures.
- A table adds buckets, a collision strategy, a load factor, and rehashing.
- A bad function ruins a good table. A perfect function still needs a place to put the value and a plan for growth.
- Sets and maps in standard libraries are hash tables (or trees) that hide the function.
</details>

<details>
<summary>Provide a simple example of a Hash Function.</summary>

### Provide a simple example of a Hash Function.

**Definition:**

A teaching hash folds the bytes of the key into one integer, then reduces it to the bucket count.

**How it works:**

- A polynomial hash treats characters as digits: `h = h × 31 + code` for each character, in a fixed integer width.
- The multiplier spreads nearby strings. A multiplier of 1 just sums codes and collides anagrams.
- The bucket is `h modulo capacity`. If `h` can be negative, take a non-negative remainder.
- This is not a cryptographic hash. It is fast and good enough when keys are not chosen by an attacker.

**Examples:**

```text
"ab" with multiplier 31:
h = 0
h = 31 + 'a'
h = h * 31 + 'b'
bucket = h % 8
```
</details>

<details>
<summary>How do hash tables work under the hood, specifically in languages like Java, Python, and C++?</summary>

### How do hash tables work under the hood, specifically in languages like Java, Python, and C++?

**Definition:**

The standard maps are buckets plus a published hash and equality on the key, with growth when the load crosses a threshold.

**How it works:**

- Java `HashMap` chains entries. In current JDKs a long chain becomes a tree so a collision attack is O(log n) instead of O(n). The index uses a mix of the key's `hashCode`. Null keys are allowed once.
- Python's `dict` is open addressing in a sparse index array that points at a dense entry table. Insertion order is remembered. The hash is salted per process.
- C++ `std::unordered_map` is typically a chain of buckets. `hash` and `equal_to` are template parameters. Worst-case complexity is allowed to be linear.
- All three rehash into a larger table. Iterators and references can be invalidated by that growth, with language-specific rules.
</details>

### Hash Functions and Collisions

<details>
<summary>What are Hash Collisions?</summary>

### What are Hash Collisions?

**Definition:**

A collision is two different keys whose hashes reduce to the same bucket.

**How it works:**

- Pigeonhole says collisions are unavoidable once there are more possible keys than buckets.
- The table must still return the right value, so it compares keys with equality after the hash match.
- A few collisions are normal. A hash that dumps every key into one bucket turns the table into a list.
- An attacker who can pick keys to force one bucket can make lookups linear unless the implementation randomizes or trees the chain.

**Examples:**

Capacity 4. `"a"` and `"e"` both land in bucket 1. Equality then tells them apart inside that bucket.
</details>

<details>
<summary>Name some Collision Handling Techniques.</summary>

### Name some Collision Handling Techniques.

**Definition:**

The two families are chaining, which stores several keys in one bucket, and open addressing, which stores one key per slot and probes for another slot.

**How it works:**

- Separate chaining: each bucket is a list or a small tree.
- Open addressing: linear probing, quadratic probing, or double hashing walk the array until an empty slot appears.
- Robin Hood and cuckoo hashing are open-addressing variants that bound probe length differently.
- Perfect hashing builds a collision-free function for a frozen key set. It does not fit a map that keeps growing.
</details>

<details>
<summary>Describe the characteristics of a good hash function.</summary>

### Describe the characteristics of a good hash function.

**Definition:**

A good table hash is fast, deterministic, and spreads keys so buckets stay short.

**How it works:**

- Equal keys produce the same hash. If equality says two keys match, their hashes must match.
- A one-bit change in the key should move the hash a lot, so similar strings do not share a bucket.
- The function should be cheap next to the rest of the lookup. A cryptographic hash is the wrong default for an in-memory map.
- For untrusted keys, a secret seed stops an attacker from precomputing one bucket. The seed must stay fixed for the life of the table.
</details>

<details>
<summary>What is Separate Chaining, and how does it handle collisions?</summary>

### What is Separate Chaining, and how does it handle collisions?

**Definition:**

Separate chaining gives every bucket its own small collection. Keys that hash there are appended to that collection.

**How it works:**

- Insert hashes to a bucket and walks the chain for an equal key. A match updates the value. A miss appends a node.
- Lookup and delete walk the same chain and compare keys, not only hashes.
- A linked list is the simple chain. A long chain can be converted to a tree, which is what Java does past a threshold.
- Chains make deletion easy and tolerate load factors above 1. They pay an extra pointer per entry and an extra allocation.

**Examples:**

Bucket 2 holds `("cat", 1) -> ("car", 4)`. Looking up `"car"` hashes to 2, skips `"cat"`, and returns 4.
</details>

<details>
<summary>Explain Open Addressing and its different probing techniques.</summary>

### Explain Open Addressing and its different probing techniques.

**Definition:**

Open addressing stores every entry in the bucket array. A collision looks at other indexes according to a probe sequence until it finds the key or an empty slot.

**How it works:**

- Linear probing tries `index + 1`, `index + 2`, and so on, modulo capacity. It is cache-friendly and forms clusters.
- Quadratic probing tries `index + i²`. It spreads clusters and can miss empty slots if the capacity and the step are not chosen so the probe hits every index.
- Double hashing uses a second hash as the step, so different keys that share a start index walk different sequences.
- Deletion cannot leave a truly empty slot in the middle of a probe chain, or later lookups stop too early. A tombstone marks 'continue, but this slot may be reused'.

**Examples:**

Linear probe, capacity 5, both keys want slot 1. The second key is stored at slot 2. Lookup of the second key checks 1, sees a different key, then checks 2.
</details>

### Complexity and Performance

<details>
<summary>Explain the Time and Space Complexity of a Hash Table.</summary>

### Explain the Time and Space Complexity of a Hash Table.

**Definition:**

Average insert, lookup, and delete are O(1). The worst case is O(n) when every key collides. Space is proportional to the number of buckets plus the number of entries.

**How it works:**

- Expected O(1) assumes a hash that spreads keys and a load factor held under a constant by rehashing.
- One rehash copies every entry and is O(n). Across a series of inserts it is amortized O(1) per insert.
- Chaining uses extra pointers. Open addressing uses empty slots, so the array is larger than the entry count.
- Iteration is O(capacity + n) for many layouts, not O(n), because empty buckets are visited.
</details>

<details>
<summary>What is a Load Factor in the context of Hash Tables?</summary>

### What is a Load Factor in the context of Hash Tables?

**Definition:**

The load factor is `n / capacity`: how many entries sit per bucket on average.

**How it works:**

- A low factor means short chains or short probes and more empty memory. A high factor means more collisions.
- Java's `HashMap` defaults to 0.75. Open addressing usually stays lower, because probes get long as the array fills.
- Crossing the threshold allocates a larger array, often about twice as big, and reinserts every key.
- The factor is an average. A bad hash can overload one bucket while the average still looks fine.
</details>

<details>
<summary>How does the load factor affect performance in a hash table?</summary>

### How does the load factor affect performance in a hash table?

**Definition:**

As the load factor grows, the expected chain length or probe length grows, so each operation does more key comparisons.

**How it works:**

- With chaining and a decent hash, expected chain length is about the load factor. Lookup stays O(1) while that factor is a constant, with a larger constant when the factor is 2 than when it is 0.5.
- With open addressing, probe length climbs sharply as the factor approaches 1. A full table cannot insert.
- Rehashing trades a rare O(n) copy for a return to short operations. Doing it too often wastes time. Doing it too late wastes comparisons.
- Cache behavior also changes: a huge sparse table misses more often than a tighter one, even when the probe math looks better.
</details>

<details>
<summary>Discuss different ways to resize a hash table. What is the complexity involved?</summary>

### Discuss different ways to resize a hash table. What is the complexity involved?

**Definition:**

Resizing allocates a new bucket array and inserts every existing key into it, because indexes depend on the capacity.

**How it works:**

- Doubling is the usual growth. The new index is `hash modulo new_capacity`, not a shift of the old index, unless the hash and the power-of-two mask were designed for that.
- One resize is O(n). If you double every time the factor crosses a constant, the copies across n inserts sum to O(n), so each insert pays amortized O(1).
- Growing by a constant number of slots, such as +10, makes the total copy cost quadratic.
- Incremental rehashing moves a few old buckets on each operation so one insert does not pause to copy everything. The steady-state cost is still amortized O(1).
</details>

<details>
<summary>How can the choice of a hash function impact the efficiency of a hash table?</summary>

### How can the choice of a hash function impact the efficiency of a hash table?

**Definition:**

The hash decides the bucket. A function that clumps keys makes every operation walk a long chain no matter how large the table is.

**How it works:**

- A function that only uses the first character puts every word starting with the same letter in one bucket.
- A function that is slow, such as a cryptographic digest on a short in-memory key, dominates the lookup even when buckets are short.
- A function that ignores part of a composite key collides objects that differ only in the ignored field.
- Switching the function requires a full rehash. Mixing in a seed is the usual fix when keys are adversarial.

**Examples:**

Keys `"a1"`, `"a2"`, `"a3"` with a hash of only the first character all land in the bucket of `'a'`. Lookup of any of them scans the whole chain.
</details>

### Cryptographic Hashing

<details>
<summary>What is the difference between a Hash Function and a Cryptographic Hash Function?</summary>

### What is the difference between a Hash Function and a Cryptographic Hash Function?

**Definition:**

</details>

<details>
<summary>What is the role of a Salt in Cryptographic Hashing?</summary>

### What is the role of a Salt in Cryptographic Hashing?

**Definition:**

</details>

<details>
<summary>Explain Types of Resistance in Cryptographic Hash Functions.</summary>

### Explain Types of Resistance in Cryptographic Hash Functions.

**Definition:**

</details>

<details>
<summary>What is MD5?</summary>

### What is MD5?

**Definition:**

</details>

<details>
<summary>What vulnerabilities exist in Hashing Algorithms like MD5 and SHA1?</summary>

### What vulnerabilities exist in Hashing Algorithms like MD5 and SHA1?

**Definition:**

</details>

### Hash Table Usage and Applications

<details>
<summary>Detect if a List is Cyclic using a Hash Table.</summary>

### Detect if a List is Cyclic using a Hash Table.

**Definition:**

</details>

<details>
<summary>Remove Duplicates from an Unsorted Linked List using a hash table.</summary>

### Remove Duplicates from an Unsorted Linked List using a hash table.

**Definition:**

</details>

<details>
<summary>Find Common Elements in two given Linked Lists and return them as a new Linked List using a hash table.</summary>

### Find Common Elements in two given Linked Lists and return them as a new Linked List using a hash table.

**Definition:**

</details>

<details>
<summary>Pair socks from a pile using a Hash Table.</summary>

### Pair socks from a pile using a Hash Table.

**Definition:**

</details>

<details>
<summary>How can hash tables be used in caching implementations? Describe a typical use case.</summary>

### How can hash tables be used in caching implementations? Describe a typical use case.

**Definition:**

</details>

<details>
<summary>Write an algorithm using a hash table to check if two strings are anagrams of each other.</summary>

### Write an algorithm using a hash table to check if two strings are anagrams of each other.

**Definition:**

</details>

<details>
<summary>Implement Autocomplete functionality using Hash Tables.</summary>

### Implement Autocomplete functionality using Hash Tables.

**Definition:**

</details>

<details>
<summary>Describe how a hash table can be used in the implementation of a CDN.</summary>

### Describe how a hash table can be used in the implementation of a CDN.

**Definition:**

</details>

### Hash Table Structures and Variants

<details>
<summary>What is the difference between HashMaps and HashTables in context of Java’s data structures?</summary>

### What is the difference between HashMaps and HashTables in context of Java’s data structures?

**Definition:**

</details>

<details>
<summary>Explain Cuckoo Hashing and when it is advantageous to use.</summary>

### Explain Cuckoo Hashing and when it is advantageous to use.

**Definition:**

</details>

<details>
<summary>What are Skip Lists and how do they compare to hash tables?</summary>

### What are Skip Lists and how do they compare to hash tables?

**Definition:**

</details>

<details>
<summary>Discuss the concept of a Dynamic Perfect Hash Table.</summary>

### Discuss the concept of a Dynamic Perfect Hash Table.

**Definition:**

</details>

<details>
<summary>In what scenarios would you use a Bloom Filter, and how does it relate to hash tables?</summary>

### In what scenarios would you use a Bloom Filter, and how does it relate to hash tables?

**Definition:**

</details>

### Advanced Hash Table Questions

<details>
<summary>What is the Pigeonhole Principle and how does it relate to hashing?</summary>

### What is the Pigeonhole Principle and how does it relate to hashing?

**Definition:**

</details>

<details>
<summary>What are the advantages of Tries over Hash Tables?</summary>

### What are the advantages of Tries over Hash Tables?

**Definition:**

</details>

<details>
<summary>Explain Robin Hood Hashing and its impact on performance and collision resolution.</summary>

### Explain Robin Hood Hashing and its impact on performance and collision resolution.

**Definition:**

</details>

<details>
<summary>What is Linear Hashing and how can it be used to handle growing datasets?</summary>

### What is Linear Hashing and how can it be used to handle growing datasets?

**Definition:**

</details>

<details>
<summary>How are hash tables applied in distributed systems, for example, in consistent hashing algorithms?</summary>

### How are hash tables applied in distributed systems, for example, in consistent hashing algorithms?

**Definition:**

</details>

<details>
<summary>Describe a situation where you would use a hash table over a binary search tree, and why.</summary>

### Describe a situation where you would use a hash table over a binary search tree, and why.

**Definition:**

</details>
