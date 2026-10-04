# Databases — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [Databases — Interview](./0_sd_databases_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Databases](https://devinterview.io/questions/software-architecture-and-system-design/databases-interview-questions/).

### Database Fundamentals

<details>
<summary>What is a database management system (DBMS), and can you name some examples?</summary>

### What is a database management system (DBMS), and can you name some examples?

**Definition:**

A database management system is the software that stores data and answers queries, so applications do not read and write files on their own.

**How it works:**

- It gives you a model (tables, documents, keys) and a way to insert, read, update, and delete.
- It enforces integrity rules, grants or denies access, and coordinates concurrent sessions so two writers do not silently overwrite each other.
- It can back the data up and restore it, and it plans queries so a read does not scan more than it must.
- A relational system (PostgreSQL, MySQL, SQL Server, Oracle) stores tables and uses SQL. A NoSQL system (MongoDB, Cassandra, Redis, Neo4j) uses a different model and usually scales out by adding machines.
- Cloud offerings (Amazon RDS, Cloud SQL, DynamoDB) run that software for you. NewSQL systems aim at SQL plus horizontal scale. Object databases persist language objects. In-memory systems such as Redis keep the working set in RAM. A multimodel server supports more than one of these models.

**Examples:**

An application calls `SELECT * FROM invoices WHERE id = 42`. The DBMS checks permission, uses an index, and returns the row. The application does not open the table file.

</details>

<details>
<summary>Explain the ACID properties in the context of databases.</summary>

### Explain the ACID properties in the context of databases.

**Definition:**

ACID is the set of guarantees a transaction either provides or explicitly weakens: the work is all-or-nothing, the rules hold, concurrent transactions do not see each other’s half-finished work, and a commit survives a crash.

**How it works:**

- Atomicity: every statement in the transaction commits, or none do. The engine undoes a failed transfer so you do not debit one account and forget the other. The mechanism is a log of changes it can roll back.
- Consistency: a commit leaves the database satisfying its constraints (keys, checks, foreign keys). The application still has to express the business rule as a constraint or as part of the transaction. The engine will not invent it.
- Isolation: concurrent transactions behave as if they ran in some serial order, to the degree the isolation level promises. Read uncommitted, read committed, repeatable read, and serializable are the usual steps from weakest to strongest. Weaker levels allow more concurrency and more anomalies.
- Durability: after a commit returns, the change is on stable storage (the write-ahead log flushed to disk). A crash recovers committed work and drops what was not committed.
- Money movement, inventory decrements, and booking a seat are the cases where you want the full set. A cache or a log pipeline often relaxes one of them on purpose.

**Examples:**

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

If the second update fails, the first is undone. After `COMMIT` returns, a crash still shows the transfer.

</details>

<details>
<summary>What are the differences between SQL and NoSQL databases?</summary>

### What are the differences between SQL and NoSQL databases?

**Definition:**

SQL databases store rows in tables with a declared schema and answer with SQL. NoSQL is a family of other models, chosen when that shape or its scaling story does not fit.

**How it works:**

- SQL data is tables, columns, and relationships. The schema is enforced on write. NoSQL may be documents (MongoDB), key-value pairs (Redis), wide columns (Cassandra), or graphs (Neo4j). A document store can accept fields the previous document did not have.
- SQL queries are declarative and good at joins. Each NoSQL model has its own access path, and a join is often something you do in the application or avoid by storing data together.
- Traditional SQL scales up by making one machine bigger, and it can scale out with more effort. Many NoSQL systems were built to add machines and to stay available when one is down.
- SQL transactions are usually ACID. NoSQL systems range from strong consistency to eventual consistency. Pick the second only when stale reads are acceptable.
- Use SQL when the relationships and the constraints are the product. Use a document or key-value store when you mostly fetch one aggregate by id and need to grow by adding nodes.

**Examples:**

An invoice with lines and a customer is a few SQL tables and foreign keys. A session blob fetched by one id is a key-value entry. Forcing the second into five tables, or the first into one document you cannot constrain, is the mismatch.

</details>

<details>
<summary>Describe a relational database schema.</summary>

### Describe a relational database schema.

**Definition:**

A relational schema is the declared shape of the data: tables, columns, types, keys, and the rules that keep rows consistent.

**How it works:**

