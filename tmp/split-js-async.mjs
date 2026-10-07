import fs from "node:fs";
import path from "node:path";

const TOPICS = [
  {
    file: "3_js_async_event_loop.md",
    title: "Event Loop",
    intro:
      "Call stack, microtasks vs macrotasks, execution order, and `queueMicrotask` / `process.nextTick`.",
    related:
      "- [JS Callbacks](./3_js_async_callbacks.md) · [JS Promises](./3_js_async_promises.md) · [JS Async/Await](./3_js_async_await.md) · [JS Async APIs](./3_js_async_apis.md)\n- [JS Language](./3_js_core.md) · [Memory: stack and heap](./3_js_variables.md#memory-stack-heap) · [Node.js](./8_nodejs.md) · [JS Interview](./3_js_interview.md)",
    mainConcepts:
      "| **Runtime** | Call stack, microtasks, macrotasks, execution order |\n| **Node** | `queueMicrotask`, `process.nextTick` |",
    sections:
      "- [Event loop](#event-loop)\n- [queueMicrotask & process.nextTick](#queuemicrotask-processnexttick)",
    ranges: [
      {
        start: "## Event loop",
        end: '<a name="callbacks-async-patterns"></a>',
      },
      {
        start: "## queueMicrotask & process.nextTick",
        end: '<a name="unhandled-promise-rejections"></a>',
      },
    ],
  },
  {
    file: "3_js_async_callbacks.md",
    title: "Callbacks",
    intro:
      "Synchronous vs asynchronous execution, callbacks, side effects, AJAX, and comparing callback vs promise vs async/await patterns.",
    related:
      "- [JS Event Loop](./3_js_async_event_loop.md) · [JS Promises](./3_js_async_promises.md) · [JS Async/Await](./3_js_async_await.md) · [JS Async APIs](./3_js_async_apis.md)\n- [JS Functions](./3_js_functions.md) · [Web API — CORS](./6_web_api_security.md#cors) · [JS Interview](./3_js_interview.md)",
    mainConcepts:
      "| **Patterns** | Sync vs async, callbacks, AJAX |\n| **Practice** | Side effects, callback vs promise vs async/await |",
    sections: "- [Callbacks & async patterns](#callbacks-async-patterns)",
    ranges: [
      {
        start: "## Callbacks & async patterns",
        end: '<a name="promises"></a>',
      },
    ],
  },
  {
    file: "3_js_async_promises.md",
    title: "Promises",
    intro:
      "Promise basics, chaining, static methods, promisification, error handling, unhandled rejections, and `Promise.withResolvers`.",
    related:
      "- [JS Event Loop](./3_js_async_event_loop.md) · [JS Callbacks](./3_js_async_callbacks.md) · [JS Async/Await](./3_js_async_await.md) · [JS Async APIs](./3_js_async_apis.md)\n- [JS Interview](./3_js_interview.md)",
    mainConcepts:
      "| **Core** | States, chaining, static methods, promisification |\n| **Errors** | `try/catch` with promises, unhandled rejections |\n| **Modern** | `Promise.withResolvers` |",
    sections:
      "- [Promises](#promises)\n- [Unhandled promise rejections](#unhandled-promise-rejections)\n- [Promise.withResolvers](#promisewithresolvers)",
    ranges: [
      { start: "## Promises", end: '<a name="async-await"></a>' },
      {
        start: "## Unhandled promise rejections",
        end: '<a name="top-level-await"></a>',
      },
      {
        start: "## Promise.withResolvers",
        end: '<a name="asyncawait-tasks-and-concurrency-model"></a>',
      },
    ],
  },
  {
    file: "3_js_async_await.md",
    title: "Async / Await",
    intro:
      "`async`/`await` basics, parallel vs sequential flows, async iterators, top-level await, and the concurrency model (tasks, workers).",
    related:
      "- [JS Event Loop](./3_js_async_event_loop.md) · [JS Promises](./3_js_async_promises.md) · [JS Async APIs](./3_js_async_apis.md)\n- [Web Workers](./6_web_api_performance.md#web-workers) · [Node worker_threads](./8_nodejs_core.md#worker_threads) · [JS Interview](./3_js_interview.md)",
    mainConcepts:
      "| **Syntax** | `async`/`await`, parallel vs sequential, async iterators |\n| **Modules** | Top-level await |\n| **Model** | Microtasks, macrotasks, workers vs main thread |",
    sections:
      "- [Async / await](#async-await)\n- [Top-level await](#top-level-await)\n- [Async/await, tasks, and concurrency model](#asyncawait-tasks-and-concurrency-model)",
    ranges: [
      {
        start: "## Async / await",
        end: "<details>\n  <summary>AbortController</summary>",
      },
      {
        start: "## Top-level await",
        end: '<a name="promisewithresolvers"></a>',
      },
      {
        start: '<a name="asyncawait-tasks-and-concurrency-model"></a>',
        end: '<a name="practice"></a>',
      },
    ],
  },
  {
    file: "3_js_async_apis.md",
    title: "Async APIs",
    intro:
      "Timers, `fetch` helpers, `AbortController`, `requestIdleCallback`, and JSON response parsing.",
    related:
      "- [JS Event Loop](./3_js_async_event_loop.md) · [JS Async/Await](./3_js_async_await.md) · [JSON](./3_js_variables.md#json)\n- [HTTP — Fetch & AbortController](./6_web_api_http.md#fetch-api-abortcontroller-and-formdata) · [JS Interview](./3_js_interview.md)",
    mainConcepts:
      "| **Browser** | Timers, `AbortController`, `requestIdleCallback` |\n| **Data** | `res.json()` and JSON pointers |",
    sections:
      "- [AbortController](#abortcontroller)\n- [Related APIs](#related-apis)",
    ranges: [
      {
        start: "<details>\n  <summary>AbortController</summary>",
        end: '<a name="related-apis"></a>',
        prefix: '<a name="abortcontroller"></a>\n\n## AbortController\n\n',
      },
      {
        start: "## Related APIs",
        end: '<a name="queuemicrotask-processnexttick"></a>',
      },
    ],
  },
];

