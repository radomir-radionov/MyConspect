# NoSQL — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [NoSQL — Interview](./0_sd_nosql_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — NoSQL](https://devinterview.io/questions/software-architecture-and-system-design/nosql-interview-questions/).

### NoSQL Fundamentals

<details>
<summary>What are the different types of NoSQL databases, with an example of each?</summary>

### What are the different types of NoSQL databases, with an example of each?

**Definition:**

NoSQL is a family of stores that are not built around tables and joins. The usual four are key-value, document, wide-column, and graph.

**How it works:**

- A key-value store maps a key to an opaque value. Redis and DynamoDB are the common examples.
- A document store keeps a JSON-like tree per record, so related fields sit together. MongoDB and Couchbase.
- A wide-column store groups rows by a partition key and allows many sparse columns. Cassandra and Bigtable.
- A graph store treats entities as nodes and relationships as edges you can traverse. Neo4j and Neptune.

**Examples:**

```text
key-value:   session:42 -> {user:7, exp:1800}
document:    {sku:"lamp", tags:["home"], price:{usd:40}}
wide-column: user 7 -> clicks:t1, clicks:t2, ...
graph:       (ada)-[:BOUGHT]->(lamp)
```
</details>

<details>
<summary>Explain eventual consistency and its role in NoSQL databases.</summary>

### Explain eventual consistency and its role in NoSQL databases.

**Definition:**

Eventual consistency means replicas may disagree for a while, and they converge once they have exchanged the missed updates. Many NoSQL systems use it so a write can succeed without every replica.

**How it works:**

- Gossip spreads an update to a few peers, which spread it further, instead of locking every node.
- A timestamp or a vector clock tells a replica which update is newer, or that two updates were concurrent and need a merge.
- Last-writer-wins keeps the later timestamp. Application logic or a type that merges itself is safer when both updates matter.
- Dynamo-style stores (Riak, Cassandra, DynamoDB) made this the default path and then added a per-request consistency level so you can wait for more replicas when you care.

**Examples:**

Two carts add the last lamp while replicas are split. Both writes succeed. After gossip, one cart keeps the lamp and the other is corrected. Until then, reads can disagree.
</details>

<details>
<summary>How is data modeling in NoSQL databases distinct from that in relational databases?</summary>

### How is data modeling in NoSQL databases distinct from that in relational databases?

**Definition:**

Relational modeling normalizes facts into tables and joins them at read time. NoSQL modeling stores the shape one query needs, often as one aggregate, and accepts duplication.

**How it works:**

- A relational schema is fixed ahead of the data and enforced with constraints. A document or key-value record can gain fields without a migration of every row.
- Relational systems aim at ACID transactions across rows. Many NoSQL systems aim at BASE: available, soft state, eventually consistent, with atomicity at one key or one document.
- Relational scale-up is a bigger machine, then careful sharding. NoSQL is usually designed to add nodes and partition the key space.
- Star and snowflake schemas serve analytical joins. A document model embeds the line items inside the order because that is how the app reads them.
- The cost of embedding is stale copies when the same fact lives in many documents.

**Examples:**

```text
SQL:    orders + order_items joined on order_id
document: {orderId, items:[{sku, qty}, {sku, qty}]}
```
</details>

<details>
<summary>What advantages do NoSQL databases offer for managing large volumes of data?</summary>

### What advantages do NoSQL databases offer for managing large volumes of data?

**Definition:**

NoSQL stores large volumes by splitting data across machines and by letting each record carry the fields it actually has, instead of growing one shared schema.

**How it works:**

- Automatic partitioning spreads keys across nodes, so capacity grows by adding machines.
- Replication keeps a copy on another node, so one disk is not the whole dataset.
- A flexible record avoids a table-wide migration when a new attribute appears for only some items.
- Write paths that acknowledge a subset of replicas can take a higher ingest rate than a fully synchronous commit.
- Indexes are built for the known lookups. They are not a substitute for arbitrary joins over the whole set.
- Document, wide-column, key-value, and search engines (MongoDB, Cassandra, DynamoDB, Elasticsearch) each push a different slice of this: flexible records, wide sparse rows, simple keys, or inverted indexes.
</details>

<details>
<summary>When would you choose a NoSQL database over a relational database?</summary>

### When would you choose a NoSQL database over a relational database?

**Definition:**

