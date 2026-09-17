# Database — SQL

PostgreSQL, joins, indexes, and SQL patterns.

[← Back to hub](./9_database.md)

### Related docs

* [DB — Foundations](./9_database_core.md) · [DB — SQL](./9_database_sql.md) · [DB — NoSQL](./9_database_nosql.md) · [DB — ORM](./9_database_orm.md) · [DB — Production](./9_database_production.md) · [DB — Interview](./9_database_interview.md)

### Sections

- [SQL & PostgreSQL](#sql-postgresql)

---

## SQL & PostgreSQL

<details>
  <summary>SQL</summary>

### SQL

**Definition:** **Structured Query Language** — declarative language for defining and querying relational data. You describe _what_ data you want; the optimizer decides _how_.

**When to use:** Structured data with relationships, reporting, transactions, ad-hoc analytics.

**Pluses and minuses:**

| +                               | −                                    |
| ---------------------------------- | --------------------------------------- |
| Declarative, portable across RDBMS | Dialect differences (Postgres vs MySQL) |
| Mature ecosystem, tooling          | Complex queries become hard to maintain |
| Strong consistency and joins       | Vertical scaling limits on single node  |

**Examples:**

```sql
SELECT u.email, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at >= '2025-01-01'
GROUP BY u.id, u.email
HAVING COUNT(o.id) > 5
ORDER BY order_count DESC
LIMIT 10;
```

**Thoughts:** Apps connect via **drivers** (`pg`, `mysql2`). The query planner uses statistics — stale stats = bad plans. Always parameterize user input.

**Sources:**

[PostgreSQL — SQL commands](https://www.postgresql.org/docs/current/sql-commands.html)

---

</details>

<details>
  <summary>Joins</summary>

### Joins

**Definition:** Combine rows from multiple tables based on related columns.

**How it works:**

Optimizer picks nested loop, hash join, or merge join based on stats and indexes. Join condition in `ON` filters matches; `WHERE` filters after join.

| Join type      | Returns                                           |
| -------------- | ------------------------------------------------- |
| **INNER**      | Rows with matches in both tables                  |
| **LEFT**       | All left rows + matching right (NULL if no match) |
| **RIGHT**      | Mirror of LEFT                                    |
| **FULL OUTER** | All rows from both, NULLs where no match          |
| **CROSS**      | Cartesian product — every left × every right      |

**When to use:**

INNER for required relationships; LEFT when optional related data (e.g. user without orders). `EXISTS` often beats `IN` for large subqueries.

INNER for required relationships; LEFT when optional related data (e.g. user without orders).

**Pluses and minuses:**

| +                              | −                                               |
| --------------------------------- | -------------------------------------------------- |
| Normalized schema, no duplication | Expensive on large tables without indexes          |
| Single query for related data     | Wrong join type = silent data loss (INNER vs LEFT) |

**Examples:**

```sql
-- Users with at least one order (INNER)
SELECT u.id, u.email, o.total
FROM users u
INNER JOIN orders o ON o.user_id = u.id;

-- All users, order total or NULL (LEFT)
SELECT u.id, u.email, o.total
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;

-- EXISTS — often faster than IN for large subqueries
SELECT u.id FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

**Thoughts:** Prefer `EXISTS` over `IN (SELECT ...)` for correlated checks. Avoid `SELECT *` in JOINs — fetch only needed columns.

**Sources:**

[Use The Index, Luke — Joins](https://use-the-index-luke.com/sql/join)

---

</details>

<details>
  <summary>Schema constraints (FK, CHECK, UNIQUE)</summary>

### Schema constraints (FK, CHECK, UNIQUE)

**Definition:** Constraints enforce data integrity at the database layer — not only in application code.

**How it works:**

| Constraint           | Purpose                                                                 |
| -------------------- | ----------------------------------------------------------------------- |
| **PRIMARY KEY**      | Unique row identifier                                                   |
| **FOREIGN KEY (FK)** | Child column must reference existing parent row (or NULL if allowed)    |
| **UNIQUE**           | No duplicate values in column(s)                                        |
| **NOT NULL**         | Column required                                                         |
| **CHECK**            | Boolean expression per row (`price > 0`, `status IN ('open','closed')`) |
| **DEFAULT**          | Value when insert omits column                                          |

| On delete/update         | Effect                               |
| ------------------------ | ------------------------------------ |
| `RESTRICT` / `NO ACTION` | Block if children exist              |
| `CASCADE`                | Delete/update children automatically |
| `SET NULL`               | Nullify FK in children               |

**When to use:** Always FK `orders.user_id → users.id`. Use `CHECK` for enums and positive amounts. `ON DELETE CASCADE` for join tables; `RESTRICT` for orders referencing users.

**Pluses and minuses:**

| +                              | −                                          |
| --------------------------------- | --------------------------------------------- |
| Integrity even if app has bugs    | Migration order matters (parent before child) |
| Self-documenting relationships    | `CASCADE` deletes can surprise                |
| DB rejects bad data at write time | ORM may fight FK during bulk loads            |

**Examples:**

```sql
CREATE TABLE orders (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  total      NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  status     TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'shipped')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_users_email_lower ON users (lower(email));
```

**Thoughts:** Prisma maps `@relation` to FK. Add indexes on FK columns — Postgres does not auto-index FKs.

**Sources:**

[PostgreSQL — Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)

---

</details>

<details>
  <summary>Upsert (ON CONFLICT)</summary>

### Upsert (ON CONFLICT)

**Definition:** **Upsert** inserts a row or updates it if a unique constraint conflicts — atomic "create or update".

**How it works:**

```sql
INSERT INTO users (email, name, updated_at)
VALUES ($1, $2, now())
ON CONFLICT (email)          -- unique index / constraint
DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = now()
RETURNING *;
```

- `ON CONFLICT (columns)` targets a unique constraint.
- `DO NOTHING` — skip silently (idempotent insert).
- `DO UPDATE` — merge; `EXCLUDED` refers to the row that would have been inserted.

**When to use:** Sync external IDs, login "create if not exists", settings row per user, deduplicated event ingestion.

**Pluses and minuses:**

| +                                           | −                                     |
| ---------------------------------------------- | ---------------------------------------- |
| One round trip, race-safe vs check-then-insert | Must have matching unique index          |
| Idempotent sync/import jobs                    | Easy to overwrite fields unintentionally |

**Examples:**

```ts
await prisma.user.upsert({
  where: { email: "a@b.com" },
  create: { email: "a@b.com", name: "Ada" },
  update: { name: "Ada Lovelace" },
});
```

**Thoughts:** MySQL uses `ON DUPLICATE KEY UPDATE`. SQLite supports `ON CONFLICT` similarly. Without unique constraint, upsert is not available — add one first.

**Sources:**

[PostgreSQL — INSERT ON CONFLICT](https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT)

---

</details>

<details>
  <summary>Aggregations & window functions</summary>

### Aggregations & window functions

**Definition:** **Aggregations** collapse rows (`COUNT`, `SUM`, `AVG`). **Window functions** compute across related rows without collapsing the result set.

**When to use:** Rankings, running totals, deduplication, pagination with stable sort.

**Pluses and minuses:**

| +                           | −                                                              |
| ------------------------------ | ----------------------------------------------------------------- |
| Powerful analytics in SQL      | Window functions are Postgres/SQL Server territory — know your DB |
| Offloads work from application | Harder to read than imperative code                               |

**Examples:**

```sql
-- Rank orders per user by amount
SELECT
  user_id,
  id,
  total,
  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total DESC) AS rank
FROM orders;

-- Running total
SELECT
  created_at,
  amount,
  SUM(amount) OVER (ORDER BY created_at) AS running_total
FROM payments;
```

**Thoughts:** `GROUP BY` requires all non-aggregated SELECT columns to be in GROUP BY (or wrapped in aggregate). Window functions run **after** WHERE/GROUP BY.

**Sources:**

[PostgreSQL — Window functions](https://www.postgresql.org/docs/current/tutorial-window.html)

---

</details>

<details>
  <summary>Indexes</summary>

### Indexes

**Definition:**

Data structures (usually **B-tree** in Postgres) that speed up lookups at the cost of write overhead and storage.

| Index type           | Use case                                     |
| -------------------- | -------------------------------------------- |
| **B-tree** (default) | `=`, `<`, `>`, `BETWEEN`, `ORDER BY`         |
| **Hash**             | Equality only (rare in Postgres)             |
| **GIN**              | JSONB, arrays, full-text                     |
| **GiST**             | Geospatial, range types                      |
| **Partial**          | Index subset of rows (`WHERE active = true`) |
| **Composite**        | Multi-column (`user_id, created_at`)         |
| **Covering**         | INCLUDE columns to avoid table lookup        |

**When to use:** Columns in `WHERE`, `JOIN`, `ORDER BY` on large tables. Don't index low-cardinality columns alone (e.g. boolean `is_active`).

**Pluses and minuses:**

| +                                | −                                           |
| ----------------------------------- | ---------------------------------------------- |
| Dramatic read speedups              | Slow INSERT/UPDATE/DELETE on indexed columns   |
| Enables efficient sorting/filtering | Wrong index = wasted space, planner may ignore |
| Unique indexes enforce constraints  | Too many indexes confuse the optimizer         |

**Examples:**

```sql
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);
CREATE INDEX idx_users_active_email ON users (email) WHERE deleted_at IS NULL;
```

**Thoughts:** Indexes don't help `LIKE '%foo%'` (leading wildcard). Use `EXPLAIN ANALYZE` to verify index usage. Drop unused indexes found in `pg_stat_user_indexes`.

**Sources:**

[Use The Index, Luke](https://use-the-index-luke.com/)

---

</details>

<details>
  <summary>Query optimization & EXPLAIN</summary>

### Query optimization & EXPLAIN

**Definition:** Analyze how the database executes a query — scan type, index usage, row estimates, actual timing.

**When to use:** Slow endpoints, before adding indexes, after large data growth or schema change.

**Pluses and minuses:**

| +                                | −                                       |
| ----------------------------------- | ------------------------------------------ |
| Finds missing indexes and bad plans | Output requires practice to read           |
| Cheaper than guessing in production | `ANALYZE` adds load — use on staging first |

**Examples:**

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE user_id = 42 AND status = 'pending';
```

