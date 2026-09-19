# Node.js — Runtime

V8, libuv, modules, streams, buffers, and built-in APIs.

[← Back to hub](./8_nodejs.md)

### Related docs

* [Node.js — Runtime](./8_nodejs_core.md) · [Node.js — HTTP](./8_nodejs_http.md) · [Node.js — Process](./8_nodejs_process.md) · [Node.js — Interview](./8_nodejs_interview.md)

### Sections

- [Node runtime & core](#node-runtime-core)
- [Modules & package management](#modules-package-management)
- [Streams, buffers & I/O](#streams-buffers-io)
- [Built-in modules](#built-in-modules)

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

<a name="modules-tooling"></a>

### Topic template

Every major topic in `<details>` sections follows:

**Definition** → **How it works** → **When to use** → **Pluses and minuses** → **Examples** → **Thoughts** → **Sources**

### Event loop & modules

**Definition:**

Node.js runs JavaScript on a single thread while libuv handles async I/O via an event loop (timers, I/O callbacks, microtasks). Code is organized into modules via CommonJS (`require`) or ESM (`import`).

| Phase / queue | Examples |
|---------------|----------|
| Timers | `setTimeout`, `setInterval` |
| I/O callbacks | completed fs/network callbacks |
| Microtasks | `Promise.then`, `queueMicrotask` |
| `process.nextTick` | runs before other microtasks |

**Examples:**

```js
// CommonJS
const fs = require('node:fs');
fs.readFile('./data.txt', 'utf8', (err, data) => console.log(data));

// ESM
import fs from 'node:fs/promises';
const data = await fs.readFile('./data.txt', 'utf8');
```

**Thoughts:** I/O is non-blocking; CPU work on the main thread blocks everything. Offload with `worker_threads`, `child_process`, or cluster.

**Sources:** [nodejs.org event loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick) · [learn.javascript.ru/modules](https://learn.javascript.ru/modules)

### Express & streams

**Definition:**

Express is a minimal HTTP framework for Node.js; streams are interfaces for reading/writing data in chunks instead of loading entire files into memory.

| Tool | Role |
|------|------|
| Express | routing, middleware pipeline, static files |
| Readable stream | read data in chunks (files, HTTP body) |
| Writable stream | write data in chunks (response, disk) |
| `pipe()` | connect streams with backpressure |

**How it works:** Large files, uploads/downloads, compression, real-time data.

**Examples:**

```js
import express from 'express';
import { createReadStream } from 'node:fs';

const app = express();

app.get('/file', (req, res) => {
  createReadStream('./large.bin').pipe(res);
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

**Sources:**

[expressjs.com](https://expressjs.com/) · [nodejs.org streams](https://nodejs.org/api/stream.html)

---

<a name="node-runtime"></a>

## Modules & package management

<details>
  <summary>npm, npx & nvm</summary>

### npm, npx & nvm

**Definition:**

Tooling for installing packages, running binaries, and managing Node versions.

| Tool | Purpose |
|------|---------|
| `npm` | package manager — install, publish, scripts |
| `npx` | run package binaries without global install |
| `nvm` | switch between Node.js versions per project |

**How it works:** `MAJOR.MINOR.PATCH` — breaking / feature / fix.

**Examples:**

```bash
npm install express
npx create-next-app@latest my-app
nvm install 20 && nvm use 20
```

**Sources:** [docs.npmjs.com](https://docs.npmjs.com/) · [github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)

</details>

<details>
  <summary>npm vs yarn vs pnpm</summary>

### npm vs yarn vs pnpm

**Definition:**

Package managers for JavaScript. All use the npm registry; differ in lockfile format, install speed, and dependency layout.

| | npm | Yarn | pnpm |
|---|-----|------|------|
| Lock file | package-lock.json | yarn.lock | pnpm-lock.yaml |
| Install speed | good | fast (parallel) | very fast (content-addressable store) |
| Disk usage | per-project copies | per-project copies | shared store, hard links |
| Default with Node | yes | no | no |

**When to use:** stick with team/project convention; pnpm for monorepos and disk efficiency.

**Sources:** [pnpm.io](https://pnpm.io/) · [yarnpkg.com](https://yarnpkg.com/)

</details>

<details>
  <summary>Dependencies & package.json</summary>

### Dependencies & package.json

**Definition:**

`package.json` describes the project; `node_modules` holds installed packages; `package-lock.json` pins exact versions for reproducible installs.

| Field / file | Role |
|--------------|------|
| `dependencies` | required at runtime |
| `devDependencies` | build, test, lint only |
| `node_modules` | installed package tree |
| `package-lock.json` | locked dependency graph |

**Examples:**

```bash
npm install lodash          # dependencies (-S default)
npm install -D jest         # devDependencies
```

**Sources:** [docs.npmjs.com package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)

</details>

<details>
  <summary>require & packages</summary>

### require & packages

**Definition:**

A package is a distributable unit of code (library, module, or app). `require()` (CommonJS) or `import` (ESM) loads modules; metadata lives in `package.json`.

| System | Syntax | Notes |
|--------|--------|-------|
| CommonJS | `const fs = require('fs')` | synchronous load, `module.exports` |
| ESM | `import fs from 'fs'` | static analysis, `export` |

**Examples:**

```js
// CommonJS
const express = require('express');
module.exports = { createApp: () => express() };

// ESM
import express from 'express';
export function createApp() { return express(); }
```

**Sources:** [nodejs.org modules](https://nodejs.org/api/modules.html) · [nodejs.org esm](https://nodejs.org/api/esm.html)

</details>

<details>
  <summary>ESM vs CommonJS (deep dive)</summary>

### ESM vs CommonJS (deep dive)

**Definition:** Node supports two module systems. **CommonJS (CJS)** uses `require`/`module.exports` (synchronous load). **ESM** uses `import`/`export` (static analysis, async load).

**How it works:**

| Aspect | CommonJS | ESM |
|--------|----------|-----|
| Syntax | `require()`, `module.exports` | `import`, `export` |
| Loading | Synchronous, runtime | Asynchronous, parsed before run |
| `this` at top level | `module.exports` | `undefined` (strict) |
| `__dirname` / `__filename` | Available | Use `import.meta.url` |
| JSON import | `require('./x.json')` | `import x from './x.json' with { type: 'json' }` |
| Dynamic import | `require(dynamic)` | `await import(dynamic)` |
| Tree-shaking | Limited | Better (static imports) |
| Interop | ESM can `import` CJS default | CJS `require()` of ESM only if ESM is async |

```json
{ "type": "module" }
```

or `.mjs` extension. `.cjs` forces CommonJS in `"type": "module"` projects.

`import fs from 'fs'` — CJS module's `module.exports` becomes default export. Named exports from CJS may need `import pkg from 'cjs'; const { x } = pkg`.

**When to use:** New projects → ESM (`"type": "module"`). Legacy libs → CJS. Dual packages publish both `main` and `exports`.

**Pluses and minuses:**

| + (ESM) | − (ESM) |
|------------|------------|
| Standard in browsers and modern Node | Ecosystem still migrating |
| Top-level `await` | `__dirname` workaround needed |
| Static analysis, tree-shaking | Some tools expect CJS |

**Examples:**

```js
// ESM — dirname equivalent
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dynamic import in CJS
const { createServer } = await import('node:http');
```

**Thoughts:** `require` is not defined in native ESM. Use `createRequire(import.meta.url)` from `node:module` for legacy `require` in ESM files.

**Sources:** [nodejs.org ESM](https://nodejs.org/api/esm.html) · [nodejs.org modules](https://nodejs.org/api/modules.html)

</details>

<details>
  <summary>CLI commands & flags</summary>

### CLI commands & flags

**Definition:**

Common shell and npm commands for Node.js development.

| Command | Purpose |
|---------|---------|
| `npm i` | install dependencies from package.json |
| `npm install -S pkg` | add runtime dependency |
| `npm install -D pkg` | add dev dependency |
| `npm publish` | publish package to registry |
| `ls` / `ls -la` | list files (include hidden with `-a`) |
| `cat file` | print file contents |
| `touch file` | create empty file |
| `rm` | remove files/directories |
| `pwd` | print working directory |
| `chmod +x file` | make file executable |
| `history` | list previous shell commands |

**Examples:**

```bash
npm install -D typescript
npm run build
```

**Sources:** [docs.npmjs.com cli](https://docs.npmjs.com/cli/v10/commands)

</details>

<details>
  <summary>Project structure</summary>

### Project structure

**Definition:** Organizing Node.js projects for maintainability — separate routes, controllers, services, and config.

**How it works:**

| Pattern | Structure |
|---------|-----------|
| MVC | `routes/` → `controllers/` → `models/` |
| Feature-based | `features/users/`, `features/auth/` |
| Clean architecture | `domain/`, `use-cases/`, `infrastructure/` — [three-layer notes](./7_special_architecture.md#three-layer-architecture-doka) |

**Examples:**

```
src/
  routes/
  controllers/
  services/
  middleware/
  config/
  index.js
```

**Sources:** [nodejs.org best practices](https://github.com/goldbergyoni/nodebestpractices)

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

---

<a name="built-in-modules"></a>

## Built-in modules

<details>
  <summary>libuv</summary>

### libuv

**Definition:** Cross-platform C library powering Node's async I/O, event loop, thread pool, networking, and file system operations.

**How it works:**

1. JavaScript calls async API (e.g. `fs.readFile`).
2. Node binding hands work to libuv.
3. **Thread pool** (default 4 threads) runs blocking OS calls — file I/O, DNS, crypto, compression.
4. Network I/O uses OS primitives (`epoll`, `kqueue`, `IOCP`) — no thread per connection.
5. Completed callback is queued; **event loop** runs it on the main JS thread.

| Feature | Description |
|---------|-------------|
| Event loop | Schedules timers, I/O callbacks, check, close callbacks |
| Thread pool | Offloads blocking work (`UV_THREADPOOL_SIZE` to tune) |
| Networking | TCP/UDP abstractions |
| File system | Async fs operations via thread pool |

**When to use:** Increase `UV_THREADPOOL_SIZE` for heavy crypto/fs workloads. CPU-bound JS → `worker_threads`, not bigger thread pool alone.

**Pluses and minuses:**

| + | − |
|------|------|
| Single-threaded JS + efficient I/O | CPU-heavy JS still blocks the loop |
| Cross-platform abstraction | Thread pool size limits parallel fs/crypto |

**Examples:**

```bash
UV_THREADPOOL_SIZE=8 node server.js
```

**Thoughts:** libuv is why Node is fast for I/O-bound servers but poor for CPU-bound work on one thread.

**Sources:** [libuv docs](http://docs.libuv.org/en/v1.x/) · [nodejs.org event loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick)

</details>

<details>
  <summary>Files & file systems</summary>

### Files & file systems

**Definition:** A **file** is a named byte sequence stored on a physical medium, plus **attributes** that tell the OS how to handle it. A **file system** is the OS abstraction that allocates that storage, hides hardware differences, and resolves name collisions.

**How it works:**

- RAM holds working data as bytes. Persistence is a named file on disk/SSD (random access) — historically also tape (sequential records) or punch cards (fixed-length records).
- Session: **open** → read/write/attributes → **close**. The kernel tracks each open file with a numeric **file descriptor** (POSIX) or equivalent (Windows). Node maps both to an `fd` / `FileHandle`.
- **Buffering:** writes often land in an OS buffer first, then flush in the background — the UI can look “saved” while the file on disk is still growing.
- Typical OS APIs: `open`, `close`, `read`/`write` (relative to a cursor), `seek`, `delete`, `rename`, read/write attributes.
- **Unix:** devices, directories, and pipes are special files; programs use the same file APIs. Mount attaches another volume into one tree (`mount` / `umount`).

| Model | Idea | Where |
|-------|------|--------|
| Flat (one level) | Unique names in a single namespace | Tiny devices (appliance firmware) |
| Fixed depth | A few hardcoded levels | Routers, TVs |
| Hierarchical | Tree: **root dir**, dirs, **files as leaves** | Desktops, servers, phones |

Collision strategy: forbid duplicate names **in the same directory**. Same basename in different dirs is unique via the **full path**. Separators: `/` (Unix) vs `\` (Windows). Relative names concatenate onto the current (or home) directory.

Unix FS strengths: simple permission model, symbolic links, dirs and devices as files, one mountable namespace.

- **Absolute** = from the root (`/` or `C:\…`). **Relative** = from the working directory. Relatives stay portable inside a project folder; the OS still converts them to absolute on access.
- **`.`** = current dir, **`..`** = parent, **`~`** = home (usually `/home/user`).
- Unix names are **case-sensitive** (`File1` ≠ `file1`). Windows NTFS usually **preserves case but matches case-insensitively**. Unix forbids `/` and `\0` in names.
- Windows reserved in names: `\ / : * ? " < > |`. Spaces need quotes. Legacy **MAX_PATH ≈ 260**; Windows 10+ can lift it, older clients may still fail.
- **Extension** (`.png`, `.exe`) is a hint for users and default apps. The real type lives in attributes / magic bytes. Unix binaries often have **no** extension; `.sh` / `.conf` are convention.

| Dir | Role |
|-----|------|
| `/bin`, `/sbin` | Essential user / system binaries |
| `/boot` | Bootloader + kernel images |
| `/dev` | Device files |
| `/etc` | Host-specific config |
| `/home`, `/root` | User homes; root’s home |
| `/lib` | Shared libs, kernel modules |
| `/mnt`, `/opt` | Temp mounts; extra packages |
| `/proc`, `/sys` | Kernel / sysfs virtual files |
| `/tmp` | Temporary |
| `/usr` | Second-level hierarchy (shareable) |
| `/var` | Variable data (logs, spool) |

**When to use:**

Node `fs` / `path`; Docker [bind mounts](./10_build_docker.md#bind-mounts); SPA address bar vs real files ([URI](./6_web_api_core.md#uri-url--urn), History API); browser user files ([File API](./3_js_browser_extra.md#formdata-file-api-filereader)).

**Example** (Node — open / stat / close; prefer `FileHandle` so the fd is not leaked):

```js
import { open } from 'node:fs/promises';
import path from 'node:path';

const abs = path.resolve('notes', 'todo.txt'); // OS-correct join
let file;
try {
  file = await open(abs, 'r');
  const stat = await file.stat(); // size, mtime, mode, …
  console.log(stat.size);
} finally {
  await file?.close();
}
```

#### Common pitfalls

Mixing `/` and `\` by hand instead of `path.join`; assuming case-insensitive names on Linux CI; leaving `fs.open` fds open; treating `.jpg` as a guarantee of JPEG; Windows illegal chars in generated filenames.

**Pluses and minuses:**

| + | − |
| - | - |
| Hierarchy + path = unique names | Path separators and case differ by OS |
| Unix “everything is a file” unifies APIs | Must close fds or leak until crash |
| Relative project trees move easily | Buffering can delay durable write |

**Thoughts:** A file is a named byte stream + metadata; the file system is the tree (and APIs) that make that stream portable across disks.

**Sources:** [Doka — files & file systems](https://doka.guide/tools/file/) · [nodejs.org fs — file descriptors](https://nodejs.org/api/fs.html#file-descriptors) · [FHS](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html)

</details>

<details>
  <summary>fs (file system)</summary>

### fs (file system)

**Definition:**

Built-in module for reading, writing, and managing files and directories. OS model (paths, attributes, buffering, fds): [Files & file systems](#files--file-systems).

| API style | Methods |
|-----------|---------|
| Callback | `fs.readFile`, `fs.writeFile`, `fs.mkdir` |
| Promise | `fs.promises.readFile` |
| Sync | `fs.readFileSync` (blocks event loop) |
| Stream | `fs.createReadStream`, `fs.createWriteStream` |

**Examples:**

```js
import { readFile, writeFile } from 'node:fs/promises';

const data = await readFile('./config.json', 'utf8');
await writeFile('./out.txt', data);
```

**Sources:** [nodejs.org fs](https://nodejs.org/api/fs.html)

</details>

<details>
  <summary>os</summary>

### os

**Definition:**

Operating system utility module — platform info, memory, CPUs, network interfaces.

| Method | Returns |
|--------|---------|
| `os.platform()` | `'darwin'`, `'linux'`, `'win32'` |
| `os.arch()` | `'x64'`, `'arm64'` |
| `os.totalmem()` / `os.freemem()` | memory in bytes |
| `os.cpus()` | CPU core info |
| `os.networkInterfaces()` | IP/MAC addresses |

**Examples:**

```js
import os from 'node:os';
console.log(os.hostname(), os.freemem());
```

**Sources:** [nodejs.org os](https://nodejs.org/api/os.html)

</details>

<details>
  <summary>path</summary>

### path

**Definition:**

Cross-platform utilities for file and directory path manipulation. Absolute vs relative, `/` vs `\`: [Files & file systems](#files--file-systems).

| Method | Purpose |
|--------|---------|
| `path.join(...)` | join segments |
| `path.resolve(...)` | absolute path |
| `path.dirname(p)` | parent directory |
| `path.basename(p)` | filename |
| `path.extname(p)` | extension |

**Examples:**

```js
import path from 'node:path';

const file = path.join(__dirname, 'data', 'users.json');
const ext = path.extname(file); // '.json'
```

**Sources:** [nodejs.org path](https://nodejs.org/api/path.html)

</details>

<details>
  <summary>http</summary>

### http

**Definition:**

Core module for creating HTTP servers and clients without a framework.

| Capability | API |
|------------|-----|
| Server | `http.createServer((req, res) => {})` |
| Request | `http.request(options, callback)` |
| Response | `res.writeHead`, `res.write`, `res.end` |

**Examples:**

```js
import { createServer } from 'node:http';

createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true }));
}).listen(8080);
```

**Sources:** [nodejs.org http](https://nodejs.org/api/http.html) · Concept: [Web server](./6_web_api_http.md#web-server)

</details>

<details>
  <summary>URL & URI</summary>

### URL & URI

**Definition:**

`URL` class (WHATWG) parses and builds URLs. Legacy `url` module still available; prefer `new URL()` for modern code. Address parts (scheme, authority, query, hash): [URI, URL & URN](./6_web_api_core.md#uri-url--urn). Browser helpers: [URL / URLSearchParams](./3_js_browser_extra.md#url--urlsearchparams).

| Method / API | Purpose |
|--------------|---------|
| `new URL(str, base)` | parse URL into components |
| `url.pathname`, `.searchParams` | access parts |
| `url.href` | full URL string |

**Examples:**

```js
const url = new URL('https://api.example.com/users?page=1');
console.log(url.hostname);              // api.example.com
console.log(url.searchParams.get('page')); // '1'
```

**Sources:** [nodejs.org url](https://nodejs.org/api/url.html)

</details>

<details>
  <summary>winston (logging)</summary>

### winston (logging)

**Definition:**

Popular logging library with multiple transports, levels, and custom formats.

| Feature | Description |
|---------|-------------|
| Levels | error, warn, info, verbose, debug |
| Transports | console, file, database |
| Formats | timestamps, JSON, custom |

**Examples:**

```js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
});
logger.info('Server started');
```

**Sources:** [github.com/winstonjs/winston](https://github.com/winstonjs/winston)

</details>

<details>
  <summary>cluster</summary>

### cluster

**Definition:**

Spawns multiple Node worker processes sharing the same server port — utilizes all CPU cores.

| Role | Description |
|------|-------------|
| Master | forks workers, distributes connections |
| Worker | handles requests on shared port |

**Examples:**

```js
import cluster from 'node:cluster';
import { createServer } from 'node:http';

if (cluster.isPrimary) {
  for (let i = 0; i < 4; i++) cluster.fork();
} else {
  createServer((req, res) => res.end('ok')).listen(3000);
}
```

**Sources:** [nodejs.org cluster](https://nodejs.org/api/cluster.html)

</details>

---

<a name="express-http"></a>