Choose NoSQL when the access pattern is known, the schema will keep changing, or the write rate needs more machines. Choose a relational database when the value is constraints, joins, and multi-row transactions.

**How it works:**

- A changing document shape, such as a catalog item with optional attributes, fits a document store.
- A huge key space with lookups by key, such as sessions or a time series partitioned by device, fits key-value or wide-column.
- A relationship you traverse, such as “people who bought this also bought”, fits a graph store better than a pile of join tables.
- Money, inventory that must not oversell, and ad-hoc reporting still fit SQL: ACID, foreign keys, and joins.
- An existing stack and team that already operate Postgres is a reason to stay, even if a NoSQL store could also hold the bytes.

**Examples:**

```text
session lookup by id        -> Redis
product with varying attrs  -> MongoDB
ledger                      -> Postgres
```
</details>

<details>
<summary>Describe the various consistency models in NoSQL databases and how they handle transactions and conflict resolution.</summary>

### Describe the various consistency models in NoSQL databases and how they handle transactions and conflict resolution.

**Definition:**

NoSQL consistency is a menu, not one guarantee. The common steps from weak to strong are eventual, causal, read-your-writes, and a quorum that overlaps.

**How it works:**

- Eventual: replicas converge after updates stop. DynamoDB’s default reads and Cassandra at `ONE` sit here.
- Causal: an effect is not visible unless its cause is. Concurrent updates may still need a merge.
- Read-your-writes: a client sees its own latest write, often by sticking to a session or a leader. MongoDB and Couchbase can offer this on the primary.
- A session guarantee is read-your-writes plus monotonic reads for one client, not for every client.
- Conflicts are resolved by a timestamp, by a vector clock that detects concurrency, or by application types that merge.
- A multi-row ACID transaction is not the default. Where it exists, it is usually scoped to one partition or one document, with a slower path for anything wider.

**Examples:**

Two replicas accept different titles for the same product. A vector clock marks them concurrent. The app keeps both and asks a person, instead of silently dropping one by timestamp.
</details>

<details>
<summary>List some NoSQL databases and the primary use cases they address.</summary>

### List some NoSQL databases and the primary use cases they address.

**Definition:**

Pick the store whose data shape matches the question you ask most often, not the one with the broadest marketing label.

**How it works:**

- MongoDB and Couchbase: documents with a flexible shape — content, catalogs, mobile profiles.
- Redis: key lookups in memory — cache, sessions, counters, leaderboards.
- DynamoDB: managed key-value and documents at high throughput, partitioned by key.
- Cassandra and Bigtable: huge sparse rows — time series, logs, event history.
- Neo4j and Neptune: traversals — social graphs, fraud rings, recommendations.
- InfluxDB: measurements over time.
- Elasticsearch: inverted-index search, not a primary ledger.
- ArangoDB and Couchbase can hold more than one model when the app truly needs two shapes.
</details>

### Key-Value Stores

<details>
<summary>How does a key-value store operate, and can you give a use-case example?</summary>

### How does a key-value store operate, and can you give a use-case example?

**Definition:**

A key-value store answers get, put, and delete by a key. The value is opaque to the engine unless you add a feature that looks inside it.

**How it works:**

- The key decides the partition, often by a hash, so the node that owns the key is known without a query planner.
- Reads and writes of one key are the fast path. Asking “every value where city = Oslo” is not, unless a secondary index exists.
- The value can be a string, a blob, or a small document. The store does not join it to another key.
- Sessions are the textbook fit: the session id is the key, and the whole session is the value.

**Examples:**

```text
SET session:91  {"user":7,"cart":["lamp"]}  EX 1800
GET session:91
```
</details>

<details>
<summary>What strategies can be used to scale key-value stores for high demand or large data volumes?</summary>

### What strategies can be used to scale key-value stores for high demand or large data volumes?

**Definition:**

Scale a key-value store by spreading keys across nodes and by keeping each operation a single-key lookup.

**How it works:**

- Consistent hashing places each key on a partition and moves only a slice of keys when a node joins.
- Replication, primary-replica or multi-primary, adds read capacity and a spare copy. DynamoDB partitions by key. Riak and Cassandra replicate around the ring.
- An in-memory engine such as Redis avoids disk on the hot path, and it needs a persistence plan or it loses data on crash.
- Compression and a cache in front (the store itself, or Memcached beside a slower database) cut bytes and repeated reads.
- Secondary indexes and load balancing help lookups that are not the primary key. A hot key still bottlenecks one partition.
- Avoid joins and cross-key transactions. They force coordination the model was built to skip.
</details>

