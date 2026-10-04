# Caching — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [Caching — Interview](./0_sd_caching_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Caching](https://devinterview.io/questions/software-architecture-and-system-design/caching-interview-questions/).

### Caching Fundamentals

<details>
<summary>Define caching in the context of computer programming.</summary>

### Define caching in the context of computer programming.

**Definition:**

A cache stores a copy of data that was expensive to fetch or compute, so the next request can use the copy.

**How it works:**

- The copy sits closer to the reader: CPU cache, process memory, Redis, or a CDN.
- It cuts repeated work and takes load off the origin, at the cost of serving a value that may be older than the source.
- It pays off for hot data, slow computations, and spikes the origin cannot absorb.
- It is the wrong tool when every read must see the latest write.

**Examples:**

```text
miss:  read database, store under key "product:42", return row
hit:   return the stored row, skip the database
```
</details>

<details>
<summary>What are the main purposes of using a cache in a software application?</summary>

### What are the main purposes of using a cache in a software application?

**Definition:**

A cache exists to make repeated work cheap and to keep the system answering when the origin is slow or briefly down.

**How it works:**

- Latency drops because memory is faster than a query or a remote call.
- The origin sees fewer reads, so a spike can be served from the copy.
- A replicated cache can still answer if one cache node dies. That is resilience of the copy, not of the source of truth.
- Expiration and invalidation are how you limit how stale the copy may be.
- Memoizing a pure function, such as a Fibonacci step already computed, is the same idea inside one process.

**Examples:**

```text
fib(n): if n in cache return it
        else compute, store, return
```
</details>

<details>
<summary>Can you explain the concept of cache hit and cache miss?</summary>

### Can you explain the concept of cache hit and cache miss?

**Definition:**

A hit is a lookup that finds a usable copy. A miss is a lookup that does not, so the caller pays the full cost and usually stores the result.

**How it works:**

- A compulsory miss is the first use: the cache is empty for that key.
- A capacity miss happens because the cache was full and an eviction removed a key you needed again.
- A conflict miss happens when two keys land in the same slot and knock each other out, as in a direct-mapped CPU cache.
- A coherence miss happens when another writer invalidated the line you held.
- The hit rate is hits divided by lookups. Raising it is the point of sizing and of the eviction policy.

**Examples:**

Ten lookups, seven served from memory: hit rate 70%. The other three queried the database and filled the cache.
</details>

<details>
<summary>Describe the impact of cache size on performance.</summary>

### Describe the impact of cache size on performance.

**Definition:**

A larger cache holds more keys, so fewer requests miss, until the cache is so large that it costs more than the misses it prevents.

**How it works:**

- Too small: evictions thrash, and the hit rate stays low.
- Large enough for the working set: most hot keys stay, and the origin sees a fraction of the traffic.
- Bigger than the working set: extra memory sits idle. On a small device that memory was needed elsewhere.
- A huge cache is also a huge stale surface. Invalidation and expiration have more keys to get right.
- The eviction policy decides which extra slot helps. Size without a sane policy still throws away the hot key.

**Examples:**

A catalog’s hot 1,000 products fit in memory and the database QPS collapses. Caching all 20 million cold SKUs mostly stores keys nobody asks for.
</details>

<details>
<summary>How does a cache improve data retrieval times?</summary>

### How does a cache improve data retrieval times?

**Definition:**

A cache improves retrieval by answering from a faster tier and by not repeating the slow work.

**How it works:**

- Memory and a local disk beat a round trip to a database or another region.
- A browser cache skips downloading CSS and images that have not changed.
- An in-memory store such as Redis or Memcached serves the hot keys for many app instances.
- A distributed cache spreads those keys across nodes so one machine’s RAM is not the ceiling.
- Fewer origin reads also mean the origin spends less time queuing, so the misses that remain are faster too.
</details>

<details>
<summary>What is the difference between local caching and distributed caching?</summary>

### What is the difference between local caching and distributed caching?

**Definition:**

A local cache lives inside one process and is invisible to the others. A distributed cache is a shared service that many instances read and write.

**How it works:**

- Local has no network hop and is trivial to keep coherent inside that process. Each instance can hold a different value.
- Distributed pays a network hop and can serve the same key from every app node. Copies across cache nodes are often eventually consistent.
- Use local when the data is private to the process, tiny, or latency inside one box dominates.
- Use distributed when many instances must see one value, when the working set is larger than one process, or when a restarted process should not start cold.