- A table is a set of rows. Each column has a name and a type (integer, text, timestamp, boolean).
- A primary key identifies one row. A unique constraint does the same for a business value that is not the key. A foreign key says a value must exist in another table.
- Relationships are one-to-one, one-to-many, or many-to-many. The last one needs a table of pairs.
- `NOT NULL` forbids a missing value. `CHECK` forbids a value outside a rule. `DEFAULT` fills a column when the insert omits it. An index is not a constraint. It speeds lookups and is often how a unique constraint is enforced.
- The schema is what you review. The rows are what you store.

**Examples:**

```sql
CREATE TABLE students (
  id bigint PRIMARY KEY,
  email text NOT NULL UNIQUE
);
CREATE TABLE enrollments (
  student_id bigint REFERENCES students (id),
  course_id bigint NOT NULL,
  PRIMARY KEY (student_id, course_id)
);
```

</details>

<details>
<summary>What is a primary key, and why is it important?</summary>

### What is a primary key, and why is it important?

**Definition:**

A primary key is the column or columns that identify one row and never repeat. The table uses it as the address other tables point at.

**How it works:**

- Values are unique and not null. A composite key is unique as a tuple even when each column repeats on its own.
- Change the key rarely. Foreign keys store it, so a change ripples. A surrogate (`bigint`, UUID) stays stable when a business code gets corrected.
- It is how you join, how you stop duplicate rows, and how you normalize: attributes that depend on the row live with that key.
- Engines differ on width and on types. Large object columns are often forbidden inside the key, and an index has a byte limit. Those limits are engine details, not part of the relational idea.
- One table has one primary key. Other uniqueness rules are `UNIQUE` constraints.

**Examples:**

```sql
CREATE TABLE invoices (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  number text NOT NULL UNIQUE
);
```

`id` is the stable address. `number` is unique because the business says so, and it can be corrected without rewriting every foreign key.

</details>

<details>
<summary>Can you explain what a foreign key is and its role in the database?</summary>

### Can you explain what a foreign key is and its role in the database?

**Definition:**

A foreign key is a column whose values must match a candidate key in another table. It is what makes a relationship enforceable instead of a convention in application code.

**How it works:**

- The types match the referenced column. The database rejects an insert or update that would point at a missing parent.
- On a parent delete or update you choose the action: restrict (reject), cascade (apply the same change to children), or set the child column to null where it is nullable.
- Joins use that column to bring the parent and the child into one result. An inner join keeps only rows that match. An outer join keeps rows from one side that have no partner.
- The constraint is visible in the catalog (`information_schema.referential_constraints` and `key_column_usage` in standard SQL). You do not have to guess it from column names.

**Examples:**

```sql
CREATE TABLE lines (
  id bigint PRIMARY KEY,
  invoice_id bigint NOT NULL REFERENCES invoices (id)
);
SELECT invoices.number, lines.amount
FROM lines
JOIN invoices ON invoices.id = lines.invoice_id;
```

</details>

<details>
<summary>What is database normalization, and why do we use it?</summary>

### What is database normalization, and why do we use it?

**Definition:**

Normalization is arranging tables so each fact is stored once and each non-key column depends on the key, the whole key, and nothing but the key.

**How it works:**

- The payoff is fewer contradictions: a customer’s address lives in one row, so you cannot update one copy and forget another. The cost is more joins.
- First normal form: each column holds one value, not a list, and each row is uniquely identified.
- Second normal form: on a composite key, every non-key column depends on the whole key, not on part of it. A course name does not belong on an enrollment keyed by student and course.
- Third normal form: a non-key column does not depend on another non-key column. A city does not belong next to a postal code if the city is determined by that code. Move it to its own table.
- Boyce–Codd is the stricter form of that rule: every determinant is a candidate key. Fourth normal form removes multi-valued dependencies (two independent lists in one table). Fifth normal form removes join dependencies that cannot be rebuilt from smaller tables. Most operational schemas stop at third normal form or Boyce–Codd.

**Examples:**

```text
students(id, name, email)
enrollments(student_id, course_id)
courses(id, title)
```

The student’s email is stored once. The enrollment stores only the two ids.

</details>

<details>
<summary>What is denormalization and when would you consider it?</summary>

### What is denormalization and when would you consider it?

**Definition:**

Denormalization copies a fact into another table on purpose, so a hot read does not join, at the cost of keeping those copies the same.

**How it works:**

- Reads get simpler and often faster. Writes get harder, because every copy must change in one transaction or you accept a window where they disagree.
- Storage grows. A bug that updates one copy is a silent integrity bug, which normalization was designed to prevent.
- It pays off when the duplicated value is read constantly and written rarely: a status label, a customer name on an invoice you must not change after issue, a reporting table rebuilt on a schedule.
- It also pays off when you partition or shard and want each partition to answer without calling the others.
- A view or a query can present a joined shape without storing the copy. Prefer that until a measurement says the join is the problem.