<details>
<summary>What are some drawbacks of key-value stores compared to other NoSQL types?</summary>

### What are some drawbacks of key-value stores compared to other NoSQL types?

**Definition:**

A key-value store is fast because it refuses most questions. That refusal is the drawback next to documents, wide-column stores, and graphs.

**How it works:**

- Without a secondary index you can fetch a value only if you already know the key.
- Relationships are your problem. There is no edge to traverse and no join.
- Aggregations — sums, groups, “top categories this week” — are awkward unless you precompute them into other keys.
- A delete is easy when it is one key, and hard when “delete” means a condition across values the engine cannot see.
- Indexes, where a product adds them, are an extra structure to keep correct, not the native model.
</details>

<details>
<summary>Name a scenario where a key-value store might not be the best fit.</summary>

### Name a scenario where a key-value store might not be the best fit.

**Definition:**

A key-value store is a poor fit when the business rule looks across many records or must reject a write that would break a relationship.

**How it works:**

- Inventory that must not sell the last unit twice needs a constraint or a transaction, not a blind put of a stock key.
- A collaborative document with history, comments, and “who changed this paragraph” is a graph of versions, not one blob.
- A patient chart that must stay consistent with orders, labs, and allergies wants integrity across records.

**Examples:**

Decrementing `stock:lamp` on two app servers at once can drive the value negative if nothing checks the condition atomically. A relational update with `WHERE qty >= 1`, or a document transaction, can refuse the second sale.
</details>

### Document-Oriented Databases

<details>
<summary>What makes a document in a NoSQL database different from a row in a relational database?</summary>

### What makes a document in a NoSQL database different from a row in a relational database?

**Definition:**

A document is a self-contained tree, often JSON, that can nest lists and objects. A relational row is one flat tuple whose repeating groups live in other tables.

**How it works:**

- The document can omit fields and add new ones. A row has the columns of its table.
- One-to-many data is often embedded, so a read of the document needs no join. The trade-off is a larger document and duplicated facts.
- A relational model normalizes and joins. That stays smaller and makes one fact easy to update everywhere.
- Atomicity is natural for a single document. Multi-document transactions exist in engines such as MongoDB, and they cost more than a single-document write.
- A relational engine’s strength is a transaction that covers many rows with constraints.

**Examples:**

```json
{"orderId": 9, "items": [{"sku": "lamp", "qty": 1}, {"sku": "bulb", "qty": 4}]}
```
The same data in SQL is one orders row plus two order_items rows.
</details>

<details>
<summary>How does indexing work in document-oriented databases?</summary>

### How does indexing work in document-oriented databases?

**Definition:**

An index is a side structure, usually a B-tree, that maps a field value to the documents that contain it so a query does not scan the whole collection.

**How it works:**

- The engine keeps index keys in order. A lookup or a range walks the tree instead of every document.
- A multikey index emits one entry per element of an array, so a document can appear under several keys.
- Dotted paths index a nested field, such as `address.city`.
- Every index speeds a matching query and slows writes, because the write must update the index too.
- Some engines use an LSM tree instead of a B-tree. The idea is the same: a structure beside the documents, not a scan.

**Examples:**

An index on `sku` turns “find the lamp” into a tree lookup. An index on `tags` stores one entry for each tag in the array, so the same document is found by `home` or by `sale`.
</details>

<details>
<summary>Give an example of a query in a document-oriented database.</summary>

### Give an example of a query in a document-oriented database.

**Definition:**

A document query names the fields to match, including nested fields with a dotted path, and the engine uses an index if one exists.

**How it works:**

- Equality, comparison, and array operators live in the query document, not in a join clause.
- A nested field is `address.city`, not a second table.
- A projection can return only the fields the caller needs.
- Without an index the same query still works, as a collection scan.

**Examples:**

```js
db.orders.find(
  { status: "open", "shipTo.city": "Bergen", total: { $gt: 100 } },
  { orderId: 1, total: 1 }
)
```
</details>

<details>
<summary>Suggest a typical application for a document-oriented database.</summary>

### Suggest a typical application for a document-oriented database.

**Definition:**

A content or catalog system is a natural document application: each item is one tree, items do not share one rigid set of fields, and the app loads an item as a whole.