**Examples:**

Each web process caches a user’s permissions in a map: fast, and stale until that process restarts. A shared Redis key `perm:7` is what every process sees after an update, once the write reaches Redis.
</details>

<details>
<summary>Explain the concept of cache eviction and mention common strategies.</summary>

### Explain the concept of cache eviction and mention common strategies.

**Definition:**

Eviction is how a full cache chooses a key to drop so a new key can enter.

**How it works:**

- Least recently used drops the key nobody has touched for the longest time. It needs a recency order.
- Least frequently used drops the key with the smallest hit count. The counter is extra work and can stick on a key that was hot once.
- First in, first out drops the oldest resident regardless of use.
- Random is cheap and surprisingly decent when you cannot afford bookkeeping.
- A time-to-live drop is expiration, not pressure from a full cache, and it is often combined with one of the above.

**Examples:**

A map plus a doubly linked list implements LRU: a hit moves the node to the head, and a full insert evicts the tail.
</details>

<details>
<summary>What is a cache key and how is it used?</summary>

### What is a cache key and how is it used?

**Definition:**

A cache key is the identity of a stored value. The same inputs must produce the same key, and different inputs must not collide.

**How it works:**

- A key is often a name plus the arguments: `product:42` or a hash of the query.
- If you forget a varying argument, two users share a value. If you include a useless one, you never hit.
- Normalize order and case before hashing, or `b=1&a=2` and `a=2&b=1` miss each other.
- Do not put secrets in a key that will be logged.

**Examples:**

```text
key = "catalog:" + region + ":" + sku
GET catalog:eu:lamp
```
Leaving `region` out serves the EU price to a US request.
</details>

<details>
<summary>Explain the importance of cache expiration and how it is managed.</summary>

### Explain the importance of cache expiration and how it is managed.

**Definition:**

Expiration bounds how long a copy may be served after the source has changed, even if nobody remembers to invalidate it.

**How it works:**

- A TTL drops the key after a duration from write or from last access.
- A short TTL keeps data fresher and causes more misses. A long TTL does the opposite.
- Expiration is a safety net. Explicit invalidation on write is how you drop a key the moment it is wrong.
- Serve-stale-while-revalidate can return the old value once and refresh in the background, so a miss storm does not hit the origin.

**Examples:**

`SET price:lamp 40 EX 60` means that after a minute the next reader misses and loads the database, whether or not the price changed.
</details>

<details>
<summary>How does cache invalidation work and why is it necessary?</summary>

### How does cache invalidation work and why is it necessary?

**Definition:**

Invalidation removes or replaces a cached value because the source changed. Without it, readers keep a copy that is no longer true until the TTL happens to expire.

**How it works:**

- On a write, delete the key or overwrite it. The next read fills a fresh copy. That is cache-aside invalidation.
- Write-through updates the cache and the database in the same request, so a later read hits the new value.
- Write-behind updates the cache and flushes to the database later. The cache is ahead of the source, and a crash can lose the write.
- In a distributed cache every node that might hold the key has to drop it, or you accept a window of disagreement.
- The hard parts are knowing every key a write affects, and doing that under concurrent updates.

**Examples:**

Updating the lamp price deletes `price:lamp`. The next product page misses, reads 42 from the database, and stores 42. A page that still held 40 would have been wrong.
</details>

### Cache Implementation and Design

<details>
<summary>Describe the steps involved in implementing a basic cache system.</summary>

### Describe the steps involved in implementing a basic cache system.

**Definition:**

A basic cache is a map from key to value, a way to bound its size, and a rule for what happens on a miss.

**How it works:**

- Look up the key. On a hit, return the value and update whatever the eviction policy tracks.
- On a miss, load from the source, store the value, and return it.
- If the map is full, evict one entry first. LRU is the usual default.
- Give each entry a TTL so a forgotten key cannot live forever.
- On a source write, delete the key. Do not let the cache be the only place the new value exists unless you have chosen write-through.

**Examples:**

```text
get(key):
  if key in map and not expired: return map[key]
  value = load(key)
  if map is full: evict least recently used
  map[key] = value
  return value
```
</details>

<details>
<summary>How would you handle cache synchronization in a distributed environment?</summary>

### How would you handle cache synchronization in a distributed environment?

**Definition:**

Synchronization means a write that changes the source also changes, or drops, every cached copy that could still be served.

**How it works:**

