# CAP Theorem — Interview

Answers are filled for every question on this page.

[← Back to hub](./0_system_design.md)

### Related docs

- [CAP Theorem — Interview](./0_sd_cap_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — CAP Theorem](https://devinterview.io/questions/software-architecture-and-system-design/cap-theorem-interview-questions/).

### CAP Theorem Fundamentals

<details>
<summary>What is CAP Theorem and why it’s important for distributed systems?</summary>

### What is CAP Theorem and why it’s important for distributed systems?

**Definition:**

Brewer’s conjecture, later proved for a precise model by Gilbert and Lynch, says a distributed store cannot promise linearizable consistency, availability, and partition tolerance together. The theorem matters because real networks do split, so the choice during a split is a design decision, not an accident.

**How it works:**

- Consistency means a read returns the latest completed write, or fails, as if there were a single copy.
- Availability means every request that reaches a node that has not crashed gets a response that is not an error. The value does not have to be the newest write.
- Partition tolerance means the system keeps operating when messages between nodes are lost or delayed.
- While the network is healthy, a system can offer both consistency and availability. The theorem binds only when a partition is present.
- A CP design, typical of a primary with required synchronous replicas, refuses an operation it cannot make linearizable.
- An AP design, typical of Cassandra or DynamoDB on an eventually consistent read, answers from reachable replicas and repairs afterward.
- A design that assumes the network never splits can look consistent and available, but it is not a distributed system under partition.

**Examples:**

Two replicas lose the link between them. The CP replica rejects the write. The AP replica accepts it locally, and the two copies are merged after the link returns. Spanner spends coordination to stay linearizable when a quorum is reachable. DynamoDB’s default read stays available and may lag the latest write.
</details>

<details>
<summary>How does the CAP Theorem define consistency in the context of a distributed system?</summary>

### How does the CAP Theorem define consistency in the context of a distributed system?

**Definition:**

In CAP, consistency means linearizability: once a write completes, every later read sees that write or a newer one, or the read fails. It is not a promise that replicas will match sometime later.

**How it works:**

- A consistent system behaves like one copy, even though the data is stored on several nodes.
- If a node cannot confirm it holds the latest completed write, it refuses the request instead of returning a stale value.
- That refusal is what availability gives up while a partition lasts.
- Eventual consistency is the weaker model you get when you drop CAP consistency: updates propagate, and replicas agree only after the updates stop.
- Strong consistency keeps one order of writes visible to everyone, and it needs coordination, so a cut network can make the operation fail.
- Causal consistency sits between them: it preserves cause and effect, but it still allows replicas to lag.

**Examples:**

A client writes `balance = 40` and gets success. The next read, on any replica the system still serves, must return 40 or a later value. If the replica is cut off from the leader, a linearizable read returns an error rather than the old balance of 100.
</details>

<details>
<summary>What does availability mean in CAP Theorem?</summary>

### What does availability mean in CAP Theorem?

**Definition:**

Availability in CAP means every request that arrives at a node that has not crashed receives a non-error response, without waiting to learn whether the other nodes agree. The response may be stale.

**How it works:**

- “Available” means the node answers. It does not mean the answer is the latest write.
- A timeout or an error because a quorum cannot be reached is a failure of availability, even if the node itself is up.
- During a partition the system either keeps answering (and may disagree with the other side) or stops answering so it can stay linearizable.
- How fresh the answer is depends on the consistency model you chose: eventual, causal, or strong.
- Replication, sharding, and failover change how often a live node can still answer, but they do not remove the choice while the network is split.

**Examples:**

A replica is up but cannot reach the leader. An available system returns the value it has locally. A system that waits for a majority and then returns an error has chosen consistency. DNS is the everyday case: a resolver answers from its cache while the authority is unreachable.
</details>

<details>
<summary>Explain partition tolerance in a distributed system as stated by the CAP Theorem.</summary>

### Explain partition tolerance in a distributed system as stated by the CAP Theorem.

**Definition:**

Partition tolerance means the system continues to operate when the network drops or delays messages between nodes. Nodes on both sides of the cut may still be running.

**How it works:**

- A partition is a cut in communication, not necessarily a crashed machine.
- A system that is not partition tolerant can keep both consistency and availability only by stopping as a whole, or by not being distributed.
- In practice a wide-area system must tolerate partitions, so while one lasts the real choice is consistency or availability.
- After the cut heals, replicas exchange what they missed and apply a merge rule.
- Geo-distributed services expect this: a region can keep serving while the link to another region is down.

**Examples:**

Node A records `name = Ada` and node B, cut off, records `name = Bo`. Each side still answers. When the link returns, a last-writer-wins merge keeps the value with the later timestamp, and the other write is discarded. A collaborative editor does the same kind of thing: both users keep typing, and the document reconciles overlapping edits.
</details>

### Real-World Implications and Trade-offs

<details>
<summary>Give an example of a real system that favors consistency over availability.</summary>

### Give an example of a real system that favors consistency over availability.

**Definition:**

A relational primary that refuses a commit when a required synchronous replica is unreachable favors consistency. ZooKeeper and etcd do the same: without a quorum they reject writes, and often reads, rather than serve two views of one key.

**How it works:**

- The commit waits until the replicas that must agree have the new value.
- If that set cannot be reached, the client gets an error instead of a success that only one side recorded.
- Readers that do get a response see a committed value, not a write that might roll back.
- The cost is downtime or rejected traffic on the minority side of a partition.
- That trade fits ledgers, inventory that must not oversell, and records where a wrong value is worse than a failed request.

**Examples:**

```sql
BEGIN;
UPDATE accounts SET balance = balance - 25 WHERE id = 42 AND balance >= 25;
COMMIT; -- errors if the synchronous standby cannot acknowledge
```

Until the standby is reachable again, the transfer does not commit. A later successful read shows the old balance, not a debit that existed on only one node.
</details>

<details>
<summary>Can you name a system that prefers availability over consistency?</summary>

### Can you name a system that prefers availability over consistency?

**Definition:**

Apache Cassandra, when a request uses consistency level `ONE`, prefers availability: any reachable replica can accept the operation, and another replica may still hold an older value until repair. DynamoDB’s default reads make the same choice.

**How it works:**

- Nodes are peers. There is no single primary that every request must reach.
- A consistent hash ring places each key on a set of replicas, so the loss of some nodes does not stop the ring.
- The consistency level is chosen per request. `ONE` answers if a single replica responds. `QUORUM` waits for a majority and can fail during a partition.
- While replicas disagree, reads can return different values. Hinted handoff and repair push them back together.
- The system stays up through a partition and reconciles afterward.

**Examples:**

```sql
INSERT INTO cart (user_id, sku) VALUES (7, 'lamp') USING CONSISTENCY ONE;
SELECT sku FROM cart WHERE user_id = 7 USING CONSISTENCY ONE;
```

The insert succeeds on the local replica even if the others are cut off. A select on another replica can miss `lamp` until the write is repaired.
</details>

<details>
<summary>What is meant by “eventual consistency” in the context of CAP Theorem?</summary>

### What is meant by “eventual consistency” in the context of CAP Theorem?

**Definition:**

Eventual consistency means that if updates stop, every replica that keeps receiving the missed updates converges to the same value. While updates are still flowing, reads are allowed to disagree.

**How it works:**

- The system can accept a write on a reachable replica without waiting for every copy.
- There is no single global moment when all nodes flip together. Each replica applies updates as they arrive.
- A conflict rule — last writer wins, a version vector, or a merge function — turns divergent updates into one state.
- It does not by itself promise that your next read sees your own last write. That needs an extra session guarantee.
- The costs are stale reads, harder application logic, and a window where you cannot yet say the system has settled.
- This is the consistency you usually keep when a system stays available through a partition.

**Examples:**

Two shoppers add the last lamp to two carts while the catalog replicas are split. Both adds succeed. When the replicas merge, one cart keeps the lamp and the other is told the item is gone. Until that merge, the two carts disagree, and that disagreement is allowed.
</details>

<details>
<summary>What trade-offs you might have to make in a distributed system design due to the CAP Theorem.</summary>

### What trade-offs you might have to make in a distributed system design due to the CAP Theorem.

**Definition:**

Because partitions happen, a distributed design must say which guarantee it will drop while the network is split. You cannot keep linearizability, an answer to every live node, and continued operation through message loss all at once.

**How it works:**

- A CP design serves only when it can confirm the latest write, usually with a majority. Clients see errors, not silent lost updates. Primary–replica SQL and a quorum-tuned store sit here.
- An AP design answers from whatever replicas it can reach. Copies may disagree until repair. Cassandra and Couchbase are built around this default.
- Waiting for a quorum also adds latency when the network is merely slow, not fully cut.
- Some operations can be stricter than others: a checkout uses a quorum, a product view uses one replica.
- Stores such as Cassandra, Riak, and DynamoDB expose that dial per request instead of one global mode.
- Money movement and scientific records tend to pick CP. Feeds, catalogs, and carts often pick AP and reconcile.

**Examples:**

A catalog page reads with one replica so it stays up during a regional blip, and may show yesterday’s price for a few seconds. The payment call uses a majority and fails closed if that majority is gone. Same database, two different points on the trade-off.
</details>

### Designing with CAP in Mind

<details>
<summary>How would you design a system that requires high availability and what trade-offs would you have to make according to the CAP Theorem?</summary>

### How would you design a system that requires high availability and what trade-offs would you have to make according to the CAP Theorem?

**Definition:**

A system that must keep answering through failures takes an AP stance: a reachable replica serves the request, and replication is asynchronous. The price is temporary disagreement between copies.

**How it works:**

- Treat partition tolerance as given. The guarantee you relax is linearizability, not the ability to survive a cut.
- Accept reads and writes on the side of the partition that clients can still reach.
- Replicate in the background, then converge with a conflict rule once the link returns.
- Make writes idempotent so a retry does not apply twice.
- Keep a stricter path only for the few operations that cannot tolerate a stale or double result, and accept that those calls may fail during the split.
- Cassandra, Riak, and DynamoDB on eventually consistent reads are the usual reference shapes.

**Examples:**

A product catalog is deployed in two regions. Each region writes views and carts locally. A reader in one region can miss a price change made in the other until async replication lands. The charge against a saved card still goes through a single ledger that rejects the call if it cannot form a quorum.
</details>

<details>
<summary>If a system is experiencing a partition (network failure), what strategies can you employ to maintain service?</summary>

### If a system is experiencing a partition (network failure), what strategies can you employ to maintain service?

**Definition:**

During a partition, pick a side of the CAP choice on purpose, then keep a path for the service you still intend to offer. “Keep both consistency and availability while messages are lost” is not a strategy the theorem allows.

**How it works:**

- Detect the cut with timeouts and failed heartbeats, not with an infinite wait.
- CP: only the side that can still form a quorum accepts writes. The other side returns errors or goes read-only against data it already committed.
- AP: both sides keep serving. Queue missed updates, use hinted handoff, and merge when the link returns.
- Prefer a single writer, or fence the old leader, so two sides do not both believe they are primary.
- A cache or a degraded response can cover a read when the authoritative store is on the other side of the cut. Label that response as possibly stale.
- After healing, reconcile before you tell clients the data is settled.

**Examples:**

```text
on read:
  try quorum
  on partition: return local replica and mark the response stale
on write:
  if quorum possible: commit
  else: reject   # CP path for money
        # or append to a local log for later merge  # AP path for a cart
```
</details>

<details>
<summary>Considering the CAP Theorem, how would you approach building a distributed system that handles sensitive financial transactions?</summary>

### Considering the CAP Theorem, how would you approach building a distributed system that handles sensitive financial transactions?

**Definition:**

For a ledger, favor consistency over availability. A debit that cannot be confirmed with a quorum should fail, not apply on both sides of a partition.

**How it works:**

- One account has one writer at a time, or a consensus group that commits only after a majority acknowledges.
- Synchronous replication of the committed balance. An asynchronous copy is fine for reporting, not for the decision to debit.
- Idempotency keys so a client retry does not charge twice after a timeout.
- A write-ahead log gives every replica the same order of committed operations once it receives them.
- Latency goes up because the commit waits for the quorum. That delay is accepted so two regions cannot both spend the same balance.
- Historical statements can be read from a replica. The commit path cannot.
- After a partition, recovery replays the log. It does not invent a second successful debit.

**Examples:**

Three ledger nodes, write quorum 2. A transfer is committed only after two nodes persist `debit 25 from account 42, key pay-91`. If the client retries `pay-91`, the second attempt sees the key and does not debit again. If only one node is reachable, the transfer returns an error and the balance stays unchanged.
</details>

### CAP in Practice

<details>
<summary>Describe a scenario where a system may switch from being CA to AP during its operation due to external factors.</summary>

### Describe a scenario where a system may switch from being CA to AP during its operation due to external factors.

**Definition:**

A service can look consistent and available only while every replica can still talk. When a partition appears, operators who keep serving have switched that service to AP behavior. The theorem did not change. The network did.

**How it works:**

- In the healthy case a cart write is committed through one primary, and the next read sees that write. People label this CA, but it depends on an intact network.
- Heartbeats notice that a second region can no longer reach the primary.
- To stay up, that region accepts cart edits locally and replicates them later. Copies may diverge until a merge.
- Availability is kept. Linearizability is not. That is the AP choice for the duration of the cut.
- When the link returns, the regions reconcile carts before they again claim a single latest version.

**Examples:**

Before the cut, adding a shirt and reloading the cart always shows the shirt, because both calls hit the primary. During a split between regions, the distant region still lets the shopper add a hat, stored only locally. After the link heals, the two carts are merged. For a few minutes the hat was invisible to the primary, which is the inconsistency the team accepted in order to keep the cart usable.
</details>

<details>
<summary>How do quorums help in achieving consistency or availability in distributed systems, and how is this related to CAP Theorem?</summary>

### How do quorums help in achieving consistency or availability in distributed systems, and how is this related to CAP Theorem?

**Definition:**

A quorum is the smallest set of replicas that must acknowledge an operation before the system treats it as done. The sizes of the read quorum and the write quorum are the dial between CAP consistency and availability.

**How it works:**

- If the read set and the write set must overlap, a read intersects a replica that saw the latest write. The usual rule is R + W greater than the number of replicas.
- A larger quorum is closer to consistency and more likely to fail when a partition leaves too few replicas reachable.
- A quorum of one still answers when a single replica is up, and it can miss a write that landed elsewhere.
- During a partition, a quorum that cannot be formed turns the operation into an error. That is the consistent choice.
- Shrinking the quorum keeps the operation available and allows two sides to accept writes that later conflict.

**Examples:**

Three replicas. W = 2 and R = 2 overlap, so a read sees the newest committed write, and the call fails if two replicas are unreachable. W = 1 and R = 1 succeed against any single replica, and a read can return a value the other two have already replaced.
</details>

<details>
<summary>How do modern databases like Cassandra or DynamoDB address the challenges posed by the CAP Theorem?</summary>

### How do modern databases like Cassandra or DynamoDB address the challenges posed by the CAP Theorem?

**Definition:**

Cassandra and DynamoDB do not escape CAP. They expose the consistency-versus-availability choice per request, and they stay up when some replicas are unreachable.

**How it works:**

- Cassandra is masterless. Any replica of a key can coordinate a request, so the loss of one node does not take the key offline.
- Its consistency level is per statement. `ONE` or `LOCAL_ONE` favors an answer. `QUORUM` or `ALL` favors a fresher value and can fail when those replicas are cut off.
- Hinted handoff, read repair, and anti-entropy push replicas back together after they diverge.
- DynamoDB partitions by key. A strongly consistent read is served by the leader of that partition and can fail if the leader cannot be reached.
- The default DynamoDB read is eventually consistent, so the API keeps answering from a replica that might lag by a short time.
- Inside one partition, writes are ordered by the leader. Across a network split, the product still has to refuse the strict read or serve a possibly stale one.

**Examples:**

A Cassandra query for a shopping cart uses `LOCAL_QUORUM` in the same region and `ONE` for a product-name lookup that can tolerate a stale title. A DynamoDB `GetItem` without a strong-consistency flag may return the previous price; the same call with the flag waits for the partition leader and errors if that leader is unavailable.
</details>

### Advanced Understanding of CAP

<details>
<summary>Explain how concepts like idempotency, commutativity, and convergence are important in designs that are influenced by the CAP Theorem.</summary>

### Explain how concepts like idempotency, commutativity, and convergence are important in designs that are influenced by the CAP Theorem.

**Definition:**

An AP design stays available by accepting updates that replicas have not all seen yet. Idempotency, commutativity, and convergence are what stop those updates from becoming a permanent disagreement.

**How it works:**

- Idempotency: doing the operation again leaves the same state. A timeout retry is then safe. Setting a key to a value is idempotent. A bare increment is not.
- Commutativity: applying two updates in either order yields the same state. Replicas that receive messages in different orders can still agree.
- Convergence: replicas that have seen the same set of updates reach the same state. A merge function or a conflict-free replicated data type provides that.
- Without the three, staying available through a partition produces split histories that no later repair can reconcile cleanly.
- Conflict rules and caches of the latest value per key are practical forms of the same idea.

**Examples:**

Two sides of a partition both add a cart line with its own id. The merge is a set union, so order does not matter and repeating an id changes nothing. Two sides that both do `count = count + 1` on a plain integer do not converge: each thinks the count rose by one, and a later repair cannot tell the increments apart.
</details>