**Examples:**

```sql
-- written once, when the invoice is issued
INSERT INTO invoices (id, customer_name, total)
SELECT 42, customers.name, 120 FROM customers WHERE customers.id = 7;
```

Later renames of the customer do not rewrite the issued invoice. That copy is a snapshot, not an accident.

</details>

<details>
<summary>Compare and contrast the DROP, DELETE, and TRUNCATE commands.</summary>

### Compare and contrast the DROP, DELETE, and TRUNCATE commands.

**Definition:**

`DELETE` removes rows and can be filtered. `TRUNCATE` empties a table quickly. `DROP` removes the table itself.

**How it works:**

- `DELETE FROM t WHERE …` removes the matching rows, fires row triggers, and is part of a transaction you can roll back. It is the one to use when some rows must stay.
- `TRUNCATE` removes all rows and usually reclaims space without scanning each row. It is not a filtered delete. In PostgreSQL it can roll back inside a transaction. In MySQL it is DDL and commits implicitly. Do not assume one engine’s behavior on the other.
- `DROP TABLE` removes the table, its indexes, and its data definition. PostgreSQL can roll a drop back inside a transaction. MySQL commits it. Either way, application code that still names the table breaks.
- None of these is a backup strategy. `DELETE` without a `WHERE` is the accident. `TRUNCATE` and `DROP` are the accidents you cannot filter your way out of.

**Examples:**

```sql
DELETE FROM sessions WHERE expires_at < now();  -- some rows remain
TRUNCATE TABLE sessions;                         -- no rows remain, table remains
DROP TABLE sessions;                             -- the table is gone
```

</details>

<details>
<summary>What is the difference between a full join and an inner join?</summary>

### What is the difference between a full join and an inner join?

**Definition:**

An inner join returns only the pairs that match. A full join returns those pairs and also the unmatched rows from both sides.

**How it works:**

- Inner: a student with no enrollment disappears, and so does an enrollment whose student id is missing. You asked for pairs.
- Full (full outer): every student appears, with null enrollment columns when they have none, and every enrollment appears, with null student columns when the student is missing. It is how you find both kinds of orphan in one result.
- A left join is the one-sided version: keep every row of the left table. A right join keeps every row of the right table. Full is both of those unmatched sets plus the matches.
- The match is the `ON` condition. A filter in `WHERE` applied to the outer side after the join can silently turn a full or left join back into an inner join.

**Examples:**

```sql
SELECT students.id, enrollments.course_id
FROM students
FULL JOIN enrollments ON enrollments.student_id = students.id;
```

A student with no course has a null `course_id`. An inner join would have omitted that student.

</details>

### SQL and Query Optimization

<details>
<summary>How would you write an SQL query to fetch duplicate records from a table?</summary>

### How would you write an SQL query to fetch duplicate records from a table?

**Definition:**

Duplicate rows are the ones that share a value you expected to be unique. Group by that value and keep the groups whose count is greater than one.

**How it works:**

- `GROUP BY` the columns that should have been unique, `HAVING count(*) > 1`, and you get the keys that collide. Join back to the table if you need every copy, not only the key.
- `count(*)` counts rows. `count(column)` skips nulls, which hides a different problem.
- A window function such as `row_number() OVER (PARTITION BY email)` numbers the copies so you can delete all but one. Do that in a transaction, and decide which copy survives before you delete.
- A unique constraint is the fix going forward. The query only finds the damage.

**Examples:**

```sql
SELECT email, count(*)
FROM users
GROUP BY email
HAVING count(*) > 1;
```

</details>

<details>
<summary>What is a prepared statement, and why would you use one?</summary>

### What is a prepared statement, and why would you use one?

**Definition:**

A prepared statement is a query the engine parses once, with placeholders, and then runs with values supplied separately. The values cannot change the statement’s shape.

**How it works:**

- That separation is the defense against SQL injection: the text is fixed, and a quote inside a value is data.
- The engine can reuse the execution plan for later calls with new values, which matters when the same statement runs in a loop.
- The SQL stays readable because the parameters are not concatenated into it.
- Use it whenever a value comes from outside the program, and whenever the statement is repeated. A statement you build by joining strings has neither property.
- Preparing is not useful for a one-off administrative command whose text never includes outside data. It is not optional for a query that does.

