# DB — NoSQL

MongoDB, Redis, Elasticsearch, and store selection.

[← Back to hub](./9_database.md)

### Related docs

* [DB — Foundations](./9_database_core.md) · [DB — SQL](./9_database_sql.md) · [DB — NoSQL](./9_database_nosql.md) · [DB — ORM](./9_database_orm.md) · [DB — Production](./9_database_production.md) · [DB — Interview](./9_database_interview.md)

### Sections

- [NoSQL](#nosql)

---

## NoSQL

<details>
  <summary>NoSQL (concept)</summary>

### NoSQL (concept)

**Definition:** Non-relational databases optimized for flexible schemas, horizontal scale, or specialized access patterns — document, key-value, column, graph.

**When to use:** Rapidly evolving documents, high write throughput, embedded data, cache/session layers — not as default replacement for Postgres.

**Pluses and minuses:**

| +                                  | −                                             |
| ------------------------------------- | ------------------------------------------------ |
| Schema flexibility, fast iteration    | Weaker default consistency guarantees            |
| Horizontal scaling built-in           | No universal query language                      |
| Good fit for nested/hierarchical data | Joins and cross-document transactions are harder |

**Examples:** E-commerce product catalog with varying attributes per category — document store avoids sparse columns.

**Thoughts:** "Schema-less" means schema is **in application code** — undocumented and harder to enforce. Define schemas (Mongoose, Zod) anyway.

**Sources:**

[MongoDB — Data modeling](https://www.mongodb.com/docs/manual/core/data-modeling-introduction/)

---

</details>

<details>
  <summary>MongoDB</summary>

### MongoDB

**Definition:** Document-oriented database storing BSON (binary JSON) documents in collections.

**When to use:** Content management, catalogs with variable fields, real-time analytics pipelines, mobile sync with embedded documents.

**Pluses and minuses:**

| +                              | −                                              |
| --------------------------------- | ------------------------------------------------- |
| Flexible nested documents         | Document size limit (16 MB)                       |
| Horizontal sharding, replica sets | Multi-document ACID only since 4.0 (with caveats) |
| Rich aggregation pipeline         | Memory usage for large aggregations               |

**Examples:**

```js
// Aggregation pipeline
db.orders.aggregate([
  {
    $match: { status: "completed", createdAt: { $gte: ISODate("2025-01-01") } },
  },
  {
    $group: { _id: "$userId", total: { $sum: "$amount" }, count: { $sum: 1 } },
  },
  { $sort: { total: -1 } },
  { $limit: 10 },
]);
```

**Thoughts:**

- **Replica set** — primary + secondaries, automatic failover.
- **Sharding** — partition by shard key; choose key carefully (avoid monotonic `_id` hot spots).
- Embed vs reference: embed for data read together; reference for unbounded growth.

**Sources:**

[MongoDB manual](https://www.mongodb.com/docs/manual/)

---

</details>

<details>
  <summary>Mongoose</summary>

### Mongoose

**Definition:** ODM (Object Document Mapper) for MongoDB in Node.js — schemas, validation, middleware, population.

**When to use:** Node.js apps with MongoDB needing validation, hooks, and typed models.

**Pluses and minuses:**

| +                              | −                                            |
| --------------------------------- | ----------------------------------------------- |
| Schema enforcement on flexible DB | Abstraction leaks — know MongoDB query language |
| Middleware hooks (pre/post save)  | `populate()` can cause N+1                      |
| TypeScript support via generics   | Heavy models for simple CRUD                    |

**Examples:**

```ts
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  // hash password, normalize email, etc.
});

const User = model("User", userSchema);
await User.findOne({ email }).populate("orders");
```

**Thoughts:** Use `.lean()` for read-only queries (plain objects, faster). Index fields used in `find()` and `sort()`.

**Sources:**

[Mongoose docs](https://mongoosejs.com/docs/guide.html)

---

</details>

<details>
  <summary>Redis</summary>

### Redis

**Definition:** In-memory data structure store — strings, hashes, lists, sets, sorted sets, streams — with optional persistence and clustering.

**When to use:** Cache, session store, rate limiting, pub/sub, job queues (with Bull/BullMQ), real-time leaderboards.

**Pluses and minuses:**

| +                                         | −                                             |
| -------------------------------------------- | ------------------------------------------------ |
| Sub-millisecond latency                      | Data primarily in RAM — cost at scale            |
| Rich primitives (TTL, pub/sub, leaderboards) | Not a primary database for durable business data |
| Simple replication and clustering            | Persistence modes trade durability vs speed      |

**Examples:**

```js
async function getUser(id) {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const user = await db.user.findUnique({ where: { id } });
  await redis.setex(`user:${id}`, 3600, JSON.stringify(user));
  return user;
}
```

**Thoughts:**

- Set TTL on cache keys — unbounded keys = memory exhaustion.
- `KEYS *` blocks production — use `SCAN`.
- `FLUSHALL` in production = incident. Restrict CLI access.

#### Redis CLI commands

### Redis CLI commands

```
TTL mykey          -- seconds until expiry (-1 = no expiry, -2 = missing)
SCAN 0 MATCH user:* COUNT 100
DEL mykey
```

```bash
docker exec -it <container> redis-cli
```

**Sources:** [Redis documentation](https://redis.io/docs/)

---

</details>

<a name="elasticsearch"></a>

<details>
  <summary>Elasticsearch</summary>

### Elasticsearch

**Definition:** Distributed search/analytics engine (Lucene + JSON REST). Index JSON docs, then query with relevance, filters, and analyzers. Grouped with NoSQL, but the job is **search**, not OLTP.

**How it works:**

- **Cluster / node / index / shard.** An index splits into **primary shards**; **replicas** copy them. Coordinators route; the cluster rebalances. `GET http://localhost:9200` (HTTPS if security is on).
- **Near real-time.** Searchable after refresh (default ~1s). Force `refresh` in tests only.
- **Analyzer** (index + search): character filters → **tokenizer** → token filters (`lowercase`, stop, stemmer, shingle n-grams).
- **Mapping:** `text` = analyzed full-text; `keyword` = exact (ids, filters, sorts). Multi-fields can be both.

`match` (analyzed); `match_phrase` + **`slop`**; `bool` (`must` / `should` / `filter` / `must_not`); **`boost`**; `function_score` only if you need scoring functions. Bulk: `client.bulk`.

**When to use:**

Catalog search, ELK logs, autocomplete, geo + full-text — when Postgres `LIKE '%x%'` / FTS is too weak.

**Example** (`@elastic/elasticsearch` v8 — `mappings` / `document` at top level, not nested `body`):

```js
import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: "https://localhost:9200",
  auth: { username: "elastic", password: process.env.ES_PASSWORD },
});

await client.indices.create({
  index: "products",
  mappings: {
    properties: {
      id: { type: "keyword" },
      name: { type: "text" },
    },
  },
});

await client.index({
  index: "products",
  refresh: true, // tests only
  document: { id: "1", name: "Apple iPhone 12" },
});

const { hits } = await client.search({
  index: "products",
  query: {
    bool: {
      should: [
        { match: { name: "iPhone" } },
        { match_phrase: { name: { query: "iPhone Pro", slop: 3, boost: 10 } } },
      ],
    },
  },
});
console.log(hits.hits); // [{ _id, _score, _source }]
```

#### Common pitfalls

v7 `body: { query }` vs v8 flattened fields. Mapping is sticky — plan `text` vs `keyword`. Search before refresh → 0 hits. Dual-write/outbox from Postgres/Mongo; ES is a **search replica**.

**Pluses and minuses:**

| + | − |
| --- | --- |
| Relevance, morphology, scale, replicas | Eventual consistency vs primary DB |
| Query DSL + official JS client | Ops, mapping changes, not a money SoT |

**Thoughts:** Tokenize at index time, score against the inverted index — keep money/orders in OLTP.

**Sources:**

[Elasticsearch 8.19 — text analysis](https://www.elastic.co/guide/en/elasticsearch/reference/8.19/analysis.html) · [match_phrase](https://www.elastic.co/guide/en/elasticsearch/reference/8.19/query-dsl-match-query-phrase.html) · [elasticsearch-js](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)

---

</details>
<details>
  <summary>DB selection matrix</summary>

### DB selection matrix

**Definition:**

Decision guide for picking a data store per workload.

| Need                                  | Choose                                             | Avoid                                 |
| ------------------------------------- | -------------------------------------------------- | ------------------------------------- |
| Transactions, joins, reporting        | **PostgreSQL**                                     | Mongo for relational data             |
| Flexible nested documents             | **MongoDB**                                        | Postgres JSONB if queries stay simple |
| Cache, sessions, rate limits          | **Redis**                                          | Postgres for hot ephemeral data       |
| Full-text search at scale             | **[Elasticsearch](#elasticsearch)** / Postgres FTS | `LIKE '%x%'` on millions of rows      |
| Async service communication           | **Kafka** / **RabbitMQ**                           | Database as message bus               |
| Graph traversals (friends-of-friends) | **Neo4j**                                          | Recursive SQL on deep trees           |
| Time-series metrics                   | **TimescaleDB** / **InfluxDB**                     | Plain Postgres without partitioning   |

**Thoughts:** Default stack for most Node apps: **Postgres + Redis + (optional) queue**. Add Mongo only when document model wins measurably.

**Sources:**

[ByteByteGo — Database types](https://blog.bytebytego.com/p/understanding-database-types)

---

</details>

<a name="orm"></a>
