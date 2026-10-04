# Node.js — Interview

Ответы заполнены для опубликованной части, остальные пустые.

[ ← Вернуться в хаб](./8_nodejs.md)

### Related docs

- [Node.js — Core](./8_nodejs_core.md) · [Node.js — Модули](./8_nodejs_modules.md) · [Node.js — HTTP](./8_nodejs_http.md) · [Node.js — Дополнительно](./8_nodejs_process.md) · [Node.js — Интервью](./8_nodejs_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Вопросы с [Devinterview.io — Node.js](https://devinterview.io/questions/web-and-mobile-development/node-interview-questions/).

### Node.js Basics

<details>
<summary>What is Node.js and why is it used?</summary>

### What is Node.js and why is it used?

**Definition:**

Node.js выполняет JavaScript вне браузера на V8, а libuv даёт слой ввода-вывода. Один процесс держит много соединений одновременно, потому что сетевой ввод-вывод не блокирует поток JavaScript.

**How it works:**

- У JavaScript на главном потоке один стек вызовов. Долгая работа запускается и завершается позже через цикл событий.
- libuv выполняет файловый ввод-вывод, часть DNS-запросов и `uv_queue_work` в небольшом пуле потоков (по умолчанию четыре). Сетевой ввод-вывод остаётся на потоке цикла.
- npm — менеджер пакетов и публичный реестр, которые идут вместе с Node.
- Один язык может работать в браузере и на сервере, поэтому его берут для API, потоковой передачи и realtime.
- Он лучше подходит для работы, где много ожидания ввода-вывода (HTTP API, прокси, чат), чем для длинных циклов на CPU в главном потоке. Такую работу уносят в worker threads или другой процесс.

**Examples:**

```js
import http from "node:http";

http.createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("ok");
}).listen(3000);
```

**Sources:**

- [Node.js — About](https://nodejs.org/en/about)
</details>

<details>
<summary>How does Node.js handle child threads?</summary>

### How does Node.js handle child threads?

**Definition:**

Главный поток JavaScript однопоточный. Дополнительные потоки даёт пул libuv для отдельных блокирующих задач и `worker_threads`, когда нужен ещё один изолят V8 для работы на CPU.

**How it works:**

- Пул libuv, размер которого задаёт `UV_THREADPOOL_SIZE` (по умолчанию 4), выполняет вызовы файловой системы, `dns.lookup` и часть crypto. Сетевые сокеты в этот пул не отдают.
- `worker_threads` запускает отдельный изолят со своим циклом событий. Данные передают сообщениями или делят память через `SharedArrayBuffer`.
- Воркер не делит обычные объекты с родителем. Данные клонируют или передают владение.
- Дочерние процессы (`child_process`) — другой инструмент: целый новый процесс ОС, удобный для команды оболочки или границы изоляции.
- Вынос плотного цикла освобождает главный цикл для сокетов. Воркер на каждый запрос обычно дороже пользы.

**Examples:**

```js
import { Worker, isMainThread, parentPort } from "node:worker_threads";

if (isMainThread) {
  const worker = new Worker(new URL(import.meta.url));
  worker.on("message", (n) => console.log(n));
} else {
  parentPort.postMessage(2 + 2);
}
```

**Sources:**

- [Node.js — Worker threads](https://nodejs.org/api/worker_threads.html)
</details>

<details>
<summary>Describe the event-driven programming in Node.js.</summary>

### Describe the event-driven programming in Node.js.

**Definition:**

Программы на Node ждут событий — запрос, кусок файла, таймер — и запускают callback или реакцию промиса, когда событие произошло. `EventEmitter` — небольшой реестр, на котором построены большинство таких API.

**How it works:**

- Эмиттер хранит слушателей через `on` и доставляет их через `emit`. Слушатель выполняется позже, на цикле событий, а не в новом потоке.
- Стек вызовов выполняет текущий JavaScript. Когда он пустеет, цикл берёт следующий таймер, callback ввода-вывода или закрытия.
- HTTP-серверы, API файловой системы и сокеты — эмиттеры. Подписываются вместо блокировки до появления результата.
- Ошибки эмиттера тоже события. Без слушателя `error` процесс может упасть.
- Промисы и `async`/`await` сидят на том же цикле: исполненный промис — микрозадача, а не второй поток.

**Examples:**

```js
import { EventEmitter } from "node:events";

const bus = new EventEmitter();
bus.on("ping", (n) => console.log(n));
bus.emit("ping", 1);
```

**Sources:**

- [Node.js — Events](https://nodejs.org/api/events.html)
</details>

<details>
<summary>What is the event loop in Node.js?</summary>

### What is the event loop in Node.js?

**Definition:**

Цикл событий — это круг, который выполняет таймеры, callback ввода-вывода и закрытия, когда текущий стек JavaScript простаивает. Благодаря ему один поток чередует много операций.

**How it works:**

- Фазы libuv по порядку: таймеры (`setTimeout`, `setInterval`), отложенные callback, idle/prepare, poll (новый ввод-вывод), check (`setImmediate`), затем callback закрытия.
- Очередь `process.nextTick` выполняется после текущей операции, до продолжения цикла. Реакции промисов идут как микрозадачи между фазами, после callback nextTick.
- Poll ждёт ввод-вывод, когда больше ничего не готово. Таймеры и `setImmediate` — не одна очередь.
- Долгий синхронный цикл блокирует все фазы, включая новые соединения.
- Цикл живёт на поток. У worker thread свой цикл, и он не делит очередь родителя.

**Examples:**

```js
setTimeout(() => console.log("timer"), 0);
setImmediate(() => console.log("check"));
Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));
```

**Sources:**

- [Node.js — The event loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
</details>

<details>
<summary>What is the difference between Node.js and traditional web server technologies?</summary>

### What is the difference between Node.js and traditional web server technologies?

**Definition:**

Классический сервер «поток на запрос» тратит поток ОС на каждое соединение, в том числе пока ждёт ввод-вывод. Node держит один поток JavaScript и продолжает другую работу, пока ввод-вывод не завершился.

**How it works:**

- Блокирующий ввод-вывод держит вызывающего, пока диск или база не вернут результат. Неблокирующий регистрирует callback и сразу возвращается.
- Серверы на Java, C# или PHP часто ставят другой язык на сервере и JavaScript в браузере. Node использует JavaScript с обеих сторон.
- Node не компилирует скрипт в бинарник заранее. Файл меняют и запускают снова. Исключение — нативные дополнения.
- Зависимости приходят из npm (или другого клиента) и `package.json`, а не из отдельного репозитория вроде Maven.
- Модель выгодна при множестве простаивающих соединений. Тяжёлый по CPU запрос всё равно блокирует цикл, если его не унести с главного потока.
- Развёртывание — обычно процесс и порт. Менеджер процессов, TLS и обратный прокси всё равно нужны.

**Sources:**

- [Node.js — About](https://nodejs.org/en/about)
</details>

<details>
<summary>Explain what "non-blocking" means in Node.js.</summary>

### Explain what "non-blocking" means in Node.js.

**Definition:**

Неблокирующий вызов начинает работу, которая может занять время, и возвращается до её конца. Результат приходит позже на цикле событий, поэтому другой JavaScript успевает выполниться между ними.

**How it works:**

- `fs.readFile` просит libuv прочитать файл в пуле потоков и вызывает callback, когда байты готовы. Главный поток не стоит внутри чтения.
- Парный `fs.readFileSync` блокирует. Цикл не примет новую работу, пока вызов не вернётся.
- Сетевое чтение неблокирующее на самом потоке цикла. Ядро сообщает о готовности, и JavaScript запускает обработчик.
- Неблокирующий не значит параллельный. Callback на одном потоке всё равно идут по одному.
- Функция может выглядеть асинхронной и всё же блокировать, если callback делает длинное синхронное вычисление.

**Examples:**

```js
import { readFile } from "node:fs";

readFile("notes.txt", "utf8", (_err, text) => {
  console.log(text.length);
});
console.log("started");
```

**Sources:**

- [Node.js — Overview of blocking vs non-blocking](https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking)
</details>

<details>
<summary>How do you update Node.js to the latest version?</summary>

### How do you update Node.js to the latest version?

**Definition:**

Бинарник `node` заменяют менеджером версий или установщиком с nodejs.org. `npm install` обновляет пакеты проекта, а не среду выполнения.

**How it works:**

- Менеджеры версий вроде `nvm`, `fnm` или `nvs` ставят выпуск рядом и переключают `node` в `PATH`.
- Официальный установщик и пакеты ОС заменяют системный бинарник. На сервере фиксируют текущий LTS, а не плавают на «latest».
- После этого проверяют `node -v`. Нативные дополнения пересобирают: ABI меняется между мажорными версиями.
- `npm install -g npm` может обновить сам npm. Это не поддерживаемый способ перейти с одной мажорной версии Node на другую.

**Examples:**

```bash
nvm install --lts
nvm use --lts
node -v
```

**Sources:**

- [Node.js — Download](https://nodejs.org/en/download)
</details>

<details>
<summary>What is npm and what is it used for?</summary>

### What is npm and what is it used for?

**Definition:**

npm — менеджер пакетов, который идёт с Node, и публичный реестр, откуда эти пакеты берутся. CLI ставит модули, записывает диапазоны версий и запускает скрипты проекта.

**How it works:**

- `npm install` читает `package.json`, скачивает пакеты из реестра в `node_modules` и пишет `package-lock.json`, чтобы дерево можно было повторить.
- `npm init` создаёт `package.json`. `npm publish` выкладывает ваш пакет.
- Скрипты жизненного цикла (`start`, `test`, `build`) лежат в `scripts` и запускаются через `npm run`.
- Клиент и реестр — разные вещи. Yarn и pnpm — другие клиенты со своими lock-файлами; реестр у них может быть тот же.
- Сайт — браузерный вид этого реестра, а не второй менеджер пакетов.

**Examples:**

```bash
npm install express
npm install --save-dev vitest
npm run test
```

**Sources:**

- [npm Docs — About npm](https://docs.npmjs.com/about-npm)
</details>

<details>
<summary>How do you manage packages in a Node.js project?</summary>

### How do you manage packages in a Node.js project?

**Definition:**

Проект объявляет зависимости и скрипты в `package.json` и фиксирует установленное дерево в lock-файле. Менеджер пакетов ставит, обновляет и удаляет модули по этому описанию.

**How it works:**

- `npm init` создаёт манифест. `npm install <pkg>` добавляет зависимость; `--save-dev` записывает devDependency.
- `npm update` двигает установленные пакеты внутри уже разрешённых диапазонов. Он не игнорирует диапазон и не прыгает на любой тег latest.
- `npm uninstall <pkg>` убирает пакет из дерева и манифеста.
- Коммитьте `package-lock.json`. У Yarn аналог — `yarn.lock`, у pnpm — `pnpm-lock.yaml`.
- Скрипты в `package.json` — повторяемые команды проекта. В CI стоит запускать `npm ci`, чтобы поставить ровно lock-файл.

**Examples:**

```bash
npm install lodash
npm install --save-dev typescript
npm update lodash
npm ci
```

**Sources:**

- [npm Docs — package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
</details>

<details>
<summary>What is a package.json file?</summary>

### What is a package.json file?

**Definition:**

`package.json` — манифест проекта Node: имя, нужные пакеты и команды, которые можно запустить. Его читают и установщик, и среда выполнения.

**How it works:**

- `dependencies` нужны в рантайме. `devDependencies` нужны для сборки или тестов. `npm install` в production может пропустить вторые.
- Диапазоны версий: `^` разрешает совместимые minor и patch, `~` — только patch, по semver.
- `scripts` сопоставляет имя команде оболочки. `npm start` и `npm test` — обычные имена.
- `main`, `exports`, `type` и `engines` говорят Node, как загружать пакет и какую среду вы ожидаете.
- Создают файл через `npm init`. Не правьте установленные версии вручную без обновления lock-файла, иначе следующая установка разъедется.

**Examples:**

```json
{
  "name": "notes",
  "type": "module",
  "scripts": { "start": "node server.js" },
  "dependencies": { "express": "^5.1.0" }
}
```

**Sources:**

- [npm Docs — package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
</details>


### Node.js Core Modules

<details>
<summary>Describe some of the core modules of Node.js.</summary>

### Describe some of the core modules of Node.js.

**Definition:**

Встроенные модули лежат внутри бинарника `node`. Их импортируют со схемой `node:` и не ставят из реестра.

**How it works:**

- Система: `os` (память, CPU, платформа), `process`, `util`.
- Файлы: `fs` и `path`.
- Сеть: `http` и `https` для HTTP, `net` для TCP, `dgram` для UDP.
- Данные: `stream`, `buffer`, `zlib`, `crypto`, `events`.
- Процессы: `child_process` и `worker_threads`.
- Предпочитайте `node:fs` голому имени, чтобы локальный файл `fs.js` не затенил встроенный модуль.

**Examples:**

```js
import os from "node:os";
import { createServer } from "node:http";

console.log(os.freemem());
createServer((_req, res) => res.end("ok")).listen(0);
```

**Sources:**

- [Node.js — Core modules](https://nodejs.org/api/modules.html#built-in-modules)
</details>

<details>
<summary>How do you create a simple server in Node.js using the HTTP module?</summary>

### How do you create a simple server in Node.js using the HTTP module?

**Definition:**

`http.createServer` строит сервер, чей слушатель запроса получает `req` и `res` на каждое соединение. `listen` занимает порт.

**How it works:**

- Слушатель выполняется на цикле событий для каждого запроса. URL читают из `req.url`, метод — из `req.method`.
- Статус и заголовки пишут через `writeHead` (или `setHeader`) и заканчивают `res.end`. Пока нет `end`, клиент остаётся открытым.
- Тело — читаемый поток. Для JSON POST куски собирают или отдают разбор фреймворку.
- `server.listen(port)` начинает приём. Callback `listening` выполняется один раз, когда порт занят.
- Это сырой сервер, который оборачивает Express. Маршрутизацию вы делаете сами.

**Examples:**

```js
import http from "node:http";

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(3000);
```

**Sources:**

- [Node.js — HTTP](https://nodejs.org/api/http.html)
</details>

<details>
<summary>Explain the purpose of the File System (fs) module.</summary>

### Explain the purpose of the File System (fs) module.

**Definition:**

`node:fs` читает и пишет файлы, каталоги и метаданные на локальной машине. Это серверный API, страница в браузере его вызвать не может.

**How it works:**

- Асинхронные формы (`readFile`, `writeFile` и версии из `fs/promises`) сразу возвращают управление и заканчивают работу на цикле.
- Синхронные формы (`readFileSync`) блокируют цикл событий. Они годятся для коротких скриптов, не для обработчика запроса.
- Можно перечислить каталог, снять `stat`, переименовать, удалить и создать жёсткую или символическую ссылку.
- Потоки (`createReadStream`, `createWriteStream`) двигают большие файлы кусками, а не одним буфером.
- Пути — пути ОС. Собирайте их через `node:path`, а не склейкой строк.

**Examples:**

```js
import { readFile } from "node:fs/promises";

const text = await readFile(new URL("./notes.txt", import.meta.url), "utf8");
```

**Sources:**

- [Node.js — File system](https://nodejs.org/api/fs.html)
</details>

<details>
<summary>What is the Buffer class in Node.js?</summary>

### What is the Buffer class in Node.js?

**Definition:**

`Buffer` — кусок сырых байтов фиксированного размера. Node использует его для файлов, сокетов и crypto, где данные не обязательно текст.

**How it works:**

- Это подкласс `Uint8Array`. Длина фиксируется при выделении; больший объём требует новый буфер.
- `Buffer.from(text, "utf8")` кодирует строку. `buf.toString("utf8")` декодирует байты.
- `Buffer.alloc(n)` создаёт обнулённые байты. `Buffer.allocUnsafe` не обнуляет и может показать старую память, если не перезаписать каждый байт.
- Срезы делят нижележащую память, пока вы не скопируете. Запись через один вид меняет другой.
- Тела HTTP и куски файлов часто приходят буферами. Склеивайте их, только когда известен полный размер, или передавайте потоком.

**Examples:**

```js
const buf = Buffer.from("café", "utf8");
console.log(buf.length, buf.toString("utf8"));
```

**Sources:**

- [Node.js — Buffer](https://nodejs.org/api/buffer.html)
</details>

<details>
<summary>What are streams in Node.js and what types are available?</summary>

### What are streams in Node.js and what types are available?

**Definition:**

Поток двигает данные кусками, а не держит всю нагрузку в памяти. В Node четыре вида: readable, writable, duplex и transform.

**How it works:**

- Readable: чтение файла или тело HTTP-запроса. Его потребляют через `for await` или событие `data`.
- Writable: запись файла или HTTP-ответ. Пишут куски через `write` и заканчивают `end`.
- Duplex: оба направления, как у TCP-сокета.
- Transform: duplex, который меняет куски по пути, например gzip или хеш.
- `pipeline` из `node:stream/promises` соединяет их и передаёт ошибки и очистку.
- Обычные случаи — HTTP и `fs.createReadStream`. Обратное давление (`write` вернул false, затем `drain`) не даёт быстрому читателю залить медленного писателя.

**Examples:**

```js
import { createReadStream } from "node:fs";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";

await pipeline(createReadStream("notes.txt"), createGzip(), process.stdout);
```

**Sources:**

- [Node.js — Stream](https://nodejs.org/api/stream.html)
</details>

<details>
<summary>How do you read and write files in Node.js?</summary>

### How do you read and write files in Node.js?

**Definition:**

</details>

<details>
<summary>How do you use the EventEmitter in Node.js?</summary>

### How do you use the EventEmitter in Node.js?

**Definition:**

</details>

<details>
<summary>What is the QueryString module?</summary>

### What is the QueryString module?

**Definition:**

</details>

<details>
<summary>How do you manage path operations in Node.js?</summary>

### How do you manage path operations in Node.js?

**Definition:**

</details>


### Asynchronous Programming

<details>
<summary>What are callbacks in Node.js?</summary>

### What are callbacks in Node.js?

**Definition:**

</details>

<details>
<summary>What is callback hell and how can it be avoided?</summary>

### What is callback hell and how can it be avoided?

**Definition:**

</details>

<details>
<summary>Explain promises in Node.js.</summary>

### Explain promises in Node.js.

**Definition:**

</details>

<details>
<summary>How do async/await functions work in Node.js?</summary>

### How do async/await functions work in Node.js?

**Definition:**

</details>

<details>
<summary>What is the difference between synchronous and asynchronous methods in the fs module?</summary>

### What is the difference between synchronous and asynchronous methods in the fs module?

**Definition:**

</details>


### Networking in Node.js

<details>
<summary>How does Node.js handle HTTP requests and responses?</summary>

### How does Node.js handle HTTP requests and responses?

**Definition:**

</details>

<details>
<summary>What is Express.js and why is it important for Node.js?</summary>

### What is Express.js and why is it important for Node.js?

**Definition:**

</details>

<details>
<summary>How do you create a RESTful API with Node.js?</summary>

### How do you create a RESTful API with Node.js?

**Definition:**

</details>

<details>
<summary>What is middleware in the context of Node.js?</summary>

### What is middleware in the context of Node.js?

**Definition:**

</details>

<details>
<summary>How do you ensure security in HTTP headers with Node.js?</summary>

### How do you ensure security in HTTP headers with Node.js?

**Definition:**

</details>


### Error Handling & Debugging

<details>
<summary>How do you handle errors in Node.js?</summary>

### How do you handle errors in Node.js?

**Definition:**

</details>

<details>
<summary>Describe some error first callback patterns in Node.js.</summary>

### Describe some error first callback patterns in Node.js.

**Definition:**

</details>

<details>
<summary>What are some common debugging techniques for Node.js applications?</summary>

### What are some common debugging techniques for Node.js applications?

**Definition:**

</details>

<details>
<summary>Explain process.nextTick().</summary>

### Explain process.nextTick().

**Definition:**

</details>

<details>
<summary>What is the global object in Node.js?</summary>

### What is the global object in Node.js?

**Definition:**

</details>


### Testing in Node.js

<details>
<summary>What frameworks are available for testing Node.js applications?</summary>

### What frameworks are available for testing Node.js applications?

**Definition:**

</details>

<details>
<summary>Explain the concept of mocking in Node.js.</summary>

### Explain the concept of mocking in Node.js.

**Definition:**

</details>

<details>
<summary>Why is benchmarking important in Node.js?</summary>

### Why is benchmarking important in Node.js?

**Definition:**

</details>

<details>
<summary>How do you test an HTTP server in Node.js?</summary>

### How do you test an HTTP server in Node.js?

**Definition:**

</details>


### Node.js with Databases

<details>
<summary>How do you connect a MySQL database with Node.js?</summary>

### How do you connect a MySQL database with Node.js?

**Definition:**

</details>

<details>
<summary>Explain how NoSQL databases like MongoDB can be used with Node.js.</summary>

### Explain how NoSQL databases like MongoDB can be used with Node.js.

**Definition:**

</details>

<details>
<summary>What's the role of ORM in Node.js?</summary>

### What's the role of ORM in Node.js?

**Definition:**

</details>


### Node.js Performance

<details>
<summary>How can you monitor the performance of a Node.js app?</summary>

### How can you monitor the performance of a Node.js app?

**Definition:**

</details>

<details>
<summary>What is clustering in Node.js and how does it work?</summary>

### What is clustering in Node.js and how does it work?

**Definition:**

</details>

<details>
<summary>How can you prevent memory leaks in a Node.js application?</summary>

### How can you prevent memory leaks in a Node.js application?

**Definition:**

</details>

<details>
<summary>Explain the use of the --inspect flag in Node.js.</summary>

### Explain the use of the --inspect flag in Node.js.

**Definition:**

</details>


### Concurrency in Node.js

<details>
<summary>How does Node.js handle concurrency?</summary>

### How does Node.js handle concurrency?

**Definition:**

</details>

<details>
<summary>What is the difference between process and child_process modules?</summary>

### What is the difference between process and child_process modules?

**Definition:**

</details>

<details>
<summary>How do worker threads work in Node.js?</summary>

### How do worker threads work in Node.js?

**Definition:**

</details>


### Node.js and Microservices

<details>
<summary>How is Node.js used in microservices architecture?</summary>

### How is Node.js used in microservices architecture?

**Definition:**

</details>

<details>
<summary>Explain inter-process communication in a Node.js microservice architecture.</summary>

### Explain inter-process communication in a Node.js microservice architecture.

**Definition:**

</details>


### Security in Node.js

<details>
<summary>What are some common security best practices for Node.js applications?</summary>

### What are some common security best practices for Node.js applications?

**Definition:**

</details>

<details>
<summary>How would you protect your Node.js application from XSS attacks?</summary>

### How would you protect your Node.js application from XSS attacks?

**Definition:**

</details>

<details>
<summary>What are environment variables and how could you use them in Node.js?</summary>

### What are environment variables and how could you use them in Node.js?

**Definition:**

</details>


### Node.js and WebSockets

<details>
<summary>What are WebSockets and how do they work with Node.js?</summary>

### What are WebSockets and how do they work with Node.js?

**Definition:**

</details>

<details>
<summary>How do you set up a WebSocket server in Node.js?</summary>

### How do you set up a WebSocket server in Node.js?

**Definition:**

</details>


### Node.js Deployment

<details>
<summary>How do you deploy a Node.js application in production?</summary>

### How do you deploy a Node.js application in production?

**Definition:**

</details>

<details>
<summary>What is PM2 and how is it used in Node.js?</summary>

### What is PM2 and how is it used in Node.js?

**Definition:**

</details>

<details>
<summary>Explain how you would use Docker with a Node.js application.</summary>

### Explain how you would use Docker with a Node.js application.

**Definition:**

</details>


### Node.js and Version Control

<details>
<summary>How do you manage versioning of a Node.js API?</summary>

### How do you manage versioning of a Node.js API?

**Definition:**

</details>

<details>
<summary>What are semantic versioning (semver) and its importance in Node.js development?</summary>

### What are semantic versioning (semver) and its importance in Node.js development?

**Definition:**

</details>


### Node.js Advanced Topics

<details>
<summary>What is the difference between exports and module.exports in Node.js?</summary>

### What is the difference between exports and module.exports in Node.js?

**Definition:**

</details>

<details>
<summary>How can you create a simple TCP server in Node.js?</summary>

### How can you create a simple TCP server in Node.js?

**Definition:**

</details>

<details>
<summary>What is REPL in Node.js?</summary>

### What is REPL in Node.js?

**Definition:**

</details>

<details>
<summary>Explain the role of a reverse proxy with Node.js applications.</summary>

### Explain the role of a reverse proxy with Node.js applications.

**Definition:**

</details>

<details>
<summary>How do Node.js streams enhance performance?</summary>

### How do Node.js streams enhance performance?

**Definition:**

</details>


### Frameworks and Libraries in Node.js

<details>
<summary>Describe some popular frameworks and libraries in the Node.js ecosystem.</summary>

### Describe some popular frameworks and libraries in the Node.js ecosystem.

**Definition:**

</details>

<details>
<summary>How is Koa different from Express.js?</summary>

### How is Koa different from Express.js?

**Definition:**

</details>

<details>
<summary>What is NestJS and when would you choose it for your Node.js project?</summary>

### What is NestJS and when would you choose it for your Node.js project?

**Definition:**

</details>

<details>
<summary>What are the benefits of using TypeScript with Node.js?</summary>

### What are the benefits of using TypeScript with Node.js?

**Definition:**

</details>


### Integrations & Third-Party Node.js Modules

<details>
<summary>How would you integrate a Node.js app with a third-party API?</summary>

### How would you integrate a Node.js app with a third-party API?

**Definition:**

</details>

<details>
<summary>What is Socket.IO and how does it work with Node.js?</summary>

### What is Socket.IO and how does it work with Node.js?

**Definition:**

</details>

<details>
<summary>Explain how GraphQL can be used with Node.js.</summary>

### Explain how GraphQL can be used with Node.js.

**Definition:**

</details>


### Node.js with Frontend Technologies

<details>
<summary>How does Node.js interact with frontend frameworks like Angular or React?</summary>

### How does Node.js interact with frontend frameworks like Angular or React?

**Definition:**

</details>

<details>
<summary>What is server-side rendering and how can it be achieved with Node.js?</summary>

### What is server-side rendering and how can it be achieved with Node.js?

**Definition:**

</details>


### Node.js Best Practices

<details>
<summary>What are some coding conventions and best practices in Node.js?</summary>

### What are some coding conventions and best practices in Node.js?

**Definition:**

</details>

<details>
<summary>How do you ensure your Node.js application adheres to the twelve-factor app principles?</summary>

### How do you ensure your Node.js application adheres to the twelve-factor app principles?

**Definition:**

</details>

<details>
<summary>What is code linting and how is it applied in Node.js?</summary>

### What is code linting and how is it applied in Node.js?

**Definition:**

</details>


### Scaling Node.js Applications

<details>
<summary>What are some strategies for scaling Node.js applications?</summary>

### What are some strategies for scaling Node.js applications?

**Definition:**

</details>

<details>
<summary>How do you handle session management in a scaled Node.js application?</summary>

### How do you handle session management in a scaled Node.js application?

**Definition:**

</details>

<details>
<summary>How does the use of microservices affect the scalability of a Node.js application?</summary>

### How does the use of microservices affect the scalability of a Node.js application?

**Definition:**

</details>


### Node.js and Message Queues

<details>
<summary>What are message queues and how are they used in Node.js?</summary>

### What are message queues and how are they used in Node.js?

**Definition:**

</details>

<details>
<summary>How do you implement RabbitMQ with Node.js?</summary>

### How do you implement RabbitMQ with Node.js?

**Definition:**

</details>

<details>
<summary>What is the significance of ZeroMQ in Node.js applications?</summary>

### What is the significance of ZeroMQ in Node.js applications?

**Definition:**

</details>


### Node.js and Cloud Services

<details>
<summary>How do cloud platforms like AWS, Azure, or GCP facilitate Node.js application deployment?</summary>

### How do cloud platforms like AWS, Azure, or GCP facilitate Node.js application deployment?

**Definition:**

</details>

<details>
<summary>What is serverless architecture, and how does it relate to Node.js?</summary>

### What is serverless architecture, and how does it relate to Node.js?

**Definition:**

</details>


### Environment Management

<details>
<summary>How can you manage multiple Node.js versions on the same machine?</summary>

### How can you manage multiple Node.js versions on the same machine?

**Definition:**

</details>

<details>
<summary>What are .env files and how do they work in a Node.js application?</summary>

### What are .env files and how do they work in a Node.js application?

**Definition:**

</details>

<details>
<summary>Describe the usage of the config module in Node.js.</summary>

### Describe the usage of the config module in Node.js.

**Definition:**

</details>


### Node.js and Continuous Integration/Continuous Deployment (CI/CD)

<details>
<summary>What is continuous integration/deployment and how is it implemented for Node.js apps?</summary>

### What is continuous integration/deployment and how is it implemented for Node.js apps?

**Definition:**

</details>

<details>
<summary>How do you set up a CI/CD pipeline for a Node.js project?</summary>

### How do you set up a CI/CD pipeline for a Node.js project?

**Definition:**

</details>


### Node.js Interview Problem Solving and Scenarios

<details>
<summary>How would you troubleshoot a slow running Node.js application?</summary>

### How would you troubleshoot a slow running Node.js application?

**Definition:**

</details>

<details>
<summary>Describe how to handle file uploads in a Node.js application.</summary>

### Describe how to handle file uploads in a Node.js application.

**Definition:**

</details>

<details>
<summary>How would you handle heavy computation tasks in a Node.js application?</summary>

### How would you handle heavy computation tasks in a Node.js application?

**Definition:**

</details>


### Node.js and DevOps

<details>
<summary>What is the role of a Node.js application in DevOps?</summary>

### What is the role of a Node.js application in DevOps?

**Definition:**

</details>

<details>
<summary>Describe containerization and its benefits for Node.js applications.</summary>

### Describe containerization and its benefits for Node.js applications.

**Definition:**

</details>


### Node.js and IoT

<details>
<summary>How is Node.js used in IoT (Internet of Things)?</summary>

### How is Node.js used in IoT (Internet of Things)?

**Definition:**

</details>

<details>
<summary>What would you consider when developing a Node.js application for IoT devices?</summary>

### What would you consider when developing a Node.js application for IoT devices?

**Definition:**

</details>


### Node.js and Machine Learning

<details>
<summary>Can you use Node.js for machine learning? If so, how?</summary>

### Can you use Node.js for machine learning? If so, how?

**Definition:**

</details>

<details>
<summary>What are some machine learning libraries or tools available for Node.js?</summary>

### What are some machine learning libraries or tools available for Node.js?

**Definition:**

</details>


### APIs and Node.js

<details>
<summary>What are best practices for designing RESTful APIs in Node.js?</summary>

### What are best practices for designing RESTful APIs in Node.js?

**Definition:**

</details>
