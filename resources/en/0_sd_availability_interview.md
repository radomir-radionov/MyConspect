# Availability & Reliability — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [Availability & Reliability — Interview](./0_sd_availability_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Availability & Reliability](https://devinterview.io/questions/software-architecture-and-system-design/availability-and-reliability-interview-questions/).

### Availability & Reliability Fundamentals

<details>
<summary>What is the difference between availability and reliability in the context of a software system?</summary>

### What is the difference between availability and reliability in the context of a software system?

**Definition:**

Availability is the share of time a system can answer. Reliability is how likely it is to keep working correctly for a stretch without failing.

**How it works:**

- Availability is a percentage over a window: uptime divided by the window.
- Reliability is a probability of successful operation over an interval, often summarized by how long the system runs between failures.
- A system can be reliable and still look unavailable if repair takes a long time.
- A system can be patched back quickly, so availability stays high, while it still fails often.

**Examples:**

Down 15 minutes in an hour is 75% availability for that hour. Reliability asks a different question: how often those outages happen across months, not how long this one hour was dark.
</details>

<details>
<summary>How do you define system availability and what are the key components to measure it?</summary>

### How do you define system availability and what are the key components to measure it?

**Definition:**

System availability is the fraction of time the system is up and able to do its job. The usual estimate is mean time between failures divided by that time plus mean time to repair.

**How it works:**

- MTBF is the average time the system runs between failures.
- MTTR is the average time from noticing the failure to restoring service.
- Availability ≈ MTBF / (MTBF + MTTR). Raising MTBF or cutting MTTR both move the number up.
- Measure it over an agreed window, and count only the failures that users actually feel, or you will argue about the percentage.

**Examples:**

MTBF of 100 hours and MTTR of 2 hours gives 100 / 102 ≈ 98.0% availability. Cutting repair to 30 minutes raises it to about 99.5% without making the parts last longer.
</details>

<details>
<summary>Can you explain the concept of “Five Nines” and how it relates to system availability?</summary>

### Can you explain the concept of “Five Nines” and how it relates to system availability?

**Definition:**

Five nines means 99.999% availability: about 5.26 minutes of downtime in a year. It is a target for how little time the service may be dark, not a claim that nothing ever fails.

**How it works:**

- 90% is about 36.5 days down per year. 99% is about 3.65 days. 99.9% is about 8.8 hours.
- 99.99% is about 53 minutes. 99.999% is about 5.3 minutes. 99.9999% is about half a minute.
- Each extra nine costs redundancy, automation, and operational discipline, not a faster server.
- Redundant parts, more than one site, health checks, and automated failover are what make the target plausible.
- Planned maintenance counts unless you have a way to do it without stopping the service.
</details>

<details>
<summary>How does redundancy contribute to the reliability of a system?</summary>

### How does redundancy contribute to the reliability of a system?

**Definition:**

Redundancy keeps a spare ready so one failed part does not stop the service. Reliability goes up because the system can lose a component and continue.

**How it works:**

- Component redundancy mirrors a disk, a power supply, or a network path. RAID-1 keeps a second copy of the blocks.
- Subsystem redundancy duplicates a whole tier, such as two power feeds or two application pools.
- Information redundancy copies the data itself, with replication or erasure coding, so one copy’s loss is not data loss.
- Failover is the switch onto the spare. Load balancing is how traffic avoids the bad path.
- A quorum, such as two of three nodes, uses the extra copies to decide rather than to merely sit idle.

**Examples:**

Two disks in RAID-1: either disk can fail and reads still succeed from the other. One disk alone is a single point of failure.
</details>

<details>
<summary>What is a single point of failure (SPOF), and how can it be mitigated?</summary>

### What is a single point of failure (SPOF), and how can it be mitigated?

**Definition:**

A single point of failure is any part whose death takes the whole service down. Mitigation is a second path plus a way to switch to it.

**How it works:**

