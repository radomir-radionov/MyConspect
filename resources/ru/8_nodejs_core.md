# Node.js — Core

V8, цикл событий, потоки, буферы и основы среды выполнения.

[ ← Вернуться в хаб](./8_nodejs.md)

### Related docs

* [Node.js — Core](./8_nodejs_core.md) · [Node.js — Модули](./8_nodejs_modules.md) · [Node.js — HTTP](./8_nodejs_http.md) · [Node.js — Дополнительно](./8_nodejs_process.md) · [Node.js — Интервью](./8_nodejs_interview.md)

### Sections

- [Node runtime & core](#node-runtime-core)
- [Streams, buffers & I/O](#streams-buffers-io)

Пакеты, CJS/ESM и встроенные модули → [Node.js — Модули](./8_nodejs_modules.md).

---

## Node runtime & core

<details>
  <summary>Node.js overview</summary>

### Node.js overview

**Definition:** Node.js — это бесплатная кроссплатформенная серверная среда выполнения с открытым исходным кодом, которая позволяет разработчикам создавать масштабируемые приложения с помощью JavaScript.

**How it works:**

| Особенность | Описание |
|---------|-------------|
| Файловый ввод-вывод | чтение/запись файлов на диске |
| Сеть | HTTP-серверы, сокеты TCP/UDP |
| БД | подключиться через драйверы (см. [9_database.md](./9_database.md)) |
| Совместное использование кода | повторное использование JS между интерфейсом и сервером |
| Пакеты | реестр npm с миллионами модулей |

V8 (JS-движок) + libuv (асинхронный ввод-вывод, пул потоков) + привязки узлов.

| Глобальный | Цель ||--------|---------|
| `__dirname` | путь к каталогу текущего модуля |
| `__filename` | полный путь к текущему файлу модуля |
| `process.argv` | Массив аргументов CLI |
| `process.env` | переменные среды |

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

**Definition:** Цикл событий — это механизм Node для планирования асинхронной работы. задачи очереди демультиплексора libuv; цикл обрабатывает макро- и микрозадачи и возвращает результаты вашему приложению.

**How it works:**

| Фаза | Что работает |
|-------|-----------|
| таймеры | `setTimeout`, `setInterval` обратные вызовы |
| в ожидании | Внутренние обратные вызовы ввода-вывода |
| простаивать, готовиться | Внутренний |
| опрос | Получить новые события ввода-вывода; выполнить обратные вызовы ввода-вывода |
| проверить | `setImmediate` обратные вызовы |
| закрыть | `close` обратные вызовы событий |

Между фазами: дренаж `process.nextTick` очередь, затем микрозадачи (`Promise.then`).

| Тип | Примеры |
|------|----------|
| Макрозадачи | `setTimeout`, `setInterval`, обратные вызовы ввода-вывода |
| Микрозадачи | `Promise.then`, `queueMicrotask` |
| `nextTick` | `process.nextTick` — запускается перед другими микрозадачами |

Приложение отправляет асинхронную задачу → демультиплексор → очередь событий → выполняется цикл → обратный вызов запускается в приложении.

**When to use:** Никогда не используйте `fs.readFileSync` по запросу путь в производство. Разгрузить процессор для `worker_threads`.

**Pluses and minuses:**

| + | − |
|------|------|
| Обрабатывает тысячи одновременных соединений ввода-вывода | Работа процессора блокирует все обратные вызовы |
| Однопоточный JS позволяет избежать блокировок | Один медленный цикл синхронизации останавливает все |

**Examples:**

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
process.nextTick(() => console.log('4'));
console.log('5');
// 1, 5, 4, 3, 2
```

**Sources:** [цикл событий nodejs.org](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick)

</details>

<details>
  <summary>Global object</summary>

### Global object

**Definition:**

В Node.js глобальный объект (`global`) — это пространство имен верхнего уровня, аналогичное `window` в браузерах. Встроенные и определяемые пользователем привязки верхнего уровня доступны во всех модулях.

| Недвижимость | Цель |
|----------|---------|
| `console` | протоколирование и отладка |
| `process` | информация о процессе, окружение, выход |
| `Buffer` | двоичные данные |
| `setTimeout` / `setInterval` | таймеры |
| `__dirname` / `__filename` | пути к модулям (CommonJS) |

**Examples:**

```js
console.log(process.pid);
console.log(process.env.NODE_ENV);
```

**Thoughts:** Избегайте загрязнения `global`; предпочитаю явный `require`/`import` и экспорт модулей.

**Sources:** [глобальные переменные nodejs.org](https://nodejs.org/api/globals.html)

</details>

<details>
  <summary>Core terminology</summary>

### Core terminology

**Definition:**

Ключевые понятия для понимания того, как структурированы и выполняются приложения Node.js.

| Срок | Определение |
|------|------------|
| Процесс | запуск экземпляра программы с собственной памятью и ресурсами |
| Тема | единица выполнения внутри процесса |
| Модуль | автономный блок кода с экспортом |
| Напильник для ствола | реэкспортирует несколько модулей из одного индексного файла || Кэширование | хранение часто используемых данных в памяти |
| Зависимости | внешние пакеты, необходимые во время выполнения |
| Зависимости от разработчиков | пакеты, необходимые только во время разработки |
| Внедрение зависимостей | зависимости, предоставленные извне, а не созданные внутри |
| Переменные среды | Конфигурация уровня ОС через `process.env` |
| `.env` файл | локальные переменные окружения (никогда не передавать секреты) |
| `nodemon` | инструмент разработчика, который перезапускает Node при изменении файла |

**How it works:** `process.env` является глобальным узлом; тот `dotenv` пакетные нагрузки `.env` файлы в него при запуске.

**Sources:** [процесс nodejs.org](https://nodejs.org/api/process.html#processenv)

</details>

<details>
  <summary>Single-threaded vs multi-threaded</summary>

### Single-threaded vs multi-threaded

**Definition:**

Node.js запускает JavaScript в **одном основном потоке**, но libuv использует пул потоков для блокировки ввода-вывода (fs, криптография, DNS). Для параллелизма используйте кластер, дочерние процессы или рабочие потоки.

| Подход | Вариант использования |
|----------|----------|
| Основной поток + цикл событий | Серверы с привязкой к вводу-выводу |
| `worker_threads` | JS с привязкой к процессору в том же процессе |
| `child_process` / `cluster` | отдельные процессы, изоляция неисправностей |
| Несколько серверов/Докер | горизонтальное масштабирование |

**How it works:** Node является однопоточным для выполнения JS; многопоточный для ввода-вывода через libuv.

**Sources:** [nodejs.org worker_threads](https://nodejs.org/api/worker_threads.html) · [кластер nodejs.org](https://nodejs.org/api/cluster.html)

</details>

<details>
  <summary>worker_threads</summary>

### worker_threads

**Definition:** `worker_threads` запускает JavaScript в параллельных потоках в рамках одного и того же процесса — отдельные изоляты V8 с дополнительными `SharedArrayBuffer` для общей памяти.

**How it works:**

1. Основной поток создает `new Worker('./worker.js', { workerData })`.
2. Worker запускает собственный цикл событий и контекст JS.
3. Общайтесь через `postMessage` / `on('message')` (структурированный клон) или `SharedArrayBuffer`.
4. Worker завершает работу, когда скрипт завершается или `worker.terminate()` называется.

| против кластера/дочернего_процесса | рабочие_потоки | кластер |
|--------------------------|----------------|---------|
| Память | Общий процесс (дополнительная общая память) | Отдельные процессы |
| Стартап | Зажигалка | Тяжелее (новый V8) |
| Изоляция неисправностей | Авария работника может занять процесс | Изоляция процесса |
| Вариант использования | JS с привязкой к процессору (хэш, изображение) | HTTP-работников на процессор |

**When to use:** Пакетное хеширование паролей, изменение размера изображения, анализ PDF-файлов, тяжелое преобразование JSON — не для простого ввода-вывода (этим занимается цикл событий).

**Pluses and minuses:**

| + | − |
|------|------|
| Настоящая параллельная работа ЦП в Node | Нет ДОМ; накладные расходы на передачу сообщений |
| Легче вилки | GIL-подобно — один JS-поток на каждого работника |
| `workerData` проходит исходное состояние | Отладка сложнее |

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

**Thoughts:** Не порождайте воркеры для каждого запроса — используйте пул. Рабочие файлы могут быть `.js` с `type: module` в package.json.

**Sources:** [nodejs.org worker_threads](https://nodejs.org/api/worker_threads.html)

</details>

---

<a name="streams-io"></a>

## Streams, buffers & I/O

<details>
  <summary>Buffer</summary>

### Buffer

**Definition:**

`Buffer` — это глобальный класс Node.js для двоичных данных фиксированного размера (расширяет `Uint8Array`). Используется для файлов, сетевых пакетов, изображений и любых нетекстовых данных.

| Концепция | Описание |
|---------|-------------|
| Кодирование | преобразование строки Buffer ↔ (`utf8`, `hex`, `base64`) |
| Декодирование | строка → Буфер |
| Почему не струны? | двоичные данные повреждаются в строках JS |

**Examples:**

```js
const buf = Buffer.from('Hello', 'utf8');
console.log(buf);           // <Buffer 48 65 6c 6c 6f>
console.log(buf.toString('hex')); // 48656c6c6f

const fromHex = Buffer.from([0x1a, 0x1b, 0x1c]);
```

**Sources:** [буфер nodejs.org](https://nodejs.org/api/buffer.html)

</details>

<details>
  <summary>Encoding & numbering systems</summary>

### Encoding & numbering systems

**Definition:**

Кодирование преобразует данные в передаваемый формат. Юникод сопоставляет символы с числами; UTF-8/UTF-16 — распространенные кодировки.

| Кодирование | Описание |
|----------|-------------|
| ASCII | 7-битные английские символы |
| UTF-8 | переменная 1–4 байта, веб-стандарт |
| UTF-16 | 2 или 4 байта на символ |
| База64 | двоичный → текст ASCII |
| Шестнадцатеричный | представление base-16 |

**How it works:**

| База | Префикс | Пример |
|------|--------|---------|
| Десятичный | — | `25` |
| Двоичный | `0b` | `0b1011` → 11 |
| Восьмеричный | `0o` | `0o25` → 21 |
| Шестнадцатеричный | `0x` | `0x2A` → 42 |

**Examples:**

```js
(7).toString(2);  // '111'
Buffer.from('Бе', 'utf8'); // Cyrillic UTF-8 bytes
```

**Sources:** [javascript.info двоичный-шестнадцатеричный](https://javascript.info/binary)

</details>

<details>
  <summary>EventEmitter</summary>

### EventEmitter

**Definition:**

Встроенный класс для шаблона событий публикации/подписки. Событийная архитектура Core to Node; многие модули расширяют его.

| Метод | Цель |
|--------|---------|
| `.on(event, fn)` | прослушать событие |
| `.emit(event, data)` | пожар |
| `.once(event, fn)` | послушай один раз |
| `.off(event, fn)` | удалить прослушиватель |

**How it works:** `http.Server`, `net.Socket`, `fs.ReadStream`, `fs.WriteStream`.

**Examples:**

```js
import { EventEmitter } from 'node:events';

const emitter = new EventEmitter();
emitter.on('data', (chunk) => console.log(chunk));
emitter.emit('data', 'hello');
```

**Sources:** [события nodejs.org](https://nodejs.org/api/events.html)

</details>

<details>
  <summary>Streams</summary>

### Streams

**Definition:**

Абстрактный интерфейс для обработки данных порциями — эффективен для больших файлов и сетевой передачи. Все потоки есть `EventEmitter` экземпляры.

| Тип | Направление | Пример |
|------|-----------|---------|
| Читабельно | только чтение | `fs.createReadStream` |
| Доступно для записи | писать только | `fs.createWriteStream` |
| Дуплекс | читать + писать | `net.Socket` |
| Трансформировать | изменить при прокладке трубопроводов | `zlib.createGzip` |

**How it works:**

| Выгода | Почему |
|---------|-----|
| Разделение интересов | небольшие сборные детали |
| Гибкость | трубопровод в несколько пунктов назначения |
| Эффективность памяти | обрабатывать фрагменты, а не весь файл |
| Эффективность времени | начать обработку до полной загрузки |

**Examples:**

```js
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

createReadStream('input.txt')
  .pipe(createGzip())
  .pipe(createWriteStream('input.txt.gz'));
```

**Sources:** [поток nodejs.org](https://nodejs.org/api/stream.html)

</details>

<details>
  <summary>Stream events & backpressure</summary>

### Stream events & backpressure

**Definition:**

Читаемые потоки излучают `data` куски в потоковом режиме. Записываемые потоки излучают `drain`, `finish`, `error`. **Обратное давление:** приостанавливайте чтение, когда записываемый буфер заполнен.

| Событие | Поток | Когда |
|-------|--------|------|
| `data` | Читабельно | доступен фрагмент |
| `end` | Читабельно | больше нет данных |
| `drain` | Доступно для записи | буфер пуст, можно писать |
| `finish` | Доступно для записи | все данные сброшены |
| `error` | оба | провал |

**Examples:**

```js
readStream.on('data', (chunk) => {
  const ok = writeStream.write(chunk);
  if (!ok) readStream.pause();
});
writeStream.on('drain', () => readStream.resume());
```

**Sources:** [противодавление потока nodejs.org](https://nodejs.org/en/docs/guides/backpressuring-in-streams/)

</details>