function findIndex(lines, marker, from = 0) {
  if (marker.includes("\n")) {
    const needle = marker.split("\n");
    for (let i = from; i <= lines.length - needle.length; i++) {
      const match = needle.every((part, offset) => lines[i + offset] === part);
      if (match) {
        return i;
      }
    }
    throw new Error(`Marker not found: ${marker}`);
  }
  const idx = lines.findIndex((line, i) => i >= from && line.trim() === marker);
  if (idx === -1) {
    throw new Error(`Marker not found: ${marker}`);
  }
  return idx;
}

function extractRange(lines, { start, end, prefix = "" }) {
  const startIdx = findIndex(lines, start);
  const endIdx = end ? findIndex(lines, end, startIdx + 1) : lines.length;
  const chunk = lines.slice(startIdx, endIdx).join("\n").trim();
  return `${prefix}${chunk}`.trim();
}

function buildHeader(topic) {
  return `# JS ${topic.title} — ${topic.intro.split(".")[0]}

${topic.intro}

### Related docs

${topic.related}

[← Back to JS hub](./3_js.md) · [Async hub](./3_js_async.md)

### Main concepts

| Area | Topics |
| ---- | ------ |
${topic.mainConcepts}

### Sections

${topic.sections}

Each topic: **Definition** · **How it works** · **When to use** · **Pluses and minuses** · **Examples** · **Thoughts** · **Sources**.

---

`;
}

function buildHub() {
  return `# JS Async — hub

Event loop, callbacks, promises, \`async/await\`, and related browser APIs. Theory is split across the Async topics below. Interview questions live in [Interview](./3_js_interview.md).

### Related docs

- [JS Language](./3_js_core.md) · [JS Functions](./3_js_functions.md) · [JS Document](./3_js_browser.md)
- [Web API](./6_web_api.md) · [Node.js](./8_nodejs.md) · [JS — Interview](./3_js_interview.md)

[← Back to JS hub](./3_js.md)

### Navigation

| Topic | File |
| ----- | ---- |
| Event Loop | [event loop](./3_js_async_event_loop.md) |
| Callbacks | [callbacks](./3_js_async_callbacks.md) |
| Promises | [promises](./3_js_async_promises.md) |
| Async / Await | [async/await](./3_js_async_await.md) |
| Async APIs | [APIs](./3_js_async_apis.md) |
| Interview | [questions](./3_js_interview.md) |

### Main concepts

| Area | Topics |
| ---- | ------ |
| **Runtime** | [Event loop](./3_js_async_event_loop.md), microtasks, macrotasks |
| **Patterns** | [Callbacks](./3_js_async_callbacks.md), [promises](./3_js_async_promises.md), [\`async/await\`](./3_js_async_await.md) |
| **APIs** | [Timers, fetch, AbortController](./3_js_async_apis.md) |
`;
}

function splitLocale(localeDir) {
  const sourcePath = path.join(localeDir, "3_js_async.md");
  const lines = fs.readFileSync(sourcePath, "utf8").split("\n");

  for (const topic of TOPICS) {
    const body = topic.ranges
      .map((range) => extractRange(lines, range))
      .join("\n\n");
    const footer =
      "\n\nInterview Q&A and coding tasks live in [JS — Interview](./3_js_interview.md).\n";
    fs.writeFileSync(
      path.join(localeDir, topic.file),
      buildHeader(topic) + body + footer + "\n",
    );
  }

  fs.writeFileSync(path.join(localeDir, "3_js_async.md"), buildHub());
}

for (const locale of ["en", "ru"]) {
  splitLocale(path.join("resources", locale));
}

console.log("Split complete for en and ru");