**How it works:**

- A CMS stores an article with a body, a list of tags, and optional blocks that differ per article.
- A product catalog stores attributes that exist only for some products, such as screen size or roast level.
- The document is the unit of read and of a single-item update, which matches how the screen is built.
- It is a weaker fit when many items must be updated together under a constraint, such as moving money between accounts.

**Examples:**

```json
{"slug": "harbor-lamp", "blocks": [{"type": "p", "text": "..."}], "tags": ["home"]}
```
The next article can add a `blocks` entry of type `video` without altering a table.
</details>

<details>
<summary>How do document databases handle schema changes and migration?</summary>

### How do document databases handle schema changes and migration?

**Definition:**

</details>

### Column-Family Stores

<details>
<summary>Describe the data structure in a column-family store and how it supports certain query types.</summary>

### Describe the data structure in a column-family store and how it supports certain query types.

**Definition:**

</details>

<details>
<summary>Name a popular column-family store and its key features that contribute to its performance.</summary>

### Name a popular column-family store and its key features that contribute to its performance.

**Definition:**

</details>

<details>
<summary>How are data partitioning and distribution handled in column-family stores?</summary>

### How are data partitioning and distribution handled in column-family stores?

**Definition:**

</details>

### Graph Databases

<details>
<summary>Explain the data representation in a graph database.</summary>

### Explain the data representation in a graph database.

**Definition:**

</details>

<details>
<summary>Compare querying in graph databases with other NoSQL database types.</summary>

### Compare querying in graph databases with other NoSQL database types.

**Definition:**

</details>

<details>
<summary>Suggest a real-world problem that fits a graph database solution.</summary>

### Suggest a real-world problem that fits a graph database solution.

**Definition:**

</details>

<details>
<summary>Define the role of an edge in a graph database and its relationship with nodes.</summary>

### Define the role of an edge in a graph database and its relationship with nodes.

**Definition:**

</details>

### Data Consistency & Replication

<details>
<summary>What replication strategies are often used in NoSQL databases?</summary>

### What replication strategies are often used in NoSQL databases?

**Definition:**

</details>

<details>
<summary>What are quorum reads/writes and their impact on consistency in NoSQL databases?</summary>

### What are quorum reads/writes and their impact on consistency in NoSQL databases?

**Definition:**

</details>

<details>
<summary>Describe how NoSQL databases maintain consistency during network issues.</summary>

### Describe how NoSQL databases maintain consistency during network issues.

**Definition:**

</details>

### Scalability & Performance

<details>
<summary>Explain common data sharding strategies in NoSQL databases and their impact on system performance.</summary>

### Explain common data sharding strategies in NoSQL databases and their impact on system performance.

**Definition:**

</details>

<details>
<summary>How is load balancing achieved in NoSQL database environments?</summary>

### How is load balancing achieved in NoSQL database environments?

**Definition:**

</details>

<details>
<summary>Discuss the role of caching in NoSQL database performance enhancement.</summary>

### Discuss the role of caching in NoSQL database performance enhancement.

**Definition:**

</details>

<details>
<summary>What approaches do NoSQL databases use to ensure high availability?</summary>

### What approaches do NoSQL databases use to ensure high availability?

**Definition:**

</details>

### Querying and Data Manipulation

<details>
<summary>How do NoSQL databases manage complex queries, such as those requiring join operations?</summary>

### How do NoSQL databases manage complex queries, such as those requiring join operations?

**Definition:**

</details>

<details>
<summary>What is map-reduce, and how is it utilized within NoSQL databases?</summary>

### What is map-reduce, and how is it utilized within NoSQL databases?

**Definition:**

</details>

<details>
<summary>Are transactions supported by NoSQL databases, and if so, how are they implemented?</summary>

### Are transactions supported by NoSQL databases, and if so, how are they implemented?

**Definition:**

</details>

### Indexing and Storage Strategies

<details>
<summary>Compare indexing strategies between NoSQL and traditional relational databases.</summary>

### Compare indexing strategies between NoSQL and traditional relational databases.

**Definition:**

</details>

<details>
<summary>How do different storage formats, like JSON, BSON, or binary, affect the performance and flexibility of NoSQL databases?</summary>

### How do different storage formats, like JSON, BSON, or binary, affect the performance and flexibility of NoSQL databases?

**Definition:**

</details>
