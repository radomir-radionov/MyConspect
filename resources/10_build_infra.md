# Build — Infra

Delivery architecture, Nginx, brokers, and DX tools.

[← Back to hub](./10_build.md)

### Related docs

* [Build — CI](./10_build_ci.md) · [Build — Bundlers](./10_build_bundlers.md) · [Build — Docker](./10_build_docker.md) · [Build — Infra](./10_build_infra.md) · [Build — Interview](./10_build_interview.md)

### Sections

- [Architecture](#architecture)
- [Infrastructure](#infrastructure)
- [Developer experience](#developer-experience)

---

## Architecture

<details>
  <summary>Monolith vs microservices</summary>

### Monolith vs microservices

**Definition:**

| | Monolith | Microservices |
|---|----------|---------------|
| **Structure** | Single deployable unit | Independent services per domain |
| **Deployment** | All-or-nothing | Per-service deploy |
| **Scaling** | Scale entire app | Scale individual services |
| **Data** | Shared database (usually) | Database per service |
| **Team** | One team, one codebase | Teams per service |

**When to use:**

| Choose monolith | Choose microservices |
|-----------------|---------------------|
| Startup / MVP | Large org, many teams |
| Small team (< 10 devs) | Clear domain boundaries |
| Unclear domain boundaries | Different scaling needs per service |
| Speed of iteration matters most | Mature DevOps / platform team exists |

**Pluses and minuses:**

| + | − |
|------|------|
| Simple to develop and deploy initially | Grows complex; tight coupling |
| Easy local debugging | Single point of failure |
| No network latency between modules | Scaling is all-or-nothing |
| Transactions across modules are easy | Deploy risk increases with size |

| + | − |
|------|------|
| Independent deploy and scale | Distributed system complexity |
| Technology diversity per service | Network latency, partial failures |
| Team autonomy | Data consistency challenges (sagas, events) |
| Fault isolation | Operational overhead (observability, CI/CD × N) |

**Thoughts:**

Start monolith, extract services when boundaries are clear and pain is real — not preemptively. "Microservices" without observability (tracing, logging, metrics) is a distributed monolith nightmare.

---

**Sources:** [ByteByteGo — Microservices](https://blog.bytebytego.com/p/a-beginners-guide-to-microservices)

</details>

<a name="infrastructure"></a>

## Infrastructure

<details>
  <summary>Nginx</summary>

### Nginx

**Definition:** High-performance web server, reverse proxy, load balancer, and HTTP cache.

**When to use:** Serve static SPA builds, reverse proxy to Node/Go APIs, TLS termination, load balance across app instances.

**Pluses and minuses:**

| + | − |
|------|------|
| Extremely fast static file serving | Config syntax is unique |
| Reverse proxy to upstream apps | SSL termination config can be tricky |
| Load balancing, rate limiting | Not a replacement for app-level auth |
| Low memory footprint | |

**Examples:**

```nginx
server {
  listen 80;
  server_name example.com;

  # Serve SPA static files
  location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
  }

  # Proxy API requests
  location /api/ {
    proxy_pass http://api:4000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

**Thoughts:** `try_files ... /index.html` is required for client-side routing SPAs. In production, terminate TLS at Nginx or a cloud load balancer, not in Node. What a web server is (HTTP, modules, gzip) → [6_web_api.md — Web server](./6_web_api_http.md#web-server). Full config / `reload` vs `restart` / FastCGI → [15_devops.md — Nginx configuration](./15_devops.md#nginx-configuration). Apache (`.htaccess`, `Require`) → [15_devops.md — Apache](./15_devops.md#apache-http-server).

**Sources:** [nginx.org](https://nginx.org/)

</details>

<details>
  <summary>Redis</summary>

### Redis

**Definition:** In-memory data store used as database, cache, session store, message broker, and streaming engine.

**When to use:** Session storage, API response caching, rate limiting, pub/sub, leaderboards, real-time features.

**Pluses and minuses:**

| + | − |
|------|------|
| Sub-millisecond latency | Data loss risk without persistence config |
| Versatile (cache, pub/sub, queues) | Memory-bound — expensive at scale |
| Simple key-value API | Not a replacement for a primary database |
| TTL-based expiration | Cluster mode adds complexity |

**Examples:**

```js
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

// Cache with TTL
await redis.set('user:123', JSON.stringify(user), { EX: 300 });
const cached = await redis.get('user:123');
```

**Thoughts:** Always set TTL on cache keys. Use Redis for ephemeral data; Postgres/MySQL for source of truth. Enable AOF/RDB persistence if data must survive restarts.

**Sources:** [redis.io](https://redis.io/)

</details>

<details>
  <summary>Message broker</summary>

### Message broker

**Definition:** Software intermediary that routes messages between producers and consumers — enabling asynchronous, decoupled communication.

**When to use:** Microservices communication, background job processing, event-driven systems, fan-out notifications.

**Pluses and minuses:**

| + | − |
|------|------|
| Decouples services | Added infrastructure complexity |
| Handles traffic spikes (buffering) | Message ordering guarantees vary |
| Enables event-driven architecture | Debugging async flows is harder |
| Reliable delivery with persistence | Operational overhead |

**Thoughts:** Prefer a message broker when you need guaranteed delivery, buffering, or multiple consumers. Use direct HTTP for synchronous request/response with simple coupling.

**Sources:** [RabbitMQ tutorials](https://www.rabbitmq.com/tutorials)

</details>

<details>
  <summary>RabbitMQ</summary>

### RabbitMQ

**Definition:**

Open-source message broker implementing AMQP. Routes messages from producers to consumers via exchanges and queues.

| Concept | Definition |
|---------|------------|
| **Producer** | Sends messages to an exchange |
| **Exchange** | Routes messages to queues by rules (direct, fanout, topic, headers) |
| **Queue** | Buffer holding messages until consumed |
| **Binding** | Link between exchange and queue with routing key |
| **Consumer** | Subscribes to a queue and processes messages |

**When to use:** Task queues, event broadcasting, work distribution, reliable async processing.

**Pluses and minuses:**

| + | − |
|------|------|
| Mature, battle-tested | Erlang-based — niche ops knowledge |
| Flexible routing (4 exchange types) | Slower than Redis pub/sub for simple cases |
| Message acknowledgment & durability | Clustering setup is non-trivial |
| Management UI | |

**Examples:**

```js
import amqp from 'amqplib';

const conn = await amqp.connect(process.env.RABBITMQ_URL);
const channel = await conn.createChannel();
await channel.assertQueue('tasks', { durable: true });

// Producer
channel.sendToQueue('tasks', Buffer.from(JSON.stringify({ job: 'send-email' })), {
  persistent: true,
});

// Consumer
channel.consume('tasks', (msg) => {
  const data = JSON.parse(msg.content.toString());
  console.log('Processing:', data);
  channel.ack(msg);
});
```

**Thoughts:** Use `durable: true` queues and `persistent: true` messages for reliability. Dead-letter exchanges (DLX) handle poison messages.

**Sources:** [rabbitmq.com](https://www.rabbitmq.com/)

</details>

<details>
  <summary>Kafka vs RabbitMQ vs BullMQ</summary>

### Kafka vs RabbitMQ vs BullMQ

**Definition:**

Three ways to decouple producers from consumers. Pick by **delivery model**, not by hype.

| | RabbitMQ | Kafka | BullMQ |
|---|----------|-------|--------|
| Model | Queue + exchange (messages disappear when acked) | Append-only log (consumers have offsets) | Redis lists/streams as a Node job queue |
| Fan-out | Exchanges (fanout/topic) | Consumer groups + partitions | Repeatable jobs / queues per name |
| Replay | Poor (message gone) | First-class (rewind offset) | Limited |
| Throughput | Thousands–tens of k msg/s | Hundreds of k+ | Fine for typical Node jobs |
| Ops | Erlang broker | Cluster, disk, partition key | Redis you already run |

**When to use:** Email/worker jobs → BullMQ. Complex routing + ack → RabbitMQ. Event log many teams consume at their own pace → Kafka. AWS managed: SQS ≈ queue, Kinesis/MSK ≈ log.

**Pluses and minuses:**

| + | − |
|------|------|
| Rabbit: flexible routing, ack/nack | Not a replay log |
| Kafka: replay, huge throughput, event sourcing | Operationally heavy; not a simple task queue |
| BullMQ: tiny ops if Redis exists | Redis is the SPOF unless clustered |

**Thoughts:** Queue = consume and forget. Log = consume and remember (offset).

**Sources:** [Kafka intro](https://kafka.apache.org/intro) · [BullMQ](https://docs.bullmq.io/)

</details>

<a name="developer-experience"></a>

## Developer experience

<details>
  <summary>Storybook</summary>

### Storybook

**Definition:** Open-source tool for developing, documenting, and testing UI components in isolation — outside the main application.

**When to use:** Design systems, component libraries, teams with designers reviewing UI states.

**Pluses and minuses:**

| + | − |
|------|------|
| Develop components without running full app | Maintenance overhead (stories drift from code) |
| Visual documentation for design system | Separate build config |
| Interaction testing with `@storybook/test` | Can slow CI if not parallelized |
| Chromatic integration for visual regression | |

**Examples:**

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary', children: 'Click me' } };
export const Disabled: Story = { args: { variant: 'primary', children: 'Disabled', disabled: true } };
```

**Thoughts:** Integrate Storybook build into CI to catch broken stories. Use Chromatic or Lost Pixel for visual regression. Co-locate stories with components (`Button.stories.tsx` next to `Button.tsx`).

**Sources:** [storybook.js.org](https://storybook.js.org/)

</details>

<details>
  <summary>OpenAPI / Swagger</summary>

### OpenAPI / Swagger

**Definition:** OpenAPI Specification (OAS) is a machine-readable format for describing REST API endpoints. Swagger is the tooling ecosystem (UI, Editor, Codegen) built around OAS.

**When to use:** REST APIs with multiple consumers, frontend/backend team separation, public APIs.

**Pluses and minuses:**

| + | − |
|------|------|
| Single source of truth for API contract | Spec can drift from implementation |
| Auto-generated docs (Swagger UI) | Codegen output needs cleanup |
| Client SDK generation | Not ideal for non-REST protocols (GraphQL, gRPC) |
| Contract testing between frontend/backend | |

**Examples:**

```yaml
# openapi.yaml
openapi: 3.1.0
info:
  title: User API
  version: 1.0.0
paths:
  /users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      properties:
        id: { type: string }
        name: { type: string }
```

```bash
# Generate TypeScript client
npx openapi-typescript openapi.yaml -o src/api/schema.d.ts
```

**Thoughts:** Generate types from the spec, don't hand-write API types. Validate server responses against the spec in integration tests. Swagger UI is for exploration; OpenAPI spec is the contract.

**Sources:**

[swagger.io/specification](https://swagger.io/specification/)

---

</details>

<a name="interview-practice"></a>

<details>
  <summary>Interview Practice</summary>

### Interview Practice

Questions from [0_interview.md](0_interview.md). Try answering before opening solutions.

### Question index

| Topic | Answer |
|-------|--------|
| What is CI/CD | Q&A |
| CI vs CD | Q&A |
| YAML vs JSON | Q&A |
| Webpack vs Vite | Q&A |
| Tree shaking | Q&A |
| Docker layers | Q&A |
| Docker storage (volumes vs bind vs tmpfs) | Q&A |
| CMD vs ENTRYPOINT | Q&A |
| Docker container lifecycle | Q&A |
| Docker Compose | Q&A |
| Lockfiles | Q&A |

---
