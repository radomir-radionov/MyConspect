# Node.js — Core

V8, event loop, streams, buffers, and runtime fundamentals.

[← Back to hub](./8_nodejs.md)

### Related docs

* [Node.js — Core](./8_nodejs_core.md) · [Node.js — Modules](./8_nodejs_modules.md) · [Node.js — HTTP](./8_nodejs_http.md) · [Node.js — Additional](./8_nodejs_process.md) · [Node.js — Interview](./8_nodejs_interview.md)

### Sections

- [Node runtime & core](#node-runtime-core)
- [Streams, buffers & I/O](#streams-buffers-io)

Packages, CJS/ESM, and built-ins → [Node.js — Modules](./8_nodejs_modules.md).

---

## Node runtime & core

<details>
  <summary>Node.js overview</summary>

### Node.js overview

**Definition:** Node.js is a free, open-source, cross-platform server-side runtime that lets developers build scalable applications with JavaScript.

**How it works:**

| Feature | Description |
|---------|-------------|
| File I/O | read/write files on disk |
| Networking | HTTP servers, TCP/UDP sockets |
| DB | connect via drivers (see [9_database.md](./9_database.md)) |
| Code sharing | reuse JS between frontend and backend |
| Packages | npm registry with millions of modules |

V8 (JS engine) + libuv (async I/O, thread pool) + Node bindings.

| Global | Purpose |
|--------|---------|
| `__dirname` | directory path of current module |
| `__filename` | full path of current module file |
| `process.argv` | CLI arguments array |
| `process.env` | environment variables |

**Examples:**

```js
console.log(__dirname);
console.log(process.argv.slice(2)); // user args after node script.js
```

**Sources:** [nodejs.org](https://nodejs.org/en/about)

</details>

<details>
  <summary>Event loop</summary>

### Event loop

**Definition:** The event loop is Node's mechanism for scheduling async work. libuv's demultiplexer queues tasks; the loop processes macro- and micro-tasks and returns results to your application.

**How it works:**

| Phase | What runs |
|-------|-----------|
| timers | `setTimeout`, `setInterval` callbacks due |
| pending | Internal I/O callbacks |
| idle, prepare | Internal |
| poll | Retrieve new I/O events; execute I/O callbacks |
| check | `setImmediate` callbacks |
| close | `close` event callbacks |

Between phases: drain `process.nextTick` queue, then microtasks (`Promise.then`).

| Type | Examples |
|------|----------|
| Macro tasks | `setTimeout`, `setInterval`, I/O callbacks |
| Micro tasks | `Promise.then`, `queueMicrotask` |
| `nextTick` | `process.nextTick` — runs before other microtasks |

App sends async task → demultiplexer → event queue → loop executes → callback runs in app.

**When to use:** Never use `fs.readFileSync` on request path in production. Offload CPU to `worker_threads`.

**Pluses and minuses:**

| + | − |
|------|------|
| Handles thousands of concurrent I/O connections | CPU work blocks all callbacks |
| Single-threaded JS avoids locks | One slow sync loop stalls everything |

**Examples:**

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
process.nextTick(() => console.log('4'));
console.log('5');
// 1, 5, 4, 3, 2
```

**Sources:** [nodejs.org event loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick)

</details>

<details>
  <summary>Global object</summary>

### Global object

**Definition:**

In Node.js, the global object (`global`) is the top-level namespace — similar to `window` in browsers. Built-ins and user-defined top-level bindings are accessible across modules.

| Property | Purpose |
|----------|---------|
| `console` | logging and debugging |
| `process` | process info, env, exit |
| `Buffer` | binary data |
| `setTimeout` / `setInterval` | timers |
| `__dirname` / `__filename` | module paths (CommonJS) |

**Examples:**

```js
console.log(process.pid);
console.log(process.env.NODE_ENV);
```

**Thoughts:** Avoid polluting `global`; prefer explicit `require`/`import` and module exports.

**Sources:** [nodejs.org globals](https://nodejs.org/api/globals.html)

</details>

<details>
  <summary>Core terminology</summary>

### Core terminology

**Definition:**

Key concepts for understanding how Node.js applications are structured and run.

| Term | Definition |
|------|------------|
| Process | running instance of a program with its own memory and resources |
| Thread | unit of execution within a process |
| Module | self-contained unit of code with exports |
| Barrel file | re-exports multiple modules from one index file |
| Caching | storing frequently accessed data in memory |
| Dependencies | external packages required at runtime |
| DevDependencies | packages needed only during development |
| Dependency Injection | dependencies provided from outside, not created inside |
| Environment variables | OS-level config via `process.env` |
| `.env` file | local env vars (never commit secrets) |
| `nodemon` | dev tool that restarts Node on file changes |

**How it works:** `process.env` is a Node global; the `dotenv` package loads `.env` files into it at startup.

**Sources:** [nodejs.org process](https://nodejs.org/api/process.html#processenv)

</details>

<details>
  <summary>Single-threaded vs multi-threaded</summary>

### Single-threaded vs multi-threaded

**Definition:**

Node.js runs JavaScript on **one main thread**, but libuv uses a thread pool for blocking I/O (fs, crypto, DNS). For parallelism use cluster, child processes, or worker threads.

| Approach | Use case |
|----------|----------|
| Main thread + event loop | I/O-bound servers |
| `worker_threads` | CPU-bound JS in same process |
| `child_process` / `cluster` | separate processes, fault isolation |
| Multiple servers / Docker | horizontal scaling |

**How it works:** Node is single-threaded for JS execution; multi-threaded for I/O via libuv.

**Sources:** [nodejs.org worker_threads](https://nodejs.org/api/worker_threads.html) · [nodejs.org cluster](https://nodejs.org/api/cluster.html)

</details>

<details>
  <summary>worker_threads</summary>

### worker_threads

**Definition:** `worker_threads` runs JavaScript in parallel threads within the same process — separate V8 isolates with optional `SharedArrayBuffer` for shared memory.

**How it works:**

1. Main thread creates `new Worker('./worker.js', { workerData })`.
2. Worker runs its own event loop and JS context.
3. Communicate via `postMessage` / `on('message')` (structured clone) or `SharedArrayBuffer`.
4. Worker exits when script completes or `worker.terminate()` is called.

| vs cluster/child_process | worker_threads | cluster |
|--------------------------|----------------|---------|
| Memory | Shared process (optional shared memory) | Separate processes |
| Startup | Lighter | Heavier (new V8) |
| Fault isolation | Worker crash can take process | Process isolation |
| Use case | CPU-bound JS (hash, image) | HTTP workers per CPU |

**When to use:** Password hashing batches, image resize, PDF parsing, heavy JSON transform — not for simple I/O (event loop handles that).

**Pluses and minuses:**

| + | − |
|------|------|
| True parallel CPU work in Node | No DOM; message-passing overhead |
| Lighter than fork | GIL-like — one JS thread per worker |
| `workerData` passes initial state | Debugging harder |

**Examples:**

```js
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';

if (isMainThread) {
  const worker = new Worker(new URL(import.meta.url), {
    workerData: { n: 40 },
  });
  worker.on('message', (result) => console.log('fib:', result));
} else {
  const fib = (n) => (n <= 1 ? n : fib(n - 1) + fib(n - 2));
  parentPort.postMessage(fib(workerData.n));
}
```

**Thoughts:** Do not spawn workers for every request — use a pool. Worker files can be `.js` with `type: module` in package.json.

**Sources:** [nodejs.org worker_threads](https://nodejs.org/api/worker_threads.html)

</details>

---

<a name="streams-io"></a>

## Streams, buffers & I/O

<details>
  <summary>Buffer</summary>

### Buffer

**Definition:**

`Buffer` is a global Node.js class for fixed-size binary data (extends `Uint8Array`). Used for files, network packets, images, and any non-text data.

| Concept | Description |
|---------|-------------|
| Encoding | converting Buffer ↔ string (`utf8`, `hex`, `base64`) |
| Decoding | string → Buffer |
| Why not strings? | binary data corrupts in JS strings |

**Examples:**

```js
const buf = Buffer.from('Hello', 'utf8');
console.log(buf);           // <Buffer 48 65 6c 6c 6f>
console.log(buf.toString('hex')); // 48656c6c6f

const fromHex = Buffer.from([0x1a, 0x1b, 0x1c]);
```

**Sources:** [nodejs.org buffer](https://nodejs.org/api/buffer.html)

</details>

<details>
  <summary>Encoding & numbering systems</summary>

### Encoding & numbering systems

**Definition:**

Encoding transforms data into a transmittable format. Unicode maps characters to numbers; UTF-8/UTF-16 are common encodings.

| Encoding | Description |
|----------|-------------|
| ASCII | 7-bit English characters |
| UTF-8 | variable 1–4 bytes, web standard |
| UTF-16 | 2 or 4 bytes per character |
| Base64 | binary → ASCII text |
| Hex | base-16 representation |

**How it works:**

| Base | Prefix | Example |
|------|--------|---------|
| Decimal | — | `25` |
| Binary | `0b` | `0b1011` → 11 |
| Octal | `0o` | `0o25` → 21 |
| Hex | `0x` | `0x2A` → 42 |

**Examples:**

```js
(7).toString(2);  // '111'
Buffer.from('Бе', 'utf8'); // Cyrillic UTF-8 bytes
```

**Sources:** [javascript.info binary-hex](https://javascript.info/binary)

</details>

<details>
  <summary>EventEmitter</summary>

### EventEmitter

**Definition:**

Built-in class for the publish/subscribe event pattern. Core to Node's event-driven architecture; many modules extend it.

| Method | Purpose |
|--------|---------|
| `.on(event, fn)` | listen for event |
| `.emit(event, data)` | fire event |
| `.once(event, fn)` | listen once |
| `.off(event, fn)` | remove listener |

**How it works:** `http.Server`, `net.Socket`, `fs.ReadStream`, `fs.WriteStream`.

**Examples:**

```js
import { EventEmitter } from 'node:events';

const emitter = new EventEmitter();
emitter.on('data', (chunk) => console.log(chunk));
emitter.emit('data', 'hello');
```

**Sources:** [nodejs.org events](https://nodejs.org/api/events.html)

</details>

<details>
  <summary>Streams</summary>

### Streams

**Definition:**

Abstract interface for processing data in chunks — efficient for large files and network transfers. All streams are `EventEmitter` instances.

| Type | Direction | Example |
|------|-----------|---------|
| Readable | read only | `fs.createReadStream` |
| Writable | write only | `fs.createWriteStream` |
| Duplex | read + write | `net.Socket` |
| Transform | modify while piping | `zlib.createGzip` |

**How it works:**

| Benefit | Why |
|---------|-----|
| Separation of concerns | small composable pieces |
| Flexibility | pipe to multiple destinations |
| Memory efficiency | process chunks, not whole file |
| Time efficiency | start processing before full download |

**Examples:**

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

createReadStream('input.txt')
  .pipe(createGzip())
  .pipe(createWriteStream('input.txt.gz'));
```

**Sources:** [nodejs.org stream](https://nodejs.org/api/stream.html)

</details>

<details>
  <summary>Stream events & backpressure</summary>

### Stream events & backpressure

**Definition:**

Readable streams emit `data` chunks in flowing mode. Writable streams emit `drain`, `finish`, `error`. **Backpressure:** pause reading when the writable buffer is full.

| Event | Stream | When |
|-------|--------|------|
| `data` | Readable | chunk available |
| `end` | Readable | no more data |
| `drain` | Writable | buffer emptied, safe to write |
| `finish` | Writable | all data flushed |
| `error` | both | failure |

**Examples:**

```js
readStream.on('data', (chunk) => {
  const ok = writeStream.write(chunk);
  if (!ok) readStream.pause();
});
writeStream.on('drain', () => readStream.resume());
```

**Sources:** [nodejs.org stream backpressure](https://nodejs.org/en/docs/guides/backpressuring-in-streams/)

</details>