- The simplest approach is a short TTL and no active sync. Copies lag, and they heal by expiring.
- Explicit invalidation publishes “drop this key” on a bus, and every app node deletes it from its local cache.
- A shared cache such as Redis is one copy. App nodes do not each keep their own, so there is nothing to fan out except Redis’s own replicas.
- Write-through updates the shared cache as part of the write. Write-behind risks losing updates if the cache dies before the flush.
- Version the value. A reader that sees an older version refetches. That tolerates a missed invalidation message.

**Examples:**

After a price change, the writer deletes the Redis key and publishes `invalidate price:lamp`. Each server drops its local copy. A server that misses the message still expires the local entry after 30 seconds.
</details>

<details>
<summary>Explain the use of hash maps in cache implementation.</summary>

### Explain the use of hash maps in cache implementation.

**Definition:**

A hash map is the usual structure for a cache because the average lookup, insert, and delete are constant time.

**How it works:**

- The key is hashed to a bucket, and the value sits there with its metadata: expiry, hit count, or a pointer into an LRU list.
- The map answers “is this key present?”. It does not by itself know which key is oldest. That is why LRU pairs the map with a linked list.
- Collisions mean two keys share a bucket. The implementation chains them or probes onward. A bad hash makes that a scan.
- Resizing the table costs a pause or incremental work. Bound the entry count so resize is rare.

**Examples:**

```text
buckets[hash("price:lamp") % n] -> {value: 40, expires: t}
get: hash, find node, return value
```
</details>

<details>
<summary>What are some common caching algorithms, and how do they differ?</summary>

### What are some common caching algorithms, and how do they differ?

**Definition:**

The common algorithms differ in which resident they evict when the cache is full, and in how much bookkeeping that choice costs.

**How it works:**

- LRU evicts the least recently used. It tracks recency and fits workloads where the recent past predicts the next read.
- LFU evicts the least frequently used. It fits a stable set of hot keys and can cling to a key that was popular and then went cold.
- FIFO evicts the oldest insertion and ignores later hits. It is simple and weaker when a key is hot.
- MRU evicts the most recently used. It is a niche fit for a scan that will not reuse what it just touched.
- Random evicts any key. It needs almost no metadata.
- TTL is orthogonal: it removes a key because it is old in time, whether or not the cache is full.
</details>

<details>
<summary>Explain the design considerations for a cache that supports high concurrency.</summary>

### Explain the design considerations for a cache that supports high concurrency.

**Definition:**

A concurrent cache must let many readers and writers proceed without turning the map into one global lock.

**How it works:**

- Shard the map by key hash so two keys rarely share a lock. A single mutex around the whole cache serializes every request.
- Prefer concurrent reads. A read-write lock or an immutable snapshot per shard keeps hits off the write path.
- Make the hit-path update of an LRU list cheap, or a popular key’s “move to head” becomes the bottleneck. Sometimes a sampled LRU is enough.
- Atomic put-if-absent stops two misses from both loading the origin and overwriting each other.
- Decide staleness up front. Write-through is fresher and slower. A short TTL with invalidation is usually enough and avoids a distributed transaction.
- Bound memory per shard so one hot shard cannot grow without limit.

**Examples:**

```text
shard = hash(key) % 32
lock only shard
on miss: single-flight the load so 100 waiters share one origin read
```
</details>

<details>
<summary>How would you prevent cache stampede in a high-load application?</summary>

### How would you prevent cache stampede in a high-load application?

**Definition:**

</details>

<details>
<summary>What are the trade-offs between read-heavy and write-heavy caching strategies?</summary>

### What are the trade-offs between read-heavy and write-heavy caching strategies?

**Definition:**

</details>

<details>
<summary>Describe the role of a cache manifest in web applications.</summary>

### Describe the role of a cache manifest in web applications.

**Definition:**

</details>

<details>
<summary>How do you ensure consistency between cache and primary data storage?</summary>

### How do you ensure consistency between cache and primary data storage?

**Definition:**

</details>

<details>
<summary>Explain the use of cache tagging and its benefits.</summary>

### Explain the use of cache tagging and its benefits.

**Definition:**

</details>

### Caching in Distributed Systems

<details>
<summary>Explain distributed caching and its advantages over local caching.</summary>

### Explain distributed caching and its advantages over local caching.

**Definition:**

</details>

<details>
<summary>How do you handle cache partitioning in distributed systems?</summary>

### How do you handle cache partitioning in distributed systems?

**Definition:**

</details>

