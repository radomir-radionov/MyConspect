# Express.js — Interview

Ответы заполнены для опубликованной части, остальные пустые.

[ ← Вернуться в хаб](./8_nodejs.md)

### Related docs

- [Node.js — HTTP](./8_nodejs_http.md) · [Express.js — Интервью](./8_express_interview.md) · [Node.js — Интервью](./8_nodejs_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Вопросы с [Devinterview.io — Express.js](https://devinterview.io/questions/web-and-mobile-development/express-interview-questions/).

### Express.js Fundamentals

<details>
<summary>What is Express.js, and how does it relate to Node.js?</summary>

### What is Express.js, and how does it relate to Node.js?

**Definition:**

Express — тонкий слой маршрутов и middleware поверх HTTP-сервера Node. Node выполняет JavaScript и держит сокеты; Express решает, какие функции увидят запрос и как будет записан ответ.

**How it works:**

- `express()` возвращает приложение. `app.listen` поднимает `http.Server` и пропускает каждый запрос через стек middleware.
- Middleware — функция `(req, res, next)`, которая может писать лог, разбирать тело или завершать ответ.
- Методы `get`, `post`, `put`, `delete` и остальные привязывают путь к одному или нескольким обработчикам.
- Шаблонизатор может отдать HTML. JSON API обычно вызывает `res.json` и обходится без шаблонов.
- Обработчик ошибок — middleware с четырьмя параметрами, `(err, req, res, next)`. Он срабатывает, когда кто-то вызывает `next(err)`.

**Examples:**

```js
import express from "express";

const app = express();
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});
app.listen(3000);
```

**Sources:**

- [Express — Hello world](https://expressjs.com/en/starter/hello-world.html)
</details>

<details>
<summary>Explain the concept of middleware in Express.js.</summary>

### Explain the concept of middleware in Express.js.

**Definition:**

Middleware — упорядоченный список функций, через которые проходит запрос до обработчика маршрута или вместо него. Каждая функция может изменить `req` или `res`, закончить ответ или передать управление дальше.

**How it works:**

- Сигнатура — `(req, res, next)`. Вызов `next()` запускает следующее совпадение. Вызов `next(err)` переходит к middleware ошибок.
- Middleware уровня приложения монтируют через `app.use`: оно видит каждый дошедший запрос или только префикс пути.
- Middleware уровня роутера вешают на `express.Router`, и оно работает только для маршрутов этого роутера.
- Встроенные примеры: `express.json()`, `express.urlencoded()` и `express.static()`.
- Обработчик ошибок объявляют с четырьмя аргументами. Обычный `next()` его пропускает.
- Функция, которая не ответила и не вызвала `next()`, оставляет клиента в ожидании.

**Examples:**

```js
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
```

**Sources:**

- [Express — Writing middleware](https://expressjs.com/en/guide/writing-middleware.html)
</details>

<details>
<summary>How would you set up a basic Express.js application?</summary>

### How would you set up a basic Express.js application?

**Definition:**

Базовое приложение — проект Node с зависимостью Express, созданным приложением, хотя бы одним маршрутом и прослушиванием порта.

**How it works:**

- Инициализируйте проект командой `npm init` и установите фреймворк: `npm install express`.
- В файле входа вызовите `express()`, добавьте маршрут и вызовите `app.listen(port)`.
- Запуск — `node app.js`. В разработке `node --watch` перезапускает процесс при изменении файлов.
- Общую настройку (разбор тела, логирование) ставьте в `app.use` до маршрутов, которым она нужна.

**Examples:**

```js
import express from "express";

const app = express();
app.get("/", (_req, res) => {
  res.send("hello");
});
app.listen(3000);
```

**Sources:**

- [Express — Installing](https://expressjs.com/en/starter/installing.html)
</details>

<details>
<summary>What is the purpose of the app.use() function?</summary>

### What is the purpose of the app.use() function?

**Definition:**

`app.use` регистрирует middleware, роутер или вложенное приложение. Без пути совпадает каждый дошедший запрос; с путём — только этот префикс.

**How it works:**

- Глобальное middleware, например логгер, монтируют без пути, и оно выполняется для каждого запроса, который до него дошёл.
- Middleware с путём работает, только если URL начинается с этого префикса. Так CORS или проверка доступа закрывают один `/api`.
- Типичные монтирования: разбор тела, `cors`, `express.static` и лог запроса.
- Тем же методом монтируют роутер: `app.use("/api", apiRouter)`.
- Порядок и есть поведение. Парсеры и логгеры идут до маршрутов, запасной 404 — после них.
- Вызов возвращает приложение, поэтому монтирования можно сцеплять.

**Examples:**

```js
app.use(express.json());
app.use("/api", apiRouter);
app.use("/files", express.static("public"));
```

**Sources:**

- [Express — Application](https://expressjs.com/en/5x/api.html#app.use)
</details>

<details>
<summary>How do you serve static files using Express.js?</summary>

### How do you serve static files using Express.js?

**Definition:**

`express.static` сопоставляет URL с файлами в каталоге и отдаёт файл, если он есть. Если совпадения нет, вызывается `next()`, и следующие маршруты всё ещё работают.

**How it works:**

- `app.use(express.static("public"))` отдаёт `public/app.js` по адресу `/app.js`.
- Путь монтирования добавляет префикс: `app.use("/assets", express.static("public"))` отдаёт тот же файл по `/assets/app.js`.
- Это файлы, которые можно публиковать: изображения, HTML, CSS, JavaScript, шрифты. Шаблоны и запросы к базе здесь не выполняются.
- Параметры `maxAge`, `index` и `dotfiles` задают кэш, индекс каталога и отдачу скрытых файлов.
- Указывайте только каталог, который безопасно открыть наружу.

**Examples:**

```js
app.use("/assets", express.static("public", { maxAge: "1h" }));
```

**Sources:**

- [Express — Serving static files](https://expressjs.com/en/starter/static-files.html)
</details>

<details>
<summary>Discuss the difference between app.get() and app.post() in Express.js.</summary>

### Discuss the difference between app.get() and app.post() in Express.js.

**Definition:**

`app.get` обрабатывает GET — чтение ресурса. `app.post` обрабатывает POST — отправку тела, часто с изменением состояния сервера. На один путь можно повесить оба метода.

**How it works:**

- Данные GET обычно идут в пути или query string, поэтому попадают в URL, логи и историю. Ответ могут кэшировать.
- Данные POST идут в теле (JSON, форма или файл). URL остаётся стабильным, а полезная нагрузка может быть большой или чувствительной.
- Переход по ссылке делает GET. Форма или `fetch` делают POST, если выбран этот метод.
- У GET не должно быть побочных эффектов, иначе повтор или prefetch создаст второй заказ.
- Сам по себе POST не идемпотентен. Повтор может создать второй ресурс, если нет своего ключа идемпотентности.

**Examples:**

```js
app.get("/notes", (_req, res) => {
  res.json(notes);
});
app.post("/notes", (req, res) => {
  notes.push(req.body);
  res.status(201).json(req.body);
});
```

**Sources:**

- [Express — Routing](https://expressjs.com/en/guide/routing.html)
</details>

<details>
<summary>How do you retrieve the URL parameters from a GET request in Express.js?</summary>

### How do you retrieve the URL parameters from a GET request in Express.js?

**Definition:**

GET несёт данные в пути и в query string, а не в теле. Express кладёт именованные сегменты пути в `req.params`, а строку запроса — в `req.query`.

**How it works:**

- Шаблон `/users/:id` захватывает `123` из `/users/123` как `req.params.id`.
- Пары после `?` становятся `req.query`. Из `/users?role=admin&page=2` получаются `req.query.role` и `req.query.page`.
- Значения приходят строками или массивами, если ключ повторён, пока вы их не преобразуете.
- В Express 4 сегмент `*` мог забрать остаток пути. В Express 5 такой wildcard именуют, например `/{*rest}`.
- `req.param()` удалён в Express 5. Читайте явно `req.params`, `req.query` или `req.body`.

**Examples:**

```js
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const page = Number(req.query.page ?? 1);
  res.json({ id, page });
});
```

**Sources:**

- [Express — Routing](https://expressjs.com/en/guide/routing.html)
</details>

<details>
<summary>What are route handlers, and how would you implement them?</summary>

### What are route handlers, and how would you implement them?

**Definition:**

Обработчик маршрута — функция, которую Express вызывает для одного HTTP-метода и пути. Она читает запрос и отправляет ответ либо вызывает `next()`, чтобы продолжила следующая функция.

**How it works:**

- Регистрируют его через `app.get`, `app.post`, `app.put`, `app.delete` или тот же метод у роутера.
- Можно передать несколько функций. Ранняя проверяет доступ и вызывает `next()`, последняя отправляет тело.
- `app.use` — это middleware, а не обработчик одного метода. Оно срабатывает для каждого метода, совпавшего с путём.
- Обработчик, который не отправил ответ и не вызвал `next()`, не завершает запрос.

**Examples:**

```js
function requireUser(req, res, next) {
  if (!req.headers.authorization) return res.sendStatus(401);
  next();
}

app.get("/me", requireUser, (req, res) => {
  res.json({ name: "Ada" });
});
```

**Sources:**

- [Express — Routing](https://expressjs.com/en/guide/routing.html)
</details>

<details>
<summary>How do you enable CORS in an Express.js application?</summary>

### How do you enable CORS in an Express.js application?

**Definition:**

CORS — правило браузера: страница с одного origin может прочитать ответ другого, только если ответ это разрешает. В Express разрешение задают заголовками, обычно пакетом `cors` или вручную.

**How it works:**

- Для «непростого» запроса браузер сначала шлёт предварительный `OPTIONS`. Он должен пройти до POST или PUT.
- `app.use(cors({ origin: "https://app.example" }))` ставит `Access-Control-Allow-Origin` и отвечает на preflight.
- Ручная настройка выставляет `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods` и `Access-Control-Allow-Headers`, а `OPTIONS` завершает кодом 204.
- Отражать любой `Origin` вместе с `Access-Control-Allow-Credentials: true` нельзя. Если уходят cookie, перечислите доверенные origin.
- Монтируйте middleware до маршрутов, которые оно должно покрывать.

**Examples:**

```js
import cors from "cors";

app.use(cors({ origin: ["https://app.example"] }));
```

**Sources:**

- [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
</details>

<details>
<summary>Explain the use of next() in Express.js middleware.</summary>

### Explain the use of next() in Express.js middleware.

**Definition:**

`next` — callback, который двигает запрос по стеку middleware. Вызов означает, что этот шаг закончен и должно выполниться следующее совпадение.

**How it works:**

- `next()` без аргумента продолжает следующее middleware или маршрут.
- `next(err)` пропускает обычные обработчики и попадает в middleware ошибок с четырьмя параметрами.
- `next("route")` пропускает остаток цепочки текущего маршрута и пробует следующий маршрут.
- Если middleware не вызвало `next` и не отправило ответ, запрос зависает.
- Само middleware ошибок вызывает `next(err)` только когда хочет передать ошибку следующему обработчику.

**Examples:**

```js
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});
```

**Sources:**

- [Express — Writing middleware](https://expressjs.com/en/guide/writing-middleware.html)
</details>


### Routing and Requests

<details>
<summary>What is the role of the express.Router class?</summary>

### What is the role of the express.Router class?

**Definition:**

`express.Router()` — мини-приложение: свои middleware и маршруты, но без своего TCP-порта. Связанные endpoint группируют в модуле и монтируют этот роутер на основное приложение.

**How it works:**

- Создают его через `express.Router()`, затем вызывают `.get`, `.post` и `.use` так же, как у приложения.
- `app.use("/users", userRouter)` добавляет префикс `/users` каждому маршруту этого роутера.
- Middleware роутера выполняется только для запросов под этим префиксом.
- Большой API делится на роутер на ресурс и всё равно живёт в одном процессе и на одном сервере.

**Examples:**

```js
const users = express.Router();
users.get("/:id", (req, res) => {
  res.json({ id: req.params.id });
});
app.use("/users", users);
```

**Sources:**

- [Express — express.Router](https://expressjs.com/en/5x/api.html#express.router)
</details>

<details>
<summary>How do you handle 404 errors in Express.js?</summary>

### How do you handle 404 errors in Express.js?

**Definition:**

Express сам не отправляет 404, если ни один маршрут не совпал. После настоящих маршрутов ставят запасное middleware, и этот промах можно передать в общий обработчик ошибок.

**How it works:**

- Middleware без пути ставят после всех маршрутов. Если выполнение дошло до него, ответ ещё никто не закончил, поэтому отправляют 404.
- Чтобы переиспользовать один формат ошибки, создают ошибку со `status` 404 и вызывают `next(err)`.
- Middleware ошибок — функция с четырьмя аргументами, смонтированная последней. Она читает `err.status` и отправляет тело.
- Брошенная внутри маршрута ошибка не попадёт туда сама, пока её не передадут в `next` или не обернут вызов.

**Examples:**

```js
app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});
```

**Sources:**

- [Express — Error handling](https://expressjs.com/en/guide/error-handling.html)
</details>

<details>
<summary>What are the differences between req.query and req.params?</summary>

### What are the differences between req.query and req.params?

**Definition:**

`req.params` берётся из именованных кусков шаблона маршрута. `req.query` берётся из query string после `?`. Одинаковое имя может означать разные вещи.

**How it works:**

- Маршрут `/users/:id` заполняет `req.params.id` из `/users/42`.
- URL `/users/42?verbose=1` дополнительно заполняет `req.query.verbose`.
- Оба значения — строки (или массивы для повторённых ключей query), пока их не преобразуют.
- Ни один из объектов не содержит JSON-тело. Это `req.body`, и только после парсера.
- В Express 5 удалён `req.param()`, который раньше искал сразу в params, body и query.

**Examples:**

```js
app.get("/users/:id", (req, res) => {
  res.json({ id: req.params.id, verbose: req.query.verbose === "1" });
});
```

**Sources:**

- [Express — Request](https://expressjs.com/en/5x/api.html#req.params)
</details>

<details>
<summary>Describe the purpose of req.body and how you would access it.</summary>

### Describe the purpose of req.body and how you would access it.

**Definition:**

`req.body` — разобранное тело запроса. Оно остаётся пустым, пока middleware не прочитает сырой поток и не запишет результат.

**How it works:**

- `express.json()` разбирает `Content-Type: application/json`. Это обычный путь для POST и PUT API.
- `express.urlencoded({ extended: true })` разбирает отправку HTML-формы (`application/x-www-form-urlencoded`).
- Без парсера байты остаются в потоке запроса, а `req.body` равен `undefined`.
- Загрузка файлов идёт как `multipart/form-data` и нуждается в парсере этого типа. JSON-парсер такое тело не заполнит.
- Монтируйте парсер до маршрутов, которые читают `req.body`.

**Examples:**

```js
app.use(express.json());
app.post("/notes", (req, res) => {
  const { title } = req.body;
  res.status(201).json({ title });
});
```

**Sources:**

- [Express — req.body](https://expressjs.com/en/5x/api.html#req.body)
</details>

<details>
<summary>How do you create a middleware that logs the request method and URL for every request?</summary>

### How do you create a middleware that logs the request method and URL for every request?

**Definition:**

Логгер запроса — middleware, смонтированное до маршрутов. Оно записывает метод и URL, затем вызывает `next()`, чтобы остальной стек выполнился.

**How it works:**

- Читают `req.method` и `req.originalUrl`. `originalUrl` сохраняет путь и query, которые прислал клиент, включая префикс роутера.
- Монтирование через `app.use` без пути означает запуск для каждого дошедшего запроса.
- Без `next()` запрос не продолжится.
- Боевой логгер ещё слушает событие `finish` у ответа, чтобы записать статус и длительность после обработчика.

**Examples:**

```js
app.use((req, res, next) => {
  const started = Date.now();
  res.on("finish", () => {
    console.log(req.method, req.originalUrl, res.statusCode, Date.now() - started);
  });
  next();
});
```

**Sources:**

- [Express — Writing middleware](https://expressjs.com/en/guide/writing-middleware.html)
</details>

<details>
<summary>Explain how you would implement nested routes in Express.js.</summary>

### Explain how you would implement nested routes in Express.js.

**Definition:**

</details>

<details>
<summary>How can you capture and respond to URL parameters in a route?</summary>

### How can you capture and respond to URL parameters in a route?

**Definition:**

</details>

<details>
<summary>How do you serve different content types (e.g., JSON, HTML) with Express.js responses?</summary>

### How do you serve different content types (e.g., JSON, HTML) with Express.js responses?

**Definition:**

</details>

<details>
<summary>What are best practices for structuring a large Express.js application with multiple routes?</summary>

### What are best practices for structuring a large Express.js application with multiple routes?

**Definition:**

</details>


### Middleware and Error Handling

<details>
<summary>Explain the concept and use of built-in middleware in Express.js.</summary>

### Explain the concept and use of built-in middleware in Express.js.

**Definition:**

</details>

<details>
<summary>How do you write custom middleware functions in Express.js?</summary>

### How do you write custom middleware functions in Express.js?

**Definition:**

</details>

<details>
<summary>How do you handle file uploads in Express.js?</summary>

### How do you handle file uploads in Express.js?

**Definition:**

</details>

<details>
<summary>What is express-session, and how would you use it?</summary>

### What is express-session, and how would you use it?

**Definition:**

</details>

<details>
<summary>Discuss error handling in an Express.js application. How do you define an error-handling middleware?</summary>

### Discuss error handling in an Express.js application. How do you define an error-handling middleware?

**Definition:**

</details>

<details>
<summary>Provide an example of using third-party middleware, such as body-parser or morgan.</summary>

### Provide an example of using third-party middleware, such as body-parser or morgan.

**Definition:**

</details>

<details>
<summary>How do you protect against SQL injection or other security threats in Express.js?</summary>

### How do you protect against SQL injection or other security threats in Express.js?

**Definition:**

</details>


### Response and Performance

<details>
<summary>How would you implement caching in an Express.js application?</summary>

### How would you implement caching in an Express.js application?

**Definition:**

</details>

<details>
<summary>How do you set cookies and get cookies in an Express.js application?</summary>

### How do you set cookies and get cookies in an Express.js application?

**Definition:**

</details>

<details>
<summary>What are ways to improve the performance of Express.js applications?</summary>

### What are ways to improve the performance of Express.js applications?

**Definition:**

</details>

<details>
<summary>How do you configure an Express.js app for a reverse proxy, like Nginx?</summary>

### How do you configure an Express.js app for a reverse proxy, like Nginx?

**Definition:**

</details>

<details>
<summary>Explain the purpose of template engines. How would you integrate one with Express.js?</summary>

### Explain the purpose of template engines. How would you integrate one with Express.js?

**Definition:**

</details>


### Testing and Debugging

<details>
<summary>How do you test an Express.js application?</summary>

### How do you test an Express.js application?

**Definition:**

</details>

<details>
<summary>Discuss common debugging techniques for Express.js applications.</summary>

### Discuss common debugging techniques for Express.js applications.

**Definition:**

</details>

<details>
<summary>What is the role of environment variables in an Express.js application?</summary>

### What is the role of environment variables in an Express.js application?

**Definition:**

</details>

<details>
<summary>How do you use a debugger with an Express.js app running in Node.js?</summary>

### How do you use a debugger with an Express.js app running in Node.js?

**Definition:**

</details>


### Express.js with Databases

<details>
<summary>How would you connect a MongoDB database with an Express.js application?</summary>

### How would you connect a MongoDB database with an Express.js application?

**Definition:**

</details>

<details>
<summary>Explain how to integrate an ORM like Sequelize with Express.js.</summary>

### Explain how to integrate an ORM like Sequelize with Express.js.

**Definition:**

</details>

<details>
<summary>How do you handle database errors in Express.js?</summary>

### How do you handle database errors in Express.js?

**Definition:**

</details>

<details>
<summary>What are the advantages of using a database pooling mechanism in an Express.js app?</summary>

### What are the advantages of using a database pooling mechanism in an Express.js app?

**Definition:**

</details>


### Authentication and Authorization

<details>
<summary>Describe how you would implement user authentication in Express.js.</summary>

### Describe how you would implement user authentication in Express.js.

**Definition:**

</details>

<details>
<summary>Explain how sessions are managed in Express.js.</summary>

### Explain how sessions are managed in Express.js.

**Definition:**

</details>

<details>
<summary>Discuss how you would handle user roles and permissions in an Express.js application.</summary>

### Discuss how you would handle user roles and permissions in an Express.js application.

**Definition:**

</details>

<details>
<summary>How can you secure passwords and sensitive information in your Express.js app?</summary>

### How can you secure passwords and sensitive information in your Express.js app?

**Definition:**

</details>


### Integration and Configuration

<details>
<summary>How do you integrate a third-party API in an Express.js application?</summary>

### How do you integrate a third-party API in an Express.js application?

**Definition:**

</details>

<details>
<summary>Explain the steps to deploy an Express.js application to a cloud provider like AWS or Heroku.</summary>

### Explain the steps to deploy an Express.js application to a cloud provider like AWS or Heroku.

**Definition:**

</details>

<details>
<summary>How can you ensure that your Express.js application is scalable?</summary>

### How can you ensure that your Express.js application is scalable?

**Definition:**

</details>

<details>
<summary>What is the Twelve-Factor App methodology, and how does it apply to Express.js?</summary>

### What is the Twelve-Factor App methodology, and how does it apply to Express.js?

**Definition:**

</details>


### Coding Challenges

<details>
<summary>Write an Express.js middleware function that limits requests to 100 per hour per IP address.</summary>

### Write an Express.js middleware function that limits requests to 100 per hour per IP address.

**Definition:**

</details>

<details>
<summary>Create an Express.js route that accepts a JSON payload and responds with the same payload in reverse order.</summary>

### Create an Express.js route that accepts a JSON payload and responds with the same payload in reverse order.

**Definition:**

</details>

<details>
<summary>Develop a simple REST API with Express.js that includes CRUD operations for managing books. Include route definitions and handler functions that interact with a placeholder data store.</summary>

### Develop a simple REST API with Express.js that includes CRUD operations for managing books. Include route definitions and handler functions that interact with a placeholder data store.

**Definition:**

</details>


### Advanced Topics and Best Practices

<details>
<summary>Discuss strategies for building a real-time application with Express.js.</summary>

### Discuss strategies for building a real-time application with Express.js.

**Definition:**

</details>

<details>
<summary>What are some common optimization techniques for Express.js applications?</summary>

### What are some common optimization techniques for Express.js applications?

**Definition:**

</details>

<details>
<summary>Explain the concept and benefits of server-side rendering with Express.js and a templating engine.</summary>

### Explain the concept and benefits of server-side rendering with Express.js and a templating engine.

**Definition:**

</details>

<details>
<summary>How do you ensure that your Express.js code is maintainable and follows best practices?</summary>

### How do you ensure that your Express.js code is maintainable and follows best practices?

**Definition:**

</details>


### Case Studies and Scenario-Based Questions

<details>
<summary>How would you structure an Express.js application for a large-scale e-commerce platform?</summary>

### How would you structure an Express.js application for a large-scale e-commerce platform?

**Definition:**

</details>

<details>
<summary>Describe the key considerations for building a secure API with Express.js.</summary>

### Describe the key considerations for building a secure API with Express.js.

**Definition:**

</details>

<details>
<summary>Discuss how to handle session management in a distributed Express.js application.</summary>

### Discuss how to handle session management in a distributed Express.js application.

**Definition:**

</details>

<details>
<summary>What are the implications of microservices architecture for an Express.js application?</summary>

### What are the implications of microservices architecture for an Express.js application?

**Definition:**

</details>
