# Hadoop — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [Hadoop — Interview](./0_sd_hadoop_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Hadoop](https://devinterview.io/questions/machine-learning-and-data-science/hadoop-interview-questions/).

### Hadoop Fundamentals

<details>
<summary>What is Hadoop and what are its core components?</summary>

### What is Hadoop and what are its core components?

**Definition:**

Hadoop is an open-source stack for keeping very large files on a cluster of ordinary servers and running batch jobs beside those files.

**How it works:**

- HDFS splits each file into large blocks, stores copies on DataNodes, and keeps the directory tree plus the block map on the NameNode. The file bytes never pass through the NameNode.
- YARN hands out containers of CPU and memory. A ResourceManager tracks the cluster, a NodeManager runs on each machine, and each application has its own ApplicationMaster.
- MapReduce is the original batch model: mappers emit key-value pairs, a shuffle groups equal keys, and reducers aggregate one key at a time.
- Hive adds a SQL-like warehouse over those files, Pig a data-flow script language, HBase random row access, ZooKeeper cluster coordination, and Oozie multi-step workflows. Mahout was the older library of batch learning jobs.
</details>

<details>
<summary>Explain the concept of a Hadoop Distributed File System (HDFS) and its architecture.</summary>

### Explain the concept of a Hadoop Distributed File System (HDFS) and its architecture.

**Definition:**

HDFS is a distributed file system for commodity disks. It favors long sequential reads of huge files over low-latency updates of small ones.

**How it works:**

- A file is a sequence of blocks. The default block is 128 MB and the usual replication factor is three; both are set per file. Only the last block may be short.
- The NameNode owns the namespace: create, rename, delete, permissions, and which DataNodes hold each block. DataNodes store the blocks and serve client reads and writes.
- A write pipelines a block through DataNodes so replicas are filled as the bytes arrive. A read asks the NameNode for locations, then streams from the closest replica.
- Design assumptions are write-once (append and truncate aside), one writer at a time, and moving the job to the data instead of shipping the file to the job.
- Small files waste NameNode memory because every block is metadata. HDFS is a poor fit for interactive random updates that need a strong per-row transaction.

**Examples:**

A client opens `/logs/2026-10-04/events.txt`. The NameNode returns the DataNodes that hold block `blk_42`. The client then streams that block from the nearest DataNode and never pulls the payload through the NameNode.
</details>

<details>
<summary>How does MapReduce programming model work in Hadoop?</summary>

### How does MapReduce programming model work in Hadoop?

**Definition:**

MapReduce turns a large batch into two functions: map, which labels records, and reduce, which aggregates every record that shares a label.

**How it works:**

- The input is split into pieces, typically aligned with HDFS blocks. Each mapper reads one split and emits intermediate key-value pairs.
- A partitioner decides which reducer owns a key. The shuffle sorts and groups pairs so one reducer sees every value for its keys.
- An optional combiner pre-aggregates pairs on the mapper host, which cuts shuffle traffic when the combine is safe (sums, counts).
- The framework prefers to schedule a task on a node that already holds the block. A failed or slow task is retried on another node.

**Examples:**

```text
map("red fish blue fish") -> (red, 1), (fish, 1), (blue, 1), (fish, 1)
shuffle groups fish -> [1, 1]
reduce(fish, [1, 1]) -> (fish, 2)
```
</details>

<details>
<summary>What is YARN, and how does it improve Hadoop's resource management?</summary>

### What is YARN, and how does it improve Hadoop's resource management?

**Definition:**

YARN separates cluster scheduling from the MapReduce programming model, so several engines can share one pool of CPU and memory.

**How it works:**

- In the older JobTracker design, one process both assigned slots and drove the MapReduce job. A single kind of slot map made Spark or Tez awkward guests.
- The ResourceManager is the cluster scheduler. Each NodeManager advertises free CPU and memory and launches containers. Each application elects an ApplicationMaster that requests containers and tracks its own tasks.
- A container is a slice of CPU and memory, not a fixed map slot or reduce slot. A job asks for what a task needs.
- Capacity or fair queues divide the cluster among teams. MapReduce, Spark, and Tez can run side by side because they are applications, not the scheduler.
</details>

