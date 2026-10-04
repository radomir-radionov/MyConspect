# Apache Spark — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [Apache Spark — Interview](./0_sd_spark_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Apache Spark](https://devinterview.io/questions/machine-learning-and-data-science/apache-spark-interview-questions/).

### Spark Fundamentals

<details>
<summary>What is Apache Spark and what are its main components?</summary>

### What is Apache Spark and what are its main components?

**Definition:**

Apache Spark is a distributed engine for batch jobs, SQL, machine learning, and streaming, with intermediate data kept in memory when it fits.

**How it works:**

- Spark Core schedules jobs, partitions data, and provides the RDD execution model. Applications are written in Scala, Java, Python, R, or SQL.
- Spark SQL adds DataFrames and Datasets, a catalog, and the Catalyst planner. Structured Streaming uses the same tables for incremental queries.
- MLlib supplies distributed learning pipelines. GraphX supplies graph-parallel operators. Both sit on the same runtime.
- A cluster manager — standalone, YARN, or Kubernetes — places the driver and the executors. Spark itself is not the resource manager.

**Examples:**

```text
SparkSession
  -> Spark SQL / DataFrame job
  -> Catalyst plan
  -> tasks on executors
```
</details>

<details>
<summary>Explain how Apache Spark differs from Hadoop MapReduce.</summary>

### Explain how Apache Spark differs from Hadoop MapReduce.

**Definition:**

Both can scan data on a cluster. Spark keeps a pipeline in memory and offers more than one map phase plus one reduce phase.

**How it works:**

- MapReduce writes each stage to disk before the next job starts. Spark passes partitions in memory and spills only when a partition does not fit.
- A MapReduce job is a fixed map then reduce. A Spark job is a graph of transformations, including SQL, streaming, and iterative loops in one application.
- Spark APIs are higher level: DataFrames, SQL, and typed Datasets. MapReduce asks the author to write the mapper and reducer classes.
- A lost Spark partition is rebuilt from lineage. MapReduce reruns the failed task from its input split. Both retry failed tasks.
- Spark still has shuffle latency. A single heavy shuffle of data larger than memory can look closer to a MapReduce job than to a pure in-memory one.
</details>

<details>
<summary>Describe the concept of RDDs (Resilient Distributed Datasets) in Spark.</summary>

### Describe the concept of RDDs (Resilient Distributed Datasets) in Spark.

**Definition:**

An RDD is an immutable, partitioned collection. Transformations record a new RDD; they do not run until an action needs a result.

**How it works:**

- Partitions are the units of parallelism. A narrow transformation such as map or filter stays inside a partition. A wide one such as groupByKey or join shuffles across the network.
- Lineage is the chain of parent RDDs and the function that built each partition. If a partition is lost, Spark recomputes it from those parents.
- Actions — count, collect, save — launch a job. Calling collect on a huge RDD pulls the result to the driver and can exhaust it.
- cache or persist keeps a computed RDD for the next action. Checkpoint cuts a long lineage by writing a materialised copy.
</details>

<details>
<summary>What are DataFrames in Spark and how do they compare to RDDs?</summary>

### What are DataFrames in Spark and how do they compare to RDDs?

**Definition:**

A DataFrame is a distributed table with named columns and a schema. The planner can rewrite it; an RDD of opaque objects usually cannot.

**How it works:**

- Rows are stored in a compact columnar format, so filters and aggregations touch only the columns they need.
- Catalyst sees relational operators: filter, project, join, aggregate. It can push a predicate into the source and choose a join strategy. An RDD map is a black-box function.
- The same logical join written with keyBy and join on RDDs is longer and skips those rewrites. A Dataset adds compile-time types on top of the same plan in Scala and Java.
- Use an RDD when records have no useful columns. Use a DataFrame for structured files, JDBC, and SQL.

**Examples:**

```text
events.filter(col("day") == "2026-10-04").groupBy("path").count()
```

The planner can drop unused columns and skip files whose partition is another day. The equivalent RDD `filter` plus `reduceByKey` hides that structure inside lambdas.
</details>

<details>
<summary>What is lazy evaluation and how does it benefit Spark computations?</summary>

### What is lazy evaluation and how does it benefit Spark computations?

**Definition:**

Spark records transformations and runs them only when an action asks for a result, so the whole chain can be planned as one job.

**How it works:**

