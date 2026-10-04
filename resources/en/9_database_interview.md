# Database — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./9_database.md)

### Related docs

- [DB — Foundations](./9_database_core.md) · [DB — SQL](./9_database_sql.md) · [DB — NoSQL](./9_database_nosql.md) · [DB — ORM](./9_database_orm.md) · [DB — Production](./9_database_production.md) · [DB — Interview](./9_database_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — SQL](https://devinterview.io/questions/web-and-mobile-development/sql-interview-questions/).

### SQL Fundamentals

<details>
<summary>What is SQL and what is it used for?</summary>

### What is SQL and what is it used for?

**Definition:**

SQL is the language for defining and querying relational data. You declare tables and constraints, change rows, and ask questions that the engine answers as sets.

**How it works:**

- DDL (`CREATE`, `ALTER`, `DROP`) defines schema objects. DML (`INSERT`, `UPDATE`, `DELETE`, `MERGE`) changes rows.
- DQL is the `SELECT` that reads. DCL (`GRANT`, `REVOKE`) controls who may do what. TCL (`BEGIN`, `COMMIT`, `ROLLBACK`) groups changes into a transaction.
- A relational engine checks types and constraints and uses indexes to avoid reading every row.
- ACID transactions make a group of writes succeed or fail together and become durable after commit.
- The same statement runs on PostgreSQL, MySQL, and SQL Server with small dialect differences in types, `LIMIT`, and upsert syntax.

**Examples:**

```sql
SELECT customer_id, SUM(total) AS spent
FROM orders
WHERE placed_at >= DATE '2026-01-01'
GROUP BY customer_id;
```

**Sources:**

- [PostgreSQL — SQL syntax](https://www.postgresql.org/docs/current/sql-syntax.html)
</details>

<details>
<summary>Describe the difference between SQL and NoSQL databases.</summary>

### Describe the difference between SQL and NoSQL databases.

**Definition:**

SQL databases store rows in tables with a declared schema and answer questions by joining those tables. NoSQL is a family of stores that drop that single table model to scale or to hold a different shape of data.

**How it works:**

- A relational schema fixes columns and relationships up front. Constraints and multi-row transactions are the default tool for integrity.
- Document stores keep a JSON-like document per key. Key-value stores keep an opaque value. Wide-column stores keep sparse rows. Graph stores keep nodes and edges.
- Relational systems have long favored scaling up and read replicas. Distributed SQL engines also shard while keeping SQL transactions. Many NoSQL systems shard first and offer a weaker consistency choice.
- PostgreSQL can store JSON next to relational columns. That does not turn it into a document database; the query language is still SQL.
- Pick tables when the data is related and you need strong constraints. Pick a document or key-value store when the access pattern is “load this blob by id” and joins are rare.

**Sources:**

- [PostgreSQL — Tutorial](https://www.postgresql.org/docs/current/tutorial-concepts.html)
</details>

<details>
<summary>What are the different types of SQL commands?</summary>

### What are the different types of SQL commands?

**Definition:**

SQL statements fall into groups by job: defining objects, changing rows, reading them, granting access, and controlling transactions.

**How it works:**

- DQL: `SELECT`, with `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, joins, and `WITH` for common table expressions.
- DDL: `CREATE`, `ALTER`, `DROP`. `TRUNCATE` removes all rows quickly and is treated as a schema-level operation in several engines.
- DML: `INSERT`, `UPDATE`, `DELETE`, and `MERGE` (insert or update in one statement).
- TCL: `COMMIT` makes work durable, `ROLLBACK` undoes it, `SAVEPOINT` marks a point inside the transaction.
- DCL: `GRANT` and `REVOKE` assign privileges. Roles group those privileges.
- The labels are a teaching split. A real script mixes them, and a `SELECT` can sit inside an `INSERT`.

**Examples:**

```sql
BEGIN;
UPDATE accounts SET balance = balance - 20 WHERE id = 7;
UPDATE accounts SET balance = balance + 20 WHERE id = 9;
COMMIT;
```

**Sources:**

- [PostgreSQL — SQL commands](https://www.postgresql.org/docs/current/sql-commands.html)
</details>

<details>
<summary>Explain the purpose of the SELECT statement.</summary>

### Explain the purpose of the SELECT statement.

**Definition:**

`SELECT` reads rows and returns a result set. It does not change stored data. The clause order you write is not the order the engine logically applies.

**How it works:**

- Logical order: `FROM` and joins, `WHERE`, `GROUP BY`, `HAVING`, window functions, `SELECT` list, `DISTINCT`, `ORDER BY`, then `LIMIT`.
- The select list can compute expressions, aggregates, and `CASE`. `SELECT *` is convenient and brittle when columns change.
- `WITH` names a subquery so a later clause can use it, including a recursive walk of a tree.
- Window functions (`OVER (PARTITION BY ...)`) compute a value per row without collapsing the group the way `GROUP BY` does.
- The planner may use an index, a sequential scan, or a join strategy. The statement describes the result, not the access path.

**Examples:**

```sql
SELECT id, total,
       SUM(total) OVER (PARTITION BY customer_id) AS customer_spent
FROM orders
WHERE status = 'paid';
```

**Sources:**

- [PostgreSQL — SELECT](https://www.postgresql.org/docs/current/sql-select.html)
</details>

<details>
<summary>What is the difference between WHERE and HAVING clauses?</summary>

### What is the difference between WHERE and HAVING clauses?

**Definition:**

`WHERE` filters rows before they are grouped. `HAVING` filters groups after aggregates are computed. Aggregates are legal in `HAVING` and not in `WHERE`.

**How it works:**

- `WHERE status = 'paid'` drops unpaid orders before `SUM` runs, so the aggregate is cheaper and can use an index on `status`.
- `HAVING SUM(total) > 100` keeps only groups whose sum clears the bar. The sum does not exist yet at `WHERE` time.
- You can use both: filter rows, group, then filter groups.
- A condition on a plain column belongs in `WHERE`. Putting it in `HAVING` forces the engine to build groups it will throw away.
- `GROUP BY` is what creates the buckets `HAVING` sees. Without grouping, `HAVING` is rarely what you want.

**Examples:**

```sql
SELECT customer_id, SUM(total) AS spent
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
HAVING SUM(total) > 100;
```

**Sources:**

- [PostgreSQL — SELECT](https://www.postgresql.org/docs/current/sql-select.html)
</details>

<details>
<summary>Define what a JOIN is in SQL and list its types.</summary>

### Define what a JOIN is in SQL and list its types.

**Definition:**

A join combines rows from two tables by a matching condition, usually a foreign key equal to a primary key. The join type decides what happens to rows that have no partner.

**How it works:**

- `INNER JOIN` keeps only pairs that match.
- `LEFT JOIN` keeps every row from the left table and fills the right side with nulls when nothing matches. `RIGHT JOIN` is the mirror. `FULL JOIN` keeps unmatched rows from both sides.
- `CROSS JOIN` forms every pair and has no match condition. It multiplies the row counts.
- A self-join uses the same table twice under two aliases, for example an employee and their manager.
- List the columns you need. `SELECT *` across a join duplicates key columns and breaks if either table grows.
- In PostgreSQL the primary key is not a clustered index. The planner can hash-join, merge-join, or nest loops; an index on the join column helps the last two.

**Examples:**

```sql
SELECT e.name, m.name AS manager
FROM employees AS e
LEFT JOIN employees AS m ON m.id = e.manager_id;
```

**Sources:**

- [PostgreSQL — Table expressions](https://www.postgresql.org/docs/current/queries-table-expressions.html)
</details>

<details>
<summary>What is a primary key in a database?</summary>

### What is a primary key in a database?

**Definition:**

A primary key is the column or column set that identifies one row. The engine rejects a second row with the same key and rejects nulls in those columns.

**How it works:**

- Uniqueness and `NOT NULL` are enforced. Updating a primary key is legal and usually a mistake, because every foreign key that points at it must move too.
- Other tables reference it. That is what makes a join mean “this child belongs to that parent”.
- InnoDB and SQL Server often store the table in primary-key order (a clustered index). PostgreSQL stores a heap and adds a unique B-tree index for the primary key. Those are not the same layout.
- A surrogate key (`bigint` identity, or a time-ordered UUID) stays stable when a business attribute such as email changes. A natural key is fine when the attribute truly never changes.
- Narrow keys keep indexes smaller. A wide text primary key is copied into every secondary index that points back at the row.

**Examples:**

```sql
CREATE TABLE customers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE
);
```

**Sources:**

- [PostgreSQL — Primary keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-PRIMARY-KEYS)
</details>

<details>
<summary>Explain what a foreign key is and how it is used.</summary>

### Explain what a foreign key is and how it is used.

**Definition:**

A foreign key is a column whose values must match a candidate key in another table, or be null. It is how the database, not only the application, keeps relationships honest.

**How it works:**

- Inserting a child row whose parent id does not exist fails. Deleting a parent fails while children point at it, unless you set `ON DELETE CASCADE`, `SET NULL`, or `SET DEFAULT`.
- `ON UPDATE` has the same choices when the parent key changes.
- Nulls are allowed unless the column is also `NOT NULL`. A null foreign key means “no parent”, not “a parent we forgot”.
- In PostgreSQL a foreign key is not indexed automatically. Add an index on the child column or deletes and joins on that column scan the child table.
- The parent side must be a primary key or a unique constraint. A foreign key cannot point at an arbitrary non-unique column.
- Cross-database foreign keys do not exist. Integrity across services is an application problem.

**Examples:**

```sql
CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint NOT NULL REFERENCES customers (id)
);
CREATE INDEX ON orders (customer_id);
```

**Sources:**

- [PostgreSQL — Foreign keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK)
</details>

<details>
<summary>How can you prevent SQL injections?</summary>

### How can you prevent SQL injections?

**Definition:**

SQL injection happens when untrusted text is concatenated into a statement and the engine parses it as SQL. The fix is to send the statement shape and the values separately.

**How it works:**

- A parameterized query, or a prepared statement, uses placeholders (`$1`, `?`). The driver binds values so a quote in the input cannot close the string.
- Stored procedures help only if they also take parameters. Building SQL inside the procedure by concatenation is still injectable.
- Validate shape where you can: an enum of sort columns, an integer cast for an id. Allow-lists beat block-lists for identifiers, which cannot be bound as values.
- The database role should not own the schema or read other tenants’ tables. A bug then cannot `DROP` what the role cannot see.
- ORMs are safe when they parameterize. String-built `.raw()` queries are not.
- Escaping quotes by hand fails on encodings and on identifiers. Do not do it as the main defense.

**Examples:**

```sql
PREPARE find_user (text) AS
  SELECT id FROM users WHERE email = $1;
EXECUTE find_user('ada@example.com');
```

**Sources:**

- [OWASP — SQL injection](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
</details>

<details>
<summary>What is normalization? Explain with examples.</summary>

### What is normalization? Explain with examples.

**Definition:**

Normalization splits tables so each fact is stored once and depends on the key that identifies it. The usual target for transactional data is third normal form.

**How it works:**

- First normal form: each column holds one value, not a list stuffed into a cell. An order’s lines become rows in another table.
- Second normal form: on a composite key, every non-key column depends on the whole key, not on part of it. A product’s name does not belong on an order-line table whose key is `(order_id, product_id)` if the name depends only on `product_id`.
- Third normal form: a non-key column does not depend on another non-key column. A customer’s city does not belong on the order if it depends on the customer, not on the order.
- Boyce-Codd is a stricter form of the same idea. Fourth normal form removes independent multi-valued facts from one table.
- The cost is more joins. That is usually cheaper than updating the same address in five rows and missing one.

**Examples:**

```text
orders(id, customer_id, placed_at)
order_lines(order_id, product_id, qty)
customers(id, name)
```

**Sources:**

- [PostgreSQL — Constraints and schema](https://www.postgresql.org/docs/current/ddl-constraints.html)
</details>

<details>
<summary>Describe the concept of denormalization and when you would use it.</summary>

### Describe the concept of denormalization and when you would use it.

**Definition:**

Denormalization copies a fact into another table, or precomputes an aggregate, so a read does not join or scan as much. You accept extra writes to make that read cheaper.

**How it works:**

- A reporting table may store `customer_name` on each order so a dashboard does not join `customers` for every row.
- A counter column (`comment_count`) avoids `COUNT(*)` on the hot path. The write path must update it in the same transaction or it drifts.
- Materialized views and summary tables are controlled copies. Refresh them on a schedule or on the write.
- Search and analytics stores often denormalize on purpose. The transactional store can stay normalized and feed them.
- The risks are stale copies, heavier writes, and a schema that is harder to change because the same fact lives in several places.

**Sources:**

- [PostgreSQL — Materialized views](https://www.postgresql.org/docs/current/rules-materializedviews.html)
</details>

<details>
<summary>What are indexes and how can they improve query performance?</summary>

### What are indexes and how can they improve query performance?

**Definition:**

An index is a structure the planner can use to find rows without reading the whole table. It speeds searches, sorts, and joins, and it slows writes because every change must update the index too.

**How it works:**

- A B-tree, the default in PostgreSQL, supports equality and range lookups and can deliver rows in key order so an `ORDER BY` skips a separate sort.
- A covering index includes every column the query needs, so the engine does not visit the heap for those rows.
- Hash indexes fit equality only. GIN and GiST serve full text, JSON, and geometric data. BRIN is a tiny index of value ranges per block, useful for huge naturally ordered tables.
- Low selectivity (a boolean that is true for most rows) often makes a sequential scan cheaper. The planner is allowed to ignore your index.
- Every extra index costs space and write time. Index the columns in `WHERE`, `JOIN`, and `ORDER BY`, then check the plan with `EXPLAIN`.
- In PostgreSQL a primary key is a unique B-tree plus `NOT NULL`, not a command to physically cluster the heap.

**Examples:**

```sql
CREATE INDEX orders_customer_idx ON orders (customer_id);
EXPLAIN SELECT * FROM orders WHERE customer_id = 7;
```

**Sources:**

- [PostgreSQL — Indexes](https://www.postgresql.org/docs/current/indexes.html)
</details>

<details>
<summary>Explain the purpose of the GROUP BY clause.</summary>

### Explain the purpose of the GROUP BY clause.

**Definition:**

`GROUP BY` collapses rows that share the same key into one output row so an aggregate (`COUNT`, `SUM`, `AVG`) describes the group rather than a single row.

**How it works:**

- Every selected column must be in the group key or inside an aggregate. Engines that enforce this reject a stray column whose value would be ambiguous.
- `WHERE` runs before grouping. `HAVING` filters the groups afterward.
- The planner may hash the groups or sort them. An index on the grouping columns can make the sorted path cheap.
- Window functions are the alternative when you want the aggregate and the original rows. `GROUP BY` throws the detail rows away.
- Grouping a huge table is real work. Filter first, and do not group in the application by pulling every row if the database can aggregate.

**Examples:**

```sql
SELECT status, COUNT(*) AS n
FROM orders
GROUP BY status;
```

**Sources:**

- [PostgreSQL — Aggregate functions](https://www.postgresql.org/docs/current/tutorial-agg.html)
</details>

<details>
<summary>What is a subquery, and when would you use one?</summary>

### What is a subquery, and when would you use one?

**Definition:**

A subquery is a `SELECT` nested inside another statement. It supplies a value, a list, or a table that the outer query uses.

**How it works:**

- A scalar subquery must return one column and at most one row. It can sit in the select list or in a comparison.
- `IN` and `EXISTS` take a subquery that returns a set. `EXISTS` stops at the first match and is the usual way to test “has at least one child”.
- A correlated subquery refers to the outer row and can run once per outer row. That becomes expensive. The planner often rewrites it as a join; when it cannot, a join or `LATERAL` is clearer.
- A common table expression (`WITH`) names a subquery at the top. Prefer it when the nesting gets hard to read.
- Window functions replace many correlated subqueries that compute a rank or a running total.

**Examples:**

```sql
SELECT id, email
FROM customers AS c
WHERE EXISTS (
  SELECT 1 FROM orders AS o WHERE o.customer_id = c.id
);
```

**Sources:**

- [PostgreSQL — Scalar subqueries](https://www.postgresql.org/docs/current/sql-expressions.html#SQL-SYNTAX-SCALAR-SUBQUERIES)
</details>

<details>
<summary>Describe the functions of the ORDER BY clause.</summary>

### Describe the functions of the ORDER BY clause.

**Definition:**

`ORDER BY` sorts the result. Without it, row order is not part of the contract, even if today’s plan happens to look sorted.

**How it works:**

- List columns or expressions left to right. Each can be `ASC` (the default) or `DESC`.
- `NULLS FIRST` and `NULLS LAST` place nulls explicitly. The default depends on the direction and the engine.
- If an index matches the sort, the planner can read it in order and skip a separate sort. A mismatched order, or an expression the index does not hold, sorts in memory or on disk.
- A large sort that exceeds `work_mem` in PostgreSQL spills to temporary files.
- `ORDER BY` applies to the final projection. Inside a subquery it does not promise order to the outer query unless that outer query sorts again or uses a feature that keeps order, such as `LIMIT` in the same query level.
- `DISTINCT ON` in PostgreSQL needs a matching `ORDER BY` prefix when you want one row per group.

**Examples:**

```sql
SELECT id, placed_at
FROM orders
ORDER BY placed_at DESC NULLS LAST, id
LIMIT 20;
```

**Sources:**

- [PostgreSQL — Sorting rows](https://www.postgresql.org/docs/current/queries-order.html)
</details>

<details>
<summary>What are aggregate functions in SQL?</summary>

### What are aggregate functions in SQL?

**Definition:**

</details>

<details>
<summary>Explain the differences between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL JOIN.</summary>

### Explain the differences between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL JOIN.

**Definition:**

</details>

<details>
<summary>How do you insert a new row into a database table?</summary>

### How do you insert a new row into a database table?

**Definition:**

</details>

<details>
<summary>Explain how to update records in a database table.</summary>

### Explain how to update records in a database table.

**Definition:**

</details>

<details>
<summary>What is a SQL View and what are its advantages?</summary>

### What is a SQL View and what are its advantages?

**Definition:**

</details>


### SQL Data Types and Operators

<details>
<summary>List the different data types available in SQL.</summary>

### List the different data types available in SQL.

**Definition:**

</details>

<details>
<summary>What are the differences between CHAR, VARCHAR, and TEXT data types?</summary>

### What are the differences between CHAR, VARCHAR, and TEXT data types?

**Definition:**

</details>

<details>
<summary>How do you use the BETWEEN operator in SQL?</summary>

### How do you use the BETWEEN operator in SQL?

**Definition:**

</details>

<details>
<summary>Describe the use of the IN operator.</summary>

### Describe the use of the IN operator.

**Definition:**

</details>

<details>
<summary>Explain the use of wildcard characters in SQL.</summary>

### Explain the use of wildcard characters in SQL.

**Definition:**

</details>

<details>
<summary>What is the purpose of the LIKE operator?</summary>

### What is the purpose of the LIKE operator?

**Definition:**

</details>

<details>
<summary>How do you handle NULL values in SQL?</summary>

### How do you handle NULL values in SQL?

**Definition:**

</details>

<details>
<summary>What does the COALESCE function do?</summary>

### What does the COALESCE function do?

**Definition:**

</details>

<details>
<summary>What is the difference between UNION and UNION ALL?</summary>

### What is the difference between UNION and UNION ALL?

**Definition:**

</details>

<details>
<summary>Describe the use of arithmetic operators in SQL queries.</summary>

### Describe the use of arithmetic operators in SQL queries.

**Definition:**

</details>


### SQL Advanced Queries

<details>
<summary>Explain how to use the CASE statement in SQL.</summary>

### Explain how to use the CASE statement in SQL.

**Definition:**

</details>

<details>
<summary>How would you perform a self JOIN?</summary>

### How would you perform a self JOIN?

**Definition:**

</details>

<details>
<summary>What is a cross JOIN and when would you use it?</summary>

### What is a cross JOIN and when would you use it?

**Definition:**

</details>

<details>
<summary>How to implement pagination in SQL queries?</summary>

### How to implement pagination in SQL queries?

**Definition:**

</details>

<details>
<summary>Explain the concept of Common Table Expressions (CTEs) and recursive CTEs.</summary>

### Explain the concept of Common Table Expressions (CTEs) and recursive CTEs.

**Definition:**

</details>

<details>
<summary>What are window functions and how are they used?</summary>

### What are window functions and how are they used?

**Definition:**

</details>

<details>
<summary>How can you concatenate column values in SQL?</summary>

### How can you concatenate column values in SQL?

**Definition:**

</details>

<details>
<summary>What is the PIVOT operation and how would you apply it?</summary>

### What is the PIVOT operation and how would you apply it?

**Definition:**

</details>

<details>
<summary>Explain the process of combining a query that uses a GROUP BY with one that uses ORDER BY.</summary>

### Explain the process of combining a query that uses a GROUP BY with one that uses ORDER BY.

**Definition:**

</details>

<details>
<summary>How would you find duplicate records in a table?</summary>

### How would you find duplicate records in a table?

**Definition:**

</details>


### Database Design & Architecture

<details>
<summary>What is the Entity-Relationship Model?</summary>

### What is the Entity-Relationship Model?

**Definition:**

</details>

<details>
<summary>Explain the different types of database schema.</summary>

### Explain the different types of database schema.

**Definition:**

</details>

<details>
<summary>What are Stored Procedures and how are they beneficial?</summary>

### What are Stored Procedures and how are they beneficial?

**Definition:**

</details>

<details>
<summary>What is a trigger in SQL and when should it be used?</summary>

### What is a trigger in SQL and when should it be used?

**Definition:**

</details>

<details>
<summary>Describe the concept of ACID in databases.</summary>

### Describe the concept of ACID in databases.

**Definition:**

</details>

<details>
<summary>What is database sharding?</summary>

### What is database sharding?

**Definition:**

</details>

<details>
<summary>How do database indexes work and what types are there?</summary>

### How do database indexes work and what types are there?

**Definition:**

</details>

<details>
<summary>Describe the process of data warehousing.</summary>

### Describe the process of data warehousing.

**Definition:**

</details>

<details>
<summary>Explain the difference between OLTP and OLAP systems.</summary>

### Explain the difference between OLTP and OLAP systems.

**Definition:**

</details>

<details>
<summary>What are materialized views and how do they differ from standard views?</summary>

### What are materialized views and how do they differ from standard views?

**Definition:**

</details>


### SQL Optimization and Performance

<details>
<summary>How do you identify and optimize slow-running queries?</summary>

### How do you identify and optimize slow-running queries?

**Definition:**

</details>

<details>
<summary>What is query execution plan in SQL?</summary>

### What is query execution plan in SQL?

**Definition:**

</details>

<details>
<summary>Explain how to use EXPLAIN or EXPLAIN ANALYZE.</summary>

### Explain how to use EXPLAIN or EXPLAIN ANALYZE.

**Definition:**

</details>

<details>
<summary>How can indexing affect performance both positively and negatively?</summary>

### How can indexing affect performance both positively and negatively?

**Definition:**

</details>

<details>
<summary>Describe how to measure the performance of SQL queries.</summary>

### Describe how to measure the performance of SQL queries.

**Definition:**

</details>

<details>
<summary>How would you rewrite a query to improve its performance?</summary>

### How would you rewrite a query to improve its performance?

**Definition:**

</details>

<details>
<summary>What are partitioned tables and how can they optimize performance?</summary>

### What are partitioned tables and how can they optimize performance?

**Definition:**

</details>


### SQL Security

<details>
<summary>How do you implement database encryption in SQL?</summary>

### How do you implement database encryption in SQL?

**Definition:**

</details>

<details>
<summary>What are roles and how do they manage database access?</summary>

### What are roles and how do they manage database access?

**Definition:**

</details>

<details>
<summary>Explain the concept of row-level security.</summary>

### Explain the concept of row-level security.

**Definition:**

</details>

<details>
<summary>Describe how to create and use user-defined functions (UDFs).</summary>

### Describe how to create and use user-defined functions (UDFs).

**Definition:**

</details>


### SQL Functions and Expressions

<details>
<summary>Describe scalar-valued and table-valued functions.</summary>

### Describe scalar-valued and table-valued functions.

**Definition:**

</details>

<details>
<summary>How would you define a stored procedure with input and output parameters?</summary>

### How would you define a stored procedure with input and output parameters?

**Definition:**

</details>

<details>
<summary>What is the difference between a function and a stored procedure?</summary>

### What is the difference between a function and a stored procedure?

**Definition:**

</details>

<details>
<summary>How do you use the CAST and CONVERT functions?</summary>

### How do you use the CAST and CONVERT functions?

**Definition:**

</details>


### Transaction Control and Locking

<details>
<summary>What is a database transaction?</summary>

### What is a database transaction?

**Definition:**

</details>

<details>
<summary>Explain the concept of locking and its types in SQL databases.</summary>

### Explain the concept of locking and its types in SQL databases.

**Definition:**

</details>

<details>
<summary>What are the properties of transactions?</summary>

### What are the properties of transactions?

**Definition:**

</details>

<details>
<summary>How do you manage transaction isolation levels?</summary>

### How do you manage transaction isolation levels?

**Definition:**

</details>

<details>
<summary>What does it mean to commit or roll back a transaction?</summary>

### What does it mean to commit or roll back a transaction?

**Definition:**

</details>


### SQL and Modern Data Ecosystems

<details>
<summary>How can SQL be integrated with big data technologies?</summary>

### How can SQL be integrated with big data technologies?

**Definition:**

</details>

<details>
<summary>Discuss the interoperability of SQL with cloud-based data stores.</summary>

### Discuss the interoperability of SQL with cloud-based data stores.

**Definition:**

</details>

<details>
<summary>What is Data Lake and how can SQL interact with it?</summary>

### What is Data Lake and how can SQL interact with it?

**Definition:**

</details>

<details>
<summary>Explain the interaction between SQL and NoSQL within the same application.</summary>

### Explain the interaction between SQL and NoSQL within the same application.

**Definition:**

</details>

<details>
<summary>How does SQL work within a microservices architecture?</summary>

### How does SQL work within a microservices architecture?

**Definition:**

</details>


### SQL Best Practices and Standards

<details>
<summary>What are some common SQL coding practices you follow?</summary>

### What are some common SQL coding practices you follow?

**Definition:**

</details>

<details>
<summary>How can you ensure the portability of SQL scripts across different database systems?</summary>

### How can you ensure the portability of SQL scripts across different database systems?

**Definition:**

</details>

<details>
<summary>What methods do you use for version controlling SQL scripts?</summary>

### What methods do you use for version controlling SQL scripts?

**Definition:**

</details>

<details>
<summary>What are the benefits of using stored procedures instead of embedding SQL queries in code?</summary>

### What are the benefits of using stored procedures instead of embedding SQL queries in code?

**Definition:**

</details>

<details>
<summary>How do you document SQL code effectively?</summary>

### How do you document SQL code effectively?

**Definition:**

</details>


### Analytical SQL Questions

<details>
<summary>How would you find the Nth highest salary from a table?</summary>

### How would you find the Nth highest salary from a table?

**Definition:**

</details>

<details>
<summary>How do you count the number of occurrences of a specific value in a column?</summary>

### How do you count the number of occurrences of a specific value in a column?

**Definition:**

</details>

<details>
<summary>How can you calculate running totals in SQL?</summary>

### How can you calculate running totals in SQL?

**Definition:**

</details>

<details>
<summary>Explain how to reverse the contents of a column without using a reverse function.</summary>

### Explain how to reverse the contents of a column without using a reverse function.

**Definition:**

</details>

<details>
<summary>What approach do you use for creating a calendar table, and what are its uses?</summary>

### What approach do you use for creating a calendar table, and what are its uses?

**Definition:**

</details>


### Data Manipulation and ETL

<details>
<summary>What is the process of Extract, Transform, Load (ETL)?</summary>

### What is the process of Extract, Transform, Load (ETL)?

**Definition:**

</details>

<details>
<summary>How do you import/export data from/to a flat file using SQL?</summary>

### How do you import/export data from/to a flat file using SQL?

**Definition:**

</details>

<details>
<summary>Explain the steps for a basic ETL process in a data warehousing environment.</summary>

### Explain the steps for a basic ETL process in a data warehousing environment.

**Definition:**

</details>

<details>
<summary>How do you cleanse and format data using SQL queries?</summary>

### How do you cleanse and format data using SQL queries?

**Definition:**

</details>

<details>
<summary>What tools do you use for automating data import/export routines?</summary>

### What tools do you use for automating data import/export routines?

**Definition:**

</details>


### Domain-Specific SQL Scenarios

<details>
<summary>How would you model a many-to-many relationship in SQL?</summary>

### How would you model a many-to-many relationship in SQL?

**Definition:**

</details>

<details>
<summary>Describe how to manage hierarchical data in SQL.</summary>

### Describe how to manage hierarchical data in SQL.

**Definition:**

</details>

<details>
<summary>How would you approach writing SQL queries for a reporting application?</summary>

### How would you approach writing SQL queries for a reporting application?

**Definition:**

</details>

<details>
<summary>Explain how to handle temporal data and time zones in SQL.</summary>

### Explain how to handle temporal data and time zones in SQL.

**Definition:**

</details>

<details>
<summary>How do you use SQL in financial applications for risk and portfolio analysis?</summary>

### How do you use SQL in financial applications for risk and portfolio analysis?

**Definition:**

</details>


### Troubleshooting and Debugging

<details>
<summary>What steps do you take to troubleshoot a failed SQL query?</summary>

### What steps do you take to troubleshoot a failed SQL query?

**Definition:**

</details>

<details>
<summary>How can you recover data from a corrupt SQL database?</summary>

### How can you recover data from a corrupt SQL database?

**Definition:**

</details>

<details>
<summary>What methods do you employ to ensure data integrity?</summary>

### What methods do you employ to ensure data integrity?

**Definition:**

</details>

<details>
<summary>How do you decipher and resolve deadlocks in SQL?</summary>

### How do you decipher and resolve deadlocks in SQL?

**Definition:**

</details>


### Advanced Data Analysis in SQL

<details>
<summary>Explain how to use SQL for predictive analysis and machine learning purposes.</summary>

### Explain how to use SQL for predictive analysis and machine learning purposes.

**Definition:**

</details>