<details>
<summary>Explain the role of the Namenode and Datanode in HDFS.</summary>

### Explain the role of the Namenode and Datanode in HDFS.

**Definition:**

The NameNode is the metadata master. DataNodes are the workers that hold block bytes and talk to clients.

**How it works:**

- The NameNode stores the directory tree, permissions, replication factor, and the list of DataNodes for each block. User data does not flow through it.
- A DataNode stores blocks on local disks, serves reads and writes, and creates, deletes, or copies blocks when the NameNode tells it to.
- Each DataNode sends a heartbeat and a periodic block report. A missing heartbeat means those replicas are gone, and the NameNode schedules new copies until the factor is restored.
- Namespace edits go to an edit log and periodic checkpoints (fsimage). A standby NameNode, fed by a quorum of journal nodes, can take over; the older secondary NameNode only built checkpoints and was not a hot spare.
</details>

<details>
<summary>What is a Rack Awareness algorithm in HDFS, and why is it important?</summary>

### What is a Rack Awareness algorithm in HDFS, and why is it important?

**Definition:**

Rack awareness is the NameNode's map from DataNode to rack, used so replicas survive a switch failure without paying a cross-rack copy on every write.

**How it works:**

- A topology script or a static mapping tells the NameNode which rack each DataNode sits in. Bandwidth inside a rack is treated as cheaper than bandwidth through the core switch.
- With three replicas the usual policy puts the first on the writer (or a node in the writer's rack), the second on a node in a different rack, and the third on another node in that same remote rack.
- A whole rack can die and one replica remains. Putting all three replicas on three different racks would also survive a rack loss, but every write would cross the core twice.
- A reader is steered to the closest replica: same node, then same rack, then the local data center.
</details>

<details>
<summary>What are some of the characteristics that differentiate Hadoop from traditional RDBMS?</summary>

### What are some of the characteristics that differentiate Hadoop from traditional RDBMS?

**Definition:**

Hadoop is a file-and-batch platform. A relational database is a transactional store with a schema enforced on every write.

**How it works:**

- Hadoop applies structure when a job reads the files (schema on read). An RDBMS rejects a row that does not match the table (schema on write).
- HDFS scales by adding cheap machines and is comfortable with huge scans. An RDBMS is built for indexed lookups and short updates on structured tables.
- MapReduce and SQL-on-Hadoop jobs scan and aggregate. An RDBMS updates single rows under locks and expects many concurrent small transactions.
- HDFS keeps several block copies and allows one writer, append, and truncate. An RDBMS aims for committed transactions that other sessions see consistently.
- Logs, clicks, and dumps land in Hadoop first. Orders, balances, and inventory that must not tear belong in the database.
</details>

<details>
<summary>How can you secure a Hadoop cluster? Name some of the security mechanisms available.</summary>

### How can you secure a Hadoop cluster? Name some of the security mechanisms available.

**Definition:**

A production cluster authenticates users, authorizes each service, and encrypts data on disk and on the wire.

**How it works:**

- Kerberos is the usual authentication. User accounts often come from LDAP or Active Directory. After login, services issue delegation tokens so tasks do not repeat the Kerberos exchange.
- HDFS applies owner, group, and other permissions, plus ACLs on files and directories. Apache Ranger (and the older Sentry) add central policies for Hive, HBase, and similar services.
- Encryption zones in HDFS store files encrypted at rest. A key management service unwraps the zone key for authorized clients. RPC and data transfer can use SASL and TLS.
- Proxy-user settings let a service such as Hive impersonate the end user so the file-system check sees that user, not the service account. Shell and host access still need ordinary OS hardening.
</details>

### Hadoop Ecosystem and Tools

<details>
<summary>Describe the role of HBase in Hadoop ecosystem.</summary>

### Describe the role of HBase in Hadoop ecosystem.

**Definition:**

HBase is a column-family store on HDFS for large tables that need random reads and writes, which batch scans in Hive serve too slowly.

**How it works:**

- Rows are ordered by a row key and split into regions. RegionServers serve those ranges. An HMaster assigns regions, and ZooKeeper tracks the active master and region locations.
- A column family groups columns stored together. Versions of a cell are kept by timestamp. One row is strongly consistent; the system is not a multi-row transaction database.
- On the CAP axis, HBase prefers consistency and partition behavior for a single row and gives up availability of that region while a server is down.
- Typical tables are time series, click or device events, feature lookups, and metadata that must be fetched by key rather than scanned.
</details>

<details>
<summary>What is Apache Hive and what types of problems does it solve?</summary>

### What is Apache Hive and what types of problems does it solve?

**Definition:**

Hive is a warehouse layer: analysts write HiveQL, and Hive plans that query as jobs over files that already live in HDFS or object storage.

**How it works:**

- The metastore records databases, table schemas, partitions, and the file locations. The bytes stay in the files; the metastore does not hold the table body.
- A driver parses HiveQL, an optimizer rewrites the plan, and an execution engine (MapReduce, Tez, or Spark) runs it. HiveServer2 accepts remote JDBC and ODBC sessions.
- It fits scans, aggregations, joins, and ETL on large batches. It does not replace a database for single-row transactions.
- Partitioned external tables let a query skip whole directories, which is how daily log dumps stay cheap to query.
</details>

<details>
<summary>How does Apache Pig fit into the Hadoop ecosystem?</summary>

### How does Apache Pig fit into the Hadoop ecosystem?

**Definition:**

Pig is a script language, Pig Latin, for multi-step file pipelines when the author does not want to write mappers and reducers by hand.

**How it works:**

- A script loads files, filters, joins, groups, and stores a result. The steps describe a data flow, and the schema can stay loose until a field is used.
- The script is compiled into a logical plan. Work starts when a store or dump is requested, so unused branches are not executed.
- The plan runs as MapReduce or a newer engine. User-defined functions in Java or Python cover steps the language does not express.
- Hive is the better fit for SQL analysts. Pig is the better fit for a procedural pipeline with custom functions.

**Examples:**

```text
clicks = LOAD '/logs/clicks' AS (user:chararray, path:chararray);
home = FILTER clicks BY path == '/';
per_user = GROUP home BY user;
STORE per_user INTO '/out/home-users';
```

Nothing is computed until `STORE`.
</details>

<details>
<summary>Explain how Apache Flume helps with log and event data collection for Hadoop.</summary>

### Explain how Apache Flume helps with log and event data collection for Hadoop.

**Definition:**

Flume moves event streams, usually logs, from many producers into HDFS or another sink without a custom collector on every host.

**How it works:**

- An agent is three pieces: a source that receives events, a channel that buffers them, and a sink that writes them out.
- A durable file channel keeps accepted events until the sink commits, so a process restart does not drop that batch. A memory channel is faster and can lose the buffer.
- Agents form tiers: many edge agents forward to fewer aggregators, which roll files in HDFS. Interceptors can stamp, filter, or rewrite an event on the way.
- Flume is aimed at continuous log streams. Sqoop is the tool for bulk copies of relational tables.

**Examples:**

```text
web servers -> Flume source (avro) -> file channel -> HDFS sink
rolls /logs/app/2026-10-04/events.0001
```
</details>

<details>
<summary>What is Apache Sqoop and how does it interact with Hadoop?</summary>

### What is Apache Sqoop and how does it interact with Hadoop?

**Definition:**

Sqoop bulk-copies tables between a relational database and Hadoop, using parallel map tasks instead of one client cursor.

**How it works:**

- An import reads slices of a table through JDBC and writes them to HDFS, Hive, or HBase. An export reads files from HDFS and inserts or updates rows back in the database.
- The split column, often a numeric primary key, divides the table into ranges. Each range is one mapper.
- Connectors cover common databases through JDBC. A direct mode exists for some engines and bypasses JDBC for speed.
- Incremental import can pull only rows newer than a last-value column, which is how a nightly warehouse stays in step with an operational table.

**Examples:**

```text
sqoop import --table orders --split-by id --target-dir /warehouse/orders
```

Four mappers might read `id` ranges 1–250000, 250001–500000, and so on, and write four part files.
</details>

<details>
<summary>How does Apache Oozie help in workflow scheduling in Hadoop?</summary>

### How does Apache Oozie help in workflow scheduling in Hadoop?

**Definition:**

Oozie runs a directed graph of Hadoop actions and can start that graph on a clock or when input data appears.

**How it works:**

- A workflow is the graph: MapReduce, Hive, Pig, Sqoop, shell, and similar action nodes, plus fork, join, and decision nodes.
- A coordinator fires the workflow on a schedule or when a dataset instance is ready. A bundle groups coordinators that should be started and stopped together.
- Each action reports success or failure. The graph can retry a step or follow an error transition. Parameters use expression language so one definition serves many dates.
- The Oozie server tracks state outside the short-lived YARN application, so a multi-hour pipeline can resume after a single action fails.

**Examples:**

A nightly graph forks a Sqoop import and a Flume roll-up, joins, then runs a Hive aggregation. The coordinator starts it when `/raw/2026-10-04` exists, and a failed Hive step follows the error path instead of marking the whole day successful.
</details>

<details>
<summary>What is Apache ZooKeeper and why is it important for Hadoop?</summary>

### What is Apache ZooKeeper and why is it important for Hadoop?

**Definition:**

ZooKeeper is a small replicated store for coordination: configuration, membership, and who the current leader is.

**How it works:**

- Clients see a tree of znodes. Updates are totally ordered. A session can create an ephemeral node that disappears when the session dies, and a sequential node whose name gets a counter.
- A watch notifies a client when a znode changes, so services do not poll every peer. The ensemble commits only when a majority agrees.
- HDFS high availability uses ZooKeeper so one NameNode is active. HBase uses it to elect the master and publish which server hosts a region. YARN can store the ResourceManager's recovery state there.
- It is a coordination service, not a database for application records. The data in a znode is meant to stay small.
</details>

<details>
<summary>Discuss the role of Apache Spark in the Hadoop ecosystem.</summary>

### Discuss the role of Apache Spark in the Hadoop ecosystem.

**Definition:**

</details>

### Data Management and Processing

<details>
<summary>How does Hadoop handle the failure of a datanode?</summary>

### How does Hadoop handle the failure of a datanode?

**Definition:**

</details>

<details>
<summary>Explain the process of data replication in HDFS.</summary>

### Explain the process of data replication in HDFS.

**Definition:**

</details>

<details>
<summary>What is speculative execution in Hadoop, and why is it used?</summary>

### What is speculative execution in Hadoop, and why is it used?

**Definition:**

</details>

<details>
<summary>How are large datasets processed in Hadoop?</summary>

### How are large datasets processed in Hadoop?

**Definition:**

</details>

<details>
<summary>What is the significance of the input split in MapReduce jobs?</summary>

### What is the significance of the input split in MapReduce jobs?

**Definition:**

</details>

<details>
<summary>How does partitioning work in Hadoop, and when is it used?</summary>

### How does partitioning work in Hadoop, and when is it used?

**Definition:**

</details>

<details>
<summary>Explain how reducers work in MapReduce and their interaction with shufflers.</summary>

### Explain how reducers work in MapReduce and their interaction with shufflers.

**Definition:**

</details>

<details>
<summary>What are SequenceFiles in Hadoop?</summary>

### What are SequenceFiles in Hadoop?

**Definition:**

</details>

### Performance Tuning and Optimization

<details>
<summary>Describe the ways to optimize a MapReduce job.</summary>

### Describe the ways to optimize a MapReduce job.

**Definition:**

</details>

<details>
<summary>How can you diagnose and troubleshoot Hadoop performance issues?</summary>

### How can you diagnose and troubleshoot Hadoop performance issues?

**Definition:**

</details>

<details>
<summary>What is the significance of combiner in the Hadoop MapReduce framework?</summary>

### What is the significance of combiner in the Hadoop MapReduce framework?

**Definition:**

</details>

<details>
<summary>Explain what you can do to optimize the performance of HDFS.</summary>

### Explain what you can do to optimize the performance of HDFS.

**Definition:**

</details>

<details>
<summary>How can job scheduling be optimized in Hadoop?</summary>

### How can job scheduling be optimized in Hadoop?

**Definition:**

</details>

<details>
<summary>What are the best practices for managing memory and CPU resources in a Hadoop cluster?</summary>

### What are the best practices for managing memory and CPU resources in a Hadoop cluster?

**Definition:**

</details>

### Coding Challenges

<details>
<summary>Write a MapReduce job in Java that counts the number of words in a text file.</summary>

### Write a MapReduce job in Java that counts the number of words in a text file.

**Definition:**

</details>

<details>
<summary>Create an HDFS command script that copies files from a local file system to HDFS.</summary>

### Create an HDFS command script that copies files from a local file system to HDFS.

**Definition:**

</details>

<details>
<summary>Implement a simple Hive query to summarize data from a Hive table.</summary>

### Implement a simple Hive query to summarize data from a Hive table.

**Definition:**

</details>

<details>
<summary>Code a Pig Latin script to process and transform a dataset into a desired format.</summary>

### Code a Pig Latin script to process and transform a dataset into a desired format.

**Definition:**

</details>

<details>
<summary>Automate a process to import data from a MySQL database into HDFS using Sqoop.</summary>

### Automate a process to import data from a MySQL database into HDFS using Sqoop.

**Definition:**

</details>

<details>
<summary>Implement a Spark job in Scala or Python to perform a join operation on two datasets.</summary>

### Implement a Spark job in Scala or Python to perform a join operation on two datasets.

**Definition:**

</details>

<details>
<summary>Develop an Oozie workflow that schedules and runs a set of MapReduce and Hive jobs.</summary>

### Develop an Oozie workflow that schedules and runs a set of MapReduce and Hive jobs.

**Definition:**

</details>

<details>
<summary>Write a Java program to implement custom input and output format classes in Hadoop.</summary>

### Write a Java program to implement custom input and output format classes in Hadoop.

**Definition:**

</details>

### Advanced Hadoop Features and Architecture

<details>
<summary>What is the concept of erasure coding in HDFS, and how does it differ from replication?</summary>

### What is the concept of erasure coding in HDFS, and how does it differ from replication?

**Definition:**

</details>

<details>
<summary>Explain how Hadoop uses data locality to improve performance.</summary>

### Explain how Hadoop uses data locality to improve performance.

**Definition:**

</details>

<details>
<summary>How does Hadoop support different file formats, and what are some of them?</summary>

### How does Hadoop support different file formats, and what are some of them?

**Definition:**

</details>

<details>
<summary>What is Hadoop federation, and how can it scale a Hadoop cluster?</summary>

### What is Hadoop federation, and how can it scale a Hadoop cluster?

**Definition:**

</details>

<details>
<summary>Discuss the concept and benefits of a journal node in HDFS HA configuration.</summary>

### Discuss the concept and benefits of a journal node in HDFS HA configuration.

**Definition:**

</details>

<details>
<summary>What are the implications of small files on HDFS performance and how can this be mitigated?</summary>

### What are the implications of small files on HDFS performance and how can this be mitigated?

**Definition:**

</details>

### Troubleshooting and Maintenance

<details>
<summary>How would you recover a Hadoop cluster from a Namenode failure?</summary>

### How would you recover a Hadoop cluster from a Namenode failure?

**Definition:**

</details>

<details>
<summary>What considerations should be made for Hadoop cluster backup and disaster recovery?</summary>

### What considerations should be made for Hadoop cluster backup and disaster recovery?

**Definition:**

</details>

<details>
<summary>How would you monitor the health of a Hadoop cluster, and what tools would you use?</summary>

### How would you monitor the health of a Hadoop cluster, and what tools would you use?

**Definition:**

</details>

<details>
<summary>Discuss a strategy for Hadoop cluster capacity planning and scaling.</summary>

### Discuss a strategy for Hadoop cluster capacity planning and scaling.

**Definition:**

</details>

### Scenario-Based Questions and Use Case Discussions

<details>
<summary>A company wants to process clickstream data in real-time. How would you integrate Hadoop and Spark to meet this requirement?</summary>

### A company wants to process clickstream data in real-time. How would you integrate Hadoop and Spark to meet this requirement?

**Definition:**

</details>

<details>
<summary>Propose a data pipeline using Hadoop components to manage and analyze sensor data from IoT devices.</summary>

### Propose a data pipeline using Hadoop components to manage and analyze sensor data from IoT devices.

**Definition:**

</details>