- map, filter, select, and join build a logical plan. count, show, write, and collect trigger execution.
- The planner fuses narrow steps, drops unused work, and pipelines partitions so data is not materialised between every call.
- A transformation that is never used by an action is not computed. Two actions on the same uncached lineage compute it twice.
- Debugging is less local: a failure appears at the action, and the stack points back through the lineage.

**Examples:**

```text
df = spark.read.parquet("/events")
df2 = df.filter(df.day == "2026-10-04")   # no read yet
df2.count()                                # one job: read, filter, count
```
</details>

<details>
<summary>How does Spark achieve fault tolerance?</summary>

### How does Spark achieve fault tolerance?

**Definition:**

Spark treats a lost partition as something to recompute from its parents, and it retries failed tasks on other executors.

**How it works:**

- Each RDD partition stores lineage: the parent partitions and the function that produced it. Immutable inputs make that replay safe.
- Shuffle files are written so a downstream stage can fetch them again. A lost shuffle map output is recomputed.
- checkpoint writes a materialised RDD and forgets the lineage before that point, which bounds replay of a long iterative job.
- The driver can rerun a failed task. Speculative execution starts a second copy of a straggler. Cache is an optimisation; it is not the durability mechanism.
- An action's result is consistent with recomputation as long as the functions are deterministic. A non-deterministic map makes a replay diverge.
</details>

<details>
<summary>What is the role of Spark Driver and Executors?</summary>

### What is the role of Spark Driver and Executors?

**Definition:**

The driver builds the plan and schedules tasks. Executors run those tasks and hold cached partitions.

**How it works:**

- The driver hosts the SparkSession, turns the logical plan into stages, and sends tasks to executors. It also collects small results such as count and the rows from take.
- An executor is a worker process with a thread pool. It runs tasks, stores shuffle blocks, and keeps cached data.
- The cluster manager starts executors. In cluster deploy mode the driver itself runs inside the cluster; in client mode it stays on the submitting machine.
- A wide transformation becomes a stage boundary. The driver launches the next stage only after the shuffle outputs of the previous stage are available.
</details>

<details>
<summary>How does Spark's DAG (Directed Acyclic Graph) Scheduler work?</summary>

### How does Spark's DAG (Directed Acyclic Graph) Scheduler work?

**Definition:**

The DAG scheduler turns a job's lineage into stages split at shuffles, then the task scheduler runs the tasks inside a stage.

**How it works:**

- Narrow dependencies pipeline into one stage: several maps and filters on the same partition become one task.
- A wide dependency, such as a shuffle join or groupBy, ends the stage. The next stage cannot start until those outputs exist.
- The graph is acyclic because each RDD points only at older parents. The scheduler walks it from the action back to the sources.
- Failed tasks are resubmitted. If the failure rate in a stage is too high, the stage fails and lineage replay may rerun an earlier stage.

**Examples:**

```text
read -> filter -> map          stage 1 (no shuffle)
groupBy("user")                stage boundary
count                          stage 2
```
</details>

### Spark Architecture and Ecosystem

<details>
<summary>Explain the concept of a Spark Session and its purpose.</summary>

### Explain the concept of a Spark Session and its purpose.

**Definition:**

SparkSession is the entry object for one application: configuration, the catalog, SQL, and DataFrame reads and writes.

**How it works:**

- Builder sets the app name, master, and configs, then getOrCreate returns the session. A second call in the same process reuses it.
- spark.read and DataFrameWriter go through the session. spark.sql runs a query against temporary views and catalog tables.
- The catalog creates and drops views, caches tables, and lists databases. UDFs are registered on the session so SQL can call them.
- spark.sparkContext still exposes the older RDD entry point. Stopping the session releases the context and the executors it owns.

**Examples:**

```text
spark = SparkSession.builder.appName("daily").getOrCreate()
spark.read.parquet("/events").createOrReplaceTempView("events")
spark.sql("SELECT path, count(*) FROM events GROUP BY path")
```
</details>

<details>
<summary>How does Spark integrate with Hadoop components like HDFS and YARN?</summary>

### How does Spark integrate with Hadoop components like HDFS and YARN?

**Definition:**

Spark reads and writes HDFS with the Hadoop file APIs, and it can ask YARN to place the driver and the executors.

**How it works:**