- A lone switch, a lone web server, or a lone power supply are the usual examples.
- Add a spare and a failover that moves traffic when health checks fail.
- Put more than one server behind a load balancer, and make the balancer itself a pair.
- Maintenance and a written recovery plan reduce the chance that the spare is stale or nobody knows how to use it.
- Practice the failover. A spare that has never been switched to is a hope, not a mitigation.

**Examples:**

One database primary with no replica: the primary’s disk dies and the site is down. A synchronous replica plus a promoted standby removes that single point.
</details>

<details>
<summary>Discuss the significance of Mean Time Between Failures (MTBF) in reliability engineering.</summary>

### Discuss the significance of Mean Time Between Failures (MTBF) in reliability engineering.

**Definition:**

MTBF is the average operating time between failures. A higher number means the component or system fails less often, which is the reliability side of the availability formula.

**How it works:**

- It is total operating time divided by the number of failures in that time.
- Planners use it to schedule replacement and to decide how much spare capacity to hold before the next failure is likely.
- The simple figure assumes a roughly constant failure rate. Wear-out and early-life failures do not follow that assumption.
- The number depends on load, temperature, and how the part is used. A datasheet MTBF is not your production MTBF.
- Drive vendors publish MTBF to estimate replacement. Designers use it to see whether one copy is enough or a pair is required.

**Examples:**

Two failures in 1,000 hours of operation is an MTBF of 500 hours. That does not say the next failure will land at hour 500. It says the long-run average gap is 500 hours.
</details>

<details>
<summary>What is the role of Mean Time to Repair (MTTR) in maintaining system availability?</summary>

### What is the role of Mean Time to Repair (MTTR) in maintaining system availability?

**Definition:**

MTTR is the average time from detecting a failure to restoring service. Availability rises when this interval shrinks, even if failures stay just as frequent.

**How it works:**

- The clock starts at detection, not at the moment someone starts typing a fix. Slow alerts inflate MTTR.
- It includes diagnosis, repair or failover, and the check that the service is actually back.
- Paired with MTBF: availability ≈ MTBF / (MTBF + MTTR).
- Automation, runbooks, and a warm spare cut MTTR more cheaply than making every part immortal.

**Examples:**

A database that fails twice a month (MTBF about 360 hours) with a 4-hour manual restore is near 99% available. The same failures with a 5-minute failover are near 99.98%.
</details>

<details>
<summary>Can you differentiate between high availability (HA) and fault tolerance (FT)?</summary>

### Can you differentiate between high availability (HA) and fault tolerance (FT)?

**Definition:**

High availability minimizes downtime with failover, and a short blip is acceptable. Fault tolerance keeps the service correct through a component failure, with no visible interruption.

**How it works:**

- HA detects a bad node and shifts traffic. Users may see a retry or a few seconds of errors.
- FT runs redundant parts so a failure is masked. The spare is already in step, not waiting to boot.
- Both use extra copies. HA optimizes recovery time. FT optimizes uninterrupted correctness.
- A load balancer pulling a dead web server is HA. A lockstep pair that continues a transaction when one CPU dies is FT.
- Data for HA is often replicated so another node can serve. Data for FT is kept consistent enough that the surviving path does not serve a torn write.

**Examples:**

A web tier drops one machine and the balancer sends the next request elsewhere: high availability. A storage array that finishes the write on the mirror without the client seeing an error: fault tolerance.
</details>

### Designing for Availability

<details>
<summary>How would you architect a system for high availability?</summary>

### How would you architect a system for high availability?

**Definition:**

Architect for high availability by removing single points, detecting failure quickly, and failing over without a human in the path.

**How it works:**

- Put a redundant balancer in front of several app instances, and replicate the database.
- Prefer active-active when both sides can serve, or active-passive when one warm standby is enough.
- Health checks and auto-scaling replace dead or overloaded instances.
- A second site covers a whole data-center loss. Decide what consistency you will give up during the split.
- Cache and a CDN take read load off the origin so a spike does not become an outage.
- Keep data residency rules in mind if a second region is not allowed to hold the data.

**Examples:**

