# Concurrency — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./0_system_design.md)

### Related docs

- [Concurrency — Interview](./0_sd_concurrency_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Concurrency](https://devinterview.io/questions/software-architecture-and-system-design/concurrency-interview-questions/).

### Concurrency Fundamentals

<details>
<summary>What is concurrency in programming and how does it differ from parallelism?</summary>

### What is concurrency in programming and how does it differ from parallelism?

**Definition:**

Concurrency is structuring work so several tasks can be in progress at once, even if the machine runs only one at a time. Parallelism is actually executing more than one task at the same instant.

**How it works:**

- A concurrent program on one core interleaves tasks: the scheduler switches, or the code yields at a blocking call. Progress overlaps in time. Execution does not.
- Parallelism needs hardware that can run those tasks together, usually several cores. The tasks may also be concurrent, but a single parallel split of one job need not deal with independent lifetimes.
- A single-core server handling many sockets is concurrent and not parallel. A matrix multiply spread across cores can be parallel. A thread pool on many cores is both.
- Shared memory then needs a rule so overlapping tasks do not corrupt it: locks, atomic operations, transactional memory, immutable data, or messages that copy the data instead of sharing it.

**Examples:**

```python
# concurrent: two tasks in flight; on one core they take turns
t1 = threading.Thread(target=read_socket)
t2 = threading.Thread(target=read_socket)
t1.start(); t2.start()
```

On a two-core machine those threads can also run in parallel. On one core they still overlap their waits.
</details>

<details>
<summary>Can you explain race conditions and provide an example where one might occur?</summary>

### Can you explain race conditions and provide an example where one might occur?

**Definition:**

A race condition is a bug whose result depends on the timing of tasks that share state. The same inputs can produce different outputs because the steps interleave.

**How it works:**

- It needs shared mutable state and at least one update that is not atomic: a read, a modify, and a write that another task can slip between.
- The window also shows up around I/O and the network, where “check then act” spans more than one instruction.
- A lost update, a double spend of one ticket, or a torn write are typical outcomes.
- Close the window with a lock around the whole read-modify-write, with an atomic instruction, with immutable snapshots, or by giving each task its own copy and merging later.
- Tests that pass once do not prove it is gone. The interleaving has to be forced or the shared update removed.

**Examples:**

Two threads both read `seats == 1`, both decide to sell, both write `seats = 0`. Two buyers get one seat. A mutex around the read and the decrement, or an atomic compare-and-swap from 1 to 0, lets only one sale succeed.
</details>

<details>
<summary>What is a critical section in the context of concurrent programming?</summary>

### What is a critical section in the context of concurrent programming?

**Definition:**

A critical section is the stretch of code that touches shared state and must not run in more than one task at a time.

**How it works:**

- The goal is mutual exclusion: one task inside, others waiting, and a waiting task eventually getting in.
- The shared data stays consistent because the read-modify-write finishes before anyone else starts it.
- The section should be short. A long one serializes the program and can starve other tasks.
- Locks, semaphores, and monitors are the usual way in. Forgetting to leave, or taking two locks in different orders, deadlocks. Two tasks endlessly yielding to each other livelock. A task that always loses the race starves.
- Correctness here is not free performance. Measure hold time. If the section only needs to publish an immutable value, you may not need the lock at all.

**Examples:**

```text
lock(mu)
  balance = balance - amount   # critical section
unlock(mu)
```

Two withdrawals can no longer both read the old balance and both write it back.
</details>

<details>
<summary>How does an operating system ensure mutual exclusion in concurrent processes?</summary>

### How does an operating system ensure mutual exclusion in concurrent processes?

**Definition:**

The kernel gives tasks a way to wait so that only one of them executes a critical section, using hardware atomics underneath.

**How it works:**

- A mutex or a binary semaphore has two states. `lock` waits if it is taken and then marks it taken. `unlock` wakes one waiter.
- The CPU provides an atomic test-and-set or compare-and-swap so two cores cannot both observe the lock as free and both take it.
- If the lock is busy, the kernel parks the thread instead of spinning forever, and a scheduler runs someone else.
- Disabling interrupts can exclude other code on a single core. It does not stop another core, so multiprocessor kernels use atomics.
- Higher-level tools sit on the same idea: futexes in Linux, critical sections in Windows, and language locks that call them.
- The OS does not know your data invariant. It only guarantees the lock protocol. The program still has to lock every path that touches the data, in a consistent order.

**Examples:**

```cpp
std::mutex mu;
void withdraw(int amount) {
  std::lock_guard<std::mutex> hold(mu);
  balance -= amount;
}
```

`lock_guard` locks on construction and unlocks on destruction, including when the function throws.
</details>

<details>
<summary>Can you describe the concept of atomicity in relation to concurrency?</summary>

### Can you describe the concept of atomicity in relation to concurrency?

**Definition:**

An atomic operation finishes as a whole or not at all, as far as other tasks can see. Nobody observes a half-updated value.

**How it works:**

- A machine word store is often atomic in hardware. A read-modify-write of a balance is not, unless you use an atomic instruction or a lock.
- Atomics cover counters, flags, and compare-and-swap loops that publish a new pointer only when the old one is still current.
- A non-atomic update can tear: another task reads a mix of old and new bytes, or loses its own update.
- Atomicity of one instruction is not the same as a transaction. Several atomic steps can still interleave unless you group them.
- Isolation and durability are separate. An atomic memory write can still sit in a cache and be lost on power failure. A database commit is a stronger promise.
- Hardware memory models decide when other cores see the write. A language atomic also inserts the needed ordering. A plain store may not.

**Examples:**

`count++` on a shared `int` can lose increments: both cores read 7 and both write 8. `std::atomic<int>::fetch_add(1)` makes the increment one step, so two callers end at 9.
</details>

<details>
<summary>How does a deadlock occur and what are common strategies to prevent it?</summary>

### How does a deadlock occur and what are common strategies to prevent it?

**Definition:**

A deadlock is a set of tasks that each hold a resource the others need and will not let go. None of them can run.

**How it works:**

- It takes four conditions together: exclusive use, hold-and-wait, no preemption, and a cycle of waits.
- Classic shape: thread A holds lock 1 and wants lock 2, thread B holds lock 2 and wants lock 1.
- Break the cycle by always acquiring locks in one global order.
- Break hold-and-wait with `try_lock`: if the second lock is busy, drop the first and retry, ideally with a backoff so both sides do not spin in step.
- Timeouts turn a stuck wait into an error the caller can undo.
- A detector can build the wait graph and abort one task. Prevention is simpler when you control the lock order.
- Avoid calling out to unknown code while holding a lock. That code may take another lock you did not account for.

**Examples:**

```text
# deadlocks if the other thread takes b then a
lock(a); lock(b); transfer(); unlock(b); unlock(a)

# both threads sort the addresses and lock the lower one first
```

If every transfer locks the two accounts in address order, the cycle cannot form.
</details>

<details>
<summary>What is a livelock and how is it different from a deadlock?</summary>

### What is a livelock and how is it different from a deadlock?

**Definition:**

In a livelock the tasks are not stuck waiting. They keep reacting to each other and still make no progress. A deadlock is the opposite: everyone is waiting and nobody runs.

**How it works:**

- Deadlock: threads sleep on locks and will never wake, because each wakeup depends on someone in the set.
- Livelock: threads run, drop what they hold, and try again, forever, often in lockstep.
- It shows up with polite retry. Two tasks both see a collision, both back off the same way, both collide again.
- CPU use stays high, which is how you tell it from a deadlock in a trace. A deadlock looks idle.
- Break the symmetry with random backoff, a queue, or a rule that one side proceeds and the other waits.

**Examples:**

Two people in a narrow hall each step left, still face each other, each step left again. They are moving and never pass. One person standing still while the other passes is the fix. In code, two threads that `try_lock`, fail, unlock, and retry with the same timing do the same thing. A random sleep between retries lets one of them win.
</details>

<details>
<summary>Can you explain the producer-consumer problem and how can it be addressed using concurrency mechanisms?</summary>

### Can you explain the producer-consumer problem and how can it be addressed using concurrency mechanisms?

**Definition:**

Producers put items into a shared buffer. Consumers take them out. The buffer must not overflow, underflow, or be updated by two tasks at once.

**How it works:**

- The buffer has a fixed capacity. A producer waits when it is full. A consumer waits when it is empty.
- A mutex guards the slots so two producers cannot write the same index.
- Two signals cover the waits: one counts empty slots, one counts filled slots. A condition variable pair does the same job: wait, change the buffer, notify.
- The lock is not held while the producer builds the item or the consumer uses it. It is held only around the slot update.
- A poison pill or a closed flag lets consumers exit when production is finished.
- This is the pattern behind thread-pool queues and log pipelines.

**Examples:**

```text
empty = capacity; filled = 0; mutex = free
produce: wait empty; lock; push; unlock; signal filled
consume: wait filled; lock; pop; unlock; signal empty
```

With capacity 1, the consumer cannot pop before a push, and the producer cannot push twice without a pop.
</details>

### Thread Management

<details>
<summary>What is the difference between a process and a thread?</summary>

### What is the difference between a process and a thread?

**Definition:**

A process is an isolated execution with its own address space. A thread is a schedulable flow of control inside a process, sharing that address space with its sibling threads.

**How it works:**

- Each process has its own virtual memory, file-descriptor table, and at least one thread. One process cannot read another’s heap unless they set up shared memory on purpose.
- Threads in one process share code, heap, and open files. Each has its own stack, registers, and program counter.
- Creating a process is heavier: the kernel copies or marks the address space. Creating a thread mostly adds a stack and a scheduler entry.
- A fault in a thread can take down the whole process, because the memory is shared. A fault in a process stays inside it.
- Context switches between processes flush more state (address space) than switches between threads of one process.
- Use processes to isolate failures and privileges. Use threads to share data and overlap work cheaply, and then you must synchronize that share.

**Examples:**

A browser uses a process per site so one crash does not read another site’s memory. Inside the renderer, threads share the DOM and must lock it. `fork` gives the child a separate address space. `pthread_create` does not.
</details>

<details>
<summary>How are threads typically created and managed in modern operating systems?</summary>

### How are threads typically created and managed in modern operating systems?

**Definition:**

A thread starts as a kernel object the scheduler can run, block, and destroy. Libraries differ in how many of those kernel threads sit under the threads the program sees.

**How it works:**

- Many-to-one: several user-level “green” threads share one kernel thread. Switching is cheap, but one blocking call stalls all of them, and they cannot use extra cores.
- One-to-one: each program thread is a kernel thread. This is the usual model (POSIX threads on Linux via NPTL, Windows threads). They run truly in parallel and block independently. The cost is a kernel scheduling entry per thread.
- Many-to-many: a set of user threads is multiplexed onto a smaller set of kernel threads. It tries to keep both cheap switching and parallelism. It is harder to build, so fewer systems use it as the default.
- The kernel saves registers and a stack pointer, chooses a ready thread, and resumes it. Libraries such as pthreads expose create, join, and detach on top.
- Detach means nobody will `join` it. Join waits for it to finish and collects its result. A thread that is neither joined nor detached leaks the control block.

**Examples:**

```c
pthread_t t;
pthread_create(&t, NULL, worker, arg);
pthread_join(t, NULL);
```

`pthread_create` asks the kernel for a thread that runs `worker`. `pthread_join` blocks until that thread returns.
</details>

<details>
<summary>What is a thread pool and why might you use one?</summary>

### What is a thread pool and why might you use one?

**Definition:**

A thread pool is a fixed set of worker threads that pull tasks from a queue. You reuse the threads instead of creating one per task.

**How it works:**

- Creating a thread allocates a stack and talks to the kernel. Doing that for every short request costs more than the work.
- The pool caps how many tasks run at once, so a burst cannot start tens of thousands of threads and exhaust memory.
- Callers submit a closure or a job. A free worker takes it. If all workers are busy, the job waits in the queue.
- The same pool serves request handlers, batch chunks, and background jobs.
- Too small a pool queues latency. Too large a pool spends the machine on context switches. Size it around the cores for CPU work, and higher for work that mostly waits on I/O.
- Shut the pool down by closing the queue and joining the workers, so tasks are not abandoned in the middle.

**Examples:**

```python
with ThreadPoolExecutor(max_workers=4) as pool:
    pool.map(resize_image, paths)
```

Four threads resize the whole list. The program does not start one thread per file.
</details>

<details>
<summary>Can you explain the concept of a context switch and how it affects concurrency?</summary>

### Can you explain the concept of a context switch and how it affects concurrency?

**Definition:**

A context switch is the kernel saving one thread’s CPU state and restoring another’s so the core can run the second thread.

**How it works:**

- The saved state is registers, the stack pointer, and the program counter, plus whatever the kernel needs to resume the address space.
- The scheduler does this when a thread blocks, when its time slice ends, or when a higher-priority thread becomes ready.
- Switching threads of one process is cheaper than switching processes, because the page tables can stay.
- It is still not free: caches and the TLB hold the previous thread’s lines, pipelines drain, and the kernel runs.
- Too many runnable threads make the core spend more time switching than working. That is why a pool bounds concurrency.
- Voluntary switches at a blocking I/O call are useful: the core runs someone else during the wait. Involuntary switches in a tight CPU loop are pure overhead.

**Examples:**

A thread calls `read` on an empty socket. The kernel saves its registers, marks it waiting, and runs another thread on that core. When the packet arrives, the waiting thread is marked ready and will be switched back in.
</details>

<details>
<summary>What are the benefits and disadvantages of using many small threads vs. a few large threads?</summary>

### What are the benefits and disadvantages of using many small threads vs. a few large threads?

**Definition:**

Many short-lived threads match many small tasks. Fewer long-lived threads match heavy work and a pool. The trade-off is overhead versus idle time.

**How it works:**

- Many small threads can keep a core busy while others wait on I/O, and they isolate a slow task to one thread. Creating and switching them costs stack memory and scheduler time, and shared-data bugs multiply.
- A few large threads waste less on switching and are easier to reason about. A blocking call in one of them stalls a bigger share of the program, and a burst of small tasks queues behind the long ones.
- CPU-bound work rarely benefits from more threads than cores. I/O-bound work often does, up to the point where memory and switches dominate.
- Prefer a pool of long-lived workers and a queue of small tasks. You get the small units of work without a thread per unit.
- Unbounded `thread-per-request` falls over when traffic spikes. A fixed pool pushes the spike into a queue you can shed.

**Examples:**

Resizing 10_000 photos with one thread per photo can allocate gigabytes of stacks before any image finishes. Eight pooled workers and a queue of paths use eight stacks and finish the same list.
</details>

### Synchronization Mechanisms

<details>
<summary>What is a mutex and how does it work?</summary>

### What is a mutex and how does it work?

**Definition:**

A mutex (mutual exclusion lock) lets only one thread hold it. The holder is the only thread that may run the section the mutex guards.

**How it works:**

- `lock` returns at once if the mutex is free, and otherwise blocks until the holder unlocks.
- `unlock` must be done by the owner. A normal mutex is not a counter anyone may signal.
- `try_lock` returns immediately if it cannot acquire. A timed lock waits only until a deadline.
- A reentrant (recursive) mutex lets the owner lock again without deadlocking itself. A plain mutex deadlocks if the owner locks twice.
- Pitfalls: locking A then B in one thread and B then A in another deadlocks. A low-priority holder can block a high-priority waiter (priority inversion) unless the protocol boosts the holder. Under contention, threads spend time waiting instead of working.
- Keep the hold short and unlock on every path, including exceptions. RAII wrappers do that.

**Examples:**

```python
with lock:          # lock on enter, unlock on exit
    inventory[sku] -= 1
```

A second thread stops at `with lock` until the first block finishes.
</details>

<details>
<summary>What are semaphores and how do they differ from mutexes?</summary>

### What are semaphores and how do they differ from mutexes?

**Definition:**

A semaphore is a counter that tasks wait on and signal. A mutex is a lock with an owner, meant for one thread in a critical section.

**How it works:**

- A mutex is binary and owned. The thread that locked it is the one that must unlock it. It guards code and data.
- A semaphore starts at N. `wait` (P) decrements and blocks if the count would go negative. `signal` (V) increments and wakes a waiter. There is no owner: one task can signal what another waited on.
- A binary semaphore looks like a mutex but still has no ownership and is not tied to “this thread may enter.”
- Use a mutex for exclusive access to a structure. Use a counting semaphore for a pool of N identical resources, or for the empty and full counts in a producer-consumer buffer.
- Semaphores do not by themselves remember which thread is inside. They also do not prevent priority inversion the way some mutex protocols do.
- Combining them is normal: a mutex protects the buffer indexes, and two semaphores track empty and filled slots.

**Examples:**

```text
licenses = Semaphore(3)   # three seats
licenses.wait()           # take one; block if zero
use_tool()
licenses.signal()         # return it; any thread may do this
```

A mutex would be wrong here: the thread that releases the seat may not be the one that took it, and three users may hold a seat at once.
</details>

<details>
<summary>Can you explain what a monitor is in the context of concurrency?</summary>

### Can you explain what a monitor is in the context of concurrency?

**Definition:**

</details>

<details>
<summary>How do condition variables contribute to thread synchronization?</summary>

### How do condition variables contribute to thread synchronization?

**Definition:**

</details>

<details>
<summary>What is a read-write lock and when is it advantageous to use one?</summary>

### What is a read-write lock and when is it advantageous to use one?

**Definition:**

</details>

### Concurrency Patterns

<details>
<summary>Can you describe the fork/join parallelism pattern and its use cases?</summary>

### Can you describe the fork/join parallelism pattern and its use cases?

**Definition:**

</details>

<details>
<summary>What is a barrier and how is it used in concurrent programming?</summary>

### What is a barrier and how is it used in concurrent programming?

**Definition:**

</details>

<details>
<summary>Describe an instance where a message queue might be used in a concurrent system.</summary>

### Describe an instance where a message queue might be used in a concurrent system.

**Definition:**

</details>

<details>
<summary>How might event-driven programming help in handling concurrency?</summary>

### How might event-driven programming help in handling concurrency?

**Definition:**

</details>

<details>
<summary>Can you illustrate usage of the publish-subscribe pattern in a concurrent system?</summary>

### Can you illustrate usage of the publish-subscribe pattern in a concurrent system?

**Definition:**

</details>

### Concurrency in Practice

<details>
<summary>How does one typically handle exceptions in a concurrently executing thread?</summary>

### How does one typically handle exceptions in a concurrently executing thread?

**Definition:**

</details>

<details>
<summary>What is the advantage of using non-blocking algorithms in a multi-threaded application?</summary>

### What is the advantage of using non-blocking algorithms in a multi-threaded application?

**Definition:**

</details>

<details>
<summary>Can you describe a scenario where you would use atomic operations?</summary>

### Can you describe a scenario where you would use atomic operations?

**Definition:**

</details>

<details>
<summary>How would you go about debugging a concurrency issue like a deadlock in a system?</summary>

### How would you go about debugging a concurrency issue like a deadlock in a system?

**Definition:**

</details>

<details>
<summary>What measures would you take to ensure thread-safety in a method that mutates shared data?</summary>

### What measures would you take to ensure thread-safety in a method that mutates shared data?

**Definition:**

</details>

### Performance and Scalability

<details>
<summary>How can the use of concurrency affect the scalability of an application?</summary>

### How can the use of concurrency affect the scalability of an application?

**Definition:**

</details>

<details>
<summary>What approaches can be taken to balance load effectively between threads?</summary>

### What approaches can be taken to balance load effectively between threads?

**Definition:**

</details>

<details>
<summary>Can you discuss strategies to reduce contention for shared resources in a concurrent program?</summary>

### Can you discuss strategies to reduce contention for shared resources in a concurrent program?

**Definition:**

</details>

<details>
<summary>How does the concept of concurrency relate to application throughput and latency?</summary>

### How does the concept of concurrency relate to application throughput and latency?

**Definition:**

</details>

### Advanced Topics

<details>
<summary>What is software transactional memory (STM) and how can it be used to manage concurrency?</summary>

### What is software transactional memory (STM) and how can it be used to manage concurrency?

**Definition:**

</details>

<details>
<summary>Explain the role of lock-free and wait-free algorithms in concurrent programming.</summary>

### Explain the role of lock-free and wait-free algorithms in concurrent programming.

**Definition:**

</details>

<details>
<summary>How does the actor model address concurrency, and what are its benefits?</summary>

### How does the actor model address concurrency, and what are its benefits?

**Definition:**

</details>

<details>
<summary>What are some challenges in testing concurrent applications, and how can they be mitigated?</summary>

### What are some challenges in testing concurrent applications, and how can they be mitigated?

**Definition:**

</details>

### Hardware and Concurrency

<details>
<summary>How does the hardware architecture of a CPU relate to the way concurrency is implemented in software?</summary>

### How does the hardware architecture of a CPU relate to the way concurrency is implemented in software?

**Definition:**

</details>

<details>
<summary>Can you explain the role of cache coherency in multi-processor or multi-core systems in the context of concurrency?</summary>

### Can you explain the role of cache coherency in multi-processor or multi-core systems in the context of concurrency?

**Definition:**

</details>

<details>
<summary>What are the potential impacts of hardware-level parallelism on software concurrency models?</summary>

### What are the potential impacts of hardware-level parallelism on software concurrency models?

**Definition:**

</details>

### Modern Trends and Best Practices

<details>
<summary>In the context of modern multi-core processors, how have high-level concurrency abstractions evolved to simplify concurrent programming?</summary>

### In the context of modern multi-core processors, how have high-level concurrency abstractions evolved to simplify concurrent programming?

**Definition:**

</details>