Look for: `Seq Scan` on large tables (bad), `Index Scan` / `Index Only Scan` (good), large `rows` mismatch between estimate and actual (run `ANALYZE`).

**Thoughts:**

- **N+1 at SQL level** — app runs 1 query + N queries in a loop. Fix with JOIN or `WHERE id IN (...)`.
- Avoid `SELECT *`; fetch columns you need.
- Pagination: `OFFSET` is slow at depth — use keyset (`WHERE id > $cursor ORDER BY id LIMIT 20`).

**Sources:**

[PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html)

---

</details>

<details>
  <summary>SQL injection</summary>

### SQL injection

**Definition:** Attacker injects malicious SQL through unsanitized user input, bypassing auth or exfiltrating data.

**When to use:** Always — any user-controlled value in a query.

**Pluses and minuses:**

| + (of prevention)                  | −                                              |
| ------------------------------------- | ------------------------------------------------- |
| Eliminates entire vulnerability class | Requires discipline — one raw string concat fails |
| Parameterized queries are standard    | ORMs can still be misused (`$queryRaw` unsafe)    |

**Examples:**

```js
// VULNERABLE — never do this
const q = `SELECT * FROM users WHERE email = '${email}'`;

// SAFE — parameterized (node-postgres)
await pool.query("SELECT * FROM users WHERE email = $1", [email]);

// SAFE — Prisma
await prisma.user.findUnique({ where: { email } });
```