```text
clients -> anycast / DNS
        -> load balancer pair
        -> app instances in two zones
        -> primary database + replica
```
</details>

<details>
<summary>What design patterns are commonly used to improve system availability?</summary>

### What design patterns are commonly used to improve system availability?

**Definition:**

Availability patterns are mostly about spare capacity, fast detection, and not letting one failed dependency stall everyone.

**How it works:**

- Redundancy and failover keep a second instance ready. A load balancer spreads work and skips unhealthy targets.
- A circuit breaker fails fast when a dependency is down, so callers stay up.
- Bulkheads isolate pools so one slow dependency cannot consume every thread.
- Retries with backoff cover a short blip. A queue absorbs a burst the service cannot handle right now.
- Health checks and leader election decide who is allowed to serve.
- A singleton process or an object pool can limit resource use, and they help availability only if losing that one process is not itself an outage.
</details>

<details>
<summary>How can load balancing improve system availability, and what are some of its potential pitfalls?</summary>

### How can load balancing improve system availability, and what are some of its potential pitfalls?

**Definition:**

A load balancer spreads requests across healthy instances so one overloaded or dead server does not take the service down. The balancer itself can become the outage if it is alone.

**How it works:**

- Round-robin cycles through targets. Least-connections prefers the idle one. A hash on client identity keeps a user on the same server.
- Health checks let the balancer stop sending work to a target that fails its probe.
- Sticky sessions help apps that keep state in memory, and they hurt when that one server dies: the session goes with it.
- Adding instances is how you scale, as long as the balancer and the database can take the extra fan-in.
- A single balancer is a single point of failure. Run a pair.
- A layer-7 balancer can route on the URL, and it terminates TLS, so certificate and config mistakes become site-wide.

**Examples:**

```text
request 1 -> app-a
request 2 -> app-b
request 3 -> app-c
app-b fails health -> next requests skip app-b
```
</details>

<details>
<summary>Explain the role of health checks in maintaining an available system.</summary>

### Explain the role of health checks in maintaining an available system.

**Definition:**

A health check is a repeated probe that decides whether an instance should receive traffic. It is how failover happens before users discover the failure.

**How it works:**

- A shallow check hits an HTTP endpoint and looks for a success status. It proves the process is listening.
- A deep check also opens the database, the queue, or a downstream the instance cannot serve without.
- CPU, memory, and disk tell you the machine is alive but too sick to be useful.
- The balancer, orchestrator, or mesh uses the result to pull the instance out and, when it recovers, to put it back.
- A check that always returns success hides the outage. A check that depends on a flaky downstream will flap the whole tier.

**Examples:**

GET /health returns 200 only if the process can run SELECT 1. The balancer drops any instance that fails twice in a row.
</details>

<details>
<summary>What is the purpose of a circuit breaker pattern in a distributed system?</summary>

### What is the purpose of a circuit breaker pattern in a distributed system?

**Definition:**

A circuit breaker protects availability by refusing to wait on a dependency that is already failing. Callers fail fast or use a fallback, and the dependency gets room to recover.

**How it works:**

- Closed: calls pass, and errors are counted.
- Open: calls do not go out. Latency stays low because nobody waits on the timeout.
- Half-open: a trial call checks whether the dependency is back.
- It limits cascading failure. Threads that would have blocked on the dead service stay free for work that can still succeed.
- The user gets a quick degraded answer instead of a hung page.

**Examples:**

Recommendations time out. The product page opens the circuit and renders without that block, instead of holding the response for 30 seconds.
</details>

### Monitoring & Incident Response

<details>
<summary>What are some key indicators you would monitor to ensure system reliability?</summary>

### What are some key indicators you would monitor to ensure system reliability?

**Definition:**

Reliability shows up in how often the system fails, how fast it returns, and whether the data and the machine underneath are still sound.

**How it works:**

- Availability indicators: uptime, MTBF, and MTTR.
- Performance: latency and throughput. A system that is up but too slow has failed its users.
- Errors: failure rate, and whether a fault is contained or spreading.
- Data: backup success, and whether replicas still match.
- Network: loss, latency, and saturation.
- The room and the power: temperature and supply, because a thermal trip looks like a software outage.
- Security controls matter when a breach is the failure mode, but they do not replace the availability signals.

