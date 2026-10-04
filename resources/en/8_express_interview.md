# Express.js — Interview

Answers are filled for the published subset; the rest are still empty.

[← Back to hub](./8_nodejs.md)

### Related docs

- [Node.js — HTTP](./8_nodejs_http.md) · [Express.js — Interview](./8_express_interview.md) · [Node.js — Interview](./8_nodejs_interview.md)

### Sections

- [Interview Practice](#interview-practice)

---

## Interview Practice

Questions from [Devinterview.io — Express.js](https://devinterview.io/questions/web-and-mobile-development/express-interview-questions/).

### Express.js Fundamentals

<details>
<summary>What is Express.js, and how does it relate to Node.js?</summary>

### What is Express.js, and how does it relate to Node.js?

**Definition:**

Express is a small routing and middleware layer on Node’s HTTP server. Node runs the JavaScript and owns the sockets; Express decides which functions see each request and how the response is written.

**How it works:**

- `express()` returns an application. `app.listen` starts an `http.Server` and feeds every request through the middleware stack.
- Middleware is a function of `(req, res, next)` that can log, parse, or end the response.
- Method helpers (`get`, `post`, `put`, `delete`, and the rest) bind a path to one or more handlers.
- A template engine can render HTML. JSON APIs usually call `res.json` and skip templates.
- An error handler is middleware with four parameters, `(err, req, res, next)`, and runs only when something calls `next(err)`.

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

Middleware is the ordered list of functions a request walks through before, or instead of, a route handler. Each function may change `req` or `res`, finish the response, or pass control onward.

**How it works:**

- The signature is `(req, res, next)`. Calling `next()` runs the next match. Calling `next(err)` jumps to error middleware.
- Application-level middleware is mounted with `app.use` and sees every request that reaches that point, or only a path prefix.
- Router-level middleware is attached to an `express.Router` and runs only for routes on that router.
- Built-ins include `express.json()`, `express.urlencoded()`, and `express.static()`.
- Error-handling middleware is declared with four arguments and is skipped by a normal `next()` call.
- A function that neither responds nor calls `next()` leaves the client waiting.

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

A basic app is a Node project that depends on Express, creates an application, registers at least one route, and listens on a port.

**How it works:**

- Initialize the project with `npm init` and install the framework with `npm install express`.
- In the entry file, call `express()`, add a route, and call `app.listen(port)`.
- Start it with `node app.js`. During development, `node --watch` restarts the process when files change.
- Put shared setup (body parsing, logging) in `app.use` before the routes that need it.

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

`app.use` registers middleware, a router, or a sub-app. Without a path it matches every request that reaches it; with a path it matches that prefix.

**How it works:**

- Global middleware, such as a logger, is mounted with no path and runs for every request that gets that far.
- Path-scoped middleware runs only when the URL starts with that prefix, which is how CORS or auth can cover `/api` alone.
- Typical mounts are body parsers, `cors`, `express.static`, and request logging.
- The same method mounts a router: `app.use("/api", apiRouter)`.
- Order is the behavior. Parsers and loggers go before routes; a fallback 404 goes after them.
- The call returns the app, so mounts can be chained.

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

`express.static` maps a URL path onto files in a directory and sends the file when one exists. If nothing matches, it calls `next()` so later routes still run.

**How it works:**

- `app.use(express.static("public"))` serves `public/app.js` at `/app.js`.
- A mount path adds a prefix: `app.use("/assets", express.static("public"))` serves the same file at `/assets/app.js`.
- It is meant for images, HTML, CSS, JavaScript, fonts, and other files you are willing to publish. It does not run templates or query a database.
- Options such as `maxAge`, `index`, and `dotfiles` control caching, the directory index, and whether hidden files are sent.
- Point it only at a directory that is safe to expose.

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

`app.get` handles GET requests, which read a resource. `app.post` handles POST requests, which submit a body and often change server state. The same path can register both.

**How it works:**

- GET inputs usually travel in the path or the query string, so they show up in the URL, logs, and history. Responses may be cached.
- POST inputs travel in the body (JSON, a form, or a file). The URL stays stable while the payload can be large or sensitive.
- A browser navigation or a link issues GET. A form or `fetch` issues POST when that method is set.
- Keep GET free of side effects so a prefetch or a retry does not create a second order.
- POST is not idempotent by itself. Repeating it can create a second resource unless you add your own idempotency key.

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

A GET request carries data in the path and in the query string, not in a body. Express puts named path segments on `req.params` and the query string on `req.query`.

**How it works:**

- A pattern such as `/users/:id` captures `123` from `/users/123` as `req.params.id`.
- Pairs after `?` become `req.query`. `/users?role=admin&page=2` yields `req.query.role` and `req.query.page`.
- Values arrive as strings, or as arrays when a key is repeated, until you convert them.
- In Express 4, a `*` segment could swallow the rest of the path. Express 5 names that wildcard, as in `/{*rest}`.
- `req.param()` was removed in Express 5. Read `req.params`, `req.query`, or `req.body` explicitly.

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

A route handler is the function Express calls for one HTTP method and path. It reads the request and sends the response, or it calls `next()` so a later function can.

**How it works:**

- Register it with `app.get`, `app.post`, `app.put`, `app.delete`, or the matching method on a router.
- You can pass several functions. An earlier one checks auth and calls `next()`; the last one sends the body.
- `app.use` is middleware, not a method-specific handler. It runs for every method that matches its path.
- A handler that neither sends a response nor calls `next()` never finishes the request.

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

CORS is how a browser decides whether a page on one origin may read a response from another. Express allows it by setting response headers, usually through the `cors` package or by hand.

**How it works:**

- The browser sends a preflight `OPTIONS` request when the real call is not a simple request. That preflight must succeed before the POST or PUT runs.
- `app.use(cors({ origin: "https://app.example" }))` sets `Access-Control-Allow-Origin` and answers the preflight.
- A manual setup sets `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and `Access-Control-Allow-Headers`, and ends `OPTIONS` with 204.
- Reflecting every `Origin` together with `Access-Control-Allow-Credentials: true` is invalid. List the origins you trust when cookies are sent.
- Mount the middleware before the routes it should cover.

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

`next` is the callback that moves a request along the middleware stack. Calling it means this step is finished and the next match should run.

**How it works:**

- `next()` with no argument continues to the next middleware or route.
- `next(err)` skips ordinary handlers and lands in error middleware with four parameters.
- `next("route")` skips the rest of the current route’s handler chain and tries the next route.
- If a middleware does not call `next` and does not send a response, the request stalls.
- Error middleware itself calls `next(err)` only when it wants a later error handler to take over.

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

`express.Router()` is a mini application: its own middleware and routes, without its own TCP port. You group related endpoints in a module and mount that router on the main app.

**How it works:**

- Create it with `express.Router()`, then call `.get`, `.post`, and `.use` on it the same way as on the app.
- `app.use("/users", userRouter)` prefixes every route in that router with `/users`.
- Middleware on the router runs only for requests under that prefix.
- A large API splits into one router per resource and still shares one process and one server.

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

Express does not send 404 by itself when no route matches. You add a fallback middleware after the real routes, and you can forward that miss into the shared error handler.

**How it works:**

- Place a middleware with no path after every route. If execution reaches it, nothing else ended the response, so send 404.
- To reuse one error shape, create an error with `status` 404 and call `next(err)`.
- The error middleware is a four-argument function mounted last. It reads `err.status` and sends the body.
- A thrown error inside a route does not automatically hit that middleware unless you pass it to `next` or use a wrapper that does.

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

`req.params` comes from named pieces of the route pattern. `req.query` comes from the query string after `?`. They can share a name and still mean different things.

**How it works:**

- The route `/users/:id` fills `req.params.id` from `/users/42`.
- The URL `/users/42?verbose=1` also fills `req.query.verbose`.
- Both values are strings (or arrays for repeated query keys) until you convert them.
- Neither object holds the JSON body. That is `req.body`, and only after a parser runs.
- Express 5 removed `req.param()`, which used to search params, body, and query in one call.

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

`req.body` is the parsed request body. It stays empty until middleware reads the raw stream and assigns the result.

**How it works:**

- `express.json()` parses `Content-Type: application/json` and is what a POST or PUT API usually needs.
- `express.urlencoded({ extended: true })` parses HTML form posts (`application/x-www-form-urlencoded`).
- Without a parser, the bytes stay on the request stream and `req.body` is undefined.
- File uploads use `multipart/form-data` and need a parser built for that type. The JSON parser will not fill `req.body` for them.
- Mount the parser before the routes that read `req.body`.

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

A request logger is middleware mounted before the routes. It records the method and URL, then calls `next()` so the rest of the stack still runs.

**How it works:**

- Read `req.method` and `req.originalUrl`. `originalUrl` keeps the path and query the client sent, including any router prefix.
- Because it is mounted with `app.use` and no path, it runs for every request that reaches it.
- Call `next()` or the request never continues.
- A production logger also listens for the response `finish` event so it can record status and duration after the handler completes.

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
