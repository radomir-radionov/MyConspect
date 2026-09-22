# Node.js — Interview

Вопросы и ответы на собеседовании по Node.js.

[ ← Вернуться в хаб](./8_nodejs.md)

### Related docs

* [Node.js — Core](./8_nodejs_core.md) · [Node.js — Модули](./8_nodejs_modules.md) · [Node.js — HTTP](./8_nodejs_http.md) · [Node.js — Дополнительно](./8_nodejs_process.md) · [Node.js — Интервью](./8_nodejs_interview.md)

### Sections

- [Questions & Answers](#questions-answers)

---

## Questions & Answers

<details>
  <summary>What is REPL?</summary>

### What is REPL?

**Definition:** Read-Eval-Print-Loop — интерактивная оболочка Node (`node` без файла). Немедленно оценивает выражения JS.

**Examples:**

```bash
$ node
> 2 + 2
4
> const fs = require('fs')
```

Полезно для быстрых экспериментов и отладки фрагментов.

</details>

<details>
  <summary>What is a file vs a file system?</summary>

### What is a file vs a file system?

**Definition:** **Файл** — это именованная последовательность байтов плюс атрибуты (разрешения, владелец, размер, метки времени, курсор чтения/записи). **Файловая система** отображает эту абстракцию на диски, поэтому программы не заботятся об оборудовании, а уникальные **пути** позволяют избежать конфликтов имен.

**How it works:** Иерархические деревья (корень, каталоги, файлы как листья) победили плоские пространства имен. Unix рассматривает устройства и каталоги как файлы; открыть → чтение/запись → закрыть, с **дескрипторами файлов** ядра. Полные примечания: [Файлы и файловые системы](./8_nodejs_modules.md#files--file-systems).

</details>

<details>
  <summary>What are streams in Node.js?</summary>

### What are streams in Node.js?

**Definition:** Интерфейсы для чтения/записи данных частями — `Readable`, `Writable`, `Duplex`, `Transform`. Обрабатывайте большие файлы, не загружая их все в память.

**How it works:** приостановить чтение, когда записываемый буфер заполнен.

**Examples:**

```js
createReadStream('./large.bin').pipe(res);
```

</details>

<details>
  <summary>What is middleware?</summary>

### What is middleware?

**Definition:** Функции `(req, res, next) => {}` в экспресс-конвейере выполняется в порядке регистрации.

**How it works:** Вызов `next()` пройти контроль; вызов `next(err)` за ошибки; отправить ответ (`res.json`) для завершения цепочки. Промежуточное программное обеспечение ошибок имеет 4 аргумента `(err, req, res, next)`.

**When to use:** Ведение журнала, `express.json()`, авторизация (`req.user`), проверка, 404, центральный обработчик ошибок (последний).

**Sources:** [промежуточное ПО expressjs.com](https://expressjs.com/en/guide/using-middleware.html)

</details>

<details>
  <summary>setImmediate vs setTimeout vs process.nextTick?</summary>

### setImmediate vs setTimeout vs process.nextTick?

**Definition:** Узел планирует асинхронные обратные вызовы в разных очередях/фазах. Порядок имеет значение для производительности и правильности.

**How it works:**

1. Выполнить синхронный код.
2. Слив**`process.nextTick`** очередь (вся она — может привести к остановке ввода-вывода).
3. Слейте **микрозадачи** (`Promise.then`, `queueMicrotask`).
4. Фаза цикла событий (таймеры → ожидание → бездействие → **опрос** → **проверка** → закрытие).
5. **`setImmediate`** выполняется на этапе **проверки** (после опроса ввода-вывода).
6. **`setTimeout(fn, 0)`** выполняется в фазе **таймеров** (следующая итерация цикла, если ожидается ввод-вывод).

| API | Очередь/фаза | Когда |
|-----|---------------|------|
| `process.nextTick` | следующая очередь очереди | До микрозадач и ввода-вывода |
| `Promise.then` | микрозадача | После nextTick, перед следующей макрозадачой |
| `setImmediate` | этап проверки | После обратных вызовов ввода-вывода в опросе |
| `setTimeout(0)` | фазовые таймеры | После минимальной задержки (≥1 мс) |

**When to use:** Использовать `setImmediate` отложить работу после ввода-вывода; избегать рекурсивного `nextTick`. Предпочитать `queueMicrotask` над `nextTick` для отсрочки, подобной обещанию, в новом коде.

**Pluses and minuses:**

| + | − |
|------|------|
| `setImmediate` откладывает без блокировки ввода-вывода | Ментальная модель сложна |
| `nextTick` выполняется перед продолжением | бесконечный `nextTick` голодает цикл |

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

**Sources:** [цикл событий nodejs.org](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick)

</details>

<details>
  <summary>ESM vs CommonJS?</summary>

### ESM vs CommonJS?

См. **Модули → ESM и CommonJS (подробное описание)**.

**Short answer:** ССЖ = `require`/`module.exports`, синхронно. ЕСМ = `import`/`export`, статический, `"type": "module"` or `.mjs`. ESM — это стандарт для нового кода Node и браузера; использовать `import.meta.url` для `__dirname`.

**Sources:** [nodejs.org ESM](https://nodejs.org/api/esm.html)

</details>

<details>
  <summary>What are worker_threads?</summary>

### What are worker_threads?

**Definition:** Параллельные потоки JavaScript в одном процессе для работы **с привязкой к процессору** — отдельный вариант V8, `postMessage` МПК, опционально `SharedArrayBuffer`.

**When to use:** Обработка изображений, шифрование, тяжелые вычисления — не для ввода-вывода (цикл событий уже справляется с этим). Используйте пул рабочих, а не один рабочий на запрос.

**Sources:** [nodejs.org worker_threads](https://nodejs.org/api/worker_threads.html)

</details>

<details>
  <summary>Graceful shutdown — SIGTERM?</summary>

### Graceful shutdown — SIGTERM?

**Definition:** При развертывании/остановке поймайте **SIGTERM** → `server.close()` → завершить текущие запросы → закрыть пул БД → выйти.

**When to use:** Kubernetes отправляет SIGTERM раньше SIGKILL (отсрочка ~30 секунд). Не проходите проверку работоспособности при сливе, поэтому трафик перемещается на новые модули.

**Sources:** [сигналы процесса nodejs.org](https://nodejs.org/api/process.html#signal-events)

</details>

<details>
  <summary>Why is Node.js single-threaded?</summary>

### Why is Node.js single-threaded?

**Definition:** JavaScript работает в одном потоке; Пул потоков libuv обрабатывает блокировку ввода-вывода (fs, crypto). Работа, связанная с процессором, блокирует цикл событий.

**How it works:** `worker_threads`, дочерние процессы или выгрузку в службу очереди/рабочую службу.

</details>

<details>
  <summary>fork() vs spawn()?</summary>

### fork() vs spawn()?

Оба из `child_process`.

| Метод | Цель |
|--------|---------|
| `spawn` | общий процесс с потоковым stdio |
| `fork` | создать Node-модуль с IPC (`process.send`) |

Использовать `fork` для работников кластера и обмена сообщениями между процессами.

</details>

<details>
  <summary>JWT and bcrypt?</summary>

### JWT and bcrypt?

| Инструмент | Роль |
|------|------|
| **JWT** | Подписанный токен (`header.payload.signature`) для аутентификации без гражданства; проверить подпись + `exp` серверная часть; короткий TTL + обновление для отзыва |
| **bcrypt** | Медленный адаптивный хеш для паролей; `bcrypt.hash(plain, rounds)` хранить хэш; `bcrypt.compare(plain, hash)` — никогда не храните и не регистрируйте простые пароли |

**How it works:** Войти → `bcrypt.compare` → выдать JWT с `sub`, `role`, `exp`. Промежуточное ПО `jwt.verify` на охраняемых маршрутах.

**When to use:** bcrypt раунды 10–12; Секрет JWT в env; HttpOnly cookie или `Authorization: Bearer` заголовок.

**Sources:** [jwt.io](https://jwt.io/) · [npm bcrypt](https://www.npmjs.com/package/bcrypt)

</details>

<details>
  <summary>What is Node.js? What is libuv?</summary>

### What is Node.js? What is libuv?

**Definition:** Node.js — это среда выполнения JavaScript на стороне сервера, построенная на **V8** (выполняет JS) и **libuv** (уровень асинхронной платформы).

**How it works:**

- **Цикл событий** — планирует таймеры, обратные вызовы ввода-вывода, `setImmediate`, закрытие обработчиков.
- **Пул потоков** (по умолчанию 4) — блокировка работы: файловой системы, DNS, криптографии (`UV_THREADPOOL_SIZE` для настройки).
- **Сетевой ввод-вывод** — `epoll` / `kqueue` /IOCP — один поток обрабатывает множество соединений.

*"JS работает в одном потоке; libuv обрабатывает асинхронный ввод-вывод и выгружает операции блокировки в пул потоков."*

**Sources:** [nodejs.org — О программе](https://nodejs.org/en/about) · [libuv docs](http://docs.libuv.org/en/v1.x/)

</details>

<details>
  <summary>How does the event loop work?</summary>

### How does the event loop work?

**Definition:** Механизм, который запускает обратные вызовы JS после завершения асинхронных операций.

**How it works:**

таймеры → ожидание → простой/подготовка → **опрос** (I/O) → проверка (`setImmediate`) → закрыть.

осушать `process.nextTick`, затем микрозадачи (`Promise.then`).

| Очередь | Примеры |
|-------|----------|
| `nextTick` | Запускается перед другими микрозадачами — может привести к остановке ввода-вывода, если рекурсивный |
| Микрозадачи | `Promise.then`, `queueMicrotask` |
| Макрозадачи | `setTimeout`, обратные вызовы ввода-вывода, `setImmediate` |

**When to use:**

#### Pitfall

Длинный синхронный цикл в основном потоке блокирует всех клиентов — разгружайте процессор `worker_threads`.

**Sources:** [nodejs.org — Цикл событий](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick)

</details>

<details>
  <summary>cluster vs worker_threads?</summary>

### cluster vs worker_threads?

| | **кластер** | **worker_threads** |
|---|-------------|-------------------|
| Единица | Отдельный **процесс** (собственный V8) | **Поток** в том же процессе |
| Вариант использования | Масштабирование HTTP-сервера по ядрам ЦП | JS с привязкой к процессору (хэш, анализ, изображение) |
| Связь | МПК (`process.send`) | `postMessage`, `SharedArrayBuffer` |
| Аварийная изоляция | Авария рабочего ≠ всегда убивать всех | Ошибка работника может повлиять на процесс |

**Rule:** кластер для многоядерного HTTP; worker_threads для параллельных вычислений — не один рабочий на запрос.

**Sources:** [кластер nodejs.org](https://nodejs.org/api/cluster.html) · [worker_threads](https://nodejs.org/api/worker_threads.html)

</details>

<details>
  <summary>NestJS — full request path and decorators?</summary>

### NestJS — full request path and decorators?

**Path:** Промежуточное ПО → Защита → Перехватчики (до) → Трубы → Контроллер → Сервис → Перехватчики (после) → Фильтры исключений (при ошибке).

**Key decorators:**

- `@Module`, `@Controller`, `@Injectable` — структура + ДИ
- `@Get` / `@Post`, `@Body`, `@Param` — маршрутизация
- `@UseGuards` — авторизация/роли (`CanActivate`)
- `@UsePipes(ValidationPipe)` — Проверка DTO
- `@UseInterceptors` — логирование, картирование ответов
- `@Catch()` — фильтры исключений

Охранники бегут глобально → контроллер → маршрут; заказать внутри `@UseGuards(A, B)` слева направо.

**Sources:** [NestJS — жизненный цикл запроса](https://docs.nestjs.com/faq/request-lifecycle)

</details>

<details>
  <summary>NestJS vs Express vs Fastify?</summary>

### NestJS vs Express vs Fastify?

Express/Fastify = уровень HTTP. Гнездо = ​​каркас (модули, DI, ограждения, каналы) поверх любого адаптера.

**Выберите Nest**, чтобы обеспечить слаженность работы команды, тестирование и микросервисы. **Выберите Express**, чтобы получить минимальное количество API. **Выберите Fastify**, чтобы получить чистую скорость и проверку схемы. Адаптер Nest + Fastify сочетает в себе структуру и пропускную способность.

**Sources:** [NestJS — Первые шаги](https://docs.nestjs.com/first-steps)

</details>

<details>
  <summary>Node.js vs Go vs Elixir?</summary>

### Node.js vs Go vs Elixir?

**Узел** — API ввода-вывода, полный стек TS, npm, цикл событий. **Go** — горутины, статические двоичные файлы, сервисы CPU+I/O. **Эликсир** — актеры, отказоустойчивость, режим реального времени (Phoenix Channels).

Выберите Node для типичных веб-серверов с командой JS; Выбирайте работников, которым важна производительность; Эликсир для постоянно работающих систем реального времени.

См. раздел [Выбор среды выполнения серверной части](./8_nodejs_http.md#runtime-choice).

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

Чего не хватает?

<details><summary>Answer</summary>

`try/catch` or `express-async-errors` — необработанный отказ приводит к сбою процесса или зависанию без ответа.

</details>

### Task 2 — Readable stream pipe

Перенаправить большой файл в HTTP-ответ с противодавлением.

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

117. Что такое РЕПЛ?

118. Что такое потоки в Node.js?

119. Что такое промежуточное программное обеспечение?

120. Что такое `setImmediate` используется для?

121. Что такое `app.param()` в Экспрессе?

122. Что такое аутентификация на основе токенов?

</details>

<details>
  <summary>Middle — Back-end</summary>

### Middle — Back-end

117. Почему Node.js однопоточный, а не многопоточный?

118. Что такое событийно-ориентированное развитие?

119. Сравните `fork()` и `spawn()`.

120. Какие фреймворки Node.js вы использовали? В чем различия?

121. Опишите конечную точку, которая сохраняет файл размером 4 ГБ от клиента на S3 или другой CDN.

122. Что такое микросервисы и зачем их использовать?

123. Когда бы вы выбрали монолит вместо микросервисов?

124. Как узнать, что приложение в данный момент работоспособно?

125. Как узнать, что приложение работало исправно в течение последних трех дней?

126.Как bcrypt проверяет пароль?

127. Что такое JWT?

128. Джуниор отправил этот код на проверку. В чем дело? Как исправить?

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

25. Сравните модули CommonJS, AMD и импорт ES6.

26. Какой серверный фреймворк вы бы выбрали и почему?

27. Опишите своими словами, как работает OAuth v2.

28. В проекте есть утечки памяти. Как их обнаружить, исправить и предотвратить?

29. У проекта есть проблемы с производительностью. Как их обнаружить, исправить и предотвратить?

</details>

<details>
  <summary>General</summary>

### General

7. Что такое двигатель V8?

</details>

</details>