Attack payload: `email = "' OR '1'='1' --"` turns WHERE into always-true.

**Thoughts:** Also validate input type/length, use least-privilege DB roles (app user cannot `DROP TABLE`), and never expose raw SQL errors to clients. SQL injection is **not** XSS (SQL vs HTML/JS). Frontend escaping does not bind SQL parameters. See [Special — SQL injection](./7_special_security.md#sql-injection).

**Sources:**

[OWASP — SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)

---

</details>

<details>
  <summary>Subqueries & CTEs</summary>

### Subqueries & CTEs

**Definition:**

A **subquery** nests a SELECT inside another query. A **CTE** (Common Table Expression) names a subquery with `WITH` for readability and reuse.

| Feature        | Subquery        | CTE (`WITH`)                 |
| -------------- | --------------- | ---------------------------- |
| Readability    | Can nest deeply | Named, linear                |
| Reuse in query | Limited         | Can reference multiple times |
| Recursion      | No              | Yes (`WITH RECURSIVE`)       |

**When to use:** CTEs for multi-step reports, org trees, readable pipelines. Subqueries for simple filters and `EXISTS` checks.

**Examples:**

```sql
WITH totals AS (
  SELECT user_id, SUM(amount) AS total
  FROM orders GROUP BY user_id
)
SELECT u.email, t.total
FROM users u JOIN totals t ON t.user_id = u.id
WHERE t.total > 1000;

SELECT u.id FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

**Sources:** [PostgreSQL — WITH queries](https://www.postgresql.org/docs/current/queries-with.html)

</details>

<details>
  <summary>Prepared statements & placeholders</summary>

### Prepared statements & placeholders

**Definition:**

A **prepared statement** sends SQL with placeholders (`$1`, `?`) once; values are bound separately — preventing SQL injection.

| Approach                    | Safe? | Notes                              |
| --------------------------- | ----- | ---------------------------------- |
| Parameterized query         | Yes   | `$1`, `?` placeholders             |
| ORM methods                 | Yes   | Prisma `findUnique`, Knex bindings |
| String concatenation        | No    | `'${email}'` is vulnerable         |
| `$queryRaw` tagged template | Yes   | Prisma tagged templates            |

**When to use:** Every query with user-controlled values.

**Examples:**

```ts
await pool.query("SELECT * FROM users WHERE email = $1", [email]);
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${email}`;
```

**Thoughts:** Placeholders handle values only — never parameterize table or column names.

**Sources:** [OWASP — SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

</details>

<details>
  <summary>PostgreSQL</summary>

### PostgreSQL

**Definition:** Open-source RDBMS with strong ACID, extensibility (JSONB, PostGIS, pgvector), and advanced SQL (CTEs, window functions, advisory locks).

**When to use:** Default choice for new backend projects — OLTP, mixed relational + JSON, full-text search (with extensions).

**Pluses and minuses:**

| +                                 | −                                                               |
| ------------------------------------ | ------------------------------------------------------------------ |
| Rich feature set, excellent JSONB    | Single-writer primary — write scaling needs sharding/read replicas |
| Mature extensions ecosystem          | Tuning requires DBA knowledge at scale                             |
| Strong community and hosting options | Connection limits — use pooling (PgBouncer)                        |

**Examples:**

```sql
-- JSONB query
SELECT data->>'name' AS name
FROM products
WHERE data @> '{"category": "electronics"}';

-- Recursive CTE — org tree
WITH RECURSIVE tree AS (
  SELECT id, parent_id, name FROM nodes WHERE parent_id IS NULL
  UNION ALL
  SELECT n.id, n.parent_id, n.name
  FROM nodes n JOIN tree t ON n.parent_id = t.id
)
SELECT * FROM tree;
```

**Thoughts:**

- **Advisory locks** — app-level mutex: `SELECT pg_advisory_lock(123)`.
- **LISTEN/NOTIFY** — lightweight pub/sub inside Postgres (not a replacement for Redis/Kafka).
- **pgvector** — vector similarity search without a separate vector DB for moderate scale.

#### PostgreSQL ops cheatsheet

### PostgreSQL ops cheatsheet

```bash
# macOS (Homebrew)
brew services start postgresql@16
psql -U postgres

# Common psql commands
\l          -- list databases
\dt         -- list tables
\d users    -- describe table
\q          -- quit
```

```sql
CREATE DATABASE myapp;
GRANT ALL PRIVILEGES ON SCHEMA public TO myapp_user;
```

**Sources:** [PostgreSQL documentation](https://www.postgresql.org/docs/current/)

---

</details>

<a name="nosql"></a>