**Examples:**

```sql
PREPARE find_user (text) AS
  SELECT id FROM users WHERE email = $1;
EXECUTE find_user('ada@example.com');
```

</details>

<details>
<summary>What is the N+1 query problem and how can you solve it?</summary>

### What is the N+1 query problem and how can you solve it?

**Definition:**

The N+1 query problem is one query for a list of parents and then one more query per parent to load something you could have fetched with them.

**How it works:**

- It shows up with lazy loading: the first query returns 50 invoices, and reading `invoice.customer` issues a new query each time. Fifty-one round trips replace one.
- The fix is to load the association in the original query: a join, or an explicit eager load (`JOIN` / `includes` / `selectin`) that batches the children.
- Lazy loading is usually the cause, not the cure. Leave it for associations this request will not touch.
- A projection that selects only the columns the page needs avoids building the full object graph.
- Pagination shrinks N. It does not remove the per-row query. Measure the number of statements, not only the time of one of them.

**Examples:**

```sql
-- one query instead of 1 + N
SELECT invoices.id, customers.name
FROM invoices
JOIN customers ON customers.id = invoices.customer_id
WHERE invoices.status = 'open';
```

</details>

<details>
<summary>Explain the function of GROUP BY and HAVING clauses in SQL.</summary>

### Explain the function of GROUP BY and HAVING clauses in SQL.

**Definition:**

`GROUP BY` collapses rows that share a key into one row per group so an aggregate can run on each group. `HAVING` filters those groups. `WHERE` filters rows before the grouping.

**How it works:**

- Aggregates such as `count`, `sum`, and `avg` are computed per group. Every selected column is either in the `GROUP BY` or inside an aggregate. That is what keeps the row meaningful.
- `WHERE` cannot see the aggregate. It throws out invoices before they are counted.
- `HAVING` sees the aggregate. It throws out groups, for example customers whose counted total is below a threshold.
- Order of work: `WHERE`, then `GROUP BY`, then `HAVING`, then `ORDER BY`.

**Examples:**

```sql
SELECT customer_id, count(*) AS n
FROM invoices
WHERE status = 'open'
GROUP BY customer_id
HAVING count(*) > 3;
```

Closed invoices never enter a group. Customers with three or fewer open invoices disappear after the count.

</details>

<details>
<summary>What are indexes and how do they work in databases?</summary>

### What are indexes and how do they work in databases?

**Definition:**

An index is a structure beside the table that maps a key to the rows that contain it, so the engine does not have to read every row to answer a predicate.

**How it works:**

- A B-tree is the default. It serves equality and range (`WHERE created_at >= …`) because the keys are ordered.
- A hash index serves equality only. It does not help a range.
- A full-text index tokenizes text for word search. A bitmap index fits a column with few distinct values, and it is common in analytical engines.
- The planner may ignore an index when the predicate matches most of the table. A scan is then cheaper.
- Every insert, update, and delete must maintain the index. Index the columns you filter, join, and order by. Do not index every column “just in case.”
- A unique index is also a constraint. A primary key is one.

**Examples:**

```sql
CREATE INDEX invoices_customer_idx ON invoices (customer_id);
-- WHERE customer_id = 7 can seek this index
-- WHERE lower(note) LIKE '%tax%' cannot, unless you indexed that expression
```

</details>

<details>
<summary>What impact do JOIN operations have on database performance?</summary>

### What impact do JOIN operations have on database performance?

**Definition:**

</details>

<details>
<summary>Define what a subquery is and provide a use case for it.</summary>

### Define what a subquery is and provide a use case for it.

**Definition:**

</details>

<details>
<summary>What is a correlated subquery?</summary>

### What is a correlated subquery?

**Definition:**

</details>

<details>
<summary>Describe how you would optimize a slow SQL query.</summary>

### Describe how you would optimize a slow SQL query.

**Definition:**

</details>

<details>
<summary>Explain the EXPLAIN statement and how you use it in query optimization.</summary>

### Explain the EXPLAIN statement and how you use it in query optimization.

**Definition:**

</details>

### Data Modeling and Design

<details>
<summary>What is an Entity-Relationship (ER) model, and why is it useful?</summary>

### What is an Entity-Relationship (ER) model, and why is it useful?

**Definition:**

</details>

<details>
<summary>Describe the process of converting an ER model into a relational database schema.</summary>

### Describe the process of converting an ER model into a relational database schema.

**Definition:**

</details>

<details>
<summary>How do you design a scalable database schema for a high-traffic application?</summary>