- Paths such as `hdfs://namenode/events` use the cluster's Hadoop configuration: `core-site.xml` and `hdfs-site.xml`. The same readers open Parquet, ORC, and text.
- `--master yarn` submits the application to the ResourceManager. YARN allocates containers; Spark decides which tasks run inside them.
- Deploy mode `cluster` runs the driver in a YARN container, so the laptop can disconnect. Deploy mode `client` keeps the driver on the submitter, which must stay reachable by the executors.
- HDFS block locations still influence preferred task placement, the same data-local idea MapReduce uses.
</details>

<details>
<summary>Describe the various ways to run Spark applications (cluster, client, local modes).</summary>

### Describe the various ways to run Spark applications (cluster, client, local modes).

**Definition:**

Local mode runs everything in one process. Client and cluster modes differ in where the driver lives, not in how the job is written.

**How it works:**

- `local` and `local[n]` start driver and tasks in the submitting JVM. `local[*]` uses one thread per core. This is for development, not for a shared cluster.
- Standalone is Spark's own master and workers. YARN and Kubernetes are external managers. The application code stays the same.
- Client deploy mode leaves the driver on the machine that submitted the job. Executors must reach that driver, and a dead laptop kills the job.
- Cluster deploy mode places the driver inside the cluster. `spark-submit` only ships the application and can exit. Logs for the driver are then on the cluster, not in the local terminal.

**Examples:**

```text
spark-submit --master local[*] app.py
spark-submit --master yarn --deploy-mode client app.py
spark-submit --master yarn --deploy-mode cluster app.py
```
</details>

<details>
<summary>What are Spark's data source APIs and how do you use them?</summary>

### What are Spark's data source APIs and how do you use them?

**Definition:**

DataFrameReader and DataFrameWriter are the common API: pick a format, set options, and load or save a table.

**How it works:**

- `spark.read.format(name)` selects a source such as parquet, orc, json, csv, text, or jdbc. Options cover paths, schemas, and credentials. `load` returns a DataFrame.
- `df.write.format(name).mode(...)` saves. Modes include error if the path exists, overwrite, append, and ignore.
- Partition discovery treats directory names such as `day=2026-10-04` as columns. `partitionBy` on write creates those directories.
- A short name such as `spark.read.parquet(path)` is the same reader with the format already chosen. The table catalog API registers that DataFrame as a metastore table.

**Examples:**

```text
spark.read.format("csv").option("header", "true").schema(schema).load("/in")
df.write.mode("overwrite").partitionBy("day").parquet("/out")
```
</details>

<details>
<summary>Discuss the role of accumulators and broadcast variables in Spark.</summary>

### Discuss the role of accumulators and broadcast variables in Spark.

**Definition:**

Accumulators collect a side total from tasks. Broadcast variables ship one read-only copy of a small value to every executor.

**How it works:**

- An accumulator is write-only on executors and readable on the driver. Tasks add to it; only the driver should read `value`. Reliable updates are those performed inside actions, because a retried stage can add twice if the accumulator is not the kind that Spark corrects.
- A broadcast variable is copied once per executor and reused by every task there. Tasks must treat it as immutable.
- Use an accumulator for a diagnostic count, such as malformed rows. Use a broadcast for a lookup table that would otherwise be shipped inside every task closure.
- Neither replaces a shuffle. A large lookup belongs in a join, not in a broadcast that does not fit executor memory.

**Examples:**

```text
bad_rows = sc.accumulator(0)

def parse(line):
    if line.count(",") != 3:
        bad_rows.add(1)
        return None
    return line.split(",")

rates = sc.broadcast({"usd": 1.0, "eur": 0.92})
amount_usd = lambda row: row.amount / rates.value[row.currency]
```
</details>

<details>
<summary>What is the significance of the Catalyst optimizer in Spark SQL?</summary>

### What is the significance of the Catalyst optimizer in Spark SQL?

**Definition:**

Catalyst turns a DataFrame or SQL query into an executable plan by analysing it, rewriting it with rules, and picking physical operators.

**How it works:**

- The analyser resolves names, types, and functions against the catalog and rejects a query that does not type-check.
- Logical rules fold constants, push filters toward the source, prune columns, and simplify predicates. Extra rules can be added; the engine is a set of tree rewrites.
- Physical planning chooses operators such as broadcast hash join versus sort-merge join, and how to partition the shuffle, using available statistics when it has them.
- Generated code then runs the chosen plan. Caching a table is a separate storage decision; Catalyst's job is the plan, not a manual memory tier.