**Examples:**

Alert when error rate exceeds 1% for five minutes, when p99 latency doubles, or when the last successful backup is older than a day.
</details>

<details>
<summary>How do you implement a monitoring system that accurately reflects system availability?</summary>

### How do you implement a monitoring system that accurately reflects system availability?

**Definition:**

Measure availability the way users experience it: a probe that performs a real action, from outside the cluster, and alert on that signal.

**How it works:**

- Synthetic checks from more than one network hit the public endpoint and record success or failure.
- Inside the cluster, health checks, saturation, and error rate explain why the outside probe failed.
- Count downtime from the user’s view. A process that is up while its load balancer has removed it is not available.
- Page on symptoms that mean users cannot complete the job, not on every CPU twitch.
- Keep the history so you can compute the nines for the month instead of guessing from a dashboard screenshot.

**Examples:**

A check every minute logs in and loads the account page from outside the data center. Minutes with a failed check are the downtime you report. Internal CPU graphs explain the cause, they do not define the outage.
</details>

<details>
<summary>Discuss the importance of alerting and on-call rotations in maintaining system reliability.</summary>

### Discuss the importance of alerting and on-call rotations in maintaining system reliability.

**Definition:**

</details>

<details>
<summary>What steps would you take to respond to an incident that reduces system availability?</summary>

### What steps would you take to respond to an incident that reduces system availability?

**Definition:**

</details>

<details>
<summary>How can post-mortem analysis improve future system reliability and availability?</summary>

### How can post-mortem analysis improve future system reliability and availability?

**Definition:**

</details>

### Scaling & Performance

<details>
<summary>How does system scalability impact availability?</summary>

### How does system scalability impact availability?

**Definition:**

</details>

<details>
<summary>What strategies can be employed to scale a system while maintaining or improving reliability?</summary>

### What strategies can be employed to scale a system while maintaining or improving reliability?

**Definition:**

</details>

<details>
<summary>Describe how caching can affect system reliability and what are some trade-offs.</summary>

### Describe how caching can affect system reliability and what are some trade-offs.

**Definition:**

</details>

<details>
<summary>Explain the role of rate limiting in preserving system availability.</summary>

### Explain the role of rate limiting in preserving system availability.

**Definition:**

</details>

### Reliability in Distributed Systems

<details>
<summary>How do eventual consistency and strong consistency differ and what are the reliability implications?</summary>

### How do eventual consistency and strong consistency differ and what are the reliability implications?

**Definition:**

</details>

<details>
<summary>Describe the CAP theorem and its relevance to system availability.</summary>

### Describe the CAP theorem and its relevance to system availability.

**Definition:**

</details>

<details>
<summary>Can you discuss how quorum-based decision making in distributed systems affects reliability?</summary>

### Can you discuss how quorum-based decision making in distributed systems affects reliability?

**Definition:**

</details>

<details>
<summary>What is the role of distributed transactions in reliability, and what are the challenges associated with them?</summary>

### What is the role of distributed transactions in reliability, and what are the challenges associated with them?

**Definition:**

</details>

### Recovery Strategies

<details>
<summary>What is a disaster recovery plan and how does it relate to reliability?</summary>

### What is a disaster recovery plan and how does it relate to reliability?

**Definition:**

</details>

<details>
<summary>How do backup and restore operations impact system availability?</summary>

### How do backup and restore operations impact system availability?

**Definition:**

</details>

<details>
<summary>Discuss the importance and challenges of data replication in a highly available system.</summary>

### Discuss the importance and challenges of data replication in a highly available system.

**Definition:**

</details>

<details>
<summary>Explain how you would plan for a failover strategy in a multi-region deployment to ensure reliability.</summary>

### Explain how you would plan for a failover strategy in a multi-region deployment to ensure reliability.

**Definition:**

</details>