### How do you design a scalable database schema for a high-traffic application?

**Definition:**

</details>

<details>
<summary>What is database sharding, and what are its benefits and drawbacks?</summary>

### What is database sharding, and what are its benefits and drawbacks?

**Definition:**

</details>

<details>
<summary>Explain the term “data integrity” and how it’s enforced in databases.</summary>

### Explain the term “data integrity” and how it’s enforced in databases.

**Definition:**

</details>

### Transactions and Concurrency Control

<details>
<summary>Can you explain the concept of transaction isolation levels?</summary>

### Can you explain the concept of transaction isolation levels?

**Definition:**

</details>

<details>
<summary>What is a deadlock in databases, and how can it be resolved?</summary>

### What is a deadlock in databases, and how can it be resolved?

**Definition:**

</details>

<details>
<summary>Describe optimistic vs. pessimistic locking.</summary>

### Describe optimistic vs. pessimistic locking.

**Definition:**

</details>

<details>
<summary>How does a database ensure consistency during concurrent transactions?</summary>

### How does a database ensure consistency during concurrent transactions?

**Definition:**

</details>

<details>
<summary>What is a savepoint in a database transaction?</summary>

### What is a savepoint in a database transaction?

**Definition:**

</details>

### Database Security

<details>
<summary>What is SQL injection, and how do you prevent it?</summary>

### What is SQL injection, and how do you prevent it?

**Definition:**

</details>

<details>
<summary>Explain the role of access control in database security.</summary>

### Explain the role of access control in database security.

**Definition:**

</details>

<details>
<summary>What are the best practices for storing passwords in a database?</summary>

### What are the best practices for storing passwords in a database?

**Definition:**

</details>

<details>
<summary>How do you secure data transmission to and from a database?</summary>

### How do you secure data transmission to and from a database?

**Definition:**

</details>

<details>
<summary>Describe the use of encryption within databases for data at rest.</summary>

### Describe the use of encryption within databases for data at rest.

**Definition:**

</details>

### Backup and Recovery

<details>
<summary>What is a database snapshot, and when would you use one?</summary>

### What is a database snapshot, and when would you use one?

**Definition:**

</details>

<details>
<summary>Explain the difference between logical and physical backups.</summary>

### Explain the difference between logical and physical backups.

**Definition:**

</details>

<details>
<summary>How would you restore a database from a backup file?</summary>

### How would you restore a database from a backup file?

**Definition:**

</details>

<details>
<summary>What are the common strategies for database disaster recovery?</summary>

### What are the common strategies for database disaster recovery?

**Definition:**

</details>

<details>
<summary>How does point-in-time recovery work in databases?</summary>

### How does point-in-time recovery work in databases?

**Definition:**

</details>

### Performance Tuning and Scaling

<details>
<summary>How would you handle a scenario where your database’s read load significantly increases?</summary>

### How would you handle a scenario where your database’s read load significantly increases?

**Definition:**

</details>

<details>
<summary>What strategies exist for scaling writes in a high-volume database system?</summary>

### What strategies exist for scaling writes in a high-volume database system?

**Definition:**

</details>

<details>
<summary>Describe how connection pooling benefits database performance.</summary>

### Describe how connection pooling benefits database performance.

**Definition:**

</details>

<details>
<summary>How do you monitor and identify database performance bottlenecks?</summary>

### How do you monitor and identify database performance bottlenecks?

**Definition:**

</details>

<details>
<summary>What is horizontal and vertical scaling in databases?</summary>

### What is horizontal and vertical scaling in databases?

**Definition:**

</details>

### NoSQL Databases

<details>
<summary>Explain what a document store is and give an example of where it’s appropriate to use.</summary>

### Explain what a document store is and give an example of where it’s appropriate to use.

**Definition:**

</details>

<details>
<summary>What is a graph database, and what are its typical use cases?</summary>

### What is a graph database, and what are its typical use cases?

**Definition:**

</details>

<details>
<summary>Describe the key-value store model and its typical applications.</summary>

### Describe the key-value store model and its typical applications.

**Definition:**

</details>

<details>
<summary>How do you choose between consistency and availability in a NoSQL database, referencing the CAP theorem?</summary>

### How do you choose between consistency and availability in a NoSQL database, referencing the CAP theorem?

**Definition:**

</details>

<details>
<summary>What is eventual consistency, and in what scenarios is it used?</summary>

### What is eventual consistency, and in what scenarios is it used?

**Definition:**

</details>