**Examples:**

```text
SELECT path FROM events WHERE day = '2026-10-04'
```

Analysis binds `events`. A logical rule can push `day` into a partitioned reader and drop every column except `path` before the scan.
</details>

<details>
<summary>How does Tungsten contribute to Spark's performance?</summary>

### How does Tungsten contribute to Spark's performance?

**Definition:**

Tungsten is Spark's execution layer that stores rows in a compact binary layout and runs generated code so the CPU spends less time on objects and garbage collection.

**How it works:**

- The binary format keeps column values in a cache-friendly layout instead of a graph of Java objects per field.
- Managed memory can sit off the Java heap, which avoids scanning those bytes during garbage collection. Execution memory and storage memory share one pool and can borrow from each other.
- Whole-stage code generation fuses several operators into one Java method, which removes virtual calls and intermediate rows between them.
- Encoders convert between JVM objects and that binary form at the boundary. Operators in the middle can work on bytes without serialising a row for every step.

**Examples:**

A cached DataFrame of `(name, age)` is stored as Tungsten rows. A later `filter` and `count` can run as generated code over that layout instead of allocating a Java object per field per row.
</details>

### Spark Programming and APIs

<details>
<summary>Briefly describe the Spark Core API and its features.</summary>

### Briefly describe the Spark Core API and its features.

**Definition:**

</details>

<details>
<summary>What are the transformations and actions in Spark RDDs?</summary>

### What are the transformations and actions in Spark RDDs?

**Definition:**

</details>

<details>
<summary>How do you handle partitioning in Spark to optimize performance?</summary>

### How do you handle partitioning in Spark to optimize performance?

**Definition:**

</details>

<details>
<summary>Illustrate the differences between map and flatMap functions in Spark.</summary>

### Illustrate the differences between map and flatMap functions in Spark.

**Definition:**

</details>

<details>
<summary>What are Key-Value pair RDDs, and when would you use them?</summary>

### What are Key-Value pair RDDs, and when would you use them?

**Definition:**

</details>

<details>
<summary>Explain how to perform a join operation in Spark.</summary>

### Explain how to perform a join operation in Spark.

**Definition:**

</details>

<details>
<summary>Detail how window functions work in Spark SQL.</summary>

### Detail how window functions work in Spark SQL.

**Definition:**

</details>

### Spark Streaming and Real-Time Processing

<details>
<summary>Describe the concept of discretized streams (DStreams) in Spark.</summary>

### Describe the concept of discretized streams (DStreams) in Spark.

**Definition:**

</details>

<details>
<summary>How does Structured Streaming differ from DStream-based streaming?</summary>

### How does Structured Streaming differ from DStream-based streaming?

**Definition:**

</details>

<details>
<summary>What are the fault-tolerance mechanisms in Spark Streaming?</summary>

### What are the fault-tolerance mechanisms in Spark Streaming?

**Definition:**

</details>

<details>
<summary>How do you handle late data and stateful processing in Spark Streaming?</summary>

### How do you handle late data and stateful processing in Spark Streaming?

**Definition:**

</details>

<details>
<summary>Explain watermarks and windowing operations in Structured Streaming.</summary>

### Explain watermarks and windowing operations in Structured Streaming.

**Definition:**

</details>

### Performance Tuning and Optimization

<details>
<summary>What are some common Spark performance issues and how do you resolve them?</summary>

### What are some common Spark performance issues and how do you resolve them?

**Definition:**

</details>

<details>
<summary>How can you minimize data shuffling in Spark?</summary>

### How can you minimize data shuffling in Spark?

**Definition:**

</details>

<details>
<summary>Discuss the importance and methods of caching/persistence in Spark.</summary>

### Discuss the importance and methods of caching/persistence in Spark.

**Definition:**

</details>

<details>
<summary>Explain how you would monitor and log a Spark application.</summary>

### Explain how you would monitor and log a Spark application.

**Definition:**

</details>

<details>
<summary>What is the role of partitioner objects in Spark and how do they affect performance?</summary>

### What is the role of partitioner objects in Spark and how do they affect performance?

**Definition:**

</details>

### Spark MLlib (Machine Learning Library)

<details>
<summary>What are the main features of Spark MLlib?</summary>