<details>
<summary>Describe consistency models in distributed caching (e.g., eventual consistency).</summary>

### Describe consistency models in distributed caching (e.g., eventual consistency).

**Definition:**

</details>

<details>
<summary>What is cache replication and how is it typically implemented?</summary>

### What is cache replication and how is it typically implemented?

**Definition:**

</details>

<details>
<summary>Name some strategies to avoid cache coherence issues in distributed systems.</summary>

### Name some strategies to avoid cache coherence issues in distributed systems.

**Definition:**

</details>

<details>
<summary>How do you handle network latency in distributed caching?</summary>

### How do you handle network latency in distributed caching?

**Definition:**

</details>

<details>
<summary>What are the challenges in maintaining a distributed cache?</summary>

### What are the challenges in maintaining a distributed cache?

**Definition:**

</details>

<details>
<summary>Explain the concept of a write-through cache in a distributed environment.</summary>

### Explain the concept of a write-through cache in a distributed environment.

**Definition:**

</details>

<details>
<summary>How does a distributed cache handle node failures?</summary>

### How does a distributed cache handle node failures?

**Definition:**

</details>

<details>
<summary>What is a shared cache, and how does it differ from a distributed cache?</summary>

### What is a shared cache, and how does it differ from a distributed cache?

**Definition:**

</details>

### Advanced Caching Concepts

<details>
<summary>Explain the concept of a content delivery network (CDN) and its relation to caching.</summary>

### Explain the concept of a content delivery network (CDN) and its relation to caching.

**Definition:**

</details>

<details>
<summary>Explain edge caching and its use cases.</summary>

### Explain edge caching and its use cases.

**Definition:**

</details>

<details>
<summary>What is cache warming and when is it used?</summary>

### What is cache warming and when is it used?

**Definition:**

</details>

<details>
<summary>How does query result caching work in database systems?</summary>

### How does query result caching work in database systems?

**Definition:**

</details>

<details>
<summary>Describe object caching and its advantages in object-oriented programming.</summary>

### Describe object caching and its advantages in object-oriented programming.

**Definition:**

</details>

<details>
<summary>Discuss the impact of caching on microservices architecture.</summary>

### Discuss the impact of caching on microservices architecture.

**Definition:**

</details>

<details>
<summary>Explain how caching interacts with serverless computing models.</summary>

### Explain how caching interacts with serverless computing models.

**Definition:**

</details>

<details>
<summary>Describe cache compression techniques and their trade-offs.</summary>

### Describe cache compression techniques and their trade-offs.

**Definition:**

</details>

<details>
<summary>How does machine learning influence caching strategies?</summary>

### How does machine learning influence caching strategies?

**Definition:**

</details>

<details>
<summary>Discuss the role of caching in IoT (Internet of Things) applications.</summary>

### Discuss the role of caching in IoT (Internet of Things) applications.

**Definition:**

</details>

### Caching Tools and Technologies

<details>
<summary>What are some popular caching systems and their key features?</summary>

### What are some popular caching systems and their key features?

**Definition:**

</details>

<details>
<summary>How do you configure cache settings in a web server (e.g., Nginx, Apache)?</summary>

### How do you configure cache settings in a web server (e.g., Nginx, Apache)?

**Definition:**

</details>

<details>
<summary>Explain the role of HTTP headers in web caching.</summary>

### Explain the role of HTTP headers in web caching.

**Definition:**

</details>

<details>
<summary>How do caching mechanisms differ across various programming languages?</summary>

### How do caching mechanisms differ across various programming languages?

**Definition:**

</details>

<details>
<summary>Describe the use of caching in mobile application development.</summary>

### Describe the use of caching in mobile application development.

**Definition:**

</details>

<details>
<summary>What tools are available for monitoring and analyzing cache performance?</summary>

### What tools are available for monitoring and analyzing cache performance?

**Definition:**

</details>

<details>
<summary>Explain the integration of caching in cloud computing services.</summary>

### Explain the integration of caching in cloud computing services.

**Definition:**

</details>

<details>
<summary>How does caching work in content management systems (CMS)?</summary>

### How does caching work in content management systems (CMS)?

**Definition:**

</details>

<details>
<summary>What are the considerations for caching in a serverless architecture?</summary>

### What are the considerations for caching in a serverless architecture?

**Definition:**

</details>

<details>
<summary>Name some caching strategies in big data processing and analytics.</summary>

### Name some caching strategies in big data processing and analytics.

**Definition:**

</details>
