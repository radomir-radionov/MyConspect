# Node.js — Interview

Interview Q&A for Node.js.

[← Back to hub](./8_nodejs.md)

### Related docs

* [Node.js — Runtime](./8_nodejs_core.md) · [Node.js — HTTP](./8_nodejs_http.md) · [Node.js — Process](./8_nodejs_process.md) · [Node.js — Interview](./8_nodejs_interview.md)

### Sections

- [Questions & Answers](#questions-answers)

---

## Questions & Answers

<details>
  <summary>What is REPL?</summary>

### What is REPL?

**Definition:** Read-Eval-Print-Loop — interactive Node shell (`node` without a file). Evaluates JS expressions immediately.

**Examples:**

```bash
$ node
> 2 + 2
4
> const fs = require('fs')
```

Useful for quick experiments and debugging snippets.

</details>

<details>
  <summary>What is a file vs a file system?</summary>

### What is a file vs a file system?

**Definition:** A **file** is a named byte sequence plus attributes (permissions, owner, size, timestamps, read/write cursor). A **file system** maps that abstraction onto disks so programs do not care about hardware, and unique **paths** avoid name collisions.

**How it works:** Hierarchical trees (root, directories, files as leaves) won over flat namespaces. Unix treats devices and dirs as files; open → read/write → close, with kernel **file descriptors**. Full notes: [Files & file systems](./8_nodejs_core.md#files--file-systems).

</details>

<details>
  <summary>What are streams in Node.js?</summary>

### What are streams in Node.js?

**Definition:** Interfaces for reading/writing data in chunks — `Readable`, `Writable`, `Duplex`, `Transform`. Handle large files without loading all into memory.

**How it works:** pause readable when writable buffer is full.

**Examples:**

```js
createReadStream('./large.bin').pipe(res);
```

</details>

<details>
  <summary>What is middleware?</summary>

### What is middleware?

**Definition:** Functions `(req, res, next) => {}` in the Express pipeline executed in registration order.

**How it works:** Call `next()` to pass control; call `next(err)` for errors; send response (`res.json`) to end chain. Error middleware has 4 args `(err, req, res, next)`.

**When to use:** Logging, `express.json()`, auth (`req.user`), validation, 404, central error handler (last).

**Sources:** [expressjs.com middleware](https://expressjs.com/en/guide/using-middleware.html)

</details>

<details>
  <summary>setImmediate vs setTimeout vs process.nextTick?</summary>

### setImmediate vs setTimeout vs process.nextTick?

**Definition:** Node schedules async callbacks in different queues/phases. Order matters for performance and correctness.

**How it works:**

1. Execute synchronous code.
2. Drain **`process.nextTick`** queue (all of it — can starve I/O).
3. Drain **microtasks** (`Promise.then`, `queueMicrotask`).
4. Event loop phase (timers → pending → idle → **poll** → **check** → close).
5. **`setImmediate`** runs in the **check** phase (after poll I/O).
6. **`setTimeout(fn, 0)`** runs in **timers** phase (next loop iteration if I/O pending).

| API | Queue / phase | When |
|-----|---------------|------|
| `process.nextTick` | nextTick queue | Before microtasks and I/O |
| `Promise.then` | microtask | After nextTick, before next macrotask |
| `setImmediate` | check phase | After I/O callbacks in poll |
| `setTimeout(0)` | timers phase | After minimum delay (≥1ms) |

**When to use:** Use `setImmediate` to defer work after I/O; avoid recursive `nextTick`. Prefer `queueMicrotask` over `nextTick` for promise-like deferral in new code.

**Pluses and minuses:**

| + | − |
|------|------|
| `setImmediate` defers without blocking I/O | Mental model is complex |
| `nextTick` runs before continuation | Infinite `nextTick` starves the loop |

**Examples:**

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
setImmediate(() => console.log('3'));
Promise.resolve().then(() => console.log('4'));
process.nextTick(() => console.log('5'));
console.log('6');
// 1, 6, 5, 4, 2, 3 (2 vs 3 order can vary at top level)
```

**Sources:** [nodejs.org event loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick)

</details>

<details>
  <summary>ESM vs CommonJS?</summary>

### ESM vs CommonJS?

See **Modules → ESM vs CommonJS (deep dive)**.

**Short answer:** CJS = `require`/`module.exports`, synchronous. ESM = `import`/`export`, static, `"type": "module"` or `.mjs`. ESM is the standard for new Node and browser code; use `import.meta.url` for `__dirname`.

**Sources:** [nodejs.org ESM](https://nodejs.org/api/esm.html)

</details>

<details>
  <summary>What are worker_threads?</summary>

### What are worker_threads?

**Definition:** Parallel JavaScript threads in one process for **CPU-bound** work — separate V8 isolate, `postMessage` IPC, optional `SharedArrayBuffer`.

**When to use:** Image processing, crypto, heavy computation — not for I/O (event loop already handles that). Use a worker pool, not one worker per request.

**Sources:** [nodejs.org worker_threads](https://nodejs.org/api/worker_threads.html)

</details>

<details>
  <summary>Graceful shutdown — SIGTERM?</summary>

### Graceful shutdown — SIGTERM?

**Definition:** On deploy/stop, catch **SIGTERM** → `server.close()` → finish in-flight requests → close DB pool → exit.

**When to use:** Kubernetes sends SIGTERM before SIGKILL (~30s grace). Fail health checks when draining so traffic moves to new pods.

**Sources:** [nodejs.org process signals](https://nodejs.org/api/process.html#signal-events)

</details>

<details>
  <summary>Why is Node.js single-threaded?</summary>

### Why is Node.js single-threaded?

**Definition:** JavaScript runs on one thread; libuv thread pool handles blocking I/O (fs, crypto). CPU-bound work blocks the event loop.

**How it works:** `worker_threads`, child processes, or offload to a queue/worker service.

</details>

<details>
  <summary>fork() vs spawn()?</summary>

### fork() vs spawn()?

Both from `child_process`.

| Method | Purpose |
|--------|---------|
| `spawn` | generic process with streaming stdio |
| `fork` | spawn Node module with IPC (`process.send`) |

Use `fork` for cluster workers and inter-process messaging.

</details>

<details>
  <summary>JWT and bcrypt?</summary>

### JWT and bcrypt?

| Tool | Role |
|------|------|
| **JWT** | Signed token (`header.payload.signature`) for stateless auth; verify signature + `exp` server-side; short TTL + refresh for revocation |
| **bcrypt** | Slow adaptive hash for passwords; `bcrypt.hash(plain, rounds)` store hash; `bcrypt.compare(plain, hash)` — never store or log plain passwords |

**How it works:** Login → `bcrypt.compare` → issue JWT with `sub`, `role`, `exp`. Middleware `jwt.verify` on protected routes.

**When to use:** bcrypt rounds 10–12; JWT secret in env; HttpOnly cookie or `Authorization: Bearer` header.

**Sources:** [jwt.io](https://jwt.io/) · [npm bcrypt](https://www.npmjs.com/package/bcrypt)

</details>

<details>
  <summary>What is Node.js? What is libuv?</summary>

### What is Node.js? What is libuv?

**Definition:** Node.js is a server-side JavaScript runtime built on **V8** (executes JS) and **libuv** (async platform layer).

**How it works:**

- **Event loop** — schedules timers, I/O callbacks, `setImmediate`, close handlers.
- **Thread pool** (default 4) — blocking work: file system, DNS, crypto (`UV_THREADPOOL_SIZE` to tune).
- **Network I/O** — `epoll` / `kqueue` / IOCP — one thread handles many connections.

*"JS runs on one thread; libuv handles async I/O and offloads blocking ops to a thread pool."*

**Sources:** [nodejs.org — About](https://nodejs.org/en/about) · [libuv docs](http://docs.libuv.org/en/v1.x/)

</details>

<details>
  <summary>How does the event loop work?</summary>

### How does the event loop work?

**Definition:** Mechanism that runs JS callbacks when async operations complete.

**How it works:**

timers → pending → idle/prepare → **poll** (I/O) → check (`setImmediate`) → close.

drain `process.nextTick`, then microtasks (`Promise.then`).

| Queue | Examples |
|-------|----------|
| `nextTick` | Runs before other microtasks — can starve I/O if recursive |
| Microtasks | `Promise.then`, `queueMicrotask` |
| Macrotasks | `setTimeout`, I/O callbacks, `setImmediate` |

**When to use:**

#### Pitfall

Long synchronous loop on main thread blocks all clients — offload CPU to `worker_threads`.

**Sources:** [nodejs.org — Event loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick)

</details>

<details>
  <summary>cluster vs worker_threads?</summary>

### cluster vs worker_threads?

| | **cluster** | **worker_threads** |
|---|-------------|-------------------|
| Unit | Separate **process** (own V8) | **Thread** in same process |
| Use case | Scale HTTP server across CPU cores | CPU-bound JS (hash, parse, image) |
| Communication | IPC (`process.send`) | `postMessage`, `SharedArrayBuffer` |
| Crash isolation | Worker crash ≠ always kill all | Worker error can affect process |

**Rule:** cluster for multi-core HTTP; worker_threads for parallel computation — not one worker per request.

**Sources:** [nodejs.org cluster](https://nodejs.org/api/cluster.html) · [worker_threads](https://nodejs.org/api/worker_threads.html)

</details>

<details>
  <summary>NestJS — full request path and decorators?</summary>

### NestJS — full request path and decorators?

**Path:** Middleware → Guards → Interceptors (pre) → Pipes → Controller → Service → Interceptors (post) → Exception filters (on error).

**Key decorators:**

- `@Module`, `@Controller`, `@Injectable` — structure + DI
- `@Get` / `@Post`, `@Body`, `@Param` — routing
- `@UseGuards` — auth/roles (`CanActivate`)
- `@UsePipes(ValidationPipe)` — DTO validation
- `@UseInterceptors` — logging, response mapping
- `@Catch()` — exception filters

Guards run global → controller → route; order within `@UseGuards(A, B)` is left to right.

**Sources:** [NestJS — Request lifecycle](https://docs.nestjs.com/faq/request-lifecycle)

</details>

<details>
  <summary>NestJS vs Express vs Fastify?</summary>

### NestJS vs Express vs Fastify?

Express/Fastify = HTTP layer. Nest = framework (modules, DI, guards, pipes) on top of either adapter.

**Pick Nest** for team consistency, testing, microservices. **Pick Express** for minimal APIs. **Pick Fastify** for raw speed + schema validation. Nest + Fastify adapter combines structure with throughput.

**Sources:** [NestJS — First steps](https://docs.nestjs.com/first-steps)

</details>

<details>
  <summary>Node.js vs Go vs Elixir?</summary>

### Node.js vs Go vs Elixir?

**Node** — I/O APIs, fullstack TS, npm, event loop. **Go** — goroutines, static binaries, CPU+I/O services. **Elixir** — actors, fault tolerance, real-time (Phoenix Channels).

Choose Node for typical web backends with JS team; Go for performance-critical workers; Elixir for always-on real-time systems.

See [Choosing a backend runtime](./8_nodejs_http.md#runtime-choice).

</details>

---

### Tasks

### Task 1 — Fix async route error

```js
router.post('/users', async (req, res) => {
  const user = await db.createUser(req.body);
  res.json(user);
});
```

What's missing?

<details><summary>Answer</summary>

`try/catch` or `express-async-errors` — unhandled rejection crashes the process or hangs without a response.

</details>

### Task 2 — Readable stream pipe

Pipe large file to HTTP response with backpressure.

<details><summary>Solution</summary>

```js
import { createReadStream } from 'fs';
app.get('/file', (req, res) => {
  createReadStream('./large.bin').pipe(res);
});
```

</details>

---

<details>
  <summary>Junior — Back-end</summary>

### Junior — Back-end

117. What is REPL?

118. What are streams in Node.js?

119. What is middleware?

120. What is `setImmediate` used for?

121. What is `app.param()` in Express?

122. What is token-based authentication?

</details>

<details>
  <summary>Middle — Back-end</summary>

### Middle — Back-end

117. Why is Node.js single-threaded, not multi-threaded?

118. What is event-driven development?

119. Compare `fork()` and `spawn()`.

120. Which Node.js frameworks have you used? What are the differences?

121. Describe an endpoint that saves a 4 GB file from the client to S3 or another CDN.

122. What are microservices and why use them?

123. When would you choose a monolith vs microservices?

124. How do you know an application is healthy right now?

125. How do you know an application was healthy over the last three days?

126. How does bcrypt verify a password?

127. What is JWT?

128. Junior submitted this code for review. What's wrong? How to fix?

```js
router.post('/users', async (req, res, next) => {
  const user = await db.createUser(req);
  if (user) {
    return res.json(users);
  }
  res.json({ error: 'can not create user' });
});
```

</details>

<details>
  <summary>Back-end</summary>

### Back-end

25. Compare CommonJS, AMD Modules, and ES6 Imports.

26. Which backend framework would you choose and why?

27. Describe how OAuth v2 works in your own words.

28. A project has memory leaks — how do you find, fix, and prevent them?

29. A project has performance issues — how do you find, fix, and prevent them?

</details>

<details>
  <summary>General</summary>

### General

7. What is the V8 Engine?

</details>

</details>