### What are the main features of Spark MLlib?

**Definition:**

</details>

<details>
<summary>How does Spark MLlib handle machine learning pipelines?</summary>

### How does Spark MLlib handle machine learning pipelines?

**Definition:**

</details>

<details>
<summary>Describe a use case for MLlib's collaborative filtering algorithms.</summary>

### Describe a use case for MLlib's collaborative filtering algorithms.

**Definition:**

</details>

<details>
<summary>Explain the difference between Spark MLlib and external machine learning libraries.</summary>

### Explain the difference between Spark MLlib and external machine learning libraries.

**Definition:**

</details>

### Coding Challenges

<details>
<summary>Write a Scala/Python Spark code snippet that reads a CSV file and calculates the average of a column.</summary>

### Write a Scala/Python Spark code snippet that reads a CSV file and calculates the average of a column.

**Definition:**

</details>

<details>
<summary>Implement a Spark streaming application that counts words in text data received from a socket.</summary>

### Implement a Spark streaming application that counts words in text data received from a socket.

**Definition:**

</details>

<details>
<summary>Code a Spark SQL query that finds the top 3 most occurring words in a DataFrame.</summary>

### Code a Spark SQL query that finds the top 3 most occurring words in a DataFrame.

**Definition:**

</details>

<details>
<summary>Create a Spark job that joins two datasets on a key and summarizes data.</summary>

### Create a Spark job that joins two datasets on a key and summarizes data.

**Definition:**

</details>

<details>
<summary>Write a Python function using PySpark to filter out records with null values in a specific column.</summary>

### Write a Python function using PySpark to filter out records with null values in a specific column.

**Definition:**

</details>

<details>
<summary>Implement a logistic regression model in Spark MLlib.</summary>

### Implement a logistic regression model in Spark MLlib.

**Definition:**

</details>

<details>
<summary>Create a Spark Streaming application to aggregate event data by time windows.</summary>

### Create a Spark Streaming application to aggregate event data by time windows.

**Definition:**

</details>

<details>
<summary>Write Spark code to calculate the PageRank of a simple website link graph.</summary>

### Write Spark code to calculate the PageRank of a simple website link graph.

**Definition:**

</details>

### Case Studies and Scenario-Based Questions

<details>
<summary>How would you build a recommender system in Spark?</summary>

### How would you build a recommender system in Spark?

**Definition:**

</details>

<details>
<summary>Discuss a strategy to perform real-time sentiment analysis using Spark Streaming.</summary>

### Discuss a strategy to perform real-time sentiment analysis using Spark Streaming.

**Definition:**

</details>

<details>
<summary>Propose an ETL pipeline design using Spark to process large datasets.</summary>

### Propose an ETL pipeline design using Spark to process large datasets.

**Definition:**

</details>

<details>
<summary>How would you use Spark to detect fraudulent behavior in financial transactions?</summary>

### How would you use Spark to detect fraudulent behavior in financial transactions?

**Definition:**

</details>

<details>
<summary>Illustrate how you would use Spark to optimize marketing strategies based on customer behavior data.</summary>

### Illustrate how you would use Spark to optimize marketing strategies based on customer behavior data.

**Definition:**

</details>

<details>
<summary>Explain a big data analytics project where Spark would be a better choice than other big data technologies and why.</summary>

### Explain a big data analytics project where Spark would be a better choice than other big data technologies and why.

**Definition:**

</details>

### Advanced Topics and Research

<details>
<summary>Discuss the advancements in Spark 3.x and their impact on big data processing.</summary>

### Discuss the advancements in Spark 3.x and their impact on big data processing.

**Definition:**

</details>

<details>
<summary>Explain how Dynamic Resource Allocation works in Spark.</summary>

### Explain how Dynamic Resource Allocation works in Spark.

**Definition:**

</details>

<details>
<summary>How do you implement custom aggregations in Spark?</summary>

### How do you implement custom aggregations in Spark?

**Definition:**

</details>

<details>
<summary>What are the current research areas or challenges in the Apache Spark ecosystem?</summary>

### What are the current research areas or challenges in the Apache Spark ecosystem?

**Definition:**

</details>

<details>
<summary>How does Spark support deep learning workloads and integration with popular deep learning frameworks?</summary>

### How does Spark support deep learning workloads and integration with popular deep learning frameworks?

**Definition:**

</details>
